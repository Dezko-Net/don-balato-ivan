import type { NextConfig } from 'next';

process.env.TZ = 'America/Santiago';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        // HTML pages — Service Worker maneja caché inteligentemente
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
      {
        // API routes — nunca cachear, excepto las optimizadas para Edge Caching público
        source: '/api/((?!appwrite-proxy|public-data|version|template|store-settings|theme-config|ofertas|agencies).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
      {
        // JS/CSS assets: en PRODUCCIÓN llevan hash en el nombre → immutable OK.
        // En DEV los chunks NO llevan hash (app/carrito/page.js) — cachearlos
        // 1 año hacía que el navegador ejecutara código viejo tras cada cambio.
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'production'
              ? 'public, max-age=31536000, immutable'
              : 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
