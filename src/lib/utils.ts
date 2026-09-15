// Combined L/100km by category — Canada (and most of the world) rates
// fuel economy this way instead of mpg: liters burned per 100km driven,
// so a LOWER number is better.
const L_PER_100KM_BY_CATEGORY: Record<string, number> = {
  Economy: 6.5,
  Sedan: 8.1,
  SUV: 10.7,
  Convertible: 9.4,
  Supercar: 15.7,
};

/**
 * The DB has no dedicated fuel-economy column, so this derives a
 * realistic label from category + fuel type instead of a migration.
 * Electric cars are rated in Le/100km (litre-equivalent, Canada's EV
 * unit); hybrids get a efficiency bump over their category's baseline.
 */
export function fuelEconomyLabel(category: string, fuel: string): string {
  if (fuel === "Electric") return "2.3 Le/100km";
  const base = L_PER_100KM_BY_CATEGORY[category] ?? 8.7;
  const lPer100km = fuel === "Hybrid" ? base / 1.4 : base;
  return `${lPer100km.toFixed(1)} L/100km`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return 0;
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
}

export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function generateBookingId(): string {
  return `VEL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const SERVICE_FEE_RATE = 0.08;

/**
 * Single source of truth for the booking price breakdown — was
 * previously duplicated identically in booking/page.tsx and
 * checkout/page.tsx, which risked the two pages showing different
 * totals for the same booking if one was ever edited without the other.
 */
export function calculatePricing(
  pricePerDay: number,
  days: number,
  extraIds: string[],
  extras: { id: string; pricePerDay: number }[]
) {
  const subtotal = days * pricePerDay;
  const extrasTotal = extraIds.reduce((sum, id) => {
    const extra = extras.find((e) => e.id === id);
    return sum + (extra ? extra.pricePerDay * days : 0);
  }, 0);
  const serviceFee = Math.round((subtotal + extrasTotal) * SERVICE_FEE_RATE);
  const total = subtotal + extrasTotal + serviceFee;
  return { subtotal, extrasTotal, serviceFee, total };
}
