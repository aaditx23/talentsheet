"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ThemeSettingsFormValues {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemePresetValues extends ThemeSettingsFormValues {
  name: string;
}

interface ThemeSettingsFormProps {
  initialValues?: Partial<ThemeSettingsFormValues>;
  userPresets?: ThemePresetValues[];
  onSave: (values: ThemeSettingsFormValues) => Promise<void>;
  onSavePreset: (name: string, values: ThemeSettingsFormValues) => Promise<void>;
  onValuesChange?: (values: ThemeSettingsFormValues) => void;
}

export const DEFAULT_VALUES: ThemeSettingsFormValues = {
  background: "#ffffff",
  foreground: "#111827",
  primary: "#171717",
  primaryForeground: "#ffffff",
  secondary: "#f3f4f6",
  secondaryForeground: "#111827",
  muted: "#f3f4f6",
  mutedForeground: "#6b7280",
  accent: "#f59e0b",
  accentForeground: "#111827",
  card: "#ffffff",
  cardForeground: "#111827",
  popover: "#ffffff",
  popoverForeground: "#111827",
  border: "#e5e7eb",
  input: "#e5e7eb",
  ring: "#f59e0b",
};

const BUILTIN_PRESETS: ThemePresetValues[] = [
  { name: "Classic", ...DEFAULT_VALUES },
  {
    name: "Ocean",
    foreground: "#0c4a6e",
    primary: "#0f172a",
    primaryForeground: "#f8fafc",
    secondary: "#dbeafe",
    background: "#f0f9ff",
    secondaryForeground: "#0c4a6e",
    muted: "#e0f2fe",
    mutedForeground: "#0369a1",
    accent: "#0284c7",
    accentForeground: "#f0f9ff",
    card: "#ffffff",
    cardForeground: "#0c4a6e",
    popover: "#ffffff",
    popoverForeground: "#0c4a6e",
    border: "#bae6fd",
    input: "#bae6fd",
    ring: "#0284c7",
  },
  {
    name: "Forest",
    foreground: "#1a2e05",
    primary: "#14532d",
    primaryForeground: "#f7fee7",
    secondary: "#dcfce7",
    background: "#f7fee7",
    secondaryForeground: "#1a2e05",
    muted: "#ecfccb",
    mutedForeground: "#4d7c0f",
    accent: "#65a30d",
    accentForeground: "#f7fee7",
    card: "#ffffff",
    cardForeground: "#1a2e05",
    popover: "#ffffff",
    popoverForeground: "#1a2e05",
    border: "#bbf7d0",
    input: "#bbf7d0",
    ring: "#65a30d",
  },
  {
    name: "Graphite",
    foreground: "#111827",
    primary: "#111827",
    primaryForeground: "#f9fafb",
    secondary: "#e5e7eb",
    background: "#f9fafb",
    secondaryForeground: "#111827",
    muted: "#f3f4f6",
    mutedForeground: "#6b7280",
    accent: "#ea580c",
    accentForeground: "#fff7ed",
    card: "#ffffff",
    cardForeground: "#111827",
    popover: "#ffffff",
    popoverForeground: "#111827",
    border: "#d1d5db",
    input: "#d1d5db",
    ring: "#ea580c",
  },
];

const FIELD_GROUPS: Array<{
  title: string;
  fields: Array<{ key: keyof ThemeSettingsFormValues; label: string }>;
}> = [
  {
    title: "Page And Surfaces",
    fields: [
      { key: "background", label: "Page Background" },
      { key: "foreground", label: "Page Foreground" },
      { key: "card", label: "Card Background" },
      { key: "cardForeground", label: "Card Foreground" },
      { key: "popover", label: "Dialog/Popover Background" },
      { key: "popoverForeground", label: "Dialog/Popover Foreground" },
      { key: "border", label: "Border" },
      { key: "input", label: "Input Border" },
    ],
  },
  {
    title: "Interactive Tokens",
    fields: [
      { key: "primary", label: "Primary Background" },
      { key: "primaryForeground", label: "Primary Foreground" },
      { key: "secondary", label: "Secondary Background" },
      { key: "secondaryForeground", label: "Secondary Foreground" },
      { key: "accent", label: "Accent Background" },
      { key: "accentForeground", label: "Accent Foreground" },
      { key: "ring", label: "Focus Ring" },
    ],
  },
  {
    title: "Muted Text And Areas",
    fields: [
      { key: "muted", label: "Muted Background" },
      { key: "mutedForeground", label: "Muted Foreground" },
    ],
  },
];

