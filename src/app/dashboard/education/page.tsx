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

export default function EducationPage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const entries = useQuery((api as any).sections.getEducationEntriesByUser, user ? { userId: user._id } : "skip");
  const addEntry = useMutation((api as any).sections.addEducationEntry);
  const deleteEntry = useMutation((api as any).sections.deleteEducationEntry);

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === undefined || entries === undefined) return <LoadingState message="Loading education..." />;

  const handleAdd = async () => {
    if (!institution.trim() || !degree.trim() || !duration.trim()) return;
    setSaving(true);
    try {
      await addEntry({ userId: user._id, institution, degree, duration, location: location || undefined });
      setInstitution("");
      setDegree("");
      setDuration("");
      setLocation("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Education" description="Add education history for your portfolio." />

      <Card className="p-4 space-y-3">
        <Input placeholder="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} />
        <Input placeholder="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} />
        <Input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Education"}</Button>
      </Card>

      <div className="space-y-3">
        {(entries ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{item.degree}</p>
              <p className="text-sm">{item.institution}</p>
              <p className="text-sm text-muted-foreground">{item.duration}{item.location ? ` • ${item.location}` : ""}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteEntry({ id: item._id })}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
