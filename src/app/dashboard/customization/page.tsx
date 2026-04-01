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
import { SectionOrderEditor } from "@/components/dashboard/SectionOrderEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "@/context/SessionContext";
import {
  DEFAULT_SECTION_ORDER,
  isPortfolioSectionKey,
  type PortfolioSectionKey,
} from "@/lib/portfolio-sections";

type SectionVisibility = Record<PortfolioSectionKey, boolean>;

const ALL_VISIBLE: SectionVisibility = DEFAULT_SECTION_ORDER.reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {} as SectionVisibility);

export default function CustomizationPage() {
  const session = useSession();
  const user = useQuery(
    api.users.getUserByUsername as any,
    session?.username ? { username: session.username } : "skip",
  );
  const updateThemeSettings = useMutation(api.users.updateThemeSettings as any);
  const upsertThemePreset = useMutation(api.users.upsertThemePreset as any);
  const updateSectionLayout = useMutation((api as any).users.updateSectionLayout);

  const currentTheme = useMemo<ThemeSettingsFormValues>(() => ({
    ...DEFAULT_VALUES,
    ...(user?.themeSettings ?? {}),
  }), [user?.themeSettings]);

  const [previewValues, setPreviewValues] = useState<ThemeSettingsFormValues>(DEFAULT_VALUES);
  const [sectionOrder, setSectionOrder] = useState<PortfolioSectionKey[]>(DEFAULT_SECTION_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(ALL_VISIBLE);
  const [savingSections, setSavingSections] = useState(false);
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setPreviewValues(currentTheme);

      const savedOrder = ((user as any)?.sectionLayout?.sectionOrder ?? []) as string[];
      const validSavedOrder = savedOrder.filter(isPortfolioSectionKey);
      const normalizedOrder = [
        ...validSavedOrder,
        ...DEFAULT_SECTION_ORDER.filter((key) => !validSavedOrder.includes(key)),
      ];
      setSectionOrder(normalizedOrder);

      const hidden = (((user as any)?.sectionLayout?.hiddenSections ?? []) as string[]).filter(isPortfolioSectionKey);
      setSectionVisibility(
        DEFAULT_SECTION_ORDER.reduce((acc, key) => {
          acc[key] = !hidden.includes(key);
          return acc;
        }, {} as SectionVisibility),
      );
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

  const handleSaveSectionLayout = async () => {
    setSavingSections(true);
    try {
      const hiddenSections = sectionOrder.filter((key) => !sectionVisibility[key]);
      await updateSectionLayout({
        userId: user._id,
        sectionOrder,
        hiddenSections,
      });
    } finally {
      setSavingSections(false);
    }
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Section Layout</CardTitle>
              <CardDescription>
                Reorder portfolio sections and control which sections are visible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" onClick={() => setSectionEditorOpen(true)}>
                Edit Section Layout
              </Button>
            </CardContent>
          </Card>

          <Dialog open={sectionEditorOpen} onOpenChange={setSectionEditorOpen}>
            <DialogContent className="w-[96vw] max-h-[88vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Section Layout</DialogTitle>
              </DialogHeader>
              <SectionOrderEditor
                order={sectionOrder}
                visibility={sectionVisibility}
                onOrderChange={setSectionOrder}
                onVisibilityChange={setSectionVisibility}
                onSave={async () => {
                  await handleSaveSectionLayout();
                  setSectionEditorOpen(false);
                }}
                saving={savingSections}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="xl:sticky xl:top-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Live Static Preview</p>
          <PortfolioThemePreview values={previewValues} />
        </div>
      </div>
    </div>
  );
}
