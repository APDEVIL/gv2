"use client";

import { useRole } from "@/hooks/use-role";

type Role = "event_manager" | "participant";

interface RoleGateProps {
  allow: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role } = useRole();
  const allowed = Array.isArray(allow) ? allow : [allow];

  if (!role || !allowed.includes(role as Role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}