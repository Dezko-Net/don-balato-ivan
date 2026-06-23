import { NextRequest, NextResponse } from 'next/server';
import { getServerConfig, getHeaders } from '@/lib/appwrite-server';

// Server-side cache to avoid calling Appwrite too frequently
let cachedUsageData: any = null;
let lastCachedTime = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const now = Date.now();
  const { searchParams } = new URL(req.url);
  const force = searchParams.get('force') === '1';
  
  // Return cached data if still valid and not forced
  if (!force && cachedUsageData && (now - lastCachedTime < CACHE_TTL)) {
    return NextResponse.json({ ...cachedUsageData, cached: true });
  }

  try {
    const { endpoint, databaseId } = getServerConfig();
    const headers = getHeaders();

    // 1. Fetch database-level usage (databaseReads, databaseReadsTotal, etc.)
    const dbRes = await fetch(`${endpoint}/databases/${databaseId}/usage?range=30d`, { headers });
    if (!dbRes.ok) {
      throw new Error(`Failed to fetch database usage: ${dbRes.status}`);
    }
    const dbData = await dbRes.json();

    // 2. Fetch collection-level usage (to get document counts for key collections)
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

    // Fetch 24h usage for accurate today's reads
    const dbRes24 = await fetch(`${endpoint}/databases/${databaseId}/usage?range=24h`, { headers });
    let todayReads = 0;
    if (dbRes24.ok) {
      const dbData24 = await dbRes24.json();
      const reads24 = dbData24.databaseReads || [];
      for (const read of reads24) {
        todayReads += read.value || 0;
      }
    } else {
      const databaseReads = dbData.databaseReads || [];
      const todayData = databaseReads[databaseReads.length - 1];
      todayReads = todayData ? todayData.value : 0;
    }

    // Calculate last 7 days reads
    const databaseReads = dbData.databaseReads || [];
    const sevenDaysReads = databaseReads.slice(-7).reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

    const result = {
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

    cachedUsageData = result;
    lastCachedTime = now;

    return NextResponse.json({ ...result, cached: false });
  } catch (error: any) {
    console.error('Error fetching Appwrite usage metrics:', error);
    
    // Fallback to expired cache on error if available
    if (cachedUsageData) {
      return NextResponse.json({ ...cachedUsageData, cached: true, error: error.message });
    }
    
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}
