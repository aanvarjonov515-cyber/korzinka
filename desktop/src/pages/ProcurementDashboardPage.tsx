import React, { useState } from 'react';
import {
  Truck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  DollarSign,
  Building2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Package,
  FileSpreadsheet,
  ClipboardList,
  Scale,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface ProcurementDashboardPageProps {
  onNavigate: (view: AppView) => void;
}

export const ProcurementDashboardPage: React.FC<ProcurementDashboardPageProps> = ({ onNavigate }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = [
    { label: 'Ochiq Buyurtmalar (Open PO)', value: '18 ta', detail: '4.2 mlrd UZS', icon: FileSpreadsheet, color: 'text-blue-400' },
    { label: 'Kutilayotgan Qabul (Pending GRN)', value: '5 ta', detail: '850M UZS', icon: Truck, color: 'text-amber-400' },
    { label: 'Jami Accounts Payable', value: '1.2 mlrd', detail: '345M muddati o\'tgan', icon: Scale, color: 'text-rose-400' },
    { label: 'Xarid Samaradorligi', value: '94.2%', detail: 'OTIF Rate', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  return (
    <AppShell currentView="purchase_orders" onNavigate={onNavigate}>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Procurement & Supply Chain Control</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                LOGISTICS V6.8
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Xaridlar zanjiri, omborga qabul va yetkazib beruvchilar bilan hisob-kitob tahlili
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('purchase_requests')}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" /> Xarid So'rovlari
            </button>
            <button 
              onClick={() => onNavigate('purchase_orders')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-950/50 transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" /> Yangi PO
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <s.icon className="w-24 h-24" />
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{s.label}</div>
              <div className="text-2xl font-bold text-slate-100">{s.value}</div>
              <div className={`text-xs font-medium ${s.color}`}>{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Suppliers (Performance) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-amber-400" /> Top Yetkazib Beruvchilar
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Coca-Cola Distribution', score: 98, trend: 'up', volume: '142M' },
                { name: 'Nestle Food Tashkent', score: 92, trend: 'stable', volume: '85M' },
                { name: 'Korzinka Logistics', score: 88, trend: 'down', volume: '210M' },
                { name: 'Samarqand Dairy', score: 85, trend: 'up', volume: '45M' },
              ].map((sup, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">{idx + 1}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{sup.name}</div>
                      <div className="text-[10px] text-slate-500">Hajm: {sup.volume}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${sup.score > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{sup.score}%</div>
                    <div className="text-[9px] text-slate-600 uppercase">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Landed Cost Analysis (True Cost) */}
          <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> True Cost (Landed) Trendi
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Product:</span>
                <select className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded px-2 py-1 outline-none">
                  <option>Coca-Cola 1.5L</option>
                  <option>Fanta 0.5L</option>
                  <option>Nescafe Gold</option>
                </select>
              </div>
            </div>
            
            <div className="h-48 flex items-end gap-2 px-4 pb-4 pt-8">
              {[45, 62, 58, 85, 74, 90, 82, 65, 78, 88, 92, 95].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[9px] px-1.5 py-0.5 rounded text-white whitespace-nowrap">
                    Landed: 6,420
                  </div>
                  <div 
                    className="w-full bg-blue-500/20 group-hover:bg-blue-500/40 transition-all rounded-t-sm border-x border-t border-blue-500/30" 
                    style={{ height: `${h}%` }}
                  />
                  <div 
                    className="absolute bottom-0 w-full bg-blue-600/60 rounded-t-sm" 
                    style={{ height: `${h * 0.7}%` }}
                  />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-blue-600/60" />
                <div className="text-[10px] text-slate-400">Base Unit Cost</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/30" />
                <div className="text-[10px] text-slate-400">Landed Overhead (Freight/Handling)</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Supply Chain Intelligence */}
        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-tight">AI Supply Chain Intelligence</h3>
            </div>
            <button className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-wider">
              Run Re-Optimization Algorithm
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-300">Price Drift Alert</div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                "Nestle Food" mahsulotlari narxi so'nggi 3 oyda 12% ga oshgan. Bozor o'rtachasi 4.5%. Yetkazib beruvchini almashtirish yoki shartnomani qayta ko'rib chiqish tavsiya etiladi.
              </p>
            </div>
            <div className="space-y-2 border-x border-slate-800/50 px-6">
              <div className="text-[11px] font-bold text-slate-300">Lead Time Variance</div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                "Samarqand Dairy" uchun lead time 1 kundan 2.5 kunga oshgan. Bu omborda stock-out xavfini 15% ga oshirmoqda. Safety stock darajasini +20% ga ko'tarish kerak.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-300">Landed Cost Optimization</div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Yirik hajmli xaridlar (Bulk Buy) orqali transport yuklamasini 4.2% dan 2.8% ga tushirish imkoniyati mavjud. Oylik xarid rejasini optimallashtiring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const PlusIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const StarIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
