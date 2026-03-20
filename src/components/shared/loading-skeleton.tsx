"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
  rowClassName?: string;
}

export function LoadingSkeleton({
  rows = 4,
  className,
  rowClassName,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "rounded border border-white/[0.04] bg-white/[0.02]",
            rowClassName ?? "h-16",
          )}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-[140px] rounded border border-white/[0.04] bg-white/[0.02]"
        />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64 bg-white/[0.03]" />
      <Skeleton className="h-[200px] bg-white/[0.03]" />
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 bg-white/[0.02]" />
        ))}
      </div>
    </div>
  );
}