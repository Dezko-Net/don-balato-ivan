/**
 * Appwrite Read Tracker — Persistent server-side read tracker.
 * Tracks which API route/component originated each Appwrite call.
 * Syncs daily reads to Appwrite 'sequences' collection so Vercel Serverless cold starts never reset the counter.
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

const MAX_ENTRIES = 5000;

function getFs() {
  if (typeof window !== 'undefined') return null;
  try {
    return eval('require')('fs');
  } catch {
    return null;
  }
}

function getStoragePath(): string | null {
  if (typeof window !== 'undefined') return null;
  try {
    const p = eval('require')('path');
    return p.join(process.cwd(), '.appwrite-tracker-log.json');
  } catch {
    return null;
  }
}

const globalForTracker = globalThis as unknown as {
  appwriteTrackerEntries?: ReadEntry[];
  appwritePersistedCount?: number;
};

function loadEntries(): ReadEntry[] {
  if (globalForTracker.appwriteTrackerEntries && globalForTracker.appwriteTrackerEntries.length > 0) {
    return globalForTracker.appwriteTrackerEntries;
  }
  const fsLib = getFs();
  const filePath = getStoragePath();
  if (fsLib && filePath) {
    try {
      if (fsLib.existsSync(filePath)) {
        const raw = fsLib.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          globalForTracker.appwriteTrackerEntries = parsed;
          return parsed;
        }
      }
    } catch {
      // Ignore file read errors
    }
  }
  const initial: ReadEntry[] = [];
  globalForTracker.appwriteTrackerEntries = initial;
  return initial;
}

const entries: ReadEntry[] = loadEntries();

function saveEntriesToDisk() {
  const fsLib = getFs();
  const filePath = getStoragePath();
  if (fsLib && filePath) {
    try {
      fsLib.writeFileSync(filePath, JSON.stringify(entries.slice(-MAX_ENTRIES)), 'utf-8');
    } catch {
      // Ignore file write errors
    }
  }
}

let lastSyncTime = 0;
export async function syncDailyUsageToAppwrite(count: number): Promise<void> {
  const now = Date.now();
  if (now - lastSyncTime < 8000) return; // throttle sync every 8 seconds
  lastSyncTime = now;

  try {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
    const key = process.env.APPWRITE_API_KEY;

    if (!key) return;

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '_');
    const docId = `daily_usage_${todayStr}`;
    const headers = {
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': key,
      'Content-Type': 'application/json'
    };

    const patchRes = await fetch(`${endpoint}/databases/${dbId}/collections/sequences/documents/${docId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ data: { value: count } })
    });

    if (!patchRes.ok && patchRes.status === 404) {
      await fetch(`${endpoint}/databases/${dbId}/collections/sequences/documents`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          documentId: docId,
          data: { key: `daily_usage_${todayStr}`, value: count }
        })
      });
    }
  } catch {
    // Silent catch
  }
}

export async function fetchPersistedDailyCountFromAppwrite(): Promise<number> {
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
    const key = process.env.APPWRITE_API_KEY;

    if (!key) return 0;

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '_');
    const docId = `daily_usage_${todayStr}`;
    const headers = {
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': key,
      'Content-Type': 'application/json'
    };

    const res = await fetch(`${endpoint}/databases/${dbId}/collections/sequences/documents/${docId}`, {
      headers,
      cache: 'no-store'
    });

    if (res.ok) {
      const doc = await res.json();
      return typeof doc.value === 'number' ? doc.value : 0;
    }
  } catch {
    // Silent catch
  }
  return 0;
}

export function getRecentReads(limit = 500): ReadEntry[] {
  return entries.slice(-limit);
}

export function getReadsSummary(minutes = 1440): {
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
    const s = sourceMap.get(e.source) || { count: 0, collections: new Set(), ops: {} };
    s.count++;
    s.collections.add(e.collectionId);
    s.ops[e.op] = (s.ops[e.op] || 0) + 1;
    sourceMap.set(e.source, s);

    const c = colMap.get(e.collectionId) || { count: 0, sources: new Set(), ops: {} };
    c.count++;
    c.sources.add(e.source);
    c.ops[e.op] = (c.ops[e.op] || 0) + 1;
    colMap.set(e.collectionId, c);

    const fileKey = `${e.sourceFile}:${e.sourceLine}`;
    const f = fileMap.get(fileKey) || { file: e.sourceFile, line: e.sourceLine, count: 0, source: e.source };
    f.count++;
    fileMap.set(fileKey, f);

    const d = new Date(e.ts);
    const minuteKey = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    minuteMap.set(minuteKey, (minuteMap.get(minuteKey) || 0) + 1);

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
    saveEntriesToDisk();

    // Trigger throttled background sync to Appwrite
    syncDailyUsageToAppwrite(entries.length).catch(() => {});
  } catch {
    // never throw from tracker
  }
}
