import { getServices, PRODUCTS_COLLECTION, Query } from '@/lib/appwrite';

export interface AppwriteErpProduct {
  $id: string;
  sku: string;
  isAutoSku?: boolean;
  codigo_barra: string;
  nombre: string;
  costo_uni: number;
  precio_venta_1: number; // Precio detalle (web PRICE / CURRENTPRICE)
  precio_venta_2: number; // Precio mayorista (WHOLESALEPRICE)
  precio_venta_3: number; // Precio emprendedor / distribuidor (EMPRENDEDORPRICE)
  stock: number;
  isactive: boolean;
  category: string;
  imageUrl: string | null;
  rawDocument?: any;
}

export function resolveSku(doc: any): string {
  if (!doc) return '';
  if (doc.SKU && typeof doc.SKU === 'string' && doc.SKU.trim()) return doc.SKU.trim();
  if (doc.sku && typeof doc.sku === 'string' && doc.sku.trim()) return doc.sku.trim();

  const feat = doc.FEATURES;
  const featStr = typeof feat === 'string' ? feat : (Array.isArray(feat) ? feat.join(' ') : String(feat || ''));
  const m = featStr.match(/SKU:\s*([^\s,\n]+)/i);
  if (m && m[1]) return m[1].trim();

  const tags = Array.isArray(doc.TAGS)
    ? doc.TAGS
    : (typeof doc.TAGS === 'string' ? doc.TAGS.split(',').map((t: string) => t.trim()) : []);
  const tagSku = tags.find((t: string) => t.toUpperCase().startsWith('VT-') || t.toUpperCase().startsWith('DB-') || t.toUpperCase().startsWith('DB'));
  if (tagSku) return tagSku;

  if (doc.jumpseller_id && String(doc.jumpseller_id).trim()) return String(doc.jumpseller_id).trim();

  return '-';
}

const POS_PRODUCTS_CACHE_KEY = 'yaxsel_pos_products_cache_v3';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas (Regla de optimización de lecturas Appwrite)

export function clearPosProductsCache(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(POS_PRODUCTS_CACHE_KEY);
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('yaxsel_pos_products_') || k.startsWith('yaxsel_cache:')) {
          localStorage.removeItem(k);
        }
      });
    } catch {}
  }
}

/**
 * Purga la caché SERVER-SIDE del appwrite-proxy (unstable_cache 24h, tag 'products').
 * Sin esto, tras editar precio/stock desde pos-admin el proxy seguía sirviendo
 * datos de hasta 24h de antigüedad (inconsistencia Web ↔ POS).
 * Fire-and-forget + coalescido: máximo 1 llamada cada 2s aunque se editen N productos.
 */
let lastPurgeAt = 0;
let purgeTimer: ReturnType<typeof setTimeout> | null = null;
export function purgeServerProductsCache(): void {
  if (typeof window === 'undefined') return;
  const nowTs = Date.now();
  const doPurge = () => {
    lastPurgeAt = Date.now();
    fetch('/api/revalidate?tag=products').catch(() => {});
  };
  if (nowTs - lastPurgeAt > 2000) {
    if (purgeTimer) { clearTimeout(purgeTimer); purgeTimer = null; }
    doPurge();
  } else if (!purgeTimer) {
    purgeTimer = setTimeout(() => { purgeTimer = null; doPurge(); }, 2100);
  }
}

// Generar el siguiente SKU consecutivo basado en los SKUs existentes
export function generateNextConsecutiveSku(existingSkus: string[], prefix = 'DB-'): string {
  let maxNum = 0;
  existingSkus.forEach((sku) => {
    if (!sku || sku === '-') return;
    const match = sku.match(/(\d+)$/);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > maxNum) {
        maxNum = val;
      }
    }
  });

  const nextNum = maxNum + 1;
  const padLen = Math.max(3, String(nextNum).length);
  return `${prefix}${String(nextNum).padStart(padLen, '0')}`;
}

