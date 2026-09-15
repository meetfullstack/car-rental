"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  name: string;
  email: string;
}

interface BookingContextValue {
  draft: DraftBooking;
  setDraft: (patch: Partial<DraftBooking>) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  hydrated: boolean;
}

const defaultDraft: DraftBooking = {
  carId: null,
  pickupLocation: "Los Angeles",
  dropoffLocation: "Los Angeles",
  pickupDate: "",
  dropoffDate: "",
  extras: [],
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraftState] = useState<DraftBooking>(defaultDraft);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // One-time hydration from localStorage (an external system) on mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem("velocity:draft");
      const storedBookings = localStorage.getItem("velocity:bookings");
      const storedUser = localStorage.getItem("velocity:user");
      if (storedDraft) setDraftState(JSON.parse(storedDraft));
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      if (storedUser) setUser(JSON.parse(storedUser));
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

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("velocity:bookings", JSON.stringify(bookings));
  }, [bookings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem("velocity:user", JSON.stringify(user));
    else localStorage.removeItem("velocity:user");
  }, [user, hydrated]);

  const setDraft = useCallback((patch: Partial<DraftBooking>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  }, []);

  const login = useCallback((u: AuthUser) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ draft, setDraft, bookings, addBooking, user, login, logout, hydrated }),
    [draft, setDraft, bookings, addBooking, user, login, logout, hydrated]
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
