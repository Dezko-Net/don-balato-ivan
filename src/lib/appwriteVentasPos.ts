// src/lib/appwriteVentasPos.ts
// Servicio para ventas_pos, caja_sesiones y cortes_caja en Appwrite
import { getServices, ID, Query } from '@/lib/appwrite'

export const VENTAS_POS_COLLECTION = 'ventas_pos'
export const CAJA_SESIONES_COLLECTION = 'caja_sesiones'
export const CORTES_CAJA_COLLECTION = 'cortes_caja'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28'

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface VentaItem {
  sku: string
  nombre: string
  cantidad: number
  precioUnitario: number
  costoUnitario: number
  descuentoPct: number
  subtotal: number
}

export interface VentaPago {
  metodo: string
  monto: number
}

export interface VentaPOSAppwrite {
  $id: string
  sede: string
  cajeroNombre: string
  sesionCajaId: string
  fechaStr: string
  fechaTs: number
  items: VentaItem[]
  pagos: VentaPago[]
  subtotal: number
  descuentoGlobalPct: number
  descuentoGlobal: number
  total: number
  vuelto: number
  estado: string
  modoVenta: string
  tipoComprobante: string
  boletaNumero: number
  debitoOrdenNumero: number | null
  cobradoPorJefe: boolean
  jefeNombre: string
  cobradaEnTs: number | null
  anuladaEnTs: number | null
  anuladaPor: string
  motivoAnulacion: string
  createdAtTs: number
}

export interface SesionCajaAppwrite {
  $id: string
  sede: string
  cajeroNombre: string
  estado: string
  montoApertura: number
  ventasCount: number
  totalVentas: number
  totalEfectivo: number
  totalDebito: number
  totalTransferencia: number
  aperturaAtTs: number
  cierreAtTs: number | null
  montoCierre: number | null
  fechaStr: string
}

// ─── Serialización ───────────────────────────────────────────────────────────

function serializeVenta(data: any): any {
  const now = Date.now()
  return {
    sede: String(data.sede || ''),
    cajeroNombre: String(data.cajeroNombre || ''),
    sesionCajaId: String(data.sesionCajaId || ''),
    fechaStr: String(data.fechaStr || ''),
    fechaTs: data.fechaTs || now,
    itemsJson: JSON.stringify(data.items || []),
    pagosJson: JSON.stringify(data.pagos || []),
    subtotal: Number(data.subtotal || 0),
    descuentoGlobalPct: Number(data.descuentoGlobalPct || 0),
    descuentoGlobal: Number(data.descuentoGlobal || 0),
    total: Number(data.total || 0),
    vuelto: Number(data.vuelto || 0),
    estado: String(data.estado || 'completada'),
    modoVenta: String(data.modoVenta || ''),
    tipoComprobante: String(data.tipoComprobante || 'comprobante'),
    boletaNumero: Number(data.boletaNumero || 0),
    debitoOrdenNumero: data.debitoOrdenNumero != null ? Number(data.debitoOrdenNumero) : null,
    cobradoPorJefe: !!data.cobradoPorJefe,
    jefeNombre: String(data.jefeNombre || ''),
    cobradaEnTs: data.cobradaEnTs || null,
    anuladaEnTs: data.anuladaEnTs || null,
    anuladaPor: String(data.anuladaPor || ''),
    motivoAnulacion: String(data.motivoAnulacion || ''),
    createdAtTs: data.createdAtTs || now,
  }
}

function deserializeVenta(d: any): VentaPOSAppwrite {
  let items: VentaItem[] = []
  let pagos: VentaPago[] = []
  try { items = JSON.parse(d.itemsJson || '[]') } catch {}
  try { pagos = JSON.parse(d.pagosJson || '[]') } catch {}
  return {
    $id: d.$id,
    sede: String(d.sede || ''),
    cajeroNombre: String(d.cajeroNombre || ''),
    sesionCajaId: String(d.sesionCajaId || ''),
    fechaStr: String(d.fechaStr || ''),
    fechaTs: Number(d.fechaTs || 0),
    items,
    pagos,
    subtotal: Number(d.subtotal || 0),
    descuentoGlobalPct: Number(d.descuentoGlobalPct || 0),
    descuentoGlobal: Number(d.descuentoGlobal || 0),
    total: Number(d.total || 0),
    vuelto: Number(d.vuelto || 0),
    estado: String(d.estado || 'completada'),
    modoVenta: String(d.modoVenta || ''),
    tipoComprobante: String(d.tipoComprobante || 'comprobante'),
    boletaNumero: Number(d.boletaNumero || 0),
    debitoOrdenNumero: d.debitoOrdenNumero != null ? Number(d.debitoOrdenNumero) : null,
    cobradoPorJefe: !!d.cobradoPorJefe,
    jefeNombre: String(d.jefeNombre || ''),
    cobradaEnTs: d.cobradaEnTs || null,
    anuladaEnTs: d.anuladaEnTs || null,
    anuladaPor: String(d.anuladaPor || ''),
    motivoAnulacion: String(d.motivoAnulacion || ''),
    createdAtTs: Number(d.createdAtTs || 0),
  }
}

