'use client';
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PLANTILLA 8 â€” Shopify Theme Capturado por FOLLA
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   âš ï¸  BOILERPLATE: Requiere revisiÃ³n manual antes de usar.
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Estrategia (idÃ©ntica a plantilla1):
   - Render del HTML body limpio via containerRef.innerHTML
   - Carga dinÃ¡mica de CSS via <link> tags en <head>
   - Carga dinÃ¡mica de JS via <script> tags secuenciales
   - Scripts de Shopify problemÃ¡ticos excluidos
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
import { useEffect, useRef, useState } from 'react';
import { getServices, getAppwriteConfig, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Category, Subcategory } from '@/types';
import { useCategories } from '@/hooks/useCategories';

// Set window.countdown at module level â€” runs when module is first imported, before any Shopify scripts
if (typeof window !== 'undefined') {
  (window as any).countdown = {
    long: { day: 'dÃ­a', hour: 'hora', second: 'segundo', one: { day: 'dÃ­a', hour: 'hora', second: 'segundo' }, other: { day: 'dÃ­as', hour: 'horas', second: 'segundos' } },
    short: { day: 'd', hour: 'h', second: 's', one: { day: 'd', hour: 'h', second: 's' }, other: { day: 'd', hour: 'h', second: 's' } },
  };
}

const SHOPIFY_BASE = '/shopify/plantilla8/assets';

/* â”€â”€ CSS files: ORDEN CRÃTICO â€” inline primero, luego core, luego secciones â”€â”€ */
const CSS_FILES = [
  `/shopify/plantilla8/assets/css/inline/index-inline-1.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/swiper-bundle.min.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/compiled_assets/styles.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/base.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/animation.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/styles.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/utility-bar.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/announcement-bar.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/header.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/slideshow.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/block-video.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/collection-list.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/multimedia-collage.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-card.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/featured-collection.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/split-hero.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/media-columns.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-columns.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/media-with-text.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/bundle-products.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/flexible-columns.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/horizontal-testimonials.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/marquee.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/featured-product.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/article-card.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/featured-blog-posts.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/gallery.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/gallery-popup.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/faq.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/store-locator.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/editorial-banner.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/variant-popup.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/added-to-cart-popup.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/localization-popup.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/localization.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/search-drawer.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/cart-drawer.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/newsletter.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/newsletter-popup.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-compare-bottom-sheet.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-compare-popup.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/footer.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/animation.css`,
  `/shopify/plantilla8/assets/css/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/split-hero.css`
];

/* â”€â”€ JS files: solo los crÃ­ticos del tema â”€â”€ */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
  { src: `/shopify/plantilla8/assets/js/cdn/gsap.min.js` },
  { src: `/shopify/plantilla8/assets/js/cdn/ScrollTrigger.min.js` },
  { src: `/shopify/plantilla8/assets/js/cdn/ScrollMagic.min.js` },
  { src: `/shopify/plantilla8/assets/js/cdn/animation.gsap.min.js` },
  { src: `/shopify/plantilla8/assets/js/cdn/MorphSVGPlugin.min.js` },
  { src: `/shopify/plantilla8/assets/js/cdn/morph-svg.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/swiper-bundle.min.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/functions.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/pubsub.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/script.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/split-hero.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/utility-bar.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/localization.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/announcement-bar.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/header.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/menu-drawer.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/slideshow.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/block-video.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/collection-list.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/multimedia-collage.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/featured-collection.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-card.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/variant-swatch-selector.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-card-form.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-columns-block.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/media-columns.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-columns.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/bundle-products.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/horizontal-testimonials.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/marquee.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-media.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/accordion.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-badge.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/featured-blog-posts.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/gallery.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/gallery-popup.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/faq.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/variant-popup.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/countdown-timer.js?v=2` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/added-to-cart-popup.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/localization-popup.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/search-drawer.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/cart-drawer.js`, module: true },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/cart-quantity-selector.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/cart-recommended-product-form.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/newsletter-popup.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/newsletter-invalid.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/newsletter-validate.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-compare-popup.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/product-compare-bottom-sheet.js` },
  { src: `/shopify/plantilla8/assets/js/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/shop/t/5/assets/button-to-top.js` },
];

