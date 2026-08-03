import { NextResponse } from 'next/server'
import { getServices } from '@/lib/appwrite-admin'
import { Query } from 'appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28'
const ERP_CONFIG_COLLECTION = 'erp_config'

export async function POST() {
  try {
    const { databases } = getServices()
    const res = await databases.listDocuments(DB_ID, ERP_CONFIG_COLLECTION, [
      Query.equal('docId', 'config'),
    ])
    if (res.documents.length > 0) {
      await databases.deleteDocument(DB_ID, ERP_CONFIG_COLLECTION, res.documents[0].$id)
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[admin-supreme/delete-config] error:', e)
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
