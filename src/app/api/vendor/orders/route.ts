import { NextRequest, NextResponse } from 'next/server';
import { getVendorSession } from '@/lib/vendor-auth';
import { serverListDocuments } from '@/lib/appwrite-server';
import { VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { Query } from 'appwrite';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getVendorSession(req);
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const cursor = searchParams.get('cursor');
    const queries = [Query.equal('VENDOR_ID', session.vendorId), Query.limit(50), Query.orderDesc('CREATEDAT')];
    if (status) queries.push(Query.equal('STATUS', status));
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const res = await serverListDocuments(VENDOR_ORDERS_COLLECTION_ID, queries);
    return NextResponse.json({ orders: res.documents, total: res.total });
  } catch (err: any) {
    console.error('[vendor/orders GET]', err);
    return NextResponse.json({ error: 'Error al listar pedidos' }, { status: 500 });
  }
}
