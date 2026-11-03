import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Layers,
  Database,
  Users,
  Key,
  Bot,
  Link2,
  Activity,
  Lock,
  FileText,
  Save,
  Flag,
  AlertOctagon,
  Clock,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Eye,
  Sliders,
  DollarSign,
  Zap,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BarChart3,
  HelpCircle,
  Cpu,
  Radio,
  FileSearch,
  ArrowRight
} from 'lucide-react';
import { AppView } from '../components/layout/AppShell';

interface AdminControlPlanePageProps {
  onNavigate: (view: AppView) => void;
}

export const AdminControlPlanePage: React.FC<AdminControlPlanePageProps> = ({ onNavigate }) => {
  // Navigation tabs within Admin Control Plane
  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'overview'
    | 'tenants'
    | 'users_rbac'
    | 'support'
    | 'subscriptions'
    | 'ai_control'
    | 'integrations'
    | 'monitoring'
    | 'security'
    | 'audit'
    | 'backups'
    | 'feature_flags'
    | 'incidents'
    | 'jobs'
    | 'configuration'
  >('overview');

  // Environment state
  const [environment, setEnvironment] = useState<'PRODUCTION' | 'STAGING' | 'DEVELOPMENT'>('PRODUCTION');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportTenant, setSupportTenant] = useState('Korzinka Chilonzor (#T-1002)');
  const [supportReason, setSupportReason] = useState('Mijoz POS sinxronizatsiya kechikishi bo\'yicha #SUP-9912 murojaati tahlili');
  const [supportScope, setSupportScope] = useState('INTEGRATION_DIAGNOSTICS');
  const [supportDuration, setSupportDuration] = useState('60');

  const [showHighRiskModal, setShowHighRiskModal] = useState(false);
  const [highRiskActionTitle, setHighRiskActionTitle] = useState('');
  const [highRiskTarget, setHighRiskTarget] = useState('');
  const [stepUpPassword, setStepUpPassword] = useState('');

  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // Mock Tenants Data
  const [tenants] = useState([
    {
      id: 'T-1001',
      name: 'Olimov Savdo MCHJ',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      region: 'Toshkent',
      owner: 'Sherzod Olimov',
      users_count: 24,
      branches_count: 6,
      storage_mb: 4820,
      ai_tokens_month: 1240000,
      integrations: ['Poster POS', 'Didox EHF', 'Kapitalbank', 'Click'],
      last_activity: '1 daqiqa oldin',
      health: 'HEALTHY'
    },
    {
      id: 'T-1002',
      name: 'Korzinka Express Chilonzor',
      plan: 'BUSINESS',
      status: 'ACTIVE',
      region: 'Toshkent',
      owner: 'Farrux Zokirov',
      users_count: 14,
      branches_count: 2,
      storage_mb: 2150,
      ai_tokens_month: 840000,
      integrations: ['R-Keeper POS', 'Didox EHF', 'Payme'],
      last_activity: '3 daqiqa oldin',
      health: 'HEALTHY'
    },
    {
      id: 'T-1003',
      name: 'Buxoro Shakar Distribution',
      plan: 'BUSINESS',
      status: 'TRIAL',
      region: 'Buxoro',
      owner: 'Mansur Hakimov',
      users_count: 8,
      branches_count: 1,
      storage_mb: 890,
      ai_tokens_month: 210000,
      integrations: ['1C:Buxgalteriya', 'Telegram'],
      last_activity: '15 daqiqa oldin',
      health: 'HEALTHY'
    },
    {
      id: 'T-1004',
      name: 'Samarqand Meat Trade',
      plan: 'STARTER',
      status: 'SUSPENDED',
      region: 'Samarqand',
      owner: 'Jasur Shodiyev',
      users_count: 5,
      branches_count: 1,
      storage_mb: 420,
      ai_tokens_month: 45000,
      integrations: ['Poster POS'],
      last_activity: '2 kun oldin',
      health: 'SUSPENDED'
    }
  ]);

  // Mock Active Support Sessions
  const [supportSessions, setSupportSessions] = useState([
    {
      code: 'SUP-20261031-A901',
      admin: 'Sarvar Aliyev (Support Admin)',
      tenant: 'Korzinka Express Chilonzor',
      case_id: 'SUP-9912',
      reason: 'POS sinxronizatsiya keshidagi 250k farqni tekshirish',
      scope: 'INTEGRATION_DIAGNOSTICS',
      expires_in: '38 daqiqa qoldi',
      status: 'ACTIVE'
    }
  ]);

  // Mock Feature Flags
  const [featureFlags, setFeatureFlags] = useState([
    {
      key: 'ENABLE_REALTIME_CAMERA_AI',
      name: 'Kamera Oqimi Orqali Do\'kon Anomaliyasini Aniqlash',
      scope: 'PLAN',
      plan: 'ENTERPRISE',
      rollout: '100%',
      status: 'ACTIVE',
      updated_by: 'Platform Super Admin'
    },
    {
      key: 'AUTONOMOUS_DEBT_ESCALATION',
      name: 'Muddati O\'tgan Qarzlar Bo\'yicha Avtomatik Telegram Eslatma',
      scope: 'GLOBAL',
      plan: 'ALL',
      rollout: '100%',
      status: 'ACTIVE',
      updated_by: 'Security Admin'
    },
    {
      key: 'EXPERIMENTAL_1C_ODATA_V4',
      name: '1C:Enterprise Yangi OData v4 High-Speed Adapter',
      scope: 'TENANT',
      plan: 'ALLOWLIST (2 ta tenant)',
      rollout: 'Internal Beta',
      status: 'ACTIVE',
      updated_by: 'Integration Admin'
    }
  ]);

  // Mock SRE Incidents
  const [incidents] = useState([
    {
      code: 'INC-2026-088',
      title: 'Tashqi to\'lov shlyuzida (Payme) vaqtinchalik tarmoq uzilishi',
      severity: 'SEV3',
      status: 'RESOLVED',
      started: 'Bugun, 11:20',
      resolved: 'Bugun, 11:38 (18 daqiqa)',
      owner: 'SRE On-Call',
      mitigation: 'Tranzaksiyalar avtomatik ikkilamchi kassa rejimiga o\'tkazildi va qayta sinxronlandi.'
    }
  ]);

  // Mock Backups
  const [backups] = useState([
    {
      code: 'BKP-20261031-FULL',
      type: 'DATABASE_FULL',
      scope: 'PLATFORM_FULL',
      size: '14.8 GB',
      checksum: 'sha256:8f912c019a...712',
      status: 'VERIFIED',
      completed_at: 'Bugun, 02:30 UTC',
      retention: '2026-11-30 gacha (30 kun)',
      tested: 'Test Restore Muvaffaqiyatli (2 daqiqa oldin)'
    },
    {
      code: 'BKP-20261030-FULL',
      type: 'DATABASE_FULL',
      scope: 'PLATFORM_FULL',
      size: '14.2 GB',
      checksum: 'sha256:3a7719f912...441',
      status: 'VERIFIED',
      completed_at: 'Kecha, 02:30 UTC',
      retention: '2026-11-29 gacha',
      tested: 'Test Restore Muvaffaqiyatli'
    }
  ]);

  // Mock Audit Log for Admin Operations
  const [adminAuditLogs] = useState([
    {
      id: 'AUD-PL-901',
      time: '14:28:12 UTC',
      actor: 'Akmal Rustamov (Super Admin)',
      action: 'UPDATE_FEATURE_FLAG',
      target: 'ENABLE_REALTIME_CAMERA_AI',
      ip: '194.27.81.12',
      result: 'SUCCESS',
      reason: 'Enterprise mijozlar uchun yoqildi',
      before: { is_active: false, updated_at: '2026-10-30T12:00:00' },
      after: { is_active: true, updated_at: '2026-10-31T14:28:12' }
    },
    {
      id: 'AUD-PL-900',
      time: '13:10:04 UTC',
      actor: 'Sarvar Aliyev (Support Admin)',
      action: 'GRANT_SUPPORT_ACCESS',
      target: 'T-1002 (Korzinka Express)',
      ip: '82.215.98.4',
      result: 'SUCCESS',
      reason: 'POS sync ticket #SUP-9912 diagnostikasi',
      before: { active_session: null },
      after: { session_code: 'SUP-20261031-A901', scope: 'INTEGRATION_DIAGNOSTICS', duration: '60m' }
    }
  ]);

  const handleCreateSupportSession = () => {
    if (!supportReason || supportReason.length < 10) return;
    const newSession = {
      code: `SUP-${Date.now().toString().slice(-4)}`,
      admin: 'Akmal Rustamov (Super Admin)',
      tenant: supportTenant,
      case_id: 'SUP-MANUAL',
      reason: supportReason,
      scope: supportScope,
      expires_in: `${supportDuration} daqiqa qoldi`,
      status: 'ACTIVE'
    };
    setSupportSessions([newSession, ...supportSessions]);
    setShowSupportModal(false);
  };

  const handleTriggerHighRiskAction = (title: string, target: string) => {
    setHighRiskActionTitle(title);
    setHighRiskTarget(target);
    setStepUpPassword('');
    setShowHighRiskModal(true);
  };

  const handleConfirmHighRisk = () => {
    if (!stepUpPassword) return;
    setShowHighRiskModal(false);
    alert(`Amaliyot muvaffaqiyatli bajarildi va audit jurnaliga yozildi: ${highRiskActionTitle}`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b14] font-sans text-slate-100 antialiased">
      {/* PRIVILEGED ADMIN SIDEBAR */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-rose-950/40 bg-[#090d18]">
        {/* Brand Header with Explicit Control Plane Label */}
        <div className="flex h-16 items-center justify-between border-b border-rose-950/40 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-600 to-red-800 text-white font-bold text-sm shadow-lg shadow-rose-950/60">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">ProfitLeak</span>
                <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-bold text-rose-400 border border-rose-500/30">
                  CONTROL
                </span>
              </div>
              <div className="text-[10px] text-rose-400/80 font-medium">Platform Admin Plane</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platforma Boshqaruvi
          </div>

          {[
            { id: 'overview', label: 'Platform Control Center', icon: Activity },
            { id: 'tenants', label: 'Tenants / Korxonalar', icon: Layers, badge: tenants.length },
            { id: 'users_rbac', label: 'Foydalanuvchilar & RBAC', icon: Users },
            { id: 'support', label: 'Support & Tenant Access', icon: HelpCircle, badge: supportSessions.length },
            { id: 'subscriptions', label: 'Tariflar & Billing', icon: DollarSign },
            { id: 'ai_control', label: 'AI Control Center', icon: Bot, highlight: true },
            { id: 'integrations', label: 'Integratsiyalar Nazorati', icon: Link2 },
            { id: 'monitoring', label: 'SRE Tizim Monitoringi', icon: Server },
            { id: 'security', label: 'Security SOC Markazi', icon: ShieldCheck },
            { id: 'audit', label: 'Audit Jurnali (Immutable)', icon: FileText },
            { id: 'backups', label: 'Backup & Restore', icon: Save },
            { id: 'feature_flags', label: 'Feature Flags', icon: Flag },
            { id: 'incidents', label: 'Hodisalar (Incidents)', icon: AlertOctagon },
            { id: 'jobs', label: 'Jobs & Navbatlar', icon: Clock },
            { id: 'configuration', label: 'Xavfsiz Konfiguratsiya', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id as any)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                    isActive ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Back to Business Plane Switcher */}
        <div className="border-t border-slate-800/80 p-3 bg-[#070b14]">
          <button
            onClick={() => onNavigate('pos')}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Biznes Paneliga Qaytish
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#070b14]">
        {/* PRIVILEGED TOP HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-rose-950/40 bg-[#090d18] px-6">
          <div className="flex items-center gap-4">
            {/* Environment Badge */}
            <div className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-xs font-bold text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>MUHIT: {environment}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>Host: <code className="text-slate-300 font-mono">cp.platform.profitleak.uz</code></span>
              <span>•</span>
              <span>Uptime: <strong className="text-emerald-400">99.98%</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step-Up Status Badge */}
            <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-300">MFA: <strong>Faol (Hardware Key)</strong></span>
            </div>

            {/* Current Admin User */}
            <div className="flex items-center gap-2 text-xs text-right">
              <div>
                <div className="font-bold text-white">Akmal Rustamov</div>
                <div className="text-[10px] text-rose-400">Platform Super Admin</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 font-bold text-white text-xs">
                AR
              </div>
            </div>
          </div>
        </header>

        {/* ACTIVE SUPPORT SESSION WARNING BANNER (IF ANY) */}
        {supportSessions.length > 0 && (
          <div className="flex items-center justify-between bg-amber-500/15 border-b border-amber-500/30 px-6 py-2 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>FAOL SUPPORT SESSIYASI:</strong> {supportSessions[0].tenant} bo'yicha kirish ruxsatnomasi ochilgan ({supportSessions[0].scope}). {supportSessions[0].expires_in}.
              </span>
            </div>
            <button
              onClick={() => setSupportSessions([])}
              className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-200 hover:bg-amber-500/30 border border-amber-500/40"
            >
              Sessiyani Bekor Qilish
            </button>
          </div>
        )}

        {/* TAB CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              {/* Platform Health Hero Card */}
              <div className="rounded-2xl border border-rose-950/60 bg-gradient-to-r from-rose-950/30 via-[#0d1326] to-[#090d18] p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                        BARCHA TIZIMLAR BARKAMOL (HEALTHY)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">v2.8.4-build.20261031</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
                      ProfitLeak Platform Control Center
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      Multi-tenant SaaS infratuzilmasi, AI klasteri, xavfsizlik SOC va integratsiya oqimlarining markaziy boshqaruvi.
                      Mijozlarning shaxsiy moliyaviy ma'lumotlari izolyatsiyalangan.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSupportModal(true)}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-950/40"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Vaqtinchalik Support Ruxsati So'rash
                    </button>
                  </div>
                </div>

                {/* 8 Top KPI Cards */}
                <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-4 lg:grid-cols-8">
                  {[
                    { label: 'Faol Tenantlar', value: '18 ta', sub: '+2 ta bu oy', color: 'text-white' },
                    { label: 'Platform Users', value: '142 ta', sub: '99% MFA aktiv', color: 'text-white' },
                    { label: 'Ochiq Incidents', value: '0 ta', sub: 'SEV1/SEV2: 0', color: 'text-emerald-400' },
                    { label: 'Kritik Xavfsizlik', value: '0 ta', sub: '24h tinch', color: 'text-emerald-400' },
                    { label: 'AI Agentlar', value: '10/10', sub: '180ms latency', color: 'text-emerald-400' },
                    { label: 'Xato Joblar', value: '0 ta', sub: 'DLQ toza', color: 'text-emerald-400' },
                    { label: 'Integratsiyalar', value: '5 ta faol', sub: '0 ta xato sync', color: 'text-emerald-400' },
                    { label: 'Backup Holati', value: 'VERIFIED', sub: 'Restore tested', color: 'text-emerald-400' }
                  ].map((card, i) => (
                    <div key={i} className="rounded-xl border border-slate-800/80 bg-[#101626]/70 p-3">
                      <div className="text-[10px] font-semibold text-slate-400 truncate">{card.label}</div>
                      <div className={`text-base font-bold mt-1 ${card.color}`}>{card.value}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5 truncate">{card.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core System Telemetry Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Services Status */}
                <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Server className="h-4 w-4 text-indigo-400" />
                      Infratuzilma Tugunlari
                    </h2>
                    <span className="text-[10px] text-emerald-400 font-bold">Hammasi Normal</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: 'API Gateway (Node/FastAPI)', status: 'HEALTHY', latency: '118ms', error: '0.04%' },
                      { name: 'PostgreSQL Primary Cluster', status: 'HEALTHY', latency: '4.2ms', pool: '18/100 conn' },
                      { name: 'Redis Cache & Queue Broker', status: 'HEALTHY', latency: '1.1ms', mem: '142 MB / 2 GB' },
                      { name: 'Worker Execution Pool', status: 'HEALTHY', latency: 'Normal', active: '8 workers' },
                      { name: 'Event Bus (Kafka/RabbitMQ)', status: 'HEALTHY', lag: '12ms', throughput: '320 msg/s' },
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-[#12192f] p-2.5 border border-slate-800/60">
                        <div>
                          <div className="font-semibold text-white">{s.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {s.pool || s.mem || s.active || s.throughput}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-[9px] font-bold">
                            {s.status}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.latency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Cluster Observability */}
                <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bot className="h-4 w-4 text-emerald-400" />
                      AI Klasteri & Provider Router
                    </h2>
                    <span className="text-[10px] text-slate-400">Bugungi narx: $4.82</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg bg-[#12192f] p-3 border border-slate-800/60 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Asosiy Model (Primary):</span>
                        <strong className="text-emerald-400 font-mono">gemini-flash-latest</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>O'rtacha kechikish (Latency):</span>
                        <span className="font-mono text-slate-200">180ms</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Zaxira zanjir (Fallback):</span>
                        <span className="text-indigo-300">Gemini 3.8 Flash → Claude</span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#12192f] p-3 border border-slate-800/60 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Oylik Token Kvotasi Sarfi:</span>
                        <span className="font-bold text-white">28.5% (1.42M / 5.0M)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-[28.5%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security SOC Summary */}
                <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                      Security SOC Holati
                    </h2>
                    <span className="text-[10px] text-emerald-400 font-bold">Xavfsiz</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center rounded-lg bg-[#12192f] p-2.5 border border-slate-800/60">
                      <span className="text-slate-300">Suspicious Logins (24h):</span>
                      <strong className="text-white">0 ta (Bloklangan)</strong>
                    </div>
                    <div className="flex justify-between items-center rounded-lg bg-[#12192f] p-2.5 border border-slate-800/60">
                      <span className="text-slate-300">Rate Limit Triggerlar:</span>
                      <strong className="text-white">12 ta (Avtomatik ushlandi)</strong>
                    </div>
                    <div className="flex justify-between items-center rounded-lg bg-[#12192f] p-2.5 border border-slate-800/60">
                      <span className="text-slate-300">Privilege Escalation Urinish:</span>
                      <strong className="text-emerald-400">0 ta (To'liq himoyalangan)</strong>
                    </div>
                    <div className="flex justify-between items-center rounded-lg bg-[#12192f] p-2.5 border border-slate-800/60">
                      <span className="text-slate-300">Oxirgi Backup Restore Sinovi:</span>
                      <strong className="text-emerald-400">Bugun 02:35 (Muvaffaqiyatli)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TENANTS */}
          {activeAdminTab === 'tenants' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="h-5 w-5 text-rose-400" />
                    Tenants (Ro'yxatdan O'tgan Korxonalar)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Platformadagi barcha tashkilotlar nazorati. Diqqat: Tenantning shaxsiy savdo jurnali yoki qarzdorlari bu yerda ko'rinmaydi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerHighRiskAction('TENANT_SUSPENSION_REVIEW', 'T-1004')}
                    className="rounded-lg bg-rose-600/20 border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-600/30"
                  >
                    Tenant To'xtatish (Suspension)
                  </button>
                </div>
              </div>

              {/* Tenants Table */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#12192f] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Tenant ID / Nomi</th>
                        <th className="px-4 py-3">Tarif & Holat</th>
                        <th className="px-4 py-3">Rahbar / Viloyat</th>
                        <th className="px-4 py-3 text-center">Foydalanuvchi / Filial</th>
                        <th className="px-4 py-3 text-right">Disk / AI Sarfi</th>
                        <th className="px-4 py-3">Faol Integratsiyalar</th>
                        <th className="px-4 py-3 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {tenants.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-800/30">
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-white block">{t.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{t.id}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold mr-1.5">
                              {t.plan}
                            </span>
                            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              t.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : t.status === 'TRIAL'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-slate-200 block">{t.owner}</span>
                            <span className="text-[10px] text-slate-400">{t.region}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="font-semibold text-slate-200">{t.users_count} ta user</span>
                            <span className="text-[10px] text-slate-500 block">{t.branches_count} ta filial</span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="font-mono text-slate-200 block">{(t.storage_mb / 1024).toFixed(1)} GB</span>
                            <span className="text-[10px] text-indigo-300 font-mono">{(t.ai_tokens_month / 1000).toFixed(0)}k token</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {t.integrations.map((it, i) => (
                                <span key={i} className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300">
                                  {it}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => {
                                setSupportTenant(t.name);
                                setShowSupportModal(true);
                              }}
                              className="rounded bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-600/30"
                            >
                              Support So'rash
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

          {/* TAB 3: USERS & RBAC */}
          {activeAdminTab === 'users_rbac' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="h-5 w-5 text-rose-400" />
                    Platform RBAC & Ruxsatlar Matritsasi (Least Privilege)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Platforma administratorlari rollari alohida boshqariladi. O'ziga o'zi Super Admin rolini berish qat'iy bloklangan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    role: 'PLATFORM_SUPER_ADMIN',
                    desc: 'To\'liq platforma operatsiyalari vakolati. Barcha yuqori xavfli harakatlar Step-Up MFA talab qiladi.',
                    users: ['Akmal Rustamov'],
                    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                  },
                  {
                    role: 'SECURITY_ADMIN',
                    desc: 'Xavfsizlik hodisalari, audit jurnali, MFA reset va sessiyalarni bekor qilish huquqi.',
                    users: ['Nodir Qodirov', 'Sherzod Auditor'],
                    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                  },
                  {
                    role: 'SUPPORT_ADMIN',
                    desc: 'Faqat ruxsat berilgan SupportAccessSession orqali tenantning texnik xatolarini ko\'rish huquqi.',
                    users: ['Sarvar Aliyev'],
                    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
                  },
                  {
                    role: 'AI_PLATFORM_ADMIN',
                    desc: 'AI modellari routeri, kvotalar, prompt versiyalari va token sarfini boshqarish huquqi.',
                    users: ['Dilshod ML SRE'],
                    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                  }
                ].map((r, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-[#0d1326] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`rounded px-2.5 py-1 text-xs font-bold border ${r.color}`}>
                        {r.role}
                      </span>
                      <span className="text-xs text-slate-400">{r.users.length} ta foydalanuvchi</span>
                    </div>
                    <p className="text-xs text-slate-300">{r.desc}</p>
                    <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      Mas'ullar: <strong className="text-slate-200">{r.users.join(', ')}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUPPORT */}
          {activeAdminTab === 'support' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-indigo-400" />
                    Vaqtinchalik Support Ruxsatnomalari (Zero-Trust Support Access)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Har bir tenantga kirish aniq sabab, muddat (max 4 soat) va audit jurnali yozuvi bilan cheklangan.
                  </p>
                </div>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Yangi Ruxsatnoma So'rash
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {supportSessions.map((s, idx) => (
                  <div key={idx} className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-[#0d1326] to-[#0d1326] p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-300">{s.code}</span>
                        <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                          {s.scope}
                        </span>
                        <span className="text-xs font-bold text-white">{s.tenant}</span>
                      </div>
                      <span className="text-xs text-amber-300 font-semibold">{s.expires_in}</span>
                    </div>
                    <p className="text-xs text-slate-300">Sabab: {s.reason}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Administrator: <strong className="text-slate-200">{s.admin}</strong></span>
                      <button
                        onClick={() => setSupportSessions([])}
                        className="text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Sessiyani Tugatish / Qaytarib Olish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI CONTROL CENTER */}
          {activeAdminTab === 'ai_control' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Bot className="h-5 w-5 text-emerald-400" />
                    AI Platform & Multi-Agent Operations Center
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10 ta ixtisoslashgan agentlar salomatligi, model marshrutizatsiyasi, fallback zanjiri va xarajatlar tahlili
                  </p>
                </div>
              </div>

              {/* 10 AI Agents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { name: 'Supervisor AI', role: 'Bosh Muvofiqlashtiruvchi', status: 'HEALTHY', latency: '160ms', cost: '$18.20' },
                  { name: 'Customer AI', role: 'Mijoz 360 & Kredit Tahlil', status: 'HEALTHY', latency: '190ms', cost: '$9.40' },
                  { name: 'Collection AI', role: 'Qarz Undiruv Strategi', status: 'HEALTHY', latency: '185ms', cost: '$14.50' },
                  { name: 'Finance AI', role: 'G\'aznachilik & Cashflow', status: 'HEALTHY', latency: '175ms', cost: '$12.80' },
                  { name: 'Sales AI', role: 'Savdo Dinamikasi', status: 'HEALTHY', latency: '150ms', cost: '$5.10' },
                  { name: 'Inventory AI', role: 'Zaxira & Qoldiq Nazorati', status: 'HEALTHY', latency: '165ms', cost: '$6.20' },
                  { name: 'Procurement AI', role: 'Yetkazib Beruvchi Taqqoslash', status: 'HEALTHY', latency: '210ms', cost: '$7.10' },
                  { name: 'Tax AI', role: 'Didox EHF & QQS Nazorati', status: 'HEALTHY', latency: '195ms', cost: '$4.30' },
                  { name: 'Security AI', role: 'Anomaliya & Firibgarlik', status: 'HEALTHY', latency: '140ms', cost: '$2.15' },
                  { name: 'Vision AI', role: 'Kamera Oqimi & Kassa Nazorati', status: 'HEALTHY', latency: '280ms', cost: '$9.40' },
                ].map((ag, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-[#12192f] p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{ag.name}</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-[9px] font-bold">
                        {ag.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">{ag.role}</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                      <span>{ag.latency}</span>
                      <span className="font-mono text-emerald-400 font-semibold">{ag.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BACKUPS */}
          {activeAdminTab === 'backups' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Save className="h-5 w-5 text-emerald-400" />
                    Zaxira Nusxalari & Tiklash (Backup & Restore Verification)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    "Backup saqlandi" degani "Tiklashga tayyor" degani emas. Har bir zaxira nusxasi avtomatik tekshiruv sinovidan o'tadi.
                  </p>
                </div>
                <button
                  onClick={() => handleTriggerHighRiskAction('RESTORE_DATABASE_CLUSTER', 'PROD_DB_PRIMARY')}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-sm"
                >
                  Ma'lumotlar Bazasini Qayta Tiklash (Restore)
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {backups.map((b, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{b.code}</span>
                        <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                          {b.status}
                        </span>
                        <span className="text-xs text-slate-400">{b.type} • {b.scope}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-200">{b.size}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-4">
                      <span>Yakunlangan vaqti: <strong className="text-slate-200">{b.completed_at}</strong></span>
                      <span>Saqlash muddati: <strong className="text-slate-200">{b.retention}</strong></span>
                      <span>Sinov natijasi: <strong className="text-emerald-400">{b.tested}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT */}
          {activeAdminTab === 'audit' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-300" />
                    O'zgarmas Audit Jurnali (Immutable Audit Logs)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Har bir harakat sha256 xesh zanjiri bilan bog'langan. Hech bir administrator yozuvlarni o'chira yoki tahrirlay olmaydi.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0d1326] overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#12192f] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Vaqt & Log ID</th>
                      <th className="px-4 py-3">Mas'ul Operator</th>
                      <th className="px-4 py-3">Harakat (Action)</th>
                      <th className="px-4 py-3">Nishon (Target)</th>
                      <th className="px-4 py-3">IP Manzili</th>
                      <th className="px-4 py-3 text-right">Tafsilotlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {adminAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <span className="font-mono text-slate-400 block">{log.time}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{log.id}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">{log.actor}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold font-mono">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">{log.target}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">{log.ip}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedAuditLog(log)}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            Diff Ko'rish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: FEATURE FLAGS */}
          {activeAdminTab === 'feature_flags' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Flag className="h-5 w-5 text-indigo-400" />
                    Feature Flag Engine & A/B Rollouts
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Yangi funksiyalarni deploy qilmasdan turib alohida tenantlar yoki butun platforma bo'yicha faollashtirish
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {featureFlags.map((flag, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-bold text-indigo-300 font-mono">{flag.key}</code>
                        <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold">
                          {flag.status}
                        </span>
                        <span className="text-[10px] text-slate-400">Doirasi: {flag.scope} ({flag.plan})</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1">{flag.name}</h3>
                      <p className="text-[11px] text-slate-500">Rollout: {flag.rollout} • Oxirgi o'zgartirgan: {flag.updated_by}</p>
                    </div>
                    <button
                      onClick={() => handleTriggerHighRiskAction('FEATURE_FLAG_TOGGLE', flag.key)}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      O'zgartirish
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* MODAL 1: REQUEST TEMPORARY SUPPORT ACCESS */}
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d1326] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">Vaqtinchalik Tenant Support Ruxsatnomasi</h2>
                </div>
                <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Mijoz Tashkilot (Tenant):</label>
                  <select
                    value={supportTenant}
                    onChange={(e) => setSupportTenant(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-[#12192f] p-2.5 text-white"
                  >
                    <option value="Korzinka Express Chilonzor">Korzinka Express Chilonzor (#T-1002)</option>
                    <option value="Olimov Savdo MCHJ">Olimov Savdo MCHJ (#T-1001)</option>
                    <option value="Buxoro Shakar Distribution">Buxoro Shakar Distribution (#T-1003)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Kirish Ko'lami (Scope):</label>
                  <select
                    value={supportScope}
                    onChange={(e) => setSupportScope(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-[#12192f] p-2.5 text-white"
                  >
                    <option value="INTEGRATION_DIAGNOSTICS">INTEGRATION_DIAGNOSTICS (Kassa & API xatolari)</option>
                    <option value="READ_ONLY_LOGS">READ_ONLY_LOGS (Faqat xatolar jurnali)</option>
                    <option value="READ_ONLY_PROFILE">READ_ONLY_PROFILE (Faqat umumiy profil)</option>
                    <option value="FINANCIAL_READ_ONLY">FINANCIAL_READ_ONLY (Reconciliation & Balanslar)</option>
                    <option value="FULL_SUPPORT">FULL_SUPPORT (To'liq texnik qo'llab-quvvatlash)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Muddat (Daqiqalarda):</label>
                  <select
                    value={supportDuration}
                    onChange={(e) => setSupportDuration(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-[#12192f] p-2.5 text-white"
                  >
                    <option value="30">30 daqiqa</option>
                    <option value="60">60 daqiqa (1 soat)</option>
                    <option value="120">120 daqiqa (2 soat)</option>
                    <option value="240">240 daqiqa (4 soat - Maksimal)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Sabab & Chipta Raqami (Majburiy):</label>
                  <textarea
                    value={supportReason}
                    onChange={(e) => setSupportReason(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-[#12192f] p-2.5 text-white placeholder-slate-500"
                    placeholder="Mijoz murojaati raqami va aniq texnik sabab..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleCreateSupportSession}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Ruxsatnomani Faollashtirish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: HIGH-RISK ACTION CONFIRMATION (STEP-UP) */}
        {showHighRiskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#0d1326] shadow-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertOctagon className="h-6 w-6" />
                <h2 className="text-base font-bold text-white">Yuqori Xavfli Amaliyot (Step-Up Auth)</h2>
              </div>

              <p className="text-xs text-slate-300">
                Siz <strong>{highRiskActionTitle}</strong> amaliyotini <strong>{highRiskTarget}</strong> nishoni bo'yicha bajarmoqchisiz.
                Ushbu harakat platforma faoliyatiga jiddiy ta'sir ko'rsatishi mumkin.
              </p>

              <div className="space-y-2 text-xs">
                <label className="text-slate-400 block">Tasdiqlash uchun Administrator Paroli / MFA Kodini kiriting:</label>
                <input
                  type="password"
                  value={stepUpPassword}
                  onChange={(e) => setStepUpPassword(e.target.value)}
                  placeholder="Super Admin maxfiy kaliti..."
                  className="w-full rounded-lg border border-rose-500/50 bg-[#12192f] p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button
                  onClick={() => setShowHighRiskModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleConfirmHighRisk}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                >
                  Tasdiqlash & Ijro Etish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: AUDIT DIFF DRAWER */}
        {selectedAuditLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0d1326] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-white">Audit O'zgarishlar Tafsiloti (Before / After Diff)</h2>
                <button onClick={() => setSelectedAuditLog(null)} className="text-slate-400 hover:text-white">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-[#12192f] p-3 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Oldingi Holat (Before)</span>
                  <pre className="text-rose-300 whitespace-pre-wrap">{JSON.stringify(selectedAuditLog.before, null, 2)}</pre>
                </div>
                <div className="rounded-lg bg-[#12192f] p-3 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Yangi Holat (After)</span>
                  <pre className="text-emerald-300 whitespace-pre-wrap">{JSON.stringify(selectedAuditLog.after, null, 2)}</pre>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Maxfiy ma'lumotlar siyosati: <strong>Barcha API kalitlar va parollar avtomatik niqoblangan (Masked).</strong>
              </div>

              <div className="flex justify-end border-t border-slate-800 pt-3">
                <button
                  onClick={() => setSelectedAuditLog(null)}
                  className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
