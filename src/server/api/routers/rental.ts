import { z } from "zod";
import { eq, and, or, lte, gte } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { rentals, bikes } from "~/server/db/schema";

export const rentalRouter = createTRPCRouter({
  // ─── User: create a rental booking ────────────────────────────────
  create: protectedProcedure
    .input(
      z.object({
        bikeId: z.number(),
        startTime: z.string().transform((s) => new Date(s)),
        endTime: z.string().transform((s) => new Date(s)),
        totalPrice: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Verify the bike exists and is AVAILABLE
      const bike = await ctx.db.query.bikes.findFirst({
        where: eq(bikes.id, input.bikeId),
      });

      if (!bike) {
        throw new Error("Bike not found");
      }

      if (bike.status !== "AVAILABLE") {
        throw new Error("This bike is not available for rental");
      }

      // 2. Check for conflicting rentals (overlapping time windows)
      const conflicting = await ctx.db.query.rentals.findFirst({
        where: and(
          eq(rentals.bikeId, input.bikeId),
          or(
            eq(rentals.status, "PENDING"),
            eq(rentals.status, "ACTIVE"),
          ),
          // Overlapping: existing.start < new.end AND existing.end > new.start
          lte(rentals.startTime, input.endTime),
          gte(rentals.endTime, input.startTime),
        ),
      });

      if (conflicting) {
        throw new Error(
          "This bike is already booked for the selected time period",
        );
      }

      // 3. Create the rental
      const [rental] = await ctx.db
        .insert(rentals)
        .values({
          userId: ctx.session.user.id,
          bikeId: input.bikeId,
          startTime: input.startTime,
          endTime: input.endTime,
          totalPrice: input.totalPrice,
          status: "PENDING",
        })
        .returning();

      return rental;
    }),

  // ─── User: get own rentals ────────────────────────────────────────
  getMyRentals: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.rentals.findMany({
      where: eq(rentals.userId, ctx.session.user.id),
      with: {
        bike: true,
      },
      orderBy: (rentals, { desc }) => [desc(rentals.createdAt)],
    });
  }),

  // ─── User: cancel own rental (only if PENDING) ───────────────────
  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const rental = await ctx.db.query.rentals.findFirst({
        where: and(
          eq(rentals.id, input.id),
          eq(rentals.userId, ctx.session.user.id),
        ),
      });

      if (!rental) throw new Error("Rental not found");
      if (rental.status !== "PENDING") {
        throw new Error("Only pending rentals can be cancelled");
      }

      const [updated] = await ctx.db
        .update(rentals)
        .set({ status: "CANCELLED" })
        .where(eq(rentals.id, input.id))
        .returning();

      return updated;
    }),

  // ─── Admin: get all rentals with user + bike info ─────────────────
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.rentals.findMany({
      with: {
        user: true,
        bike: true,
      },
      orderBy: (rentals, { desc }) => [desc(rentals.createdAt)],
    });
  }),

  // ─── Admin: update rental status ──────────────────────────────────
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["PENDING", "ACTIVE", "RETURNED", "OVERDUE", "CANCELLED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(rentals)
        .set({ status: input.status })
        .where(eq(rentals.id, input.id))
        .returning();

      // If returned or cancelled, set bike back to AVAILABLE
      if (
        updated &&
        (input.status === "RETURNED" || input.status === "CANCELLED")
      ) {
        await ctx.db
          .update(bikes)
          .set({ status: "AVAILABLE" })
          .where(eq(bikes.id, updated.bikeId));
      }

      // If active, set bike to RENTED
      if (updated && input.status === "ACTIVE") {
        await ctx.db
          .update(bikes)
          .set({ status: "RENTED" })
          .where(eq(bikes.id, updated.bikeId));
      }

      return updated;
    }),

  // ─── Admin: get dashboard stats ───────────────────────────────────
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const allRentals = await ctx.db.query.rentals.findMany({
      with: { bike: true },
    });

    const allBikes = await ctx.db.query.bikes.findMany();
    const allUsers = await ctx.db.query.users.findMany();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenue = allRentals
      .filter((r) => {
        const created = new Date(r.createdAt);
        return (
          created >= today &&
          (r.status === "ACTIVE" || r.status === "RETURNED")
        );
      })
      .reduce((sum, r) => sum + r.totalPrice, 0);

    const activeRentals = allRentals.filter(
      (r) => r.status === "ACTIVE",
    ).length;
    const rentedBikes = allBikes.filter((b) => b.status === "RENTED").length;
    const availableBikes = allBikes.filter(
      (b) => b.status === "AVAILABLE",
    ).length;
    const maintenanceBikes = allBikes.filter(
      (b) => b.status === "MAINTENANCE",
    ).length;
    const totalRevenue = allRentals
      .filter((r) => r.status === "ACTIVE" || r.status === "RETURNED")
      .reduce((sum, r) => sum + r.totalPrice, 0);

    return {
      todayRevenue,
      totalRevenue,
      activeRentals,
      totalRentals: allRentals.length,
      rentedBikes,
      availableBikes,
      maintenanceBikes,
      totalBikes: allBikes.length,
      totalUsers: allUsers.length,
      bikeHealthRate:
        allBikes.length > 0
          ? Math.round(
              ((allBikes.length - maintenanceBikes) / allBikes.length) * 100,
            )
          : 100,
    };
  }),
});
