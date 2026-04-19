"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ProjectForm } from "@/components/dashboard/ProjectForm";
import { ProjectList } from "@/components/dashboard/ProjectList";

export default function ProjectsPage() {
  const session = useSession();

  const user = useQuery(api.users.getUserByUsername as any, session?.username ? { username: session.username } : "skip");
  const projects = useQuery(api.projects.getProjectsByUser as any, user ? { userId: user._id } : "skip");
  const categorySuggestions = useQuery(
    api.projects.getCategoriesByUser,
    user ? { userId: user._id } : "skip",
  ) as string[] | undefined;
  const addProject = useMutation(api.projects.addProject as any);
  const deleteProject = useMutation(api.projects.deleteProject as any);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === null) return <LoadingState message="User not found." />;
  if (user === undefined || projects === undefined || categorySuggestions === undefined) {
    return <LoadingState message="Loading projects..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Projects" description="Add or remove portfolio projects. Changes sync instantly." />
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
        <ProjectForm
          userId={user?._id}
          categorySuggestions={categorySuggestions ?? []}
          onSubmit={async (data) => { await addProject(data as any); }}
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Projects</h2>
        <ProjectList
          projects={projects ?? []}
          categorySuggestions={categorySuggestions ?? []}
          onDelete={(id) => deleteProject({ projectId: id as any })}
        />
      </div>
    </div>
  );
}
