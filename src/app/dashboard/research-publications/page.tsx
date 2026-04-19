"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSession } from "@/context/SessionContext";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MonthYearInput } from "@/components/ui/month-year-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarkdownEditor } from "@/components/dashboard/MarkdownEditor";
import ReactMarkdown from "react-markdown";

export default function ResearchPublicationsPage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const items = useQuery((api as any).sections.getResearchPublicationsByUser, user ? { userId: user._id } : "skip");
  const addItem = useMutation((api as any).sections.addResearchPublication);
  const deleteItem = useMutation((api as any).sections.deleteResearchPublication);
  const updateItem = useMutation((api as any).sections.updateResearchPublication);

  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === null) return <LoadingState message="User not found." />;
  if (user === undefined || items === undefined) return <LoadingState message="Loading research publications..." />;

  const isAddValid = Boolean(title.trim() && date.trim() && description.trim());

  const handleAdd = async () => {
    if (!isAddValid) return;
    setSaving(true);
    try {
      await addItem({
        userId: user._id,
        title: title.trim(),
        venue: venue || undefined,
        date: date.trim(),
        link: link || undefined,
        description: description.trim(),
      });
      setTitle("");
      setVenue("");
      setDate("");
      setLink("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Research & Publications"
        description="Include undergrad, unpublished, and published research works."
      />

      <Card className="p-4 space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Research Title *</label>
          <Input placeholder="Research title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Venue / Journal / Conference</label>
          <Input placeholder="Venue / Journal / Conference (optional)" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Date *</label>
          <MonthYearInput value={date} onChange={setDate} ariaLabel="Research month and year" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Link</label>
          <Input placeholder="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description *</label>
          <MarkdownEditor value={description} onChange={setDescription} />
        </div>

        <Button onClick={handleAdd} disabled={saving || !isAddValid}>{saving ? "Adding..." : "Add Research Work"}</Button>
      </Card>

      <div className="space-y-3">
        {(items ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.venue || "Research"}
                {item.date ? ` • ${item.date}` : ""}
              </p>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer" className="text-sm underline">
                  View Link
                </a>
              ) : null}
              {item.description ? (
                <div className="prose prose-sm max-w-none mt-2 text-foreground dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5">
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setEditingItem(item)}>Edit</Button>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => deleteItem({ id: item._id })}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Research Work</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Research Title *</label>
                <Input value={editingItem.title} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Venue / Journal / Conference</label>
                <Input value={editingItem.venue ?? ""} onChange={(e) => setEditingItem({ ...editingItem, venue: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date *</label>
                <MonthYearInput
                  value={editingItem.date ?? ""}
                  onChange={(value) => setEditingItem({ ...editingItem, date: value })}
                  ariaLabel="Edit research month and year"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Link</label>
                <Input value={editingItem.link ?? ""} onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <MarkdownEditor value={editingItem.description ?? ""} onChange={(next) => setEditingItem({ ...editingItem, description: next })} />
              </div>
              <Button
                disabled={editSaving || !editingItem.title?.trim() || !editingItem.date?.trim() || !editingItem.description?.trim()}
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    await updateItem({
                      id: editingItem._id,
                      title: editingItem.title.trim(),
                      venue: editingItem.venue ?? "",
                      date: editingItem.date.trim(),
                      link: editingItem.link ?? "",
                      description: editingItem.description.trim(),
                    });
                    setEditingItem(null);
                  } finally {
                    setEditSaving(false);
                  }
                }}
              >
                {editSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
