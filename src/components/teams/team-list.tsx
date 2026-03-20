"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { TeamCard } from "@/components/teams/team-card";
import { TeamForm } from "@/components/teams/team-form";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading-skeleton";

interface TeamListProps {
  eventId: string;
  teamSize: number;
}

export function TeamList({ eventId, teamSize }: TeamListProps) {
  const utils = api.useUtils();
  const [removeMember, setRemoveMember] = useState<{
    teamId: string;
    userId: string;
    name: string;
  } | null>(null);

  const { data: teams, isLoading } = api.team.getByEvent.useQuery({ eventId });
  const { data: participants } = api.participant.getByEvent.useQuery({ eventId });

  const { mutate: removeMemberMutate, isPending: isRemoving } =
    api.team.removeMember.useMutation({
      onSuccess: () => {
        toast.success("Member removed.");
        setRemoveMember(null);
        void utils.team.getByEvent.invalidate({ eventId });
      },
      onError: (err) => toast.error(err.message),
    });

  const acceptedParticipants =
    participants?.filter((p) => p.status === "accepted") ?? [];

  return (
    <div>
      <PageHeader
        title="Teams"
        subtitle={`${teams?.length ?? 0} teams`}
      />

      <TeamForm eventId={eventId} acceptedParticipants={acceptedParticipants} />

      <div className="mt-5">
        {isLoading ? (
          <CardSkeleton count={3} />
        ) : teams?.length === 0 ? (
          <EmptyState message="No teams yet" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {teams?.map((team, i) => (
              <TeamCard
                key={team.id}
                team={team}
                eventId={eventId}
                teamSize={teamSize}
                acceptedParticipants={acceptedParticipants}
                onRemoveMember={(teamId, userId, name) =>
                  setRemoveMember({ teamId, userId, name })
                }
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!removeMember}
        onOpenChange={(open) => !open && setRemoveMember(null)}
        title="Remove Member"
        description={`Remove ${removeMember?.name} from the team?`}
        confirmLabel="Remove"
        isLoading={isRemoving}
        onConfirm={() =>
          removeMember &&
          removeMemberMutate({
            teamId: removeMember.teamId,
            userId: removeMember.userId,
          })
        }
        variant="destructive"
      />
    </div>
  );
}