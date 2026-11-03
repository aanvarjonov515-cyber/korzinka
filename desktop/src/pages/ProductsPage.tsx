import React, { useState, useMemo } from 'react';
import { AppShell, AppView } from '../components/layout/AppShell';
import {
  Package,
  Plus,
  Search,
  Barcode,
  Layers,
  Scale,
  Calendar,
  Tag,
  Building2,
  ChevronRight,
  Archive,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  TrendingUp,
  Percent
} from 'lucide-react';
import { ProductItem, ProductCategoryItem, BrandItem, UnitItem, ProductStatus } from '../types/product';

const INITIAL_CATEGORIES: ProductCategoryItem[] = [
  { id: 'cat-1', name: 'Dairy & Milk', code: 'DAIRY', status: 'ACTIVE' },
  { id: 'cat-2', name: 'Beverages', code: 'BEV', status: 'ACTIVE' },
  { id: 'cat-3', name: 'Fresh Meat', code: 'MEAT', status: 'ACTIVE' },
  { id: 'cat-4', name: 'Bakery & Bread', code: 'BAKERY', status: 'ACTIVE' },
  { id: 'cat-5', name: 'Fruits & Vegetables', code: 'PRODUCE', status: 'ACTIVE' },
];

const INITIAL_BRANDS: BrandItem[] = [
  { id: 'br-1', name: 'Musaffo', status: 'ACTIVE' },
  { id: 'br-2', name: 'Coca-Cola', status: 'ACTIVE' },
  { id: 'br-3', name: 'Nestle', status: 'ACTIVE' },
  { id: 'br-4', name: 'Local Farm', status: 'ACTIVE' },
];

