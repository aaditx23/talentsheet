"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MonthYearInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  minYear?: number;
  maxYear?: number;
}

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function parseValue(value?: string) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return { year: "", month: "" };
  }
  const [year, month] = value.split("-");
  return { year, month };
}

export function MonthYearInput({
  value,
  onChange,
  disabled,
  className,
  ariaLabel = "Select month and year",
  minYear,
  maxYear,
}: MonthYearInputProps) {
  const currentYear = new Date().getFullYear();
  const startYear = minYear ?? currentYear - 50;
  const endYear = maxYear ?? currentYear + 10;

  const years = useMemo(() => {
    const list: string[] = [];
    for (let y = endYear; y >= startYear; y -= 1) {
      list.push(String(y));
    }
    return list;
  }, [startYear, endYear]);

  const parsed = parseValue(value);

  const emit = (nextYear: string, nextMonth: string) => {
    if (nextYear && nextMonth) {
      onChange(`${nextYear}-${nextMonth}`);
      return;
    }
    onChange("");
  };

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)} aria-label={ariaLabel}>
      <select
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
        value={parsed.month}
        disabled={disabled}
        onChange={(e) => emit(parsed.year, e.target.value)}
      >
        <option value="">Month</option>
        {MONTHS.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <select
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
        value={parsed.year}
        disabled={disabled}
        onChange={(e) => emit(e.target.value, parsed.month)}
      >
        <option value="">Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
