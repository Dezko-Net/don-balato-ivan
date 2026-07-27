'use client';
import dynamic from 'next/dynamic';
import { useTemplate } from '@/context/TemplateContext';

// Spinner reutilizable mientras carga la plantilla activa.
function Loader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#eab308', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ⚡ Lazy-load: cada plantilla queda en su propio chunk y SOLO se descarga la que
// esté activa (antes se importaban las 17 de golpe y todas pesaban en el bundle).
const TEMPLATES: Record<number, React.ComponentType> = {
  1: dynamic(() => import('@/templates/plantilla1/HomePage'), { loading: Loader, ssr: false }),
  2: dynamic(() => import('@/templates/plantilla2/HomePage'), { loading: Loader, ssr: false }),
  3: dynamic(() => import('@/templates/plantilla3/HomePage'), { loading: Loader, ssr: false }),
  4: dynamic(() => import('@/templates/plantilla4/HomePage'), { loading: Loader, ssr: false }),
  5: dynamic(() => import('@/templates/plantilla5/HomePage'), { loading: Loader, ssr: false }),
  6: dynamic(() => import('@/templates/plantilla6/HomePage'), { loading: Loader, ssr: false }),
  7: dynamic(() => import('@/templates/plantilla7/HomePage'), { loading: Loader, ssr: false }),
  8: dynamic(() => import('@/templates/plantilla8/HomePage'), { loading: Loader, ssr: false }),
  10: dynamic(() => import('@/templates/plantilla10/HomePage'), { loading: Loader, ssr: false }),
  11: dynamic(() => import('@/templates/plantilla11/HomePage'), { loading: Loader, ssr: false }),
  12: dynamic(() => import('@/templates/plantilla12/HomePage'), { loading: Loader, ssr: false }),
  13: dynamic(() => import('@/templates/plantilla13/HomePage'), { loading: Loader, ssr: false }),
  23: dynamic(() => import('@/templates/plantilla23/HomePage'), { loading: Loader, ssr: false }),
  24: dynamic(() => import('@/templates/plantilla24/HomePage'), { loading: Loader, ssr: false }),
  25: dynamic(() => import('@/templates/plantilla25/HomePage'), { loading: Loader, ssr: false }),
  100: dynamic(() => import('@/templates/plantilla100/HomePage'), { loading: Loader, ssr: false }),
  101: dynamic(() => import('@/templates/plantilla101/HomePage'), { loading: Loader, ssr: false }),
  26: dynamic(() => import('@/templates/plantilla26/HomePage'), { loading: Loader, ssr: false }),
  99: dynamic(() => import('@/templates/plantilla99/HomePage'), { loading: Loader, ssr: false }),
  666: dynamic(() => import('@/templates/plantilla666/HomePage'), { loading: Loader, ssr: false }),
};

export default function DynamicHomePage({ children }: { children: React.ReactNode }) {
  const { isLoading, getSectionTemplate } = useTemplate();
  if (isLoading) return <Loader />;

  const template = getSectionTemplate('landing') as number;
  const Tpl = TEMPLATES[template];
  if (Tpl) return <Tpl />;
  return <>{children}</>;
}
