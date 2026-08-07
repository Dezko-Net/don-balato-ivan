'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getServices } from '@/lib/appwrite';
import { openReceiptPrintWindow } from '@/lib/posReceipt';
import { Query } from 'appwrite';
import { updateVentaPos } from '@/lib/appwriteVentasPos';
import { SEDES, SedeSlug } from '@/types';
import {
  RefreshCw, Download, Eye, Loader2, Search, Filter, ArrowLeft,
  ShoppingCart, Wallet, TrendingUp, Hash, User, Receipt, Trash2,
  ShieldAlert, Edit3, Check, X, RotateCcw, Calendar, AlertCircle
} from 'lucide-react';

interface VentaItem {
  sku: string;
  nombre: string;
  cantidad: number;
  subtotal: number;
  precioUnitario?: number;
}

interface PagoEntry {
  metodo: 'efectivo' | 'debito' | 'transferencia';
  monto: number;
}

interface VentaPOS {
  id: string;
  $id?: string;
  sede: string;
  cajeroNombre: string;
  total: number;
  subtotal: number;
  estado: 'completada' | 'anulada' | 'pre_venta';
  fechaStr: string;
  fecha?: any;
  fechaTs?: number;
  createdAt?: any;
  createdAtTs?: number;
  items: VentaItem[];
  pagos: PagoEntry[];
  descuentoGlobalPct: number;
  descuentoGlobal: number;
  vuelto?: number;
  boletaNumero?: number;
  debitoOrdenNumero?: number | null;
  tipoComprobante?: string;
  motivoAnulacion?: string;
  $createdAt?: string;
}

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n || 0));

const PAGE_SIZE = 25;
const EDIT_PIN = '988189813';

