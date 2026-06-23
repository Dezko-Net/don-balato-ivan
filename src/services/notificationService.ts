import { ID, Query } from 'appwrite';
import type { Order, OrderStatus } from '@/types/admin';
import {
  getServices,
  getAppwriteConfig,
  NOTIFICATIONS_COLLECTION,
  USERS_COLLECTION,
} from '@/lib/appwrite';
import {
  serverCreateDocument,
  serverListDocuments,
} from '@/lib/appwrite-server';

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'promo'
  | 'order'
  | 'stock'
  | 'product'
  | 'gift';

export interface CreateNotificationInput {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string;
  broadcast?: boolean;
  link?: string;
  refKey?: string;
}

function buildDataPayload(link?: string, refKey?: string): string | undefined {
  if (!link && !refKey) return undefined;
  return JSON.stringify({ link, refKey });
}

function parseDataField(data?: unknown): { link?: string; refKey?: string } {
  if (!data || typeof data !== 'string') return {};
  try {
    return JSON.parse(data) as { link?: string; refKey?: string };
  } catch {
    return {};
  }
}

export function getNotificationLink(doc: Record<string, unknown>): string | undefined {
  const direct = (doc.link || doc.LINK) as string | undefined;
  if (direct) return direct;
  return parseDataField(doc.data).link;
}

const ORDER_NOTIFY_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'paid',
  'assembling',
  'confirming_stock',
  'stock_confirmed',
  'packing',
  'negotiation',
  'preparing_shipping',
  'ready_to_ship',
  'shipped',
  'delivered',
  'cancelled',
];

const ORDER_STATUS_COPY: Record<
  OrderStatus,
  { title: string; buildMessage: (code: string) => string } | null
> = {
  pending: {
    title: 'Pedido Recibido',
    buildMessage: (c) => `¡Hemos recibido tu pedido ${c}! Estamos a la espera del pago.`,
  },
  processing: {
    title: 'Pago a verificar',
    buildMessage: (c) => `Tu pago del pedido ${c} está siendo verificado.`,
  },
  paid: {
    title: 'Pago verificado',
    buildMessage: (c) => `Tu pago para el pedido ${c} fue verificado con éxito.`,
  },
  assembling: {
    title: 'Imprimiendo etiqueta',
    buildMessage: (c) => `Estamos imprimiendo la etiqueta de tu pedido ${c}.`,
  },
  confirming_stock: {
    title: 'Confirmando stock',
    buildMessage: (c) => `Estamos confirmando el stock de tu pedido ${c} en bodega.`,
  },
  stock_confirmed: {
    title: 'Stock confirmado',
    buildMessage: (c) => `El stock de tu pedido ${c} fue confirmado. ¡Pronto lo embalamos!`,
  },
  packing: {
    title: 'Embalando tu pedido',
    buildMessage: (c) => `Estamos embalando tu pedido ${c}.`,
  },
  negotiation: {
    title: 'Pedido en negociación',
    buildMessage: (c) => `Tu pedido ${c} está en proceso de negociación. Te contactaremos pronto.`,
  },
  preparing_shipping: {
    title: 'Etiqueta de envío lista',
    buildMessage: (c) => `La etiqueta de despacho de tu pedido ${c} ya está lista.`,
  },
  ready_to_ship: {
    title: 'Pedido listo para enviar',
    buildMessage: (c) => `Tu pedido ${c} ya está preparado y etiquetado para ser retirado por la agencia.`,
  },
  shipped: {
    title: 'Pedido despachado',
    buildMessage: (c) => `Tu pedido ${c} salió de la tienda. ¡Pronto lo recibirás!`,
  },
  delivered: {
    title: 'Entregado a la agencia',
    buildMessage: (c) => `Tu pedido ${c} fue entregado a la agencia de transporte.`,
  },
  cancelled: {
    title: 'Pedido cancelado',
    buildMessage: (c) => `Tu pedido ${c} fue cancelado. Si tienes dudas, contáctanos.`,
  },
};

function normalizeRead(doc: Record<string, unknown>): boolean {
  return !!(doc.isRead ?? doc.read ?? doc.READ);
}

/** Crea notificación vía cliente (admin logueado). */
export async function createNotificationClient(input: CreateNotificationInput) {
  const { databases } = getServices();
  const { databaseId } = getAppwriteConfig();
  const payload: Record<string, unknown> = {
    title: input.title,
    message: input.message,
    type: input.type,
    isRead: false,
    userId: input.userId || (input.broadcast ? 'all' : ''),
  };
  const data = buildDataPayload(input.link, input.refKey);
  if (data) payload.data = data;
  return databases.createDocument(databaseId, NOTIFICATIONS_COLLECTION, ID.unique(), payload);
}

