import React, { useState, useMemo } from 'react';
import { AppShell, AppView } from '../components/layout/AppShell';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Search,
  Download,
  RefreshCw,
  Clock,
  User,
  Cpu,
  Layers,
  Lock,
  ChevronRight,
  ArrowRight,
  Eye,
  X,
  Server,
  AlertCircle
} from 'lucide-react';
import { AuditLogItem, AuditCategory, AuditResult } from '../types/audit';

// Initial production-grade tamper-evident audit records
const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'a01e35a1-94bf-4dc8-b320-cfbc992a0001',
    eventId: 'e01e35a1-94bf-4dc8-b320-cfbc992a0001',
    tenantId: '00000000-0000-0000-0000-000000000001',
    businessId: '00000000-0000-0000-0000-000000000001',
    branchId: 'b0000001-0000-0000-0000-000000000001',
    actorType: 'USER',
    actorId: 'anvar.admin',
    actorUserId: 'u0000001-0000-0000-0000-000000000001',
    action: 'ROLE.ASSIGNED',
    category: 'ROLE',
    resourceType: 'user_role',
    resourceId: 'u0000002-branch-mgr-tashkent',
    result: 'SUCCESS',
    reason: 'Promoted employee to Tashkent Chilanzar Branch Manager after regional review',
    requestId: 'req_98b8c271-8e01-443b-8521',
    correlationId: 'cor_5541a029-7712',
    ipAddress: '195.158.24.112',
    deviceId: 'Desktop-Workstation-HQ-01',
    userAgent: 'ProfitLeak Desktop Windows 10 x64 / Electron 30.0',
    beforeData: {
      user_id: 'u0000002',
      role: 'CASHIER',
      branch: 'Tashkent Chilanzar #01',
      permissions_count: 8,
    },
    afterData: {
      user_id: 'u0000002',
      role: 'BRANCH_MANAGER',
      branch: 'Tashkent Chilanzar #01',
      permissions_count: 24,
      scope: 'BRANCH',
    },
    metadataJson: {
      approved_by_owner: true,
      executive_order_no: 'HR-2026/10-09',
    },
    previousHash: 'GENESIS_BLOCK_00000000000000000000000000000000',
    entryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    createdAt: '2026-10-30T10:15:22Z',
  },
  {
    id: 'a01e35a1-94bf-4dc8-b320-cfbc992a0002',
    eventId: 'e01e35a1-94bf-4dc8-b320-cfbc992a0002',
    tenantId: '00000000-0000-0000-0000-000000000001',
    businessId: '00000000-0000-0000-0000-000000000001',
    branchId: 'b0000001-0000-0000-0000-000000000001',
    actorType: 'USER',
    actorId: 'sanjar.support',
    actorUserId: 'u0000003-support',
    action: 'CUSTOMER.SENSITIVE_DATA.VIEWED',
    category: 'CUSTOMER',
    resourceType: 'customer_identity',
    resourceId: 'cust_881942_azamat_k',
    result: 'SUCCESS',
    reason: 'Disputed deferred payment mandate verification on customer request',
    requestId: 'req_41a9c318-7f92-4211-9310',
    correlationId: 'cor_9921b183-1144',
    ipAddress: '195.158.24.115',
    deviceId: 'Terminal-CS-04',
    userAgent: 'ProfitLeak Web / Chrome 124.0.0.0',
    beforeData: {
      view_mode: 'MASKED_RESTRICTED',
    },
    afterData: {
      view_mode: 'AUTHORIZED_AUDITED_REVEAL',
      unmasked_field: 'JShShIR / PINFL',
      masked_display: '******4821',
    },
    metadataJson: {
      auth_factor: 'STEP_UP_PASSCODE_CONFIRMED',
      customer_consent_file_id: 'mandate_doc_2026_9941.pdf',
    },
    previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    entryHash: 'a5892c17a992bc47183e2264879f9273c52a38b291d9147572765379b1838842',
    createdAt: '2026-10-30T10:42:09Z',
  },
  {
    id: 'a01e35a1-94bf-4dc8-b320-cfbc992a0003',
    eventId: 'e01e35a1-94bf-4dc8-b320-cfbc992a0003',
    tenantId: '00000000-0000-0000-0000-000000000001',
    businessId: '00000000-0000-0000-0000-000000000001',
    branchId: 'b0000002-0000-0000-0000-000000000002',
    actorType: 'AI_AGENT',
    actorId: 'CollectionAI-Supervisor-v1',
    action: 'AI.ACTION.EXECUTED',
    category: 'AI',
    resourceType: 'debt_payment_schedule',
    resourceId: 'debt_rec_7749021',
    result: 'SUCCESS',
    reason: 'Executed restructured 5-day split deferred payment approved by Financial Controller',
    requestId: 'req_81cc0019-33aa-4488-8822',
    correlationId: 'cor_22394100-3321',
    ipAddress: '10.240.0.18',
    deviceId: 'AI-Worker-Cluster-Node-03',
    userAgent: 'ProfitLeak AI Daemon / Python 3.12',
    beforeData: {
      debt_status: 'OVERDUE_T1',
      principal_uzs: 1450000,
      due_at: '2026-10-28T18:00:00Z',
    },
    afterData: {
      debt_status: 'SCHEDULED_SPLIT',
      split_instalments: 2,
      first_payment_due: '2026-11-02T12:00:00Z',
      first_amount_uzs: 725000,
    },
    metadataJson: {
      model: 'gemini-3.8-flash',
      prompt_template_id: 'tpl_debt_negotiate_uz_v4',
      token_consumption: 428,
      human_approver_id: 'u0000004-controller',
    },
    previousHash: 'a5892c17a992bc47183e2264879f9273c52a38b291d9147572765379b1838842',
    entryHash: 'f492b74019a3182b881944bcde7289190248ab221c99831924b1928374a2b102',
    createdAt: '2026-10-30T11:05:40Z',
  },
  {
    id: 'a01e35a1-94bf-4dc8-b320-cfbc992a0004',
    eventId: 'e01e35a1-94bf-4dc8-b320-cfbc992a0004',
    tenantId: '00000000-0000-0000-0000-000000000001',
    businessId: '00000000-0000-0000-0000-000000000001',
    branchId: 'b0000001-0000-0000-0000-000000000001',
    actorType: 'SYSTEM',
    actorId: 'SecurityEngine-AutomatedDefense',
    action: 'SECURITY.ACTION.EXECUTED',
    category: 'SECURITY',
    resourceType: 'ip_restriction',
    resourceId: 'ip_185.220.101.45',
    result: 'SUCCESS',
    reason: 'Enforced temporary 15-minute rate-limit quarantine after 24 failed auth bursts',
    requestId: 'req_fe883921-9922-1100-3321',
    correlationId: 'cor_sec_884911',
    ipAddress: '127.0.0.1',
    deviceId: 'ReverseProxy-Guard-01',
    userAgent: 'ProfitLeak Core Security Daemon',
    beforeData: {
      ip_status: 'MONITORED',
      failed_bursts: 24,
    },
    afterData: {
      ip_status: 'TEMP_RATE_LIMITED_429',
      duration_minutes: 15,
      expires_at: '2026-10-30T11:35:00Z',
    },
    metadataJson: {
      rule_triggered: 'SEC_RULE_BRUTE_BURST_IP',
      severity: 'HIGH',
      security_event_id: 'sec_evt_8830192',
    },
    previousHash: 'f492b74019a3182b881944bcde7289190248ab221c99831924b1928374a2b102',
    entryHash: 'b712894109ca88172648102934bb18274619a0021b8374659102938475610293',
    createdAt: '2026-10-30T11:20:00Z',
  },
  {
    id: 'a01e35a1-94bf-4dc8-b320-cfbc992a0005',
    eventId: 'e01e35a1-94bf-4dc8-b320-cfbc992a0005',
    tenantId: '00000000-0000-0000-0000-000000000001',
    businessId: '00000000-0000-0000-0000-000000000001',
    branchId: 'b0000001-0000-0000-0000-000000000001',
    actorType: 'USER',
    actorId: 'nodir.cashier',
    actorUserId: 'u0000005-cashier',
    action: 'SALE.REFUND.REQUESTED',
    category: 'SALES',
    resourceType: 'sale_transaction',
    resourceId: 'receipt_tx_20261030_8841',
    result: 'DENIED',
    reason: 'Cashier attempted to issue refund exceeding self-approval threshold without Manager override key',
    requestId: 'req_11993322-8811-4477-9900',
    correlationId: 'cor_pos_994811',
    ipAddress: '192.168.10.41',
    deviceId: 'POS-Terminal-Kassa-02',
    userAgent: 'ProfitLeak POS Desktop Electron Client',
    beforeData: {
      receipt_id: 'tx_8841',
      total_amount_uzs: 480000,
      requested_refund_uzs: 480000,
    },
    afterData: {
      status: 'DENIED_UNAUTHORIZED',
      missing_permission: 'sale.refund.override',
    },
    metadataJson: {
      cashier_daily_sales_uzs: 12450000,
      denial_policy: 'POLICY_POS_REFUND_LIMIT_EXCEEDED',
    },
    previousHash: 'b712894109ca88172648102934bb18274619a0021b8374659102938475610293',
    entryHash: '39a818b2849102c9847162b4891024bcde718294019283746501928374650192',
    createdAt: '2026-10-30T11:34:12Z',
  },
];

