import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, Query } from '@/lib/appwrite';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const API_KEY = process.env.APPWRITE_API_KEY || '';

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

    // Fetch real usage metrics from Appwrite's /project/usage endpoint
    let databaseReadsTotal = 0;
    let databaseWritesTotal = 0;
    let todayReads = 0;
    let sevenDaysReads = 0;
    let history: { date: string; value: number }[] = [];
    let writesHistory: { date: string; value: number }[] = [];
    let usageError: string | undefined = undefined;

    if (API_KEY) {
      try {
        const usageRes = await fetch(
          `${APPWRITE_ENDPOINT}/project/usage?range=30d`,
          {
            headers: {
              'X-Appwrite-Project': PROJECT_ID,
              'X-Appwrite-Key': API_KEY,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        );

        if (usageRes.ok) {
          const usage = await usageRes.json();
          databaseReadsTotal = usage.databasesReadsTotal || 0;
          databaseWritesTotal = usage.databasesWritesTotal || 0;

          // Parse daily reads history
          if (Array.isArray(usage.databasesReads)) {
            history = usage.databasesReads.map((d: any) => ({
              date: d.date,
              value: d.value || 0,
            }));
          }

          // Parse daily writes history
          if (Array.isArray(usage.databasesWrites)) {
            writesHistory = usage.databasesWrites.map((d: any) => ({
              date: d.date,
              value: d.value || 0,
            }));
          }

          // Today's reads = last entry in history
          if (history.length > 0) {
            todayReads = history[history.length - 1].value;
          }

          // Sum last 7 days of reads
          if (history.length >= 7) {
            sevenDaysReads = history.slice(-7).reduce((sum, h) => sum + h.value, 0);
          } else if (history.length > 0) {
            sevenDaysReads = history.reduce((sum, h) => sum + h.value, 0);
          }
        } else {
          const text = await usageRes.text();
          try {
            const errObj = JSON.parse(text);
            usageError = errObj.message || `HTTP ${usageRes.status}`;
          } catch {
            usageError = `HTTP ${usageRes.status}: ${text.slice(0, 100)}`;
          }
        }
      } catch (e: any) {
        usageError = e?.message || 'Error de red';
      }
    } else {
      usageError = 'No hay APPWRITE_API_KEY configurada en .env.local';
    }

    // Fallback: build empty history if API didn't return data
    if (history.length === 0) {
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setUTCDate(d.getUTCDate() - i);
        history.push({ date: d.toISOString().slice(0, 10), value: 0 });
      }
    }

    return {
      databaseReadsTotal,
      databaseWritesTotal,
      todayReads,
      sevenDaysReads,
      history,
      writesHistory,
      collections,
      collectionsTotal: Object.keys(collections).length,
      documentsTotal,
      lastUpdated: new Date().toISOString(),
      cached: false,
      error: usageError,
    };
  },
  ['appwrite-usage-cache-v3'],
  { revalidate: 60, tags: ['appwrite-usage'] }
);

export async function GET(req: NextRequest) {
  try {
    const force = req.nextUrl.searchParams.get('force');
    if (force) {
      // Bypass cache when force=1 is passed
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();

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

      try {
        const catRes = await databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [Query.limit(1)]);
        collections.categories = catRes.total;
        documentsTotal += catRes.total;
      } catch {
        collections.categories = 0;
      }

      let databaseReadsTotal = 0;
      let databaseWritesTotal = 0;
      let todayReads = 0;
      let sevenDaysReads = 0;
      let history: { date: string; value: number }[] = [];
      let writesHistory: { date: string; value: number }[] = [];
      let usageError: string | undefined = undefined;

      if (API_KEY) {
        try {
          const usageRes = await fetch(
            `${APPWRITE_ENDPOINT}/project/usage?range=30d`,
            {
              headers: {
                'X-Appwrite-Project': PROJECT_ID,
                'X-Appwrite-Key': API_KEY,
                'Content-Type': 'application/json',
              },
              cache: 'no-store',
            }
          );

          if (usageRes.ok) {
            const usage = await usageRes.json();
            databaseReadsTotal = usage.databasesReadsTotal || 0;
            databaseWritesTotal = usage.databasesWritesTotal || 0;

            if (Array.isArray(usage.databasesReads)) {
              history = usage.databasesReads.map((d: any) => ({ date: d.date, value: d.value || 0 }));
            }
            if (Array.isArray(usage.databasesWrites)) {
              writesHistory = usage.databasesWrites.map((d: any) => ({ date: d.date, value: d.value || 0 }));
            }
            if (history.length > 0) {
              todayReads = history[history.length - 1].value;
            }
            if (history.length >= 7) {
              sevenDaysReads = history.slice(-7).reduce((sum, h) => sum + h.value, 0);
            } else if (history.length > 0) {
              sevenDaysReads = history.reduce((sum, h) => sum + h.value, 0);
            }
          } else {
            const text = await usageRes.text();
            try {
              const errObj = JSON.parse(text);
              usageError = errObj.message || `HTTP ${usageRes.status}`;
            } catch {
              usageError = `HTTP ${usageRes.status}: ${text.slice(0, 100)}`;
            }
          }
        } catch (e: any) {
          usageError = e?.message || 'Error de red';
        }
      } else {
        usageError = 'No hay APPWRITE_API_KEY configurada en .env.local';
      }

      if (history.length === 0) {
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setUTCDate(d.getUTCDate() - i);
          history.push({ date: d.toISOString().slice(0, 10), value: 0 });
        }
      }

      return NextResponse.json({
        databaseReadsTotal,
        databaseWritesTotal,
        todayReads,
        sevenDaysReads,
        history,
        writesHistory,
        collections,
        collectionsTotal: Object.keys(collections).length,
        documentsTotal,
        lastUpdated: new Date().toISOString(),
        cached: false,
        error: usageError,
      });
    }

    const data = await getCachedAppwriteUsage();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching Appwrite usage metrics:', error);
    return NextResponse.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}
