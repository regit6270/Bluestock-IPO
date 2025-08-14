import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIpoSchema, insertUserSchema } from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bluestock-secret-key";

// Middleware for JWT authentication
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.validateUserCredentials(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  // IPO routes
  app.get("/api/ipos", async (req, res) => {
    try {
      const { search, sector, status } = req.query;
      
      let ipos;
      if (search) {
        ipos = await storage.searchIpos(search as string);
      } else if (sector || status) {
        ipos = await storage.filterIpos({
          sector: sector as string,
          status: status as string
        });
      } else {
        ipos = await storage.getAllIpos();
      }
      
      res.json(ipos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IPOs" });
    }
  });

  app.get("/api/ipos/:id", async (req, res) => {
    try {
      const ipo = await storage.getIpoById(req.params.id);
      if (!ipo) {
        return res.status(404).json({ message: "IPO not found" });
      }
      res.json(ipo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IPO" });
    }
  });

  app.post("/api/ipos", authenticateToken, async (req, res) => {
    try {
      // Only admin users can create IPOs
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const ipoData = insertIpoSchema.parse(req.body);
      const ipo = await storage.createIpo(ipoData);
      res.status(201).json(ipo);
    } catch (error) {
      res.status(400).json({ message: "Failed to create IPO" });
    }
  });

  app.put("/api/ipos/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const ipoData = insertIpoSchema.partial().parse(req.body);
      const ipo = await storage.updateIpo(req.params.id, ipoData);
      
      if (!ipo) {
        return res.status(404).json({ message: "IPO not found" });
      }
      
      res.json(ipo);
    } catch (error) {
      res.status(400).json({ message: "Failed to update IPO" });
    }
  });

  app.delete("/api/ipos/:id", authenticateToken, async (req, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const deleted = await storage.deleteIpo(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "IPO not found" });
      }
      
      res.json({ message: "IPO deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete IPO" });
    }
  });

  // Dashboard stats route
  app.get("/api/admin/stats", authenticateToken, async (req, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const allIpos = await storage.getAllIpos();
      const stats = {
        totalIpos: allIpos.length,
        upcomingIpos: allIpos.filter(ipo => ipo.status === 'upcoming').length,
        openIpos: allIpos.filter(ipo => ipo.status === 'open').length,
        closedIpos: allIpos.filter(ipo => ipo.status === 'closed').length,
        listedIpos: allIpos.filter(ipo => ipo.status === 'listed').length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
