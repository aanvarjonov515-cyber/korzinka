import uuid
from datetime import datetime
import pytest

from backend.app.core.security.audit_sanitizer import AuditSanitizer
from backend.app.core.security.audit_hasher import AuditHasher
from backend.app.core.audit_actions import AuditAction
from backend.app.models.audit import ActorType, AuditResult, AuditCategory

def test_audit_sanitizer_redaction():
    """Verifies passwords, tokens, API keys, CVV, and PIN are completely redacted."""
    dirty_payload = {
        "username": "cashier1",
        "password": "SuperSecretPassword123!",
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy",
        "api_key": "pl_live_secretkey9988",
        "card": {
            "card_number": "8600123456789012",
            "cvv": "123",
            "pin": "0000",
        },
        "pinfl": "12345678901234",
    }

    clean = AuditSanitizer.sanitize(dirty_payload)

    assert clean["password"] == "[REDACTED]"
    assert clean["access_token"] == "[REDACTED]"
    assert clean["api_key"] == "[REDACTED]"
    assert clean["card"]["card_number"] == "[REDACTED]"
    assert clean["card"]["cvv"] == "[REDACTED]"
    assert clean["card"]["pin"] == "[REDACTED]"
    assert clean["pinfl"] == "******1234"
    assert clean["username"] == "cashier1"

def test_audit_hash_chain_computation_and_verification():
    """Verifies that sequential SHA-256 blocks form a valid tamper-evident hash chain."""
    tenant_id = str(uuid.uuid4())
    genesis_hash = "GENESIS_BLOCK_00000000000000000000000000000000"

    # Block 1
    event_id_1 = str(uuid.uuid4())
    time_1 = datetime.utcnow().isoformat()
    hash_1 = AuditHasher.compute_entry_hash(
        event_id=event_id_1,
        created_at_iso=time_1,
        tenant_id=tenant_id,
        actor_type=ActorType.USER.value,
        actor_id="admin",
        action=AuditAction.ROLE_ASSIGNED.value,
        category=AuditCategory.ROLE.value,
        resource_type="user_role",
        resource_id="user_123",
        result=AuditResult.SUCCESS.value,
        before_data={"role": "CASHIER"},
        after_data={"role": "BRANCH_MANAGER"},
        metadata_json={"order": "HR-01"},
        previous_hash=genesis_hash,
    )

    entry_1 = {
        "event_id": event_id_1,
        "created_at": time_1,
        "tenant_id": tenant_id,
        "actor_type": ActorType.USER.value,
        "actor_id": "admin",
        "action": AuditAction.ROLE_ASSIGNED.value,
        "category": AuditCategory.ROLE.value,
        "resource_type": "user_role",
        "resource_id": "user_123",
        "result": AuditResult.SUCCESS.value,
        "before_data": {"role": "CASHIER"},
        "after_data": {"role": "BRANCH_MANAGER"},
        "metadata_json": {"order": "HR-01"},
        "previous_hash": genesis_hash,
        "entry_hash": hash_1,
    }

    assert AuditHasher.verify_entry(entry_1, genesis_hash) is True

    # Block 2 chaining to Block 1
    event_id_2 = str(uuid.uuid4())
    time_2 = datetime.utcnow().isoformat()
    hash_2 = AuditHasher.compute_entry_hash(
        event_id=event_id_2,
        created_at_iso=time_2,
        tenant_id=tenant_id,
        actor_type=ActorType.SYSTEM.value,
        actor_id="DefenseService",
        action=AuditAction.SECURITY_ACTION_EXECUTED.value,
        category=AuditCategory.SECURITY.value,
        resource_type="ip",
        resource_id="185.220.101.45",
        result=AuditResult.SUCCESS.value,
        before_data=None,
        after_data={"status": "BLOCKED"},
        metadata_json=None,
        previous_hash=hash_1,
    )

    entry_2 = {
        "event_id": event_id_2,
        "created_at": time_2,
        "tenant_id": tenant_id,
        "actor_type": ActorType.SYSTEM.value,
        "actor_id": "DefenseService",
        "action": AuditAction.SECURITY_ACTION_EXECUTED.value,
        "category": AuditCategory.SECURITY.value,
        "resource_type": "ip",
        "resource_id": "185.220.101.45",
        "result": AuditResult.SUCCESS.value,
        "before_data": None,
        "after_data": {"status": "BLOCKED"},
        "metadata_json": None,
        "previous_hash": hash_1,
        "entry_hash": hash_2,
    }

    assert AuditHasher.verify_entry(entry_2, hash_1) is True

    # Tampering test: modify entry 1 data retroactively
    tampered_entry_1 = entry_1.copy()
    tampered_entry_1["after_data"] = {"role": "OWNER"} # Unauthorized escalation
    assert AuditHasher.verify_entry(tampered_entry_1, genesis_hash) is False
