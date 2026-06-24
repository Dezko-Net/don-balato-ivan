import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, THEME_CONFIG_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';

const DOC_ID = 'ofertas_section';
// force-dynamic removed to allow Vercel CDN caching via s-maxage header

const getCachedOfertas = unstable_cache(
  async () => {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    try {
      const doc = await databases.getDocument(databaseId, THEME_CONFIG_COLLECTION, DOC_ID);
      return JSON.parse(doc.SECTIONS || '[]');
    } catch (e: any) {
      if (e.code === 404) {
        await databases.createDocument(databaseId, THEME_CONFIG_COLLECTION, DOC_ID, {
          NAME: 'ofertas_section',
          SECTIONS: '[]',
        });
        return [];
      }
      throw e;
    }
  },
  ['ofertas-cache'],
  { revalidate: 300, tags: ['ofertas'] } // 5 minutes cache globally
);

// GET - Get list of selected product IDs
export async function GET() {
  try {
    const productIds = await getCachedOfertas();
    return NextResponse.json(
      { success: true, productIds },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' } }
    );
  } catch (error: any) {
    console.error('[API ofertas] GET Exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
// POST - Update list of selected product IDs
export async function POST(req: NextRequest) {
  try {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const body = await req.json();
    const productIds = body.productIds || [];
    const sectionsStr = JSON.stringify(productIds);

    try {
      await databases.updateDocument(databaseId, THEME_CONFIG_COLLECTION, DOC_ID, {
        SECTIONS: sectionsStr,
      });
      return NextResponse.json({ success: true });
    } catch (e: any) {
      // If not exists, create
      if (e.code === 404) {
        await databases.createDocument(databaseId, THEME_CONFIG_COLLECTION, DOC_ID, {
          NAME: 'ofertas_section',
          SECTIONS: sectionsStr,
        });
        return NextResponse.json({ success: true });
      }
      throw e;
    }
  } catch (error: any) {
    console.error('[API ofertas] POST Exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
