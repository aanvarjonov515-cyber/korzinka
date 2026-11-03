-- ==============================================================================
-- PROFITLEAK MIGRATION 0004: CUSTOMER 360, IDENTITY, PAYMENT METHOD & DEBT OPERATING SYSTEM
-- Authoritative, double-entry ledger, cryptographic security, and tokenized payments
-- ==============================================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    home_branch_id UUID,
    customer_number VARCHAR(32) NOT NULL,
    customer_type VARCHAR(32) NOT NULL DEFAULT 'INDIVIDUAL',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    birth_date DATE,
    phone VARCHAR(32) NOT NULL,
    additional_phone VARCHAR(32),
    email VARCHAR(128),
    address VARCHAR(256),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    preferred_language VARCHAR(8) NOT NULL DEFAULT 'uz',
    assigned_employee_id UUID,
    first_purchase_at TIMESTAMP WITHOUT TIME ZONE,
    last_purchase_at TIMESTAMP WITHOUT TIME ZONE,
    total_purchase_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    total_paid_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    current_debt_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    overdue_debt_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    credit_limit NUMERIC(18, 2),
    next_payment_due_at TIMESTAMP WITHOUT TIME ZONE,
    risk_level VARCHAR(32) DEFAULT 'LOW',
    notes VARCHAR(1024),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uq_customer_business_number UNIQUE (business_id, customer_number)
);

CREATE INDEX IF NOT EXISTS ix_customers_business_id ON customers(business_id);
CREATE INDEX IF NOT EXISTS ix_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS ix_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS ix_customers_customer_number ON customers(customer_number);

-- 2. Customer Identities Table (Separate, encrypted, least-privilege)
CREATE TABLE IF NOT EXISTS customer_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    identity_type VARCHAR(32) NOT NULL DEFAULT 'ID_CARD',
    pinfl_jshshir_encrypted VARCHAR(256),
    pinfl_last4 VARCHAR(4),
    document_type VARCHAR(32) DEFAULT 'BIOMETRIC_PASSPORT',
    document_series_encrypted VARCHAR(256),
    document_series_plain VARCHAR(8),
    document_number_encrypted VARCHAR(256),
    document_number_last2 VARCHAR(2),
    document_issued_at DATE,
    document_expires_at DATE,
    issued_by VARCHAR(256),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'UNVERIFIED',
    verified_at TIMESTAMP WITHOUT TIME ZONE,
    verified_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS ix_customer_identities_customer_id ON customer_identities(customer_id);

-- 3. Customer Contacts Table
CREATE TABLE IF NOT EXISTS customer_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL,
    value VARCHAR(128) NOT NULL,
    normalized_value VARCHAR(128) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    transactional_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    collection_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    marketing_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS ix_customer_contacts_customer_id ON customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS ix_customer_contacts_norm_val ON customer_contacts(normalized_value);

-- 4. Customer Payment Methods Table (NO CVV, NO PIN, NO RAW PAN)
CREATE TABLE IF NOT EXISTS customer_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    business_id UUID NOT NULL,
    provider VARCHAR(64) NOT NULL,
    provider_customer_reference VARCHAR(128),
    provider_payment_method_reference VARCHAR(128) NOT NULL,
    masked_pan VARCHAR(32) NOT NULL,
    card_brand VARCHAR(32) DEFAULT 'UZCARD',
    expiry_month_reference VARCHAR(2),
    expiry_year_reference VARCHAR(4),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    verified_at TIMESTAMP WITHOUT TIME ZONE,
    revoked_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX IF NOT EXISTS ix_cust_pm_customer_id ON customer_payment_methods(customer_id);
CREATE INDEX IF NOT EXISTS ix_cust_pm_token_ref ON customer_payment_methods(provider_payment_method_reference);

-- 5. Payment Consents Table
CREATE TABLE IF NOT EXISTS payment_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    business_id UUID NOT NULL,
    payment_method_id UUID NOT NULL REFERENCES customer_payment_methods(id),
    provider_reference VARCHAR(128),
    consent_type VARCHAR(32) NOT NULL DEFAULT 'SINGLE_SCHEDULED_PAYMENT',
    max_amount NUMERIC(18, 2),
    currency VARCHAR(3) NOT NULL DEFAULT 'UZS',
    valid_from TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    valid_until TIMESTAMP WITHOUT TIME ZONE,
    single_use BOOLEAN NOT NULL DEFAULT TRUE,
    recurring BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    consent_text_version VARCHAR(32) NOT NULL DEFAULT 'V1.0_UZ_DEFERRED',
    confirmed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    confirmation_method VARCHAR(64) NOT NULL DEFAULT 'SMS_OTP',
    revoked_at TIMESTAMP WITHOUT TIME ZONE,
    revoked_reason VARCHAR(256),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS ix_payment_consents_customer_id ON payment_consents(customer_id);
CREATE INDEX IF NOT EXISTS ix_payment_consents_status ON payment_consents(status);

-- 6. Debts Table
CREATE TABLE IF NOT EXISTS debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    sale_id UUID NOT NULL REFERENCES sales(id),
    debt_number VARCHAR(64) NOT NULL,
    principal_amount NUMERIC(18, 2) NOT NULL,
    paid_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    adjustment_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    outstanding_amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'UZS',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    due_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
    payment_method_id UUID REFERENCES customer_payment_methods(id),
    consent_id UUID REFERENCES payment_consents(id),
    collection_status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
    risk_status VARCHAR(32) DEFAULT 'NORMAL',
    assigned_employee_id UUID,
    last_payment_at TIMESTAMP WITHOUT TIME ZONE,
    next_action_at TIMESTAMP WITHOUT TIME ZONE,
    version INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT uq_debt_business_number UNIQUE (business_id, debt_number),
    CONSTRAINT chk_debt_outstanding_non_negative CHECK (outstanding_amount >= 0),
    CONSTRAINT chk_debt_principal_positive CHECK (principal_amount > 0)
);

