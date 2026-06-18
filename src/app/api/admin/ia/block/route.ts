import { NextRequest, NextResponse } from 'next/server';
import { normalizePhone, setKeniaBlocked } from '@/lib/kenia-runtime';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = normalizePhone(body.phone || '');
    const blocked = Boolean(body.blocked);
    const reason = body.reason; // 'admin_takeover' | 'spam' | 'manual'
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Falta el teléfono' }, { status: 400 });
    }
    const usage = await setKeniaBlocked(phone, blocked, reason);
    return NextResponse.json({ success: true, usage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'No se pudo actualizar el bloqueo del cliente' }, { status: 500 });
  }
}
