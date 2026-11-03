import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Bot,
  Zap,
  RefreshCw,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Sliders,
  DollarSign,
  Layers,
  Link2,
  Database,
  Upload,
  Download,
  Eye,
  Send,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Info,
  Server,
  Lock,
  ArrowUpRight,
  TrendingDown,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface ActionCenterPageProps {
  onNavigate: (view: AppView) => void;
}

export const ActionCenterPage: React.FC<ActionCenterPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<
    | 'top_actions'
    | 'my_actions'
    | 'approvals'
    | 'workflows'
    | 'automations'
    | 'integrations'
    | 'reconciliation'
    | 'data_mapping'
  >('top_actions');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals state
  const [selectedAction, setSelectedAction] = useState<any | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [showAiRuleModal, setShowAiRuleModal] = useState(false);
  const [aiRulePrompt, setAiRulePrompt] = useState(
    'Mijozning qarzi 7 kundan oshib ketsa, telegramdan muloyim eslatma yuborilsin va nasiya limiti tekshirilsin'
  );
  const [aiGeneratedDraft, setAiGeneratedDraft] = useState<any | null>(null);
  const [selectedReconciliation, setSelectedReconciliation] = useState<any | null>(null);

  // Mock initial actions with high realism
  const [actions, setActions] = useState([
    {
      id: 'ACT-2026-1049',
      title: "Kassa va POS tushumida 250,000 UZS nomuvofiqlik aniqlandi",
      category: 'RECONCILIATION',
      source_type: 'RECONCILIATION',
      source_id: 'REC-SH-09',
      priority: 'CRITICAL',
      priority_score: 92.5,
      financial_impact: 250000,
      risk_level: 'HIGH',
      status: 'OPEN',
      assigned_role: 'Bosh Kassir / Auditor',
      assigned_user_name: 'Sarvar Aliyev',
      due_date: 'Bugun, 18:00 (2 soat qoldi)',
      sla_hours: 4,
      facts: {
        pos_total: '100,000,000 UZS',
        ledger_total: '99,750,000 UZS',
        difference: '+250,000 UZS',
        terminal: 'Kassa-02 (Chilonzor)'
      },
      root_cause: "Offline rejimda urilgan 1 dona chek (150,000 UZS) va bekor qilingan skidka (100,000 UZS) sinxronlanmagan.",
      risk_summary: "Kassa hisobotida kamomad qayd etilishi va soliq auditida farq chiqish xavfi.",
      recommended_actions: [
        "Kassa-02 terminalini offline keshini qayta sinxronizatsiya qilish",
        "Kassir smena yopilish tushuntirish xatini tasdiqlash"
      ]
    },
    {
      id: 'ACT-2026-1048',
      title: "'Olimov Savdo MCHJ' qarzi 14 kunga kechikmoqda (Muddati o'tgan)",
      category: 'DEBT_COLLECTION',
      source_type: 'DEBT',
      source_id: 'CUST-8812',
      priority: 'CRITICAL',
      priority_score: 88.0,
      financial_impact: 42500000,
      risk_level: 'CRITICAL',
      status: 'OPEN',
      assigned_role: 'Kredit Nazoratchisi',
      assigned_user_name: 'Nodirbek Qodirov',
      due_date: 'Bugun, 17:00 (1 soat qoldi)',
      sla_hours: 6,
      facts: {
        customer: 'Olimov Savdo MCHJ',
        debt_amount: '42,500,000 UZS',
        overdue_days: 14,
        credit_limit: '50,000,000 UZS'
      },
      root_cause: "Mijozning asosiy hisob raqami band qilingan, to'lovni naqd yoki ikkilamchi schyotdan o'tkazishni va'da qilgan.",
      risk_summary: "Kompaniyaning joriy oylik cashflow taqchilligiga sabab bo'lishi va qarzning umidsiz qarzga aylanish xavfi.",
      recommended_actions: [
        "Yangi tovar berishni to'xtatish (Kredit blok)",
        "Direktor nomiga rasmiy ogohlantirish xati yuborish",
        "Kafillik shartnomasini faollashtirish"
      ]
    },
    {
      id: 'ACT-2026-1047',
      title: "Coca-Cola 1.5L ombor qoldig'i kritik darajada kam (2 kunlik zaxira)",
      category: 'INVENTORY_REORDER',
      source_type: 'INVENTORY',
      source_id: 'SKU-COCA-15',
      priority: 'HIGH',
      priority_score: 74.0,
      financial_impact: 18400000,
      risk_level: 'MEDIUM',
      status: 'IN_PROGRESS',
      assigned_role: 'Ta\'minot Menejeri',
      assigned_user_name: 'Sherzod Karimov',
      due_date: 'Ertaga, 12:00',
      sla_hours: 24,
      facts: {
        product: 'Coca-Cola Classic 1.5L',
        current_stock: '140 dona',
        daily_velocity: '70 dona/kun',
        min_reorder_level: '500 dona'
      },
      root_cause: "Yetkazib beruvchi zavodida profilaktika sababli oldingi buyurtma 3 kunga kechikkan.",
      risk_summary: "Dam olish kunlarida out-of-stock (tovar yetishmasligi) sababli 18.4M UZS daromad yo'qotilishi.",
      recommended_actions: [
        "Yetkazib beruvchidan zudlik bilan ekspress yuk jo'natishni tasdiqlash",
        "Qo'shni Buxoro filialidan 300 dona vaqtinchalik ko'chirish"
      ]
    },
    {
      id: 'ACT-2026-1046',
      title: "5M UZS dan yuqori operatsion xarajat tasdiqlash talab qilinmoqda",
      category: 'APPROVAL',
      source_type: 'EXPENSE',
      source_id: 'EXP-2026-904',
      priority: 'HIGH',
      priority_score: 68.5,
      financial_impact: 8200000,
      risk_level: 'MEDIUM',
      status: 'PENDING_APPROVAL',
      assigned_role: 'Bosh Direktor (Owner)',
      assigned_user_name: 'Akmal Rustamov',
      due_date: 'Ertaga, 10:00',
      sla_hours: 24,
      facts: {
        expense_type: 'Ombor sovutish tizimi ta\'miri',
        vendor: 'CoolTech Service MCHJ',
        amount: '8,200,000 UZS',
        budget_variance: '+12% oylik limitdan yuqori'
      },
      root_cause: "Konditsioner kompressori yonib ketgan, tezkor almashtirish zarur.",
      risk_summary: "Tasdiqlanmasa, ombordagi tez buziluvchi mahsulotlar yaroqsiz holga kelishi mumkin.",
      recommended_actions: [
        "Smeta va dalolatnomani ko'rib chiqish",
        "Xarajatni tasdiqlash yoki qayta ko'rib chiqishga qaytarish"
      ]
    }
  ]);

  // Mock Approvals queue
  const [approvals, setApprovals] = useState([
    {
      id: 'APP-801',
      action_id: 'ACT-2026-1046',
      title: "Ombor sovutish tizimi ta'miri uchun 8,200,000 UZS to'lov",
      type: 'OPERATING_EXPENSE',
      requester: 'Dilshod (Ombor mudiri)',
      amount: 8200000,
      risk_score: 35,
      impact: 'Oylik maintenance byudjetidan 12% ortiqcha',
      status: 'PENDING',
      approver_role: 'Bosh Direktor',
      items: [
        { name: 'Sanoat kompressori (Bitzer)', qty: 1, sum: '6,500,000 UZS' },
        { name: 'O\'rnatish va freon quyish', qty: 1, sum: '1,700,000 UZS' }
      ]
    },
    {
      id: 'APP-802',
      action_id: 'ACT-2026-1033',
      title: "'Mega Trade' yetkazib beruvchisiga 65,000,000 UZS avans to'lovi",
      type: 'SUPPLIER_PAYMENT',
      requester: 'Nargiza (Xarid bo\'limi)',
      amount: 65000000,
      risk_score: 48,
      impact: 'Katta naqd pul chiqimi (Treasury Cashflow)',
      status: 'PENDING',
      approver_role: 'CFO / Moliyaviy Nazoratchi',
      items: [
        { name: 'Oq qand 50kg (20 tonna)', qty: 400, sum: '65,000,000 UZS' }
      ]
    }
  ]);

  // Mock Workflows
  const [workflows] = useState([
    {
      id: 'WF-01',
      code: 'DEBT_COLLECTION_FLOW',
      name: 'Nasiya Qarzlarini Avtomatik Undirish Zanjiri',
      trigger: 'DEBT_OVERDUE_DETECTED',
      status: 'ACTIVE',
      instances_running: 14,
      steps: [
        { id: 1, title: 'Kechikishni hisoblash', type: 'CONDITION', role: 'System' },
        { id: 2, title: 'Telegram eslatma', type: 'NOTIFICATION', role: 'Telegram Bot' },
        { id: 3, title: 'Kredit limitini bloklash', type: 'APPROVAL', role: 'Moliya Mudiri' },
        { id: 4, title: 'Yuristga uzatish', type: 'CREATE_ACTION', role: 'Yurist' }
      ]
    },
    {
      id: 'WF-02',
      code: 'RECONCILIATION_ESC_FLOW',
      name: 'Kassa va Bank Farqlarini Eskalatsiya Qilish',
      trigger: 'RECONCILIATION_MISMATCH_DETECTED',
      status: 'ACTIVE',
      instances_running: 2,
      steps: [
        { id: 1, title: 'Farq miqdorini tahlil qilish (>100k UZS)', type: 'CONDITION', role: 'System' },
        { id: 2, title: 'Kassirga tushuntirish so\'rovi', type: 'CREATE_ACTION', role: 'Bosh Kassir' },
        { id: 3, title: 'Audit tekshiruvi', type: 'APPROVAL', role: 'Auditor' }
      ]
    }
  ]);

  // Mock Automation Rules
  const [automationRules, setAutomationRules] = useState([
    {
      id: 'RUL-101',
      name: "7 kundan oshgan qarzga Telegram eslatma",
      trigger: 'DEBT_OVERDUE_DETECTED',
      conditions: "days_overdue >= 7 AND balance > 500,000 UZS",
      actions: "SEND_TELEGRAM_REMINDER (Shablon: Polite Reminder)",
      status: 'ACTIVE',
      rate_limit: '30 ta/soat',
      safety_badge: 'XAVFSIZ (Tasdiqlangan)'
    },
    {
      id: 'RUL-102',
      name: "Kritik tovar zaxirasi < 2 kun bo'lganda Xarid Buyurtmasi qoralamasini yaratish",
      trigger: 'INVENTORY_LOW_STOCK',
      conditions: "stock_days <= 2 AND supplier_contract == 'ACTIVE'",
      actions: "CREATE_PO_DRAFT (Talab etiladi: Xarid menejeri tasdig'i)",
      status: 'ACTIVE',
      rate_limit: '50 ta/soat',
      safety_badge: 'XAVFSIZ (Tasdiqlangan)'
    },
    {
      id: 'RUL-103',
      name: "Tashqi kassa tushumida 100k dan katta farq bo'lsa auditorga signal",
      trigger: 'RECONCILIATION_MISMATCH',
      conditions: "abs(difference) >= 100,000 UZS",
      actions: "CREATE_ACTION_ITEM (Priority: HIGH, Role: Auditor)",
      status: 'ACTIVE',
      rate_limit: '10 ta/soat',
      safety_badge: 'XAVFSIZ (Tasdiqlangan)'
    }
  ]);

  // Mock Integrations
  const [integrations] = useState([
    {
      id: 'INT-POS',
      name: 'Poster POS / R-Keeper Kassa Tizimi',
      type: 'POS',
      status: 'CONNECTED',
      sync_direction: 'INBOUND',
      last_sync: '2 daqiqa oldin',
      records_today: 1482,
      latency: '180ms',
      auth: 'Bearer token (sk_pos_...89a)'
    },
    {
      id: 'INT-BANK',
      name: 'Kapitalbank Direct Host-to-Host API',
      type: 'BANK',
      status: 'CONNECTED',
      sync_direction: 'BIDIRECTIONAL',
      last_sync: '10 daqiqa oldin',
      records_today: 46,
      latency: '240ms',
      auth: 'mTLS + API Key (kb_prod_...71e)'
    },
    {
      id: 'INT-DIDOX',
      name: 'Didox / E-Faktura (EHF Soliq)',
      type: 'EHF_DIDOX',
      status: 'CONNECTED',
      sync_direction: 'INBOUND',
      last_sync: '1 soat oldin',
      records_today: 12,
      latency: '410ms',
      auth: 'ERI Kaliti (Active Certificate)'
    },
    {
      id: 'INT-CLICK',
      name: 'Click & Payme Payment Gateway Webhook',
      type: 'PAYMENT_GATEWAY',
      status: 'CONNECTED',
      sync_direction: 'INBOUND',
      last_sync: 'Jonli (Real-time)',
      records_today: 320,
      latency: '95ms',
      auth: 'HMAC SHA256 Signature verified'
    },
    {
      id: 'INT-1C',
      name: '1C:Buxgalteriya 8.3 OData Connector',
      type: 'ACCOUNTING',
      status: 'CONNECTED',
      sync_direction: 'BIDIRECTIONAL',
      last_sync: '15 daqiqa oldin',
      records_today: 89,
      latency: '310ms',
      auth: 'OAuth 2.0 Client Credentials'
    }
  ]);

  // Mock Reconciliation Case: 100M POS vs 99.75M ProfitLeak -> 250k difference
  const reconciliationData = {
    code: 'REC-2026-10-31-01',
    period: '2026-10-31 00:00 — 23:59',
    connection: 'Poster POS (Chilonzor Filiali) vs ProfitLeak Savdolar',
    external_total: 100000000,
    internal_total: 99750000,
    difference: 250000,
    status: 'INVESTIGATING',
    items: [
      {
        id: 'REC-DIFF-01',
        ext_ref: 'CHK-99182',
        reason: 'OFFLINE_TICKET_NOT_SYNCED',
        details: 'Kassir internet uzilishi paytida urgan naqd pul cheki',
        ext_amount: 150000,
        int_amount: 0,
        difference: 150000,
        time: '14:23:10',
        remedy: 'Kassa keshidan tranzaksiyani majburiy qabul qilish'
      },
      {
        id: 'REC-DIFF-02',
        ext_ref: 'CHK-99205',
        reason: 'DISCOUNT_VOID_DISCREPANCY',
        details: 'Qo\'lda kiritilgan 100,000 UZS chegirma ichki tizimda bekor qilingan deb saqlanmagan',
        ext_amount: 100000,
        int_amount: 0,
        difference: 100000,
        time: '16:45:02',
        remedy: 'Kassir administratorining bekor qilish aktini biriktirish'
      }
    ]
  };

  // Generate AI Draft Rule Handler
  const handleGenerateAiRule = () => {
    // Translate prompt safely into previewable draft
    const draft = {
      name: 'AI: 7 kundan oshgan qarzga eslatma va limit tekshiruvi',
      description: aiRulePrompt,
      trigger: 'DEBT_OVERDUE_DETECTED',
      conditions: [
        { field: 'days_overdue', operator: '>=', value: '7' },
        { field: 'outstanding_balance', operator: '>', value: '500,000 UZS' }
      ],
      actions: [
        { action_type: 'SEND_TELEGRAM_REMINDER', params: { template: 'POLITE_DEBT_NOTICE' }, approval_needed: false },
        { action_type: 'CHECK_CREDIT_LIMIT', params: { threshold: 'STRICT' }, approval_needed: true }
      ],
      status: 'DRAFT',
      safety_validated: true,
      notes: "Xavfsizlik tekshiruvidan o'tdi: Mablag'larni to'g'ridan-to'g'ri yechish yoki qarzni o'chirish harakati yo'q."
    };
    setAiGeneratedDraft(draft);
  };

  const handleActivateDraftRule = () => {
    if (!aiGeneratedDraft) return;
    const newRule = {
      id: `RUL-${Date.now().toString().slice(-4)}`,
      name: aiGeneratedDraft.name,
      trigger: aiGeneratedDraft.trigger,
      conditions: "days_overdue >= 7 AND outstanding_balance > 500,000 UZS",
      actions: "SEND_TELEGRAM_REMINDER + CHECK_CREDIT_LIMIT (Tasdiqlash bilan)",
      status: 'ACTIVE',
      rate_limit: '30 ta/soat',
      safety_badge: 'XAVFSIZ (AI Draft Tasdiqlandi)'
    };
    setAutomationRules([newRule, ...automationRules]);
    setShowAiRuleModal(false);
    setAiGeneratedDraft(null);
  };

  // Action resolution
  const handleResolveAction = (actionId: string) => {
    setActions(actions.map(a => a.id === actionId ? { ...a, status: 'RESOLVED' } : a));
    if (selectedAction?.id === actionId) {
      setSelectedAction(null);
    }
  };

  // Approval handler
  const handleDecision = (appId: string, decision: 'APPROVED' | 'REJECTED') => {
    setApprovals(approvals.map(a => a.id === appId ? { ...a, status: decision } : a));
    setSelectedApproval(null);
  };

  const filteredActions = actions.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.assigned_user_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || a.priority === priorityFilter;
    return matchesSearch && matchesCat && matchesPriority;
  });

  return (
    <AppShell currentView="pos" onNavigate={onNavigate}>
      <div className="flex h-full flex-col bg-[#090d16] text-slate-100 overflow-y-auto">
        {/* Top Header */}
        <header className="border-b border-slate-800/80 bg-[#0d1322] px-6 py-5 shrink-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 text-white shadow-lg shadow-emerald-950/40">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-white">
                      Action Center & Integrations Platform
                    </h1>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                      Bo'lim 10 Real-Time
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Barcha biznes hodisalari (Savdo, Qarz, Ta'minot, Moliya, AI) bo'yicha markaziy boshqaruv va integratsiyalar
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowAiRuleModal(true)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition-all shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-indigo-400" />
                AI Avtomatlashtirish Qoidasi (Draft)
              </button>
              <button
                onClick={() => setActiveTab('reconciliation')}
                className="flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-all shadow-sm"
              >
                <RefreshCw className="h-4 w-4 text-amber-400" />
                Reconciliation Tekshiruvi
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 gap-3 pt-5 md:grid-cols-5">
            <div className="rounded-xl border border-slate-800/80 bg-[#12192b]/60 p-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>Ochiq Actionlar</span>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">4 ta</span>
                <span className="text-[10px] text-rose-400 font-semibold">2 ta Kritik</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-[#12192b]/60 p-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>Tasdiqlash Navbati</span>
                <Clock className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-amber-300">2 ta so'rov</span>
                <span className="text-[10px] text-slate-400">73.2M UZS</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-[#12192b]/60 p-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>Faol Zanjirlar</span>
                <GitPullRequest className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">16 ta</span>
                <span className="text-[10px] text-emerald-400">0 ta Loop xatosi</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-[#12192b]/60 p-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>Integratsiya Holati</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-emerald-400">5/5 Ulangan</span>
                <span className="text-[10px] text-slate-400">99.8% Uptime</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-[#12192b]/60 p-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>Reconciliation Farqi</span>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-amber-300">250,000 UZS</span>
                <span className="text-[10px] text-amber-400">Tahlilda</span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto border-t border-slate-800/60 pt-3">
            {[
              { id: 'top_actions', label: "Bugungi Asosiy Actionlar", icon: AlertTriangle, count: actions.length },
              { id: 'approvals', label: 'Tasdiqlash Navbati', icon: CheckSquare, count: approvals.filter(a => a.status === 'PENDING').length },
              { id: 'workflows', label: 'Workflow Zanjirlari', icon: GitPullRequest, count: workflows.length },
              { id: 'automations', label: 'Avtomatlashtirish Qoidalari', icon: Zap, count: automationRules.length },
              { id: 'integrations', label: 'Integratsiyalar & Konnektorlar', icon: Link2, count: integrations.length },
              { id: 'reconciliation', label: 'Reconciliation Markazi', icon: RefreshCw, badge: '250k UZS' },
              { id: 'data_mapping', label: 'Data Mapping & Import/Export', icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300 border border-amber-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* TAB 1: TOP ACTIONS */}
          {activeTab === 'top_actions' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-[#0d1322] p-3.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Action raqami, sarlavhasi yoki mas'ul shaxs bo'yicha qidiruv..."
                    className="w-full rounded-lg border border-slate-700/80 bg-[#12192b] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border border-slate-700/80 bg-[#12192b] px-3 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">Barcha Kategoriyalar</option>
                    <option value="RECONCILIATION">Reconciliation</option>
                    <option value="DEBT_COLLECTION">Qarz Undirish</option>
                    <option value="INVENTORY_REORDER">Tovar Buyurtmasi</option>
                    <option value="APPROVAL">Tasdiqlashlar</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="rounded-lg border border-slate-700/80 bg-[#12192b] px-3 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">Barcha Muhimlik</option>
                    <option value="CRITICAL">Faqat Kritik</option>
                    <option value="HIGH">Yuqori</option>
                    <option value="MEDIUM">O'rtacha</option>
                  </select>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredActions.map((action) => {
                  const isCritical = action.priority === 'CRITICAL';
                  const isResolved = action.status === 'RESOLVED';

                  return (
                    <div
                      key={action.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isResolved
                          ? 'border-slate-800/60 bg-[#0d1322]/50 opacity-60'
                          : isCritical
                          ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-[#0d1322] to-[#0d1322] shadow-lg shadow-rose-950/20'
                          : 'border-slate-800 bg-[#0d1322] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-400">{action.id}</span>
                            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              isCritical
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {action.priority} ({action.priority_score} Ball)
                            </span>
                            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                              {action.category}
                            </span>
                            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                              Manba: {action.source_type}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            {action.title}
                          </h3>

                          {/* Diagnostic Framework: Nima bo'ldi -> Sabab -> Risk -> Action */}
                          <div className="grid grid-cols-1 gap-2 pt-1 text-xs sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg bg-[#12192b] p-2 border border-slate-800/80">
                              <span className="text-[10px] font-semibold uppercase text-slate-500 block">Nima bo'ldi (Fakt)</span>
                              <p className="text-slate-300 text-[11px] mt-0.5">
                                {action.category === 'RECONCILIATION'
                                  ? `POS: ${action.facts.pos_total} | PL: ${action.facts.ledger_total} (Farq: ${action.facts.difference})`
                                  : action.category === 'DEBT_COLLECTION'
                                  ? `${action.facts.customer}: ${action.facts.debt_amount} (${action.facts.overdue_days} kun kechikkan)`
                                  : `${action.financial_impact.toLocaleString()} UZS moliyaviy ta'sir`}
                              </p>
                            </div>

                            <div className="rounded-lg bg-[#12192b] p-2 border border-slate-800/80">
                              <span className="text-[10px] font-semibold uppercase text-slate-500 block">Asosiy Sabab</span>
                              <p className="text-slate-300 text-[11px] mt-0.5 truncate" title={action.root_cause}>
                                {action.root_cause}
                              </p>
                            </div>

                            <div className="rounded-lg bg-[#12192b] p-2 border border-slate-800/80 sm:col-span-2 lg:col-span-1">
                              <span className="text-[10px] font-semibold uppercase text-rose-400 block">Biznes Xavfi</span>
                              <p className="text-slate-300 text-[11px] mt-0.5 truncate" title={action.risk_summary}>
                                {action.risk_summary}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-amber-400" />
                              <strong className="text-slate-200">SLA:</strong> {action.due_date}
                            </span>
                            <span>
                              <strong className="text-slate-200">Mas'ul:</strong> {action.assigned_user_name} ({action.assigned_role})
                            </span>
                            <span>
                              <strong className="text-slate-200">Moliyaviy miqdor:</strong> {action.financial_impact.toLocaleString()} UZS
                            </span>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                          <button
                            onClick={() => setSelectedAction(action)}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Tafsilotlar
                          </button>

                          {!isResolved ? (
                            <button
                              onClick={() => handleResolveAction(action.id)}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Bajarildi / Yopish
                            </button>
                          ) : (
                            <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                              Yopilgan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: APPROVALS QUEUE */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-amber-400" />
                    Human-in-the-Loop Tasdiqlash Navbati
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Moliya xavfsizligi qonuni: 5,000,000 UZS dan yuqori to'lovlar va chegirmani o'chirish faqat mas'ul shaxs tasdig'i bilan o'tadi
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Jami kutilayotgan:</span>
                  <div className="text-lg font-bold text-amber-300">73,200,000 UZS</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {approvals.map((app) => (
                  <div key={app.id} className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{app.id}</span>
                          <span className="rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                            {app.type}
                          </span>
                          <span className="text-xs text-slate-400">
                            Talabgor: <strong className="text-slate-200">{app.requester}</strong>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">{app.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-400">{app.amount.toLocaleString()} UZS</div>
                        <span className="text-[11px] text-slate-400">Xavf darajasi: {app.risk_score}/100</span>
                      </div>
                    </div>

                    {/* Breakdown items */}
                    <div className="rounded-lg bg-[#12192b] p-3 border border-slate-800/80">
                      <div className="text-[10px] font-semibold uppercase text-slate-400 mb-2">Smeta & Tovar Ro'yxati</div>
                      <div className="space-y-1.5">
                        {app.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-300">
                            <span>{it.name} (x{it.qty})</span>
                            <span className="font-mono font-medium text-slate-200">{it.sum}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-400 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        <span>Ta'siri: {app.impact}</span>
                      </div>
                    </div>

                    {/* Decision controls */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-400">
                        Zaruriy Rol: <strong className="text-slate-200">{app.approver_role}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecision(app.id, 'REJECTED')}
                          className="flex items-center gap-1.5 rounded-lg bg-rose-600/20 border border-rose-500/30 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-600/30 transition-colors"
                        >
                          <XCircle className="h-4 w-4 text-rose-400" />
                          Rad etish
                        </button>
                        <button
                          onClick={() => handleDecision(app.id, 'APPROVED')}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Tasdiqlash & To'lovga Ruxsat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WORKFLOWS */}
          {activeTab === 'workflows' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <GitPullRequest className="h-5 w-5 text-indigo-400" />
                    Ko'p Bosqichli Workflow Zanjirlari
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Har bir qadam deterministik bajariladi, cheksiz sikllar (anti-loop) max 15 qadam bilan himoyalangan
                  </p>
                </div>
                <span className="rounded bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/20">
                  {workflows.length} ta faol shablon
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {workflows.map((wf) => (
                  <div key={wf.id} className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{wf.code}</span>
                          <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                            {wf.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">{wf.name}</h3>
                        <p className="text-xs text-slate-400">Trigger hodisasi: <code className="text-indigo-300">{wf.trigger}</code></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Hozir ishlayotgan nusxalar:</span>
                        <div className="text-lg font-bold text-indigo-300">{wf.instances_running} ta</div>
                      </div>
                    </div>

                    {/* Step Visual Graph */}
                    <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800/80">
                      <div className="text-[10px] font-semibold uppercase text-slate-400 mb-3">Zanjir Bosqichlari (Execution Pipeline)</div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {wf.steps.map((step, idx) => (
                          <React.Fragment key={step.id}>
                            <div className="flex-1 rounded-lg bg-[#0d1322] border border-slate-800 p-3 space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-emerald-400">Qadam {step.id}</span>
                                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">{step.type}</span>
                              </div>
                              <div className="text-xs font-bold text-white truncate">{step.title}</div>
                              <div className="text-[10px] text-slate-400">Ijrochi: {step.role}</div>
                            </div>
                            {idx < wf.steps.length - 1 && (
                              <ArrowRight className="hidden sm:block h-4 w-4 text-slate-600 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUTOMATIONS */}
          {activeTab === 'automations' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    Avtomatlashtirish Qoidalari & AI Draft Generator
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Har qanday AI yoki inson qoidasi xavfsizlik filtri va rate-limit tekshiruvidan so'ng faollashadi
                  </p>
                </div>
                <button
                  onClick={() => setShowAiRuleModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm self-start sm:self-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  Yangi Qoida Yaratish (Tabiiy Tilda)
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{rule.id}</span>
                          <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                            {rule.status}
                          </span>
                          <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold">
                            {rule.safety_badge}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">{rule.name}</h3>
                      </div>
                      <span className="text-xs text-slate-400">Limit: {rule.rate_limit}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#12192b] p-3 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase block">Trigger</span>
                        <code className="text-indigo-300 font-mono text-[11px] mt-0.5 block">{rule.trigger}</code>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase block">Shartlar (Conditions)</span>
                        <code className="text-amber-300 font-mono text-[11px] mt-0.5 block">{rule.conditions}</code>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase block">Harakat (Actions)</span>
                        <code className="text-emerald-300 font-mono text-[11px] mt-0.5 block">{rule.actions}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-emerald-400" />
                    3-Tomon Integratsiyalari & Konnektorlar
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    POS, Bank, EHF Didox, Click/Payme va 1C tizimlari bilan xavfsiz va idempotent ma'lumot almashinuvi
                  </p>
                </div>
                <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/20">
                  Barcha konnektorlar faol
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((conn) => (
                  <div key={conn.id} className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                          {conn.type.slice(0, 3)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{conn.name}</h3>
                          <span className="text-[10px] text-slate-400">{conn.id} • {conn.sync_direction}</span>
                        </div>
                      </div>
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                        {conn.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-[#12192b] p-2.5 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Oxirgi Sync</span>
                        <span className="font-semibold text-slate-300">{conn.last_sync}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Bugungi Yozuvlar</span>
                        <span className="font-semibold text-emerald-400">{conn.records_today} ta</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Latency</span>
                        <span className="font-semibold text-slate-300">{conn.latency}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3 text-slate-500" />
                        Auth: {conn.auth}
                      </span>
                      <button className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                        Sinxronlash <RefreshCw className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RECONCILIATION */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{reconciliationData.code}</span>
                      <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                        FARQ ANIQLANDI
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {reconciliationData.connection}
                    </h2>
                    <p className="text-xs text-slate-400">Tekshiruv davri: {reconciliationData.period}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedReconciliation(reconciliationData)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                      Farq Tahlili (Breakdown)
                    </button>
                  </div>
                </div>

                {/* Totals Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Tashqi POS Tizim Hisoboti</span>
                    <div className="text-xl font-bold text-white mt-1">
                      {reconciliationData.external_total.toLocaleString()} UZS
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Poster POS Z-Report (Kunlik)</span>
                  </div>

                  <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800">
                    <span className="text-xs text-slate-400 block">ProfitLeak Ichki Savdolar Boshqaruvi</span>
                    <div className="text-xl font-bold text-white mt-1">
                      {reconciliationData.internal_total.toLocaleString()} UZS
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Rasmiy sotuv jurnali</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-amber-950/40 to-[#12192b] p-4 border border-amber-500/40">
                    <span className="text-xs text-amber-300 font-semibold block">Aniqlangan Nomuvofiqlik (Farq)</span>
                    <div className="text-xl font-bold text-amber-300 mt-1">
                      +{reconciliationData.difference.toLocaleString()} UZS
                    </div>
                    <span className="text-[10px] text-amber-400 mt-1 block">2 ta tranzaksiya bo'yicha farq</span>
                  </div>
                </div>

                {/* Discrepancy Breakdown Table */}
                <div className="rounded-xl border border-slate-800 bg-[#12192b] overflow-hidden">
                  <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-300">
                    Nomuvofiq Tranzaksiyalar Tafsiloti (Itemized Mismatch Breakdown)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#0d1322] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-2.5">Chek / Ref</th>
                          <th className="px-4 py-2.5">Sabab & Sababchi</th>
                          <th className="px-4 py-2.5 text-right">POS Summasi</th>
                          <th className="px-4 py-2.5 text-right">Ichki Summa</th>
                          <th className="px-4 py-2.5 text-right text-amber-300">Farq</th>
                          <th className="px-4 py-2.5">Tavsiya Qilingan Amaliyot</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {reconciliationData.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-800/30">
                            <td className="px-4 py-3 font-mono font-bold text-white">{item.ext_ref}</td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-slate-200 block">{item.details}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{item.reason} ({item.time})</span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">{item.ext_amount.toLocaleString()} UZS</td>
                            <td className="px-4 py-3 text-right font-mono">{item.int_amount.toLocaleString()} UZS</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-amber-300">
                              +{item.difference.toLocaleString()} UZS
                            </td>
                            <td className="px-4 py-3 text-slate-300 text-[11px]">{item.remedy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DATA MAPPING */}
          {activeTab === 'data_mapping' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-400" />
                    Data Mapping, Normalization & Bulk Import/Export
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tashqi SKU, 1C nomenkulatura, EHF IKPU kodlarini ProfitLeak standartlariga solishtirish va sinxronlash
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700">
                    <Download className="h-3.5 w-3.5" />
                    Shablon Yuklab Olish (XLSX)
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">
                    <Upload className="h-3.5 w-3.5" />
                    Ommaviy Import (CSV/Excel)
                  </button>
                </div>
              </div>

              {/* Sample Mappings Table */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1322] overflow-hidden">
                <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-300">
                  Faol Nomenklatura Mappings (1C & POS & EHF)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#12192b] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-2.5">Ichki Tovar ID (ProfitLeak)</th>
                        <th className="px-4 py-2.5">Tashqi Tizim Turi</th>
                        <th className="px-4 py-2.5">Tashqi ID / Kod</th>
                        <th className="px-4 py-2.5">Shtrix-kod (Barcode)</th>
                        <th className="px-4 py-2.5">Holati</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        { internal: 'PRD-001 (Coca-Cola 1.5L)', sys: 'Poster POS', ext: 'POSTER_SKU_902', bar: '5449000000996', status: 'VERIFIED' },
                        { internal: 'PRD-002 (Oq Shakar 50kg)', sys: '1C:Enterprise', ext: '1C_NOM_7718', bar: '4780001239841', status: 'VERIFIED' },
                        { internal: 'PRD-003 (Sanoat Kompressori)', sys: 'Didox EHF', ext: 'IKPU-08192001', bar: 'N/A (Asosiy vosita)', status: 'VERIFIED' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="px-4 py-3 font-medium text-white">{row.internal}</td>
                          <td className="px-4 py-3">
                            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                              {row.sys}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-300">{row.ext}</td>
                          <td className="px-4 py-3 font-mono text-slate-400">{row.bar}</td>
                          <td className="px-4 py-3">
                            <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* MODAL 1: ACTION ITEM DETAILS MODAL */}
        {selectedAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0d1322] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{selectedAction.id}</span>
                  <span className="rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold">
                    {selectedAction.priority}
                  </span>
                  <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold">
                    {selectedAction.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h2 className="text-base font-bold text-white">{selectedAction.title}</h2>
                <p className="text-xs text-slate-400 mt-1">Mas'ul: {selectedAction.assigned_user_name} ({selectedAction.assigned_role})</p>
              </div>

              {/* Facts and Cause */}
              <div className="space-y-3 rounded-xl bg-[#12192b] p-4 border border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block">Nima bo'ldi (Fakt)</span>
                  <p className="text-slate-200 mt-0.5">{JSON.stringify(selectedAction.facts)}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block">Asosiy Sabab (Root Cause)</span>
                  <p className="text-slate-200 mt-0.5">{selectedAction.root_cause}</p>
                </div>
                <div>
                  <span className="font-semibold text-rose-400 uppercase text-[10px] block">Biznes Xavfi</span>
                  <p className="text-slate-200 mt-0.5">{selectedAction.risk_summary}</p>
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <span className="font-semibold text-slate-300 text-xs block mb-1.5">Tavsiya etilgan amaliy choralar:</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedAction.recommended_actions.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-[#12192b] p-2 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button
                  onClick={() => setSelectedAction(null)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Yopish
                </button>
                <button
                  onClick={() => handleResolveAction(selectedAction.id)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm"
                >
                  Bajarildi Deb Belgilash
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: AI AUTOMATION RULE GENERATOR MODAL */}
        {showAiRuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0d1322] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">AI Avtomatlashtirish Qoidasi Yaratish</h2>
                </div>
                <button
                  onClick={() => setShowAiRuleModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Qoidani tabiiy tilda ta'riflang (O'zbek, Rus yoki Ingliz tilida):
                </label>
                <textarea
                  value={aiRulePrompt}
                  onChange={(e) => setAiRulePrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Masalan: Agar mijoz qarzi 7 kundan oshsa, telegramdan eslatma yuborilsin..."
                />
                <button
                  onClick={handleGenerateAiRule}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Qoralamani Shakllantirish (Generate Draft)
                </button>
              </div>

              {/* Draft Preview & Safety Validation */}
              {aiGeneratedDraft && (
                <div className="rounded-xl border border-indigo-500/30 bg-[#12192b] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">{aiGeneratedDraft.name}</span>
                    <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                      STATUS: DRAFT (Xavfsiz)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{aiGeneratedDraft.notes}</p>

                  <div className="space-y-1.5 text-[11px] font-mono bg-[#0d1322] p-3 rounded-lg border border-slate-800 text-slate-300">
                    <div><strong>Trigger:</strong> {aiGeneratedDraft.trigger}</div>
                    <div><strong>Shartlar:</strong> {JSON.stringify(aiGeneratedDraft.conditions)}</div>
                    <div><strong>Harakatlar:</strong> {JSON.stringify(aiGeneratedDraft.actions)}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      O'chirish yoki pul o'tkazish cheklovi: <strong className="text-emerald-400">BLOKLANGAN</strong>
                    </span>
                    <button
                      onClick={handleActivateDraftRule}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm"
                    >
                      Qoidani Faollashtirish (Activate Rule)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 3: RECONCILIATION BREAKDOWN MODAL */}
        {selectedReconciliation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0d1322] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">Reconciliation Farqi Tahlili (250,000 UZS)</h2>
                </div>
                <button
                  onClick={() => setSelectedReconciliation(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Tashqi POS hisoboti (100,000,000 UZS) bilan ProfitLeak savdo hisoboti (99,750,000 UZS) o'rtasidagi 250,000 UZS farq quyidagi 2 ta hodisa bilan to'liq tushuntiriladi:
                </p>

                {selectedReconciliation.items.map((it: any, i: number) => (
                  <div key={i} className="rounded-xl bg-[#12192b] p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{it.ext_ref} • {it.reason}</span>
                      <span className="text-amber-400">+{it.difference.toLocaleString()} UZS</span>
                    </div>
                    <p className="text-xs text-slate-400">{it.details}</p>
                    <div className="text-[11px] text-emerald-400 pt-1 font-semibold">Tavsiya: {it.remedy}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end border-t border-slate-800 pt-3">
                <button
                  onClick={() => setSelectedReconciliation(null)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Tushundim / Yopish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
