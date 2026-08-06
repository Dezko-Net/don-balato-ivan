'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchAllAppwriteErpProducts, updateAppwriteErpProduct, AppwriteErpProduct, resolveSku } from '@/lib/appwriteErpService';
import { SEDES, SedeSlug, DEFAULT_SEDE } from '@/types';
import { Loader2, Search, Warehouse, AlertTriangle, Download, Plus, Minus, X, CheckCircle, AlertCircle, Edit2 } from 'lucide-react';

interface StockItem {
  id: string;
  sku: string;
  sede: string;
  cantidad: number;
  nombre: string;
  costo_uni: number;
  precio_detalle: number;
  rawProduct: AppwriteErpProduct;
}

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n));

const fmtN = (n: number) => new Intl.NumberFormat('es-CL').format(n);

export default function PosAdminStockPage() {
  const params = useParams<{ sede: string }>();
  const currentSede = (params?.sede || DEFAULT_SEDE) as SedeSlug;
  const sedeNombre = SEDES[currentSede] || currentSede.replace(/-/g, ' ');

  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLow, setFilterLow] = useState(false);
  const [sortBy, setSortBy] = useState<'stock' | 'name'>('stock');

  const [adjustItem, setAdjustItem] = useState<StockItem | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustMode, setAdjustMode] = useState<'add' | 'remove' | 'set'>('add');
  const [saving, setSaving] = useState(false);

  const qtyRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const products = await fetchAllAppwriteErpProducts(true);
      const items: StockItem[] = products.map((p) => {
        const resolved = resolveSku(p.rawDocument);
        const skuStr = (resolved && resolved !== p.$id ? resolved : (p.sku && p.sku !== p.$id ? p.sku : '-'));
        return {
          id: p.$id,
          sku: skuStr,
          sede: currentSede,
          cantidad: p.stock || 0,
          nombre: p.nombre || 'Sin nombre',
          costo_uni: p.costo_uni || 0,
          precio_detalle: p.precio_venta_1 || 0,
          rawProduct: p,
        };
      });
      setStockItems(items);
    } catch (err) {
      console.error('Error cargando stock desde Appwrite:', err);
      showToast('err', 'Error al cargar productos de Appwrite');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentSede]);

  const handleAdjustStock = async () => {
    if (!adjustItem) return;
    const qtyVal = Number(qtyRef.current?.value || adjustQty);
    if (isNaN(qtyVal) || qtyVal <= 0) return showToast('err', 'Cantidad debe ser mayor a 0');

    setSaving(true);
    try {
      const oldStock = adjustItem.cantidad;
      let newStock = oldStock;
      if (adjustMode === 'add') newStock = oldStock + qtyVal;
      else if (adjustMode === 'remove') newStock = Math.max(0, oldStock - qtyVal);
      else newStock = qtyVal;

      await updateAppwriteErpProduct(adjustItem.id, { stock: newStock });

      setStockItems((prev) =>
        prev.map((s) => (s.id === adjustItem.id ? { ...s, cantidad: newStock } : s))
      );

      showToast('ok', `Stock de [${adjustItem.sku}]: ${oldStock} → ${newStock}`);
      setAdjustItem(null);
      setAdjustQty('');
    } catch (err: any) {
      showToast('err', 'Error actualizando en Appwrite: ' + (err?.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    let result = stockItems;
    if (filterLow) result = result.filter((s) => s.cantidad <= 5);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) => s.nombre.toLowerCase().includes(term) || s.sku.toLowerCase().includes(term)
      );
    }
    if (sortBy === 'stock') {
      result = [...result].sort((a, b) => b.cantidad - a.cantidad);
    } else {
      result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return result;
  }, [stockItems, searchTerm, filterLow, sortBy]);

  const totalUnits = useMemo(() => stockItems.reduce((s, i) => s + (i.cantidad || 0), 0), [stockItems]);
  const totalValue = useMemo(() => stockItems.reduce((s, i) => s + (i.cantidad || 0) * (i.costo_uni || 0), 0), [stockItems]);
  const lowStock = useMemo(() => stockItems.filter((s) => s.cantidad <= 5).length, [stockItems]);

  const handleExportCSV = () => {
    const headers = ['SKU', 'Producto', 'Cantidad', 'Costo Unitario', 'Precio Detalle', 'Valor Total'];
    const rows = filtered.map((item) => [
      `"${item.sku.replace(/"/g, '""')}"`,
      `"${item.nombre.replace(/"/g, '""')}"`,
      item.cantidad,
      item.costo_uni,
      item.precio_detalle,
      item.cantidad * item.costo_uni,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Stock_POS_${currentSede}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2 text-indigo-600" /> Cargando stock de Appwrite...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock de Sucursal ({sedeNombre})</h1>
          <p className="text-sm text-gray-500 mt-1">Control de inventario sincronizado con Appwrite Cloud</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="text-sm text-gray-500 font-medium mb-1">Total SKUs en Catálogo</div>
          <div className="text-2xl font-bold text-gray-900">{fmtN(stockItems.length)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="text-sm text-gray-500 font-medium mb-1">Total Unidades en Stock</div>
          <div className="text-2xl font-bold text-blue-600">{fmtN(totalUnits)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="text-sm text-gray-500 font-medium mb-1">Valor Inventario (Costo)</div>
          <div className="text-2xl font-bold text-emerald-600">{fmtCLP(totalValue)}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por SKU o nombre..."
            className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          onClick={() => setFilterLow(!filterLow)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
            filterLow ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle size={15} /> Stock crítico (≤5): {lowStock}
        </button>
        <button
          onClick={() => setSortBy(sortBy === 'stock' ? 'name' : 'stock')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
            sortBy === 'name' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {sortBy === 'stock' ? 'Orden: Más stock' : 'Orden: Alfabético'}
        </button>
      </div>

      {/* Tabla de Stock */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">SKU</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Producto</th>
                <th className="text-center px-4 py-3 text-gray-500 font-semibold">Stock</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">Costo unit.</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">Precio Web</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">Valor total</th>
                <th className="text-center px-4 py-3 text-gray-500 font-semibold">Estado</th>
                <th className="text-center px-4 py-3 text-gray-500 font-semibold">Ajustar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700">{s.sku}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{s.nombre}</td>
                  <td className="px-4 py-3 text-center font-extrabold text-gray-900">{s.cantidad}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{fmtCLP(s.costo_uni)}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">{fmtCLP(s.precio_detalle)}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">{fmtCLP(s.cantidad * s.costo_uni)}</td>
                  <td className="px-4 py-3 text-center">
                    {s.cantidad <= 0 ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">Agotado</span>
                    ) : s.cantidad <= 5 ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Crítico</span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Disponible</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => { setAdjustItem(s); setAdjustMode('add'); setAdjustQty(''); setAdjustReason(''); }}
                        className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center transition"
                        title="Agregar stock"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => { setAdjustItem(s); setAdjustMode('remove'); setAdjustQty(''); setAdjustReason(''); }}
                        className="w-7 h-7 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center transition"
                        title="Quitar stock"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        onClick={() => { setAdjustItem(s); setAdjustMode('set'); setAdjustQty(''); setAdjustReason(''); }}
                        className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center transition"
                        title="Fijar valor exacto"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <Warehouse size={40} className="mx-auto mb-2 opacity-30" />
                    No se encontraron productos en stock
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Ajuste de Stock */}
      {adjustItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {adjustMode === 'add' ? 'Agregar Stock' : adjustMode === 'remove' ? 'Quitar Stock' : 'Fijar Stock Exacto'}
              </h2>
              <button onClick={() => setAdjustItem(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm border border-gray-100">
              <div className="font-semibold text-gray-900">{adjustItem.nombre}</div>
              <div className="text-xs text-gray-500 font-mono mt-0.5">{adjustItem.sku}</div>
              <div className="text-xs text-gray-600 mt-2">
                Stock actual: <span className="font-bold text-gray-900">{adjustItem.cantidad} unidades</span>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              {(['add', 'remove', 'set'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setAdjustMode(m)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition ${
                    adjustMode === m
                      ? m === 'add'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : m === 'remove'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {m === 'add' ? '+ Agregar' : m === 'remove' ? '- Quitar' : '= Fijar'}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block font-medium">Cantidad</label>
                <input
                  type="number"
                  ref={qtyRef}
                  defaultValue={adjustQty}
                  min={1}
                  placeholder={adjustMode === 'set' ? `Stock actual: ${adjustItem.cantidad}` : 'Ingresa cantidad'}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block font-medium">Motivo (opcional)</label>
                <input
                  type="text"
                  ref={reasonRef}
                  defaultValue={adjustReason}
                  placeholder="Ej: Recepción, Merma, Ajuste inventario"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAdjustItem(null)}
                className="flex-1 text-gray-600 hover:text-gray-800 font-semibold text-sm py-2.5 rounded-xl border border-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdjustStock}
                disabled={saving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl py-2.5 font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold z-50 border ${
            toast.type === 'ok' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {toast.type === 'ok' ? <CheckCircle size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-600" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
