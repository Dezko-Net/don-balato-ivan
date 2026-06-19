'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import { 
  ArrowLeft, Search, Package, Save, CheckCircle2, XCircle, Loader2, 
  Filter, Boxes, Layers, AlertCircle, Undo2, RefreshCw, Database, Zap,
  Clock, Flame, AlertTriangle
} from 'lucide-react';
import { 
  getServices, 
  getAppwriteConfig, 
  PRODUCTS_COLLECTION_ID, 
  CATEGORIES_COLLECTION_ID 
} from '@/lib/appwrite-admin';
import { Product, Category } from '@/types/admin';

const PRODUCTS_CACHE_KEY = 'yaxsel_pormayor_products_cache';
const CATEGORIES_CACHE_KEY = 'yaxsel_pormayor_categories_cache';
const CACHE_TIME_KEY = 'yaxsel_pormayor_cache_time';

function fmtCountdown(ms: number): string {
  if (ms <= 0) return 'Expirada';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  if (h >= 48) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${String(h).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

function getSku(p: Product): string {
  const featMatch = (typeof p.FEATURES === 'string') ? p.FEATURES.match(/SKU:\s*(.+)/i) : null;
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
  
  // Cache info
  const [cacheTime, setCacheTime] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  
  // States for inline editing (local memory, no network requests while typing)
  const [editPackQty, setEditPackQty] = useState<Record<string, string>>({});
  const [editWholesalePrice, setEditWholesalePrice] = useState<Record<string, string>>({});
  const [editStock, setEditStock] = useState<Record<string, string>>({});
  const [editPackStock, setEditPackStock] = useState<Record<string, string>>({});
  const [editPackMinPacks, setEditPackMinPacks] = useState<Record<string, string>>({});
  const [editPackDiscountPct, setEditPackDiscountPct] = useState<Record<string, string>>({});
  const [editPackOfferPrice, setEditPackOfferPrice] = useState<Record<string, string>>({});
  const [editPackOfferExpiresAt, setEditPackOfferExpiresAt] = useState<Record<string, string>>({});
  const [editPackOfferMinPacks, setEditPackOfferMinPacks] = useState<Record<string, string>>({});
  // % de descuento para ofertas del día (calculado sobre WHOLESALEPRICE o PRICE)
  const [editPackOfferDiscPct, setEditPackOfferDiscPct] = useState<Record<string, string>>({}); 
  
  // Batch saving states
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [bulkErrorLog, setBulkErrorLog] = useState<string[]>([]);
  
  // Individual status (for visual feedback)
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({});

  // Publish-to-paquetes status per product
  const [publishStatus, setPublishStatus] = useState<Record<string, 'loading' | 'success' | 'error' | null>>({});

  // Yollgo import state
  const [yollgoLoading, setYollgoLoading] = useState(false);
  const [yollgoResult, setYollgoResult] = useState<{ matched: number; updated: number; newProducts: number; notFound: number; details: { sku: string; name: string; oldQty: number; newQty: number; status: 'new' | 'updated' }[] } | null>(null);

  const [activeTab, setActiveTab] = useState<'packed' | 'unpacked'>('packed');
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);

  // Function to load fresh data from Appwrite
  const loadFreshData = async () => {
    setLoading(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      // Load categories
      const catResp = await databases.listDocuments(databaseId, CATEGORIES_COLLECTION_ID, [Query.limit(100)]);
      const freshCats = catResp.documents as unknown as Category[];
      setCategories(freshCats);

      // Load all products
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

      // Save to localStorage cache
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

  // Initial load check cache first
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
      } catch (err) {
        console.warn('Failed to parse cached data, fetching fresh:', err);
        loadFreshData();
      }
    } else {
      loadFreshData();
    }
  }, []);

  // Sync state modifications to cache
  const updateCacheLocally = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(updatedProducts));
      const nowStr = new Date().toLocaleString('es-CL') + ' (Actualizado)';
      localStorage.setItem(CACHE_TIME_KEY, nowStr);
      setCacheTime(nowStr);
    } catch (e) {
      console.error('Failed to sync cache locally:', e);
    }
  };

  // Determine modified product IDs
  const msToDatetimeLocal = (ms?: number) => {
    if (!ms) return '';
    const d = new Date(ms);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  const modifiedIds = Array.from(new Set([
    ...Object.keys(editPackQty),
    ...Object.keys(editWholesalePrice),
    ...Object.keys(editStock),
    ...Object.keys(editPackMinPacks),
    ...Object.keys(editPackDiscountPct),
    ...Object.keys(editPackOfferPrice),
    ...Object.keys(editPackOfferExpiresAt),
    ...Object.keys(editPackOfferMinPacks),
    ...Object.keys(editPackStock),
  ])).filter(id => {
    const prod = products.find(p => p.$id === id);
    if (!prod) return false;
    
    const newQtyStr = editPackQty[id];
    const newWholesaleStr = editWholesalePrice[id];
    const newStockStr = editStock[id];
    const newPackStockStr = editPackStock[id];
    const newMinPacksStr = editPackMinPacks[id];
    const newDiscPctStr = editPackDiscountPct[id];
    const newOfferPriceStr = editPackOfferPrice[id];
    const newOfferExpiresStr = editPackOfferExpiresAt[id];
    const newOfferMinPacksStr = editPackOfferMinPacks[id];
    
    const qtyChanged = newQtyStr !== undefined && parseInt(newQtyStr, 10) !== (prod.PACKQTY || 0);
    const wholesaleChanged = newWholesaleStr !== undefined && parseInt(newWholesaleStr, 10) !== (prod.WHOLESALEPRICE || 0);
    const stockChanged = newStockStr !== undefined && parseInt(newStockStr, 10) !== (prod.STOCK || 0);
    const packStockChanged = newPackStockStr !== undefined && parseInt(newPackStockStr, 10) !== (prod.PACK_STOCK || 0);
    const minPacksChanged = newMinPacksStr !== undefined && parseInt(newMinPacksStr, 10) !== (prod.PACK_MIN_PACKS || 0);
    const discPctChanged = newDiscPctStr !== undefined && parseInt(newDiscPctStr, 10) !== (prod.PACK_DISCOUNT_PCT || 0);
    const offerPriceChanged = newOfferPriceStr !== undefined && parseInt(newOfferPriceStr, 10) !== (prod.PACK_OFFER_PRICE || 0);
    const offerExpiresChanged = newOfferExpiresStr !== undefined && (newOfferExpiresStr === '' ? (prod.PACK_OFFER_EXPIRES_AT || 0) !== 0 : new Date(newOfferExpiresStr).getTime() !== (prod.PACK_OFFER_EXPIRES_AT || 0));
    const offerMinPacksChanged = newOfferMinPacksStr !== undefined && parseInt(newOfferMinPacksStr, 10) !== (prod.PACK_OFFER_MIN_PACKS || 0);
    
    return qtyChanged || wholesaleChanged || stockChanged || packStockChanged || minPacksChanged || discPctChanged || offerPriceChanged || offerExpiresChanged || offerMinPacksChanged;
  });

  // Save changes of a single product
  const handleSaveSingle = async (productId: string) => {
    const prod = products.find(p => p.$id === productId);
    if (!prod) return;

    const rawQty = editPackQty[productId];
    const rawWholesale = editWholesalePrice[productId];
    const rawStock = editStock[productId];
    const rawPackStock = editPackStock[productId];
    const rawMinPacks = editPackMinPacks[productId];
    const rawDiscPct = editPackDiscountPct[productId];
    const rawOfferPrice = editPackOfferPrice[productId];
    const rawOfferExpires = editPackOfferExpiresAt[productId];
    const rawOfferMinPacks = editPackOfferMinPacks[productId];

    const updateData: Record<string, any> = {};
    if (rawQty !== undefined) {
      const parsed = parseInt(rawQty, 10);
      updateData.PACKQTY = isNaN(parsed) ? 0 : parsed;
    }
    if (rawWholesale !== undefined) {
      const parsed = parseInt(rawWholesale, 10);
      updateData.WHOLESALEPRICE = isNaN(parsed) ? 0 : parsed;
    }
    if (rawStock !== undefined) {
      const parsed = parseInt(rawStock, 10);
      updateData.STOCK = isNaN(parsed) ? 0 : parsed;
    }
    if (rawPackStock !== undefined) {
      const parsed = parseInt(rawPackStock, 10);
      updateData.PACK_STOCK = isNaN(parsed) ? 0 : parsed;
    }
    if (rawMinPacks !== undefined) {
      const parsed = parseInt(rawMinPacks, 10);
      updateData.PACK_MIN_PACKS = isNaN(parsed) ? 0 : parsed;
    }
    if (rawDiscPct !== undefined) {
      const parsed = parseInt(rawDiscPct, 10);
      updateData.PACK_DISCOUNT_PCT = isNaN(parsed) ? 0 : Math.min(parsed, 99);
    }
    if (rawOfferPrice !== undefined) {
      const parsed = parseInt(rawOfferPrice, 10);
      updateData.PACK_OFFER_PRICE = isNaN(parsed) ? 0 : parsed;
    }
    if (rawOfferExpires !== undefined) {
      updateData.PACK_OFFER_EXPIRES_AT = rawOfferExpires === '' ? 0 : new Date(rawOfferExpires).getTime();
    }
    if (rawOfferMinPacks !== undefined) {
      const parsed = parseInt(rawOfferMinPacks, 10);
      updateData.PACK_OFFER_MIN_PACKS = isNaN(parsed) ? 0 : parsed;
    }

    // Si la oferta queda vigente (precio>0 y vence en el futuro) y el producto está
    // inactivo, lo activamos para que se vea en /paquetes y /productos.
    {
      const effOfferPrice = updateData.PACK_OFFER_PRICE !== undefined ? updateData.PACK_OFFER_PRICE : (prod.PACK_OFFER_PRICE || 0);
      const effExpires = updateData.PACK_OFFER_EXPIRES_AT !== undefined ? updateData.PACK_OFFER_EXPIRES_AT : (prod.PACK_OFFER_EXPIRES_AT || 0);
      if (effOfferPrice > 0 && effExpires > Date.now() && prod.ISACTIVE === false) {
        updateData.ISACTIVE = true;
      }
    }

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
      
      setEditPackQty(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditWholesalePrice(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditStock(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditPackMinPacks(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditPackDiscountPct(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditPackStock(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditPackOfferPrice(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditPackOfferExpiresAt(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditPackOfferMinPacks(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setEditPackOfferDiscPct(prev => { const n = { ...prev }; delete n[productId]; return n; });
      
      setSaveStatus(prev => ({ ...prev, [productId]: 'success' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [productId]: null }));
      }, 2000);

      // Auto-revalidate Next.js cache so /paquetes reflects changes
      try { await fetch('/api/revalidate?tag=products'); } catch {}
    } catch (err) {
      console.error('Error updating product:', err);
      setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));
    } finally {
      setSavingId(null);
    }
  };

  // Batch Save all changes "de un tirón"
  const handleSaveAll = async () => {
    if (modifiedIds.length === 0) return;
    
    setIsBulkSaving(true);
    setBulkProgress({ current: 0, total: modifiedIds.length });
    setBulkErrorLog([]);

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    
    const errors: string[] = [];
    const successfulUpdates: Record<string, Record<string, any>> = {};

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < modifiedIds.length; i++) {
      const id = modifiedIds[i];
      const prod = products.find(p => p.$id === id);
      if (!prod) continue;

      const rawQty = editPackQty[id];
      const rawWholesale = editWholesalePrice[id];
      const rawStock = editStock[id];
      const rawPackStock = editPackStock[id];
      const rawMinPacks = editPackMinPacks[id];
      const rawDiscPct = editPackDiscountPct[id];
      const rawOfferPrice = editPackOfferPrice[id];
      const rawOfferExpires = editPackOfferExpiresAt[id];
      const rawOfferMinPacks = editPackOfferMinPacks[id];

      const updateData: Record<string, any> = {};
      if (rawQty !== undefined) {
        const parsed = parseInt(rawQty, 10);
        updateData.PACKQTY = isNaN(parsed) ? 0 : parsed;
      }
      if (rawWholesale !== undefined) {
        const parsed = parseInt(rawWholesale, 10);
        updateData.WHOLESALEPRICE = isNaN(parsed) ? 0 : parsed;
      }
      if (rawStock !== undefined) {
        const parsed = parseInt(rawStock, 10);
        updateData.STOCK = isNaN(parsed) ? 0 : parsed;
      }
      if (rawPackStock !== undefined) {
        const parsed = parseInt(rawPackStock, 10);
        updateData.PACK_STOCK = isNaN(parsed) ? 0 : parsed;
      }
      if (rawMinPacks !== undefined) {
        const parsed = parseInt(rawMinPacks, 10);
        updateData.PACK_MIN_PACKS = isNaN(parsed) ? 0 : parsed;
      }
      if (rawDiscPct !== undefined) {
        const parsed = parseInt(rawDiscPct, 10);
        updateData.PACK_DISCOUNT_PCT = isNaN(parsed) ? 0 : Math.min(parsed, 99);
      }
      if (rawOfferPrice !== undefined) {
        const parsed = parseInt(rawOfferPrice, 10);
        updateData.PACK_OFFER_PRICE = isNaN(parsed) ? 0 : parsed;
      }
      if (rawOfferExpires !== undefined) {
        updateData.PACK_OFFER_EXPIRES_AT = rawOfferExpires === '' ? 0 : new Date(rawOfferExpires).getTime();
      }
      if (rawOfferMinPacks !== undefined) {
        const parsed = parseInt(rawOfferMinPacks, 10);
        updateData.PACK_OFFER_MIN_PACKS = isNaN(parsed) ? 0 : parsed;
      }

      // Auto-activar si la oferta queda vigente y el producto está inactivo.
      {
        const effOfferPrice = updateData.PACK_OFFER_PRICE !== undefined ? updateData.PACK_OFFER_PRICE : (prod.PACK_OFFER_PRICE || 0);
        const effExpires = updateData.PACK_OFFER_EXPIRES_AT !== undefined ? updateData.PACK_OFFER_EXPIRES_AT : (prod.PACK_OFFER_EXPIRES_AT || 0);
        if (effOfferPrice > 0 && effExpires > Date.now() && prod.ISACTIVE === false) {
          updateData.ISACTIVE = true;
        }
      }

      if (Object.keys(updateData).length === 0) {
        setBulkProgress(prev => ({ ...prev, current: i + 1 }));
        continue;
      }

      try {
        setSavingId(id);
        await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, id, updateData);
        successfulUpdates[id] = updateData;
      } catch (err: any) {
        console.error(`Error batch updating ${prod.NAME}:`, err);
        errors.push(`${prod.NAME} (${getSku(prod)}): ${err.message || 'Error desconocido'}`);
      } finally {
        setSavingId(null);
        setBulkProgress(prev => ({ ...prev, current: i + 1 }));
        await delay(100);
      }
    }

    // Apply all successful updates to local state
    const updated = products.map(p => {
      const update = successfulUpdates[p.$id];
      return update ? { ...p, ...update } : p;
    });
    setProducts(updated);
    updateCacheLocally(updated);

    // Clear edit inputs for successfully updated products
    setEditPackQty(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditWholesalePrice(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditStock(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditPackMinPacks(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditPackDiscountPct(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditPackStock(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditPackOfferPrice(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditPackOfferExpiresAt(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });
    setEditPackOfferMinPacks(prev => {
      const n = { ...prev };
      Object.keys(successfulUpdates).forEach(id => delete n[id]);
      return n;
    });

    setBulkErrorLog(errors);
    setIsBulkSaving(false);

    // Auto-revalidate Next.js cache so /paquetes reflects changes
    if (Object.keys(successfulUpdates).length > 0) {
      try { await fetch('/api/revalidate?tag=products'); } catch {}
    }

    if (errors.length === 0) {
      alert(`¡Éxito! Se guardaron los cambios de ${modifiedIds.length} productos correctamente.`);
    } else {
      alert(`Se guardaron algunos cambios, pero ocurrieron ${errors.length} errores. Revisa la consola o la lista de errores.`);
    }
  };

  // Revalidate Next.js cache so /paquetes shows the updated price
  const handlePublishToPaquetes = async (productId: string) => {
    setPublishStatus(prev => ({ ...prev, [productId]: 'loading' }));
    try {
      const res = await fetch('/api/revalidate?tag=products');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPublishStatus(prev => ({ ...prev, [productId]: 'success' }));
      setTimeout(() => setPublishStatus(prev => ({ ...prev, [productId]: null })), 3000);
    } catch (err) {
      console.error('Error revalidating cache:', err);
      setPublishStatus(prev => ({ ...prev, [productId]: 'error' }));
      setTimeout(() => setPublishStatus(prev => ({ ...prev, [productId]: null })), 3000);
    }
  };

  // Import PACKQTY from Yollgo scraped data
  const handleYollgoImport = async () => {
    setYollgoLoading(true);
    setYollgoResult(null);
    try {
      const resp = await fetch('/api/yollgo/pack-qty');
      if (!resp.ok) {
        const err = await resp.json();
        alert(err.error || 'Error al cargar datos de Yollgo');
        setYollgoLoading(false);
        return;
      }
      const data = await resp.json();
      const mapping: Record<string, { packQty: number; boxQty: number; name: string }> = data.mapping;

      const details: { sku: string; name: string; oldQty: number; newQty: number; status: 'new' | 'updated' }[] = [];
      let matched = 0, updated = 0, newProducts = 0, notFound = 0;
      const newEdits: Record<string, string> = {};

      for (const p of products) {
        const sku = getSku(p).trim().toUpperCase();
        if (!sku) { notFound++; continue; }

        const yollgoData = mapping[sku];
        if (!yollgoData) { notFound++; continue; }

        matched++;
        const oldQty = p.PACKQTY || 0;
        const newQty = yollgoData.packQty;

        if (oldQty !== newQty) {
          newEdits[p.$id] = String(newQty);
          if (oldQty > 0) {
            updated++;
            details.push({ sku, name: p.NAME, oldQty, newQty, status: 'updated' });
          } else {
            newProducts++;
            details.push({ sku, name: p.NAME, oldQty, newQty, status: 'new' });
          }
        }
      }

      setEditPackQty(prev => ({ ...prev, ...newEdits }));
      setYollgoResult({ matched, updated, newProducts, notFound, details: details.slice(0, 50) });
    } catch (err: any) {
      console.error('Error importing from Yollgo:', err);
      alert('Error: ' + err.message);
    } finally {
      setYollgoLoading(false);
    }
  };

  const handleDiscardAll = () => {
    if (confirm('¿Estás seguro de que deseas descartar todos tus cambios pendientes locales?')) {
      setEditPackQty({});
      setEditWholesalePrice({});
      setEditStock({});
      setEditPackMinPacks({});
      setEditPackDiscountPct({});
      setEditPackOfferPrice({});
      setEditPackOfferExpiresAt({});
      setEditPackOfferMinPacks({});
      setEditPackStock({});
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const offersList = useMemo(() => products.filter(p => p.PACK_OFFER_PRICE && p.PACK_OFFER_EXPIRES_AT && p.PACK_OFFER_EXPIRES_AT > Date.now()), [products, tick]);
  const expiredOffersList = useMemo(() => products.filter(p => p.PACK_OFFER_PRICE && p.PACK_OFFER_EXPIRES_AT && p.PACK_OFFER_EXPIRES_AT <= Date.now()), [products]);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const nameMatch = p.NAME.toLowerCase().includes(q);
    const skuMatch = getSku(p).toLowerCase().includes(q);
    const categoryMatch = !catFilter || p.CATEGORYID === catFilter;
    return (nameMatch || skuMatch) && categoryMatch;
  });

  // Group filtered lists by PACKQTY
  const withUnitsList = filtered.filter(p => {
    const editedQty = editPackQty[p.$id];
    if (editedQty !== undefined) return parseInt(editedQty, 10) > 0;
    return p.PACKQTY && p.PACKQTY > 0;
  });

  const withoutPackagingList = filtered.filter(p => {
    const editedQty = editPackQty[p.$id];
    if (editedQty !== undefined) return !editedQty || parseInt(editedQty, 10) <= 0;
    return !p.PACKQTY || p.PACKQTY <= 0;
  });

  const totalWithUnitsAll = products.filter(p => {
    const editedQty = editPackQty[p.$id];
    if (editedQty !== undefined) return parseInt(editedQty, 10) > 0;
    return p.PACKQTY && p.PACKQTY > 0;
  }).length;

  const totalWithoutPackagingAll = products.filter(p => {
    const editedQty = editPackQty[p.$id];
    if (editedQty !== undefined) return !editedQty || parseInt(editedQty, 10) <= 0;
    return !p.PACKQTY || p.PACKQTY <= 0;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Floating bar */}
      {modifiedIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-5 border border-gray-700 max-w-[calc(100vw-1.5rem)] w-full sm:w-auto">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Sin guardar</p>
            <p className="text-xs sm:text-sm font-bold text-indigo-400">{modifiedIds.length} producto{modifiedIds.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button onClick={handleDiscardAll} disabled={isBulkSaving} className="px-3 py-1.5 hover:bg-gray-800 text-gray-300 text-xs font-semibold rounded-xl border border-gray-700 transition flex items-center gap-1">
              <Undo2 className="w-3.5 h-3.5" /> Descartar
            </button>
            <button onClick={handleSaveAll} disabled={isBulkSaving} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5">
              {isBulkSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />{bulkProgress.current}/{bulkProgress.total}</> : <><Save className="w-3.5 h-3.5" />Guardar Todo</>}
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
              <Boxes className="w-6 h-6 text-indigo-600" />
              Por Mayor
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Control de paquetes, precios mayoristas y ofertas del día</p>
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
          <button onClick={handleYollgoImport} disabled={yollgoLoading || loading || isBulkSaving}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50">
            {yollgoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span className="hidden sm:inline">Importar Yollgo</span>
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

      {/* Yollgo import result */}
      {yollgoResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Importación desde Yollgo
            </div>
            <button onClick={() => setYollgoResult(null)} className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold">Cerrar</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="bg-white rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Coincidencias</p>
              <p className="text-xl font-bold text-emerald-600">{yollgoResult.matched}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Nuevos</p>
              <p className="text-xl font-bold text-blue-600">{yollgoResult.newProducts}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Corregidos</p>
              <p className="text-xl font-bold text-amber-600">{yollgoResult.updated}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Sin match</p>
              <p className="text-xl font-bold text-gray-400">{yollgoResult.notFound}</p>
            </div>
          </div>
          {yollgoResult.details.length > 0 && (
            <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
              <div className="px-3 py-2 bg-emerald-50 border-b border-emerald-100 text-xs font-bold text-emerald-800">
                Cambios aplicados ({yollgoResult.details.length}{yollgoResult.details.length === 50 ? '+' : ''})
              </div>
              <div className="max-h-48 overflow-y-auto">
                {yollgoResult.details.map((d, i) => (
                  <div key={i} className="px-3 py-2 border-b border-gray-50 flex items-center gap-3 text-xs">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${d.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {d.status === 'new' ? 'NUEVO' : 'CORREGIDO'}
                    </span>
                    <span className="font-mono text-gray-500 shrink-0">{d.sku}</span>
                    <span className="text-gray-700 truncate flex-1">{d.name}</span>
                    <span className="text-gray-400 shrink-0">{d.oldQty || 0} → <span className="font-bold text-emerald-600">{d.newQty}</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-emerald-700 mt-2">
            Los cambios están pendientes. Revisa y presiona <strong>Guardar Todo</strong> para aplicarlos a Appwrite.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Total Catálogo</span><Layers className="w-4 h-4 text-indigo-400" /></div>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">productos en sistema</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Con Paquete</span><Package className="w-4 h-4 text-emerald-400" /></div>
          <p className="text-2xl font-bold text-emerald-600">{totalWithUnitsAll}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">mayoristas configurados</p>
        </div>
        <div className={`bg-white rounded-2xl border p-4 shadow-sm ${offersList.length > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Ofertas Activas</span><Flame className={`w-4 h-4 ${offersList.length > 0 ? 'text-orange-500' : 'text-gray-300'}`} /></div>
          <p className={`text-2xl font-bold ${offersList.length > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{offersList.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{expiredOffersList.length > 0 ? `${expiredOffersList.length} expirada(s)` : 'ahora mismo'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-500">Sin Configurar</span><AlertTriangle className="w-4 h-4 text-amber-400" /></div>
          <p className="text-2xl font-bold text-amber-500">{totalWithoutPackagingAll}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">falta asignar embalaje</p>
        </div>
      </div>

      {/* Active Offers Panel */}
      {(offersList.length > 0 || expiredOffersList.length > 0) && (
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 flex items-center gap-2 flex-wrap">
            <Flame className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-gray-900 text-sm">Ofertas del Día — Tiempo Limitado</h2>
            {(() => { const n = offersList.filter(p => p.ISACTIVE !== false).length; return n > 0 ? <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">{n} activa{n !== 1 ? 's' : ''}</span> : null; })()}
          </div>
          <div className="p-4">
            {offersList.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No hay ofertas activas ahora.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {offersList.map(p => {
                const msLeft = (p.PACK_OFFER_EXPIRES_AT || 0) - Date.now();
                const isUrgent = msLeft < 3_600_000;
                const svO = savingId === p.$id;
                const nOP2 = editPackOfferPrice[p.$id];
                const nOE2 = editPackOfferExpiresAt[p.$id];
                const nODiscPct = editPackOfferDiscPct[p.$id];
                const hOP2 = nOP2 !== undefined && parseInt(nOP2, 10) !== (p.PACK_OFFER_PRICE || 0);
                const hOE2 = nOE2 !== undefined && (nOE2 === '' ? (p.PACK_OFFER_EXPIRES_AT || 0) !== 0 : new Date(nOE2).getTime() !== (p.PACK_OFFER_EXPIRES_AT || 0));
                const dirtyO = hOP2 || hOE2;
                const baseUnitPrice = p.WHOLESALEPRICE || p.PRICE;
                const offerPack = (p.PACK_OFFER_PRICE || 0) * (p.PACKQTY || 1);
                const normalPack = baseUnitPrice * (p.PACKQTY || 1);
                const discPct = normalPack > 0 ? Math.round((1 - offerPack / normalPack) * 100) : 0;

                // Cuando el usuario escribe un %, auto-calcula el precio
                const handleOfferDiscPctChange = (val: string) => {
                  setEditPackOfferDiscPct(v => ({...v, [p.$id]: val}));
                  const pct = parseInt(val, 10);
                  if (!isNaN(pct) && pct > 0 && pct <= 99 && baseUnitPrice > 0) {
                    const calcPrice = Math.round(baseUnitPrice * (1 - pct / 100));
                    setEditPackOfferPrice(v => ({...v, [p.$id]: String(calcPrice)}));
                  }
                };
                return (
                  <div key={p.$id} className={`rounded-xl border p-3 space-y-2 ${isUrgent ? 'border-red-200 bg-red-50/20' : 'border-orange-100 bg-orange-50/20'}`}>
                    <div className="flex items-center gap-3">
                      {p.IMAGEURL
                        ? <img src={p.IMAGEURL} alt={p.NAME} className="w-10 h-10 object-cover rounded-lg border bg-gray-100 shrink-0" />
                        : <div className="w-10 h-10 rounded-lg border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-gray-300" /></div>}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{p.NAME}</p>
                        <p className="text-[10px] text-gray-500">{p.PACKQTY} uds/paq · <span className={`font-bold ${isUrgent?'text-red-500':'text-orange-500'}`}>{fmtCountdown(msLeft)}</span></p>
                        {p.ISACTIVE === false && <p className="text-[10px] text-red-600 font-bold mt-0.5">⚠️ Inactivo — guarda para activarlo y que se vea</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500 font-semibold block mb-1">% Descuento</label>
                        <div className="relative">
                          <input type="number" min="1" max="99" value={nODiscPct ?? (discPct > 0 ? String(discPct) : '')} onChange={e => handleOfferDiscPctChange(e.target.value)} placeholder="ej: 15" className={`w-full pl-2 pr-5 py-1.5 border rounded-lg text-sm font-bold focus:outline-none focus:border-amber-500 bg-white ${nODiscPct !== undefined ? 'border-amber-400 bg-amber-50' : 'border-orange-200'}`}/>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 text-xs font-bold">%</span>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-0.5">Sobre precio mayor</p>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-semibold block mb-1">$ Oferta / ud</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-500 text-xs">$</span>
                          <input type="number" value={nOP2 ?? (p.PACK_OFFER_PRICE || '')} onChange={e => { setEditPackOfferPrice(v => ({...v, [p.$id]: e.target.value})); setEditPackOfferDiscPct(v => ({...v, [p.$id]: ''})); }} placeholder="—" className={`w-full pl-5 pr-1 py-1.5 border rounded-lg text-sm font-bold focus:outline-none focus:border-amber-500 bg-white ${hOP2 ? 'border-amber-400 bg-amber-50' : 'border-orange-200'}`}/>
                        </div>
                        {discPct > 0 && !hOP2 && <p className="text-[9px] text-emerald-600 font-bold mt-0.5">-{discPct}% vs mayor</p>}
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-semibold block mb-1">Vence el</label>
                        <input type="datetime-local" value={nOE2 ?? msToDatetimeLocal(p.PACK_OFFER_EXPIRES_AT)} onChange={e => setEditPackOfferExpiresAt(v => ({...v, [p.$id]: e.target.value}))} className={`w-full px-2 py-1.5 border rounded-lg text-[11px] font-semibold focus:outline-none focus:border-amber-500 bg-white ${hOE2 ? 'border-amber-400 bg-amber-50' : 'border-orange-200'}`}/>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveSingle(p.$id)} disabled={!dirtyO || svO || isBulkSaving}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition disabled:opacity-30">
                        {svO ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3"/>}
                        {svO ? 'Guardando...' : saveStatus[p.$id]==='success' ? '✓ Guardado' : 'Guardar'}
                      </button>
                      <button onClick={() => { setEditPackOfferExpiresAt(v => ({...v, [p.$id]: ''})); setEditPackOfferPrice(v => ({...v, [p.$id]: '0'})); setEditPackOfferDiscPct(v => ({...v, [p.$id]: ''})); }}
                        disabled={svO || isBulkSaving}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg border border-red-200 transition disabled:opacity-30">
                        Quitar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {expiredOffersList.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-bold text-red-500 mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Expiradas — limpia la fecha para desactivarlas:</p>
                <div className="flex flex-wrap gap-2">
                  {expiredOffersList.map(p => <span key={p.$id} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg border border-red-100 font-medium">{p.NAME}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter + Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o SKU..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="w-full sm:w-48 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-500">
              <option value="">Todas las Categorías</option>
              {categories.map(cat => <option key={cat.$id} value={cat.$id}>{cat.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex border-t border-gray-100">
          <button onClick={() => setActiveTab('packed')}
            className={`flex-1 py-2.5 text-sm font-semibold transition flex items-center justify-center gap-1.5 ${activeTab === 'packed' ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
            <Package className="w-4 h-4" />Con Paquete
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'packed' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{withUnitsList.length}</span>
          </button>
          <button onClick={() => setActiveTab('unpacked')}
            className={`flex-1 py-2.5 text-sm font-semibold transition flex items-center justify-center gap-1.5 ${activeTab === 'unpacked' ? 'text-amber-700 border-b-2 border-amber-500 bg-amber-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
            <AlertTriangle className="w-4 h-4" />Sin Configurar
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'unpacked' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{withoutPackagingList.length}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-16 flex flex-col items-center justify-center space-y-3 shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-500 text-sm">Cargando catálogo...</p>
        </div>
      ) : activeTab === 'packed' ? (
        withUnitsList.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center text-gray-400 text-sm shadow-sm">No hay productos con embalaje en esta selección.</div>
        ) : (
        <div className="space-y-3">
          
          {/* Desktop table - packed */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="text-left border-collapse" style={{minWidth:820}}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 w-56">Producto</th>
                    <th className="px-3 py-3 text-center w-16">Uds/Paq</th>
                    <th className="px-3 py-3 text-center w-32">$/ud Mayor<br/><span className="text-[9px] font-normal text-indigo-400 normal-case">sugerido = precio×80%</span></th>
                    <th className="px-3 py-3 text-right w-24">Precio<br/>Paquete</th>
                    <th className="px-3 py-3 text-center w-20">Stock<br/>Paq.</th>
                    <th className="px-3 py-3 text-center w-28 bg-orange-50/60">🔥 $/ud Oferta</th>
                    <th className="px-3 py-3 text-center w-40 bg-orange-50/60">🔥 Vence</th>
                    <th className="px-3 py-3 text-center w-20">Acc.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withUnitsList.map(p => {
                    const sv = savingId === p.$id;
                    const nQ=editPackQty[p.$id], nW=editWholesalePrice[p.$id], nS=editStock[p.$id], nPS=editPackStock[p.$id];
                    const nM=editPackMinPacks[p.$id], nD=editPackDiscountPct[p.$id], nOP=editPackOfferPrice[p.$id];
                    const nOE=editPackOfferExpiresAt[p.$id], nOM=editPackOfferMinPacks[p.$id];
                    const hQ=nQ!==undefined&&parseInt(nQ,10)!==(p.PACKQTY||0);
                    const hW=nW!==undefined&&parseInt(nW,10)!==(p.WHOLESALEPRICE||0);
                    const hS=nS!==undefined&&parseInt(nS,10)!==(p.STOCK||0);
                    const hPS=nPS!==undefined&&parseInt(nPS,10)!==(p.PACK_STOCK||0);
                    const hM=nM!==undefined&&parseInt(nM,10)!==(p.PACK_MIN_PACKS||0);
                    const hD=nD!==undefined&&parseInt(nD,10)!==(p.PACK_DISCOUNT_PCT||0);
                    const hOP=nOP!==undefined&&parseInt(nOP,10)!==(p.PACK_OFFER_PRICE||0);
                    const hOE=nOE!==undefined&&(nOE===''?(p.PACK_OFFER_EXPIRES_AT||0)!==0:new Date(nOE).getTime()!==(p.PACK_OFFER_EXPIRES_AT||0));
                    const hOM=nOM!==undefined&&parseInt(nOM,10)!==(p.PACK_OFFER_MIN_PACKS||0);
                    const dirty=hQ||hW||hS||hPS||hM||hD||hOP||hOE||hOM;
                    const cQ=nQ!==undefined?parseInt(nQ,10):(p.PACKQTY||0);
                    const cW=nW!==undefined?parseInt(nW,10):(p.WHOLESALEPRICE||0);
                    const packPx=cQ*cW;
                    const sugg=Math.round(p.PRICE*0.80);
                    const oa=!!(p.PACK_OFFER_PRICE&&p.PACK_OFFER_EXPIRES_AT&&p.PACK_OFFER_EXPIRES_AT>Date.now());
                    const oe=!!(p.PACK_OFFER_PRICE&&p.PACK_OFFER_EXPIRES_AT&&p.PACK_OFFER_EXPIRES_AT<=Date.now());
                    const psk=p.PACK_STOCK??Math.floor((p.STOCK||0)/(p.PACKQTY||1));
                    return (
                      <tr key={p.$id} className={`hover:bg-gray-50/60 transition text-sm ${dirty?'bg-indigo-50/20':''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {p.IMAGEURL?<img src={p.IMAGEURL} alt={p.NAME} className="w-8 h-8 object-cover rounded-lg border shrink-0"/>:<div className="w-8 h-8 rounded-lg border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-gray-300"/></div>}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-[12px] max-w-[160px]">{p.NAME}</p>
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[9px] bg-indigo-50 text-indigo-500 px-1 rounded font-mono font-bold">SKU: {getSku(p) || '—'}</span>
                                <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded font-semibold">{getCategoryName(p.CATEGORYID)}</span>
                                {psk<=0&&<span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold">SIN STOCK</span>}
                                {psk>0&&psk<=3&&<span className="text-[9px] bg-amber-100 text-amber-600 px-1 rounded font-bold">BAJO</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <input type="number" value={nQ??(p.PACKQTY||'')} onChange={e=>setEditPackQty(v=>({...v,[p.$id]:e.target.value}))} placeholder="0" className={`w-14 px-1 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500 bg-white ${hQ?'border-indigo-400 bg-indigo-50':'border-gray-200'}`}/>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="relative inline-block">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input type="number" value={nW??(p.WHOLESALEPRICE||'')} onChange={e=>setEditWholesalePrice(v=>({...v,[p.$id]:e.target.value}))} placeholder={String(sugg)} className={`w-24 pl-5 pr-1 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-indigo-500 bg-white ${hW?'border-indigo-400 bg-indigo-50':'border-gray-200'}`}/>
                          </div>
                          <p className="text-[9px] text-indigo-400 mt-0.5">≤{formatPrice(sugg)}</p>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="font-bold text-emerald-700 text-sm">{formatPrice(packPx||p.PRICE)}</span>
                          {cQ>0&&<p className="text-[9px] text-gray-400">{cQ}×{formatPrice(cW)}</p>}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <input type="number" min="0" value={nPS??(p.PACK_STOCK??'')} onChange={e=>setEditPackStock(v=>({...v,[p.$id]:e.target.value}))} placeholder="∞" className={`w-16 px-1 py-1 border rounded-lg text-center text-sm font-bold focus:outline-none focus:border-emerald-400 bg-white ${hPS?'border-emerald-400 bg-emerald-50':(p.PACK_STOCK??999)>5?'border-gray-200':(p.PACK_STOCK??0)>0?'border-amber-200 text-amber-600':'border-red-200 text-red-500'}`}/>
                          <p className="text-[9px] text-gray-400 mt-0.5">≈{Math.floor((p.STOCK||0)/(p.PACKQTY||1))}</p>
                        </td>
                        <td className="px-3 py-3 text-center bg-orange-50/20">
                          <div className="relative inline-block">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-400 text-xs">$</span>
                            <input type="number" value={nOP??(p.PACK_OFFER_PRICE||'')} onChange={e=>setEditPackOfferPrice(v=>({...v,[p.$id]:e.target.value}))} placeholder="—" className={`w-24 pl-5 pr-1 py-1 border rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white ${hOP?'border-amber-400 bg-amber-50':oa?'border-amber-300':oe?'border-red-300':'border-gray-200'}`}/>
                          </div>
                          {oa&&<p className="text-[9px] font-bold text-amber-600 mt-0.5">● ACTIVA</p>}
                          {oe&&<button onClick={()=>setEditPackOfferExpiresAt(v=>({...v,[p.$id]:''}))} className="text-[9px] text-red-500 underline">Limpiar</button>}
                        </td>
                        <td className="px-3 py-3 text-center bg-orange-50/20">
                          <input type="datetime-local" value={nOE??msToDatetimeLocal(p.PACK_OFFER_EXPIRES_AT)} onChange={e=>setEditPackOfferExpiresAt(v=>({...v,[p.$id]:e.target.value}))} className={`w-full px-1 py-1 border rounded-lg text-[11px] font-semibold focus:outline-none focus:border-amber-500 bg-white ${hOE?'border-amber-400 bg-amber-50':oa?'border-amber-300':oe?'border-red-200':'border-gray-200'}`}/>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {dirty?(<button onClick={()=>handleSaveSingle(p.$id)} disabled={sv||isBulkSaving} className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50">{sv?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}</button>)
                              :saveStatus[p.$id]==='success'?<CheckCircle2 className="w-5 h-5 text-emerald-500"/>:saveStatus[p.$id]==='error'?<XCircle className="w-5 h-5 text-rose-500"/>:<span className="text-xs text-gray-300">—</span>}
                            <button onClick={()=>handlePublishToPaquetes(p.$id)} disabled={sv||isBulkSaving||dirty} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition disabled:opacity-30" title="Publicar en /paquetes">
                              {publishStatus[p.$id]==='loading'?<Loader2 className="w-4 h-4 animate-spin"/>:publishStatus[p.$id]==='success'?<CheckCircle2 className="w-4 h-4"/>:<Zap className="w-4 h-4"/>}
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

          {/* Mobile cards - packed */}
          <div className="lg:hidden space-y-3">
            {withUnitsList.map(p => {
              const sv=savingId===p.$id;
              const nQ=editPackQty[p.$id], nW=editWholesalePrice[p.$id], nPS=editPackStock[p.$id];
              const nM=editPackMinPacks[p.$id], nD=editPackDiscountPct[p.$id], nOP=editPackOfferPrice[p.$id];
              const nOE=editPackOfferExpiresAt[p.$id], nOM=editPackOfferMinPacks[p.$id], nS=editStock[p.$id];
              const hQ=nQ!==undefined&&parseInt(nQ,10)!==(p.PACKQTY||0);
              const hW=nW!==undefined&&parseInt(nW,10)!==(p.WHOLESALEPRICE||0);
              const hPS=nPS!==undefined&&parseInt(nPS,10)!==(p.PACK_STOCK||0);
              const hM=nM!==undefined&&parseInt(nM,10)!==(p.PACK_MIN_PACKS||0);
              const hD=nD!==undefined&&parseInt(nD,10)!==(p.PACK_DISCOUNT_PCT||0);
              const hOP=nOP!==undefined&&parseInt(nOP,10)!==(p.PACK_OFFER_PRICE||0);
              const hOE=nOE!==undefined&&(nOE===''?(p.PACK_OFFER_EXPIRES_AT||0)!==0:new Date(nOE).getTime()!==(p.PACK_OFFER_EXPIRES_AT||0));
              const hOM=nOM!==undefined&&parseInt(nOM,10)!==(p.PACK_OFFER_MIN_PACKS||0);
              const hS=nS!==undefined&&parseInt(nS,10)!==(p.STOCK||0);
              const dirty=hQ||hW||hPS||hM||hD||hOP||hOE||hOM||hS;
              const cQ=nQ!==undefined?parseInt(nQ,10):(p.PACKQTY||0);
              const cW=nW!==undefined?parseInt(nW,10):(p.WHOLESALEPRICE||0);
              const packPx=cQ*cW;
              const sugg=Math.round(p.PRICE*0.80);
              const oa=!!(p.PACK_OFFER_PRICE&&p.PACK_OFFER_EXPIRES_AT&&p.PACK_OFFER_EXPIRES_AT>Date.now());
              const oe=!!(p.PACK_OFFER_PRICE&&p.PACK_OFFER_EXPIRES_AT&&p.PACK_OFFER_EXPIRES_AT<=Date.now());
              const psk=p.PACK_STOCK??Math.floor((p.STOCK||0)/(p.PACKQTY||1));
              return (
                <div key={p.$id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${dirty?'border-indigo-200':'border-gray-200'}`}>
                  <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                    {p.IMAGEURL?<img src={p.IMAGEURL} alt={p.NAME} className="w-12 h-12 object-cover rounded-xl border bg-gray-50 shrink-0"/>:<div className="w-12 h-12 rounded-xl border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-gray-300"/></div>}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{p.NAME}</p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-mono font-bold">SKU: {getSku(p) || '—'}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">{getCategoryName(p.CATEGORYID)}</span>
                        {oa&&<span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">🔥 OFERTA</span>}
                        {psk<=0&&<span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">SIN STOCK</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {dirty&&<button onClick={()=>handleSaveSingle(p.$id)} disabled={sv||isBulkSaving} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition">{sv?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Save className="w-3.5 h-3.5"/>}Guardar</button>}
                      {saveStatus[p.$id]==='success'&&<CheckCircle2 className="w-5 h-5 text-emerald-500"/>}
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="bg-emerald-50/50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Precios</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div><p className="text-[10px] text-gray-400">Sugerido/ud</p><p className="text-sm font-bold text-gray-600">{formatPrice(sugg)}</p><p className="text-[9px] text-gray-400">precio×80%</p></div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Mayor/ud</p>
                          <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span><input type="number" value={nW??(p.WHOLESALEPRICE||'')} onChange={e=>setEditWholesalePrice(v=>({...v,[p.$id]:e.target.value}))} placeholder={String(sugg)} className={`w-full pl-5 pr-1 py-1.5 border rounded-lg text-sm font-semibold focus:outline-none focus:border-indigo-500 bg-white ${hW?'border-indigo-400 bg-indigo-50':'border-gray-200'}`}/></div>
                        </div>
                        <div><p className="text-[10px] text-gray-400">Precio Paq.</p><p className="text-sm font-bold text-emerald-700">{formatPrice(packPx||p.PRICE)}</p>{cQ>0&&<p className="text-[9px] text-gray-400">{cQ}×{formatPrice(cW)}</p>}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">Uds/Paquete</label><input type="number" value={nQ??(p.PACKQTY||'')} onChange={e=>setEditPackQty(v=>({...v,[p.$id]:e.target.value}))} placeholder="0" className={`w-full px-3 py-2 border rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 bg-white ${hQ?'border-indigo-400 bg-indigo-50':'border-gray-200'}`}/></div>
                      <div><label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">Stock Paquetes</label><input type="number" min="0" value={nPS??(p.PACK_STOCK??'')} onChange={e=>setEditPackStock(v=>({...v,[p.$id]:e.target.value}))} placeholder={`≈${Math.floor((p.STOCK||0)/(p.PACKQTY||1))}`} className={`w-full px-3 py-2 border rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-400 bg-white ${hPS?'border-emerald-400 bg-emerald-50':psk>5?'border-gray-200':psk>0?'border-amber-200':'border-red-200'}`}/></div>
                    </div>
                    <div className={`rounded-xl p-3 space-y-2 ${oa?'bg-orange-50 border border-orange-200':oe?'bg-red-50 border border-red-200':'bg-gray-50 border border-gray-100'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500"/>Oferta Temporal</p>
                        {oa&&<span className="text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">● ACTIVA</span>}
                        {oe&&<button onClick={()=>setEditPackOfferExpiresAt(v=>({...v,[p.$id]:''}))} className="text-[9px] text-red-500 underline font-bold">Limpiar expirada</button>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-[10px] text-gray-500 block mb-1">Precio oferta/ud</label><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500 text-xs">$</span><input type="number" value={nOP??(p.PACK_OFFER_PRICE||'')} onChange={e=>setEditPackOfferPrice(v=>({...v,[p.$id]:e.target.value}))} placeholder="—" className={`w-full pl-6 pr-2 py-2 border rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white ${hOP?'border-amber-400':oa?'border-amber-300':'border-gray-200'}`}/></div></div>
                      </div>
                      <div><label className="text-[10px] text-gray-500 block mb-1">Vence el</label><input type="datetime-local" value={nOE??msToDatetimeLocal(p.PACK_OFFER_EXPIRES_AT)} onChange={e=>setEditPackOfferExpiresAt(v=>({...v,[p.$id]:e.target.value}))} className={`w-full px-3 py-2 border rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white ${hOE?'border-amber-400':oa?'border-amber-300':oe?'border-red-300':'border-gray-200'}`}/></div>
                    </div>
                    <button onClick={()=>handlePublishToPaquetes(p.$id)} disabled={sv||isBulkSaving||dirty} className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-emerald-200 transition disabled:opacity-40">
                      {publishStatus[p.$id]==='loading'?<><Loader2 className="w-3.5 h-3.5 animate-spin"/>Publicando...</>:publishStatus[p.$id]==='success'?<><CheckCircle2 className="w-3.5 h-3.5"/>¡Publicado!</>:<><Zap className="w-3.5 h-3.5"/>Publicar en /paquetes</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )
      ) : (
        /* TAB: Sin Configurar */
        withoutPackagingList.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3"/>
            <p className="text-gray-600 font-semibold text-sm">¡Todo el catálogo tiene embalaje configurado!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Desktop table - unpacked */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-amber-50 border-b border-amber-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-5 py-3">Producto</th>
                      <th className="px-3 py-3 text-right w-28">Precio</th>
                      <th className="px-3 py-3 text-center w-28">Suger.×80%</th>
                      <th className="px-3 py-3 text-center w-32">Uds/Paquete</th>
                      <th className="px-3 py-3 text-center w-36">Precio Mayor/ud</th>
                      <th className="px-3 py-3 text-center w-20">Stock</th>
                      <th className="px-3 py-3 text-center w-20">Acc.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withoutPackagingList.map(p => {
                      const sv=savingId===p.$id;
                      const nQ=editPackQty[p.$id], nW=editWholesalePrice[p.$id];
                      const hQ=nQ!==undefined&&parseInt(nQ,10)!==(p.PACKQTY||0);
                      const hW=nW!==undefined&&parseInt(nW,10)!==(p.WHOLESALEPRICE||0);
                      const dirty=hQ||hW;
                      const sugg=Math.round(p.PRICE*0.80);
                      return (
                        <tr key={p.$id} className={`hover:bg-gray-50/60 transition text-sm ${dirty?'bg-amber-50/30':''}`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              {p.IMAGEURL?<img src={p.IMAGEURL} alt={p.NAME} className="w-9 h-9 object-cover rounded-lg border bg-gray-50 shrink-0"/>:<div className="w-9 h-9 rounded-lg border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-gray-300"/></div>}
                              <div className="min-w-0"><p className="font-semibold text-gray-900 truncate text-[13px]">{p.NAME}</p><div className="flex items-center gap-1.5 flex-wrap"><span className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 rounded font-mono font-bold">SKU: {getSku(p) || '—'}</span><span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded font-semibold">{getCategoryName(p.CATEGORYID)}</span></div></div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right font-bold text-gray-700">{formatPrice(p.PRICE)}</td>
                          <td className="px-3 py-3 text-center"><span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{formatPrice(sugg)}</span></td>
                          <td className="px-3 py-3 text-center">
                            <input type="number" value={nQ??''} onChange={e=>setEditPackQty(v=>({...v,[p.$id]:e.target.value}))} placeholder="Cant." className={`w-24 px-2 py-1.5 border rounded-xl text-center text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white ${hQ?'border-amber-400 bg-amber-50':'border-amber-200'}`}/>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className="relative inline-block"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span><input type="number" value={nW??(p.WHOLESALEPRICE||'')} onChange={e=>setEditWholesalePrice(v=>({...v,[p.$id]:e.target.value}))} placeholder={String(sugg)} className={`w-32 pl-6 pr-2 py-1.5 border rounded-xl text-center text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white ${hW?'border-amber-400 bg-amber-50':'border-amber-200'}`}/></div>
                          </td>
                          <td className="px-3 py-3 text-center font-bold"><span className={p.STOCK>5?'text-gray-700':p.STOCK>0?'text-amber-600':'text-red-500'}>{p.STOCK}</span></td>
                          <td className="px-3 py-3 text-center">
                            {dirty?<button onClick={()=>handleSaveSingle(p.$id)} disabled={sv||isBulkSaving} className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition disabled:opacity-50">{sv?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}</button>
                              :saveStatus[p.$id]==='success'?<CheckCircle2 className="w-5 h-5 text-emerald-500"/>:<span className="text-xs text-gray-300">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards - unpacked */}
            <div className="md:hidden space-y-3">
              {withoutPackagingList.map(p => {
                const sv=savingId===p.$id;
                const nQ=editPackQty[p.$id], nW=editWholesalePrice[p.$id];
                const hQ=nQ!==undefined&&parseInt(nQ,10)!==(p.PACKQTY||0);
                const hW=nW!==undefined&&parseInt(nW,10)!==(p.WHOLESALEPRICE||0);
                const dirty=hQ||hW;
                const sugg=Math.round(p.PRICE*0.80);
                return (
                  <div key={p.$id} className={`bg-white rounded-2xl border shadow-sm p-3 ${dirty?'border-amber-300':'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {p.IMAGEURL?<img src={p.IMAGEURL} alt={p.NAME} className="w-11 h-11 object-cover rounded-xl border bg-gray-50 shrink-0"/>:<div className="w-11 h-11 rounded-xl border bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-gray-300"/></div>}
                      <div className="flex-1 min-w-0"><p className="font-bold text-gray-900 text-sm truncate">{p.NAME}</p><div className="flex items-center gap-1.5 flex-wrap mt-0.5"><span className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-mono font-bold">SKU: {getSku(p) || '—'}</span><span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">{getCategoryName(p.CATEGORYID)}</span></div></div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 mb-3 flex items-center justify-between">
                      <div><p className="text-[10px] text-gray-400">Precio tienda</p><p className="font-bold text-gray-800 text-sm">{formatPrice(p.PRICE)}</p></div>
                      <div className="text-center"><p className="text-[10px] text-gray-400">Stock</p><p className={`font-bold text-sm ${p.STOCK>5?'text-gray-800':p.STOCK>0?'text-amber-600':'text-red-500'}`}>{p.STOCK}</p></div>
                      <div className="text-right"><p className="text-[10px] text-gray-400">Sugerido×80%</p><p className="font-bold text-indigo-600 text-sm">{formatPrice(sugg)}</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div><label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">Uds/Paquete</label><input type="number" value={nQ??''} onChange={e=>setEditPackQty(v=>({...v,[p.$id]:e.target.value}))} placeholder="Cantidad" className={`w-full px-3 py-2 border rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white ${hQ?'border-amber-400 bg-amber-50':'border-amber-200'}`}/></div>
                      <div><label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">Precio Mayor/ud</label><div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span><input type="number" value={nW??(p.WHOLESALEPRICE||'')} onChange={e=>setEditWholesalePrice(v=>({...v,[p.$id]:e.target.value}))} placeholder={String(sugg)} className={`w-full pl-6 pr-2 py-2 border rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500 bg-white ${hW?'border-amber-400 bg-amber-50':'border-amber-200'}`}/></div></div>
                    </div>
                    {dirty&&<button onClick={()=>handleSaveSingle(p.$id)} disabled={sv||isBulkSaving} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition">{sv?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}Guardar</button>}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
      </div>
    </div>
  );
}