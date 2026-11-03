import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  Receipt as ReceiptIcon,
  DollarSign,
  Clock,
  ShieldCheck,
  FileText,
  X,
  Printer,
} from 'lucide-react';
import { SaleRecord } from '../types/sale';
import { AppShell, AppView } from '../components/layout/AppShell';

const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale-001',
    businessId: '00000000-0000-0000-0000-000000000001',
    branchId: 'b0000001-0000-0000-0000-000000000001',
    registerId: 'reg-01',
    shiftId: 'shift-01',
    cashierId: 'u0000001-cashier',
    cashierName: 'Nodirbek Qodirov',
    saleNumber: 'TASH-01-20261030-000213',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    subtotal: 39500,
    discountTotal: 0,
    taxTotal: 0,
    total: 39500,
    costTotal: 29800,
    grossProfitSnapshot: 9700,
    currency: 'UZS',
    itemCount: 2,
    totalQuantity: 5,
    startedAt: '2026-10-30T10:15:00Z',
    completedAt: '2026-10-30T10:16:30Z',
    createdAt: '2026-10-30T10:15:00Z',
    items: [
      {
        id: 'i1',
        productId: 'prod-001',
        sku: 'MILK-MUS-32-1L',
        name: 'Musaffo Sut 3.2% 1L',
        quantity: 2,
        unitPrice: 12500,
        originalUnitPrice: 12500,
        unitCost: 9200,
        discountAmount: 0,
        taxAmount: 0,
        lineTotal: 25000,
        isWeighted: false,
        unitCode: 'LTR',
      },
      {
        id: 'i2',
        productId: 'prod-004',
        sku: 'BREAD-TASHKENT-NON',
        name: 'Toshkent Tandir Non',
        quantity: 3,
        unitPrice: 4800,
        originalUnitPrice: 4800,
        unitCost: 3600,
        discountAmount: 0,
        taxAmount: 0,
        lineTotal: 14500,
        isWeighted: false,
        unitCode: 'PCE',
      },
    ],
    receipt: {
      id: 'rec-001',
      receiptNumber: 'REC-TASH-01-20261030-000213',
      fiscalReference: 'FISCAL-UZ-8899214',
      receiptHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      metadataJson: { paymentMethod: 'CASH', tenderedCash: '50000', change: '10500' },
      generatedAt: '2026-10-30T10:16:30Z',
    },
  },
];

interface SalesHistoryPageProps {
  onNavigate: (view: AppView) => void;
}

export const SalesHistoryPage: React.FC<SalesHistoryPageProps> = ({ onNavigate }) => {
  const [sales] = useState<SaleRecord[]>(INITIAL_SALES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(INITIAL_SALES[0]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.grossProfitSnapshot, 0);
  const totalSalesCount = sales.length;

  return (
    <AppShell currentView="sales" onNavigate={onNavigate}>
      <div className="flex flex-1 flex-col overflow-hidden bg-[#090d16]">
        {/* KPI Summary Strip */}
        <div className="grid grid-cols-3 gap-4 border-b border-slate-800 bg-[#0d1322]/60 p-4 shrink-0">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jami Savdolar Soni</div>
              <div className="mt-1 text-2xl font-bold text-white">{totalSalesCount} ta</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ReceiptIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jami Tushum (Revenue)</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">{totalRevenue.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Yalpi Foyda (Gross Profit)</div>
              <div className="mt-1 text-2xl font-bold text-blue-400">{totalProfit.toLocaleString()} UZS</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex flex-1 overflow-hidden">
          <div className={`flex flex-col border-r border-slate-800 bg-[#090d16] transition-all duration-300 ${selectedSale ? 'w-1/2' : 'w-full'}`}>
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-4 bg-[#0d1322]/80">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Chek raqami (TASH-01-...) yoki kassir ismi bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-5 font-semibold">Chek Raqami</th>
                    <th className="py-3 px-4 font-semibold">Kassir</th>
                    <th className="py-3 px-4 font-semibold">Soni</th>
                    <th className="py-3 px-4 font-semibold">Jami Summa</th>
                    <th className="py-3 px-4 font-semibold">Holat</th>
                    <th className="py-3 px-5 font-semibold text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sales.map((sale) => {
                    const isSelected = sale.id === selectedSale?.id;
                    return (
                      <tr
                        key={sale.id}
                        onClick={() => setSelectedSale(sale)}
                        className={`cursor-pointer transition hover:bg-slate-800/40 ${
                          isSelected ? 'bg-emerald-950/30 border-l-2 border-emerald-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-5 font-mono font-semibold text-emerald-400">
                          {sale.saleNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{sale.cashierName}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{sale.itemCount} ta</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {sale.total.toLocaleString()} UZS
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-lg bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            {sale.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSale(sale);
                            }}
                            className="rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            Chek
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Sale Detail Drawer */}
          {selectedSale ? (
            <div className="flex flex-1 flex-col bg-[#111827] overflow-hidden p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold font-mono text-emerald-400">{selectedSale.saleNumber}</h3>
                  <span className="text-xs text-slate-400">Kassir: {selectedSale.cashierName}</span>
                </div>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
                <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 space-y-3">
                  <div className="text-center font-bold text-sm text-white font-sans">PROFIT LEAK RECEIPT</div>
                  <div className="divide-y divide-slate-800">
                    {selectedSale.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex justify-between items-center">
                        <div>
                          <span className="font-sans font-semibold text-white block">{item.name}</span>
                          <span className="text-[11px] text-slate-400">{item.quantity} x {item.unitPrice.toLocaleString()} UZS</span>
                        </div>
                        <span className="font-semibold text-emerald-400">{item.lineTotal.toLocaleString()} UZS</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                    <span>JAMI:</span>
                    <span className="text-emerald-400">{selectedSale.total.toLocaleString()} UZS</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 text-[11px] text-slate-400 space-y-1 break-all">
                  <span className="font-semibold text-slate-300 block mb-1">Kriptografik Chek Hashi:</span>
                  {selectedSale.receipt?.receiptHash}
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden flex-1 items-center justify-center p-8 text-center text-slate-500 lg:flex">
              <div>
                <ReceiptIcon className="mx-auto h-12 w-12 text-slate-700" />
                <div className="mt-3 text-sm font-semibold text-slate-400">Savdo tanlanmagan</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};
