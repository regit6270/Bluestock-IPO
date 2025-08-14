import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ipos = pgTable("ipos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  sector: text("sector").notNull(),
  openDate: timestamp("open_date").notNull(),
  closeDate: timestamp("close_date").notNull(),
  minPrice: decimal("min_price", { precision: 10, scale: 2 }).notNull(),
  maxPrice: decimal("max_price", { precision: 10, scale: 2 }).notNull(),
  lotSize: integer("lot_size").notNull(),
  issueSize: decimal("issue_size", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, open, closed, listed
  rhpLink: text("rhp_link"),
  description: text("description"),
  logoInitials: text("logo_initials").notNull(),
  logoColor: text("logo_color").notNull().default("blue"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ipoApplications = pgTable("ipo_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipoId: varchar("ipo_id").notNull().references(() => ipos.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  shares: integer("shares").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertIpoSchema = createInsertSchema(ipos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIpoApplicationSchema = createInsertSchema(ipoApplications).omit({
  id: true,
  appliedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertIpo = z.infer<typeof insertIpoSchema>;
export type Ipo = typeof ipos.$inferSelect;
export type InsertIpoApplication = z.infer<typeof insertIpoApplicationSchema>;
export type IpoApplication = typeof ipoApplications.$inferSelect;
