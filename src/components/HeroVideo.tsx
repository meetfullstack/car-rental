"use client";

import { useState } from "react";

export default function HeroVideo() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {!failed && (
        <video
          className="h-full w-full"
          style={{ objectFit: "cover", objectPosition: "center 65%" }}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          onEnded={(e) => e.currentTarget.pause()}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      )}
      {/* Placeholder look until /public/hero-video.mp4 is added, and a
          permanent fallback if the browser can't play the file. */}
      {failed && (
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #052e16 0%, #08090b 60%)",
          }}
        />
      )}
      {/* Dark gradient for text contrast over the footage, fading into
          whichever page background follows (light or dark theme) so the
          hero blends into the next section instead of hard-cutting. */}
      <div
        className="absolute inset-0"
        style={{
          // The transition to var(--background) needs real vertical room —
          // compressing it into a small % at the bottom reads as a hard
          // edge no matter how many color stops lead into it, especially
          // in light mode where the target color is far from the tint.
          background:
            "linear-gradient(180deg, rgba(8,9,11,0.45) 0%, rgba(8,9,11,0.48) 35%, rgba(8,9,11,0.55) 55%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
