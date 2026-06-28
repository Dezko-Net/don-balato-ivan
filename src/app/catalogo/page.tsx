'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Search, Package, ArrowRight, Heart, Bell, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getServices, getAppwriteConfig, STOCK_ALERTS_COLLECTION, formatPrice, ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { resolveStorageImageUrl, getProductImageUrl } from '@/lib/product-images';
import { Product, Category, Subcategory } from '@/types';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import AperturaDiscountBadge from '@/components/AperturaDiscountBadge';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/hooks/useAuth';
import ImageZoomModal from '@/components/ImageZoomModal';
import { buildStockAlertData, normalizeStockAlert } from '@/lib/stock-alerts';

const PAGE_SIZE = 10;

const FF = '"DM Sans","Proxima Nova",-apple-system,BlinkMacSystemFont,sans-serif';

export default function CatalogoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { unlimitedStock } = useStoreSettings();

  useEffect(() => {
    if (unlimitedStock) {
      router.replace('/productos');
    }
  }, [unlimitedStock, router]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filterBarHeight, setFilterBarHeight] = useState(52);
  const [barVisible, setBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);
  const offsetRef = useRef(0);
  useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user, isLoggedIn } = useAuth();
  const { settings: apertura } = useAperturaPromotion();
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestQty, setRequestQty] = useState<Record<string, number>>({});
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  // Load user's existing requests
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const loadRequested = async () => {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const res = await databases.listDocuments(databaseId, STOCK_ALERTS_COLLECTION, [
          Query.equal('userId', user.id),
          Query.limit(500),
        ]);
        setRequestedIds(new Set(res.documents.map((d: any) => normalizeStockAlert(d).productId)));
      } catch {}
    };
    loadRequested();
  }, [isLoggedIn, user]);

  const handleRequestAvailability = async (productId: string, productName: string, productImage: string, qty: number = 1) => {
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    if (requestedIds.has(productId) || requestingId) return;
    setRequestingId(productId);
    try {
      const { databases } = getServices();
      const { databaseId } = getAppwriteConfig();
      await databases.createDocument(
        databaseId,
        STOCK_ALERTS_COLLECTION,
        ID.unique(),
        buildStockAlertData({
          productId,
          userId: user!.id,
          productName,
          productImage,
          quantity: qty,
        }),
      );
      setRequestedIds(prev => new Set([...prev, productId]));
    } catch (e: any) {
      alert('Error al consultar disponibilidad: ' + (e.message || e));
    } finally {
      setRequestingId(null);
    }
  };

  // Load counts (categories + counts or subcategories + counts)
  const loadCounts = useCallback(async (cat: string) => {
    try {
      const params = cat ? `?category=${encodeURIComponent(cat)}` : '';
      const res = await fetch(`/api/public-data/catalog-counts${params}`, { cache: 'no-store' });
      const data = await res.json();
      if (cat) {
        setSubcategories((data.subcategories || []) as Subcategory[]);
        setSubcategoryCounts(data.subcategoryCounts || {});
      } else {
        setCategories((data.categories || []) as Category[]);
        setCategoryCounts(data.categoryCounts || {});
      }
      setTotalCount(data.total || 0);
    } catch (e) { console.error('loadCounts error:', e); }
  }, []);

  // Load products page from API
  const loadProducts = useCallback(async (offsetVal: number, append: boolean) => {
    if (append) setLoadingMore(true); else setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offsetVal),
      });
      if (selectedCat) params.set('category', selectedCat);
      if (selectedSub) params.set('subcategory', selectedSub);
      if (search) params.set('search', search);
      const res = await fetch(`/api/public-data/catalog-products?${params}`, { cache: 'no-store' });
      const data = await res.json();
      const newProducts = (data.products || []) as Product[];
      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      setHasMore(data.hasMore || false);
      const newOffset = offsetVal + newProducts.length;
      setOffset(newOffset);
      offsetRef.current = newOffset;
    } catch (e) { console.error('loadProducts error:', e); }
    finally {
      if (append) setLoadingMore(false); else setIsLoading(false);
    }
  }, [selectedCat, selectedSub, search]);

  // Initial load: counts + first page (only once)
  useEffect(() => {
    loadCounts('');
    loadProducts(0, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When category changes: load subcategories + counts + reset products
  useEffect(() => {
    if (selectedCat) {
      loadCounts(selectedCat);
      loadProducts(0, false);
    } else if (selectedSub) {
      loadCounts('');
      loadProducts(0, false);
    }
  }, [selectedCat]); // eslint-disable-line react-hooks/exhaustive-deps

  // When subcategory changes: reset products
  useEffect(() => {
    if (selectedCat) loadProducts(0, false);
  }, [selectedSub]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search: reset products
  useEffect(() => {
    if (search) {
      const t = setTimeout(() => loadProducts(0, false), 400);
      return () => clearTimeout(t);
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Measure filter bar height for spacer
  useEffect(() => {
    const measure = () => {
      const bar = document.getElementById('cat-filters-bar');
      if (bar) setFilterBarHeight(bar.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [selectedCat, selectedSub, subcategories.length]);

  // Show/hide filter bar on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setBarVisible(currentY <= 100 || currentY < lastScrollY.current);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMoreRef.current && !isLoading) {
          loadingMoreRef.current = true;
          setLoadingMore(true);
          loadProducts(offsetRef.current, true).finally(() => {
            loadingMoreRef.current = false;
          });
        }
      },
      { rootMargin: '200px' }
    );
    // Delay observation to avoid immediate fire after non-append loads
    const timer = setTimeout(() => {
      if (!cancelled) observer.observe(sentinel);
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); observer.disconnect(); };
  }, [hasMore, isLoading, loadProducts]);

  const categoriesWithProducts = categories.filter(c => (categoryCounts[c.$id] || 0) > 0);

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.$id === catId)?.name || 'Sin categoría';
  };

  const getCategoryImage = (catId: string) => {
    const cat = categories.find(c => c.$id === catId);
    return cat?.iconUrl || '';
  };

  if (unlimitedStock) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: FF }}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FF, minHeight: '100vh', background: '#fafafa' }}>
      <style>{`
        @keyframes cat-shimmer { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes cat-img-skeleton { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes subcat-in { 0% { opacity: 0; transform: translateY(8px) scale(0.9); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .subcat-pill { animation: subcat-in .3s ease-out both; }
        .cat-img-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
          background-size: 200% 100%;
          animation: cat-img-skeleton 1.5s ease-in-out infinite;
        }
        @keyframes cat-bg { 0% { transform: scale(1); } 50% { transform: scale(1.06); } 100% { transform: scale(1); } }
        @keyframes cat-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(194,65,12,0.4); } 50% { box-shadow: 0 0 0 8px rgba(194,65,12,0); } }
        .cat-card-wrap:hover .cat-card-img { transform: scale(1.06); }
        .cat-pill { transition: all .2s; }
        .cat-pill:hover { transform: translateY(-2px); }
        @media (max-width: 768px) {
          .cat-card-wrap { flex-direction: column !important; min-height: auto !important; border-radius: 14px !important; }
          .cat-card-img-side { width: 100% !important; min-width: 0 !important; height: auto !important; min-height: 280px !important; }
          .cat-card-img-side .cat-card-img { object-fit: contain !important; }
          .cat-card-info { padding: 16px 18px !important; }
          .cat-card-info h3 { font-size: 17px !important; margin: 4px 0 10px !important; }
          .cat-card-info .price-label { font-size: 11px !important; letter-spacing: 1px !important; }
          .cat-card-info .price-val { font-size: 22px !important; }
          .cat-card-info .price-val-sm { font-size: 20px !important; }
          .cat-hero-title { font-size: 28px !important; letter-spacing: -0.5px !important; }
          .cat-hero-wrap { padding: 64px 16px 24px !important; }
          .cat-hero-desc { font-size: 12px !important; }
          .cat-hero-notice { padding: 8px 10px !important; margin-bottom: 14px !important; }
          .cat-hero-notice p { font-size: 10.5px !important; line-height: 1.45 !important; }
          .cat-scroll-arrow { display: none !important; }
          #cat-scroll { padding-left: 12px !important; padding-right: 12px !important; }
          .cat-skeleton { flex-direction: column !important; min-height: auto !important; }
          .cat-skeleton-img { width: 100% !important; height: 180px !important; }
          .cat-skeleton-info { padding: 16px 18px !important; }
          .cat-section-title { font-size: 18px !important; }
          .cat-cta-btn { padding: 12px 0 !important; font-size: 11px !important; margin-top: 12px !important; letter-spacing: 1px !important; }
          .cat-content-area { padding: 16px 12px 60px !important; }
          .cat-pack-badge { font-size: 12px !important; padding: 6px 12px !important; margin-top: 8px !important; }
          .cat-pack-badge strong { font-size: 14px !important; }
          .cat-price-card { padding: 8px 12px !important; border-radius: 10px !important; gap: 4px !important; }
          .cat-price-card .price-label { font-size: 11px !important; letter-spacing: 1px !important; }
          .cat-price-card .price-val { font-size: 20px !important; letter-spacing: -0.3px !important; }
          .cat-price-card .price-val-sm { font-size: 18px !important; }
          .cat-red-rule { width: 40% !important; margin-bottom: 14px !important; }
          .cat-cat-tag { font-size: 9px !important; letter-spacing: 1px !important; }
          .cat-card-list { gap: 14px !important; }
          .cat-a-pedido-badge { font-size: 9px !important; padding: 4px 9px !important; letter-spacing: 1.2px !important; }
          .cat-disc-badge { top: 40px !important; left: 12px !important; }
        }
      `}</style>
      {/* ── HERO ── */}
      <div style={{
        position: 'relative', overflow: 'hidden', textAlign: 'center',
        background: 'url(https://static.vecteezy.com/system/resources/previews/010/930/988/non_2x/shopping-online-on-phone-with-podium-paper-art-modern-background-gifts-box-vector.jpg) center/cover',
        padding: '100px 24px 70px',
      }} className="cat-hero-wrap">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.78) 60%, rgba(255,255,255,0.95) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(227,150,191,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#c0547a', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Catálogo Exclusivo</span>
          <h1 className="cat-hero-title" style={{ fontSize: 52, fontWeight: 900, color: '#1a1a2e', margin: '0 0 10px', lineHeight: 1.05, letterSpacing: '-1.5px', fontFamily: '"Playfair Display", Georgia, serif' }}>
            Productos<br /><span style={{ color: '#e396bf' }}>a Pedido</span>
          </h1>
          <p className="cat-hero-desc" style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', margin: '0 0 20px', letterSpacing: '0.3px' }}>
            {isLoading ? 'Cargando catálogo...' : `${totalCount.toLocaleString()} productos disponibles para consultar`}
          </p>
          <div className="cat-hero-notice" style={{ background: 'rgba(227,150,191,0.06)', border: '1px solid rgba(227,150,191,0.12)', borderRadius: 12, padding: '12px 16px', margin: '0 0 24px', textAlign: 'left' }}>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: 0, lineHeight: 1.6, fontFamily: FF }}>
              <span style={{ color: '#c0547a', fontWeight: 700 }}>⚠</span> Para consultar disponibilidad necesitás estar registrado. Recibirás la respuesta por notificaciones — si hay stock se agregará a la tienda, si no, también se te notificará. <strong style={{ color: '#1a1a2e' }}>Esto no es un pedido.</strong> Para comprar con stock disponible, ingresá a <Link href="/" style={{ color: '#c0547a', fontWeight: 600, textDecoration: 'underline' }}>Tienda</Link>.
            </p>
          </div>
          <div style={{ position: 'relative', maxWidth: 460, margin: '0 auto' }}>
            <Search size={17} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
            <input
              type="text"
              placeholder="Buscar en el catálogo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 20px 14px 48px', borderRadius: 14,
                border: '1.5px solid rgba(227,150,191,0.15)', fontSize: 14, fontFamily: FF,
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)',
                color: '#111', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color .2s, box-shadow .2s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(227,150,191,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(227,150,191,0.08)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(227,150,191,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div id="cat-filters-bar" style={{
        background: '#fff', borderBottom: '1px solid #eee',
        position: 'fixed', top: barVisible ? 0 : -120, left: 0, right: 0, zIndex: 40,
        transition: 'top .3s ease',
      }}>
        {/* Compact mode: subcategory selected */}
        {selectedSub ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px' }}>
            <button
              onClick={() => { setSelectedCat(''); setSelectedSub(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 50, border: '1px solid #fce7f3', background: '#fdf2f8', cursor: 'pointer', fontFamily: FF, fontSize: 12, fontWeight: 700, color: '#be185d', letterSpacing: '0.5px' }}
            >
              <ChevronLeft size={14} /> Volver
            </button>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e396bf', letterSpacing: '1px', textTransform: 'uppercase' }}>{subcategories.find(s => s.$id === selectedSub)?.name || 'Subcategoría'}</span>
          </div>
        ) : (
          <>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button
            onClick={() => {
              if (scrollRef.current) scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
            }}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg, #fff 60%, transparent)', border: 'none', cursor: 'pointer', zIndex: 5, color: '#999' }}
            className="cat-scroll-arrow"
          >
            <ChevronLeft size={18} />
          </button>
          <div id="cat-scroll" ref={scrollRef} style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 24px 14px 44px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <button className="cat-pill" onClick={() => { setSelectedCat(''); setSelectedSub(''); }} style={{
              padding: '9px 22px', borderRadius: 50, cursor: 'pointer', fontFamily: FF, fontSize: 12,
              fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '1px', textTransform: 'uppercase',
              border: `1px solid ${!selectedCat ? '#e396bf' : '#ddd'}`,
              background: !selectedCat ? 'linear-gradient(135deg,#e396bf,#e396bf)' : '#fff',
              color: !selectedCat ? '#fff' : '#666',
              boxShadow: !selectedCat ? '0 2px 10px rgba(227,150,191,0.2)' : 'none',
            }}>✦ Todos</button>
            {categoriesWithProducts.map(cat => (
              <button key={cat.$id} className="cat-pill"
                onClick={() => { setSelectedCat(selectedCat === cat.$id ? '' : cat.$id); setSelectedSub(''); }}
                style={{
                  padding: '9px 22px', borderRadius: 50, cursor: 'pointer', fontFamily: FF, fontSize: 12,
                  fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '1px', textTransform: 'uppercase',
                  border: `1px solid ${selectedCat === cat.$id ? '#e396bf' : '#ddd'}`,
                  background: selectedCat === cat.$id ? 'linear-gradient(135deg,#e396bf,#e396bf)' : '#fff',
                  color: selectedCat === cat.$id ? '#fff' : '#666',
                  boxShadow: selectedCat === cat.$id ? '0 2px 10px rgba(227,150,191,0.2)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                {getCategoryImage(cat.$id) && <img src={getCategoryImage(cat.$id)} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} />}
                {cat.name} <span style={{ fontSize: 10, fontWeight: 700, opacity: .7 }}>({categoryCounts[cat.$id] || 0})</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            }}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(270deg, #fff 60%, transparent)', border: 'none', cursor: 'pointer', zIndex: 5, color: '#999' }}
            className="cat-scroll-arrow"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        {selectedCat && !selectedSub && subcategories.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '0 24px 14px' }}>
            {subcategories.filter(sub => (subcategoryCounts[sub.$id] || 0) > 0).map((sub, i) => (
              <button key={sub.$id} className="cat-pill subcat-pill"
                onClick={() => setSelectedSub(selectedSub === sub.$id ? '' : sub.$id)}
                style={{
                  animationDelay: `${i * 0.04}s`, padding: '8px 18px', borderRadius: 50, cursor: 'pointer', fontFamily: FF, fontSize: 11,
                  fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.8px', textTransform: 'uppercase',
                  border: `1px solid ${selectedSub === sub.$id ? '#f5a8cf' : '#fce7f3'}`,
                  background: selectedSub === sub.$id ? 'linear-gradient(135deg,#e396bf,#c0547a)' : '#fdf2f8',
                  color: selectedSub === sub.$id ? '#fff' : '#be185d',
                  boxShadow: selectedSub === sub.$id ? '0 3px 14px rgba(227,150,191,0.3)' : '0 1px 3px rgba(227,150,191,0.08)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'all .2s',
                }}>
                {sub.ICON_URL && <img src={sub.ICON_URL} alt="" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />}
                {sub.name} <span style={{ fontSize: 9, fontWeight: 700, opacity: .7 }}>({subcategoryCounts[sub.$id] || 0})</span>
              </button>
            ))}
          </div>
        )}
        </>
        )}
      </div>
      {/* Spacer for fixed filter bar */}
      <div style={{ height: filterBarHeight }} />

      {/* ── CONTENT ── */}
      <div className="cat-content-area" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 80px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="cat-skeleton" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: i % 2 !== 0 ? 'row-reverse' : 'row', minHeight: 380, border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.08)' }}>
                <div className="cat-skeleton-img" style={{ width: '42%', background: '#fdf2f8', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 16, left: 16, padding: '5px 12px', borderRadius: 6, background: '#fce7f3', width: 70, height: 18 }} />
                </div>
                <div className="cat-skeleton-info" style={{ flex: 1, padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ height: 10, background: '#eee', borderRadius: 50, width: '25%' }} />
                  <div style={{ height: 24, background: '#eee', borderRadius: 8, width: '65%' }} />
                  <div style={{ height: 1, background: '#fce7f3', width: '55%' }} />
                  <div style={{ height: 20, background: '#eee', borderRadius: 12, width: '40%' }} />
                  <div style={{ height: 20, background: '#eee', borderRadius: 12, width: '35%' }} />
                  <div style={{ marginTop: 24, height: 52, background: '#fce7f3', borderRadius: 12 }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <Package size={56} color="#ccc" style={{ margin: '0 auto 20px' }} />
            <p style={{ fontSize: 22, fontWeight: 700, color: '#333', margin: '0 0 8px', fontFamily: '"Playfair Display", serif' }}>Sin resultados</p>
            <p style={{ fontSize: 14, color: '#888', margin: 0 }}>Prueba con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <h2 className="cat-section-title" style={{ fontSize: 28, fontWeight: 900, color: '#e396bf', margin: 0, fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px' }}>
                  {selectedCat ? getCategoryName(selectedCat) : 'Todos los productos'}
                </h2>
                <p style={{ fontSize: 13, color: '#888', margin: '6px 0 0', letterSpacing: '0.5px' }}>
                  {totalCount.toLocaleString()} producto{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
                </p>
              </div>
              {selectedCat && (
                <Link href={`/categoria/${selectedCat}`} style={{ fontSize: 11, fontWeight: 700, color: '#e396bf', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '1.5px', textTransform: 'uppercase', border: '1px solid rgba(227,150,191,0.15)', padding: '8px 16px', borderRadius: 50, background: 'rgba(227,150,191,0.04)' }}>
                  Ver en tienda <ArrowRight size={13} />
                </Link>
              )}
            </div>
            <div className="cat-card-list" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {products.map((p, i) => <CatalogoProductCard key={p.$id} product={p} apertura={apertura} index={i} categories={categories} isLoggedIn={isLoggedIn} requestedIds={requestedIds} requestingId={requestingId} requestQty={requestQty} onRequest={handleRequestAvailability} onZoom={() => { const src = getProductImageUrl(p); if (src) setZoomImage({ src, alt: p.NAME }); }} onQtyChange={(id, q) => setRequestQty(prev => ({ ...prev, [id]: q }))} />)}
            </div>
            {hasMore && (
              <div ref={sentinelRef} style={{ textAlign: 'center', padding: '32px 0' }}>
                {loadingMore ? (
                  <Loader2 size={28} style={{ color: '#e396bf', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <button onClick={() => { setLoadingMore(true); loadProducts(offset, true).finally(() => setLoadingMore(false)); }} style={{
                    padding: '14px 40px', border: 'none', borderRadius: 50,
                    background: 'linear-gradient(135deg, #e396bf, #c0547a)',
                    color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                    letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: FF,
                    boxShadow: '0 6px 24px rgba(227,150,191,0.3)',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    <Package size={16} /> Cargar más
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {zoomImage && <ImageZoomModal src={zoomImage.src} alt={zoomImage.alt} onClose={() => setZoomImage(null)} />}
    </div>
  );
}

const PINK = '#e396bf';

function CatalogoProductCard({ product, apertura, index = 0, categories, isLoggedIn, requestedIds, requestingId, requestQty, onRequest, onZoom, onQtyChange }: { product: Product; apertura: any; index?: number; categories: Category[]; isLoggedIn: boolean; requestedIds: Set<string>; requestingId: string | null; requestQty: Record<string, number>; onRequest: (id: string, name: string, img: string, qty: number) => void; onZoom: () => void; onQtyChange: (id: string, qty: number) => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { displayPrice, hasDiscount, discountPercent } = resolveProductDisplayPrice(product, apertura);
  const img = resolveStorageImageUrl(product.IMAGEURL) || resolveStorageImageUrl(product.IMAGEURL2);
  const isReversed = index % 2 !== 0;
  const catName = categories.find(c => c.$id === product.CATEGORYID)?.name || '';
  const alreadyRequested = requestedIds.has(product.$id);
  const isRequesting = requestingId === product.$id;
  const [imgLoaded, setImgLoaded] = useState(false);
  const qty = requestQty[product.$id] || 1;

  return (
    <Link href={`/producto/${product.$id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="cat-card-wrap" style={{
        background: '#fff', borderRadius: 20, overflow: 'hidden',
        display: 'flex', flexDirection: isReversed ? 'row-reverse' : 'row',
        minHeight: 280, border: '1px solid #eee',
        transition: 'border-color .3s, box-shadow .3s, transform .3s', cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.08)',
      }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e396bf'; el.style.boxShadow = '0 12px 40px rgba(227,150,191,0.12), 0 6px 16px rgba(227,150,191,0.08)'; el.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#eee'; el.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.08)'; el.style.transform = 'none'; }}
      >
        {/* ── IMAGE SIDE ── */}
        <div
          onClick={e => { if (img) { e.preventDefault(); e.stopPropagation(); onZoom(); } }}
          style={{ width: '42%', minWidth: 220, position: 'relative', overflow: 'hidden', flexShrink: 0, background: '#fdf2f8', cursor: img ? 'zoom-in' : 'default' }}
          className="cat-card-img-side"
        >
          {img ? (
            <>
              {!imgLoaded && <div className="cat-img-skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />}
              <img
                className="cat-card-img"
                src={img}
                alt={product.NAME}
                onLoad={() => setImgLoaded(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease, opacity .4s ease', display: 'block', opacity: imgLoaded ? 1 : 0 }}
              />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc' }}><Package size={64} /></div>
          )}
          {/* A PEDIDO badge */}
          <div className="cat-a-pedido-badge" style={{ position: 'absolute', top: 16, left: 16, padding: '5px 12px', borderRadius: 6, background: '#e396bf', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>A Pedido</span>
          </div>
          {/* Discount badge */}
          {hasDiscount && discountPercent > 0 && (
            <div className="cat-disc-badge" style={{ position: 'absolute', top: 48, left: 16 }}>
              <AperturaDiscountBadge percent={discountPercent} size="sm" />
            </div>
          )}
        </div>

        {/* ── INFO SIDE ── */}
        <div className="cat-card-info" style={{ flex: 1, padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            {/* Category tag */}
            {catName && (
              <span className="cat-cat-tag" style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {catName}
              </span>
            )}
            {/* Product name */}
            <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', margin: '10px 0 20px', lineHeight: 1.2, fontFamily: '"Playfair Display", serif' }}>
              {product.NAME}
            </h3>
            {/* Red rule */}
            <div className="cat-red-rule" style={{ height: 1, background: 'linear-gradient(90deg, #e396bf 0%, transparent 100%)', width: '55%', marginBottom: 22 }} />

            {/* PRICES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(product.PACKQTY ?? 0) > 0 && (product.PRICE ?? 0) > 0 && (
                <div className="cat-price-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 12, background: 'rgba(22,163,74,0.06)', border: '1.5px solid rgba(22,163,74,0.15)' }}>
                  <span className="price-label" style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', letterSpacing: '2px', textTransform: 'uppercase' }}>Precio por Embalaje</span>
                  <span className="price-val-sm" style={{ fontSize: 32, fontWeight: 900, color: '#16a34a', fontFamily: '"Playfair Display", serif', letterSpacing: '-0.5px' }}>
                    {formatPrice(product.PRICE)}
                  </span>
                </div>
              )}
              {(product.WHOLESALEPRICE ?? 0) > 0 && (
                <div className="cat-price-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 12, background: 'rgba(227,150,191,0.06)', border: '1.5px solid rgba(227,150,191,0.18)' }}>
                  <span className="price-label" style={{ fontSize: 14, fontWeight: 800, color: '#e396bf', letterSpacing: '2px', textTransform: 'uppercase' }}>Precio</span>
                  <span className="price-val" style={{ fontSize: 36, fontWeight: 900, color: '#e396bf', fontFamily: '"Playfair Display", serif', letterSpacing: '-1px' }}>
                    {formatPrice(product.WHOLESALEPRICE ?? 0)}
                  </span>
                </div>
              )}
              {!((product.WHOLESALEPRICE ?? 0) > 0) && !((product.PACKQTY ?? 0) > 0 && (product.PRICE ?? 0) > 0) && displayPrice > 0 && (
                <div className="cat-price-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 12, background: 'rgba(227,150,191,0.06)', border: '1.5px solid rgba(227,150,191,0.18)' }}>
                  <span className="price-label" style={{ fontSize: 14, fontWeight: 800, color: '#e396bf', letterSpacing: '2px', textTransform: 'uppercase' }}>Precio</span>
                  <span className="price-val" style={{ fontSize: 36, fontWeight: 900, color: '#e396bf', fontFamily: '"Playfair Display", serif', letterSpacing: '-1px' }}>
                    {formatPrice(displayPrice)}
                  </span>
                </div>
              )}
            </div>

            {/* Pack qty */}
            {(product.PACKQTY ?? 0) > 0 && (
              <div className="cat-pack-badge" style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: 'rgba(22,163,74,0.08)', border: '1.5px solid rgba(22,163,74,0.18)' }}>
                <Package size={15} color="#16a34a" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
                  <strong style={{ fontSize: 16, color: '#15803d' }}>{product.PACKQTY}</strong> unidades por paquete
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 24 }}>
            {!alreadyRequested && !isRequesting && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>Cantidad:</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #fce7f3', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                  <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); onQtyChange(product.$id, Math.max(1, qty - 1)); }} style={{ width: 34, height: 34, border: 'none', background: '#fdf2f8', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>−</button>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={qty} onChange={e => { e.preventDefault(); e.stopPropagation(); const v = parseInt(e.target.value.replace(/\D/g, '')) || 0; onQtyChange(product.$id, v < 1 ? 1 : Math.min(999, v)); }} style={{ width: 44, height: 34, border: 'none', borderLeft: '1px solid #fce7f3', borderRight: '1px solid #fce7f3', textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#111', outline: 'none', background: '#fff', padding: 0, lineHeight: '34px' }} onClick={e => { e.preventDefault(); e.stopPropagation(); }} />
                  <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); onQtyChange(product.$id, Math.min(999, qty + 1)); }} style={{ width: 34, height: 34, border: 'none', background: '#fdf2f8', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
                </div>
              </div>
            )}
            <button className="cat-cta-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); if (qty < 1) return; onRequest(product.$id, product.NAME, img || '', qty); }} disabled={alreadyRequested || isRequesting || qty < 1} style={{
              width: '100%', padding: '15px 0', border: 'none', borderRadius: 12,
              background: alreadyRequested ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : isRequesting || qty < 1 ? '#ccc' : 'linear-gradient(135deg, #e396bf 0%, #e396bf 100%)',
              color: '#fff', fontSize: 13, fontWeight: 800, cursor: alreadyRequested || isRequesting || qty < 1 ? 'default' : 'pointer',
              letterSpacing: '2px', textTransform: 'uppercase',
              boxShadow: alreadyRequested ? '0 6px 24px rgba(22,163,74,0.3)' : isRequesting || qty < 1 ? 'none' : '0 6px 24px rgba(227,150,191,0.3)',
              position: 'relative', overflow: 'hidden', fontFamily: FF,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {alreadyRequested ? <><Check size={16} /> Consultado ({qty})</> : isRequesting ? 'Enviando...' : <><Bell size={16} /> Consultar Disponibilidad</>}
              {!alreadyRequested && !isRequesting && qty >= 1 && <span style={{
                position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 25%, transparent 50%)',
                animation: 'cat-shimmer 2.5s infinite linear',
              }} />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
