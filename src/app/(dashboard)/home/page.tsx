"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Trophy, Bell, Swords } from "lucide-react";
import { api } from "@/trpc/react";
import { useSession } from "@/hooks/use-session";
import { useRole } from "@/hooks/use-role";
import { useNotifications } from "@/hooks/use-notifications";
import { EventCard } from "@/components/events/event-card";
import { EventSearch } from "@/components/events/event-search";
import { EventFilters } from "@/components/events/event-filters";
import { RoleGate } from "@/components/shared/role-gate";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
  const [activeStatus, setActiveStatus] = useState("all");
  const { session } = useSession();
  const { isManager } = useRole();
  const { unreadCount } = useNotifications();

  const { data: events, isLoading } = api.event.getAll.useQuery();

  const filtered =
    activeStatus === "all"
      ? events
      : events?.filter((e) => e.status === activeStatus);

  const greeting = getGreeting();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const stats = [
    {
      icon: Swords,
      label: "Total",
      value: events?.length ?? 0,
      color: "text-[#39FF14]",
      href: undefined,
    },
    {
      icon: Swords,
      label: "Active",
      value: events?.filter((e) => e.status === "ongoing").length ?? 0,
      color: "text-amber-400",
      href: undefined,
    },
    {
      icon: Trophy,
      label: "Completed",
      value: events?.filter((e) => e.status === "completed").length ?? 0,
      color: "text-white/40",
      href: undefined,
    },
    {
      icon: Bell,
      label: "Unread",
      value: unreadCount,
      color: "text-blue-400",
      href: "/notifications",
    },
  ];

  return (
    <div>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-1 flex items-center gap-3">
          <div className="h-px w-6 bg-[#39FF14]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#39FF14]">
            {greeting}
          </span>
        </div>
        <h1 className="ml-9 font-mono text-[22px] uppercase tracking-wider text-white/90">
          {firstName}
        </h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {stats.map((stat) => {
          const card = (
            <div className="rounded border border-white/[0.06] bg-[#111] p-4 transition-colors hover:border-white/[0.1]">
              <div className="mb-2 flex items-center gap-2">
                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                  {stat.label}
                </span>
              </div>
              <p className={cn("font-mono text-[22px] font-bold", stat.color)}>
                {stat.value}
              </p>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <EventSearch />
      </motion.div>

      {/* Events */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[#39FF14]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#39FF14]">
              {isManager ? "Your Events" : "My Events"}
            </span>
          </div>
          <RoleGate allow="event_manager">
            <Link href="/events/new">
              <Button className="flex items-center gap-2 border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20">
                <Plus className="h-3.5 w-3.5" />
                New Event
              </Button>
            </Link>
          </RoleGate>
        </div>

        <div className="mb-4">
          <EventFilters
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
          />
        </div>

        {isLoading ? (
          <CardSkeleton count={4} />
        ) : filtered?.length === 0 ? (
          <EmptyState
            message="No events found"
            action={
              <RoleGate allow="event_manager">
                <Link href="/events/new">
                  <Button variant="outline" className="border-white/[0.08] font-mono text-[10px] uppercase tracking-widest text-white/40 hover:border-[#39FF14]/30 hover:text-[#39FF14]">
                    Create your first event
                  </Button>
                </Link>
              </RoleGate>
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered?.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}