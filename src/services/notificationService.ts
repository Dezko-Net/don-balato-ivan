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
  'processing',
  'paid',
  'assembling',
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
  pending: null,
  processing: {
    title: 'Pago a verificar',
    buildMessage: (c) => `Tu pago del pedido ${c} está siendo verificado.`,
  },
  paid: {
    title: 'Pago verificado',
    buildMessage: (c) => `Tu pago para el pedido ${c} fue verificado con éxito.`,
  },
  assembling: {
    title: 'Pedido armándose',
    buildMessage: (c) => `Tu pedido ${c} está siendo armado en nuestro almacén.`,
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
    title: 'Pedido enviado',
    buildMessage: (c) => `Tu pedido ${c} fue despachado. ¡Pronto lo recibirás!`,
  },
  delivered: {
    title: 'Pedido entregado',
    buildMessage: (c) => `Tu pedido ${c} fue entregado. ¡Gracias por tu compra!`,
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
