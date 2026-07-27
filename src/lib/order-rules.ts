/** Monto mínimo de compra (se evalúa sobre el total a pagar, con descuentos). */
export const MINIMUM_ORDER_CLP = 50_000;

/** Retorna true si el total a pagar está por debajo del mínimo. */
export function isBelowMinimumOrder(totalAfterDiscounts: number): boolean {
  return totalAfterDiscounts < MINIMUM_ORDER_CLP;
}

export function minimumOrderMessage(totalAfterDiscounts: number): string {
  const base = `El monto mínimo de compra es $${MINIMUM_ORDER_CLP.toLocaleString('es-CL')}.`;
  return `${base} Tu total a pagar es $${Math.round(totalAfterDiscounts).toLocaleString('es-CL')}.`;
}
