"use client";

import Link from "next/link";
import { Star, Users, Briefcase, Gauge } from "lucide-react";
import { Car } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useHoverScale } from "@/lib/useHoverScale";
import CarVisual from "./CarVisual";

export default function CarCard({ car }: { car: Car }) {
  const ref = useHoverScale<HTMLAnchorElement>(1.02);

  return (
    <Link
      ref={ref}
      href={`/fleet/${car.id}`}
      className="group card-surface flex flex-col overflow-hidden rounded-2xl hover:border-chrome/40"
    >
      <div
        className="relative flex items-center justify-center overflow-hidden px-6 pt-8"
        style={{
          background: `radial-gradient(120% 100% at 50% 100%, ${car.colorFrom}22 0%, transparent 70%)`,
        }}
      >
        <span className="absolute left-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted backdrop-blur">
          {car.category}
        </span>
        <CarVisual
          id={car.id}
          colorFrom={car.colorFrom}
          colorTo={car.colorTo}
          className="w-full max-w-[280px] transition-transform duration-500 group-hover:scale-105"
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

        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Users size={13} /> {car.seats}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={13} /> {car.bags}
          </span>
          <span className="flex items-center gap-1">
            <Gauge size={13} /> {car.zeroToSixty}s 0–60
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
