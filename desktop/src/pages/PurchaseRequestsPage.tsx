import React, { useState } from 'react';
import { Truck, Plus, FileText, Search, AlertCircle, CheckCircle2, ChevronRight, Package, DollarSign, Calendar } from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface PurchaseRequestsPageProps {
  onNavigate: (view: AppView) => void;
}

const MOCK_REQUESTS = [
  { id: 'pr-1', number: 'PR-2026-000123', branch: 'Tashkent Main', priority: 'URGENT', status: 'UNDER_REVIEW', amount: '48.5M UZS', items: 5, needed: '2026-11-05' },
  { id: 'pr-2', number: 'PR-2026-000124', branch: 'Samarkand Central', priority: 'NORMAL', status: 'SUBMITTED', amount: '12.2M UZS', items: 2, needed: '2026-11-10' },
];

export const PurchaseRequestsPage: React.FC<PurchaseRequestsPageProps> = ({ onNavigate }) => {
  return (
    <AppShell currentView="purchase_requests" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Xarid so‘rovlari (Purchase Requests)</h1>
            <p className="text-sm text-slate-400">Ombor ehtiyojlari va xarid tasdiqlarini boshqarish</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Yangi So‘rov Yaratish
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['DRAFT', 'Tasdiq kutmoqda', 'Tasdiqlangan', 'Buyurtmaga aylangan'].map(s => (
                <div key={s} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">{s}</div>
                    <div className="text-xl font-bold text-white mt-1">2 ta</div>
                </div>
            ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Request #</th>
                <th className="py-3 px-4">Filial / Ombor</th>
                <th className="py-3 px-4">Mahsulotlar</th>
                <th className="py-3 px-4">Summa</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amal</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REQUESTS.map(pr => (
                <tr key={pr.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-semibold">{pr.number}</td>
                  <td className="py-3 px-4">{pr.branch}</td>
                  <td className="py-3 px-4">{pr.items} ta</td>
                  <td className="py-3 px-4">{pr.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pr.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
                      {pr.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                        {pr.status}
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
