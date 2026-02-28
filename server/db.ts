import { and, desc, eq, ilike, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { events, InsertEvent, InsertOrder, InsertUser, orders, tickets, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { nanoid } from "nanoid";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(events).values(data);
  return result[0].insertId;
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedEvents(opts?: {
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(events.status, "published")];
  if (opts?.search) {
    conditions.push(
      or(
        like(events.title, `%${opts.search}%`),
        like(events.city, `%${opts.search}%`),
        like(events.venue, `%${opts.search}%`)
      ) as any
    );
  }
  if (opts?.category && opts.category !== "all") {
    conditions.push(eq(events.category, opts.category));
  }
  return db
    .select()
    .from(events)
    .where(and(...conditions))
    .orderBy(desc(events.startDate))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);
}

export async function listEventsByOrganizer(organizerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(events)
    .where(eq(events.organizerId, organizerId))
    .orderBy(desc(events.createdAt));
}

export async function updateEvent(id: number, organizerId: number, data: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(events).set(data).where(and(eq(events.id, id), eq(events.organizerId, organizerId)));
}

export async function deleteEvent(id: number, organizerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(events).where(and(eq(events.id, id), eq(events.organizerId, organizerId)));
}

// ─── Orders & Tickets ────────────────────────────────────────────────────────

export async function createOrder(data: InsertOrder & { quantity: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Create the order
  const orderResult = await db.insert(orders).values({
    userId: data.userId,
    eventId: data.eventId,
    quantity: data.quantity,
    unitPrice: data.unitPrice,
    totalAmount: data.totalAmount,
    status: "confirmed",
    billingName: data.billingName,
    billingEmail: data.billingEmail,
    cardLast4: data.cardLast4,
  });
  const orderId = orderResult[0].insertId;

  // Create individual tickets
  const ticketRows = Array.from({ length: data.quantity }, () => ({
    orderId,
    eventId: data.eventId,
    userId: data.userId,
    ticketCode: nanoid(16).toUpperCase(),
    status: "valid" as const,
  }));
  await db.insert(tickets).values(ticketRows);

  // Increment ticketsSold
  await db
    .update(events)
    .set({ ticketsSold: sql`${events.ticketsSold} + ${data.quantity}` })
    .where(eq(events.id, data.eventId));

  return orderId;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTicketsByOrder(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tickets).where(eq(tickets.orderId, orderId));
}

export async function getTicketsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      ticket: tickets,
      event: events,
      order: orders,
    })
    .from(tickets)
    .innerJoin(events, eq(tickets.eventId, events.id))
    .innerJoin(orders, eq(tickets.orderId, orders.id))
    .where(eq(tickets.userId, userId))
    .orderBy(desc(tickets.createdAt));
}

export async function getOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      order: orders,
      event: events,
    })
    .from(orders)
    .innerJoin(events, eq(orders.eventId, events.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrdersByEvent(eventId: number, organizerId: number) {
  const db = await getDb();
  if (!db) return [];
  // Verify organizer owns the event
  const event = await getEventById(eventId);
  if (!event || event.organizerId !== organizerId) return [];
  return db
    .select({
      order: orders,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(and(eq(orders.eventId, eventId), eq(orders.status, "confirmed")))
    .orderBy(desc(orders.createdAt));
}

export async function getEventSalesStats(organizerId: number) {
  const db = await getDb();
  if (!db) return [];
  const organizerEvents = await listEventsByOrganizer(organizerId);
  const eventIds = organizerEvents.map((e) => e.id);
  if (eventIds.length === 0) return [];

  const stats = await Promise.all(
    organizerEvents.map(async (event) => {
      const eventOrders = await db!
        .select()
        .from(orders)
        .where(and(eq(orders.eventId, event.id), eq(orders.status, "confirmed")));
      const totalRevenue = eventOrders.reduce((sum, o) => sum + parseFloat(String(o.totalAmount)), 0);
      return {
        event,
        totalOrders: eventOrders.length,
        totalTickets: event.ticketsSold,
        totalRevenue,
      };
    })
  );
  return stats;
}
