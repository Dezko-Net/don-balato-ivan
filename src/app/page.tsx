'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Shield, Truck, Star, ChevronRight, Clock } from 'lucide-react';
import { getServices, getAppwriteConfig, PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, BANNERS_COLLECTION, TIMED_OFFERS_COLLECTION, formatPrice } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Product, Category, Banner, TimedOffer } from '@/types';
import { useCart } from '@/context/CartContext';
import DynamicHomePage from '@/components/DynamicHomePage';
import { cached, TTL } from '@/lib/cache';
import RecentProductsSection from '@/components/RecentProductsSection';


declare global { interface Window { __homeFirstMount?: boolean; } }

function getOfferExpiresAt(offer: TimedOffer): number | null {
  if (offer.timeType === 'endDateTime' && offer.endDateTime) return new Date(offer.endDateTime).getTime();
  if (offer.timeType === 'duration' && offer.durationHours) {
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

function CountdownTimer({ offer }: { offer: TimedOffer }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const expiresAt = getOfferExpiresAt(offer);
      if (!expiresAt) { setTimeLeft(''); return; }
      const diff = expiresAt - Date.now();
      if (diff <= 0) { setTimeLeft('Expirado'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h >= 24) setTimeLeft(`${Math.floor(h/24)}d ${h%24}h`);
      else setTimeLeft(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offer]);
  return <span className="font-mono text-orange-400">{timeLeft}</span>;
}

export default function HomePage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [offers, setOffers] = useState<TimedOffer[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [configError, setConfigError] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const { endpoint, projectId, databaseId } = getAppwriteConfig();
      if (!projectId || !endpoint || !databaseId) {
        setConfigError(true);
        return;
      }
      try {
        // Fetch all home data from cached Next.js API route to save Appwrite quotas
        const res = await fetch('/api/public-data/home');
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        setProducts(((data.products || []) as Product[]).filter(p => (p.STOCK || 0) > 0));
        setCategories((data.categories || []) as Category[]);
        setBanners((data.banners || []) as Banner[]);
        setOffers(((data.offers || []) as TimedOffer[]).filter(isOfferActive));
      } catch (e) {
        console.error('Appwrite error:', e);
        setConfigError(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners]);

  const activeBanner = banners[bannerIdx];

  if (configError && products.length === 0) return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center animate-fade-in">
      <div className="w-16 h-16 glass rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
        <span className="text-3xl">⚙️</span>
      </div>
      <h2 className="text-xl font-bold mb-3">Tienda no configurada</h2>
      <p className="text-white/50 text-sm mb-4">
        No se pudo conectar a Appwrite. Verifica la configuración o revisa la consola del navegador.
      </p>
      <div className="glass rounded-2xl p-4 text-xs text-left text-white/60 mb-6 border border-white/10 space-y-2">
        <p className="font-semibold text-white/80">Posibles causas:</p>
        <p>1. <strong>localhost no está en Web Platforms</strong>: En Appwrite Console → tu proyecto → Settings → Platforms → Add Web → hostname: <code className="bg-white/10 px-1 rounded">localhost</code></p>
        <p>2. <strong>Credenciales incorrectas</strong>: Verifica endpoint, project ID y database ID en <code className="bg-white/10 px-1 rounded">.env.local</code> o en <a href="/configurar" className="text-purple-400 hover:underline">/configurar</a></p>
      </div>
      <a href="/configurar" className="gradient-bg text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 inline-block">
        Ir a configuración
      </a>
    </div>
  );

  return (
    <DynamicHomePage>
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0">
          {/* Mobile banner */}
          <div className="block md:hidden absolute inset-0">
            <Image 
              src="https://nyc.cloud.appwrite.io/v1/storage/buckets/6a15f9a5001070a3c408/files/6a30d3b00006861dc8fd/view?project=6a0a4e8d0032177f3f90&impersonateuserid=&mode=admin" 
              alt="Hero Mobile" 
              fill 
              sizes="100vw" 
              className="object-cover opacity-35" 
              priority
            />
          </div>
          {/* Desktop/PC banner */}
          <div className="hidden md:block absolute inset-0">
            <Image 
              src="https://nyc.cloud.appwrite.io/v1/storage/buckets/6a15f9a5001070a3c408/files/6a30dd06000106a7bb64/view?project=6a0a4e8d0032177f3f90&impersonateuserid=&mode=admin" 
              alt="Hero PC" 
              fill 
              sizes="100vw" 
              className="object-cover opacity-35" 
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white via-white/95 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-gray-600 mb-8">
              <Zap size={14} className="text-yellow-500" />
              {offers.length > 0 ? `${offers.length} ofertas activas ahora` : 'Envíos a todo Chile'}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              {activeBanner?.TITLE ? (
                <span className="gradient-text">{activeBanner.TITLE}</span>
              ) : (
                <>Todo lo que<br /><span className="gradient-text">necesitas,</span><br />a un click.</>
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {activeBanner?.DESCRIPTION || 'Los mejores productos con envío rápido a todo Chile. Paga fácil con transferencia bancaria.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/productos" className="gradient-bg text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25">
                Ver productos <ArrowRight size={20} />
              </Link>
              {offers.length > 0 && (
                <Link href="/ofertas" className="glass text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 hover:bg-white transition-colors">
                  <Zap size={20} className="text-yellow-500" /> Ofertas
                </Link>
              )}
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setBannerIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === bannerIdx ? 'bg-white w-6' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="py-12 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <Truck size={20} className="text-purple-400" />, title: 'Envío a todo Chile', desc: 'Múltiples agencias de despacho' },
            { icon: <Shield size={20} className="text-green-400" />, title: 'Compra segura', desc: 'Tu pedido protegido siempre' },
            { icon: <Star size={20} className="text-yellow-400" />, title: 'Calidad garantizada', desc: 'Productos verificados' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-4 glass rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">{f.icon}</div>
              <div>
                <p className="font-medium text-sm">{f.title}</p>
                <p className="text-xs text-white/40">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Explorar categorías</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <Link key={cat.$id} href={`/categoria/${cat.$id}`}
                className="glass rounded-2xl px-6 py-4 flex flex-col items-center gap-2 min-w-[120px] hover:bg-white/10 transition-colors card-hover text-center">
                {cat.iconUrl && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={cat.iconUrl} alt={cat.name || ''} fill sizes="100vw" className="object-cover" />
                  </div>
                )}
                <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RECENT PRODUCTS */}
      <RecentProductsSection />


      {/* TIMED OFFER BANNER — debajo de categorías, estilo app */}
      {offers.length > 0 && (
        <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-orange-400" />
              <h2 className="text-lg sm:text-xl font-bold">Oferta por tiempo limitado</h2>
            </div>
            {offers.length > 1 && (
              <Link href="/ofertas" className="text-xs sm:text-sm text-white/50 hover:text-white flex items-center gap-1">Ver todas <ChevronRight size={13} /></Link>
            )}
          </div>
          {(() => {
            const offer = offers[0];
            return (
              <Link href={offer.targetId ? `/productos/${offer.targetId}` : '/ofertas'} className="block">
                {/* Mobile: stacked card layout / Desktop: banner with fixed height */}
                <div className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl" style={{ minHeight: '220px' }}>
                  {/* Background image */}
                  {offer.customImagePath ? (
                    <Image
                      src={offer.customImagePath}
                      alt={offer.productName}
                      fill
                      sizes="100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-purple-900" />
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge top-left mobile / top-right desktop */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:right-4 sm:left-auto z-10">
                    <div className="flex items-center gap-1 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg animate-pulse">
                      <Clock size={10} className="shrink-0" />
                      <span className="hidden xs:inline">OFERTA POR TIEMPO LIMITADO</span>
                      <span className="xs:hidden">OFERTA</span>
                    </div>
                  </div>

                  {/* Discount badge top-right mobile */}
                  <div className="absolute top-3 right-3 sm:hidden z-10">
                    <span className="bg-red-500 text-white text-sm font-black px-2.5 py-1 rounded-xl shadow">-{offer.discountPercentage}%</span>
                  </div>

                  {/* Content — bottom on both */}
                  <div className="relative z-10 flex flex-col justify-end p-4 sm:p-6" style={{ minHeight: '220px' }}>
                    {/* Spacer to push content down on mobile */}
                    <div className="flex-1" />

                    <p className="text-white font-bold text-base sm:text-xl leading-tight mb-1 drop-shadow-lg line-clamp-2">{offer.title}</p>
                    <p className="text-white/75 text-xs sm:text-sm font-medium mb-3 truncate">{offer.productName}</p>

                    {/* Prices row */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
                      <span className="text-white/55 text-sm line-through">{formatPrice(offer.originalPrice)}</span>
                      <span className="text-green-400 text-2xl sm:text-3xl font-bold drop-shadow-md">{formatPrice(offer.discountPrice)}</span>
                      <span className="hidden sm:inline bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg">-{offer.discountPercentage}%</span>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 w-fit">
                      <Clock size={13} className="text-orange-400 shrink-0" />
                      <CountdownTimer offer={offer} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })()}
        </section>
      )}

      {/* PRODUCTS */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Productos destacados</h2>
          <Link href="/productos" className="text-sm text-white/50 hover:text-white flex items-center gap-1">Ver todos <ChevronRight size={14} /></Link>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No hay productos aún</p>
            <p className="text-sm mt-2">Vuelve pronto</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => {
              const displayPrice = p.CURRENTPRICE && p.CURRENTPRICE > 0 ? p.CURRENTPRICE : p.PRICE;
              const hasDiscount = p.CURRENTPRICE && p.CURRENTPRICE < p.PRICE;
              const discPct = hasDiscount ? Math.round(((p.PRICE - p.CURRENTPRICE!) / p.PRICE) * 100) : 0;
              return (
                <div key={p.$id} className="glass rounded-2xl overflow-hidden card-hover group">
                  <Link href={`/productos/${p.$id}`}>
                    <div className="relative h-48 bg-white/5">
                      {p.IMAGEURL ? (
                        <Image src={p.IMAGEURL} alt={p.NAME} fill sizes="100vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white/20 text-4xl">📦</div>
                      )}
                      {hasDiscount && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">-{discPct}%</div>
                      )}
                      {p.STOCK === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-xs font-bold text-white/60 border border-white/20 px-3 py-1 rounded-full">Sin stock</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/productos/${p.$id}`}>
                      <h3 className="font-medium text-sm mb-1 truncate hover:text-purple-300 transition-colors">{p.NAME}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-white">{formatPrice(displayPrice)}</span>
                      {hasDiscount && <span className="text-xs text-white/40 line-through">{formatPrice(p.PRICE)}</span>}
                    </div>
                    <button
                      disabled={p.STOCK === 0}
                      onClick={() => addItem(p)}
                      className="w-full py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed gradient-bg hover:opacity-90 text-white"
                    >
                      {p.STOCK === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
    </DynamicHomePage>
  );
}
