import { NextRequest, NextResponse } from 'next/server';
import { serverGetDocument } from '@/lib/appwrite-server';
import { VENDOR_ORDERS_COLLECTION_ID, VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await serverGetDocument(VENDOR_ORDERS_COLLECTION_ID, id) as any;
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const userId = request.nextUrl.searchParams.get('userId') || '';
    const email = request.nextUrl.searchParams.get('email') || '';
    const ownsOrder = (userId && order.USERID === userId) || (email && order.CUSTOMEREMAIL === email);
    if (!ownsOrder) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    let branding: any = null;
    try {
      const vendor = await serverGetDocument(VENDORS_COLLECTION_ID, order.VENDOR_ID) as any;
      branding = { name: vendor.NAME || 'Tienda asociada', color: vendor.BRAND_COLOR || '#f97316', secondaryColor: vendor.BRAND_SECONDARY_COLOR || '#fb923c', logoUrl: vendor.LOGO_URL || '', address: vendor.STORE_ADDRESS || '', phone: vendor.STORE_PHONE || '', email: vendor.STORE_EMAIL || vendor.EMAIL || '', website: vendor.STORE_WEBSITE || '' };
    } catch {}
    return NextResponse.json({ order, branding });
  } catch (error: any) {
    console.error('[API public-data/vendor-order]', error);
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
  }
}
