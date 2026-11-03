import React, { useState, useMemo } from 'react';
import {
  Truck,
  Search,
  Plus,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  X,
  CreditCard,
  Package,
  Calendar,
  Clock,
  DollarSign,
  Star,
  FileText,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface SuppliersPageProps {
  onNavigate: (view: AppView) => void;
}

interface SupplierContactItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  is_primary: boolean;
}

interface SupplierPaymentProfileItem {
  id: string;
  payment_method_type: string;
  bank_name: string;
  account_reference_masked: string;
  recipient_name: string;
  status: string;
}

interface SupplierProductMappingItem {
  mapping_id: string;
  product_id: string;
  product_name: string;
  supplier_sku: string;
  purchase_unit_id: string;
  units_per_pack: number;
  last_purchase_price: number;
  currency: string;
  minimum_order_quantity: number;
  lead_time_days: number;
  is_preferred: boolean;
  price_history: { date: string; price: number; source: string }[];
}

interface SupplierItem {
  id: string;
  supplier_number: string;
  legal_name: string;
  display_name: string;
  supplier_type: 'MANUFACTURER' | 'DISTRIBUTOR' | 'WHOLESALER' | 'SERVICE_PROVIDER' | 'OTHER';
  tax_id?: string;
  phone?: string;
  email?: string;
  address?: string;
  contact_person?: string;
  payment_terms_days: number;
  delivery_lead_time_days: number;
  minimum_order_amount: number;
  default_currency: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'INACTIVE' | 'ARCHIVED';
  contacts: SupplierContactItem[];
  products: SupplierProductMappingItem[];
  payment_profiles: SupplierPaymentProfileItem[];
}

const INITIAL_SUPPLIERS: SupplierItem[] = [
  {
    id: 'sup-101',
    supplier_number: 'SUP-000012',
    legal_name: 'Coca-Cola Bottlers Uzbekistan LLC',
    display_name: 'Coca-Cola Distribution',
    supplier_type: 'MANUFACTURER',
    tax_id: '301294821',
    phone: '+998 71 200 4455',
    email: 'orders@coca-cola.uz',
    address: 'Toshkent sh., Sergeli tumani, Sanoat zonasi 12',
    contact_person: 'Jasur Shokirov',
    payment_terms_days: 14,
    delivery_lead_time_days: 2,
    minimum_order_amount: 5000000,
    default_currency: 'UZS',
    status: 'ACTIVE',
    contacts: [
      { id: 'c-1', name: 'Jasur Shokirov', role: 'Sales Manager', phone: '+998 90 123 4567', email: 'j.shokirov@coca-cola.uz', is_primary: true },
      { id: 'c-2', name: 'Elena Kim', role: 'Chief Accountant', phone: '+998 90 987 6543', email: 'e.kim@coca-cola.uz', is_primary: false },
    ],
    products: [
      {
        mapping_id: 'm-101',
        product_id: 'p-1',
        product_name: 'Coca-Cola 1.5L',
        supplier_sku: 'CC-1500-BOX',
        purchase_unit_id: 'BOX (6 pcs)',
        units_per_pack: 6,
        last_purchase_price: 64000,
        currency: 'UZS',
        minimum_order_quantity: 10,
        lead_time_days: 2,
        is_preferred: true,
        price_history: [
          { date: '2026-08-01', price: 62000, source: 'PURCHASE_ORDER' },
          { date: '2026-10-15', price: 64000, source: 'MANUAL_UPDATE' },
        ],
      },
      {
        mapping_id: 'm-102',
        product_id: 'p-2',
        product_name: 'Fanta Orange 0.5L',
        supplier_sku: 'FN-0500-BOX',
        purchase_unit_id: 'BOX (12 pcs)',
        units_per_pack: 12,
        last_purchase_price: 78000,
        currency: 'UZS',
        minimum_order_quantity: 5,
        lead_time_days: 2,
        is_preferred: true,
        price_history: [{ date: '2026-09-10', price: 78000, source: 'PURCHASE_ORDER' }],
      },
    ],
    payment_profiles: [
      {
        id: 'pp-1',
        payment_method_type: 'BANK_TRANSFER',
        bank_name: 'Ipak Yuli Bank',
        account_reference_masked: '••••••••••••4821',
        recipient_name: 'Coca-Cola Bottlers Uzbekistan LLC',
        status: 'VERIFIED',
      },
    ],
  },
  {
    id: 'sup-102',
    supplier_number: 'SUP-000013',
    legal_name: 'Nestle Food Tashkent Distribution LLC',
    display_name: 'Nestle Food',
    supplier_type: 'DISTRIBUTOR',
    tax_id: '204918239',
    phone: '+998 71 233 1122',
    email: 'supply@nestle.uz',
    address: 'Toshkent sh., Mirabad tumani, Oybek ko\'chasi 42',
    contact_person: 'Dilnoza Karimova',
    payment_terms_days: 21,
    delivery_lead_time_days: 3,
    minimum_order_amount: 10000000,
    default_currency: 'UZS',
    status: 'ACTIVE',
    contacts: [
      { id: 'c-3', name: 'Dilnoza Karimova', role: 'Key Account Manager', phone: '+998 93 555 1212', email: 'd.karimova@nestle.uz', is_primary: true },
    ],
    products: [
      {
        mapping_id: 'm-103',
        product_id: 'p-3',
        product_name: 'Nescafe Gold 100g',
        supplier_sku: 'NG-100G-CARTON',
        purchase_unit_id: 'CARTON (24 pcs)',
        units_per_pack: 24,
        last_purchase_price: 1120000,
        currency: 'UZS',
        minimum_order_quantity: 2,
        lead_time_days: 3,
        is_preferred: true,
        price_history: [{ date: '2026-09-01', price: 1120000, source: 'MANUAL_UPDATE' }],
      },
    ],
    payment_profiles: [
      {
        id: 'pp-2',
        payment_method_type: 'BANK_TRANSFER',
        bank_name: 'Kapitalbank',
        account_reference_masked: '••••••••••••9901',
        recipient_name: 'Nestle Food Tashkent LLC',
        status: 'VERIFIED',
      },
    ],
  },
  {
    id: 'sup-103',
    supplier_number: 'SUP-000014',
    legal_name: 'Samarkand Dairy Products FE',
    display_name: 'Samarkand Dairy',
    supplier_type: 'MANUFACTURER',
    tax_id: '401928301',
    phone: '+998 66 230 9090',
    email: 'info@sammilk.uz',
    address: 'Samarqand sh., Gagarin ko\'chasi 88',
    contact_person: 'Rustam Turayev',
    payment_terms_days: 7,
    delivery_lead_time_days: 1,
    minimum_order_amount: 3000000,
    default_currency: 'UZS',
    status: 'ON_HOLD',
    contacts: [
      { id: 'c-4', name: 'Rustam Turayev', role: 'Regional Sales', phone: '+998 91 333 4455', is_primary: true },
    ],
    products: [],
    payment_profiles: [],
  },
];

