-- ============================================================================
-- PROFITLEAK — SECTION 9: MULTI-AGENT AI INTELLIGENCE PLATFORM SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. AI Agents Registry
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    role VARCHAR(128) NOT NULL,
    description TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'HEALTHY',
    default_model VARCHAR(64) NOT NULL DEFAULT 'gemini-flash-latest',
    fallback_models JSONB DEFAULT '["gemini-3.1-flash-lite", "gemini-3.8-flash"]'::jsonb,
    capability_set JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_scope JSONB NOT NULL DEFAULT '{"allowed": [], "restricted": []}'::jsonb,
    allowed_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
    max_context_size INT DEFAULT 8192,
    timeout_policy JSONB DEFAULT '{"request_timeout_ms": 10000, "tool_timeout_ms": 5000}'::jsonb,
    cost_policy JSONB DEFAULT '{"max_daily_budget_usd": 10.0, "expensive_model_threshold_usd": 0.05}'::jsonb,
    enabled BOOLEAN DEFAULT TRUE,
    latency_ms INT DEFAULT 180,
    error_rate NUMERIC(5,2) DEFAULT 0.00,
    request_count INT DEFAULT 0,
    success_rate NUMERIC(5,2) DEFAULT 100.00,
    current_task TEXT,
    last_task TEXT,
    last_success_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_error_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX IF NOT EXISTS idx_ai_agents_code ON ai_agents(agent_code);

-- 2. AI Capabilities
CREATE TABLE IF NOT EXISTS ai_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capability_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    required_tools JSONB DEFAULT '[]'::jsonb,
    data_requirements JSONB DEFAULT '[]'::jsonb
);

-- 3. AI Tools
CREATE TABLE IF NOT EXISTS ai_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_name VARCHAR(64) UNIQUE NOT NULL,
    capability VARCHAR(64) NOT NULL,
    category VARCHAR(32) NOT NULL, -- READ_ONLY, PROPOSE_ACTION, CREATE_TASK, HIGH_RISK_ACTION
    allowed_agents JSONB DEFAULT '[]'::jsonb,
    input_schema JSONB DEFAULT '{}'::jsonb,
    output_schema JSONB DEFAULT '{}'::jsonb,
    risk_level VARCHAR(32) NOT NULL DEFAULT 'LOW',
    requires_approval BOOLEAN DEFAULT FALSE,
    read_only BOOLEAN DEFAULT TRUE
);

-- 4. AI Tasks
CREATE TABLE IF NOT EXISTS ai_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL,
    agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
    capability VARCHAR(64) NOT NULL,
    task_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED', -- QUEUED, RUNNING, WAITING_TOOL, WAITING_APPROVAL, COMPLETED, FAILED, CANCELLED, FALLBACK_IN_PROGRESS
    priority VARCHAR(16) NOT NULL DEFAULT 'NORMAL',
    input_reference JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latency_ms INT DEFAULT 240,
    model_used VARCHAR(64) NOT NULL,
    provider VARCHAR(64) NOT NULL DEFAULT 'google',
    token_usage JSONB DEFAULT '{"input_tokens": 0, "output_tokens": 0}'::jsonb,
    estimated_cost NUMERIC(10,4) DEFAULT 0.0000,
    error_code VARCHAR(64),
    result_summary TEXT,
    facts_used JSONB DEFAULT '[]'::jsonb,
    tools_called JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ai_tasks_business_status ON ai_tasks(business_id, status, started_at);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_agent ON ai_tasks(agent_id, started_at);

-- 5. AI Action Candidates
CREATE TABLE IF NOT EXISTS ai_action_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL,
    agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
    action_type VARCHAR(64) NOT NULL,
    target_type VARCHAR(64) NOT NULL,
    target_id VARCHAR(64),
    reason TEXT NOT NULL,
    priority VARCHAR(16) NOT NULL DEFAULT 'NORMAL',
    confidence NUMERIC(4,2) DEFAULT 0.95,
    financial_impact NUMERIC(15,2) DEFAULT 0.00,
    risk_level VARCHAR(32) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(32) NOT NULL DEFAULT 'PROPOSED', -- PROPOSED, PENDING_APPROVAL, APPROVED, REJECTED, EXECUTING, COMPLETED, FAILED, CANCELLED, EXPIRED
    requires_approval BOOLEAN DEFAULT TRUE,
    action_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID,
    executed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_actions_business_status ON ai_action_candidates(business_id, status, priority);

-- 6. AI Agent Messages (Inter-Agent Structured Comms)
CREATE TABLE IF NOT EXISTS ai_agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_agent VARCHAR(64) NOT NULL,
    to_agent VARCHAR(64) NOT NULL,
    task_id UUID,
    message_type VARCHAR(32) NOT NULL, -- FACT_REQUEST, FACT_RESPONSE, ANALYSIS_RESULT, RECOMMENDATION, ESCALATION, FAILURE_NOTICE, HANDOFF
    payload_reference JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_task ON ai_agent_messages(task_id, created_at);

-- 7. AI Prompt Templates
CREATE TABLE IF NOT EXISTS ai_prompt_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_code VARCHAR(64) NOT NULL,
    prompt_name VARCHAR(128) NOT NULL,
    version VARCHAR(16) NOT NULL DEFAULT '1.0.0',
    system_instruction TEXT NOT NULL,
    required_tools JSONB DEFAULT '[]'::jsonb,
    output_schema JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. AI Incidents
CREATE TABLE IF NOT EXISTS ai_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(256) NOT NULL,
    incident_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- OPEN, INVESTIGATING, MITIGATED, RESOLVED
    affected_agents JSONB DEFAULT '[]'::jsonb,
    provider VARCHAR(64) NOT NULL DEFAULT 'google',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    mitigation_summary TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_incidents_status ON ai_incidents(status, started_at);

-- 9. AI Cost & Usage Records
CREATE TABLE IF NOT EXISTS ai_cost_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL,
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    input_tokens INT DEFAULT 0,
    output_tokens INT DEFAULT 0,
    estimated_cost NUMERIC(10,4) DEFAULT 0.0000,
    request_count INT DEFAULT 0,
    successful_tasks INT DEFAULT 0,
    failed_tasks INT DEFAULT 0,
    UNIQUE(business_id, agent_id, date)
);
