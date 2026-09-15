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
      {/* Green brand tint anchored to the bottom, fading to transparent
          toward the top, so the photo reads as background texture rather
          than competing with the label. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(22,163,74,0.45) 0%, rgba(8,9,11,0.35) 40%, rgba(8,9,11,0.05) 75%)",
        }}
      />
      <span className="relative font-display text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
        {category}
      </span>
    </Link>
  );
}
