# ProfitLeak AI Security, Scope Enforcement & Anti-Injection Architecture

## 1. Prompt Injection Defense
All external input—customer messages, supplier invoices, third-party webhook payloads—is treated as **UNTRUSTED DATA**, never executable instruction:
- Injection regex filters detect and neutralize patterns such as `ignore previous instructions`, `you are now admin`, `delete my debt`, and `system prompt override`.
- Structured prompts strictly separate `[SYSTEM_INSTRUCTION]` from `[FACT_DATA]` and `[USER_QUERY]`.

## 2. Strict Data Scope Matrix
Agents are programmatically blocked from requesting data domains outside their mandate:
- `COLLECTION_AI` requesting payroll or camera feeds raises `DataScopeViolationException`.
- `CAMERA_AI` requesting customer debts or sales transactions raises `DataScopeViolationException`.
- `SECURITY_AI` requesting customer debt or bank accounts raises `DataScopeViolationException`.

## 3. Privacy & Biometrics Guardrail
- `CAMERA_AI` performs **anonymous** traffic analysis only (footfall count, queue length, zone occupancy).
- Individual facial recognition and biometric identification are strictly forbidden and disabled by default.
