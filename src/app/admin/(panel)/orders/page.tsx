'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Query, ID } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order, OrderStatus } from '@/types/admin';
import { Search, RefreshCw, ChevronDown, Eye, AlertTriangle, X, Download, ArrowUpDown, ArrowUp, ArrowDown, MapPin, Calendar, Package, Copy } from 'lucide-react';
import { getWarehouseLocationFromFeatures, getSkuFromFeatures } from '@/lib/product-features';
import Link from 'next/link';
import EpicPagination from '@/components/admin/EpicPagination';

const STATUS_FLOW = ['pending', 'processing', 'paid', 'assembling', 'confirming_stock', 'stock_confirmed', 'packing', 'ready_to_ship', 'shipped', 'delivered'];

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
  processing:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14v18l-2.5-1.6L14 21l-2-1.6L10 21l-2.5-1.6L5 21z"/><path d="M9 8h6M9 12h4"/></svg>,
  paid:               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M9 11.5l2 2 4-4"/></svg>,
  assembling:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V3h12v6"/><path d="M6 17H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="7"/><circle cx="17.5" cy="12" r=".7"/></svg>,
  confirming_stock:   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
  stock_confirmed:    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4"/><path d="M9 13l2 2 4-4"/></svg>,
  packing:            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.3 7L12 12l8.7-5"/><path d="M12 22V12"/></svg>,
  negotiation:        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H8l-4 3V5a2 2 0 012-2h13a2 2 0 012 2z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/></svg>,
  preparing_shipping: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  ready_to_ship:      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5L4 4h16l1 4.5"/><path d="M4 8.5V19a1 1 0 001 1h14a1 1 0 001-1V8.5"/><path d="M9.5 12.5h5"/></svg>,
  shipped:            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4h13v11H1z"/><path d="M14 8h4l3 3v4h-7z"/><circle cx="5.5" cy="18" r="2"/><circle cx="18.5" cy="18" r="2"/></svg>,
  delivered:          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13"/><path d="M3 21h18"/><path d="M9 21v-7h6v7"/></svg>,
  cancelled:          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
};

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending:            { color: '#f97316', bg: '#fff7ed' },
  processing:         { color: '#3b82f6', bg: '#eff6ff' },
  paid:               { color: '#10b981', bg: '#ecfdf5' },
  assembling:         { color: '#6366f1', bg: '#eef2ff' },
  confirming_stock:   { color: '#14b8a6', bg: '#f0fdfa' },
  stock_confirmed:    { color: '#65a30d', bg: '#f7fee7' },
  packing:            { color: '#d97706', bg: '#fffbeb' },
  negotiation:        { color: '#ec4899', bg: '#fdf2f8' },
  preparing_shipping: { color: '#f97316', bg: '#fff7ed' },
  ready_to_ship:      { color: '#06b6d4', bg: '#ecfeff' },
  shipped:            { color: '#8b5cf6', bg: '#f5f3ff' },
  delivered:          { color: '#22c55e', bg: '#f0fdf4' },
  cancelled:          { color: '#ef4444', bg: '#fef2f2' },
};

const PAGE_SIZE = 30;

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  all:                { label: 'Todos',                     bg: 'bg-gray-100',    text: 'text-gray-700' },
  paid_group:         { label: 'Pagados',                   bg: 'bg-green-100',   text: 'text-green-700' },
  pending:            { label: 'Pendiente',                 bg: 'bg-orange-100',  text: 'text-orange-700' },
  cancelled:          { label: 'Cancelado',                 bg: 'bg-red-100',     text: 'text-red-700' },
  processing:         { label: 'Pago Recibido',             bg: 'bg-blue-100',    text: 'text-blue-700' },
  paid:               { label: 'Pago Verificado',           bg: 'bg-emerald-100', text: 'text-emerald-700' },
  assembling:         { label: 'Imprimiendo Etiqueta',      bg: 'bg-indigo-100',  text: 'text-indigo-700' },
  confirming_stock:   { label: 'Confirmando Stock',         bg: 'bg-teal-100',    text: 'text-teal-700' },
  stock_confirmed:    { label: 'Stock Confirmado',          bg: 'bg-lime-100',    text: 'text-lime-700' },
  packing:            { label: 'Embalando Pedido',          bg: 'bg-amber-100',   text: 'text-amber-700' },
  negotiation:        { label: 'Negociación',               bg: 'bg-pink-100',    text: 'text-pink-700' },
  preparing_shipping: { label: 'Etiqueta Lista',            bg: 'bg-orange-100',  text: 'text-orange-700' },
  ready_to_ship:      { label: 'Listo para Despachar',      bg: 'bg-cyan-100',    text: 'text-cyan-700' },
  shipped:            { label: 'Salió de Tienda',           bg: 'bg-violet-100',  text: 'text-violet-700' },
  delivered:          { label: 'Entregado a Agencia',       bg: 'bg-green-100',   text: 'text-green-700' },
};

