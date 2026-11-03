# ProfitLeak — Communication Orchestration Engine Architecture

## 1. Overview
The Communication Orchestration Engine governs all automated and manual debt collection outreach across:
- **Voice AI Call Sessions** (Conversational STT/TTS with backend tool execution)
- **SMS Gateway** (Transactional templates with server-renderer placeholders)
- **Email Gateway** (HTML notifications with sanitized debt breakdown)
- **Telegram Gateway** (Verified linked account messaging)

## 2. Policy Enforcement & Guardrails
- **Daily Contact Caps**: Enforces strict `max_total_contacts_per_day`, `max_voice_per_day`, and `max_sms_per_day` limits per customer.
- **Quiet Hours Enforcement**: Blocks outreach during configured quiet hours (e.g. 20:00 to 08:00) with fail-closed security event logging.
- **Mandatory Debt Resolution Cancellation**: Whenever a debt transitions to `PAID` or `RESOLVED`, `CommunicationOrchestrator.cancel_pending_communications(debt_id)` immediately cancels all pending voice calls, SMS, emails, and collection tasks.

## 3. Multi-Channel Fallback
Configurable `fallback_order` e.g. `["VOICE_AI", "SMS", "TELEGRAM", "EMAIL"]`. If a primary channel fails or exceeds daily limits, outreach seamlessly falls back to the next approved channel.

## 4. Security & Privacy
- **Zero Sensitive Credential Context**: Full card PAN, CVV, PIN, passcodes, and secrets are strictly excluded from AI prompts and logs.
- **Canonical Outbox & Webhook Idempotency**: Replay protection prevents duplicate SMS/Call dispatches.
