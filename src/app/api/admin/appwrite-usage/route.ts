import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, Query } from '@/lib/appwrite';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getCachedAppwriteUsage = unstable_cache(
  async () => {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    // Count documents in each collection using listDocuments with limit=1
    const collectionsToCount = [
      { key: 'products', id: PRODUCTS_COLLECTION },
      { key: 'orders', id: 'orders' },
      { key: 'inventory', id: 'inventory_products' },
    ];

    const collections: Record<string, number> = {};
    let documentsTotal = 0;

    await Promise.all(
      collectionsToCount.map(async (c) => {
        try {
          const res = await databases.listDocuments(databaseId, c.id, [Query.limit(1)]);
          collections[c.key] = res.total;
          documentsTotal += res.total;
        } catch {
          collections[c.key] = 0;
        }
      })
    );

    // Also count categories
    try {
      const catRes = await databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [Query.limit(1)]);
      collections.categories = catRes.total;
      documentsTotal += catRes.total;
    } catch {
      collections.categories = 0;
    }

    // Build a simple history (no usage API available on free plan)
    const now = new Date();
    const history: { date: string; value: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      history.push({ date: d.toISOString().slice(0, 10), value: 0 });
    }

    return {
      databaseReadsTotal: 0,
      databaseWritesTotal: 0,
      todayReads: 0,
      sevenDaysReads: 0,
      history,
      writesHistory: [],
      collections,
      collectionsTotal: Object.keys(collections).length,
      documentsTotal,
      lastUpdated: new Date().toISOString(),
      note: 'Usage metrics API not available on current Appwrite plan. Showing document counts only.',
    };
  },
  ['appwrite-usage-cache-v2'],
  { revalidate: 300, tags: ['appwrite-usage'] }
);

export async function GET(req: NextRequest) {
  try {
    const data = await getCachedAppwriteUsage();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching Appwrite usage metrics:', error);
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}
