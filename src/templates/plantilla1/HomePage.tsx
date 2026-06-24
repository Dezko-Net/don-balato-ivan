'use client';
/* ════════════════════════════════════════════════════════════════════
   PLANTILLA 1 — Shopify "Mi tienda 3" (Tema Venice)
   ──────────────────────────────────────────────────────────────────
   Migrada desde public/shopify/index.html (385 KB, ~22 secciones).
   Estrategia: render del HTML body limpio via dangerouslySetInnerHTML
   + carga dinámica de los CSS/JS originales del tema Venice.
   Las secciones se irán componentizando a JSX gradualmente para hacerlas
   editables desde el editor de secciones (sh_navbar, sh_hero, ...).
   ════════════════════════════════════════════════════════════════════ */
import '@/templates/plantilla1/theme.css';
import '@/templates/plantilla1/mobile-responsive.css';
import { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { getSectionConfig, getSectionConfigAsync, invalidateSectionCache, isSectionEnabled, applyTpl1SectionsVisibility, type SectionConfig, type CollectionItem, type MediaGalleryItem } from '@/lib/section-config';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, TIMED_OFFERS_COLLECTION, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION, HOTSPOT_PANELS_COLLECTION, BANNER_OVERLAY_POSITIONS_COLLECTION, MEDIA_BUCKET_ID, MEDIA_PREFIXES } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { Product, TimedOffer, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { usePrimaryAddress } from '@/hooks/usePrimaryAddress';
import { useNotifications } from '@/context/NotificationContext';
import NotificationsOverlay from '@/components/NotificationsOverlay';
import {
  syncAddressesForUser,
  getPrimaryAddressLabel,
  TPL1_OPEN_NOTIFICATIONS,
  TPL1_ADDRESS_UPDATED,
} from '@/lib/addresses';
import { formatPrice } from '@/lib/appwrite';
import CouponBanner from '@/components/CouponBanner';
import { getWhatsAppUrl, openChatbot } from '@/lib/store-contact';
import HeroSkeletonMobile from '@/components/HeroSkeletonMobile';
import { scheduleHomeHeaderAvatarSync } from '@/lib/home-header-avatar';
import { applyTpl1SectionColors, paintTpl1Text } from '@/lib/tpl1-section-text';
import { normalizeProductImages, getProductImageUrl, resolveStorageImageUrl } from '@/lib/product-images';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie from 'lottie-web';
import './shopify-fix.css';
import './tpl1-collections-premium.css';
import './mobile-responsive.css';

/* ── Mapeo: ID de sección en config → ID del elemento en el HTML de Shopify ── */
const TPL1_SECTION_HTML_MAP: Record<string, string> = {
  // Header group (fixed)
  tpl1_announcement_bar: 'shopify-section-sections--22405132747000__announcement_bar_B8FdRK',
  tpl1_hero: 'shopify-section-template--22405132419320__hero_banner_R6iEJ4',
  tpl1_coupon_banner: 'tpl1-coupon-banner-section',
  // Body sections (reorderable)
  tpl1_collection_list: 'shopify-section-template--22405132419320__collection_list_WrFbPe',
  tpl1_marquee: 'shopify-section-template--22405132419320__marquee_mdGXX9',
  tpl1_featured_collection: 'shopify-section-template--22405132419320__featured_collection_UNXLgP',
  tpl1_media_gallery: 'shopify-section-template--22405132419320__two_column_grid_WxQiPG',
  tpl1_featured_product: 'shopify-section-template--22405132419320__featured_product_mtqd9n',
  tpl1_countdown: 'shopify-section-template--22405132419320__countdown_timer_hYJrNM',
  tpl1_products_filter: 'shopify-section-template--22405132419320__collection_tab_NGBXPp',
  tpl1_before_after: 'shopify-section-template--22405132419320__before_after_3VVXkq',
  tpl1_faq: 'shopify-section-template--22405132419320__faq_8cUkFL',
  tpl1_shop_the_look: 'shopify-section-template--22405132419320__shop_the_look_tmNjgg',
  tpl1_marquee_2: 'shopify-section-template--22405132419320__marquee_nP83AA',
  tpl1_image_overlay: 'shopify-section-template--22405132419320__image_with_text_overlay_4tEGkd',
  tpl1_video_text: 'shopify-section-template--22405132419320__image_video_with_text_LEtqmt',
  tpl1_testimonials: 'shopify-section-template--22405132419320__testimonial_hf6Hpn',
  tpl1_brand_logos: 'shopify-section-template--22405132419320__brand_logos_N9XpeF',
  tpl1_blog: 'shopify-section-template--22405132419320__blog_THeqL4',
  tpl1_service_icons: 'shopify-section-template--22405132419320__icon_with_text_7MGWAj',
  // Footer group (fixed)
  tpl1_subscribe_popup: 'shopify-section-sections--22405132714232__subscribe_popup_GX8btz',
  tpl1_whatsapp_button: 'tpl1-whatsapp-button',
  tpl1_chatbot_button: 'tpl1-chatbot-button',
  tpl1_footer: 'shopify-section-sections--22405132714232__footer_pzLNtW',
};

// Mapeo inverso: HTML ID → config ID (para hover/click en elementos con data-section-id original)
const HTML_ID_TO_CONFIG_ID = Object.fromEntries(
  Object.entries(TPL1_SECTION_HTML_MAP).map(([configId, htmlId]) => [htmlId, configId])
);

// Mapeo inverso: data-section-id (Shopify) → config ID
const SHOPIFY_DATA_SECTION_ID_TO_CONFIG_ID: Record<string, string> = {
  'sections--22405132747000__announcement_bar_B8FdRK': 'tpl1_announcement_bar',
  'template--22405132419320__hero_banner_R6iEJ4': 'tpl1_hero',
  'tpl1-coupon-banner-section': 'tpl1_coupon_banner',
  'template--22405132419320__collection_list_WrFbPe': 'tpl1_collection_list',
  'template--22405132419320__marquee_mdGXX9': 'tpl1_marquee',
  'template--22405132419320__featured_collection_UNXLgP': 'tpl1_featured_collection',
  'template--22405132419320__two_column_grid_WxQiPG': 'tpl1_media_gallery',
  'template--22405132419320__featured_product_mtqd9n': 'tpl1_featured_product',
  'template--22405132419320__countdown_timer_hYJrNM': 'tpl1_countdown',
  'template--22405132419320__collection_tab_NGBXPp': 'tpl1_products_filter',
  'template--22405132419320__before_after_3VVXkq': 'tpl1_before_after',
  'template--22405132419320__faq_8cUkFL': 'tpl1_faq',
  'template--22405132419320__shop_the_look_tmNjgg': 'tpl1_shop_the_look',
  'template--22405132419320__marquee_nP83AA': 'tpl1_marquee_2',
  'template--22405132419320__image_with_text_overlay_4tEGkd': 'tpl1_image_overlay',
  'template--22405132419320__image_video_with_text_LEtqmt': 'tpl1_video_text',
  'template--22405132419320__testimonial_hf6Hpn': 'tpl1_testimonials',
  'template--22405132419320__brand_logos_N9XpeF': 'tpl1_brand_logos',
  'template--22405132419320__blog_THeqL4': 'tpl1_blog',
  'template--22405132419320__icon_with_text_7MGWAj': 'tpl1_service_icons',
  'sections--22405132714232__subscribe_popup_GX8btz': 'tpl1_subscribe_popup',
  'sections--22405132714232__footer_pzLNtW': 'tpl1_footer',
};

gsap.registerPlugin(ScrollTrigger);

const SHOPIFY_BASE = '/shopify/assets';

/* ── CSS files cargados desde public/shopify/ ──
   ORDEN CRÍTICO: el inline-1 contiene el CSS extraído de los <style> del head
   original; sin él la página queda sin estilos (layout, colores, fonts). */
const CSS_FILES = [
  `${SHOPIFY_BASE}/css/inline/index-inline-1.css`,
  `${SHOPIFY_BASE}/css/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/vendor-riji0f.css`,
  `${SHOPIFY_BASE}/css/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/style-i86hs0.css`,
  `${SHOPIFY_BASE}/css/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/newsletter-validation-lobua.css`,
];

/* ── JS files críticos. type="module" => mismo módulo, scope aislado ──
   page-load es módulo (top-level "let i" colisiona si se carga como classic). */
type JsFile = { src: string; module?: boolean; inlineScript?: string; postLoad?: () => void };
const JS_FILES: JsFile[] = [
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/pubsub-lg5xyg.js` },
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/global-t8fxpe.js` },
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/base-iht69b.js` },
  {
    src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/bootstrap-bm2tdv.js`, postLoad: () => {
      // Fix: remove data-bs-toggle from elements whose targets don't exist in DOM
      // This prevents Bootstrap's qi._isShown from crashing on null.classList
      document.querySelectorAll('[data-bs-toggle], [data-toggle]').forEach((el) => {
        const targetSel = (el as HTMLElement).getAttribute('data-bs-target')
          || (el as HTMLElement).getAttribute('data-target')
          || (el as HTMLElement).getAttribute('href');
        if (targetSel && targetSel !== '#' && !document.querySelector(targetSel)) {
          console.warn('[Plantilla1] Bootstrap: removing toggle from element with missing target:', targetSel, el);
          (el as HTMLElement).removeAttribute('data-bs-toggle');
          (el as HTMLElement).removeAttribute('data-toggle');
        }
      });
    }
  },
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/swiper-slider-component-jszp6n.patched.js` },
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/lazy-images-laxzs0.js` },
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/main-vwayah.patched.js?v=tpl1-gsap-heading-10` },
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/newsletter-validation-wqoe5v.js` },
  { src: `${SHOPIFY_BASE}/js/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/page-load-26tzae.js`, module: true },
];

/* ── Fonts preload (DM Sans, Poppins, Smooch) ── */
const FONT_FACE_CSS = `
@font-face {
  font-family: "DM Sans";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url(${SHOPIFY_BASE}/fonts/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/fonts/dm_sans/dmsans_n4.ec80bd4dd7e1a334c969c265873491ae56018d72.woff2) format("woff2");
}
@font-face {
  font-family: "DM Sans";
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url(${SHOPIFY_BASE}/fonts/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/fonts/dm_sans/dmsans_n7.97e21d81502002291ea1de8aefb79170c6946ce5.woff2) format("woff2");
}
@font-face {
  font-family: Poppins;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url(${SHOPIFY_BASE}/fonts/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/fonts/poppins/poppins_n4.0ba78fa5af9b0e1a374041b3ceaadf0a43b41362.woff2) format("woff2");
}
@font-face {
  font-family: Smooch;
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url(${SHOPIFY_BASE}/fonts/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/fonts/smooch/smooch_n4.f6ac9902b2e55842f0c3ee19f0a0d6c52b461558.woff2) format("woff2");
}
`;

/* ── Mobile Countdown — simple compact version for devices ≤768px ── */
function MobileCountdown({ title, subtitle, endTimeMs, bgImage, buttonHref }: {
  title: string; subtitle: string; endTimeMs: number | null; bgImage: string; buttonHref: string;
}) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!endTimeMs) return;
    const tick = () => {
      const ms = endTimeMs - Date.now();
      if (ms <= 0) { setExpired(true); setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTimeMs]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      background: bgImage ? `url(${bgImage}) center top/cover no-repeat` : 'linear-gradient(135deg, #1a1a2e, #16213e)',
      minHeight: bgImage ? 480 : 280,
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'transparent', zIndex: 1 }} />

      {/* Content card */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%',
        padding: '20px 16px 24px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px 16px 0 0',
      }}>
        {/* Title */}
        {title && (
          <h2 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#1f2937', lineHeight: 1.2, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: '#ec4899', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            {subtitle}
          </p>
        )}

        {/* Countdown digits */}
        {!expired && endTimeMs && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[
              { val: timeLeft.d, label: 'Días' },
              { val: timeLeft.h, label: 'Hrs' },
              { val: timeLeft.m, label: 'Min' },
              { val: timeLeft.s, label: 'Seg' },
            ].map(item => (
              <div key={item.label} style={{
                flex: 1, textAlign: 'center',
                background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
                borderRadius: 10, padding: '8px 2px',
                border: '1px solid rgba(236,72,153,0.15)',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#ec4899', lineHeight: 1, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  {String(item.val).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#9ca3af', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {expired && (
          <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: '#9ca3af', textAlign: 'center' }}>
            OFERTA CADUCADA
          </p>
        )}

        {/* CTA Button */}
        <a href={expired ? undefined : buttonHref} style={{
          display: 'block', width: '100%', textAlign: 'center',
          padding: '10px 0', borderRadius: 999,
          background: expired ? '#d1d5db' : 'linear-gradient(135deg, #ec4899, #db2777)',
          color: '#fff', fontSize: 13, fontWeight: 700,
          textDecoration: 'none', fontFamily: "'DM Sans', system-ui, sans-serif",
          pointerEvents: expired ? 'none' : 'auto',
          boxShadow: expired ? 'none' : '0 4px 14px rgba(236,72,153,0.3)',
        }}>
          {expired ? 'OFERTA CADUCADA' : 'COMPRAR AHORA'}
        </a>
      </div>
    </div>
  );
}

function collectionItemHref(item: CollectionItem): string {
  if (item.categoryId) return `/categoria/${item.categoryId}`;
  if (item.link && item.link.startsWith('/')) return item.link;
  return item.link || '/productos';
}

export default function HomePage1() {
  const { primaryAddress } = usePrimaryAddress();
  // usePrimaryAddress calls useAuth internally — get user/isLoggedIn from there
  const { user, isLoggedIn } = useAuth();
  // Refs to use inside useEffect without adding to deps (avoids TDZ issues)
  const primaryAddressRef = useRef(primaryAddress);
  primaryAddressRef.current = primaryAddress;
  const isLoggedInRef = useRef(isLoggedIn);
  isLoggedInRef.current = isLoggedIn;
  const containerRef = useRef<HTMLDivElement>(null);
  const couponRootRef = useRef<Root | null>(null);
  const keniaBannerRootRef = useRef<Root | null>(null);
  const countdownMobileRootRef = useRef<Root | null>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sectionCfg, setSectionCfg] = useState<SectionConfig[]>([]);
  const [settingsApplied, setSettingsApplied] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [countdownOffer, setCountdownOffer] = useState<TimedOffer | null>(null);
  const [countdownProduct, setCountdownProduct] = useState<Product | null>(null);
  const [keniaEnabled, setKeniaEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/public-data/kenia-status')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.isEnabled === 'boolean') {
          setKeniaEnabled(data.isEnabled);
        }
      })
      .catch(() => {});
  }, []);

  /* ── Mark template attribute on document for CSS scoping ── */
  useEffect(() => {
    document.documentElement.dataset.template = '1';
    return () => { delete document.documentElement.dataset.template; };
  }, []);

  useEffect(() => {
    getSectionConfigAsync().then(setSectionCfg).catch(() => setSectionCfg(getSectionConfig()));
  }, []);

  // cache wiping logic on visibilitychange removed for performance and cost reduction

  /* Reaplicar visibilidad de secciones (después de otros effects que tocan display) */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const apply = () => applyTpl1SectionsVisibility(sectionCfg, TPL1_SECTION_HTML_MAP);
    apply();
    const raf = requestAnimationFrame(() => requestAnimationFrame(apply));
    const t1 = window.setTimeout(apply, 400);
    const t2 = window.setTimeout(apply, 1500);
    const t3 = window.setTimeout(apply, 3500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [bodyHtml, sectionCfg]);

  useEffect(() => {
    function handleEditorMsg(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'te:reloadConfig') {
        if (e.data.sections) {
          setSectionCfg(e.data.sections);
        } else {
          invalidateSectionCache();
          setSectionCfg(getSectionConfig());
        }
      }
      if (e.data.type === 'te:scrollTo' && e.data.sectionId) {
        const htmlId = TPL1_SECTION_HTML_MAP[e.data.sectionId as string];
        const el = htmlId ? document.getElementById(htmlId) : document.querySelector(`[data-section-id="${e.data.sectionId}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (e.data.type === 'te:highlight' && e.data.sectionId) {
        document.querySelectorAll('.te-highlight').forEach(el => el.classList.remove('te-highlight'));
        const htmlId = TPL1_SECTION_HTML_MAP[e.data.sectionId as string];
        const el = htmlId ? document.getElementById(htmlId) : document.querySelector(`[data-section-id="${e.data.sectionId}"]`);
        if (el) el.classList.add('te-highlight');
      }
      if (e.data.type === 'te:unhighlight') {
        document.querySelectorAll('.te-highlight').forEach(el => el.classList.remove('te-highlight'));
      }
    }
    window.addEventListener('message', handleEditorMsg);
    return () => window.removeEventListener('message', handleEditorMsg);
  }, []);

  /* ── Editor interaction: click + hover on sections (iframe → editor) ── */
  useEffect(() => {
    if (!bodyHtml) return;
    // Only enable editor interactions when inside the theme editor iframe
    const isInsideEditor = window.parent !== window;
    if (!isInsideEditor) return;

    const getLabel = (id: string) => {
      const labels: Record<string, string> = {
        tpl1_announcement_bar: 'Barra de Anuncio', tpl1_hero: 'Hero Banner',
        tpl1_collection_list: 'Colecciones', tpl1_marquee: 'Texto Animado',
        tpl1_featured_collection: 'Colección Destacada', tpl1_media_gallery: 'Galería de Medios',
        tpl1_featured_product: 'Producto Destacado', tpl1_countdown: 'Cuenta Regresiva',
        tpl1_products_filter: 'Productos con Filtro', tpl1_before_after: 'Antes / Después',
        tpl1_faq: 'Preguntas Frecuentes', tpl1_shop_the_look: 'Shop The Look',
        tpl1_marquee_2: 'Texto Animado 2', tpl1_image_overlay: 'Banner con Texto',
        tpl1_video_text: 'Video con Texto', tpl1_testimonials: 'Testimonios',
        tpl1_brand_logos: 'Logos de Marcas', tpl1_blog: 'Blog / Noticias',
        tpl1_service_icons: 'Iconos de Servicios',
        tpl1_subscribe_popup: 'Popup de Suscripción', tpl1_footer: 'Footer',
      };
      return labels[id] || id;
    };

    // Inject highlight styles
    const style = document.createElement('style');
    style.id = 'tpl1-editor-styles';
    style.textContent = `
      .te-highlight { outline: 2px solid #7c3aed !important; outline-offset: -2px; }
      .te-hover-outline { outline: 2px dashed #7c3aed !important; outline-offset: -2px; cursor: pointer; }
    `;
    if (!document.getElementById('tpl1-editor-styles')) document.head.appendChild(style);

    const handleClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        const shopifyId = el.dataset.sectionId!;
        // Si el ID es el de Shopify, convertir al ID del config
        const configId = SHOPIFY_DATA_SECTION_ID_TO_CONFIG_ID[shopifyId] || shopifyId;
        window.parent.postMessage({ type: 'te:select', sectionId: configId }, '*');
      }
    };
    const handleMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      document.querySelectorAll('.te-hover-tip').forEach(t => t.remove());
      if (el) {
        const shopifyId = el.dataset.sectionId!;
        const configId = SHOPIFY_DATA_SECTION_ID_TO_CONFIG_ID[shopifyId] || shopifyId;
        const rect = el.getBoundingClientRect();
        const tip = document.createElement('div');
        tip.className = 'te-hover-tip';
        tip.textContent = getLabel(configId);
        tip.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;background:#7c3aed;color:#fff;padding:4px 10px;font-size:11px;font-weight:700;border-radius:4px 4px 4px 0;z-index:99999;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.2);`;
        document.body.appendChild(tip);
        el.classList.add('te-hover-outline');
        window.parent.postMessage({ type: 'te:hover', sectionId: configId }, '*');
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (el) el.classList.remove('te-hover-outline');
      document.querySelectorAll('.te-hover-tip').forEach(t => t.remove());
      window.parent.postMessage({ type: 'te:hoverOut' }, '*');
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      style.remove();
    };
  }, [bodyHtml]);

  /* ── Load font faces ── */
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'tpl1-fontfaces';
    styleEl.textContent = FONT_FACE_CSS;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  /* ── Load CSS files dynamically ── */
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    CSS_FILES.forEach(href => {
      const existing = document.querySelector(`link[data-tpl1="${href}"]`);
      if (existing) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-tpl1', href);
      document.head.appendChild(link);
      links.push(link);
    });
    return () => { links.forEach(l => l.remove()); };
  }, []);

  /* ── Fetch the cleaned HTML body content ── */
  useEffect(() => {
    let aborted = false;
    fetch('/shopify/body-clean.html', { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(html => {
        if (aborted) return;
        // Pre-process: replace Shopify default placeholder images with transparent pixel and hide hero section inline
        let processed = html;
        // Replace placeholder images src with 1px transparent GIF (keep element in DOM for JS to replace later)
        processed = processed.replace(/(<img[^>]*src=")[^"]*hero-apparel[^"]*("[^>]*>)/gi, '$1data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2');
        processed = processed.replace(/(<img[^>]*src=")[^"]*hero-fashion[^"]*("[^>]*>)/gi, '$1data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2');
        processed = processed.replace(/(<img[^>]*src=")[^"]*hero-shoe[^"]*("[^>]*>)/gi, '$1data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2');
        // Override Shopify color-scheme CSS variables on hero to change gray to pink
        // Root cause: --secondary-background: 220,220,220 (gray) used as fallback bg
        processed = processed.replace(
          'class="musk-main-banner color-scheme-bcca51f6-8cb1-46f3-8f26-94394c542484 "',
          'class="musk-main-banner color-scheme-bcca51f6-8cb1-46f3-8f26-94394c542484 " style="--primary-background:254,242,248;--secondary-background:252,231,243;--gradient-background:linear-gradient(101.19deg,rgba(254,242,248,1),rgba(252,231,243,1) 50%,rgba(251,207,232,1) 100%)"'
        );
        processed = processed.replace(/MUSK COSMO/gi, '');
        processed = processed.replace(/alt="MUSK[^"]*"/gi, 'alt=""');
        processed = processed.replace(/Mi tienda 3/gi, '');
        processed = processed.replace(/>MUSK</gi, '><');
        processed = processed.replace(/shop now/gi, 'Ver productos');
        // Fix navbar: replace "Contacto" with "Mis Pedidos"
        processed = processed.replace(
          /<a[^>]*href="[^"]*contact[^"]*"[^>]*aria-label="Contacto"[^>]*>Contacto<\/a>/i,
          '<a href="/cuenta/pedidos" aria-label="Mis Pedidos">Mis Pedidos</a>'
        );
        // Fallback: replace any remaining Contacto link
        processed = processed.replace(
          /<a[^>]*href="[^"]*contact[^"]*"[^>]*>Contacto<\/a>/i,
          '<a href="/cuenta/pedidos" aria-label="Mis Pedidos">Mis Pedidos</a>'
        );
        // Reducir tamaño del logo del header Shopify — override del style inline del header
        processed = processed.replace(
          /#shopify-section-sections--[a-z0-9]+__header_[a-zA-Z0-9]+ \.musk-main-header \.logo-col img \{\s*max-width: \d+px;\s*height: auto;\s*\}/,
          '#shopify-section-sections--22405132747000__header_fYEwWD .musk-main-header .logo-col img { max-width: 50px !important; height: auto !important; }'
        );
        // Forzar logo pequeño — inyectar al final del style tag del header
        processed = processed.replace(
          'max-width: 80px;\n    }\n  }',
          'max-width: 50px;\n    }\n  }\n  .musk-main-header .logo-col img { max-width:50px!important;max-height:50px!important;height:auto!important;width:auto!important; }'
        );
        // Force navbar icons to be white — Shopify theme has global svg path{fill:...!important}
        // Only reliable fix: add inline style with !important directly on SVG elements in HTML
        processed = processed.replace(
          /(<button[^>]*class="header-resource-link[^"]*"[^>]*>\s*<svg[^>]*>)([\s\S]*?)(<\/svg>)/g,
          (match: string, open: string, inner: string, close: string) => {
            return open + inner.replace(/fill="[^"]*"/g, 'fill="#ffffff" style="fill:#ffffff!important;stroke:#ffffff!important"') + close;
          }
        );
        processed = processed.replace(
          /(<a[^>]*class="header-resource-link[^"]*"[^>]*>\s*<svg[^>]*>)([\s\S]*?)(<\/svg>)/g,
          (match: string, open: string, inner: string, close: string) => {
            return open + inner.replace(/fill="[^"]*"/g, 'fill="#ffffff" style="fill:#ffffff!important;stroke:#ffffff!important"') + close;
          }
        );
        setBodyHtml(processed);
      })
      .catch(err => {
        if (aborted) return;
        console.error('[Plantilla1] Error loading body-clean.html', err);
        setLoadError(err.message || 'Error de carga');
      });
    return () => { aborted = true; };
  }, []);

  /* Marca por defecto en hero/nav antes de que cargue sectionCfg (evita flash "MUSK") */
  useEffect(() => {
    if (!bodyHtml) return;
    // Logo text — limpiar referencias a MUSK, no poner marca propia
    document.querySelectorAll('.light-logo span, .dark-logo span, .logo-col span, .h4.secondary-text, .h4.primary-text').forEach(el => {
      const t = (el.textContent || '').trim();
      if (/musk/i.test(t) || /mi tienda/i.test(t)) el.textContent = '';
    });
    // Hero title
    const hero = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
    hero?.querySelectorAll('.banner-main-title, h2, h3').forEach(el => {
      const t = (el.textContent || '').trim();
      if (/musk/i.test(t) && !el.closest('.musk-sec-title')) el.textContent = '';
    });
    // Any remaining "MUSK" text nodes visible to user
    document.querySelectorAll('a, span, p, h1, h2, h3, h4, button, div').forEach(el => {
      if (el.children.length === 0 || el.children.length === 1 && el.children[0].tagName === 'BR') {
        const t = (el.textContent || '').trim();
        if (/^MUSK$/i.test(t)) el.textContent = '';
        if (/^Mi tienda \d$/i.test(t)) el.textContent = '';
      }
    });
  }, [bodyHtml]);

  /* Colores del editor (headingColor, textColor, accentColor) en secciones Shopify */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const id = requestAnimationFrame(() => {
      for (const cfg of sectionCfg) {
        if (!cfg.enabled) continue;
        const htmlId = TPL1_SECTION_HTML_MAP[cfg.id];
        if (!htmlId || !htmlId.startsWith('shopify-section-')) continue;
        const root = document.getElementById(htmlId);
        if (!root) continue;
        applyTpl1SectionColors(root, cfg.settings || {});
      }
    });
    return () => cancelAnimationFrame(id);
  }, [bodyHtml, sectionCfg]);

  /* ── Once body HTML is rendered, load JS scripts to enable carousels/etc.
        IMPORTANT: idempotente — los scripts del tema declaran clases globales
        (CustomElements, etc.) y NO se pueden cargar dos veces. En StrictMode
        dev, useEffect corre dos veces; saltamos la segunda. ── */
  useEffect(() => {
    if (!bodyHtml) return;
    if ((window as any).__tpl1ScriptsLoaded) return;
    (window as any).__tpl1ScriptsLoaded = true;

    // ── Let Shopify CartDrawer custom element register normally ──
    // We patch the instance directly in the cart useEffect below

    (window as any).swiperBundleUrl = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';

    const loadOne = (file: JsFile) => new Promise<void>((resolve) => {
      if (document.querySelector(`script[data-tpl1="${file.src}"]`)) { resolve(); return; }
      // Ejecutar inlineScript antes de cargar el archivo
      if (file.inlineScript) {
        try {
          const inline = document.createElement('script');
          inline.textContent = file.inlineScript;
          document.body.appendChild(inline);
        } catch (e) {
          console.warn('[Plantilla1] inlineScript error:', e);
        }
      }
      const s = document.createElement('script');
      s.src = file.src;
      if (file.module) s.type = 'module';
      else s.async = false;
      s.setAttribute('data-tpl1', file.src);
      const done = () => {
        if (file.postLoad) { try { file.postLoad(); } catch (e) { console.warn('[Plantilla1] postLoad error:', e); } }
        resolve();
      };
      s.onload = done;
      s.onerror = done;
      document.body.appendChild(s);
    });

    (async () => {
      for (const f of JS_FILES) {
        await loadOne(f);
      }
      try {
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: false }));
        window.dispatchEvent(new Event('load'));
      } catch (e) {
        console.warn('[Plantilla1] dispatch DOMContentLoaded/load failed:', e);
      }
    })();

    // Reset flag on unmount so scripts can reinitialize if component remounts (SPA navigation back to /)
    return () => { (window as any).__tpl1ScriptsLoaded = false; };
  }, [bodyHtml]);

  /* ── is-sticky basic toggle (sin bloquear scrolling_down_header) ── */
  useEffect(() => {
    if (!bodyHtml) return;
    let style = document.getElementById('tpl1-sticky-icon-colors') as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = 'tpl1-sticky-icon-colors';
      document.head.appendChild(style);
    }
    style.textContent = `
      header.musk-main-header.scrolling_upwards_header {
        z-index: 9999 !important;
      }
    `;
    // Force icon colors by overriding CSS custom properties AND directly setting SVG fills
    // Shopify theme uses: svg path{fill:rgb(var(--primary-background))!important}
    // --primary-background resolves to 254,242,248 (pink/orange)
    const forceIconColors = () => {
      const h = document.querySelector('header.musk-main-header');
      if (!h) return;
      const isSticky = h.classList.contains('is-sticky') || h.classList.contains('scrolling_upwards_header');
      const color = isSticky ? '#374151' : '#ffffff';
      h.querySelectorAll('.header-resource-link svg, .user-toggle svg, .cart-btn svg').forEach(svg => {
        const el = svg as SVGSVGElement;
        el.style.setProperty('fill', color, 'important');
        el.style.setProperty('stroke', color, 'important');
        el.querySelectorAll('path, circle, rect, line, polyline, polygon').forEach(child => {
          (child as SVGElement).setAttribute('fill', color);
          (child as SVGElement).setAttribute('stroke', color);
          (child as HTMLElement).style.setProperty('fill', color, 'important');
          (child as HTMLElement).style.setProperty('stroke', color, 'important');
        });
      });
    };
    const sync = () => {
      const h = document.querySelector('header.musk-main-header') as HTMLElement | null;
      if (!h) return;
      if ((window.scrollY || 0) > 50) {
        // Scrolleando: ocultar header Shopify con animación sincronizada
        h.classList.add('is-sticky', 'scrolling_down_header');
        h.classList.remove('scrolling_upwards_header');
        h.style.setProperty('transform', 'translateY(-100%)', 'important');
        h.style.setProperty('opacity', '0', 'important');
        h.style.setProperty('transition', 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s cubic-bezier(0.4,0,0.2,1)', 'important');
      } else {
        // Arriba: mostrar header Shopify con animación sincronizada
        h.classList.remove('is-sticky', 'scrolling_down_header');
        h.classList.add('scrolling_upwards_header');
        h.style.setProperty('transform', 'translateY(0)', 'important');
        h.style.setProperty('opacity', '1', 'important');
        h.style.setProperty('transition', 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s cubic-bezier(0.4,0,0.2,1)', 'important');
      }
      forceIconColors();
    };
    sync();
    forceIconColors();
    window.addEventListener('scroll', sync, { passive: true });
    const interval = setInterval(forceIconColors, 300);
    return () => { window.removeEventListener('scroll', sync); clearInterval(interval); };
  }, [bodyHtml]);

  /* ── Fix Shopify navbar: ensure Catálogo link exists ── */

  useEffect(() => {
    if (!bodyHtml) return;
    const fixNavbar = () => {
      const navbar = document.querySelector('.musk-navbar');
      if (!navbar) return;
      // Add Catálogo link if not already present
      if (!navbar.querySelector('a[href="/catalogo"]')) {
        const li = document.createElement('li');
        li.className = 'nav_li link_menu_men heading_font';
        const a = document.createElement('a');
        a.href = '/catalogo';
        a.setAttribute('aria-label', 'Catálogo');
        a.textContent = 'Catálogo';
        li.appendChild(a);
        // Insert after Tienda link if exists, else append
        const tiendaLink = navbar.querySelector('.nav_li a[href="/productos"]');
        if (tiendaLink?.parentElement) {
          tiendaLink.parentElement.after(li);
        } else {
          navbar.querySelector('ul')?.appendChild(li);
        }
      }
      // Remove "Inicio" link (irrelevant on homepage) from navbar and mobile drawer
      document.querySelectorAll('.musk-navbar .nav_li a[aria-label="Inicio"], .musk-navbar .nav_li a[href="./index.html"], .musk-navbar .nav_li a[href="/"], .fusion-mobile-menu-drawer-container .link_menu_men a[aria-label="Inicio"], .fusion-mobile-menu-drawer-container .link_menu_men a[href="./index.html"]').forEach(el => {
        el.closest('li')?.remove();
      });
      // Replace "Contacto" with "Mis Pedidos"
      const contactoLink = (navbar.querySelector('.nav_li a[aria-label="Contacto"]') || navbar.querySelector('.nav_li a[href*="contact"]')) as HTMLAnchorElement | null;
      if (contactoLink) {
        contactoLink.href = '/cuenta/pedidos';
        contactoLink.setAttribute('aria-label', 'Mis Pedidos');
        contactoLink.textContent = 'Mis Pedidos';
      }
      // Mark active link based on current URL
      const currentPath = window.location.pathname;
      navbar.querySelectorAll('.nav_li a').forEach(a => {
        a.classList.remove('active');
        const href = a.getAttribute('href');
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href || ''))) {
          a.classList.add('active');
        }
      });
      // Add address pill in the middle of the navbar
      if (!navbar.querySelector('.tpl1-shopify-addr')) {
        const addrLi = document.createElement('li');
        addrLi.className = 'nav_li tpl1-shopify-addr';
        const addrA = document.createElement('a');
        addrA.href = '/cuenta/direcciones';
        addrA.className = 'tpl1-shopify-addr-link';
        const addrText = primaryAddressRef.current || (isLoggedInRef.current ? 'Agregar ubicación' : 'Ingresa ubicación');
        addrA.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>${addrText}</span>`;
        addrLi.appendChild(addrA);
        const ul = navbar.querySelector('ul');
        if (ul) {
          const lis = ul.querySelectorAll('.nav_li');
          const mid = Math.floor(lis.length / 2);
          if (lis[mid]) lis[mid].before(addrLi);
          else ul.appendChild(addrLi);
        }
      } else {
        // Update address text if already exists
        const addrSpan = navbar.querySelector('.tpl1-shopify-addr-link span');
        if (addrSpan) addrSpan.textContent = primaryAddressRef.current || (isLoggedInRef.current ? 'Agregar ubicación' : 'Ingresa ubicación');
      }
    };
    fixNavbar();
    // Re-run after a delay in case Shopify renders late
    const t = setTimeout(fixNavbar, 2000);
    return () => clearTimeout(t);
  }, [bodyHtml]);

  /* ── Hacer funcionales los botones del navbar Shopify (search, user, cart) ── */
  const { totalItems, items, subtotal, removeItem, updateQuantity, addItem, getEffectivePrice } = useCart();
  const { unreadCount } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const openNotif = () => setNotifOpen(true);
    window.addEventListener(TPL1_OPEN_NOTIFICATIONS, openNotif);
    return () => window.removeEventListener(TPL1_OPEN_NOTIFICATIONS, openNotif);
  }, []);

  useEffect(() => {
    if (!bodyHtml) return;

    // ── Replace theme's cart empty image with Lottie container + translate text ──
    const replaceCartImgWithLottie = () => {
      // Replace image with Lottie
      const origCartImg = document.querySelector('.empty-cart-icon img[src*="cart-sidebar-img"]');
      if (origCartImg) {
        const parent = origCartImg.parentElement;
        if (parent) {
          parent.innerHTML = '<div id="lottie-cart-empty" style="width:120px;height:120px;margin:0 auto;"></div>';
          const container = document.getElementById('lottie-cart-empty');
          if (container && !container.dataset.lottieInit) {
            container.dataset.lottieInit = '1';
            lottie.loadAnimation({
              container,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: '/lottie/cart.json',
            });
          }
        }
      }
      // Also init Lottie if container exists without animation
      const existingContainer = document.getElementById('lottie-cart-empty');
      if (existingContainer && !existingContainer.dataset.lottieInit) {
        existingContainer.dataset.lottieInit = '1';
        lottie.loadAnimation({
          container: existingContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/lottie/cart.json',
        });
      }
      // Translate theme's English text to Spanish
      const titleEl = document.querySelector('.empty-cart-title');
      if (titleEl && titleEl.textContent?.includes('empty')) titleEl.textContent = 'Tu carrito está vacío';
      const descEl = document.querySelector('.empty_cart_drawer p, .empty-cart-wrapper > p');
      if (descEl && descEl.textContent?.includes('added')) descEl.textContent = 'Aún no has agregado nada a tu carrito';
      const shopBtn = document.querySelector('.musk-third-btn[aria-label="shop now"]');
      if (shopBtn) { shopBtn.textContent = 'Ver productos'; shopBtn.setAttribute('aria-label', 'Ver productos'); }
      const shopLink = document.querySelector('.musk-third-btn[href*="collections/all"]');
      if (shopLink) { shopLink.textContent = 'Ver productos'; shopLink.setAttribute('href', '/productos'); }
    };
    replaceCartImgWithLottie();

    // ── Search: redirigir form a /productos?q= ──
    const searchForm = document.querySelector('.search-bar-main form[action="/search"]') as HTMLFormElement | null;
    if (searchForm) {
      searchForm.action = '/productos';
      searchForm.method = 'GET';
      const qInput = searchForm.querySelector('input[name="q"]') as HTMLInputElement | null;
      if (qInput) qInput.placeholder = 'Buscar productos...';
      const hiddenPrefix = searchForm.querySelector('input[name="options[prefix]"]');
      if (hiddenPrefix) hiddenPrefix.remove();
    }

    // ── Search popup: toggle manually (Bootstrap dropdown not loaded) ──
    const searchToggle = document.querySelector('.fusion-search-trigger') as HTMLElement | null;
    const searchPopup = document.querySelector('.fusion-search-popup') as HTMLElement | null;
    const searchCloseBtn = searchPopup?.querySelector('.close-popup-btn') as HTMLElement | null;
    if (searchToggle && searchPopup) {
      searchToggle.removeAttribute('data-bs-toggle');
      searchToggle.removeAttribute('data-bs-target');
      searchToggle.removeAttribute('data-toggle');
      // Move popup to body to escape any ancestor transform/filter stacking context
      // (header has transforms when scrolling, which break position:fixed)
      if (searchPopup.parentElement !== document.body) {
        // Preserve data-template CSS scope after moving out of the container
        searchPopup.setAttribute('data-template-moved', '1');
        document.body.appendChild(searchPopup);
      }

      // Better X close button design
      if (searchCloseBtn) {
        searchCloseBtn.style.cssText = 'position:absolute;top:24px;right:32px;z-index:10;width:48px;height:48px;border-radius:50%;background:#f3f4f6;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;box-shadow:0 2px 8px rgba(0,0,0,0.08);';
        searchCloseBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4L4 14M4 4L14 14" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/></svg>`;
        searchCloseBtn.addEventListener('mouseenter', () => {
          searchCloseBtn.style.background = '#ec4899';
          searchCloseBtn.style.transform = 'scale(1.08) rotate(90deg)';
          const svg = searchCloseBtn.querySelector('path');
          if (svg) svg.setAttribute('stroke', '#ffffff');
        });
        searchCloseBtn.addEventListener('mouseleave', () => {
          searchCloseBtn.style.background = '#f3f4f6';
          searchCloseBtn.style.transform = 'scale(1) rotate(0deg)';
          const svg = searchCloseBtn.querySelector('path');
          if (svg) svg.setAttribute('stroke', '#1f2937');
        });
      }

      // Translate popup texts to Spanish
      const translateTexts = () => {
        const popularTitle = searchPopup.querySelector('.popular_search_product_header .search_header_title h5');
        if (popularTitle) popularTitle.textContent = 'Productos populares';
        const collectionTitle = searchPopup.querySelector('.popular_search_collection_header .search_header_title h5');
        if (collectionTitle) collectionTitle.textContent = 'Categorías';
        const articlesTitle = searchPopup.querySelector('.popular_search_article_header .search_header_title h5');
        if (articlesTitle) articlesTitle.textContent = 'Últimos artículos';
        searchPopup.querySelectorAll('.search_header_title a span').forEach((sp) => {
          sp.textContent = 'Ver todo';
        });
      };
      translateTexts();

      // Add banner image at top of search popup (above search bar)
      const popupForm = searchPopup.querySelector('form') as HTMLFormElement | null;
      // Logo removed — no longer showing hardcoded brand logo in search popup

      let searchCacheReady = false;
      let runSearchLoad: () => void = () => {};

      // Fix popup search form: navigate to /productos?q=... on submit
      if (popupForm) {
        popupForm.action = '/productos';
        popupForm.method = 'GET';
        // Rename #search-results so the theme's predictive search can't overwrite it with "Error loading results"
        const searchResultsEl = searchPopup.querySelector('#search-results');
        if (searchResultsEl) searchResultsEl.id = 'tpl1-search-results';
        const popupQ = popupForm.querySelector('input[name="q"]') as HTMLInputElement | null;
        if (popupQ) {
          popupQ.placeholder = 'Buscar productos...';
          // Rename ID so the theme's listener can't find it
          popupQ.id = 'tpl1-search-input';
          // Clone input to remove any pre-attached theme predictive-search listeners
          const newInput = popupQ.cloneNode(true) as HTMLInputElement;
          popupQ.parentNode?.replaceChild(newInput, popupQ);

          // ── Live search with full client-side filtering ──
          let searchTimeout: ReturnType<typeof setTimeout> | null = null;
          const popularTitle = searchPopup.querySelector('.popular_search_product_header .search_header_title h5');
          const popularViewAll = searchPopup.querySelector('.popular_search_product_header .search_header_title a') as HTMLAnchorElement | null;

          // Hide "Últimos artículos" entirely for now
          const articlesSection = searchPopup.querySelector('.popular_search_article_header');
          if (articlesSection) (articlesSection as HTMLElement).style.display = 'none';

          // Animated placeholder typing effect
          const placeholders = ['Buscar productos...', 'Buscar paletas...', 'Buscar maquillaje...', 'Buscar cuidado facial...', 'Buscar perfumes...'];
          let phIdx = 0, phCharIdx = 0, phDeleting = false;
          const animatePlaceholder = () => {
            if (document.activeElement === newInput) {
              setTimeout(animatePlaceholder, 1000);
              return;
            }
            const current = placeholders[phIdx];
            if (!phDeleting) {
              newInput.placeholder = current.slice(0, phCharIdx++) + '|';
              if (phCharIdx > current.length) {
                phDeleting = true;
                setTimeout(animatePlaceholder, 1800);
                return;
              }
            } else {
              newInput.placeholder = current.slice(0, phCharIdx--) + '|';
              if (phCharIdx < 0) {
                phDeleting = false;
                phCharIdx = 0;
                phIdx = (phIdx + 1) % placeholders.length;
              }
            }
            setTimeout(animatePlaceholder, phDeleting ? 40 : 90);
          };
          animatePlaceholder();

          // State
          let allProducts: any[] = [];
          let allCategories: any[] = [];
          let allSubcategories: any[] = [];
          let activeCategoryId: string | null = null;
          let activeSubcategoryId: string | null = null;
          let sortMode: 'popular' | 'price-asc' | 'price-desc' | 'name' | 'discount' = 'popular';
          let priceMin = 0;
          let priceMax = 9999999;
          let priceMaxLimit = 9999999;
          let onSaleOnly = false;

          const loadCache = async () => {
            try {
              const [prodRes, catRes, subRes] = await Promise.all([
                fetch('/api/public-data/products').then(r => r.json()).then(d => ({ documents: d.products || [] })),
                fetch('/api/public-data/catalog').then(r => r.json()).then(d => ({ documents: d.categories || [] })),
                Promise.resolve({ documents: [] }), // Deshabilitado para ahorrar requests
              ]);
              allProducts = prodRes.documents;
              allCategories = catRes.documents;
              allSubcategories = subRes.documents;
              // Compute max price
              const maxP = Math.max(...allProducts.map((p: any) => (p.CURRENTPRICE && p.CURRENTPRICE > 0 ? p.CURRENTPRICE : p.PRICE) || 0));
              priceMaxLimit = Math.ceil(maxP / 1000) * 1000 || 100000;
              priceMax = priceMaxLimit;
              renderCategories();
              renderFilters();
            } catch (err) {
              console.warn('[tpl1] Cache load error:', err);
            }
          };

          // Build custom 4-column product grid
          let productGrid = searchPopup.querySelector('.tpl1-product-grid') as HTMLElement | null;
          if (!productGrid) {
            productGrid = document.createElement('div');
            productGrid.className = 'tpl1-product-grid';
            productGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;max-height:calc(100vh - 320px);overflow-y:auto;padding:20px 12px 24px 0;margin-top:24px;';
            const originalGrid = searchPopup.querySelector('.popular_search_product_header_wrapp') as HTMLElement | null;
            if (originalGrid) originalGrid.style.display = 'none';
            const header = searchPopup.querySelector('.popular_search_product_header');
            if (header) header.parentElement?.insertBefore(productGrid, header.nextSibling);
          }

          // Helper: render filters panel
          const collectionsCol = searchPopup.querySelector('.popular_search_collection_blog') as HTMLElement | null;
          let filtersPanel = searchPopup.querySelector('.tpl1-filters-panel') as HTMLElement | null;
          if (collectionsCol && !filtersPanel) {
            filtersPanel = document.createElement('div');
            filtersPanel.className = 'tpl1-filters-panel';
            filtersPanel.style.cssText = 'margin-bottom:20px;padding:16px;background:linear-gradient(135deg,#fff 0%,#fdf2f8 100%);border-radius:14px;border:1px solid #fbcfe8;box-shadow:0 2px 8px rgba(236,72,153,0.06);';
            collectionsCol.insertBefore(filtersPanel, collectionsCol.firstChild);
          }

          const renderFilters = () => {
            if (!filtersPanel) return;
            filtersPanel.innerHTML = `
              <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#831843;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filtros
              </div>

              <!-- Sort -->
              <div style="margin-bottom:14px;">
                <label style="font-size:11px;color:#6b7280;font-weight:700;letter-spacing:0.3px;margin-bottom:6px;display:block;">ORDENAR POR</label>
                <div class="tpl1-custom-select">
                  <button type="button" class="tpl1-select-btn" style="width:100%;padding:9px 12px;background:#fff;border:1.5px solid #f9a8d4;border-radius:10px;font-size:13px;color:#1f2937;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;transition:all 0.2s;">
                    <span class="tpl1-select-label">${sortMode === 'popular' ? 'Popularidad' :
                sortMode === 'price-asc' ? 'Precio: menor a mayor' :
                  sortMode === 'price-desc' ? 'Precio: mayor a menor' :
                    sortMode === 'discount' ? 'Mayor descuento' : 'Nombre A-Z'
              }</span>
                    <svg class="tpl1-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.25s;"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div class="tpl1-select-menu" style="overflow:hidden;max-height:0;background:#fff;border-radius:0 0 10px 10px;transition:max-height 0.3s ease;margin-top:-1px;">
                    <div style="border:1.5px solid #f9a8d4;border-top:none;border-radius:0 0 10px 10px;overflow:hidden;">
                      ${[['popular', 'Popularidad'], ['price-asc', 'Precio: menor a mayor'], ['price-desc', 'Precio: mayor a menor'], ['discount', 'Mayor descuento'], ['name', 'Nombre A-Z']].map(([v, l]) => `
                        <div data-value="${v}" style="padding:9px 12px;font-size:13px;color:${sortMode === v ? '#ec4899' : '#1f2937'};font-weight:${sortMode === v ? '700' : '500'};cursor:pointer;transition:background 0.15s;background:${sortMode === v ? '#fdf2f8' : '#fff'};">${l}</div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Price range -->
              <div style="margin-bottom:14px;">
                <label style="font-size:11px;color:#6b7280;font-weight:700;letter-spacing:0.3px;margin-bottom:8px;display:block;">RANGO DE PRECIO</label>
                <div style="display:flex;gap:6px;align-items:center;">
                  <input type="number" class="tpl1-price-min" value="${priceMin}" min="0" max="${priceMaxLimit}" placeholder="Mín" style="width:100%;padding:7px 9px;border:1.5px solid #f9a8d4;border-radius:8px;font-size:12px;background:#fff;color:#1f2937;outline:none;" />
                  <span style="color:#9ca3af;font-size:12px;">—</span>
                  <input type="number" class="tpl1-price-max" value="${priceMax}" min="0" max="${priceMaxLimit}" placeholder="Máx" style="width:100%;padding:7px 9px;border:1.5px solid #f9a8d4;border-radius:8px;font-size:12px;background:#fff;color:#1f2937;outline:none;" />
                </div>
                <input type="range" class="tpl1-price-slider" min="0" max="${priceMaxLimit}" value="${priceMax}" style="width:100%;margin-top:10px;accent-color:#ec4899;" />
              </div>

              <!-- Toggles -->
              <div style="margin-bottom:14px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12.5px;color:#1f2937;font-weight:500;padding:6px;border-radius:6px;transition:background 0.15s;" class="tpl1-sale-label">
                  <input type="checkbox" class="tpl1-sale-check" ${onSaleOnly ? 'checked' : ''} style="accent-color:#ec4899;width:16px;height:16px;cursor:pointer;" />
                  Solo en oferta
                </label>
              </div>

              <button class="tpl1-clear-filters" style="width:100%;padding:9px 12px;background:#fff;border:1.5px solid #f9a8d4;border-radius:10px;font-size:12px;color:#ec4899;font-weight:700;cursor:pointer;transition:all 0.25s;letter-spacing:0.3px;">LIMPIAR FILTROS</button>
            `;

            // Custom select wiring (inline collapsible — no z-index/overflow issues)
            const selectBtn = filtersPanel!.querySelector('.tpl1-select-btn') as HTMLElement;
            const selectMenu = filtersPanel!.querySelector('.tpl1-select-menu') as HTMLElement;
            const selectArrow = filtersPanel!.querySelector('.tpl1-select-arrow') as HTMLElement;
            let menuOpen = false;
            selectBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              menuOpen = !menuOpen;
              selectMenu.style.maxHeight = menuOpen ? '400px' : '0';
              if (selectArrow) selectArrow.style.transform = menuOpen ? 'rotate(180deg)' : 'rotate(0deg)';
              selectBtn.style.borderRadius = menuOpen ? '10px 10px 0 0' : '10px';
            });
            selectMenu.querySelectorAll('[data-value]').forEach(opt => {
              const el = opt as HTMLElement;
              el.addEventListener('mouseenter', () => { if (el.dataset.value !== sortMode) el.style.background = '#fdf2f8'; });
              el.addEventListener('mouseleave', () => { if (el.dataset.value !== sortMode) el.style.background = '#fff'; });
              el.addEventListener('click', (e) => {
                e.stopPropagation();
                sortMode = el.dataset.value as any;
                renderFilters();
                applyFilters();
              });
            });

            // Price inputs + slider
            const priceMinInput = filtersPanel!.querySelector('.tpl1-price-min') as HTMLInputElement;
            const priceMaxInput = filtersPanel!.querySelector('.tpl1-price-max') as HTMLInputElement;
            const priceSlider = filtersPanel!.querySelector('.tpl1-price-slider') as HTMLInputElement;
            const onPriceChange = () => {
              priceMin = Math.max(0, parseInt(priceMinInput.value) || 0);
              priceMax = Math.min(priceMaxLimit, parseInt(priceMaxInput.value) || priceMaxLimit);
              applyFilters();
            };
            priceMinInput.addEventListener('input', onPriceChange);
            priceMaxInput.addEventListener('input', onPriceChange);
            priceSlider.addEventListener('input', () => {
              priceMax = parseInt(priceSlider.value);
              priceMaxInput.value = String(priceMax);
              applyFilters();
            });

            // Sale checkbox
            const saleCheck = filtersPanel!.querySelector('.tpl1-sale-check') as HTMLInputElement;
            saleCheck.addEventListener('change', () => { onSaleOnly = saleCheck.checked; applyFilters(); });

            // Clear filters
            const clearBtn = filtersPanel!.querySelector('.tpl1-clear-filters') as HTMLButtonElement;
            clearBtn.addEventListener('mouseenter', () => { clearBtn.style.background = '#ec4899'; clearBtn.style.color = '#fff'; clearBtn.style.borderColor = '#ec4899'; });
            clearBtn.addEventListener('mouseleave', () => { clearBtn.style.background = '#fff'; clearBtn.style.color = '#ec4899'; clearBtn.style.borderColor = '#f9a8d4'; });
            clearBtn.addEventListener('click', () => {
              activeCategoryId = null;
              activeSubcategoryId = null;
              sortMode = 'popular';
              priceMin = 0;
              priceMax = priceMaxLimit;
              onSaleOnly = false;
              (newInput as HTMLInputElement).value = '';
              renderFilters();
              renderCategories();
              applyFilters();
            });
          };

          // Render categories with icons (replaces what populateSearchResults did)
          const renderCategories = () => {
            const collectionHeader = searchPopup.querySelector('.popular_search_collection_header');
            const collContainer = collectionHeader?.querySelector('.popular_search_collection_header_item')?.parentElement
              || collectionHeader;
            if (!collContainer) return;
            // Remove old items but keep title
            collContainer.querySelectorAll('.popular_search_collection_header_item').forEach(el => el.remove());
            allCategories.forEach((cat: any) => {
              const item = document.createElement('div');
              item.className = 'popular_search_collection_header_item tpl1-cat-item';
              item.style.cssText = 'margin-bottom:4px;';
              const isActive = activeCategoryId === cat.$id;
              const iconHtml = cat.iconUrl
                ? `<img src="${cat.iconUrl}" alt="" style="width:24px;height:24px;border-radius:6px;object-fit:cover;flex-shrink:0;" />`
                : `<div style="width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,#fce7f3,#f9a8d4);display:flex;align-items:center;justify-content:center;font-size:11px;color:#831843;font-weight:700;flex-shrink:0;">${(cat.name || cat.NAME || '?').charAt(0).toUpperCase()}</div>`;
              item.innerHTML = `<a href="?categoria=${cat.$id}" data-cat-id="${cat.$id}" style="display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:8px;text-decoration:none;color:${isActive ? '#ec4899' : '#374151'};font-weight:${isActive ? '700' : '500'};font-size:13.5px;transition:all 0.2s;background:${isActive ? '#fce7f3' : 'transparent'};">${iconHtml}<span class="collection_name" style="flex:1;">${cat.name || cat.NAME || cat.$id}</span></a>`;
              collContainer.appendChild(item);

              const link = item.querySelector('a')!;
              link.addEventListener('mouseenter', () => {
                if (activeCategoryId !== cat.$id) link.style.background = '#fdf2f8';
              });
              link.addEventListener('mouseleave', () => {
                if (activeCategoryId !== cat.$id) link.style.background = 'transparent';
              });
              // Add subcategory list if this is active
              if (isActive) {
                const subs = allSubcategories.filter(s => s.categoryId === cat.$id || s.CATEGORYID === cat.$id);
                if (subs.length > 0) {
                  const list = document.createElement('div');
                  list.className = 'tpl1-subcat-list';
                  list.style.cssText = 'padding:6px 0 10px 18px;display:flex;flex-direction:column;gap:2px;border-left:2px solid #ec4899;margin:4px 0 8px 18px;';
                  list.innerHTML = subs.map(s => {
                    const isSubActive = activeSubcategoryId === s.$id;
                    return `<a href="?subcategoria=${s.$id}" data-subcat-id="${s.$id}" style="font-size:12.5px;color:${isSubActive ? '#fff' : '#555'};background:${isSubActive ? '#ec4899' : 'transparent'};text-decoration:none;padding:5px 10px;border-radius:6px;transition:all 0.2s;">› ${s.name || s.NAME || s.$id}</a>`;
                  }).join('');
                  item.appendChild(list);
                  list.querySelectorAll('a').forEach(a => {
                    const subId = (a as HTMLElement).dataset.subcatId;
                    a.addEventListener('mouseenter', () => {
                      if (activeSubcategoryId !== subId) { a.style.background = '#fce7f3'; a.style.color = '#ec4899'; }
                    });
                    a.addEventListener('mouseleave', () => {
                      if (activeSubcategoryId !== subId) { a.style.background = 'transparent'; a.style.color = '#555'; }
                    });
                  });
                }
              }
            });
          };

          // Image lightbox helper
          const openImageLightbox = (imgUrl: string, name: string) => {
            const existing = document.getElementById('tpl1-lightbox');
            if (existing) existing.remove();
            const lb = document.createElement('div');
            lb.id = 'tpl1-lightbox';
            lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;padding:40px;cursor:zoom-out;animation:tpl1LightboxIn 0.3s ease;';
            lb.innerHTML = `
              <button type="button" style="position:absolute;top:24px;right:24px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);transition:all 0.2s;font-size:24px;line-height:1;" aria-label="Cerrar">×</button>
              <div style="max-width:90vw;max-height:85vh;display:flex;flex-direction:column;align-items:center;gap:16px;animation:tpl1ZoomIn 0.4s cubic-bezier(0.16,1,0.3,1);" onclick="event.stopPropagation()">
                <img src="${imgUrl}" alt="${name}" style="max-width:100%;max-height:75vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);" />
                <div style="color:#fff;font-size:16px;font-weight:600;text-align:center;max-width:600px;">${name}</div>
              </div>
            `;
            document.body.appendChild(lb);
            const close = () => { lb.style.animation = 'tpl1LightboxOut 0.25s ease forwards'; setTimeout(() => lb.remove(), 250); };
            lb.addEventListener('click', close);
            lb.querySelector('button')?.addEventListener('click', (e) => { e.stopPropagation(); close(); });
            const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
            document.addEventListener('keydown', escHandler);
          };

          const renderProducts = (products: any[]) => {
            if (!productGrid) return;
            if (products.length === 0) {
              productGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#888;font-size:15px;">
                <div style="font-size:48px;margin-bottom:12px;opacity:0.5;">🔍</div>
                <div style="font-weight:600;color:#374151;">No se encontraron productos</div>
                <div style="font-size:13px;color:#9ca3af;margin-top:4px;">Prueba ajustando los filtros</div>
              </div>`;
              return;
            } productGrid.innerHTML = products.map((doc: any, i: number) => {
              const price = doc.CURRENTPRICE && doc.CURRENTPRICE > 0 ? doc.CURRENTPRICE : doc.PRICE;
              const hasDiscount = doc.CURRENTPRICE && doc.CURRENTPRICE > 0 && doc.CURRENTPRICE < doc.PRICE;
              const discountPct = hasDiscount ? Math.round(((doc.PRICE - doc.CURRENTPRICE) / doc.PRICE) * 100) : 0;
              const img2 = doc.IMAGEURL2 || doc.SECONDARYIMAGEURL || '';
              return `<div class="tpl1-pc-wrap" style="perspective:700px;position:relative;z-index:1;animation:tpl1CardPop 0.4s ${Math.min(i * 0.04, 0.4)}s both ease-out;">
                <div class="tpl1-prod-card" data-product-id="${doc.$id}" style="position:relative;display:flex;flex-direction:column;background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);box-shadow:0 1px 3px rgba(0,0,0,0.06);transition:box-shadow .35s cubic-bezier(.4,0,.2,1),border-color .35s ease,transform .35s cubic-bezier(.4,0,.2,1);will-change:transform,box-shadow;transform-style:preserve-3d;height:100%;">

                  <!-- Discount badge top-left below heart -->
                  ${hasDiscount ? `<div style="position:absolute;top:54px;left:12px;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;font-size:10px;font-weight:800;padding:4px 9px;border-radius:8px;z-index:5;box-shadow:0 3px 10px rgba(236,72,153,0.4);">-${discountPct}%</div>` : ''}

                  <!-- Heart top-LEFT (OUTSIDE <a>) -->
                  <button type="button" class="tpl1-icon-btn tpl1-fav-btn" data-action="fav" style="position:absolute;top:10px;left:10px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;z-index:10;" aria-label="Favorito">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>

                  <!-- Magnifier top-RIGHT (OUTSIDE <a>) -->
                  <button type="button" class="tpl1-icon-btn tpl1-quick-btn" data-action="quick" style="position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;z-index:10;opacity:0;transform:translateX(8px);" aria-label="Ver imagen">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>
                  </button>

                  <!-- Cart bottom-RIGHT (OUTSIDE <a>) -->
                  <button type="button" class="tpl1-icon-btn tpl1-cart-btn" data-action="cart" style="position:absolute;bottom:14px;right:14px;width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#ec4899,#db2777);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(236,72,153,0.4);transition:all 0.25s;z-index:10;" aria-label="Añadir al carrito">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </button>

                  <a href="/productos/${doc.$id}" class="tpl1-card-link" style="display:flex;flex-direction:column;text-decoration:none;color:inherit;flex:1;">
                    <div class="tpl1-pc-img-wrap" style="position:relative;width:100%;aspect-ratio:1;overflow:hidden;background:#f7f7f7;">
                      <img class="tpl1-pc-img-primary" src="${doc.IMAGEURL || ''}" alt="${doc.NAME || ''}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .45s,transform .6s cubic-bezier(.23,1,.32,1);z-index:1;" />
                      ${img2 ? `<img class="tpl1-pc-img-secondary" src="${img2}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .45s,transform .6s cubic-bezier(.23,1,.32,1);z-index:2;" />` : ''}
                    </div>
                    <div style="padding:14px 70px 14px 14px;background:#fff;">
                      <div style="font-size:10px;font-weight:700;letter-spacing:0.5px;color:#ec4899;text-transform:uppercase;margin-bottom:4px;">${hasDiscount ? '★ OFERTA' : 'NUEVO'}</div>
                      <div style="font-size:13.5px;font-weight:700;line-height:1.35;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:36px;color:#1f2937;">${doc.NAME || ''}</div>
                      <div style="display:flex;flex-direction:column;gap:2px;">
                        <span style="background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;font-weight:800;font-size:14px;padding:5px 11px;border-radius:8px;box-shadow:0 2px 8px rgba(236,72,153,0.25);display:inline-block;width:fit-content;">${formatPrice(price)}</span>
                        ${hasDiscount ? `<span style="text-decoration:line-through;color:#9ca3af;font-size:11px;padding-left:4px;">${formatPrice(doc.PRICE)}</span>` : ''}
                      </div>
                    </div>
                  </a>
                </div>
              </div>`;
            }).join('');
            productGrid.querySelectorAll('.tpl1-pc-wrap').forEach((wrap) => {
              const w = wrap as HTMLElement;
              const c = w.querySelector('.tpl1-prod-card') as HTMLElement;
              const quickBtn = c.querySelector('.tpl1-quick-btn') as HTMLElement | null;
              const imgPrimary = c.querySelector('.tpl1-pc-img-primary') as HTMLElement | null;
              const imgSecondary = c.querySelector('.tpl1-pc-img-secondary') as HTMLElement | null;

              // 3D tilt on mousemove
              c.addEventListener('mousemove', (ev) => {
                const me = ev as MouseEvent;
                const r = c.getBoundingClientRect();
                const rx = ((me.clientY - r.top) / r.height - 0.5) * 6;
                const ry = ((me.clientX - r.left) / r.width - 0.5) * -6;
                c.style.transition = 'box-shadow .35s, border-color .35s';
                c.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
              });
              c.addEventListener('mouseenter', () => {
                c.style.boxShadow = '0 12px 32px rgba(236,72,153,0.07), 0 4px 12px rgba(0,0,0,0.05)';
                c.style.borderColor = '#fbcfe8';
                w.style.zIndex = '100';
                if (quickBtn) { quickBtn.style.opacity = '1'; quickBtn.style.transform = 'translateX(0)'; }
                // Second image fade in
                if (imgSecondary) { imgSecondary.style.opacity = '1'; imgSecondary.style.transform = 'scale(1.06)'; }
                if (imgPrimary) {
                  if (imgSecondary) imgPrimary.style.opacity = '0.25';
                  imgPrimary.style.transform = 'scale(1.06)';
                }
              });
              c.addEventListener('mouseleave', () => {
                c.style.transition = 'box-shadow .35s cubic-bezier(.4,0,.2,1),border-color .35s ease,transform .35s cubic-bezier(.4,0,.2,1)';
                c.style.transform = '';
                c.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                c.style.borderColor = 'rgba(0,0,0,0.06)';
                w.style.zIndex = '1';
                if (quickBtn) { quickBtn.style.opacity = '0'; quickBtn.style.transform = 'translateX(8px)'; }
                if (imgSecondary) { imgSecondary.style.opacity = '0'; imgSecondary.style.transform = 'scale(1)'; }
                if (imgPrimary) { imgPrimary.style.opacity = '1'; imgPrimary.style.transform = 'scale(1)'; }
              });

              // Icon button interactions
              c.querySelectorAll('.tpl1-icon-btn').forEach(btn => {
                const b = btn as HTMLButtonElement;
                const isCart = b.dataset.action === 'cart';
                b.addEventListener('mouseenter', () => {
                  if (isCart) {
                    b.style.transform = 'scale(1.12)';
                    b.style.boxShadow = '0 8px 20px rgba(236,72,153,0.55)';
                  } else {
                    b.style.background = '#ec4899';
                    b.style.transform = 'scale(1.1)';
                    b.querySelectorAll('svg path, svg circle, svg line').forEach(el => (el as SVGElement).setAttribute('stroke', '#fff'));
                  }
                });
                b.addEventListener('mouseleave', () => {
                  if (isCart) {
                    b.style.transform = 'scale(1)';
                    b.style.boxShadow = '0 4px 14px rgba(236,72,153,0.4)';
                  } else {
                    const isFavActive = b.classList.contains('tpl1-fav-active');
                    if (!isFavActive) {
                      b.style.background = 'rgba(255,255,255,0.95)';
                      b.style.transform = 'scale(1)';
                      b.querySelectorAll('svg path, svg circle, svg line').forEach(el => (el as SVGElement).setAttribute('stroke', '#1f2937'));
                    } else {
                      b.style.transform = 'scale(1)';
                    }
                  }
                });
                // Use mousedown + click for maximum reliability
                b.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  const action = b.dataset.action;
                  const prodId = c.dataset.productId;
                  if (action === 'fav') {
                    const path = b.querySelector('svg path') as SVGElement | null;
                    const isActive = b.classList.toggle('tpl1-fav-active');
                    if (path) {
                      path.setAttribute('fill', isActive ? '#ec4899' : 'none');
                      path.setAttribute('stroke', isActive ? '#ec4899' : '#1f2937');
                    }
                    b.style.background = isActive ? '#fce7f3' : 'rgba(255,255,255,0.95)';
                    b.animate(
                      [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
                      { duration: 400, easing: 'cubic-bezier(0.34,1.56,0.64,1)' }
                    );
                  } else if (action === 'quick') {
                    const prod = allProducts.find((p: any) => p.$id === prodId);
                    if (prod) openImageLightbox(prod.IMAGEURL, prod.NAME);
                  } else if (action === 'cart') {
                    const prod = allProducts.find((p: any) => p.$id === prodId);
                    if (prod) {
                      try { addItem(prod as Product, 1); } catch (err) { console.warn('addItem failed', err); }
                      const orig = b.innerHTML;
                      b.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><polyline points="20 6 9 17 4 12"/></svg>`;
                      b.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                      b.animate(
                        [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
                        { duration: 450, easing: 'cubic-bezier(0.34,1.56,0.64,1)' }
                      );
                      setTimeout(() => {
                        b.innerHTML = orig;
                        b.style.background = 'linear-gradient(135deg,#ec4899,#db2777)';
                      }, 1200);
                    }
                  }
                });
              });
            });
          };

          const applyFilters = () => {
            let filtered = [...allProducts];
            const query = (newInput as HTMLInputElement).value.trim().toLowerCase();
            if (query) filtered = filtered.filter(p => (p.NAME || '').toLowerCase().includes(query));
            if (activeSubcategoryId) filtered = filtered.filter(p => p.SUBCATEGORYID === activeSubcategoryId);
            else if (activeCategoryId) filtered = filtered.filter(p => p.CATEGORYID === activeCategoryId);
            // Price filter
            filtered = filtered.filter(p => {
              const pr = (p.CURRENTPRICE && p.CURRENTPRICE > 0) ? p.CURRENTPRICE : p.PRICE;
              return pr >= priceMin && pr <= priceMax;
            });
            // Sale only
            if (onSaleOnly) filtered = filtered.filter(p => p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < p.PRICE);
            // Sort
            if (sortMode === 'price-asc') filtered.sort((a, b) => ((a.CURRENTPRICE || a.PRICE) || 0) - ((b.CURRENTPRICE || b.PRICE) || 0));
            else if (sortMode === 'price-desc') filtered.sort((a, b) => ((b.CURRENTPRICE || b.PRICE) || 0) - ((a.CURRENTPRICE || a.PRICE) || 0));
            else if (sortMode === 'name') filtered.sort((a, b) => (a.NAME || '').localeCompare(b.NAME || ''));
            else if (sortMode === 'discount') filtered.sort((a, b) => {
              const da = a.CURRENTPRICE && a.CURRENTPRICE > 0 ? ((a.PRICE - a.CURRENTPRICE) / a.PRICE) : 0;
              const db = b.CURRENTPRICE && b.CURRENTPRICE > 0 ? ((b.PRICE - b.CURRENTPRICE) / b.PRICE) : 0;
              return db - da;
            });
            // Title
            if (popularTitle) {
              if (query) popularTitle.textContent = `Resultados (${filtered.length})`;
              else if (activeSubcategoryId) {
                const sub = allSubcategories.find(s => s.$id === activeSubcategoryId);
                popularTitle.textContent = `${sub?.name || sub?.NAME || 'Productos'} (${filtered.length})`;
              } else if (activeCategoryId) {
                const cat = allCategories.find(c => c.$id === activeCategoryId);
                popularTitle.textContent = `${cat?.name || cat?.NAME || 'Categoría'} (${filtered.length})`;
              } else popularTitle.textContent = `Productos populares (${filtered.length})`;
            }
            if (popularViewAll) popularViewAll.href = activeCategoryId ? `/productos?categoria=${activeCategoryId}` : '/productos';
            renderProducts(filtered);
          };

          runSearchLoad = () => {
            loadCache().then(() => {
              searchCacheReady = true;
              applyFilters();
            });
          };
          runSearchLoad();

          newInput.addEventListener('input', () => {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => applyFilters(), 200);
          });

          // ── HARD navigation blocker: capture-phase listener on the popup catches ALL link clicks
          searchPopup.addEventListener('click', (e) => {
            // Skip icon buttons (cart, fav, zoom) — they have their own click handlers
            if ((e.target as HTMLElement).closest('.tpl1-icon-btn')) return;
            const link = (e.target as HTMLElement).closest('a');
            if (!link) return;
            const href = link.getAttribute('href') || '';
            const catId = link.getAttribute('data-cat-id') || (href.match(/categoria=([^&]+)/) || [])[1];
            const subId = link.getAttribute('data-subcat-id') || (href.match(/subcategoria=([^&]+)/) || [])[1];
            if (!catId && !subId) return; // Let product links work
            e.preventDefault();
            e.stopPropagation();
            if (subId) {
              activeSubcategoryId = subId;
              renderCategories();
              applyFilters();
            } else if (catId) {
              if (activeCategoryId === catId) {
                activeCategoryId = null;
                activeSubcategoryId = null;
              } else {
                activeCategoryId = catId;
                activeSubcategoryId = null;
              }
              renderCategories();
              applyFilters();
            }
          }, true);

          // ── DOCUMENT-level capture listener for icon buttons ──
          // Fires BEFORE any Shopify theme handler on lower elements.
          // This is the ONLY reliable way to handle clicks on our custom
          // buttons since the theme's JS intercepts events on the popup.
          const docIconHandler = (e: MouseEvent) => {
            const btn = (e.target as HTMLElement).closest('.tpl1-icon-btn') as HTMLElement | null;
            console.log('[tpl1-debug] docIconHandler fired, target:', e.target, 'btn:', btn);
            if (!btn) return;
            // Only handle if inside the search popup
            if (!btn.closest('.fusion-search-popup, .tpl1-product-grid')) return;
            console.log('[tpl1-debug] Icon button clicked! action:', btn.dataset.action, 'productId:', (btn.closest('.tpl1-prod-card') as HTMLElement | null)?.dataset?.productId);
            e.preventDefault();
            e.stopImmediatePropagation();
            const card = btn.closest('.tpl1-prod-card') as HTMLElement | null;
            if (!card) return;
            const prodId = card.dataset.productId || '';
            const action = btn.dataset.action;
            if (action === 'fav') {
              const path = btn.querySelector('svg path') as SVGElement | null;
              const isActive = btn.classList.toggle('tpl1-fav-active');
              if (path) {
                path.setAttribute('fill', isActive ? '#ec4899' : 'none');
                path.setAttribute('stroke', isActive ? '#ec4899' : '#1f2937');
              }
              btn.style.background = isActive ? '#fce7f3' : 'rgba(255,255,255,0.95)';
              btn.animate(
                [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
                { duration: 400, easing: 'cubic-bezier(0.34,1.56,0.64,1)' }
              );
            } else if (action === 'quick') {
              const prod = allProducts.find((p: any) => p.$id === prodId);
              if (prod) openImageLightbox(prod.IMAGEURL, prod.NAME);
            } else if (action === 'cart') {
              const prod = allProducts.find((p: any) => p.$id === prodId);
              if (prod) {
                try { addItem(prod as Product, 1); } catch (err) { console.warn('addItem failed', err); }
                const orig = btn.innerHTML;
                btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><polyline points="20 6 9 17 4 12"/></svg>`;
                btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                btn.animate(
                  [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
                  { duration: 450, easing: 'cubic-bezier(0.34,1.56,0.64,1)' }
                );
                setTimeout(() => {
                  btn.innerHTML = orig;
                  btn.style.background = 'linear-gradient(135deg,#ec4899,#db2777)';
                }, 1200);
              }
            }
          };
          document.addEventListener('click', docIconHandler, true);
        }
        const hp = popupForm.querySelector('input[name="options[prefix]"]');
        if (hp) hp.remove();
        popupForm.addEventListener('submit', (e) => {
          const q = (popupForm.querySelector('input[name="q"]') as HTMLInputElement | null)?.value || '';
          e.preventDefault();
          window.location.href = `/productos?q=${encodeURIComponent(q)}`;
        });
      }

      const openSearch = () => {
        if (!searchPopup?.classList || !searchToggle) return;
        searchPopup.classList.remove('tpl1-closing');
        searchPopup.classList.add('show');
        searchToggle.setAttribute('aria-expanded', 'true');
        const overlay = document.querySelector('.fusion-overlay-custom');
        if (overlay?.classList) {
          overlay.classList.remove('overlay-active');
          (overlay as HTMLElement).style.display = 'none';
        }
        if (!searchCacheReady) runSearchLoad();
        const qInput = searchPopup.querySelector('input[name="q"], #tpl1-search-input') as HTMLInputElement | null;
        if (qInput) setTimeout(() => qInput.focus(), 100);
      };
      const closeSearch = () => {
        if (!searchPopup?.classList || !searchToggle) return;
        searchToggle.setAttribute('aria-expanded', 'false');
        searchPopup.classList.remove('show');
        searchPopup.classList.add('tpl1-closing');
        setTimeout(() => {
          searchPopup?.classList?.remove('tpl1-closing');
        }, 200);
      };

      searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (searchPopup?.classList?.contains('show')) closeSearch();
        else openSearch();
      });
      if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeSearch(); });
      }
      document.addEventListener('click', (e) => {
        if (!searchPopup || !searchToggle) return;
        if (!searchPopup.contains(e.target as Node) && !searchToggle.contains(e.target as Node)) {
          if (searchPopup.classList?.contains('show')) closeSearch();
        }
      });

      // ── Populate search-results with real products & categories ──
      const populateSearchResults = async () => {
        try {
          // Fetch 4 popular products
          const prodsRes = await fetch('/api/public-data/products').then(r => r.json()).then(d => ({ documents: (d.products || []).slice(0, 4) }));

          // Fetch categories
          const catsRes = await fetch('/api/public-data/catalog').then(r => r.json()).then(d => ({ documents: (d.categories || []).slice(0, 6) }));

          // Fix "View all" link
          const viewAllLink = searchPopup.querySelector('.popular_search_product_header .search_header_title a') as HTMLAnchorElement | null;
          if (viewAllLink) viewAllLink.href = '/productos';

          // Populate product cards
          const productCards = searchPopup.querySelectorAll('.popular_search_product_header_wrapp .col-lg-3, .popular_search_product_header_wrapp .col-6');
          prodsRes.documents.forEach((doc: any, i: number) => {
            const card = productCards[i];
            if (!card) return;
            const img = card.querySelector('.product-img img') as HTMLImageElement | null;
            const nameEl = card.querySelector('.product-name') as HTMLElement | null;
            const linkEl = card.querySelector('a[role="link"]') as HTMLAnchorElement | null;
            const priceEl = card.querySelector('.p-price') as HTMLElement | null;
            const compareEl = card.querySelector('.compare_at_price') as HTMLElement | null;

            if (img) { img.src = doc.IMAGEURL || ''; img.alt = doc.NAME || ''; }
            if (nameEl) nameEl.textContent = doc.NAME || '';
            if (linkEl) { linkEl.href = `/productos/${doc.$id}`; linkEl.removeAttribute('aria-disabled'); }
            const price = doc.CURRENTPRICE && doc.CURRENTPRICE > 0 ? doc.CURRENTPRICE : doc.PRICE;
            if (priceEl) priceEl.textContent = formatPrice(price);
            if (compareEl) {
              if (doc.CURRENTPRICE && doc.CURRENTPRICE > 0 && doc.CURRENTPRICE < doc.PRICE) {
                compareEl.textContent = formatPrice(doc.PRICE);
                compareEl.style.display = '';
              } else {
                compareEl.style.display = 'none';
              }
            }
          });

          // Fix collections section - we render our own via renderCategories(), skip default population
          const collViewAll = searchPopup.querySelector('.popular_search_collection_header .search_header_title a') as HTMLAnchorElement | null;
          if (collViewAll) collViewAll.href = '/productos';

          // Fix articles "View all" link
          const artViewAll = searchPopup.querySelector('.popular_search_article_header .search_header_title a') as HTMLAnchorElement | null;
          if (artViewAll) artViewAll.href = '/productos';

        } catch (err) {
          console.warn('[tpl1] Error populating search results:', err);
        }
      };

      // Preload search results once on mount (not every time search opens)
      populateSearchResults();
    }

    const ensureTpl1PanelKeyframes = () => {
      if (document.getElementById('tpl1-auth-keyframes')) return;
      const ks = document.createElement('style');
      ks.id = 'tpl1-auth-keyframes';
      ks.textContent =
        '@keyframes tpl1AuthIn{from{opacity:0;transform:translateY(-12px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}' +
        '@keyframes tpl1AuthSheetIn{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}' +
        '@keyframes yaxselSkeletonShimmer{0%{background-color:#fce7f3}50%{background-color:#fbcfe8}100%{background-color:#fce7f3}}';
      document.head.appendChild(ks);
    };

    /** Panel usuario / auth: bottom sheet en móvil, dropdown anclado en desktop */
    const layoutTpl1UserPanel = (anchor: HTMLElement, popup: HTMLElement, panelWidth = 340) => {
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
        if (left < pad) {
          right = Math.max(pad, vw - pw - pad);
        }

        popup.style.top = `${top}px`;
        popup.style.right = `${right}px`;
        popup.style.maxHeight = `${Math.max(160, vh - top - pad)}px`;
      };

      requestAnimationFrame(place);
    };

    // ── Auth popup for non-logged-in users ──
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
      // Remove existing
      if (authPopupEl) { closeAuthPopup(); return; }

      authPopupJustOpened = true;

      // Create overlay with blur
      if (!authOverlayEl) {
        authOverlayEl = document.createElement('div');
        authOverlayEl.id = 'yaxsel-auth-overlay';
        authOverlayEl.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.25);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity 0.3s ease;';
        document.body.appendChild(authOverlayEl);
      }
      authOverlayEl.style.opacity = '1';
      authOverlayEl.style.pointerEvents = 'auto';

      // Lock scroll
      document.body.classList.add('cart-drawer-open', 'overflow-hidden');
      document.body.style.overflow = 'hidden';

      const popup = document.createElement('div');
      popup.id = 'yaxsel-auth-popup';
      popup.style.cssText = 'position:fixed;z-index:10002;width:340px;background:#fff;border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,0.08),0 2px 8px rgba(0,0,0,0.04);border:1px solid #f0f0f0;overflow:hidden;animation:tpl1AuthIn .3s cubic-bezier(0.16,1,0.3,1);font-family:"DM Sans",system-ui,sans-serif;';
      popup.innerHTML = `
        <button id="yaxsel-auth-close" type="button" aria-label="Cerrar" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:none;background:#f3f4f6;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;z-index:2;">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 3L3 11M3 3L11 11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        </button>
        <div style="padding:28px 24px 24px;text-align:center;">
          <div style="width:56px;height:56px;margin:0 auto 14px;border-radius:50%;background:linear-gradient(135deg,#fef2f8,#fce7f3);display:flex;align-items:center;justify-content:center;color:#ec4899;box-shadow:0 4px 14px rgba(236,72,153,0.15);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p style="font-size:18px;font-weight:800;color:#111;margin:0 0 8px;letter-spacing:-0.02em;">Inicia sesión o crea tu cuenta</p>
          <p style="font-size:13px;color:#6b7280;margin:0 0 20px;line-height:1.45;">Para realizar pedidos necesitas iniciar sesión o registrarte.</p>
          <a href="/login" id="yaxsel-auth-login-btn" style="display:block;width:100%;padding:14px;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;text-align:center;text-decoration:none;box-shadow:0 6px 20px rgba(236,72,153,0.3);margin-bottom:10px;">Iniciar sesión</a>
          <a href="/login?tab=register" style="display:block;width:100%;padding:13px;background:#fff;color:#ec4899;border:2px solid #fce7f3;border-radius:14px;font-size:15px;font-weight:700;text-align:center;text-decoration:none;">Crear cuenta</a>
        </div>
      `;

      document.body.appendChild(popup);
      authPopupEl = popup;
      ensureTpl1PanelKeyframes();
      layoutTpl1UserPanel(anchor, popup, 340);


      // Close button hover
      const closeBtn = popup.querySelector('#yaxsel-auth-close') as HTMLElement | null;
      if (closeBtn) {
        closeBtn.addEventListener('click', () => { closeAuthPopup(); });
        closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = '#fce7f3'; closeBtn.style.color = '#ec4899'; });
        closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = '#f3f4f6'; closeBtn.style.color = '#666'; });
      }

      // Close when clicking overlay
      if (authOverlayEl) {
        authOverlayEl.onclick = () => {
          if (authPopupJustOpened) { authPopupJustOpened = false; return; }
          closeAuthPopup();
        };
      }

      // Login btn hover
      const loginBtn = popup.querySelector('#yaxsel-auth-login-btn') as HTMLElement | null;
      if (loginBtn) {
        loginBtn.addEventListener('mouseenter', () => { loginBtn.style.transform = 'translateY(-2px)'; loginBtn.style.boxShadow = '0 8px 32px rgba(236,72,153,0.25)'; });
        loginBtn.addEventListener('mouseleave', () => { loginBtn.style.transform = ''; loginBtn.style.boxShadow = '0 6px 24px rgba(236,72,153,0.15)'; });
      }

      // Close on outside click (solo desktop; en móvil usa overlay)
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

    // ── User dropdown for logged-in users ──
    let userDropdownEl: HTMLDivElement | null = null;
    let userOverlayEl: HTMLDivElement | null = null;
    let userDropdownJustOpened = false;
    const closeUserDropdown = () => {
      if (userDropdownEl) { userDropdownEl.remove(); userDropdownEl = null; }
      if (userOverlayEl) { userOverlayEl.style.opacity = '0'; userOverlayEl.style.pointerEvents = 'none'; }
      document.body.classList.remove('cart-drawer-open', 'overflow-hidden');
      document.body.style.overflow = '';
      userDropdownJustOpened = false;
    };
    const getAvatarPreviewUrl = (fileId: string): string => {
      const { endpoint, projectId } = getAppwriteConfig();
      const path = fileId;
      return `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${path}/view?project=${projectId}`;
    };

    const toggleUserDropdown = async (anchor: HTMLElement) => {
      // Remove existing
      if (userDropdownEl) { closeUserDropdown(); return; }

      const userName = user?.name || 'Usuario';
      const userEmail = user?.email || '';

      // Get avatar file ID from Appwrite prefs
      let avatarUrl = '';
      try {
        const { account } = getServices();
        const acc = await account.get();
        const prefs = (acc as any).prefs || {};
        const avatarFileId = prefs.avatarFileId;
        if (avatarFileId) {
          avatarUrl = getAvatarPreviewUrl(avatarFileId);
        }
      } catch { }

      // Mark as just opened to prevent immediate close
      userDropdownJustOpened = true;

      // Create overlay with blur
      if (!userOverlayEl) {
        userOverlayEl = document.createElement('div');
        userOverlayEl.id = 'yaxsel-user-overlay';
        userOverlayEl.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.25);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity 0.3s ease;';
        document.body.appendChild(userOverlayEl);
      }
      userOverlayEl.style.opacity = '1';
      userOverlayEl.style.pointerEvents = 'auto';

      // Lock scroll
      document.body.classList.add('cart-drawer-open', 'overflow-hidden');
      document.body.style.overflow = 'hidden';

      const popup = document.createElement('div');
      popup.id = 'yaxsel-user-dropdown';
      popup.style.cssText = 'position:fixed;z-index:10002;width:300px;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.15),0 6px 20px rgba(0,0,0,0.08);border:1px solid #f0f0f0;overflow:hidden;animation:tpl1AuthIn .3s cubic-bezier(0.16,1,0.3,1);font-family:"DM Sans",system-ui,sans-serif;';
      popup.innerHTML = `
        <!-- User info header -->
        <div style="padding:20px 20px 16px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <p style="font-size:16px;font-weight:700;color:#1a1a1a;margin:0;">${userName}</p>
            <p style="font-size:13px;color:#6b7280;margin:4px 0 0;">${userEmail}</p>
          </div>
          <div style="width:72px;height:72px;border-radius:50%;overflow:hidden;">
            <img src="${avatarUrl}" 
                 alt="" 
                 style="width:100%;height:100%;object-fit:cover;display:${avatarUrl ? 'block' : 'none'};" />
            <span style="display:${avatarUrl ? 'none' : 'flex'};width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#ec4899,#f9a8d4);color:#fff;font-size:28px;font-weight:700;align-items:center;justify-content:center;">${userName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <!-- Menu items -->
        <div style="padding:8px 0;">
          <a href="/cuenta" style="display:flex;align-items:center;gap:12px;padding:12px 20px;color:#374151;font-size:14px;font-weight:500;text-decoration:none;transition:all 0.15s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Mi cuenta
          </a>
          <a href="/cuenta/pedidos" style="display:flex;align-items:center;gap:12px;padding:12px 20px;color:#374151;font-size:14px;font-weight:500;text-decoration:none;transition:all 0.15s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Mis pedidos
          </a>
          <a href="/cuenta/direcciones" style="display:flex;align-items:center;gap:12px;padding:12px 20px;color:#374151;font-size:14px;font-weight:500;text-decoration:none;transition:all 0.15s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Direcciones
          </a>
          <a href="/cuenta/notificaciones" style="display:flex;align-items:center;gap:12px;padding:12px 20px;color:#374151;font-size:14px;font-weight:500;text-decoration:none;transition:all 0.15s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Notificaciones
          </a>
          <a href="/cuenta/favoritos" style="display:flex;align-items:center;gap:12px;padding:12px 20px;color:#374151;font-size:14px;font-weight:500;text-decoration:none;transition:all 0.15s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Favoritos
          </a>
          <div style="height:1px;background:#f3f4f6;margin:8px 0;"></div>
          <button id="yaxsel-logout-btn" style="display:flex;align-items:center;gap:12px;padding:12px 20px;color:#ef4444;font-size:14px;font-weight:500;background:none;border:none;cursor:pointer;width:100%;text-align:left;transition:all 0.15s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar sesión
          </button>
        </div>
      `;

      document.body.appendChild(popup);
      userDropdownEl = popup;
      ensureTpl1PanelKeyframes();
      layoutTpl1UserPanel(anchor, popup, 300);

      // Hover effects for menu items
      const menuItems = popup.querySelectorAll('a');
      menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => { (item as HTMLElement).style.background = '#f9fafb'; });
        item.addEventListener('mouseleave', () => { (item as HTMLElement).style.background = ''; });
      });

      // Logout button
      const logoutBtn = popup.querySelector('#yaxsel-logout-btn') as HTMLElement | null;
      if (logoutBtn) {
        logoutBtn.addEventListener('mouseenter', () => { logoutBtn.style.background = '#fef2f8'; });
        logoutBtn.addEventListener('mouseleave', () => { logoutBtn.style.background = ''; });
        logoutBtn.addEventListener('click', async () => {
          try {
            const { account } = getServices();
            await account.deleteSession('current');
            closeUserDropdown();
            window.location.href = '/';
          } catch (err) {
            console.error('Logout error:', err);
            closeUserDropdown();
            window.location.href = '/';
          }
        });
      }

      // Close when clicking overlay
      userOverlayEl.addEventListener('click', (e) => {
        if (userDropdownJustOpened) { userDropdownJustOpened = false; return; }
        closeUserDropdown();
      });

      // Close when clicking outside
      const closeOnOutside = (e: MouseEvent) => {
        if (userDropdownJustOpened) { userDropdownJustOpened = false; return; }
        if (!popup.contains(e.target as Node) && !anchor.contains(e.target as Node)) {
          closeUserDropdown();
          document.removeEventListener('click', closeOnOutside);
        }
      };
      setTimeout(() => document.addEventListener('click', closeOnOutside), 0);
    };

    // ── Funciones de abrir/cerrar drawer con GSAP ──
    // Create our own overlay outside the drawer (not affected by transforms)
    // NO backdrop-filter — blur is handled by body.cart-drawer-open class
    let overlayEl = document.getElementById('yaxsel-cart-overlay') as HTMLDivElement | null;
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.id = 'yaxsel-cart-overlay';
      overlayEl.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0;background:transparent;';
      document.body.appendChild(overlayEl);
    }

    // Track if we're animating to prevent observer loops
    let isAnimating = false;

    const openDrawer = () => {
      const drawer = document.querySelector('cart-drawer') as any;
      if (!drawer) return;
      // .cart-sidebar is the <cart-drawer> element itself, not a child —
      // fall back to drawer so GSAP animation always runs.
      const panel = (drawer.querySelector('.cart-sidebar') as HTMLElement | null) ?? drawer as HTMLElement;
      const drawerInner = drawer.querySelector('.drawer__inner');
      if (drawerInner) drawerInner.classList.remove('gradient');

      isAnimating = true;
      drawer.classList.add('active');
      document.body.classList.add('cart-drawer-open', 'overflow-hidden');
      document.body.style.overflow = 'hidden';

      // Show our overlay — instant
      const ov = document.getElementById('yaxsel-cart-overlay');
      if (ov) { ov.style.opacity = '1'; ov.style.pointerEvents = 'auto'; }

      // Make theme's overlay clickable and ensure it's on top
      const themeOverlay = document.getElementById('CartDrawer-Overlay');
      if (themeOverlay) {
        themeOverlay.style.display = '';
        themeOverlay.style.opacity = '1';
        themeOverlay.style.pointerEvents = 'auto';
        themeOverlay.style.zIndex = '9999';
      }

      // Replace theme's empty cart image with Lottie
      replaceCartImgWithLottie();

      // Kill any running animation
      gsap.killTweensOf(panel);

      // Set initial state
      gsap.set(panel, { x: '110%', opacity: 0, visibility: 'visible' });

      // Build timeline
      const tl = gsap.timeline({
        onComplete: () => { isAnimating = false; }
      });

      // 1. Panel slides in with overshoot
      tl.to(panel, {
        x: '0%',
        opacity: 1,
        duration: 0.55,
        ease: 'back.out(0.9)',
      }, 0);

      // 2. Header slides down
      const header = panel.querySelector('.cart-sidebar-header') as HTMLElement | null;
      if (header) {
        gsap.set(header, { y: -15, opacity: 0 });
        tl.to(header, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }, 0.2);
      }

      // 3. Content fades up
      const content = panel.querySelector('.empty_cart_drawer, .drawer__contents') as HTMLElement | null;
      if (content) {
        gsap.set(content, { y: 20, opacity: 0 });
        tl.to(content, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.3);
      }
    };

    const closeDrawer = () => {
      const drawer = document.querySelector('cart-drawer') as HTMLElement | null;
      if (!drawer) return;
      // .cart-sidebar is the <cart-drawer> element itself, not a child —
      // querySelector only searches descendants so it returns null.
      // We fall back to the drawer element so GSAP can still animate it.
      const panel = (drawer.querySelector('.cart-sidebar') as HTMLElement | null) ?? drawer;

      // ── Remove ALL scroll locks IMMEDIATELY ──
      document.body.classList.remove('cart-drawer-open', 'overflow-hidden');
      document.body.style.overflow = '';
      document.body.style.removeProperty('overflow');

      // ── Hide our overlay INSTANTLY ──
      const ov = document.getElementById('yaxsel-cart-overlay');
      if (ov) { ov.style.opacity = '0'; ov.style.pointerEvents = 'none'; }

      // Hide theme's fusion overlay
      const fusionOverlay = document.querySelector('.fusion-overlay-custom');
      if (fusionOverlay) fusionOverlay.classList.remove('overlay-active');

      // ── Safety: keep clearing every 50ms for 600ms in case something re-adds ──
      const cleanupId = setInterval(() => {
        document.body.classList.remove('cart-drawer-open', 'overflow-hidden');
        document.body.style.removeProperty('overflow');
        const o = document.getElementById('yaxsel-cart-overlay');
        if (o && !drawer.classList.contains('active')) {
          o.style.opacity = '0';
          o.style.pointerEvents = 'none';
        }
      }, 50);
      setTimeout(() => clearInterval(cleanupId), 600);

      // Kill any running animation
      gsap.killTweensOf(panel);

      isAnimating = true;
      const tl = gsap.timeline({
        onComplete: () => {
          drawer.classList.remove('active', 'animate');
          const drawerInner = drawer.querySelector('.drawer__inner');
          if (drawerInner) drawerInner.classList.add('gradient');
          gsap.set(panel, { clearProps: 'all' });
          const header = panel.querySelector('.cart-sidebar-header') as HTMLElement | null;
          const content = panel.querySelector('.empty_cart_drawer, .drawer__contents') as HTMLElement | null;
          if (header) gsap.set(header, { clearProps: 'all' });
          if (content) gsap.set(content, { clearProps: 'all' });
          isAnimating = false;
        }
      });

      // Staggered exit
      const header = panel.querySelector('.cart-sidebar-header') as HTMLElement | null;
      if (header) tl.to(header, { y: -10, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);

      const content = panel.querySelector('.empty_cart_drawer, .drawer__contents') as HTMLElement | null;
      if (content) tl.to(content, { y: 15, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.05);

      // Panel slides out right
      tl.to(panel, { x: '110%', opacity: 0, duration: 0.4, ease: 'power3.in' }, 0.08);
    };

    // ── MutationObserver: react when theme adds/removes 'active' on <cart-drawer> ──
    // This is the KEY — we don't need to patch the custom element at all.
    // The theme's own close/open methods work, we just react to class changes.
    const drawerEl = document.querySelector('cart-drawer');
    if (drawerEl) {
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && m.attributeName === 'class') {
            const el = m.target as HTMLElement;
            const isActive = el.classList.contains('active');
            if (isActive && !isAnimating) {
              // Theme opened the drawer — add our blur, overlay, lottie
              document.body.classList.add('cart-drawer-open', 'overflow-hidden');
              document.body.style.overflow = 'hidden';
              const ov = document.getElementById('yaxsel-cart-overlay');
              if (ov) { ov.style.opacity = '1'; ov.style.pointerEvents = 'auto'; }
              replaceCartImgWithLottie();
              // Re-run after delay to catch theme's async re-render
              setTimeout(replaceCartImgWithLottie, 200);
              setTimeout(replaceCartImgWithLottie, 500);
            } else if (!isActive && !isAnimating) {
              // Theme closed the drawer — remove everything
              document.body.classList.remove('cart-drawer-open', 'overflow-hidden');
              document.body.style.overflow = '';
              const ov = document.getElementById('yaxsel-cart-overlay');
              if (ov) { ov.style.opacity = '0'; ov.style.pointerEvents = 'none'; }
              const fusionOverlay = document.querySelector('.fusion-overlay-custom');
              if (fusionOverlay) fusionOverlay.classList.remove('overlay-active');
            }
          }
        }
      });
      observer.observe(drawerEl, { attributes: true, attributeFilter: ['class'] });
    }

    // ── Direct listeners on close button, overlay, and theme overlay ──
    const closeBtn = document.querySelector('.cls-btn, .cart-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeDrawer();
      }, true);
    }

    const ovEl = document.getElementById('yaxsel-cart-overlay');
    if (ovEl) {
      ovEl.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      }, true);
    }

    // Theme's own overlay — click to close (use mousedown in capture phase)
    const themeOverlay = document.getElementById('CartDrawer-Overlay');
    if (themeOverlay) {
      themeOverlay.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeDrawer();
      }, true);
      // Also add click as backup
      themeOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeDrawer();
      }, true);
    }

    // ── Click-outside on the <cart-drawer> element itself ──
    // <cart-drawer> covers the viewport when active, so clicks outside
    // the sidebar panel land on it or its children (not the sidebar)
    const cartDrawerEl = document.querySelector('cart-drawer');
    if (cartDrawerEl) {
      cartDrawerEl.addEventListener('click', (e) => {
        const panel = cartDrawerEl.querySelector('.cart-sidebar');
        if (!panel) return;
        // If click is inside the sidebar panel, don't close
        if (panel.contains(e.target as Node)) return;
        // Click is outside the panel — close
        closeDrawer();
      });
    }

    // ── Listen for custom event from Navbar to open Shopify cart drawer ──
    window.addEventListener('yaxsel:open-cart-drawer', () => {
      openDrawer();
    });

    // ── Click-outside: close when clicking anywhere NOT inside the drawer panel ──
    // This replaces the theme's document click listener that never gets added
    // because we bypass the theme's open() method
    document.addEventListener('click', (e) => {
      const drawer = document.querySelector('cart-drawer');
      if (!drawer || !drawer.classList.contains('active')) return;
      const panel = drawer.querySelector('.cart-sidebar');
      if (!panel) return;
      // If click is inside the panel, don't close
      if (panel.contains(e.target as Node)) return;
      // If click is on the close button, don't close (handled separately)
      if ((e.target as HTMLElement).closest('.cls-btn, .cart-close-btn')) return;
      // Click is outside — close
      closeDrawer();
    });

    // ── Event delegation en capture phase ──
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Cart button (desktop: .cart-btn dentro de <a>, mobile: .cart-toggle)
      // Abre el custom cart drawer de Navbar en lugar de Shopify
      const isCartClick = target.closest('.cart-btn, .cart-toggle, .cart-link-icon');
      if (isCartClick) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.dispatchEvent(new CustomEvent('yaxsel:open-navbar-cart'));
        return;
      }

      // User button (desktop: .user-toggle, mobile: .user-info a)
      const isUserClick = target.closest('.user-toggle, .user-info a');
      if (isUserClick) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (isLoggedIn) {
          toggleUserDropdown(isUserClick as HTMLElement);
        } else {
          toggleAuthPopup(isUserClick as HTMLElement);
        }
        return;
      }

      // Cart drawer close (X button)
      const isCloseClick = target.closest('.cart-close-btn, .cls-btn');
      if (isCloseClick) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeDrawer();
        return;
      }

      // Our custom overlay click
      const isOurOverlay = target.closest('#yaxsel-cart-overlay');
      if (isOurOverlay) {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
        return;
      }
    };

    document.addEventListener('mousedown', handleMouseDown, true); // capture = true

    // Also block Shopify's own click handler on user-toggle (it redirects to Shopify auth)
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const userEl = target.closest('.user-toggle, .user-info a, .account-icon a');
      if (userEl) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }, true); // capture phase = runs before Shopify's handler

    // ── Poblar el cart drawer con items reales del contexto React ──
    const populateCartDrawer = () => {
      const itemsContainer = document.getElementById('CartDrawer-CartItems');
      if (!itemsContainer) return;

      // Toggle is-empty class on drawer
      const drawerEl = document.querySelector('cart-drawer') as HTMLElement | null;
      if (drawerEl) {
        if (items.length === 0) drawerEl.classList.add('is-empty');
        else drawerEl.classList.remove('is-empty');
      }

      // Actualizar badge de carrito en el navbar Shopify
      const cartBadge = document.querySelector('.cart-btn[data-cart-item]') as HTMLElement | null;
      if (cartBadge) cartBadge.setAttribute('data-cart-item', String(totalItems));
      const cartCountSpan = document.querySelector('.cart-sidebar-title-count') as HTMLElement | null;
      if (cartCountSpan) cartCountSpan.textContent = String(totalItems);
      const cartLinkIcon = document.querySelector('.cart-link-icon') as HTMLElement | null;
      if (cartLinkIcon) cartLinkIcon.setAttribute('data-cart-item', String(totalItems));

      if (items.length === 0) {
        itemsContainer.innerHTML = `<div class="empty-cart-wrapper">
          <div class="empty-cart-icon"><div id="lottie-cart-empty" style="width:120px;height:120px;margin:0 auto;"></div></div>
          <h3 class="empty-cart-title">Tu carrito está vacío</h3>
          <p>Aún no has agregado nada a tu carrito</p>
          <div class="button_tertiary"><a href="/productos" class="musk-third-btn" aria-label="Ver productos">Ver productos</a></div>
        </div>`;
        // Init Lottie immediately after inserting container
        const lottieContainer = document.getElementById('lottie-cart-empty');
        if (lottieContainer && !lottieContainer.dataset.lottieInit) {
          lottieContainer.dataset.lottieInit = '1';
          lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottie/cart.json',
          });
        }
        return;
      }

      let html = '<div class="tpl1-cart-items-scroll" style="overflow-y:auto;flex:1;padding:20px;">';
      items.forEach(item => {
        const price = getEffectivePrice(item);
        const hasDisc = item.product.CURRENTPRICE && item.product.CURRENTPRICE > 0 && item.product.CURRENTPRICE < item.product.PRICE;
        html += `<div style="display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #fce7f3;align-items:flex-start;">
          <div class="tpl1-cart-item-img" data-product-id="${item.product.$id}" style="width:72px;height:72px;border-radius:12px;overflow:hidden;background:#fef2f8;flex-shrink:0;border:1px solid #fce7f3;cursor:pointer;position:relative;transition:transform 0.2s ease;">
            ${item.product.IMAGEURL ? `<img src="${item.product.IMAGEURL}" alt="${item.product.NAME}" style="width:100%;height:100%;object-fit:contain;padding:4px;transition:transform 0.3s ease;">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:24px;">📦</div>'}
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);opacity:0;transition:opacity 0.2s ease;border-radius:12px;" class="tpl1-cart-img-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg></div>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;">
              <a href="/productos/${item.product.$id}" style="font-size:13px;font-weight:600;color:#222;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-decoration:none;flex:1;min-width:0;" title="${item.product.NAME}">${item.product.NAME}</a>
              <button type="button" data-cart-action="remove" data-cart-id="${item.product.$id}" style="background:none;border:none;cursor:pointer;color:#9ca3af;padding:0;font-size:14px;flex-shrink:0;transition:color 0.2s;" onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='#9ca3af'" title="Eliminar">✕</button>
            </div>
            <div style="display:flex;align-items:baseline;gap:6px;margin:4px 0 8px;">
              <span style="font-size:15px;font-weight:800;color:#ec4899;">${formatPrice(price)}</span>
              ${hasDisc ? `<span style="font-size:11px;color:#9ca3af;text-decoration:line-through;">${formatPrice(item.product.PRICE)}</span>` : ''}
              <span style="font-size:11px;color:#9ca3af;margin-left:auto;">×${item.quantity}</span>
            </div>
            <div style="display:flex;align-items:center;gap:24px;">
              <div style="display:flex;align-items:center;border:1.5px solid #fce7f3;border-radius:8px;overflow:hidden;background:#fff;gap:8px;padding:0 4px;">
                <button type="button" data-cart-action="minus" data-cart-id="${item.product.$id}" style="width:36px;height:36px;border:none;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#ec4899;font-size:14px;font-weight:700;transition:background 0.15s;" onmouseover="this.style.background='#fef2f8'" onmouseout="this.style.background='#fff'">−</button>
                <span style="width:36px;text-align:center;font-size:13px;font-weight:700;color:#333;line-height:36px;">${item.quantity}</span>
                <button type="button" data-cart-action="plus" data-cart-id="${item.product.$id}" style="width:36px;height:36px;border:none;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#ec4899;font-size:14px;font-weight:700;transition:background 0.15s;" onmouseover="this.style.background='#fef2f8'" onmouseout="this.style.background='#fff'">+</button>
              </div>
              <a href="/productos/${item.product.$id}" style="font-size:11px;color:#ec4899;text-decoration:none;font-weight:600;margin-left:auto;transition:color 0.15s;" onmouseover="this.style.color='#db2777'" onmouseout="this.style.color='#ec4899'">Ver producto →</a>
            </div>
          </div>
        </div>`;
      });
      html += `</div>
      <div class="tpl1-cart-footer" style="padding:20px;border-top:2px solid #fce7f3;background:#fff;flex-shrink:0;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
          <span style="font-size:14px;color:#666;font-weight:500;">Subtotal</span>
          <span style="font-size:20px;font-weight:800;color:#111;">${formatPrice(subtotal)}</span>
        </div>
        <p style="font-size:11px;color:#9ca3af;margin:0 0 12px;">Envío e impuestos calculados al pagar</p>
        <a href="/checkout" style="display:block;text-align:center;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;padding:13px;border-radius:12px;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 6px 20px rgba(236,72,153,0.3);margin-bottom:8px;transition:transform 0.15s,box-shadow 0.15s;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 8px 24px rgba(236,72,153,0.4)'" onmouseout="this.style.transform='';this.style.boxShadow='0 6px 20px rgba(236,72,153,0.3)'">Ir al checkout →</a>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <a href="/carrito" style="color:#ec4899;font-size:12px;font-weight:600;text-decoration:none;">Ver carrito completo</a>
          <button type="button" id="tpl1-clear-cart-btn" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:11px;font-weight:500;padding:4px 8px;border-radius:6px;transition:color 0.15s,background 0.15s;" onmouseover="this.style.color='#dc2626';this.style.background='#fef2f2'" onmouseout="this.style.color='#9ca3af';this.style.background='none'">🗑️ Vaciar carrito</button>
        </div>
      </div>`;
      itemsContainer.innerHTML = html;

      // ── Move footer OUT of #CartDrawer-CartItems into .drawer__inner ──
      // This bypasses the 6-level Shopify flex chain that breaks on small screens.
      // Structure: .drawer__inner > [cart-drawer-items(scroll)] + .tpl1-cart-footer(fixed)
      const footerEl = itemsContainer.querySelector('.tpl1-cart-footer') as HTMLElement | null;
      const drawerInner = itemsContainer.closest('.drawer__inner') as HTMLElement | null;
      console.log('[tpl1-cart-debug] footerEl:', footerEl, 'drawerInner:', drawerInner);
      if (footerEl && drawerInner) {
        const existingFooter = drawerInner.querySelector(':scope > .tpl1-cart-footer');
        if (existingFooter) existingFooter.remove();
        drawerInner.appendChild(footerEl);
        console.log('[tpl1-cart-debug] Footer hoisted to drawer__inner ✓');
      } else {
        // Fallback: try hoisting to cart-drawer or .cart-sidebar directly
        const cartDrawer = document.querySelector('cart-drawer') as HTMLElement | null;
        const cartSidebar = document.querySelector('.cart-sidebar') as HTMLElement | null;
        const target = cartSidebar || cartDrawer;
        console.log('[tpl1-cart-debug] Fallback target:', target, 'cartSidebar:', cartSidebar, 'cartDrawer:', cartDrawer);
        if (footerEl && target) {
          const existingFooter = target.querySelector(':scope > .tpl1-cart-footer');
          if (existingFooter) existingFooter.remove();
          target.appendChild(footerEl);
          console.log('[tpl1-cart-debug] Footer hoisted to cart-sidebar ✓');
        }
      }

      // Vincular botones de cantidad/eliminar
      itemsContainer.querySelectorAll('[data-cart-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const el = btn as HTMLElement;
          const action = el.dataset.cartAction;
          const id = el.dataset.cartId || '';
          window.dispatchEvent(new CustomEvent('yaxsel:cart-action', { detail: { action, id } }));
        });
      });

      // Vincular botón vaciar carrito
      const clearBtn = document.getElementById('tpl1-clear-cart-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (items.length > 0) {
            window.dispatchEvent(new CustomEvent('yaxsel:cart-action', { detail: { action: 'clear' } }));
          }
        });
      }

      // Vincular imágenes del carrito: hover overlay + click zoom
      itemsContainer.querySelectorAll('.tpl1-cart-item-img').forEach(imgEl => {
        const overlay = imgEl.querySelector('.tpl1-cart-img-overlay') as HTMLElement | null;
        // Hover: show overlay
        imgEl.addEventListener('mouseenter', () => { if (overlay) overlay.style.opacity = '1'; });
        imgEl.addEventListener('mouseleave', () => { if (overlay) overlay.style.opacity = '0'; });
        // Click: open product page
        imgEl.addEventListener('click', () => {
          const pid = (imgEl as HTMLElement).dataset.productId;
          if (pid) window.location.href = `/productos/${pid}`;
        });
      });
    };

    populateCartDrawer();

    // ── Init Lottie animation for empty cart ──
    const initLottieCart = () => {
      const container = document.getElementById('lottie-cart-empty');
      if (container && !container.dataset.lottieInit) {
        container.dataset.lottieInit = '1';
        lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/lottie/cart.json',
        });
      }
    };
    initLottieCart();

    // ── Escuchar cambios del carrito React para repoblar drawer ──
    const onCartChange = () => {
      populateCartDrawer();
      initLottieCart();
    };
    window.addEventListener('yaxsel:cart-updated', onCartChange);

    // ── Escuchar acciones de cantidad desde el drawer ──
    const onCartAction = (e: Event) => {
      const { action, id } = (e as CustomEvent).detail;
      if (action === 'clear') {
        items.forEach(i => removeItem(i.product.$id));
        return;
      }
      const item = items.find(i => i.product.$id === id);
      if (!item) return;
      if (action === 'minus') updateQuantity(id, item.quantity - 1);
      else if (action === 'plus') updateQuantity(id, item.quantity + 1);
      else if (action === 'remove') removeItem(id);
    };
    window.addEventListener('yaxsel:cart-action', onCartAction);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      window.removeEventListener('yaxsel:cart-updated', onCartChange);
      window.removeEventListener('yaxsel:cart-action', onCartAction);
    };
  }, [bodyHtml, items, subtotal, totalItems, isLoggedIn, updateQuantity, removeItem]);

  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const widgetCfg = sectionCfg.find(s => s.id === 'tpl1_product_widget');
    const enabled = isSectionEnabled(sectionCfg, 'tpl1_product_widget');
    const settings = widgetCfg?.settings || {};
    const mode = settings.productWidgetMode || 'single';
    const wrappers = document.querySelectorAll('.product_hero_banner_wrapp');
    const hideAllWidgets = () => {
      wrappers.forEach(w => { (w as HTMLElement).style.display = 'none'; });
    };
    /** En móvil oculta el widget demo del HTML (SVG + "Título del Producto"). */
    const hidePlaceholderOnMobile = () => {
      if (typeof window === 'undefined' || window.innerWidth > 768) return;
      wrappers.forEach(w => {
        const el = w as HTMLElement;
        if (el.style.display === 'none') return;
        const titleText = (el.querySelector('.product-name a, .product-name')?.textContent || '').trim();
        const hasRealImg = !!el.querySelector('.product-img img, .product-image img');
        const svgOnly = !!el.querySelector('.product-img > svg, .product-image > svg') && !hasRealImg;
        const isDemo =
          !hasRealImg ||
          svgOnly ||
          titleText === 'Título del Producto' ||
          titleText === 'Product Title' ||
          /^\$[\d.,]+$/.test(titleText);
        if (isDemo) el.style.display = 'none';
      });
    };
    const isInStock = (p: Product | Record<string, unknown>) => (Number((p as Product).STOCK) || 0) > 0;
    const productDisplayPrice = (p: Product) => {
      const price = p.CURRENTPRICE && p.CURRENTPRICE > 0 ? p.CURRENTPRICE : p.PRICE;
      return formatPrice(price ?? 0);
    };
    const productToWidgetData = (p: Product) => ({
      title: p.NAME,
      price: productDisplayPrice(p),
      imageUrl: p.IMAGEURL || '',
      link: `/producto/${p.$id}`,
      productId: p.$id,
    });

    // Helper: apply visual styles to a widget element
    const applyWidgetStyles = (el: HTMLElement, productData: { title: string; price: string; imageUrl: string; link: string; productId?: string }) => {
      const title = el.querySelector('.product-name');
      const price = el.querySelector('.current-price');
      const img = el.querySelector('.product-image img') as HTMLImageElement | null;
      const btn = el.querySelector('.button_primary a') as HTMLAnchorElement | null;
      if (title) title.textContent = productData.title || 'Título del Producto';
      if (price) price.textContent = productData.price || '$20.00';
      if (img && productData.imageUrl) {
        img.style.transition = 'opacity 0.4s ease';
        img.style.opacity = '0';
        img.src = productData.imageUrl;
        const onImgLoad = () => { img.style.opacity = '1'; img.removeEventListener('load', onImgLoad); };
        img.addEventListener('load', onImgLoad);
        if (img.complete) { img.removeEventListener('load', onImgLoad); img.style.opacity = '1'; }
      }
      if (btn) {
        const action = settings.productWidgetButtonAction || 'link';
        const defaultBtnText = action === 'add_to_cart' ? 'Añadir al carrito' : 'Comprar Ahora';
        btn.textContent = settings.productWidgetButtonText || defaultBtnText;
        // Main button action: always link to product
        btn.onclick = null;
        btn.href = productData.link || '/productos';
      }

      // Add separate cart icon button
      const buttonContainer = el.querySelector('.button_primary') as HTMLElement;
      if (buttonContainer && !buttonContainer.querySelector('.tpl1-cart-icon-btn')) {
        const cartBtn = document.createElement('a');
        cartBtn.className = 'tpl1-cart-icon-btn musk-primary-btn';
        cartBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
        cartBtn.href = '#';
        cartBtn.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:8px;margin-left:8px;text-decoration:none;transition:transform 0.2s ease,background-color 0.2s ease;';
        if (settings.productWidgetButtonColor) cartBtn.style.backgroundColor = settings.productWidgetButtonColor;
        if (settings.productWidgetButtonTextColor) cartBtn.style.color = settings.productWidgetButtonTextColor;
        if (settings.productWidgetButtonRadius !== undefined) cartBtn.style.borderRadius = `${settings.productWidgetButtonRadius}px`;

        // Store product ID on container for cart button
        el.dataset.productId = productData.productId || '';

        cartBtn.onclick = (e) => {
          e.preventDefault();
          const pid = el.dataset.productId;
          if (pid) {
            const found = rotationProducts.find(p => p.$id === pid);
            if (found) {
              addItem(found, 1);
              cartBtn.style.transform = 'scale(1.2)';
              cartBtn.style.backgroundColor = '#22c55e';
              setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
                if (settings.productWidgetButtonColor) cartBtn.style.backgroundColor = settings.productWidgetButtonColor;
              }, 300);
            }
          }
        };
        buttonContainer.appendChild(cartBtn);
      } else if (buttonContainer) {
        // Update existing cart button
        const cartBtn = buttonContainer.querySelector('.tpl1-cart-icon-btn') as HTMLAnchorElement;
        if (cartBtn) {
          el.dataset.productId = productData.productId || '';
          cartBtn.onclick = (e) => {
            e.preventDefault();
            const pid = el.dataset.productId;
            if (pid) {
              const found = rotationProducts.find(p => p.$id === pid);
              if (found) {
                addItem(found, 1);
                cartBtn.style.transform = 'scale(1.2)';
                cartBtn.style.backgroundColor = '#22c55e';
                setTimeout(() => {
                  cartBtn.style.transform = 'scale(1)';
                  if (settings.productWidgetButtonColor) cartBtn.style.backgroundColor = settings.productWidgetButtonColor;
                }, 300);
              }
            }
          };
        }
      }
    };

    // Shared product list for add-to-cart lookup
    let rotationProducts: Product[] = [];

    // Helper: apply layout/design styles (independent of product data)
    const applyLayoutStyles = (el: HTMLElement) => {
      el.dataset.sectionId = 'tpl1_product_widget';
      el.style.display = enabled ? '' : 'none';
      if (!enabled) return;
      const btn = el.querySelector('.button_primary a') as HTMLAnchorElement | null;
      if (btn) {
        if (settings.productWidgetButtonColor) btn.style.backgroundColor = settings.productWidgetButtonColor;
        if (settings.productWidgetButtonTextColor) btn.style.setProperty('color', settings.productWidgetButtonTextColor, 'important');
        if (settings.productWidgetButtonRadius !== undefined) btn.style.borderRadius = `${settings.productWidgetButtonRadius}px`;
        if (settings.productWidgetButtonPadding !== undefined) btn.style.padding = `${settings.productWidgetButtonPadding}px ${settings.productWidgetButtonPadding * 1.5}px`;
        if (settings.productWidgetButtonFontSize !== undefined) btn.style.fontSize = `${settings.productWidgetButtonFontSize}px`;
        if (settings.productWidgetShadow && settings.productWidgetShadow !== 'none') {
          const shadows: Record<string, string> = { sm: '0 1px 2px rgba(0,0,0,0.1)', md: '0 4px 6px rgba(0,0,0,0.15)', lg: '0 10px 15px rgba(0,0,0,0.2)' };
          btn.style.boxShadow = shadows[settings.productWidgetShadow];
        }
      }
      const progress = el.querySelector('.progress') as HTMLElement | null;
      if (progress && settings.productWidgetDuration) progress.dataset.duration = String(settings.productWidgetDuration);
      if (settings.productWidgetBgColor) el.style.background = settings.productWidgetBgColor;
      if (settings.productWidgetBorderColor) el.style.borderColor = settings.productWidgetBorderColor;
      if (settings.productWidgetBlur !== undefined) {
        el.style.backdropFilter = `blur(${settings.productWidgetBlur}px)`;
        (el.style as any).webkitBackdropFilter = `blur(${settings.productWidgetBlur}px)`;
      }
      if (settings.productWidgetBorderRadius !== undefined) el.style.borderRadius = `${settings.productWidgetBorderRadius}px`;
      const posY = settings.productWidgetPositionY ?? 70;
      const posX = settings.productWidgetPositionX ?? 50;
      el.style.setProperty('top', `${posY}%`, 'important');
      el.style.setProperty('left', `${posX}%`, 'important');
      el.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
    };

    // Single mode: producto fijo (solo si hay stock cuando viene de Appwrite)
    if (mode === 'single') {
      wrappers.forEach(wrapper => applyLayoutStyles(wrapper as HTMLElement));
      if (!enabled) return;

      (async () => {
        if (settings.productWidgetProductId) {
          try {
            const res = await fetch('/api/public-data/products').then(r => r.json());
            const product = (res.products || []).find((p: any) => p.$id === settings.productWidgetProductId!);
            if (!product) throw new Error('Not found');
            if (!isInStock(product)) {
              hideAllWidgets();
              return;
            }
            rotationProducts = [product];
            const data = productToWidgetData(product);
            wrappers.forEach(wrapper => {
              applyLayoutStyles(wrapper as HTMLElement);
              applyWidgetStyles(wrapper as HTMLElement, data);
            });
            hidePlaceholderOnMobile();
          } catch {
            hideAllWidgets();
          }
          return;
        }

        hideAllWidgets();
      })();
      return;
    }

    // Multi-product rotation mode (category / subcategory / random)
    let rotationTimer: ReturnType<typeof setInterval> | null = null;
    let currentIdx = 0;
    let products: Product[] = [];

    const startRotation = () => {
      if (products.length === 0) {
        hideAllWidgets();
        return;
      }
      rotationProducts = products;
      const interval = (settings.productWidgetSlideInterval || 5) * 1000;

      // Show first product immediately
      wrappers.forEach(wrapper => {
        const el = wrapper as HTMLElement;
        applyLayoutStyles(el);
        if (enabled) applyWidgetStyles(el, productToWidgetData(products[0]));
      });
      hidePlaceholderOnMobile();

      // Rotate every N seconds with card shuffle animation
      rotationTimer = setInterval(() => {
        currentIdx = (currentIdx + 1) % products.length;
        const p = products[currentIdx];
        wrappers.forEach(wrapper => {
          const el = wrapper as HTMLElement;
          // Shuffle animation: slide out right with rotation
          el.style.transition = 'transform 0.4s ease-out, opacity 0.3s ease';
          el.style.transform = 'translate(-50%, -50%) translateX(100px) rotate(-15deg)';
          el.style.opacity = '0';
          setTimeout(() => {
            // Update content
            applyWidgetStyles(el, productToWidgetData(p));
            // Slide in from right with opposite rotation
            el.style.transform = 'translate(-50%, -50%) translateX(100px) rotate(15deg)';
            setTimeout(() => {
              el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
              el.style.transform = 'translate(-50%, -50%) translateX(0) rotate(0)';
              el.style.opacity = '1';
            }, 50);
          }, 400);
        });
      }, interval);
    };

    (async () => {
      try {
        const count = settings.productWidgetProductCount || 10;
        const res = await fetch('/api/public-data/products').then(r => r.json());
        const filtered = (res.products || []).filter((p: any) => {
          if (p.STOCK <= 0) return false;
          if (mode === 'category' && settings.productWidgetCategoryId && p.CATEGORYID !== settings.productWidgetCategoryId) return false;
          if (mode === 'subcategory' && settings.productWidgetSubcategoryId && p.SUBCATEGORYID !== settings.productWidgetSubcategoryId) return false;
          return true;
        });
        const finalDocs = filtered.slice(0, count);
        let docs = finalDocs as unknown as Product[];

        if (mode === 'random' && docs.length > count) {
          // Fisher-Yates shuffle
          for (let i = docs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [docs[i], docs[j]] = [docs[j], docs[i]];
          }
          docs = docs.slice(0, count);
        }

        products = docs;
        if (products.length === 0) {
          hideAllWidgets();
          return;
        }
        startRotation();
      } catch (e) {
        console.error('[TPL1] Error fetching products for widget rotation:', e);
        hideAllWidgets();
      }
    })();

    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, [bodyHtml, sectionCfg]);

  /* ── Collection list section ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_collection_list');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__collection_list_WrFbPe';
    const section = document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;
    if (!cfg.enabled) return;

    const modelId = settings.modelId || 'editorial';
    const isPremium = modelId === 'editorial';
    section.setAttribute('data-collection-model', modelId);

    const sectionRoot = document.getElementById('shopify-section-template--22405132419320__collection_list_WrFbPe')
      || (section.closest('.shopify-section') as HTMLElement | null);

    const setupPremiumSection = () => {
      if (!sectionRoot || !isPremium) return;
      sectionRoot.classList.add('tpl1-collections-premium');
      if (!sectionRoot.querySelector('.tpl1-col-bg-orb--1')) {
        ['tpl1-col-bg-orb--1', 'tpl1-col-bg-orb--2', 'tpl1-col-bg-orb--3'].forEach(cls => {
          const orb = document.createElement('div');
          orb.className = `tpl1-col-bg-orb ${cls}`;
          sectionRoot.insertBefore(orb, sectionRoot.firstChild);
        });
      }
      const secTitle = section.querySelector('.musk-sec-title') as HTMLElement | null;
      if (secTitle && !secTitle.querySelector('.tpl1-col-header-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'tpl1-col-header-wrap';
        const eyebrow = document.createElement('div');
        eyebrow.className = 'tpl1-col-eyebrow';
        const dot = document.createElement('span');
        dot.className = 'tpl1-col-eyebrow-dot';
        eyebrow.appendChild(dot);
        const sub = secTitle.querySelector('.musk-fancy-sub-head');
        if (sub) eyebrow.appendChild(sub);
        const line = document.createElement('span');
        line.className = 'tpl1-col-title-line';
        const h2 = secTitle.querySelector('.musk-h2-head');
        const para = secTitle.querySelector('.musk-main-para');
        wrap.appendChild(eyebrow);
        if (h2) wrap.appendChild(h2);
        wrap.appendChild(line);
        if (para) wrap.appendChild(para);
        secTitle.innerHTML = '';
        secTitle.appendChild(wrap);
      }
      const carousel = section.querySelector('.musk_collection1') as HTMLElement | null;
      if (carousel) carousel.classList.add('tpl1-col-carousel');
    };

    const layoutCollectionTitles = () => {
      setupPremiumSection();
      const slides = section.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>;
      slides.forEach((slide, idx) => {
        const imgContent = slide.querySelector('.img-content');
        const titleLink = slide.querySelector('.collection_list_title_main') as HTMLAnchorElement | null;
        const slideWrap = slide.querySelector('.musk-collection-slide') as HTMLElement | null;
        if (!imgContent || !titleLink || !slideWrap) return;

        let footer = slide.querySelector('.tpl1-collection-footer') as HTMLElement | null;
        if (!footer) {
          footer = document.createElement('div');
          footer.className = 'tpl1-collection-footer';
        }
        if (titleLink.parentElement !== footer) {
          if (titleLink.parentElement === imgContent) imgContent.removeChild(titleLink);
          footer.appendChild(titleLink);
          if (!footer.parentElement) slideWrap.appendChild(footer);
        }

        const slideTitle = titleLink.querySelector('.slide-title') as HTMLElement | null;
        if (slideTitle) {
          slideTitle.classList.remove('display-font-6', 'heading_color', 'inner_heading_color');
          slideTitle.removeAttribute('style'); // Let CSS handle it
        }
        titleLink.removeAttribute('style'); // Let CSS handle it
        titleLink.removeAttribute('tabindex');
        titleLink.querySelectorAll('.tpl1-collection-visible-name').forEach(el => el.remove());

        if (isPremium) {
          if (!slideWrap.querySelector('.tpl1-col-card-shine')) {
            const shine = document.createElement('div');
            shine.className = 'tpl1-col-card-shine';
            slideWrap.appendChild(shine);
          }
          let badge = slideWrap.querySelector('.tpl1-col-index') as HTMLElement | null;
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'tpl1-col-index';
            slideWrap.appendChild(badge);
          }
          badge.textContent = String(idx + 1).padStart(2, '0');
        }
      });
    };

    setupPremiumSection();

    // Title, subtitle, description
    const subHead = section.querySelector('.musk-fancy-sub-head') as HTMLElement;
    const mainTitle = section.querySelector('.musk-h2-head') as HTMLElement;
    const mainPara = section.querySelector('.musk-main-para') as HTMLElement;
    if (subHead && settings.collectionSubtitle) subHead.textContent = settings.collectionSubtitle;
    if (mainTitle && settings.collectionTitle) mainTitle.textContent = settings.collectionTitle;
    if (mainPara && settings.collectionDescription) mainPara.textContent = settings.collectionDescription;
    if (!isPremium) {
      applyTpl1SectionColors(section as HTMLElement, settings);
    } else if (sectionRoot) {
      sectionRoot.style.setProperty('background-color', settings.bgColor || '#0a0908', 'important');
    }

    if (!document.getElementById('tpl1-fraunces-font')) {
      const link = document.createElement('link');
      link.id = 'tpl1-fraunces-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap';
      document.head.appendChild(link);
    }

    // Apply card-level styles from theme editor presets
    const shadowMap: Record<string, string> = {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
      md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    };

    // Inject/update dynamic style tag at END of body (after all external CSS)
    // This ensures our rules win over shopify-fix.css and mobile-responsive.css
    let dynStyle = document.getElementById('tpl1-collection-card-style') as HTMLStyleElement | null;
    if (!dynStyle) {
      dynStyle = document.createElement('style');
      dynStyle.id = 'tpl1-collection-card-style';
      document.body.appendChild(dynStyle); // body, not head — loads after all CSS
    }
    const cBg = settings.cardBgColor || '#ffffff';
    const cTx = settings.cardTextColor || '#1c1917';
    const cSh = settings.shadow ? (shadowMap[settings.shadow] || shadowMap.md) : shadowMap.md;
    const cR = settings.borderRadius !== undefined ? settings.borderRadius : 20;
    const cCols = settings.columns || 3;
    const accent = settings.accentColor || settings.buttonColor || '#be185d';
    const btnTx = settings.buttonTextColor || '#ffffff';
    const headingFont = settings.headingFontFamily || '"Fraunces", "Playfair Display", Georgia, serif';
    const bodyFont = settings.fontFamily || '"DM Sans", system-ui, sans-serif';
    // Use very high specificity: section[data-collection-model] + double class selectors
    dynStyle.textContent = `
      /* ── Colecciones: tipografía de sección ── */
      [data-template="1"] #shopify-section-template--22405132419320__collection_list_WrFbPe .musk-fancy-sub-head {
        font-family: ${bodyFont} !important;
        letter-spacing: 0.22em !important;
        text-transform: uppercase !important;
        font-size: 11px !important;
        font-weight: 700 !important;
      }
      [data-template="1"] #shopify-section-template--22405132419320__collection_list_WrFbPe .musk-h2-head {
        font-family: ${headingFont} !important;
        font-weight: 700 !important;
        letter-spacing: -0.02em !important;
        line-height: 1.1 !important;
      }
      [data-template="1"] #shopify-section-template--22405132419320__collection_list_WrFbPe .musk-main-para {
        font-family: ${bodyFont} !important;
        line-height: 1.65 !important;
        max-width: 52ch !important;
      }
      [data-template="1"] .musk_collection1[data-collection-model="editorial"] .tpl1-collection-footer::after {
        background: linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%) !important;
        color: ${btnTx} !important;
      }
      /* ── Collection card theming (theme editor) ── */
      [data-template="1"] .musk_collection1.musk_collection1 .musk-collection-slide.musk-collection-slide {
        ${isPremium ? '' : `background: ${cBg} !important; box-shadow: ${cSh} !important;`}
        border-radius: ${cR}px !important;
        overflow: hidden !important;
      }
      [data-template="1"] .musk_collection1.musk_collection1 .musk-collection-slide .img-content.img-content {
        border-radius: ${cR}px !important;
        overflow: hidden !important;
      }
      ${isPremium ? '' : `
      [data-template="1"] .musk_collection1.musk_collection1 .tpl1-collection-footer.tpl1-collection-footer,
      [data-template="1"] .musk_collection1.musk_collection1 .tpl1-collection-footer .slide-title.slide-title,
      [data-template="1"] .musk_collection1.musk_collection1 .tpl1-collection-footer .collection_list_title_main.collection_list_title_main,
      [data-template="1"] .musk_collection1.musk_collection1 .tpl1-collection-footer .inner_heading_color.inner_heading_color {
        color: ${cTx} !important;
        -webkit-text-fill-color: ${cTx} !important;
        text-shadow: none !important;
      }`}
      [data-template="1"] .musk_collection1.musk_collection1 .swiper-slide.swiper-slide {
        width: ${100 / cCols}% !important;
        flex: 0 0 ${100 / cCols}% !important;
        max-width: ${100 / cCols}% !important;
      }
      /* Override hover color reset from mobile-responsive.css */
      ${isPremium ? '' : `
      [data-template="1"] .musk_collection1.musk_collection1 .swiper-slide:hover .slide-title.slide-title,
      [data-template="1"] .musk_collection1.musk_collection1 .swiper-slide:hover .collection_list_title_main.collection_list_title_main {
        color: ${cTx} !important;
        -webkit-text-fill-color: ${cTx} !important;
      }`}
    `;

    // Also apply inline styles directly as backup (setProperty with 'important')
    const allSlides = section.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>;
    allSlides.forEach(slide => {
      const card = slide.querySelector('.musk-collection-slide') as HTMLElement
        || slide.querySelector('.collectiony_main_card_inner') as HTMLElement
        || slide;
      if (settings.cardBgColor && !isPremium) card.style.setProperty('background', settings.cardBgColor, 'important');
      if (settings.cardTextColor && !isPremium) {
        const titleEl = slide.querySelector('.slide-title') as HTMLElement | null;
        const footerEl = slide.querySelector('.tpl1-collection-footer') as HTMLElement | null;
        const linkEl = slide.querySelector('.collection_list_title_main') as HTMLElement | null;
        const innerHeading = slide.querySelector('.inner_heading_color') as HTMLElement | null;
        if (titleEl) paintTpl1Text(titleEl, settings.cardTextColor);
        if (footerEl) {
          footerEl.style.setProperty('color', settings.cardTextColor, 'important');
          footerEl.style.setProperty('-webkit-text-fill-color', settings.cardTextColor, 'important');
          footerEl.style.setProperty('text-shadow', 'none', 'important');
        }
        if (linkEl) {
          linkEl.style.setProperty('color', settings.cardTextColor, 'important');
          linkEl.style.setProperty('-webkit-text-fill-color', settings.cardTextColor, 'important');
        }
        if (innerHeading) paintTpl1Text(innerHeading, settings.cardTextColor);
      }
      if (settings.shadow) card.style.setProperty('box-shadow', shadowMap[settings.shadow] || 'none', 'important');
      if (settings.borderRadius !== undefined) {
        card.style.setProperty('border-radius', `${settings.borderRadius}px`, 'important');
        const imgContent = slide.querySelector('.img-content') as HTMLElement | null;
        if (imgContent) {
          imgContent.style.setProperty('border-radius', `${settings.borderRadius}px`, 'important');
          imgContent.style.setProperty('overflow', 'hidden', 'important');
        }
      }
      // Columns via inline
      if (settings.columns) {
        const cols = Math.max(2, Math.min(6, settings.columns));
        slide.style.setProperty('width', `${100 / cols}%`, 'important');
        slide.style.setProperty('flex', `0 0 ${100 / cols}%`, 'important');
        slide.style.setProperty('max-width', `${100 / cols}%`, 'important');
      }
    });

    const runCollectionEntrance = () => {
      if (!isPremium || typeof window === 'undefined') return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      const header = section.querySelector('.tpl1-col-header-wrap') as HTMLElement | null;
      const cardSlides = Array.from(section.querySelectorAll('.musk_collection1 .swiper-slide')) as HTMLElement[];

      if (header) {
        gsap.fromTo(header.children, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: header, start: 'top 88%', once: true },
        });
      }

      cardSlides.forEach((slide, i) => {
        slide.classList.add('tpl1-col-animate-pending');
        gsap.fromTo(slide, { opacity: 0, y: 44 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: slide, start: 'top 92%', once: true },
          onComplete: () => slide.classList.remove('tpl1-col-animate-pending'),
        });
      });
    };

    const bindCardTilt = () => {
      if (!isPremium || window.innerWidth < 769) return () => {};
      const cleanups: (() => void)[] = [];

      section.querySelectorAll('.musk-collection-slide').forEach(card => {
        const el = card as HTMLElement;
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-8px) scale(1.02)`;
        };
        const onLeave = () => { el.style.transform = ''; };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
          el.style.transform = '';
        });
      });

      return () => cleanups.forEach(fn => fn());
    };

    // Collection items → update slides
    const bindCollectionLayout = () => {
      layoutCollectionTitles();
      const t1 = window.setTimeout(layoutCollectionTitles, 200);
      const t2 = window.setTimeout(layoutCollectionTitles, 800);
      const t3 = window.setTimeout(runCollectionEntrance, 400);
      const cleanupTilt = bindCardTilt();
      window.addEventListener('resize', layoutCollectionTitles);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
        window.removeEventListener('resize', layoutCollectionTitles);
        cleanupTilt();
        ScrollTrigger.getAll().filter(st => {
          const tr = st.trigger as HTMLElement | undefined;
          return tr?.closest?.('[data-section-id="template--22405132419320__collection_list_WrFbPe"]');
        }).forEach(st => st.kill());
      };
    };

    const items = (settings.collectionItems || []) as CollectionItem[];
    const slides = section.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>;
    if (items.length === 0) {
      return bindCollectionLayout();
    }
    items.forEach((item, idx) => {
      if (idx >= slides.length) return;
      const slide = slides[idx];

      // Remove contrass-bg class to prevent dark overlay from theme
      const contrassBg = slide.querySelector('.contrass-bg') as HTMLElement;
      if (contrassBg) {
        contrassBg.classList.remove('contrass-bg');
      }

      // Update image
      const imgContent = slide.querySelector('.img-content') as HTMLElement;
      if (imgContent && item.imageUrl) {
        const existingImg = imgContent.querySelector('img') as HTMLImageElement;
        if (existingImg) {
          existingImg.src = item.imageUrl;
        } else {
          // Replace SVG placeholder with img
          const svg = imgContent.querySelector('.placeholder-svg');
          if (svg) svg.remove();
          const img = document.createElement('img');
          img.src = item.imageUrl;
          img.alt = item.name;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
          imgContent.appendChild(img);
        }
      }

      // Update title
      const slideTitle = slide.querySelector('.slide-title') as HTMLElement;
      if (slideTitle) {
        slideTitle.textContent = item.name;
        slideTitle.removeAttribute('style'); // Let CSS handle it
      }

      const href = collectionItemHref(item);
      const titleLink = slide.querySelector('.collection_list_title_main') as HTMLAnchorElement;
      if (titleLink) {
        titleLink.href = href;
        titleLink.setAttribute('aria-label', item.name);
        titleLink.removeAttribute('tabindex');
      }
      const cardLink = slide.querySelector('.collectiony_main_card_inner') as HTMLAnchorElement;
      if (cardLink) {
        cardLink.href = href;
        cardLink.setAttribute('aria-label', item.name);
      }
    });

    // Hide extra slides
    for (let i = items.length; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (let i = 0; i < Math.min(items.length, slides.length); i++) {
      slides[i].style.display = '';
    }

    // ── Mobile touch: first tap shows overlay, only "Ingresar" navigates ──
    const isMobile = () => window.innerWidth <= 768;
    const activeOverlayClass = 'tpl1-collection-overlay-active';

    const handleSlideTouch = (e: Event) => {
      if (!isMobile()) return;
      const slide = (e.currentTarget as HTMLElement).closest('.swiper-slide') as HTMLElement;
      if (!slide) return;
      const footer = slide.querySelector('.tpl1-collection-footer') as HTMLElement;
      if (!footer) return;

      // If overlay is already visible, check if tap is on the "Ingresar" area (footer::after)
      if (slide.classList.contains(activeOverlayClass)) {
        // If tapping outside the footer overlay, hide it and block navigation
        const rect = footer.getBoundingClientRect();
        const tapX = (e as TouchEvent).touches?.[0]?.clientX ?? (e as MouseEvent).clientX;
        const tapY = (e as TouchEvent).touches?.[0]?.clientY ?? (e as MouseEvent).clientY;
        if (tapX < rect.left || tapX > rect.right || tapY < rect.top || tapY > rect.bottom) {
          e.preventDefault();
          e.stopPropagation();
          slide.classList.remove(activeOverlayClass);
          footer.style.opacity = '0';
          footer.style.visibility = 'hidden';
        }
        // If tapping inside footer, let it navigate (title link click)
        return;
      }

      // First tap: show overlay, block navigation
      e.preventDefault();
      e.stopPropagation();
      slide.classList.add(activeOverlayClass);
      footer.style.opacity = '1';
      footer.style.visibility = 'visible';
    };

    const handleSlideClick = (e: Event) => {
      if (!isMobile()) return;
      const slide = (e.currentTarget as HTMLElement).closest('.swiper-slide') as HTMLElement;
      if (!slide) return;
      const footer = slide.querySelector('.tpl1-collection-footer') as HTMLElement;
      if (!footer) return;

      // If overlay not active yet, block the click and show overlay
      if (!slide.classList.contains(activeOverlayClass)) {
        e.preventDefault();
        e.stopPropagation();
        slide.classList.add(activeOverlayClass);
        footer.style.opacity = '1';
        footer.style.visibility = 'visible';
        return;
      }
      // Overlay is active — allow click only on the footer (title link / Ingresar)
      const target = e.target as HTMLElement;
      if (!footer.contains(target)) {
        e.preventDefault();
        e.stopPropagation();
        slide.classList.remove(activeOverlayClass);
        footer.style.opacity = '0';
        footer.style.visibility = 'hidden';
      }
    };

    // Dismiss overlay when tapping outside any collection slide
    const handleDocClick = (e: Event) => {
      if (!isMobile()) return;
      const target = e.target as HTMLElement;
      const anySlide = target.closest('.musk_collection1 .swiper-slide');
      if (!anySlide) {
        document.querySelectorAll(`.${activeOverlayClass}`).forEach(s => {
          s.classList.remove(activeOverlayClass);
          const f = s.querySelector('.tpl1-collection-footer') as HTMLElement;
          if (f) { f.style.opacity = '0'; f.style.visibility = 'hidden'; }
        });
      }
    };

    if (!isPremium) {
      slides.forEach(slide => {
        const cardInner = slide.querySelector('.collectiony_main_card_inner') as HTMLElement;
        const target = cardInner || slide;
        target.addEventListener('click', handleSlideClick, true);
        target.addEventListener('touchend', handleSlideTouch, true);
      });
      document.addEventListener('click', handleDocClick, true);
    }

    // Inject mobile collection card styles (guaranteed to override everything)
    if (!document.getElementById('tpl1-collection-mobile-style')) {
      const style = document.createElement('style');
      style.id = 'tpl1-collection-mobile-style';
      style.textContent = `
        @media screen and (max-width: 768px) {
          [data-template="1"] .musk_collection1 .musk-collection-slide .img-content {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
          }
          [data-template="1"] .musk_collection1 .musk-collection-slide .img-content img,
          [data-template="1"] .musk_collection1 .musk-collection-slide .img-content svg.placeholder-svg {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            aspect-ratio: auto !important;
            min-height: 0 !important;
            object-fit: cover !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const cleanup = bindCollectionLayout();
    return () => {
      cleanup();
      slides.forEach(slide => {
        const cardInner = slide.querySelector('.collectiony_main_card_inner') as HTMLElement;
        const target = cardInner || slide;
        target.removeEventListener('click', handleSlideClick, true);
        target.removeEventListener('touchend', handleSlideTouch, true);
      });
      document.removeEventListener('click', handleDocClick, true);
    };
  }, [bodyHtml, sectionCfg]);

  useEffect(() => {
    const cfg = sectionCfg.find(s => s.id === 'tpl1_featured_product');
    const pid = cfg?.settings?.featuredProductProductId;
    if (!pid) {
      setFeaturedProduct(null);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/public-data/products').then(r => r.json());
        const product = (res.products || []).find((p: any) => p.$id === pid);
        if (alive && product) setFeaturedProduct(normalizeProductImages(product as unknown as Product));
      } catch {
        if (alive) setFeaturedProduct(null);
      }
    })();
    return () => { alive = false; };
  }, [sectionCfg]);

  /* ── Aplicar settings de producto destacado (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_featured_product');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__featured_product_mtqd9n';
    const section = (document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`)) as HTMLElement | null;
    if (!section) return;

    const subHead = section.querySelector('.musk-fancy-sub-head') as HTMLElement;
    const mainTitle = section.querySelector('.musk-h2-head') as HTMLElement;
    const mainPara = section.querySelector('.musk-main-para') as HTMLElement;
    if (subHead && settings.featuredProductSubtitle) subHead.textContent = settings.featuredProductSubtitle;
    if (mainTitle && settings.featuredProductTitle) mainTitle.textContent = settings.featuredProductTitle;
    if (mainPara && settings.featuredProductDescription) mainPara.textContent = settings.featuredProductDescription;

    // Apply font styles
    const fontFamily = settings.featuredProductFontFamily;
    const fontSize = settings.featuredProductFontSize;
    const fontWeight = settings.featuredProductFontWeight;
    const color = settings.featuredProductColor;
    [subHead, mainTitle, mainPara].forEach(el => {
      if (!el) return;
      if (fontFamily) el.style.fontFamily = fontFamily;
      if (fontSize) el.style.fontSize = `${fontSize}px`;
      if (fontWeight) el.style.fontWeight = String(fontWeight);
      if (color) paintTpl1Text(el, color);
    });
    applyTpl1SectionColors(section, settings);

    if (!featuredProduct) return;
    const images = [
      featuredProduct.IMAGEURL,
      featuredProduct.IMAGEURL2,
      featuredProduct.IMAGEURL3,
      featuredProduct.IMAGEURL4,
      featuredProduct.IMAGEURL5,
    ].filter(Boolean) as string[];
    // If a custom image is set, it replaces the product's main image
    const customImage = settings.featuredProductPosterImage;
    if (customImage && images.length > 0) {
      images[0] = customImage;
    }
    const posterImage = customImage || images[0];

    const mediaItems = settings.featuredProductVideoUrl
      ? [{ type: 'video', url: settings.featuredProductVideoUrl, poster: posterImage }, ...images.map(url => ({ type: 'image', url }))]
      : images.map(url => ({ type: 'image', url }));

    const galleryContent = section.querySelector('.product-gallery-content') as HTMLElement;
    if (galleryContent) {
      const shouldHideGallery = !settings.featuredProductVideoUrl && images.length <= 1;
      galleryContent.style.display = shouldHideGallery ? 'none' : '';
    }

    const gallerySlides = section.querySelectorAll('.product-gallery-content .swiper-slide') as NodeListOf<HTMLElement>;
    gallerySlides.forEach((slide, idx) => {
      const media = mediaItems[idx];
      if (!media?.url) {
        // Remove unused slides from DOM entirely so Swiper doesn't show blank ones
        slide.remove();
        return;
      }
      slide.style.display = '';
      if (media.type === 'video') {
        // Clear entire slide first — remove Shopify's autoplay video
        slide.innerHTML = '';
        // Create a wrapper to center icons on the video area
        const videoWrap = document.createElement('div');
        videoWrap.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;border-radius:inherit;';

        // Show poster image — NO video element until user clicks
        const poster = (media as any).poster;
        if (poster) {
          const posterEl = document.createElement('img');
          posterEl.src = poster;
          posterEl.alt = 'Video poster';
          posterEl.className = 'tpl1-fp-poster';
          posterEl.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;';
          videoWrap.appendChild(posterEl);
        }

        slide.appendChild(videoWrap);

        let videoCreated = false;
        let videoElement: HTMLVideoElement | null = null;

        // Play/pause based on viewport visibility
        const fpObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!videoCreated) {
              if (entry.isIntersecting) {
                // First time visible: create and play video
                const video = document.createElement('video');
                video.src = media.url;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('muted', '');
                video.preload = 'auto';
                video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;opacity:0;transition:opacity 0.15s ease;';
                const posterImg = videoWrap.querySelector('.tpl1-fp-poster');
                if (posterImg) (posterImg as HTMLElement).style.position = 'relative';
                videoWrap.insertBefore(video, posterImg || null);
                video.onplaying = () => {
                  // Simple fade transition - no brightness effect
                  if (posterImg) {
                    (posterImg as HTMLElement).style.transition = 'opacity 0.3s ease';
                    (posterImg as HTMLElement).style.opacity = '0';
                    setTimeout(() => {
                      if (posterImg.parentNode) posterImg.remove();
                    }, 300);
                  }
                  video.style.opacity = '1';
                };
                video.play().catch(() => { });
                videoElement = video;
                videoCreated = true;
              }
            } else if (videoElement) {
              // Already created: toggle play/pause based on visibility
              if (entry.isIntersecting) {
                videoElement.play().catch(() => { });
              } else {
                videoElement.pause();
              }
            }
          });
        }, { threshold: 0.5 });
        fpObserver.observe(slide);
      } else {
        const img = slide.querySelector('img') as HTMLImageElement | null;
        if (img) {
          img.src = media.url;
          img.alt = featuredProduct.NAME;
        } else {
          slide.innerHTML = `<img src="${media.url}" alt="${featuredProduct.NAME}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;" />`;
        }
      }
    });

    const thumbnailSlides = section.querySelectorAll('.productgallerythumbnail .swiper-slide') as NodeListOf<HTMLElement>;
    thumbnailSlides.forEach((thumb, idx) => {
      const media = mediaItems[idx];
      if (!media?.url) {
        thumb.remove();
        return;
      }
      thumb.style.display = '';
      if (media.type === 'video') {
        thumb.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;border-radius:inherit;position:relative;">
          <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('${images[0] || ''}') center/cover;opacity:0.5;"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style="z-index:1;"><path d="M8 5v14l11-7z"/></svg>
        </div>`;
      } else {
        const img = thumb.querySelector('img') as HTMLImageElement | null;
        if (img) {
          img.src = media.url;
          img.alt = featuredProduct.NAME;
        } else {
          thumb.innerHTML = `<img src="${media.url}" alt="${featuredProduct.NAME}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;" />`;
        }
      }
    });

    // If only 1 image and no video, also inject the main image directly into the left-content area
    // as a fallback (bypassing Swiper which may not initialize properly with 1 slide)
    if (!settings.featuredProductVideoUrl && images.length === 1) {
      const leftContent = section.querySelector('.left-content') as HTMLElement;
      if (leftContent && !leftContent.querySelector('.tpl1-fp-single-img')) {
        const directImg = document.createElement('img');
        directImg.src = images[0];
        directImg.alt = featuredProduct.NAME;
        directImg.className = 'tpl1-fp-single-img';
        directImg.style.cssText = 'width:100%;height:auto;max-height:600px;object-fit:cover;display:block;border-radius:50px;';
        // Insert before the swiper element
        const swiperEl = leftContent.querySelector('fuzion-swiper-slider') || leftContent.firstElementChild;
        if (swiperEl) {
          leftContent.insertBefore(directImg, swiperEl);
        } else {
          leftContent.appendChild(directImg);
        }
        // Hide the swiper entirely for single-image
        const swiperSlider = leftContent.querySelector('fuzion-swiper-slider') as HTMLElement;
        if (swiperSlider) swiperSlider.style.display = 'none';
      }
    } else {
      // Remove any previously injected single image
      section.querySelectorAll('.tpl1-fp-single-img').forEach(el => el.remove());
      const swiperEl = section.querySelector('.left-content fuzion-swiper-slider') as HTMLElement;
      if (swiperEl) swiperEl.style.display = '';
    }

    const productName = section.querySelector('.product-name') as HTMLElement;
    if (productName) productName.textContent = featuredProduct.NAME;

    const price = section.querySelector('.product-price') as HTMLElement;
    if (price) {
      const current = featuredProduct.CURRENTPRICE && featuredProduct.CURRENTPRICE > 0 ? featuredProduct.CURRENTPRICE : featuredProduct.PRICE;
      const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
      const hasDisc = featuredProduct.CURRENTPRICE && featuredProduct.CURRENTPRICE < featuredProduct.PRICE;
      price.innerHTML = hasDisc
        ? `<del style="font-size:0.85em;opacity:0.55;margin-right:8px;">${fmt(featuredProduct.PRICE)}</del><span class="current-price" style="font-size:1.35em;font-weight:800;color:#ec4899;">${fmt(current)}</span>`
        : `<span class="current-price" style="font-size:1.35em;font-weight:800;color:#ec4899;">${fmt(current)}</span>`;
      price.style.display = 'flex';
      price.style.alignItems = 'baseline';
      price.style.justifyContent = 'center';
      price.style.flexWrap = 'wrap';
      price.style.gap = '4px';
      price.style.marginTop = '8px';
    }

    const desc = section.querySelector('.product-detail .rte') as HTMLElement;
    if (desc) desc.textContent = featuredProduct.DESCRIPTION || '';

    const btn = section.querySelector('.product-cart-btn-row .musk-primary-btn') as HTMLButtonElement;
    if (btn) {
      btn.disabled = false;
      btn.textContent = featuredProduct.STOCK > 0 ? 'Ver producto' : 'Agotado';
      btn.setAttribute('aria-label', btn.textContent || 'Ver producto');
      btn.onclick = () => { window.location.href = `/producto/${featuredProduct.$id}`; };
    }
  }, [bodyHtml, sectionCfg, featuredProduct]);

  /* ── Shop The Look (tpl1): Premium Mobile Grid + Multiple Looks Support ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;

    const shopLookEnabled = isSectionEnabled(sectionCfg, 'tpl1_shop_the_look');
    const sectionIds = [
      'template--22405132419320__shop_the_look_tmNjgg',
      'template--22405132747000__look_C7KqPk',
      'template--22405132419320__shop_the_look_tmNjgg_optimized',
    ];

    if (!shopLookEnabled) {
      for (const id of sectionIds) {
        const sec = document.getElementById(`shopify-section-${id}`);
        if (sec) {
          sec.classList.add('tpl1-section-hidden');
          sec.classList.remove('tpl1-premium-shoplook');
        }
      }
      applyTpl1SectionsVisibility(sectionCfg, TPL1_SECTION_HTML_MAP);
      return;
    }

    // 1) Robust section targeting
    let section: HTMLElement | null = null;
    for (const id of sectionIds) {
      section = document.getElementById(`shopify-section-${id}`);
      if (section) break;
    }
    if (!section) {
      section = document.querySelector('.shopify-section:has(.fusion-shoplook-wrapper), .shopify-section:has(.shop-the-look-row)') as HTMLElement;
    }
    if (!section) return;

    section.classList.remove('tpl1-section-hidden');
    section.classList.add('tpl1-premium-shoplook');

    let alive = true;

    (async () => {
      try {
        const panelsRes = await fetch('/api/public-data/hotspots').then(r => r.json());
        const allPanels = (panelsRes.panels || []).filter((p: any) => p.MOSAICGROUP === 'plantilla1');
        if (!alive || allPanels.length === 0) return;
        const panelIds = allPanels.map((p: any) => p.$id);

        // 3) Fetch ALL hotspots for these panels
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const hotspotsRes = await databases.listDocuments(databaseId, BANNER_OVERLAY_POSITIONS_COLLECTION, [
          Query.equal('BANNERID', panelIds),
          Query.equal('ISACTIVE', true),
          Query.orderAsc('DISPLAYORDER'),
          Query.limit(100),
        ]);
        if (!alive) return;
        const allHotspots = hotspotsRes.documents as any[];

        // 4) Fetch ALL products for these hotspots
        const productIds = Array.from(new Set(allHotspots.map((h: any) => h.PRODUCTID).filter(Boolean))) as string[];
        let allProducts: any[] = [];
        if (productIds.length > 0) {
          // Appwrite might have a limit on 'in' query size, but 100 is usually fine
          const prodRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
            Query.equal('$id', productIds),
            Query.limit(100),
          ]);
          allProducts = prodRes.documents;
        }
        if (!alive) return;

        // 5) Inject Global Styles (Pulse, Grid, Bottom Sheet)
        if (!document.getElementById('tpl1-premium-stl-styles')) {
          const style = document.createElement('style');
          style.id = 'tpl1-premium-stl-styles';
          style.textContent = `
            /* --- Hotspot Animations --- */
            @keyframes tpl1PulseShadow {
              0% { box-shadow: 0 0 0 0 rgba(236,72,153,0.6); }
              70% { box-shadow: 0 0 0 12px rgba(236,72,153,0); }
              100% { box-shadow: 0 0 0 0 rgba(236,72,153,0); }
            }
            @keyframes tpl1PulseInner {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.3); opacity: 0.8; }
            }
            @keyframes tpl1SlideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes tpl1FadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            /* --- Desktop Layout Overrides --- */
            .tpl1-premium-shoplook .shop-the-look-row {
              display: flex !important;
              gap: 30px !important;
              align-items: flex-start !important;
            }

            /* --- Premium Hotspot Style --- */
            .tpl1-hotspot {
              position: absolute;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(4px);
              border: 1.5px solid rgba(255, 255, 255, 0.8);
              cursor: pointer;
              z-index: 100;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              animation: tpl1PulseShadow 2s infinite;
            }
            .tpl1-hotspot::after {
              content: '';
              width: 10px;
              height: 10px;
              background: #ec4899;
              border-radius: 50%;
              box-shadow: 0 0 8px #ec4899;
              animation: tpl1PulseInner 2s infinite;
            }
            .tpl1-hotspot:hover {
              transform: scale(1.2);
              background: rgba(255, 255, 255, 0.4);
              border-color: #fff;
              z-index: 101;
            }

            /* --- Mobile Grid of Looks --- */
            @media (max-width: 768px) {
              .tpl1-premium-shoplook .fusion-shoplook-wrapper,
              .tpl1-premium-shoplook .shop-the-look-row {
                display: block !important;
                padding: 0 !important;
              }
              
              /* Container for the grid of looks */
              .tpl1-looks-grid {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
                padding: 16px !important;
              }
              
              .tpl1-look-item {
                position: relative !important;
                aspect-ratio: 3/4 !important;
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
                background: #f3f4f6 !important;
              }
              
              .tpl1-look-item img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                transition: transform 0.5s ease !important;
              }
              
              .tpl1-look-item:active img {
                transform: scale(1.05) !important;
              }

              /* Hide the original right content (products) on mobile 
                 if we are using the grid approach, or move it below */
              .tpl1-premium-shoplook .right-content {
                display: none !important;
              }

              .tpl1-hotspot {
                width: 24px;
                height: 24px;
              }
              .tpl1-hotspot::after {
                width: 8px;
                height: 8px;
              }
            }

            /* --- Premium Bottom Sheet --- */
            .tpl1-sheet-backdrop {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.4);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              z-index: 99999;
              animation: tpl1FadeIn 0.3s ease;
            }
            .tpl1-sheet {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background: #fff;
              border-top-left-radius: 32px;
              border-top-right-radius: 32px;
              z-index: 100000;
              padding: 24px;
              box-shadow: 0 -10px 40px rgba(0,0,0,0.15);
              animation: tpl1SlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              max-height: 85vh;
              overflow-y: auto;
              font-family: 'Outfit', sans-serif;
            }
            .tpl1-sheet-handle {
              width: 40px;
              height: 4px;
              background: #e5e7eb;
              border-radius: 2px;
              margin: -8px auto 20px;
            }
            .tpl1-sheet-content {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .tpl1-sheet-header {
              display: flex;
              gap: 16px;
              align-items: flex-start;
            }
            .tpl1-sheet-img {
              width: 120px;
              height: 120px;
              border-radius: 16px;
              object-fit: cover;
              background: #f9fafb;
            }
            .tpl1-sheet-info {
              flex: 1;
            }
            .tpl1-sheet-name {
              font-size: 18px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 4px;
              line-height: 1.2;
            }
            .tpl1-sheet-price-row {
              display: flex;
              align-items: baseline;
              gap: 8px;
            }
            .tpl1-sheet-price {
              font-size: 22px;
              font-weight: 800;
              color: #ec4899;
            }
            .tpl1-sheet-old-price {
              font-size: 14px;
              color: #9ca3af;
              text-decoration: line-through;
            }
            .tpl1-sheet-badge {
              display: inline-block;
              padding: 2px 8px;
              background: #fdf2f8;
              color: #ec4899;
              font-size: 10px;
              font-weight: 800;
              border-radius: 99px;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .tpl1-sheet-actions {
              display: flex;
              gap: 12px;
              margin-top: 8px;
            }
            .tpl1-sheet-btn {
              flex: 1;
              height: 54px;
              border-radius: 16px;
              font-weight: 700;
              font-size: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s ease;
              border: none;
            }
            .tpl1-sheet-btn:active { transform: scale(0.96); }
            .tpl1-sheet-btn-primary {
              background: linear-gradient(135deg, #ec4899, #db2777);
              color: #fff;
              box-shadow: 0 4px 15px rgba(236,72,153,0.3);
            }
            .tpl1-sheet-btn-secondary {
              background: #f3f4f6;
              color: #374151;
            }
          `;
          document.head.appendChild(style);
        }

        // 6) Determine if we should show the Grid (Multiple Looks) or Single Look
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && allPanels.length > 1) {
          // --- RENDER GRID OF LOOKS (MOBILE ONLY) ---
          const wrapper = section.querySelector('.fusion-shoplook-wrapper') || section;
          wrapper.innerHTML = `<div class="tpl1-looks-grid"></div>`;
          const grid = wrapper.querySelector('.tpl1-looks-grid') as HTMLElement;
          
          allPanels.forEach((panel: any) => {
            const panelHotspots = allHotspots.filter((h: any) => h.BANNERID === panel.$id);
            const lookItem = document.createElement('div');
            lookItem.className = 'tpl1-look-item';
            lookItem.innerHTML = `<img src="${panel.IMAGEURL}" alt="${panel.TITLE || 'Look'}" />`;
            
            // Add hotspots to this look item
            panelHotspots.forEach((h: any) => {
              const hotspot = document.createElement('div');
              hotspot.className = 'tpl1-hotspot';
              hotspot.style.left = `${h.POSITIONX * 100}%`;
              hotspot.style.top = `${h.POSITIONY * 100}%`;
              hotspot.style.transform = 'translate(-50%, -50%)';
              
              const product = allProducts.find((p: any) => p.$id === h.PRODUCTID);
              if (product) {
                hotspot.addEventListener('click', (e) => {
                  e.stopPropagation();
                  openPremiumSheet(product);
                });
              }
              lookItem.appendChild(hotspot);
            });
            
            grid.appendChild(lookItem);
          });
        } else {
          // --- RENDER SINGLE LOOK (DEFAULT/DESKTOP) ---
          const mainPanel = allPanels.find((p: any) => p.CELLINDEX === 0) || allPanels[0];
          if (!mainPanel) return;

          // Update main image
          const leftContent = section.querySelector('.left-content') as HTMLElement | null;
          const heroImg = section.querySelector('.left-content > img') as HTMLImageElement | null;
          if (heroImg) {
            heroImg.src = mainPanel.IMAGEURL;
            heroImg.style.objectFit = 'cover';
            heroImg.style.width = '100%';
            heroImg.style.height = '100%';
          }
          if (leftContent) {
            leftContent.style.aspectRatio = '4 / 3';
            leftContent.style.position = 'relative';
            leftContent.style.overflow = 'hidden';
            
            // Clear old bullets if any
            const oldBullets = leftContent.querySelectorAll('.pagination-bullet, .tpl1-hotspot');
            oldBullets.forEach(b => b.remove());

            // Add premium hotspots
            const panelHotspots = allHotspots.filter((h: any) => h.BANNERID === mainPanel.$id);
            panelHotspots.forEach((h: any) => {
              const hotspot = document.createElement('div');
              hotspot.className = 'tpl1-hotspot';
              hotspot.style.left = `${h.POSITIONX * 100}%`;
              hotspot.style.top = `${h.POSITIONY * 100}%`;
              hotspot.style.transform = 'translate(-50%, -50%)';
              
              const product = allProducts.find((p: any) => p.$id === h.PRODUCTID);
              if (product) {
                hotspot.addEventListener('click', (e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    openPremiumSheet(product);
                  } else {
                    // Desktop behavior: scroll to or open quickview
                    window.location.href = `/productos/${product.$id}`;
                  }
                });
              }
              leftContent.appendChild(hotspot);
            });
          }

          // Link the right content cards (existing structure)
          const panelHotspots = allHotspots.filter((h: any) => h.BANNERID === mainPanel.$id).slice(0, 4);
          panelHotspots.forEach((h: any, i: number) => {
            const card = section.querySelector(`#item${i + 1}`) as HTMLElement | null;
            if (!card) return;
            const prod = allProducts.find((p: any) => p.$id === h.PRODUCTID);
            if (!prod) {
              card.style.display = 'none';
              return;
            }
            card.style.display = '';
            const img = card.querySelector('.product-img img') as HTMLImageElement | null;
            if (img) img.src = prod.IMAGEURL || '';
            const name = card.querySelector('.product-name') as HTMLElement | null;
            if (name) name.textContent = prod.NAME;
            const price = card.querySelector('.p-price') as HTMLElement | null;
            if (price) price.textContent = `$${(prod.CURRENTPRICE || prod.PRICE).toLocaleString('es-CL')}`;
            
            card.style.cursor = 'pointer';
            card.onclick = () => { window.location.href = `/productos/${prod.$id}`; };
          });
        }

        // --- Helper: Open Premium Bottom Sheet ---
        function openPremiumSheet(product: any) {
          const backdrop = document.createElement('div');
          backdrop.className = 'tpl1-sheet-backdrop';
          
          const sheet = document.createElement('div');
          sheet.className = 'tpl1-sheet';
          
          const hasDisc = product.CURRENTPRICE && product.CURRENTPRICE < product.PRICE;
          const discPct = hasDisc ? Math.round((1 - product.CURRENTPRICE / product.PRICE) * 100) : 0;
          const price = (product.CURRENTPRICE || product.PRICE).toLocaleString('es-CL');
          const oldPrice = product.PRICE.toLocaleString('es-CL');

          sheet.innerHTML = `
            <div class="tpl1-sheet-handle"></div>
            <div class="tpl1-sheet-content">
              <div class="tpl1-sheet-header">
                <img src="${product.IMAGEURL}" class="tpl1-sheet-img" alt="${product.NAME}" />
                <div class="tpl1-sheet-info">
                  ${hasDisc ? `<span class="tpl1-sheet-badge">¡Oferta! -${discPct}%</span>` : ''}
                  <h3 class="tpl1-sheet-name">${product.NAME}</h3>
                  <div class="tpl1-sheet-price-row">
                    <span class="tpl1-sheet-price">$${price}</span>
                    ${hasDisc ? `<span class="tpl1-sheet-old-price">$${oldPrice}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="tpl1-sheet-actions">
                <button class="tpl1-sheet-btn tpl1-sheet-btn-secondary" id="tpl1-sheet-view">Ver detalle</button>
                <button class="tpl1-sheet-btn tpl1-sheet-btn-primary" id="tpl1-sheet-buy">Comprar ahora</button>
              </div>
            </div>
          `;

          const close = () => {
            backdrop.style.opacity = '0';
            sheet.style.transform = 'translateY(100%)';
            setTimeout(() => { backdrop.remove(); sheet.remove(); }, 300);
          };

          backdrop.onclick = close;
          sheet.querySelector('#tpl1-sheet-view')?.addEventListener('click', () => { window.location.href = `/productos/${product.$id}`; });
          sheet.querySelector('#tpl1-sheet-buy')?.addEventListener('click', () => { 
             window.dispatchEvent(new CustomEvent('yaxsel:add-to-cart', { detail: { productId: product.$id, quantity: 1 } }));
             close();
          });

          document.body.appendChild(backdrop);
          document.body.appendChild(sheet);
        }

      } catch (err) {
        console.warn('[tpl1] Shop The Look Premium error:', err);
      }
    })();

    return () => { alive = false; };
  }, [bodyHtml, sectionCfg]);


  /* ── Aplicar settings de Video con Texto (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_video_text');
    if (!cfg) return;
    const s = cfg.settings || {};
    const sectionId = 'template--22405132419320__image_video_with_text_LEtqmt';
    const section = document.querySelector(`[data-section-id="${sectionId}"]`) as HTMLElement | null;
    if (!section) return;

    const row = section.querySelector('.video-with-content-row') as HTMLElement | null;
    const vdCol = section.querySelector('.vd-col') as HTMLElement | null;
    const contentCol = section.querySelector('.vd-content-col') as HTMLElement | null;
    const rightContent = section.querySelector('.right-content') as HTMLElement | null;

    // 1) Posición media (left/right)
    if (row && vdCol && contentCol) {
      if (s.vtMediaPosition === 'right') {
        row.style.flexDirection = 'row-reverse';
      } else {
        row.style.flexDirection = 'row';
      }
      // Alinear imagen a la derecha
      vdCol.style.alignSelf = 'flex-start';
      vdCol.style.marginLeft = 'auto';
    }

    // 2) Altura y padding reducidos
    const height = s.height ?? 450;
    const padding = s.padding ?? 60;
    if (row) {
      row.style.minHeight = `${height}px`;
      row.style.padding = `${padding}px`;
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.gap = '30px';
      row.style.flexWrap = 'nowrap';
    }

    // Asegurar que las columnas tengan el tamaño correcto
    if (vdCol) {
      vdCol.style.flex = '0 0 auto';
      vdCol.style.minWidth = '400px';
    }
    if (contentCol) {
      contentCol.style.flex = '1';
      contentCol.style.minWidth = '350px';
      contentCol.style.maxWidth = '600px';
    }

    // 3) Border radius del row
    if (row && s.vtBorderRadius !== undefined) {
      row.style.borderRadius = `${s.vtBorderRadius}px`;
      row.style.overflow = 'hidden';
    }

    // 4) Color de fondo con gradiente sutil
    if (row && s.vtBgColor) {
      row.style.setProperty('background', `linear-gradient(135deg, ${s.vtBgColor}, ${s.vtBgColor}dd)`, 'important');
      row.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
    }

    // 5) Video URL — reemplazar o inyectar un <video> directo
    const videoContent = section.querySelector('.video-content') as HTMLElement | null;
    if (videoContent) {
      // Mejorar diseño del contenedor de video/imagen
      videoContent.style.setProperty('width', '100%', 'important');
      videoContent.style.setProperty('max-width', '450px', 'important');
      videoContent.style.setProperty('height', 'auto', 'important');
      videoContent.style.setProperty('overflow', 'visible', 'important');
      videoContent.style.setProperty('border-radius', '16px', 'important');
      videoContent.style.setProperty('box-shadow', '0 8px 25px rgba(236,72,153,0.1)', 'important');
      videoContent.style.setProperty('border', '2px solid rgba(236,72,153,0.06)', 'important');
      if (s.vtVideoUrl) {
        // Lazy video: don't create video element until user clicks
        // Hide Shopify's original deferred-media
        const posterBtn = videoContent.querySelector('.deferred-media__poster') as HTMLElement;
        if (posterBtn) posterBtn.style.display = 'none';
        const deferredMedia = videoContent.querySelector('deferred-media') as HTMLElement;
        if (deferredMedia) deferredMedia.style.display = 'none';

        // Add glassmorphism play/pause icons if not already present
        if (!videoContent.querySelector('.tpl1-video-play-icon')) {
          const playIcon = document.createElement('div');
          playIcon.className = 'tpl1-video-play-icon';
          playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;transition:opacity 0.3s ease;opacity:1;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;';
          playIcon.innerHTML = `<svg width="24" height="28" viewBox="0 0 24 28" fill="white" style="margin-left:3px;"><polygon points="2,0 24,14 2,28"/></svg>`;
          const pauseIcon = document.createElement('div');
          pauseIcon.className = 'tpl1-video-pause-icon';
          pauseIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;transition:opacity 0.3s ease;opacity:0;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;';
          pauseIcon.innerHTML = `<svg width="24" height="28" viewBox="0 0 24 28" fill="white"><rect x="2" y="0" width="7" height="28" rx="2"/><rect x="14" y="0" width="7" height="28" rx="2"/></svg>`;
          videoContent.style.position = 'relative';
          videoContent.style.cursor = 'pointer';
          videoContent.appendChild(playIcon);
          videoContent.appendChild(pauseIcon);

          let videoCreated = false;
          videoContent.onclick = (e) => {
            e.stopPropagation();
            if (!videoCreated) {
              // First click: create video, play
              const video = document.createElement('video');
              video.className = 'tpl1-vt-video';
              video.src = s.vtVideoUrl!;
              video.muted = true;
              video.loop = true;
              video.playsInline = true;
              video.setAttribute('playsinline', '');
              video.setAttribute('muted', '');
              video.preload = 'auto';
              video.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;border-radius:inherit;background:#000;';
              videoContent.insertBefore(video, playIcon);
              // Set up play/pause event handlers BEFORE calling play
              video.onplay = () => { playIcon.style.display = 'none'; pauseIcon.style.display = 'flex'; };
              video.onpause = () => { playIcon.style.display = 'flex'; pauseIcon.style.display = 'none'; };
              video.play().catch(() => { });
              videoCreated = true;
              // Subsequent clicks
              videoContent.onclick = (e2) => {
                e2.stopPropagation();
                if (video.paused) video.play().catch(() => { });
                else video.pause();
              };
            }
          };
        }
      }
      // 6) Imagen poster / reemplazo - enfoque directo (con imagen móvil si existe)
      const vtImg = (window.innerWidth <= 768 && s.vtMobilePosterImage) ? s.vtMobilePosterImage : s.vtPosterImage;
      if (vtImg) {
        // Limpiar todo el contenido y poner solo la imagen
        videoContent.innerHTML = '';
        const img = document.createElement('img');
        img.src = vtImg;
        img.alt = 'Yaxsell';
        img.style.cssText = `
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(236,72,153,0.1);
          border: 2px solid rgba(236,72,153,0.06);
          transition: transform 0.3s ease;
        `;
        img.onmouseenter = () => { img.style.transform = 'scale(1.05)'; };
        img.onmouseleave = () => { img.style.transform = 'scale(1)'; };
        videoContent.appendChild(img);
      }
    }

    // 7) Textos con diseño avanzado
    if (rightContent) {
      rightContent.style.flex = '1';
      rightContent.style.display = 'flex';
      rightContent.style.flexDirection = 'column';
      rightContent.style.gap = '24px';

      const subtitle = rightContent.querySelector('.musk-fancy-sub-head') as HTMLElement;
      if (subtitle && s.vtSubtitle) {
        subtitle.textContent = s.vtSubtitle;
        subtitle.style.cssText = `
          color: ${s.vtHeadingColor || '#ec4899'};
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 0;
          position: relative;
          display: inline-block;
          padding-bottom: 8px;
          background: linear-gradient(90deg, ${s.vtHeadingColor || '#ec4899'}, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        `;
        const line = document.createElement('span');
        line.style.cssText = `position:absolute;bottom:0;left:0;width:60px;height:3px;background:linear-gradient(90deg,${s.vtHeadingColor || '#ec4899'},transparent);border-radius:2px;`;
        subtitle.style.position = 'relative';
        if (!subtitle.querySelector('span')) subtitle.appendChild(line);
      }

      const heading = rightContent.querySelector('.musk-h2-head') as HTMLElement;
      if (heading && s.vtHeading) {
        heading.textContent = s.vtHeading;
        heading.style.cssText = `
          color: ${s.vtHeadingColor || '#ec4899'};
          font-size: 48px;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0;
          letter-spacing: -1px;
          text-shadow: 0 2px 10px rgba(236,72,153,0.15);
        `;
      }

      const desc = rightContent.querySelector('.musk-para-text') as HTMLElement;
      if (desc && s.vtDescription) {
        desc.textContent = s.vtDescription;
        desc.style.cssText = `
          color: ${s.vtTextColor || '#374151'};
          font-size: 17px;
          line-height: 1.8;
          margin-bottom: 0;
          font-weight: 400;
          opacity: 0.9;
          max-width: 540px;
        `;
      }

      const btnEl = rightContent.querySelector('.musk-btn') as HTMLElement;
      if (btnEl && s.vtBtnText) {
        btnEl.textContent = s.vtBtnText;
        btnEl.style.cssText = `
          background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
          color: white;
          padding: 16px 40px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(236,72,153,0.25), 0 4px 8px rgba(236,72,153,0.15);
          display: inline-block;
          width: fit-content;
          border: none;
        `;
        btnEl.onmouseenter = () => {
          btnEl.style.transform = 'translateY(-3px) scale(1.02)';
          btnEl.style.boxShadow = '0 12px 32px rgba(236,72,153,0.35)';
        };
        btnEl.onmouseleave = () => {
          btnEl.style.transform = 'translateY(0) scale(1)';
          btnEl.style.boxShadow = '0 8px 24px rgba(236,72,153,0.25), 0 4px 8px rgba(236,72,153,0.15)';
        };
      }
      if (btnEl && s.vtBtnLink) btnEl.setAttribute('href', s.vtBtnLink);
    }
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de Banner con Texto / Image Overlay (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_image_overlay');
    if (!cfg) return;
    const s = cfg.settings || {};
    const sectionId = 'template--22405132419320__image_with_text_overlay_4tEGkd';
    const section = document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    const container = section.querySelector('.fusion-bg-fixed-container') as HTMLElement;
    if (!container) return;

    // 1) Imagen de fondo con blur (usar pseudo-elemento separado para no blur el texto)
    const blur = s.overlayBlurAmount ?? 0;
    // Elegir imagen según tamaño de pantalla (móvil vs PC)
    const isMobileBg = window.innerWidth <= 768;
    const bgImage = (isMobileBg && s.overlayMobileBgImage) ? s.overlayMobileBgImage : s.overlayBgImage;
    if (bgImage) {
      if (blur > 0) {
        // Crear pseudo-elemento con blur
        let blurLayer = container.querySelector('.tpl1-bg-blur-layer') as HTMLElement | null;
        if (!blurLayer) {
          blurLayer = document.createElement('div');
          blurLayer.className = 'tpl1-bg-blur-layer';
          blurLayer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
          container.insertBefore(blurLayer, container.firstChild);
        }
        blurLayer.style.backgroundImage = `url('${bgImage}')`;
        blurLayer.style.backgroundSize = 'cover';
        blurLayer.style.backgroundPosition = 'center center';
        blurLayer.style.backgroundRepeat = 'no-repeat';
        blurLayer.style.filter = `blur(${blur}px)`;
        // Asegurar altura mínima
        if (!container.style.minHeight && container.offsetHeight < 200) {
          container.style.setProperty('min-height', '500px', 'important');
        }
      } else {
        // Sin blur — aplicar directo al contenedor
        container.style.setProperty('background-image', `url('${bgImage}')`, 'important');
        container.style.setProperty('background-size', 'cover', 'important');
        container.style.setProperty('background-position', 'center center', 'important');
        container.style.setProperty('background-repeat', 'no-repeat', 'important');
        container.style.setProperty('filter', 'none', 'important');
        // Remover blur layer si existe
        const blurLayer = container.querySelector('.tpl1-bg-blur-layer') as HTMLElement | null;
        if (blurLayer) blurLayer.remove();
      }
    }

    // 2) Video de fondo — lazy creation, no video until user clicks
    let existingVideo = container.querySelector('.tpl1-overlay-video') as HTMLVideoElement | null;
    if (s.overlayVideoUrl) {
      if (!existingVideo && !container.querySelector('.tpl1-video-play-icon')) {
        // Show play icon only — no video element yet
        const playIcon = document.createElement('div');
        playIcon.className = 'tpl1-video-play-icon';
        playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;transition:opacity 0.3s ease;opacity:1;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;';
        playIcon.innerHTML = `<svg width="24" height="28" viewBox="0 0 24 28" fill="white" style="margin-left:3px;"><polygon points="2,0 24,14 2,28"/></svg>`;
        const pauseIcon = document.createElement('div');
        pauseIcon.className = 'tpl1-video-pause-icon';
        pauseIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;transition:opacity 0.3s ease;opacity:0;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;';
        pauseIcon.innerHTML = `<svg width="24" height="28" viewBox="0 0 24 28" fill="white"><rect x="2" y="0" width="7" height="28" rx="2"/><rect x="14" y="0" width="7" height="28" rx="2"/></svg>`;
        container.style.position = 'relative';
        container.style.cursor = 'pointer';
        container.appendChild(playIcon);
        container.appendChild(pauseIcon);

        let videoCreated = false;
        container.onclick = (e) => {
          e.stopPropagation();
          if (!videoCreated) {
            const video = document.createElement('video');
            video.className = 'tpl1-overlay-video';
            video.muted = true;
            video.playsInline = true;
            video.loop = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            video.preload = 'auto';
            video.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0;';
            const source = document.createElement('source');
            source.src = s.overlayVideoUrl!;
            source.type = 'video/mp4';
            video.appendChild(source);
            container.insertBefore(video, container.firstChild);
            // Set up play/pause event handlers BEFORE calling play
            video.onplay = () => { playIcon.style.display = 'none'; pauseIcon.style.display = 'flex'; };
            video.onpause = () => { playIcon.style.display = 'flex'; pauseIcon.style.display = 'none'; };
            video.play().catch(() => { });
            videoCreated = true;
            // Subsequent clicks
            container.onclick = (e2) => {
              e2.stopPropagation();
              if (video.paused) video.play().catch(() => { });
              else video.pause();
            };
          }
        };
      } else if (existingVideo) {
        const source = existingVideo.querySelector('source');
        if (source) source.src = s.overlayVideoUrl!;
      }
    } else if (existingVideo) {
      existingVideo.remove();
    }

    // 3) Overlay con opacidad configurable
    const overlayEnabled = s.overlayEnabled !== false;
    const overlayOpacity = s.overlayOpacity ?? 40;
    const overlayColor = s.overlayColor || '#000000';
    const existingOverlay = container.querySelector('.tpl1-overlay-color') as HTMLElement | null;
    if (overlayEnabled && overlayOpacity > 0) {
      if (!existingOverlay) {
        const overlay = document.createElement('div');
        overlay.className = 'tpl1-overlay-color';
        overlay.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
        container.appendChild(overlay);
      }
      // Convert hex to rgba
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
      };
      const updatedOverlay = container.querySelector('.tpl1-overlay-color') as HTMLElement;
      if (updatedOverlay) {
        updatedOverlay.style.background = hexToRgba(overlayColor, overlayOpacity / 100);
      }
    } else {
      // Overlay desactivado o opacidad 0 — remover
      if (existingOverlay) existingOverlay.remove();
    }
    // Neutralizar overlay del template original
    container.style.setProperty('background-color', 'transparent', 'important');
    // El ::before pseudo-element del container es el overlay — inyectar CSS para matarlo
    if (!document.getElementById('tpl1-overlay-nobefore-style')) {
      const noBefore = document.createElement('style');
      noBefore.id = 'tpl1-overlay-nobefore-style';
      noBefore.textContent = `[data-section-id="${sectionId}"] .fusion-bg-fixed-container:before { display: none !important; content: none !important; }`;
      document.head.appendChild(noBefore);
    }

    // 4) Altura y padding reducidos
    const height = s.height ?? 500;
    const padding = s.padding ?? 80;
    container.style.minHeight = `${height}px`;
    container.style.maxHeight = `${height}px`;
    container.style.paddingTop = `${padding}px`;
    container.style.paddingBottom = `${padding}px`;
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    // 5) Border radius
    const borderRadius = s.overlayBorderRadius ?? 50;
    container.style.borderRadius = `${borderRadius}px`;

    // 5) Texto
    const centerContent = container.querySelector('.center-content') as HTMLElement;
    if (centerContent) {
      centerContent.style.position = 'relative';
      centerContent.style.zIndex = '2';
      const subEl = centerContent.querySelector('.musk-fancy-sub-head') as HTMLElement | null;
      const headEl = centerContent.querySelector('.musk-h2-head') as HTMLElement | null;
      const paraEl = centerContent.querySelector('.musk-main-para') as HTMLElement | null;
      const btnEl = centerContent.querySelector('.musk-primary-btn') as HTMLElement | null;

      if (subEl && s.overlaySubheading !== undefined) {
        subEl.textContent = s.overlaySubheading;
        subEl.style.cssText = `
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: ${s.overlaySubheadingColor || '#ec4899'} !important;
          -webkit-text-fill-color: ${s.overlaySubheadingColor || '#ec4899'} !important;
          margin-bottom: 12px;
          text-shadow: 0 2px 10px rgba(236,72,153,0.5);
        `;
      }
      if (headEl && s.overlayHeading !== undefined) {
        headEl.textContent = s.overlayHeading;
        headEl.style.cssText = `
          font-size: 56px;
          font-weight: 900;
          color: ${s.overlayTextColor || '#ffffff'} !important;
          -webkit-text-fill-color: ${s.overlayTextColor || '#ffffff'} !important;
          margin-bottom: 20px;
          line-height: 1.1;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
      }
      if (paraEl && s.overlayParagraph !== undefined) {
        paraEl.textContent = s.overlayParagraph;
        paraEl.style.cssText = `
          font-size: ${s.overlayFontSize || 18}px;
          font-weight: ${s.overlayFontWeight || 400};
          color: ${s.overlayTextColor || '#ffffff'} !important;
          -webkit-text-fill-color: ${s.overlayTextColor || '#ffffff'} !important;
          max-width: 700px;
          margin: 0 auto 30px;
          line-height: 1.7;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        `;
      }
      if (btnEl && s.overlayBtnText !== undefined) {
        btnEl.textContent = s.overlayBtnText;
        btnEl.style.cssText = `
          background: linear-gradient(135deg, #ec4899, #f472b6);
          color: #ffffff;
          padding: 16px 40px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 50px;
          border: none;
          box-shadow: 0 8px 25px rgba(236,72,153,0.4);
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        `;
        btnEl.onmouseenter = () => {
          btnEl.style.transform = 'translateY(-3px)';
          btnEl.style.boxShadow = '0 12px 35px rgba(236,72,153,0.6)';
        };
        btnEl.onmouseleave = () => {
          btnEl.style.transform = 'translateY(0)';
          btnEl.style.boxShadow = '0 8px 25px rgba(236,72,153,0.4)';
        };
      }
      if (btnEl && s.overlayBtnLink) btnEl.setAttribute('href', s.overlayBtnLink);
    }

    // 6) Partículas complejas (PC only — skip on mobile for performance)
    const isMobileView = window.innerWidth <= 768;
    let particlesContainer = container.querySelector('.tpl1-overlay-particles') as HTMLElement | null;
    if (s.overlayParticlesEnabled && !isMobileView) {
      if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'tpl1-overlay-particles';
        particlesContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;overflow:hidden;';
        container.insertBefore(particlesContainer, container.querySelector('.center-content') || container.lastChild);
      }
      particlesContainer.innerHTML = '';
      const count = s.overlayParticlesCount ?? 30;
      const pSize = s.overlayParticlesSize ?? 3;
      const pOpacity = s.overlayParticlesOpacity ?? 0.6;
      const pColor = s.overlayParticlesColor || '#ffffff';
      // Tipos: circle, star, diamond, ring, sparkle, ray, bokeh, aurora, flare, hex
      const shapes = ['circle', 'star', 'diamond', 'ring', 'sparkle', 'ray', 'bokeh', 'aurora', 'flare', 'hex'];
      for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        const shape = shapes[i % shapes.length];
        const size = pSize * (0.5 + Math.random() * 1.2);
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const dur = 4 + Math.random() * 8;
        const delay = Math.random() * 5;
        const drift = 15 + Math.random() * 30;
        const rot = Math.random() * 360;
        let shapeCSS = '';
        switch (shape) {
          case 'circle':
            shapeCSS = `width:${size}px;height:${size}px;border-radius:50%;background:${pColor};box-shadow:0 0 ${size * 2}px ${pColor};`;
            break;
          case 'star':
            shapeCSS = `width:0;height:0;border-left:${size / 2}px solid transparent;border-right:${size / 2}px solid transparent;border-bottom:${size}px solid ${pColor};transform:rotate(${rot}deg);filter:drop-shadow(0 0 ${size}px ${pColor});`;
            break;
          case 'diamond':
            shapeCSS = `width:${size}px;height:${size}px;background:${pColor};transform:rotate(45deg);box-shadow:0 0 ${size * 2}px ${pColor};`;
            break;
          case 'ring':
            shapeCSS = `width:${size}px;height:${size}px;border-radius:50%;border:${Math.max(1, size / 4)}px solid ${pColor};background:transparent;box-shadow:0 0 ${size * 3}px ${pColor}40;`;
            break;
          case 'sparkle':
            shapeCSS = `width:${size * 0.3}px;height:${size}px;background:${pColor};border-radius:2px;box-shadow:${size * 0.6}px 0 0 ${pColor},-${size * 0.6}px 0 0 ${pColor},0 ${size * 0.6}px 0 0 ${pColor},0 -${size * 0.6}px 0 0 ${pColor};filter:blur(0.5px);`;
            break;
          case 'ray':
            const rayLen = size * 8;
            const rayW = size * 0.4;
            shapeCSS = `width:${rayW}px;height:${rayLen}px;background:linear-gradient(to bottom,${pColor},${pColor}00);border-radius:${rayW}px;transform:rotate(${rot}deg);transform-origin:top center;filter:blur(1px);`;
            break;
          case 'bokeh':
            const bSize = size * (2 + Math.random() * 3);
            shapeCSS = `width:${bSize}px;height:${bSize}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,${pColor}cc,${pColor}20 60%,transparent 70%);border:1px solid ${pColor}30;`;
            break;
          case 'aurora':
            const aW = size * (6 + Math.random() * 8);
            const aH = size * (2 + Math.random() * 3);
            shapeCSS = `width:${aW}px;height:${aH}px;border-radius:50%;background:radial-gradient(ellipse at center,${pColor}60,${pColor}10 70%,transparent);filter:blur(${size}px);`;
            break;
          case 'flare':
            const fSize = size * 3;
            shapeCSS = `width:${fSize}px;height:${fSize}px;border-radius:50%;background:radial-gradient(circle,${pColor}ff 0%,${pColor}80 20%,${pColor}30 40%,transparent 60%);box-shadow:0 0 ${fSize * 2}px ${pColor}80,0 0 ${fSize * 4}px ${pColor}30;`;
            break;
          case 'hex':
            const hSize = size * 1.5;
            shapeCSS = `width:${hSize}px;height:${hSize * 0.87}px;background:${pColor};clip-path:polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);box-shadow:0 0 ${hSize}px ${pColor}60;`;
            break;
        }
        p.style.cssText = `position:absolute;left:${x}%;top:${y}%;opacity:${pOpacity};${shapeCSS}animation:tpl1P${shape} ${dur}s ease-in-out infinite;animation-delay:${delay}s;--drift:${drift}px;--rot:${rot}deg;`;
        particlesContainer.appendChild(p);
      }
      // Inyectar keyframes complejos
      if (!document.getElementById('tpl1-overlay-particles-style')) {
        const ks = document.createElement('style');
        ks.id = 'tpl1-overlay-particles-style';
        ks.textContent = `
          @keyframes tpl1Pcircle {
            0%,100%{transform:translate(0,0) scale(1);opacity:0.6}
            25%{transform:translate(calc(var(--drift)*0.5),-20px) scale(1.3);opacity:0.9}
            50%{transform:translate(var(--drift),-40px) scale(0.8);opacity:0.4}
            75%{transform:translate(calc(var(--drift)*0.3),-15px) scale(1.1);opacity:0.7}
          }
          @keyframes tpl1Pstar {
            0%,100%{transform:rotate(var(--rot)) translate(0,0) scale(1);opacity:0.6}
            33%{transform:rotate(calc(var(--rot) + 120deg)) translate(var(--drift),-30px) scale(1.4);opacity:0.9}
            66%{transform:rotate(calc(var(--rot) + 240deg)) translate(calc(var(--drift)*-0.5),-50px) scale(0.7);opacity:0.3}
          }
          @keyframes tpl1Pdiamond {
            0%,100%{transform:rotate(45deg) translate(0,0) scale(1);opacity:0.6}
            25%{transform:rotate(90deg) translate(var(--drift),-25px) scale(1.5);opacity:0.8}
            50%{transform:rotate(135deg) translate(calc(var(--drift)*0.5),-50px) scale(0.6);opacity:0.3}
            75%{transform:rotate(180deg) translate(calc(var(--drift)*-0.3),-20px) scale(1.2);opacity:0.7}
          }
          @keyframes tpl1Pring {
            0%,100%{transform:translate(0,0) scale(1);opacity:0.6}
            30%{transform:translate(var(--drift),-30px) scale(1.6);opacity:0.5}
            60%{transform:translate(calc(var(--drift)*0.3),-60px) scale(0.5);opacity:0.2}
            80%{transform:translate(calc(var(--drift)*-0.2),-20px) scale(1.3);opacity:0.8}
          }
          @keyframes tpl1Psparkle {
            0%,100%{transform:scale(0);opacity:0}
            10%{transform:scale(1);opacity:0.6}
            50%{transform:scale(1.5) translate(var(--drift),-40px);opacity:0.9}
            90%{transform:scale(0.5) translate(calc(var(--drift)*0.5),-70px);opacity:0.2}
          }
          @keyframes tpl1Pray {
            0%,100%{transform:rotate(var(--rot)) scaleY(1);opacity:0.3}
            25%{transform:rotate(calc(var(--rot) + 15deg)) scaleY(1.8);opacity:0.7}
            50%{transform:rotate(calc(var(--rot) - 10deg)) scaleY(0.6);opacity:0.15}
            75%{transform:rotate(calc(var(--rot) + 5deg)) scaleY(1.4);opacity:0.5}
          }
          @keyframes tpl1Pbokeh {
            0%,100%{transform:translate(0,0) scale(1);opacity:0.4}
            30%{transform:translate(var(--drift),-20px) scale(1.3);opacity:0.7}
            60%{transform:translate(calc(var(--drift)*0.5),-50px) scale(0.7);opacity:0.2}
            80%{transform:translate(calc(var(--drift)*-0.3),-15px) scale(1.1);opacity:0.5}
          }
          @keyframes tpl1Paurora {
            0%,100%{transform:translate(0,0) scaleX(1) scaleY(1);opacity:0.3}
            25%{transform:translate(var(--drift),-10px) scaleX(1.4) scaleY(0.8);opacity:0.6}
            50%{transform:translate(calc(var(--drift)*0.3),-30px) scaleX(0.8) scaleY(1.3);opacity:0.2}
            75%{transform:translate(calc(var(--drift)*-0.5),-15px) scaleX(1.2) scaleY(0.9);opacity:0.5}
          }
          @keyframes tpl1Pflare {
            0%,100%{transform:scale(0.8);opacity:0}
            15%{transform:scale(1.2);opacity:0.8}
            40%{transform:scale(1);opacity:0.6}
            60%{transform:scale(1.5);opacity:0.9}
            85%{transform:scale(0.6);opacity:0.1}
          }
          @keyframes tpl1Phex {
            0%,100%{transform:rotate(0deg) translate(0,0) scale(1);opacity:0.5}
            25%{transform:rotate(60deg) translate(var(--drift),-20px) scale(1.3);opacity:0.8}
            50%{transform:rotate(120deg) translate(calc(var(--drift)*0.5),-45px) scale(0.7);opacity:0.3}
            75%{transform:rotate(180deg) translate(calc(var(--drift)*-0.3),-15px) scale(1.1);opacity:0.6}
          }
        `;
        document.head.appendChild(ks);
      }
    } else if (particlesContainer) {
      particlesContainer.remove();
    }
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de Antes / Después (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_before_after');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__before_after_3VVXkq';
    const section = document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    const subEl = section.querySelector('.fusion-title .musk-fancy-sub-head') as HTMLElement;
    const titleEl = section.querySelector('.fusion-title .musk-h2-head') as HTMLElement;
    const paraEl = section.querySelector('.fusion-title .musk-main-para') as HTMLElement;
    if (subEl && settings.beforeAfterSubtitle) subEl.textContent = settings.beforeAfterSubtitle;
    if (titleEl && settings.beforeAfterTitle) titleEl.textContent = settings.beforeAfterTitle;
    if (paraEl && settings.beforeAfterDescription) paraEl.textContent = settings.beforeAfterDescription;

    const backImg = section.querySelector('.before-after > img:not(.front-img)') as HTMLImageElement;
    const frontImg = section.querySelector('.before-after > img.front-img') as HTMLImageElement;
    if (backImg && settings.beforeAfterBeforeImage) {
      backImg.src = settings.beforeAfterBeforeImage;
      backImg.alt = settings.beforeAfterBeforeLabel || 'Antes';
    }
    if (frontImg && settings.beforeAfterAfterImage) {
      frontImg.src = settings.beforeAfterAfterImage;
      frontImg.alt = settings.beforeAfterAfterLabel || 'Después';
    }

    const beforeText = section.querySelector('.before-text') as HTMLElement;
    const afterText = section.querySelector('.after-text') as HTMLElement;
    if (beforeText && settings.beforeAfterBeforeLabel) beforeText.textContent = settings.beforeAfterBeforeLabel;
    if (afterText && settings.beforeAfterAfterLabel) afterText.textContent = settings.beforeAfterAfterLabel;
  }, [bodyHtml, sectionCfg]);

  /* ── Cargar oferta del countdown desde Appwrite si hay ID ── */
  useEffect(() => {
    const cfg = sectionCfg.find(s => s.id === 'tpl1_countdown');
    const oid = cfg?.settings?.countdownOfferId;
    if (!oid) {
      setCountdownOffer(null);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const { databaseId } = getAppwriteConfig();
        const { databases } = getServices();
        const offer = await databases.getDocument(databaseId, TIMED_OFFERS_COLLECTION, oid);
        if (!alive) return;
        setCountdownOffer(offer as unknown as TimedOffer);
        const targetId = (offer as unknown as TimedOffer).targetId;
        if (targetId) {
          try {
            const prod = await databases.getDocument(databaseId, PRODUCTS_COLLECTION, targetId);
            if (alive) setCountdownProduct(prod as unknown as Product);
          } catch {
            if (alive) setCountdownProduct(null);
          }
        } else {
          if (alive) setCountdownProduct(null);
        }
      } catch {
        if (alive) { setCountdownOffer(null); setCountdownProduct(null); }
      }
    })();
    return () => { alive = false; };
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de countdown (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || !sectionCfg) return;

    // Countdown (tpl1) — vinculado a TimedOffer
    const sectionId = 'template--22405132419320__countdown_timer_hYJrNM';
    const section = document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    const countdownCfg = sectionCfg.find(s => s.id === 'tpl1_countdown');
    if (!countdownCfg?.enabled) {
      section.classList.add('tpl1-section-hidden');
      return;
    }
    section.classList.remove('tpl1-section-hidden');

    const settings = countdownCfg.settings || {};
    const countdownOfferId = settings.countdownOfferId;

    // Ocultar sección si no hay oferta vinculada ni configuración manual
    if (!countdownOfferId && !settings.countdownTitle) {
      section.classList.add('tpl1-section-hidden');
      return;
    }
    section.classList.remove('tpl1-section-hidden');

    // Resolver datos según oferta vinculada o modo manual
    let title = settings.countdownTitle || '';
    let subtitle = settings.countdownSubtitle || '';
    let slideText = settings.countdownSlideText || '';
    let buttonText = settings.countdownButtonText || 'COMPRAR AHORA';
    let buttonHref = '/productos';
    let endTimeMs: number | null = null;

    if (countdownOffer) {
      title = countdownOffer.productName || title;
      slideText = countdownOffer.title || slideText;
      if (countdownOffer.discountPercentage) {
        subtitle = `Oferta exclusiva: -${countdownOffer.discountPercentage}% por tiempo limitado`;
      }
      buttonHref = `/producto/${countdownOffer.targetId}`;
      if (countdownOffer.timeType === 'endDateTime' && countdownOffer.endDateTime) {
        endTimeMs = new Date(countdownOffer.endDateTime).getTime();
      } else if (countdownOffer.timeType === 'duration' && countdownOffer.activatedAt && countdownOffer.durationHours) {
        endTimeMs = new Date(countdownOffer.activatedAt).getTime() + (countdownOffer.durationHours * 3600000);
      }
    }

    // Aplicar al DOM
    const titleEl = section.querySelector('.countdown-sec-title h2') as HTMLElement;
    if (titleEl && title) titleEl.textContent = title;

    const subtitleEl = section.querySelector('.countdown-sec-title h3') as HTMLElement;
    if (subtitleEl && subtitle) subtitleEl.textContent = subtitle;

    const slideEls = section.querySelectorAll('.countdown-slideT-row .slide-item h3');
    slideEls.forEach(el => { if (slideText) (el as HTMLElement).textContent = slideText; });

    const btn = section.querySelector('.button_primary a') as HTMLAnchorElement;
    if (btn) {
      btn.textContent = buttonText;
      btn.href = buttonHref;
    }

    // Aplicar imagen de fondo y opacidad
    const wrapper = section.querySelector('.fusion-countdown-wrapper') as HTMLElement;

    // Imagen de fondo: prioridad a la imagen personalizada, luego la del producto vinculado
    if (wrapper) {
      const bgImage = settings.countdownBackgroundImage || countdownProduct?.IMAGEURL;
      if (bgImage) {
        wrapper.style.setProperty('background-image', `url(${bgImage})`, 'important');
        wrapper.style.setProperty('background-size', 'cover', 'important');
        wrapper.style.setProperty('background-position', 'center', 'important');
        wrapper.style.setProperty('background-repeat', 'no-repeat', 'important');
        // Mantener posición relativa y tamaño constante
        wrapper.style.setProperty('position', 'relative', 'important');
        wrapper.style.setProperty('min-height', '100%', 'important');
      }

      // Ocultar o mostrar carrusel de texto
      const carousel = section.querySelector('.countdown-slideT-container') as HTMLElement;
      if (carousel) {
        if (settings.countdownHideOverlay) {
          carousel.style.visibility = 'hidden';
          carousel.style.opacity = '0';
          carousel.style.height = '';
        } else {
          carousel.style.visibility = '';
          carousel.style.opacity = '';
          carousel.style.height = '';
        }
      }

      // Aplicar opacidad de la capa oscura
      const styleId = 'countdown-overlay-style';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      if (settings.countdownHideOverlay) {
        // Remover la capa oscura completamente pero mantener el tamaño
        styleEl.textContent = `
          .fusion-countdown-wrapper::before {
            display: none !important;
          }
          .fusion-countdown-wrapper {
            position: relative !important;
          }
        `;
      } else {
        // Aplicar opacidad configurada
        const opacity = (settings.countdownOverlayOpacity ?? 50) / 100;
        styleEl.textContent = `
          .fusion-countdown-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, ${opacity});
            z-index: 1;
            pointer-events: none;
          }
          .fusion-countdown-wrapper > * {
            position: relative;
            z-index: 2;
          }
          .fusion-countdown-wrapper {
            position: relative !important;
          }
        `;
      }
    }

    // Deshabilitar el countdown del tema clonando el elemento (elimina listeners)
    const cdEl = section.querySelector('.fusion-countdown') as HTMLElement;
    if (cdEl && !cdEl.dataset.tplCloned) {
      const clone = cdEl.cloneNode(true) as HTMLElement;
      clone.dataset.tplCloned = '1';
      cdEl.parentNode?.replaceChild(clone, cdEl);
    }
  }, [bodyHtml, sectionCfg, countdownOffer, countdownProduct]);

  /* ── Tick en vivo del countdown cada segundo ── */
  useEffect(() => {
    if (!bodyHtml) return;
    let endTimeMs: number | null = null;
    if (countdownOffer) {
      if (countdownOffer.timeType === 'endDateTime' && countdownOffer.endDateTime) {
        endTimeMs = new Date(countdownOffer.endDateTime).getTime();
      } else if (countdownOffer.timeType === 'duration' && countdownOffer.activatedAt && countdownOffer.durationHours) {
        endTimeMs = new Date(countdownOffer.activatedAt).getTime() + (countdownOffer.durationHours * 3600000);
      }
    }
    if (!endTimeMs) return;
    const sectionId = 'template--22405132419320__countdown_timer_hYJrNM';
    const interval = window.setInterval(() => {
      const section = document.getElementById(`shopify-section-${sectionId}`);
      if (!section) return;
      const cdEl = section.querySelector('.fusion-countdown');
      if (!cdEl) return;
      const ms = (endTimeMs as number) - Date.now();
      const setDigit = (id: string, n: number) => {
        const el = cdEl.querySelector(`#${id}`);
        if (el) el.textContent = String(Math.max(0, n)).padStart(2, '0');
      };
      if (ms <= 0) {
        setDigit('days', 0); setDigit('hours', 0); setDigit('minutes', 0); setDigit('seconds', 0);
        // Deshabilitar botón de compra cuando la oferta caduca
        const btn = section.querySelector('.button_primary a') as HTMLAnchorElement;
        if (btn) {
          btn.textContent = 'OFERTA CADUCADA';
          btn.href = 'javascript:void(0)';
          btn.style.pointerEvents = 'none';
          btn.style.opacity = '0.5';
          btn.style.cursor = 'not-allowed';
        }
        return;
      }
      setDigit('days', Math.floor(ms / 86400000));
      setDigit('hours', Math.floor((ms % 86400000) / 3600000));
      setDigit('minutes', Math.floor((ms % 36000000) / 60000));
      setDigit('seconds', Math.floor((ms % 60000) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [bodyHtml, countdownOffer]);

  /* ── Aplicar settings de FAQ (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_faq');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__faq_8cUkFL';
    const section = document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    // Actualizar imagen de fondo
    if (settings.faqBackgroundImage) {
      const titleBox = section.querySelector('.faq-titlebox') as HTMLElement;
      if (titleBox) {
        titleBox.style.setProperty('background-image', `url(${settings.faqBackgroundImage})`, 'important');
        titleBox.style.setProperty('background-size', 'cover', 'important');
        titleBox.style.setProperty('background-position', 'center', 'important');
        titleBox.style.setProperty('background-repeat', 'no-repeat', 'important');
        titleBox.style.setProperty('background-color', 'transparent', 'important');

        // Ocultar pseudo-elemento :before (capa oscura)
        const styleId = 'faq-overlay-style';
        let styleEl = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
          .faq-titlebox::before {
            display: none !important;
          }
        `;
      }
    }

    // Activar partículas animadas (PC only — skip on mobile for performance)
    let particlesCleanup: (() => void) | undefined;
    const isMobileFAQ = window.innerWidth <= 768;
    if (settings.faqEnableParticles && !isMobileFAQ) {
      const titleBox = section.querySelector('.faq-titlebox') as HTMLElement;

      if (titleBox) {
        // Remover TODOS los wrappers existentes (puede haber acumulados por activar/desactivar)
        section.querySelectorAll('.faq-particles-wrapper').forEach(w => w.remove());
        const oldStyle = document.getElementById('faq-particles-z-style');
        if (oldStyle) oldStyle.remove();

        // titleBox ya tiene position:relative en CSS original — no tocar overflow
        // Crear wrapper para el canvas como ÚLTIMO hijo del titleBox (no first-child para no romper reglas)
        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'faq-particles-wrapper';
        // z-index: 0 = justo encima del ::before (z-index:0 también) pero detrás de los demás hijos
        canvasWrapper.style.cssText = 'position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1; border-radius: inherit;';

        // Crear canvas para partículas (transparente por defecto)
        const canvas = document.createElement('canvas');
        canvas.className = 'faq-particles-canvas';
        canvas.style.cssText = 'display: block; width: 100%; height: 100%; background: transparent;';
        canvasWrapper.appendChild(canvas);

        // Insertar al final del titleBox (no afecta primer-hijo)
        titleBox.appendChild(canvasWrapper);

        // Aplicar z-index INLINE a la rotate_image y faq-jumbotron para garantizar máxima prioridad
        const rotateImg = titleBox.querySelector('.rotate_image') as HTMLElement;
        if (rotateImg) {
          rotateImg.style.setProperty('z-index', '3', 'important');
          rotateImg.dataset.faqParticlesZ = '1'; // marcador para limpiar después
        }
        const jumbotron = titleBox.querySelector('.faq-jumbotron') as HTMLElement;
        if (jumbotron) {
          jumbotron.style.setProperty('z-index', '2', 'important');
          jumbotron.style.setProperty('position', 'relative', 'important');
          jumbotron.dataset.faqParticlesZ = '1';
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          canvasWrapper.remove();
        } else {

          // Configurar tamaño del canvas
          const resizeCanvas = () => {
            canvas.width = titleBox.offsetWidth;
            canvas.height = titleBox.offsetHeight;
          };
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);

          // Configurar partículas
          const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = [];
          const particleCount = 50;

          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              radius: Math.random() * 3 + 1,
              alpha: Math.random() * 0.5 + 0.2
            });
          }

          let rafId = 0;
          // Animación de partículas
          const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
              p.x += p.vx;
              p.y += p.vy;

              // Rebotar en los bordes
              if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
              if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

              // Dibujar partícula
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
              ctx.fill();
            });

            rafId = requestAnimationFrame(animate);
          };

          animate();

          // Guardar cleanup para retornar al final del useEffect (NO retornar aquí, romperia el flujo)
          particlesCleanup = () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(rafId);
            canvasWrapper.remove();
            // Revertir z-index inline aplicado
            titleBox.querySelectorAll('[data-faq-particles-z]').forEach(el => {
              (el as HTMLElement).style.removeProperty('z-index');
              (el as HTMLElement).style.removeProperty('position');
              delete (el as HTMLElement).dataset.faqParticlesZ;
            });
          };
        } // fin else (ctx existe)
      }
    } else {
      // Desactivar partículas — remover wrappers y revertir z-index inline
      section.querySelectorAll('.faq-particles-wrapper').forEach(w => w.remove());
      section.querySelectorAll('[data-faq-particles-z]').forEach(el => {
        (el as HTMLElement).style.removeProperty('z-index');
        (el as HTMLElement).style.removeProperty('position');
        delete (el as HTMLElement).dataset.faqParticlesZ;
      });
      const oldStyle = document.getElementById('faq-particles-z-style');
      if (oldStyle) oldStyle.remove();
    }

    // Actualizar preguntas y respuestas del acordeón
    const faqs = settings.faqs || [];
    if (faqs.length > 0) {
      const accordionItems = section.querySelectorAll('.accordion-item') as NodeListOf<HTMLElement>;
      faqs.forEach((faq: { question: string; answer: string }, idx: number) => {
        if (idx < accordionItems.length) {
          const item = accordionItems[idx];
          // Actualizar título (texto del botón, antes del SVG)
          const btn = item.querySelector('.accordion-button') as HTMLElement;
          if (btn) {
            const svg = btn.querySelector('svg');
            const svgHtml = svg ? svg.outerHTML : '';
            btn.innerHTML = faq.question + ' ' + svgHtml;
          }
          // Actualizar respuesta (texto del body)
          const body = item.querySelector('.accordion-body p') as HTMLElement;
          if (body) {
            body.textContent = faq.answer;
          }
        }
      });
      // Ocultar items sobrantes
      for (let i = faqs.length; i < accordionItems.length; i++) {
        (accordionItems[i] as HTMLElement).style.display = 'none';
      }
      // Mostrar items que estaban ocultos
      for (let i = 0; i < Math.min(faqs.length, accordionItems.length); i++) {
        (accordionItems[i] as HTMLElement).style.display = '';
      }
    }

    // Actualizar correo de contacto
    const contactEmail = settings.faqContactEmail || 'info@yaxsell.com';
    const emailLink = section.querySelector('.faq-mail-typo') as HTMLAnchorElement;
    if (emailLink) {
      emailLink.textContent = contactEmail;
      emailLink.href = `mailto:${contactEmail}`;
      emailLink.setAttribute('aria-label', contactEmail);
    }

    // Actualizar imagen grande (rotate_image)
    const largeImage = section.querySelector('.rotate_image') as HTMLImageElement;
    if (largeImage && settings.faqAvatarLarge) {
      largeImage.src = settings.faqAvatarLarge;
    }

    // Actualizar imágenes de avatares (avatar-row)
    const avatarImages = section.querySelectorAll('.avatar-row img') as NodeListOf<HTMLImageElement>;
    if (avatarImages.length >= 4) {
      if (settings.faqAvatar1) {
        avatarImages[0].src = settings.faqAvatar1;
      }
      if (settings.faqAvatar2) {
        avatarImages[1].src = settings.faqAvatar2;
      }
      if (settings.faqAvatar3) {
        avatarImages[2].src = settings.faqAvatar3;
      }
      if (settings.faqAvatar4) {
        avatarImages[3].src = settings.faqAvatar4;
      }
    }

    // Retornar cleanup de partículas (si existe) al final, después de aplicar imágenes
    return particlesCleanup;
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de Productos con Filtro (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_products_filter');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__collection_tab_NGBXPp';
    const section = document.getElementById(`shopify-section-${sectionId}`) as HTMLElement | null;
    if (!section) return;

    // Aplicar textos
    const subEl = section.querySelector('.musk-fancy-sub-head') as HTMLElement;
    const titleEl = section.querySelector('.musk-h2-head') as HTMLElement;
    const paraEl = section.querySelector('.musk-main-para') as HTMLElement;
    if (subEl && settings.productsFilterSubtitle) subEl.textContent = settings.productsFilterSubtitle;
    if (titleEl && settings.productsFilterTitle) titleEl.textContent = settings.productsFilterTitle;
    if (paraEl && settings.productsFilterDescription) paraEl.textContent = settings.productsFilterDescription;
    applyTpl1SectionColors(section, settings);

    const catIds = settings.productsFilterCategoryIds || [];
    if (catIds.length === 0) return;
    const perCat = settings.productsFilterPerCategory ?? 8;

    let alive = true;
    (async () => {
      try {
        const { databaseId } = getAppwriteConfig();
        const { databases } = getServices();
        // Cargar todas las categorías seleccionadas en 1 sola llamada
        const catBatchRes = await databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [
          Query.equal('$id', catIds),
          Query.limit(100),
        ]).catch(() => ({ documents: [] }));
        const cats = (catBatchRes.documents as unknown as Category[]).filter(Boolean);
        // Cargar productos de todas las categorías en 1 sola llamada
        const catIdList = cats.map(c => c.$id);
        let allProducts: Product[] = [];
        if (catIdList.length > 0) {
          const prodRes = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
            Query.equal('CATEGORYID', catIdList),
            Query.greaterThan('STOCK', 0),
            Query.limit(500),
          ]).catch(() => ({ documents: [] }));
          allProducts = prodRes.documents as unknown as Product[];
        }
        // Agrupar productos por categoría en memoria
        const productsPerCat = cats.map(c =>
          allProducts.filter(p => p.CATEGORYID === c.$id).slice(0, perCat)
        );
        if (!alive) return;

        // Filtrar solo categorías que tienen productos con stock
        const catsWithProducts = cats.filter((_, i) => productsPerCat[i] && productsPerCat[i].length > 0);
        const productsForCats = catsWithProducts.map((_, i) => productsPerCat[cats.indexOf(catsWithProducts[i])]);
        if (!alive) return;

        // Reconstruir tabs
        const filterUl = section.querySelector('#filterOptions') as HTMLUListElement;
        if (filterUl) {
          filterUl.innerHTML = '';
          const selectorLi = document.createElement('li');
          selectorLi.innerHTML = '<span class="selector"></span>';
          filterUl.appendChild(selectorLi);

          const allLi = document.createElement('li');
          allLi.className = 'active';
          allLi.innerHTML = '<a href="#" data-filter="all">Todos</a>';
          filterUl.appendChild(allLi);

          catsWithProducts.forEach((c, i) => {
            const className = i === 0 ? 'dummy1' : i === 1 ? 'dummy2' : i === 2 ? 'dummy3' : i === 3 ? 'dummy4' : 'dummy5';
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" class="${className}" data-filter="${className}">${c.name}</a>`;
            filterUl.appendChild(li);
          });
        }

        // Reconstruir slides
        const holder = section.querySelector('#ourHolder') as HTMLElement;
        if (holder) {
          holder.innerHTML = '';
          const fmt = (n: number) => `$${new Intl.NumberFormat('es-CL').format(n)}`;
          const escAttr = (s: string) => (s || '').replace(/"/g, '&quot;');

          catsWithProducts.forEach((c, i) => {
            const className = i === 0 ? 'dummy1' : i === 1 ? 'dummy2' : i === 2 ? 'dummy3' : i === 3 ? 'dummy4' : 'dummy5';
            (productsForCats[i] || []).forEach(p => {
              const cp = p.CURRENTPRICE ?? 0;
              const price = cp > 0 ? cp : p.PRICE;
              const hasDisc = cp > 0 && cp < p.PRICE;
              const discPct = hasDisc ? Math.round(((p.PRICE - cp) / p.PRICE) * 100) : 0;
              const rating = (p as any).RATING ?? 0;
              const numReviews = (p as any).NUMREVIEWS ?? 0;
              const stock = p.STOCK ?? 0;
              const img1 = p.IMAGEURL || '';
              const img2 = (p as any).IMAGEURL2 || '';
              const stars = [1, 2, 3, 4, 5].map(n => `<svg width="11" height="11" viewBox="0 0 24 24" fill="${n <= Math.round(rating) ? '#FFB800' : 'none'}" stroke="${n <= Math.round(rating) ? '#E6A200' : '#D5D5D5'}" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`).join('');

              const slide = document.createElement('div');
              slide.className = `swiper-slide item ${className} coln_page_product tpl1-pc-slide`;
              slide.setAttribute('data-filter', className);
              slide.innerHTML = `
                <div class="tpl1-product-card">
                  <div class="tpl1-pc-shimmer"></div>
                  <a href="/producto/${p.$id}" class="tpl1-pc-link">
                    <div class="tpl1-pc-img-wrap">
                      <div class="tpl1-pc-img-primary">
                        ${img1 ? `<img src="${img1}" alt="${escAttr(p.NAME || '')}" loading="lazy" />` : '<span class="tpl1-pc-placeholder">📦</span>'}
                      </div>
                      ${img2 ? `<div class="tpl1-pc-img-secondary"><img src="${img2}" alt="${escAttr(p.NAME || '')}" loading="lazy" /></div>` : ''}
                      <div class="tpl1-pc-badges">
                        ${hasDisc ? `<span class="tpl1-pc-badge tpl1-pc-badge-disc">-${discPct}%</span>` : ''}
                        ${stock > 0 && stock <= 5 ? `<span class="tpl1-pc-badge tpl1-pc-badge-urg">Últimas ${stock}</span>` : ''}
                        ${stock === 0 ? `<span class="tpl1-pc-badge tpl1-pc-badge-out">Agotado</span>` : ''}
                      </div>
                      <div class="tpl1-pc-action-bar">
                        ${stock > 0 ? `<span class="tpl1-pc-cta">Ver producto</span>` : `<span class="tpl1-pc-out">Agotado</span>`}
                      </div>
                    </div>
                    <div class="tpl1-pc-info">
                      <div class="tpl1-pc-rating">
                        ${stars}
                        ${numReviews > 0 ? `<span class="tpl1-pc-reviews">(${numReviews})</span>` : ''}
                      </div>
                      <p class="tpl1-pc-name">${(p.NAME || '').replace(/</g, '&lt;')}</p>
                      <div class="tpl1-pc-price-row">
                        <span class="tpl1-pc-price">${fmt(price)}</span>
                        ${hasDisc ? `<span class="tpl1-pc-price-old">${fmt(p.PRICE)}</span>` : ''}
                      </div>
                      ${hasDisc ? `<div class="tpl1-pc-disc-label">${discPct}% OFF</div>` : ''}
                    </div>
                  </a>
                </div>
              `;

              // Tilt 3D handler
              const card = slide.querySelector('.tpl1-product-card') as HTMLElement;
              if (card) {
                card.addEventListener('mousemove', (ev) => {
                  const me = ev as MouseEvent;
                  const r = card.getBoundingClientRect();
                  const rx = ((me.clientY - r.top) / r.height - 0.5) * 6;
                  const ry = ((me.clientX - r.left) / r.width - 0.5) * -6;
                  card.style.transition = 'box-shadow .35s, border-color .35s';
                  card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
                });
                card.addEventListener('mouseleave', () => {
                  card.style.transition = '';
                  card.style.transform = '';
                });
              }
              holder.appendChild(slide);
            });
          });
        }

        // Filtrado de tabs por categoría
        const tabs = section.querySelectorAll('#filterOptions a[data-filter]') as NodeListOf<HTMLAnchorElement>;
        tabs.forEach(a => {
          a.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            tabs.forEach(t => t.parentElement?.classList.remove('active'));
            a.parentElement?.classList.add('active');
            const f = a.dataset.filter;
            const slides = section.querySelectorAll('#ourHolder .swiper-slide') as NodeListOf<HTMLElement>;
            slides.forEach(sl => {
              if (f === 'all' || sl.dataset.filter === f) {
                sl.style.display = '';
              } else {
                sl.style.display = 'none';
              }
            });
          };
        });

      } catch { /* ignore */ }
    })();
    return () => { alive = false; };
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de galería de medios (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_media_gallery');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__two_column_grid_WxQiPG';
    const section = document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    // Padding lateral a la sección
    (section as HTMLElement).style.paddingLeft = '24px';
    (section as HTMLElement).style.paddingRight = '24px';

    const titleRow = section.querySelector('.row') as HTMLElement;
    if (titleRow && settings.mediaGalleryTopText) {
      let topText = section.querySelector('.media-gallery-top-text') as HTMLElement;
      if (!topText) {
        topText = document.createElement('div');
        topText.className = 'media-gallery-top-text';
        topText.style.fontSize = '16px';
        topText.style.fontWeight = '700';
        topText.style.color = settings.mediaGalleryTitleColor || '#000000';
        topText.style.marginBottom = '20px';
        topText.style.letterSpacing = '2px';
        topText.style.textTransform = 'uppercase';
        topText.style.textAlign = 'center';
        topText.style.width = '100%';
        topText.style.display = 'block';
        section.querySelector('.container-fluid')?.insertBefore(topText, titleRow);
      }
      topText.textContent = settings.mediaGalleryTopText;
      topText.style.color = settings.mediaGalleryTitleColor || '#000000';
      topText.style.display = 'block';
    }

    const title = section.querySelector('.fusion-stroke-text') as HTMLElement;
    if (title && settings.mediaGalleryTitle) {
      title.textContent = settings.mediaGalleryTitle;
      if (settings.mediaGalleryTitleColor) {
        title.style.color = settings.mediaGalleryTitleColor;
      }
      if (settings.mediaGalleryTitleGradientColor) {
        title.style.background = `linear-gradient(90deg, ${settings.mediaGalleryTitleColor || '#000000'}, ${settings.mediaGalleryTitleGradientColor})`;
        title.style.webkitBackgroundClip = 'text';
        title.style.webkitTextFillColor = 'transparent';
        title.style.backgroundClip = 'text';
      }
      if (settings.mediaGalleryTitleHeight) {
        title.style.transform = `translateY(${settings.mediaGalleryTitleHeight}%)`;
      }
      if (settings.mediaGalleryTitleAnimation && settings.mediaGalleryTitleAnimation !== 'none') {
        title.style.animation = `${settings.mediaGalleryTitleAnimation} 1.2s ease-out forwards`;
        title.style.opacity = '0';
        // Only animate once when first scrolled into view
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              title.style.opacity = '';
              title.style.animation = `${settings.mediaGalleryTitleAnimation} 1.2s ease-out forwards`;
              observer.disconnect();
            }
          });
        }, { threshold: 0.2 });
        observer.observe(title);
      }
    }

    const items = (settings.mediaGalleryItems || []) as MediaGalleryItem[];
    if (items.length === 0) return;

    let blocks = Array.from(section.querySelectorAll('.media_gallery_items')) as HTMLElement[];

    // Clone blocks if needed
    while (blocks.length < items.length) {
      const lastBlock = blocks[blocks.length - 1];
      const clonedBlock = lastBlock.cloneNode(true) as HTMLElement;
      lastBlock.parentNode?.appendChild(clonedBlock);
      blocks.push(clonedBlock);
    }

    items.forEach((item, idx) => {
      const block = blocks[idx];

      // Change column size to fit 3 items per row
      block.classList.remove('col-sm-6');
      block.classList.add('col-sm-4');

      const galleryItemCard = block.querySelector('.media-gallery-item') as HTMLElement;
      if (galleryItemCard) {
        galleryItemCard.style.opacity = '1';
        galleryItemCard.style.background = 'transparent';
        galleryItemCard.style.aspectRatio = '9/16';
        galleryItemCard.style.overflow = 'hidden';
        galleryItemCard.style.filter = 'none';
      }

      const mediaImg = block.querySelector('.media-img') as HTMLElement;
      if (mediaImg && item.mediaUrl) {
        if (item.mediaType === 'video') {
          // Don't create video yet — show poster + play icon only
          // Video is only created when user clicks (prevents browser autoplay)
          mediaImg.innerHTML = '';
          mediaImg.style.position = 'relative';
          mediaImg.style.opacity = '1';
          mediaImg.style.filter = 'none';
          mediaImg.style.cursor = 'pointer';

          // Show poster image
          if (item.posterUrl) {
            const posterImg = document.createElement('img');
            posterImg.src = item.posterUrl;
            posterImg.alt = item.title || '';
            posterImg.style.cssText = 'width:100%;aspect-ratio:9/16;object-fit:contain;display:block;border-radius:20px;background:#000;';
            mediaImg.appendChild(posterImg);
          }

          // Play icon — always visible until video plays
          const playIcon = document.createElement('div');
          playIcon.className = 'tpl1-video-play-icon';
          playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;transition:opacity 0.3s ease;opacity:1;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;';
          playIcon.innerHTML = `<svg width="24" height="28" viewBox="0 0 24 28" fill="white" style="margin-left:3px;"><polygon points="2,0 24,14 2,28"/></svg>`;
          mediaImg.appendChild(playIcon);

          // Pause icon — hidden until video plays
          const pauseIcon = document.createElement('div');
          pauseIcon.className = 'tpl1-video-pause-icon';
          pauseIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;transition:opacity 0.3s ease;opacity:0;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);display:none;align-items:center;justify-content:center;';
          pauseIcon.innerHTML = `<svg width="24" height="28" viewBox="0 0 24 28" fill="white"><rect x="2" y="0" width="7" height="28" rx="2"/><rect x="14" y="0" width="7" height="28" rx="2"/></svg>`;
          mediaImg.appendChild(pauseIcon);

          let videoCreated = false;
          mediaImg.onclick = (e) => {
            e.stopPropagation();
            if (!videoCreated) {
              // First click: create video, replace poster, play
              const video = document.createElement('video');
              video.src = item.mediaUrl;
              video.muted = true;
              video.loop = true;
              video.playsInline = true;
              video.setAttribute('playsinline', '');
              video.setAttribute('muted', '');
              video.preload = 'auto';
              video.style.cssText = 'width:100%;aspect-ratio:9/16;object-fit:contain;display:block;border-radius:20px;background:#000;position:absolute;top:0;left:0;opacity:0;transition:opacity 0.15s ease;';
              // Insert video — hidden (opacity:0) until it actually plays
              const posterImg = mediaImg.querySelector('img');
              if (posterImg) posterImg.style.position = 'relative';
              mediaImg.insertBefore(video, playIcon);
              // Set up play/pause event handlers BEFORE calling play
              // Use onplaying (not onplay) — fires when video actually renders a frame, preventing black flash
              video.onplaying = () => { video.style.opacity = '1'; playIcon.style.display = 'none'; pauseIcon.style.display = 'flex'; if (posterImg && posterImg.parentNode) posterImg.remove(); };
              video.onpause = () => { playIcon.style.display = 'flex'; pauseIcon.style.display = 'none'; };
              video.play().catch(() => { });
              videoCreated = true;
              // Subsequent clicks on mediaImg
              mediaImg.onclick = (e2) => {
                e2.stopPropagation();
                if (video.paused) { video.play().catch(() => { }); }
                else { video.pause(); }
              };
            }
          };
        } else {
          mediaImg.innerHTML = `<img src="${item.mediaUrl}" width="auto" height="auto" alt="${item.title || ''}" style="width:100%;aspect-ratio:9/16;object-fit:cover;display:block;border-radius:20px;" />`;
        }
      }

      const mediaContent = block.querySelector('.media-content') as HTMLElement;
      if (mediaContent) {
        mediaContent.style.display = 'none';
      }

      const mediaTitle = block.querySelector('.media-title') as HTMLElement;
      if (mediaTitle) {
        mediaTitle.style.display = 'none';
      }

      const button = block.querySelector('.button_primary') as HTMLElement;
      if (button) {
        button.style.display = 'none';
      }

      const galleryItem = block.querySelector('.media-gallery-item') as HTMLElement;
      if (galleryItem) {
        galleryItem.style.position = 'relative';
        let notifyBtn = block.querySelector('.notify-arrival-btn') as HTMLButtonElement;
        if (!notifyBtn) {
          notifyBtn = document.createElement('button');
          notifyBtn.className = 'notify-arrival-btn';
          notifyBtn.textContent = 'Avísame cuando llegue';
          notifyBtn.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: rgba(255, 192, 203, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 25px;
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(219, 39, 119, 0.2);
            transition: all 0.3s ease;
            z-index: 20;
          `;
          notifyBtn.onmouseenter = () => {
            notifyBtn.style.background = 'rgba(255, 192, 203, 0.4)';
            notifyBtn.style.transform = 'translateY(-2px)';
            notifyBtn.style.boxShadow = '0 12px 40px rgba(219, 39, 119, 0.25)';
          };
          notifyBtn.onmouseleave = () => {
            notifyBtn.style.background = 'rgba(255, 192, 203, 0.3)';
            notifyBtn.style.transform = 'translateY(0)';
            notifyBtn.style.boxShadow = '0 8px 32px rgba(219, 39, 119, 0.2)';
            notifyBtn.style.color = '#ffffff';
          };
          notifyBtn.onclick = async () => {
            const productTitle = item.title || '';
            notifyBtn.disabled = true;
            notifyBtn.textContent = 'Registrando...';

            try {
              const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
              const response = await fetch('/api/product-votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productTitle,
                  userId: user?.$id || null,
                  userName: user?.NAME || null,
                  userEmail: user?.EMAIL || null,
                }),
              });

              const data = await response.json();
              if (response.ok) {
                notifyBtn.textContent = '✓ ¡Registrado!';
                notifyBtn.style.background = 'rgba(34, 197, 94, 0.25)';
                notifyBtn.style.color = '#16a34a';
                setTimeout(() => {
                  notifyBtn.textContent = 'Avísame cuando llegue';
                  notifyBtn.style.background = 'rgba(255, 192, 203, 0.3)';
                  notifyBtn.style.color = '#ffffff';
                  notifyBtn.disabled = false;
                }, 3000);
              } else {
                alert(data.error || 'Error al registrar voto');
                notifyBtn.textContent = 'Avísame cuando llegue';
                notifyBtn.disabled = false;
              }
            } catch (error) {
              console.error('Error voting:', error);
              alert('Error al registrar voto');
              notifyBtn.textContent = 'Avísame cuando llegue';
              notifyBtn.disabled = false;
            }
          };
          galleryItem.appendChild(notifyBtn);
        }
      }
    });

    for (let i = items.length; i < blocks.length; i++) {
      blocks[i].style.display = 'none';
    }
    for (let i = 0; i < Math.min(items.length, blocks.length); i++) {
      blocks[i].style.display = '';
    }
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de testimonios (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_testimonials');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__testimonial_hf6Hpn';
    const section = document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    const items = (settings.testimonials || []) as { name: string; text: string; avatar?: string; rating?: number; productId?: string; productImage?: string; productName?: string }[];
    if (items.length === 0) return;

    // Título
    const titleEl = section.querySelector('.musk-h2-head') as HTMLElement;
    if (titleEl && settings.title) titleEl.textContent = settings.title;

    // Slides existentes
    const wrapper = section.querySelector('.swiper-wrapper') as HTMLElement;
    if (!wrapper) return;
    const slides = Array.from(wrapper.querySelectorAll('.swiper-slide')) as HTMLElement[];

    // Clonar slides si faltan
    while (slides.length < items.length) {
      const lastSlide = slides[slides.length - 1];
      const cloned = lastSlide.cloneNode(true) as HTMLElement;
      wrapper.appendChild(cloned);
      slides.push(cloned);
    }

    // Ocultar slides sobrantes
    slides.forEach((slide, idx) => {
      if (idx >= items.length) {
        slide.style.display = 'none';
      } else {
        slide.style.display = '';
        const item = items[idx];

        // Ocultar imagen del producto
        const prodImgContainer = slide.querySelector('.product_image') as HTMLElement;
        if (prodImgContainer) prodImgContainer.style.display = 'none';

        // Texto
        const para = slide.querySelector('.slide-para') as HTMLElement;
        if (para) para.textContent = item.text;

        // Avatar
        const avatar = slide.querySelector('.avatar img') as HTMLImageElement;
        if (avatar && item.avatar) avatar.src = item.avatar;

        // Nombre
        const username = slide.querySelector('.username') as HTMLElement;
        if (username) username.textContent = item.name;

        // Fecha (opcional)
        const dateEl = slide.querySelector('.slide-date') as HTMLElement;
        if (dateEl) dateEl.textContent = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

        // Estrellas horizontales y doradas
        const ratingContainer = slide.querySelector('.slide-rating') as HTMLElement;
        if (ratingContainer) {
          ratingContainer.style.display = 'flex';
          ratingContainer.style.flexDirection = 'row';
          ratingContainer.style.gap = '2px';
          ratingContainer.style.alignItems = 'center';
        }

        const starFills = slide.querySelectorAll('.rating__star-fill.active');
        starFills.forEach(fill => fill.setAttribute('fill', '#f59e0b'));
        const starStrokes = slide.querySelectorAll('.rating__star-stroke');
        starStrokes.forEach(stroke => stroke.setAttribute('stroke', '#f59e0b'));

        // Mostrar/ocultar estrellas según rating
        const ratingSpans = slide.querySelectorAll('.slide-rating .rating');
        ratingSpans.forEach((span, sIdx) => {
          if (sIdx < (item.rating || 5)) {
            span.classList.add('checked');
            const starFill = span.parentElement?.querySelector(`.rating__star-fill`) as SVGElement;
            if (starFill) starFill.classList.add('active');
          } else {
            span.classList.remove('checked');
            const starFill = span.parentElement?.querySelector(`.rating__star-fill`) as SVGElement;
            if (starFill) starFill.classList.remove('active');
          }
        });
      }
    });
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de colección destacada (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_featured_collection');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__featured_collection_UNXLgP';
    const section = (document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`)) as HTMLElement | null;
    if (!section) return;

    // Ocultar sección si no hay items configurados
    const featuredItems = (settings.featuredCollectionItems || []) as CollectionItem[];
    if (featuredItems.length === 0) {
      section.style.display = 'none';
      return;
    } else {
      section.style.display = '';
    }

    const subHead = section.querySelector('.musk-fancy-sub-head') as HTMLElement;
    const mainTitle = section.querySelector('.musk-h2-head') as HTMLElement;
    const mainPara = section.querySelector('.musk-main-para') as HTMLElement;
    if (subHead && settings.featuredCollectionSubtitle) subHead.textContent = settings.featuredCollectionSubtitle;
    if (mainTitle && settings.featuredCollectionTitle) mainTitle.textContent = settings.featuredCollectionTitle;
    if (mainPara && settings.featuredCollectionDescription) mainPara.textContent = settings.featuredCollectionDescription;

    let fcStyle = document.getElementById('tpl1-featured-collection-premium-style') as HTMLStyleElement | null;
    if (!fcStyle) {
      fcStyle = document.createElement('style');
      fcStyle.id = 'tpl1-featured-collection-premium-style';
      document.head.appendChild(fcStyle);
    }
    const sectionBg = settings.bgColor
      ? `background: ${settings.bgColor} !important;`
      : `background: radial-gradient(circle at top left, rgba(255, 228, 240, .85), transparent 34%),
            linear-gradient(180deg, #fff7fb 0%, #ffffff 58%, #fff1f7 100%) !important;`;
    fcStyle.textContent = `
        [data-section-id="${sectionId}"] {
          ${sectionBg}
          position: relative !important;
          overflow: hidden !important;
        }
        [data-section-id="${sectionId}"] .musk-fancy-sub-head {
          letter-spacing: .26em !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
        }
        [data-section-id="${sectionId}"] .musk-main-para {
          max-width: 780px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          line-height: 1.85 !important;
        }
        [data-section-id="${sectionId}"] .tpl1-featured-cat-slide .product-content {
          background: #fff !important;
          border: 1.5px solid rgba(236,72,153,.08) !important;
          border-radius: 20px !important;
          box-shadow: 0 2px 8px rgba(190,24,93,.06), 0 8px 24px rgba(190,24,93,.04) !important;
          padding: 24px 16px 20px !important;
          transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s cubic-bezier(.4,0,.2,1), border-color .35s ease !important;
          transform-style: preserve-3d !important;
          will-change: transform !important;
          cursor: pointer !important;
          position: relative !important;
        }
        [data-section-id="${sectionId}"] .tpl1-featured-cat-slide .product-content:hover {
          border-color: rgba(236,72,153,.25) !important;
          box-shadow: 0 12px 36px rgba(190,24,93,.14), 0 4px 12px rgba(190,24,93,.06) !important;
        }
        [data-section-id="${sectionId}"] .tpl1-featured-cat-icon-wrap {
          background: linear-gradient(145deg, rgba(236,72,153,.06), rgba(236,72,153,.12)) !important;
          border-radius: 22px !important;
          border: 1.5px solid rgba(236,72,153,.1) !important;
          transition: transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s ease !important;
        }
        [data-section-id="${sectionId}"] .product-content:hover .tpl1-featured-cat-icon-wrap {
          transform: scale(1.06) !important;
          box-shadow: 0 4px 16px rgba(236,72,153,.12) !important;
        }
        [data-section-id="${sectionId}"] .tpl1-featured-cat-icon {
          width: 60px !important;
          height: 60px !important;
          object-fit: contain !important;
          transition: transform .3s ease !important;
        }
        [data-section-id="${sectionId}"] .product-content:hover .tpl1-featured-cat-icon {
          transform: scale(1.05) !important;
        }
        [data-section-id="${sectionId}"] .product-name a {
          color: #1a1a1a !important;
          font-weight: 700 !important;
          font-size: 13px !important;
          letter-spacing: -0.2px !important;
          transition: color .25s ease !important;
        }
        [data-section-id="${sectionId}"] .product-content:hover .product-name a {
          color: #ec4899 !important;
        }
        [data-section-id="${sectionId}"] .tpl1-cat-accent-bar {
          position: absolute !important;
          top: 0 !important;
          left: 18% !important;
          right: 18% !important;
          height: 3px !important;
          background: linear-gradient(90deg, transparent, #ec4899, transparent) !important;
          border-radius: 0 0 4px 4px !important;
          opacity: 0 !important;
          transition: opacity .3s ease !important;
        }
        [data-section-id="${sectionId}"] .product-content:hover .tpl1-cat-accent-bar {
          opacity: 1 !important;
        }
        [data-section-id="${sectionId}"] .tpl1-cat-count-badge {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-top: 8px !important;
          padding: 4px 12px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.02em !important;
          color: #fff !important;
          background: linear-gradient(135deg, #ec4899, #db2777) !important;
          border-radius: 999px !important;
          line-height: 1.3 !important;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.25) !important;
        }
        [data-section-id="${sectionId}"] .tpl1-featured-cat-slide .product-details .product-price {
          display: none !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `;

    applyTpl1SectionColors(section, settings);

    const items = (settings.featuredCollectionItems || []) as CollectionItem[];
    if (items.length === 0) return;

    const slides = section.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>;
    items.forEach((item, idx) => {
      if (idx >= slides.length) return;
      const slide = slides[idx];
      slide.classList.add('tpl1-featured-cat-slide');

      const productContent = slide.querySelector('.product-content') as HTMLElement;
      if (productContent) {
        productContent.style.cursor = 'pointer';
        const href = collectionItemHref(item);
        productContent.onclick = () => { window.location.href = href; };

        // Add accent bar if not present
        if (!productContent.querySelector('.tpl1-cat-accent-bar')) {
          const bar = document.createElement('div');
          bar.className = 'tpl1-cat-accent-bar';
          productContent.appendChild(bar);
        }

        // 3D tilt solo en desktop
        if (window.matchMedia('(min-width: 769px)').matches) {
          productContent.addEventListener('mousemove', (e: Event) => {
            const me = e as MouseEvent;
            const el = me.currentTarget as HTMLElement;
            el.style.transition = 'box-shadow .3s, border-color .3s';
            const r = el.getBoundingClientRect();
            const rx = ((me.clientY - r.top) / r.height - 0.5) * 12;
            const ry = ((me.clientX - r.left) / r.width - 0.5) * -12;
            el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.03)`;
          });
          productContent.addEventListener('mouseleave', (e: Event) => {
            const el = (e.currentTarget as HTMLElement);
            el.style.transition = '';
            el.style.transform = '';
          });
        }
      }

      const productImg = slide.querySelector('.product-img') as HTMLElement;
      if (productImg) {
        productImg.innerHTML = '';
        productImg.classList.add('tpl1-featured-cat-icon-wrap');
        const icon = document.createElement('img');
        icon.className = 'tpl1-featured-cat-icon';
        icon.src = item.imageUrl || '';
        icon.alt = item.name;
        productImg.appendChild(icon);
      }

      const nameLink = slide.querySelector('.product-name a') as HTMLAnchorElement;
      if (nameLink) {
        nameLink.textContent = item.name;
        nameLink.setAttribute('aria-label', item.name);
        nameLink.removeAttribute('aria-disabled');
        nameLink.href = collectionItemHref(item);
      }

      // Badge con cantidad de productos (debajo del nombre)
      const productDetails = slide.querySelector('.product-details') as HTMLElement;
      const upsertCountBadge = (container: HTMLElement | null, count: number | undefined) => {
        if (!container) return;
        let badge = container.querySelector('.tpl1-cat-count-badge') as HTMLElement;
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'tpl1-cat-count-badge';
          container.appendChild(badge);
        }
        if (count === undefined) {
          badge.style.display = 'none';
          badge.textContent = '';
          return;
        }
        badge.textContent = `${count} producto${count !== 1 ? 's' : ''}`;
        badge.style.display = 'inline-flex';
      };
      upsertCountBadge(productDetails, item.productCount);

      const price = slide.querySelector('.product-price') as HTMLElement;
      if (price) price.style.display = 'none';
    });

    for (let i = items.length; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (let i = 0; i < Math.min(items.length, slides.length); i++) {
      slides[i].style.display = '';
    }

    // Móvil: grid estático en lugar del carrusel apretado
    const applyFeaturedMobileLayout = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      section.classList.toggle('tpl1-featured-cat-mobile-grid', isMobile);
      const slider = section.querySelector('fuzion-swiper-slider') as HTMLElement & { swiper?: { destroy: (a: boolean, b: boolean) => void } };
      if (isMobile && slider?.swiper) {
        try { slider.swiper.destroy(false, true); } catch { /* ignore */ }
      }
    };
    applyFeaturedMobileLayout();
    window.addEventListener('resize', applyFeaturedMobileLayout);

    // Auto-fetch product counts from Appwrite for categories missing productCount
    // Single batch call instead of N calls per category
    (async () => {
      const itemsNeedingCount = items.filter(it => it.productCount === undefined && it.categoryId);
      if (itemsNeedingCount.length === 0) return;
      const { databaseId } = getAppwriteConfig();
      const { databases } = getServices();
      const catIdsToCount = itemsNeedingCount.map(it => it.categoryId!);
      try {
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [
          Query.equal('CATEGORYID', catIdsToCount),
          Query.greaterThan('STOCK', 0),
          Query.limit(500),
        ]);
        const counts: Record<string, number> = {};
        for (const doc of res.documents) {
          const cat = (doc as any).CATEGORYID;
          counts[cat] = (counts[cat] || 0) + 1;
        }
        for (let idx = 0; idx < items.length; idx++) {
          const item = items[idx];
          if (item.productCount !== undefined || !item.categoryId) continue;
          const count = counts[item.categoryId] || 0;
          if (idx < slides.length) {
            const details = slides[idx].querySelector('.product-details') as HTMLElement;
            if (details) {
              let badge = details.querySelector('.tpl1-cat-count-badge') as HTMLElement;
              if (!badge) {
                badge = document.createElement('span');
                badge.className = 'tpl1-cat-count-badge';
                details.appendChild(badge);
              }
              badge.textContent = `${count} producto${count !== 1 ? 's' : ''}`;
              badge.style.display = 'inline-flex';
            }
          }
        }
      } catch { /* ignore */ }
    })();

    return () => {
      window.removeEventListener('resize', applyFeaturedMobileLayout);
    };
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de marquee (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_marquee');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__marquee_mdGXX9';
    const section = (document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`)) as HTMLElement | null;
    if (!section) return;

    const text1 = settings.marqueeText1 || 'Transforma tu belleza';
    const text2 = settings.marqueeText2 || 'Elegancia atemporal';
    const text3 = settings.marqueeText3 || 'Yaxsell';
    const img1 = settings.marqueeImage1 || '/shopify/assets/img/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/marquee-shape-m77pjx.png';
    const img2 = settings.marqueeImage2 || img1;
    const img3 = settings.marqueeImage3 || '';
    const scrollItems = section.querySelectorAll('.marquee-scroll-item') as NodeListOf<HTMLElement>;
    scrollItems.forEach(item => {
      item.innerHTML = `
        <div class="marquee-text-box"><h3 class="heading_color display-font-6">${text1}</h3></div>
        <div class="marquee-img-box image-one"><img src="${img1}" alt="" /></div>
        <div class="marquee-text-box marquee-text-fancy"><h3 class="heading_color display-font-6">${text2}</h3></div>
        <div class="marquee-img-box image-two"><img src="${img2}" alt="" /></div>
        <div class="marquee-text-box marquee-text-box-3"><h3 class="heading_color display-font-6">${text3}</h3></div>
        ${img3 ? `<div class="marquee-img-box image-three"><img src="${img3}" alt="" /></div>` : ''}
      `;
    });

    // Apply font styles
    const fontFamily = settings.marqueeFontFamily;
    const fontSize = settings.marqueeFontSize;
    const fontWeight = settings.marqueeFontWeight;
    const color = settings.marqueeColor;
    const headings = section.querySelectorAll('.marquee-text-box h3') as NodeListOf<HTMLElement>;
    headings.forEach(h => {
      if (fontFamily) h.style.fontFamily = fontFamily;
      if (fontSize) h.style.fontSize = `${fontSize}px`;
      if (fontWeight) h.style.fontWeight = String(fontWeight);
      if (color) paintTpl1Text(h, color);
    });
    applyTpl1SectionColors(section, settings);

    // Update image height
    const imgHeight = settings.marqueeImageHeight ?? 50;
    const allScrollItems = section.querySelectorAll('.marquee-scroll-item') as NodeListOf<HTMLElement>;
    allScrollItems.forEach(el => {
      el.style.setProperty('--marquee-img-one-height', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-one-width', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-two-height', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-two-width', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-three-height', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-three-width', `${imgHeight}px`);
    });

    // Update speed via CSS variable
    const speed = settings.marqueeSpeed ?? 18;
    const wrapper = section.querySelector('.marquee-text-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.style.setProperty('--marquee-speed', `${speed}s`);
    }

    // Infinite loop: duplicate all scroll items so translate(-50%) loops seamlessly
    const container = section.querySelector('.marquee-text-container') as HTMLElement;
    if (container && !container.querySelector('.marquee-clone-marker')) {
      const existingItems = Array.from(container.querySelectorAll('.marquee-scroll-item')) as HTMLElement[];
      const marker = document.createElement('span');
      marker.className = 'marquee-clone-marker';
      marker.style.display = 'none';
      existingItems.forEach(item => {
        const clone = item.cloneNode(true) as HTMLElement;
        container.appendChild(clone);
      });
      container.appendChild(marker);
    }
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de marquee 2 (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_marquee_2');
    if (!cfg) return;
    const settings = cfg.settings || {};
    const sectionId = 'template--22405132419320__marquee_nP83AA';
    const section = (document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`)) as HTMLElement | null;
    if (!section) return;

    const text1 = settings.marquee2Text1 || 'Transforma tu belleza';
    const text2 = settings.marquee2Text2 || 'Elegancia atemporal';
    const text3 = settings.marquee2Text3 || 'Yaxsell';
    const img1 = settings.marquee2Image1 || '/shopify/assets/img/9jo523yvuya95av2-82653806840.shopifypreview.com/cdn/shop/t/3/assets/marquee-shape-m77pjx.png';
    const img2 = settings.marquee2Image2 || img1;
    const img3 = settings.marquee2Image3 || '';
    const scrollItems = section.querySelectorAll('.marquee-scroll-item') as NodeListOf<HTMLElement>;
    scrollItems.forEach(item => {
      item.innerHTML = `
        <div class="marquee-text-box"><h3 class="heading_color display-font-6">${text1}</h3></div>
        <div class="marquee-img-box image-one"><img src="${img1}" alt="" /></div>
        <div class="marquee-text-box marquee-text-fancy"><h3 class="heading_color display-font-6">${text2}</h3></div>
        <div class="marquee-img-box image-two"><img src="${img2}" alt="" /></div>
        <div class="marquee-text-box marquee-text-box-3"><h3 class="heading_color display-font-6">${text3}</h3></div>
        ${img3 ? `<div class="marquee-img-box image-three"><img src="${img3}" alt="" /></div>` : ''}
      `;
    });

    // Apply font styles
    const fontFamily = settings.marquee2FontFamily;
    const fontSize = settings.marquee2FontSize;
    const fontWeight = settings.marquee2FontWeight;
    const color = settings.marquee2Color;
    const headings = section.querySelectorAll('.marquee-text-box h3') as NodeListOf<HTMLElement>;
    headings.forEach(h => {
      if (fontFamily) h.style.fontFamily = fontFamily;
      if (fontSize) h.style.fontSize = `${fontSize}px`;
      if (fontWeight) h.style.fontWeight = String(fontWeight);
      if (color) paintTpl1Text(h, color);
    });
    applyTpl1SectionColors(section, settings);

    // Update image height
    const imgHeight = settings.marquee2ImageHeight ?? 32;
    const allScrollItems = section.querySelectorAll('.marquee-scroll-item') as NodeListOf<HTMLElement>;
    allScrollItems.forEach(el => {
      el.style.setProperty('--marquee-img-one-height', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-one-width', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-two-height', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-two-width', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-three-height', `${imgHeight}px`);
      el.style.setProperty('--marquee-img-three-width', `${imgHeight}px`);
    });

    // Update speed via CSS variable
    const speed = settings.marquee2Speed ?? 18;
    const wrapper = section.querySelector('.marquee-text-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.style.setProperty('--marquee-speed', `${speed}s`);
    }

    // Infinite loop: duplicate all scroll items so translate(-50%) loops seamlessly
    const container = section.querySelector('.marquee-text-container') as HTMLElement;
    if (container && !container.querySelector('.marquee-clone-marker')) {
      const existingItems = Array.from(container.querySelectorAll('.marquee-scroll-item')) as HTMLElement[];
      const marker = document.createElement('span');
      marker.className = 'marquee-clone-marker';
      marker.style.display = 'none';
      existingItems.forEach(item => {
        const clone = item.cloneNode(true) as HTMLElement;
        container.appendChild(clone);
      });
      container.appendChild(marker);
    }
  }, [bodyHtml, sectionCfg]);

  /* ── Campana de notificaciones en header Shopify (desktop homepage) ── */
  useEffect(() => {
    if (!bodyHtml) return;

    const HEADER_ID = 'shopify-section-sections--22405132747000__header_fYEwWD';

    const injectNotifBell = () => {
      if (typeof window === 'undefined' || window.innerWidth <= 768) {
        document.getElementById('tpl1-notif-bell-wrap')?.remove();
        return;
      }

      const infoCol = document.querySelector(
        `#${HEADER_ID} .musk-header-info-col`
      ) as HTMLElement | null;
      if (!infoCol) return;

      if (!isLoggedIn) {
        document.getElementById('tpl1-notif-bell-wrap')?.remove();
        return;
      }

      let wrap = document.getElementById('tpl1-notif-bell-wrap') as HTMLElement | null;
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'tpl1-notif-bell-wrap';
        wrap.className = 'tpl1-notif-bell-wrap';
        wrap.innerHTML = `
          <button type="button" class="header-resource-link tpl1-notif-bell-link" aria-label="Notificaciones" title="Notificaciones" style="background:none;border:none;padding:0;cursor:pointer;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="tpl1-notif-badge"></span>
          </button>
        `;
        const bellBtn = wrap.querySelector('.tpl1-notif-bell-link');
        bellBtn?.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent(TPL1_OPEN_NOTIFICATIONS));
        });
        const cartEl = infoCol.querySelector('.cart-link-icon');
        const searchEl = infoCol.querySelector('.search-bar-main');
        if (cartEl) infoCol.insertBefore(wrap, cartEl);
        else if (searchEl?.nextSibling) infoCol.insertBefore(wrap, searchEl.nextSibling);
        else infoCol.appendChild(wrap);
      }

      const badge = wrap.querySelector('.tpl1-notif-badge') as HTMLElement | null;
      const link = wrap.querySelector('.tpl1-notif-bell-link') as HTMLElement | null;
      if (link) link.style.color = '#fff';
      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }
    };

    injectNotifBell();
    const t1 = setTimeout(injectNotifBell, 400);
    const t2 = setTimeout(injectNotifBell, 1200);
    const section = document.getElementById(HEADER_ID);
    let notifDebounce: ReturnType<typeof setTimeout> | null = null;
    const obs = section
      ? new MutationObserver(() => {
          if (notifDebounce) clearTimeout(notifDebounce);
          notifDebounce = setTimeout(injectNotifBell, 300);
        })
      : null;
    obs?.observe(section!, { childList: true, subtree: false });
    window.addEventListener('resize', injectNotifBell);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      obs?.disconnect();
      window.removeEventListener('resize', injectNotifBell);
    };
  }, [bodyHtml, isLoggedIn, unreadCount]);

  /* ── Aplicar settings de service icons (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_service_icons');
    if (!cfg) return;
    const s = cfg.settings || {};
    const sectionId = 'template--22405132419320__icon_with_text_7MGWAj';
    const section = document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    const items = (s.items || []) as { icon: string; title: string; description: string }[];
    if (items.length === 0) return;

    // Lucide SVG paths para iconos de servicios
    const lucideIcons: Record<string, { svg: string; color: string }> = {
      'truck': { svg: '<path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 5v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/>', color: '#6366f1' },
      'shield-check': { svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>', color: '#10b981' },
      'message-circle': { svg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>', color: '#f59e0b' },
      'sparkles': { svg: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>', color: '#ec4899' },
      'heart-handshake': { svg: '<path d="m19 14 3.5-3.5a2.12 2.12 0 0 0-3-3L16 11"/><path d="m5 14-3.5-3.5a2.12 2.12 0 0 1 3-3L8 11"/><path d="M2 17l5 5"/><path d="M9 18l1-1"/><path d="m22 17-5 5"/><path d="M15 18l-1-1"/><path d="M12 22c-4-4-8-7.5-8-11a6 6 0 0 1 12 0c0-1.5 1.5-3 3-3s3 1.5 3 3c0 1-1 3-3 5"/>', color: '#ef4444' },
      'refresh-cw': { svg: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>', color: '#8b5cf6' },
      'gift': { svg: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>', color: '#f43f5e' },
      'headset': { svg: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 22a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4"/>', color: '#0ea5e9' },
      'lock': { svg: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', color: '#14b8a6' },
      'badge-check': { svg: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>', color: '#22c55e' },
      'package': { svg: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-9-5.2a2 2 0 0 0-2 0l-9 5.2A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l9 5.2a2 2 0 0 0 2 0l9-5.2A2 2 0 0 0 22 16Z"/><path d="M2 27l20 14-10-5.5"/><path d="m12 22-10-5.5"/><path d="M12 22v10"/>', color: '#a855f7' },
      'credit-card': { svg: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>', color: '#3b82f6' },
      'map-pin': { svg: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', color: '#f97316' },
      'phone': { svg: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', color: '#06b6d4' },
      'star': { svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', color: '#eab308' },
    };

    // Título
    if (s.title) {
      const rowDiv = section.querySelector('.row .col-12') as HTMLElement;
      if (rowDiv) {
        let titleEl = rowDiv.querySelector('.service-section-title') as HTMLElement;
        if (!titleEl) {
          titleEl = document.createElement('h2');
          titleEl.className = 'service-section-title';
          titleEl.style.cssText = 'text-align:center;font-size:28px;font-weight:800;margin-bottom:30px;color:#111;';
          rowDiv.appendChild(titleEl);
        }
        titleEl.textContent = s.title;
      }
    }

    // Mejorar diseño de service items
    const wrapper = section.querySelector('.swiper-wrapper') as HTMLElement;
    if (!wrapper) return;
    const slides = Array.from(wrapper.querySelectorAll('.swiper-slide')) as HTMLElement[];

    // Clonar slides si faltan
    while (slides.length < items.length) {
      const lastSlide = slides[slides.length - 1];
      const cloned = lastSlide.cloneNode(true) as HTMLElement;
      wrapper.appendChild(cloned);
      slides.push(cloned);
    }

    slides.forEach((slide, idx) => {
      if (idx >= items.length) {
        slide.style.display = 'none';
        return;
      }
      slide.style.display = '';
      const item = items[idx];
      const serviceItem = slide.querySelector('.service-item') as HTMLElement;
      if (!serviceItem) return;

      // Mejorar diseño de la tarjeta
      serviceItem.style.cssText = 'border-radius:20px;padding:30px 20px;text-align:center;background:linear-gradient(135deg,#fafafa,#fff);border:1px solid #f0f0f0;box-shadow:0 4px 20px rgba(0,0,0,0.06);transition:all 0.3s ease;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;';

      // Hover effect
      serviceItem.onmouseenter = () => { serviceItem.style.transform = 'translateY(-5px)'; serviceItem.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; };
      serviceItem.onmouseleave = () => { serviceItem.style.transform = 'translateY(0)'; serviceItem.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; };

      // Icono Lucide SVG
      const imgDiv = slide.querySelector('.service-img') as HTMLElement;
      if (imgDiv) {
        const iconData = lucideIcons[item.icon];
        if (iconData) {
          imgDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${iconData.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconData.svg}</svg>`;
        } else {
          imgDiv.innerHTML = `<span style="font-size:40px;line-height:1;">${item.icon}</span>`;
        }
        imgDiv.style.cssText = 'margin-bottom:8px;display:flex;align-items:center;justify-content:center;';
      }

      // Título
      const titleEl = slide.querySelector('.service-title') as HTMLElement;
      if (titleEl) {
        titleEl.textContent = item.title;
        titleEl.style.cssText = 'font-size:16px;font-weight:700;color:#111;margin:0;';
      }

      // Descripción
      const descEl = slide.querySelector('.servive-dtl') as HTMLElement;
      if (descEl) {
        descEl.textContent = item.description;
        descEl.style.cssText = 'font-size:13px;color:#666;margin:0;line-height:1.5;';
      }
    });
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de footer (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_footer');
    if (!cfg) return;
    const s = cfg.settings || {};
    const sectionId = 'sections--22405132714232__footer_pzLNtW';
    const footer = document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`);
    if (!footer) return;

    // Defaults para Kevin & Coco Chile
    const companyName = s.companyName || 'Kevin & Coco Chile';
    const companyDescription = s.companyDescription || 'Tu tienda de maquillaje y artículos de beauty favoritos. Productos de calidad para realzar tu belleza natural.';
    const email = s.email || 'kevincocochile2026@gmail.com';
    const col1Title = s.footerCol1Title || 'Comprar';
    const col2Title = s.footerCol2Title || 'Ayuda';
    const col3Title = s.footerCol3Title || 'Contacto';
    const col4Title = s.footerCol4Title || 'Suscríbete';
    const nlText = s.newsletterText || 'Recibe ofertas exclusivas y novedades';
    const col1Links = s.footerCol1Links || [];
    const col2Links = s.footerCol2Links || [];
    const col3Links = s.footerCol3Links || [];

    // Logo / Nombre de la empresa
    const logoDiv = footer.querySelector('.ftr-logo') as HTMLElement;
    if (logoDiv) {
      const logoWidth = s.footerLogoWidth ?? 170;
      if (s.logoUrl) {
        logoDiv.innerHTML = `<a href="/" aria-label="Inicio"><img src="${s.logoUrl}" alt="${companyName}" style="max-width:${logoWidth}px;height:auto;display:block;margin:0 auto;" /></a>`;
      } else {
        logoDiv.innerHTML = `<a href="/" aria-label="Inicio"><span class="h3 secondary-text" style="font-size:20px;font-weight:700;">${companyName}</span></a>`;
      }
    }

    // Títulos de columnas del footer
    const colTitles = footer.querySelectorAll('.ftr-support-col .ftr-col-title') as NodeListOf<HTMLElement>;
    if (colTitles.length >= 1) {
      const svg1 = colTitles[0].querySelector('svg');
      const svgHtml1 = svg1 ? svg1.outerHTML : '';
      colTitles[0].innerHTML = col1Title + ' <i class="fa-solid fa-plus secondary-icon-clr">' + svgHtml1;
    }
    if (colTitles.length >= 2) {
      const svg2 = colTitles[1].querySelector('svg');
      const svgHtml2 = svg2 ? svg2.outerHTML : '';
      colTitles[1].innerHTML = col2Title + ' <i class="fa-solid fa-plus secondary-icon-clr">' + svgHtml2;
    }
    if (colTitles.length >= 3) {
      const svg3 = colTitles[2].querySelector('svg');
      const svgHtml3 = svg3 ? svg3.outerHTML : '';
      colTitles[2].innerHTML = col3Title + ' <i class="fa-solid fa-plus secondary-icon-clr">' + svgHtml3;
    }

    // Links de cada columna del footer
    const supportCols = footer.querySelectorAll('.ftr-support-col') as NodeListOf<HTMLElement>;
    if (supportCols.length >= 1 && col1Links.length > 0) {
      const existingUl1 = supportCols[0].querySelector('ul') as HTMLElement | null;
      if (existingUl1) existingUl1.remove();
      const ul1 = document.createElement('ul');
      ul1.style.cssText = 'list-style:none;padding:0;margin:8px 0 0 0;';
      col1Links.forEach(link => {
        const li = document.createElement('li');
        li.style.marginBottom = '6px';
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.title;
        a.style.cssText = 'color:#bbb;text-decoration:none;font-size:13px;';
        a.target = link.url.startsWith('http') ? '_blank' : '_self';
        a.onmouseenter = () => a.style.textDecoration = 'underline';
        a.onmouseleave = () => a.style.textDecoration = 'none';
        li.appendChild(a);
        ul1.appendChild(li);
      });
      supportCols[0].appendChild(ul1);
    }
    if (supportCols.length >= 2 && col2Links.length > 0) {
      const existingUl2 = supportCols[1].querySelector('ul') as HTMLElement | null;
      if (existingUl2) existingUl2.remove();
      const ul2 = document.createElement('ul');
      ul2.style.cssText = 'list-style:none;padding:0;margin:8px 0 0 0;';
      col2Links.forEach(link => {
        const li = document.createElement('li');
        li.style.marginBottom = '6px';
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.title;
        a.style.cssText = 'color:#bbb;text-decoration:none;font-size:13px;';
        a.target = link.url.startsWith('http') ? '_blank' : '_self';
        a.onmouseenter = () => a.style.textDecoration = 'underline';
        a.onmouseleave = () => a.style.textDecoration = 'none';
        li.appendChild(a);
        ul2.appendChild(li);
      });
      supportCols[1].appendChild(ul2);
    }
    if (supportCols.length >= 3 && col3Links.length > 0) {
      const existingUl3 = supportCols[2].querySelector('ul') as HTMLElement | null;
      if (existingUl3) existingUl3.remove();
      const ul3 = document.createElement('ul');
      ul3.style.cssText = 'list-style:none;padding:0;margin:8px 0 0 0;';
      col3Links.forEach(link => {
        const li = document.createElement('li');
        li.style.marginBottom = '6px';
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.title;
        a.style.cssText = 'color:#bbb;text-decoration:none;font-size:13px;';
        a.target = link.url.startsWith('http') ? '_blank' : '_self';
        a.onmouseenter = () => a.style.textDecoration = 'underline';
        a.onmouseleave = () => a.style.textDecoration = 'none';
        li.appendChild(a);
        ul3.appendChild(li);
      });
      supportCols[2].appendChild(ul3);
    }

    // Título de la columna de newsletter
    const nlTitle = footer.querySelector('.ftr-signup-col .ftr-col-title') as HTMLElement;
    if (nlTitle) nlTitle.textContent = col4Title;

    // Descripción de la empresa (debajo del logo)
    const existingDesc = footer.querySelector('.tpl1-footer-desc') as HTMLElement | null;
    if (existingDesc) existingDesc.remove();
    if (companyDescription) {
      const descEl = document.createElement('p');
      descEl.className = 'tpl1-footer-desc';
      descEl.textContent = companyDescription;
      descEl.style.cssText = 'font-size:13px;line-height:1.6;color:#999;margin-top:8px;max-width:300px;';
      const logoDiv2 = footer.querySelector('.ftr-logo') as HTMLElement;
      if (logoDiv2) logoDiv2.appendChild(descEl);
    }

    // Dirección, email, teléfono, WhatsApp en ftr-addr-info-col
    const addrCol = footer.querySelector('.ftr-addr-info-col ul') as HTMLElement;
    if (addrCol) {
      addrCol.innerHTML = '';

      if (s.address) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Dirección:</strong> ${s.address}`;
        addrCol.appendChild(li);
      }

      if (email) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Email:</strong> <a href="mailto:${email}" style="color:inherit;text-decoration:underline;">${email}</a>`;
        addrCol.appendChild(li);
      }

      if (s.phone) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Teléfono:</strong> <a href="tel:${s.phone.replace(/\s/g, '')}" style="color:inherit;text-decoration:underline;">${s.phone}</a>`;
        addrCol.appendChild(li);
      }

      if (s.whatsapp) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>WhatsApp:</strong> <a href="https://wa.me/${s.whatsapp.replace(/\D/g, '')}" target="_blank" style="color:inherit;text-decoration:underline;">${s.whatsapp}</a>`;
        addrCol.appendChild(li);
      }

      if (s.address) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`;
        a.target = '_blank';
        a.className = 'text-decoration-underline';
        a.innerHTML = 'Ver en Google Maps <i class="fa-solid fa-arrow-right"></i>';
        li.appendChild(a);
        addrCol.appendChild(li);
      }
    }

    // Redes sociales
    const socialIcons = footer.querySelector('.ftr-social-icons') as HTMLElement;
    if (socialIcons) {
      socialIcons.innerHTML = '';
      socialIcons.style.cssText = 'display:flex;gap:15px;margin-top:15px;';

      if (s.instagram) {
        const a = document.createElement('a');
        a.href = `https://instagram.com/${s.instagram.replace('@', '')}`;
        a.target = '_blank';
        a.innerHTML = '<i class="fa-brands fa-instagram" style="font-size:24px;"></i>';
        a.setAttribute('aria-label', 'Instagram');
        socialIcons.appendChild(a);
      }

      if (s.facebook) {
        const a = document.createElement('a');
        a.href = `https://facebook.com/${s.facebook}`;
        a.target = '_blank';
        a.innerHTML = '<i class="fa-brands fa-facebook" style="font-size:24px;"></i>';
        a.setAttribute('aria-label', 'Facebook');
        socialIcons.appendChild(a);
      }

      if (s.tiktok) {
        const a = document.createElement('a');
        a.href = `https://tiktok.com/${s.tiktok.replace('@', '')}`;
        a.target = '_blank';
        a.innerHTML = '<i class="fa-brands fa-tiktok" style="font-size:24px;"></i>';
        a.setAttribute('aria-label', 'TikTok');
        socialIcons.appendChild(a);
      }
    }

    // Links del footer (no modificar - dejar los del template)

    // Newsletter texto
    if (s.newsletterText) {
      const nlText = footer.querySelector('.ftr-signup-col ul li') as HTMLElement;
      if (nlText) nlText.textContent = s.newsletterText;
    }

    // Copyright
    if (s.copyrightText) {
      const copyRow = footer.querySelector('.ftr-copy-row .copyright') as HTMLElement;
      if (copyRow) {
        copyRow.textContent = s.copyrightText;
      } else {
        // Si no existe, crear en ftr-copy-row
        const copyRowDiv = footer.querySelector('.ftr-copy-row') as HTMLElement;
        if (copyRowDiv) {
          const p = document.createElement('p');
          p.className = 'copyright';
          p.textContent = s.copyrightText;
          p.style.cssText = 'text-align:center;margin:0;';
          copyRowDiv.appendChild(p);
        }
      }
    }
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de mapa interactivo (tpl1_map) — ARRIBA del footer ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const mapCfg = sectionCfg.find(s => s.id === 'tpl1_map');
    if (!mapCfg) return;
    const s = mapCfg.settings || {};
    const showMap = s.showMap !== false;

    // Limpiar mapa existente
    const existingMap = document.querySelector('.tpl1-map-section') as HTMLElement | null;
    if (existingMap) existingMap.remove();

    if (!showMap) return;

    const footer = document.querySelector('.musk-main-footer') as HTMLElement | null;
    if (!footer || !footer.parentElement) return;

    const address = s.address || '';
    const mapHeight = s.mapHeight || 280;
    const mapStyle = s.mapStyle || 'dark';
    const mapEmbed = s.mapEmbed || '';

    const mapSection = document.createElement('div');
    mapSection.className = 'tpl1-map-section';

    // Estilos según tema
    const isDark = mapStyle === 'dark';
    const isMinimal = mapStyle === 'minimal';
    const bgColor = isDark ? '#111111' : isMinimal ? '#fafafa' : '#ffffff';
    const textColor = isDark ? '#ffffff' : isMinimal ? '#555555' : '#1a1a1a';
    const subColor = isDark ? '#999999' : isMinimal ? '#888888' : '#666666';
    const accentColor = isDark ? '#ec4899' : isMinimal ? '#6366f1' : '#0d9488';
    const borderColor = isDark ? 'rgba(255,255,255,0.06)' : isMinimal ? '#e5e7eb' : '#f0f0f0';
    const iconBg = isDark ? 'rgba(236,72,153,0.15)' : isMinimal ? 'rgba(99,102,241,0.1)' : 'rgba(13,148,136,0.1)';

    mapSection.style.cssText = `width:100%;background:${bgColor};`;

    function renderMap(addr: string) {
      if (mapEmbed) {
        mapSection.innerHTML = mapEmbed;
        const iframe = mapSection.querySelector('iframe');
        if (iframe) {
          iframe.style.width = '100%';
          iframe.style.height = `${mapHeight}px`;
          iframe.style.display = 'block';
          iframe.style.border = '0';
        }
      } else if (addr) {
        mapSection.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;background:${bgColor};">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:40px;height:40px;border-radius:12px;background:${iconBg};display:flex;align-items:center;justify-content:center;font-size:18px;">📍</div>
              <div>
                <h4 style="color:${textColor};font-size:15px;font-weight:800;margin:0 0 2px;letter-spacing:-0.02em;">Encuéntranos</h4>
                <p style="color:${subColor};font-size:12px;margin:0;line-height:1.4;">${addr}</p>
              </div>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;background:${accentColor};color:#fff;font-size:12px;font-weight:700;text-decoration:none;letter-spacing:0.02em;box-shadow:0 2px 8px ${accentColor}44;transition:transform 0.2s,box-shadow 0.2s;">
              Cómo llegar →
            </a>
          </div>
          <div style="position:relative;border-top:1px solid ${borderColor};">
            <iframe src="https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed" width="100%" height="${mapHeight}" style="border:0;display:block;filter:${isDark ? 'brightness(0.85) contrast(1.1) saturate(0.8)' : isMinimal ? 'grayscale(0.3)' : 'none'};" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            ${isDark ? '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.15) 0%,transparent 30%,transparent 70%,rgba(0,0,0,0.2) 100%);pointer-events:none;"></div>' : ''}
          </div>
          <div class="tpl1-map-visitors" style="padding:12px 24px 16px;background:${bgColor};border-top:1px solid ${borderColor};"></div>
        `;
      }
      if (mapSection.innerHTML && footer) {
        const parent = footer.parentElement;
        if (parent) {
          parent.insertBefore(mapSection, footer);
          // Cargar visitantes recientes
          loadVisitors();
        }
      }
    }

    async function loadVisitors() {
      // Disabled: fetching all visitors directly from Appwrite on every homepage load 
      // caused an O(N^2) explosion in database reads.
      return;
    }

    if (address || mapEmbed) {
      renderMap(address);
    } else {
      // Fallback: leer de store_settings usando la API cacheable
      fetch('/api/store-settings')
        .then(res => res.json())
        .then(settings => {
          const storeAddr = settings.address || '';
          if (storeAddr) renderMap(storeAddr);
        })
        .catch(() => {});
    }
  }, [bodyHtml, sectionCfg]);

  /* ── Aplicar settings de brand logos (tpl1) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const cfg = sectionCfg.find(s => s.id === 'tpl1_brand_logos');
    if (!cfg) return;
    const s = cfg.settings || {};
    const sectionId = 'template--22405132419320__brand_logos_N9XpeF';
    const section = document.querySelector(`[data-section-id="${sectionId}"]`) || document.getElementById(`shopify-section-${sectionId}`);
    if (!section) return;

    // Título
    if (s.title) {
      const existingTitle = section.querySelector('.brand-logos-title') as HTMLElement;
      if (existingTitle) {
        existingTitle.textContent = s.title;
      } else {
        const titleEl = document.createElement('div');
        titleEl.className = 'brand-logos-title';
        titleEl.textContent = s.title;
        titleEl.style.cssText = 'text-align:center;font-size:24px;font-weight:700;margin-bottom:20px;color:#111;';
        const wrapperEl = section.querySelector('.swiper') as HTMLElement;
        if (wrapperEl && wrapperEl.parentElement) {
          wrapperEl.parentElement.insertBefore(titleEl, wrapperEl);
        }
      }
    }

    // Configurar swiper: loop infinito
    const swiperEl = section.querySelector('fuzion-swiper-slider') as HTMLElement;
    if (swiperEl) {
      try {
        const opts = JSON.parse(swiperEl.getAttribute('data-swiper-options') || '{}');
        opts.loop = true; // Loop infinito
        opts.autoplay = { delay: 3000, disableOnInteraction: false };
        opts.centeredSlides = false;
        if (opts.breakpoints) {
          opts.breakpoints['320'] = { ...(opts.breakpoints['320'] || {}), slidesPerView: 2.2, spaceBetween: 16 };
          opts.breakpoints['768'] = { ...(opts.breakpoints['768'] || {}), slidesPerView: 4, spaceBetween: 28 };
          opts.breakpoints['992'] = { ...(opts.breakpoints['992'] || {}), slidesPerView: 5, spaceBetween: 36 };
        }
        swiperEl.setAttribute('data-swiper-options', JSON.stringify(opts));
      } catch { }
    }

    const logos = (s.logos || []) as { url: string; alt?: string; link?: string }[];
    if (logos.length === 0) return;

    const wrapper = section.querySelector('.swiper-wrapper') as HTMLElement;
    if (!wrapper) return;
    const slides = Array.from(wrapper.querySelectorAll('.swiper-slide')) as HTMLElement[];

    // Clonar logos para loop infinito (duplicar array)
    const logosForLoop = [...logos, ...logos, ...logos];

    // Clonar slides si faltan
    while (slides.length < logosForLoop.length) {
      const lastSlide = slides[slides.length - 1];
      const cloned = lastSlide.cloneNode(true) as HTMLElement;
      wrapper.appendChild(cloned);
      slides.push(cloned);
    }

    // Ocultar slides sobrantes
    slides.forEach((slide, idx) => {
      if (idx >= logosForLoop.length) {
        slide.style.display = 'none';
      } else {
        slide.style.display = 'flex';
        slide.style.justifyContent = 'center';
        slide.style.alignItems = 'center';
        slide.style.padding = '8px 12px';
        // Eliminar cualquier efecto de hover blur
        slide.style.filter = 'none';
        slide.style.transition = 'none';
        slide.style.minWidth = '0';
        const logo = logosForLoop[idx];

        // Reemplazar SVG placeholder con imagen real
        if (logo.url) {
          const imgEl = slide.querySelector('.logo-img-item img, img') as HTMLImageElement | null;
          if (imgEl) {
            imgEl.src = logo.url;
            if (logo.alt) imgEl.alt = logo.alt;
            imgEl.style.cssText = 'width:280px;height:168px;min-width:280px;min-height:168px;max-width:min(280px,90vw);object-fit:contain;border-radius:14px;border:1px solid #f3f4f6;background:#fff;padding:14px;box-sizing:border-box;display:block;';
          } else {
            const svgEl = slide.querySelector('.placeholder-svg');
            if (svgEl) {
              const img = document.createElement('img');
              img.src = logo.url;
              img.alt = logo.alt || '';
              img.style.cssText = 'width:280px;height:168px;min-width:280px;min-height:168px;max-width:min(280px,90vw);object-fit:contain;border-radius:14px;border:1px solid #f3f4f6;background:#fff;padding:14px;box-sizing:border-box;display:block;';
              svgEl.replaceWith(img);
            }
          }
        }

        // Agregar link si existe
        if (logo.link && !slide.querySelector('a')) {
          const a = document.createElement('a');
          a.href = logo.link;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.style.cssText = 'display:block;width:100%;height:100%;';
          const content = slide.innerHTML;
          slide.innerHTML = '';
          a.innerHTML = content;
          slide.appendChild(a);
        }
      }
    });
  }, [bodyHtml, sectionCfg]);

  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;

    const LOCKED = ['tpl1_announcement_bar', 'tpl1_hero', 'tpl1_product_widget', 'tpl1_subscribe_popup', 'tpl1_whatsapp_button', 'tpl1_chatbot_button', 'tpl1_footer'];

    applyTpl1SectionsVisibility(sectionCfg, TPL1_SECTION_HTML_MAP);

    // 0a. Apply announcement bar settings
    try {
      const annBarSec = sectionCfg.find(s => s.id === 'tpl1_announcement_bar');
      if (annBarSec && annBarSec.enabled) {
        const annBarEl = document.getElementById('shopify-section-sections--22405132747000__announcement_bar_B8FdRK');
        if (annBarEl) {
          const s = annBarSec.settings || {};
          const mainBar = annBarEl.querySelector('.announcement-bar-main') as HTMLElement;
          const messages = annBarEl.querySelectorAll('.announcement-message') as NodeListOf<HTMLElement>;
          const links = annBarEl.querySelectorAll('.announcement-content-slide a') as NodeListOf<HTMLElement>;

          // Apply padding if specified
          if (s.padding !== undefined && mainBar) {
            mainBar.style.padding = `${s.padding}px`;
          }

          // Apply custom gradient: blanco → rosa pastel → degradado original (default)
          // If user selected a custom gradient, use that instead
          const defaultGradient = 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.96) 12%, #fbcfe8 34%, #f9a8d4 52%, rgba(251, 244, 202, 1) 68%, rgba(252, 218, 188, 1) 84%, rgba(254, 169, 162, 1) 100%)';
          const activeGradient = s.bgGradient || defaultGradient;

          // Apply directly to the announcement bar element
          if (mainBar) {
            mainBar.style.setProperty('background', activeGradient, 'important');
            mainBar.style.setProperty('background-size', '100% 100%', 'important');
          }

          // Inject CSS rule with higher specificity for hero section
          const styleId = 'tpl1-announcement-gradient-style';
          const existingStyle = document.getElementById(styleId);
          if (existingStyle) existingStyle.remove(); // Refresh with current gradient
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
          /* Hero section para mantener consistencia con esquinas redondeadas */
          #shopify-section-template--22405132419320__hero_banner_R6iEJ4 {
            background: ${activeGradient} !important;
          }
          #shopify-section-template--22405132419320__hero_banner_R6iEJ4 .musk-main-banner {
            background: ${activeGradient} !important;
          }
          #shopify-section-template--22405132419320__hero_banner_R6iEJ4 .swiper-wrapper {
            background: ${activeGradient} !important;
          }
        `;
          document.head.appendChild(style);

          // If no custom styles, restore original and skip
          const hasCustomStyles = s.bgGradient || s.bgColor || s.textColor || s.textSize || s.textGradientStyle || s.title || s.buttonLink;
          if (!hasCustomStyles) {
            // whiteGradient already applied above, no need to restore original
            messages.forEach(msg => {
              msg.style.removeProperty('color');
              msg.style.removeProperty('font-size');
              msg.style.removeProperty('background');
              msg.style.removeProperty('background-size');
              msg.style.removeProperty('background-clip');
              msg.style.removeProperty('-webkit-background-clip');
              msg.style.removeProperty('-webkit-text-fill-color');
              msg.style.removeProperty('animation');
            });
          } else {
            // Background: gradient or solid color
            // Helper: apply bg to hero section + inner banner for rounded corners (with !important to override color-scheme)
            const applyBgToHero = (bg: string) => {
              const heroSection = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
              if (heroSection) {
                heroSection.style.setProperty('background', bg, 'important');
                const heroInner = heroSection.querySelector('.musk-main-banner') as HTMLElement;
                if (heroInner) heroInner.style.setProperty('background', bg, 'important');
                const swiperWrap = heroSection.querySelector('.swiper-wrapper') as HTMLElement;
                if (swiperWrap) swiperWrap.style.setProperty('background', bg, 'important');
              }
              const parentSection = annBarEl.parentElement as HTMLElement;
              if (parentSection) parentSection.style.setProperty('background', bg, 'important');
            };

            // Apply hover effects to messages
            const hoverEffect = s.textHoverEffect || 'none';
            messages.forEach(msg => {
              msg.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
              msg.style.cursor = 'pointer';
              switch (hoverEffect) {
                case 'fall':
                  msg.onmouseenter = () => msg.style.transform = 'translateY(4px)';
                  msg.onmouseleave = () => msg.style.transform = 'translateY(0)';
                  break;
                case 'bounce':
                  msg.onmouseenter = () => msg.style.transform = 'translateY(-4px)';
                  msg.onmouseleave = () => msg.style.transform = 'translateY(0)';
                  break;
                case 'wave':
                  msg.onmouseenter = () => msg.style.transform = 'rotate(5deg)';
                  msg.onmouseleave = () => msg.style.transform = 'rotate(0deg)';
                  break;
                case 'shake':
                  msg.onmouseenter = () => {
                    msg.style.animation = 'shake 0.3s ease-in-out';
                    if (!document.getElementById('tpl1-shake-kf')) {
                      const style = document.createElement('style');
                      style.id = 'tpl1-shake-kf';
                      style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}';
                      document.head.appendChild(style);
                    }
                  };
                  msg.onmouseleave = () => msg.style.animation = '';
                  break;
                default:
                  msg.onmouseenter = null;
                  msg.onmouseleave = null;
              }
            });

            if (mainBar) {
              if (s.bgGradient) {
                // Usar el degradado seleccionado por el usuario
                mainBar.style.setProperty('background', s.bgGradient, 'important');
                mainBar.style.backgroundSize = '100% 100%';
                applyBgToHero(s.bgGradient);
                if (s.gradientAnimated) {
                  mainBar.style.animation = 'abar-flow 4s ease infinite';
                  if (!document.getElementById('abar-flow-kf')) {
                    const style = document.createElement('style');
                    style.id = 'abar-flow-kf';
                    style.textContent = '@keyframes abar-flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}';
                    document.head.appendChild(style);
                  }
                } else {
                  mainBar.style.animation = 'none';
                }
                // Auto-set text color for dark presets if no textColor specified
                if (!s.textColor) {
                  const isDark = s.bgGradient.includes('#0a0a0a') || s.bgGradient.includes('#1a1a1a') || s.bgGradient.includes('#2d2d2d') || s.bgGradient.includes('#1e293b') || s.bgGradient.includes('#18181b') || s.bgGradient.includes('#27272a') || s.bgGradient.includes('#334155') || s.bgGradient.includes('#3d3d3d');
                  if (isDark) {
                    messages.forEach(msg => { msg.style.color = '#ffffff'; });
                  } else {
                    messages.forEach(msg => { msg.style.removeProperty('color'); });
                  }
                }
              } else if (s.bgColor) {
                mainBar.style.setProperty('background', s.bgColor, 'important');
                mainBar.style.animation = 'none';
                applyBgToHero(s.bgColor);
              }
            }

            // Text content
            if (s.title) {
              messages.forEach(msg => { msg.textContent = s.title || ''; });
            }

            // Text color
            if (s.textColor) {
              messages.forEach(msg => { msg.style.color = s.textColor || ''; });
            }

            // Text size
            if (s.textSize) {
              messages.forEach(msg => { msg.style.fontSize = s.textSize + 'px'; });
            }

            // Text gradient
            if (s.textGradientStyle) {
              messages.forEach(msg => {
                msg.style.background = s.textGradientStyle || '';
                msg.style.backgroundSize = '300% 100%';
                msg.style.backgroundClip = 'text';
                msg.style.webkitBackgroundClip = 'text';
                msg.style.webkitTextFillColor = 'transparent';
                msg.style.color = 'transparent';
                if (s.textGradientAnimated) {
                  msg.style.animation = 'abar-flow 3s ease infinite';
                }
              });
            } else {
              messages.forEach(msg => {
                msg.style.removeProperty('background');
                msg.style.removeProperty('background-size');
                msg.style.removeProperty('background-clip');
                msg.style.removeProperty('-webkit-background-clip');
                msg.style.removeProperty('-webkit-text-fill-color');
                msg.style.removeProperty('animation');
                if (s.textColor) msg.style.color = s.textColor;
              });
            }

            // Link
            if (s.buttonLink) {
              links.forEach(a => { a.setAttribute('href', s.buttonLink || ''); });
            }
          }
        }
      }
    } catch (e) { console.error('[TPL1] Error in announcement bar:', e); }

    console.log('[TPL1] Finished announcement bar, about to search for tpl1_hero section...');
    // 0a2. Apply hero banner settings
    // Ensure pink bg on hero wrapper while content loads (CSS variables override handles the gray)
    const heroElEarly = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
    if (heroElEarly) {
      heroElEarly.classList.remove('tpl1-hero-ready');
    }
    const heroSec = sectionCfg.find(s => s.id === 'tpl1_hero');
    if (heroSec && heroSec.enabled) {
      const heroEl = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
      if (heroEl) {
        const hs = heroSec.settings || {};

        // Define Kenia's promotional slide as herobanner 2
        const KENIA_PHONE = '56936599658';
        const KENIA_WA_URL = `https://wa.me/${KENIA_PHONE}?text=${encodeURIComponent('REGISTRATE CON KENIA')}`;
        const KENIA_IMG_PC = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1781734075685-pegada-1781734073035.png?GoogleAccessId=firebase-adminsdk-fbsvc%40asistoraerp.iam.gserviceaccount.com&Expires=16730334000&Signature=pB3phWWaO5gjCrm5MDeTa4B9yJRxBCfQZZl0hKH8AgvxRAt%2FyIFq1WO3HgT37USBj6GGa9rdB%2Fpq1JSHcoqESCJJdGfG0fY1Nk3UAaHcGWz52EWY1IyW5KUdVmJaAV%2FM2NQTyc4hKr4iwdzibIXrTufp1DiF6HXBkHBRmj1XlsRgBHBgcHnEK7DhNpfuqAjBECpBzIOd0UDKeFbQIaZ2g1JkiWTlUESTS2KnC%2B8A%2FRFbhNy0Q0DvKFkrALylkbR8S39QD%2FFCwuwSA5Qiqyvnuko5FB6MfQuQVmIl51cE%2BveXDd1F2yU6WlaRZCJ4%2BWrR%2FR0phLnbS1GK6PICYm%2BK7Q%3D%3D';
        const KENIA_IMG_MOBILE = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1781734384924-pegada-1781734383088.png?GoogleAccessId=firebase-adminsdk-fbsvc%40asistoraerp.iam.gserviceaccount.com&Expires=16730334000&Signature=vgk%2BhBwoekrfTywuMo4ksekSlWku11fqOigNF3acuZBd4QnkvzpEO%2FtYtJvd1R0dMspS7HsDmjJK6Ph8Tz78L7dUh2IBCDz0yupBP3TtQdDURnXpuzhSGdGzjoCmExz%2BDeMvp8625Vj0LQmZDEMx2Oy0h8j59p%2FCcEr1e3y7RIFueedOKuo8rQxSw%2BDkLaQBd9f1I8t%2FlpmaWjVXl6qPmcX8rMvPtO%2Fk6Saupukz1iWy1byR3Q66SayYKr2ofcBnE3zPpzJ3CgOrexAq1h4%2FQjBjZjbiw%2Fbfbq8LSR9gWj8WkAbDOem%2FgGGXQKBRlYJN77IMX9d0Syu9q4jOZRKt1g%3D%3D';

        const keniaSlide = {
          imageUrl: KENIA_IMG_PC,
          mobileImageUrl: KENIA_IMG_MOBILE,
          title: '',
          subtitle: '',
          description: '',
          btnPrimaryText: '',
          btnPrimaryLink: '',
          btnSecondaryText: '',
          btnSecondaryLink: '',
          alignment: 'center' as const,
          buttonLink: KENIA_WA_URL,
        };

        const slides = [...(hs.heroSlides || [])];
        if (keniaEnabled) {
          if (slides.length < 2) {
            slides.push(keniaSlide);
          } else {
            slides[1] = {
              ...slides[1],
              imageUrl: KENIA_IMG_PC,
              mobileImageUrl: KENIA_IMG_MOBILE,
              buttonLink: KENIA_WA_URL,
              title: '',
              subtitle: '',
              description: '',
              btnPrimaryText: '',
              btnPrimaryLink: '',
              btnSecondaryText: '',
              btnSecondaryLink: '',
            };
          }
        }

        const swiperSlides = heroEl.querySelectorAll('.swiper-slide') as NodeListOf<HTMLElement>;

        // Apply autoplay/delay/speed via swiper options
        const originalSliderEl = heroEl.querySelector('fuzion-hero-banner-slider') as HTMLElement;
        if (originalSliderEl && (window as any).Swiper) {
          try {
            // Destroy the old Swiper instance FIRST so it cleans up duplicates and styles
            const oldSw = (originalSliderEl as any).slider || (originalSliderEl as any).swiper || (originalSliderEl.querySelector('.swiper') as any)?.swiper;
            if (oldSw && typeof oldSw.destroy === 'function') {
              try { oldSw.destroy(true, true); } catch (e) { }
            }

            // Bypass the buggy Fuzion custom element entirely by converting it to a div
            let sliderEl = originalSliderEl;
            if (originalSliderEl.tagName.toLowerCase() === 'fuzion-hero-banner-slider') {
              const newDiv = document.createElement('div');
              newDiv.className = originalSliderEl.className;
              if (!newDiv.classList.contains('swiper')) newDiv.classList.add('swiper');
              // Remove the fade class to ensure it can slide normally
              newDiv.classList.remove('swiper-fade', 'swiper-effect-fade');
              
              // Move all children directly to preserve existing DOM node references!
              while (originalSliderEl.firstChild) {
                newDiv.appendChild(originalSliderEl.firstChild);
              }
              
              originalSliderEl.replaceWith(newDiv);
              sliderEl = newDiv;
            }

            // Force loop, autoplay, and touch settings globally when multiple slides exist
            const shouldAutoplay = hs.heroAutoplay !== false;
            const hasMultiple = slides.length > 1;

            const swiperConfig: any = {
              slidesPerView: 1,
              spaceBetween: 0,
              loop: hasMultiple,
              speed: hs.heroTransitionSpeed || 1000,
              effect: 'slide', // Slide effect globally for proper swiping
              allowTouchMove: true,
              simulateTouch: true,
              followFinger: true,
              touchEventsTarget: 'wrapper',
              watchOverflow: !hasMultiple,
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              },
              pagination: false
            };

            if (hasMultiple && shouldAutoplay) {
              swiperConfig.autoplay = {
                delay: hs.heroDelay || 5000,
                disableOnInteraction: false
              };
            } else {
              swiperConfig.autoplay = false;
            }

            // Initialize a fresh, pure Swiper instance
            const newSwiper = new (window as any).Swiper(sliderEl, swiperConfig);
            (sliderEl as any).swiper = newSwiper;

            // Aggressive watchdog: keep swiping if it gets stuck
            const watchdog = () => {
              if (newSwiper && hasMultiple) {
                newSwiper.params.allowTouchMove = true;
                newSwiper.allowTouchMove = true;
                if (shouldAutoplay && (!newSwiper.autoplay || !newSwiper.autoplay.running)) {
                  try { newSwiper.autoplay.start(); } catch {}
                }
              }
            };
            setTimeout(watchdog, 1000);
            setTimeout(watchdog, 3000);

          } catch (err) {
            console.error('[TPL1] Nuclear Swiper init failed:', err);
          }
        }


        // Apply slide content
        const overlayOpacity = hs.heroOverlayOpacity ?? 0.3;
        const overlayEnabled = hs.heroOverlayEnabled ?? true;
        const titleOpacity = hs.heroTitleOpacity ?? 0.92;
        const subtitleOpacity = hs.heroSubtitleOpacity ?? titleOpacity;
        const titleColor = hs.heroTitleColor ?? '';
        const subtitleColor = hs.heroSubtitleColor ?? '';
        const storeName = hs.heroStoreName ?? '';
        console.log('[TPL1 Hero] storeName:', storeName, 'logoMode:', hs.heroStoreLogoMode);

        // Apply store name to document title
        document.title = storeName;

        // Apply overlay and opacity even without slides
        if (!document.getElementById('tpl1-hero-overlay-style')) {
          const style = document.createElement('style');
          style.id = 'tpl1-hero-overlay-style';
          document.head.appendChild(style);
        }
        const overlayStyle = document.getElementById('tpl1-hero-overlay-style')!;
        if (!overlayEnabled) {
          overlayStyle.textContent = `
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::before,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::after,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::before,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::after,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::before,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::after { background: transparent !important; background-image: none !important; }
          `;
        } else if (overlayOpacity === 0) {
          overlayStyle.textContent = `
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::before,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::after,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::before,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::after,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::before,
            [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::after { background: transparent !important; background-image: none !important; }
          `;
        } else {
          overlayStyle.textContent = '';
        }

        swiperSlides.forEach(slide => {
          // Apply title/subtitle opacity and color
          const titleEl = slide.querySelector('.banner-main-title') as HTMLElement | null;
          if (titleEl) {
            titleEl.style.opacity = String(titleOpacity);
            if (titleColor) {
              titleEl.style.setProperty('color', titleColor, 'important');
              titleEl.style.setProperty('-webkit-text-fill-color', titleColor, 'important');
            }
          }
          const subEl = slide.querySelector('.banner-fancy-sub-head') as HTMLElement | null;
          if (subEl) {
            subEl.style.opacity = String(subtitleOpacity);
            subEl.style.fontWeight = '800';
            if (subtitleColor) {
              subEl.style.color = subtitleColor;
            }
          }
        });

        // Apply store name or logo to navbar (always apply, even without slides)
        const logoMode = hs.heroStoreLogoMode ?? 'text';
        const logoUrl = hs.heroStoreLogoUrl || '';
        const scrollLogoUrl = hs.heroStoreLogoScrollUrl || logoUrl;
        const logoHeight = hs.heroStoreLogoHeight ?? 40;
        const logoPosX = hs.heroStoreLogoPosX ?? 0;
        const logoPosY = hs.heroStoreLogoPosY ?? 0;

        const lightLogos = document.querySelectorAll('.light-logo') as NodeListOf<HTMLElement>;
        const lightLogoSpans = document.querySelectorAll('.light-logo span') as NodeListOf<HTMLElement>;
        const darkLogos = document.querySelectorAll('.dark-logo') as NodeListOf<HTMLElement>;
        const darkLogoSpans = document.querySelectorAll('.dark-logo span') as NodeListOf<HTMLElement>;

        if (logoMode === 'text') {
          lightLogoSpans.forEach(span => { span.textContent = storeName; span.style.display = ''; span.style.setProperty('color', '#ffffff', 'important'); });
          darkLogoSpans.forEach(span => { span.textContent = storeName; span.style.display = ''; span.style.setProperty('color', '#ffffff', 'important'); });
          [...lightLogos, ...darkLogos].forEach(logo => {
            const img = logo.querySelector('img');
            if (img) img.style.display = 'none';
            logo.style.removeProperty('display');
            logo.style.removeProperty('align-items');
            logo.style.removeProperty('max-height');
            logo.style.removeProperty('height');
            logo.style.removeProperty('overflow');
          });
        } else if (logoUrl) {
          const applyLogoImg = (containers: NodeListOf<HTMLElement>, imgUrl: string) => {
            containers.forEach(logo => {
              const spans = logo.querySelectorAll('span');
              spans.forEach(span => (span as HTMLElement).style.display = 'none');

              let img = logo.querySelector('img') as HTMLImageElement;
              if (!img) {
                img = document.createElement('img');
                img.alt = storeName;
                logo.appendChild(img);
              }
              img.src = imgUrl;
              img.style.setProperty('max-height', 'none', 'important');
              img.style.setProperty('height', 'auto', 'important');
              img.style.setProperty('width', 'auto', 'important');
              img.style.setProperty('object-fit', 'contain', 'important');
              const scale = logoHeight / 40;
              const translateX = logoPosX;
              const translateY = logoPosY;
              img.style.setProperty('transform', `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`, 'important');
              img.style.setProperty('transform-origin', 'left center', 'important');
              img.style.display = '';
              logo.style.removeProperty('display');
              logo.style.removeProperty('align-items');
              logo.style.removeProperty('max-height');
              logo.style.removeProperty('height');
              logo.style.removeProperty('overflow');
            });
          };
          applyLogoImg(lightLogos, logoUrl);
          applyLogoImg(darkLogos, scrollLogoUrl);
        }

        // ── Mobile hero logo (centered, visible only on mobile) ──
        const mobileLogoH = hs.heroStoreLogoMobileHeight ?? 30;
        const desktopLogoH = hs.heroStoreLogoHeight ?? 40;
        if (!document.getElementById('tpl1-hero-mobile-logo')) {
          const mStyle = document.createElement('style');
          mStyle.id = 'tpl1-hero-mobile-logo-style';
          mStyle.textContent = `
            .tpl1-hero-mobile-logo { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; pointer-events: none; }
            .tpl1-hero-mobile-logo img { max-width: ${mobileLogoH * 3.5}px; max-height: ${mobileLogoH}px; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)); }
            @media (max-width: 768px) { .tpl1-hero-mobile-logo { display: block; } }
          `;
          document.head.appendChild(mStyle);

          const heroEl = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
          if (heroEl) {
            const logoDiv = document.createElement('div');
            logoDiv.className = 'tpl1-hero-mobile-logo';
            logoDiv.id = 'tpl1-hero-mobile-logo';
            if (logoUrl) {
              logoDiv.innerHTML = `<img src="${logoUrl}" alt="${storeName}" />`;
            } else {
              logoDiv.innerHTML = `<span style="font-size:22px;font-weight:800;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,0.4);letter-spacing:-0.02em;font-family:Syne,sans-serif">${storeName}</span>`;
            }
            heroEl.style.position = 'relative';
            heroEl.appendChild(logoDiv);
          }
        } else {
          // Update existing mobile logo + style
          const mStyle = document.getElementById('tpl1-hero-mobile-logo-style');
          if (mStyle) mStyle.textContent = `
            .tpl1-hero-mobile-logo { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; pointer-events: none; }
            .tpl1-hero-mobile-logo img { max-width: ${mobileLogoH * 3.5}px; max-height: ${mobileLogoH}px; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)); }
            @media (max-width: 768px) { .tpl1-hero-mobile-logo { display: block; } }
          `;
          const existingLogo = document.getElementById('tpl1-hero-mobile-logo');
          if (existingLogo) {
            if (logoUrl) {
              existingLogo.innerHTML = `<img src="${logoUrl}" alt="${storeName}" />`;
            } else {
              existingLogo.innerHTML = `<span style="font-size:${Math.max(mobileLogoH * 0.55, 14)}px;font-weight:800;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,0.4);letter-spacing:-0.02em;font-family:Syne,sans-serif">${storeName}</span>`;
            }
          }
        }

        // Apply slide content if slides exist
        if (slides && slides.length > 0) {

          // Inject or update CSS rule for transparent overlay
          if (!document.getElementById('tpl1-hero-overlay-style')) {
            const style = document.createElement('style');
            style.id = 'tpl1-hero-overlay-style';
            document.head.appendChild(style);
          }
          const overlayStyle = document.getElementById('tpl1-hero-overlay-style')!;
          // Always apply transparent background when overlay is disabled OR opacity is 0
          if (!overlayEnabled) {
            overlayStyle.textContent = `
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::before,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::after,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::before,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::after,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::before,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::after { background: transparent !important; background-image: none !important; }
            `;
          } else if (overlayOpacity === 0) {
            overlayStyle.textContent = `
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::before,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide::after,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::before,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .swiper-slide .slide-image::after,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::before,
              [data-section-id="template--22405132419320__hero_banner_R6iEJ4"] .contrass-bg::after { background: transparent !important; background-image: none !important; }
            `;
          } else {
            overlayStyle.textContent = '';
          }

          swiperSlides.forEach(slide => {
            // Always remove existing overlay div (both tpl1-hero-overlay and tpl1-hero-white-overlay)
            const existingOverlay = slide.querySelector('.tpl1-hero-overlay');
            if (existingOverlay) existingOverlay.remove();
            const existingWhiteOverlay = slide.querySelector('.tpl1-hero-white-overlay');
            if (existingWhiteOverlay) existingWhiteOverlay.remove();

            // Apply transparent background when overlay is disabled
            if (!overlayEnabled) {
              // Remove contrass-bg class to remove CSS background
              slide.classList.remove('contrass-bg');
              // Set inline background to transparent with !important
              slide.style.setProperty('background', 'transparent', 'important');
              slide.style.setProperty('background-image', 'none', 'important');
              slide.style.setProperty('filter', 'none', 'important');
              const slideImage = slide.querySelector('.slide-image') as HTMLElement;
              if (slideImage) {
                slideImage.style.setProperty('background', 'transparent', 'important');
                slideImage.style.setProperty('background-image', 'none', 'important');
                slideImage.style.setProperty('filter', 'none', 'important');
              }
              const heroSection = heroEl.querySelector('.musk-main-banner') as HTMLElement;
              if (heroSection) {
                heroSection.style.setProperty('background', 'transparent', 'important');
                heroSection.style.setProperty('background-image', 'none', 'important');
                heroSection.style.setProperty('filter', 'none', 'important');
              }
            } else {
              // Restore contrass-bg class when overlay is enabled
              if (!slide.classList.contains('contrass-bg')) slide.classList.add('contrass-bg');
              slide.style.removeProperty('background');
              slide.style.removeProperty('background-image');
              slide.style.removeProperty('filter');
              const slideImage = slide.querySelector('.slide-image') as HTMLElement;
              if (slideImage) {
                slideImage.style.removeProperty('background');
                slideImage.style.removeProperty('background-image');
                slideImage.style.removeProperty('filter');
              }
              const heroSection = heroEl.querySelector('.musk-main-banner') as HTMLElement;
              if (heroSection) {
                heroSection.style.removeProperty('background');
                heroSection.style.removeProperty('background-image');
                heroSection.style.removeProperty('filter');
              }
            }

            // Create new overlay ONLY if enabled AND opacity > 0
            if (overlayEnabled && overlayOpacity > 0) {
              const overlay = document.createElement('div');
              overlay.className = 'tpl1-hero-overlay';
              overlay.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,${overlayOpacity});z-index:1;pointer-events:none;`;
              slide.insertBefore(overlay, slide.firstChild);
            }

            // Apply title opacity
            const titleEl = slide.querySelector('.banner-main-title') as HTMLElement;
            if (titleEl) {
              titleEl.style.opacity = String(titleOpacity);
            }

            // Apply subtitle opacity and font-weight
            const subEl = slide.querySelector('.banner-fancy-sub-head') as HTMLElement;
            if (subEl) {
              subEl.style.opacity = String(subtitleOpacity);
              subEl.style.fontWeight = '800';
            }
          });

          slides.forEach((sl, idx) => {
            if (idx >= swiperSlides.length) return;
            const slide = swiperSlides[idx];

            // Video or Image (with mobile fallback)
            const isMobile = window.innerWidth <= 767;
            const activeVideoUrl = (isMobile && sl.mobileVideoUrl) ? sl.mobileVideoUrl : sl.videoUrl;
            const activeImageUrl = (isMobile && sl.mobileImageUrl) ? sl.mobileImageUrl : sl.imageUrl;

            if (activeVideoUrl) {
              const slideImg = slide.querySelector('.slide-image__img') as HTMLImageElement;
              if (slideImg) {
                if (activeImageUrl) {
                  slideImg.src = activeImageUrl;
                  slideImg.alt = sl.title || '';
                }
                slideImg.style.display = '';
                slideImg.style.opacity = '1';
                slideImg.style.transition = 'opacity 0.45s ease';
              }

              let video = slide.querySelector('.tpl1-hero-video') as HTMLVideoElement;
              if (!video) {
                video = document.createElement('video');
                video.className = 'tpl1-hero-video';
                video.muted = true;
                video.autoplay = false;
                video.playsInline = true;
                video.loop = true;
                video.preload = 'none';
                video.setAttribute('playsinline', '');
                video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0;transition:opacity 0.45s ease;';
                slide.appendChild(video);
              }

              const showVideo = () => {
                video.style.opacity = '1';
                video.style.display = '';
                if (slideImg) slideImg.style.opacity = '0';
                video.play().catch(() => { });
              };

              video.onloadeddata = showVideo;
              video.oncanplay = showVideo;
              video.onerror = () => {
                video.style.opacity = '0';
                if (slideImg) {
                  slideImg.style.display = '';
                  slideImg.style.opacity = '1';
                }
              };

              if (activeImageUrl) video.poster = activeImageUrl;
              if (video.src !== activeVideoUrl) {
                video.style.opacity = '0';
                video.src = activeVideoUrl;
                video.load();
              } else if (video.readyState >= 2) {
                showVideo();
              }
            } else {
              // Show image, hide video if exists
              const slideImg = slide.querySelector('.slide-image__img') as HTMLImageElement;
              if (slideImg) {
                if (activeImageUrl) {
                  // Fade-in transition: hide, set src, reveal on load
                  slideImg.style.transition = 'opacity 0.8s ease';
                  slideImg.style.opacity = '0';
                  const onLoad = () => {
                    slideImg.style.opacity = '1';
                    slideImg.removeEventListener('load', onLoad);
                  };
                  slideImg.addEventListener('load', onLoad);
                  slideImg.src = activeImageUrl;
                  slideImg.alt = sl.title || '';
                  // If already cached, trigger immediately
                  if (slideImg.complete) {
                    slideImg.removeEventListener('load', onLoad);
                    slideImg.style.opacity = '1';
                  }
                }
                slideImg.style.display = '';
              }
              const video = slide.querySelector('.tpl1-hero-video') as HTMLVideoElement;
              if (video) video.style.display = 'none';
            }

            // Title
            if (sl.title) {
              const titleEl = slide.querySelector('.banner-main-title') as HTMLElement;
              if (titleEl) titleEl.textContent = sl.title;
            }

            // Subtitle
            if (sl.subtitle) {
              const subEl = slide.querySelector('.banner-fancy-sub-head') as HTMLElement;
              if (subEl) subEl.textContent = sl.subtitle;
            }

            // Description
            const descEl = slide.querySelector('.banner-slide-para') as HTMLElement;
            if (sl.description) {
              if (descEl) {
                descEl.textContent = sl.description;
                descEl.style.display = '';
              }
            } else if (descEl) {
              descEl.style.display = 'none';
            }

            // Buttons
            const btnRow = slide.querySelector('.banner-btn-row') as HTMLElement;
            if (btnRow) {
              const primaryBtn = btnRow.querySelector('.button_primary a') as HTMLAnchorElement;
              const secondaryBtn = btnRow.querySelector('.button_secondary a') as HTMLAnchorElement;

              if (sl.btnPrimaryText && primaryBtn) {
                primaryBtn.textContent = sl.btnPrimaryText;
                if (sl.btnPrimaryLink) primaryBtn.href = sl.btnPrimaryLink;
                (primaryBtn.closest('.button_primary') as HTMLElement).style.display = '';
              } else if (primaryBtn) {
                (primaryBtn.closest('.button_primary') as HTMLElement).style.display = 'none';
              }

              if (sl.btnSecondaryText && secondaryBtn) {
                secondaryBtn.textContent = sl.btnSecondaryText;
                if (sl.btnSecondaryLink) secondaryBtn.href = sl.btnSecondaryLink;
                (secondaryBtn.closest('.button_secondary') as HTMLElement).style.display = '';
              } else if (secondaryBtn) {
                (secondaryBtn.closest('.button_secondary') as HTMLElement).style.display = 'none';
              }
            }

            // Alignment
            if (sl.alignment) {
              slide.classList.remove('center-content', 'left-content', 'right-content');
              slide.classList.add(`${sl.alignment}-content`);
            }

            // Whole-slide click handler (e.g. for Kenia banner)
            if (sl.buttonLink) {
              slide.style.cursor = 'pointer';
              slide.onclick = (e) => {
                const target = e.target as HTMLElement;
                if (target.closest('a') && target.closest('a') !== slide) {
                  return;
                }
                window.open(sl.buttonLink, '_blank');
              };
            } else {
              slide.style.cursor = '';
              slide.onclick = null;
            }
          });

          // Hide extra slides if fewer than original
          for (let i = slides.length; i < swiperSlides.length; i++) {
            swiperSlides[i].style.display = 'none';
          }
          // Show slides that were previously hidden
          for (let i = 0; i < Math.min(slides.length, swiperSlides.length); i++) {
            swiperSlides[i].style.display = '';
          }

          const applyHeroMobileLock = () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (!heroEl) return;
            if (isMobile && slides.length <= 1) {
              heroEl.classList.add('tpl1-hero-mobile-locked');
              swiperSlides.forEach((slide, i) => {
                slide.style.display = i === 0 ? '' : 'none';
              });
              const lockSwiper = () => {
                const slider = heroEl.querySelector('fuzion-hero-banner-slider') as HTMLElement & { swiper?: { allowTouchMove: boolean; autoplay?: { stop?: () => void }; disable?: () => void; touchRatio?: number } };
                const sw = slider?.swiper || (heroEl.querySelector('.swiper') as HTMLElement & { swiper?: typeof slider.swiper })?.swiper;
                if (sw) {
                  sw.allowTouchMove = false;
                  sw.touchRatio = 0;
                  sw.autoplay?.stop?.();
                  try { sw.disable?.(); } catch { /* ignore */ }
                }
              };
              lockSwiper();
              [400, 900, 1200, 2200, 3500].forEach((ms) => setTimeout(lockSwiper, ms));
              const sliderEl = heroEl.querySelector('fuzion-hero-banner-slider');
              sliderEl?.addEventListener?.('swiper:init', lockSwiper as EventListener);
              sliderEl?.addEventListener?.('swiper:ready', lockSwiper as EventListener);
            } else {
              heroEl.classList.remove('tpl1-hero-mobile-locked');
              swiperSlides.forEach((slide, i) => {
                if (i < slides.length) {
                  slide.style.display = '';
                } else {
                  slide.style.display = 'none';
                }
              });
              const unlockSwiper = () => {
                const slider = heroEl.querySelector('fuzion-hero-banner-slider') as HTMLElement & { swiper?: { allowTouchMove: boolean; autoplay?: { start?: () => void }; enable?: () => void; touchRatio?: number } };
                const sw = slider?.swiper || (heroEl.querySelector('.swiper') as HTMLElement & { swiper?: typeof slider.swiper })?.swiper || (slider as any)?.slider;
                if (sw) {
                  sw.allowTouchMove = true;
                  sw.touchRatio = 1;
                  try { sw.enable?.(); } catch { /* ignore */ }
                  const shouldAutoplay = hs.heroAutoplay !== false;
                  if (shouldAutoplay && slides.length > 1) {
                    try { sw.autoplay?.start?.(); } catch { /* ignore */ }
                  }
                }
              };
              unlockSwiper();
              [400, 900, 1200, 2200, 3500].forEach((ms) => setTimeout(unlockSwiper, ms));
            }
          };
          applyHeroMobileLock();
          window.addEventListener('resize', applyHeroMobileLock);

          // Video visibility observer: pause when off-screen, restart when visible (PC only — skip on mobile)
          const heroSection = document.querySelector('[data-section-id="template--22405132419320__hero_banner_R6iEJ4"]') || document.querySelector('.musk-main-banner');
          if (heroSection && !document.getElementById('tpl1-hero-video-observer') && window.innerWidth > 768) {
            const marker = document.createElement('div');
            marker.id = 'tpl1-hero-video-observer';
            marker.style.display = 'none';
            document.body.appendChild(marker);
            const videoObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                const videos = heroSection.querySelectorAll('.tpl1-hero-video') as NodeListOf<HTMLVideoElement>;
                videos.forEach(video => {
                  if (entry.isIntersecting) {
                    video.currentTime = 0;
                    video.play().catch(() => { });
                  } else {
                    video.pause();
                    video.currentTime = 0;
                  }
                });
              });
            }, { threshold: 0.1 });
            videoObserver.observe(heroSection);
          }
        }
      }
    }

    // 0a3. Hero title animation (only once per page visit)
    const heroSecForAnim = sectionCfg.find(s => s.id === 'tpl1_hero');
    const heroAnimSettings = heroSecForAnim?.settings || {};
    const heroAnimType = heroAnimSettings.heroTitleAnimation || 'typing';
    if (heroAnimType !== 'none' && !(window as unknown as Record<string, unknown>).__heroAnimDone) {
      (window as unknown as Record<string, unknown>).__heroAnimDone = true;
      const heroElForAnim = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
      if (heroElForAnim) {
        // Remove previous animation style if exists
        const prevAnimStyle = document.getElementById('tpl1-hero-title-anim-style');
        if (prevAnimStyle) prevAnimStyle.remove();

        const titleEls = heroElForAnim.querySelectorAll('.banner-main-title') as NodeListOf<HTMLElement>;
        titleEls.forEach(titleEl => {
          // Reset any previous animation state
          gsap.killTweensOf(titleEl);
          titleEl.style.visibility = 'visible';
          titleEl.style.opacity = '';
          titleEl.style.transform = '';
          titleEl.style.filter = '';
          // Remove any leftover cursor or span wrappers
          titleEl.querySelectorAll('.tpl1-anim-cursor, .tpl1-anim-char').forEach(e => e.remove());
          // Restore original text if it was split
          const orig = titleEl.getAttribute('data-orig-text');
          if (orig) { titleEl.textContent = orig; titleEl.removeAttribute('data-orig-text'); }
        });

        titleEls.forEach(titleEl => {
          const text = titleEl.textContent || '';
          if (!text) return;

          switch (heroAnimType) {
            case 'typing': {
              titleEl.setAttribute('data-orig-text', text);
              titleEl.textContent = '';
              titleEl.style.visibility = 'visible';
              // Add blinking cursor
              const cursor = document.createElement('span');
              cursor.className = 'tpl1-anim-cursor';
              cursor.textContent = '|';
              cursor.style.cssText = 'color:inherit;font-weight:100;animation:tpl1Blink 0.6s step-end infinite;';
              titleEl.appendChild(cursor);
              // Add cursor blink keyframes
              if (!document.getElementById('tpl1-hero-cursor-style')) {
                const s = document.createElement('style');
                s.id = 'tpl1-hero-cursor-style';
                s.textContent = '@keyframes tpl1Blink{0%,100%{opacity:1}50%{opacity:0}}';
                document.head.appendChild(s);
              }
              // Animate character by character
              const chars = text.split('');
              chars.forEach((ch, i) => {
                gsap.delayedCall(0.08 * (i + 1), () => {
                  cursor.before(ch);
                });
              });
              // Remove cursor after typing finishes
              gsap.delayedCall(0.08 * chars.length + 1.5, () => { cursor.remove(); });
              break;
            }
            case 'fadeIn': {
              gsap.fromTo(titleEl, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 });
              break;
            }
            case 'slideUp': {
              gsap.fromTo(titleEl, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 });
              break;
            }
            case 'scaleIn': {
              gsap.fromTo(titleEl, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.3 });
              break;
            }
            case 'blurIn': {
              gsap.fromTo(titleEl, { opacity: 0, filter: 'blur(12px)' }, { opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out', delay: 0.3 });
              break;
            }
            case 'splitChars': {
              titleEl.setAttribute('data-orig-text', text);
              titleEl.innerHTML = '';
              text.split('').forEach(ch => {
                const span = document.createElement('span');
                span.className = 'tpl1-anim-char';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                span.style.cssText = 'display:inline-block;opacity:0;transform:translateY(20px) scale(0.5);';
                titleEl.appendChild(span);
              });
              gsap.to(titleEl.querySelectorAll('.tpl1-anim-char'), {
                opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.03, ease: 'back.out(1.7)', delay: 0.3,
              });
              break;
            }
            case 'glitch': {
              titleEl.setAttribute('data-orig-text', text);
              const glitchClip = () => {
                const top = Math.random() * 100;
                const height = Math.random() * 15 + 5;
                return `inset(${top}% 0 ${100 - top - height}% 0)`;
              };
              // Create glitch layers
              const wrap = document.createElement('span');
              wrap.style.cssText = 'position:relative;display:inline-block;';
              titleEl.textContent = '';
              wrap.textContent = text;
              const r = document.createElement('span');
              r.textContent = text;
              r.style.cssText = `position:absolute;top:0;left:2px;color:#ff0044;clip-path:${glitchClip()};pointer-events:none;`;
              r.className = 'tpl1-anim-char';
              const b = document.createElement('span');
              b.textContent = text;
              b.style.cssText = `position:absolute;top:0;left:-2px;color:#00ffff;clip-path:${glitchClip()};pointer-events:none;`;
              b.className = 'tpl1-anim-char';
              wrap.appendChild(r);
              wrap.appendChild(b);
              titleEl.appendChild(wrap);
              // Animate glitch
              gsap.fromTo(titleEl, { opacity: 0 }, { opacity: 1, duration: 0.1, delay: 0.3 });
              const glitchTl = gsap.timeline({ delay: 0.3, repeat: 2 });
              for (let i = 0; i < 6; i++) {
                glitchTl.to([r, b], { clipPath: glitchClip(), duration: 0.05, ease: 'none' });
              }
              glitchTl.to([r, b], { opacity: 0, duration: 0.3 });
              break;
            }
          }
        });
      }
    }

    // 0a4. Hero title scroll animation (expand on scroll)
    const heroElForScroll = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
    const isMobileForScroll = window.innerWidth <= 768;
    if (heroElForScroll && !isMobileForScroll) {
      const scrollTitleEls = heroElForScroll.querySelectorAll('.banner-main-title') as NodeListOf<HTMLElement>;
      const scrollSubEls = heroElForScroll.querySelectorAll('.banner-subtitle, .banner-slide-subtitle') as NodeListOf<HTMLElement>;
      const scrollContentEls = heroElForScroll.querySelectorAll('.banner-slide-content') as NodeListOf<HTMLElement>;
      
      // Kill previous scroll triggers for hero
      ScrollTrigger.getAll().filter(st => {
        const vars = st.vars as Record<string, unknown>;
        return vars.trigger === heroElForScroll;
      }).forEach(st => st.kill());

      scrollTitleEls.forEach(titleEl => {
        gsap.to(titleEl, {
          letterSpacing: '0.35em',
          ease: 'none',
          scrollTrigger: {
            trigger: heroElForScroll,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
      scrollSubEls.forEach(subEl => {
        gsap.to(subEl, {
          letterSpacing: '0.15em',
          y: -30,
          opacity: 0.8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroElForScroll,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
      scrollContentEls.forEach(contentEl => {
        gsap.to(contentEl, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroElForScroll,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3,
          },
        });
      });
    }

    // 0b. Subtle complex particles + hero image movement (PC only — skip on mobile for performance)
    const heroBannerEl = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');
    const heroSecForParticles = sectionCfg.find(s => s.id === 'tpl1_hero');
    const hs = heroSecForParticles?.settings || {};
    const isMobile = window.innerWidth <= 768;
    if (heroBannerEl && !document.getElementById('tpl1-hero-particles') && !isMobile) {
      // Set initial hero image state
      const heroImages = heroBannerEl.querySelectorAll('.slide-image img, .slide-image__img');
      heroImages.forEach((img) => {
        (img as HTMLElement).style.transform = 'scale(1.15)';
        (img as HTMLElement).style.transition = 'none';
      });

      const particlesContainer = document.createElement('div');
      particlesContainer.id = 'tpl1-hero-particles';
      particlesContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden;';
      heroBannerEl.appendChild(particlesContainer);

      const particleCount = hs.heroParticlesCount ?? 24;
      const particles: HTMLElement[] = [];
      const speeds: number[] = [];
      const baseColor = hs.heroParticlesColor || '#ec4899';
      // Generar variaciones del color base
      const adjustColor = (hex: string, amount: number): string => {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
      };
      const colors = [baseColor, adjustColor(baseColor, 20), adjustColor(baseColor, -20), adjustColor(baseColor, 40), adjustColor(baseColor, -40), adjustColor(baseColor, 60)];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const baseSize = hs.heroParticlesSize ?? 2;
        const size = Math.random() * baseSize + (baseSize * 0.5);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isLine = Math.random() > 0.6;
        const speed = (i % 5 + 1) * 8;
        speeds.push(speed);

        // No box-shadow/blur — just solid color for performance
        particle.style.cssText = isLine
          ? `position:absolute;width:${size}px;height:${size * 3}px;background:${color};border-radius:1px;opacity:0;left:${Math.random() * 100}%;top:${Math.random() * 100}%;`
          : `position:absolute;width:${size}px;height:${size}px;background:${color};border-radius:50%;opacity:0;left:${Math.random() * 100}%;top:${Math.random() * 100}%;`;
        particlesContainer.appendChild(particle);
        particles.push(particle);

        gsap.set(particle, { opacity: 0, scale: 0, rotation: isLine ? Math.random() * 360 : 0 });

        // Entrance
        gsap.to(particle, { opacity: 1, scale: 1, duration: 1.2, delay: Math.random() * 4, ease: 'back.out(1.7)' });

        // Single keyframe tween instead of 2 overlapping x/y tweens (avoids constant overwrite)
        const fx1 = (Math.random() - 0.5) * 80, fy1 = (Math.random() - 0.5) * 80;
        const fx2 = (Math.random() - 0.5) * 60, fy2 = (Math.random() - 0.5) * 60;
        gsap.to(particle, {
          keyframes: [
            { x: fx1, y: fy1, duration: Math.random() * 5 + 6, ease: 'sine.inOut' },
            { x: fx2, y: fy2, duration: Math.random() * 3 + 2, ease: 'power1.inOut' },
          ],
          repeat: -1,
          delay: Math.random() * 2,
        });

        // Rotation for lines
        if (isLine) {
          gsap.to(particle, { rotation: Math.random() * 360, duration: Math.random() * 8 + 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 3 });
        }

        // Pulse
        gsap.to(particle, { scale: 0.8 + Math.random() * 0.4, opacity: 0.7 + Math.random() * 0.3, duration: Math.random() * 2.5 + 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 2 });
      }

      // Hero image Ken Burns (scale only)
      const heroImgs = heroBannerEl.querySelectorAll('.slide-image img, .slide-image__img');
      heroImgs.forEach((img, idx) => {
        const imgEl = img as HTMLElement;
        // Re-enable transition for animation
        imgEl.style.transition = '';
        gsap.set(imgEl, { scale: 1.15 });
        gsap.to(imgEl, { scale: 1.25, duration: 20 + Math.random() * 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: idx * 0.5 });
      });

      // Single throttled mousemove for particles repulsion + image parallax
      let mxRaf = 0, mxN = 0, myN = 0;
      heroBannerEl.addEventListener('mousemove', (e) => {
        mxN = e.clientX; myN = e.clientY;
        if (mxRaf) return;
        mxRaf = requestAnimationFrame(() => {
          mxRaf = 0;
          const rect = heroBannerEl.getBoundingClientRect();
          const mx = mxN - rect.left;
          const my = myN - rect.top;
          const nx = (mxN - rect.left) / rect.width - 0.5;
          const ny = (myN - rect.top) / rect.height - 0.5;

          // Particles: repel from mouse + subtle parallax drift
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const pr = p.getBoundingClientRect();
            const px = pr.left + pr.width / 2 - rect.left;
            const py = pr.top + pr.height / 2 - rect.top;
            const dx = px - mx;
            const dy = py - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 120;

            if (dist < repelRadius && dist > 0) {
              // Push away from mouse
              const force = (1 - dist / repelRadius) * 50;
              const angle = Math.atan2(dy, dx);
              gsap.to(p, {
                x: Math.cos(angle) * force,
                y: Math.sin(angle) * force,
                duration: 0.6,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            } else {
              // Subtle parallax drift
              const sp = speeds[i];
              gsap.to(p, {
                x: nx * sp,
                y: ny * sp,
                duration: 1,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            }
          }

          // Image parallax
          heroImgs.forEach((img) => {
            gsap.to(img, { x: nx * 25, y: ny * 20, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
          });
        });
      });

      // Reveal hero after all effects applied (inline style overrides CSS opacity:0)
      heroBannerEl.style.opacity = '1';
      heroBannerEl.style.transition = 'opacity 0.5s ease';
    }

    // Always reveal hero if it exists (for HMR/re-render cases where guard blocks)
    if (heroBannerEl) {
      heroBannerEl.style.opacity = '1';
      heroBannerEl.style.transition = 'opacity 0.5s ease';
      // Mantener fallback rosa (evita flash gris al quitar vars del tema Shopify)
      const heroInner = heroBannerEl.querySelector('.musk-main-banner') as HTMLElement;
      if (heroInner) {
        heroInner.style.setProperty('--primary-background', '254,242,248');
        heroInner.style.setProperty('--secondary-background', '252,231,243');
        heroInner.style.setProperty('--gradient-background', 'linear-gradient(101.19deg,rgba(254,242,248,1),rgba(252,231,243,1) 50%,rgba(251,207,232,1) 100%)');
      }
      heroBannerEl.classList.add('tpl1-hero-ready');

      // ── Auto-height: ajustar contenedor al tamaño de la imagen ──
      const adjustHeroHeight = () => {
        const activeImg = heroBannerEl.querySelector('.swiper-slide-active .slide-image img, .swiper-slide-active .slide-image__img') as HTMLImageElement
          || heroBannerEl.querySelector('.slide-image img, .slide-image__img') as HTMLImageElement;
        if (!activeImg || !activeImg.naturalWidth) return;

        const imgAspect = activeImg.naturalWidth / activeImg.naturalHeight;
        const containerWidth = heroBannerEl.offsetWidth || window.innerWidth;
        const naturalHeight = Math.round(containerWidth / imgAspect);

        // Aplicar a todos los contenedores del hero
        const targets = [
          heroBannerEl,
          heroBannerEl.querySelector('.musk-main-banner'),
          heroBannerEl.querySelector('.musk-banner-slider'),
          heroBannerEl.querySelector('.swiper'),
          heroBannerEl.querySelector('.swiper-container'),
          heroBannerEl.querySelector('.swiper-wrapper'),
        ];
        targets.forEach(el => {
          if (el) {
            (el as HTMLElement).style.setProperty('height', `${naturalHeight}px`, 'important');
            (el as HTMLElement).style.setProperty('min-height', '0', 'important');
            (el as HTMLElement).style.setProperty('max-height', 'none', 'important');
          }
        });
        // El slide activo también
        heroBannerEl.querySelectorAll('.swiper-slide').forEach(sl => {
          (sl as HTMLElement).style.setProperty('height', `${naturalHeight}px`, 'important');
        });
      };
      // Ejecutar cuando la imagen carga
      const heroImgs = heroBannerEl.querySelectorAll('.slide-image img, .slide-image__img');
      heroImgs.forEach((img) => {
        if ((img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0) {
          adjustHeroHeight();
        } else {
          (img as HTMLImageElement).addEventListener('load', adjustHeroHeight);
        }
      });
      // Ejecutar en resize y cuando Swiper cambia de slide
      window.addEventListener('resize', adjustHeroHeight);
      heroBannerEl.addEventListener('transitionend', adjustHeroHeight);
      // Ejecutar después de delays para cuando Swiper JS sobreescriba heights
      [300, 800, 1500, 3000].forEach(ms => setTimeout(adjustHeroHeight, ms));

      // MutationObserver: vigilar que Swiper JS no sobreescriba los heights
      const heroObserver = new MutationObserver(() => {
        // Verificar si algún contenedor tiene una altura distinta a la de la imagen
        const slider = heroBannerEl.querySelector('.musk-banner-slider') as HTMLElement;
        if (slider) {
          const currentH = parseInt(slider.style.height || '0');
          const activeImg = heroBannerEl.querySelector('.swiper-slide-active .slide-image img, .swiper-slide-active .slide-image__img') as HTMLImageElement
            || heroBannerEl.querySelector('.slide-image img, .slide-image__img') as HTMLImageElement;
          if (activeImg && activeImg.naturalWidth > 0) {
            const imgAspect = activeImg.naturalWidth / activeImg.naturalHeight;
            const containerWidth = heroBannerEl.offsetWidth || window.innerWidth;
            const naturalHeight = Math.round(containerWidth / imgAspect);
            if (currentH !== naturalHeight) {
              adjustHeroHeight();
            }
          }
        }
      });
      heroObserver.observe(heroBannerEl, { attributes: true, subtree: true, attributeFilter: ['style'] });
    }

    // 0c. Inject subscribe popup content if empty
    const subPopupEl = document.getElementById('shopify-section-sections--22405132714232__subscribe_popup_GX8btz');
    if (subPopupEl && !subPopupEl.querySelector('.subscribe-popup-content')) {
      subPopupEl.innerHTML = `
        <div class="subscribe-popup-content" style="padding:60px 20px;background:#fff;color:#000;font-family:Poppins,sans-serif;">
          <div style="max-width:600px;margin:0 auto;text-align:center;">
            <p style="font-family:'DM Sans',sans-serif;font-size:clamp(14px,1.2vw,16px);letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,0,0,0.45);margin:0 0 12px;font-weight:400;">Newsletter</p>
            <h3 style="font-family:'DM Sans',sans-serif;font-size:clamp(24px,3vw,36px);font-weight:400;margin:0 0 8px;letter-spacing:-0.02em;line-height:1.2;color:#000;">Únete a nuestra comunidad</h3>
            <p style="font-size:clamp(13px,1vw,15px);color:rgba(0,0,0,0.55);margin:0 0 32px;line-height:1.6;font-weight:400;">Suscríbete y recibe un <span style="color:#000;font-weight:600;">10% de descuento</span> en tu primera compra + acceso a ofertas exclusivas.</p>
            <form style="display:flex;gap:0;max-width:460px;margin:0 auto;border:1px solid rgba(0,0,0,0.12);border-radius:40px;overflow:hidden;background:rgba(0,0,0,0.03);transition:border-color 0.3s;" onfocusin="this.style.borderColor='rgba(0,0,0,0.35)'" onfocusout="this.style.borderColor='rgba(0,0,0,0.12)'">
              <input type="email" placeholder="Correo electrónico" style="flex:1;padding:14px 20px;background:transparent;border:none;font-size:14px;color:#000;outline:none;font-family:Poppins,sans-serif;min-width:0;" required>
              <button type="submit" style="padding:14px 28px;background:#000;color:#fff;border:none;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;letter-spacing:0.02em;transition:background 0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#000'">Suscribir</button>
            </form>
          </div>
        </div>`;
    }
    // 0c. Move subscribe_popup above footer in DOM
    if (subPopupEl) {
      const footerEl = document.getElementById('shopify-section-sections--22405132714232__footer_pzLNtW');
      if (footerEl && footerEl.parentElement) {
        footerEl.parentElement.insertBefore(subPopupEl, footerEl);
      }
    }

    const bodySections = sectionCfg
      .filter(s => s.id.startsWith('tpl1_') && !LOCKED.includes(s.id))
      .sort((a, b) => a.order - b.order);

    if (bodySections.length === 0) return;

    const main = document.getElementById('MainContent');
    if (!main) return;

    // 2. Reordenar elementos en el DOM (solo los que existen y son hijos de main)
    const orderedEls = bodySections
      .map(sec => {
        const htmlId = TPL1_SECTION_HTML_MAP[sec.id];
        if (!htmlId) return null;
        return document.getElementById(htmlId);
      })
      .filter((el): el is HTMLElement => el !== null && el.parentElement === main);

    if (orderedEls.length === 0) return;

    // Hero banner es el primer hijo fijo (no se mueve)
    const heroEl = document.getElementById('shopify-section-template--22405132419320__hero_banner_R6iEJ4');

    // Eliminar todos los gestionados de su posición actual
    orderedEls.forEach(el => el.remove());

    // Reinsertarlos en orden después del hero (o al inicio si no hay hero)
    let anchor: ChildNode | null = heroEl && heroEl.parentElement === main
      ? heroEl.nextSibling
      : main.firstChild;

    orderedEls.forEach(el => {
      main.insertBefore(el, anchor);
      anchor = el.nextSibling;
    });
  }, [bodyHtml, sectionCfg, keniaEnabled]);

  /* ── Heading split-text scroll animation (#enlarge_heading + #enlarge_subheading).
        GSAP + ScrollTrigger. Espera a que Swiper termine antes de inicializar. ── */
  useEffect(() => {
    if (!bodyHtml) return;
    if (window.innerWidth <= 767) return;

    let ctx = gsap.context(() => { });
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let building = false;

    const splitHTML = (txt: string) =>
      txt.split(' ').map(w =>
        `<span style="display:inline-block">${w.split('').map(l => `<span style="display:inline-block">${l}</span>`).join('')}</span>`
      ).join(' ');

    const buildAnimation = () => {
      if (building) return;
      building = true;
      try {
        ctx.revert();
        ctx = gsap.context(() => {
          // Target the heading in the ACTIVE slide only (avoid duplicate ID issues)
          const activeSlide = document.querySelector('.musk-banner-slider .swiper-slide-active');
          const heading = activeSlide?.querySelector('.banner-main-title.enlarge_text') as HTMLElement | null
            || document.getElementById('enlarge_heading');
          const subheading = activeSlide?.querySelector('.banner-fancy-sub-head.enlarge_text') as HTMLElement | null
            || document.getElementById('enlarge_subheading');
          if (!heading || !subheading) {
            console.log('[HEADING-GSAP] heading/subheading not found in active slide');
            return;
          }

          const headingText = heading.textContent?.trim() || '';
          const subText = subheading.textContent?.trim() || '';

          heading.innerHTML = splitHTML(headingText);
          subheading.innerHTML = splitHTML(subText);

          // Force inline styles with !important to override theme CSS
          heading.style.setProperty('opacity', '0.6', 'important');
          heading.style.setProperty('visibility', 'visible', 'important');
          heading.style.setProperty('transition', 'none', 'important');
          subheading.style.setProperty('opacity', '1', 'important');
          subheading.style.setProperty('visibility', 'visible', 'important');
          subheading.style.setProperty('transition', 'none', 'important');

          // Force all spans to have no transitions
          const allSpans = heading.querySelectorAll('span, span span');
          allSpans.forEach((s) => {
            (s as HTMLElement).style.setProperty('transition', 'none', 'important');
            (s as HTMLElement).style.setProperty('opacity', '1', 'important');
          });
          const allSubSpans = subheading.querySelectorAll('span, span span');
          allSubSpans.forEach((s) => {
            (s as HTMLElement).style.setProperty('transition', 'none', 'important');
            (s as HTMLElement).style.setProperty('opacity', '1', 'important');
          });

          const headingLetters = heading.querySelectorAll('span span');
          const subLetters = subheading.querySelectorAll('span span');

          if (headingLetters.length > 0) {
            gsap.to(headingLetters, {
              x: (i: number) => (i - headingLetters.length / 2) * 80,
              ease: 'none',
              scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                end: 'bottom -50%',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            });
          }

          if (subLetters.length > 0) {
            gsap.to(subLetters, {
              x: (i: number) => (i - subLetters.length / 2) * 30,
              ease: 'none',
              scrollTrigger: {
                trigger: subheading,
                start: 'top 80%',
                end: 'bottom -50%',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            });
          }

          console.log('[HEADING-GSAP] built, heading letters:', headingLetters.length, 'sub letters:', subLetters.length);

          // debug interval removed for performance

        });
      } finally {
        // Delay resetting the flag so MutationObserver doesn't re-trigger immediately
        setTimeout(() => { building = false; }, 200);
      }
    };

    // Wait for Swiper to fully initialize before building animation
    // Swiper adds "swiper-slide-active" class when ready
    let swiperReady = false;
    pollTimer = setInterval(() => {
      const activeSlide = document.querySelector('.musk-banner-slider .swiper-slide-active');
      const heading = document.getElementById('enlarge_heading');
      if (activeSlide && heading && !swiperReady) {
        swiperReady = true;
        console.log('[HEADING-GSAP] Swiper ready, building animation...');
        if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
        buildAnimation();
        // Guard desactivado: el MutationObserver provocaba loops y freeze en desktop
      }
    }, 300);

    // Fallback: if Swiper never initializes, build after 5s anyway
    const fallbackTimer = setTimeout(() => {
      if (!swiperReady) {
        console.log('[HEADING-GSAP] fallback: Swiper never ready, building anyway...');
        swiperReady = true;
        if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
        buildAnimation();
      }
    }, 5000);

    return () => {
      console.log('[HEADING-GSAP] ⚠️ USEEFFECT CLEANUP CALLED — animation will be killed!');
      if (pollTimer) clearInterval(pollTimer);
      clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [bodyHtml]);

  /* ── Smart header: always sticky on scroll, collapses at top ── */
  useEffect(() => {
    if (!bodyHtml) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const header = document.querySelector('header.musk-main-header') as HTMLElement | null;
        if (!header) { ticking = false; return; }

        const currentY = window.scrollY;

        if (currentY < 100) {
          // Near top — transparent/collapsed style
          header.classList.remove('is-sticky', 'scrolling_down_header', 'scrolling_upwards_header');
        } else {
          // Scrolled — sticky expanded with white bg
          header.classList.add('is-sticky');
          header.classList.remove('scrolling_down_header', 'scrolling_upwards_header');
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [bodyHtml]);

  /* ── Set innerHTML ONCE via ref ── */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    if (containerRef.current.dataset.htmlSet) return; // already set
    containerRef.current.innerHTML = bodyHtml;
    containerRef.current.dataset.htmlSet = '1';
    scheduleHomeHeaderAvatarSync(user, isLoggedIn);

    // Remove specific leftover elements after footer that cause blank scroll space
    const root = containerRef.current;
    root.querySelectorAll('.fusion-overlay-custom, .fusion-scroll-top, .quickView-popup').forEach(el => el.remove());
    // Agregar clase para identificar homepage en CSS
    root.classList.add('is-homepage');

    // Reducir tamaño del logo del header Shopify
    const fixLogo = () => {
      const header = root.querySelector('header.musk-main-header');
      if (!header) return;
      header.querySelectorAll('.logo-col img, .light-logo img, .dark-logo img, .logo-col svg, .light-logo svg, .dark-logo svg').forEach(el => {
        const img = el as HTMLElement;
        img.style.setProperty('max-height', '50px', 'important');
        img.style.setProperty('max-width', '180px', 'important');
        img.style.setProperty('width', 'auto', 'important');
        img.style.setProperty('height', 'auto', 'important');
      });
      header.querySelectorAll('.logo-col .h4, .logo-col .light-logo span, .logo-col .dark-logo span, .logo-col .light-logo, .logo-col .dark-logo').forEach(el => {
        const txt = el as HTMLElement;
        txt.style.setProperty('font-size', '22px', 'important');
        txt.style.setProperty('line-height', '1', 'important');
      });
    };
    fixLogo();
    // Reintentar por si el header se renderiza después
    setTimeout(fixLogo, 500);
    setTimeout(fixLogo, 1500);
  }, [bodyHtml, user, isLoggedIn]);

  /* ── Avatar en header Shopify: reintenta tras auth / settings ── */
  useEffect(() => {
    if (!bodyHtml || !settingsApplied) return;
    return scheduleHomeHeaderAvatarSync(user, isLoggedIn);
  }, [bodyHtml, settingsApplied, isLoggedIn, user]);

  /* ── Inject mobile countdown (simple version replacing Shopify section) ── */
  useEffect(() => {
    if (!bodyHtml || !containerRef.current) return;
    const isMobile = window.innerWidth <= 768;
    const sectionId = 'template--22405132419320__countdown_timer_hYJrNM';
    const section = document.getElementById(`shopify-section-${sectionId}`);
    const countdownEnabled = isSectionEnabled(sectionCfg, 'tpl1_countdown');

    if (!section) return;

    if (!countdownEnabled) {
      section.classList.add('tpl1-section-hidden');
      const existingOff = document.getElementById('tpl1-mobile-countdown');
      if (existingOff) {
        const rootToUnmount = countdownMobileRootRef.current;
        countdownMobileRootRef.current = null;
        setTimeout(() => { rootToUnmount?.unmount(); existingOff.remove(); }, 0);
      }
      return;
    }

    if (!isMobile) {
      // Desktop: show Shopify section, remove mobile overlay if any
      section.classList.remove('tpl1-section-hidden', 'tpl1-countdown-mobile-source-hidden');
      const existing = document.getElementById('tpl1-mobile-countdown');
      if (existing) {
        const rootToUnmount = countdownMobileRootRef.current;
        countdownMobileRootRef.current = null;
        setTimeout(() => { rootToUnmount?.unmount(); existing.remove(); }, 0);
      }
      return;
    }

    // Mobile: hide Shopify section, inject simple React countdown
    if (!countdownOffer) {
      section.classList.add('tpl1-section-hidden');
      const existing = document.getElementById('tpl1-mobile-countdown');
      if (existing) {
        const rootToUnmount = countdownMobileRootRef.current;
        countdownMobileRootRef.current = null;
        setTimeout(() => { rootToUnmount?.unmount(); existing.remove(); }, 0);
      }
      return;
    }

    section.classList.add('tpl1-countdown-mobile-source-hidden');

    let endTimeMs: number | null = null;
    if (countdownOffer.timeType === 'endDateTime' && countdownOffer.endDateTime) {
      endTimeMs = new Date(countdownOffer.endDateTime).getTime();
    } else if (countdownOffer.timeType === 'duration' && countdownOffer.activatedAt && countdownOffer.durationHours) {
      endTimeMs = new Date(countdownOffer.activatedAt).getTime() + (countdownOffer.durationHours * 3600000);
    }

    const title = countdownOffer.productName || '';
    const subtitle = countdownOffer.discountPercentage ? `-${countdownOffer.discountPercentage}% por tiempo limitado` : '';
    const bgImage = countdownProduct?.IMAGEURL || '';
    const buttonHref = countdownOffer.targetId ? `/producto/${countdownOffer.targetId}` : '/productos';

    let host = document.getElementById('tpl1-mobile-countdown');
    if (!host) {
      host = document.createElement('div');
      host.id = 'tpl1-mobile-countdown';
      section.parentNode?.insertBefore(host, section.nextSibling);
    }

    if (!countdownMobileRootRef.current) countdownMobileRootRef.current = createRoot(host);
    countdownMobileRootRef.current.render(
      <MobileCountdown
        title={title}
        subtitle={subtitle}
        endTimeMs={endTimeMs}
        bgImage={bgImage}
        buttonHref={buttonHref}
      />
    );
  }, [bodyHtml, sectionCfg, countdownOffer, countdownProduct]);

  // Removed redundant static Kenia banner injection as it is now integrated as Slide 2 (herobanner 2)

  /* ── Inject TPL1 coupon banner before Colecciones ── */


  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0 || !containerRef.current) return;
    const enabled = isSectionEnabled(sectionCfg, 'tpl1_coupon_banner');
    const existing = document.getElementById('tpl1-coupon-banner-section');
    if (!enabled) {
      const rootToUnmount = couponRootRef.current;
      couponRootRef.current = null;
      setTimeout(() => {
        rootToUnmount?.unmount();
        existing?.remove();
        applyTpl1SectionsVisibility(sectionCfg, TPL1_SECTION_HTML_MAP);
      }, 0);
      return;
    }

    const cfg = sectionCfg.find(s => s.id === 'tpl1_coupon_banner');
    const collection = document.getElementById('shopify-section-template--22405132419320__collection_list_WrFbPe');
    if (!collection) return;

    let host = existing;
    if (!host) {
      host = document.createElement('div');
      host.id = 'tpl1-coupon-banner-section';
      host.dataset.sectionId = 'tpl1-coupon-banner-section';
      host.style.cssText = 'background:#fff;position:relative;z-index:11;padding:60px 0;';
      collection.parentNode?.insertBefore(host, collection);
    }

    if (!couponRootRef.current) couponRootRef.current = createRoot(host);
    host.classList.remove('tpl1-section-hidden');
    couponRootRef.current.render(
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <CouponBanner settings={cfg?.settings || {}} />
      </div>
    );
    applyTpl1SectionsVisibility(sectionCfg, TPL1_SECTION_HTML_MAP);

    return undefined;
  }, [bodyHtml, sectionCfg]);

  /* ── Inject floating buttons (WhatsApp, Chatbot) ── */
  useEffect(() => {
    if (!bodyHtml || sectionCfg.length === 0) return;
    const whatsappEnabled = isSectionEnabled(sectionCfg, 'tpl1_whatsapp_button');
    const chatbotEnabled = isSectionEnabled(sectionCfg, 'tpl1_chatbot_button');

    // Remove previously injected buttons (now in navbar on mobile)
    const existingWa = document.getElementById('tpl1-whatsapp-button');
    const existingCb = document.getElementById('tpl1-chatbot-button');
    if (existingWa) existingWa.remove();
    if (existingCb) existingCb.remove();

    // Inject WhatsApp button (desktop only - mobile uses navbar fabs)
    if (whatsappEnabled) {
      const waBtn = document.createElement('div');
      waBtn.id = 'tpl1-whatsapp-button';
      waBtn.dataset.sectionId = 'tpl1_whatsapp_button';
      waBtn.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:9999;width:44px;height:44px;border-radius:50%;background:#25D366;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.12);transition:transform 0.2s;';
      waBtn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>`;
      waBtn.onclick = () => window.open(getWhatsAppUrl(), '_blank');
      document.body.appendChild(waBtn);
    }

    // Inject Chatbot button
    if (chatbotEnabled && keniaEnabled) {
      const cbBtn = document.createElement('button');
      cbBtn.id = 'tpl1-chatbot-button';
      cbBtn.dataset.sectionId = 'tpl1_chatbot_button';
      cbBtn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,rgb(52,131,250),rgb(99,102,241));border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.12);transition:transform 0.2s;';
      cbBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>`;
      cbBtn.onclick = () => openChatbot();
      document.body.appendChild(cbBtn);
    }
    setSettingsApplied(true);
    return () => {
      const wa = document.getElementById('tpl1-whatsapp-button');
      const cb = document.getElementById('tpl1-chatbot-button');
      if (wa) wa.remove();
      if (cb) cb.remove();
    };
  }, [bodyHtml, sectionCfg, keniaEnabled]);

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

  /* ── Loading state ── */
  if (loadError) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 8 }}>Error cargando la plantilla</h2>
        <p style={{ color: '#666' }}>No se pudo cargar <code>/shopify/body-clean.html</code>.</p>
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Detalle: {loadError}</p>
      </div>
    );
  }

  const showHeroSkeleton = !bodyHtml || !settingsApplied;

  if (!bodyHtml) {
    return (
      <>
        <HeroSkeletonMobile visible={showHeroSkeleton} />
        <div className="tpl1-loading" style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }} aria-hidden />
      </>
    );
  }

  return (
    <>
      <HeroSkeletonMobile visible={showHeroSkeleton} />
      <div
        ref={containerRef}
        className="tpl1-shopify-root viewport musk-skin mi-tienda-3 index"
        style={!settingsApplied ? { visibility: 'hidden' } : undefined}
      />
      {notifOpen && <NotificationsOverlay onClose={() => setNotifOpen(false)} />}
    </>
  );
}
