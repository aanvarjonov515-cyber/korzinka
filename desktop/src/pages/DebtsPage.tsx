import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Search,
  AlertTriangle,
  Clock,
  X,
  CreditCard,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { DebtItem } from '../types/customer';
import { AppShell, AppView } from '../components/layout/AppShell';

const INITIAL_DEBTS: DebtItem[] = [
  {
    id: 'd101-uuid-001',
    debt_number: 'DEBT-2026-000184',
    customer_id: 'c101-uuid-001',
    customer_name: 'Anvar Karimov',
    customer_phone: '+998901234567',
    sale_id: 'sale-001',
    principal_amount: 480000,
    paid_amount: 0,
    outstanding_amount: 480000,
    currency: 'UZS',
    created_at: '2026-10-30T10:00:00Z',
    due_at: '2026-10-31T18:00:00Z',
    status: 'SCHEDULED',
    collection_status: 'SCHEDULED',
    aging_bucket: 'NOT_DUE',
    priority: 'NORMAL',
    risk_level: 'LOW',
  },
  {
    id: 'd102-uuid-002',
    debt_number: 'DEBT-2026-000185',
    customer_id: 'c102-uuid-002',
    customer_name: 'Malika Usmanova',
    customer_phone: '+998939876543',
    sale_id: 'sale-002',
    principal_amount: 350000,
    paid_amount: 0,
    outstanding_amount: 350000,
    currency: 'UZS',
    created_at: '2026-10-25T14:30:00Z',
    due_at: '2026-10-28T12:00:00Z',
    status: 'OVERDUE',
    collection_status: 'REMINDER_SENT',
    aging_bucket: '0_7',
    priority: 'HIGH',
    risk_level: 'MEDIUM',
  },
  {
    id: 'd103-uuid-003',
    debt_number: 'DEBT-2026-000186',
    customer_id: 'c104-uuid-004',
    customer_name: 'Shohruh Aliyev',
    customer_phone: '+998915556677',
    sale_id: 'sale-003',
    principal_amount: 800000,
    paid_amount: 200000,
    outstanding_amount: 600000,
    currency: 'UZS',
    created_at: '2026-10-10T09:15:00Z',
    due_at: '2026-10-15T10:00:00Z',
    status: 'OVERDUE',
    collection_status: 'PROMISED',
    aging_bucket: '8_30',
    priority: 'URGENT',
    risk_level: 'HIGH',
  },
];

interface DebtsPageProps {
  onNavigate: (view: AppView) => void;
}

