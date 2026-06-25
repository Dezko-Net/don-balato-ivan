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
  source: string;
  sourceFile: string;
  sourceLine: number;
  path: string;
}

const MAX_ENTRIES = 3000;
const entries: ReadEntry[] = [];

export function getRecentReads(limit = 500): ReadEntry[] {
  return entries.slice(-limit);
}

export function getReadsSummary(minutes = 30): {
  bySource: { source: string; count: number; collections: string[]; ops: Record<string, number> }[];
  byCollection: { collectionId: string; count: number; sources: string[]; ops: Record<string, number> }[];
  bySourceFile: { file: string; line: number; count: number; source: string }[];
  byMinute: { minute: string; count: number }[];
  crossRef: { source: string; collection: string; count: number }[];
  recent: { ts: number; op: string; collection: string; source: string; file: string; line: number }[];
  total: number;
  ops: Record<string, number>;
} {
  const cutoff = Date.now() - minutes * 60 * 1000;
  const recent = entries.filter((e) => e.ts >= cutoff);

  const sourceMap = new Map<string, { count: number; collections: Set<string>; ops: Record<string, number> }>();
  const colMap = new Map<string, { count: number; sources: Set<string>; ops: Record<string, number> }>();
  const fileMap = new Map<string, { file: string; line: number; count: number; source: string }>();
  const minuteMap = new Map<string, number>();
  const crossMap = new Map<string, { source: string; collection: string; count: number }>();
  const ops: Record<string, number> = {};

  for (const e of recent) {
    // By source (API route)
    const s = sourceMap.get(e.source) || { count: 0, collections: new Set(), ops: {} };
    s.count++;
    s.collections.add(e.collectionId);
    s.ops[e.op] = (s.ops[e.op] || 0) + 1;
    sourceMap.set(e.source, s);

    // By collection
    const c = colMap.get(e.collectionId) || { count: 0, sources: new Set(), ops: {} };
    c.count++;
    c.sources.add(e.source);
    c.ops[e.op] = (c.ops[e.op] || 0) + 1;
    colMap.set(e.collectionId, c);

    // By source file + line
    const fileKey = `${e.sourceFile}:${e.sourceLine}`;
    const f = fileMap.get(fileKey) || { file: e.sourceFile, line: e.sourceLine, count: 0, source: e.source };
    f.count++;
    fileMap.set(fileKey, f);

    // By minute
    const d = new Date(e.ts);
    const minuteKey = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    minuteMap.set(minuteKey, (minuteMap.get(minuteKey) || 0) + 1);

    // Cross-reference source × collection
    const crossKey = `${e.source}|||${e.collectionId}`;
    const cr = crossMap.get(crossKey) || { source: e.source, collection: e.collectionId, count: 0 };
    cr.count++;
    crossMap.set(crossKey, cr);

    ops[e.op] = (ops[e.op] || 0) + 1;
  }

  const bySource = Array.from(sourceMap.entries())
    .map(([source, data]) => ({ source, count: data.count, collections: Array.from(data.collections), ops: data.ops }))
    .sort((a, b) => b.count - a.count);

  const byCollection = Array.from(colMap.entries())
    .map(([collectionId, data]) => ({ collectionId, count: data.count, sources: Array.from(data.sources), ops: data.ops }))
    .sort((a, b) => b.count - a.count);

  const bySourceFile = Array.from(fileMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const byMinute = Array.from(minuteMap.entries())
    .map(([minute, count]) => ({ minute, count }))
    .sort((a, b) => a.minute.localeCompare(b.minute))
    .slice(-30);

  const crossRef = Array.from(crossMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  const recentList = recent.slice(-50).reverse().map(e => ({
    ts: e.ts,
    op: e.op,
    collection: e.collectionId,
    source: e.source,
    file: e.sourceFile,
    line: e.sourceLine,
  }));

  return { bySource, byCollection, bySourceFile, byMinute, crossRef, recent: recentList, total: recent.length, ops };
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
    const lineMatch = frame.match(/:(\d+):/);
    const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : 0;

    let source = 'unknown';
    let sourceFile = path;
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

    // Extract just the filename for cleaner display
    const fileNameMatch = path.match(/[\\/]([^\\/]+\.tsx?)$/);
    if (fileNameMatch) {
      sourceFile = fileNameMatch[1];
    }

    const entry: ReadEntry = {
      ts: Date.now(),
      op: op as any,
      collectionId,
      detail: detail.slice(0, 200),
      source,
      sourceFile,
      sourceLine: lineNum,
      path,
    };

    entries.push(entry);
    if (entries.length > MAX_ENTRIES) entries.shift();
  } catch {
    // never throw from tracker
  }
}
