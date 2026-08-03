import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

const q = (method: string, attribute: string, values: any[]) =>
  JSON.stringify({ method, attribute, values });

const STATUS_FILTER = q('equal', 'STATUS', [
  'paid', 'payment_review', 'payment_confirmed',
  'shipped', 'delivered'
]);
const ORDER_DESC = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
// Pedimos unos cuantos por si hay varios de distintos estados, pero limitamos a 5 para no gastar lecturas
const LIMIT_5 = JSON.stringify({ method: 'limit', values: [5] });

// Caché en memoria súper rápida para evitar los bugs de unstable_cache en Next.js
const CACHE_TTL = 300_000; // 5 minutos
const globalCache = (globalThis as any)._myOrdersStatusCache || new Map<string, { data: any, ts: number }>();
if (!(globalThis as any)._myOrdersStatusCache) {
  (globalThis as any)._myOrdersStatusCache = globalCache;
}

const EMPTY = { count: 0, firstOrderId: null, firstOrderStatus: null, firstUpdatedAt: null, shippedCount: 0, shippedOrderId: null, shippedStatus: null, shippedUpdatedAt: null };

async function fetchOrdersForUser(userId: string, email: string) {
  // Intentos de búsqueda: 1) USERID, 2) CUSTOMEREMAIL, 3) userId minúscula
  let docs: any[] = [];
  let res = await serverListDocuments(ORDERS_COLLECTION_ID, [
    q('equal', 'USERID', [userId]), STATUS_FILTER, ORDER_DESC, LIMIT_5,
  ]).catch(() => ({ documents: [], total: 0 }));

  if (res.total === 0 && email) {
    res = await serverListDocuments(ORDERS_COLLECTION_ID, [
      q('equal', 'CUSTOMEREMAIL', [email]), STATUS_FILTER, ORDER_DESC, LIMIT_5,
    ]).catch(() => ({ documents: [], total: 0 }));
  }

  if (res.total === 0) {
    res = await serverListDocuments(ORDERS_COLLECTION_ID, [
      q('equal', 'userId', [userId]), STATUS_FILTER, ORDER_DESC, LIMIT_5,
    ]).catch(() => ({ documents: [], total: 0 }));
  }

  docs = res.documents || [];

  // Separar en JS los estados para evitar duplicar las llamadas a Appwrite
  const paidDocs = docs.filter(d => ['paid', 'payment_review', 'payment_confirmed'].includes(d.STATUS));
  const shippedDocs = docs.filter(d => ['shipped', 'delivered'].includes(d.STATUS));

  return {
    count: paidDocs.length, // O res.total si supiéramos, pero limitamos a 5. El hook solo necesita saber si hay > 0
    firstOrderId: paidDocs[0]?.$id ?? null,
    firstOrderStatus: paidDocs[0]?.STATUS ?? null,
    firstUpdatedAt: paidDocs[0]?.UPDATEDAT ?? null,
    shippedCount: shippedDocs.length,
    shippedOrderId: shippedDocs[0]?.$id ?? null,
    shippedStatus: shippedDocs[0]?.STATUS ?? null,
    shippedUpdatedAt: shippedDocs[0]?.UPDATEDAT ?? null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    const email = request.nextUrl.searchParams.get('email') || '';
    if (!userId) return NextResponse.json(EMPTY);

    const cacheKey = `${userId}:::${email}`;
    const now = Date.now();
    const cached = globalCache.get(cacheKey);

    if (cached && now - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'private, max-age=300' },
      });
    }

    const data = await fetchOrdersForUser(userId, email);
    globalCache.set(cacheKey, { data, ts: now });

    // Limpiar caché vieja aleatoriamente (10% prob) para evitar fugas de memoria
    if (Math.random() < 0.1) {
      for (const [k, v] of globalCache.entries()) {
        if (now - v.ts > CACHE_TTL) globalCache.delete(k);
      }
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch (error: any) {
    console.error('[API public-data/my-orders-status] Error:', error);
    return NextResponse.json(EMPTY);
  }
}
