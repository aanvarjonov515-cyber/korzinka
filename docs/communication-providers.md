# ProfitLeak — Communication Gateway Providers & Health Monitoring

## 1. Provider Adapter Architecture
Communication channels interface via standardized provider adapters:
- **Voice AI Adapter**: WebRTC / SIP Gateway with real-time Speech-to-Text and Text-to-Speech stream handling.
- **SMS Gateway Adapter**: Eskiz.uz / Twilio REST API with webhook delivery receipts.
- **Email Adapter**: SendGrid / SMTP transactional email renderer.
- **Telegram Bot Adapter**: Webhook-driven Telegram Bot API with identity linking.

## 2. Health Registry & Failover
Every gateway reports canonical health states:
- `HEALTHY`
- `DEGRADED`
- `OFFLINE`
- `RATE_LIMITED`
- `MISCONFIGURED`

When a primary provider state degrades, the Orchestrator evaluates fallback providers without interrupting active collection workflows.
