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

## IMPORTANTE:
- Siempre responde en español chileno, amigable y profesional.
- Si no puedes ejecutar algo, explica qué puede hacerse desde el panel admin web.
- No inventes datos. Solo muestra datos reales de la base de datos.

Los datos de productos y pedidos te serán inyectados en el contexto.`;

export const DEFAULT_CUSTOMER_PROMPT = `Eres Kenia, asesora de ventas y experta en maquillaje de la tienda Kevin&Coco en Chile.
Eres súper carismática, amable y hablas como una vendedora experta en belleza (usa expresiones como "linda", "hermosa", "bella", etc.). Hablas en español chileno natural.
¡NUNCA digas que eres un asistente virtual o un bot! Actúa 100% como una persona real del equipo de ventas.

## Puedes ayudar con:
- Información de productos (precios, disponibilidad, descripción)
- Buscar productos por categoría o nombre
- Estado de pedidos
- Información de la tienda (horarios, envíos, pagos)
- Reemplazo de productos sin stock (Negociación)

## Negociación de productos faltantes:
Si el cliente te habla sobre su pedido y en el contexto ves que su pedido está en estado "negotiation" y tiene productos faltantes:
1. Dile de forma muy carismática y natural que lamentablemente nos quedamos sin stock de esos productos específicos.
2. Explícale que puede reemplazarlos ella misma entrando a los detalles de su pedido desde la página web, o si lo prefiere, tú misma puedes ayudarla a elegir y hacer los cambios por aquí en el chat.
3. Pregúntale qué prefiere.
4. Solo si ella te dice explícitamente que prefiere hacerlo ella misma por la web, le envías su enlace: {{SITE_URL}}/pedido/ID_DEL_PEDIDO.
5. Si ella te dice que la ayudes tú, muéstrale alternativas disponibles del catálogo y ayúdala a decidir.

## Información de la tienda:
- Tienda: Kevin&Coco
- Sitio web: {{SITE_URL}}
- País: Chile

## Reglas:
- NUNCA inventes precios ni stock. Solo di lo que está en los datos reales.
- Sé cálida, cercana y carismática. Evita respuestas muy largas o robóticas.
- Siempre termina con una pregunta o invitación para seguir la conversación.
- Si hay un problema muy grande que no puedes resolver o manejar con el cliente, dile al cliente amablemente que escalarás el caso al administrador principal para que lo resuelva, y DEBES añadir al final de tu respuesta EXACTAMENTE este bloque JSON oculto: [ACTION:ESCALATE_ADMIN][/ACTION]

Los datos de productos y pedidos del cliente te serán inyectados como contexto.`;

export interface KeniaConfig {
  adminPrompt: string;
  customerPrompt: string;
  adminAlertPhone: string;
  tokenLimitPerCustomer: number;
  notifyOnEveryCustomerMessage: boolean;
  updatedAt: string;
  isEnabled: boolean;
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
    notifyOnEveryCustomerMessage: true,
    updatedAt: new Date().toISOString(),
    isEnabled: true,
  };
}

async function fetchConfigFromAppwrite(): Promise<KeniaAppwriteConfigData> {
  try {
    const doc = await serverGetDocument(THEME_CONFIG_COLLECTION_ID, DOCUMENT_ID);
    if (doc && doc.config) {
      const parsed = JSON.parse(doc.config as string);
      return {
        adminPrompt: parsed.adminPrompt || DEFAULT_ADMIN_PROMPT,
        customerPrompt: parsed.customerPrompt || DEFAULT_CUSTOMER_PROMPT,
        adminAlertPhone: parsed.adminAlertPhone || '',
        tokenLimitPerCustomer: parsed.tokenLimitPerCustomer || 15000,
        notifyOnEveryCustomerMessage: parsed.notifyOnEveryCustomerMessage !== false,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
        isEnabled: parsed.isEnabled !== false,
        blockedPhones: Array.isArray(parsed.blockedPhones) ? parsed.blockedPhones : [],
      };
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
        return data;
      } catch (err) {
        console.error('[KeniaConfig] Failed to auto-create config document in Appwrite:', err);
      }
    } else {
      console.error('[KeniaConfig] Failed to fetch config from Appwrite:', e);
    }
  }
  return { ...getDefaultConfig(), blockedPhones: [] };
}

async function saveConfigToAppwrite(config: KeniaAppwriteConfigData) {
  try {
    await serverUpdateDocument(THEME_CONFIG_COLLECTION_ID, DOCUMENT_ID, {
      config: JSON.stringify(config),
    });
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
    notifyOnEveryCustomerMessage: dbConfig.notifyOnEveryCustomerMessage,
    updatedAt: dbConfig.updatedAt,
    isEnabled: dbConfig.isEnabled,
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
    notifyOnEveryCustomerMessage: partial.notifyOnEveryCustomerMessage ?? dbConfig.notifyOnEveryCustomerMessage,
    isEnabled: partial.isEnabled ?? dbConfig.isEnabled,
    updatedAt: new Date().toISOString(),
  };
  await saveConfigToAppwrite(nextConfig);
  return {
    adminPrompt: nextConfig.adminPrompt,
    customerPrompt: nextConfig.customerPrompt,
    adminAlertPhone: nextConfig.adminAlertPhone,
    tokenLimitPerCustomer: nextConfig.tokenLimitPerCustomer,
    notifyOnEveryCustomerMessage: nextConfig.notifyOnEveryCustomerMessage,
    isEnabled: nextConfig.isEnabled,
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
  };
}

export async function setKeniaBlocked(phone: string, blocked: boolean): Promise<KeniaUsageEntry> {
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
    updatedAt: new Date().toISOString(),
  };
  await writeUsageToFile(usageMap);
  return usageMap[cleaned];
}

export async function recordKeniaUsage(
  phone: string,
  usage: { promptTokens?: number; responseTokens?: number; totalTokens?: number; maintenanceNotified?: boolean; testAsClient?: boolean }
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
    updatedAt: new Date().toISOString(),
  };
  await writeUsageToFile(usageMap);
  return usageMap[cleaned];
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
      notifyOnEveryCustomerMessage: dbConfig.notifyOnEveryCustomerMessage,
      updatedAt: dbConfig.updatedAt,
      isEnabled: dbConfig.isEnabled,
    },
    usage: hydratedUsage,
  };
}
