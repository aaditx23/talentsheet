"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/theme/ThemeProvider";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import to avoid SSR issues with the editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface ProjectFormProps {
  userId: string;
  onAdd: (data: {
    userId: string;
    title: string;
    category: string;
    githubUrl: string;
    description: string;
  }) => Promise<void>;
}

export function ProjectForm({ userId, onAdd }: ProjectFormProps) {
  const { mode } = useTheme();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("- Bullet Point 1 \n- Bullet Point 2");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !category.trim()) return;
    setSaving(true);
    try {
      await onAdd({ userId, title, category, githubUrl, description: description ?? "" });
      setTitle("");
      setCategory("");
      setGithubUrl("");
      setDescription("- Bullet Point 1 \n- Bullet Point 2");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Project Title</label>
            <Input
              placeholder="e.g. FuelSense App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Input
              placeholder="e.g. Android, Backend, Flutter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">GitHub Repository URL</label>
          <Input
            placeholder="https://github.com/username/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            Description{" "}
            <span className="text-muted-foreground font-normal text-xs">
              (Markdown — bullets here become PDF bullet points)
            </span>
          </label>
          {/* data-color-mode ensures editor respects the page's light/dark theme */}
          <div data-color-mode={mode}>
            <MDEditor
              value={description}
              onChange={(val) => setDescription(val ?? "")}
              height={260}
              preview="live"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving || !title.trim() || !category.trim()}>
          {saving ? "Saving..." : "Save Project"}
        </Button>
      </CardContent>
    </Card>
  );
}
