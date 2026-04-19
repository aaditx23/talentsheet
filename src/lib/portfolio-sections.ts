export type PortfolioSectionKey =
  | "header"
  | "skills"
  | "experience"
  | "education"
  | "achievements"
  | "certifications"
  | "extracurricular"
  | "researchPublications"
  | "projects";

export const DEFAULT_SECTION_ORDER: PortfolioSectionKey[] = [
  "header",
  "skills",
  "experience",
  "education",
  "achievements",
  "certifications",
  "extracurricular",
  "researchPublications",
  "projects",
];

export const SECTION_LABELS: Record<PortfolioSectionKey, string> = {
  header: "Header & About",
  skills: "Technical Skills",
  experience: "Experience",
  education: "Education",
  achievements: "Achievements",
  certifications: "Certifications",
  extracurricular: "Co-curricular",
  researchPublications: "Research & Publications",
  projects: "Projects & Experience",
};

export const isPortfolioSectionKey = (value: string): value is PortfolioSectionKey =>
  (DEFAULT_SECTION_ORDER as string[]).includes(value);
