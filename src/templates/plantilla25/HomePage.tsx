'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 25 — Shopify Theme Capturado por FOLLA v2
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
import { useCart } from '@/context/CartContext';
import {
  enhanceConceptHeader,
  enhanceConceptCombos,
  syncConceptCartCount,
  type EnhCategory,
  type EnhSubcategory,
  type EnhFeaturedProduct,
  type ComboRealHydrationData,
} from './enhanceConceptHeader';
import { fixCloneBehaviour } from './fixCloneBehaviour';

const STORE_LOGO = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784931333115-pegada-1784931318404.png';
const STORE_NAME = 'Don Balato Iván';

const SHOPIFY_BASE = '/shopify/plantilla25/assets';

/* ── Clases reales del <body> del theme original (capturadas por FOLLA) ── */
const CAPTURED_BODY_CLASS = 'template-index loaded';

/* ── CSS files: ORDEN CRÍTICO — inline primero, luego core, luego secciones ── */
const CSS_FILES = [
  `/shopify/plantilla25/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla25/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/theme.css`,
  `/shopify/plantilla25/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/apps.css`,
  `/shopify/plantilla25/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/newsletter-popup.css`,
  `/shopify/plantilla25/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/mobile-dock.css`,
  `/shopify/plantilla25/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/pickup-availability.css`,
  `/shopify/plantilla25/assets/css/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/blog.css`,
  `/shopify/plantilla25/clone-fixes.css`,
  `/shopify/plantilla25/tailwind-patch.css`
];

