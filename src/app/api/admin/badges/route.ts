import { NextResponse } from 'next/server';
import { serverListDocuments } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID, WHOLESALE_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

export async function GET() {
  try {
    const qPendingOrders = JSON.stringify({ method: 'equal', attribute: 'STATUS', values: ['pending'] });
    const qProcessingOrders = JSON.stringify({ method: 'equal', attribute: 'STATUS', values: ['processing'] });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });

    const [ordersPending, ordersProcessing, wholesalePending] = await Promise.all([
      serverListDocuments(ORDERS_COLLECTION_ID, [qPendingOrders, qLimit1]),
      serverListDocuments(ORDERS_COLLECTION_ID, [qProcessingOrders, qLimit1]),
      serverListDocuments(WHOLESALE_ORDERS_COLLECTION_ID, [qPendingOrders, qLimit1]),
    ]);

    return NextResponse.json({
      pendingOrders: ordersPending.total,
      processingOrders: ordersProcessing.total,
      unreadNotifs: 0,
      pendingWholesale: wholesalePending.total,
      pendingRequests: 0,
      pendingAlerts: 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
