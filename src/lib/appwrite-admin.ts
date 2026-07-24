import { Client, Account, Databases, Storage } from 'appwrite';

const CONFIG_KEY = 'yaxsel_appwrite_config';

export interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
}

const DEFAULT_CONFIG: AppwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28',
};

export function getAppwriteConfig(): AppwriteConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppwriteConfig;
      if (parsed.endpoint && parsed.projectId && parsed.databaseId) return parsed;
    }
  } catch {}
  return DEFAULT_CONFIG;
}

export function saveAppwriteConfig(config: AppwriteConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function isAppwriteConfigured(): boolean {
  const cfg = getAppwriteConfig();
  return !!(cfg.endpoint && cfg.projectId && cfg.databaseId);
}

export function clearAppwriteConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONFIG_KEY);
}

export function exportAppwriteConfig(): string {
  const cfg = getAppwriteConfig();
  return JSON.stringify(cfg, null, 2);
}

let _client: Client | null = null;

export function createAppwriteClient(): Client {
  const cfg = getAppwriteConfig();
  if (!_client) {
    _client = new Client().setEndpoint(cfg.endpoint).setProject(cfg.projectId);
  }
  return _client;
}

export function getServices() {
  const client = createAppwriteClient();
  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
}

// Collection IDs (same across all clients)
export const PRODUCTS_COLLECTION_ID = 'products';
export const INVENTORY_PRODUCTS_COLLECTION_ID = 'inventory_products';
export const CATALOG_PRODUCTS_COLLECTION_ID = 'catalog_products';
export const CATEGORIES_COLLECTION_ID = 'categories';
export const SUBCATEGORIES_COLLECTION_ID = 'subcategories';
export const BANNERS_COLLECTION_ID = 'banners';
export const ORDERS_COLLECTION_ID = 'orders';
export const USERS_COLLECTION_ID = 'users';
export const NOTIFICATIONS_COLLECTION_ID = 'notifications';
export const TIMED_OFFERS_COLLECTION_ID = 'timed_offers';
export const LIVE_STREAMS_COLLECTION_ID = 'live_streams';
export const SUPPORT_TICKETS_COLLECTION_ID = 'support_tickets';
export const SEQUENCES_COLLECTION_ID = 'sequences';
export const STOCK_MOVEMENTS_COLLECTION_ID = 'stock_movements';
export const FCM_TOKENS_COLLECTION_ID = 'fcm_tokens';
export const ORDER_STATUS_HISTORY_COLLECTION_ID = 'order_status_history';
export const COUPONS_COLLECTION_ID = 'discount_coupons';
export const POINTS_STORE_COLLECTION_ID = 'points_store_items';
export const WHOLESALE_REQUESTS_COLLECTION_ID = 'wholesale_requests';
export const WHOLESALE_ORDERS_COLLECTION_ID = 'wholesale_orders';
export const REVIEWS_COLLECTION_ID = 'reviews';
export const FAVORITES_COLLECTION_ID = 'favorites';
export const CART_ITEMS_COLLECTION_ID = 'cart_items';
export const CART_SNAPSHOTS_COLLECTION_ID = 'cart_snapshots';
export const ADMIN_CHAT_COLLECTION_ID = 'admin_chat';
export const CLIPS_COLLECTION_ID = 'clips';
export const RAFFLES_COLLECTION_ID = 'live_raffles';
export const RAFFLE_PARTICIPANTS_COLLECTION_ID = 'raffle_participants';
export const STOCK_ALERTS_COLLECTION_ID = 'stock_alerts';
export const STOCK_REQUESTS_COLLECTION_ID = 'stock_requests';
export const ADDRESSES_COLLECTION_ID = 'addresses';
export const APERTURA_SETTINGS_COLLECTION_ID = 'apertura_settings';
export const AGENCIES_COLLECTION_ID = 'shipping_agencies';
export const COTIZACION_COLLECTION_ID = 'cotizaciones';

// Backward-compatible exports (reads config at call time for SSR safety)
export const DATABASE_ID = typeof window !== 'undefined'
  ? getAppwriteConfig().databaseId
  : (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '');

export const databases = new Proxy({} as ReturnType<typeof getServices>['databases'], {
  get(_target, prop: string) {
    const db = getServices().databases;
    return (db as any)[prop].bind(db);
  },
});

export const account = new Proxy({} as ReturnType<typeof getServices>['account'], {
  get(_target, prop: string) {
    const acc = getServices().account;
    return (acc as any)[prop].bind(acc);
  },
});

export const storage = new Proxy({} as ReturnType<typeof getServices>['storage'], {
  get(_target, prop: string) {
    const st = getServices().storage;
    return (st as any)[prop].bind(st);
  },
});

export default createAppwriteClient;
