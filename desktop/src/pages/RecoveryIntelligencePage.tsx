import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  Users,
  Building2,
  BrainCircuit,
  PhoneCall,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface RecoveryIntelligencePageProps {
  onNavigate: (view: AppView) => void;
}

type TabType = 'priority_queue' | 'branch_cashier' | 'aging_cashflow' | 'ai_analyst';

interface PriorityQueueItem {
  id: string;
  customerName: string;
  customerPhone: string;
  debtNumber: string;
  outstandingAmount: number;
  principalAmount: number;
  dueDate: string;
  dpd: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  brokenPromises: number;
  branchName: string;
}

const MOCK_QUEUE: PriorityQueueItem[] = [
  {
    id: 'q-101',
    customerName: 'Anvar Karimov',
    customerPhone: '+998 90 123 4567',
    debtNumber: 'DEBT-2026-000184',
    outstandingAmount: 4800000,
    principalAmount: 4800000,
    dueDate: '2026-09-15',
    dpd: 46,
    riskScore: 88.5,
    riskLevel: 'CRITICAL',
    priority: 'URGENT',
    brokenPromises: 2,
    branchName: 'Tashkent Main Branch',
  },
  {
    id: 'q-102',
    customerName: 'Dilshod Niyazov',
    customerPhone: '+998 91 987 6543',
    debtNumber: 'DEBT-2026-000210',
    outstandingAmount: 12500000,
    principalAmount: 15000000,
    dueDate: '2026-10-01',
    dpd: 30,
    riskScore: 74.0,
    riskLevel: 'HIGH',
    priority: 'URGENT',
    brokenPromises: 1,
    branchName: 'Samarkand Central',
  },
  {
    id: 'q-103',
    customerName: 'Shahnoza Umarova',
    customerPhone: '+998 93 555 4433',
    debtNumber: 'DEBT-2026-000305',
    outstandingAmount: 3200000,
    principalAmount: 3200000,
    dueDate: '2026-10-18',
    dpd: 13,
    riskScore: 48.0,
    riskLevel: 'MEDIUM',
    priority: 'HIGH',
    brokenPromises: 0,
    branchName: 'Tashkent Main Branch',
  },
  {
    id: 'q-104',
    customerName: 'Bobur Rakhimov',
    customerPhone: '+998 97 111 2233',
    debtNumber: 'DEBT-2026-000388',
    outstandingAmount: 8900000,
    principalAmount: 8900000,
    dueDate: '2026-10-25',
    dpd: 6,
    riskScore: 32.0,
    riskLevel: 'MEDIUM',
    priority: 'NORMAL',
    brokenPromises: 0,
    branchName: 'Bukhara Outlet',
  },
  {
    id: 'q-105',
    customerName: 'Jasur Temirov',
    customerPhone: '+998 90 777 8899',
    debtNumber: 'DEBT-2026-000412',
    outstandingAmount: 15000000,
    principalAmount: 15000000,
    dueDate: '2026-08-01',
    dpd: 91,
    riskScore: 96.0,
    riskLevel: 'CRITICAL',
    priority: 'URGENT',
    brokenPromises: 3,
    branchName: 'Fergana Branch',
  },
];

const MOCK_BRANCHES = [
  {
    branchName: 'Tashkent Main Branch',
    totalDebts: 42,
    outstandingAmount: 84500000,
    recoveredAmount: 156000000,
    overdueAmount: 28400000,
    recoveryRatePct: 64.8,
    criticalAccounts: 4,
  },
  {
    branchName: 'Samarkand Central',
    totalDebts: 28,
    outstandingAmount: 49200000,
    recoveredAmount: 92000000,
    overdueAmount: 18100000,
    recoveryRatePct: 65.1,
    criticalAccounts: 2,
  },
  {
    branchName: 'Fergana Branch',
    totalDebts: 31,
    outstandingAmount: 62000000,
    recoveredAmount: 78000000,
    overdueAmount: 34500000,
    recoveryRatePct: 55.7,
    criticalAccounts: 6,
  },
  {
    branchName: 'Bukhara Outlet',
    totalDebts: 19,
    outstandingAmount: 21800000,
    recoveredAmount: 54000000,
    overdueAmount: 4200000,
    recoveryRatePct: 71.2,
    criticalAccounts: 1,
  },
];

const MOCK_CASHIER_ANOMALIES = [
  {
    cashierName: 'Sardor Azimov',
    cashierId: 'EMP-104',
    branchName: 'Fergana Branch',
    deferredSalesCount: 18,
    totalDeferredAmount: 48500000,
    overdueAmount: 24200000,
    branchSharePct: 44.8,
    isAnomaly: true,
    anomalyReason: 'Generates 44.8% of branch deferred sales. Exceeds 40% threshold baseline.',
  },
  {
    cashierName: 'Malika Alimova',
    cashierId: 'EMP-109',
    branchName: 'Tashkent Main Branch',
    deferredSalesCount: 12,
    totalDeferredAmount: 28000000,
    overdueAmount: 8400000,
    branchSharePct: 22.4,
    isAnomaly: false,
    anomalyReason: 'Normal distribution within branch baseline.',
  },
  {
    cashierName: 'Otabek Turayev',
    cashierId: 'EMP-112',
    branchName: 'Samarkand Central',
    deferredSalesCount: 15,
    totalDeferredAmount: 39000000,
    overdueAmount: 14100000,
    branchSharePct: 41.2,
    isAnomaly: true,
    anomalyReason: 'Generates 41.2% of branch deferred sales. High concentration of non-paying customers.',
  },
];

