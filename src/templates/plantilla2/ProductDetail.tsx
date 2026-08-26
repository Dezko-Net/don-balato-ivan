'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check, ChevronRight, Truck, Shield, RefreshCw, Clock } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, STOCK_ALERTS_COLLECTION, TIMED_OFFERS_COLLECTION, formatPrice, ID } from '@/lib/appwrite';
import { buildStockAlertData } from '@/lib/stock-alerts';
import { normalizeProductImages, getProductImageUrl, resolveStorageImageUrl } from '@/lib/product-images';
import { Query } from 'appwrite';
import { Product, TimedOffer } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import ReviewSection from '@/components/ReviewSection';
import FavoriteButton from '@/components/FavoriteButton';
import RecentlyViewed, { trackView } from '@/components/RecentlyViewed';
import ImageZoom from '@/components/ImageZoom';
import ProductQuestions from '@/components/ProductQuestions';
import ProductTabs from '@/components/ProductTabs';
import StockIndicator from '@/components/StockIndicator';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import AperturaDiscountBadge from '@/components/AperturaDiscountBadge';
import CountdownTimer from '@/components/CountdownTimer';

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

export default function ProductDetailPlantilla2({ previewProductId }: { previewProductId?: string }) {
  const params = useParams<{ id: string; productId?: string }>();
  const id = previewProductId || params.productId || params.id;
  const router = useRouter();
  const { user } = useAuth();
  const { unlimitedStock } = useStoreSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryBg, setCategoryBg] = useState('');
  const [categoryBgLoaded, setCategoryBgLoaded] = useState(false);
  const [categoryColor, setCategoryColor] = useState('#3483fa');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const [activeOffer, setActiveOffer] = useState<TimedOffer | null>(null);
  const { settings: apertura } = useAperturaPromotion();

  // Keyboard navigation for image gallery
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!product) return;
      const imgs = [product.IMAGEURL, product.IMAGEURL2, product.IMAGEURL3, product.IMAGEURL4, product.IMAGEURL5].filter(Boolean).map(v => resolveStorageImageUrl(v));
      if (imgs.length <= 1) return;
      if (e.key === 'ArrowLeft') setSelectedImg(i => (i - 1 + imgs.length) % imgs.length);
      else if (e.key === 'ArrowRight') setSelectedImg(i => (i + 1) % imgs.length);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public-data/product-detail?id=${id}`);
        if (!res.ok) throw new Error('Failed to fetch product detail');
        const data = await res.json();
        
        if (!data.product) throw new Error('Product not found');
        const p = data.product as Product;
        setProduct(p);
        trackView(p.$id);

        if (data.activeOffer) {
          setActiveOffer(data.activeOffer);
        }

        if (data.category) {
          const cat = data.category;
          setCategoryName(cat.name || '');
          setCategoryBg(cat.BACKGROUND_IMAGE_URL || 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/KEVINCOCO/young-asian-woman-sunglasses-going-shopping-holding-bags-from-malls-stores-smiling-standi.jpg?GoogleAccessId=imagen%40geminai-449212.iam.gserviceaccount.com&Expires=16730334000&Signature=Kriv9I1%2BxlaQ82%2Fe3rYaugEThNVyRAfMagiNC6isWPR5mNdXx0WaR4y1vLh5hQ4dmePjvlnq4M9QLS4Q0IReBjghaydSO8rWXbyJvc6823UgzvzZxChCZeYWjy0bBJ9EtW%2Bc5NN1YT%2B%2B5nW7k5DZW5aTZH%2F7np5s2NTquTvxGzxGzpefVaylS4KJc19%2FLVuaznxVuOfYWpKoMM6XScrcwQwwD8ir51EW9XFwLdN528WtGF%2FCspzulD%2BVDC4VYHD0EVurQiAGNhSzeFExCT2byhbijHmJgnxWEM6SR%2BZWaBoYxFTbDIkSNbzU736uiNbaM%2BKrxzF9bZSjgtfI947A5g%3D%3D');
          setCategoryColor(cat.COLOR || '#3483fa');
          setCategoryIcon(cat.iconUrl || '');
        }

        if (data.relatedProducts) {
          setRelated(data.relatedProducts as Product[]);
        }
      } catch (err) {
        console.error('Error loading product details via API:', err);
        router.push('/productos');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, router]);

  // Dynamic SEO metadata (must be before early return to respect hooks order)
  useEffect(() => {
    if (!product) return;
    const price = resolveProductDisplayPrice(product, apertura).displayPrice;
    document.title = `${product.NAME} - ${formatPrice(price)} | Tienda`;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) { el = document.createElement('meta'); name.startsWith('og:') ? el.setAttribute('property', name) : el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    const desc = (product.DESCRIPTION || product.NAME).slice(0, 160);
    setMeta('description', desc);
    setMeta('og:title', product.NAME);
    setMeta('og:description', desc);
    setMeta('og:type', 'product');
    if (product.IMAGEURL) setMeta('og:image', resolveStorageImageUrl(product.IMAGEURL));
    setMeta('og:url', window.location.href);
    setMeta('product:price:amount', String(price));
    setMeta('product:price:currency', 'CLP');
    // JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: window.location.origin },
            { '@type': 'ListItem', position: 2, name: 'Productos', item: `${window.location.origin}/productos` },
            ...(categoryName ? [{ '@type': 'ListItem', position: 3, name: categoryName, item: `${window.location.origin}/productos?categoria=${encodeURIComponent(categoryName)}` }] : []),
            { '@type': 'ListItem', position: categoryName ? 4 : 3, name: product.NAME, item: window.location.href },
          ],
        },
        {
          '@type': 'Product',
          name: product.NAME,
          description: desc,
          image: resolveStorageImageUrl(product.IMAGEURL) || undefined,
          sku: product.$id,
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: 'CLP',
            availability: (product.STOCK ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: window.location.href,
          },
          ...(product.RATING ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.RATING, reviewCount: product.NUMREVIEWS || 1 } } : {}),
        },
      ],
    };
    let scriptEl = document.getElementById('product-jsonld');
    if (!scriptEl) { scriptEl = document.createElement('script'); scriptEl.id = 'product-jsonld'; scriptEl.setAttribute('type', 'application/ld+json'); document.head.appendChild(scriptEl); }
    scriptEl.textContent = JSON.stringify(jsonLd);
    return () => { document.title = 'Tienda'; const el = document.getElementById('product-jsonld'); if (el) el.remove(); };
  }, [product, categoryName, apertura]);

  if (isLoading) return (
    <div style={{ background: '#ebebeb', minHeight: '100vh', padding: '32px 5%' }}>
      <div style={{ background: '#fff', borderRadius: 4, padding: 32, maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 32 }}>
        <div style={{ width: 460, height: 460, background: '#f5f5f5', borderRadius: 4 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[70, 50, 30, 80, 40, 40].map((w, i) => <div key={i} style={{ height: 18, background: '#f5f5f5', borderRadius: 4, width: `${w}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const images = [product.IMAGEURL, product.IMAGEURL2, product.IMAGEURL3, product.IMAGEURL4, product.IMAGEURL5].filter(Boolean).map(v => resolveStorageImageUrl(v)) as string[];
  const priceResolved = activeOffer ? {
    displayPrice: activeOffer.discountPrice,
    originalPrice: activeOffer.originalPrice,
    hasDiscount: true,
    discountPercent: activeOffer.discountPercentage,
    fromApertura: false
  } : resolveProductDisplayPrice(product, apertura);
  const displayPrice = priceResolved.displayPrice;
  const hasDisc = priceResolved.hasDiscount;
  const discPct = priceResolved.discountPercent;
  const priceOriginal = priceResolved.originalPrice;
  const hasWholesale = !!(product.WHOLESALEPRICE && product.WHOLESALEMINQUANTITY && product.WHOLESALEPRICE > 0);
  const isWholesaleUser = user?.isWholesale || false;
  const pFeatures = Array.isArray(product.FEATURES) ? product.FEATURES.join('\n') : product.FEATURES || '';
  const isExact = /ExactWholesale:\s*true/i.test(pFeatures);
  const isWholesaleQty = hasWholesale && (isExact ? qty === (product.WHOLESALEMINQUANTITY || 0) : qty >= (product.WHOLESALEMINQUANTITY || 0));
  const effectivePrice = isWholesaleQty && isWholesaleUser ? product.WHOLESALEPRICE! : displayPrice;
  const lineTotal = effectivePrice * qty;
  const isLimitedStock = product.STOCK !== undefined && product.STOCK !== null && product.STOCK < 99999;
  const stock = isLimitedStock ? product.STOCK! : 99999;
  const rating = product.RATING ?? 0;
  const numReviews = product.NUMREVIEWS ?? 0;
  const soldQty = product.SOLDQUANTITY ?? 0;
  const stockColor = !isLimitedStock ? '#00a650' : (stock > 10 ? '#00a650' : stock > 5 ? '#f57c00' : stock > 0 ? '#f73737' : '#999');
  const stockLabel = !isLimitedStock ? 'Stock disponible' : (stock > 10 ? 'Stock disponible' : stock > 5 ? 'Stock limitado' : stock > 0 ? 'Últimas unidades' : 'Sin stock');
  const isBestSeller = soldQty >= 20;
  const hasOffer = hasDisc && discPct >= 10;

  function handleAdd() {
    addItem(product!, qty, activeOffer?.discountPrice, activeOffer ? (getExpiresAtEpochSeconds(activeOffer) || 0) * 1000 : undefined, isWholesaleQty && isWholesaleUser ? product?.WHOLESALEPRICE : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleBuyNow() {
    addItem(product!, qty, activeOffer?.discountPrice, activeOffer ? (getExpiresAtEpochSeconds(activeOffer) || 0) * 1000 : undefined, isWholesaleQty && isWholesaleUser ? product?.WHOLESALEPRICE : undefined);
    router.push('/carrito');
  }

  return (
    <div style={{ background: '#ebebeb', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', padding: '10px 2%', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Link href="/" style={{ color: '#3483fa', textDecoration: 'none' }}>Inicio</Link>
          <ChevronRight size={12} color="#999" />
          <Link href="/productos" style={{ color: '#3483fa', textDecoration: 'none' }}>Productos</Link>
          {categoryName && <>
            <ChevronRight size={12} color="#999" />
            <Link href={`/productos?categoria=${encodeURIComponent(categoryName)}`} style={{ color: '#3483fa', textDecoration: 'none' }}>{categoryName}</Link>
          </>}
          <ChevronRight size={12} color="#999" />
          <span style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{product.NAME}</span>
        </div>
      </div>

      {/* ── Category Banner ── */}
      <div style={{
        position: 'relative', width: '100%', height: 240, overflow: 'hidden',
        background: categoryBg ? '#000' : (categoryColor ? `linear-gradient(135deg,${categoryColor}cc,${categoryColor}55)` : 'linear-gradient(135deg,#3483fa99,#3483fa33)'),
      }}>
        {categoryBg && !categoryBgLoaded && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#e5e7eb,#d1d5db,#e5e7eb)', backgroundSize: '200% 100%', animation: 'skeletonShimmer 1.5s ease infinite' }} />
        )}
        {categoryBg
          ? <Image src={categoryBg} alt={categoryName} fill style={{ objectFit: 'cover', opacity: 0.9 }} onLoad={() => setCategoryBgLoaded(true)} />
          : null}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(235,235,235,0.95) 100%)' }} />
        <style>{`@keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        /* Buy button particles */
        @keyframes p2OrbFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.9; }
          50% { transform: translateY(-22px) translateX(8px) scale(1.4); opacity: 1; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-44px) translateX(-4px) scale(0.6); opacity: 0; }
        }
        @keyframes p2Sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          20% { transform: scale(1.2) rotate(90deg); opacity: 1; }
          50% { transform: scale(0.8) rotate(180deg); opacity: 0.8; }
          80% { transform: scale(1.1) rotate(270deg); opacity: 0.5; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes p2Shimmer { 0% { left: -40%; } 100% { left: 110%; } }
        @keyframes p2Pulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(52,131,250,0.3), inset 0 0 12px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 4px 14px rgba(52,131,250,0.5), inset 0 0 20px rgba(255,255,255,0.2); }
        }
        .p2-buy-btn { animation: p2Pulse 2s ease-in-out infinite; }
        .p2-buy-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 32px rgba(52,131,250,0.35), inset 0 0 20px rgba(255,255,255,0.15); }
        .p2-orb {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.1));
          box-shadow: 0 0 6px rgba(255,255,255,0.5);
          animation: p2OrbFloat 2.8s ease-in-out infinite;
        }
        .p2-orb:nth-child(1) { width: 8px; height: 8px; left: 8%; bottom: 4px; animation-delay: 0s; }
        .p2-orb:nth-child(2) { width: 5px; height: 5px; left: 22%; bottom: 2px; animation-delay: 0.4s; }
        .p2-orb:nth-child(3) { width: 10px; height: 10px; left: 38%; bottom: 6px; animation-delay: 0.8s; }
        .p2-orb:nth-child(4) { width: 6px; height: 6px; left: 52%; bottom: 3px; animation-delay: 1.2s; }
        .p2-orb:nth-child(5) { width: 7px; height: 7px; left: 68%; bottom: 5px; animation-delay: 1.6s; }
        .p2-orb:nth-child(6) { width: 4px; height: 4px; left: 82%; bottom: 2px; animation-delay: 2s; }
        .p2-orb:nth-child(7) { width: 9px; height: 9px; left: 92%; bottom: 4px; animation-delay: 2.4s; }
        .p2-sparkle {
          position: absolute; width: 4px; height: 4px; background: white;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: p2Sparkle 2s ease-in-out infinite;
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
        }
        .p2-sparkle:nth-child(8) { left: 15%; top: 30%; animation-delay: 0s; }
        .p2-sparkle:nth-child(9) { left: 45%; top: 20%; animation-delay: 0.7s; width: 5px; height: 5px; }
        .p2-sparkle:nth-child(10) { left: 75%; top: 40%; animation-delay: 1.4s; }
        .p2-sparkle:nth-child(11) { left: 30%; top: 55%; animation-delay: 0.3s; width: 3px; height: 3px; }
        .p2-sparkle:nth-child(12) { left: 60%; top: 15%; animation-delay: 1s; }
        .p2-shimmer-line {
          position: absolute; top: 0; bottom: 0; width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: p2Shimmer 2.5s ease-in-out infinite;
          pointer-events: none;
        }
        `}</style>
        {(categoryName || categoryIcon) && (
          <div style={{
            position: 'absolute', bottom: 140, left: '12%',
            background: 'rgba(255,255,255,0.97)', borderRadius: 10,
            padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}>
            {categoryIcon && (
              <Image src={categoryIcon} alt={categoryName} width={44} height={44} style={{ objectFit: 'contain' }} />
            )}
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#333' }}>{categoryName}</p>
              <Link href={`/productos?categoria=${encodeURIComponent(categoryName)}`} style={{ fontSize: 12, color: '#3483fa', textDecoration: 'none' }}>Ver todos los productos →</Link>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: '-100px auto 0', padding: '0 0 16px', position: 'relative', zIndex: 2 }}>

        {/* ── Breadcrumbs ── */}
        <nav style={{ fontSize: 13, color: '#999', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#3483fa', textDecoration: 'none' }}>Inicio</Link>
          <ChevronRight size={12} />
          <Link href="/productos" style={{ color: '#3483fa', textDecoration: 'none' }}>Productos</Link>
          {categoryName && (
            <>
              <ChevronRight size={12} />
              <Link href={`/productos?categoria=${product.CATEGORYID}`} style={{ color: '#3483fa', textDecoration: 'none' }}>{categoryName}</Link>
            </>
          )}
          <ChevronRight size={12} />
          <span style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{product.NAME}</span>
        </nav>

        {/* ── Main card ── */}
        <div style={{ background: '#fff', borderRadius: 4, padding: '24px 20px', display: 'flex', gap: 32, marginBottom: 16, flexWrap: 'wrap' }}>

          {/* Left: image gallery */}
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            {images.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} style={{
                    width: 76, height: 76, border: `2px solid ${selectedImg === i ? '#3483fa' : '#e5e5e5'}`,
                    borderRadius: 4, background: '#f9f9f9', cursor: 'pointer', padding: 0, overflow: 'hidden',
                    transition: 'border-color .15s',
                  }}>
                    <Image src={img} alt="" width={76} height={76} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                  </button>
                ))}
              </div>
            )}
            <div style={{ position: 'relative', width: 480, height: 480, background: '#f9f9f9', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
              {images[selectedImg]
                ? <ImageZoom src={images[selectedImg]} alt={product.NAME} width={480} height={480} />
                : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>📦</span>}
              {hasDisc && (
                <span style={{ position: 'absolute', top: 12, left: 12, background: '#e53935', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 4 }}>
                  -{discPct}%
                </span>
              )}
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'flex', gap: 6 }}>
                <ShareButton title={product.NAME} text={`${product.NAME} - ${formatPrice(displayPrice)}`} image={resolveStorageImageUrl(product.IMAGEURL)} />
                <FavoriteButton productId={product.$id} size={22} />
              </div>
            </div>
          </div>

          {/* Right: info */}
          <div style={{ flex: 1, minWidth: 380, maxWidth: 520, paddingLeft: 16 }}>
            {soldQty > 0 && (
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#666' }}>Nuevo | <strong>+{soldQty.toLocaleString()}</strong> vendidos</p>
            )}
            {isBestSeller && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ background: '#f23d4f', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 4 }}>MÁS VENDIDO</span>
                <span style={{ fontSize: 12, color: '#666' }}>{soldQty}+ unidades vendidas</span>
              </div>
            )}
            <h1 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 400, color: '#333', lineHeight: 1.3 }}>{product.NAME}</h1>

            {/* Rating */}
            {rating > 0 && (
              <div
                onClick={() => {
                  const tabsEl = document.getElementById('product-tabs');
                  if (tabsEl) {
                    tabsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Activate reviews tab via custom event
                    window.dispatchEvent(new CustomEvent('activate-tab', { detail: 'reviews' }));
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                title="Ver opiniones"
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: '#666' }}>{rating.toFixed(1)}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f6a500' : 'none'} stroke="#f6a500" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                {numReviews > 0 && <span style={{ fontSize: 13, color: '#3483fa', textDecoration: 'underline' }}>({numReviews} {numReviews === 1 ? 'opinión' : 'opiniones'})</span>}
              </div>
            )}

            {activeOffer && (
              <div style={{
                marginBottom: 16,
                padding: '12px 14px',
                background: '#fff5f5',
                border: '1.5px solid #fee2e2',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#f73737', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} className="animate-pulse" /> ¡Este producto está en oferta por tiempo limitado!
                </p>
                <div style={{ marginTop: 2 }}>
                  <CountdownTimer expiresAt={getExpiresAtEpochSeconds(activeOffer) || 0} />
                </div>
              </div>
            )}

            {/* Price section */}
            {hasOffer && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ddeeff', border: '1px solid #3483fa', borderRadius: 6, padding: '5px 12px', marginBottom: 12 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3483fa"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#3483fa' }}>OFERTA IMPERDIBLE</span>
              </div>
            )}
            <div style={{ marginBottom: 24 }}>
              {hasWholesale && <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#f57c00' }}>PRECIO MAYORISTA</p>}
              {(hasDisc && !isWholesaleQty && priceOriginal != null) && (
                <p style={{ margin: '0 0 2px', fontSize: 15, color: '#999', textDecoration: 'line-through' }}>{formatPrice(priceOriginal)}</p>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 38, fontWeight: 300, color: '#333', letterSpacing: -1 }}>
                  {formatPrice(isWholesaleQty ? product.WHOLESALEPRICE! : effectivePrice)}
                </span>
                {(hasDisc && !isWholesaleQty) && (
                  priceResolved.fromApertura ? (
                    <AperturaDiscountBadge percent={discPct} size="lg" />
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#00a650' }}>{discPct}% OFF</span>
                  )
                )}
              </div>
              {isWholesaleQty && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#00a650', fontWeight: 500 }}>✓ Precio mayorista aplicado</p>}
              {hasWholesale && !isWholesaleQty && (
                <p style={{ margin: '8px 0 0', fontSize: 13, color: '#3483fa' }}>
                  {isExact ? `Comprando exactamente ${product.WHOLESALEMINQUANTITY} unidades:` : `Comprando ${product.WHOLESALEMINQUANTITY}+ unidades:`} <strong>{formatPrice(product.WHOLESALEPRICE!)}</strong> c/u
                  <br />
                  <span style={{ fontSize: 12, color: '#666' }}>A partir de {formatPrice(product.WHOLESALEPRICE! * product.WHOLESALEMINQUANTITY!)} en el total del pedido</span>
                </p>
              )}
            </div>

            {/* Shipping */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
              <p style={{ margin: 0, fontSize: 14, color: '#00a650', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={15} /> Envío disponible a todo Chile
              </p>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#00a650', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={13} /> Devolución gratis — 30 días para devolverlo
              </p>
            </div>

            {/* Stock */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: stockColor }}>{stockLabel}</p>
              {isLimitedStock && stock > 0 && stock <= 10 && <p style={{ margin: 0, fontSize: 13, color: '#666' }}>¡Solo quedan {stock} unidades!</p>}
            </div>

            {/* Quantity + Buttons */}
            {stock > 0 ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 14, color: '#666' }}>
                    Cantidad: <strong style={{ color: '#333' }}>{qty} unidad{qty > 1 ? 'es' : ''}</strong>
                    {isLimitedStock && <span style={{ color: '#999' }}> (+{stock} disponibles)</span>}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 4, width: 'fit-content' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 42, height: 42, border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#3483fa', fontWeight: 300 }}>−</button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1 && (!isLimitedStock || val <= stock)) {
                          setQty(val);
                        }
                      }}
                      style={{ 
                        width: 60, 
                        textAlign: 'center', 
                        fontSize: 16, 
                        fontWeight: 500, 
                        border: '1px solid transparent',
                        outline: 'none',
                        outlineStyle: 'none',
                        boxShadow: 'none',
                        background: '#fff'
                      }}
                    />
                    <button onClick={() => setQty(q => !isLimitedStock ? q + 1 : Math.min(stock, q + 1))} style={{ width: 42, height: 42, border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#3483fa', fontWeight: 300 }}>+</button>
                  </div>
                  {qty > 1 && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#666' }}>Total: <strong style={{ color: '#333' }}>{formatPrice(lineTotal)}</strong></p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
                  {isLimitedStock && <StockIndicator stock={product.STOCK} soldQuantity={product.SOLDQUANTITY} />}
                  <button onClick={handleBuyNow} className="p2-buy-btn" style={{ padding: '15px 24px', background: '#3483fa', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background .15s', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#2968c8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#3483fa')}
                  >
                    <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                      <span className="p2-orb" /><span className="p2-orb" /><span className="p2-orb" /><span className="p2-orb" /><span className="p2-orb" /><span className="p2-orb" /><span className="p2-orb" />
                      <span className="p2-sparkle" /><span className="p2-sparkle" /><span className="p2-sparkle" /><span className="p2-sparkle" /><span className="p2-sparkle" />
                    </span>
                    <span className="p2-shimmer-line" />
                    <span style={{ position: 'relative', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>Comprar ahora</span>
                  </button>
                  <button onClick={handleAdd} style={{ padding: '14px 24px', background: added ? '#e8f5e9' : '#fff', color: added ? '#00a650' : '#3483fa', border: `1.5px solid ${added ? '#00a650' : '#3483fa'}`, borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .15s' }}>
                    {added ? <><Check size={17} /> Agregado</> : <><ShoppingCart size={17} /> Agregar al carrito</>}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderRadius: 6, padding: '20px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px', fontSize: 15, color: '#999' }}>Sin stock por el momento</p>
                <button onClick={async () => {
                  const email = prompt('Ingresa tu email para recibir una notificación cuando haya stock:');
                  if (!email || !email.includes('@')) return;
                  try {
                    const { databases } = getServices();
                    const { databaseId } = getAppwriteConfig();
                    await databases.createDocument(databaseId, STOCK_ALERTS_COLLECTION, ID.unique(), buildStockAlertData({
                      productId: product.$id,
                      userId: email.toLowerCase().trim(),
                      productName: product.NAME || '',
                      productImage: getProductImageUrl(product) || '',
                    }));
                    alert('✅ Te avisaremos por email cuando haya stock disponible');
                  } catch (err: any) {
                    if (err.message?.includes('already exists')) {
                      alert('Ya estás suscrito a esta alerta');
                    } else {
                      alert('Error al registrar alerta: ' + err.message);
                    }
                  }
                }} style={{ padding: '10px 20px', background: '#3483fa', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  🔔 Avisarme cuando haya stock
                </button>
              </div>
            )}

            {/* Trust badge */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Shield size={17} color="#00a650" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: '#666', lineHeight: 1.4 }}>
                <strong style={{ color: '#00a650' }}>Compra Protegida</strong> — recibe el producto o te devolvemos el dinero.
              </span>
            </div>
          </div>
        </div>

        {/* ── Features + Description ── */}
        {((product.FEATURES && product.FEATURES.length > 0) || (product.TAGS && product.TAGS.length > 0) || product.DESCRIPTION) && (
          <div style={{ background: '#fff', borderRadius: 4, padding: '28px 32px', marginBottom: 16 }}>
            {product.FEATURES && product.FEATURES.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 400, color: '#333' }}>Características del producto</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 0, border: '1px solid #f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                  {product.FEATURES.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: i % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #f0f0f0' }}>
                      <Check size={14} color="#00a650" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: '#555' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {product.TAGS && product.TAGS.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600, color: '#555' }}>Etiquetas</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.TAGS.map((t, i) => (
                    <span key={i} style={{ fontSize: 13, color: '#3483fa', border: '1px solid #d3e6ff', background: '#f0f7ff', padding: '4px 14px', borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {product.DESCRIPTION && (
              <div>
                <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 400, color: '#333' }}>Descripción</h2>
                <p style={{ margin: 0, fontSize: 15, color: '#555', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{product.DESCRIPTION}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 4, padding: '28px 32px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 400, color: '#333' }}>Productos relacionados</h2>
              {categoryName && (
                <Link href={`/productos?categoria=${encodeURIComponent(categoryName)}`} style={{ fontSize: 14, color: '#3483fa', textDecoration: 'none' }}>Ver más</Link>
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
              {related.map(p => {
                const rPricing = resolveProductDisplayPrice(p, apertura);
                const rprice = rPricing.displayPrice;
                const rhasDisc = rPricing.hasDiscount;
                const rdisc = rPricing.discountPercent;
                return (
                  <Link key={p.$id} href={`/productos/${p.$id}`} style={{ flexShrink: 0, width: 168, textDecoration: 'none', border: '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden', background: '#fff', display: 'block', transition: 'box-shadow .15s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(0,0,0,.12)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
                  >
                    <div style={{ position: 'relative', height: 148, background: '#f9f9f9' }}>
                      {getProductImageUrl(p) ? <Image src={getProductImageUrl(p)} alt={p.NAME} fill className="object-contain p-2" /> : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>📦</span>}
                      {rhasDisc && rPricing.fromApertura && (
                        <span style={{ position: 'absolute', top: 6, left: 6, zIndex: 2 }}>
                          <AperturaDiscountBadge percent={rdisc} size="sm" />
                        </span>
                      )}
                      {rhasDisc && !rPricing.fromApertura && <span style={{ position: 'absolute', top: 6, left: 6, background: '#e53935', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 3 }}>-{rdisc}%</span>}
                    </div>
                    <div style={{ padding: '10px 12px 14px' }}>
                      <p style={{ margin: '0 0 6px', fontSize: 12, color: '#333', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.NAME}</p>
                      {rhasDisc && rPricing.originalPrice != null && <p style={{ margin: '0 0 1px', fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>{formatPrice(rPricing.originalPrice)}</p>}
                      <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#333' }}>{formatPrice(rprice)}</p>
                      {rhasDisc && <p style={{ margin: '1px 0 0', fontSize: 11, color: '#00a650', fontWeight: 600 }}>{rdisc}% OFF</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tabs: Descripción, Reseñas, Preguntas ── */}
        <ProductTabs tabs={[
          { id: 'desc', label: 'Descripción', content: (
            <div style={{ fontSize: 15, color: '#555', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {product.DESCRIPTION || 'Sin descripción disponible.'}
              {product.FEATURES && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontWeight: 600, color: '#333', marginBottom: 8 }}>Características:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {(typeof product.FEATURES === 'string' ? (product.FEATURES as string).split(',') : product.FEATURES).map((f: string, i: number) => (
                      <li key={i} style={{ marginBottom: 4, color: '#555' }}>{f.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )},
          { id: 'reviews', label: 'Opiniones', count: numReviews, content: (
            <ReviewSection productId={product.$id} rating={rating} numReviews={numReviews} />
          )},
          { id: 'questions', label: 'Preguntas', content: (
            <ProductQuestions productId={product.$id} />
          )},
        ]} />

        {/* ── Vistos recientemente ── */}
        <RecentlyViewed excludeId={product.$id} />

      </div>
    </div>
  );
}
