'use client';

import { useEffect, useState, useRef } from 'react';
import { formatPrice } from '@/lib/appwrite';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Sparkles, ShoppingCart, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import { getSkuFromFeatures, getLiveLogicFromFeatures, isLiveLogicLimitedTimeActive } from '@/lib/product-features';

export default function RecentProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyDate, setHistoryDate] = useState<string>('');
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { addItem } = useCart();
  const { settings: apertura } = useAperturaPromotion();

  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const liveIndicatorRef = useRef<HTMLDivElement>(null);

  const categories = [
    { title: 'Maquillaje', href: '/productos?categoria=Maquillaje', image: 'https://http2.mlstatic.com/D_NQ_NP_694646-MCO76839566171_062024-O.webp' },
    { title: 'Cuidado de la Piel', href: '/productos?categoria=Cuidado%20de%20la%20Piel', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7PEqtrqVl1LmPEsQ2fgSnRLJWbzvztjTsQQ&s' },
    { title: 'Cuerpo e Higiene', href: '/productos?categoria=Cuerpo%20e%20Higiene', image: 'https://penkaloe.com/cdn/shop/articles/skin-care-2021-09-24-03-28-31-utc_2.jpg?crop=center&height=1200&v=1692553269&width=1200' },
    { title: 'Higiene Personal', href: '/productos?categoria=Higiene%20Personal', image: 'https://img.magnific.com/foto-gratis/mujer-joven-haciendo-su-rutina-matutina_23-2148837460.jpg' },
    { title: 'Accesorios de Belleza', href: '/productos?categoria=Accesorios%20de%20Belleza', image: 'https://cdnx.jumpseller.com/eshopangie1/image/42604940/thumb/306/306?1700846953' },
    { title: 'Perfumería', href: '/productos?categoria=Perfumer%C3%ADa', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjcQLvKVRkdZCgldy1suA7NPIA-EnnmOkmdw&s' },
    { title: 'Aromaterapia', href: '/productos?categoria=Aromaterapia', image: 'https://qenkon.cl/wp-content/uploads/2020/02/benefit-oils.jpg' },
    { title: 'Cuidado Capilar', href: '/productos?categoria=Cuidado%20Capilar', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsxSKGkEXPtUb1s1muPLwgGE71g1R_16-y1g&s' },
    { title: 'Manicure y Uñas', href: '/productos?categoria=Manicure%20y%20U%C3%B1as', image: 'https://media.glamour.mx/photos/61907145a6e030d6480f943d/4:3/w_1096,h_822,c_limit/225880.jpg' },
    { title: 'Depilación', href: '/productos?categoria=Depilaci%C3%B3n', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMRrEJYA1V_0FXc6PJh5zY2tFVPl378JuwFw&s' },
  ];

  const getScrollAmount = () => {
    const container = containerRef.current;
    if (!container) return 206;
    const card = container.querySelector<HTMLElement>('[data-recent-card]');
    if (!card) return 206;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '16') || 16;
    return card.offsetWidth + gap;
  };

  const handleScrollPrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await fetch('/api/public-data/products?live=true', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProducts((data.products || []) as Product[]);
        }
      } catch (err) {
        console.error('[RecentProducts] Error fetching:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecent();
  }, []);

  useEffect(() => {
    const el = liveIndicatorRef.current;
    if (!el || el.dataset.lottieInit) return;
    el.dataset.lottieInit = '1';
    let destroyed = false;
    let anim: any = null;
    import('lottie-web').then((m) => {
      if (destroyed) return;
      anim = m.default.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/api/assets/live',
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });
    });
    return () => {
      destroyed = true;
      if (anim) anim.destroy();
    };
  }, [loading, products.length]);

  useEffect(() => {
    if (isDrawerOpen || isHistoryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, isHistoryOpen]);

  // Cargar productos de un "día live" pasado (YYYY-MM-DD).
  const loadHistory = async (date: string) => {
    if (!date) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/public-data/products?live=true&date=${date}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setHistoryProducts((data.products || []) as Product[]);
      }
    } catch (err) {
      console.error('[RecentProducts] history error', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const openHistory = () => {
    const y = new Date();
    y.setDate(y.getDate() - 1); // por defecto, ayer
    const ds = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
    setHistoryDate(ds);
    setIsHistoryOpen(true);
    loadHistory(ds);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingId) return;

    addItem(product, 1);
    setAddingId(product.$id);

    // Dynamic cart drawer opening helper
    setTimeout(() => {
      setAddingId(null);
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) {
        cartDrawer.setAttribute('data-hidden', 'false');
        cartDrawer.removeAttribute('inert');
        document.documentElement.style.overflow = 'hidden';
      }
    }, 850);
  };

  // Tarjeta compacta (grid) reutilizable para el drawer "hoy" y el modal "otros días".
  const renderGridProduct = (p: Product, keyPrefix: string) => {
    const liveLogicDrawer = getLiveLogicFromFeatures((p as any).FEATURES || '');
    const pricing = resolveProductDisplayPrice(p, apertura, liveLogicDrawer);
    const displayPrice = pricing.displayPrice;
    const hasDiscount = pricing.hasDiscount;
    const isAdding = addingId === p.$id;
    const isLimitedStock = p.STOCK !== undefined && p.STOCK !== null && p.STOCK < 99999;
    const isSoldOut = isLimitedStock && p.STOCK <= 0;

    return (
      <div key={`${keyPrefix}-${p.$id}`} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col ${isSoldOut ? 'opacity-80' : ''}`}>
        <a href={`/productos/${p.$id}`} className="block relative aspect-square bg-gray-50">
          {p.IMAGEURL ? (
            <img src={p.IMAGEURL} alt={p.NAME} className={`w-full h-full object-cover ${isSoldOut ? 'grayscale brightness-[0.7]' : ''}`} loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl bg-gray-100">📦</div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-gray-950/45 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-white/95 backdrop-blur-md text-gray-950 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
                Agotado
              </span>
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded shadow-md z-10">
              -{pricing.discountPercent}% OFF
            </span>
          )}
        </a>
        <div className="p-3 flex flex-col flex-1 justify-between">
          <a href={`/productos/${p.$id}`}>
            <h4 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-2 hover:text-pink-600 transition-colors">{p.NAME}</h4>
          </a>
          {isLimitedStock && p.STOCK > 0 && (
            <div className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md inline-block mt-1 self-start animate-pulse">
              🔥 ¡Solo quedan {p.STOCK}!
            </div>
          )}
          <div className="flex items-center justify-between gap-1 mt-auto pt-2">
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-sm live-price-red">{formatPrice(displayPrice)}</span>
              {hasDiscount && pricing.originalPrice != null && <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">{formatPrice(pricing.originalPrice)}</span>}
            </div>
            <button
              onClick={(e) => handleAddToCart(e, p)}
              disabled={isAdding || isSoldOut}
              className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors ${
                isAdding
                  ? 'bg-green-500 text-white'
                  : isSoldOut
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#e396bf] hover:bg-[#d685af] text-white'
              }`}
            >
              {isAdding ? <Check size={14} /> : isSoldOut ? <X size={14} /> : <ShoppingCart size={14} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 relative overflow-hidden">

      <div className="custom-container relative overflow-hidden mb-7 sm:mb-10">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
              Categorías
            </div>
            <div className="text-lg sm:text-xl font-black text-gray-950 leading-tight">
              Explora rápido
            </div>
          </div>
          <a href="/categorias" className="text-[10px] sm:text-xs font-black text-pink-600 hover:text-pink-700 underline decoration-pink-300 underline-offset-2 uppercase tracking-wide">
            Ver todas
          </a>
        </div>
        <div className="tpl23-cats-scroll">
          {categories.map((c) => (
            <a key={c.href} href={c.href} aria-label={c.title} title={c.title} className="tpl23-cat-card">
              <div className="tpl23-cat-frame">
                <div className="tpl23-cat-media">
                  <img src={c.image} alt={c.title} loading="lazy" className="tpl23-cat-img" />
                  <div className="tpl23-cat-overlay" />
                </div>
              </div>
              <div className="tpl23-cat-title">
                <span className="tpl23-cat-title-text">{c.title}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Title block with glassmorphism */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 bg-white/55 backdrop-blur-md border border-white/70 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_10px_34px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="tpl23-live-indicator">
            <div ref={liveIndicatorRef} className="tpl23-live-lottie" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black tracking-tight sm:tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 drop-shadow-sm uppercase">
              Live Shopping
            </h2>
            <p className="text-[10px] sm:text-[11px] md:text-xs text-pink-600 font-black uppercase tracking-wide sm:tracking-widest mt-0">
              Productos en vivo • Stock Reciente
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="group bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 text-white border border-transparent font-black text-[10px] sm:text-xs py-2 px-4 sm:px-6 rounded-full transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-[0_10px_26px_rgba(236,72,153,0.22)] hover:shadow-[0_14px_34px_rgba(236,72,153,0.32)] active:scale-95 tracking-wider uppercase"
          >
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_#fff]"></span>
            </span>
            Ver lo de hoy
          </button>
          <button
            onClick={openHistory}
            className="text-[9px] sm:text-[11px] font-bold text-pink-600 hover:text-pink-700 underline decoration-pink-300 underline-offset-2 transition-colors flex items-center gap-1 uppercase tracking-wide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Ver lo de otros días
          </button>
        </div>
      </div>

      {/* Drawer */}
      <div 
        className={`fixed inset-0 z-[99999] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={() => setIsDrawerOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10 sticky top-0">
            <h3 className="font-black text-xl text-gray-900 tracking-tight">Productos del Live 🛍️</h3>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map(p => {
                const liveLogicDrawer = getLiveLogicFromFeatures((p as any).FEATURES || '');
                const pricing = resolveProductDisplayPrice(p, apertura, liveLogicDrawer);
                const displayPrice = pricing.displayPrice;
                const hasDiscount = pricing.hasDiscount;
                const isAdding = addingId === p.$id;
                const isLimitedStock = p.STOCK !== undefined && p.STOCK !== null && p.STOCK < 99999;
                const isSoldOut = isLimitedStock && p.STOCK <= 0;
                
                return (
                  <div key={`drawer-${p.$id}`} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col ${isSoldOut ? 'opacity-80' : ''}`}>
                    <a href={`/productos/${p.$id}`} className="block relative aspect-square bg-gray-50">
                      {p.IMAGEURL ? (
                        <img src={p.IMAGEURL} alt={p.NAME} className={`w-full h-full object-cover ${isSoldOut ? 'grayscale brightness-[0.7]' : ''}`} loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl bg-gray-100">📦</div>
                      )}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-gray-950/45 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <span className="bg-white/95 backdrop-blur-md text-gray-950 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
                            Agotado
                          </span>
                        </div>
                      )}
                      {/* Logic badge or discount badge */}
                      {(() => {
                        const liveLogic = getLiveLogicFromFeatures((p as any).FEATURES || '');
                        if (liveLogic?.limitedTime && isLiveLogicLimitedTimeActive(liveLogic)) {
                          return (
                            <span className="absolute top-2 right-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded shadow-md z-10">
                              ⏰ OFERTA
                            </span>
                          );
                        }
                        if (liveLogic?.minQty) {
                          return (
                            <span className="absolute top-2 right-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded shadow-md z-10">
                              📦 ×{liveLogic.minQty.qty}+
                            </span>
                          );
                        }
                        if (pricing.hasDiscount) {
                          return (
                            <span className="absolute top-2 right-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded shadow-md z-10">
                              -{pricing.discountPercent}% OFF
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </a>
                    <div className="p-3 flex flex-col flex-1 justify-between">
                      <a href={`/productos/${p.$id}`}>
                        <h4 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-2 hover:text-pink-600 transition-colors">{p.NAME}</h4>
                      </a>
                      {isLimitedStock && p.STOCK > 0 && (
                        <div className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md inline-block mt-1 self-start animate-pulse">
                          🔥 ¡Solo quedan {p.STOCK}!
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-1 mt-auto pt-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs sm:text-sm live-price-red">{formatPrice(displayPrice)}</span>
                          {hasDiscount && pricing.originalPrice != null && <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">{formatPrice(pricing.originalPrice)}</span>}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          disabled={isAdding || isSoldOut}
                          className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors ${
                            isAdding 
                              ? 'bg-green-500 text-white' 
                              : isSoldOut
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#e396bf] hover:bg-[#d685af] text-white'
                          }`}
                        >
                          {isAdding ? <Check size={14} /> : isSoldOut ? <X size={14} /> : <ShoppingCart size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <a href="/productos" className="flex items-center justify-center w-full py-3.5 bg-white border border-gray-900 text-gray-900 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
              Ir al catálogo completo
            </a>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isHistoryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)} />
        <div className={`relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl border border-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.22)] overflow-hidden transition-transform duration-300 ${isHistoryOpen ? 'scale-100' : 'scale-95'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-pink-50 via-white to-violet-50">
            <div>
              <h3 className="font-black text-lg sm:text-xl text-gray-900 tracking-tight">Ver lo de otros días</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-semibold">Elige la fecha y revisa los productos del live</p>
            </div>
            <button onClick={() => setIsHistoryOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900" aria-label="Cerrar">
              <X size={22} />
            </button>
          </div>

          <div className="p-5 bg-gradient-to-b from-gray-50/60 to-white overflow-y-auto max-h-[calc(90vh-88px)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-700">Fecha</label>
              <input
                type="date"
                value={historyDate}
                onChange={(e) => {
                  const d = e.target.value;
                  setHistoryDate(d);
                  loadHistory(d);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 bg-white font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              />
            </div>

            <div className="mt-4">
              {historyLoading ? (
                <div className="w-full flex items-center justify-center py-14">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
                </div>
              ) : historyProducts.length === 0 ? (
                <div className="w-full text-center py-10">
                  <div className="text-sm font-black text-gray-900 mb-1">No hay productos para esa fecha</div>
                  <div className="text-[12px] text-gray-500 font-semibold">Prueba con otro día</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {historyProducts.map((p) => renderGridProduct(p, 'history'))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes livePricePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .tpl23-live-indicator{
          width: 42px;
          height: 42px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 28px rgba(0,0,0,0.06);
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        }
        .tpl23-live-lottie{ width: 54px; height: 54px; transform: translateY(2px); }
        @media (max-width: 640px){
          .tpl23-live-indicator{ width: 38px; height: 38px; }
          .tpl23-live-lottie{ width: 48px; height: 48px; }
        }
        .tpl23-cats-scroll{
          display:flex;
          gap: 12px;
          overflow-x:auto;
          padding: 10px 2px 10px;
          scrollbar-width:none;
          -ms-overflow-style:none;
          -webkit-overflow-scrolling:touch;
          scroll-snap-type: x mandatory;
          -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
          mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
        }
        .tpl23-cats-scroll::-webkit-scrollbar{ display:none; }
        .tpl23-cat-card{
          width: clamp(96px, 27vw, 138px);
          flex: 0 0 auto;
          text-decoration:none;
          color: inherit;
          scroll-snap-align: start;
          display:flex;
          flex-direction:column;
          align-items:center;
        }
        .tpl23-cat-frame{
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 999px;
          padding: 3px;
          background: linear-gradient(135deg, rgba(244,114,182,0.38), rgba(196,181,253,0.42));
          box-shadow: 0 12px 30px rgba(227,150,191,0.18);
          transform: translateZ(0);
        }
        .tpl23-cat-media{
          position:relative;
          width:100%;
          height:100%;
          border-radius: 999px;
          overflow:hidden;
          border: 2px solid rgba(255,255,255,0.92);
          background: #f3f4f6;
        }
        .tpl23-cat-img{
          width:100%;
          height:100%;
          object-fit:cover;
          transform: scale(1.02);
          transition: transform 600ms cubic-bezier(0.16,1,0.3,1);
          display:block;
        }
        .tpl23-cat-overlay{
          position:absolute;
          inset:0;
          background: radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0) 72%), linear-gradient(to top, rgba(255,255,255,0.16), rgba(255,255,255,0));
          opacity: 1;
        }
        .tpl23-cat-title{
          margin-top: 10px;
          padding: 0 2px;
          width: 100%;
        }
        .tpl23-cat-title-text{
          font-size: 12px;
          font-weight: 900;
          letter-spacing: -0.015em;
          color: #374151;
          display:block;
          line-height: 1.14;
          text-align:center;
        }
        .tpl23-cat-card:hover .tpl23-cat-img{ transform: scale(1.10); }
        @media (max-width: 640px){
          .tpl23-cats-scroll{ gap: 10px; }
          .tpl23-cat-card{ width: clamp(88px, 25vw, 116px); }
          .tpl23-cat-title-text{ font-size: 11px; }
        }
        .live-price-red {
          background: linear-gradient(135deg, #ff7e95 0%, #ff385c 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          color: transparent !important;
          font-weight: 900 !important;
          filter: drop-shadow(0 2px 4px rgba(255, 56, 92, 0.15)) !important;
          animation: livePricePulse 2s infinite ease-in-out;
          display: inline-block;
          transform-origin: left center;
        }
        
        .recent-carousel-wrapper {
          position: relative;
          width: 100%;
          -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
          mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
        }
        .recent-carousel-container {
          display: flex !important;
          overflow-x: auto !important;
          scroll-behavior: smooth !important;
          gap: 16px !important;
          padding: 12px 10px 24px !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .recent-carousel-container::-webkit-scrollbar {
          display: none !important;
        }
        .recent-product-card {
          width: clamp(170px, 17vw, 230px) !important;
          flex-shrink: 0 !important;
        }
      `}} />

      <div 
        className="recent-carousel-wrapper group/wrapper relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Botones de navegación (solo desktop) */}
        <button 
          onClick={handleScrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:bg-[#e396bf] hover:text-white transition-all duration-300 opacity-0 group-hover/wrapper:opacity-100 active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft size={22} />
        </button>
        <button 
          onClick={handleScrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:bg-[#e396bf] hover:text-white transition-all duration-300 opacity-0 group-hover/wrapper:opacity-100 active:scale-95"
          aria-label="Siguiente"
        >
          <ChevronRight size={22} />
        </button>

        {/* Contenedor del scroll */}
        <div 
          ref={containerRef}
          className="recent-carousel-container scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((p, idx) => {
            const pFeatures = Array.isArray(p.FEATURES) ? p.FEATURES.join('\n') : p.FEATURES;
            const pTags = Array.isArray(p.TAGS) ? p.TAGS.join(',') : p.TAGS;
            const cardSku = getSkuFromFeatures(pFeatures, pTags, (p as any).jumpseller_id, p.SKU || (p as any).sku);
            const liveLogicCard = getLiveLogicFromFeatures(pFeatures);
            const pricing = resolveProductDisplayPrice(p, apertura, liveLogicCard);
            const displayPrice = pricing.displayPrice;
            const hasDiscount = pricing.hasDiscount;
            const isAdding = addingId === p.$id;

            const isLimitedStock = p.STOCK !== undefined && p.STOCK !== null && p.STOCK < 99999;
            const isSoldOut = isLimitedStock && p.STOCK <= 0;

            return (
              <div 
                key={`carousel-${p.$id}-${idx}`} 
                data-recent-card
                className={`recent-product-card snap-start group ${isSoldOut ? 'opacity-80' : ''}`}
              >
                <div className={`h-full rounded-2xl bg-gradient-to-br from-pink-500/35 via-fuchsia-500/10 to-violet-500/35 p-[1px] shadow-[0_10px_34px_rgba(0,0,0,0.06)] transition-all duration-300 ${isSoldOut ? '' : 'hover:shadow-[0_16px_46px_rgba(0,0,0,0.10)] hover:-translate-y-1'} will-change-transform`}>
                  <div className="h-full rounded-[15px] bg-white/95 backdrop-blur overflow-hidden flex flex-col justify-between border border-white/60">
                    <a href={`/productos/${p.$id}`} className="block relative overflow-hidden aspect-square bg-gradient-to-br from-pink-50 via-white to-violet-50 p-1.5">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        {p.IMAGEURL ? (
                          <img
                            src={p.IMAGEURL}
                            alt={p.NAME}
                            loading="lazy"
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isSoldOut ? 'grayscale brightness-[0.7]' : 'group-hover:scale-110'}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl bg-gray-100">
                            📦
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {isSoldOut && (
                          <div className="absolute inset-0 bg-gray-950/45 backdrop-blur-[1px] flex items-center justify-center z-10">
                            <span className="bg-white/95 backdrop-blur-md text-gray-950 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
                              Agotado
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md border border-white/25">
                          En vivo
                        </span>
                      </div>

                      {(() => {
                        const liveLogic = getLiveLogicFromFeatures((p as any).FEATURES || '');
                        if (liveLogic?.limitedTime && isLiveLogicLimitedTimeActive(liveLogic)) {
                          return (
                            <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-md z-10 border border-white/25">
                              ⏰ OFERTA
                            </span>
                          );
                        }
                        if (liveLogic?.minQty) {
                          return (
                            <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-md z-10 border border-white/25">
                              📦 ×{liveLogic.minQty.qty}+
                            </span>
                          );
                        }
                        if (pricing.hasDiscount) {
                          return (
                            <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-md z-10 border border-white/25">
                              -{pricing.discountPercent}% OFF
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </a>

                    <div className="p-3.5 flex flex-col justify-between flex-grow">
                      <div className="mb-2">
                        {cardSku && <div className="text-[10px] text-gray-400 font-black mb-1">SKU: {cardSku}</div>}
                        <a href={`/productos/${p.$id}`} className="block">
                          <h3 className="font-semibold text-[12px] sm:text-[13px] text-gray-900 group-hover:text-fuchsia-700 line-clamp-2 transition-colors duration-200 min-h-[34px] leading-snug">
                            {p.NAME}
                          </h3>
                        </a>
                        {p.PACKQTY && p.PACKQTY > 1 ? (
                          <div className="inline-flex items-center mt-2 px-2.5 py-1 rounded-full bg-fuchsia-50 border border-fuchsia-100 text-[10px] font-black text-fuchsia-700">
                            {p.PACKQTY} unidades por paquete
                          </div>
                        ) : null}
                      </div>

                      {isLimitedStock && p.STOCK > 0 && (
                        <div className="text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full inline-flex self-start">
                          🔥 Quedan {p.STOCK}
                        </div>
                      )}

                      <div className="mt-3 pt-2 border-t border-gray-100/60">
                        <div className="flex items-end justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="font-black text-base tracking-tight live-price-red">
                              {formatPrice(displayPrice)}
                            </span>
                            {hasDiscount && pricing.originalPrice != null && (
                              <span className="text-[10px] text-gray-400 line-through font-semibold">
                                {formatPrice(pricing.originalPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(e, p)}
                            disabled={isAdding || isSoldOut}
                            className={`h-10 px-4 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 shadow-[0_10px_24px_rgba(236,72,153,0.18)] active:scale-95 ${
                              isAdding
                                ? 'bg-emerald-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)]'
                                : isSoldOut
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                  : 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 text-white hover:from-pink-500 hover:to-violet-500'
                            }`}
                            title={isSoldOut ? 'Agotado' : 'Agregar al carrito'}
                            aria-label={isSoldOut ? 'Agotado' : 'Agregar al carrito'}
                          >
                            {isAdding ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Check size={14} strokeWidth={3} />
                                Listo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5">
                                <ShoppingCart size={14} strokeWidth={2.5} />
                                Agregar
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
