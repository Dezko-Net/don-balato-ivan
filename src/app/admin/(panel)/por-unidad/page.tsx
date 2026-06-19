'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import {
  ArrowLeft, Search, Package, Save, CheckCircle2, XCircle, Loader2,
  Filter, Tag, Layers, AlertCircle, Undo2, RefreshCw, Database, Zap,
  Flame, AlertTriangle, TrendingDown, Users, Clock, ExternalLink, Check,
} from 'lucide-react';
import {
  getServices,
  getAppwriteConfig,
  PRODUCTS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
} from '@/lib/appwrite-admin';
import { Product, Category } from '@/types/admin';

const PRODUCTS_CACHE_KEY = 'yaxsel_porunidad_products_cache';
const CATEGORIES_CACHE_KEY = 'yaxsel_porunidad_categories_cache';
const CACHE_TIME_KEY = 'yaxsel_porunidad_cache_time';

function getSku(p: Product): string {
  const featMatch = (typeof p.FEATURES === 'string') ? p.FEATURES.match(/SKU:\s*(.+)/i) : null;
  if (featMatch) return featMatch[1].trim();
  const tagParts = Array.isArray(p.TAGS)
    ? p.TAGS
    : (typeof p.TAGS === 'string' ? p.TAGS.split(',').map((t: string) => t.trim()) : []);
  if (tagParts.length >= 1) return tagParts[0];
  return p.sku || '';
}

