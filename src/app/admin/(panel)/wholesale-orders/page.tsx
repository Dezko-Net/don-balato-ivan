'use client';

import { useEffect, useState, useCallback } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, WHOLESALE_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { 
  RefreshCw, AlertTriangle, Search, X, ChevronDown, ChevronUp, 
  Package, MessageSquare, Save, XCircle, Download, CheckCircle, Clock, Phone, MapPin, ExternalLink, ShieldCheck, ShoppingCart
} from 'lucide-react';

interface WholesaleOrder {
  $id: string;
  USERID: string;
  ITEMS: string; // JSON string of items
  CUSTOMERNAME: string;
  CUSTOMERRUT?: string;
  CUSTOMERPHONE: string;
  CUSTOMEREMAIL: string;
  REGION?: string;
  COMUNA?: string;
  ADDRESS: string;
  ADDITIONALINFO?: string;
  SHIPPINGAGENCY?: string;
  SUBTOTAL: number;
  TOTAL: number;
  REQCODE: string;
  STATUS: 'pending_stock' | 'stock_confirmed' | 'partial_stock' | 'waiting_payment' | 'paid' | 'cancelled';
  CREATEDAT: number;
  CUSTOMERNOTE?: string;
  ADMINNOTES?: string;
  $createdAt: string;
  $updatedAt: string;
}

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending_stock:   { label: 'Verificando Stock',  bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-amber-200' },
  stock_confirmed: { label: 'Stock Confirmado',   bg: 'bg-emerald-50',  text: 'text-emerald-700',  border: 'border-emerald-200' },
  partial_stock:   { label: 'Stock Parcial',      bg: 'bg-orange-50',   text: 'text-orange-700',   border: 'border-orange-200' },
  waiting_payment: { label: 'Esperando Pago',     bg: 'bg-blue-50',     text: 'text-blue-700',     border: 'border-blue-200' },
  paid:            { label: 'Pago Recibido',      bg: 'bg-green-100',   text: 'text-green-800',    border: 'border-green-300' },
  cancelled:       { label: 'Cancelado',          bg: 'bg-red-50',      text: 'text-red-700',      border: 'border-red-200' },
};

function formatPrice(val: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
}

