import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Briefcase, 
  Wallet, 
  Clock, 
  AlertCircle,
  Brain,
  RefreshCcw,
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface FinancialSummary {
  revenue: number;
  cogs: number;
  opex: number;
  gross_profit: number;
  operating_profit: number;
  cash_in: number;
  cash_out: number;
  net_cash_flow: number;
}

interface Briefing {
  period: string;
  revenue_trend: 'UP' | 'DOWN';
  revenue_change_pct: number;
  cash_health: 'STABLE' | 'CRITICAL' | 'HEALTHY';
  top_outflow_category: string | null;
  observations: string[];
}

interface Projection {
  projection_date: string;
  expected_inflow: number;
  expected_outflow: number;
  projected_balance: number;
  confidence_level: number;
}

export const FinancialCommandCenter: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [projections, setProjections] = useState<Projection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessId] = useState('00000000-0000-0000-0000-000000000001'); // Mock/Default

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sumRes, briefRes, projRes] = await Promise.all([
        fetch(`/api/v1/finance/summary?business_id=${businessId}`),
        fetch(`/api/v1/finance/briefing?business_id=${businessId}`),
        fetch(`/api/v1/finance/projections?business_id=${businessId}`)
      ]);

      const sumData = await sumRes.json();
      const briefData = await briefRes.json();
      const projData = await projRes.json();

      setSummary(sumData);
      setBriefing(briefData);
      setProjections(projData);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncData = async () => {
    setIsLoading(true);
    await fetch(`/api/v1/finance/sync?business_id=${businessId}`, { method: 'POST' });
    await fetchData();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('uz-UZ').format(val) + ' UZS';
  };

  if (isLoading && !summary) {
    return (
      <AppShell currentView="finance" onNavigate={onNavigate}>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCcw className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="text-sm text-slate-400">Moliyaviy ma'lumotlar yuklanmoqda...</span>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell currentView="finance" onNavigate={onNavigate}>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Financial Command Center</h1>
            <p className="text-slate-400 text-sm mt-1">Real-vaqt rejimida biznesingizning moliyaviy holati va cashflow tahlili.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={syncData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all border border-slate-700"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Sinxronizatsiya
            </button>
            <div className="h-9 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Live Analysis</span>
            </div>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Revenue" 
            value={formatCurrency(summary?.revenue || 0)} 
            trend={briefing?.revenue_trend === 'UP' ? 'up' : 'down'} 
            pct={briefing?.revenue_change_pct || 0}
            icon={TrendingUp}
            color="emerald"
          />
          <MetricCard 
            title="Operating Profit" 
            value={formatCurrency(summary?.operating_profit || 0)} 
            trend={summary?.operating_profit && summary?.operating_profit > 0 ? 'up' : 'down'}
            pct={0}
            icon={BarChart3}
            color="blue"
          />
          <MetricCard 
            title="Net Cash Flow" 
            value={formatCurrency(summary?.net_cash_flow || 0)} 
            trend={summary?.net_cash_flow && summary?.net_cash_flow > 0 ? 'up' : 'down'}
            pct={0}
            icon={Wallet}
            color={briefing?.cash_health === 'CRITICAL' ? 'rose' : 'amber'}
          />
          <MetricCard 
            title="Burn Rate (Daily)" 
            value={formatCurrency((summary?.cash_out || 0) / 30)} 
            trend="none"
            pct={0}
            icon={Clock}
            color="slate"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Executive Briefing */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0d1322] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Brain className="h-24 w-24 text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Brain className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="font-bold text-slate-100 uppercase tracking-wider text-xs">AI Executive Briefing</h2>
              </div>

              <div className="space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Hurmatli rahbar, joriy oy ({briefing?.period}) uchun moliya tahlili tayyor:
                </p>
                
                <div className="space-y-3">
                  {briefing?.observations.map((obs, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-800/50"
                    >
                      <div className="mt-1 shrink-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                      <span className="text-xs text-slate-400 leading-normal">{obs}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/50">
                  <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group">
                    Batafsil tahlilni ko'rish
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Liquidity Risk */}
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-rose-400" />
                <h2 className="font-bold text-rose-100 uppercase tracking-wider text-xs">Likvidlik Xavfi</h2>
              </div>
              <p className="text-rose-200/70 text-[11px] leading-relaxed">
                Kelgusi 7 kun ichida kutilayotgan to'lovlar tushumlardan ko'p. Kassa yetishmovchiligi ehtimoli: 24%
              </p>
              <div className="mt-4 h-2 w-full bg-rose-500/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '24%' }}
                  className="h-full bg-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Main Analytics Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* P&L Breakdown */}
            <div className="bg-[#0d1322] border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-white tracking-tight">Foyda va Zarar (P&L)</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-400">Accrual Basis</span>
                </div>
              </div>

              <div className="space-y-6">
                <FinancialBar 
                  label="Revenue (Daromad)" 
                  value={summary?.revenue || 0} 
                  total={summary?.revenue || 1} 
                  color="bg-emerald-500" 
                />
                <FinancialBar 
                  label="COGS (Sotilgan tovar tan narxi)" 
                  value={summary?.cogs || 0} 
                  total={summary?.revenue || 1} 
                  color="bg-amber-500" 
                />
                <FinancialBar 
                  label="OPEX (Operatsion xarajatlar)" 
                  value={summary?.opex || 0} 
                  total={summary?.revenue || 1} 
                  color="bg-blue-500" 
                />
                
                <div className="pt-6 mt-6 border-t border-slate-800 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Operating Profit</span>
                    <div className="text-2xl font-bold text-white mt-1">{formatCurrency(summary?.operating_profit || 0)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Margin</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                      {summary?.revenue ? ((summary.operating_profit / summary.revenue) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cashflow Forecast */}
            <div className="bg-[#0d1322] border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-white tracking-tight">30-kunlik Cashflow Forecast</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-400">Inflow</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] text-slate-400">Outflow</span>
                  </div>
                </div>
              </div>

              <div className="h-48 flex items-end gap-2 px-2">
                {projections.slice(0, 15).map((p, idx) => {
                  const maxVal = Math.max(...projections.map(x => Math.max(x.expected_inflow, x.expected_outflow))) || 1;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(p.expected_inflow / maxVal) * 100}%` }}
                        className="w-full bg-emerald-500/40 group-hover:bg-emerald-500/60 rounded-t-sm transition-colors"
                      />
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(p.expected_outflow / maxVal) * 100}%` }}
                        className="w-full bg-rose-500/40 group-hover:bg-rose-500/60 rounded-b-sm transition-colors"
                      />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-[9px] shadow-2xl min-w-[120px]">
                          <div className="font-bold border-b border-slate-800 pb-1 mb-1">{p.projection_date}</div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">In:</span>
                            <span className="text-emerald-400 font-mono">{formatCurrency(p.expected_inflow)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Out:</span>
                            <span className="text-rose-400 font-mono">{formatCurrency(p.expected_outflow)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4 text-[9px] text-slate-600 px-2 font-medium">
                <span>Bugun</span>
                <span>+7 kun</span>
                <span>+15 kun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const MetricCard: React.FC<{ 
  title: string; 
  value: string; 
  trend: 'up' | 'down' | 'none'; 
  pct: number;
  icon: any;
  color: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
}> = ({ title, value, trend, pct, icon: Icon, color }) => {
  const colors = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className="bg-[#0d1322] border border-slate-800 rounded-3xl p-5 shadow-lg group hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend !== 'none' && (
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(pct).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{title}</div>
        <div className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">{value}</div>
      </div>
    </div>
  );
};

const FinancialBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
  const percentage = (value / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className="text-sm font-bold text-white font-mono">
          {new Intl.NumberFormat('uz-UZ').format(value)}
        </span>
      </div>
      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
};
