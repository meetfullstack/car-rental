"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** GSAP-driven hover scale for buttons/cards, in place of a CSS transition. */
export function useHoverScale<T extends HTMLElement>(scale = 1.03) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () =>
      gsap.to(el, { scale, duration: 0.25, ease: "power2.out" });
    const leave = () =>
      gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
    const down = () =>
      gsap.to(el, { scale: scale * 0.97, duration: 0.1, ease: "power2.out" });
    const up = () => gsap.to(el, { scale, duration: 0.2, ease: "power2.out" });

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mousedown", down);
    el.addEventListener("mouseup", up);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mousedown", down);
      el.removeEventListener("mouseup", up);
    };
  }, [scale]);

  return ref;
}
