# ProfitLeak Event-Driven Architecture & Outbox Pattern

## 1. Asynchronous Decoupling via Domain Events
ProfitLeak uses an event-driven architecture to connect operational triggers with diagnostic engines, AI supervisors, and Action Center workflows without tight coupling or distributed locks.

---

## 2. Core 12 Domain Events

| Event Type | Producer Service | Primary Subscribers | Business Objective |
|---|---|---|---|
| `SaleCreated` | POS / Checkout Engine | Inventory Ledger, Financial State, Tax Engine | Decrement stock, record revenue, compute VAT |
| `PaymentReceived` | Cashier / Payment Gateway | Debt Ledger, Treasury Cashflow | Update customer balance, record cash inflow |
| `DebtOverdue` | Scheduled Ledger Watcher | Collection AI, Action Center | Dispatch reminder, review credit limits |
| `GoodsReceiptPosted` | Warehouse / Receiving | Inventory Ledger, Payable Ledger, True Cost | Record stock arrival, create supplier AP |
| `SupplierPriceChanged`| Procurement Engine | True Cost Engine, Procurement AI | Detect margin erosion, trigger vendor comparison |
| `InvoiceMismatchDetected`| Three-Way Match Engine | Accounts Payable, Action Center | Freeze invoice payout, alert finance auditor |
| `ExpenseApproved` | Expense Approval Service | Financial State Graph, Cashflow Forecast | Record operating cost, schedule cash outflow |
| `TaxDeadlineNear` | Tax Rule Engine | Tax AI, Executive Dashboard | Alert owner of upcoming VAT/Turnover payment |
| `SecurityAlert` | Security SOC / WAF | Security AI, Platform Admin | Lock compromised session, trigger step-up auth |
| `CameraEvent` | Vision AI Service | Action Center, Store Operations | Alert manager of cashier queue or zone crowding |
| `IntegrationFailed` | Webhook / Sync Adapters | Integration AI, SRE Monitoring | Quarantine payload in DLQ, schedule retry |
| `AIFailure` | Supervisor AI | Multi-Model Router, Audit Log | Execute fallback chain, maintain core operations |

---

## 3. Transactional Outbox Pattern
To prevent the dual-write problem (where database commits succeed but message bus delivery fails), events are atomically written to `domain_event_outbox` in the same database transaction, then dispatched with guaranteed at-least-once delivery.
