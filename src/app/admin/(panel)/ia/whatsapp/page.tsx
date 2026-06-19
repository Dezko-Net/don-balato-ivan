'use client';
/* Kenia WhatsApp Business Admin - Full-screen WhatsApp Web clone
   100dvh, no margins, responsive mobile with view switching */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Bot,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Loader2,
  Lock,
  MessageCircle,
  MoreVertical,
  Package,
  Phone,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings2,
  Shield,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Unlock,
  User,
  UserCheck,
  X,
  Zap,
  Filter,
} from 'lucide-react';

type OrderDetail = {
  id: string;
  code: string;
  status: string;
  total: number;
  date: string;
  items: string;
};

type CustomerInfo = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  orderCount: number;
  totalSpent: number;
  registered: boolean;
  orders?: OrderDetail[];
};

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
  adminTakeover?: boolean;
  escalated?: boolean;
  spamBlocked?: boolean;
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

type FilterTab = 'all' | 'unread' | 'blocked' | 'escalated';

type KeniaConfig = {
  adminPrompt: string;
  customerPrompt: string;
  adminAlertPhone: string;
  tokenLimitPerCustomer: number;
  smartNotifications: boolean;
  messageThresholdForPause: number;
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
    adminTakeover?: boolean;
    escalated?: boolean;
    spamBlocked?: boolean;
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
  smartNotifications: true,
  messageThresholdForPause: 10,
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

function formatRelativeDate(value: string) {
  if (!value) return '';
  try {
    const d = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return d.toLocaleString('es-CL', { timeStyle: 'short' });
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return d.toLocaleString('es-CL', { weekday: 'short' });
    return d.toLocaleString('es-CL', { day: '2-digit', month: '2-digit' });
  } catch {
    return value;
  }
}

function getInitials(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-2);
}

function compactNumber(value: number) {
  return new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0);
}

