'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';

// Mapear explícitamente los componentes importados dinámicamente con ssr desactivado
const TEMPLATE_COMPONENTS: Record<number, any> = {
  1: dynamic(() => import('@/templates/plantilla1/HomePage'), { ssr: false }),
  2: dynamic(() => import('@/templates/plantilla2/HomePage'), { ssr: false }),
  3: dynamic(() => import('@/templates/plantilla3/HomePage'), { ssr: false }),
  4: dynamic(() => import('@/templates/plantilla4/HomePage'), { ssr: false }),
  5: dynamic(() => import('@/templates/plantilla5/HomePage'), { ssr: false }),
  6: dynamic(() => import('@/templates/plantilla6/HomePage'), { ssr: false }),
  7: dynamic(() => import('@/templates/plantilla7/HomePage'), { ssr: false }),
  8: dynamic(() => import('@/templates/plantilla8/HomePage'), { ssr: false }),
  10: dynamic(() => import('@/templates/plantilla10/HomePage'), { ssr: false }),
  11: dynamic(() => import('@/templates/plantilla11/HomePage'), { ssr: false }),
  12: dynamic(() => import('@/templates/plantilla12/HomePage'), { ssr: false }),
  13: dynamic(() => import('@/templates/plantilla13/HomePage'), { ssr: false }),
  23: dynamic(() => import('@/templates/plantilla23/HomePage'), { ssr: false }),
  24: dynamic(() => import('@/templates/plantilla24/HomePage'), { ssr: false }),
  25: dynamic(() => import('@/templates/plantilla25/HomePage'), { ssr: false }),
  100: dynamic(() => import('@/templates/plantilla100/HomePage'), { ssr: false }),
  101: dynamic(() => import('@/templates/plantilla101/HomePage'), { ssr: false }),
};

const TEMPLATE_NAMES: Record<number, string> = {
  1: 'Moderna',
  2: 'Marketplace',
  3: 'Retail',
  4: 'Chinamart',
  5: 'Pebble Little',
  6: 'Horizon Premium',
  7: 'Noble Premium',
  8: 'Exito Premium',
  10: 'Noble Beauty',
  11: 'K-Me Store (old)',
  12: 'K-Me Store',
  13: 'K-Me Store V2',
  23: 'Plantilla 23',
  24: 'Noble Preview',
  25: 'Concept Theme Tech',
  100: 'Plantilla 100',
  101: 'Wonder Theme Fashion',
};


export default function PreviewPlantillaPage() {
  const params = useParams();
  const pathname = usePathname();
  const paramId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const fallbackId = pathname.match(/\/preview\/plantilla\/(\d+)/)?.[1];
  const id = Number(paramId || fallbackId || 0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Pequeño delay para que carguen los assets
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Hide the global app navbar on preview pages
    const style = document.createElement('style');
    style.id = 'preview-hide-nav';
    style.textContent = '.tpl1-nav, .tpl1-nav-inner { display: none !important; }';
    document.head.appendChild(style);

    // Set window.countdown BEFORE any Shopify scripts load
    (window as any).countdown = {
      long: { day: 'día', hour: 'hora', second: 'segundo', one: { day: 'día', hour: 'hora', second: 'segundo' }, other: { day: 'días', hour: 'horas', second: 'segundos' } },
      short: { day: 'd', hour: 'h', second: 's', one: { day: 'd', hour: 'h', second: 's' }, other: { day: 'd', hour: 'h', second: 's' } },
    };

    // Set window.Shopify stub if not already set
    if (!(window as any).Shopify) {
      (window as any).Shopify = {
        shop: '0wq643cy0nlo7vfe-97367883849.myshopify.com',
        country: 'US',
        currency: 'USD',
        locale: 'es',
        theme: { name: 'Captured Theme', id: '5' },
        routes: { root_url: '/', cart_url: '/cart', search_url: '/search' },
        customerAccountsEnabled: false,
      };
    }

    return () => { style.remove(); };
  }, []);

  if (!id || !TEMPLATE_COMPONENTS[id]) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#374151' }}>Plantilla no encontrada</p>
          <a href="/admin/engagement/plantillas" style={{ color: '#2563eb', fontSize: 14 }}>← Volver a plantillas</a>
        </div>
      </div>
    );
  }

  const TemplateComponent = TEMPLATE_COMPONENTS[id];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Barra flotante de preview */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        fontSize: 13,
        fontFamily: 'system-ui, sans-serif',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="/admin/engagement/plantillas"
            style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: 12 }}
          >
            <ArrowLeft size={14} /> Volver
          </a>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ fontWeight: 700, color: '#f1f5f9' }}>
            👁️ Vista previa — Plantilla {id}: {TEMPLATE_NAMES[id]}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#fbbf24', color: '#78350f', fontWeight: 700, letterSpacing: '0.04em' }}>
            MODO PREVIEW
          </span>
          <span style={{ color: '#64748b', fontSize: 11 }}>
            No afecta la tienda pública
          </span>
        </div>
      </div>

      {/* Contenido de la plantilla */}
      <div>
        {ready && <TemplateComponent />}
      </div>
    </div>
  );
}
