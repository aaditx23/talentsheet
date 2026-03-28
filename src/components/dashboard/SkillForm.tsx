"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PROFICIENCY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

interface SkillFormProps {
  userId: string;
  onAdd: (data: {
    userId: string;
    name: string;
    proficiency: number;
  }) => Promise<void>;
}

export function SkillForm({ userId, onAdd }: SkillFormProps) {
  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState<number>(5);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onAdd({ userId, name, proficiency });
      setName("");
      setProficiency(5);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Skill</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="col-span-2">
            <label className="text-sm font-medium mb-1 block">Skill Name</label>
            <Input
              placeholder="e.g. Kotlin, Flutter, NestJS..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Proficiency{" "}
              <span className="text-muted-foreground font-normal">({proficiency}/10)</span>
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
            >
              {PROFICIENCY_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} — {n <= 3 ? "Beginner" : n <= 6 ? "Intermediate" : n <= 8 ? "Proficient" : n === 9 ? "Advanced" : "Expert"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
          {saving ? "Saving..." : "Add Skill"}
        </Button>
      </CardContent>
    </Card>
  );
}