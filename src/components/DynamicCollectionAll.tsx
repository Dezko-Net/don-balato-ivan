'use client';
import { useTemplate } from '@/context/TemplateContext';
import CollectionAll5 from '@/templates/plantilla5/CollectionAll';
import CollectionAll1 from '@/templates/plantilla1/CollectionAll';
import CollectionAll100 from '@/templates/plantilla100/CollectionAll';
import { Suspense } from 'react';
import { ProductosInner } from '@/app/productos/ProductosInner';

export default function DynamicCollectionAll({ catalogMode, initialBrand }: { catalogMode?: 'retail' | 'paquetes' | 'embalajes'; initialBrand?: string } = {}) {
  const { isLoading, getSectionTemplate } = useTemplate();
  
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  // Use catalog key for all products page
  const template = getSectionTemplate('catalog');
  
  // If we are in 'paquetes' or 'embalajes' mode, we must use Plantilla 1 
  // because Plantilla 5 and 100 do not support them yet.
  if (!catalogMode || catalogMode === 'retail') {
    if (template === 100) return <CollectionAll100 />;
    if (template === 5) return <CollectionAll5 initialBrand={initialBrand} />;
    // Template 23: use ProductosInner with brand lock
    if (template === 23) return (
      <Suspense fallback={<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>}>
        <ProductosInner lockBrand={initialBrand} />
      </Suspense>
    );
  }
  
  // Default to plantilla 1 (no brand filter: plantilla 1 doesn't support it yet)
  return <CollectionAll1 catalogMode={catalogMode} />;
}
