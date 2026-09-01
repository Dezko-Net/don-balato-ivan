'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { resolveStorageImageUrl } from '@/lib/product-images';

const IMAGE_KEYS = ['IMAGEURL', 'IMAGEURL2', 'IMAGEURL3', 'IMAGEURL4', 'IMAGEURL5'] as const;

export function getProductImages(product: Product): string[] {
  const storedImages = Array.isArray((product as any).images) ? (product as any).images : [];
  const values = storedImages.length > 0 ? storedImages : IMAGE_KEYS.map(key => (product as any)[key]);
  return values.map((value: unknown) => resolveStorageImageUrl(typeof value === 'string' ? value : '')).filter(Boolean);
}

type Props = {
  product: Product;
  alt?: string;
  onImageClick?: (imageSrc: string) => void;
  sizes?: string;
  compact?: boolean;
  hideThumbnails?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

export default function ProductImageGallery({ product, alt, onImageClick, sizes = '(max-width: 768px) 50vw, 25vw', compact = false, hideThumbnails = false, activeIndex: controlledIndex, onActiveIndexChange }: Props) {
  const images: string[] = useMemo(() => getProductImages(product), [product]);
  const [internalIndex, setInternalIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const activeIndex = controlledIndex ?? internalIndex;
  const setActiveIndex = (i: number) => {
    if (onActiveIndexChange) onActiveIndexChange(i);
    else setInternalIndex(i);
  };
  const activeImage = images[activeIndex] || images[0];
  const productAlt = alt || product.NAME || 'Producto';

  // Reset error state when the active image changes
  useEffect(() => { setImgError(false); }, [activeImage]);

  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
      <div
        onClick={() => onImageClick?.(activeImage)}
        style={{ position: 'relative', aspectRatio: '1 / 1', width: '100%', cursor: onImageClick ? 'pointer' : 'default', background: '#fff', overflow: 'hidden' }}
      >
        {activeImage && !imgError ? (
          <Image src={activeImage} alt={productAlt} fill sizes={sizes} unoptimized={activeImage.startsWith('/api/image?')} style={{ objectFit: 'contain', backgroundColor: '#fff' }} onError={() => setImgError(true)} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: compact ? 36 : 48, color: '#facc15' }}>📦</div>
        )}
      </div>
      {!hideThumbnails && images.length > 0 && (
        <div role="group" aria-label={`Imágenes de ${productAlt}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: compact ? 6 : 7, padding: compact ? '8px 4px 10px' : '9px 4px 12px' }}>
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
              style={{ width: compact ? 21 : 34, height: compact ? 21 : 34, padding: 2, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: `${index === activeIndex ? 2 : 1}px solid ${index === activeIndex ? '#eab308' : '#e5e7eb'}`, background: '#fff', boxShadow: index === activeIndex ? '0 0 0 2px rgba(234,179,8,0.14)' : 'none', opacity: index === activeIndex ? 1 : 0.78, transition: 'all 0.18s ease' }}
            >
              <Image src={image} alt="" width={compact ? 17 : 30} height={compact ? 17 : 30} unoptimized={image.startsWith('/api/image?')} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', display: 'block', background: '#fff' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type ThumbnailsProps = {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  compact?: boolean;
};

export function ProductThumbnails({ images, activeIndex, onIndexChange, compact = false }: ThumbnailsProps) {
  if (!images || images.length <= 1) return null;
  return (
    <div role="group" className="pk-card-thumbs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: compact ? 5 : 6, flexShrink: 0 }}>
      {images.map((image, index) => (
        <button
          key={`${image}-${index}`}
          type="button"
          aria-label={`Ver imagen ${index + 1} de ${images.length}`}
          aria-pressed={index === activeIndex}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onIndexChange(index);
          }}
          style={{ width: compact ? 20 : 28, height: compact ? 20 : 28, padding: 2, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: `${index === activeIndex ? 2 : 1}px solid ${index === activeIndex ? '#3b82f6' : '#e5e7eb'}`, background: '#fff', opacity: index === activeIndex ? 1 : 0.6, transition: 'all 0.18s ease' }}
        >
          <Image src={image} alt="" width={compact ? 16 : 24} height={compact ? 16 : 24} unoptimized={image.startsWith('/api/image?')} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', display: 'block' }} />
        </button>
      ))}
    </div>
  );
}

/**
 * SafeImage — Next.js <Image> con fallback automático.
 * Si la imagen falla (404, timeout, etc.) muestra un emoji/placeholder
 * en vez de una imagen rota. Úsalo en map() de productos donde no puedes
 * tener useState por item.
 */
export function SafeImage({
  src,
  alt,
  fill,
  sizes,
  style,
  fallback = '📦',
  fallbackColor = '#facc15',
  fallbackBg = '#fff',
}: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  fallback?: string;
  fallbackColor?: string;
  fallbackBg?: string;
}) {
  const [errored, setErrored] = useState(false);
  useEffect(() => { setErrored(false); }, [src]);
  if (!src || errored) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', fontSize: 42, color: fallbackColor, background: fallbackBg, ...style }}>
        {fallback}
      </div>
    );
  }
  return <Image src={src} alt={alt} fill={fill} sizes={sizes} unoptimized={src.startsWith('/api/image?')} style={style} onError={() => setErrored(true)} />;
}
