import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments, serverUpdateDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderCode, region, comuna, address, additionalInfo, shippingAgency } = body as {
      orderCode: string;
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
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qEqual, qLimit1]);

    if (!res.documents || res.documents.length === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const order = res.documents[0] as any;

    await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
      REGION: region,
      COMUNA: comuna,
      ADDRESS: address,
      ADDITIONALINFO: additionalInfo || '',
      SHIPPINGAGENCY: shippingAgency || '',
      STATUS: 'processing',
      UPDATEDAT: Date.now(),
    });

    return NextResponse.json({ success: true }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/shipping-data] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al guardar datos de envío' }, { status: 500 });
  }
}
