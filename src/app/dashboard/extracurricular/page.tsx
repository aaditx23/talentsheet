"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSession } from "@/context/SessionContext";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ExtracurricularPage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const activities = useQuery((api as any).sections.getExtracurricularsByUser, user ? { userId: user._id } : "skip");
  const addActivity = useMutation((api as any).sections.addExtracurricular);
  const deleteActivity = useMutation((api as any).sections.deleteExtracurricular);

  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === undefined || activities === undefined) return <LoadingState message="Loading co-curricular..." />;

  const handleAdd = async () => {
    if (!organization.trim() || !role.trim() || !duration.trim()) return;
    setSaving(true);
    try {
      await addActivity({
        userId: user._id,
        organization,
        role,
        duration,
        description: description || undefined,
      });
      setOrganization("");
      setRole("");
      setDuration("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Co-curricular" description="Add clubs, volunteering, and activities." />

      <Card className="p-4 space-y-3">
        <Input placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} />
        <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <Input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Textarea rows={4} placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Activity"}</Button>
      </Card>

      <div className="space-y-3">
        {(activities ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{item.role}</p>
              <p className="text-sm">{item.organization}</p>
              <p className="text-sm text-muted-foreground">{item.duration}</p>
              {item.description && <p className="text-sm mt-2 whitespace-pre-line">{item.description}</p>}
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteActivity({ id: item._id })}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
