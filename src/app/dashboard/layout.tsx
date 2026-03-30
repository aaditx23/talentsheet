"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/app/actions/auth.actions";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function DashboardNav() {
  const session = useSession();
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
        <form action={logoutUser}>
          <Button type="submit" variant="outline" size="sm">Logout</Button>
        </form>
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
    </SessionProvider>
  );
}
