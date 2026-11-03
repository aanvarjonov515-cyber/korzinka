export interface CustomerListItem {
  id: string;
  customer_number: string;
  customer_type: 'INDIVIDUAL' | 'BUSINESS';
  first_name: string;
  last_name: string;
  middle_name?: string;
  business_name?: string;
  full_name: string;
  phone: string;
  secondary_phone?: string;
  email?: string;
  address?: string;
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED' | 'ARCHIVED';
  total_purchase_amount: number;
  total_paid_amount: number;
  current_debt_amount: number;
  overdue_debt_amount: number;
  credit_limit?: number;
  available_credit?: number;
  next_payment_due_at?: string;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'INSUFFICIENT_HISTORY';
  tags?: string[];
  preferred_channel?: 'VOICE' | 'SMS' | 'TELEGRAM' | 'EMAIL';
  created_at: string;
}

export interface CustomerIdentityData {
  identity_type: string;
  pinfl: string;
  document_type: string;
  document_number: string;
  verification_status: string;
  is_masked: boolean;
}

export interface CustomerPaymentMethodData {
  id: string;
  provider: string;
  masked_pan: string;
  card_brand: string;
  is_primary: boolean;
  is_verified: boolean;
  status: string;
}

export interface Customer360Detail {
  overview: {
    id: string;
    customer_number: string;
    customer_type: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    business_name?: string;
    full_name: string;
    phone: string;
    secondary_phone?: string;
    email?: string;
    address?: string;
    status: string;
    preferred_channel?: string;
    total_purchase_amount: string;
    total_paid_amount: string;
    current_debt_amount: string;
    overdue_debt_amount: string;
    credit_limit?: string;
    available_credit?: string;
    next_payment_due_at?: string;
    risk_level?: string;
    tags?: string[];
    notes?: string;
    first_purchase_at?: string;
    last_purchase_at?: string;
  };
  identity?: CustomerIdentityData;
  purchases: Array<{
    id: string;
    sale_number: string;
    total: string;
    payment_status: string;
    status: string;
    created_at: string;
  }>;
  products: Array<{
    id: string;
    sku: string;
    name: string;
    total_quantity: number;
    total_amount: string;
    last_purchase_at: string;
  }>;
  debts: Array<{
    id: string;
    debt_number: string;
    principal_amount: string;
    paid_amount: string;
    outstanding_amount: string;
    due_at: string;
    status: string;
    collection_status: string;
    aging_bucket: string;
    priority: string;
    created_at: string;
  }>;
  payment_methods: CustomerPaymentMethodData[];
  scheduled_payments: Array<{
    id: string;
    amount: string;
    scheduled_for: string;
    status: string;
    attempt_count: number;
  }>;
  promises: Array<{
    id: string;
    debt_id: string;
    promised_amount: string;
    promised_at: string;
    status: string;
    source: string;
  }>;
  disputes: Array<{
    id: string;
    debt_id: string;
    reason_code: string;
    description: string;
    status: string;
    opened_at: string;
  }>;
  communications: Array<{
    id: string;
    channel: string;
    direction: string;
    result: string;
    summary?: string;
    started_at: string;
  }>;
  audit_logs: Array<{
    id: string;
    action: string;
    category: string;
    created_at: string;
    actor_id: string;
  }>;
}

export interface DebtItem {
  id: string;
  debt_number: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  sale_id: string;
  principal_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  currency: string;
  created_at: string;
  due_at: string;
  status: string;
  collection_status: string;
  aging_bucket: string;
  priority: string;
  risk_level?: string;
}

export interface DebtTimelineEvent {
  timestamp: string;
  event_type: string;
  title: string;
  description: string;
  badge_variant: string;
}
