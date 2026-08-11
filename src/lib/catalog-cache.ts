import { unstable_cache } from 'next/cache';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { normalizeProductImages } from '@/lib/product-images';
import { serverListDocuments } from '@/lib/appwrite-server';
import { VENDORS_COLLECTION_ID } from '@/lib/appwrite-admin';

// Módulo compartido del catálogo completo cacheado.
// La MISMA key/tag que usaba /api/public-data/products, así que quien lo
// importe (products route, sitemap, generateMetadata de producto) comparte
// UNA sola entrada de caché → cero lecturas extra a Appwrite.

// Guard anti-estampida de 2s SOLAMENTE (un TTL largo aquí envenena la purga:
// al revalidar el tag, la función re-ejecutada devolvería memoria stale y
// unstable_cache la re-guardaría por 24h — ver nota en public-data/home).
let memoryCacheAllProducts: any[] | null = null;
let memoryCacheAllProductsTime = 0;

// Cache all active products for 24h. This is the only heavy query (cursor loop
// over ALL products = ~1 Appwrite read POR DOCUMENTO per refresh). At 24h it's
// one refresh/day. Safe because every product edit invalidates the 'products'
// tag on-demand, so the catalog never goes stale beyond an actual change.
export const getCachedAllProducts = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheAllProducts && (now - memoryCacheAllProductsTime < 2000)) {
      return memoryCacheAllProducts;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    let allProducts = [];
    let lastId = null;
    const limit = 100;

    while (true) {
      const queries = [
        Query.limit(limit),
        Query.greaterThanEqual('STOCK', 0)
      ];
      if (lastId) {
        queries.push(Query.cursorAfter(lastId));
      }

      const response = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, queries);
      if (response.documents.length === 0) {
        break;
      }

      allProducts.push(...response.documents);
      lastId = response.documents[response.documents.length - 1].$id;

      if (response.documents.length < limit) {
        break;
      }
    }

    // Fetch vendor names for products that have VENDOR_ID
    const vendorIds = [...new Set(allProducts.map(p => p.VENDOR_ID).filter(Boolean))];
    const vendorNames: Record<string, string> = {};
    if (vendorIds.length > 0) {
      try {
        for (const vid of vendorIds) {
          try {
            const vdoc = await serverListDocuments(VENDORS_COLLECTION_ID, [Query.equal('$id', vid), Query.limit(1)]);
            if (vdoc.documents.length > 0) {
              vendorNames[vid] = String(vdoc.documents[0].NAME || '');
            }
          } catch {}
        }
      } catch {}
    }

    // Normalize images on fetch and attach vendor name
    const normalized = allProducts.map(p => {
      const np = normalizeProductImages(p as any) as any;
      if (p.VENDOR_ID && vendorNames[p.VENDOR_ID]) {
        np.VENDOR_NAME = vendorNames[p.VENDOR_ID];
        np.VENDOR_IS_MAIN = false;
      } else {
        np.VENDOR_NAME = 'Don Balato Ivan';
        np.VENDOR_IS_MAIN = true;
      }
      return np;
    });
    memoryCacheAllProducts = normalized;
    memoryCacheAllProductsTime = Date.now();
    return normalized;
  },
  ['all-public-products-cache-v7'],
  { revalidate: 86400, tags: ['products'] }
);
