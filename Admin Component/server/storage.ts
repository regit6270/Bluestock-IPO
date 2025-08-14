import { users, ipos, type User, type InsertUser, type Ipo, type InsertIpo } from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // IPO methods
  getAllIpos(): Promise<Ipo[]>;
  getIpoById(id: string): Promise<Ipo | undefined>;
  createIpo(ipo: InsertIpo): Promise<Ipo>;
  updateIpo(id: string, ipo: Partial<InsertIpo>): Promise<Ipo | undefined>;
  deleteIpo(id: string): Promise<boolean>;
  searchIpos(query: string): Promise<Ipo[]>;
  getIposByStatus(status: string): Promise<Ipo[]>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // IPO methods
  async getAllIpos(): Promise<Ipo[]> {
    return await db.select().from(ipos).orderBy(desc(ipos.createdAt));
  }

  async getIpoById(id: string): Promise<Ipo | undefined> {
    const [ipo] = await db.select().from(ipos).where(eq(ipos.id, id));
    return ipo || undefined;
  }

  async createIpo(insertIpo: InsertIpo): Promise<Ipo> {
    const [ipo] = await db
      .insert(ipos)
      .values(insertIpo)
      .returning();
    return ipo;
  }

  async updateIpo(id: string, updateData: Partial<InsertIpo>): Promise<Ipo | undefined> {
    const [ipo] = await db
      .update(ipos)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(ipos.id, id))
      .returning();
    return ipo || undefined;
  }

  async deleteIpo(id: string): Promise<boolean> {
    const result = await db.delete(ipos).where(eq(ipos.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchIpos(query: string): Promise<Ipo[]> {
    return await db
      .select()
      .from(ipos)
      .where(
        or(
          ilike(ipos.companyName, `%${query}%`),
          ilike(ipos.issueType, `%${query}%`),
          ilike(ipos.status, `%${query}%`)
        )
      )
      .orderBy(desc(ipos.createdAt));
  }

  async getIposByStatus(status: string): Promise<Ipo[]> {
    return await db
      .select()
      .from(ipos)
      .where(eq(ipos.status, status))
      .orderBy(desc(ipos.createdAt));
  }
}

export const storage = new DatabaseStorage();
