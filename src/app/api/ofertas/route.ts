import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, THEME_CONFIG_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';

const DOC_ID = 'ofertas_section';
export const revalidate = 60; // Cache for 60 seconds at Edge/Server level

// GET - Get list of selected product IDs
export async function GET() {
  try {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    try {
      const doc = await databases.getDocument(databaseId, THEME_CONFIG_COLLECTION, DOC_ID);
      const productIds = JSON.parse(doc.SECTIONS || '[]');
      return NextResponse.json(
        { success: true, productIds },
        { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
      );
    } catch (e: any) {
      // If it doesn't exist, create it empty
      if (e.code === 404) {
        await databases.createDocument(databaseId, THEME_CONFIG_COLLECTION, DOC_ID, {
          NAME: 'ofertas_section',
          SECTIONS: '[]',
        });
        return NextResponse.json(
          { success: true, productIds: [] },
          { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
        );
      }
      throw e;
    }
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
