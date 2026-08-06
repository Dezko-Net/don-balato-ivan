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

      // Notify customer
      const customerPhone = String(order.CUSTOMERPHONE || '').replace(/\D/g, '');
      const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
      if (customerPhone && WA_TOKEN) {
        const cancelMsg = `¡Hola! 🐾 Lamento informarte que no tenemos stock de los productos de tu pedido *#${orderCode}* en este momento. 🥺\n\nSi quieres, puedes hacer un nuevo pedido con otros productos y con gusto te ayudo. ¡Este gato siempre trae buena suerte! 🐾✨`;
        try {
          await sendWhatsAppMessage(customerPhone, cancelMsg, WA_TOKEN);
          await addToHistory(`+${customerPhone}`, 'assistant', cancelMsg, `stockcancel-${Date.now()}`);
        } catch (e) {
          console.error('[confirm-stock] Error sending cancel msg:', e);
        }
      }

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
    const customerPhone = String(order.CUSTOMERPHONE || '').replace(/\D/g, '');
    const customerName = String(order.CUSTOMERNAME || '').split(' ')[0] || 'amigo';
    const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

    if (customerPhone && WA_TOKEN) {
      try {
        let customerMsg = '';

        if (unavailableItems.length === 0) {
          // Todo tiene stock
          customerMsg = `¡Hola ${customerName}! 🐾 ¡Buenas noticias! Confirmamos el stock de tu pedido *#${orderCode}*. Todo está disponible. ✅\n\n`;
        } else {
          // Faltan algunos productos - mostrar nueva cotización
          const removedList = unavailableItems.map(i => `❌ ${i.qty}x ${i.name}`).join('\n');
          customerMsg = `¡Hola ${customerName}! 🐾 Confirmamos el stock de tu pedido *#${orderCode}* con algunos cambios:\n\n`;
          customerMsg += `*Productos no disponibles:*\n${removedList}\n\n`;
          customerMsg += `*Tu nuevo pedido:*\n`;
          availableItems.forEach(i => {
            customerMsg += `✅ ${i.qty}x ${i.name} - $${(i.price * i.qty).toLocaleString('es-CL')}\n`;
          });
          customerMsg += `\n*Nuevo total: $${subtotal.toLocaleString('es-CL')}*\n\n`;
        }

        customerMsg += `Para continuar, haz la transferencia:\n\n💳 *Datos para la transferencia:*\nTitular: DON BALATO IVAN\nRUT: 78.267.426-9\nBanco: Mercado Pago (Cuenta Vista)\nCuenta: 1037879898\nEmail: donbalatosoporte@gmail.com\n\nMonto total: $${subtotal.toLocaleString('es-CL')}\n\nCuando transfieras, mándame la *foto del comprobante* por aquí. 📸`;

        await sendWhatsAppMessage(customerPhone, customerMsg, WA_TOKEN);
        await addToHistory(`+${customerPhone}`, 'assistant', customerMsg, `stockok-${Date.now()}`);

        // Update Balatin flow step to awaiting_payment
        await recordKeniaUsage(`+${customerPhone}`, {
          balatinStep: 'awaiting_payment',
          balatinComprobanteReceived: false,
        });

        // Avisar a Lissy que ya se le avisó al cliente
        const STOCK_VERIFIER_PHONE = '56962293893';
        const lissyMsg = unavailableItems.length === 0
          ? `✅ Stock confirmado para el pedido #${orderCode}. Ya le avisé al cliente con los datos de pago.`
          : `✅ Stock confirmado para el pedido #${orderCode} (sin ${unavailableItems.length} producto(s)). Ya le envié la nueva cotización al cliente.`;
        await sendWhatsAppMessage(STOCK_VERIFIER_PHONE, lissyMsg, WA_TOKEN);

      } catch (e) {
        console.error('[confirm-stock] Error sending customer notification:', e);
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
