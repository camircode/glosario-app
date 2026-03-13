import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const terms = pgTable("terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  definition: text("definition").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Term = typeof terms.$inferSelect;
export type NewTerm = typeof terms.$inferInsert;