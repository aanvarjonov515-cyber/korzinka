import uuid
from decimal import Decimal
import pytest

from backend.app.core.security.product_validators import (
    BarcodeValidator,
    SkuNormalizer,
    MxikValidator,
    PriceValidator,
)
from backend.app.models.product import (
    Product,
    ProductCategory,
    ProductStatus,
    ProductType,
)
from backend.app.services.product_service import CategoryService

def test_sku_normalization():
    raw_sku = "  milk  3.2%  1l  "
    normalized = SkuNormalizer.normalize(raw_sku)
    assert normalized == "MILK-3.2-1L"

    with pytest.raises(ValueError):
        SkuNormalizer.normalize("   ")

def test_barcode_validation():
    # Valid EAN-13 (Musaffo milk style)
    valid_ean13 = "4780001234567"
    # Check checksum logic
    is_valid, bc, err = BarcodeValidator.normalize_and_validate("5449000000996") # Coca-Cola valid EAN-13
    assert is_valid is True
    assert bc == "5449000000996"

    # Invalid length barcode
    is_valid, _, err = BarcodeValidator.normalize_and_validate("12")
    assert is_valid is False
    assert "between 3 and 48" in err

    # Valid Code128 internal scale format
    is_valid, bc, _ = BarcodeValidator.normalize_and_validate("2000001000008")
    assert is_valid is True
    assert bc == "2000001000008"

def test_mxik_validation():
    # Valid 17-digit MXIK
    valid_mxik = "01111001001000000"
    is_valid, err = MxikValidator.validate(valid_mxik)
    assert is_valid is True
    assert err is None

    # Invalid MXIK: letters or incorrect length
    invalid_mxik = "01111001001A"
    is_valid, err = MxikValidator.validate(invalid_mxik)
    assert is_valid is False
    assert "17 numerical digits" in err

def test_price_decimal_validation():
    # Negative price must be rejected
    with pytest.raises(ValueError):
        PriceValidator.validate(Decimal("-100.00"), "Purchase Price")

    # Precision quantized to 2 decimal places
    valid_price = PriceValidator.validate(Decimal("12500.555"), "Selling Price")
    assert valid_price == Decimal("12500.56")

def test_product_model_structure_no_stock_columns():
    """CRITICAL: Product master catalog must NOT store physical stock quantities."""
    product_columns = [c.name for c in Product.__table__.columns]
    assert "stock_quantity" not in product_columns
    assert "reserved_quantity" not in product_columns
    assert "damaged_quantity" not in product_columns
    assert "in_transit_quantity" not in product_columns
    assert "sku" in product_columns
    assert "barcode" in product_columns
    assert "business_id" in product_columns
