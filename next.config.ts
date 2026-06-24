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
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=300',
          },
        ],
      },
      {
        // API routes — nunca cachear, excepto las optimizadas para Edge Caching público
        source: '/api/((?!appwrite-proxy|public-data|version|template|store-settings|theme-config).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
      {
        // JS/CSS assets ya tienen hash en el nombre — cachearlos sí
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
