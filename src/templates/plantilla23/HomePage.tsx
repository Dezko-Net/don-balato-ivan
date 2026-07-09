'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 23 — Shopify Theme Capturado por FOLLA v2
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
import { createPortal } from 'react-dom';
import LatestProductsCarousel from '@/components/LatestProductsCarousel';
import WholesaleOffersSection from '@/components/WholesaleOffersSection';
import { getServices, getAppwriteConfig, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION, PRODUCTS_COLLECTION, TIMED_OFFERS_COLLECTION, Query, formatPrice } from '@/lib/appwrite';
import { Category, Subcategory, Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { isEditorMockEnabled } from '@/lib/editor-mock';
import { getTpl23MockData } from './mockData';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { resolveStorageImageUrl, getProductImageUrl } from '@/lib/product-images';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import { getSkuFromFeatures } from '@/lib/product-features';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useKeniaStatus } from '@/hooks/useKeniaStatus';
import { getSectionConfigAsync, type SectionConfig } from '@/lib/section-config';

const SHOPIFY_BASE = '/shopify/plantilla23/assets';

/* ── CSS files: pre-bundled into a single file to avoid 45 network requests and layout thrashes ── */
const CSS_FILES = [
  `/shopify/plantilla23/assets/css/bundle-all.css`
];

/* ── JS files: solo los críticos del tema ── */
type JsFile = { src: string; module?: boolean };
const JS_FILES: JsFile[] = [
    { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/swiper-bundle.min.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/functions.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/pubsub.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/script.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/utility-bar.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/localization.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/announcement-bar.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/header.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/menu-drawer.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/slideshow.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/block-video.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/collection-list.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/multimedia-collage.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/featured-collection.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-card.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/variant-swatch-selector.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-card-form.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-badge.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-columns-block.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/media-columns.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-columns.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/bundle-products.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/variant-selector.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/horizontal-testimonials.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/marquee.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-media.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/accordion.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/featured-blog-posts.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/gallery.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/gallery-popup.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/faq.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/variant-popup.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/added-to-cart-popup.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/localization-popup.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/search-drawer.js` },
  // cart-drawer.js removed — native script calls Shopify fetch() which crashes; React handles drawer instead
  // cart-quantity-selector.js removed — React handles qty updates
  // cart-recommended-product-form.js removed — React hydrates recommendations
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/newsletter-popup.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/newsletter-invalid.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/newsletter-validate.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-compare-popup.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/product-compare-bottom-sheet.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/button-to-top.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/gsap.min.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/ScrollMagic.min.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/animation.gsap.min.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/MorphSVGPlugin.min.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/morph-svg.js` },
  { src: `/shopify/plantilla23/assets/js/k-me-store-2.myshopify.com/cdn/shop/t/7/assets/split-hero.js` }
];

/* ── Font faces ── */
const FONT_FACE_CSS = `
@font-face {
  font-family: Montserrat;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_n4.81949fa0ac9fd2021e16436151e8eaa539321637.woff2") format("woff2"),
       url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_n4.a6c632ca7b62da89c3594789ba828388aac693fe.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_n7.3c434e22befd5c18a6b4afadb1e3d77c128c7939.woff2") format("woff2"),
       url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_n7.5d9fa6e2cae713c8fb539a9876489d86207fe957.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_i4.5a4ea298b4789e064f62a29aafc18d41f09ae59b.woff2") format("woff2"),
       url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_i4.072b5869c5e0ed5b9d2021e4c2af132e16681ad2.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  src: url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_i7.a0d4a463df4f146567d871890ffb3c80408e7732.woff2") format("woff2"),
       url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_i7.f6ec9f2a0681acc6f8152c40921d2a4d2e1a2c78.woff") format("woff");
}
@font-face {
  font-family: "Nunito Sans";
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/nunito_sans/nunitosans_n7.25d963ed46da26098ebeab731e90d8802d989fa5.woff2") format("woff2"),
       url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/nunito_sans/nunitosans_n7.d32e3219b3d2ec82285d3027bd673efc61a996c8.woff") format("woff");
}
@font-face {
  font-family: Montserrat;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_n4.81949fa0ac9fd2021e16436151e8eaa539321637.woff2") format("woff2"),
       url("/shopify/plantilla23/assets/fonts/k-me-store-2.myshopify.com/cdn/fonts/montserrat/montserrat_n4.a6c632ca7b62da89c3594789ba828388aac693fe.woff") format("woff");
}
`;

const BUNDLE_PACK_PRODUCTS: (Product & { quantity?: number; bundleUnitPrice?: number })[] = [
  {
    $id: '6a2b4ef50018fb3a8c64',
    NAME: 'Base De Maquillaje Raspberry Tart Party',
    DESCRIPTION: 'Base De Maquillaje Raspberry Tart Party',
    PRICE: 2800,
    STOCK: 30,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/db022e6a4a8df69271f73f86efae795e.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1307',
    bundleUnitPrice: 1770
  },
  {
    $id: '6a1a4da2000dd909a12a',
    NAME: 'ILUMINADORES',
    DESCRIPTION: 'ILUMINADORES',
    PRICE: 1450,
    STOCK: 99999,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/4164f83c116f25162a627a5e464a9e41.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1277',
    bundleUnitPrice: 916
  },
  {
    $id: '6a287c100036e5592ea7',
    NAME: 'POLVO SUELTO BIG KIDS',
    DESCRIPTION: 'POLVO SUELTO BIG KIDS',
    PRICE: 2200,
    STOCK: 99999,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/a73f3086e5d3fdf141c9291048fb5baf.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1439',
    bundleUnitPrice: 1390
  },
  {
    $id: '6a1a4da50015b9ebbd58',
    NAME: 'PALETA DE 4 RUBORES',
    DESCRIPTION: 'PALETA DE 4 RUBORES',
    PRICE: 3000,
    STOCK: 99999,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/83dc0de25ec30d42e5e65eb5fb97da88.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1328',
    bundleUnitPrice: 1896
  },
  {
    $id: '6a1a4da70009d16509de',
    NAME: 'CORRECTOR DE OJERAS CLEAR SKIN',
    DESCRIPTION: 'CORRECTOR DE OJERAS CLEAR SKIN',
    PRICE: 1600,
    STOCK: 99999,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/7002e6ad9dcf769cabb007487e530180.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1403',
    bundleUnitPrice: 1011
  },
  {
    $id: '6a23384e0005993581fe',
    NAME: 'Paleta de Sombras Serie Ghost Music de 18 Colores',
    DESCRIPTION: 'Paleta de Sombras Serie Ghost Music de 18 Colores',
    PRICE: 4350,
    STOCK: 99999,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/106ca38b2ef108b81c3a17d263f1f0db.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1817',
    bundleUnitPrice: 2749
  },
  {
    $id: '6a3c6094003ceef0b1ec',
    NAME: 'Toallitas Desmaquillantes',
    DESCRIPTION: 'Toallitas Desmaquillantes',
    PRICE: 950,
    STOCK: 14,
    IMAGEURL: 'https://yesbella.qianji.us./be/statics/resources/17c9eb3a00e9748b0a1d0c6da54a3244.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1048',
    bundleUnitPrice: 600
  },
  {
    $id: '6a3c615e000b35db0f3b',
    NAME: 'BROCHA',
    DESCRIPTION: 'BROCHA',
    PRICE: 1150,
    STOCK: 30,
    IMAGEURL: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1783012128460-pegada-1783012124985.png',
    CATEGORYID: '',
    SELLERID: '',
    SKU: '1028',
    bundleUnitPrice: 726
  },
  {
    $id: '6a1a4db00004abd0d67d',
    NAME: 'BRILLOS LABIAL DE 6 COLORES + DELINEADOR DE LABIOS',
    DESCRIPTION: 'BRILLOS LABIAL DE 6 COLORES + DELINEADOR DE LABIOS',
    PRICE: 1000,
    STOCK: 99999,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/e4564128a8b9eef6cfda26b852e07653.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'L1516',
    quantity: 3,
    bundleUnitPrice: 632
  },
  {
    $id: '6a46afc90033cd090a8e',
    NAME: 'BRILLOS LABIALES LOVE COLOR WHISPER',
    DESCRIPTION: 'BRILLOS LABIALES LOVE COLOR WHISPER',
    PRICE: 1200,
    STOCK: 99999,
    IMAGEURL: 'https://yesbella1.tooerp3.com/be/statics/resources/33cd0e942a382b1eb4bb88eb6eb499e5.jpg',
    CATEGORYID: '',
    SELLERID: '',
    SKU: 'KC1241',
    quantity: 4,
    bundleUnitPrice: 759
  }
];

