"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users, Briefcase, Fuel, Milestone } from "lucide-react";
import { Car } from "@/lib/types";
import { formatCurrency, fuelEconomyLabel } from "@/lib/utils";
import { useHoverScale } from "@/lib/useHoverScale";

export default function CarCard({ car }: { car: Car }) {
  const ref = useHoverScale<HTMLAnchorElement>(1.04);

  return (
    <Link
      ref={ref}
      href={`/fleet/${car.id}`}
      className="group card-surface flex flex-col overflow-hidden rounded-2xl transition-shadow duration-300 hover:border-chrome/40 hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden">
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black shadow-sm">
          {car.category}
        </span>
        <Image
          src={`/cars/${car.id}.jpg`}
          alt={car.name}
          fill
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 90vw"
          quality={100}
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted">{car.maker}</p>
            <h3 className="font-display text-lg font-semibold text-foreground">{car.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-gold">
            <Star size={14} fill="currentColor" />
            {car.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Users size={13} /> {car.seats}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={13} /> {car.bags}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={13} /> {fuelEconomyLabel(car.category, car.fuel)}
          </span>
          <span className="flex items-center gap-1">
            <Milestone size={13} /> Unlimited mileage
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <span className="font-display text-xl font-semibold text-foreground">
              {formatCurrency(car.pricePerDay)}
            </span>
            <span className="text-xs text-muted"> / day</span>
          </div>
          <span className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}
