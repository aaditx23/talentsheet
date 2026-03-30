"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";
import ProjectTabs from "@/components/portfolio/ProjectTabs";
import { SkillList } from "@/components/dashboard/SkillList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type PortfolioThemeOverrides = {
  background?: string;
  foreground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  border?: string;
  input?: string;
  ring?: string;

  // Backward compatibility for old saved schema values.
  textMain?: string;
  textMuted?: string;
};

const toPortfolioStyle = (theme?: PortfolioThemeOverrides): CSSProperties => {
  if (!theme) return {};

  const background = theme.background;
  const foreground = theme.foreground ?? theme.textMain;
  const primary = theme.primary;
  const primaryForeground = theme.primaryForeground ?? background;
  const secondary = theme.secondary;
  const secondaryForeground = theme.secondaryForeground ?? foreground;
  const muted = theme.muted ?? secondary;
  const mutedForeground = theme.mutedForeground ?? theme.textMuted;
  const accent = theme.accent;
  const accentForeground = theme.accentForeground ?? background;
  const card = theme.card;
  const cardForeground = theme.cardForeground ?? foreground;
  const popover = theme.popover ?? card;
  const popoverForeground = theme.popoverForeground ?? foreground;
  const border = theme.border;
  const input = theme.input ?? border;
  const ring = theme.ring ?? accent;

  return {
    ["--background" as string]: background,
    ["--foreground" as string]: foreground,
    ["--card" as string]: card,
    ["--card-foreground" as string]: cardForeground,
    ["--popover" as string]: popover,
    ["--popover-foreground" as string]: popoverForeground,
    ["--primary" as string]: primary,
    ["--primary-foreground" as string]: primaryForeground,
    ["--secondary" as string]: secondary,
    ["--secondary-foreground" as string]: secondaryForeground,
    ["--muted" as string]: muted,
    ["--muted-foreground" as string]: mutedForeground,
    ["--accent" as string]: accent,
    ["--accent-foreground" as string]: accentForeground,
    ["--border" as string]: border,
    ["--input" as string]: input,
    ["--ring" as string]: ring,
  } as CSSProperties;
};

export default function PortfolioPage() {
  const params = useParams();
  const username = params.username as string;
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);

  // The 'any' cast acts as a stopgap until convex generates definitions
  const user = useQuery(api.users.getUserByUsername as any, { username });
  const skills = useQuery(api.skills.getSkillsByUser as any, user ? { userId: user._id } : "skip");
  const allSkills = (skills as any[]) ?? [];
  const topSkills = allSkills.slice(0, 5);
  const hasMoreSkills = allSkills.length > 5;
  const portfolioStyle = toPortfolioStyle((user as any)?.themeSettings);

  if (user === undefined) return <div className="p-8">Loading portfolio...</div>;
  if (user === null) return <div className="p-8 text-center text-xl">User not found</div>;

  return (
    <div style={portfolioStyle} className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        {/* Header / About */}
        <section className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{user.displayName}</h1>
          <p className="text-lg md:text-2xl text-muted-foreground font-medium">{user.tagline}</p>
          <p className="text-base md:text-lg leading-relaxed max-w-3xl text-foreground">{user.about}</p>
        </section>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Technical Skills</h2>
            <SkillList
              skills={topSkills as any}
              showDeleteButton={false}
              appendItem={
                hasMoreSkills ? (
                  <Card className="flex items-center justify-center border-dashed p-4 shadow-sm">
                    <Button variant="outline" onClick={() => setSkillsDialogOpen(true)}>
                      See More ({allSkills.length})
                    </Button>
                  </Card>
                ) : undefined
              }
            />

            <Dialog open={skillsDialogOpen} onOpenChange={setSkillsDialogOpen}>
              <DialogContent className="w-[96vw] max-w-6xl max-h-[88vh]">
                <DialogHeader>
                  <DialogTitle>All Skills</DialogTitle>
                </DialogHeader>
                <div className="max-h-[72vh] overflow-y-auto pr-1">
                  <SkillList
                    skills={allSkills as any}
                    showDeleteButton={false}
                    gridClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </section>
        )}

        {/* Projects */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Projects & Experience</h2>
          <ProjectTabs userId={user._id} />
        </section>
      </div>
    </div>
  );
}
