"use client";

import Image from "next/image";
import Link from "next/link";
import { useHoverScale } from "@/lib/useHoverScale";

export default function CategoryCard({ category }: { category: string }) {
  const ref = useHoverScale<HTMLAnchorElement>(1.05);

  return (
    <Link
      ref={ref}
      href={`/fleet?category=${category}`}
      className="card-surface group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-xl hover:border-accent/50"
    >
      <Image
        src={`/categories/${category.toLowerCase()}.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover"
      />
      {/* Thin glowing green line along the bottom edge instead of a full
          tint overlay, so the photo shows through clean. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-accent"
        style={{ boxShadow: "0 0 16px 4px rgba(22,163,74,0.7)" }}
      />
      <span className="relative font-display text-sm font-medium text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
        {category}
      </span>
    </Link>
  );
}
