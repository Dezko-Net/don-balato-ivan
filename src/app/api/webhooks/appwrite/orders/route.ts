import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 60;
import { notifyOrderStatusChange } from '@/services/notificationService';
import { notifyNewOrder } from '@/lib/notify-admin';
import type { Order } from '@/types/admin';

export async function POST(req: NextRequest) {
  try {
    const events = req.headers.get('x-appwrite-webhook-events') || '';
    const body = await req.json() as Order;

    console.log('[Webhook Orders] Event:', events, '| Order ID:', body.$id);

    // Identificar tipo de evento
    const isCreate = events.includes('.create');
    const isUpdate = events.includes('.update');

    if (isCreate || isUpdate) {
      // 1. Notificar al Cliente
      // 'existsByRefKey' adentro de la función previene envíos duplicados para el mismo estado
      await notifyOrderStatusChange(body, undefined, body.STATUS);

      // 2. Notificar al Admin
      // El usuario pidió NO notificar al admin si está en pendiente, solo si está pagado u otros
      if (isCreate && body.STATUS !== 'pending') {
        const itemsCount = body.ITEMS ? Object.keys(body.ITEMS).length : 0;
        await notifyNewOrder(body.ORDERCODE || body.$id, body.CUSTOMERNAME || 'Cliente', body.TOTAL || 0, itemsCount);
      } else if (isUpdate && body.STATUS === 'paid') {
        // Notificar al admin cuando un pedido cambia a pagado
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