/** Crea notificación vía API key (server). */
export async function createNotificationServer(input: CreateNotificationInput) {
  const payload: Record<string, unknown> = {
    title: input.title,
    message: input.message,
    type: input.type,
    isRead: false,
    userId: input.userId || (input.broadcast ? 'all' : ''),
  };
  const data = buildDataPayload(input.link, input.refKey);
  if (data) payload.data = data;
  // Usar 'unique()' para que Appwrite genere el ID automáticamente
  return serverCreateDocument(NOTIFICATIONS_COLLECTION, 'unique()', payload);
}

async function existsByRefKey(refKey: string, userId?: string): Promise<boolean> {
  try {
    const needle = `"refKey":"${refKey}"`;
    const queries = [Query.contains('data', needle), Query.limit(5)];
    if (userId) queries.unshift(Query.equal('userId', userId));
    const res = await serverListDocuments(NOTIFICATIONS_COLLECTION, queries);
    return (res.total ?? res.documents?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function resolveUserIdFromOrder(order: Partial<Order>): Promise<string | null> {
  if (order.USERID && order.USERID !== 'guest') return order.USERID;
  if (!order.CUSTOMEREMAIL) return null;
  try {
    const { databases } = getServices();
    const { databaseId } = getAppwriteConfig();
    const res = await databases.listDocuments(databaseId, USERS_COLLECTION, [
      Query.equal('email', order.CUSTOMEREMAIL),
      Query.limit(1),
    ]);
    const doc = res.documents[0] as { userId?: string } | undefined;
    return doc?.userId || null;
  } catch {
    return null;
  }
}

/** Notifica al cliente cuando cambia el estado del pedido. */
export async function notifyOrderStatusChange(
  order: Partial<Order>,
  previousStatus: OrderStatus | string | undefined,
  newStatus: OrderStatus | string
): Promise<void> {
  if (previousStatus === newStatus) return;
  if (!ORDER_NOTIFY_STATUSES.includes(newStatus as OrderStatus)) return;

  const copy = ORDER_STATUS_COPY[newStatus as OrderStatus];
  if (!copy) return;

  const userId = await resolveUserIdFromOrder(order);
  if (!userId) return;

  const code = order.ORDERCODE || order.$id || 'tu pedido';
  const refKey = `order:${order.$id}:${newStatus}`;

  if (await existsByRefKey(refKey, userId)) return;

  let title = copy.title;
  let message = copy.buildMessage(code);

  if (newStatus === 'ready_to_ship' && order.SHIPPINGAGENCY?.toUpperCase() === 'RETIRO EN TIENDA') {
    title = 'Listo para retirar';
    message = `Tu pedido ${code} está listo para ser retirado en tienda.`;
  }

  await createNotificationClient({
    title,
    message,
    type: 'order',
    userId,
    link: `/cuenta/pedidos`,
    refKey,
  });

  // ── 2. Send Automatic WhatsApp Notification ──
  if (!order.CUSTOMERPHONE) return;
  const msgId = `wa_order_${order.$id}_${newStatus}`;
  try {
    const { getWhatsAppDocId, sendWhatsAppTemplate, formatWhatsAppPhone, addToHistory } = await import('@/lib/whatsapp');
    const { serverGetDocument } = await import('@/lib/appwrite-server');
    const { ADMIN_CHAT_COLLECTION_ID } = await import('@/lib/appwrite-admin');
    
    const docId = getWhatsAppDocId(msgId, 'assistant');
    let alreadySent = false;
    try {
      await serverGetDocument(ADMIN_CHAT_COLLECTION_ID, docId);
      alreadySent = true;
    } catch {
      alreadySent = false;
    }

    if (!alreadySent) {
      const customerName = order.CUSTOMERNAME ? order.CUSTOMERNAME.split(' ')[0] : 'bella';
      const phone = formatWhatsAppPhone(order.CUSTOMERPHONE);
      const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
      const lang = 'es_CL';

      if (!WA_TOKEN) return;

      if (newStatus === 'pending') {
        // ── Plantilla "pedido_recibido" — para pedidos nuevos (status pending) ──
        // Template aprobada por Meta con 2 variables: {{1}} nombre, {{2}} código pedido
        const templateName = 'pedido_recibido';
        const components = [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: customerName },
              { type: 'text', text: `#${code}` }
            ]
          }
        ];

        const waResponse = await sendWhatsAppTemplate(phone, templateName, lang, components, WA_TOKEN);
        const waMessageId = waResponse?.messages?.[0]?.id || 'no-id';

        const simulatedMessage = `[Plantilla Automática - Pedido Recibido] ¡Hola, ${customerName}! 🛍️✨ Hemos recibido tu pedido ${code} con éxito. Pronto te avisaremos cuando cambie de estado. ¡Gracias por confiar en Kevin&Coco Chile! 🇨🇱💖\n\n[DEBUG 📡 phone=${phone} | msgId=${waMessageId}]`;
        await addToHistory(phone, 'assistant', simulatedMessage, msgId);

      } else {
        // ── Plantilla "estado_de_pedido" — para cambios de estado (paid, shipped, etc.) ──
        const STATUS_LABELS: Record<string, string> = {
          processing: 'Procesando',
          paid: 'Pagado',
          assembling: 'En preparación',
          negotiation: 'En negociación / modificando',
          preparing_shipping: 'Etiqueta Lista',
          ready_to_ship: 'Listo para enviar',
          shipped: 'Enviado',
          delivered: 'Entregado',
          cancelled: 'Cancelado'
        };

        const statusLabel = STATUS_LABELS[newStatus] || newStatus;
        const templateName = 'estado_de_pedido';
        const components = [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: customerName },
              { type: 'text', text: `#${code}` },
              { type: 'text', text: statusLabel }
            ]
          }
        ];

        const waResponse = await sendWhatsAppTemplate(phone, templateName, lang, components, WA_TOKEN);
        const waMessageId = waResponse?.messages?.[0]?.id || 'no-id';

        const simulatedMessage = `[Plantilla Automática de Estado] ¡Hola, ${customerName}! 🌸 Soy Kenia de Kevin&Coco Chile 🇨🇱✨ Te escribo feliz para contarte que tu pedido #${code} ya cambió de estado a: ${statusLabel} 🥳🎉\n\nSi tienes cualquier duda o quieres saber más, ¡escríbeme por aquí mismo!\n\n[DEBUG 📡 phone=${phone} | msgId=${waMessageId}]`;
        await addToHistory(phone, 'assistant', simulatedMessage, msgId);
      }
    }
  } catch (e) {
    console.warn('[notifyOrderStatusChange] WhatsApp notif error:', e);
  }
}

