import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { trackRead } from '@/lib/appwrite-read-tracker';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = 'donbalatoivan';
const DATABASE_ID = '6a62e7440033d2278d28';
const COLLECTION_ID = 'theme_config';
const DOC_ID = 'homepage_sections';
const API_KEY = process.env.APPWRITE_API_KEY || '';

// GET - Returns the last updated timestamp of the theme config
// Clients poll this to detect when admin has made changes
// Endpoint público de polling: sin unstable_cache pegaba a Appwrite en cada
// request. Comparte el tag 'theme-config' con /api/theme-config, así que
// guardar en el theme editor lo purga y los clientes ven el cambio enseguida.
const getCachedVersion = unstable_cache(
  async () => {
    trackRead('get', COLLECTION_ID, `id=${DOC_ID}`, new Error().stack || '');
    const res = await fetch(
      `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${DOC_ID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY,
        },
      }
    );
    // Lanzar en vez de devolver null: unstable_cache NO cachea excepciones, así
    // que un fallo transitorio de Appwrite no queda congelado 24h (el try/catch
    // del GET responde updatedAt:0 mientras tanto).
    if (!res.ok) throw new Error(`Appwrite ${res.status}`);
    const doc = await res.json();
    // $updatedAt is Appwrite's automatic ISO timestamp — convert to ms for comparison
    const raw = doc.$updatedAt || doc.UPDATEDAT;
    return { updatedAt: raw ? new Date(raw).getTime() : 0 };
  },
  ['theme-version-cache-v1'],
  { revalidate: 86400, tags: ['theme-config'] }
);

export async function GET() {
  try {
    const cached = await getCachedVersion();

    if (cached) {
      return NextResponse.json(
        { updatedAt: cached.updatedAt },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return NextResponse.json(
      { updatedAt: 0 },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { updatedAt: 0 },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }
}