const INITIAL_UNITS: UnitItem[] = [
  { id: 'un-1', code: 'PCE', name: 'Dona / Piece', symbol: 'dona', precision: 0 },
  { id: 'un-2', code: 'KG', name: 'Kilogram', symbol: 'kg', precision: 3 },
  { id: 'un-3', code: 'LTR', name: 'Litr / Liter', symbol: 'L', precision: 3 },
  { id: 'un-4', code: 'PCK', name: 'Pachka / Pack', symbol: 'pch', precision: 0 },
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    businessId: '00000000-0000-0000-0000-000000000001',
    sku: 'MILK-MUS-32-1L',
    barcode: '4780001234567',
    name: 'Musaffo Sut 3.2% Pasterizatsiyalangan 1L',
    shortName: 'Musaffo Sut 3.2% 1L',
    categoryId: 'cat-1',
    categoryName: 'Dairy & Milk',
    brandId: 'br-1',
    brandName: 'Musaffo',
    unitId: 'un-3',
    unitCode: 'LTR',
    description: 'Tabiiy sigir suti, yog‘lilik darajasi 3.2%, 1 litrlik tetrapak idishda.',
    productType: 'STANDARD',
    status: 'ACTIVE',
    mxikCode: '01111001001000000',
    taxCategory: 'VAT_12',
    manufacturer: 'Musaffo Milk LLC',
    countryOfOrigin: 'Uzbekistan',
    isWeighted: false,
    requiresExpiryTracking: true,
    requiresBatchTracking: true,
    requiresSerialTracking: false,
    minimumStock: 50,
    reorderPoint: 120,
    defaultPurchasePrice: 9200,
    defaultSellingPrice: 12500,
    currency: 'UZS',
    createdAt: '2026-10-30T09:00:00Z',
    updatedAt: '2026-10-30T10:30:00Z',
  },
  {
    id: 'prod-002',
    businessId: '00000000-0000-0000-0000-000000000001',
    sku: 'COKE-CLASSIC-15L',
    barcode: '5449000000996',
    name: 'Coca-Cola Gazlangan Ichimlik 1.5L PET',
    shortName: 'Coca-Cola 1.5L',
    categoryId: 'cat-2',
    categoryName: 'Beverages',
    brandId: 'br-2',
    brandName: 'Coca-Cola',
    unitId: 'un-1',
    unitCode: 'PCE',
    description: 'Klassik gazlangan salqinlantiruvchi ichimlik.',
    productType: 'STANDARD',
    status: 'ACTIVE',
    mxikCode: '01121002001000000',
    taxCategory: 'VAT_12',
    manufacturer: 'CCI Uzbekistan',
    countryOfOrigin: 'Uzbekistan',
    isWeighted: false,
    requiresExpiryTracking: true,
    requiresBatchTracking: false,
    requiresSerialTracking: false,
    minimumStock: 80,
    reorderPoint: 200,
    defaultPurchasePrice: 11200,
    defaultSellingPrice: 14500,
    currency: 'UZS',
    variants: [
      { id: 'var-1', sku: 'COKE-05L', barcode: '5449000000989', name: '0.5L PET', sellingPriceOverride: 7000 },
      { id: 'var-2', sku: 'COKE-10L', barcode: '5449000000972', name: '1.0L PET', sellingPriceOverride: 11000 },
    ],
    createdAt: '2026-10-30T09:15:00Z',
    updatedAt: '2026-10-30T09:15:00Z',
  },
  {
    id: 'prod-003',
    businessId: '00000000-0000-0000-0000-000000000001',
    sku: 'MEAT-BEEF-BONELESS',
    barcode: '2000001000008',
    name: 'Mol Go‘shti Lahm (Suyaksiz Yangi) kg',
    shortName: 'Mol Lahm kg',
    categoryId: 'cat-3',
    categoryName: 'Fresh Meat',
    brandId: 'br-4',
    brandName: 'Local Farm',
    unitId: 'un-2',
    unitCode: 'KG',
    description: 'Yangi so‘yilgan mahalliy mol go‘shti, elektron tarozi shtrix kodi bilan.',
    productType: 'WEIGHTED',
    status: 'ACTIVE',
    mxikCode: '01101001001000000',
    taxCategory: 'VAT_0_EXEMPT',
    manufacturer: 'Qibray Chorva Fermasi',
    countryOfOrigin: 'Uzbekistan',
    isWeighted: true,
    requiresExpiryTracking: true,
    requiresBatchTracking: true,
    requiresSerialTracking: false,
    minimumStock: 25,
    reorderPoint: 60,
    defaultPurchasePrice: 85000,
    defaultSellingPrice: 105000,
    currency: 'UZS',
    createdAt: '2026-10-30T09:40:00Z',
    updatedAt: '2026-10-30T09:40:00Z',
  },
  {
    id: 'prod-004',
    businessId: '00000000-0000-0000-0000-000000000001',
    sku: 'BREAD-TASHKENT-NON',
    barcode: '4780009988771',
    name: 'Toshkent Tandir Patir Non 350g',
    shortName: 'Tandir Non',
    categoryId: 'cat-4',
    categoryName: 'Bakery & Bread',
    brandId: 'br-4',
    brandName: 'Local Farm',
    unitId: 'un-1',
    unitCode: 'PCE',
    description: 'Issiq tandirda yopilgan an’anaviy non.',
    productType: 'STANDARD',
    status: 'ACTIVE',
    mxikCode: '01061001001000000',
    taxCategory: 'VAT_0_EXEMPT',
    manufacturer: '1-Nonvoyxona MChJ',
    countryOfOrigin: 'Uzbekistan',
    isWeighted: false,
    requiresExpiryTracking: true,
    requiresBatchTracking: false,
    requiresSerialTracking: false,
    minimumStock: 100,
    reorderPoint: 250,
    defaultPurchasePrice: 3200,
    defaultSellingPrice: 4500,
    currency: 'UZS',
    createdAt: '2026-10-30T09:50:00Z',
    updatedAt: '2026-10-30T09:50:00Z',
  },
  {
    id: 'prod-005',
    businessId: '00000000-0000-0000-0000-000000000001',
    sku: 'FRUIT-APPLE-RED',
    barcode: '2000002000005',
    name: 'Olma Qizil Beshyog‘och Saralangan kg',
    shortName: 'Olma Qizil kg',
    categoryId: 'cat-5',
    categoryName: 'Fruits & Vegetables',
    brandId: 'br-4',
    brandName: 'Local Farm',
    unitId: 'un-2',
    unitCode: 'KG',
    description: 'Mahalliy bog‘lardan shirin qizil olma.',
    productType: 'WEIGHTED',
    status: 'ACTIVE',
    mxikCode: '01081001001000000',
    taxCategory: 'VAT_0_EXEMPT',
    manufacturer: 'Parkent Bog‘lari',
    countryOfOrigin: 'Uzbekistan',
    isWeighted: true,
    requiresExpiryTracking: true,
    requiresBatchTracking: false,
    requiresSerialTracking: false,
    minimumStock: 40,
    reorderPoint: 100,
    defaultPurchasePrice: 12000,
    defaultSellingPrice: 16500,
    currency: 'UZS',
    createdAt: '2026-10-30T10:00:00Z',
    updatedAt: '2026-10-30T10:00:00Z',
  },
];