/* â”€â”€ Font faces â”€â”€ */
const FONT_FACE_CSS = `
@font-face {
  font-family: Montserrat;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_n4.81949fa0ac9fd2021e16436151e8eaa539321637.woff2") format("woff2"),
       url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_n4.a6c632ca7b62da89c3594789ba828388aac693fe.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_n7.3c434e22befd5c18a6b4afadb1e3d77c128c7939.woff2") format("woff2"),
       url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_n7.5d9fa6e2cae713c8fb539a9876489d86207fe957.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_i4.5a4ea298b4789e064f62a29aafc18d41f09ae59b.woff2") format("woff2"),
       url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_i4.072b5869c5e0ed5b9d2021e4c2af132e16681ad2.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_i7.a0d4a463df4f146567d871890ffb3c80408e7732.woff2") format("woff2"),
       url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_i7.f6ec9f2a0681acc6f8152c40921d2a4d2e1a2c78.woff") format("woff");
}
@font-face {
  font-family: "Nunito Sans";
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/nunito_sans/nunitosans_n7.25d963ed46da26098ebeab731e90d8802d989fa5.woff2") format("woff2"),
       url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/nunito_sans/nunitosans_n7.d32e3219b3d2ec82285d3027bd673efc61a996c8.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_n4.81949fa0ac9fd2021e16436151e8eaa539321637.woff2") format("woff2"),
       url("/shopify/plantilla8/assets/fonts/0wq643cy0nlo7vfe-97367883849.shopifypreview.com/cdn/fonts/montserrat/montserrat_n4.a6c632ca7b62da89c3594789ba828388aac693fe.woff") format("woff");
}
`;

