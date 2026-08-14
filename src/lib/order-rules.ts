/** Monto mínimo de compra por defecto de Don Balato (se evalúa sobre el total a pagar, con descuentos). */
export const MINIMUM_ORDER_CLP = 50_000;

/** Retorna true si el total a pagar está por debajo del mínimo. */
export function isBelowMinimumOrder(totalAfterDiscounts: number, minAmount = MINIMUM_ORDER_CLP): boolean {
  return totalAfterDiscounts < minAmount;
}

export function minimumOrderMessage(totalAfterDiscounts: number, minAmount = MINIMUM_ORDER_CLP): string {
  const base = `El monto mínimo de compra es $${minAmount.toLocaleString('es-CL')}.`;
  return `${base} Tu total a pagar es $${Math.round(totalAfterDiscounts).toLocaleString('es-CL')}.`;
}
