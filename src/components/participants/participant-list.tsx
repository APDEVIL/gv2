"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/shared/data-table";
import { ParticipantStatusBadge } from "@/components/participants/participant-status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

type Participant = {
  userId: string;
  user: { id: string; name: string; email: string };
  status: string;
  respondedAt: Date | null;
};

const columns: ColumnDef<Participant>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
        {row.original.user.name}
      </span>
    ),
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => (
      <span className="font-mono text-[11px] tracking-wider text-white/30">
        {row.original.user.email}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <ParticipantStatusBadge status={row.original.status} />
    ),
  },
  {
    accessorKey: "respondedAt",
    header: "Responded",
    cell: ({ row }) =>
      row.original.respondedAt ? (
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/25">
          {format(new Date(row.original.respondedAt), "MMM dd, yyyy")}
        </span>
      ) : (
        <span className="font-mono text-[10px] text-white/15">—</span>
      ),
  },
];

interface ParticipantListProps {
  eventId: string;
}

export function ParticipantList({ eventId }: ParticipantListProps) {
  const { data: participants, isLoading } =
    api.participant.getByEvent.useQuery({ eventId });

  if (isLoading) return <LoadingSkeleton rows={5} rowClassName="h-12" />;

  if (!participants || participants.length === 0) {
    return <EmptyState message="No participants yet" />;
  }

  return (
    <DataTable
      columns={columns}
      data={participants}
    />
  );
}