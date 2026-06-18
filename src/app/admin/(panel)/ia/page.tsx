'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Bot,
  ChevronRight,
  Loader2,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

type KeniaConfig = {
  adminPrompt: string;
  customerPrompt: string;
  adminAlertPhone: string;
  tokenLimitPerCustomer: number;
  notifyOnEveryCustomerMessage: boolean;
  updatedAt: string;
};

const emptyConfig: KeniaConfig = {
  adminPrompt: '',
  customerPrompt: '',
  adminAlertPhone: '',
  tokenLimitPerCustomer: 15000,
  notifyOnEveryCustomerMessage: true,
  updatedAt: '',
};

function formatDate(value: string) {
  if (!value) return 'Sin actividad';
  try {
    return new Date(value).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return value;
  }
}

function compactNumber(value: number) {
  return new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0);
}

export default function AdminIAPage() {
  const [stats, setStats] = useState({
    totalThreads: 0,
    customerThreads: 0,
    unreadThreads: 0,
    blockedThreads: 0,
    overLimitThreads: 0,
    totalTokens: 0,
  });
  const [config, setConfig] = useState<KeniaConfig>(emptyConfig);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [promptTab, setPromptTab] = useState<'customer' | 'admin'>('customer');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadConfig = useCallback(async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch('/api/admin/ia/config', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) setConfig(data.config);
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  const loadThreads = useCallback(async () => {
    setLoadingThreads(true);
    try {
      const res = await fetch('/api/admin/ia/threads', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) {
        setStats(data.stats);
      }
    } finally {
      setLoadingThreads(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
    loadThreads();
  }, [loadConfig, loadThreads]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadThreads();
    }, 15000);
    return () => clearInterval(timer);
  }, [loadThreads]);

  function showToast(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    window.clearTimeout((showToast as any)._timer);
    (showToast as any)._timer = window.setTimeout(() => setMessage(null), 2800);
  }

  async function handleSaveConfig() {
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/ia/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'No se pudo guardar');
      setConfig(data.config);
      showToast('success', 'Configuración de Kenia guardada');
    } catch (error: any) {
      showToast('error', error?.message || 'No se pudo guardar la configuración');
    } finally {
      setSavingConfig(false);
    }
  }

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.10),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_44%,_#f8fafc_100%)] px-1 py-2 sm:px-3">
      <div className="mx-auto max-w-[1700px] space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-violet-100/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.3fr)_380px] lg:px-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Centro de control de Kenia
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">Admin IA</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                      Vista general de Kenia. Los canales de conversación viven separados para que todo quede limpio,
                      profesional y mucho más fácil de manejar.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    loadThreads();
                    loadConfig();
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingThreads || loadingConfig ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Conversaciones', value: stats.totalThreads, hint: `${stats.customerThreads} clientes`, icon: MessageCircle, tone: 'from-violet-500 to-indigo-500' },
                  { label: 'Sin leer', value: stats.unreadThreads, hint: 'esperando revisión', icon: AlertTriangle, tone: 'from-amber-500 to-orange-500' },
                  { label: 'Bloqueados', value: stats.blockedThreads, hint: `${stats.overLimitThreads} al límite`, icon: Shield, tone: 'from-rose-500 to-pink-500' },
                  { label: 'Tokens', value: compactNumber(stats.totalTokens), hint: 'consumo total', icon: Zap, tone: 'from-emerald-500 to-teal-500' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                        <p className="mt-3 text-2xl font-black tracking-[-0.03em] text-slate-900">{item.value}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-lg`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/admin/ia/whatsapp" className="group rounded-[26px] border border-emerald-200 bg-gradient-to-br from-[#e7fce9] via-white to-[#f4fff7] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Canal activo</p>
                      <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-900">WhatsApp Business</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Página dedicada estilo WhatsApp Web, verde y blanca, separada del resto del panel.
                      </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#25d366] text-white shadow-lg shadow-emerald-100">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <Bot className="h-3.5 w-3.5" />
                      Kenia conectada a conversaciones reales
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                      Abrir canal
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>

                <div className="rounded-[26px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Gobierno IA</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">WhatsApp admin</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">+{config.adminAlertPhone || 'Sin definir'}</p>
                    </div>
                    <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Límite por cliente</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{config.tokenLimitPerCustomer.toLocaleString('es-CL')} tokens</p>
                    </div>
                    <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Reporte automático</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{config.notifyOnEveryCustomerMessage ? 'Activo' : 'Solo manual'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Estado del motor</p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.03em]">Kenia Runtime</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-violet-100">
                  Última edición: {config.updatedAt ? formatDate(config.updatedAt) : 'Sin cambios'}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Prompt cliente</span>
                    <span className="font-semibold text-white">{compactNumber(config.customerPrompt.length)} chars</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400" style={{ width: `${Math.min(100, Math.round((config.customerPrompt.length / 4000) * 100))}%` }} />
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Prompt admin</span>
                    <span className="font-semibold text-white">{compactNumber(config.adminPrompt.length)} chars</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" style={{ width: `${Math.min(100, Math.round((config.adminPrompt.length / 4000) * 100))}%` }} />
                </div>
                <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                  Usa <code>{'{{SITE_URL}}'}</code> dentro del prompt si quieres que Kenia inserte automáticamente la URL pública de la tienda.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr),420px]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Canales</p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-900">Módulos de comunicación</h2>
                <p className="mt-1 text-sm text-slate-600">Cada canal tiene su propia página, sin mezclar chats con la vista principal.</p>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2">
                <Link href="/admin/ia/whatsapp" className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-[#e7fce9] via-white to-[#f4fff7] p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#25d366] text-white shadow-lg shadow-emerald-100">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-[-0.03em] text-slate-900">WhatsApp</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Chat completo de Kenia, tokens, bloqueo y prompt en una página dedicada.</p>
                </Link>
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-[-0.03em] text-slate-900">Próximos canales</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Aquí luego entran email, soporte interno, alertas privadas y más ideas tuyas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">System Prompt</p>
                  <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-900">Editor de Kenia</h3>
                </div>
                <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setPromptTab('customer')}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition ${promptTab === 'customer' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'}`}
                  >
                    Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromptTab('admin')}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition ${promptTab === 'admin' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {promptTab === 'customer' ? 'Prompt de ventas y atención' : 'Prompt administrativo'}
                  </label>
                  <textarea
                    value={promptTab === 'customer' ? config.customerPrompt : config.adminPrompt}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        [promptTab === 'customer' ? 'customerPrompt' : 'adminPrompt']: e.target.value,
                      }))
                    }
                    rows={12}
                    className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">WhatsApp tuyo</label>
                    <input
                      value={config.adminAlertPhone}
                      onChange={(e) => setConfig((prev) => ({ ...prev, adminAlertPhone: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:bg-white"
                      placeholder="569..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Límite tokens por cliente</label>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      value={config.tokenLimitPerCustomer}
                      onChange={(e) => setConfig((prev) => ({ ...prev, tokenLimitPerCustomer: Number(e.target.value || 0) }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Reportarme cada mensaje de cliente</p>
                    <p className="text-xs text-slate-500">Mantiene el comportamiento actual de alerta/reporte hacia tu WhatsApp.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifyOnEveryCustomerMessage}
                    onChange={(e) => setConfig((prev) => ({ ...prev, notifyOnEveryCustomerMessage: e.target.checked }))}
                    className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={savingConfig || loadingConfig}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Guardar configuración de Kenia
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Resumen en vivo</p>
                  <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-900">Estado del canal</h3>
                </div>
                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                  WhatsApp listo
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  { label: 'Conversaciones totales', value: stats.totalThreads, hint: `${stats.customerThreads} clientes activos` },
                  { label: 'Pendientes de revisar', value: stats.unreadThreads, hint: 'chats sin leer' },
                  { label: 'IA bloqueada', value: stats.blockedThreads, hint: `${stats.overLimitThreads} al límite` },
                  { label: 'Consumo total', value: compactNumber(stats.totalTokens), hint: 'tokens acumulados' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                    <p className="mt-1 text-lg font-black tracking-[-0.03em] text-slate-900">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {message && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl ${message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
            {message.text}
          </div>
        </div>
      )}
    </div>
  );
}
