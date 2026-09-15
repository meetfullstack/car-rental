import { cache } from "react";
import { Car, CarCategory, Extra, RentalLocation } from "./types";
import { supabasePublic } from "./supabase-public";
import type { Database } from "./database.types";

type CarRow = Database["public"]["Tables"]["cars"]["Row"];

function mapCarRow(row: CarRow): Car {
  return {
    id: row.id,
    name: row.name,
    maker: row.maker,
    category: row.category as CarCategory,
    pricePerDay: row.price_per_day,
    seats: row.seats,
    bags: row.bags,
    transmission: row.transmission as Car["transmission"],
    topSpeedMph: row.top_speed_mph,
    zeroToSixty: row.zero_to_sixty,
    rating: row.rating,
    reviews: row.reviews,
    fuel: row.fuel as Car["fuel"],
    colorFrom: row.color_from,
    colorTo: row.color_to,
    featured: row.featured,
    description: row.description,
    features: row.features,
    location: row.location,
  };
}

// Both deduped with React's cache() so a page and its generateMetadata
// (separate calls per request/build in the App Router) share one fetch
// each instead of hitting Supabase independently. getCarById stays a
// targeted single-row query rather than routing through getCars() — the
// client-side useCar hook calls it too, and fetching all 12+ cars just
// to find one would be wasteful there.
export const getCars = cache(async (): Promise<Car[]> => {
  const { data, error } = await supabasePublic
    .from("cars")
    .select("*")
    .order("id");
  if (error || !data) return [];
  return data.map(mapCarRow);
});

export const getCarById = cache(async (id: string): Promise<Car | undefined> => {
  const { data, error } = await supabasePublic
    .from("cars")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapCarRow(data);
});

export async function getFeaturedCars(): Promise<Car[]> {
  const { data, error } = await supabasePublic
    .from("cars")
    .select("*")
    .eq("featured", true)
    .order("id");
  if (error || !data) return [];
  return data.map(mapCarRow);
}

export const extras: Extra[] = [
  {
    id: "insurance-premium",
    name: "Premium Protection",
    description: "Zero-deductible coverage for collision, theft, and tire damage.",
    pricePerDay: 29,
  },
  {
    id: "second-driver",
    name: "Additional Driver",
    description: "Add a second authorized driver to the rental agreement.",
    pricePerDay: 12,
  },
  {
    id: "child-seat",
    name: "Child Seat",
    description: "Rear-facing, forward-facing, or booster — your choice at pickup.",
    pricePerDay: 8,
  },
  {
    id: "wifi-hotspot",
    name: "Wi-Fi Hotspot",
    description: "Unlimited in-car 5G Wi-Fi for up to 8 devices.",
    pricePerDay: 10,
  },
  {
    id: "delivery",
    name: "Doorstep Delivery",
    description: "Skip the counter — we bring the car to you and pick it up after.",
    pricePerDay: 19,
  },
];

export const locations: RentalLocation[] = [
  { id: "toronto", city: "Toronto", country: "Canada", address: "100 Front St W, Toronto", hours: "24 / 7" },
  { id: "vancouver", city: "Vancouver", country: "Canada", address: "900 Canada Pl, Vancouver", hours: "6:00 AM – 11:00 PM" },
  { id: "montreal", city: "Montreal", country: "Canada", address: "1000 Rue Sainte-Catherine O, Montreal", hours: "24 / 7" },
  { id: "ottawa", city: "Ottawa", country: "Canada", address: "90 Sparks St, Ottawa", hours: "24 / 7" },
  { id: "calgary", city: "Calgary", country: "Canada", address: "200 8 Ave SW, Calgary", hours: "5:00 AM – 12:00 AM" },
  { id: "edmonton", city: "Edmonton", country: "Canada", address: "101 Jasper Ave, Edmonton", hours: "6:00 AM – 11:00 PM" },
  { id: "winnipeg", city: "Winnipeg", country: "Canada", address: "393 Portage Ave, Winnipeg", hours: "24 / 7" },
  { id: "kingston", city: "Kingston", country: "Canada", address: "175 Ontario St, Kingston", hours: "7:00 AM – 10:00 PM" },
];

export const categories: CarCategory[] = [
  "Economy",
  "Sedan",
  "SUV",
  "Electric",
  "Convertible",
  "Supercar",
];
