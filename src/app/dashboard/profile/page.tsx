"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSession } from "@/context/SessionContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default function ProfilePage() {
  const session = useSession();

  const user = useQuery(api.users.getUserByUsername as any, session?.username ? { username: session.username } : "skip");

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === undefined) return <LoadingState message="Loading profile..." />;
  if (user === null) return <LoadingState message="Profile not found." />;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <PageHeader
        title="Profile Settings"
        description="Manage how your portfolio appears publicly."
      />
      <ProfileForm user={user as any} />
    </div>
  );
}
