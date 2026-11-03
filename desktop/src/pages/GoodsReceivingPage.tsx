import React, { useState } from 'react';
import { Truck, Plus, FileText, Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface GoodsReceivingPageProps {
  onNavigate: (view: AppView) => void;
}

const MOCK_GRNS = [
  { id: 'grn-1', number: 'GRN-2026-000124', supplier: 'Coca-Cola Distribution', po: 'PO-2026-000184', status: 'POSTED', received: '2026-10-30' },
  { id: 'grn-2', number: 'GRN-2026-000125', supplier: 'Nestle Food', po: 'PO-2026-000185', status: 'PENDING_VERIFICATION', received: '2026-10-30' },
];

export const GoodsReceivingPage: React.FC<GoodsReceivingPageProps> = ({ onNavigate }) => {
  return (
    <AppShell currentView="receiving" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Tovar qabul qilish (Goods Receiving)</h1>
            <p className="text-sm text-slate-400">Yetkazib berilgan mahsulotlarni PO bilan tekshirish va omborga kirim qilish</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tovar qabul qilish
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['DRAFT', 'Tekshiruvda', 'Approved', 'Posted'].map(s => (
                <div key={s} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">{s}</div>
                    <div className="text-xl font-bold text-white mt-1">1 ta</div>
                </div>
            ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">GRN #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">PO #</th>
                <th className="py-3 px-4">Received At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amal</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GRNS.map(grn => (
                <tr key={grn.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-semibold">{grn.number}</td>
                  <td className="py-3 px-4">{grn.supplier}</td>
                  <td className="py-3 px-4">{grn.po}</td>
                  <td className="py-3 px-4">{grn.received}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${grn.status === 'POSTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {grn.status}
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
