import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider(props) {
  var storedTheme = null;
  try {
    storedTheme = window.localStorage.getItem('hirehigh-theme');
  } catch (e) {
    storedTheme = null;
  }

  var themeState = useState(storedTheme === 'dark' ? 'dark' : 'light');
  var theme = themeState[0];
  var setTheme = themeState[1];

  useEffect(function () {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('hirehigh-theme', theme);
    } catch (e) {
      // ignore storage errors
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(function (prev) {
      return prev === 'dark' ? 'light' : 'dark';
    });
  }

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}