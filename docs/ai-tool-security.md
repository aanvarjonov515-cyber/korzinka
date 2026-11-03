# ProfitLeak AI Tool Security & Anti-Mutation Guardrails

## 1. Tool Execution Model
Every AI tool call is evaluated against three non-negotiable security layers:
1. **Forbidden Mutations Block**: Calls attempting to alter balances, write off debt, charge cards, or execute terminal commands are rejected immediately with high-priority audit alerts.
2. **Category Authorization**:
   - `READ_ONLY`: Safe deterministic data retrieval (e.g. `get_debt_summary`, `get_financial_state`).
   - `PROPOSE_ACTION`: Creates an `AIActionCandidate` requiring policy and human verification.
   - `CREATE_TASK`: Spawns human review tasks (e.g. `create_payment_verification_task`).
   - `HIGH_RISK_ACTION`: Strictly gated by RBAC and Owner approval modals.
3. **Agent Scope Whitelist**: Tools verify the caller agent's code against the registered whitelist.

## 2. Forbidden Mutations List
- `charge_card`
- `refund_money`
- `delete_debt`
- `write_off_debt`
- `execute_supplier_payment`
- `adjust_tax_liability_directly`
- `drop_table`
- `execute_shell`
- `bypass_rbac`
- `modify_user_roles`
