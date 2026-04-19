"use client";

import { useEffect, useMemo, useState } from "react";
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
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "Oct" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
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
  const [month, setMonth] = useState(parsed.month);
  const [year, setYear] = useState(parsed.year);

  useEffect(() => {
    setMonth(parsed.month);
    setYear(parsed.year);
  }, [parsed.month, parsed.year]);

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
        value={month}
        disabled={disabled}
        onChange={(e) => {
          const nextMonth = e.target.value;
          setMonth(nextMonth);
          emit(year, nextMonth);
        }}
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
        value={year}
        disabled={disabled}
        onChange={(e) => {
          const nextYear = e.target.value;
          setYear(nextYear);
          emit(nextYear, month);
        }}
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
