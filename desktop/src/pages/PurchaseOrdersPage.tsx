import React from 'react';
import { Truck, Plus, FileText, Search, AlertCircle, CheckCircle2, ChevronRight, Package, DollarSign, Calendar } from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface PurchaseOrdersPageProps {
  onNavigate: (view: AppView) => void;
}

const MOCK_POS = [
  { id: 'po-1', number: 'PO-2026-000184', supplier: 'Coca-Cola Distribution', status: 'CONFIRMED', amount: '24.5M UZS', received: '60/100', expected: '2026-11-02' },
  { id: 'po-2', number: 'PO-2026-000185', supplier: 'Nestle Food', status: 'DRAFT', amount: '11.2M UZS', received: '0/24', expected: '2026-11-05' },
];

export const PurchaseOrdersPage: React.FC<PurchaseOrdersPageProps> = ({ onNavigate }) => {
  return (
    <AppShell currentView="purchase_orders" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Xarid Buyurtmalari (Purchase Orders)</h1>
            <p className="text-sm text-slate-400">Yetkazib beruvchilarga yuborilgan buyurtmalarni boshqarish</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Yangi Buyurtma Yaratish
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['DRAFT', 'Tasdiq kutmoqda', 'Confirmed', 'Partially Received'].map(s => (
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
                <th className="py-3 px-4">PO #</th>
                <th className="py-3 px-4">Yetkazib beruvchi</th>
                <th className="py-3 px-4">Summa</th>
                <th className="py-3 px-4">Qabul qilingan</th>
                <th className="py-3 px-4">Yetkazish</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amal</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_POS.map(po => (
                <tr key={po.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-semibold">{po.number}</td>
                  <td className="py-3 px-4">{po.supplier}</td>
                  <td className="py-3 px-4">{po.amount}</td>
                  <td className="py-3 px-4">{po.received}</td>
                  <td className="py-3 px-4">{po.expected}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${po.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                        {po.status}
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