/** Oferta activa — broadcast a todos los usuarios logueados. */
export async function notifyTimedOfferActivated(offer: {
  $id: string;
  title?: string;
  productName?: string;
  discountPercentage?: number;
  discountPrice?: number;
}): Promise<void> {
  const refKey = `offer:${offer.$id}:active`;
  if (await existsByRefKey(refKey)) return;

  const name = offer.productName || offer.title || 'producto';
  const pct = offer.discountPercentage ? ` (${offer.discountPercentage}% OFF)` : '';
  const priceVal = offer.discountPrice ? ` a sólo $${new Intl.NumberFormat('es-CL').format(offer.discountPrice)}` : '';

  await createNotificationServer({
    title: '¡Nueva oferta disponible!',
    message: `Aprovecha la oferta en ${name}${priceVal}${pct}.`,
    type: 'promo',
    broadcast: true,
    userId: 'all',
    link: '/ofertas',
    refKey,
  });
}

/** Producto nuevo — broadcast. */
export async function notifyNewProduct(product: {
  $id: string;
  NAME?: string;
}): Promise<void> {
  const refKey = `product:${product.$id}:new`;
  if (await existsByRefKey(refKey)) return;

  await createNotificationServer({
    title: '¡Nuevo producto!',
    message: `Ya está disponible: ${product.NAME || 'un producto nuevo'} en el catálogo.`,
    type: 'product',
    broadcast: true,
    userId: 'all',
    link: `/productos/${product.$id}`,
    refKey,
  });
}

/** Cupón o regalo sin reclamar. */
export async function notifyUnclaimedReward(
  userId: string,
  kind: 'welcome_gift' | 'coupon',
  detail?: string
): Promise<void> {
  const refKey = `${kind}:${userId}`;
  if (await existsByRefKey(refKey, userId)) return;

  const isGift = kind === 'welcome_gift';
  await createNotificationServer({
    title: isGift ? '¡Tienes un regalo de bienvenida!' : '¡Cupón disponible!',
    message: isGift
      ? 'Reclamá tu regalo de bienvenida antes de que expire.'
      : detail || 'Tienes un cupón disponible para tu próxima compra.',
    type: 'gift',
    userId,
    link: isGift ? '/cuenta/regalos' : '/cuenta/regalos',
    refKey,
  });
}

export async function markNotificationRead(documentId: string) {
  const { databases } = getServices();
  const { databaseId } = getAppwriteConfig();
  await databases.updateDocument(databaseId, NOTIFICATIONS_COLLECTION, documentId, {
    isRead: true,
  });
}

export function isNotificationUnread(doc: Record<string, unknown>): boolean {
  return !normalizeRead(doc);
}
