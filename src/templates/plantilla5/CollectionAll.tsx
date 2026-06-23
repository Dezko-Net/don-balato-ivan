'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { normalizeProductImages } from '@/lib/product-images';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import ProductCard5 from './ProductCard5';
import { ChevronDown } from 'lucide-react';

const FONT_FACE_CSS = `
@font-face {
  font-family: Bricolage Grotesque;
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n5.5c48bde997bf7e58df2b4a1f868ef618bc30fbd9.woff2") format("woff2"),
       url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n5.b2fbc4465ceb6375058724d9c72e259b36ed0ed4.woff") format("woff");
}
@font-face {
  font-family: Bricolage Grotesque;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n7.d70921a9957fc6a53697eb1dfda064734898fc6d.woff2") format("woff2"),
       url("/shopify/plantilla5/assets/fonts/pebble-little.myshopify.com/cdn/fonts/bricolage_grotesque/bricolagegrotesque_n7.d701b766b46c76aceb10c78473f491dff9b09e5e.woff") format("woff");
}
`;

const CSS_FILES = [
  `/shopify/plantilla5/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/theme.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/photoswipe.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/component-non-critical.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/menu-drawer.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/header-menu.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/template-collection.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/component-localization-dropdown.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-drawer.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-modules.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/quick-view.css`
];

const JS_FILES = [
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
];

