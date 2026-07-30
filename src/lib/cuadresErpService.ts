// src/lib/cuadresErpService.ts
import { getServices, Query } from '@/lib/appwrite'
import { ID } from 'appwrite'
import type { SedeSlug } from '@/types'

export const CUADRES_COLLECTION = 'cuadres_erp'
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28'

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface CuadreGasto {
  monto: number
  observacion?: string
  detalle?: string
  esDevolucion?: boolean
  esAnulada?: boolean
}

export interface CuadreTopProduct {
  sku: string
  nombre: string
  cantidadVendida: number
  ventasBrutas: number
  ventasNetas: number
  costoNeto: number
}

export interface CuadreFoto {
  url: string
  tipo: 'gasto' | 'corte'
  gastoIndex?: number
  name?: string
  caja?: 1 | 2
}

export interface CuadreAnulada {
  monto: number
  observacion?: string
  folio?: string
}

export interface CuadreERP {
  $id: string
  sede: SedeSlug
  fecha: string            // 'YYYY-MM-DD'
  estado: string           // 'pendiente' | 'enviado'
  montos: {
    efectivoSistema: number
    efectivoReal: number
    debitoSistema: number
    debitoReal: number
    transferencias: number
  }
  calculos: {
    gastosTotales: number
    totalNeto: number
    totalBruto: number
    diferenciaTotal: number
    diferenciaEfectivo: number
    diferenciaDebito: number
  }
  gastos: CuadreGasto[]
  topProducts: CuadreTopProduct[]
  fotos: CuadreFoto[]
  anuladas: CuadreAnulada[]
  devoluciones: CuadreAnulada[]
  createdAt?: string
  updatedAt?: string
  _pending?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function safeParseJson<T>(str: string | undefined | null, fallback: T): T {
  if (!str || str === '[]' || str === 'null') return fallback
  try { return JSON.parse(str) as T } catch { return fallback }
}

function deserializeCuadre(doc: any): CuadreERP {
  return {
    $id: doc.$id,
    sede: doc.sede as SedeSlug,
    fecha: doc.fecha,
    estado: doc.estado || 'pendiente',
    montos: {
      efectivoSistema: Number(doc.efectivoSistema) || 0,
      efectivoReal:    Number(doc.efectivoReal) || 0,
      debitoSistema:   Number(doc.debitoSistema) || 0,
      debitoReal:      Number(doc.debitoReal) || 0,
      transferencias:  Number(doc.transferencias) || 0,
    },
    calculos: {
      gastosTotales:      Number(doc.gastosTotales) || 0,
      totalNeto:          Number(doc.totalNeto) || 0,
      totalBruto:         Number(doc.totalBruto) || 0,
      diferenciaTotal:    Number(doc.diferenciaTotal) || 0,
      diferenciaEfectivo: Number(doc.diferenciaEfectivo) || 0,
      diferenciaDebito:   Number(doc.diferenciaDebito) || 0,
    },
    gastos:       safeParseJson<CuadreGasto[]>(doc.gastosJson, []),
    topProducts:  safeParseJson<CuadreTopProduct[]>(doc.topProductsJson, []),
    fotos:        safeParseJson<CuadreFoto[]>(doc.fotosJson, []),
    anuladas:     safeParseJson<CuadreAnulada[]>(doc.anuladasJson, []),
    devoluciones: safeParseJson<CuadreAnulada[]>(doc.devolucionesJson, []),
    createdAt:    doc.$createdAt,
    updatedAt:    doc.$updatedAt,
    _pending:     false,
  }
}

function serializeCuadre(c: Partial<Omit<CuadreERP, '$id'>>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (c.sede !== undefined)   payload.sede   = c.sede
  if (c.fecha !== undefined)  payload.fecha  = c.fecha
  if (c.estado !== undefined) payload.estado = c.estado
  if (c.montos) {
    payload.efectivoSistema = c.montos.efectivoSistema
    payload.efectivoReal    = c.montos.efectivoReal
    payload.debitoSistema   = c.montos.debitoSistema
    payload.debitoReal      = c.montos.debitoReal
    payload.transferencias  = c.montos.transferencias
  }
  if (c.calculos) {
    payload.gastosTotales      = c.calculos.gastosTotales
    payload.totalNeto          = c.calculos.totalNeto
    payload.totalBruto         = c.calculos.totalBruto
    payload.diferenciaTotal    = c.calculos.diferenciaTotal
    payload.diferenciaEfectivo = c.calculos.diferenciaEfectivo
    payload.diferenciaDebito   = c.calculos.diferenciaDebito
  }
  if (c.gastos !== undefined)       payload.gastosJson      = JSON.stringify(c.gastos)
  if (c.topProducts !== undefined)  payload.topProductsJson = JSON.stringify(c.topProducts)
  if (c.fotos !== undefined)        payload.fotosJson       = JSON.stringify(c.fotos)
  if (c.anuladas !== undefined)     payload.anuladasJson    = JSON.stringify(c.anuladas)
  if (c.devoluciones !== undefined) payload.devolucionesJson = JSON.stringify(c.devoluciones)
  return payload
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Carga todos los cuadres de los últimos N meses.
 * Pagina automáticamente con cursores.
 */
export async function fetchCuadresERP(meses = 3): Promise<CuadreERP[]> {
  try {
    const { databases } = getServices()

    // Fecha mínima: hace N meses
    const since = new Date()
    since.setMonth(since.getMonth() - meses)
    const sinceStr = since.toISOString().slice(0, 10)

    const allDocs: any[] = []
    let cursor: string | null = null
    let hasMore = true

    while (hasMore) {
      const queries: any[] = [
        Query.greaterThanEqual('fecha', sinceStr),
        Query.orderDesc('fecha'),
        Query.limit(100),
      ]
      if (cursor) queries.push(Query.cursorAfter(cursor))

      const res = await databases.listDocuments(DB_ID, CUADRES_COLLECTION, queries)

      if (res.documents.length > 0) {
        allDocs.push(...res.documents)
        cursor = res.documents[res.documents.length - 1].$id
        if (res.documents.length < 100) hasMore = false
      } else {
        hasMore = false
      }
    }

    // Deduplicar por sede+fecha (más reciente gana)
    const byKey = new Map<string, any>()
    for (const doc of allDocs) {
      const key = `${doc.sede}|${doc.fecha}`
      if (!byKey.has(key)) byKey.set(key, doc)
    }

    return Array.from(byKey.values()).map(deserializeCuadre)
  } catch (err) {
    console.error('[cuadresErpService] fetchCuadresERP error:', err)
    return []
  }
}

/**
 * Crea un nuevo cuadre en Appwrite.
 */
export async function createCuadreERP(
  cuadre: Omit<CuadreERP, '$id' | 'createdAt' | 'updatedAt' | '_pending'>
): Promise<CuadreERP | null> {
  try {
    const { databases } = getServices()
    const doc = await databases.createDocument(
      DB_ID,
      CUADRES_COLLECTION,
      ID.unique(),
      serializeCuadre(cuadre)
    )
    return deserializeCuadre(doc)
  } catch (err) {
    console.error('[cuadresErpService] createCuadreERP error:', err)
    return null
  }
}

/**
 * Actualiza un cuadre existente.
 */
export async function updateCuadreERP(
  id: string,
  data: Partial<Omit<CuadreERP, '$id' | 'createdAt' | 'updatedAt' | '_pending'>>
): Promise<boolean> {
  try {
    const { databases } = getServices()
    await databases.updateDocument(DB_ID, CUADRES_COLLECTION, id, serializeCuadre(data))
    return true
  } catch (err) {
    console.error('[cuadresErpService] updateCuadreERP error:', err)
    return false
  }
}

/**
 * Elimina un cuadre por su $id de Appwrite.
 */
export async function deleteCuadreERP(id: string): Promise<boolean> {
  try {
    const { databases } = getServices()
    await databases.deleteDocument(DB_ID, CUADRES_COLLECTION, id)
    return true
  } catch (err) {
    console.error('[cuadresErpService] deleteCuadreERP error:', err)
    return false
  }
}
