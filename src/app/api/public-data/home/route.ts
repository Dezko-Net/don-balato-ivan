import { NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';
import { normalizeProductImages } from '@/lib/product-images';

// Configurar el entorno para que sea estático pero revalide en base a ISR (o cache interno)
// force-dynamic removed to allow Vercel CDN caching via s-maxage header

// Caché en memoria de respaldo para cold starts
let memoryCacheHome: any = null;
let memoryCacheHomeTime = 0;

const getCachedHomeData = unstable_cache(
  async () => {
    const now = Date.now();
    // ⚠️ Guard anti-estampida de 2s SOLAMENTE. Antes era 5 MINUTOS y envenenaba
    // la purga: al revalidar el tag, esta función se re-ejecuta pero devolvía el
    // caché en memoria viejo → unstable_cache re-guardaba datos stale por 24h
    // más (por eso el home seguía mostrando productos/fotos antiguos tras purgar).
    if (memoryCacheHome && (now - memoryCacheHomeTime < 2000)) {
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
        Query.limit(80)
      ]).catch(() => ({ documents: [] })).then((r: any) => ({
        ...r,
        documents: (r.documents || []).filter((p: any) => !p.VENDOR_ID)
      })),
      
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
        Query.limit(12)
      ]).catch(() => ({ documents: [] })).then((r: any) => ({
        ...r,
        documents: (r.documents || []).filter((p: any) => !p.VENDOR_ID)
      }))
    ]);

    const result = {
      categories: cRes.documents,
      subcategories: scRes.documents,
      products: pRes.documents.map((p: any) => normalizeProductImages(p)),
      cheapestProducts: cheapRes.documents.map((p: any) => normalizeProductImages(p)),
      destacadoTemporal: dtRes.documents.length > 0 ? dtRes.documents[0] : null,
      packTimer: ptRes.documents.length > 0 ? ptRes.documents[0] : null,
      timedOffers: toRes.documents
    };

    memoryCacheHome = result;
    memoryCacheHomeTime = Date.now();
    return result;
  },
  ['yaxsell-home-data-v3'],
  { revalidate: 86400, tags: ['home', 'products', 'offers'] }
);

export async function GET() {
  try {
    const data = await getCachedHomeData();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' }
    });
  } catch (error: any) {
    console.error('[API public-data/home] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
