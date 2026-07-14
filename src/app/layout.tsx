import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/templates/plantilla1/mobile-responsive.css';

import { CartProvider } from '@/context/CartContext';
import { TemplateProvider } from '@/context/TemplateContext';
import { AuthProvider } from '@/hooks/useAuth';
import { FavoritesProvider } from '@/context/FavoritesContext';
import StoreShell from '@/components/StoreShell';
import ChatBot from '@/components/ChatBot';
import BackToTop from '@/components/BackToTop';
import { ToastProvider } from '@/components/Toast';
import { NotificationProvider } from '@/context/NotificationContext';
import ScrollToTop from '@/components/ScrollToTop';
import HomeOnlyWidgets from '@/components/HomeOnlyWidgets';
import ClientFetchCache from '@/components/ClientFetchCache';

export const metadata: Metadata = {
  title: 'Kevin & Coco | Tienda',
  description: 'Compra online fácil y rápido',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FBCAC9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pebbleImportMapBase = '/shopify/plantilla5/assets/js/pebble-little.myshopify.com/cdn/shop/t/22/assets';
  const pebbleImportMap = JSON.stringify({
    imports: {
      '@theme/critical':                               `${pebbleImportMapBase}/critical.js`,
      '@theme/utilities':                              `${pebbleImportMapBase}/utilities.js`,
      '@theme/component':                              `${pebbleImportMapBase}/component.js`,
      '@theme/events':                                 `${pebbleImportMapBase}/events.js`,
      '@theme/dialog':                                 `${pebbleImportMapBase}/dialog.js`,
      '@theme/carousel':                               `${pebbleImportMapBase}/carousel.js`,
      '@theme/swiper':                                 `${pebbleImportMapBase}/swiper.js`,
      '@theme/modules':                                `${pebbleImportMapBase}/modules.js`,
      '@theme/morph':                                  `${pebbleImportMapBase}/morph.js`,
      '@theme/section-renderer':                       `${pebbleImportMapBase}/section-renderer.js`,
      '@theme/product-form':                           `${pebbleImportMapBase}/product-form.js`,
      '@theme/variant-picker':                         `${pebbleImportMapBase}/variant-picker.js`,
      '@theme/media-gallery':                          `${pebbleImportMapBase}/media-gallery.js`,
      '@theme/animation':                              `${pebbleImportMapBase}/animation.js`,
      '@theme/testimonial-slider':                     `${pebbleImportMapBase}/testimonial-slider.js`,
      '@theme/photoswipe':                             `${pebbleImportMapBase}/photoswipe.js`,
      '@theme/zoom-dialog':                            `${pebbleImportMapBase}/zoom-dialog.js`,
      '@theme/paginated-list':                         `${pebbleImportMapBase}/paginated-list.js`,
      '@theme/carousel-features/counter':              `${pebbleImportMapBase}/counter.js`,
      '@theme/carousel-features/custom-pagination':    `${pebbleImportMapBase}/custom-pagination.js`,
      '@theme/carousel-features/navigation-position':  `${pebbleImportMapBase}/navigation-position.js`,
      '@theme/carousel-features/thumbnails':           `${pebbleImportMapBase}/thumbnails.js`,
      '@theme/carousel-features/progressbar-autoplay': `${pebbleImportMapBase}/progressbar-autoplay.js`,
      '@theme/lenis':                                  `${pebbleImportMapBase}/lenis.js`,
      '@theme/motion-coordinator':                     `${pebbleImportMapBase}/motion-coordinator.js`,
      '@theme/image-coordinator':                      `${pebbleImportMapBase}/image-coordinator.js`,
      '@theme/sticky-add-to-cart':                     `${pebbleImportMapBase}/sticky-add-to-cart.js`,
      '@theme/badge-float':                            `${pebbleImportMapBase}/badge-float.js`,
    }
  });

  return (
    <html lang="es">
      <head>
        {/* Force one-time hard reload for all users after deploy to clear stale chunks */}
        {/* biome-ignore lint: intentional dangerouslySetInnerHTML for cache-busting */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var v='kc_force_reload_v1';var s=sessionStorage.getItem(v);if(!s){sessionStorage.setItem(v,'1');if(window.performance&&window.performance.navigation&&window.performance.navigation.type!==1){window.location.reload(true);}}}catch(e){}})();` }} />
        {/* Importmap para el tema Pebble (Plantilla 5) — resuelve @theme/ a archivos locales */}
        {/* biome-ignore lint: intentional dangerouslySetInnerHTML for importmap */}
        <script type="importmap" dangerouslySetInnerHTML={{ __html: pebbleImportMap }} />
      </head>
      <body>
        <ClientFetchCache />
        <AuthProvider>
          <ToastProvider>
            <NotificationProvider>
              <FavoritesProvider>
                <CartProvider>
                  <TemplateProvider>
                    <StoreShell>{children}</StoreShell>
                    <HomeOnlyWidgets />
                    <BackToTop />
                    <ScrollToTop />
                  </TemplateProvider>
                </CartProvider>
              </FavoritesProvider>
            </NotificationProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

