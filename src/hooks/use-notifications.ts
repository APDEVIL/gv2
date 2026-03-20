"use client";

import { api } from "@/trpc/react";

export function useNotifications() {
  const { data, isLoading, refetch } = api.notification.getAll.useQuery(
    undefined,
    { refetchInterval: 30000 },
  );

  const unreadCount = data?.filter((n) => !n.isRead).length ?? 0;

  return {
    notifications: data ?? [],
    unreadCount,
    isLoading,
    refetch,
  };
}