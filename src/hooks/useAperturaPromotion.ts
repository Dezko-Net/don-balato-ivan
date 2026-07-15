'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AperturaSettings } from '@/lib/apertura-promo';

// ── Singleton cache: todos los hooks comparten la misma llamada ──
let cachedSettings: AperturaSettings | null = null;
let cachedClaimed: boolean = false;
let cachedFirstPurchaseActive: boolean = false;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos (antes era 2min con SDK directo, ahora más seguro)
let pendingPromise: Promise<{ settings: AperturaSettings; claimed: boolean; firstPurchaseActive: boolean }> | null = null;

async function loadApertura(isLoggedIn: boolean): Promise<{ settings: AperturaSettings; claimed: boolean; firstPurchaseActive: boolean }> {
  const now = Date.now();
  if (cachedSettings && (now - cacheTimestamp) < CACHE_TTL) {
    // Si ya tenemos caché y no está logueado, o ya tenemos claimed, reusar
    if (!isLoggedIn || cachedClaimed !== undefined) {
      return { settings: cachedSettings, claimed: cachedClaimed, firstPurchaseActive: cachedFirstPurchaseActive };
    }
  }

  // Si ya hay una petición en vuelo, reusar la misma Promise
  if (pendingPromise) return pendingPromise;

  pendingPromise = (async () => {
    try {
      // ── Usa la API route cacheada en vez del SDK directo ──
      const res = await fetch('/api/public-data/apertura');
      const globalSettings: AperturaSettings = res.ok
        ? await res.json()
        : { isActive: true, discountPercent: 10, minPurchase: 0 };

      let claimed = false;
      let firstPurchaseActive = false;
      
      if (isLoggedIn) {
        try {
          const { getServices } = await import('@/lib/appwrite');
          const account = getServices().account;
          const acc = await account.get();
          const prefs = (acc as any).prefs || {};
          claimed = Boolean(prefs.welcomeGiftClaimed);
          firstPurchaseActive = Boolean(prefs.firstPurchaseActive);
        } catch {
          claimed = false;
          firstPurchaseActive = false;
        }
      }
      
      cachedSettings = globalSettings;
      cachedClaimed = claimed;
      cachedFirstPurchaseActive = firstPurchaseActive;
      cacheTimestamp = Date.now();
      return { settings: globalSettings, claimed, firstPurchaseActive };
    } finally {
      pendingPromise = null;
    }
  })();

  return pendingPromise;
}

export function invalidateAperturaCache() {
  cachedSettings = null;
  cachedClaimed = false;
  cachedFirstPurchaseActive = false;
  cacheTimestamp = 0;
  pendingPromise = null;
}

/** Promoción global aplica precios visuales a toda la tienda si está activa en el admin */
export function useAperturaPromotion() {
  const { isLoggedIn } = useAuth();
  const [settings, setSettings] = useState<AperturaSettings | null>(cachedSettings);
  const [hasClaimedGift, setHasClaimedGift] = useState(cachedClaimed);
  const [firstPurchaseActive, setFirstPurchaseActive] = useState(cachedFirstPurchaseActive);
  const [isLoading, setIsLoading] = useState(!cachedSettings);

  useEffect(() => {
    let cancelled = false;

    loadApertura(isLoggedIn).then(({ settings: s, claimed, firstPurchaseActive: fpa }) => {
      if (cancelled) return;
      setSettings(s);
      setHasClaimedGift(claimed);
      setFirstPurchaseActive(fpa);
      setIsLoading(false);
    });

    const onClaimed = () => {
      invalidateAperturaCache();
      loadApertura(isLoggedIn).then(({ settings: s, claimed, firstPurchaseActive: fpa }) => {
        if (cancelled) return;
        setSettings(s);
        setHasClaimedGift(claimed);
        setFirstPurchaseActive(fpa);
      });
    };

    window.addEventListener('apertura-gift-claimed', onClaimed);
    return () => {
      cancelled = true;
      window.removeEventListener('apertura-gift-claimed', onClaimed);
    };
  }, [isLoggedIn]);

  // Si el usuario tiene activo su regalo de primera compra, sobreescribimos la configuración
  const overrideSettings = firstPurchaseActive 
    ? { isActive: true, discountPercent: 20, minPurchase: 0 }
    : null;

  const activeSettings = overrideSettings || settings;
  const canShowDiscount = Boolean(activeSettings?.isActive);
  const effectiveSettings: AperturaSettings | null = canShowDiscount ? activeSettings : null;

  return {
    settings: effectiveSettings,
    isLoading,
    hasClaimedGift,
    isPromotionEnabled: activeSettings?.isActive ?? false,
    isActive: canShowDiscount,
    discountPercent: canShowDiscount ? (activeSettings?.discountPercent ?? 0) : 0,
    minPurchase: activeSettings?.minPurchase ?? 0,
  };
}
