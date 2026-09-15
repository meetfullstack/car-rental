"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import PasswordInput from "@/components/ui/PasswordInput";
import { isValidEmail, isValidName, isPasswordValid } from "@/lib/validation";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useBooking();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const nameValid = isValidName(name);
  const emailValid = isValidEmail(email);
  const passwordValid = isPasswordValid(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const formValid = nameValid && emailValid && passwordValid && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setError(null);
    if (!formValid) return;

    setSubmitting(true);
    const { error } = await signUp(name, email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
      return;
    }
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

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-muted">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Miller"
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          {attempted && !nameValid && (
            <span className="text-xs text-accent">Enter your full name.</span>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          {attempted && !emailValid && (
            <span className="text-xs text-accent">Enter a valid email address.</span>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs text-muted">Password</span>
          <PasswordInput
            value={password}
            onChange={setPassword}
            showChecklist
            autoComplete="new-password"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs text-muted">Confirm password</span>
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />
          {attempted && !passwordsMatch && (
            <span className="text-xs text-accent">Passwords don&rsquo;t match.</span>
          )}
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
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
