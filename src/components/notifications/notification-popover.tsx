"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export function NotificationPopover() {
  const { notifications, unreadCount } = useNotifications();
  const utils = api.useUtils();

  const { mutate: markAsRead } = api.notification.markAsRead.useMutation({
    onSuccess: () => void utils.notification.getAll.invalidate(),
    onError: (err) => toast.error(err.message),
  });

  const preview = notifications.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex h-8 w-8 items-center justify-center rounded border border-white/[0.06] bg-white/[0.03] text-white/40 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/70">
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
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 border-white/[0.08] bg-[#111] p-0"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="rounded bg-[#39FF14]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#39FF14]">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {preview.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
                No notifications
              </p>
            </div>
          ) : (
            preview.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead({ notificationId: n.id })}
                className={cn(
                  "cursor-pointer border-b border-white/[0.04] px-4 py-3 transition-colors last:border-0 hover:bg-white/[0.03]",
                  !n.isRead && "bg-white/[0.02]",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-wider",
                      n.isRead ? "text-white/30" : "text-white/70",
                    )}
                  >
                    {n.title}
                  </p>
                  {!n.isRead && (
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#39FF14]" />
                  )}
                </div>
                <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-white/20">
                  {n.message.length > 60
                    ? n.message.slice(0, 60) + "..."
                    : n.message}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/15">
                  {format(new Date(n.createdAt), "MMM dd · HH:mm")}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/[0.06]">
          <Link href="/notifications">
            <div className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.03]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                View all
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-white/20" />
            </div>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}