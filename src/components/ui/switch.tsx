"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export function Switch({ className, checked, ...props }: SwitchProps) {
  return (
    <label className={cn("relative inline-flex h-6 w-11 cursor-pointer items-center", className)}>
      <input type="checkbox" className="peer sr-only" checked={checked} {...props} />
      <span className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background" />
      <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform peer-checked:translate-x-5" />
    </label>
  );
}
