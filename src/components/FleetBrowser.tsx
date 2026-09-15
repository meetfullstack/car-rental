"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { categories } from "@/lib/cars";
import { Car, CarCategory, Transmission } from "@/lib/types";
import CarCard from "@/components/CarCard";
import Select from "@/components/ui/Select";

const transmissions: Transmission[] = ["Automatic", "Manual"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function FleetBrowser({ cars }: { cars: Car[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CarCategory | null;

  const [category, setCategory] = useState<CarCategory | "All">(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All"
  );
  const [transmission, setTransmission] = useState<Transmission | "All">("All");
  const [maxPrice, setMaxPrice] = useState(600);
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = cars.filter((car) => {
      if (category !== "All" && car.category !== category) return false;
      if (transmission !== "All" && car.transmission !== transmission) return false;
      if (car.pricePerDay > maxPrice) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));

    return list;
  }, [cars, category, transmission, maxPrice, sort]);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="card-surface h-fit rounded-2xl p-5 lg:sticky lg:top-24">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal size={15} />
          Filters
        </div>

        <div className="mt-5">
          <p className="text-xs text-muted">Category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("All")}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                category === "All"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  category === c
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs text-muted">Transmission</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setTransmission("All")}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                transmission === "All"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              All
            </button>
            {transmissions.map((t) => (
              <button
                key={t}
                onClick={() => setTransmission(t)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  transmission === t
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Max price / day</span>
            <span className="text-foreground">${maxPrice}</span>
          </div>
          <input
            type="range"
            min={50}
            max={600}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent)]"
          />
        </div>
      </aside>

      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">{filtered.length} vehicles available</p>
          <Select
            value={sort}
            onChange={setSort}
            options={sortOptions}
            className="flex w-auto min-w-[180px] items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-accent data-[state=open]:border-accent"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="card-surface mt-8 rounded-2xl p-12 text-center text-sm text-muted">
            No vehicles match those filters. Try widening your search.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
