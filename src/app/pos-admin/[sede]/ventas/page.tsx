'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { openReceiptPrintWindow } from '@/lib/posReceipt';
import { SEDES, DEFAULT_SEDE, SedeSlug } from '@/types';
import {
  RefreshCw, Download, Eye, Loader2, Search, Filter, ArrowLeft,
  Wallet, TrendingUp, User, Receipt, Trash2, ShieldAlert, Edit3,
  Check, X, RotateCcw,
} from 'lucide-react';

// ─── Firebase ──────────────────────────────────────────────────────────────────
import { db, authReady } from '@/lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
type Timestamp = { toDate?: () => Date; seconds?: number };

// ─── Types ────────────────────────────────────────────────────────────────────
interface VentaPOS {
  id: string;
  sede: string;
  cajeroNombre: string;
  total: number;
  subtotal: number;
  estado: 'completada' | 'anulada';
  fecha: Timestamp;
  fechaStr: string;
  items: Array<{ sku: string; nombre: string; cantidad: number; subtotal: number; precioUnitario?: number }>;
  pagos: Array<{ metodo: string; monto: number }>;
  descuentoGlobalPct: number;
  descuentoGlobal: number;
  vuelto?: number;
  boletaNumero?: number;
  debitoOrdenNumero?: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n));

const PAGE_SIZE = 20;

