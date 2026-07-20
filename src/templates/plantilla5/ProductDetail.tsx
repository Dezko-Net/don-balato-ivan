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
   - Scripts inline de animación están en product-clean.html (se ejecutan al inyectar)
   - Scripts de Shopify problemáticos excluidos
   - .in-view forzado en .animation-element tras carga
   ════════════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION, formatPrice, STOCK_REQUESTS_COLLECTION } from '@/lib/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { normalizeProductImages, resolveStorageImageUrl } from '@/lib/product-images';
import { Query } from 'appwrite';
import { Product, TimedOffer } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { getVolumeTiers, resolveVolumeTier, nextCheckpoint, prevCheckpoint, type VolumeTier } from '@/lib/volume-pricing';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import ReviewSection from '@/components/ReviewSection';
import ProductQuestions from '@/components/ProductQuestions';
import { getCustomTabsFromFeatures } from '@/lib/product-features';
import { createPortal } from 'react-dom';

function getExpiresAtEpochSeconds(offer: TimedOffer): number | null {
  if (offer.timeType === 'endDateTime' && offer.endDateTime) {
    return Math.floor(new Date(offer.endDateTime).getTime() / 1000);
  }
  if (offer.timeType === 'duration' && offer.durationHours) {
    const start = offer.activatedAt || (offer as any).$createdAt;
    if (start) {
      return Math.floor((new Date(start).getTime() + offer.durationHours * 3600000) / 1000);
    }
  }
  return null;
}

const SHOPIFY_BASE = '/shopify/plantilla5/assets';

