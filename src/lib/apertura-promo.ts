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
  WHOLESALEMINQUANTITY?: number | null;
  PACKQTY?: number | null;
  PACK_DISCOUNT_PCT?: number | null;
  UNIT_OFFER_EXPIRES_AT?: number | null;
  $createdAt?: string | null;
  SKU?: string | null;
  DISABLE_DISCOUNTS?: boolean | null;
  FEATURES?: string | string[] | null;
};

export function isDisableDiscounts(product: ProductPriceLike): boolean {
  if (product.DISABLE_DISCOUNTS || product.SKU === 'PROMO1') return true;
  const featuresStr = Array.isArray(product.FEATURES) ? product.FEATURES.join('\n') : (product.FEATURES || '');
  return /DisableDiscounts:\s*true/i.test(featuresStr);
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
  discountPercent: 0,
  minPurchase: 0,
};

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

  // If a product has a wholesale price from 1 unit or less, that is its final display price.
  if (wholesale && wholesale > 0 && product.WHOLESALEMINQUANTITY != null && product.WHOLESALEMINQUANTITY <= 1) {
    return {
      displayPrice: wholesale,
      originalPrice: base > wholesale ? base : null,
      hasDiscount: base > wholesale,
      discountPercent: base > wholesale ? Math.round(((base - wholesale) / base) * 100) : 0,
      fromApertura: false,
    };
  }

  // Bloquear todos los descuentos (checkbox en admin o SKU PROMO1).
  // DEBE ir antes que Live Shopping: ese bloque retorna temprano y todo
  // producto con $createdAt válido caía en el 20% aunque estuviera bloqueado.
  if (isDisableDiscounts(product)) {
    return {
      displayPrice: effectiveBase,
      originalPrice: null,
      hasDiscount: false,
      discountPercent: 0,
      fromApertura: false,
    };
  }

  const unitOfferExpired = !!(product.UNIT_OFFER_EXPIRES_AT && product.UNIT_OFFER_EXPIRES_AT < Date.now());
  // Si hay una cantidad mínima configurada (precio por volumen), la oferta NO se aplica
  // incondicionalmente: solo se activa al alcanzar esa cantidad (gestionado por la lógica
  // de wholesale en carrito/checkout/detalle). Sin cantidad mínima, la oferta es incondicional.
  const hasMinQtyGate = !!(product.WHOLESALEMINQUANTITY && product.WHOLESALEMINQUANTITY > 1);
  const sale =
    product.CURRENTPRICE && product.CURRENTPRICE > 0 && product.CURRENTPRICE < effectiveBase && !unitOfferExpired && !hasMinQtyGate
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
      discountPercent: typeof d.discountPercent === 'number' ? d.discountPercent : 10,
      minPurchase: typeof d.minPurchase === 'number' ? d.minPurchase : 0,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

