-- ==============================================================================
-- PROFITLEAK SECTION 10: ACTION CENTER, WORKFLOW AUTOMATION & INTEGRATION PLATFORM
-- Migration: 0009_action_center_and_integrations.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_number VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(64) NOT NULL,
    source_type VARCHAR(64) NOT NULL,
    source_id VARCHAR(128),
    priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
    priority_score NUMERIC(6, 2) DEFAULT 50.00,
    financial_impact NUMERIC(14, 2) DEFAULT 0.00,
    risk_level VARCHAR(32) DEFAULT 'MEDIUM',
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    assigned_role VARCHAR(64),
    assigned_user_id VARCHAR(64),
    assigned_user_name VARCHAR(128),
    due_date TIMESTAMP WITH TIME ZONE,
    sla_hours INTEGER DEFAULT 24,
    escalation_level INTEGER DEFAULT 0,
    facts JSONB DEFAULT '{}'::jsonb,
    root_cause TEXT,
    risk_summary TEXT,
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    execution_payload JSONB DEFAULT '{}'::jsonb,
    blocked_by_action_id VARCHAR(64),
    is_blocked BOOLEAN DEFAULT FALSE,
    workflow_instance_id VARCHAR(64),
    resolved_by VARCHAR(64),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    outcome_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_priority ON action_items(priority);
CREATE INDEX IF NOT EXISTS idx_action_items_category ON action_items(category);
CREATE INDEX IF NOT EXISTS idx_action_items_source ON action_items(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_action_items_assigned ON action_items(assigned_user_id);

CREATE TABLE IF NOT EXISTS action_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_item_id UUID NOT NULL REFERENCES action_items(id) ON DELETE CASCADE,
    approver_role VARCHAR(64) NOT NULL,
    approver_user_id VARCHAR(64),
    approver_name VARCHAR(128),
    status VARCHAR(32) DEFAULT 'PENDING',
    decision_notes TEXT,
    decided_at TIMESTAMP WITH TIME ZONE,
    step_number INTEGER DEFAULT 1,
    is_mandatory BOOLEAN DEFAULT TRUE,
    changes_requested_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_action_approvals_item ON action_approvals(action_item_id);

CREATE TABLE IF NOT EXISTS workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(128) NOT NULL,
    category VARCHAR(64) DEFAULT 'OPERATIONS',
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    loop_detection_limit INTEGER DEFAULT 10,
    timeout_minutes INTEGER DEFAULT 1440,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id),
    instance_number VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(32) DEFAULT 'RUNNING',
    current_step_id VARCHAR(64),
    context_data JSONB DEFAULT '{}'::jsonb,
    execution_history JSONB DEFAULT '[]'::jsonb,
    step_execution_count INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    status VARCHAR(32) DEFAULT 'DRAFT',
    is_safety_validated BOOLEAN DEFAULT FALSE,
    safety_audit_notes TEXT,
    natural_language_prompt TEXT,
    created_by_ai BOOLEAN DEFAULT FALSE,
    trigger_event VARCHAR(128) NOT NULL,
    conditions JSONB DEFAULT '[]'::jsonb,
    actions JSONB DEFAULT '[]'::jsonb,
    max_executions_per_hour INTEGER DEFAULT 50,
    execution_count_last_hour INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integration_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_code VARCHAR(64) UNIQUE NOT NULL,
    provider_type VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    status VARCHAR(32) DEFAULT 'CONNECTED',
    auth_config JSONB DEFAULT '{}'::jsonb,
    sync_direction VARCHAR(32) DEFAULT 'BIDIRECTIONAL',
    sync_interval_minutes INTEGER DEFAULT 15,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_sync_status VARCHAR(32) DEFAULT 'SUCCESS',
    records_synced_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integration_sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
    job_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'RUNNING',
    records_processed INTEGER DEFAULT 0,
    records_succeeded INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    discrepancy_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    details JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS external_entity_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
    entity_type VARCHAR(64) NOT NULL,
    internal_id VARCHAR(128) NOT NULL,
    external_id VARCHAR(128) NOT NULL,
    external_code VARCHAR(128),
    mapping_metadata JSONB DEFAULT '{}'::jsonb,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_external_mappings_lookup ON external_entity_mappings(connection_id, entity_type, external_id);

CREATE TABLE IF NOT EXISTS reconciliation_mismatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reconciliation_code VARCHAR(64) UNIQUE NOT NULL,
    connection_type VARCHAR(64) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    external_total_amount NUMERIC(14, 2) NOT NULL,
    internal_total_amount NUMERIC(14, 2) NOT NULL,
    difference_amount NUMERIC(14, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'INVESTIGATING',
    mismatch_breakdown JSONB DEFAULT '[]'::jsonb,
    action_item_id UUID REFERENCES action_items(id) ON DELETE SET NULL,
    resolved_by VARCHAR(64),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
