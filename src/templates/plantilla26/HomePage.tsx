'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 26 — Shopify Theme Capturado por FOLLA v2
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

const SHOPIFY_BASE = '/shopify/plantilla26/assets';

/* ── Clases reales del <body> del theme original (capturadas por FOLLA) ── */
const CAPTURED_BODY_CLASS = 'template-index';

/* ── CSS files: ORDEN CRÍTICO — inline primero, luego core, luego secciones ── */
const CSS_FILES = [
  `/shopify/plantilla26/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/screen.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/theme-xtra.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-print.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-menu.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shopifycloud/portable-wallets/latest/accelerated-checkout-backwards-compat.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-announcement.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-l4ne.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/theme-accessible.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-hovers.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-hovers-hack.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-validation.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-product-scrolled.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-select.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-filters.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-panels.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-compare.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-datepicker.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-search.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-ui-sliders.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-fancybox.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-hotspots.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-marquee.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-popups.css`,
  `/shopify/plantilla26/assets/css/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/async-product-variants.css`
];

/* ── JS files: solo los críticos del tema ── */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
  { src: `/shopify/plantilla26/assets/js/cdn.shopify.com/extensions/ef6faa8b-d1e4-4561-ac65-dfdcd79cf8f1/forms-2433/assets/shopify-forms-loader.js` },
  { src: `/shopify/plantilla26/assets/js/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/scripts.js` },
  { src: `/shopify/plantilla26/assets/js/xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/custom.js` },
  { src: `/shopify/plantilla26/assets/js/cdn.shopify.com/storefront/standard-actions.js`, module: true }
];

/* ── Font faces ── */
const FONT_FACE_CSS = `
@font-face {
  font-family: Inter;
  font-weight: 800;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n8.d15c916037fee1656886aab64725534609d62cc8.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n8.c88637171fecf10ab2d88c89dbf06f41a1ae8be5.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n4.b2a3f24c19b4de56e8871f609e73ca7f6d2e2bb9.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n4.af8052d517e0c9ffac7b814872cecc27ae1fa132.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 100;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n1.d6922fc1524d5070cfbded04544fe03b84246904.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n1.4a488d8300a3cf27d2b5e3a3b05110d1df51da98.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 200;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n2.63379874490a31b1ac686c7c9582ebe8c6a05610.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n2.f9faac0477da33ae7acd0ad3758c9bcf18cab36b.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 300;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n3.6faba940d2e90c9f1c2e0c5c2750b84af59fecc0.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n3.413aa818ec2103383c4ac7c3744c464d04b4db49.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n4.b2a3f24c19b4de56e8871f609e73ca7f6d2e2bb9.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n4.af8052d517e0c9ffac7b814872cecc27ae1fa132.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n5.d7101d5e168594dd06f56f290dd759fba5431d97.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n5.5332a76bbd27da00474c136abb1ca3cbbf259068.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n6.771af0474a71b3797eb38f3487d6fb79d43b6877.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n6.88c903d8f9e157d48b73b7777d0642925bcecde7.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n7.02711e6b374660cfc7915d1afc1c204e633421e4.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n7.6dab87426f6b8813070abd79972ceaf2f8d3b012.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 800;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n8.d15c916037fee1656886aab64725534609d62cc8.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n8.c88637171fecf10ab2d88c89dbf06f41a1ae8be5.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 900;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n9.5eeac4b640934cb12c98bb58e5b212c8a842a731.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n9.a68b28f7e46ea1faab81e409809ee4919dd6e3f0.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 100;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n1.d6922fc1524d5070cfbded04544fe03b84246904.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n1.4a488d8300a3cf27d2b5e3a3b05110d1df51da98.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 200;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n2.63379874490a31b1ac686c7c9582ebe8c6a05610.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n2.f9faac0477da33ae7acd0ad3758c9bcf18cab36b.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 300;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n3.6faba940d2e90c9f1c2e0c5c2750b84af59fecc0.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n3.413aa818ec2103383c4ac7c3744c464d04b4db49.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n4.b2a3f24c19b4de56e8871f609e73ca7f6d2e2bb9.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n4.af8052d517e0c9ffac7b814872cecc27ae1fa132.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n5.d7101d5e168594dd06f56f290dd759fba5431d97.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n5.5332a76bbd27da00474c136abb1ca3cbbf259068.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n6.771af0474a71b3797eb38f3487d6fb79d43b6877.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n6.88c903d8f9e157d48b73b7777d0642925bcecde7.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n7.02711e6b374660cfc7915d1afc1c204e633421e4.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n7.6dab87426f6b8813070abd79972ceaf2f8d3b012.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 800;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n8.d15c916037fee1656886aab64725534609d62cc8.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n8.c88637171fecf10ab2d88c89dbf06f41a1ae8be5.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 900;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n9.5eeac4b640934cb12c98bb58e5b212c8a842a731.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_n9.a68b28f7e46ea1faab81e409809ee4919dd6e3f0.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_i4.feae1981dda792ab80d117249d9c7e0f1017e5b3.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_i4.62773b7113d5e5f02c71486623cf828884c85c6e.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_i7.b377bcd4cc0f160622a22d638ae7e2cd9b86ea4c.woff2") format("woff2"),
       url("/shopify/plantilla26/assets/fonts/xtra-warehouse.myshopify.com/cdn/fonts/inter/inter_i7.7c69a6a34e3bb44fcf6f975857e13b9a9b25beb4.woff") format("woff");
}
@font-face { font-family: 'i'; src: url(//xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/xtra.woff2?v=74598006880499421301782204892) format('woff2'), url(//xtra-warehouse.myshopify.com/cdn/shop/t/127/assets/xtra.woff?v=112884414208285247051782204892) format('woff'); font-display: block; }
`;

export default function HomePage26() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '26';
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
    styleEl.id = 'tpl26-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* ── Load CSS files dynamically ── */
  useEffect(() => {
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl26="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl26', href);
      document.head.appendChild(link);
    });
  }, []);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla26/body-clean.html', { cache: 'no-cache' })
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
        console.error('[Plantilla26] Error loading body-clean.html', err);
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
      shop: 'xtra-warehouse.myshopify.com',
      country: 'US',
      currency: 'USD',
      locale: 'es',
      theme: { name: 'Captured Theme', id: '127' },
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
    if ((window as any).__tpl26ScriptsLoaded) return;
    (window as any).__tpl26ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl26="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl26', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla26] Failed to load:', file.src); done(); };
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
          console.warn('[Plantilla26] dispatch DOMContentLoaded/load failed:', e);
        }
      }, 500);
    })();

    return () => { (window as any).__tpl26ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* ── Loading/error states ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla26/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888' }}>
        Cargando plantilla 26...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="tpl26-shopify-root template-index"
    />
  );
}
