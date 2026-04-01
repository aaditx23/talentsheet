"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectEditDialog } from "./ProjectEditDialog";

interface Project {
  _id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  githubUrl: string;
  screenshotsPath?: string;
  liveLink?: string;
}

interface ProjectListProps {
  projects: Project[];
  categorySuggestions?: string[];
  onDelete: (id: string) => void;
}

export function ProjectList({ projects, categorySuggestions = [], onDelete }: ProjectListProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No projects added yet. Use the form above to add your first project.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-3">
        {projects.map((p) => (
          <Card key={p._id} className="flex flex-row items-center justify-between p-4 shadow-sm border">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{p.title}</h3>
                <Badge variant="outline" className="text-xs shrink-0">{p.category}</Badge>
              </div>
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground truncate block max-w-sm">
                  {p.githubUrl}
                </a>
              )}
              {p.screenshotsPath && (
                <p className="text-xs text-muted-foreground mt-0.5">📁 {p.screenshotsPath}</p>
              )}
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setEditingProject(p)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(p._id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {editingProject && (
        <ProjectEditDialog
          project={editingProject}
          categorySuggestions={categorySuggestions}
          open={!!editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </>
  );
}