function formatDate(ts: number | string) {
  const d = typeof ts === 'number' ? new Date(ts) : new Date(ts);
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function WholesaleOrdersPage() {
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Admin notes editing state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  
  // Status update state
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true); 
    setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const queries = [Query.orderDesc('$createdAt'), Query.limit(100)];
      
      const resp = await databases.listDocuments(databaseId, WHOLESALE_ORDERS_COLLECTION_ID, queries);
      setOrders(resp.documents as unknown as WholesaleOrder[]);
    } catch (e: any) { 
      setError('Error al cargar pedidos: ' + e.message); 
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    load(); 
  }, [load]);

  const updateOrderStatus = async (id: string, status: WholesaleOrder['STATUS']) => {
    setUpdatingStatusId(id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      await databases.updateDocument(databaseId, WHOLESALE_ORDERS_COLLECTION_ID, id, { STATUS: status });
      setOrders(prev => prev.map(o => o.$id === id ? { ...o, STATUS: status } : o));
    } catch (e: any) {
      alert('Error al actualizar estado: ' + e.message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const saveAdminNotes = async (id: string) => {
    setSavingNotes(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      await databases.updateDocument(databaseId, WHOLESALE_ORDERS_COLLECTION_ID, id, { ADMINNOTES: notesDraft });
      setOrders(prev => prev.map(o => o.$id === id ? { ...o, ADMINNOTES: notesDraft } : o));
      setEditingNotesId(null);
    } catch (e: any) {
      alert('Error al guardar notas: ' + e.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const getWhatsAppLink = (phone: string, reqCode: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('56') ? cleanPhone : `56${cleanPhone}`;
    const text = encodeURIComponent(`Hola, te contacto sobre tu cotización/pedido mayorista #${reqCode} en Yaxsell...`);
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  const parseItems = (raw: string): any[] => {
    try { 
      return JSON.parse(raw); 
    } catch { 
      return []; 
    }
  };

  // Filter and search
  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.STATUS !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.CUSTOMERNAME?.toLowerCase().includes(q) ||
      o.CUSTOMEREMAIL?.toLowerCase().includes(q) ||
      o.CUSTOMERPHONE?.includes(q) ||
      o.REQCODE?.toLowerCase().includes(q) ||
      o.CUSTOMERRUT?.includes(q)
    );
  });

  const stats = {
    all: orders.length,
    pending_stock: orders.filter(o => o.STATUS === 'pending_stock').length,
    stock_confirmed: orders.filter(o => o.STATUS === 'stock_confirmed').length,
    partial_stock: orders.filter(o => o.STATUS === 'partial_stock').length,
    waiting_payment: orders.filter(o => o.STATUS === 'waiting_payment').length,
    paid: orders.filter(o => o.STATUS === 'paid').length,
    cancelled: orders.filter(o => o.STATUS === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos Mayoristas</h1>
          <p className="text-sm text-gray-500">
            Gestiona los pedidos de compra en volumen y asegura stock antes del pago.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />Actualizar
          </button>
        </div>
      </div>

      {/* Status Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        <button onClick={() => setFilter('all')} 
          className={`bg-white rounded-2xl border p-3 text-left shadow-sm transition hover:border-gray-300 ${filter === 'all' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
          <p className="text-xl font-bold text-gray-900">{stats.all}</p>
          <span className="text-xs font-semibold text-gray-500">Todos</span>
        </button>
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`bg-white rounded-2xl border p-3 text-left shadow-sm transition hover:border-gray-300 ${filter === key ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
            <p className="text-xl font-bold text-gray-900">{stats[key as keyof typeof stats] || 0}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por código de pedido, cliente, RUT, teléfono..."
          className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-4 h-4" /></button>}
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No se encontraron pedidos mayoristas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(order => {
              const isExpanded = expandedId === order.$id;
              const items = parseItems(order.ITEMS);
              const cfg = STATUS_CFG[order.STATUS] || { label: order.STATUS, bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };

              return (
                <div key={order.$id} className="transition-all hover:bg-gray-50/50">
                  {/* Card Header Summary */}
                  <div className="p-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order.$id)}>
                    <div className="min-w-0 flex-1 flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">#{order.REQCODE}</span>
                          <span className="text-xs text-gray-500 font-medium">{order.CUSTOMERNAME}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(order.CREATEDAT)} · {items.length} producto{items.length !== 1 ? 's' : ''} · {order.COMUNA || 'Comuna no especificada'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-gray-900 text-sm">{formatPrice(order.TOTAL)}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="bg-gray-50/60 p-5 border-t border-gray-100 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        
                        {/* 1. Products list */}
                        <div className="md:col-span-2 space-y-3">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productos en el pedido</h3>
                          <div className="space-y-2">
                            {items.map((it: any, index: number) => (
                              <div key={index} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-xs">
                                {it.img ? (
                                  <img src={it.img} alt={it.name} className="w-12 h-12 object-cover rounded-lg border border-gray-100 shrink-0" />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 text-xl border border-gray-100">📦</div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-900 text-xs truncate">{it.name}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                    {it.sku && <span>SKU: <span className="font-mono text-gray-600">{it.sku}</span></span>}
                                    {it.isPack && <span className="bg-purple-50 text-purple-700 px-1 py-0.5 rounded font-bold">Paquete de {it.packQty || 1} un.</span>}
                                    <span>Cant: {it.qty}</span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-gray-900 text-xs">{formatPrice(it.total)}</p>
                                  <p className="text-[9px] text-gray-400">{formatPrice(it.price)} c/u</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Customer & Delivery info */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Datos del Cliente</h3>
                            <div className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-2 text-xs shadow-xs">
                              <p className="font-medium text-gray-800">{order.CUSTOMERNAME}</p>
                              {order.CUSTOMERRUT && <p className="text-gray-500">RUT: {order.CUSTOMERRUT}</p>}
                              <p className="text-gray-500">{order.CUSTOMEREMAIL}</p>
                              <p className="text-gray-500 flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-gray-400" /> {order.CUSTOMERPHONE}
                              </p>
                              <div className="pt-2 flex gap-2">
                                <a href={getWhatsAppLink(order.CUSTOMERPHONE, order.REQCODE)} target="_blank" rel="noopener noreferrer" 
                                  className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition no-underline">
                                  WhatsApp <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Envío y Entrega</h3>
                            <div className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-2 text-xs shadow-xs">
                              <p className="text-gray-700 flex items-start gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                                <span>{order.ADDRESS}</span>
                              </p>
                              {order.REGION && <p className="text-gray-500 ml-4.5">{order.COMUNA}, {order.REGION}</p>}
                              {order.SHIPPINGAGENCY && (
                                <p className="text-xs font-bold text-indigo-600 mt-1 ml-4.5">
                                  Agencia: {order.SHIPPINGAGENCY}
                                </p>
                              )}
                              {order.ADDITIONALINFO && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg text-[11px] text-gray-500 border border-gray-100">
                                  <p className="font-semibold mb-0.5">Indicaciones:</p>
                                  {order.ADDITIONALINFO}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Action controls & Status change */}
                      <div className="border-t border-gray-200/80 pt-4 flex flex-col md:flex-row gap-4 items-stretch justify-between">
                        
                        {/* Status Select action buttons */}
                        <div className="flex-1 space-y-2">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones de Estado</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {([
                              ['pending_stock', 'Verificando Stock'],
                              ['stock_confirmed', 'Confirmar Stock'],
                              ['partial_stock', 'Stock Parcial'],
                              ['waiting_payment', 'Esperar Pago'],
                              ['paid', 'Confirmar Pago'],
                              ['cancelled', 'Cancelar']
                            ] as const).map(([statusKey, statusLabel]) => {
                              const isCurrent = order.STATUS === statusKey;
                              return (
                                <button key={statusKey} disabled={updatingStatusId !== null}
                                  onClick={() => updateOrderStatus(order.$id, statusKey)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${
                                    isCurrent 
                                      ? 'bg-indigo-600 border-indigo-600 text-white cursor-default' 
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                                  }`}>
                                  {statusLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Customer note & Internal Notes */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nota del Cliente</h4>
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs min-h-[70px] italic">
                              {order.CUSTOMERNOTE || 'Sin comentarios adicionales.'}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>Notas de Administración</span>
                              {editingNotesId !== order.$id ? (
                                <button onClick={() => {
                                  setEditingNotesId(order.$id);
                                  setNotesDraft(order.ADMINNOTES || '');
                                }} className="text-indigo-600 hover:text-indigo-700 text-[10px] font-bold">
                                  Editar
                                </button>
                              ) : null}
                            </h4>
                            {editingNotesId === order.$id ? (
                              <div className="space-y-1.5">
                                <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)}
                                  placeholder="Ej: Stock verificado en bodega principal, esperando transferencia."
                                  className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" rows={2} />
                                <div className="flex justify-end gap-1.5">
                                  <button onClick={() => setEditingNotesId(null)} className="px-2.5 py-1 text-[10px] font-bold border border-gray-200 bg-white rounded-lg text-gray-500 hover:bg-gray-100 transition">
                                    Cancelar
                                  </button>
                                  <button onClick={() => saveAdminNotes(order.$id)} disabled={savingNotes}
                                    className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1">
                                    <Save className="w-3 h-3" /> Guardar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white border border-gray-100 text-gray-700 p-3 rounded-xl text-xs min-h-[70px]">
                                {order.ADMINNOTES || <span className="text-gray-400 italic">No hay notas agregadas.</span>}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
