import React, { useState, useMemo } from 'react';
import {
  PhoneCall,
  Phone,
  MessageSquare,
  Mail,
  Send,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Activity,
  Server,
  Settings,
  Bot,
  Play,
  Pause,
  RefreshCw,
  FileText,
  Calendar,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AppShell, AppView } from '../components/layout/AppShell';

interface CallCenterPageProps {
  onNavigate: (view: AppView) => void;
}

type TabType = 'live_call' | 'queue' | 'sms_logs' | 'providers' | 'policy';

interface ActiveCallData {
  id: string;
  customerName: string;
  customerPhone: string;
  debtNumber: string;
  outstandingAmount: number;
  dueDate: string;
  durationSeconds: number;
  status: string;
  language: string;
  transcript: { sender: 'AI' | 'CUSTOMER'; text: string; time: string }[];
  detectedIntent: {
    type: string;
    promisedAmount?: number;
    promisedDate?: string;
    confidence: number;
  } | null;
}

const INITIAL_ACTIVE_CALL: ActiveCallData = {
  id: 'call-sess-9921',
  customerName: 'Anvar Karimov',
  customerPhone: '+998901234567',
  debtNumber: 'DEBT-2026-000184',
  outstandingAmount: 480000,
  dueDate: '2026-10-28',
  durationSeconds: 42,
  status: 'IN_PROGRESS',
  language: 'uz',
  transcript: [
    {
      sender: 'AI',
      text: 'Assalomu alaykum, Anvar Karimov. Men ProfitLeak do‘konlar tarmog‘ining virtual yordamchisiman.',
      time: '12:40:10',
    },
    {
      sender: 'CUSTOMER',
      text: 'Vaalaykum assalom. Nima xizmat?',
      time: '12:40:15',
    },
    {
      sender: 'AI',
      text: 'Sizning DEBT-2026-000184 raqamli 480 000 UZS qarzining to‘lov muddati 28-oktyabr kuni tugagan edi. To‘lovni qachon amalga oshira olasiz?',
      time: '12:40:22',
    },
    {
      sender: 'CUSTOMER',
      text: 'Ertaga tushdan keyin soat 15:00 da plastik kartamdan o‘tkazib beraman.',
      time: '12:40:35',
    },
  ],
  detectedIntent: {
    type: 'PROMISE_TO_PAY',
    promisedAmount: 480000,
    promisedDate: '2026-10-31 15:00',
    confidence: 0.96,
  },
};

const QUEUED_ITEMS = [
  {
    id: 'q-101',
    customerName: 'Malika Usmanova',
    phone: '+998939876543',
    debtNumber: 'DEBT-2026-000185',
    channel: 'VOICE_AI',
    template: 'OVERDUE_CALL',
    status: 'QUEUED',
    scheduledAt: '2026-10-30 14:00',
  },
  {
    id: 'q-102',
    customerName: 'Shohruh Aliyev',
    phone: '+998915556677',
    debtNumber: 'DEBT-2026-000186',
    channel: 'SMS',
    template: 'DUE_TODAY_SMS',
    status: 'SENT',
    scheduledAt: '2026-10-30 11:30',
  },
  {
    id: 'q-103',
    customerName: 'Jamshid Nazarov',
    phone: '+998974443322',
    debtNumber: 'DEBT-2026-000187',
    channel: 'TELEGRAM',
    template: 'PRE_DUE_REMINDER',
    status: 'DELIVERED',
    scheduledAt: '2026-10-30 09:15',
  },
];

const PROVIDERS = [
  {
    name: 'Voice AI Gateway (Twilio / WebRTC)',
    channel: 'VOICE_AI',
    status: 'HEALTHY',
    activeChannels: 4,
    latency: '120ms',
    uptime: '99.98%',
  },
  {
    name: 'SMS Gateway (Eskiz.uz API)',
    channel: 'SMS',
    status: 'HEALTHY',
    activeChannels: 10,
    latency: '45ms',
    uptime: '100%',
  },
  {
    name: 'Email Gateway (SendGrid SMTP)',
    channel: 'EMAIL',
    status: 'HEALTHY',
    activeChannels: 2,
    latency: '210ms',
    uptime: '99.95%',
  },
  {
    name: 'Telegram Bot Gateway',
    channel: 'TELEGRAM',
    status: 'HEALTHY',
    activeChannels: 1,
    latency: '80ms',
    uptime: '100%',
  },
];

