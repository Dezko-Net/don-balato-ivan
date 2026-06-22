'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import DynamicNavbar from '@/components/DynamicNavbar';
import NewsletterSignup from '@/components/NewsletterSignup';
import AnnouncementBar from '@/components/AnnouncementBar';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import PageTransition from '@/components/PageTransition';
import { useTemplate } from '@/context/TemplateContext';

const FOOTER_LINKS = [
  { title: 'Tienda', items: [
    { label: 'Productos', href: '/productos' },
    { label: 'Mis Pedidos', href: '/cuenta/pedidos' },
    { label: 'Clips', href: '/clips' },
  ]},
  { title: 'Mi cuenta', items: [
    { label: 'Mis pedidos', href: '/cuenta/pedidos' },
    { label: 'Favoritos', href: '/favoritos' },
    { label: 'Direcciones', href: '/cuenta/direcciones' },
    { label: 'Notificaciones', href: '/cuenta/notificaciones' },
  ]},
  { title: 'Ayuda', items: [
    { label: 'Soporte', href: '/cuenta/tickets' },
    { label: 'Mayorista', href: '/mayorista' },
    { label: 'Comparar', href: '/comparar' },
  ]},
];

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getSectionTemplate } = useTemplate();
  const isAdmin       = pathname.startsWith('/admin');
  const isAuth        = pathname.startsWith('/login');
  const landingTemplate = getSectionTemplate('landing');
  const hideNavbarForCapturedLanding = (pathname === '/' || pathname.startsWith('/preview/plantilla/')) && landingTemplate === 101;

  if (isAdmin || isAuth) {
    return <>{children}</>;
  }

  /* Templates 1 (Shopify-Venice), 4 (Chinamart) y 5 (Pebble Little) tienen su propio footer en el HTML migrado */
  const hideNativeFooter = true; // Hidden for all templates because we use the injected HTML footer

  return (
    <MaintenanceGuard>
    <>
      {!hideNavbarForCapturedLanding && <DynamicNavbar />}
      <PageTransition><main>{children}</main></PageTransition>
      {!hideNativeFooter && (
      <footer className="store-footer" style={{ background: '#f9f9f9', color: '#374151', borderTop: '1px solid #e5e7eb', marginTop: 40 }}>
        <div className="store-footer-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 5% 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {FOOTER_LINKS.map(group => (
            <div key={group.title} className="store-footer-col">
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#111827' }}>{group.title}</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {group.items.map(item => (
                  <li key={item.label} style={{ marginBottom: 6 }}>
                    <Link href={item.href} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', transition: 'color .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="store-footer-newsletter">
            <NewsletterSignup />
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '16px 5%', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
            © {new Date().getFullYear()} Tienda Online · Todos los derechos reservados
          </p>
        </div>
      </footer>
      )}
    </>
    </MaintenanceGuard>
  );
}
