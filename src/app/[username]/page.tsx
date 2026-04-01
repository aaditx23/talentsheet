"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import ProjectTabs from "@/components/portfolio/ProjectTabs";
import { SkillList } from "@/components/dashboard/SkillList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEFAULT_SECTION_ORDER, isPortfolioSectionKey, type PortfolioSectionKey } from "@/lib/portfolio-sections";

const normalizeMarkdown = (value?: string) => {
  if (!value) return "";
  // Handle legacy values where newlines were persisted as escaped "\\n" sequences.
  return value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
};

function MarkdownBlock({ value }: { value?: string }) {
  const normalized = normalizeMarkdown(value);
  if (!normalized.trim()) return null;

  return (
    <div className="prose prose-sm md:prose-base max-w-none text-foreground dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5">
      <ReactMarkdown>{normalized}</ReactMarkdown>
    </div>
  );
}

const formatDateRange = (startDate?: string, endDate?: string, isPresent?: boolean, fallback?: string) => {
  if (startDate) {
    const end = isPresent ? "Present" : endDate || "";
    return end ? `${startDate} - ${end}` : startDate;
  }
  return fallback || "";
};

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
  const experiences = useQuery((api as any).sections.getExperiencesByUser, user ? { userId: user._id } : "skip");
  const educationEntries = useQuery((api as any).sections.getEducationEntriesByUser, user ? { userId: user._id } : "skip");
  const achievements = useQuery((api as any).sections.getAchievementsByUser, user ? { userId: user._id } : "skip");
  const certifications = useQuery((api as any).sections.getCertificationsByUser, user ? { userId: user._id } : "skip");
  const extracurriculars = useQuery((api as any).sections.getExtracurricularsByUser, user ? { userId: user._id } : "skip");
  const allSkills = (skills as any[]) ?? [];
  const allExperiences = (experiences as any[]) ?? [];
  const allEducationEntries = (educationEntries as any[]) ?? [];
  const allAchievements = (achievements as any[]) ?? [];
  const allCertifications = (certifications as any[]) ?? [];
  const allExtracurriculars = (extracurriculars as any[]) ?? [];
  const topSkills = allSkills.slice(0, 5);
  const hasMoreSkills = allSkills.length > 5;
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
    header: (
      <section className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{user.displayName}</h1>
        <p className="text-lg md:text-2xl text-muted-foreground font-medium">{user.tagline}</p>
        <MarkdownBlock value={user.about} />
      </section>
    ),
    skills:
      skills && skills.length > 0 ? (
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
            <DialogContent
              style={portfolioStyle}
              className="w-[96vw] max-h-[88vh] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl"
            >
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
      ) : null,
    experience:
      allExperiences.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Experience</h2>
          <div className="space-y-3">
            {allExperiences.map((item: any) => (
              <Card key={item._id} className="p-4">
                <p className="font-semibold text-lg">{item.role} @ {item.company}</p>
                <p className="text-sm text-muted-foreground">{formatDateRange(item.startDate, item.endDate, item.isPresent, item.duration)}{item.location ? ` • ${item.location}` : ""}</p>
                <div className="mt-2">
                  <MarkdownBlock value={item.description} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null,
    education:
      allEducationEntries.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Education</h2>
          <div className="space-y-3">
            {allEducationEntries.map((item: any) => (
              <Card key={item._id} className="p-4">
                <p className="font-semibold text-lg">{item.subject ? `${item.degree} in ${item.subject}` : item.degree}</p>
                <p>{item.institution}</p>
                <p className="text-sm text-muted-foreground">{formatDateRange(item.startDate, item.endDate, item.isPresent, item.duration)}{item.location ? ` • ${item.location}` : ""}</p>
                <div className="mt-2">
                  <MarkdownBlock value={item.description} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null,
    achievements:
      allAchievements.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Achievements</h2>
          <div className="space-y-3">
            {allAchievements.map((item: any) => (
              <Card key={item._id} className="p-4">
                <p className="font-semibold text-lg">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.issuer || ""}
                  {item.date ? `${item.issuer ? " • " : ""}${item.date}` : ""}
                </p>
                <div className="mt-2">
                  <MarkdownBlock value={item.description} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null,
    certifications:
      allCertifications.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Certifications</h2>
          <div className="space-y-3">
            {allCertifications.map((item: any) => (
              <Card key={item._id} className="p-4">
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.issuer || ""}
                  {item.issueDate ? `${item.issuer ? " • " : ""}${item.issueDate}` : ""}
                </p>
                {item.credentialUrl ? (
                  <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-sm underline mt-1 inline-block">
                    View Credential
                  </a>
                ) : null}
                <div className="mt-2">
                  <MarkdownBlock value={item.description} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null,
    extracurricular:
      allExtracurriculars.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Co-curricular</h2>
          <div className="space-y-3">
            {allExtracurriculars.map((item: any) => (
              <Card key={item._id} className="p-4">
                <p className="font-semibold text-lg">{item.role}</p>
                <p>{item.organization}</p>
                <p className="text-sm text-muted-foreground">{formatDateRange(item.startDate, item.endDate, item.isPresent, item.duration)}</p>
                <div className="mt-2">
                  <MarkdownBlock value={item.description} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null,
    projects: (
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Projects & Experience</h2>
        <ProjectTabs userId={user._id} />
      </section>
    ),
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