// Cargar todos los productos de la colección 'products' en Appwrite Cloud mediante cursores con caché local
export async function fetchAllAppwriteErpProducts(forceRefresh = false): Promise<AppwriteErpProduct[]> {
  try {
    if (!forceRefresh && typeof window !== 'undefined') {
      const cachedRaw = localStorage.getItem(POS_PRODUCTS_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_TTL_MS) && Array.isArray(parsed.items)) {
          console.log(`⚡ [Caché Local] ${parsed.items.length} productos cargados desde localStorage (0 lecturas a Appwrite).`);
          return parsed.items;
        }
      }
    }

    const { databases } = getServices();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
    
    const allDocs: any[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const queries: any[] = [Query.limit(100)];
      if (cursor) {
        queries.push(Query.cursorAfter(cursor));
      }

      const res = await databases.listDocuments(dbId, PRODUCTS_COLLECTION, queries);
      if (res.documents && res.documents.length > 0) {
        allDocs.push(...res.documents);
        cursor = res.documents[res.documents.length - 1].$id;
        if (res.documents.length < 100) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    // Calcular la secuencia consecutiva para productos sin SKU
    const explicitSkus: string[] = [];
    let maxFound = 0;
    allDocs.forEach((doc) => {
      const explicit = resolveSku(doc);
      if (explicit && explicit !== '-') {
        explicitSkus.push(explicit);
        const match = explicit.match(/(\d+)$/);
        if (match && match[1]) {
          const val = parseInt(match[1], 10);
          if (!isNaN(val) && val > maxFound) maxFound = val;
        }
      }
    });

    let autoCounter = maxFound + 1;

    const items: AppwriteErpProduct[] = allDocs.map((doc: any) => {
      let finalSku = resolveSku(doc);
      let isAutoSku = false;
      if (!finalSku || finalSku === '-') {
        const padLen = Math.max(3, String(autoCounter).length);
        finalSku = `DB-${String(autoCounter).padStart(padLen, '0')}`;
        autoCounter++;
        isAutoSku = true;
      }

      return {
        $id: doc.$id,
        sku: finalSku,
        isAutoSku,
        codigo_barra: doc.BARCODE || doc.barcode || doc.codigo_barra || doc.sku || '',
        nombre: doc.NAME || doc.name || doc.nombre || 'Sin Nombre',
        costo_uni: Number(doc.COST || doc.cost || doc.costo_uni || 0),
        precio_venta_1: Number(doc.PRICE || doc.price || doc.precio_venta_1 || doc.CURRENTPRICE || 0),
        precio_venta_2: Number(doc.WHOLESALEPRICE || doc.precio_venta_2 || doc.PRICE || 0),
        precio_venta_3: Number(doc.EMPRENDEDORPRICE || doc.precio_venta_3 || doc.WHOLESALEPRICE || doc.PRICE || 0),
        stock: Number(doc.STOCK ?? doc.stock ?? doc.CANTIDAD ?? doc.cantidad ?? 0),
        isactive: doc.ISACTIVE !== undefined ? Boolean(doc.ISACTIVE) : true,
        category: doc.CATEGORYID || doc.category || doc.categoria || 'General',
        imageUrl: doc.IMAGEURL || doc.imageUrl || doc.image || null,
        rawDocument: doc,
      };
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(POS_PRODUCTS_CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          items,
        }));
      } catch (e) {
        console.warn('No se pudo guardar productos en localStorage:', e);
      }
    }

    console.log(`✅ Appwrite ERP: ${items.length} productos cargados desde 'products' y guardados en caché local.`);
    return items;
  } catch (error) {
    console.error('❌ Error al cargar productos de Appwrite:', error);
    if (typeof window !== 'undefined') {
      const cachedRaw = localStorage.getItem(POS_PRODUCTS_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (Array.isArray(parsed?.items)) return parsed.items;
      }
    }
    return [];
  }
}

