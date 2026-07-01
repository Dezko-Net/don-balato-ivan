import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';

function getServerDb() {
  const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1').replace(/\/$/, '');
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
  const apiKey = process.env.APPWRITE_API_KEY || '';
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return {
    databases: new Databases(client),
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  };
}
import { unstable_cache } from 'next/cache';

const getCachedStockAlerts = unstable_cache(
  async () => {
    const { databases, databaseId } = getServerDb();
    if (!databaseId) return [];

    const allDocs: any[] = [];
    let offset = 0;
    while (true) {
      const r = await databases.listDocuments(databaseId, 'stock_alerts', [
        Query.limit(2000), 
        Query.offset(offset)
      ]).catch(() => ({ documents: [] }));
      
      allDocs.push(...r.documents);
      if (r.documents.length < 2000) break;
      offset += 2000;
    }
    return allDocs;
  },
  ['all-stock-alerts-cache'],
  { revalidate: 300, tags: ['stock-alerts'] } // 5 minutes cache
);

export async function GET() {
  try {
    const alerts = await getCachedStockAlerts();
    return NextResponse.json({ documents: alerts });
  } catch (error: any) {
    console.error('[API admin/stock-alerts] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
