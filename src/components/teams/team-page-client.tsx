"use client";

import { api } from "@/trpc/react";
import { TeamList } from "@/components/teams/team-list";

export function TeamsPageClient({ eventId }: { eventId: string }) {
  const { data: event } = api.event.getById.useQuery({ eventId });
  return <TeamList eventId={eventId} teamSize={event?.teamSize ?? 5} />;
}