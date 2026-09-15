"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import { locations } from "@/lib/cars";
import { useBooking } from "@/lib/booking-context";
import { todayIso, addDaysIso } from "@/lib/utils";
import { useHoverScale } from "@/lib/useHoverScale";

export default function SearchWidget() {
  const router = useRouter();
  const { draft, setDraft } = useBooking();
  const searchRef = useHoverScale<HTMLButtonElement>(1.05);
  const [pickup, setPickup] = useState(draft.pickupLocation || "Los Angeles");
  const [pickupDate, setPickupDate] = useState(draft.pickupDate || todayIso());
  const [dropoffDate, setDropoffDate] = useState(
    draft.dropoffDate || addDaysIso(todayIso(), 3)
  );

  function handleSearch() {
    setDraft({
      pickupLocation: pickup,
      dropoffLocation: pickup,
      pickupDate,
      dropoffDate,
    });
    router.push("/fleet");
  }

  return (
    <div className="card-surface noise-overlay grid gap-4 rounded-2xl p-5 shadow-2xl shadow-black/40 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-end">
      <label className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={13} /> Pickup location
        </span>
        <select
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.city}>
              {loc.city}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar size={13} /> Pickup date
        </span>
        <input
          type="date"
          min={todayIso()}
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar size={13} /> Drop-off date
        </span>
        <input
          type="date"
          min={pickupDate}
          value={dropoffDate}
          onChange={(e) => setDropoffDate(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <button
        ref={searchRef}
        onClick={handleSearch}
        className="flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <Search size={15} />
        Search
      </button>
    </div>
  );
}
