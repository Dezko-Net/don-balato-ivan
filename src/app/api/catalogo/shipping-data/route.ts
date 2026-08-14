import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { serverListDocuments, serverUpdateDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID, VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderCode, customerName, customerRut, customerEmail, region, comuna, address, additionalInfo, shippingAgency } = body as {
      orderCode: string;
      customerName?: string;
      customerRut?: string;
      customerEmail?: string;
      region: string;
      comuna: string;
      address: string;
      additionalInfo?: string;
      shippingAgency?: string;
    };

    if (!orderCode || !region || !comuna || !address) {
      return NextResponse.json({ error: 'Faltan datos de envío' }, { status: 400 });
    }

    const qEqual = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [orderCode] });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
    let collectionId = ORDERS_COLLECTION_ID;
    let res = await serverListDocuments(collectionId, [qEqual, qLimit1]);
    if (!res.documents || res.documents.length === 0) {
      collectionId = VENDOR_ORDERS_COLLECTION_ID;
      res = await serverListDocuments(collectionId, [qEqual, qLimit1]);
    }
    if (!res.documents || res.documents.length === 0) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const order = res.documents[0] as any;

    const customerFields = {
      ...(customerName?.trim() ? { CUSTOMERNAME: customerName.trim() } : {}),
      ...(customerRut?.trim() ? { CUSTOMERRUT: customerRut.trim() } : {}),
      ...(customerEmail?.trim() ? { CUSTOMEREMAIL: customerEmail.trim() } : {}),
    };
    // Nunca degradar payment_review a processing: el comprobante ya fue enviado.
    // Para vendor_orders: pending → payment_review si ya subió comprobante, sino mantener pending.
    const isVendorOrder = collectionId === VENDOR_ORDERS_COLLECTION_ID;
    const nextStatus = order.STATUS === 'payment_review' || order.PAYMENTPROOFURL
      ? 'payment_review'
      : isVendorOrder ? order.STATUS : 'processing';
    await serverUpdateDocument(collectionId, order.$id, {
      ...customerFields,
      REGION: region,
      COMUNA: comuna,
      ADDRESS: address,
      ADDITIONALINFO: additionalInfo || '',
      SHIPPINGAGENCY: shippingAgency || '',
      STATUS: nextStatus,
      UPDATEDAT: Date.now(),
    });

    // Invalidar la caché del badge "Pagar tu pedido" (my-orders-status).
    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({ success: true }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/shipping-data] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al guardar datos de envío' }, { status: 500 });
  }
}
