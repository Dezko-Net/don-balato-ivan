import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, markAsRead, getHistory, addToHistory, clearHistory } from '@/lib/whatsapp';
import { serverListDocuments, serverUpdateDocument } from '@/lib/appwrite-server';
import {
  PRODUCTS_COLLECTION_ID,
  ORDERS_COLLECTION_ID,
} from '@/lib/appwrite-admin';

// ─── Config ────────────────────────────────────────────────────────────────────
const WA_TOKEN        = process.env.WHATSAPP_ACCESS_TOKEN || '';
const VERIFY_TOKEN    = process.env.WHATSAPP_VERIFY_TOKEN || 'yaxsel_webhook_2026';
const ENV_ADMINS = process.env.ADMIN_WHATSAPP_NUMBER || '';
const FALLBACK_ADMINS = '56936599658,56992139185,56935623858,56967115685';
const ADMIN_PHONES_RAW = ENV_ADMINS ? `${ENV_ADMINS},${FALLBACK_ADMINS}` : FALLBACK_ADMINS;
const ADMIN_PHONES     = ADMIN_PHONES_RAW.split(',').map(num => num.replace(/\D/g, '').trim());
const GEMINI_KEY      = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBFSkLS9QYq66R7rD9Tyhz1sU3yuMSdaUo';
const GEMINI_MODELS   = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];
const SITE_URL        = process.env.NEXT_PUBLIC_SITE_URL || 'https://yaxsell.vercel.app';

// ─── Admin system prompt ───────────────────────────────────────────────────────
const ADMIN_PROMPT = `Eres Yexy IA, el asistente administrativo de Kevin&Coco por WhatsApp.
Estás hablando con el DUEÑO/ADMINISTRADOR de la tienda.

## Capacidades de Admin:
- Ver pedidos pendientes de pago, en proceso, en negociación, enviados, entregados, etc.
- Consultar stock de productos.
- Ver resumen de ventas.
- Responder preguntas sobre la tienda y productos.
- Dar consejos de gestión.
- Manipular estados de pedidos (ej: cancelar, poner como pagado, en negociación, en preparación, enviado, entregado, etc.).

## Comandos reconocidos (interpreta variaciones naturales):
- "pedidos pendientes" → muestra los últimos pedidos con estado pendiente de pago
- "pedidos en negociación" → muestra los pedidos que están en estado "En negociación / mod."
- "pedidos de hoy" → pedidos del día
- "stock de [producto]" → consulta stock
- "resumen del día / ventas" → resumen rápido
- "limpiar historial" → borra la conversación
- "cancela el pedido [código/número]" / "marca como pagado el pedido [código/número]" → modifica el estado de un pedido

## Capacidad de Modificar Pedidos:
Si el administrador te pide cancelar, marcar como pagado, despachado, etc., un pedido (ya sea usando el número de pedido tipo "ORD-00051" o la terminación del código tipo "63AD3A"), DEBES generar al final de tu respuesta el siguiente bloque de acción JSON exacto:
[ACTION:UPDATE_ORDER]{"code":"CODIGO_O_NUMERO_PEDIDO","status":"NUEVO_ESTADO"}[/ACTION]

Valores válidos para "status" en la acción JSON:
- "pending" (Pendiente de pago)
- "paid" (Pagado)
- "assembling" (En preparación)
- "negotiation" (Negociado / En negociación)
- "preparing_shipping" (Preparando Despacho)
- "ready_to_ship" (Etiqueta Lista / Listo para retirar)
- "shipped" (Enviado)
- "delivered" (Entregado)
- "cancelled" (Cancelado)

Ejemplo de respuesta si piden cancelar:
"Entendido. He procedido a cancelar el pedido #ORD-00051.
[ACTION:UPDATE_ORDER]{\"code\":\"ORD-00051\",\"status\":\"cancelled\"}[/ACTION]"

## Capacidad de Negociación y Faltantes:
- Si el administrador te dice que un producto no hay en un pedido (ej: "en el pedido ORD-00051 no hay los abanicos"), debes generar:
[ACTION:MARK_MISSING]{"code":"ORD-00051","products":["abanicos"]}[/ACTION]
Y preguntar siempre: "¿Deseas que notifique al cliente para que elija reemplazos?"
- Si el administrador te dice que notifiques al cliente (ej: "sí, avísale al cliente de ese pedido"), debes generar:
[ACTION:NOTIFY_NEGOTIATION]{"code":"ORD-00051"}[/ACTION]

## Formato de respuesta:
- Usa emojis con moderación para mayor claridad.
- Sé conciso y directo.
- Para las listas de pedidos, muestra SIEMPRE:
  1. El número de pedido (ORDERCODE, ej: #ORD-00051) en lugar del código de documento.
  2. El nombre real del cliente (CUSTOMERNAME).
  3. El total de la compra en pesos chilenos.
  4. El estado del pedido TRADUCIDO AL ESPAÑOL (ej: 'Pendiente de pago' en lugar de 'pending', 'Pagado' en lugar de 'paid', 'Enviado' en lugar de 'shipped', 'Cancelado' en lugar de 'cancelled').
- NUNCA uses nombres de estados en inglés (como 'pending', 'paid', 'shipped') en tus textos ni listas. Menciónalos siempre en español.
- Máx 3-4 pedidos por mensaje para no saturar.

## 🧮 CÁLCULOS Y AGREGACIONES:
- Tienes acceso a estadísticas agregadas de ventas (hoy, ayer, esta semana) en el bloque de contexto.
- Si el usuario te pregunta por montos totales, ventas, sumas de pedidos o conteos, responde usando las estadísticas inyectadas o calcula la suma directamente de los pedidos listados.
- Responde siempre con precisión y claridad al hablar de dinero o cantidades. Si te piden "que sumes", "suma los montos", "suba las cantidades" o "monto total", haz la suma matemática exacta de los montos de los pedidos en cuestión.

## IMPORTANTE:
- Siempre responde en español chileno, amigable y profesional.
- Si no puedes ejecutar algo, explica qué puede hacerse desde el panel admin web.
- No inventes datos. Solo muestra datos reales de la base de datos.

Los datos de productos y pedidos te serán inyectados en el contexto.`;