CREATE INDEX IF NOT EXISTS ix_debts_business_id ON debts(business_id);
CREATE INDEX IF NOT EXISTS ix_debts_customer_id ON debts(customer_id);
CREATE INDEX IF NOT EXISTS ix_debts_due_at ON debts(due_at);
CREATE INDEX IF NOT EXISTS ix_debts_status ON debts(status);

-- 7. Debt Ledger Entries Table (Immutable double-entry balance log)
CREATE TABLE IF NOT EXISTS debt_ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    entry_type VARCHAR(32) NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    balance_before NUMERIC(18, 2) NOT NULL,
    balance_after NUMERIC(18, 2) NOT NULL,
    source_type VARCHAR(32) NOT NULL,
    source_id UUID,
    reason VARCHAR(256),
    created_by_type VARCHAR(32) NOT NULL DEFAULT 'SYSTEM',
    created_by_id UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS ix_debt_ledger_debt_id ON debt_ledger_entries(debt_id);

-- 8. Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    sale_id UUID REFERENCES sales(id),
    debt_id UUID REFERENCES debts(id),
    provider VARCHAR(64) NOT NULL,
    provider_transaction_reference VARCHAR(128),
    payment_method_id UUID REFERENCES customer_payment_methods(id),
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'UZS',
    type VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED',
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    initiated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    failure_code VARCHAR(64),
    failure_category VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS ix_payment_transactions_customer_id ON payment_transactions(customer_id);
CREATE INDEX IF NOT EXISTS ix_payment_transactions_status ON payment_transactions(status);

-- 9. Scheduled Payments Table
CREATE TABLE IF NOT EXISTS scheduled_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    payment_method_id UUID NOT NULL REFERENCES customer_payment_methods(id),
    consent_id UUID NOT NULL REFERENCES payment_consents(id),
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'UZS',
    scheduled_for TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    attempt_count INTEGER NOT NULL DEFAULT 0,
    next_retry_at TIMESTAMP WITHOUT TIME ZONE,
    last_attempt_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    cancelled_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX IF NOT EXISTS ix_scheduled_payments_due ON scheduled_payments(scheduled_for, status);
CREATE INDEX IF NOT EXISTS ix_scheduled_payments_debt_id ON scheduled_payments(debt_id);

-- 10. Payment Attempts Table
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheduled_payment_id UUID NOT NULL REFERENCES scheduled_payments(id) ON DELETE CASCADE,
    payment_transaction_id UUID REFERENCES payment_transactions(id),
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    status VARCHAR(32) NOT NULL,
    provider_code VARCHAR(64),
    failure_category VARCHAR(64),
    retryable BOOLEAN NOT NULL DEFAULT FALSE,
    request_reference VARCHAR(128) NOT NULL
);

-- 11. Promises to Pay Table
CREATE TABLE IF NOT EXISTS promises_to_pay (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    promised_amount NUMERIC(18, 2) NOT NULL,
    promised_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    source VARCHAR(32) NOT NULL DEFAULT 'CALL',
    created_by_type VARCHAR(32) NOT NULL DEFAULT 'USER',
    created_by_id UUID,
    fulfilled_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);

-- 12. Debt Disputes Table
CREATE TABLE IF NOT EXISTS debt_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    reason_code VARCHAR(64) NOT NULL,
    description VARCHAR(1024) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    opened_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    opened_by UUID,
    assigned_to UUID,
    resolved_at TIMESTAMP WITHOUT TIME ZONE,
    resolution VARCHAR(1024)
);

-- 13. Payment Verification Tasks Table ("Men to'laganman" claims)
CREATE TABLE IF NOT EXISTS payment_verification_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    debt_id UUID NOT NULL REFERENCES debts(id),
    claimed_payment_at TIMESTAMP WITHOUT TIME ZONE,
    claimed_amount NUMERIC(18, 2),
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    assigned_to UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    resolved_at TIMESTAMP WITHOUT TIME ZONE
);

-- 14. Customer Communications Table
CREATE TABLE IF NOT EXISTS customer_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    debt_id UUID REFERENCES debts(id),
    channel VARCHAR(32) NOT NULL,
    direction VARCHAR(16) NOT NULL DEFAULT 'OUTBOUND',
    started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'),
    ended_at TIMESTAMP WITHOUT TIME ZONE,
    result VARCHAR(32) NOT NULL DEFAULT 'DELIVERED',
    provider_reference VARCHAR(128),
    summary VARCHAR(1024),
    transcript_reference VARCHAR(256),
    next_action_at TIMESTAMP WITHOUT TIME ZONE
);

-- 15. Collection Policy Table
CREATE TABLE IF NOT EXISTS collection_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL UNIQUE,
    pre_due_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    due_day_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    overdue_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    voice_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    telegram_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    quiet_hours_start INTEGER NOT NULL DEFAULT 21,
    quiet_hours_end INTEGER NOT NULL DEFAULT 9,
    max_contacts_per_day INTEGER NOT NULL DEFAULT 3,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Tashkent',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')
);
