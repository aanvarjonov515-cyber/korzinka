# ProfitLeak — Audit System & Immutable Activity Logging

## 1. Overview & Separation of Concerns

ProfitLeak maintains strict boundaries between three distinct logging and telemetry layers:
1. **Application Logs**: Ephemeral diagnostic telemetry, execution times, uncaught exceptions, internal worker latency, and service connectivity.
2. **Security Events**: Telemetry capturing security anomalies, failed authentication attempts, brute-force patterns, rate-limit triggers, cross-tenant unauthorized attempts, and SSRF blocks.
3. **Audit Journal**: Non-repudiable, permanent, tamper-evident record of all human, system, AI, and service business actions.

---

## 2. Core Audit Principles

- **No Updates, No Deletions**: The `audit_logs` table has NO UPDATE and NO DELETE operations supported anywhere in application repositories or APIs.
- **Cryptographic Hash Chaining**: Every audit entry stores the `previous_hash` of the prior tenant entry and a SHA-256 `entry_hash` computed over canonical JSON representation of the entry's fields. Any retroactive database tampering immediately breaks the chain validation.
- **Sanitization & Redaction**: Passwords, hashes, authentication tokens, API secrets, private keys, payment card PANs, CVVs, PINs, and customer sensitive identifiers (PINFL/JShShIR) are automatically redacted prior to persistence.
- **Tenant & Branch Isolation**: Every audit entry is strictly bound to its `tenant_id` and optional `branch_id`. Cross-tenant queries are blocked at the repository level.
- **Actor Attributions**:
  - `USER`: Human employee (Cashier, Manager, Admin, Owner)
  - `AI_AGENT`: Collection AI, Security AI, Procurement AI, Supervisor AI
  - `SYSTEM`: Background scheduler, reconciliation runner, automated ledger close
  - `SERVICE`: Microservice or internal component
  - `WEBHOOK`: Inbound payment or messaging provider event
  - `WORKER`: Asynchronous job execution
  - `API_KEY`: External ERP/B2B integration caller

---

## 3. High-Risk Action Fail-Closed Policy

For high-risk operations (such as role assignment changes, sensitive customer data reveal, large refunds, API key rotations, and emergency security locks), the audit record must be written atomically. If the audit persistence layer encounters an error, the operation is rolled back and aborted (Fail-Closed).

---

## 4. Tamper-Evident Verification

The integrity checker can be invoked on-demand via the Admin API (`POST /api/v1/admin/audit/verify`) or via background CLI:
```bash
python -m scripts.verify_audit_chain --tenant-id <TENANT_UUID> --limit 1000
```
It computes each entry's expected canonical hash and checks that `previous_hash` corresponds to the preceding record. If any modification occurs directly in the database, the check halts and raises an `AUDIT.INTEGRITY.FAILURE` Security Event.
