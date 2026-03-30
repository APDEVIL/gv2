"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Trophy, Bell } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/trpc/react";
import { PageHeader } from "@/components/shared/page-header";
import { RoleGate } from "@/components/shared/role-gate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const medalColors = {
  gold: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  silver: "text-white/60 border-white/20 bg-white/[0.04]",
  bronze: "text-orange-600/80 border-orange-600/20 bg-orange-600/[0.05]",
};

const rankLabel = { gold: "1st", silver: "2nd", bronze: "3rd" };

export default function LeaderboardPage({
  params,
}: {
  // ✅ FIXED: params is now a Promise
  params: Promise<{ eventId: string }>;
}) {
  // ✅ FIXED: unwrap with use() instead of direct destructure
  const { eventId } = use(params);

  const { data, isLoading } = api.leaderboard.getByEvent.useQuery({ eventId });

  const { mutate: notifyTop, isPending: isNotifying } =
    api.leaderboard.notifyTopRank.useMutation({
      onSuccess: () => toast.success("Rank #1 notification sent."),
      onError: (err) => toast.error(err.message),
    });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 bg-white/[0.03]" />
        <Skeleton className="h-[200px] bg-white/[0.03]" />
      </div>
    );
  }

  if (!data || data.rankings.length === 0) {
    return (
      <div>
        <PageHeader title="Leaderboard" />
        <div className="flex flex-col items-center justify-center py-24">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
            No scores yet
          </p>
        </div>
      </div>
    );
  }

  const chartData = data.rankings.map((r) => ({
    name: r.teamName,
    points: r.points,
  }));

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        subtitle={`Ranked by ${data.criteria.replace("_", " ")}`}
        action={
          <RoleGate allow="event_manager">
            <Button
              onClick={() => notifyTop({ eventId })}
              disabled={isNotifying}
              className="border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"
            >
              <Bell className="mr-2 h-3.5 w-3.5" />
              Notify Rank #1
            </Button>
          </RoleGate>
        }
      />

      {data.topThree.length > 0 && (
        <div className="mb-8 flex items-end justify-center gap-3">
          {data.topThree[1] && (
            <PodiumCard
              entry={data.topThree[1]}
              position="silver"
              height="h-24"
            />
          )}
          {data.topThree[0] && (
            <PodiumCard
              entry={data.topThree[0]}
              position="gold"
              height="h-32"
            />
          )}
          {data.topThree[2] && (
            <PodiumCard
              entry={data.topThree[2]}
              position="bronze"
              height="h-20"
            />
          )}
        </div>
      )}

      <div className="mb-6 rounded border border-white/[0.06] bg-[#111] p-5">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
          Points Overview
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={32}>
            <XAxis
              dataKey="name"
              tick={{
                fontFamily: "monospace",
                fontSize: 10,
                fill: "rgba(255,255,255,0.3)",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontFamily: "monospace",
                fontSize: 10,
                fill: "rgba(255,255,255,0.2)",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "monospace",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            />
            <Bar
              dataKey="points"
              fill="#39FF14"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded border border-white/[0.06] bg-[#111]">
        <div className="grid grid-cols-[48px_1fr_80px_80px_80px_80px] gap-4 border-b border-white/[0.06] px-5 py-3">
          {["Rank", "Team", "W", "D", "L", "Pts"].map((h) => (
            <span
              key={h}
              className="font-mono text-[9px] uppercase tracking-widest text-white/20"
            >
              {h}
            </span>
          ))}
        </div>
        {data.rankings.map((entry, i) => (
          <motion.div
            key={entry.teamId}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[48px_1fr_80px_80px_80px_80px] items-center gap-4 border-b border-white/[0.03] px-5 py-3 last:border-0"
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
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[12px] uppercase tracking-wider text-white/80">
                {entry.teamName}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                {entry.members.map((m) => m.name).join(" · ")}
              </span>
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
    </div>
  );
}

function PodiumCard({
  entry,
  position,
  height,
}: {
  entry: { teamName: string; points: number; rank: number };
  position: "gold" | "silver" | "bronze";
  height: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: position === "gold" ? 0 : position === "silver" ? 0.1 : 0.2,
      }}
      className={cn(
        "flex w-36 flex-col items-center justify-end rounded border p-3",
        height,
        medalColors[position],
      )}
    >
      {position === "gold" && (
        <Trophy className="mb-1 h-4 w-4 text-amber-400" />
      )}
      <p className="font-mono text-[11px] uppercase tracking-wider">
        {entry.teamName}
      </p>
      <p className="font-mono text-[10px] opacity-60">{entry.points} pts</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest opacity-40">
        {rankLabel[position]}
      </p>
    </motion.div>
  );
}