export default function HistorialVentasPOS() {
  const router = useRouter();
  const params = useParams();
  const sedeParam = (params?.sede as string) || 'chacabuco-08';
  const currentSede = sedeParam as SedeSlug;
  const sedeNombre = SEDES[currentSede] || currentSede;

  // Prevenir Hydration Mismatch en Next.js
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [ventasRaw, setVentasRaw] = useState<VentaPOS[]>([]);
  const [loading, setLoading] = useState(true);

  // Fechas por defecto
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMetodo, setFilterMetodo] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [page, setPage] = useState(1);

  // Modales
  const [selectedVenta, setSelectedVenta] = useState<VentaPOS | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VentaPOS | null>(null);
  const [deletePin, setDeletePin] = useState('');
  const [deleteMotivo, setDeleteMotivo] = useState('');
  const [deletePinError, setDeletePinError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [rehacerTarget, setRehacerTarget] = useState<VentaPOS | null>(null);
  const [rehacerMotivo, setRehacerMotivo] = useState('');
  const [rehacerSaving, setRehacerSaving] = useState(false);

  type MetodoPago = 'efectivo' | 'debito' | 'transferencia';
  const [editTarget, setEditTarget] = useState<VentaPOS | null>(null);
  const [editPin, setEditPin] = useState('');
  const [editPinError, setEditPinError] = useState(false);
  const [editPinOk, setEditPinOk] = useState(false);
  const [editMetodo, setEditMetodo] = useState<MetodoPago>('efectivo');
  const [editCantidades, setEditCantidades] = useState<number[]>([]);
  const [editSaving, setEditSaving] = useState(false);

  // ─── Carga de datos desde Appwrite ──────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    setLoading(true);

    let cancelled = false;
    let timer: any = null;

    const load = async () => {
      try {
        if (cancelled) return;
        // Cargar todas las ventas de la sede desde Appwrite (paginado)
        const { databases } = getServices();
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
        const all: any[] = [];
        let cursor: string | null = null;
        let hasMore = true;
        while (hasMore) {
          const queries: any[] = [
            Query.equal('sede', currentSede),
            Query.orderDesc('$createdAt'),
            Query.limit(100),
          ];
          if (cursor) queries.push(Query.cursorAfter(cursor));
          const res = await databases.listDocuments(dbId, 'ventas_pos', queries);
          if (res.documents.length > 0) {
            all.push(...res.documents);
            cursor = res.documents[res.documents.length - 1].$id;
            if (res.documents.length < 100) hasMore = false;
          } else {
            hasMore = false;
          }
        }

        if (cancelled) return;

        const list: VentaPOS[] = all.map(d => {
          let items: any[] = [];
          let pagos: any[] = [];
          try { items = JSON.parse(d.itemsJson || '[]') } catch {}
          try { pagos = JSON.parse(d.pagosJson || '[]') } catch {}
          return {
            id: d.$id,
            $id: d.$id,
            sede: d.sede,
            cajeroNombre: d.cajeroNombre || 'Cajero',
            total: Number(d.total || 0),
            subtotal: Number(d.subtotal || 0),
            estado: d.estado || 'completada',
            fechaStr: d.fechaStr || '',
            fechaTs: Number(d.fechaTs || 0),
            createdAtTs: Number(d.createdAtTs || 0),
            items,
            pagos,
            descuentoGlobalPct: Number(d.descuentoGlobalPct || 0),
            descuentoGlobal: Number(d.descuentoGlobal || 0),
            vuelto: Number(d.vuelto || 0),
            boletaNumero: d.boletaNumero,
            debitoOrdenNumero: d.debitoOrdenNumero,
            tipoComprobante: d.tipoComprobante,
            motivoAnulacion: d.motivoAnulacion,
          };
        });

        list.sort((a, b) => (b.createdAtTs || 0) - (a.createdAtTs || 0));
        setVentasRaw(list);
      } catch (e) {
        console.warn('Error cargando ventas desde Appwrite:', e);
        if (!cancelled) setVentasRaw([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    // Polling cada 10s para mantener actualizado
    timer = setInterval(load, 10000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [currentSede, mounted]);

  // Ventas filtradas
  const ventas = useMemo(() => {
    return ventasRaw.filter((v: any) => {
      const fechaStr = String(v?.fechaStr || '').slice(0, 10);
      if (!fechaStr) return true;
      return fechaStr >= fechaDesde && fechaStr <= fechaHasta;
    });
  }, [ventasRaw, fechaDesde, fechaHasta]);

  const filtered = useMemo(() => {
    let result = ventas;
    if (filterEstado !== 'todos') result = result.filter(v => v.estado === filterEstado);
    if (filterMetodo !== 'todos') result = result.filter(v => v.pagos?.some(p => p.metodo === filterMetodo));
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      const cleanNum = term.replace(/[$.,\s]/g, '');
      const isNumeric = /^\d+$/.test(cleanNum);
      result = result.filter(v => {
        if (isNumeric) {
          const totalStr = String(Math.round(v.total));
          const boletaStr = String(v.boletaNumero || '');
          return totalStr.includes(cleanNum) || boletaStr.includes(cleanNum);
        }
        return (
          v.cajeroNombre?.toLowerCase().includes(term) ||
          v.id?.toLowerCase().includes(term) ||
          v.items?.some(i => i.nombre?.toLowerCase().includes(term) || i.sku?.toLowerCase().includes(term))
        );
      });
    }
    return result;
  }, [ventas, filterEstado, filterMetodo, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Resumen KPIs
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
      const cajero = String(v.cajeroNombre || 'Cajero').trim();
      cajerosMap.set(cajero, (cajerosMap.get(cajero) || 0) + 1);

      (v.pagos || []).forEach((p) => {
        const key = String(p.metodo || 'efectivo').toLowerCase();
        const prev = pagosMap.get(key) || { monto: 0, count: 0 };
        pagosMap.set(key, {
          monto: prev.monto + Number(p.monto || 0),
          count: prev.count + 1,
        });
      });

      (v.items || []).forEach((it) => {
        const key = String(it.sku || '').toUpperCase();
        if (!key) return;
        const prev = productosMap.get(key) || { sku: key, nombre: it.nombre || key, cantidad: 0, total: 0 };
        productosMap.set(key, {
          ...prev,
          cantidad: prev.cantidad + Number(it.cantidad || 0),
          total: prev.total + Number(it.subtotal || 0),
        });
      });
    });

    const topProductos = Array.from(productosMap.values()).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
    const topCajeros = Array.from(cajerosMap.entries()).map(([nombre, ventas]) => ({ nombre, ventas })).sort((a, b) => b.ventas - a.ventas).slice(0, 5);
    const pagos = Array.from(pagosMap.entries()).map(([metodo, data]) => ({ metodo, ...data })).sort((a, b) => b.monto - a.monto);

    return { totalVentas, totalBoletas, anuladas, totalItems, ticketPromedio, topProductos, topCajeros, pagos };
  }, [filtered]);

  // Acciones
  const openVentaReceipt = (venta: VentaPOS) => {
    openReceiptPrintWindow({
      ventaId: venta.id || `v${Date.now()}`,
      boletaNumero: Number(venta.boletaNumero || 0),
      debitoOrdenNumero: venta.debitoOrdenNumero ?? null,
      cajero: venta.cajeroNombre || '',
      sedeNombre,
      fecha: venta.fecha?.toDate ? venta.fecha.toDate() : new Date(),
      subtotal: Number(venta.subtotal || 0),
      descuentoGlobalPct: Number(venta.descuentoGlobalPct || 0),
      descuentoGlobal: Number(venta.descuentoGlobal || 0),
      total: Number(venta.total || 0),
      vuelto: Number(venta.vuelto || 0),
      pagos: (venta.pagos || []).map(p => ({ metodo: p.metodo, monto: Number(p.monto || 0) })),
      items: (venta.items || []).map(it => ({
        nombre: it.nombre,
        cantidad: Number(it.cantidad || 0),
        precioUnitario: Number(it.precioUnitario || (it.cantidad > 0 ? it.subtotal / it.cantidad : 0)),
        subtotal: Number(it.subtotal || 0),
      })),
      tipoComprobante: (venta as any).tipoComprobante || 'comprobante',
    });
  };

  const handleRehacerConfirm = async () => {
    if (!rehacerTarget || !rehacerMotivo.trim()) return;
    setRehacerSaving(true);
    try {
      await updateVentaPos(rehacerTarget.id, {
        estado: 'anulada',
        motivoAnulacion: rehacerMotivo.trim(),
        anuladaEn: Date.now(),
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
          sku: it.sku,
          nombre: it.nombre,
          cantidad: it.cantidad,
          precioUnitario: it.precioUnitario || (it.cantidad > 0 ? it.subtotal / it.cantidad : 0),
          costoUnitario: 0,
          descuentoPct: 0,
          subtotal: it.subtotal,
          stockDisponible: 999,
        })),
        descuentoGlobalPct: rehacerTarget.descuentoGlobalPct || 0,
        savedAt: Date.now(),
      });
      localStorage.setItem(draftsKey, JSON.stringify(drafts));
      setRehacerTarget(null);
      router.push(`/pos/${currentSede}`);
    } catch (e: any) {
      alert('Error al rehacer venta: ' + e.message);
    } finally {
      setRehacerSaving(false);
    }
  };

  const openEditPago = (v: VentaPOS) => {
    setEditTarget(v);
    setEditPin('');
    setEditPinError(false);
    setEditPinOk(false);
    setEditMetodo(((v.pagos?.[0]?.metodo as MetodoPago) || 'efectivo'));
    setEditCantidades((v.items || []).map(it => it.cantidad));
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setEditSaving(true);
    try {
      const newItems = (editTarget.items || []).map((it, i) => {
        const qty = Math.max(1, editCantidades[i] ?? it.cantidad);
        const precio = it.precioUnitario || (it.cantidad > 0 ? it.subtotal / it.cantidad : 0);
        return { ...it, cantidad: qty, subtotal: Math.round(precio * qty) };
      });
      const newSubtotal = newItems.reduce((s, it) => s + it.subtotal, 0);
      const newTotal = newSubtotal;

      const finalPagos = editTarget.pagos?.length === 1
        ? [{ metodo: editMetodo, monto: newTotal }]
        : (editTarget.pagos || []).map((p, i) => i === 0 ? { ...p, metodo: editMetodo } : p);

      await updateVentaPos(editTarget.id, {
        items: newItems,
        subtotal: newSubtotal,
        total: newTotal,
        pagos: finalPagos,
      });

      setEditTarget(null);
    } catch (e: any) {
      alert('Error al editar venta: ' + e.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    if (deletePin !== EDIT_PIN) {
      setDeletePinError(true);
      setDeletePin('');
      return;
    }
    setDeleting(true);
    try {
      await updateVentaPos(deleteTarget.id, {
        estado: 'anulada',
        motivoAnulacion: deleteMotivo.trim() || 'Anulada por usuario',
        anuladaEn: Date.now(),
      });
      setDeleteTarget(null);
      setDeletePin('');
      setDeleteMotivo('');
      setDeletePinError(false);
    } catch (e: any) {
      alert('Error al anular venta: ' + e.message);
    } finally {
      setDeleting(false);
    }
  };

  // Renderizar esqueleto en servidor para evitar error de Hydration Mismatch
  if (!mounted) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4 font-sans min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        <Loader2 size={24} className="animate-spin mr-2" /> Cargando Historial POS...
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-5 font-sans min-h-screen bg-slate-50">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 mb-2">
              Historial POS · {fechaDesde} → {fechaHasta}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Historial de Ventas</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sucursal: <span className="font-semibold text-slate-700">{sedeNombre}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/pos/${currentSede}`)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition"
            >
              <ArrowLeft size={16} /> Volver al POS
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="text-[10px] sm:text-xs text-emerald-600 font-semibold mb-1">Total vendido</div>
          <div className="text-lg sm:text-xl font-black text-emerald-800">{fmtCLP(resumen.totalVentas)}</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="text-[10px] sm:text-xs text-blue-600 font-semibold mb-1">Boletas emitidas</div>
          <div className="text-lg sm:text-xl font-black text-blue-800">{resumen.totalBoletas}</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50/40 border border-violet-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="text-[10px] sm:text-xs text-violet-600 font-semibold mb-1">Ticket promedio</div>
          <div className="text-lg sm:text-xl font-black text-violet-800">{fmtCLP(resumen.ticketPromedio)}</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="text-[10px] sm:text-xs text-amber-600 font-semibold mb-1">Unidades vendidas</div>
          <div className="text-lg sm:text-xl font-black text-amber-800">{resumen.totalItems}</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/40 border border-rose-200/50 p-3 sm:p-4 shadow-sm relative overflow-hidden">
          <div className="text-[10px] sm:text-xs text-rose-600 font-semibold mb-1">Ventas anuladas</div>
          <div className="text-lg sm:text-xl font-black text-rose-700">{resumen.anuladas}</div>
        </div>
      </div>

      {/* Panels de Resumen */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-800">SKU más vendidos</h3>
          </div>
          <div className="space-y-2">
            {resumen.topProductos.length === 0 ? (
              <div className="text-xs text-slate-400">Sin registros</div>
            ) : (
              resumen.topProductos.map((p) => (
                <div key={p.sku} className="flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <div className="font-mono text-slate-500">{p.sku}</div>
                    <div className="truncate text-slate-700 font-medium">{p.nombre}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">{p.cantidad} uds</div>
                    <div className="text-slate-400">{fmtCLP(p.total)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-violet-600" />
            <h3 className="text-sm font-semibold text-slate-800">Cajeros con más ventas</h3>
          </div>
          <div className="space-y-2">
            {resumen.topCajeros.length === 0 ? (
              <div className="text-xs text-slate-400">Sin registros</div>
            ) : (
              resumen.topCajeros.map((c) => (
                <div key={c.nombre} className="flex items-center justify-between text-xs">
                  <div className="truncate text-slate-700 font-medium">{c.nombre}</div>
                  <div className="font-semibold text-slate-900">{c.ventas} ventas</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} className="text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-800">Forma de pagos</h3>
          </div>
          <div className="space-y-2">
            {resumen.pagos.length === 0 ? (
              <div className="text-xs text-slate-400">Sin registros</div>
            ) : (
              resumen.pagos.map((p) => (
                <div key={p.metodo} className="flex items-center justify-between text-xs capitalize">
                  <div className="text-slate-700 font-medium">{p.metodo}</div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">{fmtCLP(p.monto)}</div>
                    <div className="text-slate-400">{p.count} pagos</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Boleta, cajero, producto, SKU o monto..."
            className="w-full bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar size={14} className="text-slate-400" />
            <span>Desde</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-700 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span>Hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-700 font-medium"
            />
          </div>

          <select
            value={filterMetodo}
            onChange={(e) => setFilterMetodo(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none font-medium"
          >
            <option value="todos">Todos los pagos</option>
            <option value="efectivo">Efectivo</option>
            <option value="debito">Débito</option>
            <option value="transferencia">Transferencia</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none font-medium"
          >
            <option value="todos">Todos los estados</option>
            <option value="completada">Completadas</option>
            <option value="anulada">Anuladas</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 size={20} className="animate-spin" /> Cargando ventas de la sucursal...
          </div>
        ) : paged.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Receipt size={40} className="mx-auto opacity-30" />
            <p className="text-sm font-medium">No se encontraron ventas para los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Boleta / Folio</th>
                  <th className="px-4 py-3">Fecha y Hora</th>
                  <th className="px-4 py-3">Cajero</th>
                  <th className="px-4 py-3">Método de Pago</th>
                  <th className="px-4 py-3 text-center">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Tipo</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paged.map((v) => {
                  const isAnulada = v.estado === 'anulada';
                  return (
                    <tr key={v.id} className={`hover:bg-slate-50 transition ${isAnulada ? 'bg-rose-50/30 text-slate-400' : 'text-slate-700'}`}>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {v.boletaNumero ? `#${String(v.boletaNumero).padStart(7, '0')}` : `#${v.id.slice(-6).toUpperCase()}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {v.fechaStr || (v.fecha?.toDate ? v.fecha.toDate().toLocaleString('es-CL') : '--')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {v.cajeroNombre || 'Cajero'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {v.pagos?.map((p, idx) => (
                            <span key={idx} className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {p.metodo}: {fmtCLP(p.monto)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {v.items?.reduce((acc, item) => acc + (item.cantidad || 0), 0) || 0}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-sm text-slate-900">
                        {fmtCLP(v.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${isAnulada ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {v.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${(v as any).tipoComprobante === 'boleta' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {(v as any).tipoComprobante === 'boleta' ? 'Boleta' : 'Comprobante'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedVenta(v)}
                            title="Ver Detalle"
                            className="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-600 transition"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openVentaReceipt(v)}
                            title={`Reimprimir ${(v as any).tipoComprobante === 'boleta' ? 'Boleta' : 'Comprobante'}`}
                            className={`p-1.5 rounded-lg transition ${(v as any).tipoComprobante === 'boleta' ? 'hover:bg-blue-100 text-blue-600' : 'hover:bg-amber-100 text-amber-600'}`}
                          >
                            <Receipt size={15} />
                          </button>
                          {!isAnulada && (
                            <>
                              <button
                                onClick={() => setRehacerTarget(v)}
                                title="Rehacer Venta (Cargar a Carrito)"
                                className="p-1.5 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                              >
                                <RotateCcw size={15} />
                              </button>
                              <button
                                onClick={() => openEditPago(v)}
                                title="Editar Pago / Items"
                                className="p-1.5 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => { setDeleteTarget(v); setDeletePin(''); setDeleteMotivo(''); setDeletePinError(false); }}
                                title="Anular Venta"
                                className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50 text-xs">
            <span className="text-slate-500">Página {page} de {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-semibold"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-semibold"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Modal Ver Detalle ─── */}
      {selectedVenta && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="text-blue-600" size={20} />
                <h3 className="text-base font-bold text-slate-900">
                  Venta #{selectedVenta.boletaNumero || selectedVenta.id.slice(-6)}
                </h3>
              </div>
              <button onClick={() => setSelectedVenta(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Cajero:</span> <span className="font-bold text-slate-900">{selectedVenta.cajeroNombre}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Fecha:</span> <span className="font-bold text-slate-900">{selectedVenta.fechaStr || '--'}</span>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="font-bold text-slate-800 mb-2">Items Vendidos:</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedVenta.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">{it.nombre}</div>
                        <div className="text-[10px] text-slate-400">SKU: {it.sku} · Qty: {it.cantidad}</div>
                      </div>
                      <span className="font-bold text-slate-900">{fmtCLP(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1 text-sm font-bold text-slate-900">
                <div className="flex justify-between">
                  <span>Total Venta:</span>
                  <span className="text-emerald-600">{fmtCLP(selectedVenta.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => openVentaReceipt(selectedVenta)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Receipt size={14} /> Reimprimir Boleta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Rehacer Venta ─── */}
      {rehacerTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <RotateCcw size={22} />
              <h3 className="text-base font-bold text-slate-900">Rehacer Venta</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Esta acción marcará la boleta <strong className="text-slate-900">#{rehacerTarget.boletaNumero || rehacerTarget.id.slice(-6)}</strong> como <strong>anulada</strong> y cargará todos sus productos directamente en tu carrito del POS para que puedas modificarlos y volver a cobrar.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Motivo de anulación / rehacer:</label>
              <input
                type="text"
                value={rehacerMotivo}
                onChange={(e) => setRehacerMotivo(e.target.value)}
                placeholder="Ej. Cambio de producto, corrección de precio..."
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRehacerTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                disabled={!rehacerMotivo.trim() || rehacerSaving}
                onClick={handleRehacerConfirm}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                {rehacerSaving ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                Confirmar y Cargar al POS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Anular Venta ─── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert size={22} />
              <h3 className="text-base font-bold text-slate-900">Anular Venta #{deleteTarget.boletaNumero || deleteTarget.id.slice(-6)}</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Motivo de Anulación:</label>
                <input
                  type="text"
                  value={deleteMotivo}
                  onChange={(e) => setDeleteMotivo(e.target.value)}
                  placeholder="Ej. Devolución de cliente, error de cobro..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ingresa PIN de Autorización (Jefe):</label>
                <input
                  type="password"
                  value={deletePin}
                  onChange={(e) => { setDeletePin(e.target.value); setDeletePinError(false); }}
                  placeholder="****"
                  className={`w-full p-2.5 border rounded-xl text-xs outline-none ${deletePinError ? 'border-rose-500 bg-rose-50' : 'border-slate-200'}`}
                />
                {deletePinError && <p className="text-[11px] text-rose-600 font-semibold">PIN incorrecto.</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                disabled={!deletePin || deleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Anular Venta Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Editar Método de Pago ─── */}
      {editTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-purple-600">
              <Edit3 size={22} />
              <h3 className="text-base font-bold text-slate-900">Editar Venta #{editTarget.boletaNumero || editTarget.id.slice(-6)}</h3>
            </div>

            {!editPinOk ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">Ingresa el PIN de Jefe para editar la forma de pago o las cantidades:</p>
                <input
                  type="password"
                  value={editPin}
                  onChange={(e) => { setEditPin(e.target.value); setEditPinError(false); }}
                  placeholder="****"
                  className={`w-full p-2.5 border rounded-xl text-xs outline-none ${editPinError ? 'border-rose-500 bg-rose-50' : 'border-slate-200'}`}
                />
                {editPinError && <p className="text-[11px] text-rose-600 font-semibold">PIN incorrecto.</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditTarget(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">Cancelar</button>
                  <button onClick={() => { if (editPin === EDIT_PIN) { setEditPinOk(true); setEditPinError(false); } else { setEditPinError(true); } }} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs">Verificar PIN</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nuevo Método de Pago:</label>
                  <select
                    value={editMetodo}
                    onChange={(e) => setEditMetodo(e.target.value as MetodoPago)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="debito">Débito</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Cantidades por producto:</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {editTarget.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-xs">
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{it.nombre}</span>
                        <input
                          type="number"
                          min="1"
                          value={editCantidades[idx] ?? it.cantidad}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            setEditCantidades(prev => { const n = [...prev]; n[idx] = val; return n; });
                          }}
                          className="w-16 p-1 border border-slate-200 rounded-lg text-center font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditTarget(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">Cancelar</button>
                  <button disabled={editSaving} onClick={handleEditSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
                    {editSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Guardar Cambios
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
