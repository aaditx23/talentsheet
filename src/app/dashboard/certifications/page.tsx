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

export default function CertificationsPage() {
  const session = useSession();
  const user = useQuery((api as any).users.getUserByUsername, session?.username ? { username: session.username } : "skip");
  const certifications = useQuery((api as any).sections.getCertificationsByUser, user ? { userId: user._id } : "skip");
  const addCertification = useMutation((api as any).sections.addCertification);
  const deleteCertification = useMutation((api as any).sections.deleteCertification);

  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [saving, setSaving] = useState(false);

  if (!session) return <LoadingState message="Authenticating..." />;
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
      });
      setName("");
      setIssuer("");
      setIssueDate("");
      setCredentialUrl("");
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
        <Input placeholder="Date (optional)" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
        <Input placeholder="Credential URL (optional)" value={credentialUrl} onChange={(e) => setCredentialUrl(e.target.value)} />
        <Button onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Certification"}</Button>
      </Card>

      <div className="space-y-3">
        {(certifications ?? []).map((item: any) => (
          <Card key={item._id} className="p-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.issuer || ""}{item.issueDate ? `${item.issuer ? " • " : ""}${item.issueDate}` : ""}</p>
              {item.credentialUrl ? (
                <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-sm underline">
                  View Credential
                </a>
              ) : null}
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteCertification({ id: item._id })}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
