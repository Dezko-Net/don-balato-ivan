'use client';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NavbarConceptReal â€” el header REAL del tema Shopify "Concept" (el
   mismo del home de la plantilla 25) para el RESTO de pÃ¡ginas
   (producto, carrito, cuenta, catÃ¡logoâ€¦), reemplazando al nb23.
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   â€¢ Inyecta el HTML real del header (header-clean.html).
   â€¢ Carga su CSS pero SCOPEADO bajo `.tpl25nav` (theme-scoped.css) para
     que NO contamine el resto de la app (body/button/a/*).
   â€¢ Carga el JS del tema (custom elements: dropdowns, drawers, dockâ€¦).
   â€¢ Lo hace funcional con enhanceConceptHeader (categorÃ­as del DB,
     buscador â†’ /productos?q=, cuenta â†’ /cuenta, carrito â†’ /carrito con
     badge reactivo).
   Solo se usa cuando la plantilla activa es la 25 (ver DynamicNavbar).
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  enhanceConceptHeader,
  syncConceptCartCount,
  type EnhCategory,
  type EnhSubcategory,
} from '@/templates/plantilla25/enhanceConceptHeader';
import { fixCloneBehaviour } from '@/templates/plantilla25/fixCloneBehaviour';

const STORE_LOGO = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784931333115-pegada-1784931318404.png';
const STORE_NAME = 'Don Balato Iván Chile';

const SCOPED_CSS = '/shopify/plantilla25/theme-scoped.css';
const HEADER_HTML = '/shopify/plantilla25/header-clean.html';
const JS_BASE = '/shopify/plantilla25/assets/js/concept-theme-tech.myshopify.com/cdn/shop/t/188/assets';
const FONT_BASE = '/shopify/plantilla25/assets/fonts/concept-theme-tech.myshopify.com/cdn/fonts/inter';

const FONT_FACE_CSS = `
@font-face{font-family:Inter;font-weight:400;font-style:normal;font-display:swap;src:url("${FONT_BASE}/inter_n4.b2a3f24c19b4de56e8871f609e73ca7f6d2e2bb9.woff2") format("woff2")}
@font-face{font-family:Inter;font-weight:500;font-style:normal;font-display:swap;src:url("${FONT_BASE}/inter_n5.d7101d5e168594dd06f56f290dd759fba5431d97.woff2") format("woff2")}
@font-face{font-family:Inter;font-weight:700;font-style:normal;font-display:swap;src:url("${FONT_BASE}/inter_n7.02711e6b374660cfc7915d1afc1c204e633421e4.woff2") format("woff2")}
`;

/* Stubs mÃ­nimos para que el theme.js del tema no reviente fuera de Shopify. */
function ensureThemeStubs() {
  const w = window as any;
  if (!w.Shopify) {
    w.Shopify = {
      shop: 'concept-theme-tech.myshopify.com', country: 'US', currency: 'USD', locale: 'es',
      theme: { name: 'Concept', id: '188' },
      routes: { root_url: '/', cart_url: '/carrito', search_url: '/productos' },
      customerAccountsEnabled: false,
    };
  }
  if (!w.theme) {
    w.theme = {
      routes: {
        root_url: '/', cart_url: '/carrito', cart_add_url: '/cart/add', cart_change_url: '/cart/change',
        cart_update_url: '/cart/update', search_url: '/productos', predictive_search_url: '/search/suggest',
      },
      settings: { moneyFormat: '${{amount}}', cartType: 'drawer', themeName: 'Concept', themeVersion: '5.3.3' },
      strings: {}, variantStrings: {}, cartStrings: {}, dateStrings: {},
    };
    w.themeVariables = w.theme;
  }
}

export default function NavbarConceptReal() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/inventario')) {
    return null;
  }
  const { totalItems } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const [headerHtml, setHeaderHtml] = useState<string | null>(null);

  const [cats, setCats] = useState<EnhCategory[]>([]);
  const [subs, setSubs] = useState<EnhSubcategory[]>([]);
  const [catCounts, setCatCounts] = useState<Record<string, number>>({});
  const [subCounts, setSubCounts] = useState<Record<string, number>>({});

  /* â”€â”€ CSS scopeado + fuentes (una sola vez, global pero sin bleed) â”€â”€ */
  useEffect(() => {
    if (!document.querySelector('link[data-tpl25nav-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = SCOPED_CSS;
      link.setAttribute('data-tpl25nav-css', '1');
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[data-tpl25fixes-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/shopify/plantilla25/clone-fixes.css?v=${Date.now()}`;
      link.setAttribute('data-tpl25fixes-css', '1');
      document.head.appendChild(link);
    }
    if (!document.getElementById('tpl25nav-fonts')) {
      const st = document.createElement('style');
      st.id = 'tpl25nav-fonts';
      st.textContent = FONT_FACE_CSS;
      document.head.appendChild(st);
    }
  }, []);

  /* â”€â”€ Stubs + traer el HTML del header â”€â”€ */
  useEffect(() => {
    ensureThemeStubs();
    let aborted = false;
    fetch(HEADER_HTML, { cache: 'no-cache' })
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(html => { if (!aborted) setHeaderHtml(html); })
      .catch(err => console.error('[NavbarConceptReal] header-clean.html', err));
    return () => { aborted = true; };
  }, []);

  /* â”€â”€ Inyectar el header una vez â”€â”€ */
  useEffect(() => {
    const el = containerRef.current;
    if (!headerHtml || !el || el.dataset.injected) return;
    el.dataset.injected = '1';
    // Atributos que el CSS del tema espera (esquinas redondeadas, etc.)
    el.setAttribute('data-rounded-button', 'round');
    el.setAttribute('data-rounded-input', 'round-slight');
    el.setAttribute('data-rounded-block', 'round');
    el.setAttribute('data-rounded-card', 'round');
    el.innerHTML = headerHtml;
  }, [headerHtml]);

  /* â”€â”€ Cargar el JS del tema (custom elements). Solo si no estÃ¡ ya cargado
     (p. ej. si venimos del home que lo cargÃ³). â”€â”€ */
  useEffect(() => {
    if (!headerHtml) return;
    const w = window as any;
    if ((customElements && customElements.get('details-dropdown')) || w.__tpl25navScripts) return;
    w.__tpl25navScripts = true;
    const load = (src: string) => new Promise<void>(res => {
      if (document.querySelector(`script[data-tpl25nav="${src}"]`)) { res(); return; }
      const s = document.createElement('script');
      s.src = `${src}?v=tpl25nav`;
      s.async = false;
      s.setAttribute('data-tpl25nav', src);
      s.onload = () => res();
      s.onerror = () => res();
      document.body.appendChild(s);
    });
    (async () => {
      await load(`${JS_BASE}/vendor.js`);
      await load(`${JS_BASE}/theme.js`);
      await load(`${JS_BASE}/search.js`);
    })();
  }, [headerHtml]);

  /* â”€â”€ CategorÃ­as + conteos (con reintentos, misma fuente que el navbar original) â”€â”€ */
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
      const [catData, prodData] = await Promise.all([
        getJSON('/api/public-data/catalog', d => (d?.categories?.length || 0) > 0),
        getJSON('/api/public-data/products?limit=1', d => Object.keys(d?.categoryCounts || {}).length > 0),
      ]);
      if (!active) return;
      if (catData) { setCats((catData.categories || []) as EnhCategory[]); setSubs((catData.subcategories || []) as EnhSubcategory[]); }
      if (prodData) { setCatCounts(prodData.categoryCounts || {}); setSubCounts(prodData.subcategoryCounts || {}); }
    })();
    return () => { active = false; };
  }, []);

  /* â”€â”€ Hacer funcional el header (idempotente; re-corre al llegar la data) â”€â”€ */
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !root.dataset.injected) return;
    enhanceConceptHeader(root, {
      categories: cats, subcategories: subs, catCounts, subCounts,
      logoUrl: STORE_LOGO, storeName: STORE_NAME,
    });
    syncConceptCartCount(root, totalItems);
    fixCloneBehaviour(root);
  }, [headerHtml, cats, subs, catCounts, subCounts]);

  /* â”€â”€ Badge del carrito reactivo â”€â”€ */
  useEffect(() => {
    const root = containerRef.current;
    if (root?.dataset.injected) syncConceptCartCount(root, totalItems);
  }, [totalItems, headerHtml]);

  return (
    <>
      <style>{`
        @media (max-width: 899px) {
          .tpl25nav .search-drawer-button,
          .tpl25nav .menu-drawer-button,
          .tpl25nav .cart-drawer-button {
            display: none !important;
          }
        }
      `}</style>
      <div ref={containerRef} className="tpl25nav js" />
    </>
  );
}

