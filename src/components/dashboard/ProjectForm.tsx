"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

/** If the user pastes a full tree URL as screenshotsPath, extract just the folder portion */
function extractFolderPath(input: string): string {
  const treeMatch = input.match(/github\.com\/[^/]+\/[^/]+\/tree\/[^/]+\/(.+)/);
  return treeMatch ? treeMatch[1] : input;
}

/** Default guess — the 'screenshots' folder by convention */
function deriveScreenshotsPath(_githubUrl: string): string {
  return "screenshots";
}

export interface ProjectFormData {
  userId: string;
  title: string;
  category: string;
  githubUrl: string;
  screenshotsPath: string;
  description: string;
  liveLink?: string;
}

interface ProjectFormProps {
  userId: string;
  /** Pre-fill for edit mode */
  initialValues?: Partial<ProjectFormData>;
  submitLabel?: string;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectForm({ userId, initialValues, submitLabel = "Save Project", onSubmit }: ProjectFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [githubUrl, setGithubUrl] = useState(initialValues?.githubUrl ?? "");
  const [screenshotsPath, setScreenshotsPath] = useState(initialValues?.screenshotsPath ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "## Overview\n\n- \n\n## Key Features\n\n- \n");
  const [liveLink, setLiveLink] = useState(initialValues?.liveLink ?? "");
  const [saving, setSaving] = useState(false);

  // Auto-suggest screenshot path when GitHub URL changes (only if user hasn't typed one)
  const handleGithubUrlChange = (val: string) => {
    setGithubUrl(val);
    if (!screenshotsPath || screenshotsPath === "screenshots") {
      setScreenshotsPath(deriveScreenshotsPath(val));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !category.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ userId, title, category, githubUrl, screenshotsPath, description: description ?? "", liveLink });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Project Title</label>
          <Input placeholder="e.g. FuelSense App" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Input placeholder="e.g. Android, Backend, Flutter" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">GitHub Repository URL</label>
        <Input placeholder="https://github.com/username/repo" value={githubUrl} onChange={(e) => handleGithubUrlChange(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">
          Screenshots Folder Path{" "}
          <span className="text-muted-foreground font-normal text-xs">(folder inside the repo, auto-filled)</span>
        </label>
        <Input placeholder="screenshots" value={screenshotsPath} onChange={(e) => setScreenshotsPath(extractFolderPath(e.target.value))} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Live Link <span className="text-muted-foreground font-normal text-xs">(optional)</span></label>
        <Input placeholder="https://your-app.com" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">
          Description{" "}
          <span className="text-muted-foreground font-normal text-xs">(Markdown — bullets become PDF bullet points)</span>
        </label>
        <div data-color-mode="auto">
          <MDEditor value={description} onChange={(val) => setDescription(val ?? "")} height={260} preview="live" />
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={saving || !title.trim() || !category.trim()}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}
