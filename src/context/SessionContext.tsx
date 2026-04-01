"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useUser } from "@stackframe/stack";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Session {
  username: string;
  userId: string;
}

const SessionContext = createContext<Session | null | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const upsertUserFromStack = useMutation((api as any).users.upsertUserFromStack);
  const convexUser = useQuery((api as any).users.getUserByStackId, user ? { stackId: user.id } : "skip");
  const [provisioning, setProvisioning] = useState(false);

  useEffect(() => {
    if (!user || convexUser || provisioning) return;

    const preferredUsername = user.primaryEmail?.split("@")[0] || user.displayName || user.id;
    const displayName = user.displayName || preferredUsername;

    setProvisioning(true);
    upsertUserFromStack({
      stackId: user.id,
      username: preferredUsername,
      displayName,
    }).finally(() => setProvisioning(false));
  }, [user, convexUser, provisioning, upsertUserFromStack]);

  const session = useMemo<Session | null | undefined>(() => {
    if (provisioning) return undefined;
    if (!user) return null;
    if (!convexUser) return undefined;

    return {
      username: convexUser.username,
      userId: convexUser._id,
    };
  }, [provisioning, user, convexUser]);

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
