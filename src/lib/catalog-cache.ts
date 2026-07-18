import { unstable_cache } from 'next/cache';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { normalizeProductImages } from '@/lib/product-images';

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

    // Normalize images on fetch
    const normalized = allProducts.map(p => normalizeProductImages(p as any));
    memoryCacheAllProducts = normalized;
    memoryCacheAllProductsTime = Date.now();
    return normalized;
  },
  ['all-public-products-cache-v3'],
  { revalidate: 86400, tags: ['products'] }
);
