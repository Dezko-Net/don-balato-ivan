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
export async function fetchTrabajadoresERP(): Promise<TrabajadorERP[]> {
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
    return all.map(deserialize)
  } catch (err) {
    console.error('[trabajadoresErpService] fetchTrabajadoresERP error:', err)
    return []
  }
}

/** Crea un trabajador (para el futuro formulario de gestión de equipo). */
export async function createTrabajadorERP(
  t: Omit<TrabajadorERP, '$id'>
): Promise<TrabajadorERP | null> {
  try {
    const { databases } = getServices()
    const doc = await databases.createDocument(DB_ID, TRABAJADORES_COLLECTION, ID.unique(), {
      nombre: t.nombre,
      cargo: t.cargo,
      sede: t.sede,
      sueldo: t.sueldo,
      fotoUrl: t.fotoUrl,
      activo: t.activo,
      nacionalidad: t.nacionalidad || '',
      genero: t.genero || '',
      fechaIngreso: t.fechaIngreso || '',
    })
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
    return true
  } catch (err) {
    console.error('[trabajadoresErpService] deleteTrabajadorERP error:', err)
    return false
  }
}
