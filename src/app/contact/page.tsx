"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { isValidEmail, isValidName, isValidMessage } from "@/lib/validation";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attempted, setAttempted] = useState(false);

  const nameValid = isValidName(name);
  const emailValid = isValidEmail(email);
  const subjectValid = subject.trim().length >= 3;
  const messageValid = isValidMessage(message);
  const formValid = nameValid && emailValid && subjectValid && messageValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!formValid) return;
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
            { icon: MapPin, label: "HQ", value: "100 Front St W, Toronto, ON" },
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
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-xs text-muted">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                  {attempted && !nameValid && (
                    <span className="text-xs text-accent">Enter your name.</span>
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
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">Subject</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help?"
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
                {attempted && !subjectValid && (
                  <span className="text-xs text-accent">Enter a subject.</span>
                )}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted">Message</span>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more..."
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
                {attempted && !messageValid && (
                  <span className="text-xs text-accent">Message must be at least 10 characters.</span>
                )}
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
