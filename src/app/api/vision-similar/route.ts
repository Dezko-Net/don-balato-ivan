import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl es requerido' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Falta GEMINI_API_KEY en variables de entorno' }, { status: 500 });
    }

    // Descargar la imagen y convertirla a base64
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ error: 'No se pudo descargar la imagen' }, { status: 400 });
    }
    const imgBuffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(imgBuffer).toString('base64');
    const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';

    // Usar Gemini con API key (no requiere OAuth)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [{
        parts: [
          { text: 'Analiza esta imagen de producto y responde SOLO con un JSON válido (sin markdown) con esta estructura: {"bestGuess": ["etiqueta1", "etiqueta2"], "searchTerms": ["termino de busqueda 1", "termino 2"]}. Las etiquetas deben describir el producto (tipo, marca, color, material). Los terminos de busqueda deben ser consultas que alguien usaria para encontrar este producto en Google Images.' },
          { inline_data: { mime_type: mimeType, data: base64 } }
        ]
      }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 500 }
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json({ error: `Gemini API error: ${response.status}`, detail: errText }, { status: 500 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let bestGuess: string[] = [];
    let searchTerms: string[] = [];

    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      bestGuess = parsed.bestGuess || [];
      searchTerms = parsed.searchTerms || [];
    } catch {
      bestGuess = [text.substring(0, 100)].filter(Boolean);
    }

    // Buscar imágenes en Google usando los términos generados
    const query = (searchTerms[0] || bestGuess[0] || '').trim();
    let images: { url: string; score?: number }[] = [];

    if (query) {
      // Usar Google Custom Search API si está disponible, sino devolver los términos
      const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID || '';
      if (GOOGLE_CSE_ID) {
        const cseUrl = `https://www.googleapis.com/customsearch/v1?key=${GEMINI_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=10`;
        const cseRes = await fetch(cseUrl);
        if (cseRes.ok) {
          const cseData = await cseRes.json();
          images = (cseData.items || []).map((item: any) => ({ url: item.link, score: undefined }));
        }
      }
    }

    return NextResponse.json({
      images,
      bestGuess,
      searchTerms,
      message: images.length === 0 ? 'Se generaron términos de búsqueda pero no se encontraron imágenes. Usa los términos para buscar manualmente.' : undefined,
    });
  } catch (e: any) {
    console.error('vision-similar error:', e);
    return NextResponse.json({ error: e.message || 'Error interno' }, { status: 500 });
  }
}

// GET proxy para descargar imágenes externas (evita CORS en el cliente)
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'url param required' }, { status: 400 });
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `fetch failed: ${res.status}` }, { status: 502 });
    }
    const blob = await res.blob();
    const headers = new Headers();
    headers.set('Content-Type', blob.type || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=3600');
    return new NextResponse(blob, { status: 200, headers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'proxy error' }, { status: 500 });
  }
}
