import { NextRequest, NextResponse } from 'next/server';
import { getVendorSession } from '@/lib/vendor-auth';
import { serverGetDocument, serverUpdateDocument } from '@/lib/appwrite-server';
import { VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { restoreStockForOrder } from '@/lib/order-stock-service';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'pending_stock', 'processing', 'paid', 'payment_review', 'payment_confirmed', 'preparing', 'negotiation', 'shipped', 'checklist', 'delivered', 'cancelled'];

async function assertOwnership(vendorId: string, orderId: string) {
  const order = await serverGetDocument(VENDOR_ORDERS_COLLECTION_ID, orderId) as any;
  if (!order || order.VENDOR_ID !== vendorId) return null;
  return order;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getVendorSession(req);
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { id } = await params;

  const order = await assertOwnership(session.vendorId, id);
  if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getVendorSession(req);
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { id } = await params;

  try {
    const existing = await assertOwnership(session.vendorId, id);
    if (!existing) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const { status, adminNotes } = await req.json();
    const updateData: Record<string, unknown> = { UPDATEDAT: Date.now() };
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
      }
      if (existing.STATUS === 'cancelled' && status !== 'cancelled') {
        return NextResponse.json({ error: 'Un pedido cancelado no puede reactivarse' }, { status: 400 });
      }
      updateData.STATUS = status;
    }
    if (adminNotes !== undefined) updateData.ADMINNOTES = adminNotes;

    const result = await serverUpdateDocument(VENDOR_ORDERS_COLLECTION_ID, id, updateData);

    // El checkout ya descontó el stock al crear el pedido. Si el vendor
    // cancela el pedido, se restituyen sus cantidades una sola vez.
    let stockRestored = false;
    if (status === 'cancelled' && existing.STATUS !== 'cancelled') {
      stockRestored = await restoreStockForOrder(id, existing.ITEMS);
      try { revalidateTag('products'); } catch {}
    }

    return NextResponse.json({ ok: true, order: result, stockRestored });
  } catch (err: any) {
    console.error('[vendor/orders PATCH]', err);
    return NextResponse.json({ error: err.message || 'Error al actualizar el pedido' }, { status: 500 });
  }
}
