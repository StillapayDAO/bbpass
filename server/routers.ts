import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createEvent,
  createOrder,
  deleteEvent,
  getEventById,
  getEventSalesStats,
  getOrderById,
  getOrdersByEvent,
  getOrdersByUser,
  getTicketsByOrder,
  getTicketsByUser,
  listEventsByOrganizer,
  listPublishedEvents,
  updateEvent,
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Events (public) ────────────────────────────────────────────────────────
  events: router({
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
          category: z.string().optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return listPublishedEvents(input ?? {});
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const event = await getEventById(input.id);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        return event;
      }),

    // ─── Organizer procedures ─────────────────────────────────────────────────
    myEvents: protectedProcedure.query(async ({ ctx }) => {
      return listEventsByOrganizer(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          category: z.string().default("general"),
          imageUrl: z.string().url().optional().or(z.literal("")),
          venue: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
          startDate: z.number(), // UTC ms
          endDate: z.number().optional(),
          ticketPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
          capacity: z.number().min(1),
          status: z.enum(["draft", "published"]).default("draft"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const id = await createEvent({
          organizerId: ctx.user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          imageUrl: input.imageUrl || null,
          venue: input.venue,
          address: input.address,
          city: input.city,
          country: input.country,
          startDate: input.startDate,
          endDate: input.endDate,
          ticketPrice: input.ticketPrice,
          capacity: input.capacity,
          status: input.status,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          imageUrl: z.string().url().optional().or(z.literal("")),
          venue: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
          startDate: z.number().optional(),
          endDate: z.number().optional(),
          ticketPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
          capacity: z.number().min(1).optional(),
          status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await updateEvent(id, ctx.user.id, data as any);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteEvent(input.id, ctx.user.id);
        return { success: true };
      }),

    salesStats: protectedProcedure.query(async ({ ctx }) => {
      return getEventSalesStats(ctx.user.id);
    }),

    attendees: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getOrdersByEvent(input.eventId, ctx.user.id);
      }),
  }),

  // ─── Orders ─────────────────────────────────────────────────────────────────
  orders: router({
    purchase: protectedProcedure
      .input(
        z.object({
          eventId: z.number(),
          quantity: z.number().min(1).max(10),
          billingName: z.string().min(1),
          billingEmail: z.string().email(),
          // Card details — last 4 only stored
          cardLast4: z.string().length(4),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const event = await getEventById(input.eventId);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        if (event.status !== "published") throw new TRPCError({ code: "BAD_REQUEST", message: "Event is not available for purchase" });
        const available = event.capacity - event.ticketsSold;
        if (available < input.quantity) throw new TRPCError({ code: "BAD_REQUEST", message: `Only ${available} tickets remaining` });

        const unitPrice = String(event.ticketPrice);
        const totalAmount = (parseFloat(unitPrice) * input.quantity).toFixed(2);

        const orderId = await createOrder({
          userId: ctx.user.id,
          eventId: input.eventId,
          quantity: input.quantity,
          unitPrice,
          totalAmount,
          billingName: input.billingName,
          billingEmail: input.billingEmail,
          cardLast4: input.cardLast4,
        });

        return { orderId };
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await getOrderById(input.id);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        if (order.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        const event = await getEventById(order.eventId);
        const orderTickets = await getTicketsByOrder(order.id);
        return { order, event, tickets: orderTickets };
      }),

    myOrders: protectedProcedure.query(async ({ ctx }) => {
      return getOrdersByUser(ctx.user.id);
    }),
  }),

  // ─── Tickets ────────────────────────────────────────────────────────────────
  tickets: router({
    myTickets: protectedProcedure.query(async ({ ctx }) => {
      return getTicketsByUser(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
