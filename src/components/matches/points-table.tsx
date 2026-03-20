"use client";

import { api } from "@/trpc/react";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cn } from "@/lib/utils";

type PointsRow = {
  teamId: string;
  matchPoints: number;
  overridePoints: number | null;
  isOverridden: boolean;
  wins: number;
  losses: number;
  draws: number;
  team: { id: string; name: string };
};

interface PointsTableProps {
  eventId: string;
}

export function PointsTable({ eventId }: PointsTableProps) {
  const { data: pointsData, isLoading } =
    api.points.getByEvent.useQuery({ eventId });

  if (isLoading) return <LoadingSkeleton rows={3} rowClassName="h-12" />;

  if (!pointsData || pointsData.length === 0) {
    return <EmptyState message="No points recorded yet" />;
  }

  const sorted = [...(pointsData as PointsRow[])].sort((a, b) => {
    const aPoints = a.isOverridden
      ? (a.overridePoints ?? a.matchPoints)
      : a.matchPoints;
    const bPoints = b.isOverridden
      ? (b.overridePoints ?? b.matchPoints)
      : b.matchPoints;
    return bPoints - aPoints;
  });

  return (
    <div className="rounded border border-white/[0.06] bg-[#111]">
      <div className="grid grid-cols-[1fr_60px_60px_60px_80px] gap-3 border-b border-white/[0.06] px-4 py-2.5">
        {["Team", "W", "D", "L", "Pts"].map((h) => (
          <span
            key={h}
            className="font-mono text-[9px] uppercase tracking-widest text-white/20"
          >
            {h}
          </span>
        ))}
      </div>
      {sorted.map((entry, i) => {
        const points = entry.isOverridden
          ? (entry.overridePoints ?? entry.matchPoints)
          : entry.matchPoints;

        return (
          <div
            key={entry.teamId}
            className={cn(
              "grid grid-cols-[1fr_60px_60px_60px_80px] items-center gap-3 border-b border-white/[0.03] px-4 py-2.5 last:border-0",
              i === 0 && "bg-[#39FF14]/[0.03]",
            )}
          >
            <div className="flex items-center gap-2">
              {i === 0 && (
                <span className="font-mono text-[8px] text-[#39FF14]/50">▲</span>
              )}
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
                {entry.team.name}
              </span>
              {entry.isOverridden && (
                <span className="font-mono text-[8px] uppercase tracking-widest text-amber-400/40">
                  Override
                </span>
              )}
            </div>
            <span className="font-mono text-[11px] text-[#39FF14]/60">
              {entry.wins}
            </span>
            <span className="font-mono text-[11px] text-white/30">
              {entry.draws}
            </span>
            <span className="font-mono text-[11px] text-red-400/40">
              {entry.losses}
            </span>
            <span className="font-mono text-[13px] font-bold text-white/80">
              {points}
            </span>
          </div>
        );
      })}
    </div>
  );
}