import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';
import { normalizeProductImages } from '@/lib/product-images';

// force-dynamic removed to allow Vercel CDN caching via s-maxage header

const getCachedProductDetail = unstable_cache(
  async (id: string) => {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    try {
      // 1. Fetch Product
      const doc = await databases.getDocument(databaseId, PRODUCTS_COLLECTION, id);
      const product = normalizeProductImages(doc as any);

      // 2. Fetch Linked Products (Variantes)
      let linkedProducts: any[] = [];
      let variantLabels: Record<string, string> = {};
      if (product.GROUPID) {
        try {
          const linkedRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
            Query.equal('GROUPID', product.GROUPID),
            Query.limit(20)
          ]);
          linkedProducts = linkedRes.documents.map((p: any) => normalizeProductImages(p));

          const grpRes = await databases.listDocuments(databaseId, 'product_groups', [
            Query.equal('GROUPID', product.GROUPID),
            Query.limit(1)
          ]);
          if (grpRes.documents.length > 0) {
            const grpDoc = grpRes.documents[0] as any;
            if (grpDoc.VARIANT_LABELS) {
              variantLabels = JSON.parse(grpDoc.VARIANT_LABELS);
            }
          }
        } catch (e) {
          console.warn('Error fetching linked products', e);
        }
      }

      // 3. Fetch Category and Related
      let category: any = null;
      let relatedProducts: any[] = [];
      if (product.CATEGORYID) {
        try {
          const catDoc = await databases.getDocument(databaseId, CATEGORIES_COLLECTION, product.CATEGORYID);
          category = catDoc;
          
          const relRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
            Query.equal('CATEGORYID', product.CATEGORYID),
            Query.limit(9),
          ]);
          relatedProducts = relRes.documents
            .map((p: any) => normalizeProductImages(p))
            .filter((r: any) => r.$id !== id)
            .slice(0, 6);
        } catch (e) {
          console.warn('Error fetching related', e);
        }
      }

      // 4. Fetch Timed Offers
      let activeOffer = null;
      try {
        const [offerRes, packRes] = await Promise.all([
          databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [
            Query.equal('targetId', product.$id),
            Query.equal('isActive', true),
            Query.equal('status', 'active'),
            Query.limit(1),
          ]),
          databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [
            Query.equal('offerType', 'pack_timer'),
            Query.equal('isActive', true),
            Query.limit(1),
          ]).catch(() => ({ documents: [] }))
        ]);

        const active = offerRes.documents.filter((o: any) => {
          if (!o.isActive || o.status !== 'active') return false;
          if (o.timeType === 'endDateTime' && o.endDateTime) {
            return new Date(o.endDateTime) > new Date();
          }
          if (o.timeType === 'duration' && o.durationHours) {
            const start = o.activatedAt || o.$createdAt;
            if (start) {
              return (new Date(start).getTime() + o.durationHours * 3600000) > Date.now();
            }
          }
          return true;
        });

        if (active.length > 0) {
          let resolvedOffer = active[0];
          if (packRes.documents && packRes.documents.length > 0) {
            const packDoc = packRes.documents[0] as any;
            resolvedOffer = {
              ...resolvedOffer,
              timeType: 'endDateTime',
              endDateTime: packDoc.endDateTime,
            };
          }
          activeOffer = resolvedOffer;
        }
      } catch (e) {
        console.warn('Error fetching timed offers', e);
      }

      return {
        product,
        linkedProducts,
        variantLabels,
        category,
        relatedProducts,
        activeOffer
      };
    } catch (error) {
      throw error;
    }
  },
  ['product-detail-cache-v1'], // We'll pass the ID below dynamically
  { revalidate: 86400, tags: ['products'] }
);

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    // Call inner function directly since unstable_cache needs the arg array appended
    // Wait, unstable_cache wraps the function, so we can just call it directly!
    // But to ensure the cache key changes per product, we wrap it properly.
    
    // We'll define the cached function dynamically or pass the ID to it.
    // In Next.js unstable_cache, the arguments passed to the function are automatically included in the cache key.
    
    const data = await getCachedProductDetail(id);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' }
    });
  } catch (error: any) {
    console.error('[API public-data/product-detail] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
