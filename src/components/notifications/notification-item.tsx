"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Bell, Trophy, Calendar, AlertCircle, Clock, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const typeConfig: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  event_invite: { icon: Calendar, color: "text-[#39FF14]" },
  event_update: { icon: Bell, color: "text-blue-400" },
  event_cancelled: { icon: AlertCircle, color: "text-red-400" },
  registration_closing_soon: { icon: Clock, color: "text-orange-400" },
  winner_declared: { icon: Trophy, color: "text-amber-400" },
  rank_achieved: { icon: Medal, color: "text-amber-400" },
};

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending: {
    label: "Pending",
    classes: "bg-white/[0.04] text-white/30 border-white/[0.06]",
  },
  accepted: {
    label: "Accepted",
    classes: "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-400/10 text-red-400 border-red-400/20",
  },
  time_over: {
    label: "Time Over",
    classes: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  },
  read: {
    label: "Read",
    classes: "bg-white/[0.03] text-white/20 border-white/[0.04]",
  },
};

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    status: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    event?: { id: string; title: string; gameName: string } | null;
  };
  index?: number;
}

export function NotificationItem({
  notification,
  index = 0,
}: NotificationItemProps) {
  const utils = api.useUtils();

  const { mutate: markAsRead } = api.notification.markAsRead.useMutation({
    onSuccess: () => void utils.notification.getAll.invalidate(),
    onError: (err) => toast.error(err.message),
  });

  const config = typeConfig[notification.type] ?? typeConfig.event_update!;
  const Icon = config.icon;
  const statusCfg =
    statusConfig[notification.status] ?? statusConfig.pending!;

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead({ notificationId: notification.id });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={handleClick}
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded border p-4 transition-colors",
        notification.isRead
          ? "border-white/[0.04] bg-[#0f0f0f]"
          : "border-white/[0.08] bg-[#111]",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border",
          notification.isRead
            ? "border-white/[0.06] bg-white/[0.02]"
            : "border-white/[0.1] bg-white/[0.04]",
        )}
      >
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            notification.isRead ? "text-white/20" : config.color,
          )}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              "font-mono text-[12px] uppercase tracking-wider",
              notification.isRead ? "text-white/30" : "text-white/80",
            )}
          >
            {notification.title}
          </p>
          <div className="flex flex-shrink-0 items-center gap-2">
            <span
              className={cn(
                "rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                statusCfg.classes,
              )}
            >
              {statusCfg.label}
            </span>
            {!notification.isRead && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14]" />
            )}
          </div>
        </div>

        <p
          className={cn(
            "font-mono text-[11px] leading-relaxed",
            notification.isRead ? "text-white/20" : "text-white/40",
          )}
        >
          {notification.message}
        </p>

        <div className="flex items-center gap-3">
          {notification.event && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
              {notification.event.title}
            </span>
          )}
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/15">
            {format(new Date(notification.createdAt), "MMM dd · HH:mm")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}