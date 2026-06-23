import { NextRequest, NextResponse } from 'next/server';
import { notifyOrderStatusChange } from '@/services/notificationService';
import { notifyNewOrder } from '@/lib/notify-admin';
import type { Order } from '@/types/admin';

export async function POST(req: NextRequest) {
  try {
    const events = req.headers.get('x-appwrite-webhook-events') || '';
    const body = await req.json() as Order;

    console.log('[Webhook Orders] Event:', events, '| Order ID:', body.$id);

    // Identificar si es creación
    const isCreate = events.includes('.create');

    if (isCreate) {
      // 1. Notificar al Cliente
      // Forzamos el envío de WhatsApp llamando a notifyOrderStatusChange
      // Pasamos 'undefined' como oldStatus para asegurarnos de que lo tome como nuevo
      await notifyOrderStatusChange(body, undefined, body.STATUS);

      // 2. Notificar al Admin
      // El usuario pidió NO notificar al admin si está en pendiente, solo si está pagado u otros
      if (body.STATUS !== 'pending') {
        const itemsCount = body.ITEMS ? Object.keys(body.ITEMS).length : 0;
        await notifyNewOrder(body.ORDERCODE || body.$id, body.CUSTOMERNAME || 'Cliente', body.TOTAL || 0, itemsCount);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Webhook Orders] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
