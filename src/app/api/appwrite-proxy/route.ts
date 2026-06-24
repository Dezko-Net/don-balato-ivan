import { NextResponse } from 'next/server';
import { serverListDocuments, serverGetDocument } from '@/lib/appwrite-server';
import { PUBLIC_CACHEABLE_COLLECTIONS } from '@/lib/appwrite';
import { unstable_cache } from 'next/cache';

const getCachedList = (colId: string, parsedQueries: string[]) => unstable_cache(
  async () => {
    return await serverListDocuments(colId, parsedQueries);
  },
  ['appwrite-list-documents', colId, JSON.stringify(parsedQueries)],
  { revalidate: 86400, tags: ['appwrite-proxy'] }
)();

const getCachedDoc = (colId: string, docId: string) => unstable_cache(
  async () => {
    return await serverGetDocument(colId, docId);
  },
  ['appwrite-get-document', colId, docId],
  { revalidate: 86400, tags: ['appwrite-proxy'] }
)();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const colId = url.searchParams.get('colId');
    const docId = url.searchParams.get('docId');
    const queriesStr = url.searchParams.get('queries') || '[]';

    if (!colId) {
      return NextResponse.json({ error: 'Missing colId' }, { status: 400 });
    }

    if (!PUBLIC_CACHEABLE_COLLECTIONS.includes(colId)) {
      return NextResponse.json({ error: 'Unauthorized collection' }, { status: 403 });
    }

    let data;

    if (docId) {
      data = await getCachedDoc(colId, docId);
    } else {
      let parsedQueries: string[] = [];
      try {
        parsedQueries = JSON.parse(decodeURIComponent(queriesStr));
      } catch (e) {
        console.warn('[appwrite-proxy] Invalid queries format:', queriesStr);
      }
      data = await getCachedList(colId, parsedQueries);
    }

    // Still return Edge cache headers just in case
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error: any) {
    console.error('[appwrite-proxy] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

