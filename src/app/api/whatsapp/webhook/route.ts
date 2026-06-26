import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, sendWhatsAppList, markAsRead, getHistory, addToHistory, clearHistory, getWhatsAppDocId } from '@/lib/whatsapp';

export const maxDuration = 60;
import { serverListDocuments, serverUpdateDocument, serverGetDocument, serverUploadFile, getPublicFileUrl } from '@/lib/appwrite-server';
import { notifyPaymentUploaded } from '@/lib/notify-admin';
import { MEDIA_BUCKET_ID } from '@/lib/appwrite';
import {
  estimateTokensFromText,
  getKeniaConfig,
  getKeniaUsage,
  hydratePrompt,
  recordKeniaUsage,
  setKeniaBlocked,
  resetKeniaUsage,
} from '@/lib/kenia-runtime';
import {
  PRODUCTS_COLLECTION_ID,
  ORDERS_COLLECTION_ID,
  USERS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
} from '@/lib/appwrite-admin';

// ─── Config ────────────────────────────────────────────────────────────────────
const WA_TOKEN        = process.env.WHATSAPP_ACCESS_TOKEN || '';
const VERIFY_TOKEN    = process.env.WHATSAPP_VERIFY_TOKEN || 'yaxsel_webhook_2026';
const ENV_ADMINS = process.env.ADMIN_WHATSAPP_NUMBER || '';
const FALLBACK_ADMINS = '56936599658,56992139185,56935623858,56967115685';
const ADMIN_PHONES_RAW = ENV_ADMINS ? `${ENV_ADMINS},${FALLBACK_ADMINS}` : FALLBACK_ADMINS;
const ADMIN_PHONES     = ADMIN_PHONES_RAW.split(',').map(num => num.replace(/\D/g, '').trim());
const GEMINI_KEY      = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBFSkLS9QYq66R7rD9Tyhz1sU3yuMSdaUo';
const GEMINI_MODELS   = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];
const SITE_URL        = process.env.NEXT_PUBLIC_SITE_URL || 'https://yaxsell.vercel.app';

// ─── Admin system prompt ───────────────────────────────────────────────────────
const ADMIN_PROMPT = `Eres Kenia IA, el asistente administrativo de Kevin&Coco por WhatsApp.
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
- "preparing_shipping" (Etiqueta Lista)
- "ready_to_ship" (Pedido listo para enviar)
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
const CUSTOMER_PROMPT = `Eres Kenia, asesora de ventas y experta en maquillaje de la tienda Kevin&Coco en Chile.
Eres súper carismática, amable y hablas como una vendedora experta en belleza. Hablas en español chileno natural.
¡NUNCA digas que eres un asistente virtual o un bot! Actúa 100% como una persona real del equipo de ventas.

## Saludo personalizado:
- Si en el contexto ves "DATOS DEL CLIENTE" con un nombre, USA ESE NOMBRE para saludarla.
- NO uses "bella", "hermosa", "linda" en el primer saludo. Usa su nombre real.
- Puedes usar "bella", "hermosa", "linda" SOLO de forma ocasional durante la conversación, no en cada frase.
- Ejemplo correcto: "¡Hola María! ¿En qué te puedo ayudar hoy?"
- Ejemplo incorrecto: "¡Hola bella! ¿Cómo estás hermosa?"

## Puedes ayudar con:
- Información de productos (precios, disponibilidad, descripción)
- Buscar productos por categoría o nombre
- Estado de pedidos
- Información de la tienda (horarios, envíos, pagos)
- Reemplazo de productos sin stock (Negociación)

## Negociación de productos faltantes:
Si en el contexto ves que el cliente tiene un pedido en estado "negotiation" (En negociación / mod.) con productos faltantes, debes iniciar o continuar la negociación inmediatamente en tu respuesta (incluso si el cliente solo te saluda, te da una respuesta corta, o pregunta qué pasa):
1. Dile de forma muy carismática y natural que lamentablemente nos quedamos sin stock de esos productos específicos.
2. Explícale que puede reemplazarlos ella misma entrando a los detalles de su pedido desde la página web, o si lo prefiere, tú misma puedes ayudarla a elegir y hacer los cambios por aquí en el chat.
3. Pregúntale qué prefiere.
4. Solo si ella te dice explícitamente que prefiere hacerlo ella misma por la web, le envías su enlace: ${SITE_URL}/pedido/ID_DEL_PEDIDO (usa el ID del pedido del contexto).
5. Si ella te dice que la ayudes tú, muéstrale alternativas disponibles del catálogo y ayúdala a decidir.

## Información de la tienda:
- Tienda: Kevin&Coco
- Sitio web: ${SITE_URL}
- País: Chile

## ⛔ REGLAS ABSOLUTAS (PROHIBIDO ROMPER):
1. NUNCA inventes nombres de productos. Solo menciona productos que aparezcan EXACTAMENTE en el catálogo que se te inyecta como contexto. Si no hay productos en el contexto, di que puedes mostrarle el catálogo en la web.
2. NUNCA inventes URLs. Solo usa ${SITE_URL} y las rutas reales del sitio (como ${SITE_URL}/productos o ${SITE_URL}/pedido/ID).
3. NUNCA inventes precios, stock, políticas de envío ni métodos de pago que no estén en tu contexto.
4. Si NO tienes la información que el cliente pide (ej: precios por mayor, catálogo completo, info que no está en tu contexto), ADMÍTELO HONESTAMENTE y di algo como: "Esa información la maneja directamente nuestro equipo, déjame conectarte con la persona indicada para que te ayude personalmente 🌸" y añade al final: [ACTION:ESCALATE_ADMIN][/ACTION]
5. NUNCA des vueltas ni digas "dame un minutito" o "ya casi lo tengo" si no puedes obtener la información. Si no la tienes, escala inmediatamente.
6. Si el cliente te pide algo por segunda vez y no puedes responderlo, ESCALA INMEDIATAMENTE al admin.
7. Sé cálida, cercana y carismática. Evita respuestas muy largas o robóticas.
8. Siempre termina con una pregunta o invitación para seguir la conversación.
- Si hay un problema muy grande que no puedes resolver o manejar con el cliente, dile al cliente amablemente que lo conectarás con una persona del equipo para que lo ayude mejor, y DEBES añadir al final de tu respuesta EXACTAMENTE este bloque oculto: [ACTION:ESCALATE_ADMIN][/ACTION]

