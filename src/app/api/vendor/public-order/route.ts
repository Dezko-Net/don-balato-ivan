import { NextRequest, NextResponse } from 'next/server';
import { serverGetDocument, serverListDocuments } from '@/lib/appwrite-server';
import { VENDOR_ORDERS_COLLECTION_ID, VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'Falta código de pedido' }, { status: 400 });

    const query = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [code] });
    const limit = JSON.stringify({ method: 'limit', values: [1] });
    const result = await serverListDocuments(VENDOR_ORDERS_COLLECTION_ID, [query, limit]);
    const order = result.documents?.[0] as any;
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const vendor = await serverGetDocument(VENDORS_COLLECTION_ID, String(order.VENDOR_ID)) as any;
    return NextResponse.json({
      order,
      vendor: vendor ? {
        name: vendor.NAME || 'Tienda asociada',
        logoUrl: vendor.LOGO_URL || '',
        brandColor: vendor.BRAND_COLOR || '#f97316',
        bankAccountHolder: vendor.BANK_ACCOUNT_HOLDER || '',
        bankRut: vendor.BANK_RUT || '',
        bankName: vendor.BANK_NAME || '',
        bankAccountType: vendor.BANK_ACCOUNT_TYPE || '',
        bankAccountNumber: vendor.BANK_ACCOUNT_NUMBER || '',
        bankEmail: vendor.BANK_EMAIL || '',
      } : null,
    }, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  } catch (error: any) {
    console.error('[API vendor/public-order]', error);
    return NextResponse.json({ error: error.message || 'Error al obtener pedido' }, { status: 500 });
  }
}
