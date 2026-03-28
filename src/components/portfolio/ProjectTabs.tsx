"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

const GitHubMediaCarousel = dynamic(() => import("./GitHubMediaCarousel"), { ssr: false });

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  githubUrl: string;
  screenshotsPath?: string;
  liveLink?: string;
}

export default function ProjectTabs({ userId }: { userId: string }) {
  const projectsData = useQuery(api.projects.getProjectsByUser as any, { userId: userId as any });

  if (projectsData === undefined) return <div className="text-muted-foreground text-sm py-4">Loading projects...</div>;
  if (!projectsData || projectsData.length === 0) return <div className="text-muted-foreground text-sm py-4">No projects found.</div>;

  const projects: Project[] = projectsData as any;
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="mb-6 flex-wrap h-auto gap-1 overflow-x-auto">
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => (
        <TabsContent key={cat} value={cat}>
          {/* VERTICAL layout — one project per row */}
          <div className="flex flex-col gap-8">
            {projects
              .filter((p) => p.category === cat)
              .map((project) => (
                <Card key={project._id} className="overflow-hidden border shadow-sm">
                  {/* GitHub Media Carousel — only rendered if there's a screenshots path */}
                  {project.githubUrl && project.screenshotsPath && (
                    <div className="px-4 pt-4">
                      <GitHubMediaCarousel
                        githubUrl={project.githubUrl}
                        screenshotsPath={project.screenshotsPath}
                      />
                    </div>
                  )}

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.category}</CardDescription>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer">
                            <Badge variant="outline" className="cursor-pointer hover:bg-muted">GitHub ↗</Badge>
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noreferrer">
                            <Badge className="cursor-pointer">Live Site ↗</Badge>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Render markdown description */}
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80">
                      <ReactMarkdown>{project.description}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
