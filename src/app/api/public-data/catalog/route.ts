import { NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getCachedCatalogData = unstable_cache(
  async () => {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const [catDocs, subDocs, offDocs] = await Promise.all([
      databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [Query.orderAsc('$createdAt'), Query.limit(50)]),
      databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION, [Query.orderAsc('$createdAt'), Query.limit(200)]),
      databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [Query.equal('isActive', true), Query.equal('status', 'active'), Query.limit(100)])
    ]);

    const result = {
      categories: catDocs.documents,
      subcategories: subDocs.documents,
      offers: offDocs.documents
    };

    return result;
  },
  ['public-catalog-cache-v3'],
  { revalidate: 3600, tags: ['catalog', 'categories', 'offers'] }
);

export async function GET() {
  try {
    const data = await getCachedCatalogData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('[API public-data/catalog] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

