'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order, OrderStatus } from '@/types/admin';
import { Search, RefreshCw, ChevronDown, Eye, AlertTriangle, X, Download, ArrowUpDown, ArrowUp, ArrowDown, MapPin } from 'lucide-react';
import { getWarehouseLocationFromFeatures } from '@/lib/product-features';
import Link from 'next/link';
import EpicPagination from '@/components/admin/EpicPagination';

const PAGE_SIZE = 30;

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  all:                { label: 'Todos',                     bg: 'bg-gray-100',    text: 'text-gray-700' },
  pending:            { label: 'Pendiente',                 bg: 'bg-amber-100',   text: 'text-amber-700' },
  processing:         { label: 'Pago a Verificar',          bg: 'bg-blue-100',    text: 'text-blue-700' },
  paid:               { label: 'Pago Verificado',           bg: 'bg-emerald-100', text: 'text-emerald-700' },
  assembling:         { label: 'Armando',                   bg: 'bg-indigo-100',  text: 'text-indigo-700' },
  negotiation:        { label: 'Negociación',                bg: 'bg-pink-100',    text: 'text-pink-700' },
  preparing_shipping: { label: 'Etiqueta Lista', bg: 'bg-orange-100', text: 'text-orange-700' },
  ready_to_ship:      { label: 'Pedido listo para enviar', bg: 'bg-cyan-100',    text: 'text-cyan-700' },
  shipped:            { label: 'Enviado',                   bg: 'bg-violet-100',  text: 'text-violet-700' },
  delivered:          { label: 'Entregado',                 bg: 'bg-green-100',   text: 'text-green-700' },
  cancelled:          { label: 'Cancelado',                 bg: 'bg-red-100',     text: 'text-red-700' },
};

const STATUS_KEYS = Object.keys(STATUS_CONFIG);

type DateFilter = 'all' | 'today' | '7d' | '30d' | '90d';
const DATE_FILTER_LABELS: Record<DateFilter, string> = { all: 'Todos', today: 'Hoy', '7d': '7d', '30d': '30d', '90d': '90d' };

function OrdersContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('status') || 'all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const filterUserId = searchParams.get('userId') || '';
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [productLocations, setProductLocations] = useState<Record<string, { section: number | null; gondola: string | null }>>({}); // product id -> location
  const [agenciesList, setAgenciesList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // page cursors: key = page number, value = cursor to use to reach that page
  const pageCursorsRef = React.useRef<Map<number, string | null>>(new Map([[1, null]]));

  // Load agencies list
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/agencies');
        const data = await res.json();
        if (data.agencies) setAgenciesList(data.agencies);
      } catch {}
    })();
  }, []);

  const getAgencyDetails = (name: string) => {
    if (!name) return null;
    const found = agenciesList.find(a => a.name.toUpperCase() === name.toUpperCase());
    return {
      name: found?.name || name,
      color: found?.color || '#6d28d9',
      bg: found?.bg || '#f5f3ff',
      logo: found?.logo || ''
    };
  };

  const toggleSort = (col: 'date' | 'total') => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };
  const load = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const queries = [Query.orderDesc('CREATEDAT'), Query.limit(PAGE_SIZE)];
      if (activeFilter !== 'all') {
        queries.push(Query.equal('STATUS', activeFilter));
      } else {
        queries.push(Query.equal('STATUS', [
          'processing', 'paid', 'assembling',
          'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped'
        ]));
      }
      // Use stored cursor for the requested page
      const pageCursor = pageCursorsRef.current.get(page) ?? null;
      if (pageCursor) queries.push(Query.cursorAfter(pageCursor));

      const resp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, queries);
      const newOrders = resp.documents as unknown as Order[];
      setOrders(newOrders);
      setTotalCount(resp.total);
      setCurrentPage(page);

      // Store the last doc cursor so next page can use it
      if (newOrders.length > 0) {
        pageCursorsRef.current.set(page + 1, newOrders[newOrders.length - 1].$id);
      }
    } catch (e: any) { setError(e.message); }
    finally { setIsLoading(false); }
  }, [activeFilter]);

  const autoDeliverShippedOrders = useCallback(async () => {
    try {
      const lastCheck = localStorage.getItem('yaxsel-last-auto-delivery-check');
      const now = Date.now();
      if (lastCheck && now - parseInt(lastCheck) < 4 * 60 * 60 * 1000) {
        return;
      }
      
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
      
      const resp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
        Query.equal('STATUS', 'shipped'),
        Query.lessThan('UPDATEDAT', twoDaysAgo),
        Query.limit(20)
      ]);
      
      localStorage.setItem('yaxsel-last-auto-delivery-check', now.toString());
      
      if (resp.documents.length === 0) return;
      
      const { notifyOrderStatusChange } = await import('@/services/notificationService');
      
      for (const doc of resp.documents) {
        const orderId = doc.$id;
        await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
          STATUS: 'delivered',
          UPDATEDAT: now
        });
        notifyOrderStatusChange(doc as unknown as Order, 'shipped', 'delivered').catch(() => {});
      }
      
      load(1);
    } catch (err) {
      console.error('Error auto-delivering orders:', err);
    }
  }, [load]);

  // Reset pagination when filter changes
  useEffect(() => {
    pageCursorsRef.current = new Map([[1, null]]);
    setCurrentPage(1);
    load(1);
    autoDeliverShippedOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => setSelected(s => s.size === filtered.length ? new Set() : new Set(filtered.map(o => o.$id)));

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selected.size === 0) return;
    setBulkUpdating(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // If bulk cancelling, restore stock for all selected orders
      // (only for products with real stock, not the 99999 ilimitado sentinel)
      if (newStatus === 'cancelled') {
        const selectedOrders = orders.filter(o => selected.has(o.$id));
        for (const order of selectedOrders) {
          let items: { id?: string; qty?: number }[] = [];
          try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
          for (const item of items) {
            if (item.id && item.qty) {
              try {
                const product = await databases.getDocument(databaseId, PRODUCTS_COLLECTION_ID, item.id);
                const currentStock = (product as any).STOCK || 0;
                // No restituir si el producto tiene stock ilimitado (sentinel 99999)
                if (currentStock === 99999) continue;
                await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, item.id, {
                  STOCK: currentStock + item.qty,
                });
              } catch (err) { console.error('Error restoring stock for product', item.id, err); }
            }
          }
        }
      }

      const selectedOrders = orders.filter(o => selected.has(o.$id));
      await Promise.all(selectedOrders.map(o =>
        databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, o.$id, { STATUS: newStatus, UPDATEDAT: Date.now() })
      ));
      const { notifyOrderStatusChange } = await import('@/services/notificationService');
      await Promise.all(
        selectedOrders.map(o =>
          notifyOrderStatusChange(o, o.STATUS, newStatus).catch(() => {})
        )
      );
      setOrders(prev => prev.map(o => selected.has(o.$id) ? { ...o, STATUS: newStatus as OrderStatus } : o));
      setSelected(new Set());
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setBulkUpdating(false); }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const orderBefore = orders.find(o => o.$id === orderId);
    const prevStatus = orderBefore?.STATUS;
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // If cancelling, restore stock (only for products with real stock, not the 99999 sentinel)
      if (newStatus === 'cancelled') {
        const order = orderBefore;
        if (order) {
          let items: { id?: string; qty?: number }[] = [];
          try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
          for (const item of items) {
            if (item.id && item.qty) {
              try {
                const product = await databases.getDocument(databaseId, PRODUCTS_COLLECTION_ID, item.id);
                const currentStock = (product as any).STOCK || 0;
                // No restituir si el producto tiene stock ilimitado (sentinel 99999)
                if (currentStock === 99999) continue;
                await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, item.id, {
                  STOCK: currentStock + item.qty,
                });
              } catch (err) { console.error('Error restoring stock for product', item.id, err); }
            }
          }
        }
      }

      await databases.updateDocument(databaseId, ORDERS_COLLECTION_ID, orderId, {
        STATUS: newStatus,
        UPDATEDAT: Date.now(),
      });
      setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, STATUS: newStatus as OrderStatus } : o));
      if (orderBefore) {
        const { notifyOrderStatusChange } = await import('@/services/notificationService');
        await notifyOrderStatusChange(orderBefore, prevStatus, newStatus).catch(() => {});
      }
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setUpdatingId(null); }
  };

  const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const exportCSV = () => {
    const headers = ['Código', 'Cliente', 'RUT', 'Teléfono', 'Región', 'Comuna', 'Total', 'Estado', 'Método Pago', 'Cupón', 'Items', 'Notas Admin', 'Fecha'];
    const rows = filtered.map(o => {
      let itemCount = 0;
      try { itemCount = JSON.parse(o.ITEMS || '[]').length; } catch {}
      return [
        o.ORDERCODE || '',
        o.CUSTOMERNAME || '',
        o.CUSTOMERRUT || '',
        o.CUSTOMERPHONE || '',
        o.REGION || '',
        o.COMUNA || '',
        o.TOTAL,
        (o.STATUS === 'ready_to_ship' && o.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA') ? 'Listo para retirar' : (STATUS_CONFIG[o.STATUS]?.label || o.STATUS),
        o.PAYMENTMETHOD || '',
        (o as any).COUPONCODE || '',
        itemCount,
        (o as any).adminNotes || '',
        o.CREATEDAT ? new Date(o.CREATEDAT).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }) : new Date(o.$createdAt).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }),
      ];
    });
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `pedidos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const sortedFiltered = [...orders].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'total') return (a.TOTAL - b.TOTAL) * mul;
    const ta = a.CREATEDAT || new Date(a.$createdAt).getTime();
    const tb = b.CREATEDAT || new Date(b.$createdAt).getTime();
    return (ta - tb) * mul;
  });

  const paymentMethods = ['all', ...Array.from(new Set(orders.map(o => o.PAYMENTMETHOD || 'Sin método').filter(Boolean)))];
  const regions = ['all', ...Array.from(new Set(orders.map(o => (o as any).REGION || '').filter(Boolean))).sort()];

  const filtered = sortedFiltered.filter(o => {
    if (filterUserId && o.USERID !== filterUserId) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(
        o.ORDERCODE?.toLowerCase().includes(q) ||
        o.CUSTOMERNAME?.toLowerCase().includes(q) ||
        o.CUSTOMERRUT?.toLowerCase().includes(q) ||
        o.CUSTOMERPHONE?.includes(q) ||
        o.CUSTOMEREMAIL?.toLowerCase().includes(q) ||
        o.adminNotes?.toLowerCase().includes(q)
      )) return false;
    }
    if (dateFilter !== 'all') {
      const ts = o.CREATEDAT || new Date(o.$createdAt).getTime();
      if (dateFilter === 'today') {
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        if (ts < startOfDay.getTime()) return false;
      } else {
        const days = { '7d': 7, '30d': 30, '90d': 90 }[dateFilter as '7d'|'30d'|'90d'];
        if (days) { const cutoff = Date.now() - days * 86400000; if (ts < cutoff) return false; }
      }
    }
    if (paymentFilter !== 'all') {
      const pm = o.PAYMENTMETHOD || 'Sin método';
      if (pm !== paymentFilter) return false;
    }
    if (regionFilter !== 'all') {
      const r = (o as any).REGION || '';
      if (r !== regionFilter) return false;
    }
    if (liveOnly && !(o as any).PURCHASEDFROMLIVE) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            {(() => { const items = filtered.reduce((s, o) => { try { return s + (JSON.parse(o.ITEMS || '[]') as any[]).reduce((a: number, i: any) => a + (i.quantity || 1), 0); } catch { return s; } }, 0); return items > 0 ? <span className="ml-2 text-xs text-gray-400">{items} artículos</span> : null; })()}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={filtered.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50">
            <Download className="w-4 h-4" />CSV
          </button>
          <button onClick={() => { pageCursorsRef.current = new Map([[1, null]]); load(1); }} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />Actualizar
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_KEYS.map(s => (
          <button key={s} onClick={() => setActiveFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${activeFilter === s ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {STATUS_CONFIG[s].label}
          </button>
        ))}
        {paymentMethods.length > 2 && (
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            {paymentMethods.map(pm => (
              <option key={pm} value={pm}>{pm === 'all' ? 'Todos los métodos' : pm}</option>
            ))}
          </select>
        )}
        {regions.length > 2 && (
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            {regions.map(r => (
              <option key={r} value={r}>{r === 'all' ? 'Todas las regiones' : r}</option>
            ))}
          </select>
        )}
        {orders.some(o => (o as any).PURCHASEDFROMLIVE) && (
          <button onClick={() => setLiveOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition border ${liveOnly ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            🔴 Solo Live
          </button>
        )}
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden ml-auto">
          {(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map(d => (
            <button key={d} onClick={() => setDateFilter(d)}
              className={`px-3 py-1.5 text-xs font-medium transition ${dateFilter === d ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {DATE_FILTER_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Region filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por código, nombre, RUT o teléfono..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
        </div>
        {(() => {
          const regions = Array.from(new Set(orders.map(o => (o as any).REGION).filter(Boolean))).sort();
          if (regions.length < 2) return null;
          return (
            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0">
              <option value="all">Todas las regiones</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          );
        })()}
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 flex-wrap p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <span className="text-sm font-medium text-indigo-700">{selected.size} seleccionado{selected.size !== 1 ? 's' : ''}</span>
          <span className="text-indigo-300">|</span>
          <span className="text-xs text-indigo-600">Cambiar a:</span>
          {(['pending', 'processing', 'paid', 'assembling', 'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
            <button key={s} onClick={() => bulkUpdateStatus(s)} disabled={bulkUpdating}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition disabled:opacity-60 ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} hover:opacity-80`}>
              {STATUS_CONFIG[s].label}
            </button>
          ))}
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-indigo-500 hover:text-indigo-700">Limpiar</button>
        </div>
      )}

      {/* Mobile Card List & Desktop Table view */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 space-y-3 animate-pulse">
                <div className="flex justify-between"><div className="h-4 w-24 bg-gray-100 rounded" /><div className="h-4 w-16 bg-gray-100 rounded" /></div>
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No se encontraron pedidos</div>
          ) : (
            filtered.map(order => {
              const date = order.CREATEDAT ? new Date(order.CREATEDAT) : new Date(order.$createdAt);
              const ageMs = Date.now() - date.getTime();
              const isOverdue = order.STATUS === 'pending' && ageMs > 3 * 86400000;
              let items: any[] = [];
              try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
              const hasMissing = items.some((it: any) => it.missing === true);
              const isWarning = hasMissing && ['pending', 'processing'].includes(order.STATUS);
              const agency = order.SHIPPINGAGENCY || '';

              return (
                <div key={order.$id} className={`p-4 space-y-3 hover:bg-gray-50 transition-colors ${selected.has(order.$id) ? 'bg-indigo-50/60' : isWarning ? 'bg-amber-50/70' : isOverdue ? 'bg-red-50/50' : ''}`}
                  onClick={() => window.location.href = `/admin/orders/${order.$id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(order.$id)}
                        onChange={() => toggleSelect(order.$id)}
                        className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
                      <span className="font-mono text-xs text-indigo-600 font-bold hover:underline">{order.ORDERCODE || '—'}</span>
                    </div>
                    {(() => {
                      const isRetiro = order.STATUS === 'ready_to_ship' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
                      const bg = isRetiro ? 'bg-fuchsia-100' : (STATUS_CONFIG[order.STATUS]?.bg || 'bg-gray-100');
                      const text = isRetiro ? 'text-fuchsia-700' : (STATUS_CONFIG[order.STATUS]?.text || 'text-gray-700');
                      const label = isRetiro ? 'Listo para retirar' : (STATUS_CONFIG[order.STATUS]?.label || order.STATUS);
                      return (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${text}`}>
                          {label}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{order.CUSTOMERNAME}</p>
                      {isWarning && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-250 animate-pulse">⚠️ FALTAN PROD.</span>}
                      {isOverdue && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-500 text-white rounded">VENCIDO</span>}
                      {(order as any).PURCHASEDFROMLIVE && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-600 text-white rounded">LIVE</span>}
                    </div>
                    <p className="text-xs text-gray-500">{order.CUSTOMERPHONE || ''} · {order.COMUNA || '—'}, {order.REGION || '—'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {agency && (() => {
                        const details = getAgencyDetails(agency);
                        return (
                          <span 
                            style={{ 
                              color: details?.color, 
                              backgroundColor: details?.bg, 
                              borderColor: details?.color + '20' 
                            }} 
                            className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1"
                          >
                            {details?.logo && (
                              <img src={details.logo} alt="" className="w-3.5 h-3.5 object-contain rounded-full" />
                            )}
                            {details?.name}
                          </span>
                        );
                      })()}
                      {order.PAYMENTMETHOD && <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{order.PAYMENTMETHOD}</span>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{fmt(order.TOTAL)}</p>
                      <p className="text-[10px] text-gray-400">{items.length} art.</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Región</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Agencia</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <button onClick={() => toggleSort('total')} className="flex items-center gap-1 ml-auto hover:text-gray-700 transition">
                    Total
                    {sortBy === 'total' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                  </button>
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-gray-700 transition">
                    Fecha
                    {sortBy === 'date' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                  </button>
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7,8].map(j => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No se encontraron pedidos</td></tr>
              ) : (
                filtered.map(order => {
                  const date = order.CREATEDAT ? new Date(order.CREATEDAT) : new Date(order.$createdAt);
                  const isUpdating = updatingId === order.$id;
                  const ageMs = Date.now() - date.getTime();
                  const isOverdue = order.STATUS === 'pending' && ageMs > 3 * 86400000;
                  
                  let items: any[] = [];
                  try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
                  const hasMissing = items.some((it: any) => it.missing === true);
                  const isWarning = hasMissing && ['pending', 'processing'].includes(order.STATUS);
 
                  return (
                    <React.Fragment key={order.$id}>
                    <tr className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected.has(order.$id) ? 'bg-indigo-50/60' : isWarning ? 'bg-amber-50/70 hover:bg-amber-100/70' : isOverdue ? 'bg-red-50/50' : ''}`}
                      onClick={() => window.location.href = `/admin/orders/${order.$id}`}>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={selected.has(order.$id)}
                          onChange={() => toggleSelect(order.$id)}
                          className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-semibold hover:underline">{order.ORDERCODE || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-medium text-gray-900 truncate max-w-[130px]">{order.CUSTOMERNAME}</p>
                          {isWarning && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-150 text-amber-800 rounded shrink-0 border border-amber-250 animate-pulse">
                              ⚠️ FALTAN PROD.
                            </span>
                          )}
                          {isOverdue && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-500 text-white rounded shrink-0">VENCIDO</span>}
                          {(order as any).PURCHASEDFROMLIVE && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-600 text-white rounded shrink-0">LIVE</span>}
                          {(order as any).ISGIFT && <span className="text-[9px] font-bold px-1 py-0.5 bg-pink-100 text-pink-700 rounded shrink-0">🎁 REGALO</span>}
                          {(order as any).CUSTOMERNOTE && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title={(order as any).CUSTOMERNOTE} />}
                          {order.adminNotes && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" title="Tiene notas internas" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-gray-400">{order.CUSTOMERPHONE || ''}</p>
                          {order.COUPONCODE && <span className="text-[9px] font-mono font-bold px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded">{order.COUPONCODE}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{order.REGION || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        {order.SHIPPINGAGENCY ? (() => {
                          const details = getAgencyDetails(order.SHIPPINGAGENCY);
                          return (
                            <span 
                              style={{ 
                                color: details?.color, 
                                backgroundColor: details?.bg, 
                                borderColor: details?.color + '20' 
                              }} 
                              className="px-2 py-0.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1"
                            >
                              {details?.logo && (
                                <img src={details.logo} alt="" className="w-3.5 h-3.5 object-contain rounded-full" />
                              )}
                              {details?.name}
                            </span>
                          );
                        })() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-semibold text-gray-900">{fmt(order.TOTAL)}</p>
                        {(() => { try { const items = JSON.parse(order.ITEMS || '[]'); return items.length > 0 ? <p className="text-[10px] text-gray-400">{items.length} art.</p> : null; } catch { return null; } })()}
                      </td>
                      <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <div className="relative inline-block">
                          {(() => {
                            const isRetiro = order.STATUS === 'ready_to_ship' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
                            const bg = isRetiro ? 'bg-fuchsia-100' : (STATUS_CONFIG[order.STATUS]?.bg || 'bg-gray-100');
                            const text = isRetiro ? 'text-fuchsia-700' : (STATUS_CONFIG[order.STATUS]?.text || 'text-gray-700');
                            return (
                              <select
                                value={order.STATUS}
                                onChange={e => updateStatus(order.$id, e.target.value)}
                                disabled={isUpdating}
                                className={`appearance-none text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-6 ${bg} ${text}`}
                              >
                                {Object.entries(STATUS_CONFIG).filter(([k]) => k !== 'all').map(([k, v]) => {
                                  const label = (k === 'ready_to_ship' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA') ? 'Listo para retirar' : v.label;
                                  return <option key={k} value={k}>{label}</option>;
                                })}
                              </select>
                            );
                          })()}
                          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-gray-500">{date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', timeZone: 'America/Santiago' })}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {Math.floor(ageMs / 86400000) === 0 ? 'Hoy' : `hace ${Math.floor(ageMs / 86400000)}d`}
                          {order.PAYMENTMETHOD ? ` · ${order.PAYMENTMETHOD}` : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={async () => {
                          const newId = expandedOrderId === order.$id ? null : order.$id;
                          setExpandedOrderId(newId);
                          // Fetch product locations for this order
                          if (newId) {
                            try {
                              let items: { id?: string }[] = [];
                              try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
                              const ids = items.map(i => i.id).filter(Boolean) as string[];
                              if (ids.length > 0) {
                                const { databases } = getServices();
                                const { databaseId } = getAppwriteConfig();
                                const locs: Record<string, { section: number | null; gondola: string | null }> = { ...productLocations };
                                for (const pid of ids) {
                                  if (locs[pid]) continue; // already cached
                                  try {
                                    const doc: any = await databases.getDocument(databaseId, PRODUCTS_COLLECTION_ID, pid);
                                    const wh = getWarehouseLocationFromFeatures(doc.FEATURES);
                                    locs[pid] = { section: wh.section, gondola: wh.gondola };
                                  } catch { locs[pid] = { section: null, gondola: null }; }
                                }
                                setProductLocations(locs);
                              }
                            } catch {}
                          }
                        }}
                          className={`p-1.5 rounded-lg transition-colors inline-flex ${expandedOrderId === order.$id ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-indigo-50 text-gray-400 hover:text-indigo-600'}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.$id && (() => {
                      let items: {name:string;qty:number;price:number;total:number;img?:string}[] = [];
                      try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
                      const note = (order as any).CUSTOMERNOTE;
                      const gift = (order as any).ISGIFT;
                      return (
                        <tr className="bg-indigo-50/30">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* Items */}
                              <div className="lg:col-span-2">
                                <p className="text-xs font-semibold text-gray-500 mb-2">PRODUCTOS ({items.length})</p>
                                <div className="space-y-1.5">
                                  {items.map((it: any, i: number) => {
                                    const loc = it.id ? productLocations[it.id] : null;
                                    const itemMissing = !!it.missing;
                                    return (
                                      <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${itemMissing ? 'bg-red-50 border-red-250 text-red-900' : 'bg-white border-gray-100'}`}>
                                        {it.img && <img src={it.img} alt="" className="w-8 h-8 object-contain rounded" />}
                                        <span className="text-sm flex-1 truncate">{it.name}</span>
                                        {itemMissing && (
                                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded shrink-0 border border-red-200">
                                            ⚠️ Sin stock
                                          </span>
                                        )}
                                        {loc && loc.section !== null && !itemMissing && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold shrink-0">
                                            <MapPin className="w-2.5 h-2.5" /> G{loc.gondola} S{loc.section}
                                          </span>
                                        )}
                                        <span className="text-xs text-gray-400">×{it.qty}</span>
                                        <span className="text-sm font-medium text-gray-900">{fmt(it.total || it.price * it.qty)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Details sidebar */}
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1">ENVÍO</p>
                                  <p className="text-sm text-gray-700">{order.ADDRESS || '—'}</p>
                                  <p className="text-xs text-gray-500">{order.COMUNA}, {order.REGION}</p>
                                  <p className="text-xs text-gray-500">{order.SHIPPINGAGENCY || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1">CONTACTO</p>
                                  <p className="text-sm text-gray-700">{order.CUSTOMERNAME}</p>
                                  <p className="text-xs text-gray-500">{order.CUSTOMERPHONE} · {order.CUSTOMEREMAIL}</p>
                                  <p className="text-xs text-gray-500">RUT: {order.CUSTOMERRUT || '—'}</p>
                                </div>
                                {(note || gift) && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">NOTAS</p>
                                    {gift && <p className="text-xs text-pink-600 font-medium mb-1">🎁 Pedido marcado como regalo</p>}
                                    {note && <p className="text-sm text-gray-700 bg-amber-50 rounded px-2 py-1 border border-amber-100">{note}</p>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
            {filtered.length > 0 && !isLoading && (() => {
              const totalSum = filtered.reduce((s, o) => s + o.TOTAL, 0);
              const subtotalSum = filtered.reduce((s, o) => s + (o.SUBTOTAL || o.TOTAL), 0);
              const shippingSum = filtered.reduce((s, o) => s + (o.SHIPPINGCOST || 0), 0);
              const paidOrders = filtered.filter(o => ['paid','processing','shipped','delivered'].includes(o.STATUS));
              const avgTicket = paidOrders.length > 0 ? Math.round(paidOrders.reduce((s,o)=>s+o.TOTAL,0)/paidOrders.length) : 0;
              const couponDiscount = filtered.reduce((s, o) => s + (o.DISCOUNTAMOUNT || 0), 0);
              return (
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td colSpan={2} className="px-4 py-3 text-xs font-semibold text-gray-500">
                      <p>{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</p>
                      {(() => {
                        const byCustomer: Record<string, { name: string; total: number }> = {};
                        for (const o of filtered) {
                          const key = o.CUSTOMERRUT || o.CUSTOMERNAME || 'anon';
                          if (!byCustomer[key]) byCustomer[key] = { name: o.CUSTOMERNAME || key, total: 0 };
                          byCustomer[key].total += o.TOTAL;
                        }
                        const top = Object.values(byCustomer).sort((a, b) => b.total - a.total)[0];
                        return top && Object.keys(byCustomer).length > 1 ? (
                          <p className="text-[10px] text-gray-400 mt-0.5 font-normal truncate max-w-[120px]">
                            Top: {top.name.split(' ')[0]} {fmt(top.total)}
                          </p>
                        ) : null;
                      })()}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell" />
                    <td className="px-4 py-3 hidden lg:table-cell" />
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold text-gray-900">{fmt(totalSum)}</p>
                      {shippingSum > 0 && (
                        <p className="text-[10px] text-gray-400">{fmt(subtotalSum)} + {fmt(shippingSum)} env.</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-400">
                      {fmt(paidOrders.reduce((s, o) => s + o.TOTAL, 0))} pagados
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400 hidden md:table-cell">
                      {avgTicket > 0 && <p>{`∅ ${fmt(avgTicket)}`}</p>}
                      {couponDiscount > 0 && <p className="text-emerald-600">-{fmt(couponDiscount)} cupones</p>}
                      {(() => {
                        const totalItems = filtered.reduce((s, o) => { try { return s + (JSON.parse(o.ITEMS || '[]') as any[]).reduce((a: number, i: any) => a + (i.quantity || 1), 0); } catch { return s; } }, 0);
                        const avgItems = filtered.length > 0 ? (totalItems / filtered.length).toFixed(1) : null;
                        return avgItems ? <p className="text-gray-400">∅ {avgItems} art./pedido</p> : null;
                      })()}
                    </td>
                    <td className="hidden md:table-cell" />
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
        
        <EpicPagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / PAGE_SIZE)}
          onPageChange={(page) => load(page)}
          isLoading={isLoading}
          pageSize={PAGE_SIZE}
          totalItems={totalCount}
          className="border-t border-gray-100"
        />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-10 bg-gray-100 rounded-xl" /><div className="h-64 bg-gray-100 rounded-2xl" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
