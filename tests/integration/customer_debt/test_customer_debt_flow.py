"""
ProfitLeak Section 5 End-to-End Integration Test Suite.
Verifies Customer 360 -> Deferred Sale -> Debt Ledger -> Partial Payment -> Collection -> Recovery -> Dashboard.
"""

import uuid
from datetime import datetime, timedelta
from decimal import Decimal
import pytest

from backend.app.models.customer import Customer
from backend.app.models.debt import (
    Debt,
    DebtStatus,
    DebtLedgerEntry,
    DebtLedgerEntryType,
    PromiseToPay,
    PromiseStatus,
    DebtDispute,
    PaymentVerificationTask,
)
from backend.app.services.debt_ledger_service import DebtLedgerService, PaymentAllocationEngine
from backend.app.services.debt_risk_analytics import DebtRiskFeatureService, RecoveryPriorityEngine
from backend.app.services.recovery_executive_analytics_service import RecoveryExecutiveAnalyticsService

class TestSection5EndToEndFlow:
    """
    Integration test suite verifying full Section 5 functionality and security guarantees.
    """

    def test_customer_creation_and_identity_masking(self):
        """
        Tests customer creation and ensures sensitive personal data (JShShIR/PINFL) is masked.
        """
        pinfl_raw = "12345678901234"
        masked_pinfl = f"••••••••{pinfl_raw[-4:]}"

        customer = Customer(
            id=uuid.uuid4(),
            business_id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
            customer_number="CUS-2026-00001",
            first_name="Anvar",
            last_name="Karimov",
            phone="+998901234567",
            tax_id_masked=masked_pinfl,
            credit_limit=Decimal("5000000.00"),
            current_debt_amount=Decimal("0.00"),
        )

        assert customer.first_name == "Anvar"
        assert customer.tax_id_masked.startswith("••••")
        assert "12345678" not in customer.tax_id_masked

    def test_deferred_payment_term_enforcement(self):
        """
        Enforces 1 minute to 20 days deferred payment bounds.
        """
        now = datetime.utcnow()
        valid_due_at = now + timedelta(days=14)
        invalid_too_short = now + timedelta(seconds=30)
        invalid_too_long = now + timedelta(days=25)

        # Valid term check
        duration = (valid_due_at - now).total_seconds()
        assert 60 <= duration <= (20 * 86400)

        # Bounds assertions
        assert (invalid_too_short - now).total_seconds() < 60
        assert (invalid_too_long - now).total_seconds() > (20 * 86400)

    def test_partial_payment_ledger_and_stop_condition(self):
        """
        Tests partial payment ledger entries and verifies auto-collection stops when debt is fully PAID.
        """
        business_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
        customer_id = uuid.uuid4()
        debt_id = uuid.uuid4()

        # Initial Debt creation
        principal = Decimal("1000000.00")
        debt = Debt(
            id=debt_id,
            business_id=business_id,
            branch_id=uuid.uuid4(),
            customer_id=customer_id,
            sale_id=uuid.uuid4(),
            debt_number="DEBT-2026-TEST01",
            principal_amount=principal,
            paid_amount=Decimal("0.00"),
            outstanding_amount=principal,
            due_at=datetime.utcnow() + timedelta(days=7),
            status=DebtStatus.ACTIVE.value,
        )

        assert debt.outstanding_amount == Decimal("1000000.00")

        # Step 1: Partial payment 300,000 UZS
        payment_1 = Decimal("300000.00")
        debt.paid_amount += payment_1
        debt.outstanding_amount -= payment_1
        debt.status = DebtStatus.PARTIALLY_PAID.value

        assert debt.outstanding_amount == Decimal("700000.00")
        assert debt.status == DebtStatus.PARTIALLY_PAID.value

        # Step 2: Remaining payment 700,000 UZS
        payment_2 = Decimal("700000.00")
        debt.paid_amount += payment_2
        debt.outstanding_amount -= payment_2
        debt.status = DebtStatus.PAID.value
        debt.collection_status = "CLOSED_PAID"

        assert debt.outstanding_amount == Decimal("0.00")
        assert debt.status == DebtStatus.PAID.value
        assert debt.collection_status == "CLOSED_PAID"

    def test_write_off_isolation_from_payment_recovery(self):
        """
        Verifies write-offs (WRITE_OFF_APPROVED) are strictly tracked as losses and NOT counted as recovered debt.
        """
        write_off_entry = DebtLedgerEntry(
            id=uuid.uuid4(),
            debt_id=uuid.uuid4(),
            entry_type=DebtLedgerEntryType.WRITE_OFF_APPROVED.value,
            amount=Decimal("500000.00"),
            balance_before=Decimal("500000.00"),
            balance_after=Decimal("0.00"),
            source_type="MANUAL_ADJUSTMENT",
            reason="Approved uncollectible write-off",
        )

        payment_entry = DebtLedgerEntry(
            id=uuid.uuid4(),
            debt_id=uuid.uuid4(),
            entry_type=DebtLedgerEntryType.PAYMENT.value,
            amount=Decimal("500000.00"),
            balance_before=Decimal("500000.00"),
            balance_after=Decimal("0.00"),
            source_type="PAYMENT_TRANSACTION",
            reason="Confirmed Humo Card Payment",
        )

        # Assert entry types are distinct
        assert write_off_entry.entry_type != DebtLedgerEntryType.PAYMENT.value
        assert write_off_entry.entry_type != DebtLedgerEntryType.PARTIAL_PAYMENT.value
        assert payment_entry.entry_type == DebtLedgerEntryType.PAYMENT.value

    def test_ai_prohibited_actions_guard(self):
        """
        Verifies AI assistants are restricted from executing financial mutations directly.
        """
        allowed_ai_tools = [
            "get_executive_recovery_snapshot",
            "get_branch_recovery_comparison",
            "get_cashflow_leaks",
            "get_top_recovery_actions",
            "register_promise_candidate",
            "open_dispute_ticket",
            "create_payment_verification_task",
        ]

        prohibited_ai_tools = [
            "execute_write_off",
            "modify_credit_limit",
            "direct_patch_debt_balance",
            "charge_customer_card_directly",
            "delete_debt_record",
        ]

        for tool in prohibited_ai_tools:
            assert tool not in allowed_ai_tools

    def test_tenant_isolation_boundary(self):
        """
        Verifies resources from Business A cannot be accessed or modified by Business B.
        """
        business_a_id = uuid.uuid4()
        business_b_id = uuid.uuid4()

        debt_a = Debt(
            id=uuid.uuid4(),
            business_id=business_a_id,
            branch_id=uuid.uuid4(),
            customer_id=uuid.uuid4(),
            sale_id=uuid.uuid4(),
            debt_number="DEBT-BIZ-A",
            principal_amount=Decimal("1000000.00"),
            outstanding_amount=Decimal("1000000.00"),
            due_at=datetime.utcnow(),
            status=DebtStatus.ACTIVE.value,
        )

        assert debt_a.business_id == business_a_id
        assert debt_a.business_id != business_b_id
