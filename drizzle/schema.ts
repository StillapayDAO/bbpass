import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Events ──────────────────────────────────────────────────────────────────

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  organizerId: int("organizerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).default("general").notNull(),
  imageUrl: text("imageUrl"),
  venue: varchar("venue", { length: 255 }),
  address: text("address"),
  city: varchar("city", { length: 128 }),
  country: varchar("country", { length: 128 }),
  startDate: bigint("startDate", { mode: "number" }).notNull(), // UTC ms
  endDate: bigint("endDate", { mode: "number" }),
  ticketPrice: decimal("ticketPrice", { precision: 10, scale: 2 }).notNull().default("0.00"),
  capacity: int("capacity").notNull().default(100),
  ticketsSold: int("ticketsSold").notNull().default(0),
  status: mysqlEnum("status", ["draft", "published", "cancelled", "completed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(),
  quantity: int("quantity").notNull().default(1),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "refunded"]).default("pending").notNull(),
  // Billing info (stored for receipt purposes — NOT real card data)
  billingName: varchar("billingName", { length: 255 }),
  billingEmail: varchar("billingEmail", { length: 320 }),
  // Last 4 digits only for display
  cardLast4: varchar("cardLast4", { length: 4 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─── Tickets ─────────────────────────────────────────────────────────────────

export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  eventId: int("eventId").notNull(),
  userId: int("userId").notNull(),
  ticketCode: varchar("ticketCode", { length: 32 }).notNull().unique(),
  status: mysqlEnum("status", ["valid", "used", "cancelled"]).default("valid").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;
