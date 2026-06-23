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
  Plus,
  MessageSquarePlus,
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
  const [sendingTemplate, setSendingTemplate] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [sendingNewTemplate, setSendingNewTemplate] = useState(false);
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

  async function handleSendTestTemplate(phone: string) {
    if (!phone) return;
    setSendingTemplate(true);
    try {
      const res = await fetch('/api/admin/ia/send-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'No se pudo enviar la plantilla');
      await loadThread(phone);
      await loadThreads(true);
      showToast('success', 'Plantilla de prueba enviada');
    } catch (error: any) {
      showToast('error', error?.message || 'No se pudo enviar la plantilla');
    } finally {
      setSendingTemplate(false);
    }
  }

  function handleCreateNewChat() {
    if (!newChatPhone) return;
    const phone = newChatPhone.replace(/\D/g, '').trim();
    if (phone.length < 8) {
      showToast('error', 'El número de teléfono es muy corto');
      return;
    }
    const finalPhone = phone.startsWith('56') ? phone : (phone.length === 9 && phone.startsWith('9') ? '56' + phone : phone);
    
    // Check if exists
    if (!threads.find(t => t.phone === finalPhone)) {
      setThreads(prev => [{
        phone: finalPhone,
        displayName: newChatName || 'Desconocido',
        preview: '',
        lastAt: new Date().toISOString(),
        totalMessages: 0,
        unreadCount: 0,
        customerMessages: 0,
        adminMessages: 0,
        segment: 'customer',
        blocked: false,
        tokenLimit: config.tokenLimitPerCustomer,
        totalTokens: 0,
        promptTokens: 0,
        responseTokens: 0,
        overLimit: false,
        lastUsageAt: new Date().toISOString(),
      }, ...prev]);
    }
    setSelectedPhone(finalPhone);
    setShowNewChatModal(false);
    setNewChatPhone('');
    setNewChatName('');
  }

  async function handleSendNewTestTemplate() {
    if (!newChatPhone) return;
    setSendingNewTemplate(true);
    try {
      const phone = newChatPhone.replace(/\D/g, '').trim();
      const finalPhone = phone.startsWith('56') ? phone : (phone.length === 9 && phone.startsWith('9') ? '56' + phone : phone);
      const res = await fetch('/api/admin/ia/send-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: finalPhone }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'No se pudo enviar la plantilla');
      showToast('success', 'Plantilla enviada exitosamente');
      handleCreateNewChat();
    } catch (error: any) {
      showToast('error', error?.message || 'No se pudo enviar la plantilla');
    } finally {
      setSendingNewTemplate(false);
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
    <div style={{ display: 'flex', height: '100dvh', background: '#ffffff', overflow: 'hidden' }}>
      <style>{`
        /* ── Animations ─────────────────────────────────────── */
        @keyframes meshShift {
          0%   { transform: translate(0%,0%) scale(1); }
          33%  { transform: translate(3%,-2%) scale(1.08); }
          66%  { transform: translate(-2%,3%) scale(1.05); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes orbA {
          0%,100% { transform:translate(0,0) scale(1); opacity:.5; }
          25%  { transform:translate(50px,-40px) scale(1.2); opacity:.7; }
          50%  { transform:translate(-30px,30px) scale(0.85); opacity:.3; }
          75%  { transform:translate(20px,50px) scale(1.1); opacity:.5; }
        }
        @keyframes orbB {
          0%,100% { transform:translate(0,0) scale(1); opacity:.3; }
          50%  { transform:translate(-60px,50px) scale(1.3); opacity:.5; }
        }
        @keyframes orbC {
          0%,100% { transform:translate(0,0) scale(1); opacity:.25; }
          40%  { transform:translate(40px,60px) scale(1.15); opacity:.4; }
          80%  { transform:translate(-50px,-30px) scale(0.9); opacity:.2; }
        }
        @keyframes orbD {
          0%,100% { transform:translate(0,0) scale(1); opacity:.18; }
          50%  { transform:translate(70px,-50px) scale(1.25); opacity:.32; }
        }
        @keyframes orbE {
          0%,100% { transform:translate(0,0) scale(1); opacity:.22; }
          33%  { transform:translate(-40px,40px) scale(1.1); opacity:.36; }
          66%  { transform:translate(30px,-20px) scale(0.95); opacity:.18; }
        }
        @keyframes wa-slide-up { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes wa-pulse-dot { 0%,100% { opacity:1; } 50% { opacity:.35; } }
        @keyframes wa-fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes wa-pop { from { transform:scale(0.92); opacity:0; } to { transform:scale(1); opacity:1; } }

        /* ── Chat wallpaper ──────────────────────────────────── */
        .wa-animated-bg {
          background-color: #dde5d4;
          background-image:
            radial-gradient(ellipse 70% 55% at 20% 18%, rgba(34,197,160,0.13) 0%, transparent 55%),
            radial-gradient(ellipse 55% 65% at 82% 78%, rgba(59,130,246,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 45% 42% at 50% 45%, rgba(255,255,255,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 38% 38% at 90% 10%, rgba(34,197,160,0.07) 0%, transparent 48%),
            radial-gradient(ellipse 48% 38% at 10% 88%, rgba(255,255,255,0.5) 0%, transparent 55%);
          position: relative;
          overflow: hidden;
        }
        .wa-animated-bg::before {
          content: "";
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(ellipse 60% 50% at 15% 15%, rgba(34,197,160,0.10) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 85% 75%, rgba(59,130,246,0.07) 0%, transparent 50%),
            radial-gradient(ellipse 35% 35% at 92% 8%, rgba(34,197,160,0.06) 0%, transparent 45%),
            radial-gradient(ellipse 30% 30% at 60% 20%, rgba(0,100,80,0.04) 0%, transparent 50%);
          animation: meshShift 32s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        /* Doodle pattern — WhatsApp-style icons, warm tint */
        .wa-animated-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%232d5a40' stroke-width='0.8' opacity='0.07'%3E%3Cpath d='M20 20c8 0 14 5 14 13 0 7-6 13-14 13-2 0-4 0-6-1l-6 2 2-6c-1-2-2-5-2-8 0-8 6-13 12-13z'/%3E%3Crect x='45' y='12' width='12' height='20' rx='3'/%3E%3Ccircle cx='51' cy='28' r='1.5'/%3E%3Cpath d='M80 18c2-3 7-3 9 0 2 3 0 7-4 10-4-3-7-7-5-10z'/%3E%3Crect x='105' y='15' width='18' height='14' rx='2'/%3E%3Ccircle cx='114' cy='22' r='4'/%3E%3Cpath d='M140 22l4 4 8-8' stroke-linecap='round'/%3E%3Cpath d='M148 22l4 4 8-8' stroke-linecap='round'/%3E%3Cpath d='M175 14l2 5 5 0-4 3 2 5-5-3-5 3 2-5-4-3 5 0z'/%3E%3Ccircle cx='20' cy='55' r='8'/%3E%3Cpath d='M15 58c2 2 5 3 8 1' stroke-linecap='round'/%3E%3Cpath d='M48 48c3-3 7-3 10 0l5 5c2 2 2 5 0 7s-5 2-7 0l-5-5c-1-1-1-3 0-4s3-1 4 0l4 4' stroke-linecap='round'/%3E%3Crect x='78' y='48' width='6' height='12' rx='3'/%3E%3Cpath d='M75 56c0 4 3 7 6 7s6-3 6-7'/%3E%3Cpath d='M110 50l10-5-5 10-2-4z'/%3E%3Cpath d='M140 45c4 0 7 3 7 7v3l2 3h-18l2-3v-3c0-4 3-7 7-7z'/%3E%3Ccircle cx='20' cy='90' r='8'/%3E%3Cpath d='M12 90h16'/%3E%3Cpath d='M20 82c4 3 4 13 0 16'/%3E%3Cpath d='M20 82c-4 3-4 13 0 16'/%3E%3Crect x='42' y='85' width='16' height='11' rx='1'/%3E%3Cpath d='M42 86l8 6 8-6'/%3E%3Ccircle cx='108' cy='90' r='7'/%3E%3Cpath d='M108 86v4l3 2' stroke-linecap='round'/%3E%3Cpath d='M135 82c4 0 7 3 7 7 0 5-7 12-7 12s-7-7-7-12c0-4 3-7 7-7z'/%3E%3Ccircle cx='135' cy='89' r='2.5'/%3E%3Ccircle cx='165' cy='90' r='5'/%3E%3Ccircle cx='188' cy='88' r='5'/%3E%3Cpath d='M192 92l4 4' stroke-linecap='round'/%3E%3Cpath d='M15 125l5-8 3 5 4-3-5 8-3-5z'/%3E%3Cpath d='M45 118l8-3 8 3v6c0 5-4 8-8 10-4-2-8-5-8-10z'/%3E%3Cpath d='M49 124l3 3 5-5' stroke-linecap='round'/%3E%3Cpath d='M78 115h10l2 12h-14z'/%3E%3Cpath d='M80 115v-3c0-2 2-4 4-4s4 2 4 4v3'/%3E%3Ccircle cx='50' cy='155' r='2'/%3E%3Ccircle cx='57' cy='155' r='2'/%3E%3Ccircle cx='64' cy='155' r='2'/%3E%3Cpath d='M110 180l3 8h10l3-8-5 4-3-6-3 6z'/%3E%3Cpath d='M140 175c3 3 5 6 5 10 0 4-3 7-6 7s-5-3-5-6c0-2 1-4 3-5-1 3 1 4 3 4 0-3-1-6 0-10z'/%3E%3Ccircle cx='20' cy='245' r='4'/%3E%3Cpath d='M14 255c0-4 3-7 6-7s6 3 6 7'/%3E%3Cpath d='M50 240h14c2 0 3 1 3 3v6c0 2-1 3-3 3h-8l-4 3v-3h-2c-2 0-3-1-3-3v-6c0-2 1-3 3-3z'/%3E%3Ccircle cx='50' cy='278' r='7'/%3E%3Ccircle cx='50' cy='278' r='4'/%3E%3Ccircle cx='50' cy='278' r='1.5'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 200px 200px;
          background-repeat: repeat;
          z-index: 0;
          pointer-events: none;
          opacity: 1;
        }
        /* Floating orbs */
        .wa-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; }
        .wa-orb-1 { width:380px; height:380px; background:radial-gradient(circle, rgba(34,197,160,0.18) 0%, transparent 65%); top:6%; left:10%; animation:orbA 22s ease-in-out infinite; }
        .wa-orb-2 { width:480px; height:480px; background:radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%); bottom:4%; right:6%; animation:orbB 28s ease-in-out infinite; }
        .wa-orb-3 { width:300px; height:300px; background:radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 65%); top:44%; left:52%; animation:orbC 24s ease-in-out infinite; }
        .wa-orb-4 { width:220px; height:220px; background:radial-gradient(circle, rgba(34,197,160,0.10) 0%, transparent 65%); bottom:28%; left:22%; animation:orbD 20s ease-in-out infinite; }
        .wa-orb-5 { width:340px; height:340px; background:radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%); top:18%; right:28%; animation:orbE 26s ease-in-out infinite; }
        .wa-vignette { position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.06) 100%); pointer-events:none; z-index:0; }
        .wa-animated-bg > * { position:relative; z-index:1; }

        /* ── App shell ───────────────────────────────────────── */
        .wa-app { display:flex; width:100%; height:100dvh; overflow:hidden; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }

        /* ── Sidebar ─────────────────────────────────────────── */
        .wa-sidebar {
          width:400px; min-width:320px; max-width:400px; flex-shrink:0;
          background:#ffffff;
          border-right:1px solid rgba(0,0,0,0.08);
          display:flex; flex-direction:column; overflow:hidden;
          box-shadow:2px 0 12px rgba(0,0,0,0.06);
        }

        /* ── Chat column ─────────────────────────────────────── */
        .wa-chat { flex:1; display:flex; flex-direction:column; overflow:hidden; background:#dde5d4; }

        /* ── Right panel ─────────────────────────────────────── */
        .wa-rpanel {
          width:380px; min-width:300px; flex-shrink:0;
          background:#fafbfc;
          border-left:1px solid rgba(0,0,0,0.08);
          display:flex; flex-direction:column; overflow:hidden;
          transition:width .28s cubic-bezier(.4,0,.2,1), min-width .28s cubic-bezier(.4,0,.2,1);
          box-shadow:-2px 0 12px rgba(0,0,0,0.05);
        }
        .wa-rpanel.hidden { width:0; min-width:0; overflow:hidden; box-shadow:none; }

        /* ── Thread list items ───────────────────────────────── */
        .wa-thread-item {
          padding:12px 14px; cursor:pointer;
          transition:background .18s, transform .1s;
          display:flex; gap:12px; align-items:center;
          border-bottom:1px solid rgba(0,0,0,0.04);
          margin:2px 6px; border-radius:14px;
        }
        .wa-thread-item:hover { background:rgba(0,168,132,0.06); transform:translateX(2px); }
        .wa-thread-item.active {
          background:linear-gradient(135deg, rgba(0,168,132,0.12) 0%, rgba(0,168,132,0.06) 100%);
          border-left:3px solid #00a884;
          padding-left:11px;
        }

        /* ── Scrollbars ──────────────────────────────────────── */
        .wa-scrollbar::-webkit-scrollbar { width:5px; }
        .wa-scrollbar::-webkit-scrollbar-track { background:transparent; }
        .wa-scrollbar::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.15); border-radius:4px; }
        .wa-scrollbar::-webkit-scrollbar-thumb:hover { background:rgba(0,168,132,0.4); }

        /* ── Message bubbles ─────────────────────────────────── */
        .wa-msg-bubble {
          max-width:65%; position:relative;
          border-radius:14px; padding:9px 62px 24px 13px;
          font-size:14.4px; line-height:1.55; min-width:76px;
          box-shadow:0 1px 4px rgba(0,0,0,0.10);
          animation:wa-fade-in .2s ease;
        }
        .wa-msg-out {
          background:linear-gradient(145deg, #e7fedd 0%, #d3f9c8 100%);
          color:#1a2e22;
          border-bottom-right-radius:4px;
          margin-left:auto;
          border:1px solid rgba(0,168,132,0.12);
        }
        .wa-msg-in {
          background:#ffffff;
          color:#1a2e22;
          border-bottom-left-radius:4px;
          margin-right:auto;
          border:1px solid rgba(0,0,0,0.06);
        }
        .wa-msg-time {
          position:absolute; bottom:6px; right:10px;
          font-size:11px; color:rgba(0,0,0,0.38);
          display:flex; align-items:center; gap:3px;
        }

        /* ── Admin content reset ─────────────────────────────── */
        .admin-content-wrap,
        .admin-main-content { border-radius:0!important; border:none!important; padding:0!important; }

        /* ── Filter tabs ─────────────────────────────────────── */
        .wa-filter-tab {
          padding:5px 16px; border-radius:20px;
          font-size:12.5px; font-weight:600;
          cursor:pointer; border:1.5px solid transparent;
          transition:all .18s; white-space:nowrap;
          letter-spacing:.01em;
        }
        .wa-filter-tab.active {
          background:linear-gradient(135deg,#00a884,#02c999);
          color:#fff; border-color:transparent;
          box-shadow:0 2px 10px rgba(0,168,132,0.35);
        }
        .wa-filter-tab:not(.active) { color:#667781; }
        .wa-filter-tab:hover:not(.active) { background:rgba(0,168,132,0.08); color:#00a884; border-color:rgba(0,168,132,0.2); }

        /* ── Input area ──────────────────────────────────────── */
        .wa-input-area {
          background:rgba(255,255,255,0.9);
          backdrop-filter:blur(12px);
          padding:10px 14px;
          display:flex; align-items:flex-end; gap:10px;
          border-top:1px solid rgba(0,0,0,0.07);
          flex-shrink:0;
          box-shadow:0 -2px 12px rgba(0,0,0,0.06);
        }
        .wa-input-box {
          flex:1; background:#f0f2f5;
          border:1.5px solid transparent; border-radius:24px;
          padding:10px 18px; color:#1a2e22; font-size:15px;
          outline:none; resize:none; min-height:44px; max-height:160px;
          transition:border-color .18s, box-shadow .18s;
        }
        .wa-input-box:focus { border-color:rgba(0,168,132,0.4); box-shadow:0 0 0 3px rgba(0,168,132,0.1); background:#fff; }
        .wa-input-box::placeholder { color:#a0aab4; }
        .wa-send-btn {
          width:44px; height:44px; border-radius:50%;
          background:linear-gradient(135deg,#00a884,#02c999);
          border:none; color:white; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:all .18s;
          box-shadow:0 3px 10px rgba(0,168,132,0.4);
        }
        .wa-send-btn:hover { transform:scale(1.08); box-shadow:0 5px 16px rgba(0,168,132,0.5); }
        .wa-send-btn:disabled { background:#d1d5db; box-shadow:none; cursor:not-allowed; transform:none; }

        /* ── Action buttons ──────────────────────────────────── */
        .wa-action-btn {
          width:100%; display:flex; align-items:center; gap:10px;
          padding:11px 14px; border-radius:12px;
          border:1.5px solid rgba(0,0,0,0.08);
          background:rgba(255,255,255,0.8);
          color:#2d3748; font-size:13.5px; font-weight:500;
          cursor:pointer; text-align:left;
          transition:all .18s; letter-spacing:.01em;
          box-shadow:0 1px 3px rgba(0,0,0,0.06);
        }
        .wa-action-btn:hover:not(:disabled) {
          background:#ffffff; border-color:rgba(0,168,132,0.3);
          box-shadow:0 4px 14px rgba(0,0,0,0.10);
          transform:translateY(-1px);
        }
        .wa-action-btn:disabled { opacity:0.38; cursor:not-allowed; }
        .wa-action-btn.active-blue  { background:rgba(59,130,246,0.08); border-color:rgba(59,130,246,0.3); color:#1d4ed8; }
        .wa-action-btn.active-red   { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.3); color:#dc2626; }
        .wa-action-btn.active-green { background:rgba(0,168,132,0.10); border-color:rgba(0,168,132,0.35); color:#059669; }
        .wa-action-btn.active-slate { background:rgba(100,116,139,0.08); border-color:rgba(100,116,139,0.25); color:#475569; }

        /* ── Right panel sections ────────────────────────────── */
        .wa-rp-section { padding:16px; border-bottom:1px solid rgba(0,0,0,0.06); }
        .wa-rp-label {
          font-size:10.5px; font-weight:800; text-transform:uppercase;
          letter-spacing:.16em; color:#00a884; margin-bottom:12px;
          display:flex; align-items:center; gap:6px;
        }
        .wa-rp-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(0,168,132,0.25),transparent); }

        /* ── Toggle switch ───────────────────────────────────── */
        .wa-toggle { position:relative; width:50px; height:28px; flex-shrink:0; }
        .wa-toggle input { opacity:0; width:0; height:0; }
        .wa-toggle-slider {
          position:absolute; cursor:pointer; inset:0;
          background:#d1d5db; border-radius:28px; transition:.3s;
          box-shadow:inset 0 1px 3px rgba(0,0,0,0.15);
        }
        .wa-toggle-slider:before {
          content:''; position:absolute; width:22px; height:22px;
          left:3px; bottom:3px; background:white; border-radius:50%;
          transition:.3s; box-shadow:0 1px 4px rgba(0,0,0,0.2);
        }
        .wa-toggle input:checked + .wa-toggle-slider { background:linear-gradient(135deg,#00a884,#02c999); }
        .wa-toggle input:checked + .wa-toggle-slider:before { transform:translateX(22px); }

        /* ── Skeleton loaders ────────────────────────────────── */
        @keyframes wa-skeleton { 0%,100%{opacity:.5} 50%{opacity:1} }
        .wa-skeleton { animation:wa-skeleton 1.5s ease-in-out infinite; background:linear-gradient(90deg,#f0f2f5 25%,#e5e7eb 50%,#f0f2f5 75%); background-size:400% 100%; }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width:768px) {
          .wa-sidebar { width:100%; max-width:100%; box-shadow:none; }
          .wa-chat { width:100%; }
          .wa-rpanel { display:none!important; }
          .wa-mobile-hidden { display:none!important; }
          .wa-mobile-show { display:flex!important; }
        }
        @media (min-width:769px) {
          .wa-sidebar { display:flex!important; }
          .wa-chat { display:flex!important; }
        }
        @keyframes wa-pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      <div className="wa-app">

        {/* â•â•â•â•â•â•â•â•â•â•â• LEFT SIDEBAR â•â•â•â•â•â•â•â•â•â•â• */}
        <aside className={`wa-sidebar${mobileView === 'chat' ? ' wa-mobile-hidden' : ''}`}>
          {/* Sidebar Header */}
          <div style={{ background:'linear-gradient(135deg,#00a884 0%,#02c999 100%)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, borderBottom:'none', boxShadow:'0 2px 8px rgba(0,168,132,0.25)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src="/kenia-avatar.png" alt="Kenia" style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'2px solid rgba(0,168,132,0.3)' }} />
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:'#ffffff', lineHeight:1.2 }}>Kenia IA</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:7, height:7, background:'#ffffff', borderRadius:'50%', display:'inline-block', animation:'wa-pulse-dot 2s infinite' }} />
                  {config.isEnabled !== false ? 'Activa' : 'En mantenimiento'}
                </p>
              </div>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              <button onClick={() => setShowNewChatModal(true)} title="Nuevo Chat" style={{ width:36, height:36, borderRadius:'50%', background:'transparent', border:'none', color:'rgba(255,255,255,0.9)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .15s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.18)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <MessageSquarePlus className="h-5 w-5" />
              </button>
              <button onClick={loadThreads as any} title="Actualizar" style={{ width:36, height:36, borderRadius:'50%', background:'transparent', border:'none', color:'rgba(255,255,255,0.9)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .15s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.18)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <RefreshCw className={`h-5 w-5 ${loadingThreads ? 'animate-spin' : ''}`} />
              </button>
              <Link href="/admin/ia" style={{ width:36, height:36, borderRadius:'50%', background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.9)', textDecoration:'none', transition:'background .15s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.18)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ background:'#f8fffe', padding:'8px 12px', display:'flex', gap:6, overflowX:'auto', flexShrink:0, borderBottom:'1px solid rgba(0,168,132,0.1)' }}>
            {[
              { label:'Hilos', value: compactNumber(stats.totalThreads), color:'#374151', accent:'rgba(107,114,128,0.1)', dot:'#9ca3af' },
              { label:'Sin leer', value: stats.unreadThreads, color: stats.unreadThreads > 0 ? '#92400e' : '#374151', accent: stats.unreadThreads > 0 ? 'rgba(251,191,36,0.12)' : 'rgba(107,114,128,0.1)', dot: stats.unreadThreads > 0 ? '#f59e0b' : '#9ca3af' },
              { label:'Bloqueados', value: stats.blockedThreads, color: stats.blockedThreads > 0 ? '#991b1b' : '#374151', accent: stats.blockedThreads > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(107,114,128,0.1)', dot: stats.blockedThreads > 0 ? '#ef4444' : '#9ca3af' },
              { label:'Tokens', value: compactNumber(stats.totalTokens), color:'#065f46', accent:'rgba(0,168,132,0.1)', dot:'#00a884' },
            ].map(s => (
              <div key={s.label} style={{ background:s.accent, borderRadius:10, padding:'6px 12px', textAlign:'center', flexShrink:0, border:`1px solid ${s.accent}`, minWidth:60 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginBottom:1 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
                  <p style={{ fontSize:15, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
                </div>
                <p style={{ fontSize:9.5, color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ padding:'10px 12px', background:'#ffffff', flexShrink:0, borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ background:'#f3f4f6', borderRadius:24, display:'flex', alignItems:'center', gap:8, padding:'7px 14px', border:'1.5px solid transparent', transition:'border-color .18s' }}>
              <Search className="h-4 w-4 shrink-0" style={{ color:'#9ca3af' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar conversación..."
                style={{ background:'transparent', border:'none', outline:'none', color:'#1f2937', fontSize:14, flex:1 }}
              />
              {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><X className="h-4 w-4" /></button>}
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
                  <div key={i} style={{ padding:'13px 16px', display:'flex', gap:12, alignItems:'center', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ width:49, height:49, borderRadius:'50%', background:'#f0f2f5', flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ height:14, background:'#f0f2f5', borderRadius:4, width:'60%', marginBottom:7 }} />
                      <div style={{ height:12, background:'#f0f2f5', borderRadius:4, width:'85%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredThreads.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', gap:12, color:'#667781' }}>
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
                  style={{ background: active ? undefined : undefined }}
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
                    {statusDot && <div style={{ position:'absolute', bottom:1, right:1, width:12, height:12, borderRadius:'50%', background:statusDot, border:'2px solid #ffffff' }} />}
                    {t.unreadCount > 0 && !active && (
                      <div style={{ position:'absolute', top:-2, right:-2, minWidth:18, height:18, borderRadius:9, background:'#00a884', color:'white', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px', border:'2px solid #ffffff' }}>
                        {t.unreadCount > 99 ? '99+' : t.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:3 }}>
                      <p style={{ fontSize:15, fontWeight:600, color:'#0f1c24', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'65%' }}>
                        {displayName}
                      </p>
                      <span style={{ fontSize:11.5, color: t.unreadCount > 0 ? '#00a884' : '#667781', flexShrink:0 }}>
                        {formatRelativeDate(t.lastAt)}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <p style={{ fontSize:13, color:'#667781', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', flex:1 }}>
                        {cinfo?.registered && cinfo.name
                          ? (t.preview || 'Sin mensajes')
                          : `+${t.phone} · ${t.preview || 'Sin mensajes'}`}
                      </p>
                      {cinfo?.orderCount != null && cinfo.orderCount > 0 && (
                        <span style={{ fontSize:9, background:'rgba(0,168,132,0.15)', color:'#00a884', borderRadius:4, padding:'1px 5px', fontWeight:700, flexShrink:0, whiteSpace:'nowrap' }}>
                          {cinfo.orderCount} ped
                        </span>
                      )}
                      {t.escalated && <span style={{ fontSize:9, background:'rgba(245,158,11,0.2)', color:'#b45309', borderRadius:4, padding:'1px 5px', fontWeight:700, flexShrink:0 }}>ESC</span>}
                      {t.spamBlocked && <span style={{ fontSize:9, background:'rgba(239,68,68,0.2)', color:'#dc2626', borderRadius:4, padding:'1px 5px', fontWeight:700, flexShrink:0 }}>SPAM</span>}
                    </div>
                    {cinfo?.registered && (
                      <p style={{ fontSize:10.5, color:'#1a7f5a', marginTop:1 }}>
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
                      <span style={{ fontSize:10, background:'rgba(0,168,132,0.2)', color:'#059669', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>
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
                  <button onClick={() => setShowOrdersPanel(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#667781' }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {loadingOrders ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}>
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color:'#667781' }} />
                  </div>
                ) : !customerMap[selectedPhone]?.orders?.length ? (
                  <p style={{ fontSize:13, color:'#667781', textAlign:'center', padding:'12px 0' }}>Sin pedidos registrados</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {customerMap[selectedPhone]!.orders!.map(o => (
                      <div key={o.id} style={{ background:'#f0f2f5', borderRadius:10, padding:'10px 12px', border:'1px solid #ced4d9' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#0f1c24' }}>#{o.code}</span>
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:5,
                            background: o.status === 'Entregado' ? 'rgba(52,211,153,0.15)' : o.status === 'Cancelado' ? 'rgba(239,68,68,0.15)' : o.status.includes('Pendiente') ? 'rgba(245,158,11,0.15)' : 'rgba(0,168,132,0.15)',
                            color: o.status === 'Entregado' ? '#059669' : o.status === 'Cancelado' ? '#dc2626' : o.status.includes('Pendiente') ? '#b45309' : '#00a884'
                          }}>{o.status}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#667781', marginBottom: o.items ? 4 : 0 }}>
                          <span>{o.date}</span>
                          <span style={{ fontWeight:700, color:'#3b4a54' }}>${o.total.toLocaleString('es-CL')}</span>
                        </div>
                        {o.items && <p style={{ fontSize:11, color:'#667781', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items}</p>}
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
              <div style={{ width:96, height:96, borderRadius:'50%', background:'rgba(255,255,255,0.7)', backdropFilter:'blur(8px)', border:'3px solid rgba(0,168,132,0.3)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(0,168,132,0.2)' }}>
                <MessageCircle className="h-11 w-11" style={{ color:'#00a884' }} />
              </div>
              <div style={{ textAlign:'center', animation:'wa-pop .4s ease' }}>
                <p style={{ fontSize:24, fontWeight:600, color:'#1f2937', marginBottom:8, letterSpacing:'-.02em' }}>Kenia Business Admin</p>
                <p style={{ fontSize:14, color:'#6b7280', maxWidth:340, lineHeight:1.6 }}>Selecciona un chat para ver los mensajes y gestionar a tus clientes con IA.</p>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                {[
                  { label:`${stats.totalThreads} chats`, bg:'rgba(255,255,255,0.7)', color:'#374151' },
                  { label:`${compactNumber(stats.totalTokens)} tokens`, bg:'rgba(0,168,132,0.1)', color:'#065f46' },
                  { label:`${stats.unreadThreads} sin leer`, bg: stats.unreadThreads > 0 ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.7)', color: stats.unreadThreads > 0 ? '#92400e' : '#374151' },
                ].map(s => (
                  <span key={s.label} style={{ background:s.bg, backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.6)', borderRadius:20, padding:'6px 16px', fontSize:13, color:s.color, fontWeight:600, boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>{s.label}</span>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ background:'rgba(255,255,255,0.92)', backdropFilter:'blur(12px)', padding:'10px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0, borderBottom:'1px solid rgba(0,0,0,0.07)', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
                {/* Back button mobile */}
                <button className="wa-mobile-show" onClick={() => setMobileView('list')}
                  style={{ display:'none', width:36, height:36, borderRadius:'50%', background:'transparent', border:'none', color:'#667781', cursor:'pointer', alignItems:'center', justifyContent:'center' }}>
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
                    <p style={{ fontSize:15, fontWeight:700, color:'#0f1c24' }}>
                      {customerMap[selectedPhone]?.name || `+${selectedPhone}`}
                    </p>
                    {customerMap[selectedPhone]?.registered && (
                      <span style={{ fontSize:10, background:'rgba(0,168,132,0.15)', color:'#00a884', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>
                        {customerMap[selectedPhone].orderCount > 0 ? `${customerMap[selectedPhone].orderCount} pedidos` : 'Registrado'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize:12.5, color:'#667781' }}>
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
                    style={{ width:36, height:36, borderRadius:'50%', background: showRightPanel ? 'rgba(0,168,132,0.15)' : 'transparent', border:'none', color: showRightPanel ? '#00a884' : '#667781', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}>
                    <Settings2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Status banners */}
              {thread?.usage.adminTakeover && (
                <div style={{ background:'rgba(59,130,246,0.12)', borderBottom:'1px solid rgba(59,130,246,0.2)', padding:'8px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, color:'#1d4ed8', fontSize:13, fontWeight:600 }}>
                    <UserCheck className="h-4 w-4" />
                    <span>Control manual activo — Kenia está pausada</span>
                  </div>
                  <button onClick={() => handleSetBlock(false)} disabled={savingBlock}
                    style={{ background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.3)', color:'#1d4ed8', borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                    Devolver a Kenia
                  </button>
                </div>
              )}
              {thread?.usage.escalated && !thread?.usage.adminTakeover && (
                <div style={{ background:'rgba(245,158,11,0.1)', borderBottom:'1px solid rgba(245,158,11,0.2)', padding:'8px 16px', display:'flex', alignItems:'center', gap:8, flexShrink:0, color:'#b45309', fontSize:13, fontWeight:600 }}>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Conversación escalada — Se necesita atención humana</span>
                </div>
              )}
              {thread?.usage.spamBlocked && (
                <div style={{ background:'rgba(239,68,68,0.1)', borderBottom:'1px solid rgba(239,68,68,0.2)', padding:'8px 16px', display:'flex', alignItems:'center', gap:8, flexShrink:0, color:'#dc2626', fontSize:13, fontWeight:600 }}>
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
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:10, color:'#667781' }}>
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
                              <span style={{ background:'rgba(255,255,255,0.75)', backdropFilter:'blur(8px)', color:'#6b7280', fontSize:11.5, fontWeight:600, padding:'5px 14px', borderRadius:20, boxShadow:'0 1px 6px rgba(0,0,0,0.1)', border:'1px solid rgba(255,255,255,0.8)' }}>
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
                                {isOut && <CheckCheck className="h-3.5 w-3.5" style={{ color: msg.readByUser ? '#53bdeb' : 'rgba(0,0,0,0.45)' }} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:10, color:'#667781' }}>
                    <MessageCircle className="h-10 w-10" style={{ opacity:.3 }} />
                    <p style={{ fontSize:14 }}>Sin mensajes en este chat</p>
                  </div>
                )}
              </div>

              {/* Scroll-to-bottom button */}
              {showScrollBtn && (
                <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior:'smooth' })}
                  style={{ position:'absolute', bottom:80, right: showRightPanel ? 396 : 16, width:42, height:42, borderRadius:'50%', background:'#f0f2f5', border:'1px solid #ced4d9', color:'#667781', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.4)', zIndex:10, transition:'all .2s', animation:'wa-slide-up .25s ease' }}>
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
          <div style={{ background:'linear-gradient(135deg,#00a884 0%,#02c999 100%)', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, borderBottom:'none', boxShadow:'0 2px 8px rgba(0,168,132,0.25)' }}>
            <p style={{ fontSize:14, fontWeight:700, color:'#ffffff', display:'flex', alignItems:'center', gap:8 }}>
              <Settings2 className="h-4 w-4" style={{ color:'rgba(255,255,255,0.8)' }} />
              Panel Kenia
              <span style={{ fontSize:10, fontWeight:800, padding:'2px 9px', borderRadius:12, background: config.isEnabled !== false ? 'rgba(255,255,255,0.25)' : 'rgba(239,68,68,0.3)', color:'#ffffff', letterSpacing:'.04em' }}>
                {config.isEnabled !== false ? '● ON' : '● OFF'}
              </span>
            </p>
            <button onClick={() => setShowRightPanel(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:30, height:30, cursor:'pointer', color:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X className="h-4 w-4" />
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
                          <p style={{ fontSize:14, fontWeight:700, color:'#0f1c24', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {cinfo?.name || `+${selectedPhone}`}
                          </p>
                          <p style={{ fontSize:12, color:'#667781' }}>
                            {cinfo?.name ? `+${selectedPhone} · ` : ''}{selectedSummary.totalMessages} mensajes
                          </p>
                        </div>
                        {thread?.usage && (
                          thread.usage.spamBlocked ? <span style={{ fontSize:10, background:'rgba(239,68,68,0.2)', color:'#dc2626', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>SPAM</span> :
                          thread.usage.adminTakeover ? <span style={{ fontSize:10, background:'rgba(59,130,246,0.2)', color:'#1d4ed8', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>ADMIN</span> :
                          thread.usage.escalated ? <span style={{ fontSize:10, background:'rgba(245,158,11,0.2)', color:'#b45309', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>ESC</span> :
                          thread.usage.blocked ? <span style={{ fontSize:10, background:'rgba(100,116,139,0.2)', color:'#475569', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>OFF</span> :
                          <span style={{ fontSize:10, background:'rgba(0,168,132,0.2)', color:'#059669', borderRadius:6, padding:'3px 8px', fontWeight:700 }}>OK</span>
                        )}
                      </div>
                      {cinfo?.registered && (
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                          {cinfo.email && (
                            <span style={{ fontSize:11, color:'#667781', background:'#f0f2f5', borderRadius:6, padding:'3px 8px', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' }}>{cinfo.email}</span>
                          )}
                          {cinfo.orderCount > 0 && (
                            <span style={{ fontSize:11, color:'#00a884', background:'rgba(0,168,132,0.1)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>
                              {cinfo.orderCount} pedido{cinfo.orderCount !== 1 ? 's' : ''}
                            </span>
                          )}
                          {cinfo.totalSpent > 0 && (
                            <span style={{ fontSize:11, color:'#059669', background:'rgba(52,211,153,0.08)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>
                              ${cinfo.totalSpent.toLocaleString('es-CL')} comprado
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Token bar */}
                <div style={{ background:'linear-gradient(135deg,#f0fdf8 0%,#e8faf3 100%)', borderRadius:14, padding:'14px 15px', border:'1px solid rgba(0,168,132,0.15)', boxShadow:'0 2px 8px rgba(0,168,132,0.08)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span style={{ fontSize:12, color:'#374151', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                      <Zap className="h-3.5 w-3.5" style={{ color:'#00a884' }} /> Uso de Tokens
                    </span>
                    <span style={{ fontSize:13, fontWeight:800, color: usageColor, background: usagePct >= 100 ? 'rgba(239,68,68,0.1)' : usagePct >= 75 ? 'rgba(245,158,11,0.1)' : 'rgba(0,168,132,0.12)', padding:'2px 8px', borderRadius:8 }}>{usagePct}%</span>
                  </div>
                  <div style={{ height:8, background:'rgba(0,0,0,0.08)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${usagePct}%`, background: usagePct >= 100 ? 'linear-gradient(90deg,#ef4444,#dc2626)' : usagePct >= 75 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#00a884,#059669)', borderRadius:4, transition:'width .6s cubic-bezier(.4,0,.2,1)' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, color:'#6b7280' }}>
                    <span>{thread?.usage.totalTokens.toLocaleString('es-CL') || 0} usados</span>
                    <span>lím. {thread?.usage.tokenLimit?.toLocaleString('es-CL') || config.tokenLimitPerCustomer.toLocaleString('es-CL')}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
                    {[['Prompt', thread?.usage.promptTokens || 0],['Respuesta', thread?.usage.responseTokens || 0]].map(([l,v]) => (
                      <div key={l as string} style={{ background:'rgba(255,255,255,0.7)', borderRadius:10, padding:'8px 10px', textAlign:'center', border:'1px solid rgba(0,168,132,0.12)' }}>
                        <p style={{ fontSize:9.5, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:3, fontWeight:700 }}>{l}</p>
                        <p style={{ fontSize:15, fontWeight:800, color:'#065f46' }}>{(v as number).toLocaleString('es-CL')}</p>
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
                  {thread.usage.overLimit ? <TrendingUp className="h-4 w-4 mt-0.5" style={{ color:'#dc2626', flexShrink:0 }} /> :
                   thread.usage.escalated ? <AlertTriangle className="h-4 w-4 mt-0.5" style={{ color:'#b45309', flexShrink:0 }} /> :
                   <Shield className="h-4 w-4 mt-0.5" style={{ color:'#059669', flexShrink:0 }} />}
                  <p style={{ fontSize:13, lineHeight:1.55, color: thread.usage.overLimit ? '#dc2626' : thread.usage.escalated ? '#b45309' : '#059669' }}>
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
                  <p style={{ fontSize:12, color:'#667781', marginBottom:5 }}>Limite de tokens por cliente</p>
                  <input type="number" min={1000} step={500} value={config.tokenLimitPerCustomer}
                    onChange={e => setConfig(p => ({ ...p, tokenLimitPerCustomer: Number(e.target.value || 0) }))}
                    style={{ background:'#f9fafb', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'10px 12px', color:'#111827', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' }} />
                </div>
                <div>
                  <p style={{ fontSize:12, color:'#667781', marginBottom:5 }}>Pausar tras N mensajes sin respuesta</p>
                  <input type="number" min={1} step={1} value={config.messageThresholdForPause}
                    onChange={e => setConfig(p => ({ ...p, messageThresholdForPause: Number(e.target.value || 10) }))}
                    style={{ background:'#f9fafb', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'10px 12px', color:'#111827', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' }} />
                </div>
                <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f0f2f5', border:'1px solid #ced4d9', borderRadius:10, padding:'9px 12px', cursor:'pointer' }}>
                  <div>
                    <span style={{ fontSize:13, color:'#3b4a54', display:'block' }}>Notificacion inteligente</span>
                    <span style={{ fontSize:11, color:'#667781' }}>Avisa al iniciar, al pausar y cada ~10 mensajes</span>
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
                      <span style={{ fontSize:10, background:'rgba(0,168,132,0.2)', color:'#059669', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>
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

                  <button className="wa-action-btn active-green"
                    onClick={() => handleSendTestTemplate(selectedPhone)}
                    disabled={sendingTemplate}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <Send className="h-4 w-4" style={{ flexShrink:0 }} />
                      <span>Enviar plantilla de prueba</span>
                    </div>
                    {sendingTemplate && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
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
                  <button onClick={() => setShowOrdersPanel(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#667781' }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {loadingOrders ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}>
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color:'#667781' }} />
                  </div>
                ) : !customerMap[selectedPhone]?.orders?.length ? (
                  <p style={{ fontSize:13, color:'#667781', textAlign:'center', padding:'12px 0' }}>Sin pedidos registrados</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {customerMap[selectedPhone]!.orders!.map(o => (
                      <div key={o.id} style={{ background:'#f0f2f5', borderRadius:10, padding:'10px 12px', border:'1px solid #ced4d9' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#0f1c24' }}>#{o.code}</span>
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:5,
                            background: o.status === 'Entregado' ? 'rgba(52,211,153,0.15)' : o.status === 'Cancelado' ? 'rgba(239,68,68,0.15)' : o.status.includes('Pendiente') ? 'rgba(245,158,11,0.15)' : 'rgba(0,168,132,0.15)',
                            color: o.status === 'Entregado' ? '#059669' : o.status === 'Cancelado' ? '#dc2626' : o.status.includes('Pendiente') ? '#b45309' : '#00a884'
                          }}>{o.status}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#667781', marginBottom: o.items ? 4 : 0 }}>
                          <span>{o.date}</span>
                          <span style={{ fontWeight:700, color:'#3b4a54' }}>${o.total.toLocaleString('es-CL')}</span>
                        </div>
                        {o.items && <p style={{ fontSize:11, color:'#667781', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items}</p>}
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
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.55)', backdropFilter:'blur(8px)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setConfirmAction(null)}>
          <div style={{ background:'#ffffff', borderRadius:20, padding:'28px 24px', maxWidth:340, width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', animation:'wa-pop .25s ease' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:42, height:42, borderRadius:12, background: confirmAction.type === 'delete' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {confirmAction.type === 'delete'
                  ? <Trash2 className="h-5 w-5" style={{ color:'#dc2626' }} />
                  : <RefreshCw className="h-5 w-5" style={{ color:'#b45309' }} />}
              </div>
              <p style={{ fontSize:16, fontWeight:700, color:'#111827' }}>
                {confirmAction.type === 'delete' ? 'Eliminar número' : 'Borrar historial'}
              </p>
            </div>
            <p style={{ fontSize:13.5, color:'#6b7280', lineHeight:1.65, marginBottom:22 }}>
              {confirmAction.type === 'delete'
                ? 'Se eliminarán todos los mensajes y el registro de este número. Esta acción no se puede deshacer.'
                : 'Se borrarán todos los mensajes del historial de este chat. El estado de IA se mantiene.'}
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setConfirmAction(null)}
                style={{ flex:1, background:'#f3f4f6', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'11px', color:'#374151', fontSize:13.5, fontWeight:600, cursor:'pointer' }}>
                Cancelar
              </button>
              <button
                onClick={() => confirmAction.type === 'delete'
                  ? handleDeleteThread(confirmAction.phone)
                  : handleClearHistory(confirmAction.phone)}
                style={{ flex:1, background: confirmAction.type === 'delete' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#f59e0b,#d97706)', border:'none', borderRadius:12, padding:'11px', color:'white', fontSize:13.5, fontWeight:700, cursor:'pointer', boxShadow: confirmAction.type === 'delete' ? '0 4px 12px rgba(239,68,68,0.35)' : '0 4px 12px rgba(245,158,11,0.35)' }}>
                {confirmAction.type === 'delete' ? 'Eliminar' : 'Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {message && (
        <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:9999, animation:'wa-slide-up .3s cubic-bezier(.34,1.56,.64,1)' }}>
          <div style={{
            display:'flex', alignItems:'center', gap:10, borderRadius:14, padding:'12px 20px',
            fontSize:13.5, fontWeight:600,
            boxShadow:'0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
            background:'#ffffff',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            whiteSpace:'nowrap',
            borderLeft: `4px solid ${message.type === 'success' ? '#00a884' : '#ef4444'}`,
          }}>
            {message.type === 'success'
              ? <CheckCheck className="h-4 w-4" style={{ color:'#00a884' }} />
              : <AlertTriangle className="h-4 w-4" style={{ color:'#ef4444' }} />}
            {message.text}
          </div>
        </div>
      )}
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.55)', backdropFilter:'blur(8px)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setShowNewChatModal(false)}>
          <div style={{ background:'#ffffff', borderRadius:20, padding:'28px 24px', maxWidth:400, width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.16)', animation:'wa-pop .25s ease' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div>
                <h3 style={{ margin:0, color:'#111827', fontSize:18, fontWeight:700, letterSpacing:'-.02em' }}>Nuevo Chat</h3>
                <p style={{ margin:'2px 0 0', color:'#9ca3af', fontSize:12.5 }}>Inicia conversación o envía plantilla de prueba</p>
              </div>
              <button onClick={() => setShowNewChatModal(false)} style={{ background:'#f3f4f6', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', color:'#6b7280', display:'flex', alignItems:'center', justifyContent:'center' }}><X className="h-4 w-4" /></button>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', color:'#374151', fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:'.01em' }}>Número de teléfono</label>
              <input type="text" value={newChatPhone} onChange={e => setNewChatPhone(e.target.value)} placeholder="56912345678"
                style={{ width:'100%', background:'#f9fafb', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'11px 14px', color:'#111827', fontSize:15, boxSizing:'border-box', outline:'none', transition:'border-color .18s' }}
                onFocus={e => e.target.style.borderColor='#00a884'}
                onBlur={e => e.target.style.borderColor='#e5e7eb'} />
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', color:'#374151', fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:'.01em' }}>Nombre <span style={{ color:'#9ca3af', fontWeight:400 }}>(opcional)</span></label>
              <input type="text" value={newChatName} onChange={e => setNewChatName(e.target.value)} placeholder="Ej: Juan Pérez"
                style={{ width:'100%', background:'#f9fafb', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'11px 14px', color:'#111827', fontSize:15, boxSizing:'border-box', outline:'none', transition:'border-color .18s' }}
                onFocus={e => e.target.style.borderColor='#00a884'}
                onBlur={e => e.target.style.borderColor='#e5e7eb'} />
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={handleCreateNewChat} disabled={!newChatPhone || newChatPhone.length < 8}
                style={{ width:'100%', background:'linear-gradient(135deg,#00a884,#02c999)', border:'none', borderRadius:12, padding:'13px', color:'white', fontSize:14, fontWeight:700, cursor:(!newChatPhone || newChatPhone.length < 8) ? 'not-allowed' : 'pointer', opacity:(!newChatPhone || newChatPhone.length < 8) ? 0.45 : 1, boxShadow:'0 4px 14px rgba(0,168,132,0.35)' }}>
                Abrir panel del cliente
              </button>

              <button onClick={handleSendNewTestTemplate} disabled={!newChatPhone || newChatPhone.length < 8 || sendingNewTemplate}
                style={{ width:'100%', background:'#f9fafb', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'12px', color:'#374151', fontSize:14, fontWeight:600, cursor:(!newChatPhone || newChatPhone.length < 8 || sendingNewTemplate) ? 'not-allowed' : 'pointer', opacity:(!newChatPhone || newChatPhone.length < 8 || sendingNewTemplate) ? 0.45 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {sendingNewTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" style={{ color:'#00a884' }} />}
                Enviar plantilla de prueba
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