/* ── CSS files: ORDEN CRÍTICO — inline primero, luego core, luego secciones ── */
const CSS_FILES = [
  `/shopify/plantilla5/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/theme.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/photoswipe.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/component-non-critical.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/menu-drawer.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/header-menu.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/section-product-information.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shopifycloud/portable-wallets/latest/accelerated-checkout-backwards-compat.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/component-localization-dropdown.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/pickup-availability.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-video-testimonials.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-drawer.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-modules.css`,
  `/shopify/plantilla5/assets/css/pebble-little.myshopify.com/cdn/shop/t/22/assets/quick-view.css`
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
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/sticky-add-to-cart.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/search.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-note.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-discount.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/free-shipping-goal.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/localization.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/page-transition.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/critical.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-video-testimonials.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/product-recommendations.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/card-layered.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-drawer.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-items.js`, module: true },
  { src: `/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets/cart-shipping.js`, module: true }
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

export default function ProductDetail({ previewProductId }: { previewProductId?: string }) {
  const params = useParams<{ id: string; productId?: string }>();
  const id = previewProductId || params.productId || params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  // 📦 Paquetes OCULTO (jul 2026): mode=paquetes ya no fuerza comportamiento
  // de pack — el precio por volumen aplica solo. Restaurar: volver a leer el param.
  const isPaquetesMode = false; // searchParams.get('mode') === 'paquetes'
  const { addItem } = useCart();
  const { unlimitedStock } = useStoreSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isLocalPickupOpen, setIsLocalPickupOpen] = useState(false);
  const [activeOffer, setActiveOffer] = useState<TimedOffer | null>(null);
  const { settings: apertura, isActive: aperturaActive, discountPercent: aperturaPct } = useAperturaPromotion();
  
  const [related, setRelated] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');

  const [linkedProducts, setLinkedProducts] = useState<Product[]>([]);
  // variantLabels: map productId -> custom label (e.g. 'Rojo', 'Verde')
  const [variantLabels, setVariantLabels] = useState<Record<string, string>>({});
  // activeVariantId: which linked product is currently shown inline
  const [activeVariantId, setActiveVariantId] = useState<string>('');
  // activeVariantProduct: the actual product data for the currently shown variant
  const activeVariantProduct = linkedProducts.find(lp => lp.$id === activeVariantId) || product;

  const [refElement, setRefElement] = useState<HTMLDivElement | null>(null);
  // Ref al producto cuyo precio se muestra (variante activa): los listeners DOM
  // del stepper se bindean una sola vez y necesitan leer el producto vigente.
  const pricingProductRef = useRef<Product | null>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reviewsTarget, setReviewsTarget] = useState<HTMLElement | null>(null);

  // Stock Requests state
  const { user } = useAuth();
  const [isStockRequestModalOpen, setIsStockRequestModalOpen] = useState(false);
  const [stockRequestQty, setStockRequestQty] = useState(1);
  const [isRequestingStock, setIsRequestingStock] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  // Reset quantity when active variant changes
  useEffect(() => {
    setQty(isPaquetesMode && product?.PACKQTY ? product.PACKQTY : 1);
    const qtyInput = refElement?.querySelector('input[name="quantity"]') as HTMLInputElement;
    if (qtyInput) {
      qtyInput.value = String(isPaquetesMode && product?.PACKQTY ? product.PACKQTY : 1);
    }
  }, [activeVariantId, refElement, isPaquetesMode, product?.PACKQTY]);

  /* ── Fetch Product from Appwrite ── */
  /* ── Fetch Product from Appwrite API (CACHED) ── */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public-data/product-detail?id=${id}`);
        if (!res.ok) throw new Error('Error fetching product data');
        const data = await res.json();
        
        setProduct(data.product || null);
        setLinkedProducts(data.linkedProducts || []);
        setActiveVariantId(data.product?.$id || '');
        setVariantLabels(data.variantLabels || {});
        setCategoryName(data.categoryName || '');
        setRelated(data.relatedProducts || []);
        setActiveOffer(data.activeOffer || null);

      } catch (err) {
        console.warn('Error fetching product from backend API:', err);
        setLoadError('Error fetching product: ' + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      load();
    }
  }, [id, router]);

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

  /* ── Check for pending stock requests ── */
  useEffect(() => {
    if (!user || !product) return;
    async function checkPendingRequest() {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const res = await databases.listDocuments(databaseId, STOCK_REQUESTS_COLLECTION, [
          Query.equal('productId', product!.$id),
          Query.equal('userId', user!.id),
          Query.equal('status', 'pending')
        ]);
        if (res.total > 0) {
          setHasPendingRequest(true);
        }
      } catch (err: any) {
        // Silently ignore if collection doesn't exist yet
        if (!err?.message?.includes('could not be found')) {
          console.error('Error checking stock requests:', err);
        }
      }
    }
    checkPendingRequest();
  }, [user, product]);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla5/product-clean.html', { cache: 'no-cache' })
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
        console.error('[Plantilla5] Error loading product-clean.html', err);
        setLoadError(err.message || 'Error de carga');
      });
    return () => { aborted = true; };
  }, []);

  /* ── Switch displayed variant inline (no page navigation) ── */
  const switchVariant = (targetProduct: Product) => {
    if (!refElement) return;
    const root = refElement;
    const vImages = [targetProduct.IMAGEURL, (targetProduct as any).IMAGEURL2, (targetProduct as any).IMAGEURL3, (targetProduct as any).IMAGEURL4, (targetProduct as any).IMAGEURL5].filter(Boolean).map((v: string) => resolveStorageImageUrl(v)) as string[];

    // Update main gallery images (excluding thumbnails to prevent overwriting thumbnail row)
    root.querySelectorAll('.product__media img, .global-media-settings img, img[src*="LogoPoloRed"], .product__media-list img, .media img').forEach((img: any, idx: number) => {
      if (img.closest('.carousel__thumbnail') || img.closest('.media-gallery__grid-thumbnails') || img.closest('.media-gallery__carousel-thumbnails')) {
        return;
      }
      const targetImg = vImages[idx % vImages.length] || vImages[0];
      if (!targetImg) return;
      
      img.src = targetImg;
      if (img.srcset) img.srcset = targetImg;
      img.setAttribute('src', targetImg);
      img.setAttribute('srcset', targetImg);
      img.setAttribute('data-media-src', targetImg);
      img.setAttribute('data-src', targetImg);
      
      const mediaContainer = img.closest('.product-media, .media-gallery__item, .media-zoom-reveal');
      if (mediaContainer) {
        mediaContainer.setAttribute('data-media-src', targetImg);
      }
      
      const picture = img.closest('picture');
      if (picture) {
        picture.querySelectorAll('source').forEach((source: any) => {
          source.srcset = targetImg;
          source.setAttribute('srcset', targetImg);
          source.setAttribute('data-srcset', targetImg);
        });
      }
    });

    // Update thumbnail list images to show the different views
    root.querySelectorAll('.media-gallery__carousel-thumbnails .carousel__thumbnail, .media-gallery__grid-thumbnails .media-gallery__item, .media-gallery__grid-thumbnails .thumbnail-list__item, .media-gallery__grid-thumbnails li').forEach((thumb: any, idx: number) => {
      const targetImg = vImages[idx % vImages.length] || vImages[0];
      thumb.querySelectorAll('img, source').forEach((img: any) => {
        img.src = targetImg;
        img.srcset = targetImg;
        img.setAttribute('src', targetImg);
        img.setAttribute('srcset', targetImg);
      });
    });

    // Update title
    root.querySelectorAll('h1').forEach(h1 => { h1.textContent = targetProduct.NAME; });
    root.querySelectorAll('.reversed-link__text, [data-product-title]').forEach(el => { el.textContent = targetProduct.NAME; });

    // Update price
    const vPrice = formatPrice(targetProduct.PRICE);
    root.querySelectorAll('.price, .price-item, .price__regular span, .price__sale span, .product-card__price').forEach(el => {
      if (el.textContent?.includes('$') || el.textContent?.includes('CLP') || el.textContent?.trim() === '') {
        el.textContent = vPrice;
      }
    });

    // Rewire Add to Cart button for the new variant
    const qtyInput = root.querySelector('input[name="quantity"]') as HTMLInputElement;
    const addToCartBtn = root.querySelector('.add-to-cart-button') as HTMLElement | null;
    if (addToCartBtn) {
      // Clone to remove old listeners
      const newBtn = addToCartBtn.cloneNode(true) as HTMLButtonElement;
      delete (newBtn as any).dataset.cartBound;
      addToCartBtn.parentNode?.replaceChild(newBtn, addToCartBtn);
      newBtn.dataset.cartBound = '1';
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
        // 📦 El carrito resuelve solo el nivel de volumen según la cantidad
        addItem(targetProduct, qty, undefined, undefined, undefined, isPaquetesMode);
        const textContent = newBtn.querySelector('.add-to-cart-text__content');
        if (textContent) {
          const originalText = textContent.textContent;
          textContent.textContent = '¡Añadido!';
          setTimeout(() => { textContent.textContent = originalText; }, 2000);
        }
      });
    }

    // Rewire Buy it now button
    const customBuyBtn = root.querySelector('.yaxsell-custom-buy-button') as HTMLButtonElement | null;
    if (customBuyBtn) {
      const newBuyBtn = customBuyBtn.cloneNode(true) as HTMLButtonElement;
      customBuyBtn.parentNode?.replaceChild(newBuyBtn, customBuyBtn);
      newBuyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
        // 📦 El carrito resuelve solo el nivel de volumen según la cantidad
        addItem(targetProduct, qty, undefined, undefined, undefined, isPaquetesMode);
        router.push('/carrito');
      });
    }

    // Update variant picker highlights
    root.querySelectorAll('[data-variant-btn]').forEach((btn: any) => {
      const isActive = btn.dataset.variantBtn === targetProduct.$id;
      btn.style.border = isActive ? '2.5px solid #111827' : '1px solid #e5e7eb';
      btn.style.transform = isActive ? 'translateY(-2px)' : 'translateY(0)';
      btn.style.boxShadow = isActive ? '0 6px 12px rgba(17, 24, 39, 0.12)' : 'none';
      btn.style.opacity = isActive ? '1' : '0.85';
      btn.style.borderRadius = '16px'; // Prevent global button CSS from overriding this on hover
    });

    // Update the variant label display
    const labelEl = root.querySelector('#yaxsell-variant-label') as HTMLElement | null;
    if (labelEl) {
      const label = variantLabels[targetProduct.$id] || '';
      labelEl.textContent = label;
      labelEl.style.display = label ? 'inline-block' : 'none';
    }
  };

  /* ── Helper to dynamically overwrite/apply Yaxsell product data ── */
  const applyYaxsellData = () => {
    if (!product || !refElement) return;
    
    const root = refElement;

    // Ensure reviews placeholder exists and is placed before the footer (el pie de pagina al ultimo)
    let placeholder = root.querySelector('#yaxsell-reviews-container-placeholder') as HTMLElement | null;
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.id = 'yaxsell-reviews-container-placeholder';
      placeholder.className = 'page-width';
      placeholder.style.cssText = 'max-width: 1200px; margin: 60px auto; padding: 0 20px; font-family: system-ui, sans-serif;';
    }
    
    const footerSec = root.querySelector('#shopify-section-sections--20816632381578__footer, footer, [class*="footer-group"]');
    if (footerSec && placeholder.nextSibling !== footerSec) {
      footerSec.parentNode?.insertBefore(placeholder, footerSec);
    } else if (!footerSec && !root.contains(placeholder)) {
      root.appendChild(placeholder);
    }
    
    if (!reviewsTarget) {
      setReviewsTarget(placeholder);
    }

    // 0. Move the thumbnails container outside carousel-slider to prevent Swiper from breaking it or clipping it on mobile
    const thumbs = root.querySelector('.media-gallery__carousel-thumbnails');
    // Mover thumbs dentro del carrusel de imagen, para que el absolute quede SOBRE la imagen en la parte inferior
    const galleryCarousel = root.querySelector('.media-gallery__carousel') || root.querySelector('.media-gallery__carousel-container');
    if (thumbs && galleryCarousel && thumbs.parentNode !== galleryCarousel) {
      galleryCarousel.appendChild(thumbs);
    }

    // 🔑 Fix huge blank gap: Shopify reserves space via padding-bottom/aspect-ratio before images load.
    // Override inline styles on media items so the space collapses once the img is present.
    if (window.innerWidth < 768) {
      root.querySelectorAll('.product-media.media:not(.carousel__thumbnail):not(.media-gallery__grid-thumbnails .product-media)').forEach((el: any) => {
        el.style.setProperty('padding-bottom', '0', 'important');
        el.style.setProperty('aspect-ratio', '1440 / 1438', 'important');
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('min-height', 'unset', 'important');
        el.style.setProperty('overflow', 'hidden', 'important');
      });
      // Also fix the swiper slide that wraps the main image
      root.querySelectorAll('.media-gallery__carousel .swiper-slide:not(.media-gallery__carousel-thumbnails .swiper-slide)').forEach((el: any) => {
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('padding-bottom', '0', 'important');
        el.style.setProperty('aspect-ratio', '1440 / 1438', 'important');
      });
    }
    
    // Use the currently active variant product data (or fall back to base product)
    const displayProduct = (activeVariantId && activeVariantId !== product.$id)
      ? (linkedProducts.find(lp => lp.$id === activeVariantId) || product)
      : product;

    // 📦 Precios por Volumen (3 niveles: detalle/mayor/caja).
    // SIN descuentos artificiales: el precio unitario depende SOLO de la
    // cantidad seleccionada. Nada de apertura, ofertas ni overrides.
    pricingProductRef.current = displayProduct;
    const volumeTiers = getVolumeTiers(displayProduct);
    const activeTier = resolveVolumeTier(displayProduct, qty);
    const unitPrice = activeTier.unitPrice;
    const effectivePrice = unitPrice * qty;
    const formattedPrice = formatPrice(effectivePrice);

    // 1. Inject variant thumbnails — clicking switches inline, no navigation
    root.querySelectorAll('variant-picker, .variant-picker').forEach(el => {
      if (linkedProducts && linkedProducts.length > 1) {
        (el as HTMLElement).style.display = 'block';
        
        const currentActiveId = activeVariantId || product.$id;
        
        let variantsHtml = `<div style="margin-bottom: 24px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-start;">
            <span style="font-size: 13px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em;">Modelo:</span>
            <span id="yaxsell-variant-label" style="font-size: 13px; font-weight: 600; color: #db2777; background: #fdf2f8; padding: 4px 12px; border-radius: 20px; border: 1px solid #fbcfe8; display: none;"></span>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">`;
          
        linkedProducts.forEach(lp => {
          const isActive = lp.$id === currentActiveId;
          const label = variantLabels[lp.$id] || '';
          const imgUrl = resolveStorageImageUrl(lp.IMAGEURL);
          const borderStyle = isActive
            ? 'border: 2.5px solid #111827; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(17, 24, 39, 0.12); opacity: 1;'
            : 'border: 1px solid #e5e7eb; transform: translateY(0); box-shadow: none; opacity: 0.85;';
          variantsHtml += `
            <button 
              data-variant-btn="${lp.$id}"
              data-variant-label="${label}"
              style="display: block; width: 80px; height: 80px; border-radius: 16px; overflow: hidden; ${borderStyle} cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); background: #ffffff; padding: 3px; outline: none; position: relative;"
              title="${label || lp.NAME}"
            >
              <img src="${imgUrl}" alt="${label || lp.NAME}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px; background: #ffffff;" />
            </button>
          `;
        });
        
        variantsHtml += `</div></div>`;
        el.innerHTML = variantsHtml;

        // Update the label display
        const labelEl = el.querySelector('#yaxsell-variant-label') as HTMLElement | null;
        if (labelEl) {
          const activeBtn = el.querySelector(`[data-variant-btn="${currentActiveId}"]`) as HTMLElement | null;
          const text = activeBtn?.dataset.variantLabel || '';
          labelEl.textContent = text;
          labelEl.style.display = text ? 'inline-block' : 'none';
        }

        // Bind click handlers for inline switching
        el.querySelectorAll('[data-variant-btn]').forEach((btn: any) => {
          // Avoid re-binding
          if (btn.dataset.variantBound) return;
          btn.dataset.variantBound = '1';
          btn.addEventListener('click', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = btn.dataset.variantBtn;
            const targetProduct = linkedProducts.find(lp => lp.$id === targetId);
            if (!targetProduct) return;
            setActiveVariantId(targetId);
            switchVariant(targetProduct);
          });
        });

      } else {
        (el as HTMLElement).style.display = 'none';
      }
    });

    // 1b. Bind click handlers for mobile thumbnails to allow switching images on mobile
    // First: inject the correct product images into all thumbnail img elements (overwriting the broken Shopify defaults)
    const pImagesForThumb = [
      displayProduct.IMAGEURL,
      (displayProduct as any).IMAGEURL2,
      (displayProduct as any).IMAGEURL3,
      (displayProduct as any).IMAGEURL4,
      (displayProduct as any).IMAGEURL5
    ].filter(Boolean).map((v: string) => resolveStorageImageUrl(v)) as string[];

    if (pImagesForThumb.length > 0) {
      // 🔑 REAL FIX: The problem is Swiper applies overflow:hidden to .swiper container
      // which clips our thumbnails even though the HTML is correct.
      // Solution: Inject a brand new element DIRECTLY into the media-gallery container
      // (bypassing ALL Swiper wrappers entirely)
      
      const galleryAnchor = root.querySelector('.media-gallery__carousel') || root.querySelector('media-gallery') || root.querySelector('.media-gallery');
      
      if (galleryAnchor && window.innerWidth < 768) {
        // Ensure anchor is position:relative so our absolute bar sits inside it
        (galleryAnchor as HTMLElement).style.setProperty('position', 'relative', 'important');
        
        // Hide the original Shopify thumbnail container to avoid duplication
        if (thumbs) (thumbs as HTMLElement).style.setProperty('display', 'none', 'important');
        
        const alreadyBuilt = galleryAnchor.querySelector('#yaxsell-thumbs-bar');
        
        if (!alreadyBuilt) {
          const bar = document.createElement('div');
          bar.id = 'yaxsell-thumbs-bar';
          bar.style.cssText = `
            position: absolute !important;
            bottom: 14px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 8px 14px !important;
            background: rgba(255,255,255,0.55) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border-radius: 999px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.3) inset !important;
            z-index: 9999 !important;
            pointer-events: auto !important;
            width: max-content !important;
            max-width: 90vw !important;
            overflow: visible !important;
          `;
          
          pImagesForThumb.forEach((imgUrl, idx) => {
            const slide = document.createElement('div');
            slide.style.cssText = `
              width: 44px !important;
              height: 44px !important;
              border-radius: 50% !important;
              overflow: hidden !important;
              cursor: pointer !important;
              flex-shrink: 0 !important;
              border: 2.5px solid ${idx === 0 ? '#db2777' : 'rgba(255,255,255,0.9)'} !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
              transition: all 0.2s ease !important;
              opacity: ${idx === 0 ? '1' : '0.75'} !important;
              transform: ${idx === 0 ? 'scale(1.12)' : 'scale(1)'} !important;
            `;
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = `Foto ${idx + 1}`;
            img.style.cssText = `
              width: 100% !important;
              height: 100% !important;
              object-fit: contain !important;
              display: block !important;
              border-radius: 50% !important;
              background: #ffffff !important;
              pointer-events: none !important;
            `;
            slide.appendChild(img);
            
            slide.addEventListener('click', (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              
              // Update main image
              root.querySelectorAll('img').forEach((mainImg: any) => {
                if (mainImg.closest('#yaxsell-thumbs-bar') || mainImg.closest('.media-gallery__grid-thumbnails') || mainImg.closest('.media-gallery__carousel-thumbnails')) return;
                if (!mainImg.closest('.media-gallery__carousel') && !mainImg.closest('media-gallery')) return;
                mainImg.src = imgUrl;
                mainImg.srcset = imgUrl;
                mainImg.setAttribute('src', imgUrl);
              });
              
              // Update active states
              bar.querySelectorAll('div').forEach((t: any, tIdx: number) => {
                if (tIdx === idx) {
                  t.style.setProperty('opacity', '1', 'important');
                  t.style.setProperty('transform', 'scale(1.12)', 'important');
                  t.style.setProperty('border-color', '#db2777', 'important');
                } else {
                  t.style.setProperty('opacity', '0.75', 'important');
                  t.style.setProperty('transform', 'scale(1)', 'important');
                  t.style.setProperty('border-color', 'rgba(255,255,255,0.9)', 'important');
                }
              });
            });
            
            bar.appendChild(slide);
          });
          
          galleryAnchor.appendChild(bar);
        }
      }
    }



    // 2. Inyectar Bloque Informativo de Envío y Stock (estilo Yaxsell / Plantilla 1) usando la estructura exacta de local-pickup
    const isLimitedStock = displayProduct ? (displayProduct.STOCK !== undefined && displayProduct.STOCK !== null && displayProduct.STOCK < 99999) : false;
    const stock = isLimitedStock ? (displayProduct?.STOCK ?? 0) : 99999;
    const isSoldOut = isLimitedStock && stock <= 0;
    const stockColor = stock > 10 ? '#10b981' : stock > 5 ? '#f59e0b' : stock > 0 ? '#ef4444' : '#9ca3af';
    const stockLabel = stock > 10 ? 'Stock disponible' : stock > 5 ? 'Stock limitado' : stock > 0 ? `Últimas unidades (${stock} disp.)` : 'Sin stock';

    const localPickup = root.querySelector('local-pickup, .product__pickup-availabilities');
    if (localPickup) {
      (localPickup as HTMLElement).style.display = 'block';
      localPickup.innerHTML = `
        <div class="pickup-availabilities__info" style="margin-top: 16px;">
          <div id="yaxsell-local-pickup-trigger" class="pickup-availabilities__info-wrapper" style="position: relative; border-radius: 12px; overflow: hidden; background: linear-gradient(145deg, #ffffff, #f9fafb); border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); width: 100%; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;">
            <!-- Barra decorativa superior -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #111827, #4b5563);"></div>
            
            <div class="pickup-availabilities__info-content" style="display: flex; align-items: flex-start; gap: 16px; padding: 20px;">
              <!-- Contenedor del ícono -->
              <div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #ffffff; border-radius: 10px; flex-shrink: 0; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.02); color: #111827;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" style="width: 24px; height: 24px;">
                  <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 17.449V27h20v-9.551M6.75 5h18.5a1 1 0 0 1 .961.725L28 12H4l1.793-6.275A1 1 0 0 1 6.75 5"></path>
                    <path d="M12 12v2a4 4 0 1 1-8 0v-2m16 0v2a4 4 0 1 1-8 0v-2m16 0v2a4 4 0 1 1-8 0v-2"></path>
                  </g>
                </svg>
              </div>

              <!-- Contenido principal -->
              <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 6px;">
                <h4 style="margin: 0; font-weight: 700; color: #111827; font-size: 15px; letter-spacing: -0.01em; line-height: 1.2; font-family: 'Bricolage Grotesque', sans-serif;">¿Deseas retirar en tienda?</h4>
                
                <div style="display: flex; flex-direction: column; gap: 4px; color: #4b5563; font-size: 13px; line-height: 1.4;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #db2777;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span style="text-decoration: underline; font-weight: 500; font-family: 'Bricolage Grotesque', sans-serif;">Conoce el punto de retiro en nuestra tienda</span>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                    <!-- Punto animado (Pulse) para Stock -->
                    <span style="position: relative; display: flex; width: 8px; height: 8px;">
                      <span style="position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 50%; background-color: ${stockColor}; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                      <span style="position: relative; display: inline-flex; border-radius: 50%; width: 8px; height: 8px; background-color: ${stockColor};"></span>
                    </span>
                    <span style="font-weight: 600; color: ${stockColor}; font-family: 'Bricolage Grotesque', sans-serif;">${stockLabel}</span>
                  </div>
                </div>
              </div>
              
              <!-- Flecha derecha -->
              <div style="display: flex; align-items: center; justify-content: center; align-self: center; width: 24px; height: 24px; color: #9ca3af;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style="width: 20px; height: 20px; color: currentColor;">
                  <path fill="none" d="M0 0H20V20H0V0z"></path>
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 3.75L13.75 10L7.5 16.25" fill="none"></path>
                </svg>
              </div>
            </div>
            <style>
              @keyframes ping {
                75%, 100% {
                  transform: scale(2.5);
                  opacity: 0;
                }
              }
            </style>
          </div>
        </div>
      `;

      // Bind click handler to trigger React dialog
      const trigger = localPickup.querySelector('#yaxsell-local-pickup-trigger') as HTMLElement | null;
      if (trigger && !trigger.dataset.clickBound) {
        trigger.dataset.clickBound = '1';
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsLocalPickupOpen(true);
        });
      }
    }

    // 3. Título del Producto
    root.querySelectorAll('h1').forEach(h1 => {
      h1.textContent = product.NAME;
    });
    
    root.querySelectorAll('.reversed-link__text, [data-product-title]').forEach(el => {
      el.textContent = product.NAME;
      if (el.getAttribute('data-product-title')) el.setAttribute('data-product-title', product.NAME);
      if (el.getAttribute('aria-label') === 'Logo Polo Red') el.setAttribute('aria-label', product.NAME);
    });

    // 4. Precios
    const priceContainers = Array.from(root.querySelectorAll('.yaxsell-product-price-container, product-price, .product-price'));
    const mainPriceContainer = priceContainers.find(el => !el.closest('.product-card') && !el.closest('.quick-add') && !el.closest('#quick-add-drawer')) || priceContainers[0];

    // 💰 Precio limpio: total grande + chip del nivel activo + desglose.
    // CERO descuentos: sin tachados, sin badges de -X%, sin porcentajes.
    if (mainPriceContainer) {
      const tierChip = volumeTiers.length > 1 ? `
          <span class="yaxsell-tier-chip" style="display: inline-flex !important; align-items: center !important; gap: 5px !important; padding: 5px 12px !important; border-radius: 999px !important; font-size: 11px !important; font-weight: 800 !important; letter-spacing: 0.06em !important; text-transform: uppercase !important; color: #db2777 !important; background: #fdf2f8 !important; border: 1.5px solid #fbcfe8 !important; line-height: 1 !important;">
            Precio ${activeTier.label}
          </span>` : '';
      const totalLine = qty > 1 ? `
          <div style="font-size: 13px !important; font-weight: 600 !important; color: #6b7280 !important; font-family: 'Bricolage Grotesque', sans-serif !important;">
            ${qty} unidades × ${formatPrice(unitPrice)} c/u
          </div>` : '';
      const priceHtml = `
        <div class="yaxsell-price-container-custom" style="display: flex !important; flex-direction: column !important; gap: 4px !important; font-family: 'Bricolage Grotesque', sans-serif !important;">
          <div style="display: flex !important; align-items: center !important; gap: 10px !important; flex-wrap: wrap !important;">
            <span class="yaxsell-price-sale-custom" style="font-size: 36px !important; font-weight: 800 !important; color: #111827 !important; display: inline-block !important;">
              ${formattedPrice}
            </span>${tierChip}
          </div>${totalLine}
        </div>
      `;
      mainPriceContainer.innerHTML = priceHtml;
    }

    root.querySelectorAll('.price, .price-item, .price__regular span, .price__sale span, .product-card__price').forEach(el => {
      if (el.closest('product-price.product-price, .product-price, .yaxsell-product-price-container')) return;
      if (el.textContent?.includes('$') || el.textContent?.includes('CLP') || el.textContent?.trim() === '$0' || el.textContent?.trim() === '') {
        el.textContent = formattedPrice;
      }
    });

    // 4b. 📦 Tabla de Precios por Volumen — 3 niveles con umbrales dinámicos
    // según el PACKQTY de cada producto. Click en un nivel = saltar a su cantidad.
    // Sin porcentajes ni "descuentos": solo los precios reales de cada nivel.
    const priceAnchor = mainPriceContainer as HTMLElement | null;
    if (priceAnchor) {
      // Limpieza de la caja mayorista antigua si quedó en el DOM
      root.querySelector('#yaxsell-wholesale-box')?.remove();
      let volumeBox = root.querySelector('#yaxsell-volume-box') as HTMLElement | null;
      if (volumeTiers.length > 1) {
        if (!volumeBox) {
          volumeBox = document.createElement('div');
          volumeBox.id = 'yaxsell-volume-box';
          priceAnchor.parentNode?.insertBefore(volumeBox, priceAnchor.nextSibling);
        }
        volumeBox.style.cssText = 'width: 100%; margin-top: 18px;';

        const rangeLabel = (t: VolumeTier) => t.maxQty != null ? `${t.minQty}–${t.maxQty} un.` : `${t.minQty}+ un.`;

        const cardsHtml = volumeTiers.map(t => {
          const isActive = t.key === activeTier.key;
          return `
            <button type="button" data-tier-qty="${t.minQty}" style="
              display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
              padding: 14px 6px 10px; border-radius: 14px; cursor: pointer; position: relative;
              font-family: 'Bricolage Grotesque', sans-serif; text-align: center; width: 100%;
              transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              background: ${isActive ? 'linear-gradient(160deg, #fdf2f8, #ffffff)' : '#ffffff'};
              border: ${isActive ? '2px solid #db2777' : '1.5px solid #e5e7eb'};
              box-shadow: ${isActive ? '0 8px 18px rgba(219,39,119,0.14)' : '0 1px 3px rgba(0,0,0,0.04)'};
              transform: ${isActive ? 'translateY(-3px)' : 'none'};
            ">
              ${isActive ? `<span style="position: absolute; top: -9px; left: 50%; transform: translateX(-50%); background: #db2777; color: #fff; font-size: 8.5px; font-weight: 800; letter-spacing: 0.08em; padding: 2.5px 8px; border-radius: 999px; text-transform: uppercase; white-space: nowrap;">Tu precio</span>` : ''}
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${isActive ? '#db2777' : '#9ca3af'};">${t.label}</span>
              <span style="font-size: ${isActive ? '17px' : '15px'}; font-weight: 800; color: ${isActive ? '#111827' : '#374151'}; line-height: 1.1;">${formatPrice(t.unitPrice)}</span>
              <span style="font-size: 10px; font-weight: 600; color: #9ca3af;">c/u · ${rangeLabel(t)}</span>
            </button>`;
        }).join('');

        // Empujoncito hacia el siguiente nivel (solo el precio real, sin %)
        const nextTier = volumeTiers.find(t => t.minQty > qty);
        let nudgeHtml = '';
        if (nextTier) {
          const needed = nextTier.minQty - qty;
          const progress = Math.min(100, Math.round((qty / nextTier.minQty) * 100));
          nudgeHtml = `
            <div style="margin-top: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="font-size: 12px; font-weight: 700; color: #374151; font-family: 'Bricolage Grotesque', sans-serif;">
                  🎯 Lleva ${needed} más y paga <span style="color: #db2777; font-weight: 900;">${formatPrice(nextTier.unitPrice)} c/u</span>
                </span>
                <span style="font-size: 11px; font-weight: 800; color: #9ca3af; white-space: nowrap;">${qty} / ${nextTier.minQty} un.</span>
              </div>
              <div style="width: 100%; height: 5px; background: #f3f4f6; border-radius: 99px; overflow: hidden;">
                <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, #f472b6, #db2777); border-radius: 99px; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);"></div>
              </div>
            </div>`;
        } else {
          nudgeHtml = `
            <div style="margin-top: 14px; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 12px; font-weight: 800; color: #047857; font-family: 'Bricolage Grotesque', sans-serif;">🏆 Estás pagando el mejor precio por unidad</span>
            </div>`;
        }

        volumeBox.innerHTML = `
          <div style="border: 1.5px solid #f3f4f6; border-radius: 18px; padding: 16px 14px; background: #fafafa;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px;">
              <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #111827; font-family: 'Bricolage Grotesque', sans-serif;">📦 Precio por cantidad</span>
              <span style="font-size: 10.5px; font-weight: 600; color: #9ca3af; font-family: 'Bricolage Grotesque', sans-serif;">Más llevas, menos pagas</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; padding-top: 6px;">${cardsHtml}</div>
            ${nudgeHtml}
          </div>
        `;

        // Click en un nivel → saltar a su cantidad mínima
        volumeBox.querySelectorAll('[data-tier-qty]').forEach((btn: any) => {
          btn.addEventListener('click', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            const target = parseInt(btn.dataset.tierQty || '1') || 1;
            const qtyInputEl = root.querySelector('input[name="quantity"]') as HTMLInputElement | null;
            const maxLimit = parseInt(qtyInputEl?.dataset.maxStock || '99999') || 99999;
            const val = Math.min(target, maxLimit);
            if (qtyInputEl) qtyInputEl.value = String(val);
            setQty(val);
          });
        });
      } else if (volumeBox) {
        volumeBox.remove();
      }
    }

    // Helper to clean description of custom tab headers/panes if they are injected there
    const cleanDescription = (desc: string) => {
      if (!desc) return '';
      let cleaned = desc.replace(/<div class="yaxsell-product-details-specs"[\s\S]*?<\/div>\s*<\/div>/g, '');
      cleaned = cleaned.replace(/<div class="yaxsell-product-details-specs"[\s\S]*?<\/div>/g, '');
      return cleaned.trim();
    };

    const cleanedDesc = cleanDescription(product.DESCRIPTION || '');

    // 5. Descripción y Custom Tabs (Uso de los acordeones originales de Shopify)
    const customTabs = getCustomTabsFromFeatures(product.FEATURES) ?? {};
    let techDetails = cleanedDesc;
    let usageInstructions = customTabs.usage || '';
    let ingredientsList = customTabs.ingredients || '';

    // Si estamos en modo Vista Previa y no hay datos reales, inyectamos datos demo
    const isPreview = typeof window !== 'undefined' && window.location.pathname.includes('/preview/');
    if (isPreview && !techDetails && !usageInstructions && !ingredientsList) {
      techDetails = '• Tipo de Producto: Espuma de Limpieza Facial\n• Ingrediente Principal: Extracto de Fresa Silvestre & Aminoácidos\n• Beneficio: Limpia profundamente los poros, controla el exceso de grasa.';
      usageInstructions = '1. Humedecer la piel con agua tibia.\n2. Presionar el dosificador 1-2 veces para liberar la espuma de aminoácidos.\n3. Masajear suavemente sobre el rostro con movimientos circulares durante 30 a 60 segundos.\n4. Enjuagar completamente con agua y secar con toalla limpia.';
      ingredientsList = 'Aqua, Strawberry Fruit Extract, Amino Acids (Sodium Lauroyl Glutamate, Glycine), Glycerin, Sodium Hyaluronate, Lauric Acid, Potassium Hydroxide, Parfum.';
    }

    root.querySelectorAll('accordion-component, .accordion--standard, .block-accordion').forEach(accordion => {
      // Evitar tocar el acordeón de FAQ en el footer
      if (accordion.getAttribute('data-section-id')?.includes('footer') || accordion.getAttribute('data-section-id')?.includes('FXkPhr')) {
        return;
      }

      const sectionId = accordion.getAttribute('data-section-id') || '';
      const isMainAccordion = sectionId.includes('__main');

      const rows = Array.from(accordion.querySelectorAll('.accordion__row'));

      if (isMainAccordion) {
        // ── ACORDEÓN PRINCIPAL (template--...__main) ──
        
        // Row 1: Garantía de Satisfacción
        const row1 = rows[0] as HTMLElement | undefined;
        if (row1) {
          const textSpan = row1.querySelector('.accordion__summary-text');
          if (textSpan) {
            for (let node of Array.from(textSpan.childNodes)) {
              if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) {
                node.textContent = 'Garantía de Satisfacción';
              }
            }
          }
          const contentEl = row1.querySelector('.accordion__content .rte') || row1.querySelector('.accordion__content') || row1.querySelector('[ref="content[]"]');
          if (contentEl) {
            contentEl.innerHTML = `<div style="white-space: pre-line; font-size: 14px; line-height: 1.6; color: #4b5563; padding: 10px 0;">En Kevin&Coco Chile nos esmeramos por entregarte la mejor experiencia de compra. Todos nuestros productos cuentan con garantía de calidad y soporte post-venta personalizado.</div>`;
          }
        }

        // Row 2: Métodos de Despacho
        const row2 = rows[1] as HTMLElement | undefined;
        if (row2) {
          const textSpan = row2.querySelector('.accordion__summary-text');
          if (textSpan) {
            for (let node of Array.from(textSpan.childNodes)) {
              if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) {
                node.textContent = 'Métodos de Despacho';
              }
            }
          }
          const contentEl = row2.querySelector('.accordion__content .rte') || row2.querySelector('.accordion__content') || row2.querySelector('[ref="content[]"]');
          if (contentEl) {
            contentEl.innerHTML = `<div style="white-space: pre-line; font-size: 14px; line-height: 1.6; color: #4b5563; padding: 10px 0;">Despachamos de forma segura a todo Chile. Trabajamos con las agencias líderes: <strong>Bluexpress, Starken, Varmontt, Cruz del Sur, Chevalier y CYC</strong>, garantizando que tu pedido llegue rápido y protegido.</div>`;
          }
        }

        // Row 3: Tiempos de Entrega
        const row3 = rows[2] as HTMLElement | undefined;
        if (row3) {
          const textSpan = row3.querySelector('.accordion__summary-text');
          if (textSpan) {
            for (let node of Array.from(textSpan.childNodes)) {
              if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) {
                node.textContent = 'Tiempos de Entrega';
              }
            }
          }
          const contentEl = row3.querySelector('.accordion__content .rte') || row3.querySelector('.accordion__content') || row3.querySelector('[ref="content[]"]');
          if (contentEl) {
            contentEl.innerHTML = `<div style="white-space: pre-line; font-size: 14px; line-height: 1.6; color: #4b5563; padding: 10px 0;">Tu pedido se procesa y despacha dentro de 24 a 48 horas hábiles. El plazo de entrega es de 1 a 4 días hábiles dependiendo de tu región de despacho.</div>`;
          }
        }

      } else {
        // ── ACORDEÓN DE DETALLES TÉCNICOS (template--...__custom_section_E89GLr) ──
        
        // Row 1 (first row): Detalles del Producto (Especificaciones / Características)
        const row1 = rows[0] as HTMLElement | undefined;
        if (row1) {
          if (techDetails) {
            const textSpan = row1.querySelector('.accordion__summary-text');
            if (textSpan) {
              for (let node of Array.from(textSpan.childNodes)) {
                if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) {
                  node.textContent = 'Detalles del Producto (Especificaciones / Características)';
                }
              }
            }
            const contentEl = row1.querySelector('.accordion__content .rte') || row1.querySelector('.accordion__content') || row1.querySelector('[ref="content[]"]');
            if (contentEl) {
              contentEl.innerHTML = `<div style="white-space: pre-line; font-size: 14px; line-height: 1.6; color: #4b5563; padding: 10px 0;">${techDetails}</div>`;
            }
          } else {
            row1.remove();
          }
        }

        // Row 2 (second row): Modo de Uso (Instrucciones)
        const row2 = rows[1] as HTMLElement | undefined;
        if (row2) {
          if (usageInstructions) {
            const textSpan = row2.querySelector('.accordion__summary-text');
            if (textSpan) {
              for (let node of Array.from(textSpan.childNodes)) {
                if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) {
                  node.textContent = 'Modo de Uso (Instrucciones)';
                }
              }
            }
            const contentEl = row2.querySelector('.accordion__content .rte') || row2.querySelector('.accordion__content') || row2.querySelector('[ref="content[]"]');
            if (contentEl) {
              contentEl.innerHTML = `<div style="white-space: pre-line; font-size: 14px; line-height: 1.6; color: #4b5563; padding: 10px 0;">${usageInstructions}</div>`;
            }
          } else {
            row2.remove();
          }
        }

        // Row 3 (third row): Ingredientes (Composición / Tabla Nutricional)
        const row3 = rows[2] as HTMLElement | undefined;
        if (row3) {
          if (ingredientsList) {
            const textSpan = row3.querySelector('.accordion__summary-text');
            if (textSpan) {
              for (let node of Array.from(textSpan.childNodes)) {
                if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) {
                  node.textContent = 'Ingredientes (Composición / Tabla Nutricional)';
                }
              }
            }
            const contentEl = row3.querySelector('.accordion__content .rte') || row3.querySelector('.accordion__content') || row3.querySelector('[ref="content[]"]');
            if (contentEl) {
              contentEl.innerHTML = `<div style="white-space: pre-line; font-size: 14px; line-height: 1.6; color: #4b5563; padding: 10px 0;">${ingredientsList}</div>`;
            }
          } else {
            row3.remove();
          }
        }
      }

      // Si no quedan filas de información en este acordeón, lo removemos
      const remainingRows = accordion.querySelectorAll('.accordion__row');
      if (remainingRows.length === 0) {
        accordion.remove();
      }
    });

    // Eliminar el resto de los acordeones originales (ej. FAQ o acordiones duplicados)
    root.querySelectorAll('accordion-component, .accordion, .block-accordion').forEach(el => {
      if (el.classList.contains('accordion--standard') || el.closest('.yaxsell-product-details-specs') || el.getAttribute('data-section-id')?.includes('FXkPhr')) return;
      el.remove();
    });

    // Personalizar los textos decorativos o de relleno (mock) del tema sobre ropa de niños
    root.querySelectorAll('p, span').forEach(el => {
      if (el.children.length > 0) return;
      const txt = el.textContent || '';
      if (txt.includes('Style & Comfort') || txt === 'Ficha Técnica') {
        el.textContent = 'Ficha Técnica';
      } else if (txt.includes('Elastic waistband') || txt === product.NAME) {
        el.textContent = product.NAME;
      }
    });

    // Inyectar solo la descripción en el elemento original
    root.querySelectorAll('div[class*="product_description"]').forEach(el => {
      el.innerHTML = `
        <div class="product-description-content" style="font-size: 14px; line-height: 1.7; color: #374151; margin-bottom: 24px;">
          ${cleanedDesc}
        </div>
      `;
    });

    // 6. Imágenes de la Galería Principal
    const pImages = [product.IMAGEURL, product.IMAGEURL2, product.IMAGEURL3, product.IMAGEURL4, product.IMAGEURL5].filter(Boolean).map(v => resolveStorageImageUrl(v)) as string[];
    
    if (pImages.length > 0) {
      root.querySelectorAll('.product__media img, .global-media-settings img, img[src*="LogoPoloRed"]').forEach((img: any, idx) => {
        const targetImg = pImages[idx % pImages.length] || pImages[0];
        img.src = targetImg;
        if (img.srcset) {
          img.srcset = targetImg;
        }
        if (img.getAttribute('data-media-src')) {
          img.setAttribute('data-media-src', targetImg);
        }
        img.alt = product.NAME;
      });
      
      root.querySelectorAll('.thumbnail img, .thumbnail-list__item img, img[src*="LogoPoloRed"]').forEach((img: any, idx) => {
        const targetImg = pImages[idx % pImages.length] || pImages[0];
        img.src = targetImg;
        if (img.srcset) {
          img.srcset = targetImg;
        }
        img.alt = product.NAME;
      });
    }

    // 7. Tarjetas de Productos Relacionados (Desactivado)
    root.querySelectorAll('product-recommendations, .related-products').forEach((el: any) => el.remove());

    // 8. Reemplazar "Video Feedbacks" (Opiniones en video) por "Algunas agencias con las que trabajamos"
    root.querySelectorAll('.video-testimonials-block, [class*="video-testimonials"]').forEach((el: any) => {
      el.style.setProperty('display', 'block', 'important');
      el.innerHTML = `
        <h2 class="video-testimonials__heading h5" style="font-family: 'Bricolage Grotesque', sans-serif; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #111827; margin-bottom: 12px;">
          Algunas agencias con las que trabajamos
        </h2>
        <div style="display: flex; gap: 16px 12px; flex-wrap: wrap; align-items: flex-start; justify-content: flex-start; background: #ffffff; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);">
          
          <div style="display: flex; flex-direction: column; align-items: center; width: 70px; gap: 6px;" title="Bluexpress">
            <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #ffffff; border-radius: 50%; overflow: hidden; border: 1px solid #e5e7eb; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Hc519osiibNq3LaG5QyIOkWEp7cUZqSu_OSFEv6i9zOx6Y1zzK5dnw1f&s=10" alt="Bluexpress" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.15);" />
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #4b5563; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1;">Bluexpress</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; width: 70px; gap: 6px;" title="Starken">
            <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #ffffff; border-radius: 50%; overflow: hidden; border: 1px solid #e5e7eb; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <img src="https://pbs.twimg.com/profile_images/1275538706787717122/N-FmcdAp_400x400.jpg" alt="Starken" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #4b5563; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1;">Starken</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; width: 70px; gap: 6px;" title="Varmontt">
            <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #ffffff; border-radius: 50%; overflow: hidden; border: 1px solid #e5e7eb; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXEnhvSY8qCumnADJcC_SNl1fqFnKuYKsQhuygDA5o-RCraqCNStogGqQ&s=10" alt="Varmontt" style="width: 100%; height: 100%; object-fit: contain; padding: 2px;" />
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #4b5563; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1;">Varmontt</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; width: 70px; gap: 6px;" title="Cruz del Sur">
            <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #ffffff; border-radius: 50%; overflow: hidden; border: 1px solid #e5e7eb; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY3g8yA344EfyJPWRxv9b-QQ1PF1J99PsXdq8h7pepF-w-TDNEKfZAaO1t&s=10" alt="Cruz del Sur" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.35);" />
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #4b5563; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1;">Cruz del Sur</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; width: 70px; gap: 6px;" title="Chevalier">
            <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #ffffff; border-radius: 50%; overflow: hidden; border: 1px solid #e5e7eb; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYGjXaR9Hi073KA5Gzr9eVpvQS4KOOoM7NnI4PLU48K1b0qQ2ftyYyk3NE&s=10" alt="Chevalier" style="width: 100%; height: 100%; object-fit: contain; padding: 2px;" />
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #4b5563; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1;">Chevalier</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; width: 70px; gap: 6px;" title="CYC">
            <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #ffffff; border-radius: 50%; overflow: hidden; border: 1px solid #e5e7eb; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <img src="https://www.cyccargo.cl/wp-content/uploads/2023/05/brand.png" alt="CYC" style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain; padding: 3px; transform: none !important; scale: none !important;" />
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #4b5563; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1;">CYC</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; height: 56px; padding-left: 8px;">
            <span style="font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Bricolage Grotesque', sans-serif;">y muchas otras más...</span>
          </div>
        </div>
      `;
    });


    // 9. Reconstruir Breadcrumbs
    root.querySelectorAll('.breadcrumbs, nav[aria-label="breadcrumbs"]').forEach((nav: any) => {
      nav.innerHTML = `
        <a href="/" class="reversed-link">Inicio</a>
        <span aria-hidden="true" class="breadcrumbs__sep"></span>
        <a href="/productos" class="reversed-link">Productos</a>
        ${categoryName ? `
          <span aria-hidden="true" class="breadcrumbs__sep"></span>
          <a href="/productos?categoria=${encodeURIComponent(categoryName)}" class="reversed-link">${categoryName}</a>
        ` : ''}
        <span aria-hidden="true" class="breadcrumbs__sep breadcrumbs__sep--last"></span>
        <span class="breadcrumbs__last color-subtext text-ellipsis">${product.NAME}</span>
      `;
    });

    // Override quantity selector component buttons to prevent Shopify template restriction
    const qtyInput = root.querySelector('input[name="quantity"]') as HTMLInputElement;
    const minusBtn = root.querySelector('button[name="minus"]') as HTMLButtonElement | null;
    const plusBtn = root.querySelector('button[name="plus"]') as HTMLButtonElement | null;
    
    if (qtyInput) {
      const maxStock = isLimitedStock ? (displayProduct?.STOCK ?? 0) : 99999;
      qtyInput.dataset.maxStock = String(maxStock);
      qtyInput.setAttribute('max', String(maxStock));
      qtyInput.max = String(maxStock);
      
      if (isSoldOut) {
        qtyInput.value = '0';
        qtyInput.setAttribute('disabled', 'true');
        qtyInput.style.opacity = '0.5';
      } else {
        if (qtyInput.value === '0') qtyInput.value = String(isPaquetesMode && product?.PACKQTY ? product.PACKQTY : 1);
        qtyInput.removeAttribute('disabled');
        qtyInput.style.opacity = '1';
      }

      if (minusBtn && plusBtn && !qtyInput.dataset.overrideBound) {
        qtyInput.dataset.overrideBound = '1';
        const newMinus = minusBtn.cloneNode(true) as HTMLButtonElement;
        const newPlus = plusBtn.cloneNode(true) as HTMLButtonElement;
        minusBtn.parentNode?.replaceChild(newMinus, minusBtn);
        plusBtn.parentNode?.replaceChild(newPlus, plusBtn);

        newMinus.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isSoldOut) return;
          const currentVal = parseInt(qtyInput.value) || 1;
          // 📦 Baja por puntos de control: paquetes arriba, unidades sueltas abajo
          const pRef = pricingProductRef.current || product;
          const next = Math.max(1, prevCheckpoint(pRef, currentVal));
          qtyInput.value = String(next);
          setQty(next);
        });

        newPlus.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isSoldOut) return;
          const maxLimit = parseInt(qtyInput.dataset.maxStock || '99999') || 99999;
          const currentVal = parseInt(qtyInput.value) || 1;
          // 📦 Sube por puntos de control: 1..5 de a 1, luego 6, 12, 24, 36…
          // (los umbrales exactos dependen del PACKQTY del producto)
          const pRef = pricingProductRef.current || product;
          const next = Math.min(maxLimit, nextCheckpoint(pRef, currentVal, maxLimit));
          qtyInput.value = String(next);
          setQty(next);
        });

        // Allow the user to type freely; only validate on blur/change
        qtyInput.addEventListener('input', () => {
          // Do nothing while typing – let the user type freely
        });

        const commitQty = () => {
          const raw = parseInt(qtyInput.value);
          const maxLimit = parseInt(qtyInput.dataset.maxStock || '99999') || 99999;
          let val = isNaN(raw) ? 1 : raw;
          if (val < 1) val = 1;
          if (val > maxLimit) val = maxLimit;
          qtyInput.value = String(val);
          setQty(val);
        };

        qtyInput.addEventListener('blur', commitQty);
      }
    }

    // 10. Integrar el Botón de Añadir al Carrito
    const addToCartContainer = root.querySelector('add-to-cart-component') as HTMLElement | null;
    const addToCartBtn = root.querySelector('.add-to-cart-button') as HTMLButtonElement | null;
    if (addToCartBtn) {
      // Hide the theme's original button entirely
      addToCartBtn.style.setProperty('display', 'none', 'important');

      // Check if we already injected our custom button
      let customAddBtn = addToCartContainer?.querySelector('.yaxsell-custom-add-to-cart') as HTMLButtonElement | null;
      if (!customAddBtn && addToCartContainer) {
        customAddBtn = document.createElement('button');
        customAddBtn.type = 'button';
        customAddBtn.className = 'yaxsell-custom-add-to-cart';
        customAddBtn.textContent = isSoldOut ? 'Agotado' : 'Añadir al carrito';

        // Match the Comprar Ahora button styling
        const computedStyle = window.getComputedStyle(addToCartBtn);
        const btn = customAddBtn;
        btn.style.cssText = `
          border-radius: ${computedStyle.borderRadius || '40px'};
          min-height: ${computedStyle.minHeight || '0px'};
          height: ${computedStyle.height || '50px'};
          padding: ${computedStyle.padding || '10px 34px'};
          font-size: ${computedStyle.fontSize || '15px'};
          font-weight: ${computedStyle.fontWeight || '700'};
          letter-spacing: ${computedStyle.letterSpacing || 'normal'};
          font-family: ${computedStyle.fontFamily || '"Bricolage Grotesque", sans-serif'};
          margin-top: 10px;
          display: ${isSoldOut ? 'none' : 'block'};
          width: auto;
          max-width: 300px;
          background: #e396bf;
          color: #ffffff;
          border: 1.5px solid #e396bf;
          box-shadow: none;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        `;

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const currentProduct = (activeVariantId && activeVariantId !== product.$id)
            ? (linkedProducts.find(lp => lp.$id === activeVariantId) || product)
            : product;

          const isCurrentSoldOut = (currentProduct.STOCK !== undefined && currentProduct.STOCK !== null && currentProduct.STOCK < 99999) && currentProduct.STOCK <= 0;
          if (isCurrentSoldOut) return;

          const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
          addItem(currentProduct, qty, undefined, undefined, undefined, isPaquetesMode);

          const originalText = btn.textContent;
          btn.textContent = '¡Añadido al Carrito!';
          setTimeout(() => { btn.textContent = originalText; }, 2000);
        });

        addToCartContainer.appendChild(btn);
      } else if (customAddBtn) {
        // Update text for variant changes
        customAddBtn.textContent = isSoldOut ? 'Agotado' : 'Añadir al carrito';
        customAddBtn.style.display = isSoldOut ? 'none' : 'block';
      }
    }

    // Unhide the accelerated checkout blocks
    root.querySelectorAll('.accelerated-checkout-block').forEach((el: any) => {
      el.classList.remove('no-js-hidden');
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
    });

    // 11. Integrar el Botón de Comprar Ahora (Buy it now)
    const paymentButtonContainer = root.querySelector('.shopify-payment-button') as HTMLElement | null;
    if (paymentButtonContainer) {
      // Si el contenedor existe, asegurémonos de que esté visible
      paymentButtonContainer.style.setProperty('display', 'block', 'important');
      paymentButtonContainer.style.setProperty('visibility', 'visible', 'important');
      paymentButtonContainer.style.setProperty('opacity', '1', 'important');
      
      // Busquemos si ya tenemos nuestro botón inyectado
        let customBuyBtn = paymentButtonContainer.querySelector('.yaxsell-custom-buy-button') as HTMLButtonElement | null;
        if (!customBuyBtn) {
          paymentButtonContainer.innerHTML = '';
          customBuyBtn = document.createElement('button');
          customBuyBtn.type = 'button';
          
          customBuyBtn.className = 'shopify-payment-button__button shopify-payment-button__button--unbranded yaxsell-custom-buy-button';
          customBuyBtn.textContent = 'Comprar ahora';
          
          // Make it match the size and shape of the Add to Cart button
          const addToCartBtn = root.querySelector('.add-to-cart-button') as HTMLElement | null;
          if (addToCartBtn) {
            const computedStyle = window.getComputedStyle(addToCartBtn);
            customBuyBtn.style.borderRadius = computedStyle.borderRadius || '40px';
            customBuyBtn.style.minHeight = computedStyle.minHeight;
            customBuyBtn.style.height = computedStyle.height;
            customBuyBtn.style.padding = computedStyle.padding;
            customBuyBtn.style.fontSize = computedStyle.fontSize;
            customBuyBtn.style.fontWeight = computedStyle.fontWeight;
            customBuyBtn.style.letterSpacing = computedStyle.letterSpacing;
            customBuyBtn.style.fontFamily = computedStyle.fontFamily;
          } else {
            customBuyBtn.style.borderRadius = '40px';
            customBuyBtn.style.padding = '14px 20px';
            customBuyBtn.style.fontSize = '15px';
            customBuyBtn.style.fontWeight = '400';
          }
          
          customBuyBtn.style.marginTop = '10px';
          customBuyBtn.style.display = 'block';
          
          paymentButtonContainer.appendChild(customBuyBtn);
          
          customBuyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const qtyInput = root.querySelector('input[name="quantity"]') as HTMLInputElement;
            const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
            // Use the currently active variant product
            const currentProduct = (activeVariantId && activeVariantId !== product.$id)
              ? (linkedProducts.find(lp => lp.$id === activeVariantId) || product)
              : product;
            
            // 📦 Sin overrides ni ofertas: el carrito resuelve el nivel de volumen
            addItem(currentProduct, qty, undefined, undefined, undefined, isPaquetesMode);

            router.push('/carrito');
          });
        }
        
        if (isSoldOut) {
          customBuyBtn.style.setProperty('display', 'none', 'important');
        } else {
          customBuyBtn.style.setProperty('display', 'block', 'important');
        }

        let reqBtn = paymentButtonContainer.querySelector('.yaxsell-request-stock-btn') as HTMLButtonElement | null;
        if (reqBtn) {
          reqBtn.remove();
        }
    }

    // ❌ Countdown de "oferta por tiempo limitado" eliminado: el sistema de
    // precios por volumen no usa ofertas ni descuentos artificiales.
    root.querySelector('#yaxsell-product-countdown')?.remove();

    // 12. Eliminar secciones genéricas del tema que no corresponden al producto
    const slideshowSection = root.querySelector('#shopify-section-template--20816638607498__slideshow_Etij97') ||
      Array.from(root.querySelectorAll('[id*="slideshow"]')).find(el => el.textContent?.includes('Made from a soft'));
    if (slideshowSection) {
      slideshowSection.remove();
    }

    // Eliminar la sección "product-combine" (outfits con productos genéricos del tema)
    const productCombineSection = root.querySelector('#shopify-section-template--20816638607498__products_combine_UJYhfq') ||
      root.querySelector('.product-combine')?.closest('[id*="shopify-section"]') ||
      root.querySelector('.product-combine');
    if (productCombineSection) {
      productCombineSection.remove();
    }
    // Helper: forzar carga de img del tema Shopify (bypassea responsive-image lazy loader)
    const forceImgLoad = (img: HTMLImageElement, imgUrl: string, altText: string) => {
      img.classList.remove('no-js-hidden', 'lazy', 'loading');
      img.classList.add('loaded');
      img.src = imgUrl;
      img.srcset = imgUrl;
      img.setAttribute('src', imgUrl);
      img.setAttribute('srcset', imgUrl);
      img.setAttribute('data-srcset', imgUrl);
      img.removeAttribute('is');
      img.removeAttribute('data-mode');
      img.removeAttribute('loading');
      img.removeAttribute('data-src');
      img.removeAttribute('data-default-sizes');
      img.alt = altText;
      img.style.setProperty('display', 'block', 'important');
      img.style.setProperty('visibility', 'visible', 'important');
      img.style.setProperty('opacity', '1', 'important');
      img.style.setProperty('width', '100%', 'important');
      img.style.setProperty('height', '100%', 'important');
      img.style.setProperty('object-fit', 'cover', 'important');
      // Forzar visibilidad en contenedor .media padre
      const mediaDiv = img.closest('.media') as HTMLElement | null;
      if (mediaDiv) {
        mediaDiv.style.setProperty('visibility', 'visible', 'important');
        mediaDiv.style.setProperty('opacity', '1', 'important');
        mediaDiv.classList.add('loaded', 'in-view');
      }
    };

    // 13a. Eliminar la sección "Feel good & enjoy every day" (card-layered, sección EPfJj3)
    const feelGoodSection = root.querySelector('#shopify-section-template--20816638607498__custom_section_EPfJj3') ||
      Array.from(root.querySelectorAll('[id*="custom_section"]')).find(el => el.textContent?.includes('Feel good') || el.textContent?.includes('enjoy every day'));
    if (feelGoodSection) feelGoodSection.remove();


    // Helper: traducir badges de inglés a español de maquillaje
    const translateBadges = (section: Element) => {
      const badgeMap: Record<string, string> = {
        'Wow': 'Wow',
        'Playful': 'Hermoso',
        'Soft': 'Suave',
        'Smooth': 'Lindo',
        'Fresh': 'Fresco',
        'Cute': 'Especial',
        'Cool': 'Irresistible',
      };
      // Buscar en todos los elementos de texto dentro de badge-float
      section.querySelectorAll('.badge-block__texts .text-block, badge-float .text-block, .badge-block__texts p, badge-float p, .badge-text').forEach((el: any) => {
        const txt = el.textContent?.trim();
        if (txt && badgeMap[txt]) el.textContent = badgeMap[txt];
      });
    };

    // Helper: configurar botón para Comprar ahora y scroll to top
    const setupScrollToTopButton = (btn: HTMLAnchorElement | null, text: string) => {
      if (!btn) return;
      btn.href = '#';
      const btnText = btn.querySelector('.btn__text');
      const btnIconText = btn.querySelector('.btn__icon-text');
      if (btnText) btnText.textContent = text;
      if (btnIconText) btnIconText.textContent = text;
      if (!btnText && !btnIconText) {
        btn.textContent = text;
      }
      btn.setAttribute('data-yaxsell-scroll-top', '1');
      btn.onclick = (e: Event) => {
        e.preventDefault();
        const productTop = root.querySelector('.product-page, .product__wrapper, [class*="product-detail"]') as HTMLElement | null;
        const target = productTop || root;
        (target as HTMLElement).scrollIntoView?.({ behavior: 'smooth', block: 'start' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    };

    // 13b. Sección 1 de imagen con badge (custom_section_9gHFi9) → imagen 1 del producto
    const imgBadgeSection = root.querySelector('#shopify-section-template--20816638607498__custom_section_9gHFi9') ||
      Array.from(root.querySelectorAll('[id*="custom_section"]')).find(el => el.querySelector('.image-with-badges'));
    
    if (product?.SKU === 'PROMO1' && imgBadgeSection) {
      const megaPackHtml = `
<div class="promo1-mega-pack" style="padding: 40px 16px; background: #fff; text-align: center;">
  <h2 style="font-size: 26px; font-weight: 900; color: #db2777; margin-bottom: 30px; line-height: 1.2;">🎁 Mega Pack Favoritos<br><span style="font-size: 16px; font-weight: 600; color: #666;">Incluye estos 10 productos en tu pedido</span></h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 16px; max-width: 1200px; margin: 0 auto;">
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/KC1307.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Base Raspberry Tart</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $2.760</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/KC1636.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Iluminador Kevin&Coco</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $1.620</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/B10123A.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Polvo Suelto</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $1.620</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/KC1328.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Paleta 4 Rubores</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $3.000</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/KC1068.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Corrector e Iluminador</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $3.420</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/KC1817.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Paleta Ghost Music</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $4.308</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/KC12823.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Toallitas Desmaquillantes</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $1.068</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/285850.jpg" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:12px; margin-bottom:12px; background: #fff;" />
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Set Brocha + Atomizador</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Precio Orig. $2.160</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <div style="width:100%; aspect-ratio:1; background: #ffe4e6; border-radius:12px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; font-size: 32px;">✨</div>
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Brillos Labial 6 Colores x3</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Incluido</p>
    </div>
    <div style="background: #fdf2f8; border-radius: 16px; padding: 12px; box-shadow: 0 4px 12px rgba(219,39,119,0.05);">
      <div style="width:100%; aspect-ratio:1; background: #ffe4e6; border-radius:12px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; font-size: 32px;">💖</div>
      <h4 style="font-size: 13px; font-weight: 700; color: #111; margin: 0 0 4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">Brillos Love Color x4</h4>
      <p style="font-size: 13px; font-weight: 800; color: #db2777; margin: 0;">Incluido</p>
    </div>
  </div>
</div>
      `;
      imgBadgeSection.outerHTML = megaPackHtml;
      
      // Also remove the second badge section for PROMO1
      const imgBadgeSection2 = root.querySelector('#shopify-section-template--20816638607498__custom_section_WB3EgX');
      if (imgBadgeSection2) imgBadgeSection2.remove();
      
    } else if (imgBadgeSection && pImages && pImages.length > 0) {
      const pName = product?.NAME || 'Producto';
      const pDesc = product?.DESCRIPTION || '';
      const descText = pDesc.replace(/<[^>]*>/g, '').trim().slice(0, 220);
      const shortDesc = descText.length > 0 ? descText + (pDesc.replace(/<[^>]*>/g, '').length > 220 ? '…' : '') : 'Calidad premium para tu día a día.';

      // Solo la primera imagen con badge (data-srcset específico)
      const badgeImg1 = imgBadgeSection.querySelector('img[data-srcset*="image-with-badge"]') as HTMLImageElement | null;
      if (badgeImg1) forceImgLoad(badgeImg1, pImages[0], pName);

      // Actualizar textos laterales
      const textBlocks = imgBadgeSection.querySelectorAll('motion-component p, .text-block p');
      textBlocks.forEach((p: any, idx: number) => {
        if (idx === 0) p.textContent = 'Para ti';
        else if (idx === 1) p.textContent = pName;
        else if (idx === 2) p.textContent = shortDesc;
      });

      // Actualizar enlace "Ver más" → scroll to top del producto (excluyendo el wrapper de imagen)
      const learnMoreBtn = imgBadgeSection.querySelector('.image-card__button a.btn, a.btn, a.button') as HTMLAnchorElement | null;
      setupScrollToTopButton(learnMoreBtn, 'Comprar ahora');

      // Traducir badges a español de maquillaje
      translateBadges(imgBadgeSection);

    } else if (imgBadgeSection) {
      imgBadgeSection.remove();
    }

    // 13c. Sección 2 de imagen con badge (custom_section_WB3EgX) → imagen 2 del producto (o eliminar)
    const imgBadgeSection2 = root.querySelector('#shopify-section-template--20816638607498__custom_section_WB3EgX');
    if (imgBadgeSection2 && pImages && pImages.length > 0) {
      const pName = product?.NAME || 'Producto';
      if (pImages.length >= 2) {
        // Reemplazar imagen con la segunda del producto
        const badgeImg2 = imgBadgeSection2.querySelector('img[data-srcset*="image-with-badge"], img.no-js-hidden, img[data-mode="js"]') as HTMLImageElement | null;
        if (badgeImg2) forceImgLoad(badgeImg2, pImages[1], pName);
        // Traducir badges a español de maquillaje
        translateBadges(imgBadgeSection2);
        // Actualizar textos laterales
        const textBlocks2 = imgBadgeSection2.querySelectorAll('motion-component p, .text-block p');
        textBlocks2.forEach((p: any, idx: number) => {
          if (idx === 0) p.textContent = 'Exclusivo';
          else if (idx === 1) p.textContent = pName;
        });
        // Configurar botón para scroll to top (excluyendo el wrapper de imagen)
        const learnMoreBtn2 = imgBadgeSection2.querySelector('.image-card__button a.btn, a.btn, a.button') as HTMLAnchorElement | null;
        setupScrollToTopButton(learnMoreBtn2, 'Comprar ahora');
      } else {
        // Solo 1 imagen → eliminar esta segunda sección
        imgBadgeSection2.remove();
      }
    }

    // 13d. Sección FAQ (custom_section_FXkPhr) → reemplazar imagen, traducir textos a español Kevin&Coco Chile
    const faqSection = root.querySelector('#shopify-section-template--20816638607498__custom_section_FXkPhr');
    if (faqSection) {
      // 1. Reemplazar imagen del banner FAQ
      const faqBannerImg = faqSection.querySelector('img[data-srcset*="FAQ-banner"], img[data-srcset*="faq-banner"], picture img') as HTMLImageElement | null;
      const faqBannerSource = faqSection.querySelector('picture source') as HTMLSourceElement | null;
      const faqImgUrl = 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/IADESIGN/2026/06/1781499936436-pegada-1781499934553.png?GoogleAccessId=imagen%40geminai-449212.iam.gserviceaccount.com&Expires=16730334000&Signature=E7usYNVhdHKHMBTkbk41zENmNoMQpM25RB14tPh6y%2BmuTbknH%2FVy8O9LSzGrFU1J4J1s3nA%2BMyKJRDWCCFlLdinGQxgAZ1S81zIMgczSGFe%2F3xkfsDUBhu8X55HoSRl5q1tdNQnmmWEzUS0n0d4rRz9OGGZDvFVIwHaOS1TfLzCxIiXQ0aIE4rCbBzzTLbjh%2ByDMQlJXqP1hpQWb3zle0HndPSYibbtf6IS%2Fh9HV78dqxPMLi6igrl61kziwpOFepceXXfUNDg3hWBIwyle9QRa4tyk5ZY7LWNDgaEyHZ3og8d6TemM9y2%2FVJyImhT0BLBVaGOsy74i8cRhNl1Lm%2FA%3D%3D';
      if (faqBannerImg) {
        forceImgLoad(faqBannerImg, faqImgUrl, 'Kevin & Coco Chile');
      }
      if (faqBannerSource) {
        faqBannerSource.srcset = faqImgUrl;
        faqBannerSource.setAttribute('data-srcset', faqImgUrl);
      }

      // 2. Traducir textos del FAQ a español con brand Kevin&Coco Chile
      const faqTranslations: Record<string, string> = {
        'Still Need Help?': '¿Tienes más preguntas?',
        'Shoot our team an email': 'Escríbenos y te respondemos',
        "Shoot our team an email & we'll get": 'Escríbenos y te respondemos',
        "Shoot our team an email & we'll get back to you ASAP": 'Escríbenos y te respondemos a la brevedad',
        "Shoot our team an email & we'll get back to you asap": 'Escríbenos y te respondemos a la brevedad',
        "we'll get back to you asap": 'te respondemos a la brevedad',
        "we'll get back to you ASAP": 'te respondemos a la brevedad',
        "we’ll get back to you asap": 'te respondemos a la brevedad',
        "we’ll get back to you ASAP": 'te respondemos a la brevedad',
        'get back to you asap': 'te respondemos a la brevedad',
        'get back to you ASAP': 'te respondemos a la brevedad',
        'Learn more': 'Más info',
        'Contact us': 'Contáctanos',
        'Frequently Asked Questions': 'Preguntas Frecuentes',
        'How long does it take to process an order?': '¿Cuánto demora en procesarse mi pedido?',
        'Orders are usually processed within 1–2 business days. You\'ll receive a confirmation email once your order is fully prepared and ready to ship.': 'Los pedidos se procesan en 1–2 días hábiles. Recibirás un correo de confirmación cuando tu pedido esté listo para despacho.',
        'Orders are usually processed within 1': 'Los pedidos se procesan en 1',
        'Do you ship internationally?': '¿Hacen envíos a regiones de Chile?',
        'Yes, we ship to most countries worldwide. Shipping times and rates vary by location, and all available options will be shown at checkout.': 'El envío es con pago contra entrega (paga al recibir). Nosotros le enviaremos el comprobante de envío para que vea cuánto tiene que pagar y el número de seguimiento estará disponible en \'Mis pedidos\' de su perfil de usuario.',
        'What is your return policy?': '¿Cuál es la política de devoluciones?',
        'We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original condition with tags attached for a full refund.': 'Aceptamos devoluciones dentro de los 10 primeros días si el producto está dañado o roto. Podemos realizar una negociación o el cliente puede devolver el producto para realizarle el reembolso correspondiente.',
        'What are your sizing options?': '¿Tienen retiro en tienda?',
        'We offer a full range of sizes from XS to XL. Refer to our detailed size chart for accurate measurements to find your perfect fit.': 'Sí, contamos con retiro en tienda en nuestro local Kevin&amp;Coco Chile.<br><br><strong>Retiro disponible (Generalmente listo en 24 horas)</strong><br><strong>Dirección:</strong> Toesca 2537, 8370287 Santiago, Región Metropolitana<br><strong>Teléfono:</strong> 9 9914 9712<br><br><strong>Horarios de Atención:</strong><br>Lunes a Viernes: 10:00 – 19:00<br>Sábado: 10:00 – 17:00<br>Domingo: Cerrado',
        'Manejamos tallas desde XS hasta XL. Consulta nuestra guía de tallas para encontrar tu medida perfecta.': 'Sí, contamos con retiro en tienda en nuestro local Kevin&amp;Coco Chile.<br><br><strong>Retiro disponible (Generalmente listo en 24 horas)</strong><br><strong>Dirección:</strong> Toesca 2537, 8370287 Santiago, Región Metropolitana<br><strong>Teléfono:</strong> 9 9914 9712<br><br><strong>Horarios de Atención:</strong><br>Lunes a Viernes: 10:00 – 19:00<br>Sábado: 10:00 – 17:00<br>Domingo: Cerrado',
      };

      // Reemplazar textos iterando sobre todos los nodos de texto
      faqSection.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span.accordion__summary-text, .btn__text, .btn__icon-text').forEach((el: any) => {
        const txt = el.textContent?.trim();
        if (txt && faqTranslations[txt]) {
          el.textContent = faqTranslations[txt];
        }
      });

      // Reemplazar textos por replaceAll en el HTML del FAQ (para parrafos con texto exacto)
      let faqHtml = faqSection.innerHTML;
      Object.entries(faqTranslations).forEach(([en, es]) => {
        faqHtml = faqHtml.split(en).join(es);
        
        // Manejar variaciones de apóstrofes (recto, curvo, entidades HTML)
        const variations = [
          en.replace(/'/g, '’'),
          en.replace(/'/g, '&#39;'),
          en.replace(/'/g, '&apos;'),
          en.replace(/'/g, '&#x27;')
        ];
        variations.forEach(variant => {
          if (variant !== en) {
            faqHtml = faqHtml.split(variant).join(es);
          }
        });
      });
      faqSection.innerHTML = faqHtml;

      // Volver a aplicar la imagen después de reemplazar innerHTML (se pierde el src)
      const faqBannerImg2 = faqSection.querySelector('img[data-srcset*="FAQ-banner"], img[data-srcset*="faq-banner"], picture img') as HTMLImageElement | null;
      if (faqBannerImg2) forceImgLoad(faqBannerImg2, faqImgUrl, 'Kevin & Coco Chile');
      const faqBannerSource2 = faqSection.querySelector('picture source') as HTMLSourceElement | null;
      if (faqBannerSource2) { faqBannerSource2.srcset = faqImgUrl; faqBannerSource2.setAttribute('data-srcset', faqImgUrl); }

      // Configurar botón para scroll to top (excluyendo el wrapper de imagen)
      const faqBtn = faqSection.querySelector('.image-card__button a.btn, a.btn, a.button') as HTMLAnchorElement | null;
      setupScrollToTopButton(faqBtn, 'Comprar ahora');
    }

    // 13e. Bloquear botones de compartir
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

    // 13f. Configurar el botón "¿Necesitas ayuda?" para WhatsApp
    const helpBtn = root.querySelector('.help-desk-link');
    if (helpBtn) {
      helpBtn.setAttribute('href', 'https://wa.me/56999149712');
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



    const testimonialsSection = root.querySelector('#shopify-section-template--20816638607498__testimonials_parallax_jGpBe7') ||
      root.querySelector('testimonial-parallax')?.closest('[id*="shopify-section"]') ||
      root.querySelector('testimonial-parallax');
    if (testimonialsSection) {
      testimonialsSection.remove();
    }

    // 15. Marquee (custom_section_4XBchF) → textos KEVIN&COCO belleza + fondo rosa pastel + letra blanca
    const marqueeSection = root.querySelector('#shopify-section-template--20816638607498__custom_section_4XBchF');
    if (marqueeSection) {
      // Cambiar fondo a rosa pastel
      const marqueeWrapper = marqueeSection.querySelector('.marquee, .marquee__wrapper, [class*="marquee"]') as HTMLElement | null;
      if (marqueeWrapper) {
        marqueeWrapper.style.setProperty('background', '#f8bbd9', 'important');
        marqueeWrapper.style.setProperty('background-color', '#f8bbd9', 'important');
      }
      // Aplicar estilos a la sección completa
      (marqueeSection as HTMLElement).style.setProperty('background', '#f8bbd9', 'important');
      (marqueeSection as HTMLElement).style.setProperty('background-color', '#f8bbd9', 'important');

      // Inyectar CSS para sobreescribir el color de fondo del marquee
      const marqueeStyle = root.querySelector('#yx-marquee-style') || document.createElement('style');
      marqueeStyle.id = 'yx-marquee-style';
      marqueeStyle.textContent = `
        #shopify-section-template--20816638607498__custom_section_4XBchF,
        #shopify-section-template--20816638607498__custom_section_4XBchF .section,
        #shopify-section-template--20816638607498__custom_section_4XBchF .marquee,
        #shopify-section-template--20816638607498__custom_section_4XBchF .marquee__wrapper {
          background: #f8bbd9 !important;
          background-color: #f8bbd9 !important;
          color: #fff !important;
        }
        #shopify-section-template--20816638607498__custom_section_4XBchF p,
        #shopify-section-template--20816638607498__custom_section_4XBchF span,
        #shopify-section-template--20816638607498__custom_section_4XBchF .text-block {
          color: #fff !important;
        }
        #shopify-section-template--20816638607498__custom_section_4XBchF .separator__shape {
          background: rgba(255,255,255,0.5) !important;
        }
        @media (max-width: 768px) {
          #shopify-section-template--20816638607498__custom_section_4XBchF p,
          #shopify-section-template--20816638607498__custom_section_4XBchF span {
             padding: 0 16px !important;
          }
        }
      `;
      (root.querySelector('head') || document.head || root).appendChild(marqueeStyle);

      // Reemplazar textos del marquee con contenido KEVIN&COCO belleza (usando módulo para asegurar reemplazo en elementos clonados)
      const marqueeTexts = [
        'KEVIN & COCO', 'Tu belleza primero', 'KEVIN & COCO', 'Brilla siempre',
        'KEVIN & COCO', 'Confiá en ti', 'KEVIN & COCO', 'Cuida tu piel',
      ];
      const marqueeParas = Array.from(marqueeSection.querySelectorAll('.marquee__items p, .marquee p, [class*="marquee"] p'));
      marqueeParas.forEach((p: any, idx: number) => {
        p.textContent = marqueeTexts[idx % marqueeTexts.length];
      });
    }

    // 16. Eliminar sección icon-box (custom_section_4yLVt7) — textos genéricos que no aplican
    const iconBoxSection = root.querySelector('#shopify-section-sections--20816632381578__custom_section_4yLVt7') ||
      root.querySelector('[id*="custom_section_4yLVt7"]');
    if (iconBoxSection) iconBoxSection.remove();


    // 14. Actualizar el botón del banner "Inspiración de Atuendos" para llevar a la categoría del producto
    // Buscar el bloque promotion-alert que contiene el botón con href=/collections/all
    const promotionAlerts = Array.from(root.querySelectorAll('.promotion-alert__wrapper, .promotion-alert'));
    const outfitAlert = promotionAlerts.find(el => el.textContent?.includes('Inspiración de Atuendos') || el.textContent?.includes('Outfit Inspiration') || el.textContent?.includes('Armario') || el.textContent?.includes('wardrobe'));
    if (outfitAlert) {
      // Actualizar el enlace del botón para llevar a productos de la categoría
      const alertBtn = outfitAlert.querySelector('a[href*="collections"], a[href*="products"], a[aria-label="Show now"]') as HTMLAnchorElement | null;
      if (alertBtn && !alertBtn.dataset.yaxsellBtnPatched) {
        alertBtn.dataset.yaxsellBtnPatched = '1';
        const categorySlug = (categoryName || '').toLowerCase().replace(/\s+/g, '-');
        alertBtn.href = `/collections/${categorySlug || 'all'}`;
        alertBtn.setAttribute('aria-label', '¿Buscas algo similar?');
        alertBtn.classList.remove('btn--icon-only');
        alertBtn.style.cssText += '; display: inline-flex !important; align-items: center !important; gap: 6px !important; padding: 8px 16px !important; font-size: 13px !important; font-weight: 700 !important; white-space: nowrap !important;';
        // Insertar texto antes del icono (solo una vez)
        const iconSpan = alertBtn.querySelector('.icon');
        const textNode = document.createElement('span');
        textNode.textContent = '¿Buscas algo similar?';
        textNode.style.cssText = 'font-size: 13px; font-weight: 700; color: inherit;';
        if (iconSpan) {
          alertBtn.insertBefore(textNode, iconSpan);
        } else {
          alertBtn.prepend(textNode);
        }
      }
    }


    // Indicar que Yaxsell está listo
    root.dataset.yaxsellReady = 'true';
  };

  /* ── Set innerHTML on load and do immediate pre-injection replacements ── */
  useEffect(() => {
    if (!bodyHtml || !product || !refElement) return;
    
    const root = refElement;
    
    // 📦 Precio inicial: nivel Detalle (precio por defecto al entrar al producto).
    // Sin ofertas ni descuentos — applyYaxsellData pinta luego el nivel según cantidad.
    const formattedPrice = formatPrice(resolveVolumeTier(product, qty).unitPrice * qty);

    if (!root.dataset.htmlSet) {
      // Reemplazar imágenes principales y texto del producto en el string HTML crudo antes de la inyección
      let processedHtml = bodyHtml;

      // Desactivar el componente de acordeón personalizado de Shopify para evitar que sobrescriba el DOM en el connectedCallback
      processedHtml = processedHtml.replaceAll('<accordion-component', '<div');
      processedHtml = processedHtml.replaceAll('</accordion-component>', '</div>');

      // Desactivar el componente de precio personalizado de Shopify para evitar que su script connectedCallback sobrescriba el DOM
      processedHtml = processedHtml.replaceAll('<product-price', '<div class="yaxsell-product-price-container"');
      processedHtml = processedHtml.replaceAll('</product-price>', '</div>');
      
      processedHtml = processedHtml.replaceAll('Logo Polo Red', product.NAME);
      processedHtml = processedHtml.replaceAll('$45.00', formattedPrice);
      
      // Realizar todos los reemplazos de traducción en el HTML crudo directamente
      processedHtml = processedHtml.replace(/Pebble\s*Little/gi, 'Yaxsell');
      processedHtml = processedHtml.replace(/pebble-little/gi, 'yaxsell');
      processedHtml = processedHtml.replaceAll('Home', 'Inicio');
      processedHtml = processedHtml.replaceAll('Accessories', categoryName || 'Productos');
      processedHtml = processedHtml.replaceAll('New', 'Nuevo');
      processedHtml = processedHtml.replaceAll('Popular', 'Popular');
      processedHtml = processedHtml.replaceAll('Regular price $0', 'Precio normal');
      processedHtml = processedHtml.replaceAll('Regular price', 'Precio normal');
      processedHtml = processedHtml.replaceAll('Sale price', 'Precio oferta');
      processedHtml = processedHtml.replaceAll('Color: Red', 'Color: Seleccionado');
      processedHtml = processedHtml.replaceAll('Size: 3Y', 'Talla: Seleccionada');
      processedHtml = processedHtml.replaceAll('Size Guide', 'Guía de tallas');
      processedHtml = processedHtml.replaceAll('In - stock and ready to ship', 'Stock disponible');
      processedHtml = processedHtml.replaceAll('In-stock and ready to ship', 'Stock disponible');
      processedHtml = processedHtml.replaceAll('Quantity', 'Cantidad');
      processedHtml = processedHtml.replaceAll('Add to cart', 'Agregar al carrito');
      processedHtml = processedHtml.replaceAll('Buy it now', 'Comprar ahora');
      processedHtml = processedHtml.replaceAll('Free shipping', 'ENVIO SEGURO');
      processedHtml = processedHtml.replaceAll('Easy return', 'COMPRA PROTEGIDA');
      processedHtml = processedHtml.replaceAll('Safe checkout', 'PAGO GARANTIZADO');
      processedHtml = processedHtml.replaceAll('Product Details', 'Detalles del Producto');
      processedHtml = processedHtml.replaceAll('Video Feedbacks', 'Opiniones en Video');
      processedHtml = processedHtml.replaceAll('Materials', 'Materiales');
      processedHtml = processedHtml.replaceAll('Shipping & Returns', 'Envíos y Devoluciones');
      processedHtml = processedHtml.replaceAll('Share:', 'Compartir:');
      processedHtml = processedHtml.replaceAll('Share on Facebook', 'Compartir en Facebook');
      processedHtml = processedHtml.replaceAll('Share on Pinterest', 'Compartir en Pinterest');
      processedHtml = processedHtml.replaceAll('Share on X (Twitter)', 'Compartir en X (Twitter)');
      processedHtml = processedHtml.replaceAll('Need help ?', '¿Necesitas ayuda?');
      processedHtml = processedHtml.replaceAll('Need help?', '¿Necesitas ayuda?');
      processedHtml = processedHtml.replaceAll('Outfit Inspiration', '✨ Élígete Bella');
      processedHtml = processedHtml.replaceAll('Ideas to refresh your everyday wardrobe', 'Porque cuidarte es quererte. Brilla siempre.');
      processedHtml = processedHtml.replaceAll('Over 500 Happy Reviews', 'Más de 500 opiniones felices');
      
      // Traducciones globales de botones y FAQ
      processedHtml = processedHtml.replaceAll('Learn more', 'Comprar ahora');
      processedHtml = processedHtml.replaceAll('Learn More', 'Comprar ahora');
      processedHtml = processedHtml.replaceAll('Shop Now', 'Comprar ahora');
      processedHtml = processedHtml.replaceAll('Shop now', 'Comprar ahora');
      processedHtml = processedHtml.replaceAll('Contact us', 'Contáctanos');
      processedHtml = processedHtml.replaceAll('Contact Us', 'Contáctanos');
      processedHtml = processedHtml.replaceAll('Continue shopping', 'Continuar comprando');
      processedHtml = processedHtml.replaceAll('Continue Shopping', 'Continuar comprando');
      processedHtml = processedHtml.replaceAll('Still Need Help?', '¿Tienes más preguntas?');
      processedHtml = processedHtml.replaceAll('Frequently Asked Questions', 'Preguntas Frecuentes');
      processedHtml = processedHtml.replaceAll('How long does it take to process an order?', '¿Cuánto demora en procesarse mi pedido?');
      processedHtml = processedHtml.replaceAll('Do you ship internationally?', '¿Hacen envíos a regiones de Chile?');
      processedHtml = processedHtml.replaceAll('What is your return policy?', '¿Cuál es la política de devoluciones?');
      processedHtml = processedHtml.replaceAll('What are your sizing options?', '¿Tienen envío express?');
      
      const pImages = [product.IMAGEURL, product.IMAGEURL2, product.IMAGEURL3, product.IMAGEURL4, product.IMAGEURL5].filter(Boolean).map(v => resolveStorageImageUrl(v)) as string[];
      if (pImages.length > 0) {
        // Expresión regular para borrar de raíz cualquier URL con tamaños o v= del polo rojo
        processedHtml = processedHtml.replace(/(https?:)?\/\/(pebble-little|yaxsell)\.myshopify\.com\/cdn\/shop\/files\/LogoPoloRed-12([1-5])[^"'\s,]*/g, (match, p1, p2, p3) => {
          const idx = parseInt(p3) - 1;
          return pImages[idx] || pImages[0];
        });
        processedHtml = processedHtml.replace(/(https?:)?\/\/(pebble-little|yaxsell)\.myshopify\.com\/cdn\/shop\/files\/LogoPoloRed[^"'\s,]*/g, pImages[0]);
      }

      root.innerHTML = processedHtml;
      root.dataset.htmlSet = '1';
      // Remove leftover Shopify elements
      root.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());

      // 🔑 KEY FIX: Directly update every thumbnail img's src/srcset in the DOM after injection
      // The regex approach misses images inside srcset with multiple resolutions separated by commas
      if (pImages.length > 0) {
        // Fix all thumbnail images directly in DOM after injection
        // Also remove Shopify's responsive-image custom element ('is' attr) that overrides src after we set it
        root.querySelectorAll('.media-gallery__carousel-thumbnails .carousel__thumbnail').forEach((thumb: any, tIdx: number) => {
          const imgUrl = pImages[tIdx % pImages.length] || pImages[0];
          thumb.style.setProperty('overflow', 'hidden', 'important');
          thumb.style.setProperty('border-radius', '50%', 'important');
          thumb.classList.remove('is-hidden');
          thumb.classList.add('loaded', 'is-revealed');

          thumb.querySelectorAll('img, source').forEach((el: any) => {
            el.src = imgUrl;
            el.srcset = imgUrl;
            el.setAttribute('src', imgUrl);
            el.setAttribute('srcset', imgUrl);
            el.setAttribute('sizes', '80px');
            el.removeAttribute('data-src');
            el.removeAttribute('data-srcset');
            el.removeAttribute('loading');
            el.removeAttribute('is');
            el.removeAttribute('data-mode');
            el.classList.add('loaded');
            el.classList.remove('lazy');
            el.style.setProperty('width', '100%', 'important');
            el.style.setProperty('height', '100%', 'important');
            el.style.setProperty('object-fit', 'cover', 'important');
            el.style.setProperty('border-radius', '50%', 'important');
            el.style.setProperty('display', 'block', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
            el.style.setProperty('opacity', '1', 'important');
          });
        });

        // Also update grid thumbnails (desktop side panel)
        root.querySelectorAll('.media-gallery__grid-thumbnails .media-gallery__item, .media-gallery__grid-thumbnails .thumbnail-list__item, .media-gallery__grid-thumbnails li').forEach((thumb: any, idx: number) => {
          const imgUrl = pImages[idx % pImages.length] || pImages[0];
          thumb.querySelectorAll('img, source').forEach((el: any) => {
            el.src = imgUrl;
            el.srcset = imgUrl;
            el.setAttribute('src', imgUrl);
            el.setAttribute('srcset', imgUrl);
            el.removeAttribute('is');
            el.removeAttribute('data-mode');
          });
        });

        // Fix main gallery slider images and their container elements
        // Count only gallery items (not thumbnails)
        const galleryItems = Array.from(root.querySelectorAll('.media-gallery__item')).filter((item: any) =>
          !item.closest('.media-gallery__carousel-thumbnails') && !item.closest('.media-gallery__grid-thumbnails')
        );

        galleryItems.forEach((item: any, idx: number) => {
          // If there are more slides than images, hide extra slides to prevent duplicate scrolling
          if (idx >= pImages.length) {
            const slide = item.closest('.swiper-slide') || item;
            (slide as HTMLElement).style.setProperty('display', 'none', 'important');
            return;
          }

          const imgUrl = pImages[idx] || pImages[0];

          // Fix data attributes for Photoswipe zoom
          item.setAttribute('data-media-src', imgUrl);
          item.setAttribute('data-media-width', "1440");
          item.setAttribute('data-media-height', "1438");

          // Force aspect ratio 1440x1438 on the media container
          item.style.setProperty('aspect-ratio', '1440 / 1438', 'important');
          item.style.setProperty('width', '100%', 'important');
          item.style.setProperty('height', 'auto', 'important');

          const el = item.querySelector('img');
          if (el) {
            el.src = imgUrl;
            el.setAttribute('src', imgUrl);
            el.removeAttribute('srcset');
            el.removeAttribute('sizes');
            el.removeAttribute('is');
            el.removeAttribute('data-mode');
            el.removeAttribute('loading');
            el.classList.add('loaded', 'is-revealed');
            // Force square crop
            el.style.setProperty('width', '100%', 'important');
            el.style.setProperty('height', '100%', 'important');
            el.style.setProperty('object-fit', 'cover', 'important');
            el.style.setProperty('aspect-ratio', '1440 / 1438', 'important');
            el.style.setProperty('display', 'block', 'important');
          }
        });

        // Also hide extra swiper slides in the main carousel wrapper
        const mainSlides = root.querySelectorAll('.media-gallery__carousel-wrapper .swiper-slide');
        mainSlides.forEach((slide: any, idx: number) => {
          if (slide.closest('.media-gallery__carousel-thumbnails')) return;
          if (idx >= pImages.length) {
            slide.style.setProperty('display', 'none', 'important');
          }
        });
      }
    }

    // Apply replacements immediately
    applyYaxsellData();
  }, [bodyHtml, product, refElement, apertura]);

  /* ── Force data updates on elements (cascade to override late-loading custom element lifecycle) ── */
  useEffect(() => {
    if (!product || !bodyHtml) return;
    
    // Run immediately
    applyYaxsellData();
    
    // Run cascade of timeouts to override late custom element boots
    const t1 = setTimeout(applyYaxsellData, 100);
    const t2 = setTimeout(applyYaxsellData, 300);
    const t3 = setTimeout(applyYaxsellData, 600);
    const t4 = setTimeout(applyYaxsellData, 1200);
    const t5 = setTimeout(applyYaxsellData, 2500);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [product, bodyHtml, categoryName, related, refElement, activeVariantId, linkedProducts, variantLabels, qty, apertura]);

  /* ── Intercept zoom button clicks to show custom fullscreen image viewer (fixes mobile blank issue) ── */
  useEffect(() => {
    if (!product || !refElement) return;
    const pImages = [product.IMAGEURL, product.IMAGEURL2, product.IMAGEURL3, product.IMAGEURL4, product.IMAGEURL5].filter(Boolean).map(v => resolveStorageImageUrl(v)) as string[];
    if (pImages.length === 0) return;

    // Remove Shopify's zoom handlers from buttons so PhotoSwipe never opens
    const stripShopifyZoom = () => {
      refElement.querySelectorAll('button[on\\:click*="openZoomDialog"]').forEach((btn: any) => {
        btn.removeAttribute('on:click');
      });
    };
    stripShopifyZoom();
    const stripTimer1 = setTimeout(stripShopifyZoom, 200);
    const stripTimer2 = setTimeout(stripShopifyZoom, 800);
    const stripTimer3 = setTimeout(stripShopifyZoom, 1500);

    const handleZoomClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest('button[data-media-id]');
      if (!btn) return;
      // Only trigger for zoom buttons (they have the zoom spinner ref)
      if (!btn.querySelector('[ref="zoomDialogSpinner"]') && !btn.classList.contains('media-gallery__zoom-btn')) return;

      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      // Figure out which image index
      const mediaId = btn.getAttribute('data-media-id');
      const gallery = btn.closest('media-gallery');
      let imgIdx = 0;
      if (gallery && mediaId) {
        const slides = Array.from(gallery.querySelectorAll('.media-gallery__carousel-wrapper .media-gallery__item[data-media-id]'));
        const found = slides.findIndex((s: any) => s.getAttribute('data-media-id') === mediaId);
        if (found !== -1) imgIdx = found % pImages.length;
      }

      // Kill any existing PhotoSwipe overlay
      document.querySelectorAll('.pswp, .pswp--open').forEach(el => el.remove());

      const overlay = document.createElement('div');
      overlay.id = 'yxs-zoom-overlay';
      let currentIdx = imgIdx;

      const svgPrev = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.5 16.25L6.25 10L12.5 3.75"/></svg>';
      const svgNext = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 3.75L13.75 10L7.5 16.25"/></svg>';
      const svgClose = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.625 4.375L4.375 15.625"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.625 15.625L4.375 4.375"/></svg>';

      const render = () => {
        overlay.innerHTML = `
          <div style="position:fixed;inset:0;z-index:999999;background:#fff;display:flex;align-items:center;justify-content:center;">
            <img src="${pImages[currentIdx]}" style="max-width:94vw;max-height:90vh;object-fit:contain;" />
            <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:12px;align-items:center;">
              ${pImages.length > 1 ? `<button id="yxs-zoom-prev" style="width:48px;height:48px;border-radius:50%;border:1px solid #e0e0e0;background:#fff;color:#333;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.08);transition:background .15s;">${svgPrev}</button>` : ''}
              <button id="yxs-zoom-close" style="width:48px;height:48px;border-radius:50%;border:1px solid #e0e0e0;background:#fff;color:#333;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.08);transition:background .15s;">${svgClose}</button>
              ${pImages.length > 1 ? `<button id="yxs-zoom-next" style="width:48px;height:48px;border-radius:50%;border:1px solid #e0e0e0;background:#fff;color:#333;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.08);transition:background .15s;">${svgNext}</button>` : ''}
            </div>
          </div>
        `;
      };

      render();
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const closeOverlay = () => {
        overlay.remove();
        document.body.style.overflow = '';
        // Also kill any PhotoSwipe that might have snuck in
        document.querySelectorAll('.pswp, .pswp--open').forEach(el => el.remove());
      };

      overlay.addEventListener('click', (ev) => {
        const target = ev.target as HTMLElement;
        const clickedBtn = target.closest('button');
        if (clickedBtn?.id === 'yxs-zoom-close') {
          closeOverlay();
        } else if (clickedBtn?.id === 'yxs-zoom-prev') {
          currentIdx = (currentIdx - 1 + pImages.length) % pImages.length;
          render();
        } else if (clickedBtn?.id === 'yxs-zoom-next') {
          currentIdx = (currentIdx + 1) % pImages.length;
          render();
        } else if (!target.closest('img') && !target.closest('button')) {
          closeOverlay();
        }
      });
    };

    // Capture phase to intercept before Shopify's handler
    refElement.addEventListener('click', handleZoomClick, true);
    return () => {
      refElement.removeEventListener('click', handleZoomClick, true);
      clearTimeout(stripTimer1);
      clearTimeout(stripTimer2);
      clearTimeout(stripTimer3);
    };
  }, [product, refElement]);

  // ❌ Countdown de ofertas eliminado: sin descuentos artificiales,
  // el precio se rige solo por el sistema de volumen (3 niveles).

  /* ── Inject window.Shopify stub BEFORE loading JS ── */
  useEffect(() => {
    // Global error listener to suppress matchAll and Appwrite non-critical console errors
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || '';
      if (msg.includes("matchAll") || msg.includes('AppwriteException') || msg.includes('recommendations') || msg.includes('removeDesignModeListener')) {
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

    // Suppress console.error for Shopify recommendations
    const origConsoleError = console.error;
    console.error = (...args) => {
      const msg = args.join(' ');
      if (msg.includes('Product recommendations error') || msg.includes('removeDesignModeListener')) return;
      origConsoleError(...args);
    };

    // Polyfill Shopify design mode methods that cause crashes on unmount
    if (typeof HTMLElement !== 'undefined' && !(HTMLElement.prototype as any).removeDesignModeListener) {
      (HTMLElement.prototype as any).removeDesignModeListener = function() {};
    }
    if (typeof HTMLElement !== 'undefined' && !(HTMLElement.prototype as any).addDesignModeListener) {
      (HTMLElement.prototype as any).addDesignModeListener = function() {};
    }

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
      
      // Let standard Appwrite API traffic flow so backend features work!
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
      document.querySelectorAll('.animation-element, .animation-wrapper, .scroll-trigger, .animate--slide-in, .animate--fade-in').forEach(el => {
        el.classList.add('in-view');
        el.classList.add('scroll-trigger--in-view');
      });
      document.querySelectorAll('split-hero video, .split-hero video').forEach(el => {
        const video = el as HTMLVideoElement;
        video.muted = true;
        video.play().catch(() => {});
      });
      document.querySelectorAll('.split-hero-column__media').forEach(el => {
        if (!el.classList.contains('is-collapsed')) {
          el.classList.add('is-collapsed');
        }
      });
      document.querySelectorAll('split-hero').forEach(el => {
        try { (el as any).initParallaxScrollAnimation(); } catch(e) {}
      });
    };

    (async () => {
      for (const f of JS_FILES) {
        await loadOne(f);
      }

      setTimeout(() => {
        forceInView();
        applyYaxsellData(); // Enforce Yaxsell replacements again once all custom elements boot
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

  /* ── Submit Stock Request ── */
  const handleStockRequest = async () => {
    if (!user || !product) return;
    setIsRequestingStock(true);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.createDocument(
        databaseId,
        STOCK_REQUESTS_COLLECTION,
        'unique()',
        {
          productId: product.$id,
          productName: product.NAME,
          userId: user.id,
          userEmail: user.email || '',
          requestedQuantity: stockRequestQty,
          status: 'pending',
        }
      );
      setHasPendingRequest(true);
      setIsStockRequestModalOpen(false);
      alert('Tu solicitud ha sido enviada con éxito. Te notificaremos cuando tengamos más stock.');
    } catch (err: any) {
      console.error('Error submitting stock request:', err);
      if (err?.message?.includes('could not be found')) {
        alert('La función de solicitud de stock no está disponible en este momento.');
      } else {
        alert('Hubo un error al enviar tu solicitud. Intenta nuevamente.');
      }
    } finally {
      setIsRequestingStock(false);
    }
  };

  if (isLoading || !bodyHtml) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center', padding: 80, fontFamily: 'system-ui, sans-serif', color: '#e396bf', background: '#fffcfd', minHeight: '100vh' }}>
        <div style={{ border: '4px solid #fce7f3', borderTop: '4px solid #e396bf', borderRadius: '50%', width: 50, height: 50, animation: 'spin 1s linear infinite', marginBottom: 20 }} />
        <span style={{ fontSize: 16, fontWeight: 500 }}>Cargando detalles del producto...</span>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
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

        /* Ocultar imágenes originales y tarjetas de producto hasta que Yaxsell esté listo */
        .tpl5-shopify-root:not([data-yaxsell-ready="true"]) img,
        .tpl5-shopify-root:not([data-yaxsell-ready="true"]) product-card,
        .tpl5-shopify-root:not([data-yaxsell-ready="true"]) .product-card {
          opacity: 0 !important;
          visibility: hidden !important;
        }

        /* Transición suave cuando ya esté cargado */
        .tpl5-shopify-root img,
        .tpl5-shopify-root product-card,
        .tpl5-shopify-root .product-card {
          transition: opacity 0.4s ease, visibility 0.4s ease;
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

        /* Request stock button custom styling (forces white background, black text on initial load, inverse on hover) */
        .tpl5-page-wrapper button.yaxsell-request-stock-btn,
        .tpl5-page-wrapper .yaxsell-request-stock-btn {
          background: #ffffff !important;
          color: #000000 !important;
          border: 1px solid #000000 !important;
          transition: all 0.2s ease !important;
        }
        .tpl5-page-wrapper button.yaxsell-request-stock-btn:hover,
        .tpl5-page-wrapper .yaxsell-request-stock-btn:hover {
          background: #000000 !important;
          color: #ffffff !important;
          border: 1px solid #000000 !important;
        }
        .tpl5-page-wrapper button.yaxsell-request-stock-btn[disabled],
        .tpl5-page-wrapper .yaxsell-request-stock-btn.is-pending {
          background: #f3f4f6 !important;
          color: #9ca3af !important;
          border: 1px solid #d1d5db !important;
          cursor: not-allowed !important;
        }

        /* ── Quantity Selector Premium Design ── */
        .tpl5-page-wrapper quantity-selector-component,
        .tpl5-page-wrapper .quantity-selector {
          display: inline-flex !important;
          align-items: center !important;
          background: #f9fafb !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 99px !important;
          overflow: hidden !important;
          height: 48px !important;
          min-width: 130px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }
        .tpl5-page-wrapper quantity-selector-component:focus-within,
        .tpl5-page-wrapper .quantity-selector:focus-within {
          border-color: #db2777 !important;
          box-shadow: 0 0 0 3px rgba(219,39,119,0.1) !important;
        }
        
        /* Minus / Plus buttons */
        .tpl5-page-wrapper .quantity-minus,
        .tpl5-page-wrapper .quantity-plus,
        .tpl5-page-wrapper .quantity-button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 44px !important;
          height: 44px !important;
          min-width: 44px !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          color: #374151 !important;
          transition: color 0.15s ease, background 0.15s ease !important;
          border-radius: 99px !important;
          flex-shrink: 0 !important;
          padding: 0 !important;
          position: relative !important;
        }
        .tpl5-page-wrapper .quantity-minus:hover,
        .tpl5-page-wrapper .quantity-plus:hover,
        .tpl5-page-wrapper .quantity-button:hover {
          color: #db2777 !important;
          background: #fdf2f8 !important;
        }
        .tpl5-page-wrapper .quantity-minus svg,
        .tpl5-page-wrapper .quantity-plus svg,
        .tpl5-page-wrapper .quantity-button svg {
          width: 18px !important;
          height: 18px !important;
          stroke-width: 2.5px !important;
        }
        
        /* Number input */
        .tpl5-page-wrapper input.quantity-input,
        .tpl5-page-wrapper .quantity-selector input[type="number"] {
          flex: 1 !important;
          border: none !important;
          background: transparent !important;
          text-align: center !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          color: #111827 !important;
          font-family: 'Bricolage Grotesque', sans-serif !important;
          outline: none !important;
          -moz-appearance: textfield !important;
          padding: 0 4px !important;
          width: 40px !important;
          min-width: 32px !important;
        }
        .tpl5-page-wrapper input.quantity-input::-webkit-inner-spin-button,
        .tpl5-page-wrapper input.quantity-input::-webkit-outer-spin-button {
          -webkit-appearance: none !important;
        }

        /* Fix mobile thumbnails shifting to the right and keep them compact */
        @media (max-width: 767.98px) {
          media-gallery,
          .media-gallery {
            position: relative !important;
            display: block !important; /* Changed from flex column to block to prevent flex bugs */
          }
          .media-gallery__carousel {
            position: relative !important;
            overflow: hidden !important;
            height: auto !important;
            display: block !important; /* Force block to prevent row flex squishing */
          }
          .media-gallery__carousel-container {
            display: block !important;
            position: relative !important;
          }
          .media-gallery__carousel .swiper-slide {
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .product-media.media {
            padding-bottom: 0 !important;
            aspect-ratio: 1440 / 1438 !important;
            width: 100% !important;
            display: block !important;
            overflow: hidden !important;
          }
          .product-media.media picture,
          .product-media.media img {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            aspect-ratio: 1440 / 1438 !important;
            display: block !important;
            background: #ffffff !important;
          }
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails--inside,
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails {
            display: flex !important;
            position: absolute !important;
            bottom: 16px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: max-content !important;
            max-width: 90vw !important;
            background: rgba(255, 255, 255, 0.6) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border-radius: 30px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.25) inset !important;
            padding: 6px 12px !important;
            margin: 0 !important;
            z-index: 999 !important;
            visibility: visible !important;
            opacity: 1 !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
          }
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails::-webkit-scrollbar {
            display: none !important;
          }
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .carousel__thumbnails-swiper {
            display: block !important;
            overflow: visible !important;
            width: max-content !important;
          }
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .swiper-wrapper {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: none !important;
            width: max-content !important;
          }
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .carousel__thumbnail,
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .swiper-slide {
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            border: 2px solid #ffffff !important;
            cursor: pointer !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            opacity: 0.85 !important;
            background: #ffffff !important;
            display: block !important;
            visibility: visible !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
          }
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .carousel__thumbnail img,
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .swiper-slide img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            border-radius: 50% !important;
            display: block !important;
            background: #ffffff !important;
            visibility: visible !important;
          }
          /* Highlight active slide with pink color matching template aesthetic */
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .swiper-slide-active,
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .carousel__thumbnail.is-active,
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails .carousel__thumbnail:hover {
            border-color: #db2777 !important;
            transform: scale(1.1) !important;
            opacity: 1 !important;
            box-shadow: 0 4px 12px rgba(219, 39, 119, 0.35) !important;
          }
        }

        /* Hide mobile thumbnails on desktop sizes */
        @media (min-width: 768px) {
          .tpl5-page-wrapper .media-gallery__carousel-thumbnails {
            display: none !important;
          }
        }

        /* Evitar que las imágenes se recorten en los bordes (vistas completas) - Global para PC y Móvil */
        .product__media img,
        .global-media-settings img,
        .product__media-list img,
        .media img,
        .media__image,
        .product-media img,
        .thumbnail img,
        .thumbnail-list__item img,
        img[data-media-src],
        .media-gallery__carousel img,
        .product__media-wrapper img {
          object-fit: contain !important;
          background-color: transparent !important;
        }

        /* Estilos para el Selector de Cantidad (Stock Selection) con botones + y - */
        quantity-selector-component,
        .quantity-selector {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          position: relative !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 9999px !important;
          background: #ffffff !important;
          width: 120px !important;
          height: 46px !important;
          overflow: hidden !important;
        }

        quantity-selector-component .quantity-input,
        .quantity-selector .quantity-input {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          color: #111827 !important;
          text-align: center !important;
          padding: 0 32px !important;
          margin: 0 !important;
          -moz-appearance: textfield !important;
        }

        quantity-selector-component .quantity-input::-webkit-outer-spin-button,
        quantity-selector-component .quantity-input::-webkit-inner-spin-button,
        .quantity-selector .quantity-input::-webkit-outer-spin-button,
        .quantity-selector .quantity-input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }

        /* Botones de cantidad limpios y flotantes sin cuadrado ni bordes de tema */
        quantity-selector-component button,
        .quantity-selector button,
        quantity-selector-component .quantity-button,
        .quantity-selector .quantity-button {
          position: absolute !important;
          top: 0 !important;
          height: 100% !important;
          width: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          background: transparent !important;
          color: #111827 !important;
          cursor: pointer !important;
          z-index: 10 !important;
          transition: all 0.2s ease !important;
          padding: 0 !important;
          margin: 0 !important;
          min-width: 0 !important;
          min-height: 0 !important;
          box-shadow: none !important;
          outline: none !important;
          border-radius: 0 !important;
        }

        quantity-selector-component button::before,
        quantity-selector-component button::after,
        .quantity-selector button::before,
        .quantity-selector button::after,
        quantity-selector-component .quantity-button::before,
        quantity-selector-component .quantity-button::after,
        .quantity-selector .quantity-button::before,
        .quantity-selector .quantity-button::after {
          display: none !important;
          content: none !important;
          border: none !important;
          background: transparent !important;
        }

        quantity-selector-component .quantity-minus,
        .quantity-selector .quantity-minus {
          left: 6px !important;
          right: auto !important;
        }

        quantity-selector-component .quantity-plus,
        .quantity-selector .quantity-plus {
          right: 6px !important;
          left: auto !important;
        }

        quantity-selector-component button:hover,
        .quantity-selector button:hover,
        quantity-selector-component .quantity-button:hover,
        .quantity-selector .quantity-button:hover {
          color: #db2777 !important; /* Cambia a rosa Yaxsell al pasar el cursor */
          background-color: transparent !important;
          border: none !important;
          transform: scale(1.15) !important;
        }

        quantity-selector-component .quantity-button span,
        .quantity-selector .quantity-button span {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        quantity-selector-component .quantity-button svg,
        .quantity-selector .quantity-button svg {
          width: 14px !important;
          height: 14px !important;
          stroke: currentColor !important;
          stroke-width: 2.5 !important;
          display: block !important;
          border: none !important;
          background: transparent !important;
        }

        /* Selector de cantidad: stepper circular ( - ) N ( + ), rosa pastel */
        .tpl5-page-wrapper quantity-selector-component,
        .tpl5-page-wrapper .quantity-selector {
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          width: auto !important;
          min-width: 0 !important;
          height: auto !important;
          border: none !important;
          border-radius: 0 !important;
          background: transparent !important;
          overflow: visible !important;
          box-shadow: none !important;
        }

        .tpl5-page-wrapper quantity-selector-component:focus-within,
        .tpl5-page-wrapper .quantity-selector:focus-within {
          box-shadow: none !important;
        }

        .tpl5-page-wrapper quantity-selector-component .quantity-input,
        .tpl5-page-wrapper .quantity-selector .quantity-input,
        .tpl5-page-wrapper input.quantity-input {
          display: block !important;
          flex: 0 0 auto !important;
          order: 1 !important;
          width: 26px !important;
          min-width: 26px !important;
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          outline: none !important;
          background: transparent !important;
          color: #111827 !important;
          text-align: center !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          font-family: inherit !important;
          -moz-appearance: textfield !important;
        }

        .tpl5-page-wrapper quantity-selector-component .quantity-input::-webkit-inner-spin-button,
        .tpl5-page-wrapper quantity-selector-component .quantity-input::-webkit-outer-spin-button,
        .tpl5-page-wrapper .quantity-selector .quantity-input::-webkit-inner-spin-button,
        .tpl5-page-wrapper .quantity-selector .quantity-input::-webkit-outer-spin-button {
          -webkit-appearance: auto !important;
          margin: 0 !important;
        }

        /* Botones +/- CIRCULARES, rosa pastel, con glyph limpio */
        .tpl5-page-wrapper quantity-selector-component > button,
        .tpl5-page-wrapper .quantity-selector > button,
        .tpl5-page-wrapper quantity-selector-component .quantity-button,
        .tpl5-page-wrapper .quantity-selector .quantity-button {
          position: static !important;
          inset: auto !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 30px !important;
          min-width: 30px !important;
          height: 30px !important;
          flex-shrink: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 1.5px solid #f2c6da !important;
          border-radius: 50% !important;
          background: #fdf2f8 !important;
          color: #c0547a !important;
          cursor: pointer !important;
          box-shadow: none !important;
          transition: background 0.18s ease, border-color 0.18s ease !important;
          font-size: 0 !important;
          line-height: 0 !important;
        }
        .tpl5-page-wrapper quantity-selector-component > button[name="minus"],
        .tpl5-page-wrapper .quantity-selector > button[name="minus"] { order: 0 !important; }
        .tpl5-page-wrapper quantity-selector-component > button[name="plus"],
        .tpl5-page-wrapper .quantity-selector > button[name="plus"] { order: 2 !important; }

        /* Ocultar el icono cuadrado del tema y pintar un glyph propio */
        .tpl5-page-wrapper quantity-selector-component > button svg,
        .tpl5-page-wrapper .quantity-selector > button svg,
        .tpl5-page-wrapper quantity-selector-component > button .icon,
        .tpl5-page-wrapper .quantity-selector > button .icon,
        .tpl5-page-wrapper quantity-selector-component .quantity-button svg,
        .tpl5-page-wrapper .quantity-selector .quantity-button svg {
          display: none !important;
        }
        .tpl5-page-wrapper quantity-selector-component > button::after,
        .tpl5-page-wrapper .quantity-selector > button::after {
          display: inline-block !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          line-height: 1 !important;
          color: #c0547a !important;
          transition: color 0.18s ease !important;
        }
        .tpl5-page-wrapper quantity-selector-component > button[name="minus"]::after,
        .tpl5-page-wrapper .quantity-selector > button[name="minus"]::after { content: "−" !important; }
        .tpl5-page-wrapper quantity-selector-component > button[name="plus"]::after,
        .tpl5-page-wrapper .quantity-selector > button[name="plus"]::after { content: "+" !important; }

        .tpl5-page-wrapper quantity-selector-component > button:hover,
        .tpl5-page-wrapper .quantity-selector > button:hover,
        .tpl5-page-wrapper quantity-selector-component .quantity-button:hover,
        .tpl5-page-wrapper .quantity-selector .quantity-button:hover {
          background: #f7d3e3 !important;
          border-color: #e8b4cd !important;
          box-shadow: none !important;
        }
        .tpl5-page-wrapper quantity-selector-component > button:active,
        .tpl5-page-wrapper .quantity-selector > button:active { background: #efb9d3 !important; }

        /* Botón "Añadir al carrito": ancho ajustado (no se estira a full-width) */
        .tpl5-page-wrapper add-to-cart-component,
        .tpl5-page-wrapper .add-to-cart-component {
          flex: 0 1 auto !important;
        }
        /* Añadir al carrito: ROSA suave (rosa de marca), sin neón */
        .tpl5-page-wrapper add-to-cart-component button.add-to-cart-button,
        .tpl5-page-wrapper .add-to-cart-component button.add-to-cart-button {
          width: auto !important;
          max-width: 300px !important;
          padding-left: 34px !important;
          padding-right: 34px !important;
          background: #e396bf !important;
          background-color: #e396bf !important;
          color: #ffffff !important;
          border: 1.5px solid #e396bf !important;
          box-shadow: none !important;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
        }
        .tpl5-page-wrapper add-to-cart-component button.add-to-cart-button .add-to-cart-text__content,
        .tpl5-page-wrapper add-to-cart-component button.add-to-cart-button span,
        .tpl5-page-wrapper .add-to-cart-component button.add-to-cart-button .add-to-cart-text__content,
        .tpl5-page-wrapper .add-to-cart-component button.add-to-cart-button span {
          color: #ffffff !important;
        }
        .tpl5-page-wrapper add-to-cart-component button.add-to-cart-button:hover,
        .tpl5-page-wrapper .add-to-cart-component button.add-to-cart-button:hover {
          background: #ffffff !important;
          background-color: #ffffff !important;
          border-color: #e396bf !important;
          color: #111827 !important;
        }
        .tpl5-page-wrapper add-to-cart-component button.add-to-cart-button:hover *,
        .tpl5-page-wrapper .add-to-cart-component button.add-to-cart-button:hover * {
          color: #111827 !important;
        }

        /* Override theme styles for the real add-to-cart button, matching Comprar Ahora */
        button.add-to-cart-button.btn.btn--secondary,
        add-to-cart-component > button.add-to-cart-button {
          background: #e396bf !important;
          background-color: #e396bf !important;
          color: #ffffff !important;
          border: 1.5px solid #e396bf !important;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
        }
        button.add-to-cart-button.btn.btn--secondary:hover,
        add-to-cart-component > button.add-to-cart-button:hover {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #111827 !important;
          border-color: #e396bf !important;
        }
        button.add-to-cart-button.btn.btn--secondary:hover *,
        add-to-cart-component > button.add-to-cart-button:hover * {
          color: #111827 !important;
        }

        /* Comprar Ahora: ROSA más intenso (jerarquía), sin neón (era negro).
           Selector con doble clase para ganar a button.shopify-payment-button__button--unbranded del tema */
        button.yaxsell-custom-buy-button,
        .tpl5-page-wrapper button.yaxsell-custom-buy-button,
        button.shopify-payment-button__button--unbranded.yaxsell-custom-buy-button {
          background-color: #e396bf !important;
          background: #e396bf !important;
          color: #ffffff !important;
          border: 1.5px solid #e396bf !important;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
          width: 100% !important;
          cursor: pointer !important;
          box-shadow: none !important;
        }
        /* Hover: fondo blanco + letra NEGRA (antes se ponía blanca e invisible) */
        button.yaxsell-custom-buy-button:hover,
        .tpl5-page-wrapper button.yaxsell-custom-buy-button:hover,
        button.shopify-payment-button__button--unbranded.yaxsell-custom-buy-button:hover {
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #111827 !important;
          border: 1.5px solid #e396bf !important;
        }
        button.yaxsell-custom-buy-button:hover *,
        .tpl5-page-wrapper button.yaxsell-custom-buy-button:hover * {
          color: #111827 !important;
        }

        /* Añadir al carrito: misma lógica visual que Comprar Ahora */
        button.yaxsell-custom-add-to-cart {
          background-color: #e396bf !important;
          background: #e396bf !important;
          color: #ffffff !important;
          border: 1.5px solid #e396bf !important;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
          cursor: pointer !important;
          box-shadow: none !important;
        }
        button.yaxsell-custom-add-to-cart:hover {
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #111827 !important;
          border: 1.5px solid #e396bf !important;
        }

        /* Bloquear hover gris del tema Shopify en el dialog de retiro local */
        #local-pickup-dialog,
        #local-pickup-dialog * {
          -webkit-tap-highlight-color: transparent !important;
        }
        #local-pickup-dialog .pickup-location__wrapper:hover,
        #local-pickup-dialog .pickup-location__address-wrapper:hover,
        #local-pickup-dialog .pickup-location__address:hover,
        #local-pickup-dialog span:hover,
        #local-pickup-dialog p:hover,
        #local-pickup-dialog strong:hover,
        #local-pickup-dialog div:hover {
          background: transparent !important;
          background-color: transparent !important;
          color: inherit !important;
          box-shadow: none !important;
        }
        #local-pickup-dialog .dialog__close:hover {
          background-color: #e5e7eb !important;
          color: #1f2937 !important;
        }

        /* Quitar el neon/glow rosado del botón scroll-to-top de Shopify */
        .back-to-top, .scroll-to-top, [class*="scroll-top"], [class*="back-to-top"] {
          box-shadow: none !important;
          filter: none !important;
        }
        .back-to-top svg, .scroll-to-top svg, [class*="scroll-top"] svg {
          stroke: currentColor !important;
          filter: none !important;
        }

        /* Drawer Responsivo para Local Pickup - aparece ENCIMA del navbar mobile */
        @media (max-width: 767.98px) {
          #local-pickup-dialog {
            width: 100% !important;
            height: auto !important;
            max-height: calc(100vh - 60px) !important;
            top: auto !important;
            bottom: 60px !important;
            border-radius: 20px 20px 0 0 !important;
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15) !important;
            animation: slideUp 0.3s ease-out !important;
            overflow-y: auto !important;
          }

          /* Darle espacio al pie de página en móviles para que no quede tapado por la barra de navegación fija */
          #shopify-section-sections--20816632381578__footer,
          .shopify-section-group-footer-group,
          footer,
          [class*="footer-group"] {
            padding-bottom: 90px !important;
          }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
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
<<<<<<< HEAD
          }
          .help-desk-link img {
            transform: scale(1.4) !important;
            margin-right: 12px !important;
=======
>>>>>>> d5d633e215e4f0eb3d586cbd61bd24406b75482d
          }
        }
      `}</style>
      <div
        ref={setRefElement}
        className="tpl5-shopify-root template-product"
      />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/56999149712"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating-btn"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAZfIMxTRshRuJdTJu-mi52yWPxiF3ghQsSw&s"
          alt="WhatsApp"
        />
      </a>
      
      {/* Secciones de React nativas (se inyectan justo antes del footer mediante React Portals) */}
      {product && (
        reviewsTarget ? createPortal(
          <>
            <hr style={{ border: 'none', borderTop: '1px solid #fce7f3', margin: '40px 0' }} />
            <ReviewSection productId={product.$id} rating={product.RATING ?? 0} numReviews={product.NUMREVIEWS ?? 0} />
            <hr style={{ border: 'none', borderTop: '1px solid #fce7f3', margin: '40px 0' }} />
            <ProductQuestions productId={product.$id} />
          </>,
          reviewsTarget
        ) : (
          <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
            <hr style={{ border: 'none', borderTop: '1px solid #fce7f3', margin: '40px 0' }} />
            <ReviewSection productId={product.$id} rating={product.RATING ?? 0} numReviews={product.NUMREVIEWS ?? 0} />
            <hr style={{ border: 'none', borderTop: '1px solid #fce7f3', margin: '40px 0' }} />
            <ProductQuestions productId={product.$id} />
          </div>
        )
      )}

      {/* Local Pickup Dialog */}
      {isLocalPickupOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsLocalPickupOpen(false)} 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 99999,
              transition: 'opacity 0.3s ease'
            }}
          />
          {/* Drawer Dialog Container */}
          <dialog 
            id="local-pickup-dialog" 
            className="dialog dialog--drawer dialog--local-pickup dialog--drawer-right dialog--drawer-mobile-bottom overflow-hidden color-scheme-1" 
            style={{
              display: 'block',
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '440px',
              maxWidth: '100%',
              height: '100%',
              background: '#ffffff',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.08)',
              zIndex: 100000,
              border: 'none',
              padding: 0,
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }} 
            open
          >
            <button 
              className="dialog__close dialog__close--absolute" 
              onClick={() => setIsLocalPickupOpen(false)} 
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#4b5563',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <span className="icon icon--close icon--large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ width: '16px', height: '16px', stroke: 'currentColor', strokeWidth: 2 }}>
                  <path width="256" height="256" fill="none" d="M0 0H20V20H0V0z"></path>
                  <path x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.625 4.375L4.375 15.625"></path>
                  <path x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.625 15.625L4.375 4.375"></path>
                </svg>
              </span>
            </button>
            <div className="dialog__inner v-scrollable" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div className="dialog__content" style={{ padding: '32px 24px', flexGrow: 1 }}>
                <div className="pickup-availabilities__dialog-header" style={{ marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
                  <h4 className="dialog__title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                    {product?.NAME || 'Producto'}
                  </h4>
                  <p className="color-subtext text-body-sm" style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                    Punto de Retiro Oficial
                  </p>
                </div>
                <div className="pickup-availabilities__dialog-content">
                  <div className="pickup-location__wrapper flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p className="h5" style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                      Kevin&Coco Chile
                    </p>
                    <div className="pickup-location__address-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <span className="pickup-location__availability-wrapper" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '13px', fontWeight: 600 }}>
                        <span className="icon icon--check icon--large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', color: '#166534', padding: '3px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 3 }}><path fill="none" d="M0 0h256v256H0z"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m40 144 56 56L224 72"></path></svg>
                        </span>
                        Retiro disponible (Generalmente listo en 24 horas)
                      </span>
                      <span className="pickup-location__address text-body-sm color-subtext" style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Dirección:</p>
                        <p style={{ margin: '2px 0 12px' }}>Toesca 2537, 8370287 Santiago, Región Metropolitana</p>
                        
                        <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Teléfono:</p>
                        <p style={{ margin: '2px 0 12px' }}>9 9914 9712</p>

                        <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Horarios de Atención:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '6px 12px', marginTop: '8px', fontSize: '12px', color: '#4b5563' }}>
                          <span>Lunes:</span><strong>10:00 – 19:00</strong>
                          <span>Martes:</span><strong>10:00 – 19:00</strong>
                          <span>Miércoles:</span><strong>10:00 – 19:00</strong>
                          <span>Jueves:</span><strong>10:00 – 19:00</strong>
                          <span>Viernes:</span><strong>10:00 – 19:00</strong>
                          <span>Sábado:</span><strong>10:00 – 17:00</strong>
                          <span>Domingo:</span><span style={{ color: '#ef4444', fontWeight: 600 }}>Cerrado</span>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dialog>
        </>
      )}

    </div>
  );
}
