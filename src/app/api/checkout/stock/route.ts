import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { serverListDocuments, serverUpdateDocument, serverGetDocument } from '@/lib/appwrite-server';
import { PRODUCTS_COLLECTION_ID, ORDERS_COLLECTION_ID, VENDOR_ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';

export const dynamic = 'force-dynamic';

// ⚠️ Por qué existe este endpoint:
// La colección `products` NO es legible ni escribible desde el navegador en este
// proyecto (permisos sin rol anónimo; por eso el resto de la app lee productos
// vía el proxy con API key). El checkout, sin embargo, usaba el cliente crudo de
// appwrite-admin para leer stock y descontarlo directamente desde el navegador:
//   - La lectura devolvía HTTP 200 con body `{}` (filtrado por permisos), así que
//     `res.documents` era undefined y el `for...of` reventaba con
//     "(intermediate value).documents is not iterable".
//   - El descuento (updateDocument) era un no-op silencioso → el stock nunca
//     bajaba (oversell).
// Aquí la validación y el descuento se hacen server-side con la API key y con
// datos FRESCOS (sin unstable_cache: el stock jamás debe validarse contra caché).

const UNLIMITED_SENTINEL = 99999;
const MAX_ITEMS = 200;

interface StockItem { id: string; qty: number; name?: string; sku?: string; }

// Productos virtuales (bundles/mega pack) que no existen en la BD: no se validan.
function isVirtual(it: StockItem): boolean {
  return it?.sku === 'PROMO1' || (typeof it?.id === 'string' && it.id.startsWith('bundle-'));
}

function sanitize(rawItems: any[]): StockItem[] {
  return (rawItems || [])
    .slice(0, MAX_ITEMS)
    .map((it) => ({
      id: String(it?.id || ''),
      qty: Math.max(0, Math.floor(Number(it?.qty) || 0)),
      name: typeof it?.name === 'string' ? it.name.slice(0, 200) : undefined,
      sku: typeof it?.sku === 'string' ? it.sku : undefined,
    }))
    .filter((it) => it.id && !isVirtual(it));
}

async function loadFreshDocs(ids: string[]): Promise<Record<string, any>> {
  const map: Record<string, any> = {};
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const queries = [
      JSON.stringify({ method: 'equal', attribute: '$id', values: chunk }),
      JSON.stringify({ method: 'limit', values: [100] }),
    ];
    const res = await serverListDocuments(PRODUCTS_COLLECTION_ID, queries);
    for (const doc of res.documents) {
      map[(doc as any).$id] = doc;
    }
  }
  return map;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode: string = body?.mode;
    const items = sanitize(body?.items);
    const ids = [...new Set(items.map((it) => it.id))];
    const docs = ids.length ? await loadFreshDocs(ids) : {};

    // ── VALIDATE: solo lectura, no toca stock ──
    if (mode === 'validate') {
      for (const it of items) {
        const doc = docs[it.id];
        if (!doc) {
          return NextResponse.json({
            ok: false,
            error: `El producto "${it.name || it.id}" ya no está disponible en la tienda. Por favor, elimínalo de tu carrito para continuar.`,
          });
        }
        const stock = Number(doc.STOCK ?? 0);
        if (stock === UNLIMITED_SENTINEL) continue; // ilimitado, no se valida
        if (stock < it.qty) {
          return NextResponse.json({
            ok: false,
            error: `Stock insuficiente para "${doc.NAME || it.name}". Disponible: ${stock}, necesitas: ${it.qty}.`,
          });
        }
      }
      return NextResponse.json({ ok: true });
    }

    // ── DECREMENT: descuenta stock. Requiere un pedido real recién creado ──
    if (mode === 'decrement') {
      const orderId = String(body?.orderId || '');
      if (!orderId) {
        return NextResponse.json({ ok: false, error: 'orderId requerido' }, { status: 400 });
      }
      // Atar el descuento a un pedido existente evita que el endpoint (público)
      // se use para vaciar stock arbitrariamente. Acepta pedidos de `orders` o
      // `vendor_orders` (carrito 100% de vendor usa el vendorOrderId como referencia).
      try {
        await serverGetDocument(ORDERS_COLLECTION_ID, orderId);
      } catch {
        try {
          await serverGetDocument(VENDOR_ORDERS_COLLECTION_ID, orderId);
        } catch {
          return NextResponse.json({ ok: false, error: 'Pedido no encontrado' }, { status: 404 });
        }
      }

      const rollback: { id: string; prev: number }[] = [];
      try {
        for (const it of items) {
          const doc = docs[it.id];
          if (!doc) throw new Error(`El producto "${it.name || it.id}" ya no está disponible en la tienda.`);
          const stock = Number(doc.STOCK ?? 0);
          if (stock === UNLIMITED_SENTINEL) continue; // ilimitado, no se descuenta
          if (stock < it.qty) {
            throw new Error(`Stock insuficiente para "${doc.NAME || it.name}". Disponible: ${stock}, necesitas: ${it.qty}.`);
          }
          await serverUpdateDocument(PRODUCTS_COLLECTION_ID, it.id, { STOCK: stock - it.qty });
          rollback.push({ id: it.id, prev: stock });
        }
        try { revalidateTag('products'); } catch {}
        try { revalidateTag('orders'); } catch {}
        try { revalidateTag('appwrite-proxy'); } catch {}
      } catch (e: any) {
        // Revertir lo ya descontado para no dejar stock inconsistente
        for (const r of rollback) {
          try { await serverUpdateDocument(PRODUCTS_COLLECTION_ID, r.id, { STOCK: r.prev }); } catch {}
        }
        return NextResponse.json({ ok: false, error: e?.message || 'Error al descontar stock' });
      }
      try { revalidateTag('products'); } catch {}
      try { revalidateTag('orders'); } catch {}
      try { revalidateTag('appwrite-proxy'); } catch {}
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: 'mode inválido' }, { status: 400 });
  } catch (error: any) {
    console.error('[API checkout/stock] Error:', error);
    return NextResponse.json({ ok: false, error: error?.message || 'Error interno' }, { status: 500 });
  }
}
