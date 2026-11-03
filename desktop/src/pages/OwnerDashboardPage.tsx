import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  Users,
  Building2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar,
  AlertCircle,
  Percent,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Package,
  Truck,
  CreditCard,
  PieChart,
  Bot,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface OwnerDashboardPageProps {
  onNavigate: (view: AppView) => void;
}

type PeriodType = 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | 'THIS_MONTH';

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ onNavigate }) => {
  const [period, setPeriod] = useState<PeriodType>('TODAY');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authoritative Core Financial Metrics (No double-counting)
  const coreMetrics = {
    sales_today: '124,500,000 UZS',
    gross_profit_today: '37,350,000 UZS',
    margin_pct: '30.0%',
    cash_position: '89,200,000 UZS',
    customer_debt_total: '217,500,000 UZS',
    customer_debt_overdue: '42,500,000 UZS',
    supplier_payable_total: '65,000,000 UZS',
    inventory_capital: '348,000,000 UZS',
    tax_obligation_monthly: '24,500,000 UZS',
    todays_profit_leak: '86,650,000 UZS'
  };

  // Top 5 Prioritized Actions from Action Center
  const topActions = [
    {
      id: 'ACT-2026-1048',
      title: "'Olimov Savdo MCHJ' qarzi 14 kunga kechikmoqda (Muddati o'tgan)",
      category: 'DEBT_COLLECTION',
      priority: 'CRITICAL',
      amount: '42,500,000 UZS',
      owner: 'Kredit Nazoratchisi',
      deadline: 'Bugun 17:00 (1 soat qoldi)',
      route: 'debts' as AppView,
      action_label: 'Qarz Sahifasini Ochish'
    },
    {
      id: 'ACT-2026-1049',
      title: 'Kassa va POS tushumida 250,000 UZS nomuvofiqlik aniqlandi',
      category: 'RECONCILIATION',
      priority: 'CRITICAL',
      amount: '250,000 UZS',
      owner: 'Bosh Kassir / Auditor',
      deadline: 'Bugun 18:00 (2 soat qoldi)',
      route: 'action_center' as AppView,
      action_label: 'Reconciliation Ochish'
    },
    {
      id: 'ACT-2026-1047',
      title: 'Coca-Cola 1.5L ombor qoldig\'i kritik darajada kam (2 kunlik zaxira)',
      category: 'INVENTORY_REORDER',
      priority: 'HIGH',
      amount: '18,400,000 UZS',
      owner: 'Ta\'minot Menejeri',
      deadline: 'Ertaga 12:00',
      route: 'procurement_dashboard' as AppView,
      action_label: 'Xarid Buyurtmasini Ochish'
    },
    {
      id: 'ACT-2026-1046',
      title: '5M UZS dan yuqori operatsion xarajat tasdiqlash talab qilinmoqda',
      category: 'APPROVAL',
      priority: 'HIGH',
      amount: '8,200,000 UZS',
      owner: 'Bosh Direktor (Owner)',
      deadline: 'Ertaga 10:00',
      route: 'expenses' as AppView,
      action_label: 'Xarajatni Tasdiqlash'
    },
    {
      id: 'ACT-2026-1042',
      title: 'Yetkazib beruvchi narxi taqqoslanmasdan qimmatroq xarid qilinmoqda',
      category: 'SUPPLIER_LEAK',
      priority: 'MEDIUM',
      amount: '4,500,000 UZS',
      owner: 'Xaridlar Bo\'limi',
      deadline: '2 kunda',
      route: 'suppliers' as AppView,
      action_label: 'Yetkazib Beruvchini Solishtirish'
    }
  ];

  // Itemized Profit Leak Breakdown across 13 Categories
  const profitLeakBreakdown = [
    { name: 'Muddati o\'tgan nasiya qarz (42.5M)', pct: 49, color: 'bg-rose-500' },
    { name: 'Yetishmovchilik tufayli yo\'qotilgan sotuv (18.4M)', pct: 21, color: 'bg-amber-500' },
    { name: 'Harakatsiz yotgan tovar kapitali (12.8M)', pct: 15, color: 'bg-indigo-500' },
    { name: 'Operatsion byudjetdan oshish (8.2M)', pct: 9, color: 'bg-orange-500' },
    { name: 'Yetkazib beruvchi narx farqi (4.5M)', pct: 5, color: 'bg-yellow-500' },
    { name: 'Kassa reconciliation farqi (250k)', pct: 1, color: 'bg-emerald-500' }
  ];

  const handleRefreshBriefing = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <AppShell currentView="executive" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#090d16] text-slate-100">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 text-white font-bold text-base shadow-lg shadow-emerald-950/40">
                PL
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    ProfitLeak Owner Executive Command Center
                  </h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    UNIFIED OPERATING PLATFORM
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Savdo, Qarz, Ta'minot, Xarajat, G'aznachilik, Soliq, AI va Action Center o'rtasida bog'langan yagona biznes ekotizimi
                </p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#0d1322] p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs font-medium">
              {(['TODAY', 'YESTERDAY', 'THIS_WEEK', 'THIS_MONTH'] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    period === p
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === 'TODAY' ? 'Bugun' : p === 'YESTERDAY' ? 'Kecha' : p === 'THIS_WEEK' ? 'Bu hafta' : 'Bu oy'}
                </button>
              ))}
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 bg-[#0d1322] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Barcha Filiallar (Markaziy)</option>
              <option value="b1">Toshkent Chilonzor Filiali</option>
              <option value="b2">Samarqand Markaziy</option>
              <option value="b3">Buxoro Filiali</option>
            </select>

            <button
              onClick={handleRefreshBriefing}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Yangilanmoqda...' : 'Sinxronlash'}</span>
            </button>
          </div>
        </div>

        {/* AUTHORITATIVE 8 CORE BUSINESS QUESTIONS BAR (Section 107) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">1. Bugun qancha sotildi?</span>
            <div className="text-sm font-bold text-white">{coreMetrics.sales_today}</div>
            <div className="text-[9px] text-emerald-400 font-semibold">+14.2% o'sish</div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">2. Qancha foyda?</span>
            <div className="text-sm font-bold text-emerald-400">{coreMetrics.gross_profit_today}</div>
            <div className="text-[9px] text-slate-400">{coreMetrics.margin_pct} yalpi marja</div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">3. Qancha pul bor?</span>
            <div className="text-sm font-bold text-white">{coreMetrics.cash_position}</div>
            <div className="text-[9px] text-slate-400">Kassa & Bank hisobda</div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">4. Qancha qarz bor?</span>
            <div className="text-sm font-bold text-amber-300">{coreMetrics.customer_debt_total}</div>
            <div className="text-[9px] text-rose-400 font-semibold">{coreMetrics.customer_debt_overdue} overdue</div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">5. Qancha supplier debt?</span>
            <div className="text-sm font-bold text-white">{coreMetrics.supplier_payable_total}</div>
            <div className="text-[9px] text-slate-400">To'lov muddati: 7 kun</div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">6. Inventory kapital?</span>
            <div className="text-sm font-bold text-white">{coreMetrics.inventory_capital}</div>
            <div className="text-[9px] text-slate-400">Omborlardagi haqiqiy tannarx</div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">7. Tax obligation?</span>
            <div className="text-sm font-bold text-indigo-300">{coreMetrics.tax_obligation_monthly}</div>
            <div className="text-[9px] text-slate-400">20-noyabrgacha (QQS)</div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-950/40 to-[#0d1322] border border-rose-500/40 space-y-1">
            <span className="text-[10px] text-rose-300 font-bold block truncate">8. Bugungi Profit Leak?</span>
            <div className="text-sm font-bold text-rose-400">{coreMetrics.todays_profit_leak}</div>
            <div className="text-[9px] text-rose-300 font-semibold">6 ta nuqtada xavf</div>
          </div>
        </div>

        {/* HERO ROW: TODAY'S PROFIT LEAK + AI EXECUTIVE BRIEFING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* TODAY'S PROFIT LEAK HERO BANNER (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-[#0d1322] to-[#0d1322] border border-rose-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
                <h3 className="text-sm font-bold text-rose-200 uppercase tracking-wider">
                  TODAY'S PROFIT LEAK
                </h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                ANIQLANGAN TAHLIL
              </span>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">86,650,000 UZS</div>
              <div className="text-xs text-rose-300/80 mt-1">
                6 ta kategoriyadagi jami oqib ketayotgan yoki xavf ostidagi foyda
              </div>
            </div>

            {/* Categorized Visual Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[10px] font-semibold uppercase text-slate-400">Yo'qotishlar Tarkibi:</div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                {profitLeakBreakdown.map((b, i) => (
                  <div key={i} className={`h-full ${b.color}`} style={{ width: `${b.pct}%` }} title={`${b.name}: ${b.pct}%`}></div>
                ))}
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                {profitLeakBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-300 text-[11px]">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className={`h-2 w-2 rounded-full ${item.color} shrink-0`}></span>
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono font-semibold text-slate-200">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('action_center')}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2"
            >
              <span>Action Centerda Barcha Leaklarni Bartaraf Etish</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* AI EXECUTIVE BRIEFING PANEL (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Boshqaruv Xulosasi (Executive Briefing)
                </h3>
              </div>
              <span className="text-[10px] rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 font-semibold">
                Supervisor AI tomonidan tuzildi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#12192b] p-3 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">1. Bugungi Holat</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Savdo sur'ati reja bo'yicha barqaror (124.5M UZS, marja 30%), biroq qarz kechikishi tufayli 42.5M UZS lik likvidlik bosimi mavjud.
                </p>
              </div>

              <div className="rounded-xl bg-[#12192b] p-3 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-400 block">2. Nima O'zgardi & Nega</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Kassa terminalida 250,000 UZS farq chiqdi (offline chek) va Coca-Cola zaxirasi zavod profilaktikasi sababli 2 kunlikka tushib qoldi.
                </p>
              </div>

              <div className="rounded-xl bg-[#12192b] p-3 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-400 block">3. Asosiy Xavf</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Agar 'Olimov Savdo' qarzi bugun bloklanmasa va qoldiq to'ldirilmasa, dam olish kunlarida 18.4M UZS toza daromad boy beriladi.
                </p>
              </div>

              <div className="rounded-xl bg-[#12192b] p-3 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block">4. Asosiy Imkoniyat</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Buxoro filialidagi ortiqcha 300 dona tovar Toshkentga ko'chirilsa va muqobil distribyutor bilan shartnoma qilinsa, marja 34% ga chiqadi.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/30 p-3 text-xs text-indigo-200 flex items-start gap-2.5">
              <Zap className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>Tavsiya etilgan strategik qadam:</strong> Quyidagi Top-5 ustuvor actionlarni mas'ullarga biriktirilgan holda tasdiqlash tavsiya etiladi.
              </div>
            </div>
          </div>
        </div>

        {/* TOP 5 ACTIONS DETERMINISTIC QUEUE */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Bugungi 5 Ustuvor Harakat (Top 5 Actions)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Moliyaviy ta'sir va SLA muddati bo'yicha deterministik algoritm orqali saralangan
              </p>
            </div>
            <button
              onClick={() => onNavigate('action_center')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Barcha actionlarni ko'rish ({topActions.length}) <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {topActions.map((act, index) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-[#12192b] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 font-bold text-white text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{act.id}</span>
                      <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                        act.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {act.priority}
                      </span>
                      <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.2 text-[9px] font-semibold">
                        {act.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs mt-1">{act.title}</h4>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap gap-3">
                      <span>Mas'ul: <strong className="text-slate-300">{act.owner}</strong></span>
                      <span>SLA: <strong className="text-amber-400">{act.deadline}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Moliyaviy ta'sir</span>
                    <span className="font-bold text-white font-mono text-xs">{act.amount}</span>
                  </div>
                  <button
                    onClick={() => onNavigate(act.route)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition-colors shadow-sm"
                  >
                    <span>{act.action_label}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
