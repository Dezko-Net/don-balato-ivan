import { NextRequest, NextResponse } from 'next/server';
import { serverGetDocument, serverUpdateDocument, serverUploadFile, getServerFileUrl } from '@/lib/appwrite-server';
import { VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { MEDIA_BUCKET_ID } from '@/lib/appwrite';
import { compressImageKeepFormat } from '@/lib/image-compression';

export const dynamic = 'force-dynamic';

// Público: el cliente sube su comprobante de transferencia para el pedido del vendor.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const order = await serverGetDocument(VENDOR_ORDERS_COLLECTION_ID, id) as any;
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!(file instanceof File)) return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'El archivo supera los 10MB' }, { status: 400 });

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const { buffer: compressedBuffer, format } = await compressImageKeepFormat(originalBuffer);
    const originalName = file.name || 'proof.jpg';
    const baseName = originalName.replace(/\.[^.]+$/, '');
    const fileName = `${baseName}.${format}`;
    const uploaded = await serverUploadFile(MEDIA_BUCKET_ID, compressedBuffer, fileName);
    const proofUrl = getServerFileUrl(MEDIA_BUCKET_ID, uploaded.$id);

    const shouldChangeStatus = ['pending', 'pending_stock', 'processing', 'paid'].includes(order.STATUS);
    await serverUpdateDocument(VENDOR_ORDERS_COLLECTION_ID, id, {
      PAYMENTPROOFURL: proofUrl,
      ...(shouldChangeStatus ? { STATUS: 'payment_review' } : {}),
      UPDATEDAT: Date.now(),
    });

    return NextResponse.json({ ok: true, proofUrl });
  } catch (err: any) {
    console.error('[vendor-order upload-proof]', err);
    return NextResponse.json({ error: err.message || 'Error al subir el comprobante' }, { status: 500 });
  }
}
