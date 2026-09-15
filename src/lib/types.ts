export type CarCategory =
  | "Economy"
  | "Sedan"
  | "SUV"
  | "Electric"
  | "Convertible"
  | "Supercar";

export type Transmission = "Automatic" | "Manual";

export interface Car {
  id: string;
  name: string;
  maker: string;
  category: CarCategory;
  pricePerDay: number;
  seats: number;
  bags: number;
  transmission: Transmission;
  topSpeedMph: number;
  zeroToSixty: number;
  rating: number;
  reviews: number;
  fuel: "Petrol" | "Electric" | "Hybrid";
  fuelEconomy: string;
  colorFrom: string;
  colorTo: string;
  featured?: boolean;
  description: string;
  features: string[];
  location: string;
}

export interface RentalLocation {
  id: string;
  city: string;
  country: string;
  address: string;
  hours: string;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
}

export interface Booking {
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
  createdAt: string;
  status: "Upcoming" | "Completed" | "Cancelled";
}