// ─── Customer system prompt ────────────────────────────────────────────────────
const CUSTOMER_PROMPT = `Eres Yexy, la asistente virtual de Kevin&Coco, una tienda en línea chilena.
Eres amigable, empática y profesional. Hablas en español chileno.

## Puedes ayudar con:
- Información de productos (precios, disponibilidad, descripción)
- Buscar productos por categoría o nombre
- Estado de pedidos (si el cliente tiene número de pedido)
- Información de la tienda (horarios, envíos, pagos)
- Políticas de devolución y garantías
- Dudas generales sobre compras

## Información de la tienda:
- Tienda: Kevin&Coco
- Sitio web: ${SITE_URL}
- País: Chile
- Envíos: a todo Chile
- Pagos: efectivo, transferencia, tarjetas

## Reglas:
- NUNCA inventes precios ni stock. Solo di lo que está en los datos reales.
- Si no sabes algo, indica al cliente que visite ${SITE_URL} o espere para contactar al vendedor.
- Sé cálida pero eficiente. Evita respuestas muy largas.
- Máx 2-3 productos por respuesta cuando el cliente busca algo.
- Siempre termina con una pregunta o invitación para seguir ayudando.
- Si el cliente dice "gracias" o "listo", despídete amablemente.

Los datos de productos disponibles te serán inyectados como contexto.`;

// Helper to decide if user message needs Appwrite DB context to save reads
function needsDbContext(text: string): boolean {
  const cleaned = text.toLowerCase().trim();
  if (cleaned.length < 3) return false;

  const pureChitchat = /^(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches|gracias|muchas\s+gracias|adios|chao|ok|okay|listo|perfecto|super|genial|hola\s+yexy|yexy|como\s+estas|cómo\s+estás|que\s+tal|qué\s+tal)$/i;
  return !pureChitchat.test(cleaned);
}

