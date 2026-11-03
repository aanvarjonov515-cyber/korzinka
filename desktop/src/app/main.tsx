import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/globals.css';
import { PosCheckoutPage } from '../pages/PosCheckoutPage';
import { Customer360Page } from '../pages/Customer360Page';
import { DebtsPage } from '../pages/DebtsPage';
import { SalesHistoryPage } from '../pages/SalesHistoryPage';
import { ProductsPage } from '../pages/ProductsPage';
import { AuditJournalPage } from '../pages/AuditJournalPage';
import { CallCenterPage } from '../pages/CallCenterPage';
import { RecoveryIntelligencePage } from '../pages/RecoveryIntelligencePage';
import { OwnerDashboardPage } from '../pages/OwnerDashboardPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { Supplier360Page } from '../pages/Supplier360Page';
import { ProcurementDashboardPage } from '../pages/ProcurementDashboardPage';
import { PurchaseRequestsPage } from '../pages/PurchaseRequestsPage';
import { PurchaseOrdersPage } from '../pages/PurchaseOrdersPage';
import { GoodsReceivingPage } from '../pages/GoodsReceivingPage';
import { InvoicesPage } from '../pages/InvoicesPage';
import { PayablesPage } from '../pages/PayablesPage';
import { SupplierPaymentsPage } from '../pages/SupplierPaymentsPage';
import { ExpensesPage } from '../pages/ExpensesPage';
import { FinancialCommandCenter } from '../pages/FinancialCommandCenter';
import { AICommandCenterPage } from '../pages/AICommandCenterPage';
import { ActionCenterPage } from '../pages/ActionCenterPage';
import { AdminControlPlanePage } from '../pages/AdminControlPlanePage';
import { AppView } from '../components/layout/AppShell';
import { MyProfilePage } from '../pages/MyProfilePage';
import { BusinessProfilePage } from '../pages/BusinessProfilePage';

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>('admin_control_plane');

  switch (currentView) {
    case 'pos':
      return <PosCheckoutPage onNavigate={(view) => setCurrentView(view)} />;
    case 'admin_control_plane':
      return <AdminControlPlanePage onNavigate={(view) => setCurrentView(view)} />;
    case 'ai_platform':
      return <AICommandCenterPage onNavigate={(view) => setCurrentView(view)} />;
    case 'action_center':
      return <ActionCenterPage onNavigate={(view) => setCurrentView(view)} />;
    case 'finance':
      return <FinancialCommandCenter onNavigate={(view) => setCurrentView(view)} />;
    case 'my_profile':
      return <MyProfilePage onNavigate={(view) => setCurrentView(view)} />;
    case 'business_profile':
      return <BusinessProfilePage onNavigate={(view) => setCurrentView(view)} />;
    case 'executive':
      return <OwnerDashboardPage onNavigate={(view) => setCurrentView(view)} />;
    case 'customers':
      return <Customer360Page onNavigate={(view) => setCurrentView(view)} />;
    case 'debts':
      return <DebtsPage onNavigate={(view) => setCurrentView(view)} />;
    case 'suppliers':
      return <SuppliersPage onNavigate={(view) => setCurrentView(view)} />;
    case 'supplier_360':
      return <Supplier360Page onNavigate={(view) => setCurrentView(view)} />;
    case 'procurement_dashboard':
      return <ProcurementDashboardPage onNavigate={(view) => setCurrentView(view)} />;
    case 'purchase_requests':
      return <PurchaseRequestsPage onNavigate={(view) => setCurrentView(view)} />;
    case 'purchase_orders':
      return <PurchaseOrdersPage onNavigate={(view) => setCurrentView(view)} />;
    case 'receiving':
      return <GoodsReceivingPage onNavigate={(view) => setCurrentView(view)} />;
    case 'invoices':
      return <InvoicesPage onNavigate={(view) => setCurrentView(view)} />;
    case 'payables':
      return <PayablesPage onNavigate={(view) => setCurrentView(view)} />;
    case 'supplier_payments':
      return <SupplierPaymentsPage onNavigate={(view) => setCurrentView(view)} />;
    case 'expenses':
      return <ExpensesPage onNavigate={(view) => setCurrentView(view)} />;
    case 'communications':
      return <CallCenterPage onNavigate={(view) => setCurrentView(view)} />;
    case 'recovery':
      return <RecoveryIntelligencePage onNavigate={(view) => setCurrentView(view)} />;
    case 'sales':
      return <SalesHistoryPage onNavigate={(view) => setCurrentView(view)} />;
    case 'products':
      return <ProductsPage onNavigate={(view) => setCurrentView(view)} />;
    case 'audit':
      return <AuditJournalPage onNavigate={(view) => setCurrentView(view)} />;
    default:
      return null;
  }
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
