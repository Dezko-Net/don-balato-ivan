'use client';

import { useMemo } from 'react';
import type { CartItem } from '@/types';
import { resolveProductDisplayPrice, isDisableDiscounts, type ResolvedProductPrice } from '@/lib/apertura-promo';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { hasVolumePricing, resolveVolumeUnitPrice } from '@/lib/volume-pricing';

export function useCartItemPrice(item: CartItem): {
  unitPrice: number;
  pricing: ResolvedProductPrice;
} {
  const { settings: apertura } = useAperturaPromotion();

  return useMemo(() => {
    const now = Date.now();
    let result: { unitPrice: number; pricing: ResolvedProductPrice } | null = null;

    // 0. Bundle pack pricing: bundleQty at bundle price, extra at normal price
    if (item.bundlePackQty && item.bundlePackQty > 0 && item.bundlePackPrice) {
      const bundleTotal = item.bundlePackQty * item.bundlePackPrice;
      const extraQty = item.quantity - item.bundlePackQty;
      if (extraQty <= 0) {
        result = {
          unitPrice: item.bundlePackPrice,
          pricing: {
            displayPrice: item.bundlePackPrice,
            originalPrice: item.product.PRICE,
            hasDiscount: item.bundlePackPrice < item.product.PRICE,
            discountPercent: item.product.PRICE > 0 ? Math.round(((item.product.PRICE - item.bundlePackPrice) / item.product.PRICE) * 100) : 0,
            fromApertura: false,
          },
        };
      } else {
        // Mixed: bundle qty at bundle price, extra at normal price
        const normalItem = { ...item, bundlePackQty: undefined, bundlePackPrice: undefined, timedOfferPrice: undefined, wholesalePrice: undefined, isPack: undefined };
        const normalPricing = resolveProductDisplayPrice(normalItem.product, apertura);
        const total = bundleTotal + (normalPricing.displayPrice * extraQty);
        const avgPrice = Math.round(total / item.quantity);
        result = {
          unitPrice: avgPrice,
          pricing: {
            displayPrice: avgPrice,
            originalPrice: item.product.PRICE,
            hasDiscount: avgPrice < item.product.PRICE,
            discountPercent: item.product.PRICE > 0 ? Math.round(((item.product.PRICE - avgPrice) / item.product.PRICE) * 100) : 0,
            fromApertura: false,
          },
        };
      }
    }

    // 1. Timed offer
    if (item.timedOfferPrice && item.timedOfferExpiresAt && now < item.timedOfferExpiresAt) {
      result = {
        unitPrice: item.timedOfferPrice,
        pricing: {
          displayPrice: item.timedOfferPrice,
          originalPrice: item.product.PRICE,
          hasDiscount: item.timedOfferPrice < item.product.PRICE,
          discountPercent: 0,
          fromApertura: false,
        },
      };
    }

    // 2. Explicit wholesale price passed via item (e.g. from embalajes or isPack mode addition)
    // Respects WHOLESALEMINQUANTITY: only applies unconditionally for packs or when no minQty is set
    if (!result && item.wholesalePrice !== undefined && (item.isPack || !item.product.WHOLESALEMINQUANTITY || item.product.WHOLESALEMINQUANTITY <= 1 || item.quantity >= item.product.WHOLESALEMINQUANTITY)) {
      result = {
        unitPrice: item.wholesalePrice,
        pricing: {
          displayPrice: item.wholesalePrice,
          originalPrice: item.product.PRICE,
          hasDiscount: item.wholesalePrice < item.product.PRICE,
          discountPercent: item.product.PRICE > 0 ? Math.round(((item.product.PRICE - item.wholesalePrice) / item.product.PRICE) * 100) : 0,
          fromApertura: false,
        },
      };
    }

    // 3. 📦 Precios por volumen (3 niveles: detalle/mayor/caja).
    // El precio unitario baja según la cantidad — sin descuentos artificiales.
    if (!result && hasVolumePricing(item.product)) {
      const unit = resolveVolumeUnitPrice(item.product, item.quantity);
      result = {
        unitPrice: unit,
        pricing: {
          // Sin originalPrice/hasDiscount: el precio por volumen ES el precio,
          // no un "descuento" — nada de tachados ni badges de -X%.
          displayPrice: unit,
          originalPrice: null,
          hasDiscount: false,
          discountPercent: 0,
          fromApertura: false,
        }
      };
    }

    // 4. Regular Wholesale rules
    const pFeatures = Array.isArray(item.product.FEATURES) ? item.product.FEATURES.join('\n') : item.product.FEATURES || '';
    const isExact = /ExactWholesale:\s*true/i.test(pFeatures);
    const minQty = item.product.WHOLESALEMINQUANTITY || 0;
    const qtyMatches = isExact 
      ? item.quantity === minQty 
      : item.quantity >= minQty;

    const hasConfiguredWholesale = !!(item.product.WHOLESALEPRICE && item.product.WHOLESALEMINQUANTITY);
    const effectiveWholesale = (hasConfiguredWholesale && qtyMatches) 
      ? item.product.WHOLESALEPRICE 
      : undefined;

    if (!result && effectiveWholesale) {
      result = {
        unitPrice: effectiveWholesale,
        pricing: {
          displayPrice: effectiveWholesale,
          originalPrice: item.product.PRICE,
          hasDiscount: effectiveWholesale < item.product.PRICE,
          discountPercent: item.product.PRICE > 0 ? Math.round(((item.product.PRICE - effectiveWholesale) / item.product.PRICE) * 100) : 0,
          fromApertura: false,
        },
      };
    }

    // 5. Default Apertura/Live logic
    if (!result) {
      const pricing = resolveProductDisplayPrice(item.product, apertura);
      result = { unitPrice: pricing.displayPrice, pricing };
    }

    return result;
  }, [item, apertura]);
}

