"use client";

import { Crown, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  userId: string;
  name: string;
  email: string;
}

interface TeamMemberListProps {
  members: TeamMember[];
  leaderId: string;
  maxSize: number;
  onRemove?: (userId: string, name: string) => void;
}

export function TeamMemberList({
  members,
  leaderId,
  maxSize,
  onRemove,
}: TeamMemberListProps) {
  return (
    <div className="space-y-1.5">
      {members.map((member) => {
        const isLeader = member.userId === leaderId;
        return (
          <div
            key={member.userId}
            className="flex items-center justify-between rounded bg-white/[0.03] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              {isLeader && (
                <Crown className="h-3 w-3 flex-shrink-0 text-amber-400" />
              )}
              <div className="flex flex-col">
                <span
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-wider",
                    isLeader ? "text-white/80" : "text-white/60",
                  )}
                >
                  {member.name}
                </span>
                <span className="font-mono text-[9px] tracking-wider text-white/20">
                  {member.email}
                </span>
              </div>
            </div>
            {onRemove && !isLeader && (
              <button
                onClick={() => onRemove(member.userId, member.name)}
                className="text-white/20 transition-colors hover:text-red-400"
              >
                <UserMinus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}

      {members.length < maxSize && (
        <div className="rounded border border-dashed border-white/[0.06] px-3 py-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/15">
            {maxSize - members.length} slot{maxSize - members.length !== 1 ? "s" : ""} available
          </span>
        </div>
      )}
    </div>
  );
}