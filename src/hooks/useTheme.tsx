import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6 ? "dark" : "light";
}

export function useTheme() {
  const [auto, setAuto] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme-auto") !== "false";
    }
    return true;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const isAuto = localStorage.getItem("theme-auto") !== "false";
      if (isAuto) return getTimeBasedTheme();
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored) return stored;
    }
    return getTimeBasedTheme();
  });

  // Check time every minute when in auto mode
  useEffect(() => {
    if (!auto) return;
    const interval = setInterval(() => {
      setTheme(getTimeBasedTheme());
    }, 60_000);
    return () => clearInterval(interval);
  }, [auto]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setAuto(false);
    localStorage.setItem("theme-auto", "false");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, setTheme, toggleTheme, auto };
}
