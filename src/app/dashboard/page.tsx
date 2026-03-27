import { redirect } from "next/navigation";

export default function DashboardIndexPage() {
   // Redirect to projects by default for now
   redirect("/dashboard/projects");
}
