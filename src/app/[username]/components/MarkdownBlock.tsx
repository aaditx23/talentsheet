import ReactMarkdown from "react-markdown";

const normalizeMarkdown = (value?: string) => {
  if (!value) return "";
  // Handle legacy values where newlines were persisted as escaped "\\n" sequences.
  return value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
};

export function MarkdownBlock({ value }: { value?: string }) {
  const normalized = normalizeMarkdown(value);
  if (!normalized.trim()) return null;

  return (
    <div className="prose prose-sm md:prose-base max-w-none text-foreground dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5">
      <ReactMarkdown>{normalized}</ReactMarkdown>
    </div>
  );
}
