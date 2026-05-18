import { relations } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * Multi-project schema prefix for Drizzle ORM.
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `20260518v1_${name}`);

// ─── Enums ───────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);
export const bikeTypeEnum = pgEnum("bike_type", [
  "ROAD",
  "MOUNTAIN",
  "ELECTRIC",
]);
export const bikeStatusEnum = pgEnum("bike_status", [
  "AVAILABLE",
  "RENTED",
  "MAINTENANCE",
]);
export const rentalStatusEnum = pgEnum("rental_status", [
  "PENDING",
  "ACTIVE",
  "RETURNED",
  "OVERDUE",
  "CANCELLED",
]);

// ─── Users ───────────────────────────────────────────────────────────
export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull().unique(),
  password: d.varchar({ length: 255 }), // hashed password for credentials login
  role: userRoleEnum().default("USER").notNull(),
  emailVerified: d
    .timestamp({ mode: "date", withTimezone: true })
    .$defaultFn(() => /* @__PURE__ */ new Date()),
  image: d.varchar({ length: 255 }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  rentals: many(rentals),
}));

// ─── Bikes ───────────────────────────────────────────────────────────
export const bikes = createTable(
  "bike",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    type: bikeTypeEnum().notNull(),
    imageUrl: d.varchar({ length: 1024 }),
    pricePerHour: d.integer().notNull(), // in TWD
    pricePerDay: d.integer().notNull(), // in TWD
    status: bikeStatusEnum().default("AVAILABLE").notNull(),
    description: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("bike_type_idx").on(t.type),
    index("bike_status_idx").on(t.status),
  ],
);

export const bikesRelations = relations(bikes, ({ many }) => ({
  rentals: many(rentals),
}));

// ─── Rentals ─────────────────────────────────────────────────────────
export const rentals = createTable(
  "rental",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    bikeId: d
      .integer()
      .notNull()
      .references(() => bikes.id),
    startTime: d.timestamp({ withTimezone: true }).notNull(),
    endTime: d.timestamp({ withTimezone: true }).notNull(),
    totalPrice: d.integer().notNull(), // in TWD
    status: rentalStatusEnum().default("PENDING").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("rental_user_idx").on(t.userId),
    index("rental_bike_idx").on(t.bikeId),
    index("rental_status_idx").on(t.status),
  ],
);

export const rentalsRelations = relations(rentals, ({ one }) => ({
  user: one(users, { fields: [rentals.userId], references: [users.id] }),
  bike: one(bikes, { fields: [rentals.bikeId], references: [bikes.id] }),
}));

// ─── NextAuth Adapter Tables (preserved) ────────────────────────────
export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
