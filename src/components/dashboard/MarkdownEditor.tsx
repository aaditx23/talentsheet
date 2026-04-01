"use client";

import dynamic from "next/dynamic";
import { commands } from "@uiw/react-md-editor";
import { useTheme } from "@/theme/ThemeProvider";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export function MarkdownEditor({ value, onChange, height = 220 }: MarkdownEditorProps) {
  const { mode } = useTheme();

  return (
    <div data-color-mode={mode}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        height={height}
        preview="live"
        commands={[
          commands.bold,
          commands.italic,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.link,
        ]}
      />
    </div>
  );
}
