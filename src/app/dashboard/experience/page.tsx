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

export default function ExperiencePage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const experiences = useQuery((api as any).sections.getExperiencesByUser, user ? { userId: user._id } : "skip");
  const addExperience = useMutation((api as any).sections.addExperience);
  const deleteExperience = useMutation((api as any).sections.deleteExperience);
  const updateExperience = useMutation((api as any).sections.updateExperience);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === null) return <LoadingState message="User not found." />;
  if (user === undefined || experiences === undefined) return <LoadingState message="Loading experience..." />;

  const isAddValid = Boolean(
    company.trim() &&
    role.trim() &&
    startDate.trim() &&
    endDate.trim() &&
    location.trim() &&
    description.trim(),
  );

  const handleAdd = async () => {
    if (!isAddValid) return;
    const duration = formatDateRange(startDate, endDate, false);
    setSaving(true);
    try {
      await addExperience({
        userId: user._id,
        company: company.trim(),
        role: role.trim(),
        duration,
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        isPresent: false,
        location: location.trim(),
        description: description.trim(),
      });
      setCompany("");
      setRole("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Experience" description="Add work experiences for your portfolio." />

      <Card className="p-4 space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Company *</label>
          <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Role *</label>
          <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date *</label>
            <MonthYearInput value={startDate} onChange={setStartDate} ariaLabel="Experience start month and year" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">End Date *</label>
            <MonthYearInput value={endDate} onChange={setEndDate} ariaLabel="Experience end month and year" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Location *</label>
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Description *</label>
          <MarkdownEditor value={description} onChange={setDescription} />
        </div>
        <Button onClick={handleAdd} disabled={saving || !isAddValid}>{saving ? "Adding..." : "Add Experience"}</Button>
      </Card>

      <div className="space-y-3">
        {(experiences ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{item.role} @ {item.company}</p>
              <p className="text-sm text-muted-foreground">{formatDateRange(item.startDate, item.endDate, item.isPresent, item.duration)}{item.location ? ` • ${item.location}` : ""}</p>
              {item.description ? (
                <div className="prose prose-sm max-w-none mt-2 text-foreground dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5">
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setEditingItem(item)}>Edit</Button>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => deleteExperience({ id: item._id })}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Company *</label>
                <Input value={editingItem.company} onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })} />
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
                    ariaLabel="Edit experience start month and year"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date *</label>
                  <MonthYearInput
                    value={editingItem.endDate ?? ""}
                    onChange={(value) => setEditingItem({ ...editingItem, endDate: value })}
                    ariaLabel="Edit experience end month and year"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Location *</label>
                <Input value={editingItem.location ?? ""} onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <MarkdownEditor value={editingItem.description ?? ""} onChange={(next) => setEditingItem({ ...editingItem, description: next })} />
              </div>
              <Button
                disabled={editSaving || !editingItem.company?.trim() || !editingItem.role?.trim() || !editingItem.startDate?.trim() || !editingItem.endDate?.trim() || !editingItem.location?.trim() || !editingItem.description?.trim()}
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    const duration = formatDateRange(editingItem.startDate, editingItem.endDate, false, editingItem.duration);
                    await updateExperience({
                      id: editingItem._id,
                      company: editingItem.company.trim(),
                      role: editingItem.role.trim(),
                      duration,
                      startDate: editingItem.startDate.trim(),
                      endDate: editingItem.endDate.trim(),
                      isPresent: false,
                      location: editingItem.location.trim(),
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
