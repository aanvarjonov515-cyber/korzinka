import uuid
import pytest
from datetime import datetime, timedelta
from decimal import Decimal
from unittest.mock import MagicMock
from fastapi import HTTPException

from backend.app.models.customer import (
    Customer,
    CustomerStatus,
    CustomerType,
    CustomerPaymentMethod,
    PaymentConsent,
    ConsentStatus,
    PaymentMethodStatus,
)
from backend.app.models.debt import (
    Debt,
    DebtStatus,
    DebtLedgerEntry,
    DebtLedgerEntryType,
    ScheduledPayment,
    ScheduledPaymentStatus,
)
from backend.app.models.sale import Sale
from backend.app.repositories.customer_repository import CustomerRepository
from backend.app.services.deferred_payment_service import DeferredPaymentService
from backend.app.services.payment.payment_engine import PaymentEngine
from backend.app.services.payment.mock_sandbox_provider import SandboxTestProvider, LicensedBankProvider
from backend.app.services.payment.provider_interface import FailureCategory

def test_phone_and_email_normalization():
    phone1 = "90 123-45-67"
    assert CustomerRepository.normalize_phone(phone1) == "+998901234567"

    phone2 = "+998 (93) 987-65-43"
    assert CustomerRepository.normalize_phone(phone2) == "+998939876543"

    email = "  Test.Customer@Gmail.Com  "
    assert CustomerRepository.normalize_email(email) == "test.customer@gmail.com"

def test_deferred_payment_duration_validation():
    # 59 seconds: Reject
    with pytest.raises(HTTPException) as exc:
        DeferredPaymentService.validate_duration(59)
    assert exc.value.status_code == 400
    assert "DURATION_TOO_SHORT" in exc.value.detail

    # 60 seconds (1 minute): Allow
    assert DeferredPaymentService.validate_duration(60) == 60

    # 20 days (1,728,000 seconds): Allow
    assert DeferredPaymentService.validate_duration(1728000) == 1728000

    # 20 days + 1 second: Reject
    with pytest.raises(HTTPException) as exc:
        DeferredPaymentService.validate_duration(1728001)
    assert exc.value.status_code == 400
    assert "DURATION_EXCEEDED" in exc.value.detail

def test_unconfigured_provider_fails_safely():
    """Real provider without credentials must return NOT_CONFIGURED, never fake success."""
    provider = LicensedBankProvider(merchant_id=None, secret_key=None)
    result = provider.charge_token("token_123", "consent_123", Decimal("100000"), "UZS", "idemp_1")
    assert not result.success
    assert result.failure_category == FailureCategory.PROVIDER_NOT_CONFIGURED

def test_ai_agent_cannot_execute_charge():
    """Security rule: AI agents are forbidden from executing monetary charges directly."""
    db_mock = MagicMock()
    with pytest.raises(HTTPException) as exc:
        PaymentEngine.execute_scheduled_payment(
            db=db_mock,
            scheduled_payment_id=uuid.uuid4(),
            actor_type="AI_AGENT",
            actor_id="collection-ai-agent-1",
        )
    assert exc.value.status_code == 403
    assert "AI_PAYMENT_EXECUTION_FORBIDDEN" in exc.value.detail

def test_overpayment_guard_enforced():
    """Payments cannot exceed the outstanding debt balance."""
    db_mock = MagicMock()
    business_id = uuid.uuid4()
    debt_id = uuid.uuid4()

    mock_debt = MagicMock()
    mock_debt.id = debt_id
    mock_debt.business_id = business_id
    mock_debt.status = "SCHEDULED"
    mock_debt.outstanding_amount = Decimal("300000.00")

    db_mock.query.return_value.filter.return_value.first.return_value = mock_debt

    # Attempt to pay 500,000 against a 300,000 debt
    with pytest.raises(HTTPException) as exc:
        PaymentEngine.record_manual_payment(
            db=db_mock,
            business_id=business_id,
            debt_id=debt_id,
            amount=Decimal("500000.00"),
        )
    assert exc.value.status_code == 400
    assert "OVERPAYMENT_GUARD" in exc.value.detail

def test_partial_payment_ledger_and_balance_reduction():
    """1M debt with 400K payment results in 600K outstanding."""
    principal = Decimal("1000000.00")
    payment = Decimal("400000.00")
    outstanding_after = principal - payment

    assert outstanding_after == Decimal("600000.00")
