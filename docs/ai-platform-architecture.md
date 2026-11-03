# ProfitLeak Multi-Agent AI Intelligence Platform Architecture

## 1. High-Level Overview
ProfitLeak Section 9 establishes a production-grade **Multi-Agent Intelligence Platform** designed specifically for retail and supermarket operations. The platform rejects the monolithic single-chatbot antipattern and implements a structured hierarchy of 10 specialized agents coordinated by a **Supervisor AI Operations Manager**.

```
                           Business Domain Events
                                      │
                                      ▼
                             [ AI Event Router ]
                                      │
         ┌──────────────┬─────────────┼─────────────┬──────────────┐
         ▼              ▼             ▼             ▼              ▼
    Finance AI     Sales AI     Customer AI   Collection AI   Inventory AI
         │              │             │             │              │
         └──────────────┴─────────────┼─────────────┴──────────────┘
                                      ▼
                             [ Supervisor AI ]
                      (Operations Manager / Synthesizer)
                                      │
                                      ▼
                            [ Cross-Agent Insights ]
                                      │
                                      ▼
                            [ AI Action Engine ]
                        (Policy / Risk / Approval)
                                      │
                                      ▼
                     [ Deterministic Business Services ]
                  (Payments / Accounting / Stock / Tax)
```

## 2. Core Architectural Invariants
1. **Deterministic Engine First**: Debt balances, sales totals, inventory counts, tax liabilities, and cash positions are computed exclusively by backend authoritative engines (PostgreSQL Transaction Engine, Rule Engine, Analytics Engine). AI is an interpretation, explanation, and recommendation layer.
2. **Zero Direct Financial Mutations**: AI agents are strictly forbidden from executing card charges, refunding money, altering ledger entries, writing off debts, or modifying tax liabilities directly.
3. **Action Candidate Workflow**: All agent recommendations that propose business side-effects create an `AIActionCandidate` with explicit priority, risk level, confidence score, and human-in-the-loop approval requirements.
4. **Strict Scope Isolation**: Each agent operates under a verified `DATA_SCOPE` (e.g. Collection AI cannot view camera feeds or payroll; Camera AI operates purely on anonymous traffic without biometric identification).
5. **Anti-AI Slop & Graceful Degradation**: Core retail operations (POS checkout, inventory updates, debt repayments) remain 100% operational even during total AI provider outages or quota exhaustion.
