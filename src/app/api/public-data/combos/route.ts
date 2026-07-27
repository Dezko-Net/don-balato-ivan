import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Client, Databases, Query } from 'node-appwrite';
import { trackRead } from '@/lib/appwrite-read-tracker';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'combos-config.json');

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

function readLocalConfig(): ComboItemConfig[] {
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

export async function GET() {
  try {
    const rawConfigs = readLocalConfig();
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
            DESCRIPTION: doc.DESCRIPTION || '',
            STOCK: doc.STOCK || 0,
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
