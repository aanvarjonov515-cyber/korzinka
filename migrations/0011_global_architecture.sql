-- ==============================================================================
-- PROFITLEAK GLOBAL MASTER ARCHITECTURE: TAX, PROFIT LEAK & EVENT OUTBOX
-- Migration: 0011_global_architecture.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS tax_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    tax_type VARCHAR(32) NOT NULL, -- VAT, TURNOVER_TAX, INCOME_TAX, SOCIAL_TAX
    rate_percent NUMERIC(5, 2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    exempt_categories JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tax_rules_lookup ON tax_rules(tax_type, effective_from, effective_to);

CREATE TABLE IF NOT EXISTS tax_liabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    branch_id UUID,
    tax_rule_id UUID REFERENCES tax_rules(id),
    tax_type VARCHAR(32) NOT NULL,
    source_type VARCHAR(64) NOT NULL, -- SALE, PURCHASE_INVOICE, EXPENSE, PAYROLL
    source_id VARCHAR(128) NOT NULL,
    source_reference VARCHAR(64),
    taxable_base_amount NUMERIC(14, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL,
    tax_amount NUMERIC(14, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'ACCRUED', -- ACCRUED, DECLARED, PAID, DISPUTED
    reporting_period VARCHAR(32) NOT NULL, -- 2026-10
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tax_liabilities_period ON tax_liabilities(business_id, reporting_period, status);

CREATE TABLE IF NOT EXISTS profit_leak_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    category VARCHAR(64) NOT NULL, -- EXPIRY_LOSS, STOCKOUT_LOSS, DEAD_STOCK, OVERDUE_DEBT, etc.
    title VARCHAR(255) NOT NULL,
    financial_impact_uzs NUMERIC(14, 2) NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
    root_cause TEXT,
    risk_summary TEXT,
    recommended_action TEXT,
    responsible_role VARCHAR(64),
    status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, MITIGATED, RESOLVED
    action_item_id UUID,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profit_leak_business ON profit_leak_records(business_id, status);

CREATE TABLE IF NOT EXISTS domain_event_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(128) NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, PUBLISHED, FAILED
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_domain_outbox_status ON domain_event_outbox(status, created_at);
