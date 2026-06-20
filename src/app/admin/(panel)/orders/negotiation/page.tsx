'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID, ADMIN_CHAT_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order } from '@/types/admin';
import { RefreshCw, AlertTriangle, Play, ClipboardList, CheckCircle, MessageSquare, Send, X, Bot, User, Eye, Clock, CheckCircle2, AlertCircle, Package, Inbox, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NegotiationOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderInput, setOrderInput] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [sendingIaId, setSendingIaId] = useState<string | null>(null);

  const [selectedChat, setSelectedChat] = useState<{ phone: string; customerName: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatPhoneForChat = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '').trim();
    if (cleaned.startsWith('56')) return cleaned;
    if (cleaned.length === 9 && cleaned.startsWith('9')) return '56' + cleaned;
    return cleaned;
  };

  const loadChatHistory = useCallback(async (phone: string) => {
    setLoadingChat(true);
    try {
      const formatted = formatPhoneForChat(phone);
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const res = await databases.listDocuments(databaseId, ADMIN_CHAT_COLLECTION_ID, [
        Query.equal('userId', 'whatsapp:' + formatted),
        Query.orderAsc('$createdAt'),
        Query.limit(100)
      ]);
      setMessages(res.documents);
    } catch (e: any) {
      console.error('Error al cargar historial de chat:', e);
    } finally {
      setLoadingChat(false);
    }
  }, []);

  const handleOpenChat = (phone: string, customerName: string) => {
    setSelectedChat({ phone, customerName });
    loadChatHistory(phone);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setSendingMessage(true);
    try {
      const formatted = formatPhoneForChat(selectedChat.phone);
      const res = await fetch('/api/admin/whatsapp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatted, message: newMessage.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        setNewMessage('');
        await loadChatHistory(selectedChat.phone);
      } else {
        alert('Error al enviar mensaje: ' + (data.error || 'Ocurrió un error'));
      }
    } catch (e: any) {
      alert('Error de red al enviar: ' + e.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendToIa = async (orderId: string) => {
    setSendingIaId(orderId);
    try {
      const res = await fetch('/api/cron/negotiation?secret=negotiation_secret_key_2026&orderId=' + orderId);
      const data = await res.json();
      if (res.ok) {
        if (data.processed && data.processed.length > 0) {
          alert('Negociación iniciada con éxito. Mensaje enviado al cliente.');
        } else if (data.skipped_no_missing && data.skipped_no_missing.length > 0) {
          alert('Error: El pedido no tiene productos marcados como faltantes. Ve al pedido, marca qué productos faltan en el "Panel de Negociación por Productos Faltantes" y luego vuelve a intentarlo.');
        } else if (data.send_errors && data.send_errors.length > 0) {
          alert('Error al enviar WhatsApp:\n' + data.send_errors.join('\n'));
        } else if (data.has_wa_token === false) {
          alert('Error: WHATSAPP_ACCESS_TOKEN no está configurado en las variables de entorno.');
        } else {
          alert('Error: No se pudo enviar el mensaje. Revisa la consola del servidor para más detalles.');
        }
        loadNegotiationOrders();
      } else {
        alert('Error al negociar: ' + (data.error || 'Ocurrió un error'));
      }
    } catch (e: any) {
      alert('Error de red al negociar: ' + e.message);
    } finally {
      setSendingIaId(null);
    }
  };

  const loadNegotiationOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const res = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
        Query.equal('STATUS', 'negotiation'),
        Query.orderDesc('CREATEDAT'),
        Query.limit(100)
      ]);
      setOrders(res.documents as unknown as Order[]);
    } catch (e: any) {
      setError('Error al cargar pedidos en negociación: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNegotiationOrders();
  }, [loadNegotiationOrders]);

  const standardizeCode = (input: string) => {
    const cleaned = input.trim().replace(/^#/, '').toUpperCase();
    if (cleaned.startsWith('ORD-')) return cleaned;
    if (/^\d+$/.test(cleaned)) return 'ORD-' + cleaned.padStart(5, '0');
    return cleaned;
  };

  const handleAddOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    const parts = orderInput.split(/[\s,;\n]+/).map(p => p.trim()).filter(Boolean);
    const codesToSearch = Array.from(new Set(parts.map(standardizeCode)));

    if (codesToSearch.length === 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      let addedCount = 0;
      let notFound: string[] = [];

      for (const code of codesToSearch) {
        const res = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
          Query.equal('ORDERCODE', code),
          Query.limit(1)
        ]);

        if (res.documents && res.documents.length > 0) {
          const doc = res.documents[0];
          if (doc.STATUS !== 'negotiation') {
            await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, doc.$id, {
              STATUS: 'negotiation',
              UPDATEDAT: Date.now()
            });
          }
          addedCount++;
        } else {
          notFound.push(code);
        }
      }

      setSuccessMsg('Se procesaron con éxito los pedidos. ' + addedCount + ' pedidos están ahora en negociación.');
      if (notFound.length > 0) {
        setError('No se encontraron los siguientes códigos de pedido: ' + notFound.join(', '));
      }
      setOrderInput('');
      loadNegotiationOrders();
    } catch (e: any) {
      setError('Error al procesar pedidos: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  type NegotiationStatus = 'not_opened' | 'in_progress' | 'partial' | 'complete';

  const getNegotiationStatus = (order: Order): { status: NegotiationStatus; missingCount: number; replacedCount: number; openedAt?: number } => {
    let parsed: any[] = [];
    try { parsed = JSON.parse(order.ITEMS || '[]'); } catch {}
    const missingCount = parsed.filter(it => it.missing === true).length;
    const replacedCount = parsed.filter(it => it.replaced === true).length;
    const openedAt = (order as any).NEGOTIATION_OPENED_AT as number | undefined;

    if (missingCount === 0 && replacedCount > 0) return { status: 'complete', missingCount, replacedCount, openedAt };
    if (missingCount > 0 && replacedCount > 0) return { status: 'partial', missingCount, replacedCount, openedAt };
    if (openedAt) return { status: 'in_progress', missingCount, replacedCount, openedAt };
    return { status: 'not_opened', missingCount, replacedCount, openedAt };
  };

  const statusConfig: Record<NegotiationStatus, { label: string; bg: string; text: string; border: string; icon: string; dot: string }> = {
    not_opened: { label: 'Link no abierto', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: '📭', dot: 'bg-gray-400' },
    in_progress: { label: 'Cambio en proceso', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '⏳', dot: 'bg-amber-500' },
    partial: { label: 'Cambio parcial', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '🔄', dot: 'bg-blue-500' },
    complete: { label: 'Cambio completo', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✅', dot: 'bg-emerald-500' },
  };

  const stats = orders.reduce((acc, o) => {
    const s = getNegotiationStatus(o);
    acc[s.status]++;
    acc.total++;
    return acc;
  }, { not_opened: 0, in_progress: 0, partial: 0, complete: 0, total: 0 });

  const statsCards = [
    { key: 'total', label: 'Total', value: stats.total, icon: Inbox, color: 'from-pink-500 to-rose-500' },
    { key: 'not_opened', label: 'No abiertos', value: stats.not_opened, icon: Eye, color: 'from-gray-400 to-gray-500' },
    { key: 'in_progress', label: 'En proceso', value: stats.in_progress + stats.partial, icon: Clock, color: 'from-amber-400 to-orange-500' },
    { key: 'complete', label: 'Completos', value: stats.complete, icon: CheckCircle2, color: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </span>
            Negociación de Pedidos
          </h1>
          <p className="text-sm text-gray-500 mt-1">Administra pedidos con faltantes y coordina reemplazos con tus clientes.</p>
        </div>
        <button
          onClick={loadNegotiationOrders}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw className={'w-3.5 h-3.5 ' + (isLoading ? 'animate-spin' : '')} />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsCards.map((s) => (
          <div key={s.key} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{s.value}</p>
              </div>
              <div className={'w-10 h-10 rounded-xl bg-gradient-to-br ' + s.color + ' flex items-center justify-center shadow-sm'}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Agregar Pedidos a Negociación</h2>
            <p className="text-xs text-gray-400">Ingresa los números de pedido separados por comas o saltos de línea (ej: 9, 91, 13, ORD-00001).</p>
          </div>
        </div>

        <form onSubmit={handleAddOrders} className="space-y-3">
          <textarea
            value={orderInput}
            onChange={e => setOrderInput(e.target.value)}
            placeholder="Ej: 9, 91, 13, 1"
            rows={3}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !orderInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl text-sm font-semibold hover:from-pink-700 hover:to-rose-700 transition disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                'Establecer en Negociación'
              )}
            </button>
          </div>
        </form>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-gray-50/80 to-white">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-pink-500" />
            Pedidos en Negociación ({orders.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 space-y-3 animate-pulse">
                <div className="flex justify-between"><div className="h-4 w-24 bg-gray-100 rounded" /><div className="h-4 w-16 bg-gray-100 rounded" /></div>
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
            ))
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-2">
                <ClipboardList className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-semibold text-sm text-gray-500">No hay pedidos en negociación</p>
              <p className="text-xs text-gray-400">Usa el formulario superior para añadir pedidos.</p>
            </div>
          ) : (
            orders.map(order => {
              const date = order.CREATEDAT ? new Date(order.CREATEDAT) : new Date(order.$createdAt);
              let itemsCount = 0;
              let hasMissing = false;
              try {
                const parsed = JSON.parse(order.ITEMS || '[]');
                itemsCount = parsed.length;
                hasMissing = parsed.some((it: any) => it.missing === true);
              } catch {}

              const negStatus = getNegotiationStatus(order);
              const sc = statusConfig[negStatus.status];

              return (
                <div key={order.$id} className="p-5 hover:bg-gray-50/40 transition group">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-gray-900">#{order.ORDERCODE}</span>
                        <span className={'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ' + sc.bg + ' ' + sc.text + ' border ' + sc.border}>
                          <span className={'w-1.5 h-1.5 rounded-full ' + sc.dot} />
                          {sc.icon} {sc.label}
                        </span>
                        {hasMissing && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            Faltantes
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold">{order.CUSTOMERNAME}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-500">{fmt(order.TOTAL)}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {itemsCount} productos
                        </span>
                        {negStatus.missingCount > 0 && (
                          <span className="flex items-center gap-1 text-red-500 font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            Faltan: {negStatus.missingCount}
                          </span>
                        )}
                        {negStatus.replacedCount > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Reemplazados: {negStatus.replacedCount}
                          </span>
                        )}
                        {negStatus.openedAt && (
                          <span className="flex items-center gap-1 text-amber-600">
                            <Eye className="w-3 h-3" />
                            Abierto: {new Date(negStatus.openedAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {hasMissing && (
                        <button
                          onClick={() => handleSendToIa(order.$id)}
                          disabled={sendingIaId !== null}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl text-xs font-bold hover:from-pink-700 hover:to-rose-700 transition disabled:opacity-50 shadow-sm"
                        >
                          {sendingIaId === order.$id ? (
                            <>
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              Negociar IA
                            </>
                          )}
                        </button>
                      )}
                      {order.CUSTOMERPHONE && (
                        <button
                          onClick={() => handleOpenChat(order.CUSTOMERPHONE!, order.CUSTOMERNAME || 'Cliente')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat
                        </button>
                      )}
                      <Link
                        href={'/admin/orders/' + order.$id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
                      >
                        Abrir
                        <Play className="w-3 h-3 fill-white stroke-none" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat History Modal */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50">
              <div>
                <h3 className="text-sm font-extrabold text-gray-950 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Chat con {selectedChat.customerName}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">{selectedChat.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadChatHistory(selectedChat.phone)}
                  disabled={loadingChat}
                  className="p-1.5 rounded-lg border border-emerald-100 bg-white hover:bg-emerald-50 text-emerald-700 transition disabled:opacity-50"
                  title="Actualizar chat"
                >
                  <RefreshCw className={'w-3.5 h-3.5 ' + (loadingChat ? 'animate-spin' : '')} />
                </button>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-1.5 rounded-lg border border-gray-250 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              {loadingChat && messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="space-y-2 text-center">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">Cargando conversación...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2 p-6">
                  <Bot className="w-8 h-8 text-gray-300" />
                  <p className="text-xs font-bold">No hay mensajes registrados aún</p>
                  <p className="text-[11px] text-gray-400 max-w-xs">
                    Cuando la IA envíe la propuesta o respondas, verás la conversación aquí.
                  </p>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isAdmin = msg.senderRole === 'admin';
                  const date = new Date(msg.$createdAt);
                  const isKenia = isAdmin && (msg.message.includes('Kenia') || msg.message.includes('IA') || msg.message.includes('🤖'));

                  return (
                    <div
                      key={msg.$id}
                      className={'flex gap-3 max-w-[85%] ' + (isAdmin ? 'ml-auto flex-row-reverse' : 'mr-auto')}
                    >
                      <div
                        className={'w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ' +
                          (isAdmin
                            ? isKenia ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200')
                        }
                      >
                        {isAdmin ? (isKenia ? '🤖' : '👤') : '💬'}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div
                          className={'rounded-2xl px-4 py-2.5 text-xs whitespace-pre-wrap leading-relaxed shadow-sm ' +
                            (isAdmin
                              ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                              : 'bg-white border border-gray-150 text-gray-800 rounded-tl-none')
                          }
                        >
                          {msg.message}
                        </div>
                        <div
                          className={'text-[10px] text-gray-400 font-medium ' + (isAdmin ? 'text-right' : 'text-left')}
                        >
                          {isAdmin ? (isKenia ? 'Kenia (IA)' : 'Admin') : 'Cliente'} ·{' '}
                          {date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                disabled={sendingMessage}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={sendingMessage || !newMessage.trim()}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition disabled:opacity-50 shrink-0"
              >
                {sendingMessage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
