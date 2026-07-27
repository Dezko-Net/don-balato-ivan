'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 666 — Shopify Theme Capturado por FOLLA v2
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

const SHOPIFY_BASE = '/shopify/plantilla666/assets';

/* ── Clases reales del <body> del theme original (capturadas por FOLLA) ── */
const CAPTURED_BODY_CLASS = 'template-index loaded has-modal-open';

/* ── CSS files: ORDEN CRÍTICO — inline primero, luego core, luego secciones ── */
const CSS_FILES = [
  `/shopify/plantilla666/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla666/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/theme.css`,
  `/shopify/plantilla666/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/apps.css`,
  `/shopify/plantilla666/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/newsletter-popup.css`,
  `/shopify/plantilla666/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/mobile-dock.css`,
  `/shopify/plantilla666/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/pickup-availability.css`,
  `/shopify/plantilla666/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/blog.css`
];

/* ── JS files: solo los críticos del tema ── */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/vendor.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/theme.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/tab-attention.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/cart.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/gift-wrapping.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/search.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/newsletter-popup.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/mobile-dock.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/pickup-availability.js` },
  { src: `/shopify/plantilla666/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/instant-page.js`, module: true },
  { src: `/shopify/plantilla666/assets/js/cdn.shopify.com/storefront/standard-actions.js`, module: true }
];

/* ── Font faces ── */
const FONT_FACE_CSS = `
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n4.b2a3f24c19b4de56e8871f609e73ca7f6d2e2bb9.woff2") format("woff2"),
       url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n4.af8052d517e0c9ffac7b814872cecc27ae1fa132.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n5.d7101d5e168594dd06f56f290dd759fba5431d97.woff2") format("woff2"),
       url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n5.5332a76bbd27da00474c136abb1ca3cbbf259068.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n7.02711e6b374660cfc7915d1afc1c204e633421e4.woff2") format("woff2"),
       url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n7.6dab87426f6b8813070abd79972ceaf2f8d3b012.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i4.feae1981dda792ab80d117249d9c7e0f1017e5b3.woff2") format("woff2"),
       url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i4.62773b7113d5e5f02c71486623cf828884c85c6e.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i7.b377bcd4cc0f160622a22d638ae7e2cd9b86ea4c.woff2") format("woff2"),
       url("/shopify/plantilla666/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i7.7c69a6a34e3bb44fcf6f975857e13b9a9b25beb4.woff") format("woff");
}
`;

export default function HomePage666() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '666';
    return () => { delete document.documentElement.dataset.template; };
  }, []);

  /* ── Aplicar clases del <body> original mientras la plantilla está montada (fidelidad) ── */
  useEffect(() => {
    if (!CAPTURED_BODY_CLASS) return;
    const added = CAPTURED_BODY_CLASS.split(/\s+/).filter(c => c && !document.body.classList.contains(c));
    added.forEach(c => document.body.classList.add(c));
    return () => { added.forEach(c => document.body.classList.remove(c)); };
  }, []);

  /* ── Host guard: el CSS global del theme pone el wrapper de YAXSEL (TemplateContext monta
        <body> > <div class="contents">) en display:none. Solo el inline !important le gana,
        pero React re-renderiza y lo borra → re-aplicar con MutationObserver + red de seguridad. ── */
  useEffect(() => {
    const apply = () => {
      const wrap = document.querySelector('body > .contents') as HTMLElement | null;
      if (wrap && wrap.style.getPropertyValue('display') !== 'contents') {
        wrap.style.setProperty('display', 'contents', 'important');
      }
    };
    apply();
    // El wrapper lo re-renderiza React (TemplateContext) y el theme lo re-oculta (regla nivel-ID
    // !important; solo el inline le gana) → re-aplicar. Observer acotado a <body> (no al subtree
    // del theme, que con GSAP mutaría sin parar) + interval barato como red de seguridad.
    const obs = new MutationObserver(apply);
    obs.observe(document.body, { childList: true });
    const wrap0 = document.querySelector('body > .contents');
    if (wrap0) obs.observe(wrap0, { attributes: true, attributeFilter: ['style', 'class'] });
    const iv = window.setInterval(apply, 400);
    // No removemos el display en cleanup: 'contents' es el valor natural del wrapper de YAXSEL.
    return () => { obs.disconnect(); window.clearInterval(iv); };
  }, []);

  /* ── Load font faces ── */
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'tpl666-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* ── Load CSS files dynamically ── */
  useEffect(() => {
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl666="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl666', href);
      document.head.appendChild(link);
    });
  }, []);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla666/body-clean.html', { cache: 'no-cache' })
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
        console.error('[Plantilla666] Error loading body-clean.html', err);
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

    // ⚠️ innerHTML NO ejecuta los <script> inline. Re-crearlos para que corran
    //    (necesario para configs del theme como window.filepaths = { async_css: ... }).
    root.querySelectorAll('script:not([src])').forEach(old => {
      const s = document.createElement('script');
      for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value);
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }, [bodyHtml]);

  /* ── Inject window.Shopify stub BEFORE loading JS ── */
  useEffect(() => {
    if ((window as any).Shopify) return;
    (window as any).Shopify = {
      shop: 'concept-theme-tech.myshopify.com',
      country: 'US',
      currency: 'USD',
      locale: 'es',
      theme: { name: 'Captured Theme', id: '191' },
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
    if ((window as any).__tpl666ScriptsLoaded) return;
    (window as any).__tpl666ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl666="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl666', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla666] Failed to load:', file.src); done(); };
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
          console.warn('[Plantilla666] dispatch DOMContentLoaded/load failed:', e);
        }
      }, 500);
    })();

    return () => { (window as any).__tpl666ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* ── Loading/error states ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla666/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888' }}>
        Cargando plantilla 666...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="tpl666-shopify-root template-index"
    />
  );
}
