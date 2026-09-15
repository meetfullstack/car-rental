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
              "radial-gradient(120% 90% at 50% 0%, #2a0508 0%, #08090b 60%)",
          }}
        />
      )}
      {/* Dark gradient for text contrast over the footage */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,9,11,0.55) 0%, rgba(8,9,11,0.75) 55%, rgba(8,9,11,1) 100%)",
        }}
      />
    </div>
  );
}