Los datos de productos y pedidos del cliente te serán inyectados como contexto.`;

// Helper to decide if user message needs Appwrite DB context to save reads
function needsDbContext(text: string): boolean {
  const cleaned = text.toLowerCase().trim();
  if (cleaned.length < 3) return false;

  const pureChitchat = /^(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches|gracias|muchas\s+gracias|adios|chao|ok|okay|listo|perfecto|super|genial|hola\s+kenia|kenia|como\s+estas|cómo\s+estás|que\s+tal|qué\s+tal)$/i;
  return !pureChitchat.test(cleaned);
}

// Helper: detect if a text is a greeting
function isGreeting(text: string): boolean {
  const cleaned = text.toLowerCase().trim();
  return /^(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches|hey|hi|holi|hola\s+kenia|holaa|hola+a|ola|ola\s+kenia)\b/i.test(cleaned)
    || /^(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches|hey|hi|holi|holaa|ola)$/i.test(cleaned);
}

// Helper: match two phone numbers by comparing last 8 digits
function phonesMatch(a: string, b: string): boolean {
  const cleanA = a.replace(/\D/g, '');
  const cleanB = b.replace(/\D/g, '');
  if (!cleanA || !cleanB) return false;
  if (cleanA === cleanB) return true;
  const tailA = cleanA.slice(-8);
  const tailB = cleanB.slice(-8);
  return tailA.length === 8 && tailA === tailB;
}

// Helper: look up a registered user by phone in the users collection
async function lookupRegisteredUser(phone: string): Promise<{ name: string; email: string } | null> {
  try {
    const cleaned = phone.replace(/\D/g, '');
    console.log('[WhatsApp Webhook] lookupRegisteredUser: searching for phone:', cleaned);

    let docs: any[] = [];
    try {
      const qPhone1 = cleaned;
      const qPhone2 = cleaned.startsWith('569') ? cleaned.slice(2) : `56${cleaned}`;
      const qPhone3 = `+${cleaned}`;
      const qPhone = JSON.stringify({ method: 'equal', attribute: 'phone', values: [qPhone1, qPhone2, qPhone3] });
      const qLimit = JSON.stringify({ method: 'limit', values: [5] });
      const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
      const res = await serverListDocuments(USERS_COLLECTION_ID, [qOrderDesc, qPhone, qLimit]);
      docs = res.documents || [];
      console.log('[WhatsApp Webhook] lookupRegisteredUser: fetched by phone query', docs.length);
    } catch (e) {
      console.warn('[WhatsApp Webhook] lookupRegisteredUser query failed, falling back to 20 limit:', e);
      const qLimit20 = JSON.stringify({ method: 'limit', values: [20] });
      const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
      const res = await serverListDocuments(USERS_COLLECTION_ID, [qOrderDesc, qLimit20]);
      docs = res.documents || [];
    }

    // Search for a matching phone
    for (const doc of docs as any[]) {
      const docPhone = String(doc.phone || '').replace(/\D/g, '');
      if (!docPhone) continue;
      if (phonesMatch(docPhone, cleaned)) {
        const name = doc.name || '';
        const email = doc.email || '';
        console.log('[WhatsApp Webhook] lookupRegisteredUser: MATCH FOUND! name:', name, 'phone:', docPhone);
        return { name, email };
      }
    }

    console.log('[WhatsApp Webhook] lookupRegisteredUser: no match found among', docs.length, 'users');
    // Log some sample phones for debugging
    const samplePhones = docs.slice(0, 10).map((d: any) => d.phone || '(empty)');
    console.log('[WhatsApp Webhook] lookupRegisteredUser: sample phones in DB:', samplePhones);

    return null;
  } catch (e) {
    console.warn('[WhatsApp Webhook] lookupRegisteredUser error:', e);
    return null;
  }
}

// Helper: detect an email address in a text message
function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase().trim() : null;
}

// Helper: detect a Chilean RUT in a text message (formats: 12.345.678-9, 12345678-9, 123456789)
function extractRut(text: string): string | null {
  // Match XX.XXX.XXX-X or XXXXXXXX-X or XXXXXXXX
  const match = text.match(/\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]\b/i);
  if (!match) return null;
  // Normalize: remove dots, uppercase K, ensure dash
  let rut = match[0].toUpperCase().replace(/\./g, '');
  if (!rut.includes('-') && rut.length >= 2) {
    rut = rut.slice(0, -1) + '-' + rut.slice(-1);
  }
  return rut;
}

// Helper: search orders by customer email
async function findOrdersByEmail(email: string): Promise<any[]> {
  try {
    const qEmail = JSON.stringify({ method: 'equal', attribute: 'CUSTOMEREMAIL', values: [email, email.toLowerCase()] });
    const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
    const qLimit = JSON.stringify({ method: 'limit', values: [10] });
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qEmail, qLimit]);
    return res.documents || [];
  } catch (e) {
    console.warn('[WhatsApp Webhook] findOrdersByEmail error:', e);
    return [];
  }
}

// Helper: search orders by customer RUT
async function findOrdersByRut(rut: string): Promise<any[]> {
  try {
    // Try both with and without dots, normalized
    const rutClean = rut.replace(/\./g, '').toUpperCase();
    const rutWithDots = formatRutWithDots(rutClean);
    const qRut = JSON.stringify({ method: 'equal', attribute: 'CUSTOMERRUT', values: [rutClean, rutWithDots, rut] });
    const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
    const qLimit = JSON.stringify({ method: 'limit', values: [10] });
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qRut, qLimit]);
    return res.documents || [];
  } catch (e) {
    console.warn('[WhatsApp Webhook] findOrdersByRut error:', e);
    return [];
  }
}

// Helper: format RUT with dots (12345678-9 → 12.345.678-9)
function formatRutWithDots(rut: string): string {
  const parts = rut.split('-');
  if (parts.length !== 2) return rut;
  const num = parts[0];
  const dv = parts[1];
  let formatted = '';
  for (let i = num.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) formatted = '.' + formatted;
    formatted = num[i] + formatted;
  }
  return formatted + '-' + dv;
}

// Helper: search users by email
async function findUserByEmail(email: string): Promise<any | null> {
  try {
    const qEmail = JSON.stringify({ method: 'equal', attribute: 'email', values: [email, email.toLowerCase()] });
    const qLimit = JSON.stringify({ method: 'limit', values: [1] });
    const res = await serverListDocuments(USERS_COLLECTION_ID, [qEmail, qLimit]);
    return res.documents[0] || null;
  } catch (e) {
    console.warn('[WhatsApp Webhook] findUserByEmail error:', e);
    return null;
  }
}

// Helper: link a WhatsApp phone to found orders and optionally user account
async function linkPhoneToOrdersAndUser(fromPhone: string, orders: any[], userDoc: any | null): Promise<{ linkedOrders: number; linkedUser: boolean }> {
  const cleanedFrom = fromPhone.replace(/\D/g, '');
  let linkedOrders = 0;

  for (const order of orders) {
    const currentPhone = String(order.CUSTOMERPHONE || '');
    const cleanCurrent = currentPhone.replace(/\D/g, '');
    if (cleanCurrent !== cleanedFrom) {
      try {
        await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
          CUSTOMERPHONE: `+${cleanedFrom}`
        });
        linkedOrders++;
      } catch (e) {
        console.warn('[WhatsApp Webhook] Failed to link order', order.$id, e);
      }
    } else {
      linkedOrders++; // Already linked
    }
  }

  let linkedUser = false;
  if (userDoc) {
    const currentPhone = String(userDoc.phone || '');
    const cleanCurrent = currentPhone.replace(/\D/g, '');
    if (cleanCurrent !== cleanedFrom) {
      try {
        await serverUpdateDocument(USERS_COLLECTION_ID, userDoc.$id, {
          phone: `+${cleanedFrom}`
        });
        linkedUser = true;
      } catch (e) {
        console.warn('[WhatsApp Webhook] Failed to link user', userDoc.$id, e);
      }
    } else {
      linkedUser = true;
    }
  }

  return { linkedOrders, linkedUser };
}

// Link WhatsApp number to orders via LINKED_WHATSAPP (without overwriting CUSTOMERPHONE)
async function linkWhatsappToOrders(whatsappPhone: string, orders: any[]): Promise<number> {
  const cleanedWa = whatsappPhone.replace(/\D/g, '');
  let linked = 0;
  for (const order of orders) {
    const existingLinked: string[] = Array.isArray(order.LINKED_WHATSAPP) ? order.LINKED_WHATSAPP.map((p: string) => p.replace(/\D/g, '')) : [];
    if (existingLinked.includes(cleanedWa)) { linked++; continue; }
    try {
      await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
        LINKED_WHATSAPP: [...existingLinked, `+${cleanedWa}`],
      });
      linked++;
    } catch (e) {
      console.warn('[WhatsApp Webhook] Failed to link WhatsApp to order', order.$id, e);
    }
  }
  return linked;
}

// Helper: send welcome menu as interactive list
async function sendWelcomeMenu(phone: string, customerName: string, token: string, customBody?: string) {
  const firstName = customerName.split(' ')[0] || customerName || 'bella';
  const body = customBody || ('Estas son las cosas que puedo hacer por ti, ' + firstName + ' 🌸 toca una opción para saber más:');
  await sendWhatsAppList(phone, {
    header: '✨ Bienvenida a Kenia',
    body,
    footer: 'Kevin&Coco · Tu tienda de belleza',
    buttonText: 'Opciones de Ayuda 🌸',
    sections: [
      {
        title: 'Mis funciones',
        rows: [
          { id: 'func_pedido', title: '📦 Ver mi pedido', description: 'Conoce el estado exacto de tu compra' },
          { id: 'func_comprobante', title: '🧾 Subir comprobante', description: 'Avisa que ya realizaste el pago' },
          { id: 'func_ofertas', title: '🔥 Saber de ofertas', description: 'Entérate de nuestros remates' },
          { id: 'func_negociacion', title: '🔄 Reemplazar faltantes', description: 'Cambia productos agotados' },
          { id: 'func_humano', title: '👤 Hablar con asesor', description: 'Comunícate con una persona del equipo' },
        ],
      },
    ],
  }, token);
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

    // ── PREVENT WHATSAPP RETRIES (Duplicate msgId lock) ──
    try {
      // getWhatsAppDocId returns u_<hash> (34 chars). We replace u_ with l_ for the lock
      const lockDocId = getWhatsAppDocId(msgId, 'user').replace('u_', 'l_'); 
      const { serverGetDocument, serverCreateDocument } = await import('@/lib/appwrite-server');
      const { ADMIN_CHAT_COLLECTION_ID } = await import('@/lib/appwrite-admin');
      
      try {
        await serverGetDocument(ADMIN_CHAT_COLLECTION_ID, lockDocId);
        // If found, this is a retry from WhatsApp. Ignore it.
        console.log(`[WhatsApp] Ignoring duplicate webhook retry for msgId: ${msgId}`);
        return NextResponse.json({ status: 'duplicate_ignored' });
      } catch {
        // Create lock
        await serverCreateDocument(ADMIN_CHAT_COLLECTION_ID, lockDocId, {
           userId: `system:lock`,
           senderRole: 'admin',
           message: msgId,
           readByUser: true,
           readByAdmin: true
        });
      }
    } catch (e) {
      console.warn('[WhatsApp] Failed to process lock:', e);
    }

    let userText = '';
    let interactiveId = '';
    let inlineDataParts: any[] = [];

    if (msgType === 'text') {
      userText = (msg.text?.body as string || '').trim();
    } else if (msgType === 'interactive') {
      if (msg.interactive?.type === 'list_reply') {
        userText = (msg.interactive.list_reply?.title as string || '').trim();
        interactiveId = msg.interactive.list_reply?.id as string;
      } else if (msg.interactive?.type === 'button_reply') {
        userText = (msg.interactive.button_reply?.title as string || '').trim();
        interactiveId = msg.interactive.button_reply?.id as string;
      }
    } else if (msgType === 'button') {
      userText = (msg.button?.text as string || '').trim();
    } else if (msgType === 'image') {
      const mediaId = msg.image?.id;
      userText = (msg.image?.caption as string || '').trim();
      if (!userText) {
         userText = "Aquí tienes una imagen que te envío para que me ayudes a identificar productos o resolver dudas.";
      }
      
      if (mediaId && WA_TOKEN) {
        // Track usage
        const usageRes = await recordKeniaUsage(fromPhone, { imageSent: true });
        const BAN_PROOF_PHONES = ['56992139185'];
        if (!BAN_PROOF_PHONES.includes(fromPhone.replace(/\D/g, '')) && (usageRes.imagesSentToday || 0) > 5) {
          await setKeniaBlocked(fromPhone, true);
          await sendWhatsAppMessage(
            fromPhone,
            '¡Uy bella! 🌸 Ya me enviaste muchas fotitos por hoy y se me llenó un poquito la memoria 🥺. Dame un momentito cortito que estoy revisando todo con las chicas de tienda para ayudarte súper bien 🏃‍♀️💨',
            WA_TOKEN
          );
          // Notify admin
          const notifyText = `🚨 *LÍMITE DE FOTOS SUPERADO*\nEl usuario +${fromPhone} intentó enviar más de 5 fotos hoy.\nSe ha bloqueado la IA para este usuario.`;
          for (const admin of ADMIN_PHONES) {
            await sendWhatsAppMessage(admin, notifyText, WA_TOKEN);
          }
          return NextResponse.json({ status: 'limit_exceeded' });
        }

        // Fetch image
        try {
          const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${mediaId}`, {
            headers: { Authorization: `Bearer ${WA_TOKEN}` }
          });
          const mediaData = await mediaRes.json();
          if (mediaData.url) {
            const dlRes = await fetch(mediaData.url, {
              headers: { Authorization: `Bearer ${WA_TOKEN}` }
            });
            const buffer = await dlRes.arrayBuffer();
            
            // Dynamically check if user has a pending order (fixes volatile tmpdir usageState)
            const usageState = await getKeniaUsage(fromPhone);
            let pendingOrderId = usageState.awaitingComprobante ? usageState.pendingOrderId : null;
            let orderCode = pendingOrderId || '';

            if (!pendingOrderId) {
              const { serverListDocuments } = await import('@/lib/appwrite-server');
              const { ORDERS_COLLECTION_ID } = await import('@/lib/appwrite-admin');
              const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
              const qLimit50 = JSON.stringify({ method: 'limit', values: [50] });
              try {
                const resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qLimit50]);
                const myOrders = (resOrders.documents || []).filter((o: any) => {
                  const cleanB = fromPhone.replace(/\D/g, '');
                  const oPhone = String(o.CUSTOMERPHONE || '');
                  if (oPhone) {
                    const cleanA = oPhone.replace(/\D/g, '');
                    if (cleanA === cleanB) return true;
                    const tailA = cleanA.slice(-8);
                    const tailB = cleanB.slice(-8);
                    if (tailA.length === 8 && tailA === tailB) return true;
                  }
                  const linked: string[] = Array.isArray(o.LINKED_WHATSAPP) ? o.LINKED_WHATSAPP : [];
                  return linked.some((p: string) => {
                    const lp = p.replace(/\D/g, '');
                    if (lp === cleanB) return true;
                    const lt = lp.slice(-8);
                    return lt.length === 8 && lt === cleanB.slice(-8);
                  });
                });
                // First: pending orders without payment proof
                const pending = myOrders.find((o: any) => o.STATUS === 'pending' && !o.PAYMENTPROOFURL);
                if (pending) {
                  pendingOrderId = String(pending.$id);
                  orderCode = String(pending.ORDERCODE || pending.$id);
                } else {
                  // Also check processing orders without proof (client may have paid but not uploaded)
                  const processingNoProof = myOrders.find((o: any) => o.STATUS === 'processing' && !o.PAYMENTPROOFURL);
                  if (processingNoProof) {
                    pendingOrderId = String(processingNoProof.$id);
                    orderCode = String(processingNoProof.ORDERCODE || processingNoProof.$id);
                  }
                }
              } catch (e) {
                console.warn('[WhatsApp Webhook] Failed to fetch orders for image comprobante check', e);
              }
            }

            // Use Gemini Vision to verify the image is actually a payment receipt
            let isComprobante = false;
            if (pendingOrderId) {
              try {
                const base64Check = Buffer.from(buffer).toString('base64');
                const visionRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{
                      parts: [
                        { text: '¿Esta imagen es un comprobante de pago, transferencia bancaria, o recibo de pago? Responde solo "SI" o "NO".' },
                        { inline_data: { mime_type: msg.image?.mime_type || 'image/jpeg', data: base64Check } }
                      ]
                    }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 10 }
                  })
                });
                const visionData = await visionRes.json();
                const visionText = String(visionData?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim().toUpperCase();
                isComprobante = visionText.startsWith('SI');
                console.log('[WhatsApp Webhook] Comprobante vision check:', visionText);
              } catch (e) {
                console.warn('[WhatsApp Webhook] Vision check failed, assuming comprobante:', e);
                isComprobante = true; // Fallback: assume it is if we can't verify
              }
            }

            if (pendingOrderId && isComprobante) {
              const fileName = `comprobante_${Date.now()}.jpg`;
              const uploadRes = await serverUploadFile(MEDIA_BUCKET_ID, buffer, fileName);
              const fileUrl = getPublicFileUrl(MEDIA_BUCKET_ID, uploadRes.$id);
              
              await serverUpdateDocument(ORDERS_COLLECTION_ID, pendingOrderId, {
                PAYMENTPROOFURL: fileUrl,
                STATUS: 'processing'
              });
              
              if (!orderCode || orderCode === pendingOrderId) {
                try {
                  const doc = await serverGetDocument(ORDERS_COLLECTION_ID, pendingOrderId);
                  if (doc.ORDERCODE) orderCode = String(doc.ORDERCODE);
                } catch (e) {}
              }
              
              await notifyPaymentUploaded(orderCode, 'Cliente (vía WhatsApp)');
              await recordKeniaUsage(fromPhone, { awaitingComprobante: false, pendingOrderId: undefined });
              
              const reply = `¡Listo bella! 💖 Recibí tu comprobante y se ha guardado en tu pedido #${orderCode}. Apenas finanzas lo valide, te avisaremos para continuar con el envío. ¡Muchas gracias! 🥰💸`;
              await sendWhatsAppMessage(fromPhone, reply, WA_TOKEN);
              await addToHistory(fromPhone, 'user', '[Imagen Comprobante]', msgId);
              await addToHistory(fromPhone, 'assistant', reply, `comprobante-${Date.now()}`);
              
              return NextResponse.json({ status: 'comprobante_uploaded' });
            }

            const base64 = Buffer.from(buffer).toString('base64');
            inlineDataParts.push({
              inline_data: {
                mime_type: msg.image?.mime_type || 'image/jpeg',
                data: base64
              }
            });
          }
        } catch (e) {
          console.error('[WhatsApp Webhook] Failed to download media:', e);
        }
      }
    }

    if (!userText && !interactiveId && inlineDataParts.length === 0) {
      if (msgType !== 'text' && msgType !== 'interactive' && msgType !== 'image' && msgType !== 'button') {
        await sendWhatsAppMessage(
          fromPhone,
          '¡Hola! 👋 Por ahora solo puedo procesar mensajes de texto o imágenes. Escríbeme tu consulta y te ayudo enseguida.',
          WA_TOKEN
        );
      }
      return NextResponse.json({ status: 'non_text_ignored' });
    }

    // Deduplication check
    try {
      const { serverGetDocument } = await import('@/lib/appwrite-server');
      const { ADMIN_CHAT_COLLECTION_ID } = await import('@/lib/appwrite-admin');
      // If we can find the message doc in the database, it means we already processed this message.
      await serverGetDocument(ADMIN_CHAT_COLLECTION_ID, getWhatsAppDocId(msgId, 'user'));
      console.log(`[WhatsApp Webhook] Duplicate message ${msgId} detected. Skipping.`);
      return NextResponse.json({ status: 'already_processed' });
    } catch (e) {
      // Document not found, proceed.
    }

    const cleanedFrom = fromPhone.replace(/\D/g, '').trim();
    const keniaConfig = await getKeniaConfig();
    const debugMode = keniaConfig.debugMode === true;
    const DEBUG_PHONE = '56992139185';
    let isAdmin = ADMIN_PHONES.includes(cleanedFrom);
    if (debugMode && cleanedFrom === DEBUG_PHONE) {
      isAdmin = false;
    }
    console.log(`[WhatsApp Webhook] Msg from: ${fromPhone} (cleaned: ${cleanedFrom}) | isAdmin: ${isAdmin} | debugMode: ${debugMode} | Admin list:`, ADMIN_PHONES);

    // Obtener uso actual del remitente
    const usage = await getKeniaUsage(fromPhone);
    const testAsClient = usage.testAsClient === true;

    // Procesar comandos de modo cliente
    if (isAdmin && userText.toUpperCase() === 'MODO CLIENTE') {
      await recordKeniaUsage(fromPhone, { testAsClient: true });
      const reply = 'Kenia: Modo cliente activado para ti. Te trataré como a un cliente a partir de ahora, incluso si la IA está desactivada. Escribe "MODO ADMIN" para volver al modo administrador. 🌸';
      await sendWhatsAppMessage(fromPhone, reply, WA_TOKEN);
      await addToHistory(fromPhone, 'assistant', reply, msgId);
      return NextResponse.json({ status: 'mode_client_activated' });
    }

    if (isAdmin && userText.toUpperCase() === 'MODO ADMIN') {
      await recordKeniaUsage(fromPhone, { testAsClient: false });
      const reply = 'Kenia: Modo administrador reactivado. Volverás a recibir los reportes y poder ejecutar comandos de administración. 🛡️';
      await sendWhatsAppMessage(fromPhone, reply, WA_TOKEN);
      await addToHistory(fromPhone, 'assistant', reply, msgId);
      return NextResponse.json({ status: 'mode_admin_activated' });
    }

    // Si está en modo cliente, tratamos a este administrador como un cliente normal
    if (testAsClient) {
      isAdmin = false;
    }

    // ── Deep Linking / Auto-Linking Interceptors ──
    const userTextLower = userText.toLowerCase().trim();
    if (userTextLower.startsWith('vincular_pedido ')) {
      const orderId = userText.substring('vincular_pedido '.length).trim();
      if (orderId) {
        try {
          const { serverUpdateDocument, serverGetDocument } = await import('@/lib/appwrite-server');
          const { ORDERS_COLLECTION_ID } = await import('@/lib/appwrite-admin');
          const order = await serverGetDocument(ORDERS_COLLECTION_ID, orderId);
          if (order) {
            const currentPhone = String(order.CUSTOMERPHONE || '');
            const cleanCurrent = currentPhone.replace(/\D/g, '');
            if (cleanCurrent !== cleanedFrom) {
              await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
                CUSTOMERPHONE: `+${cleanedFrom}`
              });
            }
            await markAsRead(msgId, WA_TOKEN);
            await clearHistory(fromPhone);
            await resetKeniaUsage(fromPhone);
            await setKeniaBlocked(fromPhone, false);

            const replyMsg = `¡Listo hermosa! 💖 Ya corregí tu número y vinculé tu WhatsApp a tu pedido *#${order.ORDERCODE || orderId}*. Ahora sí estamos conectadas y te avisaré de cualquier novedad de tu compra. 🥰`;
            await sendWhatsAppMessage(fromPhone, replyMsg, WA_TOKEN);
            await addToHistory(fromPhone, 'user', userText, msgId);
            await addToHistory(fromPhone, 'assistant', replyMsg, `link-order-${Date.now()}`);
            return NextResponse.json({ status: 'order_linked' });
          }
        } catch (e) {
          console.error('[WhatsApp Webhook] Error vincular_pedido:', e);
        }
      }
    }

    if (userTextLower.startsWith('vincular_cuenta ')) {
      const userId = userText.substring('vincular_cuenta '.length).trim();
      if (userId) {
        try {
          const { serverUpdateDocument, serverGetDocument } = await import('@/lib/appwrite-server');
          const { USERS_COLLECTION_ID } = await import('@/lib/appwrite-admin');
          const userDoc = await serverGetDocument(USERS_COLLECTION_ID, userId);
          if (userDoc) {
            const currentPhone = String(userDoc.phone || '');
            const cleanCurrent = currentPhone.replace(/\D/g, '');
            if (cleanCurrent !== cleanedFrom) {
              await serverUpdateDocument(USERS_COLLECTION_ID, userId, {
                phone: `+${cleanedFrom}`
              });
            }
            await markAsRead(msgId, WA_TOKEN);
            await clearHistory(fromPhone);
            await resetKeniaUsage(fromPhone);
            await setKeniaBlocked(fromPhone, false);

            const replyMsg = `¡Listo ${userDoc.name || 'bella'}! 💖 Ya corregí tu número y vinculé tu WhatsApp a tu cuenta. Ahora sí estamos conectadas y te ayudaré con lo que necesites. 🥰`;
            await sendWhatsAppMessage(fromPhone, replyMsg, WA_TOKEN);
            await addToHistory(fromPhone, 'user', userText, msgId);
            await addToHistory(fromPhone, 'assistant', replyMsg, `link-account-${Date.now()}`);
            return NextResponse.json({ status: 'account_linked' });
          }
        } catch (e) {
          console.error('[WhatsApp Webhook] Error vincular_cuenta:', e);
        }
      }
    }

    // Intercept interactive options before AI
    if (!isAdmin && interactiveId) {
      let interceptReply = '';
      if (interactiveId === 'func_pedido') {
        interceptReply = '📦 *¡Tu pedido, reina!*\n\nNo te estreses, yo te aviso de todito automáticamente:\n1️⃣ *Pago*: Cuando las chicas validen tus moneditas.\n2️⃣ *Armado*: Cuando estemos juntando tus tesoros.\n3️⃣ *Stock*: Si falta alguito te chismeo altiro.\n4️⃣ *Despacho*: Cuando salga volando hacia ti 🏃‍♀️💨\n\nSi quieres saber de un pedido específico AHORA, solo dímelo y lo busco amor. ✨';
      } else if (interactiveId === 'func_comprobante') {
        interceptReply = '🧾 *Tus comprobantes bella*\n\n¡Súper fácil! Entra a tu pedido en la web y sube la fotito del comprobante ahí. Yo lo veo al instante y te aviso por aquí apenas finanzas lo valide. ¡Cero estrés! 🥰💸';
      } else if (interactiveId === 'func_ofertas') {
        interceptReply = '🔥 *¡Ofertas y Remates!*\n\nUy amor, prepárate. Cuando tengamos cositas a precio de infarto o el jefe se vuelva loco con los descuentos, serás la primera en saberlo por aquí. ¡A cazar gangas se ha dicho! 💄🛍️';
      } else if (interactiveId === 'func_negociacion') {
        interceptReply = '🔄 *¿Falta algo? ¡Ni te estreses!*\n\nSi justo se nos agotó ese labial que querías, te voy a escribir rapidísimo para mostrarte otras opciones súper bellas para que elijas. ¡Te prometo que no te quedas sin tus regalitos! 💅💕';
      } else if (interactiveId === 'func_humano') {
        const MAIN_ADMIN_PHONE = (keniaConfig.adminAlertPhone || '56992139185').replace(/\D/g, '');
        const alertMsg = `🚨 *ASISTENCIA REQUERIDA*\n\nEl cliente +${fromPhone} presionó el botón de "Hablar con persona".\n🔗 ${process.env.NEXT_PUBLIC_SITE_URL || 'https://kevincocochile.cl'}/admin/ia/whatsapp`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, alertMsg, WA_TOKEN);
        
        await setKeniaBlocked(fromPhone, true, 'admin_takeover');
        interceptReply = '👤 *Hablar con una persona*\n\n¡Entendido! Acabo de notificar a alguien del equipo para que te atienda personalmente. Por favor dame un momentito mientras se conectan y te responden por aquí mismo. 🌸';
      }

      if (interceptReply) {
        await sendWhatsAppMessage(fromPhone, interceptReply, WA_TOKEN);
        await addToHistory(fromPhone, 'user', userText, msgId);
        await addToHistory(fromPhone, 'assistant', interceptReply, `intercept-${Date.now()}`);
        return NextResponse.json({ status: 'interactive_intercepted' });
      }
    }

    // Intercept "Enviar comprobante" button from Meta templates
    if (!isAdmin && msgType === 'button' && userText.toLowerCase().includes('comprobante')) {
      try {
        const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
        const qLimit50 = JSON.stringify({ method: 'limit', values: [50] });
        const resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qLimit50]);
        
        const myOrders = (resOrders.documents || []).filter((o: any) => {
          const oPhone = String(o.CUSTOMERPHONE || '');
          if (!oPhone) return false;
          const cleanA = oPhone.replace(/\D/g, '');
          const cleanB = fromPhone.replace(/\D/g, '');
          if (cleanA === cleanB) return true;
          const tailA = cleanA.slice(-8);
          const tailB = cleanB.slice(-8);
          return tailA.length === 8 && tailA === tailB;
        });

        const pendingOrder = myOrders.find((o: any) => o.STATUS === 'pending');
        
        if (pendingOrder) {
          const orderId = String(pendingOrder.$id);
          const link = `${SITE_URL}/pedido/${orderId}`;
          const interceptReply = `¡Súper bella! 🛍️✨\n\nAquí tienes el link directo a tu pedido donde encontrarás los datos de transferencia y podrás subir el comprobante:\n🔗 ${link}\n\nO si prefieres, **puedes enviarme la foto del comprobante de transferencia directamente por aquí mismo** y yo lo adjunto a tu pedido. ¿Qué te parece más fácil? 🥰`;
          
          await recordKeniaUsage(fromPhone, { awaitingComprobante: true, pendingOrderId: orderId });
          
          await sendWhatsAppMessage(fromPhone, interceptReply, WA_TOKEN);
          await addToHistory(fromPhone, 'user', userText, msgId);
          await addToHistory(fromPhone, 'assistant', interceptReply, `intercept-comp-${Date.now()}`);
          return NextResponse.json({ status: 'comprobante_link_sent' });
        } else {
           // No pending order found
           const interceptReply = `Uy bella, busqué en mis registros pero no encontré un pedido pendiente de pago a tu nombre 🥺. Si ya lo pagaste o tienes dudas, dímelo y te ayudo.`;
           await sendWhatsAppMessage(fromPhone, interceptReply, WA_TOKEN);
           await addToHistory(fromPhone, 'user', userText, msgId);
           await addToHistory(fromPhone, 'assistant', interceptReply, `intercept-comp-${Date.now()}`);
           return NextResponse.json({ status: 'no_pending_order_found' });
        }
      } catch (e) {
         console.error('[WhatsApp] Failed to process comprobante button:', e);
      }
    }

    // Mark as read
    await markAsRead(msgId, WA_TOKEN);

    // Check if Kenia is globally disabled
    if (keniaConfig.isEnabled === false) {
      // Debug phone bypasses maintenance when debugMode is active
      if (!(debugMode && cleanedFrom === DEBUG_PHONE)) {
        // Si el admin está en modo cliente, permite bypass del mantenimiento
        if (!testAsClient) {
          if (!isAdmin) {
            // Cliente real: enviar aviso de mantenimiento una sola vez
            const usageMaint = await getKeniaUsage(fromPhone);
            if (!usageMaint.maintenanceNotified) {
              const customerFirstName = usageMaint.customerName ? usageMaint.customerName.split(' ')[0] : '';
              const welcomeReply = customerFirstName
                ? `¡Hola ${customerFirstName}! 🌸 Soy Kenia, tu asistente personal de Kevin&Coco Chile 🇨🇱✨\n\n¡Ya estoy activa! 💖 Puedo ayudarte con:\n\n🛍️ Información de productos y precios\n📦 Estado de tus pedidos\n💳 Datos para transferir\n🎁 Ofertas y novedades\n✨ Y mucho más\n\n¿En qué te puedo ayudar hoy, bella? �`
                : `¡Hola bella! 🌸 Soy Kenia, tu asistente personal de Kevin&Coco Chile 🇨🇱✨\n\n¡Ya estoy activa! 💖 Puedo ayudarte con:\n\n🛍️ Información de productos y precios\n📦 Estado de tus pedidos\n💳 Datos para transferir\n🎁 Ofertas y novedades\n✨ Y mucho más\n\n¿En qué te puedo ayudar hoy? �`;
              await addToHistory(fromPhone, 'assistant', welcomeReply, msgId);
              await sendWhatsAppMessage(fromPhone, welcomeReply, WA_TOKEN);
              await recordKeniaUsage(fromPhone, { maintenanceNotified: true });
            }
            return NextResponse.json({ status: 'maintenance' });
          }
          // Admin normal (sin modo cliente): pasa libremente, no se bloquea
        }
        // testAsClient === true: bypass total del mantenimiento
      }
    }

    // Handle "limpiar historial" command
    if (userText.toLowerCase().includes('limpiar historial')) {
      await clearHistory(fromPhone);
      await resetKeniaUsage(fromPhone);
      await setKeniaBlocked(fromPhone, false);
      await sendWhatsAppMessage(fromPhone, '🗑️ Historial borrado y sistema desbloqueado. ¡Empezamos de cero!', WA_TOKEN);
      return NextResponse.json({ status: 'history_cleared' });
    }

    // ── Registration check for non-admin users ─────────────────────────────────
    let customerName = usage.customerName || '';
    if (!isAdmin) {
      let registeredUser = null;
      let isGuestWithOrders = false;

      if (usage.isRegistered === true) {
         customerName = usage.customerName || 'bella';
      } else if (usage.isRegistered === false) {
         // Ya revisamos en esta sesión que no está registrado
         if (usage.isGuestWithOrders === true) {
             isGuestWithOrders = true;
             if (usage.customerName) customerName = usage.customerName;
         }
      } else {
         registeredUser = await lookupRegisteredUser(fromPhone);
         
         if (registeredUser) {
            await recordKeniaUsage(fromPhone, { isRegistered: true, customerName: registeredUser.name });
            customerName = registeredUser.name;
         } else {
            // Guardar que no está registrado para no consultar Appwrite de nuevo por este número en esta sesión
            await recordKeniaUsage(fromPhone, { isRegistered: false });
            if (usage.isGuestWithOrders === true) {
               isGuestWithOrders = true;
            } else if (usage.isGuestWithOrders === false) {
               isGuestWithOrders = false;
            } else {
               // Fallback: check if they have any orders as a guest
               try {
                 const { serverListDocuments } = await import('@/lib/appwrite-server');
                 const { ORDERS_COLLECTION_ID } = await import('@/lib/appwrite-admin');
                 const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
                 const qLimit100b = JSON.stringify({ method: 'limit', values: [100] });
                 const resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qLimit100b]);
                 const myOrders = (resOrders.documents || []).filter((o: any) => {
                    const oPhone = String(o.CUSTOMERPHONE || '');
                    if (oPhone && phonesMatch(oPhone, fromPhone)) return true;
                    const linked: string[] = Array.isArray(o.LINKED_WHATSAPP) ? o.LINKED_WHATSAPP : [];
                    return linked.some((p: string) => phonesMatch(p, fromPhone));
                 });
                 if (myOrders.length > 0) {
                   isGuestWithOrders = true;
                   const guestName = String(myOrders[0]?.CUSTOMERNAME || '');
                   await recordKeniaUsage(fromPhone, { isGuestWithOrders: true, customerName: guestName || undefined });
                   if (guestName) customerName = guestName;
                 } else {
                   await recordKeniaUsage(fromPhone, { isGuestWithOrders: false });
                 }
               } catch (e) {
                 console.warn('[WhatsApp Webhook] Failed to check guest orders', e);
               }
            }
         }
      }

      if (!usage.isRegistered && !registeredUser && !isGuestWithOrders) {
        // If the user is specifically asking for human help while blocked:
        const userTextLower = userText.toLowerCase().trim();
        if (userTextLower.includes('ayuda') || userTextLower.includes('humano') || userTextLower.includes('asesor') || userTextLower.includes('persona')) {
          await setKeniaBlocked(fromPhone, true);
          const helpMsg = '👤 Entiendo hermosa. He notificado a nuestro equipo de atención al cliente. Por favor espera un momentito y una persona real te ayudará por aquí mismo para revisar tu caso. 🌸';
          await addToHistory(fromPhone, 'user', userText, msgId);
          await addToHistory(fromPhone, 'assistant', helpMsg);
          await sendWhatsAppMessage(fromPhone, helpMsg, WA_TOKEN);
          
          // Notify Admin
          const adminMsg = `🚨 *ASISTENCIA REQUERIDA (USUARIO NO REGISTRADO)*\nEl número +${fromPhone} no está registrado en la base de datos pero está pidiendo ayuda manual. Es posible que haya ingresado mal su número al registrarse.\n\nMensaje original: "${userText}"`;
          await sendWhatsAppMessage(ADMIN_PHONES[0], adminMsg, WA_TOKEN);
          return NextResponse.json({ status: 'admin_notified' });
        }

        // ── Email/RUT auto-detection: try to find orders by email or RUT ──
        const detectedEmail = extractEmail(userText);
        const detectedRut = extractRut(userText);

        if (detectedEmail || detectedRut) {
          let foundOrders: any[] = [];
          let foundUser: any | null = null;
          let searchMethod = '';

          if (detectedEmail) {
            searchMethod = 'email';
            foundOrders = await findOrdersByEmail(detectedEmail);
            foundUser = await findUserByEmail(detectedEmail);
          } else if (detectedRut) {
            searchMethod = 'RUT';
            foundOrders = await findOrdersByRut(detectedRut);
          }

          if (foundOrders.length > 0 || foundUser) {
            // Link the WhatsApp phone to found orders and user account
            const { linkedOrders, linkedUser } = await linkPhoneToOrdersAndUser(fromPhone, foundOrders, foundUser);

            const customerNameFound = foundUser?.name || foundOrders[0]?.CUSTOMERNAME || '';
            const orderCount = foundOrders.length;
            const orderCodes = foundOrders.slice(0, 3).map((o: any) => `#${o.ORDERCODE || String(o.$id).slice(-6).toUpperCase()}`).join(', ');

            let linkMsg = `¡Te encontré bella! 💖✨\n\n`;
            if (customerNameFound) linkMsg += `Hola *${customerNameFound}* 👋\n\n`;
            linkMsg += `Vinculé tu WhatsApp a ${linkedOrders} pedido${linkedOrders !== 1 ? 's' : ''} que tenías con nosotros`;
            if (orderCodes) linkMsg += ` (${orderCodes}${orderCount > 3 ? ` y ${orderCount - 3} más` : ''})`;
            linkMsg += `.\n\n`;
            if (linkedUser) linkMsg += `También actualicé tu número en tu cuenta. 📱\n\n`;
            linkMsg += `Ahora puedo avisarte sobre tus pedidos, ofertas y todo lo que necesites. ¿En qué te puedo ayudar? 🌸`;

            await addToHistory(fromPhone, 'user', userText, msgId);
            await addToHistory(fromPhone, 'assistant', linkMsg, `link-${searchMethod}-${Date.now()}`);
            await sendWhatsAppMessage(fromPhone, linkMsg, WA_TOKEN);

            // Mark as guest with orders so they don't get the register prompt again
            await recordKeniaUsage(fromPhone, { isGuestWithOrders: true, isRegistered: !!foundUser, customerName: customerNameFound || undefined });
            await clearHistory(fromPhone);
            await resetKeniaUsage(fromPhone);
            await setKeniaBlocked(fromPhone, false);

            return NextResponse.json({ status: `linked_by_${searchMethod}` });
          } else {
            // Email/RUT not found in orders or users
            const notFoundMsg = `Uy bella, busqué en mis registros con ese ${searchMethod} pero no lo encontré 🥺.\n\n¿Podrías revisarlo? A veces hay un pequeño error de tipeo. También puedes intentar con:\n• Tu *email* de compra (ej: tuemail@gmail.com)\n• Tu *RUT* (ej: 12.345.678-9)\n• El *código de tu pedido* (ej: ORD-00123)\n\nO si prefieres, escribe *Ayuda* y una asesora real te atenderá. 🌸`;

            await addToHistory(fromPhone, 'user', userText, msgId);
            await addToHistory(fromPhone, 'assistant', notFoundMsg, `not-found-${searchMethod}-${Date.now()}`);
            await sendWhatsAppMessage(fromPhone, notFoundMsg, WA_TOKEN);
            return NextResponse.json({ status: `${searchMethod}_not_found` });
          }
        }

        // ── Alternate phone linking: user was asked for their order phone number ──
        if (usage.awaitingAltPhone) {
          const altPhone = userText.replace(/\D/g, '');
          if (altPhone.length >= 8) {
            try {
              const { serverListDocuments } = await import('@/lib/appwrite-server');
              const { ORDERS_COLLECTION_ID } = await import('@/lib/appwrite-admin');
              const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
              const qLimit100 = JSON.stringify({ method: 'limit', values: [100] });
              const resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qLimit100]);
              const altOrders = (resOrders.documents || []).filter((o: any) => {
                const oPhone = String(o.CUSTOMERPHONE || '').replace(/\D/g, '');
                if (!oPhone) return false;
                return phonesMatch(oPhone, altPhone);
              });

              if (altOrders.length > 0) {
                const linked = await linkWhatsappToOrders(fromPhone, altOrders);
                const guestName = String(altOrders[0]?.CUSTOMERNAME || '');
                const orderCodes = altOrders.slice(0, 3).map((o: any) => `#${o.ORDERCODE || String(o.$id).slice(-6).toUpperCase()}`).join(', ');

                let linkMsg = `¡Te encontré bella! 💖✨\n\n`;
                if (guestName) linkMsg += `Hola *${guestName}* 👋\n\n`;
                linkMsg += `Vinculé tu WhatsApp a ${linked} pedido${linked !== 1 ? 's' : ''} que tenías con nosotros`;
                if (orderCodes) linkMsg += ` (${orderCodes}${altOrders.length > 3 ? ` y ${altOrders.length - 3} más` : ''})`;
                linkMsg += `.\n\nAhora puedo ayudarte con tus pedidos. ¿En qué te puedo ayudar? 🌸`;

                await addToHistory(fromPhone, 'user', userText, msgId);
                await addToHistory(fromPhone, 'assistant', linkMsg, `link-altphone-${Date.now()}`);
                await sendWhatsAppMessage(fromPhone, linkMsg, WA_TOKEN);

                await recordKeniaUsage(fromPhone, { awaitingAltPhone: false, isGuestWithOrders: true, customerName: guestName || undefined });
                return NextResponse.json({ status: 'linked_by_altphone' });
              } else {
                const notFoundAltMsg = `Uy bella, busqué pedidos con ese número pero no encontré ninguno 🥺.\n\n¿Podrías revisar el número? A veces hay un pequeño error de tipeo. También puedes intentar con:\n• Tu *email* de compra\n• Tu *RUT*\n• El *código de tu pedido* (ej: ORD-00123)\n\nO escribe *Ayuda* y una asesora te atenderá. 🌸`;
                await addToHistory(fromPhone, 'user', userText, msgId);
                await addToHistory(fromPhone, 'assistant', notFoundAltMsg, `not-found-altphone-${Date.now()}`);
                await sendWhatsAppMessage(fromPhone, notFoundAltMsg, WA_TOKEN);
                await recordKeniaUsage(fromPhone, { awaitingAltPhone: false });
                return NextResponse.json({ status: 'altphone_not_found' });
              }
            } catch (e) {
              console.warn('[WhatsApp Webhook] Alt phone search error:', e);
            }
          } else {
            const tooShortMsg = `Bella, ese número parece muy corto 🥺. ¿Podrías escribirlo completo? Por ejemplo: 9 1234 5678 📱`;
            await addToHistory(fromPhone, 'user', userText, msgId);
            await addToHistory(fromPhone, 'assistant', tooShortMsg);
            await sendWhatsAppMessage(fromPhone, tooShortMsg, WA_TOKEN);
            return NextResponse.json({ status: 'altphone_too_short' });
          }
        }

        // Detect if user mentions they have an order / made a purchase (trigger alt phone flow)
        const orderKeywords = /\b(pedido|compra|orden|compr[eé]|pagu[eé]|transferencia|env[ií]o|despacho)\b/i;
        if (orderKeywords.test(userText) && !usage.awaitingAltPhone) {
          const askAltPhoneMsg = `¡Ah! ¿Tienes un pedido con nosotros? 🛍️ Genial bella.\n\nA veces los clientes ponen un número distinto al hacer su pedido (el de la casa, el de un familiar, etc). \n\n¿Podrías escribirme el *número de teléfono que usaste al hacer tu pedido*? Con ese te lo busco altiro 📱✨\n\nO si prefieres, también puedo buscarte por tu *email* o *RUT* de compra. 🌸`;
          await addToHistory(fromPhone, 'user', userText, msgId);
          await addToHistory(fromPhone, 'assistant', askAltPhoneMsg, `ask-altphone-${Date.now()}`);
          await sendWhatsAppMessage(fromPhone, askAltPhoneMsg, WA_TOKEN);
          await recordKeniaUsage(fromPhone, { awaitingAltPhone: true, registerPromptedAt: Date.now() });
          return NextResponse.json({ status: 'asked_alt_phone' });
        }

        // Not registered and no orders: prompt to register (once per 24h to avoid spam)
        const now = Date.now();
        const lastPrompted = usage.registerPromptedAt || 0;
        if (now - lastPrompted > 24 * 60 * 60 * 1000) {
          const registerMsg = '¡Hola hermosa! 🌸 Mis sistemas me indican que aún no estás registrada en nuestra página web. Para poder atenderte de forma más personalizada y no estar pidiéndote tus datitos todo el tiempo 😅 necesito solamente que te registres aquí 👇\n\n' + SITE_URL + '/login?tab=register\n\n💡 *¿Ya hiciste un pedido o tienes cuenta pero pusiste mal tu número?* ¡No te preocupes! Puedo buscarte por tu *email* o *RUT* de compra. Escríbeme cualquiera de los dos y te vinculo altiro. 📧🆔\n\n👩‍💻 *¿Necesitas ayuda de un humano?* Simplemente escribe la palabra *Ayuda* y una asesora real te atenderá.\n\nLuego vuelve, escríbeme y te atenderé como una reina se merece 👑✨';
          await addToHistory(fromPhone, 'user', userText, msgId);
          await addToHistory(fromPhone, 'assistant', registerMsg);
          await sendWhatsAppMessage(fromPhone, registerMsg, WA_TOKEN);
          await recordKeniaUsage(fromPhone, { registerPromptedAt: now });
        }
        return NextResponse.json({ status: 'not_registered' });
      }
      if (!customerName && registeredUser) {
        customerName = registeredUser.name || 'bella';
      }
    }

    // ── First interaction welcome menu for registered customers ─────────────────
    if (!isAdmin && !usage.welcomeShown && isGreeting(userText)) {
      const displayName = customerName || 'bella';
      await addToHistory(fromPhone, 'user', userText, msgId);

      // Generate a vibrant personalized greeting with Gemini
      let welcomeGreeting = '';
      try {
        const welcomePrompt = `Eres Kenia, la súper mejor amiga virtual y asesora estrella de Kevin&Coco. Tienes una vibra SÚPER viva, atrevida, graciosa y llena de picardía. Eres la típica amiga amante del maquillaje. Cero formal, cero aburrida.

Es tu PRIMERA vez hablando con "${displayName}". Escribe un saludo SIMPLE, divertidísimo y cortito.
REGLAS:
1. Usa un diminutivo cariñoso de su primer nombre (Ej: Janpol -> Jan, Guadalupe -> Lupe).
2. Preséntate como Kenia con muchísima energía. Trátala de "amor", "bella" o "cariño".
3. OPCIONAL Y SOLO SI TIENE SENTIDO: Lánzate un dato curioso o piropo gracioso y muy corto sobre su nombre o el maquillaje. Si su nombre es raro, sáltatelo. ¡Cero cosas aburridas o técnicas!
4. Dile rapidito que estás para chismearle de sus pedidos, ofertas y ayudarla en todo.
5. Dile que si necesita más información le dé al botón de abajo, y si no, que te pregunte lo que quiera. Usa emojis femeninos (💅💋✨).

Escribe con confianza total, frescura y humor. ¡Que se sienta viva!`;
        const welcomeBody = {
          system_instruction: { parts: [{ text: welcomePrompt }] },
          contents: [{ role: 'user', parts: [{ text: userText }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 800 },
        };
        for (const model of GEMINI_MODELS) {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(welcomeBody),
          });
          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              welcomeGreeting = text.replace(/\*+/g, '').trim();
              break;
            }
          }
          if (res.status !== 503) break;
        }
      } catch (e) {
        console.warn('[WhatsApp Webhook] Welcome greeting generation failed:', e);
      }

      // Fallback if AI failed
      if (!welcomeGreeting) {
        welcomeGreeting = `¡Hola ${displayName}! 🌸 ¡Qué emoción conocerte! Soy Kenia, tu asesora personal de Kevin&Coco. Si necesitas más información dale al botón de abajo, sino pregúntame lo que quieras. ✨`;
      }

      // Send the AI greeting fused into the interactive list menu (single message)
      await sendWelcomeMenu(fromPhone, displayName, WA_TOKEN, welcomeGreeting);
      await addToHistory(fromPhone, 'assistant', welcomeGreeting, msgId);

      await recordKeniaUsage(fromPhone, { welcomeShown: true });
      return NextResponse.json({ status: 'welcome_menu_sent' });
    }

    // ── Fetch context from DB ──────────────────────────────────────────────────
    let contextBlock = '';
    if (isAdmin ? needsDbContext(userText) : true) {
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
            preparing_shipping: 'Etiqueta Lista',
            ready_to_ship: 'Pedido listo para enviar',
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
        // Customer: get products and their own orders
        const lowerText = userText.toLowerCase();
        const keywords  = lowerText.split(/\s+/).filter(w => w.length > 2);

        // Fetch customer's active orders based on fromPhone
        let customerOrdersText = '';
        let myOrders: any[] = [];
        try {
          let resOrders;
          try {
            const cleanB = fromPhone.replace(/\D/g, '');
            const qPhone1 = cleanB;
            const qPhone2 = cleanB.startsWith('569') ? cleanB.slice(2) : `56${cleanB}`;
            const qPhone3 = `+${cleanB}`;
            const qPhone4 = `+${qPhone2}`;
            const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
            const qPhone = JSON.stringify({ method: 'equal', attribute: 'CUSTOMERPHONE', values: [qPhone1, qPhone2, qPhone3, qPhone4] });
            const qLimit = JSON.stringify({ method: 'limit', values: [10] });
            resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qPhone, qLimit]);
          } catch (e) {
            console.warn('[WhatsApp] Order query by phone failed, falling back to 20 limit:', e);
            const qOrderDesc = JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' });
            const qLimit20 = JSON.stringify({ method: 'limit', values: [20] });
            resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [qOrderDesc, qLimit20]);
          }
          
          myOrders = (resOrders.documents || [])
            .filter((o: any) => {
              const oPhone = String(o.CUSTOMERPHONE || '');
              if (oPhone) {
                const cleanA = oPhone.replace(/\D/g, '');
                const cleanB = fromPhone.replace(/\D/g, '');
                if (cleanA === cleanB) return true;
                const tailA = cleanA.slice(-8);
                const tailB = cleanB.slice(-8);
                if (tailA.length === 8 && tailA === tailB) return true;
              }
              const linked: string[] = Array.isArray(o.LINKED_WHATSAPP) ? o.LINKED_WHATSAPP : [];
              return linked.some((p: string) => phonesMatch(p, fromPhone));
            })
            .slice(0, 5);
          
          if (myOrders.length > 0) {
            const ordersFormatted = myOrders.map((o: any) => {
              const id = o.$id;
              const code = o.ORDERCODE || id.slice(-6).toUpperCase();
              const rawStatus = o.STATUS || 'pending';
              const STATUS_LABELS: Record<string, string> = {
                pending: 'Pendiente de pago',
                processing: 'Procesando',
                paid: 'Pagado',
                assembling: 'En preparación',
                negotiation: 'En negociación / modificando',
                preparing_shipping: 'Etiqueta Lista',
                ready_to_ship: 'Listo para enviar',
                shipped: 'Enviado',
                delivered: 'Entregado a agencia de transporte',
                cancelled: 'Cancelado'
              };
              const status = STATUS_LABELS[rawStatus] || rawStatus;
              let missingText = '';
              try {
                const items = JSON.parse(o.ITEMS || '[]');
                const missingItems = items.filter((it: any) => it.missing === true);
                if (missingItems.length > 0) {
                  missingText = `\n  ⚠️ PRODUCTOS FALTANTES: ${missingItems.map((it: any) => `${it.qty}x ${it.name}`).join(', ')}`;
                }
              } catch (e) {}
              const agency = o.SHIPPINGAGENCY ? ` | Agencia: ${o.SHIPPINGAGENCY}` : '';
              const tracking = o.TRACKINGNUMBER ? ` | Seguimiento: ${o.TRACKINGNUMBER}` : '';
              const boxPhoto = o.SHIPPINGPROOFURL ? ` | Foto caja: ${o.SHIPPINGPROOFURL}` : '';
              const agencyProof = o.PAYMENTPROOFURL ? ` | Comprobante agencia: ${o.PAYMENTPROOFURL}` : '';
              return `- Pedido #${code} (ID: ${id}) | Total: $${o.TOTAL} | Estado: ${status}${agency}${tracking}${boxPhoto}${agencyProof}${missingText}`;
            });
            customerOrdersText = `\n\n## 📦 MIS PEDIDOS ACTIVOS:\n${ordersFormatted.join('\n')}`;
          }
        } catch (e) {
          console.warn('[WhatsApp] Error fetching customer orders:', e);
        }

        // 1. If customer has a negotiation order, fetch similar products for their missing items
        let suggestedProducts: any[] = [];
        const hasNegotiationOrder = myOrders.some((o: any) => o.STATUS === 'negotiation');
        if (hasNegotiationOrder) {
          for (const o of myOrders) {
            if (o.STATUS !== 'negotiation') continue;
            try {
              const items = JSON.parse(o.ITEMS || '[]');
              const missingItems = items.filter((it: any) => it.missing === true);
              for (const item of missingItems) {
                if (item.id) {
                  try {
                    const prod = await serverGetDocument(PRODUCTS_COLLECTION_ID, item.id);
                    const categoryId = (prod as any).CATEGORYID || '';
                    if (categoryId) {
                      const resSimilar = await serverListDocuments(PRODUCTS_COLLECTION_ID, [
                        `equal("CATEGORYID", ["${categoryId}"])`,
                        `limit(8)`
                      ]);
                      if (resSimilar.documents && resSimilar.documents.length > 0) {
                        suggestedProducts = [...suggestedProducts, ...resSimilar.documents];
                      }
                    }
                  } catch (e) {
                    console.warn('[WhatsApp Webhook] Could not load similar products for missing item:', e);
                  }
                }
              }
            } catch (e) {}
          }
        }

        // 2. Fetch/search catalog products
        let relevantProducts: any[] = [];
        let searched = false;
        if (keywords.length > 0) {
          try {
            const stopwords = ['precios', 'precio', 'mayor', 'catalogo', 'completo', 'todos', 'quiero', 'saber', 'imagen', 'imagenes', 'fotos', 'costos', 'costo', 'hola', 'como', 'estas', 'bien', 'gracias'];
            const searchKeywords = keywords.filter(k => !stopwords.includes(k));
            if (searchKeywords.length > 0) {
              const searchQuery = searchKeywords.join(' ');
              const resSearch = await serverListDocuments(PRODUCTS_COLLECTION_ID, [
                `search("NAME", ["${searchQuery}"])`,
                `limit(25)`
              ]);
              if (resSearch.documents && resSearch.documents.length > 0) {
                relevantProducts = resSearch.documents;
                searched = true;
              } else {
                // Fallback to tags search
                const resTags = await serverListDocuments(PRODUCTS_COLLECTION_ID, [
                  `search("TAGS", ["${searchQuery}"])`,
                  `limit(25)`
                ]);
                if (resTags.documents && resTags.documents.length > 0) {
                  relevantProducts = resTags.documents;
                  searched = true;
                }
              }
            }
          } catch (searchErr) {
            console.warn('[WhatsApp Webhook] Direct search failed:', searchErr);
          }
        }

        // Default fallback: if no products were found via search, we load CATEGORIES instead of 50 products
        let categoriesList: string[] = [];
        if (relevantProducts.length === 0 && suggestedProducts.length === 0) {
          try {
            const qLimit100 = JSON.stringify({ method: 'limit', values: [100] });
            const catRes = await serverListDocuments(CATEGORIES_COLLECTION_ID, [qLimit100]);
            categoriesList = (catRes.documents || []).map((c: any) => `- ${c.name} (ID: ${c.$id})`);
          } catch (e) {
            console.error('[WhatsApp Webhook] Categories query failed:', e);
          }
        }

        // Merge keeping suggested products at the top and avoiding duplicates
        const finalProducts: any[] = [...suggestedProducts];
        relevantProducts.forEach((p: any) => {
          if (!finalProducts.some(fp => fp.$id === p.$id)) {
            finalProducts.push(p);
          }
        });

        let contextBlockAdditions = '';
        if (finalProducts.length > 0) {
          const productList = finalProducts.slice(0, 20).map((p: any) => {
            const price = p.CURRENTPRICE || p.PRICE || 0;
            const wholesalePrice = p.WHOLESALEPRICE || 0;
            const stock = p.STOCK ?? 0;
            const stockLabel = stock > 0 ? `✅ Disponible (${stock} uds)` : '❌ Sin stock';
            
            let priceText = `$${Number(price).toLocaleString('es-CL')}`;
            if (wholesalePrice > 0) {
              priceText += ` (Precio por mayor: $${Number(wholesalePrice).toLocaleString('es-CL')})`;
            }
            return `• *${p.NAME}* — ${priceText} | ${stockLabel}`;
          });
          contextBlockAdditions = `## 🛍️ PRODUCTOS BUSCADOS (${finalProducts.length} encontrados):\n${productList.join('\n')}`;
        } else if (categoriesList.length > 0) {
          contextBlockAdditions = `## 📁 CATEGORÍAS DISPONIBLES:\n(Recomienda estas categorías enviando el enlace de la tienda según el nombre)\n${categoriesList.join('\n')}`;
        } else {
          contextBlockAdditions = `No se encontraron productos ni categorías.`;
        }

        contextBlock = `${customerOrdersText}\n\n${contextBlockAdditions}\n\nSitio web: ${SITE_URL}`;
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

    // Números admin que nunca pueden ser baneados/bloqueados (inmune incluso en MODO CLIENTE)
    const BAN_PROOF_PHONES = ['56992139185'];
    const isBanProof = BAN_PROOF_PHONES.includes(cleanedFrom);

    if (!isAdmin) {
      const usageCheck = await getKeniaUsage(fromPhone);

      // Si es un número inmune (admin probando), auto-desbloquear si estaba bloqueado
      if (isBanProof && (usageCheck.blocked || usageCheck.spamBlocked)) {
        await setKeniaBlocked(fromPhone, false);
        usageCheck.blocked = false;
        usageCheck.spamBlocked = false;
      }

      // ── Anti-spam: detectar más de 8 mensajes en 2 minutos ──
      const now = Date.now();
      const recentTimestamps = (usageCheck.lastMessageTimestamps || []).filter(
        (ts: number) => now - ts < 120_000
      );
      recentTimestamps.push(now);
      await recordKeniaUsage(fromPhone, { lastMessageTimestamps: recentTimestamps });

      if (!isBanProof && !usageCheck.spamBlocked && recentTimestamps.length > 8) {
        // Auto-bloquear por spam
        await setKeniaBlocked(fromPhone, true, 'spam');
        const MAIN_ADMIN_PHONE = (keniaConfig.adminAlertPhone || '56992139185').replace(/\D/g, '');
        const spamAlert = `🚫 *ALERTA ANTI-SPAM*\nEl número +${fromPhone} fue bloqueado automáticamente por enviar ${recentTimestamps.length} mensajes en menos de 2 minutos.\n\nÚltimo mensaje: "${userText}"\n\n🔗 Revisa en el panel: ${SITE_URL}/admin/ia/whatsapp`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, spamAlert, WA_TOKEN);
        return NextResponse.json({ status: 'spam_blocked' });
      }

      if (usageCheck.blocked) {
        // Siempre guardar el mensaje del cliente en el history para que el admin lo vea
        await addToHistory(fromPhone, 'user', userText, msgId);

        if (usageCheck.spamBlocked) {
          // Spam: silencio total, no responder nada
          return NextResponse.json({ status: 'spam_blocked' });
        }
        if (usageCheck.adminTakeover || usageCheck.escalated) {
          // Admin tomó control o Kenia escaló: aviso amable (solo cada 3 min para no spamear)
          const now = Date.now();
          const lastStallTs = usageCheck.lastStallReplyTs || 0;
          const STALL_COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes
          if (now - lastStallTs > STALL_COOLDOWN_MS) {
            const takeoverReply = '¡Amor! 🌸 Dame un segundito que estoy revisando un par de cositas con las chicas de tienda para poder ayudarte mejor con esto 🏃‍♀️💨. ¡Ahorita vuelvo contigo!';
            await addToHistory(fromPhone, 'assistant', takeoverReply, `stall-${Date.now()}`);
            await sendWhatsAppMessage(fromPhone, takeoverReply, WA_TOKEN);
            await recordKeniaUsage(fromPhone, { lastStallReplyTs: now });
          }
          // Notificar al admin que el cliente escribió
          const MAIN_ADMIN_PHONE = (keniaConfig.adminAlertPhone || '56992139185').replace(/\D/g, '');
          const adminNotif = `📩 *Cliente esperando respuesta*\n+${fromPhone} escribió: "${userText}"\n\n🔗 ${SITE_URL}/admin/ia/whatsapp`;
          await sendWhatsAppMessage(MAIN_ADMIN_PHONE, adminNotif, WA_TOKEN);
          return NextResponse.json({ status: 'admin_takeover' });
        }
        // Bloqueo normal (manual): NO responder nada, solo guardar mensaje y notificar admin
        const MAIN_ADMIN_PHONE = (keniaConfig.adminAlertPhone || '56992139185').replace(/\D/g, '');
        const adminNotifBlocked = `⚠️ *Cliente pausado escribió*\n+${fromPhone}: "${userText}"\n\n🔗 Atiéndelo en: ${SITE_URL}/admin/ia/whatsapp`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, adminNotifBlocked, WA_TOKEN);
        
        return NextResponse.json({ status: 'blocked' });
      }
    }

    let basePrompt = isAdmin
      ? (keniaConfig.adminPrompt || ADMIN_PROMPT)
      : hydratePrompt(keniaConfig.customerPrompt || CUSTOMER_PROMPT, SITE_URL);

    if (!isAdmin) {
      basePrompt += `\n\n## ⚠️ REGLA ESTRICTA DE ANTI-ALUCINACIÓN PARA PEDIDOS:\nSi la clienta pregunta por su pedido y la sección "MIS PEDIDOS ACTIVOS" está vacía o no existe en tu contexto, **TIENES ESTRICTAMENTE PROHIBIDO INVENTAR ENLACES O FALTANTES DE STOCK**. Debes responder EXACTAMENTE: "Uy hermosa, estoy buscando con tu numerito pero no logro encontrar tu pedido activo en el sistema 🥺. Déjame pedirle ayuda a las chicas para que lo busquen manualmente, ¡dame unos minutitos! 🏃‍♀️💨" y luego **AÑADIR OBLIGATORIAMENTE** al final de tu respuesta: [ACTION:ASK_ADMIN]El cliente pregunta por su pedido pero no encuentro ninguno activo en la base de datos.[/ACTION].`;
      basePrompt += `\n\n## 🔇 REGLA DE CIERRE DE CONVERSACIÓN:\n**NUNCA** hagas preguntas abiertas al final de tu respuesta (Ej: "¿te ayudo con algo más?", "¿qué más necesitas?", "¿cuéntame?"). Responde PUNTUALMENTE lo que te preguntaron y cierra el mensaje. Si la clienta no pregunta nada nuevo, la conversación termina ahí.`;
      basePrompt += `\n\n## 📦 REGLA DE SEGUIMIENTO DE PEDIDOS:\nCuando una clienta pregunte por su pedido y este esté en estado "Entregado a agencia de transporte" o "Enviado":\n1. **PRIORIZA** el número de seguimiento si existe. Dile el número y el link de seguimiento de la agencia correspondiente.\n2. Si NO hay número de seguimiento pero hay "Foto caja" o "Comprobante agencia", dile que no tienes el número pero que le adjuntas la foto del comprobante.\n3. Si el estado es "Entregado a agencia de transporte", ACLARA SIEMPRE que significa que el pedido fue entregado a la agencia de transporte y va en camino, NO que fue entregado en su casa.\n4. Links de seguimiento por agencia:\n   - BluExpress: https://www.blue.cl/enviar/seguimiento?n_seguimiento=NUMERO\n   - Starken: https://www.starken.cl/seguimiento?n_seguimiento=NUMERO\n   - Chilexpress: https://www.chilexpress.cl/centro-de-ayuda/seguimiento-de-envios\n   - Retiro en tienda: diles que está listo para retirar en la tienda.`;
    }
    const customerNameBlock = (!isAdmin && customerName) ? '\n\n## 👤 DATOS DEL CLIENTE:\nNombre: ' + customerName + '\n(Usa su nombre real para saludarla. Usa expresiones como "bella", "hermosa", "linda" solo ocasionalmente, no en cada frase.)' : '';
    const systemPrompt = basePrompt + timeBlock + contextBlock + customerNameBlock;

    const rawContents = [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '...' }],
      })),
      { role: 'user', parts: [{ text: userText || '...' }, ...inlineDataParts] },
    ];

    // Fix Gemini history strict alternating rules (must start with user, must alternate user/model)
    const contents: any[] = [];
    for (const msg of rawContents) {
      if (contents.length === 0) {
        if (msg.role === 'model') {
          // Prepend a dummy user message so it starts with user
          contents.push({ role: 'user', parts: [{ text: 'Hola' }] });
        }
        contents.push(msg);
      } else {
        const last = contents[contents.length - 1];
        if (last.role === msg.role) {
          // Combine consecutive messages of the same role
          const lastText = last.parts[0]?.text || '';
          const newText = msg.parts[0]?.text || '';
          last.parts[0].text = lastText + '\n\n' + newText;
          if (msg.parts.length > 1) {
            last.parts.push(...msg.parts.slice(1));
          }
        } else {
          contents.push(msg);
        }
      }
    }

    const geminiBody = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    };

    // ── Call Gemini ────────────────────────────────────────────────────────────
    let aiReply = '¡Ay bella! 🌸 Tuve un problemita técnico para procesar tu mensaje ahora mismo 🥺. Dame un momentito cortito y vuelve a intentarlo, ¡pronto estaremos charlando! 💖';
    let rawText = '';
    let usageMetadata: any = null;
    for (const model of GEMINI_MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });
      if (res.ok) {
        const data = await res.json();
        usageMetadata = data?.usageMetadata || null;
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          rawText = text;
          aiReply = text
            .replace(/\[ACTION:[^\]]+\][\s\S]*?\[\/ACTION\]/g, '') // strip any action blocks
            .replace(/\*\*(.*?)\*\*/g, '*$1*') // convert **bold** to WA *bold*
            .trim();
          break;
        }
        console.warn(`[Gemini] Model ${model} returned OK but no text. Response:`, JSON.stringify(data).substring(0, 500));
      } else {
        const errBody = await res.text().catch(() => 'no body');
        console.warn(`[Gemini] Model ${model} failed with status ${res.status}:`, errBody.substring(0, 300));
      }
      if (res.status !== 503) break;
    }

    // If all Gemini models failed, notify admin
    if (!rawText && !isAdmin) {
      try {
        const MAIN_ADMIN_PHONE = (keniaConfig.adminAlertPhone || '56992139185').replace(/\D/g, '');
        const failAlert = `⚠️ *KENIA: Error de Gemini*\n\nNo pude responder a +${fromPhone}. Todos los modelos fallaron.\n\nMensaje del cliente: "${userText.substring(0, 100)}"\n\nRevisa el log del servidor para más detalles.`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, failAlert, WA_TOKEN);
      } catch {}
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

    // ── Action Parsing & Execution (REPLY_CUSTOMER) ──────────────────────────────
    const replyCustomerRegex = /\[ACTION:REPLY_CUSTOMER\]([\s\S]*?)\[\/ACTION\]/;
    const replyCustomerMatch = rawText.match(replyCustomerRegex);
    if (replyCustomerMatch && isAdmin) {
      try {
        const actionData = JSON.parse(replyCustomerMatch[1]);
        const { phone, message } = actionData;
        if (phone && message) {
          const cleanPhone = phone.replace(/\D/g, '');
          await sendWhatsAppMessage(cleanPhone, message, WA_TOKEN);
          await addToHistory(cleanPhone, 'assistant', message, `admin-reply-${Date.now()}`);
          aiReply += `\n\n✅ Mensaje enviado al cliente (+${cleanPhone}).`;
          console.log(`[WhatsApp Webhook] Sent admin reply to ${cleanPhone}: ${message}`);
        }
      } catch (err) {
        console.error('[WhatsApp Webhook] REPLY_CUSTOMER parsing error:', err);
      }
    }

    // ── Action Parsing & Execution (SEARCH_SKU) ──────────────────────────────
    if (!isAdmin) {
      const searchSkuRegex = /\[ACTION:SEARCH_SKU\]([\s\S]*?)\[\/ACTION\]/;
      const searchSkuMatch = rawText.match(searchSkuRegex);
      if (searchSkuMatch) {
        const skuCode = searchSkuMatch[1]?.trim()?.toUpperCase();
        if (skuCode) {
          try {
            const qCode = JSON.stringify({ method: 'equal', attribute: 'SKU', values: [skuCode] });
            const qName = JSON.stringify({ method: 'search', attribute: 'NAME', values: [skuCode] });
            const resSku = await serverListDocuments(PRODUCTS_COLLECTION_ID, [qCode, JSON.stringify({ method: 'limit', values: [1] })]);
            let foundProd = resSku.documents?.[0];
            
            if (!foundProd) {
               const resName = await serverListDocuments(PRODUCTS_COLLECTION_ID, [qName, JSON.stringify({ method: 'limit', values: [1] })]);
               foundProd = resName.documents?.[0];
            }

            if (foundProd) {
              const prodLink = `${SITE_URL}/producto/${foundProd.$id}`;
              aiReply = `¡Aquí tienes el producto que buscas amor! ✨\n*${foundProd.NAME}*\n🔗 ${prodLink}\n\n${aiReply}`.trim();
            } else {
              aiReply = `Mmm, busqué el código ${skuCode} amor, pero no logro encontrar el link exacto 🥺. ${aiReply}`.trim();
            }
          } catch (e) {
            console.error('[WhatsApp Webhook] SEARCH_SKU intercept error:', e);
          }
        }
      }
    }

    // Save assistant reply to history
    await addToHistory(fromPhone, 'assistant', aiReply, msgId);

    if (!isAdmin) {
      const promptTokens =
        Number(usageMetadata?.promptTokenCount || 0) ||
        estimateTokensFromText(systemPrompt, ...history.map((m) => m.content), userText);
      const responseTokens =
        Number(usageMetadata?.candidatesTokenCount || 0) ||
        estimateTokensFromText(aiReply);
      const totalTokens =
        Number(usageMetadata?.totalTokenCount || 0) ||
        promptTokens + responseTokens;
      await recordKeniaUsage(fromPhone, { promptTokens, responseTokens, totalTokens });
    }

    // ── Send reply to WhatsApp ─────────────────────────────────────────────────
    await sendWhatsAppMessage(fromPhone, aiReply, WA_TOKEN);

    // ── Report to main admin if from customer ────────────────────────────────
    if (!isAdmin) {
      const MAIN_ADMIN_PHONE = (keniaConfig.adminAlertPhone || '56992139185').replace(/\D/g, '');
      const askAdminRegex = /\[ACTION:ASK_ADMIN\]([\s\S]*?)\[\/ACTION\]/;
      const askAdminMatch = rawText.match(askAdminRegex);
      const escalateRegex = /\[ACTION:ESCALATE_ADMIN\]([\s\S]*?)\[\/ACTION\]/;
      
      if (askAdminMatch) {
        const questionSummary = askAdminMatch[1]?.trim() || "Tiene una duda que no puedo responder";
        const customerNameDisp = customerName ? `${customerName} (+${fromPhone})` : `+${fromPhone}`;
        const alertMsg = `🚨 *KENIA NECESITA AYUDA*\n\n¡Amor! El cliente ${customerNameDisp} me preguntó esto y no sé qué decirle:\n"${questionSummary}"\n\n¿Qué le digo? (Respóndeme "dile que..." y yo le paso el chisme tal cual 🏃‍♀️)`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, alertMsg, WA_TOKEN);
      } else if (escalateRegex.test(rawText)) {
        // Fallback for old prompt structure
        await setKeniaBlocked(fromPhone, true, 'admin_takeover');
        await recordKeniaUsage(fromPhone, { escalated: true });

        const lastMsgs = (await getHistory(fromPhone)).slice(-4).map(m =>
          `${m.role === 'user' ? '👤' : '🤖'} ${m.content.slice(0, 120)}`
        ).join('\n');
        const alertMsg = `🚨 *KENIA NECESITA AYUDA*\n\nEl cliente +${fromPhone} tiene un caso que no puedo resolver.\n\n📋 *Últimos mensajes:*\n${lastMsgs}\n\n💬 *Mi última respuesta:*\n"${aiReply.slice(0, 200)}"\n\n⚡ Kenia se desactivó para este cliente. Responde desde el panel:\n🔗 ${SITE_URL}/admin/ia/whatsapp`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, alertMsg, WA_TOKEN);
      } else if (keniaConfig.smartNotifications) {
        // Smart notifications: only notify on key events, not every message
        const usageAfter = await getKeniaUsage(fromPhone);
        const msgCount = usageAfter.messageCount;
        const threshold = keniaConfig.messageThresholdForPause || 10;

        if (msgCount === 1) {
          // New conversation started
          const notifyMsg = `🆕 *Nueva conversación iniciada*\nCliente: +${fromPhone}\nMensaje: "${userText.slice(0, 150)}"\n\n🤖 Kenia está atendiendo. Te avisaré si necesito ayuda.\n🔗 ${SITE_URL}/admin/ia/whatsapp`;
          await sendWhatsAppMessage(MAIN_ADMIN_PHONE, notifyMsg, WA_TOKEN);
        } else if (msgCount >= threshold && !usageAfter.adminTakeover) {
          // Threshold reached — pause Kenia and ask admin what to do
          await setKeniaBlocked(fromPhone, true, 'admin_takeover');
          const pauseMsg = `⏸️ *Conversación larga detectada*\n\nCliente: +${fromPhone}\nMensajes intercambiados: ${msgCount}\n\nHe estado conversando con esta persona por un tiempo. ¿Qué quieres que haga?\n\n✅ *Devolver a Kenia* → responde "continuar"\n🚫 *Bloquear* → responde "bloquear"\n👤 *Tomar control* → responde "tomar"\n\n🔗 ${SITE_URL}/admin/ia/whatsapp`;
          await sendWhatsAppMessage(MAIN_ADMIN_PHONE, pauseMsg, WA_TOKEN);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (err: any) {
    console.error('[WhatsApp webhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
