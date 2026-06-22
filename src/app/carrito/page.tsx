'use client';

import Link from 'next/link';
import { ShoppingCart, Truck, Shield, ChevronRight, ArrowLeft, Sparkles, Package } from 'lucide-react';
import LottieCart from '@/components/LottieCart';
import { useCart } from '@/context/CartContext';
import { formatPrice, getServices, getAppwriteConfig, ORDERS_COLLECTION } from '@/lib/appwrite';
import RecentlyViewed from '@/components/RecentlyViewed';
import CartLineRow from '@/components/CartLineRow';
import DynamicCart from '@/components/DynamicCart';
import { MINIMUM_ORDER_CLP, isBelowMinimumOrder, minimumOrderMessage } from '@/lib/order-rules';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Query } from 'appwrite';
import { useState, useEffect } from 'react';

const PINK = '#e396bf';
const FF = '"DM Sans",system-ui,sans-serif';

function CarritoPageContent() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, aperturaSavings, getEffectivePrice, clearCart } = useCart();

  const belowMinimum = isBelowMinimumOrder(subtotal);

  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addingToOrder, setAddingToOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setPendingOrders([]);
      return;
    }

    (async () => {
      setLoadingOrders(true);
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();

        // 1. Try USERID
        let res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
          Query.equal('USERID', user.id),
          Query.orderDesc('$createdAt'),
          Query.limit(50),
        ]);

        // 2. Try CUSTOMEREMAIL
        if (res.documents.length === 0 && user.email) {
          res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
            Query.equal('CUSTOMEREMAIL', user.email),
            Query.orderDesc('$createdAt'),
            Query.limit(50),
          ]);
        }

        // 3. Fallback to userId
        if (res.documents.length === 0) {
          res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
            Query.equal('userId', user.id),
            Query.orderDesc('$createdAt'),
            Query.limit(50),
          ]);
        }

        // Filter status === 'pending' in memory to bypass Appwrite composite index restrictions
        const pending = res.documents.filter((doc: any) => doc.STATUS === 'pending');
        setPendingOrders(pending);
      } catch (err) {
        console.error('Error fetching pending orders for cart:', err);
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, [isLoggedIn, user]);

  const handleAddToOrder = async (orderDoc: any) => {
    if (items.length === 0 || addingToOrder) return;

    if (!confirm(`¿Estás seguro que deseas añadir los productos de tu carrito al pedido #${orderDoc.ORDERCODE}?`)) {
      return;
    }

    setAddingToOrder(orderDoc.$id);
    try {
      let currentItems: any[] = [];
      try {
        currentItems = JSON.parse(orderDoc.ITEMS || '[]');
      } catch {}

      const mergedItems = [...currentItems];

      for (const cartItem of items) {
        const existingIdx = mergedItems.findIndex(it => it.id === cartItem.product.$id);
        if (existingIdx >= 0) {
          const prev = mergedItems[existingIdx];
          const nextQty = (prev.qty || 1) + cartItem.quantity;
          mergedItems[existingIdx] = {
            ...prev,
            qty: nextQty,
            total: prev.price * nextQty
          };
        } else {
          const price = getEffectivePrice(cartItem);
          mergedItems.push({
            id: cartItem.product.$id,
            name: cartItem.product.NAME,
            price: price,
            qty: cartItem.quantity,
            img: cartItem.product.IMAGEURL || '',
            total: price * cartItem.quantity,
            sku: cartItem.product.SKU || ''
          });
        }
      }

      const res = await fetch('/api/public-data/edit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderDoc.$id,
          draftItems: mergedItems
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Error al actualizar el pedido pendiente.');
      }

      clearCart();
      router.push(`/pedido/${orderDoc.$id}`);
      alert(`¡Productos añadidos con éxito al pedido #${orderDoc.ORDERCODE}!`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Ocurrió un error al añadir los productos al pedido.');
    } finally {
      setAddingToOrder(null);
    }
  };

  /* ── EMPTY STATE ── */
  if (totalItems === 0) return (
    <>
      <style>{`
        @keyframes cartFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .cart-empty-card { animation: cartFadeUp .5s ease both; }
        .cart-empty-card:nth-child(2) { animation-delay: .1s; }
        @media (max-width: 768px) {
          .cart-page-wrap { padding: 12px 12px calc(72px + env(safe-area-inset-bottom, 0px)) !important; }
          .cart-empty-layout { flex-direction: column !important; gap: 12px !important; }
          .cart-empty-main { flex-direction: column !important; text-align: center !important; padding: 32px 20px 28px !important; min-width: 0 !important; width: 100% !important; border-radius: 20px !important; gap: 16px !important; }
          .cart-empty-main > div:first-child { margin: 0 auto !important; width: 100px !important; height: 100px !important; }
          .cart-empty-main p:first-child { font-size: 20px !important; }
          .cart-empty-main p:nth-child(2) { font-size: 14px !important; }
          .cart-empty-summary { width: 100% !important; border-radius: 20px !important; padding: 20px 18px !important; }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: FF }}>
        <div className="cart-page-wrap" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '24px 5%', minHeight: '100vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 20 }}>
            <Link href="/" style={{ color: PINK, textDecoration: 'none', fontWeight: 500 }}>Inicio</Link>
            <ChevronRight size={12} color="#9ca3af" />
            <span style={{ color: '#6b7280' }}>Carrito de compras</span>
          </div>

          <div className="cart-empty-layout" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div className="cart-empty-main cart-empty-card" style={{ flex: 1, minWidth: 300, background: '#fff', borderRadius: 20, padding: '48px 36px', display: 'flex', alignItems: 'center', gap: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <LottieCart size={140} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Tu carrito está vacío</p>
                <p style={{ margin: '0 0 20px', fontSize: 15, color: '#6b7280', lineHeight: 1.55 }}>Agrega productos y consigue envío gratis en tu primera compra.</p>
                <Link href="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: `linear-gradient(135deg,${PINK},#c0547a)`, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px rgba(227,150,191,0.3)', transition: 'transform .2s, box-shadow .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(227,150,191,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(227,150,191,0.3)'; }}>
                  <ShoppingCart size={16} /> Explorar productos
                </Link>
              </div>
            </div>
            <div className="cart-empty-summary cart-empty-card" style={{ width: 280, flexShrink: 0, background: '#fff', borderRadius: 20, padding: '24px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <p style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Resumen de compra</p>
              <p style={{ margin: 0, fontSize: 14, color: '#9ca3af', lineHeight: 1.5 }}>Aquí verás los importes de tu compra una vez que agregues productos.</p>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <RecentlyViewed />
          </div>
        </div>
      </div>
    </>
  );

  /* ── FILLED STATE ── */
  return (
    <>
      <style>{`
        @keyframes cartSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .cart-items-box { animation: cartSlideUp .4s ease both; }
        .cart-summary-col > div { animation: cartSlideUp .4s ease both; }
        .cart-summary-col > div:nth-child(2) { animation-delay: .08s; }
        .cart-summary-col > div:nth-child(3) { animation-delay: .16s; }

        @media (max-width: 768px) {
          .cart-page-wrap { padding: 12px 12px calc(72px + env(safe-area-inset-bottom, 0px)) !important; }
          .cart-layout { flex-direction: column !important; gap: 10px !important; }
          .cart-items-col { min-width: 0 !important; width: 100% !important; }
          .cart-summary-col { width: 100% !important; max-width: none !important; }
          .cart-shipping-banner { padding: 10px 14px !important; font-size: 13px !important; border-radius: 14px !important; }
          .cart-items-box { padding: 0 14px !important; border-radius: 18px !important; }
          .cart-items-box h1 { font-size: 17px !important; }
          .cart-summary-card { padding: 14px 14px !important; border-radius: 16px !important; }
          .cart-summary-card h2 { font-size: 15px !important; margin: 0 0 8px !important; }
          .cart-summary-card .cart-total-row span:last-child { font-size: 20px !important; }
          .cart-coupon-card { padding: 12px 14px !important; border-radius: 16px !important; }
        }
        /* Checkout button particles */
        @keyframes cartOrbFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.9; }
          50% { transform: translateY(-22px) translateX(8px) scale(1.4); opacity: 1; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-44px) translateX(-4px) scale(0.6); opacity: 0; }
        }
        @keyframes cartSparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          20% { transform: scale(1.2) rotate(90deg); opacity: 1; }
          50% { transform: scale(0.8) rotate(180deg); opacity: 0.8; }
          80% { transform: scale(1.1) rotate(270deg); opacity: 0.5; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes cartShimmer { 0% { left: -40%; } 100% { left: 110%; } }
        @keyframes cartPulse {
          0%, 100% { box-shadow: 0 6px 20px rgba(227,150,191,0.35), inset 0 0 12px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 6px 20px rgba(227,150,191,0.55), inset 0 0 20px rgba(255,255,255,0.2); }
        }
        .cart-checkout-btn { animation: cartPulse 2s ease-in-out infinite; position: relative; overflow: hidden; }
        .cart-checkout-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 32px rgba(227,150,191,0.35), inset 0 0 20px rgba(255,255,255,0.15); }
        .cart-orb {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.1));
          box-shadow: 0 0 6px rgba(255,255,255,0.5);
          animation: cartOrbFloat 2.8s ease-in-out infinite;
        }
        .cart-orb:nth-child(1) { width: 8px; height: 8px; left: 8%; bottom: 4px; animation-delay: 0s; }
        .cart-orb:nth-child(2) { width: 5px; height: 5px; left: 22%; bottom: 2px; animation-delay: 0.4s; }
        .cart-orb:nth-child(3) { width: 10px; height: 10px; left: 38%; bottom: 6px; animation-delay: 0.8s; }
        .cart-orb:nth-child(4) { width: 6px; height: 6px; left: 52%; bottom: 3px; animation-delay: 1.2s; }
        .cart-orb:nth-child(5) { width: 7px; height: 7px; left: 68%; bottom: 5px; animation-delay: 1.6s; }
        .cart-orb:nth-child(6) { width: 4px; height: 4px; left: 82%; bottom: 2px; animation-delay: 2s; }
        .cart-orb:nth-child(7) { width: 9px; height: 9px; left: 92%; bottom: 4px; animation-delay: 2.4s; }
        .cart-sparkle {
          position: absolute; width: 4px; height: 4px; background: white;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: cartSparkle 2s ease-in-out infinite;
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
        }
        .cart-sparkle:nth-child(8) { left: 15%; top: 30%; animation-delay: 0s; }
        .cart-sparkle:nth-child(9) { left: 45%; top: 20%; animation-delay: 0.7s; width: 5px; height: 5px; }
        .cart-sparkle:nth-child(10) { left: 75%; top: 40%; animation-delay: 1.4s; }
        .cart-sparkle:nth-child(11) { left: 30%; top: 55%; animation-delay: 0.3s; width: 3px; height: 3px; }
        .cart-sparkle:nth-child(12) { left: 60%; top: 15%; animation-delay: 1s; }
        .cart-shimmer-line {
          position: absolute; top: 0; bottom: 0; width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: cartShimmer 2.5s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: FF }}>
        <div className="cart-page-wrap" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '24px 5%' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 16 }}>
            <Link href="/" style={{ color: PINK, textDecoration: 'none', fontWeight: 500 }}>Inicio</Link>
            <ChevronRight size={12} color="#9ca3af" />
            <span style={{ color: '#6b7280' }}>Carrito de compras</span>
          </div>

          <div className="cart-layout" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* ── LEFT: items ── */}
            <div className="cart-items-col" style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>

              <div className="cart-shipping-banner" style={{ background: '#fff', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={15} color={PINK} />
                </div>
                <span style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500 }}>Envío disponible a todo Chile</span>
              </div>

              <div className="cart-items-box" style={{ background: '#fff', borderRadius: 18, padding: '0 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '16px 0 12px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
                    <ShoppingCart size={18} color={PINK} />
                    {totalItems === 1 ? '1 producto' : `${totalItems} productos`}
                  </h1>
                </div>

                {items.map((item, idx) => (
                  <CartLineRow
                    key={`${item.product.$id}_${idx}`}
                    item={item}
                    onUpdateQty={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* ── RIGHT: summary ── */}
            <div className="cart-summary-col" style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

              <div className="cart-summary-card" style={{ background: '#fff', borderRadius: 18, padding: '20px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.01em' }}>Resumen de compra</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: '#6b7280' }}>Productos ({totalItems})</span>
                  <span style={{ color: '#1a1a1a', fontWeight: 600 }}>{formatPrice(subtotal + aperturaSavings)}</span>
                </div>

                {aperturaSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: '#be185d', display: 'flex', alignItems: 'center', gap: 4 }}><Sparkles size={12} /> Promoción apertura</span>
                    <span style={{ color: '#be185d', fontWeight: 700 }}>-{formatPrice(aperturaSavings)}</span>
                  </div>
                )}

                <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontSize: 26, fontWeight: 800, color: PINK, letterSpacing: '-0.02em' }}>{formatPrice(subtotal)}</span>
                </div>

                {belowMinimum && (
                  <p style={{ margin: '0 0 12px', fontSize: 12, color: '#b91c1c', background: '#fef2f2', padding: '10px 12px', borderRadius: 10, border: '1px solid #fecaca', lineHeight: 1.45 }}>
                    ⚠ {minimumOrderMessage(subtotal)}
                  </p>
                )}

                {/* Pedidos pendientes */}
                {pendingOrders.length > 0 && (
                  <div style={{ borderTop: '1px dashed #f3f4f6', paddingTop: 14, marginBottom: 14 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Package size={14} color={PINK} /> ¿Añadir a un pedido pendiente?
                    </p>
                    <p style={{ margin: '0 0 10px', fontSize: 10, color: '#6b7280', lineHeight: 1.4 }}>
                      Tienes pedidos pendientes. Puedes consolidar esta compra añadiendo estos productos a uno de ellos:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {pendingOrders.map((order) => (
                        <button
                          key={order.$id}
                          onClick={() => handleAddToOrder(order)}
                          disabled={addingToOrder !== null}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            background: '#fff',
                            border: '1px solid #fce7f3',
                            borderRadius: 10,
                            textAlign: 'left',
                            fontSize: 11,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.background = '#fdf2f8'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#fce7f3'; e.currentTarget.style.background = '#fff'; }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ color: '#111827' }}>#{order.ORDERCODE}</strong>
                            <span style={{ display: 'block', fontSize: 9, color: '#9ca3af', marginTop: 1 }}>
                              Total actual: {formatPrice(order.TOTAL)}
                            </span>
                          </div>
                          <span style={{ fontSize: 9, fontWeight: 800, color: PINK, background: '#fdf2f8', padding: '3px 8px', borderRadius: 6, marginLeft: 6 }}>
                            {addingToOrder === order.$id ? '...' : '+ Añadir'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {belowMinimum ? (
                  <span
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 0', background: '#e5e7eb', color: '#9ca3af', textAlign: 'center', borderRadius: 12, fontSize: 15, fontWeight: 700, boxSizing: 'border-box', cursor: 'not-allowed' }}
                  >
                    Mínimo {formatPrice(MINIMUM_ORDER_CLP)}
                  </span>
                ) : typeof document !== 'undefined' && document.cookie.includes('user_country=AR') ? (
                  <button
                    disabled
                    className="cart-checkout-btn"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '15px 0', background: '#ccc', color: '#666', textAlign: 'center', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxSizing: 'border-box', cursor: 'not-allowed' }}
                  >
                    Ventas no disponibles en Argentina
                  </button>
                ) : (
                  <Link href="/checkout"
                    className="cart-checkout-btn"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '15px 0', background: `linear-gradient(135deg,${PINK},#c0547a)`, color: '#fff', textAlign: 'center', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxSizing: 'border-box', boxShadow: '0 6px 20px rgba(227,150,191,0.35)', transition: 'all 0.2s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                  >
                    <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                      <span className="cart-orb" /><span className="cart-orb" /><span className="cart-orb" /><span className="cart-orb" /><span className="cart-orb" /><span className="cart-orb" /><span className="cart-orb" />
                      <span className="cart-sparkle" /><span className="cart-sparkle" /><span className="cart-sparkle" /><span className="cart-sparkle" /><span className="cart-sparkle" />
                    </span>
                    <span className="cart-shimmer-line" />
                    <span style={{ position: 'relative', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>Continuar compra</span>
                  </Link>
                )}

                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '10px 12px', borderRadius: 10 }}>
                  <Shield size={14} color={PINK} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>
                    <strong style={{ color: PINK }}>Compra Protegida</strong> — recibe el producto o te devolvemos el dinero.
                  </span>
                </div>
              </div>


              <Link href="/productos" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: PINK, textDecoration: 'none', padding: '8px 0', fontWeight: 600 }}>
                <ArrowLeft size={14} /> Seguir comprando
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function CarritoPage() {
  return (
    <DynamicCart>
      <CarritoPageContent />
    </DynamicCart>
  );
}
