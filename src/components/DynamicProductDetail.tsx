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
        <div style={{ width: 40, height: 40, border: '3px solid #f3f4f6', borderTopColor: '#e396bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const template = getSectionTemplate('productDetail');

  if (template === 100) return <ProductDetailPlantilla100 previewProductId={productId} />;
  if (template === 5 || template === 23) return <ProductDetailPlantilla5 previewProductId={productId} />;
  if (template === 1) return <ProductDetailPlantilla1 previewProductId={productId} />;
  return <ProductDetailPlantilla2 previewProductId={productId} />;
}