export default function HistorialVentasPage() {
  const params = useParams<{ sede: string }>();
  const router = useRouter();
  const currentSede = ((params?.sede) || DEFAULT_SEDE) as SedeSlug;
  const sedeNombre = SEDES[currentSede] || currentSede;

  const [ventasRaw, setVentasRaw] = useState<VentaPOS[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMetodo, setFilterMetodo] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [page, setPage] = useState(1);
  const [selectedVenta, setSelectedVenta] = useState<VentaPOS | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VentaPOS | null>(null);
  const [deletePin, setDeletePin] = useState('');
  const [deletePinError, setDeletePinError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Rehacer venta
  const [rehacerTarget, setRehacerTarget] = useState<VentaPOS | null>(null);
  const [rehacerMotivo, setRehacerMotivo] = useState('');
  const [rehacerSaving, setRehacerSaving] = useState(false);

  const openRehacer = (v: VentaPOS) => { setRehacerTarget(v); setRehacerMotivo(''); };

  const handleRehacerConfirm = async () => {
    if (!rehacerTarget) return;
    if (!rehacerMotivo.trim()) return;
    setRehacerSaving(true);
    try {
      await updateDoc(doc(db, 'ventas_pos', rehacerTarget.id), {
        estado: 'anulada', motivoAnulacion: rehacerMotivo.trim(), anuladaAt: Date.now(),
      });
      const POS_DRAFTS_KEY = 'asistora_pos_drafts_v1';
      const draftsKey = `${POS_DRAFTS_KEY}_${currentSede}`;
      let drafts: any[] = [];
      try { drafts = JSON.parse(localStorage.getItem(draftsKey) || '[]'); } catch {}
      const totalLabel = fmtCLP(rehacerTarget.total);
      drafts.push({
        id: `draft_${Date.now()}`,
        label: `Rehaciendo boleta #${rehacerTarget.boletaNumero || rehacerTarget.id.slice(-6)} · ${totalLabel}`,
        cart: (rehacerTarget.items || []).map(it => ({
          sku: it.sku, nombre: it.nombre, cantidad: it.cantidad,
          precioUnitario: it.precioUnitario || (it.cantidad > 0 ? it.subtotal / it.cantidad : 0),
          costoUnitario: 0, descuentoPct: 0, subtotal: it.subtotal, stockDisponible: 999,
        })),
        descuentoGlobalPct: rehacerTarget.descuentoGlobalPct || 0,
        savedAt: Date.now(),
      });
      localStorage.setItem(draftsKey, JSON.stringify(drafts));
      setRehacerTarget(null);
      router.push(`/pos/${currentSede}`);
    } catch (e: any) { alert('Error: ' + e.message); }
    setRehacerSaving(false);
  };

  // Editar método de pago
  const EDIT_PIN = '988189813';
  type MetodoPago = 'efectivo' | 'debito' | 'transferencia';
  const [editTarget, setEditTarget] = useState<VentaPOS | null>(null);
  const [editPin, setEditPin] = useState('');
  const [editPinError, setEditPinError] = useState(false);
  const [editPinOk, setEditPinOk] = useState(false);
  const [editMetodo, setEditMetodo] = useState<MetodoPago>('efectivo');
  const [editCantidades, setEditCantidades] = useState<number[]>([]);
  const [editSaving, setEditSaving] = useState(false);

  const openEditPago = (v: VentaPOS) => {
    setEditTarget(v); setEditPin(''); setEditPinError(false); setEditPinOk(false);
    setEditMetodo(((v.pagos?.[0]?.metodo as MetodoPago) || 'efectivo'));
    setEditCantidades((v.items || []).map(it => it.cantidad));
  };

  const handleEditPin = () => {
    if (editPin !== EDIT_PIN) { setEditPinError(true); setEditPin(''); return; }
    setEditPinError(false); setEditPinOk(true);
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setEditSaving(true);
    try {
      const newItems = (editTarget.items || []).map((it, i) => {
        const qty = Math.max(1, editCantidades[i] ?? it.cantidad);
        const precio = it.precioUnitario || (qty > 0 ? it.subtotal / it.cantidad : 0);
        return { ...it, cantidad: qty, subtotal: Math.round(precio * qty) };
      });
      const newSubtotal = newItems.reduce((s, it) => s + it.subtotal, 0);
      const newTotal = newSubtotal;
      const finalPagos = editTarget.pagos?.length === 1
        ? [{ metodo: editMetodo, monto: newTotal }]
        : (editTarget.pagos || []).map((p, i) => i === 0 ? { ...p, metodo: editMetodo } : p);
      await updateDoc(doc(db, 'ventas_pos', editTarget.id), {
        items: newItems, subtotal: newSubtotal, total: newTotal, pagos: finalPagos,
      });
      setEditTarget(null);
    } catch (e: any) { alert('Error: ' + e.message); }
    setEditSaving(false);
  };

  const [empresaConfig, setEmpresaConfig] = useState<{ nombreEmpresa?: string; rut?: string; giro?: string; direccion?: string; telefono?: string; email?: string }>({});

  const todayFilter = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const firstOfMonth = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }, []);

  const [fechaDesde, setFechaDesde] = useState(firstOfMonth);
  const [fechaHasta, setFechaHasta] = useState(todayFilter);

  const ventas = useMemo(() => {
    return ventasRaw.filter((v: any) => {
      const fechaStr = String(v?.fechaStr || '').slice(0, 10);
      return fechaStr >= fechaDesde && fechaStr <= fechaHasta;
    });
  }, [ventasRaw, fechaDesde, fechaHasta]);

  useEffect(() => {
    let unsub = () => {};
    let active = true;
    (async () => {
      try {
        await authReady;
        if (!active || !db) return;
        unsub = onSnapshot(
          query(collection(db, 'ventas_pos'), where('sede', '==', currentSede)),
          (snap: any) => {
            const list = (snap.docs || []).map((d: any) => ({ id: d.id, ...d.data() } as VentaPOS));
            list.sort((a: any, b: any) => {
              const aMs = a?.fecha?.toDate ? a.fecha.toDate().getTime() : 0;
              const bMs = b?.fecha?.toDate ? b.fecha.toDate().getTime() : 0;
              return bMs - aMs;
            });
            setVentasRaw(list);
            setLoading(false);
          },
          () => setLoading(false)
        );
      } catch { setLoading(false); }
    })();
    return () => { active = false; unsub(); };
  }, [currentSede]);

  const DELETE_PIN = '988189813';

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    if (deletePin !== DELETE_PIN) { setDeletePinError(true); setDeletePin(''); return; }
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'ventas_pos', deleteTarget.id));
      setDeleteTarget(null); setDeletePin(''); setDeletePinError(false);
    } catch (e: any) { alert('Error al eliminar: ' + e.message); }
    setDeleting(false);
  };

  const openVentaReceipt = (venta: VentaPOS) => {
    const fecha = venta.fecha?.toDate ? venta.fecha.toDate() : new Date();
    openReceiptPrintWindow({
      tipoComprobante: 'boleta',
      folio: venta.boletaNumero,
      fechaHora: fecha.toLocaleString('es-CL'),
      cajeraNombre: venta.cajeroNombre,
      sedeNombre,
      subtotal: Number(venta.subtotal || 0),
      descuentoGlobalMonto: Number(venta.descuentoGlobal || 0),
      total: Number(venta.total || 0),
      metodoPago: (venta.pagos || []).map(p => p.metodo).join(' + ') || 'efectivo',
      vuelto: Number(venta.vuelto || 0),
      items: (venta.items || []).map(it => ({
        sku: it.sku,
        nombre: it.nombre,
        cantidad: Number(it.cantidad || 0),
        precioUnitario: Number(it.precioUnitario || 0),
        subtotal: Number(it.subtotal || 0),
      })),
    });
  };

  const filtered = useMemo(() => {
    let result = ventas;
    if (filterEstado !== 'todos') result = result.filter(v => v.estado === filterEstado);
    if (filterMetodo !== 'todos') result = result.filter(v => v.pagos?.some(p => p.metodo === filterMetodo));
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      const cleanNum = term.replace(/[$.,\s]/g, '');
      const isNumeric = /^\d+$/.test(cleanNum);
      result = result.filter(v => {
        if (isNumeric) return String(Math.round(v.total)).includes(cleanNum);
        return (
          v.cajeroNombre?.toLowerCase().includes(term) ||
          v.id.toLowerCase().includes(term) ||
          v.items?.some(i => i.nombre?.toLowerCase().includes(term) || i.sku?.toLowerCase().includes(term))
        );
      });
    }
    return result;
  }, [ventas, filterEstado, filterMetodo, searchTerm]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resumen = useMemo(() => {
    const completed = filtered.filter(v => v.estado === 'completada');
    const totalVentas = completed.reduce((s, v) => s + Number(v.total || 0), 0);
    const totalBoletas = completed.length;
    const anuladas = filtered.filter(v => v.estado === 'anulada').length;
    const totalItems = completed.reduce((s, v) => s + (v.items || []).reduce((s2, it) => s2 + Number(it.cantidad || 0), 0), 0);
    const ticketPromedio = totalBoletas > 0 ? totalVentas / totalBoletas : 0;

    const pagosMap = new Map<string, { monto: number; count: number }>();
    const productosMap = new Map<string, { sku: string; nombre: string; cantidad: number; total: number }>();
    const cajerosMap = new Map<string, number>();

    completed.forEach((v) => {
      const cajero = String(v.cajeroNombre || 'Sin nombre').trim();
      cajerosMap.set(cajero, (cajerosMap.get(cajero) || 0) + 1);
      ;(v.pagos || []).forEach((p) => {
        const key = String(p.metodo || 'otro').toLowerCase();
        const prev = pagosMap.get(key) || { monto: 0, count: 0 };
        pagosMap.set(key, { monto: prev.monto + Number(p.monto || 0), count: prev.count + 1 });
      });
      ;(v.items || []).forEach((it) => {
        const key = String(it.sku || '').toUpperCase();
        if (!key) return;
        const prev = productosMap.get(key) || { sku: key, nombre: it.nombre || key, cantidad: 0, total: 0 };
        productosMap.set(key, { ...prev, cantidad: prev.cantidad + Number(it.cantidad || 0), total: prev.total + Number(it.subtotal || 0) });
      });
    });

    return {
      totalVentas, totalBoletas, anuladas, totalItems, ticketPromedio,
      topProductos: Array.from(productosMap.values()).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5),
      topCajeros: Array.from(cajerosMap.entries()).map(([nombre, ventas]) => ({ nombre, ventas })).sort((a, b) => b.ventas - a.ventas).slice(0, 5),
      pagos: Array.from(pagosMap.entries()).map(([metodo, data]) => ({ metodo, ...data })).sort((a, b) => b.monto - a.monto),
    };
  }, [filtered]);

  const fmtDate = (ts: Timestamp) => {
    if (!ts?.toDate) return '--';
    return ts.toDate!().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const fmtTime = (ts: Timestamp) => {
    if (!ts?.toDate) return '';
    return ts.toDate!().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 mb-2">
              Historial POS · {fechaDesde} → {fechaHasta}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Historial de Ventas</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Sucursal: <span className="font-semibold text-slate-700">{sedeNombre}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/pos/${currentSede}`)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
            >
              <ArrowLeft size={16} /> Volver al POS
            </button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-xl bg-emerald-200/30 lg:hidden" />
          <div className="relative z-10">
            <div className="text-[10px] sm:text-xs text-emerald-600 font-semibold mb-1">Total vendido</div>
            <div className="text-lg sm:text-xl font-black text-emerald-800">{fmtCLP(resumen.totalVentas)}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-xl bg-blue-200/30 lg:hidden" />
          <div className="relative z-10">
            <div className="text-[10px] sm:text-xs text-blue-600 font-semibold mb-1">Boletas emitidas</div>
            <div className="text-lg sm:text-xl font-black text-blue-800">{resumen.totalBoletas}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50/40 border border-violet-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-xl bg-violet-200/30 lg:hidden" />
          <div className="relative z-10">
            <div className="text-[10px] sm:text-xs text-violet-600 font-semibold mb-1">Ticket promedio</div>
            <div className="text-lg sm:text-xl font-black text-violet-800">{fmtCLP(resumen.ticketPromedio)}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-xl bg-amber-200/30 lg:hidden" />
          <div className="relative z-10">
            <div className="text-[10px] sm:text-xs text-amber-600 font-semibold mb-1">SKU vendidos</div>
            <div className="text-lg sm:text-xl font-black text-amber-800">{resumen.totalItems}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/40 border border-rose-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-xl bg-rose-200/30 lg:hidden" />
          <div className="relative z-10">
            <div className="text-[10px] sm:text-xs text-rose-600 font-semibold mb-1">Ventas anuladas</div>
            <div className="text-lg sm:text-xl font-black text-rose-700">{resumen.anuladas}</div>
          </div>
        </div>
      </div>

      {/* Secondary panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3"><TrendingUp size={16} className="text-blue-600" /><h3 className="text-sm font-semibold text-slate-800">SKU mas vendidos</h3></div>
          <div className="space-y-2">
            {resumen.topProductos.length === 0 ? <div className="text-xs text-slate-400">Sin registros</div> : resumen.topProductos.map((p) => (
              <div key={p.sku} className="flex items-center justify-between text-xs">
                <div className="min-w-0"><div className="font-mono text-slate-500">{p.sku}</div><div className="truncate text-slate-700">{p.nombre}</div></div>
                <div className="text-right"><div className="font-semibold text-slate-900">{p.cantidad}</div><div className="text-slate-400">{fmtCLP(p.total)}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3"><User size={16} className="text-violet-600" /><h3 className="text-sm font-semibold text-slate-800">Cajeros con mas ventas</h3></div>
          <div className="space-y-2">
            {resumen.topCajeros.length === 0 ? <div className="text-xs text-slate-400">Sin registros</div> : resumen.topCajeros.map((c) => (
              <div key={c.nombre} className="flex items-center justify-between text-xs">
                <div className="truncate text-slate-700">{c.nombre}</div>
                <div className="font-semibold text-slate-900">{c.ventas}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3"><Wallet size={16} className="text-emerald-600" /><h3 className="text-sm font-semibold text-slate-800">Forma de pagos</h3></div>
          <div className="space-y-2">
            {resumen.pagos.length === 0 ? <div className="text-xs text-slate-400">Sin registros</div> : resumen.pagos.map((p) => (
              <div key={p.metodo} className="flex items-center justify-between text-xs capitalize">
                <div className="text-slate-700">{p.metodo}</div>
                <div className="text-right"><div className="font-semibold text-slate-900">{fmtCLP(p.monto)}</div><div className="text-slate-400">{p.count} pagos</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">Filtros:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs text-gray-500 font-medium">Desde</label>
            <input type="date" value={fechaDesde} onChange={e => { setFechaDesde(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500" />
            <label className="text-xs text-gray-500 font-medium">Hasta</label>
            <input type="date" value={fechaHasta} onChange={e => { setFechaHasta(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500" />
            <button onClick={() => { setFechaDesde(todayFilter); setFechaHasta(todayFilter); setPage(1); }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition">Hoy</button>
            <button onClick={() => { setFechaDesde(firstOfMonth); setFechaHasta(todayFilter); setPage(1); }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition">Este mes</button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={filterEstado} onChange={e => { setFilterEstado(e.target.value); setPage(1); }}
            className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-blue-500">
            <option value="todos">Todos</option>
            <option value="completada">Completada</option>
            <option value="anulada">Anulada</option>
          </select>
          <select value={filterMetodo} onChange={e => { setFilterMetodo(e.target.value); setPage(1); }}
            className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-blue-500">
            <option value="todos">Todos pagos</option>
            <option value="efectivo">Efectivo</option>
            <option value="debito">Debito</option>
            <option value="transferencia">Transfer.</option>
          </select>
        </div>
        <div className="relative sm:ml-auto w-full sm:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Buscar cajero, SKU, producto o monto..."
            className="bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-700 w-full sm:w-64 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      {/* Pagination toolbar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition">
          <RefreshCw size={14} /> Actualizar
        </button>
        <button className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition">
          <Download size={14} /> Descargar
        </button>
        <div className="ml-auto text-xs sm:text-sm text-gray-500">
          Pag. {page}/{totalPages || 1} · {filtered.length}
        </div>
        <div className="flex gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            className="px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm">&lt;</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm">&gt;</button>
        </div>
      </div>

      {/* Sales list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <RefreshCw size={48} className="animate-spin text-emerald-400 mb-4" />
          <p className="text-sm text-gray-500 font-medium animate-pulse">Cargando ventas...</p>
          <div className="mt-3 w-48 sm:w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-[loadingBar_1.5s_ease-in-out_infinite]" style={{ width: '40%' }} />
          </div>
          <style>{`@keyframes loadingBar { 0%{transform:translateX(-100%)} 50%{transform:translateX(150%)} 100%{transform:translateX(-100%)} }`}</style>
        </div>
      ) : (
        <>
          {/* Mobile: Card view */}
          <div className="md:hidden space-y-2">
            {paged.length === 0 && <div className="text-center py-12 text-gray-400">No se encontraron ventas</div>}
            {paged.map(v => {
              const metodos = (v.pagos || []).map(p => p.metodo).join(', ');
              const cantItems = (v.items || []).reduce((s, i) => s + i.cantidad, 0);
              const isAnulada = v.estado === 'anulada';
              return (
                <div key={v.id} className={`rounded-xl border overflow-hidden shadow-sm transition-all active:scale-[0.99] ${isAnulada ? 'bg-red-50/50 border-red-200/60' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-stretch">
                    <div className={`w-1 shrink-0 ${isAnulada ? 'bg-gradient-to-b from-red-400 to-red-500' : 'bg-gradient-to-b from-emerald-400 to-blue-500'}`} />
                    <div className="flex-1 p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isAnulada ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isAnulada ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                            {isAnulada ? 'Anulada' : 'Completada'}
                          </span>
                          <span className="font-mono text-[10px] text-gray-400">
                            #{v.boletaNumero ? String(v.boletaNumero).padStart(7, '0') : v.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-black text-gray-900 text-sm">{fmtCLP(v.total)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                        <span>{fmtDate(v.fecha)} {fmtTime(v.fecha)}</span>
                        <span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{metodos}</span>
                        <span className="ml-auto text-gray-400">{cantItems} items</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 font-medium">{v.cajeroNombre}</div>
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
                        <button onClick={() => { setSelectedVenta(v); openVentaReceipt(v); }}
                          className="flex items-center gap-1 text-blue-600 text-[11px] font-semibold hover:text-blue-800"><Eye size={13} /> Ver</button>
                        <button onClick={() => openVentaReceipt(v)}
                          className="flex items-center gap-1 text-emerald-600 text-[11px] font-semibold hover:text-emerald-800"><Receipt size={13} /> Boleta</button>
                        {!isAnulada && (
                          <button onClick={() => openEditPago(v)}
                            className="flex items-center gap-1 text-violet-600 text-[11px] font-semibold hover:text-violet-800"><Edit3 size={13} /> Pago</button>
                        )}
                        {!isAnulada && (
                          <button onClick={() => openRehacer(v)}
                            className="flex items-center gap-1 text-orange-500 text-[11px] font-semibold hover:text-orange-700"><RotateCcw size={13} /> Rehacer</button>
                        )}
                        <button onClick={() => { setDeleteTarget(v); setDeletePin(''); setDeletePinError(false); }}
                          className="flex items-center gap-1 text-red-500 text-[11px] font-semibold ml-auto hover:text-red-700"><Trash2 size={13} /> Eliminar</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Table view */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Folio</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Fecha y hora</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Forma de pago</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Cajero</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-semibold">Cant.</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-semibold">Total venta</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map(v => {
                  const metodos = (v.pagos || []).map(p => p.metodo).join(', ');
                  const cantItems = (v.items || []).reduce((s, i) => s + i.cantidad, 0);
                  return (
                    <tr key={v.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{v.boletaNumero ? String(v.boletaNumero).padStart(7, '0') : v.id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-gray-700">{fmtDate(v.fecha)} <span className="text-gray-400">{fmtTime(v.fecha)}</span></td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{metodos || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{v.cajeroNombre}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{cantItems}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${v.estado === 'completada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${v.estado === 'completada' ? 'bg-green-500' : 'bg-red-500'}`} />
                          {v.estado === 'completada' ? 'Venta Exitosa' : 'Anulada'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{fmtCLP(v.total)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 justify-end">
                          <button onClick={() => { setSelectedVenta(v); openVentaReceipt(v); }} className="text-blue-600 hover:text-blue-700" title="Ver boleta"><Eye size={16} /></button>
                          <button onClick={() => openVentaReceipt(v)} className="text-emerald-600 hover:text-emerald-700" title="Reimprimir boleta"><Receipt size={16} /></button>
                          {v.estado === 'completada' && (
                            <button onClick={() => openEditPago(v)} className="text-violet-500 hover:text-violet-700" title="Editar forma de pago"><Edit3 size={16} /></button>
                          )}
                          {v.estado === 'completada' && (
                            <button onClick={() => openRehacer(v)} className="text-orange-500 hover:text-orange-700" title="Rehacer venta"><RotateCcw size={16} /></button>
                          )}
                          <button onClick={() => { setDeleteTarget(v); setDeletePin(''); setDeletePinError(false); }} className="text-red-500 hover:text-red-700" title="Eliminar venta"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paged.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No se encontraron ventas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedVenta && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Detalle de Venta</h2>
              <button onClick={() => setSelectedVenta(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Folio:</span><span className="font-mono text-gray-900">{selectedVenta.id.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Cajero:</span><span className="text-gray-900">{selectedVenta.cajeroNombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span className="text-gray-900">{fmtDate(selectedVenta.fecha)} {fmtTime(selectedVenta.fecha)}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado:</span>
                <span className={selectedVenta.estado === 'completada' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {selectedVenta.estado === 'completada' ? 'Venta Exitosa' : 'Anulada'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="font-semibold text-gray-700 mb-2">Productos:</div>
                {(selectedVenta.items || []).map((it, i) => (
                  <div key={i} className="flex justify-between text-gray-600 py-1">
                    <span>{it.cantidad}x {it.nombre} <span className="text-gray-400 text-xs">({it.sku})</span></span>
                    <span className="font-semibold text-gray-900">{fmtCLP(it.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="font-semibold text-gray-700 mb-2">Pagos:</div>
                {(selectedVenta.pagos || []).map((p, i) => (
                  <div key={i} className="flex justify-between text-gray-600 py-1 capitalize">
                    <span>{p.metodo}</span><span className="font-semibold text-gray-900">{fmtCLP(p.monto)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                <span>Total:</span><span className="text-green-600">{fmtCLP(selectedVenta.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal rehacer venta */}
      {rehacerTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100 bg-orange-50 shrink-0">
              <div className="flex items-center gap-2"><RotateCcw size={16} className="text-orange-600" /><span className="font-bold text-orange-900 text-sm">Rehacer venta</span></div>
              <button onClick={() => setRehacerTarget(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm">
                <div className="font-bold text-orange-900">Boleta #{rehacerTarget.boletaNumero ? String(rehacerTarget.boletaNumero).padStart(7, '0') : rehacerTarget.id.slice(-6).toUpperCase()}</div>
                <div className="text-xs text-orange-700 mt-0.5">{fmtCLP(rehacerTarget.total)} · {rehacerTarget.cajeroNombre}</div>
                <p className="text-xs text-orange-600 mt-2">La boleta quedara <strong>anulada</strong> con registro y los productos pasaran al POS como borrador.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Motivo de anulacion <span className="text-red-500">*</span></label>
                  <textarea value={rehacerMotivo} onChange={e => setRehacerMotivo(e.target.value)}
                    placeholder="Ej: Error en cantidad, producto equivocado, cambio de metodo de pago..." rows={3} autoFocus
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none" />
                  {!rehacerMotivo.trim() && <p className="text-xs text-red-500 mt-1">Debes ingresar un motivo</p>}
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
                  <div className="font-semibold text-gray-700 mb-1.5">Productos que pasaran al POS:</div>
                  {(rehacerTarget.items || []).map((it, i) => (
                    <div key={i} className="flex justify-between"><span>{it.cantidad}x {it.nombre}</span><span className="font-semibold">{fmtCLP(it.subtotal)}</span></div>
                  ))}
                </div>
                <button onClick={handleRehacerConfirm} disabled={rehacerSaving || !rehacerMotivo.trim()}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                  {rehacerSaving ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />}
                  {rehacerSaving ? 'Procesando...' : 'Anular y rehacer en POS'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar boleta */}
      {editTarget && (() => {
        const newItems = (editTarget.items || []).map((it, i) => {
          const qty = Math.max(1, editCantidades[i] ?? it.cantidad);
          const precio = it.precioUnitario || (it.cantidad > 0 ? it.subtotal / it.cantidad : 0);
          return { ...it, cantidad: qty, subtotal: Math.round(precio * qty) };
        });
        const newTotal = newItems.reduce((s, it) => s + it.subtotal, 0);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2"><Edit3 size={16} className="text-violet-600" /><span className="font-bold text-gray-900 text-sm">Editar boleta</span></div>
                <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
                {!editPinOk ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm">
                      <div className="font-bold text-gray-900">{fmtCLP(editTarget.total)}</div>
                      <div className="text-xs text-gray-500 mt-0.5 capitalize">Pago: {(editTarget.pagos || []).map(p => p.metodo).join(' + ')}</div>
                    </div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">PIN de autorizacion</label>
                    <input type="password" value={editPin}
                      onChange={e => { setEditPin(e.target.value); setEditPinError(false); }}
                      onKeyDown={e => e.key === 'Enter' && handleEditPin()}
                      placeholder="••••••••••" autoFocus
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-center font-mono tracking-widest focus:outline-none focus:ring-2 ${editPinError ? 'border-red-400 ring-red-100 text-red-600' : 'border-gray-200 focus:ring-violet-100 focus:border-violet-400'}`} />
                    {editPinError && <p className="text-xs text-red-600 text-center font-medium">PIN incorrecto</p>}
                    <button onClick={handleEditPin} className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition">Confirmar PIN</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Cantidades</label>
                      <div className="space-y-2">
                        {(editTarget.items || []).map((it, i) => (
                          <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-800 truncate">{it.nombre}</div>
                              <div className="text-[10px] text-gray-400">{it.sku} · {fmtCLP(it.precioUnitario || 0)} c/u</div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={() => setEditCantidades(prev => prev.map((q, j) => j === i ? Math.max(1, q - 1) : q))}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
                              <input type="number" min={1} value={editCantidades[i] ?? it.cantidad}
                                onChange={e => setEditCantidades(prev => prev.map((q, j) => j === i ? Math.max(1, Number(e.target.value) || 1) : q))}
                                className="w-10 text-center border border-gray-300 rounded-lg py-1 text-sm font-bold" />
                              <button onClick={() => setEditCantidades(prev => prev.map((q, j) => j === i ? q + 1 : q))}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
                            </div>
                            <div className="text-xs font-bold text-gray-900 w-16 text-right shrink-0">
                              {fmtCLP(Math.round((it.precioUnitario || (it.cantidad > 0 ? it.subtotal / it.cantidad : 0)) * (editCantidades[i] ?? it.cantidad)))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                        <span>Nuevo total:</span><span className="text-violet-700">{fmtCLP(newTotal)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Metodo de pago</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['efectivo', 'debito', 'transferencia'] as MetodoPago[]).map(m => (
                          <button key={m} onClick={() => setEditMetodo(m)}
                            className={`py-2 rounded-xl text-xs font-bold border-2 transition ${editMetodo === m ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                            {m === 'efectivo' ? 'Efectivo' : m === 'debito' ? 'Debito' : 'Transfer'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleEditSave} disabled={editSaving}
                      className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                      {editSaving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      {editSaving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal eliminar con PIN */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0"><ShieldAlert size={20} className="text-red-600" /></div>
              <div>
                <div className="font-bold text-gray-900 text-base">Eliminar venta</div>
                <div className="text-xs text-gray-500">Esta accion es permanente e irreversible</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm space-y-1 border border-gray-200">
              <div className="flex justify-between"><span className="text-gray-500">Boleta N°</span><span className="font-mono font-semibold text-gray-900">{deleteTarget.boletaNumero ? String(deleteTarget.boletaNumero).padStart(7, '0') : deleteTarget.id.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-red-600">{fmtCLP(deleteTarget.total)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Cajero</span><span className="text-gray-900">{deleteTarget.cajeroNombre}</span></div>
            </div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ingresa el PIN de autorizacion</label>
            <input type="password" value={deletePin}
              onChange={e => { setDeletePin(e.target.value); setDeletePinError(false); }}
              onKeyDown={e => { if (e.key === 'Enter') handleDeleteConfirm(); }}
              placeholder="••••••••••" autoFocus
              className={`w-full border rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 ${deletePinError ? 'border-red-400 focus:ring-red-100 bg-red-50 text-red-700' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-400'}`} />
            {deletePinError && <p className="text-red-600 text-xs mt-1.5 text-center font-medium">PIN incorrecto. Intentalo de nuevo.</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setDeleteTarget(null); setDeletePin(''); setDeletePinError(false); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition">Cancelar</button>
              <button onClick={handleDeleteConfirm} disabled={deleting || deletePin.length === 0}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Eliminar permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
