import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments, serverUpdateDocument, serverUploadFile, getPublicFileUrl } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { MEDIA_BUCKET_ID } from '@/lib/appwrite';

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
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qEqual, qLimit1]);

    if (!res.documents || res.documents.length === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const order = res.documents[0] as any;

    // Upload file to Appwrite storage
    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await serverUploadFile(MEDIA_BUCKET_ID, arrayBuffer, file.name);
    const fileId = (uploaded as any).$id;
    const fileUrl = getPublicFileUrl(MEDIA_BUCKET_ID, fileId);

    // Update order with proof URL and change status
    await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
      PAYMENTPROOFURL: fileUrl,
      STATUS: 'payment_confirmed',
      UPDATEDAT: Date.now(),
    });

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
