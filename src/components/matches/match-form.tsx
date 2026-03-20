"use client";

import { useState } from "react";
import { Swords, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Team {
  id: string;
  name: string;
}

interface MatchFormProps {
  eventId: string;
  teams: Team[];
}

export function MatchForm({ eventId, teams }: MatchFormProps) {
  const utils = api.useUtils();
  const [form, setForm] = useState({
    teamAId: "",
    teamBId: "",
    teamAScore: "",
    teamBScore: "",
    matchNumber: "",
  });

  const { mutate: logMatch, isPending } = api.points.logMatch.useMutation({
    onSuccess: () => {
      toast.success("Match logged.");
      setForm({
        teamAId: "",
        teamBId: "",
        teamAScore: "",
        teamBScore: "",
        matchNumber: "",
      });
      void utils.points.getMatchesByEvent.invalidate({ eventId });
      void utils.points.getByEvent.invalidate({ eventId });
    },
    onError: (err) => toast.error(err.message),
  });

  const isValid =
    form.teamAId &&
    form.teamBId &&
    form.teamAScore !== "" &&
    form.teamBScore !== "" &&
    form.matchNumber;

  return (
    <div className="rounded border border-white/[0.06] bg-[#111] p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
        Log Match
      </p>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.teamAId}
            onChange={(e) => setForm({ ...form, teamAId: e.target.value })}
            className="rounded border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-white/60 focus:border-[#39FF14]/30 focus:outline-none"
          >
            <option value="">Team A</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={form.teamBId}
            onChange={(e) => setForm({ ...form, teamBId: e.target.value })}
            className="rounded border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-white/60 focus:border-[#39FF14]/30 focus:outline-none"
          >
            <option value="">Team B</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            type="number"
            min={0}
            placeholder="Score A"
            value={form.teamAScore}
            onChange={(e) => setForm({ ...form, teamAScore: e.target.value })}
            className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
          />
          <Input
            type="number"
            min={0}
            placeholder="Score B"
            value={form.teamBScore}
            onChange={(e) => setForm({ ...form, teamBScore: e.target.value })}
            className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
          />
          <Input
            type="number"
            min={1}
            placeholder="Match #"
            value={form.matchNumber}
            onChange={(e) => setForm({ ...form, matchNumber: e.target.value })}
            className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
          />
        </div>

        <Button
          onClick={() =>
            logMatch({
              eventId,
              teamAId: form.teamAId,
              teamBId: form.teamBId,
              teamAScore: Number(form.teamAScore),
              teamBScore: Number(form.teamBScore),
              matchNumber: Number(form.matchNumber),
            })
          }
          disabled={!isValid || isPending}
          className="w-full border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Swords className="mr-2 h-3.5 w-3.5" />
          )}
          Log Result
        </Button>
      </div>
    </div>
  );
}