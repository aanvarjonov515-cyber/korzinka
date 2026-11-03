# ProfitLeak — Audit Action Registry

This document lists all standard and reserved action codes stored in the immutable Audit Journal. Action codes follow the `CATEGORY.ENTITY.OPERATION` naming convention.

| Action Code | Category | Risk Level | Description |
|---|---|---|---|
| `AUTH.LOGIN.SUCCESS` | `AUTH` | Low | Successful user authentication |
| `AUTH.LOGIN.FAILED` | `AUTH` | Medium | Unsuccessful login attempt (also recorded in Security Events) |
| `AUTH.LOGOUT` | `AUTH` | Low | Explicit user session termination |
| `AUTH.SESSION.REVOKED` | `AUTH` | Medium | Session terminated by user from another device |
| `AUTH.SESSION.ADMIN_REVOKED`| `AUTH` | High | Session terminated by administrative override |
| `AUTH.PASSWORD.CHANGED` | `AUTH` | High | User password change |
| `AUTH.PASSWORD_RESET.REQUESTED`| `AUTH` | High | Password recovery flow initiated |
| `AUTH.ACCOUNT.LOCKED` | `AUTH` | High | Temporary lockout due to brute-force protection |
| `USER.CREATED` | `USER` | High | New user account provisioned |
| `USER.UPDATED` | `USER` | Medium | Profile details or contact updated |
| `USER.DISABLED` | `USER` | High | User account disabled |
| `ROLE.ASSIGNED` | `ROLE` | Critical | New role granted to a user |
| `ROLE.REVOKED` | `ROLE` | Critical | Role removed from a user |
| `PERMISSION.ADDED` | `PERMISSION` | Critical | Permission attached to role definition |
| `PERMISSION.REMOVED` | `PERMISSION` | Critical | Permission detached from role definition |
| `CUSTOMER.CREATED` | `CUSTOMER` | Low | New customer registered |
| `CUSTOMER.UPDATED` | `CUSTOMER` | Low | Customer information updated |
| `CUSTOMER.SENSITIVE_DATA.VIEWED` | `CUSTOMER` | High | Employee viewed unmasked identity credentials |
| `CUSTOMER.EXPORT` | `CUSTOMER` | Critical | Batch customer list exported |
| `SALE.COMPLETED` | `SALES` | Low | Transaction completed at POS cash register |
| `SALE.REFUND.REQUESTED` | `SALES` | Medium | Return/refund initiated by cashier |
| `SALE.REFUND.APPROVED` | `SALES` | High | Return/refund approved by branch manager |
| `PAYMENT.SCHEDULED` | `PAYMENT` | Medium | Deferred payment scheduled (1 min - 20 days) |
| `PAYMENT.ATTEMPTED` | `PAYMENT` | Medium | Tokenized payment provider charge initiated |
| `PAYMENT.SUCCESS` | `PAYMENT` | Low | Payment confirmation recorded |
| `PAYMENT.FAILED` | `PAYMENT` | Medium | Payment provider charge failure |
| `PAYMENT.REFUNDED` | `PAYMENT` | High | Funds reversed to customer card/method |
| `CONSENT.CREATED` | `PAYMENT` | High | Payment mandate / direct debit consent granted |
| `CONSENT.REVOKED` | `PAYMENT` | High | Payment consent revoked by customer or admin |
| `INVENTORY.ADJUSTED` | `INVENTORY` | High | Stock write-off, count correction, or shrinkage record |
| `INVENTORY.TRANSFER.REQUESTED`| `INVENTORY` | Low | Inter-branch inventory transfer proposed |
| `INVENTORY.TRANSFER.APPROVED` | `INVENTORY` | Medium | Inter-branch inventory transfer executed |
| `SECURITY.ACTION.REQUESTED` | `SECURITY` | High | Automated or operator proposed mitigation |
| `SECURITY.ACTION.EXECUTED` | `SECURITY` | Critical | Safe security rule executed (e.g., temporary IP block) |
| `API_KEY.CREATED` | `SECURITY` | Critical | New API credentials issued |
| `API_KEY.ROTATED` | `SECURITY` | Critical | API key re-issued |
| `API_KEY.REVOKED` | `SECURITY` | Critical | API key invalidated |
| `AUDIT.INTEGRITY.FAILURE` | `SECURITY` | Critical | Hash chain corruption or database tampering detected |
| `AI.RECOMMENDATION.CREATED` | `AI` | Low | Agent generated actionable insight |
| `AI.ACTION.REQUESTED` | `AI` | Medium | Agent requested human approval for execution |
| `AI.ACTION.APPROVED` | `AI` | High | Operator approved AI proposal |
| `AI.ACTION.REJECTED` | `AI` | Low | Operator dismissed AI proposal |
| `AI.ACTION.EXECUTED` | `AI` | Medium | Approved AI proposal executed by system |
| `AI.ACTION.FAILED` | `AI` | High | Execution of approved AI action failed |
| `BOT.USER.LINKED` | `INTEGRATION`| Medium | Telegram account linked to employee profile |
| `BOT.USER.UNLINKED` | `INTEGRATION`| Medium | Telegram account unlinked |
| `BOT.ACTION.DENIED` | `INTEGRATION`| Medium | Telegram bot command rejected due to lacking RBAC |
