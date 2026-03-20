"use client";

import { useSession } from "@/hooks/use-session";

export function useRole() {
  const { session } = useSession();
  const role = session?.user?.role;

  return {
    role,
    isManager: role === "event_manager",
    isParticipant: role === "participant",
  };
}