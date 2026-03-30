"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { EventForm } from "@/components/events/event-form";
import { PageHeader } from "@/components/shared/page-header";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { type CreateEventInput } from "@/lib/validators";

export default function EditEventPage({
  params,
}: {
  // ✅ FIXED: params is now a Promise
  params: Promise<{ eventId: string }>;
}) {
  // ✅ FIXED: unwrap with use() instead of direct destructure
  const { eventId } = use(params);

  const router = useRouter();
  const utils = api.useUtils();

  const { data: event, isLoading } = api.event.getById.useQuery({ eventId });

  const { mutate, isPending } = api.event.update.useMutation({
    onSuccess: () => {
      toast.success("Event updated successfully.");
      void utils.event.getById.invalidate({ eventId });
      router.push(`/events/${eventId}`);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <DetailSkeleton />;

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
          Event not found
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Event" subtitle={event.title} />
      <div className="max-w-2xl">
        <div className="rounded border border-white/[0.06] bg-[#111] p-6">
          <EventForm
            defaultValues={{
              title: event.title,
              gameName: event.gameName,
              description: event.description ?? undefined,
              prize: event.prize ?? undefined,
              teamSize: event.teamSize,
              maxTeams: event.maxTeams,
              leaderboardCriteria: event.leaderboardCriteria,
              startTime: new Date(event.startTime),
              endTime: new Date(event.endTime),
              registrationDeadline: event.registrationDeadline
                ? new Date(event.registrationDeadline)
                : undefined,
            }}
            onSubmit={(data: CreateEventInput) =>
              mutate({ eventId, ...data })
            }
            isLoading={isPending}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}