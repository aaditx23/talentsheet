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

export default function ExperiencePage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const experiences = useQuery((api as any).sections.getExperiencesByUser, user ? { userId: user._id } : "skip");
  const addExperience = useMutation((api as any).sections.addExperience);
  const deleteExperience = useMutation((api as any).sections.deleteExperience);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === undefined || experiences === undefined) return <LoadingState message="Loading experience..." />;

  const handleAdd = async () => {
    if (!company.trim() || !role.trim() || !duration.trim()) return;
    setSaving(true);
    try {
      await addExperience({
        userId: user._id,
        company,
        role,
        duration,
        location: location || undefined,
        description: description || undefined,
      });
      setCompany("");
      setRole("");
      setDuration("");
      setLocation("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Experience" description="Add work experiences for your portfolio." />

      <Card className="p-4 space-y-3">
        <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <Input placeholder="Duration (e.g. Jan 2024 - Present)" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Textarea rows={4} placeholder="Highlights / bullet points (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Experience"}</Button>
      </Card>

      <div className="space-y-3">
        {(experiences ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{item.role} @ {item.company}</p>
              <p className="text-sm text-muted-foreground">{item.duration}{item.location ? ` • ${item.location}` : ""}</p>
              {item.description && <p className="text-sm mt-2 whitespace-pre-line">{item.description}</p>}
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteExperience({ id: item._id })}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
