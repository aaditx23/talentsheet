"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/dashboard/MarkdownEditor";

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

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
  const updateUser = useMutation((api as any).users.updateUser);
  const stackUser = useUser();

  const [username, setUsername] = useState(user.username);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [tagline, setTagline] = useState(user.tagline);
  const [about, setAbout] = useState(user.about);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const normalizedUsername = username.trim().toLowerCase();
  const isUsernameChanged = normalizedUsername !== user.username;
  const isUsernameValid = USERNAME_REGEX.test(normalizedUsername);

  const availability = useQuery(
    (api as any).users.checkUsernameAvailability,
    isUsernameChanged && isUsernameValid ? { username: normalizedUsername } : "skip",
  ) as { available: boolean; normalized: string } | undefined;

  useEffect(() => {
    setUsername(user.username);
    setDisplayName(user.displayName);
    setTagline(user.tagline);
    setAbout(user.about);
  }, [user]);

  const handleSave = async () => {
    setSaveError(null);

    if (isUsernameChanged && !isUsernameValid) {
      setSaveError("Username must be 3-30 chars and contain only lowercase letters, numbers, and underscores.");
      return;
    }

    if (isUsernameChanged && availability && !availability.available) {
      setSaveError("That portfolio URL is not available.");
      return;
    }

    setSaving(true);
    try {
      await updateUser({
        userId: user._id,
        username: normalizedUsername,
        displayName,
        tagline,
        about,
      });

      if (stackUser?.setDisplayName) {
        await stackUser.setDisplayName(displayName || null);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setSaveError(e?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Details</CardTitle>
        <CardDescription>Your portfolio URL can be changed below.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Portfolio URL</label>
          <div className="flex items-center rounded-lg border pl-2 pr-1 border-input h-8">
            <span className="text-sm text-muted-foreground mr-1">/</span>
            <Input
              className="border-0 shadow-none px-2 h-6 focus-visible:ring-0"
              placeholder="your_name"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
            />
          </div>
          <p className="text-xs mt-1 text-muted-foreground">Current: /{user.username}</p>
          {isUsernameChanged && !isUsernameValid ? (
            <p className="text-xs mt-1 text-destructive">Use 3-30 chars: a-z, 0-9, and _ only.</p>
          ) : null}
          {isUsernameChanged && isUsernameValid && availability ? (
            availability.available ? (
              <p className="text-xs mt-1 text-emerald-600">/{availability.normalized} is available.</p>
            ) : (
              <p className="text-xs mt-1 text-destructive">/{availability.normalized} is already taken.</p>
            )
          ) : null}
        </div>

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
          <label className="text-sm font-medium mb-2 block">About (Markdown)</label>
          <MarkdownEditor value={about} onChange={setAbout} height={220} />
        </div>

        {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
        <Button
          onClick={handleSave}
          disabled={
            saving ||
            (isUsernameChanged && !isUsernameValid) ||
            (isUsernameChanged && !!availability && !availability.available)
          }
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
