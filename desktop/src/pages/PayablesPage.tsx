import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface PayablesPageProps {
  onNavigate: (view: AppView) => void;
}

const MOCK_PAYABLES = [
  { id: 'pay-1', number: 'PAY-SIN-000341', supplier: 'Coca-Cola Distribution', invoice: 'SIN-2026-000341', amount: '24.5M UZS', due: '2026-11-05', status: 'OPEN' },
];

export const PayablesPage: React.FC<PayablesPageProps> = ({ onNavigate }) => {
  return (
    <AppShell currentView="payables" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Supplier qarzdorliklari (Payables)</h1>
            <p className="text-sm text-slate-400">Tasdiqlangan supplier majburiyatlari va to‘lov muddatlari</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Payable #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYABLES.map(pay => (
                <tr key={pay.id} className="border-t border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-semibold">{pay.number}</td>
                  <td className="py-3 px-4">{pay.supplier}</td>
                  <td className="py-3 px-4">{pay.invoice}</td>
                  <td className="py-3 px-4">{pay.amount}</td>
                  <td className="py-3 px-4">{pay.due}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
};
