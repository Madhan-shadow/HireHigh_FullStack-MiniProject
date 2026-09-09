import { useEffect } from 'react';

/**
 * Watches every element with className="reveal" currently in the DOM
 * and adds "is-visible" once it scrolls into view, triggering the
 * fade/slide-up transition defined in styles.css (.reveal / .reveal.is-visible).
 *
 * Call once per page component, e.g. useScrollReveal() at the top of Home.
 * Safe to call even when no .reveal elements are present (other
 * dashboard/candidate branches of Home) — it just finds nothing and exits.
 */
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!els.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}
