import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Plus, 
  FileText, 
  Search, 
  ChevronRight, 
  PieChart, 
  Filter, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  X,
  ChevronDown,
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface ExpensesPageProps {
  onNavigate: (view: AppView) => void;
}

const EXPENSE_CATEGORIES = [
  'RENT', 'ELECTRICITY', 'GAS', 'WATER', 'INTERNET', 'TELEPHONE', 
  'TRANSPORT', 'DELIVERY', 'MAINTENANCE', 'SECURITY', 'CLEANING', 
  'SOFTWARE', 'SUBSCRIPTIONS', 'MARKETING', 'OFFICE_SUPPLIES', 
  'BANK_FEES', 'TAXES_AND_FEES', 'SALARY_RELATED', 'TRAVEL', 'OTHER'
];

const MOCK_EXPENSES = [
  { 
    id: 'exp-1', 
    number: 'EXP-2026-000381', 
    title: 'Office Rent - October', 
    category: 'RENT', 
    amount: 12500000, 
    status: 'PAID', 
    date: '2026-10-25',
    branch: 'Main Branch',
    vendor: 'City Real Estate LLC'
  },
  { 
    id: 'exp-2', 
    number: 'EXP-2026-000382', 
    title: 'Internet Service (Optic)', 
    category: 'INTERNET', 
    amount: 850000, 
    status: 'SUBMITTED', 
    date: '2026-10-28',
    branch: 'Chilonzor Branch',
    vendor: 'Uzonline'
  },
  { 
    id: 'exp-3', 
    number: 'EXP-2026-000383', 
    title: 'Electricity Bill', 
    category: 'ELECTRICITY', 
    amount: 4200000, 
    status: 'UNDER_REVIEW', 
    date: '2026-10-27',
    branch: 'Main Branch',
    vendor: 'Toshkent Elektr Tarmoqlari'
  },
  { 
    id: 'exp-4', 
    number: 'EXP-2026-000384', 
    title: 'Facebook Ads - Q3', 
    category: 'MARKETING', 
    amount: 15000000, 
    status: 'DRAFT', 
    date: '2026-10-30',
    branch: 'Marketing HQ',
    vendor: 'Meta Platforms'
  },
];

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onNavigate }) => {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [expenses, searchQuery, categoryFilter, statusFilter]);

  const stats = [
    { label: 'Bugungi Xarajat', value: '4.2M UZS', trend: '+5%', trendUp: true, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Shu Oydagi Jami', value: '142.8M UZS', trend: '-2%', trendUp: false, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Byudjet Qoldig\'i', value: '18.5M UZS', trend: '85% ishlatildi', trendUp: true, icon: PieChart, color: 'text-amber-400' },
    { label: 'Tasdiq Kutilmoqda', value: '12 ta', trend: '3 ta shoshilinch', trendUp: true, icon: Clock, color: 'text-rose-400' },
  ];

  return (
    <AppShell currentView="expenses" onNavigate={onNavigate}>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-8 h-8 text-emerald-400" />
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Operatsion Xarajatlar (OPEX Engine)</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                FINANCE V6.6
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Business operating costs, utilities, rent, and cost-center allocations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-800 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Yangi Xarajat
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <s.icon className="w-24 h-24" />
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{s.label}</div>
              <div className="text-xl font-bold text-slate-100">{s.value}</div>
              <div className={`text-[10px] font-medium flex items-center gap-1 ${s.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {s.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Qidiruv: Xarajat nomi, vendor, raqam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-semibold rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option value="ALL">Barcha Kategoriyalar</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-semibold rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option value="ALL">Barcha Holatlar</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PAID">PAID</option>
            </select>

            <button className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Xarajat #</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tafsilotlar</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vendor / Yetkazib beruvchi</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filial</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Summa</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sana</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/30 transition-all group">
                    <td className="py-4 px-6">
                      <div className="text-xs font-mono font-bold text-emerald-400">{exp.number}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-200">{exp.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 uppercase">
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700">{exp.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs text-slate-300 font-medium">{exp.vendor}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-slate-400">{exp.branch}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="text-xs font-bold text-slate-100 tabular-nums">{exp.amount.toLocaleString()} UZS</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded flex w-fit items-center gap-1 ${
                        exp.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        exp.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        exp.status === 'SUBMITTED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {exp.status === 'PAID' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {exp.status === 'SUBMITTED' && <Clock className="w-2.5 h-2.5" />}
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {exp.date}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredExpenses.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="p-4 rounded-full bg-slate-950 w-fit mx-auto text-slate-700">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-500">Hech qanday xarajat topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};
