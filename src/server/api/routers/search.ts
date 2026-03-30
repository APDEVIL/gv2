import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, ilike, or, and, not, inArray, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, managerProcedure } from "@/server/api/trpc";
import { events, participants, users } from "@/server/db/schema";

export const searchRouter = createTRPCRouter({
  events: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query cannot be empty."),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pattern = `%${input.query}%`;

      const matchedEvents = await ctx.db
        .select({
          id: events.id,
          title: events.title,
          gameName: events.gameName,
          description: events.description,
          status: events.status,
          startTime: events.startTime,
          endTime: events.endTime,
          registrationDeadline: events.registrationDeadline,
          maxTeams: events.maxTeams,
          teamSize: events.teamSize,
          prize: events.prize,
          createdAt: events.createdAt,
          managerId: events.managerId,
          managerName: users.name,
        })
        .from(events)
        .innerJoin(users, eq(events.managerId, users.id))
        .where(or(ilike(events.title, pattern), ilike(events.gameName, pattern)))
        .orderBy(desc(events.createdAt));

      if (matchedEvents.length === 0) {
        return {
          results: [],
          message: `No events found matching "${input.query}".`,
        };
      }

      return { results: matchedEvents, message: null };
    }),

  // Searches existing participants of an event (for manager to view/filter)
  usersInEvent: managerProcedure
    .input(
      z.object({
        eventId: z.string(),
        query: z.string().min(1, "Search query cannot be empty."),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId))
        .then((rows) => rows[0]);

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }

      if (event.managerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the manager of this event.",
        });
      }

      const eventParticipants = await ctx.db
        .select({
          userId: users.id,
          name: users.name,
          email: users.email,
          status: participants.status,
          respondedAt: participants.respondedAt,
        })
        .from(participants)
        .innerJoin(users, eq(participants.userId, users.id))
        .where(eq(participants.eventId, input.eventId));

      const q = input.query.toLowerCase();
      const filtered = eventParticipants.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q),
      );

      if (filtered.length === 0) {
        return {
          results: [],
          message: `No participants found matching "${input.query}".`,
        };
      }

      return { results: filtered, message: null };
    }),

  // Searches ALL users to invite — excludes already-added participants
  usersForInvite: managerProcedure
    .input(
      z.object({
        eventId: z.string(),
        query: z.string().min(1, "Search query cannot be empty."),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId))
        .then((rows) => rows[0]);

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }

      if (event.managerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the manager of this event.",
        });
      }

      // Get IDs already in this event (any status)
      const alreadyIn = await ctx.db
        .select({ userId: participants.userId })
        .from(participants)
        .where(eq(participants.eventId, input.eventId));

      const excludeIds = alreadyIn.map((p) => p.userId);

      const pattern = `%${input.query}%`;

      const matchedUsers = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        })
        .from(users)
        .where(
          and(
            // Only show participants, never managers
            eq(users.role, "participant"),
            // Match name or email
            or(
              ilike(users.name, pattern),
              ilike(users.email, pattern),
            ),
            // Exclude already-added users (only if list is non-empty)
            excludeIds.length > 0
              ? not(inArray(users.id, excludeIds))
              : undefined,
          ),
        )
        .limit(10);

      if (matchedUsers.length === 0) {
        return {
          results: [],
          message: `No users found matching "${input.query}".`,
        };
      }

      return { results: matchedUsers, message: null };
    }),
});