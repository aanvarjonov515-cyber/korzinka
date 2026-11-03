# Database Principles

- All database operations must use SQLAlchemy with async engine.
- PostgreSQL is the source of truth.
- Financial data (sales, payments, debts) must NEVER be deleted; use status updates.
- Migrations are managed via Alembic.
- Times are always stored in UTC.
- Money is handled using `Decimal` to avoid floating-point issues.
