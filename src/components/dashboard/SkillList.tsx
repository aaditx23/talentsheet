"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Skill {
  _id: string;
  name: string;
  proficiency?: number;
}

interface SkillListProps {
  skills: Skill[];
  onDelete?: (id: string) => void;
  showDeleteButton?: boolean;
  gridClassName?: string;
  appendItem?: React.ReactNode;
  enableReorder?: boolean;
  onReorderPreview?: (orderedSkillIds: string[]) => void;
  onReorderCommit?: (orderedSkillIds: string[]) => void;
}

function ProficiencyBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-full transition-colors ${
              i < value ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{value}/10</span>
    </div>
  );
}

function SkillCardBody({
  skill,
  enableReorder,
  showDeleteButton,
  onDelete,
}: {
  skill: Skill;
  enableReorder: boolean;
  showDeleteButton: boolean;
  onDelete?: (id: string) => void;
}) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {enableReorder && <span className="text-muted-foreground text-xs">⋮⋮</span>}
          <h3 className="font-medium break-words">{skill.name}</h3>
        </div>
        {skill.proficiency !== undefined && <ProficiencyBar value={skill.proficiency} />}
      </div>
      {showDeleteButton && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive ml-2 shrink-0 -mt-1"
          onClick={() => onDelete(skill._id)}
        >
          ✕
        </Button>
      )}
    </>
  );
}

function SortableSkillCard({
  skill,
  showDeleteButton,
  onDelete,
}: {
  skill: Skill;
  showDeleteButton: boolean;
  onDelete?: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: skill._id,
  });

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex flex-row items-start justify-between p-4 shadow-sm border cursor-grab active:cursor-grabbing touch-none",
        isDragging && "opacity-70 ring-2 ring-ring",
      )}
      {...attributes}
      {...listeners}
    >
      <SkillCardBody
        skill={skill}
        enableReorder
        showDeleteButton={showDeleteButton}
        onDelete={onDelete}
      />
    </Card>
  );
}

export function SkillList({
  skills,
  onDelete,
  showDeleteButton = true,
  gridClassName,
  appendItem,
  enableReorder = false,
  onReorderPreview,
  onReorderCommit,
}: SkillListProps) {
  const [orderedIds, setOrderedIds] = useState<string[]>(skills.map((s) => s._id));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    setOrderedIds(skills.map((s) => s._id));
  }, [skills]);

  if (skills.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No skills added yet. Use the form above to add your first skill.
      </p>
    );
  }

  const computeReorderedIds = (baseIds: string[], fromId: string, toId: string): string[] | null => {
    if (!fromId || !toId || fromId === toId) return null;
    const from = baseIds.indexOf(fromId);
    const to = baseIds.indexOf(toId);
    if (from < 0 || to < 0) return null;
    return arrayMove(baseIds, from, to);
  };

  const orderedSkills = useMemo(() => {
    const map = new Map(skills.map((s) => [s._id, s]));
    return orderedIds.map((id) => map.get(id)).filter(Boolean) as Skill[];
  }, [orderedIds, skills]);

  const handleDragOver = (event: DragOverEvent) => {
    if (!enableReorder) return;
    const currentActiveId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : "";
    const next = computeReorderedIds(orderedIds, currentActiveId, overId);
    if (!next) return;

    setOrderedIds(next);
    onReorderPreview?.(next);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!enableReorder) return;
    const currentActiveId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : "";
    const next = computeReorderedIds(orderedIds, currentActiveId, overId);

    if (next) {
      setOrderedIds(next);
      onReorderCommit?.(next);
    } else {
      onReorderCommit?.(orderedIds);
    }
  };

  const handleDragCancel = () => {
    setOrderedIds(skills.map((s) => s._id));
  };

  if (enableReorder) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
          <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", gridClassName)}>
            {orderedSkills.map((s) => (
              <SortableSkillCard
                key={s._id}
                skill={s}
                showDeleteButton={showDeleteButton}
                onDelete={onDelete}
              />
            ))}
            {appendItem}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", gridClassName)}>
      {skills.map((s) => (
        <Card
          key={s._id}
          className="flex flex-row items-start justify-between p-4 shadow-sm border"
        >
          <SkillCardBody
            skill={s}
            enableReorder={false}
            showDeleteButton={showDeleteButton}
            onDelete={onDelete}
          />
        </Card>
      ))}
      {appendItem}
    </div>
  );
}