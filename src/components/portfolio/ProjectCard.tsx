"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

const RepoMediaCarousel = dynamic(() => import("./RepoMediaCarousel"), { ssr: false });

export interface ProjectCardProps {
  _id: string;
  title: string;
  category: string;
  description: string;
  githubUrl: string;
  screenshotsPath?: string;
  liveLink?: string;
}

/** Detect which platform the repo URL is from for the badge label */
function repoBadgeLabel(url: string): string {
  if (url.includes("gitlab.com")) return "GitLab ↗";
  return "GitHub ↗";
}

export function ProjectCard({ _id, title, category, description, githubUrl, screenshotsPath, liveLink }: ProjectCardProps) {
  return (
    <Card key={_id} className="overflow-hidden border shadow-sm">
      {/* Media carousel — only if screenshotsPath is set */}
      {githubUrl && screenshotsPath && (
        <RepoMediaCarousel repoUrl={githubUrl} screenshotsPath={screenshotsPath} />
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">{category}</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  {repoBadgeLabel(githubUrl)}
                </Badge>
              </a>
            )}
            {liveLink && (
              <a href={liveLink} target="_blank" rel="noreferrer">
                <Badge className="cursor-pointer">Live Site ↗</Badge>
              </a>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose prose-sm max-w-none text-foreground dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/85 prose-a:text-primary">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
