"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { NotificationItem } from "@/components/notifications/notification-item";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export function NotificationList() {
  const [activeFilter, setActiveFilter] = useState("all");
  const utils = api.useUtils();

  const { data: notifications, isLoading } = api.notification.getAll.useQuery();

  const { mutate: markAllRead, isPending: isMarkingAll } =
    api.notification.markAllAsRead.useMutation({
      onSuccess: () => {
        toast.success("All notifications marked as read.");
        void utils.notification.getAll.invalidate();
      },
      onError: (err) => toast.error(err.message),
    });

  const filtered = notifications?.filter((n) => {
    if (activeFilter === "unread") return !n.isRead;
    if (activeFilter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        action={
          unreadCount > 0 ? (
            <Button
              onClick={() => markAllRead()}
              disabled={isMarkingAll}
              variant="outline"
              className="border-white/[0.08] font-mono text-[10px] uppercase tracking-widest text-white/40 hover:border-[#39FF14]/30 hover:text-[#39FF14] disabled:opacity-40"
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Mark all read
            </Button>
          ) : null
        }
      />

      <div className="mb-5 flex items-center gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
              activeFilter === f.value
                ? "border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]"
                : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-white/[0.12] hover:text-white/50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 bg-white/[0.02]" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <div className="mb-4 font-mono text-[40px] text-white/10">[ ]</div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
            No notifications
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {filtered?.map((notification, i) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}