"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
