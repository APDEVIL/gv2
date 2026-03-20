"use client";

import { cn } from "@/lib/utils";

const statuses = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface EventFiltersProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export function EventFilters({
  activeStatus,
  onStatusChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => onStatusChange(s.value)}
          className={cn(
            "rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
            activeStatus === s.value
              ? "border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]"
              : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-white/[0.12] hover:text-white/50",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}