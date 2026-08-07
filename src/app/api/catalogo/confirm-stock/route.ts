import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { serverListDocuments, serverUpdateDocument, serverGetDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

import { deductStockForOrder } from '@/lib/order-stock-service';
import { sendWhatsAppMessage, addToHistory } from '@/lib/whatsapp';
import { recordKeniaUsage } from '@/lib/kenia-runtime';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderCode, items } = body as {
      orderCode: string;
      items: Array<{ sku: string; name: string; qty: number; price: number; available: boolean }>;
    };

    if (!orderCode || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Find order by ORDERCODE
    const qEqual = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [orderCode] });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qEqual, qLimit1]);

    if (!res.documents || res.documents.length === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const order = res.documents[0] as any;

    // Filter only available items and recalculate totals
    const availableItems = items.filter(i => i.available);
    const unavailableItems = items.filter(i => !i.available);
    const itemsData = availableItems.map(i => ({
      sku: i.sku,
      name: i.name,
      qty: i.qty,
      price: i.price,
      total: i.price * i.qty,
    }));

    const subtotal = availableItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    // If no items available, mark as cancelled
    if (availableItems.length === 0) {
      await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
        STATUS: 'cancelled',
        UPDATEDAT: Date.now(),
      });

      // No hay stock de ningun producto — la cajera se encarga de avisar al cliente
      // (no se manda mensaje automatico de Balatin)

      return NextResponse.json({ success: true, availableItems: [], subtotal: 0, cancelled: true });
    }

    await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
      ITEMS: JSON.stringify(itemsData),
      SUBTOTAL: subtotal,
      TOTAL: subtotal,
      STATUS: 'paid',
      UPDATEDAT: Date.now(),
    });

    // Descontar inventario real en Appwrite Cloud
    await deductStockForOrder(order.$id, availableItems).catch((err) => {
      console.error('[confirm-stock] Error al descontar stock:', err);
    });

    // ── Avisar al cliente del resultado de la confirmación de stock ──
    // NO se envia mensaje automatico de Balatin al cliente. La cajera se encarga
    // de notificar manualmente via el boton "Notificar" en /admin/orders o via
    // el link wa.me que genera la pagina verificar-stock.
    const customerPhone = String(order.CUSTOMERPHONE || '').replace(/\D/g, '');
    const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

    if (customerPhone && WA_TOKEN) {
      try {
        // Solo actualizar el estado del flow de Balatin (sin mandar mensaje)
        await recordKeniaUsage(`+${customerPhone}`, {
          balatinStep: 'awaiting_payment',
          balatinComprobanteReceived: false,
        });

        // Avisar a Lissy que se confirmo el stock (interno, no al cliente)
        const STOCK_VERIFIER_PHONE = '56962293893';
        const lissyMsg = unavailableItems.length === 0
          ? `Stock confirmado para el pedido #${orderCode}. La cajera debe notificar al cliente con los datos de pago.`
          : `Stock confirmado para el pedido #${orderCode} (sin ${unavailableItems.length} producto(s)). La cajera debe enviar la nueva cotizacion al cliente.`;
        await sendWhatsAppMessage(STOCK_VERIFIER_PHONE, lissyMsg, WA_TOKEN);

      } catch (e) {
        console.error('[confirm-stock] Error updating kenia/lissy:', e);
      }
    }

    // Invalidar la caché del badge "Pagar tu pedido" (my-orders-status).
    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({
      success: true,
      availableItems: itemsData,
      subtotal,
    }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/confirm-stock] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al confirmar stock' }, { status: 500 });
  }
}
