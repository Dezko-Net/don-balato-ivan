'use client';

import { useTemplate } from '@/context/TemplateContext';
import Checkout100 from '@/templates/plantilla100/Checkout';

export default function DynamicCheckout({ children }: { children: React.ReactNode }) {
  const { isLoading, getSectionTemplate } = useTemplate();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const template = getSectionTemplate('checkout');

  // Until dedicated checkout templates are implemented, keep the current checkout UI as fallback.
  if (template === 100) return <Checkout100>{children}</Checkout100>;

  return <>{children}</>;
}
