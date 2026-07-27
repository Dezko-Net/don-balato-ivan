'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 5 — Shopify Theme Capturado por FOLLA v2
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

const SHOPIFY_BASE = '/shopify/plantilla5/assets';

/* ── CSS files: ORDEN CRÍTICO — inline primero, luego core, luego secciones ── */
const CSS_FILES = [
  `/shopify/plantilla5/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/theme.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/photoswipe.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/component-non-critical.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/menu-drawer.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/header-menu.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/component-localization-dropdown.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-drawer.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-modules.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/quick-view.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/section-popup.css`
];

/* ── JS files: solo los críticos del tema ── */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/motion-component.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/custom-elements.js` },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/carousel.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/modules.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/theme.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/dialog.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/variant-picker.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/media-gallery.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-card.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-price.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-badge.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-inventory.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/quantity-selector.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-form.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/gift-card-recipient-form.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-count.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/quick-add.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/video-card.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/search.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-note.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-discount.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/free-shipping-goal.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/localization.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/page-transition.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/critical.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/highlight-text-with-image.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-drawer.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-items.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-shipping.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-recommendations.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/popup.js`, module: true }
];

/* ── Font faces ── */
const FONT_FACE_CSS = `
@font-face {
  font-family: "Bricolage Grotesque";
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n5.8c091e52a78b3e58ef96221ce55140a80a8253ff.woff2") format("woff2"),
       url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n5.fd299922888265641eb4cdf8883119ce0130018b.woff") format("woff");
}
@font-face {
  font-family: "Bricolage Grotesque";
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n7.de5675dd7a8e145fdc4cb2cfe67a16cb085528d0.woff2") format("woff2"),
       url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n7.d701b766b46c76aceb10c78473f491dff9b09e5e.woff") format("woff");
}
`;

