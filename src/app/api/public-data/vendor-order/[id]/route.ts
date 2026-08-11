import { NextRequest, NextResponse } from 'next/server';
import { serverGetDocument, serverListDocuments, serverUpdateDocument } from '@/lib/appwrite-server';
import { VENDOR_ORDERS_COLLECTION_ID, VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';
const SHIPPING_AGENCIES_COLLECTION_ID = 'shipping_agencies';

async function getOwnedOrder(request: NextRequest, id: string) {
  const order = await serverGetDocument(VENDOR_ORDERS_COLLECTION_ID, id) as any;
  if (!order) return null;
  const userId = request.nextUrl.searchParams.get('userId') || '';
  const email = request.nextUrl.searchParams.get('email') || '';
  const hasOwnerQuery = Boolean(userId || email);
  const ownsOrder = (userId && order.USERID === userId) || (email && order.CUSTOMEREMAIL === email);
  if (hasOwnerQuery && !ownsOrder) return null;
  return order;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOwnedOrder(request, id);
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    let branding: any = null;
    try {
      const vendor = await serverGetDocument(VENDORS_COLLECTION_ID, order.VENDOR_ID) as any;
      branding = { name: vendor.NAME || 'Tienda asociada', color: vendor.BRAND_COLOR || '#f97316', secondaryColor: vendor.BRAND_SECONDARY_COLOR || '#fb923c', logoUrl: vendor.LOGO_URL || '', address: vendor.STORE_ADDRESS || '', phone: vendor.STORE_PHONE || '', email: vendor.STORE_EMAIL || vendor.EMAIL || '', website: vendor.STORE_WEBSITE || '', bankAccountHolder: vendor.BANK_ACCOUNT_HOLDER || '', bankRut: vendor.BANK_RUT || '', bankName: vendor.BANK_NAME || '', bankAccountType: vendor.BANK_ACCOUNT_TYPE || '', bankAccountNumber: vendor.BANK_ACCOUNT_NUMBER || '', bankEmail: vendor.BANK_EMAIL || '' };
    } catch {}
    return NextResponse.json({ order, branding });
  } catch (error: any) {
    console.error('[API public-data/vendor-order]', error);
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOwnedOrder(request, id);
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const editableStatuses = ['pending', 'pending_stock', 'processing', 'paid'];
    if (!editableStatuses.includes(String(order.STATUS))) {
      return NextResponse.json({ error: 'Los datos ya no se pueden editar después de enviar el comprobante.' }, { status: 400 });
    }

    const body = await request.json();
    const allowedFields = ['CUSTOMERRUT', 'CUSTOMEREMAIL', 'ADDRESS', 'COMUNA', 'REGION', 'ADDITIONALINFO', 'SHIPPINGAGENCY'];
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = String(body[field] || '').trim();
    }

    if (updateData.SHIPPINGAGENCY) {
      const agenciesRes = await serverListDocuments(SHIPPING_AGENCIES_COLLECTION_ID, [JSON.stringify({ method: 'limit', values: [100] })]);
      const vendor = await serverGetDocument(VENDORS_COLLECTION_ID, order.VENDOR_ID) as any;
      const visible = vendor.VISIBLE_AGENCIES;
      let visibleIds: string[] | null = null;
      if (visible !== undefined && visible !== null && visible !== '') {
        try { visibleIds = Array.isArray(visible) ? visible : JSON.parse(visible); } catch { visibleIds = []; }
      }
      const allowedNames = (agenciesRes.documents || [])
        .filter((agency: any) => agency.active !== false && (!visibleIds || visibleIds.includes(agency.$id)))
        .map((agency: any) => String(agency.name || '').trim().toLowerCase());
      if (!allowedNames.includes(updateData.SHIPPINGAGENCY.toLowerCase())) {
        return NextResponse.json({ error: 'La agencia seleccionada no está habilitada para esta tienda.' }, { status: 400 });
      }
      updateData.AGENCYCHANGED = true;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No hay datos para actualizar.' }, { status: 400 });
    }
    updateData.UPDATEDAT = Date.now();
    await serverUpdateDocument(VENDOR_ORDERS_COLLECTION_ID, id, updateData);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[API public-data/vendor-order PATCH]', error);
    return NextResponse.json({ error: error?.message || 'No se pudieron actualizar los datos del pedido' }, { status: 500 });
  }
}
