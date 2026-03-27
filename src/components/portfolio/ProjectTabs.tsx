"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProjectEntity } from "@/core/entities/project.entity";
import { PortfolioUseCase } from "@/core/usecases/portfolio.usecases";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectTabs({ userId }: { userId: string }) {
  // Use 'any' type cast here until Convex finishes regenerating its types
  const projectsData = useQuery(api.projects.getProjectsByUser as any, { userId: userId as any });

  if (projectsData === undefined) return <div>Loading projects...</div>;

  const projects: ProjectEntity[] = projectsData.map((p: any) => 
      PortfolioUseCase.mapConvexProjectToEntity(p)
  );

  // Group by category
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  if (projects.length === 0) return <div>No projects found.</div>;

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="mb-4">
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat}>
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map((cat) => (
        <TabsContent key={cat} value={cat}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects
              .filter((p) => p.category === cat)
              .map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.screenshotsUrlBase && (
                    <div className="aspect-video w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                       {/* Hardcoding 1.jpg or 1.png for demo purposes. Based on github convention */}
                       <img 
                          src={`${project.screenshotsUrlBase}1.jpg`} 
                          alt={project.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                             // Fallback to png if jpg fails
                             (e.target as HTMLImageElement).src = `${project.screenshotsUrlBase}1.png`;
                          }}
                       />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                        {project.bulletPoints?.map((bp, i) => (
                            <li key={i} className="text-sm text-foreground/80">{bp}</li>
                        ))}
                    </ul>
                    <div className="flex gap-2">
                      <a href={project.githubUrl} target="_blank" className="text-sm text-blue-500 hover:underline">
                        GitHub
                      </a>
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" className="text-sm text-blue-500 hover:underline">
                          Live Site
                        </a>
                      )}
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
