# ProfitLeak Backup & Disaster Recovery Architecture

## 1. Principles of Reliable Disaster Recovery
In ProfitLeak, **Backup Success $\ne$ Restorable Backup**. A backup is only deemed certified once it has completed programmatic verification testing.

---

## 2. Backup Tiers & Schedules
- **Database Snapshots**: Incremental WAL archiving every 15 minutes; full point-in-time snapshot daily at 02:00 UTC.
- **Object Storage Snapshots**: Daily encrypted snapshot of documents, receipts, and media attachments.
- **System Configuration**: Cryptographic backup of feature flags, migration states, and operational runbooks.

---

## 3. High-Risk Restore Protocol
Database restoration is an operation of the highest consequence. Executing a restore requires:
1. **Multi-Person Signoff**: At least two authorized platform administrators.
2. **Mandatory Step-Up MFA**: Cryptographic re-authentication.
3. **Impact Preview**: Displaying exact target database cluster, affected tenants, and expected downtime.
4. **Maintenance Mode Locking**: The affected cluster is locked to read-only mode during restoration.
5. **Post-Restore Integrity Validation**: Verification queries executed before reopening customer traffic.