function serializeSesionCaja(data: any): any {
  return {
    sede: String(data.sede || ''),
    cajeroNombre: String(data.cajeroNombre || ''),
    estado: String(data.estado || 'abierta'),
    montoApertura: Number(data.montoApertura || 0),
    ventasCount: Number(data.ventasCount || 0),
    totalVentas: Number(data.totalVentas || 0),
    totalEfectivo: Number(data.totalEfectivo || 0),
    totalDebito: Number(data.totalDebito || 0),
    totalTransferencia: Number(data.totalTransferencia || 0),
    aperturaAtTs: Number(data.aperturaAtTs || Date.now()),
    cierreAtTs: data.cierreAtTs || null,
    montoCierre: data.montoCierre || null,
    fechaStr: String(data.fechaStr || ''),
  }
}

function deserializeSesionCaja(d: any): SesionCajaAppwrite {
  return {
    $id: d.$id,
    sede: String(d.sede || ''),
    cajeroNombre: String(d.cajeroNombre || ''),
    estado: String(d.estado || 'abierta'),
    montoApertura: Number(d.montoApertura || 0),
    ventasCount: Number(d.ventasCount || 0),
    totalVentas: Number(d.totalVentas || 0),
    totalEfectivo: Number(d.totalEfectivo || 0),
    totalDebito: Number(d.totalDebito || 0),
    totalTransferencia: Number(d.totalTransferencia || 0),
    aperturaAtTs: Number(d.aperturaAtTs || 0),
    cierreAtTs: d.cierreAtTs || null,
    montoCierre: d.montoCierre || null,
    fechaStr: String(d.fechaStr || ''),
  }
}

// ─── Ventas POS ──────────────────────────────────────────────────────────────

export async function createVentaPos(data: any, customId?: string): Promise<string> {
  const { databases } = getServices()
  const docId = customId || ID.unique()
  await databases.createDocument(DB_ID, VENTAS_POS_COLLECTION, docId, serializeVenta(data))
  return docId
}

export async function updateVentaPos(id: string, updates: any): Promise<void> {
  const { databases } = getServices()
  const serialized: any = {}
  // Solo serializar campos que vienen en updates
  if (updates.items !== undefined) { serialized.itemsJson = JSON.stringify(updates.items); delete updates.items }
  if (updates.pagos !== undefined) { serialized.pagosJson = JSON.stringify(updates.pagos); delete updates.pagos }
  Object.assign(serialized, updates)
  // Mapear timestamps
  if (updates.cobradaEn) { serialized.cobradaEnTs = Date.now(); delete serialized.cobradaEn }
  if (updates.anuladaEn) { serialized.anuladaEnTs = Date.now(); delete serialized.anuladaEn }
  if (updates.createdAt) { serialized.createdAtTs = Date.now(); delete serialized.createdAt }
  if (updates.fecha) { serialized.fechaTs = Date.now(); delete serialized.fecha }
  await databases.updateDocument(DB_ID, VENTAS_POS_COLLECTION, id, serialized)
}

export async function getVentasPosBySedeAndDate(sede: string, fechaStr: string): Promise<VentaPOSAppwrite[]> {
  const { databases } = getServices()
  const all: any[] = []
  let cursor: string | null = null
  let hasMore = true
  while (hasMore) {
    const queries: any[] = [
      Query.equal('sede', sede),
      Query.equal('fechaStr', fechaStr),
      Query.limit(100),
      Query.orderDesc('$createdAt'),
    ]
    if (cursor) queries.push(Query.cursorAfter(cursor))
    const res = await databases.listDocuments(DB_ID, VENTAS_POS_COLLECTION, queries)
    if (res.documents.length > 0) {
      all.push(...res.documents)
      cursor = res.documents[res.documents.length - 1].$id
      if (res.documents.length < 100) hasMore = false
    } else {
      hasMore = false
    }
  }
  return all.map(deserializeVenta)
}

export async function getPreVentasBySede(sede: string): Promise<VentaPOSAppwrite[]> {
  const { databases } = getServices()
  const all: any[] = []
  let cursor: string | null = null
  let hasMore = true
  while (hasMore) {
    const queries: any[] = [
      Query.equal('sede', sede),
      Query.equal('estado', 'pre_venta'),
      Query.limit(100),
      Query.orderDesc('$createdAt'),
    ]
    if (cursor) queries.push(Query.cursorAfter(cursor))
    const res = await databases.listDocuments(DB_ID, VENTAS_POS_COLLECTION, queries)
    if (res.documents.length > 0) {
      all.push(...res.documents)
      cursor = res.documents[res.documents.length - 1].$id
      if (res.documents.length < 100) hasMore = false
    } else {
      hasMore = false
    }
  }
  return all.map(deserializeVenta)
}

export async function getVentaPosById(id: string): Promise<VentaPOSAppwrite | null> {
  const { databases } = getServices()
  try {
    const doc = await databases.getDocument(DB_ID, VENTAS_POS_COLLECTION, id)
    return deserializeVenta(doc)
  } catch {
    return null
  }
}

// ─── Caja Sesiones ───────────────────────────────────────────────────────────

