import { Suspense } from "react";
import FleetBrowser from "@/components/FleetBrowser";
import { getCars } from "@/lib/cars";

export const metadata = {
  title: "Fleet — Velocity",
};

export default async function FleetPage() {
  const cars = await getCars();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div>
        <p className="text-sm text-accent">The fleet</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Find your next ride
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted">
          {`Filter by category, price, and transmission to find a car that fits the drive.`}
        </p>
      </div>
      <Suspense>
        <FleetBrowser cars={cars} />
      </Suspense>
    </div>
  );
}
