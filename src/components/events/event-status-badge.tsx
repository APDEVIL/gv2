"use client";

import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; classes: string }> = {
  open: {
    label: "Open",
    classes: "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20",
  },
  ongoing: {
    label: "Ongoing",
    classes: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  completed: {
    label: "Completed",
    classes: "bg-white/[0.05] text-white/40 border-white/10",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-400/10 text-red-400 border-red-400/20",
  },
  draft: {
    label: "Draft",
    classes: "bg-white/[0.03] text-white/20 border-white/[0.06]",
  },
  registration_closed: {
    label: "Reg. Closed",
    classes: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  },
};

export function EventStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.draft!;
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