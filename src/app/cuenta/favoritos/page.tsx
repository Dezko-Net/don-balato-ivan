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

const PINK = '#3b82f6';
const FF = '"DM Sans",system-ui,sans-serif';

export default function FavoritosPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
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
        body { background-color: #fff !important; }
        .cl-main { background: #fff !important; }
        [style*="position: fixed"][style*="inset: 0"][style*="z-index: 0"] { display: none !important; }
        @keyframes favFadeUp { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .fav-card { animation: favFadeUp .45s cubic-bezier(.22,1,.36,1) both; }
        .fav-card:nth-child(2) { animation-delay: .05s; }
        .fav-card:nth-child(3) { animation-delay: .1s; }
        .fav-card:nth-child(4) { animation-delay: .15s; }
        .fav-card:nth-child(5) { animation-delay: .2s; }
        .fav-card:nth-child(6) { animation-delay: .25s; }
        .fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .fav-card-inner {
          background: #fff; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease, border-color 0.25s ease;
          border: 1px solid #eef2f7; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .fav-card-inner:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
          border-color: #dbeafe;
        }
        .fav-card-img { overflow: hidden; transition: transform .3s ease; }
        .fav-card-inner:hover .fav-card-img img { transform: scale(1.06); }
        .fav-card-img img { transition: transform .4s cubic-bezier(.22,1,.36,1); }
        .fav-badge {
          position: absolute; top: 10px; left: 10px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #fff; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 7px;
          box-shadow: 0 2px 8px rgba(255,65,108,0.3); backdrop-filter: blur(4px);
        }
        .fav-stock-out {
          position: absolute; inset: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center; z-index: 2;
        }
        .fav-add-btn {
          flex: 1; padding: 11px 0; border: none; border-radius: 12px; font-weight: 700; font-size: 12.5px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;
          transition: all .2s cubic-bezier(.22,1,.36,1); font-family: ${FF};
          box-shadow: 0 2px 8px rgba(59,130,246,0.2);
        }
        .fav-add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
        .fav-add-btn:active { transform: translateY(0); }
        .fav-del-btn {
          width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: all .2s; border: none; background: #f8fafc;
        }
        .fav-del-btn:hover { background: #fef2f2; transform: scale(1.05); }
        .fav-price { font-size: 17px; font-weight: 800; color: #111; letter-spacing: -0.02em; }
        .fav-price-old { font-size: 12px; color: #bbb; text-decoration: line-through; font-weight: 500; }

        @media (max-width: 768px) {
          .fav-page-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; margin-bottom: 14px !important; }
          .fav-page-header h1 { font-size: 18px !important; padding-left: 0 !important; padding-top: 0 !important; }
          .fav-page-header button { width: 100%; justify-content: center; padding: 10px !important; }
          .fav-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }
          .fav-card-inner { border-radius: 16px !important; }
          .fav-card-inner > a > div { height: 130px !important; }
          .fav-card-inner > div { padding: 10px 10px 12px !important; }
          .fav-card-inner p { font-size: 11.5px !important; line-height: 1.25 !important; }
          .fav-add-btn { padding: 10px 0 !important; font-size: 11px !important; border-radius: 10px !important; min-height: 40px !important; }
          .fav-del-btn { width: 40px !important; height: 40px !important; border-radius: 10px !important; }
          .fav-price { font-size: 15px !important; }
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
            style={{ padding: '8px 16px', background: '#eff6ff', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, color: PINK, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: FF, transition: 'background .15s' }}>
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
          <Link href="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: `linear-gradient(135deg,${PINK},#2563eb)`, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(59,130,246,0.3)', transition: 'transform .2s, box-shadow .2s', fontFamily: FF }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.3)'; }}>
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
                    <div className="fav-card-img" style={{ height: 180, background: '#f8fafc', overflow: 'hidden' }}>
                      {p.IMAGEURL
                        ? <img src={resolveStorageImageUrl(p.IMAGEURL)} alt={p.NAME} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12 }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AnimHeart filled={false} size={36} /></div>
                      }
                    </div>
                    {pct > 0 && (
                      <span className="fav-badge">-{pct}%</span>
                    )}
                    {(p.STOCK ?? 0) === 0 && (
                      <div className="fav-stock-out">
                        <span style={{ padding: '5px 14px', background: '#fff', color: '#ef4444', borderRadius: 999, fontSize: 11, fontWeight: 800, border: '1.5px solid #fee2e2' }}>Sin stock</span>
                      </div>
                    )}
                  </Link>

                  <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Link prefetch={false} href={`/productos/${p.$id}`} style={{ textDecoration: 'none' }}>
                      <p style={{ margin: '0 0 6px', fontSize: 13, color: '#333', fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color .2s' }}>{p.NAME}</p>
                    </Link>

                    <div style={{ marginBottom: 10, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      {hasDiscount && <span className="fav-price-old">{formatPrice(p.PRICE)}</span>}
                      <span className="fav-price">{formatPrice(price)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 7, marginTop: 'auto' }}>
                      <button onClick={() => handleAdd(p)}
                        className="fav-add-btn"
                        style={{ background: added === p.$id ? '#16a34a' : PINK, color: '#fff', boxShadow: added === p.$id ? '0 2px 8px rgba(22,163,74,0.25)' : '0 2px 8px rgba(59,130,246,0.2)' }}>
                        <ShoppingCart size={14} />
                        {added === p.$id ? '¡Listo!' : 'Agregar'}
                      </button>
                      <button onClick={() => toggleFavorite(p.$id)}
                        className="fav-del-btn">
                        <AnimHeart filled size={18} />
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
