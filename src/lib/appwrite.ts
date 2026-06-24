import { Client, Databases, Account, Storage, ID, Query } from 'appwrite';

export { ID, Query };

function getConfig() {
  if (typeof window !== 'undefined') {
    // Check both keys: admin uses 'yaxsel_appwrite_config', store uses 'appwrite_config'
    for (const key of ['yaxsel_appwrite_config', 'appwrite_config']) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.endpoint && parsed?.projectId && parsed?.databaseId) {
            return parsed;
          }
        } catch {}
      }
    }
  }
  return {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90',
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86',
  };
}

export function getAppwriteConfig() {
  return getConfig();
}

let _client: Client | null = null;
let _databases: Databases | null = null;
let _account: Account | null = null;
let _storage: Storage | null = null;

export function getServices() {
  const { endpoint, projectId } = getConfig();
  if (!_client) {
    _client = new Client().setEndpoint(endpoint).setProject(projectId);

    // 🔒 SERVER-ONLY: autenticar con la API key para que las lecturas funcionen
    // aunque las colecciones NO sean de lectura pública (read("any")).
    // En el cliente, process.env.APPWRITE_API_KEY es undefined y Next NO lo incluye
    // en el bundle (no es NEXT_PUBLIC), así que la key jamás se expone al navegador.
    // El navegador sigue leyendo vía el proxy cacheado /api/appwrite-proxy.
    if (typeof window === 'undefined' && process.env.APPWRITE_API_KEY) {
      try {
        (_client as any).headers = {
          ...((_client as any).headers || {}),
          'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
        };
      } catch { /* noop */ }
    }

    _databases = new Databases(_client);
    _account = new Account(_client);
    _storage = new Storage(_client);

    const pendingListRequests = new Map<string, Promise<any>>();
    const originalListDocuments = _databases.listDocuments.bind(_databases);
    
    _databases.listDocuments = async (dbId, colId, queries) => {
      if (typeof window !== 'undefined' && PUBLIC_CACHEABLE_COLLECTIONS.includes(colId)) {
        const cacheKey = colId + '-' + JSON.stringify(queries || []);
        if (pendingListRequests.has(cacheKey)) {
          return pendingListRequests.get(cacheKey);
        }
        
        const promise = (async () => {
          try {
            const qStr = encodeURIComponent(JSON.stringify(queries || []));
            const res = await fetch(`/api/appwrite-proxy?colId=${colId}&queries=${qStr}`);
            if (res.ok) {
              return await res.json();
            }
          } catch (e) {
            console.warn('[CachedAppwrite] Proxy failed for listDocuments, falling back to direct Appwrite', e);
          } finally {
            setTimeout(() => pendingListRequests.delete(cacheKey), 500);
          }
          return originalListDocuments(dbId, colId, queries);
        })();
        
        pendingListRequests.set(cacheKey, promise);
        return promise;
      }
      return originalListDocuments(dbId, colId, queries);
    };

    const pendingGetRequests = new Map<string, Promise<any>>();
    const originalGetDocument = _databases.getDocument.bind(_databases);
    
    _databases.getDocument = async (dbId, colId, docId, queries) => {
      if (typeof window !== 'undefined' && PUBLIC_CACHEABLE_COLLECTIONS.includes(colId)) {
        const cacheKey = colId + '-' + docId;
        if (pendingGetRequests.has(cacheKey)) {
          return pendingGetRequests.get(cacheKey);
        }
        
        const promise = (async () => {
          try {
            const res = await fetch(`/api/appwrite-proxy?colId=${colId}&docId=${docId}`);
            if (res.ok) {
              return await res.json();
            }
          } catch (e) {
            console.warn('[CachedAppwrite] Proxy failed for getDocument, falling back to direct Appwrite', e);
          } finally {
            setTimeout(() => pendingGetRequests.delete(cacheKey), 500);
          }
          return originalGetDocument(dbId, colId, docId, queries);
        })();
        
        pendingGetRequests.set(cacheKey, promise);
        return promise;
      }
      return originalGetDocument(dbId, colId, docId, queries);
    };
  }
  return {
    client: _client,
    databases: _databases!,
    account: _account!,
    storage: _storage!,
  };
}


