'use client';

import { Product } from '@/types';

interface Props {
  product: Product;
  style?: React.CSSProperties;
}

export default function ProductBadges({ product, style }: Props) {
  const badges: { label: string; bg: string; color: string }[] = [];

  // New: created in last 7 days
  const createdAt = (product as any).$createdAt;
  if (createdAt) {
    const created = new Date(createdAt).getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - created < sevenDays) {
      badges.push({ label: 'Nuevo', bg: '#fef9c3', color: '#a16207' });
    }
  }

  // Best seller: sold > 20
  if (product.SOLDQUANTITY && product.SOLDQUANTITY >= 20) {
    badges.push({ label: 'Más vendido', bg: '#fef3c7', color: '#92400e' });
  }

  // On sale
  if (product.CURRENTPRICE && product.CURRENTPRICE > 0 && product.CURRENTPRICE < product.PRICE) {
    const pct = Math.round(((product.PRICE - product.CURRENTPRICE) / product.PRICE) * 100);
    badges.push({ label: `-${pct}%`, bg: '#fef9c3', color: '#a16207' });
  }

  // Low stock
  if (product.STOCK != null && product.STOCK > 0 && product.STOCK <= 5) {
    badges.push({ label: 'Stock renovado', bg: '#fef3c7', color: '#b7791f' });
  }

  if (badges.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, ...style }}>
      {badges.map((b, i) => (
        <span key={i} className="pk-badge" style={{
          fontSize: 10, fontWeight: 800, padding: '4px 9px',
          borderRadius: 999, background: b.bg, color: b.color,
          lineHeight: 1.2, whiteSpace: 'nowrap',
          border: '1px solid rgba(202,138,4,0.15)',
        }}>
          {b.label}
        </span>
      ))}
    </div>
  );
}
