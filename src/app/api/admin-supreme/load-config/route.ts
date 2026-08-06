import { NextResponse } from 'next/server'
import { getServices } from '@/lib/appwrite-admin'
import { Query } from 'appwrite'
import { unstable_cache } from 'next/cache'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28'
const ERP_CONFIG_COLLECTION = 'erp_config'

/**
 * OPTIMIZACIÓN CUOTA: este endpoint era llamado 2-4 veces por cada carga de
 * /pos, /pos-admin y /pos-visualizer (cada una = 1 lectura Appwrite).
 * Ahora la respuesta se cachea en servidor 60s con tag 'erp-config':
 * - Múltiples pestañas/cajas comparten la misma lectura.
 * - save-config invalida el tag → los cambios de config se propagan en ≤60s
 *   (el POS además escucha config_pos en Firestore para cambios en vivo).
 */
const getCachedErpConfig = unstable_cache(
  async () => {
    const { databases } = getServices()
    const res = await databases.listDocuments(DB_ID, ERP_CONFIG_COLLECTION, [
      Query.equal('docId', 'config'),
    ])
    if (res.documents.length > 0) {
      const doc = res.documents[0] as any
      return { ok: true as const, data: (doc.data as string) || '{}' }
    }
    return { ok: true as const, data: null }
  },
  ['erp-config-load'],
  { revalidate: 60, tags: ['erp-config'] },
)

export async function GET() {
  try {
    const result = await getCachedErpConfig()
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=45' },
    })
  } catch (e: any) {
    console.error('[admin-supreme/load-config] error:', e)
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
