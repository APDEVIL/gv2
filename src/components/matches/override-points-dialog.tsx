"use client";

import { useState } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Team {
  id: string;
  name: string;
}

interface OverridePointsDialogProps {
  eventId: string;
  teams: Team[];
}

export function OverridePointsDialog({
  eventId,
  teams,
}: OverridePointsDialogProps) {
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [points, setPoints] = useState("");
  const utils = api.useUtils();

  const { mutate: overridePoints, isPending } =
    api.points.overridePoints.useMutation({
      onSuccess: () => {
        toast.success("Points overridden.");
        setTeamId("");
        setPoints("");
        setOpen(false);
        void utils.points.getByEvent.invalidate({ eventId });
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border border-amber-400/20 bg-amber-400/5 font-mono text-[10px] uppercase tracking-widest text-amber-400/70 hover:bg-amber-400/10">
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Override Points
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/[0.08] bg-[#111]">
        <DialogHeader>
          <DialogTitle className="font-mono text-[12px] uppercase tracking-widest text-white/70">
            Override Points
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded border border-amber-400/10 bg-amber-400/5 px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/60">
              This will override auto-calculated points for the selected team.
            </p>
          </div>

          <div className="space-y-3">
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full rounded border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-white/60 focus:border-[#39FF14]/30 focus:outline-none"
            >
              <option value="">Select team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <Input
              type="number"
              min={0}
              placeholder="New points value"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="border-white/[0.08] bg-white/[0.03] font-mono text-[12px] text-white/80 placeholder:text-white/20 focus-visible:border-[#39FF14]/30 focus-visible:ring-0"
            />
          </div>

          <div className="flex gap-2 border-t border-white/[0.04] pt-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-white/[0.08] font-mono text-[10px] uppercase tracking-widest text-white/40"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                overridePoints({
                  eventId,
                  teamId,
                  overridePoints: Number(points),
                })
              }
              disabled={!teamId || points === "" || isPending}
              className="flex-1 border border-amber-400/20 bg-amber-400/5 font-mono text-[10px] uppercase tracking-widest text-amber-400/70 hover:bg-amber-400/10 disabled:opacity-40"
            >
              {isPending && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Override
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}