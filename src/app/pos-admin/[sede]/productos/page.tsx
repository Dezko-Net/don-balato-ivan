'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllAppwriteErpProducts, updateAppwriteErpProduct, AppwriteErpProduct } from '@/lib/appwriteErpService';
import { Search, RefreshCw, Save, CheckCircle, AlertTriangle, EyeOff, Image as ImageIcon, Package } from 'lucide-react';
import * as XLSX from 'xlsx';

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n));

export default function PosProductosSedePage() {
  const [products, setProducts] = useState<AppwriteErpProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, Partial<AppwriteErpProduct>>>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await fetchAllAppwriteErpProducts();
      setProducts(items);
    } catch (e: any) {
      setMessage({ text: 'Error al conectar con Appwrite: ' + (e.message || String(e)), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (prod: AppwriteErpProduct) => {
    const draft = editDraft[prod.$id];
    if (!draft) return;

    setSavingId(prod.$id);
    try {
      const success = await updateAppwriteErpProduct(prod.$id, {
        nombre: draft.nombre !== undefined ? draft.nombre : prod.nombre,
        codigo_barra: draft.codigo_barra !== undefined ? draft.codigo_barra : prod.codigo_barra,
        precio_venta_1: draft.precio_venta_1 !== undefined ? draft.precio_venta_1 : prod.precio_venta_1,
        precio_venta_2: draft.precio_venta_2 !== undefined ? draft.precio_venta_2 : prod.precio_venta_2,
        costo_uni: draft.costo_uni !== undefined ? draft.costo_uni : prod.costo_uni,
        stock: draft.stock !== undefined ? draft.stock : prod.stock,
      });

      if (success) {
        setProducts((prev) =>
          prev.map((p) => (p.$id === prod.$id ? { ...p, ...draft } : p))
        );
        setEditDraft((prev) => {
          const copy = { ...prev };
          delete copy[prod.$id];
          return copy;
        });
        setMessage({ text: `Producto "${prod.nombre}" actualizado en Appwrite.`, type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: 'No se pudo actualizar el producto.', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: 'Error guardando cambios: ' + e.message, type: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.codigo_barra.toLowerCase().includes(q)
    );
  }, [products, search]);

  const exportExcel = () => {
    const headers = ['SKU', 'Código de Barra', 'Nombre', 'Costo Uni', 'Precio Venta', 'Stock', 'Publicado Web'];
    const rows = products.map((p) => [
      p.sku,
      p.codigo_barra,
      p.nombre,
      p.costo_uni,
      p.precio_venta_1,
      p.stock,
      p.imageUrl && p.stock > 0 ? 'Sí' : 'No',
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos Appwrite');
    XLSX.writeFile(wb, 'Productos_Appwrite.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs uppercase font-bold tracking-wider mb-1">
            <Package className="w-4 h-4" /> Productos & Inventario Appwrite Cloud
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Catálogo de Productos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Edita directamente los nombres, códigos de barra, precios y stock sincronizados con la tienda web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl border border-gray-300 transition text-sm shadow-sm"
          >
            Exportar Excel
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl border border-emerald-600 transition text-sm shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Recargar Appwrite</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2 shadow-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por Nombre, SKU o Código de Barras..."
          className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 text-sm shadow-sm font-medium"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Producto</th>
                <th className="py-3.5 px-4">SKU / Código</th>
                <th className="py-3.5 px-4 text-right">Costo Uni</th>
                <th className="py-3.5 px-4 text-right">Precio Venta</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Visibilidad Web</th>
                <th className="py-3.5 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-sans">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Cargando catálogo desde Appwrite...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-sans">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const draft = editDraft[p.$id] || {};
                  const currentName = draft.nombre !== undefined ? draft.nombre : p.nombre;
                  const currentBarcode = draft.codigo_barra !== undefined ? draft.codigo_barra : p.codigo_barra;
                  const currentPrice = draft.precio_venta_1 !== undefined ? draft.precio_venta_1 : p.precio_venta_1;
                  const currentStock = draft.stock !== undefined ? draft.stock : p.stock;
                  const currentCost = draft.costo_uni !== undefined ? draft.costo_uni : p.costo_uni;

                  const isDirty =
                    draft.nombre !== undefined ||
                    draft.codigo_barra !== undefined ||
                    draft.precio_venta_1 !== undefined ||
                    draft.stock !== undefined ||
                    draft.costo_uni !== undefined;

                  const isWebVisible = p.isactive && p.stock > 0 && Boolean(p.imageUrl);

                  return (
                    <tr key={p.$id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-sans font-semibold text-gray-900 max-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.nombre} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <input
                            type="text"
                            value={currentName}
                            onChange={(e) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                [p.$id]: { ...prev[p.$id], nombre: e.target.value },
                              }))
                            }
                            className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none text-sm font-semibold text-gray-900"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        <div className="text-gray-900 font-bold">{p.sku}</div>
                        <input
                          type="text"
                          value={currentBarcode}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              [p.$id]: { ...prev[p.$id], codigo_barra: e.target.value },
                            }))
                          }
                          placeholder="Sin código"
                          className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none text-gray-400 font-mono text-xs w-full"
                        />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          value={currentCost}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              [p.$id]: { ...prev[p.$id], costo_uni: Number(e.target.value) },
                            }))
                          }
                          className="w-24 bg-white border border-gray-300 rounded px-2 py-1 text-right text-gray-900 focus:border-emerald-500 focus:outline-none text-sm font-semibold"
                        />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              [p.$id]: { ...prev[p.$id], precio_venta_1: Number(e.target.value) },
                            }))
                          }
                          className="w-28 bg-white border border-gray-300 rounded px-2 py-1 text-right text-emerald-700 font-black focus:border-emerald-500 focus:outline-none text-sm"
                        />
                      </td>

                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          value={currentStock}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              [p.$id]: { ...prev[p.$id], stock: Number(e.target.value) },
                            }))
                          }
                          className={`w-20 bg-white border rounded px-2 py-1 text-center font-bold focus:outline-none text-sm ${
                            currentStock > 0 ? 'border-gray-300 text-gray-900' : 'border-rose-300 text-rose-600 bg-rose-50/50'
                          }`}
                        />
                      </td>

                      <td className="py-3 px-4 text-center font-sans text-xs">
                        {isWebVisible ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                            Publicado Web
                          </span>
                        ) : !p.imageUrl ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
                            Sin Foto (Solo POS)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                            Sin Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center font-sans">
                        <button
                          onClick={() => handleSave(p)}
                          disabled={!isDirty || savingId === p.$id}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs disabled:opacity-30"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingId === p.$id ? 'Guardando...' : 'Guardar'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
