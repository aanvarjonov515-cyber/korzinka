# ProfitLeak — Section 5 Customer & Debt Architecture

## Final End-to-End System Flow Diagram

```text
Customer 360 Profile
       │
       ▼
Deferred Sale (POS)
       │
       ▼
PAY LATER Contract & Consent
       │
       ▼
Debt Record Created + Debt Ledger (DEBT_CREATED)
       │
       ├──────────────────────────────┐
       ▼                              ▼
Scheduled Auto-Payment        Collection Workflow
       │                              │
       ▼                              ▼
Payment Attempt (Humo/Uzcard) Voice AI / SMS / Telegram
       │                              │
       ├──────────────┬───────────────┤
       ▼              ▼               ▼
Payment Success    Failure       Promise / Dispute / Verification
       │              │               │
       ▼              ▼               ▼
Debt Ledger       Retry       Ledger Adjustment / Match
(PAYMENT Entry)   Queue               │
       │                              │
       └──────────────┬───────────────┘
                      ▼
            Debt Status = PAID
                      │
                      ▼
  Cancel Scheduled Payments & Reminders
                      │
                      ▼
         Recovery Analytics Engine
                      │
                      ▼
           Owner Recovery Dashboard
                      │
                      ▼
            AI Executive Briefing
```
