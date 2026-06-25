/**
 * Appwrite Read Tracker — in-memory buffer of server-side reads.
 * Tracks which API route/component originated each Appwrite call.
 * No Appwrite writes; data lives in server RAM and resets on cold start.
 */

export interface ReadEntry {
  ts: number;
  op: 'list' | 'get' | 'update' | 'create' | 'delete';
  collectionId: string;
  detail: string;
  source: string; // e.g. /api/public-data/home
  path: string; // file path from stack
}

const MAX_ENTRIES = 2000;
const entries: ReadEntry[] = [];

export function getRecentReads(limit = 500): ReadEntry[] {
  return entries.slice(-limit);
}

export function getReadsSummary(minutes = 30): {
  bySource: { source: string; count: number; collections: string[] }[];
  byCollection: { collectionId: string; count: number; sources: string[] }[];
  total: number;
  ops: Record<string, number>;
} {
  const cutoff = Date.now() - minutes * 60 * 1000;
  const recent = entries.filter((e) => e.ts >= cutoff);

  const sourceMap = new Map<string, { count: number; collections: Set<string> }>();
  const colMap = new Map<string, { count: number; sources: Set<string> }>();
  const ops: Record<string, number> = {};

  for (const e of recent) {
    const s = sourceMap.get(e.source) || { count: 0, collections: new Set() };
    s.count++;
    s.collections.add(e.collectionId);
    sourceMap.set(e.source, s);

    const c = colMap.get(e.collectionId) || { count: 0, sources: new Set() };
    c.count++;
    c.sources.add(e.source);
    colMap.set(e.collectionId, c);

    ops[e.op] = (ops[e.op] || 0) + 1;
  }

  const bySource = Array.from(sourceMap.entries())
    .map(([source, data]) => ({ source, count: data.count, collections: Array.from(data.collections) }))
    .sort((a, b) => b.count - a.count);

  const byCollection = Array.from(colMap.entries())
    .map(([collectionId, data]) => ({ collectionId, count: data.count, sources: Array.from(data.sources) }))
    .sort((a, b) => b.count - a.count);

  return { bySource, byCollection, total: recent.length, ops };
}

export function trackRead(op: string, collectionId: string, detail: string, stack: string): void {
  try {
    const lines = (stack || '').split('\n').slice(2);
    const frame =
      lines.find((l) => /[\\/](app|pages|lib|services|hooks|components|templates)[\\/]/.test(l) && !/appwrite-(server|read-tracker)/.test(l)) ||
      lines[0] ||
      '';
    const pathMatch = frame.match(/[\\/](src[\\/].+?\.tsx?):(\d+):/);
    const path = pathMatch ? pathMatch[1] : frame.trim();

    // Try to identify the API route that triggered the call
    let source = 'unknown';
    const routeMatch = frame.match(/[\\/](api[\\/][^\\/]+(?:[\\/][^\\/]+)*)[\\/]route\.ts/);
    if (routeMatch) {
      source = '/' + routeMatch[1].replace(/\\/g, '/');
    } else {
      const componentMatch = frame.match(/[\\/](components|templates|app|hooks)[\\/]([^\\/]+)\./);
      if (componentMatch) {
        source = componentMatch[1] + '/' + componentMatch[2];
      } else {
        source = path;
      }
    }

    const entry: ReadEntry = {
      ts: Date.now(),
      op: op as any,
      collectionId,
      detail: detail.slice(0, 200),
      source,
      path,
    };

    entries.push(entry);
    if (entries.length > MAX_ENTRIES) entries.shift();
  } catch {
    // never throw from tracker
  }
}
