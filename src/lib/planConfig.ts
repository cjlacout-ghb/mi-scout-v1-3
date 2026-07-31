/** Tipos y duraciones centralizadas por plan.
 *  Importable tanto desde componentes cliente (admin/page.tsx)
 *  como desde API routes (api/license/validate/route.ts).
 */

export type PlanKey = 'full' | 'promo';

/** Calcula la fecha de vencimiento a partir del momento actual según el plan. */
export function calculateExpiresAt(plan: PlanKey): string {
  const date = new Date();
  if (plan === 'promo') {
    date.setMonth(date.getMonth() + 1);   // Promo: +1 mes
  } else {
    date.setFullYear(date.getFullYear() + 1); // Full: +1 año
  }
  return date.toISOString();
}
