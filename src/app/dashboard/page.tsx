"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, ArrowRight, Calendar, MapPin } from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import { getCars } from "@/lib/cars";
import { Car } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user, bookings, signOut, authLoading } = useBooking();
  const [carsById, setCarsById] = useState<Record<string, Car>>({});

  useEffect(() => {
    getCars().then((cars) => {
      setCarsById(Object.fromEntries(cars.map((c) => [c.id, c])));
    });
  }, []);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Sign in to view your bookings</h1>
        <p className="mt-2 text-sm text-muted">Your rental history and upcoming trips live here.</p>
        <Link
          href="/login?next=/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Sign in <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-accent">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-chrome/50 hover:text-foreground"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold">
          Your bookings {bookings.length > 0 && `(${bookings.length})`}
        </h2>

        {bookings.length === 0 ? (
          <div className="card-surface mt-4 rounded-2xl p-12 text-center">
            <p className="text-sm text-muted">You have no bookings yet.</p>
            <Link
              href="/fleet"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
            >
              Browse the fleet <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {bookings.map((booking) => {
              const car = carsById[booking.carId];
              if (!car) return null;
              return (
                <div key={booking.id} className="card-surface flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={`/cars/${car.id}.jpg`}
                      alt={car.name}
                      fill
                      sizes="128px"
                      quality={90}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{car.name}</h3>
                      <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {booking.pickupLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {booking.pickupDate} → {booking.dropoffDate}
                      </span>
                      <span>Ref #{booking.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold">{formatCurrency(booking.totalPrice)}</p>
                    <p className="text-xs text-muted">total paid</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