interface ProductsPageProps {
  onNavigate: (view: AppView) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // New Product Form State
  const [newSku, setNewSku] = useState<string>('');
  const [newBarcode, setNewBarcode] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newShortName, setNewShortName] = useState<string>('');
  const [newCategoryId, setNewCategoryId] = useState<string>(INITIAL_CATEGORIES[0].id);
  const [newBrandId, setNewBrandId] = useState<string>(INITIAL_BRANDS[0].id);
  const [newUnitId, setNewUnitId] = useState<string>(INITIAL_UNITS[0].id);
  const [newPurchasePrice, setNewPurchasePrice] = useState<string>('');
  const [newSellingPrice, setNewSellingPrice] = useState<string>('');
  const [newMxik, setNewMxik] = useState<string>('');
  const [newIsWeighted, setNewIsWeighted] = useState<boolean>(false);
  const [newRequiresExpiry, setNewRequiresExpiry] = useState<boolean>(true);
  const [newRequiresBatch, setNewRequiresBatch] = useState<boolean>(false);
  const [newRequiresSerial, setNewRequiresSerial] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && p.categoryId !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesBarcode = (p.barcode || '').toLowerCase().includes(q);
        const matchesBrand = (p.brandName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBarcode && !matchesBrand) return false;
      }
      return true;
    });
  }, [products, statusFilter, categoryFilter, searchQuery]);

  // Real-time deterministic margin preview calculation
  const marginPreview = useMemo(() => {
    const p = parseFloat(newPurchasePrice) || 0;
    const s = parseFloat(newSellingPrice) || 0;
    if (s <= 0 || p < 0) return null;
    const profit = s - p;
    const percentage = s > 0 ? (profit / s) * 100 : 0;
    return {
      profit: Math.round(profit),
      percentage: percentage.toFixed(1),
    };
  }, [newPurchasePrice, newSellingPrice]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newSku.trim()) {
      setFormError('SKU majburiy');
      return;
    }
    if (!newName.trim()) {
      setFormError('Mahsulot nomi kiritilishi shart');
      return;
    }

    const normSku = newSku.trim().toUpperCase().replace(/\s+/g, '-');
    if (products.some((p) => p.sku === normSku)) {
      setFormError(`Bunday SKU mavjud: ${normSku}`);
      return;
    }

    if (newBarcode.trim() && products.some((p) => p.barcode === newBarcode.trim())) {
      setFormError(`Bunday shtrix-kod allaqachon biriktirilgan: ${newBarcode.trim()}`);
      return;
    }

    const categoryObj = INITIAL_CATEGORIES.find((c) => c.id === newCategoryId);
    const brandObj = INITIAL_BRANDS.find((b) => b.id === newBrandId);
    const unitObj = INITIAL_UNITS.find((u) => u.id === newUnitId);

    const created: ProductItem = {
      id: `prod-${Date.now()}`,
      businessId: '00000000-0000-0000-0000-000000000001',
      sku: normSku,
      barcode: newBarcode.trim() || undefined,
      name: newName.trim(),
      shortName: newShortName.trim() || undefined,
      categoryId: newCategoryId,
      categoryName: categoryObj?.name,
      brandId: newBrandId,
      brandName: brandObj?.name,
      unitId: newUnitId,
      unitCode: unitObj?.code,
      productType: newIsWeighted ? 'WEIGHTED' : 'STANDARD',
      status: 'ACTIVE',
      mxikCode: newMxik.trim() || undefined,
      isWeighted: newIsWeighted,
      requiresExpiryTracking: newRequiresExpiry,
      requiresBatchTracking: newRequiresBatch,
      requiresSerialTracking: newRequiresSerial,
      defaultPurchasePrice: parseFloat(newPurchasePrice) || undefined,
      defaultSellingPrice: parseFloat(newSellingPrice) || undefined,
      currency: 'UZS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts([created, ...products]);
    setIsCreateModalOpen(false);
    // Reset form
    setNewSku('');
    setNewBarcode('');
    setNewName('');
    setNewShortName('');
    setNewPurchasePrice('');
    setNewSellingPrice('');
    setNewMxik('');
  };

  const handleToggleArchive = (product: ProductItem) => {
    const updated = products.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          status: (p.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED') as ProductStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    setProducts(updated);
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct({
        ...selectedProduct,
        status: selectedProduct.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED',
      });
    }
  };

  return (
    <AppShell currentView="products" onNavigate={onNavigate}>
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#090d16] p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-400" />
              Mahsulotlar Katalogi
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              SKU, shtrix-kod, kategoriya va narxlar master ma’lumotlari
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Yangi Mahsulot</span>
          </button>
        </div>

      {/* Main Container */}
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Barcha Faol Mahsulotlar</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 font-mono tabular-nums">
              {products.filter((p) => p.status === 'ACTIVE').length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Master Data Katalogi</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kategoriyalar</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 font-mono tabular-nums">
              {INITIAL_CATEGORIES.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Daraxtimon iyerarxiya</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tarozi Mahsulotlari</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 font-mono tabular-nums">
              {products.filter((p) => p.isWeighted).length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Scale barcode bilan</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Yaroqlilik Monitoringi</span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 font-mono tabular-nums">
              {products.filter((p) => p.requiresExpiryTracking).length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Expiry tracking faol</span>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto text-xs">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Barcha Bo‘limlar
            </button>
            {INITIAL_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === c.id
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Shtrix-kod, SKU yoki nom..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ACTIVE">Faol Mahsulotlar</option>
              <option value="ARCHIVED">Arxivlanganlar</option>
              <option value="ALL">Barchasi (Status)</option>
            </select>
          </div>
        </section>

        {/* Products Table */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="py-3 px-4 font-normal">Mahsulot Nomi</th>
                  <th className="py-3 px-4 font-normal">SKU</th>
                  <th className="py-3 px-4 font-normal">Shtrix-kod</th>
                  <th className="py-3 px-4 font-normal">Kategoriya & Brend</th>
                  <th className="py-3 px-4 font-normal">Birlik</th>
                  <th className="py-3 px-4 text-right font-normal">Tannarx</th>
                  <th className="py-3 px-4 text-right font-normal">Sotuv Narxi</th>
                  <th className="py-3 px-4 text-center font-normal">Marja %</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 text-right font-normal">Batafsil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredProducts.map((p) => {
                  const buy = p.defaultPurchasePrice || 0;
                  const sell = p.defaultSellingPrice || 0;
                  const marginPct = sell > 0 ? (((sell - buy) / sell) * 100).toFixed(1) : '0';

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          {p.isWeighted && (
                            <span title="Tarozi mahsuloti">
                              <Scale className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            </span>
                          )}
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap">
                        {p.sku}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {p.barcode || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <span>{p.categoryName || 'Kategoriyasiz'}</span>
                        {p.brandName && (
                          <span className="text-slate-400 ml-1.5 text-[11px]">/ {p.brandName}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {p.unitCode || 'PCE'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                        {p.defaultPurchasePrice ? `${p.defaultPurchasePrice.toLocaleString()} UZS` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900 dark:text-slate-100 tabular-nums whitespace-nowrap">
                        {p.defaultSellingPrice ? `${p.defaultSellingPrice.toLocaleString()} UZS` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center tabular-nums whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            parseFloat(marginPct) > 20
                              ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                              : 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40'
                          }`}
                        >
                          +{marginPct}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                        <span
                          className={`text-xs font-medium ${
                            p.status === 'ACTIVE'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(p);
                          }}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-sans">
                      Hech qanday mahsulot topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>
              Jami {filteredProducts.length} ta mahsulot (Katalog Master Data)
            </span>
            <span className="text-[11px] text-slate-400">
              * Ombor qoldiqlari Inventory Ledger orqali alohida yuritiladi
            </span>
          </div>
        </section>
      </main>

      {/* Product Detail Inspection Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Mahsulot Master Ma'lumotlari
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    SKU: {selectedProduct.sku}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col gap-6 text-xs font-sans">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {selectedProduct.name}
                </h3>
                {selectedProduct.description && (
                  <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                )}
              </div>

              {/* Master Data Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">Shtrix-kod</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 block">
                    {selectedProduct.barcode || 'Biriktirilmagan'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">O‘zbekiston MXIK Kodi</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100 block">
                    {selectedProduct.mxikCode || 'Kiritilmagan'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">Kategoriya / Brend</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 block">
                    {selectedProduct.categoryName} / {selectedProduct.brandName || 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] mb-1">O‘lchov Birligi</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100 block">
                    {selectedProduct.unitCode} ({selectedProduct.isWeighted ? 'Tarozi' : 'Dona'})
                  </span>
                </div>
              </div>

              {/* Pricing & Margin Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Standart Tannarx</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                    {selectedProduct.defaultPurchasePrice ? selectedProduct.defaultPurchasePrice.toLocaleString() : '0'} UZS
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Chakana Sotuv Narxi</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                    {selectedProduct.defaultSellingPrice ? selectedProduct.defaultSellingPrice.toLocaleString() : '0'} UZS
                  </span>
                </div>
              </div>

              {/* Tracking Flags */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Monitoring va Nazorat Xususiyatlari
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedProduct.requiresExpiryTracking ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>Yaroqlilik nazorati (FEFO)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedProduct.requiresBatchTracking ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>Partiya (Batch/Lot) kuzatuvi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedProduct.isWeighted ? 'bg-blue-500' : 'bg-slate-300'}`} />
                    <span>Elektron tarozi mahsuloti</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedProduct.requiresSerialTracking ? 'bg-purple-500' : 'bg-slate-300'}`} />
                    <span>Seriya raqami nazorati</span>
                  </div>
                </div>
              </div>

              {/* Variants if any */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Mahsulot Variantlari ({selectedProduct.variants.length})
                  </h4>
                  <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    {selectedProduct.variants.map((v) => (
                      <div key={v.id} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between font-mono">
                        <div>
                          <span className="font-sans font-medium text-slate-800 dark:text-slate-200 block">
                            {v.name}
                          </span>
                          <span className="text-slate-400 text-[11px]">{v.sku} · {v.barcode || 'No BC'}</span>
                        </div>
                        {v.sellingPriceOverride && (
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {v.sellingPriceOverride.toLocaleString()} UZS
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleToggleArchive(selectedProduct)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedProduct.status === 'ARCHIVED'
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400'
                }`}
              >
                {selectedProduct.status === 'ARCHIVED' ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    Arxivdan Chiqarish
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5" />
                    Mahsulotni Arxivlash
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Yangi Mahsulot Master Kartasini Yaratish
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 flex-1 overflow-y-auto flex flex-col gap-5 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Identification Block */}
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2">
                  1. Identifikatsiya & Nomi
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-slate-500 mb-1">To‘liq Nomi *</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Masalan: Musaffo Sut 3.2% 1L"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">SKU (Unikal Kod) *</label>
                    <input
                      type="text"
                      required
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      placeholder="MILK-MUS-32-1L"
                      className="w-full px-3 py-2 font-mono border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Shtrix-kod (EAN-13 / Code128)</label>
                    <input
                      type="text"
                      value={newBarcode}
                      onChange={(e) => setNewBarcode(e.target.value)}
                      placeholder="4780001234567"
                      className="w-full px-3 py-2 font-mono border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-500 mb-1">O‘zbekiston MXIK Kodi (17 raqam)</label>
                    <input
                      type="text"
                      value={newMxik}
                      onChange={(e) => setNewMxik(e.target.value)}
                      placeholder="01111001001000000"
                      className="w-full px-3 py-2 font-mono border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2">
                  2. Bo‘lim, Brend va O‘lchov Birligi
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Kategoriya</label>
                    <select
                      value={newCategoryId}
                      onChange={(e) => setNewCategoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {INITIAL_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Brend</label>
                    <select
                      value={newBrandId}
                      onChange={(e) => setNewBrandId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {INITIAL_BRANDS.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Birlik</label>
                    <select
                      value={newUnitId}
                      onChange={(e) => setNewUnitId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {INITIAL_UNITS.map((u) => (
                        <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Margin Preview */}
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2">
                  3. Narxlar va Marja Hisobi (UZS)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Standart Tannarx</label>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      value={newPurchasePrice}
                      onChange={(e) => setNewPurchasePrice(e.target.value)}
                      placeholder="9200"
                      className="w-full px-3 py-2 font-mono border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Chakana Sotuv Narxi</label>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      value={newSellingPrice}
                      onChange={(e) => setNewSellingPrice(e.target.value)}
                      placeholder="12500"
                      className="w-full px-3 py-2 font-mono border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Deterministic Margin Preview Card */}
                {marginPreview && (
                  <div className="mt-2.5 p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex items-center justify-between font-mono">
                    <span className="text-emerald-800 dark:text-emerald-400 font-sans text-xs">
                      Prognoz qilingan sof foyda:
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                      +{marginPreview.profit.toLocaleString()} UZS (+{marginPreview.percentage}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Tracking Flags */}
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-2">
                  4. Monitoring Sozlamalari
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer p-2 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={newRequiresExpiry}
                      onChange={(e) => setNewRequiresExpiry(e.target.checked)}
                      className="rounded"
                    />
                    <span>Yaroqlilik nazorati (FEFO)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={newIsWeighted}
                      onChange={(e) => setNewIsWeighted(e.target.checked)}
                      className="rounded"
                    />
                    <span>Elektron tarozi mahsuloti</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={newRequiresBatch}
                      onChange={(e) => setNewRequiresBatch(e.target.checked)}
                      className="rounded"
                    />
                    <span>Partiya (Batch) kuzatuvi</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={newRequiresSerial}
                      onChange={(e) => setNewRequiresSerial(e.target.checked)}
                      className="rounded"
                    />
                    <span>Seriya raqami nazorati</span>
                  </label>
                </div>
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Katalogga Saqlash
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
