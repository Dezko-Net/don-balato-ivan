import { NextRequest, NextResponse } from 'next/server';
import { serverListDocuments, getHeaders, getServerConfig } from '@/lib/appwrite-server';
import { USERS_COLLECTION_ID, ORDERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { MEDIA_BUCKET_ID, MEDIA_PREFIXES } from '@/lib/appwrite';

export interface OrderDetail {
  id: string;
  code: string;
  status: string;
  total: number;
  date: string;
  items: string;
}

export interface CustomerInfo {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  orderCount: number;
  totalSpent: number;
  registered: boolean;
  orders?: OrderDetail[];
}

function phoneVariants(raw: string): string[] {
  const d = raw.replace(/\D/g, '');
  const variants = new Set<string>([d]);
  if (d.startsWith('56') && d.length > 9) {
    variants.add(d.slice(2));
    variants.add(`+${d}`);
    variants.add(`+56${d.slice(2)}`);
  } else if (!d.startsWith('56') && d.length >= 8) {
    variants.add(`56${d}`);
    variants.add(`+56${d}`);
    variants.add(`+${d}`);
  }
  return Array.from(variants);
}

async function getAuthUserPrefs(userId: string): Promise<{ avatarFileId?: string } | null> {
  try {
    const { endpoint, projectId } = getServerConfig();
    const res = await fetch(`${endpoint}/users/${userId}`, { headers: getHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.prefs || null) as { avatarFileId?: string } | null;
  } catch {
    return null;
  }
}

function buildAvatarUrl(fileId: string): string {
  const { endpoint, projectId } = getServerConfig();
      const path = fileId;
  return `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${path}/view?project=${projectId}`;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente de pago',
  processing: 'Procesando',
  paid: 'Pagado',
  assembling: 'En preparación',
  negotiation: 'En negociación',
  preparing_shipping: 'Etiqueta lista',
  ready_to_ship: 'Listo para enviar',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('phones') || '';
  const withDetail = req.nextUrl.searchParams.get('detail') === 'true';
  if (!raw.trim()) return NextResponse.json({ customers: {} });

  const phones = raw.split(',').map(p => p.trim()).filter(Boolean).slice(0, 50);

  const result: Record<string, CustomerInfo> = {};

  await Promise.all(phones.map(async (phone) => {
    const variants = phoneVariants(phone);
    const variantsJson = JSON.stringify({ method: 'equal', attribute: 'phone', values: variants });
    const limit1 = JSON.stringify({ method: 'limit', values: [1] });

    let name: string | null = null;
    let email: string | null = null;
    let avatarUrl: string | null = null;
    let registered = false;

    try {
      const usersRes = await serverListDocuments(USERS_COLLECTION_ID, [variantsJson, limit1]);
      const userDoc = usersRes.documents[0] as any;
      if (userDoc) {
        name = userDoc.name || null;
        email = userDoc.email || null;
        registered = true;

        if (userDoc.userId) {
          const prefs = await getAuthUserPrefs(userDoc.userId);
          if (prefs?.avatarFileId) {
            avatarUrl = buildAvatarUrl(prefs.avatarFileId);
          }
        }
      }
    } catch { /* silently ignore */ }

    let orderCount = 0;
    let totalSpent = 0;
    let orders: OrderDetail[] | undefined;

    try {
      const phoneVarJson = JSON.stringify({ method: 'equal', attribute: 'CUSTOMERPHONE', values: variants });
      const orderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
      const limitOrders = JSON.stringify({ method: 'limit', values: [50] });
      const ordersRes = await serverListDocuments(ORDERS_COLLECTION_ID, [phoneVarJson, orderDesc, limitOrders]);
      const docs = ordersRes.documents as any[];
      orderCount = docs.length;
      if (withDetail) orders = [];
      for (const o of docs) {
        const status = String(o.STATUS || o.status || 'pending');
        const total = Number(o.TOTAL || o.total || 0);
        if (!['pending', 'cancelled'].includes(status)) totalSpent += total;
        if (!name && o.CUSTOMERNAME) name = String(o.CUSTOMERNAME);
        if (!email && o.CUSTOMEREMAIL) email = String(o.CUSTOMEREMAIL);
        if (withDetail && orders) {
          orders.push({
            id: String(o.$id || ''),
            code: String(o.ORDERCODE || String(o.$id || '').slice(-6).toUpperCase()),
            status: STATUS_LABELS[status] || status,
            total,
            date: o.$createdAt ? new Date(String(o.$createdAt)).toLocaleDateString('es-CL', { timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', year: 'numeric' }) : '—',
            items: (() => {
              try {
                const parsed = JSON.parse(o.ITEMS || '[]');
                if (Array.isArray(parsed)) return parsed.slice(0, 3).map((i: any) => i.name || i.NAME || '').filter(Boolean).join(', ') + (parsed.length > 3 ? ` +${parsed.length - 3}` : '');
              } catch {}
              return '';
            })(),
          });
        }
      }
    } catch { /* silently ignore */ }

    result[phone] = { name, email, avatarUrl, orderCount, totalSpent, registered, ...(withDetail ? { orders } : {}) };
  }));

  return NextResponse.json({ customers: result });
}