export const CallCenterPage: React.FC<CallCenterPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('live_call');
  const [activeCall, setActiveCall] = useState<ActiveCallData>(INITIAL_ACTIVE_CALL);
  const [isPromiseConfirmed, setIsPromiseConfirmed] = useState(false);

  // Policy form state
  const [quietHoursStart, setQuietHoursStart] = useState('20:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [maxDailyContacts, setMaxDailyContacts] = useState(3);
  const [maxVoiceCalls, setMaxVoiceCalls] = useState(1);

  const handleConfirmPromise = () => {
    setIsPromiseConfirmed(true);
    alert(`480 000 UZS summadagi to‘lov va’dasi 2026-10-31 15:00 ga saqlandi.`);
  };

  return (
    <AppShell currentView="communications" onNavigate={onNavigate}>
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#090d16] p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-emerald-400" />
              Aloqa Markazi & AI Qo‘ng‘iroqlar
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              AI Ovozli qo‘ng‘iroqlar, SMS, Email va Telegram orqali qarzdorlikni undirish
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voice AI Live Orchestrator Active</span>
            </span>
          </div>
        </div>

        {/* Top KPI Metrics Strip */}
        <div className="grid grid-cols-6 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Bugungi Qo‘ng‘iroqlar</div>
            <div className="mt-1 text-2xl font-bold text-white">18 ta</div>
            <div className="text-[10px] text-emerald-400 mt-1">100% policy-compliant</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Javob Berilgan</div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">14 ta</div>
            <div className="text-[10px] text-slate-400 mt-1">77.7% Answer rate</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Va’da Olingan</div>
            <div className="mt-1 text-2xl font-bold text-blue-400">9 ta</div>
            <div className="text-[10px] text-slate-400 mt-1">64.2% Conversion</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">SMS Yuborilgan</div>
            <div className="mt-1 text-2xl font-bold text-purple-400">42 ta</div>
            <div className="text-[10px] text-slate-400 mt-1">100% Delivered</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Ochiq Callbacks</div>
            <div className="mt-1 text-2xl font-bold text-amber-400">3 ta</div>
            <div className="text-[10px] text-slate-400 mt-1">Scheduled calls</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Gateway Status</div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">HEALTHY</div>
            <div className="text-[10px] text-slate-400 mt-1">0 error alerts</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setActiveTab('live_call')}
            className={`pb-3 transition-colors ${
              activeTab === 'live_call'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            🎙 Aktiv AI Qo‘ng‘iroq & Jonli Muloqot
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 transition-colors ${
              activeTab === 'queue'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            📋 Outreach Navbati (Queue)
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`pb-3 transition-colors ${
              activeTab === 'providers'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            🌐 Gateway Provaiderlar
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-3 transition-colors ${
              activeTab === 'policy'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            ⚙️ Siyosat va Tinch Soatlar (Quiet Hours)
          </button>
        </div>

        {/* TAB 1: Live Call Panel */}
        {activeTab === 'live_call' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Customer & Debt Context (~40%) */}
            <div className="col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mijoz va Qarz Faktlari</span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    VERIFIED FACTS ONLY
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 font-bold text-base border border-slate-700">
                    AK
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{activeCall.customerName}</h2>
                    <p className="text-xs font-mono text-slate-400">{activeCall.customerPhone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3">
                    <span className="text-[10px] text-slate-400 uppercase block">Qarz Hujjat #</span>
                    <span className="text-xs font-mono font-semibold text-slate-200">{activeCall.debtNumber}</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3">
                    <span className="text-[10px] text-slate-400 uppercase block">Qarzdorlik Summasi</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {activeCall.outstandingAmount.toLocaleString()} UZS
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">To‘lov Muddati:</span>
                    <span className="font-mono text-slate-200">{activeCall.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tili:</span>
                    <span className="font-semibold text-emerald-400 uppercase">{activeCall.language}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Qo‘ng‘iroq Davomiyligi:</span>
                    <span className="font-mono text-slate-200">{activeCall.durationSeconds} sek</span>
                  </div>
                </div>

                {/* Detected Intent & Action Box */}
                {activeCall.detectedIntent && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        AI Aniqlagan Niyat: TO‘LOV VA’DASI
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300">
                        Isbot: {(activeCall.detectedIntent.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Mijoz <strong className="text-white">2026-10-31 soat 15:00</strong> ga{' '}
                      <strong className="text-emerald-400">480 000 UZS</strong> to‘lov va’dasini berdi.
                    </p>

                    <button
                      onClick={handleConfirmPromise}
                      disabled={isPromiseConfirmed}
                      className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-all disabled:opacity-50"
                    >
                      {isPromiseConfirmed ? '✓ Va’da Baza Baza Saqlandi' : 'To‘lov Va’dasini Tasdiqlash va Saqlash'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Chat Transcript (~60%) */}
            <div className="col-span-7 flex flex-col rounded-2xl border border-slate-800 bg-[#111827] shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#0d1322] px-6 py-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Jonli Ovozli Suhbat Steynogrammasi (Live Transcript)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Provider: Twilio / STT Neural</span>
              </div>

              {/* Chat bubble stream */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto min-h-[360px] bg-[#090d16]/50">
                {activeCall.transcript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'AI' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {msg.sender === 'AI' ? '🤖 Voice AI Assistant' : '👤 Customer'}
                      </span>
                      <span className="text-[10px] text-slate-600">{msg.time}</span>
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                        msg.sender === 'AI'
                          ? 'bg-slate-800 text-slate-100 border border-slate-700/80'
                          : 'bg-emerald-600 text-white font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="border-t border-slate-800 bg-[#0d1322] p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700">
                    E’tiroz Qayd Qilish
                  </button>
                  <button className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700">
                    To‘lov Tekshirish Task
                  </button>
                </div>

                <button className="rounded-xl bg-rose-600/20 border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-600/30">
                  Inson Operatoriga Yo‘naltirish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Queue */}
        {activeTab === 'queue' && (
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white">Chiquvchi Xabarlar va Qo‘ng‘iroqlar Navbati</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-500 bg-[#090d16]">
                  <tr>
                    <th className="py-3 px-4">Mijoz</th>
                    <th className="py-3 px-4">Telefon</th>
                    <th className="py-3 px-4">Qarz #</th>
                    <th className="py-3 px-4">Kanal</th>
                    <th className="py-3 px-4">Shablon</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4 text-right">Rejalashtirilgan Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {QUEUED_ITEMS.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">{item.customerName}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{item.phone}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{item.debtNumber}</td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-bold text-emerald-400 border border-slate-700">
                          {item.channel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.template}</td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">{item.scheduledAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Providers */}
        {activeTab === 'providers' && (
          <div className="grid grid-cols-2 gap-6">
            {PROVIDERS.map((prov, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{prov.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">Kanal: {prov.channel}</span>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-400">
                    {prov.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3">
                    <span className="text-[10px] text-slate-400 uppercase block">Aktiv Kanallar</span>
                    <span className="text-sm font-bold text-white">{prov.activeChannels}</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3">
                    <span className="text-[10px] text-slate-400 uppercase block">Lateks (Latency)</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">{prov.latency}</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3">
                    <span className="text-[10px] text-slate-400 uppercase block">Uptime</span>
                    <span className="text-sm font-bold text-blue-400">{prov.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Policy */}
        {activeTab === 'policy' && (
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl max-w-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-emerald-400" />
                Siyosat va Tinch Soatlar (Quiet Hours Policy)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Aholiga xalaqit bermaslik uchun belgilangan vaqtlarda avtomatik qo‘ng‘iroqlar to‘xtatiladi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Tinch Soatlar Boshlanishi (Quiet Hours Start)
                </label>
                <input
                  type="text"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#090d16] px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Tinch Soatlar Tugashi (Quiet Hours End)
                </label>
                <input
                  type="text"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#090d16] px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Kunlik Maksimal Aloqa Chegarasi (Customer Contact Cap)
                </label>
                <input
                  type="number"
                  value={maxDailyContacts}
                  onChange={(e) => setMaxDailyContacts(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-slate-800 bg-[#090d16] px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Kunlik Maksimal AI Qo‘ng‘iroq
                </label>
                <input
                  type="number"
                  value={maxVoiceCalls}
                  onChange={(e) => setMaxVoiceCalls(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-slate-800 bg-[#090d16] px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => alert("Siyosat muvaffaqiyatli saqlandi.")}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
            >
              Sozlamalarni Saqlash
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
};
