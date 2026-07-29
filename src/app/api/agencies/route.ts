import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { revalidatePath, unstable_cache, revalidateTag } from 'next/cache';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = 'donbalatoivan';
const DATABASE_ID = '6a62e7440033d2278d28';
const COLLECTION_ID = 'shipping_agencies';
const API_KEY = process.env.APPWRITE_API_KEY || '';

// force-dynamic removed to allow Vercel CDN caching via s-maxage header

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Las agencias de envío las edita el admin y cambian casi nunca, pero este GET
// hacía un listDocuments crudo (100 docs) en CADA request del checkout y de
// /pedido/[id], protegido solo por el header de CDN. Cacheado con tag propio:
// el POST/PUT de más abajo lo purga para que un alta se vea al instante.
const getCachedAgencies = unstable_cache(
  async () => {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100),
    ]);

    // Filter active agencies in JS — avoids relying on Appwrite index on 'active' field
    return res.documents
      .filter(doc => doc.active !== false) // include active:true and undefined (default true)
      .map(doc => ({
        id: doc.$id,
        name: doc.name,
        color: doc.color || '#3483fa',
        bg: doc.bg || '#e8f0fe',
        desc: doc.desc || '',
        logo: doc.logo || '',
        active: doc.active ?? true,
      }));
  },
  ['shipping-agencies-cache-v1'],
  { revalidate: 86400, tags: ['agencies'] }
);

// GET /api/agencies — fetch all active agencies for checkout
export async function GET() {
  try {
    const agencies = await getCachedAgencies();

    return NextResponse.json({ agencies }, {
      headers: {
        // Cache for 5 minutes only — so new agencies appear quickly after admin saves
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    });
  } catch (e: any) {
    // If collection doesn't exist yet, return empty
    if (e?.message?.includes('Collection not found') || e?.code === 404) {
      return NextResponse.json({ agencies: [] });
    }
    console.error('Error fetching agencies:', e?.message);
    return NextResponse.json({ agencies: [] });
  }
}

// POST /api/agencies — save full list of agencies (upsert)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agencies } = body as { agencies: Array<{ id?: string; name: string; color: string; bg: string; desc: string; logo: string; active: boolean }> };

    if (!Array.isArray(agencies)) {
      return NextResponse.json({ error: 'agencies must be an array' }, { status: 400 });
    }

    // Fetch existing docs to know which to update vs create vs delete
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(100)]);
    const existingIds = new Set(existing.documents.map(d => d.$id));
    const incomingIds = new Set(agencies.filter(a => a.id).map(a => a.id));

    // Delete removed agencies
    for (const doc of existing.documents) {
      if (!incomingIds.has(doc.$id)) {
        try { await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id); } catch {}
      }
    }

    // Create or update
    const results: any[] = [];
    for (const agency of agencies) {
      const payload = {
        name: agency.name,
        color: agency.color || '#3483fa',
        bg: agency.bg || '#e8f0fe',
        desc: agency.desc || '',
        logo: agency.logo || '',
        active: agency.active ?? true,
      };

      try {
        if (agency.id && existingIds.has(agency.id)) {
          const doc = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, agency.id, payload);
          results.push({ id: doc.$id, ...payload });
        } else {
          const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
          results.push({ id: doc.$id, ...payload });
        }
      } catch (e: any) {
        console.error('Error upserting agency:', agency.name, e?.message);
      }
    }

    // Invalidate Vercel CDN + Next.js route cache so checkout sees the new agencies immediately
    try { revalidatePath('/api/agencies'); } catch {}
    // Purga el unstable_cache del GET para que el alta/edición se vea al instante
    try { revalidateTag('agencies'); } catch {}

    return NextResponse.json({ success: true, agencies: results });
  } catch (e: any) {
    console.error('Error saving agencies:', e?.message);
    return NextResponse.json({ error: e?.message || 'Error saving agencies' }, { status: 500 });
  }
}
