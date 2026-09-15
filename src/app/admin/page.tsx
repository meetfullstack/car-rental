"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Search } from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import { createClient } from "@/utils/supabase/client";
import { getCars } from "@/lib/cars";
import { Booking, Car } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type StatusFilter = "All" | Booking["status"];

function mapBookingRow(row: {
  id: string;
  car_id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  extras: string[];
  driver_name: string;
  driver_email: string;
  total_price: number;
  status: string;
  created_at: string;
}): Booking {
  return {
    id: row.id,
    carId: row.car_id,
    pickupLocation: row.pickup_location,
    dropoffLocation: row.dropoff_location,
    pickupDate: row.pickup_date,
    dropoffDate: row.dropoff_date,
    extras: row.extras,
    driverName: row.driver_name,
    driverEmail: row.driver_email,
    totalPrice: row.total_price,
    status: row.status as Booking["status"],
    createdAt: row.created_at,
  };
}

export default function AdminPage() {
  const { user, authLoading } = useBooking();
  const supabase = useMemo(() => createClient(), []);
  const [carsById, setCarsById] = useState<Record<string, Car>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("pickup_date", { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setBookings((data ?? []).map(mapBookingRow));
    }
    setLoading(false);
  }, [supabase]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user?.isAdmin) return;
    getCars().then((cars) => setCarsById(Object.fromEntries(cars.map((c) => [c.id, c]))));
    loadAll();
  }, [user, loadAll]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-sm text-muted">This area is restricted to Velocity staff.</p>
        <Link
          href="/login?next=/admin"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Sign in <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
        <p className="mt-2 text-sm text-muted">Your account doesn&rsquo;t have staff access.</p>
      </div>
    );
  }

  async function updateStatus(bookingId: string, status: Booking["status"]) {
    setUpdatingId(bookingId);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
    setUpdatingId(null);
    if (error) {
      setError(error.message);
      return;
    }
    await loadAll();
  }

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "All" && b.status !== statusFilter) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    const car = carsById[b.carId];
    return (
      b.id.toLowerCase().includes(q) ||
      b.driverName.toLowerCase().includes(q) ||
      b.driverEmail.toLowerCase().includes(q) ||
      car?.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center gap-2 text-sm text-accent">
        <ShieldCheck size={16} /> Staff area
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold">All bookings</h1>
      <p className="mt-1 text-sm text-muted">{bookings.length} total across every driver</p>

      {error && (
        <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-2">
          <Search size={14} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search driver, email, car, or ref"
            className="w-56 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", "Upcoming", "Completed", "Cancelled"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                statusFilter === s
                  ? "border-accent text-accent"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="bg-surface-2 text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Ref</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Car</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                  Loading bookings…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                  No bookings match.
                </td>
              </tr>
            ) : (
              filtered.map((b) => {
                const car = carsById[b.carId];
                const updating = updatingId === b.id;
                return (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                    <td className="px-4 py-3">
                      <p>{b.driverName}</p>
                      <p className="text-xs text-muted">{b.driverEmail}</p>
                    </td>
                    <td className="px-4 py-3">{car?.name ?? b.carId}</td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {b.pickupDate} → {b.dropoffDate}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(b.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs ${
                          b.status === "Cancelled"
                            ? "border-accent/40 text-accent"
                            : b.status === "Completed"
                              ? "border-border text-foreground"
                              : "border-border text-muted"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.status === "Upcoming" && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(b.id, "Completed")}
                            disabled={updating}
                            className="rounded-full border border-border px-2.5 py-1 text-xs hover:text-foreground disabled:opacity-60"
                          >
                            Mark completed
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, "Cancelled")}
                            disabled={updating}
                            className="rounded-full border border-accent/40 px-2.5 py-1 text-xs text-accent hover:bg-accent/10 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
