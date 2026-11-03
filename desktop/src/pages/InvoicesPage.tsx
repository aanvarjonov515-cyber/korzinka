import React, { useState } from 'react';
import { FileText, Search, Plus, CheckCircle2, AlertTriangle, XCircle, ChevronRight, DollarSign } from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface InvoicesPageProps {
  onNavigate: (view: AppView) => void;
}

const MOCK_INVOICES = [
  { id: 'inv-1', number: 'SIN-2026-000341', supplier: 'Coca-Cola Distribution', po: 'PO-2026-000184', status: 'MATCHED', amount: '24.5M UZS' },
  { id: 'inv-2', number: 'SIN-2026-000342', supplier: 'Nestle Food', po: 'PO-2026-000185', status: 'PRICE_MISMATCH', amount: '11.2M UZS' },
];

export const InvoicesPage: React.FC<InvoicesPageProps> = ({ onNavigate }) => {
  return (
    <AppShell currentView="invoices" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Supplier hisob-fakturalari (Invoices)</h1>
            <p className="text-sm text-slate-400">PO, qabul va supplier invoice ma’lumotlarini solishtirish</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Invoice Qo'shish
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">PO #</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Match Status</th>
                <th className="py-3 px-4">Amal</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map(inv => (
                <tr key={inv.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-semibold">{inv.number}</td>
                  <td className="py-3 px-4">{inv.supplier}</td>
                  <td className="py-3 px-4">{inv.po}</td>
                  <td className="py-3 px-4">{inv.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.status === 'MATCHED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {inv.status}
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