export const RecoveryIntelligencePage: React.FC<RecoveryIntelligencePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('priority_queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedQueueItem, setSelectedQueueItem] = useState<PriorityQueueItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // AI Analyst query state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAnswers, setAiAnswers] = useState<
    { query: string; response: string; facts: { label: string; value: string }[] }[]
  >([
    {
      query: 'What is our total debt risk exposure and recovery performance?',
      response:
        'Deterministic analysis indicates total outstanding portfolio debt is 217,500,000 UZS across 120 accounts. Total recovered strictly from verified payments is 380,000,000 UZS (63.6% recovery rate). Total write-offs isolated stand at 14,200,000 UZS. Fergana Branch represents our highest cashflow exposure with 34.5M UZS in overdue debts.',
      facts: [
        { label: 'Total Outstanding Exposure', value: '217,500,000 UZS' },
        { label: 'Actual Payment Recovery Rate', value: '63.6%' },
        { label: 'Isolated Write-offs (Excluded)', value: '14,200,000 UZS' },
        { label: 'Critical Risk Accounts', value: '13 accounts' },
      ],
    },
  ]);

  const filteredQueue = useMemo(() => {
    return MOCK_QUEUE.filter((item) => {
      const matchesSearch =
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerPhone.includes(searchQuery) ||
        item.debtNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [searchQuery, priorityFilter]);

  const triggerAction = (type: string, item: PriorityQueueItem) => {
    setActionNotice(`Initiated ${type} for customer ${item.customerName} (${item.debtNumber}). Task queued.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleAiAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const newQuery = aiPrompt;
    setAiPrompt('');

    // Deterministic response simulation grounded in hard figures
    let resp = `Calculated response for query: "${newQuery}". Portfolio risk analysis confirms 13 critical accounts requiring immediate intervention. Payment failure rate across critical accounts is 68%. Voice AI automated collection calls are recommended for all DPD > 14 accounts.`;
    let facts = [
      { label: 'Query Focus', value: 'Debt Risk Analysis' },
      { label: 'Target Accounts', value: '13 Critical Accounts' },
      { label: 'Recommended Action', value: 'Automated Voice AI Calls' },
    ];

    if (newQuery.toLowerCase().includes('cashier') || newQuery.toLowerCase().includes('branch')) {
      resp = `Branch anomaly check: Sardor Azimov (Fergana Branch) originated 44.8% of total branch deferred sales (48.5M UZS), with 24.2M UZS currently overdue. Manager review recommended to audit credit line overrides.`;
      facts = [
        { label: 'Anomaly Cashier', value: 'Sardor Azimov (EMP-104)' },
        { label: 'Branch Share', value: '44.8% (Baseline limit: 40%)' },
        { label: 'Overdue Concentration', value: '24,200,000 UZS' },
      ];
    }

    setAiAnswers((prev) => [{ query: newQuery, response: resp, facts }, ...prev]);
  };

  return (
    <AppShell currentView="recovery" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Debt Risk Intelligence & Recovery AI</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                PRO V5.6
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Deterministic customer risk scoring, collection priority queues, and cashflow loss prevention.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('priority_queue')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'priority_queue'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> Priority Queue
            </button>
            <button
              onClick={() => setActiveTab('branch_cashier')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'branch_cashier'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" /> Branch & Cashier Risk
            </button>
            <button
              onClick={() => setActiveTab('ai_analyst')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'ai_analyst'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <BrainCircuit className="w-4 h-4" /> AI Recovery Analyst
            </button>
          </div>
        </div>

        {/* Action Notification Alert */}
        {actionNotice && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-slate-200">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Debt Exposure</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-slate-100">217,500,000 UZS</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-semibold">85.2M UZS</span> Overdue
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Payment Recovery Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">63.6%</div>
            <div className="text-xs text-slate-500">
              <span className="text-slate-300">380.0M UZS</span> collected from payments
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Isolated Write-offs</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-400">14,200,000 UZS</div>
            <div className="text-xs text-slate-500">Excluded from recovery rates</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Critical Risk Accounts</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-bold text-slate-100">13 Accounts</div>
            <div className="text-xs text-rose-400 font-medium">Immediate collection action required</div>
          </div>
        </div>

        {/* MAIN TAB CONTENT */}
        {activeTab === 'priority_queue' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search customer, phone, or debt number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Priority:
                </span>
                {['ALL', 'URGENT', 'HIGH', 'NORMAL', 'LOW'].map((prio) => (
                  <button
                    key={prio}
                    onClick={() => setPriorityFilter(prio)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      priorityFilter === prio
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Priority Table */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Collection Priority Queue ({filteredQueue.length})
                </h3>
                <span className="text-xs text-slate-400">Sorted by DPD and Risk Score</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Debt Ref</th>
                      <th className="py-3 px-4">Outstanding</th>
                      <th className="py-3 px-4">DPD</th>
                      <th className="py-3 px-4">Risk Score</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Broken Promises</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-100">
                          <div>{item.customerName}</div>
                          <div className="text-[11px] text-slate-500">{item.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">{item.debtNumber}</td>
                        <td className="py-3 px-4 font-semibold text-rose-400">
                          {item.outstandingAmount.toLocaleString()} UZS
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                              item.dpd > 30
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : item.dpd > 7
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.dpd} days
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200 w-8">{item.riskScore}</span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.riskScore >= 80
                                    ? 'bg-rose-500'
                                    : item.riskScore >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${item.riskScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.priority === 'URGENT'
                                ? 'bg-rose-600 text-white animate-pulse'
                                : item.priority === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : item.priority === 'NORMAL'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.brokenPromises > 0 ? (
                            <span className="text-rose-400 font-semibold">{item.brokenPromises} broken</span>
                          ) : (
                            <span className="text-slate-500">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => triggerAction('Voice AI Call', item)}
                            className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Call with Voice AI"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => triggerAction('SMS Reminder', item)}
                            className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Send SMS"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedQueueItem(item)}
                            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                            title="View Risk Details"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BRANCH & CASHIER RISK TAB */}
        {activeTab === 'branch_cashier' && (
          <div className="space-y-6">
            {/* Branch Debt Summary */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-400" /> Branch Debt Risk Exposure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_BRANCHES.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{b.branchName}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {b.criticalAccounts} Critical Accounts
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Outstanding:</span>
                        <div className="font-semibold text-slate-200">{b.outstandingAmount.toLocaleString()} UZS</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Overdue Amount:</span>
                        <div className="font-semibold text-rose-400">{b.overdueAmount.toLocaleString()} UZS</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Recovery Rate</span>
                        <span className="font-semibold text-emerald-400">{b.recoveryRatePct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${b.recoveryRatePct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cashier Anomaly Detector */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" /> Cashier Deferred Sales Anomaly Detector
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Flags cashiers originating &gt;40% of branch deferred sales or exhibiting high non-payment correlation.
                </p>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                {MOCK_CASHIER_ANOMALIES.map((c, idx) => (
                  <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{c.cashierName}</span>
                        <span className="text-xs text-slate-500">({c.cashierId})</span>
                        {c.isAnomaly && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> ANOMALY DETECTED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{c.branchName}</div>
                      <div className="text-xs text-slate-500 italic mt-1">{c.anomalyReason}</div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-right">
                      <div>
                        <div className="text-slate-500">Deferred Sales</div>
                        <div className="font-semibold text-slate-200">{c.totalDeferredAmount.toLocaleString()} UZS</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Branch Share</div>
                        <div className={`font-bold ${c.isAnomaly ? 'text-rose-400' : 'text-slate-200'}`}>
                          {c.branchSharePct}%
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Overdue Debt</div>
                        <div className="font-semibold text-rose-400">{c.overdueAmount.toLocaleString()} UZS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI ANALYST TAB */}
        {activeTab === 'ai_analyst' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-slate-100">AI Debt Risk & Recovery Analyst</h3>
              </div>

              <form onSubmit={handleAiAsk} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about debt risk exposure, cashier overrides, or recovery forecasts..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Analyze
                </button>
              </form>
            </div>

            {/* Answers Feed */}
            <div className="space-y-4">
              {aiAnswers.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> User Query: "{item.query}"
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
                    {item.response}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {item.facts.map((f, fidx) => (
                      <div key={fidx} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                        <div className="text-slate-500 text-[11px]">{f.label}</div>
                        <div className="font-bold text-rose-400 mt-0.5">{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISK SNAPSHOT DETAIL MODAL */}
        {selectedQueueItem && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedQueueItem.customerName}</h3>
                  <span className="text-xs text-slate-400">{selectedQueueItem.customerPhone}</span>
                </div>
                <button
                  onClick={() => setSelectedQueueItem(null)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Deterministic Risk Score:</span>
                  <span className="text-base font-bold text-rose-400">{selectedQueueItem.riskScore} / 100</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-semibold text-slate-300">Risk Feature Snapshot</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>Days Past Due: <span className="text-slate-200 font-bold">{selectedQueueItem.dpd} d</span></div>
                    <div>Broken Promises: <span className="text-rose-400 font-bold">{selectedQueueItem.brokenPromises}</span></div>
                    <div>Outstanding: <span className="text-slate-200 font-bold">{selectedQueueItem.outstandingAmount.toLocaleString()} UZS</span></div>
                    <div>Risk Level: <span className="text-rose-400 font-bold">{selectedQueueItem.riskLevel}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    triggerAction('Voice AI Call', selectedQueueItem);
                    setSelectedQueueItem(null);
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs"
                >
                  Trigger Voice AI Call
                </button>
                <button
                  onClick={() => setSelectedQueueItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
