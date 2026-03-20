"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center py-24 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded border border-red-400/20 bg-red-400/10">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6 border-white/[0.08] font-mono text-[10px] uppercase tracking-widest text-white/40 hover:border-red-400/30 hover:text-red-400"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
}