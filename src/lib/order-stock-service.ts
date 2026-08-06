import { serverListDocuments, serverUpdateDocument, serverGetDocument } from '@/lib/appwrite-server';
import { PRODUCTS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { revalidateTag } from 'next/cache';

const UNLIMITED_SENTINEL = 99999;

/**
 * Descuenta del inventario Appwrite las cantidades correspondientes a un pedido.
 * Busca por ID de producto primero; si no se encuentra o el item solo trae SKU,
 * busca el producto por SKU en Appwrite Cloud.
 */
export async function deductStockForOrder(orderId: string, rawItems: any[]): Promise<boolean> {
  let itemsToDeduct = rawItems;
  if (typeof rawItems === 'string') {
    try { itemsToDeduct = JSON.parse(rawItems); } catch { itemsToDeduct = []; }
  }

  if (!itemsToDeduct || !Array.isArray(itemsToDeduct) || itemsToDeduct.length === 0) {
    return false;
  }

  let successCount = 0;
  for (const item of itemsToDeduct) {
    const qty = Math.max(0, Math.floor(Number(item.qty ?? item.CANTIDAD ?? item.quantity) || 0));
    if (qty <= 0) continue;

    const productId = item.id || item.pid || item.productId || item.$id;
    let doc: any = null;

    if (productId && typeof productId === 'string' && productId.length > 5) {
      try {
        doc = await serverGetDocument(PRODUCTS_COLLECTION_ID, productId);
      } catch {}
    }

    // Si no se encontró documento por ID, intentar búsqueda por SKU
    if (!doc && item.sku && typeof item.sku === 'string' && item.sku !== '-' && item.sku !== 'undefined') {
      try {
        const qSku = JSON.stringify({ method: 'equal', attribute: 'SKU', values: [item.sku] });
        const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
        const res = await serverListDocuments(PRODUCTS_COLLECTION_ID, [qSku, qLimit1]);
        if (res.documents && res.documents.length > 0) {
          doc = res.documents[0];
        }
      } catch (err) {
        console.warn(`[order-stock-service] Error buscando producto por SKU "${item.sku}":`, err);
      }
    }

    if (doc) {
      const currentStock = Number(doc.STOCK ?? doc.stock ?? 0);
      if (currentStock === UNLIMITED_SENTINEL) continue; // stock ilimitado, no se descuenta

      const newStock = Math.max(0, currentStock - qty);
      try {
        await serverUpdateDocument(PRODUCTS_COLLECTION_ID, doc.$id, { STOCK: newStock });
        successCount++;
        console.log(`[order-stock-service] Stock descontado para producto "${doc.NAME || doc.$id}": ${currentStock} -> ${newStock} (-${qty})`);
      } catch (err) {
        console.error(`[order-stock-service] Error actualizando stock para producto ${doc.$id}:`, err);
      }
    } else {
      console.warn(`[order-stock-service] Producto no encontrado en Appwrite para item:`, item);
    }
  }

  if (successCount > 0) {
    try { revalidateTag('products'); } catch {}
  }
  return successCount > 0;
}

/**
 * Restituye al inventario Appwrite las cantidades correspondientes a un pedido cancelado.
 */
export async function restoreStockForOrder(orderId: string, rawItems: any[]): Promise<boolean> {
  let itemsToRestore = rawItems;
  if (typeof rawItems === 'string') {
    try { itemsToRestore = JSON.parse(rawItems); } catch { itemsToRestore = []; }
  }

  if (!itemsToRestore || !Array.isArray(itemsToRestore) || itemsToRestore.length === 0) {
    return false;
  }

  let successCount = 0;
  for (const item of itemsToRestore) {
    const qty = Math.max(0, Math.floor(Number(item.qty ?? item.CANTIDAD ?? item.quantity) || 0));
    if (qty <= 0) continue;

    const productId = item.id || item.pid || item.productId || item.$id;
    let doc: any = null;

    if (productId && typeof productId === 'string' && productId.length > 5) {
      try {
        doc = await serverGetDocument(PRODUCTS_COLLECTION_ID, productId);
      } catch {}
    }

    if (!doc && item.sku && typeof item.sku === 'string' && item.sku !== '-' && item.sku !== 'undefined') {
      try {
        const qSku = JSON.stringify({ method: 'equal', attribute: 'SKU', values: [item.sku] });
        const qLimit1 = JSON.stringify({ method: 'limit', values: [1] });
        const res = await serverListDocuments(PRODUCTS_COLLECTION_ID, [qSku, qLimit1]);
        if (res.documents && res.documents.length > 0) {
          doc = res.documents[0];
        }
      } catch {}
    }

    if (doc) {
      const currentStock = Number(doc.STOCK ?? doc.stock ?? 0);
      if (currentStock === UNLIMITED_SENTINEL) continue;

      const newStock = currentStock + qty;
      try {
        await serverUpdateDocument(PRODUCTS_COLLECTION_ID, doc.$id, { STOCK: newStock });
        successCount++;
        console.log(`[order-stock-service] Stock restituido para producto "${doc.NAME || doc.$id}": ${currentStock} -> ${newStock} (+${qty})`);
      } catch (err) {
        console.error(`[order-stock-service] Error restituyendo stock para producto ${doc.$id}:`, err);
      }
    }
  }

  if (successCount > 0) {
    try { revalidateTag('products'); } catch {}
  }
  return successCount > 0;
}
