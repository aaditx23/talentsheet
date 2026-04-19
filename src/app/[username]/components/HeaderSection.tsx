import { MarkdownBlock } from "./MarkdownBlock";

interface HeaderSectionProps {
  displayName: string;
  tagline: string;
  about?: string;
}

export function HeaderSection({ displayName, tagline, about }: HeaderSectionProps) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{displayName}</h1>
      <p className="text-lg md:text-2xl text-muted-foreground font-medium">{tagline}</p>
      <MarkdownBlock value={about} />
    </section>
  );
}
