"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { SkillForm } from "@/components/dashboard/SkillForm";
import { SkillList } from "@/components/dashboard/SkillList";
import { Button } from "@/components/ui/button";

export default function SkillsPage() {
  const session = useSession();

  const user = useQuery(api.users.getUserByUsername as any, session?.username ? { username: session.username } : "skip");
  const skills = useQuery(api.skills.getSkillsByUser as any, user ? { userId: user._id } : "skip");
  const addSkill = useMutation(api.skills.addSkill as any);
  const deleteSkill = useMutation(api.skills.deleteSkill as any);
  const reorderSkills = useMutation(api.skills.reorderSkills as any);
  const [localSkills, setLocalSkills] = useState<any[]>([]);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [draftSkills, setDraftSkills] = useState<any[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    if (skills) {
      setLocalSkills(skills as any[]);
    }
  }, [skills]);

  const startEditOrder = () => {
    setDraftSkills(localSkills);
    setIsEditingOrder(true);
  };

  const cancelEditOrder = () => {
    setDraftSkills(localSkills);
    setIsEditingOrder(false);
  };

  const saveReorder = async () => {
    if (!user?._id) return;

    setSavingOrder(true);
    try {
      const orderedSkillIds = draftSkills.map((s) => s._id);
      await reorderSkills({
        userId: user._id,
        orderedSkillIds: orderedSkillIds as any,
      });
      setLocalSkills(draftSkills);
      setIsEditingOrder(false);
    } finally {
      setSavingOrder(false);
    }
  };

  if (!session) return <LoadingState message="Authenticating..." />;
  if (user === null) return <LoadingState message="User not found." />;
  if (user === undefined || skills === undefined) return <LoadingState message="Loading skills..." />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Skills"
        description="Add technical skills displayed on your public portfolio."
      />
      <SkillForm
        userId={user?._id}
        onAdd={async (data) => { await addSkill(data as any); }}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Existing Skills</h2>
          {!isEditingOrder ? (
            <Button variant="outline" onClick={startEditOrder} disabled={localSkills.length < 2}>
              Edit Order
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={cancelEditOrder} disabled={savingOrder}>
                Cancel
              </Button>
              <Button onClick={saveReorder} disabled={savingOrder}>
                {savingOrder ? "Saving..." : "Save Order"}
              </Button>
            </div>
          )}
        </div>
        <SkillList
          skills={isEditingOrder ? draftSkills : localSkills}
          showDeleteButton={!isEditingOrder}
          enableReorder={isEditingOrder}
          onReorderPreview={(orderedSkillIds) => {
            if (!isEditingOrder) return;
            setDraftSkills((prev) => {
              const map = new Map(prev.map((item) => [item._id, item]));
              return orderedSkillIds.map((id) => map.get(id)).filter(Boolean);
            });
          }}
          onReorderCommit={(orderedSkillIds) => {
            if (!isEditingOrder) return;
            setDraftSkills((prev) => {
              const map = new Map(prev.map((item) => [item._id, item]));
              return orderedSkillIds.map((id) => map.get(id)).filter(Boolean);
            });
          }}
          onDelete={(id) => {
            if (isEditingOrder) return;
            deleteSkill({ skillId: id as any });
          }}
        />
        {isEditingOrder && <p className="text-xs text-muted-foreground">Drag cards to reorder, then click Save Order.</p>}
      </div>
    </div>
  );
}
