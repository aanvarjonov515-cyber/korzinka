# ProfitLeak AI Agent Registry & Specialist Roles

## 1. Registered Specialist Agents

| Agent Code | Canonical Name | Core Role | Primary Model | Fallback Models |
| :--- | :--- | :--- | :--- | :--- |
| `SUPERVISOR_AI` | Supervisor AI | Operations Manager & Business Coordinator | `gemini-flash-latest` | `gemini-3.8-flash`, `gemini-3.1-flash-lite` |
| `FINANCE_AI` | Finance AI | Financial State Analyst & Management Accountant | `gemini-flash-latest` | `gemini-3.8-flash`, `gemini-3.1-flash-lite` |
| `CUSTOMER_AI` | Customer 360 AI | Relationship, Loyalty & Segmentation Analyst | `gemini-flash-latest` | `gemini-3.1-flash-lite` |
| `SALES_AI` | Sales & Basket AI | Velocity, Basket Affinity & Cashier Metrics | `gemini-flash-latest` | `gemini-3.1-flash-lite` |
| `PROCUREMENT_AI` | Procurement AI | Vendor Comparison & True Landed Cost Specialist | `gemini-flash-latest` | `gemini-3.8-flash` |
| `TAX_AI` | Tax Copilot AI | Regulatory, EHF & Deduction Compliance | `gemini-flash-latest` | `gemini-3.8-flash` |
| `INVENTORY_AI` | Inventory Intelligence | Stockout Prevention & Waste Minimizer | `gemini-flash-latest` | `gemini-3.1-flash-lite` |
| `COLLECTION_AI` | Collection AI | Soft Debt Recovery & Voice Assistant | `gemini-flash-latest` | `gemini-3.1-flash-lite` |
| `CAMERA_AI` | Camera Operations AI | Anonymous Footfall & Queue Analyzer | `gemini-flash-latest` | `gemini-3.1-flash-lite` |
| `SECURITY_AI` | Security & Fraud AI | Threat Detection & Protection Mode Controller | `gemini-flash-latest` | `gemini-3.8-flash` |

## 2. Agent Health Lifecycle
- `HEALTHY`: Normal operations, latency under SLA (<250ms), zero recent errors.
- `BUSY`: Active inference or tool evaluation pipeline in progress.
- `DEGRADED`: Fallback model currently in use due to upstream primary latency or rate limit.
- `RATE_LIMITED`: Upstream provider returned HTTP 429; automated failover active.
- `QUOTA_EXHAUSTED`: Daily budget or provider ceiling reached; graceful bypass active.
- `ERROR`: Unhandled exception or schema validation failure; incident opened.
- `OFFLINE`: Manually disabled for maintenance or security isolation.
