import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION, COUPONS_COLLECTION } from '@/lib/appwrite';
import { WHOLESALE_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { ID } from 'appwrite';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, orderId, isWholesale, items, remainingCredit } = body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'orderId and items required' }, { status: 400 });
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    const coll = isWholesale ? WHOLESALE_ORDERS_COLLECTION_ID : ORDERS_COLLECTION;

    // 1. Fetch the order
    const order: any = await databases.getDocument(databaseId, coll, orderId);
    if (order.STATUS !== 'negotiation') {
      return NextResponse.json({ error: 'Order is not in negotiation' }, { status: 400 });
    }

    // 2. Parse existing items
    let parsedItems: any[] = [];
    try { parsedItems = JSON.parse(order.ITEMS || '[]'); } catch {}

    // 3. Build replacement items
    const replacementItems = items.map((item: any) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      qty: item.qty,
      img: item.img,
      total: item.price * item.qty,
      sku: item.sku || '',
      replaced: true,
      isCanjeReplacement: true,
    }));

    // Mark missing items as replaced
    parsedItems = parsedItems.map((it: any) => {
      if (it.missing && !it.replaced) {
        return { ...it, replaced: true, replacedByCanje: true };
      }
      return it;
    });

    // Add replacement items
    parsedItems.push(...replacementItems);

    // Recalculate totals
    const newSubtotal = parsedItems.reduce((s, it) => s + (it.price * it.qty), 0);
    const newTotal = newSubtotal + (order.SHIPPINGCOST || 0) - (order.DISCOUNTAMOUNT || order.DISCOUNT || 0);

    // 4. Update the order
    await databases.updateDocument(databaseId, coll, orderId, {
      ITEMS: JSON.stringify(parsedItems),
      SUBTOTAL: newSubtotal,
      TOTAL: newTotal,
      STATUS: 'stock_confirmed',
      UPDATEDAT: Date.now(),
    });

    // 5. If there's remaining credit, create a coupon for next purchase
    let couponCode = null;
    if (remainingCredit > 0) {
      couponCode = `CANJE-${orderId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
      try {
        await databases.createDocument(databaseId, COUPONS_COLLECTION, ID.unique(), {
          code: couponCode,
          type: 'fixed',
          value: remainingCredit,
          isActive: true,
          userId: userId || '',
          email: email || '',
          sourceOrderId: orderId,
          createdAt: Date.now(),
          usageLimit: 1,
          usedCount: 0,
        });
      } catch (e) {
        console.error('Error creating coupon:', e);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      newStatus: 'stock_confirmed',
      couponCode,
      remainingCredit,
      message: remainingCredit > 0
        ? `Canje completado. Cupón ${couponCode} por ${remainingCredit} creado para tu próximo pedido.`
        : 'Canje completado exitosamente.',
    });
  } catch (error: any) {
    console.error('Canje confirm error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
