"use client";

import { useEffect, useState } from "react";
import { getCarById } from "./cars";
import { Car } from "./types";

export function useCar(carId: string | null) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(Boolean(carId));

  // Fetches the car from Supabase whenever carId changes (external system sync).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!carId) {
      setCar(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getCarById(carId).then((result) => {
      if (!cancelled) {
        setCar(result ?? null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [carId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { car, loading };
}
