'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Lock,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings2,
  Shield,
  Unlock,
} from 'lucide-react';

type ThreadSummary = {
  phone: string;
  displayName: string;
  preview: string;
  lastAt: string;
  totalMessages: number;
  unreadCount: number;
  customerMessages: number;
  adminMessages: number;
  segment: 'customer' | 'admin';
  blocked: boolean;
  tokenLimit: number;
  totalTokens: number;
  promptTokens: number;
  responseTokens: number;
  overLimit: boolean;
  lastUsageAt: string;
};

type ThreadMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
  readByAdmin: boolean;
  readByUser: boolean;
};

type KeniaConfig = {
  adminPrompt: string;
  customerPrompt: string;
  adminAlertPhone: string;
  tokenLimitPerCustomer: number;
  notifyOnEveryCustomerMessage: boolean;
  updatedAt: string;
  isEnabled?: boolean;
};

type ThreadDetail = {
  phone: string;
  messages: ThreadMessage[];
  usage: {
    phone: string;
    totalTokens: number;
    promptTokens: number;
    responseTokens: number;
    messageCount: number;
    blocked: boolean;
    updatedAt: string;
    overLimit: boolean;
    tokenLimit: number;
  };
};

const emptyConfig: KeniaConfig = {
  adminPrompt: '',
  customerPrompt: '',
  adminAlertPhone: '',
  tokenLimitPerCustomer: 15000,
  notifyOnEveryCustomerMessage: true,
  updatedAt: '',
  isEnabled: true,
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

function progressPct(value: number, max: number) {
  if (!max) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

export default function AdminIAWhatsAppPage() {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [stats, setStats] = useState({
    totalThreads: 0,
    customerThreads: 0,
    unreadThreads: 0,
    blockedThreads: 0,
    overLimitThreads: 0,
    totalTokens: 0,
  });
  const [selectedPhone, setSelectedPhone] = useState('');
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [config, setConfig] = useState<KeniaConfig>(emptyConfig);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [sending, setSending] = useState(false);
  const [savingBlock, setSavingBlock] = useState(false);
  const [promptTab, setPromptTab] = useState<'customer' | 'admin'>('customer');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const selectedPhoneRef = useRef('');
  const threadRequestRef = useRef(0);
  const threadsRequestRef = useRef(0);

  const selectedSummary = useMemo(
    () => threads.find((item) => item.phone === selectedPhone) || null,
    [threads, selectedPhone]
  );

  useEffect(() => {
    selectedPhoneRef.current = selectedPhone;
  }, [selectedPhone]);

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

  const loadThreads = useCallback(async (keepSelection = true) => {
    setLoadingThreads(true);
    const requestId = ++threadsRequestRef.current;
    try {
      const query = search ? `?q=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/ia/threads${query}`, { cache: 'no-store' });
      const data = await res.json();
      if (requestId !== threadsRequestRef.current) return;
      if (data?.success) {
        const nextThreads = data.threads as ThreadSummary[];
        setThreads(nextThreads);
        setStats(data.stats);
        const currentSelected = selectedPhoneRef.current;
        if ((!keepSelection || !currentSelected) && nextThreads[0]) {
          setSelectedPhone(nextThreads[0].phone);
        } else if (currentSelected && !nextThreads.some((item) => item.phone === currentSelected)) {
          setSelectedPhone(nextThreads[0]?.phone || '');
        }
      }
    } finally {
      if (requestId === threadsRequestRef.current) setLoadingThreads(false);
    }
  }, [search]);

  const loadThread = useCallback(async (phone: string) => {
    if (!phone) return;
    const requestId = ++threadRequestRef.current;
    setLoadingThread(true);
    setThread(null);
    try {
      const res = await fetch(`/api/admin/ia/thread?phone=${encodeURIComponent(phone)}`, { cache: 'no-store' });
      const data = await res.json();
      if (requestId !== threadRequestRef.current) return;
      if (data?.success) {
        setThread(data.thread);
      }
    } finally {
      if (requestId === threadRequestRef.current) setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    loadThreads(false);
  }, [loadThreads]);

  useEffect(() => {
    setDraft('');
    if (selectedPhone) loadThread(selectedPhone);
  }, [selectedPhone, loadThread]);



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

  async function saveKeniaStatusDirectly(newValue: boolean) {
    const next = { ...config, isEnabled: newValue };
    try {
      const res = await fetch('/api/admin/ia/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (data?.success) {
        setConfig(data.config);
        showToast('success', newValue ? 'Kenia ha sido activada 🟢' : 'Kenia ha sido desactivada 🔴');
      } else {
        showToast('error', 'No se pudo cambiar el estado de Kenia');
      }
    } catch {
      showToast('error', 'Error al cambiar el estado de Kenia');
    }
  }

  async function handleSend() {
    if (!selectedPhone || !draft.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/admin/ia/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selectedPhone, text: draft.trim() }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'No se pudo enviar');
      setDraft('');
      await loadThread(selectedPhone);
      await loadThreads(true);
      showToast('success', 'Mensaje enviado por WhatsApp');
    } catch (error: any) {
      showToast('error', error?.message || 'No se pudo enviar el mensaje');
    } finally {
      setSending(false);
    }
  }

  async function handleToggleBlock() {
    if (!selectedPhone) return;
    setSavingBlock(true);
    try {
      const res = await fetch('/api/admin/ia/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selectedPhone, blocked: !thread?.usage.blocked }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'No se pudo actualizar');
      await loadThread(selectedPhone);
      await loadThreads(true);
      showToast('success', data.usage?.blocked ? 'Cliente bloqueado para IA' : 'Cliente reactivado para IA');
    } catch (error: any) {
      showToast('error', error?.message || 'No se pudo actualizar el bloqueo');
    } finally {
      setSavingBlock(false);
    }
  }

  const usagePct = progressPct(thread?.usage.totalTokens || 0, thread?.usage.tokenLimit || config.tokenLimitPerCustomer);

  return (
    <div className="min-h-full bg-[#efeae2] px-0 py-0">
      <div className="mx-auto flex min-h-[calc(100dvh-96px)] max-w-[1700px] flex-col overflow-hidden rounded-[26px] border border-[#d9dbd7] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:min-h-[calc(100dvh-120px)]">
        <div className="border-b border-[#d9dbd7] bg-[#f0f2f5] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/ia"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#54656f] transition hover:bg-[#e9edef]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25d366] text-white shadow-sm">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667781]">Canal activo</p>
                <h1 className="text-xl font-black tracking-[-0.03em] text-[#111b21]">WhatsApp Business</h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Chats', value: stats.totalThreads },
                { label: 'Sin leer', value: stats.unreadThreads },
                { label: 'Bloqueados', value: stats.blockedThreads },
                { label: 'Tokens', value: compactNumber(stats.totalTokens) },
              ].map((item) => (
                <div key={item.label} className="rounded-full border border-[#d9dbd7] bg-white px-3 py-1.5 text-xs text-[#54656f]">
                  <span className="font-bold text-[#111b21]">{item.value}</span> {item.label}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  loadThreads(true);
                  if (selectedPhone) loadThread(selectedPhone);
                  loadConfig();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
              >
                <RefreshCw className={`h-4 w-4 ${loadingThreads || loadingThread || loadingConfig ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[360px,minmax(0,1fr),380px]">
          <aside className="min-h-0 border-r border-[#d9dbd7] bg-white">
            <div className="border-b border-[#d9dbd7] bg-[#f0f2f5] px-4 py-3">
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2">
                <Search className="h-4 w-4 text-[#667781]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') loadThreads(false);
                  }}
                  className="w-full bg-transparent text-sm text-[#111b21] outline-none placeholder:text-[#667781]"
                  placeholder="Buscar por número o mensaje..."
                />
              </div>
            </div>

            <div className="max-h-[calc(100dvh-240px)] overflow-y-auto lg:max-h-none lg:h-full">
              {loadingThreads ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-5 w-5 animate-spin text-[#25d366]" />
                </div>
              ) : threads.length === 0 ? (
                <div className="px-6 py-16 text-center text-[#667781]">
                  <MessageCircle className="mx-auto h-10 w-10 text-[#c7d0d6]" />
                  <p className="mt-3 text-sm font-semibold">No encontré conversaciones</p>
                </div>
              ) : (
                threads.map((item) => {
                  const active = item.phone === selectedPhone;
                  return (
                    <button
                      key={item.phone}
                      type="button"
                      onClick={() => setSelectedPhone(item.phone)}
                      className={`w-full border-b border-[#eef1f3] px-4 py-3 text-left transition ${active ? 'bg-[#f0f2f5]' : 'bg-white hover:bg-[#f5f6f6]'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-black ${item.segment === 'admin' ? 'bg-[#111b21] text-white' : 'bg-[#dff6e7] text-[#128c7e]'}`}>
                          {item.segment === 'admin' ? 'AD' : item.phone.slice(-2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-[#111b21]">{item.displayName}</p>
                            <p className="shrink-0 text-[11px] text-[#667781]">{formatDate(item.lastAt)}</p>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#667781]">{item.preview || 'Sin mensaje'}</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.segment === 'admin' ? 'bg-[#e9edef] text-[#54656f]' : 'bg-[#dff6e7] text-[#128c7e]'}`}>
                                {item.segment === 'admin' ? 'Admin' : 'Cliente'}
                              </span>
                              {item.blocked && (
                                <span className="rounded-full bg-[#ffe1e1] px-2 py-0.5 text-[10px] font-bold text-[#d93025]">
                                  Bloqueado
                                </span>
                              )}
                            </div>
                            {item.unreadCount > 0 && (
                              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#25d366] px-2 py-0.5 text-[11px] font-bold text-white">
                                {item.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="min-h-0 bg-[#efeae2] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23d4d5d4%22 fill-opacity=%220.32%22%3E%3Cpath d=%22M36 34h-4v-4h4v4zm0-30h-4v4h4V4zM6 34H2v-4h4v4zm0-30H2v4h4V4zm30 56h-4v-4h4v4zM6 60H2v-4h4v4zm54-26h-4v-4h4v4zm0-30h-4v4h4V4zM30 34h-4v-4h4v4zm0-30h-4v4h4V4zm0 56h-4v-4h4v4zM60 60h-4v-4h4v4zm-30 0h-4v-4h4v4zm0-26h-4v-4h4v4z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
            <div className="flex h-full min-h-[520px] flex-col">
              <div className="border-b border-[#d9dbd7] bg-[#f0f2f5] px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-[#111b21]">
                      {selectedSummary ? `+${selectedSummary.phone}` : 'Selecciona una conversación'}
                    </p>
                    <p className="mt-0.5 text-xs text-[#667781]">
                      {selectedSummary
                        ? `${selectedSummary.totalMessages} mensajes · ${selectedSummary.totalTokens.toLocaleString('es-CL')} tokens`
                        : 'Abre un chat desde la columna izquierda'}
                    </p>
                  </div>
                  {selectedSummary?.blocked && (
                    <span className="rounded-full bg-[#ffe1e1] px-3 py-1 text-xs font-bold text-[#d93025]">
                      IA bloqueada
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                {!selectedPhone ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-3xl bg-white/70 px-8 py-10 text-center shadow-sm backdrop-blur-sm">
                      <MessageCircle className="mx-auto h-10 w-10 text-[#bcc5ca]" />
                      <p className="mt-4 text-sm font-semibold text-[#54656f]">Elige una conversación para abrir el canal de Kenia</p>
                    </div>
                  </div>
                ) : loadingThread ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[#25d366]" />
                  </div>
                ) : thread?.messages.length ? (
                  <div className="space-y-2.5">
                    {thread.messages.map((msg) => {
                      const mine = msg.role === 'assistant';
                      return (
                        <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[88%] rounded-lg px-3.5 py-2.5 shadow-sm sm:max-w-[76%] ${
                              mine
                                ? 'bg-[#d9fdd3] text-[#111b21]'
                                : 'bg-white text-[#111b21]'
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-[14px] leading-6">{msg.text}</p>
                            <div className="mt-1.5 text-right text-[10px] text-[#667781]">
                              {formatDate(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-3xl bg-white/70 px-8 py-10 text-center shadow-sm backdrop-blur-sm">
                      <MessageCircle className="mx-auto h-10 w-10 text-[#bcc5ca]" />
                      <p className="mt-4 text-sm font-semibold text-[#54656f]">Esta conversación todavía no tiene historial</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#d9dbd7] bg-[#f0f2f5] px-4 py-3">
                <div className="flex items-end gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={2}
                    placeholder="Escribe como Kenia y envía por WhatsApp..."
                    className="min-h-[48px] flex-1 resize-none bg-transparent text-sm leading-6 text-[#111b21] outline-none placeholder:text-[#8696a0]"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!selectedPhone || !draft.trim() || sending}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25d366] text-white transition hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-2 px-1 text-xs text-[#667781]">Enter para enviar, Shift + Enter para salto de línea</p>
              </div>
            </div>
          </section>

          <aside className="min-h-0 border-l border-[#d9dbd7] bg-[#f7f8fa]">
            <div className="flex items-center gap-2 border-b border-[#d9dbd7] bg-[#f0f2f5] px-5 py-4">
              <Settings2 className="h-4 w-4 text-[#667781]" />
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#54656f]">Panel Kenia</h2>
            </div>

            <div className="max-h-[calc(100dvh-240px)] space-y-4 overflow-y-auto px-4 py-4 lg:max-h-none lg:h-full">
              <div className="rounded-[22px] border border-[#d9dbd7] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#667781]">Gobierno de Kenia</p>
                    <p className="mt-1 text-sm font-bold text-[#111b21]">
                      {config.isEnabled !== false ? '🟢 Activa' : '🔴 Apagada'}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={config.isEnabled !== false}
                      onChange={(e) => {
                        saveKeniaStatusDirectly(e.target.checked);
                      }}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#25d366] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
                  </label>
                </div>
                {config.isEnabled === false && (
                  <p className="mt-2 text-xs text-[#d93025] leading-normal font-semibold">
                    ⚠️ Kenia está en modo mantenimiento. Responderá con aviso de mantenimiento solo una vez por cliente.
                  </p>
                )}
              </div>

              <div className="rounded-[22px] border border-[#d9dbd7] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#667781]">Cliente</p>
                    <p className="mt-1 text-base font-bold text-[#111b21]">{selectedSummary ? `+${selectedSummary.phone}` : 'Sin selección'}</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-bold ${thread?.usage.blocked ? 'bg-[#ffe1e1] text-[#d93025]' : 'bg-[#dff6e7] text-[#128c7e]'}`}>
                    {thread?.usage.blocked ? 'Bloqueado' : 'Activo'}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#54656f]">Uso actual</span>
                    <span className="font-bold text-[#111b21]">
                      {thread ? `${thread.usage.totalTokens.toLocaleString('es-CL')} / ${thread.usage.tokenLimit.toLocaleString('es-CL')}` : '0 / 0'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d9dbd7]">
                    <div
                      className={`h-full rounded-full ${usagePct >= 100 ? 'bg-[#ff6b6b]' : 'bg-[#25d366]'}`}
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-2xl bg-[#f7f8fa] px-3 py-2 text-[#54656f]">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8696a0]">Prompt</span>
                      <span className="mt-1 block font-semibold text-[#111b21]">{thread?.usage.promptTokens.toLocaleString('es-CL') || 0}</span>
                    </div>
                    <div className="rounded-2xl bg-[#f7f8fa] px-3 py-2 text-[#54656f]">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8696a0]">Respuesta</span>
                      <span className="mt-1 block font-semibold text-[#111b21]">{thread?.usage.responseTokens.toLocaleString('es-CL') || 0}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleBlock}
                  disabled={!selectedPhone || savingBlock}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    thread?.usage.blocked
                      ? 'bg-[#25d366] text-white hover:bg-[#20bd5a]'
                      : 'bg-[#ff6b6b] text-white hover:bg-[#ef5b5b]'
                  }`}
                >
                  {savingBlock ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : thread?.usage.blocked ? (
                    <Unlock className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  {thread?.usage.blocked ? 'Reactivar IA' : 'Bloquear IA'}
                </button>
              </div>

              <div className="rounded-[22px] border border-[#d9dbd7] bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#667781]">Prompt</p>
                    <h3 className="mt-1 text-base font-bold text-[#111b21]">Editor de Kenia</h3>
                  </div>
                  <div className="inline-flex rounded-full bg-[#f0f2f5] p-1">
                    <button
                      type="button"
                      onClick={() => setPromptTab('customer')}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${promptTab === 'customer' ? 'bg-white text-[#111b21] shadow-sm' : 'text-[#667781]'}`}
                    >
                      Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptTab('admin')}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${promptTab === 'admin' ? 'bg-white text-[#111b21] shadow-sm' : 'text-[#667781]'}`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <textarea
                  value={promptTab === 'customer' ? config.customerPrompt : config.adminPrompt}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      [promptTab === 'customer' ? 'customerPrompt' : 'adminPrompt']: e.target.value,
                    }))
                  }
                  rows={8}
                  className="w-full rounded-[18px] border border-[#d9dbd7] bg-[#f7f8fa] px-4 py-3 text-sm leading-6 text-[#111b21] outline-none transition focus:border-[#25d366] focus:bg-white"
                />

                <div className="mt-4 grid gap-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#8696a0]">WhatsApp tuyo</label>
                    <input
                      value={config.adminAlertPhone}
                      onChange={(e) => setConfig((prev) => ({ ...prev, adminAlertPhone: e.target.value }))}
                      className="w-full rounded-2xl border border-[#d9dbd7] bg-[#f7f8fa] px-4 py-3 text-sm outline-none transition focus:border-[#25d366] focus:bg-white"
                      placeholder="569..."
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#8696a0]">Límite tokens por cliente</label>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      value={config.tokenLimitPerCustomer}
                      onChange={(e) => setConfig((prev) => ({ ...prev, tokenLimitPerCustomer: Number(e.target.value || 0) }))}
                      className="w-full rounded-2xl border border-[#d9dbd7] bg-[#f7f8fa] px-4 py-3 text-sm outline-none transition focus:border-[#25d366] focus:bg-white"
                    />
                  </div>
                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#d9dbd7] bg-[#f7f8fa] px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111b21]">Reportarme cada mensaje</p>
                      <p className="text-xs text-[#667781]">Deja activo el aviso al WhatsApp administrador.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.notifyOnEveryCustomerMessage}
                      onChange={(e) => setConfig((prev) => ({ ...prev, notifyOnEveryCustomerMessage: e.target.checked }))}
                      className="h-5 w-5 rounded border-[#bcc5ca] text-[#25d366] focus:ring-[#25d366]"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={savingConfig || loadingConfig}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25d366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Guardar configuración
                </button>

                <div className="mt-4 rounded-2xl bg-[#e7fce9] px-4 py-3 text-xs leading-5 text-[#128c7e]">
                  Usa <code>{'{{SITE_URL}}'}</code> dentro del prompt si quieres que Kenia inserte automáticamente la URL pública de la tienda.
                </div>
              </div>

              <div className="rounded-[22px] border border-[#d9dbd7] bg-white p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#128c7e]" />
                  <p className="text-sm font-bold text-[#111b21]">Estado inteligente</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#54656f]">
                  {thread?.usage.overLimit
                    ? 'Este cliente ya superó el límite global de tokens. Puedes bloquearlo o subir el límite.'
                    : 'Kenia sigue respondiendo con normalidad en este hilo.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl ${message.type === 'success' ? 'bg-[#25d366] text-white' : 'bg-[#ff6b6b] text-white'}`}>
            {message.text}
          </div>
        </div>
      )}
    </div>
  );
}
