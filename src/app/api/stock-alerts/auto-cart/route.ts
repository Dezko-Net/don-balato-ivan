import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a0a58ca001798410d86';
const CART_SNAPSHOTS_COLLECTION = 'cart_snapshots';
const STOCK_ALERTS_COLLECTION = 'stock_alerts';
const NOTIFICATIONS_COLLECTION = 'notifications';

function getClient() {
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  return { databases: new Databases(client) };
}

export async function POST(req: NextRequest) {
  try {
    const { databases } = getClient();
    const body = await req.json();
    const { productId, productName, productImage, productPrice, singleUserId, singleQty, singleAlertId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    console.log('[auto-cart] Request body:', { productId, productName, productPrice, singleUserId, singleQty, singleAlertId });

    // Single-user mode: delete specific alert and notify
    if (singleUserId && singleAlertId) {
      try {
        // Create notification for the user
        await databases.createDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION, ID.unique(), {
          userId: singleUserId,
          type: 'stock',
          title: '¡Producto disponible!',
          message: `El producto "${productName || 'Producto'}" que esperabas ya tiene stock disponible. ¡Visita la tienda para comprarlo!`,
          isRead: false,
        });

        // Update alert status to 'available' (product was found and notified)
        await databases.updateDocument(DATABASE_ID, STOCK_ALERTS_COLLECTION, singleAlertId, { status: 'available' });

        return NextResponse.json({ success: true, autoAdded: 0, notified: 1 });
      } catch (e: any) {
        console.error('Single-user notify error:', e?.message || e);
        return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
      }
    }

    // Batch mode: find all pending stock alerts for this product
    const alertsRes = await databases.listDocuments(DATABASE_ID, STOCK_ALERTS_COLLECTION, [
      Query.equal('productId', productId),
      Query.limit(500),
    ]);

    if (alertsRes.documents.length === 0) {
      return NextResponse.json({ message: 'No pending alerts for this product' });
    }

    let autoAdded = 0;
    let notified = 0;

    for (const alert of alertsRes.documents) {
      const userId = alert.userId as string;

      try {
        // Create notification for the user
        await databases.createDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION, ID.unique(), {
          userId,
          type: 'stock',
          title: '¡Producto disponible!',
          message: `El producto "${productName || 'Producto'}" que esperabas ya tiene stock disponible. ¡Visita la tienda para comprarlo!`,
          isRead: false,
        });

        notified++;

        // Update alert status to 'available' (product was found and notified)
        await databases.updateDocument(DATABASE_ID, STOCK_ALERTS_COLLECTION, alert.$id, { status: 'available' });

      } catch (userErr) {
        console.error(`Error processing alert for user ${userId}:`, userErr);
      }
    }

    return NextResponse.json({
      success: true,
      autoAdded,
      notified,
      totalAlerts: alertsRes.documents.length,
    });
  } catch (e: any) {
    console.error('auto-cart error:', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