export const PRODUCTS_COLLECTION    = 'products';
export const INVENTORY_PRODUCTS_COLLECTION = 'inventory_products';
export const CATALOG_PRODUCTS_COLLECTION = 'catalog_products';
export const CATEGORIES_COLLECTION  = 'categories';
export const BANNERS_COLLECTION     = 'banners';
export const ORDERS_COLLECTION      = 'orders';
export const TIMED_OFFERS_COLLECTION = 'timed_offers';
export const SEQUENCES_COLLECTION   = 'sequences';
export const COUPONS_COLLECTION                  = 'discount_coupons';
export const POINTS_STORE_COLLECTION             = 'points_store_items';
export const USERS_COLLECTION                    = 'users';
export const LIVE_STREAMS_COLLECTION             = 'live_streams';
export const BANNER_OVERLAY_POSITIONS_COLLECTION = 'banner_overlay_positions';
export const HOUSE_PRODUCT_POSITIONS_COLLECTION  = 'house_product_positions';
export const HOTSPOT_PANELS_COLLECTION           = 'hotspot_panels';
export const PRODUCT_VOTES_COLLECTION            = 'product_votes';
export const SUBCATEGORIES_COLLECTION            = 'subcategories';
export const REVIEWS_COLLECTION                  = 'reviews';
export const CLIPS_COLLECTION                    = 'clips';
export const FAVORITES_COLLECTION                = 'favorites';
export const RAFFLES_COLLECTION                  = 'live_raffles';
export const RAFFLE_PARTICIPANTS_COLLECTION      = 'raffle_participants';
export const STOCK_ALERTS_COLLECTION             = 'stock_alerts';
export const STOCK_REQUESTS_COLLECTION           = 'stock_requests';
export const NOTIFICATIONS_COLLECTION            = 'notifications';
export const THEME_CONFIG_COLLECTION             = 'theme_config';
export const APERTURA_SETTINGS_COLLECTION      = 'apertura_settings';
export const PRODUCT_VIEWS_COLLECTION            = 'product_views';

export const PUBLIC_CACHEABLE_COLLECTIONS = [
  PRODUCTS_COLLECTION,
  CATEGORIES_COLLECTION,
  BANNERS_COLLECTION,
  TIMED_OFFERS_COLLECTION,
  LIVE_STREAMS_COLLECTION,
  HOTSPOT_PANELS_COLLECTION,
  BANNER_OVERLAY_POSITIONS_COLLECTION,
  SUBCATEGORIES_COLLECTION,
  THEME_CONFIG_COLLECTION,
  APERTURA_SETTINGS_COLLECTION,
  'store_settings'
];
export const ADMIN_CHAT_COLLECTION                = 'admin_chat'; // Admin-user chat collection
// ============================================
// STORAGE — Un solo bucket con prefijos
// ============================================
export const MEDIA_BUCKET_ID = '6a15f9a5001070a3c408';
// Bucket dedicado a las fotos de las cajas de pedidos antes de despachar
export const ORDER_BOX_PHOTOS_BUCKET_ID = '6a349e3f000d44477aa2';

// Prefijos para organizar archivos en el bucket único
export const MEDIA_PREFIXES = {
  products: 'products/',
  banners: 'banners/',
  categories: 'categories/',
  comprobantes: 'comprobantes/',
  thumbnails: 'thumbnails/',
  chat: 'chat/',
} as const;

export type MediaPrefix = keyof typeof MEDIA_PREFIXES;

// Función helper para agregar prefijo a nombre de archivo
export function withPrefix(prefix: keyof typeof MEDIA_PREFIXES, fileName: string): string {
  return MEDIA_PREFIXES[prefix] + fileName;
}

// Función helper para obtener URL de archivo con prefijo
export function getMediaUrl(fileId: string, prefix?: keyof typeof MEDIA_PREFIXES): string {
  const { endpoint, projectId } = getConfig();
  const path = prefix ? MEDIA_PREFIXES[prefix] + fileId : fileId;
  return `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${path}/view?project=${projectId}`;
}

// Backward compatibility - mantener nombres antiguos pero apuntar al bucket único
export const COMPROBANTES_BUCKET = MEDIA_BUCKET_ID;
export const USER_PHOTOS_BUCKET = MEDIA_BUCKET_ID;

export async function getNextOrderIndex(): Promise<number> {
  const { databases } = getServices();
  const { databaseId } = getAppwriteConfig();
  try {
    const doc = await databases.getDocument(databaseId, SEQUENCES_COLLECTION, 'order_sequence');
    const current = (doc.value as number) || 0;
    await databases.updateDocument(databaseId, SEQUENCES_COLLECTION, 'order_sequence', { value: current + 1 });
    return current + 1;
  } catch {
    try {
      await databases.createDocument(databaseId, SEQUENCES_COLLECTION, 'order_sequence', { value: 1 });
    } catch {}
    return 1;
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
}