export default function HomePage8() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { categories } = useCategories();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  /* â”€â”€ Mark template attribute on document for CSS scoping â”€â”€ */
  useEffect(() => {
    document.documentElement.dataset.template = '8';
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
      delete document.documentElement.dataset.template;
    };
  }, []);

  /* â”€â”€ Load font faces â”€â”€ */
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'tpl8-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* â”€â”€ Force hide page-loader & layout overrides â”€â”€ */
  useEffect(() => {
    // Use insertRule instead of textContent â€” Shopify's JS truncates style.textContent
    const sheet = document.createElement('style');
    sheet.id = 'tpl8-overrides';
    document.head.appendChild(sheet);
    const ss = sheet.sheet!;
    const rules = [
      '.page-loader { opacity: 0 !important; pointer-events: none !important; visibility: hidden !important; }',
      'page-transition { display: none !important; }',
      '[style*="blur(0"] { filter: none !important; }',
      'html[data-template="8"] .split-hero { min-height: calc(100vh - var(--header-gap, 0px)) !important; max-height: calc(100vh - var(--header-gap, 0px)) !important; }',
      'html[data-template="8"] .split-hero .split-hero-column__media { min-height: calc(100vh - var(--header-gap, 0px)) !important; max-height: calc(100vh - var(--header-gap, 0px)) !important; }',
      'html[data-template="8"] .split-hero .split-hero-column__content .split-hero-column-inner { opacity: 0 !important; transform: translate3d(55vw, 0, 0) !important; transition: opacity .65s ease, transform .9s cubic-bezier(.4,0,.2,1) !important; will-change: transform, opacity !important; }',
      'html[data-template="8"] .split-hero .split-hero-column__media.is-collapsed + .split-hero-column__content .split-hero-column-inner { opacity: 1 !important; transform: translate3d(0, 0, 0) !important; }',
      '.section-header { margin: 0 !important; padding: 0 !important; }',
      'utility-bar { position: relative !important; z-index: 504 !important; }',
      '.announcement-bar { z-index: 503 !important; position: relative !important; top: auto !important; }',
      '.header { position: absolute !important; top: auto !important; width: 100% !important; z-index: 500 !important; margin-top: 0 !important; margin-bottom: 0 !important; padding-top: 6px !important; background: transparent !important; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease !important; }',
      '.shopify-section-group-header-group { height: 0 !important; }',
      'video.object-cover { object-position: center 25% !important; }',
      '.split-hero video { object-position: center 25% !important; }',
      '.slideshow video { object-position: center 25% !important; }',
      'split-hero { margin-top: 0 !important; }',
      '.shopify-section-group-top-group { margin-top: 0 !important; padding-top: 0 !important; }',
      'main, .main { padding-top: 0 !important; margin-top: 0 !important; }',
      '#main { padding-top: 0 !important; margin-top: 0 !important; }',
      '.shopify-section { margin-top: 0 !important; padding-top: 0 !important; }',
      '.slideshow, .multimedia-collage { margin-top: 0 !important; padding-top: 0 !important; }',
      // Menu dropdown hover fix - Tailwind group-hover:visible not compiled
      '.group .menu--dropdown, .group .menu-parent-wrapper { visibility: hidden; opacity: 0; transform: translateY(8px); transition: visibility 0.25s, opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }',
      '.group:hover .menu--dropdown, .group:hover .menu-parent-wrapper { visibility: visible !important; opacity: 1 !important; transform: translateY(0) !important; pointer-events: auto !important; transition: visibility 0s, opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; }',
      // Sub-menu (tier 3) hover fix
      '.group\\/submenu .menu--dropdown { visibility: hidden; opacity: 0; transform: translateX(12px) translateY(-6px); transition: visibility 0.2s, opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }',
      '.group\\/submenu:hover .menu--dropdown { visibility: visible !important; opacity: 1 !important; transform: translateX(4px) translateY(0) !important; pointer-events: auto !important; }',
      // Global font size increase
      'html { font-size: 16px !important; }',
      'body { font-size: 1rem !important; }',
      '.header, .header a, .header span { font-size: 1.05rem !important; }',
      '.announcement-bar, .announcement-bar span { font-size: 1rem !important; }',
      '.utility-bar, .utility-bar span { font-size: 0.95rem !important; }',
    ];
    rules.forEach(r => { try { ss.insertRule(r, ss.cssRules.length); } catch(_e) {} });

    // Force CSS custom properties and inline styles on key elements
    const fixLayout = () => {
      // Fix all <main> elements (outer Next.js + inner Shopify)
      document.querySelectorAll('main').forEach(main => {
        main.style.setProperty('--utility-bar-gap', '0px', 'important');
        main.style.setProperty('--announcement-bar-gap', '0px', 'important');
        main.style.setProperty('--header-gap', '0px', 'important');
        main.style.setProperty('--visible-header-height', '0px', 'important');
        main.style.setProperty('padding-top', '0px', 'important');
      });
      // Fix wrapper divs with inline padding-top
      const wrapper = document.querySelector('.tpl8-shopify-root')?.parentElement;
      if (wrapper) {
        wrapper.style.setProperty('padding-top', '0px', 'important');
      }
    };
    fixLayout();

    // Scroll-based header show/hide with smooth animation
    let lastScrollY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const header = document.querySelector('.header');
          if (header) {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
              header.classList.add('is-hidden');
            } else {
              header.classList.remove('is-hidden');
            }
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Observe container for when Shopify HTML is injected
    const containerMo = new MutationObserver(() => {
      fixLayout();
      document.querySelectorAll('main').forEach(main => {
        mainMo.observe(main, { attributes: true, attributeFilter: ['style'] });
      });
    });
    if (containerRef.current) {
      containerMo.observe(containerRef.current, { childList: true, subtree: true });
    }

    // Re-apply after Shopify JS sets inline style on <main>
    const mainMo = new MutationObserver(fixLayout);

    return () => { sheet.remove(); containerMo.disconnect(); mainMo.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  /* â”€â”€ Load CSS files dynamically â”€â”€ */
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl8="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl8', href);
      document.head.appendChild(link);
      links.push(link);
    });
    return () => { links.forEach(l => l.remove()); };
  }, []);

  /* â”€â”€ Fetch the cleaned HTML body content and Categories â”€â”€ */
  useEffect(() => {
    let aborted = false;

    const fetchHtml = fetch('/shopify/plantilla8/body-clean.html', { cache: 'no-cache' }).then(r => r.text());
    
    const fetchCats = async () => {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const [cRes, scRes] = await Promise.all([
          databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [Query.orderDesc('$createdAt'), Query.limit(20)]),
          databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION, [Query.limit(50)])
        ]);
        return { cats: cRes.documents as unknown as Category[], subcats: scRes.documents as unknown as Subcategory[] };
      } catch (e) {
        console.error("Error fetching categories:", e);
        return { cats: [], subcats: [] };
      }
    };

    Promise.all([fetchHtml, fetchCats()])
      .then(([html, { cats, subcats }]) => {
        if (aborted) return;
        setSubcategories(subcats);

        // Parse HTML using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 1. Replace Logo YESBELLA with Image Logo Don Balato Iván
        const logoUrl = "https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/1779087644982-pegada-1779087644061.png?GoogleAccessId=imagen%40geminai-449212.iam.gserviceaccount.com&Expires=16730334000&Signature=PPeyi%2BvN0%2B62TLw7qyFMesh00OphZaWOazNAsjn90cANf5ob9tPgJu1KOv8ICB%2FwEfnyhPGFRdqyk%2FUY7ZyuNnWuQLDi9cFL3ntbzNVJkYHj0HEibiG%2FpQ7yUDelDFO8onHfWEZtrRSWbiEx%2FN9eTwvtLrSNoBbKnunkQrS98HqLEn%2BtZPaG4O8l%2Frf%2BR61G6Cd3y0k9gtTHoas2CDDR91hQQZ32eInhg6mMwUraWyKuTX%2FcbeQZnxcNWJrLAEwY0Lyyv6SalTqU4gtZB%2FP83u4Vvo%2FBagcexcn5T6H910iFP4QEiDX%2BiFK9iLZtbZh0l2%2FmT4opjJqhPCjuQKcxXg%3D%3D";
        const logoWrappers = doc.querySelectorAll('.logo-wrapper');
        logoWrappers.forEach(wrapper => {
          wrapper.setAttribute('aria-label', 'Don Balato Iván');
          const h2 = wrapper.querySelector('h2.logo');
          if (h2) {
            h2.outerHTML = `<img src="${logoUrl}" alt="Don Balato Iván" style="max-height: 48px; width: auto; object-fit: contain; margin: 0 auto;" />`;
          } else {
            wrapper.innerHTML = `<img src="${logoUrl}" alt="Don Balato Iván" style="max-height: 48px; width: auto; object-fit: contain; margin: 0 auto;" />`;
          }
        });

        // 2. Replace Hero Video
        const newVideoUrl = "https://firebasestorage.googleapis.com/v0/b/geminai-449212.firebasestorage.app/o/KEVINCOCO%2Faabc15baa4984915ad6486ee139b15ce.HD-1080p-7.2Mbps-83967798.realesrgan.mp4?alt=media&token=eaf1fa12-c35e-4324-82ce-0282de7c0c45";
        const sources = doc.querySelectorAll('video source');
        sources.forEach(source => {
          if (source.getAttribute('type') === 'video/mp4') {
            source.setAttribute('src', newVideoUrl);
          }
        });
        const videos = doc.querySelectorAll('video');
        videos.forEach(video => {
          if (video.getAttribute('src')) {
            video.setAttribute('src', newVideoUrl);
          }
        });

        // 3. Translate Search and Cart to Spanish (Buscar / Carrito)
        const searchLinks = doc.querySelectorAll('a[data-object="search"]');
        searchLinks.forEach(link => {
          link.setAttribute('aria-label', 'Buscar');
          for (const child of Array.from(link.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim().toUpperCase() === 'SEARCH') {
              child.textContent = child.textContent.replace('Search', 'Buscar');
            }
          }
        });

        const cartLinks = doc.querySelectorAll('a[data-object="cart"]');
        cartLinks.forEach(link => {
          link.setAttribute('aria-label', 'Carrito');
          for (const child of Array.from(link.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim().toUpperCase() === 'CART') {
              child.textContent = child.textContent.replace('Cart', 'Carrito');
            }
          }
        });

        // 4. Build and Inject Desktop and Mobile Navigation Menus
        // Sort categories by subcategory count and pick top 6 to prevent visual wrapping
        const sortedCats = [...cats].map(cat => ({
          ...cat,
          subCount: subcats.filter(sc => sc.categoryId === cat.$id).length
        })).sort((a, b) => b.subCount - a.subCount).slice(0, 6);

        // Desktop Menu Structure
        let desktopMenuHtml = `
            <li class="inline-block group py-2 px-1 relative shrink-0 no-keyboard-focus">
                <a href="/" title="Inicio" aria-label="Inicio" data-action="static-link" class="no-keyboard-focus" data-menu-tier="1">
                    <span class="link-hover-animation">Inicio</span>
                </a>
            </li>
        `;

        // Mobile Drawer Menu Structure
        let mobileMenuHtml = `
            <li class="group relative before:content-[''] before:block before:absolute before:top-0 before:left-0 before:transition-all before:duration-500 before:ease-in-out before:h-full before:w-0 before:bg-black before:opacity-1">
                <a href="/" aria-label="Inicio" title="Inicio" class="w-full flex p-7 justify-between cursor-pointer z-10 relative">
                    <span class="after:content-[''] relative after:absolute after:top-full after:left-0 after:w-0 after:block after:h-0.5 after:bg-current after:transition-all after:duration-300 after:ease-in-out px-3">Inicio</span>
                </a>
            </li>
        `;

        sortedCats.forEach(cat => {
          const name = cat.name || 'CategorÃ­a';
          const link = `/productos?categoria=${encodeURIComponent(name)}`;
          const catSubs = subcats.filter(sc => sc.categoryId === cat.$id);

          if (catSubs.length > 0) {
            // Category with Dropdown
            let dropdownHtml = `
              <ul class="menu menu--dropdown menu-parent-wrapper px-5 py-3 z-10 absolute invisible opacity-0 top-full left-0 translate-y-6 text-left min-w-[180px] w-max group-hover:translate-y-0 group-hover:visible group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 duration-300 ease-in-out transition-all" data-tier="2" role="list">
            `;
            catSubs.forEach(sub => {
              const subName = sub.name || 'SubcategorÃ­a';
              const subLink = `/productos?categoria=${encodeURIComponent(name)}&subcategoria=${encodeURIComponent(subName)}`;
              dropdownHtml += `
                <li class="py-2">
                    <a href="${subLink}" title="${subName}" aria-label="${subName}" class="w-full block">
                        <span class="link-hover-animation">${subName}</span>
                    </a>
                </li>
              `;
            });
            dropdownHtml += `</ul>`;

            desktopMenuHtml += `
              <li class="inline-block group py-2 px-1 relative shrink-0 no-keyboard-focus">
                  <a href="${link}" title="${name}" aria-label="${name}" data-action="hover-dropdown" class="flex items-center no-keyboard-focus" data-menu-tier="1">
                      <span class="link-hover-animation">${name}</span>
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] ml-1">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                  </a>
                  ${dropdownHtml}
              </li>
            `;
          } else {
            // Category without Dropdown
            desktopMenuHtml += `
              <li class="inline-block group py-2 px-1 relative shrink-0 no-keyboard-focus">
                  <a href="${link}" title="${name}" aria-label="${name}" data-action="static-link" class="no-keyboard-focus" data-menu-tier="1">
                      <span class="link-hover-animation">${name}</span>
                  </a>
              </li>
            `;
          }

          // Mobile Drawer Link
          mobileMenuHtml += `
            <li class="group relative before:content-[''] before:block before:absolute before:top-0 before:left-0 before:transition-all before:duration-500 before:ease-in-out before:h-full before:w-0 before:bg-black before:opacity-1">
                <a href="${link}" aria-label="${name}" title="${name}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative">
                    <span class="after:content-[''] relative after:absolute after:top-full after:left-0 after:w-0 after:block after:h-0.5 after:bg-current after:transition-all after:duration-300 after:ease-in-out px-3">${name}</span>
                </a>
            </li>
          `;
        });

        // Query the elements directly from DOM and set their innerHTML cleanly!
        const desktopMenu = doc.querySelector('ul.menu[data-tier="1"]:not(.menu--drawer)');
        if (desktopMenu) {
          desktopMenu.innerHTML = desktopMenuHtml;
        }

        const mobileMenu = doc.querySelector('ul.menu--drawer[data-tier="1"]');
        if (mobileMenu) {
          mobileMenu.innerHTML = mobileMenuHtml;
        }

        setBodyHtml(doc.documentElement.innerHTML);
      })
      .catch(err => {
        if (aborted) return;
        console.error('[Plantilla8] Error loading body-clean.html', err);
        setLoadError(err.message || 'Error de carga');
      });
    return () => { aborted = true; };
  }, []);

  /* â”€â”€ Set innerHTML ONCE via ref â”€â”€ */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    if (containerRef.current.dataset.htmlSet) return;
    containerRef.current.innerHTML = bodyHtml;
    containerRef.current.dataset.htmlSet = '1';

    // Remove page-loader style and element from injected HTML
    containerRef.current.querySelectorAll('style').forEach(s => {
      if (s.textContent.includes('.page-loader')) s.remove();
    });
    containerRef.current.querySelectorAll('.page-loader').forEach(el => el.remove());

    // Remove page-transition overlay that blocks content
    document.querySelectorAll('page-transition').forEach(el => el.remove());
    document.querySelectorAll('.page-loader').forEach(el => el.remove());

    // Remove filter:blur(0px) from ancestor divs - it breaks position:fixed
    // (CSS filter on a parent creates a new containing block, making fixed = absolute)
    document.querySelectorAll('[style*="filter"]').forEach(el => {
      const s = (el as HTMLElement).style;
      if (s.filter && s.filter.includes('blur(0')) {
        s.removeProperty('filter');
      }
    });

    // Remove blocked scripts that may have been auto-loaded by custom elements
    const blocked = ['product-info.js', 'store-locator.js'];
    document.querySelectorAll('script[src]').forEach(s => {
      if (blocked.some(b => (s as HTMLScriptElement).src.includes(b))) s.remove();
    });

    // Replace remote mask SVG URLs with local paths (CORS fix)
    const maskMap: Record<string, string> = {
      'mask-sunburst.svg': '/shopify/plantilla8/assets/js/cdn/mask-sunburst.svg',
      'mask-heart.svg': '/shopify/plantilla8/assets/js/cdn/mask-heart.svg',
      'mask-scoop-right.svg': '/shopify/plantilla8/assets/js/cdn/mask-scoop-right.svg',
    };
    containerRef.current.querySelectorAll('[data-mask-url]').forEach(el => {
      const url = el.getAttribute('data-mask-url') || '';
      for (const [name, local] of Object.entries(maskMap)) {
        if (url.includes(name)) {
          el.setAttribute('data-mask-url', local);
          break;
        }
      }
    });

    // Remove leftover Shopify elements
    containerRef.current.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());

    // Fix countdown-timer elements that failed because window.countdown was undefined at creation
    containerRef.current.querySelectorAll('countdown-timer').forEach((el) => {
      const ct = el as any;
      if (!ct.time && (window as any).countdown) {
        ct.timerDateInput = ct.dataset.date;
        if (/^\d{4}\/\d{2}\/\d{2}$/.test(ct.timerDateInput)) {
          ct.targetDate = new Date(ct.timerDateInput);
          ct.format = ct.dataset.format;
          ct.time = ct.format === 'short' ? (window as any).countdown.short : (window as any).countdown.long;
          if (ct.countdownInterval) clearInterval(ct.countdownInterval);
          ct.countdownInterval = setInterval(() => {
            const diff = (ct.targetDate as number) - Date.now();
            if (diff <= 0) { clearInterval(ct.countdownInterval); return; }
            const d = Math.floor(diff / 864e5);
            const h = Math.floor(diff % 864e5 / 36e5);
            const m = Math.floor(diff % 36e5 / 6e4);
            const s = Math.floor(diff % 6e4 / 1e3);
            const wD = ct.format === 'short' ? ct.time.day : d > 1 ? ct.time.other.day : ct.time.one.day;
            const wH = ct.format === 'short' ? ct.time.hour : d > 1 ? ct.time.other.hour : ct.time.one.hour;
            const wM = ct.format === 'short' ? ct.time.hour : d > 1 ? ct.time.other.hour : ct.time.one.hour;
            const wS = ct.format === 'short' ? ct.time.second : d > 1 ? ct.time.other.second : ct.time.one.second;
            ct.innerHTML = `<span><strong>${d}</strong><span>${wD}</span></span> <span><strong>${String(h).padStart(2,'0')}</strong><span>${wH}</span></span> <span><strong>${String(m).padStart(2,'0')}</strong><span>${wM}</span></span> <span><strong>${String(s).padStart(2,'0')}</strong><span>${wS}</span></span>`;
          }, 1000);
        }
      }
    });

    // (removed scrollTo(0,0) â€” it fights with ScrollMagic pin positioning)

    // IntersectionObserver to add .in-view to .animation-element elements
    // (original theme uses .animation-wrapper but split-hero has them directly)
    // Also inject CSS override so animations work without .animation-wrapper parent
    const animStyle = document.createElement('style');
    animStyle.textContent = `
      .animation-element.fade-in { opacity: 0; }
      .animation-element.fade-in.in-view { animation: fade-in .3s ease-in-out forwards; }
      .animation-element.slide-up { opacity: 0; transform: translateY(100%); }
      .animation-element.slide-up.in-view { animation: slide-up .3s ease-in-out forwards; }
      .animation-element.slide-right { opacity: 0; transform: translate(-1rem); }
      .animation-element.slide-right.in-view { animation: slide-right .3s ease-in-out forwards; }
    `;
    document.head.appendChild(animStyle);
    const animObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          animObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1 });
    containerRef.current.querySelectorAll('.animation-element').forEach(el => animObserver.observe(el));
  }, [bodyHtml]);

  /* â”€â”€ Inject window.Shopify stub + block problematic scripts â”€â”€ */
  useEffect(() => {
    (window as any).shopUrl = 'https://0wq643cy0nlo7vfe-97367883849.shopifypreview.com';
    (window as any).routes = {
      cart_add_url: '/cart/add',
      cart_change_url: '/cart/change',
      cart_update_url: '/cart/update',
      cart_url: '/cart',
      predictive_search_url: '/search/suggest',
      search_url: '/productos'
    };
    (window as any).currentPage = {
      template: 'index',
      current_url: '',
    };
    (window as any).accessibilityStrings = {
      recipient_form_expanded: `Gift card recipient form expanded`,
      recipient_form_collapsed: `Gift card recipient form collapsed`,
    };
    (window as any).cart = {
      sold_out: `Sold out`,
      add_to_cart: `Add to cart`,
      unavailable: `Unavailable`,
      badge: {
        sold_out: `Sold out`,
        sale: `Sale`
      }
    };
    (window as any).moneyFormat = "${{amount_no_decimals}}";
    (window as any).moneyFormatWithCurrency = "${{amount_no_decimals}} CLP";
    if (!(window as any).Shopify) {
      (window as any).Shopify = {
        shop: '0wq643cy0nlo7vfe-97367883849.myshopify.com',
        country: 'US',
        currency: 'USD',
        locale: 'es',
        theme: { name: 'Captured Theme', id: '5' },
        routes: { root_url: '/', cart_url: '/cart', search_url: '/productos' },
        customerAccountsEnabled: false,
      };
    }
    // Intercept fetch to redirect remote mask SVG URLs to local (CORS fix)
    const maskRedirects: Record<string, string> = {
      'mask-sunburst.svg': '/shopify/plantilla8/assets/js/cdn/mask-sunburst.svg',
      'mask-heart.svg': '/shopify/plantilla8/assets/js/cdn/mask-heart.svg',
      'mask-scoop-right.svg': '/shopify/plantilla8/assets/js/cdn/mask-scoop-right.svg',
    };
    const origFetch = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
      for (const [name, local] of Object.entries(maskRedirects)) {
        if (url.includes(name)) {
          return origFetch(local, init);
        }
      }
      return origFetch(input, init);
    };

    // Provide locale object that countdown-timer.js expects
    if (!(window as any).Shopify.locale) {
      (window as any).Shopify.locale = {
        long: { days: [], months: [], other: '' },
        short: { days: [], months: [], other: '' },
      };
    }
    // Block problematic scripts from loading even when dynamically injected
    // Also remove filter:blur(0px) that breaks position:fixed for ScrollMagic pin
    const blocked = ['product-info.js', 'store-locator.js'];
    const origCreate = document.createElement.bind(document);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (node instanceof HTMLScriptElement) {
            const src = node.src || '';
            if (blocked.some(b => src.includes(b))) {
              node.remove();
            }
          }
          // Remove filter:blur(0px) from any element that gets it added dynamically
          if (node instanceof HTMLElement && node.style?.filter?.includes('blur(0')) {
            node.style.removeProperty('filter');
          }
        }
        // Also check attribute changes (style modifications)
        if (m.type === 'attributes' && m.attributeName === 'style') {
          const el = m.target as HTMLElement;
          if (el.style?.filter?.includes('blur(0')) {
            el.style.removeProperty('filter');
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  /* â”€â”€ Load JS scripts sequentially after HTML is rendered â”€â”€ */
  useEffect(() => {
    if (!bodyHtml) return;
    if ((window as any).__tpl8ScriptsLoaded) return;
    (window as any).__tpl8ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl8="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl8', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla8] Failed to load:', file.src); done(); };
      document.body.appendChild(s);
    });

    (async () => {
      for (const f of JS_FILES) {
        await loadOne(f);
      }
      // Remove page-loader again (scripts may recreate it) and reset scroll
      document.querySelectorAll('.page-loader').forEach(el => el.remove());
      // Remove filter:blur(0px) again (scripts may recreate it - breaks position:fixed)
      document.querySelectorAll('[style*="filter"]').forEach(el => {
        const s = (el as HTMLElement).style;
        if (s.filter && s.filter.includes('blur(0')) s.removeProperty('filter');
      });
      // (removed setTimeout scrollTo(0,0) â€” breaks ScrollMagic pin spacer calculation)
    })();

    return () => { (window as any).__tpl8ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* â”€â”€ Loading/error states â”€â”€ */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla8/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888' }}>
        Cargando plantilla 8...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="tpl8-shopify-root template-index"
    />
  );
}