export default function CollectionAll5() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [mounted, setMounted] = useState(false);
  const { settings: apertura } = useAperturaPromotion();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string | null>(searchParams.get('categoria'));

  const updateCategoryUrl = (catId: string | null) => {
    const url = new URL(window.location.href);
    if (catId) {
      const cat = categories.find(c => c.$id === catId);
      const slug = cat?.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || catId;
      url.searchParams.set('categoria', slug);
    } else {
      url.searchParams.delete('categoria');
    }
    window.history.replaceState({}, '', url.toString());
  };
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [priceRangeMounts, setPriceRangeMounts] = useState<HTMLElement[]>([]);

  useEffect(() => {
    setVisibleCount(20);
  }, [selectedCat]);

  const priceMaxAllowed = useMemo(() => {
    const max = Math.max(0, ...products.map(p => Number(p.PRICE) || 0));
    // fallback por si aún no cargan productos
    return max > 0 ? max : 6600;
  }, [products]);

  useEffect(() => {
    fetch('/api/public-data/catalog')
      .then(r => r.json())
      .then(catData => {
        setCategories(catData.categories || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const url = new URL('/api/public-data/products', window.location.origin);
    url.searchParams.set('sortBy', 'newest');
    if (selectedCat) {
      url.searchParams.set('categoryId', selectedCat);
    }
    fetch(url.toString())
      .then(r => r.json())
      .then(prodData => {
        const prods = (prodData.products || []).map(normalizeProductImages).filter((p: Product) => p.ISACTIVE !== false);
        setProducts(prods);
      })
      .catch(console.error);
  }, [selectedCat]);

  useEffect(() => {
    document.documentElement.dataset.template = '5';
    return () => { delete document.documentElement.dataset.template; };
  }, []);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'tpl5-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

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

  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla5/collection-all-clean.html', { cache: 'no-cache' })
      .then(r => r.text())
      .then(html => {
        if (!aborted) setBodyHtml(html);
      });
    return () => { aborted = true; };
  }, []);

  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    if (containerRef.current.dataset.htmlSet) return;
    
    containerRef.current.innerHTML = bodyHtml;
    containerRef.current.dataset.htmlSet = '1';
    
    const root = containerRef.current;
    root.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());

    const grid = root.querySelector('.product-grid');
    if (grid) grid.innerHTML = '';

    // Insertar mounts (React portals) para nuestro slider de precio custom (desktop + drawer)
    const facets = Array.from(root.querySelectorAll<HTMLElement>('.price-facet'));
    facets.forEach(facet => {
      const inputsWrapper = facet.querySelector<HTMLElement>('.price-facet__inputs-wrapper');
      if (!inputsWrapper) return;
      if (facet.querySelector('.tpl5-price-range-mount')) return;

      const mount = document.createElement('div');
      mount.className = 'tpl5-price-range-mount';
      inputsWrapper.parentElement?.insertBefore(mount, inputsWrapper);
    });
    setPriceRangeMounts(Array.from(root.querySelectorAll<HTMLElement>('.tpl5-price-range-mount')));
    
    setMounted(true);
  }, [bodyHtml]);

  useEffect(() => {
    if (!bodyHtml) return;
    if ((window as any).__tpl5ScriptsLoaded) return;
    (window as any).__tpl5ScriptsLoaded = true;

    if (!(window as any).Shopify) {
      (window as any).Shopify = {
        shop: 'pebble-little.myshopify.com',
        country: 'US',
        currency: 'USD',
        locale: 'es',
        theme: { name: 'Captured Theme', id: '22' },
      };
    }

    const loadOne = (file: { src: string, module?: boolean }) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl5="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl5', file.src);
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.body.appendChild(s);
    });

    (async () => {
      for (const f of JS_FILES) {
        await loadOne(f);
      }
      setTimeout(() => {
        try {
          document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: false }));
          window.dispatchEvent(new Event('load'));
        } catch (e) {}
      }, 500);
    })();

    return () => { (window as any).__tpl5ScriptsLoaded = false; };
  }, [bodyHtml]);

  // Set up listeners for filters
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const root = containerRef.current;
    
    // Category listeners
    const catInputs = root.querySelectorAll('input[name="filter.p.product_type"]');
    const catChangeHandler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const labelEl = target.closest('li')?.querySelector('label .facet-checkbox__label-text');
      const catName = labelEl?.textContent?.trim() || '';
      const matchedCategory = categories.find(c => c.name === catName);
      
      if (target.checked && matchedCategory) {
        setSelectedCat(matchedCategory.$id);
        updateCategoryUrl(matchedCategory.$id);
        catInputs.forEach(other => {
          if (other !== target) (other as HTMLInputElement).checked = false;
        });
      } else {
        setSelectedCat(null);
        updateCategoryUrl(null);
      }
    };

    catInputs.forEach(input => {
      input.removeEventListener('change', catChangeHandler);
      input.addEventListener('change', catChangeHandler);
    });

    // Price listeners
    const minInputs = root.querySelectorAll('input[name="filter.v.price.gte"]');
    const maxInputs = root.querySelectorAll('input[name="filter.v.price.lte"]');

    const priceChangeHandler = (e: Event) => {
      // Evitar que los handlers del theme (facets.js) reescriban valores.
      // (lo ejecutamos en capture, ver addEventListener más abajo).
      try {
        e.stopImmediatePropagation();
        e.stopPropagation();
      } catch {}
      const target = e.target as HTMLInputElement;
      const isMin = target.name === 'filter.v.price.gte';
      const rawVal = target.value?.trim() ? parseFloat(target.value) : null;

      const parent = target.closest('.price-facet');
      const textMin = parent?.querySelector('input[name="filter.v.price.gte"]') as HTMLInputElement | null;
      const textMax = parent?.querySelector('input[name="filter.v.price.lte"]') as HTMLInputElement | null;

      let currentMin = textMin?.value?.trim() ? parseFloat(textMin.value) : null;
      let currentMax = textMax?.value?.trim() ? parseFloat(textMax.value) : null;

      // Aplicar el valor nuevo al lado correspondiente
      if (isMin) currentMin = rawVal;
      else currentMax = rawVal;

      // Clamp para evitar min > max
      if (currentMin !== null && currentMax !== null && currentMin > currentMax) {
        if (isMin) {
          currentMin = currentMax;
          if (textMin) textMin.value = String(currentMin);
        } else {
          currentMax = currentMin;
          if (textMax) textMax.value = String(currentMax);
        }
      }

      setMinPrice(currentMin);
      setMaxPrice(currentMax);
    };
    
    [...minInputs, ...maxInputs].forEach(input => {
      // Quitar listeners previos (bubble y capture)
      input.removeEventListener('change', priceChangeHandler);
      input.removeEventListener('input', priceChangeHandler);
      input.removeEventListener('change', priceChangeHandler, true);
      input.removeEventListener('input', priceChangeHandler, true);

      // Usar capture para ganarle a facets.js y cortar propagación
      input.addEventListener('change', priceChangeHandler, true);
      input.addEventListener('input', priceChangeHandler, true);
    });

    return () => {
      catInputs.forEach(input => input.removeEventListener('change', catChangeHandler));
      [...minInputs, ...maxInputs].forEach(input => {
        input.removeEventListener('change', priceChangeHandler, true);
        input.removeEventListener('input', priceChangeHandler, true);
        input.removeEventListener('change', priceChangeHandler);
        input.removeEventListener('input', priceChangeHandler);
      });
    };
  }, [mounted, categories]);

  // Compute Live Shopping threshold (7am local time today or yesterday)
  const liveThreshold = useMemo(() => {
    const now = new Date();
    const today7Am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0, 0);
    if (now.getTime() >= today7Am.getTime()) return today7Am.getTime();
    const yesterday7Am = new Date(today7Am);
    yesterday7Am.setDate(yesterday7Am.getDate() - 1);
    return yesterday7Am.getTime();
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(p => {
      if (selectedCat && p.CATEGORYID !== selectedCat) return false;
      if (minPrice !== null && (p.PRICE || 0) < minPrice) return false;
      if (maxPrice !== null && (p.PRICE || 0) > maxPrice) return false;
      return true;
    });

    // Sort: Live Shopping products (imported today since 7am) appear first
    return filtered.sort((a, b) => {
      const aIsLive = a.$createdAt && new Date(a.$createdAt).getTime() >= liveThreshold;
      const bIsLive = b.$createdAt && new Date(b.$createdAt).getTime() >= liveThreshold;

      if (aIsLive && !bIsLive) return -1;
      if (!aIsLive && bIsLive) return 1;

      if (aIsLive && bIsLive) {
        // Both live: sort by $createdAt descending
        const timeA = new Date(a.$createdAt!).getTime();
        const timeB = new Date(b.$createdAt!).getTime();
        return timeB - timeA;
      }

      // Both non-live: keep original order (newest first from API)
      return 0;
    });
  }, [products, selectedCat, minPrice, maxPrice, liveThreshold]);

  const gridNode = mounted ? containerRef.current?.querySelector('.product-grid') : null;

  if (!bodyHtml) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando plantilla 5...</div>;

  return (
    <>
      <style>{`
        /* Desktop layout: Force the grid and put filter on left */
        @media (min-width: 1024px) {
          .tpl5-shopify-root results-list .collection__wrapper {
            display: grid !important;
            grid-template-columns: 340px minmax(0, 1fr) !important;
            gap: 0 40px !important;
            align-items: start !important;
          }
          .tpl5-shopify-root .facet-toolbar {
            grid-column: 1 / 3 !important;
            grid-row: 1 !important;
            margin-bottom: 24px !important;
          }
          .tpl5-shopify-root .facet-filtering {
            grid-column: 1 / 2 !important;
            grid-row: 2 !important;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            padding-right: 0 !important;
          }
          .tpl5-shopify-root .facets__form-wrapper {
            padding: 0 !important;
            margin: 0 !important;
          }
          .tpl5-shopify-root .facets__form {
            padding-right: 15px !important;
          }
          .tpl5-shopify-root .price-facet__range-input:focus,
          .tpl5-shopify-root .price-facet__range-input:focus-visible,
          .tpl5-shopify-root .price-facet__range-input:active {
            outline: none !important;
            box-shadow: none !important;
          }
          .tpl5-shopify-root .main-collection-grid {
            grid-column: 2 / 3 !important;
            grid-row: 2 !important;
          }
        }
        
        /* Mobile layout */
        @media (max-width: 1023px) {
          .tpl5-shopify-root results-list .collection__wrapper {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .tpl5-shopify-root .facet-filtering {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            width: 100% !important;
            order: 1 !important;
            position: static !important;
          }
          .tpl5-shopify-root .main-collection-grid {
            order: 2 !important;
            width: 100% !important;
          }
        }

        /* Precio: solo inputs (sin slider) */
        .tpl5-shopify-root .price-facet__inputs-wrapper {
          margin-top: 0 !important;
        }

        /* ──────────────────────────────────────────────────────────
           Slider de precio custom (minimalista B/N, pero “complejo”)
           - Doble thumb (min/max)
           - Track con fill
           - Histograma (distribución) detrás
           - Sync con inputs existentes
        ────────────────────────────────────────────────────────── */
        .tpl5-shopify-root .tpl5-price-range {
          --min-pct: 0%;
          --max-pct: 100%;
          margin: 6px 0 10px;
          padding: 0;
          color: #111;
        }
        .tpl5-shopify-root .tpl5-price-range__top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 12px;
          line-height: 1;
        }
        .tpl5-shopify-root .tpl5-price-range__title {
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #111;
        }
        .tpl5-shopify-root .tpl5-price-range__value {
          font-variant-numeric: tabular-nums;
          color: rgba(0,0,0,0.75);
          white-space: nowrap;
        }
        .tpl5-shopify-root .tpl5-price-range__track-wrap {
          position: relative;
          height: 28px;
          /* Extender un poco para que los thumbs lleguen más a los bordes */
          margin-left: -10px;
          margin-right: -10px;
        }
        .tpl5-shopify-root .tpl5-price-range__track {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.15) var(--min-pct),
            #111 var(--min-pct),
            #111 var(--max-pct),
            rgba(0,0,0,0.15) var(--max-pct),
            rgba(0,0,0,0.15) 100%
          );
        }
        .tpl5-shopify-root .tpl5-price-range__ticks {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 10px;
          pointer-events: none;
          opacity: 0.55;
          background-image: radial-gradient(circle, rgba(0,0,0,0.28) 1px, transparent 2px);
          background-size: 12.5% 10px; /* 8 segmentos */
          background-position: 0 50%;
          mask-image: linear-gradient(to right, transparent 0, #000 12px, #000 calc(100% - 12px), transparent 100%);
        }
        .tpl5-shopify-root .tpl5-price-range__bubble {
          position: absolute;
          top: 0;
          transform: translate(-50%, -6px);
          background: #111;
          color: #fff;
          font-size: 11px;
          line-height: 1;
          padding: 6px 8px;
          border-radius: 999px;
          font-weight: 700;
          letter-spacing: 0.01em;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity .12s ease, transform .12s ease;
        }
        .tpl5-shopify-root .tpl5-price-range__bubble.is-active {
          opacity: 1;
          transform: translate(-50%, -10px);
        }
        .tpl5-shopify-root .tpl5-price-range__range {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          margin: 0;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none; /* importante: el input de arriba decide la interacción */
          outline: none;
          border: 0;
          box-shadow: none;
        }
        .tpl5-shopify-root .tpl5-price-range__range:focus,
        .tpl5-shopify-root .tpl5-price-range__range:focus-visible {
          outline: none;
          box-shadow: none;
        }
        .tpl5-shopify-root .tpl5-price-range__range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #111;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.25);
          margin-top: 2px; /* baja un poco el thumb para que quede centrado con la barra */
          pointer-events: auto;
          cursor: ew-resize;
        }
        .tpl5-shopify-root .tpl5-price-range__range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #111;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.25);
          transform: translateY(2px); /* baja un poco el thumb */
          pointer-events: auto;
          cursor: ew-resize;
        }
        .tpl5-shopify-root .tpl5-price-range__range::-webkit-slider-runnable-track {
          height: 28px; /* agranda el “hit area” sin cambiar la barra */
          background: transparent;
          border: 0;
          box-shadow: none;
        }
        .tpl5-shopify-root .tpl5-price-range__range::-moz-range-track {
          height: 28px;
          background: transparent;
          border: 0;
          box-shadow: none;
        }
        .tpl5-shopify-root .tpl5-price-range__range::-moz-range-progress {
          background: transparent;
        }
        .tpl5-shopify-root .tpl5-price-range__actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .tpl5-shopify-root .tpl5-price-range__btn {
          border: 1px solid rgba(0,0,0,0.18);
          background: #fff;
          color: #111;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          line-height: 1;
          font-weight: 700;
          cursor: pointer;
          transition: transform .12s ease, background .12s ease, border-color .12s ease;
        }
        .tpl5-shopify-root .tpl5-price-range__btn:hover {
          border-color: rgba(0,0,0,0.35);
          background: rgba(0,0,0,0.03);
        }
        .tpl5-shopify-root .tpl5-price-range__btn:active {
          transform: scale(0.98);
        }

        /* TEST: quitar contornos/bordes de las secciones del filtro (accordions) */
        .tpl5-shopify-root .facet-filtering .accordion__details,
        .tpl5-shopify-root .facet-filtering .accordion__content,
        .tpl5-shopify-root .facet-filtering .accordion__inner,
        .tpl5-shopify-root .facet-filtering .accordion__summary {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Selector de Categorías en Plantilla 5 */}
      <div style={{ maxWidth: 1200, margin: '20px auto 0', padding: '0 20px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111', fontFamily: 'Bricolage Grotesque, sans-serif' }}>Categoría:</span>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedCat || ''}
            onChange={e => { const val = e.target.value || null; setSelectedCat(val); updateCategoryUrl(val); }}
            style={{
              padding: '10px 36px 10px 16px',
              borderRadius: 8,
              border: '2px solid #111',
              background: '#fff',
              fontSize: 13,
              color: '#111',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              outline: 'none',
              minWidth: 200,
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.$id} value={c.$id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#111', pointerEvents: 'none' }} />
        </div>
      </div>

      <div
        ref={containerRef}
        className="tpl5-shopify-root template-collection template-collection--all layout--full-width filter-type--vertical"
      />

      {priceRangeMounts.map((mount, idx) => {
        const facetEl = mount.closest('.price-facet') as HTMLElement | null;
        if (!facetEl) return null;
        return createPortal(
          <Tpl5PriceRange
            facetEl={facetEl}
            minPrice={minPrice}
            maxPrice={maxPrice}
            maxAllowed={priceMaxAllowed}
            onChange={(nextMin, nextMax) => {
              setMinPrice(nextMin);
              setMaxPrice(nextMax);
            }}
          />,
          mount,
          `tpl5-price-range-${idx}`,
        );
      })}

      {gridNode && createPortal(
        <>
          {filteredProducts.slice(0, visibleCount).map(p => <ProductCard5 key={p.$id} product={p} />)}
          {visibleCount < filteredProducts.length && (
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '30px 0', width: '100%' }}>
              <button 
                type="button"
                onClick={() => setVisibleCount(c => c + 20)} 
                style={{ 
                  padding: '14px 40px', 
                  background: '#111', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '999px', 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
              >
                Cargar más ({filteredProducts.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </>,
        gridNode
      )}
    </>
  );
}

function Tpl5PriceRange({
  facetEl,
  minPrice,
  maxPrice,
  maxAllowed,
  onChange,
}: {
  facetEl: HTMLElement;
  minPrice: number | null;
  maxPrice: number | null;
  maxAllowed: number;
  onChange: (min: number | null, max: number | null) => void;
}) {
  const fmt = useMemo(() => new Intl.NumberFormat('es-CL'), []);
  const clampMax = Math.max(1, Number(maxAllowed) || 1);

  // Estado local (para interacción suave), sincronizado con el estado global
  const [localMin, setLocalMin] = useState<number>(minPrice ?? 0);
  const [localMax, setLocalMax] = useState<number>(maxPrice ?? clampMax);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);

  useEffect(() => {
    setLocalMin(minPrice ?? 0);
  }, [minPrice]);
  useEffect(() => {
    setLocalMax(maxPrice ?? clampMax);
  }, [maxPrice, clampMax]);

  // Debounce para “en vivo” sin recalcular todo en cada pixel
  useEffect(() => {
    const t = setTimeout(() => {
      const nextMin = localMin <= 0 ? null : localMin;
      const nextMax = localMax >= clampMax ? null : localMax;
      onChange(nextMin, nextMax);
    }, 120);
    return () => clearTimeout(t);
  }, [localMin, localMax, clampMax, onChange]);

  // Sincronizar inputs nativos del HTML capturado (min/max) para que queden coherentes
  useEffect(() => {
    const minInput = facetEl.querySelector<HTMLInputElement>('input[name="filter.v.price.gte"]');
    const maxInput = facetEl.querySelector<HTMLInputElement>('input[name="filter.v.price.lte"]');
    if (minInput) minInput.value = (minPrice ?? '') as any;
    if (maxInput) maxInput.value = (maxPrice ?? '') as any;
  }, [facetEl, minPrice, maxPrice]);

  const minPct = (localMin / clampMax) * 100;
  const maxPct = (localMax / clampMax) * 100;

  const setBoth = (nextMin: number, nextMax: number) => {
    const a = Math.max(0, Math.min(nextMin, clampMax));
    const b = Math.max(0, Math.min(nextMax, clampMax));
    const clampedMin = Math.min(a, b);
    const clampedMax = Math.max(a, b);
    setLocalMin(clampedMin);
    setLocalMax(clampedMax);
  };

  return (
    <div
      className="tpl5-price-range"
      style={{
        ['--min-pct' as any]: `${minPct}%`,
        ['--max-pct' as any]: `${maxPct}%`,
      }}
    >
      <div className="tpl5-price-range__top">
        <div className="tpl5-price-range__title">Precio</div>
        <div className="tpl5-price-range__value">
          ${fmt.format(localMin)} – ${fmt.format(localMax)}
        </div>
      </div>

      <div className="tpl5-price-range__track-wrap">
        <div className={`tpl5-price-range__bubble ${activeThumb === 'min' ? 'is-active' : ''}`} style={{ left: `${minPct}%` }}>
          ${fmt.format(localMin)}
        </div>
        <div className={`tpl5-price-range__bubble ${activeThumb === 'max' ? 'is-active' : ''}`} style={{ left: `${maxPct}%` }}>
          ${fmt.format(localMax)}
        </div>
        <div className="tpl5-price-range__track" aria-hidden="true" />
        <div className="tpl5-price-range__ticks" aria-hidden="true" />

        <input
          className="tpl5-price-range__range"
          type="range"
          min={0}
          max={clampMax}
          step={1}
          value={localMin}
          aria-label="Precio mínimo"
          onPointerDown={() => setActiveThumb('min')}
          onPointerUp={() => setActiveThumb(null)}
          onBlur={() => setActiveThumb(null)}
          onChange={(e) => setBoth(Number(e.target.value), localMax)}
        />
        <input
          className="tpl5-price-range__range"
          type="range"
          min={0}
          max={clampMax}
          step={1}
          value={localMax}
          aria-label="Precio máximo"
          onPointerDown={() => setActiveThumb('max')}
          onPointerUp={() => setActiveThumb(null)}
          onBlur={() => setActiveThumb(null)}
          onChange={(e) => setBoth(localMin, Number(e.target.value))}
        />
      </div>

      <div className="tpl5-price-range__actions">
        <button
          type="button"
          className="tpl5-price-range__btn"
          onClick={() => setBoth(0, clampMax)}
        >
          Reset
        </button>
        <button
          type="button"
          className="tpl5-price-range__btn"
          onClick={() => setBoth(localMin, clampMax)}
        >
          Solo mínimo
        </button>
        <button
          type="button"
          className="tpl5-price-range__btn"
          onClick={() => setBoth(0, localMax)}
        >
          Solo máximo
        </button>
      </div>
    </div>
  );
}
