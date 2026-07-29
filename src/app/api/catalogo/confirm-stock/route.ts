import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments, serverUpdateDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

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
    const itemsData = availableItems.map(i => ({
      sku: i.sku,
      name: i.name,
      qty: i.qty,
      price: i.price,
      total: i.price * i.qty,
    }));

    const subtotal = availableItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
      ITEMS: JSON.stringify(itemsData),
      SUBTOTAL: subtotal,
      TOTAL: subtotal,
      STATUS: 'stock_confirmed',
      UPDATEDAT: Date.now(),
    });

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
