import { NextRequest, NextResponse } from 'next/server';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const COLLECTION_ID = 'sequences';
const TEMPLATE_KEY = 'store_template';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

const noStoreHeaders = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};
// Permitir caché de 1 minuto para evitar 7 lecturas a la BD por cada vista de página
import { Client, Databases, Query } from 'node-appwrite';

// Fallback in-memory cache to guarantee database reads stay low even under high concurrent load
let memoryCacheAllTemplates: any = null;
let memoryCacheAllTemplatesTime = 0;
const TEMPLATE_CACHE_TTL = 300_000; // 5 minutes cache

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

/** Helper: read a single key from sequences collection */
async function readKey(key: string): Promise<number> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("key", key),
      Query.limit(1)
    ]);
    if (res.documents && res.documents.length > 0) {
      return Number(res.documents[0].value) || 0;
    }
  } catch (e) {
    console.error('readKey error:', e);
  }
  return 0;
}

/** Helper: write a single key to sequences collection (upsert) */
async function writeKey(key: string, value: number): Promise<boolean> {
  try {
    const listRes = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("key", key),
      Query.limit(1)
    ]);

    if (listRes.documents && listRes.documents.length > 0) {
      const docId = listRes.documents[0].$id;
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, { value });
      return true;
    }

    await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', { key, value });
    return true;
  } catch (e) {
    console.error('writeKey error:', e);
    return false;
  }
}
// force-dynamic removed to allow Vercel CDN caching via s-maxage header
import { unstable_cache } from 'next/cache';

const getCachedTemplates = unstable_cache(
  async () => {
    const global = await readKey(TEMPLATE_KEY) || 1;
    const sections = ['landing', 'collections', 'catalog', 'productDetail', 'cart', 'checkout'] as const;
    const result: Record<string, number> = { landing: global, collections: global, catalog: global, productDetail: global, cart: global, checkout: global };

    for (const sec of sections) {
      const val = await readKey(`${TEMPLATE_KEY}_${sec}`);
      if (val) result[sec] = val;
    }

    return { template: global, sections: result };
  },
  ['templates-cache'],
  { revalidate: 3600, tags: ['templates'] } // Cache for 1 hour globally in Vercel
);

/**
 * GET /api/template
 * Returns all section templates.
 * Query param ?section=landing to get a specific section.
 */
export async function GET(req: NextRequest) {
  try {
    const section = req.nextUrl.searchParams.get('section');
    const templates = await getCachedTemplates();

    if (section) {
      const global = templates.template;
      const val = templates.sections[section] || global;
      return NextResponse.json({ template: val, section }, { headers: noStoreHeaders });
    }

    return NextResponse.json(templates, { headers: noStoreHeaders });
  } catch (error: any) {
    console.error('[API template] Exception:', error);
    return NextResponse.json({ template: 1, sections: { landing: 1, collections: 1, catalog: 1, productDetail: 1, cart: 1, checkout: 1 }, error: error.message }, { status: 200 });
  }
}

/**
 * POST /api/template
 * Sets a template for a specific section or globally.
 * Body: { template: number, section?: string }
 * If section is provided, sets template for that section only.
 * If section is omitted, sets the global/default template.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const template = Number(body.template);
    const section = body.section as string | undefined;

    if (!template || template < 1) {
      return NextResponse.json({ success: false, error: 'Invalid template id' }, { status: 400 });
    }

    const key = section ? `${TEMPLATE_KEY}_${section}` : TEMPLATE_KEY;
    const ok = await writeKey(key, template);

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Failed to write template' }, { status: 500 });
    }

    // Invalidate in-memory cache on update so changes take effect immediately
    memoryCacheAllTemplates = null;
    memoryCacheAllTemplatesTime = 0;

    return NextResponse.json({ success: true, template, section: section || null }, { headers: noStoreHeaders });
  } catch (error: any) {
    console.error('[API template POST] Exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
