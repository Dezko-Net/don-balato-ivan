'use client';

import { useEffect, useState, useCallback, Fragment, useRef } from 'react';
import EpicPagination from '@/components/admin/EpicPagination';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Query, ID } from 'appwrite';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID, CATEGORIES_COLLECTION_ID, STOCK_ALERTS_COLLECTION_ID, NOTIFICATIONS_COLLECTION_ID, SUBCATEGORIES_COLLECTION_ID, CATALOG_PRODUCTS_COLLECTION_ID, INVENTORY_PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Product, Category, Subcategory } from '@/types/admin';
import { Plus, Search, Pencil, Trash2, AlertTriangle, X, Package, RefreshCw, ChevronDown, ChevronUp, Download, Copy, Percent, Star, Boxes, Sparkles, OctagonX, MapPin, ArrowLeft, MessageSquare, Loader2, ImagePlus, ImageOff, Eye, Upload, FileSpreadsheet, FileText, ShoppingBag, Wrench } from 'lucide-react';
import Link from 'next/link';
import ImageUploadField from '@/components/admin/ImageUploadField';
import ProductPhotoUploader from '@/components/admin/ProductPhotoUploader';
import MobileProductList from '@/components/admin/mobile/MobileProductList';
import MobileProductEditor from '@/components/admin/mobile/MobileProductEditor';
import { generateProductTitle, generateProductDescription, generateProductAiPack } from '@/lib/aiAdmin';
import { getBarcodeFromFeatures, getSkuFromFeatures, setBarcodeInFeatures, setSkuInFeatures, getWarehouseLocationFromFeatures, setSectionInFeatures, getCustomTabsFromFeatures, setCustomTabsInFeatures, getExactWholesaleFromFeatures, setExactWholesaleInFeatures, getDisableDiscountsFromFeatures, setDisableDiscountsInFeatures } from '@/lib/product-features';
// Lottie imports removed to prevent React 19 crashes

type ProductModalData = Partial<Product> & { _barcode?: string; _sku?: string; _details?: string; _usage?: string; _ingredients?: string };

import { MEDIA_BUCKET_ID, MEDIA_PREFIXES } from '@/lib/appwrite';
import { invalidateProductCache, cached, TTL } from '@/lib/cache';
import { resolveStorageImageUrl } from '@/lib/product-images';

const PRODUCTS_BUCKET_ID = MEDIA_BUCKET_ID; // Backward compatibility

const EMPTY: Partial<Product> = { NAME: '', DESCRIPTION: '', PRICE: 0, STOCK: 0, COST: 0, WHOLESALEPRICE: 0, WHOLESALEMINQUANTITY: 0, PACKQTY: 0, BOXPRICE: 0, BOXQTY: 0, IMAGEURL: '', IMAGEURL2: '', IMAGEURL3: '', CATEGORYID: '' };

const FieldInput = ({ label, field, type = 'text', value, onChange }: { label: string; field: string; type?: string; value: any; onChange: (val: any) => void }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input type={type} value={value ?? ''}
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
  </div>
);

