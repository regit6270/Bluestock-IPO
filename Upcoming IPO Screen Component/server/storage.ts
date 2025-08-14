import { type User, type InsertUser, type Ipo, type InsertIpo, type IpoApplication, type InsertIpoApplication } from "@shared/schema";
import { db } from "./db";
import { users, ipos, ipoApplications } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUserCredentials(username: string, password: string): Promise<User | null>;

  // IPO methods
  getAllIpos(): Promise<Ipo[]>;
  getIpoById(id: string): Promise<Ipo | undefined>;
  createIpo(ipo: InsertIpo): Promise<Ipo>;
  updateIpo(id: string, ipo: Partial<InsertIpo>): Promise<Ipo | undefined>;
  deleteIpo(id: string): Promise<boolean>;
  searchIpos(query: string): Promise<Ipo[]>;
  filterIpos(filters: { sector?: string; status?: string; dateRange?: string }): Promise<Ipo[]>;

  // IPO Application methods
  createIpoApplication(application: InsertIpoApplication): Promise<IpoApplication>;
  getUserIpoApplications(userId: string): Promise<IpoApplication[]>;
  getIpoApplications(ipoId: string): Promise<IpoApplication[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async validateUserCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getAllIpos(): Promise<Ipo[]> {
    return await db.select().from(ipos).orderBy(desc(ipos.openDate));
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
    return result.rowCount > 0;
  }

  async searchIpos(query: string): Promise<Ipo[]> {
    const searchQuery = `%${query}%`;
    return await db
      .select()
      .from(ipos)
      .where(
        sql`${ipos.companyName} ILIKE ${searchQuery} OR ${ipos.sector} ILIKE ${searchQuery}`
      )
      .orderBy(desc(ipos.openDate));
  }

  async filterIpos(filters: { sector?: string; status?: string; dateRange?: string }): Promise<Ipo[]> {
    let query = db.select().from(ipos);
    
    const conditions = [];
    
    if (filters.sector) {
      conditions.push(eq(ipos.sector, filters.sector));
    }
    
    if (filters.status) {
      conditions.push(eq(ipos.status, filters.status));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(ipos.openDate));
  }

  async createIpoApplication(application: InsertIpoApplication): Promise<IpoApplication> {
    const [ipoApplication] = await db
      .insert(ipoApplications)
      .values(application)
      .returning();
    return ipoApplication;
  }

  async getUserIpoApplications(userId: string): Promise<IpoApplication[]> {
    return await db
      .select()
      .from(ipoApplications)
      .where(eq(ipoApplications.userId, userId));
  }

  async getIpoApplications(ipoId: string): Promise<IpoApplication[]> {
    return await db
      .select()
      .from(ipoApplications)
      .where(eq(ipoApplications.ipoId, ipoId));
  }
}

export const storage = new DatabaseStorage();
