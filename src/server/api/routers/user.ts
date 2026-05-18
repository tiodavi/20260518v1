import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const authRouter = createTRPCRouter({
  // ─── Public: register a new user ──────────────────────────────────
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existing = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existing) {
        throw new Error("此 Email 已經被註冊");
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const [user] = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: "USER",
        })
        .returning();

      return { success: true, userId: user?.id };
    }),
});

export const userRouter = createTRPCRouter({
  // ─── Admin: get all users ─────────────────────────────────────────
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }),

  // ─── Admin: update user role ──────────────────────────────────────
  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(["USER", "ADMIN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.id))
        .returning();
      return updated;
    }),
});
