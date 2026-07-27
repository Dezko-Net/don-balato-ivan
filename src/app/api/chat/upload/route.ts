import { NextRequest, NextResponse } from 'next/server';
import { serverUploadFile, getServerFileUrl } from '@/lib/appwrite-server';

const STORAGE_BUCKET_ID = 'media';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No se envió archivo' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await serverUploadFile(STORAGE_BUCKET_ID, arrayBuffer, file.name || 'chat-image.jpg');
    const url = getServerFileUrl(STORAGE_BUCKET_ID, uploaded.$id);

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Error uploading chat image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al subir imagen' },
      { status: 500 }
    );
  }
}
