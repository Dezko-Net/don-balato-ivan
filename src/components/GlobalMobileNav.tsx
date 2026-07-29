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
          return (
            <Link key={label} className="global-mobile-nav__item" href={href}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                {label === 'Carrito' && totalItems > 0 && (
                  <span className="global-mobile-nav__badge">{totalItems > 99 ? '99+' : totalItems}</span>
                )}
              </span>
              <span>{label}</span>
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
          border-top: 1px solid rgba(0,0,0,.1) !important;
          box-shadow: 0 -4px 18px rgba(0,0,0,.08) !important; box-sizing: border-box !important;
        }
        .global-mobile-nav__item {
          display: flex !important; flex: 1 1 0 !important; flex-direction: column !important;
          align-items: center !important; justify-content: center !important; min-width: 0 !important;
          gap: 4px !important; color: #111827 !important; text-decoration: none !important;
          font-size: 10px !important; font-weight: 500 !important; line-height: 1 !important;
          background: transparent !important; border: 0 !important; padding: 0 !important;
        }
        .global-mobile-nav__item svg { display: block !important; width: 20px !important; height: 20px !important; }
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
        .global-mobile-nav__pay:active { transform: scale(0.97) !important; }
        .global-mobile-nav__pay--review {
          background: linear-gradient(135deg,#2563eb,#1d4ed8) !important;
        }
        .global-mobile-nav__pay--confirmed {
          background: linear-gradient(135deg,#22c55e,#16a34a) !important;
        }
        .global-mobile-nav__pay svg { flex-shrink: 0 !important; }
        .global-mobile-nav__pay span { white-space: normal !important; }
        .global-mobile-nav__badge {
          position: absolute !important; top: -6px !important; right: -8px !important;
          min-width: 16px !important; height: 16px !important; padding: 0 4px !important;
          border-radius: 999px !important; background: #3b82f6 !important; color: #fff !important;
          font-size: 10px !important; font-weight: 700 !important; line-height: 16px !important;
          text-align: center !important; box-shadow: 0 1px 4px rgba(59,130,246,0.4) !important;
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
      `}</style>
    </>
  );
}
