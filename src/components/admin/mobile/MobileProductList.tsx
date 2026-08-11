'use client';

import { Search, X, Plus, Package, ChevronRight, ChevronLeft, RefreshCw, ChevronDown, Sparkles, Loader2, Trash2, Wrench, ImageOff } from 'lucide-react';
import { Product, Category } from '@/types/admin';
import { resolveStorageImageUrl } from '@/lib/product-images';
import { useState } from 'react';

type StockFilter = 'all' | 'instock' | 'low' | 'out';

interface Props {
  products: Product[];       // ya filtrados y ordenados (página actual)
  allProducts: Product[];    // para los contadores de los chips
  isLoading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  onSearchClear: () => void;
  categories: Category[];
  catFilter: string;
  onCatChange: (v: string) => void;
  stockFilter: StockFilter;
  onStockFilterChange: (v: StockFilter) => void;
  onEdit: (p: Product) => void;
  onEnhanceProduct: (p: Product) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  deleteId: string | null;
  aiLoading?: boolean;
  globalTotal?: number;
  onRefresh: () => void;
  currentPage: number;
  hasMore: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  // Fotos rotas / sin imagen
  brokenImages?: Record<string, string[]>;
  brokenOnly?: boolean;
  onBrokenOnlyChange?: (v: boolean) => void;
  onSyncBrokenImages?: () => void;
  syncingImages?: boolean;
  syncProgress?: { checked: number; broken: number };
  noImageOnly?: boolean;
  onNoImageOnlyChange?: (v: boolean) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

function StockBadge({ stock }: { stock: number }) {
  if (stock === 99999)
    return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Ilimitado</span>;
  if (stock <= 0)
    return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Agotado</span>;
  if (stock <= 10)
    return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{stock} un.</span>;
  return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{stock} un.</span>;
}

export default function MobileProductList({
  products, allProducts, isLoading,
  search, onSearchChange, onSearchSubmit, onSearchClear,
  categories, catFilter, onCatChange,
  stockFilter, onStockFilterChange,
  onEdit, onEnhanceProduct, onAdd, onDelete, deleteId, aiLoading, globalTotal, onRefresh,
  currentPage, hasMore, onNextPage, onPrevPage,
  brokenImages = {}, brokenOnly = false, onBrokenOnlyChange, onSyncBrokenImages, syncingImages = false, syncProgress,
  noImageOnly = false, onNoImageOnlyChange,
}: Props) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const brokenCount = Object.keys(brokenImages).length;
  const noImageCount = allProducts.filter(p => !p.IMAGEURL).length;
  const counts: Record<StockFilter, number> = {
    all: allProducts.length,
    instock: allProducts.filter(p => (p.STOCK ?? 0) > 0).length,
    low: allProducts.filter(p => (p.STOCK ?? 0) > 0 && (p.STOCK ?? 0) <= 10).length,
    out: allProducts.filter(p => (p.STOCK ?? 0) === 0).length,
  };
  const chips: [StockFilter, string][] = [['instock', 'En stock'], ['low', 'Stock bajo'], ['out', 'Agotados'], ['all', 'Todos']];

