"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { TeamMemberList } from "@/components/teams/team-member-list";
import { AddMemberDialog } from "@/components/teams/add-member-dialog";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    leaderId: string;
    members: { userId: string; name: string; email: string }[];
    points?: { matchPoints: number; overridePoints: number | null; isOverridden: boolean } | null;
  };
  eventId: string;
  teamSize: number;
  acceptedParticipants: {
    userId: string;
    user: { name: string; email: string };
  }[];
  onRemoveMember: (teamId: string, userId: string, name: string) => void;
  index?: number;
}

export function TeamCard({
  team,
  eventId,
  teamSize,
  acceptedParticipants,
  onRemoveMember,
  index = 0,
}: TeamCardProps) {
  const points = team.points
    ? team.points.isOverridden
      ? (team.points.overridePoints ?? team.points.matchPoints)
      : team.points.matchPoints
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded border border-white/[0.06] bg-[#111] p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-white/30" />
          <h3 className="font-mono text-[12px] uppercase tracking-wider text-white/80">
            {team.name}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/25">
            {team.members.length}/{teamSize}
          </span>
          {points > 0 && (
            <span className="font-mono text-[11px] font-bold text-[#39FF14]/70">
              {points} pts
            </span>
          )}
        </div>
      </div>

      <TeamMemberList
        members={team.members}
        leaderId={team.leaderId}
        maxSize={teamSize}
        onRemove={(userId, name) => onRemoveMember(team.id, userId, name)}
      />

      {team.members.length < teamSize && (
        <AddMemberDialog
          teamId={team.id}
          eventId={eventId}
          existingMemberIds={team.members.map((m) => m.userId)}
          acceptedParticipants={acceptedParticipants}
        />
      )}
    </motion.div>
  );
}