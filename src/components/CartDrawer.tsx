'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/appwrite';
import { useCartItemPrice } from '@/hooks/useCartItemPrice';
import type { CartItem } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', transition: 'opacity .2s' }} />

      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 380,
        background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight .25s ease',
        fontFamily: '"Proxima Nova",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={18} color="#333" />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>Mi carrito ({totalItems})</span>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px', minHeight: 0 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <ShoppingCart size={48} color="#ddd" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: '0 0 6px', fontSize: 15, color: '#666' }}>Tu carrito está vacío</p>
              <p style={{ margin: 0, fontSize: 13, color: '#999' }}>Agrega productos para continuar</p>
            </div>
          ) : (
            items.map(item => (
              <CartDrawerRow
                key={item.product.$id}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ flexShrink: 0, borderTop: '1px solid #f0f0f0', padding: '16px 20px', background: '#fff', position: 'sticky', bottom: 0, zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, color: '#666' }}>Subtotal</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#e396bf' }}>{formatPrice(subtotal)}</span>
            </div>
            <Link href="/carrito" onClick={onClose}
              style={{ display: 'block', width: '100%', padding: '12px 0', background: '#fff', color: '#3483fa', border: '1.5px solid #3483fa', borderRadius: 6, fontSize: 14, fontWeight: 600, textAlign: 'center', textDecoration: 'none', marginBottom: 8 }}>
              Ver carrito
            </Link>
            {typeof document !== 'undefined' && document.cookie.includes('user_country=AR') ? (
              <button disabled style={{ display: 'block', width: '100%', padding: '12px 0', background: '#ccc', color: '#666', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, textAlign: 'center', cursor: 'not-allowed' }}>
                Ventas no disponibles en Argentina
              </button>
            ) : (
              <Link href="/checkout" onClick={onClose}
                style={{ display: 'block', width: '100%', padding: '12px 0', background: '#3483fa', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                Ir a pagar
              </Link>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}

function CartDrawerRow({
  item,
  updateQuantity,
  removeItem,
}: {
  item: CartItem;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}) {
  const { unitPrice, pricing } = useCartItemPrice(item);
  const p = item.product;
  const [incrementMode, setIncrementMode] = useState<'unit' | 'pack'>(item.isPack ? 'pack' : 'unit');

  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
      <div style={{ width: 64, height: 64, borderRadius: 6, background: '#f9f9f9', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        {p.IMAGEURL ? (
          <Image src={p.IMAGEURL} alt={p.NAME} fill style={{ objectFit: 'contain', padding: 4 }} sizes="64px" />
        ) : (
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, color: '#333', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {p.NAME}
        </p>
        {pricing.hasDiscount && pricing.originalPrice != null && (
          <p style={{ margin: '0 0 2px', fontSize: 11, color: '#999', textDecoration: 'line-through' }}>{formatPrice(pricing.originalPrice)}</p>
        )}
        <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: pricing.fromApertura ? '#e396bf' : '#333' }}>{formatPrice(unitPrice)}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 4 }}>
            <button type="button" onClick={() => updateQuantity(p.$id, Math.max(1, item.quantity - (incrementMode === 'pack' ? (p.PACKQTY || 1) : 1)))}
              style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3483fa' }}>
              <Minus size={12} />
            </button>
            <span style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{item.quantity}</span>
            <button type="button" onClick={() => updateQuantity(p.$id, item.quantity + (incrementMode === 'pack' ? (p.PACKQTY || 1) : 1))}
              style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3483fa' }}>
              <Plus size={12} />
            </button>
          </div>

          {p.PACKQTY && p.PACKQTY > 1 && (
            <select
              value={incrementMode}
              onChange={(e) => setIncrementMode(e.target.value as 'unit' | 'pack')}
              style={{
                fontSize: 11,
                padding: '2px 4px',
                borderRadius: 4,
                border: '1px solid #fbcfe8',
                background: incrementMode === 'pack' ? '#fdf2f8' : '#fff',
                color: incrementMode === 'pack' ? '#be185d' : '#6b7280',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="unit">Unidad</option>
              <option value="pack">Pack ({p.PACKQTY})</option>
            </select>
          )}

          <button type="button" onClick={() => removeItem(item.product.$id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4, marginLeft: 'auto' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
