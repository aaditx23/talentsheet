"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  DEFAULT_VALUES,
  ThemePresetValues,
  ThemeSettingsForm,
  ThemeSettingsFormValues,
} from "@/components/dashboard/ThemeSettingsForm";
import { PortfolioThemePreview } from "@/components/dashboard/PortfolioThemePreview";
import { useSession } from "@/context/SessionContext";

export default function CustomizationPage() {
  const session = useSession();
  const user = useQuery(
    api.users.getUserByUsername as any,
    session?.username ? { username: session.username } : "skip",
  );
  const updateThemeSettings = useMutation(api.users.updateThemeSettings as any);
  const upsertThemePreset = useMutation(api.users.upsertThemePreset as any);

  const currentTheme = useMemo<ThemeSettingsFormValues>(() => ({
    ...DEFAULT_VALUES,
    ...(user?.themeSettings ?? {}),
  }), [user?.themeSettings]);

  const [previewValues, setPreviewValues] = useState<ThemeSettingsFormValues>(DEFAULT_VALUES);

  useEffect(() => {
    if (user) {
      setPreviewValues(currentTheme);
    }
  }, [user, currentTheme]);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === undefined) return <LoadingState message="Loading customization settings..." />;
  if (user === null) return <LoadingState message="User not found." />;

  const userPresets = (user.themePresets ?? []) as ThemePresetValues[];

  const handleSave = async (values: ThemeSettingsFormValues) => {
    await updateThemeSettings({
      userId: user._id,
      themeSettings: values,
    });
  };

  const handleSavePreset = async (name: string, values: ThemeSettingsFormValues) => {
    await upsertThemePreset({
      userId: user._id,
      preset: {
        name,
        ...values,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Portfolio Customization"
        description="Customize portfolio colors. Settings are saved per user and reflected on your public page."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div>
          <ThemeSettingsForm
            initialValues={currentTheme}
            userPresets={userPresets}
            onSave={handleSave}
            onSavePreset={handleSavePreset}
            onValuesChange={setPreviewValues}
          />
        </div>

        <div className="xl:sticky xl:top-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Live Static Preview</p>
          <PortfolioThemePreview values={previewValues} />
        </div>
      </div>
    </div>
  );
}
