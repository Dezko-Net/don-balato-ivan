'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingCart, User, Heart, Menu, X, MapPin, Receipt, LogOut, Package, Minus, Plus, Trash2, Home, ArrowLeft, Grid3x3, Sparkles, Ship, Container, Store, LayoutGrid, Truck, Compass } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';

import { getServices, getAppwriteConfig, MEDIA_BUCKET_ID, MEDIA_PREFIXES, formatPrice } from '@/lib/appwrite';
import { getSectionConfigAsync, getSectionConfig, type SectionConfig } from '@/lib/section-config';
import SearchOverlay from '@/components/SearchOverlay';

import { usePrimaryAddress } from '@/hooks/usePrimaryAddress';
import { getWhatsAppUrl, openChatbot } from '@/lib/store-contact';
import NavAvatarWithBadge from '@/components/NavAvatarWithBadge';
// lottie-web loaded dynamically to avoid SSR issues

const ORANGE_PRIMARY = '#e396bf';
const PINK_LIGHT = '#f5a8cf';
const LOGO_URL = '';

function getFilePreviewUrl(fileId: string): string {
  const { endpoint, projectId } = getAppwriteConfig();
  const path = fileId;
  return `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${path}/view?project=${projectId}`;
}

export default function Navbar1() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const { user, isLoggedIn, logout } = useAuth();
  const { unlimitedStock } = useStoreSettings();
  const { totalItems, items, subtotal, removeItem, updateQuantity, getEffectivePrice } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loyaltyLevelId, setLoyaltyLevelId] = useState<string | null>(null);
  const { primaryAddress } = usePrimaryAddress();
  const [authPopupOpen, setAuthPopupOpen] = useState(false);

  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const authPopupRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [navLogoUrl, setNavLogoUrl] = useState<string>('');
  const [navStoreName, setNavStoreName] = useState<string>('');
  const [keniaEnabled, setKeniaEnabled] = useState(true);
  const lottieRef = useRef<HTMLDivElement>(null);
  const lottieAnimRef = useRef<any>(null);

  // Close FAB on route change
  useEffect(() => { setFabOpen(false); }, [pathname]);

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

  // Load Lottie animation for FAB button (dynamic import to avoid SSR)
  useEffect(() => {
    if (!mounted || !lottieRef.current) return;
    let anim: any = null;
    let destroyed = false;
    Promise.all([
      import('lottie-web'),
      fetch(`/button.json`).then(r => r.json())
    ]).then(([lottieModule, data]) => {
      if (destroyed || !lottieRef.current) return;
      anim = lottieModule.default.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: data
      });
      // Define a visible segment (skip empty start, stop before fade-out)
      const segStart = 50;
      const segEnd = 180;
      lottieAnimRef.current = anim;
      // Set initial frame after render
      requestAnimationFrame(() => {
        if (!lottieRef.current) return;
        anim.setSegment(segStart, segEnd);
        anim.goToAndStop(segStart, true);
      });
      // Freeze at end of play (forward -> stay at end, reverse -> stay at start)
      anim.addEventListener('complete', () => {
        if (lottieAnimRef.current !== anim) return;
        if (fabOpen) {
          anim.goToAndStop(segEnd, true);
        } else {
          anim.goToAndStop(segStart, true);
        }
      });
    }).catch(() => {});
    return () => {
      destroyed = true;
      if (anim) { anim.destroy(); }
      lottieAnimRef.current = null;
    };
  }, [mounted]);

  // Play forward on FAB open (freeze at end), reverse on close (freeze at start)
  useEffect(() => {
    const anim = lottieAnimRef.current;
    if (!anim) return;
    if (fabOpen) {
      anim.setDirection(1);
      anim.setSegment(50, 180);
      anim.goToAndStop(50, true);
      anim.play();
    } else {
      anim.setDirection(-1);
      anim.setSegment(50, 180);
      anim.goToAndStop(180, true);
      anim.play();
    }
  }, [fabOpen]);

  // Cargar logo del theme config (usar logo de scroll si existe)
  useEffect(() => {
    getSectionConfigAsync().then(cfg => {
      const heroSec = cfg.find((s: SectionConfig) => s.id === 'tpl1_hero');
      if (heroSec?.settings) {
        const hs = heroSec.settings as Record<string, any>;
        if (hs.heroStoreLogoMode === 'image') {
          // Priorizar logo de scroll (navbar), luego logo principal
          setNavLogoUrl(hs.heroStoreLogoScrollUrl || hs.heroStoreLogoUrl || '');
        }
      }
    }).catch(() => {
      const cfg = getSectionConfig();
      const heroSec = cfg.find((s: SectionConfig) => s.id === 'tpl1_hero');
      if (heroSec?.settings) {
        const hs = heroSec.settings as Record<string, any>;
        if (hs.heroStoreLogoMode === 'image') {
          setNavLogoUrl(hs.heroStoreLogoScrollUrl || hs.heroStoreLogoUrl || '');
        }
      }
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escuchar evento para abrir carrito desde HomePage.tsx
  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener('yaxsel:open-navbar-cart', openCart);
    return () => window.removeEventListener('yaxsel:open-navbar-cart', openCart);
  }, []);

  // Cargar avatar y nivel VIP del usuario
  useEffect(() => {
    if (!isLoggedIn) { setAvatarUrl(null); setLoyaltyLevelId(null); return; }
    (async () => {
      try {
        const { account } = getServices();
        const acc = await account.get();
        const prefs = (acc as { prefs?: Record<string, unknown> }).prefs || {};
        if (prefs.avatarFileId) setAvatarUrl(getFilePreviewUrl(String(prefs.avatarFileId)));
        else setAvatarUrl(null);
        setLoyaltyLevelId(prefs.loyaltyLevel ? String(prefs.loyaltyLevel) : 'bronze');
      } catch {
        setAvatarUrl(null);
        setLoyaltyLevelId(null);
      }
    })();
  }, [isLoggedIn, user?.id]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [accountOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (authPopupRef.current && !authPopupRef.current.contains(e.target as Node)) {
        setAuthPopupOpen(false);
      }
    };
    if (authPopupOpen && !isMobile) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [authPopupOpen, isMobile]);

  useEffect(() => {
    if (!authPopupOpen || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [authPopupOpen, isMobile]);

  // En desktop homepage: el navbar SIEMPRE existe pero solo es visible al hacer scroll
  // (el `scrolled` state ya está controlado por el useEffect de la línea ~154)
  const showNavDesktopHome = !isMobile && isHome;

  const NAV_LINKS = [
    { label: 'Inicio', href: '/' },
    { label: 'Tienda', href: '/productos' },
    { label: 'Paquetes', href: '/paquetes', icon: () => <Package size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} /> },
    // { label: 'Embalajes', href: '/embalajes', icon: () => <Store size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} /> },
    ...(!unlimitedStock ? [{ label: 'Catálogo', href: '/catalogo' }] : []),
    { label: 'Mis Pedidos', href: '/cuenta/pedidos' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    window.location.href = '/';
  };

  const authPopupPanel = (
    <div className={`tpl1-auth-popup${isMobile ? ' tpl1-auth-popup--sheet' : ''}`}>
      <button type="button" className="tpl1-auth-popup-close" onClick={() => setAuthPopupOpen(false)} aria-label="Cerrar"><X size={14} /></button>
      <div className="tpl1-auth-popup-icon" aria-hidden><User size={22} strokeWidth={2.2} /></div>
      <p className="tpl1-auth-popup-title">Inicia sesión o crea tu cuenta</p>
      <p className="tpl1-auth-popup-sub">Para realizar pedidos necesitas iniciar sesión o registrarte.</p>
      <Link href="/login" className="tpl1-auth-primary-btn" onClick={() => setAuthPopupOpen(false)}>Iniciar sesión</Link>
      <Link href="/login?tab=register" className="tpl1-auth-secondary-btn" onClick={() => setAuthPopupOpen(false)}>Crear cuenta</Link>
    </div>
  );

  const authPopupMobileLayer = authPopupOpen && mounted && isMobile ? (
    <>
      <div className="tpl1-auth-overlay" onClick={() => setAuthPopupOpen(false)} aria-hidden />
      {authPopupPanel}
    </>
  ) : null;

  return (
    <>
      <style>{`
        .tpl1-nav { position: sticky; top: 0; z-index: 9999; transition: all 0.3s ease; }
        .tpl1-nav.scrolled { box-shadow: 0 2px 12px rgba(227,150,191,0.04); backdrop-filter: blur(12px); }
        .tpl1-nav-inner { max-width: 1600px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 76px; }
        .tpl1-nav-logo { display: flex; align-items: center; text-decoration: none; gap: 10px; }
        .tpl1-nav-logo img { height: 36px !important; max-width: 120px !important; width: auto !important; object-fit: contain !important; transition: transform 0.3s ease, opacity 0.4s ease, height 0.3s ease, max-width 0.3s ease; flex-shrink: 0 !important; }
        .tpl1-nav.scrolled .tpl1-nav-logo img { height: 42px !important; max-width: 130px !important; }
        @keyframes tpl1LogoFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .tpl1-nav-logo:hover img { transform: scale(1.05); }
        .tpl1-nav-links { display: flex; gap: 4px; align-items: center; }
        .tpl1-nav-links a { font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; font-weight: 600; color: #444; text-decoration: none; padding: 10px 20px; border-radius: 999px; transition: all 0.25s ease; position: relative; }
        .tpl1-nav-links a:hover { background: linear-gradient(135deg, rgba(236,72,153,0.08), rgba(249,168,212,0.12)); color: #e396bf; transform: translateY(-1px); }
        .tpl1-nav-links a.active { background: linear-gradient(135deg, rgba(236,72,153,0.12), rgba(249,168,212,0.18)); color: #e396bf; font-weight: 700; }
        .tpl1-nav-actions { display: flex; align-items: center; gap: 6px; }
        .tpl1-nav-mobile-tools { display: flex; align-items: center; gap: 4px; }
        .tpl1-nav-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s ease; color: #e396bf; position: relative; }
        .tpl1-nav-btn:hover { background: linear-gradient(135deg, rgba(236,72,153,0.1), rgba(249,168,212,0.15)); color: #e396bf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(236,72,153,0.15); }
        .tpl1-nav-search-wrap { display: flex; align-items: center; overflow: hidden; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); max-width: 0; opacity: 0; }
        .tpl1-nav-search-wrap.open { max-width: 260px; opacity: 1; margin-right: 4px; }
        .tpl1-nav-search-wrap form { display: flex; align-items: center; background: linear-gradient(135deg, #fdf2f8, #fdf2f8); border: 1.5px solid rgba(227,150,191,0.2); border-radius: 999px; padding: 0 16px; height: 40px; width: 240px; }
        .tpl1-nav-search-wrap input { border: none; background: transparent; outline: none; font-size: 14px; width: 100%; color: #111; caret-color: #111; font-family: 'DM Sans', system-ui, sans-serif; }
        .tpl1-nav-search-wrap input::placeholder { color: #c084a0; }
        .tpl1-nav-mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 998; }
        .tpl1-nav-mobile-overlay.open { display: block; }
        .tpl1-nav-mobile-menu { display: none; position: fixed; top: 76px; right: 0; bottom: 0; width: 300px; background: #fff; z-index: 999; padding: 24px; flex-direction: column; gap: 4px; box-shadow: -8px 0 30px rgba(0,0,0,0.08); transform: translateX(100%); transition: transform 0.3s ease; }
        .tpl1-nav-mobile-menu.open { display: flex; transform: translateX(0); }
        .tpl1-nav-mobile-menu a { font-family: 'DM Sans', system-ui, sans-serif; font-size: 16px; font-weight: 600; color: #444; text-decoration: none; padding: 14px 18px; border-radius: 12px; transition: all 0.2s ease; display: flex; align-items: center; gap: 10px; }
        .tpl1-nav-mobile-menu a:hover { background: linear-gradient(135deg, rgba(236,72,153,0.08), rgba(249,168,212,0.12)); color: #e396bf; }
        .tpl1-nav-divider { height: 1px; background: #f3f4f6; margin: 8px 0; }

        /* Badge para cart/notif */
        .tpl1-nav-badge { position: absolute; top: 2px; right: 2px; background: linear-gradient(135deg, #e396bf, #c084a0); color: #fff !important; font-size: 9px; font-weight: 800; border-radius: 999px; min-width: 16px; height: 16px; padding: 0 4px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(236,72,153,0.4); }
        .tpl1-nav-notif-link { display: flex; align-items: center; text-decoration: none; background: none; border: none; padding: 0; cursor: pointer; font: inherit; }
        .tpl1-bottom-nav-item { cursor: pointer; }

        /* Dirección pill */
        .tpl1-nav-addr { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: linear-gradient(135deg, #fdf2f8, #fdf2f8); border: 1px solid rgba(227,150,191,0.15); border-radius: 999px; font-size: 12px; font-weight: 600; color: #555; text-decoration: none; max-width: 180px; transition: all 0.2s ease; }
        .tpl1-nav-addr:hover { background: linear-gradient(135deg, #fce7f3, #fbcfe8); border-color: rgba(227,150,191,0.3); transform: translateY(-1px); }
        .tpl1-nav-addr span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* Avatar */
        .tpl1-nav-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, ${ORANGE_PRIMARY}, ${PINK_LIGHT}); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; overflow: hidden; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.9); box-shadow: 0 2px 8px rgba(227,150,191,0.3); }
        .tpl1-nav-avatar.lg { width: 40px; height: 40px; font-size: 16px; }
        .tpl1-nav-avatar img { width: 100%; height: 100%; object-fit: cover; }

        /* Account button */
        .tpl1-nav-account { position: relative; }
        .tpl1-nav-account-btn { display: flex; align-items: center; gap: 8px; padding: 2px 14px 2px 2px; border: none; background: transparent; cursor: pointer; border-radius: 999px; transition: all 0.2s ease; }
        .tpl1-nav-account-btn:hover { background: linear-gradient(135deg, rgba(227,150,191,0.08), rgba(249,168,212,0.12)); }
        .tpl1-nav-account-name { font-size: 13px; font-weight: 600; color: #444; font-family: 'DM Sans', system-ui, sans-serif; }

        /* Dropdown */
        .tpl1-nav-dropdown { position: absolute; top: calc(100% + 12px); right: 0; min-width: 260px; background: #fff; border-radius: 16px; box-shadow: 0 12px 40px rgba(227,150,191,0.15), 0 4px 12px rgba(0,0,0,0.06); padding: 8px; z-index: 1001; border: 1px solid #fce7f3; animation: dropdownIn 0.2s ease; }
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cartDrawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .tpl1-nav-dropdown-header { display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid #f3f4f6; margin-bottom: 6px; }
        .tpl1-nav-dropdown-name { margin: 0; font-size: 14px; font-weight: 700; color: #222; }
        .tpl1-nav-dropdown-email { margin: 2px 0 0; font-size: 12px; color: #888; }
        .tpl1-nav-dropdown a, .tpl1-nav-dropdown button { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 500; color: #444; text-decoration: none; border-radius: 10px; transition: all 0.15s ease; border: none; background: transparent; cursor: pointer; width: 100%; text-align: left; font-family: 'DM Sans', system-ui, sans-serif; }
        .tpl1-nav-dropdown a:hover, .tpl1-nav-dropdown button:hover { background: linear-gradient(135deg, rgba(227,150,191,0.06), rgba(249,168,212,0.1)); color: ${ORANGE_PRIMARY}; }
        .tpl1-nav-logout { color: #dc2626 !important; }
        .tpl1-nav-logout:hover { background: rgba(220,38,38,0.06) !important; color: #dc2626 !important; }

        /* Auth popup */
        .tpl1-auth-popup { position: absolute; top: calc(100% + 14px); right: 0; width: 300px; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(227,150,191,0.1); border: 1px solid #fce7f3; padding: 28px 22px 22px; z-index: 1002; animation: dropdownIn 0.22s ease; text-align: center; }
        .tpl1-auth-popup-icon { width: 56px; height: 56px; margin: 0 auto 14px; border-radius: 50%; background: linear-gradient(135deg, #fdf2f8, #fce7f3); display: flex; align-items: center; justify-content: center; color: ${ORANGE_PRIMARY}; box-shadow: 0 4px 14px rgba(227,150,191,0.15); }
        .tpl1-auth-popup-title { font-size: 17px; font-weight: 800; color: #111; font-family: 'DM Sans', system-ui, sans-serif; margin: 0 0 8px; padding-right: 0; line-height: 1.25; letter-spacing: -0.02em; }
        .tpl1-auth-popup-sub { font-size: 13px; font-weight: 500; color: #6b7280; font-family: 'DM Sans', system-ui, sans-serif; margin: 0 0 18px; line-height: 1.45; }
        .tpl1-auth-popup-close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 50%; border: none; background: #f9fafb; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: #666; }
        .tpl1-auth-popup-close:hover { background: #fce7f3; color: ${ORANGE_PRIMARY}; }
        .tpl1-auth-primary-btn { display: block; width: 100%; padding: 14px; background: linear-gradient(135deg, ${ORANGE_PRIMARY}, #c0547a); color: #fff; border: none; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; text-align: center; text-decoration: none; font-family: 'DM Sans', system-ui, sans-serif; box-shadow: 0 4px 16px rgba(227,150,191,0.3); transition: all 0.2s; margin-bottom: 10px; }
        .tpl1-auth-primary-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(227,150,191,0.4); }
        .tpl1-auth-secondary-btn { display: block; width: 100%; padding: 13px; background: #fff; color: ${ORANGE_PRIMARY}; border: 2px solid #fce7f3; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; text-align: center; text-decoration: none; font-family: 'DM Sans', system-ui, sans-serif; transition: all 0.2s; }
        .tpl1-auth-secondary-btn:hover { border-color: ${ORANGE_PRIMARY}; background: rgba(227,150,191,0.04); }
        /* Nav avatar circle on button */
        .tpl1-nav-user-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; margin-top: 0; }
        .tpl1-nav-user-avatar img { width: 100%; height: 100%; object-fit: cover; }

        /* Mobile user header */
        .tpl1-nav-mobile-user { display: flex; align-items: center; gap: 12px; padding: 16px; background: linear-gradient(135deg, #fdf2f8, #fdf2f8); border-radius: 14px; margin-bottom: 8px; }

        /* Bottom mobile nav */
        @keyframes tpl1-nav-pop { 0% { transform: scale(0.92); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
        @keyframes tpl1-fab-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(135deg); } }
        @keyframes tpl1-fab-spin-back { 0% { transform: rotate(135deg); } 100% { transform: rotate(0deg); } }
        @keyframes tpl1-bbl-left   { 0% { opacity:0; transform: scale(0) translateY(30px); } 65% { opacity:1; transform: scale(1.1) translateY(-3px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes tpl1-bbl-top    { 0% { opacity:0; transform: translateY(30px) scale(0); } 65% { opacity:1; transform: translateY(-3px) scale(1.1); } 100% { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes tpl1-bbl-right  { 0% { opacity:0; transform: scale(0) translateY(30px); } 65% { opacity:1; transform: scale(1.1) translateY(-3px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes tpl1-bbl-left-out   { 0% { opacity:1; transform: scale(1) translateY(0); } 35% { opacity:1; transform: scale(1.1) translateY(-3px); } 100% { opacity:0; transform: scale(0) translateY(30px); } }
        @keyframes tpl1-bbl-top-out    { 0% { opacity:1; transform: translateY(0) scale(1); } 35% { opacity:1; transform: translateY(-3px) scale(1.1); } 100% { opacity:0; transform: translateY(30px) scale(0); } }
        @keyframes tpl1-bbl-right-out  { 0% { opacity:1; transform: scale(1) translateY(0); } 35% { opacity:1; transform: scale(1.1) translateY(-3px); } 100% { opacity:0; transform: scale(0) translateY(30px); } }
        .tpl1-bottom-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 10040;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(0,0,0,0.06);
          padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 8px));
          box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
        }
        .tpl1-bottom-nav-inner { display: flex; justify-content: space-around; align-items: center; max-width: 520px; margin: 0 auto; gap: 2px; }
        .tpl1-bottom-nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          text-decoration: none; padding: 5px 8px 3px; border-radius: 14px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease;
          position: relative; background: transparent; border: none; cursor: pointer; min-width: 48px;
        }
        .tpl1-bottom-nav-item:active { transform: scale(0.88); }
        .tpl1-bottom-nav-item svg {
          width: 20px; height: 20px; color: #9ca3af;
          transition: color 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tpl1-bottom-nav-item span {
          font-size: 9px; font-weight: 700; color: #9ca3af; font-family: 'DM Sans', system-ui, sans-serif;
          transition: color 0.3s ease, transform 0.3s ease, font-weight 0.15s ease; letter-spacing: -0.01em;
        }
        .tpl1-bottom-nav-item.active {
          background: transparent;
        }
        .tpl1-bottom-nav-item.active svg {
          color: #e396bf;
          animation: tpl1-nav-bounce 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tpl1-bottom-nav-item.active span {
          color: #e396bf; font-weight: 800;
          animation: tpl1-nav-label-pop 0.35s ease;
        }
        .tpl1-bottom-nav-item.active::after {
          display: none;
        }
        @keyframes tpl1-nav-bounce {
          0% { transform: scale(0.5) translateY(6px); opacity: 0; }
          50% { transform: scale(1.2) translateY(-4px); opacity: 1; }
          70% { transform: scale(0.9) translateY(1px); }
          100% { transform: scale(1) translateY(-2px); }
        }
        @keyframes tpl1-nav-label-pop {
          0% { transform: scale(0.8); opacity: 0.5; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes tpl1-nav-dot-in {
          0% { width: 0; opacity: 0; }
          100% { width: 16px; opacity: 1; }
        }
        .tpl1-bottom-nav-item .tpl1-bottom-badge {
          position: absolute; top: -4px; right: -4px;
          background: linear-gradient(135deg, #e396bf, #c084a0);
          color: #fff !important; font-size: 11px; font-weight: 800; border-radius: 999px;
          min-width: 20px; height: 20px; padding: 0 5px;
          display: flex; align-items: center; justify-content: center; border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(236,72,153,0.5); line-height: 1;
        }

        /* FAB central */
        .tpl1-fab-wrap { position: relative; display: flex; flex-direction: column; align-items: center; }
        .tpl1-fab-btn {
          width: 76px; height: 76px; border-radius: 50%; border: none; cursor: pointer;
          background: transparent; color: #fff; display: flex; align-items: center; justify-content: center;
          box-shadow: none;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          margin-top: -24px; position: relative; z-index: 2; overflow: visible;
        }
        .tpl1-fab-btn svg { background: transparent !important; }
        .tpl1-fab-btn svg > g > path:first-child { fill: transparent !important; }
        .tpl1-fab-btn:hover { box-shadow: none; }
        .tpl1-fab-btn:active { transform: scale(0.95); }
        .tpl1-fab-label { font-size: 10px; font-weight: 700; color: #9ca3af; margin-top: -2px; font-family: 'DM Sans', system-ui, sans-serif; letter-spacing: -0.02em; transition: color 0.3s ease, font-weight 0.15s ease; }
        .tpl1-fab-wrap.active .tpl1-fab-label { color: #e396bf; font-weight: 800; }

        /* Bubble items — arc layout, label above circle */
        .tpl1-fab-bubbles {
          position: fixed;
          bottom: 80px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 320px; height: 160px;
          pointer-events: none; z-index: 10050;
        }
        .tpl1-fab-bubble {
          position: absolute;
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; white-space: nowrap;
          opacity: 0; pointer-events: none; cursor: pointer;
          transform: scale(0.7) translateY(40px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .tpl1-fab-bubbles.open .tpl1-fab-bubble { pointer-events: auto; opacity: 1; transform: none; }
        /* Unidad — left, lower */
        .tpl1-fab-bubble:nth-child(1) { left: 60px; bottom: 0; transition-delay: 0.05s; }
        .tpl1-fab-bubble:nth-child(1) .tpl1-bubble-label { padding: 4px 24px 4px 14px; }
        /* Paquete — right, lower */
        .tpl1-fab-bubble:nth-child(2) { right: 60px; bottom: 0; transition-delay: 0.1s; }
        .tpl1-fab-bubble:nth-child(2) .tpl1-bubble-label { padding: 4px 14px 4px 24px; }
        .tpl1-bubble-circle {
          width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          background: #fff; border: 1.5px solid rgba(0,0,0,0.08);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          flex-shrink: 0;
        }
        .tpl1-bubble-circle svg { width: 26px; height: 26px; color: #e396bf; }
        .tpl1-en-camino-icon { width: 26px; height: 26px; }
        .tpl1-catalog-icon { width: 26px; height: 26px; }
        .tpl1-shop-icon { width: 26px; height: 26px; }
        .tpl1-bubble-label {
          font-size: 11px; font-weight: 800; color: #1a1a2e; font-family: 'DM Sans', system-ui, sans-serif;
          background: rgba(255,255,255,0.96); backdrop-filter: blur(6px); padding: 4px 24px 4px 15px; border-radius: 999px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.06);
          min-width: 80px; text-align: left;
        }

        /* FAB overlay */
        .tpl1-fab-overlay {
          position: fixed; inset: 0; z-index: 10039;
          background: rgba(0,0,0,0); transition: background 0.3s ease;
        }
        .tpl1-fab-overlay.open { background: rgba(255,255,255,0.5); }
        /* Mobile search overlay */
        .tpl1-search-overlay { display: none; position: fixed; inset: 0; z-index: 99999; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); flex-direction: column; padding: 0; animation: tpl1SearchSlideIn 0.25s ease-out; }
        .tpl1-search-overlay.open { display: flex; }
        .tpl1-search-overlay-header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #fce7f3; }
        .tpl1-search-overlay-back { width: 36px; height: 36px; border-radius: 50%; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #666; flex-shrink: 0; }
        .tpl1-search-overlay-form { flex: 1; display: flex; align-items: center; background: linear-gradient(135deg, #fdf2f8, #fdf2f8); border: 1.5px solid rgba(227,150,191,0.25); border-radius: 999px; padding: 0 14px; height: 40px; }
        .tpl1-search-overlay-form input { border: none; background: transparent; outline: none; font-size: 15px; width: 100%; color: #111; caret-color: #111; font-family: 'DM Sans', system-ui, sans-serif; }
        .tpl1-search-overlay-form input::placeholder { color: #f5a8cf; }
        .tpl1-search-overlay-suggestions { padding: 16px; display: flex; flex-direction: column; gap: 6px; }
        .tpl1-search-overlay-suggestions p { font-size: 12px; font-weight: 600; color: #999; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .tpl1-search-overlay-tag { display: inline-block; padding: 8px 16px; background: #fdf2f8; border: 1px solid rgba(236,72,153,0.15); border-radius: 999px; font-size: 13px; color: #e396bf; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', system-ui, sans-serif; }
        .tpl1-search-overlay-tag:hover { background: rgba(236,72,153,0.1); }
        .tpl1-search-overlay-results { padding: 0 16px; flex: 1; overflow-y: auto; }
        .tpl1-search-overlay-result { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; text-decoration: none; color: #333; }
        .tpl1-search-overlay-result img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; background: #f9f9f9; }
        .tpl1-search-overlay-result-info { flex: 1; }
        .tpl1-search-overlay-result-name { font-size: 14px; font-weight: 500; color: #333; }
        .tpl1-search-overlay-result-price { font-size: 13px; color: #e396bf; font-weight: 600; }
        .tpl1-search-overlay-empty { text-align: center; padding: 40px 16px; color: #999; font-size: 14px; }
        @keyframes tpl1SearchSlideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        /* Mobile fabs (WhatsApp + ChatBot) in navbar */
        .tpl1-nav-mobile-fabs { display: none; align-items: center; gap: 6px; flex-shrink: 0; flex-grow: 0; }
        .tpl1-nav-mobile-fab { width: 20px !important; height: 20px !important; max-width: 20px !important; max-height: 20px !important; min-width: 20px !important; min-height: 20px !important; aspect-ratio: 1 !important; border-radius: 50% !important; border: none !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: transform 0.2s !important; overflow: hidden !important; flex-shrink: 0 !important; flex-grow: 0 !important; padding: 0 !important; line-height: 0 !important; font-size: 0 !important; text-decoration: none !important; align-self: center !important; box-sizing: border-box !important; }
        .tpl1-nav-mobile-fab:hover { transform: scale(1.05); }
        .tpl1-nav-mobile-fab svg { width: 12px !important; height: 12px !important; min-width: 12px !important; min-height: 12px !important; max-width: 12px !important; max-height: 12px !important; flex-shrink: 0 !important; display: block !important; }
        .tpl1-nav-mobile-fab--wa { background: #25D366 !important; }
        .tpl1-nav-mobile-fab--cb { background: linear-gradient(135deg, #3483fa, #6366f1) !important; }
        @media (max-width: 768px) {
          .tpl1-bottom-nav { display: block; }
        }

        @keyframes tpl1AuthSheetIn { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) {
          .tpl1-nav-addr { display: none; }
          .tpl1-nav-account-name { display: none; }
        }
        @media (max-width: 768px) {
          .tpl1-auth-overlay { position: fixed; inset: 0; z-index: 10049; background: rgba(0,0,0,0.28); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); animation: dropdownIn 0.2s ease; }
          .tpl1-nav-auth-wrap { position: relative !important; }
          .tpl1-auth-popup {
            position: fixed !important;
            top: 60px !important;
            right: 12px !important;
            left: 12px !important;
            width: auto !important;
            border-radius: 16px !important;
            z-index: 10050 !important;
            animation: dropdownIn 0.2s ease !important;
          }
          .tpl1-nav-dropdown {
            position: absolute !important;
            top: calc(100% + 10px) !important;
            right: -10px !important;
            width: 240px !important;
            border-radius: 16px !important;
            z-index: 10050 !important;
            animation: dropdownIn 0.2s ease !important;
          }
          .tpl1-nav { min-height: 48px !important; height: auto !important; background: rgba(255,255,255,0.98) !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; border-bottom: none !important; z-index: 9999 !important; transition: all 0.35s cubic-bezier(0.4,0,0.2,1) !important; }
          .tpl1-nav.tpl1-nav-home { border-radius: 999px !important; box-shadow: 0 1px 8px rgba(0,0,0,0.06) !important; margin: 6px 80px 0 !important; position: absolute !important; top: 24px !important; left: 0 !important; right: 0 !important; }
          .tpl1-nav.tpl1-nav-home.scrolled { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; margin: 0 !important; border-radius: 0 !important; min-height: 48px !important; box-shadow: 0 2px 16px rgba(0,0,0,0.08) !important; }
          .tpl1-nav.tpl1-nav-page { display: none !important; }
          .tpl1-nav.scrolled .tpl1-nav-inner { height: 48px !important; min-height: 48px !important; padding: 0 12px !important; }
          .tpl1-nav.scrolled .tpl1-nav-btn { width: 34px !important; height: 34px !important; }
          .tpl1-nav.scrolled .tpl1-nav-btn svg { width: 17px !important; height: 17px !important; }
          .tpl1-nav.scrolled .tpl1-nav-avatar { width: 24px !important; height: 24px !important; font-size: 10px !important; }
          .tpl1-nav.scrolled .tpl1-nav-user-avatar { width: 24px !important; height: 24px !important; }
          .tpl1-nav.scrolled .tpl1-nav-mobile-fab { width: 24px !important; height: 24px !important; }
          .tpl1-nav.scrolled .tpl1-nav-mobile-fab svg { width: 14px !important; height: 14px !important; }
          .tpl1-nav-links { display: none !important; }
          .tpl1-nav-logo { display: none !important; }
          .tpl1-nav.scrolled .tpl1-nav-logo { display: flex !important; }
          .tpl1-nav.scrolled .tpl1-nav-mobile-fabs { display: none !important; }
          .tpl1-nav-mobile-fabs { display: flex !important; }
          .tpl1-nav-hamburger { display: none !important; }
          .tpl1-nav-inner { padding: 0 10px !important; height: 48px !important; min-height: 48px !important; gap: 0 !important; justify-content: space-between !important; transition: all 0.35s cubic-bezier(0.4,0,0.2,1) !important; position: relative !important; }
          .tpl1-nav-mobile-center { position: absolute !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; display: flex !important; align-items: center !important; gap: 4px !important; font-size: 10px !important; color: #c084a0 !important; white-space: nowrap !important; max-width: 140px !important; overflow: hidden !important; text-overflow: ellipsis !important; background: linear-gradient(135deg, #fdf2f8, #fdf2f8) !important; border: 1px solid rgba(227,150,191,0.25) !important; border-radius: 999px !important; padding: 4px 10px !important; font-weight: 500 !important; font-family: 'DM Sans', system-ui, sans-serif !important; animation: tpl1AddrIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) both !important; z-index: 10 !important; }
          @keyframes tpl1AddrIn { from { opacity: 0; transform: translate(-50%, calc(-50% - 6px)); } to { opacity: 1; transform: translate(-50%, -50%); } }
          .tpl1-nav-mobile-center svg { flex-shrink: 0 !important; }
          .tpl1-nav-logo img { height: 22px !important; max-width: 58px !important; }
          .tpl1-nav.scrolled .tpl1-nav-logo img { height: 18px !important; max-width: 48px !important; }
          .tpl1-nav-btn { width: 32px !important; height: 32px !important; transition: all 0.35s cubic-bezier(0.4,0,0.2,1) !important; }
          .tpl1-nav-btn svg { width: 16px !important; height: 16px !important; transition: all 0.35s cubic-bezier(0.4,0,0.2,1) !important; }
          .tpl1-nav-avatar { width: 24px !important; height: 24px !important; font-size: 9px !important; border-width: 1px !important; transition: all 0.35s cubic-bezier(0.4,0,0.2,1) !important; }
          .tpl1-nav-user-avatar { width: 24px !important; height: 24px !important; margin-top: 0 !important; transition: all 0.35s cubic-bezier(0.4,0,0.2,1) !important; }
          .tpl1-nav-account-btn { gap: 2px !important; }
          .tpl1-nav-actions { gap: 1px !important; }

          /* Herramientas móvil: lupa + notificaciones juntas a la derecha */
          .tpl1-nav-mobile-tools {
            display: flex !important;
            align-items: center !important;
            gap: 2px !important;
            margin-left: auto !important;
          }
          .tpl1-nav-notif-link {
            display: flex !important;
          }

          /* Hide favorites and cart on mobile (están en bottom nav) */
          .tpl1-nav-actions a[href="/favoritos"],
          .tpl1-nav-actions button[title="Carrito"] {
            display: none !important;
          }

          /* Search on mobile - use overlay instead of inline */
          .tpl1-nav-search-wrap { display: none !important; }

          /* Remove hover animations on mobile */
          *:hover { transform: none !important; box-shadow: inherit !important; }
          .tpl1-nav-mobile-center,
          .tpl1-nav-mobile-center:hover { transform: translate(-50%, -50%) !important; }
          .tpl1-nav-logo:hover img { transform: none !important; }
          .tpl1-nav-links a:hover { background: transparent !important; color: #444 !important; transform: none !important; }
          .tpl1-nav-btn:hover { background: transparent !important; color: #666 !important; transform: none !important; box-shadow: none !important; }
          .tpl1-nav-mobile-menu a:hover { background: transparent !important; color: #444 !important; }
          .tpl1-auth-popup-close:hover { background: #f3f4f6 !important; color: #666 !important; }
          .tpl1-auth-primary-btn:hover { transform: none !important; box-shadow: 0 4px 16px rgba(227,150,191,0.3) !important; }
          .tpl1-nav-dropdown a:hover, .tpl1-nav-dropdown button:hover { background: transparent !important; color: #444 !important; transform: none !important; }
          .tpl1-auth-secondary-btn:hover { border-color: #fce7f3 !important; background: #fff !important; transform: none !important; }
          .tpl1-nav-addr:hover { background: transparent !important; border-color: rgba(227,150,191,0.15) !important; transform: none !important; }
        }
      `}</style>

      <div className={`tpl1-nav-mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Top navbar: on mobile only show on homepage */}
      <nav
        className={`tpl1-nav ${scrolled ? 'scrolled' : ''} ${isHome ? 'tpl1-nav-home' : 'tpl1-nav-page'}`}
        style={{
          background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
          borderBottom: `1px solid ${scrolled ? '#fce7f3' : '#f5f5f5'}`,
          ...(showNavDesktopHome ? {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s ease',
            pointerEvents: scrolled ? 'auto' : 'none',
          } : {})
        }}
      >
        <div className="tpl1-nav-inner">
          {/* Mobile center: address â€” solo visible con navbar expandida (scroll) */}
          {isMobile && scrolled && (
            <a href="/cuenta/direcciones" className="tpl1-nav-mobile-center" aria-live="polite" style={{ textDecoration: 'none' }}>
              <MapPin size={10} color={ORANGE_PRIMARY} />
              <span>{primaryAddress || (isLoggedIn ? 'Mi ubicación' : 'Ubicación')}</span>
            </a>
          )}
          <a href="/" className="tpl1-nav-logo" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            {navLogoUrl ? <img src={navLogoUrl} alt="Inicio" style={{ opacity: 0, transition: 'opacity 0.4s ease', animation: 'tpl1LogoFadeIn 0.4s ease forwards' }} /> : null}
          </a>

          {/* Mobile fabs - WhatsApp + ChatBot (replaces logo on mobile) */}
          <div className="tpl1-nav-mobile-fabs">
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="tpl1-nav-mobile-fab tpl1-nav-mobile-fab--wa" title="WhatsApp">
              <svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            {keniaEnabled && (
              <button type="button" className="tpl1-nav-mobile-fab tpl1-nav-mobile-fab--cb" title="ChatBot" onClick={() => openChatbot()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
              </button>
            )}
          </div>

          <div className="tpl1-nav-links">
            {NAV_LINKS.map(link => {
              const IconComp = (link as any).icon;
              const isHomeLink = link.href === '/';
              return (
                isHomeLink ? (
                  <a key={link.href} href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className={pathname === link.href ? 'active' : ''}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
                    {IconComp && <IconComp />}{link.label}
                  </Link>
                )
              );
            })}
          </div>

          <div className="tpl1-nav-actions">
            <div className={`tpl1-nav-search-wrap ${searchOpen ? 'open' : ''}`}>
              <form onSubmit={handleSearch}>
                <Search size={16} color={ORANGE_PRIMARY} style={{ marginRight: 8, flexShrink: 0 }} />
                <input placeholder="Buscar productos..." autoFocus={searchOpen} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </form>
            </div>
            <div className="tpl1-nav-mobile-tools">
              <button className="tpl1-nav-btn" onClick={() => setSearchOpen(!searchOpen)} title="Buscar"><Search size={20} color="#e396bf" /></button>

            </div>

            {/* Dirección primaria */}
            <Link href="/cuenta/direcciones" className="tpl1-nav-addr" title="Mis direcciones">
              <MapPin size={14} color={ORANGE_PRIMARY} />
              <span>{primaryAddress || (isLoggedIn ? 'Agregar ubicación' : 'Ingresa ubicación')}</span>
            </Link>

            <a href="/favoritos" title="Favoritos" onClick={(e) => { e.preventDefault(); window.location.href = '/cuenta/favoritos'; }}>
              <button className="tpl1-nav-btn"><Heart size={20} color="#e396bf" /></button>
            </a>

            {/* Carrito con badge — abre custom cart drawer */}
            <button className="tpl1-nav-btn cart-btn" data-cart-item={totalItems} onClick={() => setCartOpen(true)} title="Carrito">
              <ShoppingCart size={20} color="#e396bf" />
            </button>

            {/* Cuenta - logueado vs no logueado */}
            {isLoggedIn && user ? (
              <div className="tpl1-nav-account" ref={accountDropdownRef} style={{ position: 'relative' }}>
                <button className="tpl1-nav-account-btn" onClick={() => setAccountOpen(!accountOpen)} title="Mi cuenta">
                  <NavAvatarWithBadge
                    avatarUrl={avatarUrl}
                    userName={user.name}
                    size={36}
                    loyaltyLevelId={loyaltyLevelId}
                  />
                  <span className="tpl1-nav-account-name">{user.name?.split(' ')[0]}</span>
                </button>
                {accountOpen && (
                  <div className="tpl1-nav-dropdown">
                    <div className="tpl1-nav-dropdown-header">
                      <NavAvatarWithBadge
                        avatarUrl={avatarUrl}
                        userName={user.name}
                        size={40}
                        loyaltyLevelId={loyaltyLevelId}
                      />
                      <div>
                        <p className="tpl1-nav-dropdown-name">{user.name}</p>
                        <p className="tpl1-nav-dropdown-email">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/cuenta" onClick={() => setAccountOpen(false)}><User size={16} /> Mi cuenta</Link>
                    <Link href="/cuenta/pedidos" onClick={() => setAccountOpen(false)}><Receipt size={16} /> Mis pedidos</Link>
                    <Link href="/cuenta/pedidos-mayoristas" onClick={() => setAccountOpen(false)}><Package size={16} /> Pedidos Mayoristas</Link>
                    <Link href="/cuenta/direcciones" onClick={() => setAccountOpen(false)}><MapPin size={16} /> Direcciones</Link>
                    <a href="/cuenta/favoritos" onClick={(e) => { e.preventDefault(); window.location.href = '/cuenta/favoritos'; setAccountOpen(false); }}><Heart size={16} /> Favoritos</a>
                    <div className="tpl1-nav-divider" />
                    <button onClick={handleLogout} className="tpl1-nav-logout"><LogOut size={16} /> Cerrar sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="tpl1-nav-auth-wrap" ref={authPopupRef} style={{ position: 'relative' }}>
                <button className="tpl1-nav-btn" onClick={() => setAuthPopupOpen(!authPopupOpen)} title="Iniciar sesión">
                  <User size={20} color="#e396bf" />
                </button>
                {authPopupOpen && !isMobile && authPopupPanel}
              </div>
            )}

            <button className="tpl1-nav-btn tpl1-nav-hamburger" style={{ display: 'none' }} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className={`tpl1-nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
          {isLoggedIn && user && (
            <div className="tpl1-nav-mobile-user">
              <NavAvatarWithBadge
                avatarUrl={avatarUrl}
                userName={user.name}
                size={44}
                loyaltyLevelId={loyaltyLevelId}
              />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{user.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{user.email}</p>
              </div>
            </div>
          )}
          {NAV_LINKS.map(link => (
            link.href === '/' ? (
              <a key={link.href} href="/" onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.location.href = '/'; }}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            )
          ))}
          <div className="tpl1-nav-divider" />
          <Link href="/cuenta/direcciones" onClick={() => setMenuOpen(false)}><MapPin size={16} /> Direcciones</Link>
          <a href="/cuenta/favoritos" onClick={(e) => { e.preventDefault(); window.location.href = '/cuenta/favoritos'; setMenuOpen(false); }}><Heart size={16} /> Favoritos</a>
          <Link href="/carrito" onClick={() => setMenuOpen(false)}><ShoppingCart size={16} /> Carrito {totalItems > 0 && `(${totalItems})`}</Link>
          {isLoggedIn ? (
            <>
              <Link href="/cuenta" onClick={() => setMenuOpen(false)}><User size={16} /> Mi cuenta</Link>
              <Link href="/cuenta/pedidos" onClick={() => setMenuOpen(false)}><Receipt size={16} /> Mis pedidos</Link>
              <Link href="/cuenta/pedidos-mayoristas" onClick={() => setMenuOpen(false)}><Package size={16} /> Pedidos Mayoristas</Link>
              <button onClick={handleLogout} className="tpl1-nav-logout"><LogOut size={16} /> Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}><User size={16} /> Ingresar</Link>
              <Link href="/login?tab=register" onClick={() => setMenuOpen(false)}>Crear cuenta</Link>
            </>
          )}
        </div>
      </nav>

      {/* â”€â”€ Cart Drawer â”€â”€ */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setCartOpen(false)} style={{ position: 'absolute', inset: 0, background: 'transparent' }} />
          <div style={{ position: 'relative', width: 420, maxWidth: '92vw', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 48px rgba(0,0,0,0.15)', animation: 'cartDrawerIn 0.3s cubic-bezier(0.4,0,0.2,1)' }}>

            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #fdf2f8, #fff)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${PINK_LIGHT}, ${ORANGE_PRIMARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(227,150,191,0.3)' }}>
                  <ShoppingCart size={20} color="#fff" />
                </div>
                <div>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#222', fontFamily: 'DM Sans, system-ui, sans-serif', display: 'block' }}>Mi carrito</span>
                  <span style={{ fontSize: 12, color: '#888', fontFamily: 'DM Sans, system-ui, sans-serif' }}>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
                </div>
              </div>
              <button onClick={() => setCartOpen(false)} style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', cursor: 'pointer', color: '#666', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#666'; }}>
                <X size={18} />
              </button>
            </div>

            {/* Items list */}
            {items.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40, textAlign: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(227,150,191,0.2)' }}>
                  <ShoppingCart size={48} strokeWidth={1.5} color={ORANGE_PRIMARY} />
                </div>
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#222', fontFamily: 'DM Sans, system-ui, sans-serif' }}>Tu carrito está vacío</p>
                  <p style={{ margin: 0, fontSize: 14, color: '#888', fontFamily: 'DM Sans, system-ui, sans-serif', maxWidth: 260, lineHeight: 1.5 }}>¡Explora nuestros productos y encuentra algo que te encante!</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
                  <Link href="/productos" onClick={() => setCartOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', padding: '14px 24px', background: `linear-gradient(135deg, ${ORANGE_PRIMARY}, #c0547a)`, borderRadius: 12, transition: 'all .2s', boxShadow: '0 4px 16px rgba(227,150,191,0.35)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(227,150,191,0.45)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(227,150,191,0.35)'; }}>
                    <ShoppingCart size={18} />
                    Explorar productos
                  </Link>
                  <button onClick={() => setCartOpen(false)} style={{ background: '#fff', color: '#666', fontSize: 14, fontWeight: 600, padding: '12px 24px', borderRadius: 10, border: '1.5px solid #e5e7eb', cursor: 'pointer', fontFamily: 'DM Sans, system-ui, sans-serif', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                    Seguir navegando
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {items.map(item => {
                  const price = getEffectivePrice(item);
                  return (
                    <div key={item.product.$id} style={{ display: 'flex', gap: 16, padding: '16px 24px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                      {/* Imagen del producto - clickable */}
                      <Link href={`/producto/${item.product.$id}`} onClick={() => setCartOpen(false)} style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', background: '#f9fafb', flexShrink: 0, border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.product.IMAGEURL ? <img src={item.product.IMAGEURL} alt={item.product.NAME} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShoppingCart size={24} color="#ccc" />}
                      </Link>
                      
                      {/* Info del producto */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {/* Nombre - clickable */}
                        <Link href={`/producto/${item.product.$id}`} onClick={() => setCartOpen(false)} style={{ textDecoration: 'none' }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Sans, system-ui, sans-serif', lineHeight: 1.3 }}>{item.product.NAME}</p>
                        </Link>
                        
                        {/* Precios */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: ORANGE_PRIMARY, fontFamily: 'DM Sans, system-ui, sans-serif' }}>{formatPrice(price * item.quantity)}</span>
                          <span style={{ fontSize: 12, color: '#888', fontFamily: 'DM Sans, system-ui, sans-serif' }}>({formatPrice(price)} × {item.quantity})</span>
                        </div>
                        
                        {/* Controles */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #fce7f3', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                            <button onClick={() => updateQuantity(item.product.$id, item.quantity - (item.product.PACKQTY && item.product.PACKQTY > 0 && item.quantity % item.product.PACKQTY === 0 ? item.product.PACKQTY : 1))} style={{ width: 32, height: 32, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ORANGE_PRIMARY, transition: 'all .15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.color = '#c0547a'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = ORANGE_PRIMARY; }}>
                              <Minus size={14} />
                            </button>
                            <span style={{ minWidth: 36, padding: '0 4px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#333', borderLeft: '1px solid #fce7f3', borderRight: '1px solid #fce7f3', lineHeight: '32px', fontFamily: 'DM Sans, system-ui, sans-serif', whiteSpace: 'nowrap' }}>
                              {item.quantity}
                              {item.product.PACKQTY && item.product.PACKQTY > 0 && item.quantity % item.product.PACKQTY === 0 && (
                                <span style={{ fontSize: 10, color: '#db2777', marginLeft: 4 }}>({item.quantity / item.product.PACKQTY} pqts)</span>
                              )}
                            </span>
                            <button onClick={() => updateQuantity(item.product.$id, item.quantity + (item.product.PACKQTY && item.product.PACKQTY > 0 && item.quantity % item.product.PACKQTY === 0 ? item.product.PACKQTY : 1))} style={{ width: 32, height: 32, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ORANGE_PRIMARY, transition: 'all .15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.color = '#c0547a'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = ORANGE_PRIMARY; }}>
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <button onClick={() => removeItem(item.product.$id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 8, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'DM Sans, system-ui, sans-serif', transition: 'all .15s' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.background = 'none'; }}>
                            <Trash2 size={16} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '20px 24px 24px', borderTop: '1px solid #fce7f3', background: 'linear-gradient(135deg, #fdf2f8, #fff)', flexShrink: 0 }}>
                {/* Resumen de costos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: '#666', fontFamily: 'DM Sans, system-ui, sans-serif' }}>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#444', fontFamily: 'DM Sans, system-ui, sans-serif' }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: '#888', fontFamily: 'DM Sans, system-ui, sans-serif' }}>Envío</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#22c55e', fontFamily: 'DM Sans, system-ui, sans-serif' }}>Calculado en checkout</span>
                  </div>
                  <div style={{ height: 1, background: '#fce7f3', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#222', fontFamily: 'DM Sans, system-ui, sans-serif' }}>Total</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#222', fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: -0.5 }}>{formatPrice(subtotal)}</span>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link href="/checkout" onClick={() => setCartOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: `linear-gradient(135deg, ${ORANGE_PRIMARY}, #c0547a)`, color: '#fff', padding: '14px 20px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 20px rgba(227,150,191,0.3)', fontFamily: 'DM Sans, system-ui, sans-serif', transition: 'all .25s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(227,150,191,0.4)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(227,150,191,0.3)'; }}>
                    <ShoppingCart size={18} />
                    Ir al checkout
                  </Link>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link href="/carrito" onClick={() => setCartOpen(false)} style={{ flex: 1, textAlign: 'center', background: '#fff', color: ORANGE_PRIMARY, fontSize: 14, fontWeight: 600, padding: '12px', borderRadius: 10, textDecoration: 'none', fontFamily: 'DM Sans, system-ui, sans-serif', border: `1.5px solid ${PINK_LIGHT}`, transition: 'all .2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fdf2f8'; (e.currentTarget as HTMLElement).style.borderColor = ORANGE_PRIMARY; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = PINK_LIGHT; }}>
                      Ver carrito
                    </Link>
                    <button onClick={() => setCartOpen(false)} style={{ flex: 1, background: '#f9fafb', color: '#666', fontSize: 14, fontWeight: 600, padding: '12px', borderRadius: 10, border: '1.5px solid #e5e7eb', cursor: 'pointer', fontFamily: 'DM Sans, system-ui, sans-serif', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                      Seguir comprando
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB overlay */}
      {fabOpen && <div className="tpl1-fab-overlay open" onClick={() => setFabOpen(false)} />}

      {/* Bottom mobile nav — hidden on /inventario */}
      <nav className={`tpl1-bottom-nav${pathname?.startsWith('/inventario') ? ' !hidden' : ''}`}>
        <div className="tpl1-bottom-nav-inner">
          <a href="/" className={`tpl1-bottom-nav-item ${!fabOpen && pathname === '/' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <Home />
            <span>Inicio</span>
          </a>
          <a href="/cuenta/favoritos" className={`tpl1-bottom-nav-item ${!fabOpen && (pathname === '/favoritos' || pathname?.startsWith('/cuenta/favoritos')) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); window.location.href = '/cuenta/favoritos'; }}>
            <Heart />
            <span>Favoritos</span>
          </a>

          {/* FAB central — Tienda / Catálogo / En Camino */}
          {/* FAB central — Unidad / Embalaje / Paquete */}
          <div className={`tpl1-fab-bubbles${fabOpen ? ' open' : ''}`}>
            {/* Unidad */}
            <div className="tpl1-fab-bubble" onClick={() => { setFabOpen(false); router.push('/productos'); }}>
              <span className="tpl1-bubble-label">Unidad</span>
              <div className="tpl1-bubble-circle">
                <svg viewBox="0 0 512 512" className="tpl1-shop-icon" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <g>
                      <g>
                        <path d="M503.467,153.6c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H460.8V128h42.667c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H460.8V102.4h34.133c4.719,0,8.533-3.814,8.533-8.533c0-4.719-3.814-8.533-8.533-8.533H460.8V76.8h25.6c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533h-25.6V51.2h17.067c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H460.8V25.6h8.533c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H460.8c0-4.719-3.814-8.533-8.533-8.533c-4.719,0-8.533,3.814-8.533,8.533H435.2c-4.719,0-8.533,3.814-8.533,8.533s3.814,8.533,8.533,8.533h8.533v8.533h-17.067c-4.719,0-8.533,3.814-8.533,8.533s3.814,8.533,8.533,8.533h17.067v8.533h-25.6c-4.719,0-8.533,3.814-8.533,8.533s3.814,8.533,8.533,8.533h25.6v8.533H409.6c-4.719,0-8.533,3.814-8.533,8.533c0,4.719,3.814,8.533,8.533,8.533h34.133v8.533h-42.667c-4.719,0-8.533,3.814-8.533,8.533s-3.814,8.533,8.533,8.533h42.667v8.533h-42.667c-4.719,0-8.533,3.814-8.533,8.533s-3.814,8.533,8.533,8.533h42.667v8.533h-42.667c-4.719,0-8.533,3.814-8.533,8.533s-3.814,8.533,8.533,8.533h42.667v8.533h-42.667c-4.719,0-8.533,3.814-8.533,8.533s-3.814,8.533,8.533,8.533h42.667v8.533H409.6c-4.719,0-8.533,3.814-8.533,8.533s-3.814,8.533,8.533,8.533h34.133v8.533h-25.6c-4.719,0-8.533,3.814-8.533,8.533s-3.814,8.533,8.533,8.533h25.6v8.533h-17.067c-4.719,0-8.533,3.814-8.533,8.533c0,4.719,3.814,8.533,8.533,8.533h17.067v34.133h-10.325c-13.124,0-23.808,10.684-23.808,23.808V358.4h-17.067V512H512V358.4h-17.067v-18.859c0-13.124-10.684-23.808-23.808-23.808H460.8V281.6h17.067c4.719,0,8.533-3.814,8.533-8.533c0-4.719-3.814-8.533-8.533-8.533H460.8V256h25.6c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533h-25.6V230.4h34.133c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H460.8V204.8h42.667c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H460.8V179.2h42.667c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H460.8V153.6H503.467z M471.125,332.8c3.721,0,6.741,3.021,6.741,6.741V358.4h-51.2v-18.859c0-3.721,3.021-6.741,6.741-6.741H471.125z" fill="#e396bf"/>
                        <path d="M324.267,132.448c1.971-9.583,0.503-18.125-5.205-23.834c-6.605-6.605-16.922-7.987-29.056-3.968c-10.129,3.388-20.847,10.368-30.157,19.686c-16.768,16.768-24.363,35.968-20.915,49.493v107.776h-17.067v42.667h119.467v-42.667h-17.067V132.448z M307.2,281.602H256v-92.177c1.331,0.213,2.731,0.307,4.173,0.316c0.085,0.008,0.171,0.026,0.265,0.026c0.256,0,0.555-0.068,0.819-0.077c1.434-0.034,2.91-0.171,4.429-0.401c0.563-0.085,1.118-0.179,1.698-0.29c1.886-0.375,3.814-0.836,5.811-1.502c10.129-3.371,20.838-10.351,30.157-19.669c1.331-1.34,2.611-2.705,3.849-4.096V281.602z M307.627,129.282c-0.051,0.154-0.154,0.273-0.196,0.427c-0.469,1.954-1.186,3.994-2.074,6.05c-0.111,0.247-0.222,0.495-0.333,0.751c-0.811,1.775-1.783,3.584-2.867,5.393c-0.239,0.401-0.444,0.794-0.7,1.195c-1.161,1.835-2.466,3.652-3.874,5.461c-0.247,0.316-0.435,0.623-0.691,0.939c-1.715,2.133-3.584,4.233-5.606,6.263c-7.373,7.364-15.932,13.03-23.492,15.556c-6.494,2.15-10.3,1.434-11.588,0.154c-0.256-0.265-0.393-0.725-0.572-1.118c-0.043-0.12-0.077-0.145-0.128-0.29c-0.043-0.137-0.154-0.23-0.213-0.367c-1.493-5.487,2.765-19.439,16.623-33.297c12.134-12.134,24.371-16.922,30.899-16.922c1.954,0,3.396,0.427,4.181,1.203C308.284,121.977,308.591,125.083,307.627,129.282z" fill="#e396bf"/>
                        <path d="M162.133,25.6c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8h-8.533H41.284C18.517,8.533,0,27.051,0,49.818v403.831c0,22.767,18.517,41.284,41.284,41.284h26.982H76.8h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533c0-4.719-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533c0-4.719-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533c0-4.719-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8v-25.6h85.333c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H76.8V25.6H162.133z" fill="#e396bf"/>
                        <rect x="221.867" y="341.333" width="119.467" height="170.667" fill="#e396bf"/>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </div>

            {/* Paquete */}
            <div className="tpl1-fab-bubble" onClick={() => { setFabOpen(false); router.push('/paquetes'); }}>
              <span className="tpl1-bubble-label">Paquete</span>
              <div className="tpl1-bubble-circle">
                <svg viewBox="0 0 116.36 122.88" className="tpl1-en-camino-icon" xmlns="http://www.w3.org/2000/svg">
                  <title>cosmetics</title>
                  <path d="M85.62,74.85a6.32,6.32,0,0,1,1.11.38L84.87,57.44h0a1.14,1.14,0,0,1,1-1.24,1.12,1.12,0,0,1,1.23,1L89.18,77A7.06,7.06,0,0,1,91,81.72V93.24H109l4.4-51.79H80.16l1.75,19.4a23.15,23.15,0,0,1,3.14,5A1.28,1.28,0,0,1,85.61,67v7.87Zm-58.44,13c18.26,5.33,35,5,50.46,0v21c-15,5.92-31.52,6.78-50.46,0v-21ZM71.3,55.05A55.46,55.46,0,0,0,52,47.49c-.8,8.92-4.32,14.39-9.75,17.55C37.33,67.87,31,68.77,23.72,68.6a14.21,14.21,0,0,0,1.36.71c5.47,2.52,15.82,3.94,26.36,4.08s21.2-1,27.28-3.52a9.06,9.06,0,0,0,4.06-2.77c-2-4.72-6.38-8.82-11.48-12ZM83.05,76.89c.19-.78,0-5.43,0-6.49a16.32,16.32,0,0,1-3.34,1.84c-6.4,2.68-17.44,3.86-28.3,3.71S29.8,74.3,24,71.64a14.18,14.18,0,0,1-2.24-1.26v6.8c4.22,3.87,17,5.93,30,6s26.27-1.89,31.3-6v-.24Zm-63.85.42a4.34,4.34,0,0,0-2,1.13,4.2,4.2,0,0,0-1.24,3v31.52l.56.38c8.77,5.72,25.34,7.53,40.51,6.89,14.89-.63,28.27-3.53,31.38-7.34V81.72a4.51,4.51,0,0,0-1.33-3.19,4.59,4.59,0,0,0-1.47-1v.16a1.28,1.28,0,0,1-.49,1c-5.24,4.8-19.46,7.07-33.38,7S23.89,83.2,19.56,78.59v0a1.28,1.28,0,0,1-.34-.87h0v-.39Zm22.5-15a60,60,0,0,0-10.87,1.59,37.15,37.15,0,0,0-6.31,2.12c6.5.09,12.15-.75,16.4-3.23q.4-.23.78-.48ZM91,96.47v5c5.81.4,15.33.29,16.57-.87A4,4,0,0,0,108.62,98v0l.14-1.53H91Zm-.4,17.77,0,0c-3.36,4.46-17.68,7.83-33.41,8.49s-32.76-1.27-42-7.3c-.42-.28-.82-.56-1.22-.85a1.34,1.34,0,0,1-.3-.33H1.47A1.48,1.48,0,0,1,0,112.8V69.74a1.47,1.47,0,0,1,1.47-1.47H3.7V43.54a1.4,1.4,0,0,1,1.4-1.39H7.76V17.21c5,.79,9.64,3.49,13.85,9.5V42.15h2.16a1.39,1.39,0,0,1,1.39,1.39V63a42.48,42.48,0,0,1,5.05-1.58,63.14,63.14,0,0,1,14.46-1.75h.08c2.72-3.09,4.41-7.52,4.76-13.74a1.27,1.27,0,0,1,1.34-1.21l.17,0a46.47,46.47,0,0,1,6.43,1.36V29.64a.53.53,0,0,1,0-.13l-9.21-22a.94.94,0,0,1,.29-1.2c10.73-7.89,18-9.06,28.35,0a.94.94,0,0,1,.19,1.18L68.77,29.88h0V50.64c1.32.69,2.62,1.44,3.88,2.23a42.08,42.08,0,0,1,6.75,5.25L77.86,41a1.11,1.11,0,0,1-.24-.69,1.19,1.19,0,0,1,.13-.53l-.53-5.9a1.13,1.13,0,0,1,1-1.23h37a1.13,1.13,0,0,1,1.13,1.13.88.88,0,0,1,0,.16l-.52,6.11a1.09,1.09,0,0,1,0,.26,1.12,1.12,0,0,1-.09.44l-4.88,57.41a.22.22,0,0,1,0,.08,6.22,6.22,0,0,1-1.77,4,4.94,4.94,0,0,1-2,1.11v8.92a1.93,1.93,0,0,1-1.94,1.94H90.57Zm-71.37-46V67a1.29,1.29,0,0,1,.56-1.06,16,16,0,0,1,2.62-1.66V44.92H6.48V68.27H19.2ZM59.33,46.69a60.65,60.65,0,0,1,7.56,3V46.21H59.33v.48Zm0-2.36h7.56V31.15H59.33V44.33ZM84,46.55a1.13,1.13,0,1,1,2.23-.36l.66,4.2a1.13,1.13,0,0,1-2.23.36L84,46.55Zm26.23-11.62V39.2h3.36l.36-4.27ZM108,39.2V34.92h-3.85V39.2Zm-6.1,0V34.92H98.07V39.2Zm-6.09,0V34.92H92V39.2Zm-6.1,0V34.92H85.88V39.2Zm-6.1,0V34.92H79.57L80,39.2Z" fill="#c68b59"/>
                </svg>
              </div>
            </div>
          </div>
          <div className={`tpl1-fab-wrap${fabOpen ? ' active' : ''}`}>
            <button className={`tpl1-fab-btn${fabOpen ? ' open' : ''}`} onClick={() => setFabOpen(v => !v)} aria-label="Compra desde">
              <div ref={lottieRef} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
            </button>
            <span className="tpl1-fab-label">Compra desde</span>
          </div>

          <Link href="/carrito" className={`tpl1-bottom-nav-item ${!fabOpen && pathname === '/carrito' ? 'active' : ''}`}>
            <ShoppingCart />
            {totalItems > 0 && <span className="tpl1-bottom-badge">{totalItems > 99 ? '99+' : totalItems}</span>}
            <span>Carrito</span>
          </Link>
          <Link href="/cuenta" className={`tpl1-bottom-nav-item ${!fabOpen && pathname?.startsWith('/cuenta') && !pathname?.startsWith('/cuenta/favoritos') ? 'active' : ''}`} style={{ position: 'relative' }}>
            {isLoggedIn && user ? (
              <NavAvatarWithBadge avatarUrl={avatarUrl} userName={user.name} size={26} loyaltyLevelId={loyaltyLevelId} />
            ) : (
              <User />
            )}
            <span>Perfil</span>
          </Link>
        </div>
      </nav>

      {/* Mobile search overlay */}
      {authPopupMobileLayer && createPortal(authPopupMobileLayer, document.body)}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

    </>
  );
}
