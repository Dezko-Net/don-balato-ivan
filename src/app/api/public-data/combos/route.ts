import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { Client, Databases, Query } from 'node-appwrite';
import { trackRead } from '@/lib/appwrite-read-tracker';
import { serverGetDocument } from '@/lib/appwrite-server';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'combos-config.json');
const SETTINGS_COLLECTION_ID = 'theme_config';
const COMBOS_DOC_ID = 'combos-config';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = 'donbalatoivan';
const DATABASE_ID = '6a62e7440033d2278d28';
const COLLECTION_PRODUCTS = 'products';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

export interface ComboItemConfig {
  id: string;
  title: string;
  subtitle?: string;
  discountPercent?: number;
  badge?: string;
  isActive: boolean;
  mainProductId: string;
  bundleProductIds: string[];
}

async function readLocalConfig(): Promise<ComboItemConfig[]> {
  // Try Appwrite first (works in production)
  try {
    const doc = await serverGetDocument(SETTINGS_COLLECTION_ID, COMBOS_DOC_ID);
    if (doc && (doc as any).config) {
      return JSON.parse((doc as any).config);
    }
  } catch { /* doc doesn't exist yet */ }

  // Fallback to local file (works in dev)
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('[API combos] Error reading local config:', e);
  }
  return [];
}

// Se llama en CADA carga del home (plantilla25/HomePage). Sin caché hacía un
// getDocument de la config + un listDocuments de hasta 50 productos por visita.
// Los combos los define el admin, así que 24h con purga por tag es de sobra.
const getCachedCombos = unstable_cache(
  async () => {
    const rawConfigs = await readLocalConfig();
    const activeConfigs = rawConfigs.filter(c => c.isActive);

    // Collect all product IDs needed
    const allProdIds = new Set<string>();
    activeConfigs.forEach(c => {
      if (c.mainProductId) allProdIds.add(c.mainProductId);
      (c.bundleProductIds || []).forEach(id => { if (id) allProdIds.add(id); });
    });

    const productsById: Record<string, any> = {};

    if (allProdIds.size > 0 && API_KEY) {
      try {
        const idList = Array.from(allProdIds).slice(0, 50);
        trackRead('list', COLLECTION_PRODUCTS, `combos-products-count=${idList.length}`, new Error().stack || '');
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_PRODUCTS, [
          Query.equal('$id', idList),
          Query.limit(50),
        ]);

        response.documents.forEach(doc => {
          productsById[doc.$id] = {
            $id: doc.$id,
            NAME: doc.NAME || '',
            PRICE: doc.PRICE || 0,
            CURRENTPRICE: doc.CURRENTPRICE || 0,
            IMAGEURL: doc.IMAGEURL || '',
            IMAGEURL2: doc.IMAGEURL2 || '',
            IMAGEURL3: doc.IMAGEURL3 || '',
            IMAGEURL4: doc.IMAGEURL4 || '',
            IMAGEURL5: doc.IMAGEURL5 || '',
            DESCRIPTION: doc.DESCRIPTION || '',
            FEATURES: doc.FEATURES || '',
            TAGS: doc.TAGS || '',
            SKU: doc.SKU || doc.sku || '',
            BRAND: doc.BRAND || '',
            STOCK: doc.STOCK || 0,
            PACKQTY: doc.PACKQTY || 1,
          };
        });
      } catch (e) {
        console.warn('[API combos] Failed to fetch products from Appwrite:', e);
      }
    }

    const combos = activeConfigs.map(c => {
      const featId = (c as any).featuredProductId || c.mainProductId;
      const featProd = featId ? (productsById[featId] || null) : null;
      const bundleProds = (c.bundleProductIds || [])
        .map(id => productsById[id])
        .filter(Boolean);

      return {
        ...c,
        featuredProduct: featProd,
        mainProduct: featProd,
        bundleProducts: bundleProds,
      };
    });

    return combos;
  },
  ['public-combos-cache-v1'],
  { revalidate: 86400, tags: ['combos', 'products'] }
);

export async function GET() {
  try {
    const combos = await getCachedCombos();

    return NextResponse.json({
      success: true,
      combos,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error: any) {
    console.error('[API combos GET] Error:', error);
    return NextResponse.json({ success: false, combos: [], error: error.message }, { status: 500 });
  }
}
