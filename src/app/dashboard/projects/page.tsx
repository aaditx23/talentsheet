"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { getSession } from "@/app/actions/auth.actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ProjectForm } from "@/components/dashboard/ProjectForm";
import { ProjectList } from "@/components/dashboard/ProjectList";

export default function ProjectsPage() {
  const [session, setSession] = useState<any>(null);
  useEffect(() => { getSession().then(setSession); }, []);

  const user = useQuery(api.users.getUserByUsername as any, session?.username ? { username: session.username } : "skip");
  const projects = useQuery(api.projects.getProjectsByUser as any, user ? { userId: user._id } : "skip");
  const addProject = useMutation(api.projects.addProject as any);
  const deleteProject = useMutation(api.projects.deleteProject as any);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === undefined || projects === undefined) return <LoadingState message="Loading projects..." />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Manage Projects"
        description="Add or remove portfolio projects. Changes sync instantly."
      />
      <ProjectForm
        userId={user?._id}
        onAdd={async (data) => { await addProject(data as any); }}
      />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Projects</h2>
        <ProjectList
          projects={projects ?? []}
          onDelete={(id) => deleteProject({ projectId: id as any })}
        />
      </div>
    </div>
  );
}
