import Link from "next/link";
import { Zap, Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                <Zap size={16} strokeWidth={2.5} />
              </span>
              Velocity
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Premium car rental for people who care how they arrive.
              Exceptional fleet, transparent pricing, doorstep delivery.
            </p>
            <div className="mt-6 flex gap-3">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-chrome/50 hover:text-foreground"
                >
                  <Icon size={15} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground">Company</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/locations" className="hover:text-foreground">Locations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground">Fleet</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><Link href="/fleet?category=Electric" className="hover:text-foreground">Electric</Link></li>
              <li><Link href="/fleet?category=Supercar" className="hover:text-foreground">Supercars</Link></li>
              <li><Link href="/fleet?category=SUV" className="hover:text-foreground">SUVs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground">Account</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><Link href="/login" className="hover:text-foreground">Sign in</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Create account</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">My bookings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Velocity Mobility, Inc. All rights reserved.</p>
          <p>All vehicles shown are fictional demo models — no real-world cars are affiliated.</p>
        </div>
      </div>
    </footer>
  );
}
