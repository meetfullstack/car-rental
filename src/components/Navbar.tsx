"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Zap, User } from "lucide-react";
import { useBooking } from "@/lib/booking-context";

const links = [
  { href: "/fleet", label: "Fleet" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// In dark mode the navbar always uses this dark palette (the page is dark
// throughout, so there's nothing to transition to). In light mode it starts
// with the same dark palette — matching whatever's behind it while a page's
// dark hero (marked with [data-hero]) is still under the navbar — then
// crossfades to the light palette once scrolled onto the light page body.
// Pages with no [data-hero] (fleet, about, etc.) are light from the top.
const DARK = {
  bg: "#08090b",
  border: "#262a33",
  text: "#ffffff",
  muted: "#9aa0ab",
  chrome: "#c7ccd6",
};
const LIGHT = {
  bg: "#ffffff",
  border: "rgba(11,12,14,0.1)",
  text: "#0b0c0e",
  muted: "#5b616b",
  chrome: "#4b5563",
};

const NAV_HEIGHT = 80;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useBooking();
  const { resolvedTheme } = useTheme();
  const [overHero, setOverHero] = useState(true);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Reads DOM layout (an external system) to sync nav color with scroll
  // position on mount and on every scroll/resize.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      setOverHero(false);
      return;
    }
    const check = () => {
      const rect = hero.getBoundingClientRect();
      setOverHero(rect.bottom > NAV_HEIGHT);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  // Default dark before hydration/theme resolves, to avoid a light flash.
  const isDarkNav = !mounted || resolvedTheme === "dark" || overHero;
  const c = isDarkNav ? DARK : LIGHT;
  const transition = "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease";

  return (
    <header
      suppressHydrationWarning
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        // Fully transparent — blur, hairline, and inset highlight alone
        // carry the glass look. While sitting over the hero video it stays
        // nearly seamless (just a faint hairline, no drop shadow) so it
        // reads as part of the video rather than a bar floating above it;
        // once past the hero (or on a page with no video) it picks up a
        // touch more definition so it still separates from page content.
        backgroundColor: "transparent",
        borderBottom: overHero
          ? "1px solid rgba(255,255,255,0.06)"
          : isDarkNav
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(11,12,14,0.08)",
        boxShadow: overHero
          ? "none"
          : isDarkNav
            ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px -8px rgba(0,0,0,0.5)"
            : "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px -8px rgba(0,0,0,0.12)",
        color: c.text,
        transition,
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
              className="text-sm"
              style={{
                color: pathname === link.href ? c.text : c.muted,
                transition,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = c.text)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  pathname === link.href ? c.text : c.muted)
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
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
              style={{ border: `1px solid ${c.border}`, color: c.text, transition }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `${c.chrome}80`)
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = c.border)}
            >
              <User size={14} />
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm"
              style={{ color: c.muted, transition }}
              onMouseEnter={(e) => (e.currentTarget.style.color = c.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = c.muted)}
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
          style={{ color: c.text, transition }}
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
          style={{ borderTop: `1px solid ${c.border}`, transition }}
        >
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm"
                style={{ color: c.muted, transition }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={user ? "/dashboard" : "/login"}
              onClick={() => setOpen(false)}
              className="text-sm"
              style={{ color: c.muted, transition }}
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
