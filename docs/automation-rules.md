# ProfitLeak Automation Rules & AI Prompt Translation

## 1. Principles of Safe Automation
Automating business actions can save hundreds of man-hours, but unchecked automation can lead to catastrophic financial or legal disasters. ProfitLeak adheres to three immutable safety laws:

1. **No Autonomous Financial Destruction**: Automation rules can NEVER delete customer debts, erase ledger transactions, or write off assets without human authorization.
2. **Two-Man Rule on High-Value Outflows**: Any action releasing cash or approving payments exceeding 5,000,000 UZS must mandate human signoff.
3. **Draft-First for AI-Generated Rules**: Natural language operator instructions always compile into a previewable `DRAFT` state before activation.

---

## 2. Natural Language AI Rule Generator Pipeline
Operators can describe automation needs in conversational Uzbek, Russian, or English:
> *"Agar mijozning qarzi 7 kundan oshib ketsa, telegramdan muloyim eslatma yuborilsin va nasiya limiti tekshirilsin."*

### Pipeline:
1. **Prompt Ingestion**: Receives operator prompt.
2. **Semantic Extraction**: Maps entities to known domain triggers (`DEBT_OVERDUE_DETECTED`), conditions (`days_overdue >= 7`), and actions (`SEND_TELEGRAM_REMINDER`, `RESTRICT_CUSTOMER_CREDIT`).
3. **Safety Validation**: Passes rule through `AutomationRuleValidator`:
   - Checks against `RESTRICTED_ACTIONS`.
   - Validates monetary thresholds and human approval flags.
   - Checks rate-limiting caps (`max_executions_per_hour`).
4. **Draft Generation**: Persists rule with status `DRAFT` and `created_by_ai: true`.
5. **Human Review & Simulation**: The operator tests the rule against past data in the UI and clicks "Activate Rule".
