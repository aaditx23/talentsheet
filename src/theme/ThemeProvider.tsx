"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeMode, THEME_STORAGE_KEY } from "./colors";

interface ThemeContextValue {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemMode = (): ThemeMode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyMode = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const initialMode: ThemeMode =
      stored === "light" || stored === "dark" ? stored : getSystemMode();

    if (!stored) {
      localStorage.setItem(THEME_STORAGE_KEY, initialMode);
    }

    setMode(initialMode);
    applyMode(initialMode);
  }, []);

  const setTheme = useCallback((nextMode: ThemeMode) => {
    setMode(nextMode);
    localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    applyMode(nextMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(mode === "dark" ? "light" : "dark");
  }, [mode, setTheme]);

  const value = useMemo(
    () => ({ mode, setTheme, toggleTheme }),
    [mode, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
