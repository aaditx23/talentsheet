"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard, ProjectCardProps } from "./ProjectCard";

export default function ProjectTabs({ userId }: { userId: string }) {
  const projectsData = useQuery(api.projects.getProjectsByUser as any, { userId: userId as any });

  if (projectsData === undefined) return <div className="text-muted-foreground text-sm py-4">Loading projects...</div>;
  if (!projectsData || projectsData.length === 0) return <div className="text-muted-foreground text-sm py-4">No projects found.</div>;

  const projects = projectsData as unknown as ProjectCardProps[];
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="mb-6 flex-wrap h-auto gap-1 overflow-x-auto overflow-y-hidden">
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => (
        <TabsContent key={cat} value={cat}>
          <div className="flex flex-col gap-8">
            {projects
              .filter((p) => p.category === cat)
              .map((project) => (
                <ProjectCard key={project._id} {...project} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
