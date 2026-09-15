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

// The navbar always stays dark regardless of site theme (a deliberate
// brand choice), so it uses fixed colors instead of the theme's
// --foreground/--muted/--border tokens.
const NAV_BG = "#08090b";
const NAV_BORDER = "#262a33";
const NAV_TEXT = "#f4f5f7";
const NAV_MUTED = "#9aa0ab";
const NAV_CHROME = "#c7ccd6";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useBooking();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: `${NAV_BG}cc`,
        borderBottom: `1px solid ${NAV_BORDER}cc`,
        color: NAV_TEXT,
      }}
    >
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
              className="text-sm transition-colors"
              style={{ color: pathname === link.href ? NAV_TEXT : NAV_MUTED }}
              onMouseEnter={(e) => (e.currentTarget.style.color = NAV_TEXT)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  pathname === link.href ? NAV_TEXT : NAV_MUTED)
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
              style={{ border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `${NAV_CHROME}80`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = NAV_BORDER)
              }
            >
              <User size={14} />
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm transition-colors"
              style={{ color: NAV_MUTED }}
              onMouseEnter={(e) => (e.currentTarget.style.color = NAV_TEXT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = NAV_MUTED)}
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
          className="md:hidden"
          style={{ color: NAV_TEXT }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="px-6 pb-6 md:hidden"
          style={{ borderTop: `1px solid ${NAV_BORDER}` }}
        >
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm transition-colors"
                style={{ color: NAV_MUTED }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={user ? "/dashboard" : "/login"}
              onClick={() => setOpen(false)}
              className="text-sm transition-colors"
              style={{ color: NAV_MUTED }}
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
