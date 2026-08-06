import { NextResponse } from 'next/server';
import { serverListDocuments } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID, WHOLESALE_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

const CACHE_TTL = 30_000; // 30 segundos
const globalCache = (globalThis as any)._adminBadgesCache || { data: null, ts: 0 };
if (!(globalThis as any)._adminBadgesCache) {
  (globalThis as any)._adminBadgesCache = globalCache;
}

export async function GET() {
  try {
    const now = Date.now();
    if (globalCache.data && now - globalCache.ts < CACHE_TTL) {
      return NextResponse.json(globalCache.data, {
        headers: { 'Cache-Control': 'private, max-age=30' }
      });
    }

    const qPendingOrders = JSON.stringify({ method: 'equal', attribute: 'STATUS', values: ['pending'] });
    const qProcessingOrders = JSON.stringify({ method: 'equal', attribute: 'STATUS', values: ['processing'] });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });

    const [ordersPending, ordersProcessing, wholesalePending] = await Promise.all([
      serverListDocuments(ORDERS_COLLECTION_ID, [qPendingOrders, qLimit1]),
      serverListDocuments(ORDERS_COLLECTION_ID, [qProcessingOrders, qLimit1]),
      serverListDocuments(WHOLESALE_ORDERS_COLLECTION_ID, [qPendingOrders, qLimit1]),
    ]).catch(() => [{ total: 0 }, { total: 0 }, { total: 0 }]); // Fallback si Appwrite falla

    const data = {
      pendingOrders: ordersPending.total,
      processingOrders: ordersProcessing.total,
      pendingWholesale: wholesalePending.total,
      pendingRequests: 0,
      pendingAlerts: 0,
    };

    globalCache.data = data;
    globalCache.ts = now;

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'private, max-age=30' }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

