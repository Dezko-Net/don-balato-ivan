import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'combos-config.json');

export async function GET() {
  try {
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

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: 'Configuración de combos guardada correctamente' });
  } catch (e: any) {
    console.error('[API admin combos POST] Error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
