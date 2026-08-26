'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/appwrite';
import { resolveStorageImageUrl } from '@/lib/product-images';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
  onClose: () => void;
}

export default function QuickAddDrawer5({ product, onClose }: Props) {
  const { addItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  const rawImages = (product as any).images || [product.IMAGEURL, product.IMAGEURL2, product.IMAGEURL3, product.IMAGEURL4, product.IMAGEURL5].filter(Boolean);
  const images = rawImages.map((v: string) => resolveStorageImageUrl(v)).filter(Boolean) as string[];
  const productName = product.NAME || (product as any).name || 'Producto';
  const basePrice = product.PRICE ?? (product as any).price ?? 0;
  const currentPrice = product.CURRENTPRICE ?? (product as any).currentPrice ?? basePrice;
  const hasDisc = currentPrice < basePrice;
  const isNew = true; // For demo purposes

  useEffect(() => {
    setMounted(true);
    // Usamos setTimeout para asegurar que el navegador pinte el estado inicial
    // (transform: translateX(120%)) antes de agregar la clase "is-open".
    const timer = setTimeout(() => {
      setIsOpen(true);
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (dialogRef.current) dialogRef.current.close();
      onClose();
    }, 300); // Wait for transition
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`quick-add-dialog-container ${isOpen ? 'is-open' : ''}`}>
      <style jsx>{`
        .quick-add-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 999998; /* Muy alto para estar por encima de la navbar */
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .is-open .quick-add-overlay {
          opacity: 1;
          pointer-events: auto;
        }
        dialog.dialog--quick-add-drawer {
          margin: 0;
          height: calc(100vh - 5.6rem); /* Ajustado para el nuevo top */
          max-height: calc(100vh - 5.6rem); /* Ajustado para el nuevo top */
          width: calc(100% - 3.2rem);
          max-width: 500px;
          border: none;
          border-radius: 2.4rem;
          background: #fff;
          z-index: 999999; /* Muy alto para estar por encima de la navbar */
          transform: translateX(120%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
          display: block;
          position: fixed;
          top: 2.8rem; /* Bajado un poquitito (antes era 1.6rem) */
          left: auto !important;
          right: 1.6rem !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        @media (max-width: 768px) {
          dialog.dialog--quick-add-drawer {
            top: auto;
            bottom: 0;
            right: 0 !important;
            left: 0 !important;
            width: 100%;
            max-width: 100%;
            height: 90vh;
            border-radius: 2.4rem 2.4rem 0 0;
            transform: translateY(120%);
          }
          .is-open dialog.dialog--quick-add-drawer {
            transform: translateY(0);
          }
        }
        .is-open dialog.dialog--quick-add-drawer {
          transform: translateX(0);
        }
        dialog::backdrop {
          display: none;
        }
        .variant-option__button-label input:checked + .swatch {
          box-shadow: 0 0 0 1px #fff, 0 0 0 3px #000;
        }
        .variant-option__button-label input:checked + .variant-option__button-label__text {
          background: #000;
          color: #fff;
        }

        /* Efectos Hover para botones */
        .btn-add-to-cart {
          background: #f4f4f4;
          color: #000;
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }
        .btn-add-to-cart:hover {
          background: #000 !important;
          color: #fff !important;
        }
        
        .btn-buy-now {
          background: #000;
          color: #fff;
          border: 1px solid #000;
          transition: all 0.3s ease;
        }
        .btn-buy-now:hover {
          background: #fff !important;
          color: #000 !important;
        }
      `}</style>
      
      <div className="quick-add-overlay" onClick={handleClose} />

      <dialog
        ref={dialogRef}
        className="dialog dialog--drawer dialog--quick-add-drawer dialog--drawer-right dialog--drawer-mobile-bottom overflow-hidden color-scheme-1"
        style={{ '--f-column-gap-max': '0.0rem', '--f-column-gap': '0', '--f-column-gap-mobile': '0.0rem', '--f-row-gap': '0.4rem', '--f-row-gap-mobile': '0.4rem' } as any}
      >
        <button
          className="dialog__close dialog__close--absolute pointer-events-auto"
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          <span className="icon icon--close icon--large">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path width="256" height="256" fill="none" d="M0 0H20V20H0V0z" />
              <path x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M15.625 4.375L4.375 15.625" />
              <path x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M15.625 15.625L4.375 4.375" />
            </svg>
          </span>
        </button>

        <div className="quick-add-dialog__inner flex flex-col h-full" id="quick-add-drawer-content">
          <div className="quick-add__content v-scrollable flex flex-col flex-1 gap-style" style={{ '--f-column-gap-max': '0.0rem', '--f-column-gap': '0', '--f-column-gap-mobile': '0.0rem', '--f-row-gap': '0.4rem', '--f-row-gap-mobile': '0.4rem' } as any}>
            
            {/* Badges */}
            <div className="block product-badges spacing-style" style={{ '--padding-block-start': '0', '--padding-block-end': '0.4rem' } as any}>
              <div className="product-badges product-badges--horizontal product-badges--empty"></div>
            </div>

            {/* Title */}
            <div className="spacing-style text-block color-text h3 rte" style={{ '--padding-block-end': '0' } as any}>
              <h1>{productName}</h1>
            </div>

            {/* Price */}
            <div className="block product-price-block product-price spacing-style" style={{ '--padding-block-end': '1.2rem' } as any}>
              <div className="price-container h5">
                <div className="price__regular">
                  <span className="visually-hidden">Precio regular&nbsp;</span>
                  <span className="price">{formatPrice(currentPrice)}</span>
                </div>
                {hasDisc && (
                  <div className="price__sale">
                    <span className="visually-hidden">Precio de oferta&nbsp;</span>
                    <span className="price price--sale">{formatPrice(currentPrice)}</span>
                    <span className="visually-hidden">Precio regular&nbsp;</span>
                    <span className="compare-at-price">{formatPrice(basePrice)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Media Gallery */}
            <div className="block media-gallery media-gallery--quick-add spacing-style" style={{ '--media-radius': '2.0rem', '--padding-block-end': '1.6rem' } as any}>
              <div className="carousel media-gallery__carousel carousel--visible">
                <div className="swiper media-gallery__carousel-container">
                  <div className="swiper-wrapper media-gallery__carousel-wrapper" style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '1rem' }}>
                    {images.map((img, i) => (
                      <div key={i} className="product-media media media-zoom-reveal swiper-slide media-gallery__item loaded is-revealed" style={{ flex: '0 0 60%', scrollSnapAlign: 'start', borderRadius: '2rem', overflow: 'hidden', position: 'relative', aspectRatio: '0.75' }}>
                        <Image src={img} alt={productName} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 400px" />
                      </div>
                    ))}
                    {images.length === 0 && (
                      <div className="product-media media media-zoom-reveal swiper-slide media-gallery__item" style={{ flex: '0 0 60%', scrollSnapAlign: 'start', borderRadius: '2rem', overflow: 'hidden', position: 'relative', aspectRatio: '0.75', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '4rem' }}>📦</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="carousel__controls carousel__controls--group mt-4">
                  <div className="carousel__counter shrink-0" aria-live="polite">1 / {Math.max(1, images.length)}</div>
                  <div className="swiper-pagination carousel__pagination carousel__pagination--progressbar swiper-pagination-progressbar swiper-pagination-horizontal">
                    <span className="swiper-pagination-progressbar-fill" style={{ transform: 'scaleX(0.25) scaleY(1)' }}></span>
                  </div>
                  <div className="carousel__controls-buttons carousel__controls-buttons--medium">
                    <button className="swiper-button-prev carousel__button carousel__button--prev button-unstyled swiper-button-disabled" disabled>
                      <span className="icon icon--caret-left carousel__button-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"></path><path points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M12.5 16.25L6.25 10L12.5 3.75"></path></svg></span>
                    </button>
                    <button className="swiper-button-next carousel__button carousel__button--next button-unstyled">
                      <span className="icon icon--caret-right carousel__button-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"></path><path points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M7.5 3.75L13.75 10L7.5 16.25"></path></svg></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Variant Picker */}
            <div className="variant-picker spacing-style" style={{ '--padding-block-end': '1.6rem' } as any}>
              <form className="variant-picker__form">
                <div className="variant-option variant-option--fieldset variant-option--buttons variant-option--swatches" style={{ '--swatch-width': '52px', '--swatch-height': '24px', '--border-radius': '0px' } as any}>
                  <div className="variant-option__label flex flex-wrap justify-between items-center gap-3 w-full p-0">
                    <div className="variant-option__label-content">
                      <span className="h6 variant-option__label-text">Color: </span>
                      <span className="variant-option__label-value color-subtext">{(product as any).colors?.[0] || 'Crema'}</span>
                    </div>
                  </div>
                  <label className="variant-option__button-label variant-option__button-label--has-swatch variant-option__button-label--square mt-2">
                    <input type="radio" name="Color" value={(product as any).colors?.[0] || 'Crema'} defaultChecked style={{ position: 'absolute', opacity: 0 }} />
                    <span className="swatch" style={{ backgroundColor: (product as any).colors?.[0] || '#f4ecd8', width: '52px', height: '24px', display: 'block', border: '2px solid #000' }}></span>
                  </label>
                </div>

                <div className="variant-option variant-option--fieldset variant-option--buttons mt-4" style={{ '--swatch-width': '52px', '--swatch-height': '24px', '--border-radius': '0px' } as any}>
                  <div className="variant-option__label flex flex-wrap justify-between items-center gap-3 w-full p-0">
                    <div className="variant-option__label-content">
                      <span className="h6 variant-option__label-text">Talla: </span>
                      <span className="variant-option__label-value color-subtext">3Y</span>
                    </div>
                    <button type="button" className="button-unstyled link link--underline relative">Guía de tallas</button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['3Y', '4Y', '5Y', '6Y', '7Y', '8Y'].map((size, i) => (
                      <label key={i} className="variant-option__button-label focus-within--absolute" style={{ cursor: 'pointer', border: '1px solid #ddd', padding: '10px 16px', borderRadius: '4px', background: i === 0 ? '#000' : '#fff', color: i === 0 ? '#fff' : '#000' }}>
                        <input type="radio" name="Size" value={size} defaultChecked={i === 0} style={{ position: 'absolute', opacity: 0 }} />
                        <span className="variant-option__button-label__text">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Inventory Status */}
            <div className="product-inventory spacing-style" style={{ '--padding-block-end': '1.6rem' } as any}>
              <span className="product-inventory__status notification--success">
                <span className="inline-flex icon product-inventory__icon product-inventory__icon-in_stock">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="none" d="M0 0h256v256H0z"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="m40 144 56 56L224 72"></path></svg>
                </span>
                <span className="product-inventory__text">En stock y listo para enviar</span>
              </span>
            </div>

            {/* Buy Buttons */}
            <span className="buy-buttons-block">
              <div>
                <form method="post" action="/cart/add" className="shopify-product-form" data-type="add-to-cart-form">
                  <div className="product-form-buttons spacing-style" style={{ '--padding-block-end': '0' } as any}>
                    
                    <div className="flex gap-4 mb-4">
                      <div className="quantity-selector relative inline-flex" style={{ border: '1px solid #ddd', borderRadius: '40px', overflow: 'hidden' }}>
                        <button className="quantity-minus quantity-button button-unstyled absolute flex items-center justify-center text-center cursor-pointer pointer-events-auto" type="button" onClick={(e) => { e.preventDefault(); setQty(Math.max(1, qty - 1)); }} style={{ width: '44px', height: '100%', left: 0, top: 0 }}>
                          <span className="icon icon--minus icon--small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"></path><path x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M3.125 10L16.875 10"></path></svg></span>
                        </button>
                        <input className="quantity-input w-full text-center" type="number" value={qty} readOnly style={{ width: '100px', height: '48px', border: 'none', textAlign: 'center', background: 'transparent' }} />
                        <button className="quantity-plus quantity-button button-unstyled absolute flex items-center justify-center text-center cursor-pointer pointer-events-auto" type="button" onClick={(e) => { e.preventDefault(); setQty(qty + 1); }} style={{ width: '44px', height: '100%', right: 0, top: 0 }}>
                          <span className="icon icon--plus icon--small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"></path><path className="icon--plus-line-1" x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M3.125 10L16.875 10"></path><path className="icon--plus-line-2" x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M10 3.125L10 16.875"></path></svg></span>
                        </button>
                      </div>

                      <div className="block flex-1">
                        <button 
                          type="submit" 
                          className="add-to-cart-button btn btn--secondary btn-add-to-cart w-full pointer-events-auto h-full"
                          style={{ borderRadius: '40px', fontWeight: 600, fontSize: '1.4rem' }}
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(product, qty);
                            handleClose();
                          }}
                        >
                          <span className="add-to-cart-text btn__text">
                            <span className="add-to-cart-text__content">Agregar al Carrito</span>
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="accelerated-checkout-block mt-4">
                      <button 
                        type="button" 
                        className="buy-it-now-button btn btn--primary btn-buy-now w-full pointer-events-auto"
                        style={{ padding: '16px', borderRadius: '40px', fontWeight: 600, fontSize: '1.4rem' }}
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(product, qty);
                          window.location.href = '/checkout';
                        }}
                      >
                        <span className="btn__text">Comprar Ahora</span>
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </span>

          </div>
          
          <div className="quick-add__footer mt-4 text-center">
            <a href={`/products/${product.$id}`} className="quick-add__footer-link flex items-center justify-center gap-2 reversed-link" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
              <span className="reversed-link__text">Ver más detalles</span>
              <span className="icon icon--caret-right icon--extra-small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="none" d="M0 0H20V20H0V0z"></path><path points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke-width, 2)" d="M7.5 3.75L13.75 10L7.5 16.25"></path></svg></span>
            </a>
          </div>

        </div>
      </dialog>
    </div>, document.body
  );
}
