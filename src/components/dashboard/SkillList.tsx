"use client";

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

export function SkillList({
  skills,
  onDelete,
  showDeleteButton = true,
  gridClassName,
  appendItem,
}: SkillListProps) {
  if (skills.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No skills added yet. Use the form above to add your first skill.
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", gridClassName)}>
      {skills.map((s) => (
        <Card
          key={s._id}
          className="flex flex-row items-start justify-between p-4 shadow-sm border"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-medium break-words">{s.name}</h3>
            {s.proficiency !== undefined && (
              <ProficiencyBar value={s.proficiency} />
            )}
          </div>
          {showDeleteButton && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive ml-2 shrink-0 -mt-1"
              onClick={() => onDelete(s._id)}
            >
              ✕
            </Button>
          )}
        </Card>
      ))}
      {appendItem}
    </div>
  );
}