export async function createCajaSesion(data: any, customId?: string): Promise<string> {
  const { databases } = getServices()
  const docId = customId || ID.unique()
  await databases.createDocument(DB_ID, CAJA_SESIONES_COLLECTION, docId, serializeSesionCaja(data))
  return docId
}

export async function updateCajaSesion(id: string, updates: any): Promise<void> {
  const { databases } = getServices()
  const serialized: any = {}
  Object.assign(serialized, updates)
  if (updates.aperturaAt) { serialized.aperturaAtTs = Number(updates.aperturaAt) || Date.now(); delete serialized.aperturaAt }
  if (updates.cierreAt) { serialized.cierreAtTs = Date.now(); delete serialized.cierreAt }
  await databases.updateDocument(DB_ID, CAJA_SESIONES_COLLECTION, id, serialized)
}

export async function getActiveCajaSesion(sede: string): Promise<SesionCajaAppwrite | null> {
  const { databases } = getServices()
  try {
    // Buscar por ID activo_${sede}
    const doc = await databases.getDocument(DB_ID, CAJA_SESIONES_COLLECTION, `active_${sede}`)
    if (doc && doc.estado === 'abierta') {
      return deserializeSesionCaja(doc)
    }
    return null
  } catch {
    // No existe el doc activo
    return null
  }
}

export async function setActiveCajaSesion(sede: string, data: any): Promise<void> {
  const { databases } = getServices()
  const docId = `active_${sede}`
  try {
    // Intentar crear, si existe actualizar
    await databases.createDocument(DB_ID, CAJA_SESIONES_COLLECTION, docId, serializeSesionCaja(data))
  } catch {
    await databases.updateDocument(DB_ID, CAJA_SESIONES_COLLECTION, docId, serializeSesionCaja(data))
  }
}

// ─── Cortes de Caja ──────────────────────────────────────────────────────────

export async function createCorteCaja(data: any, customId?: string): Promise<string> {
  const { databases } = getServices()
  const docId = customId || ID.unique()
  const now = Date.now()
  const serialized: any = {
    sesionCajaId: String(data.sesionCajaId || ''),
    sede: String(data.sede || ''),
    cajeroNombre: String(data.cajeroNombre || ''),
    aperturaAtTs: Number(data.aperturaAtTs || data.aperturaAt) || now,
    cierreAtTs: now,
    fechaCierreStr: String(data.fechaCierreStr || ''),
    horaCierreStr: String(data.horaCierreStr || ''),
    montoApertura: Number(data.montoApertura || 0),
    ventasCount: Number(data.ventasCount || 0),
    totalEfectivo: Number(data.totalEfectivo || 0),
    totalDebito: Number(data.totalDebito || 0),
    totalTransferencia: Number(data.totalTransferencia || 0),
    totalVentas: Number(data.totalVentas || 0),
    totalVueltos: Number(data.totalVueltos || 0),
    efectivoTeorico: Number(data.efectivoTeorico || 0),
    efectivoReal: Number(data.efectivoReal || 0),
    gastos: Number(data.gastos || 0),
    gastosItemsJson: JSON.stringify(data.gastosItems || []),
    anulacionesItemsJson: JSON.stringify({ anulaciones: data.anulacionesItems || [], devoluciones: data.devolucionesItems || [] }),
    totalAnulaciones: Number(data.totalAnulaciones || 0),
    totalDevoluciones: Number(data.totalDevoluciones || 0),
    diferencia: Number(data.diferencia || 0),
    topProductsJson: JSON.stringify(data.topProducts || []),
    costoProductos: Number(data.costoProductos || 0),
    gananciaProductos: Number(data.gananciaProductos || 0),
    createdAtTs: now,
  }
  await databases.createDocument(DB_ID, CORTES_CAJA_COLLECTION, docId, serialized)
  return docId
}

// ─── Polling helper (reemplazo de onSnapshot) ────────────────────────────────

export function pollVentasPos(
  sede: string,
  fechaStr: string,
  callback: (ventas: VentaPOSAppwrite[]) => void,
  intervalMs = 5000,
): () => void {
  let active = true
  let timer: any = null

  const poll = async () => {
    if (!active) return
    try {
      const ventas = await getVentasPosBySedeAndDate(sede, fechaStr)
      if (active) callback(ventas)
    } catch (e) {
      console.error('[pollVentasPos] error:', e)
    }
    if (active) {
      timer = setTimeout(poll, intervalMs)
    }
  }

  poll()

  return () => {
    active = false
    if (timer) clearTimeout(timer)
  }
}

export function pollPreVentas(
  sede: string,
  callback: (ventas: VentaPOSAppwrite[]) => void,
  intervalMs = 5000,
): () => void {
  let active = true
  let timer: any = null

  const poll = async () => {
    if (!active) return
    try {
      const ventas = await getPreVentasBySede(sede)
      if (active) callback(ventas)
    } catch (e) {
      console.error('[pollPreVentas] error:', e)
    }
    if (active) {
      timer = setTimeout(poll, intervalMs)
    }
  }

  poll()

  return () => {
    active = false
    if (timer) clearTimeout(timer)
  }
}
