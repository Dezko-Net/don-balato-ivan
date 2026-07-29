import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments } from '@/lib/appwrite-server';
import { CATALOG_PRODUCTS_COLLECTION } from '@/lib/appwrite';
import { unstable_cache } from 'next/cache';
import { normalizeProductImages } from '@/lib/product-images';

const PAGE_SIZE = 10;
const MAX_SEARCH_LEN = 60;
const MAX_OFFSET = 5000;

// El término de búsqueda entra en la CLAVE del unstable_cache: sin normalizar,
// cada string distinto ("zapato", "Zapato", "zapato ") era una entrada nueva y
// una consulta nueva a Appwrite. Como la ruta es pública, bastaba un bucle de
// búsquedas aleatorias para saltarse la caché por completo y quemar la cuota.
// Normalizar + acotar reduce el espacio de claves a algo finito.
function normalizeSearch(raw: string): string {
  return raw
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim().replace(/\s+/g, ' ')
    .toLowerCase()
    .slice(0, MAX_SEARCH_LEN);
}

const getCachedProducts = (
  category: string,
  subcategory: string,
  search: string,
  offset: number,
  limit: number
) => unstable_cache(
  async () => {
    const queries: string[] = [
      JSON.stringify({ method: 'equal', attribute: 'ISACTIVE', values: [true] }),
      JSON.stringify({ method: 'notEqual', attribute: 'IMAGEURL', values: [''] }),
      JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' }),
      JSON.stringify({ method: 'limit', values: [limit] }),
      JSON.stringify({ method: 'offset', values: [offset] }),
    ];

    if (category) {
      queries.splice(3, 0, JSON.stringify({ method: 'equal', attribute: 'CATEGORYID', values: [category] }));
    }
    if (subcategory) {
      queries.splice(3, 0, JSON.stringify({ method: 'equal', attribute: 'SUBCATEGORYID', values: [subcategory] }));
    }
    if (search) {
      queries.splice(3, 0, JSON.stringify({ method: 'search', attribute: 'NAME', values: [search] }));
    }

    const res = await serverListDocuments(CATALOG_PRODUCTS_COLLECTION, queries);
    const products = res.documents.map((p: any) => normalizeProductImages(p));
    const hasMore = offset + limit < res.total;

    return { products, hasMore, total: res.total };
  },
  ['catalog-products', category || 'all', subcategory || 'all', search || 'none', String(offset), String(limit)],
  { revalidate: 900, tags: ['catalog-products'] }
)();

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category') || '';
    const subcategory = req.nextUrl.searchParams.get('subcategory') || '';
    const search = normalizeSearch(req.nextUrl.searchParams.get('search') || '');
    // Acotar offset/limit: sin tope, un offset arbitrario también era una clave
    // de caché nueva por cada valor y una consulta nueva a Appwrite.
    const rawOffset = parseInt(req.nextUrl.searchParams.get('offset') || '0', 10);
    const offset = Number.isFinite(rawOffset) ? Math.min(Math.max(rawOffset, 0), MAX_OFFSET) : 0;
    const rawLimit = parseInt(req.nextUrl.searchParams.get('limit') || String(PAGE_SIZE), 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 50) : PAGE_SIZE;

    const data = await getCachedProducts(category, subcategory, search, offset, limit);

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' },
    });
  } catch (error: any) {
    console.error('[API public-data/catalog-products] Error:', error);
    return NextResponse.json({ error: error.message, products: [], hasMore: false, total: 0 }, { status: 500 });
  }
}
