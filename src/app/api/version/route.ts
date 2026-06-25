import { NextResponse } from 'next/server';
import { trackRead } from '@/lib/appwrite-read-tracker';

const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '6a0a4e8d0032177f3f90';
const DATABASE_ID = '6a0a58ca001798410d86';
const COLLECTION_ID = 'theme_config';
const DOC_ID = 'homepage_sections';
const API_KEY = process.env.APPWRITE_API_KEY || '';

// GET - Returns the last updated timestamp of the theme config
// Clients poll this to detect when admin has made changes
export async function GET() {
  try {
    trackRead('get', COLLECTION_ID, `id=${DOC_ID}`, new Error().stack || '');
    const res = await fetch(
      `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${DOC_ID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY,
        },
      }
    );

    if (res.ok) {
      const doc = await res.json();
      // $updatedAt is Appwrite's automatic ISO timestamp — convert to ms for comparison
      const raw = doc.$updatedAt || doc.UPDATEDAT;
      const updatedAt = raw ? new Date(raw).getTime() : 0;
      return NextResponse.json(
        { updatedAt },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return NextResponse.json(
      { updatedAt: 0 },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { updatedAt: 0 },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }
}