export function useCartPricing(items: CartItem[]) {
  const { settings: apertura, isActive: aperturaActive, discountPercent } = useAperturaPromotion();

  return useMemo(() => {
    let subtotal = 0;
    let catalogSubtotal = 0;

    for (const item of items) {
      const now = Date.now();
      let unit = item.product.PRICE;
      const pFeatures = Array.isArray(item.product.FEATURES) ? item.product.FEATURES.join('\n') : item.product.FEATURES || '';
      const isExact = /ExactWholesale:\s*true/i.test(pFeatures);
      const minQty = item.product.WHOLESALEMINQUANTITY || 0;
      const qtyMatches = isExact 
        ? item.quantity === minQty 
        : item.quantity >= minQty;

      const hasConfiguredWholesale = !!(item.product.WHOLESALEPRICE && item.product.WHOLESALEMINQUANTITY);
      if (item.timedOfferPrice && item.timedOfferExpiresAt && now < item.timedOfferExpiresAt) {
        unit = item.timedOfferPrice;
      } else if (hasVolumePricing(item.product)) {
        // 📦 Precios por volumen: el nivel (detalle/mayor/caja) según cantidad
        unit = resolveVolumeUnitPrice(item.product, item.quantity);
      } else if (hasConfiguredWholesale && qtyMatches) {
        unit = item.product.WHOLESALEPRICE!;
      } else if (!hasConfiguredWholesale && item.wholesalePrice && (item.isPack || !item.product.WHOLESALEMINQUANTITY || item.product.WHOLESALEMINQUANTITY <= 1 || item.quantity >= item.product.WHOLESALEMINQUANTITY)) {
        unit = item.wholesalePrice;
      } else {
        unit = resolveProductDisplayPrice(item.product, apertura).displayPrice;
      }

      subtotal += unit * item.quantity;
      catalogSubtotal += item.product.PRICE * item.quantity;
    }

    const aperturaSavings = aperturaActive ? Math.max(0, catalogSubtotal - subtotal) : 0;

    return { subtotal, catalogSubtotal, aperturaSavings, aperturaActive, discountPercent };
  }, [items, apertura, aperturaActive, discountPercent]);
}
