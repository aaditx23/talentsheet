"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, logoutUser } from "@/app/actions/auth.actions";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
     getSession().then(setSession);
  }, []);

  const publicUrl = session?.username ? `/${session.username}` : "/";

  return (
    <div className="flex min-h-screen border-t">
      <aside className="w-64 border-r bg-muted/20 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
           {session ? (
               <div className="text-sm font-semibold truncate bg-foreground/10 px-2 py-1 rounded">@{session.username}</div>
           ) : <div className="text-sm">Loading...</div>}
           {/* Server Actions with redirect() must be invoked via form action */}
           <form action={logoutUser}>
              <Button type="submit" variant="outline" size="sm">Logout</Button>
           </form>
        </div>
        
        <h2 className="font-semibold text-sm tracking-tight mb-2 text-muted-foreground uppercase">Navigation</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/profile">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              Profile Settings
            </Button>
          </Link>
          <Link href="/dashboard/projects">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              Manage Projects
            </Button>
          </Link>
          <Link href="/dashboard/skills">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              Manage Skills
            </Button>
          </Link>
          <ThemeToggle />
          
          <div className="flex-1 mt-auto" />
           <Link href={publicUrl} target="_blank">
             <Button variant="outline" className="w-full justify-start">
               View Live Portfolio
             </Button>
           </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
