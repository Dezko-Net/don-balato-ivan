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
  $createdAt?: string | null;
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

/** Threshold del Live Shopping: 5PM todos los días. */
export function getLiveShoppingThreshold(): Date {
  const now = new Date();
  const today5Pm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0, 0);
  if (now.getTime() >= today5Pm.getTime()) {
    return today5Pm;
  } else {
    const yesterday5Pm = new Date(today5Pm);
    yesterday5Pm.setDate(yesterday5Pm.getDate() - 1);
    return yesterday5Pm;
  }
}

/** Próximo Live Shopping a las 5PM. */
export function getNextLiveShoppingTime(): Date {
  const now = new Date();
  const today5Pm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0, 0);
  if (now.getTime() < today5Pm.getTime()) {
    return today5Pm;
  } else {
    const tomorrow5Pm = new Date(today5Pm);
    tomorrow5Pm.setDate(tomorrow5Pm.getDate() + 1);
    return tomorrow5Pm;
  }
}

/**
 * Determina si un producto de live shopping todavía tiene el 20% off.
 * Reglas:
 * - 20% off durante 1 semana desde que fue importado.
 * - Cada domingo a las 12AM, revierte a 10% off (solo unit, pack vuelve a precio normal).
 * - Si ya pasó un domingo desde la importación, el descuento baja a 10%.
 */
export function getLiveShoppingDiscountPercent(importedAt: string): number {
  const importedTime = new Date(importedAt).getTime();
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  // Si pasó más de una semana, solo 10%
  if (now - importedTime > oneWeek) return 10;

  // Buscar el domingo más reciente a las 00:00 que sea posterior a importedAt
  const importedDate = new Date(importedAt);
  // Encontrar el próximo domingo 00:00 después de importado
  const nextSundayMidnight = new Date(importedDate);
  const dayOfWeek = importedDate.getDay(); // 0=domingo, 6=sábado
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  // Si es domingo y ya pasó medianoche, el próximo domingo es en 7 días
  if (dayOfWeek === 0 && importedDate.getHours() >= 0) {
    // Si fue importado un domingo, el siguiente domingo es +7 días
    nextSundayMidnight.setDate(nextSundayMidnight.getDate() + 7);
  } else {
    nextSundayMidnight.setDate(nextSundayMidnight.getDate() + daysUntilSunday);
  }
  nextSundayMidnight.setHours(0, 0, 0, 0);

  // Si ya pasó un domingo 00:00 desde la importación, bajar a 10%
  if (now >= nextSundayMidnight.getTime()) return 10;

  // Todavía no ha pasado un domingo desde la importación → 20%
  return 20;
}

/** Verifica si un producto es de live shopping (tiene $createdAt válido). */
export function isLiveShoppingProduct(product: ProductPriceLike): boolean {
  return !!(product.$createdAt && product.$createdAt !== '1970-01-01T00:00:00.000Z');
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

  // 0. Live Shopping promotion: 20% off for 1 week, then 10% after Sunday 12AM
  const isLiveShopping = isLiveShoppingProduct(product);
  if (isLiveShopping) {
    const discountPercent = getLiveShoppingDiscountPercent(product.$createdAt!);
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
