import { NextRequest, NextResponse } from 'next/server'
import { getServices } from '@/lib/appwrite-admin'
import { ID, Query } from 'appwrite'
import { revalidateTag } from 'next/cache'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28'
const ERP_CONFIG_COLLECTION = 'erp_config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data } = body as { data: string }

    if (!data) {
      return NextResponse.json({ ok: false, error: 'Missing data' }, { status: 400 })
    }

    const { databases } = getServices()

    const res = await databases.listDocuments(DB_ID, ERP_CONFIG_COLLECTION, [
      Query.equal('docId', 'config'),
    ])

    if (res.documents.length > 0) {
      await databases.updateDocument(DB_ID, ERP_CONFIG_COLLECTION, res.documents[0].$id, {
        data,
        docId: 'config',
      })
    } else {
      await databases.createDocument(DB_ID, ERP_CONFIG_COLLECTION, ID.unique(), {
        data,
        docId: 'config',
      })
    }

    // Invalidar caché server-side de load-config → propagación inmediata
    revalidateTag('erp-config')

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[admin-supreme/save-config] error:', e)
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