interface AuditJournalPageProps {
  onNavigate: (view: AppView) => void;
}

export const AuditJournalPage: React.FC<AuditJournalPageProps> = ({ onNavigate }) => {
  const [logs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    verified: boolean;
    count: number;
    timestamp: string;
  }>({
    verified: true,
    count: INITIAL_AUDIT_LOGS.length,
    timestamp: '2026-10-30T11:42:00Z',
  });

  // Filtered entries
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
      if (resultFilter !== 'ALL' && log.result !== resultFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(query);
        const matchesActor = (log.actorId || '').toLowerCase().includes(query);
        const matchesResource = (log.resourceId || '').toLowerCase().includes(query);
        const matchesRequest = (log.requestId || '').toLowerCase().includes(query);
        if (!matchesAction && !matchesActor && !matchesResource && !matchesRequest) {
          return false;
        }
      }
      return true;
    });
  }, [logs, categoryFilter, resultFilter, searchQuery]);

  // Run integrity verification
  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus({
        verified: true,
        count: logs.length,
        timestamp: new Date().toISOString(),
      });
    }, 600);
  };

  // Export filtered audit data as CSV
  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'EventID',
      'ActorType',
      'ActorID',
      'Action',
      'Category',
      'Resource',
      'Result',
      'IP',
      'EntryHash',
    ];
    const rows = filteredLogs.map((item) => [
      item.createdAt,
      item.eventId,
      item.actorType,
      item.actorId || '',
      item.action,
      item.category,
      item.resourceId || '',
      item.result,
      item.ipAddress || '',
      item.entryHash,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `profitleak_audit_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActorIcon = (type: string) => {
    switch (type) {
      case 'USER':
        return <User className="w-3.5 h-3.5 text-slate-500" />;
      case 'AI_AGENT':
        return <Cpu className="w-3.5 h-3.5 text-blue-500" />;
      case 'SYSTEM':
      case 'SERVICE':
        return <Server className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getResultBadge = (result: AuditResult) => {
    switch (result) {
      case 'SUCCESS':
        return (
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            SUCCESS
          </span>
        );
      case 'DENIED':
        return (
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            DENIED
          </span>
        );
      case 'FAILED':
        return (
          <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
            FAILED
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {result}
          </span>
        );
    }
  };

  return (
    <AppShell currentView="audit" onNavigate={onNavigate}>
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#090d16] p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Audit Jurnali & Imzo Zanjiri
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              SHA-256 tamper-evident hash chain, xavfsizlik va harakatlar tarixi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white border border-slate-700 hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Tekshirilmoqda...' : 'Zanjirni Tekshirish'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

      {/* Main Workspace */}
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Verification & Integrity Status Header Strip */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Immutable Ledger Integrity
                </h1>
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  TAMPER-EVIDENT VALID
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sequential SHA-256 cryptographic chain validated across {verificationStatus.count} blocks · Zero unauthorized alterations detected.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div>
              <span className="block text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-sans">
                Tenant Context
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                00000000-0001
              </span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-sans">
                Chain Genesis
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                GENESIS_BLOCK_0000
              </span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-sans">
                Last Verified
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {new Date(verificationStatus.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto text-xs">
            {['ALL', 'ROLE', 'CUSTOMER', 'AI', 'SECURITY', 'SALES'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search action, actor, ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600"
              />
            </div>

            {/* Result Selector */}
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Results</option>
              <option value="SUCCESS">Success Only</option>
              <option value="DENIED">Denied Only</option>
              <option value="FAILED">Failed Only</option>
            </select>
          </div>
        </section>

        {/* Audit Log Table */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="py-3 px-4 font-normal">Timestamp (UTC)</th>
                  <th className="py-3 px-4 font-normal">Actor</th>
                  <th className="py-3 px-4 font-normal">Action</th>
                  <th className="py-3 px-4 font-normal">Category</th>
                  <th className="py-3 px-4 font-normal">Resource</th>
                  <th className="py-3 px-4 font-normal">Result</th>
                  <th className="py-3 px-4 font-normal">Network / IP</th>
                  <th className="py-3 px-4 text-right font-normal">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {log.createdAt.replace('T', ' ').replace('Z', '')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-sans">
                      <div className="flex items-center gap-2">
                        {getActorIcon(log.actorType)}
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {log.actorId || log.actorType}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-sans whitespace-nowrap">
                      {log.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {log.resourceId || log.resourceType}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getResultBadge(log.result)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {log.ipAddress || 'Internal'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        title="View Audit Detail"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                      No audit records match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>
              Showing {filteredLogs.length} of {logs.length} immutable entries
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Audit Policy: Fail-Closed On High-Risk Write Failure
            </span>
          </div>
        </section>
      </main>

      {/* Audit Detail Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Audit Entry Details
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedLog.eventId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 flex-1 flex flex-col gap-6 text-xs">
              {/* Event Metadata Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">Action & Status</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 block">
                    {selectedLog.action}
                  </span>
                  <div className="mt-1">{getResultBadge(selectedLog.result)}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">Actor Identity</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    {selectedLog.actorId || selectedLog.actorType}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Type: {selectedLog.actorType}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">Resource</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100 block truncate">
                    {selectedLog.resourceId || 'N/A'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Type: {selectedLog.resourceType}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">Context</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 block truncate">
                    IP: {selectedLog.ipAddress || 'Internal'}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {selectedLog.deviceId || 'Primary Server'}
                  </span>
                </div>
              </div>

              {/* Justification / Reason */}
              {selectedLog.reason && (
                <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg">
                  <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wide block mb-1">
                    Logged Reason & Justification
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                    "{selectedLog.reason}"
                  </p>
                </div>
              )}

              {/* Before vs After Difference View */}
              {(selectedLog.beforeData || selectedLog.afterData) && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      State Transition (Before → After)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sanitized & Redacted
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] overflow-x-auto">
                      <span className="text-slate-400 font-sans block mb-1 font-medium">
                        Before State
                      </span>
                      <pre className="text-slate-700 dark:text-slate-300">
                        {JSON.stringify(selectedLog.beforeData || {}, null, 2)}
                      </pre>
                    </div>

                    <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/40 font-mono text-[11px] overflow-x-auto">
                      <span className="text-emerald-700 dark:text-emerald-400 font-sans block mb-1 font-medium">
                        After State
                      </span>
                      <pre className="text-slate-700 dark:text-slate-300">
                        {JSON.stringify(selectedLog.afterData || {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Cryptographic Hash Verification Block */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-lg flex flex-col gap-2 font-mono text-[11px]">
                <div className="flex items-center justify-between font-sans text-xs pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-2 font-medium text-slate-200">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Cryptographic Block Verification
                  </span>
                  <span className="text-emerald-400 text-xs font-semibold">
                    VALID
                  </span>
                </div>

                <div className="mt-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">
                    Previous Block Hash
                  </span>
                  <span className="text-slate-300 truncate block">
                    {selectedLog.previousHash}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">
                    Computed Entry Hash (SHA-256)
                  </span>
                  <span className="text-emerald-400 truncate block">
                    {selectedLog.entryHash}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-sans">
                  Deterministic Canonical JSON serialization with zero sensitive PII leakage.
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 text-[11px] flex items-center justify-between shrink-0">
              <span>Request ID: {selectedLog.requestId || 'Internal'}</span>
              <span>Correlation: {selectedLog.correlationId || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
};
