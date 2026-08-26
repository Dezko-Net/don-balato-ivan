import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { serverListDocuments, serverUpdateDocument, serverUploadFile, getPublicFileUrl } from '@/lib/appwrite-server';
import { VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { MEDIA_BUCKET_ID } from '@/lib/appwrite-admin';
import { parsePaymentProofs, serializePaymentProofs, MAX_PAYMENT_PROOFS } from '@/lib/payment-proofs';
import { compressImageKeepFormat } from '@/lib/image-compression';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderCode = String(formData.get('orderCode') || '');
    const file = formData.get('file') as File | null;
    if (!orderCode || !file) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

    const query = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [orderCode] });
    const limit = JSON.stringify({ method: 'limit', values: [1] });
    const result = await serverListDocuments(VENDOR_ORDERS_COLLECTION_ID, [query, limit]);
    const order = result.documents?.[0] as any;
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const existing = parsePaymentProofs(order.PAYMENTPROOFURL);
    if (existing.length >= MAX_PAYMENT_PROOFS) return NextResponse.json({ error: 'Solo se permiten hasta 3 comprobantes de pago' }, { status: 400 });

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const { buffer: compressedBuffer, format } = await compressImageKeepFormat(originalBuffer);
    const originalName = file.name || 'proof.jpg';
    const baseName = originalName.replace(/\.[^.]+$/, '');
    const fileName = `${baseName}.${format}`;
    const uploaded = await serverUploadFile(MEDIA_BUCKET_ID, compressedBuffer, fileName);
    const fileUrl = getPublicFileUrl(MEDIA_BUCKET_ID, String((uploaded as any).$id));
    await serverUpdateDocument(VENDOR_ORDERS_COLLECTION_ID, order.$id, {
      PAYMENTPROOFURL: serializePaymentProofs([...existing, fileUrl]),
      STATUS: 'payment_review',
      UPDATEDAT: Date.now(),
    });
    try { revalidateTag('orders'); } catch {}
    return NextResponse.json({ success: true, proofUrl: fileUrl }, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  } catch (error: any) {
    console.error('[API vendor/public-upload-proof]', error);
    return NextResponse.json({ error: error.message || 'Error al subir comprobante' }, { status: 500 });
  }
}
