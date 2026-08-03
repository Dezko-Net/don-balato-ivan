import { NextRequest, NextResponse } from 'next/server'
import { getServices } from '@/lib/appwrite-admin'
import { ID } from 'appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28'
const TRABAJADORES_COLLECTION = 'trabajadores_erp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, cargo, sede, sueldo, fotoUrl, activo, nacionalidad, genero, fechaIngreso } = body

    if (!nombre || !sede) {
      return NextResponse.json({ ok: false, error: 'Faltan nombre y sede' }, { status: 400 })
    }

    const { databases } = getServices()
    const doc = await databases.createDocument(DB_ID, TRABAJADORES_COLLECTION, ID.unique(), {
      nombre,
      cargo: cargo || 'Cajera',
      sede,
      sueldo: Number(sueldo) || 0,
      fotoUrl: fotoUrl || '',
      activo: activo !== false,
      nacionalidad: nacionalidad || '',
      genero: genero || '',
      fechaIngreso: fechaIngreso || new Date().toISOString().slice(0, 10),
    })

    return NextResponse.json({ ok: true, id: doc.$id })
  } catch (e: any) {
    console.error('[admin-supreme/save-trabajador] error:', e)
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
