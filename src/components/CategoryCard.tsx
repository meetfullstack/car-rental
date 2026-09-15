"use client";

import Link from "next/link";
import { useHoverScale } from "@/lib/useHoverScale";

export default function CategoryCard({ category }: { category: string }) {
  const ref = useHoverScale<HTMLAnchorElement>(1.05);

  return (
    <Link
      ref={ref}
      href={`/fleet?category=${category}`}
      className="card-surface flex h-28 flex-col items-center justify-center gap-2 rounded-xl hover:border-accent/50"
    >
      <span className="font-display text-sm font-medium">{category}</span>
    </Link>
  );
}
