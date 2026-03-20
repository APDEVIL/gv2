"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AddMemberDialogProps {
  teamId: string;
  eventId: string;
  existingMemberIds: string[];
  acceptedParticipants: {
    userId: string;
    user: { name: string; email: string };
  }[];
}

export function AddMemberDialog({
  teamId,
  eventId,
  existingMemberIds,
  acceptedParticipants,
}: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const utils = api.useUtils();

  const { mutate: addMember, isPending } = api.team.addMember.useMutation({
    onSuccess: () => {
      toast.success("Member added.");
      setSelectedUserId("");
      setOpen(false);
      void utils.team.getByEvent.invalidate({ eventId });
    },
    onError: (err) => toast.error(err.message),
  });

  const available = acceptedParticipants.filter(
    (p) => !existingMemberIds.includes(p.userId),
  );

  if (available.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="mt-2 w-full border border-dashed border-white/[0.08] bg-transparent font-mono text-[10px] uppercase tracking-widest text-white/25 hover:border-[#39FF14]/20 hover:text-[#39FF14]/60"
        >
          <Plus className="mr-1.5 h-3 w-3" />
          Add Member
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/[0.08] bg-[#111]">
        <DialogHeader>
          <DialogTitle className="font-mono text-[12px] uppercase tracking-widest text-white/70">
            Add Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="max-h-60 space-y-1.5 overflow-y-auto">
            {available.map((p) => (
              <button
                key={p.userId}
                onClick={() => setSelectedUserId(p.userId)}
                className={cn(
                  "flex w-full items-center gap-3 rounded border px-3 py-2.5 text-left transition-colors",
                  selectedUserId === p.userId
                    ? "border-[#39FF14]/20 bg-[#39FF14]/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]",
                )}
              >
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-wider",
                      selectedUserId === p.userId
                        ? "text-[#39FF14]"
                        : "text-white/60",
                    )}
                  >
                    {p.user.name}
                  </span>
                  <span className="font-mono text-[9px] tracking-wider text-white/20">
                    {p.user.email}
                  </span>
                </div>
              </button>
            ))}
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
              onClick={() => addMember({ teamId, userId: selectedUserId })}
              disabled={!selectedUserId || isPending}
              className="flex-1 border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"
            >
              {isPending && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}