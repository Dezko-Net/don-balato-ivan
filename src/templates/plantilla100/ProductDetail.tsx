'use client';

import ProductDetail5 from '@/templates/plantilla5/ProductDetail';

export default function ProductDetail100({ previewProductId }: { previewProductId?: string }) {
  return (
    <div data-template-bridge="100-product-detail">
      <ProductDetail5 previewProductId={previewProductId} />
    </div>
  );
}
