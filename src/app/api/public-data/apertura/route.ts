import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { unstable_cache } from 'next/cache';
import { trackRead } from '@/lib/appwrite-read-tracker';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const COLLECTION_ID = 'apertura_settings';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Module-level in-memory cache (secondary layer)
let memoryCacheApertura: any = null;
let memoryCacheAperturaTime = 0;
const MEMORY_CACHE_TTL = 60000; // 60 seconds

const DEFAULT_SETTINGS = {
  isActive: false,
  discountPercent: 20,
  minPurchase: 62500,
};

const getCachedAperturaSettings = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheApertura && (now - memoryCacheAperturaTime < MEMORY_CACHE_TTL)) {
      return memoryCacheApertura;
    }

    trackRead('list', COLLECTION_ID, 'limit=1', new Error().stack || '');
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(1)]);

    let result = { ...DEFAULT_SETTINGS };

    if (response.documents.length > 0) {
      const d = response.documents[0];
      result = {
        isActive: !!d.isActive,
        discountPercent: typeof d.discountPercent === 'number' ? d.discountPercent : 20,
        minPurchase: typeof d.minPurchase === 'number' ? d.minPurchase : 62500,
      };
    }

    memoryCacheApertura = result;
    memoryCacheAperturaTime = now;
    return result;
  },
  ['apertura-settings-cache-v1'],
  { revalidate: 300, tags: ['apertura_settings'] }
);

export async function GET() {
  try {
    const data = await getCachedAperturaSettings();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    });
  } catch (error: any) {
    console.error('[API apertura] Error fetching apertura settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS, { status: 200 });
  }
}
