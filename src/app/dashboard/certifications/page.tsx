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

export default function CertificationsPage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const certifications = useQuery((api as any).sections.getCertificationsByUser, user ? { userId: user._id } : "skip");
  const addCertification = useMutation((api as any).sections.addCertification);
  const deleteCertification = useMutation((api as any).sections.deleteCertification);
  const updateCertification = useMutation((api as any).sections.updateCertification);

  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === null) return <LoadingState message="User not found." />;
  if (user === undefined || certifications === undefined) return <LoadingState message="Loading certifications..." />;

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addCertification({
        userId: user._id,
        name,
        issuer: issuer || undefined,
        issueDate: issueDate || undefined,
        credentialUrl: credentialUrl || undefined,
        description: description || undefined,
      });
      setName("");
      setIssuer("");
      setIssueDate("");
      setCredentialUrl("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader title="Certifications" description="Add certifications and credential links." />

      <Card className="p-4 space-y-3">
        <Input placeholder="Certification name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Issuer (optional)" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        <MonthYearInput value={issueDate} onChange={setIssueDate} ariaLabel="Issue month and year (optional)" />
        <Input placeholder="Credential URL (optional)" value={credentialUrl} onChange={(e) => setCredentialUrl(e.target.value)} />
        <div>
          <label className="text-sm font-medium mb-2 block">Description (Markdown)</label>
          <MarkdownEditor value={description} onChange={setDescription} />
        </div>
        <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Certification"}</Button>
      </Card>

      <div className="space-y-3">
        {(certifications ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.issuer || ""}{item.issueDate ? `${item.issuer ? " • " : ""}${item.issueDate}` : ""}</p>
              {item.credentialUrl ? (
                <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-sm underline">
                  View Credential
                </a>
              ) : null}
              {item.description ? <p className="text-sm mt-2 whitespace-pre-line">{item.description}</p> : null}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setEditingItem(item)}>Edit</Button>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => deleteCertification({ id: item._id })}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-3">
              <Input value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
              <Input value={editingItem.issuer ?? ""} onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })} />
              <MonthYearInput
                value={editingItem.issueDate ?? ""}
                onChange={(value) => setEditingItem({ ...editingItem, issueDate: value })}
                ariaLabel="Edit issue month and year (optional)"
              />
              <Input value={editingItem.credentialUrl ?? ""} onChange={(e) => setEditingItem({ ...editingItem, credentialUrl: e.target.value })} />
              <MarkdownEditor value={editingItem.description ?? ""} onChange={(next) => setEditingItem({ ...editingItem, description: next })} />
              <Button
                disabled={editSaving || !editingItem.name?.trim()}
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    await updateCertification({
                      id: editingItem._id,
                      name: editingItem.name,
                      issuer: editingItem.issuer ?? "",
                      issueDate: editingItem.issueDate ?? "",
                      credentialUrl: editingItem.credentialUrl ?? "",
                      description: editingItem.description ?? "",
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
