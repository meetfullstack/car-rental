"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, ArrowRight } from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import { getCarById, extras as allExtras } from "@/lib/cars";
import CarVisual from "@/components/CarVisual";
import { formatCurrency, daysBetween } from "@/lib/utils";

export default function BookingPage() {
  const router = useRouter();
  const { draft, setDraft, hydrated } = useBooking();
  const [selectedExtras, setSelectedExtras] = useState<string[]>(draft.extras || []);

  const car = draft.carId ? getCarById(draft.carId) : undefined;

  if (hydrated && !car) {
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

  if (!car) return null;

  const days = Math.max(daysBetween(draft.pickupDate, draft.dropoffDate), 1);
  const subtotal = days * car.pricePerDay;
  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = allExtras.find((e) => e.id === id);
    return sum + (extra ? extra.pricePerDay * days : 0);
  }, 0);
  const serviceFee = Math.round((subtotal + extrasTotal) * 0.08);
  const total = subtotal + extrasTotal + serviceFee;

  function toggleExtra(id: string) {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    setDraft({ extras: selectedExtras });
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="text-foreground">1. Extras</span>
        <span>—</span>
        <span>2. Checkout</span>
        <span>—</span>
        <span>3. Confirmation</span>
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold">Customize your rental</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="card-surface flex items-center gap-6 rounded-2xl p-5">
            <CarVisual id={car.id} colorFrom={car.colorFrom} colorTo={car.colorTo} className="w-40" />
            <div>
              <p className="text-xs text-muted">{car.maker}</p>
              <h2 className="font-display text-xl font-semibold">{car.name}</h2>
              <p className="mt-1 text-xs text-muted">
                {draft.pickupLocation} · {draft.pickupDate} → {draft.dropoffDate} ({days} day{days > 1 ? "s" : ""})
              </p>
            </div>
          </div>

          <h2 className="mt-8 font-display text-lg font-semibold">Add extras</h2>
          <div className="mt-4 space-y-3">
            {allExtras.map((extra) => {
              const active = selectedExtras.includes(extra.id);
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`card-surface flex w-full items-center justify-between rounded-xl p-4 text-left transition-colors ${
                    active ? "border-accent/60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {active ? (
                      <CheckSquare size={18} className="text-accent" />
                    ) : (
                      <Square size={18} className="text-muted" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{extra.name}</p>
                      <p className="text-xs text-muted">{extra.description}</p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-sm text-muted">
                    +{formatCurrency(extra.pricePerDay)}/day
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-surface h-fit rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Price summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>{formatCurrency(car.pricePerDay)} × {days} day{days > 1 ? "s" : ""}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {selectedExtras.length > 0 && (
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
          <button
            onClick={handleContinue}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Continue to checkout <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
