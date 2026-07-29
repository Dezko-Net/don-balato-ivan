import { NextRequest, NextResponse } from 'next/server';
import { getServices, getAppwriteConfig, PRODUCT_VOTES_COLLECTION, ID, Query } from '@/lib/appwrite';
import { unstable_cache, revalidateTag } from 'next/cache';

// Título de producto: se usa como clave de agrupación y se guarda tal cual.
// Sin tope, un POST podía escribir strings arbitrariamente largos.
const MAX_TITLE_LEN = 120;

export async function POST(request: NextRequest) {
  try {
    const { productTitle, userId, userName, userEmail } = await request.json();

    if (!productTitle || typeof productTitle !== 'string') {
      return NextResponse.json({ error: 'Product title is required' }, { status: 400 });
    }
    const title = productTitle.trim().slice(0, MAX_TITLE_LEN);
    if (!title) {
      return NextResponse.json({ error: 'Product title is required' }, { status: 400 });
    }

    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // ⚠️ Antes la deduplicación solo corría `if (userId)`: omitiendo userId
    // cualquiera podía escribir votos ilimitados, cada uno un documento nuevo en
    // Appwrite. Ahora SIEMPRE se deduplica — por usuario si viene identificado,
    // y si no por IP.
    const dedupeQueries = userId
      ? [Query.equal('PRODUCTTITLE', title), Query.equal('USERID', userId)]
      : [Query.equal('PRODUCTTITLE', title), Query.equal('IPADDRESS', ipAddress)];

    const existing = await databases.listDocuments(databaseId, PRODUCT_VOTES_COLLECTION, [
      ...dedupeQueries,
      Query.limit(1),
    ]);
    if (existing.documents.length > 0) {
      return NextResponse.json({ error: 'Ya votaste por este producto' }, { status: 400 });
    }

    const vote = await databases.createDocument(
      databaseId,
      PRODUCT_VOTES_COLLECTION,
      ID.unique(),
      {
        PRODUCTTITLE: title,
        USERID: userId || null,
        USERNAME: userName || 'Anónimo',
        USEREMAIL: userEmail || null,
        CREATEDAT: Date.now(),
        IPADDRESS: ipAddress,
      }
    );

    // El GET está cacheado: purgar para que el conteo suba al instante.
    revalidateTag('product-votes');

    return NextResponse.json({ success: true, vote });
  } catch (error: unknown) {
    console.error('Error creating vote:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// ⚠️ Este GET leía hasta 1000 DOCUMENTOS de Appwrite en cada petición, sin
// caché de ningún tipo y con la ruta accesible públicamente: bastaban unos
// cientos de requests para quemar la cuota diaria de lecturas. Ahora el
// agregado se calcula una vez y se cachea (el POST lo purga al votar).
const getCachedVotes = unstable_cache(
  async () => {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();

    const votes = await databases.listDocuments(databaseId, PRODUCT_VOTES_COLLECTION, [
      Query.orderDesc('CREATEDAT'),
      Query.limit(1000),
    ]);

    // Group by product title and count
    const voteCounts: Record<string, { count: number; voters: string[] }> = {};
    votes.documents.forEach((vote: any) => {
      const title = vote.PRODUCTTITLE;
      if (!voteCounts[title]) {
        voteCounts[title] = { count: 0, voters: [] };
      }
      voteCounts[title].count++;
      if (vote.USERNAME) {
        voteCounts[title].voters.push(vote.USERNAME);
      }
    });

    // Sort by count
    return Object.entries(voteCounts)
      .map(([title, data]) => ({ title, count: data.count, voters: data.voters }))
      .sort((a, b) => b.count - a.count);
  },
  ['product-votes-aggregate-v1'],
  { revalidate: 3600, tags: ['product-votes'] }
);

export async function GET() {
  try {
    const sorted = await getCachedVotes();
    return NextResponse.json({ votes: sorted }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
    });
  } catch (error: unknown) {
    console.error('Error fetching votes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
