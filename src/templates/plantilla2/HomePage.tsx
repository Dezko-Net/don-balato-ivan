'use client';
import '@/templates/plantilla2/theme.css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ChevronRight, ChevronLeft, Clock, Zap, Eye, Heart, X } from 'lucide-react';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, BANNERS_COLLECTION, TIMED_OFFERS_COLLECTION, LIVE_STREAMS_COLLECTION, BANNER_OVERLAY_POSITIONS_COLLECTION, HOTSPOT_PANELS_COLLECTION, SUBCATEGORIES_COLLECTION, formatPrice } from '@/lib/appwrite';
import { resolveStorageImageUrl } from '@/lib/product-images';
import { Query } from 'appwrite';
import { Product, Category, Banner, TimedOffer, LiveStream, BannerOverlayPosition, HotspotPanel, Subcategory } from '@/types';
import { useCart } from '@/context/CartContext';
import CouponBanner from '@/components/CouponBanner';
import FavoriteButton from '@/components/FavoriteButton';
import QuickView from '@/components/QuickView';
import { getSectionConfig, getSectionConfigAsync, isSectionEnabled, getSectionSettings, invalidateSectionCache, SectionConfig, SectionSettings, getFontConfig, FontConfig, buildGoogleFontsUrl } from '@/lib/section-config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Navbar2 from './Navbar';
import SmartCards from '@/components/SmartCards';
import AnnouncementBar from '@/components/AnnouncementBar';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── Dynamic Access feature cards ─── */
const DA_ITEMS = [
  { img: '/ml/da/new-buyer.svg',       title: 'Envío gratis',         desc: 'Beneficio por ser tu primera compra.' },
  { img: '/ml/da/registration-da.svg', title: 'Ingresa a tu cuenta',  desc: 'Disfruta de ofertas y compra sin límites.' },
  { img: '/ml/da/location.svg',        title: 'Ingresa tu ubicación', desc: 'Consulta costos y tiempos de entrega.' },
  { img: '/ml/da/payment-methods.svg', title: 'Medios de pago',       desc: 'Paga tus compras de forma rápida y segura.' },
  { img: '/ml/da/low-price-product.svg', title: 'Menos de $15.000',   desc: 'Descubre productos con precios bajos.' },
  { img: '/ml/da/top-sale.svg',        title: 'Más vendidos',         desc: 'Explora los productos que son tendencia.' },
];

/* ─── Hero slides now loaded from database ─── */

/* ─── Helper functions for TimedOffer ─── */
function getOfferExpiresAt(offer: TimedOffer): number | null {
  if (offer.timeType === 'endDateTime' && offer.endDateTime) return new Date(offer.endDateTime).getTime();
  if (offer.timeType === 'duration' && offer.durationHours) {
    // activatedAt preferred; fall back to $createdAt (reset on each delete+create toggle)
    const start = offer.activatedAt || (offer as any).$createdAt;
    if (start) return new Date(start).getTime() + offer.durationHours * 3600000;
  }
  return null;
}

function isOfferActive(offer: TimedOffer): boolean {
  if (!offer.isActive || offer.status !== 'active') return false;
  const exp = getOfferExpiresAt(offer);
  if (exp === null) return true; // no time data — trust admin activation
  return exp > Date.now();
}

/* ─── Countdown ─── */
function Countdown({ offer, style }: { offer: TimedOffer; style?: React.CSSProperties }) {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const tick = () => {
      const expiresAt = getOfferExpiresAt(offer);
      if (!expiresAt) { setT('∞'); return; }
      const d = expiresAt - Date.now();
      if (d <= 0) { setT('00:00:00'); return; }
      const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000);
      setT(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [offer]);
  return <span style={style}>{t}</span>;
}

