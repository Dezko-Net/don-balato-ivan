'use client';

import { useTemplate } from '@/context/TemplateContext';
import Cart100 from '@/templates/plantilla100/Cart';

export default function DynamicCart({ children }: { children: React.ReactNode }) {
  const { isLoading, getSectionTemplate } = useTemplate();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const template = getSectionTemplate('cart');

  // Until dedicated cart templates are implemented, keep the current cart UI as fallback.
  if (template === 100) return <Cart100>{children}</Cart100>;

  return <>{children}</>;
}
