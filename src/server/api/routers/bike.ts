import { z } from "zod";
import { eq, and, gte, lte, like, sql, ne } from "drizzle-orm";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { bikes } from "~/server/db/schema";

export const bikeRouter = createTRPCRouter({
  // ─── Public: get all bikes with optional filters ──────────────────
  getAll: publicProcedure
    .input(
      z
        .object({
          type: z.enum(["ROAD", "MOUNTAIN", "ELECTRIC"]).optional(),
          status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]).optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input?.type) {
        conditions.push(eq(bikes.type, input.type));
      }
      if (input?.status) {
        conditions.push(eq(bikes.status, input.status));
      }
      if (input?.minPrice) {
        conditions.push(gte(bikes.pricePerHour, input.minPrice));
      }
      if (input?.maxPrice) {
        conditions.push(lte(bikes.pricePerHour, input.maxPrice));
      }
      if (input?.search) {
        conditions.push(like(bikes.name, `%${input.search}%`));
      }

      const result = await ctx.db.query.bikes.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: (bikes, { desc }) => [desc(bikes.createdAt)],
      });

      return result;
    }),

  // ─── Public: get a single bike by ID ──────────────────────────────
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const bike = await ctx.db.query.bikes.findFirst({
        where: eq(bikes.id, input.id),
      });
      return bike ?? null;
    }),

  // ─── Public: get featured bikes (available, limit 6) ──────────────
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.bikes.findMany({
      where: eq(bikes.status, "AVAILABLE"),
      limit: 6,
      orderBy: (bikes, { desc }) => [desc(bikes.createdAt)],
    });
  }),

  // ─── Public: get stats for home page ──────────────────────────────
  getStats: publicProcedure.query(async ({ ctx }) => {
    const allBikes = await ctx.db.query.bikes.findMany();
    const total = allBikes.length;
    const available = allBikes.filter((b) => b.status === "AVAILABLE").length;
    const types = new Set(allBikes.map((b) => b.type)).size;
    return { total, available, types };
  }),

  // ─── Admin: create a bike ─────────────────────────────────────────
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(["ROAD", "MOUNTAIN", "ELECTRIC"]),
        imageUrl: z.string().optional(),
        pricePerHour: z.number().min(0),
        pricePerDay: z.number().min(0),
        status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]).default("AVAILABLE"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [bike] = await ctx.db.insert(bikes).values(input).returning();
      return bike;
    }),

  // ─── Admin: update a bike ─────────────────────────────────────────
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        type: z.enum(["ROAD", "MOUNTAIN", "ELECTRIC"]).optional(),
        imageUrl: z.string().optional(),
        pricePerHour: z.number().min(0).optional(),
        pricePerDay: z.number().min(0).optional(),
        status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [bike] = await ctx.db
        .update(bikes)
        .set(data)
        .where(eq(bikes.id, id))
        .returning();
      return bike;
    }),

  // ─── Admin: delete a bike ─────────────────────────────────────────
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(bikes).where(eq(bikes.id, input.id));
      return { success: true };
    }),
});
