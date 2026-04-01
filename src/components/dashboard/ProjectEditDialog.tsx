"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm, ProjectFormData } from "./ProjectForm";

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

interface ProjectEditDialogProps {
  project: Project;
  categorySuggestions?: string[];
  open: boolean;
  onClose: () => void;
}

export function ProjectEditDialog({ project, categorySuggestions = [], open, onClose }: ProjectEditDialogProps) {
  const updateProject = useMutation(api.projects.updateProject as any);

  const handleSubmit = async (data: ProjectFormData) => {
    await updateProject({
      projectId: project._id as any,
      title: data.title,
      category: data.category,
      githubUrl: data.githubUrl,
      screenshotsPath: data.screenshotsPath,
      description: data.description,
      liveLink: data.liveLink || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <ProjectForm
          userId={project.userId}
          categorySuggestions={categorySuggestions}
          initialValues={{
            title: project.title,
            category: project.category,
            githubUrl: project.githubUrl,
            screenshotsPath: project.screenshotsPath ?? "screenshots",
            description: project.description,
            liveLink: project.liveLink,
          }}
          submitLabel="Update Project"
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