function toThemeSettingsValues(
  source: ThemeSettingsFormValues | ThemePresetValues,
): ThemeSettingsFormValues {
  const s = source as any;

  return {
    background: s.background ?? DEFAULT_VALUES.background,
    foreground:
      s.foreground ?? s.textMain ?? s.cardForeground ?? DEFAULT_VALUES.foreground,
    primary: source.primary,
    primaryForeground:
      s.primaryForeground ?? s.background ?? DEFAULT_VALUES.primaryForeground,
    secondary: source.secondary,
    secondaryForeground:
      s.secondaryForeground ?? s.foreground ?? s.textMain ?? DEFAULT_VALUES.secondaryForeground,
    muted: s.muted ?? s.secondary ?? DEFAULT_VALUES.muted,
    mutedForeground:
      s.mutedForeground ?? s.textMuted ?? DEFAULT_VALUES.mutedForeground,
    accent: s.accent ?? DEFAULT_VALUES.accent,
    accentForeground:
      s.accentForeground ?? s.background ?? DEFAULT_VALUES.accentForeground,
    card: source.card,
    cardForeground:
      s.cardForeground ?? s.foreground ?? s.textMain ?? DEFAULT_VALUES.cardForeground,
    popover: s.popover ?? s.card ?? DEFAULT_VALUES.popover,
    popoverForeground:
      s.popoverForeground ?? s.foreground ?? s.textMain ?? DEFAULT_VALUES.popoverForeground,
    border: source.border,
    input: s.input ?? s.border ?? DEFAULT_VALUES.input,
    ring: s.ring ?? s.accent ?? DEFAULT_VALUES.ring,
  };
}

function isSameTheme(a: ThemeSettingsFormValues, b: ThemeSettingsFormValues): boolean {
  return (
    a.background === b.background &&
    a.foreground === b.foreground &&
    a.primary === b.primary &&
    a.primaryForeground === b.primaryForeground &&
    a.secondary === b.secondary &&
    a.secondaryForeground === b.secondaryForeground &&
    a.muted === b.muted &&
    a.mutedForeground === b.mutedForeground &&
    a.accent === b.accent &&
    a.accentForeground === b.accentForeground &&
    a.card === b.card &&
    a.cardForeground === b.cardForeground &&
    a.popover === b.popover &&
    a.popoverForeground === b.popoverForeground &&
    a.border === b.border &&
    a.input === b.input &&
    a.ring === b.ring
  );
}

export function ThemeSettingsForm({
  initialValues,
  userPresets = [],
  onSave,
  onSavePreset,
  onValuesChange,
}: ThemeSettingsFormProps) {
  const normalizedInitialValues = useMemo(
    () => toThemeSettingsValues({ ...DEFAULT_VALUES, ...(initialValues as Partial<ThemeSettingsFormValues>) } as ThemeSettingsFormValues),
    [initialValues],
  );

  const initialValuesKey = useMemo(
    () => JSON.stringify(normalizedInitialValues),
    [normalizedInitialValues],
  );

  const [values, setValues] = useState<ThemeSettingsFormValues>(normalizedInitialValues);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [savingPreset, setSavingPreset] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const normalizedBuiltinPresets = useMemo(
    () => BUILTIN_PRESETS.map((preset) => ({ name: preset.name, values: toThemeSettingsValues(preset) })),
    [],
  );

  const normalizedUserPresets = useMemo(
    () => userPresets.map((preset) => ({ name: preset.name, values: toThemeSettingsValues(preset) })),
    [userPresets],
  );

  useEffect(() => {
    setValues((prev) => (isSameTheme(prev, normalizedInitialValues) ? prev : normalizedInitialValues));
  }, [initialValuesKey, normalizedInitialValues]);

  useEffect(() => {
    const matching = [...normalizedBuiltinPresets, ...normalizedUserPresets].find((preset) =>
      isSameTheme(preset.values, values),
    );
    const nextActive = matching?.name ?? null;
    setActivePreset((prev) => (prev === nextActive ? prev : nextActive));
  }, [values, normalizedBuiltinPresets, normalizedUserPresets]);

  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);

  const handleColorChange = (key: keyof ThemeSettingsFormValues, next: string) => {
    setActivePreset(null);
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const handleReset = () => {
    setActivePreset("Classic");
    setValues(DEFAULT_VALUES);
  };

  const applyPreset = (preset: ThemePresetValues) => {
    setActivePreset(preset.name);
    setValues(toThemeSettingsValues(preset));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(toThemeSettingsValues(values));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreset = async () => {
    const trimmed = presetName.trim();
    if (!trimmed) return;

    setSavingPreset(true);
    try {
      await onSavePreset(trimmed, toThemeSettingsValues(values));
      setPresetName("");
      setActivePreset(trimmed);
    } finally {
      setSavingPreset(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Colors</CardTitle>
        <CardDescription>
          These colors are saved per user and applied to your public portfolio page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-medium">Presets</p>
          <div className="flex flex-wrap gap-2">
            {BUILTIN_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                type="button"
                variant={activePreset === preset.name ? "default" : "outline"}
                className={cn(activePreset === preset.name && "ring-2 ring-ring")}
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>

          {userPresets.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Your presets</p>
              <div className="flex flex-wrap gap-2">
                {userPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    type="button"
                    variant={activePreset === preset.name ? "default" : "secondary"}
                    className={cn(activePreset === preset.name && "ring-2 ring-ring")}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Preset name (e.g. BlueNight)"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleSavePreset} disabled={savingPreset || !presetName.trim()}>
              {savingPreset ? "Saving..." : "Save as Preset"}
            </Button>
          </div>
        </div>

        {FIELD_GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-sm font-medium">{group.title}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map(({ key, label }) => (
                <label key={key} className="grid gap-1.5">
                  <span className="text-sm font-medium">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={values[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="h-9 w-11 rounded border border-input bg-background p-1 cursor-pointer"
                      aria-label={`${label} color picker`}
                    />
                    <Input
                      value={values[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" type="button" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Theme"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
