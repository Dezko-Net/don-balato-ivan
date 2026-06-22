import { NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';
import { normalizeProductImages } from '@/lib/product-images';

// Configurar el entorno para que sea estático pero revalide en base a ISR (o cache interno)
export const dynamic = 'force-dynamic';

// Caché en memoria de respaldo para cold starts
let memoryCacheHome: any = null;
let memoryCacheHomeTime = 0;

const getCachedHomeData = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheHome && (now - memoryCacheHomeTime < 60000)) {
      return memoryCacheHome;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const [cRes, scRes, pRes, dtRes, ptRes, toRes, cheapRes] = await Promise.all([
      databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [
        Query.orderAsc('order'),
        Query.limit(100)
      ]).catch(() => ({ documents: [] })),
      
      databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION, [
        Query.limit(200)
      ]).catch(() => ({ documents: [] })),
      
      databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
        Query.greaterThan('STOCK', 0),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]).catch(() => ({ documents: [] })),
      
      databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [
        Query.equal('offerType', 'destacado_temporal'),
        Query.equal('isActive', true),
        Query.limit(1)
      ]).catch(() => ({ documents: [] })),
      
      databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [
        Query.equal('offerType', 'pack_timer'),
        Query.equal('isActive', true),
        Query.limit(1)
      ]).catch(() => ({ documents: [] })),
      
      databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [
        Query.equal('offerType', 'product'),
        Query.equal('isActive', true),
        Query.equal('status', 'active'),
        Query.limit(5)
      ]).catch(() => ({ documents: [] })),
      
      databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
        Query.greaterThan('STOCK', 0),
        Query.orderAsc('PRICE'),
        Query.limit(100)
      ]).catch(() => ({ documents: [] }))
    ]);

    const activeProducts = pRes.documents
      .filter((p: any) => p.ISACTIVE !== false)
      .slice(0, 80)
      .map((p: any) => normalizeProductImages(p));

    const activeCheapestProducts = cheapRes.documents
      .filter((p: any) => p.ISACTIVE !== false)
      .slice(0, 12)
      .map((p: any) => normalizeProductImages(p));

    const result = {
      categories: cRes.documents,
      subcategories: scRes.documents,
      products: activeProducts,
      cheapestProducts: activeCheapestProducts,
      destacadoTemporal: dtRes.documents.length > 0 ? dtRes.documents[0] : null,
      packTimer: ptRes.documents.length > 0 ? ptRes.documents[0] : null,
      timedOffers: toRes.documents
    };

    memoryCacheHome = result;
    memoryCacheHomeTime = Date.now();
    return result;
  },
  ['yaxsell-home-data-v3'],
  { revalidate: 60, tags: ['home', 'products', 'offers'] }
);

export async function GET() {
  try {
    const data = await getCachedHomeData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API public-data/home] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
