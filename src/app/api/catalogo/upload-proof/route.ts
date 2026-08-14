import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { serverListDocuments, serverUpdateDocument, serverUploadFile, getPublicFileUrl } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID, VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { MEDIA_BUCKET_ID } from '@/lib/appwrite';
import { parsePaymentProofs, serializePaymentProofs, MAX_PAYMENT_PROOFS } from '@/lib/payment-proofs';
import { compressImageKeepFormat } from '@/lib/image-compression';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderCode = formData.get('orderCode') as string;
    const file = formData.get('file') as File;

    if (!orderCode || !file) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Find order by ORDERCODE
    const qEqual = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [orderCode] });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
    let collectionId = ORDERS_COLLECTION_ID;
    let res = await serverListDocuments(collectionId, [qEqual, qLimit1]);
    if (!res.documents || res.documents.length === 0) {
      collectionId = VENDOR_ORDERS_COLLECTION_ID;
      res = await serverListDocuments(collectionId, [qEqual, qLimit1]);
    }
    if (!res.documents || res.documents.length === 0) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const order = res.documents[0] as any;

    // Upload file to storage (comprimido)
    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const { buffer: compressedBuffer, format } = await compressImageKeepFormat(originalBuffer);
    const originalName = file.name || 'proof.jpg';
    const baseName = originalName.replace(/\.[^.]+$/, '');
    const fileName = `${baseName}.${format}`;
    const uploaded = await serverUploadFile(MEDIA_BUCKET_ID, compressedBuffer, fileName);
    const fileId = (uploaded as any).$id;
    const fileUrl = getPublicFileUrl(MEDIA_BUCKET_ID, fileId);

    // Append to existing proofs (max 3)
    const existing = parsePaymentProofs(order.PAYMENTPROOFURL);
    if (existing.length >= MAX_PAYMENT_PROOFS) {
      return NextResponse.json({ error: 'Solo se permiten hasta 3 comprobantes de pago' }, { status: 400 });
    }
    const allProofs = serializePaymentProofs([...existing, fileUrl]);

    await serverUpdateDocument(collectionId, order.$id, {
      PAYMENTPROOFURL: allProofs,
      STATUS: 'payment_review',
      UPDATEDAT: Date.now(),
    });

    // Invalidar la caché del badge "Pagar tu pedido" (my-orders-status).
    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({
      success: true,
      proofUrl: fileUrl,
    }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('[API catalogo/upload-proof] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al subir comprobante' }, { status: 500 });
  }
}