export const DebtsPage: React.FC<DebtsPageProps> = ({ onNavigate }) => {
  const [debts, setDebts] = useState<DebtItem[]>(INITIAL_DEBTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgingBucket, setSelectedAgingBucket] = useState<string>('ALL');
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(INITIAL_DEBTS[0].id);

  // Modals state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const selectedDebt = useMemo(() => {
    return debts.find((d) => d.id === selectedDebtId) || null;
  }, [debts, selectedDebtId]);

  const now = new Date();
  const filteredDebts = useMemo(() => {
    return debts.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        d.debt_number.toLowerCase().includes(q) ||
        (d.customer_name && d.customer_name.toLowerCase().includes(q)) ||
        (d.customer_phone && d.customer_phone.includes(q));

      if (!matchSearch) return false;
      if (selectedAgingBucket === 'ALL') return true;
      if (selectedAgingBucket === 'PAID') return d.status === 'PAID';

      const dueDate = new Date(d.due_at);
      if (dueDate > now) {
        return selectedAgingBucket === 'NOT_DUE';
      }

      const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      if (selectedAgingBucket === '0_7') return diffDays <= 7;
      if (selectedAgingBucket === '8_30') return diffDays > 7 && diffDays <= 30;
      if (selectedAgingBucket === '31_60') return diffDays > 30 && diffDays <= 60;
      if (selectedAgingBucket === '60_PLUS') return diffDays > 60;

      return true;
    });
  }, [debts, searchQuery, selectedAgingBucket]);

  const totalPrincipal = debts.reduce((sum, d) => sum + d.principal_amount, 0);
  const totalOutstanding = debts.reduce((sum, d) => sum + d.outstanding_amount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.paid_amount, 0);
  const totalOverdue = debts
    .filter((d) => new Date(d.due_at) < now && d.status !== 'PAID')
    .reduce((sum, d) => sum + d.outstanding_amount, 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt) return;

    const amt = parseFloat(paymentAmount) || 0;
    if (amt <= 0 || amt > selectedDebt.outstanding_amount) {
      alert("Noto'g'ri to'lov summasi yoki Overpayment Guard ogohlantirishi!");
      return;
    }

    const newOutstanding = selectedDebt.outstanding_amount - amt;
    const newPaid = selectedDebt.paid_amount + amt;
    const isFullyPaid = newOutstanding === 0;

    setDebts(
      debts.map((d) => {
        if (d.id === selectedDebt.id) {
          return {
            ...d,
            outstanding_amount: newOutstanding,
            paid_amount: newPaid,
            status: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
            collection_status: isFullyPaid ? 'CLOSED_PAID' : d.collection_status,
          };
        }
        return d;
      })
    );

    setIsPayModalOpen(false);
    setPaymentAmount('');
    alert(isFullyPaid ? "Qarz to'liq yopildi!" : "Qisman to'lov qabul qilindi.");
  };

  return (
    <AppShell currentView="debts" onNavigate={onNavigate}>
      <div className="flex flex-1 flex-col overflow-hidden bg-[#090d16]">
        {/* KPI Summary Strip */}
        <div className="grid grid-cols-4 gap-4 border-b border-slate-800 bg-[#0d1322]/60 p-4 shrink-0">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jami Asosiy Qarz</div>
              <div className="mt-1 text-2xl font-bold text-white">{totalPrincipal.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Ochiq Qarz Qoldig'i</div>
              <div className="mt-1 text-2xl font-bold text-amber-400">{totalOutstanding.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Muddati O'tgan Summa</div>
              <div className="mt-1 text-2xl font-bold text-rose-400">{totalOverdue.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Undirilgan (To'langan)</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">{totalPaid.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Workspace: Debts Table & Detail Drawer */}
        <div className="flex flex-1 overflow-hidden">
          <div className={`flex flex-col border-r border-slate-800 bg-[#090d16] transition-all duration-300 ${selectedDebt ? 'w-1/2' : 'w-full'}`}>
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-4 bg-[#0d1322]/80">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Qarz raqami (DEBT-...), mijoz ismi yoki telefon raqami..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Aging Buckets Filter */}
              <div className="flex items-center gap-1 text-xs">
                {[
                  { id: 'ALL', label: 'Barchasi' },
                  { id: 'NOT_DUE', label: 'Muddati kelmagan' },
                  { id: '0_7', label: '0–7 kun' },
                  { id: '8_30', label: '8–30 kun' },
                  { id: '60_PLUS', label: '60+ kun' },
                ].map((bucket) => (
                  <button
                    key={bucket.id}
                    onClick={() => setSelectedAgingBucket(bucket.id)}
                    className={`rounded-xl px-3 py-2 font-medium transition ${
                      selectedAgingBucket === bucket.id
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {bucket.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-5 font-semibold">Qarz Raqami</th>
                    <th className="py-3 px-4 font-semibold">Mijoz</th>
                    <th className="py-3 px-4 font-semibold">Asosiy Qarz</th>
                    <th className="py-3 px-4 font-semibold">Qoldiq</th>
                    <th className="py-3 px-4 font-semibold">Muddati</th>
                    <th className="py-3 px-4 font-semibold">Holat</th>
                    <th className="py-3 px-5 font-semibold text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDebts.map((d) => {
                    const isSelected = d.id === selectedDebtId;
                    const isOverdue = new Date(d.due_at) < now && d.status !== 'PAID';

                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDebtId(d.id)}
                        className={`cursor-pointer transition hover:bg-slate-800/40 ${
                          isSelected ? 'bg-emerald-950/30 border-l-2 border-emerald-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-5 font-mono font-semibold text-emerald-400">
                          {d.debt_number}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{d.customer_name}</div>
                          <div className="font-mono text-[11px] text-slate-400">{d.customer_phone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {d.principal_amount.toLocaleString()} UZS
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {d.outstanding_amount.toLocaleString()} UZS
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <div className={isOverdue ? 'text-rose-400 font-semibold' : ''}>
                            {new Date(d.due_at).toLocaleDateString('uz-UZ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded-lg px-2.5 py-0.5 text-[10px] font-semibold border ${
                              d.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : d.status === 'OVERDUE'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDebtId(d.id);
                            }}
                            className="rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            Tafsilot
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Debt Detail Drawer */}
          {selectedDebt ? (
            <div className="flex flex-1 flex-col bg-[#111827] overflow-hidden">
              <div className="border-b border-slate-800 bg-[#0d1322] p-6 shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold font-mono text-emerald-400">{selectedDebt.debt_number}</h2>
                      <span className="rounded-lg bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                        {selectedDebt.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span>Mijoz: <strong className="text-white">{selectedDebt.customer_name}</strong></span>
                      <span>Telefon: <strong className="font-mono text-slate-300">{selectedDebt.customer_phone}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDebtId(null)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {selectedDebt.outstanding_amount > 0 && (
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => {
                        setPaymentAmount(selectedDebt.outstanding_amount.toString());
                        setIsPayModalOpen(true);
                      }}
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition"
                    >
                      To'lov Qabul Qilish (Manual Payment)
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 shadow-lg">
                    <div className="text-xs text-slate-400">Asosiy Qarz (Principal)</div>
                    <div className="mt-1.5 text-lg font-bold font-mono text-white">
                      {selectedDebt.principal_amount.toLocaleString()} UZS
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 shadow-lg">
                    <div className="text-xs text-slate-400">To'langan Summa</div>
                    <div className="mt-1.5 text-lg font-bold font-mono text-emerald-400">
                      {selectedDebt.paid_amount.toLocaleString()} UZS
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 shadow-lg">
                    <div className="text-xs text-slate-400">Qoldiq Qarz (Outstanding)</div>
                    <div className="mt-1.5 text-lg font-bold font-mono text-amber-400">
                      {selectedDebt.outstanding_amount.toLocaleString()} UZS
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-sm">Haqiqiy Debt Ledger Harakatlari</h3>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-semibold text-blue-400 block">DEBT_CREATED</span>
                      <span className="text-[11px] text-slate-400">Kechiktirilgan savdo (Pay Later)</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">+{selectedDebt.principal_amount.toLocaleString()} UZS</div>
                      <div className="text-[10px] text-slate-500">{new Date(selectedDebt.created_at).toLocaleString('uz-UZ')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden flex-1 items-center justify-center p-8 text-center text-slate-500 lg:flex">
              <div>
                <FileText className="mx-auto h-12 w-12 text-slate-700" />
                <div className="mt-3 text-sm font-semibold text-slate-400">Qarz tanlanmagan</div>
                <p className="mt-1 text-xs text-slate-600">
                  Batafsil ma'lumot va to'lov qabul qilish uchun chapdagi ro'yxatdan qarzni tanlang.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Payment Modal */}
      {isPayModalOpen && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">To'lov Qabul Qilish</h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-400">Qarz Raqami:</span>
                <div className="font-mono font-bold text-white mt-0.5">{selectedDebt.debt_number}</div>
              </div>

              <div>
                <span className="text-slate-400">Ochiq Qarz Qoldig'i:</span>
                <div className="font-mono font-bold text-amber-400 mt-0.5">
                  {selectedDebt.outstanding_amount.toLocaleString()} UZS
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium">To'lov Summasi (UZS) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedDebt.outstanding_amount}
                  className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-950 p-3 text-white font-mono shadow-inner focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">To'lov Usuli</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="CASH">Naqd Pul (Kassa)</option>
                  <option value="TERMINAL">Bank Terminali (POS)</option>
                  <option value="BANK_TRANSFER">Bank O'tkazmasi</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 font-medium text-slate-300 hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow hover:bg-emerald-500"
                >
                  To'lovni Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
};
