import { NextRequest, NextResponse } from 'next/server';

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const API_KEY =
  process.env.APPWRITE_API_KEY ||
  'standard_36d66a586c5975803e1bb17c5bcd8bb4146a1ee594b31be56fd22a537043adf5cbae612072df4f25873e3d388c4f6dc494beb6a8a56fbfd0c5d878552a622a35762e78dae181636818840ba3eeb07227efbc0b2a1d08893e740e7f56941b427b81f6c675fdd90ca5fe896cd46aeb7e5027736fe5fb40c480ea2f8363ca89740a';

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
