"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cn } from "@/lib/utils";

type MatchRow = {
  id: string;
  matchNumber: number;
  teamAId: string;
  teamBId: string;
  teamAScore: number;
  teamBScore: number;
  winnerId: string | null;
  playedAt: Date | null;
  teamA: { id: string; name: string };
  teamB: { id: string; name: string };
};

interface MatchListProps {
  eventId: string;
}

export function MatchList({ eventId }: MatchListProps) {
  const { data: matches, isLoading } =
    api.points.getMatchesByEvent.useQuery({ eventId });

  if (isLoading) return <LoadingSkeleton rows={4} rowClassName="h-14" />;

  if (!matches || matches.length === 0) {
    return <EmptyState message="No matches logged yet" />;
  }

  return (
    <div className="space-y-2">
      {(matches as MatchRow[]).map((match, i) => {
        const isDraw = match.winnerId === null;
        const teamAWon = match.winnerId === match.teamAId;
        const teamBWon = match.winnerId === match.teamBId;

        return (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 rounded border border-white/[0.04] bg-[#111] px-4 py-3"
          >
            <span className="w-16 flex-shrink-0 font-mono text-[9px] uppercase tracking-widest text-white/20">
              Match {match.matchNumber}
            </span>

            <div className="flex flex-1 items-center justify-center gap-4">
              <span
                className={cn(
                  "font-mono text-[12px] uppercase tracking-wider",
                  teamAWon
                    ? "text-[#39FF14]"
                    : isDraw
                      ? "text-white/50"
                      : "text-white/30",
                )}
              >
                {match.teamA.name}
              </span>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[15px] font-bold text-white/80">
                  {match.teamAScore}
                </span>
                <span className="font-mono text-[10px] text-white/20">vs</span>
                <span className="font-mono text-[15px] font-bold text-white/80">
                  {match.teamBScore}
                </span>
              </div>

              <span
                className={cn(
                  "font-mono text-[12px] uppercase tracking-wider",
                  teamBWon
                    ? "text-[#39FF14]"
                    : isDraw
                      ? "text-white/50"
                      : "text-white/30",
                )}
              >
                {match.teamB.name}
              </span>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3">
              {isDraw && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                  Draw
                </span>
              )}
              {match.playedAt && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/15">
                  {format(new Date(match.playedAt), "MMM dd")}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}