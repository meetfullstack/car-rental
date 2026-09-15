"use client";

import Link from "next/link";
import { useHoverScale } from "@/lib/useHoverScale";
import { Car } from "@/lib/types";
import CarVisual from "./CarVisual";

export default function CategoryCard({
  category,
  car,
}: {
  category: string;
  car?: Car;
}) {
  const ref = useHoverScale<HTMLAnchorElement>(1.05);

  return (
    <Link
      ref={ref}
      href={`/fleet?category=${category}`}
      className="card-surface group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-xl hover:border-accent/50"
    >
      {car && (
        <CarVisual
          id={`cat-${car.id}`}
          colorFrom={car.colorFrom}
          colorTo={car.colorTo}
          className="absolute inset-0 h-full w-full scale-125 opacity-40"
        />
      )}
      {/* Green brand tint anchored to the bottom, fading to transparent
          toward the top, so the car art reads as background texture
          rather than competing with the label. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(22,163,74,0.4) 0%, rgba(22,163,74,0.12) 45%, transparent 75%)",
        }}
      />
      <span className="relative font-display text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
        {category}
      </span>
    </Link>
  );
}
