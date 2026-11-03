# ProfitLeak AI Observability, Telemetry & Incident Management

## 1. Core Observability Metrics
ProfitLeak instruments the entire multi-agent intelligence lifecycle:
- `ai_tasks_total`: Total task execution volume per agent, capability, and model.
- `ai_task_success_rate`: Percentage of successfully completed tasks without error.
- `ai_task_latency_ms`: P50, P90, P99 latency distribution across agent tasks.
- `ai_fallback_total`: Frequency of automated fallback cascades triggered.
- `ai_rate_limit_total`: Count of HTTP 429 events encountered.
- `ai_tool_denied_total`: Security events where an agent attempted an unauthorized tool.
- `ai_cost_total_usd`: Cumulative token consumption cost.

## 2. Incident Management Pipeline
The `AIIncident` model captures:
- Provider outages
- Elevated error rates (>5%)
- Rate limit bursts
- Cost acceleration alerts
Incidents transition through `OPEN` -> `INVESTIGATING` -> `MITIGATED` -> `RESOLVED` with automated mitigation summaries.
