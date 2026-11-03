-- ==============================================================================
-- PROFITLEAK SECTION 11: PRIVILEGED PLATFORM CONTROL PLANE & OPERATIONS
-- Migration: 0010_admin_control_plane.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS support_access_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_code VARCHAR(64) UNIQUE NOT NULL,
    admin_user_id VARCHAR(64) NOT NULL,
    admin_user_name VARCHAR(128) NOT NULL,
    tenant_id UUID NOT NULL,
    tenant_name VARCHAR(256) NOT NULL,
    support_case_id VARCHAR(64),
    reason TEXT NOT NULL,
    scope VARCHAR(64) NOT NULL DEFAULT 'READ_ONLY_PROFILE',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by VARCHAR(64),
    revocation_reason TEXT,
    step_up_verified BOOLEAN DEFAULT TRUE,
    actions_performed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_support_sessions_admin ON support_access_sessions(admin_user_id, status);
CREATE INDEX IF NOT EXISTS idx_support_sessions_tenant ON support_access_sessions(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_support_sessions_expires ON support_access_sessions(expires_at);

CREATE TABLE IF NOT EXISTS platform_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID UNIQUE NOT NULL,
    plan VARCHAR(32) NOT NULL DEFAULT 'BUSINESS',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    billing_cycle VARCHAR(32) DEFAULT 'MONTHLY',
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    max_users INTEGER DEFAULT 25,
    max_branches INTEGER DEFAULT 5,
    max_storage_gb INTEGER DEFAULT 50,
    ai_monthly_token_quota INTEGER DEFAULT 5000000,
    included_integrations JSONB DEFAULT '["POS", "TELEGRAM", "CLICK", "PAYME"]'::jsonb,
    current_users_count INTEGER DEFAULT 3,
    current_branches_count INTEGER DEFAULT 2,
    current_storage_mb INTEGER DEFAULT 1420,
    current_ai_tokens_used INTEGER DEFAULT 245000,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON platform_subscriptions(status);

CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_key VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    scope VARCHAR(32) DEFAULT 'GLOBAL',
    environment VARCHAR(32) DEFAULT 'PRODUCTION',
    rollout_type VARCHAR(32) DEFAULT 'FULL',
    rollout_percentage INTEGER DEFAULT 100,
    allowlist_tenants JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    requires_step_up_to_edit BOOLEAN DEFAULT TRUE,
    updated_by VARCHAR(64),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_status ON feature_flags(is_active);

CREATE TABLE IF NOT EXISTS system_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'SEV3',
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    affected_services JSONB DEFAULT '[]'::jsonb,
    affected_tenants_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    owner VARCHAR(128) DEFAULT 'SRE Team',
    current_status_summary TEXT,
    root_cause TEXT,
    mitigation_steps TEXT,
    postmortem_notes TEXT,
    timeline_events JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidents_status_sev ON system_incidents(status, severity, started_at);

CREATE TABLE IF NOT EXISTS backup_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_code VARCHAR(64) UNIQUE NOT NULL,
    type VARCHAR(32) DEFAULT 'DATABASE',
    scope VARCHAR(32) DEFAULT 'PLATFORM_FULL',
    tenant_id UUID,
    status VARCHAR(32) DEFAULT 'COMPLETED',
    size_bytes NUMERIC(16, 0) DEFAULT 0,
    storage_reference VARCHAR(255) NOT NULL,
    checksum_sha256 VARCHAR(64),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    retention_until TIMESTAMP WITH TIME ZONE NOT NULL,
    initiated_by VARCHAR(64) DEFAULT 'SYSTEM_SCHEDULER',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_tested_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_backups_status_started ON backup_records(status, started_at);

CREATE TABLE IF NOT EXISTS operational_runbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    runbook_code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    incident_type VARCHAR(64) NOT NULL,
    execution_mode VARCHAR(32) DEFAULT 'APPROVAL_REQUIRED',
    steps JSONB DEFAULT '[]'::jsonb,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
