# API Security Documentation

## Authentication & Authorization
- All endpoints are authenticated by default.
- RBAC is enforced for all business operations.
- Tenant/Branch isolation is enforced at the database layer.

## Security Features
- HTTPS: Enforced by reverse proxy.
- Rate Limiting: Redis-backed.
- SSRF Protection: Outbound URL validation.
- Idempotency: Supported via `Idempotency-Key` header.
- Logging: Structured logging with data sanitization.
- Security Events: Centralized audit pipeline.
