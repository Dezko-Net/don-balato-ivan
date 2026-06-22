'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 101 — Shopify Theme Capturado por FOLLA v2
   ──────────────────────────────────────────────────────────────────
   ⚠️  BOILERPLATE: Requiere revisión manual antes de usar.
   ──────────────────────────────────────────────────────────────────
   Estrategia:
   - Render del HTML body limpio via containerRef.innerHTML
   - Carga dinámica de CSS via <link> tags en <head>
   - Carga dinámica de JS via <script> tags secuenciales
   - Scripts inline de animación están en body-clean.html (se ejecutan al inyectar)
   - Scripts de Shopify problemáticos excluidos
   - .in-view forzado en .animation-element tras carga
   ════════════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from 'react';

const SHOPIFY_BASE = '/shopify/plantilla101/assets';

/* ── CSS files: ORDEN CRÍTICO — inline primero, luego core, luego secciones ── */
const CSS_FILES = [
  `/shopify/plantilla101/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/critical.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/main.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/custom.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-video.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-logo-banner.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/simple-block.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-featured-collections-tabs.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/swiper.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-multicol.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-shoppable-video.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/shoppable-image.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-parallax.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-video-carousel.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-brands.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/section-blog-posts.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/cart-drawer.css`,
  `/shopify/plantilla101/assets/css/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/localization-drawer.css`
];

