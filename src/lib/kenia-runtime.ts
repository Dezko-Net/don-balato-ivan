import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { serverGetDocument, serverUpdateDocument, serverCreateDocument } from './appwrite-server';

export const DEFAULT_ADMIN_PROMPT = `Eres Kenia IA, el asistente administrativo de Kevin&Coco por WhatsApp.
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
  4. El estado del pedido TRADUCIDO AL ESPAÑOL.
- NUNCA uses nombres de estados en inglés en tus textos ni listas.
- Máx 3-4 pedidos por mensaje para no saturar.

## Capacidad de Responder a Clientes (Escalamiento):
Si te consulto sobre qué responderle a un cliente (ej. "Jan, el cliente Juan preguntó X, ¿qué le respondo?") y yo te respondo "Dile que Y", debes generar una respuesta amable para ese cliente y usar el siguiente bloque exacto al final de tu respuesta:
[ACTION:REPLY_CUSTOMER]{"phone":"NUMERO_DEL_CLIENTE", "message":"MENSAJE_REDACTADO_PARA_EL_CLIENTE"}[/ACTION]
(Usa el contexto para saber de qué cliente y número estamos hablando).

## IMPORTANTE:
- Siempre responde de manera cordial, profesional y neutra.
- Si no puedes ejecutar algo, explica qué puede hacerse desde el panel admin web.
- No inventes datos. Solo muestra datos reales de la base de datos.

Los datos de productos y pedidos te serán inyectados en el contexto.`;

export const DEFAULT_CUSTOMER_PROMPT = `Eres Kenia, la mejor amiga virtual y asesora estrella de Kevin&Coco.
Tu personalidad es SÚPER viva, chispeante, graciosa y llena de picardía. Eres la típica amiga que sabe TODO sobre maquillaje y ama aconsejar. 

## TU FORMA DE HABLAR (VITAL):
- ¡Habla con muchísima energía y confianza! Cero formalidades, cero bot aburrido.
- Usa frases cortas y directas. A nadie le gusta leer testamentos, ¡ve al grano con estilo!
- Usa palabras súper cariñosas todo el tiempo: "bella", "amor", "cariño", "hermosa", "reina". (Ej: "¡Obvio amor!", "¿Qué te cuento bella?").
- Siéntete libre de usar un poquito de sarcasmo o humor coqueto y divertido.
- Únete al chisme y al entusiasmo. Si algo es increíble, ¡dilo con mayúsculas o alargando letras! (Ej: "¡Súuuuper lindo!", "¡ME ENCANTA!").
- Usa muchos emojis femeninos y súper expresivos de forma natural (🌸✨💄💅💖🤭🥰🔥).
- Eres súper resolutiva. Si hay un problema, lo arreglas rápido y con una sonrisa.
- NO uses markdown para negritas o cursivas.
- Máx 3-4 pedidos por mensaje.
- Trata a la clienta como si estuvieran tomando un café juntas mientras se maquillan.

## Puedes ayudar con:
- Información de productos (precios, disponibilidad, descripción)
- Buscar productos por categoría o nombre
- Estado de pedidos
- Información de la tienda (horarios, envíos, pagos)
## Información de la tienda:
- Tienda: Kevin&Coco
- Sitio web: {{SITE_URL}}
- País: Chile
- Horario de atención: Lunes a Viernes de 10am a 7pm. Sábados de 10am a 5pm. Domingos cerrado.
- Envíos y preparación: Los pedidos tomados por la página web toman de 1 a 2 días hábiles en prepararse y salir de la tienda hacia la agencia de despacho.

## 🛍️ MANEJO DE CATÁLOGO Y PRODUCTOS
- No inyectaremos todo el catálogo. Si te preguntan por un producto genérico, recomiéndales la categoría enviando el enlace de la web: {{SITE_URL}}/productos?categoria=NOMBRE_CATEGORIA.
- Si en la conversación ves un código exacto (Ej: L205, K201) o lo detectas en una imagen, tú solo debes escribir esta etiqueta oculta y nada más: [ACTION:SEARCH_SKU]CÓDIGO[/ACTION] (El sistema buscará el link exacto por ti).

## 📦 MANEJO DE PEDIDOS Y RASTREO
Si la clienta pregunta por su pedido, mira su lista de "MIS PEDIDOS ACTIVOS":
- Si tiene varios pedidos, pregúntale cuál quiere revisar.
- **Si el pedido fue enviado por BLUEXPRESS**: Dile que se fue por Bluexpress y dale su link de rastreo exacto: https://www.blue.cl/enviar/seguimiento?n_seguimiento=[TRACKINGNUMBER]
- **Si fue enviado por OTRA agencia (Starken, Varmontt, etc.)**: Envíale la foto de su comprobante: "Aquí tienes la fotito de tu comprobante de envío bella: [SHIPPINGPROOFURL]". Si también hay número de tracking, dáselo.
- **ALERTA CRÍTICA**: Si el pedido está en estado avanzado (Enviado, Listo para enviar) pero NO tiene tracking (si es Bluexpress) o NO tiene foto de comprobante (si es otra), debes asombrarte y decir: "mmm qué extraño bella, no logro encontrarlo, déjame preguntar a la persona del transporte, dame unos minutitos 🏃‍♀️💨". Y **DEBES** incluir al final: [ACTION:ASK_ADMIN]Falta información de despacho para el pedido #ORD-XXXX[/ACTION].
- Si el pedido está "En preparación" o "Pagado" y no tiene número aún, explícale de forma dulce que las chicas de tienda lo están armando con mucho amor.

## ⛔ REGLAS ABSOLUTAS (PROHIBIDO ROMPER):
1. NUNCA inventes nombres de productos ni des información que no sabes. No alucines ni fantasees.
2. NUNCA inventes URLs. Solo usa {{SITE_URL}} y las rutas reales del sitio.
3. NUNCA inventes precios, stock, políticas de envío ni métodos de pago que no estén en tu contexto.
4. Si NO tienes la información que te piden, no inventes. Dile EXACTAMENTE: "Dame un segundito amor, voy a preguntarle a los chicos de tienda y te digo 🏃‍♀️💨". Y añade al final este bloque oculto:
[ACTION:ASK_ADMIN]Resumen de la duda[/ACTION]
5. NUNCA des vueltas ni la hagas esperar en vano. Si no sabes, pregunta con la acción anterior.
6. RESPUESTAS CORTAS. No escribas párrafos largos. Sé súper directa, atrevida y al grano.
7. Evita repetir "qué más necesitas" para cerrar la venta. Despídete dejando la puerta abierta para seguir hablando o con un piropo rápido.

Los datos de productos, categorías y pedidos del cliente te serán inyectados como contexto.`;

