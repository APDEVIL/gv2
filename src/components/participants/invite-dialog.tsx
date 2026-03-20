"use client";

import { useState } from "react";
import { UserPlus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ParticipantStatusBadge } from "@/components/participants/participant-status-badge";
import { cn } from "@/lib/utils";

interface InviteDialogProps {
  eventId: string;
}

export function InviteDialog({ eventId }: InviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const utils = api.useUtils();

  const debouncedQuery = useDebounce(query, 300);

  const { data: searchResults, isLoading: isSearching } =
    api.search.usersInEvent.useQuery(
      { eventId, query: debouncedQuery },
      { enabled: debouncedQuery.length >= 2 },
    );

  const { mutate: invite, isPending: isInviting } =
    api.participant.invite.useMutation({
      onSuccess: (data) => {
        toast.success(data.message);
        setSelectedIds([]);
        setQuery("");
        setOpen(false);
        void utils.participant.getByEvent.invalidate({ eventId });
      },
      onError: (err) => toast.error(err.message),
    });

  const toggleSelect = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20">
          <UserPlus className="h-3.5 w-3.5" />
          Invite
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/[0.08] bg-[#111]">
        <DialogHeader>
          <DialogTitle className="font-mono text-[12px] uppercase tracking-widest text-white/70">
            Invite Participants
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2 rounded border border-white/[0.08] bg-white/[0.03] px-3 py-2">
            <Search className="h-3.5 w-3.5 flex-shrink-0 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-mono text-[12px] tracking-wider text-white/70 placeholder:text-white/20 focus:outline-none"
            />
          </div>

          {/* Results */}
          <div className="max-h-60 space-y-1.5 overflow-y-auto">
            {isSearching ? (
              <p className="py-4 text-center font-mono text-[11px] uppercase tracking-widest text-white/20">
                Searching...
              </p>
            ) : debouncedQuery.length < 2 ? (
              <p className="py-4 text-center font-mono text-[11px] uppercase tracking-widest text-white/20">
                Type at least 2 characters
              </p>
            ) : searchResults?.results.length === 0 ? (
              <p className="py-4 text-center font-mono text-[11px] uppercase tracking-widest text-white/20">
                No users found
              </p>
            ) : (
              searchResults?.results.map((user) => {
                const isSelected = selectedIds.includes(user.userId);
                return (
                  <button
                    key={user.userId}
                    onClick={() => toggleSelect(user.userId)}
                    className={cn(
                      "flex w-full items-center justify-between rounded px-3 py-2.5 transition-colors",
                      isSelected
                        ? "bg-[#39FF14]/10 border border-[#39FF14]/20"
                        : "bg-white/[0.03] border border-transparent hover:bg-white/[0.05]",
                    )}
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
                        {user.name}
                      </span>
                      <span className="font-mono text-[10px] tracking-wider text-white/25">
                        {user.email}
                      </span>
                    </div>
                    {user.status ? (
                      <ParticipantStatusBadge status={user.status} />
                    ) : isSelected ? (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#39FF14]">
                        Selected
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-white/[0.04] pt-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/25">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-white/[0.08] font-mono text-[10px] uppercase tracking-widest text-white/40"
              >
                Cancel
              </Button>
              <Button
                onClick={() => invite({ eventId, userIds: selectedIds })}
                disabled={selectedIds.length === 0 || isInviting}
                className="border border-[#39FF14]/30 bg-[#39FF14]/10 font-mono text-[10px] uppercase tracking-widest text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"
              >
                {isInviting && (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                )}
                Send Invites
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}