"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type PodiumEntry = {
  teamId: string;
  teamName: string;
  points: number;
  rank: number;
  badge: "gold" | "silver" | "bronze" | null;
};

const medalConfig = {
  gold: {
    classes: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    height: "h-32",
    label: "1st",
    delay: 0,
  },
  silver: {
    classes: "text-white/60 border-white/20 bg-white/[0.04]",
    height: "h-24",
    label: "2nd",
    delay: 0.1,
  },
  bronze: {
    classes: "text-orange-600/80 border-orange-600/20 bg-orange-600/[0.05]",
    height: "h-20",
    label: "3rd",
    delay: 0.2,
  },
};

interface TopThreePodiumProps {
  topThree: PodiumEntry[];
}

export function TopThreePodium({ topThree }: TopThreePodiumProps) {
  if (topThree.length === 0) return null;

  const gold = topThree.find((e) => e.badge === "gold");
  const silver = topThree.find((e) => e.badge === "silver");
  const bronze = topThree.find((e) => e.badge === "bronze");

  return (
    <div className="mb-8 flex items-end justify-center gap-3">
      {silver && <PodiumCard entry={silver} position="silver" />}
      {gold && <PodiumCard entry={gold} position="gold" />}
      {bronze && <PodiumCard entry={bronze} position="bronze" />}
    </div>
  );
}

function PodiumCard({
  entry,
  position,
}: {
  entry: PodiumEntry;
  position: "gold" | "silver" | "bronze";
}) {
  const config = medalConfig[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: config.delay }}
      className={cn(
        "flex w-36 flex-col items-center justify-end rounded border p-3",
        config.height,
        config.classes,
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
        {config.label}
      </p>
    </motion.div>
  );
}