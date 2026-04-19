import { Card } from "@/components/ui/card";
import { MarkdownBlock } from "./MarkdownBlock";
import { formatMonthYear } from "./section-utils";

export function AchievementsSection({ items }: { items: any[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Achievements</h2>
      <div className="space-y-3">
        {items.map((item: any) => (
          <Card key={item._id} className="p-4">
            <p className="font-semibold text-lg">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {item.issuer || ""}
              {item.date ? `${item.issuer ? " • " : ""}${formatMonthYear(item.date)}` : ""}
            </p>
            <div className="mt-2">
              <MarkdownBlock value={item.description} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
