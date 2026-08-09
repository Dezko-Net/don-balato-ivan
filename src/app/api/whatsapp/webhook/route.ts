import { NextRequest, NextResponse } from "next/server";
import {
  sendWhatsAppMessage,
  sendWhatsAppList,
  sendWhatsAppButtons,
  markAsRead,
  getHistory,
  addToHistory,
  clearHistory,
  getWhatsAppDocId,
} from "@/lib/whatsapp";

export const maxDuration = 60;
import {
  serverListDocuments,
  serverUpdateDocument,
  serverGetDocument,
  serverCreateDocument,
  serverUploadFile,
  getPublicFileUrl,
} from "@/lib/appwrite-server";
import { notifyPaymentUploaded } from "@/lib/notify-admin";
import { MEDIA_BUCKET_ID } from "@/lib/appwrite";
import {
  estimateTokensFromText,
  getKeniaConfig,
  getKeniaUsage,
  hydratePrompt,
  recordKeniaUsage,
  setKeniaBlocked,
  resetKeniaUsage,
} from "@/lib/kenia-runtime";
import { getGeminiAuthHeaders, buildGeminiUrl } from "@/lib/google-auth";
import { GEMINI_TEXT_MODELS } from "@/lib/gemini-models";
import {
  PRODUCTS_COLLECTION_ID,
  ORDERS_COLLECTION_ID,
  USERS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
} from "@/lib/appwrite-admin";
import { parseShippingData } from "@/lib/shipping-parser";

// ─── Config ────────────────────────────────────────────────────────────────────
const WA_TOKEN =
  process.env.WHATSAPP_ACCESS_TOKEN ||
  "EAAjQT0EIDHUBRxClDmZC8CkfCba7b8aeylKimDeUNADaqv5AyjZCfZAtoaX5ZCOmdjRQhoMnbQCiUuolG1YHlY6ZAW2EddKTlTbZCLhuF4MxZBy0DE4SNLfVa8pfXzsQgingT1gMDc7aWeJ5KS97ZALxfmiQzBUDOTPOGJBE5CigpDcbeN9ZBkZAdWrFAGFG1r2vntSQZDZD";
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "yaxsel_webhook_2026";
const ENV_ADMINS = process.env.ADMIN_WHATSAPP_NUMBER || "";
const FALLBACK_ADMINS = "56962293893,56936599658,56935623858,56967115685"; // TEMP: removed 56992139185 for testing
const ADMIN_PHONES_RAW = ENV_ADMINS
  ? `${ENV_ADMINS},${FALLBACK_ADMINS}`
  : FALLBACK_ADMINS;
const ADMIN_PHONES = ADMIN_PHONES_RAW.split(",").map((num) =>
  num.replace(/\D/g, "").trim(),
);
const GEMINI_MODELS = GEMINI_TEXT_MODELS;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.donbalatomayorista.cl";
// Número fijo que confirma stock para los pedidos que Balatin arma solo por chat (botón "Confirmar stock")
const STOCK_VERIFIER_PHONE = "56962293893";

// ── In-memory caches to reduce Appwrite calls ──────────────────────────────
let _catCache: { data: any[]; ts: number } | null = null;
const CAT_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const _productSearchCache = new Map<string, { data: any[]; ts: number }>();
const PROD_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const _ordersCache = new Map<string, { data: any[]; ts: number }>();
const ORDERS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

let _adminContextCache: {
  data: { recentOrders: any[]; productsRes: any };
  ts: number;
} | null = null;
const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes for Admin Context

// ─── Admin system prompt ───────────────────────────────────────────────────────
const ADMIN_PROMPT = `Eres Balatin IA, el asistente administrativo de Don Balato Iván por WhatsApp.
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
- "pending" (Pedido Recibido)
- "processing" (Comprobando Stock)
- "paid" (Stock Confirmado — el stock fue confirmado, falta que el cliente pague)
- "payment_review" (Revisando Pago)
- "payment_confirmed" (Pago Confirmado — el pago del cliente fue verificado)
- "negotiation" (En negociación)
- "shipped" (Embalado)
- "delivered" (Entregado a Agencia)
- "cancelled" (Cancelado)

IMPORTANTE para no confundir estados:
- "confirmar stock" / "stock confirmado" → usa "paid".
- "marcar como pagado" / "pago confirmado" / "pago verificado" → usa "payment_confirmed".

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
  4. El estado del pedido TRADUCIDO AL ESPAÑOL (ej: 'Pedido Recibido' en lugar de 'pending', 'Stock Confirmado' en lugar de 'paid', 'Pago Confirmado' en lugar de 'payment_confirmed', 'Embalado' en lugar de 'shipped', 'Cancelado' en lugar de 'cancelled').
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
const CUSTOMER_PROMPT = `Eres Balatin, el gato de la suerte y asesor de ventas de la tienda Don Balato Iván en Chile.
Eres un gato blanco de la fortuna (maneki-neko): carismático, tranquilo y muy resolutivo. Hablas en español chileno natural.
¡NUNCA digas que eres un asistente virtual o un bot! Actúa 100% como el personaje de la tienda.

## Saludo personalizado:
- Si en el contexto ves "DATOS DEL CLIENTE" con un nombre, USA ESE NOMBRE para saludar.
- En el primer saludo preséntate brevemente como Balatin, el gato de la suerte.
- Ejemplo correcto: "¡Hola María! 🐾 Soy Balatin, tu gato de la suerte. ¿En qué te ayudo hoy?"
- Ejemplo incorrecto: "¡Hola bella! ¿Cómo estás hermosa?"

## TU FORMA DE HABLAR:
- Juguetón, tranquilo y MUY resolutivo. Frases cortas y directas.
- Expresiones felinas con moderación y naturalidad: "miau", "prr", emojis 🐾🐱✨ (máximo 1-2 por mensaje).

## Puedes ayudar con:
- Información de productos (precios, disponibilidad, descripción)
- Buscar productos por categoría o nombre
- Estado de pedidos
- Información de la tienda (horarios, envíos, pagos)
- Reemplazo de productos sin stock (Negociación)

## Negociación de productos faltantes:
Si en el contexto ves que el cliente tiene un pedido en estado "negotiation" (En negociación / mod.) con productos faltantes, debes iniciar o continuar la negociación inmediatamente en tu respuesta (incluso si el cliente solo te saluda, te da una respuesta corta, o pregunta qué pasa):
1. Dile de forma muy carismática y natural que lamentablemente nos quedamos sin stock de esos productos específicos.
2. Explícale que puede reemplazarlos él mismo entrando a los detalles de su pedido desde la página web, o si lo prefiere, tú mismo puedes ayudarlo a elegir y hacer los cambios por aquí en el chat.
3. Pregúntale qué prefiere.
4. Solo si te dice explícitamente que prefiere hacerlo él mismo por la web, le envías su enlace: ${SITE_URL}/pedido/ID_DEL_PEDIDO (usa el ID del pedido del contexto).
5. Si te dice que lo ayudes tú, muéstrale alternativas disponibles del catálogo y ayúdalo a decidir.

## Información de la tienda:
- Tienda: Don Balato Iván — artículos de hogar, aseo y variedad (NO somos tienda de belleza ni cosméticos).
- Sitio web: ${SITE_URL}
- País: Chile

## 🛒 CÓMO TOMAR UN PEDIDO POR CHAT (SIN LINKS, SIN FORMULARIOS)
Tú mismo tomas los pedidos conversando, como si fueras el vendedor. NUNCA envíes al cliente al carrito de la web ni le pidas que llene un formulario. NUNCA digas "no puedo tomar pedidos" — ¡SÍ puedes y DEBES tomarlos! Sigue este flujo EN ESTE ORDEN:
1. Cuando el cliente te diga qué productos quiere (o venga desde el catálogo de WhatsApp con una lista), identifica los productos EXACTOS del catálogo que se te inyecta como contexto (usa su "id" real). Si no tienes el id de un producto porque no está en tu contexto, usa [ACTION:SEARCH_SKU] o pide que te confirme el nombre exacto — NUNCA inventes un id. Si el cliente vino del catálogo con una lista de productos, esos productos DEBERÍAN estar en tu contexto (se buscaron automáticamente). Confírmalos con el cliente.
2. Confirma con el cliente la lista final de productos y cantidades.
3. Pídele su NOMBRE COMPLETO (nada más por ahora, el teléfono ya lo tienes tú automáticamente).
4. En cuanto tengas los productos + el nombre, genera EXACTAMENTE este bloque oculto al final de tu respuesta (no esperes a tener dirección ni nada más):
[ACTION:CREATE_ORDER]{"items":[{"id":"ID_REAL_DEL_PRODUCTO","qty":2}],"customerName":"Nombre Completo"}[/ACTION]
Dile al cliente que ya registraste su pedido y que estás confirmando el stock con el equipo — NUNCA inventes un código de pedido ni confirmes el stock tú mismo, eso lo hace el sistema.
5. Cuando el equipo confirme el stock, verás en el historial que ya se le avisó al cliente y se le pidieron los datos de envío que falten (dirección, comuna, región, agencia). A partir de ahí, tu trabajo es recolectar esos datos UNO A LA VEZ de forma conversacional (nunca los pidas todos juntos en una lista fría).
6. Si el cliente escribe un dato incompleto o ambiguo (ej. le falta el número de la casa, o pone una comuna que no existe), pídele amablemente que lo repita o aclare antes de seguir con el siguiente dato.
7. Cada vez que el cliente te dé uno o más datos de envío nuevos, guárdalos de inmediato generando este bloque oculto (solo incluye los campos que el cliente te acaba de dar, no inventes los demás):
[ACTION:UPDATE_SHIPPING]{"address":"Calle 123, depto 4","comuna":"Comuna","region":"Región","shippingAgency":"Starken","customerRut":"12.345.678-9"}[/ACTION]
8. Cuando ya tengas dirección, comuna y región (el RUT y la agencia intenta conseguirlos pero no bloquees si el cliente no los quiere dar), pídele que haga la transferencia y te mande la foto del comprobante por este mismo chat — nunca lo mandes a subir el comprobante a la web.
9. Cuando el cliente te mande la foto del comprobante, el sistema ya la detecta y la asocia automáticamente al pedido, tú solo agradécele.
10. Si el equipo te avisa (verás el aviso en el historial de la conversación) que algún producto no tiene stock, activa la sección "Negociación de productos faltantes" de arriba con ese cliente.

## Información de pago (solo cuando el pedido ya tenga el stock confirmado):
- Titular: DON BALATO IVAN
- RUT: 78.267.426-9
- Banco: Mercado Pago (Cuenta Vista)
- Número de cuenta: 1037879898
- Email: donbalatosoporte@gmail.com

## ⛔ REGLAS ABSOLUTAS (PROHIBIDO ROMPER):
1. NUNCA inventes nombres de productos. Solo menciona productos que aparezcan EXACTAMENTE en el catálogo que se te inyecta como contexto. Si no hay productos en el contexto, di que puedes mostrarle el catálogo en la web.
2. NUNCA inventes URLs. Solo usa ${SITE_URL} y las rutas reales del sitio (como ${SITE_URL}/productos o ${SITE_URL}/pedido/ID).
3. NUNCA inventes precios, stock, políticas de envío ni métodos de pago que no estén en tu contexto.
4. Si NO tienes la información que el cliente pide (ej: precios por mayor, catálogo completo, info que no está en tu contexto), ADMÍTELO HONESTAMENTE y di algo como: "Esa información la maneja directamente nuestro equipo, déjame conectarte con la persona indicada para que te ayude personalmente 🐾" y añade al final: [ACTION:ESCALATE_ADMIN][/ACTION]
5. NUNCA des vueltas ni digas "dame un minutito" o "ya casi lo tengo" si no puedes obtener la información. Si no la tienes, escala inmediatamente.
6. Si el cliente te pide algo por segunda vez y no puedes responderlo, ESCALA INMEDIATAMENTE al admin.
7. Sé cálido, cercano y carismático. Evita respuestas muy largas o robóticas.
8. Siempre termina con una pregunta o invitación para seguir la conversación.
- Si hay un problema muy grande que no puedes resolver o manejar con el cliente, dile amablemente que lo conectarás con una persona del equipo para que lo ayude mejor, y DEBES añadir al final de tu respuesta EXACTAMENTE este bloque oculto: [ACTION:ESCALATE_ADMIN][/ACTION]

