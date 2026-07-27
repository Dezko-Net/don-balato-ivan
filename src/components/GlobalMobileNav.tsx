'use client';

import Link from 'next/link';
import { Home, Store, ShoppingBag, User, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const items = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Favoritos', href: '/cuenta/favoritos', icon: Heart },
  { label: 'Catálogo', href: '/productos', icon: Store },
  { label: 'Carrito', href: '/carrito', icon: ShoppingBag },
  { label: 'Cuenta', href: '/cuenta', icon: User },
];

export default function GlobalMobileNav() {
  const { totalItems } = useCart();

  return (
    <nav className="global-mobile-nav" aria-label="Navegación móvil">
      {items.map(({ label, href, icon: Icon }) => (
        <Link key={label} className="global-mobile-nav__item" href={href}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
            {label === 'Carrito' && totalItems > 0 && (
              <span className="global-mobile-nav__badge">{totalItems > 99 ? '99+' : totalItems}</span>
            )}
          </span>
          <span>{label}</span>
        </Link>
      ))}
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
        .global-mobile-nav__badge {
          position: absolute !important; top: -6px !important; right: -8px !important;
          min-width: 16px !important; height: 16px !important; padding: 0 4px !important;
          border-radius: 999px !important; background: #3b82f6 !important; color: #fff !important;
          font-size: 10px !important; font-weight: 700 !important; line-height: 16px !important;
          text-align: center !important; box-shadow: 0 1px 4px rgba(59,130,246,0.4) !important;
        }
        @media (max-width: 899px) {
          body { padding-bottom: 64px !important; }
          footer-group, .footer-group, footer { padding-bottom: 64px !important; }
        }
        @media (min-width: 900px) { .global-mobile-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}
