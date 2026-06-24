import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { unstable_cache } from 'next/cache';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const COLLECTION_ID = 'store_settings';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Module-level in-memory cache as secondary layer
let memoryCacheSettings: any = null;
let memoryCacheSettingsTime = 0;
const MEMORY_CACHE_TTL = 300000; // 5 minutes

const getCachedStoreSettings = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheSettings && (now - memoryCacheSettingsTime < MEMORY_CACHE_TTL)) {
      return memoryCacheSettings;
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(1)]);
    let result: any = {
      storeName: '', phone: '', email: '', address: '', website: '', description: '',
      showInAnnouncementBar: false, unlimitedStock: false,
    };

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      result = {
        $id: doc.$id,
        storeName: doc.STORENAME || '',
        phone: doc.PHONE || '',
        email: doc.EMAIL || '',
        address: doc.ADDRESS || '',
        website: doc.WEBSITE || '',
        description: doc.DESCRIPTION || '',
        showInAnnouncementBar: doc.SHOWINANNOUNCEMENTBAR ?? false,
        unlimitedStock: doc.UNLIMITEDSTOCK ?? false,
      };
    }

    memoryCacheSettings = result;
    memoryCacheSettingsTime = now;
    return result;
  },
  ['store-settings-cache-v2'],
  { revalidate: 3600, tags: ['store_settings'] }
);

export async function GET() {
  try {
    const data = await getCachedStoreSettings();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      }
    });
  } catch (error: any) {
    console.error('[API store-settings] Error fetching store settings:', error);
    return NextResponse.json({
      storeName: '', phone: '', email: '', address: '', website: '', description: '',
      showInAnnouncementBar: false, unlimitedStock: false,
      error: error.message
    }, { status: 200 });
  }
}
