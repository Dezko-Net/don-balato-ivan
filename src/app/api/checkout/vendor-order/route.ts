import { NextRequest, NextResponse } from 'next/server';
import { serverGetDocument, serverCreateDocument, serverUpdateDocument, serverListDocuments } from '@/lib/appwrite-server';
import { VENDORS_COLLECTION_ID, VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { deductStockForOrder } from '@/lib/order-stock-service';

export const dynamic = 'force-dynamic';

function buildVendorPrefix(vendor: Record<string, any>): string {
  const name = String(vendor.ORDER_PREFIX || vendor.NAME || 'TIENDA')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  if (vendor.ORDER_PREFIX) return name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'VND';
  const words = name.split(/\s+/).filter(Boolean);
  const initials = words.length > 1 ? words[0][0] + words[words.length - 1][0] : name.slice(0, 2);
  const idSuffix = String(vendor.$id || '').replace(/[^a-zA-Z0-9]/g, '').slice(-2);
  return (initials + idSuffix).toUpperCase().slice(0, 6) || 'VND';
}

async function getNextVendorOrderIndex(vendorId: string): Promise<number> {
  try {
    const qVendor = JSON.stringify({ method: 'equal', attribute: 'VENDOR_ID', values: [vendorId] });
    const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: 'ORDERINDEX' });
    const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
    const res = await serverListDocuments(VENDOR_ORDERS_COLLECTION_ID, [qVendor, qOrderDesc, qLimit1]);
    if (res.documents && res.documents.length > 0) {
      const doc = res.documents[0] as Record<string, unknown>;
      return ((doc.ORDERINDEX as number) || 0) + 1;
    }
    return 1;
  } catch {
    return 1;
  }
}

// Server-side: crea un sub-pedido para un vendor del marketplace. Llamado por el
// checkout del cliente (NO por el vendor) cuando el carrito tiene productos de
// terceros. `vendor_orders` no tiene permisos públicos, así que esto SIEMPRE
// pasa por acá con la API key.
export async function POST(req: NextRequest) {
  try {
    const {
      vendorId, items, customerName, customerRut, customerPhone, customerEmail,
      region, comuna, address, additionalInfo, shippingAgency, subtotal, parentOrderId, userId, orderSource,
    } = await req.json();

    if (!vendorId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Faltan datos del pedido' }, { status: 400 });
    }

    const vendor = await serverGetDocument(VENDORS_COLLECTION_ID, vendorId) as any;
    if (!vendor || !vendor.ACTIVE) {
      return NextResponse.json({ error: 'Vendedor no disponible' }, { status: 404 });
    }

    const computedSubtotal = Number(subtotal) || items.reduce((s: number, it: any) => s + (Number(it.total) || 0), 0);
    // Fase 1: el envío completo queda en el pedido propio; los sub-pedidos de vendor no llevan costo de envío.
    const total = computedSubtotal;

    const orderIndex = await getNextVendorOrderIndex(vendorId);
    const vendorPrefix = buildVendorPrefix(vendor);
    const orderCode = `${vendorPrefix}-${String(orderIndex).padStart(4, '0')}`;
    if (!vendor.ORDER_PREFIX) {
      await serverUpdateDocument(VENDORS_COLLECTION_ID, vendorId, { ORDER_PREFIX: vendorPrefix }).catch(() => {});
    }
    const now = Date.now();

    const order = await serverCreateDocument(VENDOR_ORDERS_COLLECTION_ID, 'unique()', {
      VENDOR_ID: vendorId,
      ORDERCODE: orderCode,
      ORDERINDEX: orderIndex,
      USERID: userId || 'guest',
      ITEMS: JSON.stringify(items),
      CUSTOMERNAME: customerName || '',
      CUSTOMERRUT: customerRut || '',
      CUSTOMERPHONE: customerPhone || '',
      CUSTOMEREMAIL: customerEmail || '',
      REGION: region || '',
      COMUNA: comuna || '',
      ADDRESS: address || '',
      ADDITIONALINFO: additionalInfo || '',
      PAYMENTMETHOD: orderSource === 'whatsapp' ? 'WhatsApp' : 'Transferencia Bancaria',
      ORDER_SOURCE: orderSource || 'web',
      SHIPPINGAGENCY: shippingAgency || '',
      SUBTOTAL: computedSubtotal,
      TOTAL: total,
      // El pedido nace en pending (Stock Confirmado). El cliente debe subir
      // su comprobante de transferencia para pasar a payment_review.
      STATUS: 'pending',
      PARENTORDERID: parentOrderId || '',
      CREATEDAT: now,
      UPDATEDAT: now,
    });

    await deductStockForOrder((order as any).$id, items).catch((stockError) => {
      console.error('[checkout/vendor-order] Error al descontar stock:', stockError);
    });

    return NextResponse.json({ ok: true, orderId: (order as any).$id, orderCode });
  } catch (err: any) {
    console.error('[checkout/vendor-order]', err);
    return NextResponse.json({ error: err.message || 'Error al crear el pedido del vendedor' }, { status: 500 });
  }
}
