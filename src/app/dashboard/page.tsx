"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, ArrowRight, Calendar, MapPin, X, Pencil, ShieldCheck } from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import { getCars, extras as allExtras } from "@/lib/cars";
import { Car } from "@/lib/types";
import { formatCurrency, daysBetween, calculatePricing } from "@/lib/utils";
import DatePicker from "@/components/ui/DatePicker";

const WINDOW_MS = 24 * 60 * 60 * 1000;

function isModifiable(status: string, pickupDate: string): boolean {
  if (status !== "Upcoming") return false;
  const pickup = new Date(pickupDate).getTime();
  if (Number.isNaN(pickup)) return false;
  return pickup - Date.now() >= WINDOW_MS;
}

export default function DashboardPage() {
  const { user, bookings, signOut, authLoading, cancelBooking, rescheduleBooking } = useBooking();
  const [carsById, setCarsById] = useState<Record<string, Car>>({});
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [modifyingId, setModifyingId] = useState<string | null>(null);
  const [newPickup, setNewPickup] = useState("");
  const [newDropoff, setNewDropoff] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [modifyError, setModifyError] = useState<string | null>(null);

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

  async function handleCancel(bookingId: string) {
    setCancellingId(bookingId);
    setCancelError(null);
    const { error } = await cancelBooking(bookingId);
    setCancellingId(null);
    setConfirmingId(null);
    if (error) setCancelError(error);
  }

  function startModify(bookingId: string, pickupDate: string, dropoffDate: string) {
    setModifyingId(bookingId);
    setNewPickup(pickupDate);
    setNewDropoff(dropoffDate);
    setModifyError(null);
  }

  async function handleSaveModify(bookingId: string, car: Car) {
    setModifyError(null);
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const days = Math.max(daysBetween(newPickup, newDropoff), 1);
    if (!newPickup || !newDropoff || newDropoff <= newPickup) {
      setModifyError("Drop-off date must be after the pickup date.");
      return;
    }

    const { total } = calculatePricing(car.pricePerDay, days, booking.extras, allExtras);
    setSavingId(bookingId);
    const { error } = await rescheduleBooking(bookingId, newPickup, newDropoff, total);
    setSavingId(null);
    if (error) {
      setModifyError(error);
      return;
    }
    setModifyingId(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-accent">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {user.isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/10"
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-chrome/50 hover:text-foreground"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold">
          Your bookings {bookings.length > 0 && `(${bookings.length})`}
        </h2>

        {cancelError && (
          <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent">
            {cancelError}
          </p>
        )}

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
              const modifiable = isModifiable(booking.status, booking.pickupDate);
              const confirming = confirmingId === booking.id;
              const cancelling = cancellingId === booking.id;
              const modifying = modifyingId === booking.id;
              const saving = savingId === booking.id;

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
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs ${
                          booking.status === "Cancelled"
                            ? "border-accent/40 text-accent"
                            : "border-border text-muted"
                        }`}
                      >
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

                    {booking.status === "Upcoming" && (
                      <div className="mt-3">
                        {modifying ? (
                          <div className="space-y-2 rounded-lg border border-border p-3">
                            <div className="flex flex-wrap gap-2">
                              <DatePicker value={newPickup} onChange={setNewPickup} />
                              <DatePicker value={newDropoff} onChange={setNewDropoff} min={newPickup} />
                            </div>
                            {modifyError && <p className="text-xs text-accent">{modifyError}</p>}
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => handleSaveModify(booking.id, car)}
                                disabled={saving}
                                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
                              >
                                {saving ? "Saving…" : "Save changes"}
                              </button>
                              <button
                                onClick={() => setModifyingId(null)}
                                className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : confirming ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-muted">Cancel this booking?</span>
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={cancelling}
                              className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
                            >
                              {cancelling ? "Cancelling…" : "Yes, cancel"}
                            </button>
                            <button
                              onClick={() => setConfirmingId(null)}
                              className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground"
                            >
                              Keep booking
                            </button>
                          </div>
                        ) : modifiable ? (
                          <div className="flex flex-wrap items-center gap-4">
                            <button
                              onClick={() => startModify(booking.id, booking.pickupDate, booking.dropoffDate)}
                              className="flex items-center gap-1 text-xs text-muted underline underline-offset-4 hover:text-accent"
                            >
                              <Pencil size={12} /> Modify dates
                            </button>
                            <button
                              onClick={() => setConfirmingId(booking.id)}
                              className="flex items-center gap-1 text-xs text-muted underline underline-offset-4 hover:text-accent"
                            >
                              <X size={12} /> Cancel booking
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted">
                            Too close to pickup to change — modifications and free cancellation end 24 hours before pickup.
                          </p>
                        )}
                      </div>
                    )}
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
