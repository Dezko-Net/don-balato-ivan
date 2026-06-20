import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyAPU7MGRQWFHHA1NhWD0rTfcVGOCVGOQok';
const MODELS = ['gemini-3.1-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

async function imageUrlToPart(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const mimeType = (res.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();
    if (!mimeType.startsWith('image/')) return null;
    const bytes = await res.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_IMAGE_BYTES) return null;
    return {
      inlineData: {
        mimeType,
        data: Buffer.from(bytes).toString('base64'),
      },
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageUrls } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'prompt es requerido' }, { status: 400 });
    }

    const normalizedImageUrls = Array.isArray(imageUrls)
      ? imageUrls.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 3)
      : [];

    const imageParts = (await Promise.all(normalizedImageUrls.map(imageUrlToPart))).filter(Boolean);

    const body = JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }],
    });

    let res;
    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (res.ok) break;
      if (res.status === 503) { console.warn(`Model ${model} unavailable (503), trying fallback...`); continue; }
      break;
    }

    if (!res || !res.ok) {
      const errText = res ? await res.text() : 'All models unavailable';
      console.error('Gemini API error:', res?.status, errText);
      return NextResponse.json({ error: `Error en la API de Gemini (${res?.status || 503})` }, { status: res?.status || 503 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ text });
  } catch (err: any) {
    console.error('Gemini route error:', err);
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}
