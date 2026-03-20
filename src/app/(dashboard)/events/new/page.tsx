"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { EventForm } from "@/components/events/event-form";
import { PageHeader } from "@/components/shared/page-header";
import { type CreateEventInput } from "@/lib/validators";

export default function NewEventPage() {
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate, isPending } = api.event.create.useMutation({
    onSuccess: (event) => {
      toast.success("Event created successfully.");
      void utils.event.getAll.invalidate();
      router.push(`/events/${event.id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div>
      <PageHeader
        title="Create Event"
        subtitle="Set up a new gaming tournament"
      />
      <div className="max-w-2xl">
        <div className="rounded border border-white/[0.06] bg-[#111] p-6">
          <EventForm
            onSubmit={(data: CreateEventInput) => mutate(data)}
            isLoading={isPending}
            submitLabel="Create Event"
          />
        </div>
      </div>
    </div>
  );
}