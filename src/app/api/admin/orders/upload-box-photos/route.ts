import { NextRequest, NextResponse } from 'next/server';
import { serverUploadFile, serverUpdateDocument, serverGetDocument } from '@/lib/appwrite-server';
import { ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { ORDER_BOX_PHOTOS_BUCKET_ID } from '@/lib/appwrite';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

// POST: Subir foto de bulto para un pedido
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const orderId = formData.get('orderId') as string;
    const bultoIndex = formData.get('bultoIndex') as string; // "1", "2", etc.
    const file = formData.get('file') as File;

    if (!orderId || !file) {
      return NextResponse.json({ error: 'Falta orderId o file' }, { status: 400 });
    }

    // Subir archivo al bucket
    const fileName = `bulto_${orderId}_${bultoIndex || 'x'}_${Date.now()}.jpg`;
    const uploaded = await serverUploadFile(ORDER_BOX_PHOTOS_BUCKET_ID, file, fileName);
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1'}/storage/buckets/${ORDER_BOX_PHOTOS_BUCKET_ID}/files/${uploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan'}`;

    // Obtener el pedido actual para ver BOXPHOTOS existentes
    const order = await serverGetDocument(ORDERS_COLLECTION_ID, orderId) as any;
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    let boxPhotos: Array<{ bulto: number; url: string }> = [];
    try { boxPhotos = JSON.parse(order.BOXPHOTOS || '[]'); } catch {}

    // Agregar o reemplazar la foto del bulto
    const bultoNum = parseInt(bultoIndex, 10) || 1;
    const existing = boxPhotos.find(p => p.bulto === bultoNum);
    if (existing) {
      existing.url = fileUrl;
    } else {
      boxPhotos.push({ bulto: bultoNum, url: fileUrl });
      boxPhotos.sort((a, b) => a.bulto - bultoNum);
    }

    // Actualizar el pedido
    await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
      BOXPHOTOS: JSON.stringify(boxPhotos),
      UPDATEDAT: Date.now(),
    });

    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({
      success: true,
      fileUrl,
      bultoIndex: bultoNum,
      boxPhotos,
    });
  } catch (error: any) {
    console.error('[API upload-box-photos] Error:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}

// DELETE: Eliminar foto de bulto
export async function DELETE(req: NextRequest) {
  try {
    const { orderId, bultoIndex } = await req.json();

    if (!orderId || !bultoIndex) {
      return NextResponse.json({ error: 'Falta orderId o bultoIndex' }, { status: 400 });
    }

    const order = await serverGetDocument(ORDERS_COLLECTION_ID, orderId) as any;
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    let boxPhotos: Array<{ bulto: number; url: string }> = [];
    try { boxPhotos = JSON.parse(order.BOXPHOTOS || '[]'); } catch {}

    const bultoNum = parseInt(bultoIndex, 10);
    boxPhotos = boxPhotos.filter(p => p.bulto !== bultoNum);

    await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
      BOXPHOTOS: JSON.stringify(boxPhotos),
      UPDATEDAT: Date.now(),
    });

    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({ success: true, boxPhotos });
  } catch (error: any) {
    console.error('[API upload-box-photos DELETE] Error:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}

// PATCH: Actualizar cantidad de bultos
export async function PATCH(req: NextRequest) {
  try {
    const { orderId, bultoCount } = await req.json();

    if (!orderId || !bultoCount || bultoCount < 1) {
      return NextResponse.json({ error: 'orderId y bultoCount (>=1) requeridos' }, { status: 400 });
    }

    if (bultoCount > 20) {
      return NextResponse.json({ error: 'Máximo 20 bultos' }, { status: 400 });
    }

    await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
      BULTOCOUNT: bultoCount,
      UPDATEDAT: Date.now(),
    });

    try { revalidateTag('orders'); } catch {}

    return NextResponse.json({ success: true, bultoCount });
  } catch (error: any) {
    console.error('[API upload-box-photos PATCH] Error:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}
