import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { serverUpdateDocument, serverUploadFile, getPublicFileUrl } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { MEDIA_BUCKET_ID } from '@/lib/appwrite';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('orderId') as string;
    const file = formData.get('file') as File | null;
    const trackingNumber = formData.get('trackingNumber') as string | null;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId es requerido' }, { status: 400 });
    }

    const updates: Record<string, any> = { UPDATEDAT: Date.now() };

    // Upload shipping proof photo
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const uploaded = await serverUploadFile(MEDIA_BUCKET_ID, arrayBuffer, file.name);
      const fileId = (uploaded as any).$id;
      const fileUrl = getPublicFileUrl(MEDIA_BUCKET_ID, fileId);
      updates.SHIPPINGPROOFURL = fileUrl;
    }

    // Save tracking number
    if (trackingNumber && trackingNumber.trim()) {
      updates.TRACKINGNUMBER = trackingNumber.trim();
    }

    if (Object.keys(updates).length <= 1) {
      return NextResponse.json({ error: 'Debes subir una foto o ingresar un número de seguimiento' }, { status: 400 });
    }

    await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, updates);

    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({
      success: true,
      shippingProofUrl: updates.SHIPPINGPROOFURL || null,
      trackingNumber: updates.TRACKINGNUMBER || null,
    });
  } catch (error: any) {
    console.error('[API admin/orders/shipping-proof] Error:', error);
    return NextResponse.json({ error: error.message || 'Error al guardar' }, { status: 500 });
  }
}
