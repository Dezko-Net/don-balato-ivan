import { NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

// Guard anti-estampida de 2s (ver nota en catalog-cache.ts): evita que N
// requests concurrentes tras una purga de tag disparen N veces las 3 consultas.
// TTL corto a propósito: uno largo envenenaría la purga (la función re-ejecutada
// devolvería memoria stale y unstable_cache la re-guardaría por 24h).
let memoryCacheCatalog: any = null;
let memoryCacheCatalogTime = 0;

// 24h como el resto del catálogo: cada edición de categoría/subcategoría/oferta
// ya invalida su tag on-demand, así que un TTL de 1h solo costaba ~3.000
// lecturas/día de reconstrucciones sin aportar frescura.
const getCachedCatalogData = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheCatalog && (now - memoryCacheCatalogTime < 2000)) {
      return memoryCacheCatalog;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const [catDocs, subDocs, offDocs] = await Promise.all([
      databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [Query.orderAsc('$createdAt'), Query.limit(50)]),
      databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION, [Query.orderAsc('$createdAt'), Query.limit(200)]),
      databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [Query.equal('isActive', true), Query.equal('status', 'active'), Query.limit(100)])
    ]);

    const result = {
      categories: catDocs.documents,
      subcategories: subDocs.documents,
      offers: offDocs.documents
    };

    memoryCacheCatalog = result;
    memoryCacheCatalogTime = Date.now();
    return result;
  },
  ['public-catalog-cache-v4'],
  { revalidate: 86400, tags: ['catalog', 'categories', 'offers'] }
);

export async function GET() {
  try {
    const data = await getCachedCatalogData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('[API public-data/catalog] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

