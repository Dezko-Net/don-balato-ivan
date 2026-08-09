import { NextRequest, NextResponse } from 'next/server';
import { serverGetDocument, serverUpdateDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { restoreStockForOrder } from '@/lib/order-stock-service';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

// POST: Cancelar un pedido pendiente (sin nombre/teléfono) y restaurar stock
export async function POST(req: NextRequest) {
  try {
    const { orderCode } = await req.json();

    if (!orderCode) {
      return NextResponse.json({ error: 'Falta orderCode' }, { status: 400 });
    }

    // Buscar el pedido por ORDERCODE
    const { serverListDocuments } = await import('@/lib/appwrite-server');
    const qEqual = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [orderCode] });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qEqual, qLimit1]);

    if (!res.documents || res.documents.length === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const order = res.documents[0] as any;

    // Solo cancelar si está en estado pendiente (sin avanzar)
    const CANCELABLE = ['pending', 'pending_stock', 'processing'];
    if (!CANCELABLE.includes(order.STATUS)) {
      return NextResponse.json({
        error: 'El pedido ya avanzó, no se puede cancelar',
        status: order.STATUS,
      }, { status: 400 });
    }

    // Solo cancelar si no tiene nombre ni teléfono (pedido sin contactar)
    if (order.CUSTOMERNAME && order.CUSTOMERPHONE) {
      return NextResponse.json({
        error: 'El pedido ya tiene datos del cliente',
      }, { status: 400 });
    }

    // Restaurar stock
    await restoreStockForOrder(order.$id, order.ITEMS).catch((err) => {
      console.error('[cancel-pending] Error al restaurar stock:', err);
    });

    // Marcar como cancelado
    await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
      STATUS: 'cancelled',
      UPDATEDAT: Date.now(),
    });

    try { revalidateTag('products'); } catch {}
    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({ success: true, orderId: order.$id });
  } catch (error: any) {
    console.error('[API cancel-pending] Error:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}
