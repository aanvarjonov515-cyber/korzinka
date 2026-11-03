# ProfitLeak AI Fallback & Failure Classification Specification

## 1. Precise Failure Classification
ProfitLeak eliminates ambiguous "out of tokens" errors by distinguishing:
- `RATE_LIMIT`: HTTP 429 burst limit reached on provider tier.
- `TOKEN_LIMIT`: Generation request exceeded model max output token window.
- `CONTEXT_LIMIT`: Input prompt exceeded context length window.
- `DAILY_QUOTA`: Provider project daily billing or quota cap reached.
- `MONTHLY_QUOTA`: Organization-level billing limit exhausted.
- `PROVIDER_OUTAGE`: HTTP 500, 502, 503, 504 from external model endpoint.
- `MODEL_UNAVAILABLE`: Selected model deprecated, decommissioned, or in maintenance.
- `TIMEOUT`: Request exceeded bounded latency SLA.
- `INVALID_RESPONSE`: Model returned malformed or schema-invalid JSON.
- `TOOL_ERROR`: Backend tool execution encountered operational error.

## 2. Capability-Compatible Fallback Cascades
When a failure occurs:
1. Failure cause is classified.
2. The agent's `AIFallbackPolicy` resolves the next compatible model (e.g. `gemini-flash-latest` -> `gemini-3.8-flash` -> `gemini-3.1-flash-lite`).
3. Minimal context handoff is generated (objective + structured facts + completed tools).
4. Task completes seamlessly without repeating idempotent tool calls.
5. If all fallbacks are exhausted, system gracefully degrades while POS, Inventory, and Debt engines operate uninterrupted.
