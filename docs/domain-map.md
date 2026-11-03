# ProfitLeak Global Domain Map & Ownership Matrix

| Business Domain | Authoritative Source of Truth | Primary Immutable Ledger | Core Domain Events Emitted | Specialist AI Agent | Key Actions Created | Required RBAC Permissions |
|---|---|---|---|---|---|---|
| **Sales & Checkout** | `Sale` / `SaleItem` tables | Cash Register Journal | `SaleCreated`, `SaleVoided` | `Sales AI` | Review discount anomaly | `sales:create`, `sales:void` |
| **Inventory & Stock** | `InventoryLedger` entries | `inventory_ledger` | `StockAdjusted`, `StockoutRisk` | `Inventory AI` | Stock reorder, branch transfer | `inventory:manage`, `stock:read` |
| **Customer & Debt** | `CustomerDebtLedger` | `debt_ledger` | `DebtOverdue`, `DebtPaid` | `Collection AI` | Payment reminder, credit block | `debt:manage`, `collection:call` |
| **Procurement** | `PurchaseOrder`, `GRN`, `ThreeWayMatch` | `SupplierPayableLedger` | `GoodsReceiptPosted`, `PriceHike` | `Procurement AI` | Switch supplier, approve PO | `procurement:approve`, `grn:post` |
| **Operating Expenses**| `Expense` records | `expense_items` | `ExpenseApproved`, `BudgetOverrun`| `Finance AI` | Multi-level expense approval | `expense:submit`, `expense:approve`|
| **Financial State** | Financial Event Graph | `financial_events` | `CashflowPressure`, `MarginDrop` | `Financial Analyst` | Liquidity alert, price review | `finance:read`, `treasury:manage` |
| **Tax & Compliance** | `TaxRuleEngine` + `TaxLiabilityLedger` | `tax_liabilities` | `TaxDeadlineNear`, `VATCalculated`| `Tax AI` | Submit VAT, reconcile Didox | `tax:manage`, `compliance:read` |
| **Integrations** | `ReconciliationMismatch` | `reconciliation_mismatches`| `IntegrationMismatchDetected` | `Integration AI` | Resolve kassa/POS discrepancy | `integrations:manage`, `sync:run` |
| **Security & Vision** | `SecurityEvent` | `security_events` | `SuspiciousLogin`, `CameraAnomaly` | `Security AI` | Lock user session, alert owner | `security:read`, `security:admin` |
| **Action Center** | `ActionItem` | `action_items` | `ActionCreated`, `ActionResolved` | `Supervisor AI` | Priority assignment, SLA escalation | `actions:read`, `actions:execute` |
