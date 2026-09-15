"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import { locations } from "@/lib/cars";
import { useBooking } from "@/lib/booking-context";
import { todayIso, addDaysIso } from "@/lib/utils";
import { useHoverScale } from "@/lib/useHoverScale";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";

export default function SearchWidget() {
  const router = useRouter();
  const { draft, setDraft } = useBooking();
  const searchRef = useHoverScale<HTMLButtonElement>(1.05);
  const [pickup, setPickup] = useState(draft.pickupLocation || "Toronto");
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
        <Select
          value={pickup}
          onChange={setPickup}
          options={locations.map((loc) => ({ value: loc.city, label: loc.city }))}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar size={13} /> Pickup date
        </span>
        <DatePicker value={pickupDate} onChange={setPickupDate} min={todayIso()} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar size={13} /> Drop-off date
        </span>
        <DatePicker value={dropoffDate} onChange={setDropoffDate} min={pickupDate} />
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