// ─── Webhook verification (GET) ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp] Webhook verificado ✅');
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// ─── Incoming messages handler (POST) ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meta sends test pings with empty changes
    const entry    = body?.entry?.[0];
    const changes  = entry?.changes?.[0];
    const value    = changes?.value;
    const messages = value?.messages;

    if (!messages?.length) {
      return NextResponse.json({ status: 'no_messages' });
    }

    const msg       = messages[0];
    const fromPhone = msg.from as string; // sender's phone number
    const msgId     = msg.id as string;
    const msgType   = msg.type as string;

    // Only handle text messages for now
    if (msgType !== 'text') {
      await sendWhatsAppMessage(
        fromPhone,
        '¡Hola! 👋 Por ahora solo puedo procesar mensajes de texto. Escríbeme tu consulta y te ayudo enseguida.',
        WA_TOKEN
      );
      return NextResponse.json({ status: 'non_text_ignored' });
    }

    const userText = (msg.text?.body as string || '').trim();
    if (!userText) return NextResponse.json({ status: 'empty_text' });

    // Deduplication check
    try {
      const { serverGetDocument } = await import('@/lib/appwrite-server');
      const { ADMIN_CHAT_COLLECTION_ID } = await import('@/lib/appwrite-admin');
      // If we can find wa_msg_${msgId} in the database, it means we already processed this message.
      await serverGetDocument(ADMIN_CHAT_COLLECTION_ID, `wa_msg_${msgId}`);
      console.log(`[WhatsApp Webhook] Duplicate message ${msgId} detected. Skipping.`);
      return NextResponse.json({ status: 'already_processed' });
    } catch (e) {
      // Document not found, proceed.
    }

    const cleanedFrom = fromPhone.replace(/\D/g, '').trim();
    const isAdmin = ADMIN_PHONES.includes(cleanedFrom);
    console.log(`[WhatsApp Webhook] Msg from: ${fromPhone} (cleaned: ${cleanedFrom}) | isAdmin: ${isAdmin} | Admin list:`, ADMIN_PHONES);

    // Mark as read
    await markAsRead(msgId, WA_TOKEN);

    // Handle "limpiar historial" command
    if (userText.toLowerCase().includes('limpiar historial')) {
      await clearHistory(fromPhone);
      await sendWhatsAppMessage(fromPhone, '🗑️ Historial borrado. ¡Empezamos de cero!', WA_TOKEN);
      return NextResponse.json({ status: 'history_cleared' });
    }

    // ── Fetch context from DB ──────────────────────────────────────────────────
    let contextBlock = '';
    if (needsDbContext(userText)) {
      try {
        if (isAdmin) {
          // Admin: get recent orders (up to 100) + products
          const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
          const qLimit100 = JSON.stringify({ method: 'limit', values: [100] });
          const qLimit30 = JSON.stringify({ method: 'limit', values: [30] });

          const [ordersRes, productsRes] = await Promise.all([
            serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qLimit100]),
            serverListDocuments(PRODUCTS_COLLECTION_ID, [qLimit30]),
          ]);

          const recentOrders = ordersRes.documents || [];

          // Helper to get local date string YYYY-MM-DD in America/Santiago timezone
          const getChileDateStr = (dateInput: string | number | Date) => {
            try {
              return new Date(dateInput).toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
            } catch {
              return '';
            }
          };

          const todayStr = getChileDateStr(new Date());
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getChileDateStr(yesterday);
          const oneWeekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

          const REVENUE_STATUSES = ['paid', 'processing', 'assembling', 'negotiation', 'preparing_shipping', 'ready_to_ship', 'shipped', 'delivered'];
          const STATUS_LABELS: Record<string, string> = {
            pending: 'Pendiente de pago',
            processing: 'Procesando',
            paid: 'Pagado',
            assembling: 'En preparación',
            negotiation: 'En negociación / mod.',
            preparing_shipping: 'Preparando Despacho',
            ready_to_ship: 'Etiqueta Lista',
            shipped: 'Enviado',
            delivered: 'Entregado',
            cancelled: 'Cancelado'
          };

          // 1. Calculate sales statistics from the fetched 100 orders
          let countTotalToday = 0;
          let countPaidToday = 0;
          let amountPaidToday = 0;

          let countTotalYesterday = 0;
          let countPaidYesterday = 0;
          let amountPaidYesterday = 0;

          let countTotalWeek = 0;
          let countPaidWeek = 0;
          let amountPaidWeek = 0;

          let countPendingTotal = 0;

          recentOrders.forEach((o: any) => {
            const statusRaw = o.STATUS || o.status || 'pending';
            const total = Number(o.total || o.TOTAL || 0);
            const ts = o.CREATEDAT || (o.$createdAt ? new Date(o.$createdAt).getTime() : 0);
            const orderDateStr = ts ? getChileDateStr(ts) : '';
            const isPaid = REVENUE_STATUSES.includes(statusRaw);

            if (statusRaw === 'pending') {
              countPendingTotal++;
            }

            // Today
            if (orderDateStr && orderDateStr === todayStr) {
              countTotalToday++;
              if (isPaid) {
                countPaidToday++;
                amountPaidToday += total;
              }
            }

            // Yesterday
            if (orderDateStr && orderDateStr === yesterdayStr) {
              countTotalYesterday++;
              if (isPaid) {
                countPaidYesterday++;
                amountPaidYesterday += total;
              }
            }

            // This week (last 7 days)
            if (ts && ts >= oneWeekAgoMs) {
              countTotalWeek++;
              if (isPaid) {
                countPaidWeek++;
                amountPaidWeek += total;
              }
            }
          });

          // 2. Search for a specific order if code is mentioned in userText
          let queriedOrderBlock = '';
          const potentialCode = userText.match(/(?:ord-)?(\d{2,8})/i) || userText.match(/\b([a-f0-9]{6})\b/i);
          if (potentialCode) {
            const codeUpper = potentialCode[1].toUpperCase().trim();
            let matchedOrder = recentOrders.find((o: any) => {
              const id = o.ORDERCODE || String(o.$id || '').slice(-6).toUpperCase();
              return id.toUpperCase() === codeUpper || id.toUpperCase() === `ORD-${codeUpper}` || String(o.$id || '').toUpperCase().endsWith(codeUpper);
            });

            if (!matchedOrder) {
              try {
                const qCode = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [codeUpper] });
                const resCode = await serverListDocuments(ORDERS_COLLECTION_ID, [qCode, JSON.stringify({ method: 'limit', values: [1] })]);
                if (resCode.documents && resCode.documents.length > 0) {
                  matchedOrder = resCode.documents[0];
                } else {
                  const qCodePrefixed = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [`ORD-${codeUpper}`] });
                  const resCodePrefixed = await serverListDocuments(ORDERS_COLLECTION_ID, [qCodePrefixed, JSON.stringify({ method: 'limit', values: [1] })]);
                  if (resCodePrefixed.documents && resCodePrefixed.documents.length > 0) {
                    matchedOrder = resCodePrefixed.documents[0];
                  }
                }
              } catch (errSearch) {
                console.warn('[WhatsApp] Specific order search error:', errSearch);
              }
            }

            if (matchedOrder) {
              const statusRaw = String(matchedOrder.STATUS || matchedOrder.status || 'pending') as string;
              const statusLabel = STATUS_LABELS[statusRaw] || statusRaw;
              const dateStr = matchedOrder.$createdAt ? new Date(String(matchedOrder.$createdAt)).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }) : '?';
              
              queriedOrderBlock = `\n\n## 🔍 PEDIDO CONSULTADO (Coincide con tu búsqueda):
- Código/ID: #${matchedOrder.ORDERCODE || matchedOrder.$id}
- Cliente: ${matchedOrder.CUSTOMERNAME || 'Sin nombre'}
- RUT: ${matchedOrder.CUSTOMERRUT || '-'}
- Teléfono: ${matchedOrder.CUSTOMERPHONE || '-'}
- Dirección: ${matchedOrder.ADDRESS || '-'}, ${matchedOrder.COMUNA || '-'}, ${matchedOrder.REGION || '-'}
- Agencia de Envío: ${matchedOrder.SHIPPINGAGENCY || '-'}
- Total: $${Number(matchedOrder.total || matchedOrder.TOTAL || 0).toLocaleString('es-CL')}
- Estado Actual: ${statusLabel} (${statusRaw})
- Fecha: ${dateStr}`;
            }
          }

          // 3. Format recent 15 orders list for context
          const orders = recentOrders.slice(0, 15).map((o: any) => {
            const id    = o.ORDERCODE || String(o.$id || '').slice(-6).toUpperCase();
            const name  = o.CUSTOMERNAME || 'Sin nombre';
            const total = o.total || o.TOTAL || 0;
            const statusRaw = String(o.STATUS || o.status || 'pending') as string;
            const status = STATUS_LABELS[statusRaw] || statusRaw;
            const date  = o.$createdAt ? new Date(String(o.$createdAt)).toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }) : '?';
            return `#${id} | ${name} | $${Number(total).toLocaleString('es-CL')} | ${status} | ${date}`;
          });

          const products = (productsRes.documents || []).slice(0, 20).map((p: any) =>
            `${p.NAME} | Stock: ${p.STOCK ?? '?'} | Precio: $${p.PRICE ?? '?'}`
          );

          contextBlock = `\n\n## 📊 ESTADÍSTICAS DE VENTAS (Cálculo automático de la base de datos):
- VENTAS HOY (Pagados/Completados): ${countPaidToday} pedidos | Monto total: $${amountPaidToday.toLocaleString('es-CL')} (Total pedidos recibidos hoy: ${countTotalToday})
- VENTAS AYER (Pagados/Completados): ${countPaidYesterday} pedidos | Monto total: $${amountPaidYesterday.toLocaleString('es-CL')} (Total pedidos recibidos ayer: ${countTotalYesterday})
- VENTAS ESTA SEMANA (Últimos 7 días): ${countPaidWeek} pedidos | Monto total: $${amountPaidWeek.toLocaleString('es-CL')} (Total pedidos recibidos esta semana: ${countTotalWeek})
- TOTAL PEDIDOS PENDIENTES DE PAGO: ${countPendingTotal} pedidos
${queriedOrderBlock}

## 📦 ÚLTIMOS PEDIDOS (Mostrando top 15 más recientes):
${orders.join('\n') || 'Sin pedidos.'}

## 🛍️ PRODUCTOS (Top 20 en catálogo):
${products.join('\n') || 'Sin productos.'}`;

        } else {
        // Customer: get products only (no sensitive order data)
        const lowerText = userText.toLowerCase();
        const keywords  = lowerText.split(/\s+/).filter(w => w.length > 2);

        const qLimit50 = JSON.stringify({ method: 'limit', values: [50] });
        const productsRes = await serverListDocuments(PRODUCTS_COLLECTION_ID, [qLimit50]);
        const allProducts = productsRes.documents || [];

        // Try to find relevant products
        let relevant = allProducts;
        if (keywords.length > 0) {
          const matched = allProducts.filter((p: any) => {
            const name = (p.NAME || '').toLowerCase();
            const desc = (p.DESCRIPTION || '').toLowerCase();
            const tags = (p.TAGS || '').toLowerCase();
            return keywords.some(k => name.includes(k) || desc.includes(k) || tags.includes(k));
          });
          if (matched.length > 0) relevant = matched;
        }

        const productList = relevant.slice(0, 15).map((p: any) => {
          const price      = p.CURRENTPRICE || p.PRICE || 0;
          const stock      = p.STOCK ?? 0;
          const stockLabel = stock > 0 ? `✅ Disponible (${stock} uds)` : '❌ Sin stock';
          return `• *${p.NAME}* — $${Number(price).toLocaleString('es-CL')} | ${stockLabel}`;
        });

        contextBlock = `\n\n## 🛍️ CATÁLOGO DISPONIBLE (${relevant.length} productos):\n${productList.join('\n') || 'No encontré productos relacionados.'}\n\nSitio web: ${SITE_URL}`;
      }
    } catch (dbErr) {
      console.warn('[WhatsApp] DB context error:', dbErr);
    }
    }

    // ── Build conversation history for Gemini ─────────────────────────────────
    const history = await getHistory(fromPhone);
    await addToHistory(fromPhone, 'user', userText, msgId);

    const nowChileStr = new Date().toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const timeBlock = `\n\n## 📅 FECHA Y HORA ACTUAL (Chile):
- ${nowChileStr}
(Usa esta fecha como referencia absoluta de "hoy" para determinar qué pedidos corresponden a "hoy", "ayer", etc.)`;

    const systemPrompt = (isAdmin ? ADMIN_PROMPT : CUSTOMER_PROMPT) + timeBlock + contextBlock;

    const contents = [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: userText }] },
    ];

    const geminiBody = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    };

    // ── Call Gemini ────────────────────────────────────────────────────────────
    let aiReply = '❌ Lo siento, no pude procesar tu mensaje en este momento. Intenta de nuevo.';
    let rawText = '';
    for (const model of GEMINI_MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          rawText = text;
          aiReply = text
            .replace(/\[ACTION:[^\]]+\][\s\S]*?\[\/ACTION\]/g, '') // strip any action blocks
            .replace(/\*\*(.*?)\*\*/g, '*$1*') // convert **bold** to WA *bold*
            .trim();
          break;
        }
      }
      if (res.status !== 503) break;
    }

    // ── Action Parsing & Execution (UPDATE_ORDER) ──────────────────────────────
    const actionRegex = /\[ACTION:UPDATE_ORDER\]([\s\S]*?)\[\/ACTION\]/;
    const actionMatch = rawText.match(actionRegex);
    if (actionMatch && isAdmin) {
      try {
        const actionData = JSON.parse(actionMatch[1]);
        const { code, status } = actionData;
        if (code && status) {
          const codeUpper = String(code).toUpperCase().trim();
          let matchedOrder: any = null;

          // Search by ORDERCODE
          const qCode = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [codeUpper] });
          const resCode = await serverListDocuments(ORDERS_COLLECTION_ID, [qCode, JSON.stringify({ method: 'limit', values: [1] })]);
          
          if (resCode.documents && resCode.documents.length > 0) {
            matchedOrder = resCode.documents[0];
          } else {
            // Search last 100 orders for suffix of $id
            const resRecent = await serverListDocuments(ORDERS_COLLECTION_ID, [JSON.stringify({ method: 'limit', values: [100] })]);
            matchedOrder = resRecent.documents.find((o: any) => 
              String(o.$id || '').toUpperCase().endsWith(codeUpper)
            );
          }

          if (matchedOrder) {
            try {
              const oldStatus = matchedOrder.STATUS || matchedOrder.status || 'pending';
              await serverUpdateDocument(ORDERS_COLLECTION_ID, matchedOrder.$id, {
                STATUS: status,
                UPDATEDAT: Date.now()
              });

              // Try notifying
              try {
                const { notifyOrderStatusChange } = await import('@/services/notificationService');
                await notifyOrderStatusChange(matchedOrder, oldStatus, status);
              } catch (errNotif) {
                console.warn('[WhatsApp Webhook] Notification error:', errNotif);
              }
              console.log(`[WhatsApp Webhook] Order ${matchedOrder.$id} status updated to ${status}`);
            } catch (updateErr: any) {
              console.error('[WhatsApp Webhook] serverUpdateDocument failed:', updateErr);
              aiReply = `❌ Hubo un error al intentar actualizar el estado del pedido #${codeUpper} en la base de datos. Detalle: ${updateErr?.message || String(updateErr)}`;
            }
          } else {
            aiReply = `❌ No pude encontrar el pedido #${codeUpper} en la base de datos. Por favor verifica el código e inténtalo de nuevo.`;
          }
        }
      } catch (actionErr) {
        console.error('[WhatsApp Webhook] Action parsing/execution error:', actionErr);
        aiReply = `❌ Hubo un error al procesar la acción del pedido. Por favor inténtalo de nuevo.`;
      }
    }
    // ── Action Parsing & Execution (MARK_MISSING) ──────────────────────────────
    const markMissingRegex = /\[ACTION:MARK_MISSING\]([\s\S]*?)\[\/ACTION\]/;
    const markMissingMatch = rawText.match(markMissingRegex);
    if (markMissingMatch && isAdmin) {
      try {
        const actionData = JSON.parse(markMissingMatch[1]);
        const { code, products } = actionData;
        if (code && Array.isArray(products) && products.length > 0) {
          const codeUpper = String(code).toUpperCase().trim();
          let matchedOrder: any = null;

          const qCode = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [codeUpper] });
          const resCode = await serverListDocuments(ORDERS_COLLECTION_ID, [qCode, JSON.stringify({ method: 'limit', values: [1] })]);
          
          if (resCode.documents && resCode.documents.length > 0) {
            matchedOrder = resCode.documents[0];
          } else {
            const resRecent = await serverListDocuments(ORDERS_COLLECTION_ID, [JSON.stringify({ method: 'limit', values: [100] })]);
            matchedOrder = resRecent.documents.find((o: any) => 
              String(o.$id || '').toUpperCase().endsWith(codeUpper)
            );
          }

          if (matchedOrder) {
            let items = [];
            try { items = JSON.parse(matchedOrder.ITEMS || '[]'); } catch (e) {}
            
            let changed = false;
            for (const prodName of products) {
               const pNameLower = String(prodName).toLowerCase().trim();
               const itemToMark = items.find((i: any) => i.name.toLowerCase().includes(pNameLower) && !i.missing);
               if (itemToMark) {
                 itemToMark.missing = true;
                 changed = true;
                 if (itemToMark.id) {
                    try {
                       await serverUpdateDocument(PRODUCTS_COLLECTION_ID, itemToMark.id, { STOCK: 0 });
                    } catch (e) {
                       console.warn('[WhatsApp] Could not block product stock to 0:', e);
                    }
                 }
               }
            }
            if (changed) {
               await serverUpdateDocument(ORDERS_COLLECTION_ID, matchedOrder.$id, {
                 ITEMS: JSON.stringify(items),
                 STATUS: 'negotiation',
                 UPDATEDAT: Date.now()
               });
               console.log(`[WhatsApp Webhook] Order ${matchedOrder.$id} marked missing for ${products.join(',')}`);
            } else {
               aiReply += `\n⚠️ (Info interna: No encontré los productos mencionados en el pedido #${codeUpper} que no estuvieran ya marcados).`;
            }
          } else {
            aiReply += `\n❌ (Info interna: No encontré el pedido #${codeUpper} en la base de datos).`;
          }
        }
      } catch (err) {
         console.error('[WhatsApp Webhook] MARK_MISSING parsing error:', err);
      }
    }

    // ── Action Parsing & Execution (NOTIFY_NEGOTIATION) ────────────────────────
    const notifyRegex = /\[ACTION:NOTIFY_NEGOTIATION\]([\s\S]*?)\[\/ACTION\]/;
    const notifyMatch = rawText.match(notifyRegex);
    if (notifyMatch && isAdmin) {
      try {
        const actionData = JSON.parse(notifyMatch[1]);
        const { code } = actionData;
        if (code) {
          const codeUpper = String(code).toUpperCase().trim();
          let matchedOrder: any = null;

          const qCode = JSON.stringify({ method: 'equal', attribute: 'ORDERCODE', values: [codeUpper] });
          const resCode = await serverListDocuments(ORDERS_COLLECTION_ID, [qCode, JSON.stringify({ method: 'limit', values: [1] })]);
          if (resCode.documents && resCode.documents.length > 0) {
             matchedOrder = resCode.documents[0];
          } else {
             const resRecent = await serverListDocuments(ORDERS_COLLECTION_ID, [JSON.stringify({ method: 'limit', values: [100] })]);
             matchedOrder = resRecent.documents.find((o: any) => String(o.$id || '').toUpperCase().endsWith(codeUpper));
          }

          if (matchedOrder) {
             // Llama al cron de negociación internamente pasando el orderId
             const cronUrl = `${SITE_URL}/api/cron/negotiation?secret=${process.env.CRON_SECRET || 'negotiation_secret_key_2026'}&orderId=${matchedOrder.$id}`;
             fetch(cronUrl).catch(e => console.error('[WhatsApp] Cron trigger error:', e));
             console.log(`[WhatsApp Webhook] Triggered negotiation cron for order ${matchedOrder.$id}`);
             aiReply += `\n\n✅ Se ha activado la notificación al cliente por WhatsApp para el pedido #${codeUpper}.`;
          } else {
             aiReply += `\n❌ No pude encontrar el pedido #${codeUpper} para notificar.`;
          }
        }
      } catch (err) {
         console.error('[WhatsApp Webhook] NOTIFY_NEGOTIATION parsing error:', err);
      }
    }

    // Save assistant reply to history
    await addToHistory(fromPhone, 'assistant', aiReply, msgId);

    // ── Send reply to WhatsApp ─────────────────────────────────────────────────
    await sendWhatsAppMessage(fromPhone, aiReply, WA_TOKEN);

    return NextResponse.json({ status: 'ok' });

  } catch (err: any) {
    console.error('[WhatsApp webhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
