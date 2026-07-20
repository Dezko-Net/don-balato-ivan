'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback, useRef } from 'react';
import { CartItem, Product } from '@/types';
import { useToast } from '@/components/Toast';
import { resolveProductDisplayPrice } from '@/lib/apertura-promo';
import { useAperturaPromotion } from '@/hooks/useAperturaPromotion';
import { hasVolumePricing, resolveVolumeUnitPrice } from '@/lib/volume-pricing';
import { useAuth } from '@/hooks/useAuth';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { getServices, getAppwriteConfig } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number, timedOfferPrice?: number, timedOfferExpiresAt?: number, wholesalePrice?: number, isPack?: boolean) => void;
  hasPackItems: boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number, isPack?: boolean) => void;
  clearCart: () => void;
  updateCartWithLiveProducts: (liveProducts: Product[]) => void;
  totalItems: number;
  subtotal: number;
  catalogSubtotal: number;
  aperturaSavings: number;
  getEffectivePrice: (item: CartItem) => number;
  getEffectiveItemTotal: (item: CartItem) => number;
}

// Legacy per-item collection (kept for admin backward compat on read)
const CART_ITEMS_COLLECTION = 'cart_items';
// New: single-document snapshot per user for admin visibility
const CART_SNAPSHOTS_COLLECTION = 'cart_snapshots';

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();
  const { settings: apertura } = useAperturaPromotion();
  const { user, isLoggedIn } = useAuth();
  const { unlimitedStock } = useStoreSettings();
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapshotDocIdRef = useRef<string | null>(null);
  const itemsRef = useRef<CartItem[]>([]);

  // Keep itemsRef in sync with items state
  useEffect(() => { itemsRef.current = items; }, [items]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('yaxsel_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out corrupted or old schema items
          const valid = parsed.filter(item => item && item.product && typeof item.product === 'object' && item.product.$id);
          setItems(valid);
        }
      }
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('yaxsel_cart', JSON.stringify(items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yaxsel:cart-updated'));
    }
  }, [items]);

  const getEffectiveItemTotal = (item: CartItem): number => {
    const now = Date.now();
    
    if (item.timedOfferPrice && item.timedOfferExpiresAt && now < item.timedOfferExpiresAt) {
      return item.timedOfferPrice * item.quantity;
    }
    
    if (item.wholesalePrice !== undefined && (item.isPack || !item.product.WHOLESALEMINQUANTITY || item.product.WHOLESALEMINQUANTITY <= 1 || item.quantity >= item.product.WHOLESALEMINQUANTITY)) {
      return item.wholesalePrice * item.quantity;
    }
    
    // 📦 Precios por volumen (detalle/mayor/caja según cantidad).
    // Reemplaza al viejo wholesale + el descuento artificial de pack (20%),
    // que fue ELIMINADO: ya no existe ningún descuento fabricado en el código.
    // Va ANTES que isPack: con Paquetes oculto, el flag isPack de carritos
    // guardados no debe pisar el nivel de volumen (p. ej. precio caja).
    if (hasVolumePricing(item.product)) {
      return resolveVolumeUnitPrice(item.product, item.quantity) * item.quantity;
    }

    if (item.isPack) {
      const base = item.product.PRICE || 0;
      const packPrice = item.product.WHOLESALEPRICE && item.product.WHOLESALEPRICE > 0 ? item.product.WHOLESALEPRICE : base;
      return packPrice * item.quantity;
    }

    const pFeatures = Array.isArray(item.product.FEATURES) ? item.product.FEATURES.join('\n') : item.product.FEATURES || '';
    const isExact = /ExactWholesale:\s*true/i.test(pFeatures);
    const minQty = item.product.WHOLESALEMINQUANTITY || 0;
    const qtyMatches = isExact ? item.quantity === minQty : item.quantity >= minQty;
    const hasConfiguredWholesale = !!(item.product.WHOLESALEPRICE && item.product.WHOLESALEMINQUANTITY);

    if (hasConfiguredWholesale && qtyMatches) {
      return item.product.WHOLESALEPRICE! * item.quantity;
    }

    const basePriceDisplay = resolveProductDisplayPrice(item.product, apertura).displayPrice;
    return basePriceDisplay * item.quantity;
  };

  const getEffectivePrice = (item: CartItem): number => {
    if (item.quantity === 0) return 0;
    return Math.round(getEffectiveItemTotal(item) / item.quantity);
  };

  const addItem = (product: Product, qty = 1, timedOfferPrice?: number, timedOfferExpiresAt?: number, wholesalePrice?: number, isPack?: boolean) => {
    // Actualización funcional sobre `prev`: los listeners DOM de las plantillas
    // capturan un addItem viejo, y mirar `items` del closure creaba filas
    // duplicadas del mismo producto en clicks consecutivos.
    setItems(prev => {
      const existing = prev.find(i => i.product.$id === product.$id);
      if (existing) {
        const isLimited = product.STOCK !== undefined && product.STOCK !== null && product.STOCK < 99999;
        const maxStock = isLimited ? product.STOCK : 99999;
        const newQty = (!isLimited && unlimitedStock) ? (existing.quantity + qty) : Math.min(existing.quantity + qty, maxStock as number);
        return prev.map(i => i.product.$id === product.$id ? { ...i, quantity: newQty, wholesalePrice, isPack: isPack ?? i.isPack } : i);
      }
      return [...prev, { product, quantity: qty, timedOfferPrice, timedOfferExpiresAt, wholesalePrice, isPack }];
    });
  };

  const hasPackItems = items.some(i => i.isPack === true);

  const removeItem = (productId: string) => {
    const updated = itemsRef.current.filter(i => i.product.$id !== productId);
    setItems(updated);
  };

  const updateQuantity = (productId: string, qty: number, isPack?: boolean) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems(prev => prev.map(i => {
      if (i.product.$id !== productId) return i;
      const isLimited = i.product.STOCK !== undefined && i.product.STOCK !== null && i.product.STOCK < 99999;
      const maxStock = isLimited ? i.product.STOCK : 99999;
      return { 
        ...i, 
        quantity: (!isLimited && unlimitedStock) ? qty : Math.min(qty, maxStock),
        isPack: isPack !== undefined ? isPack : i.isPack
      };
    }));
  };

  const updateCartWithLiveProducts = (liveProducts: Product[]) => {
    setItems(prev => {
      const newItems = prev.map(item => {
        const liveMatch = liveProducts.find(p => p.$id === item.product.$id);
        if (!liveMatch) return item; // If not found, keep as is or we could remove it, but safer to keep.
        
        // Update product data
        const updatedItem = { ...item, product: liveMatch };
        
        // Verify stock limits
        const isLimited = liveMatch.STOCK !== undefined && liveMatch.STOCK !== null && liveMatch.STOCK < 99999;
        const maxStock = isLimited ? liveMatch.STOCK : 99999;
        
        // If live stock is 0 and we enforce stock, qty becomes 0 (which might look weird, but let's just clamp)
        if (!unlimitedStock && isLimited && updatedItem.quantity > maxStock) {
          updatedItem.quantity = Math.max(0, maxStock);
        }
        
        return updatedItem;
      });
      return newItems.filter(i => i.quantity > 0);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + getEffectiveItemTotal(i), 0),
    [items, apertura],
  );
  const catalogSubtotal = useMemo(
    () => items.reduce((s, i) => s + i.product.PRICE * i.quantity, 0),
    [items],
  );
  const aperturaSavings = useMemo(
    () => (apertura?.isActive ? Math.max(0, catalogSubtotal - subtotal) : 0),
    [apertura, catalogSubtotal, subtotal],
  );

  return (
    <CartContext.Provider value={{ items, addItem, hasPackItems, removeItem, updateQuantity, clearCart, updateCartWithLiveProducts, totalItems, subtotal, catalogSubtotal, aperturaSavings, getEffectivePrice, getEffectiveItemTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