export default function HomePage5() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '5';
    return () => { delete document.documentElement.dataset.template; };
  }, []);

  /* ── Load font faces ── */
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'tpl5-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* ── Load CSS files dynamically ── */
  useEffect(() => {
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl5="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl5', href);
      document.head.appendChild(link);
    });
  }, []);


  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla5/body-clean.html', { cache: 'no-cache' })
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
        console.error('[Plantilla5] Error loading body-clean.html', err);
        setLoadError(err.message || 'Error de carga');
      });
    return () => { aborted = true; };
  }, []);

  /* ── Set innerHTML ONCE via ref ── */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    if (containerRef.current.dataset.htmlSet) return;
    
    let processedHtml = bodyHtml;
    processedHtml = processedHtml.replace(/Pebble\s*Little/gi, 'Yaxsell');
    processedHtml = processedHtml.replace(/pebble-little/gi, 'yaxsell');
    processedHtml = processedHtml.replaceAll('Home', 'Inicio');
    processedHtml = processedHtml.replaceAll('New', 'Nuevo');
    processedHtml = processedHtml.replaceAll('Popular', 'Popular');
    processedHtml = processedHtml.replaceAll('Add to cart', 'Agregar al carrito');
    processedHtml = processedHtml.replaceAll('Buy it now', 'Comprar ahora');
    processedHtml = processedHtml.replaceAll('Free shipping', 'ENVIO SEGURO');
    processedHtml = processedHtml.replaceAll('Easy return', 'COMPRA PROTEGIDA');
    processedHtml = processedHtml.replaceAll('Safe checkout', 'PAGO GARANTIZADO');
    processedHtml = processedHtml.replaceAll('Need help ?', '¿Necesitas ayuda?');
    processedHtml = processedHtml.replaceAll('Need help?', '¿Necesitas ayuda?');
    processedHtml = processedHtml.replaceAll('Outfit Inspiration', '✨ Élígete Bella');
    processedHtml = processedHtml.replaceAll('Ideas to refresh your everyday wardrobe', 'Porque cuidarte es quererte. Brilla siempre.');
    processedHtml = processedHtml.replaceAll('Over 500 Happy Reviews', 'Más de 500 opiniones felices');
    
    processedHtml = processedHtml.replaceAll('Learn more', 'Comprar ahora');
    processedHtml = processedHtml.replaceAll('Learn More', 'Comprar ahora');
    processedHtml = processedHtml.replaceAll('Shop Now', 'Comprar ahora');
    processedHtml = processedHtml.replaceAll('Shop now', 'Comprar ahora');
    processedHtml = processedHtml.replaceAll('Contact us', 'Contáctanos');
    processedHtml = processedHtml.replaceAll('Contact Us', 'Contáctanos');
    processedHtml = processedHtml.replaceAll('Continue shopping', 'Continuar comprando');
    processedHtml = processedHtml.replaceAll('Continue Shopping', 'Continuar comprando');

    containerRef.current.innerHTML = processedHtml;
    containerRef.current.dataset.htmlSet = '1';

    // Remove leftover Shopify elements
    const root = containerRef.current;
    root.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());

    // Bloquear botones de compartir si existen
    root.querySelectorAll('.social-sharing a').forEach((el: any) => {
      el.setAttribute('href', '#');
      el.removeAttribute('target');
      el.addEventListener('click', (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    const shareText = root.querySelector('.social-sharing p');
    if (shareText) {
      shareText.textContent = 'Compartir:';
    }

    // Configurar el botón "¿Necesitas ayuda?" para WhatsApp si existe
    const helpBtn = root.querySelector('.help-desk-link');
    if (helpBtn) {
      helpBtn.setAttribute('href', 'https://wa.me/56962293893');
      helpBtn.setAttribute('target', '_blank');
      helpBtn.setAttribute('rel', 'noopener noreferrer');
      helpBtn.innerHTML = `
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAZfIMxTRshRuJdTJu-mi52yWPxiF3ghQsSw&s" 
             style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; margin-right: 8px; display: inline-block; vertical-align: middle;" 
             alt="WhatsApp" />
        <span style="vertical-align: middle;">¿Necesitas ayuda?</span>
      `;
      (helpBtn as HTMLElement).style.display = 'inline-flex';
      (helpBtn as HTMLElement).style.alignItems = 'center';
      (helpBtn as HTMLElement).style.justifyContent = 'center';
    }
  }, [bodyHtml]);

  /* ── Inject window.Shopify stub BEFORE loading JS ── */
  useEffect(() => {
    // Global error listener to suppress matchAll and Appwrite non-critical console errors
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || '';
      if (msg.includes("matchAll") || msg.includes('AppwriteException') || msg.includes('recommendations')) {
        event.preventDefault(); // Suppress the console logging
      }
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || String(event.reason || '');
      if (reason.includes('AppwriteException') || reason.includes('401') || reason.includes('404')) {
        event.preventDefault(); // Suppress the console logging
      }
    };
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    document.body.classList.remove('page-loading');

    if ((window as any).Shopify) return;
    (window as any).Shopify = {
      shop: 'pebble-little.myshopify.com',
      country: 'US',
      currency: 'USD',
      locale: 'es',
      theme: { name: 'Captured Theme', id: '22' },
      routes: { root_url: '/', cart_url: '/cart', search_url: '/productos' },
      customerAccountsEnabled: false,
    };

    // Intercept fetch/XHR to prevent 404s on /products/* and external APIs
    const origFetch = window.fetch.bind(window);
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
      
      // Intercept Shopify recommendations requests to silence 404 logs and load placeholder cleanly
      if (url.includes('/recommendations/products')) {
        const urlObj = new URL(url, window.location.origin);
        const sectionId = urlObj.searchParams.get('section_id') || 'template--20816638607498__recommendations';
        const id = `Recommendations-${sectionId}`;
        const mockHtml = `<product-recommendations id="${id}"><div style="display:none">Mocked recommendations</div></product-recommendations>`;
        return Promise.resolve(new Response(mockHtml, { 
          status: 200, 
          headers: { 'Content-Type': 'text/html' } 
        }));
      }

      if ((url.startsWith('/products/') || url.includes('/products/')) && !url.includes('/shopify/') && !url.includes('appwrite')) {
        return Promise.resolve(new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      
      return origFetch(input, init);
    };

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  /* ── Load JS scripts sequentially after HTML is rendered ── */
  useEffect(() => {
    if (!bodyHtml) return;
    if ((window as any).__tpl5ScriptsLoaded) return;
    (window as any).__tpl5ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl5="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl5', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla5] Failed to load:', file.src); done(); };
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
          console.warn('[Plantilla5] dispatch DOMContentLoaded/load failed:', e);
        }
      }, 500);
    })();

    return () => { (window as any).__tpl5ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* ── Loading/error states ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla5/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888' }}>
        Cargando plantilla 5...
      </div>
    );
  }

  return (
    <div className="tpl5-page-wrapper" style={{ background: '#fff' }}>
      <style>{`
        /* Ocultar el navbar original de Pebble Little */
        #shopify-section-sections--20816632447114__header {
          display: none !important;
        }

        /* Forzar visualización de todos los contenedores y animaciones de Shopify Dawn */
        .scroll-trigger,
        .scroll-trigger--in-view,
        .animate--slide-in,
        .animate--fade-in,
        .shopify-section,
        .shopify-section--full-width,
        .no-js-hidden,
        .product-media,
        .media,
        .media-zoom-reveal,
        .image-zoom-reveal,
        .media__image,
        #MainContent,
        .main-content,
        .product-information,
        .product-information__grid,
        .product-information__media,
        media-gallery,
        carousel-slider,
        .product__info-container,
        product-form,
        .product-form {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          transition: none !important;
        }

        /* Ocultar / Eliminar de raíz el overlay loader de Shopify */
        page-transition,
        .page-transition,
        #page-transition,
        [is="page-transition"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* Prevenir que la clase page-loading oculte el contenido */
        body.page-loading #MainContent,
        body.page-loading .main-content,
        body.page-loading .tpl5-shopify-root {
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Darle espacio al pie de página en móviles para que no quede tapado por la barra de navegación fija */
        @media (max-width: 767.98px) {
          #shopify-section-sections--20816632381578__footer,
          .shopify-section-group-footer-group,
          footer,
          [class*="footer-group"] {
            padding-bottom: 90px !important;
          }
        }

        /* Separar más los enlaces legales del pie de página */
        .footer__links, [class*="footer__links"] {
          gap: 12px 32px !important;
          display: flex !important;
          flex-wrap: wrap !important;
        }
        .footer__links li, [class*="footer__links"] li {
          margin-right: 0 !important;
          margin-left: 0 !important;
        }

        /* Reposicionar el botón "Comprar ahora" en el banner del FAQ para ponerlo más abajo */
        #shopify-section-template--20816638607498__custom_section_FXkPhr .image-card__inner {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }
        #shopify-section-template--20816638607498__custom_section_FXkPhr .image-card__button {
          margin-top: auto !important;
          padding-bottom: 24px !important;
          pointer-events: auto !important;
        }

        /* Botón flotante de WhatsApp a la izquierda */
        .whatsapp-floating-btn {
          position: fixed !important;
          left: 24px !important;
          bottom: 24px !important;
          width: 56px !important;
          height: 56px !important;
          border-radius: 50% !important;
          background-color: #25d366 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 99999 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .whatsapp-floating-btn:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.3) !important;
        }
        .whatsapp-floating-btn img {
          width: 100% !important;
          height: 100% !important;
          border-radius: 50% !important;
          object-fit: cover !important;
        }
        @media (max-width: 767.98px) {
          .whatsapp-floating-btn {
            bottom: 90px !important; /* Evitar que el menú de navegación móvil lo tape */
            width: 48px !important;
            height: 48px !important;
            left: 16px !important;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className="tpl5-shopify-root template-index"
      />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/56962293893"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating-btn"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAZfIMxTRshRuJdTJu-mi52yWPxiF3ghQsSw&s"
          alt="WhatsApp"
        />
      </a>
    </div>
  );
}
