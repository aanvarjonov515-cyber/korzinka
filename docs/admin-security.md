# ProfitLeak Platform Admin Security & Step-Up Architecture

## 1. Multi-Factor Authentication (MFA)
All platform administration accounts are strictly required to enforce hardware-backed FIDO2/WebAuthn or TOTP multi-factor authentication. Passwords alone cannot authenticate to the Platform Control Plane.

---

## 2. Ephemeral Admin Sessions
Unlike standard tenant sessions which may remain active for multiple hours, platform admin sessions enforce:
- **Maximum Lifetime**: 4 hours absolute.
- **Idle Timeout**: 15 minutes of inactivity prompts immediate re-authentication.
- **Device & IP Binding**: Sessions are tied to user agent and origin IP subnet; any sudden shift triggers immediate session termination and high-priority SOC alert.

---

## 3. Step-Up Authentication Flow
Certain administrative actions carry existential risks for SaaS operations:
- Suspending or terminating a tenant.
- Restoring database backups.
- Rotating integration or AI provider secrets.
- Changing platform roles or granting permissions.
- Modifying critical feature flags in production.

For these operations, the system requires a fresh cryptographic challenge (password confirmation or MFA re-prompt) completed within the last 10 minutes. Requests without valid step-up authorization are rejected with `HTTP 403 Step-Up Required`.
