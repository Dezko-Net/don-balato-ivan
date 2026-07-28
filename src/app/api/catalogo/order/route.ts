import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig } from '@/lib/appwrite';
import { ID } from 'appwrite';

export const dynamic = 'force-dynamic';

const WHOLESALE_ORDERS_COLLECTION = 'wholesale_orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, items, total } = body as {
      customerName: string;
      customerPhone: string;
      items: Array<{ sku: string; name: string; qty: number; price: number }>;
      total: number;
    };

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Faltan datos del pedido' }, { status: 400 });
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const now = Date.now();
    const reqCode = `CAT-${String(now).slice(-8)}`;

    const itemsData = items.map(i => ({
      sku: i.sku,
      name: i.name,
      qty: i.qty,
      price: i.price,
      total: i.price * i.qty,
    }));

    const doc = await databases.createDocument(databaseId, WHOLESALE_ORDERS_COLLECTION, ID.unique(), {
      USERID: 'catalogo-guest',
      ITEMS: JSON.stringify(itemsData),
      CUSTOMERNAME: customerName,
      CUSTOMERPHONE: customerPhone,
      CUSTOMEREMAIL: '',
      SUBTOTAL: total,
      TOTAL: total,
      REQCODE: reqCode,
      STATUS: 'pending_stock',
      CREATEDAT: now,
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
