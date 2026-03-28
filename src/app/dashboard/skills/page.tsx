"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { SkillForm } from "@/components/dashboard/SkillForm";
import { SkillList } from "@/components/dashboard/SkillList";

export default function SkillsPage() {
  const session = useSession();

  const user = useQuery(api.users.getUserByUsername as any, session?.username ? { username: session.username } : "skip");
  const skills = useQuery(api.skills.getSkillsByUser as any, user ? { userId: user._id } : "skip");
  const addSkill = useMutation(api.skills.addSkill as any);
  const deleteSkill = useMutation(api.skills.deleteSkill as any);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === undefined || skills === undefined) return <LoadingState message="Loading skills..." />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Manage Skills"
        description="Add technical skills displayed on your public portfolio."
      />
      <SkillForm
        userId={user?._id}
        onAdd={async (data) => { await addSkill(data as any); }}
      />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Skills</h2>
        <SkillList
          skills={skills ?? []}
          onDelete={(id) => deleteSkill({ skillId: id as any })}
        />
      </div>
    </div>
  );
}
