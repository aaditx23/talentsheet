import { Card } from "@/components/ui/card";
import { MarkdownBlock } from "./MarkdownBlock";
import { formatDateRange } from "./section-utils";

export function ExtracurricularSection({ items }: { items: any[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Co-curricular</h2>
      <div className="space-y-3">
        {items.map((item: any) => (
          <Card key={item._id} className="p-4">
            <p className="font-semibold text-lg">{item.role}</p>
            <p>{item.organization}</p>
            <p className="text-sm text-muted-foreground">
              {formatDateRange(item.startDate, item.endDate, item.isPresent, item.duration)}
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
