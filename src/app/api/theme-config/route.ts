import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache, revalidateTag } from 'next/cache';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = 'donbalatoivan';
const DATABASE_ID = '6a62e7440033d2278d28';
const COLLECTION_ID = 'theme_config';
const DOC_ID = 'homepage_sections';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

// Lectura cacheada: antes este GET pegaba a Appwrite en CADA request, sin
// unstable_cache, protegido solo por el header de CDN. El POST/DELETE de abajo
// purgan el tag para que los cambios del theme editor se vean al instante.
const getCachedThemeConfig = unstable_cache(
  async () => {
    const res = await fetch(`${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${DOC_ID}`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API theme-config] Appwrite GET failed:', res.status, errorText);
      // Solo el 404 significa "hay que crearlo" y se cachea como null. Cualquier
      // otro error se lanza: unstable_cache no cachea excepciones, así que una
      // caída puntual de Appwrite no queda congelada 24h.
      if (res.status === 404) return null;
      throw new Error(`Appwrite ${res.status}`);
    }

    const doc = await res.json();
    return { sections: doc.SECTIONS || doc.sections };
  },
  ['theme-config-cache-v1'],
  { revalidate: 86400, tags: ['theme-config'] }
);

// GET - Obtener configuración
export async function GET() {
  try {
    const cached = await getCachedThemeConfig();

    if (cached) {
      return NextResponse.json(
        { success: true, sections: cached.sections },
        { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' } },
      );
    }

    // Documento no existe, crear vacío
    const createRes = await fetch(`${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        documentId: DOC_ID,
        data: { NAME: 'homepage_sections', SECTIONS: '[]' },
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error('[API theme-config] Appwrite POST failed:', createRes.status, errorText);
      return NextResponse.json({ success: false, error: errorText }, { status: 500 });
    }

    // Purgar el null cacheado: sin esto el caché seguiría devolviendo "no
    // existe" durante 24h y cada GET reintentaría crear el documento.
    revalidateTag('theme-config');

    return NextResponse.json(
      { success: true, sections: '[]' },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch (error: any) {
    console.error('[API theme-config] Exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Guardar configuración
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sections = typeof body.sections === 'string' ? body.sections : JSON.stringify(body.sections);
    
    // Intentar actualizar
    const updateRes = await fetch(`${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${DOC_ID}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        data: { SECTIONS: sections },
      }),
    });
    
    if (updateRes.ok) {
      revalidateTag('theme-config');
      return NextResponse.json(
        { success: true },
        { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
      );
    }

    // Si no existe, crear
    const createRes = await fetch(`${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        documentId: DOC_ID,
        data: { SECTIONS: sections },
      }),
    });
    
    if (createRes.ok) {
      revalidateTag('theme-config');
      return NextResponse.json(
        { success: true },
        { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
      );
    }

    const err = await createRes.json();
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Resetear configuración
export async function DELETE() {
  try {
    await fetch(`${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${DOC_ID}`, {
      method: 'DELETE',
      headers,
    });
    revalidateTag('theme-config');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
