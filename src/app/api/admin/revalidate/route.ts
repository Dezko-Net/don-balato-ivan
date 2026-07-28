import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Revalidar las etiquetas globales
    revalidateTag('products');
    revalidateTag('offers');
    revalidateTag('catalog');
    revalidateTag('categories');
    revalidateTag('subcategories');
    revalidateTag('home');     // el home cachea productos/categorías propios
    revalidateTag('settings');
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, message: err.message }, { status: 500 });
  }
}