/* ─── Premium animated countdown ─── */
function CountdownBlocks({ offer }: { offer: TimedOffer; dark?: boolean }) {
  const [parts, setParts] = useState({ h: '--', m: '--', s: '--', expired: false, noTime: false });
  const [tick, setTick] = useState(0);
  const prevS = useRef('--');
  useEffect(() => {
    const fn = () => {
      const expiresAt = getOfferExpiresAt(offer);
      if (!expiresAt) { setParts({ h: '∞', m: '∞', s: '∞', expired: false, noTime: true }); return; }
      const d = expiresAt - Date.now();
      if (d <= 0) { setParts({ h: '00', m: '00', s: '00', expired: true, noTime: false }); return; }
      const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000);
      const sStr = String(s).padStart(2, '0');
      if (sStr !== prevS.current) { setTick(t => t + 1); prevS.current = sStr; }
      setParts({ h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: sStr, expired: false, noTime: false });
    };
    fn(); const id = setInterval(fn, 1000); return () => clearInterval(id);
  }, [offer]);

  const Block = ({ val, label, animate }: { val: string; label: string; animate?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div className={animate ? 'cd-block cd-tick' : 'cd-block'} key={animate ? tick : undefined} style={{ display: 'flex', gap: 3 }}>
        {val.split('').map((d, i) => (
          <div key={`${d}-${i}`} className="cd-digit" style={{ width: 32, height: 44, borderRadius: 10, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)', pointerEvents: 'none' }} />
            <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: 1, position: 'relative', zIndex: 1 }}>{d}</span>
          </div>
        ))}
      </div>
      <span className="cd-label" style={{ fontSize: 9, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</span>
    </div>
  );

  const Sep = () => (
    <div className="cd-sep" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18, paddingTop: 4 }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff3b30' }} />
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff3b30' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      <Block val={parts.h} label="horas" />
      <Sep />
      <Block val={parts.m} label="min" />
      <Sep />
      <Block val={parts.s} label="seg" animate />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div data-section-id="hero_carousel" style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#fdf2f8' }}>
      <div style={{ width: '100%', aspectRatio: '1920 / 540', minHeight: 220, backgroundImage: 'linear-gradient(90deg, #fdf2f8 0%, #fce7f3 45%, #fdf2f8 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @keyframes hp-skeleton-wave { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
      <div style={{ height: 28, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f8f9fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
      <div style={{ height: 82, background: '#ffffff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #eceff1', display: 'flex', alignItems: 'center', padding: '0 8%', gap: 16 }}>
        <div style={{ width: 140, height: 34, borderRadius: 8, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f8f9fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
        <div style={{ flex: 1, height: 36, borderRadius: 999, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f8f9fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
        <div style={{ width: 170, height: 32, borderRadius: 999, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f8f9fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
      </div>
      <div style={{ height: 30, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f8f9fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
      <HeroSkeleton />
      <div style={{ padding: '18px 8%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(120px, 1fr))', gap: 10 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 170, borderRadius: 12, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f7f8fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
          ))}
        </div>
      </div>
      <div style={{ padding: '0 8% 20px' }}>
        <div style={{ height: 18, width: 220, borderRadius: 8, marginBottom: 12, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f7f8fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(130px, 1fr))', gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 146, borderRadius: 16, backgroundImage: 'linear-gradient(90deg, #f1f3f5 0%, #f7f8fa 45%, #f1f3f5 100%)', backgroundSize: '220% 100%', animation: 'hp-skeleton-wave 1.2s linear infinite' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Announcement Bar Text (GSAP-powered gradient + hover effects) ─── */
function AbarText({ text, gradient, animated, hoverEffect, color, textSize }: { text: string; gradient?: string; animated?: boolean; hoverEffect?: string; color: string; textSize?: number }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shimmerRef = useRef<gsap.core.Tween | null>(null);
  const fx = hoverEffect || 'none';
  const hasGrad = !!gradient;

  // Detect if gradient needs shadow fallback (light colors like silver, gold-white)
  const needsShadow = hasGrad && /(?:#fff|#e2e8f0|#fbbf24|white)/i.test(gradient || '');

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (fx !== 'none') {
        const chars = charsRef.current.filter(Boolean);
        if (chars.length) {
          gsap.fromTo(chars, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.015, ease: 'back.out(1.4)', delay: 0.1 });
        }
      } else if (containerRef.current) {
        gsap.fromTo(containerRef.current, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
      }
      // GSAP shimmer: animate background-position for gradient text
      if (hasGrad && animated && containerRef.current) {
        shimmerRef.current = gsap.to(containerRef.current, {
          backgroundPosition: '300% center',
          duration: 5,
          ease: 'none',
          repeat: -1,
        });
      }
    });
    return () => { ctx.revert(); shimmerRef.current?.kill(); if (tlRef.current) tlRef.current.kill(); };
  }, [text, fx, hasGrad, animated]);

  if (fx === 'none') {
    return (
      <span ref={containerRef} style={{
        fontSize: textSize ?? 13, fontWeight: 600, display: 'inline-block',
        ...(hasGrad ? {
          backgroundImage: gradient,
          backgroundSize: '300% auto',
          backgroundPosition: '0% center',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          // drop-shadow fallback for low-contrast gradients
          ...(needsShadow ? { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' } : {}),
        } : { color }),
      }}>
        {text}
      </span>
    );
  }

  const chars = text.split('');
  const len = chars.length;

  const playFx = () => {
    if (tlRef.current) tlRef.current.kill();
    const targets = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!targets.length) return;
    const tl = gsap.timeline();
    switch (fx) {
      case 'fall':
        tl.to(targets, { y: 22, scaleY: 0.65, opacity: 0.3, duration: 0.22, stagger: 0.025, ease: 'power2.in' })
          .to(targets, { y: -8, scaleY: 1.08, opacity: 0.9, duration: 0.18, stagger: 0.025, ease: 'power2.out' })
          .to(targets, { y: 0, scaleY: 1, opacity: 1, duration: 0.3, stagger: 0.025, ease: 'elastic.out(1.2, 0.4)' });
        break;
      case 'bounce':
        tl.to(targets, { y: -16, duration: 0.22, stagger: 0.02, ease: 'power3.out' })
          .to(targets, { y: 0, duration: 0.6, stagger: 0.02, ease: 'bounce.out' });
        break;
      case 'wave':
        tl.to(targets, { y: -12, rotation: -8, duration: 0.28, stagger: { each: 0.025, from: 'start' }, ease: 'sine.inOut' })
          .to(targets, { y: 0, rotation: 0, duration: 0.45, stagger: { each: 0.025, from: 'start' }, ease: 'elastic.out(1, 0.3)' });
        break;
      case 'shake':
        tl.to(targets, { x: 'random(-6, 6)', rotation: 'random(-10, 10)', duration: 0.08, stagger: 0.012, ease: 'none' })
          .to(targets, { x: 'random(-4, 4)', rotation: 'random(-6, 6)', duration: 0.06, stagger: 0.012, ease: 'none' })
          .to(targets, { x: 0, rotation: 0, duration: 0.4, stagger: 0.012, ease: 'elastic.out(1, 0.25)' });
        break;
    }
    tlRef.current = tl;
  };

  const resetFx = () => {
    const targets = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (tlRef.current) tlRef.current.kill();
    gsap.to(targets, { y: 0, x: 0, rotation: 0, scaleY: 1, opacity: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
  };

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', fontSize: textSize ?? 13, fontWeight: 600, cursor: 'default' }}
      onMouseEnter={playFx} onMouseLeave={resetFx}>
      {chars.map((c, i) => (
        <span key={i} ref={el => { charsRef.current[i] = el; }}
          style={{
            display: 'inline-block', willChange: 'transform',
            ...(hasGrad ? {
              backgroundImage: gradient!,
              backgroundSize: `${Math.max(len * 80, 300)}% auto`,
              backgroundPosition: `${(i / Math.max(len - 1, 1)) * 100}% center`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            } : { color }),
          }}>
          {c === ' ' ? '\u00a0' : c}
        </span>
      ))}
    </span>
  );
}

/* ─── Star rating (decorative) ─── */
function Stars({ n = 4 }: { n?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 10 10">
          <polygon
            points="5,0.5 6.6,3.5 10,4 7.5,6.5 8.1,10 5,8.3 1.9,10 2.5,6.5 0,4 3.4,3.5"
            fill={i < n ? '#ffe600' : '#e0e0e0'}
            stroke={i < n ? '#e6c800' : '#ccc'}
            strokeWidth="0.4"
          />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: '#999', marginLeft: 3 }}>(42)</span>
    </div>
  );
}

/* ─── Video URL → embed URL ─── */
function getEmbedUrl(url: string): string {
  if (!url) return '';
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
  return url;
}

/* ─── Countdown section ─── */
function CountdownSection({ s }: { s: SectionSettings }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });
  useEffect(() => {
    if (!s.targetDate) return;
    const tick = () => {
      const diff = new Date(s.targetDate!).getTime() - Date.now();
      if (diff <= 0) { setTime(p => ({ ...p, expired: true })); return; }
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000), expired: false });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [s.targetDate]);
  const bg = s.bgColor || '#dc2626'; const tx = s.textColor || '#fff'; const ac = s.accentColor || '#fbbf24'; const r = s.borderRadius ?? 0;
  return (
    <div style={{ background: bg, borderRadius: r, overflow: 'hidden', position: 'relative' }}>
      {s.imageUrl && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${JSON.stringify(s.imageUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22 }} />}
      <div style={{ position: 'relative', zIndex: 1, padding: `${s.padding ?? 48}px 24px`, textAlign: 'center' }}>
        {s.title && <h2 style={{ fontSize: 32, fontWeight: 800, color: tx, margin: '0 0 8px', lineHeight: 1.2 }}>{s.title}</h2>}
        {s.subtitle && <p style={{ fontSize: 16, color: tx, margin: '0 0 24px', opacity: 0.82, lineHeight: 1.5 }}>{s.subtitle}</p>}
        {!s.targetDate ? (
          <div style={{ fontSize: 14, color: tx, opacity: 0.55, margin: '24px 0' }}>Configura una fecha objetivo en el editor</div>
        ) : time.expired ? (
          <div style={{ fontSize: 18, color: tx, opacity: 0.65, margin: '24px 0' }}>Oferta finalizada</div>
        ) : (
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', margin: '28px 0', flexWrap: 'wrap' }}>
            {([['d', 'Días'], ['h', 'Horas'], ['m', 'Min'], ['s', 'Seg']] as [string, string][]).map(([k, l]) => (
              <div key={k} style={{ textAlign: 'center', minWidth: 64 }}>
                <div style={{ fontSize: 54, fontWeight: 900, color: tx, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{String(k === 'd' ? time.d : k === 'h' ? time.h : k === 'm' ? time.m : time.s).padStart(2, '0')}</div>
                <div style={{ fontSize: 11, color: ac, fontWeight: 700, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
              </div>
            ))}
          </div>
        )}
        {s.ctaText && <Link href={s.ctaLink || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', background: ac, color: s.buttonTextColor || '#111', borderRadius: Math.max(r, 8), fontWeight: 700, textDecoration: 'none', fontSize: 15, boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>{s.ctaText}</Link>}
      </div>
    </div>
  );
}

/* ─── Testimonials section ─── */
function TestimonialsSection({ s }: { s: SectionSettings }) {
  const testimonials = s.testimonials || [];
  if (!testimonials.length) return <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Agrega testimonios en el editor → pestaña Contenido</div>;
  const bg = s.bgColor || '#f9fafb'; const hd = s.headingColor || '#111'; const cBg = s.cardBgColor || '#fff'; const cTx = s.cardTextColor || '#374151'; const ac = s.accentColor || '#f59e0b'; const r = s.borderRadius ?? 12; const pad = s.padding ?? 40;
  const shadowMap: Record<string, string> = { none: 'none', sm: '0 1px 3px rgba(0,0,0,0.06)', md: '0 4px 12px rgba(0,0,0,0.1)', lg: '0 8px 24px rgba(0,0,0,0.14)' };
  const sh = shadowMap[s.shadow || 'sm'];
  return (
    <div style={{ background: bg, borderRadius: r, padding: `${pad}px 32px`, overflow: 'hidden' }}>
      {s.title && <h2 style={{ fontSize: 26, fontWeight: 800, color: hd, margin: '0 0 28px', textAlign: 'center' }}>{s.title}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{ background: cBg, borderRadius: Math.max(r - 4, 8), padding: '24px', boxShadow: sh }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={(t.rating || 5) >= star ? ac : '#e5e7eb'}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 14, color: cTx, lineHeight: 1.65, margin: '0 0 16px', fontStyle: 'italic' }}>&ldquo;{t.text}&rdquo;</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {t.avatar && <img src={t.avatar} alt={t.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: hd }}>{t.name}</span>
                {t.productName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    {t.productImage && <img src={t.productImage} alt={t.productName} style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'cover', border: '1px solid #e5e7eb' }} />}
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{t.productName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ accordion ─── */
function FaqSection({ s }: { s: SectionSettings }) {
  const faqs = s.faqs || [];
  const [open, setOpen] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bg = s.bgColor || '#fff'; const tx = s.textColor || '#374151'; const hd = s.headingColor || '#111827'; const ac = s.accentColor || '#3483fa'; const r = s.borderRadius ?? 0; const pad = s.padding ?? 48;

  // GSAP animation for opening/closing
  useEffect(() => {
    faqs.forEach((_, i) => {
      const content = contentRefs.current[i];
      const icon = iconRefs.current[i];
      if (content) {
        if (open === i) {
          gsap.fromTo(content, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' });
        } else if (content.style.height !== '0px') {
          gsap.to(content, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
      }
      if (icon) {
        gsap.to(icon, { rotation: open === i ? 45 : 0, duration: 0.3, ease: 'back.out(1.7)' });
      }
    });
  }, [open, faqs.length]);

  if (!faqs.length) return <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Agrega preguntas en el editor → pestaña Contenido</div>;

  return (
    <div style={{ background: bg, borderRadius: r, padding: `${pad}px ${Math.min(pad, 64)}px`, overflow: 'hidden' }}>
      {s.title && <h2 style={{ fontSize: 36, fontWeight: 700, color: hd, margin: '0 0 40px', textAlign: 'center', letterSpacing: '-0.5px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{s.title}</h2>}
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            borderRadius: 8,
            border: `1px solid ${open === i ? ac : '#e5e7eb'}`,
            overflow: 'hidden',
            background: open === i ? '#fff' : 'transparent',
            transition: 'border-color 0.2s',
          }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px',
                background: 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
              }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: open === i ? ac : hd, lineHeight: 1.5, fontFamily: 'system-ui, -apple-system, sans-serif' }}>{faq.question}</span>
              <span ref={el => { iconRefs.current[i] = el; }} style={{
                color: ac, fontSize: 24, lineHeight: 1, fontWeight: 300,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>+</span>
            </button>
            <div ref={el => { contentRefs.current[i] = el; }} style={{ overflow: 'hidden', height: open === i ? 'auto' : 0 }}>
              <div style={{ padding: '0 24px 20px', fontSize: 15, color: tx, lineHeight: 1.7, fontFamily: 'system-ui, -apple-system, sans-serif' }}>{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Newsletter form ─── */
function NewsletterSection({ s }: { s: SectionSettings }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const bg = s.bgColor || '#111827'; const tx = s.textColor || '#f3f4f6'; const hd = s.headingColor || '#fff'; const ac = s.accentColor || '#3483fa'; const btn = s.buttonColor || ac; const btnTx = s.buttonTextColor || '#fff'; const r = s.borderRadius ?? 0; const pad = s.padding ?? 48;
  return (
    <div style={{ background: bg, borderRadius: r, padding: `${pad}px 24px`, textAlign: 'center', overflow: 'hidden' }}>
      {s.title && <h2 style={{ fontSize: 30, fontWeight: 800, color: hd, margin: '0 0 12px', lineHeight: 1.2 }}>{s.title}</h2>}
      {s.subtitle && <p style={{ fontSize: 16, color: tx, margin: '0 0 28px', opacity: 0.85, lineHeight: 1.6 }}>{s.subtitle}</p>}
      {sent ? (
        <div style={{ fontSize: 17, color: ac, fontWeight: 700 }}>✓ ¡Gracias por suscribirte!</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }} style={{ display: 'flex', gap: 8, maxWidth: 460, margin: '0 auto' }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={s.placeholder || 'tu@email.com'} required
            style={{ flex: 1, padding: '13px 16px', borderRadius: r ? Math.max(r - 4, 6) : 8, border: '1.5px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.1)', color: tx, fontSize: 14, outline: 'none' }} />
          <button type="submit" style={{ padding: '13px 24px', background: btn, color: btnTx, border: 'none', borderRadius: r ? Math.max(r - 4, 6) : 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {s.buttonText || 'Suscribirme'}
          </button>
        </form>
      )}
    </div>
  );
}

/* ─── Featured Products Carousel ─── */
function FeaturedCarousel({ products, delay = 0 }: { products: Product[]; delay?: number }) {
  const featured = [...products]
    .filter(p => p.IMAGEURL)
    .sort((a, b) => (b.SOLDQUANTITY ?? 0) - (a.SOLDQUANTITY ?? 0))
    .slice(0, 8);
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (timer.current) clearInterval(timer.current);
    const interval = delay > 0 ? setTimeout(() => {
      timer.current = setInterval(() => { setIdx(i => (i + 1) % featured.length); setAnimKey(k => k + 1); }, 4500);
    }, delay) : setInterval(() => { setIdx(i => (i + 1) % featured.length); setAnimKey(k => k + 1); }, 4500);
    if (delay === 0) timer.current = interval;
  };
  useEffect(() => { if (featured.length > 1) start(); return () => { if (timer.current) clearInterval(timer.current); }; }, [featured.length, delay]);

  if (!featured.length) return null;
  const p = featured[idx];
  const price = p.CURRENTPRICE ?? p.PRICE;
  const hasDiscount = !!(p.CURRENTPRICE && p.CURRENTPRICE < p.PRICE);
  const discPct = hasDiscount ? Math.round(100 - (p.CURRENTPRICE! / p.PRICE) * 100) : 0;

  const go = (dir: number) => {
    setIdx(i => (i + dir + featured.length) % featured.length);
    setAnimKey(k => k + 1);
    start();
  };

  return (
    <div style={{ height: 300, borderRadius: 24, overflow: 'hidden', position: 'relative', background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
      <style>{`
        @keyframes fc-fadein {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fc-imgfade {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Animated content — key forces re-mount on slide change */}
      <Link key={animKey} href={`/productos/${p.$id}`} style={{ display: 'block', textDecoration: 'none', height: '100%', animation: 'fc-fadein 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>
        {/* LEFT: info */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '56%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 20px 24px 30px', zIndex: 2 }}>
          {/* Top */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 10, alignSelf: 'flex-start', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 100, padding: '3px 10px 3px 8px' }}>
              <span style={{ fontSize: 11 }}>⭐</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Destacado</span>
            </div>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#1d1d1f', lineHeight: 1.22, letterSpacing: '-0.4px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.NAME}</h3>
          </div>
          {/* Bottom: price */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {hasDiscount && <span style={{ fontSize: 11, color: '#aeaeb2', textDecoration: 'line-through' }}>{formatPrice(p.PRICE)}</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.7px', lineHeight: 1 }}>{formatPrice(price)}</span>
              {hasDiscount && <span style={{ background: '#1d1d1f', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100 }}>-{discPct}%</span>}
            </div>
          </div>
        </div>

        {/* RIGHT: product image with fade-in animation */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '52%', zIndex: 1, overflow: 'hidden', animation: 'fc-imgfade 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.55) 20%, transparent 44%)' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 24%, transparent 70%, rgba(255,255,255,0.6) 100%)' }} />
          <Image src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME} fill style={{ objectFit: 'cover' }} unoptimized />
        </div>
      </Link>

      {/* Prev / Next arrows */}
      {featured.length > 1 && (<>
        <button onClick={e => { e.preventDefault(); go(-1); }} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <ChevronLeft size={14} color="#1d1d1f" />
        </button>
        <button onClick={e => { e.preventDefault(); go(1); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <ChevronRight size={14} color="#1d1d1f" />
        </button>
      </>)}

      {/* Dot indicators */}
      {featured.length > 1 && (
        <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5, zIndex: 10 }}>
          {featured.map((_, i) => (
            <button key={i} onClick={e => { e.preventDefault(); setIdx(i); setAnimKey(k => k + 1); start(); }} style={{ width: i === idx ? 20 : 6, height: 5, borderRadius: 3, background: i === idx ? '#1d1d1f' : 'rgba(0,0,0,0.15)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all .35s cubic-bezier(0.22,1,0.36,1)' }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Card Carousel (3 cards per view, used when no timed offer) ─── */
function CardCarousel({ products, label }: { products: Product[]; label?: string }) {
  const PAGE = 3;
  const [page, setPage] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const pages = Math.ceil(products.length / PAGE);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setPage(p => (p + 1) % pages), 4500);
  };
  useEffect(() => { if (pages > 1) startTimer(); return () => { if (timer.current) clearInterval(timer.current); }; }, [pages]);

  if (!products.length) return null;
  const slice = products.slice(page * PAGE, page * PAGE + PAGE);

  const go = (dir: number) => { setPage(p => (p + dir + pages) % pages); startTimer(); };

  return (
    <div style={{ position: 'relative' }}>
      {/* Cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PAGE}, 1fr)`, gap: 10, height: 280 }}>
        {slice.map(p => {
          const price = p.CURRENTPRICE ?? p.PRICE;
          const hasDisc = !!(p.CURRENTPRICE && p.CURRENTPRICE < p.PRICE);
          const discPct = hasDisc ? Math.round(100 - (p.CURRENTPRICE! / p.PRICE) * 100) : 0;
          return (
            <Link key={p.$id} href={`/productos/${p.$id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', transition: 'transform .25s ease, box-shadow .25s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; }}>
              {/* Image area */}
              <div style={{ position: 'relative', flex: '0 0 62%', background: '#fafafa', overflow: 'hidden' }}>
                {hasDisc && <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: '#1d1d1f', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>-{discPct}%</div>}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, transparent 55%, rgba(250,250,250,0.9) 100%)' }} />
                {p.IMAGEURL && <Image src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME} fill style={{ objectFit: 'contain', padding: 10, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }} unoptimized />}
              </div>
              {/* Info area */}
              <div style={{ flex: 1, padding: '8px 12px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: '#1d1d1f', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.NAME}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 5 }}>
                  {hasDisc && <span style={{ fontSize: 10, color: '#aeaeb2', textDecoration: 'line-through' }}>{formatPrice(p.PRICE)}</span>}
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.3px' }}>{formatPrice(price)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Arrows */}
      {pages > 1 && (<>
        <button onClick={() => go(-1)} style={{ position: 'absolute', left: -14, top: '40%', transform: 'translateY(-50%)', zIndex: 10, width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <ChevronLeft size={13} color="#1d1d1f" />
        </button>
        <button onClick={() => go(1)} style={{ position: 'absolute', right: -14, top: '40%', transform: 'translateY(-50%)', zIndex: 10, width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <ChevronRight size={13} color="#1d1d1f" />
        </button>
      </>)}

      {/* Dots */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 10 }}>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => { setPage(i); startTimer(); }} style={{ width: i === page ? 18 : 6, height: 6, borderRadius: 3, background: i === page ? '#1d1d1f' : 'rgba(0,0,0,0.15)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all .3s ease' }} />
          ))}
        </div>
      )}
    </div>
  );
}

const CATEGORY_THEMES = [
  '#3b82f6', '#f43f5e', '#22c55e', '#f97316', '#8b5cf6', '#06b6d4',
  '#e396bf', '#14b8a6', '#f59e0b', '#6366f1',
] as const;

function getCategoryAccent(cat: Category, idx: number): string {
  const custom = (cat as any).color as string | undefined;
  if (custom && custom.trim()) return custom;
  const seed = (cat.name || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + idx;
  return CATEGORY_THEMES[seed % CATEGORY_THEMES.length];
}

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */
export default function HomePage2() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [offers, setOffers] = useState<TimedOffer[]>([]);
  const [liveStream, setLiveStream] = useState<LiveStream | null>(null);
  const [panels, setPanels] = useState<HotspotPanel[]>([]);
  const [panelHotspots, setPanelHotspots] = useState<BannerOverlayPosition[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [tagPos, setTagPos] = useState<{ x: number; y: number; onRight: boolean } | null>(null);
  const [configError, setConfigError] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroImageReady, setHeroImageReady] = useState(false);
  const [liveBannerDismissed, setLiveBannerDismissed] = useState(false);

  function dismissLiveBanner() {
    setLiveBannerDismissed(true);
  }
  // Leer sincrónicamente del localStorage antes del primer render
  const [sectionCfg, setSectionCfg] = useState<SectionConfig[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('homepage_sections');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [fontCfg, setFontCfg] = useState<FontConfig>({ globalFont: '', globalHeadingFont: '' });
  const heroTimer = useRef<NodeJS.Timeout | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    // Cargar desde Appwrite con fallback a localStorage
    getSectionConfigAsync().then(setSectionCfg).catch(() => setSectionCfg(getSectionConfig()));
    setFontCfg(getFontConfig());
  }, []);

  /* ── Theme Editor bridge (postMessage) ── */
  useEffect(() => {
    function handleEditorMsg(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return;
      const { type, sectionId } = e.data;
      if (type === 'te:reloadConfig') {
        // Recargar desde localStorage (sync, immediate)
        invalidateSectionCache();
        setSectionCfg(getSectionConfig());
        setFontCfg(getFontConfig());
      }
      if (type === 'te:scrollTo' && sectionId) {
        const el = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (type === 'te:highlight' && sectionId) {
        document.querySelectorAll('[data-section-id]').forEach(el => el.classList.remove('te-highlight'));
        const el = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (el) el.classList.add('te-highlight');
      }
      if (type === 'te:unhighlight') {
        document.querySelectorAll('[data-section-id]').forEach(el => el.classList.remove('te-highlight'));
      }
    }
    window.addEventListener('message', handleEditorMsg);
    return () => window.removeEventListener('message', handleEditorMsg);
  }, []);

  /* ── Notify editor on section click/hover (when in iframe) ── */
  useEffect(() => {
    if (window === window.top) return; // Not in iframe
    const getLabel = (id: string) => {
      const map: Record<string, string> = {
        navbar: 'Barra de Navegación', announcement_bar: 'Barra de Anuncios',
        live_banner: 'Banner En Vivo', hero_carousel: 'Hero Carousel', coupon_banner: 'Banner de Cupones',
        feature_cards: 'Tarjetas de Beneficios', offers: 'Ofertas del Día', categories: 'Categorías',
        collage: 'Collage Interactivo', room: 'Sala Interactiva', recommended: 'Recomendados', products_grid: 'Productos Destacados'
      };
      return map[id] || id;
    };
    const handleClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        const id = el.dataset.sectionId;
        if (id) window.parent.postMessage({ type: 'te:select', sectionId: id }, '*');
      }
    };
    const handleMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      document.querySelectorAll('.te-hover-tip').forEach(t => t.remove());
      if (el) {
        const id = el.dataset.sectionId!;
        const rect = el.getBoundingClientRect();
        const tip = document.createElement('div');
        tip.className = 'te-hover-tip';
        tip.textContent = getLabel(id);
        tip.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;background:#5850ec;color:#fff;padding:4px 10px;font-size:11px;font-weight:700;border-radius:4px 4px 4px 0;z-index:99999;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.2);`;
        document.body.appendChild(tip);
        el.classList.add('te-hover-outline');
        window.parent.postMessage({ type: 'te:hover', sectionId: id }, '*');
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (el) el.classList.remove('te-hover-outline');
      document.querySelectorAll('.te-hover-tip').forEach(t => t.remove());
      window.parent.postMessage({ type: 'te:hoverOut' }, '*');
    };
    
    // ── Drag & Drop dentro del iframe ──
    let draggedSectionId: string | null = null;
    let draggedEl: HTMLElement | null = null;
    let dropIndicator: HTMLDivElement | null = null;
    
    const createDropIndicator = () => {
      if (!dropIndicator) {
        dropIndicator = document.createElement('div');
        dropIndicator.className = 'te-drop-indicator';
        dropIndicator.style.cssText = 'height:4px;background:#5850ec;border-radius:2px;position:absolute;left:0;right:0;z-index:99998;pointer-events:none;transition:top .15s;';
        document.body.appendChild(dropIndicator);
      }
      return dropIndicator;
    };
    
    const removeDropIndicator = () => {
      if (dropIndicator) {
        dropIndicator.remove();
        dropIndicator = null;
      }
    };
    
    const handleDragStart = (e: DragEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (!el) return;
      draggedSectionId = el.dataset.sectionId || null;
      draggedEl = el;
      el.classList.add('te-dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedSectionId || '');
      }
      // Agregar indicador visual
      createDropIndicator();
    };
    
    const handleDragEnd = (e: DragEvent) => {
      if (draggedEl) draggedEl.classList.remove('te-dragging');
      draggedSectionId = null;
      draggedEl = null;
      removeDropIndicator();
      document.querySelectorAll('.te-drag-over').forEach(el => el.classList.remove('te-drag-over'));
    };
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (!el || el.dataset.sectionId === draggedSectionId) return;
      
      // Mostrar indicador de drop
      const rect = el.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const indicator = createDropIndicator();
      indicator.style.left = rect.left + 'px';
      indicator.style.width = rect.width + 'px';
      indicator.style.top = (e.clientY < midY ? rect.top - 2 : rect.bottom + 2) + 'px';
      
      el.classList.add('te-drag-over');
    };
    
    const handleDragLeave = (e: DragEvent) => {
      const el = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (el) el.classList.remove('te-drag-over');
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const targetEl = (e.target as HTMLElement).closest('[data-section-id]') as HTMLElement;
      if (!targetEl || !draggedSectionId || targetEl.dataset.sectionId === draggedSectionId) return;
      
      const targetId = targetEl.dataset.sectionId!;
      
      // Notificar al parent para reordenar
      window.parent.postMessage({ 
        type: 'te:reorder', 
        fromSectionId: draggedSectionId, 
        toSectionId: targetId,
        position: e.clientY < targetEl.getBoundingClientRect().top + targetEl.getBoundingClientRect().height / 2 ? 'before' : 'after'
      }, '*');
      
      removeDropIndicator();
      targetEl.classList.remove('te-drag-over');
    };
    
    // Hacer las secciones arrastrables
    const makeSectionsDraggable = () => {
      document.querySelectorAll('[data-section-id]').forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.setAttribute('draggable', 'true');
        htmlEl.style.cursor = 'grab';
        htmlEl.addEventListener('dragstart', handleDragStart);
        htmlEl.addEventListener('dragend', handleDragEnd);
        htmlEl.addEventListener('dragover', handleDragOver);
        htmlEl.addEventListener('dragleave', handleDragLeave);
        htmlEl.addEventListener('drop', handleDrop);
      });
    };
    
    // Observar cambios en el DOM para agregar drag a nuevas secciones
    const observer = new MutationObserver(() => makeSectionsDraggable());
    observer.observe(document.body, { childList: true, subtree: true });
    makeSectionsDraggable();
    
    // Agregar estilos CSS para drag
    const style = document.createElement('style');
    style.id = 'te-drag-styles';
    style.textContent = `
      .te-dragging { opacity: 0.5; outline: 2px dashed #5850ec !important; }
      .te-drag-over { outline: 2px solid #5850ec !important; }
      .te-hover-outline { outline: 2px solid rgba(88,80,236,.4) !important; outline-offset: 2px; }
    `;
    document.head.appendChild(style);
    
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      observer.disconnect();
      style.remove();
      removeDropIndicator();
    };
  }, []);

  const sec = (id: string) => isSectionEnabled(sectionCfg, id);
  const ss = (id: string) => getSectionSettings(sectionCfg, id);

  useEffect(() => {
    async function load() {
      const { endpoint, projectId, databaseId } = getAppwriteConfig();
      if (!projectId || !endpoint || !databaseId) {
        setConfigError(true);
        setIsInitialLoading(false);
        return;
      }
      try {
        const { databases } = getServices();
        const bannersPromise = databases.listDocuments(databaseId, BANNERS_COLLECTION, [
          Query.equal('ISACTIVE', true), Query.orderAsc('DISPLAYORDER'), Query.limit(5)
        ]);
        const [pRes, cRes, oRes, liveRes, bRes] = await Promise.all([
          databases.listDocuments(databaseId, PRODUCTS_COLLECTION, [Query.orderDesc('$createdAt'), Query.limit(20)]),
          databases.listDocuments(databaseId, CATEGORIES_COLLECTION, [Query.orderDesc('$createdAt'), Query.limit(12)]),
          databases.listDocuments(databaseId, TIMED_OFFERS_COLLECTION, [Query.equal('isActive', true), Query.equal('status', 'active'), Query.limit(8)]),
          databases.listDocuments(databaseId, LIVE_STREAMS_COLLECTION, [Query.equal('isActive', true), Query.limit(1)]).catch(() => ({ documents: [] })),
          bannersPromise,
        ]);
        setProducts(pRes.documents as unknown as Product[]);
        const cats = cRes.documents as unknown as Category[];
        setCategories(cats.filter(c => c.name && c.$id));
        // Load subcategories
        databases.listDocuments(databaseId, SUBCATEGORIES_COLLECTION, [Query.orderAsc('$createdAt'), Query.limit(50)])
          .then(subRes => setSubcategories(subRes.documents as unknown as Subcategory[]))
          .catch(() => setSubcategories([]));
        const loadedBanners = bRes.documents as unknown as Banner[];
        setBanners(loadedBanners);
        if (loadedBanners.length > 0) setIsInitialLoading(false);
        setOffers((oRes.documents as unknown as TimedOffer[]).filter(isOfferActive));
        if (liveRes.documents.length > 0) setLiveStream(liveRes.documents[0] as unknown as LiveStream);
        // Load mosaic panels + their hotspots
        databases.listDocuments(databaseId, HOTSPOT_PANELS_COLLECTION, [
          Query.equal('ISACTIVE', true), Query.orderAsc('DISPLAYORDER'), Query.limit(20)
        ]).then(async panelRes => {
          const loadedPanels = panelRes.documents as unknown as HotspotPanel[];
          setPanels(loadedPanels);
          if (loadedPanels.length > 0) {
            const hotspotsRes = await databases.listDocuments(databaseId, BANNER_OVERLAY_POSITIONS_COLLECTION, [
              Query.equal('ISACTIVE', true), Query.orderAsc('DISPLAYORDER'), Query.limit(100)
            ]);
            setPanelHotspots(hotspotsRes.documents as unknown as BannerOverlayPosition[]);
          }
        }).catch(() => {});
      } catch (e) { console.error('Error loading data:', e); setConfigError(true); }
      finally {
        window.setTimeout(() => setIsInitialLoading(false), 140);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const hCfg = getSectionSettings(sectionCfg, 'hero_carousel');
    const autoOn = hCfg.autoplay !== false;
    const speed = (hCfg.autoplaySpeed && hCfg.autoplaySpeed >= 2 ? hCfg.autoplaySpeed : 5) * 1000;
    if (banners.length > 1 && autoOn) {
      heroTimer.current = setInterval(() => setHeroIdx(i => (i + 1) % banners.length), speed);
      return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
    }
  }, [banners, sectionCfg]);

  useEffect(() => {
    if (!banners.length || heroImageReady) return;
    const t = window.setTimeout(() => setHeroImageReady(true), 380);
    return () => window.clearTimeout(t);
  }, [banners.length, heroImageReady]);

  useEffect(() => {
    if (!products.length) return;
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const idx = parseInt(el.dataset.idx || '0');
              setTimeout(() => el.classList.add('card-revealed'), idx * 55);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );
      document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [products]);

  /* ── GSAP ScrollTrigger for offers section ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      // Hero card entrance - clear transform after so hover works freely
      if (document.querySelector('.offer-hero-card')) {
        gsap.from('.offer-hero-card', {
          scrollTrigger: { trigger: '.offer-hero-card', start: 'top 85%', toggleActions: 'play none none none' },
          y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform',
        });
      }
      // Badges stagger
      if (document.querySelector('.offer-hero-card') && document.querySelector('.offer-flash-badge, .offer-disc-badge')) {
        gsap.from('.offer-flash-badge, .offer-disc-badge', {
          scrollTrigger: { trigger: '.offer-hero-card', start: 'top 80%', toggleActions: 'play none none none' },
          scale: 0, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)', delay: 0.3, clearProps: 'transform',
        });
      }
      // Side products stagger
      if (document.querySelector('.offer-side-card')) {
        gsap.from('.offer-side-card', {
          scrollTrigger: { trigger: '.offer-side-card', start: 'top 90%', toggleActions: 'play none none none' },
          y: 40, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'transform',
        });
      }
      // Particles entrance
      if (document.querySelector('.offer-hero-card') && document.querySelector('.offer-particle')) {
        gsap.from('.offer-particle', {
          scrollTrigger: { trigger: '.offer-hero-card', start: 'top 80%', toggleActions: 'play none none none' },
          scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'elastic.out(1, 0.5)', delay: 0.5, clearProps: 'transform',
        });
      }
    });
    return () => ctx.revert();
  }, [offers, products]);

  /* ── GSAP ScrollTrigger for collage section ── */
  useEffect(() => {
    if (typeof window === 'undefined' || !panels.length) return;
    const ctx = gsap.context(() => {
      // Staggered cell reveal with clipPath wipe
      if (document.querySelector('.collage-grid') && document.querySelector('.collage-cell')) {
        gsap.from('.collage-cell', {
          scrollTrigger: { trigger: '.collage-grid', start: 'top 85%', toggleActions: 'play none none none' },
          clipPath: 'inset(100% 0 0 0)', opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out',
          clearProps: 'clipPath,opacity',
        });
      }
      // Image parallax zoom on scroll
      if (document.querySelector('.collage-grid') && document.querySelector('.collage-cell-img')) {
        gsap.fromTo('.collage-cell-img', { scale: 1.15 }, {
          scrollTrigger: { trigger: '.collage-grid', start: 'top 90%', end: 'bottom 20%', scrub: 1.2 },
          scale: 1, ease: 'none',
        });
      }
      // Title overlay slide up
      if (document.querySelector('.collage-grid') && document.querySelector('.collage-title-overlay')) {
        gsap.from('.collage-title-overlay', {
          scrollTrigger: { trigger: '.collage-grid', start: 'top 80%', toggleActions: 'play none none none' },
          y: 30, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: 'power3.out', clearProps: 'transform,opacity',
        });
      }
      // Hotspot entrance — pop in with elastic
      if (document.querySelector('.collage-grid') && document.querySelector('.hs-wrap')) {
        gsap.from('.hs-wrap', {
          scrollTrigger: { trigger: '.collage-grid', start: 'top 75%', toggleActions: 'play none none none' },
          scale: 0, opacity: 0, duration: 0.8, stagger: 0.15, delay: 0.5, ease: 'elastic.out(1, 0.4)',
        });
      }
    });
    return () => ctx.revert();
  }, [panels, panelHotspots]);

  /* ── GSAP: Global section animations (SmartCards, Categories, Products, Footer) ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      /* Categories section — cards stagger */
      if (document.querySelector('[data-section-id="categories"]') && document.querySelector('[data-section-id="categories"] .category-card')) {
        gsap.from('[data-section-id="categories"] .category-card', {
          scrollTrigger: { trigger: '[data-section-id="categories"]', start: 'top 85%', toggleActions: 'play none none none' },
          y: 40, opacity: 0, scale: 0.92, duration: 0.55, stagger: 0.06, ease: 'power3.out', clearProps: 'transform,opacity',
        });
      }

      /* Recommended section — slide up */
      if (document.querySelector('[data-section-id="recommended"]')) {
        gsap.from('[data-section-id="recommended"]', {
          scrollTrigger: { trigger: '[data-section-id="recommended"]', start: 'top 88%', toggleActions: 'play none none none' },
          y: 50, opacity: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity',
        });
      }

      /* Featured section — slide up */
      if (document.querySelector('[data-section-id="featured"]')) {
        gsap.from('[data-section-id="featured"]', {
          scrollTrigger: { trigger: '[data-section-id="featured"]', start: 'top 88%', toggleActions: 'play none none none' },
          y: 50, opacity: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity',
        });
      }

      /* Product cards inside recommended/featured — stagger */
      if (document.querySelector('[data-section-id="recommended"]') && document.querySelector('[data-section-id="recommended"] [data-reveal]')) {
        gsap.from('[data-section-id="recommended"] [data-reveal]', {
          scrollTrigger: { trigger: '[data-section-id="recommended"]', start: 'top 82%', toggleActions: 'play none none none' },
          y: 30, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity',
        });
      }
      if (document.querySelector('[data-section-id="featured"]') && document.querySelector('[data-section-id="featured"] [data-reveal]')) {
        gsap.from('[data-section-id="featured"] [data-reveal]', {
          scrollTrigger: { trigger: '[data-section-id="featured"]', start: 'top 82%', toggleActions: 'play none none none' },
          y: 30, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity',
        });
      }

      /* Hero carousel — parallax scrub on banner images */
      if (document.querySelector('[data-section-id="hero_carousel"]') && document.querySelector('[data-section-id="hero_carousel"] .te-hero-img')) {
        gsap.fromTo('[data-section-id="hero_carousel"] .te-hero-img', { yPercent: -3 }, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: '[data-section-id="hero_carousel"]', start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
      }

      /* Coupon banner — slide in from left */
      if (document.querySelector('[data-section-id="coupon_banner"]')) {
        gsap.from('[data-section-id="coupon_banner"]', {
          scrollTrigger: { trigger: '[data-section-id="coupon_banner"]', start: 'top 90%', toggleActions: 'play none none none' },
          x: -60, opacity: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity',
        });
      }

      /* Section headings — clip reveal */
      document.querySelectorAll('[data-section-id] h2').forEach(h2 => {
        if (h2) {
          gsap.from(h2, {
            scrollTrigger: { trigger: h2, start: 'top 92%', toggleActions: 'play none none none' },
            clipPath: 'inset(0 100% 0 0)', opacity: 0, duration: 0.6, ease: 'power4.out',
            clearProps: 'clipPath,opacity',
          });
        }
      });

      /* Footer — fade up */
      const footer = document.querySelector('footer, [data-section-id="footer"]');
      if (footer) {
        gsap.from(footer, {
          scrollTrigger: { trigger: footer, start: 'top 95%', toggleActions: 'play none none none' },
          y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', clearProps: 'transform,opacity',
        });
      }
    });
    return () => ctx.revert();
  }, [products, categories, panels]);

  /* ── Hotspot tag position (fixed, escapes overflow) ── */
  useEffect(() => {
    if (!activeHotspot) { setTagPos(null); return; }
    const tryFind = () => {
      const el = document.querySelector(`.hs-wrap[data-open="true"]`) as HTMLElement;
      if (!el) { setTimeout(tryFind, 30); return; }
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setTagPos({ x: cx, y: cy, onRight: cx < window.innerWidth * 0.65 });
    };
    tryFind();
  }, [activeHotspot]);

  /* ── Apply banner_image text color with !important ── */
  useEffect(() => {
    if (!sectionCfg.length) return;
    sectionCfg.forEach(cfg => {
      if (cfg.id.startsWith('banner_image')) {
        const sel = `[data-section-id="${cfg.id}"]`;
        const textColor = cfg.settings.textColor;
        if (textColor) {
          const h2 = document.querySelector(`${sel} h2`) as HTMLElement;
          const p = document.querySelector(`${sel} p`) as HTMLElement;
          if (h2) h2.style.setProperty('color', textColor, 'important');
          if (p) p.style.setProperty('color', textColor, 'important');
        }
      }
    });
  }, [sectionCfg]);

  /*
  if (configError) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center', fontFamily: '"Proxima Nova",Arial,sans-serif' }}>
      <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Tienda no configurada</p>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>No se pudo conectar a Appwrite.</p>
      <Link href="/configurar" style={{ background: '#3483fa', color: '#fff', padding: '10px 24px', borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
        Configurar
      </Link>
    </div>
  );
  */

  // No early skeleton return — hero handles its own skeleton overlay with fade transition

  /* ── Shared styles ── */
  const S = {
    section: {
      background: '#fff',
      borderRadius: 6,
      marginBottom: 16,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,.12)',
    } as React.CSSProperties,
    sectionPad: { padding: 16 } as React.CSSProperties,
    sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } as React.CSSProperties,
    h2: { fontSize: 18, fontWeight: 600, margin: 0, color: '#333' } as React.CSSProperties,
    link: { fontSize: 13, color: '#3483fa', textDecoration: 'none' } as React.CSSProperties,
  };

  const gFontsUrl = buildGoogleFontsUrl(fontCfg, sectionCfg);
  const globalFontStack = fontCfg.globalFont ? `"${fontCfg.globalFont}",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif` : '"Proxima Nova",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif';

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: globalFontStack }}>
      {gFontsUrl && <link href={gFontsUrl} rel="stylesheet" />}
      <style>{`
        @keyframes hp-skeleton-wave { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes gradFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .grad-animated { background-size: 300% 300% !important; animation: gradFlow 6s ease infinite; }
        @keyframes abarTextFlow { 0% { background-position: 0% center; } 100% { background-position: 300% center; } }
        .gradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0) 40%,
              rgba(255,255,255,0.002) 45%,
              rgba(255,255,255,0.008) 50%,
              rgba(255,255,255,0.02) 55%,
              rgba(255,255,255,0.04) 60%,
              rgba(255,255,255,0.07) 65%,
              rgba(255,255,255,0.12) 70%,
              rgba(255,255,255,0.18) 75%,
              rgba(255,255,255,0.27) 80%,
              rgba(255,255,255,0.38) 84%,
              rgba(255,255,255,0.51) 87%,
              rgba(255,255,255,0.65) 90%,
              rgba(255,255,255,0.78) 93%,
              rgba(255,255,255,0.89) 96%,
              rgba(255,255,255,0.96) 98%,
              rgba(255,255,255,1) 100%
            );
          z-index: 5;
          pointer-events: none;
        }
        .te-highlight { outline: 2px solid #3b82f6 !important; outline-offset: -2px; position: relative; }
        .te-highlight::after { content: ''; position: absolute; inset: 0; background: rgba(59,130,246,0.06); pointer-events: none; z-index: 999; }
        .te-hover-outline { outline: 2px dashed #5850ec !important; outline-offset: -2px; cursor: pointer; }

        /* ── Collage Premium Animations ── */
        .collage-cell { will-change: clip-path, opacity; }
        .collage-cell-img { will-change: transform; transition: transform .6s cubic-bezier(.25,.46,.45,.94), filter .4s ease; }
        .collage-cell:hover .collage-cell-img { transform: scale(1.06) !important; filter: brightness(1.05); }
        .collage-cell::after {
          content: ''; position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.04) 70%, rgba(0,0,0,0.12) 100%);
          transition: opacity .4s ease; opacity: 0.7;
        }
        .collage-cell:hover::after { opacity: 1; }
        .collage-title-overlay { transition: transform .4s cubic-bezier(.25,.46,.45,.94); }
        .collage-cell:hover .collage-title-overlay { transform: translateY(-2px); }

        /* ══ HOTSPOT — Hardcore Complex ══ */
        @keyframes hsOrbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes hsOrbitR { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
        @keyframes hsPulseRing { 0%,100% { transform: scale(1); opacity: .5; } 50% { transform: scale(1.8); opacity: 0; } }
        @keyframes hsPulseRing2 { 0%,100% { transform: scale(1); opacity: .3; } 50% { transform: scale(2.4); opacity: 0; } }
        @keyframes hsShineSweep { 0% { transform: translateX(-120%) rotate(25deg); } 100% { transform: translateX(120%) rotate(25deg); } }
        @keyframes hsFloat { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.12); } }
        @keyframes hsParticle1 { 0%,100% { opacity:.8; transform:translate(0,0) scale(1); } 25% { transform:translate(8px,-6px) scale(.7); } 50% { opacity:0; transform:translate(14px,-2px) scale(.3); } 75% { opacity:.5; transform:translate(6px,4px) scale(.6); } }
        @keyframes hsParticle2 { 0%,100% { opacity:.6; transform:translate(0,0) scale(.8); } 25% { transform:translate(-7px,5px) scale(.5); } 50% { opacity:0; transform:translate(-12px,1px) scale(.2); } 75% { opacity:.4; transform:translate(-5px,-6px) scale(.7); } }
        @keyframes hsParticle3 { 0%,100% { opacity:.7; transform:translate(0,0) scale(.9); } 33% { transform:translate(4px,9px) scale(.4); opacity:0; } 66% { transform:translate(-3px,5px) scale(.6); opacity:.5; } }

        .hs-wrap {
          position: absolute; transform: translate(-50%,-50%); z-index: 12; cursor: pointer;
          width: 32px; height: 32px;
          animation: hsFloat 4s ease-in-out infinite;
        }
        /* Outer rotating ring — dashed */
        .hs-ring-outer {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.35);
          animation: hsOrbit 8s linear infinite;
        }
        /* Inner counter-rotating ring — dotted gradient */
        .hs-ring-inner {
          position: absolute; inset: 4px; border-radius: 50%;
          border: 1px dotted rgba(255,255,255,0.25);
          animation: hsOrbitR 6s linear infinite;
        }
        /* Pulse rings */
        .hs-pulse1 {
          position: absolute; inset: 6px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          animation: hsPulseRing 2.5s ease-out infinite;
          pointer-events: none;
        }
        .hs-pulse2 {
          position: absolute; inset: 6px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          animation: hsPulseRing2 2.5s ease-out infinite .6s;
          pointer-events: none;
        }
        /* Core glass sphere */
        .hs-core {
          position: absolute; inset: 8px; border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.12) 65%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.45);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3);
          overflow: hidden;
          transition: box-shadow .3s ease, transform .3s cubic-bezier(.4,0,.2,1);
        }
        /* Shine sweep across core */
        .hs-core::after {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: linear-gradient(25deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%);
          animation: hsShineSweep 3.5s ease-in-out infinite;
        }
        /* Floating particles */
        .hs-particle {
          position: absolute; border-radius: 50%; background: rgba(255,255,255,0.8);
          pointer-events: none;
        }
        .hs-p1 { width:3px; height:3px; top:1px; left:12px; animation: hsParticle1 3s ease-in-out infinite; }
        .hs-p2 { width:2px; height:2px; bottom:2px; right:4px; animation: hsParticle2 3.5s ease-in-out infinite .3s; }
        .hs-p3 { width:2px; height:2px; top:12px; left:1px; animation: hsParticle3 4s ease-in-out infinite .8s; }

        /* Hover state */
        .hs-wrap:hover .hs-core {
          box-shadow: 0 0 16px 4px rgba(255,255,255,0.5), 0 3px 14px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.5);
          transform: scale(1.1);
        }
        .hs-wrap:hover .hs-ring-outer { border-color: rgba(255,255,255,0.8); animation-duration: 4s; }
        .hs-wrap:hover .hs-ring-inner { border-color: rgba(255,255,255,0.6); }
        /* Active state */
        .hs-wrap[data-open="true"] .hs-core {
          background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 100%);
          box-shadow: 0 0 18px 5px rgba(255,255,255,0.6), 0 3px 16px rgba(0,0,0,0.2);
          transform: scale(1.1);
        }
        .hs-wrap[data-open="true"] .hs-ring-outer { animation-play-state: paused; border-color: rgba(255,255,255,0.9); }
        .hs-wrap[data-open="true"] .hs-pulse1, .hs-wrap[data-open="true"] .hs-pulse2 { animation-play-state: paused; }

        /* ══ PRODUCT TAG — Premium floating card ══ */
        @keyframes hsTagIn {
          from { opacity:0; transform:translateY(8px) scale(.9); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes hsTagShimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .hs-tag {
          position: absolute; z-index: 20; width: 210px;
          background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-radius: 14px; padding: 0; overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
          animation: hsTagIn .3s cubic-bezier(.34,1.56,.64,1) forwards;
        }
        .hs-tag.hs-tag-exit {
          animation: hsTagIn .2s cubic-bezier(.4,0,1,1) reverse forwards;
        }
        /* Shimmer strip on top */
        .hs-tag::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: hsTagShimmer 3s ease-in-out infinite 1s;
          z-index: 5; pointer-events: none;
        }
        .hs-tag-img {
          width: 100%; height: 90px; object-fit: cover; display: block;
          border-radius: 14px 14px 0 0;
        }
        .hs-tag-body { padding: 10px 12px 12px; }
        .hs-tag-name {
          font-size: 12px; font-weight: 600; color: #111; line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 3px;
        }
        .hs-tag-price { font-size: 16px; font-weight: 800; color: #111; letter-spacing: -.3px; }
        .hs-tag-old { font-size: 10px; color: #aaa; text-decoration: line-through; margin-left: 5px; }
        .hs-tag-actions { display: flex; gap: 6px; margin-top: 8px; }
        .hs-tag-btn {
          flex: 1; padding: 8px 0; border: none; border-radius: 8px;
          font-size: 11px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 4px;
          transition: transform .12s, opacity .12s;
          letter-spacing: .2px;
        }
        .hs-tag-btn:hover { opacity: .88; transform: translateY(-1px); }
        .hs-tag-btn:active { transform: scale(.95); }
      `}</style>
      {/* ── Dynamic design styles from section config ── */}
      <style>{sectionCfg.map(cfg => {
        const s = cfg.settings; const id = cfg.id;
        const sel = `[data-section-id="${id}"]`;
        const rules: string[] = [];
        if (s.bgColor) rules.push(`${sel}{background-color:${s.bgColor} !important}`);
        if (s.textColor) rules.push(`${sel}{color:${s.textColor} !important}`);
        if (s.headingColor) rules.push(`${sel} h2,${sel} h3,${sel} .section-heading{color:${s.headingColor} !important}`);
        else if (s.textColor) rules.push(`${sel} h2,${sel} h3,${sel} .section-heading{color:${s.textColor} !important}`);
        if (s.accentColor) rules.push(`${sel} a{color:${s.accentColor} !important}`);
        if (s.padding) rules.push(`${sel}{padding:${s.padding}px !important}`);
        if (s.borderRadius) rules.push(`${sel}{border-radius:${s.borderRadius}px !important}`);
        if (s.gap) rules.push(`${sel} .grid,${sel} [style*="gap"]{gap:${s.gap}px !important}`);
        if (s.headingSize) rules.push(`${sel} h2,${sel} h3,${sel} .section-heading{font-size:${s.headingSize}px !important}`);
        if (s.textSize) rules.push(`${sel} p,${sel} span:not(.section-heading){font-size:${s.textSize}px !important}`);
        if (s.fontWeight) rules.push(`${sel} h2,${sel} h3{font-weight:${s.fontWeight} !important}`);
        if (s.cardBgColor) rules.push(`${sel} .da-card,${sel} .product-card{background:${s.cardBgColor} !important}`);
        if (s.cardTextColor) rules.push(`${sel} .da-card,${sel} .product-card{color:${s.cardTextColor} !important}`);
        if (s.borderColor) rules.push(`${sel} .da-card{border-color:${s.borderColor} !important}`);
        if (s.borderColor) rules.push(`${sel} .product-card:not(:hover){border-color:${s.borderColor} !important}`);
        if (s.buttonColor) rules.push(`${sel} .cart-btn{background:${s.buttonColor} !important}`);
        if (s.buttonTextColor) rules.push(`${sel} .cart-btn{color:${s.buttonTextColor} !important}`);
        if (s.cardRadius) rules.push(`${sel} .da-card,${sel} .product-card{border-radius:${s.cardRadius}px !important}`);
        const shadowMap: Record<string,string> = { none: 'none', sm: '0 1px 3px rgba(0,0,0,.1)', md: '0 4px 12px rgba(0,0,0,.15)', lg: '0 8px 24px rgba(0,0,0,.2)' };
        if (s.shadow && shadowMap[s.shadow]) rules.push(`${sel} .da-card{box-shadow:${shadowMap[s.shadow]} !important}`);
        if (s.shadow && shadowMap[s.shadow]) rules.push(`${sel} .product-card:not(:hover){box-shadow:${shadowMap[s.shadow]} !important}`);
        // Per-section fonts
        if (s.fontFamily) rules.push(`${sel}{font-family:"${s.fontFamily}",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif !important}`);
        if (s.headingFontFamily) rules.push(`${sel} h2,${sel} h3,${sel} .section-heading{font-family:"${s.headingFontFamily}",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif !important}`);
        // Hero carousel specific
        if (id === 'hero_carousel' && s.height) rules.push(`${sel} .te-hero-img{max-height:${s.height}px !important}`);
        return rules.join('\n');
      }).join('\n')}</style>

      {/* ════════════════ HEADER SECTIONS (dynamic order) ════════════════ */}
      {sectionCfg
        .filter(s => ['announcement_bar', 'navbar', 'live_banner', 'hero_carousel'].includes(s.id))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(section => {
          if (!sec(section.id)) return null;
          
          // ANNOUNCEMENT BAR
          if (section.id === 'announcement_bar') {
            const ns = getSectionSettings(sectionCfg, 'navbar');
            const navbarGradient = ns.bgGradient || ns.bgColor;
            return <AnnouncementBar key={section.id} sectionCfg={sectionCfg} navbarGradient={navbarGradient} />;
          }
          
          // NAVBAR
          if (section.id === 'navbar') {
            return <Navbar2 key={section.id} initialSettings={getSectionSettings(sectionCfg, 'navbar')} />;
          }
          
          // LIVE BANNER
          if (section.id === 'live_banner' && !liveBannerDismissed) {
            const ls = getSectionSettings(sectionCfg, 'live_banner');
            const bgLive = ls.bgColor || '#dc2626';
            const bgIdle = ls.bgColorIdle || '#374151';
            const txColor = ls.textColor || '#fff';
            const liveText = ls.liveText || 'EN VIVO';
            const idleText = ls.idleText || 'PRÓXIMAMENTE';
            const liveTitle = ls.liveTitle || '¡Estamos en vivo ahora!';
            const idleTitle = ls.idleTitle || 'Stay tuned — Próxima transmisión pronto';
            const ctaText = ls.ctaText || 'Ver transmisión';
            const ctaLink = ls.ctaLink || '';
            const pad = ls.padding ?? 10;
            const rad = ls.borderRadius ?? 0;
            const showBadge = ls.showBadge !== false;
            const pulse = ls.pulseAnimation !== false;

            const lsGrad = ls.bgGradient;
            const lsGradIdle = ls.bgGradientIdle;
            const lsAnimated = ls.gradientAnimated !== false && !!lsGrad;
            const liveBg = lsGrad || bgLive;
            const idleBg = lsGradIdle || bgIdle;
            return liveStream && liveStream.status === 'live' ? (
              <div key={section.id} style={{ position: 'relative' }}>
                <a data-section-id="live_banner" href={ctaLink || liveStream.url} target="_blank" rel="noopener noreferrer"
                  className={lsAnimated ? 'grad-animated' : ''}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundImage: lsGrad ? liveBg : undefined, backgroundColor: lsGrad ? undefined : liveBg, backgroundSize: lsAnimated ? '300% 300%' : 'auto', color: txColor, padding: `${pad}px 20px`, textDecoration: 'none', fontSize: 14, fontWeight: 600, borderRadius: rad }}>
                  {showBadge && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.2)', borderRadius: 4, padding: '3px 10px', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                      {pulse && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'livePulse 1.2s ease-in-out infinite' }} />}
                      {liveText}
                    </span>
                  )}
                  <span>{liveStream.title || liveTitle}</span>
                  {liveStream.platform && <span style={{ fontSize: 11, opacity: .7 }}>{liveStream.platform === 'youtube' ? '▶' : liveStream.platform === 'facebook' ? 'f' : liveStream.platform === 'tiktok' ? '♪' : liveStream.platform === 'twitch' ? '🎮' : liveStream.platform === 'instagram' ? '📷' : ''} {liveStream.platform}</span>}
                  {liveStream.viewerCount && liveStream.viewerCount > 0 && <span style={{ fontSize: 11, opacity: .7, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Eye size={11} />{liveStream.viewerCount}</span>}
                  {ctaText && <span style={{ fontSize: 12, opacity: .8 }}>→ {ctaText}</span>}
                </a>
                <button onClick={dismissLiveBanner} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: txColor, padding: 4, zIndex: 10 }}>
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div key={section.id} style={{ position: 'relative' }}>
                <div data-section-id="live_banner"
                  className={lsAnimated ? 'grad-animated' : ''}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundImage: lsGradIdle ? idleBg : undefined, backgroundColor: lsGradIdle ? undefined : idleBg, backgroundSize: lsAnimated ? '300% 300%' : 'auto', color: txColor, padding: `${pad}px 20px`, fontSize: 14, fontWeight: 600, borderRadius: rad }}>
                  {showBadge && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.15)', borderRadius: 4, padding: '3px 10px', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                      📺 {idleText}
                    </span>
                  )}
                  <span>{idleTitle}</span>
                </div>
                <button onClick={dismissLiveBanner} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: txColor, padding: 4, zIndex: 10 }}>
                  <X size={13} />
                </button>
              </div>
            );
          }
          
          // HERO CAROUSEL
          if (section.id === 'hero_carousel') {
            const heroLoading = banners.length === 0 || !heroImageReady;
            return (
              <div key={section.id} data-section-id="hero_carousel" className="hero-carousel-ml" style={{ position: 'relative', width: '100%', lineHeight: 0 }}>
                <style>{`
                  .hero-carousel-ml .hero-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%) scale(0.85);
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,.1);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 16px rgba(0,0,0,.18), 0 2px 4px rgba(0,0,0,.08);
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1), visibility .3s, background .2s, box-shadow .2s;
                    z-index: 5;
                  }
                  .hero-carousel-ml .hero-arrow-left { left: 20px; }
                  .hero-carousel-ml .hero-arrow-right { right: 20px; }
                  .hero-carousel-ml:hover .hero-arrow {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(-50%) scale(1);
                  }
                  .hero-carousel-ml .hero-arrow:hover {
                    background: #fff;
                    box-shadow: 0 6px 20px rgba(0,0,0,.22), 0 2px 6px rgba(0,0,0,.1);
                    transform: translateY(-50%) scale(1.08);
                  }
                  .hero-carousel-ml .hero-arrow:active {
                    transform: translateY(-50%) scale(0.95);
                  }
                  .hero-carousel-ml .hero-arrow-left:hover { transform: translateY(-50%) scale(1.08) translateX(-2px); }
                  .hero-carousel-ml .hero-arrow-right:hover { transform: translateY(-50%) scale(1.08) translateX(2px); }
                  /* Bordes laterales como hit-zone para triggerear hover (optional visual hint) */
                  .hero-carousel-ml .hero-edge-zone {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 80px;
                    pointer-events: none;
                    z-index: 4;
                    opacity: 0;
                    transition: opacity .3s ease;
                  }
                  .hero-carousel-ml:hover .hero-edge-zone { opacity: 1; }
                  .hero-carousel-ml .hero-edge-left {
                    left: 0;
                    background: linear-gradient(90deg, rgba(0,0,0,.08) 0%, transparent 100%);
                  }
                  .hero-carousel-ml .hero-edge-right {
                    right: 0;
                    background: linear-gradient(270deg, rgba(0,0,0,.08) 0%, transparent 100%);
                  }
                  .hero-carousel-ml .hero-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 999px;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    transition: width .25s cubic-bezier(.4,0,.2,1), background .2s;
                  }
                  .hero-carousel-ml .hero-dot-active {
                    width: 22px;
                    background: #fff;
                  }
                  .hero-carousel-ml .hero-dot-inactive {
                    background: rgba(255,255,255,.55);
                  }
                  .hero-carousel-ml .hero-dot-inactive:hover {
                    background: rgba(255,255,255,.85);
                  }
                `}</style>
                <div style={{ position: 'relative', overflow: 'hidden', width: '100%', aspectRatio: '1920 / 540', background: '#fdf2f8' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: '#fdf2f8', backgroundImage: 'linear-gradient(90deg, #fdf2f8 0%, #fce7f3 45%, #fdf2f8 100%)', backgroundSize: '220% 100%', animation: heroLoading ? 'hp-skeleton-wave 1.2s linear infinite' : 'none', opacity: heroLoading ? 1 : 0, transition: 'opacity .5s ease', pointerEvents: 'none' }} />
                  {banners.map((banner, i) => (
                    <div key={banner.$id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: i === heroIdx ? (heroImageReady ? 1 : 0) : 0, transition: 'opacity .4s ease', zIndex: i === heroIdx ? 1 : 0 }}>
                      {banner.LINKURL ? (
                        <Link href={banner.LINKURL} style={{ display: 'block', width: '100%', height: '100%', lineHeight: 0 }}>
                          <Image src={resolveStorageImageUrl(banner.IMAGEURL)} alt={banner.TITLE || `Banner ${i + 1}`} fill className="te-hero-img" style={{ objectFit: 'cover' }} priority={i === 0} sizes="100vw" onLoad={() => setHeroImageReady(true)} onError={() => setHeroImageReady(true)} unoptimized />
                        </Link>
                      ) : (
                        <Image src={resolveStorageImageUrl(banner.IMAGEURL)} alt={banner.TITLE || `Banner ${i + 1}`} fill className="te-hero-img" style={{ objectFit: 'cover' }} priority={i === 0} sizes="100vw" onLoad={() => setHeroImageReady(true)} onError={() => setHeroImageReady(true)} unoptimized />
                      )}
                    </div>
                  ))}
                  <div className="gradient" />
                </div>
                {banners.length > 1 && (
                  <>
                    {/* Gradient edge zones (sutil oscurecimiento en los laterales al hover) */}
                    <div className="hero-edge-zone hero-edge-left" />
                    <div className="hero-edge-zone hero-edge-right" />

                    {/* Arrow left — estilo MercadoLibre */}
                    <button
                      className="hero-arrow hero-arrow-left"
                      onClick={() => setHeroIdx(i => (i - 1 + banners.length) % banners.length)}
                      aria-label="Anterior"
                      type="button"
                    >
                      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.9)">
                        <path d="M14.0656 4.9325L15.1263 5.99316L9.12254 11.9969L15.1325 18.0069L14.0719 19.0676L7.00122 11.9969L14.0656 4.9325Z" />
                      </svg>
                    </button>

                    {/* Arrow right — estilo MercadoLibre */}
                    <button
                      className="hero-arrow hero-arrow-right"
                      onClick={() => setHeroIdx(i => (i + 1) % banners.length)}
                      aria-label="Siguiente"
                      type="button"
                    >
                      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.9)">
                        <path d="M9.93436 19.0675L8.8737 18.0068L14.8774 11.9997L8.86744 5.99316L9.92811 4.9325L16.9988 11.9997L9.93436 19.0675Z" />
                      </svg>
                    </button>

                    {/* Dots con animación pill expansiva */}
                    <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 5, padding: '6px 10px', background: 'rgba(0,0,0,.12)', backdropFilter: 'blur(8px)', borderRadius: 999 }}>
                      {banners.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setHeroIdx(i)}
                          aria-label={`Ir al slide ${i + 1}`}
                          className={`hero-dot ${i === heroIdx ? 'hero-dot-active' : 'hero-dot-inactive'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          }
          
          return null;
        })}
      <style>{`@keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }`}</style>

      {/* ══ BODY SECTIONS - Dynamic order ══ */}
      {sectionCfg
        .filter(s => !['announcement_bar', 'navbar', 'live_banner', 'hero_carousel'].includes(s.id))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(section => {
          if (!sec(section.id)) return null;
          
          // COUPON BANNER
          if (section.id === 'coupon_banner') {
            const cbs = ss('coupon_banner');
            return (
              <div key={section.id} data-section-id="coupon_banner" style={{ background: '#ffffff', position: 'relative', zIndex: 11, paddingTop: 20, paddingBottom: 20 }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                  <CouponBanner settings={cbs} />
                </div>
              </div>
            );
          }
          
          // SMART CARDS (dynamic notifications/actions based on user state)
          if (section.id === 'feature_cards') {
            return (
              <div key={section.id} data-section-id="feature_cards" style={{ marginTop: -90, position: 'relative', zIndex: 10 }}>
                <div style={{ padding: '0 8%', marginBottom: 28 }}>
                  <SmartCards />
                </div>
              </div>
            );
          }
          
          // CATEGORIES
          if (section.id === 'categories' && categories.length > 0) {
            const catModel = ss(section.id).catModel || 'default';
            const expandedSubs = expandedCat ? subcategories.filter(sc => sc.categoryId === expandedCat) : [];
            const expandedAccent = expandedCat ? getCategoryAccent(categories.find(c => c.$id === expandedCat) || categories[0], categories.findIndex(c => c.$id === expandedCat)) : '#3483fa';
            const expandedCatName = categories.find(c => c.$id === expandedCat)?.name || '';
            const catClick = (cat: Category, hasSubs: boolean, isExp: boolean) => hasSubs ? setExpandedCat(isExp ? null : cat.$id) : (window.location.href = `/productos?categoria=${encodeURIComponent(cat.name || '')}`);
            const catTiltMove = (e: React.MouseEvent<HTMLElement>) => { const el = e.currentTarget; el.style.transition = 'box-shadow .3s, border-color .3s'; const r = el.getBoundingClientRect(); const rx = ((e.clientY - r.top) / r.height - 0.5) * 12; const ry = ((e.clientX - r.left) / r.width - 0.5) * -12; el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.03)`; };
            const catTiltLeave = (e: React.MouseEvent<HTMLElement>) => { const el = e.currentTarget; el.style.transition = ''; el.style.transform = ''; };
            return (
              <div key={section.id} data-section-id="categories" style={{ padding: '0 8% 16px' }}>
                <div style={{ ...S.section, overflow: 'visible' }}>
                  <div style={{ ...S.sectionPad, overflow: 'visible' }}>
                    <div style={S.sectionHeader}>
                      <h2 style={S.h2}>Categorías</h2>
                      <Link href="/productos" style={S.link}>Mostrar todas las categorías</Link>
                    </div>

                    {/* ═══ MODEL: DEFAULT — Grid 3D ═══ */}
                    {catModel === 'default' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 16, overflow: 'visible' }}>
                      {categories.map((cat, idx) => {
                        const accent = getCategoryAccent(cat, idx);
                        const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                        const isExpanded = expandedCat === cat.$id;
                        const hasSubs = catSubs.length > 0;
                        return (
                          <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card" onMouseMove={catTiltMove} onMouseLeave={catTiltLeave}
                            style={{ position: 'relative', background: isExpanded ? `linear-gradient(145deg, ${accent}0a, ${accent}15)` : '#fff', border: isExpanded ? `2px solid ${accent}` : '1px solid rgba(0,0,0,0.05)', borderRadius: 20, padding: '24px 14px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'box-shadow .35s cubic-bezier(.4,0,.2,1), border-color .35s ease, transform .35s cubic-bezier(.4,0,.2,1)', transformStyle: 'preserve-3d', willChange: 'transform', boxShadow: isExpanded ? `0 8px 28px ${accent}18, 0 2px 8px ${accent}10` : '0 1px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}>
                            <div className="cat-accent-bar" style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 3, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, borderRadius: '0 0 4px 4px', opacity: isExpanded ? 1 : 0, transition: 'opacity .3s' }} />
                            <div className="cat-icon-wrap" style={{ width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(145deg, ${accent}06, ${accent}12)`, borderRadius: 24, border: `1.5px solid ${accent}12`, transition: 'transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s', boxShadow: isExpanded ? `0 0 16px ${accent}15` : 'none' }}>
                              {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || 'Categoría'} width={72} height={72} style={{ width: 72, height: 72, objectFit: 'contain' }} /> : <span style={{ fontSize: 36 }}>📦</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: isExpanded ? 700 : 600, color: isExpanded ? accent : '#222', lineHeight: 1.3, textAlign: 'center', transition: 'color .25s', letterSpacing: '-0.2px' }}>{cat.name || 'Sin nombre'}</p>
                            {hasSubs && <div style={{ position: 'absolute', bottom: 8, right: 8, background: `${accent}12`, color: accent, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 10, border: `1px solid ${accent}18` }}>{catSubs.length} sub</div>}
                          </div>
                        );
                      })}
                    </div>)}

                    {/* ═══ MODEL: CAROUSEL — Horizontal scroll pill cards ═══ */}
                    {catModel === 'carousel' && (
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                      {categories.map((cat, idx) => {
                        const accent = getCategoryAccent(cat, idx);
                        const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                        const isExpanded = expandedCat === cat.$id;
                        const hasSubs = catSubs.length > 0;
                        return (
                          <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card" onMouseMove={catTiltMove} onMouseLeave={catTiltLeave}
                            style={{ minWidth: 130, maxWidth: 130, padding: '20px 12px 16px', background: isExpanded ? `linear-gradient(180deg, ${accent}12, ${accent}05)` : '#fff', border: isExpanded ? `2px solid ${accent}` : '1px solid rgba(0,0,0,0.06)', borderRadius: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'box-shadow .3s, border-color .3s, transform .3s', transformStyle: 'preserve-3d', willChange: 'transform', boxShadow: isExpanded ? `0 6px 24px ${accent}25` : '0 2px 8px rgba(0,0,0,0.04)', position: 'relative', flexShrink: 0 }}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(145deg, ${accent}10, ${accent}20)`, border: `2px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .3s, box-shadow .3s' }} className="cat-icon-wrap">
                              {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: '50%' }} /> : <span style={{ fontSize: 30 }}>📦</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: isExpanded ? accent : '#222', textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.2px' }}>{cat.name || 'Sin nombre'}</p>
                            {hasSubs && <span style={{ fontSize: 9, color: accent, fontWeight: 600, opacity: 0.7 }}>{catSubs.length} subcategorías</span>}
                          </div>
                        );
                      })}
                    </div>)}

                    {/* ═══ MODEL: BUBBLE — Instagram Stories style ═══ */}
                    {catModel === 'bubble' && (
                    <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 8, paddingTop: 4, scrollbarWidth: 'none', justifyContent: categories.length <= 6 ? 'center' : 'flex-start' }}>
                      {categories.map((cat, idx) => {
                        const accent = getCategoryAccent(cat, idx);
                        const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                        const isExpanded = expandedCat === cat.$id;
                        const hasSubs = catSubs.length > 0;
                        return (
                          <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card cat-bubble"
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0, minWidth: 80 }}>
                            <div style={{ width: 80, height: 80, borderRadius: '50%', padding: 3, background: isExpanded ? accent : `linear-gradient(135deg, ${accent}90, ${accent}40)`, boxShadow: isExpanded ? `0 0 20px ${accent}40, 0 0 40px ${accent}15` : `0 0 12px ${accent}20`, transition: 'box-shadow .3s, transform .3s, background .3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain' }} /> : <span style={{ fontSize: 32 }}>📦</span>}
                              </div>
                            </div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: isExpanded ? 700 : 600, color: isExpanded ? accent : '#333', textAlign: 'center', lineHeight: 1.2, maxWidth: 80, letterSpacing: '-0.1px' }}>{cat.name || 'Sin nombre'}</p>
                          </div>
                        );
                      })}
                    </div>)}

                    {/* ═══ MODEL: LIST — Premium horizontal rows ═══ */}
                    {catModel === 'list' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {categories.map((cat, idx) => {
                        const accent = getCategoryAccent(cat, idx);
                        const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                        const isExpanded = expandedCat === cat.$id;
                        const hasSubs = catSubs.length > 0;
                        return (
                          <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card"
                            onMouseMove={catTiltMove} onMouseLeave={catTiltLeave}
                            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: isExpanded ? `linear-gradient(90deg, ${accent}08, ${accent}04)` : '#fff', border: isExpanded ? `1.5px solid ${accent}40` : '1px solid rgba(0,0,0,0.05)', borderRadius: 14, cursor: 'pointer', transition: 'box-shadow .3s, border-color .3s, transform .3s', transformStyle: 'preserve-3d', willChange: 'transform', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accent, borderRadius: '14px 0 0 14px', opacity: isExpanded ? 1 : 0, transition: 'opacity .3s' }} className="cat-accent-bar" />
                            <div className="cat-icon-wrap" style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(145deg, ${accent}08, ${accent}15)`, border: `1.5px solid ${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform .3s, box-shadow .3s' }}>
                              {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={48} height={48} style={{ width: 48, height: 48, objectFit: 'contain' }} /> : <span style={{ fontSize: 28 }}>📦</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: isExpanded ? accent : '#1a1a1a', display: 'block', letterSpacing: '-0.3px', transition: 'color .25s' }}>{cat.name || 'Sin nombre'}</span>
                              {hasSubs && <span style={{ fontSize: 11, color: '#999', marginTop: 2, display: 'block' }}>{catSubs.length} subcategorías disponibles</span>}
                            </div>
                            <ChevronRight size={18} color={isExpanded ? accent : '#ccc'} style={{ flexShrink: 0, transition: 'color .25s, transform .25s', transform: isExpanded ? 'rotate(90deg)' : 'none' }} />
                          </div>
                        );
                      })}
                    </div>)}

                    {/* ═══ MODEL: GLASS — Glassmorphism on gradient ═══ */}
                    {catModel === 'glass' && (
                    <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f172a)', borderRadius: 20, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)' }} />
                      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,150,191,0.1), transparent 70%)' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, position: 'relative', zIndex: 1 }}>
                        {categories.map((cat, idx) => {
                          const accent = getCategoryAccent(cat, idx);
                          const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                          const isExpanded = expandedCat === cat.$id;
                          const hasSubs = catSubs.length > 0;
                          return (
                            <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card"
                              onMouseMove={catTiltMove} onMouseLeave={catTiltLeave}
                              style={{ position: 'relative', padding: '20px 10px 16px', background: isExpanded ? `rgba(255,255,255,0.15)` : 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: isExpanded ? `1.5px solid ${accent}80` : '1px solid rgba(255,255,255,0.1)', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'box-shadow .3s, border-color .3s, background .3s, transform .3s', transformStyle: 'preserve-3d', willChange: 'transform', boxShadow: isExpanded ? `0 0 20px ${accent}30, 0 4px 16px rgba(0,0,0,0.2)` : '0 2px 8px rgba(0,0,0,0.15)' }}>
                              <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`, borderRadius: '0 0 4px 4px', opacity: isExpanded ? 1 : 0.3, transition: 'opacity .3s' }} className="cat-accent-bar" />
                              <div className="cat-icon-wrap" style={{ width: 72, height: 72, borderRadius: 18, background: `rgba(255,255,255,0.08)`, border: `1px solid rgba(255,255,255,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .3s, box-shadow .3s' }}>
                                {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain' }} /> : <span style={{ fontSize: 30 }}>📦</span>}
                              </div>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: isExpanded ? accent : 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.3, transition: 'color .25s' }}>{cat.name || 'Sin nombre'}</p>
                              {hasSubs && <div style={{ position: 'absolute', bottom: 5, right: 7, background: `${accent}30`, color: accent, fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 8, border: `1px solid ${accent}40` }}>{catSubs.length} sub</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>)}

                    {/* ═══ MODEL: MAGAZINE — Featured hero + compact grid ═══ */}
                    {catModel === 'magazine' && (() => {
                      const hero = categories[0];
                      const rest = categories.slice(1);
                      const heroAccent = getCategoryAccent(hero, 0);
                      const heroSubs = subcategories.filter(sc => sc.categoryId === hero.$id);
                      const heroExp = expandedCat === hero.$id;
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, overflow: 'visible' }}>
                          <div onClick={() => catClick(hero, heroSubs.length > 0, heroExp)} className="category-card"
                            onMouseMove={catTiltMove} onMouseLeave={catTiltLeave}
                            style={{ gridRow: `span ${Math.min(rest.length, 3)}`, background: heroExp ? `linear-gradient(145deg, ${heroAccent}15, ${heroAccent}08)` : `linear-gradient(145deg, ${heroAccent}06, #fff)`, border: heroExp ? `2px solid ${heroAccent}` : `1.5px solid ${heroAccent}15`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, cursor: 'pointer', transition: 'box-shadow .3s, border-color .3s, transform .3s', transformStyle: 'preserve-3d', willChange: 'transform', position: 'relative', boxShadow: heroExp ? `0 8px 32px ${heroAccent}20` : '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div className="cat-icon-wrap" style={{ width: 110, height: 110, borderRadius: 26, background: `linear-gradient(145deg, ${heroAccent}10, ${heroAccent}20)`, border: `2px solid ${heroAccent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .3s, box-shadow .3s' }}>
                              {hero.iconUrl ? <Image src={hero.iconUrl} alt={hero.name || ''} width={90} height={90} style={{ width: 90, height: 90, objectFit: 'contain' }} /> : <span style={{ fontSize: 48 }}>📦</span>}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: heroExp ? heroAccent : '#111', letterSpacing: '-0.4px' }}>{hero.name || 'Sin nombre'}</p>
                              {heroSubs.length > 0 && <p style={{ margin: '4px 0 0', fontSize: 11, color: heroAccent, fontWeight: 600 }}>{heroSubs.length} subcategorías</p>}
                            </div>
                            <div style={{ position: 'absolute', top: 12, right: 12, background: heroAccent, color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 10, letterSpacing: '0.5px' }}>DESTACADA</div>
                          </div>
                          {rest.map((cat, idx) => {
                            const accent = getCategoryAccent(cat, idx + 1);
                            const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                            const isExpanded = expandedCat === cat.$id;
                            const hasSubs = catSubs.length > 0;
                            return (
                              <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card"
                                onMouseMove={catTiltMove} onMouseLeave={catTiltLeave}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: isExpanded ? `linear-gradient(90deg, ${accent}08, #fff)` : '#fff', border: isExpanded ? `1.5px solid ${accent}40` : '1px solid rgba(0,0,0,0.05)', borderRadius: 14, cursor: 'pointer', transition: 'box-shadow .3s, border-color .3s, transform .3s', transformStyle: 'preserve-3d', willChange: 'transform' }}>
                                <div className="cat-icon-wrap" style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(145deg, ${accent}10, ${accent}18)`, border: `1px solid ${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform .3s' }}>
                                  {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={36} height={36} style={{ width: 36, height: 36, objectFit: 'contain' }} /> : <span style={{ fontSize: 20 }}>📦</span>}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: isExpanded ? accent : '#222', display: 'block', letterSpacing: '-0.2px' }}>{cat.name || 'Sin nombre'}</span>
                                  {hasSubs && <span style={{ fontSize: 10, color: '#999' }}>{catSubs.length} sub</span>}
                                </div>
                                <ChevronRight size={14} color={isExpanded ? accent : '#d1d5db'} />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                    {/* ═══ MODEL: NEON — Neon glow on dark ═══ */}
                    {catModel === 'neon' && (
                    <div style={{ background: '#0a0a0a', borderRadius: 20, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -60, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', bottom: -40, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,150,191,0.06), transparent 70%)', pointerEvents: 'none' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, position: 'relative', zIndex: 1 }}>
                        {categories.map((cat, idx) => {
                          const accent = getCategoryAccent(cat, idx);
                          const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                          const isExpanded = expandedCat === cat.$id;
                          const hasSubs = catSubs.length > 0;
                          return (
                            <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card"
                              style={{ position: 'relative', padding: '20px 10px 16px', background: isExpanded ? `${accent}10` : 'rgba(0,0,0,0.4)', border: isExpanded ? `1.5px solid ${accent}` : `1px solid ${accent}40`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'box-shadow .3s, border-color .3s, background .3s', boxShadow: isExpanded ? `0 0 20px ${accent}30, 0 0 40px ${accent}10, inset 0 0 20px ${accent}08` : `0 0 8px ${accent}15` }}>
                              <div style={{ width: 72, height: 72, borderRadius: 18, background: `${accent}12`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${accent}20, inset 0 0 8px ${accent}08` }}>
                                {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain', filter: 'brightness(1.2)' }} /> : <span style={{ fontSize: 30 }}>📦</span>}
                              </div>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: isExpanded ? accent : `${accent}cc`, textAlign: 'center', lineHeight: 1.3, textShadow: `0 0 8px ${accent}40`, letterSpacing: '0.3px' }}>{cat.name || 'Sin nombre'}</p>
                              {hasSubs && <div style={{ position: 'absolute', bottom: 5, right: 7, background: `${accent}20`, color: accent, fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 8, border: `1px solid ${accent}40`, boxShadow: `0 0 6px ${accent}20` }}>{catSubs.length} sub</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>)}

                    {/* ═══ MODEL: MINIMAL — Clean, no borders ═══ */}
                    {catModel === 'minimal' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                      {categories.map((cat, idx) => {
                        const accent = getCategoryAccent(cat, idx);
                        const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                        const isExpanded = expandedCat === cat.$id;
                        const hasSubs = catSubs.length > 0;
                        return (
                          <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card"
                            style={{ padding: '18px 8px 14px', background: isExpanded ? `${accent}08` : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'background .3s', borderRadius: 12 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: isExpanded ? `${accent}12` : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s, transform .3s', transform: isExpanded ? 'scale(1.08)' : 'scale(1)' }}>
                              {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={44} height={44} style={{ width: 44, height: 44, objectFit: 'contain' }} /> : <span style={{ fontSize: 26 }}>📦</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: isExpanded ? 700 : 500, color: isExpanded ? accent : '#555', textAlign: 'center', lineHeight: 1.3, transition: 'color .25s, font-weight .25s' }}>{cat.name || 'Sin nombre'}</p>
                            {hasSubs && <span style={{ fontSize: 9, color: '#aaa', fontWeight: 500 }}>{catSubs.length}</span>}
                          </div>
                        );
                      })}
                    </div>)}

                    {/* ═══ MODEL: LUXURY — Black + gold, serif ═══ */}
                    {catModel === 'luxury' && (() => {
                      const gold = '#d4a853';
                      const goldLight = '#f0d78c';
                      return (
                    <div style={{ background: 'linear-gradient(135deg, #050505, #111, #050505)', borderRadius: 20, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${gold}50, transparent)` }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${gold}50, transparent)` }} />
                      <div style={{ position: 'absolute', top: -50, right: -30, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${gold}08, transparent 70%)`, pointerEvents: 'none' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, position: 'relative', zIndex: 1 }}>
                        {categories.map((cat, idx) => {
                          const catSubs = subcategories.filter(sc => sc.categoryId === cat.$id);
                          const isExpanded = expandedCat === cat.$id;
                          const hasSubs = catSubs.length > 0;
                          return (
                            <div key={cat.$id || idx} onClick={() => catClick(cat, hasSubs, isExpanded)} className="category-card"
                              style={{ position: 'relative', padding: '22px 12px 18px', background: isExpanded ? `${gold}08` : 'rgba(255,255,255,0.02)', border: isExpanded ? `1px solid ${gold}60` : `1px solid ${gold}20`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'box-shadow .3s, border-color .3s, background .3s', boxShadow: isExpanded ? `0 0 24px ${gold}15, 0 4px 16px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.2)' }}>
                              <div style={{ width: 76, height: 76, borderRadius: 18, background: `linear-gradient(145deg, ${gold}08, ${gold}15)`, border: `1px solid ${gold}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 8px ${gold}10` }}>
                                {cat.iconUrl ? <Image src={cat.iconUrl} alt={cat.name || ''} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain', filter: 'brightness(1.1) contrast(1.05)' }} /> : <span style={{ fontSize: 30 }}>📦</span>}
                              </div>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isExpanded ? goldLight : 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.3, fontFamily: '"Georgia", "Times New Roman", serif', letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'color .25s' }}>{cat.name || 'Sin nombre'}</p>
                              {hasSubs && <div style={{ position: 'absolute', bottom: 5, right: 7, background: `${gold}15`, color: gold, fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 8, border: `1px solid ${gold}30`, letterSpacing: '0.5px' }}>{catSubs.length} sub</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>);
                    })()}

                    {expandedCat && expandedSubs.length > 0 && (
                      <div style={{ marginTop: 14, padding: '18px 20px', background: `linear-gradient(135deg, ${expandedAccent}05, ${expandedAccent}10)`, border: `1.5px solid ${expandedAccent}25`, borderRadius: 18, animation: 'pc-entrance 0.3s ease both', backdropFilter: 'blur(8px)' }}>
                        <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: expandedAccent, display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '-0.2px' }}>
                          <ChevronRight size={13} /> Subcategorías de {expandedCatName}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14, overflow: 'visible' }}>
                          {expandedSubs.map(sc => {
                            const scColor = sc.COLOR || expandedAccent;
                            const scBgImg = sc.BACKGROUND_IMAGE_URL || '';
                            const scIcon = sc.ICON_URL || '';
                            return (
                              <Link key={sc.$id} href={`/productos?categoria=${encodeURIComponent(categories.find(c => c.$id === expandedCat)?.name || '')}&subcategoria=${encodeURIComponent(sc.name || '')}`}
                                className="category-card subcat-card"
                                onMouseMove={e => {
                                  const el = e.currentTarget as HTMLElement;
                                  el.style.transition = 'box-shadow .3s, border-color .3s';
                                  const rect = el.getBoundingClientRect();
                                  const rx = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
                                  const ry = ((e.clientX - rect.left) / rect.width - 0.5) * -10;
                                  el.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px) scale(1.04)`;
                                }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transition = ''; el.style.transform = ''; }}
                                style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: scBgImg ? 'flex-end' : 'flex-start', alignItems: scBgImg ? 'flex-start' : 'center', height: scBgImg ? 180 : 130, padding: scBgImg ? '0' : '16px 14px', borderRadius: 16, background: scBgImg ? 'rgba(0,0,0,0.4)' : `linear-gradient(145deg, #fff, ${scColor}08)`, border: scBgImg ? '1.5px solid rgba(255,255,255,0.2)' : `1.5px solid ${scColor}20`, textDecoration: 'none', cursor: 'pointer', transition: 'box-shadow .35s cubic-bezier(.4,0,.2,1), border-color .35s ease, transform .35s cubic-bezier(.4,0,.2,1)', transformStyle: 'preserve-3d', willChange: 'transform', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', backdropFilter: scBgImg ? 'blur(2px)' : 'none' }}
                              >
                                {scBgImg ? (
                                  <>
                                    <Image src={scBgImg} alt={sc.name || ''} fill quality={90} style={{ objectFit: 'cover', opacity: 0.9, transition: 'transform .5s cubic-bezier(.4,0,.2,1), opacity .4s' }} sizes="220px" className="subcat-bg-img" />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)' }} />
                                    <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                                      {scIcon && <div style={{ width: 64, height: 64, borderRadius: 14, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)' }}><Image src={scIcon} alt="" width={52} height={52} style={{ width: 52, height: 52, objectFit: 'contain' }} /></div>}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)', letterSpacing: '-0.3px', display: 'block', lineHeight: 1.2 }}>{sc.name}</span>
                                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 3, display: 'block' }}>Ver productos →</span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${scColor}40, ${scColor}, ${scColor}40)`, borderRadius: '16px 16px 0 0' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
                                      {scIcon ? (
                                        <div style={{ width: 72, height: 72, borderRadius: 16, background: `linear-gradient(145deg, ${scColor}10, ${scColor}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${scColor}25` }}>
                                          <Image src={scIcon} alt={sc.name || ''} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain' }} />
                                        </div>
                                      ) : (
                                        <div style={{ width: 72, height: 72, borderRadius: 16, background: `linear-gradient(145deg, ${scColor}15, ${scColor}25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                          <span style={{ fontSize: 32, color: scColor }}>📂</span>
                                        </div>
                                      )}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#222', letterSpacing: '-0.3px', display: 'block', lineHeight: 1.3 }}>{sc.name}</span>
                                        <span style={{ fontSize: 10, color: scColor, fontWeight: 600, marginTop: 4, display: 'block' }}>Ver productos →</span>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          
          // OFFERS_FEATURED
          if (section.id === 'offers_featured') {
            const activeOffers = offers.filter(o => isOfferActive(o));
            const mainOffer = activeOffers[0];
            const offerProduct = mainOffer ? products.find(p => p.$id === mainOffer.targetId) : null;
            const sideProducts = products.filter(p => (p.CURRENTPRICE ?? 0) > 0 && (p.CURRENTPRICE ?? 0) < p.PRICE).slice(0, 6);
            if (!mainOffer && sideProducts.length === 0) return null;
            const offerImg = mainOffer?.customImagePath || offerProduct?.IMAGEURL || '';
            return (
              <div key={section.id} data-section-id="offers_featured" className="offer-section-pad" style={{ padding: '0 8% 16px' }}>
                <div style={{ ...S.section, overflow: 'visible' }}>
                  <div style={S.sectionPad}>
                    <div style={{ ...S.sectionHeader, marginBottom: 16 }}>
                      <h2 style={S.h2}>Oferta del día</h2>
                      <Link href="/productos" style={S.link}>Ver todas →</Link>
                    </div>

                    {/* ── Main offer — hero card with seamless image ── */}
                    {mainOffer && (
                      <div className="offer-hero-card" 
                        onMouseMove={e => { const el = e.currentTarget; el.style.transition = 'box-shadow .3s'; const r = el.getBoundingClientRect(); const rx = ((e.clientY - r.top) / r.height - 0.5) * 8; const ry = ((e.clientX - r.left) / r.width - 0.5) * -8; el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.01)`; }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.transition = ''; el.style.transform = ''; }}
                        style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 340, display: 'flex', marginBottom: sideProducts.length > 0 ? 18 : 0, background: '#fff', transformStyle: 'preserve-3d', willChange: 'transform', cursor: 'default' }}>
                        {/* Background image — fills entire right side seamlessly */}
                        {offerImg && (
                          <div className="offer-bg-img" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                            <Image src={offerImg} alt={mainOffer.title} fill quality={95} style={{ objectFit: 'cover', objectPosition: 'right center' }} sizes="100vw" priority />
                            <div className="offer-bg-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #ffffff 0%, #ffffff 30%, rgba(255,255,255,0.97) 38%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.6) 55%, rgba(255,255,255,0.2) 70%, transparent 85%)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.4) 100%)' }} />
                          </div>
                        )}

                        {/* Floating particles */}
                        <div className="offer-particle offer-p1" style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,65,108,0.25)', top: '15%', left: '60%', zIndex: 1 }} />
                        <div className="offer-particle offer-p2" style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: 'rgba(52,131,250,0.2)', top: '70%', left: '55%', zIndex: 1 }} />
                        <div className="offer-particle offer-p3" style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: 'rgba(0,166,80,0.25)', top: '30%', left: '75%', zIndex: 1 }} />
                        <div className="offer-particle offer-p4" style={{ position: 'absolute', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,150,0,0.3)', top: '80%', left: '70%', zIndex: 1 }} />
                        <div className="offer-particle offer-p5" style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,65,108,0.12)', top: '10%', left: '80%', zIndex: 1 }} />

                        {/* Left content */}
                        <div className="offer-content" style={{ position: 'relative', zIndex: 2, flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '52%' }}>
                          {/* Badges */}
                          <div className="offer-badges" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                            <span className="offer-flash-badge" style={{ background: 'linear-gradient(135deg, #ff416c, #ff4b2b)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '6px 14px', borderRadius: 8, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 5 }}><Zap size={12} /> OFERTA FLASH</span>
                            {mainOffer.discountPercentage > 0 && <span className="offer-disc-badge" style={{ background: '#ff3b30', color: '#fff', fontSize: 14, fontWeight: 800, padding: '5px 12px', borderRadius: 8 }}>-{Math.round(mainOffer.discountPercentage)}%</span>}
                          </div>

                          {/* Title */}
                          <Link prefetch={false} href={`/productos/${mainOffer.targetId}`} style={{ textDecoration: 'none' }}>
                            <h3 className="offer-title" style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: '#111', lineHeight: 1.3, letterSpacing: '-0.4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{mainOffer.productName || mainOffer.title}</h3>
                          </Link>

                          {/* Prices — green discount, red original */}
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
                            <span className="offer-price-main" style={{ fontSize: 36, fontWeight: 800, color: '#00a650', letterSpacing: '-1px', fontFamily: 'system-ui' }}>{formatPrice(mainOffer.discountPrice)}</span>
                            {mainOffer.originalPrice > mainOffer.discountPrice && <span className="offer-price-old" style={{ fontSize: 16, color: '#e53935', textDecoration: 'line-through', fontWeight: 600 }}>{formatPrice(mainOffer.originalPrice)}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                            <span className="offer-savings" style={{ fontSize: 13, color: '#00a650', fontWeight: 700 }}>Ahorras {formatPrice(mainOffer.originalPrice - mainOffer.discountPrice)}</span>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ddd' }} />
                            <span style={{ fontSize: 11, color: '#999' }}>Envío gratis</span>
                          </div>

                          {/* Premium countdown — clean, no bar lines */}
                          <div className="offer-countdown-wrap" style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                              <div className="offer-urgency-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff3b30' }} />
                              <span style={{ fontSize: 11, color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Termina en</span>
                            </div>
                            <CountdownBlocks offer={mainOffer} />
                          </div>

                          {/* CTA buttons */}
                          <div style={{ display: 'flex', gap: 10 }}>
                            {offerProduct && offerProduct.STOCK > 0 && (
                              <button className="offer-cta-btn" onClick={() => addItem(offerProduct, 1)} style={{ padding: '12px 28px', background: '#3483fa', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all .2s', boxShadow: '0 2px 12px rgba(52,131,250,0.3)', position: 'relative', overflow: 'hidden' }}>
                                <ShoppingCart size={16} /> Agregar al carrito
                              </button>
                            )}
                            <Link prefetch={false} href={`/productos/${mainOffer.targetId}`} className="offer-details-btn" style={{ padding: '12px 22px', background: 'transparent', color: '#3483fa', border: '1.5px solid #3483fa', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s', position: 'relative', overflow: 'hidden' }}>
                              Ver detalles <ChevronRight size={14} style={{ transition: 'transform .2s' }} />
                            </Link>
                          </div>

                          {/* Stock indicator */}
                          {offerProduct && (
                            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#666' }}>
                              <span className={`${(offerProduct.STOCK ?? 0) <= 5 ? 'offer-urgency-dot' : ''}`} style={{ width: 6, height: 6, borderRadius: '50%', background: (offerProduct.STOCK ?? 0) > 5 ? '#00a650' : '#ff3b30' }} />
                              {(offerProduct.STOCK ?? 0) > 10 ? 'Stock disponible' : (offerProduct.STOCK ?? 0) > 0 ? `¡Solo quedan ${offerProduct.STOCK} unidades!` : 'Agotado'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── Highlighted products — horizontal scroll ── */}
                    {sideProducts.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>Otros descuentos imperdibles</h3>
                        </div>
                        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
                          {sideProducts.map(p => {
                            const cp = p.CURRENTPRICE ?? 0;
                            const discPct = Math.round(((p.PRICE - cp) / p.PRICE) * 100);
                            return (
                              <Link key={p.$id} href={`/productos/${p.$id}`} className="category-card offer-side-card" style={{ textDecoration: 'none', background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 155, maxWidth: 155, flexShrink: 0, transition: 'box-shadow .3s, transform .3s', transformStyle: 'preserve-3d', willChange: 'transform' }}
                                onMouseMove={e => { const el = e.currentTarget; el.style.transition = 'box-shadow .3s'; const r = el.getBoundingClientRect(); const rx = ((e.clientY - r.top) / r.height - 0.5) * 8; const ry = ((e.clientX - r.left) / r.width - 0.5) * -8; el.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px) scale(1.02)`; }}
                                onMouseLeave={e => { const el = e.currentTarget; el.style.transition = ''; el.style.transform = ''; }}>
                                <div className="offer-side-img" style={{ position: 'relative', height: 130, background: '#f8f8f8' }}>
                                  {p.IMAGEURL ? <Image src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME || ''} fill style={{ objectFit: 'contain', padding: 8 }} sizes="155px" unoptimized /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📦</div>}
                                  <span style={{ position: 'absolute', bottom: 6, left: 6, background: '#00a650', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>{discPct}% OFF</span>
                                </div>
                                <div style={{ padding: '8px 10px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#333', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.NAME}</p>
                                  <span style={{ fontSize: 16, fontWeight: 800, color: '#111', marginTop: 'auto' }}>{formatPrice(cp)}</span>
                                  <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>{formatPrice(p.PRICE)}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          
          // COLLAGE INTERACTIVO
          if (section.id === 'collage' && panels.length > 0) {
            const cS = ss('collage');
            const collageLayouts = [
              { id:'A', cells:2, grid:'repeat(2,1fr)', rows:'400px', spans:[{},{}] },
              { id:'B', cells:3, grid:'repeat(3,1fr)', rows:'420px', spans:[{},{},{}] },
              { id:'C', cells:3, grid:'repeat(2,1fr)', rows:'repeat(2,220px)', spans:[{gridRow:'1/3'},{},{}] },
              { id:'D', cells:4, grid:'repeat(2,1fr)', rows:'repeat(2,260px)', spans:[{},{},{},{}] },
              { id:'E', cells:4, grid:'repeat(3,1fr)', rows:'repeat(2,240px)', spans:[{gridColumn:'1/4'},{},{},{}] },
              { id:'F', cells:5, grid:'2fr 1fr 1fr', rows:'repeat(2,280px)', spans:[{gridRow:'1/3'},{},{},{},{}] },
              { id:'G', cells:6, grid:'repeat(3,1fr)', rows:'repeat(2,280px)', spans:[{},{},{},{},{},{}] },
              { id:'H', cells:7, grid:'repeat(4,1fr)', rows:'repeat(2,240px)', spans:[{},{},{},{},{gridColumn:'1/3'},{},{}] },
              { id:'I', cells:2, grid:'repeat(2,1fr)', rows:'520px', spans:[{},{}] },
              { id:'J', cells:3, grid:'repeat(3,1fr)', rows:'520px', spans:[{},{},{}] },
            ];
            const savedLayoutId = typeof window !== 'undefined' ? localStorage.getItem('collage_layout_id') : 'C';
            if (savedLayoutId === 'NONE') return null;
            const layout = collageLayouts.find(l => l.id === savedLayoutId) || collageLayouts[2];
            const borderRadius = cS.borderRadius ?? 10;
            const gridGap = cS.gap ?? 5;
            return (
              <div key={section.id} data-section-id="collage" style={{ padding: '0 8% 32px' }}>
                <div style={{ ...S.section, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 20px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h2 className="section-heading" style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111', letterSpacing: '-0.3px' }}>{cS.title || 'Explora nuestra colección'}</h2>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #e5e7eb, transparent)' }} />
                    </div>
                  </div>
                  <div style={{ padding: '0 20px 20px', position: 'relative' }}>
                    <div className="collage-grid" style={{ display: 'grid', gridTemplateColumns: layout.grid, gridTemplateRows: layout.rows, gap: gridGap, borderRadius, overflow: 'hidden' }}>
                      {Array.from({ length: layout.cells }, (_, cellIdx) => {
                        const panel = panels.find(p => p.CELLINDEX === cellIdx);
                        const cellHotspots = panel ? panelHotspots.filter(h => h.BANNERID === panel.$id) : [];
                        const spanStyle = layout.spans[cellIdx] || {};
                        if (!panel) return (
                          <div key={cellIdx} style={{ position: 'relative', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', ...spanStyle }} />
                        );
                        return (
                          <div
                            key={panel.$id}
                            className="collage-cell"
                            style={{ position: 'relative', overflow: 'hidden', cursor: panel.LINKURL ? 'pointer' : 'default', ...spanStyle }}
                            onClick={() => panel.LINKURL && (window.location.href = panel.LINKURL)}
                          >
                            <img
                              className="collage-cell-img"
                              src={resolveStorageImageUrl(panel.IMAGEURL)}
                              alt={panel.TITLE || ''}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
                            />
                            {panel.TITLE && (
                              <div
                                className="collage-title-overlay"
                                style={{
                                  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
                                  padding: '32px 16px 14px',
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)',
                                }}
                              >
                                <span style={{ color: '#fff', fontSize: 15, fontWeight: 700, textShadow: '0 1px 6px rgba(0,0,0,0.4)', letterSpacing: '-0.2px' }}>{panel.TITLE}</span>
                              </div>
                            )}
                            {/* Hotspots with inline tags */}
                            {cellHotspots.map(hotspot => {
                              const prod = products.find(p => p.$id === hotspot.PRODUCTID);
                              const adjX = Math.max(0, Math.min(1, hotspot.POSITIONX - 0.02));
                              const adjY = Math.max(0, Math.min(1, hotspot.POSITIONY + 0.015));
                              const isOpen = activeHotspot === hotspot.$id;
                              const onRight = adjX < 0.55;
                              return (
                                <div
                                  key={hotspot.$id}
                                  className="hs-wrap"
                                  data-open={isOpen ? 'true' : 'false'}
                                  style={{ left: `${adjX * 100}%`, top: `${adjY * 100}%`, zIndex: isOpen ? 100 : 12 }}
                                  onClick={(e) => { e.stopPropagation(); setActiveHotspot(isOpen ? null : hotspot.$id); }}
                                >
                                  <div className="hs-ring-outer" />
                                  <div className="hs-ring-inner" />
                                  <div className="hs-pulse1" />
                                  <div className="hs-pulse2" />
                                  <div className="hs-core" />
                                  <div className="hs-particle hs-p1" />
                                  <div className="hs-particle hs-p2" />
                                  <div className="hs-particle hs-p3" />
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          
          // RECOMMENDED
          if ((section.id === 'recommended' || section.id === 'products_grid') && products.length > 0) {
            const cS = ss(section.id);
            const style = cS.cardStyle || 'classic';
            const imgH = Math.max(cS.cardImageHeight ?? 260, 260);
            const tilt = cS.cardHoverTilt !== false;
            const zoom = cS.cardHoverZoom !== false;
            const shimmer = cS.cardShimmer !== false;
            const pulse = cS.cardBadgePulse !== false;
            const glow = cS.cardBorderGlow === true;
            const btnShimmer = cS.cardBtnShimmer !== false;
            const overlay = cS.cardOverlayGradient === true;
            const imgFit = cS.cardImageFit || 'cover';
            const cols = cS.columns ?? 4;
            const btnStyle = cS.cardBtnStyle || 'default';
            const favDesign = { favStyle: cS.favStyle, favBgColor: cS.favBgColor, favBgColorActive: cS.favBgColorActive, favIconColor: cS.favIconColor, favIconColorActive: cS.favIconColorActive, favSize: cS.favSize, favAnimation: cS.favAnimation, favShadow: cS.favShadow, favBorder: cS.favBorder } as import('@/components/FavoriteButton').FavDesign;
            const cardCls = ['product-card', style !== 'classic' ? `card-${style}` : '', glow ? 'card-glow' : '', !zoom ? 'card-no-zoom' : '', !shimmer ? 'card-no-shimmer' : '', !pulse ? 'card-no-pulse' : '', overlay ? 'card-overlay-gradient' : '', !btnShimmer ? 'card-no-btn-shimmer' : '', btnStyle !== 'default' ? `btn-${btnStyle}` : ''].filter(Boolean).join(' ');
            const isRec = section.id === 'recommended';
            const items = isRec ? products.slice(0, 8) : products.slice(0, 12);
            const tiltHandler = tilt ? ((e: React.MouseEvent<HTMLDivElement>) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transition = 'box-shadow .35s, border-color .35s';
              const r = el.getBoundingClientRect();
              const rx = ((e.clientY - r.top) / r.height - 0.5) * 14;
              const ry = ((e.clientX - r.left) / r.width - 0.5) * -14;
              el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.01)`;
            }) : undefined;
            const tiltLeave = tilt ? ((e: React.MouseEvent<HTMLDivElement>) => { const el = e.currentTarget as HTMLElement; el.style.transition = ''; el.style.transform = ''; }) : undefined;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: '0 8% 16px' }}>
                <div style={{ ...S.section, overflow: 'visible' }}>
                  {isRec ? (
                    <div style={S.sectionPad}>
                      <div style={{ marginBottom: 16 }}>
                        <h2 style={{ ...S.h2, fontSize: 22, marginBottom: 4 }}>Recomendados para ti</h2>
                        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Sabemos lo que te gusta</p>
                      </div>
                      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12, paddingTop: 10, marginTop: -10, scrollbarWidth: 'none' }}>
                        {items.map((p) => {
                          const cp = p.CURRENTPRICE ?? 0; const price = cp > 0 ? cp : p.PRICE;
                          const hasDisc = cp > 0 && cp < p.PRICE; const discPct = hasDisc ? Math.round(((p.PRICE - cp) / p.PRICE) * 100) : 0;
                          const hasWholesale = (p.WHOLESALEPRICE ?? 0) > 0; const rating = p.RATING ?? 0; const numReviews = p.NUMREVIEWS ?? 0;
                          const stock = p.STOCK ?? 0;
                          const stockColor = stock > 10 ? '#00a650' : stock > 5 ? '#f57c00' : stock > 0 ? '#f73737' : '#999';
                          const stockBg = stock > 10 ? '#f0fff6' : stock > 5 ? '#fff8f0' : stock > 0 ? '#fff0f0' : '#f5f5f5';
                          const stockBorder = stock > 10 ? '#b2e8cc' : stock > 5 ? '#ffd199' : stock > 0 ? '#ffb3b3' : '#ddd';
                          const stockLabel = stock > 10 ? 'Stock disponible' : stock > 5 ? 'Stock limitado' : stock > 0 ? 'Últimas unidades' : 'Sin stock';
                          const img2 = resolveStorageImageUrl(p.IMAGEURL2) || '';
                          return (
                          <div key={p.$id} className={cardCls} style={{ width: 220, flexShrink: 0 }}
                            onMouseMove={tiltHandler} onMouseLeave={tiltLeave}>
                            {shimmer && <div className="card-shimmer" />}
                            {/* ── Floating top actions ── */}
                            <div className="pc-top-actions" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 8 }}>
                              <button className="qv-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(p); }} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 0, opacity: 0, transition: 'all .25s cubic-bezier(.4,0,.2,1)', transform: 'translateY(-4px)' }}><Eye size={13} color="#444" strokeWidth={2.2} /></button>
                              <FavoriteButton productId={p.$id} design={favDesign} />
                            </div>
                            {/* ── Image area with hover swap ── */}
                            <Link prefetch={false} href={`/productos/${p.$id}`} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <div className="pc-img-wrap" style={{ position: 'relative', height: imgH, overflow: 'hidden', background: '#f8f8f8' }}>
                                <div className="card-img pc-img-primary" style={{ position: 'absolute', inset: 0, zIndex: 1, transition: 'opacity .45s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)' }}>
                                  {p.IMAGEURL ? <Image src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME || ''} fill quality={100} sizes="220px" style={{ objectFit: imgFit }} unoptimized /> : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#ccc' }}>📦</span>}
                                </div>
                                {img2 && <div className="pc-img-secondary" style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 2, transition: 'opacity .45s cubic-bezier(.4,0,.2,1)' }}><Image src={img2} alt={p.NAME || ''} fill quality={100} sizes="220px" style={{ objectFit: imgFit }} unoptimized /></div>}
                                {/* ── Badges ── */}
                                <div style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {hasDisc && <span className="pc-badge" style={{ background: 'linear-gradient(135deg,#ff416c,#ff4b2b)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 6, boxShadow: '0 2px 8px rgba(255,65,108,0.25)', animation: pulse ? 'badgeBounce 2s ease-in-out infinite' : 'none', backdropFilter: 'blur(4px)' }}>-{discPct}%</span>}
                                  {hasWholesale && <span className="pc-badge" style={{ background: 'linear-gradient(135deg,#FFD54F,#FF8F00)', color: '#4E342E', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, boxShadow: '0 2px 6px rgba(255,143,0,0.2)' }}>MAYOREO</span>}
                                </div>
                                {/* ── Floating glass action bar ── */}
                                <div className="pc-action-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: 'translateY(100%)', opacity: 0, transition: 'all .3s cubic-bezier(.4,0,.2,1)', padding: '6px 8px', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', borderTop: '1px solid rgba(255,255,255,0.5)', display: 'flex', gap: 5, zIndex: 4 }}>
                                  {stock > 0 ? (<>
                                    <button className="cart-btn pc-act-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); addItem(p, 1); }} style={{ flex: 1, padding: '8px 0', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative', overflow: 'hidden', transition: 'all .2s' }}>
                                      <ShoppingCart size={11} /> Agregar
                                    </button>
                                    <button className="pc-act-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(p); }} style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>
                                      <Eye size={13} color="#555" />
                                    </button>
                                  </>) : <span style={{ width: '100%', textAlign: 'center', fontSize: 10, color: '#e53935', fontWeight: 700, padding: '6px 0' }}>Agotado</span>}
                                </div>
                              </div>
                              {/* ── Product info ── */}
                              <div className="card-info" style={{ padding: '10px 11px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Rating */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 4 }}>
                                  {[1,2,3,4,5].map(i => <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#FFB800' : 'none'} stroke={i <= Math.round(rating) ? '#E6A200' : '#D5D5D5'} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                                  {numReviews > 0 && <span style={{ fontSize: 9, color: '#aaa', marginLeft: 3 }}>({numReviews})</span>}
                                </div>
                                {/* Name */}
                                <p className="pc-name" style={{ margin: '0 0 6px', fontSize: 12.5, fontWeight: 500, lineHeight: 1.4, color: '#333', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color .2s' }}>{p.NAME}</p>
                                {/* Price block */}
                                <div style={{ marginTop: 'auto' }}>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                    <span className="pc-price" style={{ fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.5px', lineHeight: 1 }}>{formatPrice(price)}</span>
                                    {hasDisc && <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through', fontWeight: 400 }}>{formatPrice(p.PRICE)}</span>}
                                  </div>
                                  {hasDisc && <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}><span style={{ fontSize: 10, fontWeight: 700, color: '#00A650' }}>{discPct}% OFF</span>{price < 15000 && <span style={{ fontSize: 9, color: '#00A650', fontWeight: 600 }}>· Envío gratis</span>}</div>}
                                  {stock > 0 && stock <= 5 && <p className="pc-urgency" style={{ margin: '4px 0 0', fontSize: 9, fontWeight: 700, color: '#E53935', display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E53935', display: 'inline-block', animation: 'pcPulse 1.5s ease-in-out infinite' }} />{stockLabel}</p>}
                                </div>
                              </div>
                            </Link>
                          </div>);
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ ...S.sectionHeader, ...S.sectionPad, paddingBottom: 0, marginBottom: 0, borderBottom: '1px solid #e6e6e6' }}>
                        <h2 style={S.h2}>Productos destacados</h2>
                        <Link href="/productos" style={{ ...S.link, display: 'flex', alignItems: 'center', gap: 2 }}>Ver todos <ChevronRight size={13} /></Link>
                      </div>
                      <div style={{ ...S.sectionPad, display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(220px, 1fr))`, gap: 16, paddingTop: 20 }}>
                        {items.map((p) => {
                          const cp = p.CURRENTPRICE ?? 0; const price = cp > 0 ? cp : p.PRICE;
                          const hasDisc = cp > 0 && cp < p.PRICE; const discPct = hasDisc ? Math.round(((p.PRICE - cp) / p.PRICE) * 100) : 0;
                          const hasWholesale = (p.WHOLESALEPRICE ?? 0) > 0; const rating = p.RATING ?? 0; const numReviews = p.NUMREVIEWS ?? 0;
                          const stock = p.STOCK ?? 0;
                          const stockColor = stock > 10 ? '#00a650' : stock > 5 ? '#f57c00' : stock > 0 ? '#f73737' : '#999';
                          const stockBg = stock > 10 ? '#f0fff6' : stock > 5 ? '#fff8f0' : stock > 0 ? '#fff0f0' : '#f5f5f5';
                          const stockBorder = stock > 10 ? '#b2e8cc' : stock > 5 ? '#ffd199' : stock > 0 ? '#ffb3b3' : '#ddd';
                          const stockLabel = stock > 10 ? 'Stock disponible' : stock > 5 ? 'Stock limitado' : stock > 0 ? 'Últimas unidades' : 'Sin stock';
                          const img2 = resolveStorageImageUrl(p.IMAGEURL2) || '';
                          return (
                          <div key={p.$id} className={cardCls}
                            onMouseMove={tiltHandler} onMouseLeave={tiltLeave}>
                            {shimmer && <div className="card-shimmer" />}
                            <div className="pc-top-actions" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 8 }}>
                              <button className="qv-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(p); }} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 0, opacity: 0, transition: 'all .25s cubic-bezier(.4,0,.2,1)', transform: 'translateY(-4px)' }}><Eye size={13} color="#444" strokeWidth={2.2} /></button>
                              <FavoriteButton productId={p.$id} design={favDesign} />
                            </div>
                            <Link prefetch={false} href={`/productos/${p.$id}`} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <div className="pc-img-wrap" style={{ position: 'relative', height: imgH, overflow: 'hidden', background: '#f8f8f8' }}>
                                <div className="card-img pc-img-primary" style={{ position: 'absolute', inset: 0, zIndex: 1, transition: 'opacity .45s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)' }}>
                                  {p.IMAGEURL ? <Image src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME || ''} fill quality={100} sizes="220px" style={{ objectFit: imgFit }} unoptimized /> : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#ccc' }}>📦</span>}
                                </div>
                                {img2 && <div className="pc-img-secondary" style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 2, transition: 'opacity .45s cubic-bezier(.4,0,.2,1)' }}><Image src={img2} alt={p.NAME || ''} fill quality={100} sizes="220px" style={{ objectFit: imgFit }} unoptimized /></div>}
                                <div style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {hasDisc && <span className="pc-badge" style={{ background: 'linear-gradient(135deg,#ff416c,#ff4b2b)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 6, boxShadow: '0 2px 8px rgba(255,65,108,0.25)', animation: pulse ? 'badgeBounce 2s ease-in-out infinite' : 'none', backdropFilter: 'blur(4px)' }}>-{discPct}%</span>}
                                  {hasWholesale && <span className="pc-badge" style={{ background: 'linear-gradient(135deg,#FFD54F,#FF8F00)', color: '#4E342E', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, boxShadow: '0 2px 6px rgba(255,143,0,0.2)' }}>MAYOREO</span>}
                                </div>
                                <div className="pc-action-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: 'translateY(100%)', opacity: 0, transition: 'all .3s cubic-bezier(.4,0,.2,1)', padding: '6px 8px', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', borderTop: '1px solid rgba(255,255,255,0.5)', display: 'flex', gap: 5, zIndex: 4 }}>
                                  {stock > 0 ? (<>
                                    <button className="cart-btn pc-act-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); addItem(p, 1); }} style={{ flex: 1, padding: '8px 0', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative', overflow: 'hidden', transition: 'all .2s' }}>
                                      <ShoppingCart size={11} /> Agregar
                                    </button>
                                    <button className="pc-act-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(p); }} style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>
                                      <Eye size={13} color="#555" />
                                    </button>
                                  </>) : <span style={{ width: '100%', textAlign: 'center', fontSize: 10, color: '#e53935', fontWeight: 700, padding: '6px 0' }}>Agotado</span>}
                                </div>
                              </div>
                              {/* ── Product info ── */}
                              <div className="card-info" style={{ padding: '10px 11px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 4 }}>
                                  {[1,2,3,4,5].map(i => <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#FFB800' : 'none'} stroke={i <= Math.round(rating) ? '#E6A200' : '#D5D5D5'} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                                  {numReviews > 0 && <span style={{ fontSize: 9, color: '#aaa', marginLeft: 3 }}>({numReviews})</span>}
                                </div>
                                <p className="pc-name" style={{ margin: '0 0 6px', fontSize: 12.5, fontWeight: 500, lineHeight: 1.4, color: '#333', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color .2s' }}>{p.NAME}</p>
                                <div style={{ marginTop: 'auto' }}>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                    <span className="pc-price" style={{ fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.5px', lineHeight: 1 }}>{formatPrice(price)}</span>
                                    {hasDisc && <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through', fontWeight: 400 }}>{formatPrice(p.PRICE)}</span>}
                                  </div>
                                  {hasDisc && <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}><span style={{ fontSize: 10, fontWeight: 700, color: '#00A650' }}>{discPct}% OFF</span>{price < 15000 && <span style={{ fontSize: 9, color: '#00A650', fontWeight: 600 }}>· Envío gratis</span>}</div>}
                                  {stock > 0 && stock <= 5 && <p className="pc-urgency" style={{ margin: '4px 0 0', fontSize: 9, fontWeight: 700, color: '#E53935', display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E53935', display: 'inline-block', animation: 'pcPulse 1.5s ease-in-out infinite' }} />{stockLabel}</p>}
                                </div>
                              </div>
                            </Link>
                          </div>);
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          }
          
          // BANNER DE IMAGEN
          if (section.id === 'banner_image' || section.id.startsWith('banner_image_')) {
            const bS = ss(section.id);
            const hasPad = (bS.borderRadius ?? 0) > 0;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: hasPad ? '0 8% 32px' : '0 0 32px' }}>
                <div style={{
                  position: 'relative', width: '100%', height: bS.height || 400,
                  background: bS.imageUrl ? `url(${JSON.stringify(bS.imageUrl)}) center/cover no-repeat` : (bS.bgColor || '#111827'),
                  borderRadius: bS.borderRadius || 0, overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: bS.imageUrl ? 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)' : 'none', opacity: bS.maskOpacity ?? 1 }} />
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 700 }}>
                    {bS.overlayText && (
                      <h2 style={{ fontSize: 38, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: bS.textColor || '#fff', margin: '0 0 14px', lineHeight: 1.2, textShadow: bS.imageUrl ? '0 2px 16px rgba(0,0,0,0.45)' : 'none', letterSpacing: '-0.5px' }}>
                        {bS.overlayText}
                      </h2>
                    )}
                    {bS.subtitle && (
                      <p style={{ fontSize: 18, color: bS.textColor || '#fff', margin: '0 0 30px', opacity: 0.88, lineHeight: 1.65, textShadow: bS.imageUrl ? '0 1px 6px rgba(0,0,0,0.4)' : 'none' }}>
                        {bS.subtitle}
                      </p>
                    )}
                    {bS.buttonText && (
                      <Link href={bS.buttonLink || '#'} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '14px 36px', background: bS.buttonColor || '#3483fa',
                        color: bS.buttonTextColor || '#fff', borderRadius: Math.max((bS.borderRadius || 0), 8),
                        fontWeight: 700, textDecoration: 'none', fontSize: 15,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.25)', transition: 'transform .2s, box-shadow .2s',
                      }}>
                        {bS.buttonText} <ChevronRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // IMAGEN CON TEXTO
          if (section.id === 'image_text' || section.id.startsWith('image_text_')) {
            const iS = ss(section.id);
            const imgLeft = (iS.imagePosition || 'left') === 'left';
            const itModel = iS.imageTextModel || 'classic';
            const r = iS.borderRadius ?? 12;
            const itImg = iS.imageUrl ? (
              <Image src={iS.imageUrl} alt={iS.title || 'Sección'} fill style={{ objectFit: 'cover' }} sizes="48vw" />
            ) : null;
            const itText = (txtColor?: string) => (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {iS.title && <h2 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: txtColor || iS.headingColor || '#111', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>{iS.title}</h2>}
                {iS.description && <p style={{ fontSize: 16, color: txtColor ? `${txtColor}cc` : iS.textColor || '#374151', lineHeight: 1.75, margin: '0 0 28px', maxWidth: 480 }}>{iS.description}</p>}
                {iS.buttonText && <div><Link href={iS.buttonLink || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: iS.buttonColor || iS.accentColor || '#3483fa', color: iS.buttonTextColor || '#fff', borderRadius: r, fontWeight: 700, textDecoration: 'none', fontSize: 15, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'all .2s' }}>{iS.buttonText} <ChevronRight size={16} /></Link></div>}
              </div>
            );

            /* ── Modelo: OVERLAP ── */
            if (itModel === 'overlap') return (
              <div key={section.id} data-section-id={section.id} style={{ display: 'flex', justifyContent: 'center', padding: '0 3% 32px' }}>
                <div style={{ width: '100%', maxWidth: 1000, position: 'relative', display: 'flex', flexDirection: imgLeft ? 'row' : 'row-reverse', alignItems: 'center', gap: 0, minHeight: 380 }}>
                  <div style={{ flex: '0 0 45%', position: 'relative', height: 360, borderRadius: r, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', zIndex: 2, marginTop: 20 }}>{itImg}</div>
                  <div style={{ flex: 1, background: iS.bgColor || '#fff', borderRadius: r, padding: '52px 48px', marginLeft: imgLeft ? -40 : 0, marginRight: imgLeft ? 0 : -40, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 1 }}>{itText()}</div>
                </div>
              </div>
            );

            /* ── Modelo: FULLBLEED ── */
            if (itModel === 'fullbleed') return (
              <div key={section.id} data-section-id={section.id} style={{ display: 'flex', justifyContent: 'center', padding: '0 3% 32px' }}>
                <div style={{ width: '100%', maxWidth: 1000, position: 'relative', minHeight: 400, borderRadius: r, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {iS.imageUrl && <Image src={iS.imageUrl} alt={iS.title || ''} fill style={{ objectFit: 'cover' }} sizes="100vw" />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '48px 32px', maxWidth: 600 }}>{itText('#fff')}</div>
                </div>
              </div>
            );

            /* ── Modelo: CARD (vertical) ── */
            if (itModel === 'card') return (
              <div key={section.id} data-section-id={section.id} style={{ display: 'flex', justifyContent: 'center', padding: '0 3% 32px' }}>
                <div style={{ width: '100%', maxWidth: 560, background: iS.bgColor || '#fff', borderRadius: r, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <div style={{ position: 'relative', width: '100%', height: 280 }}>{itImg}</div>
                  <div style={{ padding: '36px 32px' }}>{itText()}</div>
                </div>
              </div>
            );

            /* ── Modelo: SPLIT (diagonal) ── */
            if (itModel === 'split') return (
              <div key={section.id} data-section-id={section.id} style={{ display: 'flex', justifyContent: 'center', padding: '0 3% 32px' }}>
                <div style={{ width: '100%', maxWidth: 1000, position: 'relative', minHeight: 380, borderRadius: r, overflow: 'hidden', display: 'flex', flexDirection: imgLeft ? 'row' : 'row-reverse', background: iS.bgColor || '#fff' }}>
                  <div style={{ flex: '0 0 50%', clipPath: imgLeft ? 'polygon(0 0,100% 0,85% 100%,0 100%)' : 'polygon(15% 0,100% 0,100% 100%,0 100%)' }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>{itImg}</div>
                  </div>
                  <div style={{ flex: 1, padding: '48px 40px', display: 'flex', alignItems: 'center' }}>{itText()}</div>
                </div>
              </div>
            );

            /* ── Modelo: CLASSIC (default) ── */
            return (
              <div key={section.id} data-section-id={section.id} style={{ display: 'flex', justifyContent: 'center', padding: '0 3% 32px' }}>
                <div style={{ width: '100%', maxWidth: 1000 }}>
                  <div style={{
                    ...S.section, overflow: 'hidden',
                    background: iS.bgColor || '#fff',
                    display: 'flex', flexDirection: imgLeft ? 'row' : 'row-reverse',
                    alignItems: 'stretch', minHeight: 340, borderRadius: r,
                  }}>
                    <div style={{ flex: '0 0 48%', position: 'relative', minHeight: 320, padding: '28px' }}>
                      {iS.imageUrl ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: Math.max(r - 4, 0), overflow: 'hidden' }}>{itImg}</div>
                      ) : (
                        <div style={{ width: '100%', height: '100%', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', borderRadius: Math.max(r - 4, 0), fontSize: 64, opacity: 0.4 }}>🖼️</div>
                      )}
                    </div>
                    <div style={{ flex: 1, padding: '52px 44px' }}>{itText()}</div>
                  </div>
                </div>
              </div>
            );
          }

          // COLECCIÓN DESTACADA
          if ((section.id === 'featured_collection' || section.id.startsWith('featured_collection_')) && products.length > 0) {
            const fcS = ss(section.id);
            const fcItems = products.slice(0, fcS.itemsCount || 8);
            const fcCols = fcS.columns ?? 4;
            const shadowMap: Record<string, string> = { none: 'none', sm: '0 1px 3px rgba(0,0,0,0.06)', md: '0 4px 12px rgba(0,0,0,0.1)', lg: '0 8px 24px rgba(0,0,0,0.14)' };
            const fcShadow = shadowMap[fcS.shadow || 'sm'];
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: '0 8% 32px' }}>
                <div style={{ ...S.section, background: fcS.bgColor || '#fff', overflow: 'visible', borderRadius: fcS.borderRadius ?? 8 }}>
                  <div style={S.sectionPad}>
                    <div style={S.sectionHeader}>
                      <h2 style={{ ...S.h2, color: fcS.headingColor || '#111' }}>{fcS.title || 'Colección destacada'}</h2>
                      {fcS.showViewAll !== false && <Link href="/productos" style={{ ...S.link, display: 'flex', alignItems: 'center', gap: 2 }}>Ver todos <ChevronRight size={13} /></Link>}
                    </div>
                    {fcS.subtitle && <p style={{ margin: '-8px 0 20px', fontSize: 13, color: fcS.textColor || '#888' }}>{fcS.subtitle}</p>}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${fcCols}, 1fr)`, gap: fcS.gap || 16, marginTop: 16 }}>
                      {fcItems.map(p => {
                        const cp = p.CURRENTPRICE ?? 0;
                        const price = cp > 0 ? cp : p.PRICE;
                        const hasDisc = cp > 0 && cp < p.PRICE;
                        const discPct = hasDisc ? Math.round(((p.PRICE - cp) / p.PRICE) * 100) : 0;
                        return (
                          <Link key={p.$id} href={`/productos/${p.$id}`}
                            style={{ textDecoration: 'none', background: fcS.cardBgColor || '#fff', borderRadius: fcS.borderRadius ?? 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: fcShadow, border: '1px solid rgba(0,0,0,0.06)', transition: 'box-shadow .25s, transform .25s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = fcShadow; }}>
                            <div style={{ position: 'relative', paddingBottom: '80%', background: '#f8f8f8' }}>
                              {p.IMAGEURL ? <Image src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME || ''} fill style={{ objectFit: 'contain', padding: 8 }} sizes={`${Math.round(100 / fcCols)}vw`} unoptimized /> : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>📦</span>}
                              {hasDisc && <span style={{ position: 'absolute', bottom: 8, left: 8, background: '#e53935', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5 }}>-{discPct}%</span>}
                            </div>
                            <div style={{ padding: '10px 12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500, color: fcS.cardTextColor || '#333', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.NAME}</p>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 'auto', paddingTop: 4 }}>
                                <span style={{ fontSize: 17, fontWeight: 800, color: fcS.accentColor || '#111' }}>{formatPrice(price)}</span>
                                {hasDisc && <span style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>{formatPrice(p.PRICE)}</span>}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // TESTIMONIALS
          if (section.id === 'testimonials' || section.id.startsWith('testimonials_')) {
            const tS = ss(section.id);
            const r = tS.borderRadius ?? 12;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: r > 0 ? '0 8% 32px' : '0 0 32px' }}>
                <TestimonialsSection s={tS} />
              </div>
            );
          }

          // NEWSLETTER
          if (section.id === 'newsletter' || section.id.startsWith('newsletter_')) {
            const nlS = ss(section.id);
            const r = nlS.borderRadius ?? 0;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: r > 0 ? '0 8% 32px' : '0 0 32px' }}>
                <NewsletterSection s={nlS} />
              </div>
            );
          }

          // COUNTDOWN
          if (section.id === 'countdown' || section.id.startsWith('countdown_')) {
            const cdS = ss(section.id);
            const r = cdS.borderRadius ?? 0;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: r > 0 ? '0 8% 32px' : '0 0 32px' }}>
                <CountdownSection s={cdS} />
              </div>
            );
          }

          // FAQ
          if (section.id === 'faq' || section.id.startsWith('faq_')) {
            const fqS = ss(section.id);
            const r = fqS.borderRadius ?? 0;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: r > 0 ? '0 8% 32px' : '0 0 32px' }}>
                <FaqSection s={fqS} />
              </div>
            );
          }

          // VIDEO
          if (section.id === 'video' || section.id.startsWith('video_')) {
            const vS = ss(section.id);
            const embedUrl = getEmbedUrl(vS.videoUrl || '');
            const r = vS.borderRadius ?? 12;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: '0 8% 32px' }}>
                <div style={{ background: vS.bgColor || '#000', borderRadius: r, overflow: 'hidden', padding: `${vS.padding ?? 32}px 24px` }}>
                  {vS.title && <h2 style={{ fontSize: 24, fontWeight: 700, color: vS.headingColor || '#fff', margin: '0 0 20px', textAlign: 'center' }}>{vS.title}</h2>}
                  {vS.subtitle && <p style={{ fontSize: 14, color: vS.textColor || '#fff', textAlign: 'center', margin: '-12px 0 20px', opacity: 0.75 }}>{vS.subtitle}</p>}
                  {embedUrl ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: Math.max(r - 4, 8), overflow: 'hidden', background: '#111' }}>
                      <iframe src={embedUrl} title={vS.title || 'Video'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  ) : (
                    <div style={{ height: 300, background: '#111', borderRadius: Math.max(r - 4, 8), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#666' }}>
                      <span style={{ fontSize: 48 }}>🎬</span>
                      <span style={{ fontSize: 13 }}>Configura una URL de YouTube o Vimeo en el editor</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // RICH TEXT
          if (section.id === 'rich_text' || section.id.startsWith('rich_text_')) {
            const rS = ss(section.id);
            const r = rS.borderRadius ?? 0;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: r > 0 ? '0 8% 32px' : '0 0 32px' }}>
                <div style={{ background: rS.bgColor || '#fff', borderRadius: r, padding: `${rS.padding ?? 48}px ${Math.min(rS.padding ?? 48, 64)}px` }}>
                  {rS.title && <h2 style={{ fontSize: 26, fontWeight: 800, color: rS.headingColor || '#111827', margin: '0 0 20px' }}>{rS.title}</h2>}
                  {rS.htmlContent ? (
                    <div style={{ color: rS.textColor || '#374151', fontSize: 15, lineHeight: 1.8 }}
                      dangerouslySetInnerHTML={{ __html: rS.htmlContent }} />
                  ) : (
                    <p style={{ color: '#9ca3af', fontSize: 13 }}>Agrega contenido HTML en el editor → pestaña Contenido</p>
                  )}
                </div>
              </div>
            );
          }

          // LOGO LIST
          if (section.id === 'logo_list' || section.id.startsWith('logo_list_')) {
            const lS = ss(section.id);
            const logos = lS.logos || [];
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: '0 8% 32px' }}>
                <div style={{ background: lS.bgColor || '#fff', borderRadius: 0, padding: `${lS.padding ?? 32}px 24px` }}>
                  {lS.title && <p style={{ fontSize: 11, fontWeight: 700, color: lS.headingColor || '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', margin: '0 0 24px' }}>{lS.title}</p>}
                  {logos.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: lS.gap ?? 32, justifyContent: 'center', alignItems: 'center' }}>
                      {logos.map((logo, i) => (
                        logo.link ? (
                          <a key={i} href={logo.link} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.6, transition: 'opacity .2s', display: 'block' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6'; }}>
                            <img src={logo.url} alt={logo.alt || `Logo ${i + 1}`} style={{ height: 40, objectFit: 'contain', maxWidth: 140 }} />
                          </a>
                        ) : (
                          <img key={i} src={logo.url} alt={logo.alt || `Logo ${i + 1}`} style={{ height: 40, objectFit: 'contain', maxWidth: 140, opacity: 0.6 }} />
                        )
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '24px 0' }}>Agrega logos en el editor → pestaña Contenido</div>
                  )}
                </div>
              </div>
            );
          }

          // MAP
          if (section.id === 'map' || section.id.startsWith('map_')) {
            const mS = ss(section.id);
            const r = mS.borderRadius ?? 0;
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: r > 0 ? '0 8% 32px' : '0 0 32px' }}>
                <div style={{ background: mS.bgColor || '#fff', borderRadius: r, overflow: 'hidden', padding: `${mS.padding ?? 32}px` }}>
                  {mS.title && <h2 style={{ fontSize: 22, fontWeight: 700, color: mS.headingColor || '#111827', margin: '0 0 16px' }}>{mS.title}</h2>}
                  {mS.mapEmbed ? (
                    <div style={{ borderRadius: Math.max(r - 4, 4), overflow: 'hidden' }}
                      dangerouslySetInnerHTML={{ __html: mS.mapEmbed.replace(/width="[^"]*"/g, 'width="100%"').replace(/height="[^"]*"/g, `height="${mS.height || 400}"`) }} />
                  ) : (
                    <div style={{ height: mS.height || 400, background: '#f3f4f6', borderRadius: Math.max(r - 4, 4), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#9ca3af' }}>
                      <span style={{ fontSize: 40 }}>📍</span>
                      <span style={{ fontSize: 13 }}>Configura el embed de Google Maps en el editor → pestaña Contenido</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // COLLECTIONS LIST (usa categorías)
          if ((section.id === 'collections_list' || section.id.startsWith('collections_list_')) && categories.length > 0) {
            const clS = ss(section.id);
            const cols = clS.columns ?? 3;
            const shadowMap: Record<string, string> = { none: 'none', sm: '0 1px 3px rgba(0,0,0,0.06)', md: '0 4px 12px rgba(0,0,0,0.1)', lg: '0 8px 24px rgba(0,0,0,0.14)' };
            const clShadow = shadowMap[clS.shadow || 'sm'];
            const clItems = categories.slice(0, clS.itemsCount || 6);
            return (
              <div key={section.id} data-section-id={section.id} style={{ padding: '0 8% 32px' }}>
                <div style={{ background: clS.bgColor || '#fff', borderRadius: clS.borderRadius ?? 0, padding: '28px 0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: clS.headingColor || '#111', margin: 0 }}>{clS.title || 'Nuestras colecciones'}</h2>
                    <Link href="/productos" style={{ fontSize: 13, color: clS.accentColor || '#3483fa', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>Ver todas <ChevronRight size={13} /></Link>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: clS.gap ?? 20 }}>
                    {clItems.map((cat, i) => (
                      <Link key={cat.$id || i} href={`/productos?categoria=${encodeURIComponent(cat.name || '')}`}
                        style={{ textDecoration: 'none', background: clS.cardBgColor || '#f9fafb', borderRadius: clS.borderRadius ?? 12, overflow: 'hidden', boxShadow: clShadow, border: '1px solid rgba(0,0,0,0.06)', transition: 'transform .2s, box-shadow .2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = clShadow; }}>
                        <div style={{ position: 'relative', paddingBottom: '60%', background: `linear-gradient(135deg, ${getCategoryAccent(cat, i)}12, ${getCategoryAccent(cat, i)}06)` }}>
                          {cat.iconUrl
                            ? <Image src={cat.iconUrl} alt={cat.name || ''} fill style={{ objectFit: 'contain', padding: 16 }} sizes={`${Math.round(100 / cols)}vw`} />
                            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📦</div>
                          }
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: clS.cardTextColor || '#333', lineHeight: 1.3 }}>{cat.name}</p>
                          {(cat as any).description && <p style={{ margin: '4px 0 0', fontSize: 12, color: clS.textColor || '#888', lineHeight: 1.4 }}>{(cat as any).description}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}

      {/* ════════════════ FOOTER LEGAL ════════════════ */}
      <style>{`
        /* ── Scroll reveal ── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(44px) scale(0.93);
          transition: opacity 0.65s cubic-bezier(0.23,1,0.32,1),
                      transform 0.65s cubic-bezier(0.23,1,0.32,1);
        }
        [data-reveal].card-revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ── Product card base ── */
        .product-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 14px;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          transform-style: preserve-3d;
          perspective: 800px;
          transition: box-shadow .35s cubic-bezier(.4,0,.2,1), border-color .35s ease, transform .35s cubic-bezier(.4,0,.2,1);
          will-change: transform, box-shadow;
        }
        .product-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.04) !important;
          border-color: rgba(0,0,0,0.08) !important;
        }
        .product-card > a,
        .product-card > div {
          overflow: hidden;
          border-radius: 14px;
        }
        .product-card > a {
          border-radius: 14px 14px 0 0;
        }
        .product-card > div:last-child {
          border-radius: 0 0 14px 14px;
        }

        /* ── Image swap on hover ── */
        .product-card:hover .pc-img-secondary { opacity: 1 !important; }
        .product-card:hover .pc-img-primary { opacity: 0.3 !important; }
        .product-card:not(:hover) .pc-img-primary { opacity: 1 !important; }

        /* ── Floating action bar slide up ── */
        .product-card:hover .pc-action-bar {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }

        /* ── Top actions reveal ── */
        .product-card:hover .qv-btn {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* ── Action button micro-interactions ── */
        .pc-act-btn:hover { background: #333 !important; transform: scale(1.04) !important; }
        .pc-act-btn:active { transform: scale(0.96) !important; }

        /* ── Name color on hover ── */
        .product-card:hover .pc-name { color: #111 !important; }

        /* ── Urgency dot pulse ── */
        @keyframes pcPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        /* ── Elegant: Apple-inspired minimal ── */
        .card-elegant {
          border: 1px solid #e5e5e5 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03) !important;
          border-radius: 16px !important;
        }
        .card-elegant:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.06) !important;
          border-color: #ccc !important;
        }
        .card-elegant > a, .card-elegant > div { border-radius: 16px !important; }
        .card-elegant > a { border-radius: 16px 16px 0 0 !important; }
        .card-elegant > div:last-child { border-radius: 0 0 16px 16px !important; }

        /* ── Glassmorphism: frosted glass ── */
        .card-glassmorphism {
          background: rgba(255,255,255,0.12) !important;
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.25) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important;
          border-radius: 14px !important;
        }
        .card-glassmorphism:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
          border-color: rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.18) !important;
        }

        /* ── Neon: dark with glow borders ── */
        .card-neon {
          background: #141414 !important;
          border: 1px solid rgba(0,255,136,0.15) !important;
          box-shadow: 0 0 0 rgba(0,255,136,0) !important;
          border-radius: 10px !important;
        }
        .card-neon:hover {
          border-color: rgba(0,255,136,0.5) !important;
          box-shadow: 0 0 20px rgba(0,255,136,0.12), 0 0 40px rgba(0,255,136,0.06) !important;
        }
        .card-neon > a, .card-neon > div { border-radius: 10px !important; }
        .card-neon > a { border-radius: 10px 10px 0 0 !important; }
        .card-neon > div:last-child { border-radius: 0 0 10px 10px !important; }
        .card-neon p, .card-neon span { color: #e0e0e0 !important; }
        .card-neon .cart-btn { background: linear-gradient(135deg,#00ff88,#00cc6a) !important; color: #000 !important; }

        /* ── Magazine: image-dominant with overlay ── */
        .card-magazine {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important;
          border-radius: 8px !important;
        }
        .card-magazine:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.18) !important;
        }
        .card-magazine > a, .card-magazine > div { border-radius: 8px !important; }
        .card-magazine > a { border-radius: 8px 8px 0 0 !important; }
        .card-magazine > div:last-child { border-radius: 0 0 8px 8px !important; }

        /* ── Floating: elevated with big shadows ── */
        .card-floating {
          border: none !important;
          box-shadow: 0 10px 40px rgba(99,102,241,0.1), 0 4px 16px rgba(0,0,0,0.04) !important;
          border-radius: 20px !important;
        }
        .card-floating:hover {
          box-shadow: 0 16px 48px rgba(99,102,241,0.16), 0 6px 20px rgba(0,0,0,0.06) !important;
          transform: translateY(-6px) !important;
        }
        .card-floating > a, .card-floating > div { border-radius: 20px !important; }
        .card-floating > a { border-radius: 20px 20px 0 0 !important; }
        .card-floating > div:last-child { border-radius: 0 0 20px 20px !important; }

        /* ── Luxury: warm gold accents, premium feel ── */
        .card-luxury {
          background: #fffdf8 !important;
          border: 1px solid #e8dcc8 !important;
          box-shadow: 0 4px 16px rgba(160,120,60,0.06) !important;
          border-radius: 6px !important;
        }
        .card-luxury:hover {
          box-shadow: 0 8px 28px rgba(160,120,60,0.12), 0 2px 8px rgba(0,0,0,0.04) !important;
          border-color: #c9a96e !important;
        }
        .card-luxury > a, .card-luxury > div { border-radius: 6px !important; }
        .card-luxury > a { border-radius: 6px 6px 0 0 !important; }
        .card-luxury > div:last-child { border-radius: 0 0 6px 6px !important; }
        .card-luxury .cart-btn { background: linear-gradient(135deg,#c9a96e,#a8854a) !important; }
        .card-luxury .buy-now-btn { background: #2c2c2c !important; }
        .card-luxury .card-off-badge { background: linear-gradient(135deg,#c9a96e,#8b6914) !important; }

        /* ── Brutalist: bold raw design ── */
        .card-brutalist {
          background: #fff !important;
          border: 3px solid #000 !important;
          box-shadow: 6px 6px 0 #000 !important;
          border-radius: 0px !important;
        }
        .card-brutalist:hover {
          box-shadow: 3px 3px 0 #000 !important;
          transform: translate(3px, 3px) !important;
        }
        .card-brutalist > a, .card-brutalist > div { border-radius: 0px !important; }
        .card-brutalist .cart-btn { background: #000 !important; border-radius: 0 !important; }
        .card-brutalist .buy-now-btn { background: #e53935 !important; border-radius: 0 !important; }

        /* ── Gradient: rainbow border accent ── */
        .card-gradient {
          background: #fff !important;
          border: 2px solid transparent !important;
          background-clip: padding-box !important;
          box-shadow: 0 4px 16px rgba(99,102,241,0.08) !important;
          border-radius: 16px !important;
          position: relative !important;
        }
        .card-gradient::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c, #fda085);
          z-index: -1;
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .card-gradient:hover::before { opacity: 0.7; }
        .card-gradient:hover { box-shadow: 0 8px 28px rgba(118,75,162,0.15) !important; }
        .card-gradient > a, .card-gradient > div { border-radius: 14px !important; }
        .card-gradient > a { border-radius: 14px 14px 0 0 !important; }
        .card-gradient > div:last-child { border-radius: 0 0 14px 14px !important; }
        .card-gradient .cart-btn { background: linear-gradient(135deg,#667eea,#764ba2) !important; }
        .card-gradient .buy-now-btn { background: linear-gradient(135deg,#f093fb,#f5576c) !important; }

        /* ── Minimal: ultra-clean hairline borders ── */
        .card-minimal {
          background: #fff !important;
          border: 1px solid #f0f0f0 !important;
          box-shadow: none !important;
          border-radius: 4px !important;
        }
        .card-minimal:hover {
          border-color: #d0d0d0 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
        }
        .card-minimal > a, .card-minimal > div { border-radius: 4px !important; }
        .card-minimal > a { border-radius: 4px 4px 0 0 !important; }
        .card-minimal > div:last-child { border-radius: 0 0 4px 4px !important; }
        .card-minimal .cart-btn { background: #1a1a1a !important; border-radius: 2px !important; }
        .card-minimal .buy-now-btn { background: #555 !important; border-radius: 2px !important; }

        /* ── Button style presets ── */
        .btn-pill .cart-btn, .btn-pill .buy-now-btn { border-radius: 20px !important; }
        .btn-sharp .cart-btn, .btn-sharp .buy-now-btn { border-radius: 2px !important; }
        .btn-sharp .cart-btn { background: #1a1a1a !important; }
        .btn-sharp .buy-now-btn { background: #555 !important; }
        .btn-outline .cart-btn { background: transparent !important; color: #3483fa !important; border: 1.5px solid #3483fa !important; box-shadow: none !important; }
        .btn-outline .buy-now-btn { background: transparent !important; color: #FF6D00 !important; border: 1.5px solid #FF6D00 !important; box-shadow: none !important; }
        .btn-outline .cart-btn:hover { background: #3483fa !important; color: #fff !important; }
        .btn-outline .buy-now-btn:hover { background: #FF6D00 !important; color: #fff !important; }
        .btn-soft .cart-btn { background: rgba(52,131,250,0.1) !important; color: #3483fa !important; box-shadow: none !important; }
        .btn-soft .buy-now-btn { background: rgba(255,109,0,0.1) !important; color: #FF6D00 !important; box-shadow: none !important; }
        .btn-soft .cart-btn:hover { background: rgba(52,131,250,0.2) !important; }
        .btn-soft .buy-now-btn:hover { background: rgba(255,109,0,0.2) !important; }
        .btn-gradient .cart-btn { background: linear-gradient(135deg,#667eea,#764ba2) !important; }
        .btn-gradient .buy-now-btn { background: linear-gradient(135deg,#f093fb,#f5576c) !important; }

        /* ── Button hover animations ── */
        .cart-btn:hover { filter: brightness(1.1) !important; transform: translateY(-1px) !important; box-shadow: 0 4px 12px rgba(52,131,250,0.3) !important; }
        .cart-btn:active { transform: translateY(0) scale(0.97) !important; }
        .buy-now-btn:hover { filter: brightness(1.1) !important; transform: translateY(-1px) !important; }
        .buy-now-btn:active { transform: translateY(0) scale(0.97) !important; }

        /* ── QuickView glassmorphism button hover ── */
        .qv-btn:hover {
          transform: scale(1.12) !important;
          background: rgba(255,255,255,1) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
        }

        /* ═══ OFFER SECTION ANIMATIONS ═══ */
        .offer-hero-card {
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          transition: box-shadow .4s cubic-bezier(.4,0,.2,1), transform .35s cubic-bezier(.4,0,.2,1);
          transform-style: preserve-3d;
        }
        .offer-hero-card:hover {
          box-shadow: 0 12px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.04);
        }

        /* Flash badge — scale pulse big/small */
        .offer-flash-badge {
          animation: offerFlashScale 2s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes offerFlashScale {
          0%, 100% { transform: scale(1); box-shadow: 0 1px 6px rgba(255,65,108,0.2); }
          50% { transform: scale(1.08); box-shadow: 0 2px 10px rgba(255,65,108,0.3); }
        }
        
        /* Urgency dot blink */
        .offer-urgency-dot {
          animation: offerDotBlink 1s ease-in-out infinite;
        }
        @keyframes offerDotBlink {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px rgba(255,59,48,0.5); }
          50% { opacity: 0.35; box-shadow: 0 0 10px 3px rgba(255,59,48,0.7); }
        }

        /* ── Countdown digit animations ── */
        .cd-block { transition: transform .15s ease; }
        .cd-tick { animation: cdTickPop .4s cubic-bezier(.34,1.56,.64,1) !important; }
        @keyframes cdTickPop {
          0% { transform: scale(1); }
          30% { transform: scale(1.12); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .cd-digit {
          box-shadow: 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: box-shadow .3s;
        }
        .cd-sep {
          animation: cdSepPulse 1s ease-in-out infinite;
        }
        @keyframes cdSepPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* ── Floating particles ── */
        .offer-particle {
          pointer-events: none;
          border-radius: 50%;
        }
        .offer-p1 { animation: offerFloat1 6s ease-in-out infinite; }
        .offer-p2 { animation: offerFloat2 8s ease-in-out infinite; }
        .offer-p3 { animation: offerFloat3 7s ease-in-out infinite; }
        .offer-p4 { animation: offerFloat1 5s ease-in-out infinite reverse; }
        .offer-p5 { animation: offerFloat2 9s ease-in-out infinite; }
        @keyframes offerFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          25% { transform: translate(12px, -18px) scale(1.3); opacity: 0.8; }
          50% { transform: translate(-8px, -30px) scale(0.8); opacity: 0.3; }
          75% { transform: translate(15px, -10px) scale(1.1); opacity: 0.7; }
        }
        @keyframes offerFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(-15px, -20px) scale(1.4); opacity: 0.7; }
          66% { transform: translate(10px, -35px) scale(0.7); opacity: 0.3; }
        }
        @keyframes offerFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(-10px, -25px) scale(1.2); opacity: 0.8; }
        }

        /* CTA button shimmer sweep */
        .offer-cta-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: offerBtnShimmer 3s ease-in-out infinite;
        }
        @keyframes offerBtnShimmer {
          0%, 70% { left: -100%; }
          100% { left: 100%; }
        }
        .offer-cta-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(52,131,250,0.4) !important;
        }
        .offer-cta-btn:active {
          transform: translateY(0) scale(0.97) !important;
        }

        /* Ver detalles button */
        .offer-details-btn {
          position: relative;
        }
        .offer-details-btn:hover {
          background: #3483fa !important;
          color: #fff !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 16px rgba(52,131,250,0.25) !important;
        }
        .offer-details-btn:hover svg {
          transform: translateX(3px) !important;
        }

        /* Side offer cards hover */
        .offer-side-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
        }

        /* ── Category card hover ── */
        .category-card {
          transform-style: preserve-3d !important;
          will-change: transform !important;
        }
        .category-card:hover {
          box-shadow: 0 10px 28px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.05) !important;
          border-color: rgba(0,0,0,0.1) !important;
        }
        .category-card:hover .cat-accent-bar { opacity: 1 !important; }
        .category-card:hover .cat-icon-wrap {
          transform: scale(1.06) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
        }
        /* ── Subcategory card hover effects ── */
        .subcat-card:hover .subcat-bg-img {
          transform: scale(1.06) !important;
          opacity: 1 !important;
        }
        .subcat-card:hover .subcat-icon-wrap {
          transform: scale(1.08) !important;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08) !important;
        }

        /* ── Border glow effect ── */
        .card-glow { transition: box-shadow 0.3s ease, border-color 0.3s ease !important; }
        .card-glow:hover { box-shadow: 0 0 16px rgba(52,131,250,0.2), 0 4px 16px rgba(0,0,0,0.06) !important; border-color: rgba(52,131,250,0.4) !important; }

        /* ── Overlay gradient on image ── */
        .card-overlay-gradient .card-img::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.35), transparent);
          z-index: 2;
          pointer-events: none;
        }

        /* ── No-zoom modifier ── */
        .card-no-zoom:hover .card-img { transform: none !important; }
        /* ── No-shimmer modifier ── */
        .card-no-shimmer:hover .card-shimmer { animation: none !important; }
        /* ── No-badge-pulse ── */
        .card-no-pulse span[style*="badgeBounce"] { animation: none !important; }
        /* ── No-btn-shimmer ── */
        .card-no-btn-shimmer .cart-btn::after { display: none !important; }

        /* ── Card entrance stagger ── */
        @keyframes pc-entrance {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Shimmer sweep — CSS hover only ── */
        .card-shimmer {
          position: absolute; inset: 0; z-index: 10; pointer-events: none;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%);
          background-size: 180% 100%;
          background-repeat: no-repeat;
          background-position: -180% center;
          opacity: 0;
        }
        .product-card:hover .card-shimmer {
          animation: shimmerSweepOnce 1.6s cubic-bezier(0.22, 1, 0.36, 1) 1 !important;
        }
        @keyframes shimmerSweepOnce {
          0%   { opacity: 0;    background-position: -180% center; }
          12%  { opacity: 0.95; background-position: -140% center; }
          82%  { opacity: 0.75; background-position: 180% center; }
          100% { opacity: 0;    background-position: 220% center; }
        }

        /* ── Discount badge bounce ── */
        @keyframes badgeBounce {
          0%,100% { transform: scale(1) rotate(-1deg); }
          25%     { transform: scale(1.12) rotate(1deg); }
          50%     { transform: scale(1.05) rotate(-1deg); }
          75%     { transform: scale(1.1) rotate(0.5deg); }
        }

        /* ── Image zoom on parent hover ── */
        .card-img {
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1) !important;
        }
        .product-card:hover .card-img {
          transform: scale(1.07) !important;
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1) !important;
        }

        /* ── Button shimmer on hover ── */
        .cart-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          transition: none;
        }
        .cart-btn:hover::after {
          animation: btnShimmer 0.55s ease forwards !important;
        }
        @keyframes btnShimmer {
          0%   { left: -100%; }
          100% { left: 160%;  }
        }
      `}</style>

      {/* ── QuickView Modal ── */}
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* ── Hotspot tag portal — renders in body, position:fixed, never clipped ── */}
      {typeof window !== 'undefined' && activeHotspot && tagPos && (() => {
        const activeHS = panelHotspots.find(h => h.$id === activeHotspot);
        const prod = activeHS ? products.find(p => p.$id === activeHS.PRODUCTID) : null;
        if (!prod) return null;
        const { x, y, onRight } = tagPos;
        const OFFSET = 24;
        const tagLeft = onRight ? x + OFFSET : undefined;
        const tagRight = onRight ? undefined : window.innerWidth - x + OFFSET;
        return createPortal(
          <div
            style={{
              position: 'fixed',
              top: y,
              left: tagLeft,
              right: tagRight,
              transform: 'translateY(-50%)',
              zIndex: 99999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Connector line */}
            <div style={{
              position: 'absolute', width: 20, height: 1.5,
              background: 'linear-gradient(90deg, rgba(200,200,200,0.9), rgba(200,200,200,0.3))',
              top: '50%', transform: 'translateY(-50%)',
              ...(onRight ? { left: -20 } : { right: -20, background: 'linear-gradient(90deg, rgba(200,200,200,0.3), rgba(200,200,200,0.9))' })
            }} />
            <div className="hs-tag" style={{ position: 'relative' }}>
              {/* Product image header */}
              {prod.IMAGEURL && (
                <Link prefetch={false} href={`/productos/${prod.$id}`}>
                  <img className="hs-tag-img" src={prod.IMAGEURL} alt={prod.NAME} />
                </Link>
              )}
              {/* Discount badge */}
              {prod.CURRENTPRICE && prod.CURRENTPRICE < prod.PRICE && (
                <div style={{
                  position: 'absolute', top: 6, right: 6, background: '#ef4444', color: '#fff',
                  fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, zIndex: 6,
                }}>
                  -{Math.round((1 - prod.CURRENTPRICE / prod.PRICE) * 100)}%
                </div>
              )}
              <div className="hs-tag-body">
                <Link prefetch={false} href={`/productos/${prod.$id}`} style={{ textDecoration: 'none' }}>
                  <div className="hs-tag-name">{prod.NAME}</div>
                </Link>
                <div>
                  <span className="hs-tag-price">{formatPrice(prod.CURRENTPRICE || prod.PRICE)}</span>
                  {prod.CURRENTPRICE && prod.CURRENTPRICE < prod.PRICE && (
                    <span className="hs-tag-old">{formatPrice(prod.PRICE)}</span>
                  )}
                </div>
                <div className="hs-tag-actions">
                  <button
                    className="hs-tag-btn"
                    style={{ background: '#111', color: '#fff' }}
                    onClick={(e) => { e.stopPropagation(); addItem(prod, 1); setActiveHotspot(null); }}
                  >
                    <ShoppingCart size={12} /> Agregar
                  </button>
                  <Link prefetch={false} href={`/productos/${prod.$id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <button className="hs-tag-btn" style={{ background: 'transparent', color: '#111', border: '1.5px solid #e0e0e0', width: '100%' }}>
                      Comprar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}
    </div>
  );
}