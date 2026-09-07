import React, { useEffect, useState } from 'react';

const btnStyle = {
  position: 'fixed',
  top: '16px',
  right: '16px',
  zIndex: 9999,
  width: '42px',
  height: '42px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#151513',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '50%',
  color: '#d9a441',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
  padding: 0,
};

/**
 * Fixed top-right theme toggle. Rendered once in AppRoutes (App.js),
 * as a sibling of <Navbar />, so it shows on every route.
 *
 * Uses inline styles so it always renders correctly as a circular
 * icon button in the top-right corner, regardless of whether the
 * .theme-toggle-btn class was added to styles.css.
 *
 * Persists the choice in localStorage and sets data-theme on <html>.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <button
      type="button"
      onClick={toggle}
      style={btnStyle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        // Moon — click to switch to dark
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      ) : (
        // Sun — click to switch to light
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}