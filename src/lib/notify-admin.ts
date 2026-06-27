'use server';

import { sendWhatsAppMessage, formatWhatsAppPhone, addToHistory } from '@/lib/whatsapp';
import { getKeniaRuntimeSnapshot } from '@/lib/kenia-runtime';

const ADMIN_FALLBACK_PHONE = '56936599658';

export async function getAdminAlertPhone(): Promise<string> {
  try {
    const runtime = await getKeniaRuntimeSnapshot();
    if (runtime.config?.adminAlertPhone) {
      return runtime.config.adminAlertPhone;
    }
  } catch {}
  return process.env.ADMIN_WHATSAPP_NUMBER || ADMIN_FALLBACK_PHONE;
}

export async function notifyAdmin(message: string): Promise<void> {
  try {
    const phone = await getAdminAlertPhone();
    const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
    if (!WA_TOKEN) {
      console.warn('[notifyAdmin] No WHATSAPP_ACCESS_TOKEN configured');
      return;
    }
    const formattedPhone = formatWhatsAppPhone(phone);
    await sendWhatsAppMessage(formattedPhone, message, WA_TOKEN);
    await addToHistory(formattedPhone, 'assistant', message);
  } catch (e) {
    console.warn('[notifyAdmin] Failed to send notification:', e);
  }
}

export async function notifyNewOrder(orderCode: string, customerName: string, total: number, itemsCount: number): Promise<void> {
  const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
  await notifyAdmin(`🛒 *NUEVO PEDIDO* #${orderCode}\nCliente: ${customerName}\nTotal: ${fmt(total)}\nProductos: ${itemsCount}`);
}

export async function notifyPaymentUploaded(orderCode: string, customerName: string, imageUrl?: string, orderId?: string): Promise<void> {
  const phone = await getAdminAlertPhone();
  const formattedPhone = formatWhatsAppPhone(phone);
  const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

  if (orderId) {
    try {
      const { recordKeniaUsage } = await import('@/lib/kenia-runtime');
      await recordKeniaUsage(formattedPhone, { pendingOrderId: orderId });
    } catch (e) {
      console.error('[notifyPaymentUploaded] Failed to record usage:', e);
    }
  }

  if (imageUrl && WA_TOKEN) {
    try {
      const { sendWhatsAppTemplate } = await import('@/lib/whatsapp');
      const components = [
        {
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: { link: imageUrl }
            }
          ]
        },
        {
          type: 'body',
          parameters: [
            { type: 'text', text: orderCode },
            { type: 'text', text: customerName }
          ]
        }
      ];
      await sendWhatsAppTemplate(formattedPhone, 'alerta_pago_admin', 'es', components, WA_TOKEN);
      return;
    } catch (e) {
      console.warn('[notifyPaymentUploaded] Failed to send template notification, falling back to text:', e);
    }
  }

  await notifyAdmin(`💳 *PAGO SUBIDO* #${orderCode}\nCliente: ${customerName}\nEl cliente subió el comprobante de transferencia. Revisa y verifica el pago.`);
}

export async function notifyNegotiationOpened(orderCode: string, customerName: string): Promise<void> {
  await notifyAdmin(`👀 *LINK DE NEGOCIACIÓN ABIERTO* #${orderCode}\nCliente: ${customerName}\nEl cliente abrió el link para ver productos faltantes.`);
}

export async function notifyNegotiationPartial(orderCode: string, customerName: string, replacedCount: number, missingCount: number): Promise<void> {
  await notifyAdmin(`🔄 *CAMBIO PARCIAL* #${orderCode}\nCliente: ${customerName}\nReemplazados: ${replacedCount} | Faltan: ${missingCount}\nEl cliente ha reemplazado algunos productos pero aún faltan por cambiar.`);
}

export async function notifyNegotiationComplete(orderCode: string, customerName: string, replacedCount: number): Promise<void> {
  await notifyAdmin(`✅ *CAMBIO COMPLETO* #${orderCode}\nCliente: ${customerName}\nReemplazados: ${replacedCount}\nEl cliente completó todos los reemplazos. Ya puedes continuar con el pedido.`);
}
