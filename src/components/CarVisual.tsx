"use client";

interface CarVisualProps {
  colorFrom: string;
  colorTo: string;
  id: string;
  className?: string;
}

export default function CarVisual({ colorFrom, colorTo, id, className }: CarVisualProps) {
  const gradId = `car-grad-${id}`;
  const glowId = `car-glow-${id}`;

  return (
    <svg
      viewBox="0 0 400 180"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor={colorFrom} stopOpacity="0.35" />
          <stop offset="100%" stopColor={colorFrom} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="150" rx="180" ry="18" fill={`url(#${glowId})`} />

      {/* body */}
      <path
        d="M40 118
           C 40 96, 62 88, 92 84
           L 128 58
           C 148 44, 176 38, 206 38
           L 258 38
           C 284 38, 306 46, 322 62
           L 344 84
           C 366 88, 380 98, 380 116
           L 380 122
           C 380 130, 372 136, 362 136
           L 40 136
           C 32 136, 26 130, 26 122
           C 26 120, 28 118, 40 118 Z"
        fill={`url(#${gradId})`}
      />

      {/* cabin glass */}
      <path
        d="M136 82 L158 56 C 172 46 192 42 210 42 L 250 42 C 268 42 284 50 296 64 L 316 82 Z"
        fill="rgba(10,10,14,0.55)"
      />
      <path d="M226 46 L226 80" stroke="rgba(10,10,14,0.4)" strokeWidth="3" />

      {/* wheels */}
      <circle cx="118" cy="136" r="26" fill="#0c0d10" />
      <circle cx="118" cy="136" r="12" fill="#c7ccd6" />
      <circle cx="304" cy="136" r="26" fill="#0c0d10" />
      <circle cx="304" cy="136" r="12" fill="#c7ccd6" />

      {/* highlight */}
      <path
        d="M60 100 C 100 88, 160 78, 220 78"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
