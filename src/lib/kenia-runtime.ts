import 'server-only';

import fs from 'fs/promises';
import path from 'path';

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
}

export interface KeniaUsageEntry {
  phone: string;
  totalTokens: number;
  promptTokens: number;
  responseTokens: number;
  messageCount: number;
  blocked: boolean;
  updatedAt: string;
}

interface KeniaRuntimeFile {
  config: KeniaConfig;
  usage: Record<string, KeniaUsageEntry>;
}

const runtimeDir = path.join(process.cwd(), 'data');
const runtimeFile = path.join(runtimeDir, 'kenia-runtime.json');

function getDefaultConfig(): KeniaConfig {
  return {
    adminPrompt: DEFAULT_ADMIN_PROMPT,
    customerPrompt: DEFAULT_CUSTOMER_PROMPT,
    adminAlertPhone: process.env.ADMIN_WHATSAPP_NUMBER || '56992139185',
    tokenLimitPerCustomer: 15000,
    notifyOnEveryCustomerMessage: true,
    updatedAt: new Date().toISOString(),
  };
}

function getDefaultRuntime(): KeniaRuntimeFile {
  return {
    config: getDefaultConfig(),
    usage: {},
  };
}

async function ensureRuntimeFile() {
  await fs.mkdir(runtimeDir, { recursive: true });
  try {
    await fs.access(runtimeFile);
  } catch {
    await fs.writeFile(runtimeFile, JSON.stringify(getDefaultRuntime(), null, 2), 'utf8');
  }
}

async function readRuntime(): Promise<KeniaRuntimeFile> {
  await ensureRuntimeFile();
  try {
    const raw = await fs.readFile(runtimeFile, 'utf8');
    const parsed = JSON.parse(raw) as Partial<KeniaRuntimeFile>;
    return {
      config: { ...getDefaultConfig(), ...(parsed.config || {}) },
      usage: parsed.usage || {},
    };
  } catch {
    const fallback = getDefaultRuntime();
    await fs.writeFile(runtimeFile, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

async function writeRuntime(runtime: KeniaRuntimeFile) {
  await ensureRuntimeFile();
  await fs.writeFile(runtimeFile, JSON.stringify(runtime, null, 2), 'utf8');
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

export async function getKeniaConfig() {
  const runtime = await readRuntime();
  return runtime.config;
}

export async function saveKeniaConfig(partial: Partial<KeniaConfig>) {
  const runtime = await readRuntime();
  runtime.config = {
    ...runtime.config,
    ...partial,
    adminAlertPhone: normalizePhone(partial.adminAlertPhone ?? runtime.config.adminAlertPhone),
    tokenLimitPerCustomer: Math.max(1000, Number(partial.tokenLimitPerCustomer ?? runtime.config.tokenLimitPerCustomer) || runtime.config.tokenLimitPerCustomer),
    updatedAt: new Date().toISOString(),
  };
  await writeRuntime(runtime);
  return runtime.config;
}

export async function getKeniaUsage(phone: string) {
  const cleaned = normalizePhone(phone);
  const runtime = await readRuntime();
  return runtime.usage[cleaned] || {
    phone: cleaned,
    totalTokens: 0,
    promptTokens: 0,
    responseTokens: 0,
    messageCount: 0,
    blocked: false,
    updatedAt: '',
  };
}

export async function setKeniaBlocked(phone: string, blocked: boolean) {
  const cleaned = normalizePhone(phone);
  const runtime = await readRuntime();
  const prev = runtime.usage[cleaned] || {
    phone: cleaned,
    totalTokens: 0,
    promptTokens: 0,
    responseTokens: 0,
    messageCount: 0,
    blocked: false,
    updatedAt: '',
  };
  runtime.usage[cleaned] = {
    ...prev,
    blocked,
    updatedAt: new Date().toISOString(),
  };
  await writeRuntime(runtime);
  return runtime.usage[cleaned];
}

export async function recordKeniaUsage(
  phone: string,
  usage: { promptTokens?: number; responseTokens?: number; totalTokens?: number }
) {
  const cleaned = normalizePhone(phone);
  const runtime = await readRuntime();
  const prev = runtime.usage[cleaned] || {
    phone: cleaned,
    totalTokens: 0,
    promptTokens: 0,
    responseTokens: 0,
    messageCount: 0,
    blocked: false,
    updatedAt: '',
  };
  const promptTokens = Math.max(0, Number(usage.promptTokens || 0));
  const responseTokens = Math.max(0, Number(usage.responseTokens || 0));
  const totalTokens = Math.max(
    promptTokens + responseTokens,
    Number(usage.totalTokens || 0),
    0
  );
  runtime.usage[cleaned] = {
    ...prev,
    promptTokens: prev.promptTokens + promptTokens,
    responseTokens: prev.responseTokens + responseTokens,
    totalTokens: prev.totalTokens + totalTokens,
    messageCount: prev.messageCount + 1,
    updatedAt: new Date().toISOString(),
  };
  await writeRuntime(runtime);
  return runtime.usage[cleaned];
}

export async function getKeniaRuntimeSnapshot() {
  return readRuntime();
}
