"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { RoleGate } from "@/components/shared/role-gate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";

export function EventList() {
  const [activeStatus, setActiveStatus] = useState("all");
  const { data: events, isLoading } = api.event.getAll.useQuery();

  const filtered =
    activeStatus === "all"
      ? events
      : events?.filter((e) => e.status === activeStatus);

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle={`${filtered?.length ?? 0} total`}
        action={
          <RoleGate allow="event_manager">
            <Link href="/events/new">
              <Button className="flex items-center gap-2 border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20">
                <Plus className="h-3.5 w-3.5" />
                New Event
              </Button>
            </Link>
          </RoleGate>
        }
      />

      <div className="mb-5">
        <EventFilters
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[140px] rounded border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="mb-4 font-mono text-[40px] text-white/10">[ ]</div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
            No events found
          </p>
          <RoleGate allow="event_manager">
            <Link href="/events/new" className="mt-6">
              <Button
                variant="outline"
                className="border-white/[0.08] font-mono text-[10px] uppercase tracking-widest text-white/40 hover:border-[#39FF14]/30 hover:text-[#39FF14]"
              >
                Create your first event
              </Button>
            </Link>
          </RoleGate>
        </motion.div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered?.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}