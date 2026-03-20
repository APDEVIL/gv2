"use client";

import { toast } from "sonner";
import { CheckCircle, XCircle, LogOut, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

interface RespondButtonsProps {
  eventId: string;
}

export function RespondButtons({ eventId }: RespondButtonsProps) {
  const utils = api.useUtils();

  const { mutate: respond, isPending: isResponding } =
    api.participant.respond.useMutation({
      onSuccess: (_, vars) => {
        toast.success(
          vars.status === "accepted"
            ? "You have joined the event."
            : "Invitation declined.",
        );
        void utils.event.getById.invalidate({ eventId });
      },
      onError: (err) => toast.error(err.message),
    });

  const { mutate: leave, isPending: isLeaving } =
    api.participant.leave.useMutation({
      onSuccess: () => {
        toast.success("You have left the event.");
        void utils.event.getById.invalidate({ eventId });
      },
      onError: (err) => toast.error(err.message),
    });

  const { mutate: removeFromList, isPending: isRemoving } =
    api.participant.removeFromList.useMutation({
      onSuccess: () => {
        toast.success("Removed from your list.");
        void utils.event.getAll.invalidate();
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <div className="rounded border border-white/[0.06] bg-[#111] p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
        Your Response
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => respond({ eventId, status: "accepted" })}
          disabled={isResponding}
          className="border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"
        >
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
          Accept
        </Button>
        <Button
          onClick={() => respond({ eventId, status: "rejected" })}
          disabled={isResponding}
          className="border border-red-500/20 bg-red-500/5 font-mono text-[10px] uppercase tracking-widest text-red-400/70 hover:bg-red-500/10 disabled:opacity-40"
        >
          <XCircle className="mr-1.5 h-3.5 w-3.5" />
          Reject
        </Button>
        <Button
          onClick={() => leave({ eventId })}
          disabled={isLeaving}
          variant="outline"
          className="border-white/[0.08] font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 disabled:opacity-40"
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Leave
        </Button>
        <Button
          onClick={() => removeFromList({ eventId })}
          disabled={isRemoving}
          variant="outline"
          className="border-white/[0.06] font-mono text-[10px] uppercase tracking-widest text-white/20 hover:text-white/40 disabled:opacity-40"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Remove from list
        </Button>
      </div>
    </div>
  );
}