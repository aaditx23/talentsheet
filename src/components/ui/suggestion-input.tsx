"use client";

import { useId, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SuggestionInputProps {
  id?: string;
  value: string;
  placeholder?: string;
  suggestions?: string[];
  onValueChange: (value: string) => void;
  className?: string;
  buttonAriaLabel?: string;
}

export function SuggestionInput({
  id,
  value,
  placeholder,
  suggestions = [],
  onValueChange,
  className,
  buttonAriaLabel = "Show suggestions",
}: SuggestionInputProps) {
  const generatedInputId = useId();
  const inputId = id ?? generatedInputId;

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const uniqueSuggestions = Array.from(
    new Set(suggestions.map((item) => item.trim()).filter(Boolean)),
  );

  // 👇 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Input */}
      <Input
        id={inputId}
        className={cn("pr-8", className)}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      {/* Toggle button */}
      <button
        type="button"
        className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 flex items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={buttonAriaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      {isOpen && uniqueSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md">
          {uniqueSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
              onMouseDown={(e) => {
                // 👇 prevent blur before click
                e.preventDefault();
                onValueChange(suggestion);
                setIsOpen(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}