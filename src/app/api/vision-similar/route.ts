import { NextRequest, NextResponse } from 'next/server';
import { getGeminiAccessToken } from '@/lib/google-auth';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl es requerido' }, { status: 400 });
    }

    // Descargar la imagen y convertirla a base64
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ error: 'No se pudo descargar la imagen' }, { status: 400 });
    }
    const imgBuffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(imgBuffer).toString('base64');

    // Vision API requiere OAuth2 (no acepta API keys)
    const GCP_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || '';

    let token: string;
    try {
      token = await getGeminiAccessToken(true); // forceOAuth = true
    } catch (e: any) {
      return NextResponse.json({
        error: 'No se pudo autenticar con Google Cloud. Necesitas configurar GOOGLE_APPLICATION_CREDENTIALS_JSON o tener ADC configurado.',
        detail: e.message,
      }, { status: 500 });
    }

    if (!token) {
      return NextResponse.json({
        error: 'No hay token OAuth. Configura GOOGLE_APPLICATION_CREDENTIALS_JSON en Vercel con el JSON del service account.',
      }, { status: 500 });
    }

    const visionUrl = 'https://vision.googleapis.com/v1/images:annotate';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    if (GCP_PROJECT_ID) {
      headers['x-goog-user-project'] = GCP_PROJECT_ID;
    }

    const body = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: 'WEB_DETECTION', maxResults: 20 }],
        },
      ],
    };

    const response = await fetch(visionUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Vision API error:', errText);
      return NextResponse.json({ error: `Vision API error: ${response.status}`, detail: errText }, { status: 500 });
    }

    const data = await response.json();
    const webDetection = data.responses?.[0]?.webDetection;

    if (!webDetection) {
      return NextResponse.json({ images: [], message: 'No se encontraron imágenes similares' });
    }

    // Extraer URLs de imágenes visualmente similares
    const similarImages: { url: string; score?: number }[] = (webDetection.visuallySimilarImages || [])
      .map((img: any) => ({ url: img.url, score: img.score }))
      .filter((img: any) => img.url);

    // También incluir fullMatchingImages si hay
    const fullMatches: { url: string; score?: number }[] = (webDetection.fullMatchingImages || [])
      .map((img: any) => ({ url: img.url, score: img.score }))
      .filter((img: any) => img.url);

    // Combinar y deduplicar
    const allImages = [...similarImages, ...fullMatches];
    const seen = new Set<string>();
    const unique = allImages.filter(img => {
      if (seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    });

    // Best guess labels (para contexto)
    const bestGuessLabels: string[] = (webDetection.bestGuessLabels || [])
      .map((l: any) => l.label)
      .filter(Boolean);

    return NextResponse.json({
      images: unique.slice(0, 20),
      bestGuess: bestGuessLabels,
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
