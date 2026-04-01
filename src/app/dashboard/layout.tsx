"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useStackApp } from "@stackframe/stack";

function DashboardNav() {
  const session = useSession();
  const stackApp = useStackApp();
  const pathname = usePathname();
  const publicUrl = session?.username ? `/${session.username}` : "/";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-64 border-r bg-muted/20 p-6 flex flex-col gap-4 min-h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {session === undefined ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : session ? (
          <div className="text-sm font-semibold truncate bg-foreground/10 px-2 py-1 rounded">@{session.username}</div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            await stackApp.signOut();
            window.location.href = "/sign-in";
          }}
        >
          Logout
        </Button>
      </div>

      <h2 className="font-semibold text-sm tracking-tight mb-2 text-muted-foreground uppercase">Navigation</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard/profile">
          <Button
            variant={isActive("/dashboard/profile") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Profile Settings
          </Button>
        </Link>
        <Link href="/dashboard/projects">
          <Button
            variant={isActive("/dashboard/projects") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Manage Projects
          </Button>
        </Link>
        <Link href="/dashboard/skills">
          <Button
            variant={isActive("/dashboard/skills") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Manage Skills
          </Button>
        </Link>
        <Link href="/dashboard/experience">
          <Button
            variant={isActive("/dashboard/experience") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Experience
          </Button>
        </Link>
        <Link href="/dashboard/education">
          <Button
            variant={isActive("/dashboard/education") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Education
          </Button>
        </Link>
        <Link href="/dashboard/achievements">
          <Button
            variant={isActive("/dashboard/achievements") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Achievements
          </Button>
        </Link>
        <Link href="/dashboard/certifications">
          <Button
            variant={isActive("/dashboard/certifications") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Certifications
          </Button>
        </Link>
        <Link href="/dashboard/extracurricular">
          <Button
            variant={isActive("/dashboard/extracurricular") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Co-curricular
          </Button>
        </Link>
        <Link href="/dashboard/customization">
          <Button
            variant={isActive("/dashboard/customization") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            Customization
          </Button>
        </Link>

        <div className="flex-1 mt-auto" />
        <Link href={publicUrl} target="_blank">
          <Button variant="outline" className="w-full justify-start">View Live Portfolio</Button>
        </Link>
        <ThemeToggle />
      </nav>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.replace("/sign-in");
    }
  }, [session, router]);

  if (session === null) {
    return null;
  }

  return (
    <>
      {/* Mobile top bar + slide-in drawer */}
      <MobileNav />
      <div className="flex min-h-screen">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden md:block">
          <DashboardNav />
        </div>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </>
  );
}
