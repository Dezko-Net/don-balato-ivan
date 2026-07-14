import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, ORDERS_COLLECTION } from '@/lib/appwrite';
import { WHOLESALE_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Query } from 'appwrite';
import { normalizeProductImages } from '@/lib/product-images';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const lightweight = searchParams.get('lightweight') === '1';

    if (!userId && !email) {
      return NextResponse.json({ error: 'userId or email required' }, { status: 400 });
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    // 1. Buscar órdenes en negotiation con items faltantes
    const queries: string[] = [Query.equal('STATUS', 'negotiation'), Query.limit(50)];
    if (userId) queries.unshift(Query.equal('USERID', userId));

    let creditAmount = 0;
    let negotiationOrders: any[] = [];

    try {
      const ordersRes = await databases.listDocuments(databaseId, ORDERS_COLLECTION, queries);
      negotiationOrders = ordersRes.documents;
    } catch {}

    // Also check wholesale orders
    try {
      const wsQueries: string[] = [Query.equal('STATUS', 'negotiation'), Query.limit(50)];
      if (userId) wsQueries.unshift(Query.equal('USERID', userId));
      const wsRes = await databases.listDocuments(databaseId, WHOLESALE_ORDERS_COLLECTION_ID, wsQueries);
      negotiationOrders = [...negotiationOrders, ...wsRes.documents];
    } catch {}

    // If no orders found by userId, try by email
    if (negotiationOrders.length === 0 && email) {
      try {
        const emailOrders = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
          Query.equal('CUSTOMEREMAIL', email),
          Query.equal('STATUS', 'negotiation'),
          Query.limit(50),
        ]);
        negotiationOrders = emailOrders.documents;
      } catch {}
    }

    // Calculate credit from missing items
    for (const order of negotiationOrders) {
      try {
        const items = JSON.parse(order.ITEMS || '[]');
        for (const item of items) {
          if (item.missing && !item.replaced) {
            creditAmount += (item.price || 0) * (item.qty || 1);
          }
        }
      } catch {}
    }

    // If no credit, return early
    if (creditAmount <= 0) {
      return NextResponse.json({
        hasCredit: false,
        creditAmount: 0,
        creditWithMargin: 0,
        products: [],
        orders: [],
      });
    }

    // Lightweight mode: skip fetching 500 products, only return credit info
    if (lightweight) {
      return NextResponse.json({
        hasCredit: true,
        creditAmount,
        creditWithMargin: creditAmount + 500,
        products: [],
        orders: negotiationOrders.map((o: any) => ({
          id: o.$id,
          orderCode: o.ORDERCODE || o.REQCODE || o.$id,
          status: o.STATUS,
          isWholesale: o.$collectionId === WHOLESALE_ORDERS_COLLECTION_ID,
        })),
      });
    }

    // 2. Fetch ALL products - canje applies flat 20% off from unit 1
    let eligibleProducts: any[] = [];
    try {
      const prodRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
        Query.limit(500),
      ]);
      eligibleProducts = prodRes.documents
        .map((p: any) => normalizeProductImages(p))
        .filter((p: any) => p.PRICE && p.PRICE > 0);
    } catch (e) {
      console.error('Error fetching products for canje:', e);
    }

    return NextResponse.json({
      hasCredit: true,
      creditAmount,
      creditWithMargin: creditAmount + 500,
      products: eligibleProducts,
      orders: negotiationOrders.map((o: any) => ({
        id: o.$id,
        orderCode: o.ORDERCODE || o.REQCODE || o.$id,
        status: o.STATUS,
        isWholesale: o.$collectionId === WHOLESALE_ORDERS_COLLECTION_ID,
      })),
    });
  } catch (error: any) {
    console.error('Canje info error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
