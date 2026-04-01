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
import { MonthYearInput } from "@/components/ui/month-year-input";

export default function AchievementsPage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const achievements = useQuery((api as any).sections.getAchievementsByUser, user ? { userId: user._id } : "skip");
  const addAchievement = useMutation((api as any).sections.addAchievement);
  const deleteAchievement = useMutation((api as any).sections.deleteAchievement);

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === null) return <LoadingState message="User not found." />;
  if (user === undefined || achievements === undefined) return <LoadingState message="Loading achievements..." />;

  const handleAdd = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await addAchievement({
        userId: user._id,
        title,
        issuer: issuer || undefined,
        date: date || undefined,
        description: description || undefined,
      });
      setTitle("");
      setIssuer("");
      setDate("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Achievements" description="Add achievements, awards, and recognitions." />

      <Card className="p-4 space-y-3">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Issuer (optional)" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        <MonthYearInput value={date} onChange={setDate} ariaLabel="Achievement month and year (optional)" />
        <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Achievement"}</Button>
      </Card>

      <div className="space-y-3">
        {(achievements ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.issuer || ""}{item.date ? `${item.issuer ? " • " : ""}${item.date}` : ""}</p>
              {item.description ? <p className="text-sm mt-2">{item.description}</p> : null}
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteAchievement({ id: item._id })}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
