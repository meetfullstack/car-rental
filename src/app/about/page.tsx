import { Target, Heart, Globe } from "lucide-react";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

export const metadata = { title: "About — Velocity" };

const values = [
  {
    icon: Target,
    title: "Transparent pricing",
    description: "The price you see is the price you pay — no hidden fees at the counter.",
  },
  {
    icon: Heart,
    title: "Obsessive care",
    description: "Every vehicle is inspected and detailed between every single rental.",
  },
  {
    icon: Globe,
    title: "Everywhere you go",
    description: "38 cities today, with new locations added every quarter.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Reveal>
        <p className="text-sm text-accent">About Velocity</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
          Mobility, reimagined.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          Velocity started with a simple frustration: renting a car shouldn&rsquo;t
          feel like a chore. We rebuilt the experience from the ground up —
          transparent pricing, a fleet worth getting excited about, and a
          checkout that takes minutes, not hours.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.1}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-accent">
              <v.icon size={18} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
            <p className="mt-2 text-sm text-muted">{v.description}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="card-surface mt-16 rounded-2xl p-8">
        <h2 className="font-display text-xl font-semibold">By the numbers</h2>
        <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ["2018", "Founded"],
            ["1,200+", "Vehicles"],
            ["38", "Cities"],
            ["12,000+", "Happy renters"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-2xl font-semibold">
                {label === "Founded" ? value : <Counter value={value} />}
              </dd>
              <p className="mt-1 text-xs text-muted">{label}</p>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
