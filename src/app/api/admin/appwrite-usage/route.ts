import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, Query } from '@/lib/appwrite';
import { unstable_cache } from 'next/cache';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const API_KEY = process.env.APPWRITE_API_KEY || '';

/** Helper to parse tables output from Appwrite CLI command */
function parseCliTable(out: string, sectionTitle: string) {
  const idx = out.indexOf(sectionTitle);
  if (idx === -1) return [];
  const lines = out.slice(idx).split('\n');
  const items: { value: number; date: string }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (i > 2 && line.includes('(') && !line.includes('│')) break;
    const parts = line.split('│');
    if (parts.length === 2) {
      const val = parseInt(parts[0].trim(), 10);
      const date = parts[1].trim();
      if (!isNaN(val) && date.includes('T')) {
        items.push({ value: val, date });
      }
    }
  }
  return items;
}

/** Fetches real usage metrics either via Appwrite CLI or HTTP API */
async function fetchRealUsage() {
  // Strategy 1: Try Appwrite CLI execution (Works locally & on servers with CLI logged in)
  try {
    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const cmd = `appwrite project get-usage --start-date "${startDate}" --end-date "${endDate}" --period "1d"`;
    let rawOut = execSync(cmd, { encoding: 'utf-8', timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'] });
    rawOut = rawOut.replace(/\u001b\[[0-9;]*m/g, ''); // Strip ANSI colors

    const totalReads = parseInt((rawOut.match(/databasesReadsTotal\s+(\d+)/) || [])[1] || '0', 10);
    const totalWrites = parseInt((rawOut.match(/databasesWritesTotal\s+(\d+)/) || [])[1] || '0', 10);

    const history = parseCliTable(rawOut, 'databasesReads (');
    const writesHistory = parseCliTable(rawOut, 'databasesWrites (');

    if (totalReads > 0 || history.length > 0) {
      const todayReads = history.length > 0 ? history[history.length - 1].value : 0;
      const sevenDaysReads = history.length > 0 ? history.slice(-7).reduce((s, h) => s + h.value, 0) : 0;

      return {
        databaseReadsTotal: totalReads,
        databaseWritesTotal: totalWrites,
        history,
        writesHistory,
        todayReads,
        sevenDaysReads,
      };
    }
  } catch {
    /* Ignore CLI error and try HTTP API fallback */
  }

  // Strategy 2: HTTP API fallback
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const url = `${APPWRITE_ENDPOINT}/project/usage?startDate=${startDate}&endDate=${endDate}&period=1d`;

  const res = await fetch(url, {
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = `HTTP ${res.status}`;
    try { msg = JSON.parse(text).message || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }

  const usage = await res.json();
  let databaseReadsTotal = usage.databasesReadsTotal ?? 0;
  let databaseWritesTotal = usage.databasesWritesTotal ?? 0;
  let history: { date: string; value: number }[] = [];
  let writesHistory: { date: string; value: number }[] = [];

  if (Array.isArray(usage.databasesReads)) {
    history = usage.databasesReads.map((d: any) => ({ date: d.date, value: Number(d.value) || 0 }));
  }
  if (Array.isArray(usage.databasesWrites)) {
    writesHistory = usage.databasesWrites.map((d: any) => ({ date: d.date, value: Number(d.value) || 0 }));
  }

  const todayReads = history.length > 0 ? history[history.length - 1].value : 0;
  const sevenDaysReads = history.length > 0 ? history.slice(-7).reduce((s, h) => s + h.value, 0) : 0;

  return { databaseReadsTotal, databaseWritesTotal, history, writesHistory, todayReads, sevenDaysReads };
}

async function countCollections() {
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

  return { collections, documentsTotal };
}

const getCachedAppwriteUsage = unstable_cache(
  async () => {
    const { collections, documentsTotal } = await countCollections();

    let databaseReadsTotal = 0;
    let databaseWritesTotal = 0;
    let todayReads = 0;
    let sevenDaysReads = 0;
    let history: { date: string; value: number }[] = [];
    let writesHistory: { date: string; value: number }[] = [];
    let usageError: string | undefined;

    if (API_KEY) {
      try {
        const u = await fetchRealUsage();
        databaseReadsTotal = u.databaseReadsTotal;
        databaseWritesTotal = u.databaseWritesTotal;
        history = u.history;
        writesHistory = u.writesHistory;
        todayReads = u.todayReads;
        sevenDaysReads = u.sevenDaysReads;
      } catch (e: any) {
        usageError = e?.message || 'Error al obtener métricas';
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
      cached: true,
      error: usageError,
    };
  },
  ['appwrite-usage-cache-v5'],
  { revalidate: 300, tags: ['appwrite-usage'] }
);

export async function GET(req: NextRequest) {
  try {
    const force = req.nextUrl.searchParams.get('force');

    if (force) {
      const { collections, documentsTotal } = await countCollections();

      let usageError: string | undefined;
      let u = {
        databaseReadsTotal: 0,
        databaseWritesTotal: 0,
        history: [] as { date: string; value: number }[],
        writesHistory: [] as { date: string; value: number }[],
        todayReads: 0,
        sevenDaysReads: 0,
      };

      if (API_KEY) {
        try {
          u = await fetchRealUsage();
        } catch (e: any) {
          usageError = e?.message || 'Error al obtener métricas';
        }
      } else {
        usageError = 'No hay APPWRITE_API_KEY configurada';
      }

      if (u.history.length === 0) {
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setUTCDate(d.getUTCDate() - i);
          u.history.push({ date: d.toISOString().slice(0, 10), value: 0 });
        }
      }

      return NextResponse.json({
        databaseReadsTotal: u.databaseReadsTotal,
        databaseWritesTotal: u.databaseWritesTotal,
        todayReads: u.todayReads,
        sevenDaysReads: u.sevenDaysReads,
        history: u.history,
        writesHistory: u.writesHistory,
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
