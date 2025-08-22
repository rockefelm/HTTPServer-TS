import { pgTable, timestamp, varchar, uuid, text, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 })
    .unique()
    .notNull(),
  hashedPwd: varchar("hashed_password", { length: 256})
    .unique()
    .notNull()
    .default("unset"),
  isChirpyRed: boolean("is_chirpy_red")
    .default(false)
    .notNull(),
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text("body")
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade"})
    .notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .references(() => users.id, {onDelete: "cascade"})
    .notNull(),
  expiresAt: timestamp("expires_at")
    .notNull(),
  revokedAt: timestamp("revoked_at")
});

export type NewUser = typeof users.$inferInsert;
export type NewChirp = typeof chirps.$inferInsert;
export type NewToken = typeof refreshTokens.$inferInsert;
export type SecureUser = Omit<NewUser, "is_chirpy_red" | "hashed_password">;