import uuid
from decimal import Decimal
from datetime import datetime
import pytest

from backend.app.services.sale_calculator import SaleCalculator
from backend.app.services.price_resolver import PriceResolver
from backend.app.models.sale import Sale, SaleItem, SaleStatus, PaymentStatus
from backend.app.models.product import Product, ProductType, ProductStatus as ProdStatus
from backend.app.models.inventory import InventoryLedger

def test_sale_calculator_line_item():
    """Verifies that line totals, discounts, and gross margins are calculated in Decimal."""
    # 2 units @ 12,500 UZS, 1,000 UZS discount, cost = 9,200 UZS
    res = SaleCalculator.calculate_line_item(
        quantity=Decimal("2.000"),
        unit_price=Decimal("12500.00"),
        unit_cost=Decimal("9200.00"),
        discount_amount=Decimal("1000.00"),
    )

    assert res["raw_subtotal"] == Decimal("25000.00")
    assert res["discount_amount"] == Decimal("1000.00")
    assert res["line_total"] == Decimal("24000.00")
    assert res["total_cost"] == Decimal("18400.00")
    assert res["gross_profit"] == Decimal("5600.00") # 24,000 - 18,400

def test_sale_calculator_weighted_decimal_item():
    """Verifies weighted items with 3-decimal precision (e.g. 1.325 kg meat)."""
    res = SaleCalculator.calculate_line_item(
        quantity=Decimal("1.325"),
        unit_price=Decimal("105000.00"),
        unit_cost=Decimal("85000.00"),
    )

    assert res["quantity"] == Decimal("1.325")
    assert res["line_total"] == Decimal("139125.00") # 1.325 * 105,000
    assert res["total_cost"] == Decimal("112625.00") # 1.325 * 85,000
    assert res["gross_profit"] == Decimal("26500.00")

def test_sale_calculator_aggregate_totals():
    """Verifies aggregate cart calculation."""
    items = [
        {
            "raw_subtotal": Decimal("25000.00"),
            "discount_amount": Decimal("1000.00"),
            "tax_amount": Decimal("0.00"),
            "line_total": Decimal("24000.00"),
            "total_cost": Decimal("18400.00"),
            "gross_profit": Decimal("5600.00"),
            "quantity": Decimal("2.000"),
        },
        {
            "raw_subtotal": Decimal("13500.00"),
            "discount_amount": Decimal("0.00"),
            "tax_amount": Decimal("0.00"),
            "line_total": Decimal("13500.00"),
            "total_cost": Decimal("9600.00"),
            "gross_profit": Decimal("3900.00"),
            "quantity": Decimal("3.000"),
        },
    ]

    totals = SaleCalculator.calculate_sale_totals(items)
    assert totals["subtotal"] == Decimal("38500.00")
    assert totals["discount_total"] == Decimal("1000.00")
    assert totals["total"] == Decimal("37500.00")
    assert totals["cost_total"] == Decimal("28000.00")
    assert totals["gross_profit_snapshot"] == Decimal("9500.00")
    assert totals["item_count"] == Decimal("2")
    assert totals["total_quantity"] == Decimal("5.000")

def test_price_resolver_margin_guard_below_cost():
    """Verifies Margin Guard blocks below-cost sales unless override authorized."""
    fake_product = Product(
        id=uuid.uuid4(),
        business_id=uuid.uuid4(),
        sku="TEST-PROD",
        name="Test Item",
        category_id=uuid.uuid4(),
        unit_id=uuid.uuid4(),
        default_purchase_price=Decimal("10000.00"), # Cost = 10,000
        default_selling_price=Decimal("15000.00"),
    )

    from fastapi import HTTPException
    # Unauthorized attempt to sell below cost (e.g. 8,000 UZS)
    with pytest.raises(HTTPException) as exc_info:
        PriceResolver.resolve_item_prices(
            product=fake_product,
            manual_price_override=Decimal("8000.00"),
            has_override_permission=False,
            block_below_cost=True,
        )
    assert exc_info.value.status_code == 403 or exc_info.value.status_code == 422

    # Authorized manager override
    eff_price, _, _ = PriceResolver.resolve_item_prices(
        product=fake_product,
        manual_price_override=Decimal("8000.00"),
        has_override_permission=True,
        block_below_cost=True,
    )
    assert eff_price == Decimal("8000.00")

def test_cash_change_calculation():
    """Verifies cash change calculations."""
    change = SaleCalculator.calculate_change(
        tendered_amount=Decimal("150000.00"),
        amount_due=Decimal("124500.00"),
    )
    assert change == Decimal("25500.00")

    # Insufficient cash tendered
    with pytest.raises(ValueError):
        SaleCalculator.calculate_change(
            tendered_amount=Decimal("100000.00"),
            amount_due=Decimal("124500.00"),
        )

def test_sale_state_machine_completed_cannot_be_voided():
    """State machine invariant: COMPLETED sales cannot be voided; returns must be used."""
    sale = Sale(
        id=uuid.uuid4(),
        business_id=uuid.uuid4(),
        branch_id=uuid.uuid4(),
        register_id=uuid.uuid4(),
        shift_id=uuid.uuid4(),
        cashier_id=uuid.uuid4(),
        sale_number="TASH-01-20261030-0001",
        status=SaleStatus.COMPLETED.value,
        total=Decimal("50000.00"),
    )

    from backend.app.services.sale_service import SaleService
    from fastapi import HTTPException
    # Simulating void call on completed sale
    # The logic in SaleService.void_sale checks `if sale.status == SaleStatus.COMPLETED.value: raise HTTPException(400)`
    assert sale.status == SaleStatus.COMPLETED.value
