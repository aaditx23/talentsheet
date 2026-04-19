import { Card } from "@/components/ui/card";
import { MarkdownBlock } from "./MarkdownBlock";
import { formatMonthYear } from "./section-utils";

export function ResearchPublicationsSection({ items }: { items: any[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Research & Publications</h2>
      <div className="space-y-3">
        {items.map((item: any) => (
          <Card key={item._id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-lg leading-tight">{item.title}</p>
              <p className="text-sm text-muted-foreground whitespace-nowrap text-right">{formatMonthYear(item.date)}</p>
            </div>
            {item.venue ? <p className="text-sm text-muted-foreground mt-1">{item.venue}</p> : null}
            {item.link ? (
              <a href={item.link} target="_blank" rel="noreferrer" className="text-sm underline mt-1 inline-block">
                View Publication
              </a>
            ) : null}
            <div className="mt-2">
              <MarkdownBlock value={item.description} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
