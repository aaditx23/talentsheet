import { useState } from "react";
import type { CSSProperties } from "react";
import { SkillList } from "@/components/dashboard/SkillList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SkillsSectionProps {
  skills: any[];
  portfolioStyle: CSSProperties;
}

export function SkillsSection({ skills, portfolioStyle }: SkillsSectionProps) {
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);

  if (!skills.length) return null;

  const topSkills = skills.slice(0, 5);
  const hasMoreSkills = skills.length > 5;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Technical Skills</h2>
      <SkillList
        skills={topSkills as any}
        showDeleteButton={false}
        appendItem={
          hasMoreSkills ? (
            <Card className="flex items-center justify-center border-dashed p-4 shadow-sm">
              <Button variant="outline" onClick={() => setSkillsDialogOpen(true)}>
                See More ({skills.length})
              </Button>
            </Card>
          ) : undefined
        }
      />

      <Dialog open={skillsDialogOpen} onOpenChange={setSkillsDialogOpen}>
        <DialogContent
          style={portfolioStyle}
          className="w-[96vw] max-h-[88vh] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl"
        >
          <DialogHeader>
            <DialogTitle>All Skills</DialogTitle>
          </DialogHeader>
          <div className="max-h-[72vh] overflow-y-auto pr-1">
            <SkillList
              skills={skills as any}
              showDeleteButton={false}
              gridClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
