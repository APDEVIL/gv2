"use client";

import { api } from "@/trpc/react";
import { PageHeader } from "@/components/shared/page-header";
import { MatchForm } from "@/components/matches/match-form";
import { MatchList } from "@/components/matches/match-list";
import { PointsTable } from "@/components/matches/points-table";
import { OverridePointsDialog } from "@/components/matches/override-points-dialog";
import { Separator } from "@/components/ui/separator";

export default function MatchesPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = params;
  const { data: teams } = api.team.getByEvent.useQuery({ eventId });
  const teamOptions = teams?.map((t) => ({ id: t.id, name: t.name })) ?? [];

  return (
    <div>
      <PageHeader
        title="Matches & Points"
        subtitle="Log results and manage scores"
        action={<OverridePointsDialog eventId={eventId} teams={teamOptions} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MatchForm eventId={eventId} teams={teamOptions} />

        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            Current Standings
          </p>
          <PointsTable eventId={eventId} />
        </div>
      </div>

      <Separator className="my-6 bg-white/[0.04]" />

      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
          Match History
        </p>
        <MatchList eventId={eventId} />
      </div>
    </div>
  );
}