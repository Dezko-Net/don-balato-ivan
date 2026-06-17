'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Grid3x3, List, ShoppingCart, X, SlidersHorizontal, Sparkles, ChevronDown, Clock } from 'lucide-react';
import AnimHeart from '@/components/AnimHeart';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, SUBCATEGORIES_COLLECTION, TIMED_OFFERS_COLLECTION, formatPrice } from '@/lib/appwrite';
import { getSectionConfigAsync, getSectionConfig, type SectionConfig } from '@/lib/section-config';
import { normalizeProductImages, getProductImageUrl } from '@/lib/product-images';
import { cached, TTL } from '@/lib/cache';
import { Query } from 'appwrite';
import { Product, Category, Subcategory, TimedOffer } from '@/types';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

import ProductCardPreview from '@/components/ProductCardPreview';
import ImageZoomModal from '@/components/ImageZoomModal';
import ProductBadges from '@/components/ProductBadges';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import AperturaDiscountBadge from '@/components/AperturaDiscountBadge';
import CountdownTimer from '@/components/CountdownTimer';
import { getSkuFromFeatures } from '@/lib/product-features';
import { useProductsCache } from '@/hooks/useProductsCache';

const FF = '"DM Sans","Proxima Nova",-apple-system,BlinkMacSystemFont,sans-serif';

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

