import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments, serverGetDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID, VENDOR_ORDERS_COLLECTION_ID, VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

const q = (method: string, attribute: string, values: any[]) => JSON.stringify({ method, attribute, values });
const orderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
const limit = JSON.stringify({ method: 'limit', values: [50] });

async function findOrders(collectionId: string, userId: string, email: string) {
  const queries = await Promise.all([
    userId
      ? serverListDocuments(collectionId, [q('equal', 'USERID', [userId]), orderDesc, limit]).catch(() => ({ documents: [] }))
      : Promise.resolve({ documents: [] }),
    email
      ? serverListDocuments(collectionId, [q('equal', 'CUSTOMEREMAIL', [email]), orderDesc, limit]).catch(() => ({ documents: [] }))
      : Promise.resolve({ documents: [] }),
  ]);
  const unique = new Map<string, any>();
  for (const result of queries) {
    for (const order of (result as any).documents || []) unique.set(order.$id, order);
  }
  return Array.from(unique.values()).sort((a, b) => {
    const dateA = Number(a.CREATEDAT) || new Date(a.$createdAt || 0).getTime();
    const dateB = Number(b.CREATEDAT) || new Date(b.$createdAt || 0).getTime();
    return dateB - dateA;
  });
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    const email = request.nextUrl.searchParams.get('email') || '';
    if (!userId) return NextResponse.json({ orders: [] });

    const [mainOrders, vendorOrders] = await Promise.all([
      findOrders(ORDERS_COLLECTION_ID, userId, email),
      findOrders(VENDOR_ORDERS_COLLECTION_ID, userId, email),
    ]);

    const vendorIds = [...new Set(vendorOrders.map(order => order.VENDOR_ID).filter(Boolean))];
    const vendorProfiles: Record<string, any> = {};
    await Promise.all(vendorIds.map(async vendorId => {
      try {
        const vendor = await serverGetDocument(VENDORS_COLLECTION_ID, vendorId) as any;
        vendorProfiles[vendorId] = { name: vendor.NAME || 'Tienda asociada', color: vendor.BRAND_COLOR || '#f97316', secondaryColor: vendor.BRAND_SECONDARY_COLOR || '#fb923c', logoUrl: vendor.LOGO_URL || '', address: vendor.STORE_ADDRESS || '', phone: vendor.STORE_PHONE || '', email: vendor.STORE_EMAIL || vendor.EMAIL || '', website: vendor.STORE_WEBSITE || '' };
      } catch {
        vendorProfiles[vendorId] = { name: 'Tienda asociada', color: '#f97316', secondaryColor: '#fb923c' };
      }
    }));

    const taggedMain = mainOrders.map(order => ({ ...order, ORDER_SOURCE: 'main', STORE_LABEL: 'Don Balato Iván' }));
    const taggedVendor = vendorOrders.map(order => ({
      ...order,
      // Los pedidos vendor antiguos se creaban como pending aunque el stock ya
      // se había reservado. Para el cliente ese estado equivale a Stock Confirmado.
      STATUS: ['pending', 'pending_stock'].includes(String(order.STATUS)) ? 'paid' : order.STATUS,
      ORDER_SOURCE: 'vendor',
      STORE_LABEL: vendorProfiles[order.VENDOR_ID]?.name || 'Tienda asociada',
      STORE_BRANDING: vendorProfiles[order.VENDOR_ID] || null,
    }));

    const orders = [...taggedMain, ...taggedVendor].sort((a, b) => {
      const dateA = Number(a.CREATEDAT) || new Date(a.$createdAt || 0).getTime();
      const dateB = Number(b.CREATEDAT) || new Date(b.$createdAt || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(
      { orders },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } },
    );
  } catch (error: any) {
    console.error('[API public-data/my-orders]', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
