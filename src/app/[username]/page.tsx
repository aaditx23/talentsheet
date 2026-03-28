"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import ProjectTabs from "@/components/portfolio/ProjectTabs";
import { Badge } from "@/components/ui/badge";

export default function PortfolioPage() {
  const params = useParams();
  const username = params.username as string;

  // The 'any' cast acts as a stopgap until convex generates definitions
  const user = useQuery(api.users.getUserByUsername as any, { username });
  const skills = useQuery(api.skills.getSkillsByUser as any, user ? { userId: user._id } : "skip");

  if (user === undefined) return <div className="p-8">Loading portfolio...</div>;
  if (user === null) return <div className="p-8 text-center text-xl">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
      {/* Header / About */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{user.displayName}</h1>
        <p className="text-lg md:text-2xl text-muted-foreground font-medium">{user.tagline}</p>
        <p className="text-base md:text-lg leading-relaxed max-w-3xl">{user.about}</p>
      </section>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
             {skills.map((skill: any) => (
                <Badge key={skill._id} variant="secondary" className="text-sm px-3 py-1">
                   {skill.name} {skill.proficiency && <span className="text-muted-foreground ml-1">({skill.proficiency})</span>}
                </Badge>
             ))}
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight border-b pb-2">Projects & Experience</h2>
        <ProjectTabs userId={user._id} />
      </section>
    </div>
  );
}
