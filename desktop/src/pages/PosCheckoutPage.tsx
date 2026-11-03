import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShoppingCart,
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt as ReceiptIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Scale,
  Percent,
  Clock,
  User,
  ShieldCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { CartItem, SaleRecord } from '../types/sale';
import { AppShell, AppView } from '../components/layout/AppShell';

// Sample inventory items available for checkout
const AVAILABLE_CATALOG_ITEMS = [
  {
    id: 'prod-001',
    sku: 'MILK-MUS-32-1L',
    barcode: '4780001234567',
    name: 'Musaffo Sut 3.2% 1L',
    price: 12500,
    cost: 9200,
    isWeighted: false,
    unitCode: 'LTR',
  },
  {
    id: 'prod-002',
    sku: 'COKE-CLASSIC-15L',
    barcode: '5449000000996',
    name: 'Coca-Cola Classic 1.5L',
    price: 14500,
    cost: 11200,
    isWeighted: false,
    unitCode: 'PCE',
  },
  {
    id: 'prod-003',
    sku: 'MEAT-BEEF-BONELESS',
    barcode: '2000001000008',
    name: 'Mol Go‘shti Lahm kg',
    price: 105000,
    cost: 85000,
    isWeighted: true,
    unitCode: 'KG',
  },
  {
    id: 'prod-004',
    sku: 'BREAD-TASHKENT-NON',
    barcode: '4780009988771',
    name: 'Toshkent Tandir Non',
    price: 4500,
    cost: 3200,
    isWeighted: false,
    unitCode: 'PCE',
  },
  {
    id: 'prod-005',
    sku: 'FRUIT-APPLE-RED',
    barcode: '2000002000005',
    name: 'Olma Qizil Saralangan kg',
    price: 16500,
    cost: 12000,
    isWeighted: true,
    unitCode: 'KG',
  },
];

interface PosCheckoutPageProps {
  onNavigate: (view: AppView) => void;
}

