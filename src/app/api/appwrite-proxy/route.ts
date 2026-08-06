import { NextResponse } from 'next/server';
import { serverListDocuments, serverGetDocument } from '@/lib/appwrite-server';
import { PUBLIC_CACHEABLE_COLLECTIONS } from '@/lib/appwrite';
import { unstable_cache } from 'next/cache';

const getCachedList = (colId: string, parsedQueries: string[]) => unstable_cache(
  async () => {
    return await serverListDocuments(colId, parsedQueries);
  },
  ['appwrite-list-documents', colId, JSON.stringify(parsedQueries)],
  { revalidate: 86400, tags: ['appwrite-proxy', colId, 'products', `appwrite-proxy-${colId}`] }
)();

const getCachedDoc = (colId: string, docId: string) => unstable_cache(
  async () => {
    return await serverGetDocument(colId, docId);
  },
  ['appwrite-get-document', colId, docId],
  { revalidate: 86400, tags: ['appwrite-proxy', colId, 'products', `appwrite-proxy-${colId}`] }
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

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    // Si la colección no existe devolver 404 limpio (no 500), así el cliente
    // puede detectarlo y silenciarse sin generar alertas innecesarias.
    const is404 = error?.code === 404 || error?.message?.includes('could not be found') || error?.type === 'collection_not_found';
    if (is404) {
      return NextResponse.json({ error: 'Collection not found', code: 404 }, { status: 404 });
    }
    console.error('[appwrite-proxy] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

