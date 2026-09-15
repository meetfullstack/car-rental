"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { Car } from "@/lib/types";
import { locations } from "@/lib/cars";
import { useBooking } from "@/lib/booking-context";
import { formatCurrency, todayIso, addDaysIso, daysBetween } from "@/lib/utils";
import Select from "@/components/ui/LazySelect";
import DatePicker from "@/components/ui/LazyDatePicker";

export default function BookingPanel({ car }: { car: Car }) {
  const router = useRouter();
  const { draft, setDraft } = useBooking();

  const [pickupLocation, setPickupLocation] = useState(draft.pickupLocation || car.location);
  const [pickupDate, setPickupDate] = useState(draft.pickupDate || todayIso());
  const [dropoffDate, setDropoffDate] = useState(
    draft.dropoffDate || addDaysIso(todayIso(), 3)
  );

  const days = Math.max(daysBetween(pickupDate, dropoffDate), 1);
  const subtotal = days * car.pricePerDay;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  function handleContinue() {
    setDraft({
      carId: car.id,
      pickupLocation,
      dropoffLocation: pickupLocation,
      pickupDate,
      dropoffDate,
    });
    router.push("/booking");
  }

  return (
    <div className="card-surface h-fit rounded-2xl p-6 lg:sticky lg:top-24">
      <div className="flex items-end justify-between">
        <div>
          <span className="font-display text-3xl font-semibold">{formatCurrency(car.pricePerDay)}</span>
          <span className="text-sm text-muted"> / day</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <MapPin size={13} /> Pickup location
          </span>
          <Select
            value={pickupLocation}
            onChange={setPickupLocation}
            options={locations.map((loc) => ({ value: loc.city, label: loc.city }))}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar size={13} /> Pickup
            </span>
            <DatePicker value={pickupDate} onChange={setPickupDate} min={todayIso()} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar size={13} /> Drop-off
            </span>
            <DatePicker value={dropoffDate} onChange={setDropoffDate} min={pickupDate} />
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted">
          <span>{formatCurrency(car.pricePerDay)} × {days} day{days > 1 ? "s" : ""}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Service fee</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-medium">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Continue to booking
      </button>
      <p className="mt-3 text-center text-xs text-muted">Free cancellation up to 24 hours before pickup</p>
    </div>
  );
}
