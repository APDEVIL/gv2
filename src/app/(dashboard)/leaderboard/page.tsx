"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { PageHeader } from "@/components/shared/page-header";
import { TopThreePodium } from "@/components/leaderboard/top-three-podium";
import { LeaderboardChart } from "@/components/leaderboard/leaderboard-chart";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { EmptyState } from "@/components/shared/empty-state";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { LEADERBOARD_CRITERIA_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function GlobalLeaderboardPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { data: events, isLoading: eventsLoading } = api.event.getAll.useQuery();

  const { data: leaderboard, isLoading: leaderboardLoading } =
    api.leaderboard.getByEvent.useQuery(
      { eventId: selectedEventId! },
      { enabled: !!selectedEventId },
    );

  const activeEvents = events?.filter(
    (e) => e.status === "completed" || e.status === "ongoing",
  ) ?? [];

  return (
    <div>
      <PageHeader title="Leaderboard" subtitle="Rankings by event" />

      <div className="mb-6 flex flex-wrap gap-2">
        {eventsLoading ? (
          <div className="h-8 w-48 animate-pulse rounded border border-white/[0.06] bg-white/[0.02]" />
        ) : activeEvents.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
            No active or completed events
          </p>
        ) : (
          activeEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={cn(
                "rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
                selectedEventId === event.id
                  ? "border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]"
                  : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-white/[0.12] hover:text-white/50",
              )}
            >
              {event.title}
            </button>
          ))
        )}
      </div>

      {!selectedEventId ? (
        <EmptyState message="Select an event to view its leaderboard" />
      ) : leaderboardLoading ? (
        <DetailSkeleton />
      ) : !leaderboard || leaderboard.rankings.length === 0 ? (
        <EmptyState message="No scores recorded for this event yet" />
      ) : (
        <div className="space-y-6">
          <TopThreePodium topThree={leaderboard.topThree} />
          <LeaderboardChart
            data={leaderboard.rankings.map((r) => ({
              teamName: r.teamName,
              points: r.points,
            }))}
          />
          <LeaderboardTable rankings={leaderboard.rankings} />
        </div>
      )}
    </div>
  );
}