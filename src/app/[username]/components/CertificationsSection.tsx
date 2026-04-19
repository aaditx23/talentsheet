import { Card } from "@/components/ui/card";
import { MarkdownBlock } from "./MarkdownBlock";
import { formatMonthYear } from "./section-utils";

export function CertificationsSection({ items }: { items: any[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Certifications</h2>
      <div className="space-y-3">
        {items.map((item: any) => (
          <Card key={item._id} className="p-4">
            <p className="font-semibold text-lg">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.issuer || ""}
              {item.issueDate ? `${item.issuer ? " • " : ""}${formatMonthYear(item.issueDate)}` : ""}
            </p>
            {item.credentialUrl ? (
              <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-sm underline mt-1 inline-block">
                View Credential
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