type DetailTabType = 'overview' | 'contacts' | 'products' | 'payment_terms' | 'payment_profile';

export const SuppliersPage: React.FC<SuppliersPageProps> = ({ onNavigate }) => {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(INITIAL_SUPPLIERS[0].id);
  const [detailTab, setDetailTab] = useState<DetailTabType>('overview');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddMappingOpen, setIsAddMappingOpen] = useState(false);

  // New Supplier Form State
  const [newLegalName, setNewLegalName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newType, setNewType] = useState<string>('DISTRIBUTOR');
  const [newTaxId, setNewTaxId] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newPaymentTermsDays, setNewPaymentTermsDays] = useState(14);
  const [newLeadTimeDays, setNewLeadTimeDays] = useState(2);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.legal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.supplier_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.phone && s.phone.includes(searchQuery)) ||
        (s.contact_person && s.contact_person.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || s.supplier_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [suppliers, searchQuery, statusFilter, typeFilter]);

  const selectedSupplier = useMemo(() => {
    return suppliers.find((s) => s.id === selectedSupplierId) || null;
  }, [suppliers, selectedSupplierId]);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLegalName.trim()) return;

    const newSup: SupplierItem = {
      id: `sup-${Date.now()}`,
      supplier_number: `SUP-0000${suppliers.length + 14}`,
      legal_name: newLegalName,
      display_name: newDisplayName || newLegalName,
      supplier_type: newType as any,
      tax_id: newTaxId,
      phone: newPhone,
      email: newEmail,
      contact_person: newContactPerson,
      payment_terms_days: newPaymentTermsDays,
      delivery_lead_time_days: newLeadTimeDays,
      minimum_order_amount: 0,
      default_currency: 'UZS',
      status: 'ACTIVE',
      contacts: newContactPerson
        ? [{ id: `c-${Date.now()}`, name: newContactPerson, role: 'Primary Contact', phone: newPhone, email: newEmail, is_primary: true }]
        : [],
      products: [],
      payment_profiles: [],
    };

    setSuppliers([newSup, ...suppliers]);
    setSelectedSupplierId(newSup.id);
    setIsAddSupplierOpen(false);

    // Reset Form
    setNewLegalName('');
    setNewDisplayName('');
    setNewTaxId('');
    setNewPhone('');
    setNewEmail('');
    setNewContactPerson('');
  };

  return (
    <AppShell currentView="suppliers" onNavigate={onNavigate}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-8 h-8 text-emerald-400" />
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Yetkazib Beruvchilar (Supplier Master)</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO PROCUREMENT V6.1
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Yetkazib beruvchilar bazasi, mahsulot biriktiruvlari va xarid narxlari tarixi
            </p>
          </div>

          <button
            onClick={() => setIsAddSupplierOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Yetkazib Beruvchi Qo'shish
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Aktiv Yetkazib Beruvchilar</div>
            <div className="text-xl font-bold text-slate-100">
              {suppliers.filter((s) => s.status === 'ACTIVE').length} ta
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">Barcha filiallar bo'yicha</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">On Hold (Vaqtinchalik to'xtatilgan)</div>
            <div className="text-xl font-bold text-amber-400">
              {suppliers.filter((s) => s.status === 'ON_HOLD').length} ta
            </div>
            <div className="text-[11px] text-slate-500">Menejer ko'rib chiqishi shart</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Biriktirilgan Mahsulot Turlari</div>
            <div className="text-xl font-bold text-blue-400">
              {suppliers.reduce((acc, s) => acc + s.products.length, 0)} ta
            </div>
            <div className="text-[11px] text-slate-500">Narxlar tarixi saqlangan</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">O'rtacha Yetkazib Berish Muddati</div>
            <div className="text-xl font-bold text-slate-100">2.1 kun</div>
            <div className="text-[11px] text-slate-500">Lead time days baseline</div>
          </div>
        </div>

        {/* Main Grid: Supplier List & Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Supplier List Section (5 cols or 12 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filter Bar */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Qidiruv: Nomi, SUP raqami, tel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Barcha Holatlar</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Barcha Turlar</option>
                  <option value="MANUFACTURER">MANUFACTURER</option>
                  <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                  <option value="WHOLESALER">WHOLESALER</option>
                </select>
              </div>
            </div>

            {/* Supplier List Cards */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredSuppliers.map((sup) => {
                const isSelected = sup.id === selectedSupplierId;
                return (
                  <div
                    key={sup.id}
                    onClick={() => setSelectedSupplierId(sup.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-100">{sup.display_name}</div>
                        <div className="text-[11px] font-mono text-emerald-400 mt-0.5">{sup.supplier_number}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          sup.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : sup.status === 'ON_HOLD'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {sup.status}
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                      <div>Tur: <span className="text-slate-200 font-medium">{sup.supplier_type}</span></div>
                      <div>Shartlar: <span className="text-slate-200 font-medium">NET {sup.payment_terms_days} d</span></div>
                      <div>Mahsulotlar: <span className="text-blue-400 font-bold">{sup.products.length} ta</span></div>
                      <div>Lead Time: <span className="text-slate-200 font-medium">{sup.delivery_lead_time_days} kun</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supplier Detail Section (7 cols) */}
          <div className="lg:col-span-7">
            {selectedSupplier ? (
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col h-full">
                {/* Detail Header */}
                <div className="p-5 bg-slate-950 border-b border-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-100">{selectedSupplier.legal_name}</h2>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {selectedSupplier.supplier_number}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedSupplier.display_name} ({selectedSupplier.supplier_type})</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded ${
                          selectedSupplier.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {selectedSupplier.status}
                      </span>
                      <button
                        onClick={() => onNavigate('supplier_360')}
                        className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold hover:bg-blue-600/20 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" /> Supplier 360 View
                      </button>
                    </div>
                  </div>

                  {/* Detail Tabs */}
                  <div className="mt-5 flex gap-2 overflow-x-auto border-b border-slate-800/80 pb-2 text-xs">
                    {[
                      { id: 'overview', label: 'Umumiy' },
                      { id: 'contacts', label: `Kontaktlar (${selectedSupplier.contacts.length})` },
                      { id: 'products', label: `Mahsulotlar (${selectedSupplier.products.length})` },
                      { id: 'payment_terms', label: 'To\'lov Shartlari' },
                      { id: 'payment_profile', label: 'Bank Rekvizitlari' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setDetailTab(tab.id as DetailTabType)}
                        className={`whitespace-nowrap px-3 py-1.5 font-semibold rounded-lg transition-all ${
                          detailTab === tab.id
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detail Tab Contents */}
                <div className="p-5 flex-1 overflow-y-auto space-y-4">
                  {detailTab === 'overview' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div className="text-slate-500">STIR / Tax ID:</div>
                          <div className="font-mono font-bold text-slate-200">{selectedSupplier.tax_id || 'Kiritilmagan'}</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div className="text-slate-500">Telefon:</div>
                          <div className="font-mono font-bold text-slate-200">{selectedSupplier.phone || '—'}</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div className="text-slate-500">Email:</div>
                          <div className="font-bold text-slate-200">{selectedSupplier.email || '—'}</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div className="text-slate-500">Manzil:</div>
                          <div className="font-bold text-slate-200">{selectedSupplier.address || '—'}</div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                        <div className="font-semibold text-slate-300">Kommerziya Parametrlari</div>
                        <div className="grid grid-cols-3 gap-2 text-slate-400">
                          <div>Nasiya Muddati: <span className="font-bold text-emerald-400">NET {selectedSupplier.payment_terms_days} kun</span></div>
                          <div>Lead Time: <span className="font-bold text-slate-200">{selectedSupplier.delivery_lead_time_days} kun</span></div>
                          <div>Min Buyurtma: <span className="font-bold text-slate-200">{selectedSupplier.minimum_order_amount.toLocaleString()} UZS</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'contacts' && (
                    <div className="space-y-3 text-xs">
                      {selectedSupplier.contacts.map((c) => (
                        <div key={c.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-200 flex items-center gap-2">
                              <span>{c.name}</span>
                              {c.is_primary && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-400">PRIMARY</span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] mt-0.5">{c.role} | {c.phone}</div>
                          </div>
                          <span className="text-slate-500">{c.email}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === 'products' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="font-semibold text-slate-300">Biriktirilgan Mahsulotlar Ro'yxati</span>
                        <button
                          onClick={() => setIsAddMappingOpen(true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Mahsulot Biriktirish
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {selectedSupplier.products.map((p) => (
                          <div key={p.mapping_id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-100">{p.product_name}</span>
                                {p.is_preferred && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400" /> PREFERRED
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-emerald-400 font-bold text-sm">
                                {p.last_purchase_price.toLocaleString()} UZS / {p.purchase_unit_id}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                              <div>Supplier SKU: <span className="text-slate-200 font-mono">{p.supplier_sku}</span></div>
                              <div>Pack Size: <span className="text-slate-200">{p.units_per_pack} pcs</span></div>
                              <div>MOQ: <span className="text-slate-200">{p.minimum_order_quantity}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailTab === 'payment_profile' && (
                    <div className="space-y-3 text-xs">
                      {selectedSupplier.payment_profiles.map((pp) => (
                        <div key={pp.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-200">{pp.bank_name}</span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400">
                              {pp.status}
                            </span>
                          </div>
                          <div className="font-mono text-slate-400">
                            Hisob raqam: <span className="text-slate-100 font-bold">{pp.account_reference_masked}</span>
                          </div>
                          <div className="text-slate-500">Qabul qiluvchi: {pp.recipient_name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-slate-500">
                <div>
                  <Truck className="mx-auto h-12 w-12 text-slate-700" />
                  <div className="mt-3 text-sm font-semibold text-slate-400">Yetkazib beruvchi tanlanmagan</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Supplier Modal */}
        {isAddSupplierOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Yangi Yetkazib Beruvchi Qo'shish</h3>
                <button onClick={() => setIsAddSupplierOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400">Yuridik Nomi (Legal Name) *</label>
                  <input
                    type="text"
                    required
                    value={newLegalName}
                    onChange={(e) => setNewLegalName(e.target.value)}
                    placeholder="Coca-Cola Bottlers Uzbekistan LLC"
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400">Ko'rinish Nomi (Display Name)</label>
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="Coca-Cola Distribution"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Tur (Supplier Type)</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                      <option value="MANUFACTURER">MANUFACTURER</option>
                      <option value="WHOLESALER">WHOLESALER</option>
                      <option value="SERVICE_PROVIDER">SERVICE_PROVIDER</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400">STIR / Tax ID</label>
                    <input
                      type="text"
                      value={newTaxId}
                      onChange={(e) => setNewTaxId(e.target.value)}
                      placeholder="301294821"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Telefon Raqami</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+998712004455"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddSupplierOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                  >
                    Bekor qilish
                  </button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold">
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
