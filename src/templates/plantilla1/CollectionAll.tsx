'use client';

import { useEffect, useState, useCallback, useMemo, Suspense, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Grid3x3, List, ShoppingCart, X, SlidersHorizontal, Sparkles, ChevronDown, ChevronLeft, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
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
import { resolveProductDisplayPrice, resolvePackUnitPrice, PACK_BONUS_DISCOUNT_PCT, getLiveShoppingThreshold, getNextLiveShoppingTime, isLiveShoppingProduct, getLiveShoppingDiscountPercent } from '@/lib/apertura-promo';
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

function ProductosInner({ lockCategoryId, catalogMode }: { lockCategoryId?: string; catalogMode?: 'retail' | 'paquetes' | 'embalajes' } = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam = lockCategoryId || searchParams.get('categoria') || '';
  const qParam = searchParams.get('q') || '';

  const [mounted, setMounted] = useState(false);

  const updateCategoryUrl = (catId: string) => {
    if (lockCategoryId) return;
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

  const isPaquetes = catalogMode === 'paquetes';
  const isEmbalajes = catalogMode === 'embalajes';
  const modeQueryParam = isPaquetes ? '?mode=paquetes' : '';
  const primaryColor = isPaquetes ? '#b8895a' : (isEmbalajes ? '#0ea5e9' : '#e396bf');
  const gradientColor = isPaquetes ? 'linear-gradient(135deg,#f5ede0,#e8dcc8)' : (isEmbalajes ? 'linear-gradient(135deg,#e0f2fe,#bae6fd)' : 'linear-gradient(135deg,#e396bf,#c0547a)');
  const buttonTextColor = isPaquetes ? '#5c3d24' : (isEmbalajes ? '#0369a1' : '#fff');
  const lightBgColor = isPaquetes ? '#faf7f2' : (isEmbalajes ? '#f0f9ff' : '#fdf2f8');
  const lightBorderColor = isPaquetes ? '#e8dcc8' : (isEmbalajes ? '#bae6fd' : '#fce7f3');
  const shadowColor = isPaquetes ? 'rgba(198,139,89,0.25)' : (isEmbalajes ? 'rgba(14,165,233,0.2)' : 'rgba(227,150,191,0.25)');
  const shadowColorLight = isPaquetes ? 'rgba(198,139,89,0.1)' : (isEmbalajes ? 'rgba(14,165,233,0.08)' : 'rgba(227,150,191,0.1)');
  const radialBgColor = isPaquetes ? 'rgba(198,139,89,0.08)' : (isEmbalajes ? 'rgba(14,165,233,0.12)' : 'rgba(227,150,191,0.16)');
  const packQtyColor = isPaquetes ? '#0ea5e9' : (isEmbalajes ? '#0284c7' : '#db2777');

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(qParam);
  const [selectedCat, setSelectedCat] = useState(lockCategoryId || '');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [timedOffersMap, setTimedOffersMap] = useState<Record<string, TimedOffer>>({});
  const [selectedSubcat, setSelectedSubcat] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showLiveHistory, setShowLiveHistory] = useState(false);
  const [liveHistoryDates, setLiveHistoryDates] = useState<string[]>([]);
  const [liveHistoryProducts, setLiveHistoryProducts] = useState<Product[]>([]);
  const [liveHistoryLoading, setLiveHistoryLoading] = useState(false);
  const [liveHistorySelectedDate, setLiveHistorySelectedDate] = useState<string | null>(null);

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
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  useEffect(() => {
    if (mobileFiltersOpen || categoryDrawerOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [mobileFiltersOpen, categoryDrawerOpen]);

  useEffect(() => {
    setMounted(true);
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
    allProducts,
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
    subcategoryId: selectedSubcat && selectedSubcat !== 'ofertas-temporales' ? selectedSubcat : undefined,
    sortBy,
    search: search || undefined,
    tag: selectedTag || undefined,
    priceMin: activePriceRange ? activePriceRange[0] : undefined,
    priceMax: activePriceRange ? activePriceRange[1] : undefined,
    catalogMode
  });

  const priceRange = fetchedPriceRange;
  const filtered = products;
  const packStockAvailable = (p: Product) => (p.PACK_STOCK && p.PACK_STOCK > 0) ? p.PACK_STOCK : Math.floor((p.STOCK || 0) / (p.PACKQTY || 1));
  const isLiveShoppingFilter = selectedSubcat === 'ofertas-temporales' && !selectedCat;
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const visibleProducts = isPaquetes ? products.filter(p => {
    if (!p.PACKQTY || p.PACKQTY <= 1) return false;
    const packStock = (p.PACK_STOCK && p.PACK_STOCK > 0) ? p.PACK_STOCK : Math.floor((p.STOCK || 0) / p.PACKQTY);
    return packStock > 0;
  }) : isLiveShoppingFilter ? products.filter(p => {
    if ((p.STOCK || 0) <= 0) return false;
    if (!isLiveShoppingProduct(p)) return false;
    const importedTime = new Date(p.$createdAt!).getTime();
    return importedTime >= oneWeekAgo;
  }) : products.filter(p => (p.STOCK || 0) > 0);
  const hasMore = !isReachingEnd;

  // Synchronize priceRange once SWR loads the products
  const hasInitializedPriceRangeRef = useRef(false);
  useEffect(() => {
    if (priceRange && priceRange[1] > 0 && !hasInitializedPriceRangeRef.current) {
      setActivePriceRange(priceRange as [number, number]);
      hasInitializedPriceRangeRef.current = true;
    }
  }, [priceRange]);




  const activeProducts = useMemo(() => products.filter(p => p.ISACTIVE !== false), [products]);
  // allActiveProducts uses non-paginated list so carousels/offers can find any product
  const allActiveProducts = useMemo(() => (allProducts || products).filter(p => p.ISACTIVE !== false), [allProducts, products]);
  const lockedCategory = lockCategoryId ? categories.find(c => c.$id === lockCategoryId) : null;
  const categoryProductCount = lockCategoryId
    ? activeProducts.filter(p => p.CATEGORYID === lockCategoryId).length
    : activeProducts.length;

  const carouselRef = useRef<HTMLDivElement>(null);
  const offerCarouselRef = useRef<HTMLDivElement>(null);

  const [now, setNow] = useState(() => Date.now());
  const [filterTick, setFilterTick] = useState(0);
  useEffect(() => {
    if (!isPaquetes && isEmbalajes) return;
    const secInterval = setInterval(() => setNow(Date.now()), 1000);
    const minInterval = setInterval(() => setFilterTick(t => t + 1), 60_000);
    return () => { clearInterval(secInterval); clearInterval(minInterval); };
  }, [isPaquetes, isEmbalajes]);

  const paquetesBgImage = "https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/1781677554034-pegada-1781677553118.png?GoogleAccessId=firebase-adminsdk-fbsvc%40asistoraerp.iam.gserviceaccount.com&Expires=16730334000&Signature=eBZXWbfjIuRon5KJ6w172cIhUggaq0JHwBS6cWMTEtVt6ccY8wxRylB96GL0%2BVLsXH3XOar1sbALOGWZznl5BaPWztvm%2BeuhZOMIyjCpCJXxoUcbl0gUGPJ%2Bl2krzpJfDimqv30TF8%2FlghxLcHAUb8aS3Fu4MGr8T3fLTYCUnqg5m96tFZVlGqDkwLq%2FZVc6oV%2FgCmaf8fLcxfNXYZux5gDBXEGLp5WQhGD%2BU3hwn3e9S67DlRNdqdtTyiqRV%2Bb9ALz0uHF0YJ1ulsOhaivE2d2gd4PSMAsjUjC3M2eBHBE5%2Bq3A9%2F1iGif8ZRoav9wCebVlkS6rARLvTFMr8PEJqw%3D%3D";
  const bgImageToUse = isPaquetes ? paquetesBgImage : (isEmbalajes ? '' : (catalogCover.image || ''));
  const heroImageToUse = isPaquetes ? paquetesBgImage : (isEmbalajes ? '' : (catalogCover.image || ''));

  const offersDayProducts = useMemo(() => {
    const nowMs = Date.now();
    return allActiveProducts.filter(p => {
      if (isPaquetes) {
        return (
          p.PACKQTY && p.PACKQTY > 1 &&
          p.PACK_OFFER_PRICE && p.PACK_OFFER_PRICE > 0 &&
          p.PACK_OFFER_EXPIRES_AT && p.PACK_OFFER_EXPIRES_AT > nowMs &&
          packStockAvailable(p) > 0
        );
      }
      if (!isEmbalajes) {
        return (
          p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < p.PRICE &&
          p.UNIT_OFFER_EXPIRES_AT && p.UNIT_OFFER_EXPIRES_AT > nowMs
        );
      }
      return false;
    });
  // filterTick triggers re-evaluation once per minute to remove expired offers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allActiveProducts, filterTick, isPaquetes, isEmbalajes]);

  const carouselPaquetes = useMemo(() => {
    if (!isPaquetes) return [];
    return allActiveProducts
      .filter(p => p.PACKQTY && p.PACKQTY > 1 && p.WHOLESALEPRICE && p.WHOLESALEPRICE > 0)
      .filter(p => packStockAvailable(p) > 0)
      .sort((a, b) => {
        const priceA = (a.WHOLESALEPRICE || a.PRICE) * (a.PACKQTY || 1);
        const priceB = (b.WHOLESALEPRICE || b.PRICE) * (b.PACKQTY || 1);
        return priceA - priceB;
      });
  }, [isPaquetes, allActiveProducts]);

  const cheapestRetailProducts = useMemo(() => {
    if (isPaquetes || isEmbalajes) return [];
    return [...allActiveProducts]
      .map(p => {
        const unitOfferExpired = !!(p.UNIT_OFFER_EXPIRES_AT && p.UNIT_OFFER_EXPIRES_AT < Date.now());
        const effectivePrice = (!unitOfferExpired && p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < p.PRICE) ? p.CURRENTPRICE : p.PRICE;
        return { p, effectivePrice };
      })
      .sort((a, b) => a.effectivePrice - b.effectivePrice)
      .slice(0, 20)
      .map(x => x.p);
  }, [isPaquetes, isEmbalajes, allActiveProducts]);

  const heroBadgeText = isPaquetes ? 'Paquetes Especiales' : (isEmbalajes ? 'Embalajes Profesionales' : (lockCategoryId ? 'Categoría' : 'Nuestra tienda'));
  const heroTitleText = isPaquetes ? 'Paquetes Mayoristas' : (isEmbalajes ? 'Sección Embalaje' : (catalogCover.title || lockedCategory?.name || 'Productos'));
  const heroSubtitleText = isPaquetes ? 'Comprá en cantidad y ahorrá con nuestros precios mayoristas exclusivos por paquete.' : (isEmbalajes ? 'Cajas y embalajes de alta calidad para tus envíos y productos.' : (catalogCover.subtitle || (lockCategoryId ? `Productos de la categoría ${lockedCategory?.name || ''}. Filtrá, ordená y comprá en un solo lugar.` : 'Explorá nuestro catálogo de productos exclusivos')));

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
    setActivePriceRange(priceRange as [number, number]);
  };


  // Sidebar filters component (shared between desktop and mobile drawer)
  const FiltersSidebar = () => (
    <div className="pk-filters-panel" style={{ background: 'rgba(255,255,255,0.86)', borderRadius: 24, padding: 22, border: '1px solid rgba(229,231,235,0.95)', boxShadow: `0 14px 40px ${shadowColor}`, backdropFilter: 'blur(14px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
          <SlidersHorizontal size={16} color={primaryColor} /> Filtros
        </h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} style={{ fontSize: 11, fontWeight: 700, color: primaryColor, background: '#f8f9fa', border: 'none', borderRadius: 999, padding: '4px 10px', cursor: 'pointer' }}>
            Limpiar
          </button>
        )}
      </div>

      {/* Precio — FIRST */}
      {priceRange[1] > 0 && activePriceRange && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: primaryColor, marginBottom: 10 }}>
            <span>Precio Máx:</span>
            <span>{formatPrice(activePriceRange[1])}</span>
          </div>
          <input type="range" min={priceRange[0]} max={priceRange[1]} value={activePriceRange[1]}
            onChange={e => setActivePriceRange([activePriceRange[0], Number(e.target.value) || 0])}
            style={{ width: '100%', accentColor: primaryColor, cursor: 'pointer' }} />
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
        <button onClick={() => { setSelectedCat(''); setSelectedSubcat(''); updateCategoryUrl(''); }}
          style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: !selectedCat && !selectedSubcat ? 700 : 500, color: !selectedCat && !selectedSubcat ? primaryColor : '#6b7280', background: !selectedCat && !selectedSubcat ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: !selectedCat && !selectedSubcat ? primaryColor : '#d1d5db', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Todas</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>{products.length}</span>
        </button>
        {categories.map(c => {
          const count = catCountMap[c.$id] || 0;
          if (count === 0) return null;
          return (
            <button key={c.$id} onClick={() => { setSelectedCat(c.$id); setSelectedSubcat(''); updateCategoryUrl(c.$id); }}
              style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: selectedCat === c.$id ? 700 : 500, color: selectedCat === c.$id ? primaryColor : '#6b7280', background: selectedCat === c.$id ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedCat === c.$id ? primaryColor : '#d1d5db', flexShrink: 0 }} />
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
            style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: !selectedSubcat ? 700 : 500, color: !selectedSubcat ? primaryColor : '#9ca3af', background: !selectedSubcat ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: !selectedSubcat ? primaryColor : '#d1d5db', flexShrink: 0 }} />
            Todas
          </button>
          {subcategories.map(sc => {
            const scCount = products.filter(p => p.SUBCATEGORYID === sc.$id).length;
            if (scCount === 0) return null;
            return (
              <button key={sc.$id} onClick={() => setSelectedSubcat(sc.$id)}
                style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: selectedSubcat === sc.$id ? 700 : 500, color: selectedSubcat === sc.$id ? primaryColor : '#9ca3af', background: selectedSubcat === sc.$id ? '#f8f9fa' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: selectedSubcat === sc.$id ? primaryColor : '#d1d5db', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{sc.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', background: '#f3f4f6', padding: '2px 6px', borderRadius: 999 }}>{scCount}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div style={{ paddingTop: 14, borderTop: '1px solid #e5e7eb', marginBottom: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Etiquetas</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={() => setSelectedTag('')}
              style={{ padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: !selectedTag ? '#fff' : primaryColor, background: !selectedTag ? gradientColor : '#f8f9fa', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
              Todas
            </button>
            {allTags.slice(0, 20).map((tag: string) => (
              <button key={tag} onClick={() => setSelectedTag(tag)}
                style={{ padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: selectedTag === tag ? '#fff' : primaryColor, background: selectedTag === tag ? gradientColor : '#f8f9fa', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pk-page" style={{
      fontFamily: FF,
      minHeight: '100vh',
      position: 'relative',
      ['--pk-primary' as any]: primaryColor,
      ['--pk-gradient' as any]: gradientColor,
      ['--pk-light-bg' as any]: lightBgColor,
      ['--pk-light-border' as any]: lightBorderColor,
      ['--pk-shadow' as any]: shadowColor,
      ['--pk-shadow-light' as any]: shadowColorLight,
      ['--pk-radial' as any]: radialBgColor,
    }}>
      <div className="pk-bg-fixed" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {bgImageToUse && <img className="pk-bg-image" src={bgImageToUse} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px) brightness(1.08) saturate(1.08)', transform: 'scale(1.15)', animation: 'pkBgFloat 20s ease-in-out infinite, pkCoverFadeIn 0.6s ease forwards' }} />}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 15% 10%,${radialBgColor},transparent 32%), linear-gradient(180deg,rgba(248,249,250,0.72) 0%,rgba(255,255,255,0.92) 100%)` }} />
      </div>
      <div className="pk-products-container" style={{ position: 'relative', zIndex: 1, maxWidth: 1600, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Hero header */}
        <div className="pk-hero-header" style={{ position: 'relative', marginBottom: 24, borderRadius: 28, border: '1px solid rgba(229,231,235,0.9)', boxShadow: `0 18px 50px ${shadowColor}`, overflow: 'hidden', background: '#fff' }}>
          <div className="pk-hero-banner" style={{ position: 'relative' }}>
            {(!heroImgLoaded || (!lockedCategory?.iconUrl && !lockCategoryId)) && <div className="pk-hero-banner-skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: heroImgLoaded ? 0 : 1, transition: 'opacity 0.4s ease' }} />}
            {lockedCategory?.iconUrl ? (
              <img className="pk-hero-banner-img" src={lockedCategory.iconUrl} alt={lockedCategory.name || 'Categoría'} onLoad={() => setHeroImgLoaded(true)} style={{ objectFit: 'contain', padding: 24, background: 'linear-gradient(135deg,#f8f9fa,#fff)', position: 'relative', zIndex: 2, opacity: heroImgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }} />
            ) : lockCategoryId ? (
              <div className="pk-hero-banner-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: gradientColor, color: '#fff', fontSize: 56, fontWeight: 900, position: 'relative', zIndex: 2 }}>
                {(lockedCategory?.name || 'C').charAt(0).toUpperCase()}
              </div>
            ) : (
              heroImageToUse ? <img className="pk-hero-banner-img" src={heroImageToUse} alt="Portada catálogo" onLoad={() => setHeroImgLoaded(true)} style={{ position: 'relative', zIndex: 2, opacity: heroImgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }} /> : <div className="pk-hero-banner-img pk-hero-fallback-bg" style={{ position: 'relative', zIndex: 2 }} />
            )}
          </div>
          {/* View toggle in the banner top right corner */}
          <div className="pk-view-toggle" style={{ position: 'absolute', top: 16, right: 16, zIndex: 10000, display: 'flex', background: 'rgba(255, 255, 255, 0.9) !important', backdropFilter: 'blur(12px)', borderRadius: 14, border: '1px solid rgba(229, 231, 235, 0.6)', padding: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', pointerEvents: 'auto' }}>
            <button onClick={() => setView('grid')} style={{ padding: '8px 10px', background: view === 'grid' ? '#fff' : 'transparent', color: view === 'grid' ? primaryColor : '#6b7280', border: 'none', borderRadius: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, transition: 'all 0.2s', outline: 'none' }} aria-label="Cuadrícula">
              <Grid3x3 size={14} /> <span className="pk-desktop-only">Cuadrícula</span>
            </button>
            <button onClick={() => setView('list')} style={{ padding: '8px 10px', background: view === 'list' ? '#fff' : 'transparent', color: view === 'list' ? primaryColor : '#6b7280', border: 'none', borderRadius: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, transition: 'all 0.2s', outline: 'none' }} aria-label="Lista">
              <List size={14} /> <span className="pk-desktop-only">Lista</span>
            </button>
          </div>
          <div className="pk-hero-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: 24 }}>
            <div className="pk-hero-logo-wrap">
              {lockedCategory?.iconUrl && (
                <img src={lockedCategory.iconUrl} alt={lockedCategory.name} className="pk-hero-logo-img" />
              )}
            </div>
            <div className="pk-hero-text">
              <div className="pk-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.92)', color: primaryColor, padding: '6px 13px', borderRadius: 999, fontSize: 12, fontWeight: 800, marginBottom: 10, border: '1px solid #e5e7eb' }}>
                <Sparkles size={13} /> {heroBadgeText}
              </div>
              <h1 className="pk-products-title" style={{ fontSize: 42, fontWeight: 950, color: '#111827', margin: 0, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                {heroTitleText}
              </h1>
              <p className="pk-hero-subtitle" style={{ fontSize: 15, color: '#6b7280', margin: '8px 0 18px', maxWidth: 520, lineHeight: 1.55 }}>
                {heroSubtitleText}
              </p>
              <div className="pk-hero-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <div className="pk-hero-stat-card" style={{ padding: '9px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.92)', border: '1px solid #e5e7eb', boxShadow: `0 4px 14px ${shadowColor}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="pk-hero-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: `rgba(${isPaquetes ? '123,179,232' : (isEmbalajes ? '14,165,233' : '227,150,191')},0.1)`, color: primaryColor, flexShrink: 0 }}>
                    <ShoppingCart size={15} />
                  </div>
                  <div className="pk-hero-stat-info">
                    <span className="pk-hero-stat-num" style={{ display: 'block', fontSize: 18, fontWeight: 900, color: primaryColor, lineHeight: 1.1 }}>{total}</span>
                    <span className="pk-hero-stat-label" style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'block' }}>{isPaquetes ? 'Paquetes' : (isEmbalajes ? 'Embalajes' : 'Productos')}</span>
                  </div>
                </div>
                {!lockCategoryId && (
                <div className="pk-hero-stat-card" style={{ padding: '9px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.92)', border: '1px solid #e5e7eb', boxShadow: `0 4px 14px ${shadowColor}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="pk-hero-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: `rgba(${isPaquetes ? '123,179,232' : (isEmbalajes ? '14,165,233' : '227,150,191')},0.1)`, color: primaryColor, flexShrink: 0 }}>
                    <Grid3x3 size={14} />
                  </div>
                  <div className="pk-hero-stat-info">
                    <span className="pk-hero-stat-num" style={{ display: 'block', fontSize: 18, fontWeight: 900, color: primaryColor, lineHeight: 1.1 }}>{categories.length}</span>
                    <span className="pk-hero-stat-label" style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'block' }}>Categorías</span>
                  </div>
                </div>
                )}
                {lockCategoryId && (
                  <Link href="/productos" className="pk-hero-stat-link" style={{ padding: '9px 14px', borderRadius: 16, background: '#f8f9fa', border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 700, color: primaryColor, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    Ver catálogo completo
                  </Link>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 16 }}>
                <Link href="/" className="pk-hero-home-btn">
                  <ArrowLeft size={14} /> Volver a la página principal
                </Link>
              </div>
            </div>
          </div>
        </div>



        {/* Carousel hero para paquetes */}
        {isPaquetes && carouselPaquetes.length > 0 && (
          <div style={{ marginBottom: 28, position: 'relative', borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg,#fdfaf6 0%,#faf6f0 100%)', border: '1px solid #e8dcc8', boxShadow: '0 8px 32px rgba(198,139,89,0.08)' }}>
            <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(90deg,#c68b59,#e09b6f)', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 8, letterSpacing: '0.04em' }}>
                  🔥 OFERTAS POR PAQUETE
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#5c3d24', margin: 0, letterSpacing: '-0.02em', fontFamily: FF }}>Los mejores precios por cantidad</h2>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: '4px 0 0', fontWeight: 500 }}>Comprá en paquetes y maximizá tu ahorro mayorista</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { const el = carouselRef.current; if (el) el.scrollBy({ left: -268, behavior: 'smooth' }); }} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #eed9c4', background: '#fff', color: '#c68b59', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(198,139,89,0.1)', flexShrink: 0 }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => { const el = carouselRef.current; if (el) el.scrollBy({ left: 268, behavior: 'smooth' }); }} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #eed9c4', background: '#fff', color: '#c68b59', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(198,139,89,0.1)', flexShrink: 0 }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div ref={carouselRef} className="pk-carousel-no-scroll" style={{ display: 'flex', gap: 16, padding: '0 24px 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {carouselPaquetes.map(p => {
                const packPrice = (p.WHOLESALEPRICE || p.PRICE) * (p.PACKQTY || 1);
                const origPackPrice = p.PRICE * (p.PACKQTY || 1);
                const discPct = origPackPrice > packPrice ? Math.round((1 - packPrice / origPackPrice) * 100) : 0;
                const cFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
                const cTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
                const cSku = getSkuFromFeatures(cFeatures, cTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
                return (
                  <div key={p.$id} style={{ minWidth: 204, maxWidth: 224, flex: '0 0 auto', background: '#fff', borderRadius: 18, border: '1px solid #eed9c4', overflow: 'hidden', boxShadow: '0 4px 14px rgba(198,139,89,0.08)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    {discPct > 0 && (
                      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2, background: '#b8a07a', color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 900, padding: '3px 9px' }}>-{discPct}%</div>
                    )}
                    {p.PACK_MIN_PACKS && p.PACK_DISCOUNT_PCT ? (
                      <div style={{ position: 'absolute', top: discPct > 0 ? 38 : 10, right: 10, zIndex: 2, background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 800, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                        {p.PACK_MIN_PACKS}+ paq. → -{p.PACK_DISCOUNT_PCT}%
                      </div>
                    ) : null}
                    <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f8f9fa', cursor: 'pointer', overflow: 'hidden' }} onClick={() => handleCardImageClick(p)}>
                      {getProductImageUrl(p) ? (
                        <Image src={getProductImageUrl(p)} alt={p.NAME} fill style={{ objectFit: 'cover' }} sizes="224px" unoptimized />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 42, color: '#eed9c4' }}>📦</div>
                      )}
                    </div>
                    <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {cSku && <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>SKU: {cSku}</div>}
                      <Link prefetch={false} href={`/productos/${p.$id}${modeQueryParam}`} style={{ textDecoration: 'none' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', minHeight: 36 }}>{p.NAME}</p>
                      </Link>
                      {p.PACKQTY && p.PACKQTY > 1 ? (
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0ea5e9' }}>{p.PACKQTY} UNIDADES / PAQUETE</span>
                      ) : null}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                        <span style={{ fontSize: 19, fontWeight: 900, color: '#c68b59', letterSpacing: '-0.02em', fontFamily: FF }}>{formatPrice(packPrice)}</span>
                        {discPct > 0 && <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>{formatPrice(origPackPrice)}</span>}
                      </div>
                      <div style={{ fontSize: 10, color: '#b0b0b0', fontWeight: 600 }}>{formatPrice(p.WHOLESALEPRICE || p.PRICE)} por unidad</div>
                      <button
                        onClick={() => packStockAvailable(p) > 0 && addItem(p, p.PACKQTY || 1, undefined, undefined, p.WHOLESALEPRICE || p.PRICE, true)}
                        disabled={packStockAvailable(p) <= 0}
                        style={{ marginTop: 'auto', padding: '9px 12px', borderRadius: 12, border: 'none', background: packStockAvailable(p) <= 0 ? '#f3f4f6' : 'linear-gradient(135deg,#faf0e6,#eed9c4)', color: packStockAvailable(p) <= 0 ? '#9ca3af' : '#5c3d24', fontSize: 12, fontWeight: 700, cursor: packStockAvailable(p) <= 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: FF }}
                      >
                        <ShoppingCart size={13} /> {packStockAvailable(p) <= 0 ? 'Sin stock' : 'Agregar paquete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <style>{`.pk-carousel-no-scroll::-webkit-scrollbar { display: none; }`}</style>
          </div>
        )}

        {/* Top toolbar */}
        <div className={`pk-toolbar ${isScrolled ? 'pk-toolbar-scrolled' : ''}`} style={{ position: 'sticky', top: 10, zIndex: 20, display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center', padding: 12, borderRadius: 22, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(229,231,235,0.9)', backdropFilter: 'blur(16px)', boxShadow: '0 10px 34px rgba(227,150,191,0.1)' }}>
          <div className="pk-toolbar-search" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: primaryColor }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isPaquetes ? "Buscar paquetes..." : (isEmbalajes ? "Buscar embalajes..." : "Buscar productos...")}
              style={{ width: '100%', padding: '13px 38px 13px 42px', borderRadius: 16, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 14, color: '#111', outline: 'none', boxShadow: `0 2px 8px ${shadowColorLight}`, fontFamily: 'inherit', transition: 'all 0.2s', minWidth: 0 }}
              onFocus={e => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 4px ${shadowColorLight}`; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = `0 2px 8px ${shadowColorLight}`; }} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#f8f9fa', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: primaryColor }}><X size={14} /></button>}
          </div>

          <div className="pk-toolbar-actions">
            {/* Selector de Categorías en Toolbar */}
          {!lockCategoryId && (
            <>
              {/* Desktop Category Select */}
              <div className="pk-toolbar-select-wrap pk-desktop-only" style={{ position: 'relative' }}>
                <select
                  value={selectedCat}
                  onChange={e => { setSelectedCat(e.target.value); setSelectedSubcat(''); updateCategoryUrl(e.target.value); }}
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
                <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: primaryColor, pointerEvents: 'none' }} />
              </div>

              {/* Mobile Category Button */}
              <button type="button" onClick={() => setCategoryDrawerOpen(true)} className="pk-category-btn-mobile pk-mobile-only"
                style={{ alignItems: 'center', justifyContent: 'space-between', gap: 7, padding: '12px 16px', borderRadius: 14, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', minWidth: 140 }}>
                <span>{selectedCat ? categories.find(c => c.$id === selectedCat)?.name || 'Categoría' : 'Categorías'}</span>
                <ChevronDown size={15} style={{ color: primaryColor }} />
              </button>
            </>
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
              <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: primaryColor, pointerEvents: 'none' }} />
            </div>
          )}

          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="pk-filters-btn pk-mobile-only"
            style={{ alignItems: 'center', gap: 7, padding: '12px 16px', borderRadius: 14, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 700, color: primaryColor, cursor: 'pointer', fontFamily: 'inherit' }}>
            <SlidersHorizontal size={15} /> Filtros{hasActiveFilters ? ' •' : ''}
          </button>

          <div className="pk-sort-wrap" style={{ position: 'relative', zIndex: sortDropdownOpen ? 1050 : 1 }}>
            <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="pk-sort-btn" style={{ padding: '12px 38px 12px 16px', borderRadius: 14, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, color: '#111', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {sortBy === 'newest' ? 'Más recientes' : sortBy === 'price_asc' ? '↑ Precio: menor a mayor' : '↓ Precio: mayor a menor'}
              <ChevronDown size={15} style={{ color: primaryColor, transition: 'transform 0.2s', transform: sortDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {sortDropdownOpen && (
              <>
                <div onClick={() => setSortDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', boxShadow: `0 10px 30px ${shadowColorLight}`, zIndex: 100, overflow: 'hidden' }}>
                  <button onClick={() => { setSortBy('newest'); setSortDropdownOpen(false); }} style={{ width: '100%', padding: '10px 14px', background: sortBy === 'newest' ? '#f8f9fa' : 'transparent', color: sortBy === 'newest' ? primaryColor : '#111', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sortBy === 'newest' ? 700 : 500, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                    Más recientes
                  </button>
                  <button onClick={() => { setSortBy('price_asc'); setSortDropdownOpen(false); }} style={{ width: '100%', padding: '10px 14px', background: sortBy === 'price_asc' ? '#f8f9fa' : 'transparent', color: sortBy === 'price_asc' ? primaryColor : '#111', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sortBy === 'price_asc' ? 700 : 500, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                    ↑ Precio: menor a mayor
                  </button>
                  <button onClick={() => { setSortBy('price_desc'); setSortDropdownOpen(false); }} style={{ width: '100%', padding: '10px 14px', background: sortBy === 'price_desc' ? '#f8f9fa' : 'transparent', color: sortBy === 'price_desc' ? primaryColor : '#111', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sortBy === 'price_desc' ? 700 : 500, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                    ↓ Precio: mayor a menor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="pk-filter-chips pk-h-scroll" style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, marginBottom: 20, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {selectedCat && categories.find(c => c.$id === selectedCat) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 12px', background: '#f8f9fa', color: primaryColor, borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                {categories.find(c => c.$id === selectedCat)?.name}
                <button onClick={() => { setSelectedCat(''); setSelectedSubcat(''); updateCategoryUrl(''); }} style={{ background: 'transparent', border: 'none', color: primaryColor, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
              </span>
            )}
            {selectedTag && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 12px', background: '#f8f9fa', color: primaryColor, borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                #{selectedTag}
                <button onClick={() => setSelectedTag('')} style={{ background: 'transparent', border: 'none', color: primaryColor, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
              </span>
            )}
            {search && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 12px', background: '#f8f9fa', color: primaryColor, borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                "{search}"
                <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: primaryColor, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
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
                <span style={{ color: primaryColor, fontWeight: 900 }}>{total}</span> {isPaquetes ? `paquete${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}` : (isEmbalajes ? `embalaje${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}` : `producto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`)}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} style={{ padding: '6px 12px', background: '#f8f9fa', color: primaryColor, border: 'none', borderRadius: 999, fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
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
              <div className="pk-empty-state" style={{ textAlign: 'center', padding: '86px 20px', background: 'rgba(255,255,255,0.86)', borderRadius: 26, border: '1px solid #e5e7eb', boxShadow: `0 14px 42px ${shadowColorLight}`, backdropFilter: 'blur(14px)' }}>
                <div className="pk-empty-icon" style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg,#f8f9fa,#e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: `0 10px 28px ${shadowColorLight}` }}>
                  <ShoppingCart size={36} color={primaryColor} />
                </div>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Sin resultados</p>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '0 auto 18px', maxWidth: 360, lineHeight: 1.55 }}>No encontramos productos con esos filtros. Probá quitar alguno o buscar con otra palabra.</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} style={{ padding: '10px 22px', background: gradientColor, color: '#fff', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px ${shadowColor}`, fontFamily: 'inherit' }}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : view === 'grid' ? (
              <div className="pk-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
                {visibleProducts.map(p => {
                  const activeOffer = timedOffersMap[p.$id];
                  const rawPricing = activeOffer ? {
                    displayPrice: activeOffer.discountPrice,
                    originalPrice: activeOffer.originalPrice,
                    hasDiscount: true,
                    discountPercent: activeOffer.discountPercentage,
                    fromApertura: false
                  } : resolveProductDisplayPrice(p, apertura);
                  
                  let price = rawPricing.displayPrice;
                  let origPrice = rawPricing.originalPrice;

                  if (catalogMode === 'embalajes') {
                    price = p.WHOLESALEPRICE || p.PRICE;
                    origPrice = p.PRICE;
                  } else if (catalogMode === 'paquetes') {
                    // Si es producto de live shopping, usar el precio con descuento de live para paquete también
                    if (isLiveShoppingProduct(p)) {
                      const liveDiscount = getLiveShoppingDiscountPercent(p.$createdAt!);
                      price = Math.round((p.PRICE || 0) * (1 - liveDiscount / 100));
                      origPrice = p.PRICE;
                    } else {
                      // Usa resolvePackUnitPrice para respetar WHOLESALEPRICE o PACK_DISCOUNT_PCT
                      price = resolvePackUnitPrice(p);
                      origPrice = p.PRICE;
                    }
                  } else if (!activeOffer && p.PACKQTY && p.PACKQTY > 1) {
                    // En /productos, si tiene PACKQTY mostrar también el precio de paquete como referencia
                    // (el precio normal sigue siendo el individual con apertura)
                    price = rawPricing.displayPrice;
                    origPrice = rawPricing.originalPrice;
                  }

                  if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && p.PACKQTY) {
                    price *= p.PACKQTY;
                    if (origPrice != null) origPrice *= p.PACKQTY;
                  }

                  const hasDisc = origPrice != null && origPrice > price;
                  const disc = hasDisc && origPrice ? Math.round((1 - price/origPrice)*100) : rawPricing.discountPercent;
                  const pricing = { ...rawPricing, originalPrice: origPrice };
                  const fav = isFavorite(p.$id);
                  const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
                  const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
                  const cardSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
                  const effectiveStock = (catalogMode === 'paquetes' || catalogMode === 'embalajes') ? packStockAvailable(p) : (p.STOCK || 0);
                  const outOfStock = effectiveStock <= 0;
                  return (
                    <div key={p.$id} className="pk-card" style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '0 0 22px 22px', overflow: 'hidden', border: '1px solid rgba(229,231,235,0.95)', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 28px rgba(227,150,191,0.08)', backdropFilter: 'blur(10px)' }}>
                      <div className="pk-card-media-link" onClick={() => handleCardImageClick(p)} style={{ display: 'block', position: 'relative', cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none' }}>
                        <div className="pk-card-image" style={{ position: 'relative', aspectRatio: '1/1', background: 'linear-gradient(135deg,#f8f9fa,#fff)', overflow: 'hidden' }}>
                          {getProductImageUrl(p) ? (
                            <Image src={getProductImageUrl(p)} alt={p.NAME} fill className="pk-card-img" style={{ objectFit: 'cover', pointerEvents: 'none' }} sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48, color: '#c7d2fe' }}>📦</div>
                          )}
                          {outOfStock && (
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
                              color: primaryColor,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                            }}
                          >
                            <AnimHeart filled={fav} size={20} />
                          </button>
                        </div>
                        <Link prefetch={false} href={`/productos/${p.$id}${modeQueryParam}`} style={{ textDecoration: 'none' }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36, lineHeight: 1.4, transition: 'color 0.2s' }}>
                            {p.NAME}
                          </p>
                        </Link>
                        {p.PACKQTY && p.PACKQTY > 1 ? <div style={{ fontSize: 11, color: packQtyColor, fontWeight: 800, marginTop: -4, marginBottom: 8 }}>{p.PACKQTY} UNIDADES POR PAQUETE</div> : null}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                          {price > 0 ? (
                            <>
                              <span className="pk-price" style={{ fontSize: 19, fontWeight: 800, color: isPaquetes ? primaryColor : (hasDisc ? '#d97bb0' : '#111'), letterSpacing: '-0.02em' }}>{formatPrice(price)}</span>
                              {hasDisc && pricing.originalPrice != null && <span className="pk-price-old" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>{formatPrice(pricing.originalPrice)}</span>}
                              {hasDisc && (isPaquetes ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 900, letterSpacing: '0.04em', background: '#b8a07a', color: '#fff', lineHeight: 1, position: 'relative', zIndex: 2 }}>✦ -{disc}%</span>
                              ) : (
                                <AperturaDiscountBadge percent={disc} size="sm" />
                              ))}
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Consultar precio</span>
                          )}
                        </div>
                        <button onClick={() => {
                          const qtyToAdd = (catalogMode === 'paquetes' || catalogMode === 'embalajes') && p.PACKQTY ? p.PACKQTY : 1;
                          const overridePrice = (catalogMode === 'paquetes' || catalogMode === 'embalajes') ? (p.WHOLESALEPRICE || p.PRICE) : undefined;
                          !outOfStock && addItem(p, qtyToAdd, activeOffer?.discountPrice, activeOffer ? (getExpiresAtEpochSeconds(activeOffer) || 0) * 1000 : undefined, overridePrice, (catalogMode === 'paquetes' || catalogMode === 'embalajes'));
                        }} disabled={outOfStock} className="pk-add-btn"
                          style={{ marginTop: 10, padding: '9px 12px', borderRadius: 12, border: 'none', background: outOfStock ? '#f3f4f6' : gradientColor, color: outOfStock ? '#9ca3af' : buttonTextColor, fontSize: 12, fontWeight: 700, cursor: outOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s', boxShadow: outOfStock ? 'none' : `0 4px 14px ${shadowColor}`, fontFamily: 'inherit' }}>
                          <ShoppingCart size={13} /> {outOfStock ? 'Sin stock' : ((catalogMode === 'paquetes' || catalogMode === 'embalajes') ? 'Comprar paquete' : 'Agregar')}
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
                  const rawPricing = activeOffer ? {
                    displayPrice: activeOffer.discountPrice,
                    originalPrice: activeOffer.originalPrice,
                    hasDiscount: true,
                    discountPercent: activeOffer.discountPercentage,
                    fromApertura: false
                  } : resolveProductDisplayPrice(p, apertura);
                  
                  let price = rawPricing.displayPrice;
                  let origPrice = rawPricing.originalPrice;
                  
                  if (catalogMode === 'embalajes') {
                    price = p.WHOLESALEPRICE || p.PRICE;
                    origPrice = p.PRICE;
                  } else if (catalogMode === 'paquetes') {
                    if (isLiveShoppingProduct(p)) {
                      const liveDiscount = getLiveShoppingDiscountPercent(p.$createdAt!);
                      price = Math.round((p.PRICE || 0) * (1 - liveDiscount / 100));
                      origPrice = p.PRICE;
                    } else {
                      price = resolvePackUnitPrice(p);
                      origPrice = p.PRICE;
                    }
                  }

                  if ((catalogMode === 'paquetes' || catalogMode === 'embalajes') && p.PACKQTY) {
                    price *= p.PACKQTY;
                    if (origPrice != null) origPrice *= p.PACKQTY;
                  }

                  const hasDisc = origPrice != null && origPrice > price;
                  const effDiscPct = catalogMode === 'paquetes' ? (p.PACK_DISCOUNT_PCT || PACK_BONUS_DISCOUNT_PCT) : rawPricing.discountPercent;
                  const disc = hasDisc && origPrice ? Math.round((1 - price/origPrice)*100) : effDiscPct;
                  const pricing = { ...rawPricing, originalPrice: origPrice };
                  const fav = isFavorite(p.$id);
                  const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
                  const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
                  const cardSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
                  const effectiveStockL = (catalogMode === 'paquetes' || catalogMode === 'embalajes') ? packStockAvailable(p) : (p.STOCK || 0);
                  const outOfStockL = effectiveStockL <= 0;
                  return (
                    <div key={p.$id} className="pk-card-list" style={{ position: 'relative', background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', display: 'flex', gap: 16, padding: 12, transition: 'all 0.2s', alignItems: 'center' }}>
                      {hasDisc && (
                        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
                          {isPaquetes ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 900, letterSpacing: '0.04em', background: '#b8a07a', color: '#fff', lineHeight: 1 }}>✦ -{disc}%</span>
                          ) : (
                            <AperturaDiscountBadge percent={disc} size="sm" />
                          )}
                        </div>
                      )}
                      <div className="pk-card-list-media" onClick={() => handleCardImageClick(p)} style={{ position: 'relative', width: 110, height: 110, borderRadius: 14, overflow: 'hidden', background: '#f8f9fa', flexShrink: 0, cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none' }}>
                        {getProductImageUrl(p) ? <Image src={getProductImageUrl(p)} alt={p.NAME} fill style={{ objectFit: 'cover' }} sizes="110px" unoptimized /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 36 }}>📦</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {cardSku && <div className="pk-card-sku" style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2, fontWeight: 700 }}>SKU: {cardSku}</div>}
                        <Link prefetch={false} href={`/productos/${p.$id}${modeQueryParam}`} style={{ textDecoration: 'none' }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{p.NAME}</p>
                        </Link>
                        {p.PACKQTY && p.PACKQTY > 1 ? <div style={{ fontSize: 11, color: packQtyColor, fontWeight: 800, marginBottom: 6 }}>{p.PACKQTY} UNIDADES POR PAQUETE</div> : null}
                        <p className="pk-card-list-desc" style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>{p.DESCRIPTION}</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          {price > 0 ? (
                            <>
                              <span className="pk-price" style={{ fontSize: 18, fontWeight: 800, color: isPaquetes ? primaryColor : (hasDisc ? '#d97bb0' : '#111') }}>{formatPrice(price)}</span>
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
                          style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8f9fa', border: 'none', color: primaryColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Search size={16} />
                        </button>
                        <button onClick={() => toggleFavorite(p.$id)} title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8f9fa', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AnimHeart filled={fav} size={24} />
                        </button>
                        <button className="pk-list-cart-btn" onClick={() => {
                          const qtyToAddL = (catalogMode === 'paquetes' || catalogMode === 'embalajes') && p.PACKQTY ? p.PACKQTY : 1;
                          const overridePriceL = (catalogMode === 'paquetes' || catalogMode === 'embalajes') ? (p.WHOLESALEPRICE || p.PRICE) : undefined;
                          !outOfStockL && addItem(p, qtyToAddL, activeOffer?.discountPrice, activeOffer ? (getExpiresAtEpochSeconds(activeOffer) || 0) * 1000 : undefined, overridePriceL, (catalogMode === 'paquetes' || catalogMode === 'embalajes'));
                        }} disabled={outOfStockL} title={outOfStockL ? "Sin stock" : ((catalogMode === 'paquetes' || catalogMode === 'embalajes') ? "Comprar paquete" : "Agregar al carrito")}
                          style={{ width: 40, height: 40, borderRadius: '50%', background: outOfStockL ? '#e5e7eb' : lightBgColor, border: outOfStockL ? 'none' : `1.5px solid ${lightBorderColor}`, color: outOfStockL ? '#9ca3af' : primaryColor, cursor: outOfStockL ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: outOfStockL ? 'none' : `0 2px 8px ${shadowColorLight}` }}>
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
                      <div style={{ width: 24, height: 24, border: '3px solid #f3f4f6', borderTopColor: primaryColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : null}
                  </div>
                ) : (
                  <button 
                    onClick={() => loadMore()} 
                    disabled={isLoadingMore}
                    style={{ padding: '12px 32px', background: gradientColor, color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px ${shadowColor}`, fontFamily: 'inherit', opacity: isLoadingMore ? 0.7 : 1 }}
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
          <div className="pk-filters-backdrop pk-mobile-only" onClick={() => setMobileFiltersOpen(false)} onTouchMove={(e) => e.preventDefault()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', zIndex: 10000, touchAction: 'none' }} />
          <div className="pk-filters-drawer pk-mobile-only" style={{ overscrollBehavior: 'contain' }}>
            <div className="pk-filters-drawer-handle" />
            <div className="pk-filters-drawer-header" onTouchMove={(e) => e.preventDefault()}>
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

      {/* Mobile categories drawer */}
      {mounted && categoryDrawerOpen && createPortal(
        <>
          <div className="pk-filters-backdrop pk-mobile-only" onClick={() => setCategoryDrawerOpen(false)} onTouchMove={(e) => e.preventDefault()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', zIndex: 10000, touchAction: 'none' }} />
          <div className="pk-filters-drawer pk-mobile-only" style={{ overscrollBehavior: 'contain' }}>
            <div className="pk-filters-drawer-handle" />
            <div className="pk-filters-drawer-header" onTouchMove={(e) => e.preventDefault()}>
              <h2>Categorías</h2>
              <button type="button" onClick={() => setCategoryDrawerOpen(false)} aria-label="Cerrar categorías"><X size={18} /></button>
            </div>
            <div className="pk-filters-panel" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 4px' }}>
              <button
                onClick={() => { setSelectedCat(''); setSelectedSubcat(''); setCategoryDrawerOpen(false); updateCategoryUrl(''); }}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: selectedCat === '' ? `1.5px solid ${primaryColor}` : '1.5px solid rgba(229, 231, 235, 0.8)',
                  background: selectedCat === '' ? (isPaquetes ? 'rgba(198, 139, 89, 0.06)' : 'rgba(227, 150, 191, 0.06)') : '#fff',
                  color: selectedCat === '' ? (isPaquetes ? '#5c3d24' : '#c0547a') : '#374151',
                  fontSize: 14,
                  fontWeight: selectedCat === '' ? 800 : 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                Todas las categorías
              </button>
              {categories.map(c => {
                const isSelected = selectedCat === c.$id;
                return (
                  <button
                    key={c.$id}
                    onClick={() => { setSelectedCat(c.$id); setSelectedSubcat(''); setCategoryDrawerOpen(false); updateCategoryUrl(c.$id); }}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: 14,
                      border: isSelected ? `1.5px solid ${primaryColor}` : '1.5px solid rgba(229, 231, 235, 0.8)',
                      background: isSelected ? (isPaquetes ? 'rgba(198, 139, 89, 0.06)' : 'rgba(227, 150, 191, 0.06)') : '#fff',
                      color: isSelected ? (isPaquetes ? '#5c3d24' : '#c0547a') : '#374151',
                      fontSize: 14,
                      fontWeight: isSelected ? 800 : 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{c.name}</span>
                    {isSelected && <Sparkles size={14} color={primaryColor} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Quick View Modal */}
      {previewProduct && <ProductCardPreview product={previewProduct} onClose={() => setPreviewProduct(null)} />}

      {/* Image Zoom Modal */}
      {zoomImage && <ImageZoomModal src={zoomImage.src} alt={zoomImage.alt} onClose={() => setZoomImage(null)} />}


      <style>{`
        :root {
          --pk-primary: ${primaryColor};
          --pk-primary-dark: ${isPaquetes ? '#5c3d24' : (isEmbalajes ? '#7f1d1d' : '#c0547a')};
          --pk-gradient: ${gradientColor};
          --pk-light-bg: ${lightBgColor};
          --pk-light-border: ${lightBorderColor};
          --pk-shadow: ${shadowColor};
          --pk-shadow-light: ${shadowColorLight};
          --pk-radial: ${radialBgColor};
          --pk-cosmic-gradient: ${isPaquetes ? 'linear-gradient(-45deg, #f0f7ff, #e0f2fe, #f8fafc, #bae6fd, #ffffff)' : (isEmbalajes ? 'linear-gradient(-45deg, #fff5f5, #ffe3e3, #fff8f8, #ffc9c9, #ffffff)' : 'linear-gradient(-45deg, #fff2f6, #ffe5ee, #fff6f9, #fce7f3, #ffffff)')};
        }

        .pk-hero-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 16px;
          background: var(--pk-radial) !important;
          border: 1px solid rgba(${isPaquetes ? '123, 179, 232' : (isEmbalajes ? '220, 38, 38' : '227, 150, 191')}, 0.25) !important;
          font-size: 13px;
          font-weight: 800;
          color: var(--pk-primary-dark) !important;
          text-decoration: none !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pk-hero-home-btn:hover {
          background: rgba(${isPaquetes ? '198, 139, 89' : (isEmbalajes ? '220, 38, 38' : '227, 150, 191')}, 0.18) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(${isPaquetes ? '198, 139, 89' : (isEmbalajes ? '220, 38, 38' : '227, 150, 191')}, 0.15);
        }
        .pk-hero-home-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .pk-hero-stat-info, .pk-hero-stat-info * {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

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
          background: var(--pk-gradient) !important;
          box-shadow: var(--pk-badge-shadow) !important;
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
          overflow: visible;
        }
        
        .pk-toolbar.pk-toolbar-scrolled .pk-toolbar-actions {
          opacity: 0;
          max-height: 0 !important;
          transform: translateY(-10px);
          pointer-events: none;
          overflow: hidden !important;
        }

        .pk-toolbar-search input {
          border: 1.5px solid rgba(229, 231, 235, 0.8) !important;
          border-radius: 16px !important;
          background: rgba(255, 255, 255, 0.85) !important;
          font-weight: 500 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .pk-toolbar-search input:focus {
          border-color: var(--pk-primary) !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px var(--pk-shadow-light) !important;
        }

        .pk-toolbar-select-wrap select {
          border: 1.5px solid rgba(229, 231, 235, 0.8) !important;
          border-radius: 14px !important;
          background: rgba(255, 255, 255, 0.85) !important;
          font-weight: 600 !important;
          color: #374151 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .pk-toolbar-select-wrap select:focus {
          border-color: var(--pk-primary) !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px var(--pk-shadow-light) !important;
        }

        .pk-filters-btn {
          border: 1.5px solid var(--pk-shadow-light) !important;
          border-radius: 14px !important;
          background: rgba(255, 255, 255, 0.85) !important;
          color: var(--pk-primary-dark) !important;
          font-weight: 700 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 7px !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .pk-filters-btn:active {
          transform: scale(0.96) !important;
          background: var(--pk-shadow-light) !important;
        }

        .pk-sort-btn {
          border: 1.5px solid rgba(229, 231, 235, 0.8) !important;
          border-radius: 14px !important;
          background: rgba(255, 255, 255, 0.85) !important;
          font-weight: 600 !important;
          color: #374151 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .pk-sort-btn:focus, .pk-sort-btn:hover {
          border-color: var(--pk-primary) !important;
          background: #ffffff !important;
        }
        .pk-sort-btn:active {
          transform: scale(0.96) !important;
        }

        .pk-view-toggle {
          background: rgba(229, 231, 235, 0.4) !important;
          border: 1.5px solid rgba(229, 231, 235, 0.7) !important;
          padding: 3px !important;
          border-radius: 14px !important;
          gap: 3px !important;
        }
        .pk-view-toggle button {
          padding: 8px 12px !important;
          border-radius: 10px !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .pk-view-toggle button:active {
          transform: scale(0.92) !important;
        }
        .pk-desktop-only { display: block; }
        .pk-mobile-only { display: none; }
        .pk-filters-btn { display: none; }

        .pk-h-scroll { scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-x; -webkit-overflow-scrolling: touch; }
        .pk-h-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }

        .pk-filters-drawer {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 10005 !important;
          max-height: min(88vh, 720px); background: #fff;
          border-radius: 20px 20px 0 0; padding: 8px 16px calc(16px + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -12px 40px rgba(0,0,0,0.18);
          display: flex; flex-direction: column; gap: 10px;
          animation: pkDrawerUp 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .pk-filters-drawer-handle { width: 40px; height: 4px; border-radius: 999px; background: #e5e7eb; margin: 4px auto 0; flex-shrink: 0; }
        .pk-filters-drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 2px 8px; flex-shrink: 0; }
        .pk-filters-drawer-header h2 { margin: 0; font-size: 17px; font-weight: 800; color: #111827; }
        .pk-filters-drawer-header button { width: 36px; height: 36px; border-radius: 50%; border: none; background: #f8f9fa; color: var(--pk-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .pk-filters-drawer .pk-filters-panel { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; border-radius: 16px !important; box-shadow: none !important; margin: 0 !important; }
        .pk-filters-apply {
          flex-shrink: 0; width: 100%; padding: 14px; border: none; border-radius: 14px;
          background: var(--pk-gradient) !important; color: #fff;
          font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit;
          box-shadow: 0 6px 20px var(--pk-shadow) !important;
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

        .pk-hero-fallback-bg {
          background: ${isPaquetes ? 'linear-gradient(135deg, #faf0e6 0%, #eed9c4 50%, #fff8f0 100%)' : (isEmbalajes ? 'linear-gradient(135deg, #fff5f5 0%, #ffc9c9 50%, #fff8f8 100%)' : 'linear-gradient(135deg, #fdf2f8 0%, #f5d0fe 50%, #fae8ff 100%)')} !important;
          position: relative;
          overflow: hidden;
        }
        .pk-hero-fallback-bg::before {
          content: '';
          position: absolute;
          top: -20%;
          left: -10%;
          width: 60%;
          height: 140%;
          background: radial-gradient(circle, ${isPaquetes ? 'rgba(198, 139, 89, 0.4)' : (isEmbalajes ? 'rgba(220, 38, 38, 0.4)' : 'rgba(227, 150, 191, 0.4)')} 0%, transparent 70%);
          filter: blur(40px);
          animation: pulseGlow 8s ease-in-out infinite alternate;
        }
        .pk-hero-fallback-bg::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 50%;
          height: 130%;
          background: radial-gradient(circle, ${isPaquetes ? 'rgba(92, 61, 36, 0.3)' : (isEmbalajes ? 'rgba(127, 29, 29, 0.3)' : 'rgba(192, 84, 122, 0.3)')} 0%, transparent 70%);
          filter: blur(40px);
          animation: pulseGlow 12s ease-in-out infinite alternate-reverse;
        }
        @keyframes pulseGlow {
          0% { transform: scale(1) translate(0, 0); opacity: 0.6; }
          100% { transform: scale(1.2) translate(10px, 10px); opacity: 0.9; }
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
          .pk-hero-header {
            border-radius: 28px !important;
            margin-bottom: 24px !important;
            position: relative !important;
            min-height: 280px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            background: var(--pk-cosmic-gradient) !important;
            background-size: 400% 400% !important;
            animation: cosmicFlow 12s ease infinite !important;
            box-shadow: 0 16px 36px var(--pk-shadow-light) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            overflow: hidden !important;
          }
          
          @keyframes cosmicFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .pk-hero-banner {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            max-height: none !important;
            aspect-ratio: auto !important;
            z-index: 1 !important;
          }
          
          .pk-hero-banner-img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center bottom !important;
            opacity: 0.75 !important;
          }

          .pk-hero-fallback-bg {
            background: ${isPaquetes ? 'linear-gradient(135deg, #faf0e6 0%, #eed9c4 50%, #fff8f0 100%)' : 'linear-gradient(135deg, #fff2f6 0%, #fce7f3 50%, #fff6f9 100%)'} !important;
            opacity: 1 !important;
          }
          
          .pk-hero-banner::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, ${isPaquetes ? 'rgba(250, 240, 230, 0.05) 0%, rgba(198, 139, 89, 0.25)' : 'rgba(255, 240, 245, 0.05) 0%, rgba(227, 150, 191, 0.25)'} 100%) !important;
            z-index: 3;
          }
          
          .pk-hero-body {
            position: relative !important;
            z-index: 10 !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
            padding: 24px 20px 20px !important;
            background: transparent !important;
          }
          
          .pk-hero-logo-wrap {
            align-self: flex-start !important;
            width: auto !important;
            order: -1 !important;
            margin-bottom: 6px !important;
            display: flex !important;
            justify-content: flex-start !important;
          }
          
          .pk-hero-logo-img {
            height: 44px !important;
            width: auto !important;
            object-fit: contain !important;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15)) !important;
          }
          
          .pk-hero-text {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            width: 100% !important;
            color: #ffffff !important;
          }
          
          .pk-hero-badge {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: #ffffff !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            font-size: 11px !important;
            padding: 5px 12px !important;
            margin-bottom: 10px !important;
            box-shadow: 0 2px 10px var(--pk-shadow-light) !important;
            border-radius: 999px !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
          }
          
          .pk-products-title {
            font-size: 32px !important;
            font-weight: 900 !important;
            color: #ffffff !important;
            letter-spacing: -0.03em !important;
            text-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
          }
          
          .pk-hero-subtitle {
            font-size: 13px !important;
            color: #ffffff !important;
            font-weight: 700 !important;
            margin: 6px 0 14px !important;
            max-width: 100% !important;
            line-height: 1.4 !important;
            text-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
          }
          
          .pk-hero-stats {
            gap: 10px !important;
            width: 100% !important;
            display: flex !important;
            flex-wrap: wrap !important;
          }
          
          .pk-hero-stat-card {
            flex: 1 !important;
            min-width: 120px !important;
            padding: 10px 14px !important;
            border-radius: 16px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 10px !important;
            transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease !important;
          }

          .pk-hero-stat-card:active {
            transform: scale(0.97) !important;
            background: rgba(255, 255, 255, 0.25) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
          }
          
          .pk-hero-stat-icon {
            background: rgba(255, 255, 255, 0.2) !important;
            color: #ffffff !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
            box-shadow: none !important;
          }

          .pk-hero-stat-num {
            color: #ffffff !important;
            font-size: 18px !important;
            font-weight: 950 !important;
            display: block !important;
            line-height: 1.1 !important;
            text-shadow: 0 1px 3px rgba(192, 84, 122, 0.25) !important;
          }
          
          .pk-hero-stat-label {
            color: rgba(255, 255, 255, 0.7) !important;
            font-size: 10px !important;
            font-weight: 700 !important;
            letter-spacing: 0.03em !important;
            text-transform: uppercase !important;
            display: block !important;
          }

          .pk-hero-stat-link {
            flex: 1 0 100% !important;
            padding: 12px 14px !important;
            border-radius: 16px !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: #ffffff !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            text-align: center !important;
            justify-content: center !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            transition: transform 0.2s ease, background 0.2s ease !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
          }

          .pk-hero-stat-link:active {
            transform: scale(0.98) !important;
            background: rgba(255, 255, 255, 0.3) !important;
          }

          .pk-bubble {
            opacity: 0.35 !important;
          }

          .pk-hero-home-btn {
            width: 100% !important;
            justify-content: center !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: #ffffff !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
            text-shadow: 0 1px 3px rgba(192, 84, 122, 0.25) !important;
            margin-top: 6px !important;
          }
          .pk-hero-home-btn:hover, .pk-hero-home-btn:active {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: scale(0.98) !important;
          }
          
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
            background: var(--pk-light-bg) !important;
            border: 1.5px solid var(--pk-light-border) !important;
            color: var(--pk-primary) !important;
          }
          .pk-card-list-actions .pk-list-cart-btn svg {
            color: var(--pk-primary) !important;
            stroke: var(--pk-primary) !important;
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
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            max-height: none !important;
            aspect-ratio: auto !important;
            display: block !important;
          }
          .pk-hero-banner-img {
            object-fit: cover !important;
            object-position: center 50% !important;
            width: 100% !important;
            height: 100% !important;
            max-height: none !important;
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

export default function CollectionAll1({ lockCategoryId, catalogMode }: { lockCategoryId?: string; catalogMode?: 'retail' | 'paquetes' | 'embalajes' } = {}) {
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
      <ProductosInner lockCategoryId={lockCategoryId} catalogMode={catalogMode} />
    </Suspense>
  );
}