export interface KeniaConfig {
  adminPrompt: string;
  customerPrompt: string;
  adminAlertPhone: string;
  tokenLimitPerCustomer: number;
  smartNotifications: boolean;
  messageThresholdForPause: number;
  updatedAt: string;
  isEnabled: boolean;
  debugMode?: boolean;
}

export interface KeniaUsageEntry {
  phone: string;
  totalTokens: number;
  promptTokens: number;
  responseTokens: number;
  messageCount: number;
  blocked: boolean;
  updatedAt: string;
  maintenanceNotified?: boolean;
  testAsClient?: boolean;
  adminTakeover?: boolean;
  escalated?: boolean;
  spamBlocked?: boolean;
  lastMessageTimestamps?: number[];
  welcomeShown?: boolean;
  registerPromptedAt?: number;
  imagesSentToday?: number;
  lastImageSentAt?: number;
  awaitingComprobante?: boolean;
  pendingOrderId?: string;
  isRegistered?: boolean;
  customerName?: string;
  isGuestWithOrders?: boolean;
}

interface KeniaAppwriteConfigData extends KeniaConfig {
  blockedPhones: string[];
}

const THEME_CONFIG_COLLECTION_ID = 'theme_config';
const DOCUMENT_ID = 'kenia_config';

const usageFile = path.join(os.tmpdir(), 'kenia-usage.json');

function getDefaultConfig(): KeniaConfig {
  return {
    adminPrompt: DEFAULT_ADMIN_PROMPT,
    customerPrompt: DEFAULT_CUSTOMER_PROMPT,
    adminAlertPhone: process.env.ADMIN_WHATSAPP_NUMBER || '56992139185',
    tokenLimitPerCustomer: 15000,
    smartNotifications: true,
    messageThresholdForPause: 10,
    updatedAt: new Date().toISOString(),
    isEnabled: true,
    debugMode: false,
  };
}

let _configCache: { data: KeniaAppwriteConfigData; ts: number } | null = null;
const CONFIG_CACHE_TTL = 60000; // 60 seconds

