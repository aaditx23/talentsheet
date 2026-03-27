"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Skill {
  _id: string;
  name: string;
  proficiency?: number;
}

interface SkillListProps {
  skills: Skill[];
  onDelete: (id: string) => void;
}

function ProficiencyBar({ value }: { value: number }) {
  const label =
    value <= 3 ? "Beginner" : value <= 6 ? "Intermediate" : value <= 8 ? "Proficient" : value === 9 ? "Advanced" : "Expert";

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
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function SkillList({ skills, onDelete }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No skills added yet. Use the form above to add your first skill.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {skills.map((s) => (
        <Card
          key={s._id}
          className="flex flex-row items-start justify-between p-4 shadow-sm border"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate">{s.name}</h3>
            {s.proficiency !== undefined && (
              <ProficiencyBar value={s.proficiency} />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive ml-2 shrink-0 -mt-1"
            onClick={() => onDelete(s._id)}
          >
            ✕
          </Button>
        </Card>
      ))}
    </div>
  );
}