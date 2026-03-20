"use client";

import { motion } from "framer-motion";
import { Shield, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isManager = user.role === "event_manager";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded border border-white/[0.06] bg-[#111] p-6"
    >
      <div className="flex items-start gap-5">
        <Avatar className="h-14 w-14 border border-white/10">
          <AvatarFallback className="bg-white/[0.05] font-mono text-[16px] font-semibold text-white/60">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <h2 className="font-mono text-[15px] uppercase tracking-wider text-white/90">
            {user.name}
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/30">
            {user.email}
          </p>
          <div
            className={cn(
              "mt-1 flex w-fit items-center gap-2 rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest",
              isManager
                ? "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]"
                : "border-blue-500/20 bg-blue-500/10 text-blue-400",
            )}
          >
            {isManager ? (
              <Shield className="h-3 w-3" />
            ) : (
              <Users className="h-3 w-3" />
            )}
            {isManager ? "Event Manager" : "Participant"}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.04] pt-4">
        <div className="flex items-center gap-2 text-white/20">
          <Calendar className="h-3 w-3" />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            Member since {format(new Date(user.createdAt), "MMM yyyy")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}