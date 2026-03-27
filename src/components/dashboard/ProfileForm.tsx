"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface User {
  _id: string;
  username: string;
  displayName: string;
  tagline: string;
  about: string;
}

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateUser = useMutation(api.users.updateUser as any);

  const [displayName, setDisplayName] = useState(user.displayName);
  const [tagline, setTagline] = useState(user.tagline);
  const [about, setAbout] = useState(user.about);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync if parent user prop changes
  useEffect(() => {
    setDisplayName(user.displayName);
    setTagline(user.tagline);
    setAbout(user.about);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        userId: user._id,
        displayName,
        tagline,
        about,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Details</CardTitle>
        <CardDescription>
          Your portfolio is visible at{" "}
          <span className="font-mono text-foreground">/{user.username}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Display Name</label>
          <Input
            placeholder="Your full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Tagline</label>
          <Input
            placeholder="e.g. Software Engineer (Mobile & Backend)"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">About</label>
          <Input
            placeholder="A short bio about you..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}