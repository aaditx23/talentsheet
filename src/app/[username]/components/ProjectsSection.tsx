import ProjectTabs from "@/components/portfolio/ProjectTabs";

export function ProjectsSection({ userId }: { userId: any }) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-foreground">Projects & Experience</h2>
      <ProjectTabs userId={userId} />
    </section>
  );
}
