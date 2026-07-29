import { NextRequest, NextResponse } from 'next/server';
import { serverUpdateDocument } from '@/lib/appwrite-server';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'donbalatoivan';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
const ORDERS_COLLECTION = 'orders';
const PRODUCTS_COLLECTION = 'products';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

async function serverGetDocument(collectionId: string, documentId: string) {
  const res = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents/${documentId}`,
    { headers }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `getDocument failed: ${res.status}`);
  }
  return res.json();
}

function computeSubtotal(list: any[]) {
  return list.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
}

function getCustomerEditCount(o: any): number {
  const v = o.CUSTOMEREDITCOUNT ?? o.customerEditCount ?? o.EDITCOUNT ?? o.editCount ?? 0;
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, draftItems, isWholesale } = body as { orderId: string; draftItems: any[]; isWholesale?: boolean };
    const targetCollection = isWholesale ? 'wholesale_orders' : ORDERS_COLLECTION;

    if (!orderId || !Array.isArray(draftItems)) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos o formato incorrecto.' }, { status: 400 });
    }

    if (draftItems.length === 0) {
      return NextResponse.json({ error: 'El pedido debe tener al menos 1 producto.' }, { status: 400 });
    }

    // 1. Obtener pedido actual
    const latest = await serverGetDocument(targetCollection, orderId);
    
    // 2. Validar que el estado permita modificaciones
    const unmodifiableStatuses = ['paid', 'payment_confirmed', 'negotiation', 'shipped', 'delivered', 'cancelled'];
    if (unmodifiableStatuses.includes(latest.STATUS)) {
      return NextResponse.json({
        error: 'No puedes modificar el pedido si ya está verificado, en proceso de preparación o anulado.'
      }, { status: 400 });
    }

    const editCount = getCustomerEditCount(latest);

    let oldItems: any[] = [];
    try {
      oldItems = JSON.parse(latest.ITEMS || '[]');
    } catch {}
    
    const oldQty = new Map<string, number>();
    for (const it of oldItems) {
      oldQty.set(it.id, Number(it.qty) || 0);
    }

    // Normalizar borrador
    const normalizedDraft = draftItems.map(it => {
      const qty = Math.max(1, Number(it.qty) || 1);
      const price = Number(it.price) || 0;
      return {
        id: it.id,
        name: it.name,
        price,
        qty,
        img: it.img || '',
        total: price * qty
      };
    });

    const ids = new Set<string>([...oldItems.map(i => i.id), ...normalizedDraft.map(i => i.id)]);

    // 3. Validar stock (sin modificar nada todavía)
    const validation: { pid: string; currentStock: number; prevQty: number; nextQty: number; delta: number; name: string }[] = [];
    
    for (const pid of ids) {
      const prevQty = oldQty.get(pid) || 0;
      const nextQty = normalizedDraft.find(x => x.id === pid)?.qty || 0;
      const delta = nextQty - prevQty;
      if (delta === 0) continue;

      const productDoc = await serverGetDocument(PRODUCTS_COLLECTION, pid);
      const currentStock = Number(productDoc.STOCK ?? 0);
      const name = String(productDoc.NAME || pid);

      // Si el stock actual es ilimitado (99999), no requiere validación restrictiva
      if (currentStock !== 99999 && delta > 0 && currentStock < delta) {
        return NextResponse.json({
          error: `Stock insuficiente para "${name}". Disponible: ${currentStock}, necesitas: ${delta}.`
        }, { status: 400 });
      }

      validation.push({ pid, currentStock, prevQty, nextQty, delta, name });
    }

    // 4. Aplicar cambios en inventario (con rollback si falla alguno)
    const applied: { pid: string; prevStock: number }[] = [];
    try {
      for (const v of validation) {
        // Si el stock es ilimitado, no lo alteramos
        if (v.currentStock === 99999) continue;

        const newStock = v.currentStock - v.delta;
        applied.push({ pid: v.pid, prevStock: v.currentStock });
        
        await serverUpdateDocument(PRODUCTS_COLLECTION, v.pid, { STOCK: newStock });
      }
    } catch (err: any) {
      // Rollback
      for (const a of applied) {
        try {
          await serverUpdateDocument(PRODUCTS_COLLECTION, a.pid, { STOCK: a.prevStock });
        } catch {}
      }
      return NextResponse.json({ error: `Error actualizando inventario: ${err.message}` }, { status: 500 });
    }

    // 5. Guardar pedido actualizado
    const newSubtotal = computeSubtotal(normalizedDraft);
    const discount = Number(latest.DISCOUNT ?? 0) || 0;
    const newTotal = Math.max(0, newSubtotal - discount);

    try {
      await serverUpdateDocument(targetCollection, orderId, {
        ITEMS: JSON.stringify(normalizedDraft),
        SUBTOTAL: newSubtotal,
        TOTAL: newTotal,
        UPDATEDAT: Date.now(),
        CUSTOMEREDITCOUNT: editCount + 1,
      });
    } catch (err: any) {
      // Revertir inventario si falla guardar el pedido
      for (const a of applied) {
        try {
          await serverUpdateDocument(PRODUCTS_COLLECTION, a.pid, { STOCK: a.prevStock });
        } catch {}
      }
      return NextResponse.json({ error: `Error guardando pedido: ${err.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API edit-order] Error:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor.' }, { status: 500 });
  }
}
