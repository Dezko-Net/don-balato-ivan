import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig } from '@/lib/appwrite';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { serverListDocuments } from '@/lib/appwrite-server';
import { ID } from 'appwrite';
import { isNightNow } from '@/lib/night-mode';

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

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

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
      const { Query } = await import('appwrite');
      const res = await databases.listDocuments(databaseId, ORDERS_COLLECTION_ID, [
        Query.orderDesc('ORDERINDEX'),
        Query.limit(1)
      ]);
      if (res.documents.length > 0) {
        orderIndex = (res.documents[0].ORDERINDEX || res.total || 0) + 1;
      }
    } catch {}

    const night = isNightNow();

    const doc = await databases.createDocument(databaseId, ORDERS_COLLECTION_ID, ID.unique(), {
      USERID: 'catalogo-guest',
      ITEMS: JSON.stringify(itemsData),
      CUSTOMERNAME: customerName,
      CUSTOMERPHONE: customerPhone || '',
      CUSTOMEREMAIL: '',
      ORDERCODE: reqCode,
      ORDERINDEX: orderIndex,
      SUBTOTAL: total,
      TOTAL: total,
      STATUS: night ? 'paid' : 'processing',
      CREATEDAT: now,
      PAYMENTMETHOD: 'WhatsApp',
      SHIPPINGAGENCY: '',
      REGION: '',
      COMUNA: '',
      ADDRESS: '',
      ...(night ? { NIGHTORDER: true } : {}),
      ...(assignedCashier ? { ASSIGNEDCASHIER: assignedCashier } : {}),
    });

    return NextResponse.json({
      success: true,
      orderId: (doc as unknown as { $id: string }).$id,
      orderCode: reqCode,
    }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/order] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al crear pedido' }, { status: 500 });
  }
}
