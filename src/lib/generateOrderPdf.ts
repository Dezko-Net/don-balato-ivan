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
  existingWindow?: Window | null,
) {
  const printableItems = items.filter(i => !(i as any).missing);
  const hasSku = (productExtraInfo && printableItems.some(i => i.id && productExtraInfo[i.id]?.sku)) || printableItems.some(i => (i as any).sku);
  const hasLocations = productExtraInfo && printableItems.some(i => i.id && productExtraInfo[i.id]?.location?.label);
  const hasImages = printableItems.some(i => (i as any).img || (i as any).imageUrl);
  const statusLabel = STATUS_LABELS[order.STATUS] || order.STATUS;
  const date = formatDate(order.CREATEDAT);
  const subtotal = order.SUBTOTAL || items.reduce((s, i) => s + (i.total || i.price * i.qty), 0);
  const total = order.TOTAL || subtotal;
  const discount = order.DISCOUNT || (order as any).DISCOUNTAMOUNT || (subtotal - total > 0 ? subtotal - total : 0);

  const itemsHtml = printableItems.map(i => {
    const extra = i.id ? productExtraInfo?.[i.id] : null;
    const loc = extra?.location?.label || null;
    const sku = extra?.sku || (i as any).sku || '';
    const note = (i as any).note || '';
    const original = (i as any).replacedOriginal || (i as any).originalItem;
    const isReplacement = !!(i as any).isCanjeReplacement || !!((i as any).replaced && original);
    const img = (i as any).img || (i as any).imageUrl || '';
    const imgHtml = img
      ? `<img src="${img}" style="width:48px;height:48px;object-fit:contain;border:1px solid #e5e7eb;border-radius:6px;padding:2px;background:#fff;" />`
      : `<div style="width:48px;height:48px;border:1px solid #e5e7eb;border-radius:6px;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-size:9px;color:#9ca3af;">Sin img</div>`;
    const replacementLabel = isReplacement
      ? `<span style="display:inline-block;margin-left:6px;padding:2px 6px;border-radius:4px;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;font-size:10px;font-weight:700;">(Reemplazado)</span>`
      : '';
    const originalHtml = isReplacement && original?.name
      ? `<div style="margin-top:5px;padding:4px 6px;border-left:3px solid #f59e0b;background:#fffbeb;color:#92400e;font-size:10px;">Anterior faltante: ${original.name}${original.sku ? ` · SKU: ${original.sku}` : ''}</div>`
      : '';
    return `
    <tr style="page-break-inside:avoid;break-inside:avoid;">
      ${hasImages ? `<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center;">${imgHtml}</td>` : ''}
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;">
        <div style="font-weight:600;">${i.name}${replacementLabel}</div>
        ${originalHtml}
        ${note ? `<div style="font-size:11px;color:#d97706;background:#fffbeb;border:1px solid #fef3c7;padding:3px 6px;border-radius:4px;margin-top:4px;display:inline-block;">💬 Nota: ${note}</div>` : ''}
      </td>
      ${hasSku ? `<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#2563eb;text-align:center;font-weight:600;font-family:monospace;">${sku || '—'}</td>` : ''}
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f1f5f9; color: #0f172a; padding: 32px; margin: 0; }
    .sheet { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 40px rgba(15,23,42,0.10); border: 1px solid #e2e8f0; }
    @media print {
      body { padding: 0; background: #fff; }
      .sheet { box-shadow: none; border: none; border-radius: 0; max-width: none; }
      .no-print { display: none !important; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="sheet">
  <!-- Brand header -->
  <div style="background:linear-gradient(135deg,#1d4ed8 0%,#2563eb 55%,#3b82f6 100%);color:#fff;padding:28px 40px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:38px;height:38px;border-radius:9px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;">DB</div>
          <div style="line-height:1.1;">
            <div style="font-size:17px;font-weight:800;letter-spacing:.5px;">DON BALATO IVÁN</div>
            <div style="font-size:11px;opacity:.85;">Productos para el hogar · Santiago de Chile</div>
          </div>
        </div>
        <h1 style="font-size:22px;font-weight:800;letter-spacing:.3px;">Comprobante de Pedido</h1>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:.8;">N° de pedido</div>
        <div style="font-size:22px;font-weight:800;margin:2px 0 8px;">${order.ORDERCODE}</div>
        <span style="display:inline-block;padding:4px 14px;border-radius:999px;background:rgba(255,255,255,0.2);font-size:12px;font-weight:700;border:1px solid rgba(255,255,255,0.35);">${statusLabel}</span>
      </div>
    </div>
  </div>

  <!-- Meta bar -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 40px;background:#eff6ff;border-bottom:1px solid #dbeafe;font-size:12px;color:#1e3a8a;">
    <span><strong style="color:#1d4ed8;">Fecha de emisión:</strong> ${date}</span>
    <span style="font-family:monospace;color:#3b82f6;">${order.ORDERCODE}</span>
  </div>

  <div style="padding:28px 40px 36px;">

  <!-- Customer info -->
  <div style="display:flex;gap:16px;margin-bottom:${customerNote ? '16px' : '28px'};">
    <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;">
      <p style="font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Cliente</p>
      <p style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:3px;">${order.CUSTOMERNAME || '-'}</p>
      <p style="font-size:13px;color:#475569;">${order.CUSTOMERRUT || ''}</p>
      <p style="font-size:13px;color:#475569;">${order.CUSTOMERPHONE || ''}</p>
      <p style="font-size:13px;color:#475569;">${order.CUSTOMEREMAIL || ''}</p>
    </div>
    <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;">
      <p style="font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Envío</p>
      <p style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:3px;">${order.SHIPPINGAGENCY || 'A coordinar'}</p>
      <p style="font-size:13px;color:#475569;">${order.ADDRESS || ''}</p>
      <p style="font-size:13px;color:#475569;">${[order.COMUNA, order.REGION].filter(Boolean).join(', ')}</p>
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
      <tr style="background:#eff6ff;">
        ${hasImages ? '<th style="padding:11px 8px;text-align:center;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #bfdbfe;">Img</th>' : ''}
        <th style="padding:11px 8px;text-align:left;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #bfdbfe;">Producto</th>
        ${hasSku ? '<th style="padding:11px 8px;text-align:center;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #bfdbfe;">SKU</th>' : ''}
        ${hasLocations ? '<th style="padding:11px 8px;text-align:center;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #bfdbfe;">Sección</th>' : ''}
        <th style="padding:11px 8px;text-align:center;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #bfdbfe;">Cant.</th>
        <th style="padding:11px 8px;text-align:right;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #bfdbfe;">P. Unit.</th>
        <th style="padding:11px 8px;text-align:right;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:.4px;border-bottom:2px solid #bfdbfe;">Total</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>

  <!-- Totals -->
  <div style="margin-left:auto;width:290px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;">
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:14px;">
      <span style="color:#64748b;">Subtotal</span>
      <span style="color:#0f172a;font-weight:600;">${formatPrice(subtotal)}</span>
    </div>
    ${discount > 0 ? `
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:14px;">
      <span style="color:#059669;">Descuento${order.COUPONCODE ? ' (' + order.COUPONCODE + ')' : ''}</span>
      <span style="color:#059669;font-weight:700;">-${formatPrice(discount)}</span>
    </div>` : ''}
    <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:14px;">
      <span style="color:#64748b;">Envío</span>
      <span style="color:${order.SHIPPINGCOST > 0 ? '#0f172a' : '#059669'};font-weight:600;font-size:${order.SHIPPINGCOST > 0 ? '14px' : '12px'};">
        ${order.SHIPPINGCOST > 0 ? formatPrice(order.SHIPPINGCOST) : 'Pago contraentrega'}
      </span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;margin-top:10px;background:linear-gradient(135deg,#1d4ed8,#2563eb);border-radius:9px;font-size:18px;font-weight:800;color:#fff;">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  </div>

  <!-- Footer -->
  <div style="margin-top:36px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="font-size:12px;color:#475569;">Este documento es un comprobante de tu pedido. Consérvalo como referencia.</p>
    <p style="font-size:11px;color:#94a3b8;margin-top:4px;">DON BALATO IVÁN · Estación Central, Chacabuco 08, Santiago de Chile · Generado automáticamente</p>
  </div>

  </div><!-- /padding -->
  </div><!-- /sheet -->

  <!-- Print button (non-print) -->
  <div class="no-print" style="text-align:center;margin-top:24px;">
    <button onclick="window.print()" style="padding:13px 34px;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 18px rgba(37,99,235,0.35);">
      Imprimir / Guardar PDF
    </button>
  </div>
</body>
</html>`;

  const printWindow = existingWindow || window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
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
