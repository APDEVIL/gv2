import { TeamList } from "@/components/teams/team-list";
import { api } from "@/trpc/react";

export default function TeamsPage({
  params,
}: {
  params: { eventId: string };
}) {
  return <TeamsPageClient eventId={params.eventId} />;
}

function TeamsPageClient({ eventId }: { eventId: string }) {
  const { data: event } = api.event.getById.useQuery({ eventId });
  return <TeamList eventId={eventId} teamSize={event?.teamSize ?? 5} />;
}