# ProfitLeak Platform Admin Audit Center & Redaction Policy

## 1. Universal Audit Invariant
Every administrative action performed in the Platform Control Plane is logged in the append-only `audit_logs` journal with cryptographic entry hashing (`entry_hash` chained with `previous_hash`).

Platform administrators cannot delete, overwrite, or truncate audit records through any UI or API endpoint.

---

## 2. Comprehensive Audit Record Schema
Each administrative audit entry contains:
- **WHO**: Operator ID, Display Name, Assigned Platform Role.
- **WHAT**: Exact operation code (e.g. `SUSPEND_TENANT`, `GRANT_SUPPORT_ACCESS`).
- **WHEN**: UTC timestamp with microsecond precision.
- **ORIGIN**: Source IP, Device ID, and User-Agent.
- **TARGET**: Affected Tenant ID, Entity Type, and Entity Code.
- **BEFORE & AFTER**: Full JSON state delta.
- **REASON**: Mandatory business justification supplied by the operator.
- **RESULT**: `SUCCESS`, `DENIED`, or `FAILED`.

---

## 3. Sensitive Data Redaction
Before persisting or displaying Before/After diffs, the `PlatformSecurityService.redact_sensitive_data` pipeline masks credentials (`token`, `password`, `secret`, `private_key`, `api_key`). Secrets are replaced with masked indicators (`sk_live...789`), preventing credential leakage even within internal security audits.
