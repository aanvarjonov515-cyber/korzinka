import React, { useState } from 'react';
import { Truck, Plus, FileText, Search, CreditCard, ChevronRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface SupplierPaymentsPageProps {
  onNavigate: (view: AppView) => void;
}

const MOCK_PROPOSALS = [
  { id: 'prop-1', number: 'PROP-2026-0001', supplier: 'Coca-Cola Distribution', amount: '24.5M UZS', status: 'SUBMITTED', method: 'BANK_TRANSFER' },
  { id: 'prop-2', number: 'PROP-2026-0002', supplier: 'Nestle Food', amount: '11.2M UZS', status: 'APPROVED', method: 'BANK_TRANSFER' },
];

export const SupplierPaymentsPage: React.FC<SupplierPaymentsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'transactions'>('proposals');

  return (
    <AppShell currentView="supplier_payments" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Supplier to‘lovlari (Supplier Payments)</h1>
            <p className="text-sm text-slate-400">Supplier majburiyatlari, tasdiqlar va pul chiqimini boshqarish</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> To'lov taklifi yaratish
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Due Today', 'Due This Week', 'Overdue', 'Awaiting Approval'].map(s => (
                <div key={s} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">{s}</div>
                    <div className="text-xl font-bold text-white mt-1">1 ta</div>
                </div>
            ))}
        </div>

        <div className="flex gap-4 border-b border-slate-800 text-sm">
            {['proposals', 'transactions'].map(t => (
                <button key={t} onClick={() => setActiveTab(t as any)} className={`pb-3 ${activeTab === t ? 'border-b-2 border-emerald-500 text-white' : 'text-slate-400'}`}>
                    {t === 'proposals' ? 'Takliflar' : 'Tranzaksiyalar'}
                </button>
            ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Proposal #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amal</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROPOSALS.map(prop => (
                <tr key={prop.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-semibold">{prop.number}</td>
                  <td className="py-3 px-4">{prop.supplier}</td>
                  <td className="py-3 px-4">{prop.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prop.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {prop.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold cursor-pointer">Ko'rish <ChevronRight className="w-3 h-3 inline"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
};
