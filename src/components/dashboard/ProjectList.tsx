"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  _id: string;
  title: string;
  category: string;
  githubUrl?: string;
}

interface ProjectListProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export function ProjectList({ projects, onDelete }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No projects added yet. Use the form above to add your first project.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {projects.map((p) => (
        <Card
          key={p._id}
          className="flex flex-row items-center justify-between p-4 shadow-sm border"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{p.title}</h3>
              <Badge variant="outline" className="text-xs shrink-0">
                {p.category}
              </Badge>
            </div>
            {p.githubUrl && (
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground truncate block max-w-sm"
              >
                {p.githubUrl}
              </a>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="ml-4 shrink-0"
            onClick={() => onDelete(p._id)}
          >
            Delete
          </Button>
        </Card>
      ))}
    </div>
  );
}
