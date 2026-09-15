import { supabasePublic } from "./supabase-public";

/**
 * Car ids with an overlapping Upcoming booking for the given date range.
 * Backed by a security-definer RPC so this works for signed-out visitors
 * too, without exposing any booking details beyond the car id.
 */
export async function getUnavailableCarIds(
  pickupDate: string,
  dropoffDate: string
): Promise<Set<string>> {
  if (!pickupDate || !dropoffDate) return new Set();

  const { data, error } = await supabasePublic.rpc("unavailable_car_ids", {
    p_pickup: pickupDate,
    p_dropoff: dropoffDate,
  });

  if (error || !data) return new Set();
  return new Set(data);
}