  return (
    <div className="md:hidden space-y-4 pb-28">
      {/* Header simple */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Productos</h1>
          <p className="text-xs text-gray-500">{globalTotal ? `${globalTotal.toLocaleString('es-CL')} en total` : `${allProducts.length} en total`} · página {currentPage}</p>
        </div>
        <button onClick={onRefresh} disabled={isLoading}
          className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm active:scale-95 transition">
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Buscador grande */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSearchSubmit(); }}
          placeholder="Buscar por nombre, SKU o código..."
          className="w-full pl-12 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        {search && (
          <button onClick={onSearchClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chips de stock con scroll horizontal */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {chips.map(([k, label]) => (
          <button key={k} onClick={() => onStockFilterChange(k)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition active:scale-95 ${
              stockFilter === k ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            {label}
            <span className={`text-[11px] font-bold px-1.5 rounded-full ${
              stockFilter === k ? 'bg-white/20 text-white'
              : k === 'out' ? 'bg-red-100 text-red-600'
              : k === 'low' ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-500'
            }`}>{counts[k]}</span>
          </button>
        ))}
      </div>

      {/* Select de categoría full-width */}
      <div className="relative">
        <select
          value={catFilter}
          onChange={e => onCatChange(e.target.value)}
          className="w-full appearance-none pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.$id} value={c.$id}>{c.name}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Herramientas + filtros de imagen */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative">
          <button onClick={() => setToolsOpen(v => !v)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium shadow-sm active:scale-95 transition">
            <Wrench className="w-4 h-4 text-gray-500" /> Herramientas
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
          </button>
          {toolsOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setToolsOpen(false)} />
              <div className="absolute left-0 mt-2 z-30 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl ring-1 ring-black/5 p-2 flex flex-col max-h-[70vh] overflow-y-auto">
                <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Imágenes</p>
                <button onClick={() => { setToolsOpen(false); onSyncBrokenImages?.(); }} disabled={syncingImages || allProducts.length === 0}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition text-left disabled:opacity-40">
                  <ImageOff className={`w-4 h-4 ${brokenCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                  {syncingImages ? 'Verificando…' : 'Verificar fotos'}
                  {brokenCount > 0 && !syncingImages && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">{brokenCount}</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
        {noImageCount > 0 && onNoImageOnlyChange && (
          <button onClick={() => onNoImageOnlyChange(!noImageOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition active:scale-95 ${
              noImageOnly ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            Sin imagen
            <span className={`text-[10px] font-bold px-1.5 rounded-full ${noImageOnly ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'}`}>{noImageCount}</span>
          </button>
        )}
        {brokenCount > 0 && onBrokenOnlyChange && (
          <button onClick={() => onBrokenOnlyChange(!brokenOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition active:scale-95 ${
              brokenOnly ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            <ImageOff className="w-3.5 h-3.5" />
            Fotos rotas
            <span className={`text-[10px] font-bold px-1 rounded-full ${brokenOnly ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>{brokenCount}</span>
          </button>
        )}
      </div>

      {/* Progreso de verificación */}
      {syncingImages && syncProgress && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Verificando fotos {syncProgress.checked}/{allProducts.flatMap(p => [p.IMAGEURL, p.IMAGEURL2, p.IMAGEURL3].filter(Boolean)).length} · {syncProgress.broken} rotas
        </div>
      )}

      {/* Lista de tarjetas */}
      {isLoading && products.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 flex gap-3 items-center animate-pulse">
              <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-14">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">No hay productos aquí</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">Prueba con otro filtro o agrega uno nuevo</p>
          <button onClick={onAdd}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl text-sm font-semibold shadow-lg active:scale-95 transition">
            <Plus className="w-4 h-4" /> Agregar producto
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {products.map(p => (
            <div key={p.$id}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex gap-3 items-center text-left active:scale-[0.98] active:bg-gray-50 transition">
              <button onClick={() => onEdit(p)} className="flex-1 flex gap-3 items-center text-left min-w-0">
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {p.IMAGEURL ? (
                    <img src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-300" />
                  )}
                  {(brokenImages[p.$id]?.length ?? 0) > 0 && (
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center" title={`${brokenImages[p.$id].length} imagen(es) rota(s)`}>
                      <ImageOff className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.NAME}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">{fmt(p.PRICE || p.WHOLESALEPRICE || 0)}</span>
                    <StockBadge stock={p.STOCK ?? 0} />
                  </div>
                </div>
              </button>
              <button
                onClick={() => onEnhanceProduct(p)}
                disabled={aiLoading}
                className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 text-gray-900 shrink-0 disabled:opacity-50"
                title="Mejorar con IA"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 animate-pulse" />}
              </button>
              <button
                onClick={() => onDelete(p.$id)}
                disabled={deleteId === p.$id}
                className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-xl hover:bg-red-100 transition-colors border border-red-200 text-red-600 shrink-0 disabled:opacity-50"
                title="Eliminar"
              >
                {deleteId === p.$id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" onClick={() => onEdit(p)} />
            </div>
          ))}
        </div>
      )}

      {/* Paginación simple */}
      {(currentPage > 1 || hasMore) && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <button onClick={onPrevPage} disabled={currentPage <= 1 || isLoading}
            className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-40 active:scale-95 transition">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <span className="text-xs font-semibold text-gray-500">Página {currentPage}</span>
          <button onClick={onNextPage} disabled={!hasMore || isLoading}
            className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-40 active:scale-95 transition">
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FAB Agregar */}
      <div className="fixed bottom-6 right-5 z-40">
        <button onClick={onAdd} aria-label="Agregar producto"
          className="w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl shadow-gray-900/30 flex items-center justify-center active:scale-90 transition">
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
