import { NextRequest, NextResponse } from 'next/server';

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const API_KEY = process.env.APPWRITE_API_KEY || '';

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