/* ── JS files: solo los críticos del tema ── */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/variants.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/constants.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/pubsub.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/global.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/base.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/color-swatch.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/localization-form.js`, module: true },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/animations.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/drawer-select.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/model_element.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/announcement-bar.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/search-drawer.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/page-header.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/page-header-logo-banner-v2.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/low-power-video.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/featured-collections-tabs.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/slider.js`, module: true },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/video-controls.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/shoppable-video.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/quick-add.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/subscription-widget.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/product-form.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/parallax.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/video-reels.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/cart.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/cart-drawer.js`, module: true },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/cart-drawer-note.js`, module: true },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/cart-checkbox-attribute.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/cart-additional-features.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/localization-drawer.js` },
  { src: `/shopify/plantilla101/assets/js/wonder-theme-fashion.myshopify.com/cdn/shop/t/85/assets/instantpage.js`, module: true },
  { src: `/shopify/plantilla101/assets/js/cdn.shopify.com/storefront/standard-actions.js`, module: true }
];

/* ── Font faces ── */
const FONT_FACE_CSS = `
@font-face {
  font-family: Outfit;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.387c2e2715c484a1f1075eb90d64808f1b37ac58.woff2") format("woff2"),
       url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.aca8c81f18f62c9baa15c2dc5d1f6dd5442cdc50.woff") format("woff");
}
@font-face {
  font-family: Outfit;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n7.bfc2ca767cd7c6962e82c320123933a7812146d6.woff2") format("woff2"),
       url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n7.f0b22ea9a32b6f1f6f493dd3a7113aae3464d8b2.woff") format("woff");
}
@font-face {
  font-family: Outfit;
  font-weight: 300;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n3.8c97ae4c4fac7c2ea467a6dc784857f4de7e0e37.woff2") format("woff2"),
       url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n3.b50a189ccde91f9bceee88f207c18c09f0b62a7b.woff") format("woff");
}
@font-face {
  font-family: Outfit;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.387c2e2715c484a1f1075eb90d64808f1b37ac58.woff2") format("woff2"),
       url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.aca8c81f18f62c9baa15c2dc5d1f6dd5442cdc50.woff") format("woff");
}
@font-face {
  font-family: Outfit;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.387c2e2715c484a1f1075eb90d64808f1b37ac58.woff2") format("woff2"),
       url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.aca8c81f18f62c9baa15c2dc5d1f6dd5442cdc50.woff") format("woff");
}
@font-face {
  font-family: Outfit;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.387c2e2715c484a1f1075eb90d64808f1b37ac58.woff2") format("woff2"),
       url("/shopify/plantilla101/assets/fonts/wonder-theme-fashion.myshopify.com/cdn/fonts/outfit/outfit_n4.aca8c81f18f62c9baa15c2dc5d1f6dd5442cdc50.woff") format("woff");
}
`;

export default function HomePage101() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '101';
    return () => { delete document.documentElement.dataset.template; };
  }, []);

  /* ── Load font faces ── */
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'tpl101-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* ── Load CSS files dynamically ── */
  useEffect(() => {
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl101="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl101', href);
      document.head.appendChild(link);
    });
  }, []);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla101/body-clean.html', { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(html => {
        if (aborted) return;
        setBodyHtml(html);
      })
      .catch(err => {
        if (aborted) return;
        console.error('[Plantilla101] Error loading body-clean.html', err);
        setLoadError(err.message || 'Error de carga');
      });
    return () => { aborted = true; };
  }, []);

  /* ── Set innerHTML ONCE via ref ── */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    if (containerRef.current.dataset.htmlSet) return;
    containerRef.current.innerHTML = bodyHtml;
    containerRef.current.dataset.htmlSet = '1';

    // Remove leftover Shopify elements
    const root = containerRef.current;
    root.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());
  }, [bodyHtml]);

  /* ── Inject window.Shopify stub BEFORE loading JS ── */
  useEffect(() => {
    if ((window as any).Shopify) return;
    (window as any).Shopify = {
      shop: 'wonder-theme-fashion.myshopify.com',
      country: 'US',
      currency: 'USD',
      locale: 'es',
      theme: { name: 'Captured Theme', id: '85' },
      routes: { root_url: '/', cart_url: '/cart', search_url: '/search' },
      customerAccountsEnabled: false,
    };

    // Intercept fetch/XHR to prevent 404s on /products/* and external APIs
    const origFetch = window.fetch.bind(window);
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
      if (url.startsWith('/products/') || (url.includes('/products/') && !url.includes('/shopify/'))) {
        return Promise.resolve(new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      if (url.includes('appwrite.io') || url.includes('nyc.cloud.appwrite')) {
        return Promise.resolve(new Response(JSON.stringify({}), { status: 401, headers: { 'Content-Type': 'application/json' } }));
      }
      return origFetch(input, init);
    };
  }, []);

  /* ── Load JS scripts sequentially after HTML is rendered ── */
  useEffect(() => {
    if (!bodyHtml) return;
    if ((window as any).__tpl101ScriptsLoaded) return;
    (window as any).__tpl101ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl101="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl101', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla101] Failed to load:', file.src); done(); };
      document.body.appendChild(s);
    });

    const forceInView = () => {
      // Forzar .in-view en todos los .animation-element para activar animaciones
      document.querySelectorAll('.animation-element, .animation-wrapper').forEach(el => {
        el.classList.add('in-view');
      });
      // Forzar autoplay en videos del split hero
      document.querySelectorAll('split-hero video, .split-hero video').forEach(el => {
        const video = el as HTMLVideoElement;
        video.muted = true;
        video.play().catch(() => {});
      });
      // Forzar is-collapsed en split-hero para activar morph mask
      document.querySelectorAll('.split-hero-column__media').forEach(el => {
        if (!el.classList.contains('is-collapsed')) {
          el.classList.add('is-collapsed');
        }
      });
      // Re-inicializar split-hero si existe
      document.querySelectorAll('split-hero').forEach(el => {
        try { (el as any).initParallaxScrollAnimation(); } catch(e) {}
      });
    };

    (async () => {
      for (const f of JS_FILES) {
        await loadOne(f);
      }

      // Forzar .in-view después de un breve delay para que los scripts se ejecuten
      setTimeout(() => {
        forceInView();
        try {
          document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: false }));
          window.dispatchEvent(new Event('load'));
        } catch (e) {
          console.warn('[Plantilla101] dispatch DOMContentLoaded/load failed:', e);
        }
      }, 500);
    })();

    return () => { (window as any).__tpl101ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* ── Loading/error states ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla101/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888' }}>
        Cargando plantilla 101...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="tpl101-shopify-root template-index"
    />
  );
}
