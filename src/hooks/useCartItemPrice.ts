'use client';

import { useMemo } from 'react';
import type { CartItem } from '@/types';
import { resolveProductDisplayPrice, type ResolvedProductPrice } from '@/lib/apertura-promo';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';

export function useCartItemPrice(item: CartItem): {
  unitPrice: number;
  pricing: ResolvedProductPrice;
} {
  const { settings: apertura } = useAperturaPromotion();

  return useMemo(() => {
    const now = Date.now();
    // 1. Timed offer
    if (item.timedOfferPrice && item.timedOfferExpiresAt && now < item.timedOfferExpiresAt) {
      return {
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
    if (item.wholesalePrice !== undefined) {
      return {
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

    // 3. Paquetes: if item.isPack is true, or if qty reaches PACKQTY
    const packQty = item.product.PACKQTY;
    if (item.isPack || (packQty && packQty > 1 && item.quantity >= packQty)) {
      const base = item.product.PRICE || 0;
      let packPrice = base;
      if (item.product.WHOLESALEPRICE && item.product.WHOLESALEPRICE > 0) {
        packPrice = item.product.WHOLESALEPRICE;
      } else {
        const pct = item.product.PACK_DISCOUNT_PCT && item.product.PACK_DISCOUNT_PCT > 0 ? item.product.PACK_DISCOUNT_PCT : 20; // 20 is PACK_BONUS_DISCOUNT_PCT
        packPrice = Math.round(base * (1 - pct / 100));
      }
      return {
        unitPrice: packPrice,
        pricing: {
          displayPrice: packPrice,
          originalPrice: base,
          hasDiscount: packPrice < base,
          discountPercent: base > 0 ? Math.round(((base - packPrice) / base) * 100) : 0,
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

    if (effectiveWholesale) {
      return {
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
    const pricing = resolveProductDisplayPrice(item.product, apertura);
    return { unitPrice: pricing.displayPrice, pricing };
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
      } else if (hasConfiguredWholesale && qtyMatches) {
        unit = item.product.WHOLESALEPRICE!;
      } else if (!hasConfiguredWholesale && item.wholesalePrice) {
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
