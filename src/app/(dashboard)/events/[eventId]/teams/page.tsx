import { TeamList } from "@/components/teams/team-list";
import { TeamsPageClient } from "@/components/teams/team-page-client";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <TeamsPageClient eventId={eventId} />;
}