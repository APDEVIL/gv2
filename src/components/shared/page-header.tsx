"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("mb-8 flex items-start justify-between gap-4", className)}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-[#39FF14]" />
          <h1 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#39FF14]">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="ml-9 font-mono text-[11px] uppercase tracking-wider text-white/30">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
}