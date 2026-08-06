'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingBag, User, Heart, CheckCircle, ChevronRight, Clock, Package, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStockConfirmedOrders } from '@/hooks/useStockConfirmedOrders';

const items = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Favoritos', href: '/cuenta/favoritos', icon: Heart },
  { label: 'Catálogo', href: '/productos', icon: Store },
  { label: 'Carrito', href: '/carrito', icon: ShoppingBag },
  { label: 'Cuenta', href: '/cuenta', icon: User },
];

// Pestaña activa según la ruta. "Cuenta" no debe activarse en /cuenta/favoritos
// (que es su propia pestaña).
function isItemActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/cuenta') {
    return pathname === '/cuenta' || (pathname.startsWith('/cuenta/') && !pathname.startsWith('/cuenta/favoritos'));
  }
  return pathname === href || pathname.startsWith(href + '/');
}

export default function GlobalMobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { stockConfirmedCount, firstOrderId, firstOrderStatus, firstUpdatedAt, shippedCount, shippedOrderId, shippedStatus, shippedUpdatedAt } = useStockConfirmedOrders();
  const [dismissedConfirmed, setDismissedConfirmed] = useState(false);
  const [dismissedShipped, setDismissedShipped] = useState(false);

  useEffect(() => {
    if (firstOrderId && firstOrderStatus === 'payment_confirmed') {
      const dismissed = localStorage.getItem(`pay_confirmed_${firstOrderId}_${firstUpdatedAt}`);
      setDismissedConfirmed(dismissed === '1');
    } else {
      setDismissedConfirmed(false);
    }
    if (shippedOrderId && (shippedStatus === 'shipped' || shippedStatus === 'delivered')) {
      const dismissed = localStorage.getItem(`ship_notified_${shippedOrderId}_${shippedUpdatedAt}`);
      setDismissedShipped(dismissed === '1');
    } else {
      setDismissedShipped(false);
    }
  }, [firstOrderId, firstOrderStatus, firstUpdatedAt, shippedOrderId, shippedStatus, shippedUpdatedAt]);

  const handleConfirmedClick = () => {
    if (firstOrderId) {
      localStorage.setItem(`pay_confirmed_${firstOrderId}_${firstUpdatedAt}`, '1');
      setDismissedConfirmed(true);
    }
  };

  const handleShippedClick = () => {
    if (shippedOrderId) {
      localStorage.setItem(`ship_notified_${shippedOrderId}_${shippedUpdatedAt}`, '1');
      setDismissedShipped(true);
    }
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/pos-admin') || pathname?.startsWith('/pos') || pathname?.startsWith('/erp') || pathname?.startsWith('/inventario') || pathname?.startsWith('/base-datos') || pathname?.startsWith('/control-datos') || pathname?.startsWith('/admin-supreme') || pathname?.startsWith('/checkout') || pathname?.startsWith('/catalogo') || pathname?.startsWith('/confirmar-pedido') || pathname?.startsWith('/verificar-stock') || pathname?.startsWith('/linktree')) {
    return null;
  }

  // El aviso de pago aparece en cualquier pestaña MENOS en "Mi cuenta"
  // (la sección /cuenta, excepto Favoritos que es su propia pestaña).
  // Cuando el cliente sube su comprobante, el pedido pasa de STATUS 'paid'
  // a 'payment_review' y el botón cambia a "Revisando tu pago".
  const inAccount =
    pathname === '/cuenta' ||
    (!!pathname?.startsWith('/cuenta/') && !pathname?.startsWith('/cuenta/favoritos'));
  const showPay = stockConfirmedCount > 0 && !!firstOrderId && !inAccount;

  const isPaymentReview = firstOrderStatus === 'payment_review';
  const isPaymentConfirmed = firstOrderStatus === 'payment_confirmed';
  const showPayButton = stockConfirmedCount > 0 && !!firstOrderId && !inAccount && !(isPaymentConfirmed && dismissedConfirmed);

  const isShipped = shippedStatus === 'shipped';
  const isDelivered = shippedStatus === 'delivered';
  const showShippedButton = shippedCount > 0 && !!shippedOrderId && !inAccount && !dismissedShipped;

  return (
    <>
      {/* Cinta de pago — solo modo PC (arriba, encima del navbar) */}
      {showPayButton && (
        <Link 
          className={`global-pay-ribbon${isPaymentReview ? ' global-pay-ribbon--review' : ''}${isPaymentConfirmed ? ' global-pay-ribbon--confirmed' : ''}`}
          href={`/pedido/${firstOrderId}`}
          onClick={isPaymentConfirmed ? handleConfirmedClick : undefined}
        >
          <span className="global-pay-ribbon__particles">
            <span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" />
            <span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" />
            <span className="ck-trail" /><span className="ck-trail" /><span className="ck-trail" />
          </span>
          <span className="ck-shimmer-line" />
          <span className="global-pay-ribbon__inner">
            {isPaymentConfirmed ? <CheckCircle aria-hidden="true" size={18} strokeWidth={2.4} /> : isPaymentReview ? <Clock aria-hidden="true" size={18} strokeWidth={2.4} /> : <CheckCircle aria-hidden="true" size={18} strokeWidth={2.4} />}
            <span><strong>{isPaymentConfirmed ? '¡Pago confirmado!' : isPaymentReview ? 'Revisando tu pago' : 'Pagar tu pedido'}</strong> {isPaymentConfirmed ? 'Tu pago fue verificado con éxito. Estamos preparando tu envío.' : isPaymentReview ? 'Hemos recibido tu comprobante, estamos verificando.' : 'Completa la transferencia para que preparemos tu envío.'}</span>
            {stockConfirmedCount > 1 && !isPaymentConfirmed && (
              <span className="global-pay-ribbon__count">{stockConfirmedCount}</span>
            )}
            <ChevronRight aria-hidden="true" size={18} strokeWidth={2.4} />
          </span>
        </Link>
      )}

      {/* Cinta de envío — solo modo PC (debajo de la cinta de pago) */}
      {showShippedButton && (
        <Link
          className={`global-pay-ribbon global-pay-ribbon--shipped${isDelivered ? ' global-pay-ribbon--delivered' : ''}`}
          href={`/pedido/${shippedOrderId}`}
          onClick={handleShippedClick}
          style={{ top: showPayButton ? '44px' : '0px' }}
        >
          <span className="global-pay-ribbon__particles">
            <span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" />
            <span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" />
            <span className="ck-trail" /><span className="ck-trail" /><span className="ck-trail" />
          </span>
          <span className="ck-shimmer-line" />
          <span className="global-pay-ribbon__inner">
            {isDelivered ? <Truck aria-hidden="true" size={18} strokeWidth={2.4} /> : <Package aria-hidden="true" size={18} strokeWidth={2.4} />}
            <span><strong>{isDelivered ? '¡Entregado a la agencia!' : '¡Pedido embalado!'}</strong> {isDelivered ? 'Tu pedido fue entregado a la agencia de transporte.' : 'Tu pedido fue embalado y está listo para despacho.'}</span>
            <ChevronRight aria-hidden="true" size={18} strokeWidth={2.4} />
          </span>
        </Link>
      )}

      <nav className="global-mobile-nav" aria-label="Navegación móvil">
        {items.map(({ label, href, icon: Icon }) => {
          // En móvil, la pestaña "Cuenta" se convierte en el botón de pago
          // (salvo cuando estás en tu cuenta, donde vuelve a ser "Cuenta").
          if (label === 'Cuenta' && showPayButton) {
            return (
              <Link 
                key="pay" 
                className={`global-mobile-nav__pay${isPaymentReview ? ' global-mobile-nav__pay--review' : ''}${isPaymentConfirmed ? ' global-mobile-nav__pay--confirmed' : ''}`}
                href={`/pedido/${firstOrderId}`}
                onClick={isPaymentConfirmed ? handleConfirmedClick : undefined}
              >
                <span className="global-mobile-nav__pay-particles">
                  <span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" />
                  <span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" />
                </span>
                <span className="ck-shimmer-line" />
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isPaymentConfirmed ? <CheckCircle aria-hidden="true" size={18} strokeWidth={2.4} /> : isPaymentReview ? <Clock aria-hidden="true" size={18} strokeWidth={2.4} /> : <CheckCircle aria-hidden="true" size={18} strokeWidth={2.4} />}
                  <span>{isPaymentConfirmed ? 'Pago confirmado' : isPaymentReview ? 'Revisando tu pago' : 'Pagar tu pedido'}</span>
                </span>
              </Link>
            );
          }
          if (label === 'Cuenta' && showShippedButton) {
            return (
              <Link
                key="ship"
                className={`global-mobile-nav__pay global-mobile-nav__pay--shipped${isDelivered ? ' global-mobile-nav__pay--delivered' : ''}`}
                href={`/pedido/${shippedOrderId}`}
                onClick={handleShippedClick}
              >
                <span className="global-mobile-nav__pay-particles">
                  <span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" /><span className="ck-orb" />
                  <span className="ck-sparkle" /><span className="ck-sparkle" /><span className="ck-sparkle" />
                </span>
                <span className="ck-shimmer-line" />
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isDelivered ? <Truck aria-hidden="true" size={18} strokeWidth={2.4} /> : <Package aria-hidden="true" size={18} strokeWidth={2.4} />}
                  <span>{isDelivered ? 'Entregado a agencia' : 'Pedido embalado'}</span>
                </span>
              </Link>
            );
          }
          const active = isItemActive(href, pathname || '/');
          return (
            <Link
              key={label}
              className={`global-mobile-nav__item${active ? ' is-active' : ''}`}
              href={href}
              aria-current={active ? 'page' : undefined}
            >
              <span className="global-mobile-nav__icon">
                <Icon aria-hidden="true" size={20} strokeWidth={active ? 2.4 : 1.8} />
                {label === 'Carrito' && totalItems > 0 && (
                  // key={totalItems} → el badge re-monta y hace "pop" cada vez que cambia la cantidad
                  <span key={totalItems} className="global-mobile-nav__badge">{totalItems > 99 ? '99+' : totalItems}</span>
                )}
              </span>
              <span className="global-mobile-nav__label">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* En PC, reservar espacio arriba para la(s) cinta(s) fija(s) */}
      {showPay && showShippedButton && <style>{`@media (min-width: 900px) { body { padding-top: 88px !important; } }`}</style>}
      {showPay && !showShippedButton && <style>{`@media (min-width: 900px) { body { padding-top: 44px !important; } }`}</style>}
      {!showPay && showShippedButton && <style>{`@media (min-width: 900px) { body { padding-top: 44px !important; } }`}</style>}

      <style>{`
        .global-mobile-nav {
          display: flex !important; flex-direction: row !important; position: fixed !important;
          z-index: 2147483000 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
          width: 100vw !important; max-width: 100vw !important; height: 64px !important;
          align-items: stretch !important; justify-content: space-around !important;
          padding: 8px 6px max(8px, env(safe-area-inset-bottom)) !important;
          margin: 0 !important; background: #fff !important;
          border-top: 1px solid rgba(0,0,0,.06) !important;
          border-radius: 20px 20px 0 0 !important;
          box-shadow: 0 -6px 24px rgba(15,23,42,.10) !important; box-sizing: border-box !important;
          animation: navSlideUp .45s cubic-bezier(.16,1,.3,1) both !important;
        }
        @keyframes navSlideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .global-mobile-nav__item {
          position: relative !important;
          display: flex !important; flex: 1 1 0 !important; flex-direction: column !important;
          align-items: center !important; justify-content: center !important; min-width: 0 !important;
          gap: 3px !important; color: #9ca3af !important; text-decoration: none !important;
          font-size: 10px !important; font-weight: 500 !important; line-height: 1 !important;
          background: transparent !important; border: 0 !important; padding: 0 !important;
          -webkit-tap-highlight-color: transparent !important;
          transition: color .25s ease, transform .12s ease !important;
        }
        /* Barra indicadora superior que crece en la pestaña activa */
        .global-mobile-nav__item::before {
          content: '' !important; position: absolute !important; top: -1px !important; left: 50% !important;
          width: 0 !important; height: 3px !important; border-radius: 999px !important;
          background: linear-gradient(90deg,#2563eb,#0ea5e9) !important;
          transform: translateX(-50%) !important;
          transition: width .35s cubic-bezier(.34,1.56,.64,1) !important;
          pointer-events: none !important;
        }
        .global-mobile-nav__item.is-active::before { width: 26px !important; }
        /* Destello tipo ripple al presionar */
        .global-mobile-nav__item::after {
          content: '' !important; position: absolute !important; top: 4px !important; left: 50% !important;
          width: 46px !important; height: 34px !important; margin-left: -23px !important; border-radius: 14px !important;
          background: radial-gradient(circle, rgba(37,99,235,.20), transparent 70%) !important;
          opacity: 0 !important; transform: scale(.4) !important;
          transition: opacity .35s ease, transform .35s ease !important; pointer-events: none !important;
        }
        .global-mobile-nav__item:active::after { opacity: 1 !important; transform: scale(1) !important; transition: none !important; }
        .global-mobile-nav__item:active { transform: scale(.9) !important; }
        .global-mobile-nav__item svg { display: block !important; width: 20px !important; height: 20px !important; transition: color .25s ease !important; }
        /* Contenedor del ícono: pill que aparece detrás cuando está activo */
        .global-mobile-nav__icon {
          position: relative !important; display: inline-flex !important;
          align-items: center !important; justify-content: center !important;
          width: 46px !important; height: 30px !important; border-radius: 12px !important;
          background: transparent !important;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), background .25s ease !important;
        }
        .global-mobile-nav__label { transition: color .25s ease !important; }
        /* Estado ACTIVO */
        .global-mobile-nav__item.is-active { color: #2563eb !important; }
        .global-mobile-nav__item.is-active .global-mobile-nav__label { color: #2563eb !important; font-weight: 700 !important; }
        .global-mobile-nav__item.is-active svg { color: #2563eb !important; }
        .global-mobile-nav__item.is-active .global-mobile-nav__icon {
          background: #eff6ff !important;
          transform: translateY(-3px) scale(1.05) !important;
          animation: navIconPop .45s cubic-bezier(.34,1.56,.64,1) !important;
        }
        @keyframes navIconPop {
          0%   { transform: translateY(0) scale(.8); }
          55%  { transform: translateY(-6px) scale(1.2); }
          100% { transform: translateY(-3px) scale(1.05); }
        }
        /* Botón de pago dentro del navbar inferior (móvil) */
        .global-mobile-nav__pay {
          display: flex !important; flex: 1.9 1 0 !important; flex-direction: row !important;
          align-items: center !important; justify-content: center !important; gap: 6px !important;
          min-width: 0 !important; margin: 2px 4px !important; padding: 0 8px !important;
          border-radius: 999px !important; text-decoration: none !important;
          color: #fff !important; font-size: 12px !important; font-weight: 800 !important;
          line-height: 1.05 !important; text-align: center !important;
          background: linear-gradient(135deg,#f59e0b,#d97706,#f59e0b,#d97706,#f59e0b) !important;
          transition: transform .15s ease !important;
        }
        .global-mobile-nav__pay:active { transform: scale(0.95) !important; }
        .global-mobile-nav__pay--review { animation: navPayPulseBlue 2.2s ease-in-out infinite !important; }
        @keyframes navPayPulseBlue {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,.5) !important; }
          50%      { box-shadow: 0 0 0 7px rgba(37,99,235,0) !important; }
        }
        .global-mobile-nav__pay--review {
          background: linear-gradient(135deg,#2563eb,#1d4ed8,#2563eb,#1d4ed8,#2563eb) !important;
        }
        .global-mobile-nav__pay--confirmed {
          background: linear-gradient(135deg,#22c55e,#16a34a,#22c55e,#16a34a,#22c55e) !important;
        }
        .global-mobile-nav__pay--shipped {
          background: linear-gradient(135deg,#8b5cf6,#7c3aed,#8b5cf6,#7c3aed,#8b5cf6) !important;
          animation: navPayPulsePurple 2.2s ease-in-out infinite !important;
        }
        @keyframes navPayPulsePurple {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,.5) !important; }
          50%      { box-shadow: 0 0 0 7px rgba(139,92,246,0) !important; }
        }
        .global-mobile-nav__pay--delivered {
          background: linear-gradient(135deg,#0891b2,#0e7490,#0891b2,#0e7490,#0891b2) !important;
          animation: navPayPulseCyan 2.2s ease-in-out infinite !important;
        }
        @keyframes navPayPulseCyan {
          0%, 100% { box-shadow: 0 0 0 0 rgba(8,145,178,.5) !important; }
          50%      { box-shadow: 0 0 0 7px rgba(8,145,178,0) !important; }
        }
        .global-mobile-nav__pay svg { flex-shrink: 0 !important; }
        .global-mobile-nav__pay span { white-space: normal !important; }
        .global-mobile-nav__badge {
          position: absolute !important; top: -4px !important; right: -2px !important;
          min-width: 16px !important; height: 16px !important; padding: 0 4px !important;
          border-radius: 999px !important; background: linear-gradient(135deg,#2563eb,#0ea5e9) !important; color: #fff !important;
          font-size: 10px !important; font-weight: 800 !important; line-height: 16px !important;
          text-align: center !important; box-shadow: 0 2px 6px rgba(37,99,235,0.45) !important;
          border: 1.5px solid #fff !important;
          animation: navBadgePop .4s cubic-bezier(.34,1.56,.64,1) !important;
        }
        @keyframes navBadgePop {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        /* Cinta de pago (PC) — oculta en móvil, visible >= 900px */
        .global-pay-ribbon {
          display: none !important; position: fixed !important; z-index: 2147483001 !important;
          top: 0 !important; left: 0 !important; right: 0 !important;
          width: 100vw !important; max-width: 100vw !important; height: 44px !important;
          align-items: center !important; justify-content: center !important; box-sizing: border-box !important;
          padding: 0 20px !important; text-decoration: none !important; color: #fff !important;
          background: linear-gradient(135deg,#f59e0b,#d97706,#f59e0b,#d97706,#f59e0b) !important;
          box-shadow: 0 2px 12px rgba(245,158,11,.35) !important;
        }
        .global-pay-ribbon:hover { filter: brightness(1.03) !important; }
        .global-pay-ribbon--review {
          background: linear-gradient(135deg,#2563eb,#1d4ed8,#2563eb,#1d4ed8,#2563eb) !important;
          box-shadow: 0 2px 12px rgba(37,99,235,.35) !important;
        }
        .global-pay-ribbon--confirmed {
          background: linear-gradient(135deg,#22c55e,#16a34a,#22c55e,#16a34a,#22c55e) !important;
          box-shadow: 0 2px 12px rgba(22,163,74,.35) !important;
        }
        .global-pay-ribbon--shipped {
          background: linear-gradient(135deg,#8b5cf6,#7c3aed,#8b5cf6,#7c3aed,#8b5cf6) !important;
          box-shadow: 0 2px 12px rgba(139,92,246,.35) !important;
        }
        .global-pay-ribbon--delivered {
          background: linear-gradient(135deg,#0891b2,#0e7490,#0891b2,#0e7490,#0891b2) !important;
          box-shadow: 0 2px 12px rgba(8,145,178,.35) !important;
        }
        .global-pay-ribbon__inner {
          display: inline-flex !important; align-items: center !important; gap: 10px !important;
          font-size: 14px !important; font-weight: 600 !important; line-height: 1 !important;
        }
        .global-pay-ribbon__inner strong { font-weight: 800 !important; }
        .global-pay-ribbon__count {
          display: inline-flex !important; align-items: center !important; justify-content: center !important;
          min-width: 20px !important; height: 20px !important; padding: 0 6px !important;
          border-radius: 999px !important; background: rgba(255,255,255,.25) !important;
          font-size: 12px !important; font-weight: 800 !important;
        }
        /* ── Particles (orbs, sparkles, trails, shimmer) ── */
        .global-pay-ribbon { overflow: hidden !important; background-size: 300% 300% !important; animation: ckBtnShift 3s ease infinite !important; }
        .global-pay-ribbon__particles { position: absolute !important; inset: 0 !important; overflow: hidden !important; pointer-events: none !important; }
        .global-mobile-nav__pay { overflow: hidden !important; position: relative !important; background-size: 300% 300% !important; }
        .global-mobile-nav__pay { animation: ckBtnShift 3s ease infinite, navPayPulse 2.2s ease-in-out infinite !important; }
        .global-mobile-nav__pay--review { animation: ckBtnShift 3s ease infinite, navPayPulseBlue 2.2s ease-in-out infinite !important; }
        .global-mobile-nav__pay--confirmed { animation: ckBtnShift 3s ease infinite, navPayPulse 2.2s ease-in-out infinite !important; }
        .global-mobile-nav__pay--shipped { animation: ckBtnShift 3s ease infinite, navPayPulsePurple 2.2s ease-in-out infinite !important; }
        .global-mobile-nav__pay--delivered { animation: ckBtnShift 3s ease infinite, navPayPulseCyan 2.2s ease-in-out infinite !important; }
        .global-mobile-nav__pay-particles { position: absolute !important; inset: 0 !important; overflow: hidden !important; pointer-events: none !important; }
        .ck-shimmer-line {
          position: absolute !important; top: 0 !important; bottom: 0 !important;
          width: 40% !important;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent) !important;
          animation: ckShimmer 2.5s ease-in-out infinite !important;
          pointer-events: none !important; z-index: 1 !important;
        }
        .ck-orb {
          position: absolute !important; border-radius: 50% !important;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.1)) !important;
          box-shadow: 0 0 6px rgba(255,255,255,0.5) !important;
          animation: ckOrbFloat 2.8s ease-in-out infinite !important;
        }
        .ck-orb:nth-child(1) { width: 8px !important; height: 8px !important; left: 8% !important; bottom: 4px !important; animation-delay: 0s !important; }
        .ck-orb:nth-child(2) { width: 5px !important; height: 5px !important; left: 22% !important; bottom: 2px !important; animation-delay: 0.4s !important; }
        .ck-orb:nth-child(3) { width: 10px !important; height: 10px !important; left: 38% !important; bottom: 6px !important; animation-delay: 0.8s !important; }
        .ck-orb:nth-child(4) { width: 6px !important; height: 6px !important; left: 52% !important; bottom: 3px !important; animation-delay: 1.2s !important; }
        .ck-orb:nth-child(5) { width: 7px !important; height: 7px !important; left: 68% !important; bottom: 5px !important; animation-delay: 1.6s !important; }
        .ck-orb:nth-child(6) { width: 4px !important; height: 4px !important; left: 82% !important; bottom: 2px !important; animation-delay: 2s !important; }
        .ck-orb:nth-child(7) { width: 9px !important; height: 9px !important; left: 92% !important; bottom: 4px !important; animation-delay: 2.4s !important; }
        .ck-sparkle {
          position: absolute !important; width: 4px !important; height: 4px !important;
          background: white !important;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) !important;
          animation: ckSparkle 2s ease-in-out infinite !important;
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8)) !important;
        }
        .ck-sparkle:nth-child(8) { left: 15% !important; top: 30% !important; animation-delay: 0s !important; }
        .ck-sparkle:nth-child(9) { left: 45% !important; top: 20% !important; animation-delay: 0.7s !important; width: 5px !important; height: 5px !important; }
        .ck-sparkle:nth-child(10) { left: 75% !important; top: 40% !important; animation-delay: 1.4s !important; }
        .ck-sparkle:nth-child(11) { left: 30% !important; top: 55% !important; animation-delay: 0.3s !important; width: 3px !important; height: 3px !important; }
        .ck-sparkle:nth-child(12) { left: 60% !important; top: 15% !important; animation-delay: 1s !important; }
        .ck-trail {
          position: absolute !important; height: 2px !important; width: 20px !important;
          border-radius: 2px !important;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent) !important;
          animation: ckTrail 2.5s ease-in-out infinite !important;
        }
        .ck-trail:nth-child(13) { left: 5% !important; top: 45% !important; animation-delay: 0s !important; }
        .ck-trail:nth-child(14) { left: 35% !important; top: 35% !important; animation-delay: 0.8s !important; }
        .ck-trail:nth-child(15) { left: 65% !important; top: 50% !important; animation-delay: 1.6s !important; }
        @keyframes ckBtnShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes ckOrbFloat { 0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; } 10% { opacity: 0.9; } 50% { transform: translateY(-22px) translateX(8px) scale(1.4); opacity: 1; } 90% { opacity: 0.7; } 100% { transform: translateY(-44px) translateX(-4px) scale(0.6); opacity: 0; } }
        @keyframes ckSparkle { 0% { transform: scale(0) rotate(0deg); opacity: 0; } 20% { transform: scale(1.2) rotate(90deg); opacity: 1; } 50% { transform: scale(0.8) rotate(180deg); opacity: 0.8; } 80% { transform: scale(1.1) rotate(270deg); opacity: 0.5; } 100% { transform: scale(0) rotate(360deg); opacity: 0; } }
        @keyframes ckTrail { 0% { transform: translateX(0) scaleX(1); opacity: 0.8; } 50% { transform: translateX(20px) scaleX(1.5); opacity: 0.4; } 100% { transform: translateX(40px) scaleX(0); opacity: 0; } }
        @keyframes ckShimmer { 0% { left: -40%; } 100% { left: 110%; } }
        @keyframes navPayPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,.5) !important; } 50% { box-shadow: 0 0 0 7px rgba(245,158,11,0) !important; } }
        @media (max-width: 899px) {
          body { padding-bottom: 64px !important; }
          footer-group, .footer-group, footer { padding-bottom: 64px !important; }
          .nb23-tabbar { display: none !important; }
        }
        @media (min-width: 900px) {
          .global-mobile-nav { display: none !important; }
          .global-pay-ribbon { display: flex !important; }
        }
        /* Accesibilidad: sin animaciones si el usuario lo pide */
        @media (prefers-reduced-motion: reduce) {
          .global-mobile-nav,
          .global-mobile-nav__item,
          .global-mobile-nav__icon,
          .global-mobile-nav__badge,
          .global-mobile-nav__pay,
          .global-mobile-nav__pay--review,
          .global-mobile-nav__item::before,
          .global-mobile-nav__item::after {
            animation: none !important;
            transition: color .2s ease, background .2s ease !important;
          }
        }
      `}</style>
    </>
  );
}
