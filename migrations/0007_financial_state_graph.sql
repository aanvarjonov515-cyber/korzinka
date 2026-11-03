-- ==============================================================================
-- PROFITLEAK MIGRATION 0007: FINANCIAL STATE GRAPH, CASHFLOW & SNAPSHOTS
-- Authoritative normalized financial events for unified business intelligence
-- ==============================================================================

-- 1. Financial Events Table (Canonical Record)
CREATE TABLE IF NOT EXISTS financial_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    branch_id UUID,
    
    event_type VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL,
    
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'UZS',
    
    source_type VARCHAR(64) NOT NULL,
    source_id UUID NOT NULL,
    source_reference VARCHAR(128),
    
    event_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    
    is_cash_impact BOOLEAN NOT NULL DEFAULT FALSE,
    is_accrual_impact BOOLEAN NOT NULL DEFAULT TRUE,
    
    description VARCHAR(512),
    metadata_json JSONB,
    
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS ix_fin_events_business_id ON financial_events(business_id);
CREATE INDEX IF NOT EXISTS ix_fin_events_event_date ON financial_events(event_date);
CREATE INDEX IF NOT EXISTS ix_fin_events_type ON financial_events(event_type);
CREATE INDEX IF NOT EXISTS ix_fin_events_source ON financial_events(source_type, source_id);

-- 2. Financial State Snapshots Table (Aggregates)
CREATE TABLE IF NOT EXISTS financial_state_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    snapshot_date DATE NOT NULL,
    
    revenue NUMERIC(18, 2) DEFAULT 0.00,
    cogs NUMERIC(18, 2) DEFAULT 0.00,
    gross_profit NUMERIC(18, 2) DEFAULT 0.00,
    opex NUMERIC(18, 2) DEFAULT 0.00,
    operating_profit NUMERIC(18, 2) DEFAULT 0.00,
    net_profit NUMERIC(18, 2) DEFAULT 0.00,
    
    cash_inflow NUMERIC(18, 2) DEFAULT 0.00,
    cash_outflow NUMERIC(18, 2) DEFAULT 0.00,
    net_cash_flow NUMERIC(18, 2) DEFAULT 0.00,
    ending_cash_balance NUMERIC(18, 2) DEFAULT 0.00,
    
    total_receivables NUMERIC(18, 2) DEFAULT 0.00,
    total_payables NUMERIC(18, 2) DEFAULT 0.00,
    inventory_value NUMERIC(18, 2) DEFAULT 0.00,
    working_capital NUMERIC(18, 2) DEFAULT 0.00,
    
    gross_margin_pct NUMERIC(5, 2),
    operating_margin_pct NUMERIC(5, 2),
    
    metadata_json JSONB,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    
    UNIQUE (business_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS ix_fin_snapshots_biz_date ON financial_state_snapshots(business_id, snapshot_date);

-- 3. Cashflow Projections Table (Forecasting)
CREATE TABLE IF NOT EXISTS cashflow_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    
    projection_date DATE NOT NULL,
    
    expected_inflow NUMERIC(18, 2) DEFAULT 0.00,
    expected_outflow NUMERIC(18, 2) DEFAULT 0.00,
    projected_balance NUMERIC(18, 2) DEFAULT 0.00,
    
    confidence_level NUMERIC(3, 2) DEFAULT 1.00,
    
    inflow_details JSONB,
    outflow_details JSONB,
    
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS ix_cash_proj_biz_date ON cashflow_projections(business_id, projection_date);
