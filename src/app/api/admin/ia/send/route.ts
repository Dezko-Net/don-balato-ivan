import { NextRequest, NextResponse } from 'next/server';
import { addToHistory, sendWhatsAppMessage } from '@/lib/whatsapp';
import { normalizePhone } from '@/lib/kenia-runtime';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = normalizePhone(body.phone || '');
    const text = String(body.text || '').trim();
    if (!phone || !text) {
      return NextResponse.json({ success: false, error: 'Faltan teléfono o mensaje' }, { status: 400 });
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN || '';
    if (!token) {
      return NextResponse.json({ success: false, error: 'No está configurado WHATSAPP_ACCESS_TOKEN en el servidor' }, { status: 500 });
    }

    await sendWhatsAppMessage(phone, text, token);
    await addToHistory(phone, 'assistant', text);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'No se pudo enviar el mensaje de Kenia' }, { status: 500 });
  }
}
