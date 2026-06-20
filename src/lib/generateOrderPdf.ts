import { Order, OrderItem } from '@/types';
import type { ProductWarehouseLocation } from '@/lib/product-features';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_LABELS: Record<string, string> = {
  pending:            'Pendiente',
  processing:         'Pago a verificar',
  paid:               'Pago verificado',
  assembling:         'Armando',
  preparing_shipping: 'Etiqueta lista',
  ready_to_ship:      'Pedido listo para enviar',
  shipped:            'Enviado',
  delivered:          'Entregado',
  cancelled:          'Cancelado',
};

export interface ProductExtraInfo {
  sku?: string;
  location?: ProductWarehouseLocation | null;
}

export function generateOrderPdf(
  order: Order,
  items: OrderItem[],
  productExtraInfo?: Record<string, ProductExtraInfo>,
) {
  const hasSku = productExtraInfo && items.some(i => i.id && productExtraInfo[i.id]?.sku);
  const hasLocations = productExtraInfo && items.some(i => i.id && productExtraInfo[i.id]?.location?.label);
  const statusLabel = STATUS_LABELS[order.STATUS] || order.STATUS;
  const date = formatDate(order.CREATEDAT);
  const subtotal = order.SUBTOTAL || items.reduce((s, i) => s + (i.total || i.price * i.qty), 0);
  const total = order.TOTAL || subtotal;
  const discount = order.DISCOUNT || (order as any).DISCOUNTAMOUNT || (subtotal - total > 0 ? subtotal - total : 0);

  const itemsHtml = items.map(i => {
    const extra = i.id ? productExtraInfo?.[i.id] : null;
    const loc = extra?.location?.label || null;
    const sku = extra?.sku || '';
    const note = (i as any).note || '';
    return `
    <tr style="page-break-inside:avoid;break-inside:avoid;">
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;">
        <div style="font-weight:600;">${i.name}</div>
        ${note ? `<div style="font-size:11px;color:#d97706;background:#fffbeb;border:1px solid #fef3c7;padding:3px 6px;border-radius:4px;margin-top:4px;display:inline-block;">💬 Nota: ${note}</div>` : ''}
      </td>
      ${hasSku ? `<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#7c3aed;text-align:center;font-weight:600;font-family:monospace;">${sku || '—'}</td>` : ''}
      ${hasLocations ? `<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#4338ca;text-align:center;font-weight:600;">${loc || '—'}</td>` : ''}
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666;text-align:center;">${i.qty}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666;text-align:right;">${formatPrice(i.price)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;text-align:right;font-weight:600;">${formatPrice(i.total || i.price * i.qty)}</td>
    </tr>
  `;
  }).join('');

  const customerNote = (order as any).CUSTOMERNOTE || '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pedido ${order.ORDERCODE}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #333; padding: 40px; max-width: 700px; margin: 0 auto; }
    @media print {
      body { padding: 20px; max-width: none; }
      .no-print { display: none !important; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #db2777;">
    <div>
      <h1 style="font-size:24px;font-weight:700;color:#db2777;margin-bottom:4px;">Comprobante de Pedido</h1>
      <p style="font-size:13px;color:#999;">${date}</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:20px;font-weight:700;color:#333;">${order.ORDERCODE}</p>
      <span style="display:inline-block;padding:3px 12px;border-radius:12px;background:#fdf2f8;font-size:12px;font-weight:600;color:#db2777;border:1px solid #fbcfe8;">${statusLabel}</span>
    </div>
  </div>

  <!-- Customer info -->
  <div style="display:flex;gap:40px;margin-bottom:${customerNote ? '16px' : '28px'};">
    <div style="flex:1;">
      <p style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:6px;">Cliente</p>
      <p style="font-size:14px;font-weight:600;color:#333;margin-bottom:2px;">${order.CUSTOMERNAME || '-'}</p>
      <p style="font-size:13px;color:#666;">${order.CUSTOMERRUT || ''}</p>
      <p style="font-size:13px;color:#666;">${order.CUSTOMERPHONE || ''}</p>
      <p style="font-size:13px;color:#666;">${order.CUSTOMEREMAIL || ''}</p>
    </div>
    <div style="flex:1;">
      <p style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:6px;">Envío</p>
      <p style="font-size:14px;font-weight:600;color:#333;margin-bottom:2px;">${order.SHIPPINGAGENCY || 'A coordinar'}</p>
      <p style="font-size:13px;color:#666;">${order.ADDRESS || ''}</p>
      <p style="font-size:13px;color:#666;">${[order.COMUNA, order.REGION].filter(Boolean).join(', ')}</p>
    </div>
  </div>

  ${customerNote ? `
  <div style="margin-bottom:28px;background:#fffbeb;border:1px solid #fef3c7;padding:12px;border-radius:8px;">
    <p style="font-size:11px;font-weight:700;color:#d97706;text-transform:uppercase;margin-bottom:4px;">Nota del Cliente</p>
    <p style="font-size:13px;color:#92400e;">${customerNote}</p>
  </div>
  ` : ''}

  <!-- Items table -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f8f9fa;">
        <th style="padding:10px 6px;text-align:left;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;border-bottom:2px solid #e0e0e0;">Producto</th>
        ${hasSku ? '<th style="padding:10px 6px;text-align:center;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;border-bottom:2px solid #e0e0e0;">SKU</th>' : ''}
        ${hasLocations ? '<th style="padding:10px 6px;text-align:center;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;border-bottom:2px solid #e0e0e0;">Sección</th>' : ''}
        <th style="padding:10px 6px;text-align:center;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;border-bottom:2px solid #e0e0e0;">Cant.</th>
        <th style="padding:10px 6px;text-align:right;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;border-bottom:2px solid #e0e0e0;">P. Unit.</th>
        <th style="padding:10px 6px;text-align:right;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;border-bottom:2px solid #e0e0e0;">Total</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>

  <!-- Totals -->
  <div style="margin-left:auto;width:260px;">
    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;">
      <span style="color:#666;">Subtotal</span>
      <span style="color:#333;">${formatPrice(subtotal)}</span>
    </div>
    ${discount > 0 ? `
    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;">
      <span style="color:#00a650;">Descuento${order.COUPONCODE ? ' (' + order.COUPONCODE + ')' : ''}</span>
      <span style="color:#00a650;font-weight:600;">-${formatPrice(discount)}</span>
    </div>` : ''}
    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;">
      <span style="color:#666;">Envío</span>
      <span style="color:${order.SHIPPINGCOST > 0 ? '#333' : '#00a650'};font-size:${order.SHIPPINGCOST > 0 ? '14px' : '12px'};">
        ${order.SHIPPINGCOST > 0 ? formatPrice(order.SHIPPINGCOST) : 'Pago contraentrega'}
      </span>
    </div>
    <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:2px solid #333;font-size:18px;font-weight:700;">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  </div>

  <!-- Footer -->
  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e0e0e0;text-align:center;">
    <p style="font-size:12px;color:#999;">Este documento es un comprobante de tu pedido. Consérvalo como referencia.</p>
    <p style="font-size:11px;color:#ccc;margin-top:4px;">Generado automáticamente</p>
  </div>

  <!-- Print button (non-print) -->
  <div class="no-print" style="text-align:center;margin-top:24px;">
    <button onclick="window.print()" style="padding:12px 32px;background:#db2777;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;">
      Imprimir / Guardar PDF
    </button>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    // Auto-trigger print dialog after a brief delay
    setTimeout(() => printWindow.print(), 500);
  }
}

export function generateReplacementPdf(
  orderCode: string,
  replacements: { original: { name: string; sku: string; price: number; qty: number; img?: string }; newItems: { name: string; sku: string; price: number; qty: number; img?: string }[] }[]
) {
  const fmtP = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n);

  const replacementRows = replacements.map((r, idx) => {
    const origTotal = r.original.price * r.original.qty;
    const newTotal = r.newItems.reduce((s, n) => s + n.price * n.qty, 0);
    const diff = newTotal - origTotal;

    const origImg = r.original.img
      ? `<img src="${r.original.img}" style="width:100px;height:100px;object-fit:contain;border:1px solid #e5e7eb;border-radius:8px;padding:4px;background:#fff;" />`
      : `<div style="width:100px;height:100px;border:1px solid #e5e7eb;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-size:11px;color:#9ca3af;">Sin imagen</div>`;

    const newItemsHtml = r.newItems.map(n => {
      const nImg = n.img
        ? `<img src="${n.img}" style="width:80px;height:80px;object-fit:contain;border:1px solid #d1fae5;border-radius:8px;padding:4px;background:#fff;" />`
        : `<div style="width:80px;height:80px;border:1px solid #d1fae5;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#f0fdf4;font-size:10px;color:#9ca3af;">Sin imagen</div>`;
      return `
        <div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #f0fdf4;">
          ${nImg}
          <div style="flex:1;">
            <p style="font-size:13px;font-weight:600;color:#065f46;">${n.name}</p>
            <p style="font-size:11px;color:#6b7280;margin-top:2px;">SKU: <span style="font-family:monospace;font-weight:600;color:#7c3aed;">${n.sku || '—'}</span></p>
            <p style="font-size:12px;color:#374151;margin-top:2px;">${fmtP(n.price)} c/u × ${n.qty} = <strong>${fmtP(n.price * n.qty)}</strong></p>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom:24px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;page-break-inside:avoid;break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#4f46e5;color:#fff;font-size:12px;font-weight:700;">${idx + 1}</span>
          <span style="font-size:14px;font-weight:700;color:#374151;">Reemplazo ${idx + 1}</span>
        </div>
        <div style="display:flex;gap:24px;">
          <!-- Original -->
          <div style="flex:1;padding:12px;background:#fef2f2;border-radius:10px;border:1px solid #fecaca;">
            <p style="font-size:11px;font-weight:700;color:#dc2626;text-transform:uppercase;margin-bottom:8px;">Producto Original</p>
            <div style="display:flex;gap:12px;align-items:flex-start;">
              ${origImg}
              <div style="flex:1;">
                <p style="font-size:13px;font-weight:600;color:#7f1d1d;">${r.original.name}</p>
                <p style="font-size:11px;color:#991b1b;margin-top:4px;">SKU: <span style="font-family:monospace;font-weight:600;">${r.original.sku || '—'}</span></p>
                <p style="font-size:12px;color:#374151;margin-top:4px;">${fmtP(r.original.price)} c/u × ${r.original.qty}</p>
                <p style="font-size:14px;font-weight:700;color:#7f1d1d;margin-top:4px;">Total: ${fmtP(origTotal)}</p>
              </div>
            </div>
          </div>
          <!-- Arrow -->
          <div style="display:flex;align-items:center;justify-content:center;">
            <span style="font-size:28px;color:#9ca3af;">→</span>
          </div>
          <!-- New products -->
          <div style="flex:1;padding:12px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
            <p style="font-size:11px;font-weight:700;color:#059669;text-transform:uppercase;margin-bottom:8px;">Nuevo(s) Producto(s)</p>
            ${newItemsHtml}
            <div style="margin-top:8px;padding-top:8px;border-top:2px solid #bbf7d0;">
              <p style="font-size:14px;font-weight:700;color:#065f46;">Total reemplazo: ${fmtP(newTotal)}</p>
              ${diff > 0
                ? `<p style="font-size:12px;font-weight:600;color:#059669;margin-top:2px;">Saldo a favor: +${fmtP(diff)}</p>`
                : diff < 0
                ? `<p style="font-size:12px;font-weight:600;color:#ea580c;margin-top:2px;">Diferencia en contra: -${fmtP(Math.abs(diff))}</p>`
                : `<p style="font-size:12px;font-weight:600;color:#6b7280;margin-top:2px;">Sin diferencia</p>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cambios de Pedido ${orderCode}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
    @media print {
      body { padding: 20px; max-width: none; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #4f46e5;">
    <div>
      <h1 style="font-size:22px;font-weight:700;color:#4f46e5;">Resumen de Cambios</h1>
      <p style="font-size:13px;color:#999;margin-top:4px;">${new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:18px;font-weight:700;color:#333;">${orderCode}</p>
      <span style="display:inline-block;padding:3px 12px;border-radius:12px;background:#eef2ff;font-size:12px;font-weight:600;color:#4f46e5;border:1px solid #c7d2fe;">${replacements.length} reemplazo(s)</span>
    </div>
  </div>

  ${replacementRows}

  <div class="no-print" style="text-align:center;margin-top:24px;">
    <button onclick="window.print()" style="padding:12px 32px;background:#4f46e5;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">
      Imprimir / Guardar PDF
    </button>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}
