import React, { useState } from 'react';
import {
  Truck,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Package,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Star,
  ShieldCheck,
  Zap,
  BarChart3,
  History,
  FileSearch,
  Scale,
  BrainCircuit,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Filter,
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface Supplier360PageProps {
  onNavigate: (view: AppView) => void;
  supplierId?: string;
}

type TabType = 
  | 'profile' 
  | 'contacts' 
  | 'payments' 
  | 'products' 
  | 'contracts' 
  | 'purchases' 
  | 'receiving' 
  | 'claims' 
  | 'ledger' 
  | 'performance' 
  | 'ai' 
  | 'audit';

export const Supplier360Page: React.FC<Supplier360PageProps> = ({ onNavigate, supplierId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profil & Master Data', icon: Building2 },
    { id: 'contacts', label: 'Kontaktlar', icon: Users },
    { id: 'payments', label: 'Bank & Rekvizitlar', icon: CreditCard },
    { id: 'products', label: 'Mahsulotlar', icon: Package },
    { id: 'contracts', label: 'Shartnomalar', icon: FileText },
    { id: 'purchases', label: 'Xaridlar (PO)', icon: History },
    { id: 'receiving', label: 'Qabul (GRN)', icon: Truck },
    { id: 'claims', label: 'Sifat & Claims', icon: ShieldCheck },
    { id: 'ledger', label: 'AP Ledger', icon: Scale },
    { id: 'performance', label: 'Scorecard', icon: Activity },
    { id: 'ai', label: 'AI Analytics', icon: BrainCircuit },
    { id: 'audit', label: 'Audit Log', icon: FileSearch },
  ];

  return (
    <AppShell currentView="suppliers" onNavigate={onNavigate}>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('suppliers')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <ArrowDownRight className="w-5 h-5 rotate-90" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Coca-Cola Bottlers Uzbekistan</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SUP-000012
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                  Manufacturer
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Toshkent, Sergeli</span>
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Status: Aktiv</span>
                <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Grade: A+</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-800 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export 360 Report
            </button>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> New PO
            </button>
          </div>
        </div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Jami Qarz (Total Payable)</div>
            <div className="text-xl font-bold text-slate-100">1,240,500,000 UZS</div>
            <div className="flex items-center gap-1 text-[10px] text-rose-400">
              <ArrowUpRight className="w-3 h-3" /> +12% oydan oyga
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Muddati o'tgan (Overdue)</div>
            <div className="text-xl font-bold text-rose-500">85,000,000 UZS</div>
            <div className="text-[10px] text-slate-500">3 ta invoice bo'yicha</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Yillik Xarid (YTD Spend)</div>
            <div className="text-xl font-bold text-blue-400">14.2 mlrd UZS</div>
            <div className="text-[10px] text-slate-500">Top 3 supplier ro'yxatida</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">OTIF (On-Time In-Full)</div>
            <div className="text-xl font-bold text-emerald-400">98.4%</div>
            <div className="text-[10px] text-slate-500">Sektor o'rtachasidan yuqori</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Landed Cost Factor</div>
            <div className="text-xl font-bold text-amber-400">4.2%</div>
            <div className="text-[10px] text-slate-500">Transport & Handling yuklamasi</div>
          </div>
        </div>

        {/* 12 Tabs Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" /> Yuridik Ma'lumotlar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Yuridik Nomi</label>
                        <div className="text-sm font-semibold text-slate-200">Coca-Cola Bottlers Uzbekistan LLC</div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">STIR (TIN)</label>
                        <div className="text-sm font-mono font-bold text-slate-200">301294821</div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ro'yxatdan o'tgan raqami</label>
                        <div className="text-sm font-mono text-slate-200">REG-UZ-92831</div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Asosiy Valyuta</label>
                        <div className="text-sm font-bold text-slate-200">UZS (O'zbek so'mi)</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" /> Geografik Ma'lumotlar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Mamlakat</label>
                        <div className="text-sm font-semibold text-slate-200">O'zbekiston</div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Viloyat / Shahar</label>
                        <div className="text-sm font-semibold text-slate-200">Toshkent sh.</div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Tuman</label>
                        <div className="text-sm font-semibold text-slate-200">Sergeli tumani</div>
                      </div>
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">To'liq Manzil</label>
                        <div className="text-sm text-slate-300">Sanoat zonasi, 12-berk ko'cha, 4-bino</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" /> Kommerziya Shartlari
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                        <span className="text-xs text-slate-400">To'lov muddati</span>
                        <span className="text-xs font-bold text-emerald-400">NET 14 kun</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                        <span className="text-xs text-slate-400">Lead Time</span>
                        <span className="text-xs font-bold text-slate-200">2 ish kuni</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                        <span className="text-xs text-slate-400">Kredit Limiti</span>
                        <span className="text-xs font-bold text-slate-200">2,000,000,000 UZS</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                        <span className="text-xs text-slate-400">Min. Order</span>
                        <span className="text-xs font-bold text-slate-200">5,000,000 UZS</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-tight">AI Master Data Health</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Ma'lumotlar to'liqligi</span>
                        <span className="text-emerald-400 font-bold">95%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[95%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Supplier rekvizitlari va kontaktlar 95% to'liq. Faqat shartnomaning PDF nusxasi yuklanmagan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-400" /> Accounts Payable (AP) Ledger
                    </h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sana</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entry Turi</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Debit (-)</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Credit (+)</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Balans</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {[
                          { date: '2026-10-25', type: 'INVOICE', ref: 'INV-92831', debit: 0, credit: 150000000, balance: 1240500000 },
                          { date: '2026-10-22', type: 'PAYMENT', ref: 'PAY-11022', debit: 120000000, credit: 0, balance: 1090500000 },
                          { date: '2026-10-15', type: 'INVOICE', ref: 'INV-92700', debit: 0, credit: 310500000, balance: 1210500000 },
                          { date: '2026-10-10', type: 'INVOICE', ref: 'INV-92650', debit: 0, credit: 45000000, balance: 900000000 },
                          { date: '2026-10-05', type: 'PAYMENT', ref: 'PAY-10950', debit: 200000000, credit: 0, balance: 855000000 },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 text-xs text-slate-400 font-mono">{row.date}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                                row.type === 'INVOICE' 
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {row.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs font-semibold text-slate-200">{row.ref}</td>
                            <td className="py-3 px-4 text-xs font-bold text-emerald-400 text-right">
                              {row.debit > 0 ? `-${row.debit.toLocaleString()}` : ''}
                            </td>
                            <td className="py-3 px-4 text-xs font-bold text-amber-400 text-right">
                              {row.credit > 0 ? `+${row.credit.toLocaleString()}` : ''}
                            </td>
                            <td className="py-3 px-4 text-xs font-bold text-slate-100 text-right tabular-nums">
                              {row.balance.toLocaleString()} UZS
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs can be added similarly */}
            {activeTab !== 'profile' && activeTab !== 'ledger' && (
              <div className="flex flex-col items-center justify-center p-20 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <div className="p-4 rounded-full bg-slate-800 text-slate-500">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{tabs.find(t => t.id === activeTab)?.label} Moduli</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    Bu bo'limda ma'lumotlarni tahlil qilish va boshqarish imkoniyati tez orada faollashadi.
                  </p>
                </div>
                <button className="px-6 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 transition-all">
                  Back to Overview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const Users = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
