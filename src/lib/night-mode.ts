/**
 * Modo nocturno de la tienda.
 *
 * Ventana fija: 18:00 → 09:00 hora de Chile (America/Santiago).
 * Durante la noche, la web SALTA la confirmación de stock por cajera: el pedido
 * se crea directo en estado 'paid' (pago) para que el cliente transfiera de una
 * y suba su comprobante, sin esperar a que alguien confirme stock. Al día
 * siguiente la cajera revisa el pedido normalmente.
 *
 * La hora SIEMPRE se calcula en zona horaria de Chile en el servidor, para que
 * no dependa del reloj del navegador del cliente (que se podría falsear).
 */
export const NIGHT_START_HOUR = 18; // inclusive: desde las 18:00
export const NIGHT_END_HOUR = 9;    // exclusivo: hasta las 09:00

/** Hora (0-23) actual en America/Santiago. */
export function santiagoHour(date: Date = new Date()): number {
  const s = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    hour: 'numeric',
    hour12: false,
  }).format(date);
  // hour12:false puede devolver "24" a medianoche en algunos entornos.
  return parseInt(s, 10) % 24;
}

/** True si estamos dentro de la ventana nocturna (18:00–09:00 Chile). */
export function isNightNow(date: Date = new Date()): boolean {
  const h = santiagoHour(date);
  return h >= NIGHT_START_HOUR || h < NIGHT_END_HOUR;
}
