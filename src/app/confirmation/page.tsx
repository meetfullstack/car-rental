"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import { getCarById } from "@/lib/cars";
import { formatCurrency } from "@/lib/utils";
import CarVisual from "@/components/CarVisual";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { bookings } = useBooking();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Booking not found</h1>
        <p className="mt-2 text-sm text-muted">This confirmation link is no longer valid.</p>
        <Link
          href="/fleet"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Browse the fleet <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const car = getCarById(booking.carId);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <CheckCircle2 size={28} />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold">Booking confirmed</h1>
        <p className="mt-2 text-sm text-muted">
          A confirmation has been sent to {booking.driverEmail}. Reference #{booking.id}.
        </p>
      </div>

      <div className="card-surface mt-10 rounded-2xl p-6">
        {car && (
          <div className="flex items-center gap-6">
            <CarVisual id={car.id} colorFrom={car.colorFrom} colorTo={car.colorTo} className="w-32" />
            <div>
              <p className="text-xs text-muted">{car.maker}</p>
              <h2 className="font-display text-xl font-semibold">{car.name}</h2>
            </div>
          </div>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
          <div>
            <dt className="text-xs text-muted">Pickup</dt>
            <dd className="mt-1">{booking.pickupLocation}</dd>
            <dd className="text-muted">{booking.pickupDate}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Drop-off</dt>
            <dd className="mt-1">{booking.dropoffLocation}</dd>
            <dd className="text-muted">{booking.dropoffDate}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Driver</dt>
            <dd className="mt-1">{booking.driverName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Total paid</dt>
            <dd className="mt-1 font-medium">{formatCurrency(booking.totalPrice)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="flex-1 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          View my bookings
        </Link>
        <Link
          href="/fleet"
          className="flex-1 rounded-full border border-border px-5 py-3 text-center text-sm text-foreground transition-colors hover:border-chrome/50"
        >
          Book another car
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
