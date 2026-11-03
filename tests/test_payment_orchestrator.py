import uuid
import pytest
from datetime import datetime, timedelta
from decimal import Decimal
from unittest.mock import MagicMock
from fastapi import HTTPException

from backend.app.models.customer import CustomerPaymentMethod, PaymentConsent, ConsentStatus, PaymentMethodStatus
from backend.app.models.debt import Debt, ScheduledPayment, PaymentTransaction, PaymentTransactionStatus
from backend.app.services.payment.payment_orchestrator import PaymentOrchestrator
from backend.app.services.payment.mock_sandbox_provider import SandboxTestProvider, LicensedBankProvider
from backend.app.services.payment.provider_interface import FailureCategory

def test_consent_validation_rules():
    db_mock = MagicMock()
    customer_id = uuid.uuid4()
    payment_method_id = uuid.uuid4()
    consent_id = uuid.uuid4()

    mock_consent = MagicMock()
    mock_consent.id = consent_id
    mock_consent.customer_id = customer_id
    mock_consent.status = ConsentStatus.ACTIVE.value
    mock_consent.payment_method_id = payment_method_id
    mock_consent.currency = "UZS"
    mock_consent.valid_until = datetime.utcnow() + timedelta(days=5)
    mock_consent.max_amount = Decimal("1000000.00")

    db_mock.query.return_value.filter.return_value.first.return_value = mock_consent

    # Valid charge within consent limits
    consent = PaymentOrchestrator.validate_consent(
        db=db_mock,
        customer_id=customer_id,
        payment_method_id=payment_method_id,
        consent_id=consent_id,
        amount=Decimal("500000.00"),
        currency="UZS",
    )
    assert consent is not None

    # Amount exceeds consent max_amount (600,000 > 500,000 limit)
    mock_consent.max_amount = Decimal("500000.00")
    with pytest.raises(HTTPException) as exc:
        PaymentOrchestrator.validate_consent(
            db=db_mock,
            customer_id=customer_id,
            payment_method_id=payment_method_id,
            consent_id=consent_id,
            amount=Decimal("600000.00"),
            currency="UZS",
        )
    assert exc.value.status_code == 400
    assert "CONSENT_AMOUNT_EXCEEDED" in exc.value.detail

def test_sandbox_provider_charge_success():
    provider = SandboxTestProvider()
    res = provider.charge_token(
        payment_method_ref="token_uzcard_123",
        consent_ref="mandate_456",
        amount=Decimal("250000.00"),
        currency="UZS",
        idempotency_key="idemp_test_001",
    )
    assert res.success is True
    assert res.transaction_reference is not None
    assert "SANDBOX-TX" in res.transaction_reference
