import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments, serverUpdateDocument, serverGetDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { sendWhatsAppMessage, formatWhatsAppPhone, addToHistory } from '@/lib/whatsapp';

const CRON_SECRET = process.env.CRON_SECRET || 'negotiation_secret_key_2026';
const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kevincocochile.cl';
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBFSkLS9QYq66R7rD9Tyhz1sU3yuMSdaUo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const targetOrderId = searchParams.get('orderId');

    // Security check
    if (secret !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch orders in negotiation
    let activeOrders: any[] = [];
    if (targetOrderId) {
      try {
        const singleOrder = await serverGetDocument(ORDERS_COLLECTION_ID, targetOrderId);
        activeOrders = [singleOrder];
      } catch (e) {
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
      }
    } else {
      const qStatus = JSON.stringify({ method: 'equal', attribute: 'STATUS', values: ['negotiation'] });
      const qLimit = JSON.stringify({ method: 'limit', values: [100] });
      const resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [qStatus, qLimit]);
      activeOrders = resOrders.documents || [];
    }

    const processedOrders: string[] = [];

    for (const order of activeOrders) {
      const orderId = order.$id;
      const orderCode = order.ORDERCODE || String(orderId).slice(-6).toUpperCase();
      const adminNotes = (order.adminNotes as string) || '';

      // Skip if already notified by WA (only during automatic cron scan, not manual trigger)
      if (!targetOrderId && adminNotes.includes('[negot_wa_notified]')) {
        continue;
      }

      // Parse order items
      let items: any[] = [];
      try {
        items = JSON.parse((order.ITEMS as string) || '[]');
      } catch (e) {
        console.error(`Error parsing ITEMS for order ${orderCode}:`, e);
        continue;
      }

      const missingItems = items.filter(it => it.missing === true);
      if (missingItems.length === 0) {
        continue;
      }

      // 2. Find similar products for each missing item
      const missingDetails: string[] = [];
      const suggestionsTextList: string[] = [];

      for (const item of missingItems) {
        missingDetails.push(`- ${item.name} (${item.qty} uds)`);

        // Find product to get category
        let categoryId = '';
        let itemPrice = item.price || 0;
        if (item.id) {
          try {
            const prod = await serverGetDocument(PRODUCTS_COLLECTION_ID, item.id);
            categoryId = (prod as any).CATEGORYID || '';
            itemPrice = (prod as any).CURRENTPRICE || (prod as any).PRICE || itemPrice;
          } catch (e) {
            console.warn(`Could not fetch details for missing product ${item.id}:`, e);
          }
        }

        // List products in category
        let categoryProds: any[] = [];
        if (categoryId) {
          try {
            const qCat = JSON.stringify({ method: 'equal', attribute: 'CATEGORYID', values: [categoryId] });
            const qLimit50 = JSON.stringify({ method: 'limit', values: [50] });
            const resProds = await serverListDocuments(PRODUCTS_COLLECTION_ID, [qCat, qLimit50]);
            categoryProds = resProds.documents || [];
          } catch (e) {
            console.error(`Error loading category products for category ${categoryId}:`, e);
          }
        }

        // Filter similar products
        const similar = categoryProds.filter((p: any) => {
          if (p.$id === item.id) return false;
          const stock = p.STOCK ?? 0;
          if (stock <= 0 || stock === 99999) return false; // must have real stock
          const price = p.CURRENTPRICE || p.PRICE || 0;
          
          // Comparar en base al precio original (antes del descuento) o al pagado
          const referencePrice = item.originalPrice || item.price || itemPrice || 0;
          if (referencePrice === 0) return true;

          const diffPct = Math.abs(price - referencePrice) / referencePrice;
          return diffPct <= 0.20; // margen del 20% solicitado
        });

        // Take top 2 suggestions
        const topSuggestions = similar.slice(0, 2);
        if (topSuggestions.length > 0) {
          const formattedItemPrice = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(item.price || 0);
          suggestionsTextList.push(`*Reemplazos sugeridos para ${item.name} (que compraste a ${formattedItemPrice}):*`);
          
          const originalPrice = item.originalPrice;
          const pricePaid = item.price;
          const hasDiscount = originalPrice && originalPrice > pricePaid;

          topSuggestions.forEach((p: any) => {
            let basePrice = p.CURRENTPRICE || p.PRICE || 0;
            const formattedBase = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(basePrice);
            const formattedPaid = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(pricePaid);

            if (hasDiscount) {
              suggestionsTextList.push(`  • ${p.NAME} (Valor normal: ${formattedBase} ➡️ Te lo respetamos al mismo precio con descuento: ${formattedPaid})`);
            } else {
              suggestionsTextList.push(`  • ${p.NAME} (${formattedBase})`);
            }
          });
        }
      }

      // 3. Compose WhatsApp message (Greeting only, wait for response)
      const customerName = order.CUSTOMERNAME || 'Amiga';
      const firstName = customerName.split(' ')[0];
      const messageText = `¡Hola linda, *${firstName}*! ✨ ¿Cómo estás? Te escribimos de *Kevin&Coco* por tu pedidito *#${orderCode}* 🛍️.`;

      // 4. Send message to WhatsApp
      const rawPhone = (order.CUSTOMERPHONE as string) || '';
      const formattedPhone = formatWhatsAppPhone(rawPhone);

      if (formattedPhone && WA_TOKEN) {
        try {
          // If manually triggered (targetOrderId is present), send order details first
          if (targetOrderId) {
            const formattedTotal = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.TOTAL || 0);
            const detailsMsg = `📄 *Detalles de tu pedido #${orderCode}:*\n• *Cliente:* ${order.CUSTOMERNAME}\n• *Teléfono:* ${order.CUSTOMERPHONE || 'No especificado'}\n• *Dirección:* ${order.ADDRESS || 'No especificada'}${order.COMUNA ? `, ${order.COMUNA}` : ''}${order.REGION ? `, ${order.REGION}` : ''}\n• *Envío:* ${order.SHIPPINGAGENCY || 'No especificado'}\n• *Total:* ${formattedTotal}`;
            
            await sendWhatsAppMessage(formattedPhone, detailsMsg, WA_TOKEN);
            await addToHistory(formattedPhone, 'assistant', detailsMsg);
            
            // Wait 1 second before sending the second message to ensure correct ordering on WhatsApp
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          await sendWhatsAppMessage(formattedPhone, messageText, WA_TOKEN);
          await addToHistory(formattedPhone, 'assistant', messageText);
          console.log(`[Cron Negotiation] WhatsApp sent successfully to ${formattedPhone} for order ${orderCode}`);
          
          // 5. Update order notes to mark as notified
          const timestamp = new Date().toISOString().slice(0, 10);
          const updatedNotes = adminNotes 
            ? `${adminNotes}\n[negot_wa_notified: ${timestamp}]`
            : `[negot_wa_notified: ${timestamp}]`;

          await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
            adminNotes: updatedNotes,
            UPDATEDAT: Date.now()
          });

          processedOrders.push(orderCode);
        } catch (sendErr: any) {
          console.error(`[Cron Negotiation] Failed to send WhatsApp/update order for ${orderCode}:`, sendErr);
        }
      } else {
        console.warn(`[Cron Negotiation] Could not send message to order ${orderCode}: phone is invalid (${rawPhone}) or WA_TOKEN is missing.`);
      }
    }

    return NextResponse.json({
      status: 'ok',
      processed: processedOrders,
      total_found: activeOrders.length
    });

  } catch (err: any) {
    console.error('[Cron Negotiation] Route crash:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