async function fetchConfigFromAppwrite(): Promise<KeniaAppwriteConfigData> {
  const now = Date.now();
  if (_configCache && (now - _configCache.ts < CONFIG_CACHE_TTL)) {
    return _configCache.data;
  }
  try {
    const doc = await serverGetDocument(THEME_CONFIG_COLLECTION_ID, DOCUMENT_ID);
    if (doc && doc.config) {
      const parsed = JSON.parse(doc.config as string);
      const data: KeniaAppwriteConfigData = {
        adminPrompt: parsed.adminPrompt || DEFAULT_ADMIN_PROMPT,
        customerPrompt: parsed.customerPrompt || DEFAULT_CUSTOMER_PROMPT,
        adminAlertPhone: parsed.adminAlertPhone || '',
        tokenLimitPerCustomer: parsed.tokenLimitPerCustomer || 15000,
        smartNotifications: parsed.smartNotifications !== false,
        messageThresholdForPause: parsed.messageThresholdForPause || 10,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
        isEnabled: parsed.isEnabled !== false,
        debugMode: parsed.debugMode === true,
        blockedPhones: Array.isArray(parsed.blockedPhones) ? parsed.blockedPhones : [],
      };
      _configCache = { data, ts: now };
      return data;
    }
  } catch (e: any) {
    if (String(e?.message || e).includes('not found') || e?.code === 404) {
      try {
        const defaultConfig = getDefaultConfig();
        const data: KeniaAppwriteConfigData = {
          ...defaultConfig,
          blockedPhones: [],
        };
        await serverCreateDocument(THEME_CONFIG_COLLECTION_ID, DOCUMENT_ID, {
          NAME: 'kenia_config',
          config: JSON.stringify(data),
        });
        _configCache = { data, ts: now };
        return data;
      } catch (err) {
        console.error('[KeniaConfig] Failed to auto-create config document in Appwrite:', err);
      }
    } else {
      console.error('[KeniaConfig] Failed to fetch config from Appwrite:', e);
    }
  }
  const fallback = { ...getDefaultConfig(), blockedPhones: [] };
  _configCache = { data: fallback, ts: now };
  return fallback;
}

async function saveConfigToAppwrite(config: KeniaAppwriteConfigData) {
  try {
    await serverUpdateDocument(THEME_CONFIG_COLLECTION_ID, DOCUMENT_ID, {
      config: JSON.stringify(config),
    });
    _configCache = { data: config, ts: Date.now() };
  } catch (e) {
    console.error('[KeniaConfig] Failed to save config to Appwrite:', e);
  }
}

