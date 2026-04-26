"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamFormProps {
  eventId: string;
  acceptedParticipants?: {
    userId: string;
    user: { name: string };
  }[];
}

export function TeamForm({ eventId, acceptedParticipants = [] }: TeamFormProps) {
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
        
        <Select value={leaderId} onValueChange={setLeaderId}>
          <SelectTrigger className="flex-1 rounded border border-white/[0.08] bg-white/[0.03] px-3 font-mono text-[11px] uppercase tracking-wider text-white/60 focus:ring-0 focus:border-[#39FF14]/30">
            <SelectValue placeholder="Select leader" />
          </SelectTrigger>
          <SelectContent className="border-white/[0.08] bg-[#111]">
            {acceptedParticipants.length > 0 ? (
              acceptedParticipants.map((p) => (
                <SelectItem
                  key={p.userId}
                  value={p.userId}
                  className="font-mono text-[11px] uppercase tracking-wider text-white/60 focus:bg-[#39FF14]/10 focus:text-[#39FF14]"
                >
                  {p.user.name}
                </SelectItem>
              ))
            ) : (
              <div className="py-3 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
                No accepted participants
              </div>
            )}
          </SelectContent>
        </Select>

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
          <span className="ml-1.5">Create</span>
        </Button>
      </div>
    </div>
  );
}