import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { serverListDocuments } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

// Estado de los pedidos "esperando pago" del usuario (badge del nav móvil).
//
// Antes esto vivía en useStockConfirmedOrders con el SDK del NAVEGADOR: la
// colección 'orders' NO está en PUBLIC_CACHEABLE_COLLECTIONS, así que cada
// consulta iba directa a Appwrite sin pasar por unstable_cache, ni el proxy
// cacheado, ni el CDN. Con un poll de 60s y la cadena de 3 fallbacks, una sola
// pestaña logueada sin pedidos pagados quemaba ~4.300 lecturas/día.
//
// Ahora la consulta es server-side y cacheada 5 min por (userId, email).

const q = (method: string, attribute: string, values: any[]) =>
  JSON.stringify({ method, attribute, values });

const STATUS_FILTER = q('equal', 'STATUS', ['paid', 'payment_review', 'payment_confirmed']);
const SHIPPED_FILTER = q('equal', 'STATUS', ['shipped', 'delivered']);
const ORDER_DESC = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
// limit(1): solo se necesita el total y el primer pedido, no los 100 documentos.
// Appwrite cobra POR DOCUMENTO, así que el limit(100) anterior multiplicaba el coste.
const LIMIT_1 = JSON.stringify({ method: 'limit', values: [1] });

const getCachedOrdersStatus = (userId: string, email: string) => unstable_cache(
  async () => {
    // 1) Por USERID (caso normal: pedido hecho con sesión iniciada)
    let res = await serverListDocuments(ORDERS_COLLECTION_ID, [
      q('equal', 'USERID', [userId]), STATUS_FILTER, ORDER_DESC, LIMIT_1,
    ]).catch(() => ({ documents: [], total: 0 }));

    // 2) Fallback por CUSTOMEREMAIL (pedido hecho como invitado)
    if (res.total === 0 && email) {
      res = await serverListDocuments(ORDERS_COLLECTION_ID, [
        q('equal', 'CUSTOMEREMAIL', [email]), STATUS_FILTER, ORDER_DESC, LIMIT_1,
      ]).catch(() => ({ documents: [], total: 0 }));
    }

    // 3) Fallback por userId en minúsculas (esquema antiguo)
    if (res.total === 0) {
      res = await serverListDocuments(ORDERS_COLLECTION_ID, [
        q('equal', 'userId', [userId]), STATUS_FILTER, ORDER_DESC, LIMIT_1,
      ]).catch(() => ({ documents: [], total: 0 }));
    }

    const doc = res.documents[0] as any;

    // Consultar pedidos shipped/delivered (mismos fallbacks)
    let shipRes = await serverListDocuments(ORDERS_COLLECTION_ID, [
      q('equal', 'USERID', [userId]), SHIPPED_FILTER, ORDER_DESC, LIMIT_1,
    ]).catch(() => ({ documents: [], total: 0 }));

    if (shipRes.total === 0 && email) {
      shipRes = await serverListDocuments(ORDERS_COLLECTION_ID, [
        q('equal', 'CUSTOMEREMAIL', [email]), SHIPPED_FILTER, ORDER_DESC, LIMIT_1,
      ]).catch(() => ({ documents: [], total: 0 }));
    }

    if (shipRes.total === 0) {
      shipRes = await serverListDocuments(ORDERS_COLLECTION_ID, [
        q('equal', 'userId', [userId]), SHIPPED_FILTER, ORDER_DESC, LIMIT_1,
      ]).catch(() => ({ documents: [], total: 0 }));
    }

    const shipDoc = shipRes.documents[0] as any;

    return {
      count: res.total,
      firstOrderId: doc?.$id ?? null,
      firstOrderStatus: doc?.STATUS ?? null,
      firstUpdatedAt: doc?.UPDATEDAT ?? null,
      shippedCount: shipRes.total,
      shippedOrderId: shipDoc?.$id ?? null,
      shippedStatus: shipDoc?.STATUS ?? null,
      shippedUpdatedAt: shipDoc?.UPDATEDAT ?? null,
    };
  },
  ['my-orders-status-v2', userId, email],
  { revalidate: 300, tags: ['orders'] }
)();

const EMPTY = { count: 0, firstOrderId: null, firstOrderStatus: null, firstUpdatedAt: null, shippedCount: 0, shippedOrderId: null, shippedStatus: null, shippedUpdatedAt: null };

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    const email = request.nextUrl.searchParams.get('email') || '';
    if (!userId) return NextResponse.json(EMPTY);

    const data = await getCachedOrdersStatus(userId, email);
    return NextResponse.json(data, {
      // private: es información por usuario, no debe cachearse en el CDN compartido
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch (error: any) {
    console.error('[API public-data/my-orders-status] Error:', error);
    return NextResponse.json(EMPTY);
  }
}
