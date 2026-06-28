import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments } from '@/lib/appwrite-server';
import { CATALOG_PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION } from '@/lib/appwrite';
import { unstable_cache } from 'next/cache';

const getCachedCounts = (category: string) => unstable_cache(
  async () => {
    const baseQueries = [
      JSON.stringify({ method: 'equal', attribute: 'ISACTIVE', values: [true] }),
      JSON.stringify({ method: 'notEqual', attribute: 'IMAGEURL', values: [''] }),
    ];

    if (category) {
      const catQuery = JSON.stringify({ method: 'equal', attribute: 'CATEGORYID', values: [category] });

      const [totalRes, subRes] = await Promise.all([
        serverListDocuments(CATALOG_PRODUCTS_COLLECTION, [...baseQueries, catQuery, JSON.stringify({ method: 'limit', values: [1] })]),
        serverListDocuments(SUBCATEGORIES_COLLECTION, [
          JSON.stringify({ method: 'equal', attribute: 'categoryId', values: [category] }),
          JSON.stringify({ method: 'orderAsc', attribute: '$createdAt' }),
          JSON.stringify({ method: 'limit', values: [50] }),
        ]),
      ]);

      const subcategoryCounts: Record<string, number> = {};
      const subQueries = subRes.documents.map((sub: any) =>
        serverListDocuments(CATALOG_PRODUCTS_COLLECTION, [
          ...baseQueries,
          catQuery,
          JSON.stringify({ method: 'equal', attribute: 'SUBCATEGORYID', values: [sub.$id] }),
          JSON.stringify({ method: 'limit', values: [1] }),
        ]).then(r => { subcategoryCounts[sub.$id] = r.total; })
      );
      await Promise.all(subQueries);

      return {
        total: totalRes.total,
        subcategories: subRes.documents,
        subcategoryCounts,
      };
    }

    // No category selected: get total + per-category counts
    const [totalRes, catRes] = await Promise.all([
      serverListDocuments(CATALOG_PRODUCTS_COLLECTION, [...baseQueries, JSON.stringify({ method: 'limit', values: [1] })]),
      serverListDocuments(CATEGORIES_COLLECTION, [
        JSON.stringify({ method: 'orderAsc', attribute: '$createdAt' }),
        JSON.stringify({ method: 'limit', values: [30] }),
      ]),
    ]);

    const categoryCounts: Record<string, number> = {};
    const catQueries = catRes.documents.map((cat: any) =>
      serverListDocuments(CATALOG_PRODUCTS_COLLECTION, [
        ...baseQueries,
        JSON.stringify({ method: 'equal', attribute: 'CATEGORYID', values: [cat.$id] }),
        JSON.stringify({ method: 'limit', values: [1] }),
      ]).then(r => { categoryCounts[cat.$id] = r.total; })
    );
    await Promise.all(catQueries);

    return {
      total: totalRes.total,
      categories: catRes.documents,
      categoryCounts,
    };
  },
  ['catalog-counts', category || 'all'],
  { revalidate: 900, tags: ['catalog-counts'] }
)();

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category') || '';
    const data = await getCachedCounts(category);

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' },
    });
  } catch (error: any) {
    console.error('[API public-data/catalog-counts] Error:', error);
    return NextResponse.json({ error: error.message, total: 0 }, { status: 500 });
  }
}
