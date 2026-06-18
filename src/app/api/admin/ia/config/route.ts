import { NextRequest, NextResponse } from 'next/server';
import { getKeniaConfig, saveKeniaConfig } from '@/lib/kenia-runtime';

export async function GET() {
  try {
    const config = await getKeniaConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'No se pudo cargar la configuración de Kenia' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const config = await saveKeniaConfig({
      adminPrompt: typeof body.adminPrompt === 'string' ? body.adminPrompt : undefined,
      customerPrompt: typeof body.customerPrompt === 'string' ? body.customerPrompt : undefined,
      adminAlertPhone: typeof body.adminAlertPhone === 'string' ? body.adminAlertPhone : undefined,
      tokenLimitPerCustomer: typeof body.tokenLimitPerCustomer === 'number' ? body.tokenLimitPerCustomer : undefined,
      notifyOnEveryCustomerMessage: typeof body.notifyOnEveryCustomerMessage === 'boolean' ? body.notifyOnEveryCustomerMessage : undefined,
    });
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'No se pudo guardar la configuración de Kenia' }, { status: 500 });
  }
}
