'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Query, ID } from 'appwrite';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import * as XLSX from 'xlsx';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION_ID, INVENTORY_PRODUCTS_COLLECTION_ID, CATALOG_PRODUCTS_COLLECTION_ID, STOCK_ALERTS_COLLECTION_ID, CATEGORIES_COLLECTION_ID, SUBCATEGORIES_COLLECTION_ID } from '@/lib/appwrite-admin';
import { invalidateProductCache, cached, TTL } from '@/lib/cache';
import { isAdminEmail } from '@/lib/admin-access';
import { setBarcodeInFeatures, setSectionInFeatures } from '@/lib/product-features';
import { Product, Category, Subcategory } from '@/types/admin';
import {
  Upload, Search, Package, CheckCircle2, RefreshCw,
  X, FileSpreadsheet, ArrowUpCircle, Plus, Eye, EyeOff, Sparkles, Languages, FolderTree, Camera, MapPin, ChevronDown, Download, ImageIcon, CalendarClock, Trash2
} from 'lucide-react';
import dynamic from 'next/dynamic';
const BarcodeScanner = dynamic(() => import('@/components/BarcodeScanner'), { ssr: false });
const ProductLocator = dynamic(() => import('@/components/ProductLocator'), { ssr: false });
import ScanWizardModal, { type ScanWizardState } from '@/components/inventario/ScanWizardModal';

interface InventoryRow {
  sku: string;
  barcode: string;
  categoryRaw: string;
  categoryEs: string;
  subcategory: string;
  nameEs: string;
  nameCn: string;
  nameTranslated: string;
  priceRetail: number;
  priceWholesale: number;
  currentStock: number;
  newStock: number;
  productId: string | null;
  matched: boolean;
  selected: boolean;
  imageUrl: string;
  isNew: boolean;
  translated: boolean;
  dateAdded: string;
}

const parsePrice = (v: any): number => {
  const s = String(v || '').replace(/[^\d.-]/g, '');
  return parseFloat(s) || 0;
};

function getApiKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) return stored;
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
}