Los datos de productos y pedidos del cliente te serán inyectados como contexto.`;

// Helper to decide if user message needs Appwrite DB context to save reads
function needsDbContext(text: string): boolean {
  const cleaned = text.toLowerCase().trim();
  if (cleaned.length < 3) return false;

  const pureChitchat =
    /^(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches|gracias|muchas\s+gracias|adios|chao|ok|okay|listo|perfecto|super|genial|hola\s+balatin|balatin|como\s+estas|cómo\s+estás|que\s+tal|qué\s+tal)$/i;
  return !pureChitchat.test(cleaned);
}

// Helper: detect if a text is a greeting
function isGreeting(text: string): boolean {
  const cleaned = text.toLowerCase().trim();
  return (
    /^(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches|hey|hi|holi|hola\s+balatin|holaa|hola+a|ola|ola\s+balatin)\b/i.test(
      cleaned,
    ) ||
    /^(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches|hey|hi|holi|holaa|ola)$/i.test(
      cleaned,
    )
  );
}

// Helper: match two phone numbers by comparing last 8 digits
function phonesMatch(a: string, b: string): boolean {
  const cleanA = a.replace(/\D/g, "");
  const cleanB = b.replace(/\D/g, "");
  if (!cleanA || !cleanB) return false;
  if (cleanA === cleanB) return true;
  const tailA = cleanA.slice(-8);
  const tailB = cleanB.slice(-8);
  return tailA.length === 8 && tailA === tailB;
}

// Helper: look up a registered user by phone in the users collection
async function lookupRegisteredUser(
  phone: string,
): Promise<{ name: string; email: string } | null> {
  try {
    const cleaned = phone.replace(/\D/g, "");
    console.log(
      "[WhatsApp Webhook] lookupRegisteredUser: searching for phone:",
      cleaned,
    );

    let docs: any[] = [];
    try {
      const qPhone1 = cleaned;
      const qPhone2 = cleaned.startsWith("569")
        ? cleaned.slice(2)
        : `56${cleaned}`;
      const qPhone3 = `+${cleaned}`;
      const qPhone = JSON.stringify({
        method: "equal",
        attribute: "phone",
        values: [qPhone1, qPhone2, qPhone3],
      });
      const qLimit = JSON.stringify({ method: "limit", values: [5] });
      const qOrderDesc = JSON.stringify({
        method: "orderDesc",
        attribute: "$createdAt",
      });
      const res = await serverListDocuments(USERS_COLLECTION_ID, [
        qOrderDesc,
        qPhone,
        qLimit,
      ]);
      docs = res.documents || [];
      console.log(
        "[WhatsApp Webhook] lookupRegisteredUser: fetched by phone query",
        docs.length,
      );
    } catch (e) {
      console.warn(
        "[WhatsApp Webhook] lookupRegisteredUser query failed, falling back to 20 limit:",
        e,
      );
      const qLimit20 = JSON.stringify({ method: "limit", values: [20] });
      const qOrderDesc = JSON.stringify({
        method: "orderDesc",
        attribute: "$createdAt",
      });
      const res = await serverListDocuments(USERS_COLLECTION_ID, [
        qOrderDesc,
        qLimit20,
      ]);
      docs = res.documents || [];
    }

    // Search for a matching phone
    for (const doc of docs as any[]) {
      const docPhone = String(doc.phone || "").replace(/\D/g, "");
      if (!docPhone) continue;
      if (phonesMatch(docPhone, cleaned)) {
        const name = doc.name || "";
        const email = doc.email || "";
        console.log(
          "[WhatsApp Webhook] lookupRegisteredUser: MATCH FOUND! name:",
          name,
          "phone:",
          docPhone,
        );
        return { name, email };
      }
    }

    console.log(
      "[WhatsApp Webhook] lookupRegisteredUser: no match found among",
      docs.length,
      "users",
    );
    // Log some sample phones for debugging
    const samplePhones = docs
      .slice(0, 10)
      .map((d: any) => d.phone || "(empty)");
    console.log(
      "[WhatsApp Webhook] lookupRegisteredUser: sample phones in DB:",
      samplePhones,
    );

    return null;
  } catch (e) {
    console.warn("[WhatsApp Webhook] lookupRegisteredUser error:", e);
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
  let rut = match[0].toUpperCase().replace(/\./g, "");
  if (!rut.includes("-") && rut.length >= 2) {
    rut = rut.slice(0, -1) + "-" + rut.slice(-1);
  }
  return rut;
}

// Helper: search orders by customer email
async function findOrdersByEmail(email: string): Promise<any[]> {
  try {
    const qEmail = JSON.stringify({
      method: "equal",
      attribute: "CUSTOMEREMAIL",
      values: [email, email.toLowerCase()],
    });
    const qOrderDesc = JSON.stringify({
      method: "orderDesc",
      attribute: "$createdAt",
    });
    const qLimit = JSON.stringify({ method: "limit", values: [10] });
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [
      qOrderDesc,
      qEmail,
      qLimit,
    ]);
    return res.documents || [];
  } catch (e) {
    console.warn("[WhatsApp Webhook] findOrdersByEmail error:", e);
    return [];
  }
}

// Helper: search orders by customer RUT
async function findOrdersByRut(rut: string): Promise<any[]> {
  try {
    // Try both with and without dots, normalized
    const rutClean = rut.replace(/\./g, "").toUpperCase();
    const rutWithDots = formatRutWithDots(rutClean);
    const qRut = JSON.stringify({
      method: "equal",
      attribute: "CUSTOMERRUT",
      values: [rutClean, rutWithDots, rut],
    });
    const qOrderDesc = JSON.stringify({
      method: "orderDesc",
      attribute: "$createdAt",
    });
    const qLimit = JSON.stringify({ method: "limit", values: [10] });
    const res = await serverListDocuments(ORDERS_COLLECTION_ID, [
      qOrderDesc,
      qRut,
      qLimit,
    ]);
    return res.documents || [];
  } catch (e) {
    console.warn("[WhatsApp Webhook] findOrdersByRut error:", e);
    return [];
  }
}

// Helper: format RUT with dots (12345678-9 → 12.345.678-9)
function formatRutWithDots(rut: string): string {
  const parts = rut.split("-");
  if (parts.length !== 2) return rut;
  const num = parts[0];
  const dv = parts[1];
  let formatted = "";
  for (let i = num.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) formatted = "." + formatted;
    formatted = num[i] + formatted;
  }
  return formatted + "-" + dv;
}

// Helper: search users by email
async function findUserByEmail(email: string): Promise<any | null> {
  try {
    const qEmail = JSON.stringify({
      method: "equal",
      attribute: "email",
      values: [email, email.toLowerCase()],
    });
    const qLimit = JSON.stringify({ method: "limit", values: [1] });
    const res = await serverListDocuments(USERS_COLLECTION_ID, [
      qEmail,
      qLimit,
    ]);
    return res.documents[0] || null;
  } catch (e) {
    console.warn("[WhatsApp Webhook] findUserByEmail error:", e);
    return null;
  }
}

// Helper: link a WhatsApp phone to found orders and optionally user account
async function linkPhoneToOrdersAndUser(
  fromPhone: string,
  orders: any[],
  userDoc: any | null,
): Promise<{ linkedOrders: number; linkedUser: boolean }> {
  const cleanedFrom = fromPhone.replace(/\D/g, "");
  let linkedOrders = 0;

  for (const order of orders) {
    const currentPhone = String(order.CUSTOMERPHONE || "");
    const cleanCurrent = currentPhone.replace(/\D/g, "");
    if (cleanCurrent !== cleanedFrom) {
      try {
        await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
          CUSTOMERPHONE: `+${cleanedFrom}`,
        });
        linkedOrders++;
      } catch (e) {
        console.warn("[WhatsApp Webhook] Failed to link order", order.$id, e);
      }
    } else {
      linkedOrders++; // Already linked
    }
  }

  let linkedUser = false;
  if (userDoc) {
    const currentPhone = String(userDoc.phone || "");
    const cleanCurrent = currentPhone.replace(/\D/g, "");
    if (cleanCurrent !== cleanedFrom) {
      try {
        await serverUpdateDocument(USERS_COLLECTION_ID, userDoc.$id, {
          phone: `+${cleanedFrom}`,
        });
        linkedUser = true;
      } catch (e) {
        console.warn("[WhatsApp Webhook] Failed to link user", userDoc.$id, e);
      }
    } else {
      linkedUser = true;
    }
  }

  return { linkedOrders, linkedUser };
}

// Link WhatsApp number to orders via LINKED_WHATSAPP (without overwriting CUSTOMERPHONE)
async function linkWhatsappToOrders(
  whatsappPhone: string,
  orders: any[],
): Promise<number> {
  const cleanedWa = whatsappPhone.replace(/\D/g, "");
  let linked = 0;
  for (const order of orders) {
    const existingLinked: string[] = Array.isArray(order.LINKED_WHATSAPP)
      ? order.LINKED_WHATSAPP.map((p: string) => p.replace(/\D/g, ""))
      : [];
    if (existingLinked.includes(cleanedWa)) {
      linked++;
      continue;
    }
    try {
      await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
        LINKED_WHATSAPP: [...existingLinked, `+${cleanedWa}`],
      });
      linked++;
    } catch (e) {
      console.warn(
        "[WhatsApp Webhook] Failed to link WhatsApp to order",
        order.$id,
        e,
      );
    }
  }
  return linked;
}

// Helper: send welcome menu as interactive list
async function sendWelcomeMenu(
  phone: string,
  customerName: string,
  token: string,
  customBody?: string,
) {
  const firstName = customerName.split(" ")[0] || customerName || "amigo";
  const body =
    customBody ||
    "Estas son las cosas que puedo hacer por ti, " +
      firstName +
      " 🐾 toca una opción para saber más:";
  await sendWhatsAppList(
    phone,
    {
      header: "🐾 ¡Hola! Soy Balatin",
      body,
      footer: "Don Balato Iván · Hogar, aseo y variedad",
      buttonText: "Opciones de ayuda 🐾",
      sections: [
        {
          title: "Mis funciones",
          rows: [
            {
              id: "func_pedido",
              title: "📦 Ver mi pedido",
              description: "Conoce el estado exacto de tu compra",
            },
            {
              id: "func_comprobante",
              title: "🧾 Subir comprobante",
              description: "Avisa que ya realizaste el pago",
            },
            {
              id: "func_ofertas",
              title: "🔥 Saber de ofertas",
              description: "Entérate de nuestros remates",
            },
            {
              id: "func_negociacion",
              title: "🔄 Reemplazar faltantes",
              description: "Cambia productos agotados",
            },
            {
              id: "func_humano",
              title: "👤 Hablar con asesor",
              description: "Comunícate con una persona del equipo",
            },
          ],
        },
      ],
    },
    token,
  );
}

// ─── Webhook verification (GET) ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verificado ✅");
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// ─── Incoming messages handler (POST) ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meta sends test pings with empty changes
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages?.length) {
      return NextResponse.json({ status: "no_messages" });
    }

    const msg = messages[0];
    const fromPhone = msg.from as string; // sender's phone number
    const msgId = msg.id as string;
    const msgType = msg.type as string;

    // ── PREVENT WHATSAPP RETRIES (Duplicate msgId lock) ──
    try {
      // getWhatsAppDocId returns u_<hash> (34 chars). We replace u_ with l_ for the lock
      const lockDocId = getWhatsAppDocId(msgId, "user").replace("u_", "l_");
      const { serverGetDocument, serverCreateDocument } =
        await import("@/lib/appwrite-server");
      const { ADMIN_CHAT_COLLECTION_ID } = await import("@/lib/appwrite-admin");

      try {
        await serverGetDocument(ADMIN_CHAT_COLLECTION_ID, lockDocId);
        // If found, this is a retry from WhatsApp. Ignore it.
        console.log(
          `[WhatsApp] Ignoring duplicate webhook retry for msgId: ${msgId}`,
        );
        return NextResponse.json({ status: "duplicate_ignored" });
      } catch {
        // Create lock
        await serverCreateDocument(ADMIN_CHAT_COLLECTION_ID, lockDocId, {
          userId: `system:lock`,
          senderRole: "admin",
          message: msgId,
          readByUser: true,
          readByAdmin: true,
        });
      }
    } catch (e) {
      console.warn("[WhatsApp] Failed to process lock:", e);
    }

    let userText = "";
    let interactiveId = "";
    let inlineDataParts: any[] = [];

    if (msgType === "text") {
      userText = ((msg.text?.body as string) || "").trim();
    } else if (msgType === "interactive") {
      if (msg.interactive?.type === "list_reply") {
        userText = ((msg.interactive.list_reply?.title as string) || "").trim();
        interactiveId = msg.interactive.list_reply?.id as string;
      } else if (msg.interactive?.type === "button_reply") {
        userText = (
          (msg.interactive.button_reply?.title as string) || ""
        ).trim();
        interactiveId = msg.interactive.button_reply?.id as string;
      }
    } else if (msgType === "button") {
      userText = ((msg.button?.text as string) || "").trim();
    } else if (msgType === "image") {
      const mediaId = msg.image?.id;
      userText = ((msg.image?.caption as string) || "").trim();
      if (!userText) {
        userText =
          "Aquí tienes una imagen que te envío para que me ayudes a identificar productos o resolver dudas.";
      }

      if (mediaId && WA_TOKEN) {
        // Track usage
        const usageRes = await recordKeniaUsage(fromPhone, { imageSent: true });
        const BAN_PROOF_PHONES = ["56992139185"];
        if (
          !BAN_PROOF_PHONES.includes(fromPhone.replace(/\D/g, "")) &&
          (usageRes.imagesSentToday || 0) > 5
        ) {
          await setKeniaBlocked(fromPhone, true);
          await sendWhatsAppMessage(
            fromPhone,
            "¡Miau! 🐾 Ya me enviaste muchas fotitos por hoy y se me llenó la memoria. Dame un momentito que lo reviso con el equipo de tienda para ayudarte bien.",
            WA_TOKEN,
          );
          // Notify admin
          const notifyText = `🚨 *LÍMITE DE FOTOS SUPERADO*\nEl usuario +${fromPhone} intentó enviar más de 5 fotos hoy.\nSe ha bloqueado la IA para este usuario.`;
          for (const admin of ADMIN_PHONES) {
            await sendWhatsAppMessage(admin, notifyText, WA_TOKEN);
          }
          return NextResponse.json({ status: "limit_exceeded" });
        }

        // Fetch image
        try {
          const mediaRes = await fetch(
            `https://graph.facebook.com/v19.0/${mediaId}`,
            {
              headers: { Authorization: `Bearer ${WA_TOKEN}` },
            },
          );
          const mediaData = await mediaRes.json();
          if (mediaData.url) {
            const dlRes = await fetch(mediaData.url, {
              headers: { Authorization: `Bearer ${WA_TOKEN}` },
            });
            const buffer = await dlRes.arrayBuffer();

            // Dynamically check if user has a pending order (fixes volatile tmpdir usageState)
            const usageState = await getKeniaUsage(fromPhone);
            let pendingOrderId = usageState.awaitingComprobante
              ? usageState.pendingOrderId
              : null;
            let orderCode = pendingOrderId || "";

            // Balatin flow: if user is in awaiting_payment step, use the balatin order
            if (
              !pendingOrderId &&
              usageState.balatinOrderFlow === true &&
              usageState.balatinStep === "awaiting_payment"
            ) {
              pendingOrderId = usageState.balatinOrderId || null;
              orderCode = usageState.balatinOrderCode || "";
            }

            if (!pendingOrderId && usageState.hasNoPendingOrders !== true) {
              const { serverListDocuments } =
                await import("@/lib/appwrite-server");
              const { ORDERS_COLLECTION_ID } =
                await import("@/lib/appwrite-admin");
              try {
                const cleanedPhone = fromPhone.replace(/\D/g, "");
                const qOrderDesc = JSON.stringify({
                  method: "orderDesc",
                  attribute: "$createdAt",
                });
                const qLimit5 = JSON.stringify({
                  method: "limit",
                  values: [5],
                });
                const qPhone = JSON.stringify({
                  method: "contains",
                  attribute: "CUSTOMERPHONE",
                  values: [cleanedPhone],
                });
                // We fetch up to 5 orders matching the phone directly from DB
                const resOrders = await serverListDocuments(
                  ORDERS_COLLECTION_ID,
                  [qOrderDesc, qPhone, qLimit5],
                );
                const myOrders = resOrders.documents || [];
                // First: pending orders without payment proof
                const pending = myOrders.find(
                  (o: any) =>
                    (o.STATUS === "pending" || o.STATUS === "pending_stock") &&
                    !o.PAYMENTPROOFURL,
                );
                if (pending) {
                  pendingOrderId = String(pending.$id);
                  orderCode = String(pending.ORDERCODE || pending.$id);
                } else {
                  // Also check processing/paid orders without proof (client may have paid but not uploaded,
                  // or Balatin already confirmed stock — STATUS 'paid' — and is waiting for the transfer proof)
                  const awaitingProof = myOrders.find(
                    (o: any) =>
                      (o.STATUS === "processing" || o.STATUS === "paid") &&
                      !o.PAYMENTPROOFURL,
                  );
                  if (awaitingProof) {
                    pendingOrderId = String(awaitingProof.$id);
                    orderCode = String(
                      awaitingProof.ORDERCODE || awaitingProof.$id,
                    );
                  } else {
                    // Mark so we don't query again this session when they send more images
                    await recordKeniaUsage(fromPhone, {
                      hasNoPendingOrders: true,
                    });
                  }
                }
              } catch (e) {
                console.warn(
                  "[WhatsApp Webhook] Failed to fetch orders for image comprobante check",
                  e,
                );
              }
            }

            // Use Gemini Vision to verify the image is actually a payment receipt
            // Skip vision check for Balatin flow (paused per user request)
            const isBalatinFlow =
              usageState.balatinOrderFlow === true &&
              usageState.balatinStep === "awaiting_payment";
            let isComprobante = false;
            if (pendingOrderId && !isBalatinFlow) {
              try {
                const base64Check = Buffer.from(buffer).toString("base64");
                const visionHeaders = await getGeminiAuthHeaders();
                const visionRes = await fetch(
                  buildGeminiUrl("gemini-3.1-flash-lite", "generateContent"),
                  {
                    method: "POST",
                    headers: visionHeaders,
                    body: JSON.stringify({
                      contents: [
                        {
                          parts: [
                            {
                              text: '¿Esta imagen es un comprobante de pago, transferencia bancaria, o recibo de pago? Responde solo "SI" o "NO".',
                            },
                            {
                              inline_data: {
                                mime_type: msg.image?.mime_type || "image/jpeg",
                                data: base64Check,
                              },
                            },
                          ],
                        },
                      ],
                      generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 10,
                      },
                    }),
                  },
                );
                const visionData = await visionRes.json();
                const visionText = String(
                  visionData?.candidates?.[0]?.content?.parts?.[0]?.text || "",
                )
                  .trim()
                  .toUpperCase();
                isComprobante = visionText.startsWith("SI");
                console.log(
                  "[WhatsApp Webhook] Comprobante vision check:",
                  visionText,
                );
              } catch (e) {
                console.warn(
                  "[WhatsApp Webhook] Vision check failed, assuming comprobante:",
                  e,
                );
                isComprobante = true; // Fallback: assume it is if we can't verify
              }
            } else if (isBalatinFlow) {
              // Balatin flow: skip vision check, assume any image is the comprobante
              isComprobante = true;
            }

            if (pendingOrderId && isComprobante) {
              const fileName = `comprobante_${Date.now()}.jpg`;
              const uploadRes = await serverUploadFile(
                MEDIA_BUCKET_ID,
                buffer,
                fileName,
              );
              const fileUrl = getPublicFileUrl(MEDIA_BUCKET_ID, uploadRes.$id);

              if (isBalatinFlow) {
                // Balatin flow: save comprobante, change status to payment_review
                await serverUpdateDocument(
                  ORDERS_COLLECTION_ID,
                  pendingOrderId,
                  {
                    PAYMENTPROOFURL: fileUrl,
                    STATUS: "payment_review",
                  },
                );

                const customerName = usageState.customerName || "";

                // Check if customer already has shipping data from a previous order
                let prevData: any = null;
                try {
                  const cleanedPhoneForLookup = fromPhone.replace(/\D/g, "");
                  const qOrderDescPrev = JSON.stringify({
                    method: "orderDesc",
                    attribute: "$createdAt",
                  });
                  const qPhonePrev = JSON.stringify({
                    method: "contains",
                    attribute: "CUSTOMERPHONE",
                    values: [cleanedPhoneForLookup],
                  });
                  const qLimitPrev = JSON.stringify({
                    method: "limit",
                    values: [10],
                  });
                  const prevOrders = await serverListDocuments(
                    ORDERS_COLLECTION_ID,
                    [qOrderDescPrev, qPhonePrev, qLimitPrev],
                  );
                  // Find the most recent order that has all required shipping data (email optional)
                  prevData = (prevOrders.documents || []).find(
                    (o: any) =>
                      o.CUSTOMERRUT &&
                      o.ADDRESS &&
                      o.COMUNA &&
                      o.REGION &&
                      o.SHIPPINGAGENCY,
                  );
                } catch (e) {
                  console.warn(
                    "[Balatin Catalog Flow] Could not fetch previous orders for data lookup:",
                    e,
                  );
                }

                if (prevData) {
                  // Returning customer with full data — copy to new order and go straight to confirmation
                  try {
                    await serverUpdateDocument(
                      ORDERS_COLLECTION_ID,
                      pendingOrderId,
                      {
                        CUSTOMERRUT: prevData.CUSTOMERRUT,
                        ADDRESS: prevData.ADDRESS,
                        COMUNA: prevData.COMUNA,
                        REGION: prevData.REGION,
                        SHIPPINGAGENCY: prevData.SHIPPINGAGENCY,
                        CUSTOMEREMAIL: prevData.CUSTOMEREMAIL,
                        CUSTOMERNAME: prevData.CUSTOMERNAME || customerName,
                      },
                    );
                  } catch (e) {
                    console.warn(
                      "[Balatin Catalog Flow] Could not copy previous data to new order:",
                      e,
                    );
                  }

                  await recordKeniaUsage(fromPhone, {
                    balatinComprobanteReceived: true,
                    balatinStep: "awaiting_data_confirm",
                  });

                  const emailLine = prevData.CUSTOMEREMAIL
                    ? `\n• *Email:* ${prevData.CUSTOMEREMAIL}`
                    : "";
                  const dataMsg = `¡Comprobante recibido, ${customerName}! \n\nNuestro equipo va a revisar tu pago. Cuando esté confirmado, te avisaré por este medio.\n\nTengo tus datos de tu pedido anterior:\n\n• *RUT:* ${prevData.CUSTOMERRUT}\n• *Dirección:* ${prevData.ADDRESS}\n• *Comuna:* ${prevData.COMUNA}\n• *Región:* ${prevData.REGION}\n• *Agencia:* ${prevData.SHIPPINGAGENCY}${emailLine}\n\n¿Usamos estos mismos datos? Responde *CORRECTO* para confirmar, o dime qué quieres cambiar. `;
                  await sendWhatsAppMessage(fromPhone, dataMsg, WA_TOKEN);
                  await addToHistory(
                    fromPhone,
                    "user",
                    "[Imagen Comprobante]",
                    msgId,
                  );
                  await addToHistory(
                    fromPhone,
                    "assistant",
                    dataMsg,
                    `balatin-data-${Date.now()}`,
                  );
                  await markAsRead(msgId, WA_TOKEN);
                  return NextResponse.json({
                    status: "balatin_comprobante_saved_returning",
                  });
                }

                // New customer or no previous data — ask for all data
                await recordKeniaUsage(fromPhone, {
                  balatinComprobanteReceived: true,
                  balatinStep: "awaiting_data",
                });

                const dataMsg = `¡Comprobante recibido, ${customerName}! Nuestro equipo va a revisar tu pago. Cuando este confirmado, te avisare por este medio.\n\nMientras tanto, necesito tus datos para el envio:\n\n• *RUT* (ej: 12.345.678-9 o 12345678-9)\n• *Direccion* (calle, numero, depto)\n• *Comuna*\n• *Region*\n• *Agencia de envio* (Starken, Pullman Cargo, Varmontt, BluExpress, CYC, TVP, Cruz del Sur, Tramar, 5SUR, Mena, CACEM, JT Transportes, o retiro en tienda)\n• Email (opcional)\n\nPuedes escribirlos todos juntos o uno por uno, como prefieras.\n\nCuando termines, escribe *TERMINE*.`;
                await sendWhatsAppMessage(fromPhone, dataMsg, WA_TOKEN);
                await addToHistory(
                  fromPhone,
                  "user",
                  "[Imagen Comprobante]",
                  msgId,
                );
                await addToHistory(
                  fromPhone,
                  "assistant",
                  dataMsg,
                  `balatin-data-${Date.now()}`,
                );
                await markAsRead(msgId, WA_TOKEN);
                return NextResponse.json({
                  status: "balatin_comprobante_saved",
                });
              }

              // Non-Balatin flow: original behavior
              await serverUpdateDocument(ORDERS_COLLECTION_ID, pendingOrderId, {
                PAYMENTPROOFURL: fileUrl,
                STATUS: "payment_review",
              });

              if (!orderCode || orderCode === pendingOrderId) {
                try {
                  const doc = await serverGetDocument(
                    ORDERS_COLLECTION_ID,
                    pendingOrderId,
                  );
                  if (doc.ORDERCODE) orderCode = String(doc.ORDERCODE);
                } catch (e) {}
              }

              await notifyPaymentUploaded(
                orderCode,
                "Cliente (vía WhatsApp)",
                fileUrl,
                pendingOrderId,
              );
              await recordKeniaUsage(fromPhone, {
                awaitingComprobante: false,
                pendingOrderId: undefined,
              });

              const reply = `¡Listo! Recibí tu comprobante y quedó guardado en tu pedido #${orderCode}. Apenas finanzas lo valide, te aviso para seguir con el envío. ¡Muchas gracias! `;
              await sendWhatsAppMessage(fromPhone, reply, WA_TOKEN);
              await addToHistory(
                fromPhone,
                "user",
                "[Imagen Comprobante]",
                msgId,
              );
              await addToHistory(
                fromPhone,
                "assistant",
                reply,
                `comprobante-${Date.now()}`,
              );

              return NextResponse.json({ status: "comprobante_uploaded" });
            }

            const base64 = Buffer.from(buffer).toString("base64");
            inlineDataParts.push({
              inline_data: {
                mime_type: msg.image?.mime_type || "image/jpeg",
                data: base64,
              },
            });
          }
        } catch (e) {
          console.error("[WhatsApp Webhook] Failed to download media:", e);
        }
      }
    }

    if (!userText && !interactiveId && inlineDataParts.length === 0) {
      if (
        msgType !== "text" &&
        msgType !== "interactive" &&
        msgType !== "image" &&
        msgType !== "button"
      ) {
        await sendWhatsAppMessage(
          fromPhone,
          "¡Hola! 👋 Por ahora solo puedo procesar mensajes de texto o imágenes. Escríbeme tu consulta y te ayudo enseguida.",
          WA_TOKEN,
        );
      }
      return NextResponse.json({ status: "non_text_ignored" });
    }

    // Deduplication check
    try {
      const { serverGetDocument } = await import("@/lib/appwrite-server");
      const { ADMIN_CHAT_COLLECTION_ID } = await import("@/lib/appwrite-admin");
      // If we can find the message doc in the database, it means we already processed this message.
      await serverGetDocument(
        ADMIN_CHAT_COLLECTION_ID,
        getWhatsAppDocId(msgId, "user"),
      );
      console.log(
        `[WhatsApp Webhook] Duplicate message ${msgId} detected. Skipping.`,
      );
      return NextResponse.json({ status: "already_processed" });
    } catch (e) {
      // Document not found, proceed.
    }

    const cleanedFrom = fromPhone.replace(/\D/g, "").trim();
    const keniaConfig = await getKeniaConfig();

    const debugMode = keniaConfig.debugMode === true;
    const DEBUG_PHONE = "56992139185";
    let isAdmin = ADMIN_PHONES.includes(cleanedFrom);
    if (debugMode && cleanedFrom === DEBUG_PHONE) {
      isAdmin = false;
    }
    console.log(
      `[WhatsApp Webhook] Msg from: ${fromPhone} (cleaned: ${cleanedFrom}) | isAdmin: ${isAdmin} | debugMode: ${debugMode} | Admin list:`,
      ADMIN_PHONES,
    );

    // Obtener uso actual del remitente (se usa en múltiples lugares, por eso se declara aquí)
    const usage = await getKeniaUsage(fromPhone, keniaConfig.blockedPhones);
    const testAsClient = usage.testAsClient === true;

    // Procesar comandos de modo cliente
    if (isAdmin && userText.toUpperCase() === "MODO CLIENTE") {
      await recordKeniaUsage(fromPhone, { testAsClient: true });
      const reply =
        'Balatin: Modo cliente activado para ti. Te trataré como a un cliente a partir de ahora, incluso si la IA está desactivada. Escribe "MODO ADMIN" para volver al modo administrador. ';
      await sendWhatsAppMessage(fromPhone, reply, WA_TOKEN);
      await addToHistory(fromPhone, "assistant", reply, msgId);
      return NextResponse.json({ status: "mode_client_activated" });
    }

    if (isAdmin && userText.toUpperCase() === "MODO ADMIN") {
      await recordKeniaUsage(fromPhone, { testAsClient: false });
      const reply =
        "Balatin: Modo administrador reactivado. Volverás a recibir los reportes y poder ejecutar comandos de administración. 🛡️";
      await sendWhatsAppMessage(fromPhone, reply, WA_TOKEN);
      await addToHistory(fromPhone, "assistant", reply, msgId);
      return NextResponse.json({ status: "mode_admin_activated" });
    }

    // Si está en modo cliente, tratamos a este administrador como un cliente normal
    if (testAsClient) {
      isAdmin = false;
    }

    // ── BALATIN CATALOG FLOW (no AI, programmed logic) ──────────────────────────
    // Detect catalog order message: "*Hola Balatin!* ... Codigo: WA-XXXX"
    const balatinCatalogMatch = userText.match(/\*\s*Hola\s+Balatin!?\s*\*/i);
    const catCodeMatch = userText.match(
      /(?:Codigo|C[oó]digo)[:\s]*\*?(WA-\d{4,8})\*?/i,
    );
    const waCodeMatch = userText.match(/WA-\d{6,8}/i);

    if (
      (balatinCatalogMatch || catCodeMatch) &&
      (catCodeMatch || waCodeMatch)
    ) {
      const orderCode = (
        catCodeMatch?.[1] ||
        waCodeMatch?.[0] ||
        ""
      ).toUpperCase();
      console.log(
        `[Balatin Catalog Flow] Detected catalog order: ${orderCode} from ${fromPhone}`,
      );
      console.log(
        `[Balatin Catalog Flow] balatinCatalogMatch:`,
        !!balatinCatalogMatch,
        "catCodeMatch:",
        !!catCodeMatch,
        "waCodeMatch:",
        !!waCodeMatch,
      );
      console.log(
        `[Balatin Catalog Flow] userText first 100 chars:`,
        userText.substring(0, 100),
      );

      try {
        const { serverListDocuments, serverUpdateDocument, serverGetDocument } =
          await import("@/lib/appwrite-server");
        const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
        const { isNightNow, santiagoHour } = await import("@/lib/night-mode");

        // Find the order
        const qEqual = JSON.stringify({
          method: "equal",
          attribute: "ORDERCODE",
          values: [orderCode],
        });
        const qLimit1 = JSON.stringify({ method: "limit", values: [1] });
        const res = await serverListDocuments(ORDERS_COLLECTION_ID, [
          qEqual,
          qLimit1,
        ]);
        console.log(
          `[Balatin Catalog Flow] Order search result:`,
          res.documents?.length || 0,
          "documents found for code",
          orderCode,
        );

        if (res.documents && res.documents.length > 0) {
          const order = res.documents[0] as any;
          const orderId = order.$id;
          const night = isNightNow();
          const hour = santiagoHour();

          // Link phone to order (LINKED_WHATSAPP may not exist as attribute, so try without it)
          try {
            await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
              CUSTOMERPHONE: `+${cleanedFrom}`,
            });
          } catch (updErr) {
            console.warn(
              "[Balatin Catalog Flow] Phone update failed, continuing anyway:",
              updErr,
            );
          }

          // Check if customer already has a name from a previous order
          let existingCustomerName = usage.customerName || "";
          if (!existingCustomerName) {
            try {
              const qOrderDescPrev = JSON.stringify({
                method: "orderDesc",
                attribute: "$createdAt",
              });
              const qPhonePrev = JSON.stringify({
                method: "contains",
                attribute: "CUSTOMERPHONE",
                values: [cleanedFrom],
              });
              const qLimitPrev = JSON.stringify({
                method: "limit",
                values: [5],
              });
              const prevOrders = await serverListDocuments(
                ORDERS_COLLECTION_ID,
                [qOrderDescPrev, qPhonePrev, qLimitPrev],
              );
              const prevWithName = (prevOrders.documents || []).find(
                (o: any) =>
                  o.CUSTOMERNAME && String(o.CUSTOMERNAME).trim().length >= 2,
              );
              if (prevWithName) {
                existingCustomerName = String(prevWithName.CUSTOMERNAME).trim();
                console.log(
                  `[Balatin Catalog Flow] Found existing customer name from previous order: ${existingCustomerName}`,
                );
              }
            } catch (e) {
              console.warn(
                "[Balatin Catalog Flow] Could not fetch previous orders for name lookup:",
                e,
              );
            }
          }

          // If we already know the customer's name, skip name collection and update the order
          if (existingCustomerName) {
            // Save the name to the new order
            try {
              await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
                CUSTOMERNAME: existingCustomerName,
              });
            } catch (e) {
              console.warn(
                "[Balatin Catalog Flow] Could not save existing name to new order:",
                e,
              );
            }

            // Get order total
            let orderTotal = 0;
            try {
              const orderDoc: any = await serverGetDocument(
                ORDERS_COLLECTION_ID,
                orderId,
              );
              orderTotal = Number(orderDoc?.TOTAL || orderDoc?.SUBTOTAL || 0);
            } catch (e) {}

            await recordKeniaUsage(fromPhone, {
              isGuestWithOrders: true,
              isRegistered: true,
              customerName: existingCustomerName,
              balatinOrderFlow: true,
              balatinOrderId: orderId,
              balatinOrderCode: orderCode,
              balatinStep: "awaiting_payment",
              balatinComprobanteReceived: false,
            });

            await markAsRead(msgId, WA_TOKEN);
            await addToHistory(fromPhone, "user", userText, msgId);

            const night = isNightNow();
            if (night) {
              // Night: returning customer, skip name, go straight to payment
              const welcomeMsg = `¡Hola, ${existingCustomerName}! ¡Qué bueno verte de nuevo!\n\n¡Ya tomé tu pedido *${orderCode}*! Como ya te conozco, no necesito pedirte tus datos de nuevo. \n\nPara continuar, haz la transferencia:\n\n *Datos para la transferencia:*\nTitular: DON BALATO IVAN\nRUT: 78.267.426-9\nBanco: Mercado Pago (Cuenta Vista)\nCuenta: 1037879898\nEmail: donbalatosoporte@gmail.com\n\nMonto total: $${orderTotal.toLocaleString("es-CL")}\n\nCuando transfieras, mándame la *foto del comprobante* por aquí. `;
              await sendWhatsAppMessage(fromPhone, welcomeMsg, WA_TOKEN);
              await addToHistory(
                fromPhone,
                "assistant",
                welcomeMsg,
                `balatin-returning-${Date.now()}`,
              );
              return NextResponse.json({
                status: "balatin_catalog_returning_night",
              });
            } else {
              // Day: returning customer, verify stock first, then payment
              await recordKeniaUsage(fromPhone, {
                balatinStep: "awaiting_stock_confirmation",
              });

              const dayMsg = `¡Hola, ${existingCustomerName}! ¡Qué bueno verte de nuevo!\n\n¡Ya tomé tu pedido *${orderCode}*! Ahora mismo estamos verificando el stock de tus productos.\n\nEn cuanto la cajera lo confirme, te aviso altiro para seguir. ¡Un momentito! `;
              await sendWhatsAppMessage(fromPhone, dayMsg, WA_TOKEN);
              await addToHistory(
                fromPhone,
                "assistant",
                dayMsg,
                `balatin-returning-day-${Date.now()}`,
              );

              // Notify admin (cajera) about new order - single template with URL button
              const verifyLink = `${SITE_URL}/verificar-stock?code=${orderCode}`;
              try {
                const { sendWhatsAppTemplate } = await import("@/lib/whatsapp");
                await recordKeniaUsage(STOCK_VERIFIER_PHONE, {
                  pendingOrderId: orderId,
                });
                const components = [
                  {
                    type: "body",
                    parameters: [
                      { type: "text", text: String(orderCode) },
                      { type: "text", text: existingCustomerName },
                    ],
                  },
                  {
                    type: "button",
                    sub_type: "url",
                    index: 0,
                    parameters: [{ type: "text", text: String(orderCode) }],
                  },
                ];
                await sendWhatsAppTemplate(
                  STOCK_VERIFIER_PHONE,
                  "confirmar_stock_balatin",
                  "es_CL",
                  components,
                  WA_TOKEN,
                );
              } catch (tplErr) {
                console.error(
                  "[Balatin Catalog Flow] Error sending template to admin:",
                  tplErr,
                );
                const adminMsg = ` *PEDIDO NUEVO* #${orderCode}\n\nCliente: ${existingCustomerName}\nTeléfono: +${cleanedFrom}\n\n *Confirma el stock aquí:*\n${verifyLink}`;
                await sendWhatsAppMessage(
                  STOCK_VERIFIER_PHONE,
                  adminMsg,
                  WA_TOKEN,
                );
              }

              return NextResponse.json({
                status: "balatin_catalog_returning_day",
              });
            }
          }

          // New customer — ask for name
          // Mark this user as a Balatin catalog customer in usage
          await recordKeniaUsage(fromPhone, {
            isGuestWithOrders: true,
            isRegistered: false,
            balatinOrderFlow: true,
            balatinOrderId: orderId,
            balatinOrderCode: orderCode,
            balatinStep: night ? "awaiting_name_night" : "awaiting_name_day",
          });

          await markAsRead(msgId, WA_TOKEN);
          await addToHistory(fromPhone, "user", userText, msgId);

          if (night) {
            // Night flow (6pm-9am): no stock verification, go straight to data
            const nightMsg = `¡Hola! Soy Balatin, el gato de la suerte de Don Balato Iván.\n\n¡Ya tomé tu pedido *${orderCode}*! Para ir adelantando, ¿me das tu *nombre completo* por favor?`;
            await sendWhatsAppMessage(fromPhone, nightMsg, WA_TOKEN);
            await addToHistory(
              fromPhone,
              "assistant",
              nightMsg,
              `balatin-night-${Date.now()}`,
            );
            return NextResponse.json({ status: "balatin_catalog_night" });
          } else {
            // Day flow (9am-6pm): verify stock, ask for name while waiting
            const dayMsg = `¡Hola! Soy Balatin, el gato de la suerte de Don Balato Iván.\n\n¡Ya tomé tu pedido *${orderCode}*! Ahora mismo estamos verificando el stock de tus productos.\n\nMientras tanto, ¿me darías tu *nombre completo* por favor?`;
            await sendWhatsAppMessage(fromPhone, dayMsg, WA_TOKEN);
            await addToHistory(
              fromPhone,
              "assistant",
              dayMsg,
              `balatin-day-${Date.now()}`,
            );

            // Notify admin (cajera) about new order - single template with URL button
            const verifyLink = `${SITE_URL}/verificar-stock?code=${orderCode}`;
            try {
              const { sendWhatsAppTemplate } = await import("@/lib/whatsapp");
              const { recordKeniaUsage } = await import("@/lib/kenia-runtime");

              // Store the pending order ID for the cajera so when she clicks CONFIRMAR STOCK we know which order
              await recordKeniaUsage(STOCK_VERIFIER_PHONE, {
                pendingOrderId: orderId,
              });

              const components = [
                {
                  type: "body",
                  parameters: [
                    { type: "text", text: String(orderCode) },
                    { type: "text", text: "(pendiente de nombre)" },
                  ],
                },
                {
                  type: "button",
                  sub_type: "url",
                  index: 0,
                  parameters: [{ type: "text", text: String(orderCode) }],
                },
              ];

              await sendWhatsAppTemplate(
                STOCK_VERIFIER_PHONE,
                "confirmar_stock_balatin",
                "es_CL",
                components,
                WA_TOKEN,
              );
            } catch (tplErr) {
              console.error(
                "[Balatin Catalog Flow] Error sending template to admin:",
                tplErr,
              );
              // Fallback: plain text
              const adminMsg = ` *PEDIDO NUEVO* #${orderCode}\n\nCliente: (pendiente de nombre)\nTeléfono: +${cleanedFrom}\n\n *Confirma el stock aquí:*\n${verifyLink}`;
              await sendWhatsAppMessage(
                STOCK_VERIFIER_PHONE,
                adminMsg,
                WA_TOKEN,
              );
            }

            return NextResponse.json({ status: "balatin_catalog_day" });
          }
        } else {
          console.warn(
            `[Balatin Catalog Flow] Order ${orderCode} not found in DB`,
          );
        }
      } catch (e) {
        console.error("[Balatin Catalog Flow] Error:", e);
      }
    }

    // ── BALATIN NAME COLLECTION (no AI) ─────────────────────────────────────────
    // If user is in Balatin flow and we're waiting for their name
    if (
      usage.balatinOrderFlow === true &&
      usage.balatinStep &&
      usage.balatinStep.startsWith("awaiting_name")
    ) {
      const orderId = usage.balatinOrderId;
      const orderCode = usage.balatinOrderCode;
      const name = userText.trim();

      if (
        name.length >= 2 &&
        name.length <= 80 &&
        !/^(finalizar|termin[eé]|modo|admin|cliente|hola|balatin)/i.test(name)
      ) {
        try {
          const { serverUpdateDocument } =
            await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const { isNightNow } = await import("@/lib/night-mode");

          // Save name to order
          await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId!, {
            CUSTOMERNAME: name,
          });

          // Get order total for the payment message
          let orderTotal = 0;
          try {
            const { serverGetDocument } = await import("@/lib/appwrite-server");
            const orderDoc: any = await serverGetDocument(
              ORDERS_COLLECTION_ID,
              orderId!,
            );
            orderTotal = Number(orderDoc?.TOTAL || orderDoc?.SUBTOTAL || 0);
          } catch (e) {
            console.warn(
              "[Balatin Catalog Flow] Could not fetch order total:",
              e,
            );
          }

          await markAsRead(msgId, WA_TOKEN);
          await addToHistory(fromPhone, "user", userText, msgId);

          const night = isNightNow();
          if (night) {
            // Night: go to payment first, then data
            await recordKeniaUsage(fromPhone, {
              customerName: name,
              balatinStep: "awaiting_payment",
              balatinComprobanteReceived: false,
            });

            const payMsg = `¡Gracias, ${name}! \n\nPara continuar con tu pedido, haz la transferencia:\n\n *Datos para la transferencia:*\nTitular: DON BALATO IVAN\nRUT: 78.267.426-9\nBanco: Mercado Pago (Cuenta Vista)\nCuenta: 1037879898\nEmail: donbalatosoporte@gmail.com\n\nMonto total: $${orderTotal.toLocaleString("es-CL")}\n\nCuando transfieras, mándame la *foto del comprobante* por aquí. `;
            await sendWhatsAppMessage(fromPhone, payMsg, WA_TOKEN);
            await addToHistory(
              fromPhone,
              "assistant",
              payMsg,
              `balatin-pay-${Date.now()}`,
            );

            return NextResponse.json({ status: "balatin_name_saved_night" });
          } else {
            // Day: name saved, waiting for stock confirmation
            await recordKeniaUsage(fromPhone, {
              customerName: name,
              balatinStep: "awaiting_stock_confirmation",
            });

            const waitMsg = `¡Gracias, ${name}! \n\nYa anoté tu nombre. Estamos verificando el stock de tu pedido, en cuanto la cajera lo confirme te aviso altiro para seguir. ¡Un momentito! `;
            await sendWhatsAppMessage(fromPhone, waitMsg, WA_TOKEN);
            await addToHistory(
              fromPhone,
              "assistant",
              waitMsg,
              `balatin-wait-${Date.now()}`,
            );

            return NextResponse.json({ status: "balatin_name_saved_day" });
          }
        } catch (e) {
          console.error("[Balatin Catalog Flow] Error saving name:", e);
        }
      }
    }

    // ── BALATIN PAYMENT STEP (waiting for comprobante image) ────────────────────
    if (
      usage.balatinOrderFlow === true &&
      usage.balatinStep === "awaiting_payment"
    ) {
      const customerName = usage.customerName || "";

      // If it's an image, let the image handler below process it (it will save comprobante and move to awaiting_data)
      if (msgType === "image") {
        // Fall through to image handler
      } else {
        // Not an image — remind the client to send the comprobante photo
        const remindMsg = `¡Perfecto, ${customerName}! \n\nCuando termines la transferencia, mándame la *foto del comprobante* por aquí. `;
        await sendWhatsAppMessage(fromPhone, remindMsg, WA_TOKEN);
        await addToHistory(fromPhone, "user", userText, msgId);
        await addToHistory(
          fromPhone,
          "assistant",
          remindMsg,
          `balatin-remind-${Date.now()}`,
        );
        await markAsRead(msgId, WA_TOKEN);
        return NextResponse.json({ status: "balatin_payment_remind" });
      }
    }

    // ── BALATIN DATA CONFIRM (returning customer confirms or changes previous data) ──
    if (
      usage.balatinOrderFlow === true &&
      usage.balatinStep === "awaiting_data_confirm"
    ) {
      const orderId = usage.balatinOrderId;
      const orderCode = usage.balatinOrderCode;
      const customerName = usage.customerName || "";
      const wantsConfirm =
        /\b(correcto|correcta|ok|si|s[ií]|est[aá] bien|perfecto|los mismos|igual)\b/i.test(
          userText.trim().toLowerCase(),
        );

      if (wantsConfirm && userText.trim().length <= 25) {
        // Confirm — check all data is present
        try {
          const { serverGetDocument } = await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const orderDoc: any = await serverGetDocument(
            ORDERS_COLLECTION_ID,
            orderId!,
          );

          const missingFields: string[] = [];
          if (!orderDoc?.CUSTOMERRUT) missingFields.push("RUT");
          if (!orderDoc?.ADDRESS) missingFields.push("dirección");
          if (!orderDoc?.COMUNA) missingFields.push("comuna");
          if (!orderDoc?.REGION) missingFields.push("región");
          if (!orderDoc?.SHIPPINGAGENCY) missingFields.push("agencia de envío");
          // Email is optional — not required

          if (missingFields.length > 0) {
            // Some data missing — go to normal data collection, clear buffer
            await recordKeniaUsage(fromPhone, {
              balatinStep: "awaiting_data",
              balatinDataBuffer: "",
            });
            const missingMsg = `¡Casi! Me faltan algunos datos:\n\n${missingFields.map((f) => `• ${f}`).join("\n")}\n\nMándamelos y escribe *TERMINÉ*. `;
            await sendWhatsAppMessage(fromPhone, missingMsg, WA_TOKEN);
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(
              fromPhone,
              "assistant",
              missingMsg,
              `balatin-missing-${Date.now()}`,
            );
            await markAsRead(msgId, WA_TOKEN);
            return NextResponse.json({ status: "balatin_missing_data" });
          } else {
            // All data present — done!
            const doneMsg = `¡Perfecto, ${customerName}! \n\nTu pedido *${orderCode}* está listo:\n Comprobante recibido\n Datos de envío guardados\n\nNuestro equipo va a revisar tu pago. Cuando esté confirmado, te avisaré por aquí.\n\nTe mantendré informado en cada paso:\n Pago confirmado\n Pedido armado/embalado\n Entregado a la agencia (con foto y código de seguimiento)\n\nCualquier consulta sobre tu pedido, escríbeme por aquí nomás. ¡Gracias por confiar en este gatito! `;
            await sendWhatsAppMessage(fromPhone, doneMsg, WA_TOKEN);
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(
              fromPhone,
              "assistant",
              doneMsg,
              `balatin-done-${Date.now()}`,
            );
            await recordKeniaUsage(fromPhone, {
              balatinStep: "completed",
              balatinDataBuffer: "",
            });
            await markAsRead(msgId, WA_TOKEN);
            return NextResponse.json({ status: "balatin_completed" });
          }
        } catch (e) {
          console.error(
            "[Balatin Catalog Flow] Error checking data on confirm:",
            e,
          );
        }
      }

      // Not confirming — user wants to change something. Go to normal data collection.
      await recordKeniaUsage(fromPhone, {
        balatinStep: "awaiting_data",
        balatinDataBuffer: userText,
      });
      const changeMsg = `¡Entendido! Dime qué datos quieres cambiar. Puedes mandarlos todos juntos o uno por uno.\n\nCuando termines, escribe *TERMINÉ*.`;
      await sendWhatsAppMessage(fromPhone, changeMsg, WA_TOKEN);
      await addToHistory(fromPhone, "user", userText, msgId);
      await addToHistory(
        fromPhone,
        "assistant",
        changeMsg,
        `balatin-change-${Date.now()}`,
      );
      await markAsRead(msgId, WA_TOKEN);
      return NextResponse.json({ status: "balatin_data_change" });
    }

    // ── BALATIN DATA COLLECTION (accumulate without AI, parse on "terminé") ────
    if (
      usage.balatinOrderFlow === true &&
      usage.balatinStep === "awaiting_data"
    ) {
      const orderId = usage.balatinOrderId;
      const orderCode = usage.balatinOrderCode;
      const customerName = usage.customerName || "";

      // Check if user wrote "correcto" to confirm their data
      // Nota: \b no funciona con acentos en JS, usamos (^|[^a-z]) en vez de \b
      const wantsConfirm =
        /(?:^|[^a-z])(correcto|correcta|ok|si|s[ií]|est[aá] bien|perfecto)(?:[^a-z]|$)/i.test(
          userText.trim().toLowerCase(),
        );

      // Check if user wrote "terminé/acabé/finalizar" to trigger AI parsing
      // Nota: \b no funciona con acentos en JS, usamos (^|[^a-z]) en vez de \b
      const wantsParse =
        /(?:^|[^a-z])(termin[eé]|acab[eé]|finalizar|listo|ya)(?:[^a-z]|$)/i.test(
          userText.trim().toLowerCase(),
        );

      if (wantsConfirm && userText.trim().length <= 20) {
        // User is confirming their data — check if all required data is present
        try {
          const { serverGetDocument } = await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const orderDoc: any = await serverGetDocument(
            ORDERS_COLLECTION_ID,
            orderId!,
          );

          const missingFields: string[] = [];
          if (!orderDoc?.CUSTOMERRUT) missingFields.push("RUT");
          if (!orderDoc?.ADDRESS) missingFields.push("dirección");
          if (!orderDoc?.COMUNA) missingFields.push("comuna");
          if (!orderDoc?.REGION) missingFields.push("región");
          if (!orderDoc?.SHIPPINGAGENCY) missingFields.push("agencia de envío");
          // Email is optional — not required

          if (missingFields.length > 0) {
            await recordKeniaUsage(fromPhone, { balatinDataBuffer: "" });
            const missingMsg = `¡Casi! Me faltan algunos datos aún:\n\n${missingFields.map((f) => `• ${f}`).join("\n")}\n\nMándamelos y escribe *TERMINÉ*. `;
            await sendWhatsAppMessage(fromPhone, missingMsg, WA_TOKEN);
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(
              fromPhone,
              "assistant",
              missingMsg,
              `balatin-missing-${Date.now()}`,
            );
            await markAsRead(msgId, WA_TOKEN);
            return NextResponse.json({ status: "balatin_missing_data" });
          } else {
            // Everything complete!
            const doneMsg = `¡Perfecto, ${customerName}! \n\nTu pedido *${orderCode}* está listo:\n Comprobante recibido\n Datos de envío guardados\n\nNuestro equipo va a revisar tu pago. Cuando esté confirmado, te avisaré por aquí.\n\nTe mantendré informado en cada paso:\n Pago confirmado\n Pedido armado/embalado\n Entregado a la agencia (con foto y código de seguimiento)\n\nCualquier consulta sobre tu pedido, escríbeme por aquí nomás. ¡Gracias por confiar en este gatito! `;
            await sendWhatsAppMessage(fromPhone, doneMsg, WA_TOKEN);
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(
              fromPhone,
              "assistant",
              doneMsg,
              `balatin-done-${Date.now()}`,
            );
            await recordKeniaUsage(fromPhone, {
              balatinStep: "completed",
              balatinDataBuffer: "",
            });
            await markAsRead(msgId, WA_TOKEN);
            return NextResponse.json({ status: "balatin_completed" });
          }
        } catch (e) {
          console.error(
            "[Balatin Catalog Flow] Error checking data on confirm:",
            e,
          );
        }
      }

      if (wantsParse) {
        // Parse shipping data locally (no AI needed — saves tokens + more reliable)
        const accumulatedData = (
          (usage.balatinDataBuffer || "") +
          "\n" +
          userText
        ).trim();

          // ── Parser inteligente de datos de envío ──
          const parsed = parseShippingData(accumulatedData);
          const customerRut = parsed.rut;
          let shippingAgency = parsed.agency;
          const customerEmail = parsed.email;
          let comuna = parsed.comuna;
          let region = parsed.region;
          let address = parsed.address;

        // Save to order
        try {
          const { serverGetDocument, serverUpdateDocument } =
            await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const orderDoc: any = await serverGetDocument(
            ORDERS_COLLECTION_ID,
            orderId!,
          );

          const updates: Record<string, any> = {};
          if (customerRut) updates.CUSTOMERRUT = customerRut;
          if (address) updates.ADDRESS = address;
          if (comuna) updates.COMUNA = comuna;
          if (region) updates.REGION = region;
          if (shippingAgency) updates.SHIPPINGAGENCY = shippingAgency;
          if (customerEmail) updates.CUSTOMEREMAIL = customerEmail;

          if (Object.keys(updates).length > 0) {
            await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId!, updates);
            console.log(
              "[Balatin Data Parse] Saved shipping data locally:",
              updates,
            );
          }

          // Check what's still missing
          const missingFields: string[] = [];
          if (!customerRut && !orderDoc?.CUSTOMERRUT) missingFields.push("RUT");
          if (!address && !orderDoc?.ADDRESS) missingFields.push("dirección");
          if (!comuna && !orderDoc?.COMUNA) missingFields.push("comuna");
          if (!region && !orderDoc?.REGION) missingFields.push("región");
          if (!shippingAgency && !orderDoc?.SHIPPINGAGENCY)
            missingFields.push("agencia de envío");

          await addToHistory(fromPhone, "user", userText, msgId);

          if (missingFields.length > 0) {
            const missingMsg = `¡Casi! No pude identificar algunos datos:\n\n${missingFields.map((f) => `• ${f}`).join("\n")}\n\nMándamelos por favor. `;
            await sendWhatsAppMessage(fromPhone, missingMsg, WA_TOKEN);
            await addToHistory(
              fromPhone,
              "assistant",
              missingMsg,
              `balatin-missing-${Date.now()}`,
            );
          } else {
            // Show summary and ask for confirmation
            const fmtRut = customerRut || orderDoc?.CUSTOMERRUT || "";
            const fmtAddr = address || orderDoc?.ADDRESS || "";
            const fmtComuna = comuna || orderDoc?.COMUNA || "";
            const fmtRegion = region || orderDoc?.REGION || "";
            const fmtAgency = shippingAgency || orderDoc?.SHIPPINGAGENCY || "";

            const summaryMsg = `¡Excelente, ${customerName}! He recibido tus datos de envío.\n\nAquí tienes un resumen de la información que me entregaste para tu pedido ${orderCode}:\n\n• *RUT:* ${fmtRut}\n• *Nombre completo:* ${customerName}\n• *Dirección:* ${fmtAddr}\n• *Comuna:* ${fmtComuna}\n• *Región:* ${fmtRegion}\n• *Agencia de envío:* ${fmtAgency}\n\n¿Estos datos están correctos, ${customerName}? Responde *CORRECTO* para confirmar.`;
            await sendWhatsAppMessage(fromPhone, summaryMsg, WA_TOKEN);
            await addToHistory(
              fromPhone,
              "assistant",
              summaryMsg,
              `balatin-summary-${Date.now()}`,
            );
          }

          await recordKeniaUsage(fromPhone, { balatinDataBuffer: "" });
          await markAsRead(msgId, WA_TOKEN);
          return NextResponse.json({ status: "balatin_data_parsed_locally" });
        } catch (e) {
          console.error(
            "[Balatin Data Parse] Error saving shipping data locally:",
            e,
          );
          // Fall through to AI as fallback
          (usage as any)._balatinDataMode = true;
          (usage as any)._balatinOrderId = orderId;
          (usage as any)._balatinOrderCode = orderCode;
          (usage as any)._balatinAccumulatedData = accumulatedData;
          await recordKeniaUsage(fromPhone, { balatinDataBuffer: "" });
        }
      } else {
        // Not "terminé" — accumulate the data without calling AI (save API tokens)
        // Ignorar mensajes automaticos de WhatsApp (respuesta fuera de horario)
        const isAutoReply =
          /gracias por tu mensaje.*no podemos responder/i.test(userText);
        if (isAutoReply) {
          await markAsRead(msgId, WA_TOKEN);
          return NextResponse.json({ status: "balatin_auto_reply_ignored" });
        }

        const currentBuffer = usage.balatinDataBuffer || "";
        const newBuffer = currentBuffer
          ? currentBuffer + "\n" + userText
          : userText;
        await recordKeniaUsage(fromPhone, { balatinDataBuffer: newBuffer });

        // Auto-parse: si el buffer acumulado ya tiene suficientes datos (RUT +
        // direccion o comuna + region), intentar parsear sin esperar TERMINÉ.
        // Esto resuelve el caso donde el cliente manda todo junto pero no
        // escribe "terminé".
        const lowerBuf = newBuffer.toLowerCase();
        const hasRut = /\b(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])\b/.test(newBuffer);
        const hasAddress = /\b(calle|direccion|direcci[oó]n|avenida|av\.?|pasaje|depto|departamento|n°|numero|n[uú]mero)\b/i.test(newBuffer) || /\b\w+\s+\d+\b/.test(newBuffer);
        const hasComuna = /\b(comuna|ciudad)\b/i.test(newBuffer) || /\b(santiago|la serena|coquimbo|valpara[íi]so|vi[ñn]a|concepci[oó]n|puente alto|maip[uú]|providencia|las condes|florida|melipilla|talca|rancagua)\b/i.test(lowerBuf);
        const hasRegion = /\b(regi[oó]n|metropolitana|valpara[íi]so|biob[íi]o|araucan[íi]a|o ?higgins|maule|[ñn]uble|los lagos|ays[eé]n|magallanes|antofagasta|atacama|coquimbo|tarapac[aá]|arica|los r[íi]os)\b/i.test(lowerBuf);
        const hasAgency = /\b(starken|pullman|varmontt|bluexpress|blu express|cyc|tvp|cruz del sur|tramar|5 ?sur|mena|cacem|jt transportes|retiro)\b/i.test(lowerBuf);
        const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(newBuffer);

        // Si tiene al menos 3 datos clave, intentar parsear automaticamente
        const dataScore = [hasRut, hasAddress, hasComuna, hasRegion, hasAgency, hasEmail].filter(Boolean).length;
        if (dataScore >= 3) {
          // Simular que el cliente escribio TERMINÉ para disparar el parser
          const fakeTerminéText = newBuffer + "\nTERMINÉ";
          // Re-ejecutar la logica de parseo reutilizando el codigo de wantsParse
          // Para no duplicar codigo, seteamos el buffer y llamamos recursivamente
          // con el texto "TERMINÉ"
          await recordKeniaUsage(fromPhone, { balatinDataBuffer: "" });

          // Parsear directamente (mismo codigo de wantsParse arriba)
          const accumulatedData = fakeTerminéText;
          const parsed = parseShippingData(accumulatedData);
          const customerRut = parsed.rut;
          let shippingAgency = parsed.agency;
          const customerEmail = parsed.email;
          let comuna = parsed.comuna;
          let region = parsed.region;
          let address = parsed.address;

          try {
            const { serverGetDocument, serverUpdateDocument } = await import("@/lib/appwrite-server");
            const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
            const orderDoc: any = await serverGetDocument(ORDERS_COLLECTION_ID, orderId!);

            const updates: Record<string, any> = {};
            if (customerRut) updates.CUSTOMERRUT = customerRut;
            if (address) updates.ADDRESS = address;
            if (comuna) updates.COMUNA = comuna;
            if (region) updates.REGION = region;
            if (shippingAgency) updates.SHIPPINGAGENCY = shippingAgency;
            if (customerEmail) updates.CUSTOMEREMAIL = customerEmail;

            if (Object.keys(updates).length > 0) {
              await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId!, updates);
            }

            const missingFields: string[] = [];
            if (!customerRut && !orderDoc?.CUSTOMERRUT) missingFields.push("RUT");
            if (!address && !orderDoc?.ADDRESS) missingFields.push("direccion");
            if (!comuna && !orderDoc?.COMUNA) missingFields.push("comuna");
            if (!region && !orderDoc?.REGION) missingFields.push("region");
            if (!shippingAgency && !orderDoc?.SHIPPINGAGENCY) missingFields.push("agencia de envio");

            await addToHistory(fromPhone, "user", userText, msgId);

            if (missingFields.length > 0) {
              const missingMsg = `¡Casi! No pude identificar algunos datos:\n\n${missingFields.map((f) => `• ${f}`).join("\n")}\n\nMandamelos por favor.`;
              await sendWhatsAppMessage(fromPhone, missingMsg, WA_TOKEN);
              await addToHistory(fromPhone, "assistant", missingMsg, `balatin-missing-${Date.now()}`);
            } else {
              const fmtRut = customerRut || orderDoc?.CUSTOMERRUT || "";
              const fmtAddr = address || orderDoc?.ADDRESS || "";
              const fmtComuna = comuna || orderDoc?.COMUNA || "";
              const fmtRegion = region || orderDoc?.REGION || "";
              const fmtAgency = shippingAgency || orderDoc?.SHIPPINGAGENCY || "";

              const summaryMsg = `¡Excelente, ${customerName}! He recibido tus datos de envio.\n\nAqui tienes un resumen para tu pedido ${orderCode}:\n\n• *RUT:* ${fmtRut}\n• *Nombre completo:* ${customerName}\n• *Direccion:* ${fmtAddr}\n• *Comuna:* ${fmtComuna}\n• *Region:* ${fmtRegion}\n• *Agencia de envio:* ${fmtAgency}\n\n¿Estos datos estan correctos, ${customerName}? Responde *CORRECTO* para confirmar.`;
              await sendWhatsAppMessage(fromPhone, summaryMsg, WA_TOKEN);
              await addToHistory(fromPhone, "assistant", summaryMsg, `balatin-summary-${Date.now()}`);
            }

            await markAsRead(msgId, WA_TOKEN);
            return NextResponse.json({ status: "balatin_data_auto_parsed" });
          } catch (e) {
            console.error("[Balatin Auto-Parse] Error:", e);
            // Fall through to normal ack
          }
        }

        // Brief programmed acknowledgment (no AI)
        const ackMsg = `¡Anotado! Sigue mandándome tus datos. Cuando termines, escribe *TERMINÉ*.`;
        await sendWhatsAppMessage(fromPhone, ackMsg, WA_TOKEN);
        await addToHistory(fromPhone, "user", userText, msgId);
        await addToHistory(
          fromPhone,
          "assistant",
          ackMsg,
          `balatin-ack-${Date.now()}`,
        );
        await markAsRead(msgId, WA_TOKEN);
        return NextResponse.json({ status: "balatin_data_buffered" });
      }
    }

    // ── Deep Linking / Auto-Linking Interceptors ──
    const userTextLower = userText.toLowerCase().trim();

    // Auto-link catalog orders: detect WA-XXXX code in message (legacy fallback)
    // Note: The main Balatin catalog flow is handled above.
    // This is a fallback for messages that contain a WA- code but weren't caught by the Balatin flow
    const catMatch = userText.match(/WA-\d{6,8}/i);
    if (catMatch && !usage.balatinOrderFlow) {
      try {
        const { serverListDocuments, serverUpdateDocument } =
          await import("@/lib/appwrite-server");
        const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
        const qEqual = JSON.stringify({
          method: "equal",
          attribute: "ORDERCODE",
          values: [catMatch[0]],
        });
        const qLimit1 = JSON.stringify({ method: "limit", values: [1] });
        const res = await serverListDocuments(ORDERS_COLLECTION_ID, [
          qEqual,
          qLimit1,
        ]);
        if (res.documents && res.documents.length > 0) {
          const order = res.documents[0] as any;
          const currentPhone = String(order.CUSTOMERPHONE || "");
          const cleanCurrent = currentPhone.replace(/\D/g, "");
          if (cleanCurrent !== cleanedFrom) {
            await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
              CUSTOMERPHONE: `+${cleanedFrom}`,
            });
          }
          await markAsRead(msgId, WA_TOKEN);

          // Respect night mode: don't say "verificando" at night
          const { isNightNow } = await import("@/lib/night-mode");
          const night = isNightNow();
          const replyMsg = night
            ? `¡Hola! 🐾 Recibí tu pedido *${catMatch[0]}*. Ya registré tu número. Como estamos fuera de horario de atención, lo dejamos listo para verificar a primera hora. ¿Me das tu *nombre completo* por favor?`
            : `¡Hola! 🐾 Recibí tu pedido *${catMatch[0]}*. Ya registré tu número de WhatsApp. Estamos verificando la disponibilidad de los productos y te avisamos muy pronto. ✨`;
          await sendWhatsAppMessage(fromPhone, replyMsg, WA_TOKEN);
          await addToHistory(fromPhone, "user", userText, msgId);
          await addToHistory(
            fromPhone,
            "assistant",
            replyMsg,
            `cat-link-${Date.now()}`,
          );
          return NextResponse.json({ status: "catalog_order_linked" });
        }
      } catch (e) {
        console.error("[WhatsApp Webhook] Error linking CAT order:", e);
      }
    }

    if (userTextLower.startsWith("vincular_pedido ")) {
      const orderId = userText.substring("vincular_pedido ".length).trim();
      if (orderId) {
        try {
          const { serverUpdateDocument, serverGetDocument } =
            await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const order = await serverGetDocument(ORDERS_COLLECTION_ID, orderId);
          if (order) {
            const currentPhone = String(order.CUSTOMERPHONE || "");
            const cleanCurrent = currentPhone.replace(/\D/g, "");
            if (cleanCurrent !== cleanedFrom) {
              await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
                CUSTOMERPHONE: `+${cleanedFrom}`,
              });
            }
            await markAsRead(msgId, WA_TOKEN);
            await clearHistory(fromPhone);
            await resetKeniaUsage(fromPhone);
            await setKeniaBlocked(fromPhone, false);

            const replyMsg = `¡Listo! Ya corregí tu número y vinculé tu WhatsApp a tu pedido *#${order.ORDERCODE || orderId}*. Ahora sí estamos conectados y te aviso de cualquier novedad de tu compra. `;
            await sendWhatsAppMessage(fromPhone, replyMsg, WA_TOKEN);
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(
              fromPhone,
              "assistant",
              replyMsg,
              `link-order-${Date.now()}`,
            );
            return NextResponse.json({ status: "order_linked" });
          }
        } catch (e) {
          console.error("[WhatsApp Webhook] Error vincular_pedido:", e);
        }
      }
    }

    if (userTextLower.startsWith("vincular_cuenta ")) {
      const userId = userText.substring("vincular_cuenta ".length).trim();
      if (userId) {
        try {
          const { serverUpdateDocument, serverGetDocument } =
            await import("@/lib/appwrite-server");
          const { USERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const userDoc = await serverGetDocument(USERS_COLLECTION_ID, userId);
          if (userDoc) {
            const currentPhone = String(userDoc.phone || "");
            const cleanCurrent = currentPhone.replace(/\D/g, "");
            if (cleanCurrent !== cleanedFrom) {
              await serverUpdateDocument(USERS_COLLECTION_ID, userId, {
                phone: `+${cleanedFrom}`,
              });
            }
            await markAsRead(msgId, WA_TOKEN);
            await clearHistory(fromPhone);
            await resetKeniaUsage(fromPhone);
            await setKeniaBlocked(fromPhone, false);

            const replyMsg = `¡Listo${userDoc.name ? ` ${userDoc.name}` : ""}! Ya corregí tu número y vinculé tu WhatsApp a tu cuenta. Ahora sí estamos conectados y te ayudo con lo que necesites. `;
            await sendWhatsAppMessage(fromPhone, replyMsg, WA_TOKEN);
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(
              fromPhone,
              "assistant",
              replyMsg,
              `link-account-${Date.now()}`,
            );
            return NextResponse.json({ status: "account_linked" });
          }
        } catch (e) {
          console.error("[WhatsApp Webhook] Error vincular_cuenta:", e);
        }
      }
    }

    // Intercept interactive options before AI
    if (!isAdmin && interactiveId) {
      let interceptReply = "";
      if (interactiveId === "func_pedido") {
        interceptReply =
          " *¡Tu pedido!*\n\nNo te estreses, yo te aviso de todo automáticamente:\n *Pago*: Cuando el equipo valide tu pago.\n *Armado*: Cuando estemos juntando tus productos.\n *Stock*: Si falta algo te aviso al tiro.\n *Despacho*: Cuando salga hacia tu dirección \n\nSi quieres saber de un pedido específico AHORA, solo dímelo y lo busco. ";
      } else if (interactiveId === "func_comprobante") {
        interceptReply =
          "🧾 *Tus comprobantes*\n\n¡Súper fácil! Entra a tu pedido en la web y sube la fotito del comprobante ahí. Yo lo veo al instante y te aviso por aquí apenas finanzas lo valide. ¡Cero estrés! ";
      } else if (interactiveId === "func_ofertas") {
        interceptReply =
          " *¡Ofertas y Remates!*\n\nPrepárate. Cuando tengamos productos a precio de regalo o descuentazos, serás de los primeros en saberlo por aquí. ¡Este gato te trae buena suerte! ";
      } else if (interactiveId === "func_negociacion") {
        interceptReply =
          " *¿Falta algo? ¡Ni te estreses!*\n\nSi justo se nos agotó algún producto de tu pedido, te voy a escribir rapidito para mostrarte otras opciones y que elijas. ¡Te prometo que no te quedas sin tu compra! ";
      } else if (interactiveId === "func_humano") {
        const MAIN_ADMIN_PHONE = (
          keniaConfig.adminAlertPhone || "56992139185"
        ).replace(/\D/g, "");
        const alertMsg = `🚨 *ASISTENCIA REQUERIDA*\n\nEl cliente +${fromPhone} presionó el botón de "Hablar con persona".\n ${process.env.NEXT_PUBLIC_SITE_URL || "https://www.donbalatomayorista.cl"}/admin/ia/whatsapp`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, alertMsg, WA_TOKEN);

        await setKeniaBlocked(fromPhone, true, "admin_takeover");
        interceptReply =
          " *Hablar con una persona*\n\n¡Entendido! Acabo de notificar a alguien del equipo para que te atienda personalmente. Por favor dame un momentito mientras se conectan y te responden por aquí mismo. ";
      }

      if (interceptReply) {
        await sendWhatsAppMessage(fromPhone, interceptReply, WA_TOKEN);
        await addToHistory(fromPhone, "user", userText, msgId);
        await addToHistory(
          fromPhone,
          "assistant",
          interceptReply,
          `intercept-${Date.now()}`,
        );
        return NextResponse.json({ status: "interactive_intercepted" });
      }
    }

    // Intercept "Enviar comprobante" button from Meta templates
    if (
      !isAdmin &&
      msgType === "button" &&
      userText.toLowerCase().includes("comprobante")
    ) {
      try {
        const cleanedPhone = fromPhone.replace(/\D/g, "");
        const qOrderDesc = JSON.stringify({
          method: "orderDesc",
          attribute: "$createdAt",
        });
        const qLimit5 = JSON.stringify({ method: "limit", values: [10] });
        const qPhone = JSON.stringify({
          method: "contains",
          attribute: "CUSTOMERPHONE",
          values: [cleanedPhone, `+${cleanedPhone}`],
        });
        const resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [
          qOrderDesc,
          qPhone,
          qLimit5,
        ]);

        const myOrders = resOrders.documents || [];
        const pendingOrder = myOrders.find((o: any) => o.STATUS === "pending");

        if (pendingOrder) {
          const orderId = String(pendingOrder.$id);
          const link = `${SITE_URL}/pedido/${orderId}`;
          const interceptReply = `¡Perfecto! \n\nAquí tienes el link directo a tu pedido donde encontrarás los datos de transferencia y podrás subir el comprobante:\n ${link}\n\nO si prefieres, **puedes enviarme la foto del comprobante de transferencia directamente por aquí mismo** y yo lo adjunto a tu pedido. ¿Qué te parece más fácil? `;

          await recordKeniaUsage(fromPhone, {
            awaitingComprobante: true,
            pendingOrderId: orderId,
          });

          await sendWhatsAppMessage(fromPhone, interceptReply, WA_TOKEN);
          await addToHistory(fromPhone, "user", userText, msgId);
          await addToHistory(
            fromPhone,
            "assistant",
            interceptReply,
            `intercept-comp-${Date.now()}`,
          );
          return NextResponse.json({ status: "comprobante_link_sent" });
        } else {
          // No pending order found
          const interceptReply = `Mmm, busqué en mis registros pero no encontré un pedido pendiente de pago a tu nombre . Si ya lo pagaste o tienes dudas, dímelo y te ayudo. `;
          await sendWhatsAppMessage(fromPhone, interceptReply, WA_TOKEN);
          await addToHistory(fromPhone, "user", userText, msgId);
          await addToHistory(
            fromPhone,
            "assistant",
            interceptReply,
            `intercept-comp-${Date.now()}`,
          );
          return NextResponse.json({ status: "no_pending_order_found" });
        }
      } catch (e) {
        console.error("[WhatsApp] Failed to process comprobante button:", e);
      }
    }

    // Intercept Admin clicking "ENVIAR A REVISAR" template button
    if (
      isAdmin &&
      msgType === "button" &&
      userText.toUpperCase().includes("ENVIAR A REVISAR")
    ) {
      try {
        const adminUsage = await getKeniaUsage(fromPhone);
        const orderId = adminUsage.pendingOrderId;
        if (orderId) {
          const { serverGetDocument } = await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const orderDoc: any = await serverGetDocument(
            ORDERS_COLLECTION_ID,
            orderId,
          );
          const orderCode = orderDoc.ORDERCODE || orderId;
          const customerName = orderDoc.CUSTOMERNAME || "Cliente";
          const fileUrl = orderDoc.PAYMENTPROOFURL;

          if (fileUrl) {
            const WORKER_PHONE = "56935623858";
            const { sendWhatsAppTemplate } = await import("@/lib/whatsapp");
            const { recordKeniaUsage } = await import("@/lib/kenia-runtime");

            // Set the pendingOrderId for the worker so they can confirm it
            await recordKeniaUsage(WORKER_PHONE, { pendingOrderId: orderId });

            const components = [
              {
                type: "header",
                parameters: [
                  {
                    type: "image",
                    image: { link: fileUrl },
                  },
                ],
              },
              {
                type: "body",
                parameters: [
                  { type: "text", text: String(orderCode) },
                  { type: "text", text: String(customerName) },
                ],
              },
            ];

            await sendWhatsAppTemplate(
              WORKER_PHONE,
              "revision_pago_trabajadora",
              "es",
              components,
              WA_TOKEN,
            );

            const adminReply = `¡Listo! Se ha enviado el comprobante del pedido #${orderCode} a Ana (trabajadora) para su revisión. 👩‍💼💵`;
            await sendWhatsAppMessage(fromPhone, adminReply, WA_TOKEN);
            return NextResponse.json({ status: "sent_to_worker" });
          } else {
            await sendWhatsAppMessage(
              fromPhone,
              `El pedido #${orderCode} no tiene una imagen de comprobante adjunta. `,
              WA_TOKEN,
            );
            return NextResponse.json({ status: "no_proof_image" });
          }
        } else {
          await sendWhatsAppMessage(
            fromPhone,
            `No encontré ningún pedido pendiente de revisión reciente. `,
            WA_TOKEN,
          );
          return NextResponse.json({ status: "no_pending_order_id" });
        }
      } catch (e) {
        console.error("[WhatsApp] Failed to process Admin review button:", e);
      }
    }

    // Intercept Cajera clicking "CONFIRMAR STOCK" template button (alerta_pago_admin)
    if (
      cleanedFrom === STOCK_VERIFIER_PHONE &&
      msgType === "button" &&
      userText.toUpperCase().includes("CONFIRMAR STOCK")
    ) {
      try {
        const cajeraUsage = await getKeniaUsage(fromPhone);
        const orderId = cajeraUsage.pendingOrderId;
        if (orderId) {
          const { serverGetDocument, serverUpdateDocument } =
            await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const orderDoc: any = await serverGetDocument(
            ORDERS_COLLECTION_ID,
            orderId,
          );
          const orderCode = orderDoc.ORDERCODE || orderId;
          const customerPhone = String(orderDoc.CUSTOMERPHONE || "").replace(
            /\D/g,
            "",
          );
          const customerFirstName =
            String(orderDoc.CUSTOMERNAME || "").split(" ")[0] || "amigo";

          // Mark stock as confirmed — solo si el pedido no ha avanzado mas alla de 'paid'
          const currentStatus = orderDoc.STATUS;
          const ADVANCED_STATUSES = ['payment_confirmed', 'processing', 'shipped', 'checklist', 'delivered'];
          if (!ADVANCED_STATUSES.includes(currentStatus)) {
            await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
              STATUS: "paid",
              UPDATEDAT: Date.now(),
            });
          }

          // Update customer's Balatin flow step to awaiting_payment (payment first, then data)
          if (customerPhone) {
            await recordKeniaUsage(`+${customerPhone}`, {
              balatinStep: "awaiting_payment",
              balatinComprobanteReceived: false,
            });
          }

          const orderTotal = Number(orderDoc.TOTAL || orderDoc.SUBTOTAL || 0);
          let customerMsg = `¡Hola ${customerFirstName}! ¡Buenas noticias! Confirmamos el stock de tu pedido *#${orderCode}*. Todo está disponible. \n\n`;
          customerMsg += `Para continuar, haz la transferencia:\n\n *Datos para la transferencia:*\nTitular: DON BALATO IVAN\nRUT: 78.267.426-9\nBanco: Mercado Pago (Cuenta Vista)\nCuenta: 1037879898\nEmail: donbalatosoporte@gmail.com\n\nMonto total: $${orderTotal.toLocaleString("es-CL")}\n\nCuando transfieras, mándame la *foto del comprobante* por aquí. `;

          if (customerPhone) {
            await sendWhatsAppMessage(customerPhone, customerMsg, WA_TOKEN);
            await addToHistory(
              `+${customerPhone}`,
              "assistant",
              customerMsg,
              `stockok-${Date.now()}`,
            );
          }
          await sendWhatsAppMessage(
            fromPhone,
            ` Stock confirmado para el pedido #${orderCode}. Ya le avisé al cliente.`,
            WA_TOKEN,
          );
          return NextResponse.json({ status: "stock_confirmed_via_template" });
        } else {
          await sendWhatsAppMessage(
            fromPhone,
            `No encontré ningún pedido pendiente de confirmación. `,
            WA_TOKEN,
          );
          return NextResponse.json({ status: "no_pending_order_for_stock" });
        }
      } catch (e) {
        console.error(
          "[WhatsApp] Failed to process CONFIRMAR STOCK button:",
          e,
        );
      }
    }

    // Intercept Worker clicking "CONFIRMAR PAGO" or "PAGO CONFIRMADO" template button
    const isWorker = cleanedFrom === "56935623858";
    const isConfirmPayment =
      msgType === "button" &&
      (userText.toUpperCase().includes("CONFIRMAR") ||
        userText.toUpperCase().includes("CONFIRMADO") ||
        userText.toUpperCase().includes("REVISADO"));
    if (isWorker && isConfirmPayment) {
      try {
        const workerUsage = await getKeniaUsage(fromPhone);
        const orderId = workerUsage.pendingOrderId;
        if (orderId) {
          const { serverUpdateDocument, serverGetDocument } =
            await import("@/lib/appwrite-server");
          const { ORDERS_COLLECTION_ID } = await import("@/lib/appwrite-admin");
          const { getAdminAlertPhone } = await import("@/lib/notify-admin");
          const { formatWhatsAppPhone } = await import("@/lib/whatsapp");

          const orderDoc: any = await serverGetDocument(
            ORDERS_COLLECTION_ID,
            orderId,
          );
          const orderCode = orderDoc.ORDERCODE || orderId;

          // El worker confirma el PAGO -> payment_confirmed ("Pago Confirmado").
          // OJO: NO usar 'paid', porque en este proyecto 'paid' = "Stock Confirmado"
          // (paso previo al pago). Escribir 'paid' aquí hacía retroceder el pedido.
          await serverUpdateDocument(ORDERS_COLLECTION_ID, orderId, {
            STATUS: "payment_confirmed",
            UPDATEDAT: Date.now(),
          });

          // Try notifying the customer
          try {
            const { notifyOrderStatusChange } =
              await import("@/services/notificationService");
            await notifyOrderStatusChange(
              orderDoc as any,
              (orderDoc as any).STATUS || "payment_review",
              "payment_confirmed",
            );
          } catch (errNotif) {
            console.warn(
              "[WhatsApp Webhook] Notification to customer error:",
              errNotif,
            );
          }

          // Notify the Admin
          const adminAlertPhone = await getAdminAlertPhone();
          const formattedAdminPhone = formatWhatsAppPhone(adminAlertPhone);
          const adminAlert = `✅ *PAGO CONFIRMADO*\nANA (BINGFEEN) ha verificado y confirmado el pago del pedido #${orderCode}. El estado se ha actualizado a Pago Confirmado.`;
          await sendWhatsAppMessage(formattedAdminPhone, adminAlert, WA_TOKEN);

          // Clear worker usage pendingOrderId
          await recordKeniaUsage(fromPhone, { pendingOrderId: undefined });

          // Reply to worker
          const workerReply = `¡Listo Ana! El pago del pedido #${orderCode} ha sido verificado y el administrador ha sido notificado. ¡Muchas gracias! `;
          await sendWhatsAppMessage(fromPhone, workerReply, WA_TOKEN);

          return NextResponse.json({ status: "payment_confirmed_by_worker" });
        } else {
          await sendWhatsAppMessage(
            fromPhone,
            `No encontré ningún pedido pendiente de confirmación en tus registros. `,
            WA_TOKEN,
          );
          return NextResponse.json({ status: "worker_no_pending_order" });
        }
      } catch (e) {
        console.error("[WhatsApp] Failed to process Worker confirm button:", e);
      }
    }

    // Intercept stock-verifier (Lizzy) tapping "✅ Confirmar stock" / "❌ Falta stock" on a Balatin-created order
    if (
      cleanedFrom === STOCK_VERIFIER_PHONE &&
      interactiveId &&
      (interactiveId.startsWith("stockok:") ||
        interactiveId.startsWith("stockmiss:") ||
        interactiveId.startsWith("stockok_") ||
        interactiveId.startsWith("stockmiss_"))
    ) {
      try {
        const separator = interactiveId.includes(":") ? ":" : "_";
        const [action, orderRef] = interactiveId.split(separator);

        // orderRef can be an orderCode (WA-XXXX) or an orderId (wa_XXXX)
        let order: any = null;
        try {
          // Try by ORDERCODE first
          const qCode = JSON.stringify({
            method: "equal",
            attribute: "ORDERCODE",
            values: [orderRef],
          });
          const resOrder = await serverListDocuments(ORDERS_COLLECTION_ID, [
            qCode,
            JSON.stringify({ method: "limit", values: [1] }),
          ]);
          order = resOrder.documents?.[0];
        } catch {}
        if (!order) {
          // Try by document ID
          try {
            order = await serverGetDocument(ORDERS_COLLECTION_ID, orderRef);
          } catch {}
        }

        if (!order) {
          await sendWhatsAppMessage(
            fromPhone,
            `No encontré el pedido #${orderRef}. `,
            WA_TOKEN,
          );
          return NextResponse.json({ status: "stock_button_order_not_found" });
        }

        const orderCode = order.ORDERCODE || order.$id;
        const customerPhone = String(order.CUSTOMERPHONE || "").replace(
          /\D/g,
          "",
        );
        const customerFirstName =
          String(order.CUSTOMERNAME || "").split(" ")[0] || "amigo";

        if (action === "stockok") {
          // Solo confirmar stock si el pedido no ha avanzado mas alla de 'paid'
          const ADVANCED_STATUSES = ['payment_confirmed', 'processing', 'shipped', 'checklist', 'delivered'];
          if (!ADVANCED_STATUSES.includes(order.STATUS)) {
            await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
              STATUS: "paid",
              UPDATEDAT: Date.now(),
            });
          }

          // Update the customer's Balatin flow step to awaiting_payment (payment first, then data)
          if (customerPhone) {
            await recordKeniaUsage(`+${customerPhone}`, {
              balatinStep: "awaiting_payment",
              balatinComprobanteReceived: false,
            });
          }

          const orderTotal = Number(order.TOTAL || order.SUBTOTAL || 0);
          let customerMsg = `¡Hola ${customerFirstName}! ¡Buenas noticias! Confirmamos el stock de tu pedido *#${orderCode}*. Todo está disponible. \n\n`;
          customerMsg += `Para continuar, haz la transferencia:\n\n *Datos para la transferencia:*\nTitular: DON BALATO IVAN\nRUT: 78.267.426-9\nBanco: Mercado Pago (Cuenta Vista)\nCuenta: 1037879898\nEmail: donbalatosoporte@gmail.com\n\nMonto total: $${orderTotal.toLocaleString("es-CL")}\n\nCuando transfieras, mándame la *foto del comprobante* por aquí. `;

          if (customerPhone) {
            await sendWhatsAppMessage(customerPhone, customerMsg, WA_TOKEN);
            await addToHistory(
              `+${customerPhone}`,
              "assistant",
              customerMsg,
              `stockok-${Date.now()}`,
            );
          }
          await sendWhatsAppMessage(
            fromPhone,
            ` Stock confirmado para el pedido #${orderCode}. Ya le avisé al cliente.`,
            WA_TOKEN,
          );
        } else {
          await serverUpdateDocument(ORDERS_COLLECTION_ID, order.$id, {
            STATUS: "negotiation",
            UPDATEDAT: Date.now(),
          });
          await sendWhatsAppMessage(
            fromPhone,
            `Ok, dime qué producto(s) no hay del pedido #${orderCode} escribiendo por ejemplo: "en el pedido #${orderCode} no hay tal producto".`,
            WA_TOKEN,
          );
        }

        return NextResponse.json({ status: "stock_button_processed" });
      } catch (e) {
        console.error(
          "[WhatsApp Webhook] Failed to process stock-check button:",
          e,
        );
        return NextResponse.json({ status: "stock_button_error" });
      }
    }

    // Mark as read
    await markAsRead(msgId, WA_TOKEN);

    // Check if Balatin is globally disabled
    if (keniaConfig.isEnabled === false) {
      // Debug phone bypasses maintenance when debugMode is active
      if (!(debugMode && cleanedFrom === DEBUG_PHONE)) {
        // Si el admin está en modo cliente, permite bypass del mantenimiento
        if (!testAsClient) {
          if (!isAdmin) {
            // Cliente real: enviar aviso de mantenimiento
            const usageMaint = await getKeniaUsage(fromPhone);
            const now = Date.now();
            const lastMaint = usageMaint.maintenanceNotifiedTs || 0;

            // Responder con el mensaje de "fase de pruebas" (1 vez cada 4 horas para no hacer spam si insisten)
            if (now - lastMaint > 4 * 60 * 60 * 1000) {
              const customerFirstName = usageMaint.customerName
                ? usageMaint.customerName.split(" ")[0]
                : "";
              const welcomeReply = `Hola${customerFirstName ? " " + customerFirstName : ""}, estoy en fase de pruebas aún, todavía me están configurando y estoy mejorando.

Mira, ¿necesitas alguna consulta? Toma este número: *+56 9 9914 9712*

Este es el número de un asesor que te va a ayudar, escríbele. De igual forma, yo voy a comunicarme con él para que te escriba.

Lamento no poder ayudarte por ahora porque aún estoy en proceso de aprendizaje, pero muy pronto podré asesorarte en varias cositas más. Por ahora solamente te puedo notificar.

Muchas gracias por tu interés.`;

              await addToHistory(fromPhone, "assistant", welcomeReply, msgId);
              await sendWhatsAppMessage(fromPhone, welcomeReply, WA_TOKEN);
              await recordKeniaUsage(fromPhone, { maintenanceNotifiedTs: now });

              // Notificar al humano (asesor)
              const alertMsg = ` *CLIENTE REQUIERE ATENCIÓN*
El cliente +${fromPhone} le escribió a Balatin (pero Balatin está en pruebas).
Por favor contáctalo para ayudarle.

👉 Link de WhatsApp: https://wa.me/${fromPhone}`;
              await sendWhatsAppMessage("56999149712", alertMsg, WA_TOKEN);
            }
            return NextResponse.json({ status: "maintenance" });
          }
          // Admin normal (sin modo cliente): pasa libremente, no se bloquea
        }
        // testAsClient === true: bypass total del mantenimiento
      }
    }

    // Handle "limpiar historial" command
    if (userText.toLowerCase().includes("limpiar historial")) {
      await clearHistory(fromPhone);
      await resetKeniaUsage(fromPhone);
      await setKeniaBlocked(fromPhone, false);
      await sendWhatsAppMessage(
        fromPhone,
        "🗑️ Historial borrado y sistema desbloqueado. ¡Empezamos de cero!",
        WA_TOKEN,
      );
      return NextResponse.json({ status: "history_cleared" });
    }

    // ── Registration check for non-admin users ─────────────────────────────────
    let customerName = usage.customerName || "";
    if (!isAdmin) {
      let registeredUser = null;
      let isGuestWithOrders = false;

      if (usage.isRegistered === true) {
        customerName = usage.customerName || "";
      } else if (usage.isRegistered === false) {
        // Ya revisamos en esta sesión que no está registrado
        if (usage.isGuestWithOrders === true) {
          isGuestWithOrders = true;
          if (usage.customerName) customerName = usage.customerName;
        }
      } else {
        registeredUser = await lookupRegisteredUser(fromPhone);

        if (registeredUser) {
          await recordKeniaUsage(fromPhone, {
            isRegistered: true,
            customerName: registeredUser.name,
          });
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
              const { serverListDocuments } =
                await import("@/lib/appwrite-server");
              const { ORDERS_COLLECTION_ID } =
                await import("@/lib/appwrite-admin");
              const qOrderDesc = JSON.stringify({
                method: "orderDesc",
                attribute: "$createdAt",
              });
              const qLimit5 = JSON.stringify({ method: "limit", values: [5] });
              const cleanedPhone = fromPhone.replace(/\D/g, "");
              // Try multiple phone variants to match orders
              const phoneVariants = [
                cleanedPhone,
                "+" + cleanedPhone,
                cleanedPhone.replace(/^56/, ""),
                "56" + cleanedPhone.replace(/^56/, ""),
              ];
              let myOrders: any[] = [];
              for (const pv of phoneVariants) {
                if (myOrders.length > 0) break;
                try {
                  const qPhone = JSON.stringify({
                    method: "contains",
                    attribute: "CUSTOMERPHONE",
                    values: [pv],
                  });
                  const resOrders = await serverListDocuments(
                    ORDERS_COLLECTION_ID,
                    [qOrderDesc, qLimit5, qPhone],
                  );
                  myOrders = resOrders.documents || [];
                } catch {}
              }
              if (myOrders.length > 0) {
                isGuestWithOrders = true;
                // Find the most recent order that has a customer name
                const orderWithName = myOrders.find(
                  (o: any) => o.CUSTOMERNAME && String(o.CUSTOMERNAME).trim(),
                );
                const guestName = String(
                  orderWithName?.CUSTOMERNAME ||
                    myOrders[0]?.CUSTOMERNAME ||
                    "",
                );
                await recordKeniaUsage(fromPhone, {
                  isGuestWithOrders: true,
                  customerName: guestName || undefined,
                });
                if (guestName) customerName = guestName;
              } else {
                await recordKeniaUsage(fromPhone, { isGuestWithOrders: false });
              }
            } catch (e) {
              console.warn(
                "[WhatsApp Webhook] Failed to check guest orders",
                e,
              );
            }
          }
        }
      }

      if (!usage.isRegistered && !registeredUser && !isGuestWithOrders) {
        // ── Bypass: customer wants to CREATE a new order → skip registration, go to AI ──
        const wantsNewOrder =
          /\b(quiero\s+hacer\s+(este|un|mi)\s+pedido|quiero\s+pedir|hacer\s+un\s+pedido|quiero\s+comprar|me\s+gustar[ií]a\s+comprar)/i.test(
            userText,
          ) || /\*\s*Hola\s+Balatin!?\s*\*/i.test(userText); // catalog message starts with *Hola Balatin!*
        if (wantsNewOrder) {
          console.log(
            "[WhatsApp Webhook] New order intent from unregistered user, bypassing registration flow",
          );
          // Mark as guest so we don't re-check registration on every message
          await recordKeniaUsage(fromPhone, {
            isGuestWithOrders: true,
            isRegistered: false,
          });
          // Fall through to AI processing below (don't return)
        } else {
          // If the user is specifically asking for human help while blocked:
          const userTextLower = userText.toLowerCase().trim();
          if (
            userTextLower.includes("ayuda") ||
            userTextLower.includes("humano") ||
            userTextLower.includes("asesor") ||
            userTextLower.includes("persona")
          ) {
            await setKeniaBlocked(fromPhone, true);
            const helpMsg =
              " Entiendo. Ya notifiqué a nuestro equipo de atención al cliente. Por favor espera un momentito y una persona real te ayudará por aquí mismo para revisar tu caso. ";
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(fromPhone, "assistant", helpMsg);
            await sendWhatsAppMessage(fromPhone, helpMsg, WA_TOKEN);

            // Notify Admin
            const adminMsg = `🚨 *ASISTENCIA REQUERIDA (USUARIO NO REGISTRADO)*\nEl número +${fromPhone} no está registrado en la base de datos pero está pidiendo ayuda manual. Es posible que haya ingresado mal su número al registrarse.\n\nMensaje original: "${userText}"`;
            await sendWhatsAppMessage(ADMIN_PHONES[0], adminMsg, WA_TOKEN);
            return NextResponse.json({ status: "admin_notified" });
          }

          // ── Email/RUT auto-detection: try to find orders by email or RUT ──
          const detectedEmail = extractEmail(userText);
          const detectedRut = extractRut(userText);

          if (detectedEmail || detectedRut) {
            let foundOrders: any[] = [];
            let foundUser: any | null = null;
            let searchMethod = "";

            if (detectedEmail) {
              searchMethod = "email";
              foundOrders = await findOrdersByEmail(detectedEmail);
              foundUser = await findUserByEmail(detectedEmail);
            } else if (detectedRut) {
              searchMethod = "RUT";
              foundOrders = await findOrdersByRut(detectedRut);
            }

            if (foundOrders.length > 0 || foundUser) {
              // Link the WhatsApp phone to found orders and user account
              const { linkedOrders, linkedUser } =
                await linkPhoneToOrdersAndUser(
                  fromPhone,
                  foundOrders,
                  foundUser,
                );

              const customerNameFound =
                foundUser?.name || foundOrders[0]?.CUSTOMERNAME || "";
              const orderCount = foundOrders.length;
              const orderCodes = foundOrders
                .slice(0, 3)
                .map(
                  (o: any) =>
                    `#${o.ORDERCODE || String(o.$id).slice(-6).toUpperCase()}`,
                )
                .join(", ");

              let linkMsg = `¡Te encontré! 🐾✨\n\n`;
              if (customerNameFound)
                linkMsg += `Hola *${customerNameFound}* 👋\n\n`;
              linkMsg += `Vinculé tu WhatsApp a ${linkedOrders} pedido${linkedOrders !== 1 ? "s" : ""} que tenías con nosotros`;
              if (orderCodes)
                linkMsg += ` (${orderCodes}${orderCount > 3 ? ` y ${orderCount - 3} más` : ""})`;
              linkMsg += `.\n\n`;
              if (linkedUser)
                linkMsg += `También actualicé tu número en tu cuenta. 📱\n\n`;
              linkMsg += `Ahora puedo avisarte sobre tus pedidos, ofertas y todo lo que necesites. ¿En qué te puedo ayudar? 🐾`;

              await addToHistory(fromPhone, "user", userText, msgId);
              await addToHistory(
                fromPhone,
                "assistant",
                linkMsg,
                `link-${searchMethod}-${Date.now()}`,
              );
              await sendWhatsAppMessage(fromPhone, linkMsg, WA_TOKEN);

              // Mark as guest with orders so they don't get the register prompt again
              await recordKeniaUsage(fromPhone, {
                isGuestWithOrders: true,
                isRegistered: !!foundUser,
                customerName: customerNameFound || undefined,
              });
              await clearHistory(fromPhone);
              await resetKeniaUsage(fromPhone);
              await setKeniaBlocked(fromPhone, false);

              return NextResponse.json({ status: `linked_by_${searchMethod}` });
            } else {
              // Email/RUT not found in orders or users
              const notFoundMsg = `Mmm, busqué en mis registros con ese ${searchMethod} pero no lo encontré .\n\n¿Podrías revisarlo? A veces hay un pequeño error de tipeo. También puedes intentar con:\n• Tu *email* de compra (ej: tuemail@gmail.com)\n• Tu *RUT* (ej: 12.345.678-9)\n• El *código de tu pedido* (ej: ORD-00123)\n\nO si prefieres, escribe *Ayuda* y alguien del equipo te atenderá. `;

              await addToHistory(fromPhone, "user", userText, msgId);
              await addToHistory(
                fromPhone,
                "assistant",
                notFoundMsg,
                `not-found-${searchMethod}-${Date.now()}`,
              );
              await sendWhatsAppMessage(fromPhone, notFoundMsg, WA_TOKEN);
              return NextResponse.json({ status: `${searchMethod}_not_found` });
            }
          }

          // ── Alternate phone linking: user was asked for their order phone number ──
          if (usage.awaitingAltPhone) {
            const altPhone = userText.replace(/\D/g, "");
            if (altPhone.length >= 8) {
              try {
                const { serverListDocuments } =
                  await import("@/lib/appwrite-server");
                const { ORDERS_COLLECTION_ID } =
                  await import("@/lib/appwrite-admin");
                const qOrderDesc = JSON.stringify({
                  method: "orderDesc",
                  attribute: "$createdAt",
                });
                const qLimit5 = JSON.stringify({
                  method: "limit",
                  values: [5],
                });
                const qPhone = JSON.stringify({
                  method: "contains",
                  attribute: "CUSTOMERPHONE",
                  values: [altPhone],
                });
                const resOrders = await serverListDocuments(
                  ORDERS_COLLECTION_ID,
                  [qOrderDesc, qLimit5, qPhone],
                );
                const altOrders = resOrders.documents || [];

                if (altOrders.length > 0) {
                  const linked = await linkWhatsappToOrders(
                    fromPhone,
                    altOrders,
                  );
                  const guestName = String(altOrders[0]?.CUSTOMERNAME || "");
                  const orderCodes = altOrders
                    .slice(0, 3)
                    .map(
                      (o: any) =>
                        `#${o.ORDERCODE || String(o.$id).slice(-6).toUpperCase()}`,
                    )
                    .join(", ");

                  let linkMsg = `¡Te encontré! 🐾✨\n\n`;
                  if (guestName) linkMsg += `Hola *${guestName}* 👋\n\n`;
                  linkMsg += `Vinculé tu WhatsApp a ${linked} pedido${linked !== 1 ? "s" : ""} que tenías con nosotros`;
                  if (orderCodes)
                    linkMsg += ` (${orderCodes}${altOrders.length > 3 ? ` y ${altOrders.length - 3} más` : ""})`;
                  linkMsg += `.\n\nAhora puedo ayudarte con tus pedidos. ¿En qué te puedo ayudar? 🐾`;

                  await addToHistory(fromPhone, "user", userText, msgId);
                  await addToHistory(
                    fromPhone,
                    "assistant",
                    linkMsg,
                    `link-altphone-${Date.now()}`,
                  );
                  await sendWhatsAppMessage(fromPhone, linkMsg, WA_TOKEN);

                  await recordKeniaUsage(fromPhone, {
                    awaitingAltPhone: false,
                    isGuestWithOrders: true,
                    customerName: guestName || undefined,
                  });
                  return NextResponse.json({ status: "linked_by_altphone" });
                } else {
                  const notFoundAltMsg = `Mmm, busqué pedidos con ese número pero no encontré ninguno .\n\n¿Podrías revisar el número? A veces hay un pequeño error de tipeo. También puedes intentar con:\n• Tu *email* de compra\n• Tu *RUT*\n• El *código de tu pedido* (ej: ORD-00123)\n\nO escribe *Ayuda* y alguien del equipo te atenderá. `;
                  await addToHistory(fromPhone, "user", userText, msgId);
                  await addToHistory(
                    fromPhone,
                    "assistant",
                    notFoundAltMsg,
                    `not-found-altphone-${Date.now()}`,
                  );
                  await sendWhatsAppMessage(
                    fromPhone,
                    notFoundAltMsg,
                    WA_TOKEN,
                  );
                  await recordKeniaUsage(fromPhone, {
                    awaitingAltPhone: false,
                  });
                  return NextResponse.json({ status: "altphone_not_found" });
                }
              } catch (e) {
                console.warn("[WhatsApp Webhook] Alt phone search error:", e);
              }
            } else {
              const tooShortMsg = `Mmm, ese número parece muy corto . ¿Podrías escribirlo completo? Por ejemplo: 9 1234 5678 📱`;
              await addToHistory(fromPhone, "user", userText, msgId);
              await addToHistory(fromPhone, "assistant", tooShortMsg);
              await sendWhatsAppMessage(fromPhone, tooShortMsg, WA_TOKEN);
              return NextResponse.json({ status: "altphone_too_short" });
            }
          }

          // Detect if user mentions they have an order / made a purchase (trigger alt phone flow)
          // BUT skip if the user wants to CREATE a new order (not look up an existing one)
          const newOrderPhrases =
            /\b(quiero\s+hacer\s+(este|un|mi)\s+pedido|quiero\s+pedir|hacer\s+un\s+pedido|quiero\s+comprar|me\s+gustar[ií]a\s+comprar|balatin!?\*?\s*\n)/i;
          const orderKeywords =
            /\b(pedido|compra|orden|compr[eé]|pagu[eé]|transferencia|env[ií]o|despacho)\b/i;
          if (
            orderKeywords.test(userText) &&
            !usage.awaitingAltPhone &&
            !newOrderPhrases.test(userText)
          ) {
            const askAltPhoneMsg = `¡Ah! ¿Tienes un pedido con nosotros? ¡Genial!\n\nA veces los clientes ponen un número distinto al hacer su pedido (el de la casa, el de un familiar, etc). \n\n¿Podrías escribirme el *número de teléfono que usaste al hacer tu pedido*? Con ese te lo busco altiro 📱\n\nO si prefieres, también puedo buscarte por tu *email* o *RUT* de compra. `;
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(
              fromPhone,
              "assistant",
              askAltPhoneMsg,
              `ask-altphone-${Date.now()}`,
            );
            await sendWhatsAppMessage(fromPhone, askAltPhoneMsg, WA_TOKEN);
            await recordKeniaUsage(fromPhone, {
              awaitingAltPhone: true,
              registerPromptedAt: Date.now(),
            });
            return NextResponse.json({ status: "asked_alt_phone" });
          }

          // Not registered and no orders: prompt to register (once per 24h to avoid spam)
          const now = Date.now();
          const lastPrompted = usage.registerPromptedAt || 0;
          if (now - lastPrompted > 24 * 60 * 60 * 1000) {
            const registerMsg =
              "¡Hola! Soy Balatin, el gato de la suerte de Don Balato Iván. Mis sistemas me indican que aún no estás registrado/a en nuestra página web. Para poder atenderte de forma más personalizada y no estar pidiéndote tus datos todo el tiempo 😅 necesito solamente que te registres aquí 👇\n\n" +
              SITE_URL +
              "/login?tab=register\n\n💡 *¿Ya hiciste un pedido o tienes cuenta pero pusiste mal tu número?* ¡No te preocupes! Puedo buscarte por tu *email* o *RUT* de compra. Escríbeme cualquiera de los dos y te vinculo altiro. 📧🆔\n\n *¿Necesitas ayuda de un humano?* Simplemente escribe la palabra *Ayuda* y alguien del equipo te atenderá.\n\nLuego vuelve, escríbeme y este gato te traerá buena suerte en tus compras ";
            await addToHistory(fromPhone, "user", userText, msgId);
            await addToHistory(fromPhone, "assistant", registerMsg);
            await sendWhatsAppMessage(fromPhone, registerMsg, WA_TOKEN);
            await recordKeniaUsage(fromPhone, { registerPromptedAt: now });
          }
          return NextResponse.json({ status: "not_registered" });
        } // end else (not wantsNewOrder)
      }
      if (!customerName && registeredUser) {
        customerName = registeredUser.name || "";
      }
    }

    // ── First interaction welcome menu for registered customers ─────────────────
    if (!isAdmin && !usage.welcomeShown && isGreeting(userText)) {
      const displayName = customerName || "amigo";
      await addToHistory(fromPhone, "user", userText, msgId);

      // Generate a vibrant personalized greeting with Gemini
      let welcomeGreeting = "";
      try {
        const welcomePrompt = `Eres Balatin, el gato de la suerte y asesor estrella de Don Balato Iván, una tienda de artículos de hogar, aseo y variedad. Eres un gato blanco de la fortuna (maneki-neko): juguetón, tranquilo y muy resolutivo. Cero formal, cero aburrido.
 
 Es tu PRIMERA vez hablando con "${displayName}". Escribe un saludo SIMPLE, simpático y cortito.
 REGLAS:
 1. Usa un diminutivo cariñoso de su primer nombre (Ej: Janpol -> Jan, Guadalupe -> Lupe).
 2. Preséntate como Balatin, el gato de la suerte que le traerá buenas compras. 
 3. OPCIONAL Y SOLO SI TIENE SENTIDO: Lánzate un dato curioso o comentario gracioso y muy corto sobre su nombre o la buena suerte. Si su nombre es raro, sáltatelo. ¡Cero cosas aburridas o técnicas!
 4. Dile rapidito que estás para contarle de sus pedidos, ofertas y ayudarlo/a en todo.
 5. Dile que si necesita más información le dé al botón de abajo, y si no, que te pregunte lo que quiera. Usa emojis felinos con moderación (🐾🐱✨).
 
 Escribe con confianza total, frescura y humor. ¡Que se sienta la buena suerte!`;
        const welcomeBody = {
          system_instruction: { parts: [{ text: welcomePrompt }] },
          contents: [{ role: "user", parts: [{ text: userText }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 800 },
        };
        const welcomeHeaders = await getGeminiAuthHeaders();
        for (const model of GEMINI_MODELS) {
          const url = buildGeminiUrl(model);
          const res = await fetch(url, {
            method: "POST",
            headers: welcomeHeaders,
            body: JSON.stringify(welcomeBody),
          });
          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              welcomeGreeting = text.replace(/\*+/g, "").trim();
              break;
            }
          }
          if (res.status !== 503 && res.status !== 429) break;
        }
      } catch (e) {
        console.warn(
          "[WhatsApp Webhook] Welcome greeting generation failed:",
          e,
        );
      }

      // Fallback if AI failed
      if (!welcomeGreeting) {
        welcomeGreeting = `¡Hola ${displayName}! 🐾 ¡Qué buena suerte conocerte! Soy Balatin, el gato de la fortuna de Don Balato Iván. Si necesitas más información dale al botón de abajo, sino pregúntame lo que quieras. ✨`;
      }

      // Send the AI greeting fused into the interactive list menu (single message)
      await sendWelcomeMenu(fromPhone, displayName, WA_TOKEN, welcomeGreeting);
      await addToHistory(fromPhone, "assistant", welcomeGreeting, msgId);

      await recordKeniaUsage(fromPhone, { welcomeShown: true });
      return NextResponse.json({ status: "welcome_menu_sent" });
    }

    // ── Fetch context from DB ──────────────────────────────────────────────────
    let contextBlock = "";
    if (isAdmin ? needsDbContext(userText) : true) {
      try {
        if (isAdmin) {
          const now = Date.now();
          let recentOrders: any[] = [];
          let productsRes: any = { documents: [] };

          if (
            _adminContextCache &&
            now - _adminContextCache.ts < ADMIN_CACHE_TTL
          ) {
            recentOrders = _adminContextCache.data.recentOrders;
            productsRes = _adminContextCache.data.productsRes;
          } else {
            // Admin: get recent orders (up to 100) + products
            const qOrderDesc = JSON.stringify({
              method: "orderDesc",
              attribute: "$createdAt",
            });
            const qLimit100 = JSON.stringify({
              method: "limit",
              values: [100],
            });
            const qLimit30 = JSON.stringify({ method: "limit", values: [30] });

            const [fetchedOrdersRes, fetchedProductsRes] = await Promise.all([
              serverListDocuments(ORDERS_COLLECTION_ID, [
                qOrderDesc,
                qLimit100,
              ]),
              serverListDocuments(PRODUCTS_COLLECTION_ID, [qLimit30]),
            ]);

            recentOrders = fetchedOrdersRes.documents || [];
            productsRes = fetchedProductsRes || { documents: [] };

            _adminContextCache = {
              data: { recentOrders, productsRes },
              ts: now,
            };
          }

          // Helper to get local date string YYYY-MM-DD in America/Santiago timezone
          const getChileDateStr = (dateInput: string | number | Date) => {
            try {
              return new Date(dateInput).toLocaleDateString("en-CA", {
                timeZone: "America/Santiago",
              });
            } catch {
              return "";
            }
          };

          const todayStr = getChileDateStr(new Date());
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getChileDateStr(yesterday);
          const oneWeekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

          const REVENUE_STATUSES = [
            "paid",
            "payment_review",
            "payment_confirmed",
            "processing",
            "negotiation",
            "shipped",
            "delivered",
          ];
          const STATUS_LABELS: Record<string, string> = {
            pending: "Recibido",
            pending_stock: "Recibido",
            processing: "Comprobando Stock",
            paid: "Stock Confirmado",
            payment_review: "Revisando Pago",
            payment_confirmed: "Pago Confirmado",
            negotiation: "Negociando",
            shipped: "Embalado",
            delivered: "Entregado a Agencia",
            cancelled: "Cancelado",
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
            const statusRaw = o.STATUS || o.status || "pending";
            const total = Number(o.total || o.TOTAL || 0);
            const ts =
              o.CREATEDAT ||
              (o.$createdAt ? new Date(o.$createdAt).getTime() : 0);
            const orderDateStr = ts ? getChileDateStr(ts) : "";
            const isPaid = REVENUE_STATUSES.includes(statusRaw);

            if (statusRaw === "pending") {
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
          let queriedOrderBlock = "";
          const potentialCode =
            userText.match(/(?:ord-)?(\d{2,8})/i) ||
            userText.match(/\b([a-f0-9]{6})\b/i);
          if (potentialCode) {
            const codeUpper = potentialCode[1].toUpperCase().trim();
            let matchedOrder = recentOrders.find((o: any) => {
              const id =
                o.ORDERCODE ||
                String(o.$id || "")
                  .slice(-6)
                  .toUpperCase();
              return (
                id.toUpperCase() === codeUpper ||
                id.toUpperCase() === `ORD-${codeUpper}` ||
                String(o.$id || "")
                  .toUpperCase()
                  .endsWith(codeUpper)
              );
            });

            if (!matchedOrder) {
              try {
                const qCode = JSON.stringify({
                  method: "equal",
                  attribute: "ORDERCODE",
                  values: [codeUpper],
                });
                const resCode = await serverListDocuments(
                  ORDERS_COLLECTION_ID,
                  [qCode, JSON.stringify({ method: "limit", values: [1] })],
                );
                if (resCode.documents && resCode.documents.length > 0) {
                  matchedOrder = resCode.documents[0];
                } else {
                  const qCodePrefixed = JSON.stringify({
                    method: "equal",
                    attribute: "ORDERCODE",
                    values: [`ORD-${codeUpper}`],
                  });
                  const resCodePrefixed = await serverListDocuments(
                    ORDERS_COLLECTION_ID,
                    [
                      qCodePrefixed,
                      JSON.stringify({ method: "limit", values: [1] }),
                    ],
                  );
                  if (
                    resCodePrefixed.documents &&
                    resCodePrefixed.documents.length > 0
                  ) {
                    matchedOrder = resCodePrefixed.documents[0];
                  }
                }
              } catch (errSearch) {
                console.warn(
                  "[WhatsApp] Specific order search error:",
                  errSearch,
                );
              }
            }

            if (matchedOrder) {
              const statusRaw = String(
                matchedOrder.STATUS || matchedOrder.status || "pending",
              ) as string;
              const statusLabel = STATUS_LABELS[statusRaw] || statusRaw;
              const dateStr = matchedOrder.$createdAt
                ? new Date(String(matchedOrder.$createdAt)).toLocaleDateString(
                    "es-CL",
                    { timeZone: "America/Santiago" },
                  )
                : "?";

              queriedOrderBlock = `\n\n## 🔍 PEDIDO CONSULTADO (Coincide con tu búsqueda):
- Código/ID: #${matchedOrder.ORDERCODE || matchedOrder.$id}
- Cliente: ${matchedOrder.CUSTOMERNAME || "Sin nombre"}
- RUT: ${matchedOrder.CUSTOMERRUT || "-"}
- Teléfono: ${matchedOrder.CUSTOMERPHONE || "-"}
- Dirección: ${matchedOrder.ADDRESS || "-"}, ${matchedOrder.COMUNA || "-"}, ${matchedOrder.REGION || "-"}
- Agencia de Envío: ${matchedOrder.SHIPPINGAGENCY || "-"}
- Total: $${Number(matchedOrder.total || matchedOrder.TOTAL || 0).toLocaleString("es-CL")}
- Estado Actual: ${statusLabel} (${statusRaw})
- Fecha: ${dateStr}`;
            }
          }

          // 3. Format recent 15 orders list for context
          const orders = recentOrders.slice(0, 15).map((o: any) => {
            const id =
              o.ORDERCODE ||
              String(o.$id || "")
                .slice(-6)
                .toUpperCase();
            const name = o.CUSTOMERNAME || "Sin nombre";
            const total = o.total || o.TOTAL || 0;
            const statusRaw = String(
              o.STATUS || o.status || "pending",
            ) as string;
            const status = STATUS_LABELS[statusRaw] || statusRaw;
            const date = o.$createdAt
              ? new Date(String(o.$createdAt)).toLocaleDateString("es-CL", {
                  timeZone: "America/Santiago",
                })
              : "?";
            return `#${id} | ${name} | $${Number(total).toLocaleString("es-CL")} | ${status} | ${date}`;
          });

          const products = (productsRes.documents || [])
            .slice(0, 20)
            .map(
              (p: any) =>
                `${p.NAME} | Stock: ${p.STOCK ?? "?"} | Precio: $${p.PRICE ?? "?"}`,
            );

          contextBlock = `\n\n## 📊 ESTADÍSTICAS DE VENTAS (Cálculo automático de la base de datos):
- VENTAS HOY (Pagados/Completados): ${countPaidToday} pedidos | Monto total: $${amountPaidToday.toLocaleString("es-CL")} (Total pedidos recibidos hoy: ${countTotalToday})
- VENTAS AYER (Pagados/Completados): ${countPaidYesterday} pedidos | Monto total: $${amountPaidYesterday.toLocaleString("es-CL")} (Total pedidos recibidos ayer: ${countTotalYesterday})
- VENTAS ESTA SEMANA (Últimos 7 días): ${countPaidWeek} pedidos | Monto total: $${amountPaidWeek.toLocaleString("es-CL")} (Total pedidos recibidos esta semana: ${countTotalWeek})
- TOTAL PEDIDOS PENDIENTES DE PAGO: ${countPendingTotal} pedidos
${queriedOrderBlock}

## 📦 ÚLTIMOS PEDIDOS (Mostrando top 15 más recientes):
${orders.join("\n") || "Sin pedidos."}

## 🛍️ PRODUCTOS (Top 20 en catálogo):
${products.join("\n") || "Sin productos."}`;
        } else {
          // Customer: get products and their own orders
          const lowerText = userText.toLowerCase();
          const keywords = lowerText.split(/\s+/).filter((w) => w.length > 2);

          // Fetch customer's active orders based on fromPhone
          let customerOrdersText = "";
          let myOrders: any[] = [];
          try {
            const now = Date.now();
            const ordersCacheKey = fromPhone.replace(/\D/g, "");
            const cachedOrders = _ordersCache.get(ordersCacheKey);
            if (cachedOrders && now - cachedOrders.ts < ORDERS_CACHE_TTL) {
              myOrders = cachedOrders.data;
            } else {
              let resOrders;
              try {
                const cleanB = fromPhone.replace(/\D/g, "");
                const qPhone1 = cleanB;
                const qPhone2 = cleanB.startsWith("569")
                  ? cleanB.slice(2)
                  : `56${cleanB}`;
                const qPhone3 = `+${cleanB}`;
                const qPhone4 = `+${qPhone2}`;
                const qOrderDesc = JSON.stringify({
                  method: "orderDesc",
                  attribute: "$createdAt",
                });
                const qPhone = JSON.stringify({
                  method: "equal",
                  attribute: "CUSTOMERPHONE",
                  values: [qPhone1, qPhone2, qPhone3, qPhone4],
                });
                const qLimit = JSON.stringify({
                  method: "limit",
                  values: [10],
                });
                resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [
                  qOrderDesc,
                  qPhone,
                  qLimit,
                ]);
              } catch (e) {
                console.warn(
                  "[WhatsApp] Order query by phone failed, falling back to 20 limit:",
                  e,
                );
                const qOrderDesc = JSON.stringify({
                  method: "orderDesc",
                  attribute: "$createdAt",
                });
                const qLimit20 = JSON.stringify({
                  method: "limit",
                  values: [20],
                });
                resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [
                  qOrderDesc,
                  qLimit20,
                ]);
              }
              myOrders = (resOrders.documents || [])
                .filter((o: any) => {
                  const oPhone = String(o.CUSTOMERPHONE || "");
                  if (oPhone) {
                    const cleanA = oPhone.replace(/\D/g, "");
                    const cleanB = fromPhone.replace(/\D/g, "");
                    if (cleanA === cleanB) return true;
                    const tailA = cleanA.slice(-8);
                    const tailB = cleanB.slice(-8);
                    if (tailA.length === 8 && tailA === tailB) return true;
                  }
                  const linked: string[] = Array.isArray(o.LINKED_WHATSAPP)
                    ? o.LINKED_WHATSAPP
                    : [];
                  return linked.some((p: string) => phonesMatch(p, fromPhone));
                })
                .slice(0, 5);
              _ordersCache.set(ordersCacheKey, { data: myOrders, ts: now });
            }

            if (myOrders.length > 0) {
              const ordersFormatted = myOrders.map((o: any) => {
                const id = o.$id;
                const code = o.ORDERCODE || id.slice(-6).toUpperCase();
                const rawStatus = o.STATUS || "pending";
                const STATUS_LABELS: Record<string, string> = {
                  pending: "Pendiente de pago",
                  processing: "Procesando",
                  paid: "Pagado",
                  assembling: "En preparación",
                  negotiation: "En negociación / modificando",
                  preparing_shipping: "Etiqueta Lista",
                  ready_to_ship: "Listo para enviar",
                  shipped: "Enviado",
                  delivered: "Entregado a agencia de transporte",
                  cancelled: "Cancelado",
                };
                const status = STATUS_LABELS[rawStatus] || rawStatus;
                let missingText = "";
                try {
                  const items = JSON.parse(o.ITEMS || "[]");
                  const missingItems = items.filter(
                    (it: any) => it.missing === true,
                  );
                  if (missingItems.length > 0) {
                    missingText = `\n  ⚠️ PRODUCTOS FALTANTES: ${missingItems.map((it: any) => `${it.qty}x ${it.name}`).join(", ")}`;
                  }
                } catch (e) {}
                const agency = o.SHIPPINGAGENCY
                  ? ` | Agencia: ${o.SHIPPINGAGENCY}`
                  : "";
                const tracking = o.TRACKINGNUMBER
                  ? ` | Seguimiento: ${o.TRACKINGNUMBER}`
                  : "";
                const hasBoxPhoto = o.SHIPPINGPROOFURL
                  ? " | Tiene foto de caja"
                  : "";
                const hasPaymentProof = o.PAYMENTPROOFURL
                  ? " | Tiene comprobante de pago"
                  : "";
                return `- Pedido #${code} (ID: ${id}) | Total: $${o.TOTAL} | Estado: ${status}${agency}${tracking}${hasBoxPhoto}${hasPaymentProof}${missingText}`;
              });
              customerOrdersText = `\n\n## 📦 MIS PEDIDOS ACTIVOS:\n${ordersFormatted.join("\n")}`;
            }
          } catch (e) {
            console.warn("[WhatsApp] Error fetching customer orders:", e);
          }

          // 1. If customer has a negotiation order, fetch similar products for their missing items
          let suggestedProducts: any[] = [];
          const hasNegotiationOrder = myOrders.some(
            (o: any) => o.STATUS === "negotiation",
          );
          if (hasNegotiationOrder) {
            for (const o of myOrders) {
              if (o.STATUS !== "negotiation") continue;
              try {
                const items = JSON.parse(o.ITEMS || "[]");
                const missingItems = items.filter(
                  (it: any) => it.missing === true,
                );
                for (const item of missingItems) {
                  if (item.id) {
                    try {
                      const prod = await serverGetDocument(
                        PRODUCTS_COLLECTION_ID,
                        item.id,
                      );
                      const categoryId = (prod as any).CATEGORYID || "";
                      if (categoryId) {
                        const qCat = JSON.stringify({
                          method: "equal",
                          attribute: "CATEGORYID",
                          values: [categoryId],
                        });
                        const qLimit8 = JSON.stringify({
                          method: "limit",
                          values: [8],
                        });
                        const resSimilar = await serverListDocuments(
                          PRODUCTS_COLLECTION_ID,
                          [qCat, qLimit8],
                        );
                        if (
                          resSimilar.documents &&
                          resSimilar.documents.length > 0
                        ) {
                          suggestedProducts = [
                            ...suggestedProducts,
                            ...resSimilar.documents,
                          ];
                        }
                      }
                    } catch (e) {
                      console.warn(
                        "[WhatsApp Webhook] Could not load similar products for missing item:",
                        e,
                      );
                    }
                  }
                }
              } catch (e) {}
            }
          }

          // 2. Fetch/search catalog products
          let relevantProducts: any[] = [];
          let searched = false;

          // ── Special case: catalog order message → extract product names from lines ──
          const isCatalogOrderMsg =
            /\*\s*Hola\s+Balatin!?\s*\*/i.test(userText) ||
            /quiero\s+hacer\s+(este|un|mi)\s+pedido/i.test(userText);
          if (isCatalogOrderMsg) {
            // Extract product names from lines starting with "- " (format: "- PRODUCT NAME\n  QTY x $PRICE = $TOTAL")
            const productLines: string[] = [];
            const lines = userText.split("\n");
            for (const line of lines) {
              const m = line.match(/^\s*-\s+(.+?)\s*$/);
              if (m && !m[1].match(/^\d/)) {
                // Clean the product name: remove trailing price/qty info
                let name = m[1].trim();
                // Remove patterns like "2 x $32.500 = $65.000" that might be on the same line
                name = name.replace(/\d+\s*x\s*\$[\d.]+.*$/i, "").trim();
                if (name.length > 2) productLines.push(name);
              }
            }
            if (productLines.length > 0) {
              console.log(
                "[WhatsApp Webhook] Catalog order detected, searching products:",
                productLines,
              );
              for (const prodName of productLines) {
                try {
                  const qSearch = JSON.stringify({
                    method: "search",
                    attribute: "NAME",
                    values: [prodName],
                  });
                  const qLimit10 = JSON.stringify({
                    method: "limit",
                    values: [10],
                  });
                  const resSearch = await serverListDocuments(
                    PRODUCTS_COLLECTION_ID,
                    [qSearch, qLimit10],
                  );
                  if (resSearch.documents && resSearch.documents.length > 0) {
                    for (const doc of resSearch.documents) {
                      if (!relevantProducts.some((p) => p.$id === doc.$id)) {
                        relevantProducts.push(doc);
                      }
                    }
                    searched = true;
                  }
                } catch (e) {
                  console.warn(
                    "[WhatsApp Webhook] Catalog product search failed for:",
                    prodName,
                    e,
                  );
                }
              }
            }
          }

          if (!searched && keywords.length > 0) {
            try {
              const stopwords = [
                "precios",
                "precio",
                "mayor",
                "catalogo",
                "completo",
                "todos",
                "quiero",
                "saber",
                "imagen",
                "imagenes",
                "fotos",
                "costos",
                "costo",
                "hola",
                "como",
                "estas",
                "bien",
                "gracias",
              ];
              const searchKeywords = keywords.filter(
                (k) => !stopwords.includes(k),
              );
              if (searchKeywords.length > 0) {
                const searchQuery = searchKeywords.join(" ");
                const cacheKey = searchQuery.toLowerCase();
                const now = Date.now();
                const cached = _productSearchCache.get(cacheKey);
                if (cached && now - cached.ts < PROD_CACHE_TTL) {
                  relevantProducts = cached.data;
                  searched = true;
                } else {
                  const qSearch = JSON.stringify({
                    method: "search",
                    attribute: "NAME",
                    values: [searchQuery],
                  });
                  const qLimit25 = JSON.stringify({
                    method: "limit",
                    values: [25],
                  });
                  const resSearch = await serverListDocuments(
                    PRODUCTS_COLLECTION_ID,
                    [qSearch, qLimit25],
                  );
                  if (resSearch.documents && resSearch.documents.length > 0) {
                    relevantProducts = resSearch.documents;
                    searched = true;
                  } else {
                    // Fallback to tags search
                    const qTags = JSON.stringify({
                      method: "search",
                      attribute: "TAGS",
                      values: [searchQuery],
                    });
                    const resTags = await serverListDocuments(
                      PRODUCTS_COLLECTION_ID,
                      [qTags, qLimit25],
                    );
                    if (resTags.documents && resTags.documents.length > 0) {
                      relevantProducts = resTags.documents;
                      searched = true;
                    }
                  }
                  _productSearchCache.set(cacheKey, {
                    data: relevantProducts,
                    ts: now,
                  });
                }
              }
            } catch (searchErr) {
              console.warn(
                "[WhatsApp Webhook] Direct search failed:",
                searchErr,
              );
            }
          }

          // Default fallback: if no products were found via search, we load CATEGORIES instead of 50 products
          let categoriesList: string[] = [];
          if (relevantProducts.length === 0 && suggestedProducts.length === 0) {
            try {
              const now = Date.now();
              let catDocs: any[] = [];
              if (_catCache && now - _catCache.ts < CAT_CACHE_TTL) {
                catDocs = _catCache.data;
              } else {
                const qLimit100 = JSON.stringify({
                  method: "limit",
                  values: [100],
                });
                const catRes = await serverListDocuments(
                  CATEGORIES_COLLECTION_ID,
                  [qLimit100],
                );
                catDocs = catRes.documents || [];
                _catCache = { data: catDocs, ts: now };
              }
              categoriesList = catDocs.map(
                (c: any) => `- ${c.name} (ID: ${c.$id})`,
              );
            } catch (e) {
              console.error("[WhatsApp Webhook] Categories query failed:", e);
            }
          }

          // Merge keeping suggested products at the top and avoiding duplicates
          const finalProducts: any[] = [...suggestedProducts];
          relevantProducts.forEach((p: any) => {
            if (!finalProducts.some((fp) => fp.$id === p.$id)) {
              finalProducts.push(p);
            }
          });

          let contextBlockAdditions = "";
          if (finalProducts.length > 0) {
            const productList = finalProducts.slice(0, 20).map((p: any) => {
              const price = p.CURRENTPRICE || p.PRICE || 0;
              const wholesalePrice = p.WHOLESALEPRICE || 0;
              const stock = p.STOCK ?? 0;
              const stockLabel =
                stock > 0 ? `✅ Disponible (${stock} uds)` : "❌ Sin stock";

              let priceText = `$${Number(price).toLocaleString("es-CL")}`;
              if (wholesalePrice > 0) {
                priceText += ` (Precio por mayor: $${Number(wholesalePrice).toLocaleString("es-CL")})`;
              }
              return `• *${p.NAME}* (id: ${p.$id}) — ${priceText} | ${stockLabel}`;
            });
            contextBlockAdditions = `## 🛍️ PRODUCTOS BUSCADOS (${finalProducts.length} encontrados):\n${productList.join("\n")}`;
          } else if (categoriesList.length > 0) {
            contextBlockAdditions = `## 📁 CATEGORÍAS DISPONIBLES:\n(Recomienda estas categorías enviando el enlace de la tienda según el nombre)\n${categoriesList.join("\n")}`;
          } else {
            contextBlockAdditions = `No se encontraron productos ni categorías.`;
          }

          contextBlock = `${customerOrdersText}\n\n${contextBlockAdditions}\n\nSitio web: ${SITE_URL}`;
        }
      } catch (dbErr) {
        console.warn("[WhatsApp] DB context error:", dbErr);
      }
    }

    // ── Build conversation history for Gemini ─────────────────────────────────
    const history = await getHistory(fromPhone);
    await addToHistory(fromPhone, "user", userText, msgId);

    const nowChileStr = new Date().toLocaleString("es-CL", {
      timeZone: "America/Santiago",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeBlock = `\n\n## 📅 FECHA Y HORA ACTUAL (Chile):
- ${nowChileStr}
(Usa esta fecha como referencia absoluta de "hoy" para determinar qué pedidos corresponden a "hoy", "ayer", etc.)`;

    // Números admin que nunca pueden ser baneados/bloqueados (inmune incluso en MODO CLIENTE)
    const BAN_PROOF_PHONES = ["56992139185"];
    const isBanProof = BAN_PROOF_PHONES.includes(cleanedFrom);

    if (!isAdmin) {
      const usageCheck = await getKeniaUsage(
        fromPhone,
        keniaConfig.blockedPhones,
      );

      // Si es un número inmune (admin probando), auto-desbloquear si estaba bloqueado
      if (isBanProof && (usageCheck.blocked || usageCheck.spamBlocked)) {
        await setKeniaBlocked(fromPhone, false);
        usageCheck.blocked = false;
        usageCheck.spamBlocked = false;
      }

      // ── Anti-spam: detectar más de 8 mensajes en 2 minutos ──
      const now = Date.now();
      const recentTimestamps = (usageCheck.lastMessageTimestamps || []).filter(
        (ts: number) => now - ts < 120_000,
      );
      recentTimestamps.push(now);
      await recordKeniaUsage(fromPhone, {
        lastMessageTimestamps: recentTimestamps,
      });

      if (
        !isBanProof &&
        !usageCheck.spamBlocked &&
        recentTimestamps.length > 8
      ) {
        // Auto-bloquear por spam
        await setKeniaBlocked(fromPhone, true, "spam");
        const MAIN_ADMIN_PHONE = (
          keniaConfig.adminAlertPhone || "56992139185"
        ).replace(/\D/g, "");
        const spamAlert = `🚫 *ALERTA ANTI-SPAM*\nEl número +${fromPhone} fue bloqueado automáticamente por enviar ${recentTimestamps.length} mensajes en menos de 2 minutos.\n\nÚltimo mensaje: "${userText}"\n\n🔗 Revisa en el panel: ${SITE_URL}/admin/ia/whatsapp`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, spamAlert, WA_TOKEN);
        return NextResponse.json({ status: "spam_blocked" });
      }

      if (usageCheck.blocked) {
        // Siempre guardar el mensaje del cliente en el history para que el admin lo vea
        await addToHistory(fromPhone, "user", userText, msgId);

        if (usageCheck.spamBlocked) {
          // Spam: silencio total, no responder nada
          return NextResponse.json({ status: "spam_blocked" });
        }
        if (usageCheck.adminTakeover || usageCheck.escalated) {
          // Admin tomó control o Balatin escaló: responder UNA sola vez y luego silencio total
          const lastStallTs = usageCheck.lastStallReplyTs || 0;
          if (lastStallTs === 0) {
            const takeoverReply =
              "¡Miau! Dame un segundito que estoy revisando un par de cosas con el equipo de tienda para poder ayudarte mejor con esto. ¡Ahorita vuelvo contigo!";
            await addToHistory(
              fromPhone,
              "assistant",
              takeoverReply,
              `stall-${Date.now()}`,
            );
            await sendWhatsAppMessage(fromPhone, takeoverReply, WA_TOKEN);
            const MAIN_ADMIN_PHONE = (
              keniaConfig.adminAlertPhone || "56992139185"
            ).replace(/\D/g, "");
            const adminNotif = `📩 *Cliente esperando respuesta*\n+${fromPhone} escribió: "${userText}"\n\n🔗 ${SITE_URL}/admin/ia/whatsapp`;
            await sendWhatsAppMessage(MAIN_ADMIN_PHONE, adminNotif, WA_TOKEN);
            await recordKeniaUsage(fromPhone, { lastStallReplyTs: Date.now() });
          }
          // Después del primer mensaje: silencio total, solo guardar el mensaje del cliente
          return NextResponse.json({ status: "admin_takeover" });
        }
        // Bloqueo normal (manual): NO responder nada, solo guardar mensaje y notificar admin (throttled)
        const nowBlocked = Date.now();
        const lastBlockedTs = usageCheck.lastStallReplyTs || 0;
        const BLOCKED_NOTIFY_COOLDOWN = 3 * 60 * 1000; // 3 min
        if (nowBlocked - lastBlockedTs > BLOCKED_NOTIFY_COOLDOWN) {
          const MAIN_ADMIN_PHONE = (
            keniaConfig.adminAlertPhone || "56992139185"
          ).replace(/\D/g, "");
          const adminNotifBlocked = `⚠️ *Cliente pausado escribió*\n+${fromPhone}: "${userText}"\n\n🔗 Atiéndelo en: ${SITE_URL}/admin/ia/whatsapp`;
          await sendWhatsAppMessage(
            MAIN_ADMIN_PHONE,
            adminNotifBlocked,
            WA_TOKEN,
          );
          await recordKeniaUsage(fromPhone, { lastStallReplyTs: nowBlocked });
        }

        return NextResponse.json({ status: "blocked" });
      }
    }

    // ── BALATIN DATA MODE: override prompt for data parsing ────────────────────
    const balatinDataMode = (usage as any)._balatinDataMode === true;
    const balatinOrderId = (usage as any)._balatinOrderId;
    const balatinOrderCode = (usage as any)._balatinOrderCode;

    let basePrompt: string;
    if (balatinDataMode) {
      // Special Balatin prompt for parsing shipping data
      basePrompt = `Eres Balatin, el gato de la suerte de Don Balato Iván. Estás ayudando al cliente ${customerName} a completar los datos de envío de su pedido ${balatinOrderCode}.

## TU ÚNICA TAREA AHORA:
El cliente te mandó todos sus datos de envío juntos. Debes EXTRAER los datos y guardarlos con la acción UPDATE_SHIPPING. Luego mostrar un resumen y pedir confirmación.

## Datos obligatorios que necesitas:
1. *RUT* (formato chileno: acepta con o sin puntos, con o sin guión. Ej válidos: 12.345.678-9, 12345678-9, 123456789. Solo recházalo si tiene menos de 7 dígitos antes del dígito verificador)
2. *Nombre completo* (nombres y apellidos) — si ya tienes el nombre del cliente, no lo pidas de nuevo
3. *Dirección* (calle, número, depto/casa)
4. *Comuna*
5. *Región*
6. *Agencia de envío* (Starken, Chilexpress, BluExpress, o "retiro en tienda")
7. Email (correo electrónico) — *OPCIONAL, no obligatorio*

## Cómo responder:
1. Extrae TODOS los datos del mensaje del cliente.
2. Guárdalos con [ACTION:UPDATE_SHIPPING].
3. Muestra un RESUMEN claro con todos los datos extraídos.
4. Si faltan datos obligatorios (RUT, dirección, comuna, región, agencia), dile cuáles faltan. NO pidas email si no lo dio.
5. Si todos los datos obligatorios están completos, pregúntale: "¿Estos datos están correctos? Responde *CORRECTO* para confirmar."
6. NO analices ni valides comprobantes de pago. NO menciones montos.
7. Datos extra (observaciones, instrucciones especiales) → inclúyelos en "observations".

## Formato de la acción (incluye todos los campos que extraíste):
[ACTION:UPDATE_SHIPPING]{"address":"Calle 123, depto 4","comuna":"Santiago","region":"Metropolitana","shippingAgency":"Starken","customerRut":"12.345.678-9","customerName":"Juan Pérez","customerEmail":"juan@email.com","observations":"Timbre 2"}[/ACTION]

## REGLAS:
- NO inventes datos. Solo usa lo que el cliente te escribió.
- NO pidas el teléfono (ya lo tienes).
- Sé cálido y breve. Usa su nombre.
- Acepta el RUT en cualquier formato (con puntos, sin puntos, con guión, sin guión).
- El email es OPCIONAL: si el cliente lo da, lo guardas; si no lo da, NO se lo pidas.
- Cuando tengas todos los datos obligatorios (RUT, dirección, comuna, región, agencia), muestra el resumen y pide confirmación con "CORRECTO".`;
    } else {
      basePrompt = isAdmin
        ? keniaConfig.adminPrompt || ADMIN_PROMPT
        : hydratePrompt(
            keniaConfig.customerPrompt || CUSTOMER_PROMPT,
            SITE_URL,
          );
    }

    if (!isAdmin) {
      basePrompt += `\n\n## ⚠️ REGLA ESTRICTA DE ANTI-ALUCINACIÓN PARA PEDIDOS:\nSi el cliente pregunta por su pedido y la sección "MIS PEDIDOS ACTIVOS" está vacía o no existe en tu contexto, **TIENES ESTRICTAMENTE PROHIBIDO INVENTAR ENLACES O FALTANTES DE STOCK**. Debes responder EXACTAMENTE: "Mmm, estoy buscando con tu número pero no logro encontrar tu pedido activo en el sistema 🥺. Déjame pedirle ayuda al equipo para que lo busquen manualmente, ¡dame unos minutitos! 🐾" y luego **AÑADIR OBLIGATORIAMENTE** al final de tu respuesta: [ACTION:ASK_ADMIN]El cliente pregunta por su pedido pero no encuentro ninguno activo en la base de datos.[/ACTION].`;
      basePrompt += `\n\n## 🔇 REGLA DE CIERRE DE CONVERSACIÓN:\n**NUNCA** hagas preguntas abiertas al final de tu respuesta (Ej: "¿te ayudo con algo más?", "¿qué más necesitas?", "¿cuéntame?"). Responde PUNTUALMENTE lo que te preguntaron y cierra el mensaje. Si el cliente no pregunta nada nuevo, la conversación termina ahí.`;
      basePrompt += `\n\n## 📦 REGLA DE SEGUIMIENTO DE PEDIDOS:\nCuando un cliente pregunte por su pedido, basa tu respuesta **ÚNICAMENTE** en el estado que aparece en "MIS PEDIDOS ACTIVOS". \n**TIENES ESTRICTAMENTE PROHIBIDO:**\n- Inventar que el pedido fue enviado si el estado NO es "Enviado" o "Entregado a agencia de transporte".\n- Inventar números de seguimiento que no aparecen en el contexto.\n- Enviar o mencionar URLs de comprobantes o fotos que no estén explícitamente en el contexto.\n- Decir que el pedido está en camino si el estado es "Pagado", "Procesando", "En preparación" o "Pendiente de pago".\n\n**Según el estado real del pedido:**\n- "Pendiente de pago" → El cliente aún no ha pagado. Dile que está pendiente de pago.\n- "Procesando" → El comprobante de pago fue recibido y está siendo validado por finanzas.\n- "Pagado" → El pago fue verificado. Dile que el equipo está preparando su pedido y pronto saldrá en camino. NO digas que ya fue enviado.\n- "En preparación" → El equipo está armando el pedido.\n- "Listo para enviar" → El pedido está empacado y listo para salir.\n- "Enviado" o "Entregado a agencia de transporte" → Si hay número de seguimiento, dilo con el link de la agencia. Si no hay número, dile que fue enviado pero no tienes el número de seguimiento aún.\n- Links de seguimiento por agencia:\n  - BluExpress: https://www.blue.cl/enviar/seguimiento?n_seguimiento=NUMERO\n  - Starken: https://www.starken.cl/seguimiento?n_seguimiento=NUMERO\n  - Chilexpress: https://www.chilexpress.cl/centro-de-ayuda/seguimiento-de-envios\n  - Retiro en tienda: diles que está listo para retirar en la tienda.\n\n**NUNCA envíes links de comprobantes de pago como si fueran comprobantes de envío.**`;
    }
    const customerNameBlock =
      !isAdmin && customerName
        ? "\n\n## 👤 DATOS DEL CLIENTE:\nNombre: " +
          customerName +
          "\n(Usa su nombre real para saludar. Puedes usar expresiones felinas con moderación, no en cada frase.)"
        : "";
    const systemPrompt =
      basePrompt + timeBlock + contextBlock + customerNameBlock;

    // If Balatin data mode with accumulated data, use that instead of just the last message
    const balatinAccumulatedData = (usage as any)._balatinAccumulatedData as
      string | undefined;
    const effectiveUserText =
      balatinDataMode && balatinAccumulatedData
        ? balatinAccumulatedData
        : userText;

    const rawContents = [
      ...history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "..." }],
      })),
      {
        role: "user",
        parts: [{ text: effectiveUserText || "..." }, ...inlineDataParts],
      },
    ];

    // Fix Gemini history strict alternating rules (must start with user, must alternate user/model)
    const contents: any[] = [];
    for (const msg of rawContents) {
      if (contents.length === 0) {
        if (msg.role === "model") {
          // Prepend a dummy user message so it starts with user
          contents.push({ role: "user", parts: [{ text: "Hola" }] });
        }
        contents.push(msg);
      } else {
        const last = contents[contents.length - 1];
        if (last.role === msg.role) {
          // Combine consecutive messages of the same role
          const lastText = last.parts[0]?.text || "";
          const newText = msg.parts[0]?.text || "";
          last.parts[0].text = lastText + "\n\n" + newText;
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
    let aiReply =
      "¡Miau! 🐾 Tuve un problemita técnico para procesar tu mensaje 🥺. Dame un momentito y vuelve a intentarlo, ¡pronto estaremos conversando! ✨";
    let rawText = "";
    let usageMetadata: any = null;
    const geminiHeaders = await getGeminiAuthHeaders();
    for (const model of GEMINI_MODELS) {
      const url = buildGeminiUrl(model);
      const res = await fetch(url, {
        method: "POST",
        headers: geminiHeaders,
        body: JSON.stringify(geminiBody),
      });
      if (res.ok) {
        const data = await res.json();
        usageMetadata = data?.usageMetadata || null;
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          rawText = text;
          aiReply = text
            .replace(/\[ACTION:[^\]]+\][\s\S]*?\[\/ACTION\]/g, "") // strip any action blocks
            .replace(/\*\*(.*?)\*\*/g, "*$1*") // convert **bold** to WA *bold*
            .trim();
          break;
        }
        console.warn(
          `[Gemini] Model ${model} returned OK but no text. Response:`,
          JSON.stringify(data).substring(0, 500),
        );
      } else {
        const errBody = await res.text().catch(() => "no body");
        console.warn(
          `[Gemini] Model ${model} failed with status ${res.status}:`,
          errBody.substring(0, 300),
        );
      }
      if (res.status !== 503 && res.status !== 429) break;
    }

    // If all Gemini models failed, notify admin
    if (!rawText && !isAdmin) {
      try {
        const MAIN_ADMIN_PHONE = (
          keniaConfig.adminAlertPhone || "56992139185"
        ).replace(/\D/g, "");
        const failAlert = `⚠️ *BALATIN: Error de Gemini*\n\nNo pude responder a +${fromPhone}. Todos los modelos fallaron.\n\nMensaje del cliente: "${userText.substring(0, 100)}"\n\nRevisa el log del servidor para más detalles.`;
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
          const qCode = JSON.stringify({
            method: "equal",
            attribute: "ORDERCODE",
            values: [codeUpper],
          });
          const resCode = await serverListDocuments(ORDERS_COLLECTION_ID, [
            qCode,
            JSON.stringify({ method: "limit", values: [1] }),
          ]);

          if (resCode.documents && resCode.documents.length > 0) {
            matchedOrder = resCode.documents[0];
          } else {
            const qSuffix = JSON.stringify({
              method: "endsWith",
              attribute: "$id",
              values: [codeUpper.toLowerCase()],
            });
            const resRecent = await serverListDocuments(ORDERS_COLLECTION_ID, [
              qSuffix,
              JSON.stringify({ method: "limit", values: [1] }),
            ]);
            matchedOrder = resRecent.documents[0] || null;
          }

          if (matchedOrder) {
            try {
              const oldStatus =
                matchedOrder.STATUS || matchedOrder.status || "pending";
              await serverUpdateDocument(
                ORDERS_COLLECTION_ID,
                matchedOrder.$id,
                {
                  STATUS: status,
                  UPDATEDAT: Date.now(),
                },
              );

              // Try notifying
              try {
                const { notifyOrderStatusChange } =
                  await import("@/services/notificationService");
                await notifyOrderStatusChange(matchedOrder, oldStatus, status);
              } catch (errNotif) {
                console.warn(
                  "[WhatsApp Webhook] Notification error:",
                  errNotif,
                );
              }
              console.log(
                `[WhatsApp Webhook] Order ${matchedOrder.$id} status updated to ${status}`,
              );
            } catch (updateErr: any) {
              console.error(
                "[WhatsApp Webhook] serverUpdateDocument failed:",
                updateErr,
              );
              aiReply = `❌ Hubo un error al intentar actualizar el estado del pedido #${codeUpper} en la base de datos. Detalle: ${updateErr?.message || String(updateErr)}`;
            }
          } else {
            aiReply = `❌ No pude encontrar el pedido #${codeUpper} en la base de datos. Por favor verifica el código e inténtalo de nuevo.`;
          }
        }
      } catch (actionErr) {
        console.error(
          "[WhatsApp Webhook] Action parsing/execution error:",
          actionErr,
        );
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

          const qCode = JSON.stringify({
            method: "equal",
            attribute: "ORDERCODE",
            values: [codeUpper],
          });
          const resCode = await serverListDocuments(ORDERS_COLLECTION_ID, [
            qCode,
            JSON.stringify({ method: "limit", values: [1] }),
          ]);

          if (resCode.documents && resCode.documents.length > 0) {
            matchedOrder = resCode.documents[0];
          } else {
            const qSuffix = JSON.stringify({
              method: "endsWith",
              attribute: "$id",
              values: [codeUpper.toLowerCase()],
            });
            const resRecent = await serverListDocuments(ORDERS_COLLECTION_ID, [
              qSuffix,
              JSON.stringify({ method: "limit", values: [1] }),
            ]);
            matchedOrder = resRecent.documents[0] || null;
          }

          if (matchedOrder) {
            let items = [];
            try {
              items = JSON.parse(matchedOrder.ITEMS || "[]");
            } catch (e) {}

            let changed = false;
            for (const prodName of products) {
              const pNameLower = String(prodName).toLowerCase().trim();
              const itemToMark = items.find(
                (i: any) =>
                  i.name.toLowerCase().includes(pNameLower) && !i.missing,
              );
              if (itemToMark) {
                itemToMark.missing = true;
                changed = true;
                if (itemToMark.id) {
                  try {
                    await serverUpdateDocument(
                      PRODUCTS_COLLECTION_ID,
                      itemToMark.id,
                      { STOCK: 0 },
                    );
                  } catch (e) {
                    console.warn(
                      "[WhatsApp] Could not block product stock to 0:",
                      e,
                    );
                  }
                }
              }
            }
            if (changed) {
              await serverUpdateDocument(
                ORDERS_COLLECTION_ID,
                matchedOrder.$id,
                {
                  ITEMS: JSON.stringify(items),
                  STATUS: "negotiation",
                  UPDATEDAT: Date.now(),
                },
              );
              console.log(
                `[WhatsApp Webhook] Order ${matchedOrder.$id} marked missing for ${products.join(",")}`,
              );
            } else {
              aiReply += `\n⚠️ (Info interna: No encontré los productos mencionados en el pedido #${codeUpper} que no estuvieran ya marcados).`;
            }
          } else {
            aiReply += `\n❌ (Info interna: No encontré el pedido #${codeUpper} en la base de datos).`;
          }
        }
      } catch (err) {
        console.error("[WhatsApp Webhook] MARK_MISSING parsing error:", err);
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

          const qCode = JSON.stringify({
            method: "equal",
            attribute: "ORDERCODE",
            values: [codeUpper],
          });
          const resCode = await serverListDocuments(ORDERS_COLLECTION_ID, [
            qCode,
            JSON.stringify({ method: "limit", values: [1] }),
          ]);
          if (resCode.documents && resCode.documents.length > 0) {
            matchedOrder = resCode.documents[0];
          } else {
            const resRecent = await serverListDocuments(ORDERS_COLLECTION_ID, [
              JSON.stringify({ method: "limit", values: [100] }),
            ]);
            matchedOrder = resRecent.documents.find((o: any) =>
              String(o.$id || "")
                .toUpperCase()
                .endsWith(codeUpper),
            );
          }

          if (matchedOrder) {
            // Llama al cron de negociación internamente pasando el orderId
            const cronUrl = `${SITE_URL}/api/cron/negotiation?secret=${process.env.CRON_SECRET || "negotiation_secret_key_2026"}&orderId=${matchedOrder.$id}`;
            fetch(cronUrl).catch((e) =>
              console.error("[WhatsApp] Cron trigger error:", e),
            );
            console.log(
              `[WhatsApp Webhook] Triggered negotiation cron for order ${matchedOrder.$id}`,
            );
            aiReply += `\n\n✅ Se ha activado la notificación al cliente por WhatsApp para el pedido #${codeUpper}.`;
          } else {
            aiReply += `\n❌ No pude encontrar el pedido #${codeUpper} para notificar.`;
          }
        }
      } catch (err) {
        console.error(
          "[WhatsApp Webhook] NOTIFY_NEGOTIATION parsing error:",
          err,
        );
      }
    }

    // ── Action Parsing & Execution (REPLY_CUSTOMER) ──────────────────────────────
    const replyCustomerRegex =
      /\[ACTION:REPLY_CUSTOMER\]([\s\S]*?)\[\/ACTION\]/;
    const replyCustomerMatch = rawText.match(replyCustomerRegex);
    if (replyCustomerMatch && isAdmin) {
      try {
        const actionData = JSON.parse(replyCustomerMatch[1]);
        const { phone, message } = actionData;
        if (phone && message) {
          const cleanPhone = phone.replace(/\D/g, "");
          await sendWhatsAppMessage(cleanPhone, message, WA_TOKEN);
          await addToHistory(
            cleanPhone,
            "assistant",
            message,
            `admin-reply-${Date.now()}`,
          );
          aiReply += `\n\n✅ Mensaje enviado al cliente (+${cleanPhone}).`;
          console.log(
            `[WhatsApp Webhook] Sent admin reply to ${cleanPhone}: ${message}`,
          );
        }
      } catch (err) {
        console.error("[WhatsApp Webhook] REPLY_CUSTOMER parsing error:", err);
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
            const qCode = JSON.stringify({
              method: "equal",
              attribute: "SKU",
              values: [skuCode],
            });
            const qName = JSON.stringify({
              method: "search",
              attribute: "NAME",
              values: [skuCode],
            });
            const resSku = await serverListDocuments(PRODUCTS_COLLECTION_ID, [
              qCode,
              JSON.stringify({ method: "limit", values: [1] }),
            ]);
            let foundProd = resSku.documents?.[0];

            if (!foundProd) {
              const resName = await serverListDocuments(
                PRODUCTS_COLLECTION_ID,
                [qName, JSON.stringify({ method: "limit", values: [1] })],
              );
              foundProd = resName.documents?.[0];
            }

            if (foundProd) {
              const prodLink = `${SITE_URL}/producto/${foundProd.$id}`;
              aiReply =
                `¡Aquí tienes el producto que buscas! 🐾\n*${foundProd.NAME}*\n🔗 ${prodLink}\n\n${aiReply}`.trim();
            } else {
              aiReply =
                `Mmm, busqué el código ${skuCode}, pero no logro encontrar el link exacto 🥺. ${aiReply}`.trim();
            }
          } catch (e) {
            console.error("[WhatsApp Webhook] SEARCH_SKU intercept error:", e);
          }
        }
      }
    }

    // ── Action Parsing & Execution (CREATE_ORDER) ────────────────────────────
    // Balatin crea el pedido apenas tiene los productos y el nombre del cliente (no espera dirección/comuna/región).
    // Esos datos se piden DESPUÉS, una vez el equipo confirma stock (ver ACTION:UPDATE_SHIPPING más abajo).
    if (!isAdmin) {
      const createOrderRegex = /\[ACTION:CREATE_ORDER\]([\s\S]*?)\[\/ACTION\]/;
      const createOrderMatch = rawText.match(createOrderRegex);
      if (createOrderMatch) {
        try {
          const orderData = JSON.parse(createOrderMatch[1]);
          const {
            items,
            customerName,
            customerRut,
            address,
            comuna,
            region,
            shippingAgency,
          } = orderData as {
            items: Array<{ id?: string; qty: number }>;
            customerName?: string;
            customerRut?: string;
            address?: string;
            comuna?: string;
            region?: string;
            shippingAgency?: string;
          };

          if (!Array.isArray(items) || items.length === 0 || !customerName) {
            aiReply += `\n⚠️ (Info interna: Faltan datos obligatorios (productos y/o nombre) para crear el pedido — sigue pidiéndolos al cliente).`;
          } else {
            // Resolve real product data from DB to avoid hallucinated prices/names
            const itemsData: Array<{
              id: string;
              sku: string;
              name: string;
              qty: number;
              price: number;
              total: number;
              img: string;
            }> = [];
            const notFoundItems: string[] = [];
            for (const it of items) {
              if (!it.id) continue;
              try {
                const prod: any = await serverGetDocument(
                  PRODUCTS_COLLECTION_ID,
                  it.id,
                );
                const qty = Math.max(1, Number(it.qty) || 1);
                const price = Number(prod.CURRENTPRICE || prod.PRICE || 0);
                itemsData.push({
                  id: it.id,
                  sku: prod.SKU || "",
                  name: prod.NAME || "Producto",
                  qty,
                  price,
                  total: price * qty,
                  img: prod.IMAGEURL || prod.IMAGEURL2 || prod.IMAGEURL3 || prod.IMAGEURL4 || prod.IMAGEURL5 || "",
                });
              } catch {
                notFoundItems.push(it.id);
              }
            }

            if (itemsData.length === 0) {
              aiReply += `\n⚠️ (Info interna: No pude encontrar ninguno de los productos por ID para crear el pedido).`;
            } else {
              const now = Date.now();
              const orderCode = `BAL-${String(now).slice(-8)}`;
              const docId = `bal_${now}_${Math.random().toString(36).slice(2, 10)}`;
              const total = itemsData.reduce((sum, i) => sum + i.total, 0);

              let orderIndex = now;
              try {
                const qOrderDesc = JSON.stringify({
                  method: "orderDesc",
                  attribute: "ORDERINDEX",
                });
                const qLimit1 = JSON.stringify({
                  method: "limit",
                  values: [1],
                });
                const resIdx = await serverListDocuments(ORDERS_COLLECTION_ID, [
                  qOrderDesc,
                  qLimit1,
                ]);
                if (resIdx.documents && resIdx.documents.length > 0) {
                  const doc = resIdx.documents[0] as any;
                  orderIndex = (doc.ORDERINDEX || resIdx.total || 0) + 1;
                }
              } catch {}

              await serverCreateDocument(ORDERS_COLLECTION_ID, docId, {
                USERID: "balatin-whatsapp-guest",
                ITEMS: JSON.stringify(itemsData),
                CUSTOMERNAME: customerName,
                CUSTOMERPHONE: fromPhone,
                CUSTOMERRUT: customerRut || "",
                CUSTOMEREMAIL: "",
                ORDERCODE: orderCode,
                ORDERINDEX: orderIndex,
                SUBTOTAL: total,
                TOTAL: total,
                STATUS: "pending_stock",
                CREATEDAT: now,
                PAYMENTMETHOD: "WhatsApp Balatin",
                SHIPPINGAGENCY: shippingAgency || "",
                REGION: region || "",
                COMUNA: comuna || "",
                ADDRESS: address || "",
                LINKED_WHATSAPP: [fromPhone],
              });

              // Enviar botón interactivo al verificador de stock (Lizzy) para confirmar/rechazar de un toque
              const itemsList = itemsData
                .map(
                  (i) =>
                    `- ${i.qty}x ${i.name} ($${i.total.toLocaleString("es-CL")})`,
                )
                .join("\n");
              try {
                await sendWhatsAppButtons(
                  STOCK_VERIFIER_PHONE,
                  {
                    header: "📦 Nuevo pedido de Balatin",
                    body: `Pedido *#${orderCode}*\nCliente: ${customerName} (+${fromPhone})\n\nProductos:\n${itemsList}\n\nTotal: $${total.toLocaleString("es-CL")}\n\n¿Está todo en stock?`,
                    footer: "Don Balato Iván",
                    buttons: [
                      {
                        id: `stockok:${orderCode}`,
                        title: "✅ Confirmar stock",
                      },
                      { id: `stockmiss:${orderCode}`, title: "❌ Falta stock" },
                    ],
                  },
                  WA_TOKEN,
                );
              } catch (btnErr) {
                console.error(
                  "[WhatsApp Webhook] Failed to send stock-check buttons:",
                  btnErr,
                );
                // Fallback a texto plano si fallan los botones
                await sendWhatsAppMessage(
                  STOCK_VERIFIER_PHONE,
                  ` *NUEVO PEDIDO DE BALATIN — Confirmar Stock*\n\nPedido: #${orderCode}\nCliente: ${customerName} (+${fromPhone})\n\nProductos:\n${itemsList}\n\nTotal: $${total.toLocaleString("es-CL")}\n\n👉 Si hay stock, responde "confirma el pedido #${orderCode}".\n👉 Si falta algo, dime "en el pedido #${orderCode} no hay [producto]".`,
                  WA_TOKEN,
                );
              }

              aiReply += `\n\n✅ ¡Listo! Registré tu pedido *#${orderCode}* por un total de $${total.toLocaleString("es-CL")}. Voy a confirmar el stock con el equipo y te aviso apenas esté listo para que hagas la transferencia. 🐾`;
              if (notFoundItems.length > 0) {
                aiReply += `\n(Nota: no pude agregar algunos productos, dime cuáles faltan y los reviso).`;
              }
            }
          }
        } catch (err) {
          console.error(
            "[WhatsApp Webhook] CREATE_ORDER parsing/execution error:",
            err,
          );
          aiReply += `\n❌ Hubo un error al registrar tu pedido. Por favor inténtalo de nuevo o dime si necesitas ayuda.`;
        }
      }
    }

    // ── Action Parsing & Execution (UPDATE_SHIPPING) ─────────────────────────
    // Balatin usa esto para ir completando dirección/comuna/región/agencia/RUT del pedido activo,
    // normalmente después de que el equipo confirmó stock.
    if (!isAdmin) {
      const updateShippingRegex =
        /\[ACTION:UPDATE_SHIPPING\]([\s\S]*?)\[\/ACTION\]/;
      const updateShippingMatch = rawText.match(updateShippingRegex);
      let shippingWasSaved = false;

      if (updateShippingMatch) {
        try {
          const shipData = JSON.parse(updateShippingMatch[1]);
          const {
            address,
            comuna,
            region,
            shippingAgency,
            customerRut,
            customerEmail,
            customerName: shipCustomerName,
            observations,
          } = shipData as {
            address?: string;
            comuna?: string;
            region?: string;
            shippingAgency?: string;
            customerRut?: string;
            customerEmail?: string;
            customerName?: string;
            observations?: string;
          };

          // Use balatinOrderId directly if in Balatin flow, otherwise search by phone
          let targetOrder: any = null;
          const balatinOId =
            (usage as any)._balatinOrderId || usage.balatinOrderId;
          if (balatinOId) {
            try {
              const { serverGetDocument } =
                await import("@/lib/appwrite-server");
              targetOrder = await serverGetDocument(
                ORDERS_COLLECTION_ID,
                balatinOId,
              );
            } catch (e) {
              console.warn(
                "[UPDATE_SHIPPING] Could not fetch order by balatinOrderId, falling back to phone search:",
                e,
              );
            }
          }
          if (!targetOrder) {
            const cleanedPhone = fromPhone.replace(/\D/g, "");
            const qOrderDesc = JSON.stringify({
              method: "orderDesc",
              attribute: "$createdAt",
            });
            const qPhone = JSON.stringify({
              method: "contains",
              attribute: "CUSTOMERPHONE",
              values: [cleanedPhone],
            });
            const qLimit5 = JSON.stringify({ method: "limit", values: [5] });
            const resOrders = await serverListDocuments(ORDERS_COLLECTION_ID, [
              qOrderDesc,
              qPhone,
              qLimit5,
            ]);
            const myOrders = resOrders.documents || [];
            targetOrder = myOrders.find((o: any) =>
              ["pending_stock", "paid", "payment_review"].includes(o.STATUS),
            );
          }

          if (!targetOrder) {
            aiReply += `\n⚠️ (Info interna: No encontré un pedido activo de este cliente para actualizar sus datos de envío).`;
          } else {
            const updates: Record<string, any> = {};
            if (address) updates.ADDRESS = address;
            if (comuna) updates.COMUNA = comuna;
            if (region) updates.REGION = region;
            if (shippingAgency) updates.SHIPPINGAGENCY = shippingAgency;
            if (customerRut) updates.CUSTOMERRUT = customerRut;
            if (customerEmail) updates.CUSTOMEREMAIL = customerEmail;
            if (shipCustomerName) {
              updates.CUSTOMERNAME = shipCustomerName;
              // Also save to usage for future orders
              await recordKeniaUsage(fromPhone, {
                customerName: shipCustomerName,
                isRegistered: true,
              });
            }
            if (observations) updates.OBSERVATIONS = observations;
            if (Object.keys(updates).length > 0) {
              await serverUpdateDocument(
                ORDERS_COLLECTION_ID,
                targetOrder.$id,
                updates,
              );
              shippingWasSaved = true;
            }
          }
        } catch (err) {
          console.error(
            "[WhatsApp Webhook] UPDATE_SHIPPING parsing/execution error:",
            err,
          );
        }
      }

      // ── FALLBACK: If AI showed a summary but didn't include the UPDATE_SHIPPING tag,
      //    parse the summary from aiReply and save the data anyway ──
      if (!shippingWasSaved && (usage as any)._balatinDataMode === true) {
        try {
          const balatinOId =
            (usage as any)._balatinOrderId || usage.balatinOrderId;
          if (balatinOId) {
            // Parse RUT from the AI reply
            const rutMatch = aiReply.match(/RUT[:\s]*\*?([\d.]+-[\dkK])\*?/i);
            // Parse address
            const addrMatch = aiReply.match(
              /Direcci[oó]n[:\s]*\*?([^*\n•]+)\*?/i,
            );
            // Parse comuna
            const comunaMatch = aiReply.match(/Comuna[:\s]*\*?([^*\n•]+)\*?/i);
            // Parse region
            const regionMatch = aiReply.match(
              /Regi[oó]n[:\s]*\*?([^*\n•]+)\*?/i,
            );
            // Parse agency
            const agencyMatch = aiReply.match(
              /Agencia(?:\s+de\s+env[ií]o)?[:\s]*\*?([^*\n•]+)\*?/i,
            );

            const updates: Record<string, any> = {};
            if (rutMatch) updates.CUSTOMERRUT = rutMatch[1].trim();
            if (addrMatch) updates.ADDRESS = addrMatch[1].trim();
            if (comunaMatch) updates.COMUNA = comunaMatch[1].trim();
            if (regionMatch) updates.REGION = regionMatch[1].trim();
            if (agencyMatch) updates.SHIPPINGAGENCY = agencyMatch[1].trim();

            if (Object.keys(updates).length > 0) {
              await serverUpdateDocument(
                ORDERS_COLLECTION_ID,
                balatinOId,
                updates,
              );
              console.log(
                "[UPDATE_SHIPPING Fallback] Saved from AI summary:",
                updates,
              );
            }
          }
        } catch (e) {
          console.warn(
            "[UPDATE_SHIPPING Fallback] Could not parse AI summary:",
            e,
          );
        }
      }
    }

    // Save assistant reply to history
    await addToHistory(fromPhone, "assistant", aiReply, msgId);

    if (!isAdmin) {
      const promptTokens =
        Number(usageMetadata?.promptTokenCount || 0) ||
        estimateTokensFromText(
          systemPrompt,
          ...history.map((m) => m.content),
          userText,
        );
      const responseTokens =
        Number(usageMetadata?.candidatesTokenCount || 0) ||
        estimateTokensFromText(aiReply);
      const totalTokens =
        Number(usageMetadata?.totalTokenCount || 0) ||
        promptTokens + responseTokens;
      await recordKeniaUsage(fromPhone, {
        promptTokens,
        responseTokens,
        totalTokens,
      });
    }

    // ── Send reply to WhatsApp ─────────────────────────────────────────────────
    await sendWhatsAppMessage(fromPhone, aiReply, WA_TOKEN);

    // ── Report to main admin if from customer ────────────────────────────────
    if (!isAdmin) {
      const MAIN_ADMIN_PHONE = (
        keniaConfig.adminAlertPhone || "56992139185"
      ).replace(/\D/g, "");
      const askAdminRegex = /\[ACTION:ASK_ADMIN\]([\s\S]*?)\[\/ACTION\]/;
      const askAdminMatch = rawText.match(askAdminRegex);
      const escalateRegex = /\[ACTION:ESCALATE_ADMIN\]([\s\S]*?)\[\/ACTION\]/;

      if (askAdminMatch) {
        const questionSummary =
          askAdminMatch[1]?.trim() || "Tiene una duda que no puedo responder";
        const customerNameDisp = customerName
          ? `${customerName} (+${fromPhone})`
          : `+${fromPhone}`;
        const alertMsg = `🚨 *BALATIN NECESITA AYUDA*\n\nEl cliente ${customerNameDisp} me preguntó esto y no sé qué decirle:\n"${questionSummary}"\n\n¿Qué le digo? (Respóndeme "dile que..." y yo le paso el mensaje tal cual )`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, alertMsg, WA_TOKEN);
      } else if (escalateRegex.test(rawText)) {
        // Fallback for old prompt structure
        await setKeniaBlocked(fromPhone, true, "admin_takeover");
        await recordKeniaUsage(fromPhone, { escalated: true });

        const lastMsgs = (await getHistory(fromPhone))
          .slice(-4)
          .map(
            (m) =>
              `${m.role === "user" ? "👤" : "🤖"} ${m.content.slice(0, 120)}`,
          )
          .join("\n");
        const alertMsg = `🚨 *BALATIN NECESITA AYUDA*\n\nEl cliente +${fromPhone} tiene un caso que no puedo resolver.\n\n📋 *Últimos mensajes:*\n${lastMsgs}\n\n💬 *Mi última respuesta:*\n"${aiReply.slice(0, 200)}"\n\n⚡ Balatin se desactivó para este cliente. Responde desde el panel:\n ${SITE_URL}/admin/ia/whatsapp`;
        await sendWhatsAppMessage(MAIN_ADMIN_PHONE, alertMsg, WA_TOKEN);
      } else if (keniaConfig.smartNotifications) {
        // Smart notifications: only notify on key events, not every message
        // usage (line 655) + 1 for current message (recordKeniaUsage at 1529 already incremented)
        const msgCount = (usage.messageCount || 0) + 1;
        const threshold = keniaConfig.messageThresholdForPause || 25;

        if (msgCount === 1) {
          // New conversation started
          const notifyMsg = `🆕 *Nueva conversación iniciada*\nCliente: +${fromPhone}\nMensaje: "${userText.slice(0, 150)}"\n\n🤖 Balatin está atendiendo. Te avisaré si necesito ayuda.\n ${SITE_URL}/admin/ia/whatsapp`;
          await sendWhatsAppMessage(MAIN_ADMIN_PHONE, notifyMsg, WA_TOKEN);
        } else if (
          msgCount >= threshold &&
          !usage.adminTakeover &&
          !usage.balatinOrderFlow
        ) {
          // Threshold reached — pause Balatin and ask admin what to do
          // (skip if user is in Balatin order flow — they're paying, don't interrupt)
          await setKeniaBlocked(fromPhone, true, "admin_takeover");
          const pauseMsg = `⏸️ *Conversación larga detectada*\n\nCliente: +${fromPhone}\nMensajes intercambiados: ${msgCount}\n\nHe estado conversando con esta persona por un tiempo. ¿Qué quieres que haga?\n\n *Devolver a Balatin* → responde "continuar"\n🚫 *Bloquear* → responde "bloquear"\n *Tomar control* → responde "tomar"\n\n ${SITE_URL}/admin/ia/whatsapp`;
          await sendWhatsAppMessage(MAIN_ADMIN_PHONE, pauseMsg, WA_TOKEN);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("[WhatsApp webhook] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