// Etiquetas cortas para los badges (evita el bug de label.split(' ')[0] que mostraba "Pago" en ambos)
const SHORT_LABEL: Record<string, string> = {
  pending:            'Pendiente',
  processing:         'Recibido',
  paid:               'Verificado',
  assembling:         'Etiqueta',
  confirming_stock:   'Confirmando',
  stock_confirmed:    'Confirmado',
  packing:            'Embalando',
  negotiation:        'Negociación',
  preparing_shipping: 'Etiqueta',
  ready_to_ship:      'Despachar',
  shipped:            'Salió',
  delivered:          'Entregado',
  cancelled:          'Cancelado',
};

const STATUS_KEYS = Object.keys(STATUS_CONFIG);

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [trackingPending, setTrackingPending] = useState(false);
  const [pickupReady, setPickupReady] = useState(false);
  const filterUserId = searchParams.get('userId') || '';
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [timelineOrderId, setTimelineOrderId] = useState<string | null>(null);
  const [drawerOrderId, setDrawerOrderId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [productLocations, setProductLocations] = useState<Record<string, { section: number | null; gondola: string | null }>>({}); // product id -> location
  const [agenciesList, setAgenciesList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // Stats cache — persists until manual refresh
  const [statsCache, setStatsCache] = useState<{ totalToday: number; countToday: number; topCustomer: { name: string; total: number } | null; avgTicket: number; totalPaid: number; countPaid: number; byStatus: Record<string, number>; byStatusAll: Record<string, number>; byStatusYesterday: Record<string, number>; byStatusDayBefore: Record<string, number>; allOrdersRaw: any[]; totalYesterday: number; countYesterday: number; totalAll: number; countAll: number; } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  // page cursors: key = page number, value = cursor to use to reach that page
  const pageCursorsRef = React.useRef<Map<number, string | null>>(new Map([[1, null]]));

  // Load stats — cached until manual refresh
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const nowCLT = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
      const startToday = new Date(nowCLT.getFullYear(), nowCLT.getMonth(), nowCLT.getDate(), 0, 0, 0, 0).getTime();
      const startYesterday = startToday - 86400000;
      const startDayBefore = startToday - 2 * 86400000;

      // Fetch all orders from last 3 days + all paid orders for stats
      const allOrders: any[] = [];
      let cursor: string | null = null;
      while (true) {
        const q: any[] = [Query.orderDesc('CREATEDAT'), Query.limit(100)];
        if (cursor) q.push(Query.cursorAfter(cursor));
        const resp = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, q);
        allOrders.push(...resp.documents);
        if (resp.documents.length < 100) break;
        cursor = resp.documents[resp.documents.length - 1].$id;
        if (allOrders.length > 3000) break;
      }

      const todayOrders = allOrders.filter((o: any) => (o.CREATEDAT || new Date(o.$createdAt).getTime()) >= startToday);
      const yesterdayOrders = allOrders.filter((o: any) => { const ts = o.CREATEDAT || new Date(o.$createdAt).getTime(); return ts >= startYesterday && ts < startToday; });
      const paidStatuses = ['processing', 'paid', 'assembling', 'confirming_stock', 'stock_confirmed', 'packing', 'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped', 'delivered'];
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
      // By status counts (all orders — cached, 1 read)
      const byStatusAll: Record<string, number> = {};
      for (const o of allOrders) { byStatusAll[o.STATUS] = (byStatusAll[o.STATUS] || 0) + 1; }
      // By status counts (yesterday)
      const byStatusYesterday: Record<string, number> = {};
      for (const o of yesterdayOrders) { byStatusYesterday[o.STATUS] = (byStatusYesterday[o.STATUS] || 0) + 1; }
      // By status counts (day before)
      const dayBeforeOrders = allOrders.filter((o: any) => { const ts = o.CREATEDAT || new Date(o.$createdAt).getTime(); return ts >= startDayBefore && ts < startYesterday; });
      const byStatusDayBefore: Record<string, number> = {};
      for (const o of dayBeforeOrders) { byStatusDayBefore[o.STATUS] = (byStatusDayBefore[o.STATUS] || 0) + 1; }

      setStatsCache({
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
        allOrdersRaw: allOrders,
        totalAll: allOrders.reduce((s: number, o: any) => s + (o.TOTAL || 0), 0),
        countAll: allOrders.length,
      });
    } catch (e: any) { console.error('Stats error:', e); }
    finally { setStatsLoading(false); }
  }, []);

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
      if (activeFilter === 'paid_group') {
        queries.push(Query.equal('STATUS', [
          'processing', 'paid', 'assembling', 'confirming_stock', 'stock_confirmed', 'packing',
          'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped', 'delivered'
        ]));
      } else if (activeFilter !== 'all') {
        queries.push(Query.equal('STATUS', activeFilter));
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
    loadStats();
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
    if (regionFilter !== 'all') {
      const r = (o as any).REGION || '';
      if (r !== regionFilter) return false;
    }
    if (liveOnly && !(o as any).PURCHASEDFROMLIVE) return false;
    if (trackingPending && !needsTracking(o)) return false;
    if (pickupReady && !(o.STATUS === 'ready_to_ship' && isPickup(o.SHIPPINGAGENCY))) return false;
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
          <button onClick={() => { pageCursorsRef.current = new Map([[1, null]]); load(1); loadStats(); }} disabled={isLoading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

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
            <p className="text-[10px] text-gray-400 font-medium mt-1">{statsCache.countPaid} pagados hoy</p>
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
          const sTs = new Date(customDateStart + 'T00:00:00').getTime();
          const eTs = customDateEnd ? new Date(customDateEnd + 'T23:59:59').getTime() : sTs + 86400000;
          const filtered = (statsCache?.allOrdersRaw || []).filter((o: any) => { const ts = o.CREATEDAT || new Date(o.$createdAt).getTime(); return ts >= sTs && ts <= eTs; });
          statusCounts = {};
          for (const o of filtered) { statusCounts[o.STATUS] = (statusCounts[o.STATUS] || 0) + 1; }
        } else statusCounts = statsCache?.byStatusAll || {};
        const counts = STATUS_FLOW.map(st => statusCounts[st] || 0);
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
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] sm:min-w-[21px] sm:h-[21px] flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold rounded-full px-1 border-2 sm:border-[2.5px] border-white"
                      style={{ background: isActive ? '#0f172a' : `linear-gradient(135deg, ${sc.color}, ${sc.color}cc)`, color: '#fff', boxShadow: `0 2px 5px -1px ${sc.color}55`, animation: 'kcBadgePop 0.45s cubic-bezier(0.34,1.56,0.64,1)' }}>
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
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] sm:min-w-[21px] sm:h-[21px] flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold rounded-full px-1 border-2 sm:border-[2.5px] border-white"
                      style={{ background: isActive ? '#0f172a' : `linear-gradient(135deg, ${sc.color}, ${sc.color}cc)`, color: '#fff', boxShadow: `0 2px 5px -1px ${sc.color}55`, animation: 'kcBadgePop 0.45s cubic-bezier(0.34,1.56,0.64,1)' }}>
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
          Pagados
        </button>
        {/* Pendiente — soft orange */}
        <button onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition bg-orange-100 text-orange-700 border border-orange-200 ${activeFilter === 'pending' ? 'ring-2 ring-orange-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
          Pendiente
        </button>
        {/* Cancelado — soft red */}
        <button onClick={() => setActiveFilter('cancelled')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition bg-red-100 text-red-700 border border-red-200 ${activeFilter === 'cancelled' ? 'ring-2 ring-red-500 ring-inset shadow-sm' : 'hover:opacity-80'}`}>
          Cancelado
        </button>
        {/* More states — opens modal */}
        <button onClick={() => setShowStatusModal(true)}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 ${['processing','paid','assembling','confirming_stock','stock_confirmed','packing','negotiation','preparing_shipping','ready_to_ship','shipped','delivered'].includes(activeFilter) ? 'ring-2 ring-indigo-500 ring-inset shadow-sm' : ''}`}>
          Más estados ▾
        </button>
        {paymentMethods.length > 2 && (
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            {paymentMethods.map(pm => (
              <option key={pm} value={pm}>{pm === 'all' ? 'Todos los métodos' : pm}</option>
            ))}
          </select>
        )}
        {orders.some(o => (o as any).PURCHASEDFROMLIVE) && (
          <button onClick={() => setLiveOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition border ${liveOnly ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            🔴 Solo Live
          </button>
        )}
        {(() => { const n = orders.filter(o => o.STATUS === 'ready_to_ship' && isPickup(o.SHIPPINGAGENCY)).length; return n > 0 ? (
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
              {(['processing', 'paid', 'assembling', 'confirming_stock', 'stock_confirmed', 'packing', 'negotiation', 'ready_to_ship', 'shipped', 'delivered'] as const).map(key => {
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

      {/* Timeline Modal — vertical timeline to change order status */}
      {timelineOrderId && (() => {
        const tOrder = orders.find(o => o.$id === timelineOrderId);
        if (!tOrder) return null;
        const currentIdx = STATUS_FLOW.indexOf(tOrder.STATUS);
        const isCancelled = tOrder.STATUS === 'cancelled';
        const tIsPickup = isPickup(tOrder.SHIPPINGAGENCY);
        const STATUS_DESC: Record<string, string> = {
          pending: 'El cliente hizo el pedido pero aún no ha pagado.',
          processing: 'Se recibió el comprobante de pago, hay que verificarlo.',
          paid: 'El pago fue confirmado y verificado correctamente.',
          assembling: 'Se está imprimiendo la etiqueta del pedido.',
          confirming_stock: 'El embalador está separando y confirmando los productos.',
          stock_confirmed: 'El stock fue confirmado, el pedido está completo.',
          packing: 'Se está embalando el pedido.',
          negotiation: 'Faltan productos, se está negociando con el cliente.',
          preparing_shipping: 'La etiqueta de envío está lista para imprimir.',
          ready_to_ship: tIsPickup ? 'El pedido está listo para que el cliente lo retire.' : 'El paquete está listo para despachar (toma foto de las cajas).',
          shipped: tIsPickup ? 'El pedido salió de la tienda.' : 'El pedido salió de la tienda con la agencia.',
          delivered: tIsPickup ? 'El cliente retiró su pedido.' : 'El pedido fue entregado a la agencia de transporte.',
          cancelled: 'El pedido fue cancelado y el stock fue devuelto.',
        };
        // Etiquetas dependientes de retiro/agencia para el timeline
        const labelFor = (status: string) => {
          if (status === 'ready_to_ship' && tIsPickup) return 'Listo para Retirar';
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
                            <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full border-2 border-white animate-pulse" style={{ background: sc.color }} />
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
        const ageStr = ageH < 1 ? 'ahora' : ageH < 24 ? `${ageH}h` : `${ageD}d ${ageH % 24}h`;
        
        const isRetiro = order.STATUS === 'ready_to_ship' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
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

        const msg1 = `Hola ${order.CUSTOMERNAME || ''}, te escribimos de Kevin&Coco Chile por tu pedido ${order.ORDERCODE || ''}. Queríamos confirmar si tuviste algún problema para realizar tu pago o si tienes alguna duda con el envío. ¡Avísanos y te ayudamos a completarlo!`;
        const msg2 = `Hola ${order.CUSTOMERNAME || ''}, espero que estés muy bien. Aún tenemos reservado tu pedido ${order.ORDERCODE || ''} en Kevin&Coco Chile. Como queremos que disfrutes tus productos, si realizas tu pago hoy te regalamos un 5% de descuento adicional en esta compra con el cupón PAGO5. ¿Te gustaría que te envíe los datos de transferencia?`;
        const msg3 = `Hola ${order.CUSTOMERNAME || ''}, te escribimos de Kevin&Coco Chile. Para poder liberar el stock a otros clientes, te comentamos que tu pedido ${order.ORDERCODE || ''} se cancelará automáticamente en unas horas. Si aún deseas tus productos, puedes enviarnos el comprobante de transferencia hoy mismo para procesarlo de inmediato. ¡Quedamos atentos!`;
        
        let msg4 = `Hola ${order.CUSTOMERNAME || ''}, te escribimos de Kevin&Coco Chile por tu pedido ${order.ORDERCODE || ''}. Queríamos comentarte que lamentablemente nos quedamos sin stock de: ${missingNames || 'algunos productos'}. Puedes ingresar a este enlace para ver las opciones disponibles y seleccionar tus productos de reemplazo: ${orderLink}`;
        
        const missingWithImgs = missingItems.filter((it: any) => !!it.img);
        if (missingWithImgs.length > 0) {
          msg4 += `\n\nFotos de referencia:\n` + missingWithImgs.map((it: any) => `- ${it.name || ''}: ${it.img}`).join('\n');
        }

        const waUrl1 = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg1)}`;
        const waUrl2 = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg2)}`;
        const waUrl3 = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg3)}`;
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
        
        return (
          <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.3)', animation: 'kcFadeIn 0.2s ease-out' }} onClick={() => setDrawerOrderId(null)}>
            <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col relative border-l border-gray-200"
              style={{ animation: 'kcSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onClick={e => e.stopPropagation()}>
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    Pedido <span className="font-mono text-indigo-600 font-extrabold">{order.ORDERCODE || '—'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Creado hace {ageStr} ({date.toLocaleString('es-CL', { timeZone: 'America/Santiago' })})</p>
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
                    <span className="text-xs font-bold px-3 py-1 rounded-full inline-block shadow-sm" style={{ background: statusBg, color: statusColor }}>
                      {statusLabel}
                    </span>
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
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Mensajes de WhatsApp (Kevin&Coco)</h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={waUrl1} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold transition shadow-sm hover:scale-[1.01] active:scale-95 text-left leading-normal">
                      <span>1. Recordatorio Amistoso (24h)</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 ml-2"><polyline points="9 18 15 12 9 6"/></svg>
                    </a>
                    <a href={waUrl2} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-sm hover:scale-[1.01] active:scale-95 text-left leading-normal">
                      <span>2. Incentivo Pago 5% Descuento (2-3d)</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 ml-2"><polyline points="9 18 15 12 9 6"/></svg>
                    </a>
                    <a href={waUrl3} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition shadow-sm hover:scale-[1.01] active:scale-95 text-left leading-normal">
                      <span>3. Último Aviso / Liberar Stock (3d+)</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 ml-2"><polyline points="9 18 15 12 9 6"/></svg>
                    </a>
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
                  onClick={() => window.location.href = `/admin/orders/${order.$id}`}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/10 hover:scale-[1.01] active:scale-95"
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
          </div>
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
          {(['pending', 'processing', 'paid', 'assembling', 'confirming_stock', 'stock_confirmed', 'packing', 'negotiation', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
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
        {/* Mobile View: Modern Cards */}
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
              const scfg = STATUS_CONFIG[order.STATUS];
              const isRetiro = order.STATUS === 'ready_to_ship' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
              const statusColor = isRetiro ? '#c026d3' : (STATUS_COLORS[order.STATUS]?.color || '#6b7280');
              const ageH = Math.floor(ageMs / 3600000);
              const ageD = Math.floor(ageH / 24);
              const ageStr = ageH < 1 ? 'ahora' : ageH < 24 ? `${ageH}h` : `${ageD}d ${ageH % 24}h`;
              const pendingAgeStr = order.STATUS === 'pending' ? (ageD > 0 ? `${ageD}d ${ageH % 24}h sin pagar` : `${ageH}h sin pagar`) : null;
              const totalItems = items.reduce((s: number, it: any) => s + (it.qty || 1), 0);

              return (
                <div key={order.$id}
                  className={`relative p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selected.has(order.$id) ? 'bg-indigo-50/60' : isWarning ? 'bg-amber-50/70' : isOverdue ? 'bg-red-50/50' : ''}`}
                  onClick={() => setDrawerOrderId(order.$id)}>
                  {/* Status left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r" style={{ background: statusColor }} />

                  {/* Row 1: Code + Time + Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(order.$id)}
                        onChange={() => toggleSelect(order.$id)}
                        className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
                      <span className="font-mono text-xs text-indigo-600 font-bold">{order.ORDERCODE || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 font-medium">{ageStr}</span>
                      {pendingAgeStr && <span className={`text-[10px] font-bold ${ageD >= 3 ? 'text-red-600' : 'text-orange-500'}`}>{pendingAgeStr}</span>}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: (isRetiro ? '#fdf4ff' : STATUS_COLORS[order.STATUS]?.bg) || '#f3f4f6', color: statusColor }}>
                        {isRetiro ? 'Retirar' : (SHORT_LABEL[order.STATUS] || scfg?.label || order.STATUS)}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Customer + Total */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{order.CUSTOMERNAME}</p>
                      <p className="text-[11px] text-gray-400 truncate">{order.CUSTOMERPHONE || ''} · {order.COMUNA || '—'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-gray-900">{fmt(order.TOTAL)}</p>
                      <p className="text-[10px] text-gray-400">{totalItems} uds · {items.length} art.</p>
                    </div>
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
                    {order.PAYMENTMETHOD && <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{order.PAYMENTMETHOD}</span>}
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
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Código</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Agencia</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <button onClick={() => toggleSort('total')} className="flex items-center gap-1 ml-auto hover:text-gray-700 transition">
                    Total
                    {sortBy === 'total' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                  </button>
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
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
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No se encontraron pedidos</td></tr>
              ) : (
                filtered.map(order => {
                  const date = order.CREATEDAT ? new Date(order.CREATEDAT) : new Date(order.$createdAt);
                  const isUpdating = updatingId === order.$id;
                  const ageMs = Date.now() - date.getTime();
                  const isOverdue = order.STATUS === 'pending' && ageMs > 3 * 86400000;
                  const ageH = Math.floor(ageMs / 3600000);
                  const ageD = Math.floor(ageH / 24);
                  const ageStr = ageH < 1 ? 'ahora' : ageH < 24 ? `${ageH}h` : `${ageD}d ${ageH % 24}h`;
                  const pendingAgeStr = order.STATUS === 'pending' ? (ageD > 0 ? `${ageD}d ${ageH % 24}h sin pagar` : `${ageH}h sin pagar`) : null;
                  
                  let items: any[] = [];
                  try { items = JSON.parse(order.ITEMS || '[]'); } catch {}
                  const hasMissing = items.some((it: any) => it.missing === true);
                  const isWarning = hasMissing && ['pending', 'processing'].includes(order.STATUS);
                  const totalItems = items.reduce((s: number, it: any) => s + (it.qty || 1), 0);
                  const isRetiro = order.STATUS === 'ready_to_ship' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA';
                  const statusColor = isRetiro ? '#c026d3' : (STATUS_COLORS[order.STATUS]?.color || '#6b7280');

                  return (
                    <React.Fragment key={order.$id}>
                    <tr className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${selected.has(order.$id) ? 'bg-indigo-50/60' : isWarning ? 'bg-amber-50/70 hover:bg-amber-100/70' : isOverdue ? 'bg-red-50/50' : ''}`}
                      onClick={() => setDrawerOrderId(order.$id)}>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={selected.has(order.$id)}
                          onChange={() => toggleSelect(order.$id)}
                          className="w-4 h-4 rounded text-indigo-600 border-gray-300 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                          <div>
                            <p className="font-mono text-xs text-indigo-600 font-bold">{order.ORDERCODE || '—'}</p>
                            <p className="text-[10px] text-gray-400">{totalItems} uds · {items.length} art.</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-gray-900 truncate max-w-[140px]">{order.CUSTOMERNAME}</p>
                          {isWarning && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded shrink-0 border border-amber-200 animate-pulse">
                              ⚠️ FALTAN
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
                          <p className="text-xs text-gray-400">{order.CUSTOMERPHONE || ''}</p>
                          {order.COUPONCODE && <span className="text-[9px] font-mono font-bold px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded">{order.COUPONCODE}</span>}
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] text-gray-400">{order.COMUNA || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
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
                        })() : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-bold text-gray-900">{fmt(order.TOTAL)}</p>
                        {order.PAYMENTMETHOD && <p className="text-[10px] text-gray-400 mt-0.5">{order.PAYMENTMETHOD}</p>}
                      </td>
                      <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setTimelineOrderId(order.$id)}
                          disabled={isUpdating}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transition hover:opacity-80 inline-flex items-center gap-1.5"
                          style={{ background: (isRetiro ? '#fdf4ff' : STATUS_COLORS[order.STATUS]?.bg) || '#f3f4f6', color: statusColor }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                          {isRetiro ? 'Retirar' : (SHORT_LABEL[order.STATUS] || STATUS_CONFIG[order.STATUS]?.label || order.STATUS)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-600 font-medium">{date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', timeZone: 'America/Santiago' })}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          <span className={`font-semibold ${ageH < 3 ? 'text-indigo-500' : ageH < 24 ? 'text-gray-400' : 'text-gray-300'}`}>{ageStr}</span>
                          {pendingAgeStr && <span className={`block font-bold ${ageD >= 3 ? 'text-red-600' : 'text-orange-500'}`}>{pendingAgeStr}</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
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
                        <tr className="bg-gray-50/50">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* Items */}
                              <div className="lg:col-span-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Productos ({items.length})</p>
                                <div className="space-y-1.5">
                                  {items.map((it: any, i: number) => {
                                    const loc = it.id ? productLocations[it.id] : null;
                                    const itemMissing = !!it.missing;
                                    return (
                                      <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${itemMissing ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                                        {it.img ? <img src={it.img} alt="" className="w-9 h-9 object-contain rounded-lg" /> : <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>}
                                        <div className="flex-1 min-w-0">
                                          <p className={`text-sm font-medium truncate ${itemMissing ? 'text-red-900' : 'text-gray-900'}`}>{it.name}</p>
                                          <p className="text-[10px] text-gray-400">{fmt(it.price)} c/u</p>
                                        </div>
                                        {itemMissing && (
                                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded shrink-0 border border-red-200">⚠️ Sin stock</span>
                                        )}
                                        {loc && loc.section !== null && !itemMissing && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold shrink-0">
                                            <MapPin className="w-2.5 h-2.5" /> G{loc.gondola} S{loc.section}
                                          </span>
                                        )}
                                        <div className="text-right flex-shrink-0">
                                          <p className="text-xs text-gray-400">×{it.qty}</p>
                                          <p className="text-sm font-bold text-gray-900">{fmt(it.total || it.price * it.qty)}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              {/* Details sidebar */}
                              <div className="space-y-3">
                                <div className="bg-white rounded-xl border border-gray-100 p-3">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Envío</p>
                                  <p className="text-sm text-gray-800 font-medium">{order.ADDRESS || '—'}</p>
                                  <p className="text-xs text-gray-500">{order.COMUNA}, {order.REGION}</p>
                                  {order.SHIPPINGAGENCY && <p className="text-xs text-indigo-600 font-semibold mt-1">{order.SHIPPINGAGENCY}</p>}
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 p-3">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Contacto</p>
                                  <p className="text-sm text-gray-800 font-medium">{order.CUSTOMERNAME}</p>
                                  <p className="text-xs text-gray-500">{order.CUSTOMERPHONE} · {order.CUSTOMEREMAIL}</p>
                                  <p className="text-xs text-gray-500">RUT: {order.CUSTOMERRUT || '—'}</p>
                                </div>
                                {(note || gift) && (
                                  <div className="bg-white rounded-xl border border-gray-100 p-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Notas</p>
                                    {gift && <p className="text-xs text-pink-600 font-medium mb-1">🎁 Pedido marcado como regalo</p>}
                                    {note && <p className="text-sm text-gray-700 bg-amber-50 rounded-lg px-2 py-1.5 border border-amber-100">{note}</p>}
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
                    <td className="px-4 py-3 text-right text-xs text-gray-400">
                      {avgTicket > 0 && <p>{`∅ ${fmt(avgTicket)}`}</p>}
                      {couponDiscount > 0 && <p className="text-emerald-600">-{fmt(couponDiscount)} cupones</p>}
                      {(() => {
                        const totalItems = filtered.reduce((s, o) => { try { return s + (JSON.parse(o.ITEMS || '[]') as any[]).reduce((a: number, i: any) => a + (i.quantity || 1), 0); } catch { return s; } }, 0);
                        const avgItems = filtered.length > 0 ? (totalItems / filtered.length).toFixed(1) : null;
                        return avgItems ? <p className="text-gray-400">∅ {avgItems} art./pedido</p> : null;
                      })()}
                    </td>
                    <td className="hidden" />
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