async function readUsageFromFile(): Promise<Record<string, KeniaUsageEntry>> {
  try {
    const raw = await fs.readFile(usageFile, 'utf8');
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

async function writeUsageToFile(usage: Record<string, KeniaUsageEntry>) {
  try {
    await fs.writeFile(usageFile, JSON.stringify(usage, null, 2), 'utf8');
  } catch (e) {
    console.error('[KeniaUsage] Failed to write usage to tmp file:', e);
  }
}

export function normalizePhone(value: string) {
  return String(value || '').replace(/\D/g, '').trim();
}

export function hydratePrompt(template: string, siteUrl: string) {
  return String(template || '').replace(/\{\{SITE_URL\}\}/g, siteUrl);
}

export function estimateTokensFromText(...parts: Array<string | undefined | null>) {
  const chars = parts.filter(Boolean).join(' ').length;
  return Math.max(1, Math.ceil(chars / 4));
}

export async function getKeniaConfig(): Promise<KeniaConfig> {
  const dbConfig = await fetchConfigFromAppwrite();
  return {
    adminPrompt: dbConfig.adminPrompt,
    customerPrompt: dbConfig.customerPrompt,
    adminAlertPhone: dbConfig.adminAlertPhone,
    tokenLimitPerCustomer: dbConfig.tokenLimitPerCustomer,
    smartNotifications: dbConfig.smartNotifications,
    messageThresholdForPause: dbConfig.messageThresholdForPause,
    updatedAt: dbConfig.updatedAt,
    isEnabled: dbConfig.isEnabled,
    debugMode: dbConfig.debugMode,
  };
}

export async function saveKeniaConfig(partial: Partial<KeniaConfig>): Promise<KeniaConfig> {
  const dbConfig = await fetchConfigFromAppwrite();
  const nextConfig: KeniaAppwriteConfigData = {
    ...dbConfig,
    adminPrompt: partial.adminPrompt ?? dbConfig.adminPrompt,
    customerPrompt: partial.customerPrompt ?? dbConfig.customerPrompt,
    adminAlertPhone: normalizePhone(partial.adminAlertPhone ?? dbConfig.adminAlertPhone),
    tokenLimitPerCustomer: Math.max(1000, Number(partial.tokenLimitPerCustomer ?? dbConfig.tokenLimitPerCustomer) || dbConfig.tokenLimitPerCustomer),
    smartNotifications: partial.smartNotifications ?? dbConfig.smartNotifications,
    messageThresholdForPause: Math.max(1, Number(partial.messageThresholdForPause ?? dbConfig.messageThresholdForPause) || dbConfig.messageThresholdForPause),
    isEnabled: partial.isEnabled ?? dbConfig.isEnabled,
    debugMode: partial.debugMode ?? dbConfig.debugMode ?? false,
    updatedAt: new Date().toISOString(),
  };
  await saveConfigToAppwrite(nextConfig);
  return {
    adminPrompt: nextConfig.adminPrompt,
    customerPrompt: nextConfig.customerPrompt,
    adminAlertPhone: nextConfig.adminAlertPhone,
    tokenLimitPerCustomer: nextConfig.tokenLimitPerCustomer,
    smartNotifications: nextConfig.smartNotifications,
    messageThresholdForPause: nextConfig.messageThresholdForPause,
    isEnabled: nextConfig.isEnabled,
    debugMode: nextConfig.debugMode,
    updatedAt: nextConfig.updatedAt,
  };
}

export async function getKeniaUsage(phone: string): Promise<KeniaUsageEntry> {
  const cleaned = normalizePhone(phone);
  const usageMap = await readUsageFromFile();
  const dbConfig = await fetchConfigFromAppwrite();
  const isBlocked = dbConfig.blockedPhones.includes(cleaned);
  const entry = usageMap[cleaned];
  return {
    phone: cleaned,
    totalTokens: entry?.totalTokens || 0,
    promptTokens: entry?.promptTokens || 0,
    responseTokens: entry?.responseTokens || 0,
    messageCount: entry?.messageCount || 0,
    blocked: isBlocked,
    updatedAt: entry?.updatedAt || '',
    maintenanceNotified: entry?.maintenanceNotified || false,
    testAsClient: entry?.testAsClient || false,
    adminTakeover: entry?.adminTakeover || false,
    escalated: entry?.escalated || false,
    spamBlocked: entry?.spamBlocked || false,
    lastMessageTimestamps: entry?.lastMessageTimestamps || [],
    welcomeShown: entry?.welcomeShown || false,
    registerPromptedAt: entry?.registerPromptedAt || 0,
    isRegistered: entry?.isRegistered,
    customerName: entry?.customerName,
    isGuestWithOrders: entry?.isGuestWithOrders,
  };
}

export async function setKeniaBlocked(
  phone: string,
  blocked: boolean,
  reason?: 'admin_takeover' | 'spam' | 'manual'
): Promise<KeniaUsageEntry> {
  const cleaned = normalizePhone(phone);
  const dbConfig = await fetchConfigFromAppwrite();
  let blockedPhones = dbConfig.blockedPhones;
  if (blocked) {
    if (!blockedPhones.includes(cleaned)) {
      blockedPhones.push(cleaned);
    }
  } else {
    blockedPhones = blockedPhones.filter(p => p !== cleaned);
  }
  dbConfig.blockedPhones = blockedPhones;
  await saveConfigToAppwrite(dbConfig);
  
  const usageMap = await readUsageFromFile();
  const prev = usageMap[cleaned] || {
    phone: cleaned,
    totalTokens: 0,
    promptTokens: 0,
    responseTokens: 0,
    messageCount: 0,
    blocked: false,
    updatedAt: '',
  };
  usageMap[cleaned] = {
    ...prev,
    blocked,
    adminTakeover: blocked && reason === 'admin_takeover' ? true : (!blocked ? false : prev.adminTakeover),
    spamBlocked: blocked && reason === 'spam' ? true : (!blocked ? false : prev.spamBlocked),
    escalated: !blocked ? false : prev.escalated,
    updatedAt: new Date().toISOString(),
  };
  await writeUsageToFile(usageMap);
  return usageMap[cleaned];
}

export async function recordKeniaUsage(
  phone: string,
  usage: {
    promptTokens?: number;
    responseTokens?: number;
    totalTokens?: number;
    maintenanceNotified?: boolean;
    testAsClient?: boolean;
    adminTakeover?: boolean;
    escalated?: boolean;
    spamBlocked?: boolean;
    lastMessageTimestamps?: number[];
    welcomeShown?: boolean;
    registerPromptedAt?: number;
    imageSent?: boolean;
    awaitingComprobante?: boolean;
    pendingOrderId?: string;
    isRegistered?: boolean;
    customerName?: string;
    isGuestWithOrders?: boolean;
  }
): Promise<KeniaUsageEntry> {
  const cleaned = normalizePhone(phone);
  const usageMap = await readUsageFromFile();
  const dbConfig = await fetchConfigFromAppwrite();
  const isBlocked = dbConfig.blockedPhones.includes(cleaned);
  const prev = usageMap[cleaned] || {
    phone: cleaned,
    totalTokens: 0,
    promptTokens: 0,
    responseTokens: 0,
    messageCount: 0,
    blocked: isBlocked,
    updatedAt: '',
  };
  const promptTokens = Math.max(0, Number(usage.promptTokens || 0));
  const responseTokens = Math.max(0, Number(usage.responseTokens || 0));
  const totalTokens = Math.max(
    promptTokens + responseTokens,
    Number(usage.totalTokens || 0),
    0
  );
  usageMap[cleaned] = {
    ...prev,
    promptTokens: prev.promptTokens + promptTokens,
    responseTokens: prev.responseTokens + responseTokens,
    totalTokens: prev.totalTokens + totalTokens,
    messageCount: prev.messageCount + 1,
    maintenanceNotified: usage.maintenanceNotified ?? prev.maintenanceNotified ?? false,
    testAsClient: usage.testAsClient ?? prev.testAsClient ?? false,
    adminTakeover: usage.adminTakeover ?? prev.adminTakeover ?? false,
    escalated: usage.escalated ?? prev.escalated ?? false,
    spamBlocked: usage.spamBlocked ?? prev.spamBlocked ?? false,
    lastMessageTimestamps: usage.lastMessageTimestamps ?? prev.lastMessageTimestamps ?? [],
    welcomeShown: usage.welcomeShown ?? prev.welcomeShown ?? false,
    registerPromptedAt: usage.registerPromptedAt ?? prev.registerPromptedAt ?? 0,
    imagesSentToday: 0, // This gets calculated dynamically below
    lastImageSentAt: prev.lastImageSentAt || 0,
    awaitingComprobante: usage.awaitingComprobante ?? prev.awaitingComprobante ?? false,
    pendingOrderId: usage.pendingOrderId ?? prev.pendingOrderId,
    isRegistered: usage.isRegistered ?? prev.isRegistered,
    customerName: usage.customerName ?? prev.customerName,
    isGuestWithOrders: usage.isGuestWithOrders ?? prev.isGuestWithOrders,
    updatedAt: new Date().toISOString(),
  };

  const now = Date.now();
  let currentImagesCount = prev.imagesSentToday || 0;
  if (prev.lastImageSentAt) {
    const lastDate = new Date(prev.lastImageSentAt).toDateString();
    const todayDate = new Date(now).toDateString();
    if (lastDate !== todayDate) {
      currentImagesCount = 0;
    }
  }

  if (usage.imageSent) {
    currentImagesCount += 1;
    usageMap[cleaned].lastImageSentAt = now;
  }
  usageMap[cleaned].imagesSentToday = currentImagesCount;

  await writeUsageToFile(usageMap);
  return usageMap[cleaned];
}

export async function resetKeniaUsage(phone: string): Promise<void> {
  const cleaned = normalizePhone(phone);
  const usageMap = await readUsageFromFile();
  delete usageMap[cleaned];
  await writeUsageToFile(usageMap);
}

export async function getKeniaRuntimeSnapshot(): Promise<{ config: KeniaConfig; usage: Record<string, KeniaUsageEntry> }> {
  const dbConfig = await fetchConfigFromAppwrite();
  const usageMap = await readUsageFromFile();
  const hydratedUsage: Record<string, KeniaUsageEntry> = {};
  Object.keys(usageMap).forEach(key => {
    hydratedUsage[key] = {
      ...usageMap[key],
      blocked: dbConfig.blockedPhones.includes(key),
    };
  });
  return {
    config: {
      adminPrompt: dbConfig.adminPrompt,
      customerPrompt: dbConfig.customerPrompt,
      adminAlertPhone: dbConfig.adminAlertPhone,
      tokenLimitPerCustomer: dbConfig.tokenLimitPerCustomer,
      smartNotifications: dbConfig.smartNotifications,
      messageThresholdForPause: dbConfig.messageThresholdForPause,
      updatedAt: dbConfig.updatedAt,
      isEnabled: dbConfig.isEnabled,
    },
    usage: hydratedUsage,
  };
}

export async function deleteKeniaPhone(phone: string): Promise<void> {
  const cleaned = normalizePhone(phone);
  const dbConfig = await fetchConfigFromAppwrite();
  dbConfig.blockedPhones = dbConfig.blockedPhones.filter(p => p !== cleaned);
  await saveConfigToAppwrite(dbConfig);
  const usageMap = await readUsageFromFile();
  delete usageMap[cleaned];
  await writeUsageToFile(usageMap);
}