export default function HomePage23() {
  // ═══ CONFIGURACIÓN MANUAL DEL HERO BANNER (EDITAR AQUÍ DIRECTAMENTE) ═══
  // Si deseas cambiar las imágenes o textos de los banners, edítalos aquí:
  const MANUAL_HERO_CONFIG = {
    hero1: {
      // Reemplaza estas URLs de imagen si quieres cambiar el banner de entrada (Hero 1).
      // Si las dejas vacías (''), se usará el video original de la plantilla.
      desktopImg: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/1783586640034-pegada-1783586638070.png',
      mobileImg: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/1783586630110-pegada-1783586626835.png',
      title: 'Poderosamente Bella',
      btnText: 'Tienda',
      btnLink: '/productos',
    },
    hero2: {
      // Reemplaza estas URLs si quieres cambiar la imagen de Kenia (Hero 2).
      desktopImg: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/1783576611119-pegada-1783576608583.png',
      mobileImg: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/1783576469419-pegada-1783576466867.png',
    },
    hero3: {
      // Reemplaza estas URLs si quieres cambiar la imagen del tercer banner (Hero 3).
      desktopImg: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1781734075685-pegada-1781734073035.png?GoogleAccessId=firebase-adminsdk-fbsvc%40asistoraerp.iam.gserviceaccount.com&Expires=16730334000&Signature=pB3phWWaO5gjCrm5MDeTa4B9yJRxBCfQZZl0hKH8AgvxRAt%2FyIFq1WO3HgT37USBj6GGa9rdB%2Fpq1JSHcoqESCJJdGfG0fY1Nk3UAaHcGWz52EWY1IyW5KUdVmJaAV%2FM2NQTyc4hKr4iwdzibIXrTufp1DiF6HXBkHBRmj1XlsRgBHBgcHnEK7DhNpfuqAjBECpBzIOd0UDKeFbQIaZ2g1JkiWTlUESTS2KnC%2B8A%2FRFbhNy0Q0DvKFkrALylkbR8S39QD%2FFCwuwSA5Qiqyvnuko5FB6MfQuQVmIl51cE%2BveXDd1F2yU6WlaRZCJ4%2BWrR%2FR0phLnbS1GK6PICYm%2BK7Q%3D%3D',
      mobileImg: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1781734384924-pegada-1781734383088.png?GoogleAccessId=firebase-adminsdk-fbsvc%40asistoraerp.iam.gserviceaccount.com&Expires=16730334000&Signature=vgk%2BhBwoekrfTywuMo4ksekSlWku11fqOigNF3acuZBd4QnkvzpEO%2FtYtJvd1R0dMspS7HsDmjJK6Ph8Tz78L7dUh2IBCDz0yupBP3TtQdDURnXpuzhSGdGzjoCmExz%2BDeMvp8625Vj0LQmZDEMx2Oy0h8j59p%2FCcEr1e3y7RIFueedOKuo8rQxSw%2BDkLaQBd9f1I8t%2FlpmaWjVXl6qPmcX8rMvPtO%2Fk6Saupukz1iWy1byR3Q66SayYKr2ofcBnE3zPpzJ3CgOrexAq1h4%2FQjBjZjbiw%2Fbfbq8LSR9gWj8WkAbDOem%2FgGGXQKBRlYJN77IMX9d0Syu9q4jOZRKt1g%3D%3D',
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user } = useAuth();
  const { unlimitedStock } = useStoreSettings();
  const router = useRouter();
  const { addItem, items: cartItems, subtotal: cartTotal, updateQuantity, removeItem, getEffectivePrice } = useCart();
  const { settings: apertura } = useAperturaPromotion();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cheapestProducts, setCheapestProducts] = useState<Product[]>([]);
  const [destacadoTemporal, setDestacadoTemporal] = useState<any>(null);
  const [packTimer, setPackTimer] = useState<any>(null);
  const [timedOffers, setTimedOffers] = useState<any[]>([]);
  const [isAppwriteLoaded, setIsAppwriteLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [htmlInjected, setHtmlInjected] = useState(false);
  const [latestProductsContainer, setLatestProductsContainer] = useState<Element | null>(null);
  const [wholesaleOffersContainer, setWholesaleOffersContainer] = useState<Element | null>(null);
  const [offersCarouselContainer, setOffersCarouselContainer] = useState<Element | null>(null);
  const [offersProducts, setOffersProducts] = useState<Product[]>([]);
  const { isEnabled: keniaEnabled } = useKeniaStatus();
  const [themeSections, setThemeSections] = useState<SectionConfig[]>([]);
  const [isThemeConfigLoaded, setIsThemeConfigLoaded] = useState(false);

  useEffect(() => {
    getSectionConfigAsync()
      .then((cfg) => {
        setThemeSections(cfg);
        setIsThemeConfigLoaded(true);
      })
      .catch(() => {
        setIsThemeConfigLoaded(true);
      });
  }, []);

  useEffect(() => {
    // Override/disable FocusTrap to prevent screen lock bugs when opening/closing drawers
    try {
      const globalObj = window as any;
      const disableTrap = (obj: any) => {
        if (obj && typeof obj === 'object') {
          obj.activate = () => {};
          obj.deactivate = () => {};
        }
      };

      if (globalObj.FocusTrap) {
        disableTrap(globalObj.FocusTrap);
      }

      // Check periodically for 10 seconds to catch it if loaded asynchronously
      const interval = setInterval(() => {
        try {
          if (globalObj.FocusTrap) {
            disableTrap(globalObj.FocusTrap);
          }
          // @ts-ignore
          if (typeof FocusTrap !== 'undefined') {
            // @ts-ignore
            disableTrap(FocusTrap);
          }
        } catch {}
      }, 100);
      setTimeout(() => clearInterval(interval), 10000);
    } catch (e) {
      console.log('FocusTrap bypass error:', e);
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // React countdown timer, Lottie, and Particles for the global timer pack
  // DISABLED: countdown timer removed per user request
  useEffect(() => {
    if (!bodyHtml) return;
    const root = containerRef.current;
    if (!root) return;
    const countdownEl = root.querySelector('[id*="countdown_timer"]');
    if (countdownEl) {
      (countdownEl as HTMLElement).style.display = 'none';
    }

    // 2. Lottie Initialization
    let lottieAnim: any = null;
    const lottieContainer = root.querySelector('#yaxsell-lottie-hourglass');
    if (lottieContainer) {
      import('lottie-web').then((lottieModule) => {
        lottieAnim = lottieModule.default.loadAnimation({
          container: lottieContainer as HTMLElement,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/lottie/offert.json'
        });
      }).catch((err) => {
        console.error('Error loading lottie-web:', err);
      });
    }

    // 3. Particle Canvas Setup
    const canvas = root.querySelector('#yaxsell-timer-particles') as HTMLCanvasElement;
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;
    let onMouseMove: any = null;
    let onMouseLeave: any = null;
    let parentSection = canvas?.parentElement;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let width = (canvas.width = canvas.offsetWidth || canvas.clientWidth || 300);
        let height = (canvas.height = canvas.offsetHeight || canvas.clientHeight || 150);

        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            width = canvas.width = entry.contentRect.width;
            height = canvas.height = entry.contentRect.height;
          }
        });
        resizeObserver.observe(parentSection || canvas);

        class Particle {
          x: number = 0;
          y: number = 0;
          size: number = 0;
          baseSize: number = 0;
          speedY: number = 0;
          speedX: number = 0;
          opacity: number = 0;
          wobble: number = 0;
          wobbleSpeed: number = 0;
          sparkleSpeed: number = 0;

          constructor() {
            this.reset(true);
          }

          reset(initY = false) {
            this.x = Math.random() * width;
            this.y = initY ? Math.random() * height : height + 10;
            this.baseSize = Math.random() * 2.5 + 0.5;
            this.size = this.baseSize;
            this.speedY = -(Math.random() * 0.8 + 0.2);
            this.speedX = Math.random() * 0.2 - 0.1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            this.sparkleSpeed = Math.random() * 0.05 + 0.01;
          }

          update(mX: number, mY: number) {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.25;

            this.opacity = Math.max(0.1, Math.min(0.9, this.opacity + Math.sin(Date.now() * this.sparkleSpeed * 0.1) * 0.02));

            const dx = this.x - mX;
            const dy = this.y - mY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              const force = (100 - dist) / 100;
              const angle = Math.atan2(dy, dx);
              this.x += Math.cos(angle) * force * 2;
              this.y += Math.sin(angle) * force * 2;
            }

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
              this.reset(false);
            }
          }

          draw(c: CanvasRenderingContext2D) {
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            c.shadowBlur = this.baseSize > 1.5 ? 8 : 0;
            c.shadowColor = '#ffffff';
            c.fill();
          }
        }

        const particles: Particle[] = Array.from({ length: 70 }, () => new Particle());

        let mouseX = -9999;
        let mouseY = -9999;

        onMouseMove = (e: MouseEvent) => {
          if (!parentSection) return;
          const rect = parentSection.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;
        };
        onMouseLeave = () => {
          mouseX = -9999;
          mouseY = -9999;
        };

        if (parentSection) {
          parentSection.addEventListener('mousemove', onMouseMove);
          parentSection.addEventListener('mouseleave', onMouseLeave);
        }

        const animate = () => {
          ctx.clearRect(0, 0, width, height);
          ctx.shadowBlur = 0;
          particles.forEach((p) => {
            p.update(mouseX, mouseY);
            p.draw(ctx);
          });
          animationFrameId = requestAnimationFrame(animate);
        };
        animate();
      }
    }

    return () => {
      if (lottieAnim) {
        lottieAnim.destroy();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (parentSection && onMouseMove && onMouseLeave) {
        parentSection.removeEventListener('mousemove', onMouseMove);
        parentSection.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [bodyHtml]);

  /* 🪄🤖 Tabbed FAQ JS Logic 🤖🪄 */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    const root = containerRef.current;
    
    const handleFAQClicks = (e: any) => {
        const target = e.target;
        
        // Tab switching logic
        const tabBtn = target.closest('.kc-tab-btn');
        if (tabBtn) {
            const targetId = tabBtn.getAttribute('data-target');
            root.querySelectorAll('.kc-tab-btn').forEach((btn: any) => btn.classList.remove('active'));
            tabBtn.classList.add('active');
            
            root.querySelectorAll('.kc-faq-pane').forEach((pane: any) => pane.classList.remove('active'));
            const targetPane = document.getElementById(targetId || '');
            if (targetPane) targetPane.classList.add('active');
            return;
        }
        
        // Accordion logic
        const accordionBtn = target.closest('.kc-accordion-btn');
        if (accordionBtn) {
            const parent = accordionBtn.parentElement;
            const contentPane = accordionBtn.nextElementSibling;
            const isActive = parent.classList.contains('active');
            
            const currentPane = parent.closest('.kc-faq-pane');
            if (currentPane) {
                currentPane.querySelectorAll('.kc-accordion-item').forEach((item: any) => {
                    item.classList.remove('active');
                    const itemContent = item.querySelector('.kc-accordion-content');
                    if (itemContent) itemContent.style.display = 'none';
                });
            }
            if (!isActive) {
                parent.classList.add('active');
                contentPane.style.display = 'block';
            }
        }
    };
    root.addEventListener('click', handleFAQClicks);

    // Strip native Shopify listeners from cart close buttons so they don't intercept our custom logic
    const allCloseBtns = root.querySelectorAll('cart-drawer .button-close, cart-drawer .drawer__close');
    allCloseBtns.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode?.replaceChild(newBtn, btn);
    });

    const handleDrawerClose = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Handle cart-drawer
      const clickedOutsideCart = target.matches('cart-drawer') && !target.closest('.drawer__inner');
      const isCartCloseBtn = !!target.closest('cart-drawer .button-close, cart-drawer .drawer__close, cart-drawer [data-close]');
      
      if (isCartCloseBtn || clickedOutsideCart) {
        const activeDrawers = document.querySelectorAll('cart-drawer');
        let closedAny = false;
        activeDrawers.forEach(drawer => {
          if (drawer.getAttribute('data-hidden') !== 'true' || drawer.classList.contains('active') || drawer.classList.contains('is-active') || drawer.hasAttribute('open')) {
            drawer.setAttribute('data-hidden', 'true');
            drawer.setAttribute('inert', '');
            drawer.classList.remove('active', 'is-active');
            drawer.removeAttribute('open');
            closedAny = true;
          }
        });
        if (closedAny) {
          e.preventDefault();
          e.stopPropagation();
          document.documentElement.style.overflow = '';
          document.body.classList.remove('overflow-hidden');
        }
      }

      // Handle search-drawer
      const clickedOutsideSearch = target.matches('search-drawer') && !target.closest('.drawer__inner');
      const isSearchCloseBtn = !!target.closest('search-drawer .button-close, search-drawer .drawer__close, search-drawer [data-close]');
      
      if (isSearchCloseBtn || clickedOutsideSearch) {
        const activeDrawers = document.querySelectorAll('search-drawer');
        let closedAny = false;
        activeDrawers.forEach(drawer => {
          if (drawer.getAttribute('data-hidden') !== 'true' || drawer.classList.contains('active') || drawer.classList.contains('is-active') || drawer.hasAttribute('open')) {
            if (typeof (drawer as any).closeDrawer === 'function') {
              (drawer as any).closeDrawer();
            } else {
              drawer.setAttribute('data-hidden', 'true');
              drawer.setAttribute('inert', '');
              drawer.classList.remove('active', 'is-active');
              drawer.removeAttribute('open');
            }
            closedAny = true;
          }
        });
        if (closedAny) {
          e.preventDefault();
          e.stopPropagation();
          document.documentElement.style.overflow = '';
          document.body.classList.remove('overflow-hidden');
        }
      }
    };

    document.addEventListener('click', handleDrawerClose, true);
    document.addEventListener('touchstart', handleDrawerClose, { passive: false, capture: true });

    return () => {
       root.removeEventListener('click', handleFAQClicks);
       document.removeEventListener('click', handleDrawerClose, true);
       document.removeEventListener('touchstart', handleDrawerClose, { capture: true });
    };
  }, [bodyHtml]);

  /* ── Fetch categories, subcategories & products from Appwrite API (CACHED) with robust retries ── */
  useEffect(() => {
    let active = true;
    let retryCount = 0;
    const maxRetries = 5;

    const fetchData = async () => {
      if (isEditorMockEnabled()) {
        const mock = getTpl23MockData();
        setCategories(mock.categories);
        setSubcategories(mock.subcategories);
        setProducts(mock.products);
        setCheapestProducts(mock.products);
        setIsAppwriteLoaded(true);
        return;
      }
      try {
        const res = await fetch('/api/public-data/home');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (!active) return;

        const nextCategories = Array.isArray(data.categories) ? data.categories : [];
        const nextSubcategories = Array.isArray(data.subcategories) ? data.subcategories : [];
        const nextProducts = Array.isArray(data.products) ? data.products : [];
        const nextCheapestProducts = Array.isArray(data.cheapestProducts)
          ? data.cheapestProducts
          : [];

        if (nextCategories.length === 0 || nextProducts.length === 0) {
          console.warn('[Plantilla23] Home data came back empty or partial.', {
            categories: nextCategories.length,
            products: nextProducts.length,
            subcategories: nextSubcategories.length,
            cheapestProducts: nextCheapestProducts.length,
          });
          // Un payload vacío suele ser transitorio (rate limit / cold start de Appwrite).
          // Reintentar en vez de renderizar la home sin productos.
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            console.warn(`[Plantilla23] Empty payload — retrying in ${delay}ms (${retryCount}/${maxRetries})`);
            setTimeout(fetchData, delay);
            return;
          }
        }

        setCategories(nextCategories);
        setSubcategories(nextSubcategories);
        setProducts(nextProducts);
        setCheapestProducts(nextCheapestProducts.length > 0 ? nextCheapestProducts : nextProducts);
        setDestacadoTemporal(data.destacadoTemporal || null);
        setPackTimer(data.packTimer || null);
        setTimedOffers(data.timedOffers || []);
        setIsAppwriteLoaded(true);
      } catch (err) {
        console.error('[Plantilla23] Error fetching cached home data:', err);
        if (active && retryCount < maxRetries) {
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.warn(`[Plantilla23] Retrying data fetch in ${delay}ms... (Attempt ${retryCount}/${maxRetries})`);
          setTimeout(fetchData, delay);
        } else if (active) {
          console.error('[Plantilla23] Max retries reached or component unmounted. Falling back to empty state.');
          setIsAppwriteLoaded(true);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '23';
    return () => { delete document.documentElement.dataset.template; };
  }, []);

  /* ── Fetch products with CURRENTPRICE offers for the offers carousel ── */
  useEffect(() => {
    if (offersProducts.length > 0) return;
    let alive = true;
    (async () => {
      try {
        // ofertasOnly filtra en el servidor (cacheado): antes se bajaban 600
        // productos completos por visitante solo para quedarse con las ofertas.
        const res = await fetch('/api/public-data/products?ofertasOnly=true&limit=60');
        if (!res.ok) return;
        const data = await res.json();
        if (!alive) return;
        const pool = (data.products || []) as Product[];
        const offers = pool.filter(p =>
          p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < (p.PRICE || 0) && (p.STOCK || 0) > 0
        );
        if (alive) setOffersProducts(offers);
      } catch (e) {
        console.warn('[TPL23] Failed to fetch offers for home carousel', e);
      }
    })();
    return () => { alive = false; };
  }, [offersProducts.length]);

  /* ── Load font faces ── */
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'tpl23-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);

    // Precargar la imagen del hero para que aparezca instantáneamente
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/1780173022333-pegada-1780173016432.png?GoogleAccessId=imagen%40geminai-449212.iam.gserviceaccount.com&Expires=16730334000&Signature=Sa3yaIOBQLI7MIR1zG81iSWWMToOKHSAOeEhhjZjS3KZIOtkOZWDvV4imyKt3Xg%2BZvUI7DfAxYvGYPZJsVuEJSgTW8PrcSO9gNNwoy%2BEUq9MxaYw0PVkw%2BQXoEJPCXyZKPOK%2F7Nwnk3mUsZFp0uqFJQ0FB8Zqg%2BeOkHzWOIngMIh96BkQRVqnS3ecsnGqPYZqDEqsidg9v3YIl%2FM7z71qwI3MGjfOL7TKfn45vcNV1vb4MgQr%2FhjOTL2OAzawTtlB2IQTbehko3RL2T7JIdkMQWtS9Gm2MsefoCeOexwuwv3nHOTluGGUHIj6ff3yLJ7Ec4RJJMoHZ7TJA1h%2FC9XDQ%3D%3D';
    preloadLink.id = 'tpl23-preload-hero';
    if (!document.getElementById('tpl23-preload-hero')) document.head.appendChild(preloadLink);

    return () => { 
      styleEl.remove(); 
      const pl = document.getElementById('tpl23-preload-hero');
      if (pl) pl.remove();
    };
  }, []);

  /* ── Load CSS files dynamically + split-hero overrides ── */
  useEffect(() => {
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl23="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // Versión estable: con Date.now() el navegador re-descargaba todo el CSS en cada visita.
      // Subir el número solo cuando se edite bundle-all.css.
      link.href = `${href}?v=20260701`;
      link.setAttribute('data-tpl23', href);
      document.head.appendChild(link);
    });

    // ═══ CRITICAL OVERRIDES for split-hero (from plantilla8 docs) ═══
    const overrideStyle = document.createElement('style');
    overrideStyle.id = 'tpl23-overrides';
    overrideStyle.textContent = `
      /* FIX 1: filter:blur(0px) breaks position:fixed (CSS spec) */
      [style*="blur(0"] { filter: none !important; }

      /* FIX 2: Media column must start at 100vw, not 50% on desktop */
      @media (min-width: 768px) {
        .split-hero .split-hero-column.split-hero-column__media {
          min-width: 100% !important;
          max-width: 100% !important;
        }

        /* FIX 3: Collapsed state must be 50vw on desktop */
        .split-hero .split-hero-column__media.is-collapsed {
          min-width: 50% !important;
          max-width: 50% !important;
        }
      }

      @media (max-width: 767px) {
        /* Fix mobile video scroll blocking and object-fit */
        .split-hero video, .split-hero .split-hero__video {
          object-fit: cover !important;
          height: 100% !important;
          width: 100% !important;
          pointer-events: none !important; /* Allow scroll through video */
        }
        .split-hero-column__media {
          touch-action: pan-y !important; /* Allow vertical scroll */
        }
        
        /* Fix cards 'Tu ritual' / 'Dulce color' height showing skeleton */
        .multimedia-collage-block__inner, .multimedia-collage__block {
          height: 100% !important;
          min-height: 100% !important;
        }
        hover-zoom-image {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
        }
        hover-zoom-image img {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }

        /* Fix category images cut off */
        collection-list img, .collection-list img {
          object-fit: cover !important;
          height: 100% !important;
          width: 100% !important;
        }

        /* Fix slideshow (Herobanner) background separating from text on mobile */
        .slideshow__background {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 0 !important;
        }
        .slideshow__content {
          z-index: 10 !important;
          position: relative !important;
          height: 100% !important;
          display: flex !important;
          align-items: flex-end !important; /* Push text to bottom over the image */
        }
        .slideshow video, .slideshow img {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          touch-action: pan-y !important;
        }
      }

      /* FIX 4: Hide page loader and page-transition overlay */
      .page-loader { opacity: 0 !important; pointer-events: none !important; visibility: hidden !important; }
      page-transition { display: none !important; }

      /* FIX 5: Logo size override */
      .logo-wrapper { max-width: none !important; }
      @media (min-width: 768px) {
        .header a.logo-wrapper { width: 300px !important; min-width: 300px !important; max-width: none !important; flex-basis: 300px !important; --width: 300px !important; }
        .header img.logo { width: 300px !important; min-width: 300px !important; max-width: 300px !important; height: auto !important; max-height: none !important; }
      }

      /* FIX 6: Utility bar pastel pink */
      utility-bar, .utility-bar { background-color: #ffc0cb !important; }
      .utility-bar * { border-color: rgba(255,192,203,0.3) !important; }

      /* FIX 7: Video reveal — see main animation block below (cinematicReveal) */

      /* FIX 8: Fade out collage background once loaded to prevent source-swap flashes */
      .multimedia-collage__background.is-loaded {
        background-color: transparent !important;
      }

      /* FIX 9: Disable selection on specific static elements to prevent ugly blue highlight without blocking mobile swipes */
      img, video, h1, h2, h3, h4, h5, h6 {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
      
      /* FIX 9.1: Prevent tap highlighting on mobile */
      * {
        -webkit-tap-highlight-color: transparent !important;
      }
      /* Explicitly enable touch gestures and scrolling on Swiper containers */
      .swiper-container, .swiper-wrapper, .swiper-slide {
        touch-action: pan-y pinch-zoom !important;
        user-select: auto !important;
        -webkit-user-select: auto !important;
      }
      input, textarea {
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
      }

      /* FIX 10: Remove ugly rectangular selection/border from search input */
      input[type="search"]:not(#pk-search-input),
      input[type="search"]:not(#pk-search-input):focus,
      input[type="search"]:not(#pk-search-input):focus-visible,
      #drawer-input-search,
      #drawer-input-search:focus,
      #drawer-input-search:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
        background-color: transparent !important;
        border-radius: 0 !important;
      }

      /* Premium Skeleton & Smooth Animations System */
      @keyframes premiumShimmer {
        100% { transform: translateX(100%); }
      }
      @keyframes premiumReveal {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Floating animation for discount image card */
      @keyframes floatAnimation {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      .float-animation {
        animation: floatAnimation 4s ease-in-out infinite !important;
      }

      /* ═══ Video starts hidden — JS handles the cinematic reveal animation ═══ */
      .reveal-on-play {
        opacity: 0 !important;
      }
      /* Fallback if JS animation completes */
      .reveal-on-play.is-playing-revealed {
        opacity: 1 !important;
      }


      /* Skeletons active by default */
      .header img.logo:not(.is-loaded) {
        background-color: #FBCAC9 !important;
        background-image: none !important;
        position: relative !important;
        overflow: hidden !important;
        color: transparent !important;
        border-color: transparent !important;
        pointer-events: none !important;
      }


      /* Disable white logo filter brightness/invert during loading so the pink skeleton shows beautifully */
      .header img.logo:not(.is-loaded) {
        filter: none !important;
      }
      .header img.logo:not(.is-loaded)::after {
        content: "" !important;
        position: absolute !important;
        top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent) !important;
        transform: translateX(-100%) !important;
        animation: premiumShimmer 1.8s infinite !important;
        z-index: 50 !important;
      }

      /* Smooth reveal when loaded */
      .header img.logo.is-loaded {
        animation: premiumReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      }

      /* Highlight word "CATÁLOGO" in menu to black */
      .header[data-id="sections--27304712208665__header"] .highlight {
        color: #000000 !important;
      }

      /* ═══ Responsive nav & elements: prevent menu items crowding at medium/small laptops (e.g. 1366x768) ═══ */

      /* CRITICAL: Force nav to stay on ONE LINE — no wrapping allowed.
         The ul has Tailwind "flex-wrap" class which causes items to drop
         to a 2nd row and overlap the hero heading text. */
      .menu-wrapper ul[data-tier="1"] {
        flex-wrap: nowrap !important;
        overflow: hidden !important;
      }

      /* [MODIFICACION YAXSEL]: Ajustes para pantallas laptops pequeñas (como 1366x768) hasta 1400px */
      @media (max-width: 1400px) {
        /* Reducir espaciado del menú de navegación */
        .menu-wrapper ul[data-tier="1"] > li > a,
        .menu-wrapper ul[data-tier="1"] > li > button {
          font-size: 12px !important;
          letter-spacing: 0 !important;
        }
        .menu-wrapper ul[data-tier="1"] {
          gap: 6px !important;
        }
        .menu-wrapper ul[data-tier="1"] > li {
          padding-left: 2px !important;
          padding-right: 2px !important;
        }
        
        /* Reducir tamaño del logo para liberar espacio vertical y horizontal */
        .header a.logo-wrapper {
          width: 200px !important;
          min-width: 200px !important;
          flex-basis: 200px !important;
        }
        .header img.logo {
          width: 200px !important;
          min-width: 200px !important;
          max-width: 200px !important;
        }
        
        /* Reducir tamaño de las acciones Buscar y Carrito en el header */
        .header .search-icon,
        .header .cart-icon {
          font-size: 12px !important;
        }

        /* --- Ajustes específicos de Hero Banner 1 --- */
        
        /* Reducir el tamaño de las letras del título gigante (La Selección Glow) */
        .slideshow .giant-heading,
        .slideshow .giant-heading span,
        .slideshow .giant-heading .highlighted-text {
          font-size: clamp(2rem, 3.8vw, 3.4rem) !important;
        }
        
        /* Reducir tamaño del texto descriptivo */
        .slideshow .body-text p,
        .slideshow .body-text span p {
          font-size: 0.95rem !important;
          line-height: 1.4 !important;
        }
        
        /* Reducir el padding vertical del contenedor del contenido del slideshow */
        .slideshow__content .custom-container {
          padding-top: 1rem !important;
          padding-bottom: 2rem !important;
        }
        
        /* Reducir paddings de espaciado del botón del slideshow para compactar verticalmente */
        .slideshow-block-button .custom-theme-block,
        .slideshow__content .button-block .custom-theme-block {
          --padding-bottom: 15px !important;
        }
      }

      /* [MODIFICACION YAXSEL]: Ajustes para pantallas medianamente pequeñas hasta 1200px */
      @media (max-width: 1200px) {
        .menu-wrapper ul[data-tier="1"] > li > a,
        .menu-wrapper ul[data-tier="1"] > li > button {
          font-size: 11px !important;
          letter-spacing: 0 !important;
        }
        .menu-wrapper ul[data-tier="1"] {
          gap: 2px !important;
        }
        .menu-wrapper ul[data-tier="1"] > li {
          padding-left: 1px !important;
          padding-right: 1px !important;
          padding-top: 4px !important;
          padding-bottom: 4px !important;
          shrink: 1 !important;
        }
        .header a.logo-wrapper {
          width: 160px !important;
          min-width: 160px !important;
          flex-basis: 160px !important;
        }
        .header img.logo {
          width: 160px !important;
          min-width: 160px !important;
          max-width: 160px !important;
        }
      }

      /* [MODIFICACION YAXSEL]: Ajustes extremos antes de pasar a la vista móvil */
      @media (max-width: 1024px) {
        .menu-wrapper ul[data-tier="1"] > li > a,
        .menu-wrapper ul[data-tier="1"] > li > button {
          font-size: 10px !important;
          letter-spacing: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .menu-wrapper ul[data-tier="1"] {
          gap: 0px !important;
        }
        .menu-wrapper ul[data-tier="1"] > li {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        /* Also shrink the action buttons area (BUSCAR / CARRITO) */
        .header__actions,
        .header-actions,
        .header [class*="actions"] {
          gap: 4px !important;
        }
      }

      /* Bouncy Breathtaking 20% OFF Button - Soft Pink #FBCAC9 */
      @keyframes bouncyPop {
        0%, 100% { transform: scale(1) translateY(0) rotate(0deg); }
        15% { transform: scale(1.12) translateY(-14px) rotate(-3deg); }
        25% { transform: scale(1.12) translateY(-14px) rotate(3deg); }
        35% { transform: scale(1.08) translateY(-6px) rotate(-1.5deg); }
        45% { transform: scale(1.08) translateY(-6px) rotate(1.5deg); }
        55% { transform: scale(1.02) translateY(-2px) rotate(0deg); }
      }
      newsletter-popup { display: none !important; }
      .button-newsletter {
        display: none !important;
        --newsletter-popup-color-button-background: #FBCAC9 !important;
        --newsletter-popup-color-button-text: #ffffff !important;
        background: #FBCAC9 !important;
        color: #ffffff !important;
        box-shadow: 0 10px 25px rgba(251, 202, 201, 0.4) !important;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        animation: bouncyPop 3.5s infinite ease-in-out !important;
      }
      .button-newsletter:hover {
        transform: scale(1.15) translateY(-5px) !important;
        box-shadow: 0 15px 35px rgba(251, 202, 201, 0.6) !important;
        background: #fbb4b3 !important;
      }
      .button-newsletter span.h6 {
        color: #ffffff !important;
      }
      .button-newsletter .button-close svg {
        color: #ffffff !important;
      }
      @media (max-width: 1023px) {
        .button-newsletter {
          transform: rotate(-90deg) !important;
          transform-origin: left top !important;
          left: 0 !important;
          top: 88% !important;
          bottom: auto !important;
          border-radius: 0 0 8px 8px !important;
          animation: none !important;
          padding: 5px 10px !important;
          box-shadow: 0 2px 5px rgba(251, 202, 201, 0.4) !important;
          font-size: 11px !important;
        }
        .button-newsletter:hover, .button-newsletter:active {
          transform: rotate(-90deg) !important;
          box-shadow: 0 2px 5px rgba(251, 202, 201, 0.4) !important;
        }
        .button-newsletter .h6 {
          font-size: 11px !important;
        }
        .button-newsletter .button-close svg {
          width: 14px !important;
          height: 14px !important;
        }
      }

      /* Editorial Serif Typography with Metallic Shimmer Gradient for Kevin&Coco */
      .animated-kevin-coco {
        font-family: 'Didot', 'Playfair Display', 'Garamond', 'Times New Roman', serif !important;
        font-style: italic !important;
        font-weight: 900 !important;
        font-size: 1.15em !important;
        letter-spacing: 2px !important;
        background: linear-gradient(135deg, rgb(251, 207, 232), rgb(245, 168, 207), rgb(227, 150, 191), rgb(245, 168, 207), rgb(251, 207, 232)) !important;
        background-size: 200% auto !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        display: inline-block !important;
        animation: pinkPulse 2.5s infinite ease-in-out, shimmerBg 5s infinite linear !important;
        text-shadow: none !important;
        padding-left: 5px !important;
      }
      
      /* Subtle Shadow Glassmorphism Price Badge */
      .hero2-price-badge {
        position: absolute !important;
        z-index: 999 !important;
        right: 28% !important;
        bottom: 14% !important;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)) !important;
        color: #E396BF !important; /* Elegant rose matching gradient middle-tone */
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 900 !important;
        font-size: clamp(1.8rem, 4vw, 3.2rem) !important;
        padding: 10px 24px !important;
        border-radius: 20px !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.4) !important; /* Subtle soft shadow */
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-shadow: none !important;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        text-decoration: none !important;
      }
      .hero2-price-badge:hover {
        transform: scale(1.15) rotate(5deg) !important;
        background: linear-gradient(135deg, rgb(251, 207, 232), rgb(245, 168, 207), rgb(227, 150, 191)) !important;
        color: #ffffff !important;
        box-shadow: 0 15px 30px rgba(245, 168, 207, 0.4) !important;
      }

      /* Mobile styles for Herobanner 2 custom elements */
      @media (max-width: 1023px) {
        .hero2-price-badge {
          right: 4% !important;
          bottom: 20% !important;
          font-size: 1.8rem !important;
          padding: 6px 16px !important;
          border-radius: 12px !important;
        }
      }

      /* Animación suave de transición para todo el header al scrollear */
      custom-header.header-element {
        transition: background 0.4s ease-in-out, 
                    background-color 0.4s ease-in-out, 
                    backdrop-filter 0.4s ease-in-out, 
                    -webkit-backdrop-filter 0.4s ease-in-out, 
                    box-shadow 0.4s ease-in-out,
                    transform 0.4s ease-in-out !important;
      }

      /* ── COMPACT HEADER & UTILITY BAR (MOVE NAVBAR HIGHER) ── */
      /* Hacer la barra de utilidad (utility-bar) súper delgada */
      utility-bar.header-element {
        min-height: 24px !important;
        --min-height: 24px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
        font-size: 11px !important;
      }
      utility-bar.header-element .custom-container {
        padding-top: 1px !important;
        padding-bottom: 1px !important;
      }
      utility-bar.header-element localization-form {
        margin-top: 0px !important;
        margin-bottom: 0px !important;
      }

      /* Reducir paddings internos del header para subir la barra y compactarla al máximo */
      custom-header.header-element {
        --top: 24px !important; /* Fuerza al header a estar pegado al utility-bar súper arriba */
        --utility-bar-gap: 0px !important;
        --announcement-bar-gap: 0px !important;
      }
      custom-header.header-element .py-3,
      custom-header.header-element .lg\:pt-5,
      custom-header.header-element .lg\:pb-2 {
        padding-top: 2px !important;
        padding-bottom: 2px !important;
      }
      custom-header.header-element .logo-wrapper {
        padding-top: 1px !important;
        padding-bottom: 1px !important;
      }

      /* Quitar la línea blanca de abajo de forma ultra agresiva en toda la sección del header */
      .section-header,
      .shopify-section,
      custom-header.header-element,
      custom-header.header-element *,
      .header,
      .header * {
        border-bottom: none !important;
        border-bottom-width: 0px !important;
        border-top: none !important;
        border-top-width: 0px !important;
        border-color: transparent !important;
        outline: none !important;
      }

      /* ── HERO BANNER CONTENT POSITION (LOWER IT) ── */
      /* Bajar el título, descripción y botón del slideshow para que no queden pegados arriba */
      @media (min-width: 1024px) {
        .slideshow__content .custom-container {
          padding-top: 140px !important; /* Desplaza el bloque hacia abajo en desktop */
        }
      }
      /* Padding 5% a cada lado solo en monitores ultrawide (>1920px) */
      @media (min-width: 1921px) {
        /* Aplicar a todas las secciones de la plantilla */
        #shopify-section-template--27304712470809__slideshow_FBfKC8,
        #shopify-section-template--27304712470809__collection_list_slider_YAxwGw,
        #shopify-section-template--27304712470809__featured_product_38eqkx,
        #shopify-section-template--27304712470809__multimedia_collage_LJJ4Cn,
        #shopify-section-template--27304712470809__featured_collection_aJrjzW,
        #shopify-section-template--27304712470809__split_hero_HFdBqn,
        #shopify-section-template--27304712470809__media_columns_columns_pb9XE3,
        #shopify-section-template--27304712470809__product_columns_MJFLFz,
        #shopify-section-template--27304712470809__media_with_text_dJBqha,
        #shopify-section-template--27304712470809__media_columns_slider_zMFEzH,
        #shopify-section-template--27304712470809__bundle_products_3zgi3T,
        #shopify-section-template--27304712470809__flexible_columns_8WJ3XM,
        #shopify-section-template--27304712470809__horizontal_testimonials_ficPn4,
        #shopify-section-template--27304712470809__featured_blog_posts_slider_NPkjze,
        #shopify-section-template--27304712470809__store_locator_GQ6jFw,
        #shopify-section-template--27304712470809__editorial_banner_HqHd6i {
          padding-left: 5% !important;
          padding-right: 5% !important;
          box-sizing: border-box !important;
        }
        /* Hero banner specific overrides */
        #shopify-section-template--27304712470809__slideshow_FBfKC8 .slideshow,
        #shopify-section-template--27304712470809__slideshow_FBfKC8 custom-slideshow,
        #shopify-section-template--27304712470809__slideshow_FBfKC8 .swiper-container,
        #shopify-section-template--27304712470809__slideshow_FBfKC8 parallax-element-section {
          width: 100% !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        /* Promo banner (split-hero) specific overrides */
        #shopify-section-template--27304712470809__split_hero_HFdBqn split-hero,
        #shopify-section-template--27304712470809__split_hero_HFdBqn .split-hero {
          width: 100% !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        @media (min-width: 768px) {
          #shopify-section-template--27304712470809__split_hero_HFdBqn .split-hero .split-hero-column.split-hero-column__media {
            min-width: 100% !important;
            max-width: 100% !important;
          }
          #shopify-section-template--27304712470809__split_hero_HFdBqn .split-hero .split-hero-column__media.is-collapsed {
            min-width: 50% !important;
            max-width: 50% !important;
          }
        }
        /* Mega Pack (bundle products) specific overrides */
        #shopify-section-template--27304712470809__bundle_products_3zgi3T bundle-products,
        #shopify-section-template--27304712470809__bundle_products_3zgi3T .bundle-products {
          width: 100% !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }
      }
      @media (max-width: 1023px) {
        .slideshow__content .custom-container {
          padding-top: 90px !important; /* Desplaza el bloque hacia abajo en mobile */
        }
      }
      /* ── HEADER THREE-STATE STYLING (GLASSMORPHISM ONLY ON SCROLLED STICKY) ── */
      /* Estado 1: Inicial / Fijo arriba (data-scroll="false") - Transparente puro, sin blur ni fondos */
      /* Estado 1: Inicial / Fijo arriba (data-scroll="false") - Transparente puro, sin blur ni fondos */
      custom-header.header-element[data-scroll="false"],
      .header[data-id="sections--27304712208665__header"][data-scroll="false"] {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
      }      /* Ocultar logo en móvil cuando no hay scroll y mostrarlo solo en el sticky (data-scroll="true") */
      @media (max-width: 1023px) {
        custom-header[data-scroll="false"] .logo-wrapper {
          display: none !important;
        }
        custom-header[data-scroll="true"] .logo-wrapper {
          display: block !important;
        }
      }

            /* ── NEWSLETTER POPUP: Never auto-open on mobile — only if user clicks button ── */
      /* On mobile the popup will only show when user taps the button-newsletter label */
      @media (max-width: 767px) {
        /* When popup opens (triggered by user), make it look nice and compact */
        newsletter-popup:not([data-hidden="true"]):not([data-auto-hidden="true"]) {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          left: 16px !important;
          bottom: 80px !important;
          right: 16px !important;
          width: auto !important;
          max-width: 340px !important;
          z-index: 999999 !important;
          transform: none !important;
        }
      }

      /* ── HIDE HEROBANNER NATIVE SWIPER PAGINATION + ARROWS ── */
      /* El carrusel del hero ahora usa flechas/puntos propios (.hero-nav/.hero-dots),
         así que ocultamos los controles nativos de Swiper que quedaron sin función. */
      .slideshow .swiper-pagination,
      .slideshow .swiper-navigation-wrapper {
          display: none !important;
      }

      /* Ocultar el bloque de video y el contenido del collage en móviles y tablets para evitar lag severo */
      @media (max-width: 1023px) {
        .multimedia-collage,
        multimedia-collage,
        .multimedia-collage-block__inner,
        [data-block-id="AeU1KMU9YMGYxdWlmU__multimedia_collage_video_block_ndXhr3"],
        .collage-video-wrapper,
        .multimedia-collage__content {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          min-height: 0 !important;
          position: absolute !important;
          z-index: -9999 !important;
          pointer-events: none !important;
        }
      }

      /* ── MOBILE HERO BANNER: Remove description, add two buttons ── */
      @media (max-width: 767px) {
        /* Hide description text in hero banner */
        #shopify-block-AcVBhSWFiRHVuUkd6T__text_JfdEpN { display: none !important; }
        /* Make hero button smaller */
        #shopify-block-ANTBPMjNnaUZNbklXR__button_VKQi4f .custom-button { font-size: 12px !important; padding: 8px 18px !important; }

        /* Hide descriptions on multimedia collage cards */
        /* Manos Suaves description */
        #shopify-block-AYXpwUzZ2UjI3VEhCQ__text_99crGb { display: none !important; }
        /* Manos Suaves button smaller */
        #shopify-block-ASEtVbTFsdUJKUm1XV__button_yUjQqP .custom-button { font-size: 11px !important; padding: 6px 14px !important; }
        /* Tu Ritual Diario description */
        #shopify-block-Aa0hpRFd5WEFEbWEwV__text_mzj3iN { display: none !important; }
        /* Dulce Color description — will need to find its block ID, applying via parent */
        .multimedia-collage__block .text-block.shopify-block:not(:first-child) { display: none !important; }

        /* Videos: allow scroll through them */
        video { pointer-events: none !important; touch-action: pan-y !important; }

        /* Hero banner mobile: remove description */
        .slideshow .body-text { display: none !important; }

        /* Hide Navbar1 top section and overlays on mobile, keep ONLY bottom mobile nav */
        .tpl1-nav { display: none !important; }
        .tpl1-nav-mobile-overlay { display: none !important; }

        /* Center "Poderosamente Bella" title horizontally on mobile */
        #shopify-block-AWVVEUzRxSzlKZnpON__giant_heading_3cqAMy,
        #shopify-block-AWVVEUzRxSzlKZnpON__giant_heading_3cqAMy giant-heading,
        #shopify-block-AWVVEUzRxSzlKZnpON__giant_heading_3cqAMy h2 {
          text-align: center !important;
          justify-content: center !important;
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }
        #shopify-block-AWVVEUzRxSzlKZnpON__giant_heading_3cqAMy h2 span {
          width: 100% !important;
          text-align: center !important;
        }
      }

      /* Globally hide Navbar1 top sections for Plantilla 23 */
      .tpl1-nav { display: none !important; }
      .tpl1-nav-mobile-overlay { display: none !important; }

      /* ── MANOS SUAVES BLOCK CUSTOM LAYOUT ── */
      [data-block-id="AMXRRQ2RsU3J0dWQzY__multimedia_collage_image_block_hThbgy"] .multimedia-collage-block__inner {
        position: relative !important;
      }
      [data-block-id="AMXRRQ2RsU3J0dWQzY__multimedia_collage_image_block_hThbgy"] .multimedia-collage__content {
        position: absolute !important;
        inset: 0 !important;
        display: block !important;
      }
      [data-block-id="AMXRRQ2RsU3J0dWQzY__multimedia_collage_image_block_hThbgy"] .multimedia-collage__content > div {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        padding: 24px !important;
        box-sizing: border-box !important;
      }
      #shopify-block-AMDN1ejVZUHhhRDZEd__heading_UErC4k {
        position: absolute !important;
        top: 24px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 100% !important;
        text-align: center !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #shopify-block-AMDN1ejVZUHhhRDZEd__heading_UErC4k h5 {
        text-align: center !important;
        display: inline-block !important;
      }
      #shopify-block-AYXpwUzZ2UjI3VEhCQ__text_99crGb {
        position: absolute !important;
        top: 65px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: calc(100% - 48px) !important;
        text-align: center !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #shopify-block-ASEtVbTFsdUJKUm1XV__button_yUjQqP {
        position: absolute !important;
        bottom: 24px !important;
        left: 24px !important;
        margin: 0 !important;
        padding: 0 !important;
        width: auto !important;
      }
      #shopify-block-ASEtVbTFsdUJKUm1XV__button_yUjQqP .custom-theme-block {
        padding: 0 !important;
        width: auto !important;
      }
      #shopify-block-ASEtVbTFsdUJKUm1XV__button_yUjQqP .custom-button {
        width: auto !important;
        display: inline-flex !important;
        padding-left: 24px !important;
        padding-right: 24px !important;
      }

      /* Adjust bottom spacing for Manos Suaves button on mobile */
      @media (max-width: 767px) {
        #shopify-block-ASEtVbTFsdUJKUm1XV__button_yUjQqP {
          bottom: 16px !important;
          left: 16px !important;
        }
      }



      /* ── FEATURED COLLECTION & PRODUCT CARDS REDESIGN ── */
      .featured-collection {
        background-color: #faf6f6/30 !important;
        padding-top: 60px !important;
        padding-bottom: 60px !important;
      }
      .featured-collection .heading-section {
        text-align: center !important;
        margin-bottom: 20px !important;
      }
      .featured-collection .heading-section h3 {
        font-family: 'Playfair Display', serif !important;
        font-weight: 800 !important;
        color: #1f2937 !important;
        letter-spacing: -0.5px !important;
      }
      .featured-collection .heading-section .body-text {
        font-size: 14px !important;
        color: #6b7280 !important;
        margin-top: 6px !important;
      }
      
      /* Pestañas de Tags Estilo Minimalista Boutique */
      .featured-collection__tags {
        margin-bottom: 40px !important;
        border-bottom: 1px solid rgba(0,0,0,0.06) !important;
      }
      .featured-collection__tags .flex,
      .featured-collection__tags [class*="flex"] {
        display: flex !important;
        gap: 28px !important;
        justify-content: center !important;
        align-items: center !important;
        padding: 0 0 10px 0 !important;
      }
      .button-tag {
        background: transparent !important;
        color: #9ca3af !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        border: none !important;
        border-bottom: 2px solid transparent !important;
        transition: all 0.25s ease !important;
        opacity: 1 !important;
        box-shadow: none !important;
        display: inline-flex !important;
        align-items: center !important;
        cursor: pointer !important;
        padding: 6px 4px !important;
        border-radius: 0px !important;
        text-transform: uppercase !important;
        letter-spacing: 1.5px !important;
      }
      .button-tag:hover {
        color: #db2777 !important;
        background: transparent !important;
      }
      .button-tag.active {
        color: #db2777 !important;
        background: transparent !important;
        border-bottom: 2px solid #db2777 !important;
        box-shadow: none !important;
      }
      .button-tag span {
        background-image: none !important;
      }

      /* Estilo destacado del primer producto alineado y limpio */
      .featured-collection__first-product-wrapper {
        background: transparent !important;
        border: none !important;
        border-radius: 0px !important;
        padding: 0 !important;
        max-width: 320px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: none !important;
        position: relative !important;
      }
      .featured-collection__first-product-wrapper::before {
        display: none !important;
      }

      /* Ocultar botones e indicadores nativos feos */
      .featured-collection .swiper-pagination {
        display: none !important;
      }

      /* Flechas de navegación */
      .featured-collection .button-previous,
      .featured-collection .button-next {
        background: white !important;
        border: 1px solid rgba(244, 63, 94, 0.15) !important;
        border-radius: 50% !important;
        color: #db2777 !important;
        width: 40px !important;
        height: 40px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
        transition: all 0.3s ease !important;
      }
      .featured-collection .button-previous:hover,
      .featured-collection .button-next:hover {
        background: #db2777 !important;
        color: white !important;
        box-shadow: 0 6px 16px rgba(219, 39, 119, 0.3) !important;
        transform: scale(1.05) !important;
      }

/* Estado 3: Navbar final scrolled (data-scroll="true") - Glassmorphism sutil y elegante, sin línea blanca abajo */
      custom-header.header-element[data-scroll="true"],
      .header[data-id="sections--27304712208665__header"][data-scroll="true"] {
        background: #fdf2f8 !important;
        background-color: #fdf2f8 !important;
        background-image: none !important;
        backdrop-filter: blur(12px) saturate(140%) !important;
        -webkit-backdrop-filter: blur(12px) saturate(140%) !important;
        border: none !important;
        border-bottom: none !important;
        box-shadow: 0 4px 20px -2px rgba(227, 150, 191, 0.12) !important;
      }

      /* Logo and UNIDAD/PAQUETE buttons black only when scrolled navbar appears */
      custom-header[data-scroll="true"] .logo-wrapper img,
      .header[data-scroll="true"] .logo-wrapper img {
        filter: brightness(0) !important;
      }
      custom-header[data-scroll="true"] a[href*="/productos"],
      custom-header[data-scroll="true"] a[href*="/paquetes"],
      .header[data-scroll="true"] a[href*="/productos"],
      .header[data-scroll="true"] a[href*="/paquetes"] {
        color: #000000 !important;
        border-color: #000000 !important;
      }
      custom-header[data-scroll="true"] a[href*="/productos"] *,
      custom-header[data-scroll="true"] a[href*="/paquetes"] *,
      .header[data-scroll="true"] a[href*="/productos"] *,
      .header[data-scroll="true"] a[href*="/paquetes"] * {
        color: #000000 !important;
        fill: #000000 !important;
        stroke: #000000 !important;
      }

      /* ==========================================
         FEATURED PRODUCT SECTION PREMIUM STYLING
         ========================================== */
      featured-product[data-id="template--27304712470809__featured_product_38eqkx"] {
        display: block !important;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.5) 100%) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.8) !important;
        border-radius: 28px !important;
        box-shadow: 0 15px 40px rgba(219, 39, 119, 0.04) !important;
        margin: 40px auto !important;
        max-width: 1200px !important;
        padding: 32px !important;
        overflow: hidden !important;
        transition: all 0.3s ease !important;
      }
      
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-container {
        display: flex !important;
        gap: 48px !important;
        align-items: center !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      @media screen and (min-width: 769px) {
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-media {
          width: 50% !important;
          max-width: 50% !important;
          flex: 0 0 50% !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-content {
          width: 50% !important;
          max-width: 50% !important;
          flex: 0 0 50% !important;
        }
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] product-media {
        border-radius: 20px !important;
        overflow: hidden !important;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.04) !important;
        border: 1px solid rgba(0, 0, 0, 0.03) !important;
        background: #ffffff !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] h3.heading {
        font-size: clamp(1.4rem, 2.5vw, 2rem) !important;
        font-weight: 900 !important;
        color: #111827 !important;
        letter-spacing: -0.02em !important;
        line-height: 1.2 !important;
        margin-bottom: 8px !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .vendor {
        text-transform: uppercase !important;
        letter-spacing: 0.12em !important;
        color: #db2777 !important;
        font-weight: 800 !important;
        font-size: 11px !important;
        display: inline-block !important;
        margin-bottom: 6px !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .price-item--sale,
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .price-item {
        background: linear-gradient(135deg, #ff7e95 0%, #ff385c 100%) !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        color: transparent !important;
        font-weight: 900 !important;
        font-size: 26px !important;
        filter: drop-shadow(0 2px 4px rgba(255, 56, 92, 0.15)) !important;
        display: inline-flex !important;
      }
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .price-item--compare {
        color: #9ca3af !important;
        font-size: 16px !important;
        margin-left: 6px !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .badge--in-stock,
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .inventory {
        display: none !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] custom-accordion {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
        margin: 6px 0 !important;
        padding: 0 !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .accordion-heading {
        font-weight: 700 !important;
        font-size: 13px !important;
        color: #374151 !important;
        padding: 12px 0 !important;
        border: none !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        transition: color 0.2s ease !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .accordion-heading:hover {
        color: #db2777 !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .accordion-body__inner {
        padding: 4px 0 14px 0 !important;
        font-size: 12px !important;
        color: #4b5563 !important;
        line-height: 1.6 !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .button-cart {
        background: linear-gradient(135deg, #e396bf 0%, #f472b6 100%) !important;
        border: none !important;
        color: #ffffff !important;
        border-radius: 12px !important;
        font-weight: 800 !important;
        font-size: 14px !important;
        letter-spacing: 0.5px !important;
        text-transform: uppercase !important;
        padding: 14px 24px !important;
        box-shadow: 0 6px 16px rgba(227, 150, 191, 0.35) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .button-cart:hover {
        background: linear-gradient(135deg, #f472b6 0%, #e396bf 100%) !important;
        box-shadow: 0 10px 24px rgba(227, 150, 191, 0.5) !important;
        transform: translateY(-2px) !important;
      }
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .button-cart:active {
        transform: translateY(0) scale(0.98) !important;
      }

      /* Injected timer modifications */
      .product[data-id="template--27304712470809__featured_product_38eqkx"] #dt-timer-container > div {
        background: linear-gradient(135deg, rgba(219, 39, 119, 0.03) 0%, rgba(244, 63, 94, 0.06) 100%) !important;
        border: 1px solid rgba(219, 39, 119, 0.1) !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 10px rgba(219, 39, 119, 0.02) !important;
        transition: transform 0.2s ease !important;
        padding: 10px 14px !important;
      }
      .product[data-id="template--27304712470809__featured_product_38eqkx"] #dt-timer-container > div:hover {
        transform: translateY(-2px) !important;
      }

      .product[data-id="template--27304712470809__featured_product_38eqkx"] .body-text[data-index="7"] a {
        transition: all 0.3s ease !important;
      }
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .body-text[data-index="7"] a:hover {
        background: #be185d !important;
        box-shadow: 0 6px 20px rgba(219, 39, 119, 0.5) !important;
        transform: translateY(-1px) !important;
      }
      .product[data-id="template--27304712470809__featured_product_38eqkx"] .body-text[data-index="7"] a:active {
        transform: translateY(0) scale(0.98) !important;
      }

      @media screen and (max-width: 768px) {
        featured-product[data-id="template--27304712470809__featured_product_38eqkx"] {
          margin: 16px 8px !important;
          padding: 16px !important;
          border-radius: 20px !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-container {
          flex-direction: column !important;
          gap: 16px !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-media,
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-content {
          max-width: 100% !important;
          width: 100% !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] media-wrapper {
          padding-top: 0 !important;
          height: 280px !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .image-wrapper {
          position: relative !important;
          height: 100% !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .image-wrapper img {
          object-fit: contain !important;
          height: 100% !important;
          width: 100% !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-content {
          padding: 0 !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .product-content > div {
          padding: 0 !important;
        }
        /* Mobile timer boxes should be compact */
        .product[data-id="template--27304712470809__featured_product_38eqkx"] #dt-timer-container > div {
          padding: 6px 8px !important;
          border-radius: 8px !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] #dt-timer-container span.text-sm,
        .product[data-id="template--27304712470809__featured_product_38eqkx"] #dt-timer-container span.text-lg {
          font-size: 14px !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] #dt-timer-container span.text-\[8px\],
        .product[data-id="template--27304712470809__featured_product_38eqkx"] #dt-timer-container span.text-\[10px\] {
          font-size: 7px !important;
        }
        /* Typography overrides */
        .product[data-id="template--27304712470809__featured_product_38eqkx"] h3.heading {
          font-size: 18px !important;
          margin-bottom: 6px !important;
        }
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .price-item--sale,
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .price-item {
          font-size: 20px !important;
        }
        /* Tighten accordions on mobile */
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .accordion-heading {
          padding: 10px 0 !important;
          font-size: 12px !important;
        }
        /* Compact cart button on mobile */
        .product[data-id="template--27304712470809__featured_product_38eqkx"] .button-cart {
          font-size: 12px !important;
          padding: 12px 16px !important;
          border-radius: 10px !important;
        }
      }

      /* Column 1 Overlay Text: KEVIN&COCO */
      #shopify-block-AQkJOZW04ZFNvR1lQT__heading_wiNdGV h1.heading span {
        color: #ffffff !important;
        font-weight: 900 !important;
        text-shadow: 0 4px 14px rgba(0, 0, 0, 0.4) !important;
        font-family: 'Outfit', sans-serif !important;
        letter-spacing: -0.02em !important;
        font-size: clamp(2.5rem, 6vw, 4.5rem) !important;
      }
      #shopify-block-AYTh4bDduYUR3cndtM__text_GmmJDh .body-text span p {
        color: rgba(255, 255, 255, 0.95) !important;
        font-weight: 600 !important;
        font-size: 15px !important;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35) !important;
        letter-spacing: 0.5px !important;
      }
      #shopify-block-AZWc3TUZta055TVh5Z__button_EtMYEL a.custom-button {
        background: linear-gradient(135deg, #e396bf 0%, #f472b6 100%) !important;
        color: #ffffff !important;
        border: none !important;
        font-weight: 800 !important;
        border-radius: 9999px !important;
        box-shadow: 0 4px 16px rgba(227, 150, 191, 0.45) !important;
        transition: all 0.3s ease !important;
      }
      #shopify-block-AZWc3TUZta055TVh5Z__button_EtMYEL a.custom-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(227, 150, 191, 0.6) !important;
      }

      /* Column 2 (Right Column) Styles */
      /* H2 Header: CONOCE Y PRUEBA... */
      #shopify-block-AZ3F5bkNGMEQrb01QV__heading_TFNpkN h2.heading span {
        background: linear-gradient(135deg, #db2777 0%, #e396bf 50%, #f472b6 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        font-weight: 900 !important;
        font-size: clamp(1.8rem, 4vw, 2.4rem) !important;
        line-height: 1.25 !important;
        letter-spacing: -0.02em !important;
        font-family: 'Outfit', sans-serif !important;
      }
      
      /* Description below H2 */
      #shopify-block-AdzUvWXdBdDludWFTd__text_4izVdy .body-text p {
        color: #4b5563 !important;
        font-size: 15px !important;
        line-height: 1.7 !important;
        font-weight: 500 !important;
        max-width: 520px;
        margin: 0 auto;
      }
      
      /* H5 Subtitle: Brilla con Kevin&Coco */
      #shopify-block-AOCtTdFRKUmFoRWpVW__heading_YeQjN3 h5.heading span {
        color: #db2777 !important;
        font-weight: 800 !important;
        font-size: clamp(1.2rem, 3vw, 1.5rem) !important;
        letter-spacing: 0.5px !important;
        position: relative;
        display: inline-block;
      }
      #shopify-block-AOCtTdFRKUmFoRWpVW__heading_YeQjN3 h5.heading span::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: linear-gradient(135deg, #e396bf, #f472b6);
        border-radius: 999px;
      }
      
      /* Description below H5 */
      #shopify-block-AaWlFcGdocnYyRjFaa__text_bbXKgK .body-text p em {
        color: #6b7280 !important;
        font-style: italic !important;
        font-weight: 400 !important;
        font-size: 14px !important;
      }

      /* Make it look beautiful and neat on mobile */
      @media (max-width: 767px) {
        .split-hero-column-inner {
          padding: 30px 16px !important;
        }
        #shopify-block-AVlJPcVF6UzFJOHkzK__vertical_spacer_3VziYG .custom-theme-block {
          --spacer-height-mobile: 20px !important;
        }
      }

      @media (max-width: 992px) {
        .tpl23-shopify-root custom-header.header-element {
          position: absolute !important;
          top: 0px !important;
          margin-top: 0px !important;
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
        .tpl23-shopify-root .header-element .logo-wrapper {
          margin-top: 0px !important;
          padding-top: 0px !important;
          padding-bottom: 0px !important;
        }
        .tpl23-shopify-root .header-element .logo-wrapper img {
          max-height: 36px !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .tpl23-shopify-root .header-element .menu-hamburger-button {
          margin-top: 0px !important;
          margin-bottom: 0px !important;
          height: 18px !important;
        }
        .tpl23-shopify-root .header-element .flex.justify-between.relative.gap-3.py-3 {
          padding-top: 0px !important;
          padding-bottom: 0px !important;
          margin-top: -8px !important;
        }
      }

      /* Fades for herobanner and latest products section */
      .tpl23-shopify-root .slideshow__background,
      .tpl23-shopify-root custom-slideshow {
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }
      #yaxsell-wholesale-offers-root {
        position: relative !important;
        padding-top: 30px !important;
        padding-bottom: 30px !important;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%) !important;
        mask-image: linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%) !important;
      }
      #yaxsell-latest-products-root {
        position: relative !important;
        padding-top: 40px !important;
        padding-bottom: 40px !important;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%) !important;
        mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%) !important;
      }
    `;
    document.head.appendChild(overrideStyle);

    return () => {
      const st = document.getElementById('tpl23-overrides');
      if (st) st.remove();
      CSS_FILES.forEach(href => {
        const el = document.querySelector(`link[data-tpl23="${href}"]`);
        if (el) el.remove();
      });
    };
  }, []);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/plantilla23/body-clean.html?v=' + Date.now())
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
        console.error('[Plantilla23] Error loading body-clean.html', err);
        setLoadError(err.message || 'Error de carga');
      });
    return () => { aborted = true; };
  }, []);

  /* ── Set innerHTML ONCE via ref ── */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current || !isAppwriteLoaded || !isThemeConfigLoaded) return;
    if (containerRef.current.dataset.htmlSet) return;

    // Parse HTML string to DOM nodes in memory
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bodyHtml;

    // Hydrate Categories
    tempDiv.querySelectorAll('.collection-list-grid').forEach(wrapper => {
      if (categories.length === 0) return;
      const html = categories.slice(0, 10).map((cat: any) => `
        <div class="grid__item scroll-trigger animate--slide-in" data-cascade="" style="--animation-order: 1;" data-cascade-done="1">
          <a href="/colecciones/${cat.slug}" class="card-wrapper w-full block bg-white rounded-xl overflow-hidden" style="-webkit-tap-highlight-color: transparent;">
             <div class="card__inner relative w-full pt-[100%] rounded-xl overflow-hidden">
                <img src="${cat.BACKGROUND_IMAGE_URL || cat.iconUrl || ''}" alt="${cat.name}" class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300">
             </div>
             <div class="card__content pt-3 pb-2 px-1 text-center">
                 <h3 class="card__heading text-[12px] font-semibold text-gray-800 leading-tight">${cat.name}</h3>
             </div>
          </a>
        </div>
      `).join('');
      wrapper.innerHTML = html;
      wrapper.classList.remove('slider');
    });

    // Hydrate Subcategories
    tempDiv.querySelectorAll('.subcategories-pill-list').forEach(wrapper => {
      if (subcategories.length === 0) return;
      const html = subcategories.map((sub: any) => `
        <a href="/colecciones/sub/${sub.slug}" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors" style="-webkit-tap-highlight-color: transparent;">
          ${sub.name}
        </a>
      `).join('');
      wrapper.innerHTML = html;
    });

    // ─── NUEVO: HYDRATE NAV MENUS CON CATEGORÍAS REALES ───
    // Siempre se reconstruyen los menús base (aunque no haya categorías) para que
    // nunca quede visible el menú de la plantilla original.
    {
      // 1. PC Megamenu
      const pcNavUl = tempDiv.querySelector('.menu-wrapper ul[data-tier="1"]')
        || tempDiv.querySelector('ul.menu[data-tier="1"]:not(.menu--drawer)');
      if (pcNavUl) {
        const homeLink = `<li class="inline-block group py-2 px-1 shrink-0 no-keyboard-focus"><a href="/" class="flex items-center no-keyboard-focus" data-menu-tier="1"><span class="link-hover-animation" style="font-weight:600;color:#e396bf">Inicio</span></a></li>`;
        const storeLink = `<li class="inline-block group py-2 px-1 shrink-0 no-keyboard-focus"><a href="/productos" class="flex items-center no-keyboard-focus" data-menu-tier="1"><span class="link-hover-animation" style="font-weight:600;">Tienda</span></a></li>`;
        const packLink = `<li class="inline-block group py-2 px-1 shrink-0 no-keyboard-focus"><a href="/paquetes" class="flex items-center no-keyboard-focus" data-menu-tier="1"><span class="link-hover-animation" style="font-weight:600;">Paquetes</span></a></li>`;
        
        const catLinks = categories.map((cat: any) => `
          <li class="inline-block group py-2 px-1 shrink-0 no-keyboard-focus"><a href="/categoria/${cat.$id}" title="${cat.name}" aria-label="${cat.name}" class="flex items-center no-keyboard-focus" data-menu-tier="1"><span class="link-hover-animation" style="font-weight:500;">${cat.name}</span></a></li>
        `).join('');

        const ordersLink = `<li class="inline-block group py-2 px-1 shrink-0 no-keyboard-focus ml-auto"><a href="/cuenta/pedidos" class="flex items-center no-keyboard-focus" data-menu-tier="1"><span class="link-hover-animation" style="font-weight:600;color:#333">Mis Pedidos</span></a></li>`;
        
        pcNavUl.innerHTML = homeLink + storeLink + packLink + catLinks + ordersLink;
      }

      // 2. Mobile Drawer Menu
      const drawerUl = tempDiv.querySelector('ul.menu--drawer[data-tier="1"]');
      if (drawerUl) {
        const makeDrawerLi = (label: string, href: string, isBold: boolean, color: string = 'inherit') => `
          <li class="group relative border-b border-gray-100 last:border-0"><a href="${href}" class="flex items-center justify-between w-full p-4 link hover-only hover:bg-gray-50"><span class="menu__heading-title ${isBold ? 'font-semibold text-lg' : 'font-medium text-[15px]'} text-gray-800" style="color:${color}">${label}</span></a></li>
        `;

        const homeLi = makeDrawerLi('Inicio', '/', true, '#e396bf');
        const storeLi = makeDrawerLi('Tienda (Unidad)', '/productos', true);
        const packLi = makeDrawerLi('Catálogo Paquetes', '/paquetes', true);
        
        const catHeader = categories.length > 0 ? `<li class="px-4 py-3 text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50">Categorías</li>` : '';
        const catLis = categories.map((cat: any) => makeDrawerLi(cat.name, `/categoria/${cat.$id}`, false)).join('');
        
        const ordersLi = makeDrawerLi('Mis Pedidos', '/cuenta/pedidos', true);
        const loginLi = makeDrawerLi('Mi Cuenta', '/cuenta', true);
        
        drawerUl.innerHTML = homeLi + storeLi + packLi + catHeader + catLis + `<div class="h-2 bg-gray-50"></div>` + ordersLi + loginLi;
      }
    }
    // ────────────────────────────────────────────────────────

    {
      // Find Swiper wrapper inside collection-list
      const swiperWrapper = tempDiv.querySelector('.collection-list .swiper-wrapper');
      const swiperContainer = tempDiv.querySelector('.collection-list .swiper-container');
      if (swiperWrapper) {
        swiperWrapper.innerHTML = ''; // Clear hardcoded slides

        // Sin categorías no hay nada que mostrar: ocultar la sección completa
        if (categories.length === 0) {
          const clSection = swiperWrapper.closest('.shopify-section') as HTMLElement | null;
          if (clSection) clSection.style.setProperty('display', 'none', 'important');
        }

        categories.forEach((cat, index) => {
          const slide = document.createElement('div');
          slide.className = `swiper-slide w-full h-auto animation-delay-${(index + 1) * 100} animation-element fade-in`;

          // Fallback image handling
          const categoryImg = (cat as any).BACKGROUND_IMAGE_URL || cat.iconUrl || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png';

          const cleanName = cat.name.replace(/\s*\(\d+\)$/, '').trim();

          slide.innerHTML = `
  <div class="collection-card overflow-hidden h-full border-current relative w-full fade-in animation-element animation-delay-0">
      <a href="/productos?categoria=${cat.$id}" aria-label="${cleanName}" title="${cleanName}" class="link link-image hover-only block">
          <div class="collection-card__image-wrapper relative overflow-hidden hover-zoom-image-wrapper" data-ratio="square">
              <div class="collection-card__image w-full h-full absolute top-0 left-0 transition-all duration-300 ease-in-out transform img-blur placeholder" style="background-color: #FBCAC9;">
                  <hover-zoom-image class="w-full h-full">
                      <img src="${categoryImg}" alt="${cleanName}" loading="lazy" sizes="100vw" class="object-cover w-full h-full pointer-events-none">
                  </hover-zoom-image>
              </div>
              <div class="overlay absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out"></div>
          </div>
      </a>
      <div class="collection-card__content z-10">
          <a href="/productos?categoria=${cat.$id}" title="${cleanName}" aria-label="${cleanName}" class="transition-all duration-300 ease-in-out h-full w-full link">
              <div class="py-5 pr-2 relative">
                  <h6 class="heading transition-all duration-100 ease-in-out">
                      <span class="link-hover-animation">${cleanName}</span>
                  </h6>
              </div>
          </a>
      </div>
  </div>
          `;
          swiperWrapper.appendChild(slide);
        });
      }

      if (swiperContainer) {
        // Synchronize Swiper total item count
        swiperContainer.setAttribute('data-items-total', String(categories.length));
      }
    }



    // Populate the global pack timed offers carousel / grid
    const carouselPlaceholder = tempDiv.querySelector('#yaxsell-homepage-offers-carousel');
    if (carouselPlaceholder && timedOffers.length > 0) {
      const cardsHtml = timedOffers.map(offer => {
        const originalPrice = formatPrice(offer.originalPrice);
        const discountPrice = formatPrice(offer.discountPrice);
        const discountPercentage = offer.discountPercentage;
        const productName = offer.productName;
        const imgUrl = offer.customImagePath || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png';
        const targetUrl = offer.targetId ? `/productos/${offer.targetId}` : '#';

        return `
          <div style="background: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); padding: 16px; width: calc(50% - 10px); display: flex; flex-direction: column; gap: 12px; transition: border-color 0.3s ease; box-sizing: border-box; border: 1px solid #f3f4f6;" class="offer-card-hover hover:border-gray-300">
            <a href="${targetUrl}" style="text-decoration: none; color: inherit; display: block; position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #fdf2f8;">
              <img src="${imgUrl}" alt="${productName}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; top: 8px; left: 8px; background: #ef4444; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 8px;">
                -${discountPercentage}%
              </div>
            </a>
            <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
              <a href="${targetUrl}" style="text-decoration: none; color: #1f2937; font-size: 13px; font-weight: 700; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">
                ${productName}
              </a>
              <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 4px;">
                <span style="font-size: 16px; font-weight: 800; color: #db2777;">${discountPrice}</span>
                <span style="font-size: 12px; color: #9ca3af; text-decoration: line-through;">${originalPrice}</span>
              </div>
            </div>
            <a href="${targetUrl}" style="text-decoration: none; display: block; text-align: center; background: #db2777; color: #ffffff; font-size: 12px; font-weight: 800; padding: 10px 14px; border-radius: 12px; margin-top: auto; transition: background 0.2s ease;">
              Ver Oferta
            </a>
          </div>
        `;
      }).join('');

      carouselPlaceholder.innerHTML = `
        <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 1200px; margin-bottom: 30px; padding: 0 10px; box-sizing: border-box;">
          ${cardsHtml}
        </div>
        <a href="/productos?ofertas=true" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; background: #ffffff; border: 2px solid #db2777; color: #db2777; font-size: 14px; font-weight: 800; padding: 12px 30px; border-radius: 999px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(219, 39, 119, 0.1);" class="ver-ofertas-btn">
          Ver todas las ofertas
        </a>
      `;
    }

    // Insert Live Shopping, Wholesale Offers and Latest Products placeholders right after the Hero banner (slideshow)
    const heroBannerSection = tempDiv.querySelector('#shopify-section-template--27304712470809__slideshow_FBfKC8');
    if (heroBannerSection) {
      // Move the "Oferta de Apertura" countdown timer to hide it (it's display:none already)
      const countdownSection = tempDiv.querySelector('[id*="countdown_timer\"]') as HTMLElement | null;
      if (countdownSection) {
        countdownSection.style.display = 'none';
      }

      // ORDEN DESEADO: Hero → Explora Nuestras Marcas → Mega Pack → (Novedades / carrusel / etc.)
      // Insertamos en orden INVERSO después del hero (cada insertAdjacentElement 'afterend' empuja al siguiente)
      let anchor: Element = heroBannerSection;

      // 1. Primero: Explora Nuestras Marcas (media_columns_slider)
      const exploraSection = tempDiv.querySelector('#shopify-section-template--27304712470809__media_columns_slider_zMFEzH') as HTMLElement | null;
      if (exploraSection) {
        anchor.insertAdjacentElement('afterend', exploraSection);
        anchor = exploraSection;
      }

      // 2. Segundo: Mega Pack (bundle_products)
      const bundleSection = tempDiv.querySelector('#shopify-section-template--27304712470809__bundle_products_3zgi3T') as HTMLElement | null;
      if (bundleSection) {
        anchor.insertAdjacentElement('afterend', bundleSection);
        anchor = bundleSection;
      }

      // 3. Después del Mega Pack van todos los roots dinámicos de React
      const offersCarouselRoot = document.createElement('div');
      offersCarouselRoot.id = 'yaxsell-offers-carousel-root';
      anchor.insertAdjacentElement('afterend', offersCarouselRoot);

      const liveShoppingRoot = document.createElement('div');
      liveShoppingRoot.id = 'yaxsell-live-shopping-root';
      offersCarouselRoot.insertAdjacentElement('afterend', liveShoppingRoot);

      const wholesaleOffersRoot = document.createElement('div');
      wholesaleOffersRoot.id = 'yaxsell-wholesale-offers-root';
      liveShoppingRoot.insertAdjacentElement('afterend', wholesaleOffersRoot);

      const latestProductsRoot = document.createElement('div');
      latestProductsRoot.id = 'yaxsell-latest-products-root';
      wholesaleOffersRoot.insertAdjacentElement('afterend', latestProductsRoot);
    }


    // Clear mockup product listings to prevent flashing native Shopify products (but keep container elements for hydration selectors)
    tempDiv.querySelectorAll('.featured-collection__products').forEach(section => {
      const firstWrapper = section.querySelector('.featured-collection__first-product-wrapper');
      if (firstWrapper) firstWrapper.innerHTML = '';
      const swiperWrapper = section.querySelector('.featured-collection__product-by-collection .swiper-wrapper');
      if (swiperWrapper) swiperWrapper.innerHTML = '';
    });
    tempDiv.querySelectorAll('.product-columns-block .swiper-container .swiper-wrapper, product-columns .swiper-container .swiper-wrapper').forEach(wrapper => {
      wrapper.innerHTML = '';
    });
    // No vaciar el esqueleto de featured-product (la hidratación lo necesita para
    // rellenar título/precio/imagen). Se oculta la sección hasta que haya producto real.
    tempDiv.querySelectorAll('featured-product').forEach(block => {
      const section = (block.closest('.shopify-section') || block) as HTMLElement;
      section.style.setProperty('display', 'none', 'important');
    });

    // Replace background image in bundle products section + add pink particles
    const bgDiv = tempDiv.querySelector('.bundle-products__background');
    if (bgDiv) {
      bgDiv.innerHTML = `
        <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1782341290873-pegada-1782341289319.png" alt="Background image" loading="lazy" sizes="100vw" class="object-cover w-full h-full hidden lg:block pointer-events-none rounded-3xl" />
        <img src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1782341581947-pegada-1782341580104.png" alt="Background image" loading="lazy" sizes="100vw" class="object-cover w-full h-full lg:hidden block pointer-events-none rounded-3xl" />
        <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:1.5rem;z-index:5;">
          <div style="position:absolute;top:8%;left:12%;width:8px;height:8px;background:#fbcfe8;border-radius:50%;box-shadow:0 0 12px #f9a8d4;animation:bp-float1 4s ease-in-out infinite;"></div>
          <div style="position:absolute;top:22%;right:15%;width:12px;height:12px;background:#f5a8cf;border-radius:50%;box-shadow:0 0 16px #f9a8d4;animation:bp-float2 5.5s ease-in-out infinite;animation-delay:0.8s;"></div>
          <div style="position:absolute;bottom:18%;left:20%;width:6px;height:6px;background:#fbcfe8;border-radius:50%;box-shadow:0 0 10px #f9a8d4;animation:bp-float3 3.5s ease-in-out infinite;animation-delay:1.5s;"></div>
          <div style="position:absolute;top:45%;left:8%;width:10px;height:10px;background:#e396bf;border-radius:50%;box-shadow:0 0 14px #f9a8d4;animation:bp-float1 6s ease-in-out infinite;animation-delay:2s;"></div>
          <div style="position:absolute;bottom:30%;right:10%;width:7px;height:7px;background:#fbcfe8;border-radius:50%;box-shadow:0 0 11px #f9a8d4;animation:bp-float2 4.8s ease-in-out infinite;animation-delay:0.3s;"></div>
          <div style="position:absolute;top:60%;right:25%;width:9px;height:9px;background:#f5a8cf;border-radius:50%;box-shadow:0 0 13px #f9a8d4;animation:bp-float3 5.2s ease-in-out infinite;animation-delay:1.2s;"></div>
          <div style="position:absolute;top:15%;left:40%;width:5px;height:5px;background:#fff;border-radius:50%;box-shadow:0 0 8px #fbcfe8;animation:bp-float1 3.8s ease-in-out infinite;animation-delay:2.5s;"></div>
          <div style="position:absolute;bottom:10%;left:55%;width:11px;height:11px;background:#e396bf;border-radius:50%;box-shadow:0 0 15px #f9a8d4;animation:bp-float2 6.5s ease-in-out infinite;animation-delay:1.8s;"></div>
        </div>
        <style>
          @keyframes bp-float1 { 0%,100%{transform:translateY(0) scale(1);opacity:0.7;} 50%{transform:translateY(-20px) scale(1.3);opacity:1;} }
          @keyframes bp-float2 { 0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:0.6;} 50%{transform:translateY(-15px) translateX(10px) scale(1.2);opacity:0.9;} }
          @keyframes bp-float3 { 0%,100%{transform:translateY(0) scale(1);opacity:0.5;} 50%{transform:translateY(-25px) scale(1.4);opacity:0.8;} }
          @media (max-width:1023px){
            div[style*="bp-float"]{transform:scale(0.7)!important;}
          }
        </style>
      `;
    }

    // Translate "Bundle & save (15%)" to Spanish and update percentage
    const saveLabel = tempDiv.querySelector('.section-bundle-products .item-total-price--save .label');
    if (saveLabel) {
      saveLabel.textContent = 'Ahorra con el Pack (37%):';
    }

    // Hydrate bundle products with the 12 selected products
    const bundleTitle = tempDiv.querySelector('.section-bundle-products .bundle-products__product-list h2 span');
    if (bundleTitle) {
      bundleTitle.textContent = 'Mega Pack Favoritos (10 Productos · 15 Unidades)';
    }

    const bundleListWrapper = tempDiv.querySelector('.section-bundle-products .bundle-products__product-list ul');
    if (bundleListWrapper) {
      const bundleHtml = BUNDLE_PACK_PRODUCTS.map(p => {
        const qty = p.quantity || 1;
        const lineTotal = p.PRICE * qty;
        const bundleUnitPrice = p.bundleUnitPrice || 0;
        const bundleLineTotal = bundleUnitPrice * qty;
        const lineSavings = lineTotal - bundleLineTotal;
        const lineDiscountPct = Math.round((lineSavings / lineTotal) * 100);
        return `
        <li class="product-list__product-info flex gap-3 py-5 flex-wrap border-b-1 border-current/10" data-product-id="${p.$id}">
          <div class="flex-1 w-full min-w-[min(20vw,150px)] max-w-[min(20vw,150px)] lg:min-w-[min(10vw,150px)] lg:max-w-[min(10vw,150px)]">
            <div aria-label="${p.NAME}" title="${p.NAME}" class="flex-1 w-full min-w-[min(20vw,150px)] max-w-[min(20vw,150px)] lg:min-w-[min(10vw,150px)] lg:max-w-[min(10vw,150px)] cursor-default" tabindex="-1">
              <div class="product-list__product-image-wrapper w-full pt-[100%] relative hover-zoom-image-wrapper" style="position:relative;">
                <div class="product-list__product-image placeholder absolute w-full h-full top-0 left-0">
                  <hover-zoom-image class="w-full h-full">
                    <img src="${p.IMAGEURL}" alt="${p.NAME}" loading="lazy" class="object-cover w-full h-full pointer-events-none" />
                  </hover-zoom-image>
                </div>
              </div>
            </div>
          </div>
          <div class="product-list__product-content py-3">
            <div aria-label="${p.NAME}" title="${p.NAME}" class="block max-w-max cursor-default">
              <h3 class="heading pt-2 pb-1 h6 max-w-max"><span>${p.NAME}</span></h3>
              <span class="text-[0.75em] text-current/50 font-medium">SKU: ${p.SKU || 'N/A'}${qty > 1 ? ` &middot; x${qty}` : ''}</span>
            </div>
            <div class="variant pb-2 text-current/70" data-loading="false">
              <div class="flex gap-[5px] items-center justify-between pr-2">
                <span class="text-[0.9em]">Precio Unitario</span>
              </div>
              <form method="post" action="/cart/add" id="product-form-bundle-${p.$id}" accept-charset="UTF-8" class="shopify-product-form" enctype="multipart/form-data">
                <input type="hidden" name="form_type" value="product" />
                <input type="hidden" name="id" value="${p.$id}">
                <input type="hidden" name="quantity" value="${qty}" min="1">
                <div class="error text-[0.8em]" role="alert"><small></small></div>
              </form>
            </div>
            <div class="price flex gap-[5px] flex-wrap items-center">
              <div class="price__regular">
                <span class="price-item" style="text-decoration: line-through; color: #9ca3af; font-size: 0.85em;">$${p.PRICE.toLocaleString()} CLP${qty > 1 ? ` &times; ${qty}` : ''}</span>
              </div>
              <div class="price__sale" style="display:flex; align-items:center; gap:6px;">
                <span class="price-item price-item--sale" style="font-weight:800; color:#db2777; font-size:1.05em;">$${bundleLineTotal.toLocaleString()} CLP</span>
                <span style="background:#db2777; color:#fff; font-size:0.7em; font-weight:800; padding:2px 8px; border-radius:999px; line-height:1.2;">-${lineDiscountPct}%</span>
              </div>
              <div style="width:100%; margin-top:2px;">
                <span style="font-size:0.75em; color:#10b981; font-weight:700;">Ahorras $${lineSavings.toLocaleString()} CLP</span>
              </div>
            </div>
          </div>
        </li>
      `;}).join('');
      bundleListWrapper.innerHTML = bundleHtml;
    }

    // Update bundle prices data script and total labels
    const bundleDataScript = tempDiv.querySelector('.section-bundle-products .bundle-products__products-data');
    if (bundleDataScript) {
      const bundleData = {
        products: BUNDLE_PACK_PRODUCTS.map(p => ({ id: p.$id, price: p.PRICE * (p.quantity || 1), available: true })),
        total_price: 15990,
        saving_percentage: 37
      };
      bundleDataScript.innerHTML = JSON.stringify(bundleData);
    }

    const subtotalEl = tempDiv.querySelector('.section-bundle-products .item-total-price--subtotal .value') as HTMLElement | null;
    if (subtotalEl) {
      subtotalEl.textContent = '$25.300 CLP';
      subtotalEl.style.fontWeight = '700';
    }
    const saveEl = tempDiv.querySelector('.section-bundle-products .item-total-price--save .value') as HTMLElement | null;
    if (saveEl) {
      saveEl.textContent = '$9.310 CLP (37%)';
      saveEl.style.color = '#db2777';
      saveEl.style.fontWeight = '800';
    }
    const totalEl = tempDiv.querySelector('.section-bundle-products .item-total-price--total .value') as HTMLElement | null;
    if (totalEl) {
      totalEl.textContent = '$15.990 CLP';
      totalEl.style.fontWeight = '800';
      totalEl.style.fontSize = '1.3em';
      totalEl.style.color = '#db2777';
    }

    containerRef.current.innerHTML = tempDiv.innerHTML;
    containerRef.current.dataset.htmlSet = '1';
    setHtmlInjected(true);

    // ── FORZAR ORDEN EN EL DOM REAL (después de inyectar innerHTML) ──
    // Movemos las secciones directamente en el DOM ya renderizado,
    // sin depender del orden de tempDiv ni de ninguna caché.
    {
      const realHero = containerRef.current.querySelector('#shopify-section-template--27304712470809__slideshow_FBfKC8');
      const realExplora = containerRef.current.querySelector('#shopify-section-template--27304712470809__media_columns_slider_zMFEzH');
      const realBundle = containerRef.current.querySelector('#shopify-section-template--27304712470809__bundle_products_3zgi3T');
      if (realHero) {
        // Insertar Explora justo después del hero
        if (realExplora) realHero.insertAdjacentElement('afterend', realExplora);
        // Insertar Bundle después de Explora (o después del hero si Explora no existe)
        const afterExplora = realExplora ?? realHero;
        if (realBundle) afterExplora.insertAdjacentElement('afterend', realBundle);
      }
    }


    // Setup Click listener to Bundle buy button
    const bundleCartBtn = containerRef.current.querySelector('.section-bundle-products .button-cart');
    if (bundleCartBtn) {
      bundleCartBtn.classList.remove('disabled', 'pointer-events-none');
      const texts = bundleCartBtn.querySelectorAll('.link-hover-animation');
      texts.forEach(t => t.textContent = 'Añadir Pack al Carrito ($15.990)');
      
      // Clone it to strip native Shopify listeners
      const clonedBtn = bundleCartBtn.cloneNode(true);
      bundleCartBtn.parentNode?.replaceChild(clonedBtn, bundleCartBtn);
      
      clonedBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add the bundle as a single product (la caja)
        const BUNDLE_PRODUCT: Product = {
          $id: '6a4d2d0f0006e27d56f6',
          NAME: 'Mega Pack Favoritos (10 Productos · 15 Unidades)',
          DESCRIPTION: 'Base Raspberry Tart + Iluminadores + Polvo Suelto + Paleta 4 Rubores + Corrector + Paleta Sombras Ghost Music + Toallitas + Brocha + Brillos Labial 6 Colores x3 + Brillos Love Color x4',
          PRICE: 15990,
          STOCK: 100,
          IMAGEURL: 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1783031423674-pegada-1783031416170.png',
          CATEGORYID: '',
          SELLERID: '',
          SKU: 'PROMO1',
        };
        addItem(BUNDLE_PRODUCT, 1);
        
        // Open the Cart drawer
        const cartDrawer = document.querySelector('cart-drawer');
        if (cartDrawer) {
          cartDrawer.setAttribute('data-hidden', 'false');
          cartDrawer.removeAttribute('inert');
          document.body.classList.add('cart-drawer-open', 'overflow-hidden');
        }
      });
    }

    // ═══ CUSTOM HERO CONFIG OVERRIDES (MANUAL DESDE CÓDIGO) ═══
    
    // 1. Desktop Image override
    if (MANUAL_HERO_CONFIG.hero1.desktopImg) {
      const vidDesktop = containerRef.current.querySelector('#hero1-video-desktop') as HTMLVideoElement | null;
      if (vidDesktop) {
        vidDesktop.style.display = 'none'; // Ocultar video por defecto
        let customImg = containerRef.current.querySelector('#hero1-custom-img-desktop') as HTMLImageElement;
        if (!customImg) {
          customImg = document.createElement('img');
          customImg.id = 'hero1-custom-img-desktop';
          customImg.className = vidDesktop.className;
          customImg.style.opacity = '1';
          vidDesktop.parentElement?.insertBefore(customImg, vidDesktop);
        }
        customImg.src = MANUAL_HERO_CONFIG.hero1.desktopImg;
      }
    }

    // 2. Mobile Image override
    if (MANUAL_HERO_CONFIG.hero1.mobileImg) {
      const vidMobile = containerRef.current.querySelector('#hero1-video-mobile') as HTMLVideoElement | null;
      if (vidMobile) {
        vidMobile.style.display = 'none'; // Ocultar video por defecto
        let customImg = containerRef.current.querySelector('#hero1-custom-img-mobile') as HTMLImageElement;
        if (!customImg) {
          customImg = document.createElement('img');
          customImg.id = 'hero1-custom-img-mobile';
          customImg.className = vidMobile.className;
          customImg.style.opacity = '1';
          vidMobile.parentElement?.insertBefore(customImg, vidMobile);
        }
        customImg.src = MANUAL_HERO_CONFIG.hero1.mobileImg;
      }
    }

    // 3. Text & Button override
    if (MANUAL_HERO_CONFIG.hero1.title) {
      const headingSpan = containerRef.current.querySelector('giant-heading h2 span.leading-none');
      if (headingSpan) headingSpan.textContent = MANUAL_HERO_CONFIG.hero1.title;
    }
    if (MANUAL_HERO_CONFIG.hero1.btnText) {
      const splitHero = containerRef.current.querySelector('split-hero');
      if (splitHero) {
        const btn = splitHero.querySelector('a.button--primary');
        if (btn) {
           btn.textContent = MANUAL_HERO_CONFIG.hero1.btnText;
           if (MANUAL_HERO_CONFIG.hero1.btnLink) {
             (btn as HTMLAnchorElement).href = MANUAL_HERO_CONFIG.hero1.btnLink;
           }
        }
      }
    }

    // 🎞️ Hero Banner: carrusel de 3 imágenes (fade) controlado por JS propio — sin Swiper.
    // Maneja crossfade, autoplay (5s), flechas y puntos. El overlay de "Kenia" fue removido:
    // el hero rota SOLO entre las 3 imágenes.
    try {
      const heroSec = containerRef.current.querySelector('[data-id="template--27304712470809__slideshow_FBfKC8"]') as HTMLElement | null;
      const heroBg = heroSec?.querySelector('.slideshow__background') as HTMLElement | null;
      if (heroBg && !heroBg.dataset.heroCarouselBound) {
        heroBg.dataset.heroCarouselBound = '1';
        heroBg.style.position = heroBg.style.position || 'relative';

        // Add hidden dummy images to force the container height to match the image aspect ratio
        let dummyStyle = heroBg.querySelector('#dummy-style');
        if (!dummyStyle) {
          dummyStyle = document.createElement('style');
          dummyStyle.id = 'dummy-style';
          dummyStyle.textContent = `
            @media (max-width: 1023px) { .dummy-desk { display: none !important; } .dummy-mob { display: block !important; } }
            @media (min-width: 1024px) { .dummy-desk { display: block !important; } .dummy-mob { display: none !important; } }
          `;
          heroBg.appendChild(dummyStyle);
        }

        if (MANUAL_HERO_CONFIG.hero1.desktopImg) {
          let dummyDesk = heroBg.querySelector('.dummy-desk') as HTMLImageElement;
          if (!dummyDesk) {
            dummyDesk = document.createElement('img');
            dummyDesk.className = 'dummy-desk';
            dummyDesk.style.cssText = 'visibility:hidden; width:100%; height:auto; position:relative; pointer-events:none; margin:0; padding:0;';
            heroBg.appendChild(dummyDesk);
          }
          dummyDesk.src = MANUAL_HERO_CONFIG.hero1.desktopImg;
        }

        if (MANUAL_HERO_CONFIG.hero1.mobileImg) {
          let dummyMob = heroBg.querySelector('.dummy-mob') as HTMLImageElement;
          if (!dummyMob) {
            dummyMob = document.createElement('img');
            dummyMob.className = 'dummy-mob';
            dummyMob.style.cssText = 'visibility:hidden; width:100%; height:auto; position:relative; pointer-events:none; margin:0; padding:0;';
            heroBg.appendChild(dummyMob);
          }
          dummyMob.src = MANUAL_HERO_CONFIG.hero1.mobileImg;
        }

        // Las dos pistas (PC/móvil); solo una está visible a la vez vía CSS.
        const carousels = Array.from(heroBg.querySelectorAll('.hero-carousel')) as HTMLElement[];
        const slidesByCarousel = carousels.map(c => Array.from(c.querySelectorAll('.hero-slide')) as HTMLElement[]);
        const total = slidesByCarousel[0]?.length || 0;

        // Actualizar fondos de portada directamente desde MANUAL_HERO_CONFIG
        if (slidesByCarousel.length >= 2) {
          const deskSlides = slidesByCarousel[0];
          const mobSlides = slidesByCarousel[1];
          
          if (deskSlides[0] && MANUAL_HERO_CONFIG.hero1.desktopImg) deskSlides[0].style.backgroundImage = `url('${MANUAL_HERO_CONFIG.hero1.desktopImg}')`;
          if (mobSlides[0] && MANUAL_HERO_CONFIG.hero1.mobileImg) mobSlides[0].style.backgroundImage = `url('${MANUAL_HERO_CONFIG.hero1.mobileImg}')`;
          
          if (deskSlides[1] && MANUAL_HERO_CONFIG.hero2.desktopImg) deskSlides[1].style.backgroundImage = `url('${MANUAL_HERO_CONFIG.hero2.desktopImg}')`;
          if (mobSlides[1] && MANUAL_HERO_CONFIG.hero2.mobileImg) mobSlides[1].style.backgroundImage = `url('${MANUAL_HERO_CONFIG.hero2.mobileImg}')`;
          
          if (deskSlides[2] && MANUAL_HERO_CONFIG.hero3.desktopImg) deskSlides[2].style.backgroundImage = `url('${MANUAL_HERO_CONFIG.hero3.desktopImg}')`;
          if (mobSlides[2] && MANUAL_HERO_CONFIG.hero3.mobileImg) mobSlides[2].style.backgroundImage = `url('${MANUAL_HERO_CONFIG.hero3.mobileImg}')`;
        }

        if (total > 1) {
          let idx = 0;
          let timer = 0;
          const dots: HTMLButtonElement[] = [];

          const render = () => {
            slidesByCarousel.forEach(slides => {
              slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
            });
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
          };
          const goTo = (i: number) => { idx = ((i % total) + total) % total; render(); };
          const restart = () => {
            // Autoplay deshabilitado por solicitud del usuario
            // window.clearInterval(timer);
            // timer = window.setInterval(() => goTo(idx + 1), 5000);
          };

          // Puntos
          const dotsWrap = document.createElement('div');
          dotsWrap.className = 'hero-dots';
          for (let i = 0; i < total; i++) {
            const d = document.createElement('button');
            d.type = 'button';
            d.className = 'hero-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Ir a la portada ' + (i + 1));
            d.onclick = (e) => { e.preventDefault(); e.stopPropagation(); goTo(i); restart(); };
            dots.push(d);
            dotsWrap.appendChild(d);
          }
          heroBg.appendChild(dotsWrap);

          // Flechas
          const mkArrow = (cls: string, label: string, path: string, delta: number) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'hero-nav ' + cls;
            b.setAttribute('aria-label', label);
            b.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${path}"/></svg>`;
            b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); goTo(idx + delta); restart(); };
            return b;
          };
          heroBg.appendChild(mkArrow('hero-prev', 'Portada anterior', '15 18 9 12 15 6', -1));
          heroBg.appendChild(mkArrow('hero-next', 'Portada siguiente', '9 18 15 12 9 6', 1));

          render();
          restart(); // autoplay cada 5s
        }
      }

      // Temporizador removido a petición del usuario.
    } catch (e) { console.error('[TPL23] Hero carousel error', e); }

    // 🧭 Header/drawer móvil: (1) eliminar "COMPRA DESDE: UNIDAD/PAQUETE" del header,
    // (2) subir lupa + carrito a la fila de la hamburguesa, y (3) en el drawer izquierdo
    // reemplazar "TIENDA" por UNIDAD (/productos) y PAQUETE (/paquetes).
    // El header y el menú del drawer se terminan de poblar (categorías con contador)
    // DESPUÉS de inyectar el HTML, así que aplicamos los cambios con un polling
    // idempotente hasta que el contenido esté listo (o se agote el tiempo).
    const applyMobileHeaderDrawer = (): boolean => {
      const root = containerRef.current;
      if (!root) return true;
      let done = true;
      try {
        // (1) Eliminar SOLO la columna "COMPRA DESDE" (texto que EMPIEZA con ella y sin
        //     hamburguesa dentro, para no borrar el header completo). Idempotente.
        root.querySelectorAll('.flex.flex-col').forEach(c => {
          const el = c as HTMLElement;
          if (/^COMPRA\s*DESDE/i.test((el.textContent || '').trim())
            && !el.querySelector('.menu-hamburger-button, #button-mobile-menu-drawer')) {
            el.remove();
          }
        });

        // (2) Subir lupa + carrito a la fila de la hamburguesa.
        const burger = root.querySelector('#button-mobile-menu-drawer') as HTMLElement | null;
        if (burger) {
          const burgerWrap = burger.parentElement as HTMLElement | null;
          if (burgerWrap && !burgerWrap.dataset.iconsMoved) {
            const headerRow = burger.closest('.flex.justify-between') as HTMLElement | null;
            const iconsBar = headerRow
              ? ([...headerRow.children].find(c => c.classList.contains('w-full') && c.classList.contains('lg:hidden')) as HTMLElement | undefined)
              : undefined;
            const search = iconsBar?.querySelector('.search-icon') as HTMLElement | null;
            const cart = iconsBar?.querySelector('.cart-icon') as HTMLElement | null;
            if (iconsBar && search && cart) {
              burgerWrap.dataset.iconsMoved = '1';
              burgerWrap.style.width = '100%';
              burgerWrap.style.display = 'flex';
              burgerWrap.style.alignItems = 'center';
              burgerWrap.style.justifyContent = 'space-between';
              const grp = document.createElement('div');
              grp.style.cssText = 'display:flex;align-items:center;gap:8px;';
              grp.appendChild(search);
              grp.appendChild(cart);
              burgerWrap.appendChild(grp);
              iconsBar.style.display = 'none';
            } else {
              done = false; // aún no están los iconos
            }
          }
        } else {
          done = false; // aún no está la hamburguesa
        }

        // (3) Drawer logic is now handled during initial HTML hydration above.
        // We just mark it as done.
        const drawerUl = root.querySelector('#mobile-menu-drawer ul.menu--drawer') as HTMLElement | null;
        if (!drawerUl) {
          done = false;
        }
      } catch (e) { console.error('[TPL23] header/drawer móvil error', e); }
      return done;
    };
    {
      let hdTries = 0;
      const hdTimer = window.setInterval(() => {
        hdTries++;
        if (applyMobileHeaderDrawer() || hdTries > 25) window.clearInterval(hdTimer);
      }, 400);
      applyMobileHeaderDrawer();
    }

    // ✨ Hero Banner — Premium Particle System (lag-free via pre-rendered textures)
    const heroParticlesCanvas = containerRef.current.querySelector('#yaxsell-hero-particles') as HTMLCanvasElement;
    if (heroParticlesCanvas && !heroParticlesCanvas.dataset.particlesBound) {
      heroParticlesCanvas.dataset.particlesBound = '1';
      const heroParent = heroParticlesCanvas.parentElement as HTMLElement;
      if (heroParent) {
        const pDpr = Math.min(window.devicePixelRatio || 1, 2);
        const pCtx = heroParticlesCanvas.getContext('2d');
        if (pCtx) {
          let pw = 0, ph = 0, pAnimId = 0;
          let pmx = -9999, pmy = -9999;
          const pMobile = window.innerWidth < 768;

          const pResize = () => {
            const r = heroParent.getBoundingClientRect();
            pw = r.width; ph = r.height;
            heroParticlesCanvas.width = pw * pDpr;
            heroParticlesCanvas.height = ph * pDpr;
            pCtx.setTransform(pDpr, 0, 0, pDpr, 0, 0);
          };
          pResize();
          const pRo = new ResizeObserver(pResize);
          pRo.observe(heroParent);

          const makeGlow = (r: number, g: number, b: number, radius: number) => {
            const s = Math.ceil(radius * 4);
            const off = document.createElement('canvas');
            off.width = s; off.height = s;
            const c = off.getContext('2d')!;
            const gr = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
            gr.addColorStop(0, `rgba(${r},${g},${b},1)`);
            gr.addColorStop(0.25, `rgba(${r},${g},${b},0.35)`);
            gr.addColorStop(0.6, `rgba(${r},${g},${b},0.08)`);
            gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
            c.fillStyle = gr;
            c.fillRect(0, 0, s, s);
            return off;
          };

          const PTEX = [
            makeGlow(255, 255, 255, 12),
            makeGlow(251, 202, 201, 14),
            makeGlow(244, 114, 182, 10),
            makeGlow(255, 223, 186, 9),
            makeGlow(251, 207, 232, 16),
            makeGlow(255, 255, 255, 6),
          ];

          const PCOUNT = pMobile ? 30 : 55;

          const mkP = (init: boolean) => {
            const depth = Math.random();
            const baseSize = 1.5 + depth * 5.5;
            const speed = 0.12 + (1 - depth) * 0.3;
            return {
              x: Math.random() * pw,
              y: init ? Math.random() * ph : ph + Math.random() * 60,
              vx: (Math.random() - 0.5) * 0.25,
              vy: -(speed + Math.random() * 0.15),
              size: baseSize, baseSize,
              opacity: 0,
              baseOpacity: 0.12 + depth * 0.48,
              tex: Math.floor(Math.random() * PTEX.length),
              phase: Math.random() * Math.PI * 2,
              phaseSpd: 0.004 + Math.random() * 0.012,
              sparkle: Math.random() * Math.PI * 2,
              sparkleSpd: 0.018 + Math.random() * 0.055,
              depth,
              wobbleAmp: 0.25 + Math.random() * 0.7,
              life: init ? Math.floor(Math.random() * 500) : 0,
              maxLife: 350 + Math.floor(Math.random() * 350),
            };
          };

          const pts = Array.from({ length: PCOUNT }, () => mkP(true));

          let star: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; trail: { x: number; y: number }[] } | null = null;
          let starCooldown = 200 + Math.floor(Math.random() * 300);

          const onPMove = (e: MouseEvent) => {
            const r = heroParent.getBoundingClientRect();
            pmx = e.clientX - r.left; pmy = e.clientY - r.top;
          };
          const onPLeave = () => { pmx = -9999; pmy = -9999; };
          heroParent.addEventListener('mousemove', onPMove);
          heroParent.addEventListener('mouseleave', onPLeave);

          const pLoop = () => {
            pCtx.clearRect(0, 0, pw, ph);

            for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              p.life++;
              const fadeIn = Math.min(p.life / 50, 1);
              const fadeOut = p.life > p.maxLife - 50 ? (p.maxLife - p.life) / 50 : 1;
              p.sparkle += p.sparkleSpd;
              const sp = 0.5 + 0.5 * Math.sin(p.sparkle);
              p.phase += p.phaseSpd;
              p.x += p.vx + Math.sin(p.phase * p.wobbleAmp * 8) * 0.06;
              p.y += p.vy;

              const dx = p.x - pmx, dy = p.y - pmy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const rr = 70 + p.depth * 35;
              if (dist < rr && dist > 0) {
                const f = ((rr - dist) / rr) * (0.4 + p.depth * 0.4);
                p.x += (dx / dist) * f * 1.8;
                p.y += (dy / dist) * f * 1.8;
              }

              p.opacity = p.baseOpacity * fadeIn * fadeOut * (0.35 + sp * 0.65);
              p.size = p.baseSize * (0.82 + sp * 0.36);

              if (p.y < -25 || p.x < -25 || p.x > pw + 25 || p.life >= p.maxLife) {
                Object.assign(p, mkP(false));
                p.x = Math.random() * pw;
                continue;
              }
              if (p.opacity < 0.015) continue;

              const tex = PTEX[p.tex];
              const ds = p.size * 4;
              pCtx.globalAlpha = p.opacity;
              pCtx.drawImage(tex, p.x - ds / 2, p.y - ds / 2, ds, ds);
            }

            if (!star) {
              starCooldown--;
              if (starCooldown <= 0 && !pMobile) {
                const fromLeft = Math.random() > 0.5;
                star = {
                  x: fromLeft ? -10 : pw + 10,
                  y: Math.random() * ph * 0.5,
                  vx: (fromLeft ? 1 : -1) * (3 + Math.random() * 3),
                  vy: 1.5 + Math.random() * 2,
                  life: 0, maxLife: 60 + Math.floor(Math.random() * 40), trail: [],
                };
                starCooldown = 400 + Math.floor(Math.random() * 500);
              }
            }
            if (star) {
              star.x += star.vx; star.y += star.vy; star.life++;
              star.trail.push({ x: star.x, y: star.y });
              if (star.trail.length > 18) star.trail.shift();
              const sFade = star.life > star.maxLife - 15 ? (star.maxLife - star.life) / 15 : Math.min(star.life / 8, 1);
              for (let t = 0; t < star.trail.length; t++) {
                const tp = star.trail[t];
                const tAlpha = (t / star.trail.length) * 0.5 * sFade;
                const tSize = 1.5 + (t / star.trail.length) * 2.5;
                pCtx.globalAlpha = tAlpha;
                pCtx.drawImage(PTEX[0], tp.x - tSize * 2, tp.y - tSize * 2, tSize * 4, tSize * 4);
              }
              pCtx.globalAlpha = 0.9 * sFade;
              pCtx.drawImage(PTEX[0], star.x - 10, star.y - 10, 20, 20);
              if (star.life >= star.maxLife || star.x < -50 || star.x > pw + 50 || star.y > ph + 50) star = null;
            }

            pCtx.globalAlpha = 1;
            pAnimId = requestAnimationFrame(pLoop);
          };
          pAnimId = requestAnimationFrame(pLoop);

          // Store cleanup refs on canvas element for unmount
          (heroParticlesCanvas as any)._particleCleanup = () => {
            cancelAnimationFrame(pAnimId);
            pRo.disconnect();
            heroParent.removeEventListener('mousemove', onPMove);
            heroParent.removeEventListener('mouseleave', onPLeave);
          };
        }
      }
    }

    const offersCarouselEl = document.getElementById('yaxsell-offers-carousel-root');
    if (offersCarouselEl) {
      setOffersCarouselContainer(offersCarouselEl);
    }

    const wholesaleOffersEl = document.getElementById('yaxsell-wholesale-offers-root');
    if (wholesaleOffersEl) {
      setWholesaleOffersContainer(wholesaleOffersEl);
    }

    const latestProductsEl = document.getElementById('yaxsell-latest-products-root');
    if (latestProductsEl) {
      setLatestProductsContainer(latestProductsEl);
    }


    // Remove leftover Shopify elements
    const root = containerRef.current;
    root.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());

    // ═══ MutationObserver: remove filter:blur(0px) that Shopify scripts re-add ═══
    // filter:blur(0) creates a new stacking context → breaks position:fixed → white flash
    // Must observe on document.body too, not just root, because Shopify scripts add
    // filter:blur(0px) to ANCESTOR elements (main, div wrappers) outside our container
    const removeBlurFilter = (el: HTMLElement) => {
      if (el.style && el.style.filter && el.style.filter.includes('blur(0')) {
        el.style.removeProperty('filter');
      }
    };
    const blurObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const el = mutation.target as HTMLElement;
        removeBlurFilter(el);
      }
    });
    // Observe both the container root AND document.body for filter changes
    blurObserver.observe(root, { attributes: true, subtree: true, attributeFilter: ['style'] });
    blurObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['style'] });

    // Sweep: remove any existing blur(0) inline styles immediately
    root.querySelectorAll('[style*="blur(0"]').forEach(el => removeBlurFilter(el as HTMLElement));
    document.body.querySelectorAll('[style*="blur(0"]').forEach(el => removeBlurFilter(el as HTMLElement));

    // Periodic sweep: Shopify scripts can add blur(0) at any time during load
    let sweepCount = 0;
    const sweepInterval = setInterval(() => {
      document.querySelectorAll('[style*="blur(0"]').forEach(el => removeBlurFilter(el as HTMLElement));
      sweepCount++;
      if (sweepCount >= 20) clearInterval(sweepInterval); // 10 seconds
    }, 500);

    // ═══ IntersectionObserver fallback for .animation-element outside split-hero ═══
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });
    root.querySelectorAll('.animation-element').forEach(el => {
      if (!el.closest('split-hero')) {
        animObserver.observe(el);
      }
    });

    // ═══ Video lazy-play: only play videos when visible ═══
    const isMobile = window.innerWidth < 1024;
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.dataset.isIntersecting = "true";
          const isCollageVideo = video.classList.contains('ping-pong-video') || 
                                 video.classList.contains('ping-pong-forward') || 
                                 video.classList.contains('ping-pong-reverse') ||
                                 video.querySelector('source[src*="therea.mp4"]') || 
                                 video.querySelector('source[src*="rever.mp4"]') ||
                                 (video.src && (video.src.includes('therea.mp4') || video.src.includes('rever.mp4')));
          
          // En móvil (no hay hover), auto-reproducir incluso los videos de collage
          if (!isCollageVideo || isMobile) {
            // Ensure loop on mobile so video repeats while visible
            if (isMobile) video.loop = true;
            video.play().catch(() => {});
          }
        } else {
          video.dataset.isIntersecting = "false";
          video.pause();
        }
      });
    }, { threshold: 0.1 });
    root.querySelectorAll('video').forEach(video => {
      // Skip our custom hero videos — they are managed entirely by the inline HTML scripts
      const videoId = video.id;
      if (videoId === 'hero1-video-desktop' || videoId === 'hero1-video-mobile') return;

      // Exclude slideshow/hero and split-hero videos from preload="none" and disabling autoplay
      const isHeroVideo = video.closest('.slideshow') || video.closest('split-hero') || video.closest('.split-hero');
      if (isHeroVideo) {
        video.preload = 'auto';
        video.setAttribute('autoplay', 'autoplay');
        return;
      }
      // Remove autoplay so we control playback via observer for secondary videos
      video.removeAttribute('autoplay');
      video.preload = 'none';
      videoObserver.observe(video);
    });

    // Sweep slideshow videos and add robust listener to hide fallback images when they play
    root.querySelectorAll('.slideshow video, split-hero video, .split-hero video').forEach(vid => {
      const video = vid as HTMLVideoElement;
      const hideFallback = () => {
        if (!video.closest('.slideshow')) return;
        video.style.setProperty('z-index', '6', 'important');
      };
      video.addEventListener('playing', hideFallback);
      if (video.currentTime > 0 && !video.paused) {
        hideFallback();
      }
    });

    // ═══ HERO VIDEO INIT (runs here because <script> inside innerHTML doesn't execute) ═══
    const initHeroVideos = () => {
      // ── Desktop ──
      const vidDesktop = root.querySelector('#hero1-video-desktop') as HTMLVideoElement | null;
      const imgDesktop = root.querySelector('#hero1-image-desktop') as HTMLElement | null;
      if (vidDesktop) {
        let isFrozen = false;
        vidDesktop.addEventListener('playing', function onDesktopPlay() {
          vidDesktop.style.opacity = '1';
          vidDesktop.style.transform = 'scale(1)';
          if (imgDesktop) imgDesktop.style.opacity = '0';
          vidDesktop.removeEventListener('playing', onDesktopPlay);
        });
        vidDesktop.addEventListener('timeupdate', () => {
          if (!isFrozen && vidDesktop.duration && vidDesktop.currentTime >= vidDesktop.duration - 0.1) {
            vidDesktop.pause();
            isFrozen = true;
          }
        });
        vidDesktop.play().catch(() => {});
      }

      // ── Mobile ──
      const vidMobile = root.querySelector('#hero1-video-mobile') as HTMLVideoElement | null;
      const imgMobile = root.querySelector('#hero1-image-mobile') as HTMLElement | null;
      if (vidMobile && imgMobile) {
        const fadeOutImg = () => {
          vidMobile.style.opacity = '1';
          imgMobile.style.opacity = '0';
        };
        vidMobile.addEventListener('playing', fadeOutImg, { once: true });
        vidMobile.addEventListener('canplay', () => {
          if (!vidMobile.paused) fadeOutImg();
        }, { once: true });
        vidMobile.play().catch(() => {});
      }
    };
    initHeroVideos();
    // Also retry after 500ms in case preload=auto hasn't buffered yet
    setTimeout(initHeroVideos, 500);

    // ═══ Pause hero video when nav menu dropdown is open ═══
    const heroVideos = root.querySelectorAll('split-hero video, .split-hero video');
    const navItems = root.querySelectorAll('.header-menu-item, menu-drawer .menu-item, .header nav li');
    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        heroVideos.forEach(v => (v as HTMLVideoElement).pause());
      });
      item.addEventListener('mouseleave', () => {
        heroVideos.forEach(v => (v as HTMLVideoElement).play().catch(() => {}));
      });
    });

    // ═══ Swiper active slide video re-trigger ═══
    const swiperObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('swiper-slide-active')) {
            const videos = target.querySelectorAll('video');
            videos.forEach(v => {
              v.currentTime = 0;
              v.play().catch(() => {});
              // Force CSS animation re-trigger
              v.style.animation = 'none';
              void v.offsetHeight; // trigger reflow
              v.style.animation = '';
            });
          }
        }
      });
    });
    root.querySelectorAll('.swiper-slide').forEach(slide => {
      if (slide.querySelector('video')) {
        swiperObserver.observe(slide, { attributes: true, attributeFilter: ['class'] });
        // Re-trigger active ones on load
        if (slide.classList.contains('swiper-slide-active')) {
          slide.querySelectorAll('video').forEach(v => {
            v.currentTime = 0;
            v.play().catch(() => {});
          });
        }
      }
    });

    // ═══ HeroBanner 1: Smooth JS-driven fade-in on initial load ═══
    // Uses rAF + transition to bypass CSS !important conflicts reliably.
    setTimeout(() => {
      const firstSlide = root.querySelector('.swiper-slide');
      if (firstSlide) {
        firstSlide.querySelectorAll('video').forEach(vid => {
          const v = vid as HTMLVideoElement;
          // Force the video to start invisible and without transition
          v.style.setProperty('opacity', '0', 'important');
          v.style.setProperty('transform', 'scale(1.06) translateY(14px)', 'important');
          v.style.setProperty('transition', 'none', 'important');
          v.play().catch(() => {});
          // Double rAF ensures the browser has painted the initial hidden state
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              v.style.setProperty('transition', 'opacity 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'important');
              v.style.setProperty('opacity', '1', 'important');
              v.style.setProperty('transform', 'scale(1) translateY(0)', 'important');
            });
          });
        });
      }
    }, 600);

    // ═══ HeroBanner: el carrusel de 3 imágenes es 100% CSS (fade) en body-clean.html ═══
    // No se inicializa Swiper en el hero a propósito: con innerHTML los <script> nativos
    // no corren y el init perdía la carrera, dejando los slides apilados. El fade por CSS
    // no depende de JS, así que nunca se rompe el layout.

    // ═══ NEWSLETTER POPUP ON MOBILE: Never auto-open, only on user tap ═══
    // On mobile, always keep the popup closed unless the user explicitly opens it.
    if (window.matchMedia('(max-width: 767px)').matches) {
      const preventAutoPopup = () => {
        const popup = document.querySelector('newsletter-popup') as HTMLElement | null;
        if (!popup) return;
        // Mark the popup as auto-hidden so CSS doesn't force it open
        popup.setAttribute('data-auto-hidden', 'true');
        popup.setAttribute('data-hidden', 'true');
        popup.setAttribute('inert', '');
        popup.style.setProperty('display', 'none', 'important');
        popup.style.setProperty('visibility', 'hidden', 'important');
      };
      preventAutoPopup();
      // Watch for the popup to be auto-triggered and block it
      const popupEl = document.querySelector('newsletter-popup') as HTMLElement | null;
      if (popupEl) {
        const popupMutObs = new MutationObserver(() => {
          // Only allow display if user manually opened it (removed data-auto-hidden)
          if (popupEl.getAttribute('data-auto-hidden') === 'true') {
            let needsUpdate = false;
            if (popupEl.getAttribute('data-hidden') !== 'true') needsUpdate = true;
            if (!popupEl.hasAttribute('inert')) needsUpdate = true;
            if (popupEl.style.display !== 'none') needsUpdate = true;
            
            if (needsUpdate) {
              popupMutObs.disconnect(); // prevent infinite loop
              popupEl.setAttribute('data-hidden', 'true');
              popupEl.setAttribute('inert', '');
              popupEl.style.setProperty('display', 'none', 'important');
              popupMutObs.observe(popupEl, { attributes: true, attributeFilter: ['data-hidden', 'inert', 'style'] });
            }
          }
        });
        popupMutObs.observe(popupEl, { attributes: true, attributeFilter: ['data-hidden', 'inert', 'style'] });
      }

      // When user clicks the button-newsletter label, allow the popup to open
      const btnNewsletter = document.querySelector('.button-newsletter') as HTMLElement | null;
      if (btnNewsletter) {
        btnNewsletter.addEventListener('click', () => {
          const popup = document.querySelector('newsletter-popup') as HTMLElement | null;
          if (popup) {
            popup.removeAttribute('data-auto-hidden');
            popup.removeAttribute('data-hidden');
            popup.removeAttribute('inert');
            popup.style.removeProperty('display');
            popup.style.removeProperty('visibility');
          }
        });
      }

      // Prevent auto-open after scripts load
      setTimeout(preventAutoPopup, 1500);
      setTimeout(preventAutoPopup, 3000);
    }

    // ═══ MOBILE HERO: Replace single button with two buttons (Tienda + Catálogo) ═══
    const injectMobileHeroButtons = () => {
      const heroButtonBlock = root.querySelector('#shopify-block-ANTBPMjNnaUZNbklXR__button_VKQi4f .custom-theme-block') as HTMLElement | null;
      if (!heroButtonBlock || heroButtonBlock.dataset.mobileBtnsInjected) return;
      heroButtonBlock.dataset.mobileBtnsInjected = '1';
      const originalHtml = heroButtonBlock.innerHTML;
      heroButtonBlock.innerHTML = `
        <div class="md:hidden" style="display:flex; gap:12px; padding: 15px 0 40px; justify-content:center; width: 100%;">
          <a href="/productos" role="button" style="
            flex: 1; max-width: 160px;
            display:inline-flex; align-items:center; justify-content:center;
            padding: 14px 20px; border-radius:30px;
            background: #111827; 
            color: #ffffff; font-weight:800; font-size:14px; text-transform:uppercase;
            text-decoration:none; 
            box-shadow: 0 10px 25px -5px rgba(17, 24, 39, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset;
            letter-spacing:1px; border:none; white-space:nowrap;
          ">Tienda</a>
          ${!unlimitedStock ? `
          <a href="/catalogo" role="button" style="
            flex: 1; max-width: 160px;
            display:inline-flex; align-items:center; justify-content:center;
            padding: 14px 20px; border-radius:30px;
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            color:#111827; font-weight:800; font-size:14px; text-transform:uppercase;
            text-decoration:none; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05) inset;
            letter-spacing:1px; border:none; white-space:nowrap;
          ">Catálogo</a>
          ` : ''}
        </div>
        <div class="hidden md:block">
          ${originalHtml}
        </div>
      `;
    };
    injectMobileHeroButtons();
    setTimeout(injectMobileHeroButtons, 800);
    setTimeout(injectMobileHeroButtons, 2000);

  }, [bodyHtml, categories, isAppwriteLoaded, timedOffers, keniaEnabled, isThemeConfigLoaded, htmlInjected]);

  /* ── Wire "Iniciar Sesión" button to auth popup (same style as plantilla1) ── */
  useEffect(() => {
    if (!containerRef.current || !containerRef.current.dataset.htmlSet) return;

    const root = containerRef.current;
    const loginLink = root.querySelector('li[data-type="account"] a') as HTMLElement | null;
    if (!loginLink) return;

    // Actualizar texto y enlace basado en si el usuario está logueado
    const labelSpan = loginLink.querySelector('.link-hover-animation');
    if (labelSpan) {
      labelSpan.textContent = user ? (user.name ? user.name.split(' ')[0] : 'Mi Cuenta') : 'Iniciar Sesión';
    }
    loginLink.setAttribute('href', user ? '/cuenta' : '/login');

    // Ensure keyframes style
    const ensureKeyframes = () => {
      if (document.getElementById('tpl23-auth-keyframes')) return;
      const ks = document.createElement('style');
      ks.id = 'tpl23-auth-keyframes';
      ks.textContent =
        '@keyframes tpl1AuthIn{from{opacity:0;transform:translateY(-12px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}' +
        '@keyframes tpl1AuthSheetIn{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}';
      document.head.appendChild(ks);
    };

    const layoutPanel = (anchor: HTMLElement, popup: HTMLElement, panelWidth = 340) => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const pad = 12;
      popup.classList.add('yaxsel-user-panel');
      if (mobile) {
        popup.style.top = 'auto';
        popup.style.bottom = '0';
        popup.style.left = `${pad}px`;
        popup.style.right = `${pad}px`;
        popup.style.width = 'auto';
        popup.style.maxWidth = 'none';
        popup.style.maxHeight = 'min(92dvh, calc(100vh - env(safe-area-inset-top, 0px) - 16px))';
        popup.style.overflowY = 'auto';
        popup.style.borderRadius = '20px 20px 0 0';
        popup.style.transform = 'none';
        popup.style.animation = 'tpl1AuthSheetIn .32s cubic-bezier(0.16,1,0.3,1)';
        return;
      }
      popup.style.animation = 'tpl1AuthIn .3s cubic-bezier(0.16,1,0.3,1)';
      popup.style.bottom = 'auto';
      popup.style.width = `${panelWidth}px`;
      popup.style.left = 'auto';
      popup.style.maxHeight = `${window.innerHeight - pad * 2}px`;
      popup.style.overflowY = 'auto';
      popup.style.borderRadius = panelWidth >= 340 ? '24px' : '20px';
      popup.style.transform = 'none';
      const rect = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const gap = 14;
      const place = () => {
        const pw = popup.offsetWidth;
        const top = Math.min(rect.bottom + gap, vh - pad - 80);
        let right = Math.max(pad, vw - rect.right);
        const left = vw - right - pw;
        if (left < pad) right = Math.max(pad, vw - pw - pad);
        popup.style.top = `${top}px`;
        popup.style.right = `${right}px`;
        popup.style.maxHeight = `${Math.max(160, vh - top - pad)}px`;
      };
      requestAnimationFrame(place);
    };

    let authPopupEl: HTMLDivElement | null = null;
    let authOverlayEl: HTMLDivElement | null = null;
    let authPopupJustOpened = false;

    const closeAuthPopup = () => {
      if (authPopupEl) { authPopupEl.remove(); authPopupEl = null; }
      if (authOverlayEl) { authOverlayEl.style.opacity = '0'; authOverlayEl.style.pointerEvents = 'none'; }
      document.body.classList.remove('cart-drawer-open', 'overflow-hidden');
      document.body.style.overflow = '';
      authPopupJustOpened = false;
    };

    const toggleAuthPopup = (anchor: HTMLElement) => {
      if (authPopupEl) { closeAuthPopup(); return; }
      authPopupJustOpened = true;

      if (!authOverlayEl) {
        authOverlayEl = document.createElement('div');
        authOverlayEl.id = 'yaxsel-auth-overlay';
        authOverlayEl.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.25);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity 0.3s ease;';
        document.body.appendChild(authOverlayEl);
      }
      authOverlayEl.style.opacity = '1';
      authOverlayEl.style.pointerEvents = 'auto';
      document.body.classList.add('cart-drawer-open', 'overflow-hidden');
      document.body.style.overflow = 'hidden';

      const popup = document.createElement('div');
      popup.id = 'yaxsel-auth-popup';
      popup.style.cssText = 'position:fixed;z-index:10002;width:340px;background:#fff;border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,0.08),0 2px 8px rgba(0,0,0,0.04);border:1px solid #f0f0f0;overflow:hidden;animation:tpl1AuthIn .3s cubic-bezier(0.16,1,0.3,1);font-family:"DM Sans",system-ui,sans-serif;';
      popup.innerHTML = `
        <button id="yaxsel-auth-close" type="button" aria-label="Cerrar" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:none;background:#f3f4f6;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;z-index:2;">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 3L3 11M3 3L11 11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        </button>
        <div style="padding:32px 24px 28px;text-align:center;background:rgba(255,255,255,0.8);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:24px;">
          <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#fdf2f8,#fbcfe8);display:flex;align-items:center;justify-content:center;color:#db2777;box-shadow:0 8px 20px rgba(219,39,119,0.15); border: 2px solid #fce7f3;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p style="font-size:20px;font-weight:800;color:#1f2937;margin:0 0 8px;letter-spacing:-0.02em;">¡Hola, Belleza!</p>
          <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.5;">Ingresa o regístrate para acceder a ofertas exclusivas y realizar pedidos.</p>
          <a href="/login" id="yaxsel-auth-login-btn" style="display:block;width:100%;padding:14px;background:linear-gradient(135deg,#f9a8d4,#f472b6);color:#fff;border:none;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;text-align:center;text-decoration:none;box-shadow:0 8px 20px rgba(244,114,182,0.3);margin-bottom:12px;transition:all 0.3s ease;">Iniciar sesión</a>
          <a href="/login?tab=register" style="display:block;width:100%;padding:14px;background:rgba(253,242,248,0.8);color:#db2777;border:1px solid #fbcfe8;border-radius:16px;font-size:15px;font-weight:700;text-align:center;text-decoration:none;transition:all 0.3s ease;">Crear cuenta nueva</a>
        </div>
      `;

      document.body.appendChild(popup);
      authPopupEl = popup;
      ensureKeyframes();
      layoutPanel(anchor, popup, 340);

      const closeBtn = popup.querySelector('#yaxsel-auth-close') as HTMLElement | null;
      if (closeBtn) {
        closeBtn.addEventListener('click', () => { closeAuthPopup(); });
        closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = '#fce7f3'; closeBtn.style.color = '#ec4899'; });
        closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = '#f3f4f6'; closeBtn.style.color = '#666'; });
      }

      if (authOverlayEl) {
        authOverlayEl.onclick = () => {
          if (authPopupJustOpened) { authPopupJustOpened = false; return; }
          closeAuthPopup();
        };
      }

      const loginBtn = popup.querySelector('#yaxsel-auth-login-btn') as HTMLElement | null;
      if (loginBtn) {
        loginBtn.addEventListener('mouseenter', () => { loginBtn.style.transform = 'translateY(-2px)'; loginBtn.style.boxShadow = '0 8px 32px rgba(244,114,182,0.4)'; });
        loginBtn.addEventListener('mouseleave', () => { loginBtn.style.transform = ''; loginBtn.style.boxShadow = '0 8px 20px rgba(244,114,182,0.3)'; });
      }

      if (!window.matchMedia('(max-width: 768px)').matches) {
        const onOutside = (ev: MouseEvent) => {
          if (!popup.contains(ev.target as Node) && !anchor.contains(ev.target as Node)) {
            closeAuthPopup();
            document.removeEventListener('mousedown', onOutside);
          }
        };
        setTimeout(() => document.addEventListener('mousedown', onOutside), 0);
      }
    };

    // Override the Shopify link behavior
    const oldHandler = (loginLink as any)._authHandler;
    if (oldHandler) {
      loginLink.removeEventListener('click', oldHandler);
    }

    const handleAccountClick = (e: MouseEvent) => {
      if (user) {
        e.preventDefault();
        window.location.href = '/cuenta';
      } else {
        e.preventDefault();
        e.stopPropagation();
        toggleAuthPopup(loginLink as HTMLElement);
      }
    };

    (loginLink as any)._authHandler = handleAccountClick;
    loginLink.addEventListener('click', handleAccountClick);

    return () => {
      loginLink.removeEventListener('click', handleAccountClick);
    };
  }, [bodyHtml, user]);

  /* ── INJECT DYNAMIC CATEGORIES INTO NAVBAR MEGAMENU (separate effect) ── */
  useEffect(() => {
    if (!containerRef.current || !containerRef.current.dataset.htmlSet) return;
    if (categories.length === 0 || subcategories.length === 0) return;
    if (containerRef.current.dataset.navInjected) return;

    const root = containerRef.current;

    // ── Compute product counts per category and subcategory ──
    const catProductCount: Record<string, number> = {};
    const subProductCount: Record<string, number> = {};
    const catProducts: Record<string, Product[]> = {};
    const subProducts: Record<string, Product[]> = {};

    products.forEach(p => {
      const cid = p.CATEGORYID || '';
      const sid = p.SUBCATEGORYID || '';
      catProductCount[cid] = (catProductCount[cid] || 0) + 1;
      if (sid) subProductCount[sid] = (subProductCount[sid] || 0) + 1;
      if (!catProducts[cid]) catProducts[cid] = [];
      catProducts[cid].push(p);
      if (sid) {
        if (!subProducts[sid]) subProducts[sid] = [];
        subProducts[sid].push(p);
      }
    });

    // Sort categories by product count (most products first) and pick top 4
    const sortedCats = [...categories]
      .filter(cat => (catProductCount[cat.$id] || 0) > 0)
      .map(cat => ({
        ...cat,
        prodCount: catProductCount[cat.$id] || 0
      }))
      .sort((a, b) => b.prodCount - a.prodCount)
      .slice(0, 4);

    // ── Desktop menu ──
    // Solo reconstruir si hay categorías con productos; si no, se conservan los
    // links base que dejó la inyección inicial (nunca el menú de la plantilla original).
    const desktopMenu = root.querySelector('ul.menu[data-tier="1"]:not(.menu--drawer)');
    if (desktopMenu && sortedCats.length > 0) {
      desktopMenu.innerHTML = '';

      sortedCats.forEach((cat, idx) => {
        const megamenuId = `megamenu-dynamic-${idx}`;
        const catProdCount = cat.prodCount;

        // Sort subcategories by product count (most first)
        const catSubs = subcategories
          .filter(sc => sc.categoryId === cat.$id)
          .map(sc => ({ ...sc, prodCount: subProductCount[sc.$id] || 0 }))
          .filter(sc => sc.prodCount > 0)
          .sort((a, b) => b.prodCount - a.prodCount);

        const navLi = document.createElement('li');
        navLi.className = 'inline-block group py-2 px-1 shrink-0 no-keyboard-focus';
        navLi.innerHTML = `
          <a href="javascript:void(0)" title="${cat.name}" aria-label="${cat.name}"
              data-action="hover"
              data-id="${megamenuId}"
              class="flex items-center no-keyboard-focus"
              data-menu-tier="1"
          >
              <span class="link-hover-animation">${cat.name}</span>
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px]">
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>
          </a>
        `;

        // ── Megamenu <template> (must be SIBLING of <li>, not child) ──
        const templateEl = document.createElement('template');
        templateEl.id = megamenuId;

        // Left column: subcategories
        let subsHtml = '';
        catSubs.forEach((sub, subIdx) => {
          const subHandle = `cat${idx}-sub${subIdx}`;
          const isActive = subIdx === 0 ? 'true' : 'false';
          subsHtml += `
            <li
                data-active="${isActive}"
                class="py-2 px-2 flex justify-between items-center link-hover cursor-pointer"
                data-link-handle="${subHandle}"
                tabindex="0"
            >
                <span class="link-hover-animation">${sub.name}</span>
                <span class="rotate-[270deg]"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px]">
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg></span>
            </li>
          `;
        });

        // Right column: product carousel per subcategory — show 4 products max
        let grandchildHtml = '';
        catSubs.forEach((sub, subIdx) => {
          const subHandle = `cat${idx}-sub${subIdx}`;
          const subLink = `/productos?categoria=${encodeURIComponent(cat.name)}&subcategoria=${encodeURIComponent(sub.name)}`;
          const isHidden = subIdx === 0 ? 'false' : 'true';
          const inertAttr = subIdx === 0 ? '' : 'inert';
          const subProds = (subProducts[sub.$id] || []).slice(0, 4);

          // Build product cards (no Swiper — simple flex row for 4 items)
          let productCardsHtml = '';
          subProds.forEach(p => {
            const pLink = `/productos/${p.$id}`;
            const pImg = p.IMAGEURL || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png';
            const pName = p.NAME || 'Producto';
            productCardsHtml += `
              <a href="${pLink}" title="${pName}" aria-label="${pName}"
                  class="flex group/image flex-col gap-2 items-start no-keyboard-focus relative"
                  style="text-decoration:none !important;width:25% !important;min-width:0 !important;display:flex !important;flex-direction:column !important;box-sizing:border-box !important;padding:0 8px !important"
                  data-type="standard"
              >
                  <span class="w-full aspect-square shrink-0 overflow-hidden rounded-[20px] bg-white flex items-center justify-center p-4" style="width:100% !important;aspect-ratio:1/1 !important;display:flex !important">
                      <img src="${pImg}" alt="${pName}" loading="lazy" class="pointer-events-none transition-transform duration-500 group-hover/image:scale-105" style="width:100% !important;height:100% !important;object-fit:contain !important; max-width:100% !important; max-height:100% !important;">
                  </span>
                  <div class="menu__heading-content w-full mt-2">
                      <h6 class="menu__heading-title" style="font-size:0.85em;line-height:1.2;font-weight:500;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:2.4em">
                          <span class="link-hover-animation">${pName}</span>
                      </h6>
                  </div>
              </a>
            `;
          });

          grandchildHtml += `
            <div class="menu menu--megamenu menu--megamenu-hover-split menu--megamenu-hover-split-grandchild flex-1 overflow-y-auto max-h-[400px]" data-tier="3" role="list"
                data-hidden="${isHidden}"
                ${inertAttr}
                data-link-handle="${subHandle}"
                style="
                    --num-columns: 4;
                    --image-border-radius: 20px;
                    --image-border-width: 0px;
                    --text-alignment: left;
                    --vertical-alignment: center;
                    --color-text: inherit;
                    --color-background: transparent;
                "
            >
                <div class="flex justify-between items-center mb-4">
                    <a href="${subLink}" title="${sub.name}" aria-label="${sub.name}" class="font-bold max-w-max border-b-1 border-current/20 no-keyboard-focus">
                        <span class="link-hover-animation">${sub.name}</span>
                    </a>
                    <a href="${subLink}" class="text-xs font-medium transition-opacity rounded-full px-3 py-1 hover:opacity-90" style="font-size:0.75em;text-decoration:none;background-color:#FFB6C1;color:#fff">Ver todo</a>
                </div>
                <div class="megamenu-product-grid" style="display:flex !important;flex-wrap:nowrap !important;gap:12px !important;width:100% !important;overflow:hidden !important">
                    ${productCardsHtml}
                </div>
            </div>
          `;
        });

        templateEl.innerHTML = `
          <div class="custom-container flex my-[3rem] scroll-area" data-menu-type="hover-split">
              <ul class="custom-list menu menu--megamenu menu--megamenu-hover-split menu--megamenu-hover-split-child flex-1 max-w-[250px] w-max border-current/20 border-r-1 overflow-y-auto max-h-[400px]" data-tier="2" role="list">
                  ${subsHtml}
              </ul>
              ${grandchildHtml}
          </div>
        `;

        // Append <li> first, then <template> as SIBLING (matches original HTML structure)
        desktopMenu.appendChild(navLi);
        desktopMenu.appendChild(templateEl);
      });

    }

    // ── Mobile drawer menu ──
    const mobileMenu = root.querySelector('ul.menu--drawer[data-tier="1"]');
    if (mobileMenu && sortedCats.length > 0) {
      mobileMenu.innerHTML = '';

      sortedCats.forEach(cat => {
        const catLink = `/productos?categoria=${encodeURIComponent(cat.name)}`;
        const catSubs = subcategories
          .filter(sc => sc.categoryId === cat.$id && !sc.parentSubcategoryId)
          .map(sc => ({ ...sc, prodCount: subProductCount[sc.$id] || 0 }))
          .filter(sc => sc.prodCount > 0)
          .sort((a, b) => b.prodCount - a.prodCount);

        const mobileLi = document.createElement('li');
        mobileLi.className = 'group relative before:content-[\'\'] before:block before:absolute before:top-0 before:left-0 before:transition-all before:duration-500 before:ease-in-out before:h-full before:w-0 before:bg-black before:opacity-1';

        let subMenuHtml = '';
        if (catSubs.length > 0) {
          subMenuHtml = `<div class="menu menu--drawer hidden" data-link-handle="${cat.$id}" data-tier="2"><ul class="custom-list">`;
          subMenuHtml += `<li class="group relative"><a href="${catLink}" aria-label="Ver todo ${cat.name}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative"><span class="px-3">Ver todo ${cat.name} (${cat.prodCount})</span></a></li>`;
          catSubs.forEach(sub => {
            const subLink = `/productos?categoria=${encodeURIComponent(cat.name)}&subcategoria=${encodeURIComponent(sub.name)}`;
            
            // Check for level 3
            const catSubSubs = subcategories.filter(sc => sc.parentSubcategoryId === sub.$id);
            if (catSubSubs.length > 0) {
              subMenuHtml += `<li class="group relative"><a href="${subLink}" aria-label="${sub.name}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative"><span class="px-3">${sub.name}</span><span class="rotate-[-90deg]"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px]"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></span></a>`;
              subMenuHtml += `<div class="menu menu--drawer hidden" data-link-handle="${sub.$id}" data-tier="3"><ul class="custom-list">`;
              subMenuHtml += `<li class="group relative"><a href="${subLink}" aria-label="Ver todo ${sub.name}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative"><span class="px-3" style="color:#db2777">Ver todo ${sub.name} (${sub.prodCount})</span></a></li>`;
              catSubSubs.forEach(ssc => {
                 subMenuHtml += `<li class="group relative"><a href="${subLink}" aria-label="${ssc.name}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative"><span class="px-3" style="padding-left:16px; opacity:0.8">${ssc.name}</span></a></li>`;
              });
              subMenuHtml += `</ul></div></li>`;
            } else {
              subMenuHtml += `<li class="group relative"><a href="${subLink}" aria-label="${sub.name}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative"><span class="px-3">${sub.name} (${sub.prodCount})</span></a></li>`;
            }
          });
          subMenuHtml += `</ul></div>`;
        }

        mobileLi.innerHTML = `
          <a href="${catLink}" aria-label="${cat.name}" title="${cat.name}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative">
              <span class="after:content-[\'\'] relative after:absolute after:top-full after:left-0 after:w-0 after:block after:h-0.5 after:bg-current after:transition-all after:duration-300 after:ease-in-out px-3">${cat.name} (${cat.prodCount})</span>
              ${catSubs.length > 0 ? '<span class="rotate-[-90deg]"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px]"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></span>' : ''}
          </a>
          ${subMenuHtml}
        `;
        mobileMenu.appendChild(mobileLi);
      });

      const extraLinks = ['TIENDA|https://kevincocochile.cl/productos'];
      if (!unlimitedStock) {
        extraLinks.push('CATÁLOGO|https://kevincocochile.cl/catalogo');
      }
      extraLinks.forEach(item => {
        const [label, href] = item.split('|');
        const li = document.createElement('li');
        li.className = 'group relative before:content-[\'\'] before:block before:absolute before:top-0 before:left-0 before:transition-all before:duration-500 before:ease-in-out before:h-full before:w-0 before:bg-black before:opacity-1';
        li.innerHTML = `<a href="${href}" aria-label="${label}" title="${label}" class="w-full flex p-7 justify-between cursor-pointer z-10 relative"><span class="px-3">${label}</span></a>`;
        mobileMenu.appendChild(li);
      });
    }

    // ── Watch megamenu-wrapper for content injection by header.js ──
    // header.js clones <template> content into #megamenu-wrapper on hover.
    // We observe it to apply our custom styling overrides after injection.
    const megamenuWrapper = root.querySelector('#megamenu-wrapper');
    if (megamenuWrapper) {
      const observer = new MutationObserver(() => {
        // Force our grandchild display overrides on the cloned content
        megamenuWrapper.querySelectorAll('.menu--megamenu-hover-split-grandchild').forEach(el => {
          const grandchild = el as HTMLElement;
          if (grandchild.dataset.hidden === 'false') {
            grandchild.style.setProperty('display', 'flex', 'important');
            grandchild.style.setProperty('flex-direction', 'column', 'important');
            grandchild.style.setProperty('width', '100%', 'important');
            grandchild.style.setProperty('max-width', 'none', 'important');
            grandchild.style.setProperty('padding-left', '2.5rem', 'important');
            grandchild.style.setProperty('padding-right', '1.5rem', 'important');
            grandchild.style.setProperty('overflow', 'hidden', 'important');
          }
        });
        // Force product grid styling on cloned content
        megamenuWrapper.querySelectorAll('.megamenu-product-grid').forEach(el => {
          const grid = el as HTMLElement;
          grid.style.setProperty('display', 'flex', 'important');
          grid.style.setProperty('flex-wrap', 'nowrap', 'important');
          grid.style.setProperty('gap', '12px', 'important');
          grid.style.setProperty('width', '100%', 'important');
          grid.style.setProperty('overflow', 'hidden', 'important');
        });
        // Force image sizing on cloned content
        megamenuWrapper.querySelectorAll('.megamenu-product-grid img').forEach(img => {
          const imgEl = img as HTMLImageElement;
          imgEl.style.setProperty('width', '100%', 'important');
          imgEl.style.setProperty('height', '100%', 'important');
          imgEl.style.setProperty('max-width', 'none', 'important');
          imgEl.style.setProperty('max-height', 'none', 'important');
          imgEl.style.setProperty('object-fit', 'cover', 'important');
        });
        // Hide scrollbar on scroll-area inside megamenu
        megamenuWrapper.querySelectorAll('.scroll-area').forEach(el => {
          (el as HTMLElement).style.setProperty('overflow', 'hidden', 'important');
        });
      });
      observer.observe(megamenuWrapper, { childList: true, subtree: true });
    }

    // ── Inject dynamic categories into collection-list section below hero banner ──
    const collectionList = root.querySelector('collection-list.collection-list');
    if (collectionList) {
      const allCats = [...categories]
        .map(cat => ({
          ...cat,
          prodCount: catProductCount[cat.$id] || 0
        }))
        .sort((a, b) => b.prodCount - a.prodCount);

      const swiperContainer = collectionList.querySelector('.swiper-container');
      const swiperWrapper = collectionList.querySelector('.swiper-wrapper');
      if (swiperContainer && swiperWrapper) {
        swiperWrapper.innerHTML = '';
        swiperContainer.setAttribute('data-items-total', String(allCats.length));

        allCats.forEach((cat, idx) => {
          const catLink = `/productos?categoria=${encodeURIComponent(cat.name)}`;
          // Use category iconUrl as card image
          const catImg = cat.iconUrl || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png';
          const delay = (idx + 1) * 100;

          const slide = document.createElement('div');
          slide.className = 'swiper-slide w-full h-auto animation-element fade-in';
          slide.setAttribute('style', `animation-delay: ${delay}ms`);
          slide.innerHTML = `
<div class="collection-card overflow-hidden h-full border-current relative w-full fade-in animation-element animation-delay-0">
    <a href="${catLink}" aria-label="${cat.name}" title="${cat.name}" class="link link-image hover-only block">
        <div class="collection-card__image-wrapper relative overflow-hidden hover-zoom-image-wrapper" data-ratio="square">
            <div class="collection-card__image w-full h-full absolute top-0 left-0 transition-all duration-300 ease-in-out transform img-blur placeholder">
                <hover-zoom-image class="w-full h-full">
                    <img src="${catImg}" alt="${cat.name}" loading="lazy" sizes="100vw" class="object-cover w-full h-full pointer-events-none">
                </hover-zoom-image>
            </div>
            <div class="overlay absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out"></div>
        </div>
    </a>
    <div class="collection-card__content z-10">
        <a href="${catLink}" title="${cat.name}" aria-label="${cat.name}" class="transition-all duration-300 ease-in-out h-full w-full link">
            <div class="py-5 pr-2 relative">
                <h6 class="heading transition-all duration-100 ease-in-out">
                    <span class="link-hover-animation">${cat.name}</span>
                </h6>
            </div>
        </a>
    </div>
</div>
          `;
          swiperWrapper.appendChild(slide);
        });
      }
    }

    // ── Inject dynamic products into Featured Collections tabs ──
    if (products.length > 0) {
      const formatCLP = (val: number) => '$' + Math.round(val).toLocaleString('es-CL');

      const initSwiperIfField = (swiperContainer: any) => {
        if (!swiperContainer || swiperContainer.swiper) return;
        const SwiperClass = (window as any).Swiper;
        if (!SwiperClass) return;

        const parent = swiperContainer.closest('.featured-collection__product-by-collection') || swiperContainer.closest('.product-columns-block') || swiperContainer.closest('product-columns');
        if (!parent) return;

        const itemsPerView = parseInt(swiperContainer.dataset.itemsPerView) || 3;
        const itemsPerViewMobile = parseInt(swiperContainer.dataset.itemsPerViewMobile) || 1;
        const totalSlides = swiperContainer.querySelectorAll('.swiper-slide').length;
        const autoplay = swiperContainer.dataset.autoplay === 'true';
        const speed = parseInt(swiperContainer.dataset.speed) || 5000;
        const loop = swiperContainer.dataset.loop === 'true';
        const spaceBetween = parseInt(swiperContainer.dataset.gap) || 10;

        const visibleItemsPerView = itemsPerView && totalSlides > itemsPerView ? itemsPerView : totalSlides;
        
        const breakpoints = {
          0: { slidesPerView: itemsPerViewMobile },
          500: { slidesPerView: 2 },
          768: { slidesPerView: visibleItemsPerView > 3 ? 3 : visibleItemsPerView },
          1400: { slidesPerView: visibleItemsPerView > 4 ? 4 : visibleItemsPerView }
        };

        const swiperSettings: any = {
          init: false,
          initialSlide: 0,
          loop,
          centeredSlides: false,
          speed: 500,
          watchOverflow: true,
          breakpoints,
          observer: true,
          observeSlideChildren: true,
          watchSlidesProgress: true,
          autoHeight: false,
          spaceBetween,
          on: {
            init: () => {
              const paginationBullets = parent.querySelectorAll('.swiper-pagination:not(.swiper-pagination--product-card) .swiper-pagination-bullet');
              if (paginationBullets && paginationBullets.length > 0) {
                parent.style.setProperty('--pagination-width', `calc(100% / ${paginationBullets.length})`);
                paginationBullets.forEach((item: any, index: number) => {
                  item.setAttribute('data-index', String(index));
                });
                setTimeout(() => {
                  parent.querySelector('.swiper-pagination:not(.swiper-pagination--product-card)')?.classList.add('loaded');
                }, 500);
              }
            },
            slideChange: () => {
              const activePagination = parent.querySelector('.swiper-pagination:not(.swiper-pagination--product-card) .swiper-pagination-bullet-active') as any;
              if (activePagination) {
                const activePaginationIndex = parseInt(activePagination.dataset.index);
                parent.style.setProperty('--pagination-translate-x', `calc(100% * ${activePaginationIndex})`);
              }
            }
          }
        };

        if (parent.querySelector('.swiper-navigation-wrapper:not(.swiper-navigation-wrapper--product-card)')) {
          swiperSettings.navigation = {
            nextEl: parent.querySelector('.button-next:not(.button-next--product-card)'),
            prevEl: parent.querySelector('.button-previous:not(.button-previous--product-card)')
          };
        }

        if (parent.querySelector('.swiper-pagination:not(.swiper-pagination--product-card)')) {
          swiperSettings.pagination = {
            el: parent.querySelector('.swiper-pagination:not(.swiper-pagination--product-card)')
          };
        }

        if (autoplay && !isNaN(speed)) {
          swiperSettings.autoplay = { delay: speed };
        }

        try {
          const swiper = new SwiperClass(swiperContainer, swiperSettings);
          swiper.init();
        } catch (err) {
          console.warn('Error initializing swiper manually:', err);
        }
      };

      const createCardHtml = (product: Product) => {
        const pLink = `/productos/${product.$id}`;
        const pImg = product.IMAGEURL || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png';
        const pName = product.NAME || 'Producto';
        const catObj = categories.find(c => c.$id === product.CATEGORYID);
        const categoryName = catObj ? catObj.name : '';

        const resolved = resolveProductDisplayPrice(product, apertura);
        const originalPrice = resolved.originalPrice || product.PRICE;
        const currentPrice = resolved.displayPrice;
        const hasDiscount = resolved.hasDiscount;

        let priceHtml = '';
        if (hasDiscount) {
          priceHtml = `
            <div class="flex items-center justify-center gap-2 mt-1.5">
              <span class="text-[14px] font-bold text-gray-900">${formatCLP(currentPrice)}</span>
              <span class="text-[11px] text-gray-400 line-through decoration-gray-300">${formatCLP(originalPrice)}</span>
            </div>
          `;
        } else {
          priceHtml = `
            <div class="flex items-center justify-center mt-1.5">
              <span class="text-[14px] font-bold text-gray-900">${formatCLP(originalPrice)}</span>
            </div>
          `;
        }

        return `
          <product-card class="group block w-full bg-white transition-colors duration-300 border border-transparent hover:border-gray-200 rounded-xl" style="max-width: 280px; margin: 0 auto; overflow: hidden;">
            <!-- Contenedor de Imagen Cuadrado y Limpio -->
            <div class="relative w-full bg-[#f8f9fa] overflow-hidden" style="aspect-ratio: 1/1;">
              <a href="${pLink}" title="${pName}" aria-label="${pName}" class="block w-full h-full">
                <img src="${pImg}" alt="${pName}" loading="lazy" class="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" />
              </a>
              
              <!-- Insignias Minimalistas -->
              <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                ${hasDiscount ? `
                  <span class="bg-gray-900 text-white text-[9px] font-bold tracking-widest px-2 py-1 uppercase shadow-sm">
                    -${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                ` : ''}
                ${product.STOCK > 0 && product.STOCK <= 5 ? `
                  <span class="bg-rose-500 text-white text-[9px] font-bold tracking-widest px-2 py-1 uppercase shadow-sm animate-pulse">
                    ¡Solo ${product.STOCK}!
                  </span>
                ` : ''}
              </div>

              <!-- Botón flotante al hover -->
              <div class="absolute bottom-3 right-3 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <button class="pk-grid-add-to-cart w-10 h-10 bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-900 hover:text-white transition-colors duration-300"
                        data-product-id="${product.$id}"
                        aria-label="Agregar ${pName} al carrito">
                  <svg aria-hidden="true" width="18px" height="18px" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M30.622 9.602h-22.407l-1.809-7.464h-5.027v1.066h4.188l5.198 21.443c-1.108 0.323-1.923 1.334-1.923 2.547 0 1.472 1.193 2.666 2.666 2.666s2.666-1.194 2.666-2.666c0-0.603-0.208-1.153-0.545-1.599h7.487c-0.337 0.446-0.545 0.997-0.545 1.599 0 1.472 1.193 2.666 2.665 2.666s2.666-1.194 2.666-2.666c0-1.473-1.193-2.665-2.666-2.666v0h-11.403l-0.517-2.133h14.968l4.337-12.795zM13.107 27.196c0 0.882-0.717 1.599-1.599 1.599s-1.599-0.717-1.599-1.599c0-0.882 0.717-1.599 1.599-1.599s1.599 0.718 1.599 1.599zM24.836 27.196c0 0.882-0.718 1.599-1.6 1.599s-1.599-0.717-1.599-1.599c0-0.882 0.717-1.599 1.599-1.599 0.882 0 1.6 0.718 1.6 1.599zM11.058 21.331l-2.585-10.662h20.662l-3.615 10.662h-14.462z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Contenido de Texto Elegante -->
            <div class="pt-4 pb-2 px-2 text-center flex flex-col items-center">
              <span class="text-[9px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1.5 block">
                ${categoryName || 'Colección'}
              </span>
              <a href="${pLink}" aria-label="${pName}" title="${pName}" class="block w-full">
                <h3 class="font-medium text-[13px] text-gray-800 hover:text-gray-500 line-clamp-2 leading-relaxed transition-colors duration-200 m-0">
                  ${pName}
                </h3>
              </a>
              ${priceHtml}
            </div>
          </product-card>
        `;
      };

      // Push heavy hydration task to next tick to prevent mobile freezing on load
      setTimeout(() => {
        // 1. Populate Tab 1: Productos baratos para empezar a emprender (cheapest in-stock)
        const tab1Products = [...cheapestProducts]
          .filter(p => p.STOCK === undefined || p.STOCK === null || p.STOCK > 0 || p.STOCK === 99999)
          .sort((a: any, b: any) => {
            const priceA = resolveProductDisplayPrice(a, apertura).displayPrice;
            const priceB = resolveProductDisplayPrice(b, apertura).displayPrice;
            return priceA - priceB;
          })
          .slice(0, 4);

        const section1 = root.querySelector('.featured-collection__products[data-index="1"]');
        if (section1 && tab1Products.length > 0) {
          const firstWrapper = section1.querySelector('.featured-collection__first-product-wrapper');
          const swiperWrapper = section1.querySelector('.featured-collection__product-by-collection .swiper-wrapper');
          
          if (firstWrapper) {
            firstWrapper.innerHTML = createCardHtml(tab1Products[0]);
          }
          
          if (swiperWrapper) {
            swiperWrapper.innerHTML = '';
            const sliderProducts = tab1Products.slice(1, 4);
            sliderProducts.forEach((prod, idx) => {
              const slide = document.createElement('div');
              slide.className = `swiper-slide h-auto w-full items-center flex animation-element fade-in animation-delay-${(idx + 2) * 100} py-3`;
              slide.innerHTML = createCardHtml(prod);
              swiperWrapper.appendChild(slide);
            });
          }

          const swiperEl1 = section1.querySelector('.featured-collection__product-by-collection .swiper-container') as any;
          if (swiperEl1) {
            if (swiperEl1.swiper) {
              swiperEl1.swiper.update();
            } else {
              initSwiperIfField(swiperEl1);
            }
          }
        }

        // 2. Populate Tab 2: TIENDA
        const tab2Products = [...products]
          .sort((a, b) => {
            const aBest = a.TAGS?.some(t => t.toLowerCase() === 'best-seller') ? 1 : 0;
            const bBest = b.TAGS?.some(t => t.toLowerCase() === 'best-seller') ? 1 : 0;
            if (aBest !== bBest) return bBest - aBest;
            return (b.SOLDQUANTITY || 0) - (a.SOLDQUANTITY || 0);
          })
          .slice(0, 4);

        const section2 = root.querySelector('.featured-collection__products[data-index="2"]');
        if (section2 && tab2Products.length > 0) {
          const firstWrapper = section2.querySelector('.featured-collection__first-product-wrapper');
          const swiperWrapper = section2.querySelector('.featured-collection__product-by-collection .swiper-wrapper');
          
          if (firstWrapper) {
            firstWrapper.innerHTML = createCardHtml(tab2Products[0]);
          }
          
          if (swiperWrapper) {
            swiperWrapper.innerHTML = '';
            const sliderProducts = tab2Products.slice(1, 4);
            sliderProducts.forEach((prod, idx) => {
              const slide = document.createElement('div');
              slide.className = `swiper-slide h-auto w-full items-center flex animation-element fade-in animation-delay-${(idx + 2) * 100} py-3`;
              slide.innerHTML = createCardHtml(prod);
              swiperWrapper.appendChild(slide);
            });
          }

          const swiperEl2 = section2.querySelector('.featured-collection__product-by-collection .swiper-container') as any;
          if (swiperEl2) {
            if (swiperEl2.swiper) {
              swiperEl2.swiper.update();
            } else {
              initSwiperIfField(swiperEl2);
            }
          }
        }

        // 3. Populate ALL .product-columns-block and product-columns .swiper-container with random in-stock products
        const columnBlocks = root.querySelectorAll('.product-columns-block .swiper-container, product-columns .swiper-container');
        columnBlocks.forEach((swiperContainer: any) => {
          const wrapper = swiperContainer.querySelector('.swiper-wrapper');
          if (wrapper) {
            const availableProducts = products.filter(p => p.STOCK && p.STOCK > 0);
            const shuffled = availableProducts.sort(() => 0.5 - Math.random());
            
            const itemsTotalStr = swiperContainer.getAttribute('data-items-total');
            const itemsNeeded = itemsTotalStr ? parseInt(itemsTotalStr, 10) : 8;
            
            const selected = shuffled.slice(0, itemsNeeded);
            
            wrapper.innerHTML = '';
            selected.forEach((prod) => {
              const slide = document.createElement('div');
              slide.className = 'swiper-slide product-card-wrapper w-full py-3';
              slide.innerHTML = createCardHtml(prod);
              wrapper.appendChild(slide);
            });

            if (swiperContainer.swiper) {
              swiperContainer.swiper.update();
            } else {
              initSwiperIfField(swiperContainer);
            }
          }
        });

      // 4. Populate featured-product blocks with random in-stock products
      const featuredProductBlocks = root.querySelectorAll('featured-product');
      featuredProductBlocks.forEach((fpBlock: any) => {
        const availableProducts = products.filter(p => p.STOCK && p.STOCK > 0);
        if (availableProducts.length === 0) return;
        
        let targetProduct = { ...availableProducts[Math.floor(Math.random() * availableProducts.length)] };
        let isDestacado = false;
        if (destacadoTemporal && destacadoTemporal.targetId) {
          const matched = products.find(p => p.$id === destacadoTemporal.targetId);
          if (matched && matched.STOCK && matched.STOCK > 0) {
            targetProduct = { ...matched };
            isDestacado = true;
          }
        }

        // Overwrite brushes details if matched

        
        // Fix image opacity
        const productMedia = fpBlock.querySelector('product-media');
        if (productMedia) {
          productMedia.classList.remove('opacity-0');
        }

        // Update images
        const imgs = fpBlock.querySelectorAll('img');
        if (imgs.length > 0) {
          imgs.forEach((img: HTMLImageElement) => {
            img.src = resolveStorageImageUrl(targetProduct.IMAGEURL) || '';
            img.removeAttribute('srcset'); // Remove srcset to ensure the src fallback works correctly
          });
        }
        
        // Update popup images or custom layout
        const popup = root.querySelector('.product-pagination-popup');
        if (popup) {
          if (targetProduct.NAME && targetProduct.NAME.toUpperCase().includes('BROCHAS')) {
            popup.innerHTML = `
              <div class="popup__inner relative w-[95%] max-w-[800px] bg-white rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center my-auto mx-auto border border-gray-100">
                <!-- Close Button -->
                <button class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer z-10" data-close="" aria-label="Cerrar">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
                <!-- Image Side -->
                <div class="w-full md:w-1/2 flex justify-center">
                  <div class="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-2 flex items-center justify-center">
                    <img src="https://placehold.co/400x400/fdf2f8/e396bf?text=Set+de+Brochas" class="max-w-full max-h-full object-contain">
                  </div>
                </div>
                
                <!-- Content Side -->
                <div class="w-full md:w-1/2 flex flex-col gap-3 text-left">
                  <span class="text-xs font-black uppercase tracking-widest text-pink-500">KEVIN & COCO</span>
                  <h3 class="text-xl md:text-2xl font-black text-gray-900 leading-tight">SET DE BROCHAS DE 5PCS</h3>
                  <div class="w-12 h-1 bg-pink-500 rounded-full my-1"></div>
                  <div class="space-y-3 font-medium text-gray-600 text-sm leading-relaxed">
                    <p class="flex items-start gap-2">
                      <span class="text-pink-500 shrink-0">✨</span>
                      <span><strong>Diseño Pastel:</strong> Estos sets incluyen mini brochas de maquillaje con mangos de colores pastel y cerdas suaves.</span>
                    </p>
                    <p class="flex items-start gap-2">
                      <span class="text-pink-500 shrink-0">👜</span>
                      <span><strong>Bolsa Holográfica:</strong> Cada conjunto viene en una práctica bolsa holográfica sellable, ideal para llevar en el bolso.</span>
                    </p>
                    <p class="flex items-start gap-2">
                      <span class="text-pink-500 shrink-0">💄</span>
                      <span><strong>Uso Diario:</strong> Los sets se comercializan comúnmente como kits básicos para retoques rápidos o viajes.</span>
                    </p>
                  </div>
                </div>
              </div>
            `;
            const closeBtn = popup.querySelector('[data-close]');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                popup.setAttribute('data-hidden', 'true');
                popup.setAttribute('inert', '');
              });
            }
          } else {
            const popupImgs = popup.querySelectorAll('img');
            popupImgs.forEach((img: HTMLImageElement) => {
              img.src = resolveStorageImageUrl(targetProduct.IMAGEURL) || '';
              img.removeAttribute('srcset');
            });
          }
        }
        
        // Update title
        const heading = fpBlock.querySelector('h3.heading span');
        if (heading) heading.textContent = targetProduct.NAME;
        
        // Update prices
        const priceResolved = resolveProductDisplayPrice(targetProduct, apertura);
        const regularPrice = fpBlock.querySelector('.price__regular .price-item');
        if (regularPrice) regularPrice.textContent = formatPrice(priceResolved.displayPrice);
        const salePrice = fpBlock.querySelector('.price__sale .price-item--sale');
        if (salePrice) salePrice.textContent = formatPrice(priceResolved.displayPrice);
        
        const comparePrice = fpBlock.querySelector('.price-item--compare');
        if (comparePrice) {
          if (priceResolved.hasDiscount && priceResolved.originalPrice != null) {
            comparePrice.textContent = formatPrice(priceResolved.originalPrice);
          } else {
            comparePrice.textContent = '';
          }
        }
        
        // Update stock
        const badge = fpBlock.querySelector('.badge--in-stock');
        if (badge) badge.textContent = `${targetProduct.STOCK} in stock`;
        
        // Update description
        const descBlock = fpBlock.querySelector('.body-text[data-index="6"]');
        if (descBlock) descBlock.innerHTML = targetProduct.DESCRIPTION || '';
        
        // Timer Injection
        const timerBlock = fpBlock.querySelector('.body-text[data-index="7"]');
        if (timerBlock) {
          if (isDestacado && destacadoTemporal.endDateTime) {
            timerBlock.innerHTML = `
              <div class="flex flex-col gap-1 my-2 w-full">
                <span class="text-xs sm:text-sm font-bold text-red-500 uppercase tracking-wide">La oferta termina en:</span>
                <div class="flex items-center gap-1 sm:gap-2 flex-nowrap justify-between w-full" id="dt-timer-container">
                  <div class="bg-gray-100 rounded-md px-1 sm:px-3 py-1 sm:py-2 flex flex-col items-center flex-1"><span class="text-sm sm:text-lg font-bold text-gray-900" id="dt-d">00</span><span class="text-[8px] sm:text-[10px] text-gray-500 uppercase">Días</span></div>
                  <span class="text-gray-400 font-bold text-xs sm:text-sm">:</span>
                  <div class="bg-gray-100 rounded-md px-1 sm:px-3 py-1 sm:py-2 flex flex-col items-center flex-1"><span class="text-sm sm:text-lg font-bold text-gray-900" id="dt-h">00</span><span class="text-[8px] sm:text-[10px] text-gray-500 uppercase">Hrs</span></div>
                  <span class="text-gray-400 font-bold text-xs sm:text-sm">:</span>
                  <div class="bg-gray-100 rounded-md px-1 sm:px-3 py-1 sm:py-2 flex flex-col items-center flex-1"><span class="text-sm sm:text-lg font-bold text-gray-900" id="dt-m">00</span><span class="text-[8px] sm:text-[10px] text-gray-500 uppercase">Min</span></div>
                  <span class="text-gray-400 font-bold text-xs sm:text-sm">:</span>
                  <div class="bg-gray-100 rounded-md px-1 sm:px-3 py-1 sm:py-2 flex flex-col items-center flex-1"><span class="text-sm sm:text-lg font-bold text-red-600" id="dt-s">00</span><span class="text-[8px] sm:text-[10px] text-red-500 uppercase">Seg</span></div>
                </div>
                <a href="/productos" style="margin-top:12px;background:linear-gradient(135deg, #e396bf, #f472b6);color:#fff;font-weight:900;text-align:center;padding:12px;border-radius:12px;text-decoration:none;display:block;text-transform:uppercase;box-shadow:0 4px 16px rgba(227,150,191,0.35);font-size:14px;letter-spacing:0.5px;transition:all 0.3s ease;">Mira todos productos de oferta</a>
              </div>
            `;
            const end = new Date(destacadoTemporal.endDateTime).getTime();
            const updateTimer = () => {
              const now = new Date().getTime();
              const distance = end - now;
              if (distance < 0) {
                timerBlock.innerHTML = '<span class="text-sm font-bold text-gray-500">La oferta ha terminado</span>';
                return;
              }
              const d = Math.floor(distance / (1000 * 60 * 60 * 24));
              const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const s = Math.floor((distance % (1000 * 60)) / 1000);
              const elD = document.getElementById('dt-d');
              const elH = document.getElementById('dt-h');
              const elM = document.getElementById('dt-m');
              const elS = document.getElementById('dt-s');
              if (elD) elD.textContent = d.toString().padStart(2, '0');
              if (elH) elH.textContent = h.toString().padStart(2, '0');
              if (elM) elM.textContent = m.toString().padStart(2, '0');
              if (elS) elS.textContent = s.toString().padStart(2, '0');
            };
            updateTimer();
            if ((window as any)._dtInterval) clearInterval((window as any)._dtInterval);
            (window as any)._dtInterval = setInterval(updateTimer, 1000);
          } else {
            timerBlock.style.display = 'none';
          }
        }

        // Remove variants to avoid messing with sizes
        const variantSelector = fpBlock.querySelector('variant-selector');
        if (variantSelector) variantSelector.remove();
        
        // Update cart button onClick to add THIS product and go to carrito
        const btn = fpBlock.querySelector('.button-cart');
        if (btn) {
          btn.classList.remove('pointer-events-none'); // Ensure it's clickable
          btn.addEventListener('click', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(targetProduct, 1);
            router.push('/carrito');
          });
        }

        // Remove shopify payment skeleton as we only use "Añadir to cart" for simple checkout
        const shopifyPaymentBtn = fpBlock.querySelector('.shopify-payment-button');
        if (shopifyPaymentBtn) shopifyPaymentBtn.remove();
        
        // Update form action just in case
        const forms = fpBlock.querySelectorAll('form');
        forms.forEach((f: HTMLFormElement) => f.onsubmit = (e) => e.preventDefault());
        
        // Update link to details
        const fullDetailsLink = fpBlock.querySelector('.full-details-link a');
        if (fullDetailsLink) {
          fullDetailsLink.href = `/productos/${targetProduct.$id}`;
        }
        
        // Update vendor
        const vendor = fpBlock.querySelector('.vendor span');
        if (vendor) {
          const brand = (targetProduct as any).BRAND || 'Kevin & Coco';
          vendor.textContent = brand.toLowerCase() === 'yaxsell' ? 'Kevin & Coco' : brand;
        }

        // Ya hay producto real: mostrar la sección (se ocultó en la inyección inicial)
        const fpSection = (fpBlock.closest('.shopify-section') || fpBlock) as HTMLElement;
        fpSection.style.removeProperty('display');
      });

      // Force in-view on all animation elements inside featured-collection that were created dynamically
      // This is critical for mobile where the IntersectionObserver may not fire for off-screen elements
      root.querySelectorAll('.featured-collection .animation-element').forEach(el => {
        el.classList.add('in-view');
      });
      }, 50); // End of heavy hydration timeout

      // Intersection Observer for Hero Scroll Videos
      const scrollVideos = root.querySelectorAll('.hero-scroll-video');
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.currentTime = 0;
            video.play().catch(e => console.log('Video auto-play prevented:', e));
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.1 });
      scrollVideos.forEach(v => videoObserver.observe(v));
    }

    // ═══ MOBILE: Inject Profile icon next to Buscar / Carrito in mobile header ═══
    if (window.innerWidth < 1024) {
      const mobileHeaderActions = root.querySelector('.flex.lg\\:hidden.justify-center.items-center') || 
                                  document.querySelector('.flex.lg\\:hidden.justify-center.items-center');
      if (mobileHeaderActions && !mobileHeaderActions.querySelector('[data-profile-icon]')) {
        const profileBtn = document.createElement('a');
        profileBtn.href = '/cuenta';
        profileBtn.setAttribute('role', 'button');
        profileBtn.setAttribute('aria-label', 'Mi perfil');
        profileBtn.setAttribute('data-profile-icon', '1');
        profileBtn.className = 'relative px-[0.5rem] uppercase';
        profileBtn.style.cssText = 'display:inline-flex;align-items:center;';
        profileBtn.innerHTML = `<span style="display:inline-flex;align-items:center;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg></span>`;
        // Insert before cart icon
        const cartIcon = mobileHeaderActions.querySelector('.cart-icon');
        if (cartIcon) {
          mobileHeaderActions.insertBefore(profileBtn, cartIcon);
        } else {
          mobileHeaderActions.appendChild(profileBtn);
        }
      }

      // Allow search drawer to open natively (no redirect)
    }

    // ═══ Replace "Buscar", "Carrito" text with SVGs in PC & Mobile header ═══
    const searchIcons = root.querySelectorAll('.search-icon .link-hover-animation');
    searchIcons.forEach((el) => {
      if (el.textContent?.trim().toLowerCase() === 'buscar') {
        el.innerHTML = `<span style="display:inline-flex;align-items:center;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></span>`;
      }
    });

    const cartIcons = root.querySelectorAll('.cart-icon .link-hover-animation');
    cartIcons.forEach((el) => {
      if (el.textContent?.trim().toLowerCase().includes('carrito')) {
        const qtySpan = el.parentElement?.querySelector('.cart-item-size') || el.querySelector('.cart-item-size');
        el.innerHTML = `<span style="display:inline-flex;align-items:center;position:relative;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></span>`;
        if (qtySpan) {
           (qtySpan as HTMLElement).style.position = 'absolute';
           (qtySpan as HTMLElement).style.top = '-8px';
           (qtySpan as HTMLElement).style.right = '-8px';
           (qtySpan as HTMLElement).style.background = 'black';
           (qtySpan as HTMLElement).style.color = 'white';
           (qtySpan as HTMLElement).style.fontSize = '10px';
           (qtySpan as HTMLElement).style.padding = '2px 4px';
           (qtySpan as HTMLElement).style.borderRadius = '10px';
           (qtySpan as HTMLElement).style.lineHeight = '1';
           (qtySpan as HTMLElement).innerText = (qtySpan as HTMLElement).innerText.replace(/[()]/g, ''); // Remove parenthesis
           el.appendChild(qtySpan);
        }
      }
    });

    // ═══ Inject Notification SVG in PC header ═══
    const headerActionsPC = root.querySelector('.lg\\:flex.hidden.items-center.justify-center.pl-\\[30px\\]');
    if (headerActionsPC && !headerActionsPC.querySelector('.notification-icon')) {
      const storeBtn = document.createElement('a');
      storeBtn.href = '/productos';
      storeBtn.className = 'px-[1rem] uppercase';
      storeBtn.innerHTML = `<span class="link-hover-animation" style="font-weight:900; color:#fff; font-size: 14px; letter-spacing: 0.5px;">Tienda</span>`;
      headerActionsPC.insertBefore(storeBtn, headerActionsPC.firstChild);

      if (!unlimitedStock) {
        const catalogBtn = document.createElement('a');
        catalogBtn.href = '/productos';
        catalogBtn.className = 'px-[1rem] uppercase';
        catalogBtn.innerHTML = `<span class="link-hover-animation" style="font-weight:900; color:#fff; font-size: 14px; letter-spacing: 0.5px;">Catálogo</span>`;
        headerActionsPC.insertBefore(catalogBtn, headerActionsPC.firstChild);
      }

      const notifBtn = document.createElement('a');
      notifBtn.href = '/cuenta';
      notifBtn.className = 'notification-icon px-[0.5rem] uppercase';
      notifBtn.innerHTML = `<span class="link-hover-animation" style="display:inline-flex;align-items:center;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg></span>`;
      headerActionsPC.insertBefore(notifBtn, headerActionsPC.querySelector('.cart-icon'));
    }

    root.dataset.navInjected = '1';
    // htmlInjected en deps: si el HTML se inyecta DESPUÉS de que lleguen los datos
    // (fetch del body-clean.html lento), este efecto debe re-ejecutarse.
  }, [categories, subcategories, products, cheapestProducts, isAppwriteLoaded, unlimitedStock, htmlInjected]);

  /* ── Inject window.Shopify stub BEFORE loading JS ── */
  useEffect(() => {
    if ((window as any).Shopify) return;
    (window as any).Shopify = {
      shop: 'k-me-store-2.myshopify.com',
      country: 'US',
      currency: 'USD',
      locale: 'es',
      theme: { name: 'Captured Theme', id: '7' },
      routes: { root_url: '/', cart_url: '/cart', search_url: '/productos' },
      customerAccountsEnabled: false,
    };
  }, []);

  /* ── Load JS scripts sequentially after HTML is rendered ── */
  useEffect(() => {
    if (!bodyHtml) return;
    if ((window as any).__tpl23ScriptsLoaded) return;
    (window as any).__tpl23ScriptsLoaded = true;

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl23="${file.src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = file.src.includes('elfsight') ? file.src : `${file.src}?v=${Date.now()}`;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl23', file.src);
      const done = () => resolve();
      s.onload = done;
      s.onerror = () => { console.warn('[Plantilla23] Failed to load:', file.src); done(); };
      document.body.appendChild(s);
    });

    const forceInView = () => {
      // Forzar .in-view SOLO en elementos FUERA del split-hero
      // El split-hero maneja sus propios .animation-element via setCollapsed
      document.querySelectorAll('.animation-element, .animation-wrapper').forEach(el => {
        if (!el.closest('split-hero')) {
          el.classList.add('in-view');
        }
      });
      // Forzar autoplay en videos del split hero
      document.querySelectorAll('split-hero video, .split-hero video').forEach(el => {
        const video = el as HTMLVideoElement;
        video.muted = true;
        video.play().catch(() => {});
      });
      // NO forzar .is-collapsed ni re-inicializar split-hero:
      // el split-hero debe empezar DESCOLAPSADO (100vw imagen)
      // ScrollMagic maneja el colapso durante el scroll
    };

    (async () => {
      for (const f of JS_FILES) {
        await loadOne(f);
      }

      setTimeout(() => {
        forceInView();

        // ═══ Stacked Seamless Video Alternator & Hover Hunter ═══
        const collageVideoInterval = setInterval(() => {
          const wrappers = document.querySelectorAll('.collage-video-wrapper');
          wrappers.forEach(el => {
            const wrapper = el as HTMLElement;
            if (wrapper.dataset.pingPongBound) return;
            wrapper.dataset.pingPongBound = "true";
            
            const forward = wrapper.querySelector('.ping-pong-forward') as HTMLVideoElement;
            const reverse = wrapper.querySelector('.ping-pong-reverse') as HTMLVideoElement;
            if (!forward || !reverse) return;

            // Initially paused
            forward.pause();
            reverse.pause();
            forward.dataset.isHovered = "false";
            reverse.dataset.isHovered = "false";

            // Track active video
            let activeVideo = forward;

            // Fade out pink background when any video starts playing
            const handlePlaying = () => {
              const bg = wrapper.closest('.multimedia-collage__background');
              if (bg) {
                bg.classList.add('is-loaded');
              }
            };
            forward.addEventListener('playing', handlePlaying);
            reverse.addEventListener('playing', handlePlaying);

            // Forward video ended transition
            forward.addEventListener('ended', () => {
              forward.pause();
              
              setTimeout(() => {
                // Seamless Crossfade to Reverse:
                reverse.currentTime = 0;
                
                // Swap opacities and z-indices
                reverse.style.zIndex = "2";
                reverse.style.opacity = "1";
                forward.style.zIndex = "1";
                forward.style.opacity = "0";
                
                activeVideo = reverse;

                // Play if hover container is active
                const hoverContainer = (wrapper.closest('.multimedia-collage-block__inner') || wrapper) as HTMLElement;
                if (hoverContainer.dataset.isHovered === "true") {
                  reverse.play().catch(() => {});
                }
              }, 1000); // 1-second pause on the last frame of forward
            });

            // Reverse video ended transition
            reverse.addEventListener('ended', () => {
              reverse.pause();

              setTimeout(() => {
                // Seamless Crossfade to Forward:
                forward.currentTime = 0;

                // Swap opacities and z-indices
                forward.style.zIndex = "2";
                forward.style.opacity = "1";
                reverse.style.zIndex = "1";
                reverse.style.opacity = "0";

                activeVideo = forward;

                // Play if hover container is active
                const hoverContainer = (wrapper.closest('.multimedia-collage-block__inner') || wrapper) as HTMLElement;
                if (hoverContainer.dataset.isHovered === "true") {
                  forward.play().catch(() => {});
                }
              }, 1000); // 1-second pause on the last frame of reverse
            });

            // Hover trigger for the main container
            const hoverContainer = (wrapper.closest('.multimedia-collage-block__inner') || wrapper) as HTMLElement;
            hoverContainer.addEventListener('mouseenter', () => {
              if (window.innerWidth < 768) return; // Prevent hover video playback on mobile
              hoverContainer.dataset.isHovered = "true";
              activeVideo.play().catch(() => {});
            });

            hoverContainer.addEventListener('mouseleave', () => {
              if (window.innerWidth < 768) return; // Prevent hover video playback on mobile
              hoverContainer.dataset.isHovered = "false";
              forward.pause();
              reverse.pause();
            });

            // Scroll-driven Autoplay and Morph for Mobile on "Set de botella"
            if ('IntersectionObserver' in window && wrapper.closest('#shopify-block-AeU1KMU9YMGYxdWlmU__multimedia_collage_video_block_ndXhr3')) {
              const morphCard = wrapper.closest('#shopify-block-AeU1KMU9YMGYxdWlmU__multimedia_collage_video_block_ndXhr3');
              if (morphCard && !wrapper.dataset.scrollObserverBound) {
                wrapper.dataset.scrollObserverBound = "true";

                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    // Only run on mobile
                    if (window.innerWidth >= 768) return;

                    const morphInner = morphCard.querySelector('.morph-svg-inner') as HTMLElement | null;
                    if (entry.isIntersecting) {
                      // Prevent video autoplay on mobile to stop lag and show static image
                      hoverContainer.dataset.isHovered = "true";
                      // activeVideo.play().catch(() => {});
                      if (morphInner) {
                        morphInner.dispatchEvent(new PointerEvent('pointerenter'));
                      }
                    } else {
                      hoverContainer.dataset.isHovered = "false";
                      forward.pause();
                      reverse.pause();
                      if (morphInner) {
                        morphInner.dispatchEvent(new PointerEvent('pointerleave'));
                      }
                    }
                  });
                }, {
                  threshold: 0.35
                });

                observer.observe(morphCard);
              }
            }
          });
        }, 500);
        setTimeout(() => clearInterval(collageVideoInterval), 10000);

        // ═══ Simple Fade-In Reveal for Videos ═══
        const cinematicReveal = (video: HTMLVideoElement) => {
          if (video.dataset.revealStarted) return;
          video.dataset.revealStarted = 'true';

          video.style.setProperty('opacity', '0', 'important');
          void video.offsetHeight;
          video.style.setProperty('transition', 'opacity 1.5s ease-out');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              video.style.setProperty('opacity', '1', 'important');
              video.classList.add('is-playing-revealed');
            });
          });
        };

        const revealInterval = setInterval(() => {
          const videos = document.querySelectorAll('video.reveal-on-play');
          videos.forEach(el => {
            const video = el as HTMLVideoElement;
            if (!video || video.dataset.revealBound) return;
            video.dataset.revealBound = "true";

            if (video.currentTime > 0 && !video.paused) {
              cinematicReveal(video);
            }

            video.addEventListener('playing', () => cinematicReveal(video));
            video.addEventListener('play', () => cinematicReveal(video));
          });
        }, 500);
        setTimeout(() => clearInterval(revealInterval), 10000);

        // ═══ Logo Instant Load Reveal & Override ═══
        const logo = document.querySelector('.header img.logo') as HTMLImageElement;
        if (logo) {
          logo.src = "https://firebasestorage.googleapis.com/v0/b/asistoraerp.firebasestorage.app/o/KEVIN%26COCO%2F%EC%A0%9C%EB%AA%A9%20%EC%97%86%EC%9D%8C-1.png?alt=media&token=a5def232-086e-4ae8-a49b-476b8f4397a7";
          if (logo.complete) {
            logo.classList.add('is-loaded');
          } else {
            logo.addEventListener('load', () => logo.classList.add('is-loaded'));
          }
        }

        // ═══ Early Skeleton Reveal for Slideshow Buttons (before video loads) ═══
        setTimeout(() => {
          document.querySelectorAll('.slideshow__content .custom-button').forEach(el => {
            el.classList.add('is-loaded');
          });
        }, 400);

        // ═══ Delayed Skeleton-to-Content Reveal for Other Buttons ═══
        setTimeout(() => {
          document.querySelectorAll('.header img.logo, .custom-button').forEach(el => {
            el.classList.add('is-loaded');
          });
        }, 1200);
        
        try {
          document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: false }));
          window.dispatchEvent(new Event('load'));
        } catch (e) {
          console.warn('[Plantilla23] dispatch DOMContentLoaded/load failed:', e);
        }
      }, 500);
    })();

    return () => { (window as any).__tpl23ScriptsLoaded = false; };
  }, [bodyHtml, categories]);
  /* ═══ GRID ADD TO CART DELEGATION ═══ */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    
    const handleClickEvents = (e: Event) => {
      const target = e.target as HTMLElement;
      
      const btn = target.closest('.pk-grid-add-to-cart');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute('data-product-id');
        const p = products.find(prod => prod.$id === pid);
        if (p) {
          addItem(p, 1);

          // Animate button: show checkmark for 600ms then open drawer
          const btnEl = btn as HTMLElement;
          const originalHtml = btnEl.innerHTML;
          btnEl.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>`;
          btnEl.style.background = '#22c55e';
          btnEl.style.transform = 'scale(1.15)';

          setTimeout(() => {
            btnEl.innerHTML = originalHtml;
            btnEl.style.background = '';
            btnEl.style.transform = '';
            const cartDrawer = document.querySelector('cart-drawer');
            if (cartDrawer) {
              cartDrawer.setAttribute('data-hidden', 'false');
              cartDrawer.removeAttribute('inert');
              document.documentElement.style.overflow = 'hidden';
            }
          }, 650);
        }
        return;
      }

      const cartIcon = target.closest('[data-object="cart"], .cart-icon');
      if (cartIcon && !target.closest('cart-drawer')) {
        e.preventDefault();
        e.stopPropagation();
        const cartDrawer = document.querySelector('cart-drawer');
        if (cartDrawer) {
          cartDrawer.setAttribute('data-hidden', 'false');
          cartDrawer.removeAttribute('inert');
          document.documentElement.style.overflow = 'hidden';
        }
        return;
      }

      const searchIcon = target.closest('[data-object="search"], .search-icon');
      if (searchIcon && !target.closest('search-drawer')) {
        e.preventDefault();
        e.stopPropagation();
        const searchDrawer = document.querySelector('search-drawer');
        if (searchDrawer) {
          if (typeof (searchDrawer as any).openDrawer === 'function') {
            (searchDrawer as any).openDrawer(e, searchIcon as HTMLElement);
          } else {
            searchDrawer.setAttribute('data-hidden', 'false');
            searchDrawer.removeAttribute('inert');
            document.documentElement.style.overflow = 'hidden';
            const searchInput = searchDrawer.querySelector('#pk-search-input') as HTMLInputElement | null;
            if (searchInput) {
              setTimeout(() => searchInput.focus(), 150);
            }
          }
        }
        return;
      }
    };

    root.addEventListener('click', handleClickEvents);
    return () => root.removeEventListener('click', handleClickEvents);
  }, [bodyHtml, products, addItem]);

  /* ═══ CART DOM HYDRATION ═══ */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const cartWrapper = root.querySelector('cart-drawer .cart-items-wrapper') as HTMLElement;
    const checkoutWrapper = root.querySelector('cart-drawer .cart-drawer-checkout') as HTMLElement;
    if (!cartWrapper || !checkoutWrapper) return;

    if (cartItems.length === 0) {
      cartWrapper.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid #FBCAC9;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; background: linear-gradient(135deg, #FBCAC9 0%, #f9a8a8 100%); border-radius:10px; display:flex; align-items:center; justify-content:center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <h5 style="margin:0; font-size: 18px; font-weight: 800; color: #111827; letter-spacing: -0.3px;">Mi Carrito</h5>
          </div>
        </div>
        <div class="pk-empty-cart" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 48px 24px; text-align:center; background: linear-gradient(145deg, #fdf2f2 0%, #fef7f7 50%, #fff5f5 100%); border-radius: 20px; margin-bottom: 24px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:-20px; right:-20px; width:100px; height:100px; background: radial-gradient(circle, rgba(251,202,201,0.3) 0%, transparent 70%); border-radius:50%;"></div>
            <div style="position:absolute; bottom:-15px; left:-15px; width:80px; height:80px; background: radial-gradient(circle, rgba(251,202,201,0.2) 0%, transparent 70%); border-radius:50%;"></div>
            <div class="pk-empty-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #FBCAC9 0%, #f4a8a7 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(251,202,201,0.4); position:relative; z-index:1;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h6 style="margin:0 0 8px 0; font-size: 17px; font-weight: 800; color: #1f2937; letter-spacing:-0.3px; position:relative; z-index:1;">Tu carrito está vacío</h6>
            <p style="margin:0 0 24px 0; font-size: 13px; color: #9ca3af; max-width: 220px; line-height: 1.6; position:relative; z-index:1;">Descubre productos increíbles y agrélos a tu carrito.</p>
            <button class="drawer__close pk-explore-btn" data-close="" style="background: linear-gradient(135deg, #FBCAC9 0%, #f4a8a7 100%); color: #fff; border: none; padding: 13px 32px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 16px rgba(251,202,201,0.4); letter-spacing: 0.3px; position:relative; z-index:1;">
              Explorar Productos
            </button>
        </div>
      `;
      checkoutWrapper.style.display = 'none';
    } else {
      // Sort items: newest added at the top
      const sortedItems = [...cartItems].reverse();

      const totalItems = cartItems.reduce((acc: any, curr: any) => acc + curr.quantity, 0);
      cartWrapper.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 2px solid #FBCAC9;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; background: linear-gradient(135deg, #FBCAC9 0%, #f9a8a8 100%); border-radius:10px; display:flex; align-items:center; justify-content:center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <h5 style="margin:0; font-size: 18px; font-weight: 800; color: #111827; letter-spacing: -0.3px;">Mi Carrito</h5>
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #FBCAC9 0%, #f4a8a7 100%); padding: 4px 12px; border-radius: 50px; min-width:20px; text-align:center;">\${totalItems}</span>
        </div>
        <div class="pk-cart-items-list" style="display:flex; flex-direction:column; gap:12px; padding-top:4px; max-height: 48vh; overflow-y: auto;">
           ${sortedItems.map((item: any) => {
             const price = getEffectivePrice(item);
             return `
               <div class="cart-item" style="display:flex; align-items:flex-start; gap:14px; padding:14px; background:#fafafa; border-radius:14px; position:relative; transition: all 0.2s;">
                  <a href="/productos/${item.product.$id}" style="width:76px; height:76px; min-width:76px; border-radius:12px; overflow:hidden; background:#fff; display:flex; align-items:center; justify-content:center; border: 1px solid #f0f0f0;">
                      <img src="${item.product.IMAGEURL || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png'}" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; padding:4px;" />
                  </a>
                  <div class="cart-item__details" style="flex:1; min-width:0; padding-right:20px;">
                      <a href="/productos/${item.product.$id}" style="text-decoration: none;">
                          <h6 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #374151; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            ${item.product.NAME}
                            ${item.bundlePackQty && item.bundlePackQty > 0 ? '<span style="display:inline-block;margin-left:6px;background:linear-gradient(135deg,#f9a8d4 0%,#e396bf 100%);color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:999;vertical-align:middle;animation:pk-badge-pulse 2s ease-in-out infinite;box-shadow:0 2px 8px rgba(244,114,182,0.4);">PACK</span>' : ''}
                          </h6>
                      </a>
                      <div style="display:flex; align-items:center; justify-content:space-between;">
                          <div style="font-weight:800; font-size:15px; color:#111827;">$${price.toLocaleString()}</div>
                          <div style="display:flex; align-items:center; background:#fff; border-radius:50px; padding:3px; border: 1px solid #e5e7eb;">
                              <button class="cart-qty-btn" data-action="minus" data-id="${item.product.$id}" style="width:26px; height:26px; display:flex; align-items:center; justify-content:center; border:none; background:transparent; border-radius:50%; cursor:pointer; font-weight:600; font-size:15px; color:#9ca3af; transition:all 0.15s;">−</button>
                              <span style="font-size:13px; font-weight:700; width:24px; text-align:center; color:#111827;">${item.quantity}</span>
                              <button class="cart-qty-btn" data-action="plus" data-id="${item.product.$id}" style="width:26px; height:26px; display:flex; align-items:center; justify-content:center; border:none; background:transparent; border-radius:50%; cursor:pointer; font-weight:600; font-size:15px; color:#9ca3af; transition:all 0.15s;">+</button>
                          </div>
                      </div>
                  </div>
                  <button class="cart-remove-btn" data-id="${item.product.$id}" style="position:absolute; top:10px; right:10px; background:transparent; border:none; width:22px; height:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#d1d5db; transition:all 0.2s; border-radius:50%;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                  </button>
               </div>
             `;
           }).join('')}
        </div>
      `;

      // Hydrate subtotal and checkout buttons
      checkoutWrapper.style.display = 'block';
      checkoutWrapper.style.display = 'block';
      checkoutWrapper.innerHTML = `
        <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; display:flex; align-items:center; gap:8px; border: 1px solid #e5e7eb;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style="font-size:12px; color:#4b5563; font-weight:600;">Pago 100% seguro y garantizado</span>
        </div>
        <div style="padding: 14px 0 12px; border-top: 1px solid #f3f4f6;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 600; color: #6b7280;">Subtotal</span>
            <span style="font-size: 20px; font-weight: 800; color: #111827;">$${(cartTotal || 0).toLocaleString()}</span>
          </div>
          <p style="font-size: 11px; color: #b0b0b0; margin: 0;">Impuestos y envío calculados al pagar</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; padding-top:4px;">
          <button type="button" class="checkout-redirect-btn" style="
            width: 100%;
            padding: 14px 0;
            background: linear-gradient(135deg, #FBCAC9 0%, #f4a8a7 100%);
            color: #fff;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.3px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 16px rgba(251,202,201,0.4);
          ">
            Proceder al Pago
          </button>

          <a href="/carrito" style="
            display: block;
            width: 100%;
            padding: 11px 0;
            background: transparent;
            color: #6b7280;
            border: 1.5px solid #e5e7eb;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
            box-sizing: border-box;
          ">
            Ver Carrito Completo
          </a>
        </div>
      `;

      const redirectBtn = checkoutWrapper.querySelector('.checkout-redirect-btn');
      redirectBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/checkout';
      });
    }

    const handleQtyClick = (e: Event) => {
      e.preventDefault();
      const btn = e.currentTarget as HTMLButtonElement;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      const item = cartItems.find((i: any) => i.product.$id === id);
      if (item) {
        if (action === 'plus') updateQuantity(id!, item.quantity + 1);
        if (action === 'minus' && item.quantity > 1) updateQuantity(id!, item.quantity - 1);
      }
    };

    const handleRemoveClick = (e: Event) => {
      e.preventDefault();
      const btn = e.currentTarget as HTMLButtonElement;
      const id = btn.getAttribute('data-id');
      if (id) removeItem(id);
    };

    cartWrapper.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', handleQtyClick);
    });

    cartWrapper.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', handleRemoveClick);
    });

    root.querySelectorAll('.cart-item-size').forEach(el => {
      el.textContent = `(${cartItems.reduce((acc: any, curr: any) => acc + curr.quantity, 0)})`;
    });

    // Removed old cart-specific closeBtn logic, handled globally now
    // Hydrate "Otros también compraron" with compact 2-col scrollable grid
    root.querySelectorAll('.drawer__recommendation-wrapper').forEach((wrapper, index) => {
      // Fix PC squishing issue
      if (wrapper.classList.contains('md:block')) {
        (wrapper as HTMLElement).style.setProperty('width', '360px', 'important');
        (wrapper as HTMLElement).style.setProperty('min-width', '360px', 'important');
        (wrapper as HTMLElement).style.setProperty('flex-shrink', '0', 'important');
      }

      // Fix Mobile padding issue (remove px-[3rem] which is 48px padding on mobile)
      if (wrapper.classList.contains('md:hidden')) {
        wrapper.querySelectorAll('.px-\\[3rem\\]').forEach(el => {
          el.classList.remove('px-[3rem]');
          el.classList.add('px-4'); // Use px-4 (16px) instead
        });
      }

      const gridId = `pk-rec-grid-${index}`;
      let gridEl = wrapper.querySelector(`#${gridId}`) as HTMLElement | null;
      if (!gridEl) {
        gridEl = document.createElement('div');
        gridEl.id = gridId;
        // On mobile, use auto-fill for better responsive sizing instead of rigid 1fr 1fr
        gridEl.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:12px;padding:0 16px 24px;';
        // Remove existing swiper markup or custom-list to avoid conflicts
        const existingList = wrapper.querySelector('.swiper-container, ul.custom-list');
        if (existingList) existingList.replaceWith(gridEl);
        else wrapper.appendChild(gridEl);
      }

      gridEl.innerHTML = products.slice(0, 8).map((p: any) => {
        const pImg = p.IMAGEURL || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png';
        const pName = p.NAME || 'Producto';
        const pLink = `/productos/${p.$id}`;
        const currentPrice = p.CURRENTPRICE && p.CURRENTPRICE > 0 ? p.CURRENTPRICE : p.PRICE;
        return `
          <div class="pk-drawer-rec-card" style="background:#fff; border-radius:14px; overflow:hidden; border: 1px solid #f0f0f0; display:flex; flex-direction:column; transition: all 0.2s;">
            <a href="${pLink}" style="display:block; padding:10px 10px 0;">
              <div style="width:100%; aspect-ratio: 1/1; background: linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%); border-radius:10px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="${pImg}" alt="${pName}" style="width:100%; height:100%; object-fit:contain; display:block; mix-blend-mode: multiply; padding:6px;">
              </div>
            </a>
            <div style="padding:10px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
              <a href="${pLink}" style="text-decoration:none; color:#111;">
                <p style="margin:0; font-size:11.5px; font-weight:600; line-height:1.4; color:#4b5563; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${pName}</p>
              </a>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-top:10px;">
                <span style="font-size:14px; font-weight:800; color:#111827;">$${(currentPrice||0).toLocaleString()}</span>
                <button class="pk-grid-add-to-cart" data-product-id="${p.$id}" style="background: linear-gradient(135deg, #FBCAC9 0%, #f4a8a7 100%); border:none; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition: all 0.2s; box-shadow: 0 2px 8px rgba(251,202,201,0.3);" aria-label="Agregar al carrito">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    });

    // Hydrate "Trending Search" with real products
    // ═══ SEARCH DRAWER REDESIGN ═══
    const searchDrawer = root.querySelector('search-drawer') as HTMLElement;
    if (searchDrawer && !(searchDrawer as any)._pkSearchHydrated) {
      (searchDrawer as any)._pkSearchHydrated = true;
      const drawerInner = searchDrawer.querySelector('.drawer__inner') as HTMLElement;
      if (drawerInner) {
        drawerInner.style.cssText = 'position:relative; width:100%; max-width:450px; background:#fff; min-height:100%; height:100%; margin-left:auto; margin-right:0; transition:all 0.7s ease-in-out; overflow-y:auto; padding-top:0;';
        const popularTerms = ['Skincare', 'Maquillaje', 'Labiales', 'Mascarillas', 'Serum', 'Limpiador'];
        const topProducts = products.slice(0, 6);

        const renderProduct = (p: any) => {
          const pImg = p.IMAGEURL || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/gold_eyepatch.png';
          const pName = p.NAME || 'Producto';
          const pLink = `/productos/${p.$id}`;
          const currentPrice = p.CURRENTPRICE && p.CURRENTPRICE > 0 ? p.CURRENTPRICE : p.PRICE;
          const hasDiscount = p.CURRENTPRICE && p.CURRENTPRICE < p.PRICE;
          return `
            <a href="${pLink}" class="pk-search-result" style="display:flex; align-items:center; gap:14px; padding:12px; border-radius:14px; text-decoration:none; transition:background 0.15s; cursor:pointer;">
              <div style="width:64px; height:64px; min-width:64px; border-radius:12px; overflow:hidden; background:#f9fafb; border:1px solid #f0f0f0; display:flex; align-items:center; justify-content:center;">
                <img src="${pImg}" alt="${pName}" style="width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; padding:4px;" loading="lazy" />
              </div>
              <div style="flex:1; min-width:0;">
                <p style="margin:0 0 4px; font-size:13px; font-weight:600; color:#374151; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${pName}</p>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:14px; font-weight:800; color:#111827;">$${(currentPrice||0).toLocaleString()}</span>
                  ${hasDiscount ? `<span style="font-size:11px; color:#9ca3af; text-decoration:line-through;">$${p.PRICE.toLocaleString()}</span>` : ''}
                </div>
              </div>
              <div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, #FBCAC9 0%, #f4a8a7 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </a>`;
        };

        drawerInner.innerHTML = `
          <div style="padding:24px 24px 0; position:sticky; top:0; background:#fff; z-index:10;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:36px; height:36px; background:linear-gradient(135deg, #FBCAC9 0%, #f9a8a8 100%); border-radius:10px; display:flex; align-items:center; justify-content:center;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <h5 style="margin:0; font-size:18px; font-weight:800; color:#111827; letter-spacing:-0.3px;">Buscar</h5>
              </div>
              <button class="button-close" data-close="" style="width:34px; height:34px; border-radius:10px; background:#fdf2f2; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#e88b8a; transition:all 0.2s;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>
            </div>
            <div style="position:relative; margin-bottom:16px;">
              <div style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#FBCAC9;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input type="search" id="pk-search-input" placeholder="¿Qué estás buscando?" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="width:100%; padding:13px 44px 13px 44px; border:1.5px solid #f0f0f0; border-radius:50px; font-size:14px; font-weight:500; color:#111827; background:#fafafa; outline:none; transition:all 0.2s; box-sizing:border-box;" />
              <button id="pk-search-clear" style="position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#d1d5db; display:none; padding:2px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg>
              </button>
            </div>
          </div>

          <div id="pk-search-initial" style="padding:0 24px 24px;">
            <div style="margin-bottom:24px;">
              <h6 style="margin:0 0 12px; font-size:13px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px;">Búsquedas populares</h6>
              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                ${popularTerms.map(t => `
                  <button class="pk-search-term" data-term="${t}" style="padding:8px 16px; border-radius:50px; border:1.5px solid #f0f0f0; background:#fff; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; transition:all 0.2s; white-space:nowrap;">
                    ${t}
                  </button>
                `).join('')}
              </div>
            </div>
            <div>
              <h6 style="margin:0 0 14px; font-size:13px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBCAC9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Productos destacados
              </h6>
              <div id="pk-search-popular-list" style="display:flex; flex-direction:column; gap:4px;">
                ${topProducts.map(renderProduct).join('')}
              </div>
            </div>
          </div>

          <div id="pk-search-results" style="padding:0 24px 24px; display:none;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
              <h6 id="pk-results-count" style="margin:0; font-size:13px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px;">Resultados</h6>
            </div>
            <div id="pk-results-list" style="display:flex; flex-direction:column; gap:4px;"></div>
            <div id="pk-no-results" style="display:none; text-align:center; padding:40px 20px;">
              <div style="width:64px; height:64px; background:linear-gradient(135deg, #fdf2f2 0%, #fff5f5 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FBCAC9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
              <p style="margin:0 0 4px; font-size:15px; font-weight:700; color:#374151;">Sin resultados</p>
              <p style="margin:0; font-size:13px; color:#9ca3af;">Intenta con otro término de búsqueda</p>
            </div>
          </div>
        `;

        // Wire up search functionality
        const input = drawerInner.querySelector('#pk-search-input') as HTMLInputElement;
        const clearBtn = drawerInner.querySelector('#pk-search-clear') as HTMLElement;
        const initialSection = drawerInner.querySelector('#pk-search-initial') as HTMLElement;
        const resultsSection = drawerInner.querySelector('#pk-search-results') as HTMLElement;
        const resultsList = drawerInner.querySelector('#pk-results-list') as HTMLElement;
        const resultsCount = drawerInner.querySelector('#pk-results-count') as HTMLElement;
        const noResults = drawerInner.querySelector('#pk-no-results') as HTMLElement;

        let debounceTimer: any = null;

        const doSearch = (query: string) => {
          const q = query.toLowerCase().trim();
          if (!q) {
            initialSection.style.display = 'block';
            resultsSection.style.display = 'none';
            clearBtn.style.display = 'none';
            return;
          }
          clearBtn.style.display = 'block';
          initialSection.style.display = 'none';
          resultsSection.style.display = 'block';

          const matches = products.filter((p: any) => {
            const name = (p.NAME || '').toLowerCase();
            const desc = (p.DESCRIPTION || '').toLowerCase();
            return name.includes(q) || desc.includes(q);
          }).slice(0, 12);

          if (matches.length === 0) {
            resultsList.innerHTML = '';
            noResults.style.display = 'block';
            resultsCount.textContent = 'Sin resultados';
          } else {
            noResults.style.display = 'none';
            resultsCount.textContent = matches.length + ' resultado' + (matches.length !== 1 ? 's' : '');
            resultsList.innerHTML = matches.map(renderProduct).join('');
          }
        };

        input?.addEventListener('input', () => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => doSearch(input.value), 200);
        });

        input?.addEventListener('focus', () => {
          input.style.borderColor = '#FBCAC9';
          input.style.background = '#fff';
        });
        input?.addEventListener('blur', () => {
          input.style.borderColor = '#f0f0f0';
          input.style.background = '#fafafa';
        });

        clearBtn?.addEventListener('click', () => {
          input.value = '';
          doSearch('');
          input.focus();
        });

        drawerInner.querySelectorAll('.pk-search-term').forEach(btn => {
          btn.addEventListener('click', () => {
            const term = (btn as HTMLElement).dataset.term || '';
            input.value = term;
            doSearch(term);
          });
        });

        // Prevent form submission (search inline)
        const oldForm = drawerInner.querySelector('form#search-form');
        if (oldForm) oldForm.addEventListener('submit', (e) => e.preventDefault());

        // Close button
        drawerInner.querySelector('.button-close')?.addEventListener('click', () => {
          searchDrawer.setAttribute('data-hidden', 'true');
          searchDrawer.setAttribute('inert', '');
          document.documentElement.style.overflow = '';
        });
      }
    }

  }, [cartItems, cartTotal, bodyHtml, updateQuantity, removeItem, products, htmlInjected]);

  /* ── Anular enlaces de WhatsApp de Kenia si está desactivada ── */
  useEffect(() => {
    if (!keniaEnabled) {
      const keniaLinks = document.querySelectorAll('a[href*="56936599658"]');
      keniaLinks.forEach((link) => {
        link.removeAttribute('href');
        link.addEventListener('click', (e) => e.preventDefault());
        (link as HTMLElement).style.cursor = 'default';
      });
    }
  }, [keniaEnabled, bodyHtml]);

  /* ── Loading/error states ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/plantilla23/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  if (!bodyHtml) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888' }}>
        {/* Pantalla en blanco mientras carga — no mostrar texto al cliente */}
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Tabbed FAQ Styles */
        .kc-tabbed-faq { position: relative; overflow: hidden; background: #ffffff; padding: 100px 0; font-family: system-ui, -apple-system, sans-serif; }
        .kc-faq-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 10; }
        .kc-faq-header { text-align: center; margin-bottom: 60px; }
        .kc-faq-header h2 { font-size: 3.5rem; font-weight: 900; color: #111827; margin-bottom: 24px; line-height: 1.1; letter-spacing: -1px; }
        .kc-faq-header p { font-size: 1.25rem; color: #6b7280; max-width: 600px; margin: 0 auto; }
        .kc-faq-grid { display: flex; flex-direction: column; gap: 40px; }
        @media (min-width: 1024px) { .kc-faq-grid { flex-direction: row; gap: 60px; align-items: flex-start; } }
        .kc-faq-tabs { flex: 0 0 320px; display: flex; flex-direction: column; gap: 12px; }
        .kc-tab-btn { display: flex; align-items: center; gap: 16px; padding: 18px 24px; border-radius: 16px; font-size: 1.1rem; font-weight: 600; color: #4b5563; background: #f9fafb; border: 1px solid #f3f4f6; cursor: pointer; text-align: left; transition: all 0.3s ease; }
        .kc-tab-btn:hover { background: #f3f4f6; color: #111827; }
        .kc-tab-btn.active { background: #fdf2f8; color: #db2777; border-color: #fbcfe8; box-shadow: 0 4px 14px rgba(225, 29, 72, 0.1); }
        .kc-tab-btn .icon { font-size: 1.4rem; }
        .kc-faq-content-area { flex: 1; min-height: 500px; }
        .kc-faq-pane { display: none; animation: fadeInPane 0.4s ease forwards; }
        .kc-faq-pane.active { display: block; }
        @keyframes fadeInPane { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .kc-faq-pane h3 { font-size: 2rem; font-weight: 800; color: #111827; margin: 0 0 32px 0; padding-bottom: 16px; border-bottom: 2px solid #f3f4f6; }
        .kc-accordion-wrapper { display: flex; flex-direction: column; gap: 16px; }
        .kc-accordion-item { background: #ffffff; border: 1px solid #f3f4f6; border-radius: 20px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }
        .kc-accordion-item:hover { border-color: #fbcfe8; box-shadow: 0 10px 30px rgba(0,0,0,0.04); transform: translateY(-2px); }
        .kc-accordion-item.active { border-color: #fbcfe8; box-shadow: 0 10px 25px -5px rgba(244, 114, 182, 0.2); }
        .kc-accordion-btn { width: 100%; text-align: left; background: transparent; border: none; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-family: inherit; }
        .kc-accordion-btn span:first-child { font-size: 1.15rem; font-weight: 700; color: #1f2937; padding-right: 20px; line-height: 1.4; }
        .kc-icon-wrap { width: 36px; height: 36px; border-radius: 50%; background: #fdf2f8; color: #ec4899; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .kc-icon-wrap svg { width: 20px; height: 20px; }
        .kc-accordion-item.active .kc-icon-wrap { transform: rotate(45deg); }
        .kc-accordion-content { padding: 0 32px; display: none; }
        .kc-accordion-content p { color: #4b5563; line-height: 1.7; font-size: 1.05rem; padding-bottom: 24px; margin: 0; }

        /* ── FAQ MOBILE OVERRIDES ── */
        @media (max-width: 767px) {
          .kc-tabbed-faq { padding: 48px 0 32px; }
          .kc-faq-header { margin-bottom: 28px; }
          .kc-faq-header h2 { font-size: 1.85rem !important; margin-bottom: 12px; letter-spacing: -0.5px; }
          .kc-faq-header p { font-size: 0.95rem; }
          .kc-faq-container { padding: 0 16px; }
          .kc-faq-tabs { flex: none; flex-direction: row; overflow-x: auto; gap: 8px; padding-bottom: 4px; -ms-overflow-style: none; scrollbar-width: none; }
          .kc-faq-tabs::-webkit-scrollbar { display: none; }
          .kc-tab-btn { padding: 10px 16px; font-size: 0.85rem; gap: 8px; white-space: nowrap; flex-shrink: 0; border-radius: 20px; }
          .kc-tab-btn .icon { font-size: 1rem; }
          .kc-faq-content-area { min-height: auto; }
          .kc-faq-pane h3 { font-size: 1.35rem; margin-bottom: 16px; }
          .kc-accordion-btn { padding: 16px 20px; }
          .kc-accordion-btn span:first-child { font-size: 0.9rem; }
          .kc-accordion-content { padding: 0 20px; }
          .kc-accordion-content p { font-size: 0.9rem; padding-bottom: 16px; }
          .kc-icon-wrap { width: 28px; height: 28px; }
          .kc-icon-wrap svg { width: 16px; height: 16px; }
          .kc-accordion-wrapper { gap: 10px; }
          .kc-accordion-item { border-radius: 14px; }
          .kc-accordion-item:hover { transform: none; }
        }

        /* Scoped override for plantilla23 dynamic megamenu styling */
        .tpl23-shopify-root .menu--megamenu-hover-split-grandchild {
          display: none !important;
        }
        .tpl23-shopify-root .menu--megamenu-hover-split-grandchild[data-hidden="false"] {
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          max-width: none !important;
          padding-left: 2.5rem !important;
          padding-right: 1.5rem !important;
          overflow: hidden !important;
        }
        /* Product grid: 4 cards in a row */
        .tpl23-shopify-root .megamenu-product-grid {
          display: flex !important;
          flex-wrap: nowrap !important;
          gap: 12px !important;
          width: 100% !important;
          overflow: hidden !important;
        }
        .tpl23-shopify-root .megamenu-product-grid a {
          width: 25% !important;
          min-width: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          box-sizing: border-box !important;
          padding: 0 8px !important;
        }
        /* Force image sizing */
        .tpl23-shopify-root .megamenu-product-grid img {
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          max-height: none !important;
          object-fit: cover !important;
        }
        /* Hide scrollbars inside megamenu */
        .tpl23-shopify-root .scroll-area {
          overflow: hidden !important;
          scrollbar-width: none !important;
        }
        .tpl23-shopify-root .scroll-area::-webkit-scrollbar {
          display: none !important;
        }

        /* --- PREMIUM CART & SEARCH DRAWER OVERRIDES & ANIMATIONS --- */
        .added-to-cart-popup {
          z-index: 10005 !important;
        }
        cart-drawer.cart-drawer, search-drawer.search-drawer,
        .cart-drawer, .search-drawer {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          z-index: 10005 !important;
          display: block !important;
          left: auto !important;
          right: 0 !important;
          overflow: visible !important;
          transition: background-color 0.4s ease, visibility 0.4s !important;

          /* Default state: hidden */
          visibility: hidden !important;
          pointer-events: none !important;
          background-color: rgba(0, 0, 0, 0) !important;
        }

        /* Visible states */
        cart-drawer[data-hidden="false"], search-drawer[data-hidden="false"],
        .cart-drawer[data-hidden="false"], .search-drawer[data-hidden="false"],
        cart-drawer[open], search-drawer[open],
        cart-drawer.active, search-drawer.active,
        cart-drawer.is-active, search-drawer.is-active {
          visibility: visible !important;
          pointer-events: auto !important;
          background-color: rgba(0, 0, 0, 0.4) !important;
        }

        cart-drawer, search-drawer, .cart-drawer, .search-drawer {
          font-family: 'Outfit', 'Inter', sans-serif !important;
        }

        cart-drawer .drawer__inner, search-drawer .drawer__inner,
        .cart-drawer .drawer__inner, .search-drawer .drawer__inner {
          background-color: #ffffff !important;
          border-left: none !important;
          box-shadow: -16px 0 48px rgba(0,0,0,0.1) !important;
          max-width: 420px !important;
          width: 420px !important;
          display: flex !important;
          flex-direction: column !important;
          padding-top: 20px !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          transform: translateX(100%) !important;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* Inner translated visible states */
        cart-drawer[data-hidden="false"] .drawer__inner, search-drawer[data-hidden="false"] .drawer__inner,
        .cart-drawer[data-hidden="false"] .drawer__inner, .search-drawer[data-hidden="false"] .drawer__inner,
        cart-drawer[open] .drawer__inner, search-drawer[open] .drawer__inner,
        cart-drawer.active .drawer__inner, search-drawer.active .drawer__inner,
        cart-drawer.is-active .drawer__inner, search-drawer.is-active .drawer__inner {
          transform: translateX(0) !important;
        }

        search-drawer .drawer__inner, .search-drawer .drawer__inner {
          padding-top: 0 !important;
        }

        @media (max-width: 480px) {
          cart-drawer .drawer__inner, search-drawer .drawer__inner,
          .cart-drawer .drawer__inner, .search-drawer .drawer__inner {
            max-width: 100vw !important;
            width: 100vw !important;
          }
        }
        cart-drawer .button-close {
          top: 16px !important;
          right: 16px !important;
          width: 34px !important;
          height: 34px !important;
          border-radius: 10px !important;
          background: #fdf2f2 !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
          color: #e88b8a !important;
          transition: all 0.2s !important;
        }
        cart-drawer .button-close:hover {
          background: #FBCAC9 !important;
          color: #fff !important;
        }
        cart-drawer .button-close svg {
          width: 16px !important;
          height: 16px !important;
        }
        cart-drawer .cart-items-wrapper {
          padding-left: 20px !important;
          padding-right: 20px !important;
          padding-top: 10px !important;
        }
        cart-drawer .cart-item {
          border: none !important;
          border-radius: 14px !important;
        }
        cart-drawer .cart-item:hover {
          background: #f5f5f5 !important;
        }
        cart-drawer .cart-qty-btn:hover {
          color: #FBCAC9 !important;
          background: #fdf2f2 !important;
        }
        cart-drawer .cart-remove-btn {
          color: #d1d5db !important;
          transition: all 0.15s !important;
        }
        cart-drawer .cart-remove-btn:hover {
          color: #ef4444 !important;
          background: #fef2f2 !important;
        }
        cart-drawer .checkout-redirect-btn:hover {
          box-shadow: 0 6px 24px rgba(251,202,201,0.5) !important;
          transform: translateY(-1px) !important;
        }
        cart-drawer .pk-explore-btn:hover {
          box-shadow: 0 6px 24px rgba(251,202,201,0.5) !important;
          transform: translateY(-1px) !important;
        }
        cart-drawer .pk-cart-items-list::-webkit-scrollbar {
          width: 4px !important;
        }
        cart-drawer .pk-cart-items-list::-webkit-scrollbar-track {
          background: transparent !important;
        }
        cart-drawer .pk-cart-items-list::-webkit-scrollbar-thumb {
          background: #FBCAC9 !important;
          border-radius: 50px !important;
        }


        search-drawer #pk-search-input {
          outline: none !important;
          box-shadow: none !important;
        }
        search-drawer #pk-search-input:focus {
          border-color: #FBCAC9 !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(251,202,201,0.15) !important;
        }
        search-drawer .pk-search-term:hover {
          background: linear-gradient(135deg, #FBCAC9 0%, #f4a8a7 100%) !important;
          color: #fff !important;
          border-color: transparent !important;
        }
        search-drawer .pk-search-result:hover {
          background: #f9fafb !important;
        }
        search-drawer .button-close:hover {
          background: #FBCAC9 !important;
          color: #fff !important;
        }
        @media (max-width: 480px) {
          search-drawer .drawer__inner {
            max-width: 100vw !important;
            width: 100vw !important;
          }
        }

        /* --- KILL STICKY HOVER SHADOWS ON TOUCH/MOBILE --- */
        @media (hover: none), (max-width: 768px) {
          .tpl23-shopify-root *:hover {
            --tw-shadow: 0 0 #0000 !important;
          }
          .tpl23-shopify-root .card-hover:hover,
          .tpl23-shopify-root [class*="hover:shadow"]:hover,
          .tpl23-shopify-root .group:hover [class*="group-hover:shadow"] {
            box-shadow: none !important;
          }
          .tpl23-shopify-root [class*="hover:scale"]:hover,
          .tpl23-shopify-root [class*="hover:-translate"]:hover,
          .tpl23-shopify-root [class*="hover:translate"]:hover {
            transform: none !important;
          }
          .tpl23-shopify-root .latest-product-card:hover,
          .tpl23-shopify-root .kc-accordion-item:hover,
          .tpl23-shopify-root .pk-drawer-rec-card:hover {
            box-shadow: none !important;
            transform: none !important;
          }
          .tpl23-shopify-root h1:hover,
          .tpl23-shopify-root h2:hover,
          .tpl23-shopify-root h3:hover,
          .tpl23-shopify-root h4:hover,
          .tpl23-shopify-root h5:hover,
          .tpl23-shopify-root h6:hover,
          .tpl23-shopify-root p:hover,
          .tpl23-shopify-root span:hover,
          .tpl23-shopify-root div:hover,
          .tpl23-shopify-root section:hover,
          .tpl23-shopify-root a:hover,
          .tpl23-shopify-root button:hover,
          .tpl23-shopify-root .heading:hover,
          .tpl23-shopify-root .section-heading:hover {
            box-shadow: none !important;
          }
          cart-drawer .pk-drawer-rec-card:hover {
            border-color: #f0f0f0 !important;
            box-shadow: none !important;
            transform: none !important;
          }
        }

        /* --- SPLASH SCREEN --- */
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #FBCAC9;
          z-index: 9999999;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
        }
        .splash-screen.hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        @keyframes pulseLogo {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        .splash-logo {
          width: 750px;
          max-width: 90%;
          animation: pulseLogo 2s infinite ease-in-out;
          filter: drop-shadow(0 4px 15px rgba(255,255,255,0.4));
        }
        @media (max-width: 768px) {
          .splash-logo {
            width: 280px;
          }
        }

        /* Hero Banner 1 auto-height to match image aspect ratio */
        .tpl23-shopify-root .slideshow {
          height: auto !important;
          min-height: unset !important;
        }
        .tpl23-shopify-root .slideshow parallax-element-section,
        .tpl23-shopify-root .slideshow .hero-no-swiper-container,
        .tpl23-shopify-root .slideshow .hero-no-swiper-wrapper {
          height: auto !important;
          min-height: unset !important;
        }
        .tpl23-shopify-root .slideshow__slide {
          height: auto !important;
          min-height: unset !important;
          position: relative !important;
        }
        .tpl23-shopify-root .slideshow__background {
          position: relative !important;
          height: auto !important;
          width: 100% !important;
          display: block !important;
          background-color: transparent !important;
        }
        /* Ensure all slide media (videos/images) are absolute so only the dummy dictates height */
        .tpl23-shopify-root .slideshow__background video,
        .tpl23-shopify-root .slideshow__background img:not(.dummy-desk):not(.dummy-mob) {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        /* Hero images are now absolute overlays — let inline styles + HTML classes handle them */
        .tpl23-shopify-root #hero1-image-desktop,
        .tpl23-shopify-root #hero1-image-mobile {
          position: absolute !important;
        }
        /* Force ALL slideshow wrapper heights to auto so Shopify's JS-set heights don't create gaps */
        .tpl23-shopify-root custom-slideshow,
        .tpl23-shopify-root parallax-element-section,
        .tpl23-shopify-root .hero-no-swiper-container,
        .tpl23-shopify-root .hero-no-swiper-wrapper,
        .tpl23-shopify-root .hero-no-swiper-wrapper > div {
          height: auto !important;
          min-height: unset !important;
          max-height: unset !important;
        }
        .tpl23-shopify-root .slideshow__content {
          display: none !important;
        }

        /* ── GLOBAL MOBILE OVERRIDES for tpl23 ── */
        @media (max-width: 767px) {
          /* Ensure template root doesn't overflow horizontally */
          .tpl23-shopify-root {
            max-width: 100vw !important;
            overflow-x: clip !important;
          }

          /* Pack timer / offer carousel: full width on mobile */
          #yaxsell-homepage-offers-carousel {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 8px !important;
            box-sizing: border-box !important;
          }
          #yaxsell-homepage-offers-carousel > div:not(.yxs-offers-header):not(.yxs-offers-grid):not(.yxs-offers-divider) {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 8px !important;
            box-sizing: border-box !important;
          }
          /* Offer cards: 1 column on mobile (2 per row was crowding) */
          #yaxsell-homepage-offers-carousel .offer-card-hover {
            width: 100% !important;
            min-width: 100% !important;
          }
          /* Reduce offer card padding on mobile */
          .offer-card-hover {
            padding: 12px !important;
          }

          /* Featured product: stack vertically on mobile */
          .tpl23-shopify-root featured-product {
            display: block !important;
          }

          /* Product card: prevent overflow */
          .tpl23-shopify-root product-card {
            max-width: 100% !important;
            width: 100% !important;
          }

          /* Swiper containers: enforce full width on mobile */
          .tpl23-shopify-root .swiper-container {
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Collection list categories: square tiles */
          .tpl23-shopify-root .collection-list .collection-card__image-wrapper {
            aspect-ratio: 1 / 1 !important;
          }

          /* Prevent Shopify section headers from being too large on mobile */
          .tpl23-shopify-root .custom-container h2,
          .tpl23-shopify-root .section-heading h2 {
            font-size: clamp(1.4rem, 6vw, 2.2rem) !important;
          }

        }
        cart-drawer * {
          -webkit-tap-highlight-color: transparent !important;
        }
        cart-drawer .pk-drawer-rec-card:hover {
          border-color: #FBCAC9 !important;
          box-shadow: 0 4px 16px rgba(251,202,201,0.15) !important;
          transform: translateY(-2px) !important;
        }
        cart-drawer .pk-drawer-rec-card:active,
        cart-drawer .pk-drawer-rec-card:focus {
          border-color: #FBCAC9 !important;
          box-shadow: none !important;
          transform: none !important;
          outline: none !important;
        }
        cart-drawer .pk-drawer-rec-card .pk-grid-add-to-cart:hover {
          background: linear-gradient(135deg, #f4a8a7 0%, #e89695 100%) !important;
          box-shadow: 0 4px 12px rgba(251,202,201,0.4) !important;
          transform: scale(1.1) !important;
        }
        cart-drawer .pk-drawer-rec-card .pk-grid-add-to-cart:active {
          transform: scale(0.95) !important;
        }

        cart-drawer .drawer__recommendation-wrapper {
          background-color: #ffffff !important;
          padding-top: 24px !important;
        }
        cart-drawer .drawer__recommendation-wrapper h6.heading {
          font-size: 15px !important;
          font-weight: 800 !important;
          color: #111827 !important;
          padding-bottom: 14px !important;
          margin-bottom: 0 !important;
          border-bottom: 2px solid #FBCAC9 !important;
          margin-left: 16px !important;
          margin-right: 16px !important;
          text-align: left !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        cart-drawer .drawer__recommendation-wrapper h6.heading span {
          color: #111827 !important;
        }
        cart-drawer .drawer__recommendation-wrapper h6.heading::before {
          content: '✨' !important;
          font-size: 14px !important;
        }

        /* Diseño responsivo de Featured Collection en Móviles (apilar verticalmente) */
        @media (max-width: 767.98px) {
          .featured-collection__products-inner {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .featured-collection__first-product-wrapper {
            max-width: 100% !important;
            width: 100% !important;
          }
          /* Force slide visibility even if swiper hasn't initialized */
          .featured-collection .swiper-container:not(.swiper-container--product-card) .swiper-slide {
            visibility: visible !important;
          }
          /* Ensure featured-collection products are always visible on mobile */
          .featured-collection .featured-collection__products {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            position: relative !important;
          }
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

      <div className={`splash-screen ${!showSplash ? 'hidden' : ''}`}>
        <img src="https://firebasestorage.googleapis.com/v0/b/asistoraerp.firebasestorage.app/o/KEVIN%26COCO%2F%EC%A0%9C%EB%AA%A9%20%EC%97%86%EC%9D%8C-1.png?alt=media&token=a5def232-086e-4ae8-a49b-476b8f4397a7" alt="Cargando Kevin & Coco..." className="splash-logo" />
      </div>

      <div
        ref={containerRef}
        className="tpl23-shopify-root template-index"
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

      {offersCarouselContainer && offersProducts.length > 0 && createPortal(
        (() => {
          const FF = '"DM Sans","Proxima Nova",-apple-system,BlinkMacSystemFont,sans-serif';
          const primaryColor = '#e396bf';
          const shadowColorLight = 'rgba(227,150,191,0.12)';
          return (
            <div style={{ background: '#fff', position: 'relative', zIndex: 11, padding: '24px 0 40px' }}>
              <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 12px' }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#374151', margin: 0, fontFamily: FF }}>🔥 Ofertas del día</h2>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0', fontFamily: FF }}>Productos en oferta por tiempo limitado</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { const el = document.getElementById('tpl23-offers-carousel-scroll'); if (el) el.scrollBy({ left: -268, behavior: 'smooth' }); }} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #fce7f3', background: '#fff', color: primaryColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${shadowColorLight}`, flexShrink: 0 }}>
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => { const el = document.getElementById('tpl23-offers-carousel-scroll'); if (el) el.scrollBy({ left: 268, behavior: 'smooth' }); }} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #fce7f3', background: '#fff', color: primaryColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${shadowColorLight}`, flexShrink: 0 }}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div id="tpl23-offers-carousel-scroll" style={{ display: 'flex', gap: 16, padding: '0 24px 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                  {offersProducts.map(p => {
                    const offerPrice = p.CURRENTPRICE || 0;
                    const origPrice = p.PRICE || 0;
                    const discPct = origPrice > 0 ? Math.round((1 - offerPrice / origPrice) * 100) : 0;
                    const cFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
                    const cTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
                    const cSku = getSkuFromFeatures(cFeatures, cTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
                    const expiresAtMs = p.UNIT_OFFER_EXPIRES_AT || 0;
                    const minQty = (p.WHOLESALEMINQUANTITY && p.WHOLESALEMINQUANTITY > 1) ? p.WHOLESALEMINQUANTITY : 1;
                    return (
                      <div key={p.$id} style={{ minWidth: 204, maxWidth: 224, flex: '0 0 auto', background: '#fff', borderRadius: 18, border: '1px solid #fce7f3', overflow: 'hidden', boxShadow: `0 4px 14px ${shadowColorLight}`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        {discPct > 0 && (
                          <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2, background: '#e396bf', color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 900, padding: '3px 9px' }}>-{discPct}%</div>
                        )}
                        <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f8f9fa', cursor: 'pointer', overflow: 'hidden' }} onClick={() => window.location.href = `/productos/${p.$id}`}>
                          {getProductImageUrl(p) ? (
                            <Image src={getProductImageUrl(p)} alt={p.NAME} fill style={{ objectFit: 'cover' }} sizes="224px" unoptimized />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 42, color: '#fce7f3' }}>🛍️</div>
                          )}
                        </div>
                        <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {cSku && <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>SKU: {cSku}</div>}
                          <Link prefetch={false} href={`/productos/${p.$id}`} style={{ textDecoration: 'none' }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', minHeight: 36 }}>{p.NAME}</p>
                          </Link>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                            <span style={{ fontSize: 19, fontWeight: 900, color: '#e396bf', letterSpacing: '-0.02em', fontFamily: FF }}>{formatPrice(offerPrice)}</span>
                            {discPct > 0 && <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>{formatPrice(origPrice)}</span>}
                          </div>
                          {minQty > 1 && (
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#db2777' }}>Desde {minQty} unidades</div>
                          )}
                          {expiresAtMs > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444' }}>
                              <Clock size={11} className="animate-pulse" />
                              <CountdownTimer expiresAt={Math.floor(expiresAtMs / 1000)} compact />
                            </div>
                          )}
                          <button
                            onClick={() => (p.STOCK || 0) > 0 && addItem(p, minQty)}
                            disabled={(p.STOCK || 0) <= 0}
                            style={{ marginTop: 'auto', padding: '9px 12px', borderRadius: 12, border: 'none', background: (p.STOCK || 0) <= 0 ? '#f3f4f6' : 'linear-gradient(135deg,#fdf2f8,#fce7f3)', color: (p.STOCK || 0) <= 0 ? '#9ca3af' : '#c0547a', fontSize: 12, fontWeight: 700, cursor: (p.STOCK || 0) <= 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: FF }}
                          >
                            <ShoppingCart size={13} /> {(p.STOCK || 0) <= 0 ? 'Sin stock' : (minQty > 1 ? `Agregar ${minQty}` : 'Agregar')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })(),
        offersCarouselContainer
      )}

      {wholesaleOffersContainer && createPortal(
        <WholesaleOffersSection initialProducts={products} />,
        wholesaleOffersContainer
      )}

      {latestProductsContainer && createPortal(
        <LatestProductsCarousel initialProducts={products} />,
        latestProductsContainer
      )}

    </>
  );
}
