import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const path = request.nextUrl.searchParams.get('path');
  
  try {
    if (path) {
      revalidatePath(path, 'layout');
    }
    if (tag) {
      revalidateTag(tag);
      // Para asegurarnos de limpiar la mayoría de las cachés al mismo tiempo si se pide products
      if (tag === 'products') {
        revalidateTag('home');
        revalidateTag('catalog');
        revalidateTag('offers');
      }
    }
    return NextResponse.json({ revalidated: true, path, tag, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
