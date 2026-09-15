import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  var __gsapScrollTriggerRegistered: boolean | undefined;
}

// Registered once, guarded for repeated HMR/module re-evaluation in dev.
if (typeof window !== "undefined" && !globalThis.__gsapScrollTriggerRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  globalThis.__gsapScrollTriggerRegistered = true;
}

export { gsap, ScrollTrigger };
