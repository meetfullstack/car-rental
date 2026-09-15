"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import { extras as allExtras } from "@/lib/cars";
import { useCar } from "@/lib/useCar";
import { formatCurrency, daysBetween, generateBookingId } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { draft, setDraft, addBooking, user, hydrated } = useBooking();
  const { car, loading } = useCar(draft.carId);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!loading && !car) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">No vehicle selected</h1>
        <p className="mt-2 text-sm text-muted">Choose a car from the fleet to start a booking.</p>
        <Link
          href="/fleet"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Browse the fleet <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  if (hydrated && !user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Sign in to complete your booking</h1>
        <p className="mt-2 text-sm text-muted">We need an account to attach your booking to.</p>
        <Link
          href="/login?next=/checkout"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Sign in <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  if (!car) return null;

  const days = Math.max(daysBetween(draft.pickupDate, draft.dropoffDate), 1);
  const subtotal = days * car.pricePerDay;
  const extrasTotal = draft.extras.reduce((sum, id) => {
    const extra = allExtras.find((e) => e.id === id);
    return sum + (extra ? extra.pricePerDay * days : 0);
  }, 0);
  const serviceFee = Math.round((subtotal + extrasTotal) * 0.08);
  const total = subtotal + extrasTotal + serviceFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!car) return;
    setSubmitting(true);
    setFormError(null);

    const bookingId = generateBookingId();
    const { error } = await addBooking({
      id: bookingId,
      carId: car.id,
      pickupLocation: draft.pickupLocation,
      dropoffLocation: draft.dropoffLocation,
      pickupDate: draft.pickupDate,
      dropoffDate: draft.dropoffDate,
      extras: draft.extras,
      driverName: name,
      driverEmail: email,
      totalPrice: total,
    });

    if (error) {
      setFormError(error);
      setSubmitting(false);
      return;
    }

    setDraft({ carId: null, extras: [] });
    router.push(`/confirmation?id=${bookingId}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>1. Extras</span>
        <span>—</span>
        <span className="text-foreground">2. Checkout</span>
        <span>—</span>
        <span>3. Confirmation</span>
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="card-surface rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold">Driver details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs text-muted">Full name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jordan Miller"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@email.com"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">Phone</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
            </div>
          </section>

          <section className="card-surface rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-accent" />
              <h2 className="font-display text-lg font-semibold">Payment</h2>
            </div>
            <p className="mt-1 text-xs text-muted">
              Demo checkout — no real payment is processed and no card data is transmitted.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs text-muted">Card number</span>
                <input
                  required
                  inputMode="numeric"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ""))}
                  placeholder="4242 4242 4242 4242"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">Expiry</span>
                <input
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">CVC</span>
                <input
                  required
                  inputMode="numeric"
                  maxLength={4}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                  placeholder="123"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="card-surface h-fit rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">{car.name}</h2>
          <p className="mt-1 text-xs text-muted">
            {draft.pickupLocation} · {draft.pickupDate} → {draft.dropoffDate}
          </p>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>{formatCurrency(car.pricePerDay)} × {days} day{days > 1 ? "s" : ""}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {extrasTotal > 0 && (
              <div className="flex justify-between text-muted">
                <span>Extras</span>
                <span>{formatCurrency(extrasTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted">
              <span>Service fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          {formError && (
            <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "Confirming…" : "Confirm and pay"}
          </button>
        </div>
      </form>
    </div>
  );
}
