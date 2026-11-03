# ProfitLeak — Debt Risk Intelligence & Customer Recovery AI

## Overview
ProfitLeak Section 5.6 implements an authoritative, deterministic Debt Risk Intelligence and Customer Recovery system.
The system calculates real-time customer risk profiles, orders collection priority queues, detects branch/cashier deferred sales anomalies, and provides AI recovery analysts with grounded facts.

---

## 1. Non-Discriminatory Risk Scoring Policy
Risk scores (0–100) are computed **strictly from objective financial behaviors**:
- Days Past Due (DPD)
- Broken Promises to Pay count
- Credit Limit Utilization %
- Payment Failure Rate %
- Open Debt Disputes count

**Prohibited Factors**:
Under no circumstances are demographic or protected characteristics (gender, age, ethnicity, religion, geographical origin, marital status) used or stored in risk evaluation.

---

## 2. Risk Levels & Score Ranges
- **LOW** (0.00 – 24.99): Clean payment history, low credit utilization.
- **MEDIUM** (25.00 – 54.99): Minor payment delays or moderate utilization.
- **HIGH** (55.00 – 79.99): DPD > 14 days, high utilization (>85%), or broken promises.
- **CRITICAL** (80.00 – 100.00): DPD > 30 days, multiple broken promises, high failure rate.
- **INSUFFICIENT_HISTORY**: Account with zero transaction history or no prior credit terms.

---

## 3. Collection Priority Engine
Collection priorities are decoupled from risk scores to prioritize urgent interventions:
- **URGENT**: DPD > 30 days OR Risk Score >= 75 OR Broken Promises >= 2.
- **HIGH**: DPD > 14 days OR Risk Score >= 50 OR Broken Promises >= 1.
- **NORMAL**: DPD > 0 days OR Risk Score >= 25.
- **LOW**: Non-overdue accounts with low risk scores.

---

## 4. Recovery Analytics & Write-off Isolation
Recovery rate is defined strictly as:
$$\text{Recovery Rate \%} = \frac{\text{Total Confirmed Payment Amounts}}{\text{Total Historical Debt Principal}} \times 100$$

**Financial Integrity Constraint**:
Write-offs and manual decrease adjustments are strictly tracked as loss items (`WRITE_OFF_APPROVED`) and **NEVER** added to recovered debt totals.

---

## 5. Cashier Anomaly Detection
Cashiers originating deferred sales are evaluated against branch baselines:
- An anomaly alert is triggered if a cashier generates **>40% of branch total deferred sales** and exhibits high non-payment correlation.
