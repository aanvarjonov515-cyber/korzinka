import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Save,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Lock,
  Globe,
  Clock,
  Sparkles,
  Building2,
  Calendar,
  Key,
  Trash2,
  Upload,
  Check,
  Info
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface MyProfilePageProps {
  onNavigate: (view: AppView) => void;
}

interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  display_name: string;
  email: string;
  email_verified: boolean;
  email_verified_at: string | null;
  phone: string;
  phone_verified: boolean;
  phone_verified_at: string | null;
  secondary_phone: string | null;
  avatar_url: string | null;
  country: string;
  region: string;
  city: string;
  address: string;
  preferred_language: string;
  timezone: string;
  job_title: string;
  department: string;
  bio: string;
  role: string;
  business_name: string;
  branch_name: string;
  account_status: string;
  member_since: string;
  last_login_at: string;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'location' | 'preferences' | 'security'>('personal');
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Avatar Upload Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Current Profile from Real Backend API (GET /api/v1/me)
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/me');
      if (!res.ok) {
        throw new Error(`Server xatosi: ${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setProfile(json.data);
      } else {
        throw new Error(json.message || "Foydalanuvchi ma'lumotlari topilmadi");
      }
    } catch (err: any) {
      setError(err.message || "Server bilan aloqa uzildi. Qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Form Field Change Handler
  const handleFieldChange = (field: keyof UserProfileData, value: string) => {
    if (!profile) return;
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
    setSaveError(null);
  };

  // Save Profile Handler (PATCH /api/v1/me/profile)
  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const payload = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        middle_name: profile.middle_name,
        display_name: profile.display_name,
        phone: profile.phone,
        secondary_phone: profile.secondary_phone,
        country: profile.country,
        region: profile.region,
        city: profile.city,
        address: profile.address,
        preferred_language: profile.preferred_language,
        timezone: profile.timezone,
        bio: profile.bio
      };

      const res = await fetch('/api/v1/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Saqlashda xatolik yuz berdi");
      }

      setProfile(json.data);
      setSaveSuccess(true);
      setHasUnsavedChanges(false);

      // Notify AppShell of update so header syncs immediately
      window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: json.data }));

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar File Selection & Preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Faqat JPEG, PNG yoki WEBP formatidagi rasmlar qabul qilinadi.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Fayl hajmi 5MB dan oshmasligi kerak.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload Avatar Handler (POST /api/v1/me/avatar)
  const handleUploadAvatar = async () => {
    if (!avatarPreview) return;
    setAvatarUploading(true);

    try {
      const res = await fetch('/api/v1/me/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: avatarPreview })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Rasm yuklanmadi");
      }

      setProfile(prev => prev ? { ...prev, avatar_url: json.data.avatar_url } : null);
      setShowAvatarModal(false);
      setAvatarPreview(null);

      // Sync header
      window.dispatchEvent(new CustomEvent('user_profile_updated', {
        detail: { ...profile, avatar_url: json.data.avatar_url }
      }));
    } catch (err: any) {
      alert(err.message || "Rasmni yuklashda xatolik");
    } finally {
      setAvatarUploading(false);
    }
  };

  // Remove Avatar Handler (DELETE /api/v1/me/avatar)
  const handleRemoveAvatar = async () => {
    if (!confirm("Profil rasmini olib tashlab, bosh harflar (initials) rejimiga qaytishni xohlaysizmi?")) return;

    try {
      const res = await fetch('/api/v1/me/avatar', { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
        window.dispatchEvent(new CustomEvent('user_profile_updated', {
          detail: { ...profile, avatar_url: null }
        }));
      }
    } catch (e) {
      alert("Rasmni o'chirishda xatolik");
    }
  };

  // Deterministic Completion Score calculation
  const calculateCompletionScore = (p: UserProfileData): number => {
    let score = 0;
    if (p.first_name) score += 15;
    if (p.last_name) score += 15;
    if (p.email) score += 20;
    if (p.phone) score += 15;
    if (p.avatar_url) score += 15;
    if (p.city || p.address) score += 10;
    if (p.bio) score += 10;
    return Math.min(100, score);
  };

  // Initials generator
  const getInitials = (firstName?: string, lastName?: string) => {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return f + l || 'PL';
  };

  return (
    <AppShell currentView="my_profile" onNavigate={onNavigate}>
      <div className="flex h-full flex-col bg-[#090d16] text-slate-100 overflow-y-auto">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="p-8 max-w-5xl mx-auto space-y-6 w-full animate-pulse">
            <div className="h-8 bg-slate-800 rounded-lg w-1/4"></div>
            <div className="h-44 bg-slate-900 border border-slate-800 rounded-2xl"></div>
            <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-8 max-w-xl mx-auto my-auto text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Profil Ma'lumotlarini Yuklab Bo'lmadi</h2>
            <p className="text-xs text-slate-400">{error}</p>
            <button
              onClick={fetchProfile}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Qayta Urinish
            </button>
          </div>
        )}

        {/* Real Profile Loaded */}
        {profile && !isLoading && (
          <div className="p-6 max-w-5xl mx-auto space-y-6 w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Foydalanuvchi Profili
                  </h1>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    REAL IDENTIFICATION
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Shaxsiy hisob parametrlari, haqiqiy aloqa ma'lumotlari va xavfsizlik sozlamalari
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                {saveError && (
                  <span className="text-xs text-rose-400 font-medium mr-2 flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" /> {saveError}
                  </span>
                )}
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold mr-2 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saqlandi
                  </span>
                )}
                {hasUnsavedChanges && !saveSuccess && (
                  <span className="text-xs text-amber-400 font-medium mr-2">
                    Saqlanmagan o'zgarishlar bor
                  </span>
                )}

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors shadow-lg shadow-emerald-950/40 disabled:opacity-50"
                >
                  <Save className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>{isSaving ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}</span>
                </button>
              </div>
            </div>

            {/* Profile Hero Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Avatar with Upload Button */}
                <div className="flex items-center gap-5">
                  <div className="relative group shrink-0">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="h-24 w-24 rounded-full object-cover border-2 border-emerald-500/40 shadow-md"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-indigo-700 text-white font-bold text-2xl shadow-lg border-2 border-emerald-500/30">
                        {getInitials(profile.first_name, profile.last_name)}
                      </div>
                    )}

                    {/* Camera Change Button on Hover */}
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:bg-emerald-600 hover:text-white transition-colors shadow-md"
                      title="Rasmni almashtirish"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Center: Full Name, Role & Business */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {profile.display_name || `${profile.first_name} ${profile.last_name}`}
                      </h2>
                      <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold">
                        {profile.role}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                        {profile.job_title}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-500" />
                        {profile.business_name}
                      </span>
                      <span>•</span>
                      <span>{profile.branch_name}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>A'zolik: {profile.member_since}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">Hisob Holati: {profile.account_status}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Deterministic Completion Widget */}
                <div className="rounded-xl bg-[#12192b] border border-slate-800/80 p-4 shrink-0 min-w-[200px] text-center md:text-right space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Profil to'liqligi:</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      {calculateCompletionScore(profile)}%
                    </strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${calculateCompletionScore(profile)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {calculateCompletionScore(profile) === 100
                      ? "Barcha maydonlar to'liq kiritilgan"
                      : "Shaxsiy va aloqa ma'lumotlarini to'ldiring"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto pb-1">
              {[
                { id: 'personal', label: "Shaxsiy Ma'lumotlar", icon: User },
                { id: 'contact', label: "Aloqa & Tasdiq", icon: Mail },
                { id: 'location', label: "Manzil & Hudud", icon: MapPin },
                { id: 'preferences', label: "Til & Timezone", icon: Globe },
                { id: 'security', label: "Xavfsizlik & Kirish", icon: ShieldCheck }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PERSONAL INFO */}
            {activeTab === 'personal' && (
              <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-5">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white">Shaxsiy Pasport & Identifikatsiya</h3>
                  <p className="text-xs text-slate-400">Tizimda sizning rasmiy shaxsingizni ifodalovchi asosiy parametrlar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Ism (First Name) *</label>
                    <input
                      type="text"
                      value={profile.first_name || ''}
                      onChange={(e) => handleFieldChange('first_name', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Familiya (Last Name) *</label>
                    <input
                      type="text"
                      value={profile.last_name || ''}
                      onChange={(e) => handleFieldChange('last_name', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Otasining ismi (Middle Name)</label>
                    <input
                      type="text"
                      value={profile.middle_name || ''}
                      onChange={(e) => handleFieldChange('middle_name', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Ko'rinadigan ism (Display Name)</label>
                    <input
                      type="text"
                      value={profile.display_name || ''}
                      onChange={(e) => handleFieldChange('display_name', e.target.value)}
                      placeholder="Masalan: Abror Anvarjonov"
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-slate-400 block mb-1">Faoliyat va Bio (Haqida)</label>
                    <textarea
                      rows={3}
                      value={profile.bio || ''}
                      onChange={(e) => handleFieldChange('bio', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTACT INFORMATION */}
            {activeTab === 'contact' && (
              <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-5">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white">Aloqa & Hisob Tasdiqlash Holati</h3>
                  <p className="text-xs text-slate-400">Xavfsiz xabarlar, SMS kodlari va hisobotlar yuboriladigan kanallar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  {/* Email Field with Verification Badge */}
                  <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        Asosiy Elektron Pochta (Email)
                      </label>
                      {profile.email_verified ? (
                        <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                          <Check className="h-3 w-3" /> Tasdiqlangan
                        </span>
                      ) : (
                        <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                          Tasdiqlanmagan
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full rounded-lg border border-slate-700/80 bg-[#0d1322] p-2.5 text-slate-300 font-mono text-xs cursor-not-allowed"
                    />
                    <div className="text-[10px] text-slate-500">
                      Email xavfsizlik maqsadida faqat alohida verifikatsiya oqimi orqali o'zgartiriladi.
                    </div>
                  </div>

                  {/* Phone Field with Verification Badge */}
                  <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        Asosiy Telefon Raqami
                      </label>
                      {profile.phone_verified ? (
                        <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                          <Check className="h-3 w-3" /> Tasdiqlangan
                        </span>
                      ) : (
                        <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                          Tasdiqlanmagan
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={profile.phone || ''}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="+998 90 750 12 34"
                      className="w-full rounded-lg border border-slate-700 bg-[#0d1322] p-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    />
                    <div className="text-[10px] text-slate-500">
                      Xalqaro formatda kiriting (masalan: +998 XX XXX XX XX).
                    </div>
                  </div>

                  {/* Secondary Phone */}
                  <div className="md:col-span-2">
                    <label className="text-slate-400 block mb-1">Qo'shimcha Telefon Raqami (Ixtiyoriy)</label>
                    <input
                      type="text"
                      value={profile.secondary_phone || ''}
                      onChange={(e) => handleFieldChange('secondary_phone', e.target.value)}
                      placeholder="+998 97 123 45 67"
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LOCATION */}
            {activeTab === 'location' && (
              <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-5">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white">Hudud & Yashash Joyi Manzili</h3>
                  <p className="text-xs text-slate-400">Yuridik shartnomalar va yetkazib berish xizmatlari uchun tuzilgan parametrlar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Davlat (Country)</label>
                    <input
                      type="text"
                      value={profile.country || ''}
                      onChange={(e) => handleFieldChange('country', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Viloyat / Hudud (Region)</label>
                    <input
                      type="text"
                      value={profile.region || ''}
                      onChange={(e) => handleFieldChange('region', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Shahar / Tuman (City)</label>
                    <input
                      type="text"
                      value={profile.city || ''}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-slate-400 block mb-1">Aniq Ko'cha & Uy Manzili (Address)</label>
                    <input
                      type="text"
                      value={profile.address || ''}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      placeholder="Chilonzor tumani, Bunyodkor shoh ko'chasi 42-uy"
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-5">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white">Til & Vaqt Mintaqasi Sozlamalari</h3>
                  <p className="text-xs text-slate-400">Interfeys tili va operatsiyalar vaqtini ko'rsatish tartibi</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Interfeys Tili (Preferred Language)</label>
                    <select
                      value={profile.preferred_language || 'uz'}
                      onChange={(e) => handleFieldChange('preferred_language', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="uz">O'zbekcha (Lotin)</option>
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Vaqt Mintaqasi (Timezone)</label>
                    <select
                      value={profile.timezone || 'Asia/Tashkent'}
                      onChange={(e) => handleFieldChange('timezone', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#12192b] p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Asia/Tashkent">Asia/Tashkent (UTC+5:00)</option>
                      <option value="Asia/Samarkand">Asia/Samarkand (UTC+5:00)</option>
                      <option value="Europe/Moscow">Europe/Moscow (UTC+3:00)</option>
                      <option value="UTC">UTC (Universal Coordinated Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SECURITY */}
            {activeTab === 'security' && (
              <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-5">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white">Xavfsizlik, Parol & Faol Sessiyalar</h3>
                  <p className="text-xs text-slate-400">Autentifikatsiya, apparat kalitlari (MFA) va oxirgi kirish jurnali</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Hisob Paroli</span>
                      <span className="text-[10px] text-slate-500 font-mono">Oxirgi o'zgartirish: 3 oy oldin</span>
                    </div>
                    <div className="font-mono text-slate-400">••••••••••••••••</div>
                    <button
                      onClick={() => alert("Parolni o'zgartirish oqimi: SMS / Email orqali tasdiqlash talab qilinadi.")}
                      className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Parolni Yangilash
                    </button>
                  </div>

                  <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Ikki Bosqichli MFA</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                        FAOL (Hardware Key)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">FIDO2 / YubiKey va TOTP autentifikatsiyasi orqali himoyalangan.</p>
                  </div>

                  <div className="rounded-xl bg-[#12192b] p-4 border border-slate-800 md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Hozirgi Faol Sessiya</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        Aktiv Qurilma
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Vite Desktop SPA • Google Chrome • Toshkent, O'zbekiston</span>
                      <span className="font-mono">{profile.last_login_at ? new Date(profile.last_login_at).toLocaleTimeString() : 'Hozir'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AVATAR UPLOAD & PREVIEW MODAL */}
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1322] shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-emerald-400" />
                  Profil Rasmini Yangilash
                </h3>
                <button
                  onClick={() => { setShowAvatarModal(false); setAvatarPreview(null); }}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                  />
                ) : profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Current"
                    className="h-32 w-32 rounded-full object-cover border-2 border-slate-700 shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-800 text-slate-400 text-3xl font-bold border-2 border-dashed border-slate-700">
                    {profile ? getInitials(profile.first_name, profile.last_name) : 'PL'}
                  </div>
                )}

                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Faylni Tanlash (JPEG, PNG, WEBP)</span>
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1">Maksimal hajm: 5 MB</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                {profile?.avatar_url ? (
                  <button
                    onClick={handleRemoveAvatar}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Rasmni o'chirish
                  </button>
                ) : <div></div>}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setShowAvatarModal(false); setAvatarPreview(null); }}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleUploadAvatar}
                    disabled={!avatarPreview || avatarUploading}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition shadow-sm"
                  >
                    {avatarUploading ? 'Yuklanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
