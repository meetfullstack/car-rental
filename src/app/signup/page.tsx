"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useBooking } from "@/lib/booking-context";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useBooking();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ name: name || "Driver", email });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="flex items-center gap-2 font-display text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
          <Zap size={16} strokeWidth={2.5} />
        </span>
        Velocity
      </div>
      <h1 className="mt-8 font-display text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Book faster with saved details next time.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-muted">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Miller"
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
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
        <button
          type="submit"
          className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-muted">
        Demo authentication — no real account is created and no data leaves your browser.
      </p>
    </div>
  );
}