function progressPct(value: number, max: number) {
  if (!max) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

/* --- Avatar color palette --- */
const AVATAR_COLORS = [
  ['#dff6e7','#128c7e'],['#e8f4fd','#0078d4'],['#fef3e2','#d97706'],
  ['#fce7f3','#be185d'],['#ede9fe','#7c3aed'],['#fef9c3','#854d0e'],
];
function getAvatarColors(phone: string) {
  const n = phone.replace(/\D/g,'').split('').reduce((a,c)=>a+parseInt(c),0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
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
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [customerMap, setCustomerMap] = useState<Record<string, CustomerInfo>>({});
  const [showOrdersPanel, setShowOrdersPanel] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | { type: 'clear' | 'delete'; phone: string }>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const selectedPhoneRef = useRef('');
  const threadRequestRef = useRef(0);
  const threadsRequestRef = useRef(0);

  const selectedSummary = useMemo(
    () => threads.find((item) => item.phone === selectedPhone) || null,
    [threads, selectedPhone]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    if (!loadingThread && thread?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread, loadingThread]);

  function handleChatScroll() {
    const el = chatScrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 160);
  }

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
        // Enrich threads with customer data from DB
        if (nextThreads.length > 0) {
          const phones = nextThreads
            .filter(t => t.segment === 'customer')
            .map(t => t.phone)
            .join(',');
          if (phones) {
            fetch(`/api/admin/ia/customer-lookup?phones=${encodeURIComponent(phones)}`, { cache: 'no-store' })
              .then(r => r.json())
              .then(d => { if (d?.customers) setCustomerMap(prev => ({ ...prev, ...d.customers })); })
              .catch(() => {});
          }
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
    setShowOrdersPanel(false);
    if (selectedPhone) loadThread(selectedPhone);
  }, [selectedPhone, loadThread]);



  function showToast(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    window.clearTimeout((showToast as any)._timer);
    (showToast as any)._timer = window.setTimeout(() => setMessage(null), 2800);
  }

  async function handleSetBlock(blocked: boolean, reason?: 'admin_takeover' | 'spam' | 'manual') {
    if (!selectedPhone) return;
    setSavingBlock(true);
    try {
      const res = await fetch('/api/admin/ia/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selectedPhone, blocked, reason }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'No se pudo actualizar');
      await loadThread(selectedPhone);
      await loadThreads(true);
      
      let msgText = 'Cliente reactivado para IA';
      if (blocked) {
        if (reason === 'admin_takeover') msgText = 'Has tomado el control del chat';
        else if (reason === 'spam') msgText = 'Cliente bloqueado por spam';
        else msgText = 'Cliente bloqueado para IA';
      }
      showToast('success', msgText);
    } catch (error: any) {
      showToast('error', error?.message || 'No se pudo actualizar el estado del chat');
    } finally {
      setSavingBlock(false);
    }
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
        showToast('success', newValue ? 'Kenia activada' : 'Kenia desactivada');
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

  async function handleClearHistory(phone: string) {
    setConfirmAction(null);
    try {
      const res = await fetch('/api/admin/ia/clear-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, deleteUsage: false }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'Error');
      await loadThread(phone);
      showToast('success', 'Historial borrado');
    } catch (e: any) {
      showToast('error', e?.message || 'No se pudo borrar el historial');
    }
  }

  async function handleDeleteThread(phone: string) {
    setConfirmAction(null);
    try {
      const res = await fetch('/api/admin/ia/delete-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'Error');
      setCustomerMap(prev => { const n = { ...prev }; delete n[phone]; return n; });
      setSelectedPhone('');
      setThread(null);
      setShowOrdersPanel(false);
      await loadThreads(false);
      showToast('success', 'Conversación eliminada completamente');
    } catch (e: any) {
      showToast('error', e?.message || 'No se pudo eliminar');
    }
  }

  async function handleLoadOrders(phone: string) {
    const existing = customerMap[phone];
    if (existing?.orders) { setShowOrdersPanel(true); return; }
    setLoadingOrders(true);
    setShowOrdersPanel(true);
    try {
      const res = await fetch(`/api/admin/ia/customer-lookup?phones=${encodeURIComponent(phone)}&detail=true`, { cache: 'no-store' });
      const data = await res.json();
      if (data?.customers?.[phone]) {
        setCustomerMap(prev => ({ ...prev, [phone]: { ...(prev[phone] || data.customers[phone]), ...data.customers[phone] } }));
      }
    } catch { /* ignore */ } finally {
      setLoadingOrders(false);
    }
  }

  const usagePct = progressPct(thread?.usage.totalTokens || 0, thread?.usage.tokenLimit || config.tokenLimitPerCustomer);
  const usageColor = usagePct >= 100 ? '#ef4444' : usagePct >= 75 ? '#f59e0b' : '#25d366';

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      if (filterTab === 'unread') return t.unreadCount > 0;
      if (filterTab === 'blocked') return t.blocked;
      if (filterTab === 'escalated') return t.escalated;
      return true;
    });
  }, [threads, filterTab]);

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#111b21', overflow: 'hidden' }}>
      <style>{`
        @keyframes meshShift {
          0% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(3%, -2%) scale(1.08); }
          66% { transform: translate(-2%, 3%) scale(1.05); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes orbA {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(50px, -40px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(-30px, 30px) scale(0.85); opacity: 0.4; }
          75% { transform: translate(20px, 50px) scale(1.1); opacity: 0.6; }
        }
        @keyframes orbB {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(-60px, 50px) scale(1.3); opacity: 0.55; }
        }
        @keyframes orbC {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          40% { transform: translate(40px, 60px) scale(1.15); opacity: 0.45; }
          80% { transform: translate(-50px, -30px) scale(0.9); opacity: 0.25; }
        }
        @keyframes orbD {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(70px, -50px) scale(1.25); opacity: 0.35; }
        }
        @keyframes orbE {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          33% { transform: translate(-40px, 40px) scale(1.1); opacity: 0.4; }
          66% { transform: translate(30px, -20px) scale(0.95); opacity: 0.2; }
        }
        @keyframes shimmer {
          0% { opacity: 0; }
          50% { opacity: 0.03; }
          100% { opacity: 0; }
        }
        .wa-animated-bg {
          background-color: #080d12;
          position: relative;
          overflow: hidden;
        }
        /* Layer 1: Deep gradient mesh — 7 color points */
        .wa-animated-bg::before {
          content: "";
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(ellipse 60% 50% at 15% 15%, rgba(0, 168, 132, 0.10) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 85% 75%, rgba(0, 114, 177, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 50% 40%, rgba(20, 30, 40, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 35% 35% at 92% 8%, rgba(0, 168, 132, 0.05) 0%, transparent 45%),
            radial-gradient(ellipse 45% 35% at 8% 92%, rgba(25, 35, 50, 0.45) 0%, transparent 55%),
            radial-gradient(ellipse 30% 30% at 60% 20%, rgba(0, 100, 80, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse 35% 45% at 30% 70%, rgba(15, 25, 45, 0.4) 0%, transparent 55%);
          animation: meshShift 30s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        /* Layer 2: Detailed SVG doodle pattern — WhatsApp-style icons */
        .wa-animated-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.7' opacity='0.022'%3E%3C!-- Chat bubble --%3E%3Cpath d='M20 20c8 0 14 5 14 13 0 7-6 13-14 13-2 0-4 0-6-1l-6 2 2-6c-1-2-2-5-2-8 0-8 6-13 12-13z'/%3E%3C!-- Phone --%3E%3Crect x='45' y='12' width='12' height='20' rx='3'/%3E%3Ccircle cx='51' cy='28' r='1.5'/%3E%3C!-- Heart --%3E%3Cpath d='M80 18c2-3 7-3 9 0 2 3 0 7-4 10-4-3-7-7-5-10z'/%3E%3C!-- Camera --%3E%3Crect x='105' y='15' width='18' height='14' rx='2'/%3E%3Ccircle cx='114' cy='22' r='4'/%3E%3Cpath d='M108 15l2-3h8l2 3'/%3E%3C!-- Check double --%3E%3Cpath d='M140 22l4 4 8-8' stroke-linecap='round'/%3E%3Cpath d='M148 22l4 4 8-8' stroke-linecap='round'/%3E%3C!-- Star --%3E%3Cpath d='M175 14l2 5 5 0-4 3 2 5-5-3-5 3 2-5-4-3 5 0z'/%3E%3C!-- Smile --%3E%3Ccircle cx='20' cy='55' r='8'/%3E%3Cpath d='M16 53c1-1 2-1 3 0'/%3E%3Cpath d='M22 53c1-1 2-1 3 0'/%3E%3Cpath d='M15 58c2 2 5 3 8 1' stroke-linecap='round'/%3E%3C!-- Paperclip --%3E%3Cpath d='M48 48c3-3 7-3 10 0l5 5c2 2 2 5 0 7s-5 2-7 0l-5-5c-1-1-1-3 0-4s3-1 4 0l4 4' stroke-linecap='round'/%3E%3C!-- Mic --%3E%3Crect x='78' y='48' width='6' height='12' rx='3'/%3E%3Cpath d='M75 56c0 4 3 7 6 7s6-3 6-7'/%3E%3Cpath d='M81 63v3'/%3E%3C!-- Send arrow --%3E%3Cpath d='M110 50l10-5-5 10-2-4z'/%3E%3C!-- Bell --%3E%3Cpath d='M140 45c4 0 7 3 7 7v3l2 3h-18l2-3v-3c0-4 3-7 7-7z'/%3E%3Cpath d='M137 60c0 2 3 2 3 0'/%3E%3C!-- Lock --%3E%3Crect x='170' y='50' width='10' height='8' rx='1'/%3E%3Cpath d='M172 50v-2c0-2 2-4 4-4s4 2 4 4v2'/%3E%3C!-- Globe --%3E%3Ccircle cx='20' cy='90' r='8'/%3E%3Cpath d='M12 90h16'/%3E%3Cpath d='M20 82c4 3 4 13 0 16'/%3E%3Cpath d='M20 82c-4 3-4 13 0 16'/%3E%3C!-- Mail --%3E%3Crect x='42' y='85' width='16' height='11' rx='1'/%3E%3Cpath d='M42 86l8 6 8-6'/%3E%3C!-- Calendar --%3E%3Crect x='72' y='82' width='14' height='12' rx='1'/%3E%3Cpath d='M72 86h14'/%3E%3Cpath d='M76 82v-2'/%3E%3Cpath d='M82 82v-2'/%3E%3C!-- Clock --%3E%3Ccircle cx='108' cy='90' r='7'/%3E%3Cpath d='M108 86v4l3 2' stroke-linecap='round'/%3E%3C!-- Location pin --%3E%3Cpath d='M135 82c4 0 7 3 7 7 0 5-7 12-7 12s-7-7-7-12c0-4 3-7 7-7z'/%3E%3Ccircle cx='135' cy='89' r='2.5'/%3E%3C!-- Settings gear --%3E%3Ccircle cx='165' cy='90' r='5'/%3E%3Cpath d='M165 82v3M165 95v3M158 90h3M169 90h3M161 84l2 2M169 96l-2-2M169 84l-2 2M161 96l2-2'/%3E%3C!-- Search --%3E%3Ccircle cx='188' cy='88' r='5'/%3E%3Cpath d='M192 92l4 4' stroke-linecap='round'/%3E%3C!-- Lightning --%3E%3Cpath d='M15 125l5-8 3 5 4-3-5 8-3-5z'/%3E%3C!-- Shield --%3E%3Cpath d='M45 118l8-3 8 3v6c0 5-4 8-8 10-4-2-8-5-8-10z'/%3E%3Cpath d='M49 124l3 3 5-5' stroke-linecap='round'/%3E%3C!-- Shopping bag --%3E%3Cpath d='M78 115h10l2 12h-14z'/%3E%3Cpath d='M80 115v-3c0-2 2-4 4-4s4 2 4 4v3'/%3E%3C!-- Tag --%3E%3Cpath d='M110 112l8-3 3 8-8 8-8-8z'/%3E%3Ccircle cx='113' cy='115' r='1.5'/%3E%3C!-- Gift --%3E%3Crect x='138' y='118' width='14' height='10' rx='1'/%3E%3Cpath d='M138 119c0-3 3-5 7-5s7 2 7 5'/%3E%3Cpath d='M145 114v14'/%3E%3C!-- Eye --%3E%3Cpath d='M172 118c5 0 9 4 9 7s-4 7-9 7-9-4-9-7 4-7 9-7z'/%3E%3Ccircle cx='172' cy='125' r='3'/%3E%3C!-- Thumb up --%3E%3Cpath d='M18 155c2 0 3 1 3 3v5c0 2-1 3-3 3h-3v-11z'/%3E%3Cpath d='M15 155v11h-3v-11z'/%3E%3C!-- Chat dots --%3E%3Ccircle cx='45' cy='155' r='2'/%3E%3Ccircle cx='52' cy='155' r='2'/%3E%3Ccircle cx='59' cy='155' r='2'/%3E%3C!-- Plus circle --%3E%3Ccircle cx='85' cy='155' r='7'/%3E%3Cpath d='M85 151v8M81 155h8'/%3E%3C!-- Bookmark --%3E%3Cpath d='M115 148v12l5-4 5 4v-12z'/%3E%3C!-- Flag --%3E%3Cpath d='M140 148v14'/%3E%3Cpath d='M140 149h10l-2 3 2 3h-10'/%3E%3C!-- Cloud --%3E%3Cpath d='M168 158c4 0 7-3 7-6 0-4-3-6-6-6-1-3-4-5-7-5-4 0-7 3-7 7-3 0-5 2-5 5s2 5 5 5z'/%3E%3C!-- Wifi --%3E%3Cpath d='M15 185c5-5 13-5 18 0'/%3E%3Cpath d='M18 188c3-3 9-3 12 0'/%3E%3Ccircle cx='24' cy='192' r='1.5'/%3E%3C!-- Battery --%3E%3Crect x='48' y='180' width='14' height='8' rx='1'/%3E%3Crect x='62' y='182' width='2' height='4'/%3E%3Cpath d='M51 184h8'/%3E%3C!-- Key --%3E%3Ccircle cx='80' cy='185' r='4'/%3E%3Cpath d='M84 185h10M90 185v3M93 185v3'/%3E%3C!-- Crown --%3E%3Cpath d='M110 180l3 8h10l3-8-5 4-3-6-3 6z'/%3E%3C!-- Fire --%3E%3Cpath d='M140 175c3 3 5 6 5 10 0 4-3 7-6 7s-5-3-5-6c0-2 1-4 3-5-1 3 1 4 3 4 0-3-1-6 0-10z'/%3E%3C!-- Rocket --%3E%3Cpath d='M170 175c3-3 8-3 11 0 3 3 3 8 0 11l-5 5-6-6z'/%3E%3Ccircle cx='176' cy='180' r='2'/%3E%3C!-- Coffee --%3E%3Cpath d='M18 215v8c0 3 2 5 5 5h6c3 0 5-2 5-5v-8z'/%3E%3Cpath d='M34 218h3v4h-3z'/%3E%3Cpath d='M22 210c0 2 2 3 2 5'/%3E%3Cpath d='M27 210c0 2 2 3 2 5'/%3E%3C!-- Music note --%3E%3Ccircle cx='55' cy='218' r='3'/%3E%3Cpath d='M58 218v-8l5-1v8'/%3E%3C!-- Camera --%3E%3Ccircle cx='85' cy='215' r='6'/%3E%3Ccircle cx='85' cy='215' r='3'/%3E%3C!-- Link --%3E%3Cpath d='M112 212l4-4c2-2 5-2 7 0s2 5 0 7l-4 4'/%3E%3Cpath d='M120 220l-4 4c-2 2-5 2-7 0s-2-5 0-7l4-4'/%3E%3C!-- Sun --%3E%3Ccircle cx='150' cy='215' r='4'/%3E%3Cpath d='M150 207v3M150 220v3M143 215h3M154 215h3M145 210l2 2M155 220l-2-2M155 210l-2 2M145 220l2-2'/%3E%3C!-- Moon --%3E%3Cpath d='M175 210c5 0 9 4 9 9s-4 9-9 9c3-2 5-5 5-9s-2-7-5-9z'/%3E%3C!-- Users --%3E%3Ccircle cx='20' cy='245' r='4'/%3E%3Cpath d='M14 255c0-4 3-7 6-7s6 3 6 7'/%3E%3Ccircle cx='32' cy='248' r='3'/%3E%3Cpath d='M30 255c0-3 2-5 4-5'/%3E%3C!-- Message --%3E%3Cpath d='M50 240h14c2 0 3 1 3 3v6c0 2-1 3-3 3h-8l-4 3v-3h-2c-2 0-3-1-3-3v-6c0-2 1-3 3-3z'/%3E%3C!-- Phone call --%3E%3Cpath d='M82 240c2 0 4 2 4 4l-3 3c1 3 3 5 6 6l3-3c2 0 4 2 4 4v4c-8 0-18-10-18-18z'/%3E%3C!-- Video --%3E%3Crect x='110' y='240' width='12' height='10' rx='1'/%3E%3Cpath d='M122 243l5-3v10l-5-3z'/%3E%3C!-- Image --%3E%3Crect x='140' y='238' width='14' height='12' rx='1'/%3E%3Ccircle cx='145' cy='243' r='1.5'/%3E%3Cpath d='M140 248l4-3 4 3 3-2 3 4z'/%3E%3C!-- File --%3E%3Cpath d='M172 238h7l4 4v10h-11z'/%3E%3Cpath d='M179 238v4h4'/%3E%3C!-- Trophy --%3E%3Cpath d='M18 275h8v4h-8z'/%3E%3Cpath d='M16 275v-4h12v4c0 3-3 5-6 5s-6-2-6-5z'/%3E%3Cpath d='M14 273h-3v-2h3M28 273h3v-2h-3'/%3E%3C!-- Target --%3E%3Ccircle cx='50' cy='278' r='7'/%3E%3Ccircle cx='50' cy='278' r='4'/%3E%3Ccircle cx='50' cy='278' r='1.5'/%3E%3C!-- Compass --%3E%3Ccircle cx='80' cy='278' r='7'/%3E%3Cpath d='M80 273l3 5-3 5-3-5z'/%3E%3C!-- Puzzle --%3E%3Cpath d='M108 273h6c1 0 2 1 2 2v3c0 1 1 2 2 2s2-1 2-2v-3c0-1 1-2 2-2h6v6c0 1 1 2 2 2s2-1 2-2 2-2c1 0 2 1 2 2v6h-6c-1 0-2-1-2-2v-3c0-1-1-2-2-2s-2 1-2 2v3c0 1-1 2-2 2h-6z'/%3E%3C!-- Lightbulb --%3E%3Cpath d='M148 272c4 0 7 3 7 7 0 3-2 5-3 6v2h-8v-2c-1-1-3-3-3-6 0-4 3-7 7-7z'/%3E%3Cpath d='M146 290h4'/%3E%3C!-- Wrench --%3E%3Cpath d='M175 272c3 0 5 2 5 5 0 2-1 3-2 4l4 4-3 3-4-4c-1 1-2 2-4 2-3 0-5-2-5-5l3 3 3-3-3-3z'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 200px 200px;
          background-repeat: repeat;
          z-index: 0;
          pointer-events: none;
          opacity: 1;
        }
        /* Floating orbs — 5 layers for rich depth */
        .wa-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
          z-index: 0;
        }
        .wa-orb-1 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(0, 168, 132, 0.15) 0%, transparent 65%);
          top: 8%; left: 12%;
          animation: orbA 20s ease-in-out infinite;
        }
        .wa-orb-2 {
          width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(0, 114, 177, 0.10) 0%, transparent 65%);
          bottom: 5%; right: 8%;
          animation: orbB 25s ease-in-out infinite;
        }
        .wa-orb-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, transparent 65%);
          top: 45%; left: 55%;
          animation: orbC 22s ease-in-out infinite;
        }
        .wa-orb-4 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(0, 168, 132, 0.06) 0%, transparent 65%);
          bottom: 30%; left: 25%;
          animation: orbD 18s ease-in-out infinite;
        }
        .wa-orb-5 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(30, 64, 120, 0.07) 0%, transparent 65%);
          top: 20%; right: 30%;
          animation: orbE 24s ease-in-out infinite;
        }
        /* Vignette overlay for depth */
        .wa-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
          z-index: 0;
        }
        .wa-animated-bg > * {
          position: relative;
          z-index: 1;
        }
        .wa-app { display:flex; width:100%; height:100dvh; overflow:hidden; }
        .wa-sidebar { width:400px; min-width:320px; max-width:400px; flex-shrink:0; background:#111b21; border-right:1px solid #222e35; display:flex; flex-direction:column; overflow:hidden; }
        .wa-chat { flex:1; display:flex; flex-direction:column; overflow:hidden; background:#0b141a; }
        .wa-rpanel { width:380px; min-width:300px; flex-shrink:0; background:#111b21; border-left:1px solid #222e35; display:flex; flex-direction:column; overflow:hidden; transition:all .3s; }
        .wa-rpanel.hidden { width:0; min-width:0; overflow:hidden; }
        .wa-thread-item { padding:13px 16px; cursor:pointer; transition:background .15s; display:flex; gap:12px; align-items:center; border-bottom:1px solid rgba(255,255,255,0.03); }
        .wa-thread-item:hover { background:rgba(255,255,255,0.05); }
        .wa-thread-item.active { background:#2a3942; }
        .wa-scrollbar::-webkit-scrollbar { width:6px; } .wa-scrollbar::-webkit-scrollbar-track { background:transparent; } .wa-scrollbar::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:3px; }
        .wa-msg-bubble { max-width:65%; position:relative; border-radius:8px; padding:8px 60px 22px 12px; font-size:14.2px; line-height:1.55; min-width:72px; }
        .wa-msg-out { background:#005c4b; color:#e9edef; border-bottom-right-radius:2px; margin-left:auto; }
        .wa-msg-in  { background:#202c33; color:#e9edef; border-bottom-left-radius:2px; margin-right:auto; }
        .wa-msg-time { position:absolute; bottom:5px; right:10px; font-size:11px; color:rgba(255,255,255,0.5); display:flex; align-items:center; gap:3px; }
        .wa-msg-in .wa-msg-time { right:10px; }
        .admin-content-wrap,
        .admin-main-content { border-radius: 0 !important; border: none !important; padding: 0 !important; }
        .wa-filter-tab { padding:5px 14px; border-radius:20px; font-size:12.5px; font-weight:600; cursor:pointer; border:1px solid transparent; transition:all .15s; white-space:nowrap; }
        .wa-filter-tab.active { background:#2a3942; color:#00a884; border-color:#374045; }
        .wa-filter-tab:not(.active) { color:#8696a0; }
        .wa-filter-tab:hover:not(.active) { background:rgba(255,255,255,0.05); color:#d1d7db; }
        .wa-input-area { background:#202c33; padding:10px 16px; display:flex; align-items:flex-end; gap:12px; border-top:1px solid #222e35; flex-shrink:0; }
        .wa-input-box { flex:1; background:#2a3942; border:none; border-radius:10px; padding:9px 14px; color:#d1d7db; font-size:15px; outline:none; resize:none; min-height:42px; max-height:160px; }
        .wa-input-box::placeholder { color:#8696a0; }
        .wa-send-btn { width:46px; height:46px; border-radius:50%; background:#00a884; border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .15s; }
        .wa-send-btn:hover { background:#02c999; }
        .wa-send-btn:disabled { background:#374045; cursor:not-allowed; }
        .wa-action-btn { width:100%; display:flex; align-items:center; justify-between; gap:10px; padding:11px 14px; border-radius:10px; border:1px solid #2a3942; background:transparent; color:#d1d7db; font-size:13.5px; font-weight:500; cursor:pointer; text-align:left; transition:all .15s; }
        .wa-action-btn:hover:not(:disabled) { background:#2a3942; }
        .wa-action-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .wa-action-btn.active-blue { background:rgba(0,114,212,0.12); border-color:rgba(0,114,212,0.3); color:#7ebfff; }
        .wa-action-btn.active-red { background:rgba(239,68,68,0.12); border-color:rgba(239,68,68,0.3); color:#fca5a5; }
        .wa-action-btn.active-green { background:rgba(0,168,132,0.15); border-color:rgba(0,168,132,0.3); color:#34d399; }
        .wa-action-btn.active-slate { background:rgba(100,116,139,0.12); border-color:rgba(100,116,139,0.3); color:#94a3b8; }
        .wa-rp-section { padding:16px; border-bottom:1px solid #222e35; }
        .wa-rp-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.14em; color:#8696a0; margin-bottom:10px; }
        .wa-toggle { position:relative; width:48px; height:26px; flex-shrink:0; }
        .wa-toggle input { opacity:0; width:0; height:0; }
        .wa-toggle-slider { position:absolute; cursor:pointer; inset:0; background:#374045; border-radius:26px; transition:.3s; }
        .wa-toggle-slider:before { content:''; position:absolute; width:20px; height:20px; left:3px; bottom:3px; background:white; border-radius:50%; transition:.3s; }
        .wa-toggle input:checked + .wa-toggle-slider { background:#00a884; }
        .wa-toggle input:checked + .wa-toggle-slider:before { transform:translateX(22px); }
        @media (max-width: 768px) {
          .wa-sidebar { width:100%; max-width:100%; }
          .wa-chat { width:100%; }
          .wa-rpanel { display:none !important; }
          .wa-mobile-hidden { display:none !important; }
          .wa-mobile-show { display:flex !important; }
        }
        @media (min-width: 769px) {
          .wa-sidebar { display:flex !important; }
          .wa-chat { display:flex !important; }
        }
        @keyframes wa-slide-up { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes wa-pulse-dot { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      `}</style>

      <div className="wa-app">

        {/* â•â•â•â•â•â•â•â•â•â•â• LEFT SIDEBAR â•â•â•â•â•â•â•â•â•â•â• */}
        <aside className={`wa-sidebar${mobileView === 'chat' ? ' wa-mobile-hidden' : ''}`}>
          {/* Sidebar Header */}
          <div style={{ background:'#202c33', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, borderBottom:'1px solid #222e35' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src="/kenia-avatar.png" alt="Kenia" style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'2px solid rgba(0,168,132,0.3)' }} />
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:'#e9edef', lineHeight:1.2 }}>Kenia IA</p>
                <p style={{ fontSize:12, color:'#00a884', display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:7, height:7, background:'#00a884', borderRadius:'50%', display:'inline-block', animation:'wa-pulse-dot 2s infinite' }} />
                  {config.isEnabled !== false ? 'Activa' : 'En mantenimiento'}
                </p>
              </div>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              <button onClick={loadThreads as any} title="Actualizar" style={{ width:36, height:36, borderRadius:'50%', background:'transparent', border:'none', color:'#8696a0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .15s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.08)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <RefreshCw className={`h-5 w-5 ${loadingThreads ? 'animate-spin' : ''}`} />
              </button>
              <Link href="/admin/ia" style={{ width:36, height:36, borderRadius:'50%', background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', color:'#8696a0', textDecoration:'none', transition:'background .15s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.08)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ background:'#1a2630', padding:'8px 16px', display:'flex', gap:8, overflowX:'auto', flexShrink:0, borderBottom:'1px solid #222e35' }}>
            {[
              { label:'Hilos', value: compactNumber(stats.totalThreads), color:'#8696a0' },
              { label:'Sin leer', value: stats.unreadThreads, color: stats.unreadThreads > 0 ? '#fbbf24' : '#8696a0' },
              { label:'Bloqueados', value: stats.blockedThreads, color: stats.blockedThreads > 0 ? '#f87171' : '#8696a0' },
              { label:'Tokens', value: compactNumber(stats.totalTokens), color:'#34d399' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:8, padding:'5px 12px', textAlign:'center', flexShrink:0 }}>
                <p style={{ fontSize:15, fontWeight:800, color:s.color }}>{s.value}</p>
                <p style={{ fontSize:10, color:'#8696a0', fontWeight:600, textTransform:'uppercase', letterSpacing:'.1em' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ padding:'8px 12px', background:'#111b21', flexShrink:0 }}>
            <div style={{ background:'#202c33', borderRadius:10, display:'flex', alignItems:'center', gap:8, padding:'6px 12px' }}>
              <Search className="h-4 w-4 shrink-0" style={{ color:'#8696a0' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar o empezar chat"
                style={{ background:'transparent', border:'none', outline:'none', color:'#d1d7db', fontSize:14, flex:1 }}
              />
              {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#8696a0' }}><X className="h-4 w-4" /></button>}
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ padding:'4px 12px 8px', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
            {([['all','Todos'],['unread','Sin leer'],['escalated','Escalados'],['blocked','Bloqueados']] as [FilterTab, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setFilterTab(key)} className={`wa-filter-tab ${filterTab === key ? 'active' : ''}`}>
                {label}
                {key === 'unread' && stats.unreadThreads > 0 && <span style={{ marginLeft:5, background:'#00a884', color:'white', borderRadius:10, padding:'1px 6px', fontSize:10, fontWeight:700 }}>{stats.unreadThreads}</span>}
                {key === 'blocked' && stats.blockedThreads > 0 && <span style={{ marginLeft:5, background:'#ef4444', color:'white', borderRadius:10, padding:'1px 6px', fontSize:10, fontWeight:700 }}>{stats.blockedThreads}</span>}
              </button>
            ))}
          </div>

          {/* Thread list */}
          <div className="wa-scrollbar" style={{ flex:1, overflowY:'auto' }}>
            {loadingThreads ? (
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                {[...Array(6)].map((_,i) => (
                  <div key={i} style={{ padding:'13px 16px', display:'flex', gap:12, alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ width:49, height:49, borderRadius:'50%', background:'#202c33', flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ height:14, background:'#202c33', borderRadius:4, width:'60%', marginBottom:7 }} />
                      <div style={{ height:12, background:'#202c33', borderRadius:4, width:'85%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredThreads.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', gap:12, color:'#8696a0' }}>
                <MessageCircle className="h-12 w-12" style={{ opacity:.3 }} />
                <p style={{ fontSize:14 }}>Sin resultados</p>
              </div>
            ) : filteredThreads.map(t => {
              const [bg, fg] = getAvatarColors(t.phone);
              const active = t.phone === selectedPhone;
              const initials = getInitials(t.phone);
              const statusDot = t.spamBlocked ? '#ef4444' : t.adminTakeover ? '#3b82f6' : t.escalated ? '#f59e0b' : t.blocked ? '#6b7280' : null;
              const cinfo = customerMap[t.phone];
              const displayName = cinfo?.name || `+${t.phone}`;
              const hasAvatar = !!cinfo?.avatarUrl;
              return (
                <div
                  key={t.phone}
                  className={`wa-thread-item ${active ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPhone(t.phone);
                    setMobileView('chat');
                  }}
                  style={{ background: active ? '#2a3942' : undefined }}
                >
                  {/* Avatar */}
                  <div style={{ position:'relative', flexShrink:0 }}>
                    {hasAvatar ? (
                      <img
                        src={cinfo!.avatarUrl!}
                        alt={displayName}
                        style={{ width:49, height:49, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(0,168,132,0.25)' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width:49, height:49, borderRadius:'50%', background:bg, color:fg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800 }}>
                        {cinfo?.name ? cinfo.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : initials}
                      </div>
                    )}
                    {statusDot && <div style={{ position:'absolute', bottom:1, right:1, width:12, height:12, borderRadius:'50%', background:statusDot, border:'2px solid #111b21' }} />}
                    {t.unreadCount > 0 && !active && (
                      <div style={{ position:'absolute', top:-2, right:-2, minWidth:18, height:18, borderRadius:9, background:'#00a884', color:'white', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px', border:'2px solid #111b21' }}>
                        {t.unreadCount > 99 ? '99+' : t.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:3 }}>
                      <p style={{ fontSize:15, fontWeight:600, color:'#e9edef', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'65%' }}>
                        {displayName}
                      </p>
                      <span style={{ fontSize:11.5, color: t.unreadCount > 0 ? '#00a884' : '#8696a0', flexShrink:0 }}>
                        {formatRelativeDate(t.lastAt)}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <p style={{ fontSize:13, color:'#8696a0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', flex:1 }}>
                        {cinfo?.registered && cinfo.name
                          ? (t.preview || 'Sin mensajes')
                          : `+${t.phone} · ${t.preview || 'Sin mensajes'}`}
                      </p>
                      {cinfo?.orderCount != null && cinfo.orderCount > 0 && (
                        <span style={{ fontSize:9, background:'rgba(0,168,132,0.15)', color:'#00a884', borderRadius:4, padding:'1px 5px', fontWeight:700, flexShrink:0, whiteSpace:'nowrap' }}>
                          {cinfo.orderCount} ped
                        </span>
                      )}
                      {t.escalated && <span style={{ fontSize:9, background:'rgba(245,158,11,0.2)', color:'#fbbf24', borderRadius:4, padding:'1px 5px', fontWeight:700, flexShrink:0 }}>ESC</span>}
                      {t.spamBlocked && <span style={{ fontSize:9, background:'rgba(239,68,68,0.2)', color:'#f87171', borderRadius:4, padding:'1px 5px', fontWeight:700, flexShrink:0 }}>SPAM</span>}
                    </div>
                    {cinfo?.registered && (
                      <p style={{ fontSize:10.5, color:'#4aab87', marginTop:1 }}>
                        {cinfo.totalSpent > 0 ? `$${cinfo.totalSpent.toLocaleString('es-CL')} en compras` : 'Cliente registrado'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Acciones de conversacion */}
            {selectedPhone && (
              <div className="wa-rp-section">
                <p className="wa-rp-label">Conversacion</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <button className="wa-action-btn"
                    onClick={() => { if (selectedPhone) handleLoadOrders(selectedPhone); }}
                    disabled={!customerMap[selectedPhone]?.orderCount && customerMap[selectedPhone]?.orderCount !== undefined && customerMap[selectedPhone]?.orderCount === 0}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <ShoppingBag className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Ver pedidos del cliente</span>
                    </div>
                    {customerMap[selectedPhone]?.orderCount != null && customerMap[selectedPhone].orderCount > 0 && (
                      <span style={{ fontSize:10, background:'rgba(0,168,132,0.2)', color:'#34d399', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>
                        {customerMap[selectedPhone].orderCount}
                      </span>
                    )}
                  </button>

                  <button className="wa-action-btn"
                    onClick={() => setConfirmAction({ type: 'clear', phone: selectedPhone })}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <RefreshCw className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Borrar historial de chat</span>
                    </div>
                  </button>

                  <button className="wa-action-btn active-red"
                    onClick={() => setConfirmAction({ type: 'delete', phone: selectedPhone })}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <Trash2 className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Eliminar este numero</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Orders panel */}
            {showOrdersPanel && selectedPhone && (
              <div className="wa-rp-section">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <p className="wa-rp-label" style={{ margin:0 }}>Pedidos del cliente</p>
                  <button onClick={() => setShowOrdersPanel(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#8696a0' }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {loadingOrders ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}>
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color:'#8696a0' }} />
                  </div>
                ) : !customerMap[selectedPhone]?.orders?.length ? (
                  <p style={{ fontSize:13, color:'#8696a0', textAlign:'center', padding:'12px 0' }}>Sin pedidos registrados</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {customerMap[selectedPhone]!.orders!.map(o => (
                      <div key={o.id} style={{ background:'#202c33', borderRadius:10, padding:'10px 12px', border:'1px solid #374045' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#e9edef' }}>#{o.code}</span>
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:5,
                            background: o.status === 'Entregado' ? 'rgba(52,211,153,0.15)' : o.status === 'Cancelado' ? 'rgba(239,68,68,0.15)' : o.status.includes('Pendiente') ? 'rgba(245,158,11,0.15)' : 'rgba(0,168,132,0.15)',
                            color: o.status === 'Entregado' ? '#34d399' : o.status === 'Cancelado' ? '#f87171' : o.status.includes('Pendiente') ? '#fbbf24' : '#00a884'
                          }}>{o.status}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#8696a0', marginBottom: o.items ? 4 : 0 }}>
                          <span>{o.date}</span>
                          <span style={{ fontWeight:700, color:'#d1d7db' }}>${o.total.toLocaleString('es-CL')}</span>
                        </div>
                        {o.items && <p style={{ fontSize:11, color:'#8696a0', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </aside>

        {/* â•â•â•â•â•â•â•â•â•â•â• CHAT AREA â•â•â•â•â•â•â•â•â•â•â• */}
        <section className={`wa-chat${mobileView === 'list' ? ' wa-mobile-hidden' : ''}`}>
          {!selectedPhone ? (
            /* Empty state */
            <div className="wa-animated-bg" style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
              <div className="wa-orb wa-orb-1" />
              <div className="wa-orb wa-orb-2" />
              <div className="wa-orb wa-orb-3" />
              <div className="wa-orb wa-orb-4" />
              <div className="wa-orb wa-orb-5" />
              <div className="wa-vignette" />
              <div style={{ width:88, height:88, borderRadius:'50%', background:'rgba(0,168,132,0.12)', border:'2px solid rgba(0,168,132,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <MessageCircle className="h-10 w-10" style={{ color:'#00a884' }} />
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:22, fontWeight:300, color:'#d1d7db', marginBottom:8 }}>Kenia Business Admin</p>
                <p style={{ fontSize:14, color:'#8696a0', maxWidth:340 }}>Selecciona un chat para ver los mensajes y gestionar a tus clientes con IA.</p>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                {[`${stats.totalThreads} chats`, `${compactNumber(stats.totalTokens)} tokens`, `${stats.unreadThreads} sin leer`].map(s => (
                  <span key={s} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'5px 14px', fontSize:13, color:'#8696a0' }}>{s}</span>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ background:'#202c33', padding:'10px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0, borderBottom:'1px solid #222e35' }}>
                {/* Back button mobile */}
                <button className="wa-mobile-show" onClick={() => setMobileView('list')}
                  style={{ display:'none', width:36, height:36, borderRadius:'50%', background:'transparent', border:'none', color:'#8696a0', cursor:'pointer', alignItems:'center', justifyContent:'center' }}>
                  <ArrowLeft className="h-5 w-5" />
                </button>

                {selectedSummary && (() => {
                  const [bg, fg] = getAvatarColors(selectedSummary.phone);
                  const cinfo = customerMap[selectedSummary.phone];
                  return (
                    cinfo?.avatarUrl ? (
                      <img
                        src={cinfo.avatarUrl}
                        alt={cinfo.name || selectedSummary.phone}
                        style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'2px solid rgba(0,168,132,0.3)' }}
                        onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
                      />
                    ) : (
                      <div style={{ width:40, height:40, borderRadius:'50%', background:bg, color:fg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, flexShrink:0 }}>
                        {cinfo?.name ? cinfo.name.split(' ').map((w: string) => w[0]).slice(0,2).join('').toUpperCase() : getInitials(selectedSummary.phone)}
                      </div>
                    )
                  );
                })()}

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <p style={{ fontSize:15, fontWeight:700, color:'#e9edef' }}>
                      {customerMap[selectedPhone]?.name || `+${selectedPhone}`}
                    </p>
                    {customerMap[selectedPhone]?.registered && (
                      <span style={{ fontSize:10, background:'rgba(0,168,132,0.15)', color:'#00a884', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>
                        {customerMap[selectedPhone].orderCount > 0 ? `${customerMap[selectedPhone].orderCount} pedidos` : 'Registrado'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize:12.5, color:'#8696a0' }}>
                    {loadingThread ? 'Cargando...' :
                     thread?.usage.adminTakeover ? '👤 Bajo control manual' :
                     thread?.usage.escalated ? '⚠️ Conversación escalada' :
                     thread?.usage.spamBlocked ? '🚫 Bloqueado por spam' :
                     thread?.usage.blocked ? '🔒 IA bloqueada' :
                     thread?.usage.overLimit ? '⚡ Límite de tokens alcanzado' :
                     '🤖 Kenia activa'}
                  </p>
                </div>

                <div style={{ display:'flex', gap:4 }}>
                  <button onClick={() => setShowRightPanel(p => !p)} title="Panel de control"
                    style={{ width:36, height:36, borderRadius:'50%', background: showRightPanel ? 'rgba(0,168,132,0.15)' : 'transparent', border:'none', color: showRightPanel ? '#00a884' : '#8696a0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}>
                    <Settings2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Status banners */}
              {thread?.usage.adminTakeover && (
                <div style={{ background:'rgba(59,130,246,0.12)', borderBottom:'1px solid rgba(59,130,246,0.2)', padding:'8px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, color:'#93c5fd', fontSize:13, fontWeight:600 }}>
                    <UserCheck className="h-4 w-4" />
                    <span>Control manual activo — Kenia está pausada</span>
                  </div>
                  <button onClick={() => handleSetBlock(false)} disabled={savingBlock}
                    style={{ background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.3)', color:'#93c5fd', borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                    Devolver a Kenia
                  </button>
                </div>
              )}
              {thread?.usage.escalated && !thread?.usage.adminTakeover && (
                <div style={{ background:'rgba(245,158,11,0.1)', borderBottom:'1px solid rgba(245,158,11,0.2)', padding:'8px 16px', display:'flex', alignItems:'center', gap:8, flexShrink:0, color:'#fbbf24', fontSize:13, fontWeight:600 }}>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Conversación escalada — Se necesita atención humana</span>
                </div>
              )}
              {thread?.usage.spamBlocked && (
                <div style={{ background:'rgba(239,68,68,0.1)', borderBottom:'1px solid rgba(239,68,68,0.2)', padding:'8px 16px', display:'flex', alignItems:'center', gap:8, flexShrink:0, color:'#f87171', fontSize:13, fontWeight:600 }}>
                  <Ban className="h-4 w-4" />
                  <span>Número bloqueado por spam — Kenia ignora todos los mensajes</span>
                </div>
              )}

              {/* Messages */}
              <div ref={chatScrollRef} onScroll={handleChatScroll}
                className="wa-scrollbar wa-animated-bg"
                style={{ flex:1, overflowY:'auto', padding:'12px 4%', display:'flex', flexDirection:'column', gap:2 }}>
                <div className="wa-orb wa-orb-1" />
                <div className="wa-orb wa-orb-2" />
                <div className="wa-orb wa-orb-3" />
                <div className="wa-orb wa-orb-4" />
                <div className="wa-orb wa-orb-5" />
                <div className="wa-vignette" />
                {loadingThread ? (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:10, color:'#8696a0' }}>
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color:'#00a884' }} />
                    <span style={{ fontSize:13 }}>Cargando mensajes...</span>
                  </div>
                ) : thread && thread.messages.length > 0 ? (
                  <>
                    {thread.messages.map((msg, idx) => {
                      const isOut = msg.role === 'assistant';
                      const prev = thread.messages[idx - 1];
                      const showDateDiv = !prev || new Date(msg.createdAt).toDateString() !== new Date(prev.createdAt).toDateString();
                      const msgDate = new Date(msg.createdAt);
                      const timeStr = msgDate.toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' });
                      return (
                        <div key={msg.id}>
                          {showDateDiv && (
                            <div style={{ display:'flex', justifyContent:'center', margin:'10px 0 6px' }}>
                              <span style={{ background:'#182229', color:'#8696a0', fontSize:12, padding:'4px 12px', borderRadius:8 }}>
                                {msgDate.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long' })}
                              </span>
                            </div>
                          )}
                          <div style={{ display:'flex', justifyContent: isOut ? 'flex-end' : 'flex-start', marginBottom:2 }}>
                            <div className={`wa-msg-bubble ${isOut ? 'wa-msg-out' : 'wa-msg-in'}`}>
                              {!isOut && (
                                <p style={{ fontSize:11, fontWeight:700, color:'#00a884', marginBottom:3 }}>Cliente</p>
                              )}
                              <span style={{ whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{msg.text}</span>
                              <div className="wa-msg-time">
                                <span>{timeStr}</span>
                                {isOut && <CheckCheck className="h-3.5 w-3.5" style={{ color: msg.readByUser ? '#53bdeb' : 'rgba(255,255,255,0.5)' }} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:10, color:'#8696a0' }}>
                    <MessageCircle className="h-10 w-10" style={{ opacity:.3 }} />
                    <p style={{ fontSize:14 }}>Sin mensajes en este chat</p>
                  </div>
                )}
              </div>

              {/* Scroll-to-bottom button */}
              {showScrollBtn && (
                <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior:'smooth' })}
                  style={{ position:'absolute', bottom:80, right: showRightPanel ? 396 : 16, width:42, height:42, borderRadius:'50%', background:'#202c33', border:'1px solid #374045', color:'#8696a0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.4)', zIndex:10, transition:'all .2s', animation:'wa-slide-up .25s ease' }}>
                  <ChevronDown className="h-5 w-5" />
                </button>
              )}

              {/* Input area */}
              <div className="wa-input-area">
                <textarea
                  className="wa-input-box wa-scrollbar"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Escribe un mensaje..."
                  rows={1}
                  style={{ lineHeight:'1.5' }}
                />
                <button className="wa-send-btn" onClick={handleSend} disabled={!draft.trim() || sending}>
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </>
          )}
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â• RIGHT PANEL â•â•â•â•â•â•â•â•â•â•â• */}
        <aside className={`wa-rpanel${showRightPanel ? '' : ' hidden'}`}>
          <div style={{ background:'#202c33', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, borderBottom:'1px solid #222e35' }}>
            <p style={{ fontSize:14, fontWeight:700, color:'#e9edef', display:'flex', alignItems:'center', gap:8 }}>
              <Settings2 className="h-4 w-4" style={{ color:'#8696a0' }} />
              Panel Kenia
              <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:10, background: config.isEnabled !== false ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)', color: config.isEnabled !== false ? '#34d399' : '#f87171' }}>
                {config.isEnabled !== false ? 'ON' : 'OFF'}
              </span>
            </p>
            <button onClick={() => setShowRightPanel(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#8696a0', display:'flex' }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="wa-scrollbar" style={{ flex:1, overflowY:'auto' }}>
            {/* Selected client */}
            {selectedPhone && (
              <div className="wa-rp-section">
                <p className="wa-rp-label">Cliente seleccionado</p>
                {selectedSummary && (() => {
                  const [bg, fg] = getAvatarColors(selectedSummary.phone);
                  const cinfo = customerMap[selectedSummary.phone];
                  return (
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: cinfo?.registered ? 10 : 12 }}>
                        {cinfo?.avatarUrl ? (
                          <img
                            src={cinfo.avatarUrl}
                            alt={cinfo.name || selectedPhone}
                            style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'2px solid rgba(0,168,132,0.3)' }}
                            onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
                          />
                        ) : (
                          <div style={{ width:44, height:44, borderRadius:'50%', background:bg, color:fg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, flexShrink:0 }}>
                            {cinfo?.name ? cinfo.name.split(' ').map((w: string) => w[0]).slice(0,2).join('').toUpperCase() : getInitials(selectedSummary.phone)}
                          </div>
                        )}
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:14, fontWeight:700, color:'#e9edef', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {cinfo?.name || `+${selectedPhone}`}
                          </p>
                          <p style={{ fontSize:12, color:'#8696a0' }}>
                            {cinfo?.name ? `+${selectedPhone} · ` : ''}{selectedSummary.totalMessages} mensajes
                          </p>
                        </div>
                        {thread?.usage && (
                          thread.usage.spamBlocked ? <span style={{ fontSize:10, background:'rgba(239,68,68,0.2)', color:'#f87171', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>SPAM</span> :
                          thread.usage.adminTakeover ? <span style={{ fontSize:10, background:'rgba(59,130,246,0.2)', color:'#93c5fd', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>ADMIN</span> :
                          thread.usage.escalated ? <span style={{ fontSize:10, background:'rgba(245,158,11,0.2)', color:'#fbbf24', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>ESC</span> :
                          thread.usage.blocked ? <span style={{ fontSize:10, background:'rgba(100,116,139,0.2)', color:'#94a3b8', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>OFF</span> :
                          <span style={{ fontSize:10, background:'rgba(0,168,132,0.2)', color:'#34d399', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>OK</span>
                        )}
                      </div>
                      {cinfo?.registered && (
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                          {cinfo.email && (
                            <span style={{ fontSize:11, color:'#8696a0', background:'#202c33', borderRadius:6, padding:'3px 8px', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' }}>{cinfo.email}</span>
                          )}
                          {cinfo.orderCount > 0 && (
                            <span style={{ fontSize:11, color:'#00a884', background:'rgba(0,168,132,0.1)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>
                              {cinfo.orderCount} pedido{cinfo.orderCount !== 1 ? 's' : ''}
                            </span>
                          )}
                          {cinfo.totalSpent > 0 && (
                            <span style={{ fontSize:11, color:'#34d399', background:'rgba(52,211,153,0.08)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>
                              ${cinfo.totalSpent.toLocaleString('es-CL')} comprado
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Token bar */}
                <div style={{ background:'#2a3942', borderRadius:12, padding:'12px 14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:'#8696a0', display:'flex', alignItems:'center', gap:5 }}>
                      <Zap className="h-3.5 w-3.5" /> Tokens
                    </span>
                    <span style={{ fontSize:12, fontWeight:800, color: usageColor }}>{usagePct}%</span>
                  </div>
                  <div style={{ height:6, background:'#374045', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${usagePct}%`, background: usagePct >= 100 ? '#ef4444' : usagePct >= 75 ? '#f59e0b' : 'linear-gradient(90deg,#00a884,#34d399)', borderRadius:3, transition:'width .6s' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, color:'#8696a0' }}>
                    <span>{thread?.usage.totalTokens.toLocaleString('es-CL') || 0} usados</span>
                    <span>lím. {thread?.usage.tokenLimit?.toLocaleString('es-CL') || config.tokenLimitPerCustomer.toLocaleString('es-CL')}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:8 }}>
                    {[['Prompt', thread?.usage.promptTokens || 0],['Respuesta', thread?.usage.responseTokens || 0]].map(([l,v]) => (
                      <div key={l as string} style={{ background:'#202c33', borderRadius:8, padding:'7px 10px', textAlign:'center' }}>
                        <p style={{ fontSize:10, color:'#8696a0', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:3 }}>{l}</p>
                        <p style={{ fontSize:14, fontWeight:800, color:'#d1d7db' }}>{(v as number).toLocaleString('es-CL')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Control buttons */}
            {selectedPhone && (
              <div className="wa-rp-section">
                <p className="wa-rp-label">Control de IA</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <button className={`wa-action-btn${thread?.usage.adminTakeover ? ' active-blue' : ''}`}
                    onClick={() => handleSetBlock(true, 'admin_takeover')}
                    disabled={!selectedPhone || savingBlock || !!thread?.usage.adminTakeover}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <User className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Tomar control manual</span>
                    </div>
                    {thread?.usage.adminTakeover && <span style={{ fontSize:10, background:'rgba(59,130,246,0.3)', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>ACTIVO</span>}
                  </button>

                  <button className={`wa-action-btn${(!thread?.usage.blocked && !thread?.usage.adminTakeover && !thread?.usage.spamBlocked) ? ' active-green' : ''}`}
                    onClick={() => handleSetBlock(false)}
                    disabled={!selectedPhone || savingBlock || (!thread?.usage.blocked && !thread?.usage.adminTakeover && !thread?.usage.spamBlocked)}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <Bot className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Devolver a Kenia</span>
                    </div>
                    {(!thread?.usage.blocked && !thread?.usage.adminTakeover && !thread?.usage.spamBlocked) && <span style={{ fontSize:10, background:'rgba(0,168,132,0.3)', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>ACTIVO</span>}
                  </button>

                  <button className={`wa-action-btn${thread?.usage.spamBlocked ? ' active-red' : ''}`}
                    onClick={() => handleSetBlock(true, 'spam')}
                    disabled={!selectedPhone || savingBlock || !!thread?.usage.spamBlocked}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <Ban className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Bloquear por spam</span>
                    </div>
                    {thread?.usage.spamBlocked && <span style={{ fontSize:10, background:'rgba(239,68,68,0.3)', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>SPAM</span>}
                  </button>

                  <button className={`wa-action-btn${(thread?.usage.blocked && !thread?.usage.adminTakeover && !thread?.usage.spamBlocked) ? ' active-slate' : ''}`}
                    onClick={() => handleSetBlock(true, 'manual')}
                    disabled={!selectedPhone || savingBlock || !!(thread?.usage.blocked && !thread?.usage.adminTakeover && !thread?.usage.spamBlocked)}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <Lock className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Bloquear IA (general)</span>
                    </div>
                    {(thread?.usage.blocked && !thread?.usage.adminTakeover && !thread?.usage.spamBlocked) && <span style={{ fontSize:10, background:'rgba(100,116,139,0.3)', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>BLOQ</span>}
                  </button>
                </div>
              </div>
            )}

            {/* Estado inteligente */}
            {selectedPhone && thread && (
              <div className="wa-rp-section">
                <p className="wa-rp-label">Estado inteligente</p>
                <div style={{
                  background: thread.usage.overLimit ? 'rgba(239,68,68,0.08)' : thread.usage.escalated ? 'rgba(245,158,11,0.08)' : 'rgba(0,168,132,0.08)',
                  border: `1px solid ${thread.usage.overLimit ? 'rgba(239,68,68,0.2)' : thread.usage.escalated ? 'rgba(245,158,11,0.2)' : 'rgba(0,168,132,0.2)'}`,
                  borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'flex-start', gap:10
                }}>
                  {thread.usage.overLimit ? <TrendingUp className="h-4 w-4 mt-0.5" style={{ color:'#f87171', flexShrink:0 }} /> :
                   thread.usage.escalated ? <AlertTriangle className="h-4 w-4 mt-0.5" style={{ color:'#fbbf24', flexShrink:0 }} /> :
                   <Shield className="h-4 w-4 mt-0.5" style={{ color:'#34d399', flexShrink:0 }} />}
                  <p style={{ fontSize:13, lineHeight:1.55, color: thread.usage.overLimit ? '#f87171' : thread.usage.escalated ? '#fbbf24' : '#34d399' }}>
                    {thread.usage.overLimit ? 'Límite de tokens superado. Sube el límite o bloquea al cliente para detener el consumo.' :
                     thread.usage.escalated ? 'Conversación escalada. El cliente necesita atención humana urgente.' :
                     'Kenia está respondiendo con normalidad. Todo en orden.'}
                  </p>
                </div>
              </div>
            )}

            {/* Configuracion por cliente */}
            <div className="wa-rp-section">
              <p className="wa-rp-label">Configuracion del cliente</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <div>
                  <p style={{ fontSize:12, color:'#8696a0', marginBottom:5 }}>Limite de tokens por cliente</p>
                  <input type="number" min={1000} step={500} value={config.tokenLimitPerCustomer}
                    onChange={e => setConfig(p => ({ ...p, tokenLimitPerCustomer: Number(e.target.value || 0) }))}
                    style={{ background:'#202c33', border:'1px solid #374045', borderRadius:10, padding:'9px 12px', color:'#d1d7db', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' }} />
                </div>
                <div>
                  <p style={{ fontSize:12, color:'#8696a0', marginBottom:5 }}>Pausar tras N mensajes sin respuesta</p>
                  <input type="number" min={1} step={1} value={config.messageThresholdForPause}
                    onChange={e => setConfig(p => ({ ...p, messageThresholdForPause: Number(e.target.value || 10) }))}
                    style={{ background:'#202c33', border:'1px solid #374045', borderRadius:10, padding:'9px 12px', color:'#d1d7db', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' }} />
                </div>
                <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#202c33', border:'1px solid #374045', borderRadius:10, padding:'9px 12px', cursor:'pointer' }}>
                  <div>
                    <span style={{ fontSize:13, color:'#d1d7db', display:'block' }}>Notificacion inteligente</span>
                    <span style={{ fontSize:11, color:'#8696a0' }}>Avisa al iniciar, al pausar y cada ~10 mensajes</span>
                  </div>
                  <label className="wa-toggle">
                    <input type="checkbox" checked={config.smartNotifications} onChange={e => setConfig(p => ({ ...p, smartNotifications: e.target.checked }))} />
                    <span className="wa-toggle-slider" />
                  </label>
                </label>
              </div>
              <button onClick={handleSaveConfig} disabled={savingConfig || loadingConfig}
                style={{ marginTop:10, width:'100%', background:'#00a884', border:'none', borderRadius:10, padding:'10px', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity: savingConfig || loadingConfig ? 0.5 : 1 }}>
                {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar
              </button>
            </div>

            {/* Acciones de conversacion */}
            {selectedPhone && (
              <div className="wa-rp-section">
                <p className="wa-rp-label">Conversacion</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <button className="wa-action-btn"
                    onClick={() => { if (selectedPhone) handleLoadOrders(selectedPhone); }}
                    disabled={!customerMap[selectedPhone]?.orderCount && customerMap[selectedPhone]?.orderCount !== undefined && customerMap[selectedPhone]?.orderCount === 0}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <ShoppingBag className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Ver pedidos del cliente</span>
                    </div>
                    {customerMap[selectedPhone]?.orderCount != null && customerMap[selectedPhone].orderCount > 0 && (
                      <span style={{ fontSize:10, background:'rgba(0,168,132,0.2)', color:'#34d399', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>
                        {customerMap[selectedPhone].orderCount}
                      </span>
                    )}
                  </button>

                  <button className="wa-action-btn"
                    onClick={() => setConfirmAction({ type: 'clear', phone: selectedPhone })}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <RefreshCw className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Borrar historial de chat</span>
                    </div>
                  </button>

                  <button className="wa-action-btn active-red"
                    onClick={() => setConfirmAction({ type: 'delete', phone: selectedPhone })}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <Trash2 className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Eliminar este numero</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Orders panel */}
            {showOrdersPanel && selectedPhone && (
              <div className="wa-rp-section">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <p className="wa-rp-label" style={{ margin:0 }}>Pedidos del cliente</p>
                  <button onClick={() => setShowOrdersPanel(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#8696a0' }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {loadingOrders ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}>
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color:'#8696a0' }} />
                  </div>
                ) : !customerMap[selectedPhone]?.orders?.length ? (
                  <p style={{ fontSize:13, color:'#8696a0', textAlign:'center', padding:'12px 0' }}>Sin pedidos registrados</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {customerMap[selectedPhone]!.orders!.map(o => (
                      <div key={o.id} style={{ background:'#202c33', borderRadius:10, padding:'10px 12px', border:'1px solid #374045' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#e9edef' }}>#{o.code}</span>
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:5,
                            background: o.status === 'Entregado' ? 'rgba(52,211,153,0.15)' : o.status === 'Cancelado' ? 'rgba(239,68,68,0.15)' : o.status.includes('Pendiente') ? 'rgba(245,158,11,0.15)' : 'rgba(0,168,132,0.15)',
                            color: o.status === 'Entregado' ? '#34d399' : o.status === 'Cancelado' ? '#f87171' : o.status.includes('Pendiente') ? '#fbbf24' : '#00a884'
                          }}>{o.status}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#8696a0', marginBottom: o.items ? 4 : 0 }}>
                          <span>{o.date}</span>
                          <span style={{ fontWeight:700, color:'#d1d7db' }}>${o.total.toLocaleString('es-CL')}</span>
                        </div>
                        {o.items && <p style={{ fontSize:11, color:'#8696a0', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </aside>

      </div>

      {/* Confirm modal */}
      {confirmAction && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setConfirmAction(null)}>
          <div style={{ background:'#202c33', borderRadius:16, padding:'24px 20px', maxWidth:340, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              {confirmAction.type === 'delete'
                ? <Trash2 className="h-5 w-5" style={{ color:'#f87171', flexShrink:0 }} />
                : <RefreshCw className="h-5 w-5" style={{ color:'#fbbf24', flexShrink:0 }} />}
              <p style={{ fontSize:15, fontWeight:700, color:'#e9edef' }}>
                {confirmAction.type === 'delete' ? 'Eliminar numero' : 'Borrar historial'}
              </p>
            </div>
            <p style={{ fontSize:13, color:'#8696a0', lineHeight:1.55, marginBottom:20 }}>
              {confirmAction.type === 'delete'
                ? 'Se eliminaran todos los mensajes y el registro de este numero. Esta accion no se puede deshacer.'
                : 'Se borraran todos los mensajes del historial de este chat. El estado de IA se mantiene.'}
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setConfirmAction(null)}
                style={{ flex:1, background:'#2a3942', border:'none', borderRadius:10, padding:'10px', color:'#d1d7db', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Cancelar
              </button>
              <button
                onClick={() => confirmAction.type === 'delete'
                  ? handleDeleteThread(confirmAction.phone)
                  : handleClearHistory(confirmAction.phone)}
                style={{ flex:1, background: confirmAction.type === 'delete' ? '#ef4444' : '#f59e0b', border:'none', borderRadius:10, padding:'10px', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                {confirmAction.type === 'delete' ? 'Eliminar' : 'Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {message && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:9999, animation:'wa-slide-up .3s ease' }}>
          <div style={{
            display:'flex', alignItems:'center', gap:10, borderRadius:12, padding:'12px 20px',
            fontSize:14, fontWeight:700, boxShadow:'0 8px 30px rgba(0,0,0,0.5)',
            background: message.type === 'success' ? '#00a884' : '#ef4444',
            color:'white', whiteSpace:'nowrap',
          }}>
            {message.type === 'success' ? <CheckCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {message.text}
          </div>
        </div>
      )}
    </div>
  );
}

