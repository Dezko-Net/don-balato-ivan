'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Order } from '@/types/admin';
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Edit3,
  Eye,
  Hash,
  ImagePlus,
  Inbox,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  X,
} from 'lucide-react';

interface BoxPhoto {
  bulto: number;
  url: string;
}

type ViewFilter = 'pending' | 'ready' | 'all';

function parseBoxPhotos(value: unknown): BoxPhoto[] {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value || '[]') : value;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((photo, index) => typeof photo === 'string'
        ? { bulto: index + 1, url: photo }
        : { bulto: Number(photo?.bulto || index + 1), url: String(photo?.url || '') })
      .filter(photo => photo.url)
      .sort((a, b) => a.bulto - b.bulto);
  } catch {
    return [];
  }
}

function formatMoney(value: number) {
  return '$' + (value || 0).toLocaleString('es-CL');
}

function formatDate(value?: string | number) {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getInitials(name?: string) {
  const words = (name || 'Sin nombre').trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(word => word[0]?.toUpperCase()).join('') || 'SN';
}

export default function ChecklistPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ViewFilter>('pending');

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const res = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
        Query.equal('STATUS', ['shipped', 'checklist']),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ]);
      setOrders(res.documents as unknown as Order[]);
    } catch (error: any) {
      console.error('Error loading checklist orders:', error);
      setLoadError(error?.message || 'No se pudieron cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const shippedOrders = useMemo(() => orders.filter(order => order.STATUS === 'shipped'), [orders]);
  const checklistOrders = useMemo(() => orders.filter(order => order.STATUS === 'checklist'), [orders]);
  const partialOrders = useMemo(() => shippedOrders.filter(order => {
    const count = Number((order as any).BULTOCOUNT || 0);
    const photos = parseBoxPhotos((order as any).BOXPHOTOS);
    return count > 0 && photos.length > 0 && photos.length < count;
  }), [shippedOrders]);

  const visibleOrders = useMemo(() => {
    const source = filter === 'pending' ? shippedOrders : filter === 'ready' ? checklistOrders : orders;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return source;
    return source.filter(order => [
      order.ORDERCODE,
      order.CUSTOMERNAME,
      order.CUSTOMERRUT,
      order.CUSTOMERPHONE,
      order.ADDRESS,
      order.COMUNA,
      order.REGION,
      order.SHIPPINGAGENCY,
    ].some(value => String(value || '').toLowerCase().includes(normalizedQuery)));
  }, [filter, orders, query, shippedOrders, checklistOrders]);

  if (selectedOrder) {
    return (
      <ChecklistDetail
        order={selectedOrder}
        onBack={() => {
          setSelectedOrder(null);
          loadOrders();
        }}
      />
    );
  }

  return (
    <div className="min-h-full bg-slate-50/70 pb-10">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-7">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                <ShieldCheck className="h-4 w-4" />
                Control de despacho
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Checklist de bultos</h1>
              <p className="mt-1 max-w-lg text-sm leading-relaxed text-slate-300">
                Fotografía, valida y deja cada pedido listo antes de entregarlo al transporte.
              </p>
            </div>
            <button
              onClick={loadOrders}
              disabled={isLoading}
              aria-label="Actualizar pedidos"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/15 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            <MetricCard label="Por revisar" value={shippedOrders.length} icon={<Package className="h-4 w-4" />} tone="violet" />
            <MetricCard label="En proceso" value={partialOrders.length} icon={<Clock3 className="h-4 w-4" />} tone="amber" />
            <MetricCard label="Completados" value={checklistOrders.length} icon={<CheckCircle2 className="h-4 w-4" />} tone="cyan" />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="sticky top-0 z-10 -mx-3 border-b border-slate-200/80 bg-slate-50/95 px-3 pb-3 pt-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Buscar cliente, código, RUT o transporte"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-2 grid grid-cols-3 rounded-2xl bg-slate-200/70 p-1">
            <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')} label="Pendientes" count={shippedOrders.length} />
            <FilterButton active={filter === 'ready'} onClick={() => setFilter('ready')} label="Listos" count={checklistOrders.length} />
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="Todos" count={orders.length} />
          </div>
        </div>

        <div className="pt-4">
          {loadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold">No pudimos cargar el checklist</p>
                  <p className="mt-0.5 text-xs text-red-600">{loadError}</p>
                  <button onClick={loadOrders} className="mt-3 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white">Reintentar</button>
                </div>
              </div>
            </div>
          ) : isLoading && orders.length === 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(item => <OrderCardSkeleton key={item} />)}
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Inbox className="h-7 w-7 text-slate-400" />
              </div>
              <h2 className="mt-4 font-bold text-slate-800">No hay pedidos para mostrar</h2>
              <p className="mt-1 text-sm text-slate-500">
                {query ? 'Prueba con otro nombre, código o transporte.' : filter === 'pending' ? 'Todos los pedidos embalados están revisados.' : 'Aún no hay pedidos completados.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleOrders.map(order => (
                <OrderCard key={order.$id} order={order} onOpen={() => setSelectedOrder(order)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: 'violet' | 'amber' | 'cyan' }) {
  const tones = {
    violet: 'bg-violet-400/15 text-violet-200 ring-violet-300/20',
    amber: 'bg-amber-400/15 text-amber-200 ring-amber-300/20',
    cyan: 'bg-cyan-400/15 text-cyan-200 ring-cyan-300/20',
  };
  return (
    <div className={`rounded-2xl p-3 ring-1 backdrop-blur ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide opacity-80 sm:text-xs">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold transition active:scale-[0.98] ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
    >
      <span className="truncate">{label}</span>
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-600'}`}>{count}</span>
    </button>
  );
}

function OrderCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const photos = parseBoxPhotos((order as any).BOXPHOTOS);
  const bultoCount = Number((order as any).BULTOCOUNT || 0);
  const completedPhotos = bultoCount > 0 ? photos.filter(photo => photo.bulto <= bultoCount).length : photos.length;
  const progress = bultoCount > 0 ? Math.min(100, Math.round((completedPhotos / bultoCount) * 100)) : 0;
  const complete = order.STATUS === 'checklist';
  const started = bultoCount > 0 || completedPhotos > 0;

  return (
    <button
      onClick={onOpen}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg active:scale-[0.985]"
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${complete ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : started ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`} />

      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${complete ? 'bg-cyan-50 text-cyan-700' : 'bg-violet-50 text-violet-700'}`}>
          {getInitials(order.CUSTOMERNAME)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-black uppercase tracking-wider text-slate-400">{order.ORDERCODE || '#' + order.$id.slice(-6)}</span>
            <StatusPill complete={complete} started={started} />
          </div>
          <h3 className="mt-1 truncate text-base font-black text-slate-900">{order.CUSTOMERNAME || 'Cliente sin nombre'}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">{order.SHIPPINGAGENCY || 'Sin transporte asignado'}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-slate-50 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Destino</p>
          <p className="mt-0.5 truncate text-xs font-bold text-slate-700">{order.COMUNA || order.REGION || 'Sin comuna'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total</p>
          <p className="mt-0.5 truncate text-xs font-black text-slate-800">{formatMoney(order.TOTAL)}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-500">Registro fotográfico</span>
          <span className="font-black text-slate-700">{bultoCount ? `${completedPhotos}/${bultoCount}` : 'Sin iniciar'}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${complete ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`}
            style={{ width: `${complete ? 100 : progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[11px] font-medium text-slate-400">{formatDate(order.$createdAt || (order as any).CREATEDAT)}</span>
        <span className="flex items-center gap-1 text-xs font-black text-cyan-700">
          {complete ? 'Revisar' : started ? 'Continuar' : 'Comenzar'}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

function StatusPill({ complete, started }: { complete: boolean; started: boolean }) {
  if (complete) return <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-700">Completo</span>;
  if (started) return <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-amber-700">En proceso</span>;
  return <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-violet-700">Embalado</span>;
}

function OrderCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex gap-3"><div className="h-11 w-11 rounded-2xl bg-slate-100" /><div className="flex-1 space-y-2"><div className="h-3 w-24 rounded bg-slate-100" /><div className="h-4 w-3/4 rounded bg-slate-100" /></div></div>
      <div className="mt-4 grid grid-cols-2 gap-2"><div className="h-12 rounded-2xl bg-slate-100" /><div className="h-12 rounded-2xl bg-slate-100" /></div>
      <div className="mt-4 h-2 rounded-full bg-slate-100" />
    </div>
  );
}

function ChecklistDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const initialPhotos = parseBoxPhotos((order as any).BOXPHOTOS);
  const [bultoCount, setBultoCount] = useState<number>(Number((order as any).BULTOCOUNT || 0));
  const [boxPhotos, setBoxPhotos] = useState<BoxPhoto[]>(initialPhotos);
  const [uploadingBulto, setUploadingBulto] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [savingCount, setSavingCount] = useState(false);
  const [editingBultos, setEditingBultos] = useState(!Number((order as any).BULTOCOUNT || 0));
  const [error, setError] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<BoxPhoto | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const isChecklist = order.STATUS === 'checklist';
  const validPhotos = boxPhotos.filter(photo => photo.bulto >= 1 && photo.bulto <= bultoCount);
  const completedCount = new Set(validPhotos.map(photo => photo.bulto)).size;
  const allPhotosReady = bultoCount > 0 && completedCount === bultoCount;
  const progress = bultoCount ? Math.round((completedCount / bultoCount) * 100) : 0;

  const saveBultoCount = async (count: number) => {
    setSavingCount(true);
    setError('');
    try {
      const response = await fetch('/api/admin/orders/upload-box-photos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.$id, bultoCount: count }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'No se pudo guardar la cantidad');
      setBultoCount(count);
      setBoxPhotos(parseBoxPhotos(data.boxPhotos));
      setEditingBultos(false);
    } catch (saveError: any) {
      setError(saveError?.message || 'No se pudo guardar la cantidad de bultos');
    } finally {
      setSavingCount(false);
    }
  };

  const handleFileUpload = async (bultoNum: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado no es una imagen');
      return;
    }
    setUploadingBulto(bultoNum);
    setError('');
    try {
      const formData = new FormData();
      formData.append('orderId', order.$id);
      formData.append('bultoIndex', String(bultoNum));
      formData.append('file', file);
      const response = await fetch('/api/admin/orders/upload-box-photos', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'No se pudo subir la foto');
      setBoxPhotos(parseBoxPhotos(data.boxPhotos));
    } catch (uploadError: any) {
      setError(uploadError?.message || 'No se pudo subir la foto');
    } finally {
      setUploadingBulto(null);
    }
  };

  const handleDeletePhoto = async (bultoNum: number) => {
    setError('');
    try {
      const response = await fetch('/api/admin/orders/upload-box-photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.$id, bultoIndex: bultoNum }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'No se pudo eliminar la foto');
      setBoxPhotos(parseBoxPhotos(data.boxPhotos));
    } catch (deleteError: any) {
      setError(deleteError?.message || 'No se pudo eliminar la foto');
    }
  };

  const handleConfirm = async () => {
    if (!allPhotosReady) {
      setError(`Faltan ${bultoCount - completedCount} foto(s) para completar el checklist`);
      return;
    }
    setConfirming(true);
    setError('');
    try {
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.$id, newStatus: 'checklist' }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'No se pudo confirmar el checklist');
      onBack();
    } catch (confirmError: any) {
      setError(confirmError?.message || 'No se pudo confirmar el checklist');
    } finally {
      setConfirming(false);
    }
  };

  const photoFor = (bultoNum: number) => boxPhotos.find(photo => photo.bulto === bultoNum);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-3 py-3 sm:px-6">
          <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition active:scale-95" aria-label="Volver">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{order.ORDERCODE || '#' + order.$id.slice(-6)}</p>
            <h1 className="truncate text-base font-black text-slate-900">{order.CUSTOMERNAME || 'Cliente sin nombre'}</h1>
          </div>
          <StatusPill complete={isChecklist} started={bultoCount > 0} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-3 py-4 sm:px-6">
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-4 text-white shadow-xl shadow-slate-200 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400">Avance del checklist</p>
              <p className="mt-1 text-3xl font-black">{isChecklist ? 100 : progress}%</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${allPhotosReady || isChecklist ? 'bg-emerald-400/15 text-emerald-300' : 'bg-violet-400/15 text-violet-300'}`}>
              {allPhotosReady || isChecklist ? <ShieldCheck className="h-6 w-6" /> : <Package className="h-6 w-6" />}
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 transition-all duration-500" style={{ width: `${isChecklist ? 100 : progress}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
            <span>{bultoCount ? `${completedCount} de ${bultoCount} bultos fotografiados` : 'Define la cantidad de bultos'}</span>
            <span className="font-bold text-white">{isChecklist ? 'Validado' : allPhotosReady ? 'Listo para confirmar' : 'En preparación'}</span>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><User className="h-4 w-4" /></div>
            <div><h2 className="text-sm font-black text-slate-900">Datos del despacho</h2><p className="text-[11px] text-slate-400">Comprueba que el paquete corresponde al cliente</p></div>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <InfoRow icon={<Hash className="h-4 w-4" />} label="RUT" value={order.CUSTOMERRUT || 'Sin RUT'} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={order.CUSTOMERPHONE || 'Sin teléfono'} />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Transporte" value={order.SHIPPINGAGENCY || 'Sin transporte'} accent />
            <InfoRow icon={<CircleDollarSign className="h-4 w-4" />} label="Total" value={formatMoney(order.TOTAL)} />
            <div className="sm:col-span-2"><InfoRow icon={<MapPin className="h-4 w-4" />} label="Dirección" value={[order.ADDRESS, order.COMUNA, order.REGION].filter(Boolean).join(', ') || 'Sin dirección'} /></div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">1</span><h2 className="text-sm font-black text-slate-900">Cantidad de bultos</h2></div>
              <p className="ml-9 mt-1 text-xs text-slate-500">Cuenta todas las cajas, bolsas o paquetes.</p>
            </div>
            {bultoCount > 0 && !editingBultos && !isChecklist && (
              <button onClick={() => setEditingBultos(true)} className="flex shrink-0 items-center gap-1 rounded-xl bg-violet-50 px-2.5 py-2 text-xs font-black text-violet-700"><Edit3 className="h-3.5 w-3.5" />Cambiar</button>
            )}
          </div>

          {editingBultos && !isChecklist ? (
            <div className="mt-4">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, index) => index + 1).map(count => (
                  <button
                    key={count}
                    disabled={savingCount}
                    onClick={() => saveBultoCount(count)}
                    className={`flex aspect-square items-center justify-center rounded-2xl text-lg font-black transition active:scale-90 disabled:opacity-50 ${bultoCount === count ? 'bg-slate-950 text-white shadow-lg ring-4 ring-cyan-100' : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50'}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              {bultoCount > 0 && <button onClick={() => setEditingBultos(false)} className="mt-3 w-full py-2 text-xs font-bold text-slate-500">Mantener {bultoCount} bulto(s)</button>}
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-violet-50 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white"><Box className="h-6 w-6" /></div>
              <div><p className="text-2xl font-black text-slate-900">{bultoCount}</p><p className="text-xs font-semibold text-slate-500">{bultoCount === 1 ? 'bulto registrado' : 'bultos registrados'}</p></div>
              <Check className="ml-auto h-5 w-5 text-violet-600" />
            </div>
          )}
        </section>

        {bultoCount > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">2</span>
              <div><h2 className="text-sm font-black text-slate-900">Evidencia fotográfica</h2><p className="mt-1 text-xs text-slate-500">Toma una foto clara y completa de cada bulto.</p></div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: bultoCount }, (_, index) => index + 1).map(bultoNum => (
                <PhotoSlot
                  key={bultoNum}
                  bultoNum={bultoNum}
                  photo={photoFor(bultoNum)}
                  uploading={uploadingBulto === bultoNum}
                  disabled={isChecklist || uploadingBulto !== null}
                  inputRef={element => { fileInputRefs.current[bultoNum] = element; }}
                  onChoose={() => fileInputRefs.current[bultoNum]?.click()}
                  onFile={file => handleFileUpload(bultoNum, file)}
                  onDelete={() => handleDeletePhoto(bultoNum)}
                  onPreview={photo => setPreviewPhoto(photo)}
                />
              ))}
            </div>
          </section>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1"><p className="text-sm font-black">Revisa el checklist</p><p className="mt-0.5 text-xs leading-relaxed">{error}</p></div>
            <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
          </div>
        )}

        {isChecklist && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200"><CheckCircle2 className="h-7 w-7" /></div>
            <h2 className="mt-3 text-lg font-black text-emerald-900">Checklist completado</h2>
            <p className="mt-1 text-sm text-emerald-700">Este pedido tiene {bultoCount} bulto(s) registrados y está listo para el siguiente paso.</p>
          </div>
        )}
      </main>

      {!isChecklist && bultoCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={handleConfirm}
              disabled={!allPhotosReady || confirming || uploadingBulto !== null}
              className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition active:scale-[0.985] disabled:cursor-not-allowed ${allPhotosReady && !confirming ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}
            >
              {confirming ? <><RefreshCw className="h-5 w-5 animate-spin" />Confirmando checklist...</> : allPhotosReady ? <><Sparkles className="h-5 w-5" />Confirmar {bultoCount} bulto(s) y finalizar</> : <><Camera className="h-5 w-5" />Faltan {bultoCount - completedCount} foto(s)</>}
            </button>
          </div>
        </div>
      )}

      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4" onClick={() => setPreviewPhoto(null)}>
          <button className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white" aria-label="Cerrar foto"><X className="h-6 w-6" /></button>
          <div className="max-w-3xl" onClick={event => event.stopPropagation()}>
            <img src={previewPhoto.url} alt={`Bulto ${previewPhoto.bulto}`} className="max-h-[78vh] w-auto rounded-3xl object-contain shadow-2xl" />
            <p className="mt-4 text-center text-sm font-black text-white">Bulto {previewPhoto.bulto}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex min-h-14 items-center gap-3 rounded-2xl p-3 ${accent ? 'bg-cyan-50' : 'bg-slate-50'}`}>
      <span className={accent ? 'text-cyan-700' : 'text-slate-400'}>{icon}</span>
      <div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className={`truncate text-xs font-bold ${accent ? 'text-cyan-900' : 'text-slate-700'}`}>{value}</p></div>
    </div>
  );
}

function PhotoSlot({ bultoNum, photo, uploading, disabled, inputRef, onChoose, onFile, onDelete, onPreview }: {
  bultoNum: number;
  photo?: BoxPhoto;
  uploading: boolean;
  disabled: boolean;
  inputRef: (element: HTMLInputElement | null) => void;
  onChoose: () => void;
  onFile: (file: File) => void;
  onDelete: () => void;
  onPreview: (photo: BoxPhoto) => void;
}) {
  return (
    <article className={`overflow-hidden rounded-3xl border-2 transition ${photo ? 'border-emerald-200 bg-emerald-50/40' : 'border-dashed border-slate-200 bg-slate-50'}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = '';
        }}
      />

      {photo ? (
        <>
          <button onClick={() => onPreview(photo)} className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100">
            <img src={photo.url} alt={`Bulto ${bultoNum}`} className="h-full w-full object-cover" />
            <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/60 text-white backdrop-blur"><Eye className="h-4 w-4" /></span>
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black text-white shadow"><CheckCircle2 className="h-3.5 w-3.5" />Foto lista</span>
          </button>
          <div className="flex items-center gap-2 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700">{bultoNum}</div>
            <div className="min-w-0 flex-1"><p className="text-xs font-black text-slate-800">Bulto {bultoNum}</p><p className="text-[10px] text-slate-400">Imagen guardada</p></div>
            {!disabled && <><button onClick={onChoose} className="rounded-xl bg-white px-2.5 py-2 text-[10px] font-black text-violet-700 shadow-sm">Repetir</button><button onClick={onDelete} aria-label={`Eliminar foto bulto ${bultoNum}`} className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-500"><X className="h-4 w-4" /></button></>}
          </div>
        </>
      ) : uploading ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center p-5 text-center">
          <RefreshCw className="h-7 w-7 animate-spin text-violet-600" />
          <p className="mt-3 text-sm font-black text-slate-800">Subiendo bulto {bultoNum}</p>
          <p className="mt-1 text-xs text-slate-400">No cierres esta pantalla</p>
        </div>
      ) : (
        <button onClick={onChoose} disabled={disabled} className="flex aspect-[4/3] w-full flex-col items-center justify-center p-5 text-center transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm"><ImagePlus className="h-6 w-6" /></span>
          <p className="mt-3 text-sm font-black text-slate-800">Foto del bulto {bultoNum}</p>
          <p className="mt-1 text-xs text-slate-400">Toca para abrir la cámara</p>
        </button>
      )}
    </article>
  );
}
