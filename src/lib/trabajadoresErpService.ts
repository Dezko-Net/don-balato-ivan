// src/lib/trabajadoresErpService.ts
import { getServices, Query } from '@/lib/appwrite'
import { ID } from 'appwrite'
import type { SedeSlug } from '@/types'

export const TRABAJADORES_COLLECTION = 'trabajadores_erp'
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28'

export interface TrabajadorERP {
  $id: string
  nombre: string
  cargo: string
  sede: SedeSlug
  sueldo: number
  fotoUrl: string
  activo: boolean
  nacionalidad?: string
  genero?: string
  fechaIngreso?: string
}

function deserialize(d: any): TrabajadorERP {
  return {
    $id: d.$id,
    nombre: String(d.nombre || ''),
    cargo: String(d.cargo || ''),
    sede: (d.sede || 'alameda') as SedeSlug,
    sueldo: Number(d.sueldo) || 0,
    fotoUrl: String(d.fotoUrl || ''),
    activo: d.activo !== false,
    nacionalidad: d.nacionalidad || '',
    genero: d.genero || '',
    fechaIngreso: d.fechaIngreso || '',
  }
}

/** Carga todos los trabajadores (paginado con cursores). */
// ── Caché local 6h: los trabajadores casi nunca cambian; antes esto hacía
// ⌈N/100⌉ lecturas directas a Appwrite EN CADA montaje del POS.
const TRAB_CACHE_KEY = 'yaxsel_trabajadores_cache_v1'
const TRAB_CACHE_TTL = 6 * 60 * 60 * 1000

export function invalidateTrabajadoresCache(): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(TRAB_CACHE_KEY) } catch {}
}

export async function fetchTrabajadoresERP(forceRefresh = false): Promise<TrabajadorERP[]> {
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(TRAB_CACHE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.timestamp && Date.now() - parsed.timestamp < TRAB_CACHE_TTL && Array.isArray(parsed.items)) {
          return parsed.items
        }
      }
    } catch {}
  }
  try {
    const { databases } = getServices()
    const all: any[] = []
    let cursor: string | null = null
    let hasMore = true
    while (hasMore) {
      const queries: any[] = [Query.limit(100)]
      if (cursor) queries.push(Query.cursorAfter(cursor))
      const res = await databases.listDocuments(DB_ID, TRABAJADORES_COLLECTION, queries)
      if (res.documents.length > 0) {
        all.push(...res.documents)
        cursor = res.documents[res.documents.length - 1].$id
        if (res.documents.length < 100) hasMore = false
      } else {
        hasMore = false
      }
    }
    const items = all.map(deserialize)
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(TRAB_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items })) } catch {}
    }
    return items
  } catch (err) {
    console.error('[trabajadoresErpService] fetchTrabajadoresERP error:', err)
    // Fallback a caché aunque esté expirada (mejor datos viejos que login roto)
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(TRAB_CACHE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed?.items)) return parsed.items
        }
      } catch {}
    }
    return []
  }
}

/** Crea un trabajador (para la gestión de equipo). */
export async function createTrabajadorERP(
  t: Omit<TrabajadorERP, '$id'>
): Promise<TrabajadorERP | null> {
  try {
    const { databases } = getServices()
    const safeFotoUrl = String(t.fotoUrl || '').slice(0, 990)
    const doc = await databases.createDocument(DB_ID, TRABAJADORES_COLLECTION, ID.unique(), {
      nombre: t.nombre || 'Sin nombre',
      cargo: t.cargo || 'Operativo',
      sede: t.sede || 'alameda',
      sueldo: Number(t.sueldo) || 0,
      fotoUrl: safeFotoUrl,
      activo: t.activo !== false,
      nacionalidad: t.nacionalidad || '',
      genero: t.genero || '',
      fechaIngreso: t.fechaIngreso || '',
    })
    invalidateTrabajadoresCache()
    return deserialize(doc)
  } catch (err) {
    console.error('[trabajadoresErpService] createTrabajadorERP error:', err)
    return null
  }
}

/** Elimina un trabajador por su $id. */
export async function deleteTrabajadorERP(id: string): Promise<boolean> {
  try {
    const { databases } = getServices()
    await databases.deleteDocument(DB_ID, TRABAJADORES_COLLECTION, id)
    invalidateTrabajadoresCache()
    return true
  } catch (err) {
    console.error('[trabajadoresErpService] deleteTrabajadorERP error:', err)
    return false
  }
}

/** Actualiza un trabajador por su $id. */
export async function updateTrabajadorERP(id: string, data: Partial<Omit<TrabajadorERP, '$id'>>): Promise<boolean> {
  try {
    const { databases } = getServices()
    const updates: Record<string, any> = {}
    if (data.nombre !== undefined) updates.nombre = data.nombre
    if (data.cargo !== undefined) updates.cargo = data.cargo
    if (data.sede !== undefined) updates.sede = data.sede
    if (data.sueldo !== undefined) updates.sueldo = Number(data.sueldo)
    if (data.fotoUrl !== undefined) updates.fotoUrl = String(data.fotoUrl || '').slice(0, 990)
    if (data.activo !== undefined) updates.activo = data.activo
    if (data.nacionalidad !== undefined) updates.nacionalidad = data.nacionalidad
    if (data.genero !== undefined) updates.genero = data.genero
    if (data.fechaIngreso !== undefined) updates.fechaIngreso = data.fechaIngreso
    await databases.updateDocument(DB_ID, TRABAJADORES_COLLECTION, id, updates)
    invalidateTrabajadoresCache()
    return true
  } catch (err) {
    console.error('[trabajadoresErpService] updateTrabajadorERP error:', err)
    return false
  }
}
