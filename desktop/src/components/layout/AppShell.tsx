import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Users,
  CreditCard,
  Package,
  Boxes,
  ShieldAlert,
  FileText,
  Settings,
  Bot,
  Store,
  LogOut,
  ChevronRight,
  TrendingUp,
  PhoneCall,
  BarChart3,
  Truck,
  ClipboardList,
  FileSpreadsheet,
  FileSearch,
  PieChart,
  User,
  Building2,
  CheckSquare,
} from 'lucide-react';

export type AppView = 'pos' | 'ai_platform' | 'action_center' | 'admin_control_plane' | 'customers' | 'debts' | 'sales' | 'products' | 'audit' | 'communications' | 'recovery' | 'executive' | 'suppliers' | 'supplier_360' | 'procurement_dashboard' | 'purchase_requests' | 'purchase_orders' | 'receiving' | 'invoices' | 'payables' | 'supplier_payments' | 'expenses' | 'finance' | 'my_profile' | 'business_profile';

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
  branchName?: string;
  registerName?: string;
  shiftNumber?: string;
  cashierName?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  children,
  branchName = 'Toshkent Markaziy Filial',
  registerName = 'Kassa-01',
  shiftNumber = 'Shift #01',
  cashierName = 'Abror Anvarjonov',
}) => {
  const [currentUser, setCurrentUser] = useState({
    first_name: 'Abror',
    last_name: 'Anvarjonov',
    display_name: 'Abror Anvarjonov',
    role: 'Bosh Direktor (Owner)',
    avatar_url: null as string | null
  });

  useEffect(() => {
    fetch('/api/v1/me')
      .then(res => res.json())
      .then(json => {
        if (json?.success && json?.data) {
          setCurrentUser(json.data);
        }
      })
      .catch(() => {});

    const handleProfileUpdate = (e: any) => {
      if (e?.detail) {
        setCurrentUser(prev => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('user_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('user_profile_updated', handleProfileUpdate);
  }, []);
  const navItems = [
    { id: 'pos', label: 'POS Kassa', icon: ShoppingCart },
    { id: 'ai_platform', label: 'AI Platform & Supervisor', icon: Bot },
    { id: 'action_center', label: 'Action Center & Integrations', icon: CheckSquare },
    { id: 'admin_control_plane', label: 'Platform Control Plane', icon: ShieldAlert },
    { id: 'finance', label: 'Financial Command Center', icon: BarChart3 },
    { id: 'executive', label: 'Owner Recovery Dashboard', icon: BarChart3 },
    { id: 'procurement_dashboard', label: 'Procurement Control', icon: BarChart3 },
    { id: 'customers', label: 'Mijozlar 360', icon: Users },
    { id: 'debts', label: 'Qarzlar & To\'lovlar', icon: CreditCard },
    { id: 'suppliers', label: 'Yetkazib beruvchilar', icon: Truck },
    { id: 'purchase_requests', label: 'Xarid so‘rovlari', icon: ClipboardList },
    { id: 'purchase_orders', label: 'Xarid buyurtmalari', icon: FileSpreadsheet },
    { id: 'receiving', label: 'Tovar qabul qilish', icon: Truck },
    { id: 'invoices', label: 'Supplier Invoices', icon: FileSearch },
    { id: 'payables', label: 'Accounts Payable', icon: CreditCard },
    { id: 'supplier_payments', label: 'Supplier Payments', icon: CreditCard },
    { id: 'expenses', label: 'Operatsion Xarajatlar', icon: PieChart },
    { id: 'communications', label: 'Aloqa Markazi (AI)', icon: PhoneCall },
    { id: 'recovery', label: 'Recovery Risk AI', icon: ShieldAlert },
    { id: 'sales', label: 'Savdolar Tarixi', icon: TrendingUp },
    { id: 'products', label: 'Mahsulotlar Katalogi', icon: Package },
    { id: 'audit', label: 'Audit Jurnali', icon: FileText },
    { id: 'my_profile', label: 'Mening Profilim', icon: User },
    { id: 'business_profile', label: 'Biznes Profili', icon: Building2 },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800/80 bg-[#0d1322]">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800/80 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-950/50">
            PL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">ProfitLeak</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Retail Operating System</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Asosiy Modullar
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as AppView)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="border-t border-slate-800/80 p-4">
          <button
            onClick={() => onNavigate('my_profile')}
            className="w-full flex items-center gap-3 rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/60 hover:bg-slate-800/80 hover:border-slate-700 transition text-left"
          >
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt="Avatar"
                className="h-8 w-8 rounded-lg object-cover border border-emerald-500/30"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                {currentUser.first_name?.[0] || 'A'}{currentUser.last_name?.[0] || 'A'}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-xs font-semibold text-slate-200">
                {currentUser.display_name || `${currentUser.first_name} ${currentUser.last_name}`}
              </div>
              <div className="truncate text-[10px] text-slate-400">{currentUser.role}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0d1322]/80 px-6 backdrop-blur">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800/80">
              <Store className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-400">Filial:</span>
              <span className="font-semibold text-slate-200">{branchName}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800/80">
              <Boxes className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-slate-400">Kassa:</span>
              <span className="font-semibold text-slate-200">{registerName}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800/80">
              <Bot className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-slate-400">Smena:</span>
              <span className="font-semibold text-slate-200">{shiftNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('admin_control_plane')}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors shadow-sm"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Control Plane</span>
            </button>
            <button
              onClick={() => onNavigate('my_profile')}
              className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 hover:bg-slate-800 transition shadow-sm text-left"
              title="Mening Profilim"
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt="Avatar"
                  className="h-6 w-6 rounded-full object-cover border border-emerald-500/40"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  {currentUser.first_name?.[0] || 'A'}{currentUser.last_name?.[0] || 'A'}
                </div>
              )}
              <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                {currentUser.display_name || currentUser.first_name}
              </span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto bg-[#090d16]">{children}</main>
      </div>
    </div>
  );
};
