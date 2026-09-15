# Velocity — Premium Car Rental

A fictional car rental site: fleet browsing, a multi-step booking flow, real auth and bookings backed by Supabase, light/dark theming, and GSAP-driven animation throughout.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind v4
- Supabase (Postgres + Auth) — see `src/lib/cars.ts`, `src/lib/booking-context.tsx`, `src/utils/supabase/`
- GSAP (ScrollTrigger) for reveals, counters, hover, and page transitions
- Radix UI (Select, Popover) + react-day-picker for the themed dropdown/calendar

## Getting started

```bash
npm install
npm run dev
```

Requires a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Open [http://localhost:3000](http://localhost:3000).
