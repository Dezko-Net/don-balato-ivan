'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { resolveStorageImageUrl } from '@/lib/product-images';

const IMAGE_KEYS = ['IMAGEURL', 'IMAGEURL2', 'IMAGEURL3', 'IMAGEURL4', 'IMAGEURL5'] as const;

type Props = {
  product: Product;
  alt?: string;
  onImageClick?: () => void;
  sizes?: string;
  compact?: boolean;
};

export default function ProductImageGallery({ product, alt, onImageClick, sizes = '(max-width: 768px) 50vw, 25vw', compact = false }: Props) {
  const images: string[] = useMemo(() => {
    const storedImages = Array.isArray((product as any).images) ? (product as any).images : [];
    const values = storedImages.length > 0 ? storedImages : IMAGE_KEYS.map(key => (product as any)[key]);
    return values.map((value: unknown) => resolveStorageImageUrl(typeof value === 'string' ? value : '')).filter(Boolean);
  }, [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];
  const productAlt = alt || product.NAME || 'Producto';

  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
      <div
        onClick={onImageClick}
        style={{ position: 'relative', aspectRatio: '1 / 1', width: '100%', cursor: onImageClick ? 'pointer' : 'default', background: '#fff', overflow: 'hidden' }}
      >
        {activeImage ? (
          <Image src={activeImage} alt={productAlt} fill sizes={sizes} unoptimized style={{ objectFit: 'contain', backgroundColor: '#fff' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: compact ? 36 : 48, color: '#fbcfe8' }}>📦</div>
        )}
      </div>
      {images.length > 0 && (
        <div role="group" aria-label={`Imágenes de ${productAlt}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: compact ? 6 : 7, padding: compact ? '8px 4px 10px' : '9px 4px 12px', background: '#fff' }}>
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
              aria-pressed={index === activeIndex}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setActiveIndex(index);
              }}
              style={{ width: compact ? 21 : 34, height: compact ? 21 : 34, padding: 2, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: `${index === activeIndex ? 2 : 1}px solid ${index === activeIndex ? '#db2777' : '#e5e7eb'}`, background: '#fff', boxShadow: index === activeIndex ? '0 0 0 2px rgba(219,39,119,0.14)' : 'none', opacity: index === activeIndex ? 1 : 0.78, transition: 'all 0.18s ease' }}
            >
              <Image src={image} alt="" width={compact ? 17 : 30} height={compact ? 17 : 30} unoptimized style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', display: 'block', background: '#fff' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
