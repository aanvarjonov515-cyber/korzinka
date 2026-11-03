import React, { useState } from 'react';
import { Building2, Save, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface BusinessProfilePageProps {
  onNavigate: (view: AppView) => void;
}

export const BusinessProfilePage: React.FC<BusinessProfilePageProps> = ({ onNavigate }) => {
  const [business, setBusiness] = useState({
    name: 'ProfitLeak Retail OOO',
    taxId: '301294821',
    address: 'Toshkent sh., Yunusobod tumani',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell currentView="business_profile" onNavigate={onNavigate}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Biznes profili</h1>
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
                <label className="text-xs text-slate-400">Biznes Nomi</label>
                <input 
                  type="text"
                  className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500" 
                  value={business.name} 
                  onChange={(e) => setBusiness(prev => ({ ...prev, name: e.target.value }))}
                />
            </div>
            <div>
                <label className="text-xs text-slate-400">STIR</label>
                <input 
                  type="text"
                  className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500" 
                  value={business.taxId} 
                  onChange={(e) => setBusiness(prev => ({ ...prev, taxId: e.target.value }))}
                />
            </div>
            <div>
                <label className="text-xs text-slate-400">Yuridik Manzil</label>
                <input 
                  type="text"
                  className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500" 
                  value={business.address} 
                  onChange={(e) => setBusiness(prev => ({ ...prev, address: e.target.value }))}
                />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
              >
                  <Save className="w-4 h-4" /> Saqlash
              </button>
              {saved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Muvaffaqiyatli saqlandi
                </span>
              )}
            </div>
        </div>
      </div>
    </AppShell>
  );
};
