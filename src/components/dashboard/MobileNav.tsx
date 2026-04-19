"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useStackApp } from "@stackframe/stack";

const NAV_LINKS = [
  { href: "/dashboard/profile", label: "Profile Settings" },
  { href: "/dashboard/projects", label: "Manage Projects" },
  { href: "/dashboard/skills", label: "Manage Skills" },
  { href: "/dashboard/experience", label: "Experience" },
  { href: "/dashboard/education", label: "Education" },
  { href: "/dashboard/achievements", label: "Achievements" },
  { href: "/dashboard/certifications", label: "Certifications" },
  { href: "/dashboard/extracurricular", label: "Co-curricular" },
  { href: "/dashboard/research-publications", label: "Research & Publications" },
  { href: "/dashboard/customization", label: "Customization" },
];

export function MobileNav() {
  const session = useSession();
  const stackApp = useStackApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const publicUrl = session?.username ? `/${session.username}` : "/";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Top bar — visible on mobile only */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-50">
        <span className="font-semibold text-sm">
          {session?.username ? `@${session.username}` : "Dashboard"}
        </span>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Open navigation"
        >
          {/* Hamburger icon */}
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground" />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-background border-r z-50 flex flex-col p-6 gap-4 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">
            {session?.username ? `@${session.username}` : "Menu"}
          </span>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-lg">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <Button
                variant={isActive(href) ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {label}
              </Button>
            </Link>
          ))}
          <Link href={publicUrl} target="_blank" onClick={() => setOpen(false)}>
            <Button variant="outline" className="w-full justify-start mt-2">View Live Portfolio</Button>
          </Link>
        </nav>

        <div className="mt-auto space-y-3">
          <ThemeToggle />
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={async () => {
              await stackApp.signOut();
              window.location.href = "/sign-in";
            }}
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
