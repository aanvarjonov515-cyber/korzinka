# ProfitLeak Platform Control Plane Architecture

## 1. Executive Summary & Separation of Concerns
ProfitLeak strictly separates the **Business Plane** (day-to-day retail operations: POS, inventory, customer debt, procurement, expenses, treasury) from the **Platform Control Plane** (privileged SaaS management: multi-tenancy, platform security, SRE monitoring, backup orchestration, AI cluster routing, and support access).

```text
BUSINESS PLANE (Tenant Isolated)
├── POS & Cash Registers
├── Customer Debts & 360 Profiles
├── Inventory & Procurement
├── Financial State Graph & Ledgers
└── Action Center & Workflows

          || [Strict Boundary & Air-Gap] ||

PLATFORM CONTROL PLANE (Privileged Operator)
├── Tenant Lifecycle & Subscriptions
├── Platform Users & Least-Privilege RBAC
├── Time-Bounded Support Access Sessions
├── AI Infrastructure & Multi-Model Router
├── Global Integration Diagnostics
├── SRE Observability & System Monitoring
├── Backup Verification & Disaster Recovery
├── Security SOC & Incident Lifecycle (SEV1-4)
└── Immutable Audit & Configuration Center
```

---

## 2. Core Architectural Invariants
1. **Platform Admin $\ne$ Business Owner**: Platform operators do not have automatic or continuous read/write access to tenant private ledgers, sales numbers, employee salaries, or customer contact books.
2. **Support Access Gating**: Inspecting tenant diagnostics requires an explicit customer support ticket, justification reason, step-up MFA verification, and time-bounded expiration.
3. **Privacy-First Observability**: Platform dashboards aggregate system health (availability, p95 latencies, queue depths, error rates), never private business turnover or profit margins.
4. **No Unrestricted Shell / Root Privileges for AI**: Platform Operations AI serves as a diagnostic advisor, never with autonomous authority to delete tenants or alter production databases.
