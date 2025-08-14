import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ipos = pgTable("ipos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  companyLogo: text("company_logo"),
  priceBand: text("price_band"),
  openDate: text("open_date"),
  closeDate: text("close_date"),
  issueSize: text("issue_size"),
  issueType: text("issue_type"),
  listingDate: text("listing_date"),
  status: text("status").notNull().default("upcoming"),
  
  // New listed IPO details
  ipoPrice: decimal("ipo_price", { precision: 10, scale: 2 }),
  listingPrice: decimal("listing_price", { precision: 10, scale: 2 }),
  listingGain: text("listing_gain"),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  currentReturn: text("current_return"),
  rhpLink: text("rhp_link"),
  drhpLink: text("drhp_link"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ipoRelations = relations(ipos, ({ one }) => ({
  creator: one(users, {
    fields: [ipos.id],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertIpoSchema = createInsertSchema(ipos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertIpo = z.infer<typeof insertIpoSchema>;
export type Ipo = typeof ipos.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
