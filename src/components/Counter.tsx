"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface CounterProps {
  /** e.g. "1,200+", "38", "4.8/5", "99.2%" — parsed for its leading number. */
  value: string;
  className?: string;
  delay?: number;
}

function parseValue(raw: string) {
  const match = raw.match(/-?\d+(\.\d+)?/);
  const number = match ? parseFloat(match[0]) : 0;
  const decimals = match && match[0].includes(".") ? match[0].split(".")[1].length : 0;
  const prefix = match ? raw.slice(0, match.index) : raw;
  const suffix = match ? raw.slice((match.index ?? 0) + match[0].length) : "";
  return { number, decimals, prefix, suffix };
}

export default function Counter({ value, className, delay = 0 }: CounterProps): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { number, decimals, prefix, suffix } = parseValue(value);
    const counter = { n: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: number,
        duration: 1.4,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value, delay]);

  const { prefix, suffix } = parseValue(value);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
