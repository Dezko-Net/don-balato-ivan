'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Share2, ArrowLeft, Sparkles } from 'lucide-react';
import AnimHeart from '@/components/AnimHeart';
import LottieFavorite from '@/components/LottieFavorite';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/appwrite';
import { resolveStorageImageUrl } from '@/lib/product-images';
import { Product } from '@/types';
import RecentlyViewed from '@/components/RecentlyViewed';
import { useCuentaBg } from '../CuentaBgContext';

const PINK = '#e396bf';
const FF = '"DM Sans",system-ui,sans-serif';

const BG_FAVORITOS = 'https://t3.ftcdn.net/jpg/03/58/30/68/360_F_358306827_NYg3eaDFRsStIWjO6CUwtuBDAo1A1TDF.jpg';

export default function FavoritosPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  useCuentaBg(BG_FAVORITOS);
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  const [favs, setFavs] = useState<Product[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  // Guard: si no está logueado, redirigir con hard refresh para evitar hooks mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
    if (!mounted || !isLoggedIn) return;
    if (favorites.length === 0) {
      setFavs([]);
      setLoadingFavs(false);
      return;
    }

    let isSubscribed = true;
    async function fetchFavs() {
      try {
        if (favs.length === 0) setLoadingFavs(true);
        const { getServices, getAppwriteConfig, PRODUCTS_COLLECTION } = await import('@/lib/appwrite');
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();
        const { Query } = await import('appwrite');
        
        const queryIds = favorites.slice(0, 100);
        const res = await databases.listDocuments(databaseId, PRODUCTS_COLLECTION || 'products', [
          Query.equal('$id', queryIds),
          Query.limit(100)
        ]);
        if (isSubscribed) {
          const fetchedDocs = res.documents as unknown as Product[];
          const orderedFavs = favorites.map(id => fetchedDocs.find(d => d.$id === id)).filter(Boolean) as Product[];
          setFavs(orderedFavs);
        }
      } catch (err) {
        console.error('Error fetching favorites', err);
      } finally {
        if (isSubscribed) setLoadingFavs(false);
      }
    }
    fetchFavs();
    return () => { isSubscribed = false; };
  }, [favorites, mounted, isLoggedIn]);

  if (!mounted) return null;

  function handleAdd(p: Product) {
    addItem(p, 1);
    setAdded(p.$id);
    setTimeout(() => setAdded(null), 1500);
  }

  const displayPrice = (p: Product) => p.CURRENTPRICE && p.CURRENTPRICE > 0 ? p.CURRENTPRICE : p.PRICE;
  
  const displayedFavs = favs.filter(p => favorites.includes(p.$id));

  return (
    <>
      <style>{`
        @keyframes favFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fav-card { animation: favFadeUp .4s ease both; }
        .fav-card:nth-child(2) { animation-delay: .04s; }
        .fav-card:nth-child(3) { animation-delay: .08s; }
        .fav-card:nth-child(4) { animation-delay: .12s; }
        .fav-card:nth-child(5) { animation-delay: .16s; }
        .fav-card:nth-child(6) { animation-delay: .2s; }
        .fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
        .fav-card-inner { background: #fff; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .fav-card-inner:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .fav-add-btn { flex: 1; padding: 10px 0; border: none; border-radius: 10px; font-weight: 600; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all .2s; font-family: ${FF}; }
        .fav-del-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all .2s; border: none; }

        @media (max-width: 768px) {
          .fav-page-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; margin-bottom: 14px !important; }
          .fav-page-header h1 { font-size: 18px !important; padding-left: 0 !important; padding-top: 0 !important; }
          .fav-page-header button { width: 100%; justify-content: center; padding: 10px !important; }
          .fav-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }
          .fav-card-inner { border-radius: 14px !important; }
          .fav-card-inner > a > div { height: 120px !important; }
          .fav-card-inner > div { padding: 8px 10px 10px !important; }
          .fav-card-inner p { font-size: 11.5px !important; line-height: 1.25 !important; }
          .fav-add-btn { padding: 10px 0 !important; font-size: 11px !important; border-radius: 10px !important; min-height: 38px !important; }
          .fav-del-btn { width: 38px !important; height: 38px !important; border-radius: 10px !important; }
          .fav-empty { padding-top: 16px !important; padding-bottom: 16px !important; }
          .fav-empty h2 { font-size: 19px !important; }
          .fav-empty p { font-size: 13px !important; padding: 0 16px !important; margin-bottom: 20px !important; }
          .fav-empty a { width: calc(100% - 32px); max-width: 320px; justify-content: center; box-sizing: border-box; padding: 13px 24px !important; font-size: 14px !important; }
        }
      `}</style>

      {/* Header */}
      <div className="fav-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.01em' }}>
          <AnimHeart filled size={22} /> Mis Favoritos
          {favs.length > 0 && <span style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>({favs.length})</span>}
        </h1>
        {favs.length > 0 && (
          <button onClick={() => {
            const data = btoa(JSON.stringify({ name: 'Lista de deseos', ids: favs.map(p => p.$id) }));
            const url = `${window.location.origin}/lista/${data}`;
            if (navigator.share) { navigator.share({ title: 'Mi lista de deseos', url }).catch(() => {}); }
            else { navigator.clipboard.writeText(url); alert('Enlace copiado al portapapeles'); }
          }}
            style={{ padding: '8px 16px', background: '#fdf2f8', border: '1px solid rgba(227,150,191,0.2)', borderRadius: 10, color: PINK, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: FF, transition: 'background .15s' }}>
            <Share2 size={14} /> Compartir lista
          </button>
        )}
      </div>

      {loadingFavs && displayedFavs.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#888' }}>
          <div className="spinner" style={{ width: 30, height: 30, border: '3px solid #f3f3f3', borderTop: `3px solid ${PINK}`, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          Cargando favoritos...
        </div>
      ) : displayedFavs.length === 0 ? (
        <div className="fav-empty" style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 20px' }}>
            <LottieFavorite size={140} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Aún no tienes favoritos</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.55 }}>
            Guarda los productos que te encantan tocando el ❤️. ¡Vuelve cuando hayas encontrado algo especial!
          </p>
          <Link href="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: `linear-gradient(135deg,${PINK},#c0547a)`, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(227,150,191,0.3)', transition: 'transform .2s, box-shadow .2s', fontFamily: FF }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(227,150,191,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(227,150,191,0.3)'; }}>
            <Sparkles size={16} /> Explorar productos
          </Link>
          <div style={{ marginTop: 40 }}>
            <RecentlyViewed />
          </div>
        </div>
      ) : (
        <div className="fav-grid">
          {displayedFavs.map(p => {
            const price = displayPrice(p);
            const hasDiscount = p.CURRENTPRICE && p.CURRENTPRICE > 0 && p.CURRENTPRICE < p.PRICE;
            const pct = hasDiscount ? Math.round((1 - p.CURRENTPRICE! / p.PRICE) * 100) : 0;
            return (
              <div key={p.$id} className="fav-card">
                <div className="fav-card-inner">
                  <Link prefetch={false} href={`/productos/${p.$id}`} style={{ display: 'block', position: 'relative' }}>
                    <div style={{ height: 160, background: '#fafafa', overflow: 'hidden' }}>
                      {p.IMAGEURL
                        ? <img src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10 }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AnimHeart filled={false} size={36} /></div>
                      }
                    </div>
                    {pct > 0 && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#e53935', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 6 }}>-{pct}%</span>
                    )}
                  </Link>

                  <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Link prefetch={false} href={`/productos/${p.$id}`} style={{ textDecoration: 'none' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, color: '#333', fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.NAME}</p>
                    </Link>

                    <div style={{ marginBottom: 8 }}>
                      {hasDiscount && <p style={{ margin: '0 0 1px', fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>{formatPrice(p.PRICE)}</p>}
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{formatPrice(price)}</p>
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                      <button onClick={() => handleAdd(p)}
                        className="fav-add-btn"
                        style={{ background: added === p.$id ? '#16a34a' : PINK, color: '#fff' }}>
                        <ShoppingCart size={13} />
                        {added === p.$id ? '¡Listo!' : 'Agregar'}
                      </button>
                      <button onClick={() => toggleFavorite(p.$id)}
                        className="fav-del-btn"
                        style={{ background: '#fdf2f8' }}>
                        <AnimHeart filled size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
