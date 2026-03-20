"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  message = "Nothing here yet",
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center py-24 text-center",
        className,
      )}
    >
      <div className="mb-4 font-mono text-[40px] text-white/10">[ ]</div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
        {message}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}