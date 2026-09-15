"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm text-accent">Contact</p>
      <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        We&rsquo;re here to help
      </h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "support@velocityrentals.example" },
            { icon: Phone, label: "Phone", value: "1-800-555-0134" },
            { icon: MapPin, label: "HQ", value: "8721 Sunset Concourse, Los Angeles, CA" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent">
                <item.icon size={17} />
              </span>
              <div>
                <p className="text-xs text-muted">{item.label}</p>
                <p className="mt-0.5 text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card-surface rounded-2xl p-6">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={32} className="text-accent" />
              <h2 className="mt-4 font-display text-lg font-semibold">Message sent</h2>
              <p className="mt-1 text-sm text-muted">
                Thanks for reaching out — our team will reply within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-xs text-muted">Name</span>
                  <input
                    required
                    placeholder="Your name"
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs text-muted">Email</span>
                  <input
                    required
                    type="email"
                    placeholder="you@email.com"
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">Subject</span>
                <input
                  required
                  placeholder="How can we help?"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">Message</span>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us more..."
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
