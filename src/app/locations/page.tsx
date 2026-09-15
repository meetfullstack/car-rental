import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { locations } from "@/lib/cars";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Locations — Velocity" };

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-sm text-accent">Locations</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
          Available in 38 cities
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Pick up in one city and drop off in another at no extra charge.
          Here are a few of our flagship locations.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc, i) => (
          <Reveal key={loc.id} delay={i * 0.06} className="card-surface rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">{loc.city}</h2>
                <p className="text-xs text-muted">{loc.country}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-accent">
                <MapPin size={15} />
              </span>
            </div>
            <p className="mt-4 text-sm text-muted">{loc.address}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <Clock size={12} /> {loc.hours}
            </p>
            <Link
              href={`/fleet`}
              className="mt-5 flex items-center gap-1.5 text-sm text-accent"
            >
              View fleet in {loc.city} <ArrowRight size={13} />
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
