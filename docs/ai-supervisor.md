# ProfitLeak Supervisor AI & Conflict Resolution Specification

## 1. Supervisor Role: Operations Manager
The Supervisor AI is an operations manager and traffic coordinator, **never** a root administrator:
- It cannot elevate permissions or bypass RBAC.
- It cannot approve money movements or bypass approval gates.
- It cannot execute arbitrary direct mutations.

## 2. Cross-Agent Insight Synthesis
When cross-domain business events occur, the Supervisor aggregates specialist analyses:
- **Example (Supplier Price Hike)**:
  1. `SupplierPriceChanged` event received.
  2. `Procurement AI` computes wholesale price delta (+12%).
  3. `Inventory AI` computes batch order cost impact (+8.4M UZS).
  4. `Finance AI` projects net margin erosion (-2.1%).
  5. `Supervisor AI` synthesizes the findings and proposes `PROPOSE_PRICE_REVISION` to the Action Center for owner decision.

## 3. Conflict Resolution Hierarchy
When agent interpretations conflict, the resolution order is strictly deterministic:
```
Transaction Engine > Analytics Engine > Rule Engine > AI Interpretation
```
Authoritative PostgreSQL state always supersedes LLM-generated explanations.
