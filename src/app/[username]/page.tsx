"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import { DEFAULT_SECTION_ORDER, isPortfolioSectionKey, type PortfolioSectionKey } from "@/lib/portfolio-sections";
import { HeaderSection } from "./components/HeaderSection";
import { SkillsSection } from "./components/SkillsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { AchievementsSection } from "./components/AchievementsSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { ExtracurricularSection } from "./components/ExtracurricularSection";
import { ResearchPublicationsSection } from "./components/ResearchPublicationsSection";
import { ProjectsSection } from "./components/ProjectsSection";

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

  // The 'any' cast acts as a stopgap until convex generates definitions
  const user = useQuery(api.users.getUserByUsername as any, { username });
  const skills = useQuery(api.skills.getSkillsByUser as any, user ? { userId: user._id } : "skip");
  const experiences = useQuery((api as any).sections.getExperiencesByUser, user ? { userId: user._id } : "skip");
  const educationEntries = useQuery((api as any).sections.getEducationEntriesByUser, user ? { userId: user._id } : "skip");
  const achievements = useQuery((api as any).sections.getAchievementsByUser, user ? { userId: user._id } : "skip");
  const certifications = useQuery((api as any).sections.getCertificationsByUser, user ? { userId: user._id } : "skip");
  const extracurriculars = useQuery((api as any).sections.getExtracurricularsByUser, user ? { userId: user._id } : "skip");
  const researchPublications = useQuery((api as any).sections.getResearchPublicationsByUser, user ? { userId: user._id } : "skip");
  const allSkills = (skills as any[]) ?? [];
  const allExperiences = (experiences as any[]) ?? [];
  const allEducationEntries = (educationEntries as any[]) ?? [];
  const allAchievements = (achievements as any[]) ?? [];
  const allCertifications = (certifications as any[]) ?? [];
  const allExtracurriculars = (extracurriculars as any[]) ?? [];
  const allResearchPublications = (researchPublications as any[]) ?? [];
  const portfolioStyle = toPortfolioStyle((user as any)?.themeSettings);
  const rawSectionOrder = (((user as any)?.sectionLayout?.sectionOrder ?? []) as string[]).filter(isPortfolioSectionKey);
  const sectionOrder: PortfolioSectionKey[] = [
    ...rawSectionOrder,
    ...DEFAULT_SECTION_ORDER.filter((key) => !rawSectionOrder.includes(key)),
  ];
  const hiddenSections = new Set(
    ((((user as any)?.sectionLayout?.hiddenSections ?? []) as string[]).filter(isPortfolioSectionKey)) as PortfolioSectionKey[],
  );
  const isVisible = (section: PortfolioSectionKey) => !hiddenSections.has(section);

  if (user === undefined) return <div className="p-8">Loading portfolio...</div>;
  if (user === null) return <div className="p-8 text-center text-xl">User not found</div>;

  const sectionBlocks: Partial<Record<PortfolioSectionKey, React.ReactNode>> = {
    header: <HeaderSection displayName={user.displayName} tagline={user.tagline} about={user.about} />,
    skills: <SkillsSection skills={allSkills} portfolioStyle={portfolioStyle} />,
    experience: <ExperienceSection items={allExperiences} />,
    education: <EducationSection items={allEducationEntries} />,
    achievements: <AchievementsSection items={allAchievements} />,
    certifications: <CertificationsSection items={allCertifications} />,
    extracurricular: <ExtracurricularSection items={allExtracurriculars} />,
    researchPublications: <ResearchPublicationsSection items={allResearchPublications} />,
    projects: <ProjectsSection userId={user._id} />,
  };

  return (
    <div style={portfolioStyle} className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        {sectionOrder
          .filter(isVisible)
          .map((sectionKey) => {
            const content = sectionBlocks[sectionKey];
            if (!content) return null;
            return <div key={sectionKey}>{content}</div>;
          })}
      </div>
    </div>
  );
}
