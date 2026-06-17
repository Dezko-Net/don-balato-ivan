'use client';

import { useEffect, useState, useRef } from 'react';
import { formatPrice } from '@/lib/appwrite';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Sparkles, ShoppingCart, Check, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';

export default function LatestProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { addItem } = useCart();
  const { settings: apertura } = useAperturaPromotion();

  const containerRef = useRef<HTMLDivElement>(null);

  const getScrollAmount = () => {
    const container = containerRef.current;
    if (!container) return 206;
    const card = container.querySelector<HTMLElement>('[data-latest-card]');
    if (!card) return 206;
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '16') || 16;
    // Scroll by ~2 cards on desktop, 1 on mobile for a natural feel
    const perStep = window.innerWidth >= 768 ? 2 : 1;
    return (card.offsetWidth + gap) * perStep;
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
    const loadNewest = async () => {
      try {
        const res = await fetch('/api/public-data/products?sortBy=updated&limit=24');
        if (res.ok) {
          const data = await res.json();
          // Filter to show active products with stock
          const activeProducts = (data.products || []).filter((p: Product) => p.STOCK !== undefined && p.STOCK > 0);
          setProducts(activeProducts);
        }
      } catch (err) {
        console.error('[LatestProducts] Error fetching:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNewest();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(product.$id);
    addItem(product);
    setTimeout(() => {
      setAddingId(null);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e396bf]"></div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">
      {/* Title section */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider mb-1 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
            <Sparkles size={14} className="animate-pulse" />
            Novedades y Reingresos
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
            Últimos Agregados y Stock Renovado
          </h2>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .latest-carousel-wrapper {
          position: relative;
          width: 100%;
        }
        .latest-carousel-wrapper::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 24px;
          background: linear-gradient(to right, #fcfcfd, transparent);
          z-index: 10;
          pointer-events: none;
        }
        .latest-carousel-wrapper::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 24px;
          background: linear-gradient(to left, #fcfcfd, transparent);
          z-index: 10;
          pointer-events: none;
        }
        .latest-carousel-container {
          display: flex !important;
          overflow-x: auto !important;
          scroll-behavior: smooth !important;
          gap: 14px !important;
          padding: 12px 4px 24px !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .latest-carousel-container::-webkit-scrollbar {
          display: none !important;
        }
        .latest-product-card {
          width: clamp(210px, 60vw, 240px) !important;
          flex-shrink: 0 !important;
        }
        @media (min-width: 640px) {
          .latest-product-card {
            width: clamp(200px, 26vw, 230px) !important;
          }
        }
        @media (min-width: 1024px) {
          .latest-product-card {
            width: clamp(200px, 16vw, 226px) !important;
          }
        }
        .animate-spin-slow {
          animation: spin 1.8s linear infinite;
        }
      `}} />

      {/* Carousel */}
      <div
        className="latest-carousel-wrapper group/wrapper relative w-full"
      >
        {/* Navigation Buttons */}
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

        {/* Scroll Container */}
        <div
          ref={containerRef}
          className="latest-carousel-container scrollbar-hide snap-x"
        >
          {products.map((p, idx) => {
            const pricing = resolveProductDisplayPrice(p, apertura);
            const displayPrice = pricing.displayPrice;
            const hasDiscount = pricing.hasDiscount;
            const isAdding = addingId === p.$id;

            const createdAt = new Date(p.$createdAt || '').getTime();
            const now = Date.now();

            const isNew = (now - createdAt < 7 * 24 * 60 * 60 * 1000) || (idx < 4);
            const isRestocked = !isNew && p.STOCK > 0;

            return (
              <div
                key={`latest-carousel-${p.$id}-${idx}`}
                data-latest-card
                className="latest-product-card snap-start group"
              >
                <div className="relative h-full rounded-3xl bg-white overflow-hidden flex flex-col border border-pink-100/70 shadow-[0_6px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(236,72,153,0.12)] hover:-translate-y-1 hover:border-pink-200 will-change-transform">
                  <a href={`/productos/${p.$id}`} className="block relative overflow-hidden aspect-square bg-gradient-to-br from-pink-50 via-white to-violet-50">
                    {p.IMAGEURL ? (
                      <img
                        src={p.IMAGEURL}
                        alt={p.NAME}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                        📦
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>

                    {/* New / Restock badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {isNew ? (
                        <span className="bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md shadow-pink-500/30 flex items-center gap-1 ring-1 ring-white/40">
                          <Sparkles size={10} /> Nuevo
                        </span>
                      ) : (
                        <span className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md shadow-emerald-500/30 flex items-center gap-1 ring-1 ring-white/40">
                          <RefreshCw size={9} className="animate-spin-slow" /> Reingreso
                        </span>
                      )}
                    </div>

                    {/* Discount badge — compact */}
                    {pricing.hasDiscount && (
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-rose-600 font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm z-10 ring-1 ring-rose-100">
                        -{pricing.discountPercent}%
                      </span>
                    )}
                  </a>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-900 text-[13px] leading-snug line-clamp-2 mb-2 group-hover:text-fuchsia-700 transition-colors min-h-[34px]">
                      {p.NAME}
                    </h3>

                    <div>
                      <div className="flex items-baseline gap-2 mb-2.5">
                        <span className="font-black text-gray-950 text-lg leading-none tracking-tight">
                          {formatPrice(displayPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-gray-400 line-through leading-none">
                            {formatPrice(p.PRICE)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        className={`w-full py-2.5 px-3 rounded-xl font-black text-[11px] uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                          isAdding
                            ? 'bg-emerald-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)]'
                            : 'bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white shadow-[0_8px_20px_rgba(236,72,153,0.25)] hover:brightness-105'
                        }`}
                      >
                        {isAdding ? (
                          <>
                            <Check size={13} strokeWidth={3} />
                            Listo
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={12} />
                            Agregar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