/* ── JS files: solo los críticos del tema ── */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/vendor.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/theme.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/tab-attention.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/cart.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/gift-wrapping.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/search.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/newsletter-popup.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/mobile-dock.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/pickup-availability.js` },
  { src: `/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/191/assets/instant-page.js`, module: true },
  { src: `/shopify/plantilla25/assets/js/cdn.shopify.com/storefront/standard-actions.js`, module: true },
  { src: `/shopify/plantilla25/assets/js/flickity-touch-fix.js` }
];

/* ── Font faces ── */
const FONT_FACE_CSS = `
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n4.b2a3f24c19b4de56e8871f609e73ca7f6d2e2bb9.woff2") format("woff2"),
       url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n4.af8052d517e0c9ffac7b814872cecc27ae1fa132.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n5.d7101d5e168594dd06f56f290dd759fba5431d97.woff2") format("woff2"),
       url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n5.5332a76bbd27da00474c136abb1ca3cbbf259068.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n7.02711e6b374660cfc7915d1afc1c204e633421e4.woff2") format("woff2"),
       url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_n7.6dab87426f6b8813070abd79972ceaf2f8d3b012.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i4.feae1981dda792ab80d117249d9c7e0f1017e5b3.woff2") format("woff2"),
       url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i4.62773b7113d5e5f02c71486623cf828884c85c6e.woff") format("woff");
}
@font-face {
  font-family: Inter;
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i7.b377bcd4cc0f160622a22d638ae7e2cd9b86ea4c.woff2") format("woff2"),
       url("/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter/inter_i7.7c69a6a34e3bb44fcf6f975857e13b9a9b25beb4.woff") format("woff");
}
`;

export default function HomePage25() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { totalItems, addItem } = useCart();

  const [cats, setCats] = useState<EnhCategory[]>([]);
  const [subs, setSubs] = useState<EnhSubcategory[]>([]);
  const [catCounts, setCatCounts] = useState<Record<string, number>>({});
  const [subCounts, setSubCounts] = useState<Record<string, number>>({});
  const [featuredProd, setFeaturedProd] = useState<EnhFeaturedProduct | null>(null);
  const [combos, setCombos] = useState<ComboRealHydrationData[]>([]);

  /* ── Fetch combos / packs configuration ── */
  useEffect(() => {
    fetch('/api/public-data/combos')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.combos) && d.combos.length > 0) {
          setCombos(d.combos);
          const feat = d.combos[0].featuredProduct || d.combos[0].mainProduct;
          if (feat) {
            setFeaturedProd(feat as EnhFeaturedProduct);
          }
        }
      })
      .catch(() => {});
  }, []);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '25';
    document.documentElement.classList.add('js');
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    document.documentElement.classList.add(isTouch ? 'touch' : 'no-touch');
    document.body.setAttribute('data-title-animation', '');
    // Drag-to-scroll with pointer events
    let isDragging = false;
    let startY = 0;
    let startScrollY = 0;
    let hasMoved = false;
    let activePointerId: number | null = null;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, select, [role="button"], .pointer-events-auto, details, summary')) return;
      isDragging = true;
      hasMoved = false;
      activePointerId = e.pointerId;
      startY = e.clientY;
      startScrollY = window.scrollY;
      document.body.style.userSelect = 'none';
      document.documentElement.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== activePointerId) return;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > 3) hasMoved = true;
      window.scrollTo({ top: startScrollY - dy, behavior: 'auto' });
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== activePointerId) return;
      isDragging = false;
      activePointerId = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    const onClickBlock = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
    document.addEventListener('click', onClickBlock, true);
    return () => {
      delete document.documentElement.dataset.template;
      document.documentElement.classList.remove('js', 'touch', 'no-touch');
      document.body.removeAttribute('data-title-animation');
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerUp);
      document.removeEventListener('click', onClickBlock, true);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  /* ── Aplicar clases del <body> original mientras la plantilla está montada (fidelidad) ── */
  useEffect(() => {
    if (!CAPTURED_BODY_CLASS) return;
    const added = CAPTURED_BODY_CLASS.split(/\s+/).filter(c => c && !document.body.classList.contains(c));
    added.forEach(c => document.body.classList.add(c));
    // Atributos data-* del theme original (necesarios para bordes redondeados, etc.)
    const dataAttrs: Record<string, string> = {
      'data-rounded-button': 'round',
      'data-rounded-input': 'round-slight',
      'data-rounded-block': 'round',
      'data-rounded-card': 'round',
      'data-button-hover': 'standard',
      'data-title-animation': '',
      'data-lazy-image': '',
      'data-page-transition': '',
      'data-modal-swipe-only': '',
      'data-page-rendering': '',
    };
    for (const [k, v] of Object.entries(dataAttrs)) {
      if (!document.body.hasAttribute(k)) document.body.setAttribute(k, v);
    }
    return () => {
      added.forEach(c => document.body.classList.remove(c));
      for (const k of Object.keys(dataAttrs)) {
        if (document.body.getAttribute(k) === dataAttrs[k]) document.body.removeAttribute(k);
      }
    };
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
    styleEl.id = 'tpl25-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* ── Load CSS files dynamically ── */
  useEffect(() => {
    CSS_FILES.forEach(href => {
      const bust = `${href}?v=${Date.now()}`;
      const existing = document.querySelector(`link[data-tpl25="${href}"]`);
      if (existing) { existing.setAttribute('href', bust); return; }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = bust;
      link.setAttribute('data-tpl25', href);
      document.head.appendChild(link);
    });
  }, []);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla25/body-clean.html', { cache: 'no-cache' })
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
        console.error('[Plantilla25] Error loading body-clean.html', err);
        setLoadError(err.message || 'Error de carga');
      });
    return () => { aborted = true; };
  }, []);

  /* ── Set innerHTML ONCE via ref ── */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    if (containerRef.current.dataset.htmlSet) return;
    const route = window.location.pathname.replace(/\/$/, '') || '/';
    document.documentElement.classList.toggle('keep-mobile-dock', route === '/carrito' || route === '/cuenta');
    containerRef.current.innerHTML = bodyHtml;
    containerRef.current.dataset.htmlSet = '1';

    // Remove leftover Shopify elements
    const root = containerRef.current;
    root.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());
    root.querySelectorAll('.mobile-dock-section, #shopify-section-sections--27201778909465__mobile-dock, nav.mobile-dock').forEach(el => el.remove());

    // Hide product-bundle__sidebar on mobile unless intersecting the bundle section
    const bundleSidebar = root.querySelector('.product-bundle__sidebar') as HTMLElement | null;
    const bundleSection = root.querySelector('#shopify-section-template--27201783660825__product-bundle, #shopify-section-template--27619508257049__product-bundle, .shopify-section:has(.product-bundle)') as HTMLElement | null;
    if (bundleSidebar && bundleSection) {
      const styleId = 'bundle-sidebar-mobile-fix';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @media (max-width: 1023px) {
            .product-bundle__sidebar {
              position: fixed !important;
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              z-index: 50 !important;
              background: #ffffff !important;
              padding: 16px !important;
              box-shadow: 0 -4px 16px rgba(0,0,0,0.15) !important;
              border-top-left-radius: 16px !important;
              border-top-right-radius: 16px !important;
              max-height: 85vh !important;
              overflow-y: auto !important;
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease !important;
              transform: translateY(0) !important;
              opacity: 1 !important;
            }
            .product-bundle__sidebar.yaxsell-mobile-hidden {
              transform: translateY(120%) !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          }
        `;
        document.head.appendChild(style);
      }

      bundleSidebar.classList.add('yaxsell-mobile-hidden'); // initially hidden

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bundleSidebar.classList.remove('yaxsell-mobile-hidden');
          } else {
            bundleSidebar.classList.add('yaxsell-mobile-hidden');
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -100px 0px' });
      observer.observe(bundleSection);
    }

    // ⚠️ innerHTML NO ejecuta los <script> inline. Re-crearlos para que corran
    //    (necesario para configs del theme como window.filepaths = { async_css: ... }).
    root.querySelectorAll('script:not([src])').forEach(old => {
      const s = document.createElement('script');
      for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value);
      s.textContent = old.textContent;
      old.replaceWith(s);
    });

    const menuDrawer = root.querySelector<HTMLElement>('#MenuDrawer');
    const closeMenuDrawer = () => {
      if (!menuDrawer) return;
      menuDrawer.removeAttribute('open');
      menuDrawer.setAttribute('hidden', '');
      menuDrawer.style.display = 'none';
      menuDrawer.querySelectorAll<HTMLElement>('.overlay').forEach(overlay => {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
      });
      document.body.classList.remove('has-modal-opening', 'has-modal-open', 'drawer-open');
      document.querySelectorAll<HTMLElement>('[aria-controls="MenuDrawer"]').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
      });
      window.setTimeout(() => {
        if (menuDrawer) menuDrawer.style.display = '';
      }, 0);
    };
    menuDrawer?.querySelectorAll<HTMLElement>('.drawer__close').forEach(button => {
      button.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        closeMenuDrawer();
      };
      button.ontouchend = event => {
        event.preventDefault();
        event.stopPropagation();
        closeMenuDrawer();
      };
    });

    const handleCartTrigger = (event: Event) => {
        const target = event.target as Element | null;
        const trigger = target?.closest<HTMLElement>('[data-cart-drawer-trigger="true"], a[href="/cart"], a[href="/carrito"], .cart-drawer-button, [aria-controls="CartDrawer"]');
        if (!trigger) return;
        if (trigger.closest('.mobile-dock, .dock__item, .global-mobile-nav')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.dispatchEvent(new CustomEvent('yaxsel:open-cart'));
      };

    document.addEventListener('pointerdown', handleCartTrigger, true);
    document.addEventListener('click', handleCartTrigger, true);

    root.querySelectorAll<HTMLAnchorElement>('a[href="/cart"], a[href="/carrito"], .cart-drawer-button').forEach(trigger => {
      if (trigger.closest('.mobile-dock, .dock__item, .global-mobile-nav')) {
        trigger.setAttribute('href', '/carrito');
        trigger.removeAttribute('aria-controls');
        trigger.removeAttribute('data-no-instant');
        return;
      }
      trigger.setAttribute('data-cart-drawer-trigger', 'true');
      trigger.removeAttribute('href');
      trigger.setAttribute('role', 'button');
    });
  }, [bodyHtml]);

  /* ── Inject window.Shopify + window.theme stubs BEFORE loading JS ── */
  useEffect(() => {
    const w = window as any;
    if (!w.Shopify) {
      w.Shopify = {
        shop: 'concept-theme-tech.myshopify.com',
        country: 'US',
        currency: 'USD',
        locale: 'es',
        theme: { name: 'Captured Theme', id: '191' },
        routes: { root_url: '/', cart_url: '/cart', search_url: '/search' },
        customerAccountsEnabled: false,
      };
    }
    if (!w.theme) {
      w.theme = {
        routes: {
          root_url: '/', cart_url: '/carrito', cart_add_url: '/cart/add',
          cart_change_url: '/cart/change', cart_update_url: '/cart/update',
          search_url: '/productos', predictive_search_url: '/search/suggest',
        },
        settings: { moneyFormat: '${{amount}}', cartType: 'drawer', themeName: 'Concept', themeVersion: '5.3.3' },
        strings: {}, variantStrings: {}, cartStrings: {}, dateStrings: {},
      };
      w.themeVariables = w.theme;
    }
    if (!w.countdown) {
      w.countdown = {
        long: { day: 'día', hour: 'hora', second: 'segundo', one: { day: 'día', hour: 'hora', second: 'segundo' }, other: { day: 'días', hour: 'horas', second: 'segundos' } },
        short: { day: 'd', hour: 'h', second: 's', one: { day: 'd', hour: 'h', second: 's' }, other: { day: 'd', hour: 'h', second: 's' } },
      };
    }

    // Intercept fetch to prevent 404s on Shopify routes (/products/*, /variants/*, /cart/*)
    // but DO NOT block Appwrite calls — those are from the app itself
    const origFetch = window.fetch.bind(window);
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
      if (url.startsWith('/products/') || (url.includes('/products/') && !url.includes('/shopify/'))) {
        return Promise.resolve(new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      if (url.startsWith('/variants/') || url.includes('/variants/')) {
        return Promise.resolve(new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      if (url.startsWith('/cart/') || url.startsWith('/cart/add') || url.startsWith('/cart/change') || url.startsWith('/cart/update')) {
        return Promise.resolve(new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return origFetch(input, init);
    };
  }, []);

  /* ── Load JS scripts sequentially after HTML is rendered ── */
  useEffect(() => {
    if (!bodyHtml) return;
    if ((window as any).__tpl25ScriptsLoaded) return;
    (window as any).__tpl25ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl25="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl25', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla25] Failed to load:', file.src); done(); };
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

        // ── FLICKITY TOUCH FIX: parchar Flickity para permitir scroll vertical en móvil ──
        if (window.matchMedia('(max-width: 767px)').matches && (window as any).Flickity) {
          const proto = (window as any).Flickity.prototype;
          if (proto && !proto._touchFixedInline) {
            proto._touchFixedInline = true;
            // Cambiar touchActionValue de 'none' a 'pan-y'
            proto.touchActionValue = 'pan-y';
            // Parchar bindHandles para usar pan-y
            if (proto.bindHandles) {
              const origBind = proto.bindHandles;
              proto.bindHandles = function() {
                this.touchActionValue = 'pan-y';
                return origBind.call(this);
              };
            }
            // Parchar handleDragMove para ignorar movimientos verticales
            if (proto.handleDragMove) {
              const origDrag = proto.handleDragMove;
              proto.handleDragMove = function(event: any, pointer: any, moveVector: any) {
                if (!this.isDraggable) return;
                if (!moveVector) return origDrag.call(this, event, pointer, moveVector);
                const dx = Math.abs(moveVector.x);
                const dy = Math.abs(moveVector.y);
                if (dy > dx) {
                  if (this.isDragging) this.isDragging = false;
                  return;
                }
                return origDrag.call(this, event, pointer, moveVector);
              };
            }
            // Re-aplicar touch-action a todas las instancias existentes
            document.querySelectorAll('slideshow-element, .slideshow, .flickity-slider').forEach((el: any) => {
              el.style.touchAction = 'pan-y';
              el.style.webkitOverflowScrolling = 'auto';
            });
          }
        }

        // ── SLIDER-ELEMENT TOUCH FIX: Remove pan-y lock to allow horizontal swiping ──
        if (window.matchMedia('(max-width: 767px)').matches) {
          document.querySelectorAll<HTMLElement>('slider-element, .slider, .card-grid, .media-card, .media-card__link, .media-card .media').forEach(el => {
            el.style.touchAction = 'pan-x pan-y';
          });
        }

        try {
          document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: false }));
          window.dispatchEvent(new Event('load'));
        } catch (e) {
          console.warn('[Plantilla25] dispatch DOMContentLoaded/load failed:', e);
        }

        // ── BTN-FILL MOBILE: theme.js desactiva HoverButton en táctil.
        //    Disparamos la misma animación nativa (translate3d(0,0,0) al tocar,
        //    translate3d(0,-76%,0) al soltar = valor original del theme). ──
        document.querySelectorAll<HTMLElement>('.button').forEach(btn => {
          if (btn.dataset.fillWired) return;
          btn.dataset.fillWired = '1';
          const fill = btn.querySelector<HTMLElement>('[data-fill]');
          if (!fill) return;

          btn.addEventListener('touchstart', () => {
            fill.style.transition = 'transform 0.3s cubic-bezier(0.165,0.84,0.44,1)';
            fill.style.transform = 'translate3d(0,0,0)';
          }, { passive: true });

          btn.addEventListener('touchend', () => {
            setTimeout(() => {
              fill.style.transition = 'transform 0.45s cubic-bezier(0.165,0.84,0.44,1)';
              fill.style.transform = 'translate3d(0,-76%,0)';
            }, 350);
          }, { passive: true });

          btn.addEventListener('touchcancel', () => {
            fill.style.transform = 'translate3d(0,-76%,0)';
          }, { passive: true });
        });
      }, 500);
    })();

    return () => { (window as any).__tpl25ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* ── Fetch categories + product counts from API ── */
  useEffect(() => {
    let active = true;
    const getJSON = async (url: string, isValid?: (d: any) => boolean, tries = 5): Promise<any | null> => {
      let last: any = null;
      for (let i = 0; i < tries; i++) {
        try {
          const r = await fetch(url, { cache: 'no-store' });
          if (r.ok) { const d = await r.json(); last = d; if (!isValid || isValid(d)) return d; }
        } catch { /* retry */ }
        await new Promise(res => setTimeout(res, 600));
      }
      return last;
    };
    (async () => {
      const [catData, prodData, featData] = await Promise.all([
        getJSON('/api/public-data/catalog', d => (d?.categories?.length || 0) > 0),
        getJSON('/api/public-data/products?limit=1', d => Object.keys(d?.categoryCounts || {}).length > 0),
        getJSON('/api/public-data/products?limit=1', d => (d?.products?.length || 0) > 0),
      ]);
      if (!active) return;
      if (catData) { setCats((catData.categories || []) as EnhCategory[]); setSubs((catData.subcategories || []) as EnhSubcategory[]); }
      if (prodData) { setCatCounts(prodData.categoryCounts || {}); setSubCounts(prodData.subcategoryCounts || {}); }
      if (featData?.products?.[0]) { setFeaturedProd(featData.products[0] as EnhFeaturedProduct); }
    })();
    return () => { active = false; };
  }, []);

  /* ── Enhance header with real data + fix clone behaviour ── */
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !root.dataset.htmlSet) return;
    if (cats.length === 0) return; // esperar a que las categorías carguen

    const run = () => {
      const r = containerRef.current;
      if (!r || !r.dataset.htmlSet) return;
      enhanceConceptHeader(r, {
        categories: cats, subcategories: subs, catCounts, subCounts,
        logoUrl: STORE_LOGO, storeName: STORE_NAME,
        featuredProduct: featuredProd || undefined,
        onFeaturedAddToCart: (product) => {
          addItem({
            ...product,
            STOCK: (product as any).STOCK ?? 99999,
          } as any, 1);
        },
      });
      if (combos.length > 0) {
        enhanceConceptCombos(r, combos[0], (selectedItems) => {
          selectedItems.forEach(item => {
            addItem({
              $id: item.id,
              NAME: item.name,
              PRICE: item.price,
              IMAGEURL: item.image,
              STOCK: 99,
            } as any);
          });
        });
      } else {
        enhanceConceptCombos(r, null);
      }
      syncConceptCartCount(r, totalItems);
      fixCloneBehaviour(r);
    };
    // Pequeño delay para asegurar que el DOM del theme está estable
    const t = setTimeout(run, 100);
    return () => clearTimeout(t);
  }, [bodyHtml, cats, subs, catCounts, subCounts, totalItems, featuredProd, combos, addItem]);

  /* ── Sync cart badge reactively ── */
  useEffect(() => {
    const root = containerRef.current;
    if (root?.dataset.htmlSet) syncConceptCartCount(root, totalItems);
  }, [totalItems, bodyHtml]);

  /* ── Loading/error states ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla25/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div
        aria-label="Cargando"
        role="status"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            border: '3px solid #e5e7eb',
            borderTopColor: '#111827',
            borderRadius: '50%',
            animation: 'template25-spin .7s linear infinite',
          }}
        />
        <style>{'@keyframes template25-spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="tpl25-shopify-root template-index"
    />
  );
}
