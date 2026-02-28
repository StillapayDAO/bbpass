import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type AuthUser = NonNullable<TrpcContext["user"]>;

function makeCtx(overrides?: Partial<TrpcContext>): TrpcContext {
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
  const user: AuthUser = {
    id: 1,
    openId: "test-user-openid",
    email: "test@bbpass.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
    ...overrides,
  };
}

function makeGuestCtx(): TrpcContext {
  return makeCtx({ user: null });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns the authenticated user", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toMatchObject({ id: 1, email: "test@bbpass.com" });
  });

  it("returns null for unauthenticated users", async () => {
    const ctx = makeGuestCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("auth.logout", () => {
  it("clears the session cookie and returns success", async () => {
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const ctx = makeCtx({
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1, httpOnly: true });
  });
});

// ─── Events (public) ─────────────────────────────────────────────────────────

describe("events.list", () => {
  it("returns an array (may be empty without DB)", async () => {
    const ctx = makeGuestCtx();
    const caller = appRouter.createCaller(ctx);
    // Without DB the helper returns []
    const result = await caller.events.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts search and category filters", async () => {
    const ctx = makeGuestCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.events.list({ search: "concert", category: "music" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("events.getById", () => {
  it("throws NOT_FOUND for a non-existent event", async () => {
    const ctx = makeGuestCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.events.getById({ id: 999999 })).rejects.toThrow("Event not found");
  });
});

// ─── Protected procedures ─────────────────────────────────────────────────────

describe("events.myEvents", () => {
  it("returns an array for authenticated users", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.events.myEvents();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("events.create (input validation)", () => {
  it("rejects invalid ticketPrice format", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.events.create({
        title: "Test Event",
        startDate: Date.now() + 86400000,
        ticketPrice: "not-a-price",
        capacity: 50,
      })
    ).rejects.toThrow();
  });

  it("rejects capacity below 1", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.events.create({
        title: "Test Event",
        startDate: Date.now() + 86400000,
        ticketPrice: "10.00",
        capacity: 0,
      })
    ).rejects.toThrow();
  });
});

// ─── Orders ──────────────────────────────────────────────────────────────────

describe("orders.purchase (input validation)", () => {
  it("rejects quantity above 10", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.orders.purchase({
        eventId: 1,
        quantity: 11,
        billingName: "John",
        billingEmail: "john@test.com",
        cardLast4: "4242",
      })
    ).rejects.toThrow();
  });

  it("rejects invalid email", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.orders.purchase({
        eventId: 1,
        quantity: 1,
        billingName: "John",
        billingEmail: "not-an-email",
        cardLast4: "4242",
      })
    ).rejects.toThrow();
  });

  it("throws NOT_FOUND for non-existent event", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.orders.purchase({
        eventId: 999999,
        quantity: 1,
        billingName: "John",
        billingEmail: "john@test.com",
        cardLast4: "4242",
      })
    ).rejects.toThrow("Event not found");
  });
});

describe("orders.myOrders", () => {
  it("returns an array for authenticated users", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.orders.myOrders();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Tickets ─────────────────────────────────────────────────────────────────

describe("tickets.myTickets", () => {
  it("returns an array for authenticated users", async () => {
    const ctx = makeCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tickets.myTickets();
    expect(Array.isArray(result)).toBe(true);
  });
});
