"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RankedEntry = {
  teamId: string;
  teamName: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  rank: number;
  badge: "gold" | "silver" | "bronze" | null;
  members: { name: string }[];
};

interface LeaderboardTableProps {
  rankings: RankedEntry[];
}

export function LeaderboardTable({ rankings }: LeaderboardTableProps) {
  return (
    <div className="rounded border border-white/[0.06] bg-[#111]">
      <div className="grid grid-cols-[48px_1fr_60px_60px_60px_80px] gap-4 border-b border-white/[0.06] px-5 py-3">
        {["Rank", "Team", "W", "D", "L", "Pts"].map((h) => (
          <span
            key={h}
            className="font-mono text-[9px] uppercase tracking-widest text-white/20"
          >
            {h}
          </span>
        ))}
      </div>

      {rankings.map((entry, i) => (
        <motion.div
          key={entry.teamId}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className={cn(
            "grid grid-cols-[48px_1fr_60px_60px_60px_80px] items-center gap-4 border-b border-white/[0.03] px-5 py-3 last:border-0",
            entry.badge === "gold" && "bg-amber-400/[0.03]",
          )}
        >
          <span
            className={cn(
              "font-mono text-[12px] font-bold",
              entry.badge === "gold"
                ? "text-amber-400"
                : entry.badge === "silver"
                  ? "text-white/50"
                  : entry.badge === "bronze"
                    ? "text-orange-600/70"
                    : "text-white/30",
            )}
          >
            #{entry.rank}
          </span>

          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-mono text-[12px] uppercase tracking-wider text-white/80">
              {entry.teamName}
            </span>
            {entry.members.length > 0 && (
              <span className="truncate font-mono text-[9px] uppercase tracking-widest text-white/20">
                {entry.members.map((m) => m.name).join(" · ")}
              </span>
            )}
          </div>

          <span className="font-mono text-[11px] text-[#39FF14]/70">
            {entry.wins}
          </span>
          <span className="font-mono text-[11px] text-white/30">
            {entry.draws}
          </span>
          <span className="font-mono text-[11px] text-red-400/50">
            {entry.losses}
          </span>
          <span className="font-mono text-[13px] font-bold text-white/80">
            {entry.points}
          </span>
        </motion.div>
      ))}
    </div>
  );
}