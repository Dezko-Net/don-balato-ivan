import { NextRequest, NextResponse } from 'next/server';

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a0a4e8d0032177f3f90';
const API_KEY =
  process.env.APPWRITE_API_KEY ||
  'standard_c476eaadc21bbecc3b6949ee4d0a932613b7a3d4ee52c80cf2c1406750ff75267becfad617da0acd444d0b903b8faea19661d48b2f8b6dc09b678e0db164ddd4b472417c3477a091188554bdd2adfad944778a2927090744ae991c9dcf48c7cebc60e437f5c8a841ffb0736da27daf197bf5716065c2ea5dda65070b07d74642';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
    }

    // Strip mode=admin if present
    const cleanUrl = url.replace(/&?mode=admin/, '').replace(/\?mode=admin/, '?').replace(/\?$/, '');

    // Fetch ALL URLs server-side to avoid CORS issues
    // For Appwrite URLs, add auth headers
    const isAppwrite = cleanUrl.includes('cloud.appwrite.io') || cleanUrl.includes('/storage/buckets/');
    const headers: Record<string, string> = {};
    if (isAppwrite) {
      headers['X-Appwrite-Project'] = PROJECT_ID;
      headers['X-Appwrite-Key'] = API_KEY;
    }

    const res = await fetch(cleanUrl, { headers });

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'CDN-Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
