import { NextRequest, NextResponse } from 'next/server';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const COLLECTION_ID = 'theme_config';
const DOC_ID = 'homepage_sections';
const API_KEY = 'standard_c476eaadc21bbecc3b6949ee4d0a932613b7a3d4ee52c80cf2c1406750ff75267becfad617da0acd444d0b903b8faea19661d48b2f8b6dc09b678e0db164ddd4b472417c3477a091188554bdd2adfad944778a2927090744ae991c9dcf48c7cebc60e437f5c8a841ffb0736da27daf197bf5716065c2ea5dda65070b07d74642';

export const revalidate = 60; // Cache for 60 seconds on the edge/server

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

// GET - Obtener configuración
export async function GET() {
  try {
    const res = await fetch(`${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${DOC_ID}`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API theme-config] Appwrite GET failed:', res.status, errorText);
    }

    if (res.ok) {
      const doc = await res.json();
      return NextResponse.json(
        { success: true, sections: doc.SECTIONS || doc.sections },
        { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
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

    if (createRes.ok) {
      return NextResponse.json(
        { success: true, sections: '[]' },
        { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
      );
    }
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
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