// Actualizar cualquier atributo de producto en la colección 'products' manteniéndolo sincronizado con la Web
export async function updateAppwriteErpProduct(
  productId: string,
  data: Partial<{
    sku: string;
    nombre: string;
    codigo_barra: string;
    precio_venta_1: number;
    precio_venta_2: number;
    precio_venta_3: number;
    costo_uni: number;
    stock: number;
    isactive: boolean;
  }>
): Promise<boolean> {
  try {
    const { databases } = getServices();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';

    const payload: any = {};
    if (data.sku !== undefined) {
      payload.SKU = data.sku;
      payload.jumpseller_id = data.sku;
    }
    if (data.nombre !== undefined) { payload.NAME = data.nombre; }
    if (data.codigo_barra !== undefined) { payload.BARCODE = data.codigo_barra; }
    if (data.precio_venta_1 !== undefined) {
      payload.PRICE = data.precio_venta_1;
      payload.CURRENTPRICE = data.precio_venta_1;
      if (data.precio_venta_2 === undefined) payload.WHOLESALEPRICE = data.precio_venta_1;
      if (data.precio_venta_3 === undefined) payload.EMPRENDEDORPRICE = data.precio_venta_1;
    }
    if (data.precio_venta_2 !== undefined) { payload.WHOLESALEPRICE = data.precio_venta_2; }
    if (data.precio_venta_3 !== undefined) { payload.EMPRENDEDORPRICE = data.precio_venta_3; }
    if (data.costo_uni !== undefined) { payload.COST = data.costo_uni; }
    if (data.stock !== undefined) { payload.STOCK = data.stock; }
    if (data.isactive !== undefined) { payload.ISACTIVE = data.isactive; }

    await databases.updateDocument(dbId, PRODUCTS_COLLECTION, productId, payload);
    clearPosProductsCache();
    purgeServerProductsCache();
    console.log(`✅ Producto [${productId}] actualizado en Appwrite (Web & POS Sync)`);
    return true;
  } catch (error) {
    console.error(`❌ Error actualizando producto [${productId}] en Appwrite:`, error);
    return false;
  }
}

export async function createAppwriteErpProduct(data: {
  sku?: string;
  nombre: string;
  codigo_barra?: string;
  precio_venta_1?: number;
  precio_venta_2?: number;
  precio_venta_3?: number;
  costo_uni?: number;
  stock?: number;
  category?: string;
}): Promise<string | null> {
  try {
    const { databases } = getServices();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
    const docId = (data.sku && /^[a-zA-Z0-9_.-]{1,36}$/.test(data.sku)) ? data.sku : `prod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const payload: any = {
      NAME: data.nombre,
      PRICE: Number(data.precio_venta_1 || 0),
      CURRENTPRICE: Number(data.precio_venta_1 || 0),
      WHOLESALEPRICE: Number(data.precio_venta_2 || 0),
      EMPRENDEDORPRICE: Number(data.precio_venta_3 || 0),
      COST: Number(data.costo_uni || 0),
      STOCK: Number(data.stock || 0),
      BARCODE: data.codigo_barra || '',
      SKU: data.sku || docId,
      ISACTIVE: true,
    };
    const doc = await databases.createDocument(dbId, PRODUCTS_COLLECTION, docId, payload);
    clearPosProductsCache();
    purgeServerProductsCache();
    return doc.$id;
  } catch (error) {
    console.error('❌ Error creando producto en Appwrite:', error);
    return null;
  }
}

export async function deleteAppwriteErpProduct(productId: string): Promise<boolean> {
  try {
    const { databases } = getServices();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
    await databases.deleteDocument(dbId, PRODUCTS_COLLECTION, productId);
    clearPosProductsCache();
    purgeServerProductsCache();
    return true;
  } catch (error) {
    console.error(`❌ Error eliminando producto [${productId}] en Appwrite:`, error);
    return false;
  }
}
