# ProfitLeak Action Center Architecture

## 1. Executive Summary
The Action Center is the central operational command hub of ProfitLeak. It transforms real-time events across all business verticals—POS sales, customer debt aging, inventory reorder points, procurement delays, operating expenses, financial cashflow deficits, security breaches, and camera telemetry—into clear, prioritized, accountable, and measurable tasks.

Unlike naive notification lists or generic task managers, every Action Item in ProfitLeak is strictly tied to authoritative domain sources and structured around a four-part diagnostic framework:
1. **Nima bo'ldi (Facts)**: What exact event or threshold triggered this action.
2. **Sabab (Root Cause)**: Why this condition occurred.
3. **Risk (Business Impact)**: Financial exposure, customer churn probability, or legal liability.
4. **Action (Executable Steps)**: Recommended immediate interventions with responsible roles and SLAs.

---

## 2. Action Item Data Contract
Every action item adheres to the canonical schema:

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary identifier |
| `action_number` | String | Human-readable code (e.g. `ACT-2026-1049`) |
| `category` | Enum | `DEBT_COLLECTION`, `INVENTORY_REORDER`, `APPROVAL`, `CASHFLOW_RISK`, `RECONCILIATION`, `SECURITY` |
| `source_type` | Enum | Authoritative source (`DEBT`, `INVENTORY`, `CASHFLOW`, `AI_AGENT`, `SUPPLIER`, `EXPENSE`, `AUDIT`, `CAMERA`) |
| `source_id` | String | External or internal entity ID |
| `priority` | Enum | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `priority_score`| Numeric (0-100) | Calculated algorithmic urgency |
| `financial_impact`| Numeric (UZS) | Money at risk or potential recovery value |
| `status` | Enum | `OPEN`, `IN_PROGRESS`, `PENDING_APPROVAL`, `RESOLVED`, `CANCELLED`, `BLOCKED` |
| `sla_hours` | Integer | Resolution deadline window |
| `facts` | JSON | Key metrics, balances, timestamps |
| `outcome_metrics` | JSON | Post-resolution verified impact (e.g., recovered cash) |

---

## 3. Priority Engine & Scoring
The Priority Engine evaluates four core dimensions:
$$\text{Score} = \text{Financial Impact (max 40)} + \text{Risk Level (max 25)} + \text{Source Weight (max 20)} + \text{Deadline Proximity (max 15)}$$

- **CRITICAL ($\ge 80$)**: Immediate intervention required (< 4 hours).
- **HIGH ($60 - 79$)**: Urgent operational task (< 24 hours).
- **MEDIUM ($35 - 59$)**: Standard business resolution (< 48 hours).
- **LOW ($< 35$)**: Informational or maintenance item.

---

## 4. Idempotency & Deduplication
To eliminate alert fatigue and duplicate task proliferation, the system generates an idempotency key:
$$\text{Key} = \text{SOURCE\_TYPE} + \text{":"} + \text{SOURCE\_ID} + \text{":"} + \text{CATEGORY}$$
If an active open or in-progress action already exists with the same key, subsequent triggers update the existing action's facts and escalate SLA urgency rather than creating duplicate records.
