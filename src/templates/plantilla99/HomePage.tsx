'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 99 — Shopify Theme Capturado por FOLLA v2
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

const SHOPIFY_BASE = '/shopify/plantilla99/assets';

/* ── Clases reales del <body> del theme original (capturadas por FOLLA) ── */
const CAPTURED_BODY_CLASS: string = '';

/* ── CSS files: ORDEN CRÍTICO — inline primero, luego core, luego secciones ── */
const CSS_FILES = [
  `/shopify/plantilla99/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla99/assets/css/www.gstatic.com/glue/cookienotificationbar/cookienotificationbar.min.css`,
  `/shopify/plantilla99/assets/css/antigravity.google/_astro/BaseLayout.DG7uyOH1.css`,
  `/shopify/plantilla99/assets/css/antigravity.google/_astro/Header.BsI8e4AW.css`,
  `/shopify/plantilla99/assets/css/antigravity.google/_astro/index.BYZqGVMs.css`
];

/* ── JS files: solo los críticos del tema ── */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/Header.astro_astro_type_script_index_0_lang.KVEvS_RS.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/MainParticlesComponent.astro_astro_type_script_index_0_lang.Dox42TL8.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/TypedHeader.astro_astro_type_script_index_0_lang.gO3r8hlV.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/YoutubeVideoSection.astro_astro_type_script_index_0_lang.CBT2SQlO.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/AgentFirst.astro_astro_type_script_index_0_lang.DHglPJ15.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/FeatureExplorerNew.astro_astro_type_script_index_0_lang.ItaQhKl5.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/CustomCursor.astro_astro_type_script_index_0_lang.HIixua-1.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/Slider.astro_astro_type_script_index_0_lang.COD_D88F.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/UseCases.astro_astro_type_script_index_0_lang.BF9mW6Y7.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/MorphingParticlesComponent.astro_astro_type_script_index_0_lang.B4r3VvfF.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/LandingLatestBlogs.astro_astro_type_script_index_0_lang.C0pOmJid.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/DownloadSection.astro_astro_type_script_index_0_lang.DO3qSWET.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/antigravity.google/_astro/AntigravityFooter.astro_astro_type_script_index_0_lang.DQIYDjYp.js`, module: true },
  { src: `/shopify/plantilla99/assets/js/www.gstatic.com/glue/cookienotificationbar/cookienotificationbar.min.js` }
];

/* ── Font faces ── */
const FONT_FACE_CSS = `
/* Font faces: agregar manualmente si se encuentran en los CSS descargados */
`;

export default function HomePage99() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '99';
    return () => { delete document.documentElement.dataset.template; };
  }, []);

  /* ── Aplicar clases del <body> original mientras la plantilla está montada (fidelidad) ── */
  useEffect(() => {
    if (!CAPTURED_BODY_CLASS) return;
    const added = CAPTURED_BODY_CLASS.split(/\s+/).filter((c: string) => c && !document.body.classList.contains(c));
    added.forEach((c: string) => document.body.classList.add(c));
    return () => { added.forEach((c: string) => document.body.classList.remove(c)); };
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
    styleEl.id = 'tpl99-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* ── Load CSS files dynamically ── */
  useEffect(() => {
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl99="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl99', href);
      document.head.appendChild(link);
    });
  }, []);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla99/body-clean.html', { cache: 'no-cache' })
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
        console.error('[Plantilla99] Error loading body-clean.html', err);
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
      shop: 'antigravity.google',
      country: 'US',
      currency: 'USD',
      locale: 'es',
      theme: { name: 'Captured Theme', id: '6' },
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
    if ((window as any).__tpl99ScriptsLoaded) return;
    (window as any).__tpl99ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl99="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl99', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla99] Failed to load:', file.src); done(); };
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
          console.warn('[Plantilla99] dispatch DOMContentLoaded/load failed:', e);
        }
      }, 500);
    })();

    return () => { (window as any).__tpl99ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* ── Loading/error states ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla99/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888' }}>
        Cargando plantilla 99...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="tpl99-shopify-root template-index"
    />
  );
}
