import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  // Chilean: if starts with 56, keep as is; if 9 digits starting with 9, prepend 56
  if (cleaned.length === 9 && cleaned.startsWith('9')) cleaned = '56' + cleaned;
  if (cleaned.length === 8 && !cleaned.startsWith('56')) cleaned = '569' + cleaned;
  return cleaned;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone') || '';
    if (!phone) return NextResponse.json({ error: 'phone requerido' }, { status: 400 });

    const normalized = normalizePhone(phone);
    const variants = [normalized, '+' + normalized, phone.replace(/\D/g, '')];
    if (!variants.includes(phone)) variants.push(phone);

    const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
    const qLimit = JSON.stringify({ method: 'limit', values: [50] });

    const allOrders: any[] = [];
    const seen = new Set<string>();

    for (const v of variants) {
      try {
        const qPhone = JSON.stringify({ method: 'contains', attribute: 'CUSTOMERPHONE', values: [v] });
        const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qPhone, qLimit]);
        for (const doc of (res.documents || []) as any[]) {
          if (!seen.has(doc.$id)) {
            seen.add(doc.$id);
            allOrders.push(doc);
          }
        }
      } catch {}
    }

    // Sort by createdAt desc
    allOrders.sort((a, b) => (b.$createdAt || '').localeCompare(a.$createdAt || ''));

    const orders = allOrders.map((o: any) => ({
      id: o.$id,
      orderCode: o.ORDERCODE || '',
      status: o.STATUS || 'pending',
      total: o.TOTAL || 0,
      items: (() => {
        try { return JSON.parse(o.ITEMS || '[]'); } catch { return []; }
      })(),
      createdAt: o.$createdAt || '',
      assignedCashier: o.ASSIGNEDCASHIER || '',
      shippingAgency: o.SHIPPINGAGENCY || '',
      trackingNumber: o.TRACKINGNUMBER || '',
    }));

    return NextResponse.json({ success: true, orders }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/my-orders] Error:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
