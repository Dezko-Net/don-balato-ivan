import { NextResponse } from 'next/server';
import { isNightNow, santiagoHour, NIGHT_START_HOUR, NIGHT_END_HOUR } from '@/lib/night-mode';

// Devuelve si la tienda está en "modo noche" según la hora de Chile en el
// SERVIDOR (no se confía en el reloj del navegador). Se consulta una vez al
// crear el pedido en el checkout.
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      night: isNightNow(),
      hour: santiagoHour(),
      window: { start: NIGHT_START_HOUR, end: NIGHT_END_HOUR },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
