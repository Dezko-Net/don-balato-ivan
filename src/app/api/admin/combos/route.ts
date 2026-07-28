import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { serverGetDocument, serverCreateDocument, serverUpdateDocument } from '@/lib/appwrite-server';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'combos-config.json');
const SETTINGS_COLLECTION_ID = 'theme_config';
const COMBOS_DOC_ID = 'combos-config';

export async function GET() {
  try {
    // Try Appwrite first (works in production)
    try {
      const doc = await serverGetDocument(SETTINGS_COLLECTION_ID, COMBOS_DOC_ID);
      if (doc && (doc as any).config) {
        const configs = JSON.parse((doc as any).config);
        return NextResponse.json({ success: true, configs });
      }
    } catch { /* doc doesn't exist yet, fall through to local */ }

    // Fallback to local file (works in dev)
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return NextResponse.json({ success: true, configs: JSON.parse(content) });
    }
    return NextResponse.json({ success: true, configs: [] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { configs } = body;

    if (!Array.isArray(configs)) {
      return NextResponse.json({ success: false, error: 'configs debe ser un arreglo' }, { status: 400 });
    }

    const dataStr = JSON.stringify(configs, null, 2);

    // Save to Appwrite (works in production)
    try {
      try {
        // Try update first
        await serverUpdateDocument(SETTINGS_COLLECTION_ID, COMBOS_DOC_ID, { config: dataStr });
      } catch {
        // Document doesn't exist — create it
        await serverCreateDocument(SETTINGS_COLLECTION_ID, COMBOS_DOC_ID, { NAME: 'combos-config', config: dataStr }, [
          'read("any")',
          'update("any")',
          'delete("any")',
        ]);
      }
    } catch (awErr: any) {
      console.error('[API admin combos POST] Appwrite save failed:', awErr);
      // Fallback to local file in dev
      try {
        const dir = path.dirname(CONFIG_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(CONFIG_PATH, dataStr, 'utf-8');
      } catch (fsErr: any) {
        return NextResponse.json({ success: false, error: `No se pudo guardar: ${awErr.message} / ${fsErr.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Configuración de combos guardada correctamente' });
  } catch (e: any) {
    console.error('[API admin combos POST] Error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
