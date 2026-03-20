"use client";

import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/notifications")}
      className="relative flex h-8 w-8 items-center justify-center rounded border border-white/[0.06] bg-white/[0.03] text-white/40 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/70"
    >
      <Bell className="h-3.5 w-3.5" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#39FF14] font-mono text-[9px] font-bold text-black"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}