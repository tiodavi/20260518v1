import { bikeRouter } from "~/server/api/routers/bike";
import { rentalRouter } from "~/server/api/routers/rental";
import { authRouter, userRouter } from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * Primary router for the Bicycle Rental System API.
 */
export const appRouter = createTRPCRouter({
  bike: bikeRouter,
  rental: rentalRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 */
export const createCaller = createCallerFactory(appRouter);