export default function PorUnidadPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const [cacheTime, setCacheTime] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Inline edit states
  const [editPrice, setEditPrice] = useState<Record<string, string>>({});
  const [editCurrentPrice, setEditCurrentPrice] = useState<Record<string, string>>({});
  const [editStock, setEditStock] = useState<Record<string, string>>({});
  const [editIsActive, setEditIsActive] = useState<Record<string, boolean>>({});
  const [editDiscPct, setEditDiscPct] = useState<Record<string, string>>({});
  // Precio por volumen (cantidad mínima → precio especial)
  const [editWholesalePrice, setEditWholesalePrice] = useState<Record<string, string>>({});
  const [editWholesaleMinQty, setEditWholesaleMinQty] = useState<Record<string, string>>({});
  // Oferta temporal por unidad (vigencia de CURRENTPRICE)
  const [editUnitOfferExpiresAt, setEditUnitOfferExpiresAt] = useState<Record<string, string>>({});
  const [tick, setTick] = useState(0);

  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [bulkErrorLog, setBulkErrorLog] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({});
  const [publishStatus, setPublishStatus] = useState<Record<string, 'loading' | 'success' | 'error' | null>>({});

  const [activeTab, setActiveTab] = useState<'withOffer' | 'withoutOffer'>('withOffer');
  const [visibleCount, setVisibleCount] = useState(10);

  // Tick para actualizar los contadores en tiempo real
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Reset paginación al cambiar pestaña o filtros
  useEffect(() => { setVisibleCount(10); }, [activeTab, search, catFilter]);

  // Asegurar que el campo UNIT_OFFER_EXPIRES_AT exista en Appwrite (una vez por sesión)
  useEffect(() => {
    const key = 'yaxsel_schema_v2';
    if (!sessionStorage.getItem(key)) {
      fetch('/api/admin/fix-schema', { method: 'POST' })
        .then(() => sessionStorage.setItem(key, '1'))
        .catch(() => {});
    }
  }, []);

  const loadFreshData = async () => {
    setLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      const catResp = await databases.listDocuments(databaseId, CATEGORIES_COLLECTION_ID, [Query.limit(100)]);
      const freshCats = catResp.documents as unknown as Category[];
      setCategories(freshCats);

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

      const nowStr = new Date().toLocaleString('es-CL');
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(all));
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(freshCats));
      localStorage.setItem(CACHE_TIME_KEY, nowStr);
      setCacheTime(nowStr);
      setIsFromCache(false);
    } catch (e) {
      console.error('Error loading data:', e);
      alert('Error al recargar catálogo desde Appwrite');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedProds = localStorage.getItem(PRODUCTS_CACHE_KEY);
    const cachedCats = localStorage.getItem(CATEGORIES_CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cachedProds && cachedCats && cachedTime) {
      try {
        setProducts(JSON.parse(cachedProds));
        setCategories(JSON.parse(cachedCats));
        setCacheTime(cachedTime);
        setIsFromCache(true);
        setLoading(false);
      } catch {
        loadFreshData();
      }
    } else {
      loadFreshData();
    }
  }, []);

  const updateCacheLocally = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(updatedProducts));
      const nowStr = new Date().toLocaleString('es-CL') + ' (Actualizado)';
      localStorage.setItem(CACHE_TIME_KEY, nowStr);
      setCacheTime(nowStr);
    } catch {}
  };

  const modifiedIds = Array.from(new Set([
    ...Object.keys(editPrice),
    ...Object.keys(editCurrentPrice),
    ...Object.keys(editStock),
    ...Object.keys(editIsActive),
    ...Object.keys(editWholesalePrice),
    ...Object.keys(editWholesaleMinQty),
    ...Object.keys(editUnitOfferExpiresAt),
  ])).filter(id => {
    const prod = products.find(p => p.$id === id);
    if (!prod) return false;
    const priceChanged = editPrice[id] !== undefined && parseInt(editPrice[id], 10) !== (prod.PRICE || 0);
    const cpChanged = editCurrentPrice[id] !== undefined && parseInt(editCurrentPrice[id], 10) !== (prod.CURRENTPRICE || 0);
    const stockChanged = editStock[id] !== undefined && parseInt(editStock[id], 10) !== (prod.STOCK || 0);
    const activeChanged = editIsActive[id] !== undefined && editIsActive[id] !== (prod.ISACTIVE !== false);
    const wpChanged = editWholesalePrice[id] !== undefined && parseInt(editWholesalePrice[id], 10) !== (prod.WHOLESALEPRICE || 0);
    const wqChanged = editWholesaleMinQty[id] !== undefined && parseInt(editWholesaleMinQty[id], 10) !== (prod.WHOLESALEMINQUANTITY || 0);
    const expChanged = editUnitOfferExpiresAt[id] !== undefined && (editUnitOfferExpiresAt[id] ? new Date(editUnitOfferExpiresAt[id]).getTime() : 0) !== (prod.UNIT_OFFER_EXPIRES_AT || 0);
    return priceChanged || cpChanged || stockChanged || activeChanged || wpChanged || wqChanged || expChanged;
  });

  const buildUpdateData = (id: string, prod: Product): Record<string, unknown> => {
    const updateData: Record<string, unknown> = {};
    const rawPrice = editPrice[id];
    const rawCp = editCurrentPrice[id];
    const rawStock = editStock[id];
    const rawActive = editIsActive[id];
    const rawWp = editWholesalePrice[id];
    const rawWq = editWholesaleMinQty[id];

    const rawExp = editUnitOfferExpiresAt[id];
    if (rawPrice !== undefined) updateData.PRICE = isNaN(parseInt(rawPrice, 10)) ? prod.PRICE : parseInt(rawPrice, 10);
    if (rawCp !== undefined) updateData.CURRENTPRICE = isNaN(parseInt(rawCp, 10)) ? 0 : parseInt(rawCp, 10);
    if (rawStock !== undefined) updateData.STOCK = isNaN(parseInt(rawStock, 10)) ? 0 : parseInt(rawStock, 10);
    if (rawActive !== undefined) updateData.ISACTIVE = rawActive;
    if (rawWp !== undefined) updateData.WHOLESALEPRICE = isNaN(parseInt(rawWp, 10)) ? 0 : parseInt(rawWp, 10);
    if (rawWq !== undefined) updateData.WHOLESALEMINQUANTITY = isNaN(parseInt(rawWq, 10)) ? 0 : parseInt(rawWq, 10);
    if (rawExp !== undefined) {
      const newExpMs = rawExp ? new Date(rawExp).getTime() : 0;
      if (newExpMs !== (prod.UNIT_OFFER_EXPIRES_AT || 0)) {
        updateData.UNIT_OFFER_EXPIRES_AT = newExpMs;
      }
    }
    return updateData;
  };

  const clearEditsForId = (id: string) => {
    const del = (setter: React.Dispatch<React.SetStateAction<Record<string, string | boolean>>>) =>
      setter(prev => { const n = { ...prev }; delete (n as Record<string, unknown>)[id]; return n; });
    setEditPrice(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditCurrentPrice(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditStock(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditIsActive(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditDiscPct(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditWholesalePrice(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditWholesaleMinQty(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditUnitOfferExpiresAt(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleSaveSingle = async (productId: string) => {
    const prod = products.find(p => p.$id === productId);
    if (!prod) return;

    const updateData = buildUpdateData(productId, prod);
    if (Object.keys(updateData).length === 0) return;

    setSavingId(productId);
    setSaveStatus(prev => ({ ...prev, [productId]: null }));

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, productId, updateData);

      const updated = products.map(p => p.$id === productId ? { ...p, ...updateData } : p);
      setProducts(updated);
      updateCacheLocally(updated);
      clearEditsForId(productId);

      setSaveStatus(prev => ({ ...prev, [productId]: 'success' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [productId]: null })), 2000);
      try { await fetch('/api/revalidate?tag=products'); } catch {}
    } catch (err) {
      console.error('Error updating product:', err);
      setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAll = async () => {
    if (modifiedIds.length === 0) return;
    setIsBulkSaving(true);
    setBulkProgress({ current: 0, total: modifiedIds.length });
    setBulkErrorLog([]);

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    const errors: string[] = [];
    const successfulUpdates: Record<string, Record<string, unknown>> = {};
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < modifiedIds.length; i++) {
      const id = modifiedIds[i];
      const prod = products.find(p => p.$id === id);
      if (!prod) continue;

      const updateData = buildUpdateData(id, prod);
      if (Object.keys(updateData).length === 0) {
        setBulkProgress(prev => ({ ...prev, current: i + 1 }));
        continue;
      }

      try {
        setSavingId(id);
        await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, id, updateData);
        successfulUpdates[id] = updateData;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        errors.push(`${prod.NAME} (${getSku(prod)}): ${msg}`);
      } finally {
        setSavingId(null);
        setBulkProgress(prev => ({ ...prev, current: i + 1 }));
        await delay(100);
      }
    }

    const updated = products.map(p => {
      const update = successfulUpdates[p.$id];
      return update ? { ...p, ...update } : p;
    });
    setProducts(updated);
    updateCacheLocally(updated);
    Object.keys(successfulUpdates).forEach(id => clearEditsForId(id));

    setBulkErrorLog(errors);
    setIsBulkSaving(false);

    if (Object.keys(successfulUpdates).length > 0) {
      try { await fetch('/api/revalidate?tag=products'); } catch {}
    }

    if (errors.length === 0) {
      alert(`¡Éxito! Se guardaron los cambios de ${modifiedIds.length} productos.`);
    } else {
      alert(`Se guardaron algunos cambios, pero ocurrieron ${errors.length} errores.`);
    }
  };

  const handlePublish = async (productId: string) => {
    setPublishStatus(prev => ({ ...prev, [productId]: 'loading' }));
    try {
      const res = await fetch('/api/revalidate?tag=products');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPublishStatus(prev => ({ ...prev, [productId]: 'success' }));
      setTimeout(() => setPublishStatus(prev => ({ ...prev, [productId]: null })), 3000);
    } catch {
      setPublishStatus(prev => ({ ...prev, [productId]: 'error' }));
      setTimeout(() => setPublishStatus(prev => ({ ...prev, [productId]: null })), 3000);
    }
  };

  const handleDiscardAll = () => {
    if (confirm('¿Descartar todos los cambios pendientes?')) {
      setEditPrice({});
      setEditCurrentPrice({});
      setEditStock({});
      setEditIsActive({});
      setEditDiscPct({});
      setEditWholesalePrice({});
      setEditWholesaleMinQty({});
      setEditUnitOfferExpiresAt({});
    }
  };

  const getCategoryName = (catId?: string) => {
    if (!catId) return 'Sin categoría';
    return categories.find(c => c.$id === catId)?.name || 'Sin categoría';
  };

  const formatPrice = (price?: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price || 0);

  const activeOffersList = useMemo(
    () => products.filter(p => p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < p.PRICE),
    [products],
  );

  // Ofertas del día: tienen CURRENTPRICE activo Y un UNIT_OFFER_EXPIRES_AT vigente
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timedOffersList = useMemo(() => {
    const now = Date.now();
    return products.filter(p =>
      p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < p.PRICE &&
      p.UNIT_OFFER_EXPIRES_AT && p.UNIT_OFFER_EXPIRES_AT > now
    );
  }, [products, tick]);

  const filtered = products.filter(p => {
    const q = search.toLowerCase().trim();
    const categoryMatch = !catFilter || p.CATEGORYID === catFilter;
    if (!q) return categoryMatch;

    const terms = q.split(/[\n,;]+/).map(t => t.trim()).filter(Boolean);
    if (terms.length === 0) return categoryMatch;

    const matchesAny = terms.some(term => {
      const nameMatch = p.NAME.toLowerCase().includes(term);
      const skuMatch = getSku(p).toLowerCase().includes(term);
      return nameMatch || skuMatch;
    });

    return matchesAny && categoryMatch;
  });

  // "Con descuento" incluye: CURRENTPRICE activo O precio por volumen configurado
  const hasAnyDiscount = (p: Product) => {
    const cp = editCurrentPrice[p.$id] !== undefined ? parseInt(editCurrentPrice[p.$id], 10) : (p.CURRENTPRICE || 0);
    const hasCP = cp > 0 && cp < p.PRICE;
    const wp = editWholesalePrice[p.$id] !== undefined ? parseInt(editWholesalePrice[p.$id], 10) : (p.WHOLESALEPRICE || 0);
    const wq = editWholesaleMinQty[p.$id] !== undefined ? parseInt(editWholesaleMinQty[p.$id], 10) : (p.WHOLESALEMINQUANTITY || 0);
    const hasVol = wp > 0 && wq > 1;
    return hasCP || hasVol;
  };

  const withOfferList = filtered.filter(hasAnyDiscount);
  const withoutOfferList = filtered.filter(p => !hasAnyDiscount(p));

  const totalWithOffer = products.filter(p =>
    (p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < p.PRICE) ||
    (p.WHOLESALEPRICE && p.WHOLESALEPRICE > 0 && p.WHOLESALEMINQUANTITY && p.WHOLESALEMINQUANTITY > 1)
  ).length;
  const totalInactive = products.filter(p => p.ISACTIVE === false).length;
  const totalWithVolume = products.filter(p => p.WHOLESALEPRICE && p.WHOLESALEPRICE > 0 && p.WHOLESALEMINQUANTITY && p.WHOLESALEMINQUANTITY > 1).length;

  // Compute per-product derived state for rendering
  const toLocalDatetimeStr = (ms: number) => {
    const d = new Date(ms);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const getRowState = (p: Product) => {
    const sv = savingId === p.$id;
    const nP = editPrice[p.$id];
    const nCP = editCurrentPrice[p.$id];
    const nS = editStock[p.$id];
    const nA = editIsActive[p.$id];
    const nD = editDiscPct[p.$id];
    const nWP = editWholesalePrice[p.$id];
    const nWQ = editWholesaleMinQty[p.$id];
    const nExp = editUnitOfferExpiresAt[p.$id];

    const hP = nP !== undefined && parseInt(nP, 10) !== (p.PRICE || 0);
    const hCP = nCP !== undefined && parseInt(nCP, 10) !== (p.CURRENTPRICE || 0);
    const hS = nS !== undefined && parseInt(nS, 10) !== (p.STOCK || 0);
    const hA = nA !== undefined && nA !== (p.ISACTIVE !== false);
    const hWP = nWP !== undefined && parseInt(nWP, 10) !== (p.WHOLESALEPRICE || 0);
    const hWQ = nWQ !== undefined && parseInt(nWQ, 10) !== (p.WHOLESALEMINQUANTITY || 0);
    const hExp = nExp !== undefined && (nExp ? new Date(nExp).getTime() : 0) !== (p.UNIT_OFFER_EXPIRES_AT || 0);
    const dirty = hP || hCP || hS || hA || hWP || hWQ || hExp;

    const effectiveCP = nCP !== undefined ? parseInt(nCP, 10) : (p.CURRENTPRICE || 0);
    const effectiveP = nP !== undefined ? parseInt(nP, 10) : p.PRICE;
    const discPct = effectiveP > 0 && effectiveCP > 0 ? Math.round((1 - effectiveCP / effectiveP) * 100) : 0;
    const isActive = nA !== undefined ? nA : (p.ISACTIVE !== false);
    const hasOffer = effectiveCP > 0 && effectiveCP < effectiveP;

    const effectiveWP = nWP !== undefined ? parseInt(nWP, 10) : (p.WHOLESALEPRICE || 0);
    const effectiveWQ = nWQ !== undefined ? parseInt(nWQ, 10) : (p.WHOLESALEMINQUANTITY || 0);
    const hasVolPrice = effectiveWP > 0 && effectiveWQ > 1;
    const volDiscPct = effectiveP > 0 && effectiveWP > 0 ? Math.round((1 - effectiveWP / effectiveP) * 100) : 0;

    // Oferta temporal
    const expiresAtMs = nExp !== undefined ? (nExp ? new Date(nExp).getTime() : 0) : (p.UNIT_OFFER_EXPIRES_AT || 0);
    const hasExpiry = expiresAtMs > 0;
    const isExpired = hasExpiry && expiresAtMs < Date.now();
    const secsLeft = hasExpiry ? Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000)) : 0;
    const expiryInputVal = nExp !== undefined ? nExp : (p.UNIT_OFFER_EXPIRES_AT && p.UNIT_OFFER_EXPIRES_AT > 0 ? toLocalDatetimeStr(p.UNIT_OFFER_EXPIRES_AT) : '');

    const handleDiscPctChange = (val: string) => {
      setEditDiscPct(v => ({ ...v, [p.$id]: val }));
      const pct = parseInt(val, 10);
      if (!isNaN(pct) && pct > 0 && pct <= 99 && effectiveP > 0) {
        setEditCurrentPrice(v => ({ ...v, [p.$id]: String(Math.round(effectiveP * (1 - pct / 100))) }));
      }
    };

    return { sv, nP, nCP, nS, nA, nD, nWP, nWQ, nExp, hP, hCP, hS, hA, hWP, hWQ, hExp, dirty, effectiveCP, effectiveP, discPct, isActive, hasOffer, effectiveWP, effectiveWQ, hasVolPrice, volDiscPct, hasExpiry, isExpired, secsLeft, expiryInputVal, handleDiscPctChange };
  };

  const currentList = activeTab === 'withOffer' ? withOfferList : withoutOfferList;
  const visibleList = currentList.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Floating save bar */}
      {modifiedIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-5 border border-gray-700 max-w-[calc(100vw-1.5rem)] w-full sm:w-auto">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Sin guardar</p>
            <p className="text-xs sm:text-sm font-bold text-pink-400">{modifiedIds.length} producto{modifiedIds.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button onClick={handleDiscardAll} disabled={isBulkSaving} className="px-3 py-1.5 hover:bg-gray-800 text-gray-300 text-xs font-semibold rounded-xl border border-gray-700 transition flex items-center gap-1">
              <Undo2 className="w-3.5 h-3.5" /> Descartar
            </button>
            <button onClick={handleSaveAll} disabled={isBulkSaving} className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5">
              {isBulkSaving
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />{bulkProgress.current}/{bulkProgress.total}</>
                : <><Save className="w-3.5 h-3.5" />Guardar Todo</>}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="p-2 hover:bg-white rounded-xl transition text-gray-400 hover:text-gray-700 border border-transparent hover:border-gray-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-6 h-6 text-pink-600" />
                Por Unidad
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Control de precios, descuentos y precio por volumen — productos de /productos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {cacheTime && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-500 font-medium">
                <Database className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline">{isFromCache ? 'Caché' : 'BD'}: </span>
                <span className="truncate max-w-[140px]">{cacheTime}</span>
              </div>
            )}
            <button onClick={loadFreshData} disabled={loading || isBulkSaving}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sincronizar</span>
            </button>
          </div>
        </div>

        {/* Error log */}
        {bulkErrorLog.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2"><AlertCircle className="w-4 h-4" />Errores al guardar:</div>
            <ul className="text-xs text-rose-700 list-disc pl-5 space-y-1">{bulkErrorLog.map((err, idx) => <li key={idx}>{err}</li>)}</ul>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Total Catálogo</span><Layers className="w-4 h-4 text-pink-400" /></div>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">productos en sistema</p>
          </div>
          <div className={`bg-white rounded-2xl border p-4 shadow-sm ${totalWithOffer > 0 ? 'border-pink-200 bg-pink-50/30' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Con Descuento</span><TrendingDown className={`w-4 h-4 ${totalWithOffer > 0 ? 'text-pink-500' : 'text-gray-300'}`} /></div>
            <p className={`text-2xl font-bold ${totalWithOffer > 0 ? 'text-pink-600' : 'text-gray-400'}`}>{totalWithOffer}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">precio especial activo</p>
          </div>
          <div className={`bg-white rounded-2xl border p-4 shadow-sm ${totalWithVolume > 0 ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Por Volumen</span><Users className={`w-4 h-4 ${totalWithVolume > 0 ? 'text-indigo-500' : 'text-gray-300'}`} /></div>
            <p className={`text-2xl font-bold ${totalWithVolume > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>{totalWithVolume}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">precio baja x cantidad</p>
          </div>
          <div className={`bg-white rounded-2xl border p-4 shadow-sm ${totalInactive > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Inactivos</span><AlertTriangle className={`w-4 h-4 ${totalInactive > 0 ? 'text-amber-500' : 'text-gray-300'}`} /></div>
            <p className={`text-2xl font-bold ${totalInactive > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{totalInactive}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">ocultos en la tienda</p>
          </div>
        </div>

        {/* OFERTAS DEL DÍA — Tiempo Limitado (tienen UNIT_OFFER_EXPIRES_AT vigente) */}
        {timedOffersList.length > 0 && (
          <div className="bg-white rounded-2xl border border-pink-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center gap-2 flex-wrap">
              <Zap className="w-4 h-4 text-pink-500" />
              <h2 className="font-bold text-gray-900 text-sm">⚡ Ofertas del Día — Tiempo Limitado</h2>
              <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">{timedOffersList.length} activa{timedOffersList.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {timedOffersList.map(p => {
                  const now = Date.now();
                  const expiresAtMs = p.UNIT_OFFER_EXPIRES_AT!;
                  const secsLeft = Math.max(0, Math.floor((expiresAtMs - now) / 1000));
                  const hh = Math.floor(secsLeft / 3600);
                  const mm = Math.floor((secsLeft % 3600) / 60);
                  const ss = secsLeft % 60;
                  const fmt = (n: number) => String(n).padStart(2, '0');
                  const isUrgent = secsLeft < 3600;
                  const discPct = p.PRICE > 0 ? Math.round((1 - (p.CURRENTPRICE || 0) / p.PRICE) * 100) : 0;
                  return (
                    <div key={p.$id} className={`rounded-xl border p-3 space-y-2 ${isUrgent ? 'border-red-200 bg-red-50/20' : 'border-pink-100 bg-pink-50/20'}`}>
                      <div className="flex items-center gap-3">
                        {p.IMAGEURL
                          ? <img src={p.IMAGEURL} alt={p.NAME} className="w-10 h-10 object-cover rounded-lg border bg-gray-100 shrink-0" />
                          : <div className="w-10 h-10 rounded-lg border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-gray-300" /></div>}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{p.NAME}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-gray-500">Base: {formatPrice(p.PRICE)}</span>
                            <span className="text-[10px] font-black text-pink-600">→ {formatPrice(p.CURRENTPRICE)} (-{discPct}%)</span>
                          </div>
                        </div>
                        {/* Countdown */}
                        <div className={`shrink-0 flex flex-col items-center rounded-xl px-2 py-1.5 border ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-pink-50 border-pink-200'}`}>
                          <Clock className={`w-3 h-3 mb-0.5 ${isUrgent ? 'text-red-500' : 'text-pink-500'}`} />
                          <span className={`text-[12px] font-black tabular-nums leading-none ${isUrgent ? 'text-red-600' : 'text-pink-600'}`}>
                            {hh > 0 ? `${fmt(hh)}:` : ''}{fmt(mm)}:{fmt(ss)}
                          </span>
                          {isUrgent && <span className="text-[8px] text-red-500 font-bold mt-0.5">¡ÚLTIMA HORA!</span>}
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-400">Expira: {new Date(expiresAtMs).toLocaleString('es-CL')}</p>
                      <button
                        onClick={() => handleSaveSingle(p.$id)}
                        disabled={savingId === p.$id || isBulkSaving}
                        className="w-full py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition disabled:opacity-30"
                      >
                        {savingId === p.$id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        {saveStatus[p.$id] === 'success' ? '✓ Guardado' : 'Ver / Editar en tabla'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Active Offers Panel */}
        {activeOffersList.length > 0 && (
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center gap-2 flex-wrap">
              <Flame className="w-4 h-4 text-pink-500" />
              <h2 className="font-bold text-gray-900 text-sm">Descuentos Activos por Unidad</h2>
              <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">{activeOffersList.length} activo{activeOffersList.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {activeOffersList.map(p => {
                  const sv = savingId === p.$id;
                  const nCP = editCurrentPrice[p.$id];
                  const nDiscPct = editDiscPct[p.$id];
                  const nExp = editUnitOfferExpiresAt[p.$id];
                  const hCP = nCP !== undefined && parseInt(nCP, 10) !== (p.CURRENTPRICE || 0);
                  const hExp = nExp !== undefined && (nExp ? new Date(nExp).getTime() : 0) !== (p.UNIT_OFFER_EXPIRES_AT || 0);
                  const isDirtyPanel = hCP || hExp;
                  const discPct = p.PRICE > 0 ? Math.round((1 - (p.CURRENTPRICE || 0) / p.PRICE) * 100) : 0;

                  const expiresAtMs = nExp !== undefined ? (nExp ? new Date(nExp).getTime() : 0) : (p.UNIT_OFFER_EXPIRES_AT || 0);
                  const hasExpiry = expiresAtMs > 0;
                  const isExpired = hasExpiry && expiresAtMs < Date.now();
                  const secsLeft = hasExpiry ? Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000)) : 0;
                  const hh = Math.floor(secsLeft / 3600);
                  const mm = Math.floor((secsLeft % 3600) / 60);
                  const ss = secsLeft % 60;
                  const fmt = (n: number) => String(n).padStart(2, '0');
                  const expiryInputVal = nExp !== undefined ? nExp : (p.UNIT_OFFER_EXPIRES_AT && p.UNIT_OFFER_EXPIRES_AT > 0 ? toLocalDatetimeStr(p.UNIT_OFFER_EXPIRES_AT) : '');

                  const handleOfferDiscPctChange = (val: string) => {
                    setEditDiscPct(v => ({ ...v, [p.$id]: val }));
                    const pct = parseInt(val, 10);
                    if (!isNaN(pct) && pct > 0 && pct <= 99 && p.PRICE > 0) {
                      setEditCurrentPrice(v => ({ ...v, [p.$id]: String(Math.round(p.PRICE * (1 - pct / 100))) }));
                    }
                  };

                  return (
                    <div key={p.$id} className={`rounded-xl border p-3 space-y-2 ${isExpired ? 'border-gray-200 bg-gray-50/30' : 'border-pink-100 bg-pink-50/20'}`}>
                      <div className="flex items-center gap-3">
                        {p.IMAGEURL
                          ? <img src={p.IMAGEURL} alt={p.NAME} className="w-10 h-10 object-cover rounded-lg border bg-gray-100 shrink-0" />
                          : <div className="w-10 h-10 rounded-lg border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-gray-300" /></div>}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{p.NAME}</p>
                          <p className="text-[10px] text-gray-500">Base: {formatPrice(p.PRICE)} · <span className="font-bold text-pink-600">-{discPct}%</span></p>
                          {p.ISACTIVE === false && <p className="text-[10px] text-red-600 font-bold mt-0.5">⚠️ Inactivo</p>}
                          {isExpired && <p className="text-[10px] text-amber-600 font-bold mt-0.5">⏰ Oferta EXPIRADA</p>}
                        </div>
                        {/* Countdown */}
                        {hasExpiry && !isExpired && (
                          <div className="shrink-0 flex flex-col items-center bg-pink-50 border border-pink-200 rounded-xl px-2 py-1">
                            <Clock className="w-3 h-3 text-pink-500 mb-0.5" />
                            <span className="text-[11px] font-black text-pink-600 tabular-nums leading-none">
                              {hh > 0 ? `${fmt(hh)}:` : ''}{fmt(mm)}:{fmt(ss)}
                            </span>
                            {secsLeft < 3600 && <span className="text-[8px] text-red-500 font-bold mt-0.5">¡ÚLTIMA HORA!</span>}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 font-semibold block mb-1">% Descuento</label>
                          <div className="relative">
                            <input type="number" min="1" max="99" value={nDiscPct ?? (discPct > 0 ? String(discPct) : '')} onChange={e => handleOfferDiscPctChange(e.target.value)} placeholder="ej: 15"
                              className={`w-full pl-2 pr-5 py-1.5 border rounded-lg text-sm font-bold focus:outline-none focus:border-pink-500 bg-white ${nDiscPct !== undefined ? 'border-pink-400 bg-pink-50' : 'border-pink-200'}`} />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-500 text-xs font-bold">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-semibold block mb-1">$ Precio Oferta</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-500 text-xs">$</span>
                            <input type="number" value={nCP ?? (p.CURRENTPRICE || '')} onChange={e => { setEditCurrentPrice(v => ({ ...v, [p.$id]: e.target.value })); setEditDiscPct(v => ({ ...v, [p.$id]: '' })); }} placeholder="—"
                              className={`w-full pl-5 pr-1 py-1.5 border rounded-lg text-sm font-bold focus:outline-none focus:border-pink-500 bg-white ${hCP ? 'border-pink-400 bg-pink-50' : 'border-pink-200'}`} />
                          </div>
                          {discPct > 0 && !hCP && <p className="text-[9px] text-emerald-600 font-bold mt-0.5">-{discPct}% vs base</p>}
                        </div>
                      </div>
                      {/* Vigencia de la oferta */}
                      <div>
                        <label className="text-[10px] text-gray-500 font-semibold block mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Vigencia hasta (opcional)
                        </label>
                        <div className="flex gap-2 items-center">
                          <input type="datetime-local" value={expiryInputVal}
                            onChange={e => setEditUnitOfferExpiresAt(v => ({ ...v, [p.$id]: e.target.value }))}
                            className={`flex-1 px-2 py-1.5 border rounded-lg text-xs font-semibold focus:outline-none focus:border-pink-500 bg-white ${hExp ? 'border-pink-400 bg-pink-50' : 'border-pink-200'}`} />
                          {expiryInputVal && (
                            <button onClick={() => setEditUnitOfferExpiresAt(v => ({ ...v, [p.$id]: '' }))} className="text-[10px] text-gray-400 hover:text-red-500 font-bold px-1.5 py-1 border border-gray-200 rounded-lg">
                              ✕
                            </button>
                          )}
                        </div>
                        {hasExpiry && !isExpired && <p className="text-[9px] text-pink-600 font-semibold mt-0.5">Expira: {new Date(expiresAtMs).toLocaleString('es-CL')}</p>}
                        {isExpired && <p className="text-[9px] text-amber-600 font-semibold mt-0.5">Expiró: {new Date(expiresAtMs).toLocaleString('es-CL')}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveSingle(p.$id)} disabled={!isDirtyPanel || sv || isBulkSaving}
                          className="flex-1 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition disabled:opacity-30">
                          {sv ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          {sv ? 'Guardando...' : saveStatus[p.$id] === 'success' ? '✓ Guardado' : 'Guardar'}
                        </button>
                        <button onClick={() => { setEditCurrentPrice(v => ({ ...v, [p.$id]: '0' })); setEditDiscPct(v => ({ ...v, [p.$id]: '' })); setEditUnitOfferExpiresAt(v => ({ ...v, [p.$id]: '' })); }} disabled={sv || isBulkSaving}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg border border-red-200 transition disabled:opacity-30">
                          Quitar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filter + Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <textarea
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, SKU o lista de SKUs (separa con Enter)..."
                rows={Math.min(5, search.split('\n').length || 1)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none font-sans min-h-[38px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="w-full sm:w-48 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-pink-500">
                <option value="">Todas las Categorías</option>
                {categories.map(cat => <option key={cat.$id} value={cat.$id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex border-t border-gray-100">
            <button onClick={() => setActiveTab('withOffer')}
              className={`flex-1 py-2.5 text-sm font-semibold transition flex items-center justify-center gap-1.5 ${activeTab === 'withOffer' ? 'text-pink-700 border-b-2 border-pink-600 bg-pink-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
              <TrendingDown className="w-4 h-4" />Con Descuento
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'withOffer' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}`}>{withOfferList.length}</span>
            </button>
            <button onClick={() => setActiveTab('withoutOffer')}
              className={`flex-1 py-2.5 text-sm font-semibold transition flex items-center justify-center gap-1.5 ${activeTab === 'withoutOffer' ? 'text-gray-700 border-b-2 border-gray-500 bg-gray-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
              <Package className="w-4 h-4" />Sin Descuento
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'withoutOffer' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'}`}>{withoutOfferList.length}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border p-16 flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
            <p className="text-gray-500 text-sm">Cargando catálogo...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center text-gray-400 text-sm shadow-sm">
            {activeTab === 'withOffer' ? 'Ningún producto tiene descuento activo en esta selección.' : 'No hay productos sin descuento en esta selección.'}
          </div>
        ) : (
          <div className="space-y-3">

            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="text-left border-collapse" style={{ minWidth: 1100 }}>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 w-56">Producto</th>
                      <th className="px-3 py-3 text-right w-28">Precio Base</th>
                      <th className="px-3 py-3 text-center w-24">% Desc.<br/><span className="text-[9px] font-normal text-pink-400 normal-case">auto-calcula</span></th>
                      <th className="px-3 py-3 text-center w-28 bg-pink-50/60">$ Oferta</th>
                      <th className="px-3 py-3 text-center w-36 bg-indigo-50/40">Precio x Volumen<br/><span className="text-[9px] font-normal text-indigo-400 normal-case">desde X uds → $Y/ud</span></th>
                      <th className="px-3 py-3 text-center w-20">Stock</th>
                      <th className="px-3 py-3 text-center w-16">Activo</th>
                      <th className="px-3 py-3 text-center w-20">Acc.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visibleList.map(p => {
                      const { sv, nP, nCP, nS, nA, nD, nWP, nWQ, hP, hCP, hS, hA, hWP, hWQ, dirty, effectiveP, discPct, isActive, hasOffer, hasVolPrice, volDiscPct, handleDiscPctChange } = getRowState(p);
                      return (
                        <tr key={p.$id} className={`hover:bg-gray-50/60 transition text-sm ${dirty ? 'bg-pink-50/10' : ''}`}>
                          {/* Producto */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {p.IMAGEURL
                                ? <img src={p.IMAGEURL} alt={p.NAME} className="w-8 h-8 object-cover rounded-lg border shrink-0" />
                                : <div className="w-8 h-8 rounded-lg border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-gray-300" /></div>}
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate text-[12px] max-w-[170px]">{p.NAME}</p>
                                <div className="flex items-center gap-1 flex-wrap mt-0.5">
                                  <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded font-semibold">{getCategoryName(p.CATEGORYID)}</span>
                                  {getSku(p) && <span className="text-[9px] text-gray-400 font-mono">SKU: {getSku(p)}</span>}
                                  {!isActive && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold">INACTIVO</span>}
                                  {hasOffer && <span className="text-[9px] bg-pink-100 text-pink-600 px-1 rounded font-bold">OFERTA</span>}
                                  {hasVolPrice && <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1 rounded font-bold">VOL</span>}
                                </div>
                              </div>
                              <a href={`/productos/${p.$id}`} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition" title="Ver en tienda">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                          {/* Precio base */}
                          <td className="px-3 py-3 text-right">
                            <div className="relative inline-block">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                              <input type="number" value={nP ?? p.PRICE} onChange={e => setEditPrice(v => ({ ...v, [p.$id]: e.target.value }))}
                                className={`w-24 pl-5 pr-1 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-pink-500 bg-white ${hP ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`} />
                            </div>
                          </td>
                          {/* % desc */}
                          <td className="px-3 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <div className="relative inline-block">
                                <input type="text" inputMode="numeric" pattern="[0-9]*" value={nD ?? (discPct > 0 ? String(discPct) : '')} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); if (v === '' || (parseInt(v, 10) >= 0 && parseInt(v, 10) <= 99)) handleDiscPctChange(v); }} placeholder="—"
                                  className={`w-14 pl-2 pr-4 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-pink-500 bg-white ${nD !== undefined ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`} />
                                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-pink-400 text-xs">%</span>
                              </div>
                              {nD !== undefined && nD !== '' && (
                                <button onClick={() => handleDiscPctChange(nD)} disabled={sv || isBulkSaving} className="p-1 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition disabled:opacity-30" title="Confirmar descuento">
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                          {/* $ Oferta */}
                          <td className="px-3 py-3 text-center bg-pink-50/20">
                            <div className="relative inline-block">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-400 text-xs">$</span>
                              <input type="number" value={nCP ?? (p.CURRENTPRICE || '')} onChange={e => { setEditCurrentPrice(v => ({ ...v, [p.$id]: e.target.value })); setEditDiscPct(v => ({ ...v, [p.$id]: '' })); }} placeholder="—"
                                className={`w-28 pl-5 pr-1 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-pink-500 bg-white ${hCP ? 'border-pink-400 bg-pink-50' : hasOffer ? 'border-pink-300' : 'border-gray-200'}`} />
                            </div>
                            {hasOffer && !hCP && <p className="text-[9px] font-bold text-pink-600 mt-0.5">-{discPct}%</p>}
                          </td>
                          {/* Precio por volumen */}
                          <td className="px-2 py-2 bg-indigo-50/20">
                            <div className="flex items-center gap-1">
                              <div className="flex-1">
                                <p className="text-[9px] text-gray-400 mb-0.5 text-center">desde</p>
                                <div className="relative">
                                  <input type="number" min="2" value={nWQ ?? (p.WHOLESALEMINQUANTITY || '')} onChange={e => setEditWholesaleMinQty(v => ({ ...v, [p.$id]: e.target.value }))} placeholder="cant."
                                    className={`w-full px-1 pr-5 py-1 border rounded-lg text-center text-sm font-bold focus:outline-none focus:border-indigo-400 bg-white ${hWQ ? 'border-indigo-400 bg-indigo-50' : hasVolPrice ? 'border-indigo-300' : 'border-gray-200'}`} />
                                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-400 text-[9px]">ud</span>
                                </div>
                              </div>
                              <span className="text-gray-300 text-xs mt-3">→</span>
                              <div className="flex-1">
                                <p className="text-[9px] text-gray-400 mb-0.5 text-center">precio/ud</p>
                                <div className="relative">
                                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-indigo-400 text-[9px]">$</span>
                                  <input type="number" value={nWP ?? (p.WHOLESALEPRICE || '')} onChange={e => setEditWholesalePrice(v => ({ ...v, [p.$id]: e.target.value }))} placeholder="—"
                                    className={`w-full pl-4 pr-1 py-1 border rounded-lg text-center text-sm font-bold focus:outline-none focus:border-indigo-400 bg-white ${hWP ? 'border-indigo-400 bg-indigo-50' : hasVolPrice ? 'border-indigo-300' : 'border-gray-200'}`} />
                                </div>
                              </div>
                            </div>
                            {hasVolPrice && !hWP && !hWQ && (
                              <div className="flex flex-col items-center gap-1 mt-1">
                                <p className="text-[9px] font-bold text-indigo-600">-{volDiscPct}% desde {p.WHOLESALEMINQUANTITY} uds</p>
                                <button onClick={() => { setEditWholesalePrice(v => ({ ...v, [p.$id]: '0' })); setEditWholesaleMinQty(v => ({ ...v, [p.$id]: '0' })); }}
                                  disabled={sv || isBulkSaving}
                                  className="text-[10px] text-white bg-red-500 hover:bg-red-600 font-bold px-2 py-1 rounded-md transition disabled:opacity-30">
                                  ✕ Quitar VOL
                                </button>
                              </div>
                            )}
                          </td>
                          {/* Stock */}
                          <td className="px-3 py-3 text-center">
                            <input type="number" min="0" value={nS ?? p.STOCK} onChange={e => setEditStock(v => ({ ...v, [p.$id]: e.target.value }))}
                              className={`w-16 px-1 py-1 border rounded-lg text-center text-sm font-bold focus:outline-none focus:border-emerald-400 bg-white ${hS ? 'border-emerald-400 bg-emerald-50' : p.STOCK > 5 ? 'border-gray-200' : p.STOCK > 0 ? 'border-amber-200 text-amber-600' : 'border-red-200 text-red-500'}`} />
                          </td>
                          {/* Activo toggle */}
                          <td className="px-3 py-3 text-center">
                            <button onClick={() => setEditIsActive(v => ({ ...v, [p.$id]: !isActive }))}
                              className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-300'} ${hA ? 'ring-2 ring-pink-400' : ''}`}>
                              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'left-4' : 'left-0.5'}`} />
                            </button>
                          </td>
                          {/* Acciones */}
                          <td className="px-3 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <a href={`/productos/${p.$id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition" title="Ver en tienda">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              {dirty
                                ? <button onClick={() => handleSaveSingle(p.$id)} disabled={sv || isBulkSaving} className="p-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition disabled:opacity-50">
                                    {sv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                  </button>
                                : saveStatus[p.$id] === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                : saveStatus[p.$id] === 'error' ? <XCircle className="w-5 h-5 text-rose-500" />
                                : <span className="text-xs text-gray-300">—</span>}
                              <button onClick={() => handlePublish(p.$id)} disabled={sv || isBulkSaving || dirty} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition disabled:opacity-30" title="Publicar en /productos">
                                {publishStatus[p.$id] === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : publishStatus[p.$id] === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-3">
              {visibleList.map(p => {
                const { sv, nP, nCP, nS, nA, nD, nWP, nWQ, hP, hCP, hS, hA, hWP, hWQ, dirty, discPct, isActive, hasOffer, hasVolPrice, volDiscPct, handleDiscPctChange } = getRowState(p);
                return (
                  <div key={p.$id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${dirty ? 'border-pink-200' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                      {p.IMAGEURL
                        ? <img src={p.IMAGEURL} alt={p.NAME} className="w-12 h-12 object-cover rounded-xl border bg-gray-50 shrink-0" />
                        : <div className="w-12 h-12 rounded-xl border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-gray-300" /></div>}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{p.NAME}</p>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">{getCategoryName(p.CATEGORYID)}</span>
                          {getSku(p) && <span className="text-[10px] text-gray-400 font-mono">SKU: {getSku(p)}</span>}
                          {hasOffer && <span className="text-[10px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded font-bold">-{discPct}% OFERTA</span>}
                          {hasVolPrice && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">VOL -{volDiscPct}%</span>}
                          {!isActive && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">INACTIVO</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a href={`/productos/${p.$id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition" title="Ver en tienda">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => setEditIsActive(v => ({ ...v, [p.$id]: !isActive }))}
                          className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-300'} ${hA ? 'ring-2 ring-pink-400' : ''}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'left-4' : 'left-0.5'}`} />
                        </button>
                        {dirty && (
                          <button onClick={() => handleSaveSingle(p.$id)} disabled={sv || isBulkSaving} className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition">
                            {sv ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}Guardar
                          </button>
                        )}
                        {saveStatus[p.$id] === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      </div>
                    </div>
                    <div className="p-3 space-y-3">
                      {/* Precios individuales */}
                      <div className="bg-pink-50/50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Precio individual</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">Precio base</p>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                              <input type="number" value={nP ?? p.PRICE} onChange={e => setEditPrice(v => ({ ...v, [p.$id]: e.target.value }))} className={`w-full pl-5 pr-1 py-1.5 border rounded-lg text-sm font-semibold focus:outline-none focus:border-pink-500 bg-white ${hP ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`} />
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">% descuento</p>
                            <div className="flex items-center gap-1">
                              <div className="relative flex-1">
                                <input type="text" inputMode="numeric" pattern="[0-9]*" value={nD ?? (discPct > 0 ? String(discPct) : '')} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); if (v === '' || (parseInt(v, 10) >= 0 && parseInt(v, 10) <= 99)) handleDiscPctChange(v); }} placeholder="—" className={`w-full pl-2 pr-5 py-1.5 border rounded-lg text-sm font-semibold focus:outline-none focus:border-pink-500 bg-white ${nD !== undefined ? 'border-pink-400 bg-pink-50' : 'border-gray-200'}`} />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-400 text-xs">%</span>
                              </div>
                              {nD !== undefined && nD !== '' && (
                                <button onClick={() => handleDiscPctChange(nD)} disabled={sv || isBulkSaving} className="p-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition disabled:opacity-30" title="Confirmar descuento">
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">$ Oferta</p>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-400 text-xs">$</span>
                              <input type="number" value={nCP ?? (p.CURRENTPRICE || '')} onChange={e => { setEditCurrentPrice(v => ({ ...v, [p.$id]: e.target.value })); setEditDiscPct(v => ({ ...v, [p.$id]: '' })); }} placeholder="—" className={`w-full pl-5 pr-1 py-1.5 border rounded-lg text-sm font-semibold focus:outline-none focus:border-pink-500 bg-white ${hCP ? 'border-pink-400 bg-pink-50' : hasOffer ? 'border-pink-300' : 'border-gray-200'}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Precio por volumen */}
                      <div className={`rounded-xl p-3 ${hasVolPrice ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-gray-50 border border-gray-100'}`}>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                          <Users className="w-3 h-3 text-indigo-500" />
                          Precio por Cantidad
                          {hasVolPrice && <span className="text-[9px] text-indigo-600 font-bold ml-auto">-{volDiscPct}% desde {p.WHOLESALEMINQUANTITY} uds</span>}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">Cantidad mínima</p>
                            <div className="relative">
                              <input type="number" min="2" value={nWQ ?? (p.WHOLESALEMINQUANTITY || '')} onChange={e => setEditWholesaleMinQty(v => ({ ...v, [p.$id]: e.target.value }))} placeholder="ej: 3"
                                className={`w-full pl-2 pr-6 py-1.5 border rounded-lg text-sm font-bold focus:outline-none focus:border-indigo-400 bg-white ${hWQ ? 'border-indigo-400 bg-indigo-50' : hasVolPrice ? 'border-indigo-300' : 'border-gray-200'}`} />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 text-xs">uds</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 mb-1">Precio por unidad</p>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400 text-xs">$</span>
                              <input type="number" value={nWP ?? (p.WHOLESALEPRICE || '')} onChange={e => setEditWholesalePrice(v => ({ ...v, [p.$id]: e.target.value }))} placeholder="—"
                                className={`w-full pl-5 pr-1 py-1.5 border rounded-lg text-sm font-bold focus:outline-none focus:border-indigo-400 bg-white ${hWP ? 'border-indigo-400 bg-indigo-50' : hasVolPrice ? 'border-indigo-300' : 'border-gray-200'}`} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-[9px] text-gray-400">Al comprar {nWQ ?? (p.WHOLESALEMINQUANTITY || 'X')}+ unidades, el precio baja automáticamente a este valor.</p>
                          {hasVolPrice && (
                            <button onClick={() => { setEditWholesalePrice(v => ({ ...v, [p.$id]: '0' })); setEditWholesaleMinQty(v => ({ ...v, [p.$id]: '0' })); }}
                              disabled={sv || isBulkSaving}
                              className="text-[10px] text-red-500 hover:text-red-600 font-bold px-2 py-1 border border-red-200 rounded-lg transition disabled:opacity-30 shrink-0">
                              Quitar VOL
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Stock */}
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">Stock</label>
                        <input type="number" min="0" value={nS ?? p.STOCK} onChange={e => setEditStock(v => ({ ...v, [p.$id]: e.target.value }))} className={`w-full px-3 py-2 border rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-400 bg-white ${hS ? 'border-emerald-400 bg-emerald-50' : p.STOCK > 5 ? 'border-gray-200' : p.STOCK > 0 ? 'border-amber-200' : 'border-red-200'}`} />
                      </div>
                      <button onClick={() => handlePublish(p.$id)} disabled={sv || isBulkSaving || dirty} className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-pink-200 transition disabled:opacity-40">
                        {publishStatus[p.$id] === 'loading' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Publicando...</>
                          : publishStatus[p.$id] === 'success' ? <><CheckCircle2 className="w-3.5 h-3.5" />¡Publicado!</>
                          : <><Zap className="w-3.5 h-3.5" />Publicar en /productos</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cargar más */}
            {visibleCount < currentList.length && (
              <div className="flex flex-col items-center gap-1 pt-2">
                <button
                  onClick={() => setVisibleCount(n => n + 10)}
                  className="px-6 py-2.5 bg-white border border-pink-200 hover:bg-pink-50 text-pink-700 text-sm font-bold rounded-2xl transition shadow-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Ver 10 más ({visibleCount}/{currentList.length})
                </button>
                <button onClick={() => setVisibleCount(currentList.length)} className="text-xs text-gray-400 hover:text-pink-500 font-semibold transition">
                  Ver todos ({currentList.length})
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
