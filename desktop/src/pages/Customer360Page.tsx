import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  CreditCard,
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  X,
  DollarSign,
  FileText,
} from 'lucide-react';
import { CustomerListItem } from '../types/customer';
import { AppShell, AppView } from '../components/layout/AppShell';

const INITIAL_CUSTOMERS: CustomerListItem[] = [
  {
    id: 'c101-uuid-001',
    customer_number: 'CUS-00001824',
    customer_type: 'INDIVIDUAL',
    first_name: 'Anvar',
    last_name: 'Karimov',
    full_name: 'Karimov Anvar Shavkatovich',
    phone: '+998901234567',
    email: 'anvar.karimov@example.uz',
    address: 'Toshkent sh., Chilonzor tumani, 9-mavze',
    status: 'ACTIVE',
    total_purchase_amount: 3450000,
    total_paid_amount: 2970000,
    current_debt_amount: 480000,
    overdue_debt_amount: 0,
    credit_limit: 1500000,
    available_credit: 1020000,
    next_payment_due_at: '2026-10-31T18:00:00Z',
    risk_level: 'LOW',
    tags: ['Regular', 'VIP'],
    preferred_channel: 'VOICE',
    created_at: '2026-08-15T10:30:00Z',
  },
  {
    id: 'c102-uuid-002',
    customer_number: 'CUS-00001825',
    customer_type: 'BUSINESS',
    business_name: 'Usmanova Malika YaTT',
    first_name: 'Malika',
    last_name: 'Usmanova',
    full_name: 'Usmanova Malika Bahodirovna',
    phone: '+998939876543',
    email: 'malika.u@example.uz',
    address: 'Toshkent sh., Yunusobod 4-mavze',
    status: 'ACTIVE',
    total_purchase_amount: 1200000,
    total_paid_amount: 850000,
    current_debt_amount: 350000,
    overdue_debt_amount: 350000,
    credit_limit: 800000,
    available_credit: 450000,
    next_payment_due_at: '2026-10-28T12:00:00Z',
    risk_level: 'MEDIUM',
    tags: ['Corporate'],
    preferred_channel: 'TELEGRAM',
    created_at: '2026-09-01T14:20:00Z',
  },
];

interface Customer360PageProps {
  onNavigate: (view: AppView) => void;
}

type TabType = 'overview' | 'identity' | 'purchases' | 'products' | 'payments' | 'debts' | 'returns' | 'discounts' | 'promises' | 'communications' | 'documents' | 'timeline' | 'risk' | 'audit';

