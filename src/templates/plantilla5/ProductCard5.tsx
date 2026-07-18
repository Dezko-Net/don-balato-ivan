'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/appwrite';
import { useCart } from '@/context/CartContext';
import QuickAddDrawer5 from './QuickAddDrawer5';
import ProductImageGallery from '@/components/ProductImageGallery';

export default function ProductCard5({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const productName = product.NAME || (product as any).name || 'Producto';
  
  const rawImage2 = (product as any).IMAGEURL2 || (product as any).images?.[1];
  const url = `/productos/${product.$id}`;

  return (
    <li className="product-grid__item">
      <div
        className="block product-card product-card--standard product-card--style-standard"
        style={{ '--quick-add-display': 'flex', '--quick-view-display': 'flex' } as any}
      >
        <Link href={url} className="product-card__link focus-visible--inset absolute inset-0"></Link>
        <div className="product-card__wrapper flex flex-col product-card--has-quick-add">
          <div
            className={`product-card__media media-hover--scale ${rawImage2 ? 'product-card__media--has-second-image' : ''} relative media-mask-clip`}
            style={{ '--ratio': '0.75' } as any}
          >
            <ProductImageGallery product={product} alt={productName} compact />
            
            <div className="product-card__badges" data-product-id={product.$id}>
              <div className="product-badges product-badges--vertical">
                <span className="badge badge--new">New</span>
                <span className="badge badge--popular">Popular</span>
              </div>
            </div>
            
            <div className="product-card__actions flex flex-col items-end justify-end gap-1 absolute pointer-events-none z-10 p-4">
              <div 
                className="quick-add quick-add--view color-scheme-inverse" 
                data-product-title={productName} 
                data-product-url={url} 
                data-quick-add-mode="view"
                style={{ display: 'flex' }}
              >
                <div data-product-id={product.$id} className="quick-add__product-form-component flex w-full">
                  <div className="visually-hidden" aria-live="assertive" role="status" aria-atomic="true"></div>
                  <div className="w-full">
                    <button 
                      className="btn btn--icon-only btn--primary quick-add__button--view button-choose-options pointer-events-auto" 
                      type="button" 
                      name="add" 
                      aria-label="Quick view"
                      style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsQuickViewOpen(true);
                      }}
                    >
                      <span className="icon icon--search icon--medium">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path width="256" height="256" fill="none" d="M0 0H20V20H0V0z"></path>
                          <path cx="112" cy="112" r="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M15 8.75A6.25 6.25 0 0 1 8.75 15A6.25 6.25 0 0 1 2.5 8.75A6.25 6.25 0 0 1 15 8.75z"></path>
                          <path x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M13.17 13.17L17.5 17.5"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div 
                className="quick-add quick-add--combine color-scheme-inverse" 
                data-product-title={productName} 
                data-product-url={url} 
                data-quick-add-button="choose" 
                data-product-options-count="1" 
                data-quick-add-mode="combine"
              >
                <div data-product-id={product.$id} className="quick-add__product-form-component flex w-full">
                  <div className="visually-hidden" aria-live="assertive" role="status" aria-atomic="true"></div>
                  <div 
                    className="w-full" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addItem(product, 1);
                    }}
                  >
                    <button 
                      className="btn btn--primary quick-add__button quick-add__button--choose button-choose-options btn--icon-solid-desktop md:justify-start md:w-full pointer-events-auto" 
                      type="button" 
                      name="add" 
                      aria-label="Choose options"
                      style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                    >
                      <span className="btn__text hidden md:flex">Choose options</span>
                      
                      <span className="icon icon--cart md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path width="256" height="256" fill="none" d="M0 0H20V20H0V0z"></path>
                          <path cx="88" cy="216" r="16" d="M8.125 16.875A1.25 1.25 0 0 1 6.875 18.125A1.25 1.25 0 0 1 5.625 16.875A1.25 1.25 0 0 1 8.125 16.875z" fill="currentColor"></path>
                          <path cx="192" cy="216" r="16" d="M16.25 16.875A1.25 1.25 0 0 1 15 18.125A1.25 1.25 0 0 1 13.75 16.875A1.25 1.25 0 0 1 16.25 16.875z" fill="currentColor"></path>
                          <path d="M1.25 2.5h1.875l2.871 10.334A1.25 1.25 0 0 0 7.2 13.75H14.922a1.25 1.25 0 0 0 1.205 -0.916L18.125 5.625H3.993" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)"></path>
                        </svg>
                      </span>
                      
                      <span className="btn__icon hidden md:flex">
                        <span className="btn__icon-text">Choose options</span>
                        <span className="btn__icon-icon">
                          <span className="icon icon--plus">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path fill="none" d="M0 0H20V20H0V0z"></path>
                              <path className="icon--plus-line-1" x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M3.125 10L16.875 10"></path>
                              <path className="icon--plus-line-2" x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M10 3.125L10 16.875"></path>
                            </svg>
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="product-card__content flex flex-col items-start gap-1 mt-4">
            {(product as any).BRAND && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: 20,
                display: 'inline-block',
                marginBottom: 2,
                backgroundColor:
                  (product as any).BRAND === 'Kevin & Coco' ? '#ffe4f0' :
                  (product as any).BRAND === '3Q Beauty' ? '#231815' :
                  (product as any).BRAND === 'SADOER' ? '#e8f5e9' :
                  (product as any).BRAND === 'Billion Beauty' ? '#fde1ed' :
                  '#f3f4f6',
                color:
                  (product as any).BRAND === 'Kevin & Coco' ? '#c2185b' :
                  (product as any).BRAND === '3Q Beauty' ? '#ffffff' :
                  (product as any).BRAND === 'SADOER' ? '#2e7d32' :
                  (product as any).BRAND === 'Billion Beauty' ? '#ad1457' :
                  '#374151',
              }}>
                {(product as any).BRAND}
              </span>
            )}
            <h3 className="product-card__title h6">
              <Link href={url} className="reversed-link__text font-bold text-gray-900" style={{ fontSize: 16 }}>{productName}</Link>
            </h3>
            <div className="product-card__prices mt-1">
              <span className="price text-gray-800" style={{ fontWeight: 600 }}>
                {formatPrice((product as any).CURRENTPRICE ?? product.PRICE ?? (product as any).price ?? 0)}
              </span>
            </div>
            
            {(product as any).colors && (product as any).colors.length > 0 && (
              <div className="product-card__swatches flex items-center gap-2 mt-2">
                {(product as any).colors.slice(0,4).map((c: string) => (
                  <div key={c} style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: c, border: '1px solid #e5e7eb' }} title={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {isQuickViewOpen && <QuickAddDrawer5 product={product} onClose={() => setIsQuickViewOpen(false)} />}
    </li>
  );
}
