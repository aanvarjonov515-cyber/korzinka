# ProfitLeak — Debt Risk Model Specification

## 1. Feature Breakdown & Weights
The risk model version `v1.0-deterministic` calculates the risk score $S \in [0, 100]$ using the formula:

$$S = \min\left(100, W_{\text{DPD}} + W_{\text{BP}} + W_{\text{UTIL}} + W_{\text{FAIL}} + W_{\text{DISP}}\right)$$

### Weights:
1. **Days Past Due ($W_{\text{DPD}}$)**:
   - DPD > 60: $+45.0$ pts
   - DPD > 30: $+30.0$ pts
   - DPD > 7: $+15.0$ pts

2. **Broken Promises ($W_{\text{BP}}$)**:
   - $+20.0$ pts per broken promise (capped at $+40.0$ pts).

3. **Credit Utilization ($W_{\text{UTIL}}$)**:
   - Utilization $\ge 90\%$: $+20.0$ pts
   - Utilization $\ge 75\%$: $+10.0$ pts

4. **Payment Failure Rate ($W_{\text{FAIL}}$)**:
   - Failure rate $\ge 50\%$: $+15.0$ pts

5. **Open Disputes ($W_{\text{DISP}}$)**:
   - Open active debt disputes: $+10.0$ pts

---

## 2. Model Persistence
Each calculation generates a `CustomerRiskSnapshot` record containing:
- `score`: Decimal(5, 2)
- `risk_level`: String
- `feature_snapshot`: JSON object containing raw feature inputs.
- `calculated_at`: UTC timestamp
