'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { Query, ID } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order, OrderStatus } from '@/types/admin';
import { Search, RefreshCw, ChevronDown, Eye, AlertTriangle, X, Download, ArrowUpDown, ArrowUp, ArrowDown, MapPin, Calendar, Package, Copy, Image as ImageIcon, Loader2, Printer } from 'lucide-react';
import { getWarehouseLocationFromFeatures, getSkuFromFeatures } from '@/lib/product-features';
import { generateOrderPdf } from '@/lib/generateOrderPdf';
import Link from 'next/link';
import EpicPagination from '@/components/admin/EpicPagination';

const STATUS_FLOW = ['processing', 'paid', 'payment_review', 'payment_confirmed', 'shipped', 'delivered'];

// BluExpress no requiere paso extra (etiqueta se imprime antes); retiro en tienda termina antes.
const isBluexpress = (agency?: string) => !!agency && agency.toUpperCase().replace(/\s/g, '').includes('BLUEXPRESS');
const isPickup = (agency?: string) => !!agency && agency.toUpperCase() === 'RETIRO EN TIENDA';
// Pedido de agencia (no BluExpress, no retiro) ya despachado pero sin N° de seguimiento ni voucher.
const needsTracking = (o: Order) =>
  ['shipped', 'delivered'].includes(o.STATUS) &&
  !!o.SHIPPINGAGENCY && !isPickup(o.SHIPPINGAGENCY) && !isBluexpress(o.SHIPPINGAGENCY) &&
  !(o.TRACKINGNUMBER && o.TRACKINGNUMBER.trim()) && !(o.SHIPPINGPROOFURL && o.SHIPPINGPROOFURL.trim());

const STATUS_SVG: Record<string, React.ReactNode> = {
  pending:            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>,
  pending_stock:      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>,
  processing:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="7"/><path d="M8 11h6M11 8v6"/></svg>,
  paid:               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M9 11.5l2 2 4-4"/></svg>,
  payment_confirmed:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>,
  payment_review:     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14v18l-2.5-1.6L14 21l-2-1.6L10 21l-2.5-1.6L5 21z"/><path d="M9 8h6M9 12h4"/></svg>,
  negotiation:        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H8l-4 3V5a2 2 0 012-2h13a2 2 0 012 2z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/></svg>,
  shipped:            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>,
  delivered:          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13"/><path d="M3 21h18"/><path d="M9 21v-7h6v7"/></svg>,
  cancelled:          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
};

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending:            { color: '#fb923c', bg: '#fff3e6' },
  pending_stock:      { color: '#eab308', bg: '#fefce8' },
  processing:         { color: '#eab308', bg: '#fefce8' },
  paid:               { color: '#fb923c', bg: '#fff3e6' },
  payment_review:     { color: '#60a5fa', bg: '#f5f9ff' },
  payment_confirmed:  { color: '#34d399', bg: '#f0fdf4' },
  negotiation:        { color: '#f472b6', bg: '#fefcfd' },
  shipped:            { color: '#a78bfa', bg: '#f3effe' },
  delivered:          { color: '#4ade80', bg: '#f7fef9' },
  cancelled:          { color: '#f87171', bg: '#feebeb' },
};

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  all:                { label: 'Todos',                     bg: 'bg-gray-100',    text: 'text-gray-700' },
  paid_group:         { label: 'Confirmados',               bg: 'bg-green-100',   text: 'text-green-700' },
  pending:            { label: 'Recibido',                  bg: 'bg-orange-100',  text: 'text-orange-700' },
  pending_stock:      { label: 'Comprobando Stock',       bg: 'bg-yellow-100',  text: 'text-yellow-700' },
  cancelled:          { label: 'Cancelado',                 bg: 'bg-red-100',     text: 'text-red-700' },
  processing:         { label: 'Comprobando Stock',     bg: 'bg-yellow-100',    text: 'text-yellow-700' },
  paid:               { label: 'Stock Confirmado',        bg: 'bg-orange-100',   text: 'text-orange-700' },
  payment_review:     { label: 'Revisando Pago',          bg: 'bg-blue-100',    text: 'text-blue-700' },
  payment_confirmed:  { label: 'Pago Confirmado',         bg: 'bg-green-100',   text: 'text-green-700' },
  negotiation:        { label: 'Negociando',                bg: 'bg-pink-100',    text: 'text-pink-700' },
  shipped:            { label: 'Embalado',                   bg: 'bg-violet-100',  text: 'text-violet-700' },
  delivered:          { label: 'Entregado a Agencia',      bg: 'bg-green-100',   text: 'text-green-700' },
};

// Etiquetas cortas para los badges (evita el bug de label.split(' ')[0] que mostraba "Pago" en ambos)
const SHORT_LABEL: Record<string, string> = {
  pending:            'Recibido',
  pending_stock:      'C. Stock',
  processing:         'C. Stock',
  paid:               'Stock Conf.',
  payment_review:     'Rev. Pago',
  payment_confirmed:  'Pago Conf.',
  negotiation:        'Negociando',
  shipped:            'Embalado',
  delivered:          'Entregado',
  cancelled:          'Cancelado',
};

const STATUS_KEYS = Object.keys(STATUS_CONFIG);

const CASHIERS = [
  { name: 'Lissy', phone: '56962293893' },
  { name: 'Fernanda', phone: '56967294975' },
];

type DateFilter = 'all' | 'today' | 'yesterday' | 'day_before' | 'custom';
const DATE_FILTER_LABELS: Record<DateFilter, string> = { all: 'Todos', today: 'Hoy', yesterday: 'Ayer', day_before: 'Anteayer', custom: 'Rango' };

function OrdersContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('status') || 'all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  // Status counts for the custom date range — fetched on demand (see effect below)
  const [customStatusCounts, setCustomStatusCounts] = useState<Record<string, number>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [trackingPending, setTrackingPending] = useState(false);
  const [pickupReady, setPickupReady] = useState(false);
  const filterUserId = searchParams.get('userId') || '';
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [timelineOrderId, setTimelineOrderId] = useState<string | null>(null);
  const [drawerOrderId, setDrawerOrderId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [cashierPickerOrderId, setCashierPickerOrderId] = useState<string | null>(null);
  const [cashierPickerMode, setCashierPickerMode] = useState<'stock' | 'shipping'>('stock');
  const [waShortcutOrderId, setWaShortcutOrderId] = useState<string | null>(null);
  const [agenciesList, setAgenciesList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateStart, setExportDateStart] = useState('');
  const [exportDateEnd, setExportDateEnd] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printStatuses, setPrintStatuses] = useState<string[]>(['paid', 'shipped']);
  // Stats cache — persists until manual refresh
  const [statsCache, setStatsCache] = useState<{ totalToday: number; countToday: number; topCustomer: { name: string; total: number } | null; avgTicket: number; totalPaid: number; countPaid: number; byStatus: Record<string, number>; byStatusAll: Record<string, number>; byStatusYesterday: Record<string, number>; byStatusDayBefore: Record<string, number>; allOrdersRaw: any[]; totalYesterday: number; countYesterday: number; totalAll: number; countAll: number; } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Load stats — cacheado en sessionStorage 3 min (≈92 lecturas por refresco;
  // sin el cache, cada visita/navegación al panel repetía todas las consultas)
  const STATS_CACHE_KEY = 'yaxsel_admin_orders_stats_v1';
  const STATS_CACHE_TTL = 3 * 60 * 1000;
  const loadStats = useCallback(async (force = false) => {
    if (!force) {
      try {
        const raw = sessionStorage.getItem(STATS_CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Date.now() - parsed.ts < STATS_CACHE_TTL && parsed.data) {
            setStatsCache(parsed.data);
            return;
          }
        }
      } catch {}
    }
    setStatsLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const nowCLT = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
      const startToday = new Date(nowCLT.getFullYear(), nowCLT.getMonth(), nowCLT.getDate(), 0, 0, 0, 0).getTime();
      const startYesterday = startToday - 86400000;
      const startDayBefore = startToday - 2 * 86400000;

      // Fetch only the last 3 days of orders for the day-bucketed stats.
      // CREATEDAT is a numeric (ms) timestamp and is indexed — Query.orderDesc /
      // greaterThanEqual on CREATEDAT are already used for the orders table — so
      // this filters server-side instead of downloading the whole collection.
      const recentResp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
        Query.greaterThanEqual('CREATEDAT', startDayBefore),
        Query.orderDesc('CREATEDAT'),
        Query.limit(80),
      ]);
      const allOrders: any[] = recentResp.documents;

      const todayOrders = allOrders.filter((o: any) => (o.CREATEDAT || new Date(o.$createdAt).getTime()) >= startToday);
      const yesterdayOrders = allOrders.filter((o: any) => { const ts = o.CREATEDAT || new Date(o.$createdAt).getTime(); return ts >= startYesterday && ts < startToday; });
      const paidStatuses = ['processing', 'paid', 'negotiation', 'shipped', 'delivered'];
      const paidOrdersToday = todayOrders.filter((o: any) => paidStatuses.includes(o.STATUS));

      // Top customer
      const byCustomer: Record<string, { name: string; total: number }> = {};
      for (const o of todayOrders) {
        const key = o.CUSTOMERRUT || o.CUSTOMERNAME || 'anon';
        if (!byCustomer[key]) byCustomer[key] = { name: o.CUSTOMERNAME || key, total: 0 };
        byCustomer[key].total += o.TOTAL || 0;
      }
      const topEntries = Object.values(byCustomer).sort((a, b) => b.total - a.total);

      // By status counts (today)
      const byStatus: Record<string, number> = {};
      for (const o of todayOrders) { byStatus[o.STATUS] = (byStatus[o.STATUS] || 0) + 1; }
      // All-time status counts for the "Todos" timeline. Instead of downloading
      // every order, ask Appwrite for the total per status (1 doc returned each).
      const byStatusAll: Record<string, number> = {};
      let countAll = 0;
      const statusesToCount = [...STATUS_FLOW, 'pending', 'pending_stock', 'negotiation', 'cancelled'];
      await Promise.all(statusesToCount.map(async (st) => {
        try {
          const r = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
            Query.equal('STATUS', st),
            Query.limit(1),
          ]);
          byStatusAll[st] = r.total;
          countAll += r.total;
        } catch {}
      }));
      // By status counts (yesterday)
      const byStatusYesterday: Record<string, number> = {};
      for (const o of yesterdayOrders) { byStatusYesterday[o.STATUS] = (byStatusYesterday[o.STATUS] || 0) + 1; }
      // By status counts (day before)
      const dayBeforeOrders = allOrders.filter((o: any) => { const ts = o.CREATEDAT || new Date(o.$createdAt).getTime(); return ts >= startDayBefore && ts < startYesterday; });
      const byStatusDayBefore: Record<string, number> = {};
      for (const o of dayBeforeOrders) { byStatusDayBefore[o.STATUS] = (byStatusDayBefore[o.STATUS] || 0) + 1; }

      const statsData = {
        totalToday: todayOrders.reduce((s: number, o: any) => s + (o.TOTAL || 0), 0),
        countToday: todayOrders.length,
        totalYesterday: yesterdayOrders.reduce((s: number, o: any) => s + (o.TOTAL || 0), 0),
        countYesterday: yesterdayOrders.length,
        topCustomer: topEntries[0] || null,
        avgTicket: paidOrdersToday.length > 0 ? Math.round(paidOrdersToday.reduce((s: number, o: any) => s + (o.TOTAL || 0), 0) / paidOrdersToday.length) : 0,
        totalPaid: paidOrdersToday.reduce((s: number, o: any) => s + (o.TOTAL || 0), 0),
        countPaid: paidOrdersToday.length,
        byStatus,
        byStatusAll,
        byStatusYesterday,
        byStatusDayBefore,
        allOrdersRaw: [],
        totalAll: 0,
        countAll,
      };
      setStatsCache(statsData);
      try { sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: statsData })); } catch {}
    } catch (e: any) { console.error('Stats error:', e); }
    finally { setStatsLoading(false); }
  }, []);

  // Custom date-range status counts: fetched on demand, bounded to the selected
  // range, instead of preloading the whole orders collection on every page view.
  useEffect(() => {
    if (dateFilter !== 'custom' || !customDateStart) return;
    let cancelled = false;
    (async () => {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const sTs = new Date(customDateStart + 'T00:00:00').getTime();
        const eTs = customDateEnd ? new Date(customDateEnd + 'T23:59:59').getTime() : sTs + 86400000;
        const resp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
          Query.greaterThanEqual('CREATEDAT', sTs),
          Query.lessThanEqual('CREATEDAT', eTs),
          Query.orderDesc('CREATEDAT'),
          Query.limit(80),
        ]);
        if (cancelled) return;
        const counts: Record<string, number> = {};
        for (const o of resp.documents) counts[o.STATUS] = (counts[o.STATUS] || 0) + 1;
        setCustomStatusCounts(counts);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [dateFilter, customDateStart, customDateEnd]);

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
      const queries = [Query.orderDesc('CREATEDAT'), Query.limit(PAGE_SIZE), Query.offset((page - 1) * PAGE_SIZE)];
      if (activeFilter === 'paid_group') {
        queries.push(Query.equal('STATUS', [
          'processing', 'paid', 'payment_review', 'negotiation', 'shipped', 'delivered'
        ]));
      } else if (activeFilter === 'processing') {
        queries.push(Query.equal('STATUS', ['pending', 'pending_stock', 'processing']));
      } else if (activeFilter !== 'all') {
        queries.push(Query.equal('STATUS', activeFilter));
      }

      const resp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, queries);
      const newOrders = resp.documents as unknown as Order[];
      setOrders(newOrders);
      setTotalCount(resp.total);
      setCurrentPage(page);
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

  // Reset pagination when filter changes — always fetch fresh, no sessionStorage cache
  useEffect(() => {
    setCurrentPage(1);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  // Stats y auto-entrega: solo al montar (no dependen del filtro activo).
  // Antes se repetían las ~92 lecturas de stats en cada cambio de pestaña.
  useEffect(() => {
    autoDeliverShippedOrders();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => setSelected(s => s.size === filtered.length ? new Set() : new Set(filtered.map(o => o.$id)));

  const bulkDeleteOrders = async () => {
    if (selected.size === 0) return;
    if (!confirm(`¿Estás seguro de que quieres eliminar PERMANENTEMENTE ${selected.size} pedido(s) de Appwrite? Esta acción no se puede deshacer y los números de pedido no se reutilizarán.`)) return;
    setBulkUpdating(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const selectedOrders = orders.filter(o => selected.has(o.$id));
      
      for (const order of selectedOrders) {
        await databases.deleteDocument(databaseId, ORDERS_COLLECTION_ID, order.$id);
      }

      // Invalidar la caché de "mis pedidos" (badge "Pagar tu pedido" del nav):
      // el borrado es client-side y no toca el unstable_cache de
      // /api/public-data/my-orders-status, que si no seguiría mostrando el
      // pedido eliminado hasta 5 min.
      try { await fetch('/api/revalidate?tag=orders'); } catch {}

      alert(`${selectedOrders.length} pedido(s) eliminado(s)`);
      setSelected(new Set());
      load(1);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar pedidos');
    } finally {
      setBulkUpdating(false);
    }
  };

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
      // Invalidar caché del badge "Pagar tu pedido" (my-orders-status).
      try { await fetch('/api/revalidate?tag=orders'); } catch {}
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setBulkUpdating(false); }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const orderBefore = orders.find(o => o.$id === orderId);
    const prevStatus = orderBefore?.STATUS;
    // Optimistic update — update UI immediately
    setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, STATUS: newStatus as OrderStatus } : o));
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
      // Invalidar caché del badge "Pagar tu pedido" (my-orders-status).
      try { await fetch('/api/revalidate?tag=orders'); } catch {}
      if (orderBefore) {
        const { notifyOrderStatusChange } = await import('@/services/notificationService');
        await notifyOrderStatusChange(orderBefore, prevStatus, newStatus).catch(() => {});
      }
    } catch (e: any) {
      if (prevStatus) setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, STATUS: prevStatus as OrderStatus } : o));
      alert('Error: ' + e.message);
    }
    finally { setUpdatingId(null); }
  };

  const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const EXPORT_EXCLUDED_STATUSES = ['negotiation', 'pending', 'cancelled'];

  const exportOrdersImage = async () => {
    setExportLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // Determine date range with 6pm cutoff logic
      // If today is 30-06 and user selects 29→30, range = 28-06 18:00 to 30-06 18:00
      // Default: yesterday to today
      const nowCLT = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
      const todayStr = nowCLT.toISOString().slice(0, 10);
      const yesterday = new Date(nowCLT.getTime() - 86400000);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const startDateStr = exportDateStart || yesterdayStr;
      const endDateStr = exportDateEnd || todayStr;

      // start = (startDate - 1 day) at 18:00 CLT (UTC-3)
      const startDateObj = new Date(startDateStr + 'T00:00:00-03:00');
      startDateObj.setDate(startDateObj.getDate() - 1);
      startDateObj.setHours(18, 0, 0, 0);
      const startTs = startDateObj.getTime();

      // end = endDate at 18:00 CLT
      const endDateObj = new Date(endDateStr + 'T00:00:00-03:00');
      endDateObj.setHours(18, 0, 0, 0);
      const endTs = endDateObj.getTime();

      // Fetch orders in range, excluding negotiation/pending/cancelled
      const allFetched: any[] = [];
      let cursor: string | null = null;
      for (let page = 0; page < 20; page++) {
        const queries: any[] = [
          Query.greaterThanEqual('CREATEDAT', startTs),
          Query.lessThan('CREATEDAT', endTs),
          Query.orderDesc('CREATEDAT'),
          Query.limit(100),
        ];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const resp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, queries);
        allFetched.push(...resp.documents);
        if (resp.documents.length < 100) break;
        cursor = resp.documents[resp.documents.length - 1].$id;
      }

      const exportOrders = allFetched.filter((o: any) => !EXPORT_EXCLUDED_STATUSES.includes(o.STATUS));

      if (exportOrders.length === 0) {
        alert('No hay pedidos para exportar en el rango seleccionado.');
        return;
      }

      // Generate image with Canvas
      const W = 800;
      const rowH = 40;
      const headerH = 120;
      const footerH = 60;
      const tableHeaderH = 36;
      const H = headerH + tableHeaderH + exportOrders.length * rowH + footerH;

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Header gradient
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, headerH);

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Resumen de Pedidos', 24, 40);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      const rangeLabel = `${new Date(startTs).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} — ${new Date(endTs).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`;
      ctx.fillText(rangeLabel, 24, 64);

      const totalSum = exportOrders.reduce((s: number, o: any) => s + (o.TOTAL || 0), 0);
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${exportOrders.length} pedidos · Total: ${fmt(totalSum)}`, 24, 92);

      // Table header
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, headerH, W, tableHeaderH);
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 12px sans-serif';
      const cols = [
        { label: 'Código', x: 24, w: 120 },
        { label: 'Cliente', x: 154, w: 200 },
        { label: 'Estado', x: 364, w: 140 },
        { label: 'Método', x: 514, w: 100 },
        { label: 'Total', x: 624, w: 150 },
      ];
      cols.forEach(c => { ctx.fillText(c.label, c.x, headerH + 23); });

      // Separator line
      ctx.strokeStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(0, headerH + tableHeaderH);
      ctx.lineTo(W, headerH + tableHeaderH);
      ctx.stroke();

      // Rows
      ctx.font = '12px sans-serif';
      exportOrders.forEach((o: any, i: number) => {
        const y = headerH + tableHeaderH + i * rowH;
        if (i % 2 === 0) {
          ctx.fillStyle = '#fafafa';
          ctx.fillRect(0, y, W, rowH);
        }
        ctx.fillStyle = '#111827';
        ctx.fillText((o.ORDERCODE || '').slice(0, 14), cols[0].x, y + 25);
        ctx.fillText((o.CUSTOMERNAME || '').slice(0, 28), cols[1].x, y + 25);

        const stCfg = STATUS_CONFIG[o.STATUS] || { label: o.STATUS };
        ctx.fillStyle = STATUS_COLORS[o.STATUS]?.color || '#6b7280';
        ctx.fillText(stCfg.label.slice(0, 18), cols[2].x, y + 25);

        ctx.fillStyle = '#374151';
        ctx.fillText((o.PAYMENTMETHOD || '-').slice(0, 14), cols[3].x, y + 25);

        ctx.fillStyle = '#059669';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(fmt(o.TOTAL || 0), cols[4].x, y + 25);
        ctx.font = '12px sans-serif';

        // Row separator
        ctx.strokeStyle = '#f3f4f6';
        ctx.beginPath();
        ctx.moveTo(0, y + rowH);
        ctx.lineTo(W, y + rowH);
        ctx.stroke();
      });

      // Footer
      const footerY = headerH + tableHeaderH + exportOrders.length * rowH;
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, footerY, W, footerH);
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.fillText(`Generado el ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}`, 24, footerY + 35);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Total: ${fmt(totalSum)}`, W - 24, footerY + 35);
      ctx.textAlign = 'left';

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pedidos_${startDateStr}_a_${endDateStr}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setShowExportModal(false);
    } catch (e: any) {
      console.error('Export image error:', e);
      alert('Error al generar la imagen: ' + e.message);
    } finally {
      setExportLoading(false);
    }
  };

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
        (STATUS_CONFIG[o.STATUS]?.label || o.STATUS),
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
    if (!trackingPending && dateFilter !== 'all' && (dateFilter !== 'custom' || customDateStart || customDateEnd)) {
      const ts = o.CREATEDAT || new Date(o.$createdAt).getTime();
      const nowCLT = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
      const startToday = new Date(nowCLT.getFullYear(), nowCLT.getMonth(), nowCLT.getDate(), 0, 0, 0, 0).getTime();
      if (dateFilter === 'today') {
        if (ts < startToday) return false;
      } else if (dateFilter === 'yesterday') {
        const startY = startToday - 86400000;
        if (ts < startY || ts >= startToday) return false;
      } else if (dateFilter === 'day_before') {
        const startY = startToday - 86400000;
        const startDB = startToday - 2 * 86400000;
        if (ts < startDB || ts >= startY) return false;
      } else if (dateFilter === 'custom') {
        if (customDateStart) {
          const startTs = new Date(customDateStart + 'T00:00:00-03:00').getTime();
          if (ts < startTs) return false;
        }
        if (customDateEnd) {
          const endTs = new Date(customDateEnd + 'T23:59:59-03:00').getTime();
          if (ts > endTs) return false;
        }
      }
    }
    if (paymentFilter !== 'all') {
      const pm = o.PAYMENTMETHOD || 'Sin método';
      if (pm !== paymentFilter) return false;
    }
    if (sourceFilter !== 'all') {
      const isWa = o.PAYMENTMETHOD === 'WhatsApp';
      const cashier = (o as any).ASSIGNEDCASHIER || '';
      if (sourceFilter === 'whatsapp' && !isWa) return false;
      if (sourceFilter === 'lissy' && !(isWa && cashier.toLowerCase().includes('lissy'))) return false;
      if (sourceFilter === 'fer' && !(isWa && cashier.toLowerCase().includes('fernanda'))) return false;
      if (sourceFilter === 'web' && isWa) return false;
    }
    if (regionFilter !== 'all') {
      const r = (o as any).REGION || '';
      if (r !== regionFilter) return false;
    }
    if (liveOnly && !(o as any).PURCHASEDFROMLIVE) return false;
    if (trackingPending && !needsTracking(o)) return false;
    if (pickupReady && !(o.STATUS === 'shipped' && isPickup(o.SHIPPINGAGENCY))) return false;
    return true;
  });

  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base sm:text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            {(() => { const items = filtered.reduce((s, o) => { try { return s + (JSON.parse(o.ITEMS || '[]') as any[]).reduce((a: number, i: any) => a + (i.quantity || 1), 0); } catch { return s; } }, 0); return items > 0 ? <span className="ml-2 text-xs text-gray-400">{items} artículos</span> : null; })()}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Date range selector */}
          <button onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{dateFilter === 'custom' && customDateStart ? `${customDateStart}${customDateEnd ? ' → ' + customDateEnd : ''}` : DATE_FILTER_LABELS[dateFilter]}</span>
          </button>
          <button onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-700 transition">
            <ImageIcon className="w-4 h-4" /><span className="hidden sm:inline">Descargar imagen</span>
          </button>
          <button onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-pink-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-pink-700 transition">
            <Printer className="w-4 h-4" /><span className="hidden sm:inline">Imprimir Checklist</span>
          </button>
          <button onClick={() => { load(1); loadStats(true); }} disabled={isLoading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Print Checklist Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowPrintModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Printer size={18} className="text-pink-600" /> Imprimir Checklist de Bodega
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600 mb-2">Selecciona los estados que deseas incluir en el checklist imprimible:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                {Object.entries(STATUS_CONFIG).filter(([k]) => k !== 'all' && k !== 'paid_group').map(([k, cfg]) => {
                  const isSelected = printStatuses.includes(k);
                  return (
                    <label key={k} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-pink-500 bg-pink-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setPrintStatuses([...printStatuses, k]);
                          else setPrintStatuses(printStatuses.filter(s => s !== k));
                        }}
                      />
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowPrintModal(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (printStatuses.length === 0) return alert('Selecciona al menos un estado.');
                  window.open(`/admin/orders-print?statuses=${printStatuses.join(',')}`, '_blank');
                  setShowPrintModal(false);
                }} 
                className="px-5 py-2 text-sm font-bold text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition flex items-center gap-2"
                disabled={printStatuses.length === 0}
              >
                <Printer size={16} /> Generar PDF / Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Image Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => !exportLoading && setShowExportModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-800">Descargar imagen de pedidos</h3>
              </div>
              <button onClick={() => !exportLoading && setShowExportModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl leading-none">×</button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-emerald-700 font-medium">
                Se excluirán los pedidos en estado: <b>Negociando</b>, <b>Comprobando Stock</b> y <b>Cancelado</b>.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-blue-700 font-medium">
                El rango usa corte a las <b>6 PM</b>. Ej: si seleccionas 29 al 30, se toman pedidos desde el 28 a las 18:00 hasta el 30 a las 18:00.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Fecha inicio (opcional)</label>
                <input type="date" value={exportDateStart} onChange={e => setExportDateStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Fecha fin (opcional)</label>
                <input type="date" value={exportDateEnd} onChange={e => setExportDateEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <p className="text-[11px] text-gray-400">
                Si no seleccionas fechas, se usará por defecto: ayer → hoy (con corte 6 PM).
              </p>
              <button onClick={exportOrdersImage} disabled={exportLoading}
                className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {exportLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generando imagen...</>
                ) : (
                  <><Download className="w-4 h-4" /> Descargar PNG</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setShowDatePicker(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Seleccionar fecha</h3>
              <button onClick={() => setShowDatePicker(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl leading-none">×</button>
            </div>
            <div className="space-y-2 mb-4">
            {(['today', 'yesterday', 'day_before'] as DateFilter[]).map(d => (
              <button key={d} onClick={() => { setDateFilter(d); setShowDatePicker(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${dateFilter === d ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                <Calendar className="w-4 h-4" />
                {DATE_FILTER_LABELS[d]}
              </button>
            ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Rango personalizado</p>
              <div className="flex flex-col gap-2">
                <input type="date" value={customDateStart} onChange={e => setCustomDateStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Desde" />
                <input type="date" value={customDateEnd} onChange={e => setCustomDateEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Hasta" />
                <button onClick={() => { if (customDateStart) { setDateFilter('custom'); setShowDatePicker(false); } }}
                  disabled={!customDateStart}
                  className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-40">
                  Aplicar rango
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      {statsCache && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Total Hoy */}
          <div className="relative rounded-2xl border border-gray-100/80 p-3 sm:p-4 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(238,242,255,0.6), rgba(255,255,255,0.95))', boxShadow: '0 4px 16px -8px rgba(79,70,229,0.12)' }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }} />
            <div className="flex items-center gap-2 mb-2 mt-0.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.12), rgba(79,70,229,0.06))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide font-bold">Total Hoy</p>
            </div>
            <p className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">{fmt(statsCache.totalToday)}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-[10px] text-gray-400 font-medium">{statsCache.countToday} pedidos hoy</p>
              {statsCache.countYesterday > 0 && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statsCache.totalToday > statsCache.totalYesterday ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {statsCache.totalToday > statsCache.totalYesterday ? '↑' : '↓'} {fmt(Math.abs(statsCache.totalToday - statsCache.totalYesterday))}
                </span>
              )}
            </div>
          </div>
          {/* Ventas Confirmadas */}
          <div className="relative rounded-2xl border border-gray-100/80 p-3 sm:p-4 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(236,253,245,0.6), rgba(255,255,255,0.95))', boxShadow: '0 4px 16px -8px rgba(5,150,105,0.12)' }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }} />
            <div className="flex items-center gap-2 mb-2 mt-0.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide font-bold">Ventas Confirmadas</p>
            </div>
            <p className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">{fmt(statsCache.totalPaid)}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">{statsCache.countPaid} confirmados hoy</p>
          </div>
          {/* Cliente Top */}
          <div className="relative rounded-2xl border border-gray-100/80 p-3 sm:p-4 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(255,251,235,0.6), rgba(255,255,255,0.95))', boxShadow: '0 4px 16px -8px rgba(217,119,6,0.12)' }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)' }} />
            <div className="flex items-center gap-2 mb-2 mt-0.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(145deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide font-bold">Top Cliente</p>
            </div>
            {statsCache.topCustomer ? (
              <>
                <p className="text-sm sm:text-base font-extrabold text-gray-900 truncate tracking-tight">{statsCache.topCustomer.name.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[10px] text-amber-600 mt-0.5 font-bold">{fmt(statsCache.topCustomer.total)} hoy</p>
              </>
            ) : <p className="text-sm text-gray-400 mt-1">Sin datos</p>}
          </div>
          {/* Ticket Promedio */}
          <div className="relative rounded-2xl border border-gray-100/80 p-3 sm:p-4 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(240,253,244,0.6), rgba(255,255,255,0.95))', boxShadow: '0 4px 16px -8px rgba(22,163,74,0.12)' }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a)' }} />
            <div className="flex items-center gap-2 mb-2 mt-0.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(145deg, rgba(34,197,94,0.12), rgba(22,163,74,0.06))' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide font-bold">Ticket Prom.</p>
            </div>
            <p className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">{fmt(statsCache.avgTicket)}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">por pedido pagado</p>
          </div>
        </div>
      )}

      {/* Process Timeline */}
      {(() => {
        const goFilter = (status: string, isActive: boolean) => {
          setActiveFilter(isActive ? 'all' : status);
        };
        // Compute status counts based on current date filter
        let statusCounts: Record<string, number>;
        if (dateFilter === 'today') statusCounts = statsCache?.byStatus || {};
        else if (dateFilter === 'yesterday') statusCounts = statsCache?.byStatusYesterday || {};
        else if (dateFilter === 'day_before') statusCounts = statsCache?.byStatusDayBefore || {};
        else if (dateFilter === 'custom' && customDateStart) {
          statusCounts = customStatusCounts;
        } else statusCounts = statsCache?.byStatusAll || {};
        const counts = STATUS_FLOW.map(st => {
          if (st === 'processing') {
            return (statusCounts['processing'] || 0) + (statusCounts['pending'] || 0) + (statusCounts['pending_stock'] || 0);
          }
          return statusCounts[st] || 0;
        });
        let furthestIdx = -1;
        counts.forEach((c, i) => { if (c > 0) furthestIdx = i; });
        const flowTotal = counts.reduce((s, c) => s + c, 0);

        // Nodo del flujo principal — glossy + anillo activo + badge
        const renderNode = (status: string, idx: number) => {
          const sc = STATUS_COLORS[status] || { color: '#6b7280', bg: '#f3f4f6' };
          const cfg = STATUS_CONFIG[status] || { label: status };
          const count = counts[idx];
          const isActive = activeFilter === status;
          const dim = count === 0;
          return (
            <button
              key={status}
              onClick={() => goFilter(status, isActive)}
              title={`${cfg.label}${count ? ` · ${count} pedido${count !== 1 ? 's' : ''}` : ''}`}
              className="group flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0 relative z-10"
              style={{ width: 64 }}>
              <div className="relative" style={{ animation: isActive ? 'kcFloat 2.6s ease-in-out infinite' : undefined }}>
                {/* Anillo de pulso (solo activo) */}
                {isActive && (
                  <span className="absolute inset-0 rounded-[12px] sm:rounded-[14px]" style={{ ['--kc' as any]: `${sc.color}66`, animation: 'kcPulseRing 1.9s ease-out infinite' }} />
                )}
                <div
                  className="relative flex items-center justify-center rounded-[12px] sm:rounded-[14px] transition-all duration-300 group-hover:-translate-y-0.5"
                  style={{
                    width: isActive ? 42 : 36,
                    height: isActive ? 42 : 36,
                    background: dim
                      ? 'linear-gradient(160deg,#ffffff,#eef2f7)'
                      : `linear-gradient(160deg, rgba(255,255,255,0.28), rgba(0,0,0,0.16)), ${sc.color}`,
                    border: dim ? `1.5px dashed ${sc.color}4d` : '1px solid rgba(255,255,255,0.35)',
                    boxShadow: isActive
                      ? `0 0 0 3px ${sc.color}18, 0 6px 14px -6px ${sc.color}66, inset 0 1px 1px rgba(255,255,255,0.5)`
                      : dim ? 'none' : `0 4px 10px -4px ${sc.color}55, inset 0 1px 1px rgba(255,255,255,0.4)`,
                  }}>
                  {STATUS_SVG[status] && React.cloneElement(STATUS_SVG[status] as any, {
                    width: isActive ? 18 : 15,
                    height: isActive ? 18 : 15,
                    style: { color: dim ? sc.color : '#fff', opacity: dim ? 0.55 : 1, filter: dim ? 'none' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' },
                  })}
                  {/* Brillo superior */}
                  {!dim && <span className="absolute inset-x-1 top-1 h-1/3 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />}
                  {count > 0 && (
                    <span
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] sm:min-w-[21px] sm:h-[21px] flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold rounded-full px-1 border-2 sm:border-[2.5px]"
                      style={{ background: isActive ? '#fff' : `linear-gradient(135deg, ${sc.color}, ${sc.color}cc)`, color: isActive ? sc.color : '#fff', borderColor: isActive ? sc.color : '#fff', boxShadow: `0 2px 5px -1px ${sc.color}55`, animation: 'kcBadgePop 0.45s cubic-bezier(0.34,1.56,0.64,1)' }}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
              </div>
              <span
                className="text-[8px] sm:text-[10px] font-bold leading-tight text-center transition"
                style={{ color: isActive ? sc.color : dim ? '#c2cbd6' : '#475569' }}>
                {cfg.label}
              </span>
            </button>
          );
        };

        // Nodo lateral (Negociación / Cancelado) — mismo diseño glossy que renderNode
        const renderSideNode = (status: string) => {
          const sc = STATUS_COLORS[status] || { color: '#6b7280', bg: '#f3f4f6' };
          const cfg = STATUS_CONFIG[status] || { label: status };
          const count = statusCounts[status] || 0;
          const isActive = activeFilter === status;
          const dim = count === 0;
          return (
            <button
              key={status}
              onClick={() => goFilter(status, isActive)}
              title={`${cfg.label}${count ? ` · ${count} pedido${count !== 1 ? 's' : ''}` : ''}`}
              className="group flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0 relative z-10"
              style={{ width: 64 }}>
              <div className="relative" style={{ animation: isActive ? 'kcFloat 2.6s ease-in-out infinite' : undefined }}>
                {isActive && (
                  <span className="absolute inset-0 rounded-[12px] sm:rounded-[14px]" style={{ ['--kc' as any]: `${sc.color}66`, animation: 'kcPulseRing 1.9s ease-out infinite' }} />
                )}
                <div
                  className="relative flex items-center justify-center rounded-[12px] sm:rounded-[14px] transition-all duration-300 group-hover:-translate-y-0.5"
                  style={{
                    width: isActive ? 42 : 36,
                    height: isActive ? 42 : 36,
                    background: dim
                      ? 'linear-gradient(160deg,#ffffff,#eef2f7)'
                      : `linear-gradient(160deg, rgba(255,255,255,0.28), rgba(0,0,0,0.16)), ${sc.color}`,
                    border: dim ? `1.5px dashed ${sc.color}4d` : '1px solid rgba(255,255,255,0.35)',
                    boxShadow: isActive
                      ? `0 0 0 3px ${sc.color}18, 0 6px 14px -6px ${sc.color}66, inset 0 1px 1px rgba(255,255,255,0.5)`
                      : dim ? 'none' : `0 4px 10px -4px ${sc.color}55, inset 0 1px 1px rgba(255,255,255,0.4)`,
                  }}>
                  {STATUS_SVG[status] ? React.cloneElement(STATUS_SVG[status] as any, {
                    width: isActive ? 18 : 15,
                    height: isActive ? 18 : 15,
                    style: { color: dim ? sc.color : '#fff', opacity: dim ? 0.55 : 1, filter: dim ? 'none' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' },
                  }) : status === 'cancelled' && (
                    <svg width={isActive ? 18 : 15} height={isActive ? 18 : 15} viewBox="0 0 24 24" fill="none" stroke={dim ? sc.color : '#fff'} strokeWidth="2" style={{ opacity: dim ? 0.55 : 1, filter: dim ? 'none' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  )}
                  {!dim && <span className="absolute inset-x-1 top-1 h-1/3 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45), transparent)' }} />}
                  {count > 0 && (
                    <span
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] sm:min-w-[21px] sm:h-[21px] flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold rounded-full px-1 border-2 sm:border-[2.5px]"
                      style={{ background: isActive ? '#fff' : `linear-gradient(135deg, ${sc.color}, ${sc.color}cc)`, color: isActive ? sc.color : '#fff', borderColor: isActive ? sc.color : '#fff', boxShadow: `0 2px 5px -1px ${sc.color}55`, animation: 'kcBadgePop 0.45s cubic-bezier(0.34,1.56,0.64,1)' }}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
              </div>
              <span
                className="text-[8px] sm:text-[10px] font-bold leading-tight text-center transition"
                style={{ color: isActive ? sc.color : dim ? '#c2cbd6' : '#475569' }}>
                {cfg.label}
              </span>
            </button>
          );
        };

        // Separador punteado para estados laterales
        const renderDashedSep = (key: string) => (
          <div key={key} className="flex items-center self-start mt-[18px] sm:mt-[25px] flex-shrink-0">
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-0.5 bg-gray-300 rounded-full" />
              <div className="w-1 h-0.5 bg-gray-300 rounded-full" />
              <div className="w-1.5 h-0.5 bg-gray-300 rounded-full" />
            </div>
          </div>
        );

        return (
          <div className="relative rounded-[20px] overflow-hidden border border-white/70 shadow-[0_6px_24px_-12px_rgba(79,70,229,0.12)]"
            style={{ background: 'linear-gradient(135deg, rgba(238,242,255,0.85), rgba(255,255,255,0.92) 45%, rgba(248,250,252,0.9))', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            {/* Ambient blobs */}
            <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05), transparent 70%)' }} />
            <div className="absolute -bottom-20 right-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.03), transparent 70%)' }} />
            {/* Sheen animado superior */}
            <div className="absolute top-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
              <div className="h-px w-1/3" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)', animation: 'kcSheen 4.5s linear infinite' }} />
            </div>

            {/* Header */}
            <div className="relative flex items-start sm:items-center justify-between gap-3 px-4 sm:px-5 pt-4 pb-1 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(145deg,#6366f1,#4f46e5)', boxShadow: '0 4px 10px -4px rgba(79,70,229,0.4), inset 0 1px 1px rgba(255,255,255,0.4)' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                </span>
                <div>
                  <p className="text-sm font-extrabold text-gray-900 leading-tight tracking-tight">Flujo del Pedido</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 leading-tight font-medium">{flowTotal} en proceso · toca un estado para filtrar</p>
                </div>
              </div>
              {/* Ver todos */}
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {activeFilter !== 'all' && (
                  <button onClick={() => goFilter('all', false)}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition flex-shrink-0 shadow-sm">
                    Ver todos
                  </button>
                )}
              </div>
            </div>

            {/* Track */}
            <div className="relative px-4 sm:px-5 pb-5 pt-3 overflow-x-auto">
              <div className="flex items-start gap-0 min-w-max relative">
                {/* Flujo principal */}
                {STATUS_FLOW.map((status, idx) => {
                  const a = STATUS_COLORS[status]?.color || '#6b7280';
                  const b = STATUS_COLORS[STATUS_FLOW[idx + 1]]?.color || a;
                  const filled = idx < furthestIdx;
                  return (
                    <React.Fragment key={status}>
                      {renderNode(status, idx)}
                      {idx < STATUS_FLOW.length - 1 && (
                        <div className="relative self-start mt-[18px] sm:mt-[25px] flex-shrink-0 -mx-1 sm:-mx-1.5 rounded-full overflow-hidden"
                          style={{ height: 3, width: 20, background: filled ? `linear-gradient(90deg, ${a}, ${b})` : '#e5e7eb' }}>
                          {filled && (
                            <span className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)', animation: `kcShimmer 2.4s linear ${idx * 0.18}s infinite` }} />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                {/* Estados desconectados (extremo derecho) */}
                <div className="flex-1 min-w-[24px]" />
                {renderSideNode('negotiation')}
                {renderDashedSep('sep-cancel')}
                {renderSideNode('cancelled')}
              </div>
            </div>

            <style>{`
              @keyframes kcShimmer { 0% { transform: translateX(-110%); } 100% { transform: translateX(220%); } }
              @keyframes kcSheen { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
              @keyframes kcPulseRing { 0% { box-shadow: 0 0 0 0 var(--kc); } 70% { box-shadow: 0 0 0 11px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
              @keyframes kcFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
              @keyframes kcBadgePop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
            `}</style>
          </div>
        );
      })()}

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 overflow-x-auto -mx-1 px-1 pb-1 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
        {/* Todos — black bg white text */}
        <button onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${activeFilter === 'all' ? 'bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-inset' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
          Todos
        </button>
        {/* Pagados — soft green */}
        <button onClick={() => setActiveFilter('paid_group')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition bg-green-100 text-green-700 border border-green-200 ${activeFilter === 'paid_group' ? 'ring-2 ring-green-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
          Confirmados
        </button>
        {/* Comprobando Stock — soft amber */}
        <button onClick={() => setActiveFilter('processing')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition bg-amber-100 text-amber-700 border border-amber-200 ${activeFilter === 'processing' ? 'ring-2 ring-amber-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
          Comprobando Stock
        </button>
        {/* Cancelado — soft red */}
        <button onClick={() => setActiveFilter('cancelled')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition bg-red-100 text-red-700 border border-red-200 ${activeFilter === 'cancelled' ? 'ring-2 ring-red-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
          Cancelado
        </button>
        {/* More states — opens modal */}
        <button onClick={() => setShowStatusModal(true)}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 ${['processing','paid','negotiation','shipped','delivered'].includes(activeFilter) ? 'ring-2 ring-indigo-500 ring-inset shadow-sm' : ''}`}>
          Más estados ▾
        </button>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setSourceFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition bg-gray-100 text-gray-600 border border-gray-200 ${sourceFilter === 'all' ? 'ring-2 ring-gray-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
            Todos
          </button>
          <button onClick={() => setSourceFilter('web')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition bg-sky-100 text-sky-700 border border-sky-200 ${sourceFilter === 'web' ? 'ring-2 ring-sky-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
            🌐 Web
          </button>
          <button onClick={() => setSourceFilter('whatsapp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition bg-green-100 text-green-700 border border-green-200 ${sourceFilter === 'whatsapp' ? 'ring-2 ring-green-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
            💬 WhatsApp
          </button>
          <button onClick={() => setSourceFilter('lissy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition bg-purple-100 text-purple-700 border border-purple-200 ${sourceFilter === 'lissy' ? 'ring-2 ring-purple-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
            👩 Lissy (WA)
          </button>
          <button onClick={() => setSourceFilter('fer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition bg-pink-100 text-pink-700 border border-pink-200 ${sourceFilter === 'fer' ? 'ring-2 ring-pink-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
            👩 Fernanda (WA)
          </button>
        </div>
        {orders.some(o => (o as any).PURCHASEDFROMLIVE) && (
          <button onClick={() => setLiveOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition border ${liveOnly ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            🔴 Solo Live
          </button>
        )}
        {(() => { const n = orders.filter(o => o.STATUS === 'shipped' && isPickup(o.SHIPPINGAGENCY)).length; return n > 0 ? (
          <button onClick={() => setPickupReady(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition border ${pickupReady ? 'bg-teal-500 text-white border-teal-500' : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'}`}>
            🏪 Listo para retirar <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pickupReady ? 'bg-white/25' : 'bg-teal-200 text-teal-800'}`}>{n}</span>
          </button>
        ) : null; })()}
        {(() => { const n = orders.filter(needsTracking).length; return n > 0 ? (
          <button onClick={() => setTrackingPending(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition border ${trackingPending ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}>
            📍 Seguimiento pendiente <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trackingPending ? 'bg-white/25' : 'bg-amber-200 text-amber-800'}`}>{n}</span>
          </button>
        ) : null; })()}
        {/* Quick date buttons */}
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden sm:ml-auto">
          {(['all', 'today', 'yesterday', 'day_before'] as DateFilter[]).map(d => (
            <button key={d} onClick={() => setDateFilter(d)}
              className={`px-3 py-1.5 text-xs font-medium transition ${dateFilter === d ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {DATE_FILTER_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Status Modal — floating cards with blurred backdrop */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setShowStatusModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm font-bold text-gray-800">Seleccionar estado</h3>
              <button onClick={() => setShowStatusModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {(['processing', 'paid', 'payment_review', 'payment_confirmed', 'negotiation', 'shipped', 'delivered'] as const).map(key => {
                const color = STATUS_COLORS[key]?.color || '#6b7280';
                const bg = STATUS_COLORS[key]?.bg || '#f3f4f6';
                return (
                  <button key={key} onClick={() => { setActiveFilter(key); setShowStatusModal(false); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${activeFilter === key ? 'ring-2 ring-offset-1 shadow-sm' : 'hover:shadow-md'} hover:scale-105`}
                    style={{ background: bg, borderColor: color + '33', color }}>
                    <div style={{ color }}>{STATUS_SVG[key] && React.cloneElement(STATUS_SVG[key] as any, { width: 32, height: 32 })}</div>
                    <span className="text-xs font-semibold text-center" style={{ color }}>{STATUS_CONFIG[key]?.label || key}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Shortcuts Modal — send pre-written messages to customer */}
      {waShortcutOrderId && (() => {
        const sOrder = orders.find(o => o.$id === waShortcutOrderId);
        if (!sOrder) return null;
        const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.donbalatomayorista.cl';
        const customerPhone = (sOrder.CUSTOMERPHONE || '').replace(/[^0-9]/g, '');
        const orderLink = `${siteUrl}/pedido/${sOrder.$id}`;
        const shortcuts = [
          {
            label: 'Notificar stock confirmado',
            desc: 'Avisar al cliente que suba su comprobante de pago',
            icon: '📦✅',
            msg: `¡Hola ${sOrder.CUSTOMERNAME?.split(' ')[0] || ''}! Ya tenemos el stock confirmado de tu pedido ${sOrder.ORDERCODE || ''}.\n\nPuedes subir tu comprobante de pago en este enlace:\n${orderLink}\n\nDentro encontrarás los datos de la transferencia bancaria. O si prefieres, envíame el comprobante por aquí y yo lo subo por ti.`,
          },
        ];
        const buildWaUrl = (msg: string) => {
          if (!customerPhone) return null;
          return `https://wa.me/56${customerPhone.replace(/^56/, '')}?text=${encodeURIComponent(msg)}`;
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={() => setWaShortcutOrderId(null)}>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Atajos WhatsApp
                </h3>
                <button onClick={() => setWaShortcutOrderId(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition text-xl leading-none">×</button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-500 mb-2">
                  Pedido <span className="font-mono font-bold text-indigo-600">{sOrder.ORDERCODE}</span> · {sOrder.CUSTOMERNAME}
                </p>
                {!customerPhone && (
                  <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">Este pedido no tiene teléfono registrado</p>
                )}
                {shortcuts.map((sc, i) => {
                  const url = buildWaUrl(sc.msg);
                  return (
                    <a
                      key={i}
                      href={url || '#'}
                      target={url ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => { if (!url) e.preventDefault(); setWaShortcutOrderId(null); }}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition cursor-pointer ${!url ? 'opacity-40 pointer-events-none' : ''}`}>
                      <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-xl">
                        {sc.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-800 text-sm">{sc.label}</p>
                        <p className="text-xs text-gray-400">{sc.desc}</p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Timeline Modal — vertical timeline to change order status */}
      {timelineOrderId && (() => {
        const tOrder = orders.find(o => o.$id === timelineOrderId);
        if (!tOrder) return null;
        const effStatus = (tOrder.STATUS === 'pending' || tOrder.STATUS === 'pending_stock') ? 'processing' : tOrder.STATUS;
        const currentIdx = STATUS_FLOW.indexOf(effStatus);
        const isCancelled = tOrder.STATUS === 'cancelled';
        const tIsPickup = isPickup(tOrder.SHIPPINGAGENCY);
        const STATUS_DESC: Record<string, string> = {
          pending: 'El cliente hizo el pedido pero aún no ha pagado.',
          processing: 'Se recibió el comprobante de pago, hay que verificarlo.',
          paid: 'El pago fue confirmado y verificado correctamente.',
          negotiation: 'Faltan productos, se está negociando con el cliente.',
          shipped: tIsPickup ? 'El pedido salió de la tienda.' : 'El pedido salió de la tienda con la agencia.',
          delivered: tIsPickup ? 'El cliente retiró su pedido.' : 'El pedido fue entregado a la agencia de transporte.',
          cancelled: 'El pedido fue cancelado y el stock fue devuelto.',
        };
        // Etiquetas dependientes de retiro/agencia para el timeline
        const labelFor = (status: string) => {
          if (status === 'delivered' && tIsPickup) return 'Entregado';
          return STATUS_CONFIG[status]?.label || status;
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={() => setTimelineOrderId(null)}>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              {/* Header with gradient */}
              <div className="px-4 py-3 sm:px-6 sm:py-4" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-2xl" style={{ width: 40, height: 40, background: isCancelled ? STATUS_COLORS.cancelled.bg : STATUS_COLORS[tOrder.STATUS]?.bg || '#f3f4f6' }}>
                      <div style={{ color: isCancelled ? STATUS_COLORS.cancelled.color : STATUS_COLORS[tOrder.STATUS]?.color || '#6b7280' }}>
                        {STATUS_SVG[tOrder.STATUS] || STATUS_SVG.cancelled}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">Línea de tiempo del pedido</h3>
                      <p className="text-xs text-gray-400 font-mono">{tOrder.ORDERCODE || '#' + tOrder.$id.slice(-6)}</p>
                    </div>
                  </div>
                  <button onClick={() => setTimelineOrderId(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition text-xl leading-none">×</button>
                </div>
              </div>

              {/* Timeline */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 max-h-[50vh] overflow-y-auto">
                <div className="relative">
                  {STATUS_FLOW.map((status, idx) => {
                    const isPast = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const isFuture = idx > currentIdx;
                    const sc = STATUS_COLORS[status];
                    const isClickable = !isCancelled && status !== tOrder.STATUS;
                    return (
                      <div key={status} className="flex items-start gap-3 relative pb-1" style={{ minHeight: 60 }}>
                        {/* Vertical connector line */}
                        {idx < STATUS_FLOW.length - 1 && (
                          <div className="absolute left-[15px] top-9 bottom-0 w-[2px] rounded-full" style={{ background: isPast ? sc.color : '#e5e7eb', opacity: isPast ? 0.4 : 1 }} />
                        )}
                        {/* Node — clickable */}
                        <button
                          onClick={() => { if (isClickable) { updateStatus(tOrder.$id, status); } }}
                          disabled={!isClickable}
                          className="relative z-10 flex items-center justify-center rounded-full flex-shrink-0 transition-all"
                          style={{
                            width: 32, height: 32,
                            background: isCurrent ? sc.color : (isPast ? sc.bg : '#fff'),
                            border: `2.5px solid ${isCurrent ? sc.color : (isPast ? sc.color + '88' : '#e5e7eb')}`,
                            cursor: isClickable ? 'pointer' : 'default',
                            opacity: isFuture && !isClickable ? 0.5 : 1,
                          }}>
                          <div style={{ color: isCurrent ? '#fff' : (isPast ? sc.color : '#cbd5e1'), display: 'flex' }}>
                            {STATUS_SVG[status] && React.cloneElement(STATUS_SVG[status] as any, { width: 15, height: 15 })}
                          </div>
                          {isCurrent && (
                            <div className="absolute -right-0.5 -top-0.5 w-3.5 h-3.5 rounded-full animate-ping" style={{ background: sc.color + '40' }} />
                          )}
                        </button>
                        {/* Label + description */}
                        <div className={`pt-1.5 pb-2 flex-1 ${isClickable ? 'cursor-pointer' : ''}`}
                          onClick={() => { if (isClickable) updateStatus(tOrder.$id, status); }}>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold transition" style={{ color: isCurrent ? sc.color : (isPast ? '#374151' : '#9ca3af') }}>
                              {labelFor(status)}
                            </p>
                            {isCurrent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: sc.color }}>ACTUAL</span>
                            )}
                            {isPast && !isCurrent && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={sc.color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{STATUS_DESC[status]}</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* Negotiation branch node */}
                  {(() => {
                    const isNeg = tOrder.STATUS === 'negotiation';
                    const ncol = STATUS_COLORS.negotiation;
                    return (
                      <div className="flex items-start gap-3 relative pt-2 mt-2 border-t border-dashed border-gray-200">
                        <button
                          onClick={() => { if (!isNeg && !isCancelled) updateStatus(tOrder.$id, 'negotiation'); }}
                          disabled={isNeg || isCancelled}
                          className="relative z-10 flex items-center justify-center rounded-full flex-shrink-0 transition-all"
                          style={{ width: 32, height: 32, background: isNeg ? ncol.color : ncol.bg, border: `2.5px solid ${ncol.color}`, cursor: (isNeg || isCancelled) ? 'default' : 'pointer', opacity: isCancelled ? 0.4 : (isNeg ? 1 : 0.7) }}>
                          <div style={{ color: isNeg ? '#fff' : ncol.color, display: 'flex' }}>
                            {STATUS_SVG.negotiation && React.cloneElement(STATUS_SVG.negotiation as any, { width: 15, height: 15 })}
                          </div>
                        </button>
                        <div className={`pt-1.5 pb-2 flex-1 ${(isNeg || isCancelled) ? '' : 'cursor-pointer'}`}
                          onClick={() => { if (!isNeg && !isCancelled) updateStatus(tOrder.$id, 'negotiation'); }}>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold" style={{ color: isNeg ? ncol.color : '#9ca3af' }}>Negociación</p>
                            {isNeg && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: ncol.color }}>ACTUAL</span>}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{STATUS_DESC.negotiation}</p>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Cancelled node */}
                  <div className="flex items-start gap-3 relative pt-2 mt-2 border-t border-dashed border-gray-200">
                    <button
                      onClick={() => { if (tOrder.STATUS !== 'cancelled') { updateStatus(tOrder.$id, 'cancelled'); setTimelineOrderId(null); } }}
                      disabled={isCancelled}
                      className="relative z-10 flex items-center justify-center rounded-full flex-shrink-0 transition-all"
                      style={{
                        width: 32, height: 32,
                        background: isCancelled ? STATUS_COLORS.cancelled.color : STATUS_COLORS.cancelled.bg,
                        border: `2.5px solid ${STATUS_COLORS.cancelled.color}`,
                        cursor: isCancelled ? 'default' : 'pointer',
                        opacity: isCancelled ? 1 : 0.6,
                      }}>
                      <div style={{ color: isCancelled ? '#fff' : STATUS_COLORS.cancelled.color, display: 'flex' }}>
                        {STATUS_SVG.cancelled}
                      </div>
                    </button>
                    <div className="pt-1.5 pb-2 flex-1"
                      onClick={() => { if (!isCancelled) { updateStatus(tOrder.$id, 'cancelled'); setTimelineOrderId(null); } }}>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold" style={{ color: isCancelled ? STATUS_COLORS.cancelled.color : '#9ca3af' }}>Cancelado</p>
                        {isCancelled && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: STATUS_COLORS.cancelled.color }}>ACTUAL</span>}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{STATUS_DESC.cancelled}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer — navigation buttons */}
              {!isCancelled && (
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => { if (currentIdx > 0) updateStatus(tOrder.$id, STATUS_FLOW[currentIdx - 1]); }}
                    disabled={currentIdx <= 0 || updatingId === tOrder.$id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    Anterior
                  </button>
                  <button
                    onClick={() => { if (currentIdx < STATUS_FLOW.length - 1) updateStatus(tOrder.$id, STATUS_FLOW[currentIdx + 1]); }}
                    disabled={currentIdx >= STATUS_FLOW.length - 1 || updatingId === tOrder.$id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-white rounded-xl text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: STATUS_COLORS[tOrder.STATUS]?.color || '#4f46e5' }}>
                    Siguiente
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
              {isCancelled && (
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100">
                  <button
                    onClick={() => { updateStatus(tOrder.$id, 'pending'); }}
                    disabled={updatingId === tOrder.$id}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition disabled:opacity-40">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                    Reactivar pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Quick Drawer (Cortina lateral) */}
      {drawerOrderId && (() => {
        const order = orders.find(o => o.$id === drawerOrderId);
        if (!order) return null;
        
        const date = order.CREATEDAT ? new Date(order.CREATEDAT) : new Date(order.$createdAt);
        const ageMs = Date.now() - date.getTime();
        const ageH = Math.floor(ageMs / 3600000);
        const ageD = Math.floor(ageH / 24);
        const ageStrRel = ageH < 1 ? 'ahora' : ageH < 24 ? `${ageH}h` : `${ageD}d ${ageH % 24}h`;
        const exactTime = date.toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
        const ageStr = `${ageStrRel} (${exactTime})`;
        
        const isRetiro = order.STATUS === 'shipped' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
        const statusColor = isRetiro ? '#c026d3' : (STATUS_COLORS[order.STATUS]?.color || '#6b7280');
        const statusBg = isRetiro ? '#fdf4ff' : (STATUS_COLORS[order.STATUS]?.bg || '#f3f4f6');
        const statusLabel = isRetiro ? 'Listo para Retirar' : (STATUS_CONFIG[order.STATUS]?.label || order.STATUS);
        
        const phoneClean = order.CUSTOMERPHONE ? order.CUSTOMERPHONE.replace(/\D/g, '') : '';
        const waPhone = phoneClean.length === 9 ? '56' + phoneClean : phoneClean;
        
        let items: any[] = [];
        try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
        const missingItems = items.filter((it: any) => !!it.missing);
        const hasMissing = missingItems.length > 0;
        const missingNames = missingItems.map((it: any) => `${it.name || ''} (x${it.qty || 1})`).join(', ');
        const orderLink = typeof window !== 'undefined' ? `${window.location.origin}/pedido/${order.$id}` : '';
        const firstMissingImg = missingItems[0]?.img || '';

        let msg4 = `Hola ${order.CUSTOMERNAME || ''}, te escribimos de Don Balato Iván Chile por tu pedido ${order.ORDERCODE || ''}. 😔 Lamentablemente tuvimos un problema de stock con los siguientes productos:\n\n${missingNames || 'Algunos productos'}\n\n🎁 ¡Pero te traemos una solución excelente! Hemos cargado el valor de esos productos a tu cuenta como *Crédito de Canje*.\n\n✨ *BENEFICIOS DE CANJE:*\n✅ Todo el catálogo disponible a un *20% de descuento* extra.\n✅ Usa tu saldo a favor para elegir nuevos productos. Si no te gastas todo el crédito, te guardamos el vuelto automáticamente como un cupón para tu próxima compra.\n\n📲 *¿CÓMO FUNCIONA?*\n1. Ingresa a tu pedido: ${orderLink}\n2. Haz clic en el botón fucsia "Canjear aquí"\n3. Agrega los productos que más te gusten y presiona "Confirmar Canje".\n\n¡Es muy rápido! Quedamos atentos a tu elección para poder despachar tu paquete lo antes posible. 🚚💨`;
        
        const missingWithImgs = missingItems.filter((it: any) => !!it.img);
        if (missingWithImgs.length > 0) {
          msg4 += `\n\nFotos de referencia:\n` + missingWithImgs.map((it: any) => `- ${it.name || ''}: ${it.img}`).join('\n');
        }

        const waUrl4 = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg4)}`;
        const showNegotiationBtn = hasMissing || order.STATUS === 'negotiation';
        
        const agencyDetails = order.SHIPPINGAGENCY ? getAgencyDetails(order.SHIPPINGAGENCY) : null;

        const copyToClipboard = (key: string, text: string) => {
          navigator.clipboard.writeText(text);
          setCopiedField(key);
          setTimeout(() => setCopiedField(null), 1500);
        };

        const copyAllShipping = () => {
          const text = `Destinatario: ${order.CUSTOMERNAME || ''}\nRUT: ${order.CUSTOMERRUT || ''}\nTeléfono: ${order.CUSTOMERPHONE || ''}\nEmail: ${order.CUSTOMEREMAIL || ''}\nDirección: ${order.ADDRESS || ''}\nComuna: ${order.COMUNA || ''}\nRegión: ${order.REGION || ''}\nAgencia: ${order.SHIPPINGAGENCY || ''}`;
          copyToClipboard('all_shipping', text);
        };
        
        return createPortal(
          <div className="fixed inset-0 z-[100] flex justify-end" style={{ background: 'rgba(0,0,0,0.3)', animation: 'kcFadeIn 0.2s ease-out' }} onClick={() => setDrawerOrderId(null)}>
            <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col relative border-l border-gray-200"
              style={{ animation: 'kcSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onClick={e => e.stopPropagation()}>
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                    Pedido <span className="font-mono text-indigo-600 font-extrabold">{order.ORDERCODE || '—'}</span>
                    {(order as any).NIGHTORDER && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 text-white inline-flex items-center gap-1 shadow-sm" title="Pedido hecho de noche: se saltó la confirmación de stock">
                        🌙 Nocturno
                      </span>
                    )}
                    {order.PAYMENTMETHOD === 'WhatsApp' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 inline-flex items-center gap-1">
                        💬 WhatsApp{order.ASSIGNEDCASHIER ? ` · ${order.ASSIGNEDCASHIER}` : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                        🌐 Web
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Creado hace {ageStr} ({date.toLocaleDateString('es-CL', { timeZone: 'America/Santiago' })})</p>
                </div>
                <button onClick={() => setDrawerOrderId(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl font-bold leading-none transition">×</button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {/* Total & Current Status card */}
                <div className="bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block">Monto Total</span>
                    <span className="text-2xl font-black text-gray-900">{fmt(order.TOTAL)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block mb-1">Estado Actual</span>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs font-bold px-3 py-1 rounded-full inline-block shadow-sm" style={{ background: statusBg, color: statusColor }}>
                        {statusLabel}
                      </span>
                      {(() => { try { const it = JSON.parse(order.ITEMS || '[]'); const cc = (order as any).CANJE_COUNT || 0; const hasCanje = it.some((i: any) => i.isCanjeReplacement); return (cc > 0 || hasCanje); } catch { return false; } })() && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">
                          🎁 Canje aplicado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Productos Faltantes (Negociación) */}
                {hasMissing && (
                  <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle size={18} className="shrink-0" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">Productos Faltantes</h4>
                      </div>
                      <span className="text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-200">Negociación</span>
                    </div>
                    <div className="space-y-2">
                      {missingItems.map((it: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-red-100/60 shadow-sm animate-fade-in">
                          {it.img ? (
                            <img src={it.img} alt="" className="w-10 h-10 object-contain rounded-lg border border-gray-100 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                              <Package className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-800 truncate">{it.name || ''}</p>
                            <p className="text-[10px] text-gray-400">Cantidad faltante: {it.qty || 1}</p>
                          </div>
                          {it.img && (
                            <button
                              onClick={() => copyToClipboard(`img-${idx}`, it.img)}
                              className={`p-1.5 rounded-lg border transition text-gray-400 hover:text-indigo-600 hover:bg-gray-50 shrink-0 ${copiedField === `img-${idx}` ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}
                              title="Copiar URL de la foto"
                            >
                              {copiedField === `img-${idx}` ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* WhatsApp Messages section */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#10b981" className="shrink-0">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 .953 11.996.953c-5.44 0-9.866 4.372-9.87 9.802-.001 1.77.463 3.5 1.34 5.016l-.995 3.633 3.731-.977zm11.367-7.79c-.273-.136-1.62-.8-1.87-.89-.25-.09-.432-.136-.613.136-.18.272-.7.89-.858 1.072-.158.18-.317.2-.59.064-1.286-.64-2.138-1.053-2.996-2.525-.227-.39.227-.362.649-1.201.07-.14.035-.262-.017-.37-.053-.107-.432-1.04-.593-1.43-.157-.38-.344-.326-.473-.326-.122 0-.262-.01-.403-.01-.14 0-.37.052-.563.262-.193.21-.738.722-.738 1.762s.755 2.04 1.884 2.19c1.129.15 2.2 1.59 3.56 2.09.4.15.78.16 1.07.12.33-.05 1.02-.42 1.16-.83.14-.41.14-.77.1-.84-.04-.07-.16-.11-.43-.24z"/>
                    </svg>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Mensajes de WhatsApp (Don Balato Iván)</h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    {showNegotiationBtn && (
                      <a href={waUrl4} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold transition shadow-sm hover:scale-[1.01] active:scale-95 text-left leading-normal border border-pink-500">
                        <span>🤝 4. Aviso Falta de Stock / Negociación</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 ml-2"><polyline points="9 18 15 12 9 6"/></svg>
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Shipping Details card (Bluexpress/Starken) */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Datos para Despacho</h4>
                    <button
                      onClick={copyAllShipping}
                      className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${copiedField === 'all_shipping' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <Copy size={11} />
                      {copiedField === 'all_shipping' ? '✓ Todo Copiado' : 'Copiar todo'}
                    </button>
                  </div>
                  
                  <div className="space-y-2.5">
                    {/* Destinatario */}
                    <div className="flex items-start justify-between text-xs gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Nombre Destinatario</span>
                        <span className="font-bold text-gray-800 truncate block">{order.CUSTOMERNAME || '—'}</span>
                      </div>
                      <button onClick={() => copyToClipboard('name', order.CUSTOMERNAME || '')}
                        className={`p-1.5 rounded-md border text-gray-400 hover:text-indigo-600 hover:bg-white transition shrink-0 ${copiedField === 'name' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-150'}`} title="Copiar nombre">
                        {copiedField === 'name' ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                      </button>
                    </div>

                    {/* RUT */}
                    <div className="flex items-start justify-between text-xs gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">RUT</span>
                        <span className="font-bold text-gray-800 block">{order.CUSTOMERRUT || '—'}</span>
                      </div>
                      <button onClick={() => copyToClipboard('rut', order.CUSTOMERRUT || '')}
                        disabled={!order.CUSTOMERRUT}
                        className={`p-1.5 rounded-md border text-gray-400 hover:text-indigo-600 hover:bg-white transition shrink-0 ${copiedField === 'rut' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-150'}`} title="Copiar RUT">
                        {copiedField === 'rut' ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                      </button>
                    </div>

                    {/* Telefono */}
                    <div className="flex items-start justify-between text-xs gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Teléfono</span>
                        <span className="font-bold text-indigo-600 font-mono block">{order.CUSTOMERPHONE || '—'}</span>
                      </div>
                      <button onClick={() => copyToClipboard('phone', order.CUSTOMERPHONE || '')}
                        className={`p-1.5 rounded-md border text-gray-400 hover:text-indigo-600 hover:bg-white transition shrink-0 ${copiedField === 'phone' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-150'}`} title="Copiar teléfono">
                        {copiedField === 'phone' ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                      </button>
                    </div>

                    {/* Email */}
                    <div className="flex items-start justify-between text-xs gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Email</span>
                        <span className="font-bold text-gray-700 block truncate max-w-[220px]" title={order.CUSTOMEREMAIL}>{order.CUSTOMEREMAIL || '—'}</span>
                      </div>
                      <button onClick={() => copyToClipboard('email', order.CUSTOMEREMAIL || '')}
                        className={`p-1.5 rounded-md border text-gray-400 hover:text-indigo-600 hover:bg-white transition shrink-0 ${copiedField === 'email' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-150'}`} title="Copiar email">
                        {copiedField === 'email' ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                      </button>
                    </div>

                    {/* Direccion */}
                    <div className="flex items-start justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Dirección de despacho</span>
                        <span className="text-xs text-gray-700 leading-normal font-bold block">{order.ADDRESS || '—'}</span>
                      </div>
                      <button onClick={() => copyToClipboard('address', order.ADDRESS || '')}
                        className={`p-1.5 rounded-md border text-gray-400 hover:text-indigo-600 hover:bg-white transition shrink-0 ${copiedField === 'address' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-150'}`} title="Copiar dirección">
                        {copiedField === 'address' ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                      </button>
                    </div>

                    {/* Comuna */}
                    <div className="flex items-start justify-between text-xs gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Comuna</span>
                        <span className="font-bold text-gray-800 block">{order.COMUNA || '—'}</span>
                      </div>
                      <button onClick={() => copyToClipboard('comune', order.COMUNA || '')}
                        className={`p-1.5 rounded-md border text-gray-400 hover:text-indigo-600 hover:bg-white transition shrink-0 ${copiedField === 'comune' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-150'}`} title="Copiar comuna">
                        {copiedField === 'comune' ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                      </button>
                    </div>

                    {/* Region */}
                    <div className="flex items-start justify-between text-xs gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Región</span>
                        <span className="font-bold text-gray-800 block">{order.REGION || '—'}</span>
                      </div>
                      <button onClick={() => copyToClipboard('region', order.REGION || '')}
                        className={`p-1.5 rounded-md border text-gray-400 hover:text-indigo-600 hover:bg-white transition shrink-0 ${copiedField === 'region' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-150'}`} title="Copiar región">
                        {copiedField === 'region' ? <span className="text-[9px] font-extrabold px-0.5">✓</span> : <Copy size={11} />}
                      </button>
                    </div>

                    {/* Agencia y Metodo de Pago */}
                    <div className="flex items-start justify-between text-xs gap-3 border-t border-gray-200/50 pt-2.5">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">Agencia y Pago</span>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {agencyDetails && (
                            <span style={{ color: agencyDetails.color, backgroundColor: agencyDetails.bg, borderColor: agencyDetails.color + '20' }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1">
                              {agencyDetails.logo && <img src={agencyDetails.logo} alt="" className="w-3.5 h-3.5 object-contain rounded-full" />}
                              {agencyDetails.name}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg border border-gray-200">{order.PAYMENTMETHOD || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Notes */}
                {(order as any).CUSTOMERNOTE && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notas del Cliente</h4>
                    <div className="bg-amber-50/50 border border-amber-100 text-amber-900 rounded-xl p-3 text-xs leading-relaxed font-medium">
                      {(order as any).CUSTOMERNOTE}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer action button */}
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-center gap-3">
                <button
                  onClick={async () => {
                    try {
                      // Open window IMMEDIATELY on click to avoid popup blocker
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write('<html><head><title>Cargando PDF...</title></head><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><p style="color:#999;font-size:16px;">Generando PDF...</p></body></html>');
                        printWindow.document.close();
                      }
                      const items = JSON.parse(order.ITEMS || '[]');
                      const ids = items.map((i: any) => i.id).filter(Boolean) as string[];
                      const extraInfo: Record<string, { sku?: string; location?: any }> = {};
                      if (ids.length > 0) {
                        const { databases } = getServices();
                        const { databaseId } = getAppwriteConfig();
                        for (const pid of ids) {
                          if (extraInfo[pid]) continue;
                          try {
                            const doc: any = await databases.getDocument(databaseId, PRODUCTS_COLLECTION_ID, pid);
                            const sku = getSkuFromFeatures(doc.FEATURES, doc.TAGS, doc.JUMPSSELLERID, doc.SKU);
                            const wh = getWarehouseLocationFromFeatures(doc.FEATURES);
                            extraInfo[pid] = { sku: sku || undefined, location: wh };
                          } catch {}
                        }
                      }
                      generateOrderPdf(order as any, items as any, Object.keys(extraInfo).length > 0 ? extraInfo : undefined, printWindow);
                    } catch (e) {
                      console.error('Error generating PDF', e);
                    }
                  }}
                  className="flex-1 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Printer size={16} />
                  PDF
                </button>
                <button
                  onClick={() => window.location.href = `/admin/orders/${order.$id}`}
                  className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/10 hover:scale-[1.01] active:scale-95"
                >
                  <Eye size={16} />
                  Ver Detalle Completo
                </button>
              </div>
            </div>
            
            <style>{`
              @keyframes kcSlideIn {
                0% { transform: translateX(100%); }
                100% { transform: translateX(0); }
              }
              @keyframes kcFadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
              }
            `}</style>
          </div>,
          document.body
        );
      })()}

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por código, nombre, RUT o teléfono..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-2 flex-wrap p-3 bg-indigo-50 border border-indigo-200 rounded-xl overflow-x-auto">
          <span className="text-sm font-medium text-indigo-700">{selected.size} seleccionado{selected.size !== 1 ? 's' : ''}</span>
          <span className="text-indigo-300">|</span>
          <span className="text-xs text-indigo-600">Cambiar a:</span>
          {(['pending', 'processing', 'paid', 'negotiation', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
            <button key={s} onClick={() => bulkUpdateStatus(s)} disabled={bulkUpdating}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition disabled:opacity-60 ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} hover:opacity-80`}>
              {STATUS_CONFIG[s].label}
            </button>
          ))}
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-indigo-500 hover:text-indigo-700">Limpiar</button>
          <button onClick={bulkDeleteOrders} disabled={bulkUpdating}
            className="px-3 py-1 rounded-xl text-xs font-bold transition disabled:opacity-60 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200">
            Eliminar {selected.size}
          </button>
        </div>
      )}

      {/* Mobile Card List & Desktop Table view */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Mobile View: Modern Cards */}
        <div className="block sm:hidden p-2 space-y-2">
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
              const scfg = STATUS_CONFIG[order.STATUS];
              const isRetiro = order.STATUS === 'shipped' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
              const statusColor = isRetiro ? '#c026d3' : (STATUS_COLORS[order.STATUS]?.color || '#6b7280');
              const ageH = Math.floor(ageMs / 3600000);
              const ageD = Math.floor(ageH / 24);
              const ageStrRel = ageH < 1 ? 'ahora' : ageH < 24 ? `${ageH}h` : `${ageD}d ${ageH % 24}h`;
              const exactTime = date.toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
              const ageStr = `${ageStrRel} (${exactTime})`;
              const pendingAgeStr = order.STATUS === 'pending' ? (ageD > 0 ? `${ageD}d ${ageH % 24}h sin pagar` : `${ageH}h sin pagar`) : null;
              const totalItems = items.reduce((s: number, it: any) => s + (it.qty || 1), 0);

              return (
                <div key={order.$id}
                  className={`relative p-4 hover:brightness-95 transition-all cursor-pointer ${selected.has(order.$id) ? 'ring-2 ring-indigo-400' : ''}`}
                  style={{ background: isRetiro ? '#fdf4ff' : (STATUS_COLORS[order.STATUS]?.bg || '#f3f4f6') }}
                  onClick={() => setDrawerOrderId(order.$id)}>
                  {/* Source left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r" style={{ background: order.PAYMENTMETHOD === 'WhatsApp' ? '#22c55e' : '#0ea5e9' }} />

                  {/* Row 1: Code + Time + Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(order.$id)}
                        onChange={() => toggleSelect(order.$id)}
                        className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
                      <span className="font-mono text-xs text-indigo-600 font-bold">{order.ORDERCODE || '—'}</span>
                      {order.PAYMENTMETHOD === 'WhatsApp' ? (
                        <>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp
                          </span>
                          {order.ASSIGNEDCASHIER && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              {order.ASSIGNEDCASHIER}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          🌐 Web
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-600 font-bold">{date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', timeZone: 'America/Santiago' })}</span>
                      <span className={`text-xs font-bold ${ageH < 3 ? 'text-indigo-500' : 'text-gray-500'}`}>{ageStr}</span>
                      {pendingAgeStr && <span className={`text-[10px] font-bold ${ageD >= 3 ? 'text-red-600' : 'text-orange-500'}`}>{pendingAgeStr}</span>}
                      {(() => { try { const it = JSON.parse(order.ITEMS || '[]'); const cc = (order as any).CANJE_COUNT || 0; const hasCanje = it.some((i: any) => i.isCanjeReplacement); return (cc > 0 || hasCanje); } catch { return false; } })() && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">
                          🎁 Canje
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Customer + Total */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5">
                        {order.CUSTOMERNAME}
                        {order.CUSTOMERPHONE && (() => { const pc = order.CUSTOMERPHONE!.replace(/\D/g, ''); const wa = pc.length === 9 ? '56' + pc : pc; return (
                          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 text-white transition shrink-0 text-sm" title="WhatsApp">
                            💬
                          </a>
                        ); })()}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{order.CUSTOMERPHONE || ''} · {order.COMUNA || '—'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-gray-900">{fmt(order.TOTAL)}</p>
                      <p className="text-[10px] text-gray-400">{totalItems} uds · {items.length} art.</p>
                    </div>
                  </div>

                  {/* Row 2.5: Status — full width centered */}
                  <div className="flex items-center justify-center mb-2">
                    <button onClick={(e) => { e.stopPropagation(); setTimelineOrderId(order.$id); }} className="text-sm font-bold px-5 py-1.5 rounded-full whitespace-nowrap cursor-pointer hover:opacity-90 transition text-white" style={{ background: statusColor }} title="Cambiar estado">
                      {isRetiro ? 'Retirar' : (scfg?.label || order.STATUS)}
                    </button>
                  </div>

                  {/* Row 3: Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isWarning && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-200 animate-pulse">⚠️ FALTAN PROD.</span>}
                    {needsTracking(order) && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded animate-pulse">📍 FALTA SEGUIMIENTO</span>}
                    {isOverdue && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-500 text-white rounded">VENCIDO</span>}
                    {(order as any).PURCHASEDFROMLIVE && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-600 text-white rounded">LIVE</span>}
                    {(order as any).ISGIFT && <span className="text-[9px] font-bold px-1 py-0.5 bg-pink-100 text-pink-700 rounded">🎁</span>}
                    {order.COUPONCODE && <span className="text-[9px] font-mono font-bold px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded">{order.COUPONCODE}</span>}
                    {agency && (() => {
                      const details = getAgencyDetails(agency);
                      return (
                        <span style={{ color: details?.color, backgroundColor: details?.bg, borderColor: details?.color + '20' }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1">
                          {details?.logo && <img src={details.logo} alt="" className="w-3.5 h-3.5 object-contain rounded-full" />}
                          {details?.name}
                        </span>
                      );
                    })()}
                    {/* Notificar pago for web orders in Stock Confirmado */}
                    {order.STATUS === 'paid' && order.PAYMENTMETHOD !== 'WhatsApp' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setWaShortcutOrderId(order.$id); }}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex items-center gap-1 animate-pulse"
                        title="Notificar pago">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        Notificar
                      </button>
                    )}
                    {/* Status change button */}
                    <button onClick={(e) => { e.stopPropagation(); setTimelineOrderId(order.$id); }}
                      className="ml-auto text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      Estado
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Modern Table */}
        <div className="hidden sm:block">
          {/* Toolbar: seleccionar todo + orden */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 bg-gray-50/70">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
              <span className="text-xs font-semibold text-gray-500">{selected.size > 0 ? `${selected.size} seleccionado${selected.size !== 1 ? 's' : ''}` : 'Seleccionar todo'}</span>
            </label>
            {/* Leyenda de origen */}
            <div className="hidden md:flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(155deg,#25d366,#12924a)' }} /> WhatsApp
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(155deg,#38bdf8,#0369a1)' }} /> Web
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mr-0.5">Ordenar</span>
              <button onClick={() => toggleSort('date')}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition ${sortBy === 'date' ? 'bg-indigo-100 text-indigo-700' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                Fecha {sortBy === 'date' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
              </button>
              <button onClick={() => toggleSort('total')}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition ${sortBy === 'total' ? 'bg-indigo-100 text-indigo-700' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                Total {sortBy === 'total' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
              </button>
            </div>
          </div>

          {/* Lista de tarjetas horizontales */}
          <div className="p-3 space-y-2.5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-stretch rounded-2xl border-2 border-gray-100 overflow-hidden animate-pulse">
                  <div className="w-[76px] bg-gray-100" />
                  <div className="flex-1 flex items-center gap-4 px-4 py-5">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-4 w-40 bg-gray-100 rounded" />
                    <div className="h-4 w-20 bg-gray-100 rounded ml-auto" />
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">No se encontraron pedidos</div>
            ) : (
                filtered.map(order => {
                  const date = order.CREATEDAT ? new Date(order.CREATEDAT) : new Date(order.$createdAt);
                  const isUpdating = updatingId === order.$id;
                  const ageMs = Date.now() - date.getTime();
                  const isOverdue = order.STATUS === 'pending' && ageMs > 3 * 86400000;
                  const ageH = Math.floor(ageMs / 3600000);
                  const ageD = Math.floor(ageH / 24);
                  const ageStrRel = ageH < 1 ? 'ahora' : ageH < 24 ? `${ageH}h` : `${ageD}d ${ageH % 24}h`;
                  const exactTime = date.toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
                  const ageStr = `${ageStrRel} (${exactTime})`;
                  const pendingAgeStr = order.STATUS === 'pending' ? (ageD > 0 ? `${ageD}d ${ageH % 24}h sin pagar` : `${ageH}h sin pagar`) : null;
                  
                  let items: any[] = [];
                  try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
                  const hasMissing = items.some((it: any) => it.missing === true);
                  const isWarning = hasMissing && ['pending', 'processing'].includes(order.STATUS);
                  const totalItems = items.reduce((s: number, it: any) => s + (it.qty || 1), 0);
                  const isRetiro = order.STATUS === 'shipped' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
                  const statusColor = isRetiro ? '#c026d3' : (STATUS_COLORS[order.STATUS]?.color || '#6b7280');
                  // Estilo de tarjeta horizontal (solo PC)
                  const isWa = order.PAYMENTMETHOD === 'WhatsApp';
                  const isSel = selected.has(order.$id);
                  const railGrad = isSel ? '#eef2ff' : isRetiro ? '#fdf4ff' : (STATUS_COLORS[order.STATUS]?.bg || '#f9fafb');
                  const cardBorder = isSel ? '#6366f1' : isWarning ? '#f59e0b' : isOverdue ? '#ef4444' : '#e5e7eb';
                  const cardBg = isSel ? '#eef2ff' : isRetiro ? '#fdf4ff' : (STATUS_COLORS[order.STATUS]?.bg || '#f3f4f6');
                  const statusBg = isRetiro ? '#fdf4ff' : (STATUS_COLORS[order.STATUS]?.bg || '#f3f4f6');
                  const statusLabel = isRetiro ? 'Retirar' : (STATUS_CONFIG[order.STATUS]?.label || order.STATUS);
                  const hasCanje = (() => { try { const it = JSON.parse(order.ITEMS || '[]'); const cc = (order as any).CANJE_COUNT || 0; return cc > 0 || it.some((i: any) => i.isCanjeReplacement); } catch { return false; } })();

                  return (
                    <React.Fragment key={order.$id}>
                    <div
                      className="group flex items-stretch rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                      style={{ background: cardBg }}
                      onClick={() => setDrawerOrderId(order.$id)}>

                      {/* Riel de origen (WhatsApp vs Web) */}
                      <div className="flex flex-col items-center justify-center gap-1.5 w-[76px] px-2 py-3 flex-shrink-0 relative" style={{ background: railGrad }} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          {isWa ? (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/3840px-WhatsApp.svg.png" alt="WhatsApp" className="w-14 h-14 object-contain" />
                          ) : (
                            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/e-commerce-3d-icon-png-download-8762567.png" alt="Web" className="w-14 h-14 object-contain" />
                          )}
                        </div>
                      </div>

                      {/* Cuerpo */}
                      <div className="flex-1 min-w-0 flex items-stretch">

                        {/* Código + items + cajera */}
                        <div className="flex flex-col justify-center min-w-[122px] px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            <input type="checkbox" checked={isSel}
                              onChange={() => toggleSelect(order.$id)}
                              className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer flex-shrink-0" />
                            <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                            <p className="font-mono text-xs text-indigo-600 font-bold">{order.ORDERCODE || '—'}</p>
                            {(order as any).NIGHTORDER && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 text-white inline-flex items-center shadow-sm" title="Pedido nocturno: stock confirmado automático">🌙</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 pl-2.5">
                            <p className="text-[10px] text-gray-400">{totalItems} uds · {items.length} art.</p>
                            {isWa && order.ASSIGNEDCASHIER && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">{order.ASSIGNEDCASHIER}</span>
                            )}
                          </div>
                        </div>

                        {/* Cliente */}
                        <div className="flex flex-col justify-center flex-1 min-w-0 px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-bold text-gray-900 truncate max-w-[200px]">{order.CUSTOMERNAME}</p>
                            {isWarning && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded shrink-0 border border-amber-200 animate-pulse">
                                ⚠️ FALTAN
                              </span>
                            )}
                            {order.STATUS === 'negotiation' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded shrink-0 border border-orange-200 animate-pulse">
                                🤝 EN CANJE
                              </span>
                            )}
                            {isOverdue && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-500 text-white rounded shrink-0">VENCIDO</span>}
                            {needsTracking(order) && <span className="text-[9px] font-bold px-1 py-0.5 bg-amber-500 text-white rounded shrink-0 animate-pulse">📍 SEGUIMIENTO</span>}
                            {(order as any).PURCHASEDFROMLIVE && <span className="text-[9px] font-bold px-1 py-0.5 bg-red-600 text-white rounded shrink-0">LIVE</span>}
                            {(order as any).ISGIFT && <span className="text-[9px] font-bold px-1 py-0.5 bg-pink-100 text-pink-700 rounded shrink-0">🎁</span>}
                            {(order as any).CUSTOMERNOTE && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title={(order as any).CUSTOMERNOTE} />}
                            {order.adminNotes && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" title="Tiene notas internas" />}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-xs text-gray-500 truncate font-medium">{order.CUSTOMERPHONE || ''}</p>
                            {order.CUSTOMERPHONE && (() => { const pc = order.CUSTOMERPHONE.replace(/\D/g, ''); const wa = pc.length === 9 ? '56' + pc : pc; return (
                              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 hover:bg-green-600 text-white transition shrink-0 text-xs" title="WhatsApp">
                                💬
                              </a>
                            ); })()}
                            {order.COUPONCODE && <span className="text-[9px] font-mono font-bold px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded">{order.COUPONCODE}</span>}
                            <span className="text-[10px] text-gray-300">·</span>
                            <span className="text-[10px] text-gray-400 truncate">{order.COMUNA || '—'}</span>
                          </div>
                        </div>

                        {/* Estado — centrado, click para cambiar */}
                        <div className="flex flex-col items-center justify-center min-w-[180px] px-4 py-3" onClick={e => { e.stopPropagation(); setTimelineOrderId(order.$id); }}>
                          <button className="text-sm font-bold px-5 py-2 rounded-full text-center whitespace-nowrap cursor-pointer hover:opacity-90 transition text-white" style={{ background: statusColor }} title="Cambiar estado">
                            {statusLabel}
                          </button>
                        </div>

                        {/* Agencia */}
                        <div className="hidden xl:flex flex-col justify-center min-w-[116px] px-4 py-3">
                          {order.SHIPPINGAGENCY ? (() => {
                            const details = getAgencyDetails(order.SHIPPINGAGENCY);
                            return (
                              <span
                                style={{
                                  color: details?.color,
                                  backgroundColor: details?.bg,
                                  borderColor: (details?.color || '') + '20'
                                }}
                                className="px-2 py-0.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1"
                              >
                                {details?.logo && (
                                  <img src={details.logo} alt="" className="w-3.5 h-3.5 object-contain rounded-full" />
                                )}
                                {details?.name}
                              </span>
                            );
                          })() : <span className="text-gray-300 text-xs">—</span>}
                        </div>

                        {/* Total */}
                        <div className="flex flex-col justify-center items-end min-w-[104px] px-4 py-3">
                          <p className="font-extrabold text-gray-900 text-[15px] leading-tight">{fmt(order.TOTAL)}</p>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center justify-center gap-1.5 px-4 py-3" onClick={e => e.stopPropagation()}>
                          {order.STATUS === 'paid' && !isWa && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setWaShortcutOrderId(order.$id); }}
                              className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex items-center gap-1 text-[11px] font-bold animate-pulse"
                              title="Notificar pago">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                              Notificar
                            </button>
                          )}
                          {hasCanje && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 whitespace-nowrap">
                              🎁 Canje
                            </span>
                          )}
                        </div>

                        {/* Fecha / antigüedad */}
                        <div className="flex flex-col justify-center min-w-[110px] px-4 py-3">
                          <p className="text-sm text-gray-700 font-bold">{date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', timeZone: 'America/Santiago' })}</p>
                          <p className="text-xs mt-0.5">
                            <span className={`font-bold ${ageH < 3 ? 'text-indigo-500' : ageH < 24 ? 'text-gray-500' : 'text-gray-400'}`}>{ageStr}</span>
                            {pendingAgeStr && <span className={`block font-bold ${ageD >= 3 ? 'text-red-600' : 'text-orange-500'}`}>{pendingAgeStr}</span>}
                          </p>
                        </div>

                      </div>
                    </div>
                    </React.Fragment>
                  );
                })
              )}
          </div>
          {/* Barra resumen (PC) */}
          {filtered.length > 0 && !isLoading && (() => {
            const totalSum = filtered.reduce((s, o) => s + o.TOTAL, 0);
            const subtotalSum = filtered.reduce((s, o) => s + (o.SUBTOTAL || o.TOTAL), 0);
            const shippingSum = filtered.reduce((s, o) => s + (o.SHIPPINGCOST || 0), 0);
            const paidOrders = filtered.filter(o => ['paid','processing','shipped','delivered'].includes(o.STATUS));
            const avgTicket = paidOrders.length > 0 ? Math.round(paidOrders.reduce((s,o)=>s+o.TOTAL,0)/paidOrders.length) : 0;
            const couponDiscount = filtered.reduce((s, o) => s + (o.DISCOUNTAMOUNT || 0), 0);
            const byCustomer: Record<string, { name: string; total: number }> = {};
            for (const o of filtered) {
              const key = o.CUSTOMERRUT || o.CUSTOMERNAME || 'anon';
              if (!byCustomer[key]) byCustomer[key] = { name: o.CUSTOMERNAME || key, total: 0 };
              byCustomer[key].total += o.TOTAL;
            }
            const top = Object.values(byCustomer).sort((a, b) => b.total - a.total)[0];
            const totalItems = filtered.reduce((s, o) => { try { return s + (JSON.parse(o.ITEMS || '[]') as any[]).reduce((a: number, i: any) => a + (i.quantity || 1), 0); } catch { return s; } }, 0);
            const avgItems = filtered.length > 0 ? (totalItems / filtered.length).toFixed(1) : null;
            return (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5 border-t-2 border-gray-200 bg-gray-50">
                <div>
                  <p className="text-sm font-bold text-gray-700">{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</p>
                  {top && Object.keys(byCustomer).length > 1 && (
                    <p className="text-[10px] text-gray-400 mt-0.5 font-normal truncate max-w-[160px]">Top: {top.name.split(' ')[0]} {fmt(top.total)}</p>
                  )}
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-1 text-right">
                  {avgTicket > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Ticket ∅</p>
                      <p className="text-sm font-semibold text-gray-600">{fmt(avgTicket)}</p>
                    </div>
                  )}
                  {avgItems && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Art./pedido</p>
                      <p className="text-sm font-semibold text-gray-600">∅ {avgItems}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pagados</p>
                    <p className="text-sm font-semibold text-gray-600">{fmt(paidOrders.reduce((s, o) => s + o.TOTAL, 0))}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total</p>
                    <p className="text-base font-extrabold text-gray-900">{fmt(totalSum)}</p>
                    {shippingSum > 0 && <p className="text-[10px] text-gray-400">{fmt(subtotalSum)} + {fmt(shippingSum)} env.</p>}
                    {couponDiscount > 0 && <p className="text-[10px] text-emerald-600">-{fmt(couponDiscount)} cupones</p>}
                  </div>
                </div>
              </div>
            );
          })()}
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
