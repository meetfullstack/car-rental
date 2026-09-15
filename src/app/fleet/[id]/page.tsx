import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Users, Briefcase, Gauge, Fuel, Cog, Zap, CheckCircle2 } from "lucide-react";
import { getCars, getCarById } from "@/lib/cars";
import { formatCurrency } from "@/lib/utils";
import CarVisual from "@/components/CarVisual";
import CarCard from "@/components/CarCard";
import BookingPanel from "@/components/BookingPanel";

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((car) => ({ id: car.id }));
}

export default async function CarDetailPage({ params }: PageProps<"/fleet/[id]">) {
  const { id } = await params;
  const allCars = await getCars();
  const car = allCars.find((c) => c.id === id);
  if (!car) notFound();

  const similar = allCars.filter((c) => c.category === car.category && c.id !== car.id).slice(0, 3);

  const specs = [
    { icon: Users, label: "Seats", value: `${car.seats}` },
    { icon: Briefcase, label: "Luggage", value: `${car.bags} bags` },
    { icon: Cog, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel", value: car.fuel },
    { icon: Gauge, label: "0–60 mph", value: `${car.zeroToSixty}s` },
    { icon: Zap, label: "Top speed", value: `${car.topSpeedMph} mph` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <nav className="text-xs text-muted">
        <Link href="/fleet" className="hover:text-foreground">Fleet</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{car.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div
            className="card-surface flex items-center justify-center rounded-2xl p-10"
            style={{
              background: `radial-gradient(120% 100% at 50% 100%, ${car.colorFrom}22 0%, transparent 70%)`,
            }}
          >
            <CarVisual id={car.id} colorFrom={car.colorFrom} colorTo={car.colorTo} className="w-full max-w-lg" />
          </div>

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{car.maker} · {car.category}</p>
              <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{car.name}</h1>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-gold">
              <Star size={14} fill="currentColor" />
              {car.rating.toFixed(1)}
              <span className="text-muted">({car.reviews} reviews)</span>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{car.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label} className="card-surface rounded-xl p-4">
                <spec.icon size={16} className="text-accent" />
                <p className="mt-2 text-xs text-muted">{spec.label}</p>
                <p className="text-sm font-medium">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold">What&rsquo;s included</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {car.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 size={15} className="text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <BookingPanel car={car} />
      </div>

      {similar.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl font-semibold">Similar vehicles</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps<"/fleet/[id]">) {
  const { id } = await params;
  const car = await getCarById(id);
  if (!car) return { title: "Vehicle not found — Velocity" };
  return {
    title: `${car.name} — Velocity`,
    description: `Rent the ${car.name} from ${formatCurrency(car.pricePerDay)}/day.`,
  };
}
