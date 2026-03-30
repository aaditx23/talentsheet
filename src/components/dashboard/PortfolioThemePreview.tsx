"use client";

import { Card } from "@/components/ui/card";
import type { ThemeSettingsFormValues } from "@/components/dashboard/ThemeSettingsForm";

interface PortfolioThemePreviewProps {
  values: ThemeSettingsFormValues;
}

export function PortfolioThemePreview({ values }: PortfolioThemePreviewProps) {
  return (
    <div
      className="rounded-xl border p-4 md:p-6 space-y-6"
      style={{
        backgroundColor: values.background,
        color: values.foreground,
        borderColor: values.border,
      }}
    >
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Md. Amir Ul Islam</h2>
        <p style={{ color: values.mutedForeground }}>Mobile Engineer | Flutter | Android | Backend</p>
        <p className="text-sm" style={{ color: values.mutedForeground }}>
          This is a static preview of your portfolio look. Your saved colors will be applied on the public page.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2" style={{ borderColor: values.border }}>
          Tabs and Buttons
        </h3>
        <div className="rounded-lg p-2" style={{ backgroundColor: values.muted }}>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md px-3 py-1 text-sm" style={{ backgroundColor: values.card, color: values.foreground }}>
              Android
            </span>
            <span className="rounded-md px-3 py-1 text-sm" style={{ color: values.mutedForeground }}>
              Backend
            </span>
            <span className="rounded-md px-3 py-1 text-sm" style={{ color: values.mutedForeground }}>
              Flutter
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="rounded px-2 py-1 text-xs" style={{ backgroundColor: values.primary, color: values.primaryForeground }}>
            Primary
          </span>
          <span className="rounded px-2 py-1 text-xs" style={{ backgroundColor: values.secondary, color: values.secondaryForeground }}>
            Secondary
          </span>
          <span className="rounded px-2 py-1 text-xs" style={{ backgroundColor: values.accent, color: values.accentForeground }}>
            Accent
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2" style={{ borderColor: values.border }}>
          Skills
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {["Flutter", "Kotlin", "Spring Boot", "Next.js"].map((skill) => (
            <Card
              key={skill}
              className="p-3 border"
              style={{ backgroundColor: values.card, borderColor: values.border, color: values.cardForeground }}
            >
              <p className="font-medium">{skill}</p>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-3 rounded-full"
                    style={{ backgroundColor: i < 8 ? values.primary : values.secondary }}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2" style={{ borderColor: values.border }}>
          Projects
        </h3>
        <Card className="p-4 border" style={{ backgroundColor: values.card, borderColor: values.border, color: values.cardForeground }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">FuelSense</p>
              <p className="text-sm" style={{ color: values.mutedForeground }}>Flutter, Offline First</p>
            </div>
            <span
              className="text-xs rounded px-2 py-1"
              style={{ backgroundColor: values.accent, color: values.accentForeground }}
            >
              Highlight
            </span>
          </div>
          <ul className="mt-3 list-disc pl-5 text-sm" style={{ color: values.mutedForeground }}>
            <li>Live data synchronization and queued offline actions.</li>
            <li>Responsive dashboards with strong readability.</li>
          </ul>
        </Card>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2" style={{ borderColor: values.border }}>
          Dialog Surface
        </h3>
        <div className="rounded-xl border p-4" style={{ backgroundColor: values.popover, color: values.popoverForeground, borderColor: values.border }}>
          <p className="font-medium">All Skills</p>
          <p className="text-sm" style={{ color: values.mutedForeground }}>Popover foreground and muted text preview.</p>
        </div>
      </section>
    </div>
  );
}
