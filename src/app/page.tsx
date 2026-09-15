import Link from "next/link";
import { ShieldCheck, Clock, MapPinned, Star, ArrowRight } from "lucide-react";
import { getFeaturedCars, categories } from "@/lib/cars";
import CarCard from "@/components/CarCard";
import SearchWidget from "@/components/SearchWidget";
import Reveal from "@/components/Reveal";
import HeroVideo from "@/components/HeroVideo";

const stats = [
  { label: "Vehicles in fleet", value: "1,200+" },
  { label: "Cities served", value: "38" },
  { label: "Avg. rating", value: "4.8/5" },
  { label: "Delivered on time", value: "99.2%" },
];

const steps = [
  {
    title: "Choose your car",
    description: "Filter by category, price, and location to find the perfect match.",
  },
  {
    title: "Pick your dates",
    description: "Flexible pickup and drop-off with free cancellation up to 24h out.",
  },
  {
    title: "Drive away",
    description: "Skip the counter — we deliver to your door or meet you curbside.",
  },
];

const testimonials = [
  {
    quote:
      "Booked the Aria GT for a weekend and the whole process took under two minutes. Car was spotless and delivered early.",
    name: "Jordan M.",
    role: "Los Angeles",
  },
  {
    quote:
      "Velocity's pricing is the most transparent I've seen — no surprise fees at pickup, which is rare in this industry.",
    name: "Priya K.",
    role: "San Francisco",
  },
  {
    quote:
      "Switched our company's travel program to Velocity. The Atlas Summit has been perfect for client trips.",
    name: "Daniel R.",
    role: "Denver",
  },
];

export default async function Home() {
  const featured = await getFeaturedCars();

  return (
    <div>
      {/* Hero */}
      <section data-hero className="relative overflow-hidden">
        <HeroVideo />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 sm:pt-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs text-white/80 backdrop-blur">
              <Star size={12} className="text-gold" fill="currentColor" />
              Rated 4.8/5 by 12,000+ renters
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
              Rent the
              <span className="text-gradient-chrome"> extraordinary.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-base text-white/70 sm:text-lg">
              From daily drivers to weekend supercars, Velocity puts an
              exceptional fleet, honest pricing, and doorstep delivery within
              reach — in 38 cities and counting.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto mt-10 max-w-4xl">
            <SearchWidget />
          </Reveal>

          <Reveal delay={0.25}>
            <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-semibold text-white sm:text-3xl">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Featured fleet */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-accent">Featured fleet</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Built to turn heads
            </h2>
          </div>
          <Link
            href="/fleet"
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            View all vehicles <ArrowRight size={14} />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((car, i) => (
            <Reveal key={car.id} delay={i * 0.08}>
              <CarCard car={car} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="text-sm text-accent">Browse by category</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Something for every drive
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, i) => (
              <Reveal key={category} delay={i * 0.05}>
                <Link
                  href={`/fleet?category=${category}`}
                  className="card-surface flex h-28 flex-col items-center justify-center gap-2 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/50"
                >
                  <span className="font-display text-sm font-medium">{category}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="text-sm text-accent">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Three steps to the open road
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative">
              <span className="font-display text-5xl font-semibold text-border">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Fully insured",
              description: "Every rental includes basic coverage, with premium protection available.",
            },
            {
              icon: Clock,
              title: "Free cancellation",
              description: "Plans change. Cancel free up to 24 hours before pickup.",
            },
            {
              icon: MapPinned,
              title: "38 cities",
              description: "Pick up in one city, drop off in another — no extra fees.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent">
                <item.icon size={18} />
              </span>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="text-sm text-accent">Testimonials</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Loved by drivers everywhere
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="card-surface flex flex-col rounded-2xl p-6">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={13} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm text-muted">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <Reveal className="glow-accent card-surface relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, rgba(22,163,74,0.2) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Ready for your next drive?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Join thousands of renters who trust Velocity for business trips,
              weekend escapes, and everything in between.
            </p>
            <Link
              href="/fleet"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Browse the fleet <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
