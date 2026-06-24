import { NextRequest, NextResponse } from 'next/server';
import { getServerConfig, getHeaders } from '@/lib/appwrite-server';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getCachedAppwriteUsage = unstable_cache(
  async () => {
    const { endpoint, databaseId } = getServerConfig();
    const headers = getHeaders();

    // 1. Fetch database-level usage
    const dbRes = await fetch(`${endpoint}/databases/${databaseId}/usage?range=30d`, { headers });
    if (!dbRes.ok) throw new Error(`Failed to fetch database usage: ${dbRes.status}`);
    const dbData = await dbRes.json();

    // 2. Fetch collection-level usage
    const collectionsToQuery = [
      { key: 'products', id: 'products' },
      { key: 'orders', id: 'orders' },
      { key: 'inventory', id: 'inventory_products' }
    ];

    const collectionsUsage: Record<string, number> = {};
    await Promise.all(
      collectionsToQuery.map(async (c) => {
        try {
          const res = await fetch(`${endpoint}/databases/${databaseId}/collections/${c.id}/usage?range=30d`, { headers });
          if (res.ok) {
            const data = await res.json();
            collectionsUsage[c.key] = data.documentsTotal || 0;
          } else {
            collectionsUsage[c.key] = 0;
          }
        } catch {
          collectionsUsage[c.key] = 0;
        }
      })
    );

    // Calculate today's reads from the 30d daily aggregation (current calendar day)
    const databaseReads = dbData.databaseReads || [];
    const todayData = databaseReads.length > 0 ? databaseReads[databaseReads.length - 1] : null;
    const todayReads = todayData ? (todayData.value || 0) : 0;

    // Calculate last 7 days reads
    const sevenDaysReads = databaseReads.slice(-7).reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

    return {
      databaseReadsTotal: dbData.databaseReadsTotal || 0,
      databaseWritesTotal: dbData.databaseWritesTotal || 0,
      todayReads,
      sevenDaysReads,
      history: databaseReads,
      writesHistory: dbData.databaseWrites || [],
      collections: collectionsUsage,
      collectionsTotal: dbData.collectionsTotal || 0,
      documentsTotal: dbData.documentsTotal || 0,
      lastUpdated: new Date().toISOString()
    };
  },
  ['appwrite-usage-cache'],
  { revalidate: 300, tags: ['appwrite-usage'] } // 5 minutes cache
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
