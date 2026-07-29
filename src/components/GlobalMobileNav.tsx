'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingBag, User, Heart, CheckCircle, ChevronRight, Clock } from 'lucide-react';
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
  const { stockConfirmedCount, firstOrderId, firstOrderStatus } = useStockConfirmedOrders();
  const [dismissedConfirmed, setDismissedConfirmed] = useState(false);

  useEffect(() => {
    if (firstOrderId && firstOrderStatus === 'payment_confirmed') {
      const dismissed = localStorage.getItem(`pay_confirmed_${firstOrderId}`);
      if (dismissed === '1') setDismissedConfirmed(true);
      else setDismissedConfirmed(false);
    } else {
      setDismissedConfirmed(false);
    }
  }, [firstOrderId, firstOrderStatus]);

  const handleConfirmedClick = (e: React.MouseEvent) => {
    if (firstOrderId) {
      localStorage.setItem(`pay_confirmed_${firstOrderId}`, '1');
      setDismissedConfirmed(true);
    }
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/inventario') || pathname?.startsWith('/checkout') || pathname?.startsWith('/catalogo') || pathname?.startsWith('/confirmar-pedido') || pathname?.startsWith('/verificar-stock')) {
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

  return (
    <>
      {/* Cinta de pago — solo modo PC (arriba, encima del navbar) */}
      {showPayButton && (
        <Link 
          className={`global-pay-ribbon${isPaymentReview ? ' global-pay-ribbon--review' : ''}${isPaymentConfirmed ? ' global-pay-ribbon--confirmed' : ''}`}
          href={`/pedido/${firstOrderId}`}
          onClick={isPaymentConfirmed ? handleConfirmedClick : undefined}
        >
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
                {isPaymentConfirmed ? <CheckCircle aria-hidden="true" size={18} strokeWidth={2.4} /> : isPaymentReview ? <Clock aria-hidden="true" size={18} strokeWidth={2.4} /> : <CheckCircle aria-hidden="true" size={18} strokeWidth={2.4} />}
                <span>{isPaymentConfirmed ? 'Pago confirmado' : isPaymentReview ? 'Revisando tu pago' : 'Pagar tu pedido'}</span>
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

      {/* En PC, reservar espacio arriba para la cinta fija */}
      {showPay && <style>{`@media (min-width: 900px) { body { padding-top: 44px !important; } }`}</style>}

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
          background: linear-gradient(135deg,#f59e0b,#d97706) !important;
          transition: transform .15s ease !important;
        }
        .global-mobile-nav__pay:active { transform: scale(0.95) !important; }
        .global-mobile-nav__pay { animation: navPayPulse 2.2s ease-in-out infinite !important; }
        @keyframes navPayPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,.5) !important; }
          50%      { box-shadow: 0 0 0 7px rgba(245,158,11,0) !important; }
        }
        .global-mobile-nav__pay--review { animation: navPayPulseBlue 2.2s ease-in-out infinite !important; }
        @keyframes navPayPulseBlue {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,.5) !important; }
          50%      { box-shadow: 0 0 0 7px rgba(37,99,235,0) !important; }
        }
        .global-mobile-nav__pay--review {
          background: linear-gradient(135deg,#2563eb,#1d4ed8) !important;
        }
        .global-mobile-nav__pay--confirmed {
          background: linear-gradient(135deg,#22c55e,#16a34a) !important;
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
          background: linear-gradient(135deg,#f59e0b,#d97706) !important;
          box-shadow: 0 2px 12px rgba(245,158,11,.35) !important;
        }
        .global-pay-ribbon:hover { filter: brightness(1.03) !important; }
        .global-pay-ribbon--review {
          background: linear-gradient(135deg,#2563eb,#1d4ed8) !important;
          box-shadow: 0 2px 12px rgba(37,99,235,.35) !important;
        }
        .global-pay-ribbon--confirmed {
          background: linear-gradient(135deg,#22c55e,#16a34a) !important;
          box-shadow: 0 2px 12px rgba(22,163,74,.35) !important;
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
        @media (max-width: 899px) {
          body { padding-bottom: 64px !important; }
          footer-group, .footer-group, footer { padding-bottom: 64px !important; }
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
