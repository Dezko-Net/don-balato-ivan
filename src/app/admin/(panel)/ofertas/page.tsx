'use client';

import { useEffect, useState, useCallback } from 'react';
import { Package, Search, RefreshCw, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/appwrite';
import { getSkuFromFeatures, getExactWholesaleFromFeatures, setExactWholesaleInFeatures } from '@/lib/product-features';
import { getServices, getAppwriteConfig } from '@/lib/appwrite-admin';

export default function OfertasAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [wholesaleOnly, setWholesaleOnly] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);

  // Load configuration and products
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch current selected IDs from our new API
      const configRes = await fetch('/api/ofertas');
      let currentSelected: string[] = [];
      if (configRes.ok) {
        const configData = await configRes.json();
        currentSelected = configData.productIds || [];
        setSelectedIds(currentSelected);
      }

      // 2. Fetch all products from public products API
      const prodRes = await fetch('/api/public-data/products?limit=1000&includeOutOfStock=true');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      } else {
        throw new Error('No se pudo cargar el listado de productos');
      }
    } catch (e: any) {
      setError(e.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle toggle selection
  const handleToggleSelect = (productId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Handle Toggle Exact Wholesale
  const handleToggleExactWholesale = async (product: Product) => {
    setUpdatingProductId(product.$id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      const pFeatures = Array.isArray(product.FEATURES) ? product.FEATURES.join('\n') : product.FEATURES || '';
      const isCurrentlyExact = getExactWholesaleFromFeatures(pFeatures);
      const newFeaturesStr = setExactWholesaleInFeatures(product.FEATURES || [], !isCurrentlyExact);
      const newFeaturesArray = newFeaturesStr.split('\n').filter(Boolean);

      const PRODUCTS_COLLECTION_ID = 'products';

      await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, product.$id, {
        FEATURES: newFeaturesArray,
      });

      // Update local state
      setProducts(prev => prev.map(p => {
        if (p.$id === product.$id) {
          return { ...p, FEATURES: newFeaturesArray };
        }
        return p;
      }));
    } catch (err: any) {
      alert('Error al actualizar la lógica mayorista: ' + err.message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch('/api/ofertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedIds }),
      });

      if (!res.ok) {
        throw new Error('Error al guardar la selección');
      }

      alert('¡Configuración de Ofertas guardada con éxito!');
    } catch (e: any) {
      setError(e.message || 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter products based on search and wholesale toggles
  const filteredProducts = products.filter(p => {
    const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES || '';
    const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS || '';
    const resolvedSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);

    const matchesSearch = p.NAME.toLowerCase().includes(search.toLowerCase()) || 
                          resolvedSku.toLowerCase().includes(search.toLowerCase());
    
    const hasWholesale = p.WHOLESALEPRICE && p.WHOLESALEPRICE > 0 && 
                         p.WHOLESALEMINQUANTITY && p.WHOLESALEMINQUANTITY > 0;
    
    if (wholesaleOnly) {
      return matchesSearch && hasWholesale;
    }
    return matchesSearch;
  });

  // Selected products details
  const selectedProducts = products.filter(p => selectedIds.includes(p.$id));

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            🏷️ Configuración de Sección OFERTAS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Selecciona los productos que aparecerán como tarjetas grandes (2 por fila) en la parte superior de la página principal.
            Esta sección está diseñada para mostrar la lógica de <strong className="text-pink-600">Precio Mayorista Desde</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading || isSaving}
            className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition disabled:opacity-60 flex items-center gap-1.5 text-sm font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Recargar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="px-6 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition disabled:opacity-60 text-sm font-extrabold shadow-md shadow-pink-500/20 active:scale-95"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Selected Products List at the Top */}
      {selectedProducts.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50/40 to-white p-6 rounded-2xl border border-pink-100/50 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-pink-700 uppercase tracking-wider flex items-center gap-2">
            ⭐ Productos Seleccionados ({selectedProducts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedProducts.map(p => {
              const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES || '';
              const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS || '';
              const resolvedSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);

              return (
                <div key={`sel-${p.$id}`} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 relative group">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-150 overflow-hidden shrink-0">
                    {p.IMAGEURL ? (
                      <img src={p.IMAGEURL} alt={p.NAME} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{p.NAME}</p>
                    <p className="text-[10px] text-gray-400 font-mono">SKU: {resolvedSku || 'N/A'}</p>
                    {p.WHOLESALEPRICE && p.WHOLESALEMINQUANTITY ? (
                      <p className="text-[10px] text-pink-600 font-bold mt-0.5">
                        Mayorista: {formatPrice(p.WHOLESALEPRICE)} x{p.WHOLESALEMINQUANTITY}+
                      </p>
                    ) : (
                      <p className="text-[10px] text-amber-500 font-bold mt-0.5">Sin precio mayorista</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleSelect(p.$id)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-600"
                    title="Quitar de la lista"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition animate-fade-in"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-gray-600 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={wholesaleOnly}
                onChange={e => setWholesaleOnly(e.target.checked)}
                className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
              />
              Solo con precio mayorista
            </label>
          </div>
        </div>

        {/* Products Table/Grid */}
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <th className="px-4 py-3 text-center w-12">Selección</th>
                <th className="px-4 py-3 text-left w-16">Imagen</th>
                <th className="px-4 py-3 text-left w-36">SKU</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left w-28">Precio Normal</th>
                <th className="px-4 py-3 text-left w-52">Lógica Mayorista</th>
                <th className="px-4 py-3 text-center w-40">Tipo de Lógica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5, 6].map(j => (
                      <td key={j} className="px-4 py-5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-gray-400">
                    No se encontraron productos coincidentes
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const isSelected = selectedIds.includes(p.$id);
                  const hasWholesale = p.WHOLESALEPRICE && p.WHOLESALEPRICE > 0 && 
                                       p.WHOLESALEMINQUANTITY && p.WHOLESALEMINQUANTITY > 0;
                  
                  const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES || '';
                  const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS || '';
                  const resolvedSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
                  
                  return (
                    <tr 
                      key={p.$id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-pink-50/20' : ''}`}
                      onClick={() => handleToggleSelect(p.$id)}
                    >
                      <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleSelect(p.$id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-pink-600 border-pink-600 text-white shadow-sm shadow-pink-600/20' 
                              : 'border-gray-300 bg-white hover:border-pink-300'
                          }`}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                          {p.IMAGEURL ? (
                            <img src={p.IMAGEURL} alt={p.NAME} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {resolvedSku || 'S/N'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 max-w-sm truncate" title={p.NAME}>
                        {p.NAME}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-bold">
                        {formatPrice(p.CURRENTPRICE && p.CURRENTPRICE > 0 ? p.CURRENTPRICE : p.PRICE)}
                      </td>
                      <td className="px-4 py-3">
                        {hasWholesale ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-pink-600 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-lg w-fit">
                              A partir de {p.WHOLESALEMINQUANTITY} un: {formatPrice(p.WHOLESALEPRICE!)}
                            </span>
                            {p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.WHOLESALEPRICE ? (
                              <span className="text-[10px] text-gray-400 mt-0.5">
                                Ahorro de {formatPrice((p.CURRENTPRICE || p.PRICE) - p.WHOLESALEPRICE!)} por unidad
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-xs text-amber-500 font-bold bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg w-fit">
                            ⚠️ Sin precio mayorista
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={!hasWholesale || updatingProductId === p.$id}
                          onClick={() => handleToggleExactWholesale(p)}
                          className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition tracking-wider uppercase ${
                            getExactWholesaleFromFeatures(pFeatures)
                              ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600'
                              : 'bg-indigo-50 border-indigo-150 text-indigo-700 hover:bg-indigo-100'
                          } disabled:opacity-50`}
                          title={getExactWholesaleFromFeatures(pFeatures) ? "Se aplica solo si la cantidad es exactamente igual al mínimo" : "Se aplica si la cantidad es mayor o igual al mínimo"}
                        >
                          {updatingProductId === p.$id ? (
                            'Actualizando...'
                          ) : getExactWholesaleFromFeatures(pFeatures) ? (
                            '🎯 Cantidad Exacta'
                          ) : (
                            '📈 Rango Mínimo'
                          )}
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
