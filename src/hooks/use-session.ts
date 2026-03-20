"use client";

import { authClient } from "@/server/better-auth/client";

export function useSession() {
  const { data: session, isPending } = authClient.useSession();

  return {
    session,
    isPending,
    isAuthenticated: !!session?.user,
  };
}