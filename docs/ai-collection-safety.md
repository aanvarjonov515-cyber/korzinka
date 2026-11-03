# ProfitLeak — AI Collection Safety & Boundary Guidelines

## 1. Prohibited AI Tools & Capabilities
AI assistants (Voice AI, Chatbots, Executive Analysts) operate within strict permission boundaries and **CANNOT**:
1. Execute financial write-offs or manual balance adjustments.
2. Direct-patch debt balances or customer ledger entries.
3. Modify customer credit limits or override discount baselines.
4. Request card PIN, CVV, or full card numbers during customer interactions.
5. Create fake or hallucinated action recommendations.

## 2. Permitted Candidate Tools
AI assistants can invoke structured candidate tools that trigger human or backend validation workflows:
- `register_promise_candidate`: Registers structured promise date and amount (validated by backend).
- `open_dispute_ticket`: Opens a debt dispute ticket for manager review.
- `create_payment_verification_task`: Opens a "Men to'ladim" claim verification task.
- `trigger_human_escalation`: Escalates conversation to a human collection specialist.
