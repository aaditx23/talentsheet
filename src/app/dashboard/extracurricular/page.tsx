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

const formatDateRange = (startDate?: string, endDate?: string, isPresent?: boolean, fallback?: string) => {
  if (startDate) {
    const end = isPresent ? "Present" : endDate || "";
    return end ? `${startDate} - ${end}` : startDate;
  }
  return fallback || "";
};

export default function ExtracurricularPage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const activities = useQuery((api as any).sections.getExtracurricularsByUser, user ? { userId: user._id } : "skip");
  const addActivity = useMutation((api as any).sections.addExtracurricular);
  const deleteActivity = useMutation((api as any).sections.deleteExtracurricular);
  const updateActivity = useMutation((api as any).sections.updateExtracurricular);

  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === null) return <LoadingState message="User not found." />;
  if (user === undefined || activities === undefined) return <LoadingState message="Loading co-curricular..." />;

  const isAddValid = Boolean(
    organization.trim() &&
    role.trim() &&
    startDate.trim() &&
    endDate.trim() &&
    description.trim(),
  );

  const handleAdd = async () => {
    if (!isAddValid) return;
    const duration = formatDateRange(startDate, endDate, false);
    setSaving(true);
    try {
      await addActivity({
        userId: user._id,
        organization: organization.trim(),
        role: role.trim(),
        duration,
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        isPresent: false,
        description: description.trim(),
      });
      setOrganization("");
      setRole("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Co-curricular" description="Add clubs, volunteering, and activities." />

      <Card className="p-4 space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Organization *</label>
          <Input placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Role *</label>
          <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date *</label>
            <MonthYearInput value={startDate} onChange={setStartDate} ariaLabel="Activity start month and year" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">End Date *</label>
            <MonthYearInput value={endDate} onChange={setEndDate} ariaLabel="Activity end month and year" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Description *</label>
          <MarkdownEditor value={description} onChange={setDescription} />
        </div>
        <Button onClick={handleAdd} disabled={saving || !isAddValid}>{saving ? "Adding..." : "Add Activity"}</Button>
      </Card>

      <div className="space-y-3">
        {(activities ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{item.role}</p>
              <p className="text-sm">{item.organization}</p>
              <p className="text-sm text-muted-foreground">{formatDateRange(item.startDate, item.endDate, item.isPresent, item.duration)}</p>
              {item.description ? (
                <div className="prose prose-sm max-w-none mt-2 text-foreground dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5">
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setEditingItem(item)}>Edit</Button>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => deleteActivity({ id: item._id })}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Co-curricular</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Organization *</label>
                <Input value={editingItem.organization} onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Role *</label>
                <Input value={editingItem.role} onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date *</label>
                  <MonthYearInput
                    value={editingItem.startDate ?? ""}
                    onChange={(value) => setEditingItem({ ...editingItem, startDate: value })}
                    ariaLabel="Edit activity start month and year"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date *</label>
                  <MonthYearInput
                    value={editingItem.endDate ?? ""}
                    onChange={(value) => setEditingItem({ ...editingItem, endDate: value })}
                    ariaLabel="Edit activity end month and year"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <MarkdownEditor value={editingItem.description ?? ""} onChange={(next) => setEditingItem({ ...editingItem, description: next })} />
              </div>
              <Button
                disabled={editSaving || !editingItem.organization?.trim() || !editingItem.role?.trim() || !editingItem.startDate?.trim() || !editingItem.endDate?.trim() || !editingItem.description?.trim()}
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    const duration = formatDateRange(editingItem.startDate, editingItem.endDate, false, editingItem.duration);
                    await updateActivity({
                      id: editingItem._id,
                      organization: editingItem.organization.trim(),
                      role: editingItem.role.trim(),
                      duration,
                      startDate: editingItem.startDate.trim(),
                      endDate: editingItem.endDate.trim(),
                      isPresent: false,
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
