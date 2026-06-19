import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, COUPONS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';

// Memory caches as fallback/secondary cache layer
let memoryCacheAllCoupons: any[] | null = null;
let memoryCacheAllCouponsTime = 0;

let memoryCacheSingleCoupons: Record<string, { data: any; timestamp: number }> = {};

const getCachedActiveCoupons = unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheAllCoupons && (now - memoryCacheAllCouponsTime < 1800000)) { // 30 minutes in memory
      return memoryCacheAllCoupons;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const res = await databases.listDocuments(databaseId, COUPONS_COLLECTION, [
      Query.equal('isActive', true),
      Query.limit(20),
    ]);

    const docs = res.documents.filter((c: any) => {
      const userRestriction = c.userRestriction || c.USERRESTRICTION || null;
      if (userRestriction && userRestriction.trim() !== '' && userRestriction.trim().toLowerCase() !== 'null') {
        return false;
      }
      return true;
    });

    memoryCacheAllCoupons = docs;
    memoryCacheAllCouponsTime = now;
    return docs;
  },
  ['active-coupons-list-cache'],
  { revalidate: 600, tags: ['coupons'] } // 10 minutes cache
);

const getCachedCouponById = (id: string) => unstable_cache(
  async () => {
    const now = Date.now();
    if (memoryCacheSingleCoupons[id] && (now - memoryCacheSingleCoupons[id].timestamp < 1800000)) {
      return memoryCacheSingleCoupons[id].data;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const doc = await databases.getDocument(databaseId, COUPONS_COLLECTION, id);
    
    memoryCacheSingleCoupons[id] = { data: doc, timestamp: now };
    return doc;
  },
  [`coupon-detail-${id}`],
  { revalidate: 600, tags: [`coupon-${id}`, 'coupons'] }
)();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const coupon = await getCachedCouponById(id);
      return NextResponse.json(coupon, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120'
        }
      });
    }

    const coupons = await getCachedActiveCoupons();
    return NextResponse.json(coupons, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120'
      }
    });
  } catch (error: any) {
    console.error('[COUPONS_API_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
