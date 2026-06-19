'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, MapPin, ChevronDown, Menu, X, User, Bell, Heart, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useNotifications } from '@/context/NotificationContext';
import { useState, useEffect, useRef } from 'react';
import { getServices, getAppwriteConfig, MEDIA_BUCKET_ID, MEDIA_PREFIXES, CATEGORIES_COLLECTION } from '@/lib/appwrite';
import type { Category } from '@/types';
import CartDrawer from '@/components/CartDrawer';
import { getSectionSettings, getSectionConfig, SectionConfig } from '@/lib/section-config';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

function getFilePreviewUrl(fileId: string): string {
  const { endpoint, projectId } = getAppwriteConfig();
  const path = fileId;
  return `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${path}/view?project=${projectId}`;
}

function readNavSettings(cfg?: SectionConfig[]) {
  try {
    const sections = cfg || (() => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('homepage_sections') : null;
      return stored ? JSON.parse(stored) : null;
    })();
    if (sections) return getSectionSettings(sections, 'navbar');
  } catch {}
  return {};
}

// ==============================================================================
// 🌠 ULTRA-PREMIUM AWWARDS COMPONENTS
// ==============================================================================
const MagneticWrapper = ({ children, className, style }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref as any}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function Navbar2({ initialSettings }: { initialSettings?: Record<string, any> }) {
  const { totalItems } = useCart();
  const { user, isLoggedIn } = useAuth();
  const { unreadCount } = useNotifications();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [primaryAddress, setPrimaryAddress] = useState<string | null>(null);
  const [ns, setNs] = useState(() => initialSettings || readNavSettings());
  const { categories } = useCategories();
  const [catDropdown, setCatDropdown] = useState(false);

  // Advanced Cinematic Scroll Tracking
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const topbarDropShadow = useTransform(scrollY, [0, 80], ['0px 0px 0px rgba(0,0,0,0)', '0px 10px 30px rgba(0,0,0,0.6)']);
  const topbarBackdropBlur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(20px)']);
  const topbarBgOpacity = useTransform(scrollY, [0, 80], [0.5, 0.95]);
  const topbarGradientOpacity = useTransform(scrollY, [0, 80], [1, 0]);
  const [topbarSearchOpen, setTopbarSearchOpen] = useState(false);
  const [hoveredNavLink, setHoveredNavLink] = useState<string | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: -1000, y: -1000 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !isScrolled) setIsScrolled(true);
    if (latest <= 50 && isScrolled) setIsScrolled(false);
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        const { account } = getServices();
        const acc = await account.get();
        const prefs = (acc as any).prefs || {};
        if (prefs.avatarFileId) setAvatarUrl(getFilePreviewUrl(prefs.avatarFileId));
      } catch {}
    })();
  }, [isLoggedIn]);

  useEffect(() => {
    // Load primary address from localStorage
    if (user?.id) {
      try {
        const stored = localStorage.getItem(`addr_${user.id}`);
        if (stored) {
          const addresses = JSON.parse(stored);
          if (addresses.length > 0) {
            const primary = addresses[0];
            setPrimaryAddress(primary.commune || primary.fullAddress || null);
          }
        }
      } catch {}
    }
  }, [user]);

  // Load categories
  

  // Listen for theme editor changes
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === 'te:reloadConfig') setNs(readNavSettings());
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Derived nav settings with fallbacks
  const layout = (ns.navLayout || 'classic') as 'classic' | 'stacked' | 'centered' | 'minimal-fashion' | 'topbar' | 'split' | 'glass-float' | 'nebula-premium';
  const bg = (ns.bgGradient && ns.bgGradient !== '') ? ns.bgGradient : (ns.bgColor || '#ffe600');
  const gradientAnimated = !!ns.gradientAnimated;
  const textCol = layout === 'classic' ? '#333' : (ns.textColor || '#333');
  const accent = ns.accentColor || '#3483fa';
  const sBg = ns.searchBgColor || '#fff';
  const sBtnBg = ns.searchBtnColor || '#fff';
  const sBtnText = ns.searchBtnTextColor || '#333';
  const hoverBg = ns.itemHoverBg || 'rgba(0,0,0,0.07)';
  const badgeCol = ns.cartBadgeColor || '#3483fa';
  const navH = ns.navHeight || 64;
  const sRadius = ns.searchRadius ?? 2;
  const placeholder = ns.searchPlaceholder || 'Buscar productos, marcas y más...';
  const logoPos = ns.logoPosition || 'left';
  const isSticky = ns.sticky !== false;
  const showAddr = ns.showAddress !== false;
  const showCats = ns.showCategories !== false;
  const showOfrs = ns.showOffers !== false;
  const showFavs = ns.showFavorites !== false;
  const showSearch = ns.showSearch !== false;
  const hasBorderBottom = ns.borderBottom === true;
  const borderBotCol = ns.borderBottomColor || '#e6e6e6';
  const logoImg = ns.logoUrl || '/ml/logo/logo.webp';
  const catBarBg = ns.catBarBg || '#232f3e';
  const catBarText = ns.catBarText || '#ddd';
  const isMercadoClassicDefault =
    layout === 'classic' &&
    (ns.navModel === 'mercadolibre' || (!ns.navModel && (ns.bgColor === undefined || ns.bgColor === '#ffe600')));
  const hasExplicitGradient = ns.bgGradient && typeof ns.bgGradient === 'string';
  const isAnimated = ns.gradientAnimated !== false;
  const classicBg = hasExplicitGradient
    ? ns.bgGradient
    : isMercadoClassicDefault
      ? 'radial-gradient(ellipse 100% 140% at 50% -20%, #fffce3 0%, #fff58a 12%, #ffed4a 28%, #ffe600 48%, #ffdd00 72%, #ffd200 92%, #ffc800 100%)'
      : bg;
  const classicShadow = isMercadoClassicDefault && !hasExplicitGradient
    ? 'inset 0 1px 0 rgba(255,255,255,.7), inset 0 -2px 0 rgba(180,130,0,.18), inset 0 -1px 3px rgba(140,100,0,.08), 0 2px 12px rgba(0,0,0,.08), 0 0 40px rgba(255,214,0,.15)'
    : '0 2px 12px rgba(0,0,0,.06)';
  
  // Show effects (shimmer/particles) if it's the default yellow OR if we have a "yellowish" gradient like 'sol'
  const isYellowish = isMercadoClassicDefault || (hasExplicitGradient && (ns.bgGradient?.includes('#ff') || ns.bgGradient?.includes('yellow')));
  const showYellowFx = isYellowish;
  const showShimmer = hasExplicitGradient || isMercadoClassicDefault;
  const navParticlesEnabled = ns.navParticlesEnabled === true;
  const navParticlesColor = ns.navParticlesColor || '#3483fa';
  const navParticlesCount = Math.max(8, Math.min(80, ns.navParticlesCount ?? 24));
  const navParticlesSize = Math.max(10, Math.min(28, ns.navParticlesSize ?? 14));
  const navParticlesOpacity = Math.max(0.05, Math.min(1, ns.navParticlesOpacity ?? 0.35));
  const navParticleTokens = (ns.navParticlesText || '3B')
    .split(',')
    .map((t: string) => t.trim())
    .filter(Boolean);
  const particleSymbols = navParticleTokens.length ? navParticleTokens : ['3B'];

  function go() {
    window.location.assign(query ? `/productos?q=${encodeURIComponent(query)}` : '/productos');
  }

  // Logo sizing helper
  const logoH = ns.logoSize || 18;
  const logoScale = Math.min(logoH / 34, 6); // Scale factor, max 6x (204px)
  
  const logo = (baseHeight: number) => (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {ns.logoUrl ? <img src={ns.logoUrl} alt="Logo" style={{ height: baseHeight * logoScale, width: 'auto', objectFit: 'contain' }} />
        : <Image src="/ml/logo/logo.webp" alt="Logo" width={134} height={34} style={{ height: baseHeight * logoScale, width: 'auto' }} priority />}
    </Link>
  );

  /* helper: avatar */
  const ava = (size: number, bgC: string) => (
    <div style={{ width: size, height: size, borderRadius: '50%', background: avatarUrl ? 'none' : bgC, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size * 0.42, fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
      {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.name?.charAt(0)?.toUpperCase() || 'U')}
    </div>
  );

  /* helper: cart badge */
  const badge = (bgC: string, top: number, right: number) => totalItems > 0 ? (
    <span style={{ position: 'absolute', top, right, background: bgC, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems > 9 ? '9+' : totalItems}</span>
  ) : null;

  return (
    <>
      <style>{`
        @keyframes nbShimmer {
          0% { transform: translateX(-120%) skewX(-22deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(240%) skewX(-22deg); opacity: 0; }
        }
        @keyframes nbShimmer2 {
          0% { transform: translateX(-140%) skewX(14deg); opacity: 0; }
          15% { opacity: .5; }
          85% { opacity: .5; }
          100% { transform: translateX(260%) skewX(14deg); opacity: 0; }
        }
        @keyframes nbFloat1 { 0%,100% { transform: translate(0,0) scale(1) rotate(0deg); opacity:.4; } 25% { transform: translate(8px,-8px) scale(1.2) rotate(90deg); opacity:.6; } 50% { transform: translate(14px,-4px) scale(1.1) rotate(180deg); opacity:.7; } 75% { transform: translate(6px,-10px) scale(1.15) rotate(270deg); opacity:.55; } }
        @keyframes nbFloat2 { 0%,100% { transform: translate(0,0) scale(1) rotate(0deg); opacity:.3; } 33% { transform: translate(-10px,-12px) scale(1.1) rotate(-120deg); opacity:.5; } 66% { transform: translate(-6px,-6px) scale(1.2) rotate(-240deg); opacity:.45; } }
        @keyframes nbFloat3 { 0%,100% { transform: translate(0,0) scale(.9) rotate(0deg); opacity:.25; } 50% { transform: translate(8px,6px) scale(1.1) rotate(360deg); opacity:.45; } }
        @keyframes nbSparkle { 0%,100% { transform: scale(0) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 50% { transform: scale(1.2) rotate(180deg); opacity: 1; } 80% { opacity: 1; } }
        @keyframes nbPulseGlow { 0%,100% { opacity: .3; transform: scale(1); } 50% { opacity: .6; transform: scale(1.3); } }
        @keyframes nbParticleFloat {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: var(--max-opacity, .3); }
          50% { transform: translate(var(--drift, 0px), -30px) rotate(180deg); }
          90% { opacity: var(--max-opacity, .3); }
          100% { transform: translate(0, -60px) rotate(360deg); opacity: 0; }
        }
        @keyframes nbParticlePulse {
          0%,100% { transform: scale(1); filter: drop-shadow(0 0 3px currentColor); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 8px currentColor); }
        }
        @keyframes nbGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .nb-anim-bg {
          background-size: 200% 200% !important;
          animation: nbGradientFlow 4s ease infinite !important;
        }
        @keyframes nbSearchGlow {
          0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,.08); }
          50% { box-shadow: 0 2px 12px rgba(52,131,250,.15), 0 0 0 1px rgba(52,131,250,.05); }
        }
        @keyframes nbSearchBtnPulse {
          0%,100% { box-shadow: 0 2px 6px rgba(52,131,250,.3); }
          50% { box-shadow: 0 4px 14px rgba(52,131,250,.5), 0 0 0 3px rgba(52,131,250,.1); }
        }
        .nb-ml-search:focus-within {
          border-color: #3483fa !important;
          box-shadow: 0 4px 20px rgba(52,131,250,.25), 0 0 0 4px rgba(52,131,250,.12), 0 2px 8px rgba(0,0,0,.06) !important;
          transform: translateY(-1px);
        }
        .nb-ml-search-btn:hover {
          background: linear-gradient(135deg, #2968c8 0%, #1e50a0 100%) !important;
          transform: scale(1.02);
        }
        .nb-ml-search-btn:active { transform: scale(0.97); }
      `}</style>
      {/* ═══════════ DESKTOP HEADER ═══════════ */}

      {/* ══════════════════════════════════════════════════════════════════
          CLASSIC — MercadoLibre exact replica
          Row 1: Logo + location left | Search center | promo area right
          Row 2: Categorías▾ + nav links left | Crea tu cuenta + Ingresa + Mis compras + 🛒 right
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'classic' && (
        <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : ''} hidden lg:block`}
          style={{ 
            backgroundImage: hasExplicitGradient ? classicBg : undefined,
            backgroundColor: hasExplicitGradient ? undefined : classicBg,
            backgroundSize: (isAnimated && hasExplicitGradient) ? '400% 400%' : 'auto',
            animation: (isAnimated && hasExplicitGradient) ? 'nbGradientFlow 15s ease infinite' : 'none',
            fontFamily: '"Proxima Nova",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif', 
            zIndex: catDropdown ? 10000 : 50, 
            boxShadow: classicShadow, 
            position: 'relative', 
            overflow: catDropdown ? 'visible' : 'hidden' 
          }}>
          {/* ── Premium yellow FX: multi-shimmer + orbs + sparkles ── */}
          {showShimmer && (
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1, overflow:'hidden' }}>
              {/* Shimmer primario - recorrido principal */}
              <div style={{ position:'absolute', top:0, left:0, width:'50%', height:'100%', background:'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,.45) 50%, rgba(255,255,255,0) 70%, transparent 100%)', animation:'nbShimmer 6s ease-in-out infinite', willChange:'transform' }} />
              {/* Shimmer secundario - dirección opuesta */}
              <div style={{ position:'absolute', top:0, left:0, width:'35%', height:'100%', background:'linear-gradient(105deg, transparent 0%, rgba(255,255,200,0) 40%, rgba(255,255,180,.25) 50%, rgba(255,255,200,0) 60%, transparent 100%)', animation:'nbShimmer2 8s ease-in-out infinite 2s', willChange:'transform' }} />
              {/* Highlight brillante sobre el gradiente */}
              <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:'2px', background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.7) 50%, transparent 100%)', filter:'blur(1px)' }} />
            </div>
          )}
          {showYellowFx && (
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1, overflow:'hidden' }}>
              {/* Orbes luminosos grandes */}
              <div style={{ position:'absolute', width:60, height:60, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.35) 0%,rgba(255,250,200,.1) 50%,transparent 100%)', top:'-20%', left:'15%', animation:'nbPulseGlow 6s ease-in-out infinite', filter:'blur(12px)' }} />
              <div style={{ position:'absolute', width:50, height:50, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.3) 0%,rgba(255,248,180,.08) 50%,transparent 100%)', top:'-10%', right:'20%', animation:'nbPulseGlow 7s ease-in-out infinite 1.5s', filter:'blur(10px)' }} />
              <div style={{ position:'absolute', width:70, height:70, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.25) 0%,rgba(255,230,120,.06) 50%,transparent 100%)', bottom:'-30%', left:'50%', animation:'nbPulseGlow 8s ease-in-out infinite 3s', filter:'blur(14px)' }} />
              {/* Pequeñas partículas de luz */}
              <div style={{ position:'absolute', width:6, height:6, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.9),rgba(255,248,180,.4))', top:'18%', left:'12%', animation:'nbFloat1 5.5s ease-in-out infinite', filter:'blur(.5px)', boxShadow:'0 0 8px rgba(255,255,255,.6)' }} />
              <div style={{ position:'absolute', width:4, height:4, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.7),rgba(255,244,150,.3))', top:'22%', left:'88%', animation:'nbFloat2 6s ease-in-out infinite 1.2s', filter:'blur(.4px)', boxShadow:'0 0 6px rgba(255,255,255,.5)' }} />
              <div style={{ position:'absolute', width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,.8)', top:'55%', left:'25%', animation:'nbFloat3 7s ease-in-out infinite .8s', boxShadow:'0 0 5px rgba(255,255,255,.7)' }} />
              <div style={{ position:'absolute', width:5, height:5, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.9),rgba(255,240,130,.4))', top:'65%', left:'70%', animation:'nbFloat1 5s ease-in-out infinite 2s', filter:'blur(.3px)', boxShadow:'0 0 7px rgba(255,255,255,.6)' }} />
              <div style={{ position:'absolute', width:4, height:4, borderRadius:'50%', background:'rgba(255,255,255,.75)', top:'75%', left:'45%', animation:'nbFloat2 6.5s ease-in-out infinite 3s', boxShadow:'0 0 5px rgba(255,255,255,.5)' }} />
              {/* Sparkles (estrellitas) */}
              <div style={{ position:'absolute', top:'30%', left:'38%', width:8, height:8, animation:'nbSparkle 4s ease-in-out infinite', pointerEvents:'none' }}>
                <div style={{ position:'absolute', top:'50%', left:0, width:'100%', height:1, background:'rgba(255,255,255,.9)', transform:'translateY(-50%)', boxShadow:'0 0 4px rgba(255,255,255,.8)' }} />
                <div style={{ position:'absolute', left:'50%', top:0, height:'100%', width:1, background:'rgba(255,255,255,.9)', transform:'translateX(-50%)', boxShadow:'0 0 4px rgba(255,255,255,.8)' }} />
              </div>
              <div style={{ position:'absolute', top:'68%', left:'82%', width:6, height:6, animation:'nbSparkle 5s ease-in-out infinite 2.5s', pointerEvents:'none' }}>
                <div style={{ position:'absolute', top:'50%', left:0, width:'100%', height:1, background:'rgba(255,255,255,.85)', transform:'translateY(-50%)', boxShadow:'0 0 3px rgba(255,255,255,.7)' }} />
                <div style={{ position:'absolute', left:'50%', top:0, height:'100%', width:1, background:'rgba(255,255,255,.85)', transform:'translateX(-50%)', boxShadow:'0 0 3px rgba(255,255,255,.7)' }} />
              </div>
              <div style={{ position:'absolute', top:'45%', left:'60%', width:7, height:7, animation:'nbSparkle 4.5s ease-in-out infinite 1.2s', pointerEvents:'none' }}>
                <div style={{ position:'absolute', top:'50%', left:0, width:'100%', height:1, background:'rgba(255,255,255,.9)', transform:'translateY(-50%)', boxShadow:'0 0 4px rgba(255,255,255,.8)' }} />
                <div style={{ position:'absolute', left:'50%', top:0, height:'100%', width:1, background:'rgba(255,255,255,.9)', transform:'translateX(-50%)', boxShadow:'0 0 4px rgba(255,255,255,.8)' }} />
              </div>
            </div>
          )}
          {navParticlesEnabled && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
              {/* Partículas distribuidas en 3 capas para profundidad */}
              {Array.from({ length: navParticlesCount }).map((_, i) => {
                const symbol = particleSymbols[i % particleSymbols.length];
                // Distribución pseudo-aleatoria pero determinística
                const seed1 = (i * 37) % 100;
                const seed2 = (i * 53) % 100;
                const seed3 = (i * 71) % 100;
                const left = seed1;
                const topStart = 20 + (seed2 % 60);
                const drift = ((seed3 % 40) - 20);
                // Capas: close (grande, nítido), mid (mediano, leve blur), far (pequeño, blur fuerte)
                const layer = i % 3;
                const sizeMult = layer === 0 ? 1.3 : layer === 1 ? 1 : 0.7;
                const size = Math.max(9, navParticlesSize * sizeMult + ((i % 3) - 1));
                const blur = layer === 0 ? 0 : layer === 1 ? 0.4 : 1;
                const opacityMult = layer === 0 ? 1 : layer === 1 ? 0.7 : 0.45;
                const duration = 6 + (i % 5) * 1.2;
                const delay = (i * 0.15) % 4;
                const maxOp = navParticlesOpacity * opacityMult;
                return (
                  <motion.span
                    key={`nav-particle-${i}`}
                    initial={{ y: 0, opacity: 0, scale: 0.6 }}
                    animate={{
                      y: [0, -20, -40, -30, -50],
                      x: [0, drift * 0.4, drift * 0.2, -drift * 0.3, 0],
                      opacity: [0, maxOp, maxOp, maxOp * 0.7, 0],
                      scale: [0.6, 1, 1.1, 0.95, 0.6],
                    }}
                    transition={{
                      duration,
                      delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      times: [0, 0.2, 0.5, 0.8, 1],
                    }}
                    style={{
                      position: 'absolute',
                      left: `${left}%`,
                      top: `${topStart}%`,
                      color: navParticlesColor,
                      fontSize: size,
                      fontWeight: 900,
                      lineHeight: 1,
                      userSelect: 'none',
                      fontFamily: '"Proxima Nova", -apple-system, sans-serif',
                      letterSpacing: '-0.5px',
                      filter: blur > 0 ? `blur(${blur}px)` : 'none',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {symbol}
                  </motion.span>
                );
              })}
            </div>
          )}
          {/* ── ROW 1: Logo | Search | Promo ── */}
          <div style={{ padding: '16px 4% 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, position: 'relative' }}>
            <Link href="/" className="nb-logo-link" style={{ position: 'absolute', left: 80, top: 4, display: 'flex', transition: 'opacity .2s, transform .2s' }}>
              {ns.logoUrl ? <img src={ns.logoUrl} alt="Logo" style={{ height: logoH, width: 'auto' }} />
                : <Image src="/ml/logo/logo.webp" alt="Logo" width={134} height={34} style={{ height: logoH, width: 'auto' }} priority />}
            </Link>
            <div className="nb-search-wrap nb-ml-search" style={{ width: 660, display: 'flex', position: 'relative', borderRadius: 26, boxShadow: '0 2px 8px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06)', border: '2px solid rgba(255,255,255,.4)', transition: 'all .3s cubic-bezier(0.4,0,0.2,1)', marginRight: 120, background: '#fff', animation: 'nbSearchGlow 4s ease-in-out infinite' }}>
              {/* Icono de lupa interno (lado izquierdo) */}
              <div style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
                <Search size={16} color="#9ca3af" strokeWidth={2.5} />
              </div>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && go()}
                placeholder={placeholder}
                maxLength={120}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                role="combobox"
                aria-expanded="false"
                aria-autocomplete="list"
                className="nb-search-input"
                style={{ flex: 1, height: 46, padding: '0 58px 0 46px', fontSize: 15, fontWeight: 500, border: 'none', outline: 'none', color: '#1a1a1a', background: 'transparent', borderRadius: '24px 0 0 24px', letterSpacing: '.1px' }} />
              {/* Separador sutil */}
              <div style={{ position: 'absolute', right: 54, top: 10, bottom: 10, width: 1, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.08) 50%, transparent 100%)', pointerEvents: 'none' }} />
              <button
                onClick={e => { e.stopPropagation(); go(); }}
                className="nb-search-btn nb-ml-search-btn"
                aria-label="Buscar"
                style={{ position: 'absolute', right: 0, top: 0, height: 46, width: 54, background: 'linear-gradient(135deg, #3483fa 0%, #2968c8 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0 24px 24px 0', transition: 'all .2s cubic-bezier(0.4,0,0.2,1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2), 0 2px 6px rgba(52,131,250,.3)', overflow: 'hidden' }}>
                {/* Shimmer interno del botón */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,.25) 50%, transparent 100%)', animation: 'nbShimmer 3.5s ease-in-out infinite', willChange: 'transform' }} />
                </div>
                <Search size={19} color="#fff" strokeWidth={2.5} style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.15))' }} />
              </button>
            </div>
            {/* ── Promo Tag (text-based) OR Promo Image ── */}
            {ns.promoTagStyle && ns.promoTagText ? (() => {
              // Base styles más grandes y anchos
              const baseStyle: React.CSSProperties = { position: 'relative', overflow: 'hidden', fontWeight: 900, fontSize: 14, fontFamily: 'Syne, sans-serif', letterSpacing: .2, whiteSpace: 'nowrap' as const };
              const tagStyles: Record<string, React.CSSProperties> = {
                // Minimalistas
                pill:         { ...baseStyle, background: '#3483fa', color: '#fff', borderRadius: 24, padding: '9px 24px', boxShadow: '0 2px 8px rgba(52,131,250,.25)' },
                outline:      { ...baseStyle, background: 'transparent', color: '#333', borderRadius: 24, padding: '8px 22px', border: '2px solid #333' },
                soft:         { ...baseStyle, background: '#eef2ff', color: '#4338ca', borderRadius: 10, padding: '9px 24px' },
                dark:         { ...baseStyle, background: '#18181b', color: '#fafafa', borderRadius: 10, padding: '9px 24px', boxShadow: '0 2px 10px rgba(0,0,0,.15)' },
                // Con acento
                'accent-left': { ...baseStyle, background: '#fff', color: '#1e293b', borderRadius: 8, padding: '9px 22px', borderLeft: '4px solid #3483fa', boxShadow: '0 2px 8px rgba(0,0,0,.06)' },
                underline:    { ...baseStyle, background: '#fafafa', color: '#18181b', borderRadius: 0, padding: '9px 22px', borderBottom: '3px solid #ef4444' },
                ribbon:       { ...baseStyle, background: '#ef4444', color: '#fff', borderRadius: '0 10px 10px 0', padding: '9px 24px 9px 18px', borderLeft: '4px solid #b91c1c', boxShadow: '0 2px 8px rgba(239,68,68,.2)' },
                stamp:        { ...baseStyle, background: '#fff', color: '#dc2626', borderRadius: 6, padding: '8px 20px', border: '2.5px solid #dc2626', textTransform: 'uppercase' as const, letterSpacing: 2 },
                // Premium
                glass:        { ...baseStyle, background: 'rgba(255,255,255,.3)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: '#1a1a1a', borderRadius: 12, padding: '9px 24px', border: '1px solid rgba(0,0,0,.08)', boxShadow: '0 2px 12px rgba(0,0,0,.06)' },
                gold:         { ...baseStyle, background: 'linear-gradient(135deg,#d4a03c,#f0d060)', color: '#3d2200', borderRadius: 8, padding: '9px 24px', boxShadow: '0 2px 10px rgba(212,160,60,.25)' },
                neon:         { ...baseStyle, background: '#0a0a14', color: '#00e5c3', borderRadius: 8, padding: '9px 24px', border: '1.5px solid #00e5c3', boxShadow: '0 0 12px rgba(0,229,195,.2)', textShadow: '0 0 6px rgba(0,229,195,.4)' },
                gradient:     { ...baseStyle, background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', borderRadius: 12, padding: '9px 24px', boxShadow: '0 2px 12px rgba(99,102,241,.25)' },
              };
              const style = tagStyles[ns.promoTagStyle] || tagStyles.pill;
              const tagLink = ns.promoTagLink || '/productos';
              return (
                <div className="nb-promo" style={{ position: 'absolute', right: 140, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                  <style>{`
                    @keyframes promoShimmer { 0%{transform:translateX(-150%) skewX(-20deg)} 100%{transform:translateX(200%) skewX(-20deg)} }
                    @keyframes promoP1 { 0%,100%{transform:translate(0,0) scale(.8);opacity:.4} 50%{transform:translate(8px,-4px) scale(1.1);opacity:.7} }
                    @keyframes promoP2 { 0%,100%{transform:translate(0,0) scale(.9);opacity:.3} 50%{transform:translate(-6px,5px) scale(1.15);opacity:.6} }
                  `}</style>
                  <Link href={tagLink} style={{ textDecoration: 'none', display: 'inline-flex' }}>
                    <div style={{ ...style, cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = (style.boxShadow || '').replace('.35', '.5').replace('.3', '.45'); }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = style.boxShadow as string; }}>
                      {/* Shimmer effect */}
                      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', borderRadius: 'inherit' }}>
                        <div style={{ position:'absolute', top:0, left:0, width:'50%', height:'100%', background:'linear-gradient(105deg,transparent 0%,rgba(255,255,255,0) 40%,rgba(255,255,255,.35) 50%,rgba(255,255,255,0) 60%,transparent 100%)', animation:'promoShimmer 4s ease-in-out infinite' }} />
                      </div>
                      {/* Floating particles */}
                      <div style={{ position:'absolute', inset:0, pointerEvents:'none', borderRadius: 'inherit' }}>
                        <div style={{ position:'absolute', width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,.6)', top:'20%', left:'15%', animation:'promoP1 3.5s ease-in-out infinite', filter:'blur(.5px)' }} />
                        <div style={{ position:'absolute', width:4, height:4, borderRadius:'50%', background:'rgba(255,255,255,.5)', top:'60%', left:'70%', animation:'promoP2 4.2s ease-in-out infinite .5s', filter:'blur(.4px)' }} />
                        <div style={{ position:'absolute', width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,.45)', top:'35%', left:'85%', animation:'promoP1 5s ease-in-out infinite 1s', filter:'blur(.3px)' }} />
                      </div>
                      {/* Text content */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
                        <span style={{ lineHeight: 1.35 }}>{ns.promoTagText}</span>
                        {ns.promoTagSecondary && <span style={{ fontSize: 11, opacity: .85, fontWeight: 600, lineHeight: 1.3 }}>{ns.promoTagSecondary}</span>}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })() : ns.promoImageUrl ? (
              <div className="nb-promo" style={{ position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)', transition: 'transform .2s' }}>
                <Link href={ns.promoImageLink || '/productos'} style={{ display: 'flex', textDecoration: 'none' }}>
                  <img src={ns.promoImageUrl} alt="Promo" style={{ height: ns.promoImageHeight || 44, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
                </Link>
              </div>
            ) : null}
          </div>

          {/* ── ROW 2: Nav links | Auth ── */}
          <div style={{ padding: '0 4%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 38, position: 'relative', marginTop: -4 }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2, marginRight: 100 }}>
              {/* Categorías dropdown */}
              <div style={{ position: 'relative' }}
                onMouseEnter={() => setCatDropdown(true)}
                onMouseLeave={() => setCatDropdown(false)}>
                <div className="nb-nav-item" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', fontSize: 13, color: '#333', cursor: 'pointer', fontWeight: 500, borderRadius: 20, transition: 'background .15s, color .15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                  <span>Categorías</span>
                  <ChevronDown size={11} color="#666" style={{ transition: 'transform .2s', transform: catDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>
                {catDropdown && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: 280,
                      height: 10,
                      background: 'transparent',
                      zIndex: 2147483646,
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: -4,
                      width: 280,
                      background: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 12px 40px rgba(0,0,0,.15), 0 2px 6px rgba(0,0,0,.06)',
                      padding: '6px',
                      maxHeight: 'calc(100vh - 160px)',
                      overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
                      zIndex: 2147483647,
                      animation: 'nb-dropdown-in .15s ease-out',
                    }}>
                      {categories.map(cat => (
                        <Link
                          key={cat.$id}
                          href={`/productos?cat=${cat.$id}`}
                          className="ml-cat-link"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            fontSize: 13,
                            fontWeight: 450,
                            color: '#333',
                            textDecoration: 'none',
                            borderRadius: 8,
                            transition: 'background .12s, transform .12s',
                          }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#f0f4ff'; el.style.transform = 'translateX(3px)'; }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.transform = 'translateX(0)'; }}
                        >
                          <span style={{ color: '#333' }}>{cat.name}</span>
                          <ChevronDown size={11} color="#bbb" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }} />
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Tienda', href: '/productos' },
                { label: 'Catálogo', href: '/catalogo' },
                { label: 'Llegan Pronto', href: '/llegan-pronto' },
                { label: 'Ofertas', href: '/productos' },
                { label: 'Favoritos', href: '/favoritos' },
                { label: 'Mi cuenta', href: '/cuenta' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="nb-nav-link" style={{ padding: '7px 14px', fontSize: 13, color: '#000000', textDecoration: 'none', fontWeight: 500, borderRadius: 20, transition: 'background .15s, color .15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                >{label}</Link>
              ))}
            </nav>
            {/* ── Separator ── */}
            <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,.1)', margin: '0 6px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isLoggedIn && user ? (
                <>
                  {showAddr && (
                    <Link href="/cuenta/direcciones" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555', textDecoration: 'none', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(0,0,0,.08)', transition: 'all .15s', background: 'rgba(255,255,255,.5)' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,.9)'; el.style.borderColor = 'rgba(0,0,0,.15)'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,.5)'; el.style.borderColor = 'rgba(0,0,0,.08)'; }}>
                      <MapPin size={13} color="#3483fa" />
                      <span>{primaryAddress || 'Ingresa tu ubicación'}</span>
                    </Link>
                  )}
                  <Link href="/cuenta" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', fontSize: 13, color: '#333', textDecoration: 'none', fontWeight: 500, borderRadius: 20, transition: 'background .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: avatarUrl ? 'none' : 'linear-gradient(135deg, #3483fa, #2968c8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, overflow: 'hidden', boxShadow: '0 2px 6px rgba(52,131,250,.25)', border: '2px solid rgba(255,255,255,.8)' }}>
                      {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.name?.charAt(0)?.toUpperCase() || 'U')}
                    </div>
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <Link href="/cuenta" className="nb-nav-link" style={{ padding: '6px 12px', fontSize: 13, color: '#333', textDecoration: 'none', fontWeight: 500, borderRadius: 20, transition: 'background .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                    Mis compras
                  </Link>
                  <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,.08)', margin: '0 2px' }} />
                  <Link href="/cuenta/notificaciones" style={{ position: 'relative', padding: 6, textDecoration: 'none', display: 'flex', alignItems: 'center', borderRadius: '50%', transition: 'background .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                    <Bell size={17} color="#555" />
                    {unreadCount > 0 && <span className="nb-badge-pulse" style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #ff4444, #e53935)', color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid ' + bg }}>{unreadCount}</span>}
                  </Link>
                </>
              ) : (
                <>
                  {showAddr && (
                    <Link href="/cuenta/direcciones" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555', textDecoration: 'none', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(0,0,0,.08)', transition: 'all .15s', background: 'rgba(255,255,255,.5)' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,.9)'; el.style.borderColor = 'rgba(0,0,0,.15)'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,.5)'; el.style.borderColor = 'rgba(0,0,0,.08)'; }}>
                      <MapPin size={13} color="#3483fa" />
                      <span>Ingresa tu ubicación</span>
                    </Link>
                  )}
                  <Link href="/login?tab=register" className="nb-nav-link" style={{ padding: '6px 14px', fontSize: 13, color: '#3483fa', textDecoration: 'none', fontWeight: 600, borderRadius: 20, transition: 'background .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(52,131,250,.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                    Crea tu cuenta
                  </Link>
                  <Link href="/login" className="nb-nav-link" style={{ padding: '6px 14px', fontSize: 13, color: '#333', textDecoration: 'none', fontWeight: 500, borderRadius: 20, transition: 'background .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                    Ingresa
                  </Link>
                  <Link href="/productos" className="nb-nav-link" style={{ padding: '6px 14px', fontSize: 13, color: '#333', textDecoration: 'none', fontWeight: 500, borderRadius: 20, transition: 'background .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                    Mis compras
                  </Link>
                  <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,.08)', margin: '0 2px' }} />
                </>
              )}
              {showFavs && <Link href="/favoritos" style={{ padding: 6, textDecoration: 'none', display: 'flex', alignItems: 'center', borderRadius: '50%', transition: 'background .15s, transform .15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,0,0,.06)'; el.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.transform = 'scale(1)'; }}>
                <Heart size={17} color="#555" />
              </Link>}
              <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', borderRadius: '50%', transition: 'background .15s, transform .15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,0,0,.06)'; el.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.transform = 'scale(1)'; }}>
                <ShoppingCart size={18} color="#555" />
                {totalItems > 0 && <span className="nb-badge-pulse" style={{ position: 'absolute', top: -2, right: -2, background: 'linear-gradient(135deg, #3483fa, #2968c8)', color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid ' + bg, boxShadow: '0 2px 6px rgba(52,131,250,.3)' }}>{totalItems}</span>}
              </button>
            </div>
          </div>
          <style jsx>{`
            .ml-cat-link,
            .ml-cat-link:link,
            .ml-cat-link:visited,
            .ml-cat-link:active {
              color: #333 !important;
              -webkit-text-fill-color: #333 !important;
              text-decoration: none !important;
            }
            .ml-cat-link:hover {
              color: #3483fa !important;
              -webkit-text-fill-color: #3483fa !important;
              text-decoration: none !important;
            }
            .ml-cat-link::-webkit-scrollbar {
              display: none;
            }
            .ml-cat-link {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            @keyframes nb-dropdown-in {
              from { opacity: 0; transform: translateY(-6px) scale(.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes nb-badge-pop {
              0% { transform: scale(0); }
              60% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            @keyframes nb-badge-glow {
              0%, 100% { box-shadow: 0 0 0 0 rgba(52,131,250,.4); }
              50% { box-shadow: 0 0 0 4px rgba(52,131,250,0); }
            }
            .nb-badge-pulse {
              animation: nb-badge-pop .3s ease-out, nb-badge-glow 2s ease-in-out infinite 1s;
            }
            .nb-logo-link:hover {
              opacity: .85 !important;
              transform: scale(1.02) !important;
            }
            .nb-search-btn:hover {
              filter: brightness(1.15) !important;
            }
            .nb-promo:hover {
              transform: translateY(-50%) scale(1.03) !important;
            }
            .nb-search-input::placeholder {
              color: #999;
              font-weight: 400;
            }
          `}</style>
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STACKED — Amazon style
          Dark navy 2-row: Row1=logo+search+account, Row2=category bar
          Big search with category dropdown, delivery address, compact icons
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'stacked' && (
        <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : ''} z-50 hidden lg:block`}
          style={{ background: bg, fontFamily: 'Arial,sans-serif' }}>
          {/* Row 1 — main bar */}
          <div style={{ padding: '0 2%', display: 'flex', alignItems: 'center', height: navH, gap: 12 }}>
            {/* Logo with .com suffix */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '4px 10px', borderRadius: 3, border: '1px solid transparent', textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
              {ns.logoUrl ? <img src={ns.logoUrl} alt="Logo" style={{ height: logoH, width: 'auto' }} />
                : <Image src="/ml/logo/logo.webp" alt="Logo" width={100} height={28} style={{ height: logoH, width: 'auto' }} priority />}
            </Link>
            {/* Delivery address */}
            {showAddr && (
              <Link href="/cuenta/direcciones" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 3, border: '1px solid transparent', textDecoration: 'none', color: textCol, fontSize: 12 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
                <MapPin size={16} color={textCol} />
                <div><div style={{ fontSize: 11, color: '#ccc' }}>Enviar a</div><div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{primaryAddress || 'Chile'}</div></div>
              </Link>
            )}
            {/* Search with category dropdown */}
            <div style={{ flex: 1, display: 'flex', maxWidth: 700, borderRadius: 6, overflow: 'hidden' }} onClick={() => setSearchOpen(true)}>
              <select style={{ height: 42, padding: '0 8px', background: '#e6e6e6', border: 'none', fontSize: 12, color: '#555', cursor: 'pointer', borderRight: '1px solid #ccc' }}>
                <option>Todos</option>
              </select>
              <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setSearchOpen(true)} onKeyDown={e => e.key === 'Enter' && go()}
                placeholder={placeholder} style={{ flex: 1, height: 42, padding: '0 14px', fontSize: 15, border: 'none', outline: 'none', color: '#111', background: '#fff' }} />
              <button onClick={e => { e.stopPropagation(); go(); }} style={{ height: 42, width: 48, background: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={20} color={sBtnText} />
              </button>
            </div>
            {/* Right icons — stacked labels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {isLoggedIn && <Link href="/cuenta/notificaciones" style={{ position: 'relative', padding: '6px 8px', textDecoration: 'none', borderRadius: 3, border: '1px solid transparent', display: 'flex' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
                <Bell size={20} color={textCol} />{unreadCount > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#e53935', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 10, minWidth: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
              </Link>}
              {isLoggedIn && user ? (
                <Link href="/cuenta" style={{ padding: '4px 10px', borderRadius: 3, border: '1px solid transparent', textDecoration: 'none', color: textCol, fontSize: 12 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
                  <div style={{ fontSize: 11, color: '#ccc' }}>Hola, {user.name.split(' ')[0]}</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Cuenta ▾</div>
                </Link>
              ) : (
                <Link href="/login" style={{ padding: '4px 10px', borderRadius: 3, border: '1px solid transparent', textDecoration: 'none', color: textCol, fontSize: 12 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
                  <div style={{ fontSize: 11, color: '#ccc' }}>Hola, Identifícate</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Cuenta ▾</div>
                </Link>
              )}
              <Link href="/productos" style={{ padding: '4px 10px', borderRadius: 3, border: '1px solid transparent', textDecoration: 'none', color: textCol, fontSize: 12 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
                <div style={{ fontSize: 11, color: '#ccc' }}>Devoluciones</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>y Pedidos</div>
              </Link>
              <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: '1px solid transparent', cursor: 'pointer', padding: '6px 10px', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 4, color: textCol }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
                <ShoppingCart size={24} color={textCol} />
                {totalItems > 0 && <span style={{ position: 'absolute', top: 0, left: 20, background: accent, color: '#111', fontSize: 12, fontWeight: 800, borderRadius: 10, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>}
                <span style={{ fontSize: 12, fontWeight: 700, marginTop: 10 }}>Carrito</span>
              </button>
            </div>
          </div>
          {/* Row 2 — category bar */}
          <div style={{ background: catBarBg, padding: '0 2%', display: 'flex', alignItems: 'center', height: 38 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 12px', fontSize: 13, color: catBarText, fontWeight: 700 }}><Menu size={16} color={catBarText} /> Todo</button>
            {['Ofertas','Productos','Favoritos','Novedades','Ayuda'].map(l => (
              <Link key={l} href={l === 'Favoritos' ? '/favoritos' : '/productos'} style={{ padding: '6px 14px', fontSize: 13, color: catBarText, textDecoration: 'none', fontWeight: 500, borderRadius: 2 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>{l}</Link>
            ))}
          </div>
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          CENTERED — Apple Store style
          Ultra clean, thin, frosted white. Logo dead center.
          Spaced-out nav links left. Search icon + bag icon right.
          NO search bar visible. Minimal. Premium. Lots of whitespace.
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'centered' && (
        <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : ''} z-50 hidden lg:block`}
          style={{ background: bg, backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', borderBottom: `0.5px solid ${borderBotCol}`, fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: navH, padding: '0 24px', position: 'relative' }}>
            {/* Left nav links — spaced, small, uppercase */}
            <div style={{ position: 'absolute', left: 24, display: 'flex', alignItems: 'center', gap: 0 }}>
              {['Tienda', 'Categorías', 'Ofertas'].map(l => (
                <Link key={l} href="/productos" style={{ padding: '6px 16px', fontSize: 11, fontWeight: 400, color: textCol, textDecoration: 'none', letterSpacing: '0.02em', opacity: .85, transition: 'opacity .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '.85'; }}>{l}</Link>
              ))}
            </div>
            {/* Center logo */}
            {logo(logoH)}
            {/* Right icons — thin, minimal */}
            <div style={{ position: 'absolute', right: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', opacity: .7, transition: 'opacity .2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '.7'; }}>
                <Search size={16} color={textCol} strokeWidth={1.5} />
              </button>
              {showFavs && <Link href="/favoritos" style={{ display: 'flex', padding: 6, opacity: .7, transition: 'opacity .2s', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '.7'; }}>
                <Heart size={16} color={textCol} strokeWidth={1.5} />
              </Link>}
              {isLoggedIn && user ? (
                <Link href="/cuenta" style={{ display: 'flex', padding: 6, opacity: .7, transition: 'opacity .2s', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '.7'; }}>
                  <User size={16} color={textCol} strokeWidth={1.5} />
                </Link>
              ) : (
                <Link href="/login" style={{ fontSize: 11, color: textCol, textDecoration: 'none', opacity: .85, padding: '4px 8px' }}>Ingresar</Link>
              )}
              <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', opacity: .7, transition: 'opacity .2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '.7'; }}>
                <ShoppingCart size={16} color={textCol} strokeWidth={1.5} />
                {totalItems > 0 && <span style={{ position: 'absolute', top: -2, right: -4, background: accent, color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MINIMAL-FASHION — Zara / H&M style
          White, HUGE logo text centered, hamburger left, cart right.
          Extreme whitespace. Thin bottom border. No search bar.
          Very tall. Fashion-forward. DRAMATICALLY different.
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'minimal-fashion' && (
        <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : ''} z-50 hidden lg:block`}
          style={{ background: bg, borderBottom: `1px solid ${borderBotCol}`, fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: navH + 16, padding: '0 40px' }}>
            {/* Left — hamburger + text links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: 280 }}>
              <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
                {mobileOpen ? <X size={20} color={textCol} strokeWidth={1.2} /> : <Menu size={20} color={textCol} strokeWidth={1.2} />}
              </button>
              <button onClick={() => setSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
                <Search size={18} color={textCol} strokeWidth={1.2} />
              </button>
            </div>
            {/* Center — BIG logo */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {ns.logoUrl ? (
                <Link href="/" style={{ display: 'flex' }}><img src={ns.logoUrl} alt="Logo" style={{ height: logoH + 12, width: 'auto' }} /></Link>
              ) : (
                <Link href="/" style={{ textDecoration: 'none', fontSize: 28, fontWeight: 900, letterSpacing: 6, color: textCol, textTransform: 'uppercase' as const }}>
                  TIENDA
                </Link>
              )}
            </div>
            {/* Right — minimal icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: 280, justifyContent: 'flex-end' }}>
              {isLoggedIn && user ? (
                <Link href="/cuenta" style={{ display: 'flex', textDecoration: 'none' }}><User size={18} color={textCol} strokeWidth={1.2} /></Link>
              ) : (
                <Link href="/login" style={{ fontSize: 11, color: textCol, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' as const, fontWeight: 500 }}>Login</Link>
              )}
              {showFavs && <Link href="/favoritos" style={{ display: 'flex', textDecoration: 'none' }}><Heart size={18} color={textCol} strokeWidth={1.2} /></Link>}
              <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShoppingCart size={18} color={textCol} strokeWidth={1.2} />
                {totalItems > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: textCol }}>({totalItems})</span>}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TOPBAR — Horizon Pro — Premium Glass Pill
          Aurora CSS border + centered search + ambient glow
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'topbar' && (
        <>
          <style>{`
            @keyframes hzAurora { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes hzGlow { 0%,100%{opacity:0.45} 50%{opacity:0.9} }
            .hz-link { position:relative; display:flex; align-items:center; height:100%; text-decoration:none; padding:0 13px; }
            .hz-link-txt { overflow:hidden; height:22px; color:rgba(255,255,255,0.62); font-size:14.5px; font-weight:500; letter-spacing:0.2px; transition:color 0.2s; }
            .hz-link:hover .hz-link-txt { color:#fff; }
            .hz-inner { display:flex; flex-direction:column; transition:transform 0.32s cubic-bezier(0.16,1,0.3,1); }
            .hz-link:hover .hz-inner { transform:translateY(-22px); }
            .hz-bar { position:absolute; bottom:9px; left:13px; right:13px; height:2px; border-radius:2px; transform:scaleX(0); transform-origin:left; transition:transform 0.28s cubic-bezier(0.16,1,0.3,1); }
            .hz-link:hover .hz-bar { transform:scaleX(1); }
            .hz-ibtn { width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.22s; position:relative; }
            .hz-ibtn:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.18); transform:scale(1.08) translateY(-1px); box-shadow:0 8px 24px rgba(0,0,0,0.35); }
            .hz-search { display:flex; align-items:center; gap:9px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:50px; padding:9px 16px; cursor:text; transition:all 0.25s; }
            .hz-search:hover, .hz-search:focus-within { background:rgba(255,255,255,0.09); border-color:rgba(255,51,102,0.4); box-shadow:0 0 0 3px rgba(255,51,102,0.08), 0 8px 32px rgba(0,0,0,0.25); }
            .hz-search input { background:none; border:none; outline:none; color:#fff; font-size:14px; flex:1; min-width:0; }
            .hz-search input::placeholder { color:rgba(255,255,255,0.28); }
            .hz-cats-link { color:rgba(255,255,255,0.55); font-size:14px; font-weight:500; text-decoration:none; padding:7px 2px; display:flex; align-items:center; gap:8px; transition:all 0.16s; border-radius:6px; }
            .hz-cats-link:hover { color:#fff; padding-left:8px; }
            .nzp-group:hover .nzp-drop { opacity:1!important; pointer-events:auto!important; transform:translateY(0) scale(1)!important; }
          `}</style>

          {/* Ambient underglow */}
          <div style={{ position:'fixed', top:0, left:'8%', right:'8%', height:160, background:`radial-gradient(ellipse at 50% 0%, ${accent||'#ff3366'}28 0%, transparent 65%)`, filter:'blur(28px)', zIndex:40, pointerEvents:'none', animation:'hzGlow 5s ease-in-out infinite' }} />

          <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : 'relative'} hidden lg:flex justify-center`}
            style={{ padding:'10px 0', background:'transparent', fontFamily:'"SF Pro Display","Helvetica Neue",Arial,sans-serif', zIndex:99999, position: isSticky ? undefined : 'relative' }}>
            <div style={{ position:'relative', width:'93%', maxWidth:1500 }}>
              {/* Aurora spinning border — overflow:hidden trick */}
              <div style={{ position:'absolute', inset:-2, borderRadius:26, overflow:'hidden', zIndex:0 }}>
                <div style={{ position:'absolute', width:'200%', height:'200%', top:'-50%', left:'-50%', background:'conic-gradient(from 0deg, #ff3366, #ff6b9d 60deg, #00d4ff 120deg, #ff3366 180deg, #ff6b9d 240deg, #00d4ff 300deg, #ff3366 360deg)', animation:'hzAurora 8s linear infinite', opacity:0.6, filter:'blur(3px)' }} />
              </div>
              {/* Glass pill backdrop (separate layer — no children, so stacking context doesn't trap mega menu) */}
              <div style={{ position:'absolute', inset:0, background:'rgba(6,6,12,0.88)', backdropFilter:'saturate(200%) blur(40px)', WebkitBackdropFilter:'saturate(200%) blur(40px)', borderRadius:24, boxShadow:'0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)', pointerEvents:'none' }} />
              {/* Glass pill content (no backdrop-filter = no stacking context trap) */}
              <div style={{ position:'relative', borderRadius:24, display:'flex', alignItems:'center', height:navH+24, padding:'0 22px 0 28px', gap:16 }}>
                {/* Top shimmer accent line */}
                <div style={{ position:'absolute', top:0, left:'12%', right:'12%', height:1, background:`linear-gradient(90deg, transparent, ${accent||'#ff3366'}66, #00d4ff44, transparent)`, borderRadius:1 }} />
            {/* Elegant Glitch Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
              <motion.div whileHover="hover" transition={{ type: 'spring', stiffness: 400 }}>
                {ns.logoUrl ? <img src={ns.logoUrl} alt="Logo" style={{ height: logoH + 8, width: 'auto', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8))', position: 'relative', zIndex: 1 }} />
                  : <Image src="/ml/logo/logo.webp" alt="Logo" width={134} height={34} style={{ height: logoH + 8, width: 'auto', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8))', position: 'relative', zIndex: 1 }} priority />}
                  
                {/* Cybernetic Glitch Artifacts behind logo */}
                <motion.div variants={{ hover: { opacity: 1, x: [0, -5, 5, -2, 2, 0], y: [0, 3, -3, 1, -1, 0] } }} style={{ position: 'absolute', inset: 0, background: accent || '#ff3366', mixBlendMode: 'screen', opacity: 0, filter: 'blur(4px)', zIndex: 0, clipPath: 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' }} />
                <motion.div variants={{ hover: { opacity: 1, x: [0, 5, -5, 2, -2, 0], y: [0, -3, 3, -1, 1, 0], filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'] } }} style={{ position: 'absolute', inset: 0, background: '#00d4ff', mixBlendMode: 'screen', opacity: 0, filter: 'blur(4px)', zIndex: 0, clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)' }} />
              </motion.div>
            </Link>
            
            {/* Horizon Interactive Nav Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 20, height: '100%' }}>
              {[{ l: 'Inicio', h: '/' }, { l: 'Explorar', h: '/productos' }, { l: 'Top Ofertas', h: '/productos' }].map(n => (
                <Link key={n.l} href={n.h} style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', textDecoration: 'none' }}
                  onMouseEnter={() => setHoveredNavLink(n.l)} onMouseLeave={() => setHoveredNavLink(null)}
                >
                  <motion.div whileHover="hover" initial="rest" style={{ overflow: 'hidden', height: 22, color: '#e5e5e5', fontSize: 16, fontWeight: 500, letterSpacing: 0.5, display: 'flex', flexDirection: 'column' }}>
                    <motion.div variants={{ rest: { y: 0 }, hover: { y: -22 } }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ height: 22, lineHeight: '22px' }}>{n.l}</span>
                      <span style={{ height: 22, lineHeight: '22px', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>{n.l}</span>
                    </motion.div>
                  </motion.div>
                  {/* Framer Motion Magic Underline */}
                  {hoveredNavLink === n.l && (
                    <motion.div layoutId="horizonLine" style={{ position: 'absolute', bottom: 12, left: 0, right: 0, height: 3, borderRadius: 3, background: accent || '#fff', boxShadow: `0 0 12px ${accent || '#fff'}` }} transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                  )}
                </Link>
              ))}
              
              {/* Categorías Staggered Mega Menu Trigger */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}
                onMouseEnter={() => { setHoveredNavLink('Categorías'); setMegaMenuOpen(true); }}
                onMouseLeave={() => { setHoveredNavLink(null); setMegaMenuOpen(false); }}
              >
                <Link href="/productos" style={{ cursor: 'default', textDecoration: 'none', display: 'flex', alignItems: 'center' }} onClick={e => e.preventDefault()}>
                  <motion.div whileHover="hover" initial="rest" style={{ overflow: 'hidden', height: 22, color: '#e5e5e5', fontSize: 16, fontWeight: 500, letterSpacing: 0.5, display: 'flex', flexDirection: 'column' }}>
                    <motion.div variants={{ rest: { y: 0 }, hover: { y: -22 } }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ display: 'flex', alignItems: 'center', height: 22, lineHeight: '22px' }}>Categorías <motion.div animate={{ rotate: megaMenuOpen ? 180 : 0 }}><ChevronDown size={16} style={{ marginLeft: 6 }} /></motion.div></span>
                      <span style={{ display: 'flex', alignItems: 'center', height: 22, lineHeight: '22px', color: '#fff' }}>Categorías <motion.div animate={{ rotate: megaMenuOpen ? 180 : 0 }}><ChevronDown size={16} style={{ marginLeft: 6 }} /></motion.div></span>
                    </motion.div>
                  </motion.div>
                </Link>
                {hoveredNavLink === 'Categorías' && (
                  <motion.div layoutId="horizonLine" style={{ position: 'absolute', bottom: 12, left: 0, right: 0, height: 3, borderRadius: 3, background: accent || '#fff', boxShadow: `0 0 12px ${accent || '#fff'}` }} transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                )}
                
                {/* React-Driven Animated Mega Menu */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div 
                      onMouseMove={(e: any) => { const rect = e.currentTarget.getBoundingClientRect(); setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top }); }}
                      initial={{ opacity: 0, y: 15, scale: 0.98, rotateX: -5 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, rotateX: 5, transition: { duration: 0.2, ease: "anticipate" } }}
                      transition={{ type: 'spring', stiffness: 180, damping: 20, staggerChildren: 0.05, delayChildren: 0.1 }}
                      style={{ 
                        position: 'absolute', top: 76, left: -100, width: '80vw', maxWidth: 1100, minWidth: 800, 
                        background: 'rgba(5,5,7,0.85)', backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 56px',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)', display: 'flex', gap: 60, zIndex: 9999,
                        perspective: 1000, overflow: 'hidden'
                      }}>
                      {/* Interactive Mouse Spotlight */}
                      <motion.div animate={{ x: spotlight.x, y: spotlight.y }} transition={{ type: 'tween', ease: 'linear', duration: 0.08 }} style={{ position: 'absolute', width: 400, height: 400, background: `radial-gradient(circle, ${accent ? accent+'30' : 'rgba(229,9,20,0.2)'} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', transform: 'translate(-50%, -50%)', zIndex: 0 }} />
                      
                      {/* Decorative glowing orb */}
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1 }} style={{ position: 'absolute', top: -50, right: '10%', width: 300, height: 300, background: accent || '#e50914', filter: 'blur(150px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                        <motion.h3 variants={{ initial: { opacity: 0, x: -30, filter: 'blur(10px)' }, animate: { opacity: 1, x: 0, filter: 'blur(0px)' } }} style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 4, color: 'rgba(255,255,255,0.5)', marginBottom: 36, fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Mundos y Colecciones</motion.h3>
                        <motion.div variants={{ initial: {}, animate: { transition: { staggerChildren: 0.03 } } }} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px 32px' }}>
                          {(categories.length > 0 ? categories.slice(0, 15) : [{ $id: '1', name: 'Acción y Aventura' }, { $id: '2', name: 'Tecnología Elite' }, { $id: '3', name: 'Esenciales' }]).map((cat, i) => (
                            <motion.div key={cat.$id} variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}>
                              <Link href={`/productos?cat=${cat.$id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <motion.div whileHover={{ x: 6, color: '#fff' }} style={{ color: '#b3b3b3', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }}>
                                  {cat.name}
                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                      
                      {/* Interactive Featured Card */}
                      <motion.div variants={{ initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } }} style={{ width: 340, borderRadius: 16, padding: 32, position: 'relative', zIndex: 1, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {/* Dynamic glass bg */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', zIndex: -1 }} />
                        <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,0.4)', marginBottom: 24, fontWeight: 800 }}>Destacado de la Semana</h3>
                        <motion.div whileHover={{ scale: 1.05 }} style={{ width: '100%', height: 160, borderRadius: 8, background: 'rgba(255,255,255,0.05)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Sparkles size={32} color="rgba(255,255,255,0.2)" />
                           </div>
                        </motion.div>
                        <h4 style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Colección Nebula</h4>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>Descubre nuestra selección premium de productos galácticos y accesorios de alta fidelidad.</p>
                        <motion.button whileHover={{ scale: 1.02 }} style={{ width: '100%', padding: '12px 0', background: '#fff', color: '#000', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none', transition: 'background 0.3s' }}>
                          Ver Colección
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Center Search Pill */}
            <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
              <div className="hz-search" style={{ width:'100%', maxWidth:340 }} onClick={() => setTopbarSearchOpen(true)}>
                <Search size={14} color="rgba(255,255,255,0.32)" strokeWidth={2.5} />
                {topbarSearchOpen
                  ? <input autoFocus value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} placeholder="Buscar productos..." onBlur={() => { if (!query) setTopbarSearchOpen(false); }} />
                  : <span style={{ color:'rgba(255,255,255,0.28)', fontSize:14, flex:1 }}>Buscar productos...</span>}
                <kbd style={{ background:`${accent||'#ff3366'}18`, border:`1px solid ${accent||'#ff3366'}44`, borderRadius:5, padding:'2px 7px', fontSize:10.5, color:accent||'#ff3366', fontWeight:700, flexShrink:0 }}>⌘K</kbd>
              </div>
            </div>

            {/* Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              
              {/* Notification */}
              {isLoggedIn && (
                <Link href="/cuenta/notificaciones" style={{ textDecoration:'none' }}>
                  <motion.div className="hz-ibtn" whileHover={{ scale:1.08, y:-1 }} whileTap={{ scale:0.93 }}>
                    <Bell size={19} color="rgba(255,255,255,0.82)" strokeWidth={2} />
                    {unreadCount > 0 && <motion.span animate={{ scale:[1,1.25,1] }} transition={{ repeat:Infinity, duration:1.8 }} style={{ position:'absolute', top:-3, right:-3, background:accent||'#ff3366', color:'#fff', fontSize:9, fontWeight:800, borderRadius:'50%', width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 10px ${accent||'#ff3366'}` }}>{unreadCount}</motion.span>}
                  </motion.div>
                </Link>
              )}
              {/* Cart */}
              <motion.div className="hz-ibtn" onClick={() => setCartOpen(true)} whileHover={{ scale:1.08, y:-1 }} whileTap={{ scale:0.93 }}>
                <ShoppingCart size={19} color="rgba(255,255,255,0.82)" strokeWidth={2} />
                {totalItems > 0 && <motion.span initial={{ scale:0 }} animate={{ scale:1 }} style={{ position:'absolute', top:-5, right:-5, background:accent||'#ff3366', color:'#fff', fontSize:9, fontWeight:800, borderRadius:'50%', width:17, height:17, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 10px ${accent||'#ff3366'}` }}>{totalItems}</motion.span>}
              </motion.div>
              {/* Profile */}
              {isLoggedIn && user ? (
                <div style={{ position:'relative' }} className="nzp-group">
                  <motion.div whileHover={{ scale:1.06 }} style={{ cursor:'pointer' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background: avatarUrl?'none':`linear-gradient(135deg, ${accent||'#ff3366'}, #ff6b9d)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, fontWeight:700, overflow:'hidden', border:`2px solid ${accent||'#ff3366'}55`, boxShadow:`0 0 16px ${accent||'#ff3366'}44` }}>
                      {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : user.name.charAt(0).toUpperCase()}
                    </div>
                  </motion.div>
                  <div style={{ position:'absolute', top:'100%', right:0, width:220, height:18, background:'transparent' }} />
                  <div className="nzp-drop" style={{ position:'absolute', top:54, right:0, width:252, background:'rgba(8,8,14,0.94)', backdropFilter:'saturate(180%) blur(40px)', WebkitBackdropFilter:'saturate(180%) blur(40px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:18, opacity:0, pointerEvents:'none', transform:'translateY(14px) scale(0.94)', transformOrigin:'top right', transition:'all 0.28s cubic-bezier(0.16,1,0.3,1)', zIndex:200, boxShadow:'0 32px 80px rgba(0,0,0,0.75)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                      <div style={{ width:38, height:38, borderRadius:'50%', background: avatarUrl?'none':`linear-gradient(135deg, ${accent||'#ff3366'}, #ff6b9d)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, fontWeight:700, overflow:'hidden', flexShrink:0 }}>
                        {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : user.name.charAt(0).toUpperCase()}
                      </div>
                      <div><div style={{ color:'#fff', fontSize:14, fontWeight:600, marginBottom:2 }}>{user.name}</div><div style={{ color:accent||'#ff3366', fontSize:11, fontWeight:600, textTransform:'uppercase' as const, letterSpacing:1 }}>Premium</div></div>
                    </div>
                    <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)', margin:'0 0 10px' }} />
                    {([{h:'/cuenta',l:'Mi Cuenta'},{h:'/pedidos',l:'Mis Pedidos'},{h:'/favoritos',l:'Favoritos'}] as {h:string;l:string}[]).map(it=>(
                      <Link key={it.h} href={it.h} style={{ display:'flex', padding:'9px 8px', color:'rgba(255,255,255,0.6)', fontSize:13, textDecoration:'none', borderRadius:8, transition:'all 0.18s' }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#fff';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.05)';}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.6)';(e.currentTarget as HTMLElement).style.background='transparent';}}>
                        {it.l}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href="/login" style={{ textDecoration:'none' }}>
                  <motion.div whileHover={{ scale:1.04, boxShadow:`0 8px 28px ${accent||'#ff3366'}55` }} whileTap={{ scale:0.97 }}
                    style={{ padding:'9px 22px', background:`linear-gradient(135deg, ${accent||'#ff3366'}, #ff6b9d)`, color:'#fff', fontSize:13, fontWeight:700, borderRadius:30, boxShadow:`0 4px 18px ${accent||'#ff3366'}44` }}>
                    Entrar
                  </motion.div>
                </Link>
              )}
            </div>
              </div>
            </div>
          </header>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SPLIT — Sodimac / Falabella style
          Industrial 2-row: Row1=dark with logo+icons, Row2=light with
          FULL WIDTH chunky search bar + category pills.
          Thick, bold, utilitarian. Green/lime accent buttons.
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'split' && (
        <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : ''} z-50 hidden lg:block`}
          style={{ fontFamily: 'Arial,Helvetica,sans-serif' }}>
          {/* Row 1 — dark top */}
          <div style={{ background: bg, padding: '0 3%', display: 'flex', alignItems: 'center', height: navH, gap: 14 }}>
            {logo(logoH)}
            {/* Spacer */}
            <div style={{ flex: 1 }} />
            {/* Nav links as pills */}
            {['Productos','Ofertas','Ayuda'].map(l => (
              <Link key={l} href="/productos" style={{ padding: '6px 14px', fontSize: 12, color: textCol, textDecoration: 'none', fontWeight: 600, borderRadius: 3, letterSpacing: '.3px', textTransform: 'uppercase' as const }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hoverBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}>{l}</Link>
            ))}
            <div style={{ width: 1, height: 24, background: hoverBg }} />
            {showAddr && (
              <Link href="/cuenta/direcciones" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', textDecoration: 'none', color: textCol, fontSize: 11 }}>
                <MapPin size={14} color={textCol} /><span style={{ fontWeight: 600 }}>{primaryAddress || 'Ubicación'}</span>
              </Link>
            )}
            {showFavs && <Link href="/favoritos" style={{ display: 'flex', padding: 8, textDecoration: 'none' }}><Heart size={18} color={textCol} /></Link>}
            {isLoggedIn && <Link href="/cuenta/notificaciones" style={{ position: 'relative', display: 'flex', padding: 8, textDecoration: 'none' }}>
              <Bell size={18} color={textCol} />{unreadCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, background: '#e53935', color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: '50%', width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
            </Link>}
            {isLoggedIn && user ? (
              <Link href="/cuenta" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: textCol, fontSize: 12, fontWeight: 600 }}>
                {ava(28, accent)} {user.name.split(' ')[0]}
              </Link>
            ) : (
              <Link href="/login" style={{ padding: '7px 16px', background: accent, color: sBtnText, fontSize: 12, fontWeight: 700, borderRadius: 4, textDecoration: 'none', textTransform: 'uppercase' as const, letterSpacing: '.5px' }}>Ingresar</Link>
            )}
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', gap: 4, color: textCol, fontSize: 12, fontWeight: 700 }}>
              <ShoppingCart size={20} color={textCol} />{totalItems > 0 && <span style={{ background: badgeCol, color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px' }}>{totalItems}</span>}
            </button>
          </div>
          {/* Row 2 — light search bar */}
          <div style={{ background: catBarBg, padding: '8px 3%', display: 'flex', alignItems: 'center', gap: 12, borderTop: `1px solid ${hoverBg}` }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: accent, color: sBtnText, border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
              <Menu size={16} /> Categorías
            </button>
            <div style={{ flex: 1, display: 'flex', borderRadius: 6, overflow: 'hidden', border: `2px solid ${accent}` }} onClick={() => setSearchOpen(true)}>
              <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setSearchOpen(true)} onKeyDown={e => e.key === 'Enter' && go()}
                placeholder={placeholder} style={{ flex: 1, height: 42, padding: '0 16px', fontSize: 15, border: 'none', outline: 'none', color: '#333', background: '#fff' }} />
              <button onClick={e => { e.stopPropagation(); go(); }} style={{ height: 42, width: 52, background: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={20} color={sBtnText} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          GLASS-FLOAT — Luxury Glassmorphism Floating Navbar
          Deep space background + frosted glass island floating with margin.
          Animated gradient border, pill search, category pills below.
          Premium violet/indigo palette. Shimmer + glow effects.
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'glass-float' && (
        <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : ''} z-50 hidden lg:block`}
          style={{ background: bg, fontFamily: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', padding: '10px 24px 0' }}>
          <style>{`
            @keyframes gfBorderGlow { 0%,100%{border-color:rgba(167,139,250,0.25);box-shadow:0 0 20px rgba(167,139,250,0.08)} 50%{border-color:rgba(167,139,250,0.45);box-shadow:0 0 30px rgba(167,139,250,0.15),0 8px 32px rgba(0,0,0,0.3)} }
            @keyframes gfShimmer { 0%{transform:translateX(-150%) skewX(-18deg)} 100%{transform:translateX(250%) skewX(-18deg)} }
            @keyframes gfOrb1 { 0%,100%{transform:translate(0,0) scale(1);opacity:.12} 50%{transform:translate(30px,-15px) scale(1.4);opacity:.25} }
            @keyframes gfOrb2 { 0%,100%{transform:translate(0,0) scale(1);opacity:.1} 50%{transform:translate(-20px,10px) scale(1.3);opacity:.2} }
            .gf-icon-btn { background:none; border:none; cursor:pointer; padding:8px; display:flex; align-items:center; justify-content:center; border-radius:12px; transition:background .2s,transform .2s; position:relative }
            .gf-icon-btn:hover { background:${hoverBg}; transform:scale(1.1) }
            .gf-nav-pill { padding:6px 16px; font-size:12px; font-weight:500; color:${catBarText}; text-decoration:none; border-radius:20px; transition:all .2s; letter-spacing:.3px }
            .gf-nav-pill:hover { background:rgba(167,139,250,0.12); color:#e0d4ff }
          `}</style>
          {/* ── Ambient orbs (background decoration) ── */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 80, pointerEvents: 'none', zIndex: 49, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)', top: -40, left: '15%', animation: 'gfOrb1 8s ease-in-out infinite', filter: 'blur(20px)' }} />
            <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', top: -30, right: '20%', animation: 'gfOrb2 10s ease-in-out infinite', filter: 'blur(16px)' }} />
          </div>
          {/* ── Main floating glass bar ── */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'saturate(180%) blur(24px)',
            WebkitBackdropFilter: 'saturate(180%) blur(24px)',
            borderRadius: 20,
            border: '1px solid rgba(167,139,250,0.25)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            height: navH,
            gap: 16,
            position: 'relative',
            overflow: 'hidden',
            animation: 'gfBorderGlow 4s ease-in-out infinite',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            {/* Shimmer sweep */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 20 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '35%', height: '100%', background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 60%, transparent 100%)', animation: 'gfShimmer 6s ease-in-out infinite' }} />
            </div>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
              {ns.logoUrl ? <img src={ns.logoUrl} alt="Logo" style={{ height: logoH, width: 'auto' }} />
                : <Image src="/ml/logo/logo.webp" alt="Logo" width={134} height={34} style={{ height: logoH, width: 'auto', filter: 'brightness(1.5)' }} priority />}
            </Link>
            {/* Nav links (inline, not category bar) */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 8, position: 'relative', zIndex: 1 }}>
              {[{ l: 'Inicio', h: '/' }, { l: 'Productos', h: '/productos' }, { l: 'Ofertas', h: '/productos' }].map(n => (
                <Link key={n.l} href={n.h} className="gf-nav-pill">{n.l}</Link>
              ))}
            </nav>
            {/* Search — frosted pill */}
            {showSearch && (
              <div style={{ flex: 1, maxWidth: 420, display: 'flex', alignItems: 'center', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color .3s, box-shadow .3s', marginLeft: 'auto', position: 'relative', zIndex: 1 }}>
                <Search size={15} color="rgba(255,255,255,0.4)" style={{ marginLeft: 14, flexShrink: 0 }} />
                <input
                  value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}
                  placeholder={placeholder}
                  onFocus={e => { const w = e.target.parentElement as HTMLElement; w.style.borderColor = accent; w.style.boxShadow = `0 0 16px ${accent}33`; }}
                  onBlur={e => { const w = e.target.parentElement as HTMLElement; w.style.borderColor = 'rgba(255,255,255,0.08)'; w.style.boxShadow = 'none'; }}
                  style={{ flex: 1, height: 38, padding: '0 14px 0 10px', fontSize: 13, border: 'none', outline: 'none', background: 'transparent', color: '#f0eeff' }}
                />
                <button onClick={e => { e.stopPropagation(); go(); }}
                  style={{ height: 30, padding: '0 14px', margin: 4, background: accent, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'filter .15s, transform .15s', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <Search size={14} color="#fff" />
                </button>
              </div>
            )}
            {/* Right icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: showSearch ? 0 : 'auto', position: 'relative', zIndex: 1 }}>
              {showFavs && (
                <Link href="/favoritos" className="gf-icon-btn" style={{ textDecoration: 'none', display: 'flex' }}>
                  <Heart size={18} color={textCol} strokeWidth={1.5} />
                </Link>
              )}
              {isLoggedIn && (
                <Link href="/cuenta/notificaciones" className="gf-icon-btn" style={{ textDecoration: 'none', display: 'flex' }}>
                  <Bell size={18} color={textCol} strokeWidth={1.5} />
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, background: accent, color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 8px ${accent}66` }}>{unreadCount}</span>}
                </Link>
              )}
              {isLoggedIn && user ? (
                <Link href="/cuenta" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px 4px 4px', borderRadius: 14, textDecoration: 'none', transition: 'background .2s', background: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hoverBg; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarUrl ? 'none' : `linear-gradient(135deg, ${accent}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, overflow: 'hidden', border: '2px solid rgba(167,139,250,0.3)', boxShadow: `0 0 10px ${accent}33` }}>
                    {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.name?.charAt(0)?.toUpperCase() || 'U')}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: textCol }}>{user.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link href="/login" style={{ padding: '7px 18px', background: `linear-gradient(135deg, ${accent}, #8b5cf6)`, color: '#fff', fontSize: 12, fontWeight: 600, borderRadius: 12, textDecoration: 'none', transition: 'filter .2s, transform .2s, box-shadow .2s', boxShadow: `0 4px 16px ${accent}44` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.filter = 'brightness(1.15)'; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = `0 6px 24px ${accent}55`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.filter = 'brightness(1)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = `0 4px 16px ${accent}44`; }}>
                  Ingresar
                </Link>
              )}
              <button onClick={() => setCartOpen(true)} className="gf-icon-btn" style={{ position: 'relative' }}>
                <ShoppingCart size={18} color={textCol} strokeWidth={1.5} />
                {totalItems > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: `linear-gradient(135deg, ${accent}, #c084fc)`, color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 10px ${accent}55`, border: '1.5px solid rgba(15,10,42,0.6)' }}>{totalItems > 9 ? '9+' : totalItems}</span>}
              </button>
            </div>
          </div>
          {/* ── Category pills row ── */}
          {showCats && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '8px 20px 10px', position: 'relative', zIndex: 1 }}>
              {categories.slice(0, 8).map(cat => (
                <Link key={cat.$id} href={`/productos?cat=${cat.$id}`} className="gf-nav-pill" style={{ fontSize: 11.5 }}>
                  {cat.name}
                </Link>
              ))}
              {categories.length === 0 && ['Tecnología', 'Hogar', 'Ropa', 'Deportes', 'Belleza'].map(l => (
                <Link key={l} href="/productos" className="gf-nav-pill" style={{ fontSize: 11.5 }}>{l}</Link>
              ))}
            </div>
          )}
        </header>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          NEBULA PREMIUM (Preset 10) — Awwwards Level Design
          Advanced effects: Granim simulation, conic-gradient rotating border,
          multi-layer blur, spring animations, aurora search bar.
          ══════════════════════════════════════════════════════════════════ */}
      {layout === 'nebula-premium' && (
        <header data-section-id="navbar" className={`${isSticky ? 'sticky top-0' : ''} z-50 hidden lg:block`}
          style={{ background: bg, fontFamily: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', padding: '16px 32px 0' }}>
          <style>{`
            @keyframes npBgPulse {
              0%, 100% { transform: scale(1); opacity: 0.15; }
              50% { transform: scale(1.15); opacity: 0.25; }
            }
            @keyframes npAurora {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes npRotateConic {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .np-orb-1 { position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%); top: -150px; left: -50px; filter: blur(40px); animation: npBgPulse 10s ease-in-out infinite; pointer-events: none; z-index: 1; }
            .np-orb-2 { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%); top: -200px; right: -100px; filter: blur(50px); animation: npBgPulse 12s ease-in-out infinite reverse; pointer-events: none; z-index: 1; }
            
            .np-hologram-chip { position: relative; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 500; color: ${catBarText}; text-decoration: none; overflow: hidden; background: transparent; transition: color 0.3s ease; }
            .np-hologram-chip::before { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent); transform: translateX(-100%); transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
            .np-hologram-chip:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .np-hologram-chip:hover::before { transform: translateX(100%); }
            
            .np-search-input::placeholder { color: rgba(255,255,255,0.4); }
          `}</style>
          
          <div className="np-orb-1" />
          <div className="np-orb-2" />

          {/* Holographic Border Container */}
          <div style={{ position: 'relative', borderRadius: 28, zIndex: 10, padding: 1, overflow: 'hidden' }}>
            {/* Rotating Conic Gradient Border */}
            <div style={{ position: 'absolute', inset: -10, background: 'conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,0.8) 25%, transparent 50%, rgba(56,189,248,0.8) 75%, transparent 100%)', animation: 'npRotateConic 8s linear infinite', zIndex: -1, opacity: 0.8 }} />
            
            {/* The Glass Navbar */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'rgba(5,3,15,0.65)',
                backdropFilter: 'saturate(200%) blur(40px)',
                WebkitBackdropFilter: 'saturate(200%) blur(40px)',
                borderRadius: 27,
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                height: navH + 8,
                padding: '0 28px',
                position: 'relative',
                zIndex: 2,
                gap: 20
              }}
            >
              {/* Logo */}
              <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                  {ns.logoUrl ? <img src={ns.logoUrl} alt="Logo" style={{ height: logoH + 6, width: 'auto', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }} />
                    : <Image src="/ml/logo/logo.webp" alt="Logo" width={134} height={34} style={{ height: logoH + 6, width: 'auto', filter: 'brightness(2) drop-shadow(0 0 12px rgba(255,255,255,0.4))' }} priority />}
                </motion.div>
              </Link>

              {/* Holographic Nav Links */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 16 }}>
                {[{ l: 'Inicio', h: '/' }, { l: 'Explorar', h: '/productos' }, { l: 'Lanzamientos', h: '/productos' }].map(n => (
                  <Link key={n.l} href={n.h} className="np-hologram-chip">{n.l}</Link>
                ))}
              </nav>

              {/* Aurora Search Bar */}
              {showSearch && (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  style={{ flex: 1, maxWidth: 460, display: 'flex', alignItems: 'center', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginLeft: 'auto', padding: '6px 6px 6px 18px', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(139,92,246,0.1), rgba(56,189,248,0.1), rgba(139,92,246,0.1))', backgroundSize: '200% 100%', animation: 'npAurora 6s ease infinite', pointerEvents: 'none' }} />
                  <Search size={16} color="rgba(255,255,255,0.6)" style={{ flexShrink: 0, position: 'relative', zIndex: 1 }} />
                  <input
                    value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}
                    placeholder={placeholder}
                    className="np-search-input"
                    onFocus={e => { const w = e.target.parentElement as HTMLElement; w.style.borderColor = 'rgba(139,92,246,0.6)'; w.style.boxShadow = '0 0 20px rgba(139,92,246,0.2)'; w.style.background = 'rgba(255,255,255,0.06)'; }}
                    onBlur={e => { const w = e.target.parentElement as HTMLElement; w.style.borderColor = 'rgba(255,255,255,0.06)'; w.style.boxShadow = 'none'; w.style.background = 'rgba(255,255,255,0.03)'; }}
                    style={{ flex: 1, height: 32, padding: '0 16px', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: textCol, position: 'relative', zIndex: 1, fontWeight: 500 }}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={e => { e.stopPropagation(); go(); }}
                    style={{ height: 34, padding: '0 18px', background: `linear-gradient(135deg, ${accent}, #38bdf8)`, border: 'none', borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: `0 4px 12px ${accent}66` }}
                  >
                    <Search size={15} color="#fff" strokeWidth={2.5} />
                  </motion.button>
                </motion.div>
              )}

              {/* Right Icons with Framer Motion Springs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: showSearch ? 0 : 'auto' }}>
                {showFavs && (
                  <Link href="/favoritos" style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ scale: 1.15, background: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.9 }} style={{ padding: 10, display: 'flex', borderRadius: '50%', color: textCol, transition: 'color 0.2s' }}>
                      <Heart size={20} strokeWidth={1.5} />
                    </motion.div>
                  </Link>
                )}
                
                {isLoggedIn && (
                  <Link href="/cuenta/notificaciones" style={{ textDecoration: 'none', position: 'relative' }}>
                    <motion.div whileHover={{ scale: 1.15, background: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.9 }} style={{ padding: 10, display: 'flex', borderRadius: '50%', color: textCol, transition: 'color 0.2s' }}>
                      <Bell size={20} strokeWidth={1.5} />
                    </motion.div>
                    <AnimatePresence>
                      {unreadCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                          style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #05030f', boxShadow: '0 0 10px rgba(239,68,68,0.6)' }}
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )}

                {isLoggedIn && user ? (
                  <Link href="/cuenta" style={{ textDecoration: 'none' }}>
                    <motion.div 
                      whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.2)' }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 16px 4px 4px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', background: 'transparent', transition: 'all 0.3s ease' }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: avatarUrl ? 'none' : `linear-gradient(135deg, ${accent}, #38bdf8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, overflow: 'hidden', boxShadow: `0 0 15px ${accent}44` }}>
                        {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: textCol }}>{user.name.split(' ')[0]}</span>
                    </motion.div>
                  </Link>
                ) : (
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ scale: 1.05, filter: 'brightness(1.15)', boxShadow: `0 8px 24px ${accent}66` }}
                      whileTap={{ scale: 0.95 }}
                      style={{ padding: '8px 20px', background: `linear-gradient(135deg, ${accent}, #6366f1)`, color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 4px 16px ${accent}44`, textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    >
                      Ingresar
                    </motion.div>
                  </Link>
                )}

                <motion.button 
                  onClick={() => setCartOpen(true)}
                  whileHover={{ scale: 1.15, background: 'rgba(255,255,255,0.08)' }} 
                  whileTap={{ scale: 0.9 }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, display: 'flex', position: 'relative', borderRadius: '50%', color: textCol, transition: 'color 0.2s', marginLeft: 4 }}
                >
                  <ShoppingCart size={20} strokeWidth={1.5} />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        style={{ position: 'absolute', top: -2, right: -2, background: `linear-gradient(135deg, #10b981, #059669)`, color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #05030f', boxShadow: '0 0 12px rgba(16,185,129,0.6)' }}
                      >
                        {totalItems > 9 ? '9+' : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Sub-nav Category Pills (Floating Below) */}
          {showCats && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 16, position: 'relative', zIndex: 1 }}
            >
              {(categories.length > 0 ? categories.slice(0, 8) : [{ $id: '1', name: 'Tecnología' }, { $id: '2', name: 'Hogar' }, { $id: '3', name: 'Premium' }, { $id: '4', name: 'Novedades' }]).map(cat => (
                <Link key={cat.$id} href={`/productos?cat=${cat.$id}`} style={{ textDecoration: 'none' }}>
                  <motion.div 
                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                    style={{ padding: '6px 16px', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}
                  >
                    {cat.name}
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </header>
      )}


      {/* ═══════════════ MOBILE NAVBAR ═══════════════ */}
      <header
        data-section-id="navbar"
        className={`lg:hidden ${isSticky ? 'sticky top-0' : ''} z-50`}
        style={{ background: bg, boxShadow: '0 1px 2px rgba(0,0,0,.15)' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, height: 52 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {ns.logoUrl ? <img src={ns.logoUrl} alt="Logo" style={{ height: 26, width: 'auto' }} /> : <Image src="/ml/logo/logo.webp" alt="Logo" width={100} height={26} style={{ height: 26, width: 'auto' }} />}
          </Link>
          <div style={{ flex: 1, display: 'flex', borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}
              placeholder="Buscar productos..."
              type="search"
              enterKeyHint="search"
              style={{ flex: 1, height: 38, padding: '0 12px', fontSize: 14, border: 'none', outline: 'none', background: '#fff', color: '#333', minWidth: 0 }}
            />
            <button
              onClick={(e) => { e.preventDefault(); go(); }}
              type="button"
              aria-label="Buscar"
              style={{ height: 38, minWidth: 44, padding: '0 14px', background: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Search size={18} color="#fff" strokeWidth={2.5} />
            </button>
          </div>
          {isLoggedIn && user ? (
            <Link href="/cuenta" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: avatarUrl ? 'none' : accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, overflow: 'hidden' }}>
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <User size={22} color={textCol} />
            </Link>
          )}
          <Link href="/carrito" style={{ position: 'relative', display: 'flex' }}>
            <ShoppingCart size={22} color={textCol} />
            {totalItems > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: badgeCol, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems > 9 ? '9+' : totalItems}</span>}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
            {mobileOpen ? <X size={22} color={textCol} /> : <Menu size={22} color={textCol} />}
          </button>
        </div>
        {mobileOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #e6e6e6', padding: '8px 0' }}>
            {isLoggedIn && user && (
              <Link href="/cuenta" onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '2px solid #f5f5f5', textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatarUrl ? 'none' : '#3483fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                  {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#333' }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#999' }}>Mi perfil →</p>
                </div>
              </Link>
            )}
            {!isLoggedIn && (
              <div style={{ display: 'flex', gap: 8, padding: '10px 16px', borderBottom: '2px solid #f5f5f5' }}>
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  style={{ flex: 1, padding: '8px 0', textAlign: 'center', background: '#3483fa', color: '#fff', borderRadius: 4, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                  Iniciar sesión
                </Link>
                <Link href="/login?tab=register" onClick={() => setMobileOpen(false)}
                  style={{ flex: 1, padding: '8px 0', textAlign: 'center', border: '1px solid #3483fa', color: '#3483fa', borderRadius: 4, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                  Registrate
                </Link>
              </div>
            )}
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Tienda', href: '/productos' },
              { label: 'Catálogo', href: '/catalogo' },
              { label: 'Llegan Pronto', href: '/llegan-pronto' },
              { label: 'Ofertas', href: '/productos' },
              { label: 'Favoritos', href: '/favoritos' },
              { label: 'Carrito', href: '/carrito' },
              ...(isLoggedIn ? [{ label: 'Mis pedidos', href: '/cuenta' }] : []),
            ].map(({ label, href }) => (
              <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '11px 16px', fontSize: 14, color: '#333', textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Search Overlay disabled - inline search only */}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
