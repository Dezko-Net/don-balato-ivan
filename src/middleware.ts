import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Keywords to identify crawlers, bots, or scraping libraries
const BOT_KEYWORDS = [
  'bot',
  'spider',
  'crawler',
  'scraper',
  'archiver',
  'curl',
  'wget',
  'python',
  'node-fetch',
  'mj12',
  'semrush',
  'ahrefs',
  'screaming frog',
  'pinterest'
];

// Explicitly allow social sharing previews that users might share (e.g. TikTok, WhatsApp, Telegram, Facebook)
const ALLOWED_KEYWORDS = [
  'tiktok',
  'bytespider',
  'whatsapp',
  'telegram',
  'facebookexternalhit',
  'twitterbot',
  'discordbot'
];

export function middleware(request: NextRequest) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  
  const isBot = BOT_KEYWORDS.some(keyword => ua.includes(keyword)) &&
                !ALLOWED_KEYWORDS.some(allowed => ua.includes(allowed));

  if (isBot) {
    console.log(`[Middleware] Blocked bot request. UA: ${request.headers.get('user-agent')} | Path: ${request.nextUrl.pathname}`);
    return new NextResponse('Access Denied (Crawlers Blocked)', { status: 403 });
  }

  const response = NextResponse.next();
  const country = request.headers.get('x-vercel-ip-country');
  if (country) {
    response.cookies.set('user_country', country, { path: '/' });
  }

  // ── Monitor de requests: identifica QUÉ pega a la app (sobre todo de noche).
  // Loguea /api/* (los que pueden disparar lecturas a Appwrite). Filtra en Vercel por "[REQ]".
  // Silenciar con env LOG_REQ=0.
  if (process.env.LOG_REQ !== '0') {
    const path = request.nextUrl.pathname;
    if (path.startsWith('/api/') && !path.startsWith('/api/assets') && !path.startsWith('/api/image')) {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '?';
      console.log(`[REQ] ${path}${request.nextUrl.search} | ip:${ip} | ua:${(request.headers.get('user-agent') || '').slice(0, 70)}`);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
