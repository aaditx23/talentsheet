"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/theme/ThemeProvider";

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  const isDark = mode === "dark";

  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-2 text-muted-foreground">
      <div className="flex items-center gap-2 text-sm">
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        <span>Dark Mode</span>
      </div>
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
    </div>
  );
}
