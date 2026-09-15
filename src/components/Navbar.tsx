"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, User } from "lucide-react";
import { useBooking } from "@/lib/booking-context";

const links = [
  { href: "/fleet", label: "Fleet" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useBooking();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
            <Zap size={16} strokeWidth={2.5} />
          </span>
          Velocity
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === link.href ? "text-foreground" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-chrome/50"
            >
              <User size={14} />
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/fleet"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Book now
          </Link>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={user ? "/dashboard" : "/login"}
              onClick={() => setOpen(false)}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {user ? "Dashboard" : "Sign in"}
            </Link>
            <Link
              href="/fleet"
              onClick={() => setOpen(false)}
              className="rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-white"
            >
              Book now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
