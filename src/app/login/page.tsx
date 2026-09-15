"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Zap } from "lucide-react";
import { useBooking } from "@/lib/booking-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useBooking();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
      return;
    }
    router.push(searchParams.get("next") || "/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="flex items-center gap-2 font-display text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
          <Zap size={16} strokeWidth={2.5} />
        </span>
        Velocity
      </div>
      <h1 className="mt-8 font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Sign in to manage your bookings.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-muted">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs text-muted">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
        {error && (
          <p className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {`Don't have an account? `}
        <Link href="/signup" className="text-foreground underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
