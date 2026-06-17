'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import { 
  ArrowLeft, 
  Search, 
  Package, 
  Save, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Filter, 
  Boxes, 
  Layers, 
  Edit3 
} from 'lucide-react';
import { 
  getServices, 
  getAppwriteConfig, 
  PRODUCTS_COLLECTION_ID, 
  CATEGORIES_COLLECTION_ID 
} from '@/lib/appwrite-admin';
import { Product, Category } from '@/types/admin';

function getSku(p: Product): string {
  const featMatch = p.FEATURES?.match(/SKU:\s*(.+)/i);
  if (featMatch) return featMatch[1].trim();
  const tagParts = Array.isArray(p.TAGS)
    ? p.TAGS
    : (typeof p.TAGS === 'string' ? p.TAGS.split(',').map(t => t.trim()) : []);
  if (tagParts.length >= 1) return tagParts[0];
  return p.sku || '';
}

export default function PorMayorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  
  // States for inline editing
  const [editPackQty, setEditPackQty] = useState<Record<string, string>>({});
  const [editWholesalePrice, setEditWholesalePrice] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      // Load categories
      const catResp = await databases.listDocuments(databaseId, CATEGORIES_COLLECTION_ID, [Query.limit(100)]);
      setCategories(catResp.documents as unknown as Category[]);

      // Load all products (paginating with limit 100)
      const all: Product[] = [];
      let cursor: string | undefined;
      while (true) {
        const queries: string[] = [Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, queries);
        all.push(...(res.documents as unknown as Product[]));
        if (res.documents.length < 100) break;
        cursor = res.documents[res.documents.length - 1].$id;
      }
      setProducts(all);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle saving of edited fields
  const handleSave = async (productId: string) => {
    const rawQty = editPackQty[productId];
    const rawWholesale = editWholesalePrice[productId];

    // Build update object
    const updateData: Record<string, any> = {};
    if (rawQty !== undefined) {
      const parsed = parseInt(rawQty, 10);
      updateData.PACKQTY = isNaN(parsed) ? 0 : parsed;
    }
    if (rawWholesale !== undefined) {
      const parsed = parseInt(rawWholesale, 10);
      updateData.WHOLESALEPRICE = isNaN(parsed) ? 0 : parsed;
    }

    if (Object.keys(updateData).length === 0) return;

    setSavingId(productId);
    setSaveStatus(prev => ({ ...prev, [productId]: null }));

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, productId, updateData);

      // Update state locally
      setProducts(prev => prev.map(p => 
        p.$id === productId 
          ? { ...p, ...updateData } 
          : p
      ));

      // Clear edit states for this product
      setEditPackQty(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditWholesalePrice(prev => { const n = { ...prev }; delete n[productId]; return n; });
      
      setSaveStatus(prev => ({ ...prev, [productId]: 'success' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [productId]: null }));
      }, 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));
    } finally {
      setSavingId(null);
    }
  };

  const getCategoryName = (catId?: string) => {
    if (!catId) return 'Sin categoría';
    const cat = categories.find(c => c.$id === catId);
    return cat?.name || 'Sin categoría';
  };

  const formatPrice = (price?: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price || 0);
  };

  // Filtered lists
  const getFilteredProducts = () => {
    return products.filter(p => {
      const q = search.toLowerCase();
      const nameMatch = p.NAME.toLowerCase().includes(q);
      const skuMatch = getSku(p).toLowerCase().includes(q);
      const categoryMatch = !catFilter || p.CATEGORYID === catFilter;
      return (nameMatch || skuMatch) && categoryMatch;
    });
  };

  const filtered = getFilteredProducts();

  // Split into 2 lists
  const withUnitsList = filtered.filter(p => p.PACKQTY && p.PACKQTY > 0);
  const withoutPackagingList = filtered.filter(p => !p.PACKQTY || p.PACKQTY <= 0);

  const totalWithUnitsAll = products.filter(p => p.PACKQTY && p.PACKQTY > 0).length;
  const totalWithoutPackagingAll = products.filter(p => !p.PACKQTY || p.PACKQTY <= 0).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Boxes className="w-7 h-7 text-indigo-600" />
              Por Mayor
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Control de productos por cantidad de unidades y asignación de embalaje</p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Recargar Catálogo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Total Catálogo</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{products.length}</p>
          <p className="text-xs text-gray-400 mt-1">Productos registrados en sistema</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Con Cantidad por Unidades</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{totalWithUnitsAll}</p>
          <p className="text-xs text-gray-400 mt-1">Tienen unidades/paquete configurados</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Sin Cantidad de Embalaje</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-500 mt-2">{totalWithoutPackagingAll}</p>
          <p className="text-xs text-gray-400 mt-1">Falta definir cantidad de embalaje</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="w-full md:w-56 px-3 py-2 border border-gray-250 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat.$id} value={cat.$id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-12 flex flex-col items-center justify-center space-y-3 shadow-sm min-h-[300px]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Cargando productos de la base de datos...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SECCIÓN 1: PRODUCTOS CON CANTIDAD POR UNIDADES */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-emerald-50/50 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Productos Con Cantidad por Unidades ({withUnitsList.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Productos que se venden en paquetes cerrados o tienen un embalaje configurado</p>
              </div>
            </div>

            {withUnitsList.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No hay productos con unidades configuradas en esta selección.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Producto</th>
                      <th className="px-6 py-3 text-center w-36">Unidades / Paquete</th>
                      <th className="px-6 py-3 text-center w-40">Precio Unitario Mayor</th>
                      <th className="px-6 py-3 text-right">Precio Embalaje (Total)</th>
                      <th className="px-6 py-3 text-center w-24">Stock</th>
                      <th className="px-6 py-3 text-center w-24">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {withUnitsList.map(p => {
                      const isSavingThis = savingId === p.$id;
                      const hasPackQtyChanged = editPackQty[p.$id] !== undefined;
                      const hasWholesaleChanged = editWholesalePrice[p.$id] !== undefined;
                      const isDirty = hasPackQtyChanged || hasWholesaleChanged;
                      
                      const currentPackQty = editPackQty[p.$id] !== undefined 
                        ? parseInt(editPackQty[p.$id], 10) 
                        : (p.PACKQTY || 0);

                      const currentWholesale = editWholesalePrice[p.$id] !== undefined 
                        ? parseInt(editWholesalePrice[p.$id], 10) 
                        : (p.WHOLESALEPRICE || 0);

                      const computedPackagingPrice = currentPackQty * currentWholesale;

                      return (
                        <tr key={p.$id} className="hover:bg-gray-50/50 transition text-sm text-gray-700">
                          {/* Info */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {p.IMAGEURL ? (
                                <img src={p.IMAGEURL} alt={p.NAME} className="w-10 h-10 object-cover rounded-lg border bg-gray-50" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg border bg-gray-100 flex items-center justify-center text-gray-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-gray-900 line-clamp-1">{p.NAME}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md uppercase">
                                    {getCategoryName(p.CATEGORYID)}
                                  </span>
                                  {getSku(p) && (
                                    <span className="text-[10px] font-mono text-gray-400">SKU: {getSku(p)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* PACKQTY Input */}
                          <td className="px-6 py-4 text-center">
                            <input
                              type="number"
                              value={editPackQty[p.$id] !== undefined ? editPackQty[p.$id] : (p.PACKQTY || '')}
                              onChange={e => setEditPackQty(prev => ({ ...prev, [p.$id]: e.target.value }))}
                              placeholder="0"
                              className="w-20 px-2 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                            />
                          </td>

                          {/* WHOLESALEPRICE Input */}
                          <td className="px-6 py-4 text-center">
                            <div className="relative inline-block">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">$</span>
                              <input
                                type="number"
                                value={editWholesalePrice[p.$id] !== undefined ? editWholesalePrice[p.$id] : (p.WHOLESALEPRICE || '')}
                                onChange={e => setEditWholesalePrice(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                placeholder="0"
                                className="w-28 pl-6 pr-2 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                          </td>

                          {/* Calculated price */}
                          <td className="px-6 py-4 text-right">
                            <div>
                              <span className="font-bold text-emerald-600">
                                {formatPrice(computedPackagingPrice || p.PRICE)}
                              </span>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {isNaN(currentPackQty) || isNaN(currentWholesale) 
                                  ? 'Precio actual en DB' 
                                  : `${formatPrice(currentWholesale)} × ${currentPackQty} un.`}
                              </div>
                            </div>
                          </td>

                          {/* Stock */}
                          <td className="px-6 py-4 text-center font-semibold">
                            <span className={p.STOCK > 5 ? 'text-gray-900' : p.STOCK > 0 ? 'text-amber-600' : 'text-red-500'}>
                              {p.STOCK}
                            </span>
                          </td>

                          {/* Save Actions */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {isDirty ? (
                                <button
                                  onClick={() => handleSave(p.$id)}
                                  disabled={isSavingThis}
                                  className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm disabled:opacity-50"
                                  title="Guardar Cambios"
                                >
                                  {isSavingThis ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Save className="w-4 h-4" />
                                  )}
                                </button>
                              ) : saveStatus[p.$id] === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : saveStatus[p.$id] === 'error' ? (
                                <XCircle className="w-5 h-5 text-rose-500" />
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
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
          </div>

          {/* SECCIÓN 2: PRODUCTOS SIN CANTIDAD POR EMBALAJE */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-amber-50/50 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Productos Sin Cantidad por Embalaje ({withoutPackagingList.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Asigna una cantidad por paquete y su precio para moverlos automáticamente al catálogo por mayor</p>
              </div>
            </div>

            {withoutPackagingList.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No hay productos sin embalaje en esta selección. ¡Todo el catálogo está completo!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Producto</th>
                      <th className="px-6 py-3 text-center w-36">Unidades / Paquete</th>
                      <th className="px-6 py-3 text-center w-40">Precio Unitario Mayor</th>
                      <th className="px-6 py-3 text-right">Precio Actual en Tienda</th>
                      <th className="px-6 py-3 text-center w-24">Stock</th>
                      <th className="px-6 py-3 text-center w-24">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {withoutPackagingList.map(p => {
                      const isSavingThis = savingId === p.$id;
                      const hasPackQtyChanged = editPackQty[p.$id] !== undefined;
                      const hasWholesaleChanged = editWholesalePrice[p.$id] !== undefined;
                      const isDirty = hasPackQtyChanged || hasWholesaleChanged;

                      return (
                        <tr key={p.$id} className="hover:bg-gray-50/50 transition text-sm text-gray-700">
                          {/* Info */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {p.IMAGEURL ? (
                                <img src={p.IMAGEURL} alt={p.NAME} className="w-10 h-10 object-cover rounded-lg border bg-gray-50" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg border bg-gray-100 flex items-center justify-center text-gray-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-gray-900 line-clamp-1">{p.NAME}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md uppercase">
                                    {getCategoryName(p.CATEGORYID)}
                                  </span>
                                  {getSku(p) && (
                                    <span className="text-[10px] font-mono text-gray-400">SKU: {getSku(p)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* PACKQTY Input */}
                          <td className="px-6 py-4 text-center">
                            <input
                              type="number"
                              value={editPackQty[p.$id] !== undefined ? editPackQty[p.$id] : ''}
                              onChange={e => setEditPackQty(prev => ({ ...prev, [p.$id]: e.target.value }))}
                              placeholder="Fijar Cant."
                              className="w-24 px-2 py-1 border border-amber-200 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-amber-50/30"
                            />
                          </td>

                          {/* WHOLESALEPRICE Input */}
                          <td className="px-6 py-4 text-center">
                            <div className="relative inline-block">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">$</span>
                              <input
                                type="number"
                                value={editWholesalePrice[p.$id] !== undefined ? editWholesalePrice[p.$id] : (p.WHOLESALEPRICE || '')}
                                onChange={e => setEditWholesalePrice(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                placeholder="Fijar Mayor"
                                className="w-28 pl-6 pr-2 py-1 border border-amber-200 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-amber-50/30"
                              />
                            </div>
                          </td>

                          {/* Current base price */}
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-gray-900">
                              {formatPrice(p.PRICE || p.CURRENTPRICE)}
                            </span>
                          </td>

                          {/* Stock */}
                          <td className="px-6 py-4 text-center font-semibold">
                            <span className={p.STOCK > 5 ? 'text-gray-900' : p.STOCK > 0 ? 'text-amber-600' : 'text-red-500'}>
                              {p.STOCK}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {isDirty ? (
                                <button
                                  onClick={() => handleSave(p.$id)}
                                  disabled={isSavingThis}
                                  className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition shadow-sm disabled:opacity-50"
                                  title="Guardar y Mover"
                                >
                                  {isSavingThis ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Save className="w-4 h-4" />
                                  )}
                                </button>
                              ) : saveStatus[p.$id] === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : saveStatus[p.$id] === 'error' ? (
                                <XCircle className="w-5 h-5 text-rose-500" />
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
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
          </div>
          
        </div>
      )}
    </div>
  );
}