export const Customer360Page: React.FC<Customer360PageProps> = ({ onNavigate }) => {
  const [customers, setCustomers] = useState<CustomerListItem[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(INITIAL_CUSTOMERS[0].id);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isSensitiveRevealed, setIsSensitiveRevealed] = useState(false);

  // New customer form state
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhone, setNewPhone] = useState('+998');
  const [newEmail, setNewEmail] = useState('');
  const [newCreditLimit, setNewCreditLimit] = useState('1000000');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.full_name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.customer_number.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery]);

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const totalCustomers = customers.length;
  const totalDebt = customers.reduce((sum, c) => sum + c.current_debt_amount, 0);
  const totalOverdue = customers.reduce((sum, c) => sum + c.overdue_debt_amount, 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim() || !newPhone.trim()) {
      alert("Ism, familiya va telefon raqami majburiy!");
      return;
    }

    const newId = `c${Date.now()}`;
    const newNumber = `CUS-0000${Math.floor(1828 + Math.random() * 500)}`;
    const limit = parseFloat(newCreditLimit) || 0;

    const newCustomer: CustomerListItem = {
      id: newId,
      customer_number: newNumber,
      customer_type: 'INDIVIDUAL',
      first_name: newFirstName.trim(),
      last_name: newLastName.trim(),
      full_name: `${newLastName.trim()} ${newFirstName.trim()}`,
      phone: newPhone,
      email: newEmail.trim() || undefined,
      status: 'ACTIVE',
      total_purchase_amount: 0,
      total_paid_amount: 0,
      current_debt_amount: 0,
      overdue_debt_amount: 0,
      credit_limit: limit,
      available_credit: limit,
      risk_level: 'LOW',
      created_at: new Date().toISOString(),
    };

    setCustomers([newCustomer, ...customers]);
    setIsAddCustomerOpen(false);
    setSelectedCustomerId(newId);
    setNewFirstName('');
    setNewLastName('');
    setNewPhone('+998');
    setNewEmail('');
  };

  return (
    <AppShell currentView="customers" onNavigate={onNavigate}>
      <div className="flex flex-1 flex-col overflow-hidden bg-[#090d16]">
        {/* KPI Summary Strip */}
        <div className="grid grid-cols-4 gap-4 border-b border-slate-800 bg-[#0d1322]/60 p-4 shrink-0">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jami Mijozlar</div>
              <div className="mt-1 text-2xl font-bold text-white">{totalCustomers}</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Joriy Ochiq Qarzlar</div>
              <div className="mt-1 text-2xl font-bold text-amber-400">{totalDebt.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Muddati O'tgan Qarz</div>
              <div className="mt-1 text-2xl font-bold text-rose-400">{totalOverdue.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Kechiktirilgan To'lov</div>
              <div className="mt-1 text-xs font-semibold text-emerald-400">1 daqiqadan 20 kungacha</div>
              <div className="text-[10px] text-slate-500">PCI-DSS Tokenized Mandate</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Workspace: Directory List & 360 Detail View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Customers Directory Table */}
          <div className={`flex flex-col border-r border-slate-800 bg-[#090d16] transition-all duration-300 ${selectedCustomer ? 'w-1/2' : 'w-full'}`}>
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-4 bg-[#0d1322]/80">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Mijoz ismi, telefon raqami yoki CUS raqami bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => setIsAddCustomerOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/50 transition hover:bg-emerald-500 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Mijoz Qo'shish
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-5 font-semibold">Mijoz / Raqam</th>
                    <th className="py-3 px-4 font-semibold">Telefon</th>
                    <th className="py-3 px-4 font-semibold">Holat</th>
                    <th className="py-3 px-4 font-semibold">Joriy Qarz</th>
                    <th className="py-3 px-4 font-semibold">Xavf</th>
                    <th className="py-3 px-5 font-semibold text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCustomers.map((cust) => {
                    const isSelected = cust.id === selectedCustomerId;
                    return (
                      <tr
                        key={cust.id}
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className={`cursor-pointer transition hover:bg-slate-800/40 ${
                          isSelected ? 'bg-emerald-950/30 border-l-2 border-emerald-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-white">{cust.full_name}</div>
                          <div className="font-mono text-[11px] text-slate-400">{cust.customer_number}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{cust.phone}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded-lg px-2.5 py-0.5 text-[10px] font-semibold border ${
                              cust.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {cust.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {cust.current_debt_amount > 0 ? `${cust.current_debt_amount.toLocaleString()} UZS` : <span className="text-slate-500 font-normal">Qarz yo'q</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${
                              cust.risk_level === 'LOW'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {cust.risk_level}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomerId(cust.id);
                            }}
                            className="rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            360 Ko'rish
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer 360 Detail Drawer */}
          {selectedCustomer ? (
            <div className="flex flex-1 flex-col bg-[#111827] overflow-hidden">
              <div className="border-b border-slate-800 bg-[#0d1322] p-6 shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-white">{selectedCustomer.full_name}</h2>
                      <span className="font-mono text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-lg px-2.5 py-0.5">
                        {selectedCustomer.customer_number}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-5 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-mono text-slate-300">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        {selectedCustomer.phone}
                      </span>
                      {selectedCustomer.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          {selectedCustomer.email}
                        </span>
                      )}
                      {selectedCustomer.address && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          {selectedCustomer.address}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCustomerId(null)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Tabs Navigation */}
                <div className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-800 pb-2 text-xs">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'identity', label: 'Identity' },
                    { id: 'purchases', label: 'Purchases' },
                    { id: 'products', label: 'Products' },
                    { id: 'payments', label: 'Payments' },
                    { id: 'debts', label: 'Debts' },
                    { id: 'returns', label: 'Returns' },
                    { id: 'discounts', label: 'Discounts' },
                    { id: 'promises', label: 'Promises' },
                    { id: 'communications', label: 'Communications' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'risk', label: 'Risk & Recovery' },
                    { id: 'audit', label: 'Audit' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${
                        activeTab === tab.id
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 shadow-lg">
                        <div className="text-xs text-slate-400">Jami Xaridlar</div>
                        <div className="mt-1.5 text-xl font-bold font-mono text-white">
                          {selectedCustomer.total_purchase_amount.toLocaleString()} UZS
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 shadow-lg">
                        <div className="text-xs text-slate-400">To'langan Summa</div>
                        <div className="mt-1.5 text-xl font-bold font-mono text-emerald-400">
                          {selectedCustomer.total_paid_amount.toLocaleString()} UZS
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 shadow-lg">
                        <div className="text-xs text-slate-400">Ochiq Qarz Qoldig'i</div>
                        <div className="mt-1.5 text-xl font-bold font-mono text-amber-400">
                          {selectedCustomer.current_debt_amount.toLocaleString()} UZS
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 shadow-lg">
                        <div className="text-xs text-slate-400">Muddati O'tgan Qarz</div>
                        <div className="mt-1.5 text-xl font-bold font-mono text-rose-400">
                          {selectedCustomer.overdue_debt_amount.toLocaleString()} UZS
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Timeline & History</h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Birinchi xarid:</span>
                            <span className="text-slate-200 font-mono">{selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString('uz-UZ') : '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Oxirgi xarid:</span>
                            <span className="text-slate-200 font-mono">{selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString('uz-UZ') : '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Filial:</span>
                            <span className="text-slate-200">Toshkent Markaziy</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Boshqaruvchi:</span>
                            <span className="text-slate-200">Nodirbek Qodirov</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Financial Limits</h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Kredit Limiti:</span>
                            <span className="text-white font-bold font-mono">{selectedCustomer.credit_limit?.toLocaleString() || '0'} UZS</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Mavjud Limit:</span>
                            <span className="text-emerald-400 font-bold font-mono">{((selectedCustomer.credit_limit || 0) - selectedCustomer.current_debt_amount).toLocaleString()} UZS</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Ochiq qarzlar soni:</span>
                            <span className="text-slate-200 font-mono">{selectedCustomer.current_debt_amount > 0 ? '1' : '0'} ta</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Keyingi to'lov:</span>
                            <span className="text-amber-400 font-bold font-mono">{selectedCustomer.next_payment_due_at ? new Date(selectedCustomer.next_payment_due_at).toLocaleDateString('uz-UZ') : "Yo'q"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Risk & Priority</h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Risk Darajasi:</span>
                            <span className={`rounded-lg px-2 py-0.5 font-bold ${selectedCustomer.risk_level === 'LOW' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {selectedCustomer.risk_level}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Undiruv Ustuvorligi:</span>
                            <span className={`font-bold ${selectedCustomer.overdue_debt_amount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                              {selectedCustomer.overdue_debt_amount > 0 ? 'URGENT' : 'NORMAL'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Faol Va'dalar:</span>
                            <span className="text-slate-200">0 ta</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Afzal muloqot:</span>
                            <span className="text-slate-200 uppercase">{selectedCustomer.preferred_channel || 'VOICE'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Collection & Action Center Status
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                        {selectedCustomer.current_debt_amount > 0
                          ? `Mijozda faol qarz mavjud. Keyingi rejalashtirilgan to'lov vaqti: ${
                              selectedCustomer.next_payment_due_at
                                ? new Date(selectedCustomer.next_payment_due_at).toLocaleString('uz-UZ')
                                : 'Belgilanmagan'
                            }. To'lov vaqti kelganda karta tokenidan avtomatik yechiladi.`
                          : "Barcha qarzlar to'liq yopilgan. Kechiktirilgan to'lov va muddatli savdo uchun ruxsat ochiq."}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'identity' && (
                  <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-6 shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <h3 className="font-bold text-white text-sm">Shaxsni Tasdiqlovchi Hujjat Ma'lumotlari</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Bank va davlat qonunchiligiga ko'ra shifrlangan.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSensitiveRevealed(!isSensitiveRevealed)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                      >
                        {isSensitiveRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {isSensitiveRevealed ? "Yashirish" : "Audit Bilan Ochish"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6 text-xs">
                      <div>
                        <span className="text-slate-400">Hujjat turi:</span>
                        <div className="font-semibold text-white mt-1">Biometrik Pasport / ID Karta</div>
                      </div>
                      <div>
                        <span className="text-slate-400">JShShIR / PINFL:</span>
                        <div className="font-mono font-semibold text-white mt-1">
                          {isSensitiveRevealed ? '31205980042184' : '***********42'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Seriya va Raqam:</span>
                        <div className="font-mono font-semibold text-white mt-1">
                          {isSensitiveRevealed ? 'AA 7654321' : 'AA *****21'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Tasdiq Holati:</span>
                        <div className="mt-1">
                          <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-400 border border-emerald-500/20">
                            VERIFIED (TASDIQLANGAN)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'debts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Ochiq va Tarixiy Qarzdorliklar
                      </h4>
                      <span className="text-[10px] text-slate-500 italic">Authoritative Ledger History</span>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-800 bg-[#090d16] overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-900/50 text-slate-500 uppercase tracking-tighter">
                            <tr>
                              <th className="py-3 px-4">Qarz #</th>
                              <th className="py-3 px-4">Sana</th>
                              <th className="py-3 px-4">Savdo #</th>
                              <th className="py-3 px-4 text-right">Asosiy</th>
                              <th className="py-3 px-4 text-right">To'langan</th>
                              <th className="py-3 px-4 text-right">Qoldiq</th>
                              <th className="py-3 px-4">Holat</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40 text-slate-300">
                            <tr className="hover:bg-slate-800/30 transition-colors">
                              <td className="py-3 px-4 font-mono font-semibold text-emerald-400">DEBT-2026-000184</td>
                              <td className="py-3 px-4">30.10.2026</td>
                              <td className="py-3 px-4 text-blue-400 hover:underline cursor-pointer font-mono">SALE-4821</td>
                              <td className="py-3 px-4 text-right font-mono">480,000</td>
                              <td className="py-3 px-4 text-right font-mono text-emerald-400">0</td>
                              <td className="py-3 px-4 text-right font-mono text-amber-400 font-bold">480,000</td>
                              <td className="py-3 px-4">
                                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20 uppercase">
                                  Scheduled
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="rounded-2xl border border-blue-900/20 bg-blue-950/10 p-5">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          Savdo Traceability: DEBT-2026-000184
                        </h5>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <p className="text-slate-400 underline decoration-slate-700 underline-offset-4">Mahsulotlar:</p>
                            <ul className="list-disc list-inside space-y-1 text-slate-300">
                              <li>Artel TV 43" (1 ta)</li>
                              <li>HDMI Cable Gold (2 ta)</li>
                            </ul>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-slate-500">Filial: <span className="text-slate-200">Toshkent Markaziy</span></p>
                            <p className="text-slate-500">Kassir: <span className="text-slate-200">Nodirbek Qodirov</span></p>
                            <p className="text-slate-500">To'lov turi: <span className="text-amber-400">Nasiya (20 kun)</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="font-bold text-white text-sm">Tokenized Plastik Kartalar (PCI-DSS)</h3>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                        No Raw PAN / CVV Stored
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-slate-800 font-bold text-xs text-white border border-slate-700">
                          UZCARD
                        </div>
                        <div>
                          <div className="font-mono text-sm font-semibold text-white">•••• 4821</div>
                          <div className="text-[11px] text-slate-400">Verified Token · Amal qilish: 12/28</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                          Asosiy Karta
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'risk' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Deterministik Qarz Risk Profili va AI Tavsiyalari
                      </h4>
                      <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                        NON-DISCRIMINATORY V5.6
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs text-slate-400">Risk Balli (0 - 100)</div>
                        <div className="text-2xl font-bold font-mono text-rose-400">
                          {selectedCustomer.risk_level === 'LOW' ? '18.5' : '62.0'} / 100
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Risk darajasi: <span className="font-bold text-slate-200">{selectedCustomer.risk_level}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs text-slate-400">Kredit Limiti Ishlatilishi</div>
                        <div className="text-2xl font-bold font-mono text-amber-400">
                          {Math.round((selectedCustomer.current_debt_amount / (selectedCustomer.credit_limit || 1)) * 100)}%
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Limiti: {selectedCustomer.credit_limit?.toLocaleString()} UZS
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs text-slate-400">Undiruv Ustuvorligi</div>
                        <div className="text-2xl font-bold text-slate-100">
                          {selectedCustomer.overdue_debt_amount > 0 ? 'URGENT' : 'NORMAL'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Buzilgan va'dalar: <span className="text-rose-400 font-bold">{selectedCustomer.overdue_debt_amount > 0 ? '1' : '0'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Tiklash va Undiruv Tavsiyalari</h5>
                      <div className="space-y-2 text-xs">
                        {selectedCustomer.overdue_debt_amount > 0 ? (
                          <>
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
                              <div>
                                <span className="font-bold">VOICE AI CALL (Ovozli Qo'ng'iroq)</span>
                                <p className="text-[11px] text-rose-400 mt-0.5">Muddati o'tgan 350,000 UZS qarz bo'yicha to'lov sanasini aniqlash.</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">URGENT</span>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
                              <div>
                                <span className="font-bold">PAYMENT PLAN OFFER (Bo'lib to'lash rejasi)</span>
                                <p className="text-[11px] text-amber-400 mt-0.5">Mijozga 2 bosqichli haftalik qayta rejalashtirish taklif qilish.</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">HIGH</span>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                            <span className="font-bold">INTEL CHECK:</span> Barcha to'lovlar o'z vaqtida amalga oshirilgan. Qo'shimcha undiruv harakatlari talab etilmaydi.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'promises' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        To'lov Va'dalari (Promise to Pay)
                      </h4>
                      <span className="text-[10px] text-slate-500 italic">Validated via Collection Engine</span>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">480,000 UZS</div>
                            <div className="text-[11px] text-slate-400">Sana: 2026-10-31 · Manba: Voice AI Call</div>
                          </div>
                        </div>
                        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-tighter">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Customer Life-Cycle Timeline
                      </h4>
                    </div>

                    <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-800">
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-emerald-500 border-4 border-[#111827]"></div>
                        <div className="text-[11px] font-mono text-slate-500 uppercase">Bugun, 12:40</div>
                        <div className="mt-1 text-xs font-bold text-white">Voice AI Call Completed</div>
                        <p className="mt-0.5 text-[11px] text-slate-400 italic">"Mijoz to'lov va'dasini berdi."</p>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-blue-500 border-4 border-[#111827]"></div>
                        <div className="text-[11px] font-mono text-slate-500 uppercase">Kechagi, 10:00</div>
                        <div className="mt-1 text-xs font-bold text-white">New Debt Created</div>
                        <p className="mt-0.5 text-[11px] text-slate-400">DEBT-2026-000184 via SALE-4821</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'communications' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Ovozli AI, SMS va Telegram Muloqot Tarixi
                      </h4>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        AUDITED
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              VOICE AI CALL
                            </span>
                            <span className="text-xs font-bold text-white">42 soniya AI qo‘ng‘iroq</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            "Mijoz 2026-10-31 soat 15:00 ga 480,000 UZS to‘lov va’dasini berdi."
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">Bugun, 12:40</span>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                              SMS
                            </span>
                            <span className="text-xs font-bold text-white">Eslatma SMS yuborildi</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            "Qarzdorlik eslatmasi DEBT-2026-000184. ProfitLeak."
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">Kechagi, 16:15</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Xavfsizlik va Amallar Auditi (Immutable)
                      </h4>
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 tracking-widest">
                        TAMPER-EVIDENT
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                          <span className="font-bold text-slate-200">CUSTOMER.CREATED</span>
                          <span className="text-slate-500">by System (API)</span>
                        </div>
                        <span className="font-mono text-slate-500">2026-08-15 10:30:21</span>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                          <span className="font-bold text-slate-200">PAYMENT_METHOD.ADDED</span>
                          <span className="text-slate-500">by Cashier (N.Qodirov)</span>
                        </div>
                        <span className="font-mono text-slate-500">2026-08-15 10:45:00</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden flex-1 items-center justify-center p-8 text-center text-slate-500 lg:flex">
              <div>
                <Users className="mx-auto h-12 w-12 text-slate-700" />
                <div className="mt-3 text-sm font-semibold text-slate-400">Mijoz tanlanmagan</div>
                <p className="mt-1 text-xs text-slate-600">
                  To'liq 16-tabli Customer 360 ma'lumotlarini ko'rish uchun chapdagi ro'yxatdan mijozni tanlang.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Yangi Mijoz Qo'shish</h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Ism *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="Sardor"
                    className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Familiya *</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="Yusupov"
                    className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400">Telefon Raqami (+998...) *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+998901234567"
                  className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">Kredit Limiti (UZS)</label>
                <input
                  type="number"
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 font-medium text-slate-300 hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow hover:bg-emerald-500"
                >
                  Mijozni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
};
