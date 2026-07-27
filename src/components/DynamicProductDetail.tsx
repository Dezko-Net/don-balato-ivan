'use client';
import { useTemplate } from '@/context/TemplateContext';
import ProductDetailPlantilla1 from '@/templates/plantilla1/ProductDetail';
import ProductDetailPlantilla2 from '@/templates/plantilla2/ProductDetail';
import ProductDetailPlantilla5 from '@/templates/plantilla5/ProductDetail';
import ProductDetailPlantilla100 from '@/templates/plantilla100/ProductDetail';

export default function DynamicProductDetail({ productId }: { productId?: string }) {
  const { isLoading, getSectionTemplate } = useTemplate();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#eab308', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Forzar siempre plantilla 100 para detalles de producto según instrucción
  return <ProductDetailPlantilla100 previewProductId={productId} />;
}
