const MPG_BY_CATEGORY: Record<string, number> = {
  Economy: 36,
  Sedan: 29,
  SUV: 22,
  Convertible: 25,
  Supercar: 15,
};

/**
 * The DB has no dedicated fuel-economy column, so this derives a
 * realistic label from category + fuel type instead of a migration.
 * Electric cars report MPGe (EPA's mpg-equivalent unit); everything
 * else is a category-typical combined mpg, bumped up for hybrids.
 */
export function fuelEconomyLabel(category: string, fuel: string): string {
  if (fuel === "Electric") return "104 MPGe";
  const base = MPG_BY_CATEGORY[category] ?? 27;
  const mpg = fuel === "Hybrid" ? Math.round(base * 1.4) : base;
  return `${mpg} mpg avg`;
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
