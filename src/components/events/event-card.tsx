"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Clock } from "lucide-react";
import { format } from "date-fns";
import { EventStatusBadge } from "@/components/events/event-status-badge";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    gameName: string;
    description?: string | null;
    status: string;
    startTime: Date;
    endTime: Date;
    maxTeams: number;
    teamSize: number;
    prize?: string | null;
    registrationDeadline?: Date | null;
  };
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Link href={`/events/${event.id}`}>
        <div className="group relative rounded border border-white/[0.06] bg-[#111] p-5 transition-colors hover:border-white/[0.12] hover:bg-[#151515]">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="font-mono text-[13px] font-semibold uppercase tracking-wider text-white/90 group-hover:text-white">
                {event.title}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                {event.gameName}
              </span>
            </div>
            <EventStatusBadge status={event.status} />
          </div>

          {event.description && (
            <p className="mb-4 line-clamp-2 font-mono text-[11px] leading-relaxed text-white/30">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/30">
              <Calendar className="h-3 w-3" />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {format(new Date(event.startTime), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/30">
              <Users className="h-3 w-3" />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {event.maxTeams} teams · {event.teamSize}v{event.teamSize}
              </span>
            </div>
            {event.prize && (
              <div className="flex items-center gap-1.5 text-amber-400/70">
                <Trophy className="h-3 w-3" />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  {event.prize}
                </span>
              </div>
            )}
            {event.registrationDeadline && (
              <div className="flex items-center gap-1.5 text-white/20">
                <Clock className="h-3 w-3" />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  Reg. closes {format(new Date(event.registrationDeadline), "MMM dd")}
                </span>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 h-px w-0 bg-[#39FF14] transition-all duration-300 group-hover:w-full" />
        </div>
      </Link>
    </motion.div>
  );
}