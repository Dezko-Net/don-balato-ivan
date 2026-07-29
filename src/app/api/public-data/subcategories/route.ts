import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, SUBCATEGORIES_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { unstable_cache } from 'next/cache';

// force-dynamic removed to allow Vercel CDN caching via s-maxage header

// ⚠️ Guard anti-estampida de 2s SOLAMENTE. Antes era 1 HORA y envenenaba la
// purga: al revalidar el tag, unstable_cache re-ejecuta esta función, pero ella
// devolvía el caché en memoria viejo → unstable_cache re-guardaba datos stale
// por otra hora. Es la misma trampa ya documentada en catalog-cache.ts y
// public-data/home; aquí se había quedado sin corregir.
let memoryCacheSubcategories: Record<string, { data: any[]; timestamp: number }> = {};

const getCachedSubcategories = (categoryId: string) => unstable_cache(
  async () => {
    const now = Date.now();
    const cached = memoryCacheSubcategories[categoryId];
    if (cached && (now - cached.timestamp < 2000)) {
      return cached.data;
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const res = await databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION, [
      Query.equal('categoryId', categoryId),
      Query.orderAsc('$createdAt'),
      Query.limit(50),
    ]);

    memoryCacheSubcategories[categoryId] = { data: res.documents, timestamp: now };
    return res.documents;
  },
  [`subcategories-${categoryId}`],
  { revalidate: 3600, tags: [`subcategories-${categoryId}`, 'subcategories'] }
)();

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('categoryId');
    if (!categoryId) return NextResponse.json({ subcategories: [] });

    const subcategories = await getCachedSubcategories(categoryId);
    return NextResponse.json({ subcategories }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
    });
  } catch (error: any) {
    console.error('[API public-data/subcategories] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
