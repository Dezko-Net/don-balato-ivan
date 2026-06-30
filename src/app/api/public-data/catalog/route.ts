import { NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, CATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION, PRODUCTS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';

// force-dynamic removed to allow Vercel CDN caching via s-maxage header

let memoryCacheCatalog: any = null;
let memoryCacheCatalogTime = 0;

const getCachedCatalogData = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheCatalog && (now - memoryCacheCatalogTime < 300000)) { // 5 minutes in memory
      return memoryCacheCatalog;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const [catDocs, offDocs, cpDocs] = await Promise.all([
      databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [Query.orderAsc('$createdAt'), Query.limit(30)]),
      databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [Query.equal('isActive', true), Query.equal('status', 'active'), Query.limit(100)]),
      databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
        Query.greaterThan('CURRENTPRICE', 0),
        Query.limit(200)
      ])
    ]);

    // Merge TIMED_OFFERS IDs with products that have CURRENTPRICE < PRICE
    const timedOfferIds = offDocs.documents.map((d: any) => d.targetId).filter(Boolean);
    const cpOfferIds = cpDocs.documents
      .filter((p: any) => p.CURRENTPRICE > 0 && p.CURRENTPRICE < (p.PRICE || 0))
      .map((p: any) => p.$id);
    const allOfferIds = Array.from(new Set([...timedOfferIds, ...cpOfferIds]));

    const result = {
      categories: catDocs.documents,
      offers: offDocs.documents,
      offerProductIds: allOfferIds
    };

    memoryCacheCatalog = result;
    memoryCacheCatalogTime = now;
    return result;
  },
  ['public-catalog-cache'],
  { revalidate: 86400, tags: ['catalog', 'categories', 'offers'] }
);

export async function GET() {
  try {
    const data = await getCachedCatalogData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    console.error('[API public-data/catalog] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

