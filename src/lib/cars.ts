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

export async function getCars(): Promise<Car[]> {
  const { data, error } = await supabasePublic
    .from("cars")
    .select("*")
    .order("id");
  if (error || !data) return [];
  return data.map(mapCarRow);
}

export async function getCarById(id: string): Promise<Car | undefined> {
  const { data, error } = await supabasePublic
    .from("cars")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapCarRow(data);
}

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
  { id: "los-angeles", city: "Los Angeles", country: "USA", address: "8721 Sunset Concourse, LA", hours: "24 / 7" },
  { id: "san-francisco", city: "San Francisco", country: "USA", address: "1 Embarcadero Center", hours: "6:00 AM – 11:00 PM" },
  { id: "miami", city: "Miami", country: "USA", address: "220 Biscayne Blvd", hours: "24 / 7" },
  { id: "new-york", city: "New York", country: "USA", address: "441 Madison Ave", hours: "24 / 7" },
  { id: "denver", city: "Denver", country: "USA", address: "1600 Larimer St", hours: "5:00 AM – 12:00 AM" },
  { id: "austin", city: "Austin", country: "USA", address: "301 Congress Ave", hours: "6:00 AM – 11:00 PM" },
  { id: "chicago", city: "Chicago", country: "USA", address: "875 N Michigan Ave", hours: "24 / 7" },
];

export const categories: CarCategory[] = [
  "Economy",
  "Sedan",
  "SUV",
  "Electric",
  "Convertible",
  "Supercar",
];
