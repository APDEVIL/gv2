"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TeamFormProps {
  eventId: string;
  acceptedParticipants: {
    userId: string;
    user: { name: string };
  }[];
}

export function TeamForm({ eventId, acceptedParticipants }: TeamFormProps) {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState("");

  const { mutate: createTeam, isPending } = api.team.create.useMutation({
    onSuccess: () => {
      toast.success("Team created.");
      setName("");
      setLeaderId("");
      void utils.team.getByEvent.invalidate({ eventId });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="rounded border border-white/[0.06] bg-[#111] p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
        Create Team
      </p>
      <div className="flex gap-3">
        <Input
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] uppercase tracking-wider text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
        />
        <select
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
          className="flex-1 rounded border border-white/[0.08] bg-white/[0.03] px-3 font-mono text-[11px] uppercase tracking-wider text-white/60 focus:border-[#39FF14]/30 focus:outline-none"
        >
          <option value="">Select leader</option>
          {acceptedParticipants.map((p) => (
            <option key={p.userId} value={p.userId}>
              {p.user.name}
            </option>
          ))}
        </select>
        <Button
          onClick={() => createTeam({ eventId, name, leaderId })}
          disabled={!name || !leaderId || isPending}
          className="border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Create
        </Button>
      </div>
    </div>
  );
}