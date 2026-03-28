"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSession } from "@/app/actions/auth.actions";

interface Session {
  username: string;
  userId: string;
}

const SessionContext = createContext<Session | null | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    getSession().then(setSession);
  }, []); // runs ONCE per layout mount

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

/** Returns undefined while loading, null if not authenticated, or the session object */
export function useSession() {
  return useContext(SessionContext);
}
