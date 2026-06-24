'use client';

import { useEffect } from 'react';

const CACHE_RULES: Record<string, number> = {
  '/api/public-data/products': 300000,       // 5 minutes
  '/api/public-data/catalog': 600000,        // 10 minutes
  '/api/agencies': 600000,                   // 10 minutes
  '/api/public-data/hotspots': 300000,       // 5 minutes
  '/api/public-data/home': 300000,           // 5 minutes
  '/api/public-data/subcategories': 600000,  // 10 minutes
  '/api/public-data/product-detail': 120000, // 2 minutes
  '/api/public-data/apertura': 600000,       // 10 minutes
  '/api/store-settings': 600000,             // 10 minutes
  '/api/ofertas': 300000,                    // 5 minutes
  '/api/theme-config': 300000,               // 5 minutes
};

export default function ClientFetchCache() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clean up any stale service workers to prevent cached chunk loading errors (white screen of death)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch((err) => console.warn('[ServiceWorker] Clean up failed:', err));
    }

    // Prevent double initializing
    if ((window as any).__fetchCacheInitialized) return;
    (window as any).__fetchCacheInitialized = true;

    const originalFetch = window.fetch;
    const cacheMap = new Map<string, { data: any; timestamp: number }>();
    const pendingRequests = new Map<string, Promise<any>>();

    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const urlString = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.href 
          : input.url;

      const isGet = !init?.method || init.method.toUpperCase() === 'GET';
      
      // Find matching rule
      let matchedPath = '';
      for (const path in CACHE_RULES) {
        if (urlString.includes(path)) {
          matchedPath = path;
          break;
        }
      }

      if (matchedPath && isGet) {
        let ttl = CACHE_RULES[matchedPath];


        const cacheKey = urlString;
        const cached = cacheMap.get(cacheKey);
        const now = Date.now();

        if (cached && (now - cached.timestamp < ttl)) {
          return new Response(JSON.stringify(cached.data), {
            status: 200,
            headers: { 
              'Content-Type': 'application/json', 
              'X-Client-Cache': 'HIT',
              'Access-Control-Allow-Origin': '*' 
            }
          });
        }

        let pending = pendingRequests.get(cacheKey);
        if (!pending) {
          pending = (async () => {
            const response = await originalFetch(input, init);
            if (!response.ok) {
              throw new Error(`Fetch failed: ${response.status}`);
            }
            const data = await response.json();
            cacheMap.set(cacheKey, { data, timestamp: Date.now() });
            return data;
          })();
          pendingRequests.set(cacheKey, pending);

          pending.then(
            () => pendingRequests.delete(cacheKey),
            () => pendingRequests.delete(cacheKey)
          );
        }

        try {
          const data = await pending;
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 
              'Content-Type': 'application/json', 
              'X-Client-Cache': 'MISS',
              'Access-Control-Allow-Origin': '*' 
            }
          });
        } catch (err) {
          console.warn('[Fetch Cache] Failed, falling back to network fetch', err);
          return originalFetch(input, init);
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      // Restore on unmount if hot reloaded
      window.fetch = originalFetch;
      (window as any).__fetchCacheInitialized = false;
    };
  }, []);

  return null;
}