const getLiveStatus = (p: Product) => {
  if (!p.$createdAt) return null;
  const now = new Date();
  const today7Am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0, 0);
  const threshold = now.getTime() >= today7Am.getTime()
    ? today7Am.getTime()
    : new Date(today7Am.getFullYear(), today7Am.getMonth(), today7Am.getDate() - 1, 7, 0, 0, 0).getTime();

  const importedTime = new Date(p.$createdAt).getTime();
  if (importedTime < threshold) return null;

  const createdTime = p.$createdAt ? new Date(p.$createdAt).getTime() : 0;
  if (createdTime >= threshold) {
    return 'new';
  } else {
    return 'existing';
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [subCatFilter, setSubCatFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'low' | 'out'>('instock');
  const [noImageOnly, setNoImageOnly] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [aiWizard, setAiWizard] = useState<{ step: 'prices' | 'images' | null; refImage: string; cost: number; price: number; catalogPrice: number; marginPct: string; catalogPct: string; imgUrls: string[] } | null>(null);
  const [aiAutoEnhance, setAiAutoEnhance] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [sort, setSort] = useState<{ key: 'NAME' | 'PRICE' | 'STOCK' | 'SOLDQUANTITY' | 'MARGIN' | 'CREATED'; dir: 'asc' | 'desc' }>({ key: 'CREATED', dir: 'desc' });
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: ProductModalData } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Restaurar modal en progreso desde localStorage (modo add)
  useEffect(() => {
    const restore = () => {
      try {
        const saved = localStorage.getItem('mobile-editor-state');
        if (saved) {
          const state = JSON.parse(saved);
          if (state.modalData && !state.saved) {
            setModal({ mode: 'add', data: state.modalData as ProductModalData });
          }
        }
      } catch {}
    };
    restore();
    // Restaurar al volver a la página (back/forward + bfcache + visibility)
    const onPageshow = (e: PageTransitionEvent) => { setTimeout(restore, 50); };
    const onPopstate = () => setTimeout(restore, 50);
    const onVisibility = () => { if (document.visibilityState === 'visible') setTimeout(restore, 50); };
    window.addEventListener('pageshow', onPageshow);
    window.addEventListener('popstate', onPopstate);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pageshow', onPageshow);
      window.removeEventListener('popstate', onPopstate);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [priceModal, setPriceModal] = useState(false);
  const [priceAdj, setPriceAdj] = useState<{ type: 'percent' | 'fixed'; value: string }>({ type: 'percent', value: '' });
  const [applyingPrice, setApplyingPrice] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [stockAdj, setStockAdj] = useState<{ type: 'add' | 'set'; value: string }>({ type: 'add', value: '' });
  const [applyingStock, setApplyingStock] = useState(false);
  const [imageDrawer, setImageDrawer] = useState<{
    productId: string; productName: string;
    img1: string; img2: string; img3: string; img4: string;
    origImg1: string; origImg2: string; origImg3: string; origImg4: string;
    description: string; origDescription: string;
    features: string; origFeatures: string;
    tags: string; origTags: string;
    sku: string; origSku: string;
    price: number; origPrice: number;
    stock: number; origStock: number;
  } | null>(null);
  const [imageDrawerSaving, setImageDrawerSaving] = useState(false);
  const [imageDrawerUploading, setImageDrawerUploading] = useState<string | null>(null);
  const [imageDrawerTab, setImageDrawerTab] = useState<'images' | 'info' | 'specs'>('images');
  const imageDrawerFileRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  const [aiLoading, setAiLoading] = useState<'title' | 'desc' | 'tabs' | 'all' | null>(null);
  const [aiTitles, setAiTitles] = useState<string[]>([]);
  const [desktopMarginPct, setDesktopMarginPct] = useState<string>('');
  const [desktopCatalogPct, setDesktopCatalogPct] = useState<string>('');
  const [KeniaOpen, setKeniaOpen] = useState(false);
  const [KeniaMessages, setKeniaMessages] = useState<{role: string; content: string}[]>([]);
  const [KeniaInput, setKeniaInput] = useState('');
  const [KeniaLoading, setKeniaLoading] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, string[]>>({});
  const [brokenOnly, setBrokenOnly] = useState(false);
  const [syncingImages, setSyncingImages] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ checked: 0, broken: 0 });
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfExportProgress, setPdfExportProgress] = useState({ current: 0, total: 0 });
  const [toolsOpen, setToolsOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const getModalImageUrls = useCallback((data?: Partial<ProductModalData> | null) => {
    return [data?.IMAGEURL, data?.IMAGEURL2, data?.IMAGEURL3, (data as any)?.IMAGEURL4]
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .slice(0, 3);
  }, []);

  const generateAllProductContent = useCallback(async () => {
    if (!modal) return;
    setAiLoading('all');
    setAiTitles([]);
    try {
      const categoryName = categories.find(c => c.$id === modal.data.CATEGORYID)?.name || '';
      const catNames = categories.map(c => c.name);
      const subGroups = categories.map(c => ({
        category: c.name,
        subs: subcategories.filter(s => s.categoryId === c.$id && !s.parentSubcategoryId).map(s => s.name),
      }));
      const result = await generateProductAiPack({
        name: modal.data.NAME || '',
        description: modal.data.DESCRIPTION || '',
        category: categoryName,
        imageUrls: getModalImageUrls(modal.data),
        availableCategories: catNames,
        availableSubcategories: subGroups,
      });
      setAiTitles(result.titles);

      // Match suggested category to real category ID
      let matchedCatId = modal.data.CATEGORYID;
      if (result.suggestedCategory) {
        const matched = categories.find(c => c.name.toLowerCase() === result.suggestedCategory.toLowerCase());
        if (matched) matchedCatId = matched.$id;
      }
      // Match suggested subcategory to real subcategory ID
      let matchedSubId = '';
      if (result.suggestedSubcategory && matchedCatId) {
        const matchedSub = subcategories.find(s =>
          s.categoryId === matchedCatId &&
          !s.parentSubcategoryId &&
          s.name.toLowerCase() === result.suggestedSubcategory.toLowerCase()
        );
        if (matchedSub) matchedSubId = matchedSub.$id;
      }

      setModal(m => m ? {
        ...m,
        data: {
          ...m.data,
          NAME: result.selectedTitle || m.data.NAME || '',
          DESCRIPTION: result.description || m.data.DESCRIPTION || '',
          _details: result.details || m.data._details || '',
          _usage: result.usage || m.data._usage || '',
          _ingredients: result.ingredients || m.data._ingredients || '',
          TAGS: result.tags.join(', '),
          CATEGORYID: matchedCatId || m.data.CATEGORYID,
          SUBCATEGORYID: matchedSubId || '',
          SUBSUBCATEGORYID: '',
        },
      } : m);
    } catch (e: any) {
      alert(e.message || 'No se pudo generar el contenido con IA.');
    } finally {
      setAiLoading(null);
    }
  }, [categories, subcategories, getModalImageUrls, modal]);

  const generateTechnicalTabsOnly = useCallback(async () => {
    if (!modal) return;
    setAiLoading('tabs');
    try {
      const categoryName = categories.find(c => c.$id === modal.data.CATEGORYID)?.name || '';
      const catNames = categories.map(c => c.name);
      const subGroups = categories.map(c => ({
        category: c.name,
        subs: subcategories.filter(s => s.categoryId === c.$id && !s.parentSubcategoryId).map(s => s.name),
      }));
      const result = await generateProductAiPack({
        name: modal.data.NAME || '',
        description: modal.data.DESCRIPTION || '',
        category: categoryName,
        imageUrls: getModalImageUrls(modal.data),
        availableCategories: catNames,
        availableSubcategories: subGroups,
      });
      setModal(m => m ? {
        ...m,
        data: {
          ...m.data,
          _details: result.details || m.data._details || '',
          _usage: result.usage || m.data._usage || '',
          _ingredients: result.ingredients || m.data._ingredients || '',
        },
      } : m);
    } catch (e: any) {
      alert(e.message || 'No se pudo generar la ficha técnica con IA.');
    } finally {
      setAiLoading(null);
    }
  }, [categories, getModalImageUrls, modal]);

  // AI Categorization states
  const [aiCategorizeModal, setAiCategorizeModal] = useState(false);
  const [aiCategorizeMode, setAiCategorizeMode] = useState<'uncategorized' | 'all'>('uncategorized');
  const [aiCategorizing, setAiCategorizing] = useState(false);
  const [aiCategorizeSuggestions, setAiCategorizeSuggestions] = useState<any[]>([]);
  const [aiCategorizeProgress, setAiCategorizeProgress] = useState({ current: 0, total: 0 });
  const [approvedSuggestions, setApprovedSuggestions] = useState<Record<string, boolean>>({});
  const [applyingCategorization, setApplyingCategorization] = useState(false);
  const [applyingProgress, setApplyingProgress] = useState({ current: 0, total: 0 });

  const applyBulkStock = async () => {
    const v = parseInt(stockAdj.value, 10);
    if (isNaN(v)) { alert('Ingresa un valor válido'); return; }
    if (stockAdj.type === 'set' && v < 0) { alert('El stock no puede ser negativo'); return; }
    if (!confirm(`¿Aplicar ajuste de stock a ${filtered.length} producto(s)?`)) return;
    setApplyingStock(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await Promise.all(filtered.map(p => {
        const newStock = stockAdj.type === 'set' ? v : Math.max(0, (p.STOCK ?? 0) + v);
        return databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, p.$id, { STOCK: newStock });
      }));
      setProducts(prev => prev.map(p => {
        if (!filtered.find(f => f.$id === p.$id)) return p;
        const newStock = stockAdj.type === 'set' ? v : Math.max(0, (p.STOCK ?? 0) + v);
        return { ...p, STOCK: newStock };
      }));
      setStockModal(false);
      setStockAdj({ type: 'add', value: '' });
      invalidateProductCache();
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setApplyingStock(false); }
  };

  const applyBulkPrice = async () => {
    const v = parseFloat(priceAdj.value);
    if (isNaN(v) || v === 0) { alert('Ingresa un valor válido'); return; }
    if (!confirm(`¿Aplicar ajuste de precio a ${filtered.length} producto(s)?`)) return;
    setApplyingPrice(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await Promise.all(filtered.map(p => {
        const newPrice = priceAdj.type === 'percent'
          ? Math.round(p.PRICE * (1 + v / 100))
          : Math.round(p.PRICE + v);
        return databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, p.$id, { PRICE: Math.max(0, newPrice) });
      }));
      setProducts(prev => prev.map(p => {
        if (!filtered.find(f => f.$id === p.$id)) return p;
        const newPrice = priceAdj.type === 'percent'
          ? Math.round(p.PRICE * (1 + v / 100))
          : Math.round(p.PRICE + v);
        return { ...p, PRICE: Math.max(0, newPrice) };
      }));
      setPriceModal(false);
      setPriceAdj({ type: 'percent', value: '' });
      invalidateProductCache();
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setApplyingPrice(false); }
  };

  const startAiCategorization = async () => {
    // 1. Fetch ALL products from Appwrite (not just the current page)
    let targets: Product[] = [];
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      let cursor: string | null = null;
      const allProducts: Product[] = [];
      do {
        const q: any[] = [Query.limit(100), Query.orderDesc('$createdAt')];
        if (cursor) q.push(Query.cursorAfter(cursor));
        const resp = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, q);
        allProducts.push(...(resp.documents as unknown as Product[]));
        cursor = resp.documents.length === 100 ? (resp.documents[resp.documents.length - 1] as any).$id : null;
      } while (cursor);
      targets = allProducts;
    } catch (e: any) {
      alert('Error al cargar productos: ' + e.message);
      return;
    }

    if (aiCategorizeMode === 'uncategorized') {
      targets = targets.filter(p => !p.CATEGORYID || p.CATEGORYID.trim() === '');
    }

    if (targets.length === 0) {
      alert(aiCategorizeMode === 'uncategorized' 
        ? 'No hay productos sin categoría asignada.' 
        : 'No hay productos para procesar.'
      );
      return;
    }

    setAiCategorizing(true);
    setAiCategorizeSuggestions([]);
    setAiCategorizeProgress({ current: 0, total: targets.length });

    const batchSize = 50;
    const suggestionsList: any[] = [];
    const defaultApproved: Record<string, boolean> = {};

    try {
      for (let i = 0; i < targets.length; i += batchSize) {
        const batch = targets.slice(i, i + batchSize);
        setAiCategorizeProgress({ current: i, total: targets.length });

        const res = await fetch('/api/ai-categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: batch.map(p => ({ $id: p.$id, NAME: p.NAME, DESCRIPTION: p.DESCRIPTION })),
            categories: categories.map(c => ({ $id: c.$id, name: c.name })),
            subcategories: subcategories.map(s => ({ $id: s.$id, name: s.name, categoryId: s.categoryId })),
          }),
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data = await res.ok ? await res.json() : { success: false, error: 'Request failed' };
        if (data.success && data.suggestions) {
          data.suggestions.forEach((s: any) => {
            // Find matched product from targets
            const p = targets.find(t => t.$id === s.productId);
            if (p) {
              suggestionsList.push({
                productId: s.productId,
                productName: p.NAME,
                currentCategoryId: p.CATEGORYID,
                suggestedCategoryId: s.categoryId,
                suggestedSubcategoryId: s.subcategoryId,
                reason: s.reason,
              });
              // Approve suggestions that actually find a category
              if (s.categoryId) {
                defaultApproved[s.productId] = true;
              }
            }
          });
          setAiCategorizeSuggestions([...suggestionsList]);
          setApprovedSuggestions({ ...defaultApproved });
        }
      }
      setAiCategorizeProgress({ current: targets.length, total: targets.length });
    } catch (e: any) {
      alert('Error durante el análisis: ' + e.message);
    } finally {
      setAiCategorizing(false);
    }
  };

  const applyAiCategorization = async () => {
    const toApply = aiCategorizeSuggestions.filter(s => approvedSuggestions[s.productId]);
    if (toApply.length === 0) {
      alert('No hay sugerencias aprobadas para aplicar.');
      return;
    }

    setApplyingCategorization(true);
    setApplyingProgress({ current: 0, total: toApply.length });

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      for (let i = 0; i < toApply.length; i++) {
        const item = toApply[i];
        setApplyingProgress({ current: i, total: toApply.length });

        const payload: any = {};
        if (item.suggestedCategoryId) payload.CATEGORYID = item.suggestedCategoryId;
        if (item.suggestedSubcategoryId) payload.SUBCATEGORYID = item.suggestedSubcategoryId;

        if (Object.keys(payload).length > 0) {
          await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, item.productId, payload);
        }
      }

      setApplyingProgress({ current: toApply.length, total: toApply.length });
      invalidateProductCache();
      // Clear sessionStorage cache so fresh data is loaded from Appwrite
      Object.keys(sessionStorage).forEach(k => { if (k.startsWith('admin_products_')) sessionStorage.removeItem(k); });
      alert(`¡Se categorizaron exitosamente ${toApply.length} producto(s)!`);
      setAiCategorizeModal(false);
      setAiCategorizeSuggestions([]);
      setApprovedSuggestions({});
      load();
    } catch (e: any) {
      alert('Error al aplicar categorizaciones: ' + e.message);
    } finally {
      setApplyingCategorization(false);
    }
  };

  const checkDuplicates = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Duplicate detection now runs server-side behind a 24h cache instead of
      // pulling 3 × 2000 documents straight from Appwrite on every click
      // (~6000 reads → ~0, shared across admins; invalidated on product edits).
      const res = await fetch('/api/admin/check-duplicates', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al buscar duplicados');
      setDuplicates(data.duplicates || []);
    } catch (e: any) {
      setError('Error al buscar duplicados: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDuplicate = async (dup: any) => {
    const colName = dup.collection === 'products' ? 'productos' : dup.collection === 'catalog_products' ? 'catalog_products' : 'inventory_products';
    if (!confirm(`¿Eliminar este producto duplicado en la colección "${colName}"?`)) return;
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      let collectionId = PRODUCTS_COLLECTION_ID;
      if (dup.collection === 'catalog_products') collectionId = CATALOG_PRODUCTS_COLLECTION_ID;
      else if (dup.collection === 'inventory_products') collectionId = INVENTORY_PRODUCTS_COLLECTION_ID;

      await databases.deleteDocument(databaseId, collectionId, dup.document.$id);
      
      setDuplicates(prev => prev.map(group => {
        return {
          ...group,
          duplicates: group.duplicates.filter((item: any) => !(item.document.$id === dup.document.$id && item.collection === dup.collection))
        };
      }).filter(group => group.duplicates.length > 0));

      alert('Producto duplicado eliminado con éxito.');
    } catch (err: any) {
      alert('Error al eliminar duplicado: ' + err.message);
    }
  };

  const [isDeletingBulkDups, setIsDeletingBulkDups] = useState(false);
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState<{done: number; total: number} | null>(null);

  const deleteZeroStockDuplicates = async () => {
    const targets: any[] = [];
    duplicates.forEach(group => {
      group.duplicates.forEach((dup: any) => {
        const stockVal = dup.stock ?? dup.document.STOCK ?? dup.document.stock ?? 0;
        if (stockVal === 0 && dup.collection !== 'products') {
          targets.push(dup);
        }
      });
    });

    if (targets.length === 0) {
      alert('No hay productos duplicados con stock 0 en las colecciones de Catálogo o Inventario.');
      return;
    }

    if (!confirm(`¿Eliminar de forma masiva ${targets.length} productos repetidos con stock 0 de las colecciones de Catálogo e Inventario?`)) {
      return;
    }

    // `deleted` fuera del try para que el catch también tenga acceso
    const deleted: any[] = [];
    setIsDeletingBulkDups(true);
    setBulkDeleteProgress({ done: 0, total: targets.length });
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // Lotes de 2 con 800ms de pausa → respeta el rate limit de Appwrite
      const BATCH_SIZE = 2;
      const DELAY_MS = 800;
      for (let i = 0; i < targets.length; i += BATCH_SIZE) {
        const batch = targets.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(dup => {
          let collectionId = PRODUCTS_COLLECTION_ID;
          if (dup.collection === 'catalog_products') collectionId = CATALOG_PRODUCTS_COLLECTION_ID;
          else if (dup.collection === 'inventory_products') collectionId = INVENTORY_PRODUCTS_COLLECTION_ID;
          return databases.deleteDocument(databaseId, collectionId, dup.document.$id);
        }));
        deleted.push(...batch);
        setBulkDeleteProgress({ done: deleted.length, total: targets.length });
        if (i + BATCH_SIZE < targets.length) {
          await new Promise(res => setTimeout(res, DELAY_MS));
        }
      }

      setDuplicates(prev => prev.map(group => ({
        ...group,
        duplicates: group.duplicates.filter((item: any) => !deleted.some(t => t.document.$id === item.document.$id && t.collection === item.collection))
      })).filter(group => group.duplicates.length > 0));

      alert(`✅ Se eliminaron con éxito ${deleted.length} duplicados con stock 0.`);
    } catch (err: any) {
      // Reflejar en UI los que sí se borraron antes del error
      if (deleted.length > 0) {
        setDuplicates(prev => prev.map(group => ({
          ...group,
          duplicates: group.duplicates.filter((item: any) => !deleted.some(t => t.document.$id === item.document.$id && t.collection === item.collection))
        })).filter(group => group.duplicates.length > 0));
      }
      alert(`Error al eliminar: ${err.message}\nSe eliminaron ${deleted.length} de ${targets.length}. Vuelve a intentarlo para continuar.`);
    } finally {
      setIsDeletingBulkDups(false);
      setBulkDeleteProgress(null);
    }
  };

  const [globalStats, setGlobalStats] = useState<{ total: number; inStock: number; outOfStock: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        
        const [resTotal, resInStock] = await Promise.all([
          databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [Query.limit(1)]),
          databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [Query.greaterThan('STOCK', 0), Query.limit(1)])
        ]);
        
        const total = resTotal.total;
        const inStock = resInStock.total;
        const outOfStock = total - inStock;
        
        const stats = { total, inStock, outOfStock };
        setGlobalStats(stats);
        localStorage.setItem('admin_products_global_stats', JSON.stringify({
          timestamp: Date.now(),
          stats
        }));
      } catch (err) {
        console.error('Error loading global product stats:', err);
      }
    })();
  }, []);

  const [lastCursor, setLastCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // Map: page number -> cursor to reach it (page 1 = null cursor)
  const pageCursorsRef = useRef<Map<number, string | null>>(new Map([[1, null]]));
  const PAGE_SIZE = 10;

  const load = useCallback(async (isLoadMore = false, passedCursor: string | null = null, currentSearch = '', currentCat = '', currentSub = '', currentStock = 'instock') => {
    if (!isLoadMore) {
      setIsLoading(true);
      setProducts([]);
    }
    setError('');
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      const queries: any[] = [Query.limit(PAGE_SIZE), Query.orderDesc('$createdAt')];
      
      if (isLoadMore && passedCursor) {
        queries.push(Query.cursorAfter(passedCursor));
      }
      
      if (currentCat) {
        queries.push(Query.equal('CATEGORYID', currentCat));
      }
      if (currentSub) {
        queries.push(Query.equal('SUBCATEGORYID', currentSub));
      }
      
      if (currentStock === 'instock') {
        queries.push(Query.greaterThan('STOCK', 0));
      } else if (currentStock === 'out') {
        queries.push(Query.equal('STOCK', 0));
      } else if (currentStock === 'low') {
        queries.push(Query.greaterThan('STOCK', 0));
        queries.push(Query.lessThanEqual('STOCK', 10));
      }

      let docs: Product[] = [];
      const q = currentSearch.trim();
      
      if (q) {
        const qLower = q.toLowerCase();
        const qUpper = q.toUpperCase();
        
        const searchOptions = [
          [Query.equal('sku', [q, qLower, qUpper])],
          [Query.equal('barcode', [q, qLower, qUpper])],
          [Query.contains('NAME', q)],
          [Query.contains('NAME', qLower)],
          [Query.contains('NAME', qUpper)],
          [Query.contains('TAGS', [q, qLower, qUpper])],
          [Query.equal('jumpseller_id', [q, qLower, qUpper])],
        ];
        
        let foundDocs: any[] = [];
        for (const sOpt of searchOptions) {
          try {
            const resp = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
              ...queries,
              ...sOpt
            ]);
            if (resp.documents.length > 0) {
              foundDocs = resp.documents;
              break;
            }
          } catch {}
        }
        
        if (foundDocs.length === 0) {
          try {
            const resp = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
              ...queries,
              Query.contains('FEATURES', q)
            ]);
            foundDocs = resp.documents;
          } catch {}
        }
        
        docs = foundDocs as unknown as Product[];
      } else {
        const resp = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, queries);
        docs = resp.documents as unknown as Product[];
      }

      const [cr, subRes] = await Promise.all([
        databases.listDocuments(databaseId, CATEGORIES_COLLECTION_ID, [Query.limit(100)]),
        databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION_ID, [Query.limit(100)]),
      ]);
      
      setProducts(docs);

      if (docs.length === PAGE_SIZE) {
        setLastCursor((docs[docs.length - 1] as any).$id);
        pageCursorsRef.current.set(currentPage + 1, (docs[docs.length - 1] as any).$id);
      } else {
        setLastCursor(null);
      }
      setTotalCount(prev => isLoadMore ? prev : docs.length);
      
      setCategories(cr.documents as unknown as Category[]);
      setSubcategories(subRes.documents as unknown as Subcategory[]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerSearch = async (searchTerm: string) => {
    load(false, null, searchTerm, catFilter, subCatFilter, stockFilter);
  };

  useEffect(() => {
    let initialSearch = search;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const querySearch = params.get('search');
      if (querySearch) {
        initialSearch = querySearch;
        setSearch(querySearch);
      }
    }
    const cacheKey = `admin_products_${initialSearch.trim()}_${catFilter}_${subCatFilter}_${stockFilter}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.products && parsed.products.length > 0) {
          setProducts(parsed.products);
          setCategories(parsed.categories || []);
          setSubcategories(parsed.subcategories || []);
          setTotalCount(parsed.totalCount || parsed.products.length);
          setLastCursor(parsed.lastCursor || null);
          setIsLoading(false);
          return;
        }
      } catch {}
    }
    load(false, null, initialSearch, catFilter, subCatFilter, stockFilter);
  }, [catFilter, subCatFilter, stockFilter, load]);

  useEffect(() => {
    if (isLoading || products.length === 0) return;
    const cacheKey = `admin_products_${search.trim()}_${catFilter}_${subCatFilter}_${stockFilter}`;
    sessionStorage.setItem(cacheKey, JSON.stringify({
      products,
      categories,
      subcategories,
      totalCount,
      lastCursor
    }));
  }, [products, categories, subcategories, totalCount, lastCursor, search, catFilter, subCatFilter, stockFilter, isLoading]);

  useEffect(() => {
    const handler = () => load(false, null, search, catFilter, subCatFilter, stockFilter);
    window.addEventListener('yaxsel-data-change', handler);
    return () => window.removeEventListener('yaxsel-data-change', handler);
  }, [search, catFilter, subCatFilter, stockFilter, load]);

  const sendKeniaMessage = async () => {
    if (!KeniaInput.trim() || KeniaLoading) return;
    const userMsg = KeniaInput.trim();
    setKeniaInput('');
    const contextPrefix = modal ? `[Contexto: Estoy editando el producto "${modal.data.NAME}" (ID: ${(modal.data as Product).$id}, Precio: ${modal.data.PRICE}, Stock: ${modal.data.STOCK}, Categoría: ${categories.find(c => c.$id === modal.data.CATEGORYID)?.name || 'Sin categoría'})] ` : '';
    const newMessages = [...KeniaMessages, { role: 'user', content: contextPrefix + userMsg }];
    setKeniaMessages(newMessages);
    setKeniaLoading(true);
    try {
      const res = await fetch('/api/ai-sidekick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const assistantMsg = data.text || data.response || data.message || 'No pude procesar la solicitud.';
      setKeniaMessages(prev => [...prev, { role: 'assistant', content: assistantMsg }]);
      // Execute actions if present
      if (data.actions) {
        for (const action of data.actions) {
          if (action.type === 'update' && modal) {
            // Apply updates to the current product being edited
            setModal(m => m ? { ...m, data: { ...m.data, ...action.data } } : m);
          }
        }
      }
      // Check for inline action tags and execute them
      const createMatch = assistantMsg.match(/\[ACTION:CREATE_PRODUCT\]([\s\S]*?)\[\/ACTION\]/);
      const updateMatch = assistantMsg.match(/\[ACTION:UPDATE_PRODUCT\]([\s\S]*?)\[\/ACTION\]/);
      const deleteMatch = assistantMsg.match(/\[ACTION:DELETE_PRODUCT\]([\s\S]*?)\[\/ACTION\]/);
      if (createMatch || updateMatch || deleteMatch) {
        try {
          if (createMatch) {
            const actionData = JSON.parse(createMatch[1]);
            const res = await fetch('/api/products/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: actionData.name,
                price: actionData.price || 0,
                description: actionData.description || '',
                category: actionData.category || '',
                stock: actionData.stock || 0,
                tags: actionData.tags || '',
                sku: actionData.sku || '',
                barcode: actionData.barcode || '',
              }),
            });
            const result = await res.json();
            if (result.success) {
              setKeniaMessages(prev => [...prev, { role: 'assistant', content: `✅ Producto "${actionData.name}" creado exitosamente.` }]);
              load();
            } else {
              setKeniaMessages(prev => [...prev, { role: 'assistant', content: `❌ Error al crear: ${result.error}` }]);
            }
          } else if (updateMatch) {
            const actionData = JSON.parse(updateMatch[1]);
            if (modal) {
              setModal(m => m ? { ...m, data: { ...m.data, ...actionData } } : m);
            } else if (actionData.name) {
              const res = await fetch('/api/products/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actionData),
              });
              const result = await res.json();
              if (result.success) {
                setKeniaMessages(prev => [...prev, { role: 'assistant', content: `✅ Producto "${actionData.name}" actualizado.` }]);
              } else {
                setKeniaMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${result.error}` }]);
              }
            }
            load();
          } else if (deleteMatch) {
            const actionData = JSON.parse(deleteMatch[1]);
            const res = await fetch('/api/products/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: actionData.name }),
            });
            const result = await res.json();
            if (result.success) {
              setKeniaMessages(prev => [...prev, { role: 'assistant', content: `🗑️ Producto "${actionData.name}" eliminado.` }]);
              load();
            } else {
              setKeniaMessages(prev => [...prev, { role: 'assistant', content: `❌ Error al eliminar: ${result.error}` }]);
            }
          }
        } catch (e) {
          console.error('Error executing inline action:', e);
        }
      }
    } catch {
      setKeniaMessages(prev => [...prev, { role: 'assistant', content: 'Error al conectar con Kenia.' }]);
    } finally {
      setKeniaLoading(false);
    }
  };

  const openAdd = () => {
    // En PC (md+), mostrar modal de selección primero
    if (window.innerWidth >= 768) {
      setShowAddChoice(true);
      return;
    }
    setModal({ mode: 'add', data: { ...EMPTY, _barcode: '', _sku: '', _details: '', _usage: '', _ingredients: '' } });
  };
  const openAddManual = () => {
    setShowAddChoice(false);
    setModal({ mode: 'add', data: { ...EMPTY, _barcode: '', _sku: '', _details: '', _usage: '', _ingredients: '' } });
  };
  const openAddWithAI = () => {
    setShowAddChoice(false);
    setAiWizard({ step: 'prices', refImage: '', cost: 0, price: 0, catalogPrice: 0, marginPct: '', catalogPct: '', imgUrls: [] });
  };
  const aiWizardContinue = () => {
    if (!aiWizard) return;
    setAiWizard(w => w ? { ...w, step: 'images' } : w);
  };
  const aiWizardFinish = async () => {
    if (!aiWizard) return;
    const baseData = { ...EMPTY, COST: aiWizard.cost, PRICE: aiWizard.price, WHOLESALEPRICE: aiWizard.price, CATALOGPRICE: aiWizard.catalogPrice || 0, IMAGEURL: aiWizard.imgUrls[0] || aiWizard.refImage || '', IMAGEURL2: aiWizard.imgUrls[1] || '', IMAGEURL3: aiWizard.imgUrls[2] || '', _barcode: '', _sku: '', _details: '', _usage: '', _ingredients: '' };
    setAiWizard(null);
    setModal({ mode: 'add', data: baseData });
    setAiAutoEnhance(true);
  };

  // Función unificada: toma la primera imagen, busca similares, las selecciona y autocompleta todo
  const aiEnhanceProduct = useCallback(async () => {
    if (!modal) return;
    const rawFirstImage = getModalImageUrls(modal.data)[0];
    if (!rawFirstImage) {
      // Sin imagen, solo generar contenido
      generateAllProductContent();
      return;
    }
    // Resolver la URL de la imagen (file ID de Appwrite -> URL completa)
    const firstImage = resolveStorageImageUrl(rawFirstImage);
    setAiLoading('all');
    try {
      // 1. Buscar imágenes similares
      const searchRes = await fetch('/api/vision-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: firstImage }),
      });
      const searchData = await searchRes.json();
      if (searchData.error) throw new Error(searchData.error);
      const similarUrls: string[] = (searchData.images || []).slice(0, 2).map((img: any) => img.url);

      // 2. Importar las imágenes similares (subirlas a Appwrite)
      // Mantener la imagen original (raw) como primera, y añadir las similares
      const newImageUrls: string[] = [rawFirstImage];
      for (const url of similarUrls) {
        if (newImageUrls.length >= 3) break;
        try {
          const proxyRes = await fetch(`/api/vision-similar?url=${encodeURIComponent(url)}`);
          if (!proxyRes.ok) continue;
          const blob = await proxyRes.blob();
          const file = new File([blob], `ai-${Date.now()}-${Math.random()}.jpg`, { type: blob.type || 'image/jpeg' });
          const { storage } = getServices();
          const { endpoint, projectId } = getAppwriteConfig();
          const fileId = ID.unique();
          await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
          const uploadedUrl = `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
          newImageUrls.push(uploadedUrl);
        } catch { /* skip failed image */ }
      }

      // 3. Actualizar imágenes en el modal
      setModal(m => m ? {
        ...m,
        data: {
          ...m.data,
          IMAGEURL: newImageUrls[0] || m.data.IMAGEURL || '',
          IMAGEURL2: newImageUrls[1] || m.data.IMAGEURL2 || '',
          IMAGEURL3: newImageUrls[2] || m.data.IMAGEURL3 || '',
        },
      } : m);

      // 4. Generar todo el contenido con IA
      await new Promise(r => setTimeout(r, 300));
      generateAllProductContent();
    } catch (e: any) {
      // Si falla la búsqueda de imágenes, al menos generar el contenido
      generateAllProductContent();
    } finally {
      setAiLoading(null);
    }
  }, [modal, generateAllProductContent]);

  // Auto-enhance cuando se abre el modal con aiAutoEnhance y hay imagen
  useEffect(() => {
    if (modal && aiAutoEnhance) {
      const firstImage = getModalImageUrls(modal.data)[0];
      if (firstImage) {
        setAiAutoEnhance(false);
        const timer = setTimeout(() => aiEnhanceProduct(), 600);
        return () => clearTimeout(timer);
      }
    }
  }, [modal, aiAutoEnhance, aiEnhanceProduct]);
  const openEdit = (p: Product) => {
    const tabs = getCustomTabsFromFeatures(p.FEATURES) ?? {};
    setModal({
      mode: 'edit',
      data: {
        ...p,
        _barcode: getBarcodeFromFeatures(p.FEATURES, p.barcode),
        _sku: getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku),
        _details: tabs.details || '',
        _usage: tabs.usage || '',
        _ingredients: tabs.ingredients || '',
        DISABLE_DISCOUNTS: getDisableDiscountsFromFeatures(p.FEATURES),
      },
    });
  };

  const enhanceProductWithAI = (p: Product) => {
    const tabs = getCustomTabsFromFeatures(p.FEATURES) ?? {};
    setModal({
      mode: 'edit',
      data: {
        ...p,
        _barcode: getBarcodeFromFeatures(p.FEATURES, p.barcode),
        _sku: getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku),
        _details: tabs.details || '',
        _usage: tabs.usage || '',
        _ingredients: tabs.ingredients || '',
        DISABLE_DISCOUNTS: getDisableDiscountsFromFeatures(p.FEATURES),
      },
    });
    setAiAutoEnhance(true);
  };

  const duplicate = (p: Product) => {
    const sku = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku);
    const barcode = getBarcodeFromFeatures(p.FEATURES, p.barcode);
    const tabs = getCustomTabsFromFeatures(p.FEATURES) ?? {};
    setModal({
      mode: 'add',
      data: {
        ...p,
        $id: undefined as any,
        NAME: `${p.NAME} (copia)`,
        _sku: sku ? `${sku}-copia` : '',
        _barcode: barcode || '',
        _details: tabs.details || '',
        _usage: tabs.usage || '',
        _ingredients: tabs.ingredients || '',
      },
    });
  };

  const save = async () => {
    if (!modal) return;
    const d = modal.data;
    if (!d.NAME?.trim()) { alert('El nombre es requerido'); return; }
    if (!d.PRICE || Number(d.PRICE) <= 0) { alert('El Precio es obligatorio'); return; }
    if (d._sku?.trim()) {
      const skuInput = d._sku.trim().toLowerCase();
      
      // 1. General check for new products (add mode)
      if (modal.mode === 'add') {
        const skuExists = products.some(p => {
          const pSku = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku);
          return pSku.toLowerCase() === skuInput;
        });
        if (skuExists) {
          alert(`Ya existe un producto con el SKU "${d._sku}". Por favor, ingresa uno diferente.`);
          return;
        }
      }
      
      // 2. Prevent duplicate SKUs in products with stock (add or edit mode)
      const newStock = Math.round(Number(d.STOCK)) || 0;
      if (newStock > 0) {
        const duplicateSkuWithStock = products.find(p => {
          if (modal.mode === 'edit' && p.$id === (d as Product).$id) return false;
          const pStock = p.STOCK ?? 0;
          if (pStock <= 0) return false;
          const pSku = getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku);
          return pSku.toLowerCase() === skuInput;
        });
        if (duplicateSkuWithStock) {
          alert(`Ya existe otro producto CON STOCK ("${duplicateSkuWithStock.NAME}") que utiliza el SKU "${d._sku}". No se permiten SKUs duplicados en productos con stock activo.`);
          return;
        }
      }
    }
    setIsSaving(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const payload: Record<string, any> = {
        NAME: d.NAME, DESCRIPTION: d.DESCRIPTION || '',
        PRICE: Math.round(Number(d.PRICE)) || Math.round(Number(d.CATALOGPRICE)) || 0,
        STOCK: (d.STOCK === undefined || d.STOCK === null || Number(d.STOCK) === 0) ? 99999 : Math.round(Number(d.STOCK)),
        COST: Math.round(Number(d.COST)) || 0,
        CURRENTPRICE: d.CURRENTPRICE ? Math.round(Number(d.CURRENTPRICE)) : null,
        WHOLESALEPRICE: Math.round(Number(d.WHOLESALEPRICE)) || 0,
        CATALOGPRICE: Math.round(Number(d.CATALOGPRICE)) || Math.round(Number(d.PRICE)) || 0,
        WHOLESALEMINQUANTITY: Math.round(Number(d.WHOLESALEMINQUANTITY)) || 0,
        PACKQTY: Math.round(Number(d.PACKQTY)) || 0,
        BOXPRICE: Math.round(Number(d.BOXPRICE)) || 0,
        BOXQTY: Math.round(Number(d.BOXQTY)) || 0,
        IMAGEURL: d.IMAGEURL || '', IMAGEURL2: d.IMAGEURL2 || '',
        IMAGEURL3: d.IMAGEURL3 || '',
        CATEGORYID: d.CATEGORYID || '',
        SUBCATEGORYID: d.SUBCATEGORYID || '',
        SUBSUBCATEGORYID: d.SUBSUBCATEGORYID || '',
      };
      // Campos opcionales que pueden no existir en el schema
      const optionalFields: Record<string, any> = {
        TAGS: typeof d.TAGS === 'string' ? d.TAGS.split(',').map((t: string) => t.trim()).filter(Boolean) : (d.TAGS || []),
        FEATURES: (() => {
          let features = d.FEATURES || '';
          features = setSkuInFeatures(features, d._sku || '');
          features = setBarcodeInFeatures(features, d._barcode || '');
          features = setDisableDiscountsInFeatures(features, !!d.DISABLE_DISCOUNTS);
          if ((d as Product).section != null) {
            features = setSectionInFeatures(features, (d as Product).section!);
          }
          const tabs = {
            details: d._details || '',
            usage: d._usage || '',
            ingredients: d._ingredients || '',
          };
          features = setCustomTabsInFeatures(features, tabs);
          return typeof features === 'string' ? features.split('\n').filter(Boolean) : features;
        })(),
        barcode: d._barcode || '',
        sku: d._sku || '',
      };
      if ((d as Product).section != null) optionalFields.section = (d as Product).section;
      // IMAGEURL4/5 no existen en el schema — no enviarlos
      
      // Check if stock is being restocked (from 0 to >0) on edit
      let stockRestocked = false;
      const previousProduct = modal.mode === 'edit' ? products.find(p => p.$id === (d as Product).$id) : null;
      if (previousProduct && (previousProduct.STOCK ?? 0) === 0 && payload.STOCK > 0) {
        stockRestocked = true;
      }

      const doSave = async (data: Record<string, any>) => {
        if (modal.mode === 'add') {
          const nameLower = (data.NAME || '').toLowerCase().trim();
          const duplicate = products.find(p => p.NAME?.toLowerCase().trim() === nameLower);
          if (duplicate && !window.confirm(`Ya existe un producto con el nombre "${duplicate.NAME}". ¿Continuar de todas formas?`)) { setIsSaving(false); throw new Error('cancelled'); }
          const doc = await databases.createDocument(databaseId, PRODUCTS_COLLECTION_ID, ID.unique(), data);
          setProducts(prev => [doc as unknown as Product, ...prev]);
        } else {
          const doc = await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, (d as Product).$id, data);
          setProducts(prev => prev.map(p => p.$id === (d as Product).$id ? doc as unknown as Product : p));
        }
      };

      // Loop to dynamically remove unknown attributes if rejected by Appwrite
      // Quitar atributos que no existen en la colección de una vez
      const unknownAttrs = ['BOXPRICE', 'BOXQTY', 'SUBSUBCATEGORYID', 'barcode', 'sku', 'DISABLE_DISCOUNTS'];
      let currentPayload = { ...payload, ...optionalFields };
      unknownAttrs.forEach(attr => { delete currentPayload[attr]; });

      let success = false;
      let attempts = 0;

      while (!success && attempts < 4) {
        try {
          await doSave(currentPayload);
          success = true;
        } catch (err: any) {
          if (err?.message === 'cancelled') throw err;
          if (err?.message?.includes('Unknown attribute') || err?.message?.includes('unknown attribute')) {
            const match = err.message.match(/attribute:\s*"?([a-zA-Z0-9_$]+)"?/i);
            if (match && match[1]) {
              const attr = match[1];
              console.warn(`[Save Fallback] Removing unknown attribute: ${attr}`);
              delete currentPayload[attr];
              attempts++;
            } else {
              // Si no podemos determinar el atributo, intentar con el payload básico
              currentPayload = { ...payload };
              attempts = 7;
            }
          } else {
            throw err;
          }
        }
      }
      
      // Auto-add to cart & notify users who requested this product
      if (stockRestocked && (d as Product).$id) {
        try {
          const res = await fetch('/api/stock-alerts/auto-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: (d as Product).$id,
              productName: d.NAME,
              productImage: d.IMAGEURL || '',
              productPrice: d.PRICE || 0,
            }),
          });
          const data = await res.json();
          if (data.autoAdded > 0) {
            console.log(`✅ Auto-agregado al carrito de ${data.autoAdded} usuarios, producto "${d.NAME}"`);
          }
        } catch (alertErr) {
          console.error('Error auto-adding to cart:', alertErr);
        }
      }
      
      localStorage.removeItem('mobile-editor-state');
      setModal(null);
      invalidateProductCache();
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setIsSaving(false); }
  };

  
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const deleteAll = async () => {
    if (!confirm(`⚠️ ¿Eliminar TODOS los ${products.length} productos? Esta acción no se puede deshacer.`)) return;
    const confirmText = window.prompt(`Escribe ELIMINAR para confirmar:`);
    if (confirmText !== 'ELIMINAR') { alert('Cancelado.'); return; }
    setIsDeletingAll(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      let deleted = 0;
      for (const p of products) {
        await databases.deleteDocument(databaseId, PRODUCTS_COLLECTION_ID, p.$id);
        deleted++;
      }
      setProducts([]);
      alert(`✅ ${deleted} productos eliminados.`);
      invalidateProductCache();
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setIsDeletingAll(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Realmente deseas eliminar este producto? Esta acción no se puede deshacer.')) return;
    setDeleteId(id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      
      console.log('Intentando eliminar producto:', id, 'en BD:', databaseId);
      
      await databases.deleteDocument(databaseId, PRODUCTS_COLLECTION_ID, id);
      setProducts(prev => prev.filter(p => p.$id !== id));
      invalidateProductCache();
      
      // Opcional: mostrar un toast o alert de éxito silencioso
      console.log('Producto eliminado con éxito');
    } catch (e: any) {
      console.error('Error al eliminar producto:', e);
      alert('Error al eliminar: ' + (e.response?.message || e.message || 'Error desconocido de Appwrite'));
    } finally {
      setDeleteId(null);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
  const catName = (id?: string) => categories.find(c => c.$id === id)?.name || '—';

  const saveImageDrawer = async () => {
    if (!imageDrawer) return;
    setImageDrawerSaving(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const payload: Record<string, any> = {};
      if (imageDrawer.img1 !== imageDrawer.origImg1) payload.IMAGEURL = imageDrawer.img1;
      if (imageDrawer.img2 !== imageDrawer.origImg2) payload.IMAGEURL2 = imageDrawer.img2;
      if (imageDrawer.img3 !== imageDrawer.origImg3) payload.IMAGEURL3 = imageDrawer.img3;
      // IMAGEURL4/5 no existen en el schema — no enviarlos
      if (imageDrawer.description !== imageDrawer.origDescription) payload.DESCRIPTION = imageDrawer.description;
      if (imageDrawer.features !== imageDrawer.origFeatures) {
        const feats = imageDrawer.features.split('\n').map((s: string) => s.trim()).filter(Boolean);
        payload.FEATURES = feats;
      }
      if (imageDrawer.tags !== imageDrawer.origTags) {
        const tags = imageDrawer.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
        payload.TAGS = tags;
      }
      if (imageDrawer.sku !== imageDrawer.origSku) payload.SKU = imageDrawer.sku;
      if (imageDrawer.price !== imageDrawer.origPrice) payload.PRICE = Number(imageDrawer.price);
      if (imageDrawer.stock !== imageDrawer.origStock) payload.STOCK = Number(imageDrawer.stock);
      if (Object.keys(payload).length > 0) {
        await databases.updateDocument(databaseId, PRODUCTS_COLLECTION_ID, imageDrawer.productId, payload);
        setProducts(prev => prev.map(p => p.$id === imageDrawer.productId ? { ...p, ...payload } : p));
        invalidateProductCache();
      }
      setImageDrawer(null);
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setImageDrawerSaving(false); }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Costo', 'Margen %', 'Precio Mayorista', 'Mín. Mayorista', 'Vendidos', 'Destacado', 'URL Imagen'];
    const rows = filtered.map(p => [
      p.$id, p.NAME || '', p.DESCRIPTION || '',
      p.PRICE, p.STOCK ?? 0, catName(p.CATEGORYID),
      p.COST || 0,
      p.COST && p.PRICE ? Math.round(((p.PRICE - p.COST) / p.PRICE) * 100) : '',
      p.WHOLESALEPRICE || 0, p.WHOLESALEMINQUANTITY || 0,
      p.SOLDQUANTITY || 0, p.IMAGEURL || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `productos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportShopifyCSV = async () => {
    const btn = document.getElementById('btn-export-shopify');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.setAttribute('disabled', 'true');
      btn.innerHTML = '⏳ Exportando...';
    }

    try {
      const res = await fetch('/api/public-data/products?limit=5000&includeOutOfStock=true').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      });
      const allExportProducts = res.products || [];

      if (allExportProducts.length === 0) {
        alert('No se encontraron productos para exportar.');
        return;
      }

      const slugify = (text: string) => {
        return text
          .toString()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
      };

      const headers = [
        'Title', 'URL handle', 'Description', 'Vendor', 'Product category', 'Type', 'Tags',
        'Published on online store', 'Status', 'SKU', 'Barcode',
        'Option1 name', 'Option1 value', 'Option1 Linked To',
        'Option2 name', 'Option2 value', 'Option2 Linked To',
        'Option3 name', 'Option3 value', 'Option3 Linked To',
        'Price', 'Compare-at price', 'Cost per item', 'Charge tax', 'Tax code',
        'Unit price total measure', 'Unit price total measure unit',
        'Unit price base measure', 'Unit price base measure unit',
        'Inventory tracker', 'Inventory quantity', 'Continue selling when out of stock',
        'Weight value (grams)', 'Weight unit for display', 'Requires shipping', 'Fulfillment service',
        'Product image URL', 'Image position', 'Image alt text', 'Variant image URL',
        'Gift card', 'SEO title', 'SEO description',
        'Color (product.metafields.shopify.color-pattern)',
        'Google Shopping / Google product category', 'Google Shopping / Gender',
        'Google Shopping / Age group', 'Google Shopping / Manufacturer part number (MPN)',
        'Google Shopping / Ad group name', 'Google Shopping / Ads labels',
        'Google Shopping / Condition', 'Google Shopping / Custom product',
        'Google Shopping / Custom label 0', 'Google Shopping / Custom label 1',
        'Google Shopping / Custom label 2', 'Google Shopping / Custom label 3',
        'Google Shopping / Custom label 4'
      ];

      const rows: string[][] = [];

      // Group products by GROUPID to support Shopify variants
      const groups: Record<string, Product[]> = {};
      const standalone: Product[] = [];

      allExportProducts.forEach((p: any) => {
        const gid = p.GROUPID?.trim();
        if (gid) {
          if (!groups[gid]) groups[gid] = [];
          groups[gid].push(p);
        } else {
          standalone.push(p);
        }
      });

      const addProductRows = (parent: Product, isVariant: boolean, variantVal?: string, variantImg?: string) => {
        const handle = slugify(parent.NAME);
        const title = isVariant ? '' : parent.NAME;
        const desc = isVariant ? '' : (parent.DESCRIPTION || '');
        const vendor = isVariant ? '' : 'Don Balato Iván';
        const category = isVariant ? '' : '';
        const type = isVariant ? '' : catName(parent.CATEGORYID);
        const tags = isVariant ? '' : (parent.TAGS || '');
        const status = isVariant ? '' : (parent.ISACTIVE !== false ? 'active' : 'draft');
        const published = isVariant ? '' : 'TRUE';
        const optName = isVariant ? 'Title' : (variantVal ? 'Title' : 'Title');
        const optVal = variantVal || 'Default Title';

        const sku = getSku(parent);
        const barcode = getBarcode(parent) || '';

        let price = parent.PRICE;
        let compareAtPrice = '';
        if (parent.CURRENTPRICE && parent.CURRENTPRICE > 0 && parent.CURRENTPRICE < parent.PRICE) {
          price = parent.CURRENTPRICE;
          compareAtPrice = String(parent.PRICE);
        }

        const cost = parent.COST ? String(parent.COST) : '';

        // Main image for this row
        const mainImg = variantImg || parent.IMAGEURL || '';

        const row = Array(57).fill('');
        row[0] = title;
        row[1] = handle;
        row[2] = desc;
        row[3] = vendor;
        row[4] = category;
        row[5] = type;
        row[6] = tags;
        row[7] = published;
        row[8] = status;
        row[9] = sku;
        row[10] = barcode;
        row[11] = optName;
        row[12] = optVal;
        row[20] = String(price);
        row[21] = compareAtPrice;
        row[22] = cost;
        row[23] = 'TRUE';
        row[29] = 'shopify';
        row[30] = String(parent.STOCK ?? 0);
        row[31] = 'DENY';
        row[34] = 'TRUE';
        row[35] = 'manual';
        if (variantImg) {
          row[39] = variantImg; // Variant image URL
        } else {
          row[36] = mainImg; // Product image URL
          row[37] = mainImg ? '1' : '';
        }
        row[40] = 'FALSE';

        rows.push(row);

        // Add extra images if not a variant
        if (!isVariant) {
          let imgPos = 2;
          [parent.IMAGEURL2, parent.IMAGEURL3].filter(Boolean).forEach(url => {
            const imgRow = Array(57).fill('');
            imgRow[1] = handle;
            imgRow[36] = url;
            imgRow[37] = String(imgPos++);
            rows.push(imgRow);
          });
        }
      };

      // Process standalone
      standalone.forEach(p => {
        addProductRows(p, false);
      });

      // Process grouped variants
      Object.values(groups).forEach(group => {
        if (group.length === 0) return;
        const parent = group[0];
        
        // Main row (Variant 1)
        addProductRows(parent, false, parent.NAME, parent.IMAGEURL || '');

        // Subsequent variant rows
        group.slice(1).forEach(v => {
          addProductRows(v, true, v.NAME, v.IMAGEURL || '');
        });
      });

      const cleanVal = (val: any) => {
        if (val === null || val === undefined) return '';
        return String(val).replace(/\r/g, '');
      };

      const csvContent = [headers, ...rows]
        .map(r => r.map(v => `"${cleanVal(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopify_export_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('Error al exportar para Shopify: ' + e.message);
    } finally {
      if (btn) {
        btn.removeAttribute('disabled');
        btn.innerHTML = originalText;
      }
    }
  };

  const getSku = (p: Product) =>
    getSkuFromFeatures(p.FEATURES, p.TAGS, p.jumpseller_id, p.sku) || p.$id;

  const getBarcode = (p: Product) => getBarcodeFromFeatures(p.FEATURES, p.barcode);

  const getSection = (p: Product): { section: number; gondola: string } | null => {
    const loc = getWarehouseLocationFromFeatures(p.FEATURES, p.section ?? null);
    if (loc.section === null) return null;
    return { section: loc.section, gondola: loc.gondola || '?' };
  };

  const exportXLSX = () => {
    const data = filtered.map(p => ({
      SKU: getSku(p), 'Código de barras': getBarcode(p) || '', ID: p.$id, Nombre: p.NAME || '', Descripción: p.DESCRIPTION || '',
      Precio: p.PRICE, Stock: p.STOCK ?? 0, Categoría: catName(p.CATEGORYID),
      Costo: p.COST || 0,
      'Margen %': p.COST && p.PRICE ? Math.round(((p.PRICE - p.COST) / p.PRICE) * 100) : '',
      'Precio Mayorista': p.WHOLESALEPRICE || 0,
      'Mín. Mayorista': p.WHOLESALEMINQUANTITY || 0,
      'Vendidos': p.SOLDQUANTITY || 0,
      'Sección': getSection(p)?.section ?? '',
      'Góndola': getSection(p)?.gondola ?? '',
      'URL Imagen': p.IMAGEURL || '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, `productos_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const [isExportingAllXLSX, setIsExportingAllXLSX] = useState(false);

  const exportAllXLSX = async () => {
    setIsExportingAllXLSX(true);
    try {
      const allProducts = await fetchAllProductsForExport();
      if (allProducts.length === 0) {
        alert('No se encontraron productos para exportar.');
        return;
      }
      const data = allProducts.map(p => ({
        SKU: getSku(p),
        'Código de barras': getBarcode(p) || '',
        ID: p.$id,
        Nombre: p.NAME || '',
        Descripción: p.DESCRIPTION || '',
        Precio: p.PRICE,
        Stock: p.STOCK ?? 0,
        Categoría: catName(p.CATEGORYID),
        Costo: p.COST || 0,
        'Margen %': p.COST && p.PRICE ? Math.round(((p.PRICE - p.COST) / p.PRICE) * 100) : '',
        'Precio Mayorista': p.WHOLESALEPRICE || 0,
        'Mín. Mayorista': p.WHOLESALEMINQUANTITY || 0,
        'Vendidos': p.SOLDQUANTITY || 0,
        'Sección': getSection(p)?.section ?? '',
        'Góndola': getSection(p)?.gondola ?? '',
        'URL Imagen': p.IMAGEURL || '',
        'URL Imagen 2': p.IMAGEURL2 || '',
        'URL Imagen 3': p.IMAGEURL3 || '',
        'Tags': Array.isArray(p.TAGS) ? p.TAGS.join(', ') : (p.TAGS || ''),
        'Activo': p.ISACTIVE !== false ? 'Sí' : 'No',
        'Destacado': p.ISFEATURED ? 'Sí' : 'No',
        'Fecha creación': p.$createdAt || '',
        'Fecha actualización': p.$updatedAt || '',
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Productos');
      XLSX.writeFile(wb, `productos_completos_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (e: any) {
      alert('Error al exportar todos los productos: ' + e.message);
    } finally {
      setIsExportingAllXLSX(false);
    }
  };

  const fetchAllProductsForExport = async (): Promise<Product[]> => {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    const all: Product[] = [];
    let lastId: string | null = null;
    const limit = 100;

    while (true) {
      const queries: any[] = [Query.limit(limit), Query.orderAsc('$id')];
      if (lastId) queries.push(Query.cursorAfter(lastId));
      const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, queries);
      if (res.documents.length === 0) break;
      all.push(...(res.documents as unknown as Product[]));
      lastId = res.documents[res.documents.length - 1].$id;
      if (res.documents.length < limit) break;
    }
    return all;
  };

  const exportInventoryPDF = async () => {
    setIsExportingPDF(true);
    setPdfExportProgress({ current: 0, total: 0 });

    let productsToExport: Product[] = [];
    try {
      productsToExport = await fetchAllProductsForExport();
    } catch (e: any) {
      alert('Error al obtener todos los productos: ' + e.message);
      setIsExportingPDF(false);
      return;
    }

    if (productsToExport.length === 0) {
      alert('No hay productos para exportar');
      setIsExportingPDF(false);
      return;
    }

    setPdfExportProgress({ current: 0, total: productsToExport.length });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const cols = 5;
      const rows = 10;
      const cellWidth = (pageWidth - 2 * margin) / cols;
      const cellHeight = (pageHeight - 2 * margin) / rows;
      const textBlockHeight = 9; // space reserved for SKU + stock lines
      const imgSize = Math.min(cellWidth - 4, cellHeight - textBlockHeight - 2);
      const imgOffsetX = (cellWidth - imgSize) / 2;

      let itemsOnPage = 0;

      // Pre-fetch images in batches to speed things up while keeping memory reasonable
      const BATCH_SIZE = 25;
      for (let batchStart = 0; batchStart < productsToExport.length; batchStart += BATCH_SIZE) {
        const batch = productsToExport.slice(batchStart, batchStart + BATCH_SIZE);
        const batchImages = await Promise.all(batch.map(async p => {
          const imgUrl = p.IMAGEURL || p.IMAGEURL2 || p.IMAGEURL3;
          if (!imgUrl) return null;
          try {
            return await loadImageAsBase64(imgUrl);
          } catch {
            return null;
          }
        }));

        for (let j = 0; j < batch.length; j++) {
          const p = batch[j];
          const imgData = batchImages[j];
          const sku = getSku(p);

          if (itemsOnPage >= cols * rows) {
            pdf.addPage();
            itemsOnPage = 0;
          }

          const col = itemsOnPage % cols;
          const row = Math.floor(itemsOnPage / cols);
          const x = margin + col * cellWidth;
          const y = margin + row * cellHeight;

          // Draw cell border
          pdf.setDrawColor(200);
          pdf.setLineWidth(0.1);
          pdf.rect(x, y, cellWidth, cellHeight);

          const imgX = x + imgOffsetX;
          const imgY = y + 2;

          if (imgData) {
            try {
              const format = imgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
              pdf.addImage(imgData, format, imgX, imgY, imgSize, imgSize);
            } catch {
              pdf.setFillColor('#f0f0f0');
              pdf.rect(imgX, imgY, imgSize, imgSize, 'F');
              pdf.setFontSize(7);
              pdf.setTextColor('#969696');
              pdf.text('Sin imagen', x + cellWidth / 2, imgY + imgSize / 2, { align: 'center' });
            }
          } else {
            pdf.setFillColor('#f0f0f0');
            pdf.rect(imgX, imgY, imgSize, imgSize, 'F');
            pdf.setFontSize(7);
            pdf.setTextColor('#969696');
            pdf.text('Sin imagen', x + cellWidth / 2, imgY + imgSize / 2, { align: 'center' });
          }

          // Add SKU below image
          const textY = imgY + imgSize + 3.5;
          pdf.setFontSize(6.5);
          pdf.setTextColor('#000000');
          pdf.text(String(sku || p.$id), x + cellWidth / 2, textY, { align: 'center', maxWidth: cellWidth - 2 });

          // Add stock indicator
          const stock = p.STOCK ?? 0;
          pdf.setFontSize(6);
          if (stock === 0) {
            pdf.setTextColor('#ff0000');
            pdf.text('SIN STOCK', x + cellWidth / 2, textY + 3.5, { align: 'center' });
          } else if (stock < 10) {
            pdf.setTextColor('#ffa500');
            pdf.text(`Stock: ${stock}`, x + cellWidth / 2, textY + 3.5, { align: 'center' });
          } else {
            pdf.setTextColor('#009600');
            pdf.text(`Stock: ${stock}`, x + cellWidth / 2, textY + 3.5, { align: 'center' });
          }

          itemsOnPage++;
        }

        setPdfExportProgress({ current: Math.min(batchStart + BATCH_SIZE, productsToExport.length), total: productsToExport.length });
      }

      pdf.save(`inventario_imagenes_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e: any) {
      alert('Error al generar el PDF: ' + e.message);
    } finally {
      setIsExportingPDF(false);
      setPdfExportProgress({ current: 0, total: 0 });
    }
  };

  const loadImageAsBase64 = async (url: string): Promise<string> => {
    const res = await fetch(`/api/admin/proxy-image?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error('Proxy fetch failed');
    const data = await res.json();
    if (!data.dataUrl) throw new Error('No dataUrl in response');
    return data.dataUrl;
  };

  const toggleSort = (key: typeof sort.key) =>
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  const syncBrokenImages = async () => {
    if (products.length === 0) return;
    setSyncingImages(true);
    setBrokenImages({});
    setSyncProgress({ checked: 0, broken: 0 });
    const result: Record<string, string[]> = {};
    let checked = 0;
    let broken = 0;
    const BATCH = 10;
    const allImages = products.flatMap(p =>
      [p.IMAGEURL, p.IMAGEURL2, p.IMAGEURL3]
        .filter(Boolean)
        .map(url => ({ productId: p.$id, url: url! }))
    );
    for (let i = 0; i < allImages.length; i += BATCH) {
      const batch = allImages.slice(i, i + BATCH);
      await Promise.all(batch.map(async ({ productId, url }) => {
        try {
          const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
          // no-cors always returns opaque, so we need a different approach
          // Use img tag loading via promise
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => {
              if (!result[productId]) result[productId] = [];
              result[productId].push(url);
              broken++;
              resolve();
            };
            img.src = url;
          });
        } catch {
          if (!result[productId]) result[productId] = [];
          result[productId].push(url);
          broken++;
        }
      }));
      checked += batch.length;
      setSyncProgress({ checked, broken });
      setBrokenImages({ ...result });
    }
    setSyncingImages(false);
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const tagsStr = Array.isArray(p.TAGS) ? p.TAGS.join(', ') : (p.TAGS || '');
    const featuresStr = Array.isArray(p.FEATURES) ? p.FEATURES.join(', ') : (p.FEATURES || '');
    const matchSearch = !search || (
      p.NAME?.toLowerCase().includes(q) ||
      p.DESCRIPTION?.toLowerCase().includes(q) ||
      tagsStr.toLowerCase().includes(q) ||
      getSku(p).toLowerCase().includes(q) ||
      getBarcode(p).toLowerCase().includes(q) ||
      featuresStr.toLowerCase().includes(q)
    );
    const matchCat = !catFilter || p.CATEGORYID === catFilter;
    const matchSubCat = !subCatFilter || p.SUBCATEGORYID === subCatFilter;
    const matchStock = stockFilter === 'all' ? true
      : stockFilter === 'instock' ? (p.STOCK ?? 0) > 0
      : stockFilter === 'out' ? (p.STOCK ?? 0) === 0
      : (p.STOCK ?? 0) > 0 && (p.STOCK ?? 0) <= 10;
    const matchNoImage = !noImageOnly || !p.IMAGEURL;
    const matchBroken = !brokenOnly || brokenImages[p.$id]?.length;
    return matchSearch && matchCat && matchSubCat && matchStock && matchNoImage && matchBroken;
  }).sort((a, b) => {
    const liveA = getLiveStatus(a);
    const liveB = getLiveStatus(b);

    if (liveA && !liveB) return -1;
    if (!liveA && liveB) return 1;

    if (liveA && liveB) {
      // Both are in Live Shopping: sort by $createdAt descending
      const timeA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const timeB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return timeB - timeA;
    }

    // Default sorting for non-live products
    let av: number | string, bv: number | string;
    if (sort.key === 'MARGIN') {
      av = (a.COST && a.PRICE) ? ((a.PRICE - a.COST) / a.PRICE) : -1;
      bv = (b.COST && b.PRICE) ? ((b.PRICE - b.COST) / b.PRICE) : -1;
    } else if (sort.key === 'CREATED') {
      av = new Date(a.$createdAt || 0).getTime();
      bv = new Date(b.$createdAt || 0).getTime();
    } else {
      av = a[sort.key] ?? 0; bv = b[sort.key] ?? 0;
    }
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  const totalInventoryValue = filtered.reduce((sum, p) => sum + (p.STOCK ?? 0) * p.PRICE, 0);
  const totalCostValue = filtered.reduce((sum, p) => sum + (p.STOCK ?? 0) * (p.COST || 0), 0);
  const totalUnits = filtered.reduce((sum, p) => sum + (p.STOCK ?? 0), 0);
  const noImageCount = filtered.filter(p => !p.IMAGEURL).length;
  const lowStockCount = filtered.filter(p => (p.STOCK ?? 0) > 0 && (p.STOCK ?? 0) <= 10).length;
  const outStockCount = filtered.filter(p => (p.STOCK ?? 0) === 0).length;
  const withMargin = filtered.filter(p => p.COST && p.COST > 0 && p.PRICE > 0);
  const avgMargin = withMargin.length > 0
    ? Math.round(withMargin.reduce((sum, p) => sum + ((p.PRICE - (p.COST || 0)) / p.PRICE) * 100, 0) / withMargin.length)
    : null;
  const liveCount = filtered.filter(p => Boolean(getLiveStatus(p))).length;
  const activeFiltersCount = [Boolean(search), Boolean(catFilter), Boolean(subCatFilter), noImageOnly, brokenOnly, stockFilter !== 'instock'].filter(Boolean).length;

  return (
    <div className="space-y-5" style={{ background: '#ffffff', minHeight: '100%', padding: '20px', borderRadius: 12 }}>

      {/* ═══════════════════════════════════════════════════════════════
          FULL-PAGE PRODUCT EDITOR (replaces table when modal is active)
         ═══════════════════════════════════════════════════════════════ */}
      {modal && (
        <div className="hidden md:block min-h-[calc(100vh-140px)]">
          {/* AI waiting banner */}
          {aiAutoEnhance && !getModalImageUrls(modal.data)[0] && (
            <div className="mb-4 flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl p-3">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse shrink-0" />
              <p className="text-sm text-purple-700 font-medium">Sube una imagen del producto y la IA autocompletará todo automáticamente</p>
            </div>
          )}
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => { setModal(null); setKeniaOpen(false); setKeniaMessages([]); }} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{modal.mode === 'add' ? 'Nuevo Producto' : 'Editar Producto'}</h1>
                {modal.mode === 'edit' && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-400">ID: {(modal.data as Product).$id}</p>
                    <span className="text-gray-300">•</span>
                    <a
                      href={`/productos/${(modal.data as Product).$id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-900 hover:text-gray-900 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver en tienda
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {modal.mode === 'edit' && (
                <a
                  href={`/productos/${(modal.data as Product).$id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  title="Ver detalle del producto en la tienda"
                >
                  <Eye className="w-4 h-4" /> Ver Producto
                </a>
              )}
              <button onClick={() => setKeniaOpen(!KeniaOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${KeniaOpen ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'}`}>
                <MessageSquare className="w-4 h-4" /> Preguntar a Kenia
              </button>
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={save} disabled={isSaving} className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-60 flex items-center gap-2">
                {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Guardando...</> : 'Guardar'}
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Main editor area */}
            <div className={`flex-1 space-y-6 ${KeniaOpen ? 'max-w-[calc(100%-380px)]' : ''}`}>
              {/* Product image + basic info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-6 flex-col lg:flex-row">
                  {/* Image section with AI search */}
                  <div className="lg:w-80 shrink-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fotos del producto</label>
                    <ProductPhotoUploader
                      imageUrls={[modal.data.IMAGEURL || '', modal.data.IMAGEURL2 || '', modal.data.IMAGEURL3 || ''].filter(Boolean).slice(0, 3)}
                      onChange={urls => setModal(m => m ? { ...m, data: { ...m.data, IMAGEURL: urls[0] || '', IMAGEURL2: urls[1] || '', IMAGEURL3: urls[2] || '' } } : m)}
                      compact
                    />
                  </div>
                  {/* Name + Description */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700">Nombre del producto *</label>
                      </div>
                      <input value={modal.data.NAME || ''} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, NAME: e.target.value } } : m)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="Nombre del producto" />
                      {aiTitles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {aiTitles.map((t, i) => (
                            <button key={i} type="button" onClick={() => { setModal(m => m ? { ...m, data: { ...m.data, NAME: t } } : m); setAiTitles([]); }}
                              className="text-xs px-2.5 py-1 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-100 border border-gray-100 transition-colors truncate max-w-full">
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700">Descripción</label>
                      </div>
                      <textarea value={modal.data.DESCRIPTION || ''} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, DESCRIPTION: e.target.value } } : m)}
                        rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none" placeholder="Describe tu producto..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800" /> Precios e Inventario
                </h3>
                {/* ── Costo + Margen → Precio ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Costo (lo que pagas)</label>
                    <input type="number" value={modal.data.COST || ''} onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, COST: Number(e.target.value) || 0 } } : m)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-700 mb-1">Margen de ganancia (%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" inputMode="numeric"
                        value={desktopMarginPct}
                        placeholder="Ej: 100"
                        onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                        onChange={e => {
                          setDesktopMarginPct(e.target.value);
                          const pct = Number(e.target.value);
                          const cost = Number(modal.data.COST) || 0;
                          if (pct !== 0 && cost > 0) {
                            const price = Math.round(cost * (1 + pct / 100));
                            setModal(m => m ? { ...m, data: { ...m.data, PRICE: price, WHOLESALEPRICE: price } } : m);
                          }
                        }}
                        className="w-24 px-2 py-2 border border-emerald-300 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {modal.data.COST && modal.data.PRICE && (
                        <span className="text-xs font-semibold text-emerald-600">
                          Ganancia: ${(Number(modal.data.PRICE) - Number(modal.data.COST)).toLocaleString('es-CL')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Precio venta (CLP) <span className="text-red-500">*</span></label>
                    <input type="number" value={modal.data.PRICE || ''} onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, PRICE: Number(e.target.value) || 0, WHOLESALEPRICE: Number(e.target.value) || 0 } } : m)}
                      className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 ${!modal.data.PRICE ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                    {(() => {
                      const price = Number(modal.data.PRICE) || 0;
                      const cost = Number(modal.data.COST) || 0;
                      if (!price || !cost) return null;
                      const margin = Math.round(((price - cost) / price) * 100);
                      return (
                        <p className={`text-[10px] mt-1 font-medium ${margin >= 40 ? 'text-emerald-600' : margin >= 20 ? 'text-amber-600' : 'text-red-500'}`}>
                          Margen actual: {margin}%
                        </p>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 font-bold mb-1">Precio Catálogo (CLP) ✨</label>
                    <input type="number" value={modal.data.CATALOGPRICE || ''} onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, CATALOGPRICE: Number(e.target.value) || 0 } } : m)}
                      placeholder="Auto o manual"
                      className="w-full px-3 py-2 border border-amber-300 bg-amber-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold" />
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-amber-600 font-medium">% sobre costo:</span>
                      <input
                        type="number" inputMode="numeric"
                        value={desktopCatalogPct}
                        placeholder="Ej: 10"
                        onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                        onChange={e => {
                          setDesktopCatalogPct(e.target.value);
                          const pct = Number(e.target.value);
                          const cost = Number(modal.data.COST) || 0;
                          if (pct !== 0 && cost > 0) {
                            setModal(m => m ? { ...m, data: { ...m.data, CATALOGPRICE: Math.round(cost * (1 + pct / 100)) } } : m);
                          }
                        }}
                        className="w-16 px-1 py-0.5 border border-amber-300 rounded text-[10px] bg-white font-semibold text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      {modal.data.COST && modal.data.CATALOGPRICE && (
                        <span className="text-[10px] text-amber-500 font-medium">
                          Ganancia: ${(Number(modal.data.CATALOGPRICE) - Number(modal.data.COST)).toLocaleString('es-CL')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center justify-between">
                      <span>Stock</span>
                      <button
                        type="button"
                        onClick={() => setModal(m => m ? { ...m, data: { ...m.data, STOCK: 99999 } } : m)}
                        className="text-[10px] text-gray-900 hover:text-indigo-800 font-semibold underline"
                      >
                        Poner Ilimitado (99999)
                      </button>
                    </label>
                    <input type="number" value={modal.data.STOCK || ''} onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, STOCK: Number(e.target.value) || 0 } } : m)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                    {Number(modal.data.STOCK) === 99999 && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">✓ Stock Ilimitado (vender sin stock)</p>
                    )}
                    {Number(modal.data.STOCK) === 0 && (
                      <p className="text-xs text-indigo-500 mt-1 flex items-center gap-1">Se guardara como Ilimitado automaticamente</p>
                    )}
                    {Number(modal.data.STOCK) > 0 && Number(modal.data.STOCK) <= 5 && (
                      <p className="text-xs text-amber-500 mt-1">⚠ Stock bajo ({modal.data.STOCK} un.)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organization & Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Organización y Detalles
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
                    <div className="relative">
                      <select value={modal.data.CATEGORYID || ''} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, CATEGORYID: e.target.value, SUBCATEGORYID: '', SUBSUBCATEGORYID: '' } } : m)}
                        className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800">
                        <option value="">Sin categoría</option>
                        {categories.map(c => <option key={c.$id} value={c.$id}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subcategoría (Nivel 2)</label>
                    <div className="relative">
                      <select value={modal.data.SUBCATEGORYID || ''} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, SUBCATEGORYID: e.target.value, SUBSUBCATEGORYID: '' } } : m)}
                        disabled={!modal.data.CATEGORYID}
                        className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 disabled:opacity-50 disabled:bg-gray-100">
                        <option value="">Ninguna</option>
                        {subcategories.filter(s => s.categoryId === modal.data.CATEGORYID && !s.parentSubcategoryId).map(s => <option key={s.$id} value={s.$id}>{s.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cant. por paquete</label>
                    <input type="number" value={modal.data.PACKQTY ?? ''} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, PACKQTY: Number(e.target.value) } } : m)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
                    <input type="text" value={modal.data._sku ?? ''}
                      onChange={e => setModal(m => m ? { ...m, data: { ...m.data, _sku: e.target.value } } : m)}
                      placeholder="Código interno"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Código de barras</label>
                    <input type="text" value={modal.data._barcode ?? ''}
                      onChange={e => setModal(m => m ? { ...m, data: { ...m.data, _barcode: e.target.value } } : m)}
                      placeholder="EAN / UPC"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sección (ubicación)</label>
                    <input type="number" value={(modal.data as Product).section ?? ''}
                      onChange={e => setModal(m => m ? { ...m, data: { ...m.data, section: e.target.value ? Number(e.target.value) : undefined } } : m)}
                      placeholder="Ej: 5"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                  </div>
                  <div className="flex items-end">
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tags (separados por coma)</label>
                    <input type="text" value={Array.isArray(modal.data.TAGS) ? modal.data.TAGS.join(', ') : (modal.data.TAGS || '')} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, TAGS: e.target.value } } : m)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="tag1, tag2, tag3" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Características (otras)</label>
                    <input type="text" value={Array.isArray(modal.data.FEATURES) ? modal.data.FEATURES.join('\n') : (modal.data.FEATURES || '')} onChange={e => setModal(m => m ? { ...m, data: { ...m.data, FEATURES: e.target.value } } : m)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                    <p className="text-[10px] text-gray-400 mt-1">SKU y código de barras se guardan en los campos de arriba.</p>
                  </div>
                </div>
              </div>

              {/* Custom specs/info tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-800 animate-pulse" /> Pestañas de Información (Ficha Técnica)
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      Completa estos campos para mostrar pestañas dedicadas debajo de la descripción en el detalle de producto de Plantilla 5. Si los dejas vacíos, no se mostrarán.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-400" /> Detalles del Producto (Especificaciones / Características)
                    </label>
                    <textarea
                      rows={3}
                      value={modal.data._details || ''}
                      onChange={e => setModal(m => m ? { ...m, data: { ...m.data, _details: e.target.value } } : m)}
                      placeholder="Ej: Material: 100% Algodón Orgánico&#10;Dimensiones: 15cm x 10cm&#10;Peso: 250g"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-400" /> Modo de Uso (Instrucciones)
                    </label>
                    <textarea
                      rows={3}
                      value={modal.data._usage || ''}
                      onChange={e => setModal(m => m ? { ...m, data: { ...m.data, _usage: e.target.value } } : m)}
                      placeholder="Ej: Aplicar sobre la piel limpia por la mañana y por la noche. Masajear suavemente hasta su completa absorción."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-400" /> Ingredientes (Composición / Tabla Nutricional)
                    </label>
                    <textarea
                      rows={3}
                      value={modal.data._ingredients || ''}
                      onChange={e => setModal(m => m ? { ...m, data: { ...m.data, _ingredients: e.target.value } } : m)}
                      placeholder="Ej: Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Phenoxyethanol..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kenia side panel */}
            {KeniaOpen && (
              <div className="w-[360px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-xs font-bold">Y</div>
                    <span className="text-sm font-semibold text-gray-800">Kenia</span>
                    <span className="text-[10px] text-gray-400">para este producto</span>
                  </div>
                  <button onClick={() => setKeniaOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {KeniaMessages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-gray-800" />
                      </div>
                      <p className="text-sm text-gray-500">Pregúntale algo sobre este producto</p>
                      <p className="text-xs text-gray-400 mt-1">Kenia ya sabe qué producto estás editando</p>
                      <div className="mt-4 space-y-2">
                        {['Mejora la descripción', 'Sugiere un precio competitivo', 'Genera tags para SEO'].map(s => (
                          <button key={s} onClick={() => { setKeniaInput(s); }} className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {KeniaMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {KeniaLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-xl text-sm text-gray-500 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Pensando...
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input type="file" id="Kenia-file-input" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setKeniaLoading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        if (modal?.data?.$id) formData.append('productId', (modal.data as Product).$id);
                        formData.append('imageField', 'IMAGEURL');
                        const res = await fetch('/api/products/upload-image', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (data.success) {
                          setKeniaMessages(prev => [...prev, { role: 'user', content: '📷 Imagen enviada' }, { role: 'assistant', content: '✅ Imagen subida y asignada al producto.' }]);
                          if (modal?.data) setModal(m => m ? { ...m, data: { ...m.data, IMAGEURL: data.imageUrl } } : m);
                          load();
                        } else {
                          setKeniaMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${data.error}` }]);
                        }
                      } catch { setKeniaMessages(prev => [...prev, { role: 'assistant', content: '❌ Error al subir imagen.' }]); }
                      finally { setKeniaLoading(false); (e.target as HTMLInputElement).value = ''; }
                    }} />
                    <button onClick={() => document.getElementById('Kenia-file-input')?.click()} disabled={KeniaLoading}
                      className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition disabled:opacity-50" title="Subir imagen">
                      <ImagePlus className="w-4 h-4" />
                    </button>
                    <input value={KeniaInput} onChange={e => setKeniaInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendKeniaMessage(); } }}
                      placeholder="Escribe tu pregunta..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                    <button onClick={sendKeniaMessage} disabled={KeniaLoading || !KeniaInput.trim()}
                      className="p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ MOBILE PRODUCT EDITOR (wizard, solo < md) ═══ */}
      {modal && (
        <MobileProductEditor
          key={(modal.data as Product).$id || 'nuevo'}
          modal={modal}
          setModal={setModal}
          onClose={() => { setModal(null); setKeniaOpen(false); setKeniaMessages([]); }}
          onSave={save}
          isSaving={isSaving}
          categories={categories}
          subcategories={subcategories}
          aiLoading={aiLoading}
          setAiLoading={setAiLoading}
          aiTitles={aiTitles}
          setAiTitles={setAiTitles}
          onGenerateAll={generateAllProductContent}
          onGenerateTabs={generateTechnicalTabsOnly}
          aiAutoEnhance={aiAutoEnhance}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DE SELECCIÓN: Agregar manualmente o con IA (solo PC)
         ═══════════════════════════════════════════════════════════════ */}
      {showAddChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAddChoice(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Agregar producto</h2>
            <p className="text-sm text-gray-500 mb-5">Elige cómo quieres crear el producto</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={openAddManual}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Agregar manualmente</p>
                  <p className="text-xs text-gray-500 mt-0.5">Llena todos los campos tú mismo</p>
                </div>
              </button>
              <button
                onClick={() => { setShowAddChoice(false); setModal({ mode: 'add', data: { ...EMPTY, _barcode: '', _sku: '', _details: '', _usage: '', _ingredients: '' } }); setAiAutoEnhance(true); }}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Agregar con IA</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sube una foto y la IA autocompleta todo</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowAddChoice(false)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          WIZARD IA: Paso 1 precios, Paso 2 imágenes (solo PC)
         ═══════════════════════════════════════════════════════════════ */}
      {aiWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setAiWizard(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`flex items-center gap-2 ${aiWizard.step === 'prices' ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${aiWizard.step === 'prices' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <span className="text-sm font-medium">Precios</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 rounded" />
              <div className={`flex items-center gap-2 ${aiWizard.step === 'images' ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${aiWizard.step === 'images' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className="text-sm font-medium">Imágenes</span>
              </div>
            </div>

            {aiWizard.step === 'prices' && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Precios del producto</h2>
                <p className="text-sm text-gray-500 mb-5">Ingresa los precios básicos. La IA usará estos datos.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Costo (lo que pagas) <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="Ej: 5000" value={aiWizard.cost || ''} onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                      onChange={e => {
                        const cost = Number(e.target.value) || 0;
                        setAiWizard(w => {
                          if (!w) return w;
                          const updated = { ...w, cost };
                          if (w.marginPct && cost > 0) {
                            const pct = Number(w.marginPct);
                            updated.price = Math.round(cost * (1 + pct / 100));
                          }
                          return updated;
                        });
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-700 mb-1">Margen de ganancia (%)</label>
                    <div className="flex items-center gap-2">
                      <input type="number" inputMode="numeric" placeholder="Ej: 100" value={aiWizard.marginPct}
                        onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                        onChange={e => {
                          const pct = Number(e.target.value);
                          setAiWizard(w => {
                            if (!w) return w;
                            const cost = w.cost;
                            const updated = { ...w, marginPct: e.target.value };
                            if (pct !== 0 && cost > 0) {
                              updated.price = Math.round(cost * (1 + pct / 100));
                            }
                            return updated;
                          });
                        }}
                        className="w-24 px-2 py-2 border border-emerald-300 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                      {aiWizard.cost > 0 && aiWizard.price > 0 && (
                        <span className="text-xs font-semibold text-emerald-600">
                          Ganancia: ${(aiWizard.price - aiWizard.cost).toLocaleString('es-CL')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Precio de venta (CLP) <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="Ej: 10000" value={aiWizard.price || ''} onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                      onChange={e => setAiWizard(w => w ? { ...w, price: Number(e.target.value) || 0 } : w)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 font-bold mb-1">Precio Catálogo (CLP) <span className="text-gray-400 font-normal">— Opcional</span></label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Auto o manual" value={aiWizard.catalogPrice || ''} onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                        onChange={e => setAiWizard(w => w ? { ...w, catalogPrice: Number(e.target.value) || 0 } : w)}
                        className="flex-1 px-3 py-2.5 border border-amber-300 bg-amber-50/50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      <input type="number" inputMode="numeric" placeholder="% sobre costo" value={aiWizard.catalogPct}
                        onFocus={e => { if (Number(e.target.value) === 0) e.target.value = ''; }}
                        onChange={e => {
                          const pct = Number(e.target.value);
                          setAiWizard(w => {
                            if (!w) return w;
                            const cost = w.cost;
                            const updated = { ...w, catalogPct: e.target.value };
                            if (pct !== 0 && cost > 0) {
                              updated.catalogPrice = Math.round(cost * (1 + pct / 100));
                            }
                            return updated;
                          });
                        }}
                        className="w-32 px-2 py-2 border border-amber-300 rounded-xl text-xs bg-white font-semibold text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setAiWizard(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
                  <button onClick={aiWizardContinue} disabled={!aiWizard.cost || !aiWizard.price} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">Continuar</button>
                </div>
              </>
            )}

            {aiWizard.step === 'images' && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Imágenes del producto</h2>
                <p className="text-sm text-gray-500 mb-5">Sube una imagen de referencia y hasta 3 imágenes del producto.</p>
                {/* Reference image */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Imagen de referencia (para que la IA la analice)</label>
                  <ProductPhotoUploader
                    imageUrls={aiWizard.refImage ? [aiWizard.refImage] : []}
                    onChange={urls => setAiWizard(w => w ? { ...w, refImage: urls[0] || '' } : w)}
                    compact
                  />
                </div>
                {/* Product images */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Imágenes del producto (máximo 3)</label>
                  <ProductPhotoUploader
                    imageUrls={aiWizard.imgUrls}
                    onChange={urls => setAiWizard(w => w ? { ...w, imgUrls: urls.slice(0, 3) } : w)}
                    compact
                  />
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setAiWizard(w => w ? { ...w, step: 'prices' } : w)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Atrás</button>
                  <button onClick={aiWizardFinish} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Crear con IA
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PRODUCT LIST (shown when modal is NOT active)
         ═══════════════════════════════════════════════════════════════ */}
      {!modal && (
        <div className="hidden md:block space-y-5">
      {/* Header compacto con stats en línea */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Productos</h1>
              <p className="text-xs text-gray-500">
                {filtered.length} de {products.length} · {globalStats ? `${globalStats.total.toLocaleString('es-CL')} productos en total · ${globalStats.inStock.toLocaleString('es-CL')} en stock / ${globalStats.outOfStock.toLocaleString('es-CL')} sin stock` : 'Cargando estadísticas...'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition shadow-sm">
              <Plus className="w-4 h-4" /> Agregar
            </button>
            <button
              onClick={() => { setModal({ mode: 'add', data: { ...EMPTY, _barcode: '', _sku: '', _details: '', _usage: '', _ingredients: '' } }); setAiAutoEnhance(true); }}
              disabled={aiLoading !== null}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-50 transition shadow-sm disabled:opacity-50"
              title="Sube una imagen y la IA autocompleta todo"
            >
              {aiLoading !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 animate-pulse" />}
              IA
            </button>
            <button onClick={() => setAiCategorizeModal(true)} className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm" title="Categorizar productos usando IA">
              <Sparkles className="w-4 h-4" /> Kenia
            </button>
            <button onClick={() => load(false)} disabled={isLoading} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition text-gray-600">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        {/* Stats inline compactas */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
            <span className="text-gray-500">Visibles:</span>
            <span className="font-bold text-gray-900">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
            <span className="text-gray-500">Stock:</span>
            <span className="font-bold text-gray-900">{totalUnits.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
            <span className="text-gray-500">Valor:</span>
            <span className="font-bold text-gray-900">{fmt(totalInventoryValue)}</span>
          </div>
          {noImageCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg text-xs">
              <span className="text-amber-600">Sin imagen:</span>
              <span className="font-bold text-amber-700">{noImageCount}</span>
            </div>
          )}
          {outStockCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg text-xs">
              <span className="text-red-500">Agotados:</span>
              <span className="font-bold text-red-600">{outStockCount}</span>
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg text-xs">
              <span className="text-amber-600">Stock bajo:</span>
              <span className="font-bold text-amber-700">{lowStockCount}</span>
            </div>
          )}
          {avgMargin !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg text-xs">
              <span className="text-emerald-600">Margen:</span>
              <span className="font-bold text-emerald-700">{avgMargin}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Acciones secundarias — agrupadas en un menú para mantener el orden */}
      {(() => {
        const menuItem = 'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition text-left disabled:opacity-40 disabled:cursor-not-allowed';
        const menuLabel = 'px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400';
        const brokenCount = Object.keys(brokenImages).length;
        return (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button onClick={() => setToolsOpen(v => !v)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition shadow-sm">
                <Wrench className="w-4 h-4 text-gray-500" /> Herramientas
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setToolsOpen(false)} />
                  <div className="absolute left-0 mt-2 z-30 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl ring-1 ring-black/5 p-2 flex flex-col">
                    <p className={menuLabel}>Edición masiva</p>
                    <button onClick={() => { setToolsOpen(false); setStockModal(true); }} disabled={filtered.length === 0} className={menuItem}>
                      <Boxes className="w-4 h-4 text-gray-400" /> Ajustar stock
                    </button>
                    <button onClick={() => { setToolsOpen(false); setPriceModal(true); }} disabled={filtered.length === 0} className={menuItem}>
                      <Percent className="w-4 h-4 text-gray-400" /> Ajustar precios
                    </button>

                    <div className="my-1.5 border-t border-gray-100" />
                    <p className={menuLabel}>Exportar</p>
                    <button onClick={() => { setToolsOpen(false); exportCSV(); }} disabled={filtered.length === 0} className={menuItem}>
                      <FileText className="w-4 h-4 text-gray-400" /> CSV
                    </button>
                    <button onClick={() => { setToolsOpen(false); exportXLSX(); }} disabled={filtered.length === 0} className={menuItem}>
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Excel (XLSX)
                    </button>
                    <button onClick={() => { setToolsOpen(false); exportAllXLSX(); }} disabled={isExportingAllXLSX} className={menuItem}>
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      {isExportingAllXLSX ? '⏳ Exportando...' : 'Excel Completo (XLSX)'}
                    </button>
                    <button onClick={() => { setToolsOpen(false); exportInventoryPDF(); }} disabled={isExportingPDF} className={menuItem}>
                      <FileText className="w-4 h-4 text-purple-500" />
                      {isExportingPDF ? `PDF ${pdfExportProgress.total > 0 ? `${pdfExportProgress.current}/${pdfExportProgress.total}` : '...'}` : 'PDF con imágenes'}
                    </button>
                    <button id="btn-export-shopify" onClick={() => { setToolsOpen(false); exportShopifyCSV(); }} disabled={products.length === 0} className={menuItem}>
                      <ShoppingBag className="w-4 h-4 text-gray-400" /> Shopify CSV
                    </button>

                    <div className="my-1.5 border-t border-gray-100" />
                    <p className={menuLabel}>Imágenes</p>
                    <Link href="/admin/products/import-images" onClick={() => setToolsOpen(false)} className={menuItem}>
                      <Upload className="w-4 h-4 text-gray-400" /> Importar imágenes
                    </Link>
                    <button onClick={() => { setToolsOpen(false); syncBrokenImages(); }} disabled={syncingImages || products.length === 0} className={menuItem}>
                      <ImageOff className={`w-4 h-4 ${brokenCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                      {syncingImages ? 'Verificando…' : 'Verificar fotos'}
                      {brokenCount > 0 && !syncingImages && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">{brokenCount}</span>
                      )}
                    </button>

                    <div className="my-1.5 border-t border-gray-100" />
                    <button onClick={() => { setToolsOpen(false); deleteAll(); }} disabled={isDeletingAll || products.length === 0}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition text-left disabled:opacity-40 disabled:cursor-not-allowed">
                      <OctagonX className={`w-4 h-4 ${isDeletingAll ? 'animate-spin' : ''}`} />
                      {isDeletingAll ? 'Borrando…' : 'Borrar todos los productos'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Estado de procesos en curso (fuera del menú, siempre visible) */}
            {(isExportingPDF || syncingImages) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {isExportingPDF
                  ? `PDF ${pdfExportProgress.current}/${pdfExportProgress.total}`
                  : `Fotos ${syncProgress.checked}/${products.flatMap(p => [p.IMAGEURL, p.IMAGEURL2, p.IMAGEURL3].filter(Boolean)).length}`}
              </span>
            )}

            {/* Acción contextual: eliminar repetidos con stock 0 */}
            {showDuplicates && duplicates.length > 0 && (
              <button onClick={deleteZeroStockDuplicates} disabled={isDeletingBulkDups}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-sm font-semibold transition shadow-sm">
                <Trash2 className={`w-4 h-4 ${isDeletingBulkDups ? 'animate-spin' : ''}`} />
                {isDeletingBulkDups && bulkDeleteProgress
                  ? `Eliminando ${bulkDeleteProgress.done}/${bulkDeleteProgress.total}...`
                  : 'Eliminar repetidos stock 0'}
              </button>
            )}
          </div>
        );
      })()}

      {/* Progress bar de eliminación masiva */}
      {bulkDeleteProgress && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-700 font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Eliminando duplicados con stock 0...
            </span>
            <span className="text-red-600 font-bold tabular-nums">
              {bulkDeleteProgress.done} / {bulkDeleteProgress.total}
            </span>
          </div>
          <div className="w-full bg-red-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-red-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${bulkDeleteProgress.total > 0 ? (bulkDeleteProgress.done / bulkDeleteProgress.total) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-red-500">Procesando de a 2 por vez para no exceder el límite de Appwrite</p>
        </div>
      )}

      {/* Filtros — búsqueda, categorías y estado de stock en una sola tarjeta */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col-reverse gap-3">
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-1">Stock</span>
        {([['all','Todos'], ['instock','En stock'], ['low','Stock bajo'], ['out','Agotados']] as const).map(([k, label]) => {
          const cnt = k === 'all' ? products.length : k === 'instock' ? products.filter(p => (p.STOCK ?? 0) > 0).length : k === 'low' ? products.filter(p => (p.STOCK ?? 0) > 0 && (p.STOCK ?? 0) <= 10).length : products.filter(p => (p.STOCK ?? 0) === 0).length;
          return (
            <button key={k} onClick={() => setStockFilter(k)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                stockFilter === k ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              {label}
              {cnt > 0 && k !== 'all' && <span className={`text-[10px] font-bold px-1 rounded-full ${stockFilter === k ? 'bg-white/20 text-white' : k === 'out' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>{cnt}</span>}
            </button>
          );
        })}
                <button onClick={() => setNoImageOnly(v => !v)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
            noImageOnly ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}>
          Sin imagen
        </button>
        <button onClick={() => {
          const next = !showDuplicates;
          setShowDuplicates(next);
          if (next) {
            checkDuplicates();
          }
        }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
            showDuplicates ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}>
          Ver Repetidos
        </button>
        {Object.keys(brokenImages).length > 0 && (
          <button onClick={() => setBrokenOnly(v => !v)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              brokenOnly ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}>
            <ImageOff className="w-3 h-3" />
            Fotos rotas
            <span className={`text-[10px] font-bold px-1 rounded-full ${brokenOnly ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>{Object.keys(brokenImages).length}</span>
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                load(false, null, search, catFilter, subCatFilter, stockFilter);
              }
            }}
            placeholder="SKU, barra o nombre (Enter para buscar en BD)..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
          {search && <button onClick={() => { setSearch(''); load(false, null, '', catFilter, subCatFilter, stockFilter); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-4 h-4" /></button>}
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setSubCatFilter(''); }} className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800">
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.$id} value={c.$id}>{c.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={subCatFilter} onChange={e => setSubCatFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800">
            <option value="">Todas las subcategorías</option>
            {subcategories
              .filter(s => !catFilter || s.categoryId === catFilter)
              .map(s => <option key={s.$id} value={s.$id}>{s.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      </div>{/* /Filtros */}

      {/* Live Shopping Legend Indicator */}
      <div className="bg-white border border-gray-150 rounded-xl p-3 flex flex-wrap gap-4 items-center text-xs">
        <span className="font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-800"></span>
          </span>
          Participan en Live Shopping de hoy:
        </span>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-gray-50 border border-gray-200 border-l-4 border-l-gray-400 block shrink-0" />
          <span className="text-gray-600">Nuevos agregados hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-amber-50 border border-amber-250 border-l-4 border-l-amber-400 block shrink-0" />
          <span className="text-gray-600">Ya existían, actualizados hoy</span>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50/50">
                {showDuplicates ? (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Producto Repetido</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase" colSpan={2}>Motivo</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Precio</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Producto a Conservar</th>
                    <th className="px-4 py-3" />
                  </>
                ) : (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Cód. barras</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Categoría</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer" onClick={() => toggleSort('PRICE')}>Precio {sort.key === 'PRICE' ? (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <></>}</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer" onClick={() => toggleSort('STOCK')}>Stock {sort.key === 'STOCK' ? (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <></>}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell cursor-pointer" onClick={() => toggleSort('SOLDQUANTITY')}>Vendidos {sort.key === 'SOLDQUANTITY' ? (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <></>}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell cursor-pointer" onClick={() => toggleSort('MARGIN')}>Margen {sort.key === 'MARGIN' ? (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <></>}</th>
                    <th className="px-4 py-3" />
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5, 6].map(j => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : showDuplicates ? (
                duplicates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      No se encontraron productos repetidos
                    </td>
                  </tr>
                ) : (
                  duplicates.map((group, groupIdx) => (
                    <Fragment key={groupIdx}>
                      {/* Original Row (Counterpart to keep) */}
                      <tr className="bg-emerald-50/25 border-l-4 border-emerald-500 hover:bg-emerald-50/45 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                              {group.original.imageurl ? (
                                <img src={resolveStorageImageUrl(group.original.imageurl)} alt={group.original.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-gray-400 m-auto mt-2.5" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{group.original.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">SKU: {group.sku}</p>
                              <p className="text-[10px] text-gray-500">
                                Colección:{' '}
                                <span className="font-medium text-emerald-700 uppercase text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {group.original.collection === 'products' ? 'Productos (Principal)' : group.original.collection === 'catalog_products' ? 'Catálogo' : 'Inventario'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-emerald-600 font-bold" colSpan={2}>
                          ✨ Producto a Conservar
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="font-semibold text-gray-900">{fmt(group.original.price)}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                            {group.original.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-emerald-700 font-medium hidden md:table-cell">
                          Conserva stock / principal
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">✔ Activo</span>
                        </td>
                      </tr>

                      {/* Duplicate Rows (To be deleted) */}
                      {group.duplicates.map((dup: any, dupIdx: number) => (
                        <tr key={`${groupIdx}-dup-${dupIdx}`} className="bg-rose-50/10 hover:bg-rose-50/20 transition-colors border-l-4 border-rose-300">
                          <td className="px-4 py-3 pl-8">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {dup.imageurl ? (
                                  <img src={resolveStorageImageUrl(dup.imageurl)} alt={dup.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-4 h-4 text-gray-400 m-auto mt-2" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{dup.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">SKU: {dup.sku}</p>
                                <p className="text-[10px] text-gray-500">
                                  Colección:{' '}
                                  <span className="font-medium text-rose-600 uppercase text-[9px] bg-rose-50 px-1.5 py-0.5 rounded">
                                    {dup.collection === 'products' ? 'Productos (Principal)' : dup.collection === 'catalog_products' ? 'Catálogo' : 'Inventario'}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-amber-600 font-medium" colSpan={2}>
                            {dup.reason}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="text-gray-900">{fmt(dup.price)}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                              {dup.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                            Copia a eliminar
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteDuplicate(dup)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-medium transition"
                              title="Eliminar este duplicado"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))
                )
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const liveStatus = getLiveStatus(p);
                  let rowBgClass = '';
                  if (liveStatus === 'new') {
                    rowBgClass = 'bg-gray-50/60 hover:bg-gray-100/60 border-l-4 border-l-gray-400';
                  } else if (liveStatus === 'existing') {
                    rowBgClass = 'bg-amber-50/60 hover:bg-amber-100/60 border-l-4 border-l-amber-400';
                  } else if ((p.STOCK ?? 0) === 0) {
                    rowBgClass = 'bg-red-50/40';
                  }

                  return (
                    <tr key={p.$id} className={`hover:bg-gray-50 transition-colors ${rowBgClass}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            openEdit(p);
                            setTimeout(() => setKeniaOpen(true), 100);
                          }}
                          className="relative shrink-0 group"
                          title="Preguntar a Kenia AI"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 text-gray-900">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                          </div>
                          <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-gray-900 text-white rounded px-1 leading-tight">
                            IA
                          </span>
                        </button>
                        <div
                          className="relative w-10 h-10 shrink-0 cursor-pointer group"
                          onClick={() => {
                            setImageDrawerTab('images');
                            setImageDrawer({
                              productId: p.$id,
                              productName: p.NAME || '',
                              img1: p.IMAGEURL || '',
                              img2: p.IMAGEURL2 || '',
                              img3: p.IMAGEURL3 || '',
                              img4: (p as any).IMAGEURL4 || '',
                              origImg1: p.IMAGEURL || '',
                              origImg2: p.IMAGEURL2 || '',
                              origImg3: p.IMAGEURL3 || '',
                              origImg4: (p as any).IMAGEURL4 || '',
                              description: p.DESCRIPTION || '',
                              origDescription: p.DESCRIPTION || '',
                              features: (Array.isArray(p.FEATURES) ? p.FEATURES : []).join('\n'),
                              origFeatures: (Array.isArray(p.FEATURES) ? p.FEATURES : []).join('\n'),
                              tags: (Array.isArray(p.TAGS) ? p.TAGS : []).join(', '),
                              origTags: (Array.isArray(p.TAGS) ? p.TAGS : []).join(', '),
                              sku: (p as any).SKU || '',
                              origSku: (p as any).SKU || '',
                              price: p.PRICE || 0,
                              origPrice: p.PRICE || 0,
                              stock: p.STOCK ?? 0,
                              origStock: p.STOCK ?? 0,
                            });
                          }}
                          title="Click para cambiar imagen"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
                            {p.IMAGEURL ? (
                              <img src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400 m-auto mt-2.5" />
                            )}
                          </div>
                          {brokenImages[p.$id]?.length && (
                            <div
                              className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                              title={`${brokenImages[p.$id].length} imagen(es) rota(s)`}
                            >
                              <ImageOff className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="w-3 h-3 text-white" />
                          </div>
                          {(() => {
                            const cnt = [p.IMAGEURL, p.IMAGEURL2, p.IMAGEURL3].filter(Boolean).length;
                            return cnt > 1 ? (
                              <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
                                {cnt}
                              </span>
                            ) : null;
                          })()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-medium text-gray-900 truncate max-w-[170px]">{p.NAME}</p>
                            {liveStatus === 'new' && (
                              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-800 text-white animate-pulse">
                                Nuevo en Live
                              </span>
                            )}
                            {liveStatus === 'existing' && (
                              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                                Ya estaba (En Live)
                              </span>
                            )}
                            {liveStatus && p.$createdAt && (
                              <span className="text-[9px] text-gray-400 font-medium">
                                ({new Date(p.$createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })})
                              </span>
                            )}
                          </div>
                          {p.TAGS && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {((Array.isArray(p.TAGS) ? p.TAGS : String(p.TAGS).split(',')) as string[])
                                .map((t: string) => t.trim())
                                .filter(Boolean)
                                .slice(0, 3)
                                .map((t: string) => (
                                  <button
                                    key={t}
                                    onClick={e => {
                                      e.stopPropagation();
                                      setSearch(t);
                                    }}
                                    className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-900 transition cursor-pointer"
                                  >
                                    {t}
                                  </button>
                                ))}
                            </div>
                          )}
                          {p.CATALOGPRICE && p.CATALOGPRICE !== p.PRICE ? (
                            <p className="text-xs text-amber-600 font-medium">Catálogo: {fmt(p.CATALOGPRICE)}</p>
                          ) : null}
                          {!p.IMAGEURL && <p className="text-[10px] text-amber-500 font-medium">sin imagen</p>}
                          {getSku(p) && getSku(p) !== p.$id && (
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {getSku(p)}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {getBarcode(p) ? (
                        <span className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                          {getBarcode(p)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-500">sin código</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{catName(p.CATEGORYID)}</td>
                    <td className="px-4 py-3 text-right">
                      {p.CURRENTPRICE && p.CURRENTPRICE < p.PRICE ? (
                        <div>
                          <span className="font-semibold text-red-600">{fmt(p.CURRENTPRICE)}</span>
                          <span className="text-xs text-gray-400 line-through ml-1">{fmt(p.PRICE)}</span>
                          <span className="ml-1 text-xs font-bold text-white bg-red-500 px-1 py-0.5 rounded">
                            -{Math.round((1 - p.CURRENTPRICE / p.PRICE) * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">{fmt(p.PRICE)}</span>
                      )}
                      {p.COST && p.COST > 0 && p.PRICE > 0 ? (
                        <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                          {Math.round(((p.PRICE - p.COST) / p.PRICE) * 100)}% margen
                        </p>
                      ) : (
                        <p className="text-[10px] text-amber-500 mt-0.5 text-right">sin costo</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            p.STOCK === 0 ? 'bg-red-100 text-red-700' : p.STOCK <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.STOCK}
                        </span>
                        {p.PACKQTY ? <span className="text-[9px] text-gray-400">×{p.PACKQTY}/pq</span> : null}
                        {(() => {
                          const loc = getSection(p);
                          return loc ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-gray-900">
                              <MapPin className="w-2.5 h-2.5" />G{loc.gondola} S{loc.section}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">{p.SOLDQUANTITY ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={`/productos/${p.$id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition inline-flex items-center justify-center"
                          title="Ver en tienda"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => enhanceProductWithAI(p)}
                          disabled={aiLoading !== null}
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition disabled:opacity-50"
                          title="Mejorar con IA: buscar imágenes similares + autocompletar todo"
                        >
                          {aiLoading !== null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicate(p)}
                          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition"
                          title="Duplicar"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => remove(p.$id)}
                          disabled={deleteId === p.$id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deleteId === p.$id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && showDuplicates && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            <span>Se encontraron <span className="font-semibold text-rose-600">{duplicates.length}</span> productos repetidos en total.</span>
          </div>
        )}
        {!isLoading && !showDuplicates && filtered.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            <span><span className="font-semibold text-gray-700">{filtered.length}</span> productos</span>
            <span>Stock: <span className="font-semibold text-gray-700">{totalUnits.toLocaleString('es-CL')} un.</span></span>
            <span>Valor: <span className="font-semibold text-gray-700">{fmt(totalInventoryValue)}</span></span>
            {filtered.some(p => p.COST) && (
              <span>Costo: <span className="font-semibold text-gray-700">{fmt(totalCostValue)}</span></span>
            )}
            {(() => { const noCost = filtered.filter(p => !p.COST || p.COST === 0).length; return noCost > 0 ? <span className="text-amber-600 font-medium">{noCost} sin costo</span> : null; })()}
            {noImageCount > 0 ? <span className="text-amber-500 font-medium">{noImageCount} sin imagen</span> : null}
            {avgMargin !== null ? <span className="ml-auto text-gray-900 font-semibold">Margen: {avgMargin}%</span> : null}
          </div>
        )}
      </div>

      <EpicPagination
        currentPage={currentPage}
        totalPages={lastCursor ? currentPage + 1 : currentPage}
        onPageChange={(page) => {
          if (page > currentPage && lastCursor) {
            setCurrentPage(page);
            load(true, lastCursor, search, catFilter, subCatFilter, stockFilter);
          } else if (page < currentPage) {
            // Going back — reload from page 1 up to target (simple approach: reload from scratch)
            setCurrentPage(1);
            pageCursorsRef.current = new Map([[1, null]]);
            load(false, null, search, catFilter, subCatFilter, stockFilter);
          }
        }}
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        totalItems={totalCount}
      />

      {/* Bulk price modal */}
      {priceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Ajuste masivo de precios</p>
                <p className="text-xs text-gray-500 mt-0.5">Se aplica a {filtered.length} producto(s) visible(s)</p>
              </div>
              <button onClick={() => setPriceModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Tipo de ajuste</label>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {([['percent', '% Porcentaje'], ['fixed', '$ Monto fijo']] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setPriceAdj(a => ({ ...a, type: v }))}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${priceAdj.type === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {priceAdj.type === 'percent' ? 'Porcentaje (ej: +10 o -5)' : 'Monto en CLP (ej: +500 o -1000)'}
                </label>
                <input type="number" value={priceAdj.value} onChange={e => setPriceAdj(a => ({ ...a, value: e.target.value }))}
                  placeholder={priceAdj.type === 'percent' ? 'ej: 10' : 'ej: 500'}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                <p className="text-xs text-gray-400 mt-1">Usa valores negativos para reducir precios</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setPriceModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={applyBulkPrice} disabled={applyingPrice || !priceAdj.value}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-60">
                {applyingPrice ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Percent className="w-4 h-4" />}
                {applyingPrice ? 'Aplicando...' : 'Aplicar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk stock modal */}
      {stockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Ajuste masivo de stock</p>
                <p className="text-xs text-gray-500 mt-0.5">Se aplica a {filtered.length} producto(s) visible(s)</p>
              </div>
              <button onClick={() => setStockModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Tipo de ajuste</label>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {([['add', '+ Agregar / Restar'], ['set', '= Establecer valor']] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setStockAdj(a => ({ ...a, type: v }))}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${stockAdj.type === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {stockAdj.type === 'add' ? 'Cantidad a agregar (negativo para restar)' : 'Stock exacto a establecer'}
                </label>
                <input type="number" value={stockAdj.value} onChange={e => setStockAdj(a => ({ ...a, value: e.target.value }))}
                  placeholder={stockAdj.type === 'add' ? 'ej: 50 o -10' : 'ej: 100'}
                  min={stockAdj.type === 'set' ? 0 : undefined}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
                {stockAdj.type === 'add' && <p className="text-xs text-gray-400 mt-1">Usa valores negativos para reducir stock</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setStockModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={applyBulkStock} disabled={applyingStock || !stockAdj.value}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60">
                {applyingStock ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Boxes className="w-4 h-4" />}
                {applyingStock ? 'Aplicando...' : 'Aplicar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image drawer (cortina lateral) */}
      {imageDrawer && (
        <div className="fixed inset-0 z-[9999] flex justify-end" onClick={() => !imageDrawerSaving && setImageDrawer(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
          <div
            className="relative h-full w-full max-w-[640px] bg-white shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <ImagePlus className="w-5 h-5 text-gray-900" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm">Editar producto</p>
                  <p className="text-xs text-gray-500 truncate max-w-[300px]">{imageDrawer.productName}</p>
                </div>
              </div>
              <button
                onClick={() => !imageDrawerSaving && setImageDrawer(null)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="shrink-0 flex gap-1 px-5 pt-3 border-b border-gray-100">
              {([
                { key: 'images' as const, label: 'Imágenes' },
                { key: 'info' as const, label: 'Descripción' },
                { key: 'specs' as const, label: 'Ficha técnica' },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setImageDrawerTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
                    imageDrawerTab === tab.key
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* TAB: Images */}
              {imageDrawerTab === 'images' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Imagen 1', sub: 'Principal', key: 'img1' as const, idx: 0 },
                    { label: 'Imagen 2', sub: 'Secundaria', key: 'img2' as const, idx: 1 },
                    { label: 'Imagen 3', sub: 'Detalle', key: 'img3' as const, idx: 2 },
                    { label: 'Imagen 4', sub: 'Extra', key: 'img4' as const, idx: 3 },
                  ].map((slot) => {
                    const url = imageDrawer[slot.key];
                    const isUploading = imageDrawerUploading === slot.key;
                    return (
                      <div key={slot.key} className="rounded-xl border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-900">{slot.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${slot.idx === 0 ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-600'}`}>
                              {slot.sub}
                            </span>
                          </div>
                          {url && (
                            <button
                              onClick={() => setImageDrawer(d => d ? { ...d, [slot.key]: '' } : null)}
                              className="text-[11px] text-red-500 hover:text-red-700 font-medium"
                            >Quitar</button>
                          )}
                        </div>
                        {url ? (
                          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-gray-100 mb-2">
                            <img src={resolveStorageImageUrl(url)} alt={slot.label} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="w-full h-28 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-gray-800 transition mb-2"
                            onClick={() => imageDrawerFileRefs.current[slot.idx]?.click()}
                          >
                            {isUploading ? (
                              <Loader2 className="w-6 h-6 animate-spin text-gray-800" />
                            ) : (
                              <>
                                <Upload className="w-5 h-5 mb-1" />
                                <span className="text-[11px] font-medium">Subir</span>
                              </>
                            )}
                          </button>
                        )}
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            value={url}
                            onChange={e => setImageDrawer(d => d ? { ...d, [slot.key]: e.target.value } : null)}
                            placeholder="URL..."
                            className="flex-1 px-2.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-800"
                          />
                          <input
                            ref={el => { imageDrawerFileRefs.current[slot.idx] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setImageDrawerUploading(slot.key);
                              try {
                                const { storage } = getServices();
                                const { endpoint, projectId } = getAppwriteConfig();
                                const fileId = ID.unique();
                                await storage.createFile(PRODUCTS_BUCKET_ID, fileId, file);
                                const newUrl = `${endpoint}/storage/buckets/${PRODUCTS_BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
                                setImageDrawer(d => d ? { ...d, [slot.key]: newUrl } : null);
                              } catch (err: any) {
                                alert('Error al subir: ' + err.message);
                              } finally {
                                setImageDrawerUploading(null);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => imageDrawerFileRefs.current[slot.idx]?.click()}
                            disabled={isUploading}
                            className="shrink-0 px-2.5 py-2 border border-indigo-200 bg-gray-50 rounded-lg text-xs font-medium text-gray-900 hover:bg-gray-100 transition disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB: Info (descripción + datos básicos) */}
              {imageDrawerTab === 'info' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descripción</label>
                    <textarea
                      value={imageDrawer.description}
                      onChange={e => setImageDrawer(d => d ? { ...d, description: e.target.value } : null)}
                      rows={6}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
                      placeholder="Descripción del producto..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">SKU</label>
                      <input
                        type="text"
                        value={imageDrawer.sku}
                        onChange={e => setImageDrawer(d => d ? { ...d, sku: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="SKU del producto"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags</label>
                      <input
                        type="text"
                        value={imageDrawer.tags}
                        onChange={e => setImageDrawer(d => d ? { ...d, tags: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Precio (CLP)</label>
                      <input
                        type="number"
                        value={imageDrawer.price}
                        onChange={e => setImageDrawer(d => d ? { ...d, price: Number(e.target.value) } : null)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock</label>
                      <input
                        type="number"
                        value={imageDrawer.stock}
                        onChange={e => setImageDrawer(d => d ? { ...d, stock: Number(e.target.value) } : null)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Specs (ficha técnica) */}
              {imageDrawerTab === 'specs' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Ficha técnica <span className="text-gray-400 font-normal">(una característica por línea)</span>
                    </label>
                    <textarea
                      value={imageDrawer.features}
                      onChange={e => setImageDrawer(d => d ? { ...d, features: e.target.value } : null)}
                      rows={10}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none font-mono"
                      placeholder={"Ejemplo:\nMaterial: Algodón\nTalla: L\nColor: Azul\nGarantía: 3 meses"}
                    />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">Vista previa:</span>
                    </p>
                    {imageDrawer.features.trim() ? (
                      <ul className="mt-2 space-y-1">
                        {imageDrawer.features.split('\n').filter((s: string) => s.trim()).map((line: string, i: number) => {
                          const [key, ...rest] = line.split(':');
                          return (
                            <li key={i} className="text-xs flex gap-2">
                              <span className="font-medium text-gray-700">{key.trim()}:</span>
                              <span className="text-gray-600">{rest.join(':').trim()}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">Sin características</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-gray-100 px-5 py-3.5 flex justify-end gap-3 bg-white">
              <button
                onClick={() => !imageDrawerSaving && setImageDrawer(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >Cancelar</button>
              <button
                onClick={saveImageDrawer}
                disabled={imageDrawerSaving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50 shadow-sm"
              >
                {imageDrawerSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {imageDrawerSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Categorization Modal (Kenia) */}
      {aiCategorizeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white shadow-md shadow-gray-100">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">Categorización Inteligente con Kenia</p>
                  <p className="text-xs text-gray-500 mt-0.5">Organiza tu catálogo de forma automática usando Inteligencia Artificial</p>
                </div>
              </div>
              <button onClick={() => {
                if (aiCategorizing || applyingCategorization) return;
                setAiCategorizeModal(false);
                setAiCategorizeSuggestions([]);
              }} disabled={aiCategorizing || applyingCategorization} className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              {/* State 1: Configuration */}
              {aiCategorizeSuggestions.length === 0 && !aiCategorizing && (
                <div className="space-y-6 max-w-lg mx-auto py-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-3 text-sm text-gray-900">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-gray-900" />
                    <div>
                      <p className="font-semibold">¿Cómo funciona?</p>
                      <p className="text-gray-800/95 mt-1 leading-relaxed text-xs">
                        Kenia analizará el título y la descripción de tus productos para recomendarte la categoría y la subcategoría que mejor se ajusten de entre las que tienes registradas. Luego podrás revisar las propuestas antes de aplicarlas.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">¿Qué productos quieres categorizar?</label>
                    <div className="grid grid-cols-1 gap-3">
                      <label className={`border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition ${aiCategorizeMode === 'uncategorized' ? 'border-gray-900 bg-gray-50/40 ring-2 ring-gray-100' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}>
                        <input type="radio" name="ai-mode" checked={aiCategorizeMode === 'uncategorized'} onChange={() => setAiCategorizeMode('uncategorized')} className="mt-1 text-gray-900 focus:ring-gray-800" />
                        <div>
                          <p className="font-semibold text-sm text-gray-900">Solo productos sin categoría</p>
                          <p className="text-xs text-gray-500 mt-1">Recomendado. Procesará únicamente los productos que no tienen ninguna categoría asignada ({products.filter(p => !p.CATEGORYID || p.CATEGORYID.trim() === '').length} encontrados en esta página).</p>
                        </div>
                      </label>

                      <label className={`border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition ${aiCategorizeMode === 'all' ? 'border-gray-900 bg-gray-50/40 ring-2 ring-gray-100' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}>
                        <input type="radio" name="ai-mode" checked={aiCategorizeMode === 'all'} onChange={() => setAiCategorizeMode('all')} className="mt-1 text-gray-900 focus:ring-gray-800" />
                        <div>
                          <p className="font-semibold text-sm text-gray-900">Todos los productos</p>
                          <p className="text-xs text-gray-500 mt-1">Procesará la totalidad de tu catálogo de productos ({globalStats?.total ?? products.length} productos) para re-evaluarlos.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <button onClick={startAiCategorization} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-lg shadow-gray-100 transition duration-150">
                      <Sparkles className="w-5 h-5" /> Comenzar Análisis
                    </button>
                  </div>
                </div>
              )}

              {/* State 2: Categorizing (Progress) */}
              {aiCategorizing && (
                <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-gray-900 animate-spin" />
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-lg">Kenia está analizando tu catálogo...</p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Este proceso se realiza en lotes eficientes de 10 productos para garantizar la máxima precisión. Por favor, no cierres esta ventana.
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-full rounded-full transition-all duration-300" style={{ width: `${(aiCategorizeProgress.current / aiCategorizeProgress.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 bg-gray-50 px-3 py-1 rounded-full">
                    {aiCategorizeProgress.current} de {aiCategorizeProgress.total} productos procesados
                  </span>
                </div>
              )}

              {/* State 3: Suggestion Review */}
              {aiCategorizeSuggestions.length > 0 && !aiCategorizing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Sparkles className="w-4 h-4 shrink-0 text-gray-900" />
                      <span className="text-xs font-semibold">Se encontraron {aiCategorizeSuggestions.length} sugerencias. Desmarca las que no quieras aplicar.</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const next: Record<string, boolean> = {};
                        aiCategorizeSuggestions.forEach(s => { next[s.productId] = true; });
                        setApprovedSuggestions(next);
                      }} className="text-[11px] font-bold text-gray-800 hover:text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-lg transition">Marcar todo</button>
                      <button onClick={() => setApprovedSuggestions({})} className="text-[11px] font-bold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-lg transition">Desmarcar todo</button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto max-h-[45vh]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <th className="p-4 w-12 text-center">OK</th>
                            <th className="p-4">Producto</th>
                            <th className="p-4">Categoría Sugerida</th>
                            <th className="p-4">Subcategoría Sugerida</th>
                            <th className="p-4">Justificación de Kenia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {aiCategorizeSuggestions.map(s => {
                            const cat = categories.find(c => c.$id === s.suggestedCategoryId);
                            const sub = subcategories.find(sub => sub.$id === s.suggestedSubcategoryId);
                            return (
                              <tr key={s.productId} className={`hover:bg-gray-50/50 transition ${approvedSuggestions[s.productId] ? '' : 'opacity-60 bg-gray-50/20'}`}>
                                <td className="p-4 text-center">
                                  <input type="checkbox" checked={approvedSuggestions[s.productId] || false} onChange={e => setApprovedSuggestions(prev => ({ ...prev, [s.productId]: e.target.checked }))} className="rounded text-gray-900 focus:ring-gray-800" />
                                </td>
                                <td className="p-4 font-medium text-gray-900 max-w-[200px] truncate" title={s.productName}>{s.productName}</td>
                                <td className="p-4">
                                  {cat ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-900 border border-gray-100">
                                      {cat.name}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-400 italic">No identificada</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  {sub ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-100">
                                      {sub.name}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-400 italic">Sin subcategoría</span>
                                  )}
                                </td>
                                <td className="p-4 text-xs text-gray-500 leading-relaxed max-w-[250px] truncate" title={s.reason}>{s.reason || '-'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* State 4: Applying (Saving) */}
              {applyingCategorization && (
                <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-gray-900 animate-spin" />
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-lg">Guardando categorizaciones...</p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Actualizando tu catálogo de productos en la base de datos de Appwrite. Por favor, no cierres esta ventana.
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-full rounded-full transition-all duration-300" style={{ width: `${(applyingProgress.current / applyingProgress.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-full animate-pulse">
                    Actualizando: {applyingProgress.current} de {applyingProgress.total} productos
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-5 border-t border-gray-100 bg-gray-50">
              <div>
                {aiCategorizeSuggestions.length > 0 && !aiCategorizing && !applyingCategorization && (
                  <span className="text-xs font-medium text-gray-500">
                    Aprobados: <span className="font-bold text-gray-800">{aiCategorizeSuggestions.filter(s => approvedSuggestions[s.productId]).length}</span> de {aiCategorizeSuggestions.length} sugerencias
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  disabled={aiCategorizing || applyingCategorization}
                  onClick={() => {
                    setAiCategorizeModal(false);
                    setAiCategorizeSuggestions([]);
                    setApprovedSuggestions({});
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {aiCategorizeSuggestions.length > 0 ? 'Descartar todo' : 'Cerrar'}
                </button>

                {aiCategorizeSuggestions.length > 0 && !aiCategorizing && !applyingCategorization && (
                  <button
                    onClick={applyAiCategorization}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 shadow-md shadow-gray-100 transition"
                  >
                    <Sparkles className="w-4 h-4" /> Aplicar Categorizaciones
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      )}

      {/* ═══ MOBILE PRODUCT LIST (tarjetas, solo < md) ═══ */}
      {!modal && (
        <MobileProductList
          products={filtered}
          allProducts={products}
          isLoading={isLoading}
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={() => load(false, null, search, catFilter, subCatFilter, stockFilter)}
          onSearchClear={() => { setSearch(''); load(false, null, '', catFilter, subCatFilter, stockFilter); }}
          categories={categories}
          catFilter={catFilter}
          onCatChange={(v) => { setCatFilter(v); setSubCatFilter(''); }}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          onEdit={openEdit}
          onEnhanceProduct={enhanceProductWithAI}
          onAdd={openAdd}
          onDelete={remove}
          deleteId={deleteId}
          aiLoading={aiLoading !== null}
          onRefresh={() => load(false)}
          currentPage={currentPage}
          hasMore={!!lastCursor}
          onNextPage={() => { if (lastCursor) { setCurrentPage(currentPage + 1); load(true, lastCursor, search, catFilter, subCatFilter, stockFilter); } }}
          onPrevPage={() => { if (currentPage > 1) { setCurrentPage(1); pageCursorsRef.current = new Map([[1, null]]); load(false, null, search, catFilter, subCatFilter, stockFilter); } }}
        />
      )}
    </div>
  );
}
