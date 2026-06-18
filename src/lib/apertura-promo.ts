import { Query } from 'appwrite';
import { getServices, getAppwriteConfig, APERTURA_SETTINGS_COLLECTION } from '@/lib/appwrite';
import type { LiveLogicConfig } from '@/lib/product-features';
import { isLiveLogicLimitedTimeActive } from '@/lib/product-features';

export type AperturaSettings = {
  isActive: boolean;
  discountPercent: number;
  minPurchase: number;
};

export type ProductPriceLike = {
  PRICE: number;
  CURRENTPRICE?: number | null;
  WHOLESALEPRICE?: number | null;
  PACKQTY?: number | null;
  PACK_DISCOUNT_PCT?: number | null;
  UNIT_OFFER_EXPIRES_AT?: number | null;
  imported_at?: string | null;
};

/** Porcentaje de descuento al comprar en paquete (cuando no hay PACK_DISCOUNT_PCT específico). */
export const PACK_BONUS_DISCOUNT_PCT = 20;

/**
 * Precio efectivo por unidad cuando se compra como paquete.
 * Usa WHOLESALEPRICE si está definido; si no, aplica PACK_DISCOUNT_PCT o el 20% base.
 */
export function resolvePackUnitPrice(product: ProductPriceLike): number {
  const base = product.PRICE || 0;
  if (!base) return 0;
  if (product.WHOLESALEPRICE && product.WHOLESALEPRICE > 0) {
    return product.WHOLESALEPRICE;
  }
  const pct = product.PACK_DISCOUNT_PCT && product.PACK_DISCOUNT_PCT > 0
    ? product.PACK_DISCOUNT_PCT
    : PACK_BONUS_DISCOUNT_PCT;
  return Math.round(base * (1 - pct / 100));
}

export type ResolvedProductPrice = {
  displayPrice: number;
  originalPrice: number | null;
  hasDiscount: boolean;
  discountPercent: number;
  fromApertura: boolean;
};

const DEFAULT_SETTINGS: AperturaSettings = {
  isActive: false,
  discountPercent: 20,
  minPurchase: 62500,
};

export function getAperturaDiscountedPrice(price: number, discountPercent: number): number {
  if (!price || discountPercent <= 0) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

export function getLiveShoppingThreshold(): Date {
  const now = new Date();
  const today7Am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0, 0);
  if (now.getTime() >= today7Am.getTime()) {
    return today7Am;
  } else {
    const yesterday7Am = new Date(today7Am);
    yesterday7Am.setDate(yesterday7Am.getDate() - 1);
    return yesterday7Am;
  }
}

/** Precio mostrado: oferta del producto (CURRENTPRICE) tiene prioridad sobre promoción apertura. */
export function resolveProductDisplayPrice(
  product: ProductPriceLike,
  apertura: AperturaSettings | null | undefined,
  liveLogic?: LiveLogicConfig | null,
): ResolvedProductPrice {
  const base = product.PRICE || 0;
  const wholesale = product.WHOLESALEPRICE && product.WHOLESALEPRICE > 0 ? product.WHOLESALEPRICE : null;
  // If PRICE is 0 but WHOLESALEPRICE exists, use wholesale as base
  const effectiveBase = base > 0 ? base : (wholesale ?? 0);

  // 0. Live Shopping promotion override: -20% on live day, -10% otherwise
  const isLiveShoppingProduct = product.imported_at && product.imported_at !== '1970-01-01T00:00:00.000Z';
  if (isLiveShoppingProduct) {
    const importedTime = new Date(product.imported_at!).getTime();
    const thresholdTime = getLiveShoppingThreshold().getTime();
    const isCurrentLive = importedTime >= thresholdTime;
    
    const discountPercent = isCurrentLive ? 20 : 10;
    const displayPrice = Math.round(effectiveBase * (1 - discountPercent / 100));
    
    return {
      displayPrice,
      originalPrice: effectiveBase,
      hasDiscount: true,
      discountPercent,
      fromApertura: false,
    };
  }

  const unitOfferExpired = !!(product.UNIT_OFFER_EXPIRES_AT && product.UNIT_OFFER_EXPIRES_AT < Date.now());
  const sale =
    product.CURRENTPRICE && product.CURRENTPRICE > 0 && product.CURRENTPRICE < effectiveBase && !unitOfferExpired
      ? product.CURRENTPRICE
      : null;

  if (sale != null) {
    return {
      displayPrice: sale,
      originalPrice: effectiveBase,
      hasDiscount: true,
      discountPercent: effectiveBase > 0 ? Math.round(((effectiveBase - sale) / effectiveBase) * 100) : 0,
      fromApertura: false,
    };
  }

  // If a live logic limited-time offer is active, show the live offer price
  if (liveLogic?.limitedTime && isLiveLogicLimitedTimeActive(liveLogic)) {
    const offerPrice = liveLogic.limitedTime.offerPrice;
    if (offerPrice > 0 && offerPrice < effectiveBase) {
      return {
        displayPrice: offerPrice,
        originalPrice: effectiveBase,
        hasDiscount: true,
        discountPercent: Math.round(((effectiveBase - offerPrice) / effectiveBase) * 100),
        fromApertura: false,
      };
    }
  }

  // Suppress apertura discount if live logic has disableApertura flag
  const suppressApertura = liveLogic?.disableApertura === true;

  if (!suppressApertura && apertura?.isActive && apertura.discountPercent > 0 && effectiveBase > 0 && base > 0) {
    const displayPrice = getAperturaDiscountedPrice(effectiveBase, apertura.discountPercent);
    if (displayPrice < effectiveBase) {
      return {
        displayPrice,
        originalPrice: effectiveBase,
        hasDiscount: true,
        discountPercent: apertura.discountPercent,
        fromApertura: true,
      };
    }
  }

  return {
    displayPrice: effectiveBase,
    originalPrice: null,
    hasDiscount: false,
    discountPercent: 0,
    fromApertura: false,
  };
}

export async function fetchAperturaSettings(): Promise<AperturaSettings> {
  try {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    if (!databaseId) return DEFAULT_SETTINGS;
    const res = await databases.listDocuments(databaseId, APERTURA_SETTINGS_COLLECTION, [Query.limit(1)]);
    if (!res.documents.length) return DEFAULT_SETTINGS;
    const d = res.documents[0] as Record<string, unknown>;
    return {
      isActive: !!d.isActive,
      discountPercent: typeof d.discountPercent === 'number' ? d.discountPercent : 20,
      minPurchase: typeof d.minPurchase === 'number' ? d.minPurchase : 62500,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
