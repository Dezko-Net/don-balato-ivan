import { NextRequest, NextResponse } from 'next/server';
import { serverGetDocument, serverUpdateDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { deductStockForOrder, restoreStockForOrder } from '@/lib/order-stock-service';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

const CONFIRMED_STATUSES = ['paid', 'payment_review', 'payment_confirmed', 'processing', 'shipped', 'delivered'];
const UNCONFIRMED_STATUSES = ['pending', 'pending_stock'];

export async function POST(req: NextRequest) {
  try {
    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'orderId y newStatus son requeridos' }, { status: 400 });
    }

    const order = await serverGetDocument(ORDERS_COLLECTION_ID, orderId) as any;
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const prevStatus = order.STATUS;

    // Validate: cannot set to "delivered" without shipping proof photo or tracking number
    if (newStatus === 'delivered') {
      const hasShippingProof = !!order.SHIPPINGPROOFURL;
      const hasTrackingNumber = !!(order as any).TRACKINGNUMBER;
      if (!hasShippingProof && !hasTrackingNumber) {
        return NextResponse.json({
          error: 'Para marcar como "Entregado a Agencia" necesitas subir una foto del comprobante de envío o ingresar el número de seguimiento.',
        }, { status: 400 });
      }
    }

    // Actualizar estado del pedido en Appwrite
    await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
      STATUS: newStatus,
      UPDATEDAT: Date.now(),
    });

    let stockUpdated = false;

    // Caso A: Transición de no-confirmado (pending) a confirmado (paid, payment_confirmed, etc.) -> Descontar stock
    if (UNCONFIRMED_STATUSES.includes(prevStatus) && CONFIRMED_STATUSES.includes(newStatus)) {
      stockUpdated = await deductStockForOrder(orderId, order.ITEMS);
    }
    // Caso B: Transición de confirmado a cancelado (cancelled) -> Restituir stock
    else if (CONFIRMED_STATUSES.includes(prevStatus) && newStatus === 'cancelled') {
      stockUpdated = await restoreStockForOrder(orderId, order.ITEMS);
    }

    try { revalidateTag('orders'); } catch {}
    try { revalidateTag('products'); } catch {}

    // Send WhatsApp notification to customer about status change (server-side)
    if (prevStatus !== newStatus) {
      try {
        const { notifyOrderStatusChange } = await import('@/services/notificationService');
        // Fetch the updated order to pass to notification (with new status)
        const updatedOrder = await serverGetDocument(ORDERS_COLLECTION_ID, orderId) as any;
        await notifyOrderStatusChange(updatedOrder, prevStatus, newStatus);
      } catch (notifErr) {
        console.warn('[update-status] WhatsApp notification failed:', notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      prevStatus,
      newStatus,
      stockUpdated,
    });
  } catch (error: any) {
    console.error('[API admin/orders/update-status] Error:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}
