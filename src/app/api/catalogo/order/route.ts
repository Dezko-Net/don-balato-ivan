import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { serverListDocuments, serverCreateDocument } from '@/lib/appwrite-server';
import { isNightNow } from '@/lib/night-mode';
import { deductStockForOrder } from '@/lib/order-stock-service';
import { sendWhatsAppMessage, sendWhatsAppTemplate } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Falta código de pedido' }, { status: 400 });
    }

    const qEqual = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [code] });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qEqual, qLimit1]);

    if (!res.documents || res.documents.length === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ order: res.documents[0] }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/order GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al obtener pedido' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, items, total, assignedCashier } = body as {
      customerName: string;
      customerPhone: string;
      items: Array<{ id?: string; sku: string; name: string; qty: number; price: number; image?: string }>;
      total: number;
      assignedCashier?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Faltan datos del pedido' }, { status: 400 });
    }

    const now = Date.now();
    const reqCode = `WA-${String(now).slice(-8)}`;

    const itemsData = items.map(i => ({
      id: i.id || '',
      sku: i.sku || '',
      name: i.name,
      qty: i.qty,
      price: i.price,
      total: i.price * i.qty,
      img: i.image || '',
    }));

    // Get next order index
    let orderIndex = now;
    try {
      const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: 'ORDERINDEX' });
      const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
      const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qLimit1]);
      if (res.documents && res.documents.length > 0) {
        const doc = res.documents[0] as Record<string, unknown>;
        orderIndex = ((doc.ORDERINDEX as number) || res.total || 0) + 1;
      }
    } catch {}

    const night = isNightNow();
    const docId = `wa_${now}_${Math.random().toString(36).slice(2, 10)}`;

    const doc = await serverCreateDocument(ORDERS_COLLECTION_ID, docId, {
      USERID: 'catalogo-guest',
      ITEMS: JSON.stringify(itemsData),
      CUSTOMERNAME: customerName,
      CUSTOMERPHONE: customerPhone || '',
      CUSTOMEREMAIL: '',
      ORDERCODE: reqCode,
      ORDERINDEX: orderIndex,
      SUBTOTAL: total,
      TOTAL: total,
      STATUS: night ? 'pending_stock' : 'processing',
      CREATEDAT: now,
      PAYMENTMETHOD: 'WhatsApp',
      SHIPPINGAGENCY: '',
      REGION: '',
      COMUNA: '',
      ADDRESS: '',
      ...(night ? { NIGHTORDER: true } : {}),
      ...(assignedCashier ? { ASSIGNEDCASHIER: assignedCashier } : {}),
    });

    await deductStockForOrder(docId, itemsData).catch((err) => {
      console.error('[catalogo/order] Error al descontar stock en pedido:', err);
    });

    // ── Enviar plantilla + link de verificar stock a la cajera asignada ──
    if (assignedCashier && assignedCashier !== 'Balatin') {
      try {
        const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.donbalatomayorista.cl';
        const STOCK_VERIFIER_PHONE = '56962293893'; // Lissy

        const verifyLink = `${SITE_URL}/verificar-stock?code=${reqCode}`;

        // Enviar plantilla alerta_pago_admin
        const components = [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: String(reqCode) },
              { type: 'text', text: customerName || '(pendiente de nombre)' },
            ]
          }
        ];
        await sendWhatsAppTemplate(STOCK_VERIFIER_PHONE, 'alerta_pago_admin', 'es_CL', components, WA_TOKEN);

        // Enviar link de verificar stock como segundo mensaje
        const linkMsg = `📦 *PEDIDO NUEVO* #${reqCode}\n\nCliente: ${customerName || '(pendiente)'}\nCajera asignada: ${assignedCashier}\n\n🔗 Confirma el stock aquí:\n${verifyLink}`;
        await sendWhatsAppMessage(STOCK_VERIFIER_PHONE, linkMsg, WA_TOKEN);

        console.log('[catalogo/order] Plantilla + link enviados a cajera:', STOCK_VERIFIER_PHONE);
      } catch (tplErr) {
        console.error('[catalogo/order] Error enviando plantilla a cajera:', tplErr);
      }
    }

    try { revalidateTag('products'); } catch {}
    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({
      success: true,
      orderId: (doc as Record<string, unknown>).$id as string,
      orderCode: reqCode,
    }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/order] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al crear pedido' }, { status: 500 });
  }
}
