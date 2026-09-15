"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { Booking } from "./types";

interface DraftBooking {
  carId: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  extras: string[];
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface NewBookingInput {
  id: string;
  carId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  extras: string[];
  driverName: string;
  driverEmail: string;
  totalPrice: number;
}

interface AuthResult {
  error?: string;
}

interface BookingContextValue {
  draft: DraftBooking;
  setDraft: (patch: Partial<DraftBooking>) => void;
  bookings: Booking[];
  addBooking: (booking: NewBookingInput) => Promise<AuthResult>;
  cancelBooking: (bookingId: string) => Promise<AuthResult>;
  user: AuthUser | null;
  authLoading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  hydrated: boolean;
}

const defaultDraft: DraftBooking = {
  carId: null,
  pickupLocation: "Toronto",
  dropoffLocation: "Toronto",
  pickupDate: "",
  dropoffDate: "",
  extras: [],
};

const BookingContext = createContext<BookingContextValue | null>(null);

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

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [draft, setDraftState] = useState<DraftBooking>(defaultDraft);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // One-time hydration of the ephemeral draft from localStorage on mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem("velocity:draft");
      if (storedDraft) setDraftState(JSON.parse(storedDraft));
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("velocity:draft", JSON.stringify(draft));
  }, [draft, hydrated]);

  const loadBookings = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setBookings((data ?? []).map(mapBookingRow));
    },
    [supabase]
  );

  const applySession = useCallback(
    async (sessionUser: { id: string; email?: string } | null) => {
      if (!sessionUser) {
        setUser(null);
        setBookings([]);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", sessionUser.id)
        .maybeSingle();

      setUser({
        id: sessionUser.id,
        name: profile?.full_name || sessionUser.email?.split("@")[0] || "Driver",
        email: profile?.email || sessionUser.email || "",
      });
      await loadBookings(sessionUser.id);
    },
    [supabase, loadBookings]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session?.user ?? null).finally(() =>
        setAuthLoading(false)
      );
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        applySession(session?.user ?? null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, [supabase, applySession]);

  const setDraft = useCallback((patch: Partial<DraftBooking>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      return error ? { error: error.message } : {};
    },
    [supabase]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return error ? { error: error.message } : {};
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const addBooking = useCallback(
    async (booking: NewBookingInput): Promise<AuthResult> => {
      if (!user) return { error: "You must be signed in to book a car." };

      const { error } = await supabase.from("bookings").insert({
        id: booking.id,
        user_id: user.id,
        car_id: booking.carId,
        pickup_location: booking.pickupLocation,
        dropoff_location: booking.dropoffLocation,
        pickup_date: booking.pickupDate,
        dropoff_date: booking.dropoffDate,
        extras: booking.extras,
        driver_name: booking.driverName,
        driver_email: booking.driverEmail,
        total_price: booking.totalPrice,
      });

      if (error) return { error: error.message };
      await loadBookings(user.id);
      return {};
    },
    [supabase, user, loadBookings]
  );

  const cancelBooking = useCallback(
    async (bookingId: string): Promise<AuthResult> => {
      if (!user) return { error: "You must be signed in to cancel a booking." };

      const { error } = await supabase
        .from("bookings")
        .update({ status: "Cancelled" })
        .eq("id", bookingId)
        .eq("user_id", user.id);

      if (error) return { error: error.message };
      await loadBookings(user.id);
      return {};
    },
    [supabase, user, loadBookings]
  );

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      bookings,
      addBooking,
      cancelBooking,
      user,
      authLoading,
      signUp,
      signIn,
      signOut,
      hydrated,
    }),
    [
      draft,
      setDraft,
      bookings,
      addBooking,
      cancelBooking,
      user,
      authLoading,
      signUp,
      signIn,
      signOut,
      hydrated,
    ]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
