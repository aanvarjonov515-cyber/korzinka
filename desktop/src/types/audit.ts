export type ActorType =
  | 'USER'
  | 'SYSTEM'
  | 'AI_AGENT'
  | 'SERVICE'
  | 'WEBHOOK'
  | 'WORKER'
  | 'API_KEY';

export type AuditResult =
  | 'SUCCESS'
  | 'FAILED'
  | 'DENIED'
  | 'CANCELLED'
  | 'PARTIAL';

export type AuditCategory =
  | 'AUTH'
  | 'USER'
  | 'ROLE'
  | 'PERMISSION'
  | 'CUSTOMER'
  | 'SALES'
  | 'PAYMENT'
  | 'DEBT'
  | 'INVENTORY'
  | 'FINANCE'
  | 'SUPPLIER'
  | 'SECURITY'
  | 'AI'
  | 'CAMERA'
  | 'INTEGRATION'
  | 'SYSTEM'
  | 'ADMIN';

export interface AuditLogItem {
  id: string;
  eventId: string;
  tenantId: string;
  businessId?: string;
  branchId?: string;
  actorType: ActorType;
  actorId?: string;
  actorUserId?: string;
  action: string;
  category: AuditCategory;
  resourceType: string;
  resourceId?: string;
  result: AuditResult;
  reason?: string;
  requestId?: string;
  correlationId?: string;
  ipAddress?: string;
  deviceId?: string;
  userAgent?: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  metadataJson?: Record<string, unknown>;
  previousHash?: string;
  entryHash: string;
  createdAt: string;
}

export interface AuditListResponse {
  items: AuditLogItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AuditIntegrityCheck {
  isValid: boolean;
  verifiedCount: number;
  error?: string;
  checkedAt: string;
}