function ProductosInner({ lockCategoryId }: { lockCategoryId?: string } = {}) {
  const searchParams = useSearchParams();
  const catParam = lockCategoryId || searchParams.get('categoria') || '';
  const qParam = searchParams.get('q') || '';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(qParam);
  const [selectedCat, setSelectedCat] = useState(lockCategoryId || '');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [timedOffersMap, setTimedOffersMap] = useState<Record<string, TimedOffer>>({});
  const [selectedSubcat, setSelectedSubcat] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const [catalogCover, setCatalogCover] = useState<{ image: string; title: string; subtitle: string; overlayEnabled: boolean; overlayOpacity: number; overlayColor: string }>({
    image: '', title: '', subtitle: '', overlayEnabled: true, overlayOpacity: 40, overlayColor: '#000000'
  });

  // Cargar configuración de portada del catálogo desde theme config
  useEffect(() => {
    getSectionConfigAsync().then(cfg => {
      const heroSec = cfg.find((s: SectionConfig) => s.id === 'tpl1_hero');
      if (heroSec?.settings) {
        const hs = heroSec.settings as Record<string, any>;
        setCatalogCover({
          image: hs.catalogCoverImage || '',
          title: hs.catalogCoverTitle || '',
          subtitle: hs.catalogCoverSubtitle || '',
          overlayEnabled: hs.catalogCoverOverlayEnabled !== false,
          overlayOpacity: hs.catalogCoverOverlayOpacity ?? 40,
          overlayColor: hs.catalogCoverOverlayColor || '#000000',
        });
      }
    }).catch(() => {});
  }, []);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);
  const [selectedTag, setSelectedTag] = useState('');

  const [activePriceRange, setActivePriceRange] = useState<[number, number] | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings: apertura } = useAperturaPromotion();

  const {
    products,
    total,
    priceRange: fetchedPriceRange,
    categoryCounts: catCountMap,
    allTags,
    isLoadingInitialData: isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    isMobile
  } = useProductsCache({
    categoryId: lockCategoryId || selectedCat || undefined,
    subcategoryId: selectedSubcat || undefined,
    sortBy,
    search: search || undefined,
    tag: selectedTag || undefined,
    priceMin: activePriceRange ? activePriceRange[0] : undefined,
    priceMax: activePriceRange ? activePriceRange[1] : undefined
  });

  const priceRange = fetchedPriceRange;
  const filtered = products;
  const visibleProducts = products;
  const hasMore = !isReachingEnd;




  const activeProducts = useMemo(() => products.filter(p => p.ISACTIVE !== false), [products]);
  const lockedCategory = lockCategoryId ? categories.find(c => c.$id === lockCategoryId) : null;
  const categoryProductCount = lockCategoryId
    ? activeProducts.filter(p => p.CATEGORYID === lockCategoryId).length
    : activeProducts.length;

  const handleCardImageClick = (p: Product) => {
    const imgSrc = getProductImageUrl(p);
    if (imgSrc) {
      setZoomImage({ src: imgSrc, alt: p.NAME });
    }
  };

  // Load catalog categories & offers once on mount
  useEffect(() => {
    const initLoad = async () => {
      try {
        const catOffRes = await fetch('/api/public-data/catalog');
        if (catOffRes.ok) {
          const data = await catOffRes.json();
          setCategories(data.categories as Category[]);
          
          if (catParam && !selectedCat) {
            const found = (data.categories as Category[]).find(c => c.$id === catParam || c.name?.toLowerCase() === catParam.toLowerCase());
            if (found) setSelectedCat(found.$id);
          }

          const map: Record<string, TimedOffer> = {};
          (data.offers as TimedOffer[]).forEach(o => {
            if (o.targetId) map[o.targetId] = o;
          });
          setTimedOffersMap(map);
        }
      } catch (e) {
        console.error(e);
      }
    };
    initLoad();
  }, [catParam]);


  // Load subcategories separately when selectedCat changes
  useEffect(() => {
    const cidToUse = lockCategoryId || selectedCat;
    if (!cidToUse) {
      setSubcategories([]);
      return;
    }
    const loadSubcategories = async () => {
      try {
        const subRes = await fetch(`/api/public-data/subcategories?categoryId=${cidToUse}`);
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubcategories([
            { $id: 'ofertas-temporales', name: '🔥 Ofertas Temporales', categoryId: cidToUse } as Subcategory,
            ...(subData.subcategories as Subcategory[])
          ]);
        } else {
          setSubcategories([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadSubcategories();
  }, [selectedCat, lockCategoryId]);






  const hasActiveFilters = !!(
    (selectedCat && selectedCat !== lockCategoryId) || selectedSubcat || selectedTag || search
    || (activePriceRange && (activePriceRange[0] !== priceRange[0] || activePriceRange[1] !== priceRange[1]))
  );
  const clearAllFilters = () => {
    setSelectedCat(lockCategoryId || ''); setSelectedSubcat(''); setSelectedTag(''); setSearch('');
    setActivePriceRange(priceRange);
  };


  // Sidebar filters component (shared between desktop and mobile drawer)
  const FiltersSidebar = () => (
    <div className="pk-filters-panel" style={{ background: 'rgba(255,255,255,0.86)', borderRadius: 24, padding: 22, border: '1px solid rgba(229,231,235,0.95)', boxShadow: '0 14px 40px rgba(227,150,191,0.1)', backdropFilter: 'blur(14px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
          <SlidersHorizontal size={16} color="#e396bf" /> Filtros
        </h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} style={{ fontSize: 11, fontWeight: 700, color: '#e396bf', background: '#f8f9fa', border: 'none', borderRadius: 999, padding: '4px 10px', cursor: 'pointer' }}>
            Limpiar
          </button>
        )}
      </div>

      {/* Precio — FIRST */}
      {priceRange[1] > 0 && activePriceRange && (
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Precio</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#e396bf', marginBottom: 10 }}>
            <span>{formatPrice(activePriceRange[0])}</span>
            <span style={{ color: '#9ca3af', fontWeight: 400 }}>–</span>
            <span>{formatPrice(activePriceRange[1])}</span>
          </div>
          <input type="range" min={priceRange[0]} max={priceRange[1]} value={activePriceRange[1]}
            onChange={e => setActivePriceRange([activePriceRange[0], Number(e.target.value)])}
            style={{ width: '100%', accentColor: '#e396bf', cursor: 'pointer' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input type="number" value={activePriceRange[0]} onChange={e => setActivePriceRange([Number(e.target.value) || 0, activePriceRange[1]])}
              style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 12, color: '#111', outline: 'none', fontFamily: 'inherit' }} placeholder="Min" />
            <input type="number" value={activePriceRange[1]} onChange={e => setActivePriceRange([activePriceRange[0], Number(e.target.value) || 0])}
              style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 12, color: '#111', outline: 'none', fontFamily: 'inherit' }} placeholder="Max" />
          </div>
        </div>
      )}

      {/* Categorías */}
      <div style={{ marginBottom: 18, paddingTop: 14, borderTop: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Categorías</p>
        <button onClick={() => { setSelectedCat(''); setSelectedSubcat(''); }}
          style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: !selectedCat && !selectedSubcat ? 700 : 500, color: !selectedCat && !selectedSubcat ? '#e396bf' : '#6b7280', background: !selectedCat && !selectedSubcat ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: !selectedCat && !selectedSubcat ? '#e396bf' : '#d1d5db', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Todas</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>{products.length}</span>
        </button>
        <button onClick={() => { setSelectedCat(''); setSelectedSubcat('ofertas-temporales'); }}
          style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: selectedSubcat === 'ofertas-temporales' && !selectedCat ? 700 : 500, color: selectedSubcat === 'ofertas-temporales' && !selectedCat ? '#e396bf' : '#6b7280', background: selectedSubcat === 'ofertas-temporales' && !selectedCat ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ flex: 1 }}>Ofertas Temporales</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', background: selectedSubcat === 'ofertas-temporales' && !selectedCat ? '#e5e7eb' : '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>{products.filter(p => timedOffersMap[p.$id]).length}</span>
        </button>
        {categories.map(c => {
          const count = catCountMap[c.$id] || 0;
          if (count === 0) return null;
          return (
            <button key={c.$id} onClick={() => { setSelectedCat(c.$id); setSelectedSubcat(''); }}
              style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: selectedCat === c.$id ? 700 : 500, color: selectedCat === c.$id ? '#e396bf' : '#6b7280', background: selectedCat === c.$id ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedCat === c.$id ? '#e396bf' : '#d1d5db', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', background: selectedCat === c.$id ? '#e5e7eb' : '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Subcategorías */}
      {subcategories.length > 0 && selectedCat && (
        <div style={{ marginBottom: 18, paddingTop: 14, borderTop: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Subcategorías</p>
          <button onClick={() => setSelectedSubcat('')}
            style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: !selectedSubcat ? 700 : 500, color: !selectedSubcat ? '#e396bf' : '#9ca3af', background: !selectedSubcat ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: !selectedSubcat ? '#e396bf' : '#d1d5db', flexShrink: 0 }} />
            Todas
          </button>
          {subcategories.map(sc => {
            const scCount = products.filter(p => p.SUBCATEGORYID === sc.$id).length;
            if (scCount === 0) return null;
            return (
              <button key={sc.$id} onClick={() => setSelectedSubcat(sc.$id)}
                style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: selectedSubcat === sc.$id ? 700 : 500, color: selectedSubcat === sc.$id ? '#e396bf' : '#9ca3af', background: selectedSubcat === sc.$id ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: selectedSubcat === sc.$id ? '#e396bf' : '#d1d5db', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{sc.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', background: '#f3f4f6', padding: '2px 6px', borderRadius: 999 }}>{scCount}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div style={{ paddingTop: 14, borderTop: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Etiquetas</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={() => setSelectedTag('')}
              style={{ padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: !selectedTag ? '#fff' : '#e396bf', background: !selectedTag ? 'linear-gradient(135deg,#e396bf,#c0547a)' : '#f8f9fa', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
              Todas
            </button>
            {allTags.slice(0, 20).map((tag: string) => (
              <button key={tag} onClick={() => setSelectedTag(tag)}
                style={{ padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: selectedTag === tag ? '#fff' : '#e396bf', background: selectedTag === tag ? 'linear-gradient(135deg,#e396bf,#c0547a)' : '#f8f9fa', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pk-page" style={{ fontFamily: FF, minHeight: '100vh', position: 'relative' }}>
      <div className="pk-bg-fixed" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {catalogCover.image && <img className="pk-bg-image" src={catalogCover.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px) brightness(1.08) saturate(1.08)', transform: 'scale(1.15)', animation: 'pkBgFloat 20s ease-in-out infinite, pkCoverFadeIn 0.6s ease forwards' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 10%,rgba(227,150,191,0.16),transparent 32%), linear-gradient(180deg,rgba(248,249,250,0.72) 0%,rgba(255,255,255,0.92) 100%)' }} />
      </div>
      <div className="pk-products-container" style={{ position: 'relative', zIndex: 1, maxWidth: 1600, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Hero header */}
        <div className="pk-hero-header" style={{ marginBottom: 24, borderRadius: 28, border: '1px solid rgba(229,231,235,0.9)', boxShadow: '0 18px 50px rgba(227,150,191,0.12)', overflow: 'hidden', background: '#fff' }}>
          <div className="pk-hero-banner" style={{ position: 'relative' }}>
            {/* Bubble particles */}
            <div className="pk-bubbles pk-desktop-only" style={{ position: 'absolute', inset: 0, zIndex: 3, overflow: 'hidden', pointerEvents: 'none' }}>
              {[{w:28,h:28,l:'5%',d:'6s',dl:'0s',b:'25%',sw:18},{w:16,h:16,l:'18%',d:'7.5s',dl:'1.2s',b:'55%',sw:10},{w:36,h:36,l:'32%',d:'8s',dl:'0.5s',b:'15%',sw:22},{w:12,h:12,l:'45%',d:'5.5s',dl:'2s',b:'65%',sw:8},{w:26,h:26,l:'58%',d:'7s',dl:'0.8s',b:'30%',sw:16},{w:20,h:20,l:'72%',d:'9s',dl:'1.5s',b:'45%',sw:12},{w:10,h:10,l:'12%',d:'5s',dl:'3s',b:'60%',sw:6},{w:22,h:22,l:'52%',d:'8.5s',dl:'2.5s',b:'20%',sw:14},{w:32,h:32,l:'65%',d:'7.2s',dl:'0.3s',b:'35%',sw:20},{w:14,h:14,l:'82%',d:'6.5s',dl:'1.8s',b:'50%',sw:9},{w:8,h:8,l:'25%',d:'4.8s',dl:'3.5s',b:'70%',sw:5},{w:18,h:18,l:'88%',d:'6.8s',dl:'2.8s',b:'22%',sw:11},{w:40,h:40,l:'20%',d:'10s',dl:'0.2s',b:'10%',sw:24},{w:6,h:6,l:'38%',d:'4.2s',dl:'4s',b:'75%',sw:4},{w:24,h:24,l:'75%',d:'8.2s',dl:'1s',b:'28%',sw:15},{w:34,h:34,l:'48%',d:'9.5s',dl:'0.7s',b:'12%',sw:21},{w:11,h:11,l:'92%',d:'5.8s',dl:'2.2s',b:'58%',sw:7},{w:30,h:30,l:'8%',d:'8.8s',dl:'1.8s',b:'18%',sw:18}].map((b,i) => (
                <div key={i} className="pk-bubble" style={{
                  width: b.w, height: b.h, left: b.l, bottom: b.b,
                  animation: `pkBubbleFloat ${b.d} ease-in-out ${b.dl} infinite, pkBubbleSway ${parseFloat(b.d)*1.3}s ease-in-out ${b.dl} infinite`,
                  '--sway': b.sw + 'px',
                } as React.CSSProperties} />
              ))}
            </div>
            {(!heroImgLoaded || (!lockedCategory?.iconUrl && !lockCategoryId && !catalogCover.image)) && <div className="pk-hero-banner-skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: heroImgLoaded ? 0 : 1, transition: 'opacity 0.4s ease' }} />}
            {lockedCategory?.iconUrl ? (
              <img className="pk-hero-banner-img" src={lockedCategory.iconUrl} alt={lockedCategory.name || 'Categoría'} onLoad={() => setHeroImgLoaded(true)} style={{ objectFit: 'contain', padding: 24, background: 'linear-gradient(135deg,#f8f9fa,#fff)', position: 'relative', zIndex: 2, opacity: heroImgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }} />
            ) : lockCategoryId ? (
              <div className="pk-hero-banner-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#e396bf,#c0547a)', color: '#fff', fontSize: 56, fontWeight: 900, position: 'relative', zIndex: 2 }}>
                {(lockedCategory?.name || 'C').charAt(0).toUpperCase()}
              </div>
            ) : (
              catalogCover.image ? <img className="pk-hero-banner-img" src={catalogCover.image} alt="Portada catálogo" onLoad={() => setHeroImgLoaded(true)} style={{ position: 'relative', zIndex: 2, opacity: heroImgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }} /> : <div className="pk-hero-banner-img" style={{ background: 'linear-gradient(135deg,#f8f9fa,#e5e7eb)', position: 'relative', zIndex: 2 }} />
            )}
          </div>
          <div className="pk-hero-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: 24 }}>
          <div className="pk-hero-logo-wrap">
            {lockedCategory?.iconUrl && (
              <img src={lockedCategory.iconUrl} alt={lockedCategory.name} className="pk-hero-logo-img" />
            )}
          </div>
          <div className="pk-hero-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.92)', color: '#e396bf', padding: '6px 13px', borderRadius: 999, fontSize: 12, fontWeight: 800, marginBottom: 10, border: '1px solid #e5e7eb' }}>
              <Sparkles size={13} /> {lockCategoryId ? 'Categoría' : 'Nuestra tienda'}
            </div>
            <h1 className="pk-products-title" style={{ fontSize: 42, fontWeight: 950, color: '#111827', margin: 0, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              {catalogCover.title || lockedCategory?.name || 'Productos'}
            </h1>
            <p className="pk-hero-subtitle" style={{ fontSize: 15, color: '#6b7280', margin: '8px 0 18px', maxWidth: 520, lineHeight: 1.55 }}>
              {catalogCover.subtitle || (lockCategoryId ? `Productos de la categoría ${lockedCategory?.name || ''}. Filtrá, ordená y comprá en un solo lugar.` : 'Descubrí nuestra selección de productos exclusivos')}
            </p>
            <div className="pk-hero-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ padding: '9px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.92)', border: '1px solid #e5e7eb', boxShadow: '0 4px 14px rgba(227,150,191,0.15)' }}>
                <span style={{ display: 'block', fontSize: 18, fontWeight: 900, color: '#e396bf' }}>{lockCategoryId ? categoryProductCount : activeProducts.length}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Productos</span>
              </div>
              {!lockCategoryId && (
              <div style={{ padding: '9px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.92)', border: '1px solid #e5e7eb', boxShadow: '0 4px 14px rgba(227,150,191,0.15)' }}>
                <span style={{ display: 'block', fontSize: 18, fontWeight: 900, color: '#e396bf' }}>{categories.length}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Categorías</span>
              </div>
              )}
              {lockCategoryId && (
                <Link href="/productos" style={{ padding: '9px 14px', borderRadius: 16, background: '#f8f9fa', border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 700, color: '#e396bf', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  Ver catálogo completo
                </Link>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Top toolbar */}
        <div className={`pk-toolbar ${isScrolled ? 'pk-toolbar-scrolled' : ''}`} style={{ position: 'sticky', top: 10, zIndex: 20, display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center', padding: 12, borderRadius: 22, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(229,231,235,0.9)', backdropFilter: 'blur(16px)', boxShadow: '0 10px 34px rgba(227,150,191,0.1)' }}>
          <div className="pk-toolbar-search" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#e396bf' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              style={{ width: '100%', padding: '13px 38px 13px 42px', borderRadius: 16, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 14, color: '#111', outline: 'none', boxShadow: '0 2px 8px rgba(227,150,191,0.05)', fontFamily: 'inherit', transition: 'all 0.2s', minWidth: 0 }}
              onFocus={e => { e.currentTarget.style.borderColor = '#e396bf'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(227,150,191,0.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(227,150,191,0.05)'; }} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#f8f9fa', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#e396bf' }}><X size={14} /></button>}
          </div>

          <div className="pk-toolbar-actions">
            {/* Selector de Categorías en Toolbar */}
          {!lockCategoryId && (
            <div className="pk-toolbar-select-wrap" style={{ position: 'relative' }}>
              <select
                value={selectedCat}
                onChange={e => { setSelectedCat(e.target.value); setSelectedSubcat(''); }}
                style={{
                  padding: '12px 34px 12px 16px',
                  borderRadius: 14,
                  border: '1.5px solid #e5e7eb',
                  background: '#fff',
                  fontSize: 13,
                  color: '#111',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  outline: 'none',
                  minWidth: 160,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="">Todas las categorías</option>
                {categories.map(c => (
                  <option key={c.$id} value={c.$id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#e396bf', pointerEvents: 'none' }} />
            </div>
          )}

          {/* Selector de Subcategorías en Toolbar */}
          {selectedCat && subcategories.length > 0 && (
            <div className="pk-toolbar-select-wrap" style={{ position: 'relative' }}>
              <select
                value={selectedSubcat}
                onChange={e => setSelectedSubcat(e.target.value)}
                style={{
                  padding: '12px 34px 12px 16px',
                  borderRadius: 14,
                  border: '1.5px solid #e5e7eb',
                  background: '#fff',
                  fontSize: 13,
                  color: '#111',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  outline: 'none',
                  minWidth: 160,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="">Todas las subcategorías</option>
                {subcategories.map(sc => (
                  <option key={sc.$id} value={sc.$id}>{sc.name}</option>
                ))}
              </select>
              <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#e396bf', pointerEvents: 'none' }} />
            </div>
          )}

          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="pk-filters-btn pk-mobile-only"
            style={{ alignItems: 'center', gap: 7, padding: '12px 16px', borderRadius: 14, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 700, color: '#e396bf', cursor: 'pointer', fontFamily: 'inherit' }}>
            <SlidersHorizontal size={15} /> Filtros{hasActiveFilters ? ' •' : ''}
          </button>

          <div className="pk-sort-wrap" style={{ position: 'relative' }}>
            <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="pk-sort-btn" style={{ padding: '12px 38px 12px 16px', borderRadius: 14, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, color: '#111', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {sortBy === 'newest' ? 'Más recientes' : sortBy === 'price_asc' ? '↑ Precio: menor a mayor' : '↓ Precio: mayor a menor'}
              <ChevronDown size={15} style={{ color: '#e396bf', transition: 'transform 0.2s', transform: sortDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {sortDropdownOpen && (
              <>
                <div onClick={() => setSortDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', boxShadow: '0 10px 30px rgba(227,150,191,0.15)', zIndex: 100, overflow: 'hidden' }}>
                  <button onClick={() => { setSortBy('newest'); setSortDropdownOpen(false); }} style={{ width: '100%', padding: '10px 14px', background: sortBy === 'newest' ? '#f8f9fa' : 'transparent', color: sortBy === 'newest' ? '#e396bf' : '#111', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sortBy === 'newest' ? 700 : 500, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                    Más recientes
                  </button>
                  <button onClick={() => { setSortBy('price_asc'); setSortDropdownOpen(false); }} style={{ width: '100%', padding: '10px 14px', background: sortBy === 'price_asc' ? '#f8f9fa' : 'transparent', color: sortBy === 'price_asc' ? '#e396bf' : '#111', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sortBy === 'price_asc' ? 700 : 500, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                    ↑ Precio: menor a mayor
                  </button>
                  <button onClick={() => { setSortBy('price_desc'); setSortDropdownOpen(false); }} style={{ width: '100%', padding: '10px 14px', background: sortBy === 'price_desc' ? '#f8f9fa' : 'transparent', color: sortBy === 'price_desc' ? '#e396bf' : '#111', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sortBy === 'price_desc' ? 700 : 500, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                    ↓ Precio: mayor a menor
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="pk-view-toggle" style={{ display: 'flex', background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
            <button onClick={() => setView('grid')} style={{ padding: '11px 13px', background: view === 'grid' ? '#f8f9fa' : 'transparent', color: view === 'grid' ? '#e396bf' : '#9ca3af', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Grid3x3 size={16} /></button>
            <button onClick={() => setView('list')} style={{ padding: '11px 13px', background: view === 'list' ? '#f8f9fa' : 'transparent', color: view === 'list' ? '#e396bf' : '#9ca3af', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><List size={16} /></button>
          </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="pk-filter-chips pk-h-scroll" style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, marginBottom: 20, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {selectedCat && categories.find(c => c.$id === selectedCat) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 12px', background: '#f8f9fa', color: '#e396bf', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                {categories.find(c => c.$id === selectedCat)?.name}
                <button onClick={() => { setSelectedCat(''); setSelectedSubcat(''); }} style={{ background: 'transparent', border: 'none', color: '#e396bf', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
              </span>
            )}
            {selectedTag && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 12px', background: '#f8f9fa', color: '#e396bf', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                #{selectedTag}
                <button onClick={() => setSelectedTag('')} style={{ background: 'transparent', border: 'none', color: '#e396bf', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
              </span>
            )}
            {search && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 12px', background: '#f8f9fa', color: '#e396bf', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                "{search}"
                <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: '#e396bf', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
              </span>
            )}
          </div>
        )}

        <div className="pk-products-layout" style={{ display: 'flex', gap: 28 }}>
          {/* Desktop sidebar */}
          <aside className="pk-sidebar-desktop pk-desktop-only" style={{ width: 220, flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: 20 }}>
              <FiltersSidebar />
            </div>
          </aside>

          {/* Products */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="pk-result-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '0 0 14px', padding: '10px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.72)', border: '1px solid #e5e7eb', backdropFilter: 'blur(10px)' }}>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0, fontWeight: 700 }}>
                <span style={{ color: '#e396bf', fontWeight: 900 }}>{filtered.length}</span> producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} style={{ padding: '6px 12px', background: '#f8f9fa', color: '#e396bf', border: 'none', borderRadius: 999, fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Limpiar todo
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="pk-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <div style={{ aspectRatio: '1/1', background: 'linear-gradient(90deg,#f8f9fa,#e5e7eb,#f8f9fa)', backgroundSize: '200% 100%', animation: 'pkShimmer 1.4s ease infinite' }} />
                    <div style={{ padding: 14 }}>
                      <div style={{ height: 14, width: '80%', background: '#e5e7eb', borderRadius: 6, marginBottom: 8 }} />
                      <div style={{ height: 18, width: '50%', background: '#e5e7eb', borderRadius: 6 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="pk-empty-state" style={{ textAlign: 'center', padding: '86px 20px', background: 'rgba(255,255,255,0.86)', borderRadius: 26, border: '1px solid #e5e7eb', boxShadow: '0 14px 42px rgba(227,150,191,0.09)', backdropFilter: 'blur(14px)' }}>
                <div className="pk-empty-icon" style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg,#f8f9fa,#e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 10px 28px rgba(227,150,191,0.15)' }}>
                  <ShoppingCart size={36} color="#e396bf" />
                </div>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Sin resultados</p>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '0 auto 18px', maxWidth: 360, lineHeight: 1.55 }}>No encontramos productos con esos filtros. Probá quitar alguno o buscar con otra palabra.</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#e396bf,#c0547a)', color: '#fff', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(227,150,191,0.25)', fontFamily: 'inherit' }}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : view === 'grid' ? (
              <div className="pk-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
                {visibleProducts.map(p => {
                  const activeOffer = timedOffersMap[p.$id];
                  const pricing = activeOffer ? {
                    displayPrice: activeOffer.discountPrice,
                    originalPrice: activeOffer.originalPrice,
                    hasDiscount: true,
                    discountPercent: activeOffer.discountPercentage,
                    fromApertura: false
                  } : resolveProductDisplayPrice(p, apertura);
                  const price = pricing.displayPrice;
                  const hasDisc = pricing.hasDiscount;
                  const disc = pricing.discountPercent;
                  const fav = isFavorite(p.$id);
                  const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
                  const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
                  const cardSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
                  return (
                    <div key={p.$id} className="pk-card" style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '0 0 22px 22px', overflow: 'hidden', border: '1px solid rgba(229,231,235,0.95)', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 28px rgba(227,150,191,0.08)', backdropFilter: 'blur(10px)' }}>
                      <div className="pk-card-media-link" onClick={() => handleCardImageClick(p)} style={{ display: 'block', position: 'relative', cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none' }}>
                        <div className="pk-card-image" style={{ position: 'relative', aspectRatio: '1/1', background: 'linear-gradient(135deg,#f8f9fa,#fff)', overflow: 'hidden' }}>
                          {getProductImageUrl(p) ? (
                            <Image src={getProductImageUrl(p)} alt={p.NAME} fill className="pk-card-img" style={{ objectFit: 'cover', pointerEvents: 'none' }} sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48, color: '#c7d2fe' }}>📦</div>
                          )}
                          {p.STOCK === 0 && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                              <span style={{ padding: '6px 14px', background: '#fff', color: '#ef4444', borderRadius: 999, fontSize: 12, fontWeight: 800, border: '1.5px solid #fee2e2' }}>Sin stock</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pk-card-body" style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                          <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {cardSku && <span className="pk-card-sku">SKU: {cardSku}</span>}
                            <ProductBadges product={p} />
                          </div>
                          <button
                            type="button"
                            className="pk-card-fav"
                            aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(p.$id); }}
                            style={{
                              width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: '#f8f9fa',
                              color: '#e396bf',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                            }}
                          >
                            <AnimHeart filled={fav} size={20} />
                          </button>
                        </div>
                        <Link href={`/productos/${p.$id}`} style={{ textDecoration: 'none' }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36, lineHeight: 1.4, transition: 'color 0.2s' }}>
                            {p.NAME}
                          </p>
                        </Link>
                        {p.PACKQTY && p.PACKQTY > 1 ? <div style={{ fontSize: 11, color: '#db2777', fontWeight: 800, marginTop: -4, marginBottom: 8 }}>{p.PACKQTY} UNIDADES POR PAQUETE</div> : null}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                          {price > 0 ? (
                            <>
                              <span className="pk-price" style={{ fontSize: 19, fontWeight: 800, color: hasDisc ? '#d97bb0' : '#111', letterSpacing: '-0.02em' }}>{formatPrice(price)}</span>
                              {hasDisc && pricing.originalPrice != null && <span className="pk-price-old" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>{formatPrice(pricing.originalPrice)}</span>}
                              {hasDisc && <AperturaDiscountBadge percent={disc} size="sm" />}
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Consultar precio</span>
                          )}
                        </div>
                        <button onClick={() => p.STOCK !== 0 && addItem(p, 1, activeOffer?.discountPrice, activeOffer ? (getExpiresAtEpochSeconds(activeOffer) || 0) * 1000 : undefined)} disabled={p.STOCK === 0} className="pk-add-btn"
                          style={{ marginTop: 10, padding: '9px 12px', borderRadius: 12, border: 'none', background: p.STOCK === 0 ? '#f3f4f6' : 'linear-gradient(135deg,#e396bf,#c0547a)', color: p.STOCK === 0 ? '#9ca3af' : '#fff', fontSize: 12, fontWeight: 700, cursor: p.STOCK === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s', boxShadow: p.STOCK === 0 ? 'none' : '0 4px 14px rgba(227,150,191,0.25)', fontFamily: 'inherit' }}>
                          <ShoppingCart size={13} /> {p.STOCK === 0 ? 'Sin stock' : 'Agregar'}
                        </button>
                        {activeOffer && (
                          <div style={{
                            marginTop: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            background: '#fff5f5',
                            border: '1px solid #fee2e2',
                            borderRadius: 8,
                            padding: '4px 8px',
                            fontSize: 10,
                            fontWeight: 700,
                            color: '#ef4444'
                          }}>
                            <Clock size={11} className="animate-pulse" />
                            <span style={{ fontSize: 9.5 }}>Oferta termina: </span>
                            <CountdownTimer expiresAt={getExpiresAtEpochSeconds(activeOffer) || 0} compact />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {visibleProducts.map(p => {
                  const activeOffer = timedOffersMap[p.$id];
                  const pricing = activeOffer ? {
                    displayPrice: activeOffer.discountPrice,
                    originalPrice: activeOffer.originalPrice,
                    hasDiscount: true,
                    discountPercent: activeOffer.discountPercentage,
                    fromApertura: false
                  } : resolveProductDisplayPrice(p, apertura);
                  const price = pricing.displayPrice;
                  const hasDisc = pricing.hasDiscount;
                  const disc = pricing.discountPercent;
                  const fav = isFavorite(p.$id);
                  const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
                  const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
                  const cardSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
                  return (
                    <div key={p.$id} className="pk-card-list" style={{ position: 'relative', background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', display: 'flex', gap: 16, padding: 12, transition: 'all 0.2s', alignItems: 'center' }}>
                      {hasDisc && (
                        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
                          <AperturaDiscountBadge percent={disc} size="sm" />
                        </div>
                      )}
                      <div className="pk-card-list-media" onClick={() => handleCardImageClick(p)} style={{ position: 'relative', width: 110, height: 110, borderRadius: 14, overflow: 'hidden', background: '#f8f9fa', flexShrink: 0, cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none' }}>
                        {getProductImageUrl(p) ? <Image src={getProductImageUrl(p)} alt={p.NAME} fill style={{ objectFit: 'cover' }} sizes="110px" unoptimized /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 36 }}>📦</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {cardSku && <div className="pk-card-sku" style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2, fontWeight: 700 }}>SKU: {cardSku}</div>}
                        <Link href={`/productos/${p.$id}`} style={{ textDecoration: 'none' }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{p.NAME}</p>
                        </Link>
                        {p.PACKQTY && p.PACKQTY > 1 ? <div style={{ fontSize: 11, color: '#db2777', fontWeight: 800, marginBottom: 6 }}>{p.PACKQTY} UNIDADES POR PAQUETE</div> : null}
                        <p className="pk-card-list-desc" style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>{p.DESCRIPTION}</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          {price > 0 ? (
                            <>
                              <span className="pk-price" style={{ fontSize: 18, fontWeight: 800, color: hasDisc ? '#d97bb0' : '#111' }}>{formatPrice(price)}</span>
                              {hasDisc && pricing.originalPrice != null && <span className="pk-price-old" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>{formatPrice(pricing.originalPrice)}</span>}
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Consultar precio</span>
                          )}
                        </div>
                        {activeOffer && (
                          <div style={{
                            marginTop: 8,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#fff5f5',
                            border: '1px solid #fee2e2',
                            borderRadius: 8,
                            padding: '4px 8px',
                            fontSize: 10,
                            fontWeight: 700,
                            color: '#ef4444'
                          }}>
                            <Clock size={11} className="animate-pulse" />
                            <span style={{ fontSize: 9.5 }}>Oferta termina: </span>
                            <CountdownTimer expiresAt={getExpiresAtEpochSeconds(activeOffer) || 0} compact />
                          </div>
                        )}
                      </div>
                      <div className="pk-card-list-actions" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={() => setPreviewProduct(p)} title="Vista rápida"
                          style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8f9fa', border: 'none', color: '#e396bf', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Search size={16} />
                        </button>
                        <button onClick={() => toggleFavorite(p.$id)} title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8f9fa', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AnimHeart filled={fav} size={24} />
                        </button>
                        <button className="pk-list-cart-btn" onClick={() => p.STOCK !== 0 && addItem(p, 1, activeOffer?.discountPrice, activeOffer ? (getExpiresAtEpochSeconds(activeOffer) || 0) * 1000 : undefined)} disabled={p.STOCK === 0} title="Agregar al carrito"
                          style={{ width: 40, height: 40, borderRadius: '50%', background: p.STOCK === 0 ? '#e5e7eb' : '#fdf2f8', border: p.STOCK === 0 ? 'none' : '1.5px solid #fce7f3', color: p.STOCK === 0 ? '#9ca3af' : '#e396bf', cursor: p.STOCK === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: p.STOCK === 0 ? 'none' : '0 2px 8px rgba(227,150,191,0.15)' }}>
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {hasMore && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 8px' }}>
                {isMobile ? (
                  <div
                    ref={(el) => {
                      if (!el) return;
                      const observer = new IntersectionObserver(
                        ([entry]) => {
                          if (entry.isIntersecting && !isLoadingMore) {
                            loadMore();
                          }
                        },
                        { rootMargin: '100px' }
                      );
                      observer.observe(el);
                      return () => observer.disconnect();
                    }}
                    style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {isLoadingMore ? (
                      <div style={{ width: 24, height: 24, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : null}
                  </div>
                ) : (
                  <button 
                    onClick={() => loadMore()} 
                    disabled={isLoadingMore}
                    style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#e396bf,#c0547a)', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(227,150,191,0.25)', fontFamily: 'inherit', opacity: isLoadingMore ? 0.7 : 1 }}
                  >
                    {isLoadingMore ? 'Cargando...' : `Cargar más`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mounted && mobileFiltersOpen && createPortal(
        <>
          <div className="pk-filters-backdrop pk-mobile-only" onClick={() => setMobileFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', zIndex: 10000 }} />
          <div className="pk-filters-drawer pk-mobile-only">
            <div className="pk-filters-drawer-handle" />
            <div className="pk-filters-drawer-header">
              <h2>Filtros</h2>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Cerrar filtros"><X size={18} /></button>
            </div>
            <FiltersSidebar />
            <button type="button" className="pk-filters-apply" onClick={() => setMobileFiltersOpen(false)}>
              Ver {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </>,
        document.body
      )}

      {/* Quick View Modal */}
      {previewProduct && <ProductCardPreview product={previewProduct} onClose={() => setPreviewProduct(null)} />}

      {/* Image Zoom Modal */}
      {zoomImage && <ImageZoomModal src={zoomImage.src} alt={zoomImage.alt} onClose={() => setZoomImage(null)} />}

      <style>{`
        /* Card Hover/Touch Reset: completely disable any hover state changes */
        .pk-card, .pk-card *, .pk-card-list, .pk-card-list * {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-focus-ring-color: transparent !important;
          outline: none !important;
        }

        .pk-card a, .pk-card-list a {
          outline: none !important;
          text-decoration: none !important;
        }

        .pk-card:hover, .pk-card-list:hover {
          transform: none !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03) !important;
          border-color: rgba(229,231,235,0.6) !important;
        }

        .pk-card:hover *, .pk-card-list:hover * {
          transform: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
          outline: none !important;
        }

        .pk-card:hover .pk-card-sku,
        .pk-card-list:hover .pk-card-sku,
        .pk-card .pk-card-sku:hover,
        .pk-card-list .pk-card-sku:hover {
          color: #9ca3af !important;
        }

        .pk-card:hover .pk-price-old,
        .pk-card-list:hover .pk-price-old,
        .pk-card .pk-price-old:hover,
        .pk-card-list .pk-price-old:hover {
          color: #9ca3af !important;
        }

        /* Direct and parent-hover resets for badges to prevent any change or highlights */
        .pk-card:hover .pk-badge,
        .pk-card-list:hover .pk-badge,
        .pk-card .pk-badge:hover,
        .pk-card .pk-badge:active,
        .pk-card .pk-badge:focus,
        .pk-card-list .pk-badge:hover,
        .pk-card-list .pk-badge:active,
        .pk-card-list .pk-badge:focus,
        .pk-card:hover .apertura-disc-badge,
        .pk-card-list:hover .apertura-disc-badge,
        .pk-card .apertura-disc-badge:hover,
        .pk-card .apertura-disc-badge:active,
        .pk-card .apertura-disc-badge:focus,
        .pk-card-list .apertura-disc-badge:hover,
        .pk-card-list .apertura-disc-badge:active,
        .pk-card-list .apertura-disc-badge:focus {
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
          transform: none !important;
          text-shadow: none !important;
          opacity: 1 !important;
        }
        .pk-card .apertura-disc-badge:hover,
        .pk-card-list .apertura-disc-badge:hover {
          background: linear-gradient(135deg, #f5a8cf 0%, #e396bf 50%, #c0547a 100%) !important;
          box-shadow: 0 2px 8px rgba(227,150,191,0.2), 0 0 0 1px rgba(255,255,255,0.35) inset !important;
        }

        @keyframes pkShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes pkBgFloat { 0%,100% { transform: scale(1.15) translateY(0); } 50% { transform: scale(1.18) translateY(-10px); } }
        @keyframes pkCoverFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pkDrawerUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes pkBubbleFloat {
          0% { transform: translateY(30%) scale(0.5); opacity: 0; }
          8% { opacity: 0.8; }
          30% { opacity: 0.6; }
          60% { opacity: 0.4; }
          85% { opacity: 0.15; }
          100% { transform: translateY(-90%) scale(1.1); opacity: 0; }
        }
        @keyframes pkBubbleSway {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(var(--sway, 12px)); }
          40% { transform: translateX(calc(var(--sway, 12px) * -0.6)); }
          60% { transform: translateX(calc(var(--sway, 12px) * 0.8)); }
          80% { transform: translateX(calc(var(--sway, 12px) * -1)); }
        }
        .pk-bubble {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 20%, rgba(227,150,191,0.08) 50%, rgba(192,84,122,0.12) 80%, rgba(227,150,191,0.2) 100%);
          box-shadow: inset 0 -4px 8px rgba(227,150,191,0.12), inset 2px 2px 6px rgba(255,255,255,0.5), 0 0 8px rgba(227,150,191,0.08);
          border: 1px solid rgba(255,255,255,0.35);
          pointer-events: none; z-index: 3;
        }
        .pk-bubble::before {
          content: ''; position: absolute; top: 15%; left: 20%; width: 35%; height: 25%;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, transparent 70%);
          transform: rotate(-30deg);
        }
        .pk-bubble::after {
          content: ''; position: absolute; bottom: 20%; right: 18%; width: 18%; height: 12%;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%);
          transform: rotate(20deg);
        }

        .pk-page { background: #ffffff !important; }
        .pk-bg-fixed { display: none !important; }
        .pk-toolbar {
          position: -webkit-sticky !important;
          position: sticky !important;
          top: 86px !important;
          z-index: 20 !important;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pk-toolbar.pk-toolbar-scrolled {
          position: -webkit-sticky !important;
          position: sticky !important;
          top: 86px !important;
          z-index: 999 !important;
          background-color: rgba(255, 255, 255, 0.95) !important;
          box-shadow: 0 10px 30px rgba(227,150,191,0.18) !important;
          border-radius: 18px !important;
          padding: 8px 12px !important;
        }
        
        .pk-toolbar-search {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .pk-toolbar-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          transition: opacity 0.3s ease, max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease;
          max-height: 150px;
          opacity: 1;
          transform: translateY(0);
          overflow: hidden;
        }
        
        .pk-toolbar.pk-toolbar-scrolled .pk-toolbar-actions {
          opacity: 0;
          max-height: 0 !important;
          transform: translateY(-10px);
          pointer-events: none;
        }
        .pk-desktop-only { display: block; }
        .pk-mobile-only { display: none; }
        .pk-filters-btn { display: none; }

        .pk-h-scroll { scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-x; -webkit-overflow-scrolling: touch; }
        .pk-h-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }

        .pk-filters-drawer {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 999;
          max-height: min(88vh, 720px); background: #fff;
          border-radius: 20px 20px 0 0; padding: 8px 16px calc(16px + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -12px 40px rgba(0,0,0,0.18);
          display: flex; flex-direction: column; gap: 10px;
          animation: pkDrawerUp 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .pk-filters-drawer-handle { width: 40px; height: 4px; border-radius: 999px; background: #e5e7eb; margin: 4px auto 0; flex-shrink: 0; }
        .pk-filters-drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 2px 8px; flex-shrink: 0; }
        .pk-filters-drawer-header h2 { margin: 0; font-size: 17px; font-weight: 800; color: #111827; }
        .pk-filters-drawer-header button { width: 36px; height: 36px; border-radius: 50%; border: none; background: #f8f9fa; color: #e396bf; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .pk-filters-drawer .pk-filters-panel { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; border-radius: 16px !important; box-shadow: none !important; margin: 0 !important; }
        .pk-filters-apply {
          flex-shrink: 0; width: 100%; padding: 14px; border: none; border-radius: 14px;
          background: linear-gradient(135deg,#e396bf,#c0547a); color: #fff;
          font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit;
          box-shadow: 0 6px 20px rgba(227,150,191,0.35);
        }


        .pk-hero-header { display: flex; flex-direction: column; padding: 0 !important; }
        .pk-hero-banner {
          position: relative; width: 100%; overflow: hidden;
          aspect-ratio: 2.4 / 1; min-height: 140px; max-height: 320px;
          background: linear-gradient(135deg, #f8f9fa, #e5e7eb);
        }
        .pk-hero-banner-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 37%, #f0f0f0 63%);
          background-size: 200% 100%;
          animation: pkShimmer 1.5s ease-in-out infinite;
        }
        .pk-hero-banner-img {
          width: 100%; height: 100%; display: block;
          object-fit: cover; object-position: center center;
        }
        .pk-hero-body {
          flex: 1; min-width: 0; display: flex; flex-direction: row-reverse;
          align-items: center; justify-content: space-between; gap: 24px;
        }
        .pk-hero-text { flex: 1; min-width: 0; }
        .pk-hero-logo-wrap {
          flex-shrink: 0; display: flex; align-items: center; justify-content: center;
        }
        .pk-hero-logo-img {
          height: 148px; width: auto; max-width: min(240px, 42vw);
          object-fit: contain; display: block;
        }

        .pk-card-fav { display: flex; align-items: center; justify-content: center; }

        @media (hover: hover) and (pointer: fine) and (min-width: 769px) {
          .pk-card:hover .pk-card-actions { opacity: 1 !important; transform: translateX(-50%) translateY(0) !important; }
        }

        @media (max-width: 1024px) {
          .pk-products-layout { flex-direction: column !important; gap: 16px !important; }
          .pk-products-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 14px !important; }
          .pk-sidebar-desktop { display: none !important; }
          .pk-desktop-only { display: none !important; }
          .pk-mobile-only, .pk-filters-btn { display: flex !important; }
        }

        @media (max-width: 768px) {
          .pk-page { padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px)); }
          .pk-products-container { padding: 12px 12px 48px !important; }
          .pk-hero-header { border-radius: 20px !important; margin-bottom: 16px !important; }
          .pk-hero-banner { aspect-ratio: 2.6 / 1 !important; min-height: 88px !important; max-height: 128px !important; }
          .pk-hero-banner-img { object-fit: cover !important; object-position: center 42% !important; }
          .pk-hero-body { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; padding: 14px 16px 16px !important; }
          .pk-hero-text { display: block !important; }
          .pk-products-title { font-size: 28px !important; }
          .pk-hero-subtitle { font-size: 13px !important; margin: 6px 0 12px !important; max-width: 100% !important; }
          .pk-hero-stats { gap: 8px !important; }
          .pk-hero-stats > div { padding: 8px 12px !important; border-radius: 12px !important; }
          .pk-hero-body { flex-direction: column !important; align-items: stretch !important; gap: 14px !important; }
          .pk-hero-logo-wrap { align-self: center !important; order: -1 !important; width: 100% !important; }
          .pk-hero-logo-img { height: 96px !important; max-width: min(220px, 78vw) !important; }
          
          /* Background performance optimization */
          .pk-bg-fixed { display: none !important; }
          .pk-bg-image { animation: none !important; transform: none !important; }

          /* Sticky toolbar: remove overrides to preserve user's inline styles */
          .pk-toolbar {
            position: -webkit-sticky !important;
            position: sticky !important;
            top: 10px !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          .pk-toolbar.pk-toolbar-scrolled {
            position: -webkit-sticky !important;
            position: sticky !important;
            top: 10px !important;
            z-index: 999 !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
          }
          .pk-toolbar-search {
            flex: 0 0 100% !important;
            width: 100% !important;
          }

          .pk-filter-chips { margin-bottom: 14px !important; padding-bottom: 2px !important; }
          .pk-filter-chips span { flex-shrink: 0; font-size: 11px !important; }
          .pk-products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 8px !important; }
          .pk-card {
            border-radius: 0 0 18px 18px !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            background: #ffffff !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03) !important;
            border: 1px solid rgba(229, 231, 235, 0.6) !important;
            transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
          }
          .pk-card-fav {
            display: flex !important;
            width: 28px !important;
            height: 28px !important;
            top: 6px !important;
            right: 6px !important;
            background: rgba(255, 255, 255, 0.9) !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
          }
          .pk-card-fav svg {
            width: 15px !important;
            height: 15px !important;
          }
          .pk-disc-badge {
            top: 6px !important;
            left: 6px !important;
            right: auto !important;
          }
          .pk-card-badges {
            top: auto !important;
            bottom: 6px !important;
            left: 6px !important;
          }
          .pk-card-badges span {
            font-size: 8px !important;
            padding: 1.5px 4px !important;
            border-radius: 3px !important;
          }
          .pk-card-actions--desktop { display: none !important; }
          
          .pk-card .pk-card-body { padding: 8px 8px 10px !important; }
          .pk-card .pk-card-body p { font-size: 11px !important; min-height: 28px !important; line-height: 1.3 !important; margin-bottom: 4px !important; }
          .pk-card .pk-price { font-size: 14px !important; }
          .pk-card .pk-add-btn { padding: 6px 8px !important; font-size: 10px !important; border-radius: 8px !important; margin-top: 6px !important; }

          /* Redesigned horizontal list card on mobile */
          .pk-card-list {
            flex-direction: row !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 10px !important;
            border-radius: 14px !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            background: #ffffff !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04) !important;
            border-color: rgba(229, 231, 235, 0.5) !important;
          }
          .pk-card-list > a {
            width: auto !important;
            height: auto !important;
            display: block !important;
          }
          .pk-card-list-media {
            width: 90px !important;
            height: 90px !important;
            border-radius: 10px !important;
            flex-shrink: 0 !important;
          }
          .pk-card-list-desc {
            display: none !important;
          }
          .pk-card-list-actions {
            display: flex !important;
            flex-direction: row !important;
            gap: 6px !important;
            align-self: flex-end !important;
            margin-top: 6px !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .pk-card-list-actions button {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #f8f9fa !important;
            border: none !important;
          }
          .pk-card-list-actions button svg {
            width: 14px !important;
            height: 14px !important;
          }
          /* Pink cart icon in list view on mobile */
          .pk-card-list-actions .pk-list-cart-btn {
            background: #fdf2f8 !important;
            border: 1.5px solid #fce7f3 !important;
            color: #e396bf !important;
          }
          .pk-card-list-actions .pk-list-cart-btn svg {
            color: #e396bf !important;
            stroke: #e396bf !important;
          }
          .pk-card-list > div:last-child {
            flex-direction: row !important;
            justify-content: flex-end !important;
            gap: 6px !important;
          }

          .pk-filters-drawer {
            z-index: 10001 !important;
          }

          .pk-result-bar { padding: 8px 10px !important; flex-wrap: wrap; }
          .pk-result-bar p { font-size: 12px !important; }
        }

        @media (max-width: 480px) {
          .pk-hero-banner {
            aspect-ratio: 2.8 / 1 !important; min-height: 72px !important; max-height: 108px !important;
            display: block !important;
          }
          .pk-hero-banner-img {
            object-fit: cover !important; object-position: center 40% !important;
            width: 100% !important; height: 100% !important; max-height: none !important;
          }
        }

        @media (max-width: 400px) {
          .pk-products-grid { gap: 8px !important; }
          .pk-card .pk-disc-badge { font-size: 9px !important; padding: 3px 6px !important; }
        }
      `}</style>
    </div>
  );
}

export default function CollectionAll1() {
  return (
    <Suspense fallback={
      <div style={{ fontFamily: FF, background: 'linear-gradient(180deg,#f8f9fa 0%,#fff 280px)', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '32px 20px 60px' }}>
          <div style={{ height: 36, width: 200, background: '#e5e7eb', borderRadius: 10, marginBottom: 30 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ height: 320, background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb' }} />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductosInner />
    </Suspense>
  );
}