export const PosCheckoutPage: React.FC<PosCheckoutPageProps> = ({ onNavigate }) => {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'item-1',
      productId: 'prod-001',
      sku: 'MILK-MUS-32-1L',
      barcode: '4780001234567',
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
      id: 'item-2',
      productId: 'prod-004',
      sku: 'BREAD-TASHKENT-NON',
      barcode: '4780009988771',
      name: 'Toshkent Tandir Non',
      quantity: 3,
      unitPrice: 4500,
      originalUnitPrice: 4500,
      unitCost: 3200,
      discountAmount: 0,
      taxAmount: 0,
      lineTotal: 13500,
      isWeighted: false,
      unitCode: 'PCE',
    },
  ]);

  const [scanQuery, setScanQuery] = useState<string>('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'PAY_LATER' | 'SPLIT'>('CASH');
  const [tenderedCash, setTenderedCash] = useState<string>('');
  const [payLaterDuration, setPayLaterDuration] = useState<number>(300); // 5 min default
  const [payLaterConsent, setPayLaterConsent] = useState<boolean>(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<SaleRecord | null>(null);
  const [saleNumber] = useState<string>(() => `TASH-01-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-000214`);

  const scanInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scanInputRef.current?.focus();
  }, []);

  // Authoritative Totals
  const { subtotal, discountTotal, taxTotal, total, totalCost, grossProfit } = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let tax = 0;
    let tot = 0;
    let cost = 0;

    cart.forEach((item) => {
      sub += item.quantity * item.originalUnitPrice;
      disc += item.discountAmount;
      tax += item.taxAmount;
      tot += item.lineTotal;
      cost += item.quantity * item.unitCost;
    });

    return {
      subtotal: Math.round(sub),
      discountTotal: Math.round(disc),
      taxTotal: Math.round(tax),
      total: Math.round(tot),
      totalCost: Math.round(cost),
      grossProfit: Math.round(tot - cost),
    };
  }, [cart]);

  // Cash Change Calculation
  const cashChange = useMemo(() => {
    const tendered = parseFloat(tenderedCash) || 0;
    if (tendered < total) return 0;
    return Math.round(tendered - total);
  }, [tenderedCash, total]);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScanError(null);
    const q = scanQuery.trim();
    if (!q) return;

    const matched = AVAILABLE_CATALOG_ITEMS.find(
      (item) => item.barcode === q || item.sku.toLowerCase() === q.toLowerCase() || item.name.toLowerCase().includes(q.toLowerCase())
    );

    if (!matched) {
      setScanError(`Mahsulot topilmadi: "${q}"`);
      return;
    }

    // Add or increment in cart
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === matched.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const item = updated[existingIndex];
        const newQty = item.quantity + 1;
        updated[existingIndex] = {
          ...item,
          quantity: newQty,
          lineTotal: newQty * item.unitPrice - item.discountAmount,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: `item-${Date.now()}`,
          productId: matched.id,
          sku: matched.sku,
          barcode: matched.barcode,
          name: matched.name,
          quantity: 1,
          unitPrice: matched.price,
          originalUnitPrice: matched.price,
          unitCost: matched.cost,
          discountAmount: 0,
          taxAmount: 0,
          lineTotal: matched.price,
          isWeighted: matched.isWeighted,
          unitCode: matched.unitCode,
        };
        return [...prev, newItem];
      }
    });

    setScanQuery('');
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = Math.max(0, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              lineTotal: newQty * item.unitPrice - item.discountAmount,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'PAY_LATER' && !payLaterConsent) {
      alert("Mijozning to'lov mandati (avto-to'lov roziligi) tasdiqlanishi shart!");
      return;
    }

    const receiptNo = `REC-${saleNumber}`;
    const isPayLater = paymentMethod === 'PAY_LATER';
    const dueTime = new Date(Date.now() + payLaterDuration * 1000);
    const debtNo = isPayLater ? `DEBT-2026-${Math.floor(100000 + Math.random() * 900000)}` : undefined;

    const completedRecord: SaleRecord = {
      id: `sale-${Date.now()}`,
      businessId: '00000000-0000-0000-0000-000000000001',
      branchId: 'b0000001-0000-0000-0000-000000000001',
      registerId: 'reg-01',
      shiftId: 'shift-01',
      cashierId: 'u0000001-cashier',
      cashierName: 'Nodirbek Qodirov',
      saleNumber,
      status: 'COMPLETED',
      paymentStatus: isPayLater ? 'UNPAID' : 'PAID',
      subtotal,
      discountTotal,
      taxTotal,
      total,
      costTotal: totalCost,
      grossProfitSnapshot: grossProfit,
      currency: 'UZS',
      itemCount: cart.length,
      totalQuantity: cart.reduce((acc, i) => acc + i.quantity, 0),
      startedAt: new Date(Date.now() - 180000).toISOString(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      items: [...cart],
      receipt: {
        id: `rec-${Date.now()}`,
        receiptNumber: receiptNo,
        fiscalReference: `FISCAL-UZ-${saleNumber}`,
        receiptHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        metadataJson: {
          paymentMethod,
          isPayLater,
          debtNumber: debtNo,
          dueAt: isPayLater ? dueTime.toISOString() : undefined,
          customerName: isPayLater ? 'Karimov Anvar' : undefined,
          maskedPan: isPayLater ? '•••• 4821' : undefined,
          tenderedCash: paymentMethod === 'CASH' ? tenderedCash : String(total),
          change: paymentMethod === 'CASH' ? cashChange : 0,
        },
        generatedAt: new Date().toISOString(),
      },
    };

    setLastCompletedSale(completedRecord);
    setIsPayModalOpen(false);
    setCart([]);
  };

  return (
    <AppShell currentView="pos" onNavigate={onNavigate}>
      <div className="flex flex-1 flex-col overflow-hidden bg-[#090d16] p-6">
        {/* POS Workspace: Split 2-Column Desktop Grid */}
        <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          {/* Left Side: Barcode Scan & Cart Items (8 Cols) */}
          <div className="flex flex-col gap-4 overflow-hidden lg:col-span-8">
            {/* Professional Barcode Scanner & Search */}
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
              <form onSubmit={handleScanSubmit} className="relative flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    ref={scanInputRef}
                    type="text"
                    value={scanQuery}
                    onChange={(e) => setScanQuery(e.target.value)}
                    placeholder="Shtrix-kodni skanerlang yoki mahsulot nomi/SKU bo'yicha qidiring (Enter)..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-12 text-xs text-white placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="absolute right-3 top-2.5 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 border border-slate-700">
                    F2
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/50 transition hover:bg-emerald-500 whitespace-nowrap"
                >
                  Qo'shish
                </button>
              </form>

              {scanError && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-xs text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}
            </div>

            {/* Cart Table Container */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Savatchadagi Mahsulotlar ({cart.length})
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                  {saleNumber}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length > 0 ? (
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="sticky top-0 bg-slate-900/90 backdrop-blur text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-5 font-semibold">Mahsulot</th>
                        <th className="py-3 px-3 font-semibold">Narxi</th>
                        <th className="py-3 px-3 text-center font-semibold">Miqdori</th>
                        <th className="py-3 px-3 text-right font-semibold">Summa</th>
                        <th className="py-3 px-5 text-right font-semibold">O'chirish</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {cart.map((item) => (
                        <tr key={item.id} className="transition hover:bg-slate-800/30">
                          <td className="py-3.5 px-5 font-sans">
                            <div className="flex items-center gap-2.5">
                              {item.isWeighted && (
                                <span title="Tarozi mahsuloti">
                                  <Scale className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                </span>
                              )}
                              <div>
                                <span className="font-semibold text-white block">{item.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {item.sku} · {item.barcode || 'No Barcode'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-slate-300 tabular-nums whitespace-nowrap">
                            {item.unitPrice.toLocaleString()} UZS
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center justify-center gap-2 font-sans">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center font-mono font-semibold text-white tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-semibold text-emerald-400 tabular-nums whitespace-nowrap">
                            {item.lineTotal.toLocaleString()} UZS
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                              title="O'chirish"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-500">
                    <ShoppingCart className="h-12 w-12 text-slate-700" />
                    <div className="mt-3 text-sm font-semibold text-slate-400">Savatcha bo'sh</div>
                    <p className="mt-1 text-xs text-slate-600">
                      Shtrix-kodni skanerlang yoki yuqoridagi qidiruvdan mahsulot qo'shing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Checkout Summary Panel (4 Cols) */}
          <div className="flex flex-col gap-4 overflow-hidden lg:col-span-4">
            <div className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
              <div>
                <h3 className="border-b border-slate-800 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Checkout Summary
                </h3>

                <div className="mt-4 space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Oraliq summa:</span>
                    <span className="text-white font-medium tabular-nums">{subtotal.toLocaleString()} UZS</span>
                  </div>

                  {discountTotal > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Chegirma:</span>
                      <span className="font-medium tabular-nums">-{discountTotal.toLocaleString()} UZS</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-400">
                    <span>QQS (Soliq):</span>
                    <span className="text-white font-medium tabular-nums">{taxTotal.toLocaleString()} UZS</span>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-white font-sans">JAMI:</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                      {total.toLocaleString()} UZS
                    </span>
                  </div>
                </div>

                {/* Customer Selector preview */}
                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mijoz</span>
                      <span className="text-xs font-semibold text-white">Anvar Karimov (CUS-00001824)</span>
                    </div>
                    <button
                      onClick={() => onNavigate('customers')}
                      className="rounded bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700"
                    >
                      O'zgartirish
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-slate-800">
                <button
                  onClick={() => {
                    setPaymentMethod('CASH');
                    setTenderedCash(String(total));
                    setIsPayModalOpen(true);
                  }}
                  disabled={cart.length === 0}
                  className="w-full rounded-xl bg-emerald-600 py-3.5 text-center text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  PAY NOW (To'lovni Qabul Qilish)
                </button>

                <button
                  onClick={() => {
                    setPaymentMethod('PAY_LATER');
                    setIsPayModalOpen(true);
                  }}
                  disabled={cart.length === 0}
                  className="w-full rounded-xl border border-amber-500/40 bg-amber-500/10 py-3.5 text-center text-xs font-bold text-amber-400 shadow-md transition hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  PAY LATER (Kechiktirilgan Nasiya)
                </button>

                {/* Keyboard Shortcuts Bar */}
                <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 font-mono">
                  <span>F2: Qidiruv</span>
                  <span>F4: To'lov</span>
                  <span>Esc: Tozalash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tender & Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">To'lovni Rasmiylashtirish</h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Payment Type Switcher */}
              <div>
                <label className="block text-slate-400 mb-2 font-medium">To'lov Turi</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`py-2 px-1.5 rounded-lg border font-medium flex flex-col items-center gap-1 transition ${
                      paymentMethod === 'CASH'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Banknote className="h-4 w-4" />
                    <span>Naqd</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-1.5 rounded-lg border font-medium flex flex-col items-center gap-1 transition ${
                      paymentMethod === 'CARD'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Karta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PAY_LATER')}
                    className={`py-2 px-1.5 rounded-lg border font-medium flex flex-col items-center gap-1 transition ${
                      paymentMethod === 'PAY_LATER'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold text-[11px]">Pay Later</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('SPLIT')}
                    className={`py-2 px-1.5 rounded-lg border font-medium flex flex-col items-center gap-1 transition ${
                      paymentMethod === 'SPLIT'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Percent className="h-4 w-4" />
                    <span>Aralash</span>
                  </button>
                </div>
              </div>

              {/* Total Due Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-center justify-between">
                <span className="text-slate-400 font-medium">To'lanishi lozim:</span>
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {total.toLocaleString()} UZS
                </span>
              </div>

              {paymentMethod === 'CASH' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Mijoz bergan naqd pul:</label>
                    <input
                      type="number"
                      value={tenderedCash}
                      onChange={(e) => setTenderedCash(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-base font-bold text-white shadow-inner focus:border-emerald-500 focus:outline-none tabular-nums"
                    />
                  </div>

                  {parseFloat(tenderedCash) >= total && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold">Qaytim (Change):</span>
                      <span className="text-lg font-bold font-mono text-emerald-300 tabular-nums">
                        {cashChange.toLocaleString()} UZS
                      </span>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'PAY_LATER' && (
                <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Mijoz:</span>
                    <div className="font-bold text-white">Anvar Karimov (CUS-00001824)</div>
                    <div className="text-[11px] text-slate-400 font-mono">UZCARD •••• 4821 (Tokenized)</div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
                      Kechiktirish Muddati (1 daqiqadan 20 kungacha):
                    </label>
                    <div className="grid grid-cols-5 gap-1.5 text-[10px]">
                      {[
                        { label: '5 daq', sec: 300 },
                        { label: '15 daq', sec: 900 },
                        { label: '30 daq', sec: 1800 },
                        { label: '1 soat', sec: 3600 },
                        { label: '3 soat', sec: 10800 },
                        { label: '1 kun', sec: 86400 },
                        { label: '3 kun', sec: 259200 },
                        { label: '7 kun', sec: 604800 },
                        { label: '10 kun', sec: 864000 },
                        { label: '20 kun', sec: 1728000 },
                      ].map((preset) => (
                        <button
                          key={preset.sec}
                          type="button"
                          onClick={() => setPayLaterDuration(preset.sec)}
                          className={`py-1.5 rounded font-semibold text-center transition ${
                            payLaterDuration === preset.sec
                              ? 'bg-amber-600 text-white shadow'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] flex items-center justify-between border border-slate-800">
                    <span className="text-slate-400">Aniq to'lov vaqti:</span>
                    <span className="font-bold text-amber-400">
                      {new Date(Date.now() + payLaterDuration * 1000).toLocaleString('uz-UZ')}
                    </span>
                  </div>

                  <label className="flex items-start gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={payLaterConsent}
                      onChange={(e) => setPayLaterConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-slate-300">
                      Mijoz to'lov muddati kelganda bog'langan UZCARD kartasidan {total.toLocaleString()} UZS yechib olinishiga rozilik berdi (Mandat).
                    </span>
                  </label>
                </div>
              )}

              <button
                type="button"
                onClick={handleCompleteSale}
                className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg transition hover:bg-emerald-500"
              >
                {paymentMethod === 'PAY_LATER' ? 'Kechiktirilgan Savdoni Tasdiqlash' : 'Tranzaksiyani Yakunlash va Chek Chiqarish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {lastCompletedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl font-mono text-xs space-y-4">
            <div className="text-center pb-3 border-b border-dashed border-slate-800">
              <span className="font-bold text-base block font-sans text-white">PROFIT LEAK MARKET</span>
              <span className="text-slate-400 block text-[11px]">Toshkent Filiali #01 · Kassa-01</span>
              <span className="text-[11px] text-emerald-400 block mt-1 font-semibold">
                Chek #{lastCompletedSale.saleNumber}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {new Date().toLocaleString()}
              </span>
            </div>

            {Boolean((lastCompletedSale.receipt?.metadataJson as any)?.isPayLater) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-400 space-y-1">
                <div className="font-bold uppercase tracking-wider">KECHIKTIRILGAN TO'LOV (PAY LATER)</div>
                <div>Qarz No: {String((lastCompletedSale.receipt?.metadataJson as any)?.debtNumber || '')}</div>
                <div>Muddati: {new Date(String((lastCompletedSale.receipt?.metadataJson as any)?.dueAt || '')).toLocaleString('uz-UZ')}</div>
                <div>Karta: {String((lastCompletedSale.receipt?.metadataJson as any)?.maskedPan || '')} (Avto-yechish)</div>
              </div>
            )}

            <div className="divide-y divide-slate-800/80 max-h-56 overflow-y-auto">
              {lastCompletedSale.items.map((item) => (
                <div key={item.id} className="py-2 flex items-start justify-between">
                  <div className="max-w-[180px]">
                    <span className="block font-medium text-white truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {item.quantity} x {item.unitPrice.toLocaleString()} UZS
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-400">{item.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-dashed border-slate-800 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Oraliq jami:</span>
                <span>{lastCompletedSale.subtotal.toLocaleString()} UZS</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-800 text-white">
                <span>JAMI:</span>
                <span className="text-emerald-400">{lastCompletedSale.total.toLocaleString()} UZS</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 p-2.5 text-[10px] text-slate-500 border border-slate-800 break-all">
              <span className="block font-semibold text-slate-400 mb-0.5">Xavfsiz Tranzaksiya Hashi:</span>
              {lastCompletedSale.receipt?.receiptHash}
            </div>

            <button
              onClick={() => setLastCompletedSale(null)}
              className="w-full rounded-xl bg-emerald-600 py-3 font-sans font-semibold text-xs text-white hover:bg-emerald-500 transition shadow"
            >
              Yangi Savdoga O'tish
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
};
