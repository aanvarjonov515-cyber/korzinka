# ProfitLeak AI FinOps & Cost Control Specification

## 1. Cost Controller Architecture
ProfitLeak implements strict FinOps discipline for LLM workloads:
1. **Model Pricing Registry**:
   - `gemini-flash-latest`: $0.15 / 1M input, $0.60 / 1M output.
   - `gemini-3.8-flash`: $0.15 / 1M input, $0.60 / 1M output.
   - `gemini-3.1-flash-lite`: $0.075 / 1M input, $0.30 / 1M output.
   - `gemini-4-argon`: $1.25 / 1M input, $5.00 / 1M output (reserved for high-complexity analysis only).

2. **Cost-Aware Routing**:
   - Routine classification, simple parsing, and small summaries route to flash-lite models.
   - Complex multi-agent cross-domain synthesis routes to flash models.
   - Deterministic calculations (sums, discounts, interest, VAT) are NEVER sent to LLMs.

3. **Budget Caps**:
   - Per-agent daily budget limit (default: $10.00/day).
   - Business organization monthly cap (default: $50.00/month).
   - Automated alerts triggered at 80% and 95% utilization thresholds.