async function callGeminiBatch(items: { sku: string; nameCn: string; categoryRaw: string }[]): Promise<Record<string, { nameEs: string; category: string; subcategory: string }>> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key de Gemini no configurada. Ve a Configuración > AI.');

  const lines = items.map(i => `SKU:${i.sku}|NOMBRE:${i.nameCn}|CAT:${i.categoryRaw}`).join('\n');

  const prompt = `Eres un experto en cosméticos y productos de belleza. Traduce los siguientes productos del chino al español.
Para cada línea devuelve exactamente: SKU:xxx|NOMBRE:traducción_española|CAT:categoría_en_español|SUB:subcategoría_en_español

Reglas:
- Traduce NOMBRE al español (mantén marcas en su nombre original como SADOER, BIOAOUA, etc.)
- Para CAT: traduce si está en chino, o si está vacío infiere la categoría del nombre del producto
- Para SUB: infiere la subcategoría específica basada en el nombre (ej. Brillo Labial, Esmalte de Uñas, Mascarilla Facial, etc.)
- Categorías posibles: Maquillaje, Cuidado de la Piel, Cuerpo e Higiene, Cuidado Capilar, Manicure y Uñas, Aromaterapia, Accesorios de Belleza, Perfumería, Hogar y Decoración, Higiene Personal, Depilación, Electrónica, Varios
- Devuelve EXACTAMENTE el mismo número de líneas, en el mismo orden
- Sin explicaciones extra, solo las líneas con el formato pedido

${lines}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) throw new Error('Error en la API de Gemini');
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const result: Record<string, { nameEs: string; category: string; subcategory: string }> = {};
  for (const line of text.split('\n')) {
    const skuMatch = line.match(/SKU:([^|]+)\|NOMBRE:([^|]+)\|CAT:([^|]+)\|SUB:(.+)/);
    if (skuMatch) {
      result[skuMatch[1].trim()] = {
        nameEs: skuMatch[2].trim(),
        category: skuMatch[3].trim(),
        subcategory: skuMatch[4].trim(),
      };
    }
  }
  return result;
}

function productFeaturesText(p: Product): string {
  const raw = p.FEATURES;
  if (raw == null) return '';
  if (typeof raw === 'string') return raw;
  try {
    return typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
  } catch {
    return '';
  }
}

function getSkuFromProduct(p: Product): string {
  const directSku = (p as any).sku;
  if (directSku && String(directSku).trim()) return String(directSku).trim();
  const features = productFeaturesText(p);
  const featMatch = features.match(/SKU:\s*(.+)/i);
  if (featMatch) return featMatch[1].trim().split('\n')[0];
  const tagParts = Array.isArray(p.TAGS)
    ? p.TAGS
    : (typeof p.TAGS === 'string' ? p.TAGS.split(',').map(t => t.trim()) : []);
  const skuTag = tagParts.find(t => /^[A-Z0-9]{4,}$/i.test(t));
  return p.jumpseller_id || skuTag || '';
}

function getBarcodeFromProduct(p: Product): string {
  const features = productFeaturesText(p);
  const featMatch = features.match(/Barcode:\s*(.+)/i);
  if (featMatch) return featMatch[1].trim().split('\n')[0];
  const topLevel = (p as { barcode?: string }).barcode;
  if (topLevel && String(topLevel).trim()) return String(topLevel).trim();
  return '';
}

function getSectionFromProduct(p: Product): number | null {
  const features = productFeaturesText(p);
  const m = features.match(/Section:\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  const direct = (p as any).section;
  if (direct && Number(direct) > 0) return Number(direct);
  return null;
}

function buildCatalogPublishPayload(p: Product): Record<string, unknown> {
  const barcode = getBarcodeFromProduct(p);
  const sku = getSkuFromProduct(p);
  const payload: Record<string, unknown> = {
    NAME: p.NAME,
    DESCRIPTION: (p as { DESCRIPTION?: string }).DESCRIPTION || p.NAME,
    PRICE: p.PRICE || 0,
    STOCK: p.STOCK || 0,
    COST: (p as { COST?: number }).COST || 0,
    WHOLESALEPRICE: (p as { WHOLESALEPRICE?: number }).WHOLESALEPRICE || 0,
    WHOLESALEMINQUANTITY: (p as { WHOLESALEMINQUANTITY?: number }).WHOLESALEMINQUANTITY || 0,
    IMAGEURL: p.IMAGEURL || '',
    IMAGEURL2: (p as { IMAGEURL2?: string }).IMAGEURL2 || '',
    IMAGEURL3: (p as { IMAGEURL3?: string }).IMAGEURL3 || '',
    CATEGORYID: p.CATEGORYID || '',
    SUBCATEGORYID: (p as { SUBCATEGORYID?: string }).SUBCATEGORYID || '',
    ISACTIVE: true,
    PACKQTY: p.PACKQTY || 0,
  };
  // FEATURES y TAGS no existen en la colección products (catálogo) — no enviarlos
  // Guardar sección y SKU como atributos directos para que se mantengan al publicar
  const section = getSectionFromProduct(p);
  if (section) payload.section = section;
  if (sku) payload.sku = sku;
  if (barcode) payload.barcode = barcode;
  if (p.jumpseller_id) payload.jumpseller_id = p.jumpseller_id;
  return payload;
}

export default function InventarioPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateProgress, setTranslateProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('search');
      if (q) setSearch(q);
    }
  }, []);
  const [filterStatus, setFilterStatus] = useState<'all' | 'matched' | 'new' | 'unmatched'>('all');
  const [products, setProducts] = useState<Product[]>([]); // inventory_products
  const [publishedSkus, setPublishedSkus] = useState<Set<string>>(new Set()); // SKUs ya en products (catálogo)
  const [publishedBarcodes, setPublishedBarcodes] = useState<Set<string>>(new Set()); // Barcodes ya en products
  const [publishedProducts, setPublishedProducts] = useState<Product[]>([]); // Productos ya en catálogo (para vista Ubicados)
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishResults, setPublishResults] = useState<{ published: number; errors: number } | null>(null);
  const [isCreatingCats, setIsCreatingCats] = useState(false);
  const [catResults, setCatResults] = useState<{ cats: number; subs: number; errors: number } | null>(null);
  const [saveResults, setSaveResults] = useState<{ skipped: number; patched: number; created: number; errors: number } | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrateProgress, setMigrateProgress] = useState(0);
  const [migrateResults, setMigrateResults] = useState<{ activated: number; deactivated: number; errors: number } | null>(null);
  const [view, setView] = useState<'excel' | 'catalog' | 'withStock' | 'located'>('withStock');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [packQtyEdits, setPackQtyEdits] = useState<Record<string, string>>({});
  const [barcodeEdits, setBarcodeEdits] = useState<Record<string, string>>({});
  const [savingStockId, setSavingStockId] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanTarget, setScanTarget] = useState<'search' | string>('search');
  const [scanWizard, setScanWizard] = useState<ScanWizardState | null>(null);
  const [scanSaved, setScanSaved] = useState<{ name: string } | null>(null);
  // Unregistered product modal
  const [unregisteredModal, setUnregisteredModal] = useState<{ code: string } | null>(null);
  const [editStockModal, setEditStockModal] = useState<Product | null>(null);
  const [editPackQtyValue, setEditPackQtyValue] = useState<string>('');
  const [editPackagesValue, setEditPackagesValue] = useState<string>('');
  const [editSectionValue, setEditSectionValue] = useState<number | null>(null);
  const [editBarcodeValue, setEditBarcodeValue] = useState<string>('');
  const [lastPlacedSection, setLastPlacedSection] = useState<number | null>(null);
  const [showLocator, setShowLocator] = useState(false);
  const [editLocatedProduct, setEditLocatedProduct] = useState<Product | null>(null);
  const [editLocatedBarcode, setEditLocatedBarcode] = useState('');
  const [editLocatedSection, setEditLocatedSection] = useState<number | null>(null);
  const [editLocatedStock, setEditLocatedStock] = useState<string>('');
  const [editLocatedSaving, setEditLocatedSaving] = useState(false);
  const [isImportingPackQty, setIsImportingPackQty] = useState(false);
  const [importPackQtyResults, setImportPackQtyResults] = useState<{ updated: number; notFound: number; errors: number } | null>(null);
  const scannedCodesRef = useRef<Set<string>>(new Set());
  const [duplicateScanWarning, setDuplicateScanWarning] = useState<{ code: string; product: Product } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sectionProductCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    const allSrc = [...products, ...publishedProducts];
    const seen = new Set<string>();
    allSrc.forEach(p => {
      if (seen.has(p.$id)) return;
      seen.add(p.$id);
      const sec = getSectionFromProduct(p);
      if (sec !== null && sec >= 1 && sec <= 36) counts[sec] = (counts[sec] || 0) + 1;
    });
    return counts;
  }, [products, publishedProducts]);

  const openEditStockModal = (p: Product, opts?: { packages?: string; packQty?: string }) => {
    const features = productFeaturesText(p);
    const sectionMatch = features.match(/Section:\s*(\d+)/i);
    const existingBarcode = getBarcodeFromProduct(p) || barcodeEdits[p.$id]?.trim() || '';
    setEditStockModal(p);
    setEditPackQtyValue(opts?.packQty ?? String(p.PACKQTY || ''));
    setEditPackagesValue(
      opts?.packages ?? String(Math.round((p.STOCK || 0) / (p.PACKQTY || 1)) || '0'),
    );
    setEditSectionValue(sectionMatch ? parseInt(sectionMatch[1], 10) : (lastPlacedSection || null));
    setEditBarcodeValue(existingBarcode);
  };

  const closeEditStockModal = () => {
    setEditStockModal(null);
    setEditPackQtyValue('');
    setEditPackagesValue('');
    setEditSectionValue(null);
    setEditBarcodeValue('');
  };

  const openEditLocated = (p: Product) => {
    setEditLocatedProduct(p);
    setEditLocatedBarcode(getBarcodeFromProduct(p));
    setEditLocatedSection(getSectionFromProduct(p));
    setEditLocatedStock(String(p.STOCK || 0));
  };

  const saveEditLocated = async () => {
    if (!editLocatedProduct) return;
    setEditLocatedSaving(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const isInventory = products.some(ip => ip.$id === editLocatedProduct.$id);
      const collId = isInventory ? INVENTORY_PRODUCTS_COLLECTION_ID : PRODUCTS_COLLECTION_ID;
      const payload: Record<string, any> = {};
      if (editLocatedBarcode.trim()) payload.barcode = editLocatedBarcode.trim();
      else payload.barcode = '';
      if (editLocatedSection != null && editLocatedSection > 0) payload.section = editLocatedSection;
      if (isInventory) {
        const stock = parseInt(editLocatedStock, 10);
        if (!isNaN(stock) && stock >= 0) payload.STOCK = stock;
      }
      // También guardar barcode y section en FEATURES como fallback
      let features = productFeaturesText(editLocatedProduct);
      if (editLocatedBarcode.trim()) features = setBarcodeInFeatures(features, editLocatedBarcode.trim());
      if (editLocatedSection != null && editLocatedSection > 0) features = setSectionInFeatures(features, editLocatedSection);
      if (features !== productFeaturesText(editLocatedProduct)) payload.FEATURES = features;

      try {
        await databases.updateDocument(databaseId, collId, editLocatedProduct.$id, payload);
      } catch (err: any) {
        if (err?.message?.includes('Unknown attribute') || err?.message?.includes('unknown attribute')) {
          // Atributos directos no existen en schema, guardar solo FEATURES + STOCK
          const fallback: Record<string, any> = {};
          if (payload.FEATURES) fallback.FEATURES = payload.FEATURES;
          if (payload.STOCK !== undefined) fallback.STOCK = payload.STOCK;
          await databases.updateDocument(databaseId, collId, editLocatedProduct.$id, fallback);
          // Actualizar estado local con lo que sí se guardó
          const localUpdate = { ...payload };
          delete localUpdate.barcode;
          delete localUpdate.section;
          if (isInventory) {
            setProducts(prev => prev.map(p => p.$id === editLocatedProduct.$id ? { ...p, ...localUpdate } : p));
          } else {
            setPublishedProducts(prev => prev.map(p => p.$id === editLocatedProduct.$id ? { ...p, ...localUpdate } : p));
          }
          setEditLocatedProduct(null);
          return;
        }
        throw err;
      }
      // Actualizar estado local
      if (isInventory) {
        setProducts(prev => prev.map(p => p.$id === editLocatedProduct.$id ? { ...p, ...payload } : p));
      } else {
        setPublishedProducts(prev => prev.map(p => p.$id === editLocatedProduct.$id ? { ...p, ...payload } : p));
      }
      setEditLocatedProduct(null);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setEditLocatedSaving(false);
    }
  };

  const openScanner = (target: 'search' | string = 'search') => {
    setScanTarget(target);
    setShowScanner(true);
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanTarget('search');
  };

  const startScanWizard = (product: Product, scannedCode: string, isAddStock = false) => {
    setShowScanner(false);
    const features = productFeaturesText(product);
    const sectionMatch = features.match(/Section:\s*(\d+)/i);
    setScanWizard({
      product,
      scannedCode,
      step: 'confirm',
      packages: '1',
      section: sectionMatch ? parseInt(sectionMatch[1], 10) : lastPlacedSection,
      isAddStock,
    });
  };

  const advanceScanWizardAfterConfirm = (updatedProduct?: Product) => {
    setScanWizard(w => {
      if (!w) return null;
      const product = updatedProduct || w.product;
      // Siempre ir a packages (aunque no tenga PACKQTY, puede ingresarla ahí)
      return { ...w, product, step: 'packages' };
    });
  };

  const confirmScanProduct = async () => {
    if (!scanWizard) return;
    const { product, scannedCode } = scanWizard;
    const existingBc = getBarcodeFromProduct(product);
    if (!existingBc && scannedCode) {
      setSavingStockId(product.$id);
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const newFeatures = setBarcodeInFeatures(productFeaturesText(product), scannedCode);
        await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, product.$id, {
          FEATURES: newFeatures,
          barcode: scannedCode,
        });
        const updated = { ...product, FEATURES: newFeatures, barcode: scannedCode };
        setProducts(prev => prev.map(p => p.$id === product.$id ? updated : p));
        advanceScanWizardAfterConfirm(updated);
      } catch (e: unknown) {
        alert('Error al guardar código: ' + (e instanceof Error ? e.message : 'Error'));
        return;
      } finally {
        setSavingStockId(null);
      }
    } else {
      advanceScanWizardAfterConfirm();
    }
  };

  const confirmScanPackages = () => {
    if (!scanWizard) return;
    const pkgs = parseInt(scanWizard.packages, 10);
    if (isNaN(pkgs) || pkgs <= 0) {
      alert('Ingresa la cantidad de paquetes.');
      return;
    }
    const packQty = scanWizard.packQtyInput ? parseInt(scanWizard.packQtyInput, 10) : (scanWizard.product.PACKQTY || 0);
    if (!packQty || packQty <= 0) {
      alert('Ingresa las unidades por paquete antes de continuar.');
      return;
    }
    setScanWizard(w => (w ? { ...w, step: 'gondola' } : null));
  };

  const finishScanWizard = async () => {
    if (!scanWizard) return;
    const { product, packages, section, scannedCode, packQtyInput, isAddStock } = scanWizard;
    const packQty = packQtyInput ? parseInt(packQtyInput, 10) : (product.PACKQTY || 0);
    const pkgs = parseInt(packages, 10);
    setSavingStockId(product.$id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const payload: Record<string, unknown> = { ISACTIVE: true };
      if (packQty > 0 && !isNaN(pkgs) && pkgs >= 0) {
        payload.PACKQTY = packQty;
        const newUnits = pkgs * packQty;
        if (isAddStock && (product.STOCK || 0) > 0) {
          payload.STOCK = (product.STOCK || 0) + newUnits;
        } else {
          payload.STOCK = newUnits;
        }
        payload.ISACTIVE = (payload.STOCK as number) > 0;
      }
      let finalFeatures = productFeaturesText(product);
      finalFeatures = setSectionInFeatures(finalFeatures, section);
      finalFeatures = setBarcodeInFeatures(finalFeatures, getBarcodeFromProduct(product) || scannedCode);
      payload.FEATURES = finalFeatures;
      // Guardar barcode y section como atributos directos también
      const barcodeToSave = getBarcodeFromProduct(product) || scannedCode;
      if (barcodeToSave) (payload as Record<string, any>).barcode = barcodeToSave;
      if (section) (payload as Record<string, any>).section = section;
      try {
        await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, product.$id, payload);
      } catch (err: any) {
        if (err?.message?.includes('Unknown attribute') || err?.message?.includes('unknown attribute')) {
          delete (payload as Record<string, any>).barcode;
          delete (payload as Record<string, any>).section;
          await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, product.$id, payload);
        } else {
          throw err;
        }
      }
      setProducts(prev =>
        prev.map(p => (p.$id === product.$id ? { ...p, ...payload, FEATURES: finalFeatures as string } : p)),
      );
      if (section) setLastPlacedSection(section);
      setScanWizard(null);
      // Abrir escáner directamente para escaneo masivo
      openScanner('search');
    } catch (e: unknown) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Error al guardar'));
    } finally {
      setSavingStockId(null);
    }
  };

  const handleImportPackQty = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsImportingPackQty(true);
    setImportPackQtyResults(null);
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

      let updated = 0, notFound = 0, errors = 0;
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      for (const row of rows) {
        const sku = String(row['SKU'] || row['sku'] || row['Sku'] || '').trim();
        const packQty = parseInt(String(row['Cantidad por paquete'] || row['PACKQTY'] || row['PackQty'] || row['packQty'] || row['Cantidad'] || ''), 10);
        if (!sku || isNaN(packQty) || packQty <= 0) { errors++; continue; }

        // Buscar producto por SKU (en TAGS o FEATURES)
        const product = products.find(p => {
          const pSku = getSkuFromProduct(p);
          return pSku && pSku.toLowerCase() === sku.toLowerCase();
        });

        if (!product) { notFound++; continue; }

        try {
          await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, product.$id, { PACKQTY: packQty });
          setProducts(prev => prev.map(p => p.$id === product.$id ? { ...p, PACKQTY: packQty } : p));
          updated++;
        } catch {
          errors++;
        }
        // Rate limit
        await new Promise(r => setTimeout(r, 100));
      }
      setImportPackQtyResults({ updated, notFound, errors });
    } catch (err: any) {
      alert('Error al leer archivo: ' + (err.message || err));
    } finally {
      setIsImportingPackQty(false);
    }
  };

  const handleExportInventory = async () => {
    // Si estamos en vista de Excel, exportar productos seleccionados
    if (view === 'excel') {
      const selected = rows.filter(r => r.selected);
      if (selected.length === 0) { alert('No hay productos seleccionados'); return; }

      const exportData = selected.map(r => ({
        'Codigo': r.sku,
        'Código Barra': r.barcode,
        'Categoria': r.categoryEs,
        'Subcategoria': r.subcategory,
        'Nombre ES': r.nameEs || r.nameTranslated || r.nameCn,
        'Nombre CN': r.nameCn,
        'Precio Retail': r.priceRetail,
        'Precio Caja': r.priceWholesale,
        'Imagen URL': r.imageUrl,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Productos');
      XLSX.writeFile(wb, 'productos_seleccionados.xlsx');
      return;
    }

    // Export normal del inventario completo
    setIsExporting(true);
    try {
      // Combinar inventario + catálogo publicado (sin duplicados)
      const allProducts = [...products];
      const inventoryIds = new Set(products.map(p => p.$id));
      for (const pp of publishedProducts) {
        if (!inventoryIds.has(pp.$id)) allProducts.push(pp);
      }

      const exportRows = allProducts.map(p => {
        const sku = getSkuFromProduct(p);
        const barcode = getBarcodeFromProduct(p);
        const section = getSectionFromProduct(p);
        const isPublished = !inventoryIds.has(p.$id);
        return {
          'SKU': sku || (p as any).jumpseller_id || '',
          'Código de barras': barcode || (p as any).barcode || '',
          'Nombre': p.NAME || '',
          'Stock': p.STOCK || 0,
          'Cantidad por paquete': p.PACKQTY || '',
          'Paquetes': p.PACKQTY ? Math.max(0, Math.round((p.STOCK || 0) / p.PACKQTY)) : '',
          'Sección/Bodega': section || '',
          'Categoría': p.CATEGORYID || '',
          'Subcategoría': p.SUBCATEGORYID || '',
          'Precio': p.PRICE || '',
          'Estado': isPublished ? 'Publicado' : (p.ISACTIVE ? 'En inventario' : 'Inactivo'),
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      // Auto-ajustar ancho de columnas
      const colWidths = Object.keys(exportRows[0] || {}).map(key => ({
        wch: Math.max(key.length, ...exportRows.map(r => String((r as any)[key] || '').length)).toString().length + 2,
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `inventario_${date}.xlsx`);
    } catch (err) {
      console.error('[inventario] export error:', err);
      alert('Error al exportar inventario.');
    } finally {
      setIsExporting(false);
    }
  };

  const savePackQty = async () => {
    if (!editStockModal) return;
    const newPackQty = parseInt(editPackQtyValue, 10);
    const newPackages = parseInt(editPackagesValue, 10);
    if (isNaN(newPackQty) || newPackQty <= 0) return;
    if (isNaN(newPackages) || newPackages < 0) return;
    const newStock = newPackages * newPackQty;
    setSavingStockId(editStockModal.$id);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const payload: Record<string, any> = {
        PACKQTY: newPackQty,
        STOCK: newStock,
        ISACTIVE: newStock > 0,
      };
      let finalFeatures = editStockModal.FEATURES || '';
      finalFeatures = setSectionInFeatures(finalFeatures, editSectionValue);
      const barcodeToSave =
        editBarcodeValue.trim() || barcodeEdits[editStockModal.$id]?.trim() || '';
      finalFeatures = setBarcodeInFeatures(finalFeatures, barcodeToSave);

      if (finalFeatures !== (editStockModal.FEATURES || '')) {
        payload.FEATURES = finalFeatures;
      }

      await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, editStockModal.$id, payload);
      setProducts(prev => prev.map(p => p.$id === editStockModal.$id
        ? { ...p, PACKQTY: newPackQty, STOCK: newStock, ISACTIVE: newStock > 0, ...(payload.FEATURES ? { FEATURES: payload.FEATURES } : {}) }
        : p));
      if (barcodeToSave) {
        setBarcodeEdits(prev => {
          const next = { ...prev };
          delete next[editStockModal.$id];
          return next;
        });
      }
      if (editSectionValue) setLastPlacedSection(editSectionValue);
      closeEditStockModal();
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSavingStockId(null);
    }
  };

  const handleBarcodeScan = (rawCode: string) => {
    const code = String(rawCode ?? '').trim();
    if (!code) return;

    try {
      if (scanTarget === 'search') {
        // Detectar si es un código ya escaneado en esta sesión
        const codeLower = code.toLowerCase();
        if (scannedCodesRef.current.has(codeLower)) {
          const product = products.find(p => {
            const bc = getBarcodeFromProduct(p).toLowerCase();
            const sku = getSkuFromProduct(p).toLowerCase();
            return (bc && bc === codeLower) || (sku && sku === codeLower);
          });
          if (product) {
            setDuplicateScanWarning({ code, product });
            setShowScanner(false);
            return;
          }
        }

        const directMatch = products.find(p => {
          const bc = getBarcodeFromProduct(p).toLowerCase();
          const sku = getSkuFromProduct(p).toLowerCase();
          return (bc && bc === codeLower) || (sku && sku === codeLower);
        });

        if (directMatch) {
          scannedCodesRef.current.add(codeLower);
          // Si ya tiene stock, avisar que ya está registrado
          if ((directMatch.STOCK || 0) > 0) {
            setDuplicateScanWarning({ code, product: directMatch });
            setShowScanner(false);
            return;
          }
          startScanWizard(directMatch, code);
        } else if (code.length >= 8) {
          const last4 = code.slice(-4).toLowerCase();
          const matches = products.filter(p => {
            const sku = getSkuFromProduct(p).toLowerCase();
            return sku && sku.endsWith(last4) && !getBarcodeFromProduct(p);
          });
          if (matches.length === 1) {
            startScanWizard(matches[0], code);
          } else {
            setShowScanner(false);
            setUnregisteredModal({ code });
          }
        } else {
          setShowScanner(false);
          setUnregisteredModal({ code });
        }
      } else if (scanTarget === 'searchOnly') {
        // Solo poner el código en la barra de búsqueda
        setCatalogSearch(code);
        closeScanner();
      } else if (scanTarget === 'editBarcode') {
        setEditBarcodeValue(code);
      } else {
        setBarcodeEdits(prev => ({ ...prev, [scanTarget]: code }));
      }
    } catch (err) {
      console.error('[inventario] handleBarcodeScan:', err);
      alert('Error al procesar el código escaneado. Intenta de nuevo.');
    } finally {
      if (scanTarget !== 'search' && scanTarget !== 'searchOnly') {
        closeScanner();
      }
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace('/admin/login');
      return;
    }
    if (!isAdminEmail(user?.email)) {
      logout().finally(() => router.replace('/admin/login'));
    }
  }, [authLoading, isLoggedIn, user?.email, router, logout]);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // 1. Cargar productos de INVENTORY_PRODUCTS — lote inicial de 50 (optimizado para ahorrar requests)
      const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(50)];
      const resp: any = await databases.listDocuments(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, queries);
      const allInventory = resp.documents as unknown as Product[];

      // 2. Cargar productos de PRODUCTS (catálogo publicado) — para detección de duplicados y vista Ubicados
      const skus = new Set<string>();
      const barcodes = new Set<string>();
      const allPublished: Product[] = [];
      try {
        const pResp: any = await cached('products:published_50', TTL.products, async () => {
          return await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [
            Query.orderDesc('$createdAt'), Query.limit(50),
          ]);
        });
        for (const d of pResp.documents) {
          const sku = (d.jumpseller_id || '').toLowerCase();
          const bc = (d.barcode || '').toLowerCase();
          if (sku) skus.add(sku);
          if (bc) barcodes.add(bc);
        }
        allPublished.push(...pResp.documents);
      } catch (e) {
        console.warn('No se pudieron cargar productos del catálogo:', e);
      }

      // 3. Cargar categorías y subcategorías
      const [cr, sr] = await Promise.all([
        cached('categories:all', TTL.categories, async () => {
          return await databases.listDocuments(databaseId, CATEGORIES_COLLECTION_ID, [Query.limit(100)]);
        }),
        cached('subcategories:all', TTL.categories, async () => {
          return await databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION_ID, [Query.limit(500)]);
        }),
      ]);

      setProducts(allInventory);
      setPublishedSkus(skus);
      setPublishedBarcodes(barcodes);
      setPublishedProducts(allPublished);
      setCategories(cr.documents as unknown as Category[]);
      setSubcategories(sr.documents as unknown as Subcategory[]);
    } catch (e: any) { console.error(e); }
    finally { setLoadingProducts(false); }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const getSku = getSkuFromProduct;
  const getBarcode = getBarcodeFromProduct;

  const triggerSearch = async (searchTerm: string) => {
    const q = searchTerm.trim();
    if (!q) return;

    setIsSearchingDb(true);
    setLoadingProducts(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      const qLower = q.toLowerCase();
      const qUpper = q.toUpperCase();

      const queries = [
        [Query.equal('sku', [q, qLower, qUpper])],
        [Query.equal('jumpseller_id', [q, qLower, qUpper])],
        [Query.equal('barcode', [q, qLower, qUpper])],
        [Query.contains('NAME', q)],
        [Query.contains('NAME', qLower)],
        [Query.contains('NAME', qUpper)],
      ];

      let found: Product[] = [];

      for (const qry of queries) {
        try {
          const resp = await databases.listDocuments(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, [...qry, Query.limit(10)]);
          if (resp.documents.length > 0) {
            found.push(...(resp.documents as unknown as Product[]));
            break;
          }
        } catch {}
      }

      if (found.length === 0) {
        for (const qry of queries) {
          try {
            const resp = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION_ID, [...qry, Query.limit(10)]);
            if (resp.documents.length > 0) {
              found.push(...(resp.documents as unknown as Product[]));
              break;
            }
          } catch {}
        }
      }

      if (found.length > 0) {
        setProducts(prev => {
          const next = [...prev];
          found.forEach(item => {
            if (!next.some(p => p.$id === item.$id)) next.unshift(item);
          });
          return next;
        });

        setPublishedProducts(prev => {
          const next = [...prev];
          found.forEach(item => {
            if (!next.some(p => p.$id === item.$id)) next.unshift(item);
          });
          return next;
        });

        setPublishedSkus(prev => {
          const next = new Set(prev);
          found.forEach(item => {
            const sku = (item.jumpseller_id || '').toLowerCase();
            if (sku) next.add(sku);
          });
          return next;
        });
      } else {
        alert('No se encontraron productos en la base de datos con ese SKU, barra o nombre.');
      }
    } catch (e: any) {
      alert('Error en búsqueda de base de datos: ' + e.message);
    } finally {
      setIsSearchingDb(false);
      setLoadingProducts(false);
    }
  };

  const findProduct = (sku: string): Product | undefined => {
    if (!sku) return undefined;
    const skuLower = sku.toLowerCase();
    return products.find(p => {
      const pSku = getSku(p);
      if (pSku && pSku.toLowerCase() === skuLower) return true;
      if (p.jumpseller_id?.toLowerCase() === skuLower) return true;
      return false;
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsLoading(true);
    setSaveResults(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

      const parsed: InventoryRow[] = jsonData.map((row) => {
        const sku = String(row['Codigo'] || '').trim();
        const barcode = String(row['Código Barra'] || '').trim();
        // Support both formats: translated (Categoria/Subcategoria) and raw Qianji
        const isTranslated = !!row['Nombre CN'] || !!row['Precio Retail'];
        const categoryRaw = String(row['Categoria'] || '').trim();
        const categoryEs = isTranslated ? categoryRaw : '';
        const subcategory = String(row['Subcategoria'] || '').trim();
        const nameEs = String(row['Nombre del producto 2'] || row['Nombre ES'] || '').trim();
        const nameCn = String(row['Nombre del producto 1'] || row['Nombre CN'] || '').trim();
        const nameTranslated = String(row['Nombre Traducido'] || '').trim();
        const priceRetail = parsePrice(row['Precio por paquete'] || row['Precio Retail']);
        const priceWholesale = parsePrice(row['Precio por caja'] || row['Precio Caja']);
        const imageUrl = String(row['Imagen URL'] || '').trim();
        const dateAdded = String(row['Fecha'] || row['fecha'] || row['FECHA'] || row['Fecha Ingreso'] || row['fecha_ingreso'] || '').trim();

        const product = findProduct(sku);

        return {
          sku,
          barcode,
          categoryRaw: isTranslated ? '' : categoryRaw,
          categoryEs,
          subcategory,
          nameEs,
          nameCn,
          nameTranslated,
          priceRetail,
          priceWholesale,
          currentStock: product?.STOCK ?? 0,
          newStock: 0,
          productId: product?.$id || null,
          matched: !!product,
          selected: true,
          imageUrl: imageUrl || product?.IMAGEURL || '',
          isNew: !product,
          translated: isTranslated || !!nameTranslated,
          dateAdded,
        };
      });

      setRows(parsed);
      setView('excel');
    } catch (e: any) {
      alert('Error al leer el archivo: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    const needsTranslation = rows.filter(r => !r.translated && (r.nameCn || r.categoryRaw));
    if (needsTranslation.length === 0) { alert('Todos los productos ya están traducidos'); return; }
    if (!getApiKey()) { alert('Configura tu API key de Gemini en Admin > Configuración > AI'); return; }

    if (!confirm(`¿Traducir ${needsTranslation.length} productos con IA? Se procesarán en lotes de 200.`)) return;

    setIsTranslating(true);
    setTranslateProgress(0);
    const BATCH = 200;

    try {
      for (let i = 0; i < needsTranslation.length; i += BATCH) {
        const batch = needsTranslation.slice(i, i + BATCH);
        const items = batch.map(r => ({ sku: r.sku, nameCn: r.nameCn || r.nameEs, categoryRaw: r.categoryRaw }));

        const translations = await callGeminiBatch(items);

        setRows(prev => prev.map(r => {
          const t = translations[r.sku];
          if (!t) return r;
          return {
            ...r,
            nameTranslated: t.nameEs || r.nameEs,
            categoryEs: t.category || r.categoryRaw,
            subcategory: t.subcategory || r.subcategory,
            translated: true,
          };
        }));

        setTranslateProgress(Math.round(((i + BATCH) / needsTranslation.length) * 100));
        if (i + BATCH < needsTranslation.length) await new Promise(res => setTimeout(res, 800));
      }
    } catch (e: any) {
      alert('Error en traducción: ' + e.message);
    } finally {
      setIsTranslating(false);
      setTranslateProgress(0);
    }
  };

  const toggleRow = (idx: number) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, selected: !r.selected } : r));
  };

  const toggleAll = () => {
    const vis = filtered;
    const allSel = vis.every(r => r.selected);
    const visSkus = new Set(vis.map(r => r.sku));
    setRows(prev => prev.map(r => visSkus.has(r.sku) ? { ...r, selected: !allSel } : r));
  };

  const updateNewStock = (idx: number, value: number) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, newStock: Math.max(0, value) } : r));
  };

  const resolveCategoryIds = (categoryEs: string, subcategory: string): { catId: string; subId: string } => {
    if (!categoryEs) return { catId: '', subId: '' };
    const catFound = categories.find(c =>
      (c.name || '').toLowerCase().trim() === categoryEs.toLowerCase().trim()
    );
    const catId = catFound?.$id || '';
    if (!catId || !subcategory) return { catId, subId: '' };
    const subFound = subcategories.find(s =>
      s.categoryId === catId && (s.name || '').toLowerCase().trim() === subcategory.toLowerCase().trim()
    );
    return { catId, subId: subFound?.$id || '' };
  };

  const handleCreateCategories = async () => {
    const rowsWithCat = rows.filter(r => r.categoryEs);
    if (rowsWithCat.length === 0) { alert('No hay categorías para crear. Sube un Excel traducido primero.'); return; }

    // Collect unique category + subcategory pairs
    const catMap = new Map<string, Set<string>>();
    rowsWithCat.forEach(r => {
      if (!catMap.has(r.categoryEs)) catMap.set(r.categoryEs, new Set());
      if (r.subcategory) catMap.get(r.categoryEs)!.add(r.subcategory);
    });

    if (!confirm(`¿Crear ${catMap.size} categorías y sus subcategorías en Appwrite?`)) return;

    setIsCreatingCats(true);
    setCatResults(null);
    let catsCreated = 0, subsCreated = 0, errors = 0;

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      for (const [catName, subs] of catMap) {
        try {
          // Check if category already exists
          let catDoc = categories.find(c => (c.name || '').toLowerCase().trim() === catName.toLowerCase().trim());
          let catId = catDoc?.$id || '';

          if (!catDoc) {
            const doc = await databases.createDocument(databaseId, CATEGORIES_COLLECTION_ID, ID.unique(), {
              name: catName,
              iconUrl: '',
              order: categories.length + catsCreated,
            });
            catId = (doc as any).$id;
            catsCreated++;
          }

          // Create subcategories
          for (const subName of subs) {
            try {
              const subExists = subcategories.find(s =>
                s.categoryId === catId && (s.name || '').toLowerCase().trim() === subName.toLowerCase().trim()
              );
              if (!subExists) {
                await databases.createDocument(databaseId, SUBCATEGORIES_COLLECTION_ID, ID.unique(), {
                  name: subName,
                  categoryId: catId,
                  order: 0,
                });
                subsCreated++;
              }
            } catch { errors++; }
            await new Promise(r => setTimeout(r, 500));
          }
        } catch { errors++; }
        await new Promise(r => setTimeout(r, 500));
      }

      setCatResults({ cats: catsCreated, subs: subsCreated, errors });
      // Reload categories and subcategories
      await loadProducts();
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setIsCreatingCats(false); }
  };

  const handleMigrateActive = async () => {
    if (products.length === 0) { alert('No hay productos cargados'); return; }
    const stock0 = products.filter(p => (p.STOCK ?? 0) === 0);
    const stockOk = products.filter(p => (p.STOCK ?? 0) > 0);
    if (!confirm(`¿Migrar ${products.length} productos?\n\n• ${stock0.length} con stock 0 → INACTIVOS (ocultos)\n• ${stockOk.length} con stock > 0 → ACTIVOS (visibles)`)) return;

    setIsMigrating(true);
    setMigrateProgress(0);
    setMigrateResults(null);
    let activated = 0, deactivated = 0, errors = 0;

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const shouldBeActive = (p.STOCK ?? 0) > 0;
        if (p.ISACTIVE === shouldBeActive) {
          // Ya está en el estado correcto, saltar
          if (shouldBeActive) activated++; else deactivated++;
        } else {
          try {
            await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, p.$id, { ISACTIVE: shouldBeActive });
            if (shouldBeActive) activated++; else deactivated++;
          } catch { errors++; }
          await new Promise(r => setTimeout(r, 150));
        }
        setMigrateProgress(Math.round(((i + 1) / products.length) * 100));
      }
      setMigrateResults({ activated, deactivated, errors });
      await loadProducts();
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setIsMigrating(false); }
  };

  const handleExportSelected = () => {
    const selected = rows.filter(r => r.selected);
    if (selected.length === 0) { alert('No hay productos seleccionados'); return; }

    const exportData = selected.map(r => ({
      'Codigo': r.sku,
      'Código Barra': r.barcode,
      'Categoria': r.categoryEs,
      'Subcategoria': r.subcategory,
      'Nombre ES': r.nameEs || r.nameTranslated || r.nameCn,
      'Nombre CN': r.nameCn,
      'Precio Retail': r.priceRetail,
      'Precio Caja': r.priceWholesale,
      'Imagen URL': r.imageUrl,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos_seleccionados.xlsx');
  };

  const handleSave = async () => {
    const selected = rows.filter(r => r.selected);
    if (selected.length === 0) { alert('No hay productos seleccionados'); return; }

    const existing = selected.filter(r => r.matched && r.productId);
    const newOnes = selected.filter(r => r.isNew);

    if (existing.length === 0 && newOnes.length === 0) { alert('No hay productos para procesar.'); return; }

    // Para existentes: calcular cuántos necesitan actualización (tienen datos faltantes)
    const existingNeedingUpdate = existing.filter(row => {
      const product = products.find(p => p.$id === row.productId);
      if (!product) return false;
      const hasName = !!(product.NAME && product.NAME.trim());
      const hasBarcode = !!(getBarcodeFromProduct(product) || (product as any).barcode);
      const hasCategory = !!(product.CATEGORYID && product.CATEGORYID.trim());
      const hasSubcategory = !!(product.SUBCATEGORYID && product.SUBCATEGORYID.trim());
      const hasPriceRetail = !!(product.PRICE && product.PRICE > 0);
      const hasPriceWholesale = !!((product as any).WHOLESALEPRICE && (product as any).WHOLESALEPRICE > 0);
      // Necesita actualización si falta algún dato Y el Excel lo tiene
      const needsName = !hasName && (row.nameEs || row.nameTranslated || row.nameCn);
      const needsBarcode = !hasBarcode && row.barcode;
      const needsCategory = !hasCategory && row.categoryEs;
      const needsSubcategory = !hasSubcategory && row.subcategory;
      const needsPriceRetail = !hasPriceRetail && row.priceRetail;
      const needsPriceWholesale = !hasPriceWholesale && row.priceWholesale;
      return needsName || needsBarcode || needsCategory || needsSubcategory || needsPriceRetail || needsPriceWholesale;
    });
    const existingComplete = existing.length - existingNeedingUpdate.length;

    if (!confirm(`Se crearán ${newOnes.length} nuevos, se completarán datos faltantes en ${existingNeedingUpdate.length} existentes, y se omitirán ${existingComplete} que ya tienen todo. ¿Continuar?`)) return;

    setIsSaving(true);
    setSaveResults(null);
    setSaveProgress(0);
    let skipped = existingComplete, patched = 0, created = 0, errors = 0;
    const totalToProcess = existingNeedingUpdate.length + newOnes.length;

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      // Productos existentes: solo rellenar datos faltantes (nunca sobreescribir)
      for (let i = 0; i < existingNeedingUpdate.length; i++) {
        const row = existingNeedingUpdate[i];
        try {
          const product = products.find(p => p.$id === row.productId);
          if (!product) { errors++; continue; }

          const payload: any = {};

          // Nombre: solo si el producto no tiene nombre y el Excel sí
          const hasName = !!(product.NAME && product.NAME.trim());
          if (!hasName && (row.nameEs || row.nameTranslated || row.nameCn)) {
            payload.NAME = row.nameEs || row.nameTranslated || row.nameCn;
          }

          // Barcode: solo si no tiene y el Excel sí
          const hasBarcode = !!(getBarcodeFromProduct(product) || (product as any).barcode);
          if (!hasBarcode && row.barcode) {
            payload.barcode = row.barcode;
            // También agregar a FEATURES como fallback
            const features = productFeaturesText(product);
            payload.FEATURES = features ? `${features}\nBarcode: ${row.barcode}` : `Barcode: ${row.barcode}`;
          }

          // Categoría: solo si no tiene y el Excel sí
          const hasCategory = !!(product.CATEGORYID && product.CATEGORYID.trim());
          if (!hasCategory && row.categoryEs) {
            const { catId } = resolveCategoryIds(row.categoryEs, row.subcategory);
            if (catId) payload.CATEGORYID = catId;
          }

          // Subcategoría: solo si no tiene y el Excel sí
          const hasSubcategory = !!(product.SUBCATEGORYID && product.SUBCATEGORYID.trim());
          if (!hasSubcategory && row.subcategory) {
            const { subId } = resolveCategoryIds(row.categoryEs, row.subcategory);
            if (subId) payload.SUBCATEGORYID = subId;
          }

          // Precio retail: solo si no tiene y el Excel sí
          const hasPriceRetail = !!(product.PRICE && product.PRICE > 0);
          if (!hasPriceRetail && row.priceRetail) {
            payload.PRICE = row.priceRetail;
          }

          // Precio wholesale: solo si no tiene y el Excel sí
          const hasPriceWholesale = !!((product as any).WHOLESALEPRICE && (product as any).WHOLESALEPRICE > 0);
          if (!hasPriceWholesale && row.priceWholesale) {
            payload.WHOLESALEPRICE = row.priceWholesale;
          }

          // Solo hacer update si hay algo que actualizar
          if (Object.keys(payload).length > 0) {
            // NOTA: NUNCA actualizamos STOCK ni ISACTIVE desde el Excel.
            await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, row.productId!, payload);
            patched++;
          } else {
            skipped++;
          }
          setSaveProgress(Math.round(((i + 1) / totalToProcess) * 100));
          // Rate limit
          await new Promise(r => setTimeout(r, 350));
          if ((i + 1) % 50 === 0) await new Promise(r => setTimeout(r, 3000));
        } catch (e: any) {
          if (e?.message?.includes('Rate limit')) { await new Promise(r => setTimeout(r, 5000)); i--; continue; }
          errors++; await new Promise(r => setTimeout(r, 500));
        }
      }

      // Productos nuevos: crear en inventory_products SIEMPRE con STOCK=0 e ISACTIVE=false
      const now = new Date().toISOString();
      for (let i = 0; i < newOnes.length; i++) {
        const row = newOnes[i];
        try {
          // ⚠️ Validar duplicados contra catálogo PUBLICADO antes de crear
          const skuLower = row.sku.toLowerCase();
          const bcLower = row.barcode.toLowerCase();
          if (skuLower && publishedSkus.has(skuLower)) {
            console.warn(`SKU ${row.sku} ya existe en catálogo publicado, saltando`);
            errors++;
            continue;
          }
          if (bcLower && publishedBarcodes.has(bcLower)) {
            console.warn(`Barcode ${row.barcode} ya existe en catálogo publicado, saltando`);
            errors++;
            continue;
          }

          const nameDisplay = row.nameEs || row.nameTranslated || row.nameCn;
          const { catId, subId } = resolveCategoryIds(row.categoryEs, row.subcategory);
          const payload: any = {
            sku: row.sku,
            barcode: row.barcode || '',
            NAME: nameDisplay,
            PRICE: row.priceRetail || 0,
            STOCK: 0,                          // 🔒 SIEMPRE 0 al importar
            WHOLESALEPRICE: row.priceWholesale || 0,
            WHOLESALEMINQUANTITY: 0,
            IMAGEURL: row.imageUrl || '',
            IMAGEURL2: '', IMAGEURL3: '',
            CATEGORYID: catId || '',
            SUBCATEGORYID: subId || '',
            TAGS: row.sku,
            FEATURES: `SKU: ${row.sku}${row.barcode ? `\nBarcode: ${row.barcode}` : ''}${row.nameCn ? `\nZH: ${row.nameCn}` : ''}${row.nameTranslated ? `\nES: ${row.nameTranslated}` : ''}`,
            name_cn: row.nameCn || '',
            ISACTIVE: false,                   // 🔒 SIEMPRE inactivo al importar
            DATE_ADDED: row.dateAdded || now,
            $createdAt: now,
          };
          const doc = await databases.createDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, ID.unique(), payload);
          created++;
          setRows(prev => prev.map(r => r.sku === row.sku ? {
            ...r, productId: (doc as any).$id, matched: true, isNew: false, currentStock: 0,
          } : r));
          setSaveProgress(Math.round(((existingNeedingUpdate.length + i + 1) / totalToProcess) * 100));
          // Rate limit: pausa entre requests, pausa larga cada 50 docs
          await new Promise(r => setTimeout(r, 350));
          if ((i + 1) % 50 === 0) await new Promise(r => setTimeout(r, 3000));
        } catch (e: any) {
          if (e?.message?.includes('Rate limit')) { await new Promise(r => setTimeout(r, 5000)); i--; continue; }
          console.error('Error creando producto en inventario:', e?.message);
          errors++;
          await new Promise(r => setTimeout(r, 500));
        }
      }

      setSaveProgress(100);
      setSaveResults({ skipped, patched, created, errors });
      loadProducts();
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setIsSaving(false); }
  };

  const assignStock = async (productId: string) => {
    const product = products.find(p => p.$id === productId);
    if (!product) return;

    const pkgRaw = stockEdits[productId];
    const pkgs = parseInt(pkgRaw, 10);
    if (isNaN(pkgs) || pkgs <= 0) return;

    // Determine PACKQTY: existing on product OR entered inline
    let packQty = product.PACKQTY || 0;
    const inlinePackQtyRaw = packQtyEdits[productId];
    const inlinePackQty = parseInt(inlinePackQtyRaw, 10);
    const needsSavePackQty = !packQty && !isNaN(inlinePackQty) && inlinePackQty > 0;
    if (needsSavePackQty) packQty = inlinePackQty;

    if (!packQty || packQty <= 0) {
      alert('Debes establecer la cantidad por paquete primero.');
      return;
    }

    const finalStock = pkgs * packQty;

    setSavingStockId(productId);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const payload: Record<string, any> = {
        STOCK: finalStock,
        ISACTIVE: finalStock > 0,
      };
      if (needsSavePackQty) payload.PACKQTY = packQty;

      // Save inline barcode if provided
      const inlineBarcode = barcodeEdits[productId]?.trim();
      const existingBarcode = getBarcode(product);
      if (!existingBarcode && inlineBarcode) {
        const features = product.FEATURES || '';
        payload.FEATURES = features ? `${features}\nBarcode: ${inlineBarcode}` : `Barcode: ${inlineBarcode}`;
      }

      await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, productId, payload);
      setProducts(prev => prev.map(p => p.$id === productId
        ? { ...p, STOCK: finalStock, ISACTIVE: finalStock > 0, PACKQTY: packQty, FEATURES: payload.FEATURES || p.FEATURES }
        : p));
      setStockEdits(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setPackQtyEdits(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setBarcodeEdits(prev => { const n = { ...prev }; delete n[productId]; return n; });
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSavingStockId(null);
    }
  };

  const saveProductEdits = async (productId: string) => {
    const product = products.find(p => p.$id === productId);
    if (!product) return;

    const inlineBarcode = barcodeEdits[productId]?.trim();
    const inlinePackQty = packQtyEdits[productId]?.trim();
    const parsedPackQty = parseInt(inlinePackQty, 10);

    if (!inlineBarcode && (isNaN(parsedPackQty) || parsedPackQty <= 0)) {
      alert('No hay cambios para guardar.');
      return;
    }

    setSavingStockId(productId);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      const payload: Record<string, any> = {};

      // Save barcode if provided and product doesn't have one
      const existingBarcode = getBarcode(product);
      if (!existingBarcode && inlineBarcode) {
        const features = product.FEATURES || '';
        payload.FEATURES = features ? `${features}\nBarcode: ${inlineBarcode}` : `Barcode: ${inlineBarcode}`;
      }

      // Save pack qty if provided and product doesn't have one
      if (!product.PACKQTY && !isNaN(parsedPackQty) && parsedPackQty > 0) {
        payload.PACKQTY = parsedPackQty;
      }

      if (Object.keys(payload).length === 0) {
        alert('No hay cambios para guardar.');
        setSavingStockId(null);
        return;
      }

      await databases.updateDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, productId, payload);
      setProducts(prev => prev.map(p => p.$id === productId
        ? { ...p, ...payload }
        : p));
      setBarcodeEdits(prev => { const n = { ...prev }; delete n[productId]; return n; });
      setPackQtyEdits(prev => { const n = { ...prev }; delete n[productId]; return n; });
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSavingStockId(null);
    }
  };

  const getSection = getSectionFromProduct;

  /**
   * 📤 Publica un producto del inventario al catálogo principal.
   * - Crea documento en `products`
   * - Elimina documento de `inventory_products`
   * - Solo permite publicar si tiene STOCK > 0
   * - Valida que el SKU/barcode no exista ya en el catálogo
   */
  const deleteFromInventory = async (productId: string) => {
    setDeletingId(productId);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.deleteDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, productId);
      setProducts(prev => prev.filter(p => p.$id !== productId));
      setDeleteConfirm(null);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const publishToCatalog = async (productId: string): Promise<boolean> => {
    const p = products.find(x => x.$id === productId);
    if (!p) return false;
    if ((p.STOCK || 0) <= 0) {
      alert('No se puede publicar un producto sin stock.');
      return false;
    }

    // Validar que no exista en catálogo (doble chequeo: estado local + Appwrite)
    const sku = getSkuFromProduct(p).toLowerCase();
    const barcode = getBarcodeFromProduct(p).toLowerCase();
    if (sku && publishedSkus.has(sku)) {
      alert(`El SKU "${sku}" ya existe en el catálogo. No se puede publicar.`);
      return false;
    }
    if (barcode && publishedBarcodes.has(barcode)) {
      alert(`El código de barras "${barcode}" ya existe en el catálogo. No se puede publicar.`);
      return false;
    }

    setSavingStockId(productId);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      const payload = buildCatalogPublishPayload(p);

      // 1. Crear en catálogo (defensivo: ir eliminando campos opcionales uno por uno si fallan)
      const optionalFields = ['barcode', 'sku', 'jumpseller_id', 'PACKQTY', 'SUBCATEGORYID'];
      let newProductsDocId: string = '';
      let createSuccess = false;
      try {
        const created = await databases.createDocument(databaseId, PRODUCTS_COLLECTION_ID, ID.unique(), payload);
        newProductsDocId = created.$id;
        createSuccess = true;
      } catch (createErr: any) {
        if (!createErr?.message?.includes('Unknown attribute')) throw createErr;
        // Intentar eliminando campos opcionales uno por uno hasta que funcione
        let retryPayload = { ...payload };
        for (const field of optionalFields) {
          delete (retryPayload as any)[field];
          try {
            const created = await databases.createDocument(databaseId, PRODUCTS_COLLECTION_ID, ID.unique(), retryPayload);
            newProductsDocId = created.$id;
            createSuccess = true;
            break;
          } catch (retryErr: any) {
            if (!retryErr?.message?.includes('Unknown attribute')) throw retryErr;
            continue;
          }
        }
        if (!createSuccess) {
          // Último intento sin section tampoco
          delete (retryPayload as any).section;
          const created = await databases.createDocument(databaseId, PRODUCTS_COLLECTION_ID, ID.unique(), retryPayload);
          newProductsDocId = created.$id;
        }
      }

      // 2. Eliminar de inventario
      await databases.deleteDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, productId);

      // 3. Eliminar de catalog_products si existe (mismo $id o mismo SKU)
      try {
        // Try by $id first
        await databases.deleteDocument(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, productId);
      } catch {
        // Not found by $id, try by SKU
        if (sku) {
          try {
            const catRes = await databases.listDocuments(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, [
              Query.equal('sku', sku), Query.limit(1),
            ]);
            if (catRes.documents.length > 0) {
              await databases.deleteDocument(databaseId, CATALOG_PRODUCTS_COLLECTION_ID, catRes.documents[0].$id);
            }
          } catch {}
        }
      }

      // 4. Update stock alerts pointing to old productId with new products doc $id
      if (newProductsDocId) {
        try {
          const alertRes = await databases.listDocuments(databaseId, STOCK_ALERTS_COLLECTION_ID, [
            Query.equal('productId', productId), Query.limit(100),
          ]);
          await Promise.all(alertRes.documents.map((a: any) =>
            databases.updateDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, a.$id, {
              productId: newProductsDocId,
              productImage: p.IMAGEURL || p.IMAGEURL2 || '',
              productName: p.NAME || '',
              sku: sku || '',
            })
          ));
        } catch (e) {
          console.warn('No se pudieron actualizar las alertas de stock:', e);
        }
        // Also update alerts that pointed to a catalog_products doc with same SKU
        if (sku) {
          try {
            const catAlerts = await databases.listDocuments(databaseId, STOCK_ALERTS_COLLECTION_ID, [
              Query.equal('sku', sku), Query.limit(100),
            ]);
            const toUpdate = catAlerts.documents.filter((a: any) => a.productId !== newProductsDocId);
            await Promise.all(toUpdate.map((a: any) =>
              databases.updateDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, a.$id, {
                productId: newProductsDocId,
                productImage: p.IMAGEURL || p.IMAGEURL2 || '',
                productName: p.NAME || '',
              })
            ));
          } catch (e) {
            console.warn('No se pudieron actualizar las alertas por SKU:', e);
          }
        }
      }

      // 4. Actualizar estado local
      setProducts(prev => prev.filter(x => x.$id !== productId));
      if (sku) setPublishedSkus(prev => new Set(prev).add(sku));
      if (barcode) setPublishedBarcodes(prev => new Set(prev).add(barcode));
      // Agregar a publishedProducts para que aparezca en Ubicados
      const publishedProduct = { ...p, section: getSectionFromProduct(p) } as any;
      setPublishedProducts(prev => [...prev, publishedProduct]);

      // 4. Invalidar caché del catálogo público
      invalidateProductCache();

      return true;
    } catch (e: any) {
      alert('Error al publicar: ' + (e?.message || 'desconocido'));
      return false;
    } finally {
      setSavingStockId(null);
    }
  };

  /**
   * 🚀 Publica TODOS los productos con stock > 0 al catálogo.
   * Procesa uno por uno con delay para no saturar Appwrite.
   */
  const publishAllWithStock = async () => {
    const withStock = products.filter(p => (p.STOCK || 0) > 0);
    if (withStock.length === 0) {
      alert('No hay productos con stock para publicar.');
      return;
    }
    if (!confirm(`¿Publicar ${withStock.length} producto(s) al catálogo? Se eliminarán del inventario.`)) return;

    setIsPublishing(true);
    setPublishProgress(0);
    setPublishResults(null);
    let published = 0;
    let errors = 0;

    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

      for (let i = 0; i < withStock.length; i++) {
        const p = withStock[i];
        try {
          const sku = getSkuFromProduct(p).toLowerCase();
          const barcode = getBarcodeFromProduct(p).toLowerCase();

          // Saltar duplicados (silenciosamente, ya están publicados)
          if ((sku && publishedSkus.has(sku)) || (barcode && publishedBarcodes.has(barcode))) {
            console.warn(`Saltando ${p.NAME}: SKU o barcode ya en catálogo`);
            errors++;
            setPublishProgress(Math.round(((i + 1) / withStock.length) * 100));
            continue;
          }

          const payload = buildCatalogPublishPayload(p);

          let newDocId = '';
          try {
            const created = await databases.createDocument(databaseId, PRODUCTS_COLLECTION_ID, ID.unique(), payload);
            newDocId = created.$id;
          } catch (createErr: any) {
            if (!createErr?.message?.includes('Unknown attribute')) throw createErr;
            const optionalFields = ['barcode', 'sku', 'jumpseller_id', 'PACKQTY', 'SUBCATEGORYID'];
            let retryPayload = { ...payload };
            let retryOk = false;
            for (const field of optionalFields) {
              delete (retryPayload as any)[field];
              try {
                const created = await databases.createDocument(databaseId, PRODUCTS_COLLECTION_ID, ID.unique(), retryPayload);
                newDocId = created.$id;
                retryOk = true;
                break;
              } catch (retryErr: any) {
                if (!retryErr?.message?.includes('Unknown attribute')) throw retryErr;
                continue;
              }
            }
            if (!retryOk) {
              delete (retryPayload as any).section;
              const created = await databases.createDocument(databaseId, PRODUCTS_COLLECTION_ID, ID.unique(), retryPayload);
              newDocId = created.$id;
            }
          }
          await databases.deleteDocument(databaseId, INVENTORY_PRODUCTS_COLLECTION_ID, p.$id);

          // Update stock alerts pointing to old productId
          if (newDocId) {
            try {
              const alertRes = await databases.listDocuments(databaseId, STOCK_ALERTS_COLLECTION_ID, [
                Query.equal('productId', p.$id), Query.limit(100),
              ]);
              await Promise.all(alertRes.documents.map((a: any) =>
                databases.updateDocument(databaseId, STOCK_ALERTS_COLLECTION_ID, a.$id, {
                  productId: newDocId,
                  productImage: p.IMAGEURL || p.IMAGEURL2 || '',
                  productName: p.NAME || '',
                  sku: sku || '',
                })
              ));
            } catch {}
          }

          if (sku) publishedSkus.add(sku);
          if (barcode) publishedBarcodes.add(barcode);
          published++;
        } catch (e: any) {
          console.error(`Error publicando ${p.NAME}:`, e?.message);
          errors++;
        }
        setPublishProgress(Math.round(((i + 1) / withStock.length) * 100));
        // Delay para no saturar Appwrite
        await new Promise(r => setTimeout(r, 200));
      }

      setPublishResults({ published, errors });
      invalidateProductCache();
      await loadProducts(); // recargar para reflejar cambios
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setIsPublishing(false);
    }
  };


  const zeroStockProducts = products.filter(p => (p.STOCK || 0) === 0);
  const withStockProducts = products.filter(p => (p.STOCK || 0) > 0);
  // Ubicados: incluye productos del inventario Y del catálogo publicado
  const allLocatedSource = [...products, ...publishedProducts];
  const locatedProducts = allLocatedSource.filter(p => getSection(p) !== null && (p.STOCK || 0) > 0);
  const unlocatedProducts = allLocatedSource.filter(p => getSection(p) === null && (p.STOCK || 0) > 0);
  const catalogFiltered = zeroStockProducts.filter(p => {
    if (!catalogSearch) return true;
    const q = catalogSearch.toLowerCase();
    const sku = getSku(p).toLowerCase();
    const barcode = getBarcode(p).toLowerCase();
    const name = (p.NAME || '').toLowerCase();
    return sku.includes(q) || name.includes(q) || barcode.includes(q);
  });
  const withStockFiltered = withStockProducts.filter(p => {
    if (!catalogSearch) return true;
    const q = catalogSearch.toLowerCase();
    const sku = getSku(p).toLowerCase();
    const barcode = getBarcode(p).toLowerCase();
    const name = (p.NAME || '').toLowerCase();
    return sku.includes(q) || name.includes(q) || barcode.includes(q);
  });

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.sku.toLowerCase().includes(q) || r.nameEs.toLowerCase().includes(q) || r.nameTranslated.toLowerCase().includes(q) || r.nameCn.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' ? true
      : filterStatus === 'matched' ? (r.matched && !r.isNew)
      : filterStatus === 'new' ? r.isNew
      : (!r.matched && !r.isNew);
    return matchSearch && matchStatus;
  });

  const matchedCount = rows.filter(r => r.matched && !r.isNew).length;
  const newCount = rows.filter(r => r.isNew).length;
  const selectedCount = rows.filter(r => r.selected).length;
  const translatedCount = rows.filter(r => r.translated).length;

  if (authLoading || !isLoggedIn || !isAdminEmail(user?.email)) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
      {/* Hide bottom navbar on /inventario */}
      <style>{`[data-bottom-nav], .tpl1-mobile-bottom-nav, nav[class*='bottom'], .bottom-nav { display: none !important; }`}</style>
      {showScanner && (
        <BarcodeScanner onScan={handleBarcodeScan} onClose={closeScanner} />
      )}
      {previewImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="Preview" className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
          <button className="absolute top-6 right-6 text-white/70 hover:text-white"><X size={28} /></button>
        </div>
      )}

      {scanWizard && (
        <ScanWizardModal
          wizard={scanWizard}
          sectionProductCounts={sectionProductCounts}
          lastPlacedSection={lastPlacedSection}
          saving={savingStockId === scanWizard.product.$id}
          onClose={() => setScanWizard(null)}
          onConfirmProduct={confirmScanProduct}
          onConfirmPackages={confirmScanPackages}
          onFinish={finishScanWizard}
          onPreviewImage={url => setPreviewImg(url)}
          onUpdate={fn => setScanWizard(w => (w ? fn(w) : null))}
          getSku={getSku}
        />
      )}

      {scanSaved && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">Guardado</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{scanSaved.name}</p>
            <div className="mt-5 flex flex-col gap-2">
              <button type="button"
                onClick={() => { setScanSaved(null); openScanner('search'); }}
                className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                <Camera size={18} /> Escanear otro producto
              </button>
              <button type="button" onClick={() => setScanSaved(null)}
                className="w-full py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unregistered product modal */}
      {unregisteredModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-4">
              <h3 className="text-lg font-bold">Producto no registrado</h3>
              <p className="text-xs text-white/80 mt-0.5">Código: {unregisteredModal.code}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 font-medium">Este código no coincide con ningún producto en el sistema.</p>
              <p className="text-sm text-gray-500 mt-1">¿Deseas registrarlo como producto nuevo?</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button onClick={() => setUnregisteredModal(null)}
                className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-50 font-semibold transition">No</button>
              <button onClick={() => { setView('excel'); setUnregisteredModal(null); }}
                className="flex-1 px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold transition">Sí, agregar</button>
            </div>
          </div>
        </div>
      )}

      {duplicateScanWarning && (
        <div className="fixed inset-0 z-[65] bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4">
              <h3 className="text-lg font-bold">Producto ya registrado</h3>
              <p className="text-xs text-white/80 mt-0.5">Este producto ya tiene stock en el inventario</p>
            </div>
            <div className="p-5 flex items-center gap-4">
              {duplicateScanWarning.product.IMAGEURL && (
                <img src={duplicateScanWarning.product.IMAGEURL} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 line-clamp-1">{duplicateScanWarning.product.NAME}</div>
                <div className="text-xs font-mono text-gray-500">SKU: {getSku(duplicateScanWarning.product)}</div>
                <div className="text-xs text-amber-600 font-semibold mt-1">Código: {duplicateScanWarning.code}</div>
                <div className="text-sm text-emerald-600 font-bold mt-1">Stock actual: {duplicateScanWarning.product.STOCK || 0} uds</div>
              </div>
            </div>
            <div className="px-5 pb-2">
              <p className="text-sm text-gray-600 text-center">¿Deseas añadir más stock a este producto?</p>
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              <button
                onClick={() => { setDuplicateScanWarning(null); openScanner('search'); }}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">
                No, siguiente
              </button>
              <button
                onClick={() => {
                  scannedCodesRef.current.delete(duplicateScanWarning.code.toLowerCase());
                  setDuplicateScanWarning(null);
                  startScanWizard(duplicateScanWarning.product, duplicateScanWarning.code, true);
                }}
                className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition">
                Sí, añadir stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit located product modal — for Ubicados view */}
      {editLocatedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setEditLocatedProduct(null)}>
          <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 flex items-center gap-3 shrink-0">
              {editLocatedProduct.IMAGEURL && <img src={editLocatedProduct.IMAGEURL} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/30" />}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm line-clamp-1">{editLocatedProduct.NAME}</div>
                <div className="text-xs text-white/80">SKU: {getSku(editLocatedProduct)}</div>
              </div>
              <button type="button" onClick={() => setEditLocatedProduct(null)} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/25 hover:bg-white/40 text-white transition"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Código de barras</label>
                <input type="text" value={editLocatedBarcode} onChange={e => setEditLocatedBarcode(e.target.value)} placeholder="EAN / UPC / código escaneado" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sección (ubicación)</label>
                <input type="number" value={editLocatedSection ?? ''} onChange={e => setEditLocatedSection(e.target.value ? Number(e.target.value) : null)} placeholder="Ej: 5 (Góndola A), 15 (Góndola B)" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {editLocatedSection && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Góndola {['A','B','C','D'].find(g => { const r: Record<string,number[]>={A:[1,9],B:[10,18],C:[19,27],D:[28,36]}; return editLocatedSection >= r[g][0] && editLocatedSection <= r[g][1]; }) || '?'} · Sección {editLocatedSection}
                  </p>
                )}
              </div>
              {products.some(ip => ip.$id === editLocatedProduct.$id) && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stock (unidades)</label>
                  <input type="number" value={editLocatedStock} onChange={e => setEditLocatedStock(e.target.value)} min={0} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
            </div>
            <div className="sticky bottom-0 shrink-0 border-t border-gray-100 bg-white p-4 flex gap-3">
              <button type="button" onClick={() => setEditLocatedProduct(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={saveEditLocated} disabled={editLocatedSaving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                {editLocatedSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit stock modal — for Con Stock view */}
      {editStockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4" onClick={closeEditStockModal}>
          <div
            className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-3 flex items-center gap-3 shrink-0">
              {editStockModal.IMAGEURL && (
                <img src={editStockModal.IMAGEURL} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/30 cursor-pointer hover:scale-150 hover:z-50 hover:shadow-2xl transition-transform duration-200" onClick={() => setPreviewImg(editStockModal.IMAGEURL!)} />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm line-clamp-1">{editStockModal.NAME}</div>
                <div className="text-xs text-white/80">Stock actual: {editStockModal.STOCK} uds</div>
              </div>
              <button
                type="button"
                onClick={closeEditStockModal}
                aria-label="Cerrar"
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/25 hover:bg-white/40 text-white transition"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain">
              {/* Packages input */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Cantidad de paquetes</label>
                <input
                  type="number"
                  min={0}
                  value={editPackagesValue}
                  onChange={e => setEditPackagesValue(e.target.value)}
                  placeholder={String(Math.round((editStockModal.STOCK || 0) / (editStockModal.PACKQTY || 1)))}
                  autoFocus
                  className="w-full px-4 py-3 text-2xl font-bold text-center border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setEditPackagesValue('1')}
                    className="flex-1 py-2 text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition">
                    +1
                  </button>
                  <button type="button" onClick={() => setEditPackagesValue('2')}
                    className="flex-1 py-2 text-xs font-bold bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-lg transition border border-pink-300">
                    +2
                  </button>
                  <button type="button" onClick={() => setEditPackagesValue('3')}
                    className="flex-1 py-2 text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition">
                    +3
                  </button>
                </div>
              </div>
              {/* Units per package input */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Unidades por paquete</label>
                <input
                  type="number"
                  min={1}
                  value={editPackQtyValue}
                  onChange={e => setEditPackQtyValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') savePackQty(); }}
                  placeholder={String(editStockModal.PACKQTY || '')}
                  className="w-full px-4 py-3 text-2xl font-bold text-center border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setEditPackQtyValue('6')}
                    className="flex-1 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition">
                    +6
                  </button>
                  <button type="button" onClick={() => setEditPackQtyValue('12')}
                    className="flex-1 py-2 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition border border-amber-300">
                    +12
                  </button>
                  <button type="button" onClick={() => setEditPackQtyValue('24')}
                    className="flex-1 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition">
                    +24
                  </button>
                </div>
              </div>
              {/* Calculation preview */}
              {editPackagesValue && editPackQtyValue && (
                <div className="text-center text-sm bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <span className="text-gray-600">{editPackagesValue} paquetes × {editPackQtyValue} und/paq = </span>
                  <span className="font-bold text-emerald-600 text-lg">{parseInt(editPackagesValue, 10) * parseInt(editPackQtyValue, 10)} unidades</span>
                </div>
              )}
              {/* Barcode */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Código de barras</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editBarcodeValue}
                    onChange={e => setEditBarcodeValue(e.target.value)}
                    placeholder="Escanear o escribir código"
                    className="flex-1 px-4 py-2.5 text-sm font-mono border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => openScanner('editBarcode')}
                    className="shrink-0 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                    title="Escanear código">
                    <Camera size={20} />
                  </button>
                </div>
              </div>
              {/* Section picker */}
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1 block">Sección (góndola)</label>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 36 }, (_, i) => i + 1).map(s => {
                    const count = sectionProductCounts[s] || 0;
                    const isSelected = editSectionValue === s;
                    const isLastPlaced = lastPlacedSection === s && !isSelected;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setEditSectionValue(isSelected ? null : s)}
                        className={`relative w-10 h-10 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-pink-500 text-white shadow-md scale-110'
                            : isLastPlaced
                              ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                        }`}
                      >
                        {count > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center leading-none shadow">
                            {count > 99 ? '99+' : count}
                          </span>
                        )}
                        {s}
                      </button>
                    );
                  })}
                </div>
                {editSectionValue && <div className="text-xs text-pink-600 font-semibold mt-1.5">📍 Sección {editSectionValue} seleccionada</div>}
                {lastPlacedSection && lastPlacedSection !== editSectionValue && (
                  <div className="text-xs text-emerald-600 font-semibold mt-1">Última asignada: sección {lastPlacedSection} (verde)</div>
                )}
              </div>
              <button
                onClick={savePackQty}
                disabled={savingStockId === editStockModal.$id || !editPackagesValue || !editPackQtyValue}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                {savingStockId === editStockModal.$id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                Guardar
              </button>
            </div>
            <div className="sticky bottom-0 shrink-0 border-t border-gray-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
              <button
                type="button"
                onClick={closeEditStockModal}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <X size={18} /> Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">Inventario</h1>
                <p className="text-xs text-gray-500 hidden sm:block">{products.length} productos</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowLocator(true)} title="Ubicar Producto"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-lg text-xs font-bold transition shadow-md">
                <MapPin className="w-3.5 h-3.5" />
                <span>Ubicación</span>
              </button>
              {/* Excel upload icon */}
              <label title="Subir Excel" className="cursor-pointer">
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" disabled={isLoading} />
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition">
                  {isLoading ? <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                </div>
              </label>
              {/* Import PackQty from Excel */}
              <label title="Importar Cantidad/Paquete por SKU" className="cursor-pointer">
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImportPackQty} className="hidden" disabled={isImportingPackQty} />
                <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition">
                  {isImportingPackQty ? <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /> : <Package className="w-4 h-4" />}
                </div>
              </label>
              {/* Export inventory to Excel */}
              <button onClick={handleExportInventory} disabled={isExporting || products.length === 0} title="Exportar inventario a Excel"
                className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition disabled:opacity-50">
                {isExporting ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
              {/* Upload images by SKU */}
              <Link href="/inventario/imagenes" title="Subir imágenes por SKU"
                className="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition">
                <ImageIcon className="w-4 h-4" />
              </Link>
              {/* Upload dates by SKU */}
              <Link href="/inventario/fecha" title="Subir fechas por SKU"
                className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition">
                <CalendarClock className="w-4 h-4" />
              </Link>
              <button onClick={loadProducts} disabled={loadingProducts}
                className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${loadingProducts ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
            <button onClick={() => setView('catalog')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap ${view === 'catalog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Sin stock ({zeroStockProducts.length})
            </button>
            <button onClick={() => setView('withStock')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap ${view === 'withStock' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Con stock ({withStockProducts.length})
            </button>
            <button onClick={() => setView('located')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap ${view === 'located' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Ubicados ({locatedProducts.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5 pb-24">
        {view === 'catalog' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1">Catálogo sin stock</h2>
                <p className="text-xs text-gray-500">{zeroStockProducts.length} productos sin stock</p>
              </div>
              <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      triggerSearch(catalogSearch);
                    }
                  }}
                  placeholder="SKU, barra o nombre (Enter para buscar en BD)..."
                  className="w-full pl-9 pr-16 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                />
                {catalogSearch && (
                  <button onClick={() => setCatalogSearch('')}
                    className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition"
                    title="Limpiar búsqueda">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => openScanner('searchOnly')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-pink-600 transition"
                  title="Escanear para buscar">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            {loadingProducts ? (
              <div className="p-10 text-center text-sm text-gray-500">Cargando...</div>
            ) : catalogFiltered.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">
                {catalogSearch ? 'No hay productos que coincidan con la búsqueda.' : '¡No hay productos sin stock!'}
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Desktop table */}
                <table className="hidden md:table w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-left text-xs text-gray-500 uppercase">
                      <th className="px-4 py-2.5 w-16">Img</th>
                      <th className="px-4 py-2.5">Producto</th>
                      <th className="px-4 py-2.5 w-32">SKU</th>
                      <th className="px-4 py-2.5 w-24">Precio</th>
                      <th className="px-4 py-2.5 w-48">Asignar stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {catalogFiltered.slice(0, 200).map(p => {
                      const sku = getSku(p);
                      const barcode = getBarcode(p);
                      const editing = stockEdits[p.$id] ?? '';
                      const inlinePack = packQtyEdits[p.$id] ?? '';
                      const inlineBarcode = barcodeEdits[p.$id] ?? '';
                      const saving = savingStockId === p.$id;
                      const hasPack = !!(p.PACKQTY && p.PACKQTY > 0);
                      const hasBarcode = !!barcode;
                      const effectivePack = hasPack ? p.PACKQTY! : (parseInt(inlinePack, 10) || 0);
                      const pkgs = parseInt(editing, 10) || 0;
                      const totalUnits = pkgs * effectivePack;
                      return (
                        <tr key={p.$id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {p.IMAGEURL ? (
                              <img src={p.IMAGEURL} alt="" className="w-10 h-10 object-cover rounded cursor-pointer"
                                onClick={() => setPreviewImg(p.IMAGEURL || null)} />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900 line-clamp-1">{p.NAME || '—'}</div>
                            <div className="text-xs text-gray-400 line-clamp-1">{p.DESCRIPTION || ''}</div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {hasPack ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-pink-50 text-pink-600 text-[10px] font-medium rounded">
                                  <Package className="w-3 h-3" />{p.PACKQTY} u/paquete
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded">
                                  Sin paquete
                                </span>
                              )}
                              {hasBarcode ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-mono rounded">BC: {barcode}</span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-medium rounded">Sin código</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-xs font-mono text-gray-600">{sku || '—'}</td>
                          <td className="px-4 py-2 text-gray-700">${(p.PRICE || 0).toLocaleString('es-CL')}</td>
                          <td className="px-4 py-2">
                            <div className="flex flex-col gap-1.5">
                              {!hasBarcode && (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={inlineBarcode}
                                    onChange={e => setBarcodeEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                    placeholder="Código de barras"
                                    title="Añadir código de barras"
                                    className="flex-1 px-2 py-1.5 text-sm border border-rose-300 bg-rose-50 rounded focus:outline-none focus:border-rose-500 font-mono"
                                  />
                                  <button onClick={() => openScanner(p.$id)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                                    title="Escanear código de barras">
                                    <Camera className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                {!hasPack && (
                                  <>
                                    <input
                                      type="number"
                                      min={1}
                                      value={inlinePack}
                                      onChange={e => setPackQtyEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                      placeholder="u/pkg"
                                      title="Unidades por paquete"
                                      className="w-16 px-2 py-1.5 text-sm border border-amber-300 bg-amber-50 rounded focus:outline-none focus:border-amber-500"
                                    />
                                    <button type="button" onClick={() => setPackQtyEdits(prev => ({ ...prev, [p.$id]: '12' }))}
                                      className="px-2 py-1.5 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-700 rounded border border-amber-300 transition"
                                      title="Atajo: 12 unidades por paquete">
                                      +12
                                    </button>
                                  </>
                                )}
                                <input
                                  type="number"
                                  min={0}
                                  value={editing}
                                  onChange={e => setStockEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                  onKeyDown={e => { if (e.key === 'Enter') assignStock(p.$id); }}
                                  placeholder="paq."
                                  title="Cantidad de paquetes"
                                  className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-pink-500"
                                />
                                <button type="button" onClick={() => setStockEdits(prev => ({ ...prev, [p.$id]: '2' }))}
                                  className="px-2 py-1.5 text-[11px] font-bold bg-pink-100 hover:bg-pink-200 text-pink-600 rounded border border-pink-300 transition"
                                  title="Atajo: 2 paquetes">
                                  +2
                                </button>
                                <button
                                   onClick={() => {
                                     if (!hasBarcode && inlineBarcode) {
                                       setBarcodeEdits(prev => ({ ...prev, [p.$id]: inlineBarcode }));
                                     }
                                     openEditStockModal(p, {
                                       packages: editing || '1',
                                       packQty: hasPack ? String(p.PACKQTY) : (inlinePack || '12'),
                                     });
                                   }}
                                  disabled={saving || !editing || pkgs <= 0 || (!hasPack && (!inlinePack || parseInt(inlinePack, 10) <= 0))}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-medium rounded transition">
                                  {saving ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Plus className="w-3 h-3" />
                                  )}
                                  Activar
                                </button>
                                {((!hasBarcode && inlineBarcode) || (!hasPack && inlinePack && parseInt(inlinePack, 10) > 0)) && (
                                  <button
                                    onClick={() => saveProductEdits(p.$id)}
                                    disabled={saving}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-medium rounded transition">
                                    {saving ? (
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="w-3 h-3" />
                                    )}
                                    Guardar
                                  </button>
                                )}
                              </div>
                              {totalUnits > 0 && (
                                <div className="text-[11px] text-gray-500">= {totalUnits} unidades</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {catalogFiltered.slice(0, 200).map(p => {
                    const sku = getSku(p);
                    const barcode = getBarcode(p);
                    const editing = stockEdits[p.$id] ?? '';
                    const inlinePack = packQtyEdits[p.$id] ?? '';
                    const inlineBarcode = barcodeEdits[p.$id] ?? '';
                    const saving = savingStockId === p.$id;
                    const hasPack = !!(p.PACKQTY && p.PACKQTY > 0);
                    const hasBarcode = !!barcode;
                    const effectivePack = hasPack ? p.PACKQTY! : (parseInt(inlinePack, 10) || 0);
                    const pkgs = parseInt(editing, 10) || 0;
                    const totalUnits = pkgs * effectivePack;
                    return (
                      <div key={p.$id} className="p-4">
                        <div className="flex gap-3">
                          <div className="shrink-0">
                            {p.IMAGEURL ? (
                              <img src={p.IMAGEURL} alt="" className="w-14 h-14 object-cover rounded-lg cursor-pointer"
                                onClick={() => setPreviewImg(p.IMAGEURL || null)} />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm line-clamp-1">{p.NAME || '—'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {sku && <span className="font-mono mr-2">SKU: {sku}</span>}
                              {hasBarcode && <span className="font-mono text-gray-400">BC: {barcode}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-sm text-gray-700">${(p.PRICE || 0).toLocaleString('es-CL')}</span>
                              {hasPack ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 text-pink-600 text-[11px] font-medium rounded-full">
                                  <Package className="w-3 h-3" />{p.PACKQTY} u/paquete
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">
                                  ⚠ Sin paquete
                                </span>
                              )}
                              {!hasBarcode && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-600 text-[11px] font-medium rounded-full">
                                  ⚠ Sin código
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Inline inputs — stacked with clear labels */}
                        <div className="mt-3 space-y-2">
                          {!hasBarcode && (
                            <div>
                              <label className="text-[10px] text-rose-600 font-semibold uppercase tracking-wide mb-0.5 block">Código de barras</label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={inlineBarcode}
                                  onChange={e => setBarcodeEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                  placeholder="Escanear o escribir código..."
                                  title="Añadir código de barras"
                                  className="flex-1 px-3 py-2 text-sm border border-rose-300 bg-rose-50 rounded-lg focus:outline-none focus:border-rose-500 font-mono"
                                />
                                <button onClick={() => openScanner(p.$id)}
                                  className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition border border-rose-200"
                                  title="Escanear código de barras">
                                  <Camera className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="flex items-end gap-2">
                            {!hasPack && (
                              <div className="flex-1">
                                <label className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide mb-0.5 block">Und. por paquete</label>
                                <input
                                  type="number"
                                  min={1}
                                  value={inlinePack}
                                  onChange={e => setPackQtyEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                  placeholder="Ej: 12"
                                  title="Unidades por paquete"
                                  className="w-full px-3 py-2 text-sm border border-amber-300 bg-amber-50 rounded-lg focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5 block">Paquetes</label>
                              <input
                                type="number"
                                min={0}
                                value={editing}
                                onChange={e => setStockEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                onKeyDown={e => { if (e.key === 'Enter') assignStock(p.$id); }}
                                placeholder="Ej: 3"
                                title="Cantidad de paquetes"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                              />
                            </div>
                            <button
                               onClick={() => {
                                 if (!hasBarcode && inlineBarcode) {
                                   setBarcodeEdits(prev => ({ ...prev, [p.$id]: inlineBarcode }));
                                 }
                                 openEditStockModal(p, {
                                   packages: editing || '1',
                                   packQty: hasPack ? String(p.PACKQTY) : (inlinePack || '12'),
                                 });
                               }}
                              disabled={saving || !editing || pkgs <= 0 || (!hasPack && (!inlinePack || parseInt(inlinePack, 10) <= 0))}
                              className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition shrink-0">
                              {saving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                              Activar
                            </button>
                            {((!hasBarcode && inlineBarcode) || (!hasPack && inlinePack && parseInt(inlinePack, 10) > 0)) && (
                              <button
                                onClick={() => saveProductEdits(p.$id)}
                                disabled={saving}
                                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition shrink-0">
                                {saving ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                                Guardar
                              </button>
                            )}
                          </div>
                          {/* Quick-action chips — und/paq */}
                          {!hasPack && (
                            <div className="flex gap-2 mt-1">
                              <button type="button" onClick={() => setPackQtyEdits(prev => ({ ...prev, [p.$id]: '6' }))}
                                className="flex-1 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition border border-amber-200 text-center">
                                +6
                              </button>
                              <button type="button" onClick={() => setPackQtyEdits(prev => ({ ...prev, [p.$id]: '12' }))}
                                className="flex-1 py-2 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition border border-amber-300 text-center">
                                +12
                              </button>
                              <button type="button" onClick={() => setPackQtyEdits(prev => ({ ...prev, [p.$id]: '24' }))}
                                className="flex-1 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition border border-amber-200 text-center">
                                +24
                              </button>
                            </div>
                          )}
                          {/* Quick-action chips — paquetes */}
                          <div className="flex gap-2 mt-1">
                            <button type="button" onClick={() => setStockEdits(prev => ({ ...prev, [p.$id]: '1' }))}
                              className="flex-1 py-2 text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition border border-pink-200 text-center">
                              +1 paq
                            </button>
                            <button type="button" onClick={() => setStockEdits(prev => ({ ...prev, [p.$id]: '2' }))}
                              className="flex-1 py-2 text-xs font-bold bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-lg transition border border-pink-300 text-center">
                              +2 paq
                            </button>
                            <button type="button" onClick={() => setStockEdits(prev => ({ ...prev, [p.$id]: '3' }))}
                              className="flex-1 py-2 text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition border border-pink-200 text-center">
                              +3 paq
                            </button>
                          </div>
                          {totalUnits > 0 && (
                            <div className="text-xs text-gray-500 font-medium">= {totalUnits} unidades totales</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {catalogFiltered.length > 200 && (
                  <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-100">
                    Mostrando primeros 200 de {catalogFiltered.length}. Refina la búsqueda para ver más.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'withStock' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1">Productos con stock</h2>
                <p className="text-xs text-gray-500">{withStockProducts.length} productos · <span className="text-emerald-600 font-semibold">{withStockProducts.reduce((s, p) => s + (p.STOCK || 0), 0)} uds</span> stock total · <span className="text-blue-600 font-semibold">{withStockProducts.reduce((s, p) => s + (p.PACKQTY ? Math.max(0, Math.round((p.STOCK || 0) / p.PACKQTY)) * p.PACKQTY : (p.STOCK || 0)), 0)} uds</span> al catálogo</p>
              </div>
              <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      triggerSearch(catalogSearch);
                    }
                  }}
                  placeholder="SKU, barra o nombre (Enter para buscar en BD)..."
                  className="w-full pl-9 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                />
                {catalogSearch && (
                  <button onClick={() => setCatalogSearch('')}
                    className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition"
                    title="Limpiar búsqueda">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => openScanner('searchOnly')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-pink-600 transition"
                  title="Escanear para buscar">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              {/* 🚀 Botón: Publicar TODOS los con stock al catálogo */}
              <button
                onClick={publishAllWithStock}
                disabled={isPublishing || withStockProducts.length === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                title="Publicar todos los productos con stock al catálogo"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Publicando {publishProgress}%
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4" />
                    Publicar todos ({withStockProducts.length})
                  </>
                )}
              </button>
            </div>

            {/* Banner de resultados de publicación */}
            {publishResults && (
              <div className="px-3 sm:px-5 py-2 bg-green-50 border-b border-green-200 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-green-800">
                  ✅ <strong>{publishResults.published}</strong> publicados
                  {publishResults.errors > 0 && <> · ⚠️ <strong>{publishResults.errors}</strong> errores (duplicados o fallidos)</>}
                </span>
                <button onClick={() => setPublishResults(null)} className="ml-auto text-green-600 hover:text-green-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {loadingProducts ? (
              <div className="p-10 text-center text-sm text-gray-500">Cargando...</div>
            ) : withStockFiltered.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">
                {catalogSearch ? 'No hay productos que coincidan con la búsqueda.' : 'No hay productos con stock.'}
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Desktop table */}
                <table className="hidden md:table w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-left text-xs text-gray-500 uppercase">
                      <th className="px-4 py-2.5 w-16">Img</th>
                      <th className="px-4 py-2.5">Producto</th>
                      <th className="px-4 py-2.5 w-32">SKU</th>
                      <th className="px-4 py-2.5 w-20">Stock</th>
                      <th className="px-4 py-2.5 w-20">A añadir</th>
                      <th className="px-4 py-2.5 w-16">Sección</th>
                      <th className="px-4 py-2.5 w-24">Precio</th>
                      <th className="px-4 py-2.5 w-48">Editar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withStockFiltered.slice(0, 200).map(p => {
                      const sku = getSku(p);
                      const barcode = getBarcode(p);
                      const inlineBarcode = barcodeEdits[p.$id] ?? '';
                      const inlinePack = packQtyEdits[p.$id] ?? '';
                      const saving = savingStockId === p.$id;
                      const hasPack = !!(p.PACKQTY && p.PACKQTY > 0);
                      const hasBarcode = !!barcode;
                      return (
                        <tr key={p.$id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEditStockModal(p)}>
                          <td className="px-4 py-2">
                            {p.IMAGEURL ? (
                              <img src={p.IMAGEURL} alt="" className="w-10 h-10 object-cover rounded"
                                onClick={e => { e.stopPropagation(); setPreviewImg(p.IMAGEURL || null); }} />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900 line-clamp-1">{p.NAME || '—'}</div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {hasPack ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-pink-50 text-pink-600 text-[10px] font-medium rounded">
                                  <Package className="w-3 h-3" />{p.PACKQTY} u/paquete
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded">
                                  Sin paquete
                                </span>
                              )}
                              {hasBarcode ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-mono rounded">BC: {barcode}</span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-medium rounded">Sin código</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-xs font-mono text-gray-600">{sku || '—'}</td>
                          <td className="px-4 py-2 text-sm font-semibold text-emerald-600">{p.STOCK || 0}</td>
                          <td className="px-4 py-2 text-sm font-semibold text-blue-600">{p.PACKQTY ? Math.max(0, Math.round((p.STOCK || 0) / p.PACKQTY)) * p.PACKQTY : (p.STOCK || 0)}</td>
                          <td className="px-4 py-2 text-sm font-semibold text-pink-600">{(() => { const s = getSection(p); return s ? `B${s}` : '—'; })()}</td>
                          <td className="px-4 py-2 text-gray-700">${(p.PRICE || 0).toLocaleString('es-CL')}</td>
                          <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                            <div className="flex flex-col gap-1.5">
                              {!hasBarcode && (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={inlineBarcode}
                                    onChange={e => setBarcodeEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                    placeholder="Código de barras"
                                    title="Añadir código de barras"
                                    className="flex-1 px-2 py-1.5 text-sm border border-rose-300 bg-rose-50 rounded focus:outline-none focus:border-rose-500 font-mono"
                                  />
                                  <button onClick={() => openScanner(p.$id)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                                    title="Escanear código de barras">
                                    <Camera className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                {!hasPack && (
                                  <input
                                    type="number"
                                    min={1}
                                    value={inlinePack}
                                    onChange={e => setPackQtyEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                    placeholder="u/pkg"
                                    title="Unidades por paquete"
                                    className="w-16 px-2 py-1.5 text-sm border border-amber-300 bg-amber-50 rounded focus:outline-none focus:border-amber-500"
                                  />
                                )}
                                {((!hasBarcode && inlineBarcode) || (!hasPack && inlinePack && parseInt(inlinePack, 10) > 0)) && (
                                  <button
                                    onClick={() => saveProductEdits(p.$id)}
                                    disabled={saving}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-medium rounded transition">
                                    {saving ? (
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="w-3 h-3" />
                                    )}
                                    Guardar
                                  </button>
                                )}
                              </div>
                              {/* 📤 Botón Publicar al catálogo (individual) */}
                              <button
                                onClick={() => publishToCatalog(p.$id)}
                                disabled={saving || isPublishing}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold rounded transition shadow-sm"
                                title="Publicar este producto al catálogo público (lo elimina del inventario)"
                              >
                                <ArrowUpCircle className="w-3.5 h-3.5" />
                                Publicar
                              </button>
                              {/* 🗑️ Botón Eliminar del inventario */}
                              <button
                                onClick={() => setDeleteConfirm({ id: p.$id, name: p.NAME || 'Producto' })}
                                disabled={deletingId === p.$id}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold rounded transition shadow-sm"
                                title="Eliminar este producto del inventario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {withStockFiltered.slice(0, 200).map(p => {
                    const sku = getSku(p);
                    const barcode = getBarcode(p);
                    const inlineBarcode = barcodeEdits[p.$id] ?? '';
                    const inlinePack = packQtyEdits[p.$id] ?? '';
                    const saving = savingStockId === p.$id;
                    const hasPack = !!(p.PACKQTY && p.PACKQTY > 0);
                    const hasBarcode = !!barcode;
                    return (
                      <div key={p.$id} className="p-4 cursor-pointer active:bg-gray-50 transition" onClick={() => openEditStockModal(p)}>
                        <div className="flex gap-3">
                          <div className="shrink-0">
                            {p.IMAGEURL ? (
                              <img src={p.IMAGEURL} alt="" className="w-14 h-14 object-cover rounded-lg"
                                onClick={e => { e.stopPropagation(); setPreviewImg(p.IMAGEURL || null); }} />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm line-clamp-1">{p.NAME || '—'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {sku && <span className="font-mono mr-2">SKU: {sku}</span>}
                              {hasBarcode && <span className="font-mono text-gray-400">BC: {barcode}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-sm font-semibold text-emerald-600">{p.STOCK} uds</span>
                              <span className="text-sm font-semibold text-blue-600">+{p.PACKQTY ? Math.max(0, Math.round((p.STOCK || 0) / p.PACKQTY)) * p.PACKQTY : (p.STOCK || 0)} al catálogo</span>
                              {(() => { const s = getSection(p); return s ? <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">B{s}</span> : null; })()}
                              <span className="text-sm text-gray-700">${(p.PRICE || 0).toLocaleString('es-CL')}</span>
                              {hasPack ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 text-pink-600 text-[11px] font-medium rounded-full">
                                  <Package className="w-3 h-3" />{p.PACKQTY} u/paquete
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">
                                  ⚠ Sin paquete
                                </span>
                              )}
                              {!hasBarcode && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-600 text-[11px] font-medium rounded-full">
                                  ⚠ Sin código
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Inline edits */}
                        {((!hasBarcode) || (!hasPack)) && (
                          <div className="mt-3 space-y-2" onClick={e => e.stopPropagation()}>
                            {!hasBarcode && (
                              <div>
                                <label className="text-[10px] text-rose-600 font-semibold uppercase tracking-wide mb-0.5 block">Código de barras</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={inlineBarcode}
                                    onChange={e => setBarcodeEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                    placeholder="Escanear o escribir código..."
                                    title="Añadir código de barras"
                                    className="flex-1 px-3 py-2 text-sm border border-rose-300 bg-rose-50 rounded-lg focus:outline-none focus:border-rose-500 font-mono"
                                  />
                                  <button onClick={() => openScanner(p.$id)}
                                    className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition border border-rose-200"
                                    title="Escanear código de barras">
                                    <Camera className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {!hasPack && (
                              <div>
                                <label className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide mb-0.5 block">Und. por paquete</label>
                                <input
                                  type="number"
                                  min={1}
                                  value={inlinePack}
                                  onChange={e => setPackQtyEdits(prev => ({ ...prev, [p.$id]: e.target.value }))}
                                  placeholder="Ej: 12"
                                  title="Unidades por paquete"
                                  className="w-full px-3 py-2 text-sm border border-amber-300 bg-amber-50 rounded-lg focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            )}
                            {((!hasBarcode && inlineBarcode) || (!hasPack && inlinePack && parseInt(inlinePack, 10) > 0)) && (
                              <button
                                onClick={() => saveProductEdits(p.$id)}
                                disabled={saving}
                                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition">
                                {saving ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                                Guardar
                              </button>
                            )}
                          </div>
                        )}
                        {/* 📤 Botón Publicar al catálogo (mobile) */}
                        <div className="mt-3" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => publishToCatalog(p.$id)}
                            disabled={saving || isPublishing}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
                            title="Publicar este producto al catálogo público"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                            Publicar al catálogo
                          </button>
                        </div>
                        {/* 🗑️ Botón Eliminar del inventario (mobile) */}
                        <div className="mt-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setDeleteConfirm({ id: p.$id, name: p.NAME || 'Producto' })}
                            disabled={deletingId === p.$id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
                            title="Eliminar este producto del inventario"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar del inventario
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {withStockFiltered.length > 200 && (
                  <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-100">
                    Mostrando primeros 200 de {withStockFiltered.length}. Refina la búsqueda para ver más.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'excel' && (
        <>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Subir Excel de Qianji</h2>
              <p className="text-xs text-gray-500">Formatos: Qianji crudo o productos_traducidos.xlsx · Codigo · Categoria · Subcategoria · Nombre · Precios · Stock</p>
            </div>
            <label className="cursor-pointer">
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" disabled={isLoading} />
              <div className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-medium transition">
                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                {isLoading ? 'Procesando...' : 'Seleccionar archivo'}
              </div>
            </label>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="grid grid-cols-5 gap-3 flex-1">
              {[
                { label: 'Total', value: rows.length, color: 'text-gray-900' },
                { label: 'Ya existen', value: matchedCount, color: 'text-emerald-600' },
                { label: 'Nuevos', value: newCount, color: 'text-blue-600' },
                { label: 'Traducidos', value: translatedCount, color: 'text-pink-600' },
                { label: 'Con imagen', value: rows.filter(r => r.imageUrl).length, color: 'text-orange-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={handleTranslate} disabled={isTranslating}
                className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-medium transition whitespace-nowrap">
                {isTranslating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traduciendo {translateProgress}%
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4" />
                    Traducir con IA
                  </>
                )}
              </button>
              <button onClick={handleCreateCategories} disabled={isCreatingCats}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-medium transition whitespace-nowrap">
                {isCreatingCats ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <FolderTree className="w-4 h-4" />
                    Crear Categorías
                  </>
                )}
              </button>
              <button onClick={handleSave} disabled={isSaving || selectedCount === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-medium transition whitespace-nowrap">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4" />
                    Aplicar ({selectedCount})
                  </>
                )}
              </button>
              <button onClick={handleExportSelected} disabled={selectedCount === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-medium transition whitespace-nowrap">
                <Download className="w-4 h-4" />
                Exportar ({selectedCount})
              </button>
            </div>
          </div>
        )}

        {isTranslating && (
          <div className="bg-white rounded-xl border border-pink-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-pink-700">Traduciendo con Gemini AI...</p>
              <p className="text-sm font-bold text-pink-600">{translateProgress}%</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-pink-400 rounded-full transition-all duration-500" style={{ width: `${translateProgress}%` }} />
            </div>
          </div>
        )}

        {isSaving && (
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-emerald-700">Guardando productos...</p>
              <p className="text-sm font-bold text-emerald-600">{saveProgress}%</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${saveProgress}%` }} />
            </div>
          </div>
        )}

        {saveResults && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-700">
              {saveResults.skipped} omitidos (ya completos) · {saveResults.patched} completados · {saveResults.created} nuevos creados
              {saveResults.errors > 0 && ` · ${saveResults.errors} error(es)`}
            </p>
          </div>
        )}

        {importPackQtyResults && (
          <div className="flex items-center justify-between gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-violet-600" />
              <p className="text-sm text-violet-700">
                <b>{importPackQtyResults.updated}</b> Pack Qty actualizados
                {importPackQtyResults.notFound > 0 && ` · ${importPackQtyResults.notFound} SKU no encontrados`}
                {importPackQtyResults.errors > 0 && ` · ${importPackQtyResults.errors} error(es)`}
              </p>
            </div>
            <button onClick={() => setImportPackQtyResults(null)} className="text-violet-400 hover:text-violet-600"><X className="w-4 h-4" /></button>
          </div>
        )}

        {catResults && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <FolderTree className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-700">
              {catResults.cats} categorías creadas · {catResults.subs} subcategorías creadas
              {catResults.errors > 0 && ` · ${catResults.errors} error(es)`}
            </p>
          </div>
        )}

        {isMigrating && (
          <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-rose-700">Migrando productos (activos / inactivos)...</p>
              <p className="text-sm font-bold text-rose-600">{migrateProgress}%</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${migrateProgress}%` }} />
            </div>
          </div>
        )}

        {migrateResults && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <EyeOff className="w-5 h-5 text-rose-600" />
            <p className="text-sm text-rose-700">
              {migrateResults.activated} activos · {migrateResults.deactivated} inactivos (ocultos)
              {migrateResults.errors > 0 && ` · ${migrateResults.errors} error(es)`}
            </p>
          </div>
        )}

        {rows.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por SKU o nombre..."
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-4 h-4" /></button>}
            </div>
            {(['all', 'matched', 'new', 'unmatched'] as const).map(f => {
              const getGroup = (r: InventoryRow) =>
                f === 'all' ? true
                : f === 'matched' ? (r.matched && !r.isNew)
                : f === 'new' ? r.isNew
                : (!r.matched && !r.isNew);
              const groupRows = rows.filter(getGroup);
              const allSelected = groupRows.length > 0 && groupRows.every(r => r.selected);
              return (
              <button key={f} onClick={() => {
                setFilterStatus(f);
                const group = rows.filter(getGroup);
                const select = !allSelected;
                setRows(prev => prev.map(r => getGroup(r) ? { ...r, selected: select } : { ...r, selected: false }));
              }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition ${filterStatus === f ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {f === 'all' ? 'Todos' : f === 'matched' ? 'Existentes' : f === 'new' ? 'Nuevos' : 'Sin match'}
                <span className="ml-1 opacity-60">{groupRows.length}</span>
              </button>
              );
            })}
            <span className="text-xs text-gray-400 ml-auto">{filtered.length} filas</span>
          </div>
        )}

        {rows.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-3 py-3">
                      <input type="checkbox"
                        checked={filtered.length > 0 && filtered.every(r => r.selected)}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-pink-600 focus:ring-pink-500 focus:ring-offset-0" />
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Producto</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Categoría</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Imagen</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Stock actual</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Stock a asignar</th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Retail</th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Caja</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((row) => {
                    const realIdx = rows.indexOf(row);
                    const displayName = row.nameEs || row.nameTranslated || row.nameCn;
                    const displayNameSub = row.translated ? row.nameTranslated : row.nameCn;
                    return (
                      <tr key={realIdx} className={`transition-colors ${row.selected ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                        <td className="px-3 py-2.5">
                          <input type="checkbox" checked={row.selected}
                            onChange={() => toggleRow(realIdx)}
                            className="w-4 h-4 rounded border-gray-300 bg-white text-pink-600 focus:ring-pink-500 focus:ring-offset-0" />
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 cursor-pointer relative group"
                              onClick={() => row.imageUrl && setPreviewImg(row.imageUrl)}>
                              {row.imageUrl ? (
                                <>
                                  <img src={row.imageUrl} alt={displayName}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-150" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                    <Eye className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </>
                              ) : <Package className="w-4 h-4 text-gray-400 m-auto mt-2.5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate max-w-[200px]">{displayName}</p>
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs text-gray-500 font-mono">{row.sku}</p>
                                {row.translated && (
                                  <span className="text-[10px] px-1 py-0.5 rounded bg-pink-100 text-pink-700 flex items-center gap-0.5">
                                    <Sparkles className="w-2.5 h-2.5" />ES
                                  </span>
                                )}
                              </div>
                              {displayNameSub && displayNameSub !== displayName && (
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{displayNameSub}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 hidden lg:table-cell">
                          <div>
                            <span className="text-xs text-gray-600">
                              {row.categoryEs || row.categoryRaw || <span className="text-gray-400">—</span>}
                            </span>
                            {row.subcategory && (
                              <span className="text-[10px] text-gray-400 block">{row.subcategory}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                          {row.imageUrl ? (
                            <div className="w-9 h-9 rounded-lg overflow-hidden mx-auto cursor-pointer group relative"
                              onClick={() => setPreviewImg(row.imageUrl)}>
                              <img src={row.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                <Eye className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300">sin img</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`font-bold ${row.currentStock === 0 ? 'text-gray-400' : row.currentStock <= 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                            {row.currentStock || '—'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <input type="number" min="0" value={row.newStock}
                            onChange={e => updateNewStock(realIdx, parseInt(e.target.value) || 0)}
                            placeholder="Stock"
                            className="w-20 px-2 py-1 text-center bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-700 hidden md:table-cell">
                          ${row.priceRetail.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-400 hidden md:table-cell">
                          ${row.priceWholesale.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {row.isNew ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center gap-1">
                              <Plus className="w-3 h-3" />Nuevo
                            </span>
                          ) : row.matched ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Existe</span>
                          ) : (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {rows.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Sube un Excel de Qianji para comenzar</p>
            <p className="text-gray-400 text-sm mt-1">SKU · Código de Barras · Categoría · Nombre ES/CN · Precios</p>
          </div>
        )}
        </>
        )}
        {view === 'located' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Productos Ubicados</h2>
              <p className="text-xs text-gray-500 mt-0.5">{locatedProducts.length} con sección · {unlocatedProducts.length} sin sección · <span className="text-blue-600">{publishedProducts.length} publicados</span></p>
            </div>

            {/* Located group */}
            <details open className="border-b border-gray-100">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-gray-900">Con sección asignada</span>
                  <span className="text-xs text-gray-400">({locatedProducts.length})</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </summary>
              <div className="divide-y divide-gray-50">
                {locatedProducts.map(p => {
                  const sec = getSection(p);
                  const gondola = ['A','B','C','D'].find(g => {
                    const ranges: Record<string, number[]> = { A: [1,9], B: [10,18], C: [19,27], D: [28,36] };
                    return sec !== null && sec >= ranges[g][0] && sec <= ranges[g][1];
                  });
                  const isPublished = !products.some(ip => ip.$id === p.$id);
                  return (
                    <div key={p.$id} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition" onClick={() => openEditLocated(p)}>
                      {p.IMAGEURL ? (
                        <img src={p.IMAGEURL} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{p.NAME}</div>
                        <div className="text-xs text-gray-500">{getSku(p)} · {p.STOCK} uds</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        {isPublished && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-[10px] font-bold">Publicado</span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-100 text-pink-600 text-xs font-bold">
                          <MapPin className="w-3 h-3" /> G{gondola} S{sec}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {locatedProducts.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">Ningún producto ubicado aún</div>
                )}
              </div>
            </details>

            {/* Unlocated group */}
            <details className="">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-sm font-semibold text-gray-900">Sin sección registrada</span>
                  <span className="text-xs text-gray-400">({unlocatedProducts.length})</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </summary>
              <div className="divide-y divide-gray-50">
                {unlocatedProducts.map(p => (
                  <div key={p.$id} className="flex items-center gap-3 px-4 py-2.5">
                    {p.IMAGEURL ? (
                      <img src={p.IMAGEURL} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{p.NAME}</div>
                      <div className="text-xs text-gray-500">{getSku(p)} · {p.STOCK} uds</div>
                    </div>
                    <button
                      onClick={() => setShowLocator(true)}
                      className="shrink-0 px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold hover:bg-amber-200 transition">
                      Ubicar
                    </button>
                  </div>
                ))}
                {unlocatedProducts.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">¡Todos los productos con stock están ubicados!</div>
                )}
              </div>
            </details>
          </div>
        )}

      </main>

      {/* Floating camera widget */}
      <button
        onClick={() => openScanner('search')}
        className="fixed right-5 z-40 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        title="Escanear producto"
      >
        <Camera className="w-6 h-6" />
      </button>

      <ProductLocator
        isOpen={showLocator}
        onClose={() => setShowLocator(false)}
        products={products as any}
        onProductsUpdate={setProducts as any}
        collectionId={INVENTORY_PRODUCTS_COLLECTION_ID}
        publishedProducts={publishedProducts as any}
        publishedCollectionId={PRODUCTS_COLLECTION_ID}
        onPublishedProductsUpdate={setPublishedProducts as any}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900">Eliminar del inventario</h3>
            </div>
            <p className="text-sm text-gray-600">
              ¿Estás seguro de eliminar <span className="font-semibold text-gray-900">"{deleteConfirm.name}"</span> del inventario?
              <br /><br />
              Esta acción eliminará el producto de <strong>Inventory Products</strong>. No se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={() => deleteFromInventory(deleteConfirm.id)} disabled={deletingId === deleteConfirm.id}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-60">
                {deletingId === deleteConfirm.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
