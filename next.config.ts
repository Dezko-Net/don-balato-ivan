import type { NextConfig } from 'next';

process.env.TZ = 'America/Santiago';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
    // Reducir tamaño de imágenes optimizadas para ahorrar bandwidth
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        // Static assets & Next.js chunks - Cache público e inmutable en Vercel CDN
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Next.js image optimization cache
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // API routes - no caché de navegador pero sí CDN (s-maxage)
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
          },
        ],
      },
      {
        // Páginas HTML - caché de navegador corto + CDN largo
        source: '/((?!_next|api|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
