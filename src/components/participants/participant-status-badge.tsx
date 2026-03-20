"use client";

import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: {
    label: "Pending",
    classes: "bg-white/[0.04] text-white/30 border-white/[0.08]",
  },
  accepted: {
    label: "Accepted",
    classes: "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-400/10 text-red-400 border-red-400/20",
  },
  left: {
    label: "Left",
    classes: "bg-white/[0.03] text-white/20 border-white/[0.06]",
  },
  time_over: {
    label: "Time Over",
    classes: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  },
};

export function ParticipantStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.pending!;
  return (
    <span
      className={cn(
        "rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest",
        config.classes,
      )}
    >
      {config.label}
    </span>
  );
}