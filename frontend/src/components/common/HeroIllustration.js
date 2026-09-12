import React from 'react';

/**
 * Abstract "candidates flowing through a hiring pipeline" illustration.
 * Pure SVG, no external assets, colored from the same CSS variables
 * as the rest of the app (--pine, --gold, --border, --stage-*) so it
 * reads as part of the brand rather than a bolted-on stock graphic.
 *
 * The dots along the funnel path drift gently via CSS animation
 * (see .hero-illustration-dot in styles.css) — a small bit of motion
 * without needing a JS animation loop.
 */
export default function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 360 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Funnel outline */}
      <path
        d="M40 40 H320 L230 160 L230 260 L130 290 L130 160 Z"
        stroke="var(--border)"
        strokeWidth="1.5"
        fill="var(--surface)"
      />

      {/* Stage divider lines inside the funnel */}
      <line x1="70" y1="90" x2="290" y2="90" stroke="var(--border-light)" strokeWidth="1" />
      <line x1="105" y1="140" x2="255" y2="140" stroke="var(--border-light)" strokeWidth="1" />
      <line x1="150" y1="190" x2="210" y2="190" stroke="var(--border-light)" strokeWidth="1" />

      {/* Candidate dots, each on its own float animation via CSS,
          colored by pipeline stage to echo the pipeline card list */}
      <circle className="hero-illustration-dot" cx="80" cy="62" r="7" fill="var(--stage-applied)" style={{ animationDelay: '0s' }} />
      <circle className="hero-illustration-dot" cx="130" cy="65" r="7" fill="var(--stage-applied)" style={{ animationDelay: '0.4s' }} />
      <circle className="hero-illustration-dot" cx="280" cy="62" r="7" fill="var(--stage-applied)" style={{ animationDelay: '0.8s' }} />

      <circle className="hero-illustration-dot" cx="120" cy="112" r="7" fill="var(--stage-screening)" style={{ animationDelay: '0.2s' }} />
      <circle className="hero-illustration-dot" cx="240" cy="112" r="7" fill="var(--stage-screening)" style={{ animationDelay: '0.6s' }} />

      <circle className="hero-illustration-dot" cx="150" cy="163" r="7" fill="var(--stage-interview)" style={{ animationDelay: '0.3s' }} />
      <circle className="hero-illustration-dot" cx="205" cy="163" r="7" fill="var(--stage-interview)" style={{ animationDelay: '0.9s' }} />

      <circle className="hero-illustration-dot" cx="180" cy="212" r="7" fill="var(--stage-offer)" style={{ animationDelay: '0.5s' }} />

      <circle className="hero-illustration-dot" cx="180" cy="270" r="9" fill="var(--gold-bright)" style={{ animationDelay: '0.1s' }} />

      {/* Small "hired" sparkle mark above the final dot */}
      <path
        d="M180 240 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z"
        fill="var(--gold-bright)"
        opacity="0.85"
      />
    </svg>
  );